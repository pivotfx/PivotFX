import React from 'react';
import { ConfluenceMatrixItem } from '../../types/propDesk';
import { X, Sparkles, CheckCircle2, ShieldCheck, Flame, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ConfluenceMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ConfluenceMatrixItem[];
  selectedPair: string;
  onSelectPair: (pair: string) => void;
}

export const ConfluenceMatrixModal: React.FC<ConfluenceMatrixModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedPair,
  onSelectPair,
}) => {
  if (!isOpen) return null;

  const fourStarCount = items.filter((i) => i.stars === 4).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0f18] border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Multi-Timeframe Confluence Matrix
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  M5 · M15 · H1 · H4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Institutional trend alignment filter across 15 instruments. {fourStarCount} pairs locked in 4-Star Institutional Confluence.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">M5: Precision Entry Timing</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">M15: Order Trigger</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300 font-medium">H1: Market Structure</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-slate-300 font-medium">H4: Institutional Bias</span>
          </div>
        </div>

        {/* Table of all 15 assets */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              <tr>
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-2 text-center">M5</th>
                <th className="py-2.5 px-2 text-center">M15</th>
                <th className="py-2.5 px-2 text-center">H1</th>
                <th className="py-2.5 px-2 text-center">H4</th>
                <th className="py-2.5 px-3 text-center">Confluence Rating</th>
                <th className="py-2.5 px-3 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {items.map((item) => {
                const isSelected = item.pair === selectedPair;
                return (
                  <tr
                    key={item.pair}
                    onClick={() => {
                      onSelectPair(item.pair);
                      onClose();
                    }}
                    className={`cursor-pointer transition-colors hover:bg-slate-800/40 ${
                      isSelected ? 'bg-amber-500/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-white flex items-center space-x-2">
                      <span>{item.pair}</span>
                      {item.isInstitutionalLock && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <Flame className="w-2.5 h-2.5 mr-0.5" /> 4★
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          item.m5 === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.m5 === 'SELL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-700/40 text-slate-400'
                        }`}
                      >
                        {item.m5}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          item.m15 === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.m15 === 'SELL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-700/40 text-slate-400'
                        }`}
                      >
                        {item.m15}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          item.h1 === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.h1 === 'SELL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-700/40 text-slate-400'
                        }`}
                      >
                        {item.h1}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          item.h4 === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.h4 === 'SELL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-700/40 text-slate-400'
                        }`}
                      >
                        {item.h4}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={`text-xs ${
                              idx < item.stars ? 'text-amber-400' : 'text-slate-700'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-[10px] font-mono text-slate-400 ml-1">
                          ({item.bias})
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPair(item.pair);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-800 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center ml-auto space-x-1"
                      >
                        <span>Focus</span>
                        {item.bias.includes('BUY') ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-rose-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-xs text-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Dennis.K.M Prop Rule:</strong> Only execute market orders when at least 3 of the 4 timeframes align with your trade direction. 4-Star setups yield the highest statistical win probability.
          </p>
        </div>
      </div>
    </div>
  );
};
