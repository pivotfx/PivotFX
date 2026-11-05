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

    // 1. Tower Top Reversal setups (GBP/USD ~1.3545 sweep -> 1.34998 execution -> 1.3445 target)
    if (text.includes('tower') || text.includes('top') || text.includes('reversal')) {
      return {
        trendType: 'reversal',
        resistance: 1.3545,
        entry: 1.3510,
        sl: 1.3552,
        tp: 1.3445,
        candles: [
          { id: 1, open: 1.3460, high: 1.3492, low: 1.3455, close: 1.3488, label: 'Run-up' },
          { id: 2, open: 1.3488, high: 1.3522, low: 1.3485, close: 1.3518, label: 'FOMO Green' },
          { id: 3, open: 1.3518, high: 1.3545, low: 1.3514, close: 1.3540, label: 'Tower Peak Trap (1.3545)' },
          { id: 4, open: 1.3540, high: 1.3544, low: 1.3516, close: 1.3520, label: 'Rejection Wick' },
          { id: 5, open: 1.3520, high: 1.3524, low: 1.3504, close: 1.3510, label: 'Slice 20 EMA (1.3510)', annotation: 'Sell Entry', annotationType: 'entry' },
          { id: 6, open: 1.3510, high: 1.3514, low: 1.3445, close: 1.3450, label: '50 EMA Drop (1.3445)', annotation: 'TP Hit', annotationType: 'tp' },
        ],
      };
    }

    // 2. Liquidity Sweeps & Smart Money (EUR/USD ~1.1288 sweep -> 1.1267 execution)
    if (text.includes('liquidity') || text.includes('sweep') || text.includes('stop hunt') || text.includes('mss')) {
      return {
        trendType: 'reversal',
        resistance: 1.1282,
        entry: 1.1267,
        sl: 1.1292,
        tp: 1.1210,
        candles: [
          { id: 1, open: 1.1252, high: 1.1280, low: 1.1248, close: 1.1276, label: 'Equal High 1' },
          { id: 2, open: 1.1276, high: 1.1282, low: 1.1258, close: 1.1262, label: 'Equal High 2' },
          { id: 3, open: 1.1262, high: 1.1292, low: 1.1260, close: 1.1268, label: 'Sweep Wick (Trap)', annotation: 'Stop Grab', annotationType: 'sweep' },
          { id: 4, open: 1.1268, high: 1.1270, low: 1.1235, close: 1.1238, label: 'MSS Shift' },
          { id: 5, open: 1.1238, high: 1.1267, low: 1.1236, close: 1.1265, label: 'Retest Entry', annotation: 'Sniper Sell', annotationType: 'entry' },
          { id: 6, open: 1.1265, high: 1.1268, low: 1.1210, close: 1.1215, label: 'Target Realized', annotation: 'TP Hit', annotationType: 'tp' },
        ],
      };
    }

    // 3. Fair Value Gap (FVG) on XAU/USD Spot Gold (~3955.00)
    if (text.includes('fvg') || text.includes('imbalance') || text.includes('inefficiency') || text.includes('gap')) {
      return {
        trendType: 'bullish',
        fvgZone: { top: 3960.0, bottom: 3948.0, label: 'Institutional Buy Imbalance' },
        entry: 3955.0,
        sl: 3945.5,
        tp: 3979.0,
        candles: [
          { id: 1, open: 3938.0, high: 3948.0, low: 3936.5, close: 3946.0, label: 'Candle 1 High' },
          { id: 2, open: 3946.0, high: 3968.0, low: 3945.5, close: 3966.5, label: 'Displacement' },
          { id: 3, open: 3966.5, high: 3972.0, low: 3960.0, close: 3969.0, label: 'Candle 3 Low (Gap)' },
          { id: 4, open: 3969.0, high: 3969.5, low: 3953.5, close: 3955.0, label: 'Mitigation Retest (3955)', annotation: 'Buy Zone', annotationType: 'entry' },
          { id: 5, open: 3955.0, high: 3970.0, low: 3954.0, close: 3968.0 },
          { id: 6, open: 3968.0, high: 3981.0, low: 3966.5, close: 3979.0, label: 'Target Hit (3979)', annotation: 'TP Hit', annotationType: 'tp' },
        ],
      };
    }

    // 4. Trendlines & Structure (EUR/USD ~1.12670)
    if (text.includes('trend') || text.includes('line') || text.includes('support') || text.includes('resistance') || text.includes('ema') || text.includes('pullback')) {
      return {
        trendType: 'bullish',
        trendline: { startIndex: 0, startPrice: 1.1225, endIndex: 4, endPrice: 1.1267, label: 'Dynamic Trend Support' },
        entry: 1.1267,
        sl: 1.1251,
        tp: 1.1319,
        candles: [
          { id: 1, open: 1.1230, high: 1.1248, low: 1.1225, close: 1.1245, label: 'Low 1 (HH/HL)' },
          { id: 2, open: 1.1245, high: 1.1272, low: 1.1242, close: 1.1268, label: 'Expansion' },
          { id: 3, open: 1.1268, high: 1.1276, low: 1.1252, close: 1.1255, label: 'Correction' },
          { id: 4, open: 1.1255, high: 1.1290, low: 1.1253, close: 1.1286, label: 'Higher High' },
          { id: 5, open: 1.1286, high: 1.1288, low: 1.1265, close: 1.1267, label: 'Touch 20 EMA (1.1267)', annotation: 'Buy Bounce', annotationType: 'entry' },
          { id: 6, open: 1.1267, high: 1.1322, low: 1.1265, close: 1.1319, label: 'New High Target', annotation: 'TP Hit', annotationType: 'tp' },
        ],
      };
    }

    // 5. Default General Educational Candle Pattern (GBP/USD ~1.34998)
    return {
      trendType: 'bullish',
      entry: 1.3500,
      sl: 1.3484,
      tp: 1.3552,
      candles: [
        { id: 1, open: 1.3472, high: 1.3492, low: 1.3468, close: 1.3488, label: 'Open Wave' },
        { id: 2, open: 1.3488, high: 1.3512, low: 1.3485, close: 1.3508, label: 'Impulse' },
        { id: 3, open: 1.3508, high: 1.3510, low: 1.3495, close: 1.3500, label: '20 EMA Pullback' },
        { id: 4, open: 1.3500, high: 1.3528, low: 1.3498, close: 1.3525, label: 'Confirmation' },
        { id: 5, open: 1.3525, high: 1.3555, low: 1.3522, close: 1.3552, label: 'Target', annotation: 'TP Hit', annotationType: 'tp' },
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
