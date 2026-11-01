import React, { useState, useEffect } from 'react';
import {
  Brain,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';

export const PsychologyInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'killswitch' | 'checklist'>('quiz');

  // Kill Switch State persisted in localStorage
  const [killSwitchUntil, setKillSwitchUntil] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_killswitch_until');
      if (saved) {
        const time = parseInt(saved, 10);
        if (time > Date.now()) return time;
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);

  // Countdown timer effect
  useEffect(() => {
    if (!killSwitchUntil) {
      setTimeLeftSec(0);
      return;
    }
    const update = () => {
      const remaining = Math.max(0, Math.floor((killSwitchUntil - Date.now()) / 1000));
      setTimeLeftSec(remaining);
      if (remaining <= 0) {
        setKillSwitchUntil(null);
        localStorage.removeItem('pivotfx_killswitch_until');
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [killSwitchUntil]);

  const handleActivateKillSwitch = (minutes: number = 60) => {
    const unlockTime = Date.now() + minutes * 60 * 1000;
    setKillSwitchUntil(unlockTime);
    localStorage.setItem('pivotfx_killswitch_until', unlockTime.toString());
  };

  const handleDeactivateEarly = () => {
    if (confirm('Are you sure you have cooled down completely, breathed deeply, and are ready to follow the $2 rule?')) {
      setKillSwitchUntil(null);
      localStorage.removeItem('pivotfx_killswitch_until');
    }
  };

  // 10-Question Mindset Quiz State
  const quizQuestions = [
    {
      q: 'When you take a losing trade, what is your immediate emotional impulse?',
      options: [
        { text: 'I want to re-enter immediately with doubled lot size to get my money back.', score: 0 },
        { text: 'I feel irritated, but I close the chart and wait 15 minutes before re-evaluating.', score: 2 },
        { text: 'I accept it calmly as statistical variance and check if rules were followed.', score: 3 }
      ]
    },
    {
      q: 'How do you determine your lot size before entering a trade?',
      options: [
        { text: 'I just pick a round number like 0.10 or 0.50 based on how confident I feel.', score: 0 },
        { text: 'I sometimes calculate, but if the setup looks amazing I increase lot size.', score: 1 },
        { text: 'I strictly calculate exact lots using a fixed 1% or $2.00 dollar risk formula.', score: 3 }
      ]
    },
    {
      q: 'You see EUR/USD shoot up 40 pips in 3 minutes during London Open. What do you do?',
      options: [
        { text: 'I hit BUY by Market immediately so I do not miss out on the giant move!', score: 0 },
        { text: 'I open TradingView to see if I can catch the remainder of the candle.', score: 1 },
        { text: 'I sit on my hands. Chasing is gambling; I wait for a 20 EMA pullback or nothing.', score: 3 }
      ]
    },
    {
      q: 'What is your maximum allowed loss per day before you stop trading?',
      options: [
        { text: 'I don’t have a daily limit; I trade until I make back whatever I lost.', score: 0 },
        { text: 'Around 10% of my account, but I sometimes push past it.', score: 1 },
        { text: 'Strictly 2 losses or 3-4% maximum. If triggered, charts stay closed until tomorrow.', score: 3 }
      ]
    },
    {
      q: 'Do you ever move your Stop Loss further away while a trade is floating in loss?',
      options: [
        { text: 'Yes, frequently. I don’t want to take the loss because it might reverse!', score: 0 },
        { text: 'Occasionally, if a news spike is happening.', score: 1 },
        { text: 'Never. Moving a stop loss further away is completely prohibited in my plan.', score: 3 }
      ]
    }
  ];

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  const maxPossibleScore = quizQuestions.length * 3;

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/30 my-8">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
            <Brain className="w-3.5 h-3.5" />
            <span>MINDSET WORKSHOP • 3 DISCIPLINE TOOLS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Trading Psychology Diagnostics & Anti-Tilt Circuit Breaker
          </h3>
          <p className="text-xs text-slate-400">
            Diagnose emotional leaks, test the 1-hour revenge-trade lockout, and audit your pre-flight execution rules.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>1. Mindset Diagnostic</span>
          </button>
          <button
            onClick={() => setActiveTab('killswitch')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'killswitch' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>2. 1-Hr Kill Switch</span>
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'checklist' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3. Sniper Checklist</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MINDSET DIAGNOSTIC QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {quizQuestions.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white block">
                  Question {idx + 1}: {item.q}
                </span>
                <div className="space-y-2">
                  {item.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        answers[idx] === opt.score
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        checked={answers[idx] === opt.score}
                        onChange={() => setAnswers({ ...answers, [idx]: opt.score })}
                        className="accent-[#D4AF37]"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 block">Diagnostic Score:</span>
              <strong className="text-xl font-bold font-mono text-white">
                {Object.keys(answers).length === quizQuestions.length ? (
                  <span className="text-gold-gradient">{totalScore} / {maxPossibleScore} Points</span>
                ) : (
                  <span className="text-slate-500">Answer all 5 questions</span>
                )}
              </strong>
            </div>

            <button
              onClick={() => setSubmittedQuiz(true)}
              disabled={Object.keys(answers).length < quizQuestions.length}
              className="px-6 py-3 rounded-xl btn-gold text-black font-extrabold text-xs uppercase tracking-wider disabled:opacity-50"
            >
              Calculate Psychological Profile
            </button>
          </div>

          {submittedQuiz && (
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#D4AF37]/40 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold font-mono">
                <Award className="w-4 h-4" />
                <span>
                  {totalScore >= 12
                    ? '🏆 INSTITUTIONAL MINDSET: High emotional discipline & probabilistic thinking.'
                    : totalScore >= 7
                    ? '⚠️ MODERATE DISCIPLINE: Vulnerable to FOMO or revenge trading after consecutive losses.'
                    : '🚨 CRITICAL GAMBLING RISK: High probability of account blowouts due to over-leveraging.'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {totalScore >= 12
                  ? 'Your psychological instincts align with funded prop firm execution. Maintain strict daily limits.'
                  : 'Focus on Pillar 5 ($2 Survival Rule) and engage the 1-Hour Kill Switch after any loss.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 1-HOUR KILL SWITCH */}
      {activeTab === 'killswitch' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-red-500/30 text-center space-y-6">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <h4 className="text-xl font-black text-white">
              The 1-Hour Anti-Revenge Kill Switch
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              If you just suffered an emotional loss, felt your heart racing, or caught yourself wanting to double lot size, engage the Kill Switch. This activates a mandatory 60-minute lockout timer to protect your account.
            </p>
          </div>

          {killSwitchUntil ? (
            <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/50 max-w-sm mx-auto space-y-3">
              <span className="text-xs font-mono text-red-300 uppercase tracking-widest font-bold">
                🔒 LOCKOUT ACTIVE — MANDATORY COOL DOWN
              </span>

              <div className="text-4xl font-black font-mono text-white tracking-widest">
                {Math.floor(timeLeftSec / 60)}m {timeLeftSec % 60}s
              </div>

              <p className="text-[11px] text-slate-400">
                Step away from TradingView. Drink a glass of water, go for a walk outside, and allow your prefrontal cortex to reset.
              </p>

              <button
                onClick={handleDeactivateEarly}
                className="text-[11px] font-mono text-slate-500 hover:text-white underline pt-2"
              >
                Disengage Early (I have completely cooled down)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => handleActivateKillSwitch(60)}
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider transition shadow-xl shadow-red-600/30 active:scale-95 flex items-center justify-center gap-2 mx-auto"
              >
                <Lock className="w-4 h-4" />
                <span>Engage 1-Hour Lockout Now</span>
              </button>
              <span className="text-[10px] font-mono text-slate-500 block">
                Timer runs locally and persists across browser reloads.
              </span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRE-FLIGHT SNIPER CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
            The 5-Question Pre-Trade Filter (Must Answer YES to All):
          </h4>

          <div className="space-y-2.5">
            {[
              'Is the current time within London Open (11:00 - 14:00 EAT) or NY Overlap (15:30 - 19:30 EAT)?',
              'Does this setup align with my Daily Directional Bias and Higher Timeframe (H4) structure?',
              'Is price currently pulling back to a key value level (20/50 EMA, Order Block, or FVG) rather than chasing green candles?',
              'Has my Stop Loss been anchored to structural market invalidation (not an arbitrary round pip number)?',
              'Has my Lot Size been calculated strictly using the $2.00 Rule or 1% Risk cap?'
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
