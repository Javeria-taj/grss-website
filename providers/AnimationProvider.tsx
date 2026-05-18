'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { initGSAP } from '../lib/gsapSetup';

interface AnimationContextType {
  initialized: boolean;
}

const AnimationContext = createContext<AnimationContextType>({ initialized: false });

export function useAnimation() {
  return useContext(AnimationContext);
}

interface AnimationProviderProps {
  children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  useEffect(() => {
    initGSAP();
  }, []);

  return (
    <AnimationContext.Provider value={{ initialized: true }}>
      {children}
    </AnimationContext.Provider>
  );
}
