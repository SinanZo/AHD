import React from "react";
import { useTranslation } from "react-i18next";
import SectionWrapper from "../components/layouts/SectionWrapper";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";

/** Deterministic hue generator from strings (client names) */
function stringToHue(input = "") {
  let h = 0;
  const s = String(input);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}
const hsla = (h, s = 70, l = 50, a = 1) => `hsla(${h} ${s}% ${l}% / ${a})`;

export default function Clients() {
  const { t, i18n } = useTranslation("clients");
  const sectionRef = React.useRef(null);
  // Toggle to show/hide visible client names. Set to false to hide names if they are incorrect.
  const SHOW_NAMES = false;

  // Simple keydown handler on the section to provide Arrow/Home/End navigation
  React.useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const handler = (e) => {
      const list = sec.querySelector('ul[role="list"]');
      if (!list) return;
      const items = Array.from(list.querySelectorAll('a, li[role="listitem"]'));
      if (!items.length) return;

      const active = document.activeElement;
      const idx = items.indexOf(active);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = Math.min(items.length - 1, idx < 0 ? 0 : idx + 1);
        items[next].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = Math.max(0, idx > 0 ? idx - 1 : 0);
        items[prev].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1].focus();
      }
    };
    sec.addEventListener('keydown', handler);
    return () => sec.removeEventListener('keydown', handler);
  }, []);

  // Determine RTL / LTR
  const dir =
    typeof i18n.dir === "function"
      ? i18n.dir()
      : (i18n.language || "").toLowerCase().startsWith("ar")
      ? "rtl"
      : "ltr";
  const isRTL = dir === "rtl";

  // Safely read clients - try multiple approaches
  const clients = React.useMemo(() => {
    try {
      // Try the clients namespace first
      const raw = t("clients", { returnObjects: true });
      if (Array.isArray(raw) && raw.length > 0) return raw;
      
      // Fallback: hardcoded test data
      return [
        { name: "Test Client 1", logo: "/images/logo.png" },
        { name: "Test Client 2", logo: "/images/logo.png" },
      ];
    } catch (error) {
      console.error("Error loading clients:", error);
      return [
        { name: "Test Client 1", logo: "/images/logo.png" },
        { name: "Test Client 2", logo: "/images/logo.png" },
      ];
    }
  }, [t]);

  // SEO metadata
  const title = t("heading", { defaultValue: "Our Clients" });
  const description = t("subheading", { defaultValue: "Trusted by leading brands" });

  // JSON‑LD for search engines (ItemList of organizations)
  const jsonLd = React.useMemo(() => {
    if (!clients.length) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: clients.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Organization",
          name: c?.name,
          ...(c?.logo ? { logo: { "@type": "ImageObject", url: c.logo } } : {}),
          ...(c?.url ? { url: c.url } : {}),
        },
      })),
    };
  }, [clients]);

  // Fallback image generator (colored gradient with company name)
  // Ensure a base64 encoder that works both in browser and Node (tests/SSR)
  const safeBase64 = (str) => {
    try {
      if (typeof globalThis !== 'undefined' && typeof globalThis.btoa === 'function') {
        return globalThis.btoa(str);
      }
    } catch {
      // fallthrough to Buffer
    }
    try {
      // eslint-disable-next-line no-undef
      return Buffer.from(str, 'utf8').toString('base64');
    } catch {
      // last resort: encodeURIComponent
      return encodeURIComponent(str);
    }
  };

  // Normalize logo paths: keep absolute URLs/data URIs, ensure leading slash for local paths
  const normalizeLogo = (raw) => {
    const s = String(raw || '').trim();
    if (!s) return '/images/logo.png';
    if (s.startsWith('data:') || s.startsWith('http:') || s.startsWith('https:') || s.startsWith('/')) return s;
    // remove any leading ./ or ../ then prefix with /
    return '/' + s.replace(/^\.\/?|^\/+/, '');
  };

  const fallbackDataUri = (name, hue) => {
    const safe = String(name || '').slice(0, 40);
    const svg = `
      <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="${hsla(hue, 70, 55, 0.9)}"/>
            <stop offset="1" stop-color="${hsla((hue + 40) % 360, 70, 45, 0.9)}"/>
          </linearGradient>
        </defs>
        <rect width="200" height="100" fill="url(#g)"/>
        <rect x="2" y="2" width="196" height="96" rx="10" fill="rgba(255,255,255,0.85)"/>
        <text x="100" y="55" text-anchor="middle" fill="${hsla(hue, 70, 30, 1)}"
          font-size="16" font-family="Arial" font-weight="700">
          ${safe}
        </text>
      </svg>
    `.trim();
    return `data:image/svg+xml;base64,${safeBase64(svg)}`;
  };

  const keywords = [
    'Abdulhaq Dimensions', 'clients', 'portfolio', 'trusted', 'Amman', 'Jordan', 'commercial', 'residential', 'interior solutions', 'partners'
  ];
  return (
    <Layout title={title} description={description} jsonLd={jsonLd} keywords={keywords}>
      <SectionWrapper
        id="clients"
        bg="gradient"
        glass
        container="xl"
        animate={false} // disable entrance animation which can hide content briefly on small screens
        className="!py-20"
      >
  <Reveal>
  <section aria-labelledby="clients-heading" dir={dir} ref={sectionRef}>
          <div className="text-center mb-14">
            <h1
              id="clients-heading"
              className="text-4xl md:text-5xl font-bold mb-4 text-adh-text drop-shadow"
            >
              {title}
            </h1>
            <p
              className="text-lg text-adh-text-secondary mb-10 max-w-2xl mx-auto"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {description}
            </p>
          </div>

          {/* Show a placeholder when no clients defined */}
          {clients.length === 0 ? (
            <p className="text-center text-adh-text-secondary">
              {t("empty", {
                defaultValue: isRTL
                  ? "قريبًا — شركاؤنا وعملاؤنا"
                  : "Our clients list is coming soon.",
              })}
            </p>
          ) : (
            <ul
              role="list"
              className="
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                gap-4 md:gap-6 px-2
              "
              aria-describedby="clients-note"
            >
              {clients.map(({ logo, name, url }, index) => {
                const hue = stringToHue(name || index);
                const hue2 = (hue + 40) % 360;

                // Soft tint behind each logo (subtle and responsive)
                const focusRing = `0 0 0 3px ${hsla(hue, 85, 50, 0.45)}`;

                const alt = t("logoAlt", { name, defaultValue: `${name} logo` });

                const card = (
                  <div
                    className="
                      group relative flex items-center justify-center
                      bg-adh-surface rounded-2xl p-4 md:p-6
                      min-h-[120px] md:min-h-[140px] transition will-change-transform
                      hover:shadow-2xl hover:scale-[1.02]
                      border border-adh-stroke
                    "
                    style={{
                      background: `linear-gradient(135deg, ${hsla(hue, 70, 55, 0.1)}, ${hsla(hue2, 70, 45, 0.1)})`,
                    }}
                  >
                    <div className="text-center">
                      <img
                        src={normalizeLogo(logo)}
                        alt={alt}
                        width={80}
                        height={40}
                        className="
                          object-contain max-h-12 md:max-h-16
                          w-full mx-auto transition-transform duration-300
                          group-hover:scale-[1.05]
                        "
                        style={{
                          filter: "saturate(1.08) contrast(1.04)",
                          maxWidth: 120,
                        }}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = fallbackDataUri(name, hue);
                        }}
                        title={name}
                      />
                      {/* Always keep name for screen readers; only render visible name when SHOW_NAMES is true */}
                      <span className="sr-only">{name}</span>
                      {SHOW_NAMES && (
                        <p className="text-xs md:text-sm text-adh-text-secondary mt-2 truncate">
                          {name}
                        </p>
                      )}
                    </div>
                  </div>
                );

                return (
                  <li
                    key={`${name}-${index}`}
                    role="listitem"
                    tabIndex={url ? undefined : 0}
                    onFocus={url ? undefined : (e) => { e.currentTarget.style.boxShadow = focusRing; }}
                    onBlur={url ? undefined : (e) => { e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("visitClient", {
                          name,
                          defaultValue: `Visit ${name}`,
                        })}
                        className="block rounded-2xl focus:outline-none"
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = focusRing;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {card}
                      </a>
                    ) : (
                      // Non-interactive if no URL
                      card
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <p id="clients-note" className="sr-only">
            {t("srNote", {
              defaultValue:
                "Grid of client logos. Some items link to external client sites and open in a new tab.",
            })}
          </p>
    </section>
  </Reveal>
      </SectionWrapper>
    </Layout>
  );
}
