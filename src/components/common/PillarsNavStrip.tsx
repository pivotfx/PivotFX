import React from 'react';
import { PageTab } from '../../types';
import {
  Compass,
  SlidersHorizontal,
  CandlestickChart,
  Scan,
  GraduationCap,
  Scale,
  BookOpenCheck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Home
} from 'lucide-react';

export interface PillarMeta {
  id: PageTab;
  number: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  badge: string;
  category: 'Foundation' | 'Analysis' | 'Execution' | 'Safety';
  highlight: string;
  subPillars: string[];
}

export const PILLARS_LIST: PillarMeta[] = [
  {
    id: 'start-here',
    number: '01',
    title: 'Start Here',
    shortDesc: '10-Min 3-Step Guided Journey',
    icon: <Compass className="w-4 h-4" />,
    badge: 'Onboarding',
    category: 'Foundation',
    highlight: 'From Zero to Demo',
    subPillars: ['What is Forex (2-Min)', 'Free FXPesa Demo Setup', 'First Chart Pattern Scan'],
  },
  {
    id: 'super-analysis',
    number: '02',
    title: 'Super Analysis',
    shortDesc: 'MT4/MT5 Confluence & Verdict',
    icon: <SlidersHorizontal className="w-4 h-4" />,
    badge: 'Core Engine',
    category: 'Analysis',
    highlight: '0–100 Setup Score',
    subPillars: ['MT4/5 Indicator Inputs', '0-100 Algorithmic Score', '1-Hr Anti-Revenge Kill Switch'],
  },
  {
    id: 'tradingview',
    number: '03',
    title: 'TradingView',
    shortDesc: 'Custom Strategy & Tower Replay',
    icon: <CandlestickChart className="w-4 h-4" />,
    badge: 'Live Charts',
    category: 'Analysis',
    highlight: 'Red/Green Markers',
    subPillars: ['Tower Top Reversal Marker', '5-Step Candlestick Replay', 'Support & Resistance Studio'],
  },
  {
    id: 'ai-scanner',
    number: '04',
    title: 'Dual AI Scanner',
    shortDesc: 'Internal Chart & Camera Lens',
    icon: <Scan className="w-4 h-4" />,
    badge: 'Vision AI',
    category: 'Analysis',
    highlight: 'MT4 Screen OCR',
    subPillars: ['Option A: Internal Chart Scan', 'Option B: Laptop Screen OCR Lens', 'Confidence & Historical Match'],
  },
  {
    id: 'masterclass',
    number: '05',
    title: '5-Belt Class',
    shortDesc: 'White to Master Strategy Vault',
    icon: <GraduationCap className="w-4 h-4" />,
    badge: 'Curriculum',
    category: 'Foundation',
    highlight: 'Kenya Cert + Vault',
    subPillars: ['5-Belt Graded Curriculum', 'Interactive Classrooms & Notes', '5 Ready Strategy Blueprints'],
  },
  {
    id: 'brokers',
    number: '06',
    title: 'Broker Hub',
    shortDesc: 'FXPesa vs HFM vs FBS Spreads',
    icon: <Scale className="w-4 h-4" />,
    badge: 'Live Spreads',
    category: 'Execution',
    highlight: 'CMA vs Offshore',
    subPillars: ['CMA vs Offshore Comparison', 'Live Spread Ticker (EUR/USD)', 'Lipa Na M-Pesa Paybill 832900'],
  },
  {
    id: 'journal',
    number: '07',
    title: 'Journal & Calc',
    shortDesc: '$2 Survival Rule & PnL Curve',
    icon: <BookOpenCheck className="w-4 h-4" />,
    badge: 'Discipline',
    category: 'Safety',
    highlight: 'Pip, Margin & XP',
    subPillars: ['Trade Log & Win/Loss Ratio', 'Gilgil $2 Survival Rule Calc', 'Pip & Margin Calculators'],
  },
  {
    id: 'trust-legal',
    number: '08',
    title: 'Trust & Legal',
    shortDesc: 'Gilgil Story, 1296 Loss & CMA',
    icon: <ShieldCheck className="w-4 h-4" />,
    badge: 'Transparency',
    category: 'Safety',
    highlight: 'Authentic Roots',
    subPillars: ['Gilgil 1296 Loss vs 1291 Win', 'CMA Kenya Segregation Rules', 'Deriv Synthetics Warning'],
  },
];

interface PillarsNavStripProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  exploredPillars: PageTab[];
  onOpenBlueprintModal: () => void;
}

export const PillarsNavStrip: React.FC<PillarsNavStripProps> = ({
  activeTab,
  onSelectTab,
  exploredPillars,
  onOpenBlueprintModal,
}) => {
  const exploredCount = exploredPillars.length;
  const progressPercent = Math.round((exploredCount / 8) * 100);

  return (
    <div className="w-full bg-[#0D121F]/95 backdrop-blur-md border-b border-slate-800/80 py-3 px-4 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Header Ribbon of the Pillars */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onSelectTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition border ${
                activeTab === 'landing'
                  ? 'bg-[#00C261] text-black border-[#00C261] shadow-[0_0_15px_rgba(0,194,97,0.35)]'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home Overview</span>
            </button>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#00C261]/15 text-[#00C261] border border-[#00C261]/30 font-mono text-[11px] font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>THE 8 INTERACTIVE PILLARS</span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Click any pillar below to enter that dedicated workstation
            </span>
          </div>

          {/* Progress & Blueprint Trigger */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Pillars Explored:</span>
              <span className="text-[#00C261] font-bold">
                {exploredCount}/8 ({progressPercent}%)
              </span>
            </div>
            <button
              onClick={onOpenBlueprintModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition"
            >
              <Sparkles className="w-3 h-3 text-[#00C261]" />
              <span>View System Blueprint</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 8 Clickable Pillars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {PILLARS_LIST.map((pillar) => {
            const isActive = activeTab === pillar.id;
            const isExplored = exploredPillars.includes(pillar.id);

            return (
              <button
                key={pillar.id}
                onClick={() => onSelectTab(pillar.id)}
                className={`relative group flex flex-col justify-between p-2.5 rounded-2xl text-left transition-all duration-200 border outline-none ${
                  isActive
                    ? 'bg-[#152136] border-[#00C261] shadow-[0_0_20px_rgba(0,194,97,0.25)] ring-1 ring-[#00C261]'
                    : 'bg-[#101726] border-slate-800/90 hover:border-slate-700 hover:bg-[#131d30]'
                }`}
              >
                {/* Top Row: Number & Status Icon */}
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`font-mono text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#00C261] text-black'
                        : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    P{pillar.number}
                  </span>

                  {isExplored ? (
                    <span className="text-[#00C261]" title="Explored">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </div>

                {/* Center: Title & Icon */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={isActive ? 'text-[#00C261]' : 'text-slate-400 group-hover:text-slate-200'}>
                      {pillar.icon}
                    </span>
                    <h4
                      className={`text-xs font-bold truncate leading-tight ${
                        isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate leading-tight">
                    {pillar.highlight}
                  </p>
                </div>

                {/* Bottom Active Glow Accent */}
                {isActive && (
                  <span className="absolute -bottom-px left-3 right-3 h-0.5 bg-[#00C261] rounded-full shadow-[0_0_8px_#00C261]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
