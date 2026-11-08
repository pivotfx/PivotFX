import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PillarData, PageTab } from '../types';

const FxAcademyInteractiveTools = lazy(() =>
  import('../components/tools/FxAcademyInteractiveTools').then((m) => ({ default: m.FxAcademyInteractiveTools }))
);
const ChartMasteryInteractiveTools = lazy(() =>
  import('../components/tools/ChartMasteryInteractiveTools').then((m) => ({ default: m.ChartMasteryInteractiveTools }))
);
const StrategyVaultInteractiveTools = lazy(() =>
  import('../components/tools/StrategyVaultInteractiveTools').then((m) => ({ default: m.StrategyVaultInteractiveTools }))
);
const ScannerInteractiveTools = lazy(() =>
  import('../components/tools/ScannerInteractiveTools').then((m) => ({ default: m.ScannerInteractiveTools }))
);
const RiskInteractiveTools = lazy(() =>
  import('../components/tools/RiskInteractiveTools').then((m) => ({ default: m.RiskInteractiveTools }))
);
const PsychologyInteractiveTools = lazy(() =>
  import('../components/tools/PsychologyInteractiveTools').then((m) => ({ default: m.PsychologyInteractiveTools }))
);
const LivePulseInteractiveTools = lazy(() =>
  import('../components/tools/LivePulseInteractiveTools').then((m) => ({ default: m.LivePulseInteractiveTools }))
);
const GrowthLabInteractiveTools = lazy(() =>
  import('../components/tools/GrowthLabInteractiveTools').then((m) => ({ default: m.GrowthLabInteractiveTools }))
);
const MacroTradeSafetyTools = lazy(() =>
  import('../components/tools/MacroTradeSafetyTools').then((m) => ({ default: m.MacroTradeSafetyTools }))
);
import { PILLARS_MASTERCLASS_DATA } from '../data/pillarsMasterclassData';
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
  ChevronRight,
  Zap
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
  const [showCurriculumChamber, setShowCurriculumChamber] = useState<boolean>(false);

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

  // Reset sub-views cleanly when switching pillars
  useEffect(() => {
    setSelectedLessonId(null);
    setShowCurriculumChamber(false);
    setSearchQuery('');
  }, [pillar.id]);

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
  const nextUnfinishedLesson =
    pillar.lessons.find((l) => !completedLessons.includes(l.id)) || pillar.lessons[0];

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
              <span>← Back to Landing / All {PILLARS_MASTERCLASS_DATA.length} Pillars</span>
            </button>

            {selectedLesson && (
              <button
                onClick={() => {
                  setSelectedLessonId(null);
                  setShowCurriculumChamber(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-mono font-bold transition"
              >
                <span>← Return to Lessons 01–{pillar.lessons.length}</span>
              </button>
            )}

            {showCurriculumChamber && !selectedLesson && (
              <button
                onClick={() => setShowCurriculumChamber(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-mono font-bold transition"
              >
                <span>← Return to Pillar {pillar.number} Workstation</span>
              </button>
            )}
          </div>

          {/* Mode Switcher: 100% Pillar Independent Workstation vs Dedicated Curriculum Chamber */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setShowCurriculumChamber(false);
                setSelectedLessonId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                !showCurriculumChamber && !selectedLesson
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Live Workstation</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowCurriculumChamber(true);
                setSelectedLessonId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                showCurriculumChamber || selectedLesson
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum Chamber ({completedLessons.length}/{pillar.lessons.length})</span>
            </button>
          </div>
        </div>

        {/* Pillar Title & Unboxed Metadata */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap tabular-nums">
            <span className="text-[#D4AF37] font-bold">Pillar {pillar.number}</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-300 font-semibold">{pillar.category}</span>
            <span aria-hidden="true">·</span>
            <span>{pillar.badge}</span>
            <span aria-hidden="true">·</span>
            <span className="text-white font-semibold">
              {selectedLesson
                ? `Lesson ${selectedLesson.number} of ${pillar.lessons.length}`
                : showCurriculumChamber
                ? `Curriculum Chamber (${pillar.lessons.length} Lessons)`
                : `${pillar.lessons.length} Lessons Inside Chamber`}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight text-balance">
            {selectedLesson
              ? selectedLesson.title
              : showCurriculumChamber
              ? `Pillar ${pillar.number} Curriculum (Lessons 01–${pillar.lessons.length})`
              : pillar.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {selectedLesson
              ? selectedLesson.summary
              : showCurriculumChamber
              ? `Select any independent lesson card below to study it in isolation. Return anytime to advance to the next lesson.`
              : pillar.overview}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800 tabular-nums">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#F3E5AB] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. ISOLATED FULL-WIDTH VIEW SWITCHER (1: Single Lesson | 2: Curriculum Chamber 01-10 | 3: Workstation + Curriculum Card) */}
      <div className="space-y-8">
        {selectedLesson ? (
          /* =========================================================================
             CASE A: DEDICATED SINGLE-LESSON FOCUS VIEW
             ========================================================================= */
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLessonId(null);
                    setShowCurriculumChamber(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-slate-700 text-xs font-mono font-bold transition whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All Lessons 01–{pillar.lessons.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLessonId(null);
                    setShowCurriculumChamber(false);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-bold transition whitespace-nowrap"
                >
                  <span>Pillar {pillar.number} Tools</span>
                </button>
              </div>

              <div className="flex items-center gap-3 tabular-nums">
                <span className="text-xs font-mono text-slate-400">
                  Lesson {selectedLesson.number} / {pillar.lessons.length}
                </span>
                <button
                  type="button"
                  onClick={() => toggleCompleteLesson(selectedLesson.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                    completedLessons.includes(selectedLesson.id)
                      ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{completedLessons.includes(selectedLesson.id) ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0C1220] overflow-hidden">
              <div className="p-6 sm:p-8 space-y-7">
                <div className="space-y-3 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap tabular-nums">
                    <span className="text-[#D4AF37] font-bold">Lesson {selectedLesson.number}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-cyan-300 font-semibold">{selectedLesson.levelTag}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
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
                      setShowCurriculumChamber(true);
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
        ) : showCurriculumChamber ? (
          /* =========================================================================
             CASE B: DEDICATED CURRICULUM CHAMBER (All 01-10 Independent Lesson Cards)
             ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-[#D4AF37]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => {
                  setShowCurriculumChamber(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-[#D4AF37]/40 text-xs font-mono font-bold transition group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>← Return to Pillar {pillar.number} Interactive Tools</span>
              </button>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter lessons 01–10..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isIct = lesson.title.toLowerCase().includes('ict');

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLessonId(lesson.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedLessonId(lesson.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer ${
                      isCompleted
                        ? 'bg-slate-900/50 border-[#00C261]/40 hover:border-[#00C261]'
                        : 'bg-slate-900/70 border-slate-800 hover:border-[#D4AF37]/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400 tabular-nums">
                        <span className="text-[#D4AF37] font-bold">
                          Lesson {lesson.number}{isIct ? ' · ICT' : ''}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="text-cyan-300 font-semibold">{lesson.levelTag}</span>
                          <span aria-hidden="true">·</span>
                          <Clock className="w-3 h-3 text-[#D4AF37]" />
                          <span>{lesson.duration}</span>
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                        {lesson.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {lesson.summary}
                      </p>
                    </div>

                    <div
                      className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCompleteLesson(lesson.id)}
                        className={`p-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1 transition whitespace-nowrap ${
                          isCompleted
                            ? 'text-[#00C261] hover:text-[#00C261]/80'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Done' : 'Mark'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLessonId(lesson.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition whitespace-nowrap"
                      >
                        <span>Open Lesson {lesson.number}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* =========================================================================
             CASE C: UNCONGESTED PILLAR WORKSTATION
             ========================================================================= */
          <div className="space-y-8">
            <Suspense
              fallback={
                <div className="p-8 rounded-2xl bg-[#0C1220] border border-slate-800 text-center text-xs font-mono text-[#D4AF37]">
                  Initializing Live Interactive Market Workstation...
                </div>
              }
            >
              {pillar.id === '/fx-academy' && <FxAcademyInteractiveTools />}
              {pillar.id === '/chart-mastery' && <ChartMasteryInteractiveTools />}
              {pillar.id === '/strategy-vault' && <StrategyVaultInteractiveTools />}
              {pillar.id === '/ai-scanner' && <ScannerInteractiveTools />}
              {pillar.id === '/risk-management' && <RiskInteractiveTools />}
              {pillar.id === '/psychology' && <PsychologyInteractiveTools />}
              {pillar.id === '/live-pulse' && <LivePulseInteractiveTools />}
              {pillar.id === '/growth-lab' && <GrowthLabInteractiveTools />}
              {pillar.id === '/macro-safety' && <MacroTradeSafetyTools onNavigatePillar={onNavigatePillar} />}
            </Suspense>

            {/* Subtle Pillar Independence Footer */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C261]" />
                <span>Pillar {pillar.number} Dedicated Live Workstation Active</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowCurriculumChamber(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#D4AF37] transition flex items-center gap-1 text-slate-400 hover:text-[#D4AF37] underline"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Access Optional Pillar {pillar.number} Curriculum Chamber ({pillar.lessons.length} Lessons)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

