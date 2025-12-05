import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  CurtainsDraperiesIcon,
  RollerBlindsIcon,
  DesignerBlindsIcon,
  CommercialSolutionsIcon,
  ComplementaryServicesIcon,
} from '../icons/AHDLineIcons';
import { Check } from 'lucide-react';

/**
 * Premium Services section
 * - Data-driven (keeps i18n copy as canonical)
 * - Uses AHD theme tokens only
 * - Accessible article regions, keyboard focus states
 * - Framer Motion for scroll + hover micromotions
 */

const cardVariants = (reduce) =>
  reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' } }),
      };

// Check icon for bullets – bolder
const IconCheck = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ServicesPremium() {
  const { t } = useTranslation('services');
  const reduce = false;

  const srcItems = Array.isArray(t('items', { returnObjects: true })) ? t('items', { returnObjects: true }) : [];

  const services = [
    {
      id: 'curtains-draperies',
      title: srcItems[0]?.title || 'Curtains & Draperies',
      summary: srcItems[0]?.desc || srcItems[0]?.description || 'Classic and modern curtains tailored for both residential and commercial spaces.',
      bullets: Array.isArray(srcItems[0]?.features) ? srcItems[0].features : ['Custom-made designs', 'Fire-retardant fabrics', 'Premium materials'],
      Icon: CurtainsDraperiesIcon,
    },
    {
      id: 'roller-blinds',
      title: srcItems[1]?.title || 'Roller Blinds & Shades',
      summary: srcItems[1]?.desc || srcItems[1]?.description || 'Roller blinds, vertical blinds, and innovative window solutions.',
      bullets: Array.isArray(srcItems[1]?.features) ? srcItems[1].features : ['Full or partial blackout options', 'Automated operating systems', 'High energy efficiency'],
      Icon: RollerBlindsIcon,
    },
    {
      id: 'designer-blinds',
      title: srcItems[2]?.title || 'Specialized Designer Blinds',
      summary: srcItems[2]?.desc || srcItems[2]?.description || 'Japanese panels, Roman shades, wooden blinds, metal blinds, and honeycomb shades.',
      bullets: Array.isArray(srcItems[2]?.features) ? srcItems[2].features : ['Functional and aesthetic design', 'Optimal light control', 'Long-lasting quality'],
      Icon: DesignerBlindsIcon,
    },
    {
      id: 'commercial-solutions',
      title: srcItems[3]?.title || 'Commercial Solutions',
      summary: srcItems[3]?.desc || srcItems[3]?.description || 'Tailored solutions for hotels, hospitals, and office spaces.',
      bullets: Array.isArray(srcItems[3]?.features) ? srcItems[3].features : ['Heavy-duty tracks', 'Anti-bacterial fabrics', 'Compliance with safety standards'],
      Icon: CommercialSolutionsIcon,
    },
    {
      id: 'complementary-services',
      title: srcItems[4]?.title || 'Complementary Services',
      summary: srcItems[4]?.desc || srcItems[4]?.description || 'Beyond curtains and blinds — a full set of integrated offerings to complete your project.',
      bullets: Array.isArray(srcItems[4]?.features) ? srcItems[4].features : ['Luxury wallpaper', 'Outdoor shading systems & glass roofing', 'Flooring solutions & acoustic treatments', 'Professional furniture upholstery', 'Exclusive curtain accessories'],
      Icon: ComplementaryServicesIcon,
    },
  ];

  // Card component to reduce repetition
  const ServiceCard = ({ svc, idx, maxBullets = 4, isPrimary = false }) => (
    <motion.article
      key={svc.id}
      custom={idx}
      variants={cardVariants(reduce)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      aria-label={svc.title}
      tabIndex={0}
      className={`group relative flex flex-col rounded-[14px] border ${isPrimary ? 'border-adh-brand-light shadow-adh-card-hover' : 'border-adh-stroke shadow-adh-card'} bg-adh-surface/95 dark:bg-adh-surface/40 px-6 md:px-8 pt-14 pb-12 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-adh-card-hover hover:border-adh-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-adh-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-adh-bg`}
    >
      {/* Icon badge */}
      <div className="mx-auto flex items-center justify-center rounded-full border border-adh-stroke/40 bg-adh-surface/80 text-adh-primary transition-all duration-300 ease-out ring-0 group-hover:bg-adh-primary/90 group-hover:text-adh-btn-fg group-hover:ring-adh-primary/30 p-2.5 md:p-3">
        <svc.Icon className="h-9 w-9 md:h-11 md:w-11 lg:h-12 lg:w-12" />
      </div>

      {/* Title (centered) — slightly heavier */}
      <h3 className="mt-4 text-lg md:text-xl font-semibold font-serif text-adh-text text-center tracking-tight -tracking-[0.02em]">{svc.title}</h3>

      {/* Summary (centered, constrained) — lighter for elegance */}
      <p className="mt-2 text-sm leading-relaxed text-adh-text-secondary/85 text-center max-w-[36ch] mx-auto">{svc.summary}</p>

      {/* Bullets – LEFT aligned for readability */}
      <ul className={`mt-8 text-sm text-adh-text-secondary/85 text-left w-full ${svc.id === 'complementary-services' ? 'lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-2' : ''} space-y-1.5`}> 
        {svc.bullets.slice(0, maxBullets).map((b, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <Check className="mt-0.5 h-4 w-4 text-adh-accent/90 shrink-0" strokeWidth={1.6} />
            <span className="leading-snug tracking-tight text-adh-text-secondary/90">{b}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );

  return (
    <section id="services-premium" className="bg-adh-bg text-adh-text" aria-labelledby="services-premium-heading">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
        {/* Section header – constrained to max-w-3xl, improved vertical rhythm */}
        <motion.header className="max-w-3xl mx-auto text-center mb-10 md:mb-14" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-adh-text-muted">
            {t('subtitle') || 'Our Services'}
          </p>
          <h2 id="services-premium-heading" className="mt-4 text-3xl md:text-[2.5rem] lg:text-4xl font-bold text-adh-text tracking-tight leading-tight">
            {t('title') || 'Premium Solutions'}
          </h2>
          <p className="mt-5 text-sm md:text-base leading-relaxed text-adh-text-secondary max-w-xl mx-auto">
            {t('description')}
          </p>
        </motion.header>

        {/* "WHAT WE OFFER" bridge label — more breathing room */}
          <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-adh-text-muted mb-8 md:mb-10">
          {t('whatWeOfferTitle') || 'What We Offer'}
        </p>
          {/* Responsive editorial layout */}
          {/* Desktop: 3 cards top row, 2 centered bottom row */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-8">
              {services.slice(0, 3).map((svc, idx) => (
                <ServiceCard key={svc.id} svc={svc} idx={idx} maxBullets={4} isPrimary={idx === 1} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <div className="grid grid-cols-2 gap-8 w-2/3">
                {services.slice(3).map((svc, idx) => (
                  <ServiceCard key={svc.id} svc={svc} idx={idx + 3} maxBullets={5} />
                ))}
              </div>
            </div>
          </div>

          {/* Tablet: show 2x2 grid for first 4, then centered 5th below */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-2 gap-7">
              {services.slice(0, 4).map((svc, idx) => (
                <ServiceCard key={svc.id} svc={svc} idx={idx} maxBullets={4} isPrimary={idx === 1} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <div className="w-11/12 sm:w-3/4 md:w-2/3">
                <ServiceCard svc={services[4]} idx={4} maxBullets={5} />
              </div>
            </div>
          </div>

          {/* Mobile: stacked full width */}
          <div className="block md:hidden">
            <div className="flex flex-col gap-6">
              {services.map((svc, idx) => (
                <ServiceCard key={svc.id} svc={svc} idx={idx} maxBullets={4} isPrimary={idx === 1} />
              ))}
            </div>
          </div>

        <div className="mt-14" aria-hidden="true" />
      </div>
    </section>
  );
}
