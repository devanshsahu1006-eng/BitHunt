import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { DoomWorld } from './DoomWorld';

/**
 * SceneContainer
 * Responsive 3D Canvas mounted behind page content with scroll synchronization
 */
export const SceneContainer = ({ scrollProgress = 0 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-doom-950">
      <Canvas
        camera={{ position: [0, 1.2, 12], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <DoomWorld scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
};
