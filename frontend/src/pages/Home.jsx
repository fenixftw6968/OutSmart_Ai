import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLiveStatsApi, getDailyChallengeApi, getGlobalLeaderboardApi } from '../services/api';
import { Play, Trophy, UserPlus, LogIn, Flame, Sparkles, BrainCircuit, Activity, ShieldCheck, Zap, Sword, Target, Eye, Compass } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ activeGames: 0, gamesCompletedToday: 0, registeredPlayers: 0 });
  const [dailyStatus, setDailyStatus] = useState(null);
  const [leaderboardPreview, setLeaderboardPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, dailyRes, leadRes] = await Promise.all([
          getLiveStatsApi(),
          getDailyChallengeApi(),
          getGlobalLeaderboardApi(),
        ]);
        setStats(statsRes.data);
        setDailyStatus(dailyRes.data);
        setLeaderboardPreview(leadRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load homepage metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const gameModes = [
    {
      type: 'LOGIC',
      title: 'Logic Deduction',
      desc: 'Sequence puzzles, conditional constraints, and formal deduction reasoning.',
      icon: BrainCircuit,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      type: 'PATTERN',
      title: 'Pattern Recognition',
      desc: 'Identify numerical, geometric, and logical sequences under time pressure.',
      icon: Target,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      type: 'BLUFF',
      title: 'Bluff Detection',
      desc: 'AI presents 3 facts with 1 hidden lie. Spot the deception.',
      icon: Eye,
      color: 'from-amber-500 to-orange-600',
    },
    {
      type: 'LATERAL',
      title: 'Lateral Thinking',
      desc: 'Deceptive riddles and paradoxical scenarios where obvious answers fail.',
      icon: Compass,
      color: 'from-purple-500 to-violet-600',
    },
    {
      type: 'AI_BATTLE',
      title: 'AI Reasoning Battle',
      desc: 'Direct showdown against Nemotron Ultra. Custom answers evaluated on efficiency & logic.',
      icon: Sword,
      color: 'from-rose-500 to-pink-600',
      flagship: true,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 text-center max-w-5xl mx-auto space-y-8">
        {/* Subtitle Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Powered by NVIDIA Nemotron Ultra AI Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.1]">
          CAN YOU OUTSMART AI?
        </h1>

        <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto font-medium">
          5 reasoning challenges. One AI engine. Can you beat it?
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/play')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>PLAY NOW</span>
          </button>

          {!user && (
            <>
              <Link
                to="/register"
                className="px-6 py-4 rounded-xl glass-panel hover:bg-slate-900 border border-slate-700 text-white font-bold text-base hover:scale-105 transition-all flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <span>CREATE ACCOUNT</span>
              </Link>
              <Link
                to="/login"
                className="px-6 py-4 rounded-xl glass-panel hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-bold text-base hover:scale-105 transition-all flex items-center space-x-2"
              >
                <LogIn className="w-5 h-5 text-cyan-400" />
                <span>LOGIN</span>
              </Link>
            </>
          )}

          <Link
            to="/leaderboard"
            className="px-6 py-4 rounded-xl glass-panel hover:bg-slate-900 border border-amber-500/30 text-amber-400 font-bold text-base hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>LEADERBOARD</span>
          </Link>
        </div>
      </section>

      {/* Live Statistics Ticker */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center text-xs font-mono uppercase text-emerald-400 space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE ACTIVE GAMES</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {stats.activeGames}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center text-xs font-mono uppercase text-cyan-400 space-x-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>COMPLETED TODAY</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {stats.gamesCompletedToday}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center text-xs font-mono uppercase text-violet-400 space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>REGISTERED PLAYERS</span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {stats.registeredPlayers}
            </div>
          </div>
        </div>
      </section>

      {/* Daily Challenge Card */}
      {dailyStatus && (
        <section className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>OFFICIAL DAILY AI CHALLENGE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {dailyStatus.title}
                </h2>
                <p className="text-slate-300 text-sm max-w-xl">
                  {dailyStatus.description}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-400 pt-2">
                  <span>Attempted by: <strong className="text-amber-400">{dailyStatus.totalAttemptsToday}</strong> players</span>
                  <span>•</span>
                  <span>Avg Score: <strong className="text-emerald-400">{dailyStatus.averageScoreToday}/100</strong></span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate('/play?daily=true')}
                  disabled={dailyStatus.completedToday}
                  className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer ${
                    dailyStatus.completedToday
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{dailyStatus.completedToday ? 'Completed Today ✅' : 'ATTEMPT DAILY CHALLENGE'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Game Modes Preview */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            5 REASONING ARENAS
          </h2>
          <p className="text-slate-400 text-sm">
            Choose your battleground. Each game mode tests a distinct facet of human vs AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.type}
                className={`group relative rounded-2xl glass-card p-6 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between ${
                  game.flagship ? 'md:col-span-2 lg:col-span-1 border-rose-500/30 bg-gradient-to-b from-slate-900 to-rose-950/20' : ''
                }`}
              >
                {game.flagship && (
                  <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-rose-500 text-slate-950 text-[10px] font-black tracking-widest uppercase">
                    FLAGSHIP MODE
                  </span>
                )}

                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-slate-950 shadow-md`}>
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      {game.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => navigate(`/play?type=${game.type}`)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>ENTER ARENA</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Global Leaderboard Preview */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>TOP REASONERS</span>
            </h2>
            <p className="text-slate-400 text-xs">Global leaderboard rankings</p>
          </div>
          <Link
            to="/leaderboard"
            className="text-xs font-bold font-mono text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>VIEW FULL LEADERBOARD →</span>
          </Link>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-6">Player</th>
                <th className="py-3 px-6">Score</th>
                <th className="py-3 px-6">MMR Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {leaderboardPreview.length > 0 ? (
                leaderboardPreview.map((entry, idx) => (
                  <tr
                    key={entry.userId || idx}
                    className={`hover:bg-slate-900/40 transition-colors ${
                      entry.isCurrentUser ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' : ''
                    }`}
                  >
                    <td className="py-4 px-6 font-bold text-base">
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${entry.rank}`}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white font-sans flex items-center space-x-2">
                      <span>{entry.username}</span>
                      {entry.isCurrentUser && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">YOU</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-emerald-400 font-bold">{entry.totalScore.toLocaleString()}</td>
                    <td className="py-4 px-6 text-amber-400 font-bold">⚡ {entry.rating}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">
                    No games recorded yet. Be the first to claim #1!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
