// Three.js Scene Configuration

export const SCENE_CONFIG = {
  background: null, // Transparent — CSS handles background
  fog: {
    enabled: false,
  },
  renderer: {
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance' as const,
    dpr: [1, 2] as [number, number],
  },
  gl: {
    toneMapping: 4, // ACESFilmicToneMapping
    toneMappingExposure: 1.2,
    outputColorSpace: 'srgb' as const,
  },
} as const;

export const LIGHT_CONFIG = {
  ambient: {
    intensity: 0.15,
    color: '#0a1a3a',
  },
  directional: {
    intensity: 2.2,
    color: '#c8deff',
    position: [2.5, 1.5, 3.0] as [number, number, number],
    castShadow: false,
  },
  hemisphere: {
    skyColor: '#1a3a6a',
    groundColor: '#000510',
    intensity: 0.3,
  },
} as const;
