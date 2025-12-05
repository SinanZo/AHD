/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // class-based dark mode (controlled by .dark on <html>)
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Background colors
        "adh-bg": "var(--bg)",
        "adh-bg-soft": "var(--bg-soft)",
        "adh-bg-linen": "var(--bg-linen)",

        // Surfaces
        "adh-surface": "var(--card)",
        "adh-chip": "var(--chip)",

        // Text
        "adh-text": "var(--fg)",
        "adh-text-secondary": "var(--text-secondary)",
        "adh-text-muted": "var(--muted)",

        // Brand
        "adh-primary": "var(--brand)",
        "adh-primary-light": "var(--brand-2)",
        "adh-brand-light": "var(--brand-light)",

        // Accent
        "adh-accent": "var(--accent)",
        "adh-accent-light": "var(--accent-light)",
        "adh-accent-dark": "var(--accent-dark)",

        // UI
        "adh-stroke": "var(--stroke)",
        "adh-link": "var(--link)",
        "adh-link-hover": "var(--link-hover)",

        // Buttons
        "adh-btn": "var(--btn)",
        "adh-btn-fg": "var(--btn-fg)",

        // Header
        "adh-header-bg": "var(--header-bg-color)",
        "adh-header-fg": "var(--header-fg)",
      },
      backgroundColor: {
        "adh-bg": "var(--bg)",
        "adh-surface": "var(--card)",
        "adh-soft": "var(--bg-soft)",
        "adh-linen": "var(--bg-linen)",
        "adh-chip": "var(--chip)",
      },
      textColor: {
        "adh-text": "var(--fg)",
        "adh-secondary": "var(--text-secondary)",
        "adh-muted": "var(--muted)",
        "adh-link": "var(--link)",
      },
      borderColor: {
        "adh-stroke": "var(--stroke)",
      },
      boxShadow: {
        "adh-soft": "var(--shadow-soft)",
        "adh-card": "0 4px 12px rgba(0, 0, 0, 0.08)",
        "adh-card-hover": "0 8px 24px rgba(0, 0, 0, 0.12)",
      },
      transitionDuration: {
        theme: "300ms",
      },
      transitionProperty: {
        theme: "background-color, border-color, color, fill, stroke",
      },
    },
  },
  plugins: [],
};
