// IEEE GRSS — Cinematic Content

export const CONTENT = {
  hero: {
    tagline: 'Observe Beyond Vision',
    identity: 'IEEE · GRSS',
    subtitle: 'Geoscience & Remote Sensing Society',
    scroll: 'Scroll to explore',
  },

  mission: {
    label: 'Our Mission',
    headline: 'Advancing the science\nof Earth observation.',
    body: 'The IEEE Geoscience and Remote Sensing Society promotes the theory, concepts, and applications of science and engineering relating to the sensing of the Earth, oceans, atmosphere, and space.',
    stat1: { value: '12,000+', label: 'Members Worldwide' },
    stat2: { value: '60+', label: 'Years of Science' },
    stat3: { value: '50+', label: 'Countries' },
  },

  research: {
    label: 'Research Domains',
    headline: 'From microwave\nto optical spectrum.',
    areas: [
      {
        id: 'sar',
        title: 'Synthetic Aperture Radar',
        description: 'High-resolution ground imaging through clouds and night.',
        frequency: '1 – 100 GHz',
      },
      {
        id: 'optical',
        title: 'Optical Remote Sensing',
        description: 'Multispectral and hyperspectral Earth surface analysis.',
        frequency: '400 – 2500 nm',
      },
      {
        id: 'lidar',
        title: 'LiDAR & Ranging',
        description: 'Precision topographic mapping and atmospheric profiling.',
        frequency: '905 – 1550 nm',
      },
      {
        id: 'passive',
        title: 'Passive Microwave',
        description: 'Ocean, ice, and atmospheric moisture measurements.',
        frequency: '1 – 300 GHz',
      },
    ],
  },

  sensing: {
    label: 'Earth Intelligence',
    headline: 'Every pixel tells\na planetary story.',
    body: 'From ice sheet dynamics to urban heat islands, from deforestation rates to ocean temperature gradients — our sensors decode the language of the Earth at scales impossible to the naked eye.',
    caption: 'Landsat-9 Band Composite — Normalized Difference Vegetation Index',
  },

  community: {
    label: 'Global Network',
    headline: 'A community of\nplanet-scale thinkers.',
    body: 'Scientists, engineers, and researchers connected across six continents — sharing data, methods, and discoveries that reshape our understanding of the world we inhabit.',
    cta: {
      primary: 'Join GRSS',
      secondary: 'Explore Publications',
    },
  },

  signature: {
    wordmark: 'IEEE GRSS',
    tagline: 'Observe Beyond Vision',
    year: new Date().getFullYear().toString(),
    links: [
      { label: 'ieee-grss.org', href: 'https://www.ieee-grss.org' },
      { label: 'IGARSS 2025', href: 'https://www.igarss2025.org' },
      { label: 'TGRS Journal', href: 'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=36' },
    ],
  },
} as const;

export type ContentType = typeof CONTENT;
