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
    {
      icon: <Award className="w-8 h-8 text-[color:var(--brand)]" aria-hidden="true" focusable="false" />,
      number: '75+',
      label: tt('years'),
      subtitle: tt('since'),
      bg: 'bg-white/70 dark:bg-white/10',
    },
    {
      icon: <Users className="w-8 h-8 text-[color:var(--brand-2)]" aria-hidden="true" focusable="false" />,
      number: '1000+',
      label: tt('clients'),
      subtitle: tt('clientType'),
      bg: 'bg-white/70 dark:bg-white/10',
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-400" aria-hidden="true" focusable="false" />,
      number: '100%',
      label: tt('quality'),
      subtitle: tt('materials'),
      bg: 'bg-white/70 dark:bg-white/10',
    },
    {
      icon: <Clock className="w-8 h-8 text-[color:var(--brand)]" aria-hidden="true" focusable="false" />,
      number: '24/7',
      label: tt('support'),
      subtitle: tt('availability'),
      bg: 'bg-white/70 dark:bg-white/10',
    }
  ];

  return (
    <section
      className="bg-white dark:bg-[#10181c] py-16 relative z-20"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-labelledby="stats-heading"
      role="region"
    >
      <h2 id="stats-heading" className="sr-only">
        {tt('heading', { defaultValue: 'Key company statistics' })}
      </h2>

      <div className="container mx-auto px-4">
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 36 },
                visible: { opacity: 1, y: 0, transition: reduceMotion ? {} : { delay: idx * 0.12, duration: 0.6, type: 'spring', stiffness: 180 } }
              }}
              className="
                group flex flex-col items-center justify-center text-center
                bg-white/80 dark:bg-[#19222b]/70
                rounded-2xl px-6 py-10 shadow-xl
                backdrop-blur-md
                transition
                border border-white/70 dark:border-white/10
              "
              style={{ boxShadow: '0 4px 28px 0 rgba(91,125,137,0.10), 0 1px 4px 0 rgba(0,43,58,0.07)' }}
            >
              <div className={`flex items-center justify-center mb-5 rounded-full shadow-lg ${stat.bg} w-16 h-16 ${reduceMotion ? '' : 'group-hover:scale-110'} transition border border-white/50 dark:border-white/10`}> 
                {stat.icon}
              </div>

              {/* Number as the primary term */}
              <dt className="sr-only">{stat.label}</dt>
              <dd
                className="text-4xl md:text-5xl font-jockey text-[var(--brand)] dark:text-white mb-2 drop-shadow font-bold"
                aria-label={ariaFor(stat.number)}
              >
                {fmtNumStr(stat.number)}
              </dd>

              <div className="font-semibold text-[var(--brand-2)] dark:text-white/90 text-lg mb-0.5">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground dark:text-white/60">
                {stat.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
