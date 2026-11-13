import React, { useState, useEffect } from 'react';
import { CurrencyPair, Timeframe } from '../../types';
import {
  BarChart3,
  Maximize2,
  Minimize2,
  ExternalLink,
  X,
  Activity,
} from 'lucide-react';
import {
  globalLiveStream,
  GlobalStreamState,
  computeRealChartTradeParams,
  computeCandleSwingLevels,
  getCurrentMacroContext,
  evaluatePairKenyaTiming,
  RiskManagementConfig,
  positionRiskStore
} from '../../utils/liveMarketEngine';
import { EntryConfirmationController } from './EntryConfirmationController';

interface TradingViewEmbedWidgetProps {
  pair: CurrencyPair;
  timeframe: Timeframe;
  onPairChange?: (p: CurrencyPair) => void;
  onTimeframeChange?: (tf: Timeframe) => void;
  onClose?: () => void;
  isCollapsible?: boolean;
}

export const getTradingViewSymbol = (p: CurrencyPair): string => {
  switch (p) {
    case 'EUR/USD':
      return 'FX:EURUSD';
    case 'GBP/USD':
      return 'FX:GBPUSD';
    case 'USD/JPY':
      return 'FX:USDJPY';
    case 'GBP/JPY':
      return 'FX:GBPJPY';
    case 'USD/CHF':
      return 'FX:USDCHF';
    case 'EUR/JPY':
      return 'FX:EURJPY';
    case 'XAU/USD':
      return 'OANDA:XAUUSD';
    case 'AUD/USD':
      return 'FX:AUDUSD';
    case 'USD/CAD':
      return 'FX:USDCAD';
    case 'BTC/USD':
      return 'BINANCE:BTCUSDT';
    case 'ETH/USD':
      return 'BINANCE:ETHUSDT';
    case 'US30':
      return 'FOREXCOM:DJI';
    case 'NAS100':
      return 'FOREXCOM:NAS100';
    case 'GER40':
      return 'FOREXCOM:GER40';
    case 'USOIL':
      return 'TVC:USOIL';
    default:
      return 'FX:GBPUSD';
  }
};

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

  useEffect(() => {
    const unsub = globalLiveStream.subscribe((next) => setStreamState(next));
    const unsubRisk = positionRiskStore.subscribe((nextCfg) => setRiskConfig(nextCfg));
    return () => {
      unsub();
      unsubRisk();
    };
  }, []);

  const marketItem = streamState.markets.find((m) => m.pair === pair) || streamState.markets[0];
  const currentPrice = marketItem?.price || 1.0;
  const pctMap: Partial<Record<CurrencyPair, number>> = {};
  streamState.markets.forEach((m) => {
    pctMap[m.pair] = m.change24hPct;
  });
  const liveMacro = getCurrentMacroContext(pctMap);
  const swings = computeCandleSwingLevels(marketItem?.candles);

  const computed = computeRealChartTradeParams({
    targetPair: pair,
    targetTf: timeframe,
    targetBroker: streamState.activeBroker || 'fxpesa',
    price: currentPrice,
    keyLevel: marketItem?.keyLevel,
    ema20: marketItem?.ema20 ?? currentPrice,
    ema50: marketItem?.ema50 ?? currentPrice,
    rsi: marketItem?.rsi ?? 50,
    atrPips: marketItem?.atrPips,
    swingLow: swings.swingLow,
    swingHigh: swings.swingHigh,
    macro: liveMacro,
    h1TrendDirection: marketItem?.h1TrendDirection,
    biasOverride:
      marketItem && marketItem.bias !== 'NEUTRAL_CHOP'
        ? marketItem.bias === 'STRONG_SELL'
          ? 'SELL'
          : 'BUY'
        : undefined,
    riskConfig
  });
  const kenyaTiming = evaluatePairKenyaTiming(pair);
  const lockedOrder = streamState.activeOrders[pair] || null;

  const symbol = getTradingViewSymbol(pair);
  const interval = getTradingViewInterval(timeframe);

  // Official TradingView embed iframe URL
  const iframeUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_embed_${symbol}&symbol=${encodeURIComponent(
    symbol
  )}&interval=${interval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=131722&studies=[]&theme=dark&style=1&timezone=Africa%2FNairobi&withdateranges=1&showpopupbutton=1&locale=en`;

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
    'AUD/USD'
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-white">{pair}</span>
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                · {timeframe}
              </span>
              <span className="text-[10px] font-mono text-[#00C261] font-bold hidden sm:inline">
                · TradingView Stream
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              TradingView Cloud Engine • EAT Nairobi Timezone
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
                  onClick={() => onPairChange(p)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
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
                  {p}
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
                onClick={() => onTimeframeChange(tf)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition ${
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
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Chart'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isCollapsible && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
              title="Close TradingView Chart"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Embedded Chart Container */}
      <div className={`w-full ${isFullscreen ? 'flex-1 h-full' : 'h-[480px] sm:h-[540px]'}`}>
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

      {/* TRADINGVIEW PRE-FLIGHT ENTRY CONFIRMATION & SUSTAINABILITY CONTROLLER */}
      <div className="p-3 bg-[#0A1020] border-t border-slate-800">
        <EntryConfirmationController
          pair={pair}
          computed={computed}
          kenyaTiming={kenyaTiming}
          livePrice={currentPrice}
          timeframe={timeframe}
          lockedOrder={lockedOrder}
          ema20={marketItem?.ema20}
          ema50={marketItem?.ema50}
          rsi={marketItem?.rsi}
          variant="focused"
        />
      </div>

      {/* Chart Footer Indicator Status */}
      <div className="p-2 sm:px-4 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#D4AF37]">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Chart: Real-time Candlesticks, Crosshairs & Indicators</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Use drawing tools on left toolbar to mark FVG & Order Blocks</span>
        </div>

        <a
          href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#D4AF37] hover:underline hover:text-white transition"
        >
          <span>Open on TradingView.com</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
