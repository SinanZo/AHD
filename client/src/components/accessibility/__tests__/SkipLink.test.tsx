/* @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import SkipLink from '../SkipLink';

function mountWithMain() {
  return renderWithProviders(
    <div>
      <SkipLink />
      <div id="main-content" tabIndex={-1}>Main</div>
    </div>
  );
}

describe('SkipLink', () => {
  it('moves focus to #main-content on click and sets hash without scrolling', async () => {
    mountWithMain();
    const link = screen.getByRole('link', { name: /skip to main content/i });

    // spy to ensure our handler doesn't cause a window scroll
    // (JSDOM won’t actually scroll, but this helps catch accidental calls)
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    await userEvent.click(link);

  const main = document.getElementById('main-content');
  expect(main).not.toBeNull();
  if (!main) throw new Error('main-content not found');
  expect(document.activeElement).toBe(main);
  expect(main.getAttribute('tabindex')).toBe('-1');
  expect(window.location.hash).toBe('#main-content');
  expect(scrollSpy).not.toHaveBeenCalled();

    scrollSpy.mockRestore();
  });

  it('also works via keyboard (Space/Enter)', async () => {
    mountWithMain();
    const link = screen.getByRole('link', { name: /skip to main content/i });
    link.focus();

    await userEvent.keyboard(' '); // Space
    expect(document.activeElement?.id).toBe('main-content');

    // Ensure Enter path too
    document.getElementById('skip-link')?.focus();
    await userEvent.keyboard('{Enter}');
    expect(document.activeElement?.id).toBe('main-content');
  });
});
