import React from 'react';
import { useTranslation } from 'react-i18next';
import { SERVICES, ICONS } from '../../data/services';

function Icon({ name }) {
  // Minimal inline SVGs to avoid external sprite dependencies
  switch (name) {
    case 'curtains':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M4 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 6c4 2 8 2 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'blinds':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="4" width="18" height="4" stroke="currentColor" strokeWidth="1.6" rx="1" />
          <rect x="3" y="10" width="18" height="4" stroke="currentColor" strokeWidth="1.6" rx="1" />
          <rect x="3" y="16" width="18" height="4" stroke="currentColor" strokeWidth="1.6" rx="1" />
        </svg>
      );
    case 'pergola':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M18 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'wallpaper':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M4 3h12v18H4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function PremiumSolutions() {
  const { t } = useTranslation('services');

  // Try to read canonical cols from i18n -- fallback to mapping from services.items
  const cols = t('items', { returnObjects: true }) || [];

  return (
    <section className="py-10 md:py-12 bg-[color:var(--bg)]">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--fg)]">{t('title', { defaultValue: 'Premium Solutions' })}</h2>
          {t('description') && <p className="text-sm text-[color:var(--muted)] mt-2">{t('description')}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((s) => {
            // find matching localized item by title or index
            const item = cols.find((c) => (c.key ? c.key === s.key : false)) || cols.shift() || {};
            const heading = item.title || t(`items.${s.key}.title`, { defaultValue: s.key });
            const desc = item.desc || t(`items.${s.key}.desc`, { defaultValue: '' });
            const features = item.features || t(`items.${s.key}.features`, { returnObjects: true }) || [];

            return (
              <article key={s.key} className="rounded-2xl border border-[color:var(--stroke)] bg-[color:var(--bg)] p-5 flex gap-4 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-[color:var(--tile)] text-[color:var(--primary)] flex items-center justify-center">
                  <Icon name={ICONS[s.icon]} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[color:var(--fg)]">{heading}</h3>
                  <p className="text-sm text-[color:var(--muted)] mt-1">{desc}</p>
                  {features && features.length > 0 && (
                    <ul className="mt-3 text-sm text-[color:var(--muted-2)] space-y-1">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-[color:var(--primary)] mt-1" aria-hidden />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
