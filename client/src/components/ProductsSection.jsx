import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import createTT from "../lib/tt";
import { WA_URL, APP_BASE } from '../config';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-\u0600-\u06FF]/gi, "");
}

// simple reduced-motion hook
function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();
    try { mq.addEventListener("change", update); } catch { mq.addListener(update); }
    return () => {
      try { mq.removeEventListener("change", update); } catch { mq.removeListener(update); }
    };
  }, []);
  return reduced;
}

export default function ProductsSection({ heading: headingProp, description: descriptionProp }) {
  const { t, i18n } = useTranslation("products");
  const tt = createTT(t, 'products');
  const [, setLocation] = useLocation();
  const reduceMotion = useReducedMotionPref();
  const sectionRef = useRef(null);
  // ✅ correct RTL detection
  const isRTL = typeof i18n.dir === "function" ? i18n.dir() === "rtl" : String(i18n.dir).toLowerCase() === "rtl";
  const isAr = (i18n.resolvedLanguage || i18n.language || "").startsWith("ar");

  const [manifest, setManifest] = useState(null);
  const rawCats = t("categories", { returnObjects: true });
  const categories = Array.isArray(rawCats) ? rawCats : [];

  // Pause when section isn't visible or tab is hidden
  useEffect(() => {
    const onVis = () => setIsAutoScrollPaused(document.visibilityState !== "visible");
    document.addEventListener("visibilitychange", onVis);

    let io;
    if (sectionRef.current && typeof window !== "undefined" && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => setIsAutoScrollPaused((p) => (e.isIntersecting ? p : true))),
        { threshold: 0.1 }
      );
      io.observe(sectionRef.current);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  // Subcategory mappings for navigation
  const subcategoryMappings = {
    "supply-fabric-tailoring-services-for-curtains-more": {
      "American Curtains": "american-curtains",
      "Classic Curtains": "classic-curtains",
      "ستائر أمريكية": "american-curtains",
      "ستائر كلاسيك": "classic-curtains",
    },
    "roller-blinds-black-out-dim-out": {
      "Black Out Rollers": "black-out-rollers",
      "Dim Out Rollers": "dim-out-rollers",
      "Screen Rollers": "screen-rollers",
      "رولر بلاك أوت": "black-out-rollers",
      "رولر ديم أوت": "dim-out-rollers",
      "رولر شاشة": "screen-rollers",
    },
    "outdoor-solutions-skylights": {
      Awning: "awning",
      Pergulas: "pergulas",
      Skylight: "skylight",
      "Vertical Solutions": "vertical",
      "مظلات": "awning",
      "برجولات": "pergulas",
      "مناور": "skylight",
      "حلول عمودية": "vertical",
    },
    "floorings-acoustics": {
      "Acoustic Ceiling": "acoustic-ceiling",
      "Acoustic Panels": "acoustic-panels",
      "Floorings and Rugs": "floorings-and-rugs",
      "سقف صوتي": "acoustic-ceiling",
      "لوحات صوتية": "acoustic-panels",
      "أرضيات وسجاد": "floorings-and-rugs",
    },
  };

  const handleSubcategoryClick = (categoryFolder, subcategoryName) => {
    const mapping = subcategoryMappings[categoryFolder];
    const subcategoryId = mapping ? mapping[subcategoryName] : slugify(subcategoryName);
    setLocation(`/gallery/${categoryFolder}?subcategory=${subcategoryId}`);
  };

  const scrollRef = useRef(null);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  // Touch swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const cardWidth = 380; // px (approx card + gap)
  
  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  // Load manifest (optional)
  useEffect(() => {
    let mounted = true;
    fetch("/images/products/manifest.json")
      .then((res) => {
        if (!res.ok) throw new Error("no manifest");
        return res.json();
      })
      .then((data) => {
        if (mounted) setManifest(data);
      })
      .catch(() => {
        if (mounted) setManifest(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getCategoryImage = (item) => {
    // Prefer an explicit image set on the item (from JSON)
    if (item.image) return item.image;

    const slug = slugify(item.title || item.folderPath || 'product');
    
    // Then try manifest if available
    if (
      manifest &&
      item.folderPath &&
      manifest.folders &&
      manifest.folders[item.folderPath] &&
      manifest.folders[item.folderPath].length > 0
    ) {
      return manifest.folders[item.folderPath][0].path;
    }

    // Fallback to predictable slug-based filenames
    return `/images/products/${slug}.jpg`;
  };

  const scrollToDirection = useCallback((direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = cardWidth;

    // Normalize scroll to a 0..max range that represents visual left-to-right independent of RTL/LTR
    const getNormalized = (c) => {
      const physical = c.scrollLeft;
      const max = Math.max(0, c.scrollWidth - c.clientWidth);
      if (!isRTL) return { value: physical, max };
      // For many browsers, RTL scrollLeft is inverted; normalize to visual coordinate
      return { value: Math.round(max - physical), max };
    };
    const setNormalized = (c, normalized) => {
      const max = Math.max(0, c.scrollWidth - c.clientWidth);
      const clamped = Math.max(0, Math.min(normalized, max));
      if (!isRTL) c.scrollTo({ left: clamped, behavior: 'smooth' });
      else c.scrollTo({ left: Math.round(max - clamped), behavior: 'smooth' });
    };

    const { value: startNorm, max } = getNormalized(container);
    let targetNorm;
    if (direction === 'left') {
      targetNorm = startNorm - scrollAmount;
      if (startNorm <= 0) targetNorm = max; // wrap to end
    } else {
      targetNorm = startNorm + scrollAmount;
      if (startNorm >= max - 10) targetNorm = 0; // wrap to start
    }

    setNormalized(container, targetNorm);
  }, [isRTL, cardWidth]);

  // Immediate scroll helper (non-smooth) used by nav buttons to guarantee visible change
  const scrollToDirectionImmediate = useCallback((direction) => {
    const container = scrollRef.current;
    if (!container) return;
    
    // Compute visible card width + gap from first two children for accurate jumps
    let scrollAmount = cardWidth;
    try {
      const children = Array.from(container.children || []);
      if (children.length >= 1) {
        const r0 = children[0].getBoundingClientRect();
        if (children.length >= 2) {
          const r1 = children[1].getBoundingClientRect();
          const gap = Math.round(Math.abs(r1.left - r0.left) - r0.width);
          scrollAmount = Math.round(r0.width + Math.max(0, gap));
        } else {
          scrollAmount = Math.round(r0.width);
        }
      }
    } catch {
      /* fallback to constant */
    }
    
    // Simple approach: scroll by scrollAmount in the visual direction
    const currentScroll = container.scrollLeft;
    let newScroll;
    
    if (direction === 'left') {
      // Visual left: always decrease scrollLeft
      newScroll = currentScroll - scrollAmount;
    } else {
      // Visual right: always increase scrollLeft
      newScroll = currentScroll + scrollAmount;
    }
    
    container.scrollTo({ left: newScroll, behavior: 'smooth' });

  }, [isRTL, cardWidth]);
  
  // Touch swipe handlers
  const onTouchStart = useCallback((e) => {
    setTouchEnd(null); // Reset end position
    setTouchStart(e.targetTouches[0].clientX);
  }, []);
  
  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left = scroll right in LTR, scroll left in RTL
      scrollToDirectionImmediate(isRTL ? 'left' : 'right');
    }
    if (isRightSwipe) {
      // Swipe right = scroll left in LTR, scroll right in RTL
      scrollToDirectionImmediate(isRTL ? 'right' : 'left');
    }
  }, [touchStart, touchEnd, isRTL, scrollToDirectionImmediate, minSwipeDistance]);

  // Update active card on scroll — throttle with rAF and debounce resize to reduce work
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handlerCore = () => {
      const children = Array.from(container.children || []);
      const trackRect = container.getBoundingClientRect();
      const trackCenter = (trackRect.left + trackRect.right) / 2;
      let best = { idx: -1, dist: Infinity };
      children.forEach((c, idx) => {
        const r = c.getBoundingClientRect();
        const center = (r.left + r.right) / 2;
        const d = Math.abs(center - trackCenter);
        if (d < best.dist) best = { idx, dist: d };
      });
      children.forEach((c, idx) => c.setAttribute('data-active', idx === best.idx ? 'true' : 'false'));
    };

    // rAF throttle for scroll
    let rafId = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        handlerCore();
        rafId = null;
      });
    };

    // debounce for resize
    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => handlerCore(), 150);
    };

    // initial run
    handlerCore();
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Keyboard + focus visibility
  // Scope keyboard handlers to the carousel element to avoid global listeners
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        // ArrowLeft should move the visible viewport to the previous item
        scrollToDirection(isRTL ? "right" : "left");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        // ArrowRight should move the visible viewport to the next item
        scrollToDirection(isRTL ? "left" : "right");
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setIsAutoScrollPaused((p) => !p);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [scrollToDirection, isRTL]);

  // Auto-scroll (respects reduced motion)
  useEffect(() => {
    if (isAutoScrollPaused || reduceMotion) return;
    const interval = setInterval(() => {
      if (scrollRef.current && !isAutoScrollPaused) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollToDirection("right");
        }
      }
    }, 4000); // slightly longer interval to reduce frequent auto-scroll work
    return () => clearInterval(interval);
  }, [isAutoScrollPaused, reduceMotion, scrollToDirection]);

  // Wheel horizontal scrolling for trackpads (don't fight vertical scroll)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollLeft += e.deltaX;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Drag-to-scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
      setIsAutoScrollPaused(true);
    };
    const endDrag = () => {
      isDown = false;
      container.style.cursor = "grab";
      setTimeout(() => setIsAutoScrollPaused(false), 1000);
    };
    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", endDrag);
    container.addEventListener("mouseup", endDrag);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", endDrag);
      container.removeEventListener("mouseup", endDrag);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const prevLabel = tt('prev', { defaultValue: isAr ? "السابق" : "Previous" });
  const nextLabel = tt('next', { defaultValue: isAr ? "التالي" : "Next" });

  return (
    <section
      id="products"
      className="py-20 min-h-[40vh] relative surface"
      dir={isRTL ? "rtl" : "ltr"}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      aria-label={tt("sectionLabel", { defaultValue: isRTL ? "معرض المنتجات" : "Products carousel" })}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-wide text-primary">
          {headingProp || tt("heading")}
        </h2>
        <p className="text-center text-muted mb-12 max-w-2xl mx-auto">
          {descriptionProp || tt("description")}
        </p>

        <div className="relative">
          {/* Left nav */}
          <button
            type="button"
            data-test="products-prev"
            onClick={() => scrollToDirectionImmediate(isRTL ? "right" : "left")}
            className={`
              absolute ${isRTL ? "right-0" : "left-0"} top-1/2 -translate-y-1/2 z-20
              w-11 h-11 rounded-full flex items-center justify-center
              transition-all duration-300 ease-in-out
              opacity-100 translate-x-0
              bg-white/90 hover:bg-white shadow-lg hover:shadow-xl
              border border-gray-200 hover:border-gray-300
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              text-[color:var(--fg)]
            `}
            style={{
              width: "44px",
              height: "44px",
              [isRTL ? "right" : "left"]: "8px",
              background: "var(--card)",
              border: "1px solid var(--stroke)",
            }}
            aria-label={prevLabel}
            title={prevLabel}
          >
            {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>

          {/* Right nav */}
          <button
            type="button"
            data-test="products-next"
            onClick={() => scrollToDirectionImmediate(isRTL ? "left" : "right")}
            className={`
              absolute ${isRTL ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 z-20
              w-11 h-11 rounded-full flex items-center justify-center
              transition-all duration-300 ease-in-out
              opacity-100 translate-x-0
              bg-white/90 hover:bg-white shadow-lg hover:shadow-xl
              border border-gray-200 hover:border-gray-300
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              text-[color:var(--fg)]
            `}
            style={{
              width: "44px",
              height: "44px",
              [isRTL ? "left" : "right"]: "8px",
              background: "var(--card)",
              border: "1px solid var(--stroke)",
            }}
            aria-label={nextLabel}
            title={nextLabel}
          >
            {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>

          {/* Scroller */}
          <div
            ref={scrollRef}
            id="products-track"
            aria-keyshortcuts="ArrowLeft ArrowRight Space"
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory px-2 pb-8 scrollbar-hide cursor-grab focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none", direction: isRTL ? 'rtl' : 'ltr' }}
            onMouseEnter={() => setIsAutoScrollPaused(true)}
            onMouseLeave={() => setIsAutoScrollPaused(false)}
            onFocus={() => setShowControls(true)}
            onBlur={() => setTimeout(() => setShowControls(false), 200)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-live="off"
          >
            {categories.map((item, i) => {
              const folder = item.folderPath || slugify(item.title);
              const goToGallery = () => setLocation(`/gallery/${folder}`);
              return (
                // ✅ No nested interactive inside <a>. Use article with link-like behaviour.
                <article
                  key={i}
                  className="block snap-start min-w-[300px] md:min-w-[360px] lg:min-w-[420px] h-[540px] md:h-[640px] flex-shrink-0"
                >
                  <motion.div
                    className="relative h-full overflow-hidden rounded-xl shadow-lg group cursor-pointer surface-elevated transition-all duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.6, ease: "easeOut" }}
                    whileHover={reduceMotion ? {} : { y: -4, rotateX: 2, rotateY: -2 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    role="link"
                    tabIndex={0}
                    aria-label={`${item.title} — ${item.brief}`}
                    onClick={goToGallery}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goToGallery();
                      }
                    }}
                  >
                    {/* Product image */}
                    <img
                      src={getCategoryImage(item) || '/images/placeholder-product.svg'}
                      alt={item.title || 'Product'}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0 rounded-xl"
                      onError={(e) => {
                        try {
                          if (e && e.currentTarget) e.currentTarget.src = '/images/placeholder-product.svg';
                        } catch { /* ignore */ }
                      }}
                    />

                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-500 z-[1] pointer-events-none" />

                    {/* Glossy reflection sweep */}
                    <div
                      className="absolute -top-1/2 left-[-60%] w-[140%] h-[200%] rotate-12 opacity-0 group-hover:opacity-15 transition-opacity duration-500 z-[2] pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                        mixBlendMode: 'screen'
                      }}
                      aria-hidden="true"
                    />

                    {/* Vertical title for all languages */}
                    <div className={`absolute ${isRTL ? "right-6" : "left-6"} top-1/2 -translate-y-1/2 z-[2] group-hover:opacity-0 transition-opacity duration-500`}>
                      <h3
                        className="text-white text-lg md:text-xl font-bold uppercase tracking-[0.1em]"
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: isRTL ? "rotate(0deg)" : "rotate(180deg)",
                          textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
                          fontFamily: isRTL ? '"Cairo", "Tajawal", "IBM Plex Sans Arabic", system-ui, sans-serif' : undefined
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Hover panel */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end z-[3] pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                      <h3 className="text-2xl font-semibold text-white uppercase mb-4 drop-shadow">
                        {item.title}
                      </h3>

                      <p className="mb-4 text-white/95 font-medium line-clamp-3">
                        {item.brief}
                      </p>

                      {item.sub && item.sub.length > 0 && (
                        <ul role="list" className="text-sm text-gray-200 space-y-2 mb-6 max-h-[120px] overflow-y-auto pr-2">
                          {item.sub.map((subItem, idx) => (
                            <li
                              key={idx}
                              className={`${isAr ? "pr-3 border-r-2 border-primary dark:border-accent" : "pl-3 border-l-2 border-primary dark:border-accent"} cursor-pointer hover:text-white transition-colors`}
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubcategoryClick(folder, subItem);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSubcategoryClick(folder, subItem);
                                }
                              }}
                            >
                              {subItem}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className={`flex gap-2 ${isRTL ? "justify-end" : ""}`}>
                        {/* Use Link for gallery navigation to avoid nested button-in-link */}
                        <Link
                          to={`/gallery/${folder}`}
                          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isRTL ? "عرض المعرض" : "View Gallery"}
                        </Link>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const origin = APP_BASE || (typeof window !== 'undefined' ? window.location.origin : '');
                            const message = `Hello Abdulhaq Dimensions, I'm interested in:\n• Product: ${item.title}\n• SKU/Ref: -\n• URL: ${origin}/gallery/${folder}`;
                            window.open(
                              WA_URL(message),
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="text-center text-sm text-gray-400 mt-4">
          <p className={isRTL ? "font-arabic" : ""}>
            {isRTL
              ? "استخدم مفاتيح الأسهم ← → للتنقل • زر المسافة لإيقاف/تشغيل التمرير التلقائي"
              : "Use ← → to navigate • Space to toggle auto-scroll • Infinite loop enabled"}
          </p>
        </div>
      </div>
    </section>
  );
}
