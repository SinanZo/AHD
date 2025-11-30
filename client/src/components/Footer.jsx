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
      className="bg-[var(--bgElevated)] text-[var(--fg)]" 
      dir={dir} 
      role="contentinfo"
      aria-label={isRTL ? "تذييل الصفحة" : "Footer"}
    >
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand / About */}
          <div className="space-y-4 lg:col-span-2">
            <RouterLink to="/" aria-label={isRTL ? "اذهب إلى الصفحة الرئيسية" : "Go to homepage"} className="inline-flex items-center">
              <div className="w-12 h-12 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white font-bold text-lg">
                AD
              </div>
              <span className="ml-2 font-bold text-lg text-[var(--fg)]">Abdulhaq Dimensions</span>
            </RouterLink>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              {footerAbout}
            </p>

            <ul 
              className={`flex ${isRTL ? "space-x-reverse" : ""} space-x-4`} 
              aria-label={isRTL ? "وسائل التواصل الاجتماعي" : "Social media"}
            >
              <li>
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-md hover:bg-[var(--chip)] transition-colors duration-200"
                  title="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5 text-[var(--brand)]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isRTL ? "إنستجرام" : "Instagram"}
                  className="p-2 rounded-md hover:bg-[var(--chip)] transition-colors duration-200"
                  title="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5 text-[var(--brand)]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isRTL ? "تويتر" : "Twitter"}
                  className="p-2 rounded-md hover:bg-[var(--chip)] transition-colors duration-200"
                  title="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5 text-[var(--brand)]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isRTL ? "لينكدإن" : "LinkedIn"}
                  className="p-2 rounded-md hover:bg-[var(--chip)] transition-colors duration-200"
                  title="Follow us on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-[var(--brand)]" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <nav aria-label={isRTL ? "روابط سريعة" : "Quick links"} className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--fg)]">
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <RouterLink 
                    to={l.to} 
                    className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors duration-200 text-sm"
                  >
                    {l.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--fg)]">
              {isRTL ? "الخدمات" : "Services"}
            </h3>
            <ul className="space-y-2">
              {services.map((label, idx) => (
                <li key={idx}>
                  <RouterLink 
                    to="/products" 
                    className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors duration-200 text-sm"
                  >
                    {label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--fg)]">
              {isRTL ? "الموارد" : "Resources"}
            </h3>
            <ul className="space-y-2">
              {footerResources.map((resource, idx) => (
                <li key={idx}>
                  <RouterLink 
                    to={resource.href} 
                    className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors duration-200 text-sm"
                  >
                    {resource.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic space-y-4">
            <h3 className="text-lg font-semibold text-[var(--fg)]">
              {isRTL ? "معلومات الاتصال" : "Contact"}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
                <a 
                  href={CONTACT_INFO.phoneHref} 
                  className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors text-sm" 
                  dir="ltr"
                  title="Call us"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--brand)] flex-shrink-0" aria-hidden="true" />
                <a 
                  href={CONTACT_INFO.emailHref} 
                  className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors text-sm break-all"
                  title="Send us an email"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[var(--brand)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="text-[var(--muted)] text-sm leading-relaxed">
                  <span>{CONTACT_INFO.address}</span>
                  <br />
                  <a 
                    href={CONTACT_INFO.mapHref} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[var(--brand)] underline underline-offset-2 hover:opacity-80 transition-opacity"
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
        <div className="border-t border-[var(--stroke)] mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[var(--muted)] text-sm">
              © {year} Abdulhaq Dimensions. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
            <p className="text-[var(--muted)] text-sm">
              {isRTL 
                ? "التميز في حلول الديكور الداخلي منذ عام 1948"
                : "Excellence in Interior Solutions Since 1948"
              }
            </p>
            <div className="text-sm space-x-3 flex justify-center md:justify-end">
              <RouterLink to="/privacy" className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors">
                {isRTL ? "الخصوصية" : "Privacy"}
              </RouterLink>
              <span className="text-[var(--stroke)]">•</span>
              <RouterLink to="/terms" className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors">
                {isRTL ? "الشروط" : "Terms"}
              </RouterLink>
              <span className="text-[var(--stroke)]">•</span>
              <a href="/sitemap.xml" className="text-[var(--muted)] hover:text-[var(--brand)] transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
