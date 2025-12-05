import React from 'react';
import useAutoplayVideo from '../../hooks/useAutoplayVideo';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

export default function HeroSectionFixed() {
  const { t, i18n } = useTranslation(['hero']);
  const isRTL = i18n.dir() === 'rtl';
  const sectionKey = i18n.language;
  const videoObjectPosition = isRTL ? '26% 52%' : '74% 52%';

  return (
    <section
      key={sectionKey}
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-label={t('hero:sectionLabel')}
      className="relative min-h-screen overflow-hidden hero"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full gap-y-6 md:gap-y-0 md:gap-x-6 px-4 md:px-6">
        {(() => {
          const textPanel = (
            <div>
              <div className="relative flex items-center min-h-[50vh] md:min-h-screen rounded-xl overflow-hidden md:shadow-lg md:ring-1 md:ring-white/10">
                  <div className="container mx-auto px-6 relative z-10">
                  <div className={`text-adh-text max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
                    <Link href="/products" className="inline-block px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg bg-adh-primary text-adh-text hover:opacity-90 mb-6">
                      {t('hero:badge')}
                    </Link>

                    <h1 className="hero-title text-adh-text text-[clamp(28px,5.5vw,64px)] font-bold mb-4 leading-tight max-w-[22ch]">
                      {t('hero:title')}
                    </h1>

                    {t('hero:subtitle') ? (
                      <p className="text-xl md:text-2xl mb-4 text-adh-text-secondary font-medium max-w-[48ch]">{t('hero:subtitle')}</p>
                    ) : null}

                    <p className="text-lg md:text-xl mb-8 leading-relaxed text-adh-text-secondary max-w-[48ch]">{t('hero:description')}</p>

                    <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                      <Link href="/products" aria-label={t('hero:cta1')}>
                        <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow bg-adh-btn text-adh-btn-fg border-2 border-adh-surface hover:bg-adh-primary hover:text-adh-btn-fg">{t('hero:cta1')}</button>
                      </Link>
                      <a href="/#quote" aria-label={t('hero:cta2')}>
                        <button className="px-4 py-3 rounded-full font-semibold text-base shadow bg-transparent text-adh-text border-2 border-adh-surface hover:bg-adh-surface hover:text-adh-text">{t('hero:cta2')}</button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

          const { ref: videoRef } = useAutoplayVideo({ threshold: 0.25 });

          const mediaPanel = (
            <div>
              <div className="relative min-h-[50vh] md:min-h-screen rounded-xl overflow-hidden md:shadow-lg md:ring-1 md:ring-white/10 bg-black">
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: videoObjectPosition }} playsInline muted loop preload="none" poster="/images/covers/poster.jpg" aria-label="Decorative hero video">
                  {/* Prefer optimized WebM variants, with media attributes for responsive selection */}
                  <source type="video/webm" src="/videos/Blinds-1280.webm" media="(min-width: 1024px)" />
                  <source type="video/webm" src="/videos/Blinds-720.webm" media="(min-width: 481px) and (max-width: 1023px)" />
                  <source type="video/webm" src="/videos/Blinds-480.webm" media="(max-width: 480px)" />
                  {/* MP4 fallbacks */}
                  <source type="video/mp4" src="/videos/Blinds-1280.mp4" media="(min-width: 1024px)" />
                  <source type="video/mp4" src="/videos/Blinds-720.mp4" media="(min-width: 481px) and (max-width: 1023px)" />
                  <source type="video/mp4" src="/videos/Blinds-480.mp4" media="(max-width: 480px)" />
                  {/* Legacy fallback */}
                  <source src="/videos/Blinds.mp4" type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-black/10" />
                <div aria-hidden className="absolute inset-0 backdrop-blur-sm bg-black/10" />
              </div>
            </div>
          );

          return isRTL ? [mediaPanel, textPanel] : [textPanel, mediaPanel];
        })()}
      </div>
    </section>
  );
}
