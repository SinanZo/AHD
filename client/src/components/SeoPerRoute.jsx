import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';


export default function SeoPerRoute({ title, description, image, jsonLd, keywords }) {
  const { pathname, search } = useLocation();
  const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? window.location.origin
    : '';
  const url = origin + pathname + search;

  // Default business keywords for Abdulhaq Dimensions
  const defaultKeywords = [
    'Abdulhaq Dimensions',
    'interior solutions',
    'shading',
    'curtains',
    'blinds',
    'Amman',
    'Jordan',
    'Somfy',
    'wallpaper',
    'flooring',
    'commercial',
    'residential',
    'motorization',
    'premium',
    'design',
    'upholstery'
  ];
  const metaKeywords = keywords && keywords.length ? keywords.join(', ') : defaultKeywords.join(', ');

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
