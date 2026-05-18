// GRSS Cinematic Design Tokens — Color System

export const COLORS = {
  // Space / Background
  space: {
    deepBlack: '#03050a',
    nightBlue: '#070c14',
    deepNavy: '#0a1322',
    starfield: '#0d1620',
  },

  // Earth Atmosphere
  atmosphere: {
    innerGlow: '#0a1322',
    midGlow: '#162844',
    outerGlow: '#6e9ad4',
    rim: '#9ec1ff',
    highlight: '#c8deff',
  },

  // Orbital System
  orbital: {
    ring: '#9ec1ff',
    ringDim: 'rgba(158, 193, 255, 0.3)',
    satellite: '#ffffff',
    trail: 'rgba(158, 193, 255, 0.15)',
  },

  // Typography
  text: {
    primary: '#eaecf2',
    secondary: '#b0b8cc',
    muted: '#61687a',
    accent: '#6e9ad4',
    glow: '#9ec1ff',
  },

  // UI
  ui: {
    border: 'rgba(110, 154, 212, 0.12)',
    borderHover: 'rgba(110, 154, 212, 0.35)',
    glassBg: 'rgba(10, 19, 34, 0.6)',
    separator: 'rgba(110, 154, 212, 0.08)',
  },

  // Particles
  particle: {
    star: '#ffffff',
    starDim: 'rgba(255, 255, 255, 0.4)',
    nebula: 'rgba(110, 154, 212, 0.08)',
  },
} as const;

export type ColorToken = typeof COLORS;
