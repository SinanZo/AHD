import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Layers, Sparkles, Clock3 } from 'lucide-react';

// Map keys to icons used in the grid
const featureIcons = {
  experience: Clock3,
  quality: ShieldCheck,
  layers: Layers,
  innovation: Sparkles,
};

export default function WhyChooseUs() {
  const { t: tAbout, i18n } = useTranslation('about');
  const { t: tHome } = useTranslation('home');
  const isRTL = typeof i18n.dir === 'function' ? i18n.dir() === 'rtl' : (i18n.dir || '').toString().toLowerCase() === 'rtl';

  // Use About page heading/paragraph if available, otherwise fall back to Home's `why` block
  const heading = tAbout('why_heading', { defaultValue: tHome('why.title', { defaultValue: '' }) });
  const subtitle =
    tAbout('why_text', {
      defaultValue:
        tHome('why.description', {
          defaultValue:
            'Decades of craftsmanship, best-in-class materials, and meticulous service across every phase of your project.',
        }),
    }) || '';

  // Items pulled from Home namespace `why.*` with About fallbacks if present
  const KEYS = ['experience', 'quality', 'layers', 'innovation'];
  const items = KEYS.map((key) => ({
    id: key,
    title:
      tHome(`why.${key}.title`, { defaultValue: '' }) ||
      tAbout(`why_${key}`, { defaultValue: '' }),
    description:
      tHome(`why.${key}.desc`, { defaultValue: '' }) ||
      tAbout(`why_${key}Desc`, { defaultValue: '' }),
    Icon: featureIcons[key] || ShieldCheck,
  }));

  const hasContent = Boolean(heading || subtitle || items.some((item) => item.title || item.description));
  if (!hasContent) return null;

  return (
    <section
      className="relative py-20 bg-adh-bg-soft text-adh-text"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-labelledby="why-choose-heading"
    >
      <div className="absolute inset-0 bg-linear-to-b from-adh-bg via-transparent to-adh-bg" aria-hidden="true" />
      <div className="relative container mx-auto px-4 md:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-adh-text-muted">
            {tHome('why.subtitle', { defaultValue: 'PREMIUM INTERIOR SOLUTIONS' })}
          </p>
          <h2 id="why-choose-heading" className="mt-4 text-3xl md:text-[2.5rem] font-bold font-serif tracking-tight">
            {heading || tHome('why.title')}
          </h2>
          {subtitle && (
            <p className="mt-5 text-base leading-relaxed text-adh-text-secondary">{subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {items.map(({ id, title, description, Icon }) => (
            <article
              key={id}
              className="rounded-3xl border border-adh-stroke bg-adh-surface/90 shadow-adh-card hover:shadow-adh-card-hover transition-all duration-300 ease-out p-6 md:p-7 flex gap-5"
            >
              <div className="shrink-0 h-14 w-14 rounded-2xl bg-adh-chip/60 text-adh-primary flex items-center justify-center border border-adh-stroke/50">
                <Icon className="h-6 w-6" strokeWidth={1.6} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-serif text-adh-text">{title}</h3>
                {description && (
                  <p className="mt-3 text-sm leading-relaxed text-adh-text-secondary">{description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
