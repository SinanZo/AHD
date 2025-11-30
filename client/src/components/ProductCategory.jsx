import React, { useState, useEffect, useCallback } from 'react';
import { WA_URL } from '../config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  ShoppingCart, 
  Star, 
  Award, 
  Shield, 
  Zap,
  X,
  ZoomIn
} from 'lucide-react';

export default function ProductCategory({ category, subcategories }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // WhatsApp quote function
  const handleWhatsAppQuote = () => {
    const currentUrl = window.location.href;
    const categoryName = category.category || category.name || 'Product';
    const message = `Hello Abdulhaq Dimensions, I'm interested in: • Product: ${categoryName} • SKU/Ref: Coming Soon • URL: ${currentUrl}`;
    const url = WA_URL ? WA_URL(message) : undefined;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Map categories to their architecture folder paths
  const getCategoryImagePath = (categoryName) => {
    const categoryMap = {
      "SUPPLY FABRIC & TAILORING SERVICES FOR CURTAINS & MORE": "curtains-tailoring",
      "ROLLER BLINDS, BLACK OUT & DIM OUT": "roller-blinds",
      "WAVE STYLE CURTAINS": "wave-curtains",
      "ROMAN BLINDS": "roman-blinds",
      "VERTICAL & VERTICAL WAVES BLINDS": "vertical-blinds",
      "JAPANESE PANEL STYLE": "japanese-panels",
      "HONEYCOMB BLINDS": "honeycomb-blinds",
      "METAL BLINDS": "metal-blinds",
      "WOODEN BLINDS": "wooden-blinds",
      "DOUBLE ROLLER BLINDS (ZEBRA)": "zebra-blinds",
      "Wallpaper": "wallpaper",
      "OUTDOOR SOLUTIONS & SKYLIGHTS": "outdoor-solutions",
      "MOTORIZATION SOMFY EXPERTS": "motorization",
      "TRACKS FOR HOSPITALS & HOTELS": "hospital-tracks",
      "FLOORINGS & ACOUSTICS": "floorings-acoustics",
      "ACCESSORIES": "accessories",
      "FURNITURE UPHOLSTERY": "upholstery"
    };
    
    return categoryMap[categoryName] || "curtains-tailoring"; // fallback
  };

  // Get product images from the architecture folder structure
  const getProductImages = () => {
    const folderPath = getCategoryImagePath(category.category);
    const basePath = `/images/products/architecture/${folderPath}`;
    
    // Define available images for each category based on the actual files
    const imageMap = {
      "curtains-tailoring": [
        `${basePath}/american-curtains-1.jpg`,
        `${basePath}/american-curtains-2.jpg`,
        `${basePath}/classic-curtains-1.jpg`,
        `${basePath}/classic-curtains-2.jpg`
      ],
      "roller-blinds": [
        `${basePath}/blackout-roller-1.jpg`,
        `${basePath}/blackout-roller-2.jpg`,
        `${basePath}/dimout-roller-1.jpg`,
        `${basePath}/screen-roller-1.jpg`
      ],
      "wave-curtains": [
        `${basePath}/wave-style-1.png`,
        `${basePath}/wave-style-2.png`,
        `${basePath}/wave-style-3.png`
      ],
      "roman-blinds": [
        `${basePath}/roman-blind-1.png`,
        `${basePath}/roman-blind-2.png`,
        `${basePath}/roman-blind-3.png`
      ],
      "vertical-blinds": [
        `${basePath}/vertical-blind-1.png`,
        `${basePath}/vertical-blind-2.png`,
        `${basePath}/vertical-wave-1.png`
      ],
      "japanese-panels": [
        `${basePath}/japanese-panel-1.png`,
        `${basePath}/japanese-panel-2.png`
      ],
      "honeycomb-blinds": [
        `${basePath}/honeycomb-1.png`,
        `${basePath}/honeycomb-2.png`,
        `${basePath}/honeycomb-3.png`
      ],
      "metal-blinds": [
        `${basePath}/metal-blind-1.png`,
        `${basePath}/metal-blind-2.png`,
        `${basePath}/metal-blind-3.png`
      ],
      "wooden-blinds": [
        `${basePath}/wooden-blind-1.png`,
        `${basePath}/wooden-blind-2.png`,
        `${basePath}/wooden-blind-3.png`
      ],
      "zebra-blinds": [
        `${basePath}/zebra-blind-1.png`,
        `${basePath}/zebra-blind-2.png`
      ],
      "wallpaper": [
        `${basePath}/wallpaper-1.png`,
        `${basePath}/wallpaper-2.png`
      ],
      "outdoor-solutions": [
        `${basePath}/awning-1.png`,
        `${basePath}/pergola-1.png`,
        `${basePath}/skylight-1.png`,
        `${basePath}/vertical-outdoor-1.png`
      ],
      "motorization": [
        `${basePath}/somfy-control-1.png`,
        `${basePath}/somfy-motor-1.png`
      ],
      "hospital-tracks": [
        `${basePath}/hospital-track-1.png`
      ],
      "floorings-acoustics": [
        `${basePath}/acoustic-panel-1.png`
      ],
      "accessories": [
        `${basePath}/accessory-1.png`
      ],
      "upholstery": [
        `${basePath}/upholstery-1.png`
      ]
    };
    
    return imageMap[folderPath] || imageMap["curtains-tailoring"]; // fallback to curtains
  };

  const productImages = getProductImages();

  // Get category features based on type
  const getCategoryFeatures = () => {
    const categoryName = category.category.toLowerCase();
    if (categoryName.includes('curtain') || categoryName.includes('fabric')) {
      return ['Premium Quality', 'Custom Tailoring', 'Wide Selection'];
    } else if (categoryName.includes('blind') || categoryName.includes('roller')) {
      return ['Light Control', 'Energy Efficient', 'Easy Operation'];
    } else if (categoryName.includes('motor') || categoryName.includes('somfy')) {
      return ['Smart Control', 'Remote Operation', 'Timer Functions'];
    } else if (categoryName.includes('acoustic') || categoryName.includes('flooring')) {
      return ['Sound Control', 'Premium Materials', 'Professional Installation'];
    } else if (categoryName.includes('outdoor') || categoryName.includes('skylight')) {
      return ['Weather Resistant', 'UV Protection', 'Durable Materials'];
    }
    return ['High Quality', 'Professional Service', 'Warranty Included'];
  };

  const features = getCategoryFeatures();

  // Get gradient color based on category
  const getGradientColor = () => {
    const categoryName = category.category.toLowerCase();
    if (categoryName.includes('curtain') || categoryName.includes('fabric')) {
      return 'from-purple-500 to-pink-500';
    } else if (categoryName.includes('roller') || categoryName.includes('blind')) {
      return 'from-blue-500 to-cyan-500';
    } else if (categoryName.includes('wave')) {
      return 'from-green-500 to-teal-500';
    } else if (categoryName.includes('roman')) {
      return 'from-orange-500 to-red-500';
    } else if (categoryName.includes('vertical')) {
      return 'from-purple-500 to-indigo-500';
    } else if (categoryName.includes('japanese')) {
      return 'from-gray-700 to-gray-900';
    } else if (categoryName.includes('honeycomb')) {
      return 'from-yellow-500 to-orange-500';
    } else if (categoryName.includes('metal')) {
      return 'from-gray-600 to-gray-800';
    } else if (categoryName.includes('wooden')) {
      return 'from-amber-600 to-orange-600';
    } else if (categoryName.includes('zebra')) {
      return 'from-red-500 to-pink-500';
    } else if (categoryName.includes('wallpaper')) {
      return 'from-purple-600 to-purple-800';
    } else if (categoryName.includes('outdoor')) {
      return 'from-green-600 to-blue-600';
    } else if (categoryName.includes('motor')) {
      return 'from-blue-600 to-purple-600';
    } else if (categoryName.includes('track') || categoryName.includes('hospital')) {
      return 'from-red-600 to-orange-600';
    } else if (categoryName.includes('flooring') || categoryName.includes('acoustic')) {
      return 'from-orange-600 to-yellow-600';
    } else if (categoryName.includes('accessories')) {
      return 'from-blue-500 to-indigo-500';
    } else if (categoryName.includes('upholstery')) {
      return 'from-green-500 to-emerald-500';
    }
    return 'from-purple-500 to-pink-500'; // default
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const openGallery = (index) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
  };

  const nextGalleryImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  }, [productImages.length]);

  const prevGalleryImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  }, [productImages.length]);

  // Keyboard controls for gallery
  useEffect(() => {
    if (!showGallery) return;

    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'Escape':
          setShowGallery(false);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevGalleryImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextGalleryImage();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    // Prevent background scroll when gallery is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [showGallery, nextGalleryImage, prevGalleryImage]);

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Image Gallery Section */}
        <div className="relative h-64 overflow-hidden">
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${getGradientColor()} opacity-20`}
          />
          
          {/* Main Image */}
          <div className="relative h-full">
            <img
              src={productImages[currentImageIndex]}
              alt={category.category}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = '/images/placeholder.svg';
              }}
            />
            
            {/* Image Navigation */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {productImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Zoom Button */}
            <button
              onClick={() => openGallery(currentImageIndex)}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="View gallery"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <Badge className={`bg-gradient-to-r ${getGradientColor()} text-white border-0`}>
                {subcategories.length > 0 ? `${subcategories.length} Types` : 'Premium'}
              </Badge>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold line-clamp-2">
            {category.category}
          </CardTitle>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1 mt-2">
            {features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Available Options:
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {subcategories.map((sub, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Star className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
                    <span>{sub.en}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thumbnail Gallery */}
          {productImages.length > 1 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Gallery:
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => openGallery(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'border-blue-500 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${category.category} ${index + 1}`}
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

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="w-full" onClick={handleWhatsAppQuote}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Get Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full h-[80vh] bg-white rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{category.category}</h3>
                <button
                  onClick={() => setShowGallery(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="relative flex-1 flex items-center justify-center bg-gray-100 h-full">
              <img
                src={productImages[selectedImageIndex]}
                alt={`${category.category} ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = '/images/placeholder.svg';
                }}
              />
              
              {/* Navigation Buttons */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevGalleryImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextGalleryImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {productImages.length > 1 && (
              <div className="p-4 border-t">
                <div className="flex gap-2 justify-center overflow-x-auto">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === selectedImageIndex 
                          ? 'border-blue-500 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
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
    </>
  );
}

