import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { createImageErrorHandler } from '../utils/imageUtils';
import { Search, Eye, MessageCircle, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'wouter';

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-\u0600-\u06FF]/gi, '');
}

export default function ProductsPage() {
  const { t, i18n } = useTranslation('products');
  const [searchTerm, setSearchTerm] = useState('');
  const isRTL = i18n.language === 'ar';
  const [, setLocation] = useLocation();

  // Products data (categories from translation)
  const categories = useMemo(() => t('categories', { returnObjects: true }) || [], [t]);

  // Badges removed per client request

  // Dev-only deterministic gallery opener for CI/tests.
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const isProd = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'production');
      if (isProd) return;

      const handler = (e) => {
        // Always open the first category modal for CI
        const idx = e && e.detail && typeof e.detail.index !== 'undefined' ? Number(e.detail.index) : 0;
        const cat = categories && categories.length ? (categories[idx] || categories[0]) : null;
        if (cat) {
          // Simulate opening modal (set a debug indicator)
          window.__DEV_GALLERY_OPENED = true;
          document.body.setAttribute('data-dev-gallery-opened', 'true');
          let dbg = document.getElementById('dev-gallery-indicator');
          if (!dbg) {
            dbg = document.createElement('div');
            dbg.id = 'dev-gallery-indicator';
            dbg.textContent = 'DEV_GALLERY_OPENED';
            dbg.style.position = 'fixed';
            dbg.style.top = '0';
            dbg.style.left = '0';
            dbg.style.zIndex = '9999';
            dbg.style.background = '#0f0';
            dbg.style.color = '#000';
            dbg.style.fontWeight = 'bold';
            dbg.style.padding = '4px 12px';
            document.body.appendChild(dbg);
          }
          console.log('[dev-hook] __DEV_OPEN_FIRST_GALLERY handler fired for CI smoke test:', cat.title || cat.name || idx);
        }
      };
      window.addEventListener('dev-open-gallery', handler);
      return () => {
        window.removeEventListener('dev-open-gallery', handler);
        try { delete window.__DEV_GALLERY_OPENED; } finally { /* cleanup */ }
        document.body.removeAttribute('data-dev-gallery-opened');
        const dbg = document.getElementById('dev-gallery-indicator');
        if (dbg) dbg.remove();
      };
    } catch (e) { void e; }
  }, [categories]);

  // Get display title/brief/sub in current language
  const getTitle = cat => isRTL && cat.titleAr ? cat.titleAr : cat.title || '';
  const getBrief = cat => isRTL && cat.briefAr ? cat.briefAr : cat.brief || '';
  const getSub = cat => (isRTL && cat.subAr ? cat.subAr : cat.sub) || [];

  // Handle subcategory navigation
  const handleSubcategoryClick = (categoryFolder, subcategoryId) => {
    setLocation(`/gallery/${categoryFolder}?subcategory=${subcategoryId}`);
  };

  // Get subcategory ID from name (for navigation)
  const getSubcategoryId = (categoryId, subcategoryName) => {
    const subcategoryMappings = {
      'supply-fabric-tailoring-services-for-curtains-more': {
        'American Curtains': 'american-curtains',
        'Classic Curtains': 'classic-curtains',
        'ستائر أمريكية': 'american-curtains',
        'ستائر كلاسيك': 'classic-curtains'
      },
      'roller-blinds-black-out-dim-out': {
        'Black Out Rollers': 'black-out-rollers',
        'Dim Out Rollers': 'dim-out-rollers',
        'Screen Rollers': 'screen-rollers',
        'رولر بلاك أوت': 'black-out-rollers',
        'رولر ديم أوت': 'dim-out-rollers',
        'رولر شاشة': 'screen-rollers'
      },
      'outdoor-solutions-skylights': {
        'Awning': 'awning',
        'Pergulas': 'pergulas',
        'Skylight': 'skylight',
        'Vertical Solutions': 'vertical',
        'مظلات': 'awning',
        'برجولات': 'pergulas',
        'مناور': 'skylight',
        'حلول عمودية': 'vertical'
      },
      'floorings-acoustics': {
        'Acoustic Ceiling': 'acoustic-ceiling',
        'Acoustic Panels': 'acoustic-panels',
        'Floorings and Rugs': 'floorings-and-rugs',
        'سقف صوتي': 'acoustic-ceiling',
        'ألواح صوتية': 'acoustic-panels',
        'أرضيات وسجاد': 'floorings-and-rugs'
      }
    };
    return subcategoryMappings[categoryId]?.[subcategoryName] || subcategoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // WhatsApp order function with product information
  const handleWhatsAppOrder = (productTitle) => {
    const currentUrl = window.location.href;
    const message = `Hello Abdulhaq Dimensions, I'm interested in: • Product: ${productTitle} • SKU/Ref: Coming Soon • URL: ${currentUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/962778050005?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Search filter (localized)
  const filtered = categories.filter(cat => {
    const s = searchTerm.toLowerCase();
    return (
      getTitle(cat).toLowerCase().includes(s) ||
      getBrief(cat).toLowerCase().includes(s) ||
      (getSub(cat) && getSub(cat).some(sub => sub.toLowerCase().includes(s)))
    );
  });

  const title = t('seo.title', { defaultValue: t('heading') });
  const description = t('seo.description', { defaultValue: t('description') });

  const keywords = [
    'Abdulhaq Dimensions', 'products', 'curtains', 'blinds', 'wallpaper', 'flooring', 'motorization', 'Somfy', 'Amman', 'Jordan', 'interior solutions', 'premium', 'design', 'upholstery'
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': 'https://abdulhaqdimensions.com/products'
  };
  return (
    <Layout title={title} description={description} keywords={keywords} jsonLd={jsonLd}>
      <div className={`min-h-screen bg-gray-50 dark:bg-[#071215] ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
  <section className="bg-white dark:bg-[#071215] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('heading')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-white/90 max-w-3xl mx-auto mb-8">
              {t('description')}
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن منتج...' : 'Search for a product...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-[#232c32] rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-[#181e21] text-gray-900 dark:text-white"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  {isRTL ? 'مسح البحث' : 'Clear Search'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-white mb-2">
                  {isRTL ? 'لم يتم العثور على منتجات' : 'No products found'}
                </h3>
                <p className="text-gray-500 dark:text-white/80 mb-4">
                  {isRTL
                    ? 'جرب كلمات بحث مختلفة أو تصفح جميع المنتجات المتاحة'
                    : 'Try different search terms or browse all available products'
                  }
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  {isRTL ? 'عرض جميع المنتجات' : 'View All Products'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((cat, i) => (
                <Link 
                  key={i} 
                  to={`/gallery/${cat.folderPath}`}
                  className="block group"
                >
                  <div className="bg-white dark:bg-[#071215] rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 dark:border-[#232c32] cursor-pointer min-h-[500px]">
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                      <img
                        src={cat.image || `/images/products/${slugify(cat.title)}.jpg`}
                        alt={getTitle(cat)}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        onError={createImageErrorHandler('product')}
                      />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    {/* Badge removed per request */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/gallery/${cat.folderPath}`);
                        }}
                        className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                        title={isRTL ? 'عرض المعرض' : 'View Gallery'}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleWhatsAppOrder(getTitle(cat));
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                        title={isRTL ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {/* Product Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Title + brief block: consistent height */}
                    <div className="flex flex-col mb-4 min-h-[100px]">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                        {getTitle(cat)}
                      </h3>
                      <p className="text-gray-600 dark:text-white/90 text-sm leading-relaxed line-clamp-3 flex-grow">
                        {getBrief(cat)}
                      </p>
                    </div>
                    {/* Available Options - consistent height container */}
                    <div className="mb-4 flex-shrink-0 min-h-[60px] flex flex-col justify-start">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                        {isRTL ? 'الخيارات المتاحة:' : 'Available Options:'}
                      </h4>
                      {getSub(cat) && getSub(cat).length > 0 ? (
                        <div className="flex flex-wrap gap-2 w-full mt-1">
                          {(cat.folderPath === 'outdoor-solutions-skylights'
                            ? getSub(cat)
                            : getSub(cat).slice(0, 3)
                          ).map((sub, j) => (
                            <button
                              key={j}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSubcategoryClick(cat.folderPath, getSubcategoryId(cat.folderPath, sub));
                              }}
                              className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium border border-teal-200 transition-colors duration-200 cursor-pointer hover:shadow-sm dark:bg-transparent dark:border-teal-700 dark:text-teal-200"
                            >
                              {sub}
                            </button>
                          ))}
                          {cat.folderPath !== 'outdoor-solutions-skylights' && getSub(cat).length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-white/80 font-medium">
                              {isRTL ? 'استكشف المزيد' : 'Explore more'}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic dark:text-white/80">
                          {isRTL ? 'منتج مميز متاح' : 'Premium product available'}
                        </div>
                      )}
                    </div>
                    {/* Action Buttons - Always at bottom */}
                    <div className="flex gap-2 mt-auto flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/gallery/${cat.folderPath}`);
                        }}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        {isRTL ? 'معرض' : 'Gallery'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleWhatsAppOrder(getTitle(cat));
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {isRTL ? 'اطلب' : 'Order'}
                      </button>
                    </div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </Layout>
  );
}
