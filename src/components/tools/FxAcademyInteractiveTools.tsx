import React, { useState } from 'react';
import {
  BookOpen,
  CandlestickChart,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { CandlestickVisualizer, CandleData } from '../common/CandlestickVisualizer';

export const FxAcademyInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'anatomy' | 'trends' | 'patterns'>('anatomy');
  const [selectedCandleType, setSelectedCandleType] = useState<'bullish' | 'bearish'>('bullish');
  const [selectedPart, setSelectedPart] = useState<string>('upper-wick');

  // Trend samples with real candles
  const [activeTrend, setActiveTrend] = useState<'uptrend' | 'downtrend' | 'range'>('uptrend');

  const uptrendCandles: CandleData[] = [
    { id: 1, open: 1.0800, high: 1.0825, low: 1.0795, close: 1.0820, label: 'Higher Low 1' },
    { id: 2, open: 1.0820, high: 1.0845, low: 1.0815, close: 1.0840, label: 'Higher High 1' },
    { id: 3, open: 1.0840, high: 1.0842, low: 1.0825, close: 1.0828, label: 'Pullback' },
    { id: 4, open: 1.0828, high: 1.0855, low: 1.0826, close: 1.0850, label: 'Higher Low 2' },
    { id: 5, open: 1.0850, high: 1.0880, low: 1.0848, close: 1.0875, label: 'Higher High 2' },
    { id: 6, open: 1.0875, high: 1.0878, low: 1.0858, close: 1.0862, label: 'Higher Low 3' },
    { id: 7, open: 1.0862, high: 1.0910, low: 1.0860, close: 1.0905, label: 'Higher High 3' },
  ];

  const downtrendCandles: CandleData[] = [
    { id: 1, open: 1.0920, high: 1.0930, low: 1.0895, close: 1.0900, label: 'Lower High 1' },
    { id: 2, open: 1.0900, high: 1.0905, low: 1.0865, close: 1.0870, label: 'Lower Low 1' },
    { id: 3, open: 1.0870, high: 1.0888, low: 1.0868, close: 1.0885, label: 'Pullback Rally' },
    { id: 4, open: 1.0885, high: 1.0890, low: 1.0840, close: 1.0845, label: 'Lower High 2' },
    { id: 5, open: 1.0845, high: 1.0850, low: 1.0810, close: 1.0815, label: 'Lower Low 2' },
    { id: 6, open: 1.0815, high: 1.0832, low: 1.0812, close: 1.0828, label: 'Lower High 3' },
    { id: 7, open: 1.0828, high: 1.0830, low: 1.0770, close: 1.0775, label: 'Lower Low 3' },
  ];

  const rangeCandles: CandleData[] = [
    { id: 1, open: 1.0820, high: 1.0850, low: 1.0818, close: 1.0845, label: 'Resistance Test' },
    { id: 2, open: 1.0845, high: 1.0848, low: 1.0820, close: 1.0822, label: 'Support Drop' },
    { id: 3, open: 1.0822, high: 1.0852, low: 1.0820, close: 1.0848, label: 'Resistance Bounce' },
    { id: 4, open: 1.0848, high: 1.0850, low: 1.0821, close: 1.0824, label: 'Support Test' },
    { id: 5, open: 1.0824, high: 1.0851, low: 1.0820, close: 1.0846, label: 'Range High' },
    { id: 6, open: 1.0846, high: 1.0848, low: 1.0819, close: 1.0821, label: 'Range Low' },
  ];

  const patterns = [
    {
      id: 'hammer',
      name: 'The Bullish Hammer / Pinbar',
      type: 'Bullish Reversal',
      description: 'Small real body near the top of the candle with a long lower wick at least 2 to 3 times the body size. Indicates sellers pushed price down, but aggressive institutional buyers rejected the lows.',
      candles: [
        { id: 1, open: 1.0850, high: 1.0852, low: 1.0820, close: 1.0825, label: 'Downtrend' },
        { id: 2, open: 1.0825, high: 1.0830, low: 1.0790, close: 1.0828, label: 'Hammer (Rejection Wick)', annotation: 'Buy Signal', annotationType: 'entry' as const },
        { id: 3, open: 1.0828, high: 1.0865, low: 1.0825, close: 1.0860, label: 'Bullish Confirmation' },
      ],
      trendType: 'bullish' as const,
      entry: 1.0830,
      sl: 1.0788,
      tp: 1.0880,
    },
    {
      id: 'shooting-star',
      name: 'The Shooting Star / Exhaustion Wick',
      type: 'Bearish Reversal',
      description: 'Small body at the bottom with a tall upper wick. This is the hallmark of the Gilgil Tower Top! Buyers sprinted upward, but hit an institutional sell wall and collapsed before candle close.',
      candles: [
        { id: 1, open: 1.2900, high: 1.2945, low: 1.2895, close: 1.2940, label: 'Rally' },
        { id: 2, open: 1.2940, high: 1.2985, low: 1.2935, close: 1.2938, label: 'Shooting Star', annotation: 'Sell Signal', annotationType: 'warning' as const },
        { id: 3, open: 1.2938, high: 1.2940, low: 1.2890, close: 1.2895, label: 'Bearish Drop' },
      ],
      trendType: 'bearish' as const,
      entry: 1.2935,
      sl: 1.2990,
      tp: 1.2840,
    },
    {
      id: 'bullish-engulfing',
      name: 'Bullish Engulfing',
      type: 'Bullish Continuation / Reversal',
      description: 'A small red candle is completely swallowed (engulfed) from head to toe by a large, powerful green candle. Signals an overwhelming takeover by buyers.',
      candles: [
        { id: 1, open: 154.20, high: 154.25, low: 153.95, close: 154.00, label: 'Red Candle' },
        { id: 2, open: 153.98, high: 154.50, low: 153.92, close: 154.45, label: 'Engulfing Green', annotation: 'Strong Long', annotationType: 'entry' as const },
        { id: 3, open: 154.45, high: 154.80, low: 154.40, close: 154.75, label: 'Continuation' },
      ],
      trendType: 'bullish' as const,
      entry: 154.45,
      sl: 153.88,
      tp: 155.20,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
            <CandlestickChart className="w-4 h-4" />
            <span>Beginner Foundation Lab</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Interactive Candlestick Anatomy & Market Structure
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Learn the language of Japanese candlesticks from scratch. Understand what every wick, body, and trend swing actually means.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab('anatomy')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === 'anatomy'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Candle Anatomy</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === 'trends'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trend Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === 'patterns'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pattern Dictionary</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE CANDLE ANATOMY */}
      {activeTab === 'anatomy' && (
        <div className="rounded-3xl bg-slate-900/90 border border-[#D4AF37]/40 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                The 4 Coordinates of Every Candlestick (OHLC)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Every candle represents a specific timeframe (e.g. 15 minutes). Tap either candle type or hover over its parts below.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setSelectedCandleType('bullish')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  selectedCandleType === 'bullish'
                    ? 'bg-emerald-500 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bullish (Green / Buyers)
              </button>
              <button
                onClick={() => setSelectedCandleType('bearish')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  selectedCandleType === 'bearish'
                    ? 'bg-red-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bearish (Red / Sellers)
              </button>
            </div>
          </div>

          {/* Interactive Visual Anatomy Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* SVG Illustration (5 cols) */}
            <div className="md:col-span-5 flex justify-center p-6 rounded-2xl bg-[#080C14] border border-slate-800">
              <svg width="220" height="320" viewBox="0 0 220 320" className="select-none">
                {/* Wicks */}
                <line
                  x1="110"
                  y1="30"
                  x2="110"
                  y2="290"
                  stroke={selectedCandleType === 'bullish' ? '#00E676' : '#FF5252'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Candle Body */}
                <rect
                  x="60"
                  y={selectedCandleType === 'bullish' ? '90' : '90'}
                  width="100"
                  height="140"
                  rx="6"
                  fill={selectedCandleType === 'bullish' ? '#00E676' : '#FF5252'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => setSelectedPart('body')}
                />

                {/* HIGH Callout */}
                <circle cx="110" cy="30" r="5" fill="#FACC15" className="cursor-pointer" onClick={() => setSelectedPart('high')} />
                <text x="125" y="34" fill="#FACC15" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  HIGH (1.0890)
                </text>

                {/* CLOSE or OPEN Top */}
                <circle cx="110" cy="90" r="4.5" fill="#FFFFFF" className="cursor-pointer" onClick={() => setSelectedPart(selectedCandleType === 'bullish' ? 'close' : 'open')} />
                <text x="125" y="94" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  {selectedCandleType === 'bullish' ? 'CLOSE (1.0870)' : 'OPEN (1.0870)'}
                </text>

                {/* OPEN or CLOSE Bottom */}
                <circle cx="110" cy="230" r="4.5" fill="#FFFFFF" className="cursor-pointer" onClick={() => setSelectedPart(selectedCandleType === 'bullish' ? 'open' : 'close')} />
                <text x="125" y="234" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  {selectedCandleType === 'bullish' ? 'OPEN (1.0830)' : 'CLOSE (1.0830)'}
                </text>

                {/* LOW Callout */}
                <circle cx="110" cy="290" r="5" fill="#38BDF8" className="cursor-pointer" onClick={() => setSelectedPart('low')} />
                <text x="125" y="294" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  LOW (1.0810)
                </text>

                {/* Upper Wick label */}
                <text
                  x="20"
                  y="60"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                  cursor="pointer"
                  onClick={() => setSelectedPart('upper-wick')}
                >
                  Upper Wick →
                </text>

                {/* Real Body label */}
                <text
                  x="15"
                  y="160"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                  cursor="pointer"
                  onClick={() => setSelectedPart('body')}
                >
                  Real Body →
                </text>

                {/* Lower Wick label */}
                <text
                  x="20"
                  y="260"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                  cursor="pointer"
                  onClick={() => setSelectedPart('lower-wick')}
                >
                  Lower Wick →
                </text>
              </svg>
            </div>

            {/* Interactive Explanations (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#D4AF37] uppercase">
                  Select A Candlestick Feature:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'upper-wick', label: 'Upper Wick (Shadow)' },
                    { id: 'body', label: 'Real Body' },
                    { id: 'lower-wick', label: 'Lower Wick (Shadow)' },
                    { id: 'high', label: 'Highest Price (H)' },
                    { id: 'low', label: 'Lowest Price (L)' },
                    { id: 'open', label: 'Opening Price (O)' },
                    { id: 'close', label: 'Closing Price (C)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPart(p.id)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition border ${
                        selectedPart === p.id
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Feature Details */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                {selectedPart === 'upper-wick' && (
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-[#D4AF37]">The Upper Wick: Selling Pressure & Rejection</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      The upper wick shows how high buyers managed to push price during this candle timeframe before sellers intervened.
                      A long upper wick indicates strong seller rejection at resistance. This is how the Gilgil Tower Top traps retail buyers!
                    </p>
                    <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-200">
                      <strong>Pro Rule:</strong> If upper wick is more than 2x the body, buyers are exhausted. Do NOT buy!
                    </div>
                  </div>
                )}

                {selectedPart === 'body' && (
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-emerald-400">The Real Body: Institutional Conviction</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      The real body is the colored rectangle measuring the difference between the Open and Close. A large green body signifies decisive institutional buying (demand). A large red body signifies aggressive institutional distribution (supply).
                    </p>
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-200">
                      <strong>Pro Rule:</strong> When a candle body closes cleanly through a key level or 20 EMA, the breakout is confirmed.
                    </div>
                  </div>
                )}

                {selectedPart === 'lower-wick' && (
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-cyan-400">The Lower Wick: Buying Pressure & Absorption</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Shows the absolute lowest point sellers reached before being overpowered by buyers. A long lower wick at a support floor or 50 EMA is a classic Bullish Hammer / Pinbar setup.
                    </p>
                    <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200">
                      <strong>Pro Rule:</strong> Buy orders placed immediately above the high of a long lower-wick pinbar offer 1:3+ RRR!
                    </div>
                  </div>
                )}

                {(selectedPart === 'high' || selectedPart === 'low' || selectedPart === 'open' || selectedPart === 'close') && (
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white uppercase font-mono">
                      Coordinate: {selectedPart.toUpperCase()}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedPart === 'open' && 'The price at the exact moment the candle timeframe began (e.g. at 10:00:00 AM).'}
                      {selectedPart === 'close' && 'The final price when the candle timeframe finished (e.g. at 10:14:59 AM).'}
                      {selectedPart === 'high' && 'The absolute peak price traded across the entire 15 minutes.'}
                      {selectedPart === 'low' && 'The absolute bottom price traded across the entire 15 minutes.'}
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-[#D4AF37]">
                      In MT4/MT5 and TradingView, these 4 coordinates define every pip, chart indicator, and mathematical algorithm.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TREND STRUCTURE WITH REAL CANDLES */}
      {activeTab === 'trends' && (
        <div className="rounded-3xl bg-slate-900/90 border border-[#D4AF37]/40 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Market Structure: How Trends Look with Candlesticks
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Markets never move in straight lines. They breathe in waves of Higher Highs & Higher Lows (Uptrend) or Lower Highs & Lower Lows (Downtrend).
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setActiveTrend('uptrend')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  activeTrend === 'uptrend' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bullish Uptrend (HH + HL)
              </button>
              <button
                onClick={() => setActiveTrend('downtrend')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  activeTrend === 'downtrend' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bearish Downtrend (LH + LL)
              </button>
              <button
                onClick={() => setActiveTrend('range')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  activeTrend === 'range' ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sideways Range (Consolidation)
              </button>
            </div>
          </div>

          {/* Candlestick Visualizer */}
          <CandlestickVisualizer
            title={
              activeTrend === 'uptrend'
                ? 'Bullish Market Structure: Higher Highs & Higher Lows'
                : activeTrend === 'downtrend'
                ? 'Bearish Market Structure: Lower Highs & Lower Lows'
                : 'Consolidation Range: Equal Highs & Equal Lows'
            }
            subtitle="Look how candles alternate between impulse expansion and corrective pullbacks"
            candles={
              activeTrend === 'uptrend'
                ? uptrendCandles
                : activeTrend === 'downtrend'
                ? downtrendCandles
                : rangeCandles
            }
            trendType={activeTrend === 'uptrend' ? 'bullish' : activeTrend === 'downtrend' ? 'bearish' : 'range'}
            trendline={
              activeTrend === 'uptrend'
                ? { startIndex: 0, startPrice: 1.0795, endIndex: 5, endPrice: 1.0858, label: 'Trendline Dynamic Support' }
                : activeTrend === 'downtrend'
                ? { startIndex: 0, startPrice: 1.0930, endIndex: 5, endPrice: 1.0832, label: 'Trendline Dynamic Resistance' }
                : undefined
            }
            supportLevel={activeTrend === 'range' ? 1.0820 : undefined}
            resistanceLevel={activeTrend === 'range' ? 1.0850 : undefined}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <strong className="text-white font-mono block text-[#D4AF37]">
                1. What Total Beginners Do:
              </strong>
              <p className="text-slate-400">
                Beginners buy at the very top of green candles because they see price going up fast. They get stopped out during the pullback.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <strong className="text-white font-mono block text-emerald-400">
                2. What Institutional Snipers Do:
              </strong>
              <p className="text-slate-400">
                Snipers wait patiently for the pullback to form a Higher Low touching the dynamic trendline or 50 EMA, then buy with tiny risk.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <strong className="text-white font-mono block text-cyan-400">
                3. The Gilgil $2 Golden Rule:
              </strong>
              <p className="text-slate-400">
                Never risk more than $2 per setup. When you catch a Higher Low in an uptrend, your $2 can return $6 to $10 in clean profit!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PATTERN DICTIONARY */}
      {activeTab === 'patterns' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patterns.map((pat) => (
              <div
                key={pat.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-[#D4AF37]/50 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-[#D4AF37] font-bold">
                      {pat.type}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">High Accuracy</span>
                  </div>

                  <h4 className="text-lg font-bold text-white">{pat.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{pat.description}</p>

                  <div className="pt-2">
                    <CandlestickVisualizer
                      candles={pat.candles}
                      trendType={pat.trendType}
                      entryLevel={pat.entry}
                      slLevel={pat.sl}
                      tpLevel={pat.tp}
                      showControls={false}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Entry Trigger:</span>
                    <span className="text-white font-bold">{pat.entry.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stop Loss:</span>
                    <span className="text-red-400 font-bold">{pat.sl.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Take Profit:</span>
                    <span className="text-emerald-400 font-bold">{pat.tp.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
