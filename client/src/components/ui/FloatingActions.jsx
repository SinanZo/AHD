import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle } from 'lucide-react';
import { WA_URL, CTA_HIDE_ROUTES } from '../../config';
import { useLocation } from 'wouter';

export default function FloatingActions() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const isRTL = i18n.dir() === 'rtl';
  const phone = '+9627778050005'.replace(/[^+\d]/g, '');
  const wa = WA_URL ? WA_URL('Hello! I would like to get a quote') : `https://wa.me/${phone}`;

  // Auto-hide: small screens and near footer using an IntersectionObserver on footer
  // fadeFactor: 0 (fully visible) -> 1 (max faded)
  const [fadeFactor, setFadeFactor] = React.useState(0);
  const [hoverWake, setHoverWake] = React.useState(false);
  const [isTiny, setIsTiny] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 380px)');
    const update = () => setIsTiny(mq.matches);
    update();
    try { mq.addEventListener('change', update); } catch { mq.addListener(update); }
    return () => { try { mq.removeEventListener('change', update); } catch { mq.removeListener(update); } };
  }, []);

  React.useEffect(() => {
    const footerTarget = document.querySelector('#footer-bottom') || document.querySelector('footer');
    if (!('IntersectionObserver' in window) || !footerTarget) return;
    const thresholds = Array.from({ length: 11 }, (_, i) => i / 10); // 0..1
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        // More overlap => stronger fade
        const ratio = typeof e.intersectionRatio === 'number' ? e.intersectionRatio : (e.isIntersecting ? 1 : 0);
        setFadeFactor(Math.min(1, Math.max(0, ratio)));
      });
    }, { threshold: thresholds, rootMargin: '0px' });
    io.observe(footerTarget);
    return () => io.disconnect();
  }, []);

  // Per-route hide list
  const shouldHideByRoute = React.useMemo(() => {
    if (!CTA_HIDE_ROUTES.length) return false;
    return CTA_HIDE_ROUTES.some((rule) => {
      if (!rule) return false;
      // Prefix match when rule ends with *
      if (rule.endsWith('*')) return pathname.startsWith(rule.slice(0, -1));
      return pathname === rule;
    });
  }, [pathname]);

  // For tiny screens or route rules, don't render at all
  if (isTiny || shouldHideByRoute) return null;

  return (
    <div
      className={`fixed bottom-5 ${isRTL ? 'left-5' : 'right-5'} z-70 flex flex-col gap-3 transition-opacity duration-300`}
      style={{ opacity: hoverWake ? 1 : (1 - fadeFactor * 0.9) }}
      onMouseEnter={() => setHoverWake(true)}
      onMouseLeave={() => setHoverWake(false)}
      onFocusCapture={() => setHoverWake(true)}
      onBlurCapture={() => setHoverWake(false)}
      aria-label="Quick contact actions"
    >
      <a
        href={`tel:${phone}`}
        className="w-12 h-12 rounded-full grid place-items-center bg-(--brand) text-white shadow-xl hover:scale-105 transition"
        aria-label="Call us"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full grid place-items-center bg-green-500 text-white shadow-xl hover:scale-105 transition"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
    </div>
  );
}
