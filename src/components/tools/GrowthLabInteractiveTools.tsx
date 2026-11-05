import React, { useState, useEffect, useMemo } from 'react';
import { JournalTrade, CurrencyPair } from '../../types';
import {
  BookOpenCheck,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Scale,
  DollarSign,
  Activity,
  Wallet,
  Percent,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const INITIAL_DEMO_TRADES: JournalTrade[] = [
  {
    id: 'tr-01',
    timestamp: 'Recent • 11:18 EAT',
    pair: 'GBP/USD',
    type: 'SELL',
    lotSize: 0.01,
    entryPrice: 1.35100,
    exitPrice: 1.34431,
    pnlUsd: 6.69,
    status: 'WON',
    setupName: 'Tower Top Reversal',
    mistakeTag: 'Clean Execution',
    notes: 'Sold the 1.35456 liquidity sweep; exited at 20 EMA target.'
  },
  {
    id: 'tr-02',
    timestamp: 'Recent • 15:42 EAT',
    pair: 'EUR/USD',
    type: 'BUY',
    lotSize: 0.01,
    entryPrice: 1.12670,
    exitPrice: 1.13218,
    pnlUsd: 5.48,
    status: 'WON',
    setupName: '20/50 EMA Bounce',
    mistakeTag: 'Clean Execution',
    notes: 'Bought pullback to 50 EMA during London/NY overlap.'
  },
  {
    id: 'tr-03',
    timestamp: 'Recent • 12:10 EAT',
    pair: 'USD/JPY',
    type: 'BUY',
    lotSize: 0.01,
    entryPrice: 158.250,
    exitPrice: 158.050,
    pnlUsd: -2.00,
    status: 'LOST',
    setupName: 'Breakout Chase',
    mistakeTag: 'Impatience / Chop',
    notes: 'Traded during Asian chop; respected $2 stop loss.'
  }
];

export const GrowthLabInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logger' | 'audit' | 'roadmap' | 'mpesa'>('logger');
  const [mpesaDepositKes, setMpesaDepositKes] = useState<number>(5000);
  const [startingBalanceUsd, setStartingBalanceUsd] = useState<number>(100);

  // Trade Journal state persisted in localStorage
  const [trades, setTrades] = useState<JournalTrade[]>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_prop_trades');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_TRADES;
    } catch {
      return INITIAL_DEMO_TRADES;
    }
  });

  useEffect(() => {
    localStorage.setItem('pivotfx_prop_trades', JSON.stringify(trades));
  }, [trades]);

  // Form State
  const [pair, setPair] = useState<CurrencyPair>('EUR/USD');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [lotSize, setLotSize] = useState<number>(0.01);
  const [entryPrice, setEntryPrice] = useState<number>(1.1267);
  const [exitPrice, setExitPrice] = useState<number>(1.1327);
  const [pnlUsd, setPnlUsd] = useState<number>(6.00);
  const [status, setStatus] = useState<'WON' | 'LOST' | 'OPEN'>('WON');
  const [setupName, setSetupName] = useState<string>('Tower Top Reversal');
  const [mistakeTag, setMistakeTag] = useState<string>('Clean Execution');
  const [notes, setNotes] = useState<string>('');

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: JournalTrade = {
      id: `tr-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-GB', {
        timeZone: 'Africa/Nairobi',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' EAT',
      pair,
      type,
      lotSize,
      entryPrice,
      exitPrice,
      pnlUsd: status === 'LOST' ? -Math.abs(pnlUsd) : Math.abs(pnlUsd),
      status,
      setupName,
      mistakeTag,
      notes: notes || 'Standard execution.',
    };

    setTrades([newTrade, ...trades]);
    setNotes('');
  };

  const handleDeleteTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
  };

  // Performance calculations
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.status === 'WON');
  const losingTrades = trades.filter((t) => t.status === 'LOST');
  const winRate = totalTrades > 0 ? Math.round((winningTrades.length / totalTrades) * 100) : 0;
  const netPnL = trades.reduce((acc, t) => acc + (t.pnlUsd || 0), 0);
  const grossProfit = winningTrades.reduce((acc, t) => acc + (t.pnlUsd || 0), 0);
  const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + (t.pnlUsd || 0), 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? '99.0' : '0.00';

  // Gilgil Discipline Audit & Equity Curve Calculation
  const exchangeRate = 130; // 1 USD = 130 KES
  const disciplinedTrades = trades.filter((t) => (t.lotSize ?? 0.01) <= 0.01 && (t.status !== 'LOST' || Math.abs(t.pnlUsd ?? 0) <= 2.2));
  const disciplineScore = trades.length > 0 ? Math.round((disciplinedTrades.length / trades.length) * 100) : 100;

  const equityData = useMemo(() => {
    let balance = startingBalanceUsd;
    const sorted = [...trades].reverse();
    const points: { index: number; label: string; pnl: number; balance: number }[] = [
      { index: 0, label: 'Start', pnl: 0, balance: startingBalanceUsd }
    ];

    sorted.forEach((t, i) => {
      balance += t.pnlUsd || 0;
      points.push({
        index: i + 1,
        label: t.pair,
        pnl: t.pnlUsd || 0,
        balance: Number(balance.toFixed(2))
      });
    });

    const balances = points.map((p) => p.balance);
    const minBal = Math.min(...balances);
    const maxBal = Math.max(...balances);
    const currentBalance = points[points.length - 1].balance;
    const peakBalance = maxBal;
    const maxDrawdownUsd = peakBalance - minBal;
    const maxDrawdownPct = peakBalance > 0 ? ((maxDrawdownUsd / peakBalance) * 100).toFixed(1) : '0';

    return {
      points,
      minBal,
      maxBal,
      currentBalance,
      peakBalance,
      maxDrawdownPct
    };
  }, [trades, startingBalanceUsd]);

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/30 my-8">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL PERFORMANCE ENGINE • LOCALSTORAGE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Prop Firm Ledger & Funded Scaling Lab
          </h3>
          <p className="text-xs text-slate-400">
            Log your executions, audit your mathematical edge, and review the 90-day funded trader roadmap.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold font-mono gap-1">
          <button
            onClick={() => setActiveTab('logger')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'logger' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>1. Trade Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2. Weekly Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'roadmap' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3. Funded Roadmap</span>
          </button>
          <button
            onClick={() => setActiveTab('mpesa')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'mpesa' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. 🇰🇪 M-Pesa Shield</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WORKING TRADE LOGGER */}
      {activeTab === 'logger' && (
        <div className="space-y-6">
          {/* Summary Metric Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Logged</span>
              <strong className="text-xl font-bold font-mono text-white">{totalTrades} Trades</strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Win Rate</span>
              <strong className={`text-xl font-bold font-mono ${winRate >= 50 ? 'text-[#00C261]' : 'text-amber-400'}`}>
                {winRate}%
              </strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Profit Factor</span>
              <strong className="text-xl font-bold font-mono text-cyan-300">
                {profitFactor}
              </strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Net PnL</span>
              <strong className={`text-xl font-bold font-mono ${netPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {netPnL >= 0 ? `+$${netPnL.toFixed(2)}` : `-$${Math.abs(netPnL).toFixed(2)}`}
              </strong>
            </div>
          </div>

          {/* Interactive Visual Equity Curve & Gilgil Discipline Audit */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Institutional Equity Curve
                </span>
                <span className="text-[10px] text-slate-400">
                  (Base: ${startingBalanceUsd} • Current: ${equityData.currentBalance} / ~{(equityData.currentBalance * exchangeRate).toLocaleString()} KES)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Gilgil Shield Discipline:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${disciplineScore >= 90 ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/30' : 'bg-amber-500/20 text-amber-300'}`}>
                  {disciplineScore}% Compliance
                </span>
              </div>
            </div>

            {/* SVG Visual Line Chart */}
            <div className="relative w-full h-44 bg-slate-900/50 rounded-xl p-3 border border-slate-800/60 overflow-hidden flex flex-col justify-between">
              {(() => {
                const points = equityData.points;
                const width = 600;
                const height = 110;
                const padX = 25;
                const padY = 15;
                const rangeY = Math.max(10, equityData.maxBal - equityData.minBal);

                const getX = (idx: number) => padX + (idx / Math.max(1, points.length - 1)) * (width - 2 * padX);
                const getY = (bal: number) => height - padY - ((bal - equityData.minBal) / rangeY) * (height - 2 * padY);

                const coords = points.map((p) => ({ ...p, x: getX(p.index), y: getY(p.balance) }));
                const polylineStr = coords.map((c) => `${c.x},${c.y}`).join(' ');
                const polygonStr = `${polylineStr} ${coords[coords.length - 1].x},${height} ${coords[0].x},${height}`;

                return (
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
                    <defs>
                      <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00C261" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#00C261" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1={padX} y1={getY(startingBalanceUsd)} x2={width - padX} y2={getY(startingBalanceUsd)} stroke="#475569" strokeDasharray="3,3" strokeWidth="1" />
                    <polygon points={polygonStr} fill="url(#equityGrad)" />
                    <polyline points={polylineStr} fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {coords.map((c, i) => (
                      <circle
                        key={i}
                        cx={c.x}
                        cy={c.y}
                        r={i === coords.length - 1 ? 4.5 : 3}
                        className={c.pnl >= 0 ? 'fill-[#00C261]' : 'fill-red-500'}
                        stroke="#080C14"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                );
              })()}

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex-wrap gap-2">
                <span>Start: ${startingBalanceUsd}.00</span>
                <span>Peak: ${equityData.peakBalance}</span>
                <span>Max Drawdown: {equityData.maxDrawdownPct}%</span>
                <span className="text-[#00C261] font-bold">Net Growth: {netPnL >= 0 ? `+$${netPnL.toFixed(2)}` : `-$${Math.abs(netPnL).toFixed(2)}`}</span>
              </div>
            </div>
          </div>

          {/* Add Trade Form */}
          <form onSubmit={handleAddTrade} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#D4AF37] flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Log New Executed Trade:</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Auto-persisted to browser storage</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Pair</label>
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                >
                  <option value="EUR/USD">EUR/USD</option>
                  <option value="GBP/USD">GBP/USD</option>
                  <option value="USD/JPY">USD/JPY</option>
                  <option value="XAU/USD">XAU/USD</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Lot Size</label>
                <input
                  type="number"
                  step="0.01"
                  value={lotSize}
                  onChange={(e) => setLotSize(parseFloat(e.target.value) || 0.01)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Outcome</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                >
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                  <option value="OPEN">OPEN</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">PnL ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pnlUsd}
                  onChange={(e) => setPnlUsd(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Setup Name</label>
                <select
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none"
                >
                  <option value="Tower Top Reversal">Tower Top Reversal</option>
                  <option value="20/50 EMA Bounce">20/50 EMA Bounce</option>
                  <option value="RSI 70/30 Divergence">RSI 70/30 Divergence</option>
                  <option value="London Open Breakout">London Open Breakout</option>
                  <option value="FVG Mitigation">FVG Mitigation</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Trade notes & takeaway..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none focus:border-[#D4AF37]"
              />

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-gold text-black font-extrabold text-xs uppercase tracking-wider shrink-0"
              >
                + Record Trade
              </button>
            </div>
          </form>

          {/* Interactive Trade Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Time (EAT)</th>
                  <th className="p-3">Pair & Type</th>
                  <th className="p-3">Lots</th>
                  <th className="p-3">Setup Strategy</th>
                  <th className="p-3">PnL ($)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {trades.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-3 text-slate-400">{t.timestamp}</td>
                    <td className="p-3">
                      <span className="font-bold text-white">{t.pair}</span>{' '}
                      <span className={t.type === 'BUY' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{t.lotSize}</td>
                    <td className="p-3 text-[#D4AF37]">{t.setupName}</td>
                    <td className="p-3 font-bold">
                      <span className={(t.pnlUsd ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {(t.pnlUsd ?? 0) >= 0 ? `+$${(t.pnlUsd ?? 0).toFixed(2)}` : `-$${Math.abs(t.pnlUsd ?? 0).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'WON'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : t.status === 'LOST'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 max-w-xs truncate">{t.notes}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteTrade(t.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                        title="Delete trade"
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
      )}

      {/* TAB 2: WEEKLY AUDIT TOOL */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white font-mono uppercase">
            Weekly Mathematical Edge Audit:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">Gross Winning Dollars</span>
              <strong className="text-lg text-emerald-400">+${grossProfit.toFixed(2)} USD</strong>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">Gross Losing Dollars</span>
              <strong className="text-lg text-red-400">-${grossLoss.toFixed(2)} USD</strong>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">System Profit Factor</span>
              <strong className="text-lg text-gold-gradient">{profitFactor}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-slate-300 space-y-1">
            <strong className="text-white block font-mono">Institutional Diagnosis:</strong>
            <p>
              {Number(profitFactor) >= 1.75
                ? 'Your system demonstrates strong mathematical expectancy. You are ready to purchase and execute a $10K or $25K prop firm challenge.'
                : 'Focus on eliminating low RRR trades. Ensure every winning trade produces at least 2.5x your $2.00 risk cap.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: FUNDED ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
            The 90-Day Funded Trader Trajectory:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                MONTH 1 (DAYS 1 - 30)
              </span>
              <h5 className="text-sm font-bold text-white">Foundation & Academy Mastery</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete all 8 Pillars of PivotFx. Practice on an FXPesa demo account strictly using 0.01 micro lots and the $2.00 survival rule.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                MONTH 2 (DAYS 31 - 60)
              </span>
              <h5 className="text-sm font-bold text-white">Statistical Validation</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log 50 consecutive trades in the Trade Logger. Prove a Profit Factor &gt; 1.75 with zero emotional revenge trading.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00C261]/20 text-[#00C261] font-bold">
                MONTH 3 (DAYS 61 - 90+)
              </span>
              <h5 className="text-sm font-bold text-white">Prop Firm Funding & Payouts</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Purchase a $10,000 or $25,000 prop challenge. Pass Phase 1 (8%) and Phase 2 (5%) risking 0.5%. Receive your first real profit split!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: M-PESA COMPOUNDING & DRAWDOWN SHIELD CALCULATOR   */}
      {/* ======================================================== */}
      {activeTab === 'mpesa' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" />
                  <span>M-Pesa Kenya Capital Protection & Compounding Matrix</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate your real account longevity on FXPesa (CMA Licensed) or Exness with instant Safaricom M-Pesa deposits and withdrawals.
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                FX Rate: <strong className="text-white">1 USD = 130 KES</strong>
              </div>
            </div>

            {/* Deposit Slider & Quick Selectors */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <label className="text-slate-300 font-bold uppercase">Select M-Pesa Initial Deposit (KES):</label>
                <span className="text-xl font-black text-emerald-400">
                  {mpesaDepositKes.toLocaleString()} KES{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    (${(mpesaDepositKes / 130).toFixed(2)} USD)
                  </span>
                </span>
              </div>

              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={mpesaDepositKes}
                onChange={(e) => setMpesaDepositKes(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                <span className="text-[10px] text-slate-400 self-center">Presets:</span>
                {[2000, 5000, 10000, 20000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMpesaDepositKes(amt)}
                    className={`px-2.5 py-1 rounded-lg border transition ${
                      mpesaDepositKes === amt
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {amt.toLocaleString()} KES
                  </button>
                ))}
              </div>
            </div>

            {/* Drawdown Survival Badges */}
            {(() => {
              const depositUsd = mpesaDepositKes / 130;
              const maxLossPerTradeUsd = 2.00;
              const maxLossKes = 260;
              const consecutiveLosses = Math.floor(depositUsd / maxLossPerTradeUsd);
              const targetDoubleKes = mpesaDepositKes * 2;
              const targetPropChallengeKes = 6500; // e.g. ~$50 for $5k prop challenge

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Account Balance</span>
                      <strong className="text-base sm:text-lg text-white font-bold">{mpesaDepositKes.toLocaleString()} KES</strong>
                      <span className="text-[10px] text-slate-400 block">(${(depositUsd).toFixed(2)} USD)</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60">
                      <span className="text-[10px] text-emerald-400 block uppercase font-bold">Consecutive $2 Losses</span>
                      <strong className="text-base sm:text-lg text-emerald-300 font-bold">{consecutiveLosses} Attempts</strong>
                      <span className="text-[10px] text-slate-400 block">Survives 50% drawdown</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Gilgil Shield Loss</span>
                      <strong className="text-base sm:text-lg text-amber-300 font-bold">{maxLossKes} KES</strong>
                      <span className="text-[10px] text-slate-400 block">Strict $2.00 / 0.01 lot</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-900/60">
                      <span className="text-[10px] text-cyan-400 block uppercase font-bold">2.5R Win Target</span>
                      <strong className="text-base sm:text-lg text-cyan-300 font-bold">+{maxLossKes * 2.5} KES</strong>
                      <span className="text-[10px] text-slate-400 block">(+$5.00 gain per setup)</span>
                    </div>
                  </div>

                  {/* 3-Stage Milestone Compounding Roadmap */}
                  <div className="space-y-2 pt-2">
                    <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      3-Stage Account Compounding Protocol (0.01 Micro-Lot Cap):
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-bold">
                          STAGE 1: SURVIVAL BUFFER
                        </span>
                        <div className="text-white font-bold">{mpesaDepositKes.toLocaleString()} → {targetDoubleKes.toLocaleString()} KES</div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Maintain strictly 0.01 lot. With a 50% win rate at 1:2.5 R:R, 20 trades will yield +15R = ~$30 profit (3,900 KES net growth).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 font-bold">
                          STAGE 2: PROP CHALLENGE BUDGET
                        </span>
                        <div className="text-white font-bold">{targetDoubleKes.toLocaleString()} → {(targetDoubleKes + targetPropChallengeKes).toLocaleString()} KES</div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Withdraw {targetPropChallengeKes.toLocaleString()} KES ($50 USD) directly to your Safaricom M-Pesa to fund a $5,000 Prop Firm challenge.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-[#D4AF37]/50 space-y-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                          STAGE 3: FUNDED PAYOUTS
                        </span>
                        <div className="text-[#D4AF37] font-bold">$5,000 (650,000 KES Account)</div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Risk $25 per trade on the funded account. A 4% monthly return generates $200 (26,000 KES) paid out directly to M-Pesa every 14 days!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Broker Gateway Comparison */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                    <strong className="text-white block uppercase">M-Pesa Deposit &amp; Withdrawal Speed:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-300">
                      <div>• <strong>FXPesa (EGM Securities):</strong> Regulated by CMA Kenya. Direct M-Pesa Paybill (Zero deposit fee, withdrawal in &lt; 2 hrs).</div>
                      <div>• <strong>Exness:</strong> Automated M-Pesa API gateway. Instant 24/7 withdrawals processed in &lt; 3 minutes straight to M-Pesa.</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
