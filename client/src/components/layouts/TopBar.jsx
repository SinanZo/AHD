// src/components/layouts/TopBar.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

export default function TopBar() {
  const { t, i18n } = useTranslation('header');
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div
      className="hidden sm:flex items-center justify-center gap-x-3 px-4 py-2 text-xs sm:text-sm"
      style={{
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--stroke)',
        color: 'var(--fg)',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Address */}
      <a
        href="https://maps.google.com/?q=Abdulhaq%20Dimensions%20Amman"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 underline hover:opacity-80 transition-opacity"
        aria-label={t('address.label', 'Abdulhaq Dimensions location')}
      >
        <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>{isRTL ? 'عمّان، الأردن' : 'Amman, Jordan'}</span>
      </a>

      {/* Separator */}
      <span className="text-muted" aria-hidden="true">•</span>

      {/* Phone */}
      <a
        href="tel:+962778050005"
        className="flex items-center gap-1.5 underline hover:opacity-80 transition-opacity"
        aria-label={t('phone.label', 'Call us')}
      >
        <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>+962-7-7805-0005</span>
      </a>

      {/* Separator */}
      <span className="text-muted" aria-hidden="true">•</span>

      {/* WhatsApp */}
      <a
        href="https://wa.me/962778050005"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 underline hover:opacity-80 transition-opacity"
        aria-label={t('whatsapp.label', 'WhatsApp us')}
      >
        <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>{t('whatsapp.text', 'WhatsApp')}</span>
      </a>
    </div>
  );
}
