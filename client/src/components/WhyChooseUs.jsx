import React from 'react';
import { useTranslation } from 'react-i18next';

export default function WhyChooseUs() {
  // Prefer about namespace, fall back to home
  const { t: tAbout, i18n } = useTranslation('about');
  const { t: tHome } = useTranslation('home');
  const isRTL = typeof i18n.dir === 'function' ? i18n.dir() === 'rtl' : (i18n.dir || '').toString().toLowerCase() === 'rtl';

  const heading = tAbout('why_heading', { defaultValue: tHome('features.why_heading', { defaultValue: '' }) });
  const text = tAbout('why_text', { defaultValue: tHome('features.why_text', { defaultValue: '' }) });

  if (!heading && !text) return null;

  return (
    <section className="py-16 surface" dir={isRTL ? 'rtl' : 'ltr'} aria-labelledby="why-choose-heading">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 ${isRTL ? 'font-arabic' : ''}`}>
          <h2 id="why-choose-heading" className="text-3xl md:text-4xl font-bold text-primary">{heading}</h2>
          <p className="mt-4 text-lg text-muted max-w-3xl mx-auto">{text}</p>
        </div>
      </div>
    </section>
  );
}
