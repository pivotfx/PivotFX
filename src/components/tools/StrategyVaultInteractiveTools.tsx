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
        'Watch for the Tower Top wick piercing resistance (e.g. 1.3545).',
        'Wait for the first red candle to close cleanly BELOW the 20 EMA line.',
        'Enter short immediately at candle close (e.g. 1.3510).'
      ],
      invalidationRules: [
        'Stop Loss placed 3 pips strictly above the highest wick of the Tower (1.3550).',
        'Maximum risk capped strictly at $2.00 using the Gilgil micro-lot sizing formula.'
      ],
      takeProfitRules: [
        'TP1 (50% position off): Dynamic 50 EMA value line (approx +25 pips).',
        'TP2 (Runner): Key session support floor or 1:3 RRR target.'
      ],
      trendType: 'reversal',
      entryLevel: 1.3510,
      slLevel: 1.3550,
      tpLevel: 1.3410,
      resistanceLevel: 1.3545,
      candles: [
        { id: 1, open: 1.3450, high: 1.3478, low: 1.3446, close: 1.3474, label: 'Ascent 1' },
        { id: 2, open: 1.3474, high: 1.3512, low: 1.3470, close: 1.3508, label: 'Ascent 2' },
        { id: 3, open: 1.3508, high: 1.3545, low: 1.3502, close: 1.3538, label: 'Tower High (1.3545 BSL Sweep)' },
        { id: 4, open: 1.3538, high: 1.3542, low: 1.3518, close: 1.3522, label: 'Exhaustion Wick' },
        { id: 5, open: 1.3522, high: 1.3526, low: 1.3505, close: 1.3510, label: 'ENTRY: 20 EMA Slice (1.3510)', annotation: 'Sniper Sell', annotationType: 'entry' },
        { id: 6, open: 1.3510, high: 1.3515, low: 1.3410, close: 1.3416, label: 'Target Hit (1.3485 / 1.3410)', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'GBP/USD (M15)',
        date: 'Thursday 15:30 EAT (New York Open)',
        entryPrice: '1.35100',
        slPrice: '1.35500 (40.0 pips)',
        tpPrice: '1.34100 (100.0 pips)',
        pipsWon: '+100.0 Pips',
        dollarOutcome: 'Risked $2.00 to make $5.00 with 0.01 lot',
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
      resistanceLevel: 1.1282,
      entryLevel: 1.1267,
      slLevel: 1.1296,
      tpLevel: 1.1210,
      candles: [
        { id: 1, open: 1.1252, high: 1.1280, low: 1.1248, close: 1.1277, label: 'Equal High 1' },
        { id: 2, open: 1.1277, high: 1.1282, low: 1.1258, close: 1.1263 },
        { id: 3, open: 1.1263, high: 1.1294, low: 1.1260, close: 1.1267, label: 'Sweep Wick (+12 pips)', annotation: 'Stop Hunt', annotationType: 'sweep' },
        { id: 4, open: 1.1267, high: 1.1270, low: 1.1235, close: 1.1238, label: 'MSS Displacement' },
        { id: 5, open: 1.1238, high: 1.1267, low: 1.1236, close: 1.1267, label: 'Retest Entry', annotation: 'Sell Entry', annotationType: 'entry' },
        { id: 6, open: 1.1267, high: 1.1270, low: 1.1210, close: 1.1215, label: 'Opposing Low Hit', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'EUR/USD (M15)',
        date: 'Wednesday 10:15 EAT',
        entryPrice: '1.12670',
        slPrice: '1.12960 (29 pips)',
        tpPrice: '1.12100 (57 pips)',
        pipsWon: '+57.0 Pips',
        dollarOutcome: 'Risked $2.00 to make $3.93 (~2x return)',
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
      fvgZone: { top: 3962.0, bottom: 3951.0, label: 'Institutional Buy Imbalance' },
      entryLevel: 3955.0,
      slLevel: 3946.0,
      tpLevel: 3985.0,
      candles: [
        { id: 1, open: 3944.0, high: 3951.0, low: 3942.5, close: 3949.5, label: 'Candle 1 High' },
        { id: 2, open: 3949.5, high: 3972.0, low: 3948.5, close: 3970.5, label: 'Displacement Expansion' },
        { id: 3, open: 3970.5, high: 3978.0, low: 3962.0, close: 3975.0, label: 'Candle 3 Low (Gap Created)' },
        { id: 4, open: 3975.0, high: 3975.5, low: 3954.0, close: 3955.0, label: 'Retest Into Gap (Spot 3955)', annotation: 'Buy Zone', annotationType: 'entry' },
        { id: 5, open: 3955.0, high: 3972.0, low: 3954.5, close: 3970.0 },
        { id: 6, open: 3970.0, high: 3988.0, low: 3969.0, close: 3985.0, label: 'Expansion to Target', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'XAU/USD Gold (M15)',
        date: 'Friday 16:00 EAT (Post-US PMI Data)',
        entryPrice: '$3,955.00',
        slPrice: '$3,946.00 ($9 risk)',
        tpPrice: '$3,985.00 ($30 reward)',
        pipsWon: '+300 Pips ($30 gold move)',
        dollarOutcome: 'Risked $2.00 to make $6.67 (3.33x return)',
        lessonLearned: 'Trading inside the FVG eliminates chasing runaway green candles. You enter at wholesale discount — or re-anchor directly to your broker chart (e.g. 4041.495 Futures).'
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
      supportLevel: 1.3485,
      resistanceLevel: 1.3530,
      entryLevel: 1.34998,
      slLevel: 1.3468,
      tpLevel: 1.3565,
      candles: [
        { id: 1, open: 1.3502, high: 1.3522, low: 1.3492, close: 1.3508, label: 'Asian Range' },
        { id: 2, open: 1.3508, high: 1.3516, low: 1.3488, close: 1.3494, label: 'Asian Low Test' },
        { id: 3, open: 1.3494, high: 1.3496, low: 1.3472, close: 1.3488, label: 'London Fakeout Sweep', annotation: 'Bear Trap', annotationType: 'sweep' },
        { id: 4, open: 1.3488, high: 1.3506, low: 1.3485, close: 1.34998, label: 'Re-entry Rebound (1.34998)', annotation: 'Buy Signal', annotationType: 'entry' },
        { id: 5, open: 1.34998, high: 1.3538, low: 1.3498, close: 1.3532, label: 'Asian High Break' },
        { id: 6, open: 1.3532, high: 1.3570, low: 1.3528, close: 1.3565, label: 'Expansion Extension', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'GBP/USD (M15)',
        date: 'Tuesday 10:00 EAT',
        entryPrice: '1.34998',
        slPrice: '1.34680 (31.8 pips)',
        tpPrice: '1.35650 (65.2 pips)',
        pipsWon: '+65.2 Pips',
        dollarOutcome: 'Risked $2.00 to make $4.10',
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
      trendline: { startIndex: 0, startPrice: 157.85, endIndex: 5, endPrice: 158.95, label: 'Dynamic EMA Support' },
      entryLevel: 158.25,
      slLevel: 157.95,
      tpLevel: 158.95,
      candles: [
        { id: 1, open: 157.70, high: 158.12, low: 157.65, close: 158.08, label: 'Trend Impulse' },
        { id: 2, open: 158.08, high: 158.42, low: 158.02, close: 158.38 },
        { id: 3, open: 158.38, high: 158.65, low: 158.32, close: 158.58, label: 'Swing Peak' },
        { id: 4, open: 158.58, high: 158.60, low: 158.18, close: 158.22, label: 'Value Zone Test', annotation: '50 EMA Touch', annotationType: 'warning' },
        { id: 5, open: 158.22, high: 158.52, low: 158.16, close: 158.25, label: 'Hammer Confirmation (158.25)', annotation: 'Buy Entry', annotationType: 'entry' },
        { id: 6, open: 158.25, high: 159.02, low: 158.22, close: 158.95, label: 'Trend New High', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'USD/JPY (M15)',
        date: 'Monday 14:00 EAT',
        entryPrice: '158.250',
        slPrice: '157.950 (30 pips)',
        tpPrice: '158.950 (70 pips)',
        pipsWon: '+70.0 Pips',
        dollarOutcome: 'Risked $2.00 to make $4.67',
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
