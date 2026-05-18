// GRSS Cinematic Animation Configuration

export const EASING = {
  // Cinematic easing curves — weighted, physical feeling
  cinematic: 'power4.inOut',
  cinematicOut: 'power3.out',
  cinematicIn: 'power3.in',
  drift: 'sine.inOut',
  snap: 'expo.out',
  organic: 'power2.inOut',
  reveal: 'power2.out',
} as const;

export const DURATION = {
  instant: 0.15,
  fast: 0.4,
  normal: 0.8,
  slow: 1.4,
  cinematic: 2.0,
  epic: 3.2,
} as const;

export const DELAY = {
  none: 0,
  stagger: 0.08,
  staggerText: 0.035,
  section: 0.3,
  scene: 0.6,
} as const;

export const SCROLL = {
  // Lenis smooth scroll config
  lerp: 0.08,
  duration: 1.2,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
  infinite: false,
} as const;

export const CAMERA = {
  // Initial camera position
  fov: 45,
  near: 0.1,
  far: 1000,
  initialPosition: { x: 0, y: 0, z: 4.5 },
  // Camera drift amplitude
  driftAmplitude: { x: 0.08, y: 0.05, z: 0 },
  driftSpeed: 0.0004,
} as const;

export const EARTH = {
  radius: 1.0,
  segments: 64,
  rotationSpeed: 0.0008,
  tiltAngle: 0.41, // ~23.5 degrees in radians
} as const;

export const ORBITAL = {
  // Orbital ring parameters
  radiusX: 1.8,
  radiusY: 0.35,
  satelliteSpeed: 0.0006,
  ringOpacity: 0.45,
} as const;

export const PARTICLE = {
  count: 2000,
  spread: 80,
  minSize: 0.01,
  maxSize: 0.04,
  twinkleSpeed: 0.002,
} as const;

// Section scroll trigger configs
export const SECTIONS = {
  hero: { start: 'top top', end: '+=150%', pin: true },
  mission: { start: 'top 80%', end: 'bottom 20%' },
  research: { start: 'top 80%', end: 'bottom 20%' },
  sensing: { start: 'top 80%', end: 'bottom 20%' },
  community: { start: 'top 80%', end: 'bottom 20%' },
  signature: { start: 'top 80%', end: 'bottom top' },
} as const;
