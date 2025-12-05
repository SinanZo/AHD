import React from 'react';
import { useTranslation } from 'react-i18next';
import createTT from '../lib/tt';
import { motion, useReducedMotion } from 'framer-motion';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
// ensure `motion` import is treated as used by some linters/parsers
void motion;
import { Sparkles, ShieldCheck, Users } from 'lucide-react';
// If you use react-helmet-async in the app shell:
// Helmet removed here; SEO is provided via the shared Layout props
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';
// Explicitly import the JSX version to avoid ambiguity with TSX sibling
import WhyChooseUs from '../components/WhyChooseUs.jsx';

export default function About() {
  const { t, i18n } = useTranslation('about');
  const tt = createTT(t, 'about');
  const isRTL = typeof i18n.dir === 'function' ? i18n.dir() === 'rtl' : (i18n.dir || '').toString().toLowerCase() === 'rtl';
  const reduceMotion = useReducedMotion();
  const { shouldDisableAnimations } = useMobileOptimization();

  // Helpers: omit motion props entirely when reduced motion is requested or on mobile
  const disableMotion = reduceMotion || shouldDisableAnimations;
  const when = (v) => (disableMotion ? undefined : v);
  const init = (v) => (disableMotion ? undefined : v);

  const title = tt('seo.title', { defaultValue: 'About Us | Abdulhaq Dimensions' });
  const description = tt('seo.description', { defaultValue: 'Since 1948, Abdulhaq Dimensions has delivered premium interior solutions for residential and commercial spaces across the region.' });

  const keywords = [
    'Abdulhaq Dimensions', 'about', 'legacy', 'history', 'interior solutions', 'Amman', 'Jordan', 'premium', 'design', 'commercial', 'residential'
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Abdulhaq Dimensions',
    'description': description,
    'url': 'https://abdulhaqdimensions.com',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Amman',
      'addressCountry': 'JO'
    }
  };
  return (
    <Layout title={title} description={description} keywords={keywords} jsonLd={jsonLd}>
      <main id="main" tabIndex={-1}>
        {/* Founder / Legacy */}
        <Reveal>
          <section
            className="relative overflow-hidden py-20 text-white"
            style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%)' }}
            dir={isRTL ? 'rtl' : 'ltr'}
            aria-labelledby="about-legacy"
          >
            <div aria-hidden="true" className="absolute top-0 left-0 z-0 h-64 w-64 rounded-full opacity-20 blur-2xl bg-adh-accent" />
            <div aria-hidden="true" className="absolute right-0 bottom-0 z-0 h-80 w-80 rounded-full opacity-10 blur-2xl bg-adh-bg-linen" />

            <div className="relative z-10 container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
              <motion.div
                initial={init({ opacity: 0, y: 36 })}
                whileInView={when({ opacity: 1, y: 0 })}
                viewport={{ once: true, amount: 0.4 }}
                transition={when({ duration: 0.8, type: 'spring' })}
              >
                <h1 id="about-legacy" className="mb-6 text-3xl leading-snug font-bold drop-shadow-xl md:text-4xl">
                  {tt('legacy_title')}
                </h1>
                <p className="mb-4 text-lg text-white/90">{tt('legacy_p1')}</p>
                <p className="text-lg text-white/90">{tt('legacy_p2')}</p>
              </motion.div>

              <motion.figure
                initial={init({ opacity: 0, scale: 0.97, x: isRTL ? -48 : 48 })}
                whileInView={when({ opacity: 1, scale: 1, x: 0 })}
                viewport={{ once: true, amount: 0.4 }}
                transition={when({ duration: 0.8, type: 'spring', delay: 0.2 })}
                className="flex justify-center"
              >
                <div className="max-w-xs rounded-3xl border p-4 backdrop-blur-lg bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/30">
                  <picture>
                    <img
                      src="/images/founder.jpg"
                      alt={tt('founder_alt', { defaultValue: 'Founder Zuhair Abdulhaq' })}
                      className="w-full rounded-2xl object-cover shadow-lg"
                      width={480}
                      height={560}
                      loading="eager"
                      fetchpriority="high"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.svg';
                      }}
                    />
                  </picture>
                  <figcaption className="mt-3 text-center text-sm text-white/80">
                    {tt('founder_caption', { defaultValue: 'Founder of Abdulhaq Dimensions' })}
                  </figcaption>
                </div>
              </motion.figure>
            </div>
          </section>
        </Reveal>

        {/* Vision / Mission */}
        <Reveal delay={0.05}>
        <section
          className="relative py-20 bg-adh-bg"
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-labelledby="about-vision-mission"
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={init({ opacity: 0, y: 32 })}
              whileInView={when({ opacity: 1, y: 0 })}
              viewport={{ once: true, amount: 0.35 }}
              transition={when({ duration: 0.7 })}
            >
              <h2 id="about-vision-mission" className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-adh-text">
                {tt('vision_mission')}
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              <motion.article
                initial={init({ opacity: 0, x: isRTL ? -28 : 28 })}
                whileInView={when({ opacity: 1, x: 0 })}
                viewport={{ once: true, amount: 0.3 }}
                transition={when({ duration: 0.7, delay: 0.1 })}
                className="rounded-2xl border p-8 bg-adh-surface shadow-adh-soft border-adh-stroke"
                aria-labelledby="about-vision-h"
              >
                <div className="mb-4 flex items-center">
                  <Sparkles aria-hidden="true" className="mr-3 h-7 w-7 text-adh-accent" />
                  <h3 id="about-vision-h" className="mb-0 text-xl font-bold text-adh-text">
                    {tt('vision_title')}
                  </h3>
                </div>
                <p className="text-lg text-adh-text-secondary">{tt('vision_desc')}</p>
              </motion.article>

              <motion.article
                initial={init({ opacity: 0, x: isRTL ? 28 : -28 })}
                whileInView={when({ opacity: 1, x: 0 })}
                viewport={{ once: true, amount: 0.3 }}
                transition={when({ duration: 0.7, delay: 0.1 })}
                className="rounded-2xl border p-8 bg-adh-surface shadow-adh-soft border-adh-stroke"
                aria-labelledby="about-mission-h"
              >
                <div className="mb-4 flex items-center">
                  <ShieldCheck aria-hidden="true" className="mr-3 h-7 w-7 text-adh-accent" />
                  <h3 id="about-mission-h" className="mb-0 text-xl font-bold text-adh-text">
                    {tt('mission_title')}
                  </h3>
                </div>
                <p className="text-lg text-adh-text-secondary">{tt('mission_desc')}</p>
              </motion.article>
            </div>
          </div>
  </section>
  </Reveal>
  {/* Why choose us */}
  <WhyChooseUs />

  {/* Core Values */}
        <Reveal delay={0.1}>
        <section
          className="relative overflow-hidden py-20 text-white bg-adh-brand"
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-labelledby="about-core-values"
        >
          <div aria-hidden="true" className="absolute -top-10 -right-24 z-0 h-80 w-80 rounded-full opacity-10 blur-2xl bg-adh-bg-linen" />

          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={init({ opacity: 0, y: 32 })}
              whileInView={when({ opacity: 1, y: 0 })}
              viewport={{ once: true, amount: 0.25 }}
              transition={when({ duration: 0.6 })}
            >
              <h2 id="about-core-values" className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
                {tt('core_values')}
              </h2>
            </motion.div>

            <div className="grid gap-10 md:grid-cols-3">
                {[
                { icon: <Sparkles aria-hidden="true" className="w-7 h-7 text-adh-bg-linen mr-3" />, h: 'innovation_title', p: 'innovation_desc' },
                { icon: <Users aria-hidden="true" className="w-7 h-7 text-adh-bg-linen mr-3" />, h: 'transparency_title', p: 'transparency_desc' },
                { icon: <ShieldCheck aria-hidden="true" className="w-7 h-7 text-adh-bg-linen mr-3" />, h: 'accessibility_title', p: 'accessibility_desc' },
              ].map((item, i) => (
                <motion.article
                  key={i}
                  initial={init({ opacity: 0, y: 16, scale: 0.97 })}
                  whileInView={when({ opacity: 1, y: 0, scale: 1 })}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={when({ duration: 0.65, delay: 0.08 + i * 0.1 })}
                  className="rounded-2xl border p-8 backdrop-blur-lg bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/15"
                >
                  <div className="mb-4 flex items-center">
                    {item.icon}
                    <h3 className="text-xl font-bold">{tt(item.h)}</h3>
                  </div>
                  <p>{tt(item.p)}</p>
                </motion.article>
              ))}
            </div>
          </div>
  </section>
  </Reveal>
      </main>
    </Layout>
  );
}
