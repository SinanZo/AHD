import React from 'react';
import { useTranslation } from 'react-i18next';
import covers from '../data/covers.json';

export default function DevDebugOverlay() {
  // Always call hooks unconditionally (rules of hooks)
  const { i18n } = useTranslation();
  const lang = i18n?.language || 'unknown';
  const dir = typeof i18n?.dir === 'function' ? i18n.dir() : (i18n?.language || '').startsWith('ar') ? 'rtl' : 'ltr';
  const coverCount = Array.isArray(covers) ? covers.length : 0;

  // Only render the overlay in development mode. Use Vite's import.meta.env.DEV flag
  // (fallback to checking window for non-Vite environments).
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
    ? Boolean(import.meta.env.DEV)
    : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
  // Allow an explicit runtime opt-out by setting window.__DEBUG_OVERLAY = false
  if (!isDev) return null;
  // Only render when explicitly enabled at runtime. This makes the overlay opt-in
  // so it won't show by default in developer environments unless window.__DEBUG_OVERLAY === true
  if (typeof window !== 'undefined' && window.__DEBUG_OVERLAY !== true) return null;

  // Inject a dev-only CSS hook to outline hero media so we can see which element is visible
  if (typeof window !== 'undefined' && window.__DEBUG_OVERLAY !== false) {
    const id = 'dev-hero-debug-css';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.innerHTML = `
        /* Dev hero visualizer — outlines hero containers and media */
        .hero, .hero * { outline-color: rgba(255,0,0,0.7) !important; }
        .hero > .relative { box-shadow: 0 0 0 3px rgba(255,0,0,0.06) inset; }
        .hero img, .hero video, .hero figure, .hero > div.absolute { outline: 2px dashed rgba(255,0,0,0.9) !important; background: rgba(255,255,0,0.02) !important; }
        `;
      document.head.appendChild(style);
    }
  }

  return (
    <div
      aria-hidden={false}
      style={{
        position: 'fixed',
        right: 12,
        bottom: 12,
        zIndex: 99999,
        background: 'rgba(2,12,14,0.85)',
        color: 'white',
        padding: '8px 10px',
        borderRadius: 8,
        fontSize: 12,
        boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>DEV DEBUG</div>
      <div>lang: <strong>{lang}</strong></div>
      <div>dir: <strong>{dir}</strong></div>
      <div>covers: <strong>{coverCount}</strong></div>
      <div style={{ marginTop: 6, fontSize: 11, opacity: 0.9 }}>Toggle with window.__DEBUG_OVERLAY = false</div>
    </div>
  );
}
