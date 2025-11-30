import React from "react";
import { useTranslation } from "react-i18next";
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
      className="relative pt-16 pb-8 overflow-hidden bg-primary text-white dark:bg-[#0f1923]"
      dir={dir}
      aria-label={tt("landmark", { defaultValue: "Website footer" })}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 left-0 w-96 h-96 rounded-full bg-white/10 opacity-10 blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-32 right-0 w-96 h-96 rounded-full bg-[#5b7d89] opacity-15 blur-3xl pointer-events-none z-0" />

  <div className="container mx-auto px-4 grid md:grid-cols-5 gap-10 relative z-10">
        {/* Logo & Tagline */}
        <div>
          <div className="mb-4">
            <img
              src="/images/logo.png"
              alt={tt("logoAlt", { defaultValue: "Abdulhaq Dimensions Logo" })}
              className="h-20 md:h-24 lg:h-32 w-auto drop-shadow-lg"
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
          <p className="text-base font-jockey text-white/90 leading-relaxed">{tt("tagline")}</p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-bold text-lg mb-4 tracking-wide text-white/90">{tt("headingServices")}</h4>
          <ul className="space-y-2 text-white/80 font-medium">
            {services.map((svc, i) => (
              <li key={svc?.slug || i}>
                <Link
                  to={`/services/${svc?.slug || ""}`}
                  className={`transition-colors duration-200 hover:text-[#e8e6e6] ${isRTL ? "hover:pr-1" : "hover:pl-1"}`}
                >
                  {svc?.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-4 tracking-wide text-white/90">{tt("headingLinks")}</h4>
          <ul className="space-y-2 text-white/80 font-medium">
            {Object.entries(navObj).map(([key, label]) => {
              const to = `/${key === "home" ? "" : key}`;
              const current = pathname === to;
              return (
                <li key={key}>
                  <Link
                    to={to}
                    className={`transition-colors duration-200 hover:text-[#e8e6e6] ${isRTL ? "hover:pr-1" : "hover:pl-1"} ${current ? "text-white" : ""}`}
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
          <h4 className="font-bold text-lg mb-4 tracking-wide text-white/90">{tt("headingContact")}</h4>
          <div className="space-y-3 text-white/85 text-base font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e8e6e6]" aria-hidden="true" />
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e8e6e6] transition-colors duration-200 underline decoration-1 underline-offset-2"
                title={t("header:open_map_new_tab", "Open location in Google Maps")}
              >
                {addressText}
                <ExternalLink className="inline-block w-4 h-4 ml-1 align-[-2px]" aria-hidden="true" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#e8e6e6]" aria-hidden="true" />
              {phoneLink ? (
                <a href={phoneLink} className="hover:text-[#e8e6e6] transition-colors duration-200" dir="ltr">
                  {phoneText}
                </a>
              ) : (
                <span dir="ltr">{phoneText}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#e8e6e6]" aria-hidden="true" />
              {emailLink ? (
                <a href={emailLink} className="hover:text-[#e8e6e6] transition-colors duration-200 break-words">
                  {emailText}
                </a>
              ) : (
                <span className="break-words">{emailText}</span>
              )}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-bold text-lg mb-4 tracking-wide text-white/90">{socialMedia.followUs || tt("followUs", { defaultValue: "Follow Us" })}</h4>
            <div className="flex gap-4">
            <a
              href="https://www.facebook.com/AbdulhaqDimensions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#e8e6e6] transition-colors duration-200"
              aria-label={socialMedia.facebook || "Facebook"}
              title="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/abdulhaqdimensions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#e8e6e6] transition-colors duration-200"
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
                className="text-white/80 hover:text-[#e8e6e6] transition-colors duration-200"
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
  <div id="footer-bottom" className="border-t border-white/20 mt-12 pt-8 text-center backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-white/80 font-medium mb-3">{tt("copyright")}</div>
          <div className="text-xs text-white/60 leading-relaxed">
            <span className="opacity-80">Powered by </span>
            <a
              href="https://www.jawareer.info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors duration-200 font-medium underline decoration-1 underline-offset-2"
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
