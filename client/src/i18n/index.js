import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Basic i18n setup: load JSON files from /locales/<lng>/<ns>.json
i18n
	.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		debug: false,
		ns: [
			'hero',
			'header',
			'common',
			'features',
			'footer',
			'contact',
			'cta',
			'products',
			'clients',
			'stats'
		],
		defaultNS: 'hero',
		backend: {
			loadPath: '/locales/{{lng}}/{{ns}}.json',
		},
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ['localStorage', 'navigator', 'htmlTag'],
			caches: ['localStorage'],
		},
	});

export default i18n;
