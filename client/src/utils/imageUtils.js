// src/utils/imageUtils.js
// Comprehensive image utilities for error handling and accessibility

/**
 * Preloads an image and returns a promise
 * @param {string} src - Image source URL
 * @returns {Promise<string>} - Resolves with src if successful, rejects on error
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'));
      return;
    }

    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Checks if an image exists and is loadable
 * @param {string} src - Image source URL
 * @returns {Promise<boolean>} - Resolves with true if image loads successfully
 */
export const checkImageExists = async (src) => {
  try {
    await preloadImage(src);
    return true;
  } catch {
    return false;
  }
};

/**
 * Standard error handler for img elements with graceful fallback
 * @param {Event} e - Error event
 * @param {string} fallbackSrc - Optional custom fallback image
 * @param {string} altText - Optional enhanced alt text for accessibility
 */
export const handleImageError = (e, fallbackSrc = '/images/placeholder-product.svg', altText = null) => {
  const img = e.target;
  
  // Prevent infinite error loops
  if (img.src === fallbackSrc) {
    console.warn('Fallback image also failed to load:', fallbackSrc);
    return;
  }

  img.src = fallbackSrc;
  
  // Enhance alt text for better accessibility
  if (altText) {
    img.alt = altText;
  } else if (!/unavailable/i.test(img.alt)) {
    img.alt = `${img.alt} (image currently unavailable)`;
  }
  
  // Add error class for potential styling
  img.classList.add('image-error-fallback');
};

/**
 * Gets an appropriate fallback image based on context
 * @param {string} context - Context type ('product', 'client', 'gallery', 'founder')
 * @returns {string} - Appropriate fallback image path
 */
export const getFallbackImage = (context = 'product') => {
  const fallbacks = {
    product: '/images/placeholder-product.svg',
    client: '/images/placeholder-product.svg', 
    gallery: '/images/placeholder-product.svg',
    founder: '/images/placeholder-product.svg',
    default: '/images/placeholder-product.svg'
  };
  
  return fallbacks[context] || fallbacks.default;
};

/**
 * Generates accessible alt text for images
 * @param {string} baseAlt - Base alt text
 * @param {string} context - Image context
 * @param {string} category - Optional category information
 * @returns {string} - Enhanced alt text
 */
export const generateAltText = (baseAlt, context = '', category = '') => {
  if (!baseAlt) return 'Image';
  
  let altText = baseAlt;
  
  if (context && !altText.includes(context)) {
    altText = `${context} - ${altText}`;
  }
  
  if (category && !altText.includes(category)) {
    altText = `${altText} (${category})`;
  }
  
  return altText;
};

/**
 * Creates a standardized image error handler with context
 * @param {string} context - Image context for appropriate fallback
 * @returns {Function} - Error handler function
 */
export const createImageErrorHandler = (context = 'default') => {
  return (e) => {
    const fallbackSrc = getFallbackImage(context);
    const enhancedAlt = generateAltText(e.target.alt, context);
    handleImageError(e, fallbackSrc, enhancedAlt);
  };
};

/**
 * Validates image sources and replaces invalid ones with fallbacks
 * @param {Array<string>} imageSources - Array of image source URLs
 * @param {string} context - Context for fallback selection
 * @returns {Promise<Array<string>>} - Array with valid sources and fallbacks
 */
export const validateImageSources = async (imageSources, context = 'default') => {
  const fallback = getFallbackImage(context);
  
  const validatedSources = await Promise.all(
    imageSources.map(async (src) => {
      try {
        const isValid = await checkImageExists(src);
        return isValid ? src : fallback;
      } catch {
        return fallback;
      }
    })
  );
  
  return validatedSources;
};

/**
 * Lazy loading utility with error handling
 * @param {string} src - Image source
 * @param {HTMLElement} imgElement - Image element to update
 * @param {string} context - Context for fallback
 */
export const lazyLoadImage = (src, imgElement, context = 'default') => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        preloadImage(src)
          .then(() => {
            img.src = src;
            img.classList.add('loaded');
          })
          .catch(() => {
            img.src = getFallbackImage(context);
            img.alt = generateAltText(img.alt, context);
            img.classList.add('image-error-fallback');
          })
          .finally(() => {
            observer.unobserve(img);
          });
      }
    });
  });
  
  observer.observe(imgElement);
};