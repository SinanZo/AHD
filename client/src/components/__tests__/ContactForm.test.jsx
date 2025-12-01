import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, beforeEach, expect, vi } from 'vitest'

// Make Vitest's expect available for jest-dom to extend
globalThis.expect = expect

// Mock react-i18next to provide predictable translations in tests
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => {
      const map = {
        'form.name': 'Your Name',
        'form.email': 'Your Email',
        'form.message': 'Your Message',
        'form.sendButton': 'Send Message',
        'form.sending': 'Sending...',
        'form.success': "Thanks — we'll get back to you shortly.",
        'form.error': 'Something went wrong. Please try again later.',
        'form.errors.name': 'Please enter your name.',
        'form.errors.email': 'Please enter your email.',
        'form.errors.emailInvalid': 'Please enter a valid email address.',
        'form.errors.message': 'Please enter a message (at least 10 characters).'
      }
      return map[k] || k
    }
  })
}))

// import jest-dom after global expect is set (avoid import hoisting issues)
await import('@testing-library/jest-dom')

// Mock fetch early so modules that capture `fetch` at import-time get the spy
globalThis.fetch = vi.fn()

import ContactForm from '../ContactForm'

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation errors for empty fields', async () => {
    render(<ContactForm />)

    // ensure no native constraint validation blocks JS submit
    const formEl = screen.getByTestId('contact-form') || document.querySelector('form')
    if (formEl) formEl.noValidate = true

    // skip the time-trap by moving system time forward (briefly enable fake timers)
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 1300)
    vi.useRealTimers()

    const formEl2 = screen.getByTestId('contact-form') || document.querySelector('form')
    fireEvent.submit(formEl2)

    // Assert validation message appears for name field (uses i18n mapping)
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument()
  })

  it('submits successfully with valid data', async () => {
    // Mock fetch for this specific test
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ ok: true })
    });
    globalThis.fetch = mockFetch;

    render(<ContactForm />)

    // ensure no native constraint validation so JS submit runs
    const form = screen.getByTestId('contact-form') || document.querySelector('form')
    if (form) form.noValidate = true

    // skip the time-trap by moving system time forward
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 1300)
    vi.useRealTimers()

    await userEvent.type(screen.getByLabelText(/your name/i), 'Test User')
    await userEvent.type(screen.getByLabelText(/your email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/your message/i), 'Hello world test message')

    // submit via form submit to ensure handler executes reliably in jsdom
    const formEl3 = screen.getByTestId('contact-form') || document.querySelector('form')
    fireEvent.submit(formEl3)

    // ensure the request was sent
    await waitFor(() => expect(fetch).toHaveBeenCalled())

    expect(fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Hello world test message',
        }),
      })
    )

    // Success message is rendered with role=status and contains the success text
    expect(await screen.findByRole('status')).toBeInTheDocument()
    expect((await screen.findByRole('status')).textContent.toLowerCase()).toContain('thanks')
  })
})
