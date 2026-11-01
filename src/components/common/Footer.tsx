import React from 'react';
import { Logo } from './Logo';
import { PageTab } from '../../types';
import {
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
  Github,
  MapPin,
  Mail,
  HelpCircle,
  Download,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
  onOpenLogoModal: () => void;
  onOpenRiskModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenLogoModal,
  onOpenRiskModal,
}) => {
  return (
    <footer className="w-full bg-[#070A10] border-t border-slate-800/90 text-slate-400 mt-20">
      {/* 1. Distinct Banner Separating Deriv vs Forex (TickWealth link) */}
      <div className="bg-gradient-to-r from-slate-900 via-[#101b2e] to-slate-900 border-b border-slate-800 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-center md:text-left">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold uppercase text-[10px] border border-blue-500/30">
              Crucial Notice
            </span>
            <span className="text-slate-300">
              Looking for synthetic indices (Volatility 75, Boom & Crash, Jump) on Deriv? That is our sister project <strong className="text-white">TickWealth</strong>.
            </span>
          </div>

          <a
            href="https://tickwealth.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-semibold transition shrink-0"
          >
            Go to TickWealth (Deriv Synthetics) <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Gilgil Story */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Unregistered educational forex initiative born from real lessons in Gilgil, Nakuru County, Kenya. Built to equip Kenyan youth with real MT4/MT5 charting and risk discipline.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-[#00C261]" />
              <span>Gilgil, Great Rift Valley, Kenya</span>
            </div>
            <div className="pt-1">
              <button
                onClick={onOpenLogoModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-[#00C261]" />
                Download Brand Kit & Logo
              </button>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              The 8 Crucial Pillars
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('start-here')}
                  className="hover:text-[#00C261] transition"
                >
                  1. Start Here (10-Min Journey)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('super-analysis')}
                  className="hover:text-[#00C261] transition"
                >
                  2. Super Analysis Tool (MT4/5)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('tradingview')}
                  className="hover:text-[#00C261] transition"
                >
                  3. Built-in TradingView Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('ai-scanner')}
                  className="hover:text-[#00C261] transition"
                >
                  4. Dual AI Scanner (Chart + Camera)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('masterclass')}
                  className="hover:text-[#00C261] transition"
                >
                  5. 5-Belt Masterclass & Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('brokers')}
                  className="hover:text-[#00C261] transition"
                >
                  6. Broker Hub (FXPesa vs HFM vs FBS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('journal')}
                  className="hover:text-[#00C261] transition"
                >
                  7. Journal, $2 Calc & XP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('trust-legal')}
                  className="hover:text-[#00C261] transition"
                >
                  8. Trust, Gilgil Story & Legal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Brokers & Regulations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              Forex Brokers Compared
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span className="text-white font-medium">FXPesa:</span>
                <span className="text-[#00C261] font-semibold text-[11px] bg-[#00C261]/10 px-1.5 py-0.5 rounded">
                  CMA Kenya Regulated
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-300">HFM (HF Markets):</span>
                <span className="text-amber-400 font-mono text-[10px]">Offshore 1:1000</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-300">FBS:</span>
                <span className="text-amber-400 font-mono text-[10px]">Offshore 1:3000</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-400 leading-normal">
                Direct Lipa Na M-Pesa is officially integrated on FXPesa. Use micro lots (0.01) and the $2 rule.
              </li>
            </ul>
          </div>

          {/* Col 4: GitHub Pages & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Deployment & Open Source
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed as a pure client-side static build. Drag and drop your compiled folder directly to GitHub Pages for 100% free hosting.
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs">
              <button
                onClick={onOpenRiskModal}
                className="flex items-center gap-1.5 text-amber-300 hover:text-white transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Read Full Risk Disclaimer
              </button>
              <a
                href="mailto:pivotfx638@gmail.com"
                className="flex items-center gap-1.5 text-slate-300 hover:text-[#00C261] transition"
              >
                <Mail className="w-3.5 h-3.5" /> pivotfx638@gmail.com
              </a>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
                  Version 2.4.0 • Static SPA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Risk Disclaimer & Copyright */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} PivotFX Lab (Gilgil, Kenya). Unregistered educational research. Not licensed by CMA Kenya. Most retail traders lose capital.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectTab('trust-legal')}
              className="hover:text-white transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onSelectTab('trust-legal')}
              className="hover:text-white transition"
            >
              Terms of Use
            </button>
            <span>•</span>
            <button
              onClick={onOpenRiskModal}
              className="hover:text-amber-300 transition"
            >
              Risk Warning
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
