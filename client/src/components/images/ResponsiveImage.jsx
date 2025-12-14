import React from 'react';

/**
 * ResponsiveImage - serves multiple resolutions with webp/avif sources.
 * Props:
 *  - srcSet: { small:{width,src}, medium:{width,src}, large:{width,src} }
 *  - sizes: string used by browser to pick resource
 *  - alt, className, eager
 */
export default function ResponsiveImage({
  srcSet = {},
  sizes = '100vw',
  alt = '',
  eager = false,
  className = '',
  style,
  ...rest
}) {
  // Build ordered variants
  const variants = Object.values(srcSet).filter(Boolean).sort((a,b)=>a.width - b.width);
  if (!variants.length) return <img alt={alt} className={className} style={style} loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} {...rest} />;
  const isEager = eager;

  // Build srcset strings for each format
  const buildFormatSet = (ext) => variants.map(v => `${v.src.replace(/\.(jpe?g|png)$/i,'')}.${ext} ${v.width}w`).join(', ');
  const originalSet = variants.map(v => `${v.src} ${v.width}w`).join(', ');
  const fallbackSrc = variants[variants.length - 1].src;

  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={buildFormatSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={buildFormatSet('webp')} sizes={sizes} />
      <img
        src={fallbackSrc}
        srcSet={originalSet}
        sizes={sizes}
        alt={alt}
        loading={isEager ? 'eager' : 'lazy'}
        decoding={isEager ? 'sync' : 'async'}
        style={style}
        {...rest}
      />
    </picture>
  );
}
