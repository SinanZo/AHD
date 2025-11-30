import React from 'react';
import { useTranslation } from 'react-i18next';
import createTT from '../lib/tt';
import {
  Card
} from './ui/card';
import { Star, Layers, Building, Blinds } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

// Custom Curtain SVG icon component (decorative)
const CurtainIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 2h18v2H3V2zm0 4h4v16H3V6zm6 0h2v16H9V6zm4 0h2v16h-2V6zm4 0h4v16h-4V6z" fill="currentColor" />
    <path d="M5 8c1 2 1 4 0 6M11 8c1 2 1 4 0 6M15 8c1 2 1 4 0 6M19 8c1 2 1 4 0 6" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const pickIcon = (svc) => {
  const key = (svc?.slug || svc?.title || '').toLowerCase();
  if (/(curtain|drape|ستائر)/i.test(key)) return CurtainIcon;
  if (/(roller|blind|shade|رولر)/i.test(key)) return Blinds;
  if (/(commercial|office|corporate|contract|شركة|مؤسسة)/i.test(key)) return Building;
  if (/(wallpaper|wall paper|ورق)/i.test(key)) return Layers;
  return Star;
};

export default function ServicesSection() {
  const { t } = useTranslation('services');
  const tt = createTT(t, 'services');
  const reduce = useReducedMotion();

  const items = Array.isArray(t('items', { returnObjects: true })) ? t('items', { returnObjects: true }) : [];
  const services = items.slice(0, 4); // ensure 4-up max

  const containerVariants = reduce ? {} : { visible: { transition: { staggerChildren: 0.13 } } };
  const cardVariants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 44, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, type: 'spring' } } };

  // reference motion to avoid unused-import lint in some toolchains
  void motion;

  return (
    <section
      id="services"
      className="section-padding bg-white dark:bg-[#10181c] relative z-10"
      role="region"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="section-subtitle text-[color:#9fc0b0] font-bold uppercase tracking-wide mb-2">
            {tt('subtitle')}
          </div>
          <h2
            id="services-heading"
            className="section-title text-4xl md:text-5xl font-jockey text-[color:#002b3a] dark:text-white font-bold mb-4"
          >
            {tt('title')}
          </h2>
          <p className="body-text text-gray-700 dark:text-white/90 max-w-2xl mx-auto">
            {tt('description')}
          </p>
        </div>

        {/* Semantic list of service cards */}
        <motion.ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={containerVariants}
        >
          {services.map((svc, idx) => {
            const Icon = pickIcon(svc);
            const titleId = `service-title-${idx}`;
            const features = Array.isArray(svc.features) ? svc.features.slice(0, 3) : [];

            return (
              <motion.li key={idx} variants={cardVariants} className="group h-full list-none">
                <article
                  className="h-full"
                  aria-labelledby={titleId}
                >
                  <Card
                    className="
                      card flex flex-col h-full
                      transition-all duration-200 ease-in-out
                      hover:shadow-lg dark:hover:shadow-2xl
                      border border-[var(--stroke)]
                    "
                    style={{
                      borderRadius: '18px',
                      padding: '28px 32px',
                      background: 'var(--card)',
                      minHeight: '320px'
                    }}
                  >
                    {/* Icon circle */}
                    <div className="flex justify-center mb-3">
                      <div
                        className={`flex items-center justify-center rounded-full ${reduce ? '' : 'group-hover:scale-110'} transition-transform duration-200`}
                        style={{
                          width: '56px',
                          height: '56px',
                          background: 'var(--chip)',
                          border: '1px solid var(--stroke)'
                        }}
                        aria-hidden="true"
                      >
                        <Icon className="w-6 h-6" style={{ color: 'var(--brand)' }} aria-hidden="true" focusable="false" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      id={titleId}
                      className="card-title text-center mb-3 leading-tight"
                      style={{
                        color: 'var(--fg)',
                        letterSpacing: '-0.01em',
                        fontWeight: 300,
                        fontSize: '22px',
                        marginTop: '12px'
                      }}
                    >
                      {svc.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-center leading-relaxed mb-4"
                      style={{
                        color: 'var(--fg)',
                        opacity: 0.75,
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                    >
                      {svc.desc}
                    </p>

                    {/* Features */}
                    {features.length > 0 && (
                      <ul className="space-y-3 flex-1">
                        {features.map((feat, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3"
                            style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--fg)' }}
                          >
                            <Star className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-2)' }} aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                </article>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
