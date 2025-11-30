// src/components/SmartImage.jsx
// Enhanced image component with comprehensive error handling and accessibility
import React, { useState } from "react";
import { createImageErrorHandler, generateAltText } from "../utils/imageUtils";

const extensions = ["jpg", "jpeg", "png", "JPG", "PNG", "webp", "WEBP", "tif", "bmp"];

export default function SmartImage({ 
  base, 
  alt = "Image", 
  className = "", 
  context = "default",
  loading = "lazy",
  style = { objectFit: "cover" },
  onLoadSuccess,
  onLoadError,
  ...props 
}) {
  const [currentExtIndex, setCurrentExtIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // If no base provided, show fallback immediately
  if (!base) {
    return (
      <img 
        src="/images/placeholder.svg" 
        alt={generateAltText(alt, context)} 
        className={`${className} image-error-fallback`}
        loading={loading}
        style={style}
        {...props}
      />
    );
  }

  // If we've exhausted all extensions, show fallback
  if (currentExtIndex >= extensions.length) {
    return (
      <img 
        src="/images/placeholder.svg" 
        alt={generateAltText(alt, context, "unavailable")} 
        className={`${className} image-error-fallback`}
        loading={loading}
        style={style}
        {...props}
      />
    );
  }

  const currentSrc = `${base}.${extensions[currentExtIndex]}`;
  const errorHandler = createImageErrorHandler(context);

  const handleError = (e) => {
    setHasError(true);
    
    // Try next extension
    if (currentExtIndex < extensions.length - 1) {
      setCurrentExtIndex(prev => prev + 1);
    } else {
      // All extensions failed, use standard error handler
      errorHandler(e);
      if (onLoadError) onLoadError(e);
    }
  };

  const handleLoad = (e) => {
    setHasError(false);
    if (onLoadSuccess) onLoadSuccess(e);
  };

  return (
    <img
      src={currentSrc}
      alt={generateAltText(alt, context)}
      className={`${className} ${hasError ? 'image-retry' : ''}`}
      onError={handleError}
      onLoad={handleLoad}
      loading={loading}
      style={style}
      {...props}
    />
  );
}
