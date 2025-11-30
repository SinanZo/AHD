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
      className="relative h-full w-full rounded-2xl overflow-hidden grid place-items-center ring-[0.5px] ring-white/10 shadow-lg"
      style={{ background: "var(--header-bg, rgba(8,20,24,.85))" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* blurred poster backdrop */}
      {/* blurred poster backdrop (behind the whole panel) */}
      <div
        className="absolute inset-0 opacity-100 -z-10"
        style={{
          backgroundImage: poster ? `url(${String(poster)})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(18px)",
          transform: "scale(1.08)",
        }}
        aria-hidden="true"
      />

      {/* Eyebrow + title, centered at the very top */}
          <div className="absolute top-3 inset-x-0 flex justify-center px-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-[color:var(--overlay)]/60 text-[color:var(--primary-contrast)] backdrop-blur ring-[0.5px] ring-[color:var(--stroke)]">{eyebrow}</span>
          <h3 className="text-[color:var(--primary-contrast)] text-[clamp(16px,2.4vw,22px)] font-bold drop-shadow whitespace-nowrap">{title}</h3>
        </div>
      </div>

      {/* The centered video card with enforced 16:9 aspect ratio */}
      <figure
        className="w-full max-w-[640px] aspect-[16/9] mx-auto rounded-2xl overflow-hidden bg-[color:var(--overlay)]/40 ring-[0.5px] ring-[color:var(--stroke)] shadow-2xl relative"
      >
        <video
          ref={vRef}
          className={`block w-full h-full object-cover ${ready ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
          style={{ objectPosition: "50% 50%" }}
          playsInline muted loop autoPlay preload="auto" poster={poster}
          aria-label={t("video.label","Decorative hero video")}
        >
          <source src={`${srcMp4}?v=5#t=0.01`} type="video/mp4" />
          {srcWebm && <source src={srcWebm} type="video/webm" />}
        </video>

        {/* Subtle semi-opaque overlay for readability. IMPORTANT: remove backdrop-blur
            here so the overlay does not blur the video content itself. The poster
            backdrop above (z -10) provides the blurred background effect. */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[color:var(--overlay)]/60" />
        </div>

        {/* controls in the card's top-right; enhanced visibility */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button type="button"
            onClick={toggleMute}
            className="hero-control focus-ring px-3 py-1.5 text-xs font-medium rounded-lg text-[color:var(--primary-contrast)] hover:opacity-90 border border-[color:var(--stroke)] backdrop-blur-sm shadow-lg transition-all duration-200"
            style={{ backgroundColor: 'var(--overlay-strong)' }}
            aria-label={muted ? t("video.muted","Video muted") : t("video.unmuted","Video unmuted")}
            aria-pressed={muted}
            title={muted ? t('video.muted','Muted') : t('video.unmuted','Unmuted')}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button type="button"
            onClick={togglePlay}
            className="hero-control focus-ring px-3 py-1.5 text-xs font-medium rounded-lg text-[color:var(--primary-contrast)] hover:opacity-90 border border-[color:var(--stroke)] backdrop-blur-sm shadow-lg transition-all duration-200"
            style={{ backgroundColor: 'var(--overlay-strong)' }}
            aria-label={paused ? t("video.paused","Video paused") : t("video.playing","Video playing")}
            aria-pressed={!paused}
            title={paused ? t('video.paused','Play') : t('video.playing','Pause')}
          >
            {paused ? "▶️" : "⏸️"}
          </button>
        </div>

        {/* enhanced overlay gradients for better contrast and readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[color:var(--overlay)]/15 via-transparent to-[color:var(--overlay)]/10" />
      </figure>

      {/* badges row under card */}
      {badges?.length > 0 && (
        <div className="absolute bottom-3 inset-x-0 flex justify-center px-3">
          <ul className="flex flex-wrap justify-center items-center gap-2">
            {badges.map((b, i) => (
              <li key={i}
                  className="px-3 py-1.5 rounded-full bg-[color:var(--overlay)]/60 text-[color:var(--primary-contrast)] text-[12px] ring-[0.5px] ring-[color:var(--stroke)]
                         hover:bg-[color:var(--overlay)]/80 backdrop-blur-sm">
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

