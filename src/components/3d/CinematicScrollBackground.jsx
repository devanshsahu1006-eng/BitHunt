import React, { useEffect, useRef, useState } from 'react';

/**
 * Smoothstep interpolation helper
 */
const smoothstep = (min, max, value) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

/**
 * Lerp helper
 */
const lerp = (start, end, factor) => start + (end - start) * factor;

/**
 * CinematicScrollBackground
 * Continuous atmospheric environment blending 3 Doctor Doom / Doomsday scenes across page scroll.
 * 
 * Scene 1 (0.00 - 0.48): Citadel / Lab Awakening (slow zoom-out, subtle upward drift, rack focus)
 * Scene 2 (0.22 - 0.78): Power Stance & Lightning (slow push-in, parallax drift, lightning surges)
 * Scene 3 (0.55 - 1.00): Multiverse Cosmic Convergence (epic pull-back revealing gargantuan scale)
 */
export const CinematicScrollBackground = ({ scrollProgress = 0 }) => {
  const canvasRef = useRef(null);

  // Smooth lerped progress state for 60 FPS camera inertia
  const targetProgress = useRef(scrollProgress);
  const currentProgress = useRef(scrollProgress);

  // Smooth mouse micro-parallax coordinates
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  const [renderProgress, setRenderProgress] = useState(scrollProgress);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [lightningFlash, setLightningFlash] = useState(0);

  // Keep scroll target updated
  useEffect(() => {
    targetProgress.current = scrollProgress;
  }, [scrollProgress]);

  // Track subtle mouse movement for 3D depth parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const normY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      targetMouse.current = { x: normX, y: normY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main 60 FPS animation loop for camera lerping, mouse parallax, and atmospheric canvas particles
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas to viewport
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize 45 atmospheric dust & emerald ember particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.45 + 0.25),
      speedX: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.25,
      pulseSpeed: Math.random() * 0.02 + 0.015,
      pulsePhase: Math.random() * Math.PI * 2,
      isEmber: Math.random() > 0.35, // emerald ember vs cold dust
    }));

    let clock = 0;
    let lastP = currentProgress.current;

    const render = () => {
      clock += 0.016;

      // Smooth camera interpolation with gentle physical inertia
      currentProgress.current = lerp(currentProgress.current, targetProgress.current, 0.075);
      const p = currentProgress.current;
      setRenderProgress(p);

      // Smooth mouse parallax interpolation
      currentMouse.current.x = lerp(currentMouse.current.x, targetMouse.current.x, 0.04);
      currentMouse.current.y = lerp(currentMouse.current.y, targetMouse.current.y, 0.04);
      setMouseOffset({ x: currentMouse.current.x, y: currentMouse.current.y });

      // Scroll velocity for dynamic particle turbulence
      const scrollVelocity = Math.abs(p - lastP) * 80;
      lastP = p;

      // Lightning flash in Scene 2 zone (0.28 to 0.72)
      if (p >= 0.28 && p <= 0.72) {
        // Intermittent lightning surges
        const noiseVal = Math.sin(clock * 7.5) * Math.cos(clock * 13.2);
        const flash = noiseVal > 0.85 ? (noiseVal - 0.85) * 4.5 : 0;
        setLightningFlash(flash);
      } else {
        setLightningFlash(0);
      }

      // Render atmospheric particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Energy intensity increases with scroll progression (weak -> medium -> cosmic)
      const energyMultiplier = 0.6 + p * 1.3 + scrollVelocity;

      particles.forEach((pt) => {
        // Update positions
        pt.y += pt.speedY * energyMultiplier;
        pt.x += pt.speedX + currentMouse.current.x * 0.2;
        pt.pulsePhase += pt.pulseSpeed;

        // Wrap around boundaries
        if (pt.y < -10) {
          pt.y = canvas.height + 10;
          pt.x = Math.random() * canvas.width;
        }
        if (pt.x < -10) pt.x = canvas.width + 10;
        if (pt.x > canvas.width + 10) pt.x = -10;

        // Pulsing glow
        const currentOpacity = Math.max(0.1, pt.opacity * (0.8 + Math.sin(pt.pulsePhase) * 0.4));

        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);

        if (pt.isEmber) {
          // Emerald energy ember
          ctx.fillStyle = `rgba(0, 229, 117, ${currentOpacity * 0.75})`;
          ctx.shadowColor = '#00e575';
          ctx.shadowBlur = (6 + pt.size * 2) * (0.8 + p * 0.6);
        } else {
          // Cold metallic atmospheric dust
          ctx.fillStyle = `rgba(180, 205, 195, ${currentOpacity * 0.4})`;
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const p = renderProgress;
  const mx = mouseOffset.x;
  const my = mouseOffset.y;

  // ==========================================
  // SCENE 1: Citadel Awakening (0.00 - 0.48)
  // Slow zoom-out + subtle drift + rack focus
  // ==========================================
  const s1Opacity = p <= 0.25 ? 1 : 1 - smoothstep(0.25, 0.48, p);
  const s1Scale = 1.09 - (p / 0.48) * 0.09;
  const s1TranslateY = (p / 0.48) * -3.5 + my * 0.8;
  const s1TranslateX = mx * 1.2;
  const s1Blur = p > 0.25 ? smoothstep(0.25, 0.48, p) * 6 : 0;

  // ==========================================
  // SCENE 2: The Stance of Power (0.22 - 0.78)
  // Push-in + horizontal parallax + storm surge
  // ==========================================
  const s2FadeIn = smoothstep(0.22, 0.42, p);
  const s2FadeOut = p <= 0.60 ? 1 : 1 - smoothstep(0.60, 0.78, p);
  const s2Opacity = s2FadeIn * s2FadeOut;
  const s2Progression = Math.max(0, Math.min(1, (p - 0.22) / 0.56));
  const s2Scale = 1.00 + s2Progression * 0.08;
  const s2TranslateX = (s2Progression - 0.5) * 3.0 + mx * 1.8;
  const s2TranslateY = s2Progression * -2.5 + my * 1.0;
  const s2Blur = (1 - s2FadeIn) * 5 + (1 - s2FadeOut) * 5;

  // ==========================================
  // SCENE 3: Multiverse Cosmic Convergence (0.55 - 1.00)
  // Pull-back to unveil colossal cosmic scale
  // ==========================================
  const s3Opacity = smoothstep(0.55, 0.75, p);
  const s3Progression = Math.max(0, Math.min(1, (p - 0.55) / 0.45));
  const s3Scale = 1.12 - s3Progression * 0.10; // pull-back
  const s3TranslateX = mx * 2.2;
  const s3TranslateY = (1 - s3Progression) * 2.5 + my * 1.2;
  const s3Blur = (1 - s3Opacity) * 5;

  // ==========================================
  // PROGRESSIVE GREEN ENERGY OVERLAY
  // Level 1: Weak subdued glow (0.14)
  // Level 2: Medium lightning energy (0.32) + lightning flash
  // Level 3: Intense cosmic radiance (0.55)
  // ==========================================
  const baseEnergy = 0.14 + Math.pow(p, 1.4) * 0.44;
  const energyOpacity = Math.min(1, baseEnergy + lightningFlash * 0.25);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030504]"
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      {/* ==================== SCENE 1 LAYER ==================== */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          opacity: s1Opacity,
          transform: `translate3d(${s1TranslateX}%, ${s1TranslateY}%, 0) scale(${s1Scale})`,
          transformOrigin: '50% 35%',
          filter: `brightness(0.95) contrast(1.15) ${s1Blur > 0.1 ? `blur(${s1Blur.toFixed(1)}px)` : ''}`,
          display: s1Opacity <= 0.001 ? 'none' : 'block',
        }}
      >
        <img
          src="/images/doom-scene-1.webp"
          alt="Doctor Doom Citadel Awakening"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* ==================== SCENE 2 LAYER ==================== */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          opacity: s2Opacity,
          transform: `translate3d(${s2TranslateX}%, ${s2TranslateY}%, 0) scale(${s2Scale})`,
          transformOrigin: '50% 50%',
          filter: `brightness(${1.0 + lightningFlash * 0.3}) contrast(${1.2 + lightningFlash * 0.1}) ${s2Blur > 0.1 ? `blur(${s2Blur.toFixed(1)}px)` : ''}`,
          display: s2Opacity <= 0.001 ? 'none' : 'block',
        }}
      >
        <img
          src="/images/doom-scene-2.webp"
          alt="Doctor Doom Power Stance"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* ==================== SCENE 3 LAYER ==================== */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          opacity: s3Opacity,
          transform: `translate3d(${s3TranslateX}%, ${s3TranslateY}%, 0) scale(${s3Scale})`,
          transformOrigin: '50% 60%',
          filter: `brightness(1.05) contrast(1.25) saturate(1.10) ${s3Blur > 0.1 ? `blur(${s3Blur.toFixed(1)}px)` : ''}`,
          display: s3Opacity <= 0.001 ? 'none' : 'block',
        }}
      >
        <img
          src="/images/doom-scene-3.webp"
          alt="Doctor Doom Cosmic Multiverse Convergence"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* ==================== PROGRESSIVE GREEN ENERGY FIELD ==================== */}
      <div
        className="absolute inset-0 mix-blend-screen transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: energyOpacity,
          background: `
            radial-gradient(ellipse 65% 55% at 50% 45%, rgba(0, 229, 117, ${0.4 + lightningFlash * 0.3}) 0%, rgba(0, 160, 80, 0.15) 50%, transparent 80%),
            radial-gradient(circle 350px at 50% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)
          `,
        }}
      />

      {/* ==================== ATMOSPHERIC CANVAS PARTICLES & EMBERS ==================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-85"
      />

      {/* ==================== CINEMATIC LEGIBILITY VIGNETTE & CONTRAST MASKS ==================== */}
      {/* Ensures all foreground text, cards, and UI are 100% crisp and readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 45%, rgba(3, 5, 4, 0.35) 0%, rgba(3, 5, 4, 0.72) 70%, rgba(3, 5, 4, 0.95) 100%)
          `,
        }}
      />

      {/* Top and bottom subtle edge fades */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#030504]/90 via-[#030504]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030504] via-[#030504]/80 to-transparent pointer-events-none" />

      {/* Subtle fine film grain / texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '3px 3px',
        }}
      />
    </div>
  );
};
