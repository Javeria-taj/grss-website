'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ORBITAL } from '../../constants/animations';
import { COLORS } from '../../constants/colors';

interface OrbitalEnvironmentSystemProps {
  visible?: boolean;
}

export function OrbitalEnvironmentSystem({
  visible = true,
}: OrbitalEnvironmentSystemProps): React.JSX.Element {
  const satelliteRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const satelliteAngleRef = useRef(0.3);
  const spriteRef = useRef<THREE.Sprite>(null);

  // Orbital ellipse ring
  const orbitCurve = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,
      ORBITAL.radiusX, ORBITAL.radiusY,
      0, Math.PI * 2,
      false,
      0
    );
    const points = curve.getPoints(160);
    const positions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = p.y;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const orbitMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(COLORS.orbital.ring),
      transparent: true,
      opacity: ORBITAL.ringOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Satellite glow material
  const satelliteMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.orbital.satellite),
      transparent: false,
    });
  }, []);

  // Satellite glow halo material
  const haloMaterial = useMemo(() => {
    return new THREE.SpriteMaterial({
      color: new THREE.Color(COLORS.orbital.ring),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }) => {
    if (!visible) return;
    const t = clock.getElapsedTime();

    // Advance satellite along orbital ellipse
    satelliteAngleRef.current += ORBITAL.satelliteSpeed;
    const angle = satelliteAngleRef.current;

    const x = Math.cos(angle) * ORBITAL.radiusX;
    const z = Math.sin(angle) * ORBITAL.radiusY;

    if (satelliteRef.current) {
      satelliteRef.current.position.set(x, 0, z);
      // Subtle pulse
      const pulse = 1.0 + Math.sin(t * 3.0) * 0.15;
      satelliteRef.current.scale.setScalar(pulse);
    }

    if (spriteRef.current) {
      spriteRef.current.position.set(x, 0, z);
    }
  });

  return (
    <group ref={orbitGroupRef} rotation={[0.18, 0, 0]}>
      {/* Orbital ring */}
      <lineLoop geometry={orbitCurve} material={orbitMaterial} />

      {/* Satellite dot */}
      <mesh ref={satelliteRef}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <primitive object={satelliteMaterial} attach="material" />
      </mesh>

      {/* Satellite halo glow */}
      <sprite
        ref={spriteRef}
        material={haloMaterial}
        scale={[0.14, 0.14, 0.14]}
      />

      {/* Second fainter ring for depth */}
      <lineLoop geometry={orbitCurve} material={orbitMaterial} rotation={[0.4, 0.2, 0]} scale={[0.85, 0.85, 0.85]}>
      </lineLoop>
    </group>
  );
}
