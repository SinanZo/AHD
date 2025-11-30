import React, { useEffect, useMemo, useRef, useState } from 'react';

type CountUpNumberProps = {
  value: number;                // final value
  from?: number;                // start value
  durationMs?: number;          // animation duration
  decimals?: number;            // fixed decimal places
  prefix?: string;              // e.g., 'JD '
  suffix?: string;              // e.g., '+', '%'
  locale?: string;              // e.g., 'ar', 'en-JO'
  startOnView?: boolean;        // animate when visible
  startDelayMs?: number;        // optional delay before starting animation (ms)
  className?: string;
  'aria-label'?: string;
};

export default function CountUpNumber({
  value,
  from = 0,
  durationMs = 1000,
  decimals,
  prefix = '',
  suffix = '',
  locale,
  startOnView = true,
  startDelayMs = 0,
  className,
  ...rest
}: CountUpNumberProps) {
  const [shown, setShown] = useState<number>(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const resolvedLocale = useMemo(() => {
    if (locale) return locale;
    if (typeof document !== 'undefined' && document.documentElement?.lang) {
      return document.documentElement.lang;
    }
    if (typeof navigator !== 'undefined') return navigator.language;
    return 'en';
  }, [locale]);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(resolvedLocale, {
      minimumFractionDigits: typeof decimals === 'number' ? decimals : 0,
      maximumFractionDigits: typeof decimals === 'number' ? decimals : 0,
    });
  }, [resolvedLocale, decimals]);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setShown(value);
      setHasAnimated(true);
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }
    if (!startOnView) {
      if (startDelayMs && startDelayMs > 0) {
        timeoutRef.current = window.setTimeout(() => startAnimation(), startDelayMs);
      } else {
        startAnimation();
      }
      return;
    }
    const node = elRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated) {
            if (startDelayMs && startDelayMs > 0) {
              if (timeoutRef.current != null) clearTimeout(timeoutRef.current);
              timeoutRef.current = window.setTimeout(() => startAnimation(), startDelayMs);
            } else {
              startAnimation();
            }
            break;
          }
        }
      },
      { threshold: 0.35 }
    );

    io.observe(node);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, from, durationMs, startOnView, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  function startAnimation() {
    setHasAnimated(true);
    startRef.current = null;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    rafRef.current = requestAnimationFrame(step);
  }

  function step(ts: number) {
    if (startRef.current == null) startRef.current = ts;
    const elapsed = ts - (startRef.current ?? ts);
    const t = Math.min(1, elapsed / durationMs);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - t, 3);
    const current = from + (value - from) * eased;

    setShown(current);

    if (t < 1) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      setShown(value);
      rafRef.current = null;
    }
  }

  const text = prefix + formatter.format(shown) + suffix;

  return (
    <span ref={elRef} className={className} {...rest}>
      {text}
    </span>
  );
}
