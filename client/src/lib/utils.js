import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Slugify a string for use in URLs or ids. Supports Arabic range as in original implementation.
export function slugify(input) {
  if (typeof input === 'undefined') return '';
  let s = String(input).trim().toLowerCase();
  // Strip combining marks for Latin text (so “Décor” → “decor”), but avoid
  // removing Arabic diacritics which can be part of core characters.
  if (/[A-Za-z\u00C0-\u017F]/.test(s)) {
    try {
      s = s.normalize('NFKD').replace(/\p{M}/gu, '');
    } catch {
      // Fallback: remove common Latin combining marks only
      s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    }
  }

  // Replace any whitespace chunk with a single hyphen
  s = s.replace(/\s+/g, '-');

  // Keep a-z, 0-9, hyphen, and Arabic ranges; drop everything else
  // (hyphen moved to the end of the class to avoid range ambiguity)
  s = s.replace(/[^a-z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF-]/g, '');

  // Collapse repeated hyphens and trim from ends
  s = s.replace(/-+/g, '-').replace(/^-+|-+$/g, '');

  return s;
}

export function ensureUrl(base, path = '') {
  if (!base) return undefined;
  try {
    return new URL(String(path || ''), String(base)).toString();
  } catch {
    // Fallback join if base is not a valid URL
    return `${String(base).replace(/\/+$/, '')}/${String(path || '').replace(/^\/+/, '')}`;
  }
}
