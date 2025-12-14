import React from 'react';
import SharedFooter from './layouts/Footer';

/**
 * Deprecated simple footer wrapper — re-exports shared footer.
 * Please switch imports to `components/layouts/Footer`.
 */
export default function Footer(props) {
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('Deprecated: use components/layouts/Footer instead of components/Footer-simple');
  }
  return <SharedFooter {...props} />;
}

