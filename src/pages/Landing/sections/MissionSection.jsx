import React from 'react';

export const MissionSection = () => {
  return (
    <section id="about" className="py-32 px-6 sm:px-12 lg:px-20 relative z-10 select-none">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Editorial Eyebrow & Headline */}
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-4">
            <span className="eyebrow-inscriptional">
              The Crucible
            </span>
            <div className="h-[1px] w-8 bg-metallic-700" />
          </div>

          <h2 className="heading-display-lg text-3xl sm:text-5xl lg:text-6xl leading-tight">
            When the system collapses,<br />
            <span className="text-chiseled-metallic">logic becomes the weapon.</span>
          </h2>

          <p className="body-editorial-lead text-metallic-300 max-w-3xl leading-relaxed pt-2">
            BitHunt challenges algorithmic mastery, deep data structures, and the ability to solve under relentless temporal pressure. Hosted by Team Parsec at IIT Dharwad, it is not simply an endurance contest—it is an arena where elegance, computational frugality, and mathematical intuition define survival.
          </p>
        </div>

        {/* Cinematic Central Decree / Quote */}
        <div className="py-12 border-y border-white/5 relative">
          <div className="max-w-3xl space-y-4">
            <blockquote className="quote-inscriptional text-2xl sm:text-4xl leading-snug">
              "The world does not need another hero.<br />
              <span className="text-[#00e575]/90">It needs a solution.</span>"
            </blockquote>
            <p className="eyebrow-inscriptional text-[11px] text-metallic-400">
              Victor Von Doom
            </p>
          </div>
        </div>

        {/* Three Core Disciplines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
          <div className="space-y-4">
            <div className="heading-display-sm text-sm text-white tracking-[0.18em] uppercase">
              01 · Algorithmic Mastery
            </div>
            <p className="body-clean text-metallic-400 leading-relaxed">
              Problems formulated around advanced graph networks, dynamic programming under spatial bounds, and number-theoretic proofs.
            </p>
          </div>

          <div className="space-y-4">
            <div className="heading-display-sm text-sm text-white tracking-[0.18em] uppercase">
              02 · Temporal Endurance
            </div>
            <p className="body-clean text-metallic-400 leading-relaxed">
              Three continuous hours. Every submission incurs temporal weight; optimal solutions require unwavering clarity under pressure.
            </p>
          </div>

          <div className="space-y-4">
            <div className="heading-display-sm text-sm text-white tracking-[0.18em] uppercase">
              03 · Open Architecture
            </div>
            <p className="body-clean text-metallic-400 leading-relaxed">
              No language discrimination. Bring your sharpest proficiency in C++, Python, Java, Rust, or modern ES6 runtimes.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
