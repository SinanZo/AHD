import React from 'react';
import { render } from '@testing-library/react';
import * as rtl from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// A tiny test utils shim used by tests. Keep minimal: renderWithProviders currently
// just delegates to RTL `render`. Add providers here if your app requires them.
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  return render(ui, { ...options } as any);
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
