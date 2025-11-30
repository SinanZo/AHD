// src/components/ServicesSection.tsx
import React, { useMemo, useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/card';
import { Link } from 'wouter';
import { SERVICES } from '../data/services';

type ServiceItem = {
  slug?: string;
  title: string;
  desc?: string;
  description?: string;
  features?: string[];
  icon?: string;
};

type CatalogBlock = {
  title: string;
  desc?: string;
  bullets?: string[];
};

interface ServicesSectionProps {
  id?: string;
  className?: string;
  /** Cards to show (max). Defaults to 4 */
  maxCards?: number;
  /** Provide services directly; otherwise pulled from i18n('services.items') */
  itemsOverride?: ServiceItem[];
  /** Render catalog blocks below cards (from i18n('services.catalog')) */
  showCatalog?: boolean;
}

// Inline SVG Icon Components
const CurtainsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 2h18v2H3V2zm0 4h4v16H3V6zm6 0h2v16H9V6zm4 0h2v16h-2V6zm4 0h4v16h-4V6z" fill="currentColor" />
    <path d="M5 8c1 2 1 4 0 6M11 8c1 2 1 4 0 6M15 8c1 2 1 4 0 6M19 8c1 2 1 4 0 6" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const BlindsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3h20v2H2V3zm0 4h20v2H2V7zm0 4h20v2H2v-2zm0 4h20v2H2v-2zm0 4h20v2H2v-2z" fill="currentColor" />
    <path d="M4 5h16M4 9h16M4 13h16M4 17h16M4 21h16" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const PergolaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18v2H3V6zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" fill="currentColor" />
    <path d="M5 8v8M9 8v8M15 8v8M19 8v8" stroke="currentColor" strokeWidth="1" />
    <path d="M2 4h20v2H2V4z" fill="currentColor" />
  </svg>
);

const WallpaperIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" />
    <path d="M6 6h12v12H6V6z" stroke="currentColor" strokeWidth="1" />
    <path d="M8 8h8v8H8V8z" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// Icon map using inline SVG components
const ICON_COMPONENTS: Record<string, React.FC<{ className?: string }>> = {
  Curtains: CurtainsIcon,
  Blinds: BlindsIcon,
  Pergola: PergolaIcon,
  Wallpaper: WallpaperIcon,
};

export default function ServicesSection({
  id = 'services',
  className,
  maxCards = 4,
  itemsOverride,
  showCatalog = true,
}: ServicesSectionProps) {
  const { t, i18n } = useTranslation('services', { useSuspense: false });
  const reduce = useReducedMotion();
  const dir = (typeof i18n.dir === 'function' ? i18n.dir() : undefined) || (i18n?.language ? (i18n.language.slice(0,2).toLowerCase() === 'ar' ? 'rtl' : 'ltr') : undefined);
  const isRTL = dir === 'rtl';
  const lang = i18n?.language || undefined;
  const preferAr = typeof i18n.language === 'string' && i18n.language.startsWith('ar') && typeof i18n.getResourceBundle === 'function' && !!i18n.getResourceBundle('ar', 'services');

  // headings
  const subtitle = t('subtitle', { defaultValue: 'Our Services', lng: preferAr ? 'ar' : undefined });
  const title = t('title', { defaultValue: 'What We Offer', lng: preferAr ? 'ar' : undefined });
  const description = t('description', {
    defaultValue:
      'Premium shading, curtains, wallpapers, upholstery, and end-to-end installation for homes and businesses.',
    lng: preferAr ? 'ar' : undefined,
  });

  // items from canonical SERVICES array (dedupe and carry icon key)
  const services: ServiceItem[] = useMemo(() => {
    const uniq: Record<string, boolean> = {};
    const out: ServiceItem[] = [];
    for (const svc of SERVICES.slice(0, maxCards)) {
      if (!svc || !svc.key) continue;
      if (uniq[svc.key]) continue;
      uniq[svc.key] = true;
      out.push({
        title: t(`services.${svc.key}.title`, { defaultValue: svc.key }),
        desc: t(`services.${svc.key}.description`, { defaultValue: '' }),
        features: (t(`services.${svc.key}.features`, { returnObjects: true, defaultValue: [] }) as string[]) || [],
        slug: `/${svc.key}`,
        icon: (svc as any).icon || svc.key,
      });
    }
    return out;
  }, [t, maxCards]);

  // catalog (long-form blocks)
  let catalogRaw = t('catalog', { returnObjects: true });
  const catalog: CatalogBlock[] = Array.isArray(catalogRaw) ? catalogRaw : [];

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      try {
        // eslint-disable-next-line no-console
        console.debug('[ServicesSection] language=%s services=%o catalog=%o', i18n.language, services, catalog);
      } catch (err) {
        // ignore
      }
    }
  }, [i18n.language, services, catalog]);

  // motion (cast to any to avoid framer-motion typing friction in this file)
  const containerVariants: any = reduce ? {} : { visible: { transition: { staggerChildren: 0.12 } } };
  const cardVariants: any = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 44, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, type: 'spring', stiffness: 120, damping: 16 } },
      };

  // Nested accordion component: hooks must be used at component scope
  function CatalogAccordion({ catalog, isRTL, prefersReduced }: { catalog: CatalogBlock[]; isRTL: boolean; prefersReduced: boolean }) {
    const [openPanels, setOpenPanels] = useState<boolean[]>(() => catalog.map(() => false));
    const panelsRef = useRef<Array<HTMLDivElement | null>>([]);

    const togglePanel = useCallback((index: number) => {
      setOpenPanels((prev) => {
        const next = prev.slice();
        next[index] = !next[index];
        return next;
      });
    }, []);

    useLayoutEffect(() => {
      function updateHeights() {
        openPanels.forEach((isOpen, i) => {
          const el = panelsRef.current[i];
          if (!el) return;
          if (isOpen) el.style.maxHeight = `${el.scrollHeight}px`;
          else el.style.maxHeight = '0px';
        });
      }
      updateHeights();
      window.addEventListener('resize', updateHeights);
      return () => window.removeEventListener('resize', updateHeights);
    }, [openPanels, catalog.length]);

    const setPanelRef = (el: HTMLDivElement | null, i: number) => {
      if (!panelsRef.current) panelsRef.current = [];
      panelsRef.current[i] = el;
    };

    return (
      <>
        {catalog.map((blk, i) => {
          const btnId = `catalog-btn-${i}`;
          const panelId = `catalog-panel-${i}`;
          const isOpen = !!openPanels[i];

          return (
            <div key={`catalog-${i}`} className="rounded-2xl overflow-hidden border border-[color:var(--stroke)] bg-[color:var(--bg)]">
              <div className="p-0">
                <h4 className="m-0">
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => togglePanel(i)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        togglePanel(i);
                      }
                    }}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                    style={{ color: 'var(--fg)' }}
                  >
                    <span className={isRTL ? 'font-arabic text-lg font-semibold' : 'text-lg font-semibold'}>{blk.title}</span>
                    <span className="ml-4 flex-shrink-0" aria-hidden>
                      <svg className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </h4>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  ref={(el) => setPanelRef(el, i)}
                  className="px-6 overflow-hidden text-sm"
                  style={{
                    maxHeight: '0px',
                    transition: prefersReduced ? 'none' : 'max-height 320ms ease, opacity 240ms ease',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="py-4">
                    {blk.desc ? <p className="text-[color:var(--muted)] mb-3">{blk.desc}</p> : null}
                    {Array.isArray(blk.bullets) && blk.bullets.length > 0 && (
                      <ul className="list-inside list-disc space-y-2 text-[color:var(--fg)]">
                        {blk.bullets.map((b: string, idx: number) => (
                          <li key={idx} className={isRTL ? 'font-arabic' : undefined}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  // Render cards
  const cards = services.map((svc, i) => {
    const Icon = ICON_COMPONENTS[svc.icon || ''] || ICON_COMPONENTS.Curtains;
    return (
      <Motion.div key={`svc-${i}`} variants={cardVariants} className="w-full">
        <Card className="p-6 h-full">
          <Link href={svc.slug || '#'} className="no-underline text-[color:var(--fg)]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[color:var(--chip)] text-[color:var(--brand)]">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="m-0 text-lg font-semibold">{svc.title}</h3>
                {svc.desc ? <p className="mt-2 text-[color:var(--muted)]">{svc.desc}</p> : null}
              </div>
            </div>
          </Link>
        </Card>
      </Motion.div>
    );
  });

  return (
    <section id={id} className={className} aria-label={title}>
      <div className="container mx-auto py-12">
        <header className="mb-8">
          <p className="text-sm text-[color:var(--muted)]">{subtitle}</p>
          <h2 className="text-2xl font-bold mt-2">{title}</h2>
          {description ? <p className="mt-2 text-[color:var(--muted)]">{description}</p> : null}
        </header>

        <Motion.div initial="hidden" animate="visible" variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards}
        </Motion.div>

        {showCatalog && catalog && catalog.length > 0 && (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CatalogAccordion catalog={catalog} isRTL={isRTL} prefersReduced={!!reduce} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


