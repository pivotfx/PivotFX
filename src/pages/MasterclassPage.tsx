import React, { useState, useEffect } from 'react';
import { MasterclassLesson, MasterclassStrategy, PageTab, CurrencyPair, Timeframe } from '../types';
import { MASTERCLASS_LESSONS, MASTER_STRATEGIES } from '../data/forexData';
import { TradingViewEmbedWidget } from '../components/tools/TradingViewEmbedWidget';
import { TradingViewNavigationGuide } from '../components/tools/TradingViewNavigationGuide';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  Play,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  Printer,
  X,
  FileText,
  Calculator,
  Compass,
  Layers,
  Check,
  Lock,
  ChevronRight,
  ExternalLink,
  Target,
  BarChart3,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PillarHeaderBar } from '../components/common/PillarHeaderBar';

interface MasterclassPageProps {
  onNavigate: (tab: PageTab) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

export const MasterclassPage: React.FC<MasterclassPageProps> = ({ onNavigate, onAwardXp }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBelt, setSelectedBelt] = useState<'all' | 'white' | 'blue' | 'purple' | 'black' | 'master' | 'ict'>('all');
  
  // Dedicated Classroom Mode: null = Catalog View; lessonId = Inside Classroom Page View
  const [activeClassroomId, setActiveClassroomId] = useState<string | null>(null);
  const [classroomTab, setClassroomTab] = useState<'lecture' | 'samples' | 'diagram' | 'practice' | 'quiz' | 'tradingview'>('lecture');
  const [showTvNavModal, setShowTvNavModal] = useState(false);

  // Completed lesson IDs persisted in localStorage
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_completed_lessons');
      return saved ? JSON.parse(saved) : ['w-1'];
    } catch {
      return ['w-1'];
    }
  });

  // Quiz state: lessonId -> selected option index
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  // Certificate Modal State
  const [showCertificate, setShowCertificate] = useState(false);
  const [studentName, setStudentName] = useState('Kenyan Trader');

  useEffect(() => {
    localStorage.setItem('pivotfx_completed_lessons', JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  const handleMarkComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      const next = [...completedLessonIds, lessonId];
      setCompletedLessonIds(next);
      onAwardXp(60, `Completed Masterclass Lesson ${lessonId}`);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00C261', '#F59E0B', '#38BDF8'],
      });
    }
  };

  const handleQuizAnswer = (lessonId: string, optIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [lessonId]: optIndex });
  };

  const handleSubmitQuiz = (lesson: MasterclassLesson) => {
    const selected = quizAnswers[lesson.id];
    if (selected === undefined) {
      alert('Please select an option before submitting.');
      return;
    }
    setQuizSubmitted({ ...quizSubmitted, [lesson.id]: true });
    if (selected === lesson.quiz.correctIndex) {
      handleMarkComplete(lesson.id);
      onAwardXp(40, 'Passed Lesson Quiz');
    }
  };

  const totalLessons = MASTERCLASS_LESSONS.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  // Find next uncompleted lesson
  const nextLesson = MASTERCLASS_LESSONS.find((l) => !completedLessonIds.includes(l.id)) || MASTERCLASS_LESSONS[0];

  const filteredLessons = MASTERCLASS_LESSONS.filter((lesson) => {
    const matchesBelt = selectedBelt === 'all' || lesson.belt === selectedBelt;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBelt && matchesSearch;
  });

  const beltBadges = [
    { id: 'white', label: 'Beginner (White)', subtitle: 'Basics & $2 Rule', color: 'border-slate-300 text-white bg-slate-800' },
    { id: 'blue', label: 'Intermediate (Blue)', subtitle: 'EMA & 1.35100 Lore', color: 'border-blue-500 text-blue-400 bg-blue-950/40' },
    { id: 'purple', label: 'Advanced (Purple)', subtitle: 'Multi-Timeframe & Spreads', color: 'border-purple-500 text-purple-400 bg-purple-950/40' },
    { id: 'black', label: 'Pro / Institutional (Black)', subtitle: 'Mechanical Edge & Ethics', color: 'border-emerald-500 text-[#00C261] bg-emerald-950/40' },
    { id: 'master', label: 'Strategy Vault (Master)', subtitle: '5 Battle Strategies', color: 'border-amber-500 text-amber-400 bg-amber-950/40' },
    { id: 'ict', label: 'ICT Institutional (Gold)', subtitle: 'FVG, Order Blocks & Silver Bullet', color: 'border-[#D4AF37] text-[#D4AF37] bg-amber-950/40' },
  ];

  // Active classroom lesson object if inside a classroom
  const activeClass = MASTERCLASS_LESSONS.find((l) => l.id === activeClassroomId);
  const activeClassIndex = activeClass ? MASTERCLASS_LESSONS.findIndex((l) => l.id === activeClass.id) : -1;
  const prevClass = activeClassIndex > 0 ? MASTERCLASS_LESSONS[activeClassIndex - 1] : null;
  const nextClassInSequence = activeClassIndex >= 0 && activeClassIndex < MASTERCLASS_LESSONS.length - 1 ? MASTERCLASS_LESSONS[activeClassIndex + 1] : null;

  return (
    <div className="space-y-8 pb-16">
      {/* =========================================================================
          VIEW A: DEDICATED CLASSROOM WORKSPACE (INSIDE A CLASS)
         ========================================================================= */}
      {activeClass ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Classroom Header Bar & Breadcrumb Navigation */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-3xl bg-[#111827] border border-slate-800">
            <div className="space-y-1">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <button
                  onClick={() => setActiveClassroomId(null)}
                  className="hover:text-white transition flex items-center gap-1 text-[#00C261]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Academy Catalog</span>
                </button>
                <span>/</span>
                <span className="text-slate-400">{activeClass.belt.toUpperCase()} BELT</span>
                <span>/</span>
                <span className="text-white font-bold truncate">Class {activeClass.number}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
                <span>Class {activeClass.number}: {activeClass.title}</span>
                {completedLessonIds.includes(activeClass.id) && (
                  <CheckCircle2 className="w-5 h-5 text-[#00C261]" />
                )}
              </h1>
            </div>

            {/* Classroom Actions */}
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {activeClass.duration} Lecture
              </span>
              <button
                onClick={() => setActiveClassroomId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Back to Classes</span>
              </button>
            </div>
          </div>

          {/* Classroom 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Curriculum Navigator (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Academy Curriculum
                  </h3>
                  <span className="text-xs font-mono text-[#00C261] font-bold">
                    {completedCount}/{totalLessons} Done
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
                  {MASTERCLASS_LESSONS.map((l) => {
                    const isCurrent = l.id === activeClass.id;
                    const isDone = completedLessonIds.includes(l.id);

                    return (
                      <button
                        key={l.id}
                        onClick={() => {
                          setActiveClassroomId(l.id);
                          setClassroomTab('lecture');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between gap-3 border ${
                          isCurrent
                            ? 'bg-[#141E33] border-[#00C261] text-white shadow-[0_0_15px_rgba(0,194,97,0.15)] ring-1 ring-[#00C261]'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span
                            className={`w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? 'bg-[#00C261] text-black'
                                : isDone
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

                        {isDone ? (
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

            {/* Right Main Column: Active Class Lecture & Workshop (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Classroom Tabs: Lecture, Samples & Cases, Diagram, Practice, Quiz, Live TradingView */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto text-xs font-bold font-mono">
                <button
                  onClick={() => setClassroomTab('lecture')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    classroomTab === 'lecture' ? 'bg-[#00C261] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Lecture & Notes</span>
                </button>

                <button
                  onClick={() => setClassroomTab('samples')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    classroomTab === 'samples' ? 'bg-[#00C261] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Samples & Cases ({activeClass.samplesAndCases?.length || 1})</span>
                </button>

                <button
                  onClick={() => setClassroomTab('diagram')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    classroomTab === 'diagram' ? 'bg-[#00C261] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3. Chart Diagram</span>
                </button>

                <button
                  onClick={() => setClassroomTab('practice')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    classroomTab === 'practice' ? 'bg-[#00C261] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>4. Hands-on Practice</span>
                </button>

                <button
                  onClick={() => setClassroomTab('quiz')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    classroomTab === 'quiz' ? 'bg-[#00C261] text-black shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>5. Graded Exam</span>
                </button>

                <button
                  onClick={() => setClassroomTab('tradingview')}
                  className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                    classroomTab === 'tradingview' ? 'bg-[#D4AF37] text-black shadow-md font-black' : 'text-amber-300 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>6. Live TradingView Chart</span>
                </button>
              </div>

              {/* Quick Institutional Action Bar */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0C1220] via-slate-900 to-[#0C1220] border border-[#D4AF37]/35 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Active Instrument:</span>
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-[#D4AF37] border border-slate-700 font-bold">
                    {activeClass.tvSymbol || 'GBPUSD'} ({activeClass.tvTimeframe || '15'}m)
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setClassroomTab('tradingview')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#00C261]" />
                    <span>🚀 View Live Candles</span>
                  </button>

                  <button
                    onClick={() => setShowTvNavModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>🧭 TradingView Buttons Guide</span>
                  </button>

                  <button
                    onClick={() => onNavigate('/ai-scanner')}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>⚡ Send to Deep AI EA</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: LECTURE & THEORY */}
              {classroomTab === 'lecture' && (
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  {/* Real-time EAT note */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-mono">East Africa Time Market Context:</strong>
                      <span>{activeClass.realTimeNote}</span>
                    </div>
                  </div>

                  {/* Learning Objectives */}
                  {activeClass.learningObjectives && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <strong className="text-xs font-mono uppercase tracking-wider text-[#00C261] block">
                        Core Learning Objectives
                      </strong>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {activeClass.learningObjectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#00C261] shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Lecture Content */}
                  <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                    {activeClass.content.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Live market example */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                    <strong className="text-white font-mono block">Real Market Context:</strong>
                    <p className="text-slate-300">{activeClass.liveMarketExample}</p>
                  </div>
                </div>
              )}

              {/* TAB 2: SAMPLES & REAL CASES */}
              {classroomTab === 'samples' && (
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#00C261] font-bold uppercase">
                      Practical Samples & Math Breakdowns
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Real-World Case Studies for Class {activeClass.number}
                    </h3>
                  </div>

                  {activeClass.samplesAndCases && activeClass.samplesAndCases.length > 0 ? (
                    <div className="space-y-4">
                      {activeClass.samplesAndCases.map((sample, sIdx) => (
                        <div
                          key={sIdx}
                          className={`p-5 rounded-2xl border space-y-3 ${
                            sample.type === 'win_case'
                              ? 'bg-emerald-950/20 border-[#00C261]/30 text-emerald-200'
                              : sample.type === 'loss_case'
                              ? 'bg-red-950/20 border-red-500/30 text-red-200'
                              : 'bg-slate-900 border-slate-800 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white flex items-center gap-2">
                              {sample.type === 'win_case' && <TrendingUp className="w-4 h-4 text-[#00C261]" />}
                              {sample.type === 'loss_case' && <TrendingDown className="w-4 h-4 text-red-400" />}
                              {sample.title}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300 uppercase">
                              {sample.type.replace('_', ' ')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {sample.description}
                          </p>

                          {sample.mathSnippet && (
                            <div className="p-3 rounded-xl bg-[#0B0F17] border border-slate-800 font-mono text-xs text-cyan-300">
                              <code>{sample.mathSnippet}</code>
                            </div>
                          )}

                          <div className="pt-1 text-xs text-slate-400 flex items-start gap-1.5">
                            <strong className="text-white font-mono">Takeaway:</strong>
                            <span>{sample.takeaway}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-900 text-center text-xs text-slate-400">
                      Standard theory covered in lecture notes.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DIAGRAM & ANATOMY */}
              {classroomTab === 'diagram' && (
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
                  <span className="text-xs font-mono text-[#00C261] font-bold uppercase">
                    Interactive Visual Schematic
                  </span>
                  <div className="h-64 w-full rounded-2xl bg-[#070A10] border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
                    {activeClass.chartIllustrationType === 'candlestick_anatomy' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <line x1="80" y1="10" x2="80" y2="110" stroke="#00C261" strokeWidth="2.5" />
                        <rect x="66" y="30" width="28" height="60" fill="#00C261" rx="2" />
                        <text x="105" y="35" fill="#00C261" fontSize="11" fontFamily="monospace" fontWeight="bold">Close Price</text>
                        <text x="105" y="90" fill="#00C261" fontSize="11" fontFamily="monospace" fontWeight="bold">Open Price</text>
                        <text x="70" y="8" fill="#94A3B8" fontSize="9" fontFamily="monospace">Upper Wick</text>
                        <text x="70" y="118" fill="#94A3B8" fontSize="9" fontFamily="monospace">Lower Wick</text>
                        <line x1="220" y1="10" x2="220" y2="110" stroke="#EF4444" strokeWidth="2.5" />
                        <rect x="206" y="30" width="28" height="60" fill="#EF4444" rx="2" />
                        <text x="245" y="35" fill="#EF4444" fontSize="11" fontFamily="monospace" fontWeight="bold">Open Price</text>
                        <text x="245" y="90" fill="#EF4444" fontSize="11" fontFamily="monospace" fontWeight="bold">Close Price</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'pinbar_tower' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <line x1="150" y1="5" x2="150" y2="105" stroke="#EF4444" strokeWidth="2.5" />
                        <rect x="140" y="80" width="20" height="20" fill="#EF4444" rx="2" />
                        <text x="60" y="20" fill="#EF4444" fontSize="11" fontFamily="monospace" fontWeight="bold">Long Rejection Wick (Institutional Sellers)</text>
                        <text x="170" y="95" fill="#FFFFFF" fontSize="10" fontFamily="monospace">Small Body (Agreement Zone)</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'two_dollar_rule' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <rect x="15" y="20" width="270" height="80" rx="10" fill="#111827" stroke="#00C261" strokeWidth="2" />
                        <text x="30" y="50" fill="#00C261" fontSize="14" fontFamily="monospace" fontWeight="bold">$50 Account ÷ $2 Risk = 25 Lives</text>
                        <text x="30" y="75" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">Risk is capped at 260 KES. Emotional panic eliminated.</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'ema_crossover' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <path d="M 20 80 Q 150 40 280 20" stroke="#38BDF8" strokeWidth="3" fill="none" />
                        <path d="M 20 100 Q 150 70 280 50" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                        <text x="210" y="25" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">EMA 20 (Cyan)</text>
                        <text x="210" y="60" fill="#F59E0B" fontSize="11" fontFamily="monospace" fontWeight="bold">EMA 50 (Orange)</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'sessions_eat' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <rect x="10" y="45" width="80" height="35" rx="6" fill="#1E293B" />
                        <text x="18" y="67" fill="#94A3B8" fontSize="10" fontFamily="monospace">Asia 3 AM</text>
                        <rect x="100" y="35" width="105" height="55" rx="6" fill="#00C261" fillOpacity="0.2" stroke="#00C261" strokeWidth="1.5" />
                        <text x="108" y="67" fill="#00C261" fontSize="11" fontFamily="monospace" fontWeight="bold">London 11 AM EAT</text>
                        <rect x="215" y="45" width="75" height="35" rx="6" fill="#1E293B" />
                        <text x="220" y="67" fill="#94A3B8" fontSize="10" fontFamily="monospace">NY 3:30 PM</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'spread_trap' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <line x1="40" y1="40" x2="120" y2="40" stroke="#00C261" strokeWidth="3" />
                        <line x1="40" y1="52" x2="120" y2="52" stroke="#00C261" strokeWidth="3" />
                        <text x="35" y="75" fill="#00C261" fontSize="10" fontFamily="monospace">Normal 1.2p Spread</text>
                        <line x1="180" y1="20" x2="260" y2="20" stroke="#EF4444" strokeWidth="3" />
                        <line x1="180" y1="80" x2="260" y2="80" stroke="#EF4444" strokeWidth="3" />
                        <text x="175" y="102" fill="#EF4444" fontSize="10" fontFamily="monospace">Midnight 9.5p Trap</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'rsi_divergence' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <polyline points="20,80 80,45 140,60 210,30 280,35" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
                        <text x="200" y="20" fill="#EF4444" fontSize="10" fontFamily="monospace">Higher High Price</text>
                        <polyline points="20,80 80,45 140,65 210,55 280,68" fill="none" stroke="#C084FC" strokeWidth="2.5" strokeDasharray="4 2" />
                        <text x="200" y="85" fill="#C084FC" fontSize="10" fontFamily="monospace">Lower High RSI (Divergence)</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'liquidity_pool' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <line x1="20" y1="50" x2="280" y2="50" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 4" />
                        <text x="25" y="42" fill="#D4AF37" fontSize="10" fontFamily="monospace" fontWeight="bold">Buy-Side Liquidity (BSL) Pool: 1.35450</text>
                        <line x1="80" y1="50" x2="80" y2="90" stroke="#00C261" strokeWidth="3" />
                        <line x1="160" y1="50" x2="160" y2="90" stroke="#00C261" strokeWidth="3" />
                        <line x1="230" y1="15" x2="230" y2="105" stroke="#EF4444" strokeWidth="2.5" />
                        <rect x="222" y="65" width="16" height="30" fill="#EF4444" rx="2" />
                        <text x="140" y="20" fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">Wick Sweeps BSL</text>
                        <text x="115" y="112" fill="#00C261" fontSize="9" fontFamily="monospace">Institutional Short Entry 1.35100</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'fvg_imbalance' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <line x1="50" y1="40" x2="50" y2="100" stroke="#00C261" strokeWidth="2" />
                        <rect x="44" y="55" width="12" height="35" fill="#00C261" />
                        <text x="30" y="32" fill="#94A3B8" fontSize="8" fontFamily="monospace">C1 High: 1.1255</text>
                        <rect x="110" y="15" width="20" height="90" fill="#00C261" fillOpacity="0.8" />
                        <line x1="120" y1="5" x2="120" y2="115" stroke="#00C261" strokeWidth="2" />
                        <line x1="190" y1="10" x2="190" y2="70" stroke="#00C261" strokeWidth="2" />
                        <rect x="184" y="20" width="12" height="35" fill="#00C261" />
                        <text x="170" y="85" fill="#94A3B8" fontSize="8" fontFamily="monospace">C3 Low: 1.1285</text>
                        <rect x="65" y="40" width="115" height="30" fill="#D4AF37" fillOpacity="0.15" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="65" y1="55" x2="180" y2="55" stroke="#38BDF8" strokeWidth="2" />
                        <text x="75" y="52" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">50% C.E. (1.1270 Limit Buy)</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'order_block' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <line x1="70" y1="10" x2="70" y2="90" stroke="#00C261" strokeWidth="2" />
                        <rect x="60" y="25" width="20" height="50" fill="#00C261" rx="2" />
                        <text x="25" y="20" fill="#00C261" fontSize="9" fontFamily="monospace">Last Up-Close Candle (OB)</text>
                        <line x1="60" y1="50" x2="220" y2="50" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 2" />
                        <text x="90" y="45" fill="#D4AF37" fontSize="9" fontFamily="monospace" fontWeight="bold">50% Mean Threshold (1.2925)</text>
                        <rect x="120" y="55" width="22" height="60" fill="#EF4444" rx="2" />
                        <line x1="131" y1="40" x2="131" y2="118" stroke="#EF4444" strokeWidth="2" />
                        <text x="150" y="90" fill="#EF4444" fontSize="9" fontFamily="monospace">Displacement Red Candle</text>
                      </svg>
                    )}
                    {activeClass.chartIllustrationType === 'judas_swing' && (
                      <svg className="w-full h-full max-w-lg" viewBox="0 0 300 120">
                        <rect x="20" y="45" width="85" height="40" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
                        <text x="25" y="68" fill="#94A3B8" fontSize="9" fontFamily="monospace">Asian 03:00 - 10:00</text>
                        <path d="M 105 50 Q 150 10 180 30" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                        <text x="120" y="18" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">10:15 Judas Fake Pump</text>
                        <path d="M 180 30 Q 210 100 280 110" stroke="#00C261" strokeWidth="3" fill="none" />
                        <text x="200" y="80" fill="#00C261" fontSize="9" fontFamily="monospace" fontWeight="bold">True Trend Collapse</text>
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: HANDS-ON PRACTICE & HOMEWORK */}
              {classroomTab === 'practice' && (
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#00C261] font-bold uppercase">
                      Action Lab Exercise
                    </span>
                    <h3 className="text-lg font-bold text-white">Interactive Assignment</h3>
                  </div>

                  {activeClass.tvNavButtonLesson && (
                    <div className="p-5 rounded-2xl bg-[#090D18] border border-[#D4AF37]/50 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-mono font-bold text-[#D4AF37] flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-[#D4AF37]" />
                          <span>TradingView Button & Shortcut Lesson:</span>
                        </span>
                        {activeClass.tvNavButtonLesson.shortcut && (
                          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-[11px] font-bold">
                            {activeClass.tvNavButtonLesson.shortcut}
                          </kbd>
                        )}
                      </div>
                      <div className="text-xs text-slate-200 space-y-1">
                        <strong className="text-white block font-mono">{activeClass.tvNavButtonLesson.buttonName}</strong>
                        <p className="text-slate-300">{activeClass.tvNavButtonLesson.action}</p>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                          <strong>How-to Sample: </strong>{activeClass.tvNavButtonLesson.howToSample}
                        </div>
                      </div>
                      <button
                        onClick={() => setClassroomTab('tradingview')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-[#00C261]" />
                        <span>Practice in Live TradingView Tab</span>
                      </button>
                    </div>
                  )}

                  {activeClass.practiceExercise && (
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <strong className="text-sm font-bold text-white block">
                        Task: {activeClass.practiceExercise.prompt}
                      </strong>
                      <p className="text-xs text-slate-300">
                        💡 <strong>Hint:</strong> {activeClass.practiceExercise.actionHint}
                      </p>

                      {activeClass.practiceExercise.toolTarget && (
                        <button
                          onClick={() => onNavigate(activeClass.practiceExercise!.toolTarget!)}
                          className="px-4 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                        >
                          <span>Open Required Pillar Tool</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-[#0B0F17] border border-slate-800 text-xs space-y-1">
                    <strong className="text-amber-400 font-mono block">Homework Assignment:</strong>
                    <p className="text-slate-300">{activeClass.homework}</p>
                  </div>
                </div>
              )}

              {/* TAB 5: GRADED EXAM / QUIZ */}
              {classroomTab === 'quiz' && (
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                      Graded Knowledge Check
                    </span>
                    <h3 className="text-lg font-bold text-white">Class {activeClass.number} Examination</h3>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0B0F17] border border-slate-800 space-y-4">
                    <p className="text-base font-bold text-white">{activeClass.quiz.question}</p>

                    <div className="space-y-2 pt-1">
                      {activeClass.quiz.options.map((opt, oIdx) => {
                        const isChosen = quizAnswers[activeClass.id] === oIdx;
                        const isSubmitted = quizSubmitted[activeClass.id];
                        const isCorrect = activeClass.quiz.correctIndex === oIdx;

                        return (
                          <button
                            key={oIdx}
                            disabled={isSubmitted}
                            onClick={() => handleQuizAnswer(activeClass.id, oIdx)}
                            className={`w-full p-3.5 rounded-xl text-xs text-left font-medium transition border flex items-center justify-between ${
                              isSubmitted
                                ? isCorrect
                                  ? 'bg-[#00C261]/20 border-[#00C261] text-[#00C261] font-bold'
                                  : isChosen
                                  ? 'bg-red-500/20 border-red-500 text-red-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                                : isChosen
                                ? 'bg-[#141E33] border-[#00C261] text-white ring-1 ring-[#00C261]'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#00C261]" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted[activeClass.id] && (
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        💡 <strong>Explanation:</strong> {activeClass.quiz.explanation}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleSubmitQuiz(activeClass)}
                        disabled={quizSubmitted[activeClass.id]}
                        className="px-6 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider transition"
                      >
                        {quizSubmitted[activeClass.id] ? 'Exam Completed' : 'Submit Graded Exam'}
                      </button>

                      <button
                        onClick={() => handleMarkComplete(activeClass.id)}
                        className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                          completedLessonIds.includes(activeClass.id)
                            ? 'text-[#00C261]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {completedLessonIds.includes(activeClass.id) ? 'Class Completed ✓' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: REAL LIVE TRADINGVIEW EMBED */}
              {classroomTab === 'tradingview' && (
                <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-[#D4AF37]/40 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase block">
                        Interactive Real-Time Workstation
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 flex-wrap">
                        <span>Live TradingView Feed: {activeClass.tvSymbol || 'GBPUSD'}</span>
                        <span className="text-xs font-mono text-cyan-300">
                          · {activeClass.tvTimeframe || '15'}m Timeframe
                        </span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowTvNavModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Buttons Guide</span>
                      </button>
                      <button
                        onClick={() => onNavigate('/ai-scanner')}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition"
                      >
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Deep AI EA Scanner</span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#080C14] min-h-[520px]">
                    <TradingViewEmbedWidget
                      pair={(activeClass.tvSymbol === 'EURUSD' ? 'EUR/USD' : activeClass.tvSymbol === 'USDJPY' ? 'USD/JPY' : activeClass.tvSymbol?.includes('XAU') ? 'XAU/USD' : 'GBP/USD') as CurrencyPair}
                      timeframe={(activeClass.tvTimeframe === '60' ? 'H1' : activeClass.tvTimeframe === 'D' ? 'D1' : 'M15') as Timeframe}
                      isCollapsible={false}
                    />
                  </div>
                </div>
              )}

              {/* Classroom Navigation Bottom Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                {prevClass ? (
                  <button
                    onClick={() => {
                      setActiveClassroomId(prevClass.id);
                      setClassroomTab('lecture');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous: Class {prevClass.number}</span>
                  </button>
                ) : <div />}

                {nextClassInSequence ? (
                  <button
                    onClick={() => {
                      handleMarkComplete(activeClass.id);
                      setActiveClassroomId(nextClassInSequence.id);
                      setClassroomTab('lecture');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-[#00C261]/20"
                  >
                    <span>Complete & Next: Class {nextClassInSequence.number}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Claim Graduation Certificate</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW B: ACADEMY CATALOG & BELTS ROADMAP (MAIN HUB VIEW)
           ========================================================================= */
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Pillar Navigation Header Bar */}
          <PillarHeaderBar currentTab="masterclass" onNavigate={onNavigate} />

          {/* Top Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Pillar 5 • Interactive FX Academy</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
                The 5-Belt Forex Masterclass & Classroom Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Structured classes from <strong>Beginner (White Belt)</strong> with concrete samples and MT4 breakdowns to <strong>Pro Institutional (Black Belt)</strong> and the <strong>Master Strategy Vault</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveClassroomId(nextLesson.id);
                  setClassroomTab('lecture');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#141E33] hover:bg-[#1c2a47] text-[#00C261] border border-[#00C261]/40 text-xs font-bold font-mono transition flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-[#00C261]" />
                <span>Enter Class {nextLesson.number} Directly</span>
              </button>

              <button
                onClick={() => setShowCertificate(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Graduation Certificate</span>
              </button>
            </div>
          </div>

          {/* Progress & Belt Selector */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400">Academy Progress</span>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{completedCount} of {totalLessons} Classes Completed</span>
                  <span className="text-[#00C261] font-mono text-sm">({progressPercent}%)</span>
                </div>
              </div>

              <div className="w-full sm:w-72 h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00C261] to-cyan-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Search Bar & Belt Tabs */}
            <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search classes, concepts, rules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F17] border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-[#00C261]"
                />
              </div>

              {/* Belt Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setSelectedBelt('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedBelt === 'all'
                      ? 'bg-white text-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All Classes
                </button>
                {beltBadges.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBelt(b.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                      selectedBelt === b.id
                        ? `${b.color} font-extrabold shadow-md`
                        : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Master Strategy Vault Section */}
          {(selectedBelt === 'all' || selectedBelt === 'master') && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-amber-500/30 pb-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                    Pro Vault • High-Expectancy Mechanical Edges
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    The Master Strategy Vault (5 Battle-Tested Systems)
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MASTER_STRATEGIES.map((strat) => (
                  <div
                    key={strat.id}
                    className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-amber-500/40 transition space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          {strat.winRate}% Verified Win Rate
                        </span>
                        <span className="text-xs font-mono text-slate-400">{strat.timeframe}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">{strat.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{strat.tagline}</p>

                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                        <strong className="text-[#00C261] block font-mono">Core Entry Rules:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                          {strat.rules.entry.slice(0, 2).map((r, i) => (
                            <li key={i} className="truncate">{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => onNavigate('tradingview')}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-[#00C261]" />
                        Try on Chart
                      </button>
                      <button
                        onClick={() => onNavigate('super-analysis')}
                        className="flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        Backtest Sim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Class List with Clickable "Enter Classroom" Buttons */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Interactive Classes Catalog (Click to Enter Full Classroom)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className="p-5 sm:p-6 rounded-3xl bg-[#0E1422] border border-slate-800 hover:border-[#00C261]/50 transition-all duration-200 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-slate-800 text-[#00C261] border border-slate-700">
                            Class {lesson.number}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase">
                            {lesson.levelTag}
                          </span>
                        </div>

                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#00C261]">
                            <CheckCircle2 className="w-4 h-4" /> Completed
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#00C261]" /> {lesson.duration}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-[#00C261] transition">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {lesson.summary}
                      </p>

                      {/* Samples Preview Tag */}
                      {lesson.samplesAndCases && (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{lesson.samplesAndCases[0]?.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Clickable Classroom Entry Button */}
                    <button
                      onClick={() => {
                        setActiveClassroomId(lesson.id);
                        setClassroomTab('lecture');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-3 rounded-2xl bg-[#141E33] hover:bg-[#00C261] text-[#00C261] hover:text-black font-extrabold text-xs uppercase tracking-wider transition border border-[#00C261]/30 hover:border-transparent flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-[#00C261]/10"
                    >
                      <span>Enter Class & Workshop</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Graduation Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0e1524] border-2 border-amber-500/40 p-8 shadow-2xl text-slate-100 space-y-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                PivotFX Lab • Gilgil, Kenya
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                Certificate of Technical Competency
              </h2>
              <p className="text-xs text-slate-400">
                Verifying mastery of the 20/50 EMA System, Tower Reversal, and the $2 Risk Protocol
              </p>
            </div>

            {/* Certificate Body Container */}
            <div className="p-8 rounded-2xl bg-[#070A10] border border-amber-500/30 text-center space-y-6 relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs text-slate-400">This certifies that</span>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="text-2xl font-black text-[#00C261] font-mono bg-transparent border-b border-dashed border-[#00C261]/50 text-center outline-none w-full max-w-sm mx-auto"
                />
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully completed all five masterclass belts, proved disciplined risk management under the Gilgil $2 rule, and demonstrated chart proficiency on MT4/MT5.
              </p>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-4">
                <div className="text-left">
                  <span className="block text-[10px] text-slate-500">ISSUED IN</span>
                  <span className="text-white">Gilgil, Nakuru County, KE</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-amber-500/50 flex items-center justify-center bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                  SEAL
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500">DATE</span>
                  <span className="text-white">{new Date().toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-amber-400 transition"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TRADINGVIEW NAVIGATION & BUTTON DIRECTORY MODAL
         ========================================================================= */}
      {showTvNavModal && (
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
                    Learn what every button does, exact keyboard shortcuts, and real newbie sample charts.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTvNavModal(false)}
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
                Hotkeys: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">Alt + T</kbd> Trendline • <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">Alt + F</kbd> OTE Fib • <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">Alt + J</kbd> Liquidity Ray
              </span>
              <button
                onClick={() => setShowTvNavModal(false)}
                className="px-5 py-2 rounded-xl btn-gold text-black font-extrabold text-xs uppercase tracking-wider"
              >
                Back to Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
