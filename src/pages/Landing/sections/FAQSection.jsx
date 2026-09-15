import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { EVENT_DATA } from '../../../api/event';
import { useAudio } from '../../../context/AudioContext';

export const FAQSection = () => {
  const [openId, setOpenId] = useState(1);
  const { playClick } = useAudio();

  const toggle = (id) => {
    playClick();
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-32 px-6 sm:px-12 lg:px-20 relative z-10 select-none">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="eyebrow-inscriptional">
              Inquiries
            </span>
            <div className="h-[1px] w-8 bg-metallic-700" />
          </div>
          <h2 className="heading-display-lg text-3xl sm:text-5xl leading-tight">
            Frequently Addressed Questions
          </h2>
          <p className="body-clean text-sm text-metallic-400 leading-relaxed">
            Essential intelligence on eligibility, competition rules, and platform support.
          </p>
        </div>

        {/* Minimal Hairline Accordion List */}
        <div className="divide-y divide-white/5 border-y border-white/5">
          {EVENT_DATA.faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="py-6">
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between text-left gap-6 group focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span className="eyebrow-inscriptional text-xs text-metallic-500">
                      {faq.number}
                    </span>
                    <span className="heading-display-sm text-lg sm:text-xl text-white group-hover:text-[#00e575] transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  <div className="text-metallic-500 group-hover:text-white transition-colors shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-4 pl-12 sm:pl-16 pr-6 body-editorial text-sm text-metallic-300 leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
