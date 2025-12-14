// src/components/AboutSection.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

// Use all available cover images from public/images/covers.
// These are static public assets and referenced by absolute paths.
const BG_IMAGES = [
  '/images/covers/bg1.jpg',
  '/images/covers/bg2.jpg',
  '/images/covers/bg3.jpg',
  '/images/covers/bg4.jpg',
  '/images/covers/fabrics-curtains-tailoring.jpg',
  '/images/covers/floorings-and-acoustics.jpg',
  '/images/covers/japanese-panel-style.jpg',
  '/images/covers/motorization-somfy-experts.png',
  '/images/covers/outdoor-solutions-and-skylights.jpg',
  '/images/covers/roller-blinds.jpg',
  '/images/covers/roman-blinds.jpg',
  '/images/covers/venetian-blinds.png',
  '/images/covers/vertical-wave-blinds.jpg',
  '/images/covers/wallpaper.jpg',
  '/images/covers/wave-style-curtains.jpg',
];

const SLIDE_MS = 6000;

// Simple Fisher-Yates shuffle for runtime random ordering
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AboutSection() {
  const { t, i18n } = useTranslation('about');
  // (debug logging removed)
  const isRTL = (typeof i18n.dir === 'function' ? i18n.dir() : i18n.dir) === 'rtl';
  const reduceMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [images, setImages] = useState<string[]>(BG_IMAGES);
  const isMounted = useRef(true);
  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);

  // start/stop autoplay (disabled for reduced motion)
  const start = useCallback(() => {
    if (reduceMotion || intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % BG_IMAGES.length);
    }, SLIDE_MS);
  }, [reduceMotion]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    if (!reduceMotion) start();

    // pause on tab hidden
    const onVis = () => (document.visibilityState === 'visible' ? start() : stop());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      isMounted.current = false;
      stop();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [start, stop, reduceMotion]);

  // preload next image to avoid flash
  useEffect(() => {
    const next = (index + 1) % images.length;
    const img = new Image();
    img.src = images[next];
  }, [index]);

  // Randomize slide order once at mount for variety
  useEffect(() => {
    setImages(shuffle(BG_IMAGES));
    setIndex(0);
  }, []);

  const [loaded, setLoaded] = useState(false);

  // text motion variants (mirror for RTL)
  const textVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, x: isRTL ? 50 : -50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.7, type: 'spring' } },
    }),
    [isRTL]
  );

  // keyboard navigation on the dot list (Left/Right or Arrow keys)
  const onDotsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key.toLowerCase();
    const isPrev = key === 'arrowleft' || key === 'left';
    const isNext = key === 'arrowright' || key === 'right';
    if (isPrev || isNext) {
      e.preventDefault();
      const dir = isRTL ? -1 : 1; // visual direction
      setIndex((i) => {
        const delta = isPrev ? -1 * dir : 1 * dir;
        return (i + delta + BG_IMAGES.length) % BG_IMAGES.length;
      });
      stop(); // stop autoplay after manual interaction
    }
  };

  // button click handler
  const goto = (i: number) => {
    setIndex(i);
    stop(); // stop autoplay after manual interaction
  };

  return (
    <section
      id="about"
      ref={containerRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden text-gray-900 dark:text-white"
      aria-label={t('sectionLabel', { defaultValue: 'About Abdulhaq Dimensions' })}
    >
  {/* BACKGROUND LAYER (ensure it's in the same stacking context, not negative) */}
  <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={index}
            src={images[index]}
            alt=""
            loading={'lazy'}
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: 'block' }}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: 'easeOut' }}
            onLoad={() => {
              setLoaded(true);
            }}
            onError={(e) => {
              // graceful gradient fallback
              (e.currentTarget.parentElement as HTMLElement).style.background =
                'linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%)';
              e.currentTarget.style.display = 'none';
            }}
          />
        </AnimatePresence>
  {/* Overlay behind content for readability (lighter in light mode, stronger in dark) */}
  <div className="absolute inset-0 bg-black/24 dark:bg-black/48 pointer-events-none" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 w-full">
        {/* Glassy text box: improves legibility over busy backgrounds. */}
        <div
          className="mx-auto max-w-3xl text-center rounded-2xl p-4 md:p-10
                     bg-white/80 text-gray-900 dark:bg-black/36 dark:text-white backdrop-blur-md
                     border border-black/10 dark:border-white/10 shadow-lg"
          style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/30"
        >
          <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white drop-shadow">
            {t('badge')}
          </span>
        </motion.div>

        <motion.h2
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white"
          style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.08), 0 0 20px rgba(0,0,0,0.04)' }}
        >
          {t('title')}
        </motion.h2>

        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-lg md:text-xl text-gray-800/95 dark:text-white/95 leading-relaxed mb-8"
          style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.04)' }}
        >
          {t('desc1')}
        </motion.p>

        </div>

        <motion.a
          href="/about"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold
                     bg-gradient-to-r from-accent to-brand
                     text-white shadow-xl hover:shadow-2xl transition"
          aria-label={t('discover_more')}
        >
          {t('discover_more')}
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </motion.a>
      </div>

      {/* DOTS (keyboard accessible) */}
      <div
        ref={dotsRef}
        className="absolute bottom-6 right-6 left-6 flex justify-end gap-2 z-10"
        role="tablist"
        aria-label={t('sliderDots', { defaultValue: 'Background slides' })}
        onKeyDown={onDotsKeyDown}
      >
        {BG_IMAGES.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={active}
              aria-label={t('goToSlide', { defaultValue: 'Go to slide {{n}}', n: i + 1 })}
              onClick={() => goto(i)}
              className={`w-3 h-3 rounded-full outline-none ring-offset-2 ring-white/80 transition
                          ${active ? 'bg-white scale-125' : 'bg-white/55 hover:bg-white/85'}
                          focus-visible:ring-2`}
            />
          );
        })}
      </div>
    </section>
  );
}
