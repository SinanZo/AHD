import { sendErrorReport } from './reportError';

export function installGlobalErrorListeners() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    try {
      const { message, filename, lineno, colno, error } = event;
      sendErrorReport({
        message,
        name: error?.name || 'WindowError',
        stack: error?.stack || `${filename}:${lineno}:${colno}`,
        url: window.location.href,
        userAgent: navigator.userAgent,
        appReady: !!window.__APP_READY,
        time: new Date().toISOString(),
      });
    } catch {
      // Swallow error: error reporting should never throw
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason || {};
      sendErrorReport({
        message: reason?.message || String(reason),
        name: reason?.name || 'UnhandledRejection',
        stack: reason?.stack || '',
        url: window.location.href,
        userAgent: navigator.userAgent,
        appReady: !!window.__APP_READY,
        time: new Date().toISOString(),
      });
    } catch {
      // Swallow error: error reporting should never throw
    }
  });
}
