import React from 'react';
import { useTranslation } from 'react-i18next';
import createTT from '../lib/tt';
import { Award, Users, Star, Clock } from 'lucide-react';
import { nf } from '../lib/format';
import { motion, useReducedMotion } from 'framer-motion';

export default function StatsSection() {
  const { t, i18n } = useTranslation('stats');
  const tt = createTT(t, 'stats');
  const isRTL = typeof i18n.dir === 'function' ? i18n.dir() === 'rtl' : String(i18n.dir || '').toLowerCase() === 'rtl';
  const reduceMotion = useReducedMotion();

  // reference motion to avoid unused-import lint in some toolchains
  void motion;

  const locale = i18n?.resolvedLanguage || i18n?.language || 'en';
  const N = nf(locale);

  // Helper: format displayed number with locale-aware digits
  const fmtNumStr = (raw) => {
    const s = String(raw);
    if (s.includes('24/7')) return `${N.format(24)}/${N.format(7)}`;
    if (s.endsWith('+')) return `${N.format(Number(s.replace('+', '')))}+`;
    if (s.endsWith('%')) return `${N.format(Number(s.replace('%', '')))}%`;
    const num = Number(s);
    return Number.isFinite(num) ? N.format(num) : s;
  };

  // Helper: accessible spoken labels for the numbers
  const ariaFor = (raw) => {
    const s = String(raw);
    if (s.includes('24/7')) return tt('a11y.alwaysAvailable', { defaultValue: 'Available 24 hours a day, 7 days a week' });
    if (s.endsWith('+')) return tt('a11y.moreThan', { defaultValue: 'More than {{n}}', n: N.format(Number(s.replace('+',''))) });
    if (s.endsWith('%')) return tt('a11y.percent', { defaultValue: '{{n}} percent', n: N.format(Number(s.replace('%',''))) });
    const num = Number(s);
    return Number.isFinite(num) ? N.format(num) : s;
  };

  const stats = [
    { icon: Award,  number: '75+',   labelKey: 'experience', defaultLabel: 'Years of Experience' },
    { icon: Users,  number: '1000+', labelKey: 'clients',    defaultLabel: 'Satisfied Clients' },
    { icon: Star,   number: '100%',  labelKey: 'quality',    defaultLabel: 'Quality Guarantee' },
    { icon: Clock,  number: '24/7',  labelKey: 'support',    defaultLabel: 'Customer Support' },
  ];

  return (
    <section
      className="relative z-20 py-16 transition-colors duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-labelledby="stats-heading"
      role="region"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="h-full w-full bg-[#0C1A2B]" />
        <div className="absolute inset-0 bg-linear-to-b from-[rgba(12,26,43,0.2)] to-[rgba(12,26,43,0.0)]" />
      </div>
      <h2 id="stats-heading" className="sr-only">
        {tt('heading', { defaultValue: 'Key company statistics' })}
      </h2>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-12 sm:py-16 text-center"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={{ hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: reduceMotion ? {} : { delay: idx * 0.12, duration: 0.6, type: 'spring', stiffness: 180 } } }}
              className="flex flex-col items-center gap-1 sm:gap-2 text-center"
            >
              {(() => { const IconComp = stat.icon; return <IconComp className="w-7 h-7 text-adh-text-muted" aria-hidden="true" />; })()}
              <p className="text-2xl sm:text-3xl leading-[1.2] font-semibold tracking-[0.02em] text-adh-btn-fg md:text-[34px]">{fmtNumStr(stat.number)}</p>
              <p className="max-w-[30ch] text-xs sm:text-sm leading-[1.4] font-normal text-[#C9C9C9] md:text-[16px]">{tt(stat.labelKey, stat.defaultLabel)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
