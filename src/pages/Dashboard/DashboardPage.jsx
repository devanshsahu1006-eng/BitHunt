import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  ArrowRight,
  LogOut,
  CheckCircle2,
  FileCode,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EVENT_DATA } from '../../api/event';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Live countdown to Parsec 7.0
  const [timeLeft, setTimeLeft] = useState({
    days: '24',
    hours: '14',
    minutes: '38',
    seconds: '19',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let sec = parseInt(prev.seconds, 10) - 1;
        if (sec < 0) sec = 59;
        return {
          ...prev,
          seconds: sec < 10 ? `0${sec}` : `${sec}`,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dispatches = [
    {
      id: 1,
      date: 'Latest',
      tag: 'Platform',
      title: 'Competition Sandbox Active',
      text: 'Compilers for C++20, Python 3.11, Java 17, and Node.js are synchronized with test clusters.',
    },
    {
      id: 2,
      date: 'Notice',
      tag: 'Protocol',
      title: 'Round 01: The Search Parameters',
      text: 'Round 1 will feature multi-testcase evaluation with strict time complexity limits.',
    },
    {
      id: 3,
      date: 'Advisory',
      tag: 'Integrity',
      title: 'Zero Tolerance Plagiarism Verification',
      text: 'All submissions are parsed through automated algorithmic similarity engines.',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Top Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-cinematic uppercase tracking-[0.25em] text-metallic-400">
            <span>Parsec 7.0 · Candidate Portal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e575]" />
            <span className="text-[#00e575]">Registration Confirmed</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-cinematic font-normal text-white">
            {user?.name || 'Victor Von Coder'}
          </h1>
          <p className="text-sm font-sans text-metallic-400 tracking-wide">
            Team: <span className="text-white">{user?.teamName || 'Parsec Protocol'}</span> · {user?.college || 'IIT Dharwad'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/contest')}
            className="px-6 py-3 rounded-sm bg-white text-black font-cinematic font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#00e575] hover:text-black transition-all duration-300 cursor-pointer shadow-xl"
          >
            Enter Arena
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-3 rounded-sm border border-white/10 text-xs font-cinematic text-metallic-400 hover:text-white uppercase tracking-[0.2em] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Grid: Profile Dossier & Event Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hunter Dossier */}
        <div className="lg:col-span-4 p-8 rounded-sm bg-[#070b09] border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-cinematic uppercase tracking-[0.25em] text-metallic-400 border-b border-white/5 pb-4">
              <span>Candidate Dossier</span>
              <span className="text-[#00e575]">Verified</span>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-metallic-500 uppercase tracking-wider">Candidate</span>
                <span className="text-white font-medium">{user?.name || 'Victor Von Coder'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-metallic-500 uppercase tracking-wider">Email</span>
                <span className="text-metallic-300">{user?.email || 'hunter@earth616.org'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-metallic-500 uppercase tracking-wider">Institution</span>
                <span className="text-white">{user?.college || 'IIT Dharwad'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-metallic-500 uppercase tracking-wider">Squad</span>
                <span className="text-[#00e575] font-medium">{user?.teamName || 'Parsec Protocol'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-metallic-500 uppercase tracking-wider">Doctrine</span>
                <span className="text-white">{user?.faction || 'The Strategist'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-metallic-500 uppercase tracking-wider">Standing</span>
                <span className="text-white font-semibold">Rank #7</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center gap-3 text-xs text-metallic-400">
            <ShieldCheck className="w-4 h-4 text-[#00e575] shrink-0" />
            <span>Pass authorized for Round 01: The Search</span>
          </div>
        </div>

        {/* Countdown & Event Status */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 sm:p-10 rounded-sm bg-[#070b09] border border-white/5 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-cinematic uppercase tracking-[0.25em] text-metallic-400">
                Championship Countdown
              </span>
              <span className="text-xs font-sans tracking-[0.2em] uppercase text-metallic-500">
                Team Parsec · IIT Dharwad
              </span>
            </div>

            {/* Countdown Digits */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-5 rounded-sm bg-[#040605] border border-white/5">
                <span className="text-3xl sm:text-5xl font-cinematic font-light text-white block">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-metallic-500 mt-2 block">
                  Days
                </span>
              </div>
              <div className="p-5 rounded-sm bg-[#040605] border border-white/5">
                <span className="text-3xl sm:text-5xl font-cinematic font-light text-white block">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-metallic-500 mt-2 block">
                  Hours
                </span>
              </div>
              <div className="p-5 rounded-sm bg-[#040605] border border-white/5">
                <span className="text-3xl sm:text-5xl font-cinematic font-light text-white block">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-metallic-500 mt-2 block">
                  Minutes
                </span>
              </div>
              <div className="p-5 rounded-sm bg-[#040605] border border-[#00e575]/20">
                <span className="text-3xl sm:text-5xl font-cinematic font-light text-[#00e575] block">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#00e575]/80 mt-2 block">
                  Seconds
                </span>
              </div>
            </div>

            {/* Event Structure Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-sans border-t border-white/5">
              <div className="p-4 rounded-sm bg-[#040605] space-y-1">
                <span className="text-metallic-500 block uppercase tracking-wider text-[10px]">Structure</span>
                <strong className="text-white text-sm font-cinematic">2 Rounds · 3 Hours</strong>
              </div>
              <div className="p-4 rounded-sm bg-[#040605] space-y-1">
                <span className="text-metallic-500 block uppercase tracking-wider text-[10px]">Round 1</span>
                <strong className="text-[#00e575] text-sm font-cinematic">The Search (90m)</strong>
              </div>
              <div className="p-4 rounded-sm bg-[#040605] space-y-1">
                <span className="text-metallic-500 block uppercase tracking-wider text-[10px]">Round 2</span>
                <strong className="text-white text-sm font-cinematic">The Conquest (90m)</strong>
              </div>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/contest"
              className="p-6 rounded-sm bg-[#070b09] border border-white/5 hover:border-[#00e575]/60 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-metallic-500">Live Stage</span>
                <h4 className="text-base font-cinematic font-normal text-white group-hover:text-[#00e575] transition-colors">
                  Open Competition Arena
                </h4>
              </div>
              <ArrowRight className="w-4 h-4 text-metallic-500 group-hover:text-[#00e575] group-hover:translate-x-1 transition-all" />
            </Link>

            <a
              href="/#rules"
              className="p-6 rounded-sm bg-[#070b09] border border-white/5 hover:border-white/20 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-metallic-500">Guidelines</span>
                <h4 className="text-base font-cinematic font-normal text-white group-hover:text-white transition-colors">
                  Review Official Mandate
                </h4>
              </div>
              <ArrowRight className="w-4 h-4 text-metallic-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </div>

      </div>

      {/* Dispatches Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          <span className="text-xs font-cinematic uppercase tracking-[0.25em] text-metallic-400">
            Official Dispatches & Updates
          </span>
          <div className="h-[1px] w-8 bg-metallic-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dispatches.map((item) => (
            <div key={item.id} className="p-6 rounded-sm bg-[#070b09] border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-sans tracking-[0.2em] uppercase text-metallic-500">
                <span>{item.tag}</span>
                <span>{item.date}</span>
              </div>
              <h4 className="text-base font-cinematic font-normal text-white">
                {item.title}
              </h4>
              <p className="text-xs text-metallic-400 font-sans leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
