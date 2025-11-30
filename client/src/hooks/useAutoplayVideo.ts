import { useEffect, useRef, useState } from 'react';
export default function useAutoplayVideo() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (!v) return;
      if (e.isIntersecting) { v.muted = true; v.playsInline = true; v.play().catch(()=>{}); }
      else { v.pause(); }
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return { ref, ready, setReady };
}
