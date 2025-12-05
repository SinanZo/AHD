import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import contactData from '../data/contact';

export default function ContactBlock() {
  const { t } = useTranslation('contactBlock');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.honeypot) return; // Prevent spam submissions

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  if (submitted) {
    return (
      <section className="bg-(--bg) py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-(--brand) mb-4">
            {t('thankYou', { defaultValue: 'Thank you for reaching out!' })}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('responseMessage', { defaultValue: 'We will get back to you shortly.' })}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-(--bg) py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-(--brand) mb-8">
          {t('heading', { defaultValue: 'Contact Us' })}
        </h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-(--card) p-6 rounded-lg shadow-md border border-(--stroke)">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-(--fg) mb-1">
              {t('nameLabel', { defaultValue: 'Your Name' })}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-(--stroke) rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-(--fg) mb-1">
              {t('emailLabel', { defaultValue: 'Your Email' })}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-(--stroke) rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-(--fg) mb-1">
              {t('messageLabel', { defaultValue: 'Your Message' })}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border border-(--stroke) rounded-lg"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="hidden">
            <label htmlFor="honeypot">Honeypot</label>
            <input
              type="text"
              id="honeypot"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-adh-btn text-adh-btn-fg font-semibold rounded-lg shadow-md hover:bg-adh-btn-hover focus:outline-none focus:ring-2 focus:ring-adh-brand focus:ring-offset-2"
          >
            {t('submitButton', { defaultValue: 'Send Message' })}
          </button>
        </form>

        {/* Contact Details Card */}
        <div className="max-w-2xl mx-auto mt-10 bg-adh-chip border border-adh-stroke rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-(--fg) mb-6">
            {t('contactDetails', { defaultValue: 'Contact Details' })}
          </h3>
          <ul className="space-y-4 text-sm">
            {/* Address */}
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0 text-(--primary) mt-0.5" aria-hidden="true" />
              <a
                href={contactData.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80 transition-opacity text-(--fg)"
              >
                {t('address', { defaultValue: contactData.address })}
              </a>
            </li>

            {/* Phone */}
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 shrink-0 text-(--primary) mt-0.5" aria-hidden="true" />
              <a
                href={contactData.phoneHref}
                className="underline hover:opacity-80 transition-opacity text-(--fg)"
              >
                {contactData.phoneHuman}
              </a>
            </li>

            {/* Email */}
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 shrink-0 text-(--primary) mt-0.5" aria-hidden="true" />
              <a
                href={contactData.emailHref}
                className="underline hover:opacity-80 transition-opacity text-(--fg)"
              >
                {contactData.email}
              </a>
            </li>

            {/* WhatsApp */}
            <li className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 shrink-0 text-(--primary) mt-0.5" aria-hidden="true" />
              <a
                href={contactData.waHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80 transition-opacity text-(--fg)"
              >
                {t('whatsapp', { defaultValue: 'WhatsApp' })}
              </a>
            </li>

            {/* Hours */}
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 shrink-0 text-(--primary) mt-0.5" aria-hidden="true" />
              <span className="text-(--fg)">
                {t('hours', { defaultValue: 'Daily 9:00 AM – 6:00 PM' })}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}