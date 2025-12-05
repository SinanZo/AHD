import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PremiumProducts() {
  const { t } = useTranslation('premiumProducts');

  const products = [
    {
      title: t('product1.title', { defaultValue: 'Luxury Sofa' }),
      description: t('product1.description', { defaultValue: 'Experience unmatched comfort and style.' }),
      image: '/images/sofa.jpg',
    },
    {
      title: t('product2.title', { defaultValue: 'Elegant Dining Table' }),
      description: t('product2.description', { defaultValue: 'Perfect centerpiece for your dining room.' }),
      image: '/images/dining-table.jpg',
    },
    {
      title: t('product3.title', { defaultValue: 'Modern Bed' }),
      description: t('product3.description', { defaultValue: 'Sleep in luxury with our modern designs.' }),
      image: '/images/bed.jpg',
    },
  ];

  return (
    <section className="bg-adh-bg py-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-adh-primary mb-8">
          {t('heading', { defaultValue: 'Premium Products' })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-lg shadow-adh-card hover:shadow-adh-card-hover border border-adh-stroke bg-adh-surface transition-all duration-300"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-adh-primary/90 to-adh-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{product.title}</h3>
                <p className="text-sm text-white/90">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}