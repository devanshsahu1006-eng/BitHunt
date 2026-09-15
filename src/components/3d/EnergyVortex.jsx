import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * EnergyVortex
 * Latverian green plasma particle field with dynamic flow and orbital rings
 */
export const EnergyVortex = ({ scrollProgress = 0 }) => {
  const particlesRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  // Particle count adjusted for guaranteed 60fps
  const particleCount = 450;

  const { positions, originalPositions, speeds } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const orig = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Cylindrical distribution around citadel center
      const radius = 2.5 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.3) * 16;

      pos[idx] = Math.cos(theta) * radius;
      pos[idx + 1] = y;
      pos[idx + 2] = Math.sin(theta) * radius;

      orig[idx] = pos[idx];
      orig[idx + 1] = pos[idx + 1];
      orig[idx + 2] = pos[idx + 2];

      spd[idx] = (Math.random() - 0.5) * 0.4;
      spd[idx + 1] = Math.random() * 0.8 + 0.3; // Upward drift
      spd[idx + 2] = (Math.random() - 0.5) * 0.4;
    }

    return { positions: pos, originalPositions: orig, speeds: spd };
  }, [particleCount]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const energyMultiplier = 1 + scrollProgress * 2.5;

    // Animate individual particles
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const arr = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        // Upward floating ember movement
        arr[idx + 1] += speeds[idx + 1] * delta * energyMultiplier;
        // Swirl around Y axis
        const curX = arr[idx];
        const curZ = arr[idx + 2];
        const angle = 0.4 * delta * energyMultiplier;
        arr[idx] = curX * Math.cos(angle) - curZ * Math.sin(angle);
        arr[idx + 2] = curX * Math.sin(angle) + curZ * Math.cos(angle);

        // Reset if float too high
        if (arr[idx + 1] > 14) {
          arr[idx + 1] = -3;
          arr[idx] = originalPositions[idx];
          arr[idx + 2] = originalPositions[idx + 2];
        }
      }
      posAttr.needsUpdate = true;
    }

    // Rotate energy rings
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.6 * energyMultiplier;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.4 * energyMultiplier;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.8 * energyMultiplier;
  });

  return (
    <group>
      {/* Floating Spark Points */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#00ff88"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Orbiting Quantum Plasma Containment Rings */}
      <group position={[0, 1, -2]}>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[3.6, 0.025, 16, 64]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1.8}
            wireframe
          />
        </mesh>

        <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[4.2, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.2}
            wireframe
          />
        </mesh>

        <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, 0]}>
          <torusGeometry args={[4.8, 0.018, 16, 64]} />
          <meshStandardMaterial
            color="#00ffcc"
            emissive="#00ffcc"
            emissiveIntensity={1.0}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
};
