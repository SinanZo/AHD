import React from 'react';
import useAutoplayVideo from '../hooks/useAutoplayVideo';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

export default function HeroSection() {
  const { t, i18n } = useTranslation(['hero']);
  const isRTL = i18n.dir() === 'rtl';
  const sectionKey = i18n.language;
  const videoObjectPosition = isRTL ? '26% 52%' : '74% 52%';
  const { ref: videoRef } = useAutoplayVideo({ threshold: 0.25 });

  return (
    <section
      key={sectionKey}
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={t('hero:sectionLabel')}
      className="relative min-h-screen overflow-hidden hero"
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ objectPosition: videoObjectPosition }} 
          playsInline 
          muted 
          loop 
          preload="metadata" 
          poster="/images/covers/poster.jpg" 
          aria-label="Decorative hero video"
        >
          <source type="video/webm" src="/videos/Blinds.webm" />
          <source type="video/mp4" src="/videos/Blinds.mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-screen items-center">
          
          {/* Left Side - Main Content */}
          <div className={`text-white ${isRTL ? 'text-right lg:order-2' : 'text-left'}`}>
            <Link 
              to="/products" 
              className="inline-block px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-500 hover:to-cyan-500 transition-all mb-6"
            >
              {t('hero:badge')}
            </Link>

            <h1 className="hero-title text-white text-[clamp(32px,6vw,72px)] font-bold mb-6 leading-tight">
              {t('hero:title')}
            </h1>

            {t('hero:subtitle') && (
              <p className="text-xl md:text-2xl mb-4 text-cyan-100 font-semibold">
                {t('hero:subtitle')}
              </p>
            )}

            <p className="text-base md:text-lg mb-8 leading-relaxed text-gray-200 max-w-2xl">
              {t('hero:description')}
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Link href="/products" aria-label={t('hero:cta1')}>
                <button className="px-8 py-4 rounded-full font-semibold text-lg shadow-xl bg-white text-gray-900 hover:bg-cyan-50 transition-all transform hover:scale-105">
                  {t('hero:cta1')}
                </button>
              </Link>
              <a href="/#quote" aria-label={t('hero:cta2')}>
                <button className="px-8 py-4 rounded-full font-semibold text-lg shadow-xl bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-900 transition-all">
                  {t('hero:cta2')}
                </button>
              </a>
            </div>
          </div>

          {/* Right Side - Motorization Info */}
          <div className={`${isRTL ? 'text-right lg:order-1' : 'text-left'} lg:flex lg:items-center lg:justify-end`}>
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-md border border-white/10">
              <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                BLIND MOTORIZATION
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Smart Control • Instant Comfort
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  <span className="text-white font-medium">Mobile App</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⏰</span>
                  <span className="text-white font-medium">Schedules</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏠</span>
                  <span className="text-white font-medium">Smart-Home Ready</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
