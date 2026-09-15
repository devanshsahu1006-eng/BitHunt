import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENT_DATA } from '../../../api/event';

export const RegisterSection = () => {
  const navigate = useNavigate();

  return (
    <section id="register" className="pt-32 pb-16 px-6 sm:px-12 lg:px-20 relative z-10 select-none">
      <div className="max-w-5xl mx-auto text-center space-y-12">
        
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-metallic-700" />
          <span className="eyebrow-inscriptional">
            The Horizon · Parsec 7.0
          </span>
          <div className="h-[1px] w-8 bg-metallic-700" />
        </div>

        {/* Monumental Headline */}
        <div className="space-y-4">
          <h2 className="heading-display-xl text-4xl sm:text-7xl lg:text-8xl text-white tracking-[0.035em] leading-none">
            READY TO HUNT?
          </h2>
          <p className="body-editorial-lead text-metallic-300 max-w-xl mx-auto leading-relaxed pt-2">
            The crucible awaits. Prepare your algorithms and assemble your squad before the protocol commences.
          </p>
        </div>

        {/* Editorial Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <button
            onClick={() => navigate('/register')}
            className="btn-inscriptional w-full sm:w-auto px-10 py-4 rounded-sm bg-white text-black font-bold text-xs sm:text-sm hover:bg-[#00e575] hover:text-black transition-all duration-500 cursor-pointer shadow-2xl"
          >
            Pre-Register (TBA)
          </button>

          <button
            onClick={() => navigate('/contest')}
            className="btn-inscriptional w-full sm:w-auto px-10 py-4 rounded-sm bg-white/5 border border-white/15 text-white font-medium text-xs sm:text-sm hover:border-[#00e575] hover:text-[#00e575] transition-all duration-500 cursor-pointer"
          >
            Explore the Arena
          </button>
        </div>

        {/* Clean Event Status Note */}
        <div className="pt-6 space-y-2 eyebrow-inscriptional text-[11px] text-metallic-500">
          <p>
            Event Date: <span className="text-white">{EVENT_DATA.registration.eventDate}</span> · Prizes: <span className="text-white">{EVENT_DATA.registration.prizes}</span>
          </p>
          <p>
            Teams of up to 4 candidates authorized
          </p>
        </div>

      </div>

      {/* Monumental, Quiet Footer */}
      <footer className="mt-32 pt-10 border-t border-white/5 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-sans text-metallic-500 tracking-wide">
        <div className="flex items-center gap-3">
          <span className="font-inscriptional font-bold text-white tracking-[0.16em]">BIT HUNT</span>
          <span className="w-1 h-1 rounded-full bg-metallic-700" />
          <span>Team Parsec · IIT Dharwad</span>
        </div>

        <div>
          <span>Official Inquiries: {EVENT_DATA.meta.contactNumber}</span>
        </div>

        <div>
          <span>© {EVENT_DATA.meta.copyrightYear} Parsec. All Rights Reserved.</span>
        </div>
      </footer>
    </section>
  );
};
