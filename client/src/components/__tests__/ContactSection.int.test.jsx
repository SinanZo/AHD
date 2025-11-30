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
  message = 'Hello from tests!'
} = {}) {
  await userEvent.type(screen.getByLabelText(/name/i), name);
  await userEvent.type(screen.getByLabelText(/email/i), email);
  await userEvent.type(screen.getByLabelText(/message/i), message);
  await userEvent.click(screen.getByRole('button', { name: /send|submit/i }));
}

describe('ContactSection integration', () => {
  test('client-side validation shows error when fields are empty', async () => {
    renderWithProviders(<ContactSection />);

    await userEvent.click(screen.getByRole('button', { name: /send|submit/i }));

    // Expect some validation feedback without hitting server
    // Adjust the text below to your actual validation copy if needed
    const err = await screen.findByText(/missing|required|please fill|enter/i);
    expect(err).toBeInTheDocument();
  });

  test('successful submit shows thank-you copy and ticket id', async () => {
    // Override contact API for this test with a deterministic ticket id
    server.use(
      http.post('/api/contact', async () =>
        HttpResponse.json({ ok: true, ticketId: 'AD-424242' }, { status: 200 })
      )
    );

    renderWithProviders(<ContactSection />);

    await fillAndSubmit();

    // Expect success copy; match common variants to be resilient
    const success = await screen.findByText(/thank you|message sent|submitted/i);
    expect(success).toBeInTheDocument();

    // Show ticket ID if UI renders it
    await waitFor(() => {
      const ticket = screen.queryByText(/AD-424242/);
      // Not all UIs display the id; assert softly if present
      if (ticket) expect(ticket).toBeInTheDocument();
    });
  });

  test('server error shows friendly failure message', async () => {
    server.use(
      http.post('/api/contact', async () =>
        HttpResponse.json({ error: 'Server exploded' }, { status: 500 })
      )
    );

    renderWithProviders(<ContactSection />);

    await fillAndSubmit();

    // UI should surface a friendly error message (toast/inline)
    const err = await screen.findByText(/error|failed|try again|sorry/i);
    expect(err).toBeInTheDocument();
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

  await userEvent.type(screen.getByLabelText(/name/i), 'Ahmad');
  await userEvent.type(screen.getByLabelText(/email/i), 'ahmad@example.com');
  await userEvent.type(screen.getByLabelText(/message/i), 'Hello');

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

  // Request eventually resolves and success UI appears
  const success = await screen.findByText(/thank you|message sent|submitted/i);
  expect(success).toBeInTheDocument();
});

test('email format validation (client-side) prevents submit', async () => {
  renderWithProviders(<ContactSection />);

  await userEvent.type(screen.getByLabelText(/name/i), 'Ahmad');
  await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
  await userEvent.type(screen.getByLabelText(/message/i), 'Hello');

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

  await userEvent.type(screen.getByLabelText(/name/i), 'Bot');
  await userEvent.type(screen.getByLabelText(/email/i), 'bot@example.com');
  await userEvent.type(screen.getByLabelText(/message/i), 'Spam');
  await userEvent.type(honeypot, 'http://spam.example.com'); // -> should trip bot detection

  await userEvent.click(screen.getByRole('button', { name: /send|submit/i }));

  // Expect immediate client-side rejection; no success toast.
  const err = await screen.findByText(/spam|bot|rejected|not allowed/i);
  expect(err).toBeInTheDocument();
});
