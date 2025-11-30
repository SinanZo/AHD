/* @vitest-environment jsdom */
import React from 'react';
import { describe, test, expect } from 'vitest';
import { http, HttpResponse, delay } from 'msw';
import { server } from '@/test/mocks/server';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/utils';
import ProductsSection from '@/components/ProductsSection';

/**
 * Assumptions (tweak selectors if needed):
 * - Endpoint: GET /api/products -> { items: Array<{ id, name, ... }> }
 * - Loading UI exposes either:
 *     - role="status", OR
 *     - text matching /loading/i
 * - Empty UI exposes text matching /no products|empty|not found/i
 * - Product items render with visible names
 */

const findLoading = () =>
  screen.queryByRole('status') || screen.queryByText(/loading/i);

describe('ProductsSection integration', () => {

  test('displays loading state while fetching', async () => {
    server.use(
      http.get('/api/products', async () => {
        await delay(250); // force a visible loading state
        return HttpResponse.json({ items: [] });
      })
    );

    renderWithProviders(<ProductsSection />);

    // Should show a loading indicator quickly
    await waitFor(() => {
      expect(findLoading()).toBeTruthy();
    }, { timeout: 600 });

    // And eventually settle to empty view (since items: [])
    const empty = await screen.findByRole('note', { name: /no products|empty|not found/i })
      .catch(async () => await screen.findByText(/no products|empty|not found/i));
    expect(empty).toBeInTheDocument();

    // Loading should disappear by now
    await waitFor(() => {
      const stillLoading = screen.queryByRole('status') || screen.queryByText(/loading/i);
      expect(stillLoading).toBeNull();
    });
  });

  test('renders products on success', async () => {
    server.use(
      http.get('/api/products', async () =>
        HttpResponse.json({
          items: [
            { id: 'rb-01', name: 'Roller Blinds' },
            { id: 'vb-02', name: 'Vertical Blinds' },
            { id: 'wp-03', name: 'Wallpaper' },
          ],
        })
      )
    );

    renderWithProviders(<ProductsSection />);

    // Wait for a representative product to appear
    expect(await screen.findByText(/Roller Blinds/i)).toBeInTheDocument();
    // Others should also render
    expect(screen.getByText(/Vertical Blinds/i)).toBeInTheDocument();
    expect(screen.getByText(/Wallpaper/i)).toBeInTheDocument();

  // Optionally: assert card count if you add data-testid="product-card"
  // expect(await screen.findAllByTestId('product-card')).toHaveLength(3);

    // Loading should be gone
    await waitFor(() => {
      const loadingGone = !screen.queryByRole('status') && !screen.queryByText(/loading/i);
      expect(loadingGone).toBe(true);
    });
  });

  test('shows an empty state when API returns zero items', async () => {
    server.use(
      http.get('/api/products', async () =>
        HttpResponse.json({ items: [] }, { status: 200 })
      )
    );

    renderWithProviders(<ProductsSection />);

    const empty = await screen.findByText(/no products|empty|not found/i);
    expect(empty).toBeInTheDocument();
  });

  test('handles server failure and recovers on retry', async () => {
    // 1) First request fails with 500
    server.use(
      http.get('/api/products', async () =>
        HttpResponse.json({ error: 'boom' }, { status: 500 })
      )
    );

    // Render
    const { rerender } = renderWithProviders(<ProductsSection />);

    // Expect an error/fallback UI
    const err = await screen.findByText(/error|failed|try again|sorry/i);
    expect(err).toBeInTheDocument();

    // 2) Next request succeeds
    server.use(
      http.get('/api/products', async () =>
        HttpResponse.json({
          items: [
            { id: 'rb-01', name: 'Roller Blinds' },
            { id: 'vb-02', name: 'Vertical Blinds' },
          ],
        })
      )
    );

    // If a retry button exists, click it; otherwise force a refetch by changing a key
    const retryBtn =
      screen.queryByRole('button', { name: /try again|retry/i }) ||
      screen.queryByText(/try again|retry/i);
    if (retryBtn) {
      await userEvent.click(retryBtn);
    } else {
      rerender(<ProductsSection key="retry-1" />);
    }

    // Success: products should appear
    expect(await screen.findByText(/Roller Blinds/i)).toBeInTheDocument();
    expect(screen.getByText(/Vertical Blinds/i)).toBeInTheDocument();

    // And error UI should be gone
    await waitFor(() => {
      const stillErr = screen.queryByText(/error|failed|try again|sorry/i);
      expect(stillErr).toBeNull();
    });
  });
});
