import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow Three.js ecosystem to be properly transpiled
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // Empty turbopack config to acknowledge Turbopack usage
  // GLSL files are inlined as strings via the component (no loader needed)
  turbopack: {},
};

export default nextConfig;
