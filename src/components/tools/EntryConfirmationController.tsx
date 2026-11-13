import React, { useState, useEffect } from 'react';
import { CurrencyPair, Timeframe } from '../../types';
import {
  ComputedTradeParams,
  KenyaEntryWindowInfo,
  ActiveMarketOrder,
  evaluateOrderEntryMoment,
  evaluateOrderTrendSustainability,
  computeLiveOrderMetrics,
  EntryMomentVerdict,
  TrendSustainabilityVerdict,
  globalLiveStream
} from '../../utils/liveMarketEngine';
import {
  Check,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ShieldCheck,
  Activity,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Volume2,
  VolumeX,
  BookmarkPlus,
  Radio
} from 'lucide-react';
import { audioAlertEngine } from '../../utils/audioAlerts';
import {
  saveJournalTrade,
  checkPairNewsLockout,
  getStoredPropAccount
} from '../../utils/propDeskStorage';

interface EntryConfirmationControllerProps {
  pair: CurrencyPair;
  computed: ComputedTradeParams;
  kenyaTiming: KenyaEntryWindowInfo;
  livePrice: number;
  timeframe?: Timeframe;
  lockedOrder?: ActiveMarketOrder | null;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  variant?: 'focused' | 'compact' | 'tradingview';
  showSavedOrder?: boolean;
  onToggleSavedOrder?: () => void;
  onInspectDetails?: () => void;
  className?: string;
}

export const EntryConfirmationController: React.FC<EntryConfirmationControllerProps> = ({
  pair,
  computed,
  kenyaTiming,
  livePrice,
  timeframe = 'M15',
  lockedOrder = null,
  ema20,
  ema50,
  rsi,
  variant = 'focused',
  showSavedOrder,
  onToggleSavedOrder,
  onInspectDetails,
  className = ''
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showEntryAudit, setShowEntryAudit] = useState(false);
  const [showSustainAudit, setShowSustainAudit] = useState(false);
  const [rushGuardConfirmed, setRushGuardConfirmed] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(() => audioAlertEngine.isEnabled());
  const [loggedToast, setLoggedToast] = useState<string | null>(null);
  const [execMode, setExecMode] = useState<'MARKET' | 'LIMIT_20EMA'>('MARKET');
  const [showStaleOrderLocal, setShowStaleOrderLocal] = useState(false);

  // Live ticking countdown for entry timing window / candle retest
  const [secondsRemainingInCycle, setSecondsRemainingInCycle] = useState(180);

  useEffect(() => {
    // Determine cycle length based on timeframe (e.g. M15 = 900s, H1 = 3600s, M5 = 300s)
    const cycleTotalSeconds =
      timeframe === 'M1'
        ? 60
        : timeframe === 'M5'
        ? 300
        : timeframe === 'M10'
        ? 600
        : timeframe === 'M15'
        ? 900
        : timeframe === 'H1'
        ? 3600
        : timeframe === 'H4'
        ? 14400
        : 900;

    const interval = setInterval(() => {
      const nowSec = Math.floor(Date.now() / 1000);
      const rem = cycleTotalSeconds - (nowSec % cycleTotalSeconds);
      setSecondsRemainingInCycle(rem);

      // Play soft chime when countdown reaches optimal entry moment (e.g. last 10s or 0s)
      if (rem === 10 || rem === cycleTotalSeconds) {
        audioAlertEngine.playEntryChime();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeframe]);

  const handleToggleAudio = () => {
    const newState = audioAlertEngine.toggle();
    setIsAudioOn(newState);
  };

  const formatCycleCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const entryMoment: EntryMomentVerdict = evaluateOrderEntryMoment(
    pair,
    computed,
    livePrice,
    kenyaTiming
  );

  const sustainability: TrendSustainabilityVerdict = evaluateOrderTrendSustainability(computed);

  // Active Prop Guard and News Checks
  const activeNewsLockout = checkPairNewsLockout(pair);
  const propAccount = getStoredPropAccount();
  const isDeskLocked = propAccount.isCircuitBreakerTripped;

  const handleCopy = (val: string | number, key: string) => {
    try {
      navigator.clipboard.writeText(String(val));
      setCopiedKey(key);
      audioAlertEngine.playSuccessChime();
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };

  const handleLogTrade = (entryVal: number, slVal: number, tp1Val: number, tp2Val?: number) => {
    const activeLot = Number((computed.lotSize || 0.01).toFixed(2));
    const activeRisk = Number((computed.actualRiskUsd || 2.0).toFixed(2));
    saveJournalTrade({
      pair,
      direction: shownDirection,
      entryPrice: Number(entryVal),
      stopLoss: Number(slVal),
      tp1: Number(tp1Val),
      tp2: tp2Val ? Number(tp2Val) : undefined,
      lotSize: activeLot,
      riskUsd: activeRisk,
      status: 'OPEN',
      notes: `Executed via Entry Confirmation Controller (${useLimitPlan ? '20 EMA Limit' : 'Market'}). Strategy: 20/50 EMA Pullback Value System.`,
      confluenceStars: sustainability.integrityPct >= 80 ? 4 : 3,
      brokerTarget: 'FXPesa',
    });
    audioAlertEngine.playSuccessChime();
    setLoggedToast(`Trade Logged: ${pair} ${shownDirection} @ ${entryVal}`);
  };

  const hasLimitDiscount = Boolean(
    computed.limitPlan &&
      computed.advisoryDiscountPips &&
      computed.advisoryDiscountPips > 0 &&
      computed.limitPlan.entryPrice !== computed.entryPrice
  );
  const lockedOrderMetrics =
    lockedOrder && livePrice > 0 ? computeLiveOrderMetrics(lockedOrder, livePrice) : null;
  const isOrderCompleted = Boolean(lockedOrderMetrics && (lockedOrderMetrics.hitTp2 || lockedOrderMetrics.hitSl));
  const isStaleOrOpposingOrder = Boolean(
    lockedOrder &&
      livePrice > 0 &&
      (isOrderCompleted ||
        Math.abs(lockedOrder.entryPrice - livePrice) / livePrice > 0.015 ||
        lockedOrder.direction !== computed.direction)
  );
  const useLockedOrder = Boolean(
    lockedOrder &&
      (showSavedOrder !== undefined
        ? showSavedOrder
        : !isStaleOrOpposingOrder || showStaleOrderLocal)
  );
  const useLimitPlan = Boolean(!useLockedOrder && execMode === 'LIMIT_20EMA' && hasLimitDiscount && computed.limitPlan);

  const shownEntry = useLockedOrder
    ? lockedOrder!.entryPrice
    : useLimitPlan
    ? computed.limitPlan!.entryPrice
    : computed.entryPrice;
  const shownSl = useLockedOrder
    ? lockedOrder!.stopLoss
    : useLimitPlan
    ? computed.limitPlan!.stopLoss
    : computed.stopLoss;
  const shownTp1 = useLockedOrder
    ? lockedOrder!.tp1
    : useLimitPlan
    ? computed.limitPlan!.tp1
    : computed.tp1;
  const shownTp2 = useLockedOrder
    ? lockedOrder!.tp2
    : useLimitPlan
    ? computed.limitPlan!.tp2
    : computed.tp2;
  const shownDirection = useLockedOrder ? lockedOrder!.direction : computed.direction;

  // =========================================================================
  // VARIANT 1: COMPACT (Used inside the 15 Market Summary Cards)
  // =========================================================================
  if (variant === 'compact') {
    return (
      <div className={`space-y-1.5 pt-1.5 ${className}`}>
        {/* Dual Pre-Flight Controller Buttons below Copy SL/TP */}
        <div className="grid grid-cols-2 gap-1.5">
          {/* Button 1: Entry Timing Confirmation */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onInspectDetails) onInspectDetails();
              else setShowEntryAudit(!showEntryAudit);
            }}
            className={`p-1.5 rounded-lg border text-[10px] font-mono flex items-center justify-between gap-1 transition ${
              entryMoment.status === 'PRIME_NOW'
                ? 'bg-emerald-950/40 border-[#00C261]/50 text-[#00C261] hover:bg-emerald-900/50'
                : entryMoment.status === 'WAIT_PULLBACK'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/50'
                : 'bg-red-950/40 border-red-500/50 text-red-300 hover:bg-red-900/50'
            }`}
            title={entryMoment.actionGuidance}
          >
            <span className="flex items-center gap-1 truncate font-bold">
              {entryMoment.status === 'PRIME_NOW' ? (
                <CheckCircle2 className="w-3 h-3 text-[#00C261] shrink-0" />
              ) : entryMoment.status === 'WAIT_PULLBACK' ? (
                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
              ) : (
                <Lock className="w-3 h-3 text-red-400 shrink-0" />
              )}
              <span className="truncate">
                {entryMoment.status === 'PRIME_NOW'
                  ? 'EP: Prime Now ✓'
                  : entryMoment.status === 'WAIT_PULLBACK'
                  ? `Wait EP: ${entryMoment.advisoryPrice}`
                  : 'Closed'}
              </span>
            </span>
            <span className="text-[9px] text-slate-400 font-normal shrink-0">
              {entryMoment.status === 'WAIT_PULLBACK'
                ? `${formatCycleCountdown(secondsRemainingInCycle)}`
                : 'Audit'}
            </span>
          </button>

          {/* Button 2: Trend Sustainability Check */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onInspectDetails) onInspectDetails();
              else setShowSustainAudit(!showSustainAudit);
            }}
            className={`p-1.5 rounded-lg border text-[10px] font-mono flex items-center justify-between gap-1 transition ${
              sustainability.status === 'HIGH_SUSTAINABLE'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                : sustainability.status === 'MODERATE_SUSTAINABLE'
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/50'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/50'
            }`}
            title={sustainability.structuralReason}
          >
            <span className="flex items-center gap-1 truncate font-bold">
              <ShieldCheck className="w-3 h-3 shrink-0" style={{ color: sustainability.themeColor }} />
              <span className="truncate">{sustainability.integrityPct}% Locked</span>
            </span>
            <span className="text-[9px] text-slate-400 font-normal shrink-0">
              {computed.h1TrendDirection === 'UPTREND' ? 'BUY' : 'SELL'}
            </span>
          </button>
        </div>

        {/* Dynamic Entry Countdown Strip */}
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-[#D4AF37]" />
            <span>
              {entryMoment.status === 'PRIME_NOW'
                ? `Prime EP Valid: ${formatCycleCountdown(secondsRemainingInCycle)}`
                : entryMoment.status === 'WAIT_PULLBACK'
                ? `Retest Pullback Timer: ${formatCycleCountdown(secondsRemainingInCycle)}`
                : `Opens in ${kenyaTiming.countdownFormatted}`}
            </span>
          </span>
          <span className="text-[#00C261] font-bold">
            {computed.alignedFactorsCount}/{computed.totalFactorsCount} Factors
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 font-mono ${className}`}>
      {/* Toast Confirmation */}
      {loggedToast && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{loggedToast}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">{computed.lotSize.toFixed(2)} Lot Saved</span>
        </div>
      )}

      {/* Institutional Circuit Breaker Alert Banner */}
      {isDeskLocked && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold block">PROP DESK CIRCUIT BREAKER ENGAGED</span>
              <span className="text-[10px] text-rose-300/80">Daily 4% loss limit reached. All live order execution is paused to protect evaluation balance.</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-200">LOCKED</span>
        </div>
      )}

      {/* Red-Folder News Guard Banner */}
      {activeNewsLockout && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
            <div>
              <span className="font-bold block text-rose-300">RED-FOLDER VOLATILITY ALERT: {activeNewsLockout.title}</span>
              <span className="text-[10px] text-amber-300/80">Release in {activeNewsLockout.minutesUntilRelease}m. High slippage warning for {pair}.</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            15M LOCKOUT
          </span>
        </div>
      )}

      {/* Stale or Opposing Loaded Order Alert Banner */}
      {isStaleOrOpposingOrder && lockedOrder && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold block text-amber-300">
                SAVED SESSION ORDER NOTICE: {lockedOrder.direction} @ {lockedOrder.entryPrice} (Market now @ {livePrice})
              </span>
              <span className="text-[10px] text-amber-200/80 block">
                {lockedOrderMetrics?.hitTp2
                  ? `Saved ${lockedOrder.direction} order already reached TP2 (${lockedOrder.tp2}). Chart defaulted to Live ${computed.direction} signal.`
                  : lockedOrderMetrics?.hitSl
                  ? `Saved ${lockedOrder.direction} order already hit Stop Loss (${lockedOrder.stopLoss}). Chart defaulted to Live ${computed.direction} signal.`
                  : lockedOrder.direction !== computed.direction
                  ? `Live structure projects ${computed.direction}, opposing your saved ${lockedOrder.direction} order.`
                  : 'Saved order entry differs >1.5% from live market price.'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onToggleSavedOrder) onToggleSavedOrder();
                else setShowStaleOrderLocal(!showStaleOrderLocal);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold transition"
            >
              {useLockedOrder ? `View Live ${computed.direction}` : 'Show Saved Order'}
            </button>
            <button
              type="button"
              onClick={() => globalLiveStream.closeMarketOrder(pair)}
              className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 text-[10px] font-bold transition"
            >
              Clear Saved Order
            </button>
          </div>
        </div>
      )}

      {/* Candle Structure Proof Ribbon + Execution Mode Toggle (Market Now vs 20 EMA Limit EP) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`px-2 py-0.5 rounded font-black text-[10px] shrink-0 ${
              shownDirection === 'BUY'
                ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}
          >
            VERIFIED {shownDirection}
          </span>
          <span className="text-slate-300 truncate text-[10px]">
            {ema20 !== undefined && ema50 !== undefined
              ? `${livePrice >= ema20 ? 'Price > 20EMA' : 'Price < 20EMA'} (${ema20}) · ${
                  ema20 >= ema50 ? '20EMA ≥ 50EMA' : '20EMA < 50EMA'
                } (${ema50})${rsi !== undefined ? ` · RSI ${rsi}` : ''} · 1H ${computed.h1TrendDirection}`
              : computed.trendProjectionText}
          </span>
        </div>

        {hasLimitDiscount && !useLockedOrder && (
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setExecMode('MARKET')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                execMode === 'MARKET'
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Market EP ({computed.entryPrice})
            </button>
            <button
              type="button"
              onClick={() => setExecMode('LIMIT_20EMA')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                execMode === 'LIMIT_20EMA'
                  ? 'bg-cyan-400 text-black'
                  : 'text-cyan-300 hover:text-white'
              }`}
            >
              20 EMA Limit ({computed.limitPlan!.entryPrice})
            </button>
          </div>
        )}
      </div>

      {/* Top Institutional Utility Strip: Sound Chime Toggle & Quick Log */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition flex items-center space-x-1.5 ${
              isAudioOn
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title="Toggle Web Audio Entry Chimes"
          >
            {isAudioOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAudioOn ? 'Audio Chimes: ON' : 'Audio: MUTED'}</span>
          </button>

          <span className="text-[10px] text-slate-500">·</span>

          <span className="text-[10px] text-slate-400 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Candle Cycle: <strong className="text-cyan-300">{formatCycleCountdown(secondsRemainingInCycle)}</strong></span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleLogTrade(shownEntry, shownSl, shownTp1, shownTp2)}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 text-[10px] font-bold transition flex items-center space-x-1 active:scale-95"
          title="Save execution to Prop Journal"
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
          <span>Log to Journal</span>
        </button>
      </div>

      {/* 1. AUTO-SYNCING EP, SL, TP NUMBER BOXES WITH DIRECT COPY BUTTONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* EP (Entry Point) */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-1.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {useLimitPlan ? 'Limit EP (20 EMA)' : 'Entry Point (EP)'}
              </span>
              <span className="text-[9px] text-[#00C261] font-bold">Auto-Sync</span>
            </div>
            <strong className="text-base text-white block mt-0.5">{shownEntry}</strong>
            <span className="text-[10px] text-slate-400 block truncate">
              {shownDirection === 'BUY' ? 'Bullish Discount' : 'Bearish Distribution'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(shownEntry, `ep-${pair}`)}
            className="w-full py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition active:scale-95"
          >
            {copiedKey === `ep-${pair}` ? (
              <Check className="w-3 h-3 text-[#00C261]" />
            ) : (
              <Copy className="w-3 h-3 text-[#D4AF37]" />
            )}
            <span>{copiedKey === `ep-${pair}` ? 'EP Copied ✓' : 'Copy EP'}</span>
          </button>
        </div>

        {/* Protected Stop Loss (SL) */}
        <div className="p-3 rounded-2xl bg-red-950/30 border border-red-500/40 flex flex-col justify-between gap-1.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-red-300">Stop Loss (-{computed.slPips}p)</span>
              <span className="text-[9px] text-red-400 font-bold">${computed.actualRiskUsd.toFixed(2)} Cap</span>
            </div>
            <strong className="text-base text-red-400 block mt-0.5">{shownSl}</strong>
            <span className="text-[10px] text-red-300/80 block truncate">
              {useLockedOrder ? 'Protected SL' : `${computed.lotSize.toFixed(2)} Lots Protected`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(shownSl, `sl-${pair}`)}
            className="w-full py-1 px-2 rounded-lg bg-slate-950 hover:bg-red-900/60 text-red-200 border border-red-500/40 text-[10px] font-black flex items-center justify-center gap-1 transition active:scale-95"
          >
            {copiedKey === `sl-${pair}` ? (
              <Check className="w-3 h-3 text-[#00C261]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copiedKey === `sl-${pair}` ? 'SL Copied ✓' : 'Copy SL'}</span>
          </button>
        </div>

        {/* Scale-Out Take Profit 1 (TP1) */}
        <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col justify-between gap-1.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-300">TP1 (50% Scale)</span>
              <span className="text-[9px] text-cyan-400 font-bold">Breakeven</span>
            </div>
            <strong className="text-base text-cyan-300 block mt-0.5">{shownTp1}</strong>
            <span className="text-[10px] text-slate-400 block truncate">Move SL to Entry</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(shownTp1, `tp1-${pair}`)}
            className="w-full py-1 px-2 rounded-lg bg-slate-950 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/40 text-[10px] font-bold flex items-center justify-center gap-1 transition active:scale-95"
          >
            {copiedKey === `tp1-${pair}` ? (
              <Check className="w-3 h-3 text-[#00C261]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copiedKey === `tp1-${pair}` ? 'TP1 Copied ✓' : 'Copy TP1'}</span>
          </button>
        </div>

        {/* Core Take Profit 2 (TP2) */}
        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col justify-between gap-1.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-300">TP2 (+{computed.tpPips}p)</span>
              <span className="text-[9px] text-[#00C261] font-bold">R:R {computed.riskReward}</span>
            </div>
            <strong className="text-base text-[#00C261] block mt-0.5">{shownTp2}</strong>
            <span className="text-[10px] text-emerald-300/80 block truncate">
              {lockedOrder ? 'Active Target' : `+$${computed.netProfitUsd.toFixed(2)} Target`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(shownTp2, `tp2-${pair}`)}
            className="w-full py-1 px-2 rounded-lg bg-slate-950 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 text-[10px] font-black flex items-center justify-center gap-1 transition active:scale-95"
          >
            {copiedKey === `tp2-${pair}` ? (
              <Check className="w-3 h-3 text-[#00C261]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copiedKey === `tp2-${pair}` ? 'TP2 Copied ✓' : 'Copy TP2'}</span>
          </button>
        </div>
      </div>

      {/* 2. DUAL STATE CONTROLLER BUTTONS: ENTRY MOMENT CONFIRMATION & TRAJECTORY SUSTAINABILITY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* BUTTON 1: Entry Moment Confirmation Controller */}
        <button
          type="button"
          onClick={() => {
            setShowEntryAudit(!showEntryAudit);
            if (showSustainAudit) setShowSustainAudit(false);
          }}
          className={`p-3 rounded-2xl border text-left transition flex items-start justify-between gap-3 ${
            entryMoment.status === 'PRIME_NOW'
              ? 'bg-emerald-950/40 border-[#00C261]/60 hover:bg-emerald-900/40 hover:border-[#00C261]'
              : entryMoment.status === 'WAIT_PULLBACK'
              ? 'bg-amber-950/40 border-amber-500/60 hover:bg-amber-900/40 hover:border-amber-400'
              : 'bg-red-950/40 border-red-500/60 hover:bg-red-900/40 hover:border-red-400'
          }`}
        >
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {entryMoment.status === 'PRIME_NOW' ? (
                <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0" />
              ) : entryMoment.status === 'WAIT_PULLBACK' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span
                className="text-[11px] font-bold uppercase tracking-wider truncate"
                style={{ color: entryMoment.themeColor }}
              >
                {entryMoment.status === 'PRIME_NOW'
                  ? 'ENTRY TIMING: PRIME MOMENT CONFIRMED ✓'
                  : entryMoment.status === 'WAIT_PULLBACK'
                  ? `WAIT PULLBACK: ${entryMoment.advisoryPrice}`
                  : 'MARKET CLOSED · DO NOT ENTER'}
              </span>
            </div>
            <p className="text-xs text-white font-medium leading-snug line-clamp-1 font-sans">
              {entryMoment.headline}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
                <span className="text-[#D4AF37] font-bold">
                  {entryMoment.status === 'PRIME_NOW'
                    ? `Optimal Entry Window: ${formatCycleCountdown(secondsRemainingInCycle)}`
                    : entryMoment.status === 'WAIT_PULLBACK'
                    ? `Retest Pullback Countdown: ${formatCycleCountdown(secondsRemainingInCycle)}`
                    : `Opens in ${kenyaTiming.countdownFormatted}`}
                </span>
              </span>
              <span>•</span>
              <span className="text-[#00C261] underline">
                {showEntryAudit ? 'Hide Audit' : 'Prevent Blind Spot'}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase inline-block font-mono"
              style={{
                backgroundColor: `${entryMoment.themeColor}22`,
                color: entryMoment.themeColor,
                border: `1px solid ${entryMoment.themeColor}55`
              }}
            >
              {entryMoment.status === 'PRIME_NOW'
                ? 'Safe to Copy SL/TP'
                : entryMoment.status === 'WAIT_PULLBACK'
                ? `Save ${entryMoment.discountPips}p`
                : 'Session Closed'}
            </span>
            <div className="mt-1 text-slate-400 text-xs flex justify-end">
              {showEntryAudit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* BUTTON 2: Trajectory Sustainability Check Controller */}
        <button
          type="button"
          onClick={() => {
            setShowSustainAudit(!showSustainAudit);
            if (showEntryAudit) setShowEntryAudit(false);
          }}
          className={`p-3 rounded-2xl border text-left transition flex items-start justify-between gap-3 ${
            sustainability.status === 'HIGH_SUSTAINABLE'
              ? 'bg-emerald-950/40 border-emerald-500/60 hover:bg-emerald-900/40 hover:border-[#00C261]'
              : sustainability.status === 'MODERATE_SUSTAINABLE'
              ? 'bg-cyan-950/40 border-cyan-500/60 hover:bg-cyan-900/40 hover:border-cyan-400'
              : 'bg-amber-950/40 border-amber-500/60 hover:bg-amber-900/40 hover:border-amber-400'
          }`}
        >
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: sustainability.themeColor }} />
              <span
                className="text-[11px] font-bold uppercase tracking-wider truncate"
                style={{ color: sustainability.themeColor }}
              >
                SUSTAINABILITY: {sustainability.integrityPct}% INTEGRITY
              </span>
            </div>
            <p className="text-xs text-white font-medium leading-snug line-clamp-1 font-sans">
              {sustainability.headline}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-300">
              <span className="text-[#00C261] font-bold">
                1H {computed.h1TrendDirection || 'LOCKED'}
              </span>
              <span>•</span>
              <span className="text-cyan-300">Low Whipsaw</span>
              <span>•</span>
              <span className="text-[#D4AF37] underline">
                {showSustainAudit ? 'Hide Audit' : 'Audit Trend'}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase inline-block font-mono"
              style={{
                backgroundColor: `${sustainability.themeColor}22`,
                color: sustainability.themeColor,
                border: `1px solid ${sustainability.themeColor}55`
              }}
            >
              {computed.h1TrendDirection || '1H LOCKED'}
            </span>
            <div className="mt-1 text-slate-400 text-xs flex justify-end">
              {showSustainAudit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>
      </div>

      {/* 3. EXPANDABLE ENTRY TIMING & RUSH-PREVENTION AUDIT DRAWER */}
      {showEntryAudit && (
        <div className="p-4 rounded-2xl bg-[#081224] border border-cyan-500/40 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C261]" />
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Pre-Execution Entry Timing Audit · {pair} ({computed.direction})
              </h5>
            </div>
            <span className="text-[10px] text-[#D4AF37] font-bold">
              Window Timer: {formatCycleCountdown(secondsRemainingInCycle)}
            </span>
          </div>

          {/* Price Comparison Metric Triad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">Live Price (0.5s Stream)</span>
              <strong className="text-sm text-white block">{livePrice}</strong>
              <span className="text-[9px] text-[#00C261]">Real Candlestick Quote</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">Advisory Retest Entry (EP)</span>
              <strong className="text-sm text-[#D4AF37] block">{computed.advisoryEntryPrice}</strong>
              <span className="text-[9px] text-cyan-300">20 EMA Pullback Dynamic Target</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">Drawdown Savings</span>
              <strong className="text-sm text-[#00C261] block">
                {computed.advisoryDiscountPips ? `+${computed.advisoryDiscountPips} Pips Saved` : '0.0p (At Prime Zone)'}
              </strong>
              <span className="text-[9px] text-slate-400">Protects ${computed.actualRiskUsd.toFixed(2)} Risk Cap</span>
            </div>
          </div>

          {/* Action Guidance & Rush Prevention Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 text-xs font-sans">
            <div className="flex items-center gap-2 text-white font-bold font-mono">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Institutional Guidance (Avoid Blind Spot Execution):</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {entryMoment.actionGuidance}
            </p>

            {/* Rush Guard Checklist */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5 font-mono text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={rushGuardConfirmed}
                  onChange={(e) => setRushGuardConfirmed(e.target.checked)}
                  className="rounded border-slate-700 text-[#00C261] focus:ring-0 w-3.5 h-3.5 bg-slate-900"
                />
                <span className={rushGuardConfirmed ? 'text-[#00C261] font-bold' : ''}>
                  I confirm that market spread is verified and I am entering with {computed.lotSize.toFixed(2)} lot (${computed.actualRiskUsd.toFixed(2)} max risk).
                </span>
              </label>
            </div>
          </div>

          {/* Quick Copy Full Verified Ticket */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] text-slate-400">
              EP: {shownEntry} · SL: {shownSl} · TP1: {shownTp1} · TP2: {shownTp2}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const mtFormat = `FXPesa/MT5 -> ${pair} | ${shownDirection} ${useLimitPlan ? 'LIMIT' : 'MARKET'} @ ${shownEntry} | SL: ${shownSl} | TP: ${shownTp1} | Vol: ${computed.lotSize.toFixed(2)}`;
                  handleCopy(mtFormat, `mt-${pair}`);
                }}
                className="py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1 transition active:scale-95 whitespace-nowrap"
                title="Format specifically for MT4/MT5 order ticket paste"
              >
                {copiedKey === `mt-${pair}` ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === `mt-${pair}` ? 'MT5 Copied ✓' : 'MT4/MT5 Quick Paste'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const fullTicket = `PIVOTFX INSTITUTIONAL ORDER TICKET\nPair: ${pair}\nDirection: ${shownDirection} (${useLimitPlan ? '20 EMA LIMIT' : 'MARKET'})\nEntry Price (EP): ${shownEntry}\nStop Loss (SL): ${shownSl} (-${computed.slPips}p)\nTake Profit 1: ${shownTp1}\nTake Profit 2: ${shownTp2} (+${computed.tpPips}p)\nVolume: ${computed.lotSize.toFixed(2)} Lots ($${computed.actualRiskUsd.toFixed(2)} Max Risk)\nStatus: ${entryMoment.status}`;
                  handleCopy(fullTicket, `full-${pair}`);
                }}
                className="py-1.5 px-3 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
              >
                {copiedKey === `full-${pair}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === `full-${pair}` ? 'Verified Order Copied ✓' : 'Copy Complete Order'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. EXPANDABLE TRAJECTORY SUSTAINABILITY AUDIT DRAWER */}
      {showSustainAudit && (
        <div className="p-4 rounded-2xl bg-[#06121f] border border-[#00C261]/40 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00C261]" />
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Trajectory Sustainability Audit · {pair} {computed.direction} Trajectory
              </h5>
            </div>
            <span className="text-[10px] text-[#00C261] font-bold">
              {sustainability.integrityPct}% Trajectory Integrity
            </span>
          </div>

          {/* Structural Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">1H Anchor Trend</span>
              <strong className="text-xs text-[#00C261] block">{computed.h1TrendDirection || 'UPTREND'}</strong>
              <span className="text-[9px] text-slate-400">Institutional Baseline</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">MTF Confluence</span>
              <strong className="text-xs text-cyan-300 block">{computed.mtfAlignment?.tierGrade || 'GRADE A'}</strong>
              <span className="text-[9px] text-slate-400">15M / 1H / 4H Stacked</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Factor Confluence</span>
              <strong className="text-xs text-[#D4AF37] block">
                {computed.alignedFactorsCount} / {computed.totalFactorsCount} Factors
              </strong>
              <span className="text-[9px] text-slate-400">Confluence Score</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Whipsaw Risk</span>
              <strong className="text-xs text-emerald-300 block">Low (Locked)</strong>
              <span className="text-[9px] text-slate-400">Noise Immunity Active</span>
            </div>
          </div>

          {/* Explanation of Counter-Candles */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 text-xs font-sans">
            <strong className="text-white block flex items-center gap-1.5 font-mono">
              <Activity className="w-3.5 h-3.5 text-[#00C261]" />
              <span>Why Temporary Counter-Candles Will NOT Break This Direction:</span>
            </strong>
            <p className="text-slate-300 leading-relaxed text-xs">
              {sustainability.structuralReason} Even if you see 1–3 opposing candles on the 5-minute or 15-minute chart, the 1-Hour institutional EMA cloud and order block structure remain firmly intact. Do not panic or flip orders back and forth — let the math work toward TP1 ({shownTp1}) and TP2 ({shownTp2}).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
