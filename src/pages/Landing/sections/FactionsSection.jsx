import React, { useState } from 'react';
import { EVENT_DATA } from '../../../api/event';
import { useAudio } from '../../../context/AudioContext';

export const FactionsSection = () => {
  const [activeId, setActiveId] = useState('doom');
  const { playHover, playClick } = useAudio();

  return (
    <section id="factions" className="py-32 px-6 sm:px-12 lg:px-20 relative z-10 select-none">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="eyebrow-inscriptional">
              The Three Ideologies
            </span>
            <div className="h-[1px] w-8 bg-metallic-700" />
          </div>
          <h2 className="heading-display-lg text-3xl sm:text-5xl leading-tight">
            Philosophy in the Face of Collapse
          </h2>
          <p className="body-clean text-sm text-metallic-400 leading-relaxed">
            Every candidate approaches the battlefield through an innate strategy. Choose the philosophy that governs your approach.
          </p>
        </div>

        {/* Monolithic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EVENT_DATA.dossierFactions.map((faction) => {
            const isSelected = activeId === faction.id;

            return (
              <div
                key={faction.id}
                onClick={() => {
                  playClick();
                  setActiveId(faction.id);
                }}
                onMouseEnter={playHover}
                className={`p-8 sm:p-10 rounded-sm bg-[#070b09] border transition-all duration-700 flex flex-col justify-between cursor-pointer space-y-12 ${
                  isSelected
                    ? 'border-[#00e575]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#090e0c]'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between eyebrow-inscriptional text-[11px] text-metallic-400">
                    <span>{faction.role}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>

                  <h3 className="heading-display-md text-2xl sm:text-3xl text-white">
                    {faction.name}
                  </h3>

                  <p className="text-sm text-metallic-300 font-serif italic leading-relaxed pt-2 border-l border-white/10 pl-4">
                    "{faction.quote}"
                  </p>
                </div>

                <div className="space-y-2 pt-6 border-t border-white/5">
                  <span className="eyebrow-inscriptional text-[10px] text-metallic-500 block">
                    Strategic Paradigm
                  </span>
                  <p className="body-clean text-xs text-metallic-400 leading-relaxed">
                    {faction.archetype}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
