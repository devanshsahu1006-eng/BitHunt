import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EVENT_DATA } from '../../../api/event';

export const ProtocolSection = () => {
  return (
    <section id="protocol" className="py-32 px-6 sm:px-12 lg:px-20 relative z-10 select-none">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="eyebrow-inscriptional">
              The Protocol
            </span>
            <div className="h-[1px] w-8 bg-metallic-700" />
          </div>
          <h2 className="heading-display-lg text-3xl sm:text-5xl leading-tight">
            Structure of Engagement
          </h2>
          <p className="body-clean text-sm text-metallic-400 leading-relaxed">
            Two tiers of algorithmic warfare designed to evaluate speed, depth, and time complexity.
          </p>
        </div>

        {/* 4 Clean Metric Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5">
          {EVENT_DATA.competitionStats.map((stat) => (
            <div key={stat.id} className="space-y-2">
              <div className="eyebrow-inscriptional text-[11px] text-metallic-500">
                {stat.label}
              </div>
              <div className="heading-display-md text-3xl sm:text-4xl text-white">
                {stat.value}
              </div>
              <p className="body-clean text-xs text-metallic-400 pt-1">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Two-Round Linear Progression */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-4">
          
          {/* Round 1 */}
          <div className="md:col-span-5 p-8 sm:p-10 rounded-sm bg-[#060908] border border-white/5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between eyebrow-inscriptional text-xs text-metallic-400">
                <span>Tier 01</span>
                <span>90 Minutes</span>
              </div>
              <h3 className="heading-display-md text-3xl text-white">
                The Search
              </h3>
              <p className="body-clean text-sm text-metallic-400 leading-relaxed">
                Enter the arena. Decode the problems. Build the fastest path to an optimal solution. Candidates must prove baseline algorithmic accuracy and rapid pattern identification.
              </p>
            </div>
            <div className="eyebrow-inscriptional text-[10px] text-metallic-500 pt-4 border-t border-white/5">
              Primary Filter
            </div>
          </div>

          {/* Flow Connector */}
          <div className="md:col-span-2 flex items-center justify-center py-4 md:py-0">
            <div className="flex items-center gap-3 eyebrow-inscriptional text-xs text-metallic-500">
              <span className="hidden md:inline">Advance</span>
              <ArrowRight className="w-4 h-4 text-[#00e575]" />
            </div>
          </div>

          {/* Round 2 */}
          <div className="md:col-span-5 p-8 sm:p-10 rounded-sm bg-[#060908] border border-white/5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between eyebrow-inscriptional text-xs text-[#00e575]">
                <span>Tier 02</span>
                <span className="text-metallic-400">90 Minutes</span>
              </div>
              <h3 className="heading-display-md text-3xl text-white">
                The Conquest
              </h3>
              <p className="body-clean text-sm text-metallic-400 leading-relaxed">
                Push your limits, optimize your approach, and climb the final ranking. Complex constraints, edge cases, and memory limits define the championship podium.
              </p>
            </div>
            <div className="eyebrow-inscriptional text-[10px] text-[#00e575]/80 pt-4 border-t border-white/5">
              Championship Podium
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
