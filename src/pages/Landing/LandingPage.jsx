import React, { useState, useEffect } from 'react';
import { CinematicScrollBackground } from '../../components/3d/CinematicScrollBackground';
import { HeroSection } from './sections/HeroSection';
import { MissionSection } from './sections/MissionSection';
import { FactionsSection } from './sections/FactionsSection';
import { ProtocolSection } from './sections/ProtocolSection';
import { RulesSection } from './sections/RulesSection';
import { FAQSection } from './sections/FAQSection';
import { RegisterSection } from './sections/RegisterSection';

export const LandingPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-metallic-200">
      {/* 3-Scene Continuous Cinematic Background System */}
      <CinematicScrollBackground scrollProgress={scrollProgress} />

      {/* Foreground Content Flow */}
      <div className="relative z-10">
        <HeroSection />
        <MissionSection />
        <FactionsSection />
        <ProtocolSection />
        <RulesSection />
        <FAQSection />
        <RegisterSection />
      </div>
    </div>
  );
};
