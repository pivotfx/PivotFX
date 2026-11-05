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
    <footer className="w-full bg-[#060910] border-t border-slate-800 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" showBadge={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              PivotFx Prop Firm & Forex Academy. Engineered to transition traders from disciplined micro-lot execution to funded prop firm accounts using real-time interbank telemetry and institutional order flow.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenLogoModal}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#D4AF37]/50 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Download Brand Kit</span>
              </button>
            </div>
          </div>

          {/* Col 2: Masterclasses 01 - 05 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Masterclasses 01 – 05
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('/fx-academy')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 01: FX Academy Masterclass
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/chart-mastery')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 02: Chart Mastery Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/strategy-vault')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 03: Strategy Vault (5 Setups)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/ai-scanner')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 04: Super AI Market Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/risk-management')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 05: Risk &amp; Capital Shield
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Masterclasses 06 - 09 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Masterclasses 06 – 09
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('/psychology')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 06: Trading Psychology &amp; Kill Switch
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/live-pulse')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 07: Live Market Pulse &amp; Bias
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/growth-lab')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 08: Growth Lab &amp; Trade Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/macro-safety')}
                  className="hover:text-white transition text-left"
                >
                  Pillar 09: Global Safety &amp; Kenya EAT Timer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Prop Firm Risk & Educational Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Risk &amp; Educational Standards
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Trading foreign exchange and derivatives carries substantial risk of capital loss. Educational analysis and telemetry are provided for structured practice and risk modeling.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="text-[#D4AF37] font-bold block">Gilgil $2 Protocol:</span>
              <span>Enforce 0.01 micro lot ($2.00 / 260 KES max risk cap) on every setup.</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} PivotFx — Prop Firm &amp; Forex Academy. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#D4AF37]">Zero to Funded Trader</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Quantitative Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
