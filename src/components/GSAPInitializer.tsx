'use client';

import { useEffect } from 'react';
import '@/lib/gsap';

/**
 * GSAPInitializer component
 *
 * This component ensures that GSAP plugins are registered on the client side.
 * It also serves as a central place to initialize global GSAP settings.
 */
export function GSAPInitializer() {
  useEffect(() => {
    // Global GSAP settings can be configured here
    // For example, default ease or duration
    // gsap.defaults({ duration: 0.5, ease: "power2.out" });
  }, []);

  return null;
}
