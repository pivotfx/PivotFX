import React from 'react';
import { ShieldAlert, CheckCircle2, ExternalLink, MapPin } from 'lucide-react';

interface RiskDisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const RiskDisclaimerModal: React.FC<RiskDisclaimerModalProps> = ({ isOpen, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#111827] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] p-6 md:p-8 text-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Mandatory Regulatory Notice
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              PivotFX Lab Transparency Statement
            </h2>
          </div>
        </div>

        <div className="space-y-3.5 text-xs md:text-sm text-slate-300 leading-relaxed border-t border-b border-slate-800 py-4 my-4 max-h-[50vh] overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#00C261] shrink-0 mt-0.5" />
            <p className="text-slate-300">
              <strong className="text-white">Origin & Nature:</strong> PivotFX Lab is a free, non-commercial, unregistered educational community initiative founded in <span className="text-[#00C261] font-semibold">Gilgil, Nakuru County, Kenya</span>. We provide research, analysis software templates, and technical education.
            </p>
          </div>

          <p>
            ⚠️ <strong className="text-amber-300">High Risk of Capital Loss:</strong> Trading leveraged Foreign Exchange (Forex) carries an extremely high level of risk and may not be suitable for all investors. Between <strong>70% to 80% of retail investor accounts lose money</strong> when trading CFDs and forex.
          </p>

          <p>
            🛡️ <strong className="text-emerald-400">Regulatory Distinction:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
            <li>
              <strong className="text-white">FXPesa:</strong> Regulated by the <em>Capital Markets Authority (CMA) Kenya</em> under EGM Securities Ltd. Includes investor dispute avenues and direct Lipa Na M-Pesa.
            </li>
            <li>
              <strong className="text-white">HFM & FBS:</strong> Licensed offshore (Seychelles, Belize, SVG). High leverage (1:1000 to 1:3000) carries amplified liquidation risk without Kenyan CMA protections.
            </li>
            <li>
              <strong className="text-white">Not Deriv:</strong> Deriv synthetics are covered exclusively by TickWealth. PivotFX Lab is pure forex.
            </li>
          </ul>

          <p className="text-slate-400 text-xs">
            We do NOT manage funds, accept deposits, execute trades on behalf of clients, or operate Telegram signal clubs. All charting tools and calculations are for mathematical study only.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            By clicking below, you acknowledge the high risks of forex and that this is an educational tool.
          </p>
          <button
            onClick={onAccept}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-extrabold text-sm tracking-wide transition shadow-lg shadow-[#00C261]/25 flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            I Understand the Risks
          </button>
        </div>
      </div>
    </div>
  );
};
