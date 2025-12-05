import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';

export default function ContactSection() {
  const { t, i18n } = useTranslation('contact');
  const isAr = i18n.language === 'ar';

  return (
    <section
      id="contact"
      className="relative py-12 md:py-16 lg:py-24 bg-adh-bg text-adh-text overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 bg-linear-to-b from-adh-bg via-transparent to-adh-bg" aria-hidden="true" />
      <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-adh-brand/15 blur-[120px]" aria-hidden="true" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full bg-adh-accent/10 blur-[140px]" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.h2
          className="text-center text-[clamp(28px,5vw,44px)] font-serif font-semibold tracking-tight text-adh-text mb-8 md:mb-12 px-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          {t('title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: isAr ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className={`order-1 rounded-3xl md:rounded-4xl border border-adh-stroke bg-adh-surface/95 shadow-adh-card backdrop-blur-lg p-6 md:p-8 lg:p-10 ${isAr ? 'md:order-2' : 'md:order-1'}`}
          >
            <ContactForm />

            <div className="mt-8 md:mt-10 space-y-3 md:space-y-4 text-sm md:text-base text-adh-text-secondary">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-adh-text" />
                <span className="wrap-break-word">{t('info.phone')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-adh-text" />
                <span className="wrap-break-word">{t('info.email')}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-adh-text mt-0.5" />
                <span className="wrap-break-word">{t('info.address')}</span>
              </div>

              <div className="pt-4 border-t border-adh-stroke/60">
                <div className="font-semibold mb-3 text-adh-text">{t('social.followUs')}:</div>
                <div className="flex items-center gap-4 bg-adh-bg-soft/70 rounded-full px-4 py-2 shadow-adh-soft border border-adh-stroke/60">
                  <a
                    href="https://www.facebook.com/AbdulhaqDimensions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-6 h-6 text-adh-accent hover:text-adh-text transition" />
                  </a>
                  <a
                    href="https://instagram.com/abdulhaqdimensions?igshid=YmMyMTA2M2Y="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-adh-accent hover:text-adh-text transition" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/abdulhaq-dimensions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6 text-adh-accent hover:text-adh-text transition" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isAr ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className={`order-2 w-full h-full min-h-[350px] md:min-h-[500px] rounded-3xl md:rounded-4xl overflow-hidden border border-adh-stroke bg-adh-surface/80 shadow-adh-card backdrop-blur-md ${isAr ? 'md:order-1' : 'md:order-2'}`}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.8025798118147!2d35.840547576111994!3d31.966252124976677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca117cbe45f27%3A0x5e065023684733b0!2sAbdulhaq%20Dimensions!5e0!3m2!1sen!2sjo!4v1764880693685!5m2!1sen!2sjo"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('map_title') || 'Abdulhaq Dimensions Location'}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
