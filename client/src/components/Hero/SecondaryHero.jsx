import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

export default function SecondaryHero({ id = 'secondary-hero', imageSrc, imageAlt }) {
  const { t, i18n } = useTranslation(['home']);
  const isRTL = i18n.dir ? i18n.dir() === 'rtl' : false;

  const title = t('secondaryHero.title');
  const desc = t('secondaryHero.description');
  const cta = t('secondaryHero.cta');

  const src = imageSrc || t('secondaryHero.image.src', { defaultValue: '/images/hero/slide-2.jpg' });
  const alt = imageAlt || t('secondaryHero.image.alt', { defaultValue: 'Interior image' });

  return (
    <section id={id} aria-label={title} className="relative py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          {/* responsive picture - webp + jpg fallback */}
          <picture>
            <source srcSet={`${src.replace('.jpg', '.avif')} 1x, ${src.replace('.jpg', '@2x.avif')} 2x`} type="image/avif" />
            <source srcSet={`${src.replace('.jpg', '.webp')} 1x, ${src.replace('.jpg', '@2x.webp')} 2x`} type="image/webp" />
            <img
              src={src}
              alt={alt}
              className="w-full h-[48vh] md:h-[56vh] object-cover block"
              loading="lazy"
              decoding="async"
            />
          </picture>

          {/* overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-(--overlay-strong) via-transparent to-(--overlay) pointer-events-none" />

          {/* centered text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-center px-6 max-w-3xl ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-(--primary-contrast) mb-4" style={{ lineHeight: 1.05 }}>
                {title}
              </h2>
              <p className="text-lg md:text-xl text-(--muted) mb-6 max-w-[65ch] mx-auto">
                {desc}
              </p>
              <div className={`flex items-center justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <a href="#solutions" className="inline-block">
                  <button className="px-6 py-3 rounded-full bg-(--brand) text-(--primary-contrast) font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-(--focus)">
                    {cta}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
