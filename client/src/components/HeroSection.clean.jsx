import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useReducedMotion } from 'framer-motion';
import { WA_URL } from '../config';
import covers from '../data/covers.json';
import HeroVideoPanel from './HeroVideoPanel';

const SLIDE_MS = 5000;
const TICK_MS = 100;

export default function HeroSection() {
  const { t, i18n } = useTranslation(['hero']);
  const isRTL = (typeof i18n.dir === 'function' ? i18n.dir() : 'ltr') === 'rtl';
  // language key (i18n.language) is available via i18n when needed
  const reduceMotion = useReducedMotion();
  // Allow users to opt-in to animations even when system reduced-motion is set.
  const [forceMotion, setForceMotion] = useState(() => {
    try { return localStorage.getItem('AHD_forceMotion') === '1'; } catch { return false; }
  });
  const effectiveReduceMotion = reduceMotion && !forceMotion;

  // Local images array so we can shuffle/tune ordering without mutating the imported data
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const [images] = useState(() => {
    try {
      const list = Array.isArray(covers) ? [...covers] : [];
      // Shuffle at mount for a fresh visual each load
      return shuffle(list);
    } catch { return Array.isArray(covers) ? [...covers] : []; }
  });

  // --- slideshow state ---
  const hasCovers = Array.isArray(images) && images.length > 0;
  const [bgIndex, setBgIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const slideTimer = useRef(/** number|null */ null);
  const progressTimer = useRef(/** number|null */ null);

  // helpers
  const clearSlideTimer = () => {
    if (slideTimer.current) { clearInterval(slideTimer.current); slideTimer.current = null; }
  };
  const clearProgressTimer = () => {
    if (progressTimer.current) { clearInterval(progressTimer.current); progressTimer.current = null; }
  };

  // drive slide changes (paused only). We still advance slides when the
  // user has prefers-reduced-motion; animations will be disabled in that case
  useEffect(() => {
    clearSlideTimer();
    // slide when we have covers and not paused
    if (!hasCovers || paused) return;

  // Immediate kick to avoid first-slide "stuck" feel
  setBgIndex((i) => (i + 1) % images.length);

    slideTimer.current = window.setInterval(() => {
      setBgIndex((i) => (i + 1) % images.length);
    }, SLIDE_MS);
    return clearSlideTimer;
  }, [hasCovers, paused, forceMotion, images]);

  // progress bar
  useEffect(() => {
    clearProgressTimer();
    if (!hasCovers || paused || effectiveReduceMotion) { setProgress(0); return; }
    setProgress(0);
    const step = (TICK_MS / SLIDE_MS) * 100;
    progressTimer.current = window.setInterval(() => {
      setProgress(p => (p + step >= 100 ? 0 : p + step));
    }, TICK_MS);
    return clearProgressTimer;
  }, [hasCovers, paused, bgIndex, effectiveReduceMotion]);

  // pause/resume with tab visibility
  useEffect(() => {
    const onVis = () => {
      const visible = typeof document !== 'undefined' && document.visibilityState === 'visible';
      if (!visible) { clearSlideTimer(); clearProgressTimer(); }
      else if (!paused && !effectiveReduceMotion) {
        // restart fresh so progress bar aligns with slide
        setProgress(0);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [paused, effectiveReduceMotion]);

  // Keyboard shortcuts: 'k' to toggle pause/play, 'm' to toggle forceMotion opt-in.
  // Ignore when focus is inside form controls or contentEditable regions.
  useEffect(() => {
    const handler = (e) => {
      if (!e || !e.key) return;
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : null;
      const isEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable);
      if (isEditable) return;
      const k = e.key.toLowerCase();
      if (k === 'k') {
        // toggle pause/play
        try { setPaused(p => !p); } catch { /* ignore */ }
      } else if (k === 'm') {
        // toggle local forceMotion opt-in
        try {
          const next = !forceMotion;
          setForceMotion(next);
          try { localStorage.setItem('AHD_forceMotion', next ? '1' : '0'); } catch { /* ignore */ }
        } catch { /* ignore */ }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [forceMotion]);

  // preload next image
  useEffect(() => {
    if (!hasCovers) return;
    const next = (bgIndex + 1) % images.length;
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = String(images[next]);
    } catch { void 0; }
  }, [bgIndex, hasCovers, images]);

  // section ref used for intersection/visibility and layout
  const sectionRef = useRef(null);

  // Fix for some mobile browsers that start RTL pages scrolled to the far-right.
  // Run a small sequence of resets (immediate + retries) and temporarily disable
  // smooth scrolling while doing so to ensure we land at the visual start.
  useEffect(() => {
    if (!isRTL || typeof window === 'undefined' || window.innerWidth > 640) return;

    const doReset = () => {
      try {
        // Reset document/body scroll position
        if (document.documentElement) document.documentElement.scrollLeft = 0;
        if (document.body) document.body.scrollLeft = 0;
        // Generic scrollTo to ensure viewport is at the start
        window.scrollTo(0, 0);

        // Reset any horizontally scrollable lists (e.g. carousel dots)
        const els = document.querySelectorAll('.overflow-x-auto, .no-scrollbar, [data-horizontal-scroll]');
        els.forEach((el) => {
          try {
            if (el && typeof el.scrollLeft !== 'undefined') el.scrollLeft = 0;
            // if element is offset via transforms, also nudge scrollLeft if possible
          } catch (e) { void e; }
        });

        // Defensive: ensure root/containers aren’t wider than viewport
        try {
          const containers = document.querySelectorAll('main, .container, .hero, body, html');
          containers.forEach((c) => {
            if (!c || !(c instanceof HTMLElement)) return;
            if (c.scrollWidth > window.innerWidth + 1) {
              // nudge to start
              c.scrollLeft = 0;
            }
          });
          // DEV-only diagnostics: list elements wider than viewport to help track down offenders
          try {
            if (import.meta?.env?.DEV) {
              const offenders = Array.from(document.querySelectorAll('*')).filter(el => el instanceof HTMLElement && el.scrollWidth > window.innerWidth + 1);
              if (offenders.length) {
                console.debug('[hero] RTL-reset found overflowing elements (first 5):', offenders.slice(0,5).map(el => ({ tag: el.tagName, class: el.className, w: el.scrollWidth })));
              }
            }
          } catch (e) { void e; }
        } catch (e) { void e; }
      } catch (e) { void e; }
    };

    // Temporarily disable smooth scrolling to avoid animated shifts
    const prevHtmlScroll = document.documentElement.style.scrollBehavior;
    const prevBodyScroll = document.body.style.scrollBehavior;
    try {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
    } catch (e) { void e; }

    // Run immediate + a couple of delayed retries to catch late layout changes
    doReset();
    const t1 = window.setTimeout(doReset, 50);
    const t2 = window.setTimeout(doReset, 250);
    const raf = window.requestAnimationFrame(doReset);

    return () => {
      try {
        clearTimeout(t1);
        clearTimeout(t2);
        window.cancelAnimationFrame(raf);
        // restore previous scroll behavior
        document.documentElement.style.scrollBehavior = prevHtmlScroll || '';
        document.body.style.scrollBehavior = prevBodyScroll || '';
      } catch (e) { void e; }
    };
  }, [isRTL]);

  if (!hasCovers) return null;

  // i18n content
  const badge      = t('badge');
  const title      = t('title');
  const subtitle   = t('subtitle');
  const desc       = t('description');
  const cta1       = t('cta1');
  const cta2       = t('cta2');
  // const chips = t('chips', { returnObjects: true });
  const pauseLabel = paused ? t('play', 'Play') : t('pause', 'Pause');

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={t('sectionLabel', { defaultValue: 'Hero section' })}
      className="relative pt-4 md:pt-6 min-h-screen overflow-hidden z-0"
    >
      <div className="min-h-screen w-full px-4 md:px-6 gap-6 grid grid-cols-1 lg:grid-cols-2 items-stretch">
        {/* Left: image/words */}
        <div className={isRTL ? 'order-2 lg:order-1' : 'order-1'}>
          <div className="relative flex items-center min-h-[85vh] md:min-h-screen rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10 dark:ring-white/5">
            <div className="absolute inset-0 z-0 hero-img-stack" aria-hidden="true">
              {/* Crossfading image stack for smooth transitions and better centering */}
              {images.map((src, idx) => (
                <img
                  key={src + idx}
                  src={String(src)}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity ${idx === bgIndex ? 'opacity-100' : 'opacity-0'} ${(!effectiveReduceMotion) ? 'duration-700' : 'duration-0'}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  style={{ objectPosition: isRTL ? '74% 52%' : '26% 52%' }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
            </div>

            <div className="container mx-auto px-5 sm:px-8 lg:px-10 relative z-30">
              <div className={`text-white mx-auto ${isRTL ? 'sm:text-right text-center' : 'sm:text-left text-center'} max-w-[680px] sm:max-w-[600px] lg:max-w-[640px] hero-text-contrast`}>
                {/* Readability layer removed per design — keep background gradient in image stack instead */}
                {badge && (
                  <span className="inline-block px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase bg-accent text-white shadow-lg ring-1 ring-white/20 mb-4 sm:mb-5">
                    {badge}
                  </span>
                )}

                <h1
                  className={`hero-title ${isRTL ? 'font-arabic' : ''} text-[clamp(26px,5vw,54px)] font-extrabold leading-[1.05]
             tracking-[0.3px] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.55)] [text-wrap:balance]`}
                  data-stroke
                >
                  <span className={isRTL ? 'no-underline' : 'u-underline'}>{title}</span>
                </h1>

                {subtitle ? (
                  <p className="mt-2 text-[clamp(12px,1.7vw,16px)] font-semibold text-white/92 drop-shadow-[0_1px_6px_rgba(0,0,0,.55)]">
                    {subtitle}
                  </p>
                ) : isRTL ? (
                  <p className="mt-2 text-[10px] font-normal text-white/60 opacity-60">
                    من الفلل السكنية إلى المقرات الرئيسية والمنتجعات
                  </p>
                ) : null}

                <p className="text-sm sm:text-base md:text-lg mb-6 leading-relaxed text-gray-100">
                  {desc}
                </p>

                <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center ${isRTL ? 'sm:flex-row-reverse sm:justify-end justify-center' : 'justify-center sm:justify-start'}`}>
                  <Link href="/products" aria-label={cta1}>
                    <button className="w-full sm:w-auto px-6 py-3 sm:px-7 rounded-full font-semibold text-sm sm:text-base bg-white text-brand border border-white/70 shadow-lg hover:bg-accent hover:text-white transition">
                      {cta1}
                    </button>
                  </Link>

                  <a
                    href={WA_URL ? WA_URL(isRTL ? 'مرحبًا، أود طلب عرض سعر' : 'Hello, I would like to request a quote') : '#'}
                    target="_blank" rel="noopener noreferrer" aria-label={cta2}
                  >
                    <button className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-sm sm:text-base bg-black/15 text-white border border-white/60 shadow hover:bg-white hover:text-brand transition">
                      {cta2}
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* controls */}
            <div className="absolute bottom-4 left-0 right-0 px-6 lg:px-8 flex items-center justify-center gap-3 z-10">
              {/* Accessible live region for screen readers announcing pause/play and motion state */}
              <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {paused ? t('announcePaused', 'Slideshow paused') : (forceMotion ? t('announcePlayingMotion', 'Slideshow playing (motion enabled)') : t('announcePlaying', 'Slideshow playing'))}
              </div>
              {!effectiveReduceMotion && (
                <div className="hidden sm:block w-40 h-1.5 rounded-full bg-white/25 overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-white/90 transition-[width] duration-100" style={{ width: `${progress}%` }} />
                </div>
              )}

              

              <button
                type="button"
                className="hero-control focus-ring ml-2 text-xs px-2.5 py-1 rounded-full bg-black/35 text-white hover:bg-black/55 transition flex items-center justify-center"
                onClick={() => setPaused(p => !p)}
                aria-pressed={paused}
                aria-label={pauseLabel}
              >
                <span className="sm:hidden text-sm" aria-hidden>{paused ? '▶' : '❚❚'}</span>
                <span className="hidden sm:inline">{pauseLabel}</span>
              </button>
              {/* When the user's system prefers reduced motion, offer a local opt-in control so they can enable the slideshow/video if they choose. */}
              {reduceMotion && (
                <div className="ml-3">
                  <button
                    type="button"
                    className="hero-control focus-ring text-xs px-2.5 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    onClick={() => {
                      try { const v = !forceMotion; setForceMotion(v); localStorage.setItem('AHD_forceMotion', v ? '1' : '0'); } catch (e) { void e; }
                    }}
                    title={forceMotion ? t('disableAnimations', 'Disable animations') : t('enableAnimations', 'Enable animations')}
                  >
                    {forceMotion ? t('disableAnimations', 'Disable animations') : t('enableAnimations', 'Enable animations')}
                  </button>
                </div>
              )}

              {/* Visible hint for keyboard shortcuts on larger screens */}
              <div className="hidden sm:flex items-center gap-2 ml-3 text-white/80 text-xs" aria-hidden>
                <span className="px-2 py-1 rounded bg-black/30 font-medium">K</span>
                <span className="opacity-80">{t('hintPause', 'pause/play')}</span>
                <span className="mx-2">•</span>
                <span className="px-2 py-1 rounded bg-black/30 font-medium">M</span>
                <span className="opacity-80">{t('hintMotion', 'toggle motion')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: video card — replaced with HeroVideoPanel (keeps left column untouched) */}
        <div className={isRTL ? 'order-1 lg:order-2' : 'order-2'}>
          <HeroVideoPanel
            srcMp4="/videos/Blinds.mp4"
            srcWebm="/videos/Blinds.webm"
            poster={String(images[bgIndex] ?? images[0])}
            forceMotion={forceMotion}
          />
        </div>
      </div>
    </section>
  );
}
