import React from 'react';
import { Logo } from './Logo';
import { PageTab } from '../../types';
import { Download } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
  onOpenLogoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenLogoModal,
}) => {
  return (
    <footer className="w-full bg-[#060910] border-t border-slate-800 text-slate-400 mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10 items-start">
          {/* Col 1: Brand & Identity (4 Cols on Desktop, min-w-0 prevents text collision) */}
          <div className="lg:col-span-4 min-w-0 space-y-3.5">
            <Logo size="md" showBadge={false} />
            <p className="text-[11px] font-mono text-[#D4AF37] leading-snug">
              Institutional Desk · Live Telemetry · Human Co-Pilot
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              PivotFx Prop Firm &amp; Forex Academy. Transition from disciplined 0.01 micro-lot execution to funded prop firm accounts using real-time interbank telemetry and structured order flow.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenLogoModal}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#D4AF37]/50 text-xs font-mono text-slate-300 hover:text-white transition inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Download Brand Kit</span>
              </button>
            </div>
          </div>

          {/* Col 2: Masterclasses 01 - 05 (3 Cols on Desktop) */}
          <div className="lg:col-span-3 min-w-0 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Masterclasses 01 – 05
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/fx-academy')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 01: FX Academy Masterclass
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/chart-mastery')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 02: Chart Mastery Lab
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/strategy-vault')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 03: Strategy Vault (5 Setups)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/ai-scanner')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 04: Super AI Market Radar
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/risk-management')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 05: Risk &amp; Capital Shield
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Masterclasses 06 - 09 (3 Cols on Desktop) */}
          <div className="lg:col-span-3 min-w-0 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Masterclasses 06 – 09
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/psychology')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 06: Trading Psychology &amp; Kill Switch
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/live-pulse')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 07: Live Market Pulse &amp; Bias
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/growth-lab')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 08: Growth Lab &amp; Trade Ledger
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('/macro-safety')}
                  className="hover:text-white transition text-left block w-full leading-snug"
                >
                  Pillar 09: Global Safety &amp; Kenya EAT Timer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Prop Firm Risk & Educational Standards (2 Cols on Desktop) */}
          <div className="lg:col-span-2 min-w-0 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Risk Standards
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Foreign exchange and CFDs carry risk of capital loss. Telemetry and AI scans are provided for structured education and risk modeling.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <span className="text-[#D4AF37] font-bold block">Gilgil $2 Protocol</span>
              <span className="block leading-snug">
                0.01 micro lot ($2.00 / 260 KES max risk cap).
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} PivotFx — Prop Firm &amp; Forex Academy. All rights reserved.
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-[#D4AF37]">Zero to Funded Trader</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Quantitative Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
