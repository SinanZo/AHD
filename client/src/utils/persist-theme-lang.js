// /src/utils/persist-theme-lang.js
// Framework-agnostic. Load before React when possible.
// Keeps <html> attrs in sync and exposes small, safe hooks.

const THEME_KEY = "theme";         // "light" | "dark" | "system"
const LANG_KEY  = "lang";          // e.g. "en" | "ar" | "ar-JO"
const I18N_KEY  = "i18nextLng";    // keep i18next storage in sync

let applyingTheme = false; // Prevent recursion in themechange listener

function effectiveDark(storedTheme) {
  if (storedTheme === "dark") return true;
  if (storedTheme === "light") return false;
  // "system" or unknown -> media query
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  } catch { return false; }
}

export function applyThemeAttrs(theme /* "light" | "dark" | "system" */) {
  if (applyingTheme) return; // Prevent recursion
  applyingTheme = true;
  try {
    const html = document.documentElement;
    const isDark = effectiveDark(theme);
    html.classList.toggle("dark", isDark);
    html.setAttribute("data-theme", isDark ? "dark" : "light");
    // Make native UI match (form controls, scrollbars)
    html.style.colorScheme = isDark ? "dark" : "light";
    // Broadcast to any listeners (React components, etc.)
    window.dispatchEvent(new CustomEvent("themechange", { detail: { stored: theme, isDark } }));
  } finally {
    applyingTheme = false;
  }
}

export function applyLangAttrs(lang /* "en" | "ar" | "ar-JO" */) {
  const html = document.documentElement;
  // Normalize: keep full tag for :lang() and AT, but decide dir by prefix
  const normalized = (lang && typeof lang === "string" ? lang : "en");
  const isAr = /^ar\b/i.test(normalized);
  html.setAttribute("lang", normalized);
  html.setAttribute("dir", isAr ? "rtl" : "ltr");
  document.body?.classList.toggle("rtl", isAr);
  // Broadcast for UI
  window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: normalized, dir: isAr ? "rtl" : "ltr" } }));
}

function restoreTheme() {
  const stored = localStorage.getItem(THEME_KEY) || "system";
  applyThemeAttrs(stored);
}

function restoreLang() {
  const stored = localStorage.getItem(LANG_KEY)
              || localStorage.getItem(I18N_KEY)
              || "en";
  // Keep both keys aligned so i18n sees it immediately
  localStorage.setItem(LANG_KEY, stored);
  localStorage.setItem(I18N_KEY, stored);
  applyLangAttrs(stored);
}

function onSystemThemeChange() {
  const stored = localStorage.getItem(THEME_KEY) || "system";
  if (stored === "system") applyThemeAttrs(stored);
}

let wired = false;
function wireToggles() {
  if (wired) return;
  wired = true;

  // THEME: [data-toggle-theme] or [data-theme-cycle] for tri-state
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest?.("[data-toggle-theme], [data-theme-cycle]");
    if (!el) return;

    const stored = localStorage.getItem(THEME_KEY) || "system";
    const cycle = el.hasAttribute("data-theme-cycle") || ev.altKey || ev.ctrlKey || ev.metaKey;

    let next;
    if (cycle) {
      // light -> dark -> system -> light ...
      next = stored === "light" ? "dark" : stored === "dark" ? "system" : "light";
    } else {
      // simple toggle between light/dark based on current effective
      next = effectiveDark(stored) ? "light" : "dark";
    }
    localStorage.setItem(THEME_KEY, next);
    applyThemeAttrs(next);
  });

  // LANG: [data-set-lang="en|ar|..."]
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest?.("[data-set-lang]");
    if (!el) return;

    const lang = el.getAttribute("data-set-lang") || "en";
    localStorage.setItem(LANG_KEY, lang);
    localStorage.setItem(I18N_KEY, lang); // keep i18n storage aligned
    applyLangAttrs(lang);

    // Optionally close static drawer menus
    const menu = document.getElementById("menu");
    if (menu && !menu.hasAttribute("hidden")) menu.setAttribute("hidden", "");
  });

  // Cross-tab sync
  window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY) {
      applyThemeAttrs(e.newValue || "system");
    } else if (e.key === LANG_KEY || e.key === I18N_KEY) {
      applyLangAttrs(e.newValue || "en");
    }
  });

  // In some setups (next-themes), the theme provider may dispatch a custom
  // event when it changes theme. Listen for that to keep attributes in sync.
  // next-themes dispatches a 'themechange' on window with detail { theme }
  // but to avoid collisions we accept both shapes and re-apply attributes.
  window.addEventListener("themechange", (e) => {
    try {
      // Prefer stored value if provided
      const payload = e?.detail ?? {};
      const stored = payload.stored ?? payload.theme ?? localStorage.getItem(THEME_KEY) ?? "system";
      applyThemeAttrs(stored);
    } catch {
      /* noop */
    }
  });

  // System theme changes (only when user chose "system")
  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    try { mq.addEventListener("change", onSystemThemeChange); }
    catch { mq.addListener(onSystemThemeChange); } // Safari
  }
}

/**
 * Initialize once.
 * We DO NOT call i18n.changeLanguage() here (no coupling).
 * Next-themes plays nicely if you set <ThemeProvider storageKey="theme" />.
 */
export function initPersistThemeLang() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  restoreTheme();
  restoreLang();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireToggles, { once: true });
  } else {
    wireToggles();
  }
}
