'use client';

import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import { CAMERA } from '../constants/animations';

export function useCinematicCamera(
  groupRef: React.RefObject<THREE.Group | null>
): void {
  const clockRef = useRef(0);

  useEffect(() => {
    if (!groupRef.current) return;

    let rafId: number;
    let lastTime = performance.now();

    function animate(now: number) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      clockRef.current += dt;

      if (groupRef.current) {
        const t = clockRef.current * CAMERA.driftSpeed * 1000;
        groupRef.current.rotation.x = Math.sin(t * 0.7) * CAMERA.driftAmplitude.y;
        groupRef.current.rotation.y = Math.sin(t * 0.4) * CAMERA.driftAmplitude.x;
      }

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [groupRef]);
}
