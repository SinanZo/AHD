import React from 'react';
import PropTypes from 'prop-types';
import { m as Motion } from 'framer-motion';

/**
 * Reveal
 * Simple fade-up on-enter wrapper. Respects reduced-motion via framer-motion.
 */
export default function Reveal({ delay = 0, duration = 0.6, children, className, once = true }) {
  const disabled = typeof import.meta !== 'undefined' && import.meta.env && String(import.meta.env.VITE_DISABLE_REVEAL) === '1';
  if (disabled) {
    return <div className={className}>{children}</div>;
  }
  const supportsIO = typeof window !== 'undefined' && 'IntersectionObserver' in window;
  // Never hide: keep opacity at 1 always; use a subtle translate only
  const initial = supportsIO ? { opacity: 1, y: 12 } : { opacity: 1, y: 0 };
  const target = { opacity: 1, y: 0 };
  const common = { className, transition: { delay, duration, ease: 'easeOut' } };

  // If IO is available, use whileInView; otherwise, just render visible.
  if (supportsIO) {
    return (
      <Motion.div
        {...common}
        initial={initial}
        whileInView={target}
        viewport={{ once, amount: 0.01 }}
      >
        {children}
      </Motion.div>
    );
  }

  return (
    <Motion.div {...common} initial={initial} animate={target}>
      {children}
    </Motion.div>
  );
}

Reveal.propTypes = {
  delay: PropTypes.number,
  duration: PropTypes.number,
  once: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
