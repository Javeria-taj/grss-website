'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PARTICLE } from '../../constants/animations';

// Deterministic pseudo-random number generator to comply with React purity rules
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function ParticleFieldSystem(): React.JSX.Element {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const random = createRandom(42);
    const count = PARTICLE.count;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const spread = PARTICLE.spread;

    for (let i = 0; i < count; i++) {
      // Distribute stars in a sphere shell (not filled — keep center clear for Earth)
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const r = spread * 0.3 + random() * spread * 0.7;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = PARTICLE.minSize + random() * (PARTICLE.maxSize - PARTICLE.minSize);
    }

    return { positions, sizes };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: new THREE.Color('#ffffff'),
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      // Very slow rotation to give the starfield a living feel
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.00015;
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.00008;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
