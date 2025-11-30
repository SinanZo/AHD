import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile devices and optimize performance
 * @returns {Object} Mobile optimization flags
 */
export function useMobileOptimization() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    // Check for low-end device indicators
    const checkLowEndDevice = () => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 2;
      // Check device memory (if available)
      const memory = navigator.deviceMemory || 4;
      // Consider low-end if <= 2 cores or <= 2GB RAM
      const lowEnd = cores <= 2 || memory <= 2;
      setIsLowEndDevice(lowEnd);
    };

    // Check for reduced motion preference
    const checkReducedMotion = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShouldReduceMotion(prefersReducedMotion);
    };

    // Initial checks
    checkMobile();
    checkLowEndDevice();
    checkReducedMotion();

    // Listen for window resize
    window.addEventListener('resize', checkMobile);

    // Listen for motion preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => setShouldReduceMotion(e.matches);
    
    if (motionMediaQuery.addEventListener) {
      motionMediaQuery.addEventListener('change', handleMotionChange);
    } else {
      // Fallback for older browsers
      motionMediaQuery.addListener(handleMotionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (motionMediaQuery.removeEventListener) {
        motionMediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        motionMediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  return {
    isMobile,
    isLowEndDevice,
    shouldReduceMotion,
    // Derived flags for convenience
    shouldDisableAnimations: isMobile || isLowEndDevice || shouldReduceMotion,
    shouldLazyLoadImages: isMobile || isLowEndDevice,
    shouldSimplifyEffects: isMobile || isLowEndDevice,
  };
}

/**
 * Hook to conditionally load heavy libraries only on desktop
 * @param {Function} loader - Dynamic import function
 * @param {boolean} condition - Condition to load (default: !isMobile)
 */
export function useConditionalLoad(loader, condition = true) {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (condition && !module && !loading) {
      setLoading(true);
      loader()
        .then((mod) => {
          setModule(mod.default || mod);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load module:', err);
          setLoading(false);
        });
    }
  }, [condition, loader, module, loading]);

  return { module, loading };
}

/**
 * Hook to get optimized animation variants based on device capabilities
 */
export function useAnimationVariants() {
  const { shouldDisableAnimations } = useMobileOptimization();

  // Return simplified variants for mobile/low-end devices
  if (shouldDisableAnimations) {
    return {
      initial: {},
      animate: {},
      exit: {},
      transition: { duration: 0 },
    };
  }

  // Return full animation variants for desktop
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  };
}

export default useMobileOptimization;
