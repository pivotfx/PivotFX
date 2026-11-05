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
  const [isScanning, setIsScanning] = useState(false);
  const [filterBias, setFilterBias] = useState<'ALL' | 'PCT_MOVERS' | 'BUY' | 'SELL' | 'FLIPPED'>('ALL');
  // Independent card selection: null = uncongested 8-card grid; CurrencyPair = isolated single-market Chart & Analysis screen
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(null);
  const [scanBanner, setScanBanner] = useState<string | null>(null);
  const [copiedCardPair, setCopiedCardPair] = useState<string | null>(null);
  const [copiedEa, setCopiedEa] = useState(false);

  // Subscribe to global 24/7 every-second live market stream
  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setMarkets(streamState.markets);
      setLastScannedTime(streamState.syncedAt);
      setFeedConnected(streamState.liveFeedConnected);
      setLockedPairs(streamState.lockedPairs);
      setCustomTfs(streamState.customTimeframes);
    });
    return () => unsubscribe();
  }, []);

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
      setScanBanner(
        `${modeLabel} COMPLETE (${updatedState.syncedAt}) · #1 Leader: ${leader.pair} [${leader.recommendedTf}] @ ${leader.price} (${pctStr}) · ${dirWord} BY MARKET · SL ${leader.suggestedSL} · TP ${leader.suggestedTP2}`
      );
      setTimeout(() => setScanBanner(null), 5000);
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
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-[#D4AF37]/45 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold flex-wrap tabular-nums">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00C261]/15 text-[#00C261] border border-[#00C261]/40">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>24/7 AUTO-SYNC LIVE (1s)</span>
            </span>
            <span className="text-[#D4AF37]">
              {feedConnected ? 'Interbank & Crypto Stream Active' : 'Real-Time Calibrated Feed'}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-white font-black">{lastScannedTime}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            AI Market Scanner · Independent Result Cards & Live Candles
          </h3>
          <p className="text-xs text-slate-300 font-mono max-w-3xl">
            Updates automatically every second 24/7 and re-ranks <strong>#1, #2, #3</strong> live as candle prices move or flip between <strong>BUY</strong> and <strong>SELL</strong>. Click any card below to inspect its live candlestick chart.
          </p>
        </div>

        {/* THREE SPEED SCAN BUTTONS: Scan All Markets | Rescan | Deep AI Scan */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0 w-full xl:w-auto">
          <button
            type="button"
            onClick={() => handleRunScan('scan_all')}
            disabled={isScanning}
            className={`px-4 py-2.5 rounded-xl font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap ${
              activeScanMode === 'scan_all'
                ? 'bg-cyan-400 text-black shadow-lg'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40'
            }`}
          >
            <Radar className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'scan_all' ? 'animate-spin' : ''}`} />
            <span>Scan All Markets</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('rescan')}
            disabled={isScanning}
            className={`px-4 py-2.5 rounded-xl font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap ${
              activeScanMode === 'rescan'
                ? 'bg-[#00C261] text-black shadow-lg'
                : 'bg-slate-900 hover:bg-slate-800 text-[#00C261] border border-[#00C261]/40'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'rescan' ? 'animate-spin' : ''}`} />
            <span>Rescan</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('deep_ai')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition active:scale-95 whitespace-nowrap"
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
            biasOverride: focusedMarket.bias === 'STRONG_SELL' ? 'SELL' : 'BUY'
          });
          const kenyaTiming = evaluatePairKenyaTiming(focusedMarket.pair);
          const isBuy = computed.direction === 'BUY';
          const pctPositive = focusedMarket.change24hPct >= 0;
          const rankNum = markets.findIndex((x) => x.pair === focusedMarket.pair) + 1;

          const eaMqlCode = `// --- PIVOTFX LIVE AUTO-SYNC EA CONFIG ---
// Broker: ${selectedBroker.toUpperCase()} | Synced: ${lastScannedTime} | Rank #${rankNum}
// Symbol: ${computed.brokerSymbol} (${focusedMarket.pair} · ${activeTf})
// Direction: ${computed.orderType} | 24h Move: ${pctPositive ? '+' : ''}${focusedMarket.change24hPct}%
// Live Indicators: 20 EMA = ${focusedMarket.ema20} | 50 EMA = ${focusedMarket.ema50} | RSI = ${focusedMarket.rsi}
// Gilgil Shield: 0.01 Micro Lot ($2.00 / 260 KES Max Risk Cap)

input double   LotSize             = 0.01;
input double   EntryPrice          = ${computed.entryPrice};
input double   StopLoss            = ${computed.stopLoss}; // -${computed.slPips} pips ($${computed.actualRiskUsd.toFixed(2)} max risk)
input double   TakeProfit_1        = ${computed.tp1}; // Close 50% & Move SL to BE
input double   TakeProfit_2        = ${computed.tp2}; // Final Target (+${computed.tpPips} pips)
input double   MaxRiskUsdPerTrade  = 2.00;`;

          return (
            <div className="space-y-5 animate-in fade-in duration-200 font-mono tabular-nums">
              {/* Top Return Bar + Quick Switcher for Top #1, #2, #3 */}
              <div className="p-4 rounded-2xl bg-slate-900 border-2 border-[#D4AF37]/60 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <button
                  type="button"
                  onClick={() => setSelectedPair(null)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-[#D4AF37]/50 text-xs font-black transition group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>← Back to All Scanned Cards (Ranks #1–#{markets.length})</span>
                </button>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 mr-1">Top Leaders:</span>
                  {markets.slice(0, 4).map((mItem, idx) => (
                    <button
                      key={mItem.pair}
                      type="button"
                      onClick={() => setSelectedPair(mItem.pair)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
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
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/50 font-black animate-pulse">
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

                  {/* Timeframe Selector Bar */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 mr-1">Timeframe:</span>
                    {TIMEFRAME_CHOICES.map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => globalLiveStream.setPairTimeframe(focusedMarket.pair, tf)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
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
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-amber-300 block">Kenya EAT Window</span>
                    <strong className="text-sm text-white block">{kenyaTiming.countdownFormatted}</strong>
                    <span className="text-[10px] text-cyan-300 block truncate">{kenyaTiming.currentWindowName}</span>
                  </div>
                </div>

                {/* Institutional Trajectory + Technical Indicators + Kenya Entry Guidance */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                  <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[#D4AF37] font-bold">
                      <span className="flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        <span>AI Institutional Trajectory & Liquidity Projection</span>
                      </span>
                      <span className="text-emerald-400">Spread ~{computed.brokerSpread}p</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{computed.trajectory}</p>
                    <p className="text-[11px] text-cyan-300">
                      {kenyaTiming.statusLabel}: {kenyaTiming.reasonText}
                    </p>
                  </div>

                  <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 grid grid-cols-2 gap-2.5">
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
                      <span className="text-[10px] text-slate-400 block">Liquidity Sweep Pool</span>
                      <strong className="text-[#D4AF37]">{focusedMarket.keyLevel}</strong>
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
              biasOverride: topLeader.bias === 'STRONG_SELL' ? 'SELL' : 'BUY'
            });
            const topPctPos = topLeader.change24hPct >= 0;

            return (
              <div
                onClick={() => setSelectedPair(topLeader.pair)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPair(topLeader.pair);
                  }
                }}
                className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0E1629] to-slate-900 border-2 border-[#D4AF37] shadow-2xl cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono tabular-nums hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black font-black flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>#1 LEADING MARKET SETUP</span>
                    </span>
                    <span className="text-cyan-300 font-bold">
                      Best TF: {customTfs[topLeader.pair] || topLeader.recommendedTf}
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
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
                  <div className="grid grid-cols-3 gap-2.5 text-xs bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Entry</span>
                      <strong className="text-white">{topComputed.entryPrice}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-400 block">SL</span>
                      <strong className="text-red-300">{topComputed.stopLoss}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">TP2</span>
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
              Click any card below to inspect live candles, indicators & EA settings
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
                biasOverride: m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY'
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
                  onClick={() => setSelectedPair(m.pair)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPair(m.pair);
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
                        {computed.direction} ({isBuy ? computed.bullScorePct : computed.bearScorePct}%)
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

                  {/* Clean SL & TP Summary Box */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-red-400 block">Stop Loss (-{computed.slPips}p)</span>
                      <strong className="text-red-300">{computed.stopLoss}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">Take Profit (+{computed.tpPips}p)</span>
                      <strong className="text-[#00C261]">{computed.tp2}</strong>
                    </div>
                  </div>

                  {/* Card Footer: Kenya Timing Pill + Open Chart CTA */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1 truncate ${
                        kenyaTiming.isFavorableTime ? 'text-[#00C261]' : 'text-amber-300'
                      }`}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{kenyaTiming.isFavorableTime ? 'EAT Good' : kenyaTiming.countdownFormatted}</span>
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
                        onClick={() => setSelectedPair(m.pair)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-black text-[11px] flex items-center gap-1 transition"
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
