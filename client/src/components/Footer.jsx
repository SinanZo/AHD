import React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const SOCIAL = {
  facebook: "https://www.facebook.com/abdulhaqdimensions",
  instagram: "https://www.instagram.com/abdulhaqdimensions",
  twitter: "https://x.com/abdulhaqdimensions",
  linkedin: "https://www.linkedin.com/company/abdulhaq-dimensions",
};

const CONTACT_INFO = {
  phone: "+962 7 7805 0005",
  phoneHref: "tel:+962778050005",
  email: "info@abdulhaqdimensions.com",
  emailHref: "mailto:info@abdulhaqdimensions.com",
  address: "Amman, Jordan",
  mapHref: "https://www.google.com/maps/search/?api=1&query=Abdulhaq+Dimensions,+Amman,+Jordan",
};

export default function Footer() {
  const { i18n } = useTranslation("footer");
  const dir = typeof i18n?.dir === "function" ? i18n.dir() : "ltr";
  const isRTL = dir === "rtl";
  const year = new Date().getFullYear();

  // Hardcoded navigation links
  const quickLinks = [
    { to: "/", label: isRTL ? "الرئيسية" : "Home" },
    { to: "/about", label: isRTL ? "عن الشركة" : "About" },
    { to: "/products", label: isRTL ? "المنتجات" : "Products" },
    { to: "/contact", label: isRTL ? "اتصل بنا" : "Contact Us" },
  ];

  // Hardcoded services
  const services = isRTL ? [
    "الستائر والمعلقات",
    "الستائر الدوارة والمظللات",
    "الستائر الفنية المتخصصة",
    "الحلول التجارية",
  ] : [
    "Curtains & Draperies",
    "Roller Blinds & Shades",
    "Specialized Designer Blinds",
    "Commercial Solutions",
  ];

  // Hardcoded footer sections
  const footerAbout = isRTL 
    ? "الشركة الرائدة في توفير الستائر والمعلقات والحلول الداخلية الفاخرة منذ عام 1948. نحن نلتزم بالجودة والابتكار في كل منتج."
    : "Leading provider of premium curtains, blinds, and interior solutions since 1948. We are committed to quality and innovation in every product.";

  const footerResources = isRTL ? [
    { label: "سياسة الخصوصية", href: "/privacy" },
    { label: "شروط الخدمة", href: "/terms" },
    { label: "الأسئلة الشائعة", href: "/faq" },
  ] : [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <footer
      className="relative bg-adh-bg text-adh-text overflow-hidden"
      dir={dir}
      role="contentinfo"
      aria-label={isRTL ? "تذييل الصفحة" : "Footer"}
    >
      <div className="absolute inset-0 bg-linear-to-b from-adh-bg via-adh-bg-soft/40 to-adh-bg" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-adh-brand/10 blur-[180px]" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-adh-accent/10 blur-[200px]" aria-hidden="true" />

      <div className="relative container mx-auto px-4 md:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)] gap-10">
          {/* Brand / About */}
          <div className="space-y-6 lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
            <RouterLink to="/" aria-label={isRTL ? "اذهب إلى الصفحة الرئيسية" : "Go to homepage"} className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-adh-brand flex items-center justify-center text-white font-bold text-lg">
                AD
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-adh-text-secondary">{isRTL ? "حلول داخلية" : "Interior Atelier"}</p>
                <span className="font-serif text-2xl text-adh-text">Abdulhaq Dimensions</span>
              </div>
            </RouterLink>
            <p className="text-adh-text-secondary text-sm leading-relaxed">
              {footerAbout}
            </p>

            <ul
              className="flex flex-wrap gap-3"
              aria-label={isRTL ? "وسائل التواصل الاجتماعي" : "Social media"}
            >
              {[
                { Icon: Facebook, href: SOCIAL.facebook, label: 'Facebook' },
                { Icon: Instagram, href: SOCIAL.instagram, label: 'Instagram' },
                { Icon: Twitter, href: SOCIAL.twitter, label: 'Twitter' },
                { Icon: Linkedin, href: SOCIAL.linkedin, label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 transition-all"
                    title={isRTL ? `تابعنا على ${label}` : `Follow us on ${label}`}
                  >
                    <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <nav aria-label={isRTL ? "روابط سريعة" : "Quick links"} className="space-y-4 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-adh-text">
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <RouterLink 
                    to={l.to} 
                    className="text-adh-text-secondary hover:text-white transition-colors duration-200 text-sm"
                  >
                    {l.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="space-y-4 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-adh-text">
              {isRTL ? "الخدمات" : "Services"}
            </h3>
            <ul className="space-y-2">
              {services.map((label, idx) => (
                <li key={idx}>
                  <RouterLink 
                    to="/products" 
                    className="text-adh-text-secondary hover:text-white transition-colors duration-200 text-sm"
                  >
                    {label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav className="space-y-4 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-adh-text">
              {isRTL ? "الموارد" : "Resources"}
            </h3>
            <ul className="space-y-2">
              {footerResources.map((resource, idx) => (
                <li key={idx}>
                  <RouterLink 
                    to={resource.href} 
                    className="text-adh-text-secondary hover:text-white transition-colors duration-200 text-sm"
                  >
                    {resource.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic space-y-4 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-adh-text">
              {isRTL ? "معلومات الاتصال" : "Contact"}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-adh-brand shrink-0" aria-hidden="true" />
                <a 
                  href={CONTACT_INFO.phoneHref} 
                  className="text-adh-text-secondary hover:text-white transition-colors text-sm" 
                  dir="ltr"
                  title="Call us"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-adh-brand shrink-0" aria-hidden="true" />
                <a 
                  href={CONTACT_INFO.emailHref} 
                  className="text-adh-text-secondary hover:text-white transition-colors text-sm break-all"
                  title="Send us an email"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-adh-brand mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-adh-text-secondary text-sm leading-relaxed">
                  <span>{CONTACT_INFO.address}</span>
                  <br />
                  <a 
                    href={CONTACT_INFO.mapHref} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-adh-btn underline underline-offset-4 hover:opacity-80 transition-opacity"
                    title="Open in Google Maps"
                  >
                    {isRTL ? "افتح في الخريطة" : "View on Maps"}
                  </a>
                </div>
              </div>
            </div>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-adh-text-secondary">
            <p>
              © {year} Abdulhaq Dimensions. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
            <p>
              {isRTL 
                ? "التميز في حلول الديكور الداخلي منذ عام 1948"
                : "Excellence in Interior Solutions Since 1948"
              }
            </p>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <RouterLink to="/privacy" className="hover:text-white transition-colors">
                {isRTL ? "الخصوصية" : "Privacy"}
              </RouterLink>
              <span className="text-adh-stroke">•</span>
              <RouterLink to="/terms" className="hover:text-white transition-colors">
                {isRTL ? "الشروط" : "Terms"}
              </RouterLink>
              <span className="text-adh-stroke">•</span>
              <a href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
