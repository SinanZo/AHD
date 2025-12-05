import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

import HeroSection from '../components/HeroSection';
const StatsSection    = lazy(() => import('../components/StatsSection'));
const AboutSection    = lazy(() => import('../components/AboutSection'));
const ServicesSection = lazy(() => import('../components/sections/ServicesPremium'));
const WhyChooseSection = lazy(() => import('../components/WhyChooseSectionClean'));
const ProductsSection = lazy(() => import('../components/ProductsSection'));
const ClientsSection  = lazy(() => import('../components/ClientsSection'));
const ContactSection  = lazy(() => import('../components/ContactSection'));
const CTASection      = lazy(() => import('../components/CTASection'));

export default function Home() {
  const { t } = useTranslation('home');
  const title = t('seo.title', { defaultValue: 'Home | Abdulhaq Dimensions' });
  const description = t('seo.description', { defaultValue: 'Premium interior & shading solutions in Amman, Jordan.' });

  const keywords = [
    'Abdulhaq Dimensions', 'interior solutions', 'shading', 'curtains', 'blinds', 'Amman', 'Jordan', 'Somfy', 'wallpaper', 'flooring', 'commercial', 'residential', 'motorization', 'premium', 'design', 'upholstery'
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Abdulhaq Dimensions',
    'url': 'https://abdulhaqdimensions.com',
    'logo': '/images/logo.png',
    'description': description,
    'areaServed': ['Jordan','KSA','UAE','Qatar','Kuwait'],
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Amman',
      'addressCountry': 'JO'
    },
    'contactPoint': [{
      '@type': 'ContactPoint',
      'telephone': '+962 7 7805 0005',
      'contactType': 'customer service',
      'email': 'info@abdulhaqdimensions.com'
    }]
  };
  return (
    <Layout title={title} description={description} keywords={keywords} jsonLd={jsonLd}>
      <Suspense fallback={
        <div className="p-16 sm:p-24 text-center text-sm text-adh-text-muted" role="status" aria-live="polite">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-adh-stroke animate-spin" style={{ borderTopColor: 'var(--brand, #0D3B4C)' }} />
          <span className="sr-only">Loading sections…</span>
        </div>
      }>
        <HeroSection />
        <Reveal delay={0.05}><StatsSection /></Reveal>
        <Reveal delay={0.1}><AboutSection /></Reveal>
        <Reveal delay={0.15}><WhyChooseSection /></Reveal>
        <Reveal delay={0.2}><ServicesSection /></Reveal>
        <Reveal delay={0.25}><ProductsSection /></Reveal>
        <Reveal delay={0.3}><ClientsSection /></Reveal>
        <Reveal delay={0.35}><ContactSection /></Reveal>
        <Reveal delay={0.4}><CTASection /></Reveal>
      </Suspense>
    </Layout>
  );
}
