/* @vitest-environment jsdom */
import React from 'react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/utils';
import ProductsSection from '@/components/ProductsSection';

/**
 * ProductsSection fetches /images/products/manifest.json at mount.
 * It does NOT show loading spinners or explicit error UI — just renders carousel or empty state.
 * We mock global fetch to control the manifest response.
 */

describe('ProductsSection integration', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('renders component without crashing and fetches manifest', async () => {
    const mockManifest = {
      products: [
        {
          id: 'wave-curtains',
          name: 'Wave Style Curtains',
          category: 'curtains',
          coverImage: '/images/products/wave-curtains.jpg',
          description: 'Modern wave curtains'
        }
      ]
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockManifest,
      headers: { get: () => 'application/json' }
    });

    renderWithProviders(<ProductsSection />);

    // Component should render its section
    await waitFor(() => {
      const section = document.querySelector('section') || screen.queryByRole('region');
      expect(section).toBeTruthy();
    });

    // Verify fetch was called with correct endpoint
    expect(globalThis.fetch).toHaveBeenCalledWith('/images/products/manifest.json');
  });

  test('displays products when manifest loads successfully', async () => {
    const mockManifest = {
      products: [
        {
          id: 'roller-blinds',
          name: 'Roller Blinds',
          category: 'blinds',
          coverImage: '/images/products/roller-blinds.jpg',
          description: 'Classic roller blinds'
        },
        {
          id: 'vertical-blinds',
          name: 'Vertical Blinds',
          category: 'blinds',
          coverImage: '/images/products/vertical-blinds.jpg',
          description: 'Vertical window blinds'
        }
      ]
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockManifest,
      headers: { get: () => 'application/json' }
    });

    renderWithProviders(<ProductsSection />);

    // Wait for products to appear in the DOM (products render multiple times in carousel)
    await waitFor(() => {
      const rollerBlinds = screen.queryAllByText(/roller blinds/i);
      const verticalBlinds = screen.queryAllByText(/vertical blinds/i);
      expect(rollerBlinds.length + verticalBlinds.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('handles empty manifest gracefully', async () => {
    const emptyManifest = { products: [] };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => emptyManifest,
      headers: { get: () => 'application/json' }
    });

    renderWithProviders(<ProductsSection />);

    // Component should still render (carousel may be empty but section exists)
    await waitFor(() => {
      const section = document.querySelector('section') || screen.queryByRole('region');
      expect(section).toBeTruthy();
    });

    // No error UI expected - component just shows empty carousel
    expect(screen.queryByText(/error|failed/i)).toBeNull();
  });

  test('handles fetch failure silently without crashing', async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<ProductsSection />);

    // Component should still render its section (fails silently)
    await waitFor(() => {
      const section = document.querySelector('section') || screen.queryByRole('region');
      expect(section).toBeTruthy();
    });

    // Component does not show explicit error UI
    expect(screen.queryByText(/error|failed|try again/i)).toBeNull();
  });
});
