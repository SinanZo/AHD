import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Pause, Play } from 'lucide-react';

// Image slideshow for left panel
const HERO_IMAGES = [
  '/images/covers/roller-blinds.jpg',
  '/images/covers/roman-blinds.jpg',
  '/images/covers/vertical-wave-blinds.jpg',
  '/images/covers/motorization-somfy-experts.png',
  '/images/covers/bg3.jpg',
  '/images/covers/japanese-panel-style.jpg',
  '/images/covers/bg4.jpg',
  '/images/covers/bg1.jpg',
  '/images/covers/venetian-blinds.png',
  '/images/covers/wallpaper.jpg',
  '/images/covers/accessories.png',
  '/images/covers/outdoor-solutions-and-skylights.jpg',
  '/images/covers/bg2.jpg',
  '/images/covers/floorings-and-acoustics.jpg',
  '/images/covers/fabrics-curtains-tailoring.jpg',
  '/images/covers/wave-style-curtains.jpg',
];

export default function HeroSection() {
  const { t, i18n } = useTranslation(['hero']);
  const isRTL = i18n.dir() === 'rtl';
  const [currentSlide, setCurrentSlide] = useState(4); // Start with bg3.jpg
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    if (isPaused || !motionEnabled) {
      setProgress(0);
      return;
    }

    const duration = 5000; // 5 seconds per slide
    const updateInterval = 50; // Update progress every 50ms
    let elapsed = 0;

    const progressInterval = setInterval(() => {
      elapsed += updateInterval;
      setProgress((elapsed / duration) * 100);
    }, updateInterval);

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
      elapsed = 0;
      setProgress(0);
    }, duration);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressInterval);
    };
  }, [isPaused, motionEnabled]);

  // Handle video autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch (err) {
        console.log('Video autoplay failed:', err);
      }
    };

    playVideo();
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const toggleMotion = useCallback(() => {
    setMotionEnabled(!motionEnabled);
  }, [motionEnabled]);

  const toggleVideoPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isVideoPaused) {
      video.play();
    } else {
      video.pause();
    }
    setIsVideoPaused(!isVideoPaused);
  }, [isVideoPaused]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={t('hero:sectionLabel')}
      className="relative pt-4 md:pt-6 min-h-screen overflow-hidden z-0"
    >
      <div className="min-h-screen w-full px-4 md:px-6 gap-6 grid grid-cols-1 lg:grid-cols-2 items-stretch">
        
        {/* LEFT PANEL - Image Slideshow with Content */}
        <div className="order-1">
          <div className="relative flex items-center min-h-[85vh] md:min-h-screen rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10 dark:ring-white/5">
            {/* Image Stack */}
            <div className="absolute inset-0 z-0 hero-img-stack" aria-hidden="true">
              {HERO_IMAGES.map((img, index) => (
                <img
                  key={img}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={index === 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable="false"
                  src={img}
                  style={{ objectPosition: '26% 52%' }}
                />
              ))}
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
            </div>

            {/* Content Box */}
            <div className="container mx-auto px-5 sm:px-8 lg:px-10 relative z-30 flex items-center justify-center min-h-[85vh] md:min-h-screen">
              <div className="hero-content-box mx-auto text-center max-w-[680px] sm:max-w-[600px] lg:max-w-[640px] rounded-2xl p-4 sm:p-6 md:p-8 ring-[0.5px] ring-white/15 text-white shadow-2xl"
                   style={{ 
                     background: 'rgba(0,0,0,0.25)',
                     backdropFilter: 'blur(12px)',
                     WebkitBackdropFilter: 'blur(12px)'
                   }}>
                {/* Badge */}
                <span className="inline-block px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg ring-1 ring-white/20 mb-4 sm:mb-5"
                      style={{ 
                        background: 'rgba(217,119,6,0.9)',
                        color: '#ffffff'
                      }}>
                  {t('hero:badge', { defaultValue: 'PREMIUM INTERIOR SOLUTIONS' })}
                </span>

                {/* Title */}
                <h1 className="hero-title text-[clamp(32px,6vw,56px)] font-extrabold leading-[1.1] tracking-[0.2px] text-white mb-3"
                    style={{ 
                      textDecoration: 'none',
                      textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                      fontFamily: isRTL ? '"Cairo", "Tajawal", sans-serif' : '"Playfair Display", serif'
                    }}>
                  {t('hero:title', { defaultValue: 'Comprehensive Project Solutions' })}
                </h1>

                {/* Subtitle */}
                <p className="mt-3 text-[clamp(13px,1.8vw,17px)] font-semibold text-white/95"
                   style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                  {t('hero:subtitle', { defaultValue: 'From private villas to corporate HQs and resorts' })}
                </p>

                {/* Description */}
                <p className="text-[clamp(14px,1.6vw,16px)] sm:text-base md:text-lg mb-7 mt-3 leading-relaxed text-white/90"
                   style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                  {t('hero:description', { 
                    defaultValue: 'We deliver end-to-end project solutions tailored to meet diverse needs from bespoke private residential villas and modern offices to state-of-the-art clinics. Our expertise extends to large-scale developments, including corporate headquarters, luxury hotels, world-class hospitals, and exclusive resorts.'
                  })}
                  <br /><br />
                  By combining premium design, exceptional craftsmanship, and meticulous project management, we ensure every space reflects the highest standards of functionality, aesthetics, and comfort.
                </p>

                {/* CTA Buttons */}
                <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                  <Link href="/products" aria-label={t('hero:cta1', { defaultValue: 'View Products' })}>
                    <button className="hero-cta-primary w-full sm:w-auto text-sm sm:text-base px-8 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105"
                            style={{ 
                              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                              color: '#ffffff'
                            }}>
                      {t('hero:cta1', { defaultValue: 'View Products' })}
                    </button>
                  </Link>
                  <a href="https://wa.me/962778050005?text=Hello%2C%20I%20would%20like%20to%20request%20a%20quote" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     aria-label={t('hero:cta2', { defaultValue: 'Get a Quote' })}>
                    <button className="hero-cta-secondary w-full sm:w-auto text-sm sm:text-base px-8 py-4 rounded-full font-bold shadow-xl transition-all"
                            style={{ 
                              background: 'transparent',
                              color: '#ffffff',
                              border: '2px solid #ffffff'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#ffffff';
                              e.currentTarget.style.color = '#0B5A61';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#ffffff';
                            }}>
                      {t('hero:cta2', { defaultValue: 'Get a Quote' })}
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Controls at Bottom */}
            <div className="absolute bottom-4 left-0 right-0 px-6 lg:px-8 flex items-center justify-center gap-3 z-10">
              <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                Slideshow {isPaused ? 'paused' : 'playing'} (motion {motionEnabled ? 'enabled' : 'disabled'})
              </div>

              {/* Progress Bar */}
              <div className="hidden sm:block w-40 h-1.5 rounded-full bg-white/25 overflow-hidden" aria-hidden="true">
                <div className="h-full bg-white/90 transition-[width] duration-100" style={{ width: `${progress}%` }} />
              </div>

              {/* Pause/Play Button */}
              <button
                type="button"
                className="hero-control ml-2 text-xs px-2.5 py-1 rounded-full transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ background: 'rgba(0,0,0,0.35)', color: '#ffffff' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
                aria-pressed={isPaused}
                aria-label={isPaused ? 'Play' : 'Pause'}
                onClick={togglePause}
              >
                <span className="sm:hidden text-sm" aria-hidden="true">{isPaused ? '▶' : '❚❚'}</span>
                <span className="hidden sm:inline">{isPaused ? 'Play' : 'Pause'}</span>
              </button>

              {/* Motion Toggle */}
              <div className="ml-3">
                <button
                  type="button"
                  className="hero-control text-xs px-2.5 py-1 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white/50"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  title={motionEnabled ? 'Disable animations' : 'Enable animations'}
                  onClick={toggleMotion}
                >
                  {motionEnabled ? 'Disable animations' : 'Enable animations'}
                </button>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="hidden sm:flex items-center gap-2 ml-3 text-white/80 text-xs" aria-hidden="true">
                <span className="px-2 py-1 rounded bg-black/30 font-medium">K</span>
                <span className="opacity-80">pause/play</span>
                <span className="mx-2">•</span>
                <span className="px-2 py-1 rounded bg-black/30 font-medium">M</span>
                <span className="opacity-80">toggle motion</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Video */}
        <div className="order-2">
          <div className="relative h-full w-full rounded-2xl overflow-hidden grid place-items-center ring-[0.5px] ring-white/10 shadow-lg"
               dir="ltr"
               style={{ background: 'var(--header-bg, rgba(8,20,24,.85))' }}>
            {/* Blurred Background */}
            <div className="absolute inset-0 opacity-100 -z-10" aria-hidden="true"
                 style={{
                   backgroundImage: 'url("/images/covers/bg3.jpg")',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center center',
                   filter: 'blur(18px)',
                   transform: 'scale(1.08)'
                 }} />

            {/* Top Header */}
            <div className="absolute top-3 inset-x-0 flex justify-center px-3">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase backdrop-blur ring-[0.5px]"
                      style={{ 
                        background: 'rgba(0,0,0,0.3)',
                        color: '#22D3EE',
                        borderColor: 'rgba(255,255,255,0.1)'
                      }}>
                  BLIND MOTORIZATION
                </span>
                <h3 className="text-white text-[clamp(16px,2.4vw,22px)] font-bold drop-shadow whitespace-nowrap"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  Smart Control • Instant Comfort
                </h3>
              </div>
            </div>

            {/* Video Element */}
            <figure className="w-full max-w-[640px] aspect-[16/9] mx-auto rounded-2xl overflow-hidden shadow-2xl relative"
                    style={{ 
                      background: 'rgba(0,0,0,0.2)',
                      border: '0.5px solid rgba(255,255,255,0.1)'
                    }}>
              <video
                ref={videoRef}
                className="block w-full h-full object-cover opacity-100 transition-opacity duration-500"
                playsInline
                loop
                autoPlay
                preload="auto"
                poster="/images/covers/bg3.jpg"
                aria-label="Decorative hero video"
                style={{ objectPosition: '50% 50%' }}
              >
                <source src="/videos/Blinds.mp4?v=5#t=0.01" type="video/mp4" />
                <source src="/videos/Blinds.webm" type="video/webm" />
              </video>

              {/* Video Overlay */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
              </div>

              {/* Video Controls */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg backdrop-blur-sm shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  style={{ 
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  aria-label={isMuted ? 'Video muted' : 'Video unmuted'}
                  aria-pressed={isMuted}
                  title={isMuted ? 'Unmute video' : 'Mute video'}
                  onClick={toggleMute}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg backdrop-blur-sm shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  style={{ 
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  aria-label={isVideoPaused ? 'Video paused' : 'Video playing'}
                  aria-pressed={isVideoPaused}
                  title={isVideoPaused ? 'Play video' : 'Pause video'}
                  onClick={toggleVideoPause}
                >
                  {isVideoPaused ? '▶️' : '⏸️'}
                </button>
              </div>

              {/* Gradient Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
            </figure>

            {/* Bottom Feature Pills */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center px-3">
              <ul className="flex flex-wrap justify-center items-center gap-2">
                <li className="px-3 py-1.5 rounded-full text-[12px] backdrop-blur-sm transition-all"
                    style={{ 
                      background: 'rgba(0,0,0,0.3)',
                      color: '#ffffff',
                      border: '0.5px solid rgba(255,255,255,0.1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}>
                  Mobile App
                </li>
                <li className="px-3 py-1.5 rounded-full text-[12px] backdrop-blur-sm transition-all"
                    style={{ 
                      background: 'rgba(0,0,0,0.3)',
                      color: '#ffffff',
                      border: '0.5px solid rgba(255,255,255,0.1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}>
                  Schedules
                </li>
                <li className="px-3 py-1.5 rounded-full text-[12px] backdrop-blur-sm transition-all"
                    style={{ 
                      background: 'rgba(0,0,0,0.3)',
                      color: '#ffffff',
                      border: '0.5px solid rgba(255,255,255,0.1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}>
                  Smart-Home Ready
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
