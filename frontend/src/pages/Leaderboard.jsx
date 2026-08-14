import React, { useState, useEffect } from 'react';
import { getGlobalLeaderboardApi, getWeeklyLeaderboardApi, getDailyLeaderboardApi } from '../services/api';
import { Trophy, Flame, Zap, Loader2, RefreshCw } from 'lucide-react';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('GLOBAL');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async (tab, showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);

    try {
      let res;
      if (tab === 'GLOBAL') res = await getGlobalLeaderboardApi();
      else if (tab === 'WEEKLY') res = await getWeeklyLeaderboardApi();
      else if (tab === 'DAILY') res = await getDailyLeaderboardApi();

      if (res && res.data) {
        setEntries(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab, true);
    // Polling every 15s
    const interval = setInterval(() => {
      fetchLeaderboard(activeTab, false);
    }, 15000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start space-x-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            <span>GLOBAL LEADERBOARD</span>
          </h1>
          <p className="text-slate-400 text-xs font-mono">
            Updated automatically in real time
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1 glass-panel p-1 rounded-xl border border-slate-800">
          {['GLOBAL', 'WEEKLY', 'DAILY'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'GLOBAL' ? 'GLOBAL' : tab === 'WEEKLY' ? 'THIS WEEK' : 'TODAY'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-mono text-slate-400">LOADING RANKINGS...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs font-mono uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Player</th>
                  <th className="py-3.5 px-6">Score</th>
                  <th className="py-3.5 px-6">Rating</th>
                  <th className="py-3.5 px-6">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {entries.length > 0 ? (
                  entries.map((e, idx) => (
                    <tr
                      key={e.userId || idx}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        e.isCurrentUser
                          ? 'bg-emerald-500/15 border-l-4 border-l-emerald-500 font-bold text-white'
                          : ''
                      }`}
                    >
                      <td className="py-4 px-6 text-base font-bold">
                        {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${e.rank || idx + 1}`}
                      </td>
                      <td className="py-4 px-6 font-sans font-semibold text-white flex items-center space-x-2">
                        <span>{e.username}</span>
                        {e.isCurrentUser && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            YOU
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-emerald-400 font-bold">
                        {e.totalScore ? e.totalScore.toLocaleString() : 0}
                      </td>
                      <td className="py-4 px-6 text-amber-400 font-bold">
                        ⚡ {e.rating || 1000}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        <span className="flex items-center text-amber-400 font-bold">
                          <Flame className="w-3.5 h-3.5 mr-1 fill-amber-400" />
                          {e.currentStreak || 0}d
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500">
                      No leaderboard entries found for this category yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
