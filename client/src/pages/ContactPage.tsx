import React, { useState } from 'react';
// @ts-ignore - Layout is a JS component without typings
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: ContactFormState = {
  name: '',
  email: '',
  message: '',
};

export default function ContactPage() {
  const { t, i18n } = useTranslation('contact');
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dir = i18n.dir?.() || 'ltr';
  const isRTL = dir === 'rtl';

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(
        t('validation.required', {
          defaultValue: 'Please fill out all fields.',
        })
      );
      return;
    }
relative overflow-hidrelative overflow-hidden py-12 text-white md:py-20
    const emailRegex = relative overflow-hidden py-12 text-white md:py-20
    if (!emailRegex.test(form.email)) {
      setError(
        t('validation.invalidEmail', {
          defaultValue: 'Please enter a valid email address.',
        })
      );
      return;relative z-10 crelative z-10 container mx-auto grid items-center gap-8 px-4 md:gap-12 lg:grid-cols-2
    }relative z-10 containerrelative z-10 container mx-auto grid items-center gap-8 px-4 md:gap-12 lg:grid-cols-2
mb-4 text-2xl leading-snug font-bold drop-shadow-mb-4 text-2xl leading-snug font-bold drop-shadow-xl sm:text-3xl md:mb-6 md:text-4xl
    setSubmitting(true);
    try {
      const res = await fetch(mb-3 text-base text-white/90 sm:text-lg md:mb-4
        method: 'POST',text-batext-base text-white/90 sm:text-lg
        headers: { 'Content-Type': 'application/jmb-4 text-2xl leading-snug font-bold drop-shadow-xl sm:text-3xl md:mb-6 md:text-4xl
        body: JSON.stgrid grid-cols-2 gap-6 py-12mb-4 text-2xl leading-snug font-bold drop-shadow-xl sm:text-3xl md:mb-6 md:text-4xl
      });
      if (!res.ok) {mb-3 text-mbw-full max-w-[280px] rounded-3xl border p-3 backdrop-blur-lg sm:max-w-xs sm:p-4 bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/30
        const data = await restext-base text-white/90 sm:text-lgxt-lg md:mb-4
        throw new Error(text-btext-base text-white/90 sm:text-lg
          data.message || `Request failed with status ${res.status}`
        );flex flex-col iflex flex-col items-center gap-1 text-center sm:gap-2
      }

      setSuccess(text-2xl letext-2xl leading-[1.2] font-semibold tracking-[0.02em] text-white sm:text-3xl md:text-[34px]
        t('success', {max-w-max-w-[30ch] text-xs leading-[1.4] font-normal text-[#C9C9C9] sm:text-sm md:text-[16px]
          defaultValue:
            "Thank you. Your message has been sent successfully. We'll respond within one business day.",
        })w-full max-w-[280px] rw-full max-w-[280px] rounded-3xl border p-3 backdrop-blur-lg sm:max-w-xs sm:p-4 bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/30
      );w-full max-w-[280px] rouw-full max-w-[280px] rounded-3xl border p-3 backdrop-blur-lg sm:max-w-xs sm:p-4 bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/30
      setForm(initialState);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(
        t('error.submit', {
          defaultValue: 'Something went wrong. Please try again later.',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout
      title={t('seo.title', { defaultValue: 'Contact Us | Abdulhaq Dimensions' })}
      description={t('seo.description', {
        defaultValue:
          'Get in touch with Abdulhaq Dimensions for consultations, support, or business inquiries.',
      })}mb-4 text-2xl font-bold tracking-tight sm:textmb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-adh-text
    >
      <div className="min-h-screen bg-adh-bg text-adh-text" dir={dir}>
        {/* Heading */}
        <div className="container mx-auto px-4 pt-12 pb-6 text-center">
          <h1 className="texgrid gap-6 md:grid-cols-2 md:gap-8
            {t('heading', { defaultValue: 'Contact Us' })}
          </h1>
          <p className="max-w-2xl mx-auto text-adh-text-muted text-sm md:text-base leading-relaxed">
            {t('pageDesc', {
              defaultValue:mb-3 mb-3 flex items-center md:mb-4
                "We'd love to hear from you. Whether you're seeking a consultation, need support, or have a business inquiry, our dedicated team is here to assist. Share your vision with us, and we'll respond within one business day to help bring it to life.",
            })}mb-0 text-lg font-bold md:text-xl textmb-0 text-lg font-bold md:text-xl text-adh-text
          </p>
        </div>

        {/* Main 2-column block */}
        <div className="container mx-auto px-4 pb-16">mmb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-adh-text
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FORM CARD */}
            <div className="bg-adh-surface border bordemb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-adh-text
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}grid gap-6 md:grid-cols-2 md:gap-8
                <div>mb-3 flex imb-3 flex items-center md:mb-4
                  <label
                    htmlFor=grid gap-6 md:grid-cols-2 mb-0 text-lg font-bold md:text-xl text-adh-text
                    className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t('form.name', { defaultValue: 'Your Name' })}
                  </label>mb-3 fmb-3 flex items-center md:mb-4
                  <input
                    id="name"mb-0 text-lg font-bold mmb-0 text-lg font-bold md:text-xl text-adh-text
                    name="name"mmb-3 flex items-center md:mb-4
                    type="text"
                    value={form.name}mb-0 text-lg fonmb-0 text-lg font-bold md:text-xl text-adh-text
                    onChange={onChange}
                    className="w-full rounded-xl bg-adh-bg border border-adh-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-adh-primary focus:border-adh-primary transition"
                    placeholder={t('form.namePlaceholder', { defaultValue: 'Your Name' })}
                    rrelative overflow-hidden py-12 text-white md:py-20 bg-adh-brand
                    aria-label={t('form.name', { defaultValue: 'Your Name' })}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="emamb-3 flex items-centmb-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl
                    className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${
                      isRTL ? 'text-right' : 'text-lefmb-0 text-lg font-bold md:text-xl text-adh-text
                    }`}mb-3 flexmb-3 flex items-center md:mb-4
                  >
                    {t('formgrid gap-6 md:grid-cols-3 md:gap-10-lg font-bold md:text-xl text-adh-text
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    classNamerounded-2xl border p-6 backdrop-blur-lg md:p-8 bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/15-2 focus:ring-adh-primary focus:border-adh-primary transition"
                    placeholder={t('form.emailPlaceholder', {
                      defaultValuemb-3 flex items-center md:mb-4
                    })}
                    rrelative overftext-lg font-bold md:text-xlmd:py-20 bg-adh-brand
                    aria-label={t('form.email', { defaultValue: 'Your Email' })}
                  />
                </div>
relative overflow-hidrelative overflow-hidden py-12 text-white md:py-20 bg-adh-brand
                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t('form.message', { defaultValue: 'Your Message' })}
                  </label>mb-2 text-2xl font-bold trmb-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}mb-2 text-2xmb-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl
                    onChangegrid gap-6 md:grid-cols-3 md:gap-10
                    rows={5}
                    className="w-full rounded-xl bg-adh-bg border border-adh-stroke px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-adh-primary focus:border-adh-primary transition"
                    placeholder={t('form.messagePlaceholder', {
                      defaulgrid gap-6 md:grid-cols-3 md:gap-10
                    })}
                    required
                    aria-label={t('form.message', { defaultValue: 'Your Message' })}
                  />
                  <p className={`mt-1 text-[11px] text-adh-text-muted ${isRTL ? 'text-right' : 'text-left'}`}>
                    {form.message.length}/5000
                  </p>
                </div>roundedrounded-2xl border p-6 backdrop-blur-lg md:p-8 bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/15

                {/* Alerts */}mb-3mb-3 flex items-center md:mb-4
                {(error || success) && (
                  <div classNroundetext-lg font-bold md:text-xlur-lg md:p-8 bg-adh-surface/10 shadow-adh-soft border-adh-stroke-/15
                    {error && (
                      <divmb-3 flemb-3 flex items-center md:mb-4
                        className="bg-red-900/20 border border-red-600/40 text-red-400 px-4 py-3 rounded-lg"
                        role="alerttext-lg font-bold md:text-xl
                      >
                        {error}
                      </div>
                    )}
                    {success && (
                      <div
                        className="bg-emerald-900/20 border border-emerald-600/40 text-emerald-400 px-4 py-3 rounded-lg"
                        role="status"
                      >
                        {success}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center rounded-full bg-adh-btn text-adh-btn-fg text-sm font-semibold px-7 py-3 shadow-adh-soft hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-busy={submitting}
                >
                  {submitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {t('form.submit', { defaultValue: 'Send Message' })}
                </button>

                {/* Contact details under button */}
                <div className="pt-6 space-y-3 text-xs text-adh-text-muted border-t border-adh-stroke/40">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <a
                      href="tel:+962778050005"
                      className="hover:text-adh-primary transition"
                    >
                      +962 77 805 0005
                    </a>
                  </div>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <a
                      href="mailto:info@abdulhaqdimensions.com"
                      className="hover:text-adh-primary transition break-all"
                    >
                      info@abdulhaqdimensions.com
                    </a>
                  </div>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t('info.address', { defaultValue: 'Amman, Jordan' })}</span>
                  </div>
                </div>
              </form>
            </div>

            {/* MAP CARD */}
            <div className="bg-adh-surface border border-adh-stroke rounded-3xl overflow-hidden shadow-adh-soft flex flex-col">
              <div className={`border-b border-adh-stroke px-6 py-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <h2 className="text-sm font-semibold">
                    {t('map.title', { defaultValue: 'Our Location' })}
                  </h2>
                  <p className="text-xs text-adh-text-muted">
                    {t('info.address', { defaultValue: 'Amman, Jordan' })}
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps?q=Abdulhaq+Dimensions+Amman+Jordan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-adh-primary hover:underline transition shrink-0"
                >
                  {t('map.viewOn', { defaultValue: 'View on map' })}
                </a>
              </div>
              <div className="flex-1 min-h-[350px] md:min-h-[500px]">
                <iframe
                  title={t('map.title', { defaultValue: 'Abdulhaq Dimensions Location' })}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.8025798118147!2d35.840547576111994!3d31.966252124976677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca117cbe45f27%3A0x5e065023684733b0!2sAbdulhaq%20Dimensions!5e0!3m2!1sen!2sjo!4v1764880693685!5m2!1sen!2sjo"
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
