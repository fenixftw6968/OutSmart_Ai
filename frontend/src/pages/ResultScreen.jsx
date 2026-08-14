import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicResultApi } from '../services/api';
import confetti from 'canvas-confetti';
import { Trophy, Play, Share2, CheckCircle2, XCircle, Sparkles, Zap, ArrowLeft, Loader2 } from 'lucide-react';

export default function ResultScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getPublicResultApi(id);
        setResult(res.data);
        if (res.data.score >= 70) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (err) {
        console.error(err);
        setError('Result not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/result/${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-slate-400 font-mono text-sm">COMPUTING AUTHORITATIVE SCORE...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {error || 'Result unavailable.'}
        </div>
        <button
          onClick={() => navigate('/play')}
          className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-bold"
        >
          Back to Game Hub
        </button>
      </div>
    );
  }

  const isWin = result.score >= 50;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-slate-800 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>NEMOTRON EVALUATION COMPLETE</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">
          {isWin ? '🏆 OUTSMARTED!' : '⚡ AI PREVAILED'}
        </h1>
      </div>

      {/* Main Result Card */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center space-y-8 shadow-2xl relative overflow-hidden">
        {/* Total Score Badge */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
            FINAL PERFORMANCE SCORE
          </div>
          <div className="text-6xl sm:text-7xl font-extrabold font-mono bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
            {result.score}
          </div>
          <div className="text-xs font-mono text-slate-500">MAX AVAILABLE: {result.difficulty === 'EASY' ? 100 : result.difficulty === 'MEDIUM' ? 150 : result.difficulty === 'HARD' ? 200 : 300} POINTS</div>
        </div>

        {/* Rating Delta */}
        <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-sm font-bold">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className={result.ratingChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {result.ratingChange >= 0 ? `+${result.ratingChange}` : result.ratingChange} Competitive Rating
          </span>
        </div>

        {/* Score Breakdown Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Correctness</div>
            <div className="text-lg font-bold font-mono text-emerald-400">{result.correctnessScore} pts</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Reasoning</div>
            <div className="text-lg font-bold font-mono text-cyan-400">{result.reasoningScore} pts</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Speed Bonus</div>
            <div className="text-lg font-bold font-mono text-amber-400">+{result.speedScore} pts</div>
          </div>
        </div>

        {/* AI Evaluation Commentary */}
        {result.aiEvaluation && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>NVIDIA Nemotron AI Feedback:</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              "{result.aiEvaluation}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/play')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-md shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-900 border border-slate-700 text-white font-bold text-sm hover:scale-105 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>{copied ? 'Link Copied! 📋' : 'CHALLENGE A FRIEND'}</span>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-900 border border-amber-500/30 text-amber-400 font-bold text-sm hover:scale-105 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>LEADERBOARD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
