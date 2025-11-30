import React, { useEffect, useMemo, useState, useCallback } from "react";
import i18n from "../i18n";
import { applyLangAttrs, applyThemeAttrs } from "../utils/persist-theme-lang";
import { ThemeLangContext } from "../hooks/useThemeAndLang.shared";

const THEME_KEY = "theme"; // "light" | "dark" | "system"
const LANG_KEY = "lang";   // e.g. "en" | "ar"

function getSystemIsDark() {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  } catch {
    return false;
  }
}

function resolveIsDark(theme) {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return getSystemIsDark();
}

export function ThemeLangProvider({ children }) {
  // Initialize from storage with sane fallbacks
  const [theme, setThemeState] = useState(() => localStorage.getItem(THEME_KEY) || "system");
  const [lang, setLangState] = useState(() => localStorage.getItem(LANG_KEY) || i18n.language || "en");

  // Apply side effects on mount and whenever theme/lang changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore storage write errors (private mode / quota)
    }
    applyThemeAttrs(theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore storage write errors
    }
    // Keep i18n in sync and update <html lang|dir>
    try { i18n.changeLanguage(lang); } catch { /* i18n not ready yet */ }
    applyLangAttrs(lang);
  }, [lang]);

  // Cross-tab + external changes (next-themes, manual toggles)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === THEME_KEY && e.newValue) setThemeState(e.newValue);
      if ((e.key === LANG_KEY || e.key === "i18nextLng") && e.newValue) setLangState(e.newValue);
    };
    const onThemeChange = (e) => {
      const detail = e?.detail ?? {};
      const next = detail.stored ?? detail.theme ?? localStorage.getItem(THEME_KEY) ?? "system";
      setThemeState(next);
    };
    const onLangChange = (e) => {
      const next = e?.detail?.lang ?? localStorage.getItem(LANG_KEY) ?? i18n.language ?? "en";
      setLangState(next);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("themechange", onThemeChange);
    window.addEventListener("langchange", onLangChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("themechange", onThemeChange);
      window.removeEventListener("langchange", onLangChange);
    };
  }, []);

  const isDark = resolveIsDark(theme);
  const isRTL = /^ar\b/i.test(lang);

  const setTheme = useCallback((next) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (resolveIsDark(prev) ? "light" : "dark"));
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : prev === "dark" ? "system" : "light"));
  }, []);

  const setLanguage = useCallback((next) => {
    setLangState(next);
  }, []);

  const value = useMemo(() => ({
    theme,
    isDark,
    setTheme,
    toggleTheme,
    cycleTheme,
    lang,
    isRTL,
    setLanguage,
  }), [theme, isDark, lang, isRTL, setTheme, toggleTheme, cycleTheme, setLanguage]);

  return (
    <ThemeLangContext.Provider value={value}>{children}</ThemeLangContext.Provider>
  );
}

// Moved to separate hook file to satisfy Fast Refresh rules
