import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Link, useLocation } from "wouter";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Menu, X, Sun, Moon, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import createTT from "../../lib/tt";
import { TEL_URL, WA_URL } from '../../config';

/** Brand colors (legacy) – replaced by CSS tokens via var(--*) but kept for fallbacks if needed */
const PRIMARY = "var(--brand)";
const SECONDARY = "var(--brand-2)";
const MUTED = "var(--muted)";

/** Routes */
const NAV_LINKS = [
  { to: "/",        i18nKey: "home" },
  { to: "/about",   i18nKey: "about" },
  { to: "/products",i18nKey: "products" },
  { to: "/clients", i18nKey: "clients" },
  { to: "/contact", i18nKey: "contact" },
];

// Nav pill classes (unified)
const navBtnBase = "relative h-10 px-5 rounded-full font-semibold text-sm transition-all duration-200";
const navBtnActive = "pill-active shadow-md ring-1";
const navBtnIdle = "pill border-[1px]";

/* ------------------- Small Controls ------------------- */

/** Dark Mode Toggle – waits for mount to avoid hydration mismatches */
function DarkModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // force-rerender tick to pick up external theme changes
  const [, setTick] = useState(0);
  useEffect(() => setMounted(true), []);
  const isDark = (mounted && (resolvedTheme === "dark" || theme === "dark")) || false;

  useEffect(() => {
    const onThemeChange = () => setTick((n) => n + 1);
    window.addEventListener("themechange", onThemeChange);
    window.addEventListener("storage", onThemeChange);
    return () => {
      window.removeEventListener("themechange", onThemeChange);
      window.removeEventListener("storage", onThemeChange);
    };
  }, []);

  if (!mounted) {
    // Reserve space to avoid layout shift
    return <div className="h-10 w-10 rounded-full border border-white/20" />;
  }

  return (
    <Motion.button
      data-toggle-theme
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative h-10 w-10 rounded-full chip backdrop-blur-md transition-all duration-300 flex items-center justify-center"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        <Motion.div
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="w-6 h-6 text-[color:var(--fg)]" />
          ) : (
            <Moon className="w-6 h-6 text-[color:var(--fg)]" />
          )}
        </Motion.div>
      </AnimatePresence>
    </Motion.button>
  );
}

/** Language Switcher – persists, sets dir/lang on <html>, toggles body.rtl */
function LanguageSwitcherPill() {
  const { i18n } = useTranslation();
  const initial =
    (typeof window !== "undefined" && localStorage.getItem("lang")) ||
    i18n.language ||
    "en";
  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    // Keep local state in sync if external change occurs
    setCurrent(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const dir = i18n.dir();
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    // optional: mark that React owns language switching to avoid DOM helper conflicts
    window.__I18N_HANDLES_LANG = true;
  }, [i18n.language, i18n]);

  const switchLang = (lang) => {
    i18n.changeLanguage(lang);
    setCurrent(lang);
    if (typeof window !== "undefined") localStorage.setItem("lang", lang);
  };

  const base = "px-3 py-1.5 text-sm rounded-full font-semibold transition-all duration-300";

  return (
    <div className="flex gap-1 rounded-full px-2 py-1" style={{ backgroundColor: 'var(--header-pill-bg)' }}>
      <Motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => switchLang("en")}
        data-set-lang="en"
          className={`${base} lang-pill ${current === "en" ? "pill-active shadow" : "text-[color:var(--header-fg)] hover:bg-[color:var(--header-pill-hover)]"}`}
        aria-label="English"
      >
        EN
      </Motion.button>

      <Motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => switchLang("ar")}
        data-set-lang="ar"
          className={`${base} lang-pill ${current === "ar" ? "pill-active shadow" : "text-[color:var(--header-fg)] hover:bg-[color:var(--header-pill-hover)]"}`}
        aria-label="العربية"
      >
        عربي
      </Motion.button>
    </div>
  );
}

/* ------------------- Main Header ------------------- */

export default function Header() {
  const { t, i18n } = useTranslation("header");
  // Bound compatibility helper using shared implementation
  const tt = createTT(t, "header");
  const isRTLLocal = i18n.dir() === "rtl";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const navigate = setLocation;

  // A11y refs
  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Map/location/phone
  // Prefer <html lang> and dir for hydration-safe language detection
  const locationText = tt("location_text", "location", { ns: "header", defaultValue: "Amman, Jordan" });
  // Prefer the verified iframe src provided by the user (keeps the same embed id & params)
  const MAP_COORDS = { lat: 31.96631808886744, lng: 35.84183506018552 };
  const phoneDisplay = "+962 77 805 0005";
  // centralized tel URL (may be undefined in some environments)
  const phoneHref = TEL_URL; // e.g. 'tel:+962778050005' or undefined

  // Scroll style
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Lock scroll when drawer open + focus first control + ESC to close
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", isMenuOpen);
    if (isMenuOpen) {
      // focus management: focus first control
      setTimeout(() => firstFocusableRef.current?.focus(), 0);
      const onEsc = (e) => e.key === "Escape" && setIsMenuOpen(false);
      window.addEventListener("keydown", onEsc, { capture: true });
      return () => window.removeEventListener("keydown", onEsc, { capture: true });
    }
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleWhatsAppQuote = () => {
    const url = WA_URL ? WA_URL() : undefined;
    if (!url) return; // no phone configured
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNavClick = (to) => {
    navigate(to);
    setIsMenuOpen(false);
  };

  // Inline nav rendering is used in JSX below (uses t('nav.*') keys)

  return (
    <>
      {/* Top Bar (raised above sticky header to keep it clickable) */}
      <Motion.div
        dir={i18n.dir()}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full relative overflow-hidden z-[75] pointer-events-auto"
        style={{ background: "var(--header-bg)", color: 'var(--header-fg)' }}
        role="banner"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        </div>

  <div className="container max-w-[1440px] mx-auto flex flex-nowrap justify-between items-center px-6 py-2 text-sm relative z-40">
          <Motion.div
            className={`flex items-center gap-6 text-[color:var(--header-fg)]/90 font-medium`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[color:var(--header-icon)]" aria-hidden="true" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Abdulhaq+Dimensions+Amman+Jordan"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-[color:var(--header-fg)]/90 hover:text-[color:var(--header-fg)] transition-colors"
                aria-label={tt("open_map_new_tab", "open_map", { defaultValue: "Open location in Google Maps" })}
                title={tt("open_map_new_tab", "open_map", { defaultValue: "Open location in Google Maps" })}
              >
                {locationText}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[color:var(--header-icon)]" />
              {phoneHref ? (
                <a href={phoneHref} className="text-[color:var(--header-fg)]/90" dir="ltr" aria-label={tt("call_phone", "call", { defaultValue: "Call us" })}>
                  {phoneDisplay}
                </a>
              ) : (
                <span className="text-[color:var(--btn-fg)]/90" dir="ltr">{phoneDisplay}</span>
              )}
            </div>
          </Motion.div>

          <Motion.div
            className={`hidden md:flex items-center gap-3 text-white/90 font-medium whitespace-nowrap ${isRTLLocal ? 'flex-row-reverse' : ''}`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.12 }}
          >
            <div className="text-xs text-white tracking-wide truncate max-w-[40ch]">
              {tt("hours_short", "hours_short", { defaultValue: "Sat–Wed: 10AM–7PM · Thu: 9AM–5PM" })}
            </div>

            {/* Top-bar toggles: mobile only (avoid desktop duplicates) */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcherPill />
              <DarkModeToggle />
            </div>
          </Motion.div>
        </div>
      </Motion.div>

      {/* Main Header */}
      <Motion.header
        className={`header sticky top-0 z-[70] transition-all duration-500 pointer-events-auto shadow-lg`}
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45 }}
        role="navigation"
        aria-label="Primary"
        style={{
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--stroke)",
          color: 'var(--header-fg)'
        }}
      >
        <div className={`container max-w-[1440px] mx-auto px-6 ${isScrolled ? "py-2" : "py-2 md:py-3"}`}>
          {/* Mobile: Simple 2-column layout */}
          <div className="md:hidden flex items-center justify-between">
            {/* Mobile: Logo only (location/phone shown in top bar) */}
            
            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <LanguageSwitcherPill />
              <DarkModeToggle />
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                id="menuBtn"
                className="p-2.5 rounded-full transition-all duration-200 chip"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label={isMenuOpen ? tt("close_menu", "close_menu", { defaultValue: "Close Menu" }) : tt("open_menu", "open_menu", { defaultValue: "Open Menu" })}
                aria-expanded={isMenuOpen}
                aria-controls="mobileMenu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <Motion.div
                    key={isMenuOpen ? "close" : "menu"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {isMenuOpen ? (
                      <X className="w-5 h-5 text-[color:var(--fg)]" />
                    ) : (
                      <Menu className="w-5 h-5 text-[color:var(--fg)]" />
                    )}
                  </Motion.div>
                </AnimatePresence>
              </Motion.button>
            </div>
          </div>

          {/* Desktop: 3-column grid layout */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: Logo */}
          <Motion.div className="justify-self-start" whileHover={{ scale: 1.02 }}>
            <Link href="/" aria-label={tt("go_home", "go_home", { defaultValue: "Go to homepage" })} className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Abdulhaq Dimensions Logo"
                className={`${isScrolled ? "h-12" : "h-16 md:h-20 lg:h-24"} w-auto object-contain drop-shadow-lg`}
                decoding="async"
                loading="eager"
                draggable={false}
              />
            </Link>
          </Motion.div>

          {/* Center: Nav */}
          <Motion.nav
            dir={isRTLLocal ? "rtl" : "ltr"}
            className="justify-self-center hidden md:flex items-center gap-2 rounded-full px-2 py-2 shadow-lg"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(10px)" }}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            role="navigation"
            aria-label={tt("main_nav", "main_nav", { defaultValue: "Main navigation" })}
          >
            {NAV_LINKS.map(({ to, i18nKey }) => {
              const isActive = to === "/" ? location === "/" : location.startsWith(to);
              const label = tt(`nav.${i18nKey}`, i18nKey);
              return (
                <Motion.div key={to} whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }}>
                  <button
                    onClick={() => handleNavClick(to)}
                      className={`${navBtnBase} ${isActive ? navBtnActive : navBtnIdle}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </button>
                </Motion.div>
              );
            })}
          </Motion.nav>

          {/* Right: actions */}
          <div className="justify-self-end flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcherPill />
              <DarkModeToggle />
            </div>
            <Motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:inline-flex px-6 py-2.5 text-sm font-semibold rounded-full shadow-sm pill-active"
              style={{ backgroundColor: 'var(--header-pill-active-bg)', color: 'var(--header-pill-active-fg)', borderColor: 'var(--header-pill-stroke)', borderStyle: 'solid', borderWidth: '1px' }}
              onClick={handleWhatsAppQuote}
              aria-label={tt("get_quote", "get_quote", { defaultValue: "Get Quote" })}
            >
              {tt("get_quote", "get_quote", { defaultValue: "Get Quote" })}
            </Motion.button>
          </div>
          {/* End Right: actions */}
          </div>
          {/* End desktop grid */}
        </div>
        {/* End container */}
      </Motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[65]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Full-screen Menu */}
            <Motion.aside
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobileMenuTitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              id="mobileMenu"
              className="fixed inset-0 z-[70] flex flex-col"
              style={{ background: 'var(--background)' }}
            >
              {/* Header */}
                <div className="flex items-center justify-between p-6">
                  <div className="text-2xl font-semibold" id="mobileMenuTitle" style={{ color: 'var(--fg)' }}>
                    {tt("menu", "menu", { defaultValue: "Menu" })}
                  </div>
                  <Motion.button
                  ref={firstFocusableRef}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full chip"
                  aria-label={t("close_menu", "Close Menu")}
                >
                  <X className="w-5 h-5 text-[color:var(--fg)]" />
                </Motion.button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-4 p-6 flex-1">
                {NAV_LINKS.map(({ to, i18nKey }, index) => {
                  const isActive =
                    to === "/" ? location === "/" : location.startsWith(to);
                  return (
                      <Motion.div
                      key={to}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <button
                        onClick={() => handleNavClick(to)}
                        className="w-full rounded-2xl px-6 py-4 text-lg font-semibold transition-all"
                        style={isActive ? { 
                          backgroundColor: 'oklch(0.65 0.15 200)', 
                          color: 'white',
                          textAlign: isRTLLocal ? 'right' : 'left'
                        } : { 
                          backgroundColor: 'var(--card)', 
                          color: 'var(--fg)',
                          textAlign: isRTLLocal ? 'right' : 'left'
                        }}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {tt(`nav.${i18nKey}`, i18nKey)}
                      </button>
                    </Motion.div>
                  );
                })}
                
                {/* Get Quote Button */}
                <Motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-auto"
                >
                  <button
                    className="w-full rounded-2xl px-6 py-4 text-lg font-semibold transition-all"
                    style={{ 
                      backgroundColor: 'oklch(0.65 0.15 200)', 
                      color: 'white',
                      textAlign: isRTLLocal ? 'right' : 'left'
                    }}
                    onClick={handleWhatsAppQuote}
                  >
                    {tt("get_quote", "get_quote", { defaultValue: "Get Quote" })}
                  </button>
                </Motion.div>
              </nav>
            </Motion.aside>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
