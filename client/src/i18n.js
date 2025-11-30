import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEN      from './i18n/locales/en/common.json';
import headerEN      from './i18n/locales/en/header.json';
import heroEN        from './i18n/locales/en/hero.json';
import homeEN        from './i18n/locales/en/home.json';
import statsEN       from './i18n/locales/en/stats.json';
import aboutEN       from './i18n/locales/en/about.json';
import servicesEN    from './i18n/locales/en/services.json';
import productsEN    from './i18n/locales/en/products.json';
import clientsEN     from './i18n/locales/en/clients.json';
import ctaEN         from './i18n/locales/en/cta.json';
import contactEN     from './i18n/locales/en/contact.json';
import footerEN      from './i18n/locales/en/footer.json';

import commonAR      from './i18n/locales/ar/common.json';
import headerAR      from './i18n/locales/ar/header.json';
import heroAR        from './i18n/locales/ar/hero.json';
import homeAR        from './i18n/locales/ar/home.json';
import statsAR       from './i18n/locales/ar/stats.json';
import aboutAR       from './i18n/locales/ar/about.json';
import servicesAR    from './i18n/locales/ar/services.json';
import productsAR    from './i18n/locales/ar/products.json';
import clientsAR     from './i18n/locales/ar/clients.json';
import ctaAR         from './i18n/locales/ar/cta.json';
import contactAR     from './i18n/locales/ar/contact.json';
import footerAR      from './i18n/locales/ar/footer.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common:    commonEN,
        header:    headerEN,
        hero:      heroEN,
        home:      homeEN,
        stats:     statsEN,
        about:     aboutEN,
        services:  servicesEN,
        products:  productsEN,
        clients:   clientsEN,
        cta:       ctaEN,
        contact:   contactEN,
        footer:    footerEN,
      },
      ar: {
        common:    commonAR,
        header:    headerAR,
        hero:      heroAR,
        home:      homeAR,
        stats:     statsAR,
        about:     aboutAR,
        services:  servicesAR,
        products:  productsAR,
        clients:   clientsAR,
        cta:       ctaAR,
        contact:   contactAR,
        footer:    footerAR,
      }
    },
    fallbackLng: 'en',
    ns: [
  'common','header','home','hero','stats','about','services',
  'products','clients','cta','contact','footer'
    ],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage','navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
