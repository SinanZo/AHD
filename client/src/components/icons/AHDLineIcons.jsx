import React from 'react';

// Luxury line icon set — 24x24 grid, outline only, stroke ~1.7, no fill, rounded corners
// Uses currentColor for monochrome; set color via CSS tokens (e.g., text-adh-primary)
const stroke = 1.8;
const cap = 'round';
const join = 'round';

export const CurtainsDraperiesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    {/* Window frame */}
    <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    {/* Curved header */}
    <path d="M6 7c2-.8 4-1.2 6-1.2s4 .4 6 1.2" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    {/* Curtain panels */}
    <path d="M7 7v10c0 2 1.2 3 2.2 3M10 7c0 2-.4 4-1 6-.6 2-1.2 4-1.2 4" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    <path d="M17 7v10c0 2-1.2 3-2.2 3M14 7c0 2 .4 4 1 6 .6 2 1.2 4 1.2 4" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
  </svg>
);

export const RollerBlindsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    {/* Window frame */}
    <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    {/* Cassette */}
    <rect x="5" y="5" width="14" height="3" rx="1.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    {/* Slats */}
    <path d="M6 10h12M6 13h12M6 16h12" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    {/* Pull cord */}
    <path d="M17 8v2" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    <circle cx="17" cy="11" r="0.9" fill="none" stroke="currentColor" strokeWidth={stroke} />
  </svg>
);

export const DesignerBlindsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    {/* Window frame */}
    <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    {/* Vertical slats */}
    <path d="M7 6v12M10 6v12M13 6v12M16 6v12" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
    {/* Subtle decorative pattern lines */}
    <path d="M6 9h12M6 15h12" stroke="currentColor" strokeWidth={1.4} strokeLinecap={cap} strokeLinejoin={join} opacity="0.7" />
  </svg>
);

export const CommercialSolutionsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    {/* Building facade */}
    <rect x="5" y="4" width="9" height="16" rx="1.8" stroke="currentColor" strokeWidth={stroke} />
    <rect x="15" y="7" width="4" height="13" rx="1.5" stroke="currentColor" strokeWidth={stroke} />
    {/* Windows */}
    <rect x="7" y="6" width="2.5" height="2.5" rx="0.6" stroke="currentColor" strokeWidth={stroke} />
    <rect x="10.5" y="6" width="2.5" height="2.5" rx="0.6" stroke="currentColor" strokeWidth={stroke} />
    <rect x="7" y="10" width="2.5" height="2.5" rx="0.6" stroke="currentColor" strokeWidth={stroke} />
    <rect x="10.5" y="10" width="2.5" height="2.5" rx="0.6" stroke="currentColor" strokeWidth={stroke} />
    <rect x="7" y="14" width="2.5" height="2.5" rx="0.6" stroke="currentColor" strokeWidth={stroke} />
    <rect x="10.5" y="14" width="2.5" height="2.5" rx="0.6" stroke="currentColor" strokeWidth={stroke} />
  </svg>
);

export const ComplementaryServicesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    {/* Four connected rounded modules */}
    <rect x="5" y="5" width="5" height="5" rx="1.4" stroke="currentColor" strokeWidth={stroke} />
    <rect x="14" y="5" width="5" height="5" rx="1.4" stroke="currentColor" strokeWidth={stroke} />
    <rect x="5" y="14" width="5" height="5" rx="1.4" stroke="currentColor" strokeWidth={stroke} />
    <rect x="14" y="14" width="5" height="5" rx="1.4" stroke="currentColor" strokeWidth={stroke} />
    {/* Connectors */}
    <path d="M10 7h4M7 10v4M17 10v4M10 17h4" stroke="currentColor" strokeWidth={stroke} strokeLinecap={cap} strokeLinejoin={join} />
  </svg>
);

export default {
  CurtainsDraperiesIcon,
  RollerBlindsIcon,
  DesignerBlindsIcon,
  CommercialSolutionsIcon,
  ComplementaryServicesIcon,
};
