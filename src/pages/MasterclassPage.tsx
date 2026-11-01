import React, { useState, useEffect } from 'react';
import { MasterclassLesson, MasterclassStrategy, PageTab } from '../types';
import { MASTERCLASS_LESSONS, MASTER_STRATEGIES } from '../data/forexData';
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
  ArrowRight,
  Printer,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MasterclassPageProps {
  onNavigate: (tab: PageTab) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

export const MasterclassPage: React.FC<MasterclassPageProps> = ({ onNavigate, onAwardXp }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBelt, setSelectedBelt] = useState<'all' | 'white' | 'blue' | 'purple' | 'black' | 'master'>('all');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>('w-1');

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

  const toggleLesson = (id: string) => {
    setExpandedLessonId(expandedLessonId === id ? null : id);
  };

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

  // Find next uncompleted lesson for "Continue Where You Left Off"
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
    { id: 'white', label: 'White Belt', subtitle: 'Basics & $2 Rule', color: 'border-slate-300 text-white bg-slate-800' },
    { id: 'blue', label: 'Blue Belt', subtitle: 'EMA & 1291.69 Lore', color: 'border-blue-500 text-blue-400 bg-blue-950/40' },
    { id: 'purple', label: 'Purple Belt', subtitle: 'Multi-Timeframe & Spreads', color: 'border-purple-500 text-purple-400 bg-purple-950/40' },
    { id: 'black', label: 'Black Belt', subtitle: 'Mechanical Edge & Ethics', color: 'border-emerald-500 text-[#00C261] bg-emerald-950/40' },
    { id: 'master', label: 'Master Vault', subtitle: '5 Battle Strategies', color: 'border-amber-500 text-amber-400 bg-amber-950/40' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Pillar 5 • Comprehensive Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            The 5-Belt Forex Masterclass
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            From complete beginner with a smartphone to an emotionless mechanical chart analyst. Built on real Gilgil trading lessons.
          </p>
        </div>

        {/* Continue & Certificate Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setExpandedLessonId(nextLesson.id);
              const el = document.getElementById(`lesson-${nextLesson.id}`);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 rounded-xl bg-[#141E33] hover:bg-[#1c2a47] text-[#00C261] border border-[#00C261]/40 text-xs font-bold font-mono transition flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-[#00C261]" />
            <span>Continue: {nextLesson.title.split('&')[0].trim()}</span>
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
            <span className="text-xs font-mono text-slate-400">Masterclass Progress</span>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>{completedCount} of {totalLessons} Lessons Completed</span>
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
              placeholder="Search lessons, terms, rules..."
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
              All Belts
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

      {/* Belt 5: Master Strategy Vault (When 'master' or 'all' selected) */}
      {(selectedBelt === 'all' || selectedBelt === 'master') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/30 pb-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                Belt 5 • High-Expectancy Playbooks
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
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#00C261]" />
                    Try on Chart
                  </button>
                  <button
                    onClick={() => onNavigate('super-analysis')}
                    className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    Backtest Sim
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum Lessons Accordions (Belts 1 - 4) */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => {
          const isExpanded = expandedLessonId === lesson.id;
          const isCompleted = completedLessonIds.includes(lesson.id);
          const submitted = quizSubmitted[lesson.id];
          const selectedOpt = quizAnswers[lesson.id];

          return (
            <div
              key={lesson.id}
              id={`lesson-${lesson.id}`}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-[#111827] border-[#00C261]/50 shadow-[0_0_30px_rgba(0,194,97,0.08)]'
                  : 'bg-[#0E1422] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleLesson(lesson.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 outline-none"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                      isCompleted
                        ? 'bg-[#00C261]/20 border-[#00C261] text-[#00C261]'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5 text-[#00C261]" /> : lesson.number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {lesson.belt.toUpperCase()} BELT
                      </span>
                      <span className="text-[11px] font-mono text-[#00C261] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{lesson.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{lesson.summary}</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-800 text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Body Content */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-slate-800 bg-[#0B0F17] space-y-6">
                  {/* Real-time market context note */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-mono">Real-Time East Africa Context:</strong>
                      <span>{lesson.realTimeNote}</span>
                    </div>
                  </div>

                  {/* Lesson Paragraphs */}
                  <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {lesson.content.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Interactive Diagram / SVG Illustration */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Visual Schematic • {lesson.chartIllustrationType.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="h-36 w-full rounded-xl bg-[#070A10] flex items-center justify-center p-3 relative overflow-hidden">
                      {lesson.chartIllustrationType === 'candlestick_anatomy' && (
                        <svg className="w-full h-full" viewBox="0 0 300 100">
                          <line x1="80" y1="10" x2="80" y2="90" stroke="#00C261" strokeWidth="2" />
                          <rect x="68" y="25" width="24" height="45" fill="#00C261" rx="2" />
                          <text x="100" y="30" fill="#00C261" fontSize="10" fontFamily="monospace">Close</text>
                          <text x="100" y="70" fill="#00C261" fontSize="10" fontFamily="monospace">Open</text>
                          <line x1="220" y1="10" x2="220" y2="90" stroke="#EF4444" strokeWidth="2" />
                          <rect x="208" y="25" width="24" height="45" fill="#EF4444" rx="2" />
                          <text x="240" y="30" fill="#EF4444" fontSize="10" fontFamily="monospace">Open</text>
                          <text x="240" y="70" fill="#EF4444" fontSize="10" fontFamily="monospace">Close</text>
                        </svg>
                      )}
                      {lesson.chartIllustrationType === 'pinbar_tower' && (
                        <svg className="w-full h-full" viewBox="0 0 300 100">
                          <line x1="150" y1="5" x2="150" y2="85" stroke="#EF4444" strokeWidth="2" />
                          <rect x="142" y="65" width="16" height="15" fill="#EF4444" rx="2" />
                          <text x="70" y="20" fill="#EF4444" fontSize="10" fontFamily="monospace">Long Upper Rejection Wick (Sellers Slam Price)</text>
                          <text x="170" y="75" fill="#FFFFFF" fontSize="10" fontFamily="monospace">Small Body</text>
                        </svg>
                      )}
                      {lesson.chartIllustrationType === 'two_dollar_rule' && (
                        <svg className="w-full h-full" viewBox="0 0 300 100">
                          <rect x="20" y="20" width="260" height="60" rx="8" fill="#111827" stroke="#00C261" strokeWidth="1.5" />
                          <text x="35" y="45" fill="#00C261" fontSize="12" fontFamily="monospace" fontWeight="bold">$50 Account ÷ $2 Risk = 25 Lives Buffer</text>
                          <text x="35" y="65" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Risk is capped at 260 KES per trade. Zero panic.</text>
                        </svg>
                      )}
                      {lesson.chartIllustrationType === 'ema_crossover' && (
                        <svg className="w-full h-full" viewBox="0 0 300 100">
                          <path d="M 20 70 Q 150 40 280 20" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
                          <path d="M 20 85 Q 150 65 280 45" stroke="#F59E0B" strokeWidth="2" fill="none" />
                          <text x="210" y="25" fill="#38BDF8" fontSize="10" fontFamily="monospace">EMA 20</text>
                          <text x="210" y="55" fill="#F59E0B" fontSize="10" fontFamily="monospace">EMA 50</text>
                        </svg>
                      )}
                      {lesson.chartIllustrationType === 'sessions_eat' && (
                        <svg className="w-full h-full" viewBox="0 0 300 100">
                          <rect x="20" y="35" width="70" height="30" rx="4" fill="#1E293B" />
                          <text x="25" y="54" fill="#94A3B8" fontSize="9" fontFamily="monospace">Asia 3-10 AM</text>
                          <rect x="100" y="30" width="100" height="40" rx="4" fill="#00C261" fillOpacity="0.2" stroke="#00C261" />
                          <text x="105" y="54" fill="#00C261" fontSize="10" fontFamily="monospace" fontWeight="bold">London 11 AM</text>
                          <rect x="210" y="35" width="70" height="30" rx="4" fill="#1E293B" />
                          <text x="215" y="54" fill="#94A3B8" fontSize="9" fontFamily="monospace">NY 3:30 PM</text>
                        </svg>
                      )}
                      {lesson.chartIllustrationType === 'spread_trap' && (
                        <svg className="w-full h-full" viewBox="0 0 300 100">
                          <line x1="50" y1="30" x2="120" y2="30" stroke="#00C261" strokeWidth="3" />
                          <line x1="50" y1="42" x2="120" y2="42" stroke="#00C261" strokeWidth="3" />
                          <text x="45" y="65" fill="#00C261" fontSize="9" fontFamily="monospace">Normal 1.2p Spread</text>
                          <line x1="180" y1="15" x2="260" y2="15" stroke="#EF4444" strokeWidth="3" />
                          <line x1="180" y1="60" x2="260" y2="60" stroke="#EF4444" strokeWidth="3" />
                          <text x="175" y="80" fill="#EF4444" fontSize="9" fontFamily="monospace">Midnight 8.5p Trap</text>
                        </svg>
                      )}
                      {lesson.chartIllustrationType === 'rsi_divergence' && (
                        <svg className="w-full h-full" viewBox="0 0 300 100">
                          <polyline points="30,70 90,40 150,55 210,25 270,30" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                          <text x="200" y="18" fill="#EF4444" fontSize="9" fontFamily="monospace">Higher High Price</text>
                          <polyline points="30,70 90,40 150,60 210,50 270,60" fill="none" stroke="#C084FC" strokeWidth="2" strokeDasharray="4 2" />
                          <text x="200" y="75" fill="#C084FC" fontSize="9" fontFamily="monospace">Lower High RSI</text>
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Live Market Example & Homework */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <strong className="text-white block font-mono mb-1">Live Market Example:</strong>
                      <p className="text-slate-300">{lesson.liveMarketExample}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <strong className="text-[#00C261] block font-mono mb-1">Assigned Homework:</strong>
                      <p className="text-slate-300">{lesson.homework}</p>
                    </div>
                  </div>

                  {/* Interactive Quiz Component */}
                  <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                      <HelpCircle className="w-4 h-4" />
                      <span>Knowledge Check Quiz</span>
                    </div>
                    <p className="text-sm font-bold text-white">{lesson.quiz.question}</p>

                    <div className="space-y-2 pt-1">
                      {lesson.quiz.options.map((opt, oIdx) => {
                        const isChosen = selectedOpt === oIdx;
                        const isCorrect = lesson.quiz.correctIndex === oIdx;
                        return (
                          <button
                            key={oIdx}
                            disabled={submitted}
                            onClick={() => handleQuizAnswer(lesson.id, oIdx)}
                            className={`w-full p-3 rounded-xl text-xs text-left font-medium transition border flex items-center justify-between ${
                              submitted
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
                            {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#00C261]" />}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        💡 <strong>Explanation:</strong> {lesson.quiz.explanation}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleSubmitQuiz(lesson)}
                        disabled={submitted}
                        className="px-5 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider transition"
                      >
                        {submitted ? 'Quiz Passed' : 'Submit Answer'}
                      </button>

                      <button
                        onClick={() => handleMarkComplete(lesson.id)}
                        className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                          isCompleted ? 'text-[#00C261]' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isCompleted ? 'Completed' : 'Mark as Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
    </div>
  );
};
