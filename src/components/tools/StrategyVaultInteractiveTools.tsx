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
  ExternalLink,
  LineChart,
} from 'lucide-react';
import { CandlestickVisualizer, CandleData } from '../common/CandlestickVisualizer';
import {
  globalLiveStream,
  GlobalStreamState,
  getTradingViewSymbol,
  getTradingViewExternalUrl,
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
  matchedPairs: CurrencyPair[];
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
  const [selectedSetupId, setSelectedSetupId] = useState<string>('bos-10-factor');
  const [candleStep, setCandleStep] = useState<number>(6);
  const [streamState, setStreamState] = useState<GlobalStreamState>(() => globalLiveStream.getState());

  useEffect(() => {
    const unsub = globalLiveStream.subscribe((next) => setStreamState(next));
    return () => unsub();
  }, []);

  const spotlightPairs: CurrencyPair[] = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'BTC/USD', 'ETH/USD'];
  const liveStrategyMatches = spotlightPairs
    .map((p) => streamState.markets.find((m) => m.pair === p))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const setups: StrategySetup[] = [
    {
      id: 'bos-10-factor',
      name: '6. BOS / CHoCH + 10-Factor Zero-Mistake Protocol',
      subtitle: 'Real-Time Structure, ADX & MACD Confirmation Before Entry',
      winRate: '81%',
      rrr: '1:2.9',
      bestSession: 'London / NY / 24/7 Crypto',
      coreConcept:
        'Never buy into a downward Break of Structure (BOS) or sell into an upward structural shift. Our 10-Factor Zero-Mistake gate aligns H1 macro trend, M15/H1 Swing High/Low BOS/CHoCH, 20/50 EMA pullbacks, ADX(14) trend displacement (>= 14.5), MACD(12/26/9) momentum, ATR-protected Stop Loss distances, and canonical TradingView parity (FX, OANDA, Binance) before releasing READY_ENTER.',
      entryRules: [
        'Verify H1 & M15 EMA 20/50 agree with trend direction (or wait for clean CHoCH candle body close).',
        'Confirm ADX(14) >= 14.5 & Readiness Gate shows READY_ENTER (never chase Extended candles > 0.8x ATR from 20 EMA).',
        'Run Deep Scan to audit recent M15/H1 OHLC bars across all 8 institutional pre-flight checks.',
        'Cross-check canonical TradingView quote (OANDA:XAUUSD / FX:EURUSD / BINANCE:BTCUSDT).',
      ],
      invalidationRules: [
        'Stop Loss placed strictly beyond protected BOS Swing High (Sell) or Swing Low (Buy) plus broker spread.',
        'Dynamic Position Size Calculator automatically locks lot size so SL never exceeds your % equity cap.',
      ],
      takeProfitRules: [
        'TP1 at 1.65x risk (scale out 50% and move SL to Breakeven).',
        'TP2 at 2.85x+ risk (or calibrated dynamically to your $ USD Target Profit goal).',
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
      matchedPairs: ['XAU/USD', 'BTC/USD'],
      realSampleCase: {
        asset: 'XAU/USD (OANDA:XAUUSD · M15)',
        date: '10-Factor BOS Validation Model',
        entryPrice: '3898.00',
        slPrice: '3914.50 (Protected Swing High)',
        tpPrice: '3858.00 (+400 pips)',
        pipsWon: '+400.0 Pips',
        dollarOutcome: 'Risk-managed lot sizing calibrated to equity cap',
        lessonLearned:
          'Waiting for the BOS breakdown + pullback prevented buying into resistance and aligned EP, SL, and TP2 cleanly below active structure.',
      },
    },
    {
      id: 'tower-top',
      name: '1. The Gilgil Tower Top Reversal',
      subtitle: 'Counter-Trend Institutional Exhaustion Trap',
      winRate: '78%',
      rrr: '1:3.2',
      bestSession: 'London / NY Overlap',
      coreConcept:
        'Retail traders chase green parabolic expansion candles when price stretches 35+ pips away from the 20 EMA. Smart money initiates high-volume short limit orders, creating an upper wick rejection followed by an aggressive red engulfing candle that slices back through the 20 EMA.',
      entryRules: [
        'Identify 3+ consecutive steep green expansion candles far above the 20 EMA.',
        'Watch for the Tower Top wick piercing resistance (liquidity sweep).',
        'Wait for the first red candle to close cleanly BELOW the 20 EMA line + CHoCH trigger.',
        'Enter short on confirmed close with ATR-protected Stop Loss above the Tower High.',
      ],
      invalidationRules: [
        'Stop Loss placed beyond the highest wick of the Tower + ATR buffer.',
        'Use Dynamic Position Sizing so loss stays strictly inside your % account risk limit.',
      ],
      takeProfitRules: [
        'TP1 (50% position off): Dynamic 50 EMA value line + Breakeven SL.',
        'TP2 (Runner): Key session support floor or 1:3 RRR target.',
      ],
      trendType: 'reversal',
      entryLevel: 1.3510,
      slLevel: 1.3550,
      tpLevel: 1.3410,
      resistanceLevel: 1.3545,
      candles: [
        { id: 1, open: 1.3450, high: 1.3478, low: 1.3446, close: 1.3474, label: 'Ascent 1' },
        { id: 2, open: 1.3474, high: 1.3512, low: 1.3470, close: 1.3508, label: 'Ascent 2' },
        { id: 3, open: 1.3508, high: 1.3545, low: 1.3502, close: 1.3538, label: 'Tower High (BSL Sweep)' },
        { id: 4, open: 1.3538, high: 1.3542, low: 1.3518, close: 1.3522, label: 'Exhaustion Wick' },
        { id: 5, open: 1.3522, high: 1.3526, low: 1.3505, close: 1.3510, label: 'ENTRY: 20 EMA Slice', annotation: 'Sniper Sell', annotationType: 'entry' },
        { id: 6, open: 1.3510, high: 1.3515, low: 1.3410, close: 1.3416, label: 'Target Delivered', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      matchedPairs: ['GBP/USD', 'GBP/JPY'],
      realSampleCase: {
        asset: 'GBP/USD (FX:GBPUSD · M15)',
        date: 'New York Open Reversal Playbook',
        entryPrice: '1.35100',
        slPrice: '1.35500 (40.0 pips)',
        tpPrice: '1.34100 (100.0 pips)',
        pipsWon: '+100.0 Pips',
        dollarOutcome: '1:2.5 Risk-to-Reward Execution',
        lessonLearned:
          'Buying parabolic candles far from the 20 EMA causes immediate drawdown. Wait for the slice back below the 20 EMA.',
      },
    },
    {
      id: 'liquidity-sweep',
      name: '2. Liquidity Sweep & Market Structure Shift (MSS)',
      subtitle: 'Smart Money Stop-Hunt Reversal',
      winRate: '82%',
      rrr: '1:3.5',
      bestSession: 'London Open (09:00 - 11:00 EAT)',
      coreConcept:
        'Banks and algorithms purposely push price 5 to 10 pips above clean equal highs (where retail buy stops and breakout orders rest). Once liquidity is grabbed, price immediately reverses with high velocity, shifting market structure (MSS) to the downside.',
      entryRules: [
        'Locate prominent double tops or equal highs from Asian session.',
        'London open prints a sharp wick spiking above the highs, then closes back inside the range.',
        'Next candle breaks the recent swing low with high volume displacement (MSS confirmed).',
        'Enter on the minor pullback retest.',
      ],
      invalidationRules: [
        'Stop Loss placed strictly above the spike sweep wick tip.',
        'If price closes a full candle body above the sweep wick, the setup is void.',
      ],
      takeProfitRules: ['Take profit at the opposing liquidity pool (Asian session low or sell-side liquidity).'],
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
      matchedPairs: ['EUR/USD', 'AUD/USD'],
      realSampleCase: {
        asset: 'EUR/USD (FX:EURUSD · M15)',
        date: 'London Open Liquidity Playbook',
        entryPrice: '1.16360',
        slPrice: '1.16650 (29 pips)',
        tpPrice: '1.15750 (61 pips)',
        pipsWon: '+61.0 Pips',
        dollarOutcome: '2.10x Return on Risked Equity',
        lessonLearned:
          'Never buy an unconfirmed breakout of equal highs during the first 30 minutes of London Open; wait for sweep rejection.',
      },
    },
    {
      id: 'fvg-retest',
      name: '3. Fair Value Gap (FVG) Imbalance Retest',
      subtitle: 'Institutional Inefficiency Mitigation',
      winRate: '80%',
      rrr: '1:2.8',
      bestSession: 'New York Morning (15:30 - 18:00 EAT)',
      coreConcept:
        'When large institutions buy aggressively, candle 2 expands so rapidly that candle 1 high and candle 3 low never touch. This creates a Fair Value Gap (an unfilled price void). Algorithms pull price back into this void to balance orders before continuing.',
      entryRules: [
        'Confirm a 3-candle sequence where Candle 1 High < Candle 3 Low (Bullish FVG).',
        'Mark the FVG zone with the Rectangle tool.',
        'Wait patiently for price to drift into the gap (0.50 of the box).',
        'Enter when lower-timeframe rejection + 10-Factor score confirm.',
      ],
      invalidationRules: [
        'Stop Loss set just below Candle 1 swing low.',
        'If a candle closes completely through and below the FVG, exit immediately.',
      ],
      takeProfitRules: ['Take Profit at the previous swing high + extended TP2 liquidity.'],
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
      matchedPairs: ['XAU/USD', 'ETH/USD'],
      realSampleCase: {
        asset: 'XAU/USD Gold (OANDA:XAUUSD · M15)',
        date: 'New York Overlap Playbook',
        entryPrice: '$3,898.00',
        slPrice: '$3,887.00 ($11 risk)',
        tpPrice: '$3,934.00 ($36 reward)',
        pipsWon: '+360 Pips ($36 gold move)',
        dollarOutcome: '3.27x Return on Risked Capital',
        lessonLearned:
          'Entering inside the FVG eliminates chasing runaway green candles. You enter at wholesale discount synced directly to TradingView.',
      },
    },
    {
      id: 'london-breakout',
      name: '4. London Open Breakout & Session Trap',
      subtitle: 'The 10:00 EAT Asian Range Sweep',
      winRate: '75%',
      rrr: '1:2.5',
      bestSession: 'Frankfurt / London Open (09:00 - 11:30 EAT)',
      coreConcept:
        'Asian session moves slowly in a tight 20-30 pip horizontal corridor. Between 09:30 and 10:30 EAT, Frankfurt/London market makers intentionally sweep one side of the Asian box to trick early breakout traders, then explode in the true daily trend direction.',
      entryRules: [
        'Box the Asian range (03:00 to 09:45 EAT).',
        'Observe the initial fakeout thrust out of the box.',
        'When the fakeout gets rejected and candles close back inside the box, enter in the opposite direction.',
        'Target the opposing Asian boundary plus 15 pips continuation.',
      ],
      invalidationRules: ['Stop loss 5 pips outside the fakeout high/low.'],
      takeProfitRules: ['Take Profit 1 at Asian Midpoint; Take Profit 2 at opposing Asian extreme.'],
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
        { id: 4, open: 1.3488, high: 1.3506, low: 1.3485, close: 1.34998, label: 'Re-entry Rebound', annotation: 'Buy Signal', annotationType: 'entry' },
        { id: 5, open: 1.34998, high: 1.3538, low: 1.3498, close: 1.3532, label: 'Asian High Break' },
        { id: 6, open: 1.3532, high: 1.3570, low: 1.3528, close: 1.3565, label: 'Expansion Extension', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      matchedPairs: ['GBP/USD', 'EUR/USD'],
      realSampleCase: {
        asset: 'GBP/USD (FX:GBPUSD · M15)',
        date: 'London Open Session Playbook',
        entryPrice: '1.34998',
        slPrice: '1.34680 (31.8 pips)',
        tpPrice: '1.35650 (65.2 pips)',
        pipsWon: '+65.2 Pips',
        dollarOutcome: '2.05x Return on Risked Equity',
        lessonLearned: 'Wait for the Asian box fakeout to fail and reclaim structure before deploying capital.',
      },
    },
    {
      id: 'ema-pullback',
      name: '5. Dynamic EMA 20/50 Pullback (Trend Rider)',
      subtitle: 'Value Zone Trend Continuation',
      winRate: '84%',
      rrr: '1:2.4',
      bestSession: 'Trending Days (Any Active Session)',
      coreConcept:
        'In a sustained trend, the space between the 20 EMA and 50 EMA acts as an institutional trampoline (the "Value Zone"). When price pulls back into this zone on diminishing volume and prints a reversal candlestick with ADX >= 14.5, trend continuation has peak statistical probability.',
      entryRules: [
        'Confirm EMA 20 is sloped clearly above EMA 50 (for Buy) or below (for Sell).',
        'Wait for price to retrace into the dynamic pocket between the two moving averages.',
        'Look for a Pinbar or Engulfing candle touching the 20/50 EMA.',
        'Enter on the open of the following confirmation candle.',
      ],
      invalidationRules: [
        'Stop loss placed beyond the 50 EMA swing structure.',
        'If price closes 2 consecutive candles past the 50 EMA, trend is invalidated.',
      ],
      takeProfitRules: ['Take Profit at the previous swing high + 1.65x / 2.85x extension.'],
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
        { id: 5, open: 157.92, high: 158.22, low: 157.86, close: 157.95, label: 'Hammer Confirmation', annotation: 'Buy Entry', annotationType: 'entry' },
        { id: 6, open: 157.95, high: 158.72, low: 157.92, close: 158.65, label: 'Trend New High', annotation: 'TP Hit', annotationType: 'tp' },
      ],
      matchedPairs: ['USD/JPY', 'EUR/JPY'],
      realSampleCase: {
        asset: 'USD/JPY (FX:USDJPY · M15)',
        date: 'Trend Continuation Playbook',
        entryPrice: '157.950',
        slPrice: '157.650 (30 pips)',
        tpPrice: '158.650 (70 pips)',
        pipsWon: '+70.0 Pips',
        dollarOutcome: '2.33x Return on Risked Equity',
        lessonLearned: 'Trading with the 20/50 EMA stack aligns every order with institutional trend flow.',
      },
    },
  ];

  const currentSetup = setups.find((s) => s.id === selectedSetupId) || setups[0];
  const displayedCandles = currentSetup.candles.slice(0, candleStep);

  // Pull real-time synced example matching this strategy's primary market when live
  const primaryLiveMarket =
    streamState.markets.find((m) => currentSetup.matchedPairs.includes(m.pair)) || streamState.markets[0];

  return (
    <div className="space-y-6">
      {/* Live Best-Fit Strategy Matcher Across Major Markets */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#090F1E] border border-cyan-500/35 space-y-3 font-mono tabular-nums">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-[#00C261]" />
            <span>Real-Time 10-Factor Strategy Radar (Click to Open Chart &amp; Ticket)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Auto-Synced Spot · ADX(14) &amp; MACD · TradingView Symbol Parity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
          {liveStrategyMatches.map((m) => {
            const isBuy = m.bias !== 'STRONG_SELL';
            const tvSym = m.tvSymbol || getTradingViewSymbol(m.pair);
            const isReady = m.executionReadiness === 'READY_ENTER';
            const isWait = m.executionReadiness === 'WAIT_PULLBACK';
            return (
              <div
                key={m.pair}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-[#D4AF37]/50 transition flex flex-col justify-between space-y-2"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-white">{m.pair}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black inline-flex items-center gap-0.5 ${
                        isBuy ? 'bg-[#00C261]/20 text-[#00C261]' : 'bg-red-500/20 text-red-300'
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
                    <span className="text-[9px] text-slate-400">{tvSym}</span>
                  </div>

                  <div className="text-[10px] text-cyan-300 font-bold line-clamp-1">
                    {m.recommendedStrategy || '10-Factor EMA / BOS Trend'}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <span>SL {m.suggestedSL}</span>
                    <span className="text-[#00C261]">TP2 {m.suggestedTP2}</span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] pt-0.5">
                    <span className="text-slate-400">
                      ADX {(m.adxStrength ?? 20).toFixed(0)} · {m.macdBias || 'FLAT'}
                    </span>
                    <span
                      className={`font-bold ${
                        isReady ? 'text-[#00C261]' : isWait ? 'text-[#D4AF37]' : 'text-red-400'
                      }`}
                    >
                      {isReady ? 'READY' : isWait ? 'PULLBACK' : 'HOLD'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => globalLiveStream.requestOpenScannerView('favorable_chart', m.pair)}
                    className="py-1 px-1.5 rounded-lg bg-slate-900 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-slate-700 text-[9px] font-bold flex items-center justify-center gap-1 transition whitespace-nowrap"
                  >
                    <LineChart className="w-2.5 h-2.5" />
                    <span>Ticket</span>
                  </button>
                  <a
                    href={getTradingViewExternalUrl(m.pair, m.recommendedTf)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1 px-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-[9px] font-bold flex items-center justify-center gap-1 transition whitespace-nowrap"
                  >
                    <span>TV</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
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
            <span>Real-Time Forex &amp; Multi-Asset Strategy Vault</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            6 Institutional Setups Engineered For Live Market Precision
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Step through candlestick mechanics candle-by-candle, verify BOS/CHoCH transitions, and deploy directly on synced live quotes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Win Rate: <strong className="text-emerald-400">{currentSetup.winRate}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Target RRR: <strong className="text-[#D4AF37]">{currentSetup.rrr}</strong>
          </span>
        </div>
      </div>

      {/* Interactive 10-Trade & 30-Trade Expectancy & Breakeven Profit Calculator */}
      <ExpectancyProfitSimulatorCard />

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
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{currentSetup.subtitle}</h3>
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
            Institutional Market Mechanics Behind This Setup:
          </strong>
          <p>{currentSetup.coreConcept}</p>
        </div>

        {/* 3-Column Execution Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Live Matched Pair + Reference Execution Record */}
        {primaryLiveMarket && (
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono tabular-nums text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-cyan-300 block">
                Live Real-Time Market Opportunity Matching This Strategy ({primaryLiveMarket.pair})
              </span>
              <div className="flex flex-wrap items-center gap-3 text-white">
                <span>
                  Spot <strong className="text-[#D4AF37]">@ {primaryLiveMarket.price}</strong>
                </span>
                <span>
                  Action{' '}
                  <strong className={primaryLiveMarket.bias !== 'STRONG_SELL' ? 'text-[#00C261]' : 'text-red-400'}>
                    {primaryLiveMarket.bias !== 'STRONG_SELL' ? 'BUY' : 'SELL'}
                  </strong>
                </span>
                <span>SL {primaryLiveMarket.suggestedSL}</span>
                <span className="text-[#00C261]">TP2 {primaryLiveMarket.suggestedTP2}</span>
                <span>R:R {primaryLiveMarket.riskReward}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => globalLiveStream.requestOpenScannerView('favorable_chart', primaryLiveMarket.pair)}
                className="px-3 py-1.5 rounded-xl btn-gold text-black font-bold text-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Deploy In Live Scanner</span>
              </button>
              <a
                href={getTradingViewExternalUrl(primaryLiveMarket.pair, primaryLiveMarket.recommendedTf)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>TradingView</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
            </div>
          </div>
        )}

        {/* Blueprint Reference Case Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0B1020] to-slate-950 border border-[#D4AF37]/30 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-[#D4AF37] text-black font-mono font-bold text-xs">
                {currentSetup.realSampleCase.asset}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C261]" />
                <span>Blueprint Playbook • {currentSetup.realSampleCase.date}</span>
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

const ExpectancyProfitSimulatorCard: React.FC = () => {
  const [winRatePct, setWinRatePct] = useState<number>(62);
  const [riskPerTradeUsd, setRiskPerTradeUsd] = useState<number>(2);
  const [tp2Rr, setTp2Rr] = useState<number>(2.5);
  const [useTp1Breakeven, setUseTp1Breakeven] = useState<boolean>(true);

  const winFrac = winRatePct / 100;
  const lossFrac = 1 - winFrac;
  const effectiveAvgWinR = useTp1Breakeven ? 0.5 * 1.6 + 0.5 * tp2Rr : tp2Rr;
  const expectancyR = Number((winFrac * effectiveAvgWinR - lossFrac * (useTp1Breakeven ? 0.85 : 1.0)).toFixed(2));
  const net10TradesUsd = Number((expectancyR * 10 * riskPerTradeUsd).toFixed(2));
  const net30TradesUsd = Number((expectancyR * 30 * riskPerTradeUsd).toFixed(2));
  const breakevenWinRatePct = Math.round((1 / (1 + effectiveAvgWinR)) * 100);

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/35 p-5 sm:p-6 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
            Will Following Buy / Sell Projections Make a Profit Over 10–30 Trades?
          </span>
          <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
            Interactive 10-Trade Expectancy &amp; TP1 Breakeven Calculator
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-lg text-xs font-black shrink-0 ${
            expectancyR > 0
              ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/50'
              : 'bg-red-500/20 text-red-300 border border-red-500/50'
          }`}
        >
          {expectancyR > 0 ? `+${expectancyR.toFixed(2)}R Profitable Expectancy` : `${expectancyR.toFixed(2)}R Negative Expectancy`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Win Rate (%)</span>
            <strong className="text-white">{winRatePct}%</strong>
          </div>
          <input
            type="range"
            min={35}
            max={80}
            step={1}
            value={winRatePct}
            onChange={(e) => setWinRatePct(Number(e.target.value))}
            className="w-full accent-[#D4AF37]"
          />
          <span className="text-[10px] text-slate-500 block">Min to break even: {breakevenWinRatePct}%</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-slate-400 block">Fixed Risk per Trade</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[2, 5, 10].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setRiskPerTradeUsd(amt)}
                className={`py-1.5 rounded-lg font-bold transition ${
                  riskPerTradeUsd === amt
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 block">Always size lots to cap each loss</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Target TP2 R:R</span>
            <strong className="text-cyan-300">1 : {tp2Rr.toFixed(1)}</strong>
          </div>
          <input
            type="range"
            min={1.8}
            max={3.5}
            step={0.1}
            value={tp2Rr}
            onChange={(e) => setTp2Rr(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
          <span className="text-[10px] text-slate-500 block">Avg Winner = {effectiveAvgWinR.toFixed(2)}R</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 block">TP1 50% + Breakeven Rule</span>
          <button
            type="button"
            onClick={() => setUseTp1Breakeven((v) => !v)}
            className={`py-2 px-3 rounded-lg font-black transition ${
              useTp1Breakeven
                ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/50'
                : 'bg-slate-900 text-slate-400 border border-slate-700'
            }`}
          >
            {useTp1Breakeven ? 'TP1 Breakeven: ON' : 'TP1 Breakeven: OFF'}
          </button>
          <span className="text-[10px] text-slate-500 block">Locks profit early before NY reversals</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Net Result (10 Trades)</span>
          <strong className={`text-lg font-black ${net10TradesUsd >= 0 ? 'text-[#00C261]' : 'text-red-400'}`}>
            {net10TradesUsd >= 0 ? `+$${net10TradesUsd.toFixed(2)}` : `-$${Math.abs(net10TradesUsd).toFixed(2)}`}
          </strong>
          <span className="text-[10px] text-slate-400 block">
            ≈ {net10TradesUsd >= 0 ? '+' : ''}
            {Math.round(net10TradesUsd * 130).toLocaleString()} KES
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Net Result (30 Trades)</span>
          <strong className={`text-lg font-black ${net30TradesUsd >= 0 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
            {net30TradesUsd >= 0 ? `+$${net30TradesUsd.toFixed(2)}` : `-$${Math.abs(net30TradesUsd).toFixed(2)}`}
          </strong>
          <span className="text-[10px] text-slate-400 block">
            ≈ {net30TradesUsd >= 0 ? '+' : ''}
            {Math.round(net30TradesUsd * 130).toLocaleString()} KES
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left flex flex-col justify-center">
          <span className="text-[10px] text-cyan-300 font-bold uppercase">Discipline Rule</span>
          <p className="text-[11px] text-slate-300 font-sans leading-snug mt-0.5">
            Only enter READY_ENTER signals during open sessions with ATR-safe SL and 50% TP1 Breakeven scaling.
          </p>
        </div>
      </div>
    </div>
  );
};
