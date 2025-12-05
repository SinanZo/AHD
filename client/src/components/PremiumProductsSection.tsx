// src/components/PremiumProductsSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion, useReducedMotion } from 'framer-motion';

type PremiumProduct = {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  href?: string;
};

interface PremiumProductsSectionProps {
  id?: string;
  className?: string;
}

// You can replace these with real images / slugs
const PREMIUM_PRODUCTS: PremiumProduct[] = [
  {
    key: 'wave-curtains',
    title: 'Wave Style Curtains',
    subtitle: 'Soft, architectural folds with hotel-grade hardware.',
    image: '/images/products/wave-curtains.jpg',
    href: '/products/wave-curtains',
  },
  {
    key: 'panel-blinds',
    title: 'Panel Track Systems',
    subtitle: 'Minimal panels for wide glass façades and sliders.',
    image: '/images/products/panel-blinds.jpg',
    href: '/products/panel-track',
  },
  {
    key: 'sheer-blackout',
    title: 'Sheer & Blackout Layers',
    subtitle: 'Daylight control with full blackout when you need it.',
    image: '/images/products/sheer-blackout.jpg',
    href: '/products/sheer-blackout',
  },
];

export function PremiumProductsSection({
  id = 'premium-products',
  className,
}: PremiumProductsSectionProps) {
  const { t, i18n } = useTranslation('home', { useSuspense: false });
  const reduce = useReducedMotion();
  const dir =
    (typeof i18n.dir === 'function' ? i18n.dir() : undefined) ||
    (i18n.language?.startsWith('ar') ? 'rtl' : 'ltr');
  const isRTL = dir === 'rtl';

  const subtitle = t('premium.subtitle', {
    defaultValue: 'Selected Highlights',
  });
  const title = t('premium.title', {
    defaultValue: 'Our Premium Products',
  });
  const description = t('premium.description', {
    defaultValue:
      'From timeless curtain compositions to contemporary blinds and outdoor systems, explore a curated selection of Abdulhaq Dimensions’ most requested solutions.',
  });

  const containerVariants: any = reduce
    ? {}
    : {
        visible: {
          transition: { staggerChildren: 0.12 },
        },
      };

  const cardVariants: any = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 32, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, type: 'spring', stiffness: 110, damping: 18 },
        },
      };

  return (
    <section id={id} className={className}>
      <div className="container mx-auto py-16">
        <header className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-adh-text-muted">
            {subtitle}
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-adh-text">
            {title}
          </h2>
          <p className="mt-3 text-base md:text-lg leading-relaxed text-adh-text-muted">
            {description}
          </p>
        </header>

        <Motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {PREMIUM_PRODUCTS.map(prod => (
            <Motion.article
              key={prod.key}
              variants={cardVariants}
              className="group relative h-[380px] md:h-[420px] rounded-3xl overflow-hidden bg-adh-surface shadow-adh-card border border-adh-stroke/80"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${prod.image})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-adh-bg/90 via-adh-bg/40 to-transparent group-hover:from-adh-bg/95 group-hover:via-adh-bg/55 transition-colors duration-theme" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 md:p-7 text-adh-text">
                <p className="text-xs tracking-[0.18em] uppercase text-adh-text-muted mb-2">
                  {subtitle}
                </p>
                <h3 className="text-lg md:text-xl font-semibold">
                  {prod.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-adh-text-muted">
                  {prod.subtitle}
                </p>

                {prod.href && (
                  <div
                    className={`mt-4 flex ${
                      isRTL ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <a
                      href={prod.href}
                      className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-adh-link hover:text-adh-link-hover"
                    >
                      {t('premium.cta', {
                        defaultValue: 'View collection',
                      })}
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                )}
              </div>
            </Motion.article>
          ))}
        </Motion.div>
      </div>
    </section>
  );
}

export default PremiumProductsSection;
