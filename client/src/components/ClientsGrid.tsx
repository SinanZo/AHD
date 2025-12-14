// src/components/ClientsGrid.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

type ClientLogo = {
  key: string;
  name: string;
  logo?: string; // optional img src
  href?: string;
};

interface ClientsGridProps {
  id?: string;
  className?: string;
  titleOverride?: string;
  descriptionOverride?: string;
  clients?: ClientLogo[];
}

// Simple placeholder data – replace with your real list
const DEFAULT_CLIENTS: ClientLogo[] = [
  { key: 'client-1', name: 'Client 01' },
  { key: 'client-2', name: 'Client 02' },
  { key: 'client-3', name: 'Client 03' },
  { key: 'client-4', name: 'Client 04' },
  { key: 'client-5', name: 'Client 05' },
  { key: 'client-6', name: 'Client 06' },
  { key: 'client-7', name: 'Client 07' },
  { key: 'client-8', name: 'Client 08' },
  { key: 'client-9', name: 'Client 09' },
  { key: 'client-10', name: 'Client 10' },
];

export function ClientsGrid({
  id = 'clients',
  className,
  titleOverride,
  descriptionOverride,
  clients,
}: ClientsGridProps) {
  const { t, i18n } = useTranslation('home', { useSuspense: false });
  const dir =
    (typeof i18n.dir === 'function' ? i18n.dir() : undefined) ||
    (i18n.language?.startsWith('ar') ? 'rtl' : 'ltr');
  const isRTL = dir === 'rtl';

  const title =
    titleOverride ??
    t('clients.title', {
      defaultValue: 'Our Clients',
    });

  const description =
    descriptionOverride ??
    t('clients.description', {
      defaultValue:
        'A diverse portfolio of residential, hospitality, commercial and institutional clients who trust Abdulhaq Dimensions with their window coverings and shading solutions.',
    });

  const items = clients && clients.length > 0 ? clients : DEFAULT_CLIENTS;

  return (
    <section id={id} className={className}>
      <div className="container mx-auto py-16">
        <header className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-adh-text">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-adh-text-muted">
            {description}
          </p>
        </header>

        <div className="mx-auto max-w-5xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.map(client => {
            const content = (
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-adh-stroke bg-adh-chip/80 text-adh-text shadow-adh-soft transition-all duration-theme hover:shadow-adh-card-hover hover:border-adh-primary-light">
                {client.logo ? (
                  // Logo image
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-10 max-w-[80%] object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  // Fallback text
                  <span className="text-[11px] sm:text-xs font-medium text-adh-text-muted text-center px-2">
                    {client.name}
                  </span>
                )}
              </div>
            );

            return (
              <div key={client.key} className="h-16 sm:h-20 md:h-22 lg:h-24">
                {client.href ? (
                  <a
                    href={client.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`block h-full w-full ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ClientsGrid;
