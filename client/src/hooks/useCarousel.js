import { useCallback, useEffect, useRef, useState } from 'react';

// Lightweight carousel hook with autoplay, hover pause, and reduced-motion respect.
// API kept minimal to avoid coupling. Consumers can also manage external pause state.
export default function useCarousel(total, interval = 5000, options = {}) {
  const { respectReduced = true } = options;
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const hovering = useRef(false);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const effectiveReduced = respectReduced && reduced;

  const next = useCallback(() => setIndex((i) => (total > 0 ? (i + 1) % total : 0)), [total]);
  const prev = useCallback(() => setIndex((i) => (total > 0 ? (i - 1 + total) % total : 0)), [total]);
  const go = useCallback((i) => setIndex(() => (total > 0 ? ((i % total) + total) % total : 0)), [total]);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (effectiveReduced || hovering.current || total <= 1) return;
    stop();
    timer.current = setInterval(next, interval);
  }, [interval, next, effectiveReduced, stop, total]);

  useEffect(() => {
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    start();
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // Only depend on primitives and stable functions
  }, [total, interval, effectiveReduced, start, stop]);

  const bindHover = {
    onMouseEnter: () => {
      hovering.current = true;
      stop();
    },
    onMouseLeave: () => {
      hovering.current = false;
      start();
    },
  };

  return { index, next, prev, go, bindHover, stop, start };
}
