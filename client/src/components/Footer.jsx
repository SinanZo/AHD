import React from 'react';
import SharedFooter from './layouts/Footer';

/**
 * Deprecated wrapper — use `components/layouts/Footer` instead.
 * This file remains for backwards compatibility and will re-export the
 * shared footer implementation. Update imports to `./components/layouts/Footer`.
 */
export default function Footer(props) {
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('Deprecated: use components/layouts/Footer instead of components/Footer');
  }
  return <SharedFooter {...props} />;
}
