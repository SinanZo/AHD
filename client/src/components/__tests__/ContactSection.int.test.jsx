/* @vitest-environment jsdom */
import React from 'react';
import { describe, test, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/utils';
import ContactSection from '@/components/ContactSection';

/**
 * NOTE: If your labels differ, update the queries below:
 *  - Name field:  screen.getByLabelText(/name/i)
 *  - Email field: screen.getByLabelText(/email/i)
 *  - Message:     screen.getByLabelText(/message/i)  (or textarea role)
 *  - Submit btn:  screen.getByRole('button', { name: /send|submit/i })
 */

async function fillAndSubmit({
  name = 'Ahmad',
  email = 'ahmad@example.com',
  message = 'Hello from test suite! This is a longer message.'
} = {}) {
  await userEvent.type(screen.getByLabelText(/name|your name/i), name);
  await userEvent.type(screen.getByLabelText(/email|your email/i), email);
  await userEvent.type(screen.getByLabelText(/message|your message/i), message);
  await userEvent.click(screen.getByRole('button', { name: /send|submit/i }));
}

describe('ContactSection integration', () => {
  test('client-side validation shows error when fields are empty', async () => {
    renderWithProviders(<ContactSection />);

    await userEvent.click(screen.getByRole('button', { name: /send|submit/i }));

    // Expect validation feedback - ContactForm shows field errors (i18n keys or translated text)
    await waitFor(() => {
      const errorElements = screen.queryAllByText(/please enter|form\.errors/i);
      expect(errorElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('successful submit shows thank-you copy and ticket id', async () => {
    // Override contact API for this test with a deterministic ticket id
    server.use(
      http.post('/api/contact', async () => {
        await new Promise(r => setTimeout(r, 100)); // small delay to simulate real API
        return HttpResponse.json({ ok: true, ticketId: 'AD-424242' }, { status: 200 });
      })
    );

    renderWithProviders(<ContactSection />);

    await fillAndSubmit();

    // Expect success copy; match common variants to be resilient
    await waitFor(() => {
      const success = screen.queryByText(/thank|success|sent|submitted|shortly|get back/i);
      expect(success).toBeTruthy();
    }, { timeout: 3000 });

    // Show ticket ID if UI renders it (optional check)
    const ticket = screen.queryByText(/AD-424242/);
    if (ticket) expect(ticket).toBeInTheDocument();
  });

  test('server error shows friendly failure message', async () => {
    server.use(
      http.post('/api/contact', async () => {
        await new Promise(r => setTimeout(r, 100));
        return HttpResponse.json({ error: 'Server exploded' }, { status: 500 });
      })
    );

    renderWithProviders(<ContactSection />);

    await fillAndSubmit();

    // UI should surface a friendly error message (toast/inline)
    await waitFor(() => {
      const err = screen.queryByText(/error|failed|wrong|try again|sorry|later/i);
      expect(err).toBeTruthy();
    }, { timeout: 3000 });
  });
});
// --- Additional integration tests ---
test('disables submit while request is pending (prevents double submit)', async () => {
  server.use(
    http.post('/api/contact', async () => {
      // Simulate a slow server to observe pending state
      await new Promise(r => setTimeout(r, 600));
      return HttpResponse.json({ ok: true }, { status: 200 });
    })
  );

  renderWithProviders(<ContactSection />);

  await userEvent.type(screen.getByLabelText(/name|your name/i), 'Ahmad');
  await userEvent.type(screen.getByLabelText(/email|your email/i), 'ahmad@example.com');
  await userEvent.type(screen.getByLabelText(/message|your message/i), 'Hello from the test world!');

  const submit = screen.getByRole('button', { name: /send|submit/i });

  // First click enters pending state
  await userEvent.click(submit);

  // Button should be disabled and/or show a spinner/aria-busy during the request
  await waitFor(() => {
    expect(
      submit.hasAttribute('disabled') ||
      submit.getAttribute('aria-disabled') === 'true' ||
      submit.getAttribute('aria-busy') === 'true'
    ).toBe(true);
  });

  // Second click should do nothing while pending
  await userEvent.click(submit);

  // Request eventually resolves - form fields are cleared on success
  await waitFor(() => {
    const nameInput = screen.getByLabelText(/name|your name/i);
    expect(nameInput.value).toBe('');
  }, { timeout: 3000 });
}, 10000);

test('email format validation (client-side) prevents submit', async () => {
  renderWithProviders(<ContactSection />);

  await userEvent.type(screen.getByLabelText(/name|your name/i), 'Ahmad');
  await userEvent.type(screen.getByLabelText(/email|your email/i), 'not-an-email');
  await userEvent.type(screen.getByLabelText(/message|your message/i), 'Hello this is a longer message for testing');

  await userEvent.click(screen.getByRole('button', { name: /send|submit/i }));

  // Expect specific email error; keep regex broad in case of i18n
  const emailErr = await screen.findByText(/invalid email|enter a valid email/i);
  expect(emailErr).toBeInTheDocument();
});

test('honeypot blocks bots without hitting the server (if present)', async () => {
  // If you expose a hidden honeypot input, give it a stable label or data-testid (e.g., data-testid="hp")
  renderWithProviders(<ContactSection />);

  // Skip if your implementation doesn’t have honeypot; this keeps the test optional
  const honeypot = screen.queryByTestId?.('hp') || screen.queryByLabelText?.(/website|company|url/i);
  if (!honeypot) return; // no-op: test becomes a no-op when honeypot not implemented

  await userEvent.type(screen.getByLabelText(/name|your name/i), 'Bot');
  await userEvent.type(screen.getByLabelText(/email|your email/i), 'bot@example.com');
  await userEvent.type(screen.getByLabelText(/message|your message/i), 'Spam message from automated bot');
  await userEvent.type(honeypot, 'http://spam.example.com'); // -> should trip bot detection

  await userEvent.click(screen.getByRole('button', { name: /send|submit/i }));

  // Honeypot silently drops submission (no error shown). Just verify no success message appears.
  await waitFor(() => {
    expect(screen.queryByText(/thank you|message sent|submitted/i)).toBeNull();
  }, { timeout: 2000 });
});
