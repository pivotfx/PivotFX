import React, { useState, useEffect } from 'react';
import { CurrencyPair, Timeframe, BrokerId } from '../../types';
import {
  MarketScanData,
  INITIAL_MARKETS_DATA,
  globalLiveStream,
  computeRealChartTradeParams,
  evaluatePairKenyaTiming,
  getCurrentMacroContext
} from '../../utils/liveMarketEngine';
import { LiveInteractiveCandleChart } from './LiveInteractiveCandleChart';
import {
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Award,
  Zap,
  Bot,
  Copy,
  Check,
  BarChart3,
  Target,
  ArrowLeft,
  ArrowRight,
  Activity,
  Radar,
  Clock
} from 'lucide-react';

export type { MarketScanData };
export { INITIAL_MARKETS_DATA };

interface MultiMarketRadarEngineProps {
  selectedBroker: BrokerId;
  onSelectMarketForAnalysis: (market: MarketScanData, mode?: 'standard' | 'deep_ai') => void;
  onOpenTradingViewForPair: (pair: CurrencyPair, tf?: Timeframe, price?: number) => void;
}

export const MultiMarketRadarEngine: React.FC<MultiMarketRadarEngineProps> = ({
  selectedBroker,
  onSelectMarketForAnalysis,
  onOpenTradingViewForPair,
}) => {
  const [markets, setMarkets] = useState<MarketScanData[]>(() => globalLiveStream.getState().markets);
  const [lastScannedTime, setLastScannedTime] = useState<string>(() => globalLiveStream.getState().syncedAt);
  const [feedConnected, setFeedConnected] = useState<boolean>(() => globalLiveStream.getState().liveFeedConnected);
  const [lockedPairs, setLockedPairs] = useState<Partial<Record<CurrencyPair, boolean>>>(
    () => globalLiveStream.getState().lockedPairs
  );
  const [customTfs, setCustomTfs] = useState<Partial<Record<CurrencyPair, Timeframe>>>(
    () => globalLiveStream.getState().customTimeframes
  );
  const [activeScanMode, setActiveScanMode] = useState<'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai'>(
    () => globalLiveStream.getState().lastScanMode
  );
  const [superAiAuto, setSuperAiAuto] = useState<boolean>(
    () => globalLiveStream.getState().superAiAutoEnabled
  );
  const [superAiNotes, setSuperAiNotes] = useState(
    () => globalLiveStream.getState().superAiNotes
  );
  const [isScanning, setIsScanning] = useState(false);
  const [filterBias, setFilterBias] = useState<'ALL' | 'PCT_MOVERS' | 'BUY' | 'SELL' | 'FLIPPED'>('ALL');
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(
    () => globalLiveStream.getState().selectedPair
  );
  const [inspectedSideByPair, setInspectedSideByPair] = useState<Partial<Record<CurrencyPair, 'AUTO' | 'BUY' | 'SELL'>>>({});
  const [scanBanner, setScanBanner] = useState<string | null>(null);
  const [copiedCardPair, setCopiedCardPair] = useState<string | null>(null);
  const [copiedEa, setCopiedEa] = useState(false);

  // Subscribe to global 24/7 every-second live market stream & Super AI Auto notes
  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setMarkets(streamState.markets);
      setLastScannedTime(streamState.syncedAt);
      setFeedConnected(streamState.liveFeedConnected);
      setLockedPairs(streamState.lockedPairs);
      setCustomTfs(streamState.customTimeframes);
      setSuperAiAuto(streamState.superAiAutoEnabled);
      setSuperAiNotes(streamState.superAiNotes);
      if (streamState.selectedPair !== undefined && streamState.selectedPair !== selectedPair) {
        setSelectedPair(streamState.selectedPair);
      }
    });
    return () => unsubscribe();
  }, [selectedPair]);

  const handleOpenPairCard = (pairToOpen: CurrencyPair) => {
    setSelectedPair(pairToOpen);
    globalLiveStream.setSelectedPair(pairToOpen);
    if (superAiAuto || !superAiNotes[pairToOpen]) {
      void globalLiveStream.fetchSuperAiNoteForPair(pairToOpen, customTfs[pairToOpen], true);
    }
  };

  const handleClosePairCard = () => {
    setSelectedPair(null);
    globalLiveStream.setSelectedPair(null);
  };

  const playRadarBeep = (freq = 1050) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch {
      // Audio fallback
    }
  };

  // Instant Scan All Markets / Rescan / Deep AI Scan
  const handleRunScan = async (mode: 'scan_all' | 'rescan' | 'deep_ai') => {
    setIsScanning(true);
    setActiveScanMode(mode);
    const updatedState = await globalLiveStream.triggerScan(mode);
    setIsScanning(false);

    const leader = updatedState.markets[0];
    const modeLabel =
      mode === 'deep_ai'
        ? 'DEEP AI SCAN'
        : mode === 'rescan'
        ? 'LIVE RESCAN'
        : 'SCAN ALL MARKETS';

    if (leader) {
      const dirWord = leader.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
      const pctStr = leader.change24hPct >= 0 ? `+${leader.change24hPct}%` : `${leader.change24hPct}%`;
      const netUsd = leader.netProfitUsd ?? Number((leader.projectedPips * 0.1).toFixed(2));
      const netKes = leader.netProfitKes ?? Math.round(netUsd * 130);
      const verdictPrefix = leader.orderVerdictLabel || `FAVOURABLE ${dirWord} ORDER`;
      setScanBanner(
        `${modeLabel} (${updatedState.syncedAt}) · ${verdictPrefix}: ${leader.pair} [${leader.recommendedTf}] @ ${leader.price} (${pctStr}) · Trend: ${leader.trendDirection} · Est. Net Profit: +$${netUsd.toFixed(2)} (+${netKes} KES) · SL ${leader.suggestedSL} · TP ${leader.suggestedTP2}`
      );
      setTimeout(() => setScanBanner(null), 6500);
    }

    playRadarBeep(mode === 'deep_ai' ? 1220 : mode === 'rescan' ? 1120 : 1020);
  };

  // Filtered & Sorted Markets (#1, #2, #3... live leaderboard)
  const filteredMarkets = (() => {
    const base = markets.filter((m) => {
      if (filterBias === 'BUY') return m.bias === 'STRONG_BUY';
      if (filterBias === 'SELL') return m.bias === 'STRONG_SELL';
      if (filterBias === 'FLIPPED') return Boolean(m.directionFlipped);
      return true;
    });
    if (filterBias === 'PCT_MOVERS') {
      return [...base].sort((a, b) => Math.abs(b.change24hPct) - Math.abs(a.change24hPct));
    }
    return base;
  })();

  const macroContext = (() => {
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    markets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    return getCurrentMacroContext(pctMap);
  })();

  const topLeader = markets[0];
  const focusedMarket = selectedPair ? markets.find((m) => m.pair === selectedPair) || null : null;
  const TIMEFRAME_CHOICES: Timeframe[] = ['M5', 'M10', 'M15', 'H1', 'H4'];

  return (
    <div className="space-y-6">
      {/* 1. TOP SPEED SCANNER HEADER: 24/7 EVERY-SECOND SYNC + 3 SCAN BUTTONS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap tabular-nums">
            <span className="text-[#00C261] font-bold">24/7 Auto-Sync (0.5s)</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#D4AF37]">
              {feedConnected ? 'Interbank & Crypto Stream Active' : 'Calibrated Real-Time Feed'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-white font-bold">{lastScannedTime}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            AI Market Scanner · Trend, Open Window &amp; Independent Cards
          </h3>
          <p className="text-xs text-slate-300 font-mono max-w-3xl">
            Updates automatically every 0.5s with live trend direction, BUY/SELL plan, and Market Open/Opens-In countdown. Click any card to inspect live candles and real-time Super AI notes.
          </p>
        </div>

        {/* FOUR INDEPENDENT CONTROLS: Super AI Auto | Scan All Markets | Rescan | Deep AI Scan */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 w-full xl:w-auto">
          <button
            type="button"
            onClick={() => globalLiveStream.setSuperAiAuto(!superAiAuto)}
            className={`px-3.5 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap shrink-0 border ${
              superAiAuto
                ? 'bg-emerald-950/70 text-[#00C261] border-[#00C261]/60'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Super AI Auto: {superAiAuto ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('scan_all')}
            disabled={isScanning}
            className={`px-4 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
              activeScanMode === 'scan_all'
                ? 'bg-cyan-400 text-black'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700'
            }`}
          >
            <Radar className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'scan_all' ? 'animate-spin' : ''}`} />
            <span>Scan All Markets</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('rescan')}
            disabled={isScanning}
            className={`px-4 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
              activeScanMode === 'rescan'
                ? 'bg-[#00C261] text-black'
                : 'bg-slate-900 hover:bg-slate-800 text-[#00C261] border border-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'rescan' ? 'animate-spin' : ''}`} />
            <span>Rescan</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('deep_ai')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'deep_ai' ? 'animate-spin' : ''}`} />
            <span>Deep AI Scan</span>
          </button>
        </div>
      </div>

      {/* Live Scan Status Flash Banner */}
      {scanBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-[#00C261]/50 text-emerald-200 text-xs font-mono flex items-center justify-between gap-2 tabular-nums animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0" />
            <span>{scanBanner}</span>
          </div>
          <span className="text-[11px] text-[#00C261] font-bold shrink-0">Synced ✓</span>
        </div>
      )}

      {/* =========================================================================
          VIEW A: SINGLE SELECTED MARKET CHART & DEEP AI WORKSPACE
          Opens ONLY when user clicks a specific card! Includes prominent Back button.
          ========================================================================= */}
      {focusedMarket ? (
        (() => {
          const activeTf = customTfs[focusedMarket.pair] || focusedMarket.recommendedTf;
          const aiRecommendedSide: 'BUY' | 'SELL' = focusedMarket.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
          const selectedSideMode = inspectedSideByPair[focusedMarket.pair] || 'AUTO';
          const effectiveBias: 'BUY' | 'SELL' =
            selectedSideMode === 'AUTO' ? aiRecommendedSide : selectedSideMode;

          const computed = computeRealChartTradeParams({
            targetPair: focusedMarket.pair,
            targetTf: activeTf,
            targetBroker: selectedBroker,
            price: focusedMarket.price,
            keyLevel: focusedMarket.keyLevel,
            ema20: focusedMarket.ema20,
            ema50: focusedMarket.ema50,
            rsi: focusedMarket.rsi,
            atrPips: focusedMarket.atrPips,
            macro: macroContext,
            biasOverride: effectiveBias,
            previousDirection: aiRecommendedSide,
            previousTrendDirection: focusedMarket.trendDirection,
            h1TrendDirection: focusedMarket.h1TrendDirection
          });
          const oppositeSide: 'BUY' | 'SELL' = computed.direction === 'BUY' ? 'SELL' : 'BUY';
          const oppositeComputed = computeRealChartTradeParams({
            targetPair: focusedMarket.pair,
            targetTf: activeTf,
            targetBroker: selectedBroker,
            price: focusedMarket.price,
            keyLevel: focusedMarket.keyLevel,
            ema20: focusedMarket.ema20,
            ema50: focusedMarket.ema50,
            rsi: focusedMarket.rsi,
            atrPips: focusedMarket.atrPips,
            macro: macroContext,
            biasOverride: oppositeSide,
            h1TrendDirection: focusedMarket.h1TrendDirection
          });
          const kenyaTiming = evaluatePairKenyaTiming(focusedMarket.pair);
          const isBuy = computed.direction === 'BUY';
          const pctPositive = focusedMarket.change24hPct >= 0;
          const rankNum = markets.findIndex((x) => x.pair === focusedMarket.pair) + 1;

          const eaMqlCode = `// --- PIVOTFX LIVE AUTO-SYNC EA CONFIG ---
// Broker: ${selectedBroker.toUpperCase()} | Synced: ${lastScannedTime} | Rank #${rankNum}
// Symbol: ${computed.brokerSymbol} (${focusedMarket.pair} · ${activeTf})
// Direction: ${computed.orderType} | Trend: ${computed.trendProjectionText} | 24h Move: ${pctPositive ? '+' : ''}${focusedMarket.change24hPct}%
// Live Indicators: 20 EMA = ${focusedMarket.ema20} | 50 EMA = ${focusedMarket.ema50} | RSI = ${focusedMarket.rsi}
// Gilgil Shield: 0.01 Micro Lot ($2.00 / 260 KES Max Risk Cap)

input double   LotSize             = 0.01;
input double   EntryPrice          = ${computed.entryPrice};
input double   StopLoss            = ${computed.stopLoss}; // -${computed.slPips} pips ($${computed.actualRiskUsd.toFixed(2)} max risk)
input double   TakeProfit_1        = ${computed.tp1}; // 1H-4H: Close 50% & Move SL to BE
input double   TakeProfit_2        = ${computed.tp2}; // 4H-12H Session Target (+${computed.tpPips} pips)
input double   TakeProfit_3_48H    = ${computed.tp3}; // 12H-48H Extended Swing (+${computed.tp3Pips} pips / +$${computed.netProfit48hUsd.toFixed(2)})
input double   MaxRiskUsdPerTrade  = 2.00;`;

          return (
            <div className="space-y-5 animate-in fade-in duration-200 font-mono tabular-nums">
              {/* Top Return Bar + Quick Switcher for Top #1–#4 */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClosePairCard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-slate-700 text-xs font-bold transition whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to All Scanned Cards (#1–#{markets.length})</span>
                </button>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 mr-1">Top Setups:</span>
                  {markets.slice(0, 4).map((mItem, idx) => (
                    <button
                      key={mItem.pair}
                      type="button"
                      onClick={() => handleOpenPairCard(mItem.pair)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                        mItem.pair === focusedMarket.pair
                          ? 'bg-[#D4AF37] text-black font-black'
                          : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      #{idx + 1} {mItem.pair} ({mItem.change24hPct >= 0 ? `+${mItem.change24hPct}%` : `${mItem.change24hPct}%`})
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Single-Market Live Chart & Execution Card */}
              <div className="rounded-3xl p-5 sm:p-6 bg-slate-950 border-2 border-[#D4AF37] shadow-2xl space-y-5">
                {/* Market Title, Rank, Direction, % Move & Timeframe Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black font-black">
                        RANK #{rankNum}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg font-black ${
                          isBuy
                            ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/50'
                            : 'bg-red-500/20 text-red-300 border border-red-500/50'
                        }`}
                      >
                        {computed.orderType}
                      </span>
                      {focusedMarket.directionFlipped && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/50 font-black">
                          DIRECTION FLIPPED ({focusedMarket.previousDirection} → {computed.direction})
                        </span>
                      )}
                      <span className="text-[#00C261] font-black">{computed.confidence}% AI Confidence</span>
                    </div>

                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        {focusedMarket.pair} ({computed.brokerSymbol})
                      </h2>
                      <span className="text-xl font-black text-[#D4AF37]">@ {focusedMarket.price}</span>
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-black ${
                          pctPositive ? 'text-[#00C261]' : 'text-red-400'
                        }`}
                      >
                        {pctPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {pctPositive ? `+${focusedMarket.change24hPct.toFixed(2)}%` : `${focusedMarket.change24hPct.toFixed(2)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Timeframe Selector Bar + Inspect Other Side (BUY vs SELL) */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      {(['AUTO', 'BUY', 'SELL'] as const).map((sideOpt) => (
                        <button
                          key={sideOpt}
                          type="button"
                          onClick={() =>
                            setInspectedSideByPair((prev) => ({
                              ...prev,
                              [focusedMarket.pair]: sideOpt
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition ${
                            selectedSideMode === sideOpt
                              ? sideOpt === 'BUY'
                                ? 'bg-[#00C261] text-black'
                                : sideOpt === 'SELL'
                                ? 'bg-red-500 text-white'
                                : 'bg-[#D4AF37] text-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {sideOpt === 'AUTO' ? `AI (${aiRecommendedSide})` : `Inspect ${sideOpt}`}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {TIMEFRAME_CHOICES.map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => globalLiveStream.setPairTimeframe(focusedMarket.pair, tf)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            activeTf === tf
                              ? 'bg-[#D4AF37] text-black font-black'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COLOR-CODED MARKET OPEN / COUNTDOWN & TREND PROJECTION BANNER */}
                <div
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
                    kenyaTiming.windowStatusCode === 'OPEN'
                      ? 'bg-emerald-950/45 border-[#00C261]/70 text-emerald-100'
                      : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                      ? 'bg-amber-950/45 border-amber-400/70 text-amber-100'
                      : 'bg-red-950/55 border-red-500/80 text-red-100'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Clock className="w-4 h-4 shrink-0" />
                    <strong className="text-white">{kenyaTiming.bannerHeadline}</strong>
                    <span className="text-slate-300">· Timeframe: {activeTf}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap font-black">
                    <span
                      className={
                        computed.trendDirection === 'UPTREND'
                          ? 'text-[#00C261]'
                          : computed.trendDirection === 'DOWNTREND'
                          ? 'text-red-300'
                          : 'text-amber-300'
                      }
                    >
                      {computed.trendProjectionText}
                    </span>
                  </div>
                </div>

                {/* WHAT TO ORDER & NET TRAJECTORY PROFIT EXPECTANCY CARD */}
                <div
                  className={`p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs ${
                    computed.direction === 'BUY'
                      ? 'bg-emerald-950/25 border-[#00C261]/50'
                      : 'bg-red-950/25 border-red-500/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg font-black text-[11px] ${
                          computed.direction === 'BUY'
                            ? 'bg-[#00C261] text-black'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {selectedSideMode === 'AUTO'
                          ? `AI PRIMARY ORDER: PLACE ${computed.direction} (${computed.orderType})`
                          : `CHOSEN SIDE ANALYSIS (${selectedSideMode}): ${computed.orderType}`}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[#D4AF37] font-bold text-[10px]">
                        H1 MACRO LOCK: {computed.h1TrendDirection} · Anti-Whipsaw Active
                      </span>
                    </div>
                    <p className="text-slate-200 font-bold leading-snug">
                      {computed.profitOutlookText}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 shrink-0 text-center">
                    <div className="px-3 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/35">
                      <span className="text-[10px] text-emerald-300 block">12H TP2 Net Profit</span>
                      <strong className="text-sm text-[#00C261]">
                        +${computed.netProfitUsd.toFixed(2)} (+{computed.netProfitKes} KES)
                      </strong>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/35">
                      <span className="text-[10px] text-cyan-300 block">48H Extended TP3</span>
                      <strong className="text-sm text-cyan-300">
                        +${computed.netProfit48hUsd.toFixed(2)} (+{computed.netProfit48hKes} KES)
                      </strong>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-slate-950/90 border border-[#D4AF37]/35">
                      <span className="text-[10px] text-[#D4AF37] block">0.05 Lot 48H Target</span>
                      <strong className="text-sm text-[#D4AF37]">
                        +${(computed.netProfit48hUsd * 5).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE LIVE CANDLESTICK CHART (Updates screen + summary cards in real time as candle price changes!) */}
                <LiveInteractiveCandleChart
                  pair={focusedMarket.pair}
                  timeframe={activeTf}
                  candles={focusedMarket.candles || []}
                  livePrice={focusedMarket.price}
                  ema20={focusedMarket.ema20}
                  ema50={focusedMarket.ema50}
                  entryPrice={computed.entryPrice}
                  stopLoss={computed.stopLoss}
                  tp1={computed.tp1}
                  tp2={computed.tp2}
                  direction={computed.direction}
                  change24hPct={focusedMarket.change24hPct}
                  isLockedToCustom={Boolean(lockedPairs[focusedMarket.pair])}
                  onCandlePriceChange={(newPrice) =>
                    globalLiveStream.setCustomCandlePrice(focusedMarket.pair, newPrice, activeTf)
                  }
                  onResetToLiveStream={() => globalLiveStream.unlockPairToLiveStream(focusedMarket.pair)}
                />

                {/* 5-CARD AUTO-SYNCED EXECUTION NUMBERS ROW */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Live Entry</span>
                    <strong className="text-base text-white">{computed.entryPrice}</strong>
                    <span className="text-[10px] text-[#00C261] block">Auto-Synced Candle</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-red-950/35 border border-red-500/40">
                    <span className="text-[10px] text-red-300 block">Stop Loss (-{computed.slPips}p)</span>
                    <strong className="text-base text-red-400">{computed.stopLoss}</strong>
                    <span className="text-[10px] text-red-300 block">${computed.actualRiskUsd.toFixed(2)} Max Risk</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-cyan-950/35 border border-cyan-500/40">
                    <span className="text-[10px] text-cyan-300 block">TP1 (50% Scale-Out)</span>
                    <strong className="text-base text-cyan-300">{computed.tp1}</strong>
                    <span className="text-[10px] text-slate-400 block">Move SL to Breakeven</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-950/35 border border-emerald-500/40">
                    <span className="text-[10px] text-emerald-300 block">Final TP2 (+{computed.tpPips}p)</span>
                    <strong className="text-base text-[#00C261]">{computed.tp2}</strong>
                    <span className="text-[10px] text-emerald-300 block">R:R {computed.riskReward}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      kenyaTiming.windowStatusCode === 'OPEN'
                        ? 'bg-emerald-950/30 border-[#00C261]/50'
                        : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                        ? 'bg-amber-950/30 border-amber-400/50'
                        : 'bg-red-950/30 border-red-500/50'
                    }`}
                  >
                    <span
                      className={`text-[10px] block font-bold ${
                        kenyaTiming.windowStatusCode === 'OPEN'
                          ? 'text-[#00C261]'
                          : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                          ? 'text-amber-300'
                          : 'text-red-300'
                      }`}
                    >
                      {kenyaTiming.windowStatusCode === 'OPEN'
                        ? 'MARKET OPEN · CLOSES IN'
                        : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                        ? 'TO OPEN · OPENS IN'
                        : 'CLOSED · OPENS IN'}
                    </span>
                    <strong className="text-sm text-white block">{kenyaTiming.countdownFormatted}</strong>
                    <span className="text-[10px] text-slate-300 block truncate">{kenyaTiming.currentWindowName}</span>
                  </div>
                </div>

                {/* REAL-TIME SUPER AI LIVE TACTICAL NOTES PANEL */}
                {(() => {
                  const aiNote = superAiNotes[focusedMarket.pair];
                  return (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-[#D4AF37]/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                          <Sparkles className="w-4 h-4 shrink-0" />
                          <span>
                            {aiNote?.headline || `Super AI Live Note · ${focusedMarket.pair} (${activeTf})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>
                            {aiNote
                              ? `${aiNote.source === 'gemini-3.8-flash' ? 'Super AI Live' : 'Quant Stream'} · ${aiNote.syncedAt}`
                              : `Synced · ${lastScannedTime}`}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              void globalLiveStream.fetchSuperAiNoteForPair(focusedMarket.pair, activeTf, true)
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 font-bold transition whitespace-nowrap"
                          >
                            Refresh Note
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {aiNote?.note || focusedMarket.projection}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 pt-1">
                        <span>
                          Invalidation:{' '}
                          <strong className="text-red-300">
                            {aiNote?.invalidationNote || `Close beyond SL ${computed.stopLoss}`}
                          </strong>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Catalyst Watch:{' '}
                          <strong className="text-cyan-300">
                            {aiNote?.catalystWatch || `${kenyaTiming.currentWindowName} · DXY ${macroContext.dxyPressurePct >= 0 ? `+${macroContext.dxyPressurePct}%` : `${macroContext.dxyPressurePct}%`}`}
                          </strong>
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Opposite Side Quick Comparison + Human Co-Pilot Verification */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Opposite Side Reference ({oppositeSide} BY MARKET):
                      </span>
                      <span className="text-slate-200 font-bold">
                        Entry {oppositeComputed.entryPrice} · SL{' '}
                        <strong className="text-red-400">{oppositeComputed.stopLoss}</strong> · TP2{' '}
                        <strong className="text-[#00C261]">{oppositeComputed.tp2}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setInspectedSideByPair((prev) => ({
                          ...prev,
                          [focusedMarket.pair]: oppositeSide
                        }))
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 text-[11px] font-black shrink-0 transition whitespace-nowrap"
                    >
                      Switch to {oppositeSide}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0 mt-0.5" />
                    <span className="text-slate-200 leading-snug">{computed.humanCheckNote}</span>
                  </div>
                </div>

                {/* Multi-Horizon Longer Institutional Trajectory + Technical Indicators */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                  <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-900/75 border border-[#D4AF37]/40 space-y-3">
                    <div className="flex items-center justify-between text-[#D4AF37] font-bold flex-wrap gap-1">
                      <span className="flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        <span>Longer 1H–48H {computed.direction} Trajectory &amp; Factor Projection</span>
                      </span>
                      <span className="text-emerald-400">Spread ~{computed.brokerSpread}p · 48H TP3: {computed.tp3}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{computed.trajectory}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                      {computed.trajectoryHorizons.map((step) => (
                        <div
                          key={step.horizon}
                          className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1"
                        >
                          <span className="text-[10px] text-[#D4AF37] font-black block">{step.horizon}</span>
                          <div className="text-sm font-black text-white">
                            @ {step.targetPrice}{' '}
                            <span className="text-[#00C261] text-xs">
                              ({isBuy ? `+${step.targetPips}p` : `-${step.targetPips}p`})
                            </span>
                          </div>
                          <div className="text-[10px] text-cyan-300 font-bold">
                            Est. Net: +${step.netProfitUsd.toFixed(2)} (+{step.netProfitKes} KES)
                          </div>
                          <p className="text-[10px] text-slate-300 leading-snug">{step.driverSummary}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-cyan-300">
                      {kenyaTiming.statusLabel}: {kenyaTiming.reasonText}
                    </p>
                  </div>

                  <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 grid grid-cols-2 gap-2.5 content-start">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">20 EMA (Cyan)</span>
                      <strong className="text-cyan-300">{focusedMarket.ema20}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">50 EMA (Amber)</span>
                      <strong className="text-amber-300">{focusedMarket.ema50}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">RSI (14) Momentum</span>
                      <strong className="text-white">{focusedMarket.rsi}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">H1 Macro Structure</span>
                      <strong className="text-[#D4AF37]">{computed.h1TrendDirection}</strong>
                    </div>
                  </div>
                </div>

                {/* ALL-FACTOR INSTITUTIONAL BUY / SELL JUDGMENT MATRIX (5 Factors) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-[#D4AF37]/40 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] font-black uppercase tracking-wider">
                        All-Factor AI Judgment Scorecard ({computed.orderType})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-black">
                      <span className="text-[#00C261]">BULL: {computed.bullScorePct}%</span>
                      <span className="text-slate-600">vs</span>
                      <span className="text-red-400">BEAR: {computed.bearScorePct}%</span>
                      <span className="text-slate-400">· DXY {macroContext.dxyPressurePct >= 0 ? `+${macroContext.dxyPressurePct}%` : `${macroContext.dxyPressurePct}%`}</span>
                    </div>
                  </div>

                  {/* Visual Bull vs Bear Weight Bar */}
                  <div className="w-full h-2.5 rounded-full bg-red-950/70 overflow-hidden flex border border-slate-800">
                    <div
                      className="h-full bg-[#00C261] transition-all duration-300"
                      style={{ width: `${computed.bullScorePct}%` }}
                    />
                    <div
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${computed.bearScorePct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                    {computed.factorVerdicts.map((fv) => (
                      <div
                        key={fv.name}
                        className={`p-3 rounded-xl border space-y-1 ${
                          fv.signal === 'BUY'
                            ? 'bg-emerald-950/25 border-emerald-500/35'
                            : fv.signal === 'SELL'
                            ? 'bg-red-950/25 border-red-500/35'
                            : 'bg-amber-950/25 border-amber-500/35'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-slate-300 truncate">{fv.name}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                              fv.signal === 'BUY'
                                ? 'bg-[#00C261]/25 text-[#00C261]'
                                : fv.signal === 'SELL'
                                ? 'bg-red-500/25 text-red-300'
                                : 'bg-amber-500/25 text-amber-300'
                            }`}
                          >
                            {fv.signal}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug">{fv.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto-Synced EA Script */}
                <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                      <Bot className="w-4 h-4" />
                      <span>Live Auto-Synced EA Parameters ({focusedMarket.pair} [{activeTf}])</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(eaMqlCode);
                        setCopiedEa(true);
                        setTimeout(() => setCopiedEa(false), 2000);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      {copiedEa ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEa ? 'EA Copied!' : 'Copy EA Config'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/70 border border-slate-800/80 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                    {eaMqlCode}
                  </pre>
                </div>

                {/* Action Footer with Instant Reanalyse + Return Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleRunScan('deep_ai')}
                      disabled={isScanning}
                      className="px-4 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                      <span>Reanalyse Whole Market</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectMarketForAnalysis({ ...focusedMarket, recommendedTf: activeTf }, 'deep_ai')
                      }
                      className="px-4 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Open Full Order Ticket</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenTradingViewForPair(focusedMarket.pair, activeTf, focusedMarket.price)
                      }
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>External TradingView</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPair(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 font-black text-xs flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to All Scanned Cards</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        /* =========================================================================
           VIEW B: UNCONGESTED 8 INDEPENDENT CLICKABLE RESULT CARDS
           Top summary shows strictly: #Rank (#1, #2, #3...), Pair, %, Candle Price, BUY/SELL, SL, TP
           Clicking any card opens View A (Chart Candles & Deep Analysis)
           ========================================================================= */
        <div className="space-y-5">
          {/* #1 Live Leader Quick Strip */}
          {topLeader && (() => {
            const topComputed = computeRealChartTradeParams({
              targetPair: topLeader.pair,
              targetTf: customTfs[topLeader.pair] || topLeader.recommendedTf,
              targetBroker: selectedBroker,
              price: topLeader.price,
              keyLevel: topLeader.keyLevel,
              ema20: topLeader.ema20,
              ema50: topLeader.ema50,
              rsi: topLeader.rsi,
              atrPips: topLeader.atrPips,
              biasOverride: topLeader.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
              previousDirection: topLeader.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
              previousTrendDirection: topLeader.trendDirection,
              h1TrendDirection: topLeader.h1TrendDirection
            });
            const topPctPos = topLeader.change24hPct >= 0;

            return (
              <div
                onClick={() => handleOpenPairCard(topLeader.pair)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenPairCard(topLeader.pair);
                  }
                }}
                className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0E1629] to-slate-900 border border-[#D4AF37] cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono tabular-nums transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black font-black flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>#1 LEADING SETUP · {topComputed.orderVerdictLabel}</span>
                    </span>
                    <span className="text-cyan-300 font-bold">
                      TF: {customTfs[topLeader.pair] || topLeader.recommendedTf} · {topComputed.trendDirection}
                    </span>
                    <span className="text-[#00C261] font-black">{topComputed.confidence}% AI</span>
                  </div>

                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-white">{topLeader.pair}</span>
                    <span className="text-lg font-black text-[#D4AF37]">@ {topLeader.price}</span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-sm font-black ${
                        topPctPos ? 'text-[#00C261]' : 'text-red-400'
                      }`}
                    >
                      {topPctPos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {topPctPos ? `+${topLeader.change24hPct}%` : `${topLeader.change24hPct}%`}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        topComputed.direction === 'BUY'
                          ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {topComputed.orderType}
                    </span>
                    <span className="text-xs font-black text-emerald-300">
                      Est. Profit: +${topComputed.netProfitUsd.toFixed(2)} (+{topComputed.netProfitKes} KES) · {topComputed.riskReward}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
                  <div className="grid grid-cols-3 gap-2.5 text-xs bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Entry</span>
                      <strong className="text-white">{topComputed.entryPrice}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-400 block">SL (-${topComputed.actualRiskUsd.toFixed(2)})</span>
                      <strong className="text-red-300">{topComputed.stopLoss}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">TP2 (+${topComputed.netProfitUsd.toFixed(2)})</span>
                      <strong className="text-[#00C261]">{topComputed.tp2}</strong>
                    </div>
                  </div>

                  <span className="px-4 py-3 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                    <span>Open Chart & Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono text-slate-400 font-bold mr-1">Sort / Filter:</span>
              {([
                { id: 'ALL', label: 'All 8 (#1–#8 AI Rank)' },
                { id: 'PCT_MOVERS', label: 'Top % Movers' },
                { id: 'BUY', label: 'Bullish (BUY)' },
                { id: 'SELL', label: 'Bearish (SELL)' },
                { id: 'FLIPPED', label: 'Direction Flips' }
              ] as const).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setFilterBias(mode.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap shrink-0 ${
                    filterBias === mode.id
                      ? 'bg-[#D4AF37] text-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-mono text-slate-400">
              Click any card below to inspect live candles, net profit trajectory &amp; BUY/SELL sides
            </div>
          </div>

          {/* 8 INDEPENDENT CLICKABLE SUMMARY CARDS (Uncongested Top Metrics Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMarkets.map((m) => {
              const activeTf = customTfs[m.pair] || m.recommendedTf;
              const computed = computeRealChartTradeParams({
                targetPair: m.pair,
                targetTf: activeTf,
                targetBroker: selectedBroker,
                price: m.price,
                keyLevel: m.keyLevel,
                ema20: m.ema20,
                ema50: m.ema50,
                rsi: m.rsi,
                atrPips: m.atrPips,
                macro: macroContext,
                biasOverride: m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
                previousDirection: m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
                previousTrendDirection: m.trendDirection,
                h1TrendDirection: m.h1TrendDirection
              });
              const isBuy = computed.direction === 'BUY';
              const pctPositive = m.change24hPct >= 0;
              const rank = m.currentRank || markets.findIndex((x) => x.pair === m.pair) + 1;
              const rankImproved = m.previousRank && rank < m.previousRank;
              const kenyaTiming = evaluatePairKenyaTiming(m.pair);
              const tickUp = m.lastTickDir === 'UP';
              const tickDown = m.lastTickDir === 'DOWN';

              return (
                <div
                  key={m.pair}
                  onClick={() => handleOpenPairCard(m.pair)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenPairCard(m.pair);
                    }
                  }}
                  className={`rounded-2xl p-4 sm:p-5 bg-slate-950 border transition-all cursor-pointer flex flex-col justify-between space-y-4 font-mono tabular-nums hover:-translate-y-0.5 ${
                    rank === 1
                      ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.12)]'
                      : 'border-slate-800 hover:border-[#D4AF37]/70'
                  }`}
                >
                  {/* Top Row: Rank Badge + Pair + Direction Badge */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[11px] font-black ${
                            rank === 1
                              ? 'bg-[#D4AF37] text-black'
                              : rank <= 3
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-900 text-slate-300 border border-slate-800'
                          }`}
                        >
                          #{rank}
                        </span>
                        {rankImproved && (
                          <span className="text-[10px] text-[#00C261] font-bold">
                            ▲ from #{m.previousRank}
                          </span>
                        )}
                        {lockedPairs[m.pair] && (
                          <span className="text-[10px] text-amber-300 font-bold">· Custom</span>
                        )}
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black ${
                          isBuy
                            ? 'bg-emerald-500/20 text-[#00C261] border border-emerald-500/35'
                            : 'bg-red-500/20 text-red-300 border border-red-500/35'
                        }`}
                      >
                        {computed.trendDirection === 'UPTREND'
                          ? 'UPTREND'
                          : computed.trendDirection === 'DOWNTREND'
                          ? 'DOWNTREND'
                          : 'RANGE'}{' '}
                        · {computed.direction} ({isBuy ? computed.bullScorePct : computed.bearScorePct}%)
                      </span>
                    </div>

                    {/* Pair Name, Candle Price & Live % */}
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <span className="text-lg font-black text-white">{m.pair}</span>
                        <span className="text-xs text-[#D4AF37] font-bold ml-1.5">· {activeTf}</span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-black ${
                          pctPositive ? 'text-[#00C261]' : 'text-red-400'
                        }`}
                      >
                        {pctPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{pctPositive ? `+${m.change24hPct.toFixed(2)}%` : `${m.change24hPct.toFixed(2)}%`}</span>
                      </span>
                    </div>

                    <div className="text-sm font-black text-white flex items-center justify-between gap-1">
                      <span>
                        Candle:{' '}
                        <span
                          className={
                            tickUp
                              ? 'text-[#00C261]'
                              : tickDown
                              ? 'text-red-400'
                              : 'text-[#D4AF37]'
                          }
                        >
                          {tickUp ? '▲ ' : tickDown ? '▼ ' : ''}@ {m.price}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {computed.confidence}% AI
                      </span>
                    </div>
                    {m.directionFlipped && (
                      <div className="text-[10px] text-amber-300 font-bold">
                        Flipped {m.previousDirection} → {computed.direction}
                      </div>
                    )}
                  </div>

                  {/* Clean SL & TP Summary Box + Net Trajectory Profit */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-red-400 block">Stop Loss (-{computed.slPips}p)</span>
                        <strong className="text-red-300">{computed.stopLoss}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 block">Take Profit (+{computed.tpPips}p)</span>
                        <strong className="text-[#00C261]">{computed.tp2}</strong>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Risk -${computed.actualRiskUsd.toFixed(2)}</span>
                      <span className="text-[#00C261] font-black">
                        Profit +${computed.netProfitUsd.toFixed(2)} ({computed.riskReward})
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Explicit Color-Coded Market Open / Opens In Guidance + Open Chart */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[10px]">
                    <span
                      className={`inline-flex items-center gap-1 font-bold truncate ${
                        kenyaTiming.windowStatusCode === 'OPEN'
                          ? 'text-[#00C261]'
                          : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                          ? 'text-amber-300'
                          : 'text-red-300'
                      }`}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="truncate">{kenyaTiming.windowBadgeShort}</span>
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          const ticket = `${m.pair} [${activeTf}] ${computed.orderType} @ ${computed.entryPrice} | SL: ${computed.stopLoss} | TP2: ${computed.tp2}`;
                          navigator.clipboard.writeText(ticket);
                          setCopiedCardPair(m.pair);
                          setTimeout(() => setCopiedCardPair(null), 1500);
                        }}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                        title="Copy Order Levels"
                      >
                        {copiedCardPair === m.pair ? (
                          <Check className="w-3 h-3 text-[#00C261]" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#D4AF37]" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPairCard(m.pair)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-black text-[11px] flex items-center gap-1 transition whitespace-nowrap"
                      >
                        <span>Chart</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
