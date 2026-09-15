import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * CitadelPillars
 * Monolithic metallic columns with emerald conduit channels and reflective floor grid
 */
export const CitadelPillars = ({ scrollProgress = 0 }) => {
  // Generate pillar positions along both sides
  const pillars = useMemo(() => {
    const list = [];
    for (let z = -25; z <= 15; z += 6) {
      list.push({ pos: [-5.5, 2, z], height: 16 });
      list.push({ pos: [5.5, 2, z], height: 16 });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Reflective Dark Floor Grid */}
      <mesh position={[0, -2.5, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 80, 20, 20]} />
        <meshStandardMaterial
          color="#040b08"
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Glowing Green Ground Conduit Lines */}
      <mesh position={[-2.5, -2.48, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 70]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[2.5, -2.48, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, 70]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Cyber Grid Cross Lines */}
      {[-20, -14, -8, -2, 4, 10].map((zPos, i) => (
        <mesh key={i} position={[0, -2.48, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14, 0.04]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Metallic Monolith Columns */}
      {pillars.map((p, idx) => (
        <group key={idx} position={p.pos}>
          {/* Main Pillar Body */}
          <mesh>
            <boxGeometry args={[1.2, p.height, 1.2]} />
            <meshStandardMaterial
              color="#0d1217"
              roughness={0.3}
              metalness={0.92}
            />
          </mesh>

          {/* Conduit Strip */}
          <mesh position={[p.pos[0] > 0 ? -0.61 : 0.61, 0, 0]}>
            <boxGeometry args={[0.05, p.height, 0.15]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
