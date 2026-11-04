import React, { useState, useEffect } from 'react';
import { PillarData, PageTab } from '../types';
import { FxAcademyInteractiveTools } from '../components/tools/FxAcademyInteractiveTools';
import { ChartMasteryInteractiveTools } from '../components/tools/ChartMasteryInteractiveTools';
import { StrategyVaultInteractiveTools } from '../components/tools/StrategyVaultInteractiveTools';
import { ScannerInteractiveTools } from '../components/tools/ScannerInteractiveTools';
import { RiskInteractiveTools } from '../components/tools/RiskInteractiveTools';
import { PsychologyInteractiveTools } from '../components/tools/PsychologyInteractiveTools';
import { LivePulseInteractiveTools } from '../components/tools/LivePulseInteractiveTools';
import { GrowthLabInteractiveTools } from '../components/tools/GrowthLabInteractiveTools';
import { LessonCandleIllustration } from '../components/common/LessonCandleIllustration';
import { LessonExpoundedMastery } from '../components/masterclass/LessonExpoundedMastery';
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
  ChevronRight
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
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string>(pillar.lessons[0]?.id || '');

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

  const selectedLesson = pillar.lessons.find((l) => l.id === selectedLessonId) || null;
  const selectedLessonIndex = selectedLesson ? pillar.lessons.findIndex((l) => l.id === selectedLesson.id) : -1;
  const prevLesson = selectedLessonIndex > 0 ? pillar.lessons[selectedLessonIndex - 1] : null;
  const nextLesson = selectedLessonIndex >= 0 && selectedLessonIndex < pillar.lessons.length - 1 ? pillar.lessons[selectedLessonIndex + 1] : null;

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
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#D4AF37]" />
              <span>← Back to Landing / All 8 Pillars</span>
            </button>

            {selectedLesson && (
              <button
                onClick={() => setSelectedLessonId(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-mono font-bold transition"
              >
                <span>← Return to All Lessons in Pillar {pillar.number}</span>
              </button>
            )}
          </div>

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
            {selectedLesson ? (
              <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 font-bold">
                Focused on Lesson {selectedLesson.number}
              </span>
            ) : (
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Curriculum: <code className="text-slate-300 font-bold">{pillar.lessons.length} Lessons Available</code>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {selectedLesson ? selectedLesson.title : pillar.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {selectedLesson ? selectedLesson.summary : pillar.overview}
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
              <span className="text-[11px] font-mono text-slate-400">Pillar {pillar.number}</span>
            </div>

            {selectedLesson && (
              <button
                onClick={() => setSelectedLessonId(null)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
              >
                <span>← View Pillar Interactive Hub & All Lessons</span>
              </button>
            )}

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
            <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredLessons.map((l) => {
                const isSelected = selectedLessonId === l.id;
                const isCompleted = completedLessons.includes(l.id);
                const isIct = l.title.toLowerCase().includes('ict');

                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      setSelectedLessonId(l.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between gap-3 border ${
                      isSelected
                        ? 'bg-[#152038] border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]'
                        : isIct
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200 hover:bg-amber-950/40 hover:text-white'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black font-extrabold'
                            : isIct
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                            : isCompleted
                            ? 'bg-[#00C261]/20 text-[#00C261]'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {l.number}
                      </span>
                      <div className="flex flex-col truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          {isIct && (
                            <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-[#D4AF37] text-black">
                              ICT
                            </span>
                          )}
                          <span className="text-xs font-bold truncate">{l.title.replace('ICT Masterclass: ', '')}</span>
                        </div>
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

        {/* Right Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedLesson ? (
            /* =========================================================================
               CASE A: DEDICATED SINGLE-LESSON FOCUS VIEW (Clean, isolated, expounded)
               User Request: "if i click lesson 1 let the inside page remain everything
               about lesson one, i will return back to go to lesson 2 and so on"
               ========================================================================= */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Top Navigation & Breadcrumb Return Header */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <button
                  onClick={() => setSelectedLessonId(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-[#D4AF37]/40 text-xs font-mono font-bold transition group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>← Return to All Lessons in Pillar {pillar.number}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    Lesson {selectedLesson.number} of {pillar.lessons.length}
                  </span>
                  <button
                    onClick={() => toggleCompleteLesson(selectedLesson.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                      completedLessons.includes(selectedLesson.id)
                        ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                        : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{completedLessons.includes(selectedLesson.id) ? '✓ Completed' : 'Mark Lesson Done'}</span>
                  </button>
                </div>
              </div>

              {/* The Dedicated Lesson Card */}
              <div className="rounded-3xl border border-[#D4AF37]/50 bg-[#0C1220] shadow-[0_0_35px_rgba(212,175,55,0.15)] overflow-hidden">
                <div className="p-6 sm:p-8 space-y-7">
                  {/* Header */}
                  <div className="space-y-3 pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-7 h-7 rounded-xl font-mono text-xs font-black bg-[#D4AF37] text-black flex items-center justify-center">
                        {selectedLesson.number}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-300 border border-slate-700 font-semibold">
                        {selectedLesson.levelTag}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{selectedLesson.duration}</span>
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {selectedLesson.title}
                    </h2>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedLesson.summary}
                    </p>
                  </div>

                  {/* Core Institutional Concept */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>Core Institutional Concept:</span>
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                      {selectedLesson.concept}
                    </p>
                  </div>

                  {/* Key Structural Rules */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Key Execution & Risk Rules:
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {selectedLesson.bulletPoints.map((bp, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#D4AF37] shrink-0 font-bold text-sm">▶</span>
                          <span className="leading-snug">{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Candlestick & Technical Blueprint Card */}
                  <LessonCandleIllustration lesson={selectedLesson} />

                  {/* Comprehensive Deep Lesson Expounded Mastery (Real-World Case Study + MT4 Ticket + Checklist) */}
                  <LessonExpoundedMastery lesson={selectedLesson} pillar={pillar} />

                  {/* Bottom Prev / Return / Next Navigation Bar */}
                  <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {prevLesson ? (
                      <button
                        onClick={() => {
                          setSelectedLessonId(prevLesson.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                        <span>Prev: Lesson {prevLesson.number}</span>
                      </button>
                    ) : (
                      <div className="hidden sm:block" />
                    )}

                    <button
                      onClick={() => {
                        setSelectedLessonId(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-gold text-black text-xs font-mono font-black uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Return to All Lessons in Pillar {pillar.number}</span>
                    </button>

                    {nextLesson ? (
                      <button
                        onClick={() => {
                          setSelectedLessonId(nextLesson.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center gap-2"
                      >
                        <span>Next: Lesson {nextLesson.number}</span>
                        <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                      </button>
                    ) : (
                      <div className="hidden sm:block" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               CASE B: CURRICULUM OVERVIEW MODE
               Shows:
               1. Interactive Tool for this Pillar (e.g. Scanner, Risk, Strategy, etc.)
               2. Clean, uncluttered Grid of Independent Lesson Cards (Clickable to open)
               ========================================================================= */
            <div className="space-y-8">
              {/* Specific Interactive Tool Injection per Pillar */}
              {pillar.id === '/fx-academy' && <FxAcademyInteractiveTools />}
              {pillar.id === '/chart-mastery' && <ChartMasteryInteractiveTools />}
              {pillar.id === '/strategy-vault' && <StrategyVaultInteractiveTools />}
              {pillar.id === '/ai-scanner' && <ScannerInteractiveTools />}
              {pillar.id === '/risk-management' && <RiskInteractiveTools />}
              {pillar.id === '/psychology' && <PsychologyInteractiveTools />}
              {pillar.id === '/live-pulse' && <LivePulseInteractiveTools />}
              {pillar.id === '/growth-lab' && <GrowthLabInteractiveTools />}

              {/* Independent Lesson Cards Grid */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                      <span>Pillar {pillar.number} Masterclass Chamber: All {pillar.lessons.length} Lessons</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Click any card below to enter its dedicated focus view with expounded concepts, real-world case studies, and MT4 execution tickets.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#D4AF37] px-3 py-1 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                    {completedLessons.length} of {pillar.lessons.length} Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredLessons.map((lesson) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isIct = lesson.title.toLowerCase().includes('ict');

                    return (
                      <div
                        key={lesson.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                          isCompleted
                            ? 'bg-slate-900/50 border-[#00C261]/40 hover:border-[#00C261]'
                            : 'bg-slate-900/70 border-slate-800 hover:border-[#D4AF37]/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="w-7 h-7 rounded-xl font-mono text-xs font-black bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
                              {lesson.number}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isIct && (
                                <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-[#D4AF37] text-black">
                                  ICT
                                </span>
                              )}
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                                {lesson.levelTag}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#D4AF37]" />
                                <span>{lesson.duration}</span>
                              </span>
                            </div>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                            {lesson.title}
                          </h4>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {lesson.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <button
                            onClick={() => toggleCompleteLesson(lesson.id)}
                            className={`p-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition ${
                              isCompleted
                                ? 'text-[#00C261] hover:text-[#00C261]/80'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isCompleted ? 'Done' : 'Mark'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition group"
                          >
                            <span>Open Lesson {lesson.number}</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

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
    </div>
  );
};

