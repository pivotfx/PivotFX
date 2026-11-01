import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Scale,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const RiskInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lot' | 'rrr' | 'compound'>('lot');

  // Lot Size Calculator State
  const [accountBalance, setAccountBalance] = useState<number>(100);
  const [riskPercent, setRiskPercent] = useState<number>(2.0);
  const [stopLossPips, setStopLossPips] = useState<number>(20);
  const [pairType, setPairType] = useState<'standard' | 'jpy'>('standard');

  // Risk-Reward Calculator State
  const [entryPrice, setEntryPrice] = useState<number>(1.0850);
  const [slPrice, setSlPrice] = useState<number>(1.0830);
  const [tpPrice, setTpPrice] = useState<number>(1.0910);
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');

  // Compound Growth Simulator State
  const [initialCapital, setInitialCapital] = useState<number>(100);
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<number>(8);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);

  // Lot calculation outputs
  const dollarRisk = (accountBalance * (riskPercent / 100));
  const pipValuePerStandardLot = pairType === 'standard' ? 10 : 9.2;
  const calculatedLotSize = Number((dollarRisk / (stopLossPips * pipValuePerStandardLot)).toFixed(2));
  const effectiveLot = Math.max(0.01, calculatedLotSize);

  // RRR calculation outputs
  const calculatedRiskPips = Math.abs(entryPrice - slPrice) * 10000;
  const calculatedRewardPips = Math.abs(tpPrice - entryPrice) * 10000;
  const rrrRatio = calculatedRiskPips > 0 ? Number((calculatedRewardPips / calculatedRiskPips).toFixed(2)) : 0;
  const breakevenWinRate = rrrRatio > 0 ? Number((100 / (1 + rrrRatio)).toFixed(1)) : 50;

  // Compound 12-Month Table calculation
  const compoundSchedule = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    let balance = initialCapital;
    for (let m = 1; m <= month; m++) {
      balance = (balance * (1 + monthlyGrowthRate / 100)) + monthlyContribution;
    }
    return {
      month,
      balance: Number(balance.toFixed(2)),
      gainTotal: Number((balance - initialCapital - (monthlyContribution * month)).toFixed(2)),
    };
  });

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/30 my-8">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>INTERACTIVE RISK LAB • 3 WORKING CALCULATORS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Capital Protection & Mathematical Sizing Suite
          </h3>
          <p className="text-xs text-slate-400">
            Never guess your lot size or risk reward. Verify mathematical parameters before touching live orders.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('lot')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'lot' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>1. Lot Size Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('rrr')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'rrr' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2. Risk/Reward (RRR)</span>
          </button>
          <button
            onClick={() => setActiveTab('compound')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'compound' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3. 12-Mo Compounder</span>
          </button>
        </div>
      </div>

      {/* CALCULATOR 1: LOT SIZER */}
      {activeTab === 'lot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Account Equity ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500 font-mono text-xs">$</span>
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full pl-7 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Risk Percentage (% or Gilgil Rule)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                  />
                  <span className="absolute right-3 top-3 text-slate-500 font-mono text-xs">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Stop Loss Distance (Pips)
                </label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Currency Quote Group
                </label>
                <select
                  value={pairType}
                  onChange={(e) => setPairType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
                >
                  <option value="standard">USD Quote (EUR/USD, GBP/USD)</option>
                  <option value="jpy">JPY Crosses (USD/JPY, GBP/JPY)</option>
                </select>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-mono">
              <span className="text-slate-500">Quick Presets:</span>
              <button
                onClick={() => { setAccountBalance(50); setRiskPercent(4.0); setStopLossPips(20); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-[#D4AF37]/30"
              >
                Gilgil $2 Cap ($50 Acc)
              </button>
              <button
                onClick={() => { setAccountBalance(1000); setRiskPercent(1.0); setStopLossPips(25); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                $1K Account (1%)
              </button>
              <button
                onClick={() => { setAccountBalance(10000); setRiskPercent(0.5); setStopLossPips(20); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30"
              >
                $10K Prop Firm (0.5%)
              </button>
            </div>
          </div>

          {/* Sizing Output Display */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 p-5 border border-slate-800 space-y-4">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Calculated Institutional Lot Size:
            </span>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                <span className="text-gold-gradient">{effectiveLot}</span>
                <span className="text-xs text-slate-400 font-normal"> Lots</span>
              </div>
              <span className="text-xs font-mono text-[#00C261]">
                {effectiveLot <= 0.05 ? 'Micro Lot Tier (Safe)' : effectiveLot <= 0.5 ? 'Mini Lot Tier' : 'Standard Lot Tier'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Total Dollar Risk:</span>
                <strong className="text-red-400">-${dollarRisk.toFixed(2)} USD (~{Math.round(dollarRisk * 130)} KES)</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Pip Value at This Size:</span>
                <strong className="text-white">${(effectiveLot * pipValuePerStandardLot).toFixed(2)} / pip</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Required Margin (1:100):</span>
                <strong className="text-cyan-300">${(effectiveLot * 1000).toFixed(2)} USD</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 2: RISK-TO-REWARD (RRR) */}
      {activeTab === 'rrr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Entry Price</label>
                <input
                  type="number"
                  step="0.0001"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-red-400 block mb-1">Stop Loss Price</label>
                <input
                  type="number"
                  step="0.0001"
                  value={slPrice}
                  onChange={(e) => setSlPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-emerald-400 block mb-1">Take Profit Price</label>
                <input
                  type="number"
                  step="0.0001"
                  value={tpPrice}
                  onChange={(e) => setTpPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[#D4AF37] font-bold block font-mono">Asymmetry Rule:</span>
              <p>
                Never accept a setup with an RRR under 1:2.0. High RRR systems allow you to achieve profitability even with a losing win rate.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 p-5 border border-slate-800 space-y-4">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Risk/Reward Calculation:
            </span>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                <span className={rrrRatio >= 2 ? 'text-emerald-400' : 'text-amber-400'}>
                  1 : {rrrRatio}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {rrrRatio >= 2.5 ? '🏆 Institutional Grade Setup' : rrrRatio >= 2 ? '✅ Acceptable Trade' : '⚠️ Subpar (Avoid trade)'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Risk Distance:</span>
                <strong className="text-red-400">{calculatedRiskPips.toFixed(1)} Pips</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Reward Distance:</span>
                <strong className="text-emerald-400">+{calculatedRewardPips.toFixed(1)} Pips</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Minimum Breakeven Win Rate:</span>
                <strong className="text-cyan-300">{breakevenWinRate}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 3: 12-MONTH COMPOUND SIMULATOR */}
      {activeTab === 'compound' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Starting Capital ($ USD)</label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Math.max(10, parseFloat(e.target.value) || 0))}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Target Monthly Return (%)</label>
              <input
                type="number"
                step="0.5"
                value={monthlyGrowthRate}
                onChange={(e) => setMonthlyGrowthRate(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Monthly Top-Up / Deposit ($)</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          {/* 12-Month Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Projected Balance</th>
                  <th className="p-3">Total Growth</th>
                  <th className="p-3">Milestone Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {compoundSchedule.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-900/50 transition">
                    <td className="p-3 font-bold text-white">Month {row.month}</td>
                    <td className="p-3 font-bold text-emerald-400">${row.balance.toLocaleString()}</td>
                    <td className="p-3 text-cyan-300">+${row.gainTotal.toLocaleString()}</td>
                    <td className="p-3 text-slate-400">
                      {row.balance >= 1000 ? '🚀 Prop Firm Challenge Ready' : row.balance >= 500 ? '🛡️ Sizing Expansion' : '🌱 Capital Seed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
