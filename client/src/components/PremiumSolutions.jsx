import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

export default function PremiumSolutions() {
  const { t } = useTranslation('premiumSolutions');

  const solutions = [
    t('solution1', { defaultValue: 'High-quality materials' }),
    t('solution2', { defaultValue: 'Customizable designs' }),
    t('solution3', { defaultValue: 'Eco-friendly options' }),
    t('solution4', { defaultValue: 'Affordable pricing' }),
  ];

  return (
    <section className="bg-adh-bg py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-adh-brand mb-8">
          {t('heading', { defaultValue: 'Premium Solutions' })}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {solutions.map((solution, idx) => (
            <div
              key={idx}
              className="flex items-center p-4 bg-adh-surface rounded-lg shadow-md border border-adh-stroke"
            >
              <CheckCircle className="w-6 h-6 text-adh-brand mr-4" aria-hidden="true" />
              <span className="text-lg text-adh-text">{solution}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}