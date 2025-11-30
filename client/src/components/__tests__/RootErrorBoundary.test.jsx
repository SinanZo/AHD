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

  it('retry button clears the fallback UI', async () => {
    renderWithProviders(
      <RootErrorBoundary>
        <Thrower />
      </RootErrorBoundary>
    );

    const tryAgain = await screen.findByRole('button', { name: /try again/i });
    await userEvent.click(tryAgain);

    // After soft reset, the same Thrower would throw again on next render.
    // We only assert that the boundary component itself reset (UI disappears).
    await waitFor(() => {
      expect(screen.queryByTestId('root-error-boundary')).toBeNull();
    });
  });
});
