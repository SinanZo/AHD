import { useEffect, useRef, useState } from 'react';

// Small helper hook to autoplay/pause a video based on viewport intersection.
// Ensures muted + playsInline for mobile/iOS. Returns ref + ready state for fade-in.
export default function useAutoplayVideo(options) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const threshold = (options && options.threshold) || 0.3;

  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(([entry]) => {
      const el = ref.current;
      if (!el) return;
      if (entry.isIntersecting) {
        try {
          el.muted = true;
          el.setAttribute('muted', '');
          el.setAttribute('playsinline', '');
          const p = el.play?.();
          if (p && typeof p.then === 'function') p.catch(() => {});
        } catch {
          // ignore play errors; caller can show a CTA
        }
      } else {
        try { el.pause?.(); } catch { /* ignore pause errors */ }
      }
    }, { threshold });

    io.observe(v);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, ready, setReady };
}
