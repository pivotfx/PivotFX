import React, { useState } from 'react';
import { PropAccountConfig } from '../../types/propDesk';
import { savePropAccount } from '../../utils/propDeskStorage';
import { audioAlertEngine } from '../../utils/audioAlerts';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  Lock,
  Unlock,
  TrendingUp,
  DollarSign,
  Activity,
} from 'lucide-react';

interface PropDrawdownGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PropAccountConfig;
  onUpdateConfig: (newConfig: PropAccountConfig) => void;
}

const ACCOUNT_SIZES = [10000, 25000, 50000, 100000, 200000];

export const PropDrawdownGuardModal: React.FC<PropDrawdownGuardModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [localConfig, setLocalConfig] = useState<PropAccountConfig>(config);

  if (!isOpen) return null;

  const maxDailyLossAllowed = (localConfig.accountSize * localConfig.maxDailyLossPct) / 100;
  const maxTotalDrawdownAllowed = (localConfig.accountSize * localConfig.maxTotalDrawdownPct) / 100;

  const dailyLossPctUsed = Math.min(100, (localConfig.todayLossUsd / maxDailyLossAllowed) * 100);
  const totalDrawdownPctUsed = Math.min(
    100,
    (localConfig.totalDrawdownUsd / maxTotalDrawdownAllowed) * 100
  );

  const handleSelectSize = (size: number) => {
    const updated: PropAccountConfig = {
      ...localConfig,
      accountSize: size,
      currentBalance: size,
      currentEquity: size,
      todayLossUsd: 0,
      totalDrawdownUsd: 0,
      isCircuitBreakerTripped: false,
      lockoutReason: undefined,
    };
    setLocalConfig(updated);
    savePropAccount(updated);
    onUpdateConfig(updated);
  };

  const handleSimulateWin = () => {
    // 0.01 micro lot win (~$5.00)
    const winAmount = 5.0;
    const updated: PropAccountConfig = {
      ...localConfig,
      currentBalance: localConfig.currentBalance + winAmount,
      currentEquity: localConfig.currentEquity + winAmount,
      todayLossUsd: Math.max(0, localConfig.todayLossUsd - winAmount),
    };
    audioAlertEngine.playSuccessChime();
    setLocalConfig(updated);
    savePropAccount(updated);
    onUpdateConfig(updated);
  };

  const handleSimulateLoss = () => {
    // 0.01 micro lot standard max risk ($2.00)
    const lossAmount = 2.0;
    const newTodayLoss = localConfig.todayLossUsd + lossAmount;
    const newTotalDrawdown = localConfig.totalDrawdownUsd + lossAmount;

    let isTripped = localConfig.isCircuitBreakerTripped;
    let reason = localConfig.lockoutReason;

    if (newTodayLoss >= maxDailyLossAllowed) {
      isTripped = true;
      reason = 'DAILY LOSS LIMIT BREACHED';
      audioAlertEngine.playWarningChime();
    }

    const updated: PropAccountConfig = {
      ...localConfig,
      currentBalance: localConfig.currentBalance - lossAmount,
      currentEquity: localConfig.currentEquity - lossAmount,
      todayLossUsd: newTodayLoss,
      totalDrawdownUsd: newTotalDrawdown,
      isCircuitBreakerTripped: isTripped,
      lockoutReason: reason,
    };

    setLocalConfig(updated);
    savePropAccount(updated);
    onUpdateConfig(updated);
  };

  const handleToggleBreaker = () => {
    const updated: PropAccountConfig = {
      ...localConfig,
      isCircuitBreakerTripped: !localConfig.isCircuitBreakerTripped,
      lockoutReason: !localConfig.isCircuitBreakerTripped
        ? 'MANUAL DESK LOCKOUT TRIGGERED'
        : undefined,
    };
    if (!localConfig.isCircuitBreakerTripped) {
      audioAlertEngine.playWarningChime();
    } else {
      audioAlertEngine.playSuccessChime();
    }
    setLocalConfig(updated);
    savePropAccount(updated);
    onUpdateConfig(updated);
  };

  const handleResetDay = () => {
    const updated: PropAccountConfig = {
      ...localConfig,
      todayLossUsd: 0,
      isCircuitBreakerTripped: false,
      lockoutReason: undefined,
    };
    audioAlertEngine.playSuccessChime();
    setLocalConfig(updated);
    savePropAccount(updated);
    onUpdateConfig(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Prop Firm Drawdown Guard
                </h3>
                {localConfig.isCircuitBreakerTripped ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                    <Lock className="w-3 h-3 mr-1" /> DESK LOCKED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <Unlock className="w-3 h-3 mr-1" /> ACTIVE & PROTECTED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Enforces strict institutional daily 4% loss limits and 8% max drawdown caps.
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

        {/* Account Size Selector */}
        <div className="my-4">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
            Target Funded Account Size
          </label>
          <div className="grid grid-cols-5 gap-2">
            {ACCOUNT_SIZES.map((size) => {
              const active = localConfig.accountSize === size;
              return (
                <button
                  key={size}
                  onClick={() => handleSelectSize(size)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold font-mono transition border ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  ${(size / 1000).toFixed(0)}K
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* Daily Drawdown Gauge */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">Daily Loss Budget (4%)</span>
              <span className="text-xs font-bold font-mono text-cyan-300">
                ${localConfig.todayLossUsd.toFixed(2)} / ${maxDailyLossAllowed.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  dailyLossPctUsed > 75
                    ? 'bg-rose-500'
                    : dailyLossPctUsed > 40
                    ? 'bg-amber-500'
                    : 'bg-cyan-500'
                }`}
                style={{ width: `${dailyLossPctUsed}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Remaining daily risk buffer: ${(maxDailyLossAllowed - localConfig.todayLossUsd).toFixed(2)}
            </p>
          </div>

          {/* Max Trailing Drawdown Gauge */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">Max Trailing Drawdown (8%)</span>
              <span className="text-xs font-bold font-mono text-amber-300">
                ${localConfig.totalDrawdownUsd.toFixed(2)} / ${maxTotalDrawdownAllowed.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  totalDrawdownPctUsed > 75
                    ? 'bg-rose-500'
                    : totalDrawdownPctUsed > 40
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${totalDrawdownPctUsed}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Drawdown buffer remaining: ${(maxTotalDrawdownAllowed - localConfig.totalDrawdownUsd).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Circuit Breaker Status Banner */}
        {localConfig.isCircuitBreakerTripped && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold">CIRCUIT BREAKER LOCKOUT ACTIVE</p>
              <p className="text-[11px] text-rose-300/90">
                {localConfig.lockoutReason || 'Daily risk threshold engaged. Market execution is paused to protect evaluation capital.'}
              </p>
            </div>
          </div>
        )}

        {/* Practice & Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateWin}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition flex items-center space-x-1"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Simulate Win (+$5.00)</span>
            </button>
            <button
              onClick={handleSimulateLoss}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition flex items-center space-x-1"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Simulate Loss (-$2.00)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleBreaker}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 border ${
                localConfig.isCircuitBreakerTripped
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              {localConfig.isCircuitBreakerTripped ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Manual Unlock</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Manual Lockout</span>
                </>
              )}
            </button>
            <button
              onClick={handleResetDay}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
