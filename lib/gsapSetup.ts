'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

let initialized = false;

export function initGSAP(): void {
  if (initialized || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
  });
  initialized = true;
}

export { gsap, ScrollTrigger };
