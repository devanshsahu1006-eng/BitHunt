import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';

/**
 * ContinuousPhysicalIlluminationLoader
 * A single, continuous physical illumination event simulating a mysterious energy source
 * awakening in complete darkness and gradually illuminating Doctor Doom, the metallic mask,
 * surrounding fog, and the environment via continuous mathematical smoothstep interpolation.
 */
export const CinematicLoader = ({ onComplete }) => {
  const { playEnergySurge, playClick } = useAudio();

  // Continuous illumination state (updated every frame via rAF)
  const [illumination, setIllumination] = useState({
    progress: 0,
    maskRadius: 0,
    feather: 10,
    brightness: 0,
    ambientGlow: 0,
    textProgress: 0,
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const audioTriggered = useRef(false);

  // 5th-order smootherstep interpolation for ultra-smooth physical easing
  const smootherstep = (t) => {
    const x = Math.max(0, Math.min(1, t));
    return x * x * x * (x * (x * 6 - 15) + 10);
  };

  useEffect(() => {
    let animId;
    const startTimestamp = performance.now();
    const duration = 6200; // 6.2 seconds for full, majestic continuous lighting

    const tick = (now) => {
      const elapsed = now - startTimestamp;
      const rawProgress = Math.min(1, elapsed / duration);
      const eased = smootherstep(rawProgress);

      // Trigger ambient sound cue smoothly once light awakens
      if (rawProgress > 0.12 && !audioTriggered.current) {
        audioTriggered.current = true;
        playEnergySurge();
      }

      // Continuous physical light calculations:
      // Radius grows from 0% in total darkness -> 8% (eyes) -> 28% (faceplate) -> 65% (chains/shoulders) -> 140% (environment)
      const radius = eased * 140;
      // Feather expands from soft 12% to wide 35% as light diffuses through atmospheric fog
      const feather = 12 + eased * 24;
      // Exposure smoothly lifts from 0 -> 1.05
      const brightness = Math.min(1.05, eased * 1.15);
      // Ambient green glow blooms organically
      const ambientGlow = Math.min(0.35, Math.sin(eased * Math.PI * 0.85) * 0.4);
      // Typography begins resolving after character is sufficiently illuminated (eased > 0.7)
      const textProgress = Math.max(0, (eased - 0.65) / 0.35);

      setIllumination({
        progress: eased,
        maskRadius: radius,
        feather,
        brightness,
        ambientGlow,
        textProgress,
      });

      if (rawProgress < 1) {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, []);

  // Keyboard shortcut (ESC to skip or Enter to proceed if typography is visible)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleEnterHunt();
      } else if (e.key === 'Enter' && illumination.textProgress > 0.6) {
        handleEnterHunt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [illumination.textProgress]);

  // Subtle mouse drift for cinematic camera parallax
  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMouseOffset({ x, y });
  };

  // Organic Particle Embers catching the expanding light
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    const particles = [];
    const count = window.innerWidth < 768 ? 25 : 55;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.2, // slow upward drift
        size: Math.random() * 2 + 0.8,
        baseAlpha: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Particle visibility tracks continuous light progress
      const lightFactor = illumination.progress;

      if (lightFactor > 0.05) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx + mouseOffset.x * 0.15;
          p.y += p.vy;

          if (p.y < 0) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#00e575';
          ctx.globalAlpha = p.baseAlpha * lightFactor * 0.5;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [illumination.progress, mouseOffset]);

  // Transition to main 3D environment
  const handleEnterHunt = () => {
    if (isTransitioning) return;
    playClick();
    playEnergySurge();
    setFlashActive(true);
    setIsTransitioning(true);

    setTimeout(() => {
      setFlashActive(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 450);
  };

  const { maskRadius, feather, brightness, ambientGlow, textProgress } = illumination;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-[100] bg-[#030504] overflow-hidden select-none transition-all duration-1000 ease-out ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle green pulse on transition */}
      {flashActive && (
        <div className="absolute inset-0 z-50 bg-[#00e575]/40 animate-flash pointer-events-none" />
      )}

      {/* Subtle skip button */}
      <div className="absolute top-8 right-8 z-40">
        <button
          onClick={handleEnterHunt}
          className="text-xs font-cinematic text-metallic-400 hover:text-white tracking-[0.2em] uppercase transition-colors px-3 py-1.5 rounded border border-white/5 hover:border-white/20 bg-black/40 backdrop-blur-sm"
        >
          Skip Intro
        </button>
      </div>

      {/* Centerpiece Image Container with Continuous Radial Illumination */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 6}px, ${mouseOffset.y * 4}px) scale(1.02)`,
        }}
      >
        <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
          
          {/* Continuous Radial Masked Portrait */}
          <img
            src="/images/doom-bg.webp"
            alt="Doctor Doom"
            className="w-full h-full object-cover object-center max-h-screen will-change-transform"
            style={{
              opacity: maskRadius > 0.5 ? 1 : 0,
              WebkitMaskImage: `radial-gradient(circle at 50% 32.5%, black ${maskRadius.toFixed(1)}%, transparent ${(maskRadius + feather).toFixed(1)}%)`,
              maskImage: `radial-gradient(circle at 50% 32.5%, black ${maskRadius.toFixed(1)}%, transparent ${(maskRadius + feather).toFixed(1)}%)`,
              filter: `contrast(1.18) brightness(${brightness.toFixed(2)})`,
            }}
          />

          {/* Physical Ambient Light Diffusion around face & hood */}
          {maskRadius > 2 && (
            <div
              className="absolute rounded-full pointer-events-none transition-all duration-300 ease-out"
              style={{
                left: '50.5%',
                top: '32.2%',
                transform: 'translate(-50%, -50%)',
                width: `${Math.max(80, maskRadius * 5.2)}px`,
                height: `${Math.max(60, maskRadius * 4.0)}px`,
                background: 'radial-gradient(ellipse at center, rgba(0,229,117,0.22) 0%, rgba(16,185,129,0.08) 45%, transparent 70%)',
                filter: 'blur(24px)',
                opacity: ambientGlow.toFixed(2),
              }}
            />
          )}

          {/* Natural Vignette blend with dark environment */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030504] via-transparent to-[#030504]/90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030504] via-transparent to-[#030504] pointer-events-none" />
        </div>
      </div>

      {/* Atmospheric Ember Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />

      {/* Atmospheric Smoke Gradient at base */}
      <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#030504] via-[#030504]/80 to-transparent pointer-events-none z-20" />

      {/* Continuous Cinematic Editorial Typography Reveal */}
      <div className="absolute bottom-14 sm:bottom-20 inset-x-0 z-40 flex flex-col items-center justify-center text-center px-4">
        
        <div
          className="space-y-3 transition-transform duration-1000 ease-out"
          style={{
            opacity: textProgress,
            filter: `blur(${(1 - textProgress) * 12}px)`,
            transform: `translateY(${(1 - textProgress) * 16}px)`,
          }}
        >
          {/* Subtitle / Edition */}
          <div className="text-xs sm:text-sm font-cinematic uppercase tracking-[0.35em] text-metallic-400">
            Parsec 7.0 · IIT Dharwad
          </div>

          {/* Monumental Cinematic Title */}
          <h1
            className="text-5xl sm:text-7xl lg:text-9xl font-cinematic font-bold tracking-tight text-white select-none transition-all duration-700"
            style={{
              letterSpacing: `${0.12 + textProgress * 0.14}em`,
            }}
          >
            BIT HUNT
          </h1>

          {/* Tagline */}
          <p className="text-xs sm:text-sm font-sans tracking-[0.2em] text-metallic-300/80 uppercase max-w-lg mx-auto">
            The hunt begins. When the world falls apart, logic is the weapon.
          </p>
        </div>

        {/* Enter the Hunt Action */}
        <div
          className="pt-8 transition-all duration-700 ease-out"
          style={{
            opacity: textProgress > 0.8 ? 1 : 0,
            transform: `scale(${textProgress > 0.8 ? 1 : 0.95})`,
            pointerEvents: textProgress > 0.8 ? 'auto' : 'none',
          }}
        >
          <button
            onClick={handleEnterHunt}
            className="relative px-8 py-3.5 sm:px-12 sm:py-4 rounded-sm bg-metallic-800/80 text-white font-cinematic font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase border border-white/20 hover:border-[#00e575]/80 hover:text-[#00e575] hover:bg-[#070a08] transition-all duration-500 cursor-pointer shadow-2xl"
          >
            Enter the Hunt
          </button>
        </div>
      </div>
    </div>
  );
};
