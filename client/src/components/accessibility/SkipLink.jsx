import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SkipLink() {
  const { t } = useTranslation('common');

  const focusMain = () => {
    queueMicrotask(() => {
      const el = document.getElementById('main-content');
      if (!el) return;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
      // reflect in URL without scrolling
      try {
        if (location.hash !== '#main-content' && 'replaceState' in history) {
          history.replaceState(null, '', '#main-content');
        }
      } catch (err) { void err; /* no-op */ }
    });
  };

  return (
    <a
      id="skip-link"
      href="#main-content"
      onClick={(e) => { e.preventDefault(); focusMain(); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // prevent Space page scroll
          focusMain();
        }
      }}
      className="skip-link sr-only focus:not-sr-only fixed z-[9999] px-4 py-2 rounded bg-primary text-white font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      style={{ insetInlineStart: '0.5rem', insetBlockStart: '0.5rem' }}
      tabIndex={0}
    >
      {t('skip_to_main', { defaultValue: 'Skip to main content' })}
    </a>
  );
}
