import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createImageErrorHandler, checkImageExists, generateAltText, getFallbackImage } from '../utils/imageUtils';

/**
 * SmartClientLogo
 * - Prefers SVG if available.
 * - For bitmaps, renders a <picture> with AVIF/WebP sources to reduce payload.
 * - Uses centralized error handler on failure.
 * - Reserves space with CSS aspect-ratio to avoid CLS.
 */
export default function SmartClientLogo({ src, alt, url, className = '', aspectRatio = '3/1', maxHeight = '96px', width, height, brandColor = null }) {
  const [mode, setMode] = useState('unknown'); // 'svg' | 'picture' | 'img'
  const [resolved, setResolved] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    // Detect prefers-reduced-motion on the client and subscribe to changes.
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const set = () => setPrefersReducedMotion(mq.matches);
        set();
        if (mq.addEventListener) mq.addEventListener('change', set);
        else if (mq.addListener) mq.addListener(set);
        return () => {
          if (mq.removeEventListener) mq.removeEventListener('change', set);
          else if (mq.removeListener) mq.removeListener(set);
        };
      } catch {
        // ignore and keep reduced-motion as true
      }
    }
    let mounted = true;
    if (!src) {
      setMode('img');
      setResolved(getFallbackImage('client'));
      return;
    }

    const base = src.replace(/\.[^.]+$/, '');

    // Prefer SVG if present
    (async () => {
      try {
        if (await checkImageExists(`${base}.svg`)) {
          if (!mounted) return;
          setMode('svg');
          setResolved(`${base}.svg`);
          return;
        }

        // Try AVIF/WebP existence to favour picture fallbacks; if none exist, render original src
        if (await checkImageExists(`${base}.avif`) || await checkImageExists(`${base}.webp`)) {
          if (!mounted) return;
          setMode('picture');
          setResolved(base);
          return;
        }

        // fallback to original provided src
        if (!mounted) return;
        setMode('img');
        setResolved(src);
      } catch {
        if (!mounted) return;
        setMode('img');
        setResolved(src);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [src]);

  const imgProps = {
    alt: generateAltText(alt || 'Client logo', 'client'),
    loading: 'lazy',
    decoding: 'async',
    onError: createImageErrorHandler('client'),
    onLoad: () => setLoaded(true),
    draggable: false,
    style: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      maxHeight,
      aspectRatio,
    },
  };

  // Motion styles: fade+subtle translate/scale on load. Disabled when user prefers reduced motion.
  const motionStyles = prefersReducedMotion
    ? { opacity: 1, transform: 'none', transition: 'none' }
    : {
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'none' : 'translateY(6px) scale(0.995)',
        transition: 'opacity 260ms ease, transform 300ms cubic-bezier(0.2,0,0,1)',
      };

  // Merge motion styles into imgProps.style so both <img> and <picture><img> inherit them.
  imgProps.style = { ...imgProps.style, ...motionStyles };

  // Render the actual image/picture
  const content = (() => {
    if (mode === 'svg') {
      return <img src={resolved} {...imgProps} className={className} width={width} height={height} />;
    }

    if (mode === 'picture') {
      // resolved is base w/out extension
      const base = resolved;
      const widths = [320, 640, 960, 1280, 1600];
      const avifSrcSet = widths.map((w) => `${base}-${w}.avif ${w}w`).join(', ');
      const webpSrcSet = widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
      const sizes = '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 200px';

      return (
        <picture className={className}>
          <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
          <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
          <img src={`${base}.png`} srcSet={`${widths.map(w=>`${base}-${w}.png ${w}w`).join(', ')}`} sizes={sizes} {...imgProps} width={width} height={height} alt={imgProps.alt || ''} />
        </picture>
      );
    }

    // default img (mode==='img' or unknown)
    return <img src={resolved} {...imgProps} className={className} width={width} height={height} />;
  })();

  // Wrap with link if provided. Apply a subtle brand-color placeholder behind the image while it loads.
  const placeholderStyle = {};
  if (brandColor && !loaded) {
    // If brandColor is a hex like #rrggbb, make a light alpha background and a subtle darker gradient for depth.
    const hex = String(brandColor).replace('#', '').slice(0, 6);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const light = `rgba(${r}, ${g}, ${b}, 0.10)`;
    const darker = `rgba(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)}, 0.12)`;
    placeholderStyle.background = `linear-gradient(135deg, ${light}, ${darker})`;
  }

  const wrapped = (
    <div className={`w-full h-full flex items-center justify-center ${className}`} style={placeholderStyle}>
      {content}
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center" aria-label={`${alt || 'Client'} - Visit website`}>
        {wrapped}
      </a>
    );
  }

  return wrapped;
}

SmartClientLogo.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
  aspectRatio: PropTypes.string,
  maxHeight: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
