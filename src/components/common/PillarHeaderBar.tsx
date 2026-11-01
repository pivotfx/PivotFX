import React from 'react';
import { PageTab } from '../../types';
import { PILLARS_LIST } from './PillarsNavStrip';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Layers,
  Sparkles,
  Home
} from 'lucide-react';

interface PillarHeaderBarProps {
  currentTab: PageTab;
  onNavigate: (tab: PageTab) => void;
  title?: string;
  subtitle?: string;
}

export const PillarHeaderBar: React.FC<PillarHeaderBarProps> = ({
  currentTab,
  onNavigate,
  title,
  subtitle,
}) => {
  const currentPillarIndex = PILLARS_LIST.findIndex((p) => p.id === currentTab);
  const currentPillar = currentPillarIndex >= 0 ? PILLARS_LIST[currentPillarIndex] : null;

  const prevPillar = currentPillarIndex > 0 ? PILLARS_LIST[currentPillarIndex - 1] : null;
  const nextPillar =
    currentPillarIndex >= 0 && currentPillarIndex < PILLARS_LIST.length - 1
      ? PILLARS_LIST[currentPillarIndex + 1]
      : null;

  return (
    <div className="w-full mb-6 p-4 rounded-3xl bg-[#0E1524]/90 border border-slate-800 shadow-lg backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Section: Back to Home & Breadcrumb */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('landing')}
            className="group px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#00C261] hover:text-black text-slate-300 font-bold text-xs transition border border-slate-800 flex items-center gap-2 shadow-sm"
            title="Return to the Main Pillars Overview"
          >
            <ArrowLeft className="w-4 h-4 text-[#00C261] group-hover:text-black group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Home / Pillars</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {currentPillar && (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#00C261]/15 text-[#00C261] border border-[#00C261]/30 font-mono text-xs font-black">
                PILLAR {currentPillar.number}
              </span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50 uppercase">
                {currentPillar.category}
              </span>
            </div>
          )}
        </div>

        {/* Center / Title Details (Optional override or fallback) */}
        <div className="hidden lg:block text-center truncate max-w-md">
          <span className="text-xs text-white font-bold block truncate">
            {title || currentPillar?.title}
          </span>
          <span className="text-[11px] text-slate-400 block truncate">
            {subtitle || currentPillar?.shortDesc}
          </span>
        </div>

        {/* Right Section: Previous & Next Pillar Jumpers */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {prevPillar ? (
            <button
              onClick={() => onNavigate(prevPillar.id)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono transition flex items-center gap-1"
              title={`Previous: Pillar ${prevPillar.number} - ${prevPillar.title}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">P{prevPillar.number}</span>
            </button>
          ) : (
            <div className="w-8" />
          )}

          <button
            onClick={() => onNavigate('landing')}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition"
            title="Overview"
          >
            <Home className="w-4 h-4 text-[#00C261]" />
          </button>

          {nextPillar ? (
            <button
              onClick={() => onNavigate(nextPillar.id)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-[#00C261] border border-slate-800 text-xs font-mono transition flex items-center gap-1 group"
              title={`Next: Pillar ${nextPillar.number} - ${nextPillar.title}`}
            >
              <span className="hidden sm:inline">Next: P{nextPillar.number}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>
      </div>
    </div>
  );
};
