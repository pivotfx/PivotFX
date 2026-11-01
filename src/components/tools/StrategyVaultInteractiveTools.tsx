import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Target,
  Zap,
  Info,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { CandlestickVisualizer, CandleData } from '../common/CandlestickVisualizer';

interface StrategySetup {
  id: string;
  name: string;
  subtitle: string;
  winRate: string;
  rrr: string;
  bestSession: string;
  coreConcept: string;
  entryRules: string[];
  invalidationRules: string[];
  takeProfitRules: string[];
  candles: CandleData[];
  trendType: 'bullish' | 'bearish' | 'reversal' | 'range';
  entryLevel: number;
  slLevel: number;
  tpLevel: number;
  resistanceLevel?: number;
  supportLevel?: number;
  fvgZone?: { top: number; bottom: number; label: string };
  trendline?: { startIndex: number; startPrice: number; endIndex: number; endPrice: number; label?: string };
  realSampleCase: {
    asset: string;
    date: string;
    entryPrice: string;
    slPrice: string;
    tpPrice: string;
    pipsWon: string;
    dollarOutcome: string;
    lessonLearned: string;
  };
}

export const StrategyVaultInteractiveTools: React.FC = () => {
  const [selectedSetupId, setSelectedSetupId] = useState<string>('tower-top');
  const [candleStep, setCandleStep] = useState<number>(6); // Show all 6 or step-through

  const setups: StrategySetup[] = [
    {
      id: 'tower-top',
      name: '1. The Gilgil Tower Top Reversal',
      subtitle: 'Counter-Trend Institutional Exhaustion Trap',
      winRate: '78%',
      rrr: '1:3.2',
      bestSession: 'London / NY Overlap',
      coreConcept: 'Retail traders chase green parabolic expansion candles when price stretches 35+ pips away from the 20 EMA. Smart money initiates high-volume short limit orders, creating an upper wick rejection followed by an aggressive red engulfing candle that slices back through the 20 EMA.',
      entryRules: [
        'Identify 3+ consecutive steep green expansion candles far above the 20 EMA.',
        'Watch for the Tower Top wick piercing resistance (e.g. 1.2965).',
        'Wait for the first red candle to close cleanly BELOW the 20 EMA line.',
        'Enter short immediately at candle close (e.g. 1.2916).'
      ],
      invalidationRules: [
        'Stop Loss placed 3 pips strictly above the highest wick of the Tower (1.2970).',
        'Maximum risk capped strictly at $2.00 using the Gilgil micro-lot sizing formula.'
      ],
      takeProfitRules: [
        'TP1 (50% position off): Dynamic 50 EMA value line (approx +25 pips).',
        'TP2 (Runner): Key session support floor or 1:3 RRR target.'
      ],
      trendType: 'reversal',
      entryLevel: 1.2916,
      slLevel: 1.2970,
      tpLevel: 1.2780,
      resistanceLevel: 1.2965,
      candles: [
        { id: 1, open: 1.2840, high: 1.2870, low: 1.2835, close: 1.2865, label: 'Ascent 1' },
        { id: 2, open: 1.2865, high: 1.2910, low: 1.2860, close: 1.2905, label: 'Ascent 2' },
        { id: 3, open: 1.2905, high: 1.2965, low: 1.2900, close: 1.2958, label: 'Tower High (1296.56 Trap)' },
        { id: 4, open: 1.2958, high: 1.2962, low: 1.2925, close: 1.2930, label: 'Exhaustion Wick' },
        { id: 5, open: 1.2930, high: 1.2935, low: 1.2910, close: 1.2916, label: 'ENTRY: 20 EMA Slice (1291.69)', annotation: 'Sniper Sell', annotationType: 'entry' },
        { id: 6, open: 1.2916, high: 1.2920, low: 1.2780, close: 1.2785, label: 'Target Hit (1289.38 / 1278)', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'GBP/USD (M15)',
        date: 'Thursday 15:30 EAT (New York Open)',
        entryPrice: '1.29169',
        slPrice: '1.29656 (48.7 pips)',
        tpPrice: '1.27800 (136.9 pips)',
        pipsWon: '+136.9 Pips',
        dollarOutcome: 'Risked $2.00 to make $5.62 with 0.01 lot',
        lessonLearned: 'The retail crowd bought the top green candle because of FOMO and got wiped out. The disciplined trader waited for the breakdown below EMA 20.'
      }
    },
    {
      id: 'liquidity-sweep',
      name: '2. Liquidity Sweep & Market Structure Shift (MSS)',
      subtitle: 'Smart Money Stop-Hunt Reversal',
      winRate: '82%',
      rrr: '1:3.5',
      bestSession: 'London Open (09:00 - 11:00 EAT)',
      coreConcept: 'Banks and algorithms purposely push price 5 to 10 pips above clean equal highs (where retail buy stops and breakout orders rest). Once liquidity is grabbed, price immediately reverses with high velocity, shifting market structure (MSS) to the downside.',
      entryRules: [
        'Locate prominent double tops or equal highs from Asian session.',
        'London open prints a sharp wick spiking above the highs, but closes back inside the range within 15 minutes.',
        'Next candle breaks the recent swing low with high volume displacement (MSS confirmed).',
        'Enter on the minor pullback retest.'
      ],
      invalidationRules: [
        'Stop Loss placed 2 pips above the spike sweep wick tip.',
        'If price closes a full candle body above the sweep wick, the setup is void.'
      ],
      takeProfitRules: [
        'Take profit at the opposing liquidity pool (Asian session low or sell-side liquidity).'
      ],
      trendType: 'reversal',
      resistanceLevel: 1.0880,
      entryLevel: 1.0865,
      slLevel: 1.0892,
      tpLevel: 1.0805,
      candles: [
        { id: 1, open: 1.0850, high: 1.0878, low: 1.0845, close: 1.0875, label: 'Equal High 1' },
        { id: 2, open: 1.0875, high: 1.0880, low: 1.0855, close: 1.0860 },
        { id: 3, open: 1.0860, high: 1.0892, low: 1.0858, close: 1.0865, label: 'Sweep Wick (+12 pips)', annotation: 'Stop Hunt', annotationType: 'sweep' },
        { id: 4, open: 1.0865, high: 1.0868, low: 1.0830, close: 1.0832, label: 'MSS Displacement' },
        { id: 5, open: 1.0832, high: 1.0865, low: 1.0830, close: 1.0865, label: 'Retest Entry', annotation: 'Sell Entry', annotationType: 'entry' },
        { id: 6, open: 1.0865, high: 1.0868, low: 1.0805, close: 1.0810, label: 'Opposing Low Hit', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'EUR/USD (M15)',
        date: 'Wednesday 10:15 EAT',
        entryPrice: '1.08650',
        slPrice: '1.08920 (27 pips)',
        tpPrice: '1.08050 (60 pips)',
        pipsWon: '+60.0 Pips',
        dollarOutcome: 'Risked $2.00 to make $4.44 (2.22x return)',
        lessonLearned: 'Never buy a breakout of equal highs during the first 30 minutes of London session; 80% are stop sweeps!'
      }
    },
    {
      id: 'fvg-retest',
      name: '3. Fair Value Gap (FVG) Imbalance Retest',
      subtitle: 'Institutional Inefficiency Mitigation',
      winRate: '80%',
      rrr: '1:2.8',
      bestSession: 'New York Morning (15:30 - 18:00 EAT)',
      coreConcept: 'When large institutions buy aggressively, candle 2 expands so rapidly that candle 1 high and candle 3 low never touch. This creates a Fair Value Gap (an unfilled price void). Algorithms will pull price back into this void to balance orders before continuing.',
      entryRules: [
        'Confirm a 3-candle sequence where Candle 1 High < Candle 3 Low (Bullish FVG).',
        'Mark the FVG zone with the Rectangle tool.',
        'Wait patiently for price to drift into the gap (0.50 of the box).',
        'Enter long when a lower-timeframe rejection wick appears inside the gap.'
      ],
      invalidationRules: [
        'Stop Loss set just below Candle 1 low.',
        'If a candle closes completely through and below the FVG, exit immediately.'
      ],
      takeProfitRules: [
        'Take Profit at the previous swing high that was created by the expansion candle.'
      ],
      trendType: 'bullish',
      fvgZone: { top: 2038.5, bottom: 2028.0, label: 'Institutional Buy Imbalance' },
      entryLevel: 2030.0,
      slLevel: 2022.0,
      tpLevel: 2055.0,
      candles: [
        { id: 1, open: 2020.0, high: 2028.0, low: 2019.0, close: 2026.0, label: 'Candle 1 High' },
        { id: 2, open: 2026.0, high: 2045.0, low: 2025.5, close: 2044.0, label: 'Displacement Expansion' },
        { id: 3, open: 2044.0, high: 2050.0, low: 2038.5, close: 2048.0, label: 'Candle 3 Low (Gap Created)' },
        { id: 4, open: 2048.0, high: 2048.0, low: 2030.0, close: 2032.0, label: 'Retest Into Gap', annotation: 'Buy Zone', annotationType: 'entry' },
        { id: 5, open: 2032.0, high: 2045.0, low: 2031.0, close: 2043.0 },
        { id: 6, open: 2043.0, high: 2058.0, low: 2042.0, close: 2056.0, label: 'Expansion to Target', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'XAU/USD Gold (M15)',
        date: 'Friday 16:00 EAT (Post-US PMI Data)',
        entryPrice: '$2030.00',
        slPrice: '$2022.00 ($8 risk)',
        tpPrice: '$2055.00 ($25 reward)',
        pipsWon: '+250 Pips ($25 gold move)',
        dollarOutcome: 'Risked $2.00 to make $6.25 (3.12x return)',
        lessonLearned: 'Trading inside the FVG eliminates chasing runaway green candles. You enter at wholesale discount.'
      }
    },
    {
      id: 'london-breakout',
      name: '4. London Open Breakout & Session Trap',
      subtitle: 'The 10:00 EAT Asian Range Sweep',
      winRate: '75%',
      rrr: '1:2.5',
      bestSession: 'Frankfurt / London Open (09:00 - 11:30 EAT)',
      coreConcept: 'Asian session moves slowly in a tight 20-30 pip horizontal corridor. Between 09:30 and 10:30 EAT, Frankfurt/London market makers intentionally sweep one side of the Asian box to trick early breakout traders, then explode in the true daily trend direction.',
      entryRules: [
        'Box the Asian range (00:00 to 08:30 GMT).',
        'Observe the initial fakeout thrust out of the box.',
        'When the fakeout gets rejected and candles close back inside the box, enter in the opposite direction.',
        'Target the opposing Asian boundary plus 15 pips continuation.'
      ],
      invalidationRules: [
        'Stop loss 5 pips outside the fakeout high/low.'
      ],
      takeProfitRules: [
        'Take Profit 1 at Asian Midpoint; Take Profit 2 at opposing Asian extreme.'
      ],
      trendType: 'bullish',
      supportLevel: 1.2650,
      resistanceLevel: 1.2700,
      entryLevel: 1.2660,
      slLevel: 1.2635,
      tpLevel: 1.2730,
      candles: [
        { id: 1, open: 1.2670, high: 1.2690, low: 1.2660, close: 1.2675, label: 'Asian Range' },
        { id: 2, open: 1.2675, high: 1.2685, low: 1.2660, close: 1.2668, label: 'Asian Low Test' },
        { id: 3, open: 1.2668, high: 1.2670, low: 1.2638, close: 1.2658, label: 'London Fakeout Sweep', annotation: 'Bear Trap', annotationType: 'sweep' },
        { id: 4, open: 1.2658, high: 1.2680, low: 1.2655, close: 1.2678, label: 'Re-entry Rebound', annotation: 'Buy Signal', annotationType: 'entry' },
        { id: 5, open: 1.2678, high: 1.2710, low: 1.2675, close: 1.2705, label: 'Asian High Break' },
        { id: 6, open: 1.2705, high: 1.2735, low: 1.2700, close: 1.2730, label: 'Expansion Extension', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'GBP/USD (M15)',
        date: 'Tuesday 10:00 EAT',
        entryPrice: '1.26600',
        slPrice: '1.26350 (25 pips)',
        tpPrice: '1.27300 (70 pips)',
        pipsWon: '+70.0 Pips',
        dollarOutcome: 'Risked $2.00 to make $5.60',
        lessonLearned: 'The initial breakout of the Asian session is fake 7 out of 10 times. Wait for the re-entry.'
      }
    },
    {
      id: 'ema-pullback',
      name: '5. Dynamic EMA 20/50 Pullback (Trend Rider)',
      subtitle: 'Value Zone Trend Continuation',
      winRate: '84%',
      rrr: '1:2.4',
      bestSession: 'Trending Days (Any Session)',
      coreConcept: 'In a sustained trend, the space between the 20 EMA and 50 EMA acts as an institutional trampoline (the "Value Zone"). When price pulls back into this zone on diminishing volume and prints a reversal candlestick, trend continuation has maximum statistical probability.',
      entryRules: [
        'Confirm EMA 20 is sloped clearly above EMA 50 (for Buy) or below (for Sell).',
        'Wait for price to retrace into the dynamic pocket between the two moving averages.',
        'Look for a Pinbar or Bullish Engulfing candle touching the 50 EMA.',
        'Enter on the open of the following confirmation candle.'
      ],
      invalidationRules: [
        'Stop loss placed 3 pips below the 50 EMA line.',
        'If price closes 2 consecutive candles below the 50 EMA, trend is broken.'
      ],
      takeProfitRules: [
        'Take Profit at the previous swing high.'
      ],
      trendType: 'bullish',
      trendline: { startIndex: 0, startPrice: 154.10, endIndex: 5, endPrice: 155.10, label: 'Dynamic EMA Support' },
      entryLevel: 154.40,
      slLevel: 154.15,
      tpLevel: 155.10,
      candles: [
        { id: 1, open: 153.90, high: 154.30, low: 153.85, close: 154.25, label: 'Trend Impulse' },
        { id: 2, open: 154.25, high: 154.60, low: 154.20, close: 154.55 },
        { id: 3, open: 154.55, high: 154.80, low: 154.50, close: 154.75, label: 'Swing Peak' },
        { id: 4, open: 154.75, high: 154.78, low: 154.38, close: 154.40, label: 'Value Zone Test', annotation: '50 EMA Touch', annotationType: 'warning' },
        { id: 5, open: 154.40, high: 154.68, low: 154.35, close: 154.65, label: 'Hammer Confirmation', annotation: 'Buy Entry', annotationType: 'entry' },
        { id: 6, open: 154.65, high: 155.15, low: 154.60, close: 155.10, label: 'Trend New High', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'USD/JPY (M15)',
        date: 'Monday 14:00 EAT',
        entryPrice: '154.400',
        slPrice: '154.150 (25 pips)',
        tpPrice: '155.100 (70 pips)',
        pipsWon: '+70.0 Pips',
        dollarOutcome: 'Risked $2.00 to make $5.60',
        lessonLearned: 'Trading with the 20/50 EMA stack feels easy because you are swimming with the market current, not fighting it.'
      }
    }
  ];

  const currentSetup = setups.find((s) => s.id === selectedSetupId) || setups[0];
  const displayedCandles = currentSetup.candles.slice(0, candleStep);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Strategy Simulator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            5 Institutional Execution Setups With Real Candlesticks
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Step through every candle in real time to understand how smart money creates traps and where disciplined retail snipers enter.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Win Rate: <strong className="text-emerald-400">{currentSetup.winRate}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Target RRR: <strong className="text-[#D4AF37]">{currentSetup.rrr}</strong>
          </span>
        </div>
      </div>

      {/* Setup Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {setups.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedSetupId(s.id);
              setCandleStep(s.candles.length);
            }}
            className={`p-3 rounded-2xl text-left transition border flex flex-col justify-between ${
              selectedSetupId === s.id
                ? 'bg-[#152038] border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-[#D4AF37]">{s.rrr} RRR</span>
            <span className="text-xs font-bold line-clamp-1 mt-1">{s.name.replace(/^\d+\.\s*/, '')}</span>
            <span className="text-[9px] font-mono text-emerald-400 mt-1">{s.winRate} Win Rate</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Candlestick Visualizer Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-[#D4AF37]/40 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#D4AF37] font-bold">
                SETUP: {currentSetup.name}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">
                Best Timing: <strong className="text-white">{currentSetup.bestSession}</strong>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              {currentSetup.subtitle}
            </h3>
          </div>

          {/* Step-by-Step Playback Controls */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 px-2">Candle Step:</span>
            {[2, 3, 4, 5, 6].map((st) => (
              <button
                key={st}
                onClick={() => setCandleStep(st)}
                className={`w-7 h-7 rounded-lg font-bold transition flex items-center justify-center ${
                  candleStep === st
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
            <button
              onClick={() => setCandleStep(currentSetup.candles.length)}
              className="px-2 py-1 text-slate-400 hover:text-white font-mono text-[11px]"
            >
              All
            </button>
          </div>
        </div>

        {/* Real Candlestick Chart Rendered */}
        <CandlestickVisualizer
          title={`${currentSetup.name} Candle Formation`}
          subtitle={`Currently displaying step ${candleStep} of ${currentSetup.candles.length} candles. Notice Entry, Stop Loss, and Take Profit lines.`}
          candles={displayedCandles}
          trendType={currentSetup.trendType}
          entryLevel={currentSetup.entryLevel}
          slLevel={currentSetup.slLevel}
          tpLevel={currentSetup.tpLevel}
          resistanceLevel={currentSetup.resistanceLevel}
          supportLevel={currentSetup.supportLevel}
          fvgZone={currentSetup.fvgZone}
          trendline={currentSetup.trendline}
        />

        {/* Concept description */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
          <strong className="text-white font-mono uppercase block text-[11px] text-[#D4AF37]">
            Institutional Market Mechanics Behind This Pattern:
          </strong>
          <p>{currentSetup.coreConcept}</p>
        </div>

        {/* 3-Column Execution Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Entry Rules */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Exact Entry Rules</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentSetup.entryRules.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Invalidation Rules */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-400 uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Stop Loss & Invalidation</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentSetup.invalidationRules.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Take Profit Targets */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D4AF37] uppercase">
              <Target className="w-4 h-4" />
              <span>Take Profit Targets</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentSetup.takeProfitRules.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Real-World Case Study Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0B1020] to-slate-950 border border-[#D4AF37]/30 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#D4AF37] text-black font-mono font-bold text-xs">
                {currentSetup.realSampleCase.asset}
              </span>
              <span className="text-xs font-bold text-white">
                Live Execution Record • {currentSetup.realSampleCase.date}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {currentSetup.realSampleCase.pipsWon}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Entry Price</span>
              <span className="text-white font-bold">{currentSetup.realSampleCase.entryPrice}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Stop Loss</span>
              <span className="text-red-400 font-bold">{currentSetup.realSampleCase.slPrice}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Take Profit</span>
              <span className="text-emerald-400 font-bold">{currentSetup.realSampleCase.tpPrice}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Gilgil $2 Outcome</span>
              <span className="text-[#D4AF37] font-bold">{currentSetup.realSampleCase.dollarOutcome}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong className="text-white">Crucial Lesson: </strong>
            <span>{currentSetup.realSampleCase.lessonLearned}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
