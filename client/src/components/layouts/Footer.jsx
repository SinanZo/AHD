import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import createTT from "../../lib/tt";
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import { TEL_URL, WA_URL } from '../../config';

function telHref(raw = "") {
  // Strip spaces/parentheses/dashes; keep leading +
  const cleaned = String(raw).replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : undefined;
}
function mailHref(raw = "") {
  const v = String(raw).trim();
  return v ? `mailto:${v}` : undefined;
}
function mapHrefFromAddress(addr = "Amman, Jordan") {
  const q = encodeURIComponent(`Abdulhaq Dimensions, ${addr}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function Footer() {
  const { t, i18n } = useTranslation(["footer", "header"]);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const tt = createTT(t, "footer");
  const dir = i18n.dir ? i18n.dir() : (i18n.language?.startsWith("ar") ? "rtl" : "ltr");
  const isRTL = dir === "rtl";
  const { pathname } = useLocation();

  // Null-safe pulls from i18n
  const services = Array.isArray(t("services", { returnObjects: true })) ? t("services", { returnObjects: true }) : [];
  const navObj = t("nav", { returnObjects: true }) || {};
  const contactInfo = t("contactInfo", { returnObjects: true }) || {};
  const socialMedia = t("socialMedia", { returnObjects: true }) || {};

  // Contact values with fallbacks
  const addressText = contactInfo.address || t("header:location_text", "Amman, Jordan");
  const phoneText = contactInfo.phone || t("info.phone", { ns: "contact", defaultValue: "+962 7 7805 0005" });
  const emailText = contactInfo.email || t("info.email", { ns: "contact", defaultValue: "info@abdulhaqdimensions.com" });

  const phoneLink = TEL_URL || telHref(phoneText);
  const emailLink = mailHref(emailText);
  const mapsLink = mapHrefFromAddress(addressText);

  return (
    <footer
      className="relative pt-16 pb-8 overflow-hidden"
      style={{
        backgroundColor: isDark ? 'hsl(210 25% 11%)' : 'hsl(210 28% 97%)',
        color: isDark ? 'hsl(210 20% 95%)' : 'hsl(210 20% 10%)'
      }}
      dir={dir}
      aria-label={tt("landmark", { defaultValue: "Website footer" })}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 left-0 w-96 h-96 rounded-full bg-white/10 opacity-10 blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-32 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none z-0" style={{ backgroundColor: isDark ? 'hsl(195 70% 55%)' : 'hsl(195 100% 17%)' }} />

  <div className="container mx-auto px-4 grid md:grid-cols-5 gap-10 relative z-10">
        {/* Logo & Tagline */}
        <div>
          <div className="mb-4">
            <img
              src="/images/logo.png"
              alt={tt("logoAlt", { defaultValue: "Abdulhaq Dimensions Logo" })}
              className="h-20 md:h-24 lg:h-32 w-auto drop-shadow-lg"
              style={isDark ? { filter: "brightness(0) invert(1)" } : undefined}
              width="256"
              height="128"
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/placeholder.svg";
              }}
            />
          </div>
          <p className="text-base font-jockey leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'hsl(210 10% 32%)' }}>{tt("tagline")}</p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-bold text-lg mb-4 tracking-wide" style={{ color: isDark ? '#ffffff' : 'hsl(210 20% 10%)' }}>{tt("headingServices")}</h4>
          <ul className="space-y-2 font-medium" style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'hsl(210 10% 32%)' }}>
            {services.map((svc, i) => (
              <li key={svc?.slug || i}>
                <Link
                  to={`/services/${svc?.slug || ""}`}
                  className={`transition-colors duration-200 ${isRTL ? "hover:pr-1" : "hover:pl-1"}`}
                  style={{ color: 'inherit' }}
                >
                  {svc?.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-4 tracking-wide" style={{ color: isDark ? '#ffffff' : 'hsl(210 20% 10%)' }}>{tt("headingLinks")}</h4>
          <ul className="space-y-2 font-medium" style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'hsl(210 10% 32%)' }}>
            {Object.entries(navObj).map(([key, label]) => {
              const to = `/${key === "home" ? "" : key}`;
              const current = pathname === to;
              return (
                <li key={key}>
                  <Link
                    to={to}
                    className={`transition-colors duration-200 ${isRTL ? "hover:pr-1" : "hover:pl-1"}`}
                    style={{ color: current ? (isDark ? '#ffffff' : 'hsl(210 20% 10%)') : 'inherit' }}
                    aria-current={current ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Contact Info (now clickable address/phone/email) */}
        <div>
          <h4 className="font-bold text-lg mb-4 tracking-wide" style={{ color: isDark ? '#ffffff' : 'hsl(210 20% 10%)' }}>{tt("headingContact")}</h4>
          <div className="space-y-3 text-base font-medium" style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'hsl(210 10% 32%)' }}>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'hsl(210 10% 32%)' }} aria-hidden="true" />
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 underline decoration-1 underline-offset-2"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.95)' : 'hsl(210 20% 10%)' }}
                title={t("header:open_map_new_tab", "Open location in Google Maps")}
              >
                {addressText}
                <ExternalLink className="inline-block w-4 h-4 ml-1 align-[-2px]" aria-hidden="true" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'hsl(210 10% 32%)' }} aria-hidden="true" />
              {phoneLink ? (
                <a href={phoneLink} className="transition-colors duration-200" style={{ color: isDark ? '#ffffff' : 'hsl(210 20% 10%)' }} dir="ltr">
                  {phoneText}
                </a>
              ) : (
                <span dir="ltr" style={{ color: isDark ? '#ffffff' : 'inherit' }}>{phoneText}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'hsl(210 10% 32%)' }} aria-hidden="true" />
              {emailLink ? (
                <a href={emailLink} className="transition-colors duration-200 break-words" style={{ color: isDark ? '#ffffff' : 'hsl(210 20% 10%)' }}>
                  {emailText}
                </a>
              ) : (
                <span className="break-words" style={{ color: isDark ? '#ffffff' : 'inherit' }}>{emailText}</span>
              )}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-bold text-lg mb-4 tracking-wide" style={{ color: isDark ? '#ffffff' : 'hsl(210 20% 10%)' }}>{socialMedia.followUs || tt("followUs", { defaultValue: "Follow Us" })}</h4>
            <div className="flex gap-4">
            <a
              href="https://www.facebook.com/AbdulhaqDimensions"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'hsl(210 10% 32%)' }}
              aria-label={socialMedia.facebook || "Facebook"}
              title="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/abdulhaqdimensions"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'hsl(210 10% 32%)' }}
              aria-label={socialMedia.instagram || "Instagram"}
              title="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            {WA_URL ? (
              <a
                href={WA_URL()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'hsl(210 10% 32%)' }}
                aria-label={socialMedia.whatsapp || "WhatsApp"}
                title="WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

  {/* Divider & Copyright */}
  <div id="footer-bottom" className="mt-12 pt-8 text-center backdrop-blur-sm" style={{ borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid hsl(210 22% 82%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-sm font-medium mb-3" style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'hsl(210 10% 32%)' }}>{tt("copyright")}</div>
          <div className="text-xs leading-relaxed" style={{ color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'hsl(210 10% 32%)' }}>
            <span className="opacity-80">Powered by </span>
            <a
              href="https://www.jawareer.info"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline decoration-1 underline-offset-2 transition-colors duration-200"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'hsl(210 10% 32%)' }}
              onClick={() => {
                try {
                  console.info("analytics:event", { category: "footer", action: "click", label: "powered-by" });
                  window.dispatchEvent(new CustomEvent("analytics", { detail: { category: "footer", action: "click", label: "powered-by" } }));
                } catch { /* noop */ }
              }}
            >
              Jawareer
            </a>
            <span className="opacity-70"> — Your Partner in IT, Marketing, and Smart Solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
