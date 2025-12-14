import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  MessageCircle,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { createImageErrorHandler } from '../utils/imageUtils';
import { WA_URL } from '../config';
import Layout from './Layout';

export default function GalleryPage() {
  const { category } = useParams();
  const [location, setLocation] = useLocation();

  const searchParams = useMemo(() => {
    try {
      const q = (location || '').split('?')[1] || '';
      return new URLSearchParams(q);
    } catch {
      return new URLSearchParams();
    }
  }, [location]);
  
  const { t, i18n } = useTranslation('products');
  const [images, setImages] = useState([]);
  const [manifest, setManifest] = useState(null);
  const [selectedSub, setSelectedSub] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = useMemo(() => t('categories', { returnObjects: true }) || [], [t]);
  
  const cat = useMemo(() => {
    return categories.find(c => c.folderPath === category);
  }, [categories, category]);

  const filteredImages = useMemo(() => {
    return selectedSub === 'all'
      ? images
      : images.filter(img => img.subcategory === selectedSub);
  }, [selectedSub, images]);

  // fetch manifest once
  useEffect(() => {
    let mounted = true;

    fetch('/images/products/manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('no manifest');
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

  const navigateToNextImage = useCallback(() => {
    if (!selectedImage || filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex((img) => img.src === selectedImage.src);
    if (currentIndex === -1) {
      setSelectedImage(filteredImages[0]);
      return;
    }
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  }, [filteredImages, selectedImage]);

  const navigateToPreviousImage = useCallback(() => {
    if (!selectedImage || filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex((img) => img.src === selectedImage.src);
    if (currentIndex === -1) {
      setSelectedImage(filteredImages[0]);
      return;
    }
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  }, [filteredImages, selectedImage]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          navigateToPreviousImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateToNextImage();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, navigateToNextImage, navigateToPreviousImage, closeLightbox]);

  // build images list from manifest only (no numeric fallback → avoids black tiles)
  useEffect(() => {
    if (!cat || !category) {
      setImages([]);
      setSelectedSub('all');
      return;
    }

    const imgs = [];

    if (manifest && manifest.folders) {
      const folderList = manifest.folders[category] || [];

      folderList.forEach((entry) => {
        const rel = entry.path.replace(`${manifest.root}/${category}/`, '');
        const segments = rel.split('/');

        let subId = 'main';
        let subName = cat.title;

        if (segments.length > 1 && segments[0]) {
          subId = segments[0];
          subName = segments[0];

          if (cat.sub && cat.sub.length > 0) {
            const matchingSub = cat.sub.find((sub) => {
              const normalizedSub = sub
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/-$/, '');
              return (
                normalizedSub === subId ||
                subId.includes(normalizedSub) ||
                normalizedSub.includes(subId)
              );
            });
            if (matchingSub) {
              subName = matchingSub;
            }
          }
        }

        imgs.push({
          src: entry.path,
          alt: entry.name || cat.title,
          subcategory: subId,
          subcategoryName: subName,
        });
      });
    }

    setImages(imgs);

    // initial subcategory selection from query param
    const subcategoryParam = searchParams.get('subcategory');
    if (subcategoryParam && cat.sub) {
      const subId = subcategoryParam
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/-$/, '');
      const validSubcategory = cat.sub.find((sub) => {
        const subIdFromName = sub
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/-$/, '');
        return subIdFromName === subId;
      });
      setSelectedSub(validSubcategory ? subId : 'all');
    } else {
      setSelectedSub('all');
    }
  }, [category, searchParams, cat, manifest]);

  const shareOnWhatsApp = (img, catName, subName) => {
    const currentUrl = window.location.href;
    const productName = `${catName} - ${subName}`;
    const message = `Hello Abdulhaq Dimensions, I'm interested in: • Product: ${productName} • SKU/Ref: Gallery Item • URL: ${currentUrl}`;
    const url = WA_URL ? WA_URL(message) : undefined;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const dir = (i18n && typeof i18n.dir === 'function')
    ? i18n.dir()
    : (i18n && typeof i18n.language === 'string' && i18n.language.startsWith('ar') ? 'rtl' : 'ltr');

  const isRTL = dir === 'rtl';

  if (!cat)
    return (
      <Layout title="Category not found" description="The category you are looking for does not exist.">
        <div className="min-h-screen flex items-center justify-center bg-adh-bg">
          <div className="text-center">
            <p className="text-red-600 font-semibold text-xl mb-3">Category not found</p>
            <button
              onClick={() => setLocation('/products')}
              className="text-adh-primary hover:opacity-80 underline decoration-1 underline-offset-2 transition"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout title={cat.title} description={`Gallery for ${cat.title}`}>
      <div className="min-h-screen bg-adh-bg text-adh-text">
        {/* Section Title */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-adh-text text-center">{cat.title}</h1>
        </div>

        {/* Back to Products Button - inside container, above filters */}
        <div className="container mx-auto px-4">
          <div className={`${isRTL ? 'text-right' : 'text-left'} mb-4 md:mb-6`}>
            <button
              onClick={() => setLocation('/products')}
              aria-label={t('backToProducts', { defaultValue: 'Back to Products' })}
              className={`inline-flex items-center ${
                isRTL ? 'flex-row-reverse' : ''
              } text-adh-text hover:text-adh-primary transition font-medium`}
            >
              {isRTL ? (
                <ArrowRight className="w-5 h-5 ml-2" />
              ) : (
                <ArrowLeft className="w-5 h-5 mr-2" />
              )}
              <span>{t('backToProducts', { defaultValue: 'Back to Products' })}</span>
            </button>
          </div>
        </div>

        {/* Subcategory filter */}
        {cat.sub && cat.sub.length > 1 && (
          <div className="bg-adh-surface border-b border-adh-stroke">
            <div className="container mx-auto px-4 py-4 flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => {
                  setSelectedSub('all');
                  setLocation(`/gallery/${category}`, { replace: true });
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedSub === 'all'
                    ? 'bg-adh-primary text-[var(--btn-fg)]'
                    : 'bg-adh-chip text-adh-text hover:bg-adh-stroke'
                }`}
              >
                {t('all', { defaultValue: 'All' })}
                <span className="sr-only">{images.length} items</span>
              </button>
              {cat.sub.map((sub) => {
                const subId = sub
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/-$/, '');
                const count = images.filter((i) => i.subcategory === subId).length;
                return (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSub(subId);
                      setLocation(`/gallery/${category}?subcategory=${subId}`, {
                        replace: true,
                      });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedSub === subId
                        ? 'bg-adh-primary text-[var(--btn-fg)]'
                        : 'bg-adh-chip text-adh-text hover:bg-adh-stroke'
                    }`}
                  >
                    {sub}
                    <span className="sr-only">{count} items</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery Grid / Empty State */}
        <div className="container mx-auto px-4 py-8">
          {filteredImages.length === 0 ? (
            <div className="py-12 text-center text-adh-muted">
              {t('noImages', {
                defaultValue: 'Images for this category will be added soon.',
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl shadow-adh-soft overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  {/* Image Container */}
                  <div className="w-full aspect-square overflow-hidden rounded-xl bg-adh-bg border border-adh-stroke">
                    <img
                      src={img.src}
                      alt={img.alt || cat.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform bg-adh-bg"
                      onError={createImageErrorHandler('product')}
                    />
                  </div>

                  {/* Subcategory Label */}
                  <div className="p-3 bg-adh-surface border-t border-adh-stroke">
                    <p className="text-xs font-medium text-adh-text">
                      {img.subcategoryName}
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-adh-text bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex gap-3 transition-opacity">
                      <button
                        className="bg-adh-bg text-adh-text p-2 rounded-full hover:bg-adh-primary hover:text-[var(--btn-fg)] transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(img);
                        }}
                        tabIndex={-1}
                        aria-label="Zoom"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                      <button
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareOnWhatsApp(img.src, cat.title, img.subcategoryName);
                        }}
                        tabIndex={-1}
                        aria-label="Share on WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
              {/* Lightbox Header */}
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="text-white text-lg font-medium">
                  {selectedImage.subcategoryName} - {cat.title}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-white/70 text-sm">
                    {filteredImages.findIndex((img) => img.src === selectedImage.src) + 1} /{' '}
                    {filteredImages.length}
                  </div>
                  <button
                    onClick={closeLightbox}
                    className="text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors"
                    aria-label="Close lightbox"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Main Image */}
              <div className="flex-1 relative flex items-center justify-center">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onError={createImageErrorHandler('product')}
                />
                
                {/* Navigation Arrows */}
                {filteredImages.length > 1 && (
                  <>
                    <button
                      onClick={navigateToPreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={navigateToNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() =>
                    shareOnWhatsApp(selectedImage.src, cat.title, selectedImage.subcategoryName)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('orderNow', { defaultValue: 'Order Now' })}</span>
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedImage.src;
                    link.download = `${cat.title}-${selectedImage.subcategoryName}.jpg`;
                    link.click();
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>{t('download', { defaultValue: 'Download' })}</span>
                </button>
              </div>

              {/* Thumbnail Strip */}
              {filteredImages.length > 1 && (
                <div className="mt-6 max-w-4xl mx-auto">
                  <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
                    {filteredImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          img.src === selectedImage.src
                            ? 'border-white shadow-lg scale-110'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={`Thumbnail ${index + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={createImageErrorHandler('product')}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
