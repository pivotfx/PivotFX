import React, { useState } from 'react';
import { PillarLesson } from '../../types';
import { CandlestickVisualizer, CandleData } from './CandlestickVisualizer';
import { CandlestickChart, Code2, Sparkles, Layers } from 'lucide-react';

interface LessonCandleIllustrationProps {
  lesson: PillarLesson;
}

export const LessonCandleIllustration: React.FC<LessonCandleIllustrationProps> = ({ lesson }) => {
  const [viewMode, setViewMode] = useState<'candles' | 'ascii'>('candles');

  // Generate realistic, tailored candlestick coordinates based on lesson topic
  const getCandlesForLesson = (): {
    candles: CandleData[];
    trendType: 'bullish' | 'bearish' | 'reversal' | 'range';
    entry?: number;
    sl?: number;
    tp?: number;
    resistance?: number;
    support?: number;
    fvgZone?: { top: number; bottom: number; label: string };
    trendline?: { startIndex: number; startPrice: number; endIndex: number; endPrice: number; label?: string };
  } => {
    const text = (lesson.title + ' ' + lesson.summary + ' ' + lesson.concept).toLowerCase();

    // 1. Tower Top Reversal setups
    if (text.includes('tower') || text.includes('top') || text.includes('reversal')) {
      return {
        trendType: 'reversal',
        resistance: 1.2965,
        entry: 1.2916,
        sl: 1.2970,
        tp: 1.2780,
        candles: [
          { id: 1, open: 1.2840, high: 1.2875, low: 1.2835, close: 1.2870, label: 'Run-up' },
          { id: 2, open: 1.2870, high: 1.2915, low: 1.2865, close: 1.2910, label: 'FOMO Green' },
          { id: 3, open: 1.2910, high: 1.2965, low: 1.2905, close: 1.2958, label: 'Tower Peak Trap (1296.56)' },
          { id: 4, open: 1.2958, high: 1.2962, low: 1.2925, close: 1.2930, label: 'Rejection Wick' },
          { id: 5, open: 1.2930, high: 1.2935, low: 1.2910, close: 1.2916, label: 'Slice 20 EMA (1291.69)', annotation: 'Sell Entry', annotationType: 'entry' },
          { id: 6, open: 1.2916, high: 1.2920, low: 1.2840, close: 1.2845, label: '50 EMA Drop', annotation: 'TP Hit', annotationType: 'tp' },
        ],
      };
    }

    // 2. Liquidity Sweeps & Smart Money
    if (text.includes('liquidity') || text.includes('sweep') || text.includes('stop hunt') || text.includes('mss')) {
      return {
        trendType: 'reversal',
        resistance: 1.0880,
        entry: 1.0865,
        sl: 1.0892,
        tp: 1.0810,
        candles: [
          { id: 1, open: 1.0850, high: 1.0878, low: 1.0845, close: 1.0875, label: 'Equal High 1' },
          { id: 2, open: 1.0875, high: 1.0880, low: 1.0855, close: 1.0860, label: 'Equal High 2' },
          { id: 3, open: 1.0860, high: 1.0892, low: 1.0858, close: 1.0865, label: 'Sweep Wick (Trap)', annotation: 'Stop Grab', annotationType: 'sweep' },
          { id: 4, open: 1.0865, high: 1.0868, low: 1.0830, close: 1.0832, label: 'MSS Shift' },
          { id: 5, open: 1.0832, high: 1.0865, low: 1.0830, close: 1.0865, label: 'Retest Entry', annotation: 'Sniper Sell', annotationType: 'entry' },
          { id: 6, open: 1.0865, high: 1.0868, low: 1.0810, close: 1.0815, label: 'Target Realized', annotation: 'TP Hit', annotationType: 'tp' },
        ],
      };
    }

    // 3. Fair Value Gap (FVG)
    if (text.includes('fvg') || text.includes('imbalance') || text.includes('inefficiency') || text.includes('gap')) {
      return {
        trendType: 'bullish',
        fvgZone: { top: 2038.5, bottom: 2028.0, label: 'Institutional Buy Imbalance' },
        entry: 2030.0,
        sl: 2022.0,
        tp: 2055.0,
        candles: [
          { id: 1, open: 2020.0, high: 2028.0, low: 2019.0, close: 2026.0, label: 'Candle 1 High' },
          { id: 2, open: 2026.0, high: 2045.0, low: 2025.5, close: 2044.0, label: 'Displacement' },
          { id: 3, open: 2044.0, high: 2050.0, low: 2038.5, close: 2048.0, label: 'Candle 3 Low (Gap)' },
          { id: 4, open: 2048.0, high: 2048.0, low: 2030.0, close: 2032.0, label: 'Mitigation Retest', annotation: 'Buy Zone', annotationType: 'entry' },
          { id: 5, open: 2032.0, high: 2045.0, low: 2031.0, close: 2043.0 },
          { id: 6, open: 2043.0, high: 2058.0, low: 2042.0, close: 2056.0, label: 'Target Hit', annotation: 'TP Hit', annotationType: 'tp' },
        ],
      };
    }

    // 4. Trendlines & Structure
    if (text.includes('trend') || text.includes('line') || text.includes('support') || text.includes('resistance') || text.includes('ema') || text.includes('pullback')) {
      return {
        trendType: 'bullish',
        trendline: { startIndex: 0, startPrice: 1.0820, endIndex: 4, endPrice: 1.0868, label: 'Dynamic Trend Support' },
        entry: 1.0855,
        sl: 1.0835,
        tp: 1.0905,
        candles: [
          { id: 1, open: 1.0825, high: 1.0840, low: 1.0820, close: 1.0838, label: 'Low 1 (HH/HL)' },
          { id: 2, open: 1.0838, high: 1.0865, low: 1.0835, close: 1.0860, label: 'Expansion' },
          { id: 3, open: 1.0860, high: 1.0872, low: 1.0848, close: 1.0850, label: 'Correction' },
          { id: 4, open: 1.0850, high: 1.0885, low: 1.0848, close: 1.0880, label: 'Higher High' },
          { id: 5, open: 1.0880, high: 1.0885, low: 1.0865, close: 1.0868, label: 'Touch Trendline', annotation: 'Buy Bounce', annotationType: 'entry' },
          { id: 6, open: 1.0868, high: 1.0910, low: 1.0865, close: 1.0905, label: 'New High Target', annotation: 'TP Hit', annotationType: 'tp' },
        ],
      };
    }

    // 5. Default General Educational Candle Pattern
    return {
      trendType: 'bullish',
      entry: 1.0845,
      sl: 1.0820,
      tp: 1.0895,
      candles: [
        { id: 1, open: 1.0815, high: 1.0835, low: 1.0810, close: 1.0830, label: 'Open Wave' },
        { id: 2, open: 1.0830, high: 1.0855, low: 1.0825, close: 1.0850, label: 'Impulse' },
        { id: 3, open: 1.0850, high: 1.0852, low: 1.0838, close: 1.0840, label: 'Pullback' },
        { id: 4, open: 1.0840, high: 1.0868, low: 1.0838, close: 1.0865, label: 'Confirmation' },
        { id: 5, open: 1.0865, high: 1.0898, low: 1.0862, close: 1.0895, label: 'Target', annotation: 'TP Hit', annotationType: 'tp' },
      ],
    };
  };

  const candleSetup = getCandlesForLesson();

  return (
    <div className="space-y-2">
      {/* View Mode Switcher Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-mono font-bold uppercase text-[#D4AF37] flex items-center gap-1.5">
          <Layers className="w-4 h-4" />
          <span>Technical Blueprint: {lesson.illustration.title}</span>
        </span>

        {/* Toggle between Candlestick Visualizer & ASCII Matrix */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setViewMode('candles')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              viewMode === 'candles'
                ? 'bg-[#D4AF37] text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CandlestickChart className="w-3 h-3" />
            <span>Candlestick View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('ascii')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              viewMode === 'ascii'
                ? 'bg-[#D4AF37] text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>ASCII Blueprint</span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === 'candles' ? (
        <div className="space-y-1.5">
          <CandlestickVisualizer
            title={lesson.illustration.title}
            subtitle={lesson.illustration.caption}
            candles={candleSetup.candles}
            trendType={candleSetup.trendType}
            entryLevel={candleSetup.entry}
            slLevel={candleSetup.sl}
            tpLevel={candleSetup.tp}
            resistanceLevel={candleSetup.resistance}
            supportLevel={candleSetup.support}
            fvgZone={candleSetup.fvgZone}
            trendline={candleSetup.trendline}
          />
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
          <pre className="font-mono text-[11px] sm:text-xs text-emerald-400 whitespace-pre leading-relaxed">
            {lesson.illustration.content}
          </pre>
        </div>
      )}
    </div>
  );
};
