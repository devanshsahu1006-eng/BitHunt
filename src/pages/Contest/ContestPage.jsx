import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { contestApi, CONTEST_PROBLEMS, LEADERBOARD_DATA } from '../../api/contest';

export const ContestPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'leaderboard'
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [problems, setProblems] = useState(CONTEST_PROBLEMS);
  const [leaderboard, setLeaderboard] = useState(LEADERBOARD_DATA);

  useEffect(() => {
    const loadContest = async () => {
      // =========================================================================
      // BACKEND INTEGRATION POINT
      // Flask endpoints expected:
      // GET /api/contest/overview
      // GET /api/contest/problems
      // GET /api/contest/leaderboard
      // =========================================================================
      const pr = await contestApi.getProblems();
      const lb = await contestApi.getLeaderboard();
      setProblems(pr);
      setLeaderboard(lb);
    };
    loadContest();
  }, []);

  const filteredProblems = problems.filter((p) => {
    if (difficultyFilter === 'ALL') return true;
    return p.difficulty.toUpperCase() === difficultyFilter;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Editorial Arena Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs font-cinematic uppercase tracking-[0.25em] text-metallic-400">
            <span>Round 01 · The Search</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e575]" />
            <span className="text-[#00e575]">Live Engagement</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-cinematic font-normal text-white">
            The Competition Arena
          </h1>
          <p className="text-sm font-sans text-metallic-400 tracking-wide">
            Parsec 7.0 · IIT Dharwad Official Challenge Tier
          </p>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-4 px-6 py-3 rounded-sm bg-[#070b09] border border-white/5">
          <Clock className="w-4 h-4 text-[#00e575]" />
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-metallic-500 block">
              Time Remaining
            </span>
            <span className="text-2xl font-cinematic font-light text-white tracking-widest">
              02:14:48
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs: Problems vs Standings */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('problems')}
            className={`text-xs font-cinematic tracking-[0.2em] uppercase transition-all duration-300 py-1 relative ${
              activeTab === 'problems'
                ? 'text-white font-semibold'
                : 'text-metallic-500 hover:text-white'
            }`}
          >
            <span>Problem Archive ({problems.length})</span>
            {activeTab === 'problems' && (
              <span className="absolute bottom-0 inset-x-0 h-[1px] bg-[#00e575]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`text-xs font-cinematic tracking-[0.2em] uppercase transition-all duration-300 py-1 relative ${
              activeTab === 'leaderboard'
                ? 'text-white font-semibold'
                : 'text-metallic-500 hover:text-white'
            }`}
          >
            <span>Standings</span>
            {activeTab === 'leaderboard' && (
              <span className="absolute bottom-0 inset-x-0 h-[1px] bg-[#00e575]" />
            )}
          </button>
        </div>

        {/* Difficulty Filter */}
        {activeTab === 'problems' && (
          <div className="flex items-center gap-3 text-xs font-sans">
            <span className="text-metallic-500 uppercase tracking-wider text-[10px]">Tier:</span>
            {['ALL', 'ALPHA', 'GAMMA', 'OMEGA'].map((tier) => (
              <button
                key={tier}
                onClick={() => setDifficultyFilter(tier)}
                className={`px-3 py-1 rounded-sm text-[11px] font-cinematic tracking-wider transition-all ${
                  difficultyFilter === tier
                    ? 'bg-white text-black font-semibold'
                    : 'text-metallic-400 hover:text-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Problems List */}
      {activeTab === 'problems' && (
        <div className="divide-y divide-white/5 border-y border-white/5">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-4 text-xs font-cinematic tracking-wider">
                  <span className="text-[#00e575]">{problem.code}</span>
                  <span className="text-metallic-500">·</span>
                  <span className="text-metallic-400 uppercase">{problem.difficulty}</span>
                  <span className="text-metallic-500">·</span>
                  <span className="text-white">{problem.points} Points</span>
                </div>

                <h3 className="text-2xl font-cinematic font-normal text-white group-hover:text-[#00e575] transition-colors">
                  {problem.title}
                </h3>

                <p className="text-sm text-metallic-400 font-sans leading-relaxed">
                  {problem.summary}
                </p>

                <div className="flex flex-wrap gap-3 pt-2 text-[11px] font-sans text-metallic-500">
                  {problem.tags.map((tag, i) => (
                    <span key={i}>#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-8 shrink-0">
                <div className="text-right text-xs font-sans text-metallic-400 hidden sm:block">
                  <span className="text-white font-cinematic block">{problem.solvedCount} solved</span>
                  <span className="text-metallic-500 text-[11px]">{problem.accuracy} accuracy</span>
                </div>

                <button
                  onClick={() => navigate(`/contest/problem/${problem.id}`)}
                  className="px-6 py-3 rounded-sm bg-white/5 border border-white/15 hover:border-[#00e575] text-white hover:text-[#00e575] text-xs font-cinematic uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <span>Solve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="border border-white/5 rounded-sm bg-[#060908] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-cinematic text-metallic-500 uppercase tracking-[0.25em]">
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Squad</th>
                  <th className="py-4 px-6">Institution</th>
                  <th className="py-4 px-6 text-center">Problems Solved</th>
                  <th className="py-4 px-6 text-right">Score</th>
                  <th className="py-4 px-6 text-right">Penalty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((row) => (
                  <tr key={row.rank} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-cinematic font-normal text-white">
                      #{row.rank}
                    </td>
                    <td className="py-4 px-6 text-white font-medium flex items-center gap-2">
                      <span>{row.name}</span>
                      {row.verified && (
                        <CheckCircle2 className="w-3 h-3 text-[#00e575]" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-metallic-400">{row.team}</td>
                    <td className="py-4 px-6 text-metallic-400">{row.college}</td>
                    <td className="py-4 px-6 text-center text-[#00e575] font-cinematic">
                      {row.solved} / 4
                    </td>
                    <td className="py-4 px-6 text-right font-cinematic font-bold text-white">
                      {row.score}
                    </td>
                    <td className="py-4 px-6 text-right text-metallic-500">{row.penalty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
