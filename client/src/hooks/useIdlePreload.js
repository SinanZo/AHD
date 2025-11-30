import { useEffect } from 'react';

/**
 * useIdlePreload(tasks, delayOrOptions)
 * - tasks: array of functions (e.g. dynamic import preloaders)
 * - delayOrOptions: number | { delay?: number, skip?: boolean }
 *
 * Notes:
 * - Cleans up properly for BOTH requestIdleCallback and setTimeout paths.
 * - Skips work on "Data Saver" networks or hidden tabs.
 * - Safe if tasks throw; each runs in a try/catch.
 */
export default function useIdlePreload(tasks, delayOrOptions = 300) {
  const opts = typeof delayOrOptions === 'number'
    ? { delay: delayOrOptions }
    : (delayOrOptions || {});
  const delay = typeof opts.delay === 'number' ? opts.delay : 300;
  const skip = !!opts.skip;

  useEffect(() => {
    if (skip) return;
    if (!Array.isArray(tasks) || tasks.length === 0) return;

    // Avoid doing background work on hidden tabs or when user enables Data Saver
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData) return;

    // Scheduler + canceller
    const hasRIC = typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function';
    const schedule = (cb) =>
      hasRIC
        ? { type: 'ric', id: window.requestIdleCallback(cb, { timeout: delay }) }
        : { type: 'timeout', id: setTimeout(cb, delay) };

    const cancel = (handle) => {
      if (!handle) return;
      if (handle.type === 'ric' && typeof window.cancelIdleCallback === 'function') {
        try { window.cancelIdleCallback(handle.id); } catch {
          // ignore cancellation errors (some environments may throw)
        }
      } else if (handle.type === 'timeout') {
        clearTimeout(handle.id);
      }
    };

    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      for (const t of tasks) {
        try {
          if (typeof t === 'function') t();
        } catch {
          // swallow individual preload errors; lazy imports can still succeed later
        }
      }
    };

    const handle = schedule(run);
    return () => {
      cancelled = true;
      cancel(handle);
    };
  }, [delay, skip, /* ⚠ important: pass a memoized tasks array from caller */ tasks]);
}
