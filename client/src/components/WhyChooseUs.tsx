import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ShieldCheck, Award, ThumbsUp, Clock, Wrench, Sparkles, Users, Leaf, type LucideIcon,
} from 'lucide-react';

type WhyItem = { icon?: string; title: string; desc?: string };

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck, Award, ThumbsUp, Clock, Wrench, Sparkles, Users, Leaf,
};

const AR_RE = /[\u0600-\u06FF]/;        // Arabic range
const LATIN_RE = /[A-Za-z]/;            // Latin letters

// Hard Arabic fallbacks (no English possible)
const AR_FALLBACK: WhyItem[] = [
  { icon: 'ShieldCheck', title: 'جودة معتمدة',       desc: 'خامات ممتازة وفحص جودة صارم لكل طلب.' },
  { icon: 'Clock',       title: 'التزام بالمواعيد',  desc: 'مواعيد دقيقة مع تحديثات استباقية.' },
  { icon: 'Wrench',      title: 'حِرَفية خبيرة',     desc: 'فريق ذو خبرة بلمسات تشطيب دقيقة.' },
  { icon: 'ThumbsUp',    title: 'خدمة مميزة',        desc: 'تواصل واضح ودعم ما بعد البيع.' },
];

// English fallbacks (only for LTR)
const EN_FALLBACK: WhyItem[] = [
  { icon: 'ShieldCheck', title: 'Certified Quality',   desc: 'Premium materials and strict QA on every order.' },
  { icon: 'Clock',       title: 'On-Time Delivery',    desc: 'Reliable lead times with proactive updates.' },
  { icon: 'Wrench',      title: 'Expert Craftsmanship',desc: 'Experienced team with meticulous finish.' },
  { icon: 'ThumbsUp',    title: 'Great Service',       desc: 'Clear communication and after-sales support.' },
];

function iconFor(name?: string): LucideIcon {
  if (!name) return Sparkles;
  const key = name.replace(/[-_\s]+/g, '').toLowerCase();
  const hit = Object.entries(ICONS).find(([k]) => k.replace(/[-_\s]+/g, '').toLowerCase() === key);
  return (hit?.[1] as LucideIcon) || Sparkles;
}

/** Strict resource read (no cross-locale fallback) */
function getRes<T>(i18n: any, ns: string, key: string): T | undefined {
  const raw = (i18n.resolvedLanguage || i18n.language || '').toLowerCase();
  const full = raw;
  const base = raw.split('-')[0] || raw;
  return (
    (i18n.getResource(full, ns, key) as T | undefined) ??
    (i18n.getResource(base, ns, key) as T | undefined)
  );
}

/** If page is AR/RTL and the text looks Latin, replace with Arabic fallback contents. */
function forceArabicIfRTL(isAR: boolean, items: WhyItem[]): WhyItem[] {
  if (!isAR) return items;
  // If any item has Latin letters (title or desc), we consider the whole set contaminated.
  const hasLatin = items.some(it => LATIN_RE.test(it?.title || '') || LATIN_RE.test(it?.desc || ''));
  return hasLatin ? AR_FALLBACK : items;
}

export default function WhyChooseUs() {
  const { t: tAbout, i18n } = useTranslation('about', { useSuspense: false });
  const { t: tHome } = useTranslation('home', { useSuspense: false });
  const reduce = useReducedMotion();

  // State to hold loaded Arabic resources (if needed)
  const [loadedArabicAbout, setLoadedArabicAbout] = useState<any>(null);
  const [loadedArabicHome, setLoadedArabicHome] = useState<any>(null);

  // Locale flags (robust: prefer i18n.dir(), otherwise derive from language)
  const dir = (typeof i18n.dir === 'function' ? i18n.dir() : undefined) || (i18n?.language ? (i18n.language.slice(0,2).toLowerCase() === 'ar' ? 'rtl' : 'ltr') : undefined);
  const isRTL = dir === 'rtl';
  const lng = (i18n.language || '').toLowerCase();
  const isAR = isRTL || lng.startsWith('ar');
  const lang = i18n?.language || undefined;

  // Effect: if page is Arabic and i18n hasn't loaded Arabic resources, fetch them directly
  useEffect(() => {
    if (!isAR) return;
    
    const aboutResource = i18n.getResource('ar', 'about', 'why.items');
    const homeResource = i18n.getResource('ar', 'home', 'features.items');
    
    // If both are already loaded, no need to fetch
    if (aboutResource && homeResource) return;

    // Fetch missing resources
    const fetchAbout = !aboutResource 
      ? fetch('/locales/ar/about.json').then(r => r.ok ? r.json() : null).catch(() => null)
      : Promise.resolve(null);
    
    const fetchHome = !homeResource
      ? fetch('/locales/ar/home.json').then(r => r.ok ? r.json() : null).catch(() => null)
      : Promise.resolve(null);

    Promise.all([fetchAbout, fetchHome]).then(([aboutData, homeData]) => {
      if (aboutData) setLoadedArabicAbout(aboutData);
      if (homeData) setLoadedArabicHome(homeData);
    });
  }, [isAR, i18n]);

  // Headings (Arabic first when AR)
  const HEADING_AR = 'لماذا تختار عبد الحق ديمينشنز؟';
  const TEXT_AR =
    'لأننا لا نقدم مجرد ستائر، بل نصمم تجارب بصرية وملمسية تضيف هوية وروح لكل مساحة، مع التزام كامل بالجودة، التفاصيل، والابتكار.';
  const HEADING_EN = 'Why Choose Abdulhaq Dimensions?';
  const TEXT_EN =
    'We don\'t just deliver curtains — we craft visual and tactile experiences with full commitment to quality, detail, and innovation.';

  const headingStrict = getRes<string>(i18n, 'about', 'why_heading') || loadedArabicAbout?.why_heading;
  const textStrict    = getRes<string>(i18n, 'about', 'why_text') || loadedArabicAbout?.why_text;

  const heading = headingStrict ?? (isAR ? HEADING_AR : tHome('features.why_heading', { defaultValue: HEADING_EN }));
  const text    = textStrict    ?? (isAR ? TEXT_AR    : tHome('features.why_text',    { defaultValue: TEXT_EN   }));

  // Items (read strictly, or use fetched data if i18n hasn't loaded them)
  let itemsAbout: WhyItem[] = [];
  let itemsHome: WhyItem[] = [];

  if (isAR) {
    // Try i18n first, then fall back to fetched data
    itemsAbout = (i18n.getResource('ar', 'about', 'why.items') as WhyItem[] | undefined) 
      || loadedArabicAbout?.why?.items 
      || [];
    itemsHome = (i18n.getResource('ar', 'home', 'features.items') as WhyItem[] | undefined)
      || loadedArabicHome?.features?.items
      || [];
  } else {
    itemsAbout = getRes<WhyItem[]>(i18n, 'about', 'why.items') ?? [];
    itemsHome = getRes<WhyItem[]>(i18n, 'home', 'features.items') ?? [];
  }

  let items: WhyItem[] = itemsAbout.length ? itemsAbout : (itemsHome.length ? itemsHome : (isAR ? AR_FALLBACK : EN_FALLBACK));

  // FINAL GUARD: if AR/RTL but any Latin text leaked, swap to pure Arabic fallbacks
  items = forceArabicIfRTL(isAR, items);

  // DEV debugging: log i18n / html / storage values and which source we used
  try {
    const DEV = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined' && import.meta.env.DEV;
    if (DEV) {
      const htmlLang = typeof document !== 'undefined' ? document.documentElement.lang : undefined;
      const htmlDir = typeof document !== 'undefined' ? document.documentElement.dir : undefined;
      const storedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : undefined;
      const storedI18 = typeof localStorage !== 'undefined' ? localStorage.getItem('i18nextLng') : undefined;
      const source = itemsAbout.length ? 'about' : itemsHome.length ? 'home' : (isAR ? 'ar-fallback' : 'en-fallback');
      // eslint-disable-next-line no-console
      console.debug('[WhyChooseUs] i18n debug', {
        language: i18n?.language,
        resolvedLanguage: i18n?.resolvedLanguage,
        dir: typeof i18n?.dir === 'function' ? i18n.dir() : undefined,
        htmlLang,
        htmlDir,
        storedLang,
        storedI18,
        isAR,
        itemsCount: items.length,
        itemsSource: source,
        loadedArabicAbout: !!loadedArabicAbout,
        loadedArabicHome: !!loadedArabicHome,
      });
    }
  } catch (e) { void e; }

  // If someone accidentally put Arabic heading but English items in JSON, fix per-item too:
  if (isAR) {
    items = items.map(it => {
      const titleBad = it.title && LATIN_RE.test(it.title) && !AR_RE.test(it.title);
      const descBad  = it.desc  && LATIN_RE.test(it.desc)  && !AR_RE.test(it.desc);
      if (!titleBad && !descBad) return it;
      // Replace with matched Arabic fallback by icon (or position if not found)
      const byIcon = AR_FALLBACK.find(f => (f.icon || '').toLowerCase() === (it.icon || '').toLowerCase());
      return byIcon || AR_FALLBACK[0];
    });
  }

  if (!heading && !text && items.length === 0) return null;

  // Motion (typed variants for compatibility)
  const container: Variants = { hidden: {}, show: reduce ? {} : { transition: { staggerChildren: 0.1 } } };
  const card: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 22, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, stiffness: 140, damping: 18 } } };

  const IconBadge = useMemo(
    () =>
      function IconBadgeInner({ name }: { name?: string }) {
        const Ico = iconFor(name);
        return (
          <div
            className="inline-grid place-items-center w-14 h-14 rounded-full bg-[var(--chip)]/90 border border-[color:var(--stroke)] shadow-sm"
            aria-hidden="true"
          >
            <Ico className="w-7 h-7 text-[color:var(--brand)]" aria-hidden="true" />
          </div>
        );
      },
    []
  );

  return (
    <section
      id="why-choose-us"
      className="py-16 md:py-20 bg-[var(--bg)] relative "
      dir={dir}
      lang={lang}
      aria-labelledby="why-choose-us-heading"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content={heading || (isAR ? 'لماذا تختارنا' : 'Why choose us')} />
      <div className="container mx-auto px-4">
        {(heading || text) && (
          <div className={isRTL ? 'max-w-3xl mx-auto mb-10 text-center font-arabic' : 'max-w-3xl mx-auto mb-10 text-center'}>
            {heading && (
              <h2 id="why-choose-us-heading" className="text-3xl md:text-4xl font-bold text-[color:var(--fg)]">
                {heading}
              </h2>
            )}
            {text && <p className="mt-4 text-lg text-[color:var(--muted)]">{text}</p>}
          </div>
        )}

        <motion.div
          role="list"
          aria-label={heading || (isAR ? 'لماذا تختارنا' : 'Why choose us')}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.28 }}
          variants={container}
        >
          {items.map((it, i) => {
            const titleId = `why-choose-us-item-${i}-title`;
            const descId  = `why-choose-us-item-${i}-desc`;
            return (
              <motion.article
                key={`${it.title}-${i}`}
                role="listitem"
                aria-labelledby={titleId}
                aria-describedby={it.desc ? descId : undefined}
                tabIndex={0}
                variants={card}
                className="rounded-2xl p-6 bg-[var(--card)] border border-[color:var(--stroke)]
                           shadow-[0_6px_24px_rgba(2,12,14,.08)]
                           hover:shadow-[0_10px_28px_rgba(2,12,14,.12)]
                           transition-shadow duration-300
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                style={{ opacity: 1 }}
              >
                <meta itemProp="position" content={String(i + 1)} />
                <div itemScope itemType="https://schema.org/Thing">
                  <div className="inline-grid place-items-center w-14 h-14 rounded-full
                       bg-[var(--chip)]/90 border border-[color:var(--stroke)]
                       shadow-sm" aria-hidden="true">
                    {React.createElement(iconFor(it.icon), {
                      className: 'w-7 h-7 text-[color:var(--brand)]',
                      'aria-hidden': true
                    })}
                  </div>

                  <h3 id={titleId} className={`mt-4 text-xl font-semibold text-[color:var(--fg)] ${isRTL ? 'font-arabic' : ''}`} itemProp="name">
                    {it.title}
                  </h3>

                  {it.desc && (
                    <p id={descId} className={`mt-2 text-[color:var(--muted)] leading-relaxed ${isRTL ? 'font-arabic' : ''}`} itemProp="description">
                      {it.desc}
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
