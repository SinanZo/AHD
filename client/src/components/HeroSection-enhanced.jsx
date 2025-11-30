import React, { useEffect, useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

// Hero covers: all available cover images
const coverImages = [
  'bg1.jpg',
  'bg2.jpg',
  'bg3.jpg',
  'bg4.jpg',
  'fabrics-curtains-tailoring.jpg',
  'floorings-and-acoustics.jpg',
  'japanese-panel-style.jpg',
  'motorization-somfy-experts.png',
  'outdoor-solutions-and-skylights.jpg',
  'roller-blinds.jpg',
  'roman-blinds.jpg',
  'venetian-blinds.png',
  'vertical-wave-blinds.jpg',
  'wallpaper.jpg',
  'wave-style-curtains.jpg',
  'accessories.png',
];

const covers = coverImages.map(img => `/images/covers/${img}`);
const SLIDE_MS = 5000;

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  
  // Compute RTL on each render to ensure reactivity to language changes
  const isRTL = i18n.dir() === 'rtl';
  
  const [bgIndex, setBgIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const hoveringRef = useRef(false);
  const sectionRef = useRef(null);
  
  // Detect reduced motion and save-data
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const saveData = typeof navigator !== 'undefined' && 
    navigator?.connection?.saveData;

  // Safe text getter with fallbacks
  const fallbacks = {
    'hero.title': 'Comprehensive Project Solutions',
    'hero.description': 'We offer comprehensive project solutions that cater to a wide range of requirements, including private residential villas, offices, clinics, as well as large-scale projects like headquarters, hotels, hospitals, and resorts.',
    'hero.cta1': 'See Our Products',
    'hero.cta2': 'Get Quote',
    'hero.chip.convenience': 'Incredible convenience',
    'hero.chip.privacy': 'Privacy and security',
    'hero.chip.safety': 'Child and pet safety',
    'hero.chip.energy': 'Energy efficient',
    'hero.kpi.experience': 'Years experience',
    'hero.kpi.clientsLabel': 'Happy clients',
    'hero.kpi.projectsLabel': 'Projects delivered',
    'hero.videoStatus': 'Video {{status}}',
    'hero.slideProgress': 'Slide {{current}} of {{total}}',
    'hero.mute': 'Mute',
    'hero.unmute': 'Unmute',
  };

  const getText = (key) => {
    try {
      const val = t(key);
      if (!val || String(val).trim() === '' || String(val).includes('hero.')) {
        return fallbacks[key] || key.replace(/^hero\./, '').replace(/\./g, ' ');
      }
      return val;
    } catch {
      return fallbacks[key] || key.replace(/^hero\./, '').replace(/\./g, ' ');
    }
  };

  // Carousel navigation (RTL-aware)
  const goNext = useCallback(() => {
    setBgIndex(i => (i + 1) % covers.length);
  }, []);

  const goPrev = useCallback(() => {
    setBgIndex(i => (i - 1 + covers.length) % covers.length);
  }, []);

  const goTo = useCallback((idx) => {
    setBgIndex(idx);
  }, []);

  // Autoplay for slideshow
  useEffect(() => {
    if (prefersReducedMotion || paused || hoveringRef.current || covers.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(goNext, SLIDE_MS);
    
    const onVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        if (!paused && !hoveringRef.current) {
          timerRef.current = setInterval(goNext, SLIDE_MS);
        }
      }
    };
    
    document.addEventListener('visibilitychange', onVisibility);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [bgIndex, paused, prefersReducedMotion, goNext]);

  // Video IntersectionObserver for autoplay/pause
  useEffect(() => {
    const v = videoRef.current;
    if (!v || saveData || prefersReducedMotion) return;

    const io = new IntersectionObserver(([entry]) => {
      const video = videoRef.current;
      if (!video) return;
      
      if (entry.isIntersecting) {
        video.play().catch((err) => { void err; });
        setVideoPlaying(true);
      } else {
        try { 
          video.pause(); 
          setVideoPlaying(false);
        } catch (err) { void err; }
      }
    }, { threshold: 0.35 });

    io.observe(v);
    return () => io.disconnect();
  }, [saveData, prefersReducedMotion]);

  // Force re-render on language change to update dir
  useEffect(() => {
    document.documentElement.dir = i18n.dir();
  }, [i18n.language, i18n]);

  // Keyboard controls (RTL-aware)
  useEffect(() => {
    const handleKey = (e) => {
      if (!sectionRef.current?.contains(document.activeElement)) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          isRTL ? goNext() : goPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          isRTL ? goPrev() : goNext();
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          setPaused(p => !p);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(videoRef.current.muted);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isRTL, goNext, goPrev]);

  // Touch swipe support (RTL-aware)
  const touchStart = useRef(null);
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) {
        isRTL ? goNext() : goPrev();
      } else {
        isRTL ? goPrev() : goNext();
      }
    }
    touchStart.current = null;
  };

  // Signal ready for tests
  useEffect(() => {
    try {
      window.__HERO_READY = true;
    } catch (err) { void err; }
    return () => {
      try {
        window.__HERO_READY = false;
      } catch (err) { void err; }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative px-4 md:px-6 py-6 md:py-0"
      data-test="hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => { hoveringRef.current = true; }}
      onMouseLeave={() => { hoveringRef.current = false; }}
    >
      {/* SR-only live region for announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {getText('hero.slideProgress').replace('{{current}}', bgIndex + 1).replace('{{total}}', covers.length)}
      </div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {videoPlaying ? getText('hero.videoStatus').replace('{{status}}', muted ? 'playing muted' : 'playing unmuted') : ''}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh] md:min-h-screen gap-y-6 md:gap-y-0 md:gap-x-6">
        
        {/* Panel A: Slideshow + Text + CTAs + Dots + Progress */}
        <article
          className={clsx(
            'relative flex flex-col justify-center min-h-[50vh] md:min-h-screen rounded-xl overflow-hidden',
            'md:shadow-lg md:ring-1 md:ring-white/10',
            isRTL ? 'md:order-2' : 'md:order-1'
          )}
        >
          {/* Background image */}
          <img
            key={bgIndex}
            src={covers[bgIndex]}
            alt=""
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover z-0 select-none pointer-events-none transition-opacity duration-700"
            loading={bgIndex === 0 ? 'eager' : 'lazy'}
          />
          
          {/* Gradient overlay for legibility */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent pointer-events-none z-10" 
            aria-hidden="true"
          />

          {/* Content */}
          <div className={clsx(
            'relative z-20 h-full w-full p-6 md:p-10 flex flex-col justify-center',
            isRTL ? 'text-right items-end' : 'text-left items-start'
          )}>
            <h1 
              id="hero-title" 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-[22ch]"
              style={isRTL ? { letterSpacing: '0' } : {}}
            >
              {getText('hero.title')}
            </h1>

            <p className={clsx(
              'mt-4 md:mt-6 max-w-[48ch] text-base md:text-lg text-white/90',
              isRTL ? 'font-cairo' : ''
            )}>
              {getText('hero.description')}
            </p>

            {/* CTAs */}
            <div className={clsx(
              'mt-6 md:mt-8 flex flex-wrap gap-3',
              isRTL ? 'justify-end flex-row-reverse' : 'justify-start'
            )}>
              <a 
                href="/products" 
                className="px-6 py-3 rounded-full bg-brand-900 text-white font-medium shadow-lg hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {getText('hero.cta1')}
              </a>
              <a
                href="/quote"
                className="px-6 py-3 rounded-full bg-white/10 backdrop-blur text-white font-medium border border-white/20 shadow hover:bg-white/20 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {getText('hero.cta2')}
              </a>
            </div>
          </div>

          {/* Slider dots */}
          <div 
            className={clsx(
              'absolute bottom-6 z-20 flex gap-2',
              isRTL ? 'left-6' : 'right-6'
            )}
          >
            {covers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={clsx(
                  'w-3 h-3 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70',
                  idx === bgIndex 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/60 hover:bg-white/80'
                )}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === bgIndex ? 'true' : 'false'}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div
            className={clsx(
              'absolute bottom-6 hidden sm:block z-20',
              isRTL ? 'right-6' : 'left-6'
            )}
            aria-hidden="true"
          >
            <div 
              className="w-40 md:w-56 h-1 bg-white/20 rounded-full overflow-hidden"
            >
              <div
                key={bgIndex}
                className="h-full bg-white rounded-full"
                style={{
                  animation: paused || prefersReducedMotion ? 'none' : `progressBar ${SLIDE_MS}ms linear`,
                  transformOrigin: isRTL ? 'right' : 'left',
                }}
              />
            </div>
          </div>
        </article>

        {/* Panel B: Video + Blurred Backdrop + Chips + KPIs */}
        <aside
          className={clsx(
            'relative min-h-[50vh] md:min-h-screen rounded-xl overflow-hidden',
            'md:shadow-lg md:ring-1 md:ring-white/10',
            isRTL ? 'md:order-1' : 'md:order-2'
          )}
        >
          {/* Ambient blurred backdrop that fills the column */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${covers[bgIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: isRTL ? '74% 52%' : '26% 52%',
              filter: 'blur(14px) brightness(0.7)',
              transform: 'scale(1.05)',
              opacity: 0.85,
            }}
            aria-hidden="true"
          />

          {/* Content container */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 md:p-10">
            
            {/* Video card (16:9) */}
            <figure className="w-full max-w-[640px] aspect-[16/9] rounded-2xl overflow-hidden bg-black/30 backdrop-blur shadow-2xl relative">
              <video
                ref={videoRef}
                className={clsx(
                  'block w-full h-full object-cover transition-opacity duration-500',
                  videoReady ? 'opacity-100' : 'opacity-0'
                )}
                style={{ objectPosition: isRTL ? '26% 52%' : '74% 52%' }}
                playsInline
                muted
                loop
                preload={saveData ? 'none' : 'metadata'}
                poster={covers[bgIndex]}
                onCanPlay={() => setVideoReady(true)}
                onLoadedData={() => setVideoReady(true)}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                aria-label="Product demonstration video"
              >
                <source src="/videos/Blinds-720.mp4" type="video/mp4" />
                <source src="/videos/Blinds.mp4" type="video/mp4" />
              </video>

              {/* Top gradient for legibility */}
              <div 
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" 
                aria-hidden="true" 
              />

              {/* Video controls */}
              <div className={clsx(
                'absolute top-4 flex gap-2 z-20',
                isRTL ? 'left-4' : 'right-4'
              )}>
                <button
                  onClick={toggleMute}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur text-white border border-white/20 hover:bg-black/70 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  aria-label={muted ? getText('hero.unmute') : getText('hero.mute')}
                >
                  {muted ? '🔇 Unmute' : '🔊 Mute'}
                </button>
              </div>
            </figure>

            {/* Feature chips */}
            <div className={clsx(
              'mt-6 flex flex-wrap gap-2 justify-center',
              isRTL ? 'flex-row-reverse' : ''
            )}>
              {['chip.convenience', 'chip.privacy', 'chip.safety', 'chip.energy'].map((k) => (
                <span 
                  key={k} 
                  className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/90 text-gray-900 border border-white/20 shadow backdrop-blur dark:bg-white/10 dark:text-white dark:border-white/10"
                >
                  {getText(`hero.${k}`)}
                </span>
              ))}
            </div>

            {/* KPIs */}
            <div className={clsx(
              'mt-8 grid grid-cols-3 gap-4 sm:gap-6 text-center w-full max-w-md',
              isRTL ? 'rtl' : 'ltr'
            )}>
              {[
                { n: '10+', l: 'years' }, 
                { n: '150+', l: 'clients' }, 
                { n: '500+', l: 'projects' }
              ].map((it) => (
                <div key={it.l}>
                  <div 
                    dir="ltr" 
                    className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg"
                  >
                    {it.n}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 mt-1">
                    {it.l === 'years' 
                      ? getText('hero.kpi.experience') 
                      : it.l === 'clients' 
                      ? getText('hero.kpi.clientsLabel') 
                      : getText('hero.kpi.projectsLabel')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Progress bar animation keyframes */}
      <style>{`
        @keyframes progressBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
