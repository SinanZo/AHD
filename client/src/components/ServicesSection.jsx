import React from 'react';
import { useTranslation } from 'react-i18next';
import createTT from '../lib/tt';
import { Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

// Service list icons are selected inline where used; Star is used for bullet markers.

export default function ServicesSection() {
  const { t } = useTranslation('services');
  const tt = createTT(t, 'services');
  const reduce = useReducedMotion();

  const i18nItems = Array.isArray(t('items', { returnObjects: true })) ? t('items', { returnObjects: true }) : [];

  const services = [
    {
      id: 'curtains-draperies',
      title: i18nItems[0]?.title || 'Curtains & Draperies',
      summary: i18nItems[0]?.desc || i18nItems[0]?.description || 'Classic and modern curtains tailored for both residential and commercial spaces.',
      bullets: Array.isArray(i18nItems[0]?.features) ? i18nItems[0].features : ['Custom-made designs', 'Fire-retardant fabrics', 'Premium materials'],
      icon: 'curtain',
    },
    {
      id: 'roller-blinds',
      title: i18nItems[1]?.title || 'Roller Blinds & Shades',
      summary: i18nItems[1]?.desc || i18nItems[1]?.description || 'Roller blinds, vertical blinds, and innovative window solutions.',
      bullets: Array.isArray(i18nItems[1]?.features) ? i18nItems[1].features : ['Full or partial blackout options', 'Automated operating systems', 'High energy efficiency'],
      icon: 'blinds',
    },
    {
      id: 'designer-blinds',
      title: i18nItems[2]?.title || 'Specialized Designer Blinds',
      summary: i18nItems[2]?.desc || i18nItems[2]?.description || 'Japanese panels, Roman shades, wooden blinds, metal blinds, and honeycomb shades.',
      bullets: Array.isArray(i18nItems[2]?.features) ? i18nItems[2].features : ['Functional and aesthetic design', 'Optimal light control', 'Long-lasting quality'],
      icon: 'layers',
    },
    {
      id: 'commercial-solutions',
      title: i18nItems[3]?.title || 'Commercial Solutions',
      summary: i18nItems[3]?.desc || i18nItems[3]?.description || 'Tailored solutions for hotels, hospitals, and office spaces.',
      bullets: Array.isArray(i18nItems[3]?.features) ? i18nItems[3].features : ['Heavy-duty tracks', 'Anti-bacterial fabrics', 'Compliance with safety standards'],
      icon: 'building',
    },
    {
      id: 'complementary-services',
      title: i18nItems[4]?.title || 'Complementary Services',
      summary: i18nItems[4]?.desc || i18nItems[4]?.description || 'Beyond curtains and blinds — a full set of integrated offerings to complete your project.',
      bullets: Array.isArray(i18nItems[4]?.features) ? i18nItems[4].features : ['Luxury wallpaper', 'Outdoor shading systems & glass roofing', 'Flooring solutions & acoustic treatments', 'Professional furniture upholstery', 'Exclusive curtain accessories'],
      icon: 'package',
    },
  ];

  const containerVariants = reduce ? {} : { visible: { transition: { staggerChildren: 0.13 } } };
  const cardVariants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' } }),
      };

  // reference motion to avoid unused-import lint in some toolchains
  void motion;

  return (
    <section
      id="services"
      className="section-padding bg-adh-bg relative z-10"
      role="region"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <div className="section-subtitle text-adh-accent font-bold uppercase tracking-wide mb-2">
            {tt('subtitle')}
          </div>
          <h2
            id="services-heading"
            className="section-title text-4xl md:text-5xl font-jockey text-adh-text font-bold mb-4"
          >
            {tt('title')}
          </h2>
          <p className="body-text text-adh-text-secondary max-w-2xl mx-auto">
            {tt('description')}
          </p>
        </div>

        {/* Semantic list of service cards */}
        <div className="text-center max-w-[820px] mx-auto mb-8">
          <h3 className="text-xl font-semibold mb-2">{tt('whatWeOfferTitle')}</h3>
        </div>

        <motion.ul
          role="list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={containerVariants}
        >
          {services.map((svc, idx) => {
            const titleId = `service-title-${idx}`;

            // icon selection (small set; using inline SVG keeps control over color tokens)
            const Icon = (props) => {
              switch (svc.icon) {
                case 'curtain':
                  return (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <path d="M3 2h18v2H3V2zm0 4h4v16H3V6zm6 0h2v16H9V6zm4 0h2v16h-2V6zm4 0h4v16h-4V6z" fill="currentColor" />
                      <path d="M5 8c1 2 1 4 0 6M11 8c1 2 1 4 0 6M15 8c1 2 1 4 0 6M19 8c1 2 1 4 0 6" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  );
                case 'blinds':
                  return (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <path d="M2 3h20v2H2V3zm0 4h20v2H2V7zm0 4h20v2H2v-2zm0 4h20v2H2v-2zm0 4h20v2H2v-2z" fill="currentColor" />
                      <path d="M4 5h16M4 9h16M4 13h16M4 17h16M4 21h16" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  );
                case 'layers':
                  return (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <path d="M12 2l9 5-9 5-9-5 9-5z" fill="currentColor" />
                      <path d="M12 12l9-5v6l-9 5-9-5v-6l9 5z" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  );
                case 'building':
                  return (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" fill="currentColor" />
                      <path d="M9 22v-4h6v4" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  );
                case 'package':
                  return (
                    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" fill="currentColor" />
                      <path d="M12 22V12" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  );
                default:
                  return <Star {...props} />;
              }
            };

            return (
              <motion.li key={svc.id} custom={idx} variants={cardVariants} className="list-none">
                <motion.article aria-label={svc.title} tabIndex={0} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} className={`group relative flex flex-col rounded-2xl bg-adh-surface/95 border border-adh-stroke/70 shadow-adh-soft px-6 py-7 md:px-7 md:py-8 transition-theme duration-theme transform will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-adh-accent focus-visible:ring-offset-2 before:absolute before:inset-0 before:rounded-2xl before:border before:border-transparent before:bg-gradient-to-br before:from-adh-primary/35 before:to-adh-accent/40 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:-translate-y-1 hover:shadow-adh-card-hover`}>

                  {/* full-card clickable link, keeps accessible focus */}
                  <a href={`#${svc.id}`} className="absolute inset-0 z-10 sr-only focus:not-sr-only" aria-label={`${svc.title} — learn more`} />

                  <div className="mb-4 flex items-center justify-center z-0">
                    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} className="flex h-12 w-12 items-center justify-center rounded-full bg-adh-chip/80 text-adh-primary shadow-sm border border-adh-stroke/60 transition-theme group-hover:bg-adh-primary group-hover:text-adh-btn-fg">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </motion.div>
                  </div>

                  <div className="flex-1 z-0">
                    <h3 id={titleId} className="text-lg md:text-xl font-semibold text-adh-text text-center mb-2">{svc.title}</h3>
                    <p className="text-sm text-adh-text-muted text-center mb-5 leading-relaxed">{svc.summary}</p>

                    <ul className="space-y-2 text-sm text-adh-text-secondary mt-2" aria-hidden>
                      {svc.bullets.slice(0, 5).map((b, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="mt-1 text-adh-primary shrink-0" aria-hidden>
                            <Star className="w-4 h-4" />
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 z-0 text-center">
                    <a
                      href={`#${svc.id}`}
                      className="inline-block text-sm font-semibold text-adh-btn-fg bg-adh-btn px-4 py-2 rounded-md focus-visible:ring-2 focus-visible:ring-adh-accent focus-visible:outline-none"
                      aria-label={`${svc.title} — ${tt('learnMore', { defaultValue: 'Learn more' })}`}
                    >
                      {tt('learnMore', { defaultValue: 'Learn more' })}
                    </a>
                  </div>
                </motion.article>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
