/* @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/utils';

// Mock reporter to avoid real network
vi.mock('@/utils/reportError', () => ({
  sendErrorReport: vi.fn().mockResolvedValue({ ok: true, ticketId: 'AD-TEST-123456' }),
}));
import { sendErrorReport } from '@/utils/reportError';

import RootErrorBoundary from '../RootErrorBoundary';

function Thrower() {
  throw new Error('Boom!');
}

describe('RootErrorBoundary', () => {
  it('renders fallback UI when a child throws', async () => {
    renderWithProviders(
      <RootErrorBoundary>
        <Thrower />
      </RootErrorBoundary>
    );
    const fb = await screen.findByTestId('root-error-boundary');
    expect(fb).toBeInTheDocument();
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    // Stack preview appears (short)
    expect(screen.getByLabelText(/stack trace preview/i)).toBeInTheDocument();
  });

  it('sends report and shows ticket id', async () => {
    renderWithProviders(
      <RootErrorBoundary>
        <Thrower />
      </RootErrorBoundary>
    );

    const reportBtn = await screen.findByRole('button', { name: /report/i });
    await userEvent.click(reportBtn);

    await waitFor(() => {
      expect(sendErrorReport).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/AD-TEST-123456/)).toBeInTheDocument();
    });
  });

  it('retry button attempts to reset but re-catches error', async () => {
    renderWithProviders(
      <RootErrorBoundary>
        <Thrower />
      </RootErrorBoundary>
    );

    const tryAgain = await screen.findByRole('button', { name: /try again/i });
    await userEvent.click(tryAgain);

    // After soft reset, the same Thrower will throw again on next render,
    // so the error boundary catches it again and the UI remains visible.
    // We just verify the button is still there (error boundary caught the error again).
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });
});
