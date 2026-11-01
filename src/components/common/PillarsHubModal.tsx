import React from 'react';
import { PageTab } from '../../types';
import { PILLARS_LIST } from './PillarsNavStrip';
import {
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  ExternalLink
} from 'lucide-react';

interface PillarsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPillar: (tab: PageTab) => void;
  exploredPillars: PageTab[];
}

export const PillarsHubModal: React.FC<PillarsHubModalProps> = ({
  isOpen,
  onClose,
  onSelectPillar,
  exploredPillars,
}) => {
  if (!isOpen) return null;

  const phases = [
    {
      phaseName: 'PHASE 1: FOUNDATION & COMPETENCY',
      phaseDesc: 'Build rock-solid mental models and setup your free FXPesa demo before risking capital.',
      color: 'border-emerald-500/30 bg-emerald-950/20 text-[#00C261]',
      pillars: ['start-here', 'masterclass'] as PageTab[],
    },
    {
      phaseName: 'PHASE 2: TRIPLE CONFLUENCE ANALYSIS',
      phaseDesc: 'Never enter blindly. Screen setups via MT4 numbers, TradingView charts, and AI camera vision.',
      color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400',
      pillars: ['super-analysis', 'tradingview', 'ai-scanner'] as PageTab[],
    },
    {
      phaseName: 'PHASE 3: EXECUTION, RISK & COMPLIANCE',
      phaseDesc: 'Execute with CMA safety, enforce the $2 survival rule, log every trade, and maintain ethics.',
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
      pillars: ['brokers', 'journal', 'trust-legal'] as PageTab[],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F1626] border border-slate-700 p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Architecture Blueprint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            The 8 Pillars of PivotFX Lab
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Every pillar works in unison to protect Kenyan traders from the infamous 1296.56 blowout and enforce the 1291.69 disciplined reversal edge. Click any pillar to jump directly into action.
          </p>
        </div>

        {/* 3 Interconnected Phases */}
        <div className="space-y-6">
          {phases.map((phase, pIdx) => (
            <div key={pIdx} className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className={`text-xs font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${phase.color}`}>
                  {phase.phaseName}
                </span>
                <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                  {phase.phaseDesc}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {phase.pillars.map((pillarId) => {
                  const pillar = PILLARS_LIST.find((p) => p.id === pillarId)!;
                  const isExplored = exploredPillars.includes(pillarId);

                  return (
                    <div
                      key={pillar.id}
                      onClick={() => {
                        onSelectPillar(pillar.id);
                        onClose();
                      }}
                      className="group cursor-pointer p-4 rounded-2xl bg-[#090E1A] border border-slate-800 hover:border-[#00C261] hover:bg-[#121B2E] transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-800 text-[#00C261] border border-slate-700">
                            Pillar {pillar.number}
                          </span>
                          {isExplored ? (
                            <span className="flex items-center gap-1 text-[11px] font-mono text-[#00C261]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Explored
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400">Not Explored</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-slate-900 text-[#00C261] border border-slate-800 group-hover:scale-110 transition-transform">
                            {pillar.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-[#00C261] transition">
                              {pillar.title}
                            </h4>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {pillar.badge}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {pillar.shortDesc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-[#00C261] transition">
                        <span>Launch Pillar</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 rounded-2xl bg-[#0B0F17] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            💡 Complete all 8 pillars to unlock the special <strong className="text-amber-400">Gilgil Grandmaster Badge</strong>.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition shrink-0"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
