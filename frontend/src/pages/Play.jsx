import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startGameApi } from '../services/api';
import { Play as PlayIcon, BrainCircuit, Target, Eye, Compass, Sword, Flame, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export default function Play() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'LOGIC');
  const [selectedDifficulty, setSelectedDifficulty] = useState('MEDIUM');
  const [isDaily, setIsDaily] = useState(searchParams.get('daily') === 'true');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('daily') === 'true') {
      setIsDaily(true);
    }
  }, [searchParams]);

  const gameTypes = [
    { type: 'LOGIC', title: 'Logic Deduction', icon: BrainCircuit, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    { type: 'PATTERN', title: 'Pattern Recognition', icon: Target, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
    { type: 'BLUFF', title: 'Bluff Detection', icon: Eye, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { type: 'LATERAL', title: 'Lateral Thinking', icon: Compass, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
    { type: 'AI_BATTLE', title: 'AI Reasoning Battle', icon: Sword, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  ];

  const difficulties = [
    { id: 'EASY', label: 'Easy', multiplier: '100 Max Score', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'MEDIUM', label: 'Medium', multiplier: '150 Max Score', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { id: 'HARD', label: 'Hard', multiplier: '200 Max Score', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'EXTREME', label: 'Extreme', multiplier: '300 Max Score', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  ];

  const handleStartGame = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await startGameApi({
        gameType: selectedType,
        difficulty: selectedDifficulty,
        daily: isDaily,
      });
      navigate(`/game/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to start AI challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>SELECT REASONING ARENA</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">GAME HUB</h1>
        <p className="text-slate-400 text-sm">
          Prepare for Nemotron's evaluation. Select your game mode & difficulty.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Daily Challenge Toggle Banner */}
      <div
        onClick={() => setIsDaily(!isDaily)}
        className={`cursor-pointer rounded-2xl p-6 border transition-all flex items-center justify-between ${
          isDaily
            ? 'glass-panel border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-900/20'
            : 'glass-card border-slate-800 opacity-75 hover:opacity-100'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>OFFICIAL DAILY CHALLENGE MODE</span>
              {isDaily && <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500 text-slate-950 font-black">ACTIVE</span>}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              One official attempt per day. Maintains your streak & updates daily rankings.
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={isDaily}
          onChange={() => setIsDaily(!isDaily)}
          className="w-5 h-5 accent-amber-500 cursor-pointer"
        />
      </div>

      {/* Game Mode Selection Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
          1. CHOOSE REASONING MODE
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {gameTypes.map((gt) => {
            const Icon = gt.icon;
            const isSelected = selectedType === gt.type;
            return (
              <button
                key={gt.type}
                type="button"
                onClick={() => setSelectedType(gt.type)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-3 ${
                  isSelected
                    ? `${gt.color} shadow-lg ring-2 ring-emerald-500/50`
                    : 'glass-card border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-bold text-sm">{gt.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
          2. CHOOSE DIFFICULTY LEVEL
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/40 text-white'
                    : 'glass-card border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="font-bold text-sm text-white">{diff.label}</div>
                <div className={`text-[10px] font-mono inline-block px-2 py-0.5 rounded border ${diff.badge}`}>
                  {diff.multiplier}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Launch Action */}
      <div className="pt-4 text-center">
        <button
          onClick={handleStartGame}
          disabled={loading}
          className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all flex items-center justify-center space-x-3 mx-auto cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>NEMOTRON IS CRAFTING PUZZLE...</span>
            </>
          ) : (
            <>
              <PlayIcon className="w-6 h-6 fill-slate-950" />
              <span>START CHALLENGE NOW</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
