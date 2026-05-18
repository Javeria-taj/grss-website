'use client';

import { useEffect, useRef, RefObject } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsapSetup';

interface ScrollAnimationConfig {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  pinSpacing?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export function useScrollAnimation<T extends HTMLElement>(
  config: ScrollAnimationConfig
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: config.trigger ?? ref.current,
      start: config.start ?? 'top 80%',
      end: config.end ?? 'bottom 20%',
      scrub: config.scrub ?? false,
      pin: config.pin ?? false,
      pinSpacing: config.pinSpacing ?? true,
      markers: config.markers ?? false,
      onEnter: config.onEnter,
      onLeave: config.onLeave,
      onEnterBack: config.onEnterBack,
      onLeaveBack: config.onLeaveBack,
    });

    return () => {
      trigger.kill();
    };
  }, [
    config.trigger,
    config.start,
    config.end,
    config.scrub,
    config.pin,
    config.pinSpacing,
    config.markers,
    config.onEnter,
    config.onLeave,
    config.onEnterBack,
    config.onLeaveBack,
  ]);

  return ref;
}

// Reveal animation with scroll trigger
export function useRevealAnimation<T extends HTMLElement>(
  options: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    start?: string;
    stagger?: number;
    children?: boolean;
  } = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const targets = options.children
      ? Array.from(ref.current.children)
      : ref.current;

    const from: gsap.TweenVars = options.from ?? {
      opacity: 0,
      y: 30,
      filter: 'blur(8px)',
    };

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        ...from,
        duration: 1.2,
        ease: 'power3.out',
        stagger: options.stagger ?? 0,
        scrollTrigger: {
          trigger: ref.current,
          start: options.start ?? 'top 75%',
          toggleActions: 'play none none reverse',
        },
        ...options.to,
      });
    });

    return () => ctx.revert();
  }, [options.from, options.to, options.start, options.stagger, options.children]);

  return ref;
}
