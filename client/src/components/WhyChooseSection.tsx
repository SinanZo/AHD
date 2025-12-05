// src/components/WhyChooseSection.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion, useReducedMotion } from 'framer-motion';

// Small inline icons
const TimeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M12 7.5v4.4l2.6 1.7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3.2 6.5 5.1v6.1c0 3.1 2.3 5.9 5.5 6.9 3.2-1 5.5-3.8 5.5-6.9V5.1L12 3.2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="m9.5 11.7 1.7 1.7 3.3-3.3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m4.5 9.5 7.5-4.2 7.5 4.2L12 13.7 4.5 9.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="m6 12.7 6 3.3 6-3.3M6 15.9 12 19l6-3.1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const SparkIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3.2 13.4 6.3 16.5 7.7 13.4 9.1 12 12.2 10.6 9.1 7.5 7.7 10.6 6.3 12 3.2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="m6.3 14.2.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7Zm11.4 0 .8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

type Reason = {
  key: string;
  title: string;
  desc: string;
  icon: 'time' | 'shield' | 'layers' | 'spark';
};

const REASONS: Reason[] = [
  {
    key: 'experience',
    title: 'Proven experience',
    desc: 'More than four decades delivering tailored curtains, blinds and interior shading solutions.',
    icon: 'time',
  },
  {
    key: 'quality',
    title: 'Reliable quality',
    desc: 'Premium fabrics, hardware and installation methods that keep performing year after year.',
    icon: 'shield',
  },
  {
    key: 'integration',
    title: 'Integrated approach',
    desc: 'From measurement and design to fabrication and after-sales, everything is handled in-house.',
    icon: 'layers',
  },
  {
    key: 'innovation',
    title: 'Smart & elegant',
    desc: 'Motorized systems, automation and refined finishes to match modern residential and commercial spaces.',
    icon: 'spark',
  },
];

const ICON_MAP: Record<Reason['icon'], React.FC<{ className?: string }>> = {
  time: TimeIcon,
  shield: ShieldIcon,
  layers: LayersIcon,
  spark: SparkIcon,
};

interface WhyChooseSectionProps {
  id?: string;
  className?: string;
}

export default function WhyChooseSection({
  id = 'why',
  className,
}: WhyChooseSectionProps) {
  const { t, i18n } = useTranslation('home', { useSuspense: false });
  const reduce = useReducedMotion();
  const dir =
    (typeof i18n.dir === 'function' ? i18n.dir() : undefined) ||
    (i18n.language?.startsWith('ar') ? 'rtl' : 'ltr');
  const isRTL = dir === 'rtl';

  const subtitle = t('why.subtitle', {
    defaultValue: 'Premium Interior Solutions',
  });
  const title = t('why.title', {
    defaultValue: 'Why choose Abdulhaq Dimensions?',
  });
  const description = t('why.description', {
    defaultValue:
      "We don't just provide curtains — we design visual and tactile experiences that give every space a distinct identity and soul, with a steadfast commitment to quality, craftsmanship and innovation.",
  });

  const containerVariants: any = reduce
    ? {}
    : { visible: { transition: { staggerChildren: 0.12 } } };

  const cardVariants: any = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.55,
            type: 'spring',
            stiffness: 120,
            damping: 18,
          },
        },
      };

  return (
    <section id={id} className={className}>
      <div className="container mx-auto py-16">
        {/* Heading */}
        <header className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-adh-text-muted">
            {subtitle}
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-adh-text">
            {title}
          </h2>
          <p className="mt-3 text-base md:text-lg leading-relaxed text-adh-text-muted">
            {description}
          </p>
        </header>

        {/* 2×2 pill layout */}
        <Motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {REASONS.map(reason => {
            const Icon = ICON_MAP[reason.icon];

            return (
              <Motion.div
                key={reason.key}
                variants={cardVariants}
                className="w-full"
              >
                <div className="h-full rounded-[28px] border border-adh-stroke bg-adh-bg/40 px-8 py-5 flex items-center gap-6 shadow-adh-soft">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-2xl border border-adh-stroke bg-adh-bg flex items-center justify-center text-adh-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    className={`flex-1 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    <h3 className="text-base md:text-lg font-semibold text-adh-text m-0">
                      {reason.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-adh-text-muted">
                      {reason.desc}
                    </p>
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
