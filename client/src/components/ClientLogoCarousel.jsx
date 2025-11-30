// components/ClientLogoCarousel.jsx
import React from 'react';

export default function ClientLogoCarousel({ logos }) {
  return (
    <div className="flex flex-wrap gap-6 justify-center items-center">
      {logos.map((logo, i) => (
        <img
          key={i}
          src={logo.src}
          alt={logo.alt}
          className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all"
          loading="lazy"
        />
      ))}
    </div>
  );
}
