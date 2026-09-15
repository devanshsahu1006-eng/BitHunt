import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="top" className="min-h-screen relative flex items-end pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden select-none">
      
      {/* Subtle volumetric dark falloff for hero text contrast */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#030504] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030504]/70 via-transparent to-transparent" />
      </div>

      {/* Cinematic Composition */}
      <div className="max-w-7xl w-full z-10 space-y-8">
        
        {/* Editorial Subheader */}
        <div className="space-y-2 animate-cinematic-subtle">
          <p className="eyebrow-inscriptional">
            Team Parsec · IIT Dharwad
          </p>
          <div className="w-12 h-[1px] bg-[#00e575]/60" />
        </div>

        {/* Monumental Headline */}
        <div className="space-y-4">
          <h1 className="logotype-bithunt animate-cinematic-emerge text-[4rem] sm:text-[6.5rem] md:text-[8.5rem] lg:text-[10rem] xl:text-[11.5rem] select-none">
            BIT<span className="logotype-spacer" />HUNT
          </h1>
          <p className="subtitle-inscriptional text-lg sm:text-2xl lg:text-3xl animate-cinematic-subtle">
            The Hunt Begins.
          </p>
        </div>

        {/* Narrative Lead - Clean, highly readable Inter body */}
        <p className="body-editorial-lead max-w-xl font-sans text-metallic-300 leading-relaxed pt-2">
          An elite competitive programming crucible engineered to test algorithmic intuition, complex data structures, and mental composure under absolute pressure.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-6 pt-4">
          <button
            onClick={() => navigate('/contest')}
            className="btn-inscriptional px-8 py-4 rounded-sm bg-white/5 border border-white/20 hover:border-[#00e575] text-white hover:text-[#00e575] text-xs shadow-xl cursor-pointer"
          >
            Enter the Arena
          </button>

          <a
            href="#about"
            className="text-xs font-sans uppercase tracking-[0.2em] text-metallic-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>The Crucible</span>
            <ArrowDown className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Bottom Quiet Scroll Indicator */}
      <div className="absolute bottom-8 right-8 hidden sm:flex items-center gap-3 text-[11px] font-sans text-metallic-500 tracking-[0.25em] uppercase pointer-events-none">
        <span>Scroll to descend</span>
        <div className="w-6 h-[1px] bg-metallic-700" />
      </div>
    </section>
  );
};
