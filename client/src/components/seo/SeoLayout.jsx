import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

// Keep using your per-route helper if you like; this component also works standalone.
import SeoPerRoute from './SeoPerRoute';

const FALLBACK_OG_IMAGE = '/images/hero-bg.jpg';
const SITE_NAME = 'Abdulhaq Dimensions';

function toAbsoluteUrl(pathOrUrl, base) {
  try {
    // Already absolute?
    return new URL(pathOrUrl, base).toString();
  } catch (err) {
    void err;
    return pathOrUrl; // best effort
  }
}

export default function SeoLayout({
  title,
  description,
  image,
  jsonLd,
  keywords,
  children,
  robots,                // optional override e.g. "noindex, nofollow"
  canonical,             // optional absolute/relative canonical
  locale,                // e.g. "en_US" or "ar_JO"
}) {
  const { absOgImage, absCanonical, effectiveRobots } = useMemo(() => {
    const base =
      (import.meta?.env?.VITE_APP_BASE_URL && String(import.meta.env.VITE_APP_BASE_URL)) ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://abdulhaqdimensions.com');

    const og = toAbsoluteUrl(image || FALLBACK_OG_IMAGE, base);

    // Prefer explicit canonical prop; otherwise current path if in browser.
    const can =
      canonical
        ? toAbsoluteUrl(canonical, base)
        : (typeof window !== 'undefined'
            ? toAbsoluteUrl(window.location.pathname + window.location.search, base)
            : undefined);

    // Default robots; you can flip this for preview deployments
    const rb =
      robots ??
      (import.meta?.env?.MODE === 'production' ? 'index, follow, max-snippet:-1, max-image-preview:large' : 'noindex, nofollow');

    return { absOgImage: og, absCanonical: can, effectiveRobots: rb };
  }, [image, canonical, robots]);

  // JSON-LD: allow object or array; stringify safely
  const jsonLdString =
    jsonLd
      ? JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])
      : null;

  return (
    <>
      {/* Your existing per-route meta (kept for i18n keys, etc.) */}
      <SeoPerRoute
        title={title}
        description={description}
        image={absOgImage}
        jsonLd={jsonLd}
        keywords={keywords}
      />

      {/* Core/guard rails: canonical, robots, OG/Twitter fallbacks */}
      <Helmet prioritizeSeoTags>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        {Array.isArray(keywords) && keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}

        {absCanonical && <link rel="canonical" href={absCanonical} />}

        {/* Robots */}
        <meta name="robots" content={effectiveRobots} />
        <meta name="googlebot" content={effectiveRobots} />

        {/* Open Graph */}
        {title && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        {absCanonical && <meta property="og:url" content={absCanonical} />}
        <meta property="og:image" content={absOgImage} />
        {locale && <meta property="og:locale" content={locale} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        {title && <meta name="twitter:title" content={title} />}
        {description && <meta name="twitter:description" content={description} />}
        <meta name="twitter:image" content={absOgImage} />

        {/* Structured data */}
        {jsonLdString && (
          <script type="application/ld+json">{jsonLdString}</script>
        )}
      </Helmet>

      {children}
    </>
  );
}
