'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EARTH } from '../../constants/animations';
import { COLORS } from '../../constants/colors';

interface AtmosphericLayerSystemProps {
  radius?: number;
}

export function AtmosphericLayerSystem({
  radius = EARTH.radius,
}: AtmosphericLayerSystemProps): React.JSX.Element {
  const outerAtmRef = useRef<THREE.Mesh>(null);
  const innerAtmRef = useRef<THREE.Mesh>(null);

  // Outer atmospheric glow material
  const outerAtmMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float intensity;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
          float glow = pow(rim, 2.4) * intensity;
          gl_FragColor = vec4(glowColor * glow, glow * 0.9);
        }
      `,
      uniforms: {
        intensity: { value: 1.6 },
        glowColor: { value: new THREE.Color(COLORS.atmosphere.outerGlow) },
      },
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Inner rim glow
  const innerAtmMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float intensity;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
          float glow = pow(rim, 4.5) * intensity;
          gl_FragColor = vec4(glowColor * glow, glow * 0.7);
        }
      `,
      uniforms: {
        intensity: { value: 2.2 },
        glowColor: { value: new THREE.Color(COLORS.atmosphere.rim) },
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerAtmRef.current) {
      // Very gentle pulse
      const mat = outerAtmRef.current.material as THREE.ShaderMaterial;
      if (mat && mat.uniforms && mat.uniforms.intensity) {
        (mat.uniforms.intensity as THREE.IUniform<number>).value =
          1.6 + Math.sin(t * 0.5) * 0.1;
      }
    }
  });

  return (
    <group>
      {/* Outer glow — front face */}
      <mesh ref={outerAtmRef} scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <primitive object={outerAtmMaterial} attach="material" />
      </mesh>

      {/* Inner rim — back face */}
      <mesh ref={innerAtmRef} scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <primitive object={innerAtmMaterial} attach="material" />
      </mesh>
    </group>
  );
}
