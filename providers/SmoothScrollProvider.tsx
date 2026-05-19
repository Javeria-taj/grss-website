'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '../lib/gsapSetup';
import { SCROLL } from '../constants/animations';

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export function useLenis() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: SCROLL.duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: SCROLL.touchMultiplier,
      wheelMultiplier: SCROLL.wheelMultiplier,
      infinite: SCROLL.infinite,
    });

    // Set state asynchronously to avoid triggering react-hooks/set-state-in-effect
    const rafId2 = requestAnimationFrame(() => {
      setLenis(instance);
    });

    // Connect Lenis to GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update);

    // RAF loop
    let rafId: number;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(rafId2);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
