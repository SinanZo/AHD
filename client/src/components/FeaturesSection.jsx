import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

export default function FeaturesSection() {
  const { t } = useTranslation('home');

  const features = t('features.items', { returnObjects: true });

  return (
    <section className="section-padding bg-white border-t border-border" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="section-subtitle">{t('features.subtitle')}</div>
          <h2 className="section-title">{t('features.title')}</h2>
          {/* Optional: why choose us short block */}
          {t('features.why_heading') && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold mb-2">{t('features.why_heading')}</h3>
              <p className="body-text text-muted-foreground max-w-3xl mx-auto">{t('features.why_text')}</p>
            </div>
          )}
          <p className="body-text text-muted-foreground max-w-2xl mx-auto">
            {t('features.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-muted/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-muted"
            >
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="text-primary w-6 h-6 mt-1" />
                <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
              </div>
              <p className="body-text text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
