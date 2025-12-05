import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

// Animated background slides for left panel
const BACKGROUND_SLIDES = [
  '/images/covers/bg1.jpg',
  '/images/covers/bg2.jpg',
  '/images/covers/bg3.jpg',
  '/images/covers/bg4.jpg',
];

export default function HeroSection() {
  const { t, i18n } = useTranslation(['hero']);
  const isRTL = i18n.dir() === 'rtl';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Auto-advance slides
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle video autoplay and looping
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.muted = isMuted;
        await video.play();
      } catch (err) {
        console.log('Video autoplay failed:', err);
      }
    };

    playVideo();

    // Ensure video loops properly
    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [isMuted]);

  const togglePause = () => setIsPaused(!isPaused);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={t('hero:sectionLabel')}
      className="relative min-h-screen overflow-hidden hero"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">
        
        {/* LEFT PANEL - Sliding Background with Text */}
        <div className="relative min-h-[50vh] lg:min-h-screen overflow-hidden">
          {/* Animated Background Slides */}
          <div className="absolute inset-0">
            {BACKGROUND_SLIDES.map((slide, index) => (
              <div
                key={slide}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${slide})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/60 to-black/50" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex items-center min-h-[50vh] lg:min-h-screen px-6 md:px-12">
            <div className={`text-adh-text max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="inline-block px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg bg-adh-accent/90 text-adh-text mb-6">
                {t('hero:badge', { defaultValue: 'PREMIUM INTERIOR SOLUTIONS' })}
              </div>

              <h1 className="hero-title text-adh-text text-[clamp(32px,6vw,64px)] font-bold mb-4 leading-tight">
                {t('hero:title', { defaultValue: 'Comprehensive Project Solutions' })}
              </h1>

              <p className="text-xl md:text-2xl mb-4 text-adh-text-secondary font-medium">
                {t('hero:subtitle', { defaultValue: 'From private villas to corporate HQs and resorts' })}
              </p>

              <p className="text-base md:text-lg mb-8 leading-relaxed text-adh-text-secondary">
                {t('hero:description', { 
                  defaultValue: 'We deliver end-to-end project solutions tailored to meet diverse needs from bespoke private residential villas and modern offices to state-of-the-art clinics. Our expertise extends to large-scale developments, including corporate headquarters, luxury hotels, world-class hospitals, and exclusive resorts.'
                })}
              </p>

              <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <Link href="/products" aria-label={t('hero:cta1', { defaultValue: 'View Products' })}>
                  <button className="px-8 py-4 rounded-full font-semibold text-lg shadow-xl bg-adh-btn text-adh-btn-fg hover:bg-adh-primary-light transition-all transform hover:scale-105">
                    {t('hero:cta1', { defaultValue: 'View Products' })}
                  </button>
                </Link>
                <a href="/#quote" aria-label={t('hero:cta2', { defaultValue: 'Get a Quote' })}>
                  <button className="px-8 py-4 rounded-full font-semibold text-lg shadow-xl bg-transparent text-adh-text border-2 border-adh-surface hover:bg-adh-surface hover:text-adh-text transition-all">
                    {t('hero:cta2', { defaultValue: 'Get a Quote' })}
                  </button>
                </a>
              </div>
            </div>
          </div>

          {/* Slideshow Controls */}
            <div className="absolute bottom-6 left-6 z-20 flex gap-3">
            <button
              onClick={togglePause}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md text-adh-text hover:bg-black/60 transition-all"
              aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md text-adh-text hover:bg-black/60 transition-all"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            {BACKGROUND_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-adh-surface w-8' : 'bg-adh-surface/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - Video with Motorization Overlay */}
        <div className="relative min-h-[50vh] lg:min-h-screen overflow-hidden bg-black">
          {/* Background Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted={isMuted}
            loop
            preload="auto"
            poster="/images/covers/poster.jpg"
            aria-label="Decorative hero video"
          >
            <source src="/videos/Blinds.webm" type="video/webm" />
            <source src="/videos/Blinds.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />

          {/* Motorization Content Overlay */}
          <div className="relative z-10 flex items-start justify-end p-8 md:p-12 min-h-[50vh] lg:min-h-screen">
            <div className={`max-w-md ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                BLIND MOTORIZATION
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Smart Control • Instant Comfort
              </h2>
              <div className="space-y-5">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-4xl">📱</span>
                  <span className="text-white text-lg font-medium">Mobile App</span>
                </div>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-4xl">⏰</span>
                  <span className="text-white text-lg font-medium">Schedules</span>
                </div>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-4xl">🏠</span>
                  <span className="text-white text-lg font-medium">Smart-Home Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
