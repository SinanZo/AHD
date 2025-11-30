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
  <section id="contact" className="py-20 surface relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 bg-[#5b7d89] blur-2xl z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 bg-[#002b3a] blur-2xl z-0 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-20 relative z-10">
        <motion.h2
          className="text-center text-4xl md:text-5xl font-bold mb-14 text-primary uppercase tracking-wide drop-shadow"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          {t('title')}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact Form & Info */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className={`
              surface-elevated rounded-3xl shadow-2xl backdrop-blur-lg
              p-8 md:p-10
              relative z-10
              ${isAr ? 'md:order-2' : 'md:order-1'}
            `}
            style={{
              boxShadow: '0 6px 36px 0 rgba(91,125,137,0.12), 0 1px 4px 0 rgba(0,43,58,0.09)'
            }}
          >
            <ContactForm />

            {/* Contact Info */}
            <div className="mt-10 space-y-4 text-sm text-gray-700 dark:text-white/80">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#002b3a]" />
                <span>{t('info.phone')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#002b3a]" />
                <span>{t('info.email')}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#002b3a]" />
                <span>{t('info.address')}</span>
              </div>

              {/* Social */}
              <div>
                <div className="font-semibold mb-2">{t('social.followUs')}:</div>
                <div className="flex items-center gap-4 bg-white/80 dark:bg-[#21292e]/70 rounded-full px-4 py-2 shadow backdrop-blur-sm">
                  <a href="https://www.facebook.com/AbdulhaqDimensions" target="_blank" rel="noopener noreferrer"
                    className="transition hover:scale-110" aria-label="Facebook">
                    <Facebook className="w-6 h-6 text-[#5b7d89] hover:text-[#002b3a] transition" />
                  </a>
                  <a href="https://instagram.com/abdulhaqdimensions?igshid=YmMyMTA2M2Y=" target="_blank" rel="noopener noreferrer"
                    className="transition hover:scale-110" aria-label="Instagram">
                    <Instagram className="w-6 h-6 text-[#5b7d89] hover:text-[#002b3a] transition" />
                  </a>
                  <a href="https://www.linkedin.com/company/abdulhaq-dimensions" target="_blank" rel="noopener noreferrer"
                    className="transition hover:scale-110" aria-label="LinkedIn">
                    <Linkedin className="w-6 h-6 text-[#5b7d89] hover:text-[#002b3a] transition" />
                  </a>
                
                </div>
              </div>
            </div>
          </motion.div>

          {/* Google Map with glass and shadow */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className={`w-full h-full rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl surface-elevated ${isAr ? 'md:order-1' : 'md:order-2'}`}
            style={{
              boxShadow: '0 8px 36px 0 rgba(91,125,137,0.15), 0 1px 4px 0 rgba(0,43,58,0.07)'
            }}
          >
            {/* Google Maps Embed */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.8025798118147!2d35.840547576111994!3d31.966252124976677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca117cbe45f27%3A0x5e065023684733b0!2sAbdulhaq%20Dimensions!5e0!3m2!1sen!2sjo!4v1764413397696!5m2!1sen!2sjo"
              className="w-full h-[460px] border-0"
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
