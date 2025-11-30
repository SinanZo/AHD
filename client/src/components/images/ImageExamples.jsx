import React from 'react';
import OptimizedImage from './OptimizedImage';
import ResponsiveImage from './ResponsiveImage';

export default function ImageExamples() {
  return (
    <div style={{display:'grid', gap:'2rem', padding:'2rem'}}>
      <section>
        <h3>OptimizedImage (hero)</h3>
        <OptimizedImage src="/images/bg2.jpg" alt="Example Hero" width={1200} height={800} eager />
      </section>
      <section>
        <h3>ResponsiveImage (three breakpoints)</h3>
        <ResponsiveImage
          alt="Curtain sample"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 70vw, 50vw"
          srcSet={{
            small: { width: 640, src: '/images/products/architecture/accessories/1.jpg' },
            medium: { width: 1024, src: '/images/products/architecture/accessories/2.jpg' },
            large: { width: 1600, src: '/images/products/architecture/accessories/3.png' }
          }}
        />
      </section>
    </div>
  );
}
