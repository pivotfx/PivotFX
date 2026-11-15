import React, { useState, useEffect } from 'react';
import { CurrencyPair, Timeframe } from '../../types';
import {
  BarChart3,
  Maximize2,
  Minimize2,
  ExternalLink,
  X,
  Activity,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  globalLiveStream,
  GlobalStreamState,
  computeRealChartTradeParams,
  computeCandleSwingLevels,
  evaluateCandleSeriesAndTick,
  analyzeMarketStructureBos,
  getCurrentMacroContext,
  evaluatePairKenyaTiming,
  getTradingViewSymbol,
  RiskManagementConfig,
  positionRiskStore,
} from '../../utils/liveMarketEngine';
import { EntryConfirmationController } from './EntryConfirmationController';

export { getTradingViewSymbol };

interface TradingViewEmbedWidgetProps {
  pair: CurrencyPair;
  timeframe: Timeframe;
  onPairChange?: (p: CurrencyPair) => void;
  onTimeframeChange?: (tf: Timeframe) => void;
  onClose?: () => void;
  isCollapsible?: boolean;
}

export const getTradingViewInterval = (tf: Timeframe): string => {
  switch (tf) {
    case 'M1':
      return '1';
    case 'M5':
      return '5';
    case 'M10':
      return '10';
    case 'M15':
      return '15';
    case 'H1':
      return '60';
    case 'H4':
      return '240';
    case 'D1':
      return 'D';
    default:
      return '15';
  }
};

export const TradingViewEmbedWidget: React.FC<TradingViewEmbedWidgetProps> = ({
  pair,
  timeframe,
  onPairChange,
  onTimeframeChange,
  onClose,
  isCollapsible = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamState, setStreamState] = useState<GlobalStreamState>(() => globalLiveStream.getState());
  const [riskConfig, setRiskConfig] = useState<RiskManagementConfig>(() => positionRiskStore.getConfig());
  const [tvSyncInput, setTvSyncInput] = useState<string>('');
  const [tvSyncFeedback, setTvSyncFeedback] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  useEffect(() => {
    const unsub = globalLiveStream.subscribe((next) => setStreamState(next));
    const unsubRisk = positionRiskStore.subscribe((nextCfg) => setRiskConfig(nextCfg));
    return () => {
      unsub();
      unsubRisk();
    };
  }, []);

  useEffect(() => {
    setTvSyncInput('');
    setTvSyncFeedback(null);
  }, [pair]);

  const marketItem = streamState.markets.find((m) => m.pair === pair) || streamState.markets[0];
  const currentPrice = marketItem?.price || 1.0;
  const isCustomTvLocked = Boolean(streamState.lockedPairs[pair]);
  const isLiveSpotConnected = marketItem?.dataSource === 'Live Interbank Feed';

  const pctMap: Partial<Record<CurrencyPair, number>> = {};
  streamState.markets.forEach((m) => {
    pctMap[m.pair] = m.change24hPct;
  });
  const liveMacro = getCurrentMacroContext(pctMap);
  const isHigherTvTf = timeframe === 'H1' || timeframe === 'H4' || timeframe === 'D1';
  const activeTvBaseCandles =
    isHigherTvTf && marketItem?.h1Candles && marketItem.h1Candles.length >= 22
      ? marketItem.h1Candles
      : marketItem?.candles;

  const tfMatchesMarket = !marketItem || marketItem.recommendedTf === timeframe;
  const reEvalTv =
    !tfMatchesMarket && marketItem
      ? evaluateCandleSeriesAndTick({
          pair,
          timeframe,
          livePrice: currentPrice,
          baseCandles: activeTvBaseCandles,
          h1Candles: marketItem.h1Candles,
          candlesAreRealOhlc: marketItem.candlesAreRealOhlc,
          change24hPct: marketItem.change24hPct,
          macro: liveMacro,
          h1TrendDirection: marketItem.h1TrendDirection,
        })
      : null;

  const activeCandles = reEvalTv ? reEvalTv.candles : activeTvBaseCandles || [];
  const swings = computeCandleSwingLevels(activeCandles);
  const activeAtr = reEvalTv ? reEvalTv.atrPips : marketItem?.atrPips;
  const tvBosAnalysis =
    reEvalTv?.bosAnalysis ||
    marketItem?.bosAnalysis ||
    analyzeMarketStructureBos({
      pair,
      candles: activeCandles,
      h1Candles: marketItem?.h1Candles,
      livePrice: currentPrice,
      atrPips: activeAtr,
    });

  const computed = computeRealChartTradeParams({
    targetPair: pair,
    targetTf: timeframe,
    targetBroker: streamState.activeBroker || 'fxpesa',
    price: currentPrice,
    keyLevel: reEvalTv ? reEvalTv.keyLevel : marketItem?.keyLevel,
    ema20: reEvalTv ? reEvalTv.ema20 : marketItem?.ema20 ?? currentPrice,
    ema50: reEvalTv ? reEvalTv.ema50 : marketItem?.ema50 ?? currentPrice,
    rsi: reEvalTv ? reEvalTv.rsi : marketItem?.rsi ?? 50,
    atrPips: activeAtr,
    candles: activeCandles,
    swingLow: reEvalTv ? reEvalTv.swingLow : swings.swingLow,
    swingHigh: reEvalTv ? reEvalTv.swingHigh : swings.swingHigh,
    macro: liveMacro,
    h1TrendDirection: marketItem?.h1TrendDirection,
    change24hPct: marketItem?.change24hPct,
    opposingCandleWarning: reEvalTv?.opposingCandleWarning,
    bosAnalysis: tvBosAnalysis,
    riskConfig,
  });

  const kenyaTiming = evaluatePairKenyaTiming(pair);
  const lockedOrder = streamState.activeOrders[pair] || null;

  const symbol = getTradingViewSymbol(pair);
  const interval = getTradingViewInterval(timeframe);

  const activeSl = lockedOrder ? lockedOrder.stopLoss : computed.stopLoss;
  const activeTp1 = lockedOrder ? lockedOrder.tp1 : computed.tp1;
  const activeTp2 = lockedOrder ? lockedOrder.tp2 : computed.tp2;
  const activeTp3 = lockedOrder ? lockedOrder.tp3 : computed.tp3;
  const isBuy = computed.direction === 'BUY';
  const pctPositive = (marketItem?.change24hPct ?? 0) >= 0;
  const activeEma20 = reEvalTv ? reEvalTv.ema20 : marketItem?.ema20 ?? currentPrice;
  const activeEma50 = reEvalTv ? reEvalTv.ema50 : marketItem?.ema50 ?? currentPrice;
  const activeRsi = reEvalTv ? reEvalTv.rsi : marketItem?.rsi ?? 50;

  const handleApplyTvCandleSync = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tvSyncInput);
    if (isNaN(val) || val <= 0) return;
    globalLiveStream.setCustomCandlePrice(pair, val, timeframe);
    setTvSyncFeedback(
      `Synced ${pair} (${symbol}) EP, SL & TP1–TP3 to TradingView candle ${val.toFixed(computed.decimals)}`
    );
  };

  const handleCopyTicket = () => {
    const ticket = `${pair} (${symbol} ${timeframe}) · ${computed.orderType}
Strategy: ${computed.recommendedStrategy} (${computed.strategyWinRate})
EP: ${computed.entryPrice} | SL: ${activeSl} (-${computed.slPips}p)
TP1: ${activeTp1} | TP2: ${activeTp2} (+${computed.tpPips}p) | TP3: ${activeTp3}
Lot: ${computed.lotSize} (Max Risk: $${computed.actualRiskUsd.toFixed(2)} | R:R ${computed.riskReward})
BOS: ${tvBosAnalysis.structureSummary}`;
    try {
      navigator.clipboard.writeText(ticket);
    } catch {}
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  // Official TradingView embed URL with EMA + RSI studies pre-loaded cleanly
  const studiesParam = encodeURIComponent(JSON.stringify(['MAExp@tv-basicstudies', 'RSI@tv-basicstudies']));
  const iframeUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_embed_${symbol.replace(
    /[^a-zA-Z0-9_]/g,
    '_'
  )}&symbol=${encodeURIComponent(
    symbol
  )}&interval=${interval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=131722&studies=${studiesParam}&theme=dark&style=1&timezone=Africa%2FNairobi&withdateranges=1&showpopupbutton=1&locale=en`;

  const launchIndependentTvUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(
    symbol
  )}&interval=${encodeURIComponent(interval)}`;

  const PAIR_OPTIONS: CurrencyPair[] = [
    'GBP/USD',
    'EUR/USD',
    'XAU/USD',
    'USD/JPY',
    'GBP/JPY',
    'EUR/JPY',
    'USD/CHF',
    'BTC/USD',
    'ETH/USD',
    'US30',
    'NAS100',
    'GER40',
    'USOIL',
    'USD/CAD',
    'AUD/USD',
  ];

  const TF_OPTIONS: Timeframe[] = ['M5', 'M10', 'M15', 'H1', 'H4', 'D1'];

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-slate-950 transition-all ${
        isFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl flex flex-col bg-slate-950/98 backdrop-blur-xl border-[#D4AF37]'
          : 'relative shadow-xl'
      }`}
    >
      {/* Widget Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:px-4 bg-slate-900/95 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-black text-white">{pair}</span>
              <span className="text-[10px] font-mono text-cyan-300 font-bold">
                {symbol}
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                · {timeframe}
              </span>
              <span className="text-[10px] font-mono text-[#00C261] font-bold hidden sm:inline">
                · Auto-Synced Stream
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              TradingView Institutional Engine • EAT Nairobi (UTC+3) • EMA + RSI Preloaded
            </p>
          </div>
        </div>

        {/* Quick Pair Selector Bar */}
        {onPairChange && (
          <div className="flex items-center gap-1.5">
            <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {PAIR_OPTIONS.slice(0, 5).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPairChange(p)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition whitespace-nowrap shrink-0 ${
                    pair === p
                      ? 'bg-[#D4AF37] text-black shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <select
              value={pair}
              onChange={(e) => onPairChange(e.target.value as CurrencyPair)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] font-mono font-bold text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
              aria-label="Select TradingView Market Pair"
            >
              {PAIR_OPTIONS.map((p) => (
                <option key={p} value={p} className="bg-slate-950 text-white">
                  {p} ({getTradingViewSymbol(p)})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick Timeframe Switcher Bar */}
        {onTimeframeChange && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {TF_OPTIONS.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => onTimeframeChange(tf)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition whitespace-nowrap shrink-0 ${
                  timeframe === tf
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <a
            href={launchIndependentTvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-mono font-black transition whitespace-nowrap shrink-0"
          >
            <span>Open {symbol} on TV</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Chart'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isCollapsible && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
              title="Close TradingView Chart"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Feed Parity & TradingView Candle Sync Guard Bar */}
      <div className="px-3 sm:px-4 py-2 bg-[#080E1A] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tabular-nums">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black border ${
              isCustomTvLocked
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : isLiveSpotConnected
                ? 'bg-[#00C261]/20 text-[#00C261] border-[#00C261]/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
            }`}
          >
            {isCustomTvLocked
              ? `TV CANDLE ANCHORED: ${currentPrice.toFixed(computed.decimals)}`
              : isLiveSpotConnected
              ? `TV PARITY QUOTE (${symbol}): ${currentPrice.toFixed(computed.decimals)}`
              : `OFFLINE CALIBRATION QUOTE: ${currentPrice.toFixed(computed.decimals)}`}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            See exact live {symbol} price differ by broker spread? Lock candle price to re-anchor EP, SL &amp; TP:
          </span>
        </div>

        <form onSubmit={handleApplyTvCandleSync} className="flex items-center gap-1.5">
          <input
            type="number"
            step="any"
            value={tvSyncInput}
            onChange={(e) => setTvSyncInput(e.target.value)}
            placeholder={`TV Candle (${currentPrice.toFixed(computed.decimals)})`}
            aria-label={`Sync ${pair} to TradingView candle price`}
            className="w-36 bg-slate-950 border border-slate-700 focus:border-[#D4AF37] rounded-lg px-2.5 py-1 text-white text-[11px] font-bold outline-none"
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded-lg bg-[#D4AF37] hover:bg-amber-400 text-black font-black text-[10px] transition whitespace-nowrap"
          >
            Sync to TV Candle
          </button>
          {isCustomTvLocked && (
            <button
              type="button"
              onClick={() => {
                globalLiveStream.unlockPairToLiveStream(pair);
                setTvSyncFeedback(null);
              }}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] transition whitespace-nowrap"
            >
              Resume Live
            </button>
          )}
        </form>
      </div>

      {tvSyncFeedback && (
        <div className="px-4 py-1.5 bg-emerald-950/50 border-b border-[#00C261]/40 text-[11px] font-mono text-[#00C261] font-bold">
          {tvSyncFeedback}
        </div>
      )}

      {/* Main Split Workspace: Live TradingView Chart + Auto-Synced Signal Card */}
      <div className={`grid grid-cols-1 ${isFullscreen ? 'flex-1 h-full' : 'xl:grid-cols-12'}`}>
        <div
          className={`${
            isFullscreen ? 'h-full w-full' : 'xl:col-span-8 h-[460px] sm:h-[540px]'
          } border-b xl:border-b-0 xl:border-r border-slate-800`}
        >
          <iframe
            key={`${symbol}-${interval}`}
            src={iframeUrl}
            title={`TradingView Chart ${pair}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            loading="lazy"
          />
        </div>

        {/* Auto-Synced Live Companion Signal Card (updates every tick alongside TV Chart) */}
        {!isFullscreen && (
          <div className="xl:col-span-4 p-4 bg-[#070B14] flex flex-col justify-between gap-3 font-mono tabular-nums">
            <div className="space-y-3">
              {/* Top Parity & Live Spot Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">
                      LIVE AUTO-SYNCED CARD
                    </span>
                    <span className="text-[10px] text-cyan-300 font-bold">· {symbol}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white">
                      {currentPrice.toFixed(computed.decimals)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-black ${
                        pctPositive ? 'text-[#00C261]' : 'text-red-400'
                      }`}
                    >
                      {pctPositive ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {pctPositive
                        ? `+${(marketItem?.change24hPct ?? 0).toFixed(2)}%`
                        : `${(marketItem?.change24hPct ?? 0).toFixed(2)}%`}
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                      isBuy
                        ? 'bg-[#00C261] text-black'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {computed.direction} ({computed.confidence}%)
                  </span>
                  <div
                    className={`text-[10px] font-bold ${
                      computed.executionReadiness === 'READY_ENTER'
                        ? 'text-[#00C261]'
                        : computed.executionReadiness === 'WAIT_PULLBACK'
                        ? 'text-amber-300'
                        : 'text-red-400'
                    }`}
                  >
                    {computed.executionReadiness === 'READY_ENTER'
                      ? 'READY TO ENTER'
                      : computed.executionReadiness === 'WAIT_PULLBACK'
                      ? 'WAIT PULLBACK'
                      : 'STAND ASIDE'}
                  </div>
                </div>
              </div>

              {/* Matched Optimal Strategy Box */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-[#D4AF37]/30 space-y-1">
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  <span className="text-[#D4AF37] font-black flex items-center gap-1">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="truncate">{computed.recommendedStrategy}</span>
                  </span>
                  <span className="text-emerald-400 font-bold shrink-0">
                    {computed.strategyWinRate}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-sans leading-snug">
                  {computed.strategyRationale}
                </p>
              </div>

              {/* EP, SL, TP1, TP2, TP3 Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Entry Price (EP)</span>
                  <strong className="text-white text-sm">{computed.entryPrice}</strong>
                  <span className="text-[9px] text-cyan-300 block truncate">{computed.orderType}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-red-950/35 border border-red-500/40">
                  <span className="text-[10px] text-red-300 block">
                    Stop Loss (-{computed.slPips}p)
                  </span>
                  <strong className="text-red-400 text-sm">{activeSl}</strong>
                  <span className="text-[9px] text-red-300 block">
                    Risk: ${computed.actualRiskUsd.toFixed(2)} ({computed.lotSize.toFixed(2)} Lot)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/35">
                  <span className="text-[10px] text-cyan-300 block">TP1 (Breakeven Split)</span>
                  <strong className="text-cyan-200 text-sm">{activeTp1}</strong>
                  <span className="text-[9px] text-cyan-400 block">+{computed.tp1Pips}p</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/35 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-300 block">
                    TP2 Final (+{computed.tpPips}p)
                  </span>
                  <strong className="text-[#00C261] text-sm">{activeTp2}</strong>
                  <span className="text-[9px] text-emerald-400 block">
                    TP3: {activeTp3} · {computed.riskReward}
                  </span>
                </div>
              </div>

              {/* Indicator + BOS Structure Parity Readout */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">EMA 20</span>
                  <strong className="text-cyan-300">{activeEma20.toFixed(computed.decimals)}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">EMA 50</span>
                  <strong className="text-amber-300">{activeEma50.toFixed(computed.decimals)}</strong>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block">RSI (14)</span>
                  <strong className="text-white">{activeRsi.toFixed(1)}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[10px] space-y-1">
                <div className="flex items-center justify-between text-[#D4AF37] font-bold">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>Market Structure (BOS / CHoCH)</span>
                  </span>
                  <span className="text-slate-300">
                    {computed.alignedFactorsCount}/{computed.totalFactorsCount} Factors
                  </span>
                </div>
                <p className="text-slate-300 font-sans leading-snug">
                  {tvBosAnalysis.structureSummary}
                </p>
              </div>

              {/* Live Candle Backtest & Quantitative Edge Strip */}
              {(computed.liveBacktest || computed.executionBrief || computed.plainEnglishGuide) && (
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/35 text-[10px] space-y-1.5">
                  <div className="flex items-center justify-between gap-1 font-bold flex-wrap">
                    <span className="text-cyan-300">
                      Walk-Forward Edge · ADX {(computed.adxStrength ?? 21).toFixed(0)} · MACD {computed.macdBias ?? 'FLAT'}
                    </span>
                    {computed.liveBacktest && computed.liveBacktest.sampleTrades > 0 && (
                      <span className="text-[#00C261]">
                        {computed.liveBacktest.tp1WinRatePct}% TP1 · {computed.liveBacktest.netExpectancyR >= 0 ? '+' : ''}
                        {computed.liveBacktest.netExpectancyR.toFixed(2)}R/trade (PF {computed.liveBacktest.profitFactor.toFixed(2)})
                      </span>
                    )}
                  </div>
                  {(computed.executionBrief || computed.plainEnglishGuide) && (
                    <p className="text-slate-300 font-sans leading-snug">
                      {(computed.executionBrief || computed.plainEnglishGuide)!.whySlIsSafe}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions: Copy Exact Ticket + Open Independent TV */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyTicket}
                className="w-full py-2.5 px-3 rounded-xl btn-gold text-black font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 whitespace-nowrap"
              >
                {copiedTicket ? (
                  <Check className="w-4 h-4 text-black" />
                ) : (
                  <Copy className="w-4 h-4 text-black" />
                )}
                <span>{copiedTicket ? 'MT4/MT5 Ticket Copied!' : 'Copy Auto-Synced MT4/MT5 Ticket'}</span>
              </button>

              <a
                href={launchIndependentTvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-[11px] flex items-center justify-center gap-1.5 transition whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C261]" />
                <span>Launch Exact {symbol} ({timeframe}) on TradingView.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* TRADINGVIEW PRE-FLIGHT ENTRY CONFIRMATION & SUSTAINABILITY CONTROLLER */}
      <div className="p-3 bg-[#0A1020] border-t border-slate-800">
        <EntryConfirmationController
          pair={pair}
          computed={computed}
          kenyaTiming={kenyaTiming}
          livePrice={currentPrice}
          timeframe={timeframe}
          lockedOrder={lockedOrder}
          ema20={activeEma20}
          ema50={activeEma50}
          rsi={activeRsi}
          variant="focused"
        />
      </div>

      {/* Chart Footer Indicator Status */}
      <div className="p-2 sm:px-4 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#D4AF37]">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Chart: Preloaded EMA + RSI · Symbol {symbol}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Matches independent TradingView {symbol} candle stream
          </span>
        </div>

        <a
          href={launchIndependentTvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#D4AF37] hover:underline hover:text-white transition"
        >
          <span>Open {symbol} Full Chart on TradingView.com</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
