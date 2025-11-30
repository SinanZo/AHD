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
import WhyChooseUs from '../components/WhyChooseUs';

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
          className="relative text-white py-20 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%)' }}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-labelledby="about-legacy"
        >
          <div aria-hidden="true" className="absolute left-0 top-0 w-64 h-64 rounded-full bg-[#5b7d89] opacity-20 blur-2xl z-0" />
          <div aria-hidden="true" className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-[#e8e6e6] opacity-10 blur-2xl z-0" />

          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={init({ opacity: 0, y: 36 })}
              whileInView={when({ opacity: 1, y: 0 })}
              viewport={{ once: true, amount: 0.4 }}
              transition={when({ duration: 0.8, type: 'spring' })}
            >
              <h1 id="about-legacy" className="text-3xl md:text-4xl font-bold leading-snug mb-6 drop-shadow-xl">
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
              <div className="bg-white/10 rounded-3xl shadow-2xl p-4 backdrop-blur-lg border border-white/30 max-w-xs">
                <picture>
                  {/* founder.webp not present in repo; use the existing JPG directly to avoid broken requests */}
                  <img
                    src="/images/founder.jpg"
                    alt={tt('founder_alt', { defaultValue: 'Founder Zuhair Abdulhaq' })}
                    className="rounded-2xl shadow-lg object-cover w-full"
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
                <figcaption className="mt-3 text-sm text-white/80 text-center">
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
          className="relative py-20 bg-gradient-to-br from-white via-[#e8e6e6]/70 to-white dark:from-[#232c32] dark:to-[#181e21]"
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-labelledby="about-vision-mission"
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={init({ opacity: 0, y: 32 })}
              whileInView={when({ opacity: 1, y: 0 })}
              viewport={{ once: true, amount: 0.35 }}
              transition={when({ duration: 0.7 })}
            >
              <h2 id="about-vision-mission" className="text-3xl md:text-4xl font-bold text-[#002b3a] dark:text-white mb-4 tracking-tight">
                {tt('vision_mission')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.article
                initial={init({ opacity: 0, x: isRTL ? -28 : 28 })}
                whileInView={when({ opacity: 1, x: 0 })}
                viewport={{ once: true, amount: 0.3 }}
                transition={when({ duration: 0.7, delay: 0.1 })}
                className="bg-white/90 dark:bg-[#232c32]/60 rounded-2xl p-8 shadow-lg border border-[#e8e6e6] dark:border-[#181e21]"
                aria-labelledby="about-vision-h"
              >
                <div className="flex items-center mb-4">
                  <Sparkles aria-hidden="true" className="w-7 h-7 text-[#5b7d89] mr-3" />
                  <h3 id="about-vision-h" className="text-xl font-bold text-[#002b3a] dark:text-white mb-0">
                    {tt('vision_title')}
                  </h3>
                </div>
                <p className="text-lg text-[#00262B] dark:text-white/90">{tt('vision_desc')}</p>
              </motion.article>

              <motion.article
                initial={init({ opacity: 0, x: isRTL ? 28 : -28 })}
                whileInView={when({ opacity: 1, x: 0 })}
                viewport={{ once: true, amount: 0.3 }}
                transition={when({ duration: 0.7, delay: 0.1 })}
                className="bg-white/90 dark:bg-[#232c32]/60 rounded-2xl p-8 shadow-lg border border-[#e8e6e6] dark:border-[#181e21]"
                aria-labelledby="about-mission-h"
              >
                <div className="flex items-center mb-4">
                  <ShieldCheck aria-hidden="true" className="w-7 h-7 text-[#5b7d89] mr-3" />
                  <h3 id="about-mission-h" className="text-xl font-bold text-[#002b3a] dark:text-white mb-0">
                    {tt('mission_title')}
                  </h3>
                </div>
                <p className="text-lg text-[#00262B] dark:text-white/90">{tt('mission_desc')}</p>
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
          className="relative bg-gradient-to-br from-[#002b3a]/95 via-[#5b7d89]/70 to-[#00262b]/95 text-white py-20 overflow-hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-labelledby="about-core-values"
        >
          <div aria-hidden="true" className="absolute -right-24 -top-10 w-80 h-80 rounded-full bg-[#e8e6e6] opacity-10 blur-2xl z-0" />

          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={init({ opacity: 0, y: 32 })}
              whileInView={when({ opacity: 1, y: 0 })}
              viewport={{ once: true, amount: 0.25 }}
              transition={when({ duration: 0.6 })}
            >
              <h2 id="about-core-values" className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                {tt('core_values')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { icon: <Sparkles aria-hidden="true" className="w-7 h-7 text-[#e8e6e6] mr-3" />, h: 'innovation_title', p: 'innovation_desc' },
                { icon: <Users aria-hidden="true" className="w-7 h-7 text-[#e8e6e6] mr-3" />, h: 'transparency_title', p: 'transparency_desc' },
                { icon: <ShieldCheck aria-hidden="true" className="w-7 h-7 text-[#e8e6e6] mr-3" />, h: 'accessibility_title', p: 'accessibility_desc' },
              ].map((item, i) => (
                <motion.article
                  key={i}
                  initial={init({ opacity: 0, y: 16, scale: 0.97 })}
                  whileInView={when({ opacity: 1, y: 0, scale: 1 })}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={when({ duration: 0.65, delay: 0.08 + i * 0.1 })}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/15"
                >
                  <div className="flex items-center mb-4">
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
