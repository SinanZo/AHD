import React from 'react';
import { useTranslation } from 'react-i18next';
import contact from '../data/contact';

const FALLBACK_CLIENTS = [
  { name: 'Client 1', logo: '/images/client1.png' },
  { name: 'Client 2', logo: '/images/client2.png' },
  { name: 'Client 3', logo: '/images/client3.png' },
  { name: 'Client 4', logo: '/images/client4.png' },
  { name: 'Client 5', logo: '/images/client5.png' },
  { name: 'Client 6', logo: '/images/client6.png' },
];

export default function ClientsGrid() {
  const { t } = useTranslation('clientsGrid');
  // i18n may return an object (map) or an array depending on locale structure.
  // Coerce into an array safely to avoid `clients.map is not a function`.
  const raw = t('clients', { returnObjects: true });
  let clients = FALLBACK_CLIENTS;
  if (Array.isArray(raw) && raw.length) {
    clients = raw;
  } else if (raw && typeof raw === 'object') {
    // If it's an object map, take its values.
    clients = Object.values(raw);
  }
  // Debug: log the resolved clients shape to help diagnose runtime issues.
  if (typeof window !== 'undefined') {
    // Keep logs concise in production by only printing in dev
    if (import.meta.env && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[ClientsGrid] resolved clients:', clients);
    }
  }

  return (
    <section className="bg-(--bg) py-10 md:py-12">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-(--fg) mb-6">
          {t('heading', { defaultValue: 'Our Clients' })}
        </h2>
        {t('subheading') && <p className="text-center text-sm text-(--muted) mb-6">{t('subheading')}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.isArray(clients) ? clients.map((client, idx) => (
            <div
              key={idx}
              className="client-card flex items-center justify-center p-4 rounded-xl border border-[#E5E7EB] dark:border-[#1e293b] bg-white dark:bg-[#0f172a] hover:bg-[#f9fafb] dark:hover:bg-[#1e293b] transition"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-w-full max-h-16 object-contain"
              />
            </div>
          )) : null}
        </div>

        <div className="mt-8 rounded-2xl border border-(--stroke) bg-(--bg) p-5 text-center">
          <p className="text-sm">
            {t('enterprisePrefix', { defaultValue: 'For enterprise inquiries: ' })}
            <a href={contact.emailHref} className="underline">{contact.email}</a>
            {" • "}
            <a href={contact.phoneHref} className="underline">{contact.phoneHuman}</a>
            {" • "}
            <a href={contact.waHref()} className="underline" target="_blank" rel="noreferrer">WhatsApp</a>
          </p>
        </div>
      </div>
    </section>
  );
}