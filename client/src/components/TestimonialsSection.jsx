// src/components/TestimonialsSection.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const { t } = useTranslation('home');
  const testimonials = t('testimonials.list', { returnObjects: true });

  return (
    <section id="testimonials" className="section-padding bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="section-subtitle">{t('testimonials.subtitle')}</div>
          <h2 className="section-title">{t('testimonials.title')}</h2>
          <p className="body-text text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="italic text-muted-foreground mb-4">“{item.quote}”</p>
              <div className="font-bold text-primary">{item.name}</div>
              <div className="text-sm text-muted-foreground">{item.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
