import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameApi, requestHintApi, submitGameApi } from '../services/api';
import { Clock, HelpCircle, Send, ShieldAlert, Sparkles, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function GameArena() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [hint, setHint] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch Game Session
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await getGameApi(id);
        setGame(res.data);
        if (res.data.hintText) setHint(res.data.hintText);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load game session.');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  // Server-Synchronized Timer Countdown
  useEffect(() => {
    if (!game || game.status !== 'IN_PROGRESS') return;

    const calculateTimeLeft = () => {
      const expiresAt = new Date(game.expiresAt).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0 && !submitting) {
        handleAutoSubmit();
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [game]);

  const handleRequestHint = async () => {
    if (hintLoading || hint) return;
    setHintLoading(true);
    try {
      const res = await requestHintApi(id);
      setHint(res.data.hint);
    } catch (err) {
      console.error(err);
    } finally {
      setHintLoading(false);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmit(userAnswer || 'No answer submitted in time.');
  };

  const handleSubmit = async (answerToSubmit) => {
    const finalAns = answerToSubmit !== undefined ? answerToSubmit : userAnswer;
    if (!finalAns || finalAns.trim() === '') return;

    setSubmitting(true);
    setError('');

    try {
      const res = await submitGameApi(id, { userAnswer: finalAns });
      if (!res.data || !res.data.id) {
        throw new Error('Invalid result response received from server.');
      }
      navigate(`/result/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to submit answer. Session may have expired.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-slate-400 font-mono text-sm">SYNCHRONIZING WITH NEMOTRON ARENA...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {error || 'Game session unavailable.'}
        </div>
        <button
          onClick={() => navigate('/play')}
          className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-bold"
        >
          Return to Game Hub
        </button>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 20;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Top Game Meta Header */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase">
            {game.gameType}
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono font-semibold uppercase">
            {game.difficulty}
          </span>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center space-x-2 font-mono font-extrabold text-lg px-4 py-1.5 rounded-xl border transition-colors ${
            isLowTime
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : 'bg-slate-900 text-amber-400 border-slate-800'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Challenge Question Card */}
      <div className="glass-panel rounded-2xl p-8 border border-slate-800 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">
            NVIDIA NEMOTRON REASONING CHALLENGE
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed whitespace-pre-line">
            {game.question}
          </h2>
        </div>

        {/* Options (for Multiple Choice) OR Textarea (for Subjective/AI Battle) */}
        {game.options && game.options.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 pt-2">
            {game.options.map((opt, idx) => {
              const isSelected = userAnswer === opt;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUserAnswer(opt)}
                  className={`w-full p-4 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Write Your Precise Reasoning & Solution:
            </label>
            <textarea
              rows={5}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Explain your step-by-step logic and final conclusion here..."
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-white text-sm focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Hint Section */}
        <div className="pt-2 border-t border-slate-800/80">
          {hint ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
              <div className="font-mono font-bold flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>NEMOTRON HINT (25% Score Penalty Applied):</span>
              </div>
              <p className="text-amber-200">{hint}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestHint}
              disabled={hintLoading}
              className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>{hintLoading ? 'Generating hint...' : 'Request AI Hint (-25% Score Penalty)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex justify-end">
        <button
          onClick={() => handleSubmit(userAnswer)}
          disabled={submitting || !userAnswer || userAnswer.trim() === ''}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>NEMOTRON EVALUATING LOGIC...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 fill-slate-950" />
              <span>SUBMIT REASONING TO AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
