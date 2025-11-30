
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * JsonLd
 * - Injects schema.org JSON-LD.
 * - Auto-detects current language from i18next and sets availableLanguage.
 *
 * Props (all optional):
 *  - type: schema.org type (default: 'HomeAndConstructionBusiness')
 *  - singleLanguageOnly: if true, only the active language is listed in availableLanguage
 *  - overrides: object merged into the JSON-LD (deepest wins)
 *
 * Example:
 *  <JsonLd singleLanguageOnly />
 *  <JsonLd overrides={{ sameAs: [...], address: {...} }} />
 */
export default function JsonLd({
  type = "HomeAndConstructionBusiness",
  singleLanguageOnly = false,
  overrides = {},
}) {
  const { i18n } = useTranslation();

  // Map i18n language -> human-readable language name(s) for SEO
  const activeLangName = useMemo(() => {
    const allLangs = [
      { test: /^ar/i, name: "Arabic" },
      { test: /^en/i, name: "English" },
    ];
    const lang = (i18n?.resolvedLanguage || i18n?.language || "en").toLowerCase();
    const found = allLangs.find((l) => l.test.test(lang));
    return found?.name || "English";
  }, [i18n?.resolvedLanguage, i18n?.language]);

  const availableLanguage = useMemo(() => {
    if (singleLanguageOnly) return [activeLangName];
    // Otherwise include a stable set with the active one first (deduped)
    const base = [activeLangName, "English", "Arabic"];
    return Array.from(new Set(base));
  }, [activeLangName, singleLanguageOnly]);

  // Build JSON-LD payload (memoized to avoid churn)
  const data = useMemo(() => {
    const base = {
      "@context": "https://schema.org",
      "@type": type,
      name: "Abdulhaq Dimensions",
      url: "https://abdulhaqdimensions.com",
      logo: "https://abdulhaqdimensions.com/images/Logo.png",
      image: "https://abdulhaqdimensions.com/images/cover.jpg",
      description:
        "Abdulhaq Dimensions provides premium shading, curtain, and architectural design solutions across the MENA region.",
      areaServed: ["JO", "SA", "QA", "AE"],
      sameAs: ["https://www.instagram.com/abdulhaqdimensions"],
      address: {
        "@type": "PostalAddress",
        addressCountry: "JO",
        addressLocality: "Amman",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+962-7-8888-1385",
        contactType: "customer service",
        areaServed: ["JO", "SA", "QA", "AE"],
        availableLanguage,
      },
    };

    // Shallow merge is usually enough; if you need deep merge, replace with a small util
    return { ...base, ...overrides };
  }, [type, availableLanguage, overrides]);

  return (
    <script
      type="application/ld+json"
      // Avoid pretty-print to keep payload tiny
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
