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

const initialState: ContactFormState = { name: '', email: '', message: '' };

export default function ContactPage() {
  const { t, i18n } = useTranslation('contact');
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dir = i18n.dir?.() || 'ltr';
  const isRTL = dir === 'rtl';

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((p) => ({ ...p, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t('validation.required', { defaultValue: 'Please fill out all fields.' }));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setSuccess(t('success', { defaultValue: "Thank you. Your message has been sent successfully." }));
      setForm(initialState);
    } catch (err) {
      console.error(err);
      setError(t('error.submit', { defaultValue: 'Something went wrong. Please try again later.' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout
      title={t('seo.title', { defaultValue: 'Contact Us | Abdulhaq Dimensions' })}
      description={t('seo.description', { defaultValue: 'Get in touch with Abdulhaq Dimensions for consultations or inquiries.' })}
    >
      <div className="min-h-screen bg-adh-bg text-adh-text" dir={dir}>
        <div className="container mx-auto px-4 pt-12 pb-6 text-center">
          <h1 className="text-2xl leading-snug font-bold sm:text-3xl md:text-4xl">{t('heading', { defaultValue: 'Contact Us' })}</h1>
          <p className="max-w-2xl mx-auto text-adh-text-muted text-sm md:text-base leading-relaxed mt-4">
            {t('pageDesc', { defaultValue: "We'd love to hear from you. Share your vision with us and we'll respond within one business day." })}
          </p>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-adh-surface border border-adh-stroke rounded-3xl p-6 shadow-adh-soft">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('form.name', { defaultValue: 'Your Name' })}
                  </label>
                  <input name="name" value={form.name} onChange={onChange} className="w-full rounded-xl bg-adh-bg border border-adh-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-adh-primary transition" placeholder={t('form.namePlaceholder', { defaultValue: 'Your Name' })} />
                </div>

                <div>
                  <label className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('form.email', { defaultValue: 'Your Email' })}
                  </label>
                  <input name="email" type="email" value={form.email} onChange={onChange} className="w-full rounded-xl bg-adh-bg border border-adh-stroke px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-adh-primary transition" placeholder={t('form.emailPlaceholder', { defaultValue: 'you@example.com' })} />
                </div>

                <div>
                  <label className={`block text-xs font-semibold tracking-wide uppercase mb-2 text-adh-text-muted ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('form.message', { defaultValue: 'Your Message' })}
                  </label>
                  <textarea name="message" rows={6} value={form.message} onChange={onChange} className="w-full rounded-xl bg-adh-bg border border-adh-stroke px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-adh-primary transition" placeholder={t('form.messagePlaceholder', { defaultValue: 'Write your message here...' })} required />
                </div>

                {(error || success) && (
                  <div>
                    {error && <div className="bg-red-900/20 border border-red-600/40 text-red-400 px-4 py-3 rounded-lg" role="alert">{error}</div>}
                    {success && <div className="bg-emerald-900/20 border border-emerald-600/40 text-emerald-400 px-4 py-3 rounded-lg" role="status">{success}</div>}
                  </div>
                )}

                <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center rounded-full bg-adh-btn text-adh-btn-fg text-sm font-semibold px-7 py-3 shadow-adh-soft hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('form.submit', { defaultValue: 'Send Message' })}
                </button>

                <div className="pt-6 space-y-3 text-xs text-adh-text-muted border-t border-adh-stroke/40">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone className="w-4 h-4 shrink-0" aria-hidden />
                    <a href="tel:+962778050005" className="hover:text-adh-primary transition">+962 77 805 0005</a>
                  </div>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Mail className="w-4 h-4 shrink-0" aria-hidden />
                    <a href="mailto:info@abdulhaqdimensions.com" className="hover:text-adh-primary transition break-all">info@abdulhaqdimensions.com</a>
                  </div>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden />
                    <span>{t('info.address', { defaultValue: 'Amman, Jordan' })}</span>
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-adh-surface border border-adh-stroke rounded-3xl overflow-hidden shadow-adh-soft flex flex-col">
              <div className={`border-b border-adh-stroke px-6 py-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <h2 className="text-sm font-semibold">{t('map.title', { defaultValue: 'Our Location' })}</h2>
                  <p className="text-xs text-adh-text-muted">{t('info.address', { defaultValue: 'Amman, Jordan' })}</p>
                </div>
                <a href="https://www.google.com/maps?q=Abdulhaq+Dimensions+Amman+Jordan" target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-adh-primary hover:underline transition shrink-0">{t('map.viewOn', { defaultValue: 'View on map' })}</a>
              </div>
              <div className="flex-1 min-h-[350px] md:min-h-[500px]">
                <iframe title={t('map.title', { defaultValue: 'Abdulhaq Dimensions Location' })} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.8025798118147!2d35.840547576111994!3d31.966252124976677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca117cbe45f27%3A0x5e065023684733b0!2sAbdulhaq%20Dimensions!5e0!3m2!1sen!2sjo!4v1764880693685!5m2!1sen!2sjo" width="100%" height="100%" className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
