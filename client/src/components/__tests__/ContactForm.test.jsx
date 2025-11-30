import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
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
import ContactForm from '../ContactForm'

// Mock fetch
globalThis.fetch = vi.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation errors for empty fields', async () => {
    render(<ContactForm />)

  // skip the time-trap by moving system time forward (briefly enable fake timers)
  vi.useFakeTimers()
  vi.setSystemTime(Date.now() + 1300)
  vi.useRealTimers()

  // disable browser constraint validation so the onSubmit handler runs in jsdom
  const form = document.querySelector('form')
  if (form) form.noValidate = true

  const send = screen.getByRole('button', { name: /send/i })
  await userEvent.click(send)

    await waitFor(() => {
      // The component renders field errors inside <p role="alert"> when validation fails
      // There may be multiple field errors; find the one that mentions the name
      const alerts = screen.getAllByRole('alert')
      expect(alerts.length).toBeGreaterThanOrEqual(1)
      const hasName = alerts.some(a => a.textContent.toLowerCase().includes('please enter your name'))
      expect(hasName).toBe(true)
    })
  })

  it('submits successfully with valid data', async () => {
    // mock successful response
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })

    render(<ContactForm />)

  // skip the time-trap by moving system time forward (briefly enable fake timers)
  vi.useFakeTimers()
  vi.setSystemTime(Date.now() + 1300)
  vi.useRealTimers()
    await userEvent.type(screen.getByLabelText(/your name/i), 'Test User')
    await userEvent.type(screen.getByLabelText(/your email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/your message/i), 'Hello world test message')

  await userEvent.click(screen.getByRole('button', { name: /send/i }))

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

    await waitFor(() => {
      // Success message is rendered with role=status and contains the success text
      const status = screen.getByRole('status')
      expect(status).toBeInTheDocument()
      expect(status.textContent.toLowerCase()).toContain('thanks')
    })
  })
})
