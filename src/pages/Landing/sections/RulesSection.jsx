import React from 'react';
import { EVENT_DATA } from '../../../api/event';

export const RulesSection = () => {
  return (
    <section id="rules" className="py-32 px-6 sm:px-12 lg:px-20 relative z-10 select-none">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <span className="eyebrow-inscriptional">
              The Mandate
            </span>
            <div className="h-[1px] w-8 bg-metallic-700" />
          </div>
          <h2 className="heading-display-lg text-3xl sm:text-5xl leading-tight">
            Rules of Engagement
          </h2>
          <p className="body-clean text-sm text-metallic-400 leading-relaxed">
            Inviolable constraints governing all participants during the competition.
          </p>
        </div>

        {/* 4 Clean Editorial Rule Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 border-t border-white/5 pt-12">
          {EVENT_DATA.rules.map((rule) => (
            <div key={rule.number} className="space-y-3">
              <div className="eyebrow-inscriptional text-xs text-[#00e575] tracking-[0.22em]">
                {rule.number}
              </div>
              <h3 className="heading-display-sm text-xl sm:text-2xl text-white">
                {rule.title}
              </h3>
              <p className="body-clean text-sm text-metallic-400 leading-relaxed">
                {rule.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
