import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import createTT from "../lib/tt";
import { Star, Layers, Hammer, Sparkles } from "lucide-react";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { slugify, ensureUrl } from "../lib/utils";

export default function Services() {
  const { t, i18n } = useTranslation("services");
  const tt = createTT(t, "services");
  const isRTL = i18n.dir() === "rtl";
  const prefersReducedMotion = useReducedMotion();
  const { shouldDisableAnimations } = useMobileOptimization();

  // Robust i18n reads with fallback
  const items = t("items", { returnObjects: true }) || [];
  const services = Array.isArray(items) ? items : [];

  // Icons as components (not JSX instances) so we don’t recreate elements each render
  const IconComponents = useMemo(() => [Layers, Hammer, Sparkles, Star], []);

  // Motion presets (respect reduced motion and mobile performance)
  const disableMotion = prefersReducedMotion || shouldDisableAnimations;
  const sectionIntro = disableMotion
    ? {}
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } };

  const cardIntro = (idx) =>
    disableMotion
      ? {}
      : {
          initial: { opacity: 0, y: 36, scale: 0.96 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.6, delay: idx * 0.08 },
        };

  const title = tt('meta.title', { defaultValue: 'Our Services | Abdulhaq Dimensions' });
  const description = tt('meta.description', { defaultValue: 'Comprehensive interior solutions including curtains, blinds, upholstery, and wallpapers.' });

  // Build a base URL for JSON-LD; prefer a deploy-time config (strip trailing slash),
  // fallback to window.location.origin when available.
  const baseRaw = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_BASE_URL) || undefined;
  const base = baseRaw ? String(baseRaw).replace(/\/$/, '') : (typeof window !== 'undefined' ? window.location.origin : '');

  const jsonLd = services.length && base ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
          "@type": "Service",
          name: s.title,
          description: s.desc || undefined,
          url: ensureUrl(base, `/services/${slugify(s.title)}`),
        },
    })),
  } : undefined;

  return (
    <Layout title={title} description={description} jsonLd={jsonLd}>
      <Reveal>
      <section
        className="relative py-20 min-h-[65vh] overflow-hidden"
        style={{ background: "linear-gradient(120deg, var(--brand) 60%, var(--brand-2) 100%)" }}
        dir={isRTL ? "rtl" : "ltr"}
        aria-labelledby="services-heading"
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 left-0 w-80 h-80 bg-[#e8e6e6]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-0 w-96 h-96 bg-[#5b7d89]/20 rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Motion.div
            className={`text-center mb-14 ${isRTL ? "text-right md:text-center" : ""}`}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            {...sectionIntro}
          >
            <h1
              id="services-heading"
              className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-xl"
            >
              {tt("title", { defaultValue: "Our Services" })}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-white/90">
              {tt("description", { defaultValue: "Comprehensive interior solutions." })}
            </p>
          </Motion.div>

          {/* Empty state (defensive) - keep layout stable to avoid CLS */}
          <div aria-busy={services.length === 0 ? "true" : "false"}>
            {services.length === 0 ? (
              <p className="text-center text-white/90">
                {tt("empty", { defaultValue: "Services coming soon." })}
              </p>
            ) : (
              <Motion.ul
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                viewport={{ once: true, amount: 0.18 }}
              >
                {services.map((svc, idx) => {
                const Icon = IconComponents[idx % IconComponents.length];
                const slug = slugify(svc?.title || `service-${idx}`);
                const titleId = `svc-${slug}-title`;

                return (
                  <Motion.li key={slug} role="listitem" className="h-full">
                    <Motion.article
                      className="h-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/15 flex flex-col
                        transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                      aria-labelledby={titleId}
                      aria-describedby={svc.desc ? `${titleId}-desc` : undefined}
                      viewport={{ once: true, amount: 0.18 }}
                      {...cardIntro(idx)}
                    >
                    <div className="mb-4 flex items-center gap-3">
                      <Icon className="w-8 h-8 text-white/90" aria-hidden="true" />
                      <h3 id={titleId} className="text-xl font-semibold text-white">
                        {svc.title}
                      </h3>
                    </div>

                    {svc.desc && (
                      <p id={`${titleId}-desc`} className="mb-4 text-white/90">
                        {svc.desc}
                      </p>
                    )}

                    {Array.isArray(svc.features) && svc.features.length > 0 && (
                      <ul className="mb-6 space-y-2">
                        {svc.features.map((feat, fidx) => (
                            <li key={`${slug}-feat-${fidx}`} className="flex items-center gap-2 text-white/80 text-sm">
                            <Star className="w-4 h-4 opacity-80 text-white" aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Placeholder for future CTA */}
                    {/* <button className="btn-secondary w-full mt-auto">{tt('learnMore', { defaultValue: 'Learn More' })}</button> */}
                    </Motion.article>
                  </Motion.li>
                );
              })}
              </Motion.ul>
            )}
          </div>
        </div>
  </section>
  </Reveal>
    </Layout>
  );
}
