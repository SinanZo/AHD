// Canonical contact data used across the app.
// Keep this file as the single source of truth for contact links shown in
// header/footer/contact blocks. Values mirror what's in src/pages/Contact.jsx
// (but centralised so other components can import them).
import { TEL_URL, WA_URL } from '../config';

export const phoneHuman = '+962 7 7805 0005';
export const phoneHref = TEL_URL || `tel:${String(phoneHuman).replace(/[^+\d]/g, '')}`;
export const email = 'info@abdulhaqdimensions.com';
export const emailHref = `mailto:${email}`;
export const address = 'Amman, Jordan';
export const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Abdulhaq Dimensions, Amman, Jordan')}`;
export function waHref(prefill) {
  const base = WA_URL ? WA_URL() : `https://wa.me/${String(phoneHuman).replace(/[^+\d]/g, '')}`;
  if (!prefill) return base;
  try {
    const q = encodeURIComponent(prefill);
    return `${base}?text=${q}`;
  } catch {
    return base;
  }
}

export default {
  phoneHuman,
  phoneHref,
  email,
  emailHref,
  address,
  mapHref,
  waHref,
};
