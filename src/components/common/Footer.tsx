import React from 'react';
import { Logo } from './Logo';
import { PageTab } from '../../types';
import {
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Mail,
  Download,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
  onOpenLogoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenLogoModal,
}) => {
  return (
    <footer className="w-full bg-[#060910] border-t border-slate-800/90 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              PivotFx Prop Firm & Forex Academy. Engineered to transition traders from small retail capital to verified funded prop firm accounts using mathematical risk management and institutional order flow.
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

          {/* Col 2: The 8 Masterclass Pillars (1 to 4) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Masterclasses 01 - 04
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('/fx-academy')}
                  className="hover:text-white transition hover:translate-x-1 duration-150 block text-left"
                >
                  Pillar 01: FX Academy Masterclass
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/chart-mastery')}
                  className="hover:text-white transition hover:translate-x-1 duration-150 block text-left"
                >
                  Pillar 02: Chart Mastery Lab (TradingView/MT4)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/strategy-vault')}
                  className="hover:text-white transition hover:translate-x-1 duration-150 block text-left"
                >
                  Pillar 03: Strategy Vault (5 Setups)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/ai-scanner')}
                  className="hover:text-white transition hover:translate-x-1 duration-150 block text-left"
                >
                  Pillar 04: AI Market Scanner & Camera OCR
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: The 8 Masterclass Pillars (5 to 8) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Masterclasses 05 - 08
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('/risk-management')}
                  className="hover:text-white transition hover:translate-x-1 duration-150 block text-left"
                >
                  Pillar 05: Risk & Capital Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/psychology')}
                  className="hover:text-white transition hover:translate-x-1 duration-150 block text-left"
                >
                  Pillar 06: Trading Psychology & Kill Switch
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/live-pulse')}
                  className="hover:text-white transition hover:translate-x-1 duration-150 block text-left"
                >
                  Pillar 07: Live Market Pulse & DXY Bias
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('/growth-lab')}
                  className="hover:text-white transition hover:translate-x-1 duration-150 block text-left"
                >
                  Pillar 08: Growth Lab & Prop Firm Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Prop Firm Disclaimer & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Risk & Educational Standards
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Trading foreign exchange, CFDs, and financial derivatives carries significant risk of capital loss and is not suitable for all individuals. Over 70% of retail investor accounts lose money. Past performance does not guarantee future results.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="text-[#D4AF37] font-bold block">Gilgil $2 Protocol:</span>
              <span>Never risk more than $2.00 (260 KES) on beginner demo or small accounts.</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} PivotFx — Prop Firm & Forex Academy. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#D4AF37]">Zero to Funded Trader</span>
            <span>•</span>
            <span>Client-Side Static Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
