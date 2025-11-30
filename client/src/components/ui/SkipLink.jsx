import React from 'react';

// A11y skip link for keyboard users
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only absolute top-2 left-2 z-[9999] px-4 py-2 rounded bg-primary text-white font-bold shadow-lg transition-all duration-200"
      tabIndex={0}
    >
      Skip to main content
    </a>
  );
}
