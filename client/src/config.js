// Centralized runtime config helpers
export const APP_BASE = import.meta.env.VITE_APP_BASE_URL?.replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : '');

export const CONTACT_PHONE_RAW = import.meta.env.VITE_CONTACT_PHONE || '';
export const CONTACT_PHONE_E164 = String(CONTACT_PHONE_RAW).replace(/[^\d+]/g, '');
export const CONTACT_PHONE_WA = CONTACT_PHONE_E164.replace(/^\+/, '');
export const TEL_URL = `tel:${CONTACT_PHONE_E164}`;
export const WA_URL = (msg = '') => `https://wa.me/${CONTACT_PHONE_WA}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

// Floating CTA visibility config: comma-separated list of routes to hide on (exact or prefix)
// Example: "+/contact,/clients"
const RAW_CTA_HIDE = import.meta.env.VITE_CTA_HIDE_ROUTES || '';
export const CTA_HIDE_ROUTES = RAW_CTA_HIDE.split(',').map(s => s.trim()).filter(Boolean);
