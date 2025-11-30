import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Search,
} from 'lucide-react';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  createImageErrorHandler,
  generateAltText,
} from '../utils/imageUtils';
// SmartClientLogo and Swiper were previously used; the section now relies on native scrolling.

/* ------------------------------
   Helpers: color + debounce
------------------------------ */
function stringToHue(input = '') {
  let h = 0;
  const s = String(input);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}
const hsla = (h, s = 70, l = 50, a = 1) => `hsla(${h} ${s}% ${l}% / ${a})`;

function useDebouncedValue(value, delay = 220) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

/* ------------------------------
   Categories (keys are canonical)
------------------------------ */
const CLIENT_CATEGORIES = {
  hospitality: [
    'Royal Court',
    'Amman Rotana',
    'Kempinski Hotel',
    'St. Regis Amman',
    'Le Royal Hotel',
    'Hilton Amman',
    'Crowne Plaza',
    'Sheraton Hotel',
    'Four Seasons',
  ],
  corporate: [
    'The Housing Bank',
    'Orange Jordan',
    'Jordan Kuwait Bank',
    'Zain Jordan',
    'JBC',
    'Arab Bank',
    'Taj Mall',
  ],
  government: [
    'Jordan Hospital',
    'King Abdullah Mosque',
    'Landmark Amman',
    'Ayla Oasis',
  ],
};

export default function ClientsSection() {
  const { t, i18n } = useTranslation('clients');

  const isRTL =
    typeof i18n.dir === 'function'
      ? i18n.dir() === 'rtl'
      : (i18n.language || '').toLowerCase().startsWith('ar');

  const reduceMotion = useReducedMotion();
  const allClients = useMemo(
    () => t('clients', { returnObjects: true }) || [],
    [t]
  );
  const clients = useMemo(
    () => (Array.isArray(allClients) ? allClients : []),
    [allClients]
  );

  const [visibleLogos, setVisibleLogos] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDragging, setIsDragging] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 220);

  const containerRef = useRef(null);
  const touchStartX = useRef(null);

  /* Responsive breakpoints */
  useEffect(() => {
    const update = () => {
      const w =
        typeof window !== 'undefined' ? window.innerWidth : 1280;
      if (w < 480) setVisibleLogos(2);
      else if (w < 640) setVisibleLogos(3);
      else if (w < 768) setVisibleLogos(4);
      else if (w < 1024) setVisibleLogos(5);
      else if (w < 1280) setVisibleLogos(6);
      else setVisibleLogos(7);
    };
    update();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
  }, []);

  /* Filter by category and search */
  const filteredClients = useMemo(() => {
    let list = clients;
    if (selectedCategory !== 'all') {
      const names = CLIENT_CATEGORIES[selectedCategory] || [];
      list = list.filter((c) => names.includes(c.name));
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [clients, selectedCategory, debouncedSearch]);

  /* Compute item width */
  const computeItemWidth = useCallback(() => {
    try {
      const container = containerRef.current;
      if (!container) return 300;
      const first = container.querySelector(':scope > *');
      if (!first) return 300;
      const rect = first.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(container).gap) || 0;
      return rect.width + gap;
    } catch {
      return 300;
    }
  }, []);

  /* Sync scroll position with current index */
  const onScrollSync = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = computeItemWidth();
    const idx = Math.round(el.scrollLeft / w);
    setCurrentIndex(idx);
  }, [computeItemWidth]);

  /* Scroll to a specific index */
  const scrollTo = useCallback(
    (idx) => {
      const el = containerRef.current;
      if (!el) return;
      const itemW = computeItemWidth();
      el.scrollTo({
        left: Math.max(0, idx * itemW),
        behavior: 'smooth',
      });
      setCurrentIndex(idx);
    },
    [computeItemWidth]
  );

  /* Previous / Next functions */
  const prev = useCallback(() => {
    const last = Math.max(0, filteredClients.length - visibleLogos);
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : last;
    scrollTo(nextIdx);
  }, [currentIndex, visibleLogos, scrollTo, filteredClients.length]);
  

  const next = useCallback(() => {
    const last = Math.max(0, filteredClients.length - visibleLogos);
    const nxt = currentIndex >= last ? 0 : currentIndex + 1;
    scrollTo(nxt);
  }, [currentIndex, visibleLogos, scrollTo, filteredClients.length]);

  const togglePlay = useCallback(
    () => setIsAutoPlaying((p) => !p),
    []
  );

  /* Touch / Drag */
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsDragging(true);
  }, []);
  const handleTouchMove = useCallback(() => {}, []);
  const handleTouchEnd = useCallback(
    (e) => {
      const start = touchStartX.current;
      if (!start) return setIsDragging(false);
      const end = e.changedTouches?.[0]?.clientX ?? start;
      const delta = start - end;
      if (Math.abs(delta) > 50) {
        if (delta > 0) (isRTL ? prev : next)();
        else (isRTL ? next : prev)();
      }
      setIsDragging(false);
      touchStartX.current = null;
    },
    [isRTL, next, prev]
  );

  /* Keyboard control */
  const onKeyDown = useCallback(
    (e) => {
      const interactive = e.target.closest(
        'input,textarea,select,button,a,[contenteditable]'
      );
      if (interactive) return;
      if (e.key === 'ArrowLeft') (isRTL ? next : prev)();
      if (e.key === 'ArrowRight') (isRTL ? prev : next)();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    },
    [isRTL, next, prev, togglePlay]
  );

  /* Autoplay */
  useEffect(() => {
    if (
      !isAutoPlaying ||
      isPaused ||
      reduceMotion ||
      filteredClients.length === 0
    )
      return;
    const iv = setInterval(next, 3500);
    return () => clearInterval(iv);
  }, [isAutoPlaying, isPaused, reduceMotion, next, filteredClients.length]);

  /* Reduce motion: fallback to grid */
  if (reduceMotion) {
    return (
      <section
        id="clients"
        className="py-20 relative"
        style={{ background: 'var(--bg)' }}
        dir={isRTL ? 'rtl' : 'ltr'}
        aria-labelledby="clients-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              id="clients-heading"
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--fg)' }}
            >
              {t('heading')}
            </h2>
            <p
              id="clients-description"
              className="max-w-2xl mx-auto"
              style={{ color: 'var(--muted)' }}
            >
              {t('subheading')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredClients.map((client, idx) => {
              const hue = stringToHue(client.name || idx);
              return (
                <div
                  key={`${client.name}-${idx}`}
                  className="card flex items-center justify-center p-6 h-32"
                  style={{
                    background: `linear-gradient(135deg, ${hsla(
                      hue,
                      70,
                      55,
                      0.12
                    )}, ${hsla((hue + 40) % 360, 70, 45, 0.12)})`,
                    border: `1px solid ${hsla(hue, 75, 45, 0.35)}`,
                    borderRadius: 16,
                  }}
                >
                  <img
                    src={client.logo}
                    alt={generateAltText(client.name, 'client')}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={createImageErrorHandler('client')}
                    style={{
                      filter: 'saturate(1.06) contrast(1.03)',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  /* Carousel version */
  return (
    <section
      id="clients"
      className="py-20 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
      dir={isRTL ? 'rtl' : 'ltr'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-labelledby="clients-heading"
      aria-describedby="clients-description"
    >
      {/* Live region for autoplay announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isAutoPlaying ? t('sliderHeading') : t('pause')}
      </div>

      <div className="container mx-auto px-4">
        {/* Heading & Subheading */}
        <div className="text-center mb-12">
          <h2
            id="clients-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--fg)' }}
          >
            {t('heading')}
          </h2>
          <p
            id="clients-description"
            className="max-w-2xl mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            {t('subheading')}
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="flex gap-3 px-4">
            {['all', 'hospitality', 'corporate', 'government'].map((key) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedCategory(key);
                  setCurrentIndex(0);
                  scrollTo(0);
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-medium ${
                  selectedCategory === key
                    ? 'text-white shadow-lg'
                    : 'hover:shadow-md'
                }`}
                style={{
                  background:
                    selectedCategory === key ? 'var(--brand)' : 'var(--chip)',
                  color:
                    selectedCategory === key ? 'white' : 'var(--fg)',
                  border: `1px solid ${
                    selectedCategory === key
                      ? 'var(--brand)'
                      : 'var(--stroke)'
                  }`,
                }}
                aria-pressed={selectedCategory === key}
              >
                {t(`categories.${key}`, key)}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          {/* Search input */}
          <div className="relative w-full sm:w-auto">
            <Search
              aria-hidden="true"
              className={`absolute ${
                isRTL ? 'right-3' : 'left-3'
              } top-1/2 -translate-y-1/2 w-4 h-4`}
              style={{ color: 'var(--muted)' }}
            />
            <input
              type="text"
              placeholder={t('searchClients', 'Search clients...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-${isRTL ? '4' : '10'} pr-${
                isRTL ? '10' : '4'
              } py-2 border rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--stroke)',
                color: 'var(--fg)',
              }}
              aria-label={t('searchClients', 'Search clients')}
            />
          </div>

          {/* Play/Pause + Arrows */}
          <div
            className="flex items-center gap-2"
            role="group"
            aria-label={t('sliderHeading')}
          >
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:scale-105 active:scale-95"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--stroke)',
                color: 'var(--fg)',
              }}
              aria-pressed={isAutoPlaying}
              aria-label={isAutoPlaying ? t('pause') : t('play')}
            >
              <AnimatePresence mode="wait">
                <Motion.div
                  key={isAutoPlaying ? 'pause' : 'play'}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  {isAutoPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Motion.div>
              </AnimatePresence>
              <span className="font-medium">
                {isAutoPlaying ? t('pause') : t('play')}
              </span>
            </button>

            {/* Prev */}
            <button
              onClick={prev}
              className="p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:scale-110 active:scale-95"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--stroke)',
                color: 'var(--fg)',
                width: '44px',
                height: '44px',
              }}
              aria-label={isRTL ? t('next') : t('previous')}
              disabled={filteredClients.length === 0}
            >
              <ChevronLeft
                className={`w-5 h-5 ${
                  isRTL ? 'transform -scale-x-100' : ''
                }`}
              />
            </button>

            {/* Next */}
            <button
              onClick={next}
              className="p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:scale-110 active:scale-95"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--stroke)',
                color: 'var(--fg)',
                width: '44px',
                height: '44px',
              }}
              aria-label={isRTL ? t('previous') : t('next')}
              disabled={filteredClients.length === 0}
            >
              <ChevronRight
                className={`w-5 h-5 ${
                  isRTL ? 'transform -scale-x-100' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={containerRef}
          className={`flex gap-6 overflow-x-auto scroll-smooth py-8 px-4 pb-6 scrollbar-hide ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          role="region"
          aria-roledescription="carousel"
          aria-label={t('sliderHeading')}
          aria-live="polite"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onScroll={onScrollSync}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            touchAction: 'pan-x',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {filteredClients.length === 0 ? (
            <Motion.div
              className="flex flex-col justify-center items-center min-h-[200px] text-center w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Search
                aria-hidden="true"
                className="w-12 h-12 mb-4"
                style={{ color: 'var(--muted)' }}
              />
              <p className="text-lg" style={{ color: 'var(--muted)' }}>
                {debouncedSearch
                  ? t('noSearchResults', 'No clients found matching your search')
                  : t('noClients')}
              </p>
            </Motion.div>
          ) : (
            filteredClients.map((client, idx) => {
              const hue = stringToHue(client.name || idx);
              const hue2 = (hue + 40) % 360;
              const accentBg = `linear-gradient(135deg, ${hsla(
                hue,
                70,
                55,
                0.16
              )}, ${hsla(hue2, 70, 45, 0.16)})`;
              const accentBorder = `1px solid ${hsla(hue, 75, 45, 0.35)}`;
              const focusRing = `0 0 0 3px ${hsla(
                hue,
                85,
                50,
                0.45
              )}`;

              return (
                <Motion.div
                  key={`${client.name}-${idx}`}
                  className="min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px] h-[120px] sm:h-[110px] md:h-[120px] flex items-center justify-center flex-shrink-0"
                  whileHover={{
                    y: -6,
                    scale: 1.08,
                    transition: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 17,
                    },
                  }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.06,
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 280,
                  }}
                >
                  <div
                    className="w-full h-full overflow-hidden p-2 sm:p-3 md:p-4 transition-all duration-500 cursor-pointer flex items-center justify-center rounded-2xl"
                    style={{
                      background: accentBg,
                      border: accentBorder,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    {client.url ? (
                      <a
                        href={client.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${client.name} - ${t(
                          'visitWebsite'
                        )}`}
                        className="w-full h-full flex items-center justify-center rounded-2xl focus:outline-none"
                        onFocus={(e) =>
                          (e.currentTarget.style.boxShadow = focusRing)
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.boxShadow = 'none')
                        }
                      >
                        <Motion.img
                          src={client.logo}
                          alt={generateAltText(client.name, 'client')}
                          className="w-auto max-h-full max-w-full transition-all duration-500"
                          loading="lazy"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onError={createImageErrorHandler('client')}
                          draggable={false}
                          style={{
                            objectFit: 'contain',
                            maxHeight: '96px',
                            maxWidth: '100%',
                            filter: 'saturate(1.08) contrast(1.04)',
                          }}
                        />
                      </a>
                    ) : (
                      <Motion.img
                        src={client.logo}
                        alt={generateAltText(client.name, 'client')}
                        className="w-auto max-h-full max-w-full transition-all duration-500"
                        loading="lazy"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onError={createImageErrorHandler('client')}
                        draggable={false}
                        style={{
                          objectFit: 'contain',
                          maxHeight: '96px',
                          maxWidth: '100%',
                          filter: 'saturate(1.08) contrast(1.04)',
                        }}
                      />
                    )}
                  </div>
                </Motion.div>
              );
            })
          )}
        </div>

        {/* Dots / page indicators */}
        {filteredClients.length > visibleLogos && (
          <div
            className="flex justify-center mt-8 gap-3"
            role="tablist"
            aria-label={t('sliderHeading')}
          >
            {Array.from(
              { length: Math.ceil(filteredClients.length / visibleLogos) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i * visibleLogos)}
                  className={`w-3 h-3 rounded-full transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:scale-125 ${
                    Math.floor(currentIndex / visibleLogos) === i
                      ? 'scale-125 shadow-md'
                      : 'hover:opacity-70'
                  }`}
                  style={{
                    background:
                      Math.floor(currentIndex / visibleLogos) === i
                        ? 'var(--brand)'
                        : 'var(--stroke)',
                    boxShadow:
                      Math.floor(currentIndex / visibleLogos) === i
                        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                        : 'none',
                  }}
                  aria-label={`${t('goToSlide')} ${i + 1}`}
                  aria-selected={
                    Math.floor(currentIndex / visibleLogos) === i
                  }
                  role="tab"
                />
              )
            )}
          </div>
        )}

        {/* Keyboard hints */}
        <div
          className="text-center mt-4 text-sm opacity-75"
          aria-hidden="true"
          style={{ color: 'var(--muted)' }}
        >
          <kbd
            className="px-2 py-1 rounded text-xs mx-1"
            style={{ background: 'var(--chip)' }}
          >
            ←→
          </kbd>
          <span className="mx-2">
            {t('keyboardHint', 'Use arrow keys to navigate')}
          </span>
          <kbd
            className="px-2 py-1 rounded text-xs mx-1"
            style={{ background: 'var(--chip)' }}
          >
            Space
          </kbd>
        </div>
      </div>
    </section>
  );
}
