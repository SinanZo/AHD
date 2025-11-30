import React, { useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sun,
  Moon,
  MessageCircle,
} from "lucide-react";
import { Link } from "wouter";

/** WhatsApp helper (edit number/message if needed) */
const waLink = (msg = "Hello, I’d like to get a quote from Abdulhaq Dimensions") =>
  `https://wa.me/962778050005?text=${encodeURIComponent(msg)}`;

/* --------------------------
   Dark mode toggle (localStorage)
--------------------------- */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}

/* --------------------------
   Language toggle (i18next)
--------------------------- */
function useLang() {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const code = i18n.resolvedLanguage || i18n.language || "en";
  const toggle = async () => {
    const next = code && code.startsWith("ar") ? "en" : "ar";
    await i18n.changeLanguage(next);
    document.dir = i18n.dir(next);
  };
  return { isRTL, code, toggle };
}

export default function Header({ currentPage = "home", onNavigate }) {
  const { t } = useTranslation();
  const { theme, toggle: toggleTheme } = useTheme();
  const { isRTL, code, toggle: toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const nav = useMemo(
    () => [
      { key: "home", label: t("nav.home", "Home"), to: "/" },
      { key: "about", label: t("nav.about", "About"), to: "/about" },
      { key: "products", label: t("nav.products", "Products"), to: "/products" },
      { key: "clients", label: t("nav.clients", "Our Clients"), to: "/clients" },
      { key: "contact", label: t("nav.contact", "Contact"), to: "/#contact" },
    ],
    [t]
  );

  const handleGo = (k) => {
    onNavigate?.(k);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-[#08131a]/70 bg-white text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10">
      {/* Top info bar */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between text-[13px] py-2 text-gray-700 dark:text-white/80">
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 opacity-80" />
                <a
                  href="https://maps.app.goo.gl/7qS83m3mQy2oJgBv9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Amman, Jordan
                </a>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4 opacity-80" />
                <span>Sat–Wed: 10AM–7PM · Thu: 9AM–5PM</span>
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a href="tel:+962778050005" className="inline-flex items-center gap-2 hover:underline">
                <Phone className="w-4 h-4 opacity-80" />
                <span>+962 7 7805 0005</span>
              </a>
              <a href="mailto:info@abdulhaqdimensions.com" className="inline-flex items-center gap-2 hover:underline">
                <Mail className="w-4 h-4 opacity-80" />
                <span>info@abdulhaqdimensions.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Abdulhaq Dimensions">
            <img
              src="/images/logo.png"
              alt="Abdulhaq Dimensions — Since 1948"
              className="h-9 w-auto will-change-transform transition-transform duration-200 group-hover:scale-[1.02]"
              loading="eager"
              decoding="async"
              style={{ filter: "drop-shadow(0 1px 8px rgba(0,0,0,.25))" }}
            />
          </Link>

          {/* Center pill nav (desktop) */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center rounded-full ring-1 ring-gray-300 dark:ring-white/10 bg-gray-100 dark:bg-white/5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] p-1"
          >
            {nav.map((item) => {
              const active = currentPage === item.key;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={[
                    "px-4 h-10 rounded-full text-sm font-semibold transition",
                    active ? "bg-[var(--brand)] shadow text-white" : "bg-gray-100 hover:bg-gray-200",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language segmented control */}
            <div
              role="tablist"
              aria-label="Language"
              className="flex items-center rounded-full bg-gray-100 dark:bg-white/10 ring-1 ring-gray-300 dark:ring-white/10 p-1"
            >
              {[{ code: "en", label: "EN" }, { code: "ar", label: "عربي" }].map((opt) => {
                const active = (code && code.startsWith("ar") ? "ar" : "en") === opt.code;
                return (
                  <button
                    key={opt.code}
                    role="tab"
                    aria-selected={active}
                    onClick={async () => {
                      if (active) return;
                      await toggleLang();
                    }}
                    className={[
                      "px-4 h-10 rounded-full text-sm font-semibold transition",
                      active ? "bg-[var(--brand)] shadow text-white" : "bg-gray-100 hover:bg-gray-200",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full dark:bg-white dark:text-[var(--brand)] bg-[var(--brand)] text-white font-semibold hover:bg-gray-100 dark:hover:bg-[#e8eef1] shadow"
            >
              <MessageCircle className="w-4 h-4" />
              {t("cta.getQuote", "Get Quote")}
            </a>

            {/* Mobile burger */}
            <button
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20"
              onClick={() => setOpen(true)}
              aria-controls={menuId}
              aria-expanded={open}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby={`${menuId}-title`}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div
            id={menuId}
            className={`absolute ${isRTL ? "left-0" : "right-0"} top-0 h-full w-[88%] max-w-sm bg-white dark:bg-[#0b1620] text-gray-900 dark:text-white shadow-xl p-6 flex flex-col gap-6`}
          >
            <div className="flex items-center justify-between">
              <h2 id={`${menuId}-title`} className="text-lg font-semibold">
                Menu
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="h-10 w-10 grid place-items-center rounded-md bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {nav.map((item) => {
                const active = currentPage === item.key;
                return (
                  <Link
                    key={item.key}
                    to={item.to}
                    onClick={() => handleGo(item.key)}
                    className={[
                      "px-4 py-3 rounded-xl text-base font-medium",
                      active
                        ? "dark:bg-white dark:text-[var(--brand)] bg-[var(--brand)] text-white"
                        : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10",
                    ].join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={toggleLang}
                className="h-12 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 font-semibold"
              >
                {code && code.startsWith("ar") ? "Switch to English" : "التبديل إلى العربية"}
              </button>
              <button
                onClick={toggleTheme}
                className="h-12 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 font-semibold inline-flex items-center justify-center gap-2"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{t("theme.toggle", "Toggle Theme")}</span>
              </button>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 rounded-xl dark:bg-white dark:text-[var(--brand)] bg-[var(--brand)] text-white font-semibold grid place-items-center"
              >
                {t("cta.getQuote", "Get Quote")}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
