// /src/main.tsx
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { I18nextProvider } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import AppShell from "./components/AppShell";

import App from "./App";
import i18n from "./i18n/i18n";            // use the default export to access i18n instance
import "./index.css";
import "./styles/font-fallbacks.css";
import "./styles/a11y.css";
import { initPersistThemeLang } from "./utils/persist-theme-lang";
import { ThemeLangProvider } from './context/ThemeLangContext';

/* ---------------- Dev-only helper for CI/smoke tests ---------------- */
const isProd = import.meta?.env?.PROD === true || import.meta?.env?.MODE === 'production';
if (typeof window !== "undefined" && !window.__DEV_OPEN_FIRST_GALLERY && !isProd) {
  try {
    window.__DEV_OPEN_FIRST_GALLERY = (index = 0) => {
      window.dispatchEvent(new CustomEvent("dev-open-gallery", { detail: { index } }));
    };
  } catch {
    /* noop */
  }
}

// Dev-only: silence framer-motion dev warning about reduced motion when running locally
// The message is informational but noisy during development and CI logs. We only filter
// the exact message text to avoid swallowing other warnings. Keep this out of prod.
if (typeof window !== 'undefined' && !isProd) {
  const origWarn = console.warn.bind(console);
  console.warn = (...args) => {
    try {
      const msg = String(args[0] ?? '');
      if (msg.includes('You have Reduced Motion enabled on your device') || msg.includes('reduced-motion')) {
        return; // drop this specific dev message
      }
    } catch {
      // ignore and fall through
    }
    return origWarn(...args);
  };
}

/* ---------------- Initialize persisted theme/lang (non-blocking) -----
   This will:
   - Apply <html dir|lang> correctly for RTL/LTR before first paint
   - Rehydrate saved theme ("dark"/"light"/"system") without FOUC
--------------------------------------------------------------------- */
try {
  initPersistThemeLang(i18n); // pass the instance so util can read current language
} catch {
  /* noop - HMR friendly */
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
          <I18nextProvider i18n={i18n}>
            {/* Suspense shows a tiny skeleton to avoid a blank flash during i18n loads */}
            <Suspense fallback={<div style={{ height: '18vh' }} aria-busy="true" /> }>
              {/* Wouter doesn't need a Router wrapper like BrowserRouter */}
              <ThemeLangProvider>
                <AppShell>
                  <App />
                </AppShell>
              </ThemeLangProvider>
            </Suspense>
          </I18nextProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// Mark app as ready for E2E tests. Tests can wait for window.__APP_READY to
// avoid relying on brittle networkidle conditions (fonts, video ranges, etc.).
try {
  if (typeof window !== 'undefined') {
    // give a small tick to ensure hydration/mount effects ran
    setTimeout(() => { (window as any).__APP_READY = true; }, 0);
  }
} catch {
  /* noop */
}
