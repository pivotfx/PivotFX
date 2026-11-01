import React, { useState } from 'react';
import { JournalTrade, CurrencyPair, BrokerId, PageTab } from '../types';
import { PAIRS_PRESETS } from '../data/forexData';
import { CustomSelect, SelectOption } from '../components/common/CustomSelect';
import {
  BookOpenCheck,
  Calculator,
  Download,
  Filter,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Flame,
  Award,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  PieChart,
  Users,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JournalPageProps {
  trades: JournalTrade[];
  onAddTrade: (trade: Omit<JournalTrade, 'id' | 'timestamp'>) => void;
  onDeleteTrade: (id: string) => void;
  xpPoints: number;
  onAwardXp: (amount: number, reason: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  trades,
  onAddTrade,
  onDeleteTrade,
  xpPoints,
  onAwardXp,
}) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'calculators' | 'gamification'>('journal');
  const [filterBroker, setFilterBroker] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Manual trade entry state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualPair, setManualPair] = useState<CurrencyPair>('EUR/USD');
  const [manualBroker, setManualBroker] = useState<BrokerId>('fxpesa');
  const [manualType, setManualType] = useState<'BUY' | 'SELL'>('BUY');
  const [manualPrice, setManualPrice] = useState('1.0845');
  const [manualScore, setManualScore] = useState('85');
  const [manualMode, setManualMode] = useState('20/50 EMA Pullback');
  const [manualNotes, setManualNotes] = useState('Entered on M15 pinbar retest.');

  // Calculators State
  // 1. Pip Calculator
  const [pipPair, setPipPair] = useState<CurrencyPair>('EUR/USD');
  const [pipLots, setPipLots] = useState('0.01'); // 0.01 micro
  const [pipAmount, setPipAmount] = useState('20'); // 20 pips

  // 2. Margin Calculator
  const [marginLots, setMarginLots] = useState('0.01');
  const [marginPrice, setMarginPrice] = useState('1.0850');

  // 3. $2 Rule Survival Calculator
  const [accountBalanceKes, setAccountBalanceKes] = useState('5000'); // approx $38
  const [riskPerTradeUsd, setRiskPerTradeUsd] = useState('2.00'); // strict $2

  // Export to CSV
  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Pair,Broker,Type,EntryPrice,ExitPrice,Score,Mode,RiskUSD,PnLUSD,Status,Notes\n';
    const rows = trades.map((t) =>
      `"${t.id}","${t.timestamp}","${t.pair}","${t.broker}","${t.type}",${t.entryPrice},${t.exitPrice || ''},${t.score},"${t.mode}",${t.riskUsd},${t.pnlUsd || 0},"${t.status}","${t.notes.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pivotfx-journal-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateManualTrade = () => {
    const p = parseFloat(manualPrice);
    const s = parseInt(manualScore, 10) || 75;
    if (isNaN(p)) return;

    onAddTrade({
      pair: manualPair,
      broker: manualBroker,
      type: manualType,
      entryPrice: p,
      score: s,
      mode: manualMode,
      riskUsd: 2.00,
      status: 'OPEN',
      notes: manualNotes,
    });

    setShowManualModal(false);
    onAwardXp(20, 'Logged Trade to Journal');
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#00C261', '#38BDF8'],
    });
  };

  // Calculations
  // Pip value in USD: for 0.01 lot on EUR/USD, 1 pip = $0.10 USD (approx 13 KES)
  const pipLotNum = parseFloat(pipLots) || 0.01;
  const pipsNum = parseFloat(pipAmount) || 20;
  const pipValueUsdPerPip = pipLotNum * 10;
  const totalPipGainUsd = pipValueUsdPerPip * pipsNum;
  const totalPipGainKes = totalPipGainUsd * 130;

  // Margin Required: (Contract Size * Lots * Price) / Leverage
  const contractSize = 100000;
  const marginUsdFxpesa = (contractSize * (parseFloat(marginLots) || 0.01) * (parseFloat(marginPrice) || 1.0850)) / 400;
  const marginUsdHfm = (contractSize * (parseFloat(marginLots) || 0.01) * (parseFloat(marginPrice) || 1.0850)) / 1000;
  const marginKesFxpesa = marginUsdFxpesa * 130;
  const marginKesHfm = marginUsdHfm * 130;

  // Survival Rule Calculator
  const balKes = parseFloat(accountBalanceKes) || 5000;
  const balUsd = balKes / 130;
  const riskUsd = parseFloat(riskPerTradeUsd) || 2.00;
  const maxConsecutiveLosses = Math.floor(balUsd / riskUsd);

  // Filtered trades
  const filteredTrades = trades.filter((t) => {
    if (filterBroker !== 'all' && t.broker !== filterBroker) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  // Calculate Net PnL
  const netPnL = trades.reduce((acc, t) => acc + (t.pnlUsd || 0), 0);
  const winCount = trades.filter((t) => t.status === 'WON').length;
  const winRate = trades.length > 0 ? Math.round((winCount / trades.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
            <BookOpenCheck className="w-4 h-4" />
            <span>Pillar 7 • Journal, Math & Discipline</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Trading Journal & Kenyan Risk Calculators
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track setups logged from the Super Analysis Tool and AI Scanner. Calculate M-Pesa margins, pip values, and account survival bounds.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'journal'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Trade Journal ({trades.length})
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'calculators'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3 Risk Calculators
          </button>
          <button
            onClick={() => setActiveTab('gamification')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'gamification'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gamification & Badges
          </button>
        </div>
      </div>

      {/* TAB 1: JOURNAL */}
      {activeTab === 'journal' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Total Logged Trades</span>
              <div className="text-2xl font-black font-mono text-white">{trades.length}</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Win Rate</span>
              <div className="text-2xl font-black font-mono text-[#00C261]">{winRate}%</div>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Net Realized PnL</span>
              <div
                className={`text-2xl font-black font-mono ${
                  netPnL >= 0 ? 'text-[#00C261]' : 'text-red-400'
                }`}
              >
                {netPnL >= 0 ? `+$${netPnL.toFixed(2)}` : `-$${Math.abs(netPnL).toFixed(2)}`}
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Fixed Risk Per Trade</span>
              <div className="text-2xl font-black font-mono text-cyan-400">$2.00 (260 KES)</div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#111827] border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono">Filter Broker:</span>
              <select
                value={filterBroker}
                onChange={(e) => setFilterBroker(e.target.value)}
                aria-label="Filter Broker"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none"
              >
                <option value="all">All Brokers</option>
                <option value="fxpesa">FXPesa Only</option>
                <option value="hfm">HFM Only</option>
                <option value="fbs">FBS Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowManualModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Log Manual Trade
              </button>
              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* Trade Logs List */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0e1524] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Time & Pair</th>
                    <th className="p-4">Broker</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Entry</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Mode / Setup</th>
                    <th className="p-4">Risk ($2 Rule)</th>
                    <th className="p-4">PnL</th>
                    <th className="p-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredTrades.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <strong className="text-white block text-sm">{t.pair}</strong>
                        <span className="text-[10px] text-slate-500 font-sans">{t.timestamp}</span>
                      </td>
                      <td className="p-4 uppercase text-[#00C261] font-bold">{t.broker}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.type === 'BUY'
                              ? 'bg-emerald-500/20 text-[#00C261]'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td className="p-4 text-white font-bold">{t.entryPrice}</td>
                      <td className="p-4 font-bold text-amber-400">{t.score}/100</td>
                      <td className="p-4 font-sans text-slate-300 max-w-xs truncate">{t.mode}</td>
                      <td className="p-4 text-slate-300">${t.riskUsd.toFixed(2)}</td>
                      <td className="p-4">
                        {t.pnlUsd !== undefined ? (
                          <span
                            className={`font-bold ${
                              t.pnlUsd > 0
                                ? 'text-[#00C261]'
                                : t.pnlUsd < 0
                                ? 'text-red-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {t.pnlUsd > 0 ? `+$${t.pnlUsd.toFixed(2)}` : `$${t.pnlUsd.toFixed(2)}`}
                          </span>
                        ) : (
                          <span className="text-cyan-400 font-semibold">Active</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onDeleteTrade(t.id)}
                          className="text-slate-600 hover:text-red-400 transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CALCULATORS */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Calc 1: Pip Value */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#00C261] font-mono text-xs font-bold">
                <Calculator className="w-4 h-4" />
                <span>Pip Value Calculator (KES/USD)</span>
              </div>
              <p className="text-xs text-slate-400">
                Calculates exact dollar and Kenyan Shilling pip returns based on lot sizing.
              </p>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Lot Size</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pipLots}
                    onChange={(e) => setPipLots(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pips Movement</label>
                  <input
                    type="number"
                    value={pipAmount}
                    onChange={(e) => setPipAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Monetary Gain</span>
              <div className="text-2xl font-black font-mono text-[#00C261]">
                +${totalPipGainUsd.toFixed(2)} USD
              </div>
              <div className="text-xs font-mono text-white/90">
                ≈ {Math.round(totalPipGainKes).toLocaleString()} Kenyan Shillings
              </div>
            </div>
          </div>

          {/* Calc 2: Margin & Leverage */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                <Scale className="w-4 h-4" />
                <span>Margin: FXPesa vs HFM Leverage</span>
              </div>
              <p className="text-xs text-slate-400">
                Compares capital locked on CMA 1:400 vs Offshore 1:1000 margin.
              </p>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Micro Lot Volume</label>
                  <input
                    type="number"
                    step="0.01"
                    value={marginLots}
                    onChange={(e) => setMarginLots(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Asset Price</label>
                  <input
                    type="number"
                    step="any"
                    value={marginPrice}
                    onChange={(e) => setMarginPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">FXPesa (1:400 CMA):</span>
                <strong className="text-white">${marginUsdFxpesa.toFixed(2)} ({Math.round(marginKesFxpesa)} KES)</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">HFM (1:1000 Offshore):</span>
                <strong className="text-cyan-400">${marginUsdHfm.toFixed(2)} ({Math.round(marginKesHfm)} KES)</strong>
              </div>
            </div>
          </div>

          {/* Calc 3: $2 Rule Account Survival */}
          <div className="glass-panel-glow rounded-3xl p-6 border border-[#00C261]/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#00C261] font-mono text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>The Gilgil $2 Survival Rule</span>
              </div>
              <p className="text-xs text-slate-300">
                Calculates how many bad trades you can withstand before blowing your M-Pesa deposit.
              </p>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Account Deposit (KES)</label>
                  <input
                    type="number"
                    value={accountBalanceKes}
                    onChange={(e) => setAccountBalanceKes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Max Risk Per Trade (USD)</label>
                  <input
                    type="number"
                    value={riskPerTradeUsd}
                    onChange={(e) => setRiskPerTradeUsd(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00C261]/20 to-emerald-900/20 border border-[#00C261]/40 text-center space-y-1">
              <span className="text-[10px] font-mono text-slate-300 uppercase">Consecutive Loss Buffer</span>
              <div className="text-3xl font-black font-mono text-[#00C261]">
                {maxConsecutiveLosses} Losses
              </div>
              <p className="text-[11px] text-slate-300">
                You can be wrong <strong>{maxConsecutiveLosses} times</strong> consecutively before blowing this account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GAMIFICATION, BADGES & LEADERBOARD */}
      {activeTab === 'gamification' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Badges Collection */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Unlocked Trader Badges
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-[#00C261]/30 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#00C261]/20 text-[#00C261]">🛡️</div>
                  <div>
                    <strong className="text-white block font-mono">Tower Survivor</strong>
                    <span className="text-slate-400 text-[10px]">Avoided the 1296.56 trap</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-[#00C261]/30 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#00C261]/20 text-[#00C261]">📊</div>
                  <div>
                    <strong className="text-white block font-mono">Disciplined Journaler</strong>
                    <span className="text-slate-400 text-[10px]">Logged 5+ verified trades</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-[#00C261]/30 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#00C261]/20 text-[#00C261]">🇰🇪</div>
                  <div>
                    <strong className="text-white block font-mono">M-Pesa Master</strong>
                    <span className="text-slate-400 text-[10px]">Set up FXPesa demo</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-[#00C261]/30 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#00C261]/20 text-[#00C261]">⚡</div>
                  <div>
                    <strong className="text-white block font-mono">London Sniper</strong>
                    <span className="text-slate-400 text-[10px]">Mastered 11:00 AM EAT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Leaderboard */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00C261]" />
                Gilgil & Kenya Trader Leaderboard
              </h3>
              <div className="space-y-2 text-xs font-mono">
                {[
                  { rank: '1', name: 'Kiprono (Gilgil)', xp: '1,420 XP', winRate: '78%' },
                  { rank: '2', name: 'Wanjiku (Nairobi)', xp: '1,250 XP', winRate: '74%' },
                  { rank: '3', name: 'Otieno (Nakuru)', xp: '980 XP', winRate: '71%' },
                  { rank: '4', name: 'You (Current User)', xp: `${xpPoints} XP`, winRate: `${winRate}%` },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      row.name.includes('You')
                        ? 'bg-[#00C261]/15 border-[#00C261]/40 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-slate-500 font-black">#{row.rank}</span>
                      <span>{row.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-amber-400">{row.xp}</span>
                      <span className="text-[#00C261]">{row.winRate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Trade Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#111827] border border-slate-700 p-6 space-y-4 text-slate-200">
            <h3 className="text-lg font-bold text-white">Manual Trade Log</h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Pair</label>
                  <select
                    value={manualPair}
                    onChange={(e) => setManualPair(e.target.value as CurrencyPair)}
                    className="w-full p-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white"
                  >
                    {Object.keys(PAIRS_PRESETS).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Broker</label>
                  <select
                    value={manualBroker}
                    onChange={(e) => setManualBroker(e.target.value as BrokerId)}
                    className="w-full p-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white"
                  >
                    <option value="fxpesa">FXPesa</option>
                    <option value="hfm">HFM</option>
                    <option value="fbs">FBS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Type</label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as 'BUY' | 'SELL')}
                    className="w-full p-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Entry Price</label>
                  <input
                    type="number"
                    step="any"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Setup / Strategy</label>
                <input
                  type="text"
                  value={manualMode}
                  onChange={(e) => setManualMode(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notes</label>
                <textarea
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full h-16 p-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateManualTrade}
                className="px-5 py-2 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-bold text-xs uppercase"
              >
                Save Trade Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
