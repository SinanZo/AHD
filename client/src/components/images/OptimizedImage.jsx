import React from 'react';

/**
 * OptimizedImage - simple wrapper that serves webp/avif fallbacks via <picture>
 * Props: src (original jpg/png), alt, width, height, eager (boolean), className
 */
export default function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  eager = false,
  className = '',
  style,
  loading,
  ...rest
}) {
  // Derive base without extension
  const base = src ? src.replace(/\.(jpe?g|png)$/i, '') : '';
  const isEager = eager || loading === 'eager';
  return (
    <picture className={className} style={style}>
      {/* AVIF first */}
      <source srcSet={`${base}.avif`} type="image/avif" />
      {/* WebP fallback */}
      <source srcSet={`${base}.webp`} type="image/webp" />
      {/* Original */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={isEager ? 'eager' : 'lazy'}
        decoding={isEager ? 'sync' : 'async'}
        style={style}
        {...rest}
      />
    </picture>
  );
}
