import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMeApi } from '../services/api';
import { User, Trophy, Flame, Zap, Award, Target, Percent, Calendar, Loader2 } from 'lucide-react';

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMeApi();
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-slate-400 font-mono text-sm">FETCHING PLAYER DOSSIER...</p>
      </div>
    );
  }

  const p = profile || authUser;

  if (!p) {
    return (
      <div className="max-w-md mx-auto py-12 text-center text-slate-400">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* User Info Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
            {p.username ? p.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{p.username}</h1>
            <p className="text-xs font-mono text-slate-400 mt-1">{p.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-mono">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Global Rank</div>
            <div className="text-xl font-bold text-amber-400">#{p.globalRank || 1}</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">MMR Rating</div>
            <div className="text-xl font-bold text-emerald-400">⚡ {p.rating || 1000}</div>
          </div>
        </div>
      </div>

      {/* Grid of Key Player Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center space-x-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Best Score</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{p.bestScore || 0}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center space-x-1">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Games Played</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{p.gamesPlayed || 0}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center space-x-1">
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
            <span>Win Rate</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {p.winRate ? p.winRate.toFixed(1) : '0.0'}%
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Current Streak</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{p.currentStreak || 0} days</div>
        </div>
      </div>

      {/* Recent Games Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span>RECENT GAME HISTORY</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-mono uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Game Arena</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {p.recentGames && p.recentGames.length > 0 ? (
                p.recentGames.map((g) => {
                  const isWin = g.score >= 50;
                  return (
                    <tr key={g.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{g.gameType}</td>
                      <td className="py-3.5 px-4 text-xs">{g.difficulty}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{g.score}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isWin ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {isWin ? 'WIN' : 'LOSS'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {g.startedAt ? new Date(g.startedAt).toLocaleDateString() : 'Today'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No recent games played yet. Click Play Now to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
