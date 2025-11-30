import { useEffect, useRef, useState } from 'react';

export default function useCarousel(total: number, interval = 5000) {
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);
  const hovering = useRef(false);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const next = () => setIndex(i => (i + 1) % total);
  const prev = () => setIndex(i => (i - 1 + total) % total);
  const go = (i: number) => setIndex((i + total) % total);

  const stop = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
  const start = () => {
    if (reduced || hovering.current || total <= 1) return;
    stop(); timer.current = window.setInterval(next, interval);
  };

  useEffect(() => {
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();
    return () => { stop(); document.removeEventListener('visibilitychange', onVis); };
  }, [total, interval, reduced]);

  const bindHover = {
    onMouseEnter: () => { hovering.current = true; stop(); },
    onMouseLeave: () => { hovering.current = false; start(); },
  };

  return { index, next, prev, go, bindHover };
}
