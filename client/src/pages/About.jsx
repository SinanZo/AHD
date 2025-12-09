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
        <section
          className="relative overflow-hidden py-12 md:py-20 text-white"
          style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%)' }}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-labelledby="about-legacy"
        >
            <div aria-hidden="true" className="absolute top-0 left-0 z-0 h-64 w-64 rounded-full opacity-20 blur-2xl bg-adh-accent" />
            <div aria-hidden="true" className="absolute right-0 bottom-0 z-0 h-80 w-80 rounded-full opacity-10 blur-2xl bg-adh-bg-linen" />

            <div className="relative z-10 container mx-auto grid items-center gap-8 md:gap-12 px-4 lg:grid-cols-2">
              <div>
                <h1 id="about-legacy" className="mb-4 md:mb-6 text-2xl sm:text-3xl leading-snug font-bold drop-shadow-xl md:text-4xl">
                  {tt('legacy_title')}
                </h1>
                <p className="mb-3 md:mb-4 text-base sm:text-lg text-white/90">{tt('legacy_p1')}</p>
                <p className="text-base sm:text-lg text-white/90">{tt('legacy_p2')}</p>
              </div>

              <figure className="flex justify-center">
                <div className="w-full max-w-[280px] sm:max-w-xs rounded-3xl border p-3 sm:p-4 backdrop-blur-lg bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/30">
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
              </figure>
            </div>
        </section>

        {/* Vision / Mission */}
        <section
          className="relative py-12 md:py-20 bg-adh-bg"
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-labelledby="about-vision-mission"
        >
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 id="about-vision-mission" className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl text-adh-text">
                {tt('vision_mission')}
              </h2>
            </div>

            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <article
                className="rounded-2xl border p-6 md:p-8 bg-adh-surface shadow-adh-soft border-adh-stroke"
                aria-labelledby="about-vision-h"
              >
                <div className="mb-3 md:mb-4 flex items-center">
                  <Sparkles aria-hidden="true" className="mr-3 h-6 w-6 md:h-7 md:w-7 text-adh-accent" />
                  <h3 id="about-vision-h" className="mb-0 text-lg md:text-xl font-bold text-adh-text">
                    {tt('vision_title')}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-adh-text-secondary">{tt('vision_desc')}</p>
              </article>

              <article
                className="rounded-2xl border p-6 md:p-8 bg-adh-surface shadow-adh-soft border-adh-stroke"
                aria-labelledby="about-mission-h"
              >
                <div className="mb-3 md:mb-4 flex items-center">
                  <ShieldCheck aria-hidden="true" className="mr-3 h-6 w-6 md:h-7 md:w-7 text-adh-accent" />
                  <h3 id="about-mission-h" className="mb-0 text-lg md:text-xl font-bold text-adh-text">
                    {tt('mission_title')}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-adh-text-secondary">{tt('mission_desc')}</p>
              </article>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <WhyChooseUs />

        {/* Core Values */}
        <section
          className="relative overflow-hidden py-12 md:py-20 text-white bg-adh-brand"
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-labelledby="about-core-values"
        >
          <div aria-hidden="true" className="absolute -top-10 -right-24 z-0 h-80 w-80 rounded-full opacity-10 blur-2xl bg-adh-bg-linen" />

          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 id="about-core-values" className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
                {tt('core_values')}
              </h2>
            </div>

            <div className="grid gap-6 md:gap-10 md:grid-cols-3">
                {[
                { icon: <Sparkles aria-hidden="true" className="w-7 h-7 text-adh-bg-linen mr-3" />, h: 'innovation_title', p: 'innovation_desc' },
                { icon: <Users aria-hidden="true" className="w-7 h-7 text-adh-bg-linen mr-3" />, h: 'transparency_title', p: 'transparency_desc' },
                { icon: <ShieldCheck aria-hidden="true" className="w-7 h-7 text-adh-bg-linen mr-3" />, h: 'accessibility_title', p: 'accessibility_desc' },
              ].map((item, i) => (
                <article
                  key={i}
                  className="rounded-2xl border p-6 md:p-8 backdrop-blur-lg bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/15"
                >
                  <div className="mb-3 md:mb-4 flex items-center">
                    {item.icon}
                    <h3 className="text-lg md:text-xl font-bold">{tt(item.h)}</h3>
                  </div>
                  <p className="text-base">{tt(item.p)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
