'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { SCENE_CONFIG, LIGHT_CONFIG } from '../../lib/threeConfig';
import { CAMERA, EARTH as EARTH_CONFIG } from '../../constants/animations';
import { AtmosphericLayerSystem } from './AtmosphericLayerSystem';
import { OrbitalEnvironmentSystem } from './OrbitalEnvironmentSystem';
import { ParticleFieldSystem } from './ParticleFieldSystem';

// Earth sphere with procedural texture (no external image needed)
function EarthSphere(): React.JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);


  // Cloud layer material
  const cloudMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4a7ab5'),
      transparent: true,
      opacity: 0.12,
      roughness: 1.0,
      metalness: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Ocean highlight material (subtle specular)
  const oceanMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        // Simple noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
                     mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
        }

        void main() {
          // Continent-like pattern
          float n1 = noise(vUv * 8.0 + vec2(time * 0.005, 0.0));
          float n2 = noise(vUv * 16.0 + vec2(0.0, time * 0.004));
          float continents = smoothstep(0.44, 0.58, n1 * 0.7 + n2 * 0.3);

          // Land: dark green-grey; Ocean: dark blue
          vec3 oceanColor = vec3(0.03, 0.09, 0.22);
          vec3 landColor = vec3(0.05, 0.12, 0.08);
          vec3 iceColor = vec3(0.55, 0.68, 0.82);

          // Polar ice caps
          float latitude = abs(vUv.y - 0.5) * 2.0;
          float ice = smoothstep(0.78, 0.95, latitude);

          vec3 baseColor = mix(oceanColor, landColor, continents);
          baseColor = mix(baseColor, iceColor, ice);

          // Night lights on dark side
          vec3 lightDir = normalize(vec3(2.5, 1.5, 3.0));
          float diffuse = max(dot(vNormal, lightDir), 0.0);
          float nightSide = 1.0 - smoothstep(0.0, 0.3, diffuse);
          float cityLights = noise(vUv * 30.0) * continents * nightSide * 0.6;
          baseColor += vec3(0.8, 0.75, 0.4) * cityLights;

          // Specular ocean glint
          vec3 viewDir = normalize(-vPosition);
          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(vNormal, halfDir), 0.0), 40.0) * (1.0 - continents) * 0.35;
          baseColor += vec3(0.4, 0.6, 1.0) * spec;

          gl_FragColor = vec4(baseColor, 1.0);
        }
      `,
      uniforms: {
        time: { value: 0 },
      },
    });
    return mat;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y += EARTH_CONFIG.rotationSpeed;
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat && mat.uniforms && mat.uniforms.time) {
        (mat.uniforms.time as THREE.IUniform<number>).value = t;
      }
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += EARTH_CONFIG.rotationSpeed * 1.12;
    }
  });

  return (
    <group rotation={[EARTH_CONFIG.tiltAngle, 0, 0]}>
      {/* Main Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[EARTH_CONFIG.radius, 96, 96]} />
        <primitive object={oceanMaterial} attach="material" />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} scale={[1.008, 1.008, 1.008]}>
        <sphereGeometry args={[EARTH_CONFIG.radius, 64, 64]} />
        <primitive object={cloudMaterial} attach="material" />
      </mesh>

      {/* Atmospheric layers */}
      <AtmosphericLayerSystem radius={EARTH_CONFIG.radius} />
    </group>
  );
}

// Lights for the scene
function SceneLights(): React.JSX.Element {
  return (
    <>
      <ambientLight
        intensity={LIGHT_CONFIG.ambient.intensity}
        color={LIGHT_CONFIG.ambient.color}
      />
      <directionalLight
        position={LIGHT_CONFIG.directional.position}
        intensity={LIGHT_CONFIG.directional.intensity}
        color={LIGHT_CONFIG.directional.color}
      />
      <hemisphereLight
        args={[
          LIGHT_CONFIG.hemisphere.skyColor as THREE.ColorRepresentation,
          LIGHT_CONFIG.hemisphere.groundColor as THREE.ColorRepresentation,
          LIGHT_CONFIG.hemisphere.intensity,
        ]}
      />
      {/* Subtle rim light from behind */}
      <pointLight
        position={[-3, 0, -2]}
        intensity={0.3}
        color="#1a3a6a"
        distance={8}
      />
    </>
  );
}

// Main scene content
function SceneContent(): React.JSX.Element {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      // Very gentle camera group drift for living feel
      groupRef.current.rotation.x = Math.sin(t * 0.28) * 0.022;
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.035;
    }
  });

  return (
    <group ref={groupRef}>
      <SceneLights />
      <ParticleFieldSystem />
      <EarthSphere />
      <OrbitalEnvironmentSystem />
    </group>
  );
}

// The full canvas component
interface EarthVisualizationSceneProps {
  className?: string;
}

export function EarthVisualizationScene({
  className = '',
}: EarthVisualizationSceneProps): React.JSX.Element {
  return (
    <Canvas
      className={className}
      dpr={SCENE_CONFIG.renderer.dpr}
      gl={{
        antialias: SCENE_CONFIG.renderer.antialias,
        alpha: SCENE_CONFIG.renderer.alpha,
        powerPreference: SCENE_CONFIG.renderer.powerPreference,
        toneMapping: SCENE_CONFIG.gl.toneMapping as THREE.ToneMapping,
        toneMappingExposure: SCENE_CONFIG.gl.toneMappingExposure,
      }}
      style={{ background: 'transparent' }}
    >
      <PerspectiveCamera
        makeDefault
        fov={CAMERA.fov}
        near={CAMERA.near}
        far={CAMERA.far}
        position={[
          CAMERA.initialPosition.x,
          CAMERA.initialPosition.y,
          CAMERA.initialPosition.z,
        ]}
      />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
