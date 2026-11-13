import React, { useState, useEffect } from 'react';
import {
  BrokerId,
  CurrencyPair,
  SuggestedSignalLogEntry,
  Timeframe
} from '../../types';
import {
  ActiveMarketOrder,
  ClosedOrderHistoryEntry,
  MarketScanData,
  globalLiveStream,
  computeLiveOrderMetrics,
  getCurrentMacroContext,
  getPairSpecs
} from '../../utils/liveMarketEngine';
import {
  Bot,
  Check,
  CheckCircle2,
  ClipboardList,
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

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((state) => {
      setMarkets(state.markets);
      setActiveBroker(state.activeBroker);
      setActiveOrders(state.activeOrders);
      setOrderHistory(state.orderHistory);
      setSuggestedSignals(state.suggestedSignals);
    });
    return () => unsubscribe();
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
      setFormDirection(mkt.bias === 'STRONG_SELL' ? 'SELL' : 'BUY');
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
          currentPrice: mkt.price,
          stopLoss: order.stopLoss,
          tp1: order.tp1,
          tp2: order.tp2,
          floatingPips: metrics.floatingPips,
          netProfitUsd: metrics.netProfitUsd,
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
              onClick={() => openManualFormForPair(formPair)}
              className="px-4 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Log Broker Order Placed</span>
            </button>

            {markets[0] && (
              <button
                type="button"
                onClick={() => {
                  const top = markets[0];
                  const logged = globalLiveStream.logSuggestedSetup({
                    pair: top.pair,
                    timeframe: top.recommendedTf,
                    broker: activeBroker,
                    direction: top.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
                    reasonSummary: top.entryTimingWarning || top.projection
                  });
                  if (logged) {
                    flashBanner(
                      `LOGGED #1 SUGGESTED SETUP: ${logged.pair} ${logged.direction} @ ${logged.entryPrice}`
                    );
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-xs transition whitespace-nowrap"
              >
                + Save #1 Top Market ({markets[0].pair})
              </button>
            )}
          </div>
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
