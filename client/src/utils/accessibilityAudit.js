// src/utils/accessibilityAudit.js
// Accessibility utilities for image content

/**
 * Audits all images on the page for accessibility compliance
 * @returns {Object} - Audit results with compliance data
 */
export const auditImageAccessibility = () => {
  const images = document.querySelectorAll('img');
  const results = {
    total: images.length,
    compliant: 0,
    issues: [],
    warnings: []
  };

  images.forEach((img, index) => {
    const src = img.src;
    const alt = img.alt;
    const hasValidSrc = src && !src.includes('data:image/svg+xml') && src !== 'undefined';
    const hasValidAlt = alt && alt.trim().length > 0 && alt !== 'undefined';
    const isDecorative = img.hasAttribute('role') && img.getAttribute('role') === 'presentation';
    
    // Check for common issues
    if (!hasValidSrc) {
      results.issues.push({
        index,
        type: 'missing-src',
        message: `Image at index ${index} has missing or invalid src attribute`,
        element: img
      });
    }
    
    if (!hasValidAlt && !isDecorative) {
      results.issues.push({
        index,
        type: 'missing-alt',
        message: `Image at index ${index} is missing alt text and is not marked as decorative`,
        element: img,
        src: src
      });
    }
    
    // Check for placeholder images without proper alt text
    if (src.includes('placeholder.svg') && !alt.includes('unavailable') && !alt.includes('placeholder')) {
      results.warnings.push({
        index,
        type: 'placeholder-alt',
        message: `Image at index ${index} is a placeholder but alt text doesn't indicate unavailability`,
        element: img
      });
    }
    
    // Check for generic alt text
    const genericAlts = ['image', 'photo', 'picture', 'img'];
    if (genericAlts.includes(alt.toLowerCase())) {
      results.warnings.push({
        index,
        type: 'generic-alt',
        message: `Image at index ${index} has generic alt text: "${alt}"`,
        element: img
      });
    }
    
    // Mark as compliant if no major issues
    if (hasValidSrc && (hasValidAlt || isDecorative)) {
      results.compliant++;
    }
  });

  return results;
};

/**
 * Automatically fixes common accessibility issues
 * @param {boolean} dryRun - If true, only returns what would be fixed
 * @returns {Array} - List of fixes applied or would be applied
 */
export const fixImageAccessibility = (dryRun = false) => {
  const images = document.querySelectorAll('img');
  const fixes = [];

  images.forEach((img, index) => {
    const src = img.src;
    const alt = img.alt;
    
    // Fix missing alt text for non-decorative images
    if (!alt || alt.trim().length === 0) {
      const suggestedAlt = generateAltTextFromSrc(src);
      fixes.push({
        index,
        type: 'fix-missing-alt',
        before: alt,
        after: suggestedAlt,
        element: img
      });
      
      if (!dryRun) {
        img.alt = suggestedAlt;
      }
    }
    
    // Fix generic alt text
    const genericAlts = ['image', 'photo', 'picture', 'img'];
    if (genericAlts.includes(alt?.toLowerCase())) {
      const improvedAlt = generateAltTextFromSrc(src) || 'Descriptive image';
      fixes.push({
        index,
        type: 'fix-generic-alt',
        before: alt,
        after: improvedAlt,
        element: img
      });
      
      if (!dryRun) {
        img.alt = improvedAlt;
      }
    }
    
    // Add loading="lazy" if not present and not above the fold
    if (!img.hasAttribute('loading') && img.getBoundingClientRect().top > window.innerHeight) {
      fixes.push({
        index,
        type: 'add-lazy-loading',
        element: img
      });
      
      if (!dryRun) {
        img.setAttribute('loading', 'lazy');
      }
    }
  });

  return fixes;
};

/**
 * Generates meaningful alt text from image src path
 * @param {string} src - Image source URL
 * @returns {string} - Generated alt text
 */
const generateAltTextFromSrc = (src) => {
  if (!src) return 'Image';
  
  try {
    // Extract filename and path info
    const url = new URL(src, window.location.origin);
    const pathname = url.pathname;
    const filename = pathname.split('/').pop();
    const pathParts = pathname.split('/').filter(part => part && part !== 'images');
    
    // Handle specific patterns
    if (pathname.includes('/products/')) {
      const category = pathParts.find(part => !part.match(/^\d+\.(jpg|jpeg|png|webp)$/i));
      return `Product image${category ? ` - ${category.replace(/-/g, ' ')}` : ''}`;
    }
    
    if (pathname.includes('/clients/')) {
      return 'Client logo';
    }
    
    if (pathname.includes('/covers/')) {
      return 'Cover image';
    }
    
    if (filename === 'founder.jpg') {
      return 'Founder portrait';
    }
    
    if (filename === 'logo.png') {
      return 'Company logo';
    }
    
    if (filename.includes('placeholder')) {
      return 'Placeholder image - content unavailable';
    }
    
    // Generic fallback based on filename
    return filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    
  } catch {
    return 'Image';
  }
};

/**
 * Sets up accessibility monitoring for dynamically loaded images
 */
export const setupAccessibilityMonitoring = () => {
  // Create a mutation observer to monitor for new images
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Check if it's an image or contains images
          const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll?.('img') || [];
          
          images.forEach((img) => {
            // Auto-fix accessibility issues for new images
            if (!img.alt || img.alt.trim().length === 0) {
              img.alt = generateAltTextFromSrc(img.src);
            }
            
            // Add lazy loading if not present
            if (!img.hasAttribute('loading')) {
              img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling if not present
            if (!img.hasAttribute('data-error-handled')) {
              img.addEventListener('error', (e) => {
                if (!e.target.src.includes('placeholder.svg')) {
                  e.target.src = '/images/placeholder.svg';
                  e.target.alt = `${e.target.alt} (image unavailable)`;
                  e.target.classList.add('image-error-fallback');
                }
              });
              img.setAttribute('data-error-handled', 'true');
            }
          });
        }
      });
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return observer;
};

/**
 * Generates an accessibility report
 * @returns {Object} - Comprehensive accessibility report
 */
export const generateAccessibilityReport = () => {
  const audit = auditImageAccessibility();
  const score = audit.total > 0 ? Math.round((audit.compliant / audit.total) * 100) : 100;
  
  return {
    score,
    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
    summary: `${audit.compliant}/${audit.total} images are accessible`,
    details: audit,
    recommendations: generateRecommendations(audit)
  };
};

/**
 * Generates recommendations based on audit results
 * @param {Object} audit - Audit results
 * @returns {Array} - Array of recommendations
 */
const generateRecommendations = (audit) => {
  const recommendations = [];
  
  const missingAltCount = audit.issues.filter(issue => issue.type === 'missing-alt').length;
  const genericAltCount = audit.warnings.filter(warning => warning.type === 'generic-alt').length;
  const placeholderCount = audit.warnings.filter(warning => warning.type === 'placeholder-alt').length;
  
  if (missingAltCount > 0) {
    recommendations.push(`Add alt text to ${missingAltCount} images missing descriptions`);
  }
  
  if (genericAltCount > 0) {
    recommendations.push(`Improve alt text for ${genericAltCount} images with generic descriptions`);
  }
  
  if (placeholderCount > 0) {
    recommendations.push(`Update alt text for ${placeholderCount} placeholder images to indicate unavailability`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All images are accessible! Great job maintaining WCAG AA compliance.');
  }
  
  return recommendations;
};