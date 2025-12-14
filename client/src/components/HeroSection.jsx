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
  const reduceMotion = useReducedMotion();
  const [forceMotion, setForceMotion] = useState(() => {
    try { return localStorage.getItem('AHD_forceMotion') === '1'; } catch { return false; }
  });
  const effectiveReduceMotion = reduceMotion && !forceMotion;

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
      return shuffle(list);
    } catch { return Array.isArray(covers) ? [...covers] : []; }
  });

  const hasCovers = Array.isArray(images) && images.length > 0;
  const [bgIndex, setBgIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const slideTimer = useRef(null);
  const progressTimer = useRef(null);

  const clearSlideTimer = () => {
    if (slideTimer.current) { clearInterval(slideTimer.current); slideTimer.current = null; }
  };
  const clearProgressTimer = () => {
    if (progressTimer.current) { clearInterval(progressTimer.current); progressTimer.current = null; }
  };

  useEffect(() => {
    clearSlideTimer();
    if (!hasCovers || paused) return;
    setBgIndex((i) => (i + 1) % images.length);
    slideTimer.current = window.setInterval(() => {
      setBgIndex((i) => (i + 1) % images.length);
    }, SLIDE_MS);
    return clearSlideTimer;
  }, [hasCovers, paused, forceMotion, images]);

  useEffect(() => {
    clearProgressTimer();
    if (!hasCovers || paused || effectiveReduceMotion) { setProgress(0); return; }
    setProgress(0);
    const step = (TICK_MS / SLIDE_MS) * 100;
    progressTimer.current = window.setInterval(() => {
      setProgress((p) => (p + step >= 100 ? 0 : p + step));
    }, TICK_MS);
    return clearProgressTimer;
  }, [hasCovers, paused, bgIndex, effectiveReduceMotion]);

  useEffect(() => {
    const onVis = () => {
      const visible = typeof document !== 'undefined' && document.visibilityState === 'visible';
      if (!visible) { clearSlideTimer(); clearProgressTimer(); }
      else if (!paused && !effectiveReduceMotion) { setProgress(0); }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [paused, effectiveReduceMotion]);

  useEffect(() => {
    const handler = (e) => {
      if (!e || !e.key) return;
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : null;
      const isEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable);
      if (isEditable) return;
      const k = e.key.toLowerCase();
      if (k === 'k') {
        try { setPaused((p) => !p); } catch { /* noop */ }
      } else if (k === 'm') {
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

  useEffect(() => {
    if (!hasCovers) return;
    const next = (bgIndex + 1) % images.length;
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = String(images[next]);
    } catch { /* ignore */ }
  }, [bgIndex, hasCovers, images]);

  const sectionRef = useRef(null);

  useEffect(() => {
    if (!isRTL || typeof window === 'undefined' || window.innerWidth > 640) return;
    const doReset = () => {
      try {
        if (document.documentElement) document.documentElement.scrollLeft = 0;
        if (document.body) document.body.scrollLeft = 0;
        window.scrollTo(0, 0);
        const els = document.querySelectorAll('.overflow-x-auto, .no-scrollbar, [data-horizontal-scroll]');
        els.forEach((el) => {
          try { if (el && typeof el.scrollLeft !== 'undefined') el.scrollLeft = 0; } catch { /* ignore */ }
        });
        const containers = document.querySelectorAll('main, .container, .hero, body, html');
        containers.forEach((c) => {
          if (!c || !(c instanceof HTMLElement)) return;
          if (c.scrollWidth > window.innerWidth + 1) c.scrollLeft = 0;
        });
      } catch { /* ignore */ }
    };

    const prevHtmlScroll = document.documentElement.style.scrollBehavior;
    const prevBodyScroll = document.body.style.scrollBehavior;
    try {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
    } catch { /* ignore */ }

    doReset();
    const t1 = window.setTimeout(doReset, 50);
    const t2 = window.setTimeout(doReset, 250);
    const raf = window.requestAnimationFrame(doReset);

    return () => {
      try {
        clearTimeout(t1);
        clearTimeout(t2);
        window.cancelAnimationFrame(raf);
        document.documentElement.style.scrollBehavior = prevHtmlScroll || '';
        document.body.style.scrollBehavior = prevBodyScroll || '';
      } catch { /* ignore */ }
    };
  }, [isRTL]);

  if (!hasCovers) return null;

  const badge = t('badge');
  const title = t('title');
  const subtitle = t('subtitle');
  const desc = t('description');
  const cta1 = t('cta1');
  const cta2 = t('cta2');
  const pauseLabel = paused ? t('play', 'Play') : t('pause', 'Pause');

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={t('sectionLabel', { defaultValue: 'Hero section' })}
      className="relative py-8 md:py-12 lg:py-16 min-h-screen overflow-hidden z-0"
    >
      <div className="container mx-auto w-full px-4 md:px-6 lg:px-8 flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-stretch lg:h-[calc(100vh-8rem)] lg:min-h-[720px] lg:max-h-[900px]">
        <div className={`order-1 lg:order-1 ${!effectiveReduceMotion ? 'animate-fade-in-up' : ''} group w-full min-h-[600px] lg:min-h-0`}>
          <div className="relative flex items-center h-full min-h-[600px] lg:min-h-full rounded-3xl overflow-hidden shadow-adh-soft ring-1 ring-white/10 dark:ring-white/5">
            <div className="absolute inset-0 z-0 hero-img-stack transition-transform duration-700 group-hover:scale-105" aria-hidden="true">
              {images.map((src, idx) => (
                <img
                  key={src + idx}
                  src={String(src)}
                  alt={idx === 0 ? t('heroImageAlt', 'Premium interior solutions showcase') : ''}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity ${idx === bgIndex ? 'opacity-100' : 'opacity-0'} ${(!effectiveReduceMotion) ? 'duration-700' : 'duration-0'}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  style={{ objectPosition: isRTL ? '74% 52%' : '26% 52%' }}
                />
              ))}
              <div className={`absolute inset-0 ${isRTL ? 'bg-linear-to-l from-black/60 via-black/50 to-black/25' : 'bg-linear-to-r from-black/60 via-black/50 to-black/25'}`} />
            </div>

            <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 relative z-30 w-full flex items-center h-full py-12 md:py-14 pb-24 md:pb-28 lg:pb-32">
              <div className={`text-white ${isRTL ? 'sm:text-right text-center' : 'sm:text-left text-center'} max-w-[680px] hero-text-contrast`}>
                {badge && (
                  <span className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase bg-adh-primary/90 text-white shadow-md ring-1 ring-white/20 mb-6">
                    {badge}
                  </span>
                )}

                <h1
                  className={`${isRTL ? 'font-arabic' : 'font-serif'} ${isRTL ? 'text-[clamp(28px,6vw,38px)]' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'} font-bold ${isRTL ? 'leading-normal' : 'leading-[1.05]'} tracking-[0.01em] text-white drop-shadow-[0_3px_15px_rgba(0,0,0,.65)] text-balance mt-6 mb-6`}
                >
                  {title}
                </h1>

                {subtitle ? (
                  <p className={`text-base md:text-lg font-medium text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,.5)] mb-6 ${isRTL ? 'leading-[1.9]' : 'leading-normal'}`}>
                    {subtitle}
                  </p>
                ) : isRTL ? (
                  <p className="text-sm font-normal text-white/70 mb-6 leading-[1.8]">
                    من الفلل السكنية إلى المقرات الرئيسية والمنتجعات
                  </p>
                ) : null}

                <p className={`text-base md:text-lg ${isRTL ? 'leading-[1.9]' : 'leading-[1.7]'} text-white/90 max-w-[70ch] mb-8`}>
                  {desc}
                </p>

                <div className={`flex flex-col sm:flex-row gap-4 items-stretch sm:items-center ${isRTL ? 'sm:flex-row-reverse sm:justify-end justify-center' : 'justify-center sm:justify-start'} mb-8 md:mb-10 lg:mb-12`}>
                  <a
                    href={WA_URL ? WA_URL(isRTL ? 'مرحبًا، أود طلب عرض سعر' : 'Hello, I would like to request a quote') : '#'}
                    target="_blank" rel="noopener noreferrer" aria-label={cta2}
                    className="w-full sm:w-auto"
                  >
                    <button className="w-full px-7 py-3.5 rounded-full font-semibold text-base bg-linear-to-r from-[#0a2a6b] to-[#1243b5] text-white border border-white/20 shadow-[0_6px_20px_rgba(18,67,181,0.35)] hover:scale-105 hover:shadow-[0_8px_28px_rgba(18,67,181,0.5)] transition-all duration-300">
                      {cta2}
                    </button>
                  </a>

                  <Link href="/products" aria-label={cta1} className="w-full sm:w-auto">
                    <button className="w-full px-7 py-3.5 rounded-full font-semibold text-base bg-linear-to-r from-white/15 to-white/5 text-white border border-white/30 backdrop-blur-sm shadow-[0_6px_18px_rgba(255,255,255,0.15)] hover:scale-105 hover:shadow-[0_8px_26px_rgba(255,255,255,0.25)] transition-all duration-300">
                      {cta1}
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2 md:bottom-3 lg:bottom-8 left-0 right-0 px-6 lg:px-8 flex items-center justify-center gap-3 z-40 pointer-events-auto">
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
                className="hero-control focus-ring text-[10px] md:text-[11px] px-2 py-1 rounded-full bg-black/35 text-white hover:bg-black/55 transition flex items-center justify-center"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={pauseLabel}
              >
                <span className="sm:hidden text-sm" aria-hidden>{paused ? '▶' : '❚❚'}</span>
                <span className="hidden sm:inline">{pauseLabel}</span>
              </button>
              {reduceMotion && (
                <div className="ml-3">
                  <button
                    type="button"
                    className="hero-control focus-ring text-[10px] md:text-[11px] px-2 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    onClick={() => {
                      try {
                        const v = !forceMotion;
                        setForceMotion(v);
                        localStorage.setItem('AHD_forceMotion', v ? '1' : '0');
                      } catch { /* ignore */ }
                    }}
                    title={forceMotion ? t('disableAnimations', 'Disable animations') : t('enableAnimations', 'Enable animations')}
                  >
                    {forceMotion ? t('disableAnimations', 'Disable animations') : t('enableAnimations', 'Enable animations')}
                  </button>
                </div>
              )}

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

        <div className={`order-2 lg:order-2 ${!effectiveReduceMotion ? 'animate-fade-in-scale' : ''} w-full min-h-[600px] lg:min-h-0`}>
          <HeroVideoPanel
            srcMp4="/videos/Blinds.mp4"
            srcWebm="/videos/Blinds.webm"
            poster={String(images[bgIndex] ?? images[0])}
            forceMotion={forceMotion}
            reduceMotion={effectiveReduceMotion}
          />
        </div>
      </div>
    </section>
  );
}
