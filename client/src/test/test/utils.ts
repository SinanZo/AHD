import React from 'react';
import { render } from '@testing-library/react';
import * as rtl from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import i18n from '../i18n';
import { ThemeLangProvider } from '../context/ThemeLangContext';

// Render helper that wraps the UI with the minimal providers used by the app.
// Tests can still pass an explicit `wrapper` via options if they need different providers.
export function renderWithProviders(ui: React.ReactElement, options: any = {}) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider attribute="class" disableTransitionOnChange storageKey="theme">
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>{/* ThemeLangProvider may rely on router or i18n */}
          <ThemeLangProvider>{children}</ThemeLangProvider>
        </MemoryRouter>
      </I18nextProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: AllProviders, ...options } as any);
}

export const screen = rtl.screen;
export const waitFor = rtl.waitFor;
export const fireEvent = rtl.fireEvent;
export { userEvent };

export default {
  renderWithProviders,
  screen,
  waitFor,
  fireEvent,
  userEvent,
};
