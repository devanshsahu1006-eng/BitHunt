import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ArenaStage
 * Holographic tournament battleground that activates as the user approaches the finale
 */
export const ArenaStage = ({ scrollProgress = 0 }) => {
  const arenaRef = useRef();
  const hexRingRef = useRef();

  useFrame((state, delta) => {
    if (hexRingRef.current) {
      hexRingRef.current.rotation.z += delta * 0.2;
    }
  });

  // Fade in during Battlefield & Final Arena scenes (scrollProgress > 0.6)
  const arenaOpacity = Math.max(0, (scrollProgress - 0.55) * 2.2);

  if (arenaOpacity <= 0.01) return null;

  return (
    <group ref={arenaRef} position={[0, -2.4, 0]}>
      {/* Octagonal Holographic Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 7.5, 8]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={arenaOpacity * 1.5}
          transparent
          opacity={arenaOpacity * 0.6}
          wireframe
        />
      </mesh>

      {/* Center Hexagonal Podium */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 0.4, 6]} />
        <meshStandardMaterial
          color="#08140f"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Glowing Hex Rim */}
      <group ref={hexRingRef} position={[0, 0.42, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.2, 6]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={arenaOpacity * 2.0}
            transparent
            opacity={arenaOpacity * 0.8}
          />
        </mesh>
      </group>

      {/* Cybernetic Arena Pylons */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * 6;
        const z = Math.sin(angle) * 6;
        return (
          <mesh key={i} position={[x, 1.5, z]}>
            <boxGeometry args={[0.3, 3, 0.3]} />
            <meshStandardMaterial
              color="#111a15"
              metalness={0.95}
              roughness={0.2}
            />
            {/* Top Beacon */}
            <mesh position={[0, 1.6, 0]}>
              <sphereGeometry args={[0.15, 12, 12]} />
              <meshStandardMaterial
                color="#00ff88"
                emissive="#00ff88"
                emissiveIntensity={arenaOpacity * 2.5}
              />
            </mesh>
          </mesh>
        );
      })}
    </group>
  );
};
