import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import covers from '../data/covers.json';

export default function AppShell({ children }) {
  const { i18n, t } = useTranslation();

  const lang = i18n?.language || 'en';
  const dir = (typeof i18n?.dir === 'function') ? i18n.dir() : (lang.startsWith('ar') ? 'rtl' : 'ltr');
  const heroLcp = Array.isArray(covers) && covers.length > 0 ? covers[0] : null;

  return (
    <>
      <Helmet
        prioritizeSeoTags
        defaultTitle="Abdulhaq Dimensions"
        titleTemplate="%s | Abdulhaq Dimensions"
        htmlAttributes={{ lang, dir }}
      >
        {heroLcp ? (
          <link rel="preload" as="image" href={heroLcp} imagesrcset={`${heroLcp}`} />
        ) : null}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#0d3b49" />
        <meta name="description" content={t('seo.defaultDescription', { defaultValue: 'Premium interior & shading solutions in Amman, Jordan.' })} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta property="og:site_name" content="Abdulhaq Dimensions" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={lang.replace('-', '_')} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {children}
    </>
  );
}
