import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion, useReducedMotion } from 'framer-motion';

type WhyItem = { key: string; title: string; desc: string; icon: 'Time' | 'Shield' | 'Layers' | 'Spark' };
interface WhyChooseSectionProps { id?: string; className?: string }

const TimeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 7.5v4.4l2.6 1.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 3.2L6.5 5.1v6.1c0 3.1 2.3 5.9 5.5 6.9 3.2-1 5.5-3.8 5.5-6.9V5.1L12 3.2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M9.5 11.7l1.7 1.7 3.3-3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4.5 9.5L12 5.3l7.5 4.2L12 13.7 4.5 9.5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M6 12.7L12 16l6-3.3M6 15.9L12 19l6-3.1" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const SparkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 3.2l1.4 3.1 3.1 1.4-3.1 1.4-1.4 3.1-1.4-3.1-3.1-1.4 3.1-1.4L12 3.2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M6.3 14.2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7zM17.7 14.2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const ICONS: Record<WhyItem['icon'], React.FC<{ className?: string }>> = { Time: TimeIcon, Shield: ShieldIcon, Layers: LayersIcon, Spark: SparkIcon };

const WHY_ITEMS: WhyItem[] = [
  { key: 'experience', title: 'Decades of Craftsmanship', desc: 'Seasoned expertise in premium curtains, blinds, and bespoke shading solutions.', icon: 'Time' },
  { key: 'quality', title: 'Precision & Reliability', desc: 'Carefully selected materials and installation standards that stand the test of time.', icon: 'Shield' },
  { key: 'layers', title: 'Integrated Solutions', desc: 'From measurement to final styling, every layer is coordinated under one team.', icon: 'Layers' },
  { key: 'innovation', title: 'Smart Comfort & Design', desc: 'Motorized systems, automation, and refined finishes tailored to modern interiors.', icon: 'Spark' },
];

export default function WhyChooseSectionClean({ id = 'why', className }: WhyChooseSectionProps) {
  const { t, i18n } = useTranslation('home', { useSuspense: false });
  const reduce = useReducedMotion();
  const dir = (typeof i18n.dir === 'function' ? i18n.dir() : undefined) || (i18n.language?.startsWith('ar') ? 'rtl' : 'ltr');
  const isRTL = dir === 'rtl';

  const subtitle = t('why.subtitle', { defaultValue: 'Premium Interior Solutions' });
  const title = t('why.title', { defaultValue: 'Why choose Abdulhaq Dimensions?' });
  const description = t('why.description', { defaultValue: "We don't just provide curtains — we design experiences." });

  const containerVariants: any = reduce ? {} : { visible: { transition: { staggerChildren: 0.12 } } };
  const cardVariants: any = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 28, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, type: 'spring', stiffness: 120, damping: 18 } } };

  return (
    <section id={id} className={className}>
      <div className="container mx-auto py-14 md:py-18 px-4">
        <header className="max-w-3xl mx-auto text-center mb-8 md:mb-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-adh-text-muted">{subtitle}</p>
          <h2 className="mt-3 text-[clamp(24px,5vw,32px)] md:text-3xl font-bold text-adh-text px-4">{title}</h2>
          <p className="mt-3 text-sm md:text-base lg:text-lg leading-relaxed text-adh-text-muted px-4">{description}</p>
        </header>

        <Motion.div initial="hidden" animate="visible" variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
          {WHY_ITEMS.map(item => {
            const Icon = ICONS[item.icon];
            const itemTitle = t(`why.${item.key}.title`, { defaultValue: item.title });
            const itemDesc = t(`why.${item.key}.desc`, { defaultValue: item.desc });
            return (
              <Motion.div key={item.key} variants={cardVariants} className="w-full">
                <div className="h-full rounded-xl md:rounded-2xl border border-adh-stroke bg-adh-surface/70 backdrop-blur-sm shadow-adh-soft px-5 py-5 md:px-7 md:py-6 flex items-center gap-3.5 md:gap-4.5">
                  <div className="shrink-0">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-adh-chip text-adh-primary flex items-center justify-center border border-adh-stroke/70 shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                  </div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-base md:text-lg font-semibold text-adh-text m-0 leading-tight tracking-[0.01em]">{itemTitle}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-adh-text-muted">{itemDesc}</p>
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </Motion.div>
      </div>
    </section>
  );
}
