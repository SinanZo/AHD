import React from 'react';
import { useTranslation } from 'react-i18next';
import contact from '../data/contact';

export default function ClientsGrid() {
  const { t } = useTranslation('clientsGrid');
  const clients = t('clients', { returnObjects: true }) || [
    { name: 'Client 1', logo: '/images/client1.png' },
    { name: 'Client 2', logo: '/images/client2.png' },
    { name: 'Client 3', logo: '/images/client3.png' },
    { name: 'Client 4', logo: '/images/client4.png' },
    { name: 'Client 5', logo: '/images/client5.png' },
    { name: 'Client 6', logo: '/images/client6.png' },
  ];

  return (
    <section className="bg-[color:var(--bg)] py-10 md:py-12">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[color:var(--fg)] mb-6">
          {t('heading', { defaultValue: 'Our Clients' })}
        </h2>
        {t('subheading') && <p className="text-center text-sm text-[color:var(--muted)] mb-6">{t('subheading')}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {clients.map((client, idx) => (
            <div
              key={idx}
              className="client-tile flex items-center justify-center p-6 rounded-lg border border-[color:var(--stroke)] bg-[color:var(--tile)] transition-transform hover:-translate-y-1"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-w-full max-h-16 object-contain filter grayscale transition-all duration-150"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[color:var(--stroke)] bg-[color:var(--bg)] p-5 text-center">
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