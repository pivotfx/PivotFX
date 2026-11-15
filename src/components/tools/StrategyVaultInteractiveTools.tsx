import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { CandlestickVisualizer, CandleData } from '../common/CandlestickVisualizer';
import {
  globalLiveStream,
  GlobalStreamState,
  getTradingViewSymbol,
} from '../../utils/liveMarketEngine';
import { CurrencyPair } from '../../types';

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
  const [selectedSetupId, setSelectedSetupId] = useState<string>('bos-9-factor');
  const [candleStep, setCandleStep] = useState<number>(6);
  const [streamState, setStreamState] = useState<GlobalStreamState>(() => globalLiveStream.getState());

  useEffect(() => {
    const unsub = globalLiveStream.subscribe((next) => setStreamState(next));
    return () => unsub();
  }, []);

  const spotlightPairs: CurrencyPair[] = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'BTC/USD', 'ETH/USD'];
  const liveStrategyMatches = spotlightPairs
    .map((p) => streamState.markets.find((m) => m.pair === p))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const setups: StrategySetup[] = [
    {
      id: 'bos-9-factor',
      name: '6. BOS / CHoCH + 9-Factor Zero-Mistake Protocol',
      subtitle: 'Real-Time Structure Confirmation Before Every Trade',
      winRate: '81%',
      rrr: '1:2.9',
      bestSession: 'London / NY / 24/7 Crypto',
      coreConcept: 'Never buy into a downward Break of Structure (BOS) or sell into an upward structural shift. Our 9-Factor Zero-Mistake gate aligns H1 macro trend, M15/H1 Swing High/Low CHoCH detection, 20/50 EMA pullbacks, ATR-protected Stop Loss distances, and canonical TradingView parity (FX, OANDA, Binance) before releasing READY_ENTER.',
      entryRules: [
        'Verify H1 & M15 EMA 20/50 agree with trend direction (or wait for clean CHoCH candle body close).',
        'Ensure Readiness Gate shows READY (never chase Extended Zone candles > 0.8x ATR from 20 EMA).',
        'Run Deep AI Scan to audit recent OHLC bars and trap liquidity levels.',
        'Cross-check canonical TradingView quote (e.g. OANDA:XAUUSD / FX:EURUSD / BINANCE:BTCUSDT).'
      ],
      invalidationRules: [
        'Stop Loss placed strictly beyond protected BOS Swing High (Sell) or Swing Low (Buy) plus broker spread.',
        'Dynamic Position Size Calculator automatically locks lot size so SL never exceeds your % equity cap.'
      ],
      takeProfitRules: [
        'TP1 at 1.65x risk (scale out 50% and move SL to Breakeven).',
        'TP2 at 2.85x+ risk (or calibrated dynamically to your $ USD Target Profit goal).'
      ],
      trendType: 'bearish',
      resistanceLevel: 3918.0,
      entryLevel: 3898.0,
      slLevel: 3914.5,
      tpLevel: 3858.0,
      fvgZone: { top: 3905.0, bottom: 3894.0, label: 'Bearish BOS FVG Mitigation' },
      candles: [
        { id: 1, open: 3902.0, high: 3915.0, low: 3899.0, close: 3912.0, label: 'Prior Swing High' },
        { id: 2, open: 3912.0, high: 3922.5, low: 3908.0, close: 3910.0, label: 'Liquidity Sweep Wick', annotation: 'BSL Sweep', annotationType: 'sweep' },
        { id: 3, open: 3910.0, high: 3911.0, low: 3890.0, close: 3892.0, label: 'CHoCH / BOS Breakdown' },
        { id: 4, open: 3892.0, high: 3901.0, low: 3890.5, close: 3898.0, label: 'Pullback Into FVG', annotation: 'READY SELL', annotationType: 'entry' },
        { id: 5, open: 3898.0, high: 3900.0, low: 3876.0, close: 3879.0, label: 'TP1 Breakeven Lock' },
        { id: 6, open: 3879.0, high: 3882.0, low: 3856.0, close: 3858.0, label: 'TP2 Target Delivered', annotation: 'TP2 Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'XAU/USD (OANDA:XAUUSD · M15)',
        date: 'Live BOS + 9-Factor Validation Case',
        entryPrice: '3898.00',
        slPrice: '3914.50 (Protected Swing High)',
        tpPrice: '3858.00 (+400 pips / +$30.00 calibrated)',
        pipsWon: '+400.0 Pips',
        dollarOutcome: 'Risk-managed lot sizing calibrated to user Target Profit',
        lessonLearned: 'Waiting for the BOS breakdown + pullback prevented buying at 3918 and aligned EP, SL, and TP2 cleanly below current candles.'
      }
    },
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
        'Stop Loss placed beyond the highest wick of the Tower + ATR buffer.',
        'Use Dynamic Position Sizing so loss stays strictly inside your % account risk limit.'
      ],
      takeProfitRules: [
        'TP1 (50% position off): Dynamic 50 EMA value line + Breakeven SL.',
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
        asset: 'GBP/USD (FX:GBPUSD · M15)',
        date: 'New York Open (15:30 EAT)',
        entryPrice: '1.35100',
        slPrice: '1.35500 (40.0 pips)',
        tpPrice: '1.34100 (100.0 pips)',
        pipsWon: '+100.0 Pips',
        dollarOutcome: '1:2.5 Risk-to-Reward Execution',
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
        'London open prints a sharp wick spiking above the highs, then closes back inside the range.',
        'Next candle breaks the recent swing low with high volume displacement (MSS confirmed).',
        'Enter on the minor pullback retest.'
      ],
      invalidationRules: [
        'Stop Loss placed strictly above the spike sweep wick tip.',
        'If price closes a full candle body above the sweep wick, the setup is void.'
      ],
      takeProfitRules: [
        'Take profit at the opposing liquidity pool (Asian session low or sell-side liquidity).'
      ],
      trendType: 'reversal',
      resistanceLevel: 1.1648,
      entryLevel: 1.1636,
      slLevel: 1.1665,
      tpLevel: 1.1575,
      candles: [
        { id: 1, open: 1.1618, high: 1.1646, low: 1.1615, close: 1.1643, label: 'Equal High 1' },
        { id: 2, open: 1.1643, high: 1.1648, low: 1.1626, close: 1.1630 },
        { id: 3, open: 1.1630, high: 1.1662, low: 1.1628, close: 1.1634, label: 'Sweep Wick (+14 pips)', annotation: 'Stop Hunt', annotationType: 'sweep' },
        { id: 4, open: 1.1634, high: 1.1638, low: 1.1602, close: 1.1606, label: 'MSS Displacement' },
        { id: 5, open: 1.1606, high: 1.1636, low: 1.1604, close: 1.1636, label: 'Retest Entry', annotation: 'Sell Entry', annotationType: 'entry' },
        { id: 6, open: 1.1636, high: 1.1639, low: 1.1575, close: 1.1580, label: 'Opposing Low Hit', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'EUR/USD (FX:EURUSD · M15)',
        date: 'Wednesday 10:15 EAT',
        entryPrice: '1.16360',
        slPrice: '1.16650 (29 pips)',
        tpPrice: '1.15750 (61 pips)',
        pipsWon: '+61.0 Pips',
        dollarOutcome: '2.10x Return on Risked Equity',
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
      coreConcept: 'When large institutions buy aggressively, candle 2 expands so rapidly that candle 1 high and candle 3 low never touch. This creates a Fair Value Gap (an unfilled price void). Algorithms pull price back into this void to balance orders before continuing.',
      entryRules: [
        'Confirm a 3-candle sequence where Candle 1 High < Candle 3 Low (Bullish FVG).',
        'Mark the FVG zone with the Rectangle tool.',
        'Wait patiently for price to drift into the gap (0.50 of the box).',
        'Enter when lower-timeframe rejection + 9-Factor score confirm.'
      ],
      invalidationRules: [
        'Stop Loss set just below Candle 1 swing low.',
        'If a candle closes completely through and below the FVG, exit immediately.'
      ],
      takeProfitRules: [
        'Take Profit at the previous swing high + extended TP2 liquidity.'
      ],
      trendType: 'bullish',
      fvgZone: { top: 3906.0, bottom: 3893.0, label: 'Institutional Buy Imbalance' },
      entryLevel: 3898.0,
      slLevel: 3887.0,
      tpLevel: 3934.0,
      candles: [
        { id: 1, open: 3886.0, high: 3893.0, low: 3884.5, close: 3891.5, label: 'Candle 1 High' },
        { id: 2, open: 3891.5, high: 3918.0, low: 3890.5, close: 3916.0, label: 'Displacement Expansion' },
        { id: 3, open: 3916.0, high: 3924.0, low: 3906.0, close: 3921.0, label: 'Candle 3 Low (Gap Created)' },
        { id: 4, open: 3921.0, high: 3921.5, low: 3896.0, close: 3898.0, label: 'Retest Into Gap (3898)', annotation: 'Buy Zone', annotationType: 'entry' },
        { id: 5, open: 3898.0, high: 3918.0, low: 3897.0, close: 3915.0 },
        { id: 6, open: 3915.0, high: 3938.0, low: 3914.0, close: 3934.0, label: 'Expansion to Target', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'XAU/USD Gold (OANDA:XAUUSD · M15)',
        date: 'New York Overlap (16:00 EAT)',
        entryPrice: '$3,898.00',
        slPrice: '$3,887.00 ($11 risk)',
        tpPrice: '$3,934.00 ($36 reward)',
        pipsWon: '+360 Pips ($36 gold move)',
        dollarOutcome: '3.27x Return on Risked Capital',
        lessonLearned: 'Trading inside the FVG eliminates chasing runaway green candles. You enter at wholesale discount synced directly to TradingView.'
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
        'Box the Asian range (03:00 to 09:45 EAT).',
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
        asset: 'GBP/USD (FX:GBPUSD · M15)',
        date: 'Tuesday 10:00 EAT',
        entryPrice: '1.34998',
        slPrice: '1.34680 (31.8 pips)',
        tpPrice: '1.35650 (65.2 pips)',
        pipsWon: '+65.2 Pips',
        dollarOutcome: '2.05x Return on Risked Equity',
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
        'Look for a Pinbar or Engulfing candle touching the 20/50 EMA.',
        'Enter on the open of the following confirmation candle.'
      ],
      invalidationRules: [
        'Stop loss placed beyond the 50 EMA swing structure.',
        'If price closes 2 consecutive candles past the 50 EMA, trend is invalidated.'
      ],
      takeProfitRules: [
        'Take Profit at the previous swing high + 1.65x / 2.85x extension.'
      ],
      trendType: 'bullish',
      trendline: { startIndex: 0, startPrice: 157.55, endIndex: 5, endPrice: 158.65, label: 'Dynamic EMA Support' },
      entryLevel: 157.95,
      slLevel: 157.65,
      tpLevel: 158.65,
      candles: [
        { id: 1, open: 157.40, high: 157.82, low: 157.35, close: 157.78, label: 'Trend Impulse' },
        { id: 2, open: 157.78, high: 158.12, low: 157.72, close: 158.08 },
        { id: 3, open: 158.08, high: 158.35, low: 158.02, close: 158.28, label: 'Swing Peak' },
        { id: 4, open: 158.28, high: 158.30, low: 157.88, close: 157.92, label: 'Value Zone Test', annotation: '50 EMA Touch', annotationType: 'warning' },
        { id: 5, open: 157.92, high: 158.22, low: 157.86, close: 157.95, label: 'Hammer Confirmation (157.95)', annotation: 'Buy Entry', annotationType: 'entry' },
        { id: 6, open: 157.95, high: 158.72, low: 157.92, close: 158.65, label: 'Trend New High', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      realSampleCase: {
        asset: 'USD/JPY (FX:USDJPY · M15)',
        date: 'Monday 14:00 EAT',
        entryPrice: '157.950',
        slPrice: '157.650 (30 pips)',
        tpPrice: '158.650 (70 pips)',
        pipsWon: '+70.0 Pips',
        dollarOutcome: '2.33x Return on Risked Equity',
        lessonLearned: 'Trading with the 20/50 EMA stack feels easy because you are swimming with the market current, not fighting it.'
      }
    }
  ];

  const currentSetup = setups.find((s) => s.id === selectedSetupId) || setups[0];
  const displayedCandles = currentSetup.candles.slice(0, candleStep);

  return (
    <div className="space-y-6">
      {/* Live Best-Fit Strategy Matcher Across Major Markets */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#090F1E] border border-cyan-500/35 space-y-3 font-mono tabular-nums">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-[#00C261]" />
            <span>Live AI Best-Fit Strategy Matcher Across Active Markets</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Auto-Synced Spot · TradingView Symbol Parity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {liveStrategyMatches.map((m) => {
            const isBuy = m.bias !== 'STRONG_SELL';
            const tvSym = m.tvSymbol || getTradingViewSymbol(m.pair);
            return (
              <div
                key={m.pair}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-white">{m.pair}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black inline-flex items-center gap-0.5 ${
                      isBuy
                        ? 'bg-[#00C261]/20 text-[#00C261]'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {isBuy ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {isBuy ? 'BUY' : 'SELL'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#D4AF37] font-bold">@ {m.price}</span>
                  <span className="text-[10px] text-slate-400">{tvSym}</span>
                </div>
                <div className="text-[10px] text-cyan-300 font-bold line-clamp-1">
                  {m.recommendedStrategy || 'BOS/CHoCH 9-Factor Trend'}
                </div>
                <div className="text-[9px] text-slate-400 flex items-center justify-between">
                  <span>SL {m.suggestedSL}</span>
                  <span className="text-[#00C261]">TP2 {m.suggestedTP2}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Strategy Simulator (Updated 2026)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            6 Institutional Execution Setups With Real Candlesticks
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Step through every candle in real time to verify BOS/CHoCH transitions, avoid liquidity traps, and sync entries directly to TradingView &amp; MT4/MT5.
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {setups.map((s) => (
          <button
            key={s.id}
            type="button"
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
            <span className="text-xs font-bold line-clamp-2 mt-1">{s.name.replace(/^\d+\.\s*/, '')}</span>
            <span className="text-[9px] font-mono text-emerald-400 mt-1">{s.winRate} Win Rate</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Candlestick Visualizer Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-[#D4AF37]/40 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
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
                type="button"
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
              type="button"
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
          <strong className="font-mono uppercase block text-[11px] text-[#D4AF37]">
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
              <span>Stop Loss &amp; Invalidation</span>
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
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#D4AF37] text-black font-mono font-bold text-xs">
                {currentSetup.realSampleCase.asset}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C261]" />
                <span>Live Execution Record • {currentSetup.realSampleCase.date}</span>
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {currentSetup.realSampleCase.pipsWon}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono tabular-nums">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Entry Price</span>
              <span className="text-white font-bold">{currentSetup.realSampleCase.entryPrice}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Stop Loss</span>
              <span className="text-red-400 font-bold">{currentSetup.realSampleCase.slPrice}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Take Profit</span>
              <span className="text-emerald-400 font-bold">{currentSetup.realSampleCase.tpPrice}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Risk-Managed Outcome</span>
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
