'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import { gsap } from '../../lib/gsapSetup';

interface CinematicRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  splitByWord?: boolean;
  trigger?: string;
  start?: string;
}



// Cinematic text reveal with GSAP
export function CinematicReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.04,
  splitByWord = true,
  start = 'top 80%',
}: CinematicRevealProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const targets = containerRef.current.querySelectorAll(
      splitByWord ? '.word' : '.char'
    );

    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y: '110%',
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: stagger,
        delay: delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: start,
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [delay, stagger, splitByWord, start]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Single line text with slide-up reveal
interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
  splitByWord?: boolean;
  start?: string;
}

export function TextReveal({
  text,
  as: Tag = 'div',
  className = '',
  id,
  delay = 0,
  stagger = 0.04,
  splitByWord = true,
  start = 'top 80%',
}: TextRevealProps): React.JSX.Element {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Build split spans
    if (splitByWord) {
      ref.current.innerHTML = text
        .split(' ')
        .map(word =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;">` +
          `<span class="tw" style="display:inline-block;">${word}</span></span>`
        )
        .join('&nbsp;');
    } else {
      ref.current.innerHTML = text
        .split('')
        .map(c =>
          c === ' '
            ? '<span style="display:inline-block;min-width:0.25em;">&nbsp;</span>'
            : `<span class="tc" style="display:inline-block;">${c}</span>`
        )
        .join('');
    }

    const targets = ref.current.querySelectorAll(splitByWord ? '.tw' : '.tc');

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y: '105%',
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: stagger,
        delay: delay,
        scrollTrigger: {
          trigger: ref.current,
          start: start,
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [text, delay, stagger, splitByWord, start]);

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} id={id} className={className} />;
}

// Fade + blur reveal for body text
interface FadeRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  start?: string;
  from?: 'bottom' | 'left' | 'right' | 'none';
}

export function FadeReveal({
  children,
  className = '',
  delay = 0,
  duration = 1.0,
  start = 'top 82%',
  from = 'bottom',
}: FadeRevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      filter: 'blur(6px)',
      duration,
      ease: 'power2.out',
      delay,
      scrollTrigger: {
        trigger: ref.current,
        start,
        toggleActions: 'play none none reverse',
      },
    };

    if (from === 'bottom') fromVars.y = 24;
    if (from === 'left') fromVars.x = -24;
    if (from === 'right') fromVars.x = 24;

    const ctx = gsap.context(() => {
      gsap.from(ref.current!, fromVars);
    }, ref);

    return () => ctx.revert();
  }, [delay, duration, from, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Staggered children reveal
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  start?: string;
}

export function StaggerReveal({
  children,
  className = '',
  stagger = 0.12,
  delay = 0,
  start = 'top 80%',
}: StaggerRevealProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const items = Array.from(ref.current.children);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 28,
        filter: 'blur(4px)',
        duration: 0.9,
        ease: 'power2.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: 'play none none reverse',
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, delay, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
