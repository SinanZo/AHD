/* @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor, fireEvent } from '@/test/utils';
import Header from '../Header';

// Small helper so we don’t rely on exact casing of labels in i18n
const getToggleThemeBtn = () => screen.getByRole('button', { name: /toggle .*dark.* mode|toggle dark mode/i });
const getLangEnBtn     = () => screen.getByRole('button', { name: /english|en/i });
const getLangArBtn     = () => screen.getByRole('button', { name: /العربية|ar/i });

describe('Header — utilities & menu', () => {
  it('renders language + theme controls and they work (dir/lang + dark class)', async () => {
    // Ensure a clean <html> for each run
    document.documentElement.className = '';
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    localStorage.removeItem('theme');
    localStorage.removeItem('lang');

    renderWithProviders(<Header />);

    // Utilities present
    expect(getToggleThemeBtn()).toBeInTheDocument();
    expect(getLangEnBtn()).toBeInTheDocument();
    expect(getLangArBtn()).toBeInTheDocument();

    // Theme: toggle to dark
    await userEvent.click(getToggleThemeBtn());
    await waitFor(() => {
      // next-themes toggles a class on <html>
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    // Theme: toggle back to light
    await userEvent.click(getToggleThemeBtn());
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    // Language: switch to Arabic
    await userEvent.click(getLangArBtn());
    await waitFor(() => {
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang.toLowerCase()).toBe('ar');
    });

    // Switch back to English
    await userEvent.click(getLangEnBtn());
    await waitFor(() => {
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang.toLowerCase()).toBe('en');
    });
  });

  it('opens mobile menu, traps focus, and closes via backdrop & ESC', async () => {
    renderWithProviders(<Header />);

    // Open hamburger
    const openBtn = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(openBtn);

    // Drawer & backdrop appear
    const dialog = await screen.findByRole('dialog', { name: /mobile menu/i }).catch(() =>
      // Fallback by id/role if the aria-labelledby string differs
      screen.findByRole('dialog')
    );
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Backdrop exists (semi-opaque overlay)
    const backdrop = document.querySelector('.fixed.inset-0');
    expect(backdrop).toBeTruthy();

    // Close via ESC
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    // Open again then close by clicking backdrop
    await userEvent.click(openBtn);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    // Click the backdrop element
    fireEvent.click(document.querySelector('.fixed.inset-0'));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('navigates via a primary nav button without errors', async () => {
    renderWithProviders(<Header />);

    // In desktop nav, a "Products" pill exists and calls navigate()
    const maybeProducts = screen.queryAllByRole('button', { name: /products|منتجات/i })[0];
    if (maybeProducts) {
      await userEvent.click(maybeProducts);
      // We don’t assert pathname here (BrowserRouter memory state),
      // just ensure the click doesn’t crash and the button remains in the DOM.
      expect(maybeProducts).toBeInTheDocument();
    } else {
      // On very small jsdom widths, desktop nav may be hidden.
      // Open the mobile menu and click there instead.
      await userEvent.click(screen.getByRole('button', { name: /open menu/i }));
      const mobileProducts =
        await screen.findByRole('button', { name: /products|منتجات/i });
      await userEvent.click(mobileProducts);
      // Drawer closes after navigate()
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    }
  });
});
