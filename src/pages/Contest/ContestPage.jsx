import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { contestApi } from '../../api/contest';

export const ContestPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'leaderboard'
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [overview, setOverview] = useState(null);
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadContest = async () => {
      try {
        const [ov, lb] = await Promise.all([
          contestApi.getContestOverview(),
          contestApi.getLeaderboard(),
        ]);

        if (!isMounted) return;
        setOverview(ov);
        setLeaderboard(lb || []);

        const isRoundActive = ov?.currentRound === 2 ? ov?.round2Active : ov?.round1Active;

        if (isRoundActive) {
          const pr = await contestApi.getProblems();
          if (isMounted) setProblems(pr || []);
        } else {
          if (isMounted) setProblems([]);
        }
      } catch (err) {
        console.error('Contest load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContest();

    return () => {
      isMounted = false;
    };
  }, []);

  const isRoundActive = overview ? (overview.currentRound === 2 ? overview.round2Active : overview.round1Active) : false;

  const filteredProblems = problems.filter((p) => {
    if (difficultyFilter === 'ALL') return true;
    return (p.difficulty || '').toUpperCase() === difficultyFilter;
  });

  const formatTimer = (seconds) => {
    if (seconds == null || isNaN(seconds)) return '--:--:--';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Editorial Arena Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-3">
          {isRoundActive ? (
            <div className="flex items-center gap-3 text-xs font-cinematic uppercase tracking-[0.25em] text-metallic-400">
              <span>Round {overview?.currentRound === 2 ? '02 · The Conquest' : '01 · The Search'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e575]" />
              <span className="text-[#00e575]">Live Engagement</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs font-cinematic uppercase tracking-[0.25em] text-metallic-400">
              <span>Round {overview?.currentRound === 2 ? '02' : '01'} · Standing By</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400">Locked // Standby for Tech Team Activation</span>
            </div>
          )}
          <h1 className="text-4xl sm:text-6xl font-cinematic font-normal text-white">
            The Competition Arena
          </h1>
          <p className="text-sm font-sans text-metallic-400 tracking-wide">
            Parsec 7.0 · IIT Dharwad Official Challenge Tier
          </p>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-4 px-6 py-3 rounded-sm bg-[#070b09] border border-white/5">
          <Clock className={`w-4 h-4 ${isRoundActive ? 'text-[#00e575]' : 'text-amber-400'}`} />
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-metallic-500 block">
              {isRoundActive ? 'Time Remaining' : 'Status'}
            </span>
            <span className="text-2xl font-cinematic font-light text-white tracking-widest">
              {isRoundActive ? formatTimer(overview?.remainingSeconds ?? overview?.roundDurationSeconds) : 'LOCKED'}
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
        {activeTab === 'problems' && isRoundActive && (
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
        <>
          {!isRoundActive ? (
            <div className="py-20 text-center space-y-4 border-y border-white/5 bg-[#060908]/60 rounded-sm p-8">
              <div className="w-12 h-12 rounded-full bg-[#060908] border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 shadow-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div className="eyebrow-inscriptional text-[10px] text-metallic-400">
                Citadel Security Protocol · Access Suspended
              </div>
              <h3 className="text-2xl font-cinematic font-normal text-white">
                Arena Locked // Tech Team System Control
              </h3>
              <p className="text-xs font-mono text-metallic-400 max-w-lg mx-auto leading-relaxed">
                Round {overview?.currentRound || 1} has not been activated by the Tech Team yet.
                The terminal will automatically allow functionality once the organizers initiate the round.
              </p>
              <div className="pt-2 text-[10px] font-mono text-metallic-500 uppercase tracking-widest">
                System Status: <span className="text-amber-400 font-bold">INACTIVE</span> · Venue Verification Enforced
              </div>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="py-20 text-center space-y-3 border-y border-white/5 bg-[#060908]/40 rounded-sm p-8">
              <h3 className="text-xl font-cinematic text-white uppercase tracking-wider">
                No Questions Released Yet
              </h3>
              <p className="text-xs font-mono text-metallic-400 max-w-md mx-auto">
                Round {overview?.currentRound || 1} is active, but questions have not yet been deployed to the system by the Tech Team.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 border-y border-white/5">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-4 text-xs font-cinematic tracking-wider">
                      <span className="text-[#00e575]">{problem.code || `BH-Q${problem.id}`}</span>
                      <span className="text-metallic-500">·</span>
                      <span className="text-metallic-400 uppercase">{problem.difficulty || 'Alpha'}</span>
                      <span className="text-metallic-500">·</span>
                      <span className="text-white">{problem.points || 10} Points</span>
                    </div>

                    <h3 className="text-2xl font-cinematic font-normal text-white group-hover:text-[#00e575] transition-colors">
                      {problem.title || problem.content?.slice(0, 60)}
                    </h3>

                    <p className="text-sm text-metallic-400 font-sans leading-relaxed">
                      {problem.summary || problem.content}
                    </p>

                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-2 text-[11px] font-sans text-metallic-500">
                        {problem.tags.map((tag, i) => (
                          <span key={i}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-8 shrink-0">
                    {problem.solvedCount !== undefined && (
                      <div className="text-right text-xs font-sans text-metallic-400 hidden sm:block">
                        <span className="text-white font-cinematic block">{problem.solvedCount} solved</span>
                        <span className="text-metallic-500 text-[11px]">{problem.accuracy || '100%'} accuracy</span>
                      </div>
                    )}

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
        </>
      )}

      {/* Tab 2: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="border border-white/5 rounded-sm bg-[#060908] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-cinematic text-metallic-500 uppercase tracking-[0.25em]">
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Squad</th>
                  <th className="py-4 px-6 text-center">Round 1</th>
                  <th className="py-4 px-6 text-center">Round 2</th>
                  <th className="py-4 px-6 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-metallic-500 font-mono text-xs">
                      No team standings recorded yet. Standings will populate as teams submit.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((row, idx) => (
                    <tr key={row.teamId || idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-cinematic font-normal text-white">
                        #{row.rank || idx + 1}
                      </td>
                      <td className="py-4 px-6 text-white font-medium flex items-center gap-2">
                        <span>{row.teamName || row.name}</span>
                        {row.verified && (
                          <CheckCircle2 className="w-3 h-3 text-[#00e575]" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center text-metallic-400">
                        {row.round1Score ?? 0}
                      </td>
                      <td className="py-4 px-6 text-center text-metallic-400">
                        {row.round2Score ?? 0}
                      </td>
                      <td className="py-4 px-6 text-right font-cinematic font-bold text-[#00e575]">
                        {row.totalScore ?? row.score ?? 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
