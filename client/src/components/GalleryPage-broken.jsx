// src/components/GalleryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, MessageCircle, ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { WA_URL } from '../config';

export default function GalleryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('products');
  const [images, setImages] = useState([]);
  const [selectedSub, setSelectedSub] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  // Get categories from translation data to stay in sync with ProductsPage
  const categories = t('categories', { returnObjects: true }) || [];
  const cat = categories.find(c => c.folderPath === category);

  // Navigation functions wrapped with useCallback for stable references
  const navigateToNextImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex(img => img.src === selectedImage.src);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  }, [filteredImages, selectedImage]);

  const navigateToPreviousImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex(img => img.src === selectedImage.src);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  }, [filteredImages, selectedImage]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Filter logic for subcategories - moved up to make it available for navigation
  const filteredImages = selectedSub === 'all'
    ? images
    : images.filter(img => img.subcategory === selectedSub);

  // Keyboard controls for lightbox
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
  }, [selectedImage, filteredImages, navigateToNextImage, navigateToPreviousImage, closeLightbox]);

  useEffect(() => {
    // Compute image list for the current category
    if (!cat) {
      setImages([]);
      setSelectedSub('all');
      return;
    }

    const base = `/images/products/architecture/${category}`;
    const imgs = [];

    if (cat.sub && cat.sub.length > 0) {
      // Category has subcategories - create images for each subcategory
  cat.sub.forEach((sub) => {
        // Convert subcategory name to folder-friendly id
        const subId = sub.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
        
        // Try to discover images for this subcategory by attempting to load them
        // We'll start with a reasonable count and expand as needed
        for (let i = 1; i <= 50; i++) {
          imgs.push({
            src: `${base}/${subId}/${i}.jpg`,
            alt: `${cat.title} - ${sub} #${i}`,
            subcategory: subId,
            subcategoryName: sub,
          });
        }
      });
    } else {
      // Category has no subcategories - load images directly
      for (let i = 1; i <= 100; i++) {
        imgs.push({
          src: `${base}/${i}.jpg`,
          alt: `${cat.title} #${i}`,
          subcategory: 'main',
          subcategoryName: cat.title,
        });
      }
    }

    setImages(imgs);
    
    // Set initial subcategory from URL params
    const subcategoryParam = searchParams.get('subcategory');
    if (subcategoryParam && cat.sub) {
      const subId = subcategoryParam.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
      const validSubcategory = cat.sub.find(sub => {
        const subIdFromName = sub.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
        return subIdFromName === subId;
      });
      setSelectedSub(validSubcategory ? subId : 'all');
    } else {
      setSelectedSub('all');
    }
  }, [category, searchParams, cat]);

  // WhatsApp with improved message template
  const shareOnWhatsApp = (img, catName, subName) => {
    const currentUrl = window.location.href;
    const productName = `${catName} - ${subName}`;
    const message = `Hello Abdulhaq Dimensions, I'm interested in: • Product: ${productName} • SKU/Ref: Gallery Item • URL: ${currentUrl}`;
    const url = WA_URL ? WA_URL(message) : undefined;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!cat)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-xl mb-3">Category not found</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg"
          >← Back to Products</button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
          </button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{cat.name}</h1>
            {/* images count removed per request */}
          </div>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </div>

      {/* Subcategory filter */}
      {cat.subcategories && cat.subcategories.length > 1 && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => {
                setSelectedSub('all');
                navigate(`/gallery/${category}`, { replace: true });
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium ${selectedSub === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              All
              <span className="sr-only">{images.length} items</span>
            </button>
            {cat.subcategories.map(sub => {
              const count = images.filter(i => i.subcategory === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSub(sub.id);
                    navigate(`/gallery/${category}?subcategory=${sub.id}`, { replace: true });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${selectedSub === sub.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                  {sub.name}
                  <span className="sr-only">{count} items</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={e => (e.target.src = '/images/placeholder.svg')}
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{img.subcategoryName}</p>
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button
                    className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedImage(img);
                    }}
                    tabIndex={-1}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                    onClick={e => {
                      e.stopPropagation();
                      shareOnWhatsApp(img.src, cat.name, img.subcategoryName);
                    }}
                    tabIndex={-1}
                  ><MessageCircle className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Enhanced Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header with close button and image counter */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="text-white text-lg font-medium">
                {selectedImage.subcategoryName} - {cat.name}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-white/70 text-sm">
                  {filteredImages.findIndex(img => img.src === selectedImage.src) + 1} / {filteredImages.length}
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

            {/* Main image container */}
            <div className="flex-1 relative flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onError={e => (e.target.src = '/images/placeholder.svg')}
              />
              
              {/* Navigation arrows */}
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

            {/* Action buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => shareOnWhatsApp(selectedImage.src, cat.name, selectedImage.subcategoryName)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order Now</span>
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedImage.src;
                  link.download = `${cat.name}-${selectedImage.subcategoryName}.jpg`;
                  link.click();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
            </div>

            {/* Thumbnail strip */}
            {filteredImages.length > 1 && (
              <div className="mt-6 max-w-4xl mx-auto">
                <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
                  {filteredImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        img.src === selectedImage.src 
                          ? 'border-white shadow-lg scale-110' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img
                        src={img.src}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.svg';
                        }}
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
  );
}
