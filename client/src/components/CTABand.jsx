import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CTABand() {
  const { t } = useTranslation('ctaBand');

  return (
    <section className="bg-gradient-to-r from-[color:var(--primary-dark)] to-[color:var(--primary)] py-12 text-[color:var(--primary-contrast)]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          {t('heading', { defaultValue: 'Ready to get started?' })}
        </h2>
        <p className="text-lg mb-6">
          {t('subheading', { defaultValue: 'Join us today and make a difference!' })}
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="px-6 py-3 bg-[color:var(--primary)] text-[color:var(--primary-contrast)] font-semibold rounded-lg shadow-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-contrast)] focus:ring-offset-2"
          >
            {t('primaryButton', { defaultValue: 'Get Started' })}
          </a>
          <a
            href="/learn-more"
            className="px-6 py-3 border border-[color:var(--primary-contrast)] text-[color:var(--primary-contrast)] font-semibold rounded-lg shadow-md hover:bg-[color:var(--overlay)]/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-contrast)] focus:ring-offset-2"
          >
            {t('secondaryButton', { defaultValue: 'Learn More' })}
          </a>
        </div>
      </div>
    </section>
  );
}