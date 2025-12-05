import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';

const bgImages = [
  '/images/covers/bg1.jpg',
  '/images/covers/bg2.jpg',
  '/images/covers/bg3.jpg'
];

export default function AboutSection() {
  const { t, i18n } = useTranslation('about');
  const isAr = i18n.language === 'ar';
  const [bgIndex, setBgIndex] = useState(0);
  const timeoutRef = useRef();
  const reduceMotion = useReducedMotion();

  // Auto switch backgrounds every 6s (disabled when prefers-reduced-motion)
  useEffect(() => {
    if (reduceMotion) return; // don't animate backgrounds
    timeoutRef.current = setTimeout(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearTimeout(timeoutRef.current);
  }, [bgIndex, reduceMotion]);

  const textVariants = {
    hidden: { opacity: 0, x: isAr ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, type: 'spring' }
    }
  };

  return (
    <section
      id="about"
      dir={isAr ? 'rtl' : 'ltr'}
  className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden text-white"
    >
      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgIndex}
            src={bgImages[bgIndex]}
            alt={`Slide ${bgIndex}`}
            initial={reduceMotion ? false : { opacity: 0, scale: 1.05 }}
            animate={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 1 }}
            className="w-full h-full object-cover"
            draggable={false}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background =
                'linear-gradient(135deg, #002b3a 0%, #5b7d89 100%)';
            }}
          />
        </AnimatePresence>
  {/* OVERLAY - keep behind content to avoid covering text */}
  <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 max-w-3xl text-center px-6">
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/50"
        >
          <Sparkles className="w-4 h-4 text-adh-accent" />
          <span className="text-sm font-semibold uppercase tracking-wide text-white drop-shadow">{t('badge')}</span>
        </motion.div>

        <motion.h2
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          className="text-5xl md:text-6xl font-bold leading-tight mb-6 relative z-40 text-white drop-shadow-2xl"
          style={{
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          {t('title')}
        </motion.h2>

        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          className="text-xl text-white/95 leading-relaxed mb-8"
          style={{
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
          }}
        >
          {t('desc1')}
        </motion.p>

        <motion.a
          href="/about"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
           className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold bg-linear-to-r from-[#5b7d89] to-[#002b3a] text-white shadow-xl hover:shadow-2xl transition"
        >
          {t('discover_more')}
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>

      {/* SLIDER DOTS */}
      <div className="absolute bottom-8 right-8 z-30 flex gap-2">
        {bgImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setBgIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === bgIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
