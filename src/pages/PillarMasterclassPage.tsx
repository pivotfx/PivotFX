import React, { useState, useEffect } from 'react';
import { PillarData, PillarLesson, PageTab, CurrencyPair, Timeframe } from '../types';
import { PILLARS_LIST_META } from '../data/pillarsMasterclassData';
import { FxAcademyInteractiveTools } from '../components/tools/FxAcademyInteractiveTools';
import { ChartMasteryInteractiveTools } from '../components/tools/ChartMasteryInteractiveTools';
import { StrategyVaultInteractiveTools } from '../components/tools/StrategyVaultInteractiveTools';
import { ScannerInteractiveTools } from '../components/tools/ScannerInteractiveTools';
import { RiskInteractiveTools } from '../components/tools/RiskInteractiveTools';
import { PsychologyInteractiveTools } from '../components/tools/PsychologyInteractiveTools';
import { LivePulseInteractiveTools } from '../components/tools/LivePulseInteractiveTools';
import { GrowthLabInteractiveTools } from '../components/tools/GrowthLabInteractiveTools';
import { LessonCandleIllustration } from '../components/common/LessonCandleIllustration';
import { TradingViewEmbedWidget } from '../components/tools/TradingViewEmbedWidget';
import { TradingViewNavigationGuide } from '../components/tools/TradingViewNavigationGuide';
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Layers,
  ArrowRight,
  ShieldCheck,
  Target,
  FileText,
  Copy,
  Zap,
  ChevronRight,
  Compass,
  BarChart3,
  ExternalLink,
  X,
  Maximize2,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PillarMasterclassPageProps {
  pillar: PillarData;
  onBackToLanding: () => void;
  onNavigatePillar: (route: PageTab) => void;
}

export const PillarMasterclassPage: React.FC<PillarMasterclassPageProps> = ({
  pillar,
  onBackToLanding,
  onNavigatePillar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLessonId, setExpandedLessonId] = useState<string>(pillar.lessons[0]?.id || '');

  // Modals for TradingView Navigation & Live TradingView
  const [showTvGuideModal, setShowTvGuideModal] = useState(false);
  const [liveChartModalPair, setLiveChartModalPair] = useState<CurrencyPair | null>(null);
  const [liveChartModalTf, setLiveChartModalTf] = useState<Timeframe>('M15');

  // Completed Lessons per pillar stored in localStorage
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pivotfx_completed_${pillar.id}`);
      return saved ? JSON.parse(saved) : [pillar.lessons[0]?.id || ''];
    } catch {
      return [pillar.lessons[0]?.id || ''];
    }
  });

  useEffect(() => {
    localStorage.setItem(`pivotfx_completed_${pillar.id}`, JSON.stringify(completedLessons));
  }, [completedLessons, pillar.id]);

  const toggleCompleteLesson = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter((id) => id !== lessonId));
    } else {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#F3E5AB', '#00C261'],
      });
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round((completedLessons.length / pillar.lessons.length) * 100)
  );

  const extractPair = (raw: string): CurrencyPair => {
    if (raw.includes('EUR/USD')) return 'EUR/USD';
    if (raw.includes('USD/JPY')) return 'USD/JPY';
    if (raw.includes('GBP/JPY')) return 'GBP/JPY';
    if (raw.includes('XAU/USD') || raw.toLowerCase().includes('gold')) return 'XAU/USD';
    if (raw.includes('AUD/USD')) return 'AUD/USD';
    if (raw.includes('USD/CAD')) return 'USD/CAD';
    if (raw.includes('BTC/USD') || raw.toLowerCase().includes('btc')) return 'BTC/USD';
    return 'GBP/USD';
  };

  const filteredLessons = pillar.lessons.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.concept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header with Back to Landing & Progress Bar */}
      <div className="rounded-3xl glass-panel-gold p-6 sm:p-8 border border-[#D4AF37]/35 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#D4AF37]" />
            <span>← Back to Landing / All 8 Pillars</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Masterclass Progress:</span>
            <span className="text-[#D4AF37] font-bold">
              {completedLessons.length} / {pillar.lessons.length} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Pillar Title and Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-[#D4AF37] text-black">
              PILLAR {pillar.number}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 uppercase font-semibold">
              {pillar.category}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-slate-900 text-[#D4AF37] border border-slate-800">
              {pillar.badge}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Route: <code className="text-slate-300 font-bold">{pillar.route}</code>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {pillar.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {pillar.overview}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#F3E5AB] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(212,175,55,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Institutional Action Toolbar */}
        <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-slate-800/80">
          <button
            onClick={() => setShowTvGuideModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 via-amber-500/20 to-[#F3E5AB]/20 hover:from-[#D4AF37]/30 hover:to-amber-500/30 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold flex items-center gap-2 transition shadow-sm"
          >
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>🧭 TradingView Navigation & Buttons Guide</span>
          </button>

          <button
            onClick={() => {
              setLiveChartModalPair('GBP/USD');
              setLiveChartModalTf('M15');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-emerald-500 text-xs font-mono font-bold flex items-center gap-2 transition"
          >
            <BarChart3 className="w-4 h-4 text-[#00C261]" />
            <span>📈 Open Real TradingView Chart</span>
            <span className="w-2 h-2 rounded-full bg-[#00C261] animate-ping" />
          </button>

          <button
            onClick={() => onNavigatePillar('/ai-scanner')}
            className="px-4 py-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-700/50 text-xs font-mono font-bold flex items-center gap-2 transition"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>⚡ Deep AI EA Scanner</span>
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Table of Contents (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                Masterclass Curriculum ({pillar.lessons.length} Lessons)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Basics to Pro</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter lessons or concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* List of Lessons */}
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredLessons.map((l) => {
                const isExpanded = expandedLessonId === l.id;
                const isCompleted = completedLessons.includes(l.id);

                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      setExpandedLessonId(l.id);
                      const el = document.getElementById(`lesson-${l.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between gap-3 border ${
                      isExpanded
                        ? 'bg-[#152038] border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.18)]'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                          isExpanded
                            ? 'bg-[#D4AF37] text-black'
                            : isCompleted
                            ? 'bg-[#00C261]/20 text-[#00C261]'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {l.number}
                      </span>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold truncate">{l.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {l.levelTag} • {l.duration}
                        </span>
                      </div>
                    </div>

                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Content Area: Lessons & Interactive Tools (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Specific Interactive Tool Injections per Pillar */}
          {pillar.id === '/fx-academy' && <FxAcademyInteractiveTools />}
          {pillar.id === '/chart-mastery' && <ChartMasteryInteractiveTools />}
          {pillar.id === '/strategy-vault' && <StrategyVaultInteractiveTools />}
          {pillar.id === '/ai-scanner' && <ScannerInteractiveTools />}
          {pillar.id === '/risk-management' && <RiskInteractiveTools />}
          {pillar.id === '/psychology' && <PsychologyInteractiveTools />}
          {pillar.id === '/live-pulse' && <LivePulseInteractiveTools />}
          {pillar.id === '/growth-lab' && <GrowthLabInteractiveTools />}

          {/* Lessons Stack */}
          <div className="space-y-6">
            {filteredLessons.map((lesson) => {
              const isExpanded = expandedLessonId === lesson.id;
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  id={`lesson-${lesson.id}`}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? 'bg-[#0C1220] border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.12)]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Lesson Header Accordion Trigger */}
                  <div
                    onClick={() => setExpandedLessonId(isExpanded ? '' : lesson.id)}
                    className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-[#00C261] text-black'
                            : isExpanded
                            ? 'bg-[#D4AF37] text-black'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {lesson.number}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {lesson.levelTag}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            <span>{lesson.duration}</span>
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">{lesson.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompleteLesson(lesson.id);
                        }}
                        className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                          isCompleted
                            ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                        title="Toggle completed state"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Mark Done'}</span>
                      </button>

                      <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Lesson Detailed Content (Visible when expanded) */}
                  {isExpanded && (
                    <div className="p-5 sm:p-7 border-t border-slate-800/80 space-y-6 animate-in slide-in-from-top-2 duration-200">
                      {/* Interactive Lesson Navigation Strip: TradingView + Real Samples + EA Scanner */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0B101D] to-slate-950 border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Interactive Practice:</span>
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-[#D4AF37] border border-slate-800 font-bold">
                            {extractPair(lesson.realWorldExample.pair)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              const p = extractPair(lesson.realWorldExample.pair);
                              setLiveChartModalPair(p);
                              setLiveChartModalTf(lesson.realWorldExample.pair.includes('H1') ? 'H1' : lesson.realWorldExample.pair.includes('H4') ? 'H4' : lesson.realWorldExample.pair.includes('Daily') ? 'D1' : 'M15');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-[#D4AF37] text-[11px] font-mono font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                          >
                            <BarChart3 className="w-3.5 h-3.5 text-[#00C261]" />
                            <span>🚀 Open in TradingView</span>
                          </button>

                          <button
                            onClick={() => setShowTvGuideModal(true)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 hover:border-[#D4AF37] text-[11px] font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>🧭 TV Buttons Lesson</span>
                          </button>

                          <button
                            onClick={() => onNavigatePillar('/ai-scanner')}
                            className="px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/60 text-[11px] font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
                          >
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                            <span>⚡ Deep AI EA Scan</span>
                          </button>
                        </div>
                      </div>

                      {/* Deep Concept Description */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4" />
                          <span>Core Institutional Concept:</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {lesson.concept}
                        </p>
                      </div>

                      {/* Key Bullet Points */}
                      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                          Key Structural Rules:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {lesson.bulletPoints.map((bp, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#D4AF37] shrink-0 font-bold">•</span>
                              <span className="leading-snug">{bp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Visual Candlestick & Technical Blueprint Card */}
                      <LessonCandleIllustration lesson={lesson} />

                      {/* Real-World Market Case Study */}
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-800">
                              {lesson.realWorldExample.pair}
                            </span>
                            <span className="text-xs font-bold text-[#D4AF37]">
                              Real-World Market Example
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">Live Execution</span>
                        </div>

                        <div className="space-y-1 text-xs text-slate-300">
                          <div>
                            <strong className="text-white">Context: </strong>
                            <span>{lesson.realWorldExample.context}</span>
                          </div>
                          <div>
                            <strong className="text-white">Setup Execution: </strong>
                            <span>{lesson.realWorldExample.setup}</span>
                          </div>
                          <div>
                            <strong className="text-white">Outcome: </strong>
                            <span className="text-emerald-300">{lesson.realWorldExample.outcome}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-200">
                          <strong>Key Takeaway: </strong>
                          <span>{lesson.realWorldExample.keyTakeaway}</span>
                        </div>
                      </div>

                      {/* 2026 Institutional Master Notes & Execution Blueprint */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0E18] border border-[#D4AF37]/35 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                              Institutional Master Notes & Execution Blueprint (2026 Updated)
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">Gilgil • Nairobi • Global ECN</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Note 1: Gilgil $2 Rule */}
                          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-[#D4AF37] font-bold block uppercase">
                              1. Gilgil $2 Sizing Law (Capital Shield):
                            </span>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              Never risk more than $2.00 (approx 260 KES) on any single setup. Sizing formula: <code className="text-amber-300 font-mono">Lot Size = $2.00 / (SL Pips × $0.10)</code>. On a 20-pip stop loss, trade strictly 0.01 micro lot. If stop is 10 pips, maximum is 0.02 micro lots.
                            </p>
                          </div>

                          {/* Note 2: EAT Liquidity Window */}
                          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">
                              2. East Africa Time (EAT) Liquidity Windows:
                            </span>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              London Open kicks off at <strong>10:00 AM EAT</strong> with Judas liquidity sweeps. New York Session opens at <strong>3:30 PM EAT</strong> with peak momentum. Avoid opening new market orders between 7:00 PM and 2:00 AM EAT during low-liquidity rollover spread spikes.
                            </p>
                          </div>

                          {/* Note 3: Broker Environment */}
                          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">
                              3. Kenyan Broker & M-Pesa Economics:
                            </span>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              Prefer <strong>FXPesa</strong> (CMA Kenya regulated, zero-fee instant M-Pesa deposits & withdrawals, tight EUR/USD & GBP/USD spreads ~1.2 pips). For offshore accounts (HFM, FBS), ensure leverage does not exceed 1:100 to prevent psychological overleveraging.
                            </p>
                          </div>

                          {/* Note 4: MT4/MT5 Execution Hotkeys */}
                          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase">
                              4. Pro MetaTrader Hotkeys & Discipline:
                            </span>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-white">F9</kbd> for instant order ticket. Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-white">Ctrl + T</kbd> to toggle the terminal. Always set your Stop Loss before clicking Buy or Sell. Never move your Stop Loss backwards during drawdown.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actionable Execution Checklist */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                          Actionable Checklist for Today:
                        </span>
                        <div className="space-y-1.5">
                          {lesson.actionableChecklist.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <button
                          onClick={() => toggleCompleteLesson(lesson.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition ${
                            isCompleted
                              ? 'bg-[#00C261] text-black font-extrabold'
                              : 'btn-gold text-black'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{isCompleted ? '✓ Completed (Review Again)' : 'Mark Lesson Complete'}</span>
                        </button>

                        <span className="text-xs font-mono text-slate-400">
                          Lesson {lesson.number} of {pillar.lessons.length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Standalone Return to Home Portal (Enforcing Pillar Independence) */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] block">
                Independent Masterclass Chamber
              </span>
              <p className="text-xs text-slate-400">
                Pillars are isolated curriculum environments. Return to the Home Portal to enter another academy.
              </p>
            </div>

            <button
              onClick={onBackToLanding}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home Portal (All 8 Pillars)</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: TRADINGVIEW NAVIGATION & BUTTONS LESSON GUIDE
         ========================================================================= */}
      {showTvGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl rounded-3xl bg-[#090D16] border border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37]">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>TradingView Navigation & Button Directory</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40">
                      Live Academy
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comprehensive interactive lessons for every TradingView button, shortcut, ICT setup, and newbie mistake.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTvGuideModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <TradingViewNavigationGuide />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Pro Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">Alt + F</kbd> for OTE Fibonacci & <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">Alt + J</kbd> for BSL/SSL Rays
              </span>
              <button
                onClick={() => setShowTvGuideModal(false)}
                className="px-5 py-2 rounded-xl btn-gold text-black font-extrabold text-xs uppercase tracking-wider"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: LIVE EMBEDDED TRADINGVIEW CHART
         ========================================================================= */}
      {liveChartModalPair && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl rounded-3xl bg-[#090D16] border border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col max-h-[94vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400">
                  <BarChart3 className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Live TradingView Embed: {liveChartModalPair} ({liveChartModalTf})
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-[#00C261] animate-ping" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time market candlestick feed with dynamic indicators, volume, and timeframe switching.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setLiveChartModalPair(null);
                    onNavigatePillar('/ai-scanner');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Send to Deep AI EA</span>
                </button>

                <button
                  onClick={() => setLiveChartModalPair(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-[#080C14]">
              <TradingViewEmbedWidget
                pair={liveChartModalPair}
                timeframe={liveChartModalTf}
                onPairChange={(p) => setLiveChartModalPair(p)}
                onTimeframeChange={(tf) => setLiveChartModalTf(tf)}
                onClose={() => setLiveChartModalPair(null)}
                isCollapsible={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
