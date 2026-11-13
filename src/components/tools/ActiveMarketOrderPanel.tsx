import React, { useState, useEffect } from 'react';
import { BrokerId, CurrencyPair, Timeframe } from '../../types';
import {
  ActiveMarketOrder,
  ClosedOrderHistoryEntry,
  MarketScanData,
  globalLiveStream,
  computeLiveOrderMetrics,
  computeRealChartTradeParams,
  computeCandleSwingLevels,
  getCurrentMacroContext,
  getPairSpecs,
  RiskManagementConfig,
  positionRiskStore
} from '../../utils/liveMarketEngine';
import {
  TrendingUp,
  TrendingDown,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  Target,
  History,
  XCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Bot,
  ClipboardList
} from 'lucide-react';

interface ActiveMarketOrderPanelProps {
  mode: 'full' | 'broker_terminal' | 'summary_banner';
  pair?: CurrencyPair;
  direction?: 'BUY' | 'SELL';
  timeframe?: Timeframe;
  broker?: BrokerId;
  onInspectPairCard?: (pair: CurrencyPair) => void;
}

export const ActiveMarketOrderPanel: React.FC<ActiveMarketOrderPanelProps> = ({
  mode,
  pair = 'GBP/USD',
  direction = 'BUY',
  timeframe = 'M15',
  broker = 'fxpesa',
  onInspectPairCard
}) => {
  const [markets, setMarkets] = useState<MarketScanData[]>(() => globalLiveStream.getState().markets);
  const [activeOrders, setActiveOrders] = useState<Partial<Record<CurrencyPair, ActiveMarketOrder>>>(
    () => globalLiveStream.getState().activeOrders
  );
  const [orderHistory, setOrderHistory] = useState<ClosedOrderHistoryEntry[]>(
    () => globalLiveStream.getState().orderHistory
  );
  const [selectedLotSize, setSelectedLotSize] = useState<number | 'AUTO'>('AUTO');
  const [riskConfig, setRiskConfig] = useState<RiskManagementConfig>(() => positionRiskStore.getConfig());
  const [autoTrailOnLoad, setAutoTrailOnLoad] = useState<boolean>(true);
  const [customEntryDraft, setCustomEntryDraft] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState<boolean>(false);
  const [inlineCoachAdvice, setInlineCoachAdvice] = useState<{
    source: string;
    actionBadge: string;
    headline: string;
    recommendation: string;
    suggestedStopLoss: number;
    suggestedTakeProfit: number;
    keyInvalidationLevel: number;
    syncedAt: string;
  } | null>(null);

  // Per-pair custom SL/TP draft strings
  const [slDraftByPair, setSlDraftByPair] = useState<Partial<Record<CurrencyPair, string>>>({});
  const [tpDraftByPair, setTpDraftByPair] = useState<Partial<Record<CurrencyPair, string>>>({});

  useEffect(() => {
    setCustomEntryDraft('');
    setInlineCoachAdvice(null);
  }, [pair]);

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((state) => {
      setMarkets(state.markets);
      setActiveOrders(state.activeOrders);
      setOrderHistory(state.orderHistory);
    });
    const unsubRisk = positionRiskStore.subscribe((nextCfg) => setRiskConfig(nextCfg));
    return () => {
      unsubscribe();
      unsubRisk();
    };
  }, []);

  const flashNotice = (msg: string) => {
    setStatusFeedback(msg);
    setTimeout(() => {
      setStatusFeedback((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const copyValue = (text: string, keyId: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {}
    setCopiedKey(keyId);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === keyId ? null : prev));
    }, 1600);
  };

  const handleLoadOrder = (
    targetPair: CurrencyPair,
    targetDir: 'BUY' | 'SELL',
    targetTf?: Timeframe,
    overrideEntry?: number
  ) => {
    const loaded = globalLiveStream.loadMarketOrder({
      pair: targetPair,
      direction: targetDir,
      lotSize: selectedLotSize === 'AUTO' ? undefined : selectedLotSize,
      timeframe: targetTf || timeframe,
      broker,
      autoTrailEnabled: autoTrailOnLoad,
      customEntryPrice: overrideEntry
    });
    if (loaded) {
      setSlDraftByPair((prev) => ({ ...prev, [targetPair]: String(loaded.stopLoss) }));
      setTpDraftByPair((prev) => ({ ...prev, [targetPair]: String(loaded.tp2) }));
      setCustomEntryDraft('');
      flashNotice(
        `BROKER ORDER NOTIFIED & LOGGED · ${loaded.direction} ${loaded.pair} @ ${loaded.entryPrice} | SL ${loaded.stopLoss} | TP ${loaded.tp2}`
      );
    }
  };

  const handleRunInlineCoach = async (ord: ActiveMarketOrder, mkt: MarketScanData) => {
    setCoachLoading(true);
    const metrics = computeLiveOrderMetrics(ord, mkt.price, mkt.atrPips);
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
          pair: ord.pair,
          direction: ord.direction,
          timeframe: ord.timeframe,
          broker: ord.broker.toUpperCase(),
          entryPrice: ord.entryPrice,
          currentPrice: mkt.price,
          stopLoss: ord.stopLoss,
          tp1: ord.tp1,
          tp2: ord.tp2,
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
        const data = await res.json();
        setInlineCoachAdvice(data);
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setCoachLoading(false);
    }
  };

  const handleApplySmartAction = (
    targetPair: CurrencyPair,
    action: 'LOCK_BREAKEVEN' | 'LOCK_PROFIT_55' | 'EXPAND_TP' | 'LOCK_AND_EXPAND'
  ) => {
    const updated = globalLiveStream.applySmartSlTpAction(targetPair, action);
    if (updated) {
      setSlDraftByPair((prev) => ({ ...prev, [targetPair]: String(updated.stopLoss) }));
      setTpDraftByPair((prev) => ({ ...prev, [targetPair]: String(updated.tp2) }));
      flashNotice(
        `UPDATED ${updated.pair} (${updated.direction}): New SL ${updated.stopLoss} · New TP ${updated.tp2} (Auto-synced across all views ✓)`
      );
    }
  };

  const handleSaveCustomSl = (targetPair: CurrencyPair, order: ActiveMarketOrder) => {
    const raw = slDraftByPair[targetPair];
    const parsed = raw ? parseFloat(raw) : NaN;
    if (isNaN(parsed) || parsed <= 0) return;
    const updated = globalLiveStream.updateOrderSlTp(targetPair, { stopLoss: parsed });
    if (updated) {
      flashNotice(`${targetPair} Stop Loss updated to ${updated.stopLoss}`);
    }
  };

  const handleSaveCustomTp = (targetPair: CurrencyPair, order: ActiveMarketOrder) => {
    const raw = tpDraftByPair[targetPair];
    const parsed = raw ? parseFloat(raw) : NaN;
    if (isNaN(parsed) || parsed <= 0) return;
    const updated = globalLiveStream.updateOrderSlTp(targetPair, { tp2: parsed });
    if (updated) {
      flashNotice(`${targetPair} Take Profit updated to ${updated.tp2}`);
    }
  };

  const handleCloseOrder = (targetPair: CurrencyPair) => {
    const closed = globalLiveStream.closeMarketOrder(targetPair);
    if (closed) {
      const sign = closed.realizedUsd >= 0 ? '+' : '';
      flashNotice(
        `ORDER CLOSED (${closed.pair} ${closed.direction}): ${sign}${closed.realizedPips}p · ${sign}$${closed.realizedUsd.toFixed(2)} (${sign}${closed.realizedKes} KES) recorded in History`
      );
    }
  };

  const activeOrderEntries = Object.values(activeOrders).filter((o): o is ActiveMarketOrder => Boolean(o));

  // ============================================================================
  // MODE 1: COMPACT LIVE STRIP AT TOP OF RADAR VIEW (WHEN 1+ ORDERS ARE LOADED)
  // ============================================================================
  if (mode === 'summary_banner') {
    if (activeOrderEntries.length === 0) return null;

    return (
      <div className="p-4 rounded-2xl bg-[#0B1324] border border-[#00C261]/55 space-y-3 font-mono tabular-nums">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black text-[#00C261]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              PLACED BROKER ORDERS MONITOR ({activeOrderEntries.length} ACTIVE · LIVE P&amp;L &amp; SL GUARD)
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {statusFeedback && (
              <span className="text-[11px] text-[#D4AF37] font-bold">{statusFeedback}</span>
            )}
            <button
              type="button"
              onClick={() => globalLiveStream.requestOpenScannerView('trade_log')}
              className="px-3 py-1 rounded-lg btn-gold text-black font-black text-[11px] transition whitespace-nowrap"
            >
              Open Trade Log &amp; AI Coach
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {activeOrderEntries.map((ord) => {
            const mkt = markets.find((m) => m.pair === ord.pair);
            const livePrice = mkt ? mkt.price : ord.entryPrice;
            const metrics = computeLiveOrderMetrics(ord, livePrice, mkt?.atrPips);
            const isBuy = ord.direction === 'BUY';

            return (
              <div
                key={ord.id}
                className={`p-3.5 rounded-xl bg-slate-950 border space-y-2.5 text-xs ${
                  metrics.isInProfit ? 'border-[#00C261]/60' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded font-black text-[10px] ${
                        isBuy ? 'bg-[#00C261] text-black' : 'bg-red-600 text-white'
                      }`}
                    >
                      {ord.direction}
                    </span>
                    <strong className="text-white text-sm">{ord.pair}</strong>
                  </div>
                  <span
                    className={`font-black text-xs ${
                      metrics.netProfitUsd >= 0 ? 'text-[#00C261]' : 'text-red-400'
                    }`}
                  >
                    {metrics.floatingPips >= 0 ? `+${metrics.floatingPips}p` : `${metrics.floatingPips}p`} ·{' '}
                    {metrics.netProfitUsd >= 0
                      ? `+$${metrics.netProfitUsd.toFixed(2)}`
                      : `-$${Math.abs(metrics.netProfitUsd).toFixed(2)}`}
                  </span>
                </div>

                {/* Progress Bar SL -> TP2 */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        metrics.isInProfit ? 'bg-[#00C261]' : 'bg-amber-400'
                      }`}
                      style={{ width: `${metrics.slToTpProgressPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>SL: {ord.stopLoss}</span>
                    <span>Now: {livePrice}</span>
                    <span>TP: {ord.tp2}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplySmartAction(ord.pair, 'LOCK_PROFIT_55')}
                    className="px-2 py-1 rounded-lg bg-[#00C261]/20 hover:bg-[#00C261] text-[#00C261] hover:text-black font-black text-[10px] transition whitespace-nowrap"
                  >
                    +Lock SL
                  </button>
                  <button
                    type="button"
                    onClick={() => copyValue(String(ord.stopLoss), `sum-sl-${ord.pair}`)}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[10px] font-bold transition whitespace-nowrap"
                  >
                    {copiedKey === `sum-sl-${ord.pair}` ? 'SL ✓' : 'Copy SL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectPairCard && onInspectPairCard(ord.pair)}
                    className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black font-black text-[10px] transition whitespace-nowrap"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================================
  // MODE 2: BROKERS PAGE / GLOBAL LIVE ORDER BOOK TERMINAL
  // ============================================================================
  if (mode === 'broker_terminal') {
    const activeMarketForDefault = markets.find((m) => m.pair === pair) || markets[0];

    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0A101E] border-2 border-[#D4AF37]/60 space-y-5 font-mono tabular-nums">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold flex-wrap">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                BROKER LIVE POSITION TRACKER · SYNCED WITH MARKET CARDS ({broker.toUpperCase()})
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Loaded Market Orders, Live P&amp;L Progress &amp; Dynamic SL/TP Profit-Lock
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Every BUY or SELL Market Order loaded from any scan card automatically syncs here with real-time floating pips, SL-to-TP progress gauges, instant profit-locking SL updates, and completed order history.
            </p>
          </div>

          {/* Quick Load Any Pair Order Right From Broker Terminal */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <select
              value={selectedLotSize}
              onChange={(e) => setSelectedLotSize(parseFloat(e.target.value))}
              aria-label="Select Lot Size"
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs outline-none focus:border-[#D4AF37]"
            >
              <option value={0.01}>0.01 Micro Lot ($2 Cap)</option>
              <option value={0.02}>0.02 Micro Lot ($4 Cap)</option>
              <option value={0.05}>0.05 Micro Lot ($10 Cap)</option>
            </select>

            {activeMarketForDefault && !activeOrders[activeMarketForDefault.pair] && (
              <button
                type="button"
                onClick={() =>
                  handleLoadOrder(
                    activeMarketForDefault.pair,
                    activeMarketForDefault.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
                    activeMarketForDefault.recommendedTf
                  )
                }
                className="px-4 py-2 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider whitespace-nowrap shrink-0"
              >
                Load #{1} {activeMarketForDefault.pair} Order
              </button>
            )}
          </div>
        </div>

        {statusFeedback && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-[#00C261]/50 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0" />
            <span>{statusFeedback}</span>
          </div>
        )}

        {/* Active Open Orders Grid */}
        {activeOrderEntries.length > 0 ? (
          <div className="space-y-4">
            {activeOrderEntries.map((ord) => {
              const mkt = markets.find((m) => m.pair === ord.pair);
              const livePrice = mkt ? mkt.price : ord.entryPrice;
              const metrics = computeLiveOrderMetrics(ord, livePrice, mkt?.atrPips);
              const isBuy = ord.direction === 'BUY';
              const currentSlDraft = slDraftByPair[ord.pair] ?? String(ord.stopLoss);
              const currentTpDraft = tpDraftByPair[ord.pair] ?? String(ord.tp2);

              return (
                <div
                  key={ord.id}
                  className={`p-5 rounded-2xl bg-slate-950 border space-y-4 ${
                    metrics.isInProfit ? 'border-[#00C261]/60' : 'border-slate-800'
                  }`}
                >
                  {/* Top Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-lg font-black text-xs ${
                          isBuy ? 'bg-[#00C261] text-black' : 'bg-red-600 text-white'
                        }`}
                      >
                        {ord.direction} MARKET ORDER LOADED
                      </span>
                      <strong className="text-lg text-white">{ord.pair}</strong>
                      <span className="text-xs text-slate-400">
                        {ord.lotSize.toFixed(2)} Lot · {ord.timeframe} · {ord.broker.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#D4AF37] font-bold">
                        Entry @ {ord.entryPrice} (Loaded {ord.loadedAtEat})
                      </span>
                      {metrics.isBreakevenLocked && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-[#00C261] border border-[#00C261]/40 text-[10px] font-black">
                          PROFIT LOCKED ✓
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">
                          Live Candle @ {livePrice} · Floating Net P&amp;L
                        </span>
                        <strong
                          className={`text-base font-black ${
                            metrics.netProfitUsd >= 0 ? 'text-[#00C261]' : 'text-red-400'
                          }`}
                        >
                          {metrics.floatingPips >= 0 ? `+${metrics.floatingPips}p` : `${metrics.floatingPips}p`} ·{' '}
                          {metrics.netProfitUsd >= 0
                            ? `+$${metrics.netProfitUsd.toFixed(2)} (+${metrics.netProfitKes} KES)`
                            : `-$${Math.abs(metrics.netProfitUsd).toFixed(2)} (${metrics.netProfitKes} KES)`}
                        </strong>
                      </div>

                      {onInspectPairCard && (
                        <button
                          type="button"
                          onClick={() => onInspectPairCard(ord.pair)}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 text-xs font-bold transition whitespace-nowrap"
                        >
                          Open Chart Card
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Track Bar */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="font-bold text-white">
                        SL → Entry → Target Progress: {metrics.slToTpProgressPct}%
                      </span>
                      <span className="text-cyan-300 font-bold">
                        {metrics.hitTp2
                          ? 'FINAL TP2 TARGET REACHED! Update SL & Extend TP3'
                          : metrics.hitTp1
                          ? `TP1 REACHED! +${metrics.pipsRemainingToTp2}p left to TP2 (${ord.tp2})`
                          : metrics.isInProfit
                          ? `IN PROFIT (+${metrics.floatingPips}p) · ${metrics.pipsRemainingToTp1}p to TP1`
                          : `${metrics.pipsDistanceAboveSl}p cushion above SL (${ord.stopLoss})`}
                      </span>
                    </div>

                    {/* 1-Click Profit-Lock Assistant for Running Profitable Trades */}
                    {metrics.netProfitUsd >= 0.5 && (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#0B1525] to-emerald-950/90 border border-[#00C261]/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-[0_0_20px_rgba(0,194,97,0.25)]">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-3 w-3 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C261] opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00C261]" />
                          </span>
                          <div>
                            <span className="font-black text-[#00C261] block text-sm">
                              TRADE IN PROFIT: +${metrics.netProfitUsd.toFixed(2)} (+{metrics.floatingPips} pips)
                            </span>
                            <span className="text-[11px] text-slate-300">
                              Institutional Edge: Lock your profit into MT4/MT5 now so this winning trade cannot lose!
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          <button
                            type="button"
                            onClick={() => handleApplySmartAction(ord.pair, 'LOCK_BREAKEVEN')}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/50 font-bold text-xs transition"
                          >
                            1. Lock Breakeven ($0 Risk)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplySmartAction(ord.pair, 'LOCK_PROFIT_55')}
                            className="px-3 py-1.5 rounded-xl bg-[#00C261] hover:bg-emerald-400 text-black font-black text-xs shadow-md transition"
                          >
                            2. Lock +55% (+$${(metrics.netProfitUsd * 0.55).toFixed(2)})
                          </button>
                          <button
                            type="button"
                            onClick={() => copyValue(String(ord.stopLoss), `brk-sl-${ord.id}`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition"
                          >
                            {copiedKey === `brk-sl-${ord.id}` ? (
                              <><Check className="w-3.5 h-3.5 text-[#00C261]" /><span>SL Copied!</span></>
                            ) : (
                              <><Copy className="w-3.5 h-3.5 text-[#D4AF37]" /><span>Copy SL for MT4</span></>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          metrics.isInProfit
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#00C261]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${metrics.slToTpProgressPct}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-red-400 block">Active SL</span>
                          <strong className="text-red-300">{ord.stopLoss}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyValue(String(ord.stopLoss), `brk-sl-${ord.id}`)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-red-300 border border-slate-700"
                          title="Copy Stop Loss"
                        >
                          {copiedKey === `brk-sl-${ord.id}` ? <Check className="w-3 h-3 text-[#00C261]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Locked Entry</span>
                          <strong className="text-white">{ord.entryPrice}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyValue(String(ord.entryPrice), `brk-en-${ord.id}`)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
                          title="Copy Entry Price"
                        >
                          {copiedKey === `brk-en-${ord.id}` ? <Check className="w-3 h-3 text-[#00C261]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-cyan-400 block">TP1 Milestone</span>
                          <strong className="text-cyan-300">{ord.tp1}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyValue(String(ord.tp1), `brk-tp1-${ord.id}`)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700"
                          title="Copy TP1"
                        >
                          {copiedKey === `brk-tp1-${ord.id}` ? <Check className="w-3 h-3 text-[#00C261]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-emerald-400 block">Active TP2</span>
                          <strong className="text-[#00C261]">{ord.tp2}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyValue(String(ord.tp2), `brk-tp2-${ord.id}`)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-[#00C261] border border-slate-700"
                          title="Copy TP2"
                        >
                          {copiedKey === `brk-tp2-${ord.id}` ? <Check className="w-3 h-3 text-[#00C261]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-amber-950/25 border border-[#D4AF37]/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#D4AF37] block">48H Extended TP3</span>
                          <strong className="text-[#D4AF37]">{ord.tp3}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyValue(String(ord.tp3), `brk-tp3-${ord.id}`)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-slate-700"
                          title="Copy TP3"
                        >
                          {copiedKey === `brk-tp3-${ord.id}` ? <Check className="w-3 h-3 text-[#00C261]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Smart Profit-Lock & Custom Update Row */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleApplySmartAction(ord.pair, 'LOCK_BREAKEVEN')}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition whitespace-nowrap"
                      >
                        Lock Breakeven ({metrics.suggestedBreakevenSl})
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplySmartAction(ord.pair, 'LOCK_PROFIT_55')}
                        className="px-3 py-2 rounded-xl bg-[#00C261]/20 hover:bg-[#00C261] text-[#00C261] hover:text-black border border-[#00C261]/50 text-xs font-black transition whitespace-nowrap"
                      >
                        Lock +55% Profit SL ({metrics.suggestedLockProfitSl})
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplySmartAction(ord.pair, 'LOCK_AND_EXPAND')}
                        className="px-3 py-2 rounded-xl btn-gold text-black text-xs font-black transition whitespace-nowrap"
                      >
                        Auto-Lock SL &amp; Extend TP ({metrics.suggestedExpandedTp2})
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          globalLiveStream.updateOrderSlTp(ord.pair, {
                            autoTrailEnabled: !ord.autoTrailEnabled
                          })
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
                          ord.autoTrailEnabled
                            ? 'bg-emerald-950/70 text-[#00C261] border-[#00C261]/50'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        Auto-Trail: {ord.autoTrailEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <input
                          type="number"
                          step="any"
                          value={currentSlDraft}
                          onChange={(e) =>
                            setSlDraftByPair((prev) => ({ ...prev, [ord.pair]: e.target.value }))
                          }
                          aria-label={`Custom SL for ${ord.pair}`}
                          className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-red-300 text-xs font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveCustomSl(ord.pair, ord)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white text-[11px] font-black transition whitespace-nowrap"
                        >
                          Update SL
                        </button>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <input
                          type="number"
                          step="any"
                          value={currentTpDraft}
                          onChange={(e) =>
                            setTpDraftByPair((prev) => ({ ...prev, [ord.pair]: e.target.value }))
                          }
                          aria-label={`Custom TP for ${ord.pair}`}
                          className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[#00C261] text-xs font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveCustomTp(ord.pair, ord)}
                          className="px-2.5 py-1 rounded-lg bg-[#00C261]/20 hover:bg-[#00C261] text-[#00C261] hover:text-black text-[11px] font-black transition whitespace-nowrap"
                        >
                          Update TP
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCloseOrder(ord.pair)}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-950 text-slate-300 hover:text-red-200 border border-slate-700 text-xs font-bold transition whitespace-nowrap"
                      >
                        Close &amp; Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <strong className="text-white text-sm block">No Market Order Currently Loaded</strong>
              <p className="text-xs text-slate-400 font-sans">
                Click "Load BUY/SELL Market Order" on any pair card (or click the button on the right for our top ranked signal) to track live P&amp;L progress and auto-trail SL &amp; TP across the entire site.
              </p>
            </div>
            {markets[0] && (
              <button
                type="button"
                onClick={() =>
                  handleLoadOrder(
                    markets[0].pair,
                    markets[0].bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
                    markets[0].recommendedTf
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-xs uppercase tracking-wider whitespace-nowrap shrink-0"
              >
                Load {markets[0].pair} {markets[0].bias === 'STRONG_SELL' ? 'SELL' : 'BUY'} Order Now
              </button>
            )}
          </div>
        )}

        {/* Recent Completed Order History */}
        {orderHistory.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#D4AF37]">
                <History className="w-4 h-4" />
                <span>EXECUTED ORDER HISTORY ({orderHistory.length} COMPLETED)</span>
              </div>
              <button
                type="button"
                onClick={() => globalLiveStream.clearOrderHistory()}
                className="text-[11px] text-slate-400 hover:text-white font-bold"
              >
                Clear History
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {orderHistory.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-black ${
                          item.direction === 'BUY' ? 'text-[#00C261]' : 'text-red-400'
                        }`}
                      >
                        {item.direction}
                      </span>
                      <strong className="text-white">{item.pair}</strong>
                      <span className="text-[10px] text-slate-400">({item.lotSize.toFixed(2)})</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.entryPrice} → {item.closePrice} · SL {item.finalStopLoss} ({item.slUpdatesCount} updates)
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
  }

  // ============================================================================
  // MODE 3: FULL SINGLE-MARKET EXECUTION & PROFIT-LOCK WORKSTATION
  // ============================================================================
  const activeMarket = markets.find((m) => m.pair === pair) || markets[0];
  const { decimals } = getPairSpecs(pair);
  const pctMap: Partial<Record<CurrencyPair, number>> = {};
  markets.forEach((m) => {
    pctMap[m.pair] = m.change24hPct;
  });
  const liveMacro = getCurrentMacroContext(pctMap);
  const swings = computeCandleSwingLevels(activeMarket.candles);
  const parsedCustomEntry = customEntryDraft ? parseFloat(customEntryDraft) : NaN;
  const effectiveEntryForTicket =
    !isNaN(parsedCustomEntry) && parsedCustomEntry > 0 ? parsedCustomEntry : activeMarket.price;

  const computed = computeRealChartTradeParams({
    targetPair: pair,
    targetTf: timeframe,
    targetBroker: broker,
    price: effectiveEntryForTicket,
    keyLevel: activeMarket.keyLevel,
    ema20: activeMarket.ema20,
    ema50: activeMarket.ema50,
    rsi: activeMarket.rsi,
    atrPips: activeMarket.atrPips,
    swingLow: swings.swingLow,
    swingHigh: swings.swingHigh,
    macro: liveMacro,
    biasOverride: direction,
    previousDirection: direction,
    h1TrendDirection: activeMarket.h1TrendDirection,
    riskConfig
  });

  const existingOrder = activeOrders[pair] || null;
  const pairHistory = orderHistory.filter((h) => h.pair === pair).slice(0, 4);
  const isBuyPlanned = computed.direction === 'BUY';

  return (
    <div className="p-5 rounded-2xl bg-[#0A1120] border-2 border-[#00C261]/55 space-y-4 font-mono tabular-nums">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black flex-wrap">
            <span
              className={`px-3 py-1 rounded-lg ${
                computed.goAheadAssurance.includes('STRONG')
                  ? 'bg-[#00C261] text-black'
                  : computed.goAheadAssurance.includes('GO-AHEAD')
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-amber-400 text-black'
              }`}
            >
              {computed.goAheadAssurance}
            </span>
            <span className="text-cyan-300">
              {computed.alignedFactorsCount}/{computed.totalFactorsCount} Institutional Factors Confirmed ({computed.confidence}% AI)
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white">
            {existingOrder
              ? `Placed Broker Order Active: ${existingOrder.direction} ${existingOrder.pair} @ ${existingOrder.entryPrice}`
              : `Broker Execution Ticket & Order Notification: ${pair} (${computed.orderType})`}
          </h4>
        </div>

        {/* 1-Click Quick Copy Strip + Open Trade Log */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => {
              const activeLot = existingOrder ? existingOrder.lotSize : computed.lotSize;
              const fullPacket = `${computed.brokerSymbol} ${existingOrder ? existingOrder.direction : computed.direction} | Entry: ${existingOrder ? existingOrder.entryPrice : computed.entryPrice} | SL: ${existingOrder ? existingOrder.stopLoss : computed.stopLoss} | TP1: ${existingOrder ? existingOrder.tp1 : computed.tp1} | TP2: ${existingOrder ? existingOrder.tp2 : computed.tp2} | Lot: ${activeLot.toFixed(2)} (Max Risk: $${computed.actualRiskUsd.toFixed(2)})`;
              copyValue(fullPacket, `top-full-${pair}`);
              flashNotice(`COPIED FULL MT4/MT5 TICKET · ${computed.brokerSymbol} ${existingOrder ? existingOrder.direction : computed.direction}`);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1.5 transition whitespace-nowrap shadow-md"
          >
            {copiedKey === `top-full-${pair}` ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey === `top-full-${pair}` ? 'Full Ticket Copied ✓' : 'Copy Full MT4/MT5 Ticket'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              copyValue(String(existingOrder ? existingOrder.stopLoss : computed.stopLoss), `top-sl-${pair}`)
            }
            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
          >
            {copiedKey === `top-sl-${pair}` ? (
              <Check className="w-3.5 h-3.5 text-[#00C261]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy SL: {existingOrder ? existingOrder.stopLoss : computed.stopLoss}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              copyValue(String(existingOrder ? existingOrder.tp2 : computed.tp2), `top-tp-${pair}`)
            }
            className="px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border border-[#00C261]/40 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
          >
            {copiedKey === `top-tp-${pair}` ? (
              <Check className="w-3.5 h-3.5 text-[#00C261]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy TP: {existingOrder ? existingOrder.tp2 : computed.tp2}</span>
          </button>

          <button
            type="button"
            onClick={() => globalLiveStream.requestOpenScannerView('trade_log', pair)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Trade Log</span>
          </button>
        </div>
      </div>

      {/* Extended Entry Zone Warning Banner (if price stretched away from 20 EMA) */}
      {!existingOrder && computed.isExtendedZone && computed.entryTimingWarning && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs font-sans">
          <strong className="font-mono text-amber-300">PULLBACK TIMING GUARD: </strong>
          {computed.entryTimingWarning}
        </div>
      )}

      {statusFeedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-[#00C261]/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {!existingOrder ? (
        /* NOTIFY PIVOTFX WHEN YOU PLACE ORDER ON YOUR BROKER */
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  Placed This Order With {broker.toUpperCase()}? Notify PivotFx to Track Live Progress &amp; SL Guard
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Swing-Protected Entry @ <strong className="text-white">{computed.entryPrice}</strong> · Stop Loss{' '}
                <strong className="text-red-300">{computed.stopLoss}</strong> (-{computed.slPips}p) · TP1{' '}
                <strong className="text-cyan-300">{computed.tp1}</strong> · TP2{' '}
                <strong className="text-[#00C261]">{computed.tp2}</strong> (+{computed.tpPips}p · Net +$
                {computed.netProfitUsd.toFixed(2)}).
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
                <span className="text-[10px] text-slate-400">Fill:</span>
                <input
                  type="number"
                  step="any"
                  value={customEntryDraft}
                  onChange={(e) => setCustomEntryDraft(e.target.value)}
                  placeholder={String(activeMarket.price)}
                  aria-label={`Optional broker fill price for ${pair}`}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white font-bold text-xs outline-none focus:border-[#D4AF37]"
                />
              </div>

              <select
                value={String(selectedLotSize)}
                onChange={(e) =>
                  setSelectedLotSize(
                    e.target.value === 'AUTO' ? 'AUTO' : parseFloat(e.target.value)
                  )
                }
                aria-label="Order Micro Lot Size"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs outline-none focus:border-[#D4AF37]"
              >
                <option value="AUTO">
                  Auto Risk ({computed.lotSize.toFixed(2)} Lot · ${computed.actualRiskUsd.toFixed(2)})
                </option>
                <option value="0.01">0.01 Lot (Micro)</option>
                <option value="0.02">0.02 Lot</option>
                <option value="0.05">0.05 Lot</option>
                <option value="0.10">0.10 Lot (Mini)</option>
              </select>

              <button
                type="button"
                onClick={() => setAutoTrailOnLoad(!autoTrailOnLoad)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
                  autoTrailOnLoad
                    ? 'bg-emerald-950/70 text-[#00C261] border-[#00C261]/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                Auto-Trail SL: {autoTrailOnLoad ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                const logged = globalLiveStream.logSuggestedSetup({
                  pair,
                  timeframe,
                  broker,
                  direction: computed.direction,
                  customEntryPrice:
                    !isNaN(parsedCustomEntry) && parsedCustomEntry > 0 ? parsedCustomEntry : undefined,
                  reasonSummary: computed.entryTimingWarning || `${computed.trendProjectionText} · ${computed.goAheadAssurance}`
                });
                if (logged) {
                  flashNotice(
                    `SAVED TO SUGGESTED TRADE LOG · ${logged.pair} ${logged.direction} @ ${logged.entryPrice}`
                  );
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-xs transition whitespace-nowrap"
            >
              Save Setup to Suggested Trade Log
            </button>

            <button
              type="button"
              onClick={() =>
                handleLoadOrder(
                  pair,
                  computed.direction,
                  timeframe,
                  !isNaN(parsedCustomEntry) && parsedCustomEntry > 0 ? parsedCustomEntry : undefined
                )
              }
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg whitespace-nowrap ${
                isBuyPlanned
                  ? 'bg-[#00C261] hover:bg-[#00dc6e] text-black'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                I Placed {computed.direction} Order With My Broker ({computed.entryPrice})
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE LOADED ORDER PROGRESS + ADVANCED PROFIT-LOCK SL / TP UPDATER */
        (() => {
          const metrics = computeLiveOrderMetrics(existingOrder, activeMarket.price, activeMarket.atrPips);
          const isBuyOrder = existingOrder.direction === 'BUY';
          const currentSlDraft = slDraftByPair[pair] ?? String(existingOrder.stopLoss);
          const currentTpDraft = tpDraftByPair[pair] ?? String(existingOrder.tp2);

          return (
            <div className="space-y-4">
              {/* Top Active Position Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Locked Order Side</span>
                  <strong className={`text-sm font-black ${isBuyOrder ? 'text-[#00C261]' : 'text-red-400'}`}>
                    {existingOrder.direction} @ {existingOrder.entryPrice}
                  </strong>
                  <span className="text-[10px] text-slate-400 block">
                    {existingOrder.lotSize.toFixed(2)} Lot · {existingOrder.loadedAtEat}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border ${
                    metrics.netProfitUsd >= 0
                      ? 'bg-emerald-950/35 border-[#00C261]/60'
                      : 'bg-red-950/35 border-red-500/50'
                  }`}
                >
                  <span className="text-[10px] text-slate-300 block">Live Floating P&amp;L</span>
                  <strong
                    className={`text-base font-black ${
                      metrics.netProfitUsd >= 0 ? 'text-[#00C261]' : 'text-red-400'
                    }`}
                  >
                    {metrics.floatingPips >= 0 ? `+${metrics.floatingPips}p` : `${metrics.floatingPips}p`} ·{' '}
                    {metrics.netProfitUsd >= 0
                      ? `+$${metrics.netProfitUsd.toFixed(2)}`
                      : `-$${Math.abs(metrics.netProfitUsd).toFixed(2)}`}
                  </strong>
                  <span className="text-[10px] text-slate-300 block">
                    {metrics.netProfitKes >= 0 ? `+${metrics.netProfitKes} KES` : `${metrics.netProfitKes} KES`} · Peak +$
                    {Math.max(existingOrder.peakProfitUsd, metrics.netProfitUsd).toFixed(2)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Protected Stop Loss</span>
                  <strong className="text-sm font-black text-red-300">{existingOrder.stopLoss}</strong>
                  <span className="text-[10px] text-[#00C261] block">
                    {metrics.isBreakevenLocked
                      ? `PROFIT LOCKED (${existingOrder.slUpdatesCount} updates)`
                      : `${metrics.pipsDistanceAboveSl}p cushion above SL`}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Target TP1 / TP2</span>
                  <strong className="text-sm font-black text-[#00C261]">
                    {existingOrder.tp1} → {existingOrder.tp2}
                  </strong>
                  <span className="text-[10px] text-cyan-300 block">
                    {metrics.hitTp2
                      ? 'TP2 Reached! Extend TP'
                      : `${metrics.pipsRemainingToTp2}p left to TP2`}
                  </span>
                </div>
              </div>

              {/* Real-Time SL -> Entry -> Live Price -> TP Progress Gauge */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      Live Order Progress ({existingOrder.direction} {existingOrder.pair}): {metrics.slToTpProgressPct}% Toward TP2
                    </span>
                  </span>
                  <span
                    className={`font-black ${
                      metrics.isInProfit ? 'text-[#00C261]' : 'text-amber-300'
                    }`}
                  >
                    {metrics.hitTp2
                      ? 'TP2 TARGET HIT ✓ — Advance SL & Extend TP3 Now'
                      : metrics.hitTp1
                      ? 'TP1 HIT ✓ — Lock Breakeven SL & Hold for TP2'
                      : metrics.isInProfit
                      ? `IN PROFIT (+${metrics.floatingPips}p) — Lock Profit SL Available`
                      : `MONITORING LIVE CANDLE @ ${activeMarket.price.toFixed(decimals)}`}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      metrics.isInProfit
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#00C261]'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${metrics.slToTpProgressPct}%` }}
                  />
                </div>
              </div>

              {/* Advanced Profit-Lock SL & TP Update Toolbar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-[#D4AF37]/40 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[#D4AF37] font-black uppercase flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Advance SL &amp; Extend TP to Lock Growing Profits (Auto-Syncs Brokers Page)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      globalLiveStream.updateOrderSlTp(pair, {
                        autoTrailEnabled: !existingOrder.autoTrailEnabled
                      })
                    }
                    className={`px-3 py-1 rounded-lg font-bold border transition whitespace-nowrap ${
                      existingOrder.autoTrailEnabled
                        ? 'bg-emerald-950/70 text-[#00C261] border-[#00C261]/50'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    Auto-Trail SL on Profit: {existingOrder.autoTrailEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* 1-Click Smart Trailing & Extension Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplySmartAction(pair, 'LOCK_BREAKEVEN')}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/40 font-bold transition whitespace-nowrap"
                  >
                    Lock Breakeven SL → {metrics.suggestedBreakevenSl}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplySmartAction(pair, 'LOCK_PROFIT_55')}
                    className="px-3.5 py-2 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-black transition whitespace-nowrap"
                  >
                    Lock +55% Profit SL → {metrics.suggestedLockProfitSl}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplySmartAction(pair, 'EXPAND_TP')}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 font-black transition whitespace-nowrap"
                  >
                    Extend TP → {metrics.suggestedExpandedTp2} (+${metrics.projectedProfitAtUpdatedTpUsd.toFixed(2)})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplySmartAction(pair, 'LOCK_AND_EXPAND')}
                    className="px-3.5 py-2 rounded-xl btn-gold text-black font-black transition whitespace-nowrap"
                  >
                    Lock Profit SL + Extend TP Simultaneously
                  </button>
                </div>

                {/* Manual SL & TP Inputs with Instant Copy + Close Order */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-red-400 font-bold px-1.5">SL:</span>
                    <input
                      type="number"
                      step="any"
                      value={currentSlDraft}
                      onChange={(e) =>
                        setSlDraftByPair((prev) => ({ ...prev, [pair]: e.target.value }))
                      }
                      aria-label={`Update Stop Loss for ${pair}`}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-red-300 font-bold text-xs outline-none focus:border-red-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveCustomSl(pair, existingOrder)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-[11px] shrink-0 transition"
                    >
                      Set SL
                    </button>
                    <button
                      type="button"
                      onClick={() => copyValue(String(existingOrder.stopLoss), `panel-sl-${pair}`)}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-red-300 border border-slate-700 shrink-0"
                      title="Copy Updated SL"
                    >
                      {copiedKey === `panel-sl-${pair}` ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-[#00C261] font-bold px-1.5">TP:</span>
                    <input
                      type="number"
                      step="any"
                      value={currentTpDraft}
                      onChange={(e) =>
                        setTpDraftByPair((prev) => ({ ...prev, [pair]: e.target.value }))
                      }
                      aria-label={`Update Take Profit for ${pair}`}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[#00C261] font-bold text-xs outline-none focus:border-[#00C261]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveCustomTp(pair, existingOrder)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-[11px] shrink-0 transition"
                    >
                      Set TP
                    </button>
                    <button
                      type="button"
                      onClick={() => copyValue(String(existingOrder.tp2), `panel-tp-${pair}`)}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[#00C261] border border-slate-700 shrink-0"
                      title="Copy Updated TP"
                    >
                      {copiedKey === `panel-tp-${pair}` ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCloseOrder(pair)}
                    className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-red-950/70 text-slate-200 hover:text-red-200 border border-slate-700 hover:border-red-500/50 font-black text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Close &amp; Log Order to History</span>
                  </button>
                </div>
              </div>

              {/* Inline Super AI Drawdown / Position Coach */}
              <div className="p-3.5 rounded-xl bg-[#0D1629] border border-slate-800 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-black">
                    <Bot className="w-4 h-4 shrink-0" />
                    <span>
                      SUPER AI LIVE POSITION &amp; DRAWDOWN COACH ({pair})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRunInlineCoach(existingOrder, activeMarket)}
                    disabled={coachLoading}
                    className="px-3 py-1.5 rounded-lg btn-gold text-black font-black text-[11px] transition whitespace-nowrap"
                  >
                    {coachLoading
                      ? 'Analyzing Position...'
                      : !metrics.isInProfit
                      ? 'Analyze Drawdown & Safe SL'
                      : 'Analyze Profit-Lock Strategy'}
                  </button>
                </div>

                {inlineCoachAdvice ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                      <strong className="text-white">{inlineCoachAdvice.headline}</strong>
                      <span className="text-[#00C261] font-bold">
                        {inlineCoachAdvice.actionBadge}
                      </span>
                    </div>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      {inlineCoachAdvice.recommendation}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-slate-300">
                        AI Safe SL: <strong className="text-red-300">{inlineCoachAdvice.suggestedStopLoss}</strong> · AI TP:{' '}
                        <strong className="text-[#00C261]">{inlineCoachAdvice.suggestedTakeProfit}</strong> · Hard Exit:{' '}
                        <strong className="text-amber-300">{inlineCoachAdvice.keyInvalidationLevel}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const upd = globalLiveStream.updateOrderSlTp(pair, {
                            stopLoss: inlineCoachAdvice.suggestedStopLoss,
                            tp2: inlineCoachAdvice.suggestedTakeProfit
                          });
                          if (upd) {
                            flashNotice(
                              `AI COACH APPLIED TO ${pair}: SL ${upd.stopLoss} · TP ${upd.tp2}`
                            );
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-[#00C261] text-black font-black text-[11px]"
                      >
                        Apply AI SL &amp; TP
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 font-sans">
                    Click the button on the right to get live Gemini 3.8 Flash coaching on whether to hold inside ATR swing protection, tighten SL on structure break, or trail profit targets.
                  </p>
                )}
              </div>
            </div>
          );
        })()
      )}

      {/* Per-Pair Recent Order History (when any closed order exists for this pair) */}
      {pairHistory.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>{pair} Closed Order History</span>
            </span>
            <span>{pairHistory.length} recent</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pairHistory.map((h) => (
              <div
                key={h.id}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div>
                  <span
                    className={`font-black ${
                      h.direction === 'BUY' ? 'text-[#00C261]' : 'text-red-400'
                    }`}
                  >
                    {h.direction}
                  </span>{' '}
                  <strong className="text-white">
                    {h.entryPrice} → {h.closePrice}
                  </strong>
                  <span className="text-[10px] text-slate-400 block">
                    Final SL {h.finalStopLoss} · {h.closedAtEat}
                  </span>
                </div>
                <strong
                  className={
                    h.realizedUsd >= 0 ? 'text-[#00C261] font-black' : 'text-red-400 font-black'
                  }
                >
                  {h.realizedPips >= 0 ? `+${h.realizedPips}p` : `${h.realizedPips}p`} ·{' '}
                  {h.realizedUsd >= 0
                    ? `+$${h.realizedUsd.toFixed(2)}`
                    : `-$${Math.abs(h.realizedUsd).toFixed(2)}`}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
