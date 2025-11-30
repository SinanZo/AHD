/**
 * preloadOnHover(preloadFn, options?)
 * - Triggers a dynamic import preload on hover/focus/touch (or pointer events).
 * - Returns JSX handlers (inline mode) OR a cleanup function when used with { attachTo }.
 *
 * Options:
 *   once?: boolean   (default: true)   // if false, can trigger multiple times (debounced)
 *   delay?: number   (default: 80)     // ms debounce to avoid accidental hovers
 *   attachTo?: Element | null          // if provided, attaches listeners and returns cleanup()
 */
export default function preloadOnHover(preloadFn, opts = {}) {
  if (typeof preloadFn !== 'function') {
    throw new Error('preloadOnHover: preloadFn must be a function');
  }

  const {
    once = true,
    delay = 80,
    attachTo = null,
  } = opts;

  // Skip if user prefers Data Saver
  if (typeof navigator !== 'undefined' && navigator.connection?.saveData) {
    const noopHandlers = { onMouseEnter: () => {}, onFocus: () => {}, onTouchStart: () => {}, onMouseLeave: () => {}, onBlur: () => {} };
    if (!attachTo) return noopHandlers;
    return () => {};
  }

  let triggered = false;
  let timer = null;

  const trigger = () => {
    if (once && triggered) return;
  triggered = true;
  try { preloadFn(); } catch { /* best-effort; ignore */ }
  };

  const schedule = () => {
    if (once && triggered) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(trigger, delay);
  };

  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const pointerSupported = typeof window !== 'undefined' && 'onpointerenter' in window;

  const touchOpts = { passive: true }; // must pass same object to removeEventListener

  const attach = (el) => {
    if (!el || typeof el.addEventListener !== 'function') return () => {};

    if (pointerSupported) {
      el.addEventListener('pointerenter', schedule);
      el.addEventListener('pointerleave', cancel);
    } else {
      el.addEventListener('mouseenter', schedule);
      el.addEventListener('mouseleave', cancel);
    }

    el.addEventListener('focus', schedule);
    el.addEventListener('blur', cancel);
    el.addEventListener('touchstart', schedule, touchOpts);

    return () => {
      if (pointerSupported) {
        el.removeEventListener('pointerenter', schedule);
        el.removeEventListener('pointerleave', cancel);
      } else {
        el.removeEventListener('mouseenter', schedule);
        el.removeEventListener('mouseleave', cancel);
      }
      el.removeEventListener('focus', schedule);
      el.removeEventListener('blur', cancel);
      el.removeEventListener('touchstart', schedule, touchOpts);
      cancel();
    };
  };

  // Inline JSX helper mode
  if (typeof window !== 'undefined' && !attachTo) {
    if (pointerSupported) {
      return {
        onPointerEnter: schedule,
        onPointerLeave: cancel,
        onFocus: schedule,
        onBlur: cancel,
        onTouchStart: () => { schedule(); }, // keep for iOS <13 oddities
      };
    }
    return {
      onMouseEnter: schedule,
      onMouseLeave: cancel,
      onFocus: schedule,
      onBlur: cancel,
      onTouchStart: () => { schedule(); },
    };
  }

  // Programmatic attach mode
  if (attachTo) {
    return attach(attachTo);
  }
}
