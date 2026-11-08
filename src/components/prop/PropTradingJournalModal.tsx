import React, { useState } from 'react';
import { JournalTrade } from '../../types/propDesk';
import {
  getStoredJournalTrades,
  updateJournalTradeStatus,
  deleteJournalTrade,
  exportJournalToCsv,
} from '../../utils/propDeskStorage';
import { audioAlertEngine } from '../../utils/audioAlerts';
import {
  X,
  BookOpen,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';

interface PropTradingJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: JournalTrade[];
  onRefreshTrades: (updated: JournalTrade[]) => void;
}

export const PropTradingJournalModal: React.FC<PropTradingJournalModalProps> = ({
  isOpen,
  onClose,
  trades,
  onRefreshTrades,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'WON' | 'LOST' | 'OPEN'>('ALL');

  if (!isOpen) return null;

  const totalTrades = trades.length;
  const closedTrades = trades.filter((t) => t.status !== 'OPEN');
  const wonTrades = trades.filter((t) => t.status === 'WON');
  const lostTrades = trades.filter((t) => t.status === 'LOST');

  const winRate =
    closedTrades.length > 0
      ? Math.round((wonTrades.length / closedTrades.length) * 100)
      : 0;

  const grossProfit = wonTrades.reduce((acc, t) => acc + (t.pnlUsd || 0), 0);
  const grossLoss = Math.abs(lostTrades.reduce((acc, t) => acc + (t.pnlUsd || 0), 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? '5.20' : '0.00';
  const netPnlUsd = grossProfit - grossLoss;

  const filteredTrades = trades.filter((t) => (filter === 'ALL' ? true : t.status === filter));

  const handleMarkWon = (id: string) => {
    // Standard 0.01 micro lot target: +$5.00 (+50 pips)
    const updated = updateJournalTradeStatus(id, 'WON', 5.0, 50);
    audioAlertEngine.playSuccessChime();
    onRefreshTrades(updated);
  };

  const handleMarkLost = (id: string) => {
    // Strict 0.01 micro lot $2 risk cap
    const updated = updateJournalTradeStatus(id, 'LOST', -2.0, -20);
    audioAlertEngine.playWarningChime();
    onRefreshTrades(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deleteJournalTrade(id);
    onRefreshTrades(updated);
  };

  const handleExport = () => {
    exportJournalToCsv(trades);
    audioAlertEngine.playSuccessChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0f1a] border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Institutional Prop Trade Journal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  0.01 Micro Lot Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit every execution, track win rate, and verify adherence to the $2 max risk rule.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analytics KPI Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Win Rate %
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">{winRate}%</span>
              <span className="text-xs text-slate-400">({wonTrades.length}/{closedTrades.length || 1})</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Profit Factor
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-amber-400">{profitFactor}</span>
              <span className="text-xs text-slate-400">R:R 1:2.5+</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Net Desk P&L
            </span>
            <div className="flex items-baseline space-x-2">
              <span
                className={`text-2xl font-bold font-mono ${
                  netPnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {netPnlUsd >= 0 ? '+' : ''}${netPnlUsd.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Total Recorded Trades
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-cyan-300">{totalTrades}</span>
              <span className="text-xs text-slate-400">executions</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 mb-3">
          {(['ALL', 'OPEN', 'WON', 'LOST'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition border ${
                filter === tab
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Trade Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
              <tr>
                <th className="py-2.5 px-3">Pair & Type</th>
                <th className="py-2.5 px-3">Entry (EP)</th>
                <th className="py-2.5 px-3">SL / TP1</th>
                <th className="py-2.5 px-2">Lot & Risk</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">P&L</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTrades.map((trade) => {
                const isBuy = trade.direction === 'BUY';
                return (
                  <tr key={trade.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isBuy
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {trade.direction}
                        </span>
                        <span>{trade.pair}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {new Date(trade.executedAt).toLocaleDateString()} · {trade.confluenceStars || 4}★
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-200">
                      {trade.entryPrice}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      <span className="text-rose-400">{trade.stopLoss}</span> /{' '}
                      <span className="text-emerald-400">{trade.tp1}</span>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-slate-300">
                      <div>0.01 lot</div>
                      <div className="text-[10px] text-slate-400 font-mono">${trade.riskUsd} max</div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          trade.status === 'WON'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : trade.status === 'LOST'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {trade.status === 'WON' ? (
                        <span className="text-emerald-400">+${trade.pnlUsd?.toFixed(2)}</span>
                      ) : trade.status === 'LOST' ? (
                        <span className="text-rose-400">-${Math.abs(trade.pnlUsd || 0).toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400">In Progress</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {trade.status === 'OPEN' ? (
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleMarkWon(trade.id)}
                            className="p-1 rounded text-emerald-400 hover:bg-emerald-500/20 transition"
                            title="Mark as TP1 Hit"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMarkLost(trade.id)}
                            className="p-1 rounded text-rose-400 hover:bg-rose-500/20 transition"
                            title="Mark as SL Hit"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDelete(trade.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
