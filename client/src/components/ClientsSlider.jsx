import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import createTT from "../lib/tt";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* Prefers-reduced-motion (no Framer warning) */
function useReducedMotionStrict() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener ? mq.addEventListener("change", update) : mq.addListener(update);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", update) : mq.removeListener(update));
  }, []);
  if (typeof window !== "undefined" && window.__DISABLE_REDUCED_MOTION_WARNING) return false;
  return reduced;
}

// Load clients data from i18n
function useClientLogos() {
  const { t } = useTranslation("clients");
  return t("clients", { returnObjects: true }) || [];
}

export default function ClientsSlider() {
  const { t, i18n } = useTranslation("clients");
  const tt = createTT(t, "clients");
  const isRTL = i18n.dir() === "rtl";
  const reduced = useReducedMotionStrict();

  const clients = useClientLogos();
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(!reduced);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleLogos, setVisibleLogos] = useState(5);
  const [srMsg, setSrMsg] = useState("");


  // Responsive visible logos count
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      setVisibleLogos(w < 640 ? 2 : w < 768 ? 3 : w < 1024 ? 4 : 5);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const totalGroups = Math.max(1, Math.ceil(clients.length / Math.max(1, visibleLogos)));
  const activeGroup = Math.min(totalGroups, Math.floor(currentIndex / Math.max(1, visibleLogos)) + 1);
  const progress = Math.min(100, Math.round(((currentIndex + Math.min(visibleLogos, clients.length)) / clients.length) * 100));

  const computeItemWidth = useCallback(() => {
    try {
      const container = containerRef.current;
      const first = container?.querySelector(":scope > *");
      if (!first) return 260;
      const rect = first.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(container).gap) || 0;
      return rect.width + gap;
    } catch {
      return 260;
    }
  }, []);

  const scrollToIndex = useCallback((index) => {
    const el = containerRef.current;
    if (!el) return;
    const itemW = computeItemWidth();
    const target = Math.max(0, Math.min(index, Math.max(0, clients.length - visibleLogos))) * itemW;
    el.scrollTo({ left: target, behavior: "smooth" });
    setCurrentIndex(Math.max(0, Math.min(index, clients.length - visibleLogos)));
  }, [clients.length, visibleLogos, computeItemWidth]);

  const scrollLeft = useCallback(() => {
    const newIdx = currentIndex > 0 ? currentIndex - 1 : clients.length - visibleLogos;
    scrollToIndex(newIdx);
  }, [currentIndex, clients.length, visibleLogos, scrollToIndex]);

  const scrollRight = useCallback(() => {
    let newIdx = currentIndex + 1;
    if (newIdx > clients.length - visibleLogos) newIdx = 0;
    scrollToIndex(newIdx);
  }, [currentIndex, clients.length, visibleLogos, scrollToIndex]);

  const toggleAutoPlay = () => setIsAutoPlaying((v) => !v);

  // Pause when tab hidden / section offscreen / focused
  useEffect(() => {
    const onVis = () => setIsPaused(document.visibilityState !== "visible");
    document.addEventListener("visibilitychange", onVis);
    let io;
    if (sectionRef.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => setIsPaused((p) => e.isIntersecting ? p : true)),
        { threshold: 0.1 }
      );
      io.observe(sectionRef.current);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  // Auto-scroll (disabled if reduced motion)
  useEffect(() => {
    if (!isAutoPlaying || isPaused || reduced) return;
    const id = setInterval(() => (isRTL ? scrollLeft() : scrollRight()), 4000);
    return () => clearInterval(id);
  }, [isAutoPlaying, isPaused, reduced, isRTL, scrollLeft, scrollRight]);

  // Keyboard: only when slider has focus
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        isRTL ? scrollRight() : scrollLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        isRTL ? scrollLeft() : scrollRight();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggleAutoPlay();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [isRTL, scrollLeft, scrollRight]);

  // SR announcements after interaction
  useEffect(() => {
    setSrMsg(
      `${tt("sliderHeading")} — ${tt("group")} ${activeGroup} ${tt("of", { defaultValue: "of" })} ${totalGroups}`
    );
  }, [activeGroup, totalGroups]); // eslint-disable-line react-hooks/exhaustive-deps

  // Anim variants (respect reduced motion)
  const cardVariants = useMemo(
    () => ({
      initial: reduced ? { opacity: 1, y: 0, scale: 1 } : { y: 24, opacity: 0, scale: 0.97 },
      animate: (i) => (reduced
        ? { opacity: 1, y: 0, scale: 1 }
        : { y: 0, opacity: 1, scale: 1, transition: { delay: i * 0.025, duration: 0.6, type: "spring", stiffness: 180 } }),
      whileHover: reduced ? {} : { y: -12, scale: 1.08, rotate: -2 },
    }),
    [reduced]
  );

  const playPauseIcon = isAutoPlaying ? (
    <motion.div key="pause" initial={{ rotate: -90, scale: 0.7, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0.7, opacity: 0 }} transition={{ duration: 0.3 }}>
      <Pause className="w-5 h-5 text-adh-text" aria-hidden="true" />
    </motion.div>
  ) : (
    <motion.div key="play" initial={{ rotate: 90, scale: 0.7, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -90, scale: 0.7, opacity: 0 }} transition={{ duration: 0.3 }}>
      <Play className="w-5 h-5 text-adh-text" aria-hidden="true" />
    </motion.div>
  );

  // Quiet unused import warning in ESLint for `motion` when tree-shaken out in some builds.
  // Harmless runtime no-op reference so the import isn't considered unused.
  void motion;

  // Guard: nothing to render (keeps hooks unconditional above)
  if (!Array.isArray(clients) || clients.length === 0) return null;

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="py-32 relative overflow-hidden bg-adh-bg-linen dark:bg-adh-bg"
      role="region"
      aria-roledescription="carousel"
      aria-label={tt("sliderHeading")}
      aria-live="off"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-20 z-0 bg-adh-accent" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-20 z-0 bg-adh-brand" aria-hidden="true" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-wider text-adh-text">
            {tt("sliderHeading")}
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-adh-text-secondary">
            {tt("sliderSubheading")}
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div className="flex justify-center items-center gap-6 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          <button
            onClick={toggleAutoPlay}
            className="flex items-center gap-3 px-6 py-3 bg-adh-surface rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-adh-accent hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adh-accent"
            aria-pressed={isAutoPlaying}
            aria-label={isAutoPlaying ? tt("pauseAutoplay", { defaultValue: "Pause autoplay" }) : tt("playAutoplay", { defaultValue: "Play autoplay" })}
          >
            <AnimatePresence mode="wait" initial={false}>{playPauseIcon}</AnimatePresence>
            <span className="text-base font-semibold text-adh-text">
              {isAutoPlaying ? tt("pause") : tt("play")}
            </span>
          </button>

          <div className="text-base font-medium bg-adh-surface px-6 py-3 rounded-full shadow-lg border-2 border-adh-stroke text-adh-text-muted">
            {currentIndex + 1}–{Math.min(currentIndex + visibleLogos, clients.length)} {tt("of", { defaultValue: "of" })} {clients.length}
          </div>
        </motion.div>

        {/* Slider */}
        <motion.div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          initial={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.6 }}
        >
          {/* Nav arrows */}
          <motion.button
            onClick={isRTL ? scrollRight : scrollLeft}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 sm:w-16 sm:h-16 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-adh-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adh-accent"
            whileHover={reduced ? {} : { scale: 1.13 }}
            whileTap={reduced ? {} : { scale: 0.96 }}
            aria-label={isRTL ? tt("next", { defaultValue: "Next logos" }) : tt("previous", { defaultValue: "Previous logos" })}
            aria-controls="clients-carousel"
          >
            <ChevronLeft className="w-7 h-7 text-adh-text" aria-hidden="true" />
          </motion.button>

          <motion.button
            onClick={isRTL ? scrollLeft : scrollRight}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 sm:w-16 sm:h-16 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-adh-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-adh-accent"
            whileHover={reduced ? {} : { scale: 1.13 }}
            whileTap={reduced ? {} : { scale: 0.96 }}
            aria-label={isRTL ? tt("previous", { defaultValue: "Previous logos" }) : tt("next", { defaultValue: "Next logos" })}
            aria-controls="clients-carousel"
          >
            <ChevronRight className="w-7 h-7 text-adh-text" aria-hidden="true" />
          </motion.button>

          {/* Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-(--bg-linen) dark:from-(--bg) to-transparent z-10 pointer-events-none" aria-hidden="true" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-(--bg-linen) dark:from-(--bg) to-transparent z-10 pointer-events-none" aria-hidden="true" />

          {/* Track */}
          <div
            id="clients-carousel"
            ref={containerRef}
            className="flex gap-12 overflow-x-auto scroll-smooth scrollbar-hide py-10 px-14 sm:px-20 focus:outline-none"
            tabIndex={0}
            role="group"
            aria-label={tt("sliderHeading")}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            {clients.map((client, i) => (
              <motion.div
                key={`${client.name}-${i}`}
                className="relative min-w-[200px] sm:min-w-[230px] md:min-w-[260px] max-w-[260px] h-28 sm:h-32 flex items-center justify-center"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                custom={i}
                whileHover={cardVariants.whileHover}
              >
                <div
                  className="relative w-full h-full bg-adh-surface/90 dark:bg-adh-surface/80 rounded-2xl shadow-adh-soft hover:shadow-2xl transition-all duration-300 p-5 group glass-effect gradient-border"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 relative z-10"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml;base64,${btoa(
                        `<svg width="240" height="120" xmlns="http://www.w3.org/2000/svg">
                           <rect width="240" height="120" fill="#e8e6e6"/>
                           <text x="120" y="65" text-anchor="middle" fill="#5b7d89" font-family="Inter, Arial" font-size="18" font-weight="600">${client.name}</text>
                         </svg>`
                      )}`;
                    }}
                  />
                  <div
                    className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full bg-adh-brand text-white text-xs font-semibold shadow-xl pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    {client.name}
                  </div>
                  <div className="absolute -top-3 -left-3 bg-linear-to-tr from-(--accent) to-(--brand) w-8 h-8 flex items-center justify-center text-white font-bold text-xs rounded-full shadow-md border-2 border-adh-stroke z-30">
                    {i + 1}
                  </div>
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-90 transition-opacity duration-300 bg-adh-overlay"
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div className="mt-12 max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
          <div className="w-full bg-adh-surface rounded-full h-3 overflow-hidden shadow-inner border-2 border-adh-stroke">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-(--accent) to-(--brand)"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              aria-hidden="true"
            />
          </div>
          <div className="flex justify-between text-base font-medium mt-4 text-adh-text-muted">
            <span>{t("start")}</span>
            <span className="font-bold text-adh-brand">
              {progress}% {t("complete")}
            </span>
            <span>{t("end")}</span>
          </div>
        </motion.div>

        {/* Dots */}
        <motion.div className="flex justify-center gap-3 mt-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
          {Array.from({ length: totalGroups }, (_, i) => {
            const selected = activeGroup === i + 1;
            return (
              <button
                key={i}
                onClick={() => scrollToIndex(i * visibleLogos)}
                className={`h-3 rounded-full transition-all duration-300 ${selected ? "w-8 bg-linear-to-r from-(--accent) to-(--brand) opacity-100" : "w-3 hover:w-4 bg-(--accent) opacity-50"}`}
                role="tab"
                aria-selected={selected}
                aria-controls="clients-carousel"
                aria-label={`${tt("goToGroup", { defaultValue: "Go to clients group" })} ${i + 1} ${tt("of", { defaultValue: "of" })} ${totalGroups}`}
              />
            );
          })}
        </motion.div>

        {/* Live announcements */}
        <span className="sr-only" aria-live="polite">
          {srMsg}
        </span>
      </div>

      {/* Styles */}
      <style>{`
        .gradient-border {
          border: 2px solid;
          border-image: linear-gradient(90deg, var(--accent), var(--brand), var(--accent), var(--brand)) 1;
          animation: gradientBorderMove 3s linear infinite;
        }
        @keyframes gradientBorderMove {
          0% { border-image-source: linear-gradient(90deg, var(--accent), var(--brand), var(--accent), var(--brand)); }
          50% { border-image-source: linear-gradient(270deg, var(--brand), var(--accent), var(--brand), var(--accent)); }
          100% { border-image-source: linear-gradient(90deg, var(--accent), var(--brand), var(--accent), var(--brand)); }
        }
        .glass-effect { backdrop-filter: blur(7px) saturate(1.15); background: var(--surface-glass, rgba(255,255,255,0.85)); }
        .dark .glass-effect { background: var(--surface-glass-dark, rgba(30,42,50,0.80)); }
      `}</style>
    </section>
  );
}
