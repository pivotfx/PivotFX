import React, { useState } from 'react';
import { CurrencyPair } from '../../types';
import { MarketScanData, computeCurrencyStrengthMatrix } from '../../utils/liveMarketEngine';
import { Activity, ArrowUpRight, ChevronDown, ChevronUp, Flame, Gauge } from 'lucide-react';

interface CurrencyStrengthMatrixStripProps {
  markets: MarketScanData[];
  onSelectPair: (pair: CurrencyPair) => void;
}

export const CurrencyStrengthMatrixStrip: React.FC<CurrencyStrengthMatrixStripProps> = ({
  markets,
  onSelectPair
}) => {
  const [expanded, setExpanded] = useState(true);
  const report = computeCurrencyStrengthMatrix(markets);

  return (
    <div className="rounded-2xl bg-[#080E1A] border border-slate-800 hover:border-slate-700 transition font-mono tabular-nums">
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-300 shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <strong className="text-white uppercase tracking-wider font-black">
                Live 8-Currency Strength Meter
              </strong>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-[#00C261] border border-[#00C261]/35 text-[10px] font-black">
                Strongest: {report.strongest.code} ({report.strongest.score >= 0 ? `+${report.strongest.score}` : report.strongest.score})
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/35 text-[10px] font-black">
                Weakest: {report.weakest.code} ({report.weakest.score >= 0 ? `+${report.weakest.score}` : report.weakest.score})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {report.summaryText} · Divergence Spread {report.divergenceSpread} pts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => onSelectPair(report.topDivergencePair)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black inline-flex items-center gap-1.5 transition whitespace-nowrap ${
              report.topDivergenceDirection === 'BUY'
                ? 'bg-[#00C261] hover:bg-emerald-400 text-black'
                : 'bg-red-500 hover:bg-red-400 text-white'
            }`}
            title="Inspect strongest vs weakest currency pair on live chart"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>
              Inspect {report.topDivergencePair} ({report.topDivergenceDirection})
            </span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition"
          >
            <Activity className="w-3 h-3 text-cyan-300" />
            <span>{expanded ? 'Hide Bars' : 'Show Bars'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3.5 pt-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 border-t border-slate-800/70">
          {report.rankings.map((item, idx) => {
            const absPct = Math.max(8, Math.min(100, Math.abs(item.score)));
            const isPos = item.score >= 0;
            const barColor =
              item.momentumBias === 'STRONG'
                ? 'bg-[#00C261]'
                : item.momentumBias === 'WEAK'
                ? 'bg-red-500'
                : 'bg-[#D4AF37]';
            const textColor =
              item.momentumBias === 'STRONG'
                ? 'text-[#00C261]'
                : item.momentumBias === 'WEAK'
                ? 'text-red-300'
                : 'text-[#D4AF37]';

            return (
              <div
                key={item.code}
                className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-black text-white">
                    {idx + 1}. {item.code}
                  </span>
                  <span className={`font-black ${textColor}`}>
                    {isPos ? `+${item.score}` : item.score}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${absPct}%` }}
                  />
                </div>
                <div className="text-[9px] text-slate-400 flex items-center justify-between">
                  <span>{item.momentumBias}</span>
                  <span>
                    {item.avgPctMove >= 0 ? `+${item.avgPctMove}%` : `${item.avgPctMove}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
