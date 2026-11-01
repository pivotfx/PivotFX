import React, { useState } from 'react';
import { PageTab, UserPersona } from '../types';
import { CustomSelect, SelectOption } from '../components/common/CustomSelect';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Smartphone,
  Scan,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  DollarSign,
  ChevronRight,
  MapPin,
  ExternalLink,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PillarHeaderBar } from '../components/common/PillarHeaderBar';

interface StartHerePageProps {
  onNavigate: (tab: PageTab) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

export const StartHerePage: React.FC<StartHerePageProps> = ({ onNavigate, onAwardXp }) => {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>('newbie');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [journeyActive, setJourneyActive] = useState<boolean>(false);

  // Step 1 interactive quiz / simulation
  const [step1Understood, setStep1Understood] = useState(false);
  // Step 2 checklist
  const [fxpesaChecklist, setFxpesaChecklist] = useState<{
    downloadedMt4: boolean;
    openedDemo: boolean;
    foundEurUsd: boolean;
  }>({
    downloadedMt4: false,
    openedDemo: false,
    foundEurUsd: false,
  });
  // Step 3 chart scan simulation
  const [scannedSimulation, setScannedSimulation] = useState(false);

  const personaOptions: SelectOption[] = [
    {
      value: 'newbie',
      label: 'Total Newbie (Never Placed a Trade)',
      sublabel: 'I need simple steps without confusing jargon',
      badge: 'Start from Zero',
    },
    {
      value: 'demo_losing',
      label: 'Have Demo but Currently Losing',
      sublabel: 'I understand MT4/5 but I blow accounts or chase tops',
      badge: '$2 Rule Fix',
    },
    {
      value: 'scanner_only',
      label: 'Experienced Trader Wanting the Scanner',
      sublabel: 'Take me to the AI scanner and MT4 Super Analysis Tool',
      badge: 'Pro Tools',
    },
  ];

  const handleStartJourney = () => {
    setJourneyActive(true);
    const element = document.getElementById('journey-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStepComplete = (stepNum: number) => {
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps([...completedSteps, stepNum]);
      onAwardXp(50, `Completed Onboarding Step ${stepNum}`);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00C261', '#38BDF8', '#F59E0B'],
      });
    }
    if (stepNum < 3) {
      setCurrentStep(stepNum + 1);
    }
  };

  const progressPercentage = (completedSteps.length / 3) * 100;

  return (
    <div className="space-y-8 pb-16">
      {/* Pillar Navigation Header Bar */}
      <PillarHeaderBar currentTab="start-here" onNavigate={onNavigate} />

      {/* 1. Top Unregistered Educational Notice Banner */}
      <div className="glass-panel-warning rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-red-200 border border-red-500/25">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p>
            <strong className="text-white">Unregistered Educational Project (Gilgil, Kenya):</strong> For self-study and technical learning only. Not licensed by CMA Kenya. Over 70% of retail forex traders lose money. Never risk money you cannot afford to lose.
          </p>
        </div>
        <button
          onClick={() => onNavigate('trust-legal')}
          className="text-amber-300 font-bold underline whitespace-nowrap hover:text-white transition"
        >
          Read Gilgil Notice
        </button>
      </div>

      {/* 2. Big Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-slate-800 text-center sm:text-left">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#00C261]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C261]/15 border border-[#00C261]/30 text-[#00C261] text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KENYA FOREX EDUCATION PROTOCOL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C261] animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            For Those Who <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C261] via-emerald-400 to-cyan-400">Don't Know Where To Start</span> in Forex.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Stop losing money to fake Telegram signal VIP clubs. Learn how the global currency market actually functions, test with <strong>CMA-licensed FXPesa</strong> demo accounts, and use our free <strong>Gilgil $2 survival rule</strong>.
          </p>

          {/* Interactive Persona Dropdown Selector */}
          <div className="max-w-xl mx-auto sm:mx-0 pt-2 space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-left block">
              Step 0: Select Who You Are
            </label>
            <CustomSelect
              options={personaOptions}
              value={selectedPersona}
              onChange={(val) => setSelectedPersona(val as UserPersona)}
              className="text-left"
            />
          </div>

          {/* Dynamic Advice Card based on Persona */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-3 text-left">
            <div className="p-2 rounded-xl bg-[#00C261]/15 text-[#00C261] shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              {selectedPersona === 'newbie' && (
                <p>
                  <strong className="text-white">Recommendation for Newbies:</strong> Take the 10-minute 3-step journey below. Do not deposit any real money yet. We will walk you through opening a free practice demo on FXPesa.
                </p>
              )}
              {selectedPersona === 'demo_losing' && (
                <p>
                  <strong className="text-white">Diagnosis for Demo Losers:</strong> You are likely revenge trading or chasing parabolic tower tops like we did at 1296.56. Jump to Step 2 and Masterclass Belt 1 for the $2 Rule.
                </p>
              )}
              {selectedPersona === 'scanner_only' && (
                <p>
                  <strong className="text-white">Fast-Track Mode:</strong> You can jump directly to the AI Scanner or MT4 Super Analysis Tool to inspect your charts using the 20/50 EMA system.
                </p>
              )}
            </div>
          </div>

          {/* Journey Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={handleStartJourney}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-sm tracking-wide transition shadow-xl shadow-[#00C261]/25 flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Start 10-Minute Guided Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {selectedPersona === 'scanner_only' ? (
              <button
                onClick={() => onNavigate('ai-scanner')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
              >
                Open Dual AI Scanner Directly
              </button>
            ) : (
              <button
                onClick={() => onNavigate('super-analysis')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
              >
                Try Super Analysis Tool
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. The 10-Minute Journey in 3 Steps */}
      <section id="journey-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>10-Minute Interactive Onboarding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Your 3-Step Road to Confident Charting
            </h2>
          </div>

          {/* Progress Indicator */}
          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Progress</span>
              <span className="text-[#00C261] font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00C261] to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { num: 1, title: 'Step 1: What is Forex?', subtitle: '2-Minute Core Visual', time: '2 min' },
            { num: 2, title: 'Step 2: Free FXPesa Demo', subtitle: 'CMA Safe Practice', time: '5 min' },
            { num: 3, title: 'Step 3: Scan Your First Chart', subtitle: 'Interactive Pattern Scan', time: '3 min' },
          ].map((tab) => {
            const isCompleted = completedSteps.includes(tab.num);
            const isCurrent = currentStep === tab.num;
            return (
              <button
                key={tab.num}
                onClick={() => setCurrentStep(tab.num)}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  isCurrent
                    ? 'bg-[#141E33] border-[#00C261] shadow-[0_0_20px_rgba(0,194,97,0.15)]'
                    : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {tab.time}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#00C261]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">Pending</span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white">{tab.title}</h4>
                <p className="text-xs text-slate-400">{tab.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Active Step Content */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-[#00C261] font-bold uppercase">
                    Pillar 1 • Foundational Concept
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    What is Forex in Exactly Two Minutes?
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#00C261]/20 text-[#00C261] font-mono font-bold">
                  2 Mins Read
                </span>
              </div>

              {/* Visual Interactive Pair Explainer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p>
                    Imagine you arrive at Jomo Kenyatta International Airport (JKIA) in Nairobi with <strong className="text-white">Kenyan Shillings (KES)</strong> and exchange them for <strong className="text-white">US Dollars (USD)</strong>. That currency exchange is forex!
                  </p>
                  <p>
                    In global markets, we trade currency pairs like <span className="text-[#00C261] font-bold font-mono">EUR/USD</span>:
                  </p>
                  <ul className="space-y-2 pl-2">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[#00C261] font-mono text-xs flex items-center justify-center shrink-0">1</span>
                      <span><strong>Base Currency (EUR):</strong> The first currency. You are either buying or selling this unit.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[#00C261] font-mono text-xs flex items-center justify-center shrink-0">2</span>
                      <span><strong>Quote Currency (USD):</strong> The price in US Dollars for 1 Euro (e.g. $1.0850).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[#00C261] font-mono text-xs flex items-center justify-center shrink-0">3</span>
                      <span><strong>Pips:</strong> The smallest price change (e.g. from 1.0850 to 1.0851 is 1 pip). With a 0.01 micro lot, 1 pip is worth approx $0.10 (13 KES).</span>
                    </li>
                  </ul>
                </div>

                {/* Interactive Pip Simulator Card */}
                <div className="p-6 rounded-2xl bg-[#0B0F17] border border-slate-700/80 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Live Simulation</span>
                    <span className="text-[#00C261] font-bold">EUR/USD Micro Lot (0.01)</span>
                  </div>

                  <div className="text-center py-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-mono">Simulated Exchange Rate</span>
                    <div className="text-3xl font-black font-mono text-white tracking-wider my-1">
                      1.08<span className="text-[#00C261]">50</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      If price rises 20 pips to 1.0870 = <strong className="text-emerald-400">+$2.00 Profit (260 KES)</strong>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    💡 <strong>The $2 Survival Rule:</strong> On a $50 account, risking $2 per trade lets you survive 25 mistakes in a row.
                  </div>

                  <button
                    onClick={() => {
                      setStep1Understood(true);
                      handleStepComplete(1);
                    }}
                    className="w-full py-3 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    I Understand Pips & Pairs → Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-[#00C261] font-bold uppercase">
                    Pillar 2 • Kenyan Broker Setup
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    How to Open a 100% Free FXPesa Demo Account
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#00C261]/20 text-[#00C261] font-mono font-bold">
                  5 Mins Action
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <p>
                    Why FXPesa? Because it is <strong className="text-white">licensed by the CMA (Capital Markets Authority of Kenya)</strong> under EGM Securities. Your practice demo has zero financial commitment.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                      <input
                        type="checkbox"
                        checked={fxpesaChecklist.downloadedMt4}
                        onChange={(e) =>
                          setFxpesaChecklist({ ...fxpesaChecklist, downloadedMt4: e.target.checked })
                        }
                        className="mt-1 accent-[#00C261] w-4 h-4 rounded"
                      />
                      <div>
                        <strong className="text-white block">1. Download MT4 or MT5</strong>
                        <span className="text-slate-400 text-xs">Available on Android (Google Play) and iOS or Windows PC.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                      <input
                        type="checkbox"
                        checked={fxpesaChecklist.openedDemo}
                        onChange={(e) =>
                          setFxpesaChecklist({ ...fxpesaChecklist, openedDemo: e.target.checked })
                        }
                        className="mt-1 accent-[#00C261] w-4 h-4 rounded"
                      />
                      <div>
                        <strong className="text-white block">2. Register Free Demo with FXPesa</strong>
                        <span className="text-slate-400 text-xs">Enter your name and Kenya phone number. Select $1,000 or $500 virtual practice balance.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                      <input
                        type="checkbox"
                        checked={fxpesaChecklist.foundEurUsd}
                        onChange={(e) =>
                          setFxpesaChecklist({ ...fxpesaChecklist, foundEurUsd: e.target.checked })
                        }
                        className="mt-1 accent-[#00C261] w-4 h-4 rounded"
                      />
                      <div>
                        <strong className="text-white block">3. Add EUR/USD to Market Watch</strong>
                        <span className="text-slate-400 text-xs">Search "EURUSD" and tap the green plus icon to open the live chart.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Guidance & External Link Card */}
                <div className="p-6 rounded-2xl bg-[#0B0F17] border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#00C261]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>CMA Non-Dealing Broker License #107</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Direct FXPesa Demo Portal</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Clicking below opens FXPesa in a new tab. No credit card required. When prompted for deposit later, remember they support Lipa Na M-Pesa direct.
                    </p>
                    <a
                      href="https://www.fxpesa.com/ke-en/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Visit Official FXPesa Kenya Site <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setFxpesaChecklist({ downloadedMt4: true, openedDemo: true, foundEurUsd: true });
                      handleStepComplete(2);
                    }}
                    className="w-full py-3 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm Demo Created → Proceed to Scan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-[#00C261] font-bold uppercase">
                    Pillar 3 • First Analysis
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    How to Scan Your First Chart
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#00C261]/20 text-[#00C261] font-mono font-bold">
                  3 Mins Interactive
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-300">
                  Before clicking BUY or SELL, professional traders check three indicators: <strong className="text-white">Price location</strong>, the <strong className="text-white">20 & 50 EMA slope</strong>, and <strong className="text-white">RSI momentum</strong>.
                </p>

                {/* Simulated Chart Scan Sandbox */}
                <div className="p-6 rounded-2xl bg-[#0B0F17] border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="font-mono text-slate-300">
                      Live Chart Feed: <strong className="text-white">GBP/USD M15 (The Gilgil Setup)</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[#00C261] font-mono font-bold">
                      Testing 1291.69 Pattern
                    </span>
                  </div>

                  {/* Visual SVG Mini Candlestick Simulation */}
                  <div className="h-44 w-full bg-[#070A10] rounded-xl p-3 relative flex items-center justify-center overflow-hidden border border-slate-800/80">
                    <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-400 space-y-0.5">
                      <div>EMA 20: 1292.80 (Cyan)</div>
                      <div>EMA 50: 1294.50 (Orange)</div>
                      <div>RSI (14): 46.2</div>
                    </div>

                    {/* Candlestick illustration */}
                    <svg className="w-full h-full" viewBox="0 0 500 120">
                      {/* 50 EMA Line (Orange) */}
                      <path d="M 20 20 Q 250 50 480 85" stroke="#F59E0B" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                      {/* 20 EMA Line (Cyan) */}
                      <path d="M 20 35 Q 250 65 480 95" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
                      
                      {/* Parabolic Tower at 1296.56 (Marked in Red) */}
                      <line x1="120" y1="10" x2="120" y2="70" stroke="#EF4444" strokeWidth="1" />
                      <rect x="114" y="15" width="12" height="35" rx="1" fill="#EF4444" />
                      <text x="90" y="8" fill="#EF4444" fontSize="10" fontFamily="monospace">1296.56 Tower Loss</text>

                      {/* Disciplined Reversal Entry at 1291.69 (Marked in Green) */}
                      <line x1="360" y1="50" x2="360" y2="105" stroke="#00C261" strokeWidth="1.5" />
                      <rect x="354" y="65" width="12" height="25" rx="1" fill="#00C261" />
                      <circle cx="360" cy="70" r="4" fill="#38BDF8" />
                      <text x="310" y="118" fill="#00C261" fontSize="10" fontFamily="monospace" fontWeight="bold">1291.69 Entry Win</text>
                    </svg>
                  </div>

                  {!scannedSimulation ? (
                    <button
                      onClick={() => setScannedSimulation(true)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00C261] to-emerald-500 text-black font-extrabold text-sm uppercase tracking-wider transition hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-[#00C261]/20 active:scale-95"
                    >
                      <Scan className="w-4 h-4" />
                      Click to Run Instant AI Scan on this Chart
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in zoom-in-95 duration-200">
                      <div className="p-4 rounded-xl bg-[#00C261]/10 border border-[#00C261]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#00C261] text-black font-black flex items-center justify-center text-base font-mono">
                            92
                          </div>
                          <div>
                            <span className="text-[#00C261] font-bold text-sm block">HIGH PROBABILITY SHORT SETUP</span>
                            <span className="text-slate-300">
                              Exhaustion pinbar confirmed below 20 EMA. Max Stake: <strong>$2.00 (0.01 lot)</strong>.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              handleStepComplete(3);
                              onNavigate('super-analysis');
                            }}
                            className="px-4 py-2 rounded-xl bg-[#00C261] text-black font-bold hover:bg-[#00dc6e] transition flex items-center gap-1.5"
                          >
                            Open Super Analysis Tool <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* All 8 Clickable Pillars Interactive Command Grid */}
        <div className="pt-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-mono text-[#00C261] font-bold uppercase tracking-wider block">
                Workstation Command Center
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                The 8 Core Pillars of PivotFX Lab (Click Any to Launch)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              8 Specialised Workstations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1 */}
            <button
              onClick={() => onNavigate('start-here')}
              className="p-5 rounded-2xl bg-[#111827] border border-[#00C261]/40 hover:border-[#00C261] text-left transition group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#00C261]/20 text-[#00C261]">
                    Pillar 01
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Onboarding</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-[#00C261] transition">
                  Start Here Journey
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  10-minute guided path covering currency pairs, CMA-licensed FXPesa demo, and first scan.
                </p>
              </div>
              <span className="text-xs font-bold text-[#00C261] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Pillar 01 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Pillar 2 */}
            <button
              onClick={() => onNavigate('super-analysis')}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-[#00C261]/60 text-left transition group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                    Pillar 02
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Analysis Engine</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                  Super Analysis Tool
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Input MT4/5 price, EMA 20/50, and RSI. Generates 0-100 score, $2 rule sizing, and 1-hour kill switch.
                </p>
              </div>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Pillar 02 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Pillar 3 */}
            <button
              onClick={() => onNavigate('tradingview')}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-emerald-500/60 text-left transition group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-[#00C261]">
                    Pillar 03
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">TradingView</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-[#00C261] transition">
                  TradingView Studio
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Built-in chart with red tower tops, green winning entries, animated tower replay, and saved levels.
                </p>
              </div>
              <span className="text-xs font-bold text-[#00C261] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Pillar 03 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Pillar 4 */}
            <button
              onClick={() => onNavigate('ai-scanner')}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-purple-500/60 text-left transition group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                    Pillar 04
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Vision AI</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-purple-400 transition">
                  Dual AI Scanner
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Option A web chart scanner + Option B phone camera lens to inspect laptop MT4 screen with OCR.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Pillar 04 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Pillar 5 */}
            <button
              onClick={() => onNavigate('masterclass')}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-amber-500/60 text-left transition group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    Pillar 05
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">5-Belt Class</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                  5-Belt Masterclass
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  From White to Master Vault (5 battle-tested strategies, quizzes, homework, and printable Kenya cert).
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Pillar 05 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Pillar 6 */}
            <button
              onClick={() => onNavigate('brokers')}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-emerald-500/60 text-left transition group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Pillar 06
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Execution Hub</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  Broker Hub & Spreads
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live EURUSD spreads comparing CMA-regulated FXPesa with offshore HFM and FBS + Kenya broker quiz.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Pillar 06 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Pillar 7 */}
            <button
              onClick={() => onNavigate('journal')}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-cyan-500/60 text-left transition group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                    Pillar 07
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Discipline</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                  Journal & 3 Calculators
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Auto-logged trades, CSV exporter, Pip/Margin calculators, $2 rule survival math, XP, and badges.
                </p>
              </div>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Pillar 07 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Pillar 8 */}
            <button
              onClick={() => onNavigate('trust-legal')}
              className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-red-500/60 text-left transition group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                    Pillar 08
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Trust & Safety</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-red-400 transition">
                  Trust, Gilgil & Legal
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The real Gilgil story of the 1296.56 loss to 1291.69 win, verified demo proof, CMA notice, and FAQs.
                </p>
              </div>
              <span className="text-xs font-bold text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Pillar 08 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
