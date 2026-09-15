import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Doctor Doom Armored Centerpiece
 * Sculpted metallic mask, emerald glowing ocular visors, Latverian hooded crown
 */
export const DoomMaskSculpture = ({ scrollProgress = 0 }) => {
  const groupRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Subtle breathing float
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.15;
    // Rotation responds slightly to mouse pointer & scroll
    const targetRotY = (state.pointer.x * 0.3) + Math.sin(t * 0.5) * 0.08;
    const targetRotX = -(state.pointer.y * 0.2) + (scrollProgress * 0.4);

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);

    // Eye visor pulse
    if (leftEyeRef.current && rightEyeRef.current) {
      const pulse = 1.8 + Math.sin(t * 4) * 0.4;
      leftEyeRef.current.material.emissiveIntensity = pulse;
      rightEyeRef.current.material.emissiveIntensity = pulse;
    }

    if (coreRef.current) {
      coreRef.current.rotation.z += delta * 0.8;
      coreRef.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.8, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Hood / Crown Mantle */}
      <mesh position={[0, 0.6, -0.3]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[1.5, 2.2, 5]} />
        <meshStandardMaterial
          color="#061a12"
          roughness={0.7}
          metalness={0.4}
          flatShading
        />
      </mesh>

      {/* Main Armored Titanium Faceplate */}
      <mesh position={[0, 0.1, 0.1]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.6, 1.3, 8]} />
        <meshStandardMaterial
          color="#1e252d"
          metalness={0.92}
          roughness={0.22}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Angular Brow / Forehead Plate */}
      <mesh position={[0, 0.55, 0.45]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.1, 0.3, 0.4]} />
        <meshStandardMaterial
          color="#12171c"
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Left Eye Slit (Emerald Energy) */}
      <mesh ref={leftEyeRef} position={[-0.32, 0.3, 0.62]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.15]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ff88"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Right Eye Slit (Emerald Energy) */}
      <mesh ref={rightEyeRef} position={[0.32, 0.3, 0.62]} rotation={[0, -0.25, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.15]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ff88"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Titanium Jaw & Ventilation Grille */}
      <mesh position={[0, -0.4, 0.5]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.75, 0.45, 0.35]} />
        <meshStandardMaterial
          color="#0d1115"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Vertical Grille Slits */}
      {[-0.2, -0.1, 0, 0.1, 0.2].map((xOffset, idx) => (
        <mesh key={idx} position={[xOffset, -0.4, 0.68]}>
          <boxGeometry args={[0.035, 0.25, 0.05]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}

      {/* Cheek Guard Armor Plates */}
      <mesh position={[-0.6, 0.05, 0.35]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.5]} />
        <meshStandardMaterial
          color="#1e252d"
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0.6, 0.05, 0.35]} rotation={[0, -0.5, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.5]} />
        <meshStandardMaterial
          color="#1e252d"
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>

      {/* Floating Orbital Runic Ring behind Mask */}
      <group ref={coreRef} position={[0, 0.2, -0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1.8}
            wireframe
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.1, 0.02, 12, 48]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.0}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
};
