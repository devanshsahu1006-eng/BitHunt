import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DoomMaskSculpture } from './DoomMaskSculpture';
import { CitadelPillars } from './CitadelPillars';
import { EnergyVortex } from './EnergyVortex';
import { ArenaStage } from './ArenaStage';

/**
 * DoomWorld
 * Continuous atmospheric 3D environment with restrained, physical cinematic lighting.
 * Camera movement is controlled with smooth, subtle cinematographic dolly and parallax.
 */
export const DoomWorld = ({ scrollProgress = 0 }) => {
  const { camera } = useThree();
  const dirLightRef = useRef();
  const pointLightRef = useRef();

  // Smooth camera interpolation targets
  const currentCamPos = useRef(new THREE.Vector3(0, 1.2, 12));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.5, 0));

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(scrollProgress, 0, 1);

    // Continuous smooth interpolation across the scroll timeline
    // Section 1 (0.0 - 0.25): Dark, deep shadows, slow dolly
    // Section 2 (0.25 - 0.50): Subtle architectural illumination
    // Section 3 (0.50 - 0.75): Monolithic mask focus with controlled rim lighting
    // Section 4 (0.75 - 1.00): Deep arena illumination and return to quiet horizon

    const targetX = Math.sin(p * Math.PI * 1.5) * 1.6 + state.pointer.x * 0.2;
    const targetY = 1.2 + Math.sin(p * Math.PI) * 0.8 + state.pointer.y * 0.15;
    const targetZ = THREE.MathUtils.lerp(12, 6.5, p);

    const lookX = Math.sin(p * Math.PI) * 0.2;
    const lookY = 0.5 + Math.sin(p * Math.PI * 0.5) * 0.3;
    const lookZ = 0;

    // Restrained physical lighting: deep shadows with soft emerald specular accents
    const lightIntensity = 0.5 + Math.sin(p * Math.PI) * 0.6;
    const emeraldIntensity = 0.8 + Math.sin(p * Math.PI * 1.2) * 1.2;

    // Cinematographic smooth lerping
    currentCamPos.current.x = THREE.MathUtils.lerp(currentCamPos.current.x, targetX, 0.04);
    currentCamPos.current.y = THREE.MathUtils.lerp(currentCamPos.current.y, targetY, 0.04);
    currentCamPos.current.z = THREE.MathUtils.lerp(currentCamPos.current.z, targetZ, 0.04);
    camera.position.copy(currentCamPos.current);

    currentLookAt.current.x = THREE.MathUtils.lerp(currentLookAt.current.x, lookX, 0.04);
    currentLookAt.current.y = THREE.MathUtils.lerp(currentLookAt.current.y, lookY, 0.04);
    currentLookAt.current.z = THREE.MathUtils.lerp(currentLookAt.current.z, lookZ, 0.04);
    camera.lookAt(currentLookAt.current);

    if (dirLightRef.current) {
      dirLightRef.current.intensity = lightIntensity;
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = emeraldIntensity;
    }
  });

  return (
    <>
      {/* Deep Cold Fog */}
      <fog attach="fog" args={['#030504', 5, 28]} />

      {/* Very subtle ambient light (preserves deep shadows) */}
      <ambientLight intensity={0.18} color="#0d1411" />

      {/* Cool Rim Directional Light */}
      <directionalLight
        ref={dirLightRef}
        position={[6, 14, 8]}
        intensity={0.7}
        color="#cbd5e1"
      />

      {/* Restrained Doctor Doom Emerald Core Light */}
      <pointLight
        ref={pointLightRef}
        position={[0, 1.2, 1.4]}
        intensity={1.2}
        color="#00e575"
        distance={16}
        decay={2}
      />

      {/* Faint Gunmetal Silhouette Backlight */}
      <pointLight position={[0, 2.5, -4]} intensity={0.8} color="#18201d" distance={15} />

      {/* 3D Monolithic Elements */}
      <CitadelPillars scrollProgress={scrollProgress} />
      <DoomMaskSculpture scrollProgress={scrollProgress} />
      <EnergyVortex scrollProgress={scrollProgress} />
      <ArenaStage scrollProgress={scrollProgress} />
    </>
  );
};
