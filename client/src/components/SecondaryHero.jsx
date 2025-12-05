import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SecondaryHero() {
  const { t } = useTranslation('secondaryHero');

  return (
    <section className="bg-(--bg) py-16 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-(--brand) mb-4">
          {t('heading', { defaultValue: 'Discover Our Premium Solutions' })}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {t('description', { defaultValue: 'Explore the best solutions tailored for your needs.' })}
        </p>
        <a
          href="#premium-solutions"
          className="inline-block px-6 py-3 bg-adh-btn text-adh-btn-fg font-semibold rounded-lg shadow-md hover:bg-adh-btn-hover focus:outline-none focus:ring-2 focus:ring-adh-brand focus:ring-offset-2"
        >
          {t('cta', { defaultValue: 'Discover Now' })}
        </a>
      </div>
    </section>
  );
}