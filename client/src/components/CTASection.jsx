import React from "react";
import { useTranslation } from "react-i18next";
import createTT from "../lib/tt";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TEL_URL, WA_URL } from '../config';

export default function CTASection() {
  const { t, i18n } = useTranslation("cta");
  const tt = createTT(t, "cta");
  const isRTL = i18n.dir() === "rtl";
  const prefersReducedMotion = useReducedMotion();

  // reference motion to avoid unused-import lint in some toolchains
  void motion;

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 50, scale: 0.97 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.7, type: "spring" },
        viewport: { once: true, amount: 0.7 },
      };

  return (
    <section
      className="py-16 relative bg-primary text-white overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      aria-labelledby="cta-heading"
    >
      {/* Decorative background (hidden from AT) */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/images/cta-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.7) blur(1px)" }}
          draggable={false}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.style.background =
              "linear-gradient(135deg, #002b3a 0%, #5b7d89 100%)";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#002b3a]/90 via-[#002b3a]/80 to-[#5b7d89]/80" />
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <motion.div
          className="text-center py-20 max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl"
          {...motionProps}
        >
          <h2
            id="cta-heading"
            className="text-3xl md:text-4xl font-jockey mb-6 drop-shadow-xl font-bold text-white"
          >
            {tt("title")}
          </h2>

          <p className="max-w-2xl mx-auto text-lg mb-8 opacity-90 text-white/90">
            {tt("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* WhatsApp (anchor as button for correct semantics) */}
            <Button asChild size="lg" className="btn btn-primary rounded-full px-8 py-4 text-base font-semibold">
              <a
                href={WA_URL()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tt("cta1")}
              >
                {tt("cta1")}
              </a>
            </Button>

            {/* Phone (anchor as button) */}
            <Button asChild size="lg" className="btn btn-ghost rounded-full px-8 py-4 text-base font-semibold">
              <a href={TEL_URL} aria-label={tt("cta2")}>
                <span className={`inline-flex items-center ${isRTL ? "ml-2" : "mr-2"}`}>
                  <Phone className="w-5 h-5 opacity-90" aria-hidden="true" />
                </span>
                {tt("cta2")}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
