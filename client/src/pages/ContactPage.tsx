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

  // Use explicit namespace with defaultValue so missing translations don't show raw keys
  const labels = {
    name: t('form.name', { ns: 'contact', defaultValue: 'Your Name' }),
    namePlaceholder: t('form.namePlaceholder', { ns: 'contact', defaultValue: 'Enter your name' }),
    email: t('form.email', { ns: 'contact', defaultValue: 'Your Email' }),
    emailPlaceholder: t('form.emailPlaceholder', { ns: 'contact', defaultValue: 'you@example.com' }),
    message: t('form.message', { ns: 'contact', defaultValue: 'Your Message' }),
    messagePlaceholder: t('form.messagePlaceholder', { ns: 'contact', defaultValue: 'Type your message...' }),
    submit: t('form.submit', { ns: 'contact', defaultValue: 'Send Message' }),
  };

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email)) {
      setError(
        t('validation.invalidEmail', {
          defaultValue: 'Please enter a valid email address.',
        })
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data && data.message) || `Request failed with status ${res.status}`);
      }

      setSuccess(
        t('success', {
          defaultValue:
            "Thank you. Your message has been sent successfully. We'll respond within one business day.",
        })
      );
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
      })}
    >
      <div className="min-h-screen bg-adh-bg text-adh-text" dir={dir}>
        {/* Heading */}
        <div className="container mx-auto px-4 pt-12 pb-6 text-center">
          <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-adh-text">
            {t('heading', { defaultValue: 'Contact Us' })}
          </h1>
          <p className="max-w-2xl mx-auto text-adh-text-muted text-sm md:text-base leading-relaxed">
            {t('pageDesc', {
              defaultValue:
                "We'd love to hear from you. Whether you're seeking a consultation, need support, or have a business inquiry, our dedicated team is here to assist. Share your vision with us, and we'll respond within one business day to help bring it to life.",
            })}
          </p>
        </div>

        {/* Main 2-column block */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FORM CARD */}
            <div className="rounded-2xl border p-6 backdrop-blur-lg md:p-8 bg-adh-surface/10 shadow-adh-soft border-adh-stroke/15">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {labels.name}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded-xl bg-adh-bg border border-adh-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-adh-primary focus:border-adh-primary transition"
                    placeholder={labels.namePlaceholder}
                    aria-label={labels.name}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {labels.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full rounded-xl bg-adh-bg border border-adh-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-adh-primary focus:border-adh-primary transition"
                    placeholder={labels.emailPlaceholder}
                    aria-label={labels.email}
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {labels.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={5}
                    className="w-full rounded-xl bg-adh-bg border border-adh-stroke px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-adh-primary focus:border-adh-primary transition"
                    placeholder={labels.messagePlaceholder}
                    required
                    aria-label={t('form.message', { defaultValue: 'Your Message' })}
                  />
                  <p className={`mt-1 text-[11px] text-adh-text-muted ${isRTL ? 'text-right' : 'text-left'}`}>
                    {form.message.length}/5000
                  </p>
                </div>

                {/* Alerts */}
                {(error || success) && (
                  <div className="space-y-3">
                    {error && (
                      <div
                        className="bg-red-900/20 border border-red-600/40 text-red-400 px-4 py-3 rounded-lg"
                        role="alert"
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
                  {labels.submit}
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
