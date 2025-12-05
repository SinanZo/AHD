// Central runtime config helpers
// Reads VITE_* variables from import.meta.env (Vite) or process.env (SSR/tests)

const getEnvVar = (key: string): string | undefined => {
  // prefer process.env when available (SSR / test runner)
  try {
    if (typeof process !== "undefined" && (process.env as any)[key]) {
      return (process.env as any)[key];
    }
  } catch (_) {}

  // fallback to import.meta.env when available (Vite client)
  try {
    // @ts-ignore - import.meta may not be typed in some editors until env.d.ts is present
    const im = (import.meta as any).env;
    if (im && im[key]) return im[key];
  } catch (_) {}

  // last-resort: globalThis
  try {
    const g = (globalThis as any) || {};
    if (g && g[key]) return g[key];
  } catch (_) {}

  return undefined;
};

// APP_BASE: Base URL (no trailing slash). Fallback to window origin on the client.
export const APP_BASE: string =
  (getEnvVar("VITE_APP_BASE_URL") as string | undefined)?.replace(/\/$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "");

// Absolute URL helper (safe join). Returns an absolute URL string when APP_BASE is set,
// otherwise returns the path as-is. It ensures no double slashes and keeps query/fragment.
export const absUrl = (path = ""): string =>
  APP_BASE ? new URL(path.replace(/^\//, ""), APP_BASE + "/").toString() : path;

// API base URL (no trailing slash). When empty, code can use relative paths
// which enables Vite dev proxy to /api. For production, set VITE_API_BASE_URL
// e.g. https://ahd-api.onrender.com
export const API_BASE: string =
  (getEnvVar("VITE_API_BASE_URL") as string | undefined)?.replace(/\/\/$/, "") || "";

// Build absolute API URL or return the path as-is if API_BASE is empty.
export const apiUrl = (path = ""): string =>
  API_BASE ? new URL(path.replace(/^\//, ""), API_BASE + "/").toString() : path;

// Phone — accept + or digits; coerce to E.164 (+XXXXXXXX)
const RAW_PHONE = ((getEnvVar("VITE_CONTACT_PHONE") as string | undefined) || "").trim();
const DIGITS_PLUS = RAW_PHONE.replace(/[^+0-9]/g, "");

// E.164 normalized phone (e.g. +123456789)
export const CONTACT_PHONE_E164 =
  DIGITS_PLUS ? (DIGITS_PLUS.startsWith("+") ? DIGITS_PLUS : `+${DIGITS_PLUS}`) : "";

// Keep raw around if you want to show it as typed
export const CONTACT_PHONE_RAW = RAW_PHONE || CONTACT_PHONE_E164 || "";

// tel: URL — undefined if no phone configured (lets you conditionally render CTAs)
export const TEL_URL: string | undefined = CONTACT_PHONE_E164 ? `tel:${CONTACT_PHONE_E164}` : undefined;

// WhatsApp URL builder — undefined if no phone configured
export const WA_URL = (message?: string): string | undefined => {
  if (!CONTACT_PHONE_E164) return undefined;
  const base = CONTACT_PHONE_E164.replace(/^\+/, "");
  return message
    ? `https://wa.me/${base}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${base}`;
};

// Example usage in components/tests:
// import { APP_BASE, absUrl, TEL_URL, WA_URL } from '@/config';
// vi.stubEnv('VITE_APP_BASE_URL', 'https://example.com');
// vi.stubEnv('VITE_CONTACT_PHONE', '+962778050005');
