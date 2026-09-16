import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';

/**
 * ContinuousPhysicalIlluminationLoader
 * A single, continuous physical illumination event simulating a mysterious energy source
 * awakening in complete darkness and gradually illuminating Doctor Doom, the metallic mask,
 * surrounding fog, and the environment via continuous mathematical smoothstep interpolation.
 * 
 * Animation Sequence:
 * 1. Dark screen (0.00 - 0.15)
 * 2. Doctor Doom eyes begin glowing (0.12 - 0.20)
 * 3. IIT Dharwad — Team Parsec subtly appears with prestige & high contrast (0.16 - 0.44)
 * 4. Environment gradually illuminates (0.35 - 0.70)
 * 5. BIT HUNT monumental logotype appears with strong emphasis (0.56 - 0.84)
 * 6. ENTER THE HUNT call-to-action activates (0.78 - 1.00)
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
    teamProgress: 0,
    titleProgress: 0,
    ctaProgress: 0,
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

      // 1. IIT Dharwad — Team Parsec branding begins early (rawProgress ~0.16 -> 0.44)
      // Emerges right as eyes ignite in the darkness with pristine clarity
      const teamProgress = Math.max(0, Math.min(1, (rawProgress - 0.16) / 0.28));

      // 2. BIT HUNT monumental title emerges after environmental lighting advances (rawProgress ~0.56 -> 0.84)
      const titleProgress = Math.max(0, Math.min(1, (rawProgress - 0.56) / 0.28));

      // 3. CTA and tagline emerge smoothly at the end (rawProgress ~0.78 -> 0.98)
      const ctaProgress = Math.max(0, Math.min(1, (rawProgress - 0.78) / 0.20));

      setIllumination({
        progress: eased,
        maskRadius: radius,
        feather,
        brightness,
        ambientGlow,
        teamProgress,
        titleProgress,
        ctaProgress,
      });

      if (rawProgress < 1) {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, []);

  // Keyboard shortcut (ESC to skip or Enter to proceed once title is visible)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleEnterHunt();
      } else if (e.key === 'Enter' && illumination.titleProgress > 0.5) {
        handleEnterHunt();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [illumination.titleProgress]);

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

  const { maskRadius, feather, brightness, ambientGlow, teamProgress, titleProgress, ctaProgress } = illumination;

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
          className="btn-inscriptional text-xs text-metallic-400 hover:text-white tracking-[0.2em] transition-colors px-3.5 py-1.5 rounded border border-white/10 hover:border-white/25 bg-black/50 backdrop-blur-sm"
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

      {/* =========================================================================
          Continuous Cinematic Editorial Typography Reveal
          Hierarchy:
          1. IIT Dharwad · Team Parsec (Official host plaque - early reveal)
          2. BIT HUNT (Monumental title)
          3. Tagline & ENTER THE HUNT (Tertiary action)
         ========================================================================= */}
      <div className="absolute bottom-12 sm:bottom-16 inset-x-0 z-40 flex flex-col items-center justify-center text-center px-4 space-y-4 sm:space-y-6">
        
        {/* =========================================================================
            1. OFFICIAL INSTITUTIONAL & HOST IDENTITY: IIT DHARWAD — TEAM PARSEC
            Appears early with subtle blur -> sharp, crisp contrast, and fine emerald accents.
           ========================================================================= */}
        <div
          className="flex flex-col items-center justify-center transition-all duration-700 ease-out"
          style={{
            opacity: teamProgress,
            filter: `blur(${(1 - teamProgress) * 6}px)`,
            transform: `translateY(${(1 - teamProgress) * 12}px)`,
          }}
        >
          {/* Frosted Titanium Institutional Plaque */}
          <div className="relative px-6 sm:px-9 py-2.5 sm:py-3 rounded-sm bg-[#050807]/85 border border-white/15 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.95)] flex flex-col items-center space-y-1.5">
            
            {/* Restrained Emerald Top Accent Line */}
            <div
              className="absolute -top-[1px] inset-x-8 sm:inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-[#00e575] to-transparent transition-opacity duration-700"
              style={{ opacity: 0.3 + teamProgress * 0.7 }}
            />

            {/* Primary Institution Name */}
            <div className="flex items-center gap-3">
              <span className="font-inscriptional font-semibold text-xs sm:text-sm md:text-base tracking-[0.32em] text-white select-none drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                IIT DHARWAD
              </span>
            </div>

            {/* Sub-tier: Organizing Team with subtle emerald power accent */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 pt-0.5">
              <div className="w-5 sm:w-8 h-[1px] bg-gradient-to-r from-transparent to-[#00e575]/60" />
              <span className="font-inscriptional font-medium text-[10px] sm:text-xs md:text-sm tracking-[0.28em] text-[#00e575] uppercase select-none drop-shadow-[0_0_12px_rgba(0,229,117,0.3)]">
                TEAM PARSEC
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.22em] text-metallic-400 uppercase hidden xs:inline">
                · 7.0
              </span>
              <div className="w-5 sm:w-8 h-[1px] bg-gradient-to-l from-transparent to-[#00e575]/60" />
            </div>

            {/* Bottom Refined Edge */}
            <div className="absolute -bottom-[1px] inset-x-12 sm:inset-x-16 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* =========================================================================
            2. MONUMENTAL BIT HUNT TITLE
            Appears with strong authority, chiseled titanium relief, and controlled kerning
           ========================================================================= */}
        <div
          className="space-y-3 transition-all duration-1000 ease-out"
          style={{
            opacity: titleProgress,
            filter: `blur(${(1 - titleProgress) * 10}px)`,
            transform: `translateY(${(1 - titleProgress) * 16}px)`,
          }}
        >
          <h1 className="logotype-bithunt text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10.5rem] tracking-[0.035em] select-none">
            BIT<span className="logotype-spacer" />HUNT
          </h1>

          {/* Tagline */}
          <p className="text-xs sm:text-sm font-sans tracking-[0.18em] text-metallic-300/80 uppercase max-w-lg mx-auto leading-relaxed">
            The hunt begins. When the world falls apart, logic is the weapon.
          </p>
        </div>

        {/* =========================================================================
            3. ENTER THE HUNT CALL-TO-ACTION
            Reveals smoothly at final stage with dignified metallic hover
           ========================================================================= */}
        <div
          className="pt-1 sm:pt-2 transition-all duration-700 ease-out"
          style={{
            opacity: ctaProgress,
            filter: `blur(${(1 - ctaProgress) * 6}px)`,
            transform: `translateY(${(1 - ctaProgress) * 10}px) scale(${ctaProgress > 0.8 ? 1 : 0.96})`,
            pointerEvents: ctaProgress > 0.5 ? 'auto' : 'none',
          }}
        >
          <button
            onClick={handleEnterHunt}
            className="btn-inscriptional relative px-8 py-3.5 sm:px-12 sm:py-4 rounded-sm bg-metallic-800/80 text-white text-xs sm:text-sm tracking-[0.25em] hover:border-[#00e575]/80 hover:text-[#00e575] hover:bg-[#070a08] transition-all duration-500 cursor-pointer shadow-2xl border border-white/20"
          >
            Enter the Hunt
          </button>
        </div>

      </div>
    </div>
  );
};
