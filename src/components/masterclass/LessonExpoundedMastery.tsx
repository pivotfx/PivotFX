import React, { useState, useEffect, useMemo } from 'react';
import { PillarLesson, PillarData, CurrencyPair, Timeframe } from '../../types';
import {
  computeRealChartTradeParams,
  INITIAL_MARKETS_DATA,
  globalLiveStream,
  GlobalStreamState,
  positionRiskStore,
  getTradingViewExternalUrl,
} from '../../utils/liveMarketEngine';
import {
  CheckCircle2,
  ShieldCheck,
  Target,
  AlertTriangle,
  Cpu,
  Copy,
  Check,
  HelpCircle,
  ExternalLink,
  BookOpen,
  RefreshCw,
  SlidersHorizontal,
  LineChart,
  GraduationCap,
} from 'lucide-react';

interface LessonExpoundedMasteryProps {
  lesson: PillarLesson;
  pillar: PillarData;
}

interface LessonQuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LessonExpoundedMastery: React.FC<LessonExpoundedMasteryProps> = ({
  lesson,
  pillar,
}) => {
  const [copiedTicket, setCopiedTicket] = useState<boolean>(false);
  const [streamState, setStreamState] = useState<GlobalStreamState>(() => globalLiveStream.getState());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    const unsub = globalLiveStream.subscribe((next) => setStreamState(next));
    return () => unsub();
  }, []);

  // Store student checklist status in localStorage
  const storageKey = `pivotfx_checklist_${pillar.id}_${lesson.id}`;
  const [checkedItems, setCheckedItems] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [checkedItems, storageKey]);

  const toggleCheck = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter((i) => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  // Determine lesson-specific pair, Zero-to-Hero analogy, traps, and 2-question mastery quiz
  const expounded = useMemo(() => {
    const num = lesson.number;
    const titleLower = lesson.title.toLowerCase();
    const conceptLower = lesson.concept.toLowerCase();
    const combined = `${titleLower} ${conceptLower} ${(lesson.realWorldExample?.pair || '').toLowerCase()}`;

    let pair: CurrencyPair = 'EUR/USD';
    let displayPair = lesson.realWorldExample?.pair || 'EUR/USD (Fiber)';
    let timeframe: Timeframe = 'M15';
    let session = 'London Open (10:00 AM EAT)';
    let zeroAnalogy =
      'Think of currency exchange at the airport or bank: when one currency strengthens while the other weakens, every 0.0001 movement is 1 pip of measurable profit or risk.';
    let zeroCoreTakeaway =
      'Match your Stop Loss and Take Profit directly to the current live candle price, never risk more than your fixed % capital guard, and trade in the direction of higher-timeframe flow.';
    let retailTrap =
      'Chasing big green candles after price is already stretched from the 20 EMA, sizing oversized lots without checking pip value, and placing Stop Loss on the wrong side of Bid/Ask.';
    let institutionalEdge =
      'Wait for price to return to the 20/50 EMA value zone or FVG imbalance, size dynamically to cap max loss, and anchor SL behind protected swing structure.';
    let brokerNote = 'FXPesa (CMA Regulated) · Instant M-Pesa · Live Spread Shield';

    if (combined.includes('gold') || combined.includes('xau') || num === '04') {
      pair = 'XAU/USD';
      displayPair = 'XAU/USD (Gold Spot)';
      timeframe = 'M15';
      session = 'New York Overlap (15:30 - 18:00 EAT)';
      zeroAnalogy =
        'Gold moves 3x to 5x faster than EUR/USD. Just like driving fast on a highway, you reduce your position size (lot size) and widen your safety margin (ATR Stop Loss) so normal speed bumps do not knock you out.';
      zeroCoreTakeaway =
        'On Gold, use CMA-regulated brokers with negative balance protection, respect ATR volatility width, and always keep lot size aligned to your fixed USD loss limit.';
      retailTrap =
        'Using tight 5-pip EUR/USD stops on XAU/USD or copying static old price screenshots when spot Gold is actively shifting every second.';
      institutionalEdge =
        'Calculate Gold SL from live 14-period ATR + protected BOS swing levels, sync TradingView OANDA:XAUUSD prices in real time, and scale 50% profit at TP1.';
      brokerNote = 'FXPesa Kenya (CMA Regulated) · OANDA:XAUUSD Feed Parity';
    } else if (combined.includes('btc') || combined.includes('eth') || combined.includes('crypto')) {
      pair = combined.includes('eth') ? 'ETH/USD' : 'BTC/USD';
      displayPair = pair === 'ETH/USD' ? 'ETH/USD (Ethereum)' : 'BTC/USD (Bitcoin)';
      timeframe = 'M15';
      session = '24/7 Active Crypto Order Flow';
      zeroAnalogy =
        'Crypto trades 24 hours a day including weekends. Because spikes happen suddenly around liquidity pools, disciplined traders wait for a Break of Structure (BOS) before committing capital.';
      zeroCoreTakeaway =
        'Sync Binance live OHLC candles cleanly, verify ADX trend displacement (>= 14.5) and MACD impulse, and avoid buying into Bearish BOS breakdowns.';
      retailTrap =
        'FOMO-buying sudden weekend green wicks only to get wicked out inside thin order-book sweeps.';
      institutionalEdge =
        'Verify H1 structure + M15 BOS before entering pullbacks and secure 50% gains at TP1 + Move SL to Breakeven.';
      brokerNote = 'Binance Spot Parity · Zero Weekend Market Closure';
    } else if (
      num === '03' ||
      combined.includes('bos') ||
      combined.includes('choch') ||
      combined.includes('structure') ||
      combined.includes('fvg') ||
      combined.includes('liquidity') ||
      combined.includes('ict')
    ) {
      pair = 'GBP/USD';
      displayPair = 'GBP/USD (Cable)';
      timeframe = 'M15';
      session = 'London Open (10:00 - 12:30 EAT)';
      zeroAnalogy =
        'Market structure works like a staircase: in an Uptrend, price steps up (Higher Highs and Higher Lows). When price breaks a prior step downward (BOS/CHoCH), stop buying and wait to align with the new downward staircase.';
      zeroCoreTakeaway =
        'BOS confirms trend continuation; CHoCH warns of a structural reversal. Always check H1 trend + active BOS before opening any order.';
      retailTrap =
        'Trying to catch a falling knife by placing BUY orders right after a Bearish Break of Structure simply because the price "looks cheap".';
      institutionalEdge =
        'Demand MTF alignment (H1 + M15) plus 10-Factor confirmation, entering pullbacks into Fair Value Gaps or 20 EMA value zones.';
      brokerNote = 'Smart Money Structure · 8-Point Pre-Flight Verified';
    } else if (combined.includes('jpy') || num === '02' || combined.includes('bank') || combined.includes('session')) {
      pair = 'USD/JPY';
      displayPair = 'USD/JPY (Ninja)';
      timeframe = 'M15';
      session = 'Tokyo / London Crossover (09:00 - 11:30 EAT)';
      zeroAnalogy =
        'Commercial banks and institutions need massive liquidity pools (clusters of retail stop-loss orders) to fill huge positions. They often spike past obvious highs/lows first before moving in the real direction.';
      zeroCoreTakeaway =
        'Wait for the liquidity sweep spike to close back inside structure, then ride the institutional expansion with defined risk.';
      retailTrap =
        'Placing Stop Losses right on obvious round numbers or tight double tops where liquidity algorithms deliberately sweep them.';
      institutionalEdge =
        'Park Stop Loss safely outside the sweep extreme + ATR buffer and enter only on confirmed candle displacement.';
      brokerNote = 'Tokyo & London Liquidity Windows (Nairobi EAT Synced)';
    } else if (
      combined.includes('risk') ||
      combined.includes('lot') ||
      combined.includes('margin') ||
      combined.includes('drawdown') ||
      combined.includes('expectancy') ||
      combined.includes('psychology')
    ) {
      pair = 'USD/CAD';
      displayPair = 'USD/CAD (Loonie)';
      timeframe = 'M15';
      session = 'New York Session (15:30 - 18:30 EAT)';
      zeroAnalogy =
        'Position sizing is the seatbelt of trading: even the world’s best driver hits bad weather occasionally. Capping each trade at 1%–2% equity means 5 consecutive losses still leave over 90% of your account intact.';
      zeroCoreTakeaway =
        'Formula: Lot Size = Max USD Risk / (SL Pips × Pip Value). Never adjust Stop Loss wider into a losing trade.';
      retailTrap =
        'Risking 25% of an account on a single "sure" setup or doubling lot sizes after a loss (revenge martingale).';
      institutionalEdge =
        'Lock fixed USD/KES risk per trade via the Dynamic Position Sizer, book 50% at TP1 (+Breakeven SL), and let winners run to TP2.';
      brokerNote = 'Risk-First Prop Desk Protocol · Mandatory SL Cap';
    } else if (num === '05' || num === '06' || combined.includes('tradingview') || combined.includes('mt4') || combined.includes('mt5')) {
      pair = 'EUR/USD';
      displayPair = 'EUR/USD (Fiber)';
      timeframe = 'M15';
      session = 'London / NY Synced Window';
      zeroAnalogy =
        'Your chart platform (TradingView) is your GPS navigation map, and your broker terminal (MT4/MT5) is the steering wheel. Both must point at the exact same live road before you press Buy or Sell.';
      zeroCoreTakeaway =
        'Verify canonical symbol parity (FX:EURUSD / OANDA:XAUUSD / BINANCE:BTCUSDT), check BUY geometry (SL < EP < TP) or SELL geometry (TP < EP < SL), and double-check Bid/Ask spread.';
      retailTrap =
        'Pasting stale levels from an hour-old screenshot, triggering [Invalid S/L or T/P] or entering immediately when spread spikes at rollover (00:00 EAT).';
      institutionalEdge =
        'Click TradingView ↗ right inside PivotFx to inspect live price action side-by-side and copy pre-validated F9 order tickets.';
      brokerNote = 'TradingView + MT4/MT5 Symbol Parity · Hotkey F9 Execution';
    } else {
      pair = 'EUR/USD';
      displayPair = lesson.realWorldExample?.pair || 'EUR/USD (Fiber)';
      timeframe = 'M15';
      session = 'London Session (10:00 AM EAT)';
    }

    const liveMatch =
      streamState.markets.find((m) => m.pair === pair) ||
      INITIAL_MARKETS_DATA.find((m) => m.pair === pair);
    const liveRiskCfg = positionRiskStore.getConfig();
    const computed = computeRealChartTradeParams({
      targetPair: pair,
      targetTf: timeframe,
      targetBroker: 'fxpesa',
      price: liveMatch?.price ?? 1.1636,
      ema20: liveMatch?.ema20,
      ema50: liveMatch?.ema50,
      rsi: liveMatch?.rsi,
      atrPips: liveMatch?.atrPips,
      candles: liveMatch?.candles,
      h1TrendDirection: liveMatch?.h1TrendDirection,
      bosAnalysis: liveMatch?.bosAnalysis,
      riskConfig: liveRiskCfg,
    });

    const quizzes: LessonQuizItem[] = [
      {
        question: `When viewing a live ${pair} chart before opening an order, what is the FIRST rule before choosing BUY or SELL?`,
        options: [
          'Buy immediately whenever the last candle is green.',
          'Verify higher-timeframe (1H) trajectory and ensure there is no opposing Break of Structure (BOS/CHoCH).',
          'Remove the Stop Loss so spreads cannot hit it.',
        ],
        correctIndex: 1,
        explanation:
          'Institutional execution always checks 1H structure and BOS/CHoCH first so you never buy into a bearish reversal or sell into a bullish impulse.',
      },
      {
        question: `On your broker ticket for a ${computed.direction} setup on ${pair} at ${computed.entryPrice}, how must Stop Loss & TP1 be managed?`,
        options: [
          'Place SL past the protected swing + ATR buffer, size lots to cap USD loss, and scale 50% + move SL to Breakeven at TP1.',
          'Use the maximum possible lot size regardless of Stop Loss distance.',
          'Widen the Stop Loss further if price moves against your entry.',
        ],
        correctIndex: 0,
        explanation:
          'Sizing lots to SL distance caps maximum drawdown, while moving SL to Breakeven after TP1 removes downside risk on the runner.',
      },
    ];

    return {
      pair,
      displayPair,
      timeframe,
      session,
      zeroAnalogy,
      zeroCoreTakeaway,
      retailTrap,
      institutionalEdge,
      brokerNote,
      liveMatch,
      computed,
      quizzes,
    };
  }, [lesson, streamState.markets]);

  // Interactive Practice Calculator synced with live market quote unless user edits
  const [practicePrice, setPracticePrice] = useState<number>(expounded.computed.entryPrice);
  const [userEditedPrice, setUserEditedPrice] = useState<boolean>(false);
  const [practiceDir, setPracticeDir] = useState<'BUY' | 'SELL'>(expounded.computed.direction);
  const [practiceTf, setPracticeTf] = useState<Timeframe>(expounded.timeframe);
  const [recalculatedBanner, setRecalculatedBanner] = useState<string | null>(null);

  useEffect(() => {
    setPracticePrice(expounded.computed.entryPrice);
    setUserEditedPrice(false);
    setPracticeDir(expounded.computed.direction);
    setPracticeTf(expounded.timeframe);
    setRecalculatedBanner(null);
    setQuizAnswers({});
  }, [lesson.id]);

  // Keep practicePrice auto-synced with live tick stream unless manually overridden
  useEffect(() => {
    if (!userEditedPrice && expounded.liveMatch?.price) {
      setPracticePrice(expounded.liveMatch.price);
    }
  }, [expounded.liveMatch?.price, userEditedPrice]);

  const practiceComputed = computeRealChartTradeParams({
    targetPair: expounded.pair,
    targetTf: practiceTf,
    targetBroker: 'fxpesa',
    price: practicePrice > 0 ? practicePrice : expounded.computed.entryPrice,
    ema20: expounded.liveMatch?.ema20,
    ema50: expounded.liveMatch?.ema50,
    rsi: expounded.liveMatch?.rsi,
    atrPips: expounded.liveMatch?.atrPips,
    candles: expounded.liveMatch?.candles,
    h1TrendDirection: expounded.liveMatch?.h1TrendDirection,
    bosAnalysis: expounded.liveMatch?.bosAnalysis,
    biasOverride: practiceDir,
    riskConfig: positionRiskStore.getConfig(),
  });

  const handleCopyTicket = () => {
    const ticketText = `[PIVOTFX ZERO-TO-HERO INSTITUTIONAL ORDER TICKET]
Pillar: ${pillar.title} (Lesson ${lesson.number}: ${lesson.title})
Symbol: ${expounded.pair} (${practiceTf} · ${practiceComputed.tvSymbol})
Session: ${expounded.session}
Strategy: ${practiceComputed.recommendedStrategy}
Order Type: ${practiceComputed.orderType}
Entry Price: ${practiceComputed.entryPrice}
Stop Loss: ${practiceComputed.stopLoss} (-${practiceComputed.slPips} pips / $${practiceComputed.actualRiskUsd.toFixed(2)} Max Risk)
Take Profit 1: ${practiceComputed.tp1} (Close 50% & Move SL to Breakeven)
Take Profit 2: ${practiceComputed.tp2} (+${practiceComputed.tpPips} pips Final Target)
Volume: ${practiceComputed.lotSize.toFixed(2)} Lots (Dynamic Risk Guard: $${practiceComputed.actualRiskUsd.toFixed(2)} / ${Math.round(practiceComputed.actualRiskUsd * 130)} KES)
Risk:Reward = ${practiceComputed.riskReward}
Validation: ${practiceComputed.mt4SafetyProof}`;

    navigator.clipboard.writeText(ticketText);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  return (
    <div className="space-y-6 pt-2">
      {/* STEP 1: ZERO-TO-HERO FOUNDATION & CORE MECHANICS */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-[#D4AF37]/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                Step 1 · Zero-to-Hero Plain-English Foundation
              </span>
              <h4 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                Lesson {lesson.number}: {lesson.title}
              </h4>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#00C261]/15 border border-[#00C261]/40 text-[11px] font-mono text-[#00C261] font-bold">
            Live Calibrated Edition
          </span>
        </div>

        {/* Start From Zero Plain Analogy Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-[#0B1222] border border-cyan-500/35 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-cyan-300 block">
              Start From Zero (Simple Mental Picture)
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {expounded.zeroAnalogy}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0B1222] border border-[#D4AF37]/35 space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-[#D4AF37] block">
              Hero Execution Standard (Why Pros Win Here)
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {expounded.zeroCoreTakeaway}
            </p>
          </div>
        </div>

        {/* In-depth Concept Exploration */}
        <div className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
          <p className="font-semibold text-white">{lesson.concept}</p>
          <p className="text-slate-300">{lesson.summary}</p>
        </div>

        {/* Structural Mechanics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {lesson.bulletPoints.map((bp, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#D4AF37]/50 transition-colors space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  {bp.split(':')[0] || `Structural Rule ${idx + 1}`}
                </span>
              </div>
              <p className="text-xs text-slate-300 pl-7 leading-relaxed">
                {bp.includes(':') ? bp.split(':').slice(1).join(':') : bp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 2: LIVE MARKET LAB & REAL-TIME SYNCED ORDER SIMULATOR */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-black px-2.5 py-0.5 rounded-md bg-[#D4AF37]">
                {expounded.displayPair}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">{practiceTf} Chart</span>
              <span className="text-xs font-mono text-slate-400">· {expounded.session}</span>
              {expounded.liveMatch && (
                <span className="text-[11px] font-mono text-[#00C261] font-bold">
                  · Live Spot: {expounded.liveMatch.price}
                </span>
              )}
            </div>
            <h5 className="text-sm font-bold text-white font-mono">
              Step 2 · Live Market Practice Lab &amp; Validated Broker Ticket
            </h5>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => globalLiveStream.requestOpenScannerView('favorable_chart', expounded.pair)}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Open Live Scanner</span>
            </button>

            <a
              href={getTradingViewExternalUrl(expounded.pair, practiceTf)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition whitespace-nowrap"
            >
              <span>TradingView</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            </a>

            <button
              type="button"
              onClick={handleCopyTicket}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
            >
              {copiedTicket ? (
                <Check className="w-3.5 h-3.5 text-[#00C261]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedTicket ? 'Ticket Copied' : 'Copy Ticket'}</span>
            </button>
          </div>
        </div>

        {/* Real-Time Quant Context Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono tabular-nums">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">1H / Active Structure</span>
            <strong className="text-white">
              {practiceComputed.h1TrendDirection} / {practiceComputed.trendDirection}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">BOS / CHoCH Guard</span>
            <strong className="text-cyan-300">
              {(expounded.liveMatch?.bosAnalysis?.bosDirection || 'RANGING').replace(/_/g, ' ')}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">ADX(14) &amp; MACD</span>
            <strong className="text-[#D4AF37]">
              ADX {(practiceComputed.adxStrength ?? 20).toFixed(1)} · {practiceComputed.macdBias}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Readiness Gate</span>
            <strong
              className={
                practiceComputed.executionReadiness === 'READY_ENTER'
                  ? 'text-[#00C261]'
                  : practiceComputed.executionReadiness === 'WAIT_PULLBACK'
                  ? 'text-[#D4AF37]'
                  : 'text-red-400'
              }
            >
              {practiceComputed.executionReadiness}
            </strong>
          </div>
        </div>

        {/* Interactive Chart Candlestick Sync Bar inside Lesson */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-[#D4AF37]/35 space-y-3 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                Test Live Quote ({practiceComputed.tvSymbol} · {practiceComputed.recommendedStrategy})
              </span>
            </span>
            <span className="text-[11px] text-emerald-400 font-bold">
              {practiceComputed.mt4SafetyProof}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Live Candlestick Price ({expounded.pair})
              </label>
              <input
                type="number"
                step="any"
                value={practicePrice}
                onChange={(e) => {
                  setUserEditedPrice(true);
                  setPracticePrice(parseFloat(e.target.value) || 0);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-[#D4AF37] outline-none tabular-nums"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Order Side</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['BUY', 'SELL'] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setPracticeDir(side)}
                    className={`py-2 rounded-xl font-bold text-xs transition ${
                      practiceDir === side
                        ? side === 'BUY'
                          ? 'bg-[#00C261] text-black'
                          : 'bg-red-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Timeframe</label>
              <select
                value={practiceTf}
                onChange={(e) => setPracticeTf(e.target.value as Timeframe)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-[#D4AF37] outline-none"
              >
                <option value="M5">M5 (5m)</option>
                <option value="M10">M10 (10m)</option>
                <option value="M15">M15 (15m)</option>
                <option value="H1">H1 (1h)</option>
                <option value="H4">H4 (4h)</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  const defaultRate =
                    globalLiveStream.getState().markets.find((x) => x.pair === expounded.pair)?.price ||
                    INITIAL_MARKETS_DATA.find((x) => x.pair === expounded.pair)?.price ||
                    expounded.computed.entryPrice;
                  setUserEditedPrice(false);
                  setPracticePrice(defaultRate);
                  setRecalculatedBanner(
                    `Synced ${practiceComputed.orderType} (${practiceComputed.recommendedStrategy}) cleanly to live quote ${defaultRate} (${practiceTf})`
                  );
                  setTimeout(() => setRecalculatedBanner(null), 3000);
                }}
                className="w-full py-2 px-3 rounded-xl btn-gold text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition active:scale-95 whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Live Quote</span>
              </button>
            </div>
          </div>

          {recalculatedBanner && (
            <div className="text-[11px] text-[#00C261] font-bold pt-1">✓ {recalculatedBanner}</div>
          )}
        </div>

        {/* Order Numerical Placement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono tabular-nums">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">1. Order Type</span>
            <span className="text-xs sm:text-sm font-black text-white">{practiceComputed.orderType}</span>
            <span className="text-[10px] text-slate-400 block">Execution Ready</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">2. Entry Price</span>
            <span className="text-xs sm:text-sm font-black text-[#D4AF37]">
              @{practiceComputed.entryPrice}
            </span>
            <span className="text-[10px] text-slate-400 block">Live Candle Sync</span>
          </div>

          <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40">
            <span className="text-[10px] text-red-400 block uppercase font-bold">
              3. Stop Loss (-{practiceComputed.slPips}p)
            </span>
            <span className="text-xs sm:text-sm font-black text-red-300">{practiceComputed.stopLoss}</span>
            <span className="text-[10px] text-red-400 block">
              Risk: ${practiceComputed.actualRiskUsd.toFixed(2)} ({Math.round(practiceComputed.actualRiskUsd * 130)} KES)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
            <span className="text-[10px] text-cyan-400 block uppercase font-bold">
              4. TP1 (50% &amp; BE)
            </span>
            <span className="text-xs sm:text-sm font-black text-cyan-300">{practiceComputed.tp1}</span>
            <span className="text-[10px] text-cyan-400 block">Move SL to Entry</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
            <span className="text-[10px] text-emerald-400 block uppercase font-bold">
              5. Final TP2 (+{practiceComputed.tpPips}p)
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-300">{practiceComputed.tp2}</span>
            <span className="text-[10px] text-emerald-400 block">R:R = {practiceComputed.riskReward}</span>
          </div>
        </div>

        {/* Dynamic Risk Shield Bar */}
        <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono tabular-nums">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-white font-bold">
              Formula Sizing: <span className="text-[#D4AF37]">{practiceComputed.lotSize.toFixed(2)} Lots</span>{' '}
              (Max Loss ${practiceComputed.actualRiskUsd.toFixed(2)} /{' '}
              {Math.round(practiceComputed.actualRiskUsd * 130)} KES)
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-emerald-400 font-bold">CMA Shield:</span>
            <span>Negative Balance Protected</span>
          </div>
        </div>

        {/* Live Candle Backtest & Execution Reasoning */}
        {(practiceComputed.liveBacktest || practiceComputed.executionBrief) && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/35 space-y-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono font-bold text-cyan-300 uppercase">
                Live Candle Edge &amp; Execution Rationale ({expounded.pair} · {practiceTf})
              </span>
              {practiceComputed.liveBacktest && practiceComputed.liveBacktest.sampleTrades > 0 && (
                <span className="font-mono font-bold text-[#00C261] tabular-nums">
                  {practiceComputed.liveBacktest.tp1WinRatePct}% TP1 Rate ·{' '}
                  {practiceComputed.liveBacktest.netExpectancyR >= 0 ? '+' : ''}
                  {practiceComputed.liveBacktest.netExpectancyR.toFixed(2)}R/trade (PF{' '}
                  {practiceComputed.liveBacktest.profitFactor.toFixed(2)})
                </span>
              )}
            </div>
            {practiceComputed.executionBrief && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">Why {practiceComputed.direction}: </strong>
                  {practiceComputed.executionBrief.whyDirection}
                </p>
                <p>
                  <strong className="text-white">SL &amp; TP1 Breakeven: </strong>
                  {practiceComputed.executionBrief.tp1BreakevenPlan}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STEP 3: HERO EXECUTION CASE STUDY, CHECKLIST & RETAIL VS PRO MATRIX */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="text-[#D4AF37] font-mono font-bold text-xs uppercase flex items-center gap-1.5 pb-2 border-b border-slate-800">
          <Target className="w-4 h-4" />
          <span>Step 3 · Practical Case Study Walkthrough</span>
        </div>
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-mono">
          <div>
            <strong className="text-white">Market Context ({lesson.realWorldExample.pair}): </strong>
            <span>{lesson.realWorldExample.context}</span>
          </div>
          <div>
            <strong className="text-white">Trigger &amp; Placement: </strong>
            <span>{lesson.realWorldExample.setup}</span>
          </div>
          <div>
            <strong className="text-white">Outcome: </strong>
            <span className="text-emerald-300 font-bold">{lesson.realWorldExample.outcome}</span>
          </div>
          <div className="pt-1 text-amber-200">
            <strong className="text-[#D4AF37]">Hero Takeaway: </strong>
            <span>{lesson.realWorldExample.keyTakeaway}</span>
          </div>
        </div>
      </div>

      {lesson.actionableChecklist && lesson.actionableChecklist.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C261]" />
              <h5 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                Interactive Execution Checklist
              </h5>
            </div>
            <span className="text-[11px] font-mono text-[#D4AF37] tabular-nums">
              {checkedItems.length} / {lesson.actionableChecklist.length} Verified
            </span>
          </div>

          <div className="space-y-2">
            {lesson.actionableChecklist.map((item, idx) => {
              const isChecked = checkedItems.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCheck(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 font-mono text-xs ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-slate-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <span className={`leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Retail Pitfall vs Institutional Protocol */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/40 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs uppercase border-b border-red-500/20 pb-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Common Retail Mistake</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">{expounded.retailTrap}</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase border-b border-emerald-500/20 pb-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Institutional Hero Standard</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">{expounded.institutionalEdge}</p>
        </div>
      </div>

      {/* STEP 4: QUICK 2-QUESTION MASTERY SELF-TEST */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/35 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-300" />
            <h5 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
              Step 4 · Quick Lesson Mastery Check
            </h5>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 tabular-nums">
            {
              expounded.quizzes.filter((q, idx) => quizAnswers[idx] === q.correctIndex).length
            }{' '}
            / {expounded.quizzes.length} Correct
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expounded.quizzes.map((q, qIdx) => {
            const chosen = quizAnswers[qIdx];
            const isAnswered = chosen !== undefined;
            const isCorrect = chosen === q.correctIndex;
            return (
              <div key={qIdx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <p className="text-xs font-bold text-white leading-relaxed">
                  Q{qIdx + 1}. {q.question}
                </p>
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const selected = chosen === optIdx;
                    const right = optIdx === q.correctIndex;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition ${
                          !isAnswered
                            ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-[#D4AF37]/60'
                            : right
                            ? 'bg-emerald-950/50 border-[#00C261] text-emerald-200 font-semibold'
                            : selected
                            ? 'bg-red-950/50 border-red-500 text-red-200'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {isAnswered && (
                  <p
                    className={`text-[11px] font-mono leading-relaxed ${
                      isCorrect ? 'text-[#00C261]' : 'text-amber-300'
                    }`}
                  >
                    {isCorrect ? 'Correct: ' : 'Note: '}
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pro Toolbelt Shortcuts */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span className="text-slate-300">
            Hotkeys: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">F9</kbd> Ticket,{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">Ctrl+T</kbd> Terminal,{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">Alt+S</kbd> Session Breaks.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">{expounded.brokerNote}</span>
      </div>
    </div>
  );
};
