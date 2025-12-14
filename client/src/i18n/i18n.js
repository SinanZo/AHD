import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all namespaces
import headerEN from './locales/en/header.json';
import footerEN from './locales/en/footer.json';
import homeEN from './locales/en/home.json';
import contactEN from './locales/en/contact.json';
import ctaEN from './locales/en/cta.json';
import statsEN from './locales/en/stats.json';
import clientsEN from './locales/en/clients.json';
import productsEN from './locales/en/products.json';

import headerAR from './locales/ar/header.json';
import footerAR from './locales/ar/footer.json';
import homeAR from './locales/ar/home.json';
import contactAR from './locales/ar/contact.json';
import ctaAR from './locales/ar/cta.json';
import statsAR from './locales/ar/stats.json';
import clientsAR from './locales/ar/clients.json';
import productsAR from './locales/ar/products.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        header: headerEN,
        footer: footerEN,
        home: homeEN,
        contact: contactEN,
        cta: ctaEN,
        stats: statsEN,
        clients: clientsEN,
        products: productsEN
      },
      ar: {
        header: headerAR,
        footer: footerAR,
        home: homeAR,
        contact: contactAR,
        cta: ctaAR,
        stats: statsAR,
        clients: clientsAR,
        products: productsAR
      }
    },
    fallbackLng: 'en',
    ns: ['header', 'footer', 'home', 'contact', 'cta', 'stats', 'clients', 'products'],
    defaultNS: 'home',
    // Enable debug in dev to help track missing keys and loading issues
    debug: import.meta.env.DEV === true,
    missingKeyHandler: function(lng, ns, key, res) {
      try {
        // eslint-disable-next-line no-console
        console.warn(`[i18n] Missing translation key: ${lng}:${ns}:${key}`);
      } catch (e) { /* noop */ }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
