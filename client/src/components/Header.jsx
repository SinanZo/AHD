import React from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import useThemeAndLang from '../hooks/useThemeAndLang';

export default function Header() {
		const { t } = useTranslation(['header']);
		const { isDark, toggleTheme, lang, setLanguage, isRTL } = useThemeAndLang();

	const navItems = [
		{ to: '/', label: t('home', { defaultValue: 'Home' }) },
		{ to: '/products', label: t('products', { defaultValue: 'Products' }) },
		{ to: '/clients', label: t('clients', { defaultValue: 'Clients' }) },
		{ to: '/contact', label: t('contact', { defaultValue: 'Contact' }) },
	];

	const items = isRTL ? [...navItems].reverse() : navItems;

	return (
		<header className="sticky top-0 z-50">
			{/* Top utility bar */}
			<div className="hidden md:flex h-8 items-center justify-end bg-surface-soft text-text-onLight dark:bg-black/50 dark:text-white/80 text-xs px-4" />

			{/* Main nav container */}
			<div className="mx-auto w-[min(1200px,95%)] mt-3 mb-1 rounded-2xl bg-white/95 dark:bg-black/50 backdrop-blur border border-black/5 dark:border-white/10 shadow-pill px-3 py-2">
				<div className="h-12 flex items-center justify-between">
					<Link href="/" className="font-bold text-text-onLight dark:text-white text-base sm:text-lg">{t('brand', { defaultValue: 'Abdulhaq' })}</Link>

					<nav className={`hidden md:flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`} aria-label={t('mainNav', { defaultValue: 'Main navigation' })}>
						{items.map((item) => (
						<Link
							key={item.to}
							href={item.to}
							className={window.location.pathname === item.to
								? 'px-4 py-2 rounded-full transition bg-brand-900 text-white shadow'
								: 'px-4 py-2 rounded-full transition bg-white text-text-onLight hover:bg-surface-soft'
							}
						>
							{item.label}
						</Link>
						))}
					</nav>

					<div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
						{/* Theme toggle */}
						<button
							type="button"
							onClick={toggleTheme}
							title={t('toggleTheme', { defaultValue: 'Toggle theme' })}
							aria-label={t('toggleTheme', { defaultValue: 'Toggle theme' })}
							className="inline-flex items-center justify-center h-9 w-9 rounded-full ring-1 ring-black/10 bg-white text-text-onLight hover:bg-surface-soft dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15 transition"
							data-toggle-theme
						>
							{isDark ? (
								<span aria-hidden>☀️</span>
							) : (
								<span aria-hidden>🌙</span>
							)}
						</button>

						{/* Language toggle */}
						<button
							type="button"
							onClick={() => setLanguage(lang?.startsWith('ar') ? 'en' : 'ar')}
							className="inline-flex items-center justify-center h-9 rounded-full px-3 ring-1 ring-black/10 dark:ring-white/10 bg-white text-text-onLight hover:bg-surface-soft dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15 transition"
							aria-label={t('toggleLanguage', { defaultValue: 'Toggle language' })}
							data-set-lang={lang?.startsWith('ar') ? 'en' : 'ar'}
						>
							{lang?.startsWith('ar') ? 'EN' : 'عربي'}
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}

