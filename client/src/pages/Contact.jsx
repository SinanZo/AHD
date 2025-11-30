import React from "react";
import { useTranslation } from "react-i18next";
import createTT from "../lib/tt";
import ContactForm from "../components/ContactForm"; // uses the improved form you built
import Layout from '../components/Layout';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ExternalLink } from "lucide-react";
import { TEL_URL, WA_URL } from '../config';

export default function Contact() {
  const { t, i18n } = useTranslation(["contact", "header"]);
  const tt = createTT(t, "contact");
  const dir = i18n.dir();
  const isRTL = dir === "rtl";

  // Single source of truth for phone/email/address
  const phoneHuman = t("info.phone", "+962 7 7805 0005");
  const phoneHref = TEL_URL || undefined;
  const email = t("info.email", "info@abdulhaqdimensions.com");
  const address = t("info.address", "Amman, Jordan");

  // Google Maps links
  const placeQuery = encodeURIComponent("Abdulhaq Dimensions, Amman, Jordan");
  const mapHref   = `https://www.google.com/maps/search/?api=1&query=${placeQuery}`;

  // Optional: prefilled WhatsApp message (hook this to a CTA if you like)
  // (removed unused waHref/waMsg to avoid compile warnings)

  const keywords = [
    'Abdulhaq Dimensions', 'contact', 'customer service', 'Amman', 'Jordan', 'consultation', 'support', 'business inquiries', 'interior solutions'
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Abdulhaq Dimensions',
    'url': 'https://abdulhaqdimensions.com',
    'contactPoint': [{
      '@type': 'ContactPoint',
      'telephone': '+962 7 7805 0005',
      'contactType': 'customer service',
      'email': 'info@abdulhaqdimensions.com'
    }]
  };
  return (
    <Layout
      title={tt("seo.title", { defaultValue: "Contact Us | Abdulhaq Dimensions" })}
      description={tt('seo.description', { defaultValue: tt('pageDesc', { defaultValue: 'Reach out for consultations, support, or business inquiries.' }) })}
      keywords={keywords}
      jsonLd={jsonLd}
    >
      <section
        className="py-20 min-h-[70vh] bg-gradient-to-br from-[#e8e6e6] via-white to-[#e8e6e6] dark:from-[#232c32] dark:to-[#181e21]"
        dir={dir}
        lang={i18n.language}
      >
        <div className="container mx-auto px-6 lg:px-20">
          {/* Heading */}
          <div className={`text-center mb-12 ${isRTL ? "font-arabic" : ""}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#002b3a] dark:text-slate-100">
              {tt("heading", { defaultValue: "Contact Us" })}
            </h1>
            <p className="text-lg text-[#5b7d89] dark:text-slate-300 max-w-2xl mx-auto">
              {tt("pageDesc", {
                defaultValue:
                  "Reach out for consultations, support, or business inquiries. Our team will reply within 1 business day.",
              })}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Glassy Form Card (reuses your accessible ContactForm) */}
            <div className="bg-white/70 dark:bg-[#232c32]/70 rounded-3xl shadow-2xl p-10 backdrop-blur-xl border border-[#e8e6e6] dark:border-[#181e21]">
              <ContactForm />
              <div className="mt-10 space-y-4 text-sm text-gray-700 dark:text-gray-200">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#002b3a] dark:text-[#9fc0b0]" aria-hidden="true" />
                  <a
                    href={phoneHref}
                    className="contact-link font-medium"
                    aria-label={t("header:call_phone", "Call us")}
                  >
                    {phoneHuman}
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#002b3a] dark:text-[#9fc0b0]" aria-hidden="true" />
                  <a
                    href={`mailto:${email}`}
                    className="contact-link font-medium break-words"
                    aria-label={tt("send_email", { defaultValue: "Send an email" })}
                  >
                    {email}
                  </a>
                </div>

                {/* Location (now clickable) */}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#002b3a] dark:text-[#9fc0b0]" aria-hidden="true" />
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-pill"
                    title={t("header:open_map_new_tab", "Open location in Google Maps")}
                    aria-label={t("header:open_map_new_tab", "Open location in Google Maps")}
                  >
                    {address}
                    <ExternalLink className="inline-block w-4 h-4 ml-2 align-[-2px]" aria-hidden="true" />
                  </a>
                </div>

                {/* Socials */}
                <div className="pt-3">
                  <div className="font-semibold mb-2 text-[#002b3a] dark:text-slate-100">
                    {tt("social.followUs", { defaultValue: "Follow Us" })}:
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.facebook.com/AbdulhaqDimensions"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-6 h-6 text-[#5b7d89] hover:text-[#002b3a] transition" />
                    </a>
                    <a
                      href="https://instagram.com/abdulhaqdimensions?igshid=YmMyMTA2M2Y="
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-6 h-6 text-[#5b7d89] hover:text-[#002b3a] transition" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/abdulhaq-dimensions"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-6 h-6 text-[#5b7d89] hover:text-[#002b3a] transition" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card with action bar */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-[#e8e6e6] dark:border-[#181e21]">
              <div className={`absolute ${isRTL ? "left-4" : "right-4"} top-4 z-10`}>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-pill"
                  title={t("header:open_map_new_tab", "Open location in Google Maps")}
                >
                  {t("header:open_map_modal", "View location on map")}
                  <ExternalLink className="inline-block w-4 h-4 ml-2 align-[-2px]" aria-hidden="true" />
                </a>
              </div>

              {/* Static placeholder instead of embedding Google Maps */}
              <div className="w-full h-[480px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0b2730] dark:to-[#062025] border-0">
                <div className="text-center p-6">
                  <div className="text-xl font-semibold mb-2 text-primary">{t('header:map_title', 'Our Location')}</div>
                  <div className="text-sm mb-4 text-gray-700 dark:text-white/80">{address}</div>
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 rounded-full bg-white/90 text-sm font-semibold shadow hover:scale-105 transition"
                  >
                    {t('header:open_map_new_tab', 'Open location in Google Maps')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional: Organization JSON-LD (helps local SEO) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Abdulhaq Dimensions",
          url: "https://abdulhaqdimensions.com",
          telephone: phoneHuman,
          email,
          address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
          sameAs: [
            "https://www.facebook.com/AbdulhaqDimensions",
            "https://instagram.com/abdulhaqdimensions",
            "https://www.linkedin.com/company/abdulhaq-dimensions"
          ]
        })
      }} />
    </Layout>
  );
}
