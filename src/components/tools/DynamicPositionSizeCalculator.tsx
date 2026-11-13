import React, { useEffect, useState } from 'react';
import { CurrencyPair } from '../../types';
import {
  ActiveMarketOrder,
  ComputedTradeParams,
  DEFAULT_RISK_MANAGEMENT_CONFIG,
  RiskManagementConfig,
  computeDynamicPositionRiskPlan,
  positionRiskStore
} from '../../utils/liveMarketEngine';
import { getStoredPropAccount } from '../../utils/propDeskStorage';
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react';

interface DynamicPositionSizeCalculatorProps {
  pair: CurrencyPair;
  computed: ComputedTradeParams;
  lockedOrder?: ActiveMarketOrder | null;
  compact?: boolean;
  className?: string;
}

const BALANCE_PRESETS = [100, 250, 500, 1000, 5000, 10000];
const RISK_PCT_PRESETS = [0.5, 1.0, 1.5, 2.0, 3.0];

export const DynamicPositionSizeCalculator: React.FC<DynamicPositionSizeCalculatorProps> = ({
  pair,
  computed,
  lockedOrder = null,
  compact = false,
  className = ''
}) => {
  const [riskConfig, setRiskConfig] = useState<RiskManagementConfig>(() =>
    positionRiskStore.getConfig()
  );
  const [balanceInput, setBalanceInput] = useState<string>(() =>
    String(positionRiskStore.getConfig().accountBalanceUsd)
  );
  const [riskPctInput, setRiskPctInput] = useState<string>(() =>
    String(positionRiskStore.getConfig().riskPct)
  );

  useEffect(() => {
    const unsub = positionRiskStore.subscribe((nextCfg) => {
      setRiskConfig(nextCfg);
      setBalanceInput((prev) => {
        const parsed = parseFloat(prev);
        return Math.abs(parsed - nextCfg.accountBalanceUsd) > 0.001
          ? String(nextCfg.accountBalanceUsd)
          : prev;
      });
      setRiskPctInput((prev) => {
        const parsed = parseFloat(prev);
        return Math.abs(parsed - nextCfg.riskPct) > 0.001
          ? String(nextCfg.riskPct)
          : prev;
      });
    });
    return () => unsub();
  }, []);

  const riskPlan =
    computed.riskPlan ||
    computeDynamicPositionRiskPlan({
      pair,
      structuralSlPips: computed.slPips,
      brokerSpread: computed.brokerSpread,
      riskConfig
    });

  const decimals = computed.decimals;
  const isBuy = computed.direction === 'BUY';

  const handleBalanceChange = (raw: string) => {
    setBalanceInput(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 10) {
      positionRiskStore.setConfig({ accountBalanceUsd: num });
    }
  };

  const handleRiskPctChange = (raw: string) => {
    setRiskPctInput(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 0.1) {
      positionRiskStore.setConfig({ riskPct: num });
    }
  };

  const handleSyncPropBalance = () => {
    const prop = getStoredPropAccount();
    const bal = prop.currentBalance || prop.accountSize || 10000;
    positionRiskStore.setConfig({ accountBalanceUsd: bal });
  };

  const handleReset = () => {
    positionRiskStore.resetToDefault();
    setBalanceInput(String(DEFAULT_RISK_MANAGEMENT_CONFIG.accountBalanceUsd));
    setRiskPctInput(String(DEFAULT_RISK_MANAGEMENT_CONFIG.riskPct));
  };

  const deltaLabel =
    riskPlan.slAdjustedDeltaPips === 0
      ? 'Exact Structural Match'
      : riskPlan.slAdjustedDeltaPips < 0
      ? `${riskPlan.slAdjustedDeltaPips.toFixed(1)}p tightened`
      : `+${riskPlan.slAdjustedDeltaPips.toFixed(1)}p widened`;

  return (
    <div
      className={`rounded-2xl bg-[#080C14] border border-[#D4AF37]/45 shadow-xl font-mono tabular-nums ${
        compact ? 'p-3.5 space-y-3' : 'p-4 sm:p-5 space-y-4'
      } ${className}`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800/90 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                Dynamic Position Size &amp; SL/TP Risk Engine
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  isBuy
                    ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {pair} · {computed.direction}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Inputs sync live lots, Stop Loss, TP1–TP3 &amp; interactive chart risk zones in real time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleSyncPropBalance}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 transition"
            title="Load current Prop Desk evaluation balance"
          >
            <Wallet className="w-3 h-3" />
            <span>Sync Prop Balance</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition"
            title="Reset to $200 / 1.0% ($2.00 Default)"
          >
            <RotateCcw className="w-3 h-3" />
            <span>$200 / 1%</span>
          </button>
        </div>
      </div>

      {/* Controls Grid: Balance, Risk %, Calibration Mode */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 text-xs">
        {/* Account Balance Input & Presets */}
        <div className="lg:col-span-5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor={`risk-balance-${pair}`}
              className="text-[11px] font-bold text-slate-300 uppercase"
            >
              Account Balance (USD)
            </label>
            <span className="text-[10px] text-[#D4AF37] font-bold">
              ≈ {Math.round(riskPlan.accountBalanceUsd * 130).toLocaleString()} KES
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37] font-black text-sm">
              $
            </span>
            <input
              id={`risk-balance-${pair}`}
              type="number"
              min={10}
              max={10000000}
              step="any"
              value={balanceInput}
              onChange={(e) => handleBalanceChange(e.target.value)}
              className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#0B111E] border border-slate-700 focus:border-[#D4AF37] text-white font-black text-sm outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {BALANCE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => positionRiskStore.setConfig({ accountBalanceUsd: preset })}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition ${
                  Math.abs(riskConfig.accountBalanceUsd - preset) < 0.01
                    ? 'bg-[#D4AF37] text-black font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                ${preset >= 1000 ? `${preset / 1000}K` : preset}
              </button>
            ))}
          </div>
        </div>

        {/* Desired Risk (%) Slider + Numeric Input + Presets */}
        <div className="lg:col-span-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor={`risk-pct-${pair}`}
              className="text-[11px] font-bold text-slate-300 uppercase"
            >
              Desired Risk (%)
            </label>
            <span className="text-[10px] text-[#00C261] font-bold">
              Budget: ${riskPlan.targetRiskUsd.toFixed(2)} ({riskPlan.targetRiskKes.toLocaleString()} KES)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.25}
              max={5.0}
              step={0.25}
              value={Math.min(5, Math.max(0.25, riskConfig.riskPct))}
              onChange={(e) => handleRiskPctChange(e.target.value)}
              aria-label="Desired Risk Percentage Slider"
              className="flex-1 accent-[#00C261] cursor-pointer"
            />
            <div className="relative w-20 shrink-0">
              <input
                id={`risk-pct-${pair}`}
                type="number"
                min={0.1}
                max={15}
                step={0.1}
                value={riskPctInput}
                onChange={(e) => handleRiskPctChange(e.target.value)}
                className="w-full pl-2.5 pr-5 py-1.5 rounded-lg bg-[#0B111E] border border-slate-700 focus:border-[#00C261] text-white font-black text-xs outline-none text-right"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-bold">
                %
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {RISK_PCT_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => positionRiskStore.setConfig({ riskPct: pct })}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition ${
                  Math.abs(riskConfig.riskPct - pct) < 0.01
                    ? 'bg-[#00C261] text-black font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* SL/TP Sync Mode Toggle */}
        <div className="lg:col-span-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#D4AF37]" />
              <span>SL / TP Mode</span>
            </span>
            <span className="text-[10px] text-cyan-300 font-bold">R:R {computed.riskReward}</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => positionRiskStore.setConfig({ syncSlTpWithRisk: true })}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-left border transition ${
                riskConfig.syncSlTpWithRisk
                  ? 'bg-[#00C261]/20 border-[#00C261]/60 text-[#00C261]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Auto Risk-Sync SL/TP &amp; Lots ✓
            </button>
            <button
              type="button"
              onClick={() => positionRiskStore.setConfig({ syncSlTpWithRisk: false })}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-left border transition ${
                !riskConfig.syncSlTpWithRisk
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37]/60 text-[#D4AF37]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fixed Structural SL (Scale Lots)
            </button>
          </div>
        </div>
      </div>

      {/* Live Calibrated Outputs Triad / Quad */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-[#D4AF37]/40 space-y-0.5">
          <span className="text-[10px] text-slate-400 block">Recommended Volume</span>
          <strong className="text-base sm:text-lg font-black text-[#D4AF37] block">
            {computed.lotSize.toFixed(2)} Lots
          </strong>
          <span className="text-[10px] text-cyan-300 block">
            ${riskPlan.pipValPerPositionUsd.toFixed(2)} / pip
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-400 block">Actual Risk Exposure</span>
          <strong className="text-base sm:text-lg font-black text-white block">
            ${riskPlan.actualRiskUsd.toFixed(2)} ({riskPlan.actualRiskPct}%)
          </strong>
          <span className="text-[10px] text-slate-400 block">
            {riskPlan.actualRiskKes.toLocaleString()} KES max risk
          </span>
        </div>

        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 space-y-0.5">
          <span className="text-[10px] text-red-300 block">
            Adjusted SL (-{computed.slPips}p)
          </span>
          <strong className="text-base sm:text-lg font-black text-red-400 block">
            {computed.stopLoss.toFixed(decimals)}
          </strong>
          <span className="text-[10px] text-red-300/80 block truncate">{deltaLabel}</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/30 border border-[#00C261]/45 space-y-0.5">
          <span className="text-[10px] text-emerald-300 block flex items-center gap-1">
            {isBuy ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>Adjusted TP2 (+{computed.tpPips}p)</span>
          </span>
          <strong className="text-base sm:text-lg font-black text-[#00C261] block">
            {computed.tp2.toFixed(decimals)}
          </strong>
          <span className="text-[10px] text-emerald-300 block truncate">
            +${computed.netProfitUsd.toFixed(2)} (+{computed.netProfitKes.toLocaleString()} KES)
          </span>
        </div>
      </div>

      {/* TP1 / EP / TP3 Alignment Strip */}
      <div className="px-3 py-2 rounded-xl bg-slate-950/85 border border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 text-slate-300 min-w-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00C261] shrink-0" />
          <span className="truncate">{riskPlan.calibrationSummary}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 shrink-0">
          <span>
            EP: <strong className="text-white">{computed.entryPrice.toFixed(decimals)}</strong>
          </span>
          <span>
            TP1: <strong className="text-cyan-300">{computed.tp1.toFixed(decimals)}</strong>
          </span>
          <span>
            48H TP3: <strong className="text-[#D4AF37]">{computed.tp3.toFixed(decimals)}</strong>
          </span>
        </div>
      </div>

      {/* Floor / Locked-Order Safety Notice */}
      {riskPlan.isBelowMinBrokerRisk && (
        <div className="p-2.5 rounded-xl bg-amber-950/45 border border-amber-500/45 text-amber-200 text-[11px] flex items-start gap-2 font-sans">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="font-mono text-amber-300">BROKER 0.01-LOT FLOOR PROTECTION: </strong>
            Target risk (${riskPlan.targetRiskUsd.toFixed(2)}) is below the minimum safe stop clearance for{' '}
            {pair} at 0.01 lot (${riskPlan.minSafeRiskUsd.toFixed(2)}). Stop Loss is held at the safe{' '}
            {computed.slPips}p structural floor so spread noise won&apos;t prematurely close the trade.
          </span>
        </div>
      )}

      {lockedOrder && (
        <div className="p-2.5 rounded-xl bg-cyan-950/35 border border-cyan-500/40 text-cyan-200 text-[11px] flex items-center gap-2 font-sans">
          <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0" />
          <span>
            Saved session order active ({lockedOrder.direction} @ {lockedOrder.entryPrice}, {lockedOrder.lotSize.toFixed(2)} Lots).
            Calculator updates live signal benchmarks below without altering your open broker ticket.
          </span>
        </div>
      )}
    </div>
  );
};
