import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from 'framer-motion';

/**
 * Video panel used in the right column of the hero only.
 * - Centers the content inside the card.
 * - Restores blurred background behind the card.
 * - Shows eyebrow (small label) above, badges under the card.
 * - Keeps the visible control labels in EN (Play/Pause, Muted/Unmuted)
 *   but localizes aria-labels via i18n for accessibility.
 */
export default function HeroVideoPanel({
  srcMp4 = "/videos/Blinds.mp4",
  srcWebm = "/videos/Blinds.webm",
  poster,
  forceMotion = false,
}) {
  const { t, i18n } = useTranslation("hero");
  const isRTL = i18n.dir() === "rtl";

  const vRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const reduceMotion = useReducedMotion();

  const eyebrow = t("video.eyebrow", "Blind Motorization");
  const title = t("video.title", "Smart Control • Instant Comfort");
  const badges = useMemo(() => {
    const arr = t("video.badges", { returnObjects: true }) || [];
    return Array.isArray(arr) ? arr : [];
  }, [t]);

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.preload = "auto";
    try {
      v.playsInline = true;
    } catch { void 0; }
    const effectiveReduced = reduceMotion && !forceMotion;
    const onCanPlay = () => {
      setReady(true);
      // Respect the user's reduced-motion preference unless forceMotion is set in the UI.
      if (!effectiveReduced) {
        v.play().catch(() => {});
        setPaused(false);
      } else {
        // keep paused to respect preference
        try { v.pause(); } catch { /* ignore */ }
        setPaused(true);
      }
    };
    v.addEventListener("canplay", onCanPlay);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [i18n.language, reduceMotion, forceMotion]);

  const togglePlay = () => {
    const v = vRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const toggleMute = () => {
    const v = vRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  // Keyboard shortcuts: 'k' toggles play/pause, 'm' toggles mute. Skip when typing in inputs.
  useEffect(() => {
    function onKey(e) {
      const tag = (e.target && e.target.tagName) || '';
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || (e.target && e.target.isContentEditable);
      if (isInput) return;
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
      // Space toggling is supported when focusing a control, avoid global space handler.
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      className="relative h-full w-full min-h-[500px] rounded-3xl overflow-hidden flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 py-10 md:py-12 ring-1 ring-adh-stroke/30 shadow-adh-soft group"
      style={{ background: "linear-gradient(135deg, rgba(8,20,24,.92) 0%, rgba(11,36,71,.88) 100%)" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* blurred poster backdrop (behind the whole panel) */}
      {poster && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${String(poster)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(18px)",
            transform: "scale(1.08)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Eyebrow + title at top */}
      <div className="flex flex-col items-center gap-3 md:gap-4 text-center mb-6 md:mb-8">
        <span className="inline-block px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase bg-adh-primary/90 text-adh-btn-fg shadow-lg ring-1 ring-adh-stroke/20">{eyebrow}</span>
        <h2 className="text-adh-btn-fg text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight drop-shadow-[0_3px_15px_rgba(0,0,0,.65)] px-2">{title}</h2>
      </div>

      {/* The centered video card with enforced 16:9 aspect ratio */}
      <figure
        className="w-full max-w-full sm:max-w-[640px] lg:max-w-[720px] aspect-video mx-auto rounded-2xl md:rounded-3xl overflow-hidden bg-black/50 ring-1 ring-adh-stroke/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.4)] relative transition-transform duration-700 group-hover:scale-[1.02]"
      >
        <video
          ref={vRef}
          className={`block w-full h-full object-cover ${ready ? "opacity-100" : "opacity-60"} transition-opacity duration-500`}
          style={{ objectPosition: "50% 50%" }}
          playsInline muted loop autoPlay preload="metadata" poster={poster}
          aria-label={t("video.label","Decorative hero video showcasing motorized blinds")}
          title={t("video.title", "Smart blind motorization demonstration")}
        >
          <source src={`${srcMp4}?v=5#t=0.01`} type="video/mp4" />
          {srcWebm && <source src={srcWebm} type="video/webm" />}
        </video>

        {/* Subtle overlay gradient for better contrast with controls */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/5 via-transparent to-black/10" aria-hidden="true" />

        {/* controls in the card's top-right; enhanced visibility */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1.5 sm:gap-2 z-10">
          <button type="button"
            onClick={toggleMute}
            className="hero-control focus-ring px-3.5 py-2 text-sm font-medium rounded-full bg-black/60 text-adh-btn-fg hover:bg-black/75 border border-adh-stroke/20 backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105"
            aria-label={muted ? t("video.muted","Video muted") : t("video.unmuted","Video unmuted")}
            aria-pressed={muted}
            title={muted ? t('video.muted','Muted') : t('video.unmuted','Unmuted')}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button type="button"
            onClick={togglePlay}
            className="hero-control focus-ring px-3.5 py-2 text-sm font-medium rounded-full bg-black/60 text-adh-btn-fg hover:bg-black/75 border border-adh-stroke/20 backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-105"
            aria-label={paused ? t("video.paused","Video paused") : t("video.playing","Video playing")}
            aria-pressed={!paused}
            title={paused ? t('video.paused','Play') : t('video.playing','Pause')}
          >
            {paused ? "▶️" : "⏸️"}
          </button>
        </div>

        {/* enhanced overlay gradients for better contrast and readability */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/10" />
      </figure>

      {/* badges row under video */}
      {badges?.length > 0 && (
        <div className="flex justify-center mt-6 md:mt-8">
          <ul className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
            {badges.map((b, i) => (
              <li key={i}
                className="inline-flex items-center rounded-full px-4 py-2 text-xs md:text-sm font-medium bg-adh-surface/10 text-adh-btn-fg border border-adh-stroke/20 shadow-sm">
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

