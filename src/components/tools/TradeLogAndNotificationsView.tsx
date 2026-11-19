import React, { useState, useEffect } from 'react';
import {
  BrokerId,
  CurrencyPair,
  EaCircuitBreakerState,
  EaLedgerStats,
  EaSignalLedgerEntry,
  PendingLimitOrder,
  SuggestedSignalLogEntry,
  Timeframe
} from '../../types';
import {
  ActiveMarketOrder,
  ClosedOrderHistoryEntry,
  MarketScanData,
  RiskManagementConfig,
  globalLiveStream,
  computeLiveOrderMetrics,
  evaluatePortfolioRiskExposure,
  getCurrentMacroContext,
  getPairSpecs,
  positionRiskStore,
  resolveMarketDirection
} from '../../utils/liveMarketEngine';
import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Copy,
  History,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Volume2,
  VolumeX,
  XCircle
} from 'lucide-react';

interface PositionCoachAdvice {
  source: 'gemini-4-hydrogen' | 'gemini-3.8-flash' | 'quantitative-engine';
  actionBadge: string;
  headline: string;
  recommendation: string;
  suggestedStopLoss: number;
  suggestedTakeProfit: number;
  keyInvalidationLevel: number;
  syncedAt: string;
}

interface TradeLogAndNotificationsViewProps {
  onSelectPairForChart?: (pair: CurrencyPair) => void;
}

const ALL_MARKET_PAIRS: CurrencyPair[] = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'GBP/JPY',
  'USD/CHF',
  'EUR/JPY',
  'XAU/USD',
  'AUD/USD',
  'USD/CAD',
  'BTC/USD',
  'ETH/USD',
  'US30',
  'NAS100',
  'GER40',
  'USOIL'
];

export const TradeLogAndNotificationsView: React.FC<TradeLogAndNotificationsViewProps> = ({
  onSelectPairForChart
}) => {
  const initialState = globalLiveStream.getState();
  const [markets, setMarkets] = useState<MarketScanData[]>(initialState.markets);
  const [activeBroker, setActiveBroker] = useState<BrokerId>(initialState.activeBroker);
  const [activeOrders, setActiveOrders] = useState<Partial<Record<CurrencyPair, ActiveMarketOrder>>>(
    initialState.activeOrders
  );
  const [orderHistory, setOrderHistory] = useState<ClosedOrderHistoryEntry[]>(
    initialState.orderHistory
  );
  const [suggestedSignals, setSuggestedSignals] = useState<SuggestedSignalLogEntry[]>(
    initialState.suggestedSignals
  );
  const [eaAutoPilot, setEaAutoPilot] = useState<boolean>(initialState.eaAutoPilot);
  const [eaLedger, setEaLedger] = useState<EaSignalLedgerEntry[]>(initialState.eaLedger);
  const [eaLedgerStats, setEaLedgerStats] = useState<EaLedgerStats>(initialState.eaLedgerStats);
  const [pendingLimits, setPendingLimits] = useState<PendingLimitOrder[]>(initialState.pendingLimits);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(
    initialState.soundAlertsEnabled
  );
  const [eaCircuitBreaker, setEaCircuitBreaker] = useState<EaCircuitBreakerState>(
    initialState.eaCircuitBreaker
  );

  const [signalFilter, setSignalFilter] = useState<'ALL' | 'SUGGESTED' | 'PLACED_WITH_BROKER'>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Manual broker execution form (e.g. if user placed a trade directly on broker with custom entry/SL/TP)
  const [showManualBrokerForm, setShowManualBrokerForm] = useState<boolean>(false);
  const [formPair, setFormPair] = useState<CurrencyPair>('USD/CAD');
  const [formDirection, setFormDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [formEntry, setFormEntry] = useState<string>('');
  const [formSl, setFormSl] = useState<string>('');
  const [formTp, setFormTp] = useState<string>('');
  const [formLot, setFormLot] = useState<number>(0.01);
  const [formNote, setFormNote] = useState<string>('');

  // Per-active-order Super AI Position Coach state
  const [coachLoadingPair, setCoachLoadingPair] = useState<CurrencyPair | null>(null);
  const [coachAdviceByPair, setCoachAdviceByPair] = useState<
    Partial<Record<CurrencyPair, PositionCoachAdvice>>
  >({});
  const [riskConfig, setRiskConfig] = useState<RiskManagementConfig>(() =>
    positionRiskStore.getConfig()
  );

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((state) => {
      setMarkets(state.markets);
      setActiveBroker(state.activeBroker);
      setActiveOrders(state.activeOrders);
      setOrderHistory(state.orderHistory);
      setSuggestedSignals(state.suggestedSignals);
      setEaAutoPilot(state.eaAutoPilot);
      setEaLedger(state.eaLedger);
      setEaLedgerStats(state.eaLedgerStats);
      setPendingLimits(state.pendingLimits);
      setSoundAlertsEnabled(state.soundAlertsEnabled);
      setEaCircuitBreaker(state.eaCircuitBreaker);
    });
    const unsubRisk = positionRiskStore.subscribe((cfg) => setRiskConfig(cfg));
    return () => {
      unsubscribe();
      unsubRisk();
    };
  }, []);

  // Pre-fill manual broker form defaults whenever formPair changes
  useEffect(() => {
    const mkt = markets.find((m) => m.pair === formPair);
    if (mkt && !showManualBrokerForm) {
      setFormEntry(String(mkt.price));
      setFormSl(String(mkt.suggestedSL));
      setFormTp(String(mkt.suggestedTP2));
    }
  }, [formPair, markets, showManualBrokerForm]);

  const flashBanner = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 5000);
  };

  const copyValue = (val: string | number, key: string) => {
    try {
      navigator.clipboard.writeText(String(val));
    } catch {}
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1500);
  };

  const openManualFormForPair = (targetPair: CurrencyPair) => {
    const mkt = markets.find((m) => m.pair === targetPair) || markets[0];
    setFormPair(targetPair);
    if (mkt) {
      setFormDirection(resolveMarketDirection(mkt));
      setFormEntry(String(mkt.price));
      setFormSl(String(mkt.suggestedSL));
      setFormTp(String(mkt.suggestedTP2));
    }
    setShowManualBrokerForm(true);
  };

  const handleSubmitBrokerExecution = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedEntry = formEntry ? parseFloat(formEntry) : undefined;
    const parsedSl = formSl ? parseFloat(formSl) : undefined;
    const parsedTp = formTp ? parseFloat(formTp) : undefined;

    const loaded = globalLiveStream.loadMarketOrder({
      pair: formPair,
      direction: formDirection,
      lotSize: formLot,
      broker: activeBroker,
      autoTrailEnabled: true,
      customEntryPrice: parsedEntry && !isNaN(parsedEntry) ? parsedEntry : undefined,
      customStopLoss: parsedSl && !isNaN(parsedSl) ? parsedSl : undefined,
      customTp: parsedTp && !isNaN(parsedTp) ? parsedTp : undefined,
      note: formNote.trim() || `Placed on ${activeBroker.toUpperCase()} Broker`
    });

    if (loaded) {
      setShowManualBrokerForm(false);
      setFormNote('');
      flashBanner(
        `BROKER EXECUTION REGISTERED: ${loaded.pair} ${loaded.direction} @ ${loaded.entryPrice} (SL ${loaded.stopLoss} · TP ${loaded.tp2})`
      );
      void handleAskPositionCoach(loaded);
    }
  };

  const handlePlaceSuggestedSignalWithBroker = (sig: SuggestedSignalLogEntry) => {
    const loaded = globalLiveStream.loadMarketOrder({
      pair: sig.pair,
      direction: sig.direction,
      lotSize: 0.01,
      timeframe: sig.timeframe,
      broker: sig.broker || activeBroker,
      autoTrailEnabled: true,
      customEntryPrice: sig.entryPrice,
      customStopLoss: sig.stopLoss,
      customTp: sig.tp2,
      suggestedSignalId: sig.id,
      note: `Executed suggested setup (${sig.orderVerdict})`
    });

    if (loaded) {
      flashBanner(
        `CONFIRMED PLACED WITH BROKER: ${loaded.pair} ${loaded.direction} @ ${loaded.entryPrice} · Live SL/TP Progress Active`
      );
    }
  };

  const handleAskPositionCoach = async (order: ActiveMarketOrder) => {
    const mkt = markets.find((m) => m.pair === order.pair) || markets[0];
    if (!mkt) return;
    setCoachLoadingPair(order.pair);
    const metrics = computeLiveOrderMetrics(order, mkt.price, mkt.atrPips);
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    markets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    const macro = getCurrentMacroContext(pctMap);

    try {
      const res = await fetch('/api/ai/position-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pair: order.pair,
          direction: order.direction,
          timeframe: order.timeframe,
          broker: order.broker.toUpperCase(),
          entryPrice: order.entryPrice,
          livePrice: mkt.price,
          stopLoss: order.stopLoss,
          tp1: order.tp1,
          tp2: order.tp2,
          tp3: order.tp3,
          floatingPips: metrics.floatingPips,
          netProfitUsd: metrics.netProfitUsd,
          netProfitKes: metrics.netProfitKes,
          keyLevel: mkt.keyLevel,
          trendDirection: mkt.trendDirection,
          ema20: mkt.ema20,
          ema50: mkt.ema50,
          rsi: mkt.rsi,
          atrPips: mkt.atrPips,
          h1TrendDirection: mkt.h1TrendDirection,
          dxyPressurePct: macro.dxyPressurePct,
          riskRegime: macro.riskRegime
        })
      });
      if (res.ok) {
        const data = (await res.json()) as PositionCoachAdvice;
        setCoachAdviceByPair((prev) => ({
          ...prev,
          [order.pair]: data
        }));
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setCoachLoadingPair((prev) => (prev === order.pair ? null : prev));
    }
  };

  const handleApplyAiCoachLevels = (pair: CurrencyPair, advice: PositionCoachAdvice) => {
    const updated = globalLiveStream.updateOrderSlTp(pair, {
      stopLoss: advice.suggestedStopLoss,
      tp2: advice.suggestedTakeProfit
    });
    if (updated) {
      flashBanner(
        `AI COACH APPLIED TO ${pair}: Updated SL ${updated.stopLoss} · TP2 ${updated.tp2}`
      );
    }
  };

  const activeOrderEntries = Object.values(activeOrders).filter((o): o is ActiveMarketOrder =>
    Boolean(o)
  );

  let totalFloatingUsd = 0;
  let totalFloatingPips = 0;
  activeOrderEntries.forEach((ord) => {
    const mkt = markets.find((m) => m.pair === ord.pair);
    const livePrice = mkt ? mkt.price : ord.entryPrice;
    const metrics = computeLiveOrderMetrics(ord, livePrice, mkt?.atrPips);
    totalFloatingUsd += metrics.netProfitUsd;
    totalFloatingPips += metrics.floatingPips;
  });

  const closedWins = orderHistory.filter((h) => h.realizedUsd > 0).length;
  const closedNetUsd = orderHistory.reduce((acc, h) => acc + h.realizedUsd, 0);
  const closedWinRate =
    orderHistory.length > 0 ? Math.round((closedWins / orderHistory.length) * 100) : 0;

  const filteredSuggestedSignals = suggestedSignals.filter((sig) => {
    if (signalFilter === 'ALL') return true;
    return sig.status === signalFilter;
  });

  return (
    <div className="space-y-6 font-mono tabular-nums">
      {/* 1. HEADER & BROKER EXECUTION SUMMARY STRIP */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1120] border border-[#D4AF37]/45 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-[#D4AF37]">
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span>REAL SUGGESTED MARKETS TRADE LOG &amp; PLACED BROKER ORDERS</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Notify Broker Order Execution · Track Live Drawdown &amp; Profit-Lock Progress
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-3xl">
              Every market scan setup can be logged here. When you place a trade on your broker ({activeBroker.toUpperCase()}), click{' '}
              <strong className="text-white">&ldquo;I Placed Order With Broker&rdquo;</strong> to notify PivotFx so we track your live floating pips, guard drawdown against swing structure, and trail SL/TP in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => {
                const next = globalLiveStream.toggleEaAutoPilot();
                flashBanner(
                  next
                    ? 'MT5 EA AUTO-PILOT ACTIVATED · Qualified READY setups auto-stage, trail SL, 50% banks at TP1 & auto-settle.'
                    : 'MT5 EA AUTO-PILOT PAUSED · Manual tracking remains active.'
                );
              }}
              className={`px-3.5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap border ${
                eaAutoPilot
                  ? 'bg-[#00C261] text-black border-[#00C261]'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/45'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>MT5 EA Auto: {eaAutoPilot ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = globalLiveStream.toggleSoundAlerts();
                flashBanner(next ? 'AUDIO CHIME ALERTS ENABLED' : 'AUDIO CHIME ALERTS MUTED');
              }}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap border ${
                soundAlertsEnabled
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/45'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {soundAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>Sound: {soundAlertsEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => openManualFormForPair(formPair)}
              className="px-4 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Log Broker Order Placed</span>
            </button>

            {(() => {
              const topActionable =
                markets.find(
                  (m) =>
                    m.executionReadiness === 'READY_ENTER' ||
                    m.executionReadiness === 'WAIT_PULLBACK'
                ) || markets[0];
              if (!topActionable) return null;
              const isNoTradeTop =
                topActionable.executionReadiness === 'NO_TRADE_CHOP' ||
                topActionable.executionReadiness === 'NO_TRADE_CLOSED';
              return (
                <button
                  type="button"
                  onClick={() => {
                    const logged = globalLiveStream.logSuggestedSetup({
                      pair: topActionable.pair,
                      timeframe: topActionable.recommendedTf,
                      broker: activeBroker,
                      direction: resolveMarketDirection(topActionable),
                      reasonSummary: topActionable.entryTimingWarning || topActionable.projection
                    });
                    if (logged) {
                      flashBanner(
                        `LOGGED #1 SUGGESTED SETUP: ${logged.pair} ${logged.direction} @ ${logged.entryPrice}`
                      );
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition whitespace-nowrap border ${
                    isNoTradeTop
                      ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border-[#D4AF37]/40'
                  }`}
                >
                  {isNoTradeTop
                    ? `+ Log Ref (${topActionable.pair} · Chop)`
                    : `+ Save #1 Top Setup (${topActionable.pair})`}
                </button>
              );
            })()}
          </div>
        </div>

        {/* Auto-Scored Signal Proof Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/35 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-black">
              VERIFIED EA SIGNAL PROOF ({eaLedger.length} Signals)
            </span>
            <span className="text-slate-200 font-bold">
              {eaLedger.length === 0
                ? 'Awaiting next qualified READY_ENTER setup to track automatically against live ticks.'
                : `${eaLedgerStats.wins} Wins (${eaLedgerStats.tp1Saves} TP1 BE Saves) · ${eaLedgerStats.losses} Losses · ${eaLedgerStats.winRatePct}% Win Rate · Net ${
                    eaLedgerStats.netR >= 0 ? `+${eaLedgerStats.netR}` : eaLedgerStats.netR
                  }R`}
            </span>
          </div>
          {eaLedger.length > 0 && (
            <button
              type="button"
              onClick={() => globalLiveStream.clearEaLedger()}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold"
            >
              Reset Signal Proof
            </button>
          )}
        </div>

        {/* EA Daily Drawdown & Loss-Streak Circuit Breaker Guard */}
        <div
          className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
            eaCircuitBreaker.tripped
              ? 'bg-rose-950/50 border-rose-500/60 text-rose-200'
              : 'bg-slate-950/90 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {eaCircuitBreaker.tripped ? (
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#00C261] shrink-0" />
            )}
            <strong className={eaCircuitBreaker.tripped ? 'text-rose-200' : 'text-white'}>
              {eaCircuitBreaker.tripped
                ? 'EA CIRCUIT BREAKER TRIPPED (AUTO-ENTRIES PAUSED):'
                : 'EA Daily Protection Guard Active:'}
            </strong>
            <span className="font-sans">
              {eaCircuitBreaker.tripped
                ? eaCircuitBreaker.reason
                : `Session Realized ${eaCircuitBreaker.dailyRealizedUsd >= 0 ? `+$${eaCircuitBreaker.dailyRealizedUsd.toFixed(2)}` : `-$${Math.abs(eaCircuitBreaker.dailyRealizedUsd).toFixed(2)}`} · Streak ${eaCircuitBreaker.consecutiveLosses}/${eaCircuitBreaker.maxLossStreak} SL · Daily Cap -$${eaCircuitBreaker.maxDailyLossUsd.toFixed(2)}`}
            </span>
          </div>
          {eaCircuitBreaker.tripped && (
            <button
              type="button"
              onClick={() => {
                globalLiveStream.resetEaCircuitBreaker();
                flashBanner('EA CIRCUIT BREAKER RESET · Protection counter cleared.');
              }}
              className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-black text-[11px] whitespace-nowrap"
            >
              Reset Circuit Breaker
            </button>
          )}
        </div>

        {/* 4 Summary Metric Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Placed Broker Orders Active</span>
            <strong className="text-lg font-black text-white">{activeOrderEntries.length}</strong>
            <span className="text-[10px] text-slate-400 block">
              Broker: {activeBroker.toUpperCase()} · Live 1s Sync
            </span>
          </div>

          <div
            className={`p-3.5 rounded-xl border ${
              totalFloatingUsd >= 0
                ? 'bg-emerald-950/30 border-[#00C261]/50'
                : 'bg-red-950/30 border-red-500/45'
            }`}
          >
            <span className="text-[10px] text-slate-300 block">Active Floating Net P&amp;L</span>
            <strong
              className={`text-lg font-black ${
                totalFloatingUsd >= 0 ? 'text-[#00C261]' : 'text-red-400'
              }`}
            >
              {totalFloatingUsd >= 0
                ? `+$${totalFloatingUsd.toFixed(2)}`
                : `-$${Math.abs(totalFloatingUsd).toFixed(2)}`}
            </strong>
            <span className="text-[10px] text-slate-300 block">
              {totalFloatingPips >= 0 ? `+${totalFloatingPips.toFixed(1)}p` : `${totalFloatingPips.toFixed(1)}p`} ·{' '}
              {Math.round(totalFloatingUsd * 130)} KES
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Suggested Market Setups</span>
            <strong className="text-lg font-black text-[#D4AF37]">{suggestedSignals.length}</strong>
            <span className="text-[10px] text-slate-400 block">
              {suggestedSignals.filter((s) => s.status === 'PLACED_WITH_BROKER').length} Placed With Broker
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Recorded Closed Results</span>
            <strong
              className={`text-lg font-black ${
                closedNetUsd >= 0 ? 'text-[#00C261]' : 'text-red-400'
              }`}
            >
              {closedNetUsd >= 0
                ? `+$${closedNetUsd.toFixed(2)}`
                : `-$${Math.abs(closedNetUsd).toFixed(2)}`}
            </strong>
            <span className="text-[10px] text-slate-400 block">
              {orderHistory.length} Closed · {closedWinRate}% Win Rate
            </span>
          </div>
        </div>

        {(() => {
          const portfolioExposure = evaluatePortfolioRiskExposure(activeOrders, riskConfig);
          if (portfolioExposure.severity === 'SAFE' || !portfolioExposure.warningHeadline) {
            return null;
          }
          return (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 font-sans ${
                portfolioExposure.severity === 'HIGH_STACKED_RISK'
                  ? 'bg-red-950/45 border-red-500/55 text-red-200'
                  : 'bg-amber-950/45 border-amber-500/50 text-amber-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <strong className="font-mono text-white block">{portfolioExposure.warningHeadline}</strong>
                <span>{portfolioExposure.warningDetail}</span>
              </div>
            </div>
          );
        })()}

        {statusBanner && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-[#00C261]/50 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0" />
            <span>{statusBanner}</span>
          </div>
        )}

        {/* MANUAL / CUSTOM BROKER ORDER NOTIFICATION FORM */}
        {showManualBrokerForm && (
          <form
            onSubmit={handleSubmitBrokerExecution}
            className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-[#00C261]/50 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#00C261] font-black">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  REGISTER ORDER PLACED WITH YOUR BROKER (INCLUDES EXACT FILL PRICE &amp; AI DRAWDOWN CHECK)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowManualBrokerForm(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Market Pair</label>
                <select
                  value={formPair}
                  onChange={(e) => {
                    const nextP = e.target.value as CurrencyPair;
                    setFormPair(nextP);
                    const mkt = markets.find((m) => m.pair === nextP);
                    if (mkt) {
                      setFormEntry(String(mkt.price));
                      setFormSl(String(mkt.suggestedSL));
                      setFormTp(String(mkt.suggestedTP2));
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-bold outline-none focus:border-[#D4AF37]"
                >
                  {ALL_MARKET_PAIRS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Order Side</label>
                <select
                  value={formDirection}
                  onChange={(e) => setFormDirection(e.target.value as 'BUY' | 'SELL')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-bold outline-none focus:border-[#D4AF37]"
                >
                  <option value="BUY">BUY (Long)</option>
                  <option value="SELL">SELL (Short)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Broker Entry Price</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formEntry}
                  onChange={(e) => setFormEntry(e.target.value)}
                  placeholder="e.g. 1.38450"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-bold outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[10px] text-red-400 block mb-1">Broker Stop Loss</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formSl}
                  onChange={(e) => setFormSl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-red-300 font-bold outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#00C261] block mb-1">Broker Take Profit</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formTp}
                  onChange={(e) => setFormTp(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-[#00C261] font-bold outline-none focus:border-[#00C261]"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Lot Size</label>
                <select
                  value={formLot}
                  onChange={(e) => setFormLot(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-bold outline-none focus:border-[#D4AF37]"
                >
                  <option value={0.01}>0.01 Lot ($2 Cap)</option>
                  <option value={0.02}>0.02 Lot ($4 Cap)</option>
                  <option value={0.05}>0.05 Lot ($10 Cap)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <input
                type="text"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                placeholder="Optional note (e.g. Placed USD/CAD BUY on FXPesa — check drawdown & safe SL)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-sans outline-none focus:border-[#D4AF37]"
              />

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-black uppercase tracking-wider whitespace-nowrap shrink-0"
              >
                Confirm: I Placed Order With Broker &amp; Run AI Guard
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 1B. ARMED PENDING BUY/SELL LIMIT QUEUE */}
      {pendingLimits.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B101E] border border-amber-500/45 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                ARMED PENDING BUY/SELL LIMIT QUEUE ({pendingLimits.filter((l) => l.status === 'PENDING').length} ACTIVE)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-sans">
              Automatically fills at 20 EMA value pullback or auto-cancels if invalidation level is broken.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
            {pendingLimits.slice(0, 8).map((lim) => {
              const isPending = lim.status === 'PENDING';
              const isBuy = lim.direction === 'BUY';
              return (
                <div
                  key={lim.id}
                  className={`p-4 rounded-xl bg-slate-950 border space-y-2.5 ${
                    isPending
                      ? 'border-amber-500/55'
                      : lim.status === 'FILLED'
                      ? 'border-[#00C261]/50 opacity-85'
                      : 'border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-black text-[10px] ${
                          isBuy ? 'bg-[#00C261] text-black' : 'bg-red-600 text-white'
                        }`}
                      >
                        {lim.direction} LIMIT
                      </span>
                      <strong className="text-white text-sm">{lim.pair}</strong>
                      <span className="text-[11px] text-slate-400">
                        {lim.timeframe} · {lim.lotSize.toFixed(2)} Lot
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isPending
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : lim.status === 'FILLED'
                          ? 'bg-emerald-950 text-[#00C261]'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {lim.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[9px] text-amber-300 block">Limit Entry</span>
                      <strong className="text-white">{lim.limitEntryPrice}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-red-950/25 border border-red-500/30">
                      <span className="text-[9px] text-red-400 block">SL</span>
                      <strong className="text-red-300">{lim.stopLoss}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/25 border border-[#00C261]/30">
                      <span className="text-[9px] text-emerald-400 block">TP2</span>
                      <strong className="text-[#00C261]">{lim.tp2}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-950/25 border border-rose-500/30">
                      <span className="text-[9px] text-rose-300 block">Invalidation</span>
                      <strong className="text-rose-200">{lim.invalidationPrice}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                    <span className="text-slate-400 truncate">{lim.armedAtEat}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onSelectPairForChart && (
                        <button
                          type="button"
                          onClick={() => onSelectPairForChart(lim.pair)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 font-bold"
                        >
                          Chart
                        </button>
                      )}
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => {
                            globalLiveStream.cancelPendingLimitOrder(lim.id);
                            flashBanner(`Cancelled pending ${lim.direction} LIMIT on ${lim.pair}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-red-950 text-red-300 border border-red-500/40 font-bold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. ACTIVE PLACED BROKER ORDERS WITH SUPER AI POSITION & DRAWDOWN COACH */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B101E] border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-black text-[#00C261]">
            <Target className="w-4 h-4 shrink-0" />
            <span>
              ACTIVE PLACED BROKER ORDERS ({activeOrderEntries.length} LIVE POSITIONS TRACKED)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click &ldquo;Super AI Drawdown / Recovery Check&rdquo; on any active position for live SL/TP coaching
          </span>
        </div>

        {activeOrderEntries.length > 0 ? (
          <div className="space-y-4">
            {activeOrderEntries.map((ord) => {
              const mkt = markets.find((m) => m.pair === ord.pair);
              const livePrice = mkt ? mkt.price : ord.entryPrice;
              const { decimals } = getPairSpecs(ord.pair);
              const metrics = computeLiveOrderMetrics(ord, livePrice, mkt?.atrPips);
              const isBuy = ord.direction === 'BUY';
              const coachAdvice = coachAdviceByPair[ord.pair];
              const isCoachLoading = coachLoadingPair === ord.pair;

              return (
                <div
                  key={ord.id}
                  className={`p-4 sm:p-5 rounded-xl bg-slate-950 border space-y-4 ${
                    metrics.isInProfit ? 'border-[#00C261]/60' : 'border-amber-500/45'
                  }`}
                >
                  {/* Top Order Summary */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg font-black text-xs ${
                          isBuy ? 'bg-[#00C261] text-black' : 'bg-red-600 text-white'
                        }`}
                      >
                        {ord.direction} PLACED ON BROKER
                      </span>
                      <strong className="text-lg text-white">{ord.pair}</strong>
                      <span className="text-xs text-slate-400">
                        {ord.lotSize.toFixed(2)} Lot · {ord.timeframe} · {ord.broker.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#D4AF37] font-bold">
                        Entry {ord.entryPrice} → Live {livePrice.toFixed(decimals)}
                      </span>
                      {metrics.isBreakevenLocked && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-[#00C261] border border-[#00C261]/40 text-[10px] font-black">
                          PROFIT LOCKED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">
                          Live P&amp;L ({ord.loadedAtEat})
                        </span>
                        <strong
                          className={`text-base font-black ${
                            metrics.netProfitUsd >= 0 ? 'text-[#00C261]' : 'text-red-400'
                          }`}
                        >
                          {metrics.floatingPips >= 0
                            ? `+${metrics.floatingPips}p`
                            : `${metrics.floatingPips}p`}{' '}
                          ·{' '}
                          {metrics.netProfitUsd >= 0
                            ? `+$${metrics.netProfitUsd.toFixed(2)} (+${metrics.netProfitKes} KES)`
                            : `-$${Math.abs(metrics.netProfitUsd).toFixed(2)} (${metrics.netProfitKes} KES)`}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAskPositionCoach(ord)}
                        disabled={isCoachLoading}
                        className="px-3.5 py-2 rounded-xl btn-gold text-black font-black text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>
                          {isCoachLoading
                            ? 'Analyzing Position...'
                            : !metrics.isInProfit
                            ? 'Super AI Drawdown Rescue Check'
                            : 'Super AI Profit-Lock Check'}
                        </span>
                      </button>

                      {onSelectPairForChart && (
                        <button
                          type="button"
                          onClick={() => onSelectPairForChart(ord.pair)}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition whitespace-nowrap"
                        >
                          Inspect Chart
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Track & Level Copy Boxes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="text-slate-300 font-bold">
                        SL → Entry → Target Progress: {metrics.slToTpProgressPct}%
                      </span>
                      <span
                        className={
                          metrics.isInProfit ? 'text-[#00C261] font-bold' : 'text-amber-300 font-bold'
                        }
                      >
                        {metrics.hitTp2
                          ? 'TP2 TARGET HIT — Advance SL & Extend TP3'
                          : metrics.hitTp1
                          ? `TP1 HIT — ${metrics.pipsRemainingToTp2}p left to TP2 (${ord.tp2})`
                          : metrics.isInProfit
                          ? `IN PROFIT (+${metrics.floatingPips}p) · ${metrics.pipsRemainingToTp1}p to TP1`
                          : `IN DRAWDOWN (${metrics.floatingPips}p) · ${metrics.pipsDistanceAboveSl}p cushion above SL (${ord.stopLoss})`}
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          metrics.isInProfit
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#00C261]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${metrics.slToTpProgressPct}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => copyValue(ord.stopLoss, `tl-sl-${ord.id}`)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-950/40 border border-red-500/35 text-red-200 font-bold flex items-center gap-1"
                        >
                          <span>SL: {ord.stopLoss}</span>
                          {copiedKey === `tl-sl-${ord.id}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => copyValue(ord.tp1, `tl-tp1-${ord.id}`)}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/35 text-cyan-200 font-bold flex items-center gap-1"
                        >
                          <span>TP1: {ord.tp1}</span>
                          {copiedKey === `tl-tp1-${ord.id}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => copyValue(ord.tp2, `tl-tp2-${ord.id}`)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-[#00C261]/40 text-[#00C261] font-bold flex items-center gap-1"
                        >
                          <span>TP2: {ord.tp2}</span>
                          {copiedKey === `tl-tp2-${ord.id}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() =>
                            globalLiveStream.applySmartSlTpAction(ord.pair, 'LOCK_BREAKEVEN')
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold transition whitespace-nowrap"
                        >
                          +Lock Breakeven
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            globalLiveStream.applySmartSlTpAction(ord.pair, 'LOCK_PROFIT_55')
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#00C261]/20 hover:bg-[#00C261] text-[#00C261] hover:text-black border border-[#00C261]/40 font-black transition whitespace-nowrap"
                        >
                          +Lock +55% Profit SL
                        </button>
                        {!ord.partialTp1Banked ? (
                          <button
                            type="button"
                            onClick={() => {
                              const upd = globalLiveStream.bankPartialTp1(ord.pair);
                              if (upd) {
                                flashBanner(
                                  `BANKED 50% @ TP1 (${ord.pair}): +$${(upd.partialBankedUsd || 0).toFixed(2)} closed · Runner @ BE SL ${upd.stopLoss}`
                                );
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-500 text-cyan-200 hover:text-black border border-cyan-500/40 font-black transition whitespace-nowrap"
                          >
                            Bank 50% @ TP1 + BE
                          </button>
                        ) : (
                          <span className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 text-[#00C261] border border-[#00C261]/40 font-black whitespace-nowrap">
                            50% Banked: +${(ord.partialBankedUsd || 0).toFixed(2)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => globalLiveStream.closeMarketOrder(ord.pair)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-red-300 border border-slate-700 font-bold transition whitespace-nowrap"
                        >
                          Close &amp; Record
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Super AI Position & Drawdown Coach Verdict Card */}
                  {coachAdvice && (
                    <div className="p-4 rounded-xl bg-[#0D1629] border border-[#D4AF37]/55 space-y-2.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[#D4AF37] font-black">
                          <Sparkles className="w-4 h-4 shrink-0" />
                          <span>
                            {coachAdvice.headline} · {coachAdvice.actionBadge}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {coachAdvice.source === 'gemini-4-hydrogen' || coachAdvice.source === 'gemini-3.8-flash'
                            ? 'Super AI Live Coach'
                            : 'Quantitative Risk Coach'}{' '}
                          · {coachAdvice.syncedAt}
                        </span>
                      </div>

                      <p className="text-slate-200 font-sans leading-relaxed">
                        {coachAdvice.recommendation}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-3 text-[11px] flex-wrap">
                          <span className="text-red-300 font-bold">
                            AI Safe Swing SL: {coachAdvice.suggestedStopLoss}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-[#00C261] font-bold">
                            AI Realistic TP: {coachAdvice.suggestedTakeProfit}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-amber-300 font-bold">
                            Hard Exit Invalidation: {coachAdvice.keyInvalidationLevel}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyAiCoachLevels(ord.pair, coachAdvice)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-[11px] transition whitespace-nowrap"
                        >
                          Apply AI Suggested SL &amp; TP
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <strong className="text-white block">No Broker Orders Currently Marked Placed</strong>
              <p className="text-slate-400 font-sans">
                When you open a position on your broker ({activeBroker.toUpperCase()}), click{' '}
                <strong className="text-slate-200">&ldquo;Log Broker Order Placed&rdquo;</strong> above or click{' '}
                <strong className="text-slate-200">&ldquo;I Placed Order With Broker&rdquo;</strong> on any suggested signal below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openManualFormForPair('USD/CAD')}
              className="px-4 py-2 rounded-xl btn-gold text-black font-black whitespace-nowrap shrink-0"
            >
              Log My Broker Position
            </button>
          </div>
        )}
      </div>

      {/* 3. REAL SUGGESTED MARKETS TRADE LOG */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B101E] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-black text-[#D4AF37]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              REAL SUGGESTED MARKETS TRADE LOG ({filteredSuggestedSignals.length} SETUPS RECORDED)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['ALL', 'SUGGESTED', 'PLACED_WITH_BROKER'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSignalFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                  signalFilter === tab
                    ? 'btn-gold text-black font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab === 'ALL'
                  ? `All (${suggestedSignals.length})`
                  : tab === 'SUGGESTED'
                  ? `Pending Entry (${suggestedSignals.filter((s) => s.status === 'SUGGESTED').length})`
                  : `Placed With Broker (${
                      suggestedSignals.filter((s) => s.status === 'PLACED_WITH_BROKER').length
                    })`}
              </button>
            ))}

            {suggestedSignals.length > 0 && (
              <button
                type="button"
                onClick={() => globalLiveStream.clearSuggestedSignals()}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 text-[11px] font-bold"
              >
                Clear Log
              </button>
            )}
          </div>
        </div>

        {filteredSuggestedSignals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
            {filteredSuggestedSignals.map((sig) => {
              const isBuy = sig.direction === 'BUY';
              const isPlaced = sig.status === 'PLACED_WITH_BROKER';
              const isExtended = sig.orderVerdict.includes('WAIT PULLBACK');

              return (
                <div
                  key={sig.id}
                  className={`p-4 rounded-xl bg-slate-950 border space-y-3 flex flex-col justify-between ${
                    isPlaced
                      ? 'border-[#00C261]/60'
                      : isExtended
                      ? 'border-amber-500/45'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-black text-[10px] ${
                            isBuy ? 'bg-[#00C261] text-black' : 'bg-red-600 text-white'
                          }`}
                        >
                          {sig.direction}
                        </span>
                        <strong className="text-base text-white">{sig.pair}</strong>
                        <span className="text-[11px] text-slate-400">
                          {sig.timeframe} · {sig.broker.toUpperCase()} · {sig.confidence}% AI
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-black ${
                          isPlaced
                            ? 'text-[#00C261]'
                            : sig.status === 'CLOSED'
                            ? 'text-slate-400'
                            : isExtended
                            ? 'text-amber-300'
                            : 'text-[#D4AF37]'
                        }`}
                      >
                        {isPlaced
                          ? 'PLACED WITH BROKER ✓'
                          : sig.status === 'CLOSED'
                          ? 'CLOSED'
                          : sig.orderVerdict}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">Entry</span>
                        <strong className="text-white">{sig.entryPrice}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-red-950/25 border border-red-500/30">
                        <span className="text-[9px] text-red-400 block">Swing SL (-{sig.slPips}p)</span>
                        <strong className="text-red-300">{sig.stopLoss}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-950/25 border border-[#00C261]/30">
                        <span className="text-[9px] text-emerald-400 block">TP2 (+{sig.tpPips}p)</span>
                        <strong className="text-[#00C261]">{sig.tp2}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">Net Est. (0.01)</span>
                        <strong className="text-[#D4AF37]">
                          +${sig.netProfitUsd.toFixed(2)} ({sig.riskReward})
                        </strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {sig.reasonSummary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyValue(sig.stopLoss, `sig-sl-${sig.id}`)}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-red-300 border border-slate-800 text-[10px] font-bold flex items-center gap-1"
                      >
                        {copiedKey === `sig-sl-${sig.id}` ? (
                          <Check className="w-3 h-3 text-[#00C261]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy SL</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => copyValue(sig.tp2, `sig-tp-${sig.id}`)}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[#00C261] border border-slate-800 text-[10px] font-bold flex items-center gap-1"
                      >
                        {copiedKey === `sig-tp-${sig.id}` ? (
                          <Check className="w-3 h-3 text-[#00C261]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy TP</span>
                      </button>

                      <span className="text-[10px] text-slate-500">{sig.loggedAtEat}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isPlaced && (
                        <button
                          type="button"
                          onClick={() => handlePlaceSuggestedSignalWithBroker(sig)}
                          className="px-3 py-1.5 rounded-lg bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-[11px] transition whitespace-nowrap"
                        >
                          I Placed Order With Broker
                        </button>
                      )}
                      {onSelectPairForChart && (
                        <button
                          type="button"
                          onClick={() => onSelectPairForChart(sig.pair)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 text-[11px] font-bold transition whitespace-nowrap"
                        >
                          Chart
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => globalLiveStream.removeSuggestedSignal(sig.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300"
                        title="Remove from log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-sans">
            No suggested setups logged yet. Click <strong className="text-white">&ldquo;+ Save #1 Top Market&rdquo;</strong> above or click <strong className="text-white">&ldquo;Log Setup&rdquo;</strong> inside any scanner workstation to build your audit trail.
          </div>
        )}
      </div>

      {/* 4. COMPLETED / CLOSED BROKER ORDER HISTORY */}
      {orderHistory.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B101E] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-black text-[#D4AF37]">
              <History className="w-4 h-4 shrink-0" />
              <span>CLOSED BROKER ORDER HISTORY ({orderHistory.length} COMPLETED)</span>
            </div>
            <button
              type="button"
              onClick={() => globalLiveStream.clearOrderHistory()}
              className="text-[11px] text-slate-400 hover:text-white font-bold"
            >
              Clear History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {orderHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-black ${
                        item.direction === 'BUY' ? 'text-[#00C261]' : 'text-red-400'
                      }`}
                    >
                      {item.direction}
                    </span>
                    <strong className="text-white">{item.pair}</strong>
                    <span className="text-[10px] text-slate-400">
                      ({item.lotSize.toFixed(2)} · {item.outcome})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {item.entryPrice} → {item.closePrice} · Final SL {item.finalStopLoss}
                  </div>
                  <div className="text-[10px] text-slate-500">{item.closedAtEat}</div>
                </div>

                <div className="text-right">
                  <strong
                    className={`text-xs block ${
                      item.realizedUsd >= 0 ? 'text-[#00C261]' : 'text-red-400'
                    }`}
                  >
                    {item.realizedPips >= 0 ? `+${item.realizedPips}p` : `${item.realizedPips}p`}
                  </strong>
                  <span
                    className={`text-[11px] font-bold ${
                      item.realizedUsd >= 0 ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {item.realizedUsd >= 0
                      ? `+$${item.realizedUsd.toFixed(2)}`
                      : `-$${Math.abs(item.realizedUsd).toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
