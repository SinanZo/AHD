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
			<div className="hidden md:flex h-8 items-center justify-end bg-adh-bg-soft text-adh-text dark:bg-adh-surface/50 dark:text-adh-text-secondary text-xs px-4" />

			{/* Main nav container */}
			<div className="mx-auto w-[min(1200px,95%)] mt-3 mb-1 rounded-2xl bg-adh-surface/95 dark:bg-adh-surface/50 backdrop-blur border border-adh-stroke shadow-pill px-3 py-2">
				<div className="h-12 flex items-center justify-between">
					<Link href="/" className="font-bold text-adh-text dark:text-adh-text text-base sm:text-lg">{t('brand', { defaultValue: 'Abdulhaq' })}</Link>

					<nav className={`hidden md:flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`} aria-label={t('mainNav', { defaultValue: 'Main navigation' })}>
						{items.map((item) => (
						<Link
							key={item.to}
							href={item.to}
							className={window.location.pathname === item.to
								? 'px-4 py-2 rounded-full transition bg-adh-primary text-adh-btn-fg shadow'
								: 'px-4 py-2 rounded-full transition bg-adh-surface text-adh-text hover:bg-adh-soft'
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
													className="inline-flex items-center justify-center h-9 w-9 rounded-full ring-1 ring-adh-stroke bg-adh-surface text-adh-text hover:bg-adh-soft dark:bg-adh-surface/10 dark:text-adh-text dark:hover:bg-adh-surface/15 transition"
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
													className="inline-flex items-center justify-center h-9 rounded-full px-3 ring-1 ring-adh-stroke dark:ring-adh-stroke bg-adh-surface text-adh-text hover:bg-adh-soft dark:bg-adh-surface/10 dark:text-adh-text dark:hover:bg-adh-surface/15 transition"
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

