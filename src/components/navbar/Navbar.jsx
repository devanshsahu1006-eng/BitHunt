import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { isMuted, toggleMute, playClick } = useAudio();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'The Crucible', href: '/#about' },
    { label: 'Ideologies', href: '/#factions' },
    { label: 'Protocol', href: '/#protocol' },
    { label: 'The Mandate', href: '/#rules' },
    { label: 'Inquiries', href: '/#faq' },
    { label: 'Arena', href: '/contest' },
  ];

  const handleNavClick = (href) => {
    playClick();
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const id = href.replace('/#', '');
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const id = href.replace('/#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-700 ${
        scrolled
          ? 'bg-[#030504]/90 backdrop-blur-md border-b border-white/5 py-4 shadow-[0_15px_35px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 select-none group"
          onClick={() => playClick()}
        >
          <span className="font-inscriptional font-bold text-lg sm:text-xl tracking-[0.15em] text-white group-hover:text-[#00e575] transition-colors">
            BIT<span className="inline-block w-[0.25em]" />HUNT
          </span>
          <span className="w-1 h-1 rounded-full bg-[#00e575] opacity-60 hidden sm:inline" />
          <span className="font-sans text-[11px] text-metallic-400 tracking-[0.22em] uppercase hidden sm:inline">
            Parsec 7.0
          </span>
        </Link>

        {/* Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isArena = link.href === '/contest';
            const isActive = location.pathname === link.href;

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`text-[11px] font-sans tracking-[0.18em] uppercase transition-all duration-300 relative py-1 ${
                  isActive
                    ? 'text-[#00e575] font-semibold'
                    : isArena
                    ? 'text-white hover:text-[#00e575] font-semibold'
                    : 'text-metallic-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[1px] bg-[#00e575]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-5">
          {/* Audio toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isMuted
                ? 'border-white/5 text-metallic-500 hover:text-white hover:border-white/20'
                : 'border-[#00e575]/40 text-[#00e575] bg-[#00e575]/5'
            }`}
            title={isMuted ? 'Activate Sound' : 'Mute Ambience'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* User Status / Action */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                onClick={() => playClick()}
                className="text-xs font-cinematic uppercase tracking-[0.2em] text-white hover:text-[#00e575] transition-colors"
              >
                Portal
              </Link>
              <button
                onClick={() => {
                  playClick();
                  logout();
                }}
                className="text-[11px] font-sans text-metallic-500 hover:text-red-400 uppercase tracking-wider"
              >
                Exit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                onClick={() => playClick()}
                className="text-xs font-sans tracking-[0.2em] uppercase text-metallic-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => playClick()}
                className="px-4 py-2 rounded-sm bg-white/5 border border-white/10 hover:border-[#00e575]/60 hover:text-[#00e575] text-xs font-cinematic tracking-[0.2em] uppercase text-white transition-all duration-300"
              >
                Enlist
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleMute}
            className="p-1.5 text-metallic-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00e575]" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-metallic-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#030504]/98 border-b border-white/10 px-8 py-8 space-y-4 backdrop-blur-xl">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left py-2 text-xs font-cinematic tracking-[0.25em] uppercase text-metallic-300 hover:text-[#00e575] border-b border-white/5"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-sans tracking-[0.2em] uppercase text-metallic-400"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-sm bg-white/5 border border-white/10 text-xs font-cinematic tracking-[0.2em] uppercase text-white"
            >
              Enlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
