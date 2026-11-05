import React, { useState, useEffect } from 'react';
import {
  BrokerId,
  CurrencyPair,
  Timeframe,
  AnalysisResult,
  JournalTrade,
  PageTab,
} from '../types';
import { BROKERS, PAIRS_PRESETS, HISTORICAL_GILGIL_CASES } from '../data/forexData';
import { CustomSelect, SelectOption } from '../components/common/CustomSelect';
import {
  SlidersHorizontal,
  Zap,
  RotateCcw,
  BookOpenCheck,
  Scale,
  Lock,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  Sparkles,
  DownloadCloud,
  BrainCircuit,
  RefreshCw,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PillarHeaderBar } from '../components/common/PillarHeaderBar';
import { LiveInteractiveCandleChart } from '../components/tools/LiveInteractiveCandleChart';
import {
  INITIAL_MARKETS_DATA,
  globalLiveStream,
  fetchLiveMarketSnapshot,
  fetchPairLiveCandleSnapshot,
  evaluateCandleSeriesAndTick,
  computeRealChartTradeParams,
  getPairSpecs,
  getCurrentMacroContext,
  ComputedTradeParams,
  MarketScanData,
} from '../utils/liveMarketEngine';

interface SuperAnalysisPageProps {
  onNavigate: (tab: PageTab) => void;
  onLogTrade: (trade: Omit<JournalTrade, 'id' | 'timestamp'>) => void;
  killSwitchUntil: number | null;
  onSetKillSwitch: (hours: number) => void;
  onClearKillSwitch: () => void;
  onAwardXp: (amount: number, reason: string) => void;
}

export const SuperAnalysisPage: React.FC<SuperAnalysisPageProps> = ({
  onNavigate,
  onLogTrade,
  killSwitchUntil,
  onSetKillSwitch,
  onClearKillSwitch,
  onAwardXp,
}) => {
  const [liveMarkets, setLiveMarkets] = useState<MarketScanData[]>(INITIAL_MARKETS_DATA);
  const [syncingFeed, setSyncingFeed] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Calibrated Live');

  const [broker, setBroker] = useState<BrokerId>('fxpesa');
  const [pair, setPair] = useState<CurrencyPair>('GBP/USD');
  const [timeframe, setTimeframe] = useState<Timeframe>('M15');
  const [price, setPrice] = useState<string>('1.35100');
  const [ema20, setEma20] = useState<string>('1.35180');
  const [ema50, setEma50] = useState<string>('1.35320');
  const [rsi, setRsi] = useState<string>('46.2');

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [computedTicket, setComputedTicket] = useState<ComputedTradeParams | null>(null);
  const [loggedToJournal, setLoggedToJournal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [isCustomCandleLocked, setIsCustomCandleLocked] = useState(false);

  const syncLiveRates = async (applyToSelectedPair = false) => {
    setSyncingFeed(true);
    try {
      const [singleSnap, snap] = await Promise.all([
        fetchPairLiveCandleSnapshot(pair, timeframe),
        fetchLiveMarketSnapshot(liveMarkets)
      ]);
      setLiveMarkets(snap.markets);
      setLastSyncedAt(singleSnap.lastCandleTime || snap.syncedAt);
      if (applyToSelectedPair) {
        setIsCustomCandleLocked(false);
        const { decimals } = getPairSpecs(pair);
        setPrice(singleSnap.price.toFixed(decimals));
        setEma20(singleSnap.ema20.toFixed(decimals));
        setEma50(singleSnap.ema50.toFixed(decimals));
        setRsi(singleSnap.rsi.toFixed(1));
      }
    } finally {
      setSyncingFeed(false);
    }
  };

  const lockedRef = React.useRef<boolean>(false);
  const pairRef = React.useRef<CurrencyPair>(pair);
  const tfRef = React.useRef<Timeframe>(timeframe);
  const brokerRef = React.useRef<BrokerId>(broker);

  useEffect(() => {
    lockedRef.current = isCustomCandleLocked;
  }, [isCustomCandleLocked]);
  useEffect(() => {
    pairRef.current = pair;
  }, [pair]);
  useEffect(() => {
    tfRef.current = timeframe;
  }, [timeframe]);
  useEffect(() => {
    brokerRef.current = broker;
  }, [broker]);

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setLiveMarkets(streamState.markets);
      setLastSyncedAt(streamState.syncedAt);

      if (!lockedRef.current) {
        const match =
          streamState.markets.find((m) => m.pair === pairRef.current) || streamState.markets[0];
        if (match) {
          const { decimals } = getPairSpecs(match.pair);
          setPrice(match.price.toFixed(decimals));
          setEma20(match.ema20.toFixed(decimals));
          setEma50(match.ema50.toFixed(decimals));
          setRsi(match.rsi.toFixed(1));

          // Auto-recompute active ticket live on every 1-second tick if an analysis result is open
          const pctMap: Partial<Record<CurrencyPair, number>> = {};
          streamState.markets.forEach((m) => {
            pctMap[m.pair] = m.change24hPct;
          });
          const liveMacro = getCurrentMacroContext(pctMap);

          setComputedTicket((prevTicket) => {
            if (!prevTicket) return prevTicket;
            return computeRealChartTradeParams({
              targetPair: match.pair,
              targetTf: tfRef.current,
              targetBroker: brokerRef.current,
              price: match.price,
              keyLevel: match.keyLevel,
              ema20: match.ema20,
              ema50: match.ema50,
              rsi: match.rsi,
              atrPips: match.atrPips,
              macro: liveMacro
            });
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePairChange = (newPair: CurrencyPair) => {
    setPair(newPair);
    setLoggedToJournal(false);
    setValidationError(null);
    setIsCustomCandleLocked(false);
    const match = liveMarkets.find((m) => m.pair === newPair);
    const { decimals } = getPairSpecs(newPair);
    if (match) {
      setPrice(match.price.toFixed(decimals));
      setEma20(match.ema20.toFixed(decimals));
      setEma50(match.ema50.toFixed(decimals));
      setRsi(match.rsi.toFixed(1));
    } else {
      const base = PAIRS_PRESETS[newPair].defaultPrice;
      setPrice(base.toFixed(decimals));
    }
    fetchPairLiveCandleSnapshot(newPair, timeframe).then((snap) => {
      setPrice(snap.price.toFixed(decimals));
      setEma20(snap.ema20.toFixed(decimals));
      setEma50(snap.ema50.toFixed(decimals));
      setRsi(snap.rsi.toFixed(1));
      setLastSyncedAt(snap.lastCandleTime);
    });
  };

  const handlePriceInputChange = (val: string) => {
    setPrice(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setIsCustomCandleLocked(true);
      const { decimals } = getPairSpecs(pair);
      const liveMatch = liveMarkets.find((m) => m.pair === pair);
      const reEval = evaluateCandleSeriesAndTick({
        pair,
        timeframe,
        livePrice: num,
        baseCandles: liveMatch?.candles,
        change24hPct: liveMatch?.change24hPct
      });
      setEma20(reEval.ema20.toFixed(decimals));
      setEma50(reEval.ema50.toFixed(decimals));
      setRsi(reEval.rsi.toFixed(1));
    }
  };

  // Broker options
  const brokerOptions: SelectOption[] = BROKERS.map((b) => ({
    value: b.id,
    label: b.name,
    sublabel: b.regulation,
    badge: b.cmaLicensed ? 'CMA Licensed (KE)' : 'Offshore',
  }));

  // Pair options using live prices when available
  const pairOptions: SelectOption[] = Object.keys(PAIRS_PRESETS).map((p) => {
    const liveItem = liveMarkets.find((m) => m.pair === p);
    const displayPrice = liveItem ? liveItem.price : PAIRS_PRESETS[p as CurrencyPair].defaultPrice;
    const pctStr = liveItem ? ` (${liveItem.change24hPct >= 0 ? '+' : ''}${liveItem.change24hPct.toFixed(2)}%)` : '';
    return {
      value: p,
      label: p,
      sublabel: `Live approx: ${displayPrice}${pctStr}`,
    };
  });

  // Timeframe options (includes M10)
  const timeframeOptions: SelectOption[] = [
    { value: 'M1', label: '1 Minute (M1)', sublabel: 'Scalping high noise' },
    { value: 'M5', label: '5 Minutes (M5)', sublabel: 'London open entries' },
    { value: 'M10', label: '10 Minutes (M10)', sublabel: 'Precision intraday filter' },
    { value: 'M15', label: '15 Minutes (M15)', sublabel: 'Gilgil Core Standard', badge: 'Recommended' },
    { value: 'H1', label: '1 Hour (H1)', sublabel: 'Session momentum' },
    { value: 'H4', label: '4 Hours (H4)', sublabel: 'Macro trend filter' },
    { value: 'D1', label: 'Daily (D1)', sublabel: 'Institutional bias' },
  ];

  // Quick Preset Importers anchored to live rates & custom Futures quotes
  const handleLoadPreset = (type: 'gbp_win' | 'gbp_trap' | 'eur_live' | 'gold_futures') => {
    setLoggedToJournal(false);
    setValidationError(null);
    if (type === 'gbp_win') {
      const gbpLive = liveMarkets.find((m) => m.pair === 'GBP/USD')?.price || 1.34998;
      setBroker('fxpesa');
      setPair('GBP/USD');
      setTimeframe('M15');
      setPrice(gbpLive.toFixed(5));
      setEma20((gbpLive + 0.00080).toFixed(5));
      setEma50((gbpLive + 0.00220).toFixed(5));
      setRsi('46.2');
    } else if (type === 'gbp_trap') {
      const gbpLive = liveMarkets.find((m) => m.pair === 'GBP/USD')?.price || 1.34998;
      setBroker('hfm');
      setPair('GBP/USD');
      setTimeframe('M15');
      setPrice((gbpLive + 0.00450).toFixed(5));
      setEma20((gbpLive + 0.00030).toFixed(5));
      setEma50((gbpLive - 0.00230).toFixed(5));
      setRsi('83.4');
    } else if (type === 'eur_live') {
      const eurLive = liveMarkets.find((m) => m.pair === 'EUR/USD')?.price || 1.12670;
      setBroker('fxpesa');
      setPair('EUR/USD');
      setTimeframe('M15');
      setPrice(eurLive.toFixed(5));
      setEma20((eurLive - 0.00075).toFixed(5));
      setEma50((eurLive - 0.00210).toFixed(5));
      setRsi('54.0');
    } else if (type === 'gold_futures') {
      setBroker('fxpesa');
      setPair('XAU/USD');
      setTimeframe('M15');
      setPrice('4041.495');
      setEma20('4034.20');
      setEma50('4021.80');
      setRsi('58.5');
    }
  };

  const handleClear = () => {
    setPrice('');
    setEma20('');
    setEma50('');
    setRsi('');
    setResult(null);
    setComputedTicket(null);
    setLoggedToJournal(false);
    setValidationError(null);
  };

  const handleAnalyze = async () => {
    const { pipMultiplier, decimals } = getPairSpecs(pair);
    let numPrice = parseFloat(price);
    let numEma20 = parseFloat(ema20);
    let numEma50 = parseFloat(ema50);
    let numRsi = parseFloat(rsi);

    if (!isCustomCandleLocked) {
      setSyncingFeed(true);
      try {
        const [snap] = await Promise.all([
          fetchPairLiveCandleSnapshot(pair, timeframe),
          globalLiveStream.triggerScan('deep_ai')
        ]);
        numPrice = snap.price;
        numEma20 = snap.ema20;
        numEma50 = snap.ema50;
        numRsi = snap.rsi;
        setPrice(snap.price.toFixed(decimals));
        setEma20(snap.ema20.toFixed(decimals));
        setEma50(snap.ema50.toFixed(decimals));
        setRsi(snap.rsi.toFixed(1));
        setLastSyncedAt(snap.lastCandleTime);
      } finally {
        setSyncingFeed(false);
      }
    }

    if (isNaN(numPrice) || numPrice <= 0 || isNaN(numEma20) || isNaN(numEma50) || isNaN(numRsi)) {
      setValidationError('Enter valid positive chart numbers for Candlestick Price, EMA 20, EMA 50, and RSI.');
      return;
    }

    setValidationError(null);
    setLoggedToJournal(false);
    const distanceEma20Pips = Math.abs(numPrice - numEma20) * pipMultiplier;
    const isEmaBullish = numEma20 > numEma50;
    const isEmaBearish = numEma20 < numEma50;
    const overextendedThresholdPips = pair.includes('XAU') ? 220 : pair.includes('BTC') ? 1400 : 28;
    const isOverextended = distanceEma20Pips > overextendedThresholdPips;

    let score = 50;
    let verdict: AnalysisResult['verdict'] = 'WAIT_CHOP';
    let title = 'Neutral Zone — Low Edge Setup';
    let recommendation = 'Wait for clear market reaction at 20 EMA.';
    let biasOverride: 'BUY' | 'SELL' | undefined = undefined;
    const reasons: string[] = [];

    if (numRsi >= 75 && isOverextended) {
      score = 22;
      verdict = 'RISKY_EXTENDED';
      title = 'DANGER: Parabolic Tower Top Overextension';
      recommendation = 'DO NOT BUY! Extreme FOMO territory. Wait for candle close below 20 EMA before shorting.';
      biasOverride = 'SELL';
      reasons.push(`Price (${numPrice.toFixed(decimals)}) is overextended by ${distanceEma20Pips.toFixed(1)} pips above EMA 20 (${numEma20.toFixed(decimals)}).`);
      reasons.push(`RSI is at ${numRsi.toFixed(1)} (Severe Overbought). High risk of liquidity hunt reversal.`);
      reasons.push('Direct correlation with the Gilgil 1.35450 Tower Top trap where chasing caused heavy drawdown.');
    } else if (numRsi <= 25 && isOverextended) {
      score = 28;
      verdict = 'RISKY_EXTENDED';
      title = 'DANGER: Parabolic Dump Exhaustion';
      recommendation = 'DO NOT SELL into the hole! Wait for candle reclaim above 20 EMA before buying.';
      biasOverride = 'BUY';
      reasons.push(`RSI is pinned down at ${numRsi.toFixed(1)} (${distanceEma20Pips.toFixed(1)} pips below EMA 20).`);
      reasons.push('Price extended far below dynamic moving averages — high snapback risk.');
    } else if (isEmaBearish && numPrice <= numEma20 && numRsi >= 38 && numRsi <= 56) {
      score = 92;
      verdict = 'HIGH_PROBABILITY_SELL';
      title = 'HIGH PROBABILITY SHORT: Gilgil Tower Exhaustion Breakdown';
      recommendation = `Prime SELL setup anchored to live price ${numPrice.toFixed(decimals)}. Use the exact MT4 S/L & T/P below.`;
      biasOverride = 'SELL';
      reasons.push(`EMA 20 (${numEma20.toFixed(decimals)}) is sloped downward below EMA 50 (${numEma50.toFixed(decimals)}).`);
      reasons.push(`Price (${numPrice.toFixed(decimals)}) closed below the 20 EMA after retesting.`);
      reasons.push(`RSI at ${numRsi.toFixed(1)} has reset from overbought with healthy bearish momentum.`);
    } else if (isEmaBullish && numPrice >= numEma20 && numRsi >= 46 && numRsi <= 65) {
      score = 90;
      verdict = 'HIGH_PROBABILITY_BUY';
      title = 'HIGH PROBABILITY LONG: Dynamic 20/50 EMA Pullback Bounce';
      recommendation = `Prime BUY setup anchored to live price ${numPrice.toFixed(decimals)}. Use the exact MT4 S/L & T/P below.`;
      biasOverride = 'BUY';
      reasons.push(`EMA 20 (${numEma20.toFixed(decimals)}) is cleanly stacked above EMA 50 (${numEma50.toFixed(decimals)}).`);
      reasons.push(`Price (${numPrice.toFixed(decimals)}) respected the 20/50 Value Zone without overextending.`);
      reasons.push(`RSI at ${numRsi.toFixed(1)} confirms clean institutional continuation momentum.`);
    } else {
      score = 62;
      const trendUp = numPrice >= numEma20;
      verdict = trendUp ? 'HIGH_PROBABILITY_BUY' : 'HIGH_PROBABILITY_SELL';
      biasOverride = trendUp ? 'BUY' : 'SELL';
      title = trendUp ? 'MODERATE BULLISH CONTINUATION: Tight Value Zone' : 'MODERATE BEARISH PULLBACK: Dynamic Resistance';
      recommendation = `Chart price ${numPrice.toFixed(decimals)} is near dynamic structure; risk strictly 0.01 lot ($2.00 max).`;
      reasons.push(`Distance to 20 EMA is ${distanceEma20Pips.toFixed(1)} pips on ${timeframe}.`);
      reasons.push(`RSI at ${numRsi.toFixed(1)} indicates measured intraday order flow.`);
    }

    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    liveMarkets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    const currentMacro = getCurrentMacroContext(pctMap);

    const ticket = computeRealChartTradeParams({
      targetPair: pair,
      targetTf: timeframe,
      targetBroker: broker,
      price: numPrice,
      ema20: numEma20,
      ema50: numEma50,
      rsi: numRsi,
      macro: currentMacro,
      biasOverride,
    });
    setComputedTicket(ticket);

    const isWinMatch = score >= 80;
    const historicalRef = isWinMatch
      ? {
          title: 'Validated Disciplined Setup (MT4 S/L & T/P Side Verified)',
          description: HISTORICAL_GILGIL_CASES.towerWin.description,
          caseType: 'validated_win' as const,
        }
      : {
          title: 'Overextension Caution (Gilgil 1.35450 Trap Warning)',
          description: HISTORICAL_GILGIL_CASES.towerLoss.description,
          caseType: 'warning_loss' as const,
        };

    const aiSynthesis = {
      sentimentSummary:
        ticket.direction === 'SELL'
          ? `Bearish institutional order flow detected around ${numPrice.toFixed(decimals)} on ${timeframe}. Stop Loss (${ticket.stopLoss.toFixed(decimals)}) sits cleanly ABOVE Entry so MT4 executes with zero rejection.`
          : `Bullish institutional accumulation detected around ${numPrice.toFixed(decimals)} on ${timeframe}. Stop Loss (${ticket.stopLoss.toFixed(decimals)}) sits cleanly BELOW Entry so MT4 executes with zero rejection.`,
      keyRiskFactor:
        verdict === 'RISKY_EXTENDED'
          ? 'Candle is stretched far from 20 EMA — wait for a minor pullback or keep strict 0.01 micro lot.'
          : `Broker spread (~${ticket.brokerSpread} pips on ${ticket.brokerSymbol}) and strict $2.00 (260 KES) capital shield.`,
      institutionalFootprint: ticket.trajectory,
      tradePlanSteps: [
        `1. Order Type: ${ticket.orderType} on ${ticket.brokerSymbol} (${timeframe})`,
        `2. Entry & Volume: ${ticket.entryPrice.toFixed(decimals)} @ 0.01 micro lot ($${ticket.actualRiskUsd.toFixed(2)} risk)`,
        `3. Stop Loss (Invalidation): ${ticket.stopLoss.toFixed(decimals)} (${ticket.slPips} pips)`,
        `4. TP1 / Final Target: ${ticket.tp1.toFixed(decimals)} / ${ticket.tp2.toFixed(decimals)} (${ticket.riskReward})`,
      ],
    };

    const analysisObj: AnalysisResult = {
      score,
      verdict,
      title,
      recommendation,
      suggestedStake: ticket.actualRiskUsd,
      suggestedLotSize: 0.01,
      stopLossPips: ticket.slPips,
      takeProfitPips: ticket.tpPips,
      riskReward: ticket.riskReward,
      reasons,
      aiSynthesis,
      historicalReference: historicalRef,
    };

    setResult(analysisObj);
    onAwardXp(30, 'Analyzed MT4/MT5 Chart Setup');

    if (score >= 80) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00C261', '#38BDF8'],
      });
    }
  };

  const handleCopyTicket = () => {
    if (!computedTicket) return;
    const dec = computedTicket.decimals;
    const summary = `${pair} (${timeframe}) • ${computedTicket.orderType}\nEntry: ${computedTicket.entryPrice.toFixed(dec)}\nStop Loss: ${computedTicket.stopLoss.toFixed(dec)}\nTP1: ${computedTicket.tp1.toFixed(dec)}\nFinal Target: ${computedTicket.tp2.toFixed(dec)}\nLot Size: 0.01 ($${computedTicket.actualRiskUsd.toFixed(2)} Risk)`;
    navigator.clipboard?.writeText(summary);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const handleLogToJournal = () => {
    if (!result || !computedTicket) return;

    onLogTrade({
      pair,
      broker,
      type: computedTicket.direction,
      entryPrice: computedTicket.entryPrice,
      score: result.score,
      mode: result.title,
      riskUsd: computedTicket.actualRiskUsd,
      status: 'OPEN',
      notes: `${computedTicket.orderType} @ ${computedTicket.entryPrice.toFixed(computedTicket.decimals)} | SL: ${computedTicket.stopLoss.toFixed(computedTicket.decimals)} | TP2: ${computedTicket.tp2.toFixed(computedTicket.decimals)} | Score ${result.score}/100 (${timeframe}).`,
    });

    setLoggedToJournal(true);
    onAwardXp(20, 'Logged Trade to Journal');
  };

  const isLocked = killSwitchUntil && killSwitchUntil > Date.now();
  const minutesLeft = isLocked ? Math.ceil((killSwitchUntil - Date.now()) / 60000) : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Pillar Navigation Header Bar */}
      <PillarHeaderBar currentTab="super-analysis" onNavigate={onNavigate} />

      {/* Page Title & Mission */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" />
            <span>Pillar 2 • Live Chart & MT4/MT5 Super Analysis Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            MT4 & MT5 Super Analysis Tool
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-mono">
            Auto-syncing live quotes every second 24/7 (<strong className="text-[#00C261]">{lastSyncedAt}</strong>). Live candle changes automatically update EMAs, RSI, Entry, Stop Loss, and Take Profit.
          </p>
        </div>

        {/* 1-Hour Revenge Trading Kill Switch Card */}
        <div className="w-full md:w-auto">
          {isLocked ? (
            <div className="p-3 rounded-2xl bg-red-950/90 border border-red-500/50 flex items-center justify-between gap-3 text-red-200">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold block text-white">REVENGE TRADING KILL SWITCH ACTIVE</span>
                  <span className="text-[11px] text-red-300 font-mono">
                    Cooling down: {minutesLeft} minutes remaining
                  </span>
                </div>
              </div>
              <button
                onClick={onClearKillSwitch}
                className="text-[10px] font-mono underline text-red-300 hover:text-white px-2 py-1"
                title="Emergency Unlock (Only if you are calm)"
              >
                Unlock
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSetKillSwitch(1)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
              title="Lock out for 1 hour to prevent revenge trading"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Engage 1-Hour Kill Switch (Anti-Revenge)</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Quick-Load Ribbon */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#111827] border border-slate-800 text-xs">
        <span className="text-slate-400 font-mono flex items-center gap-1.5 px-2">
          <DownloadCloud className="w-3.5 h-3.5 text-[#00C261]" /> Quick Chart Calibrations:
        </span>
        <button
          onClick={() => handleLoadPreset('gbp_win')}
          className="px-3 py-1.5 rounded-lg bg-[#00C261]/15 text-[#00C261] border border-[#00C261]/30 hover:bg-[#00C261]/25 font-semibold transition"
        >
          GBP/USD Live Reversal (1.3510)
        </button>
        <button
          onClick={() => handleLoadPreset('gbp_trap')}
          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 font-semibold transition"
        >
          GBP/USD Overextended Trap (1.3545)
        </button>
        <button
          onClick={() => handleLoadPreset('eur_live')}
          className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 font-semibold transition"
        >
          EUR/USD Live EMA Pullback (1.1267)
        </button>
        <button
          onClick={() => handleLoadPreset('gold_futures')}
          className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 font-semibold transition"
        >
          XAU/USD Gold Chart (4041.495)
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 ml-auto flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Clear
        </button>
      </div>

      {/* Interactive Live Candlestick Chart for Selected Pair */}
      {(() => {
        const activeMarketItem =
          liveMarkets.find((m) => m.pair === pair) || INITIAL_MARKETS_DATA[0];
        const parsedLiveP = parseFloat(price) || activeMarketItem.price;
        const parsedE20 = parseFloat(ema20) || activeMarketItem.ema20;
        const parsedE50 = parseFloat(ema50) || activeMarketItem.ema50;
        const parsedRsi = parseFloat(rsi) || activeMarketItem.rsi;
        const previewTicket =
          computedTicket ||
          computeRealChartTradeParams({
            targetPair: pair,
            targetTf: timeframe,
            targetBroker: broker,
            price: parsedLiveP,
            keyLevel: activeMarketItem.keyLevel,
            ema20: parsedE20,
            ema50: parsedE50,
            rsi: parsedRsi,
            atrPips: activeMarketItem.atrPips,
          });

        return (
          <LiveInteractiveCandleChart
            pair={pair}
            timeframe={timeframe}
            candles={activeMarketItem.candles || []}
            livePrice={parsedLiveP}
            ema20={parsedE20}
            ema50={parsedE50}
            entryPrice={previewTicket.entryPrice}
            stopLoss={previewTicket.stopLoss}
            tp1={previewTicket.tp1}
            tp2={previewTicket.tp2}
            direction={previewTicket.direction}
            change24hPct={activeMarketItem.change24hPct}
            isLockedToCustom={isCustomCandleLocked}
            onCandlePriceChange={(newP) => {
              const { decimals } = getPairSpecs(pair);
              handlePriceInputChange(newP.toFixed(decimals));
              globalLiveStream.setCustomCandlePrice(pair, newP, timeframe);
            }}
            onResetToLiveStream={() => {
              setIsCustomCandleLocked(false);
              globalLiveStream.unlockPairToLiveStream(pair);
              syncLiveRates(true);
            }}
          />
        );
      })()}

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Inputs (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C261]" />
                MT4 / MT5 Chart Parameters
              </h3>
              <button
                onClick={() => syncLiveRates(true)}
                disabled={syncingFeed}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`w-3 h-3 ${syncingFeed ? 'animate-spin' : ''}`} />
                Sync Live Quote
              </button>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Broker Selector */}
            <CustomSelect
              label="1. Selected Broker (Spreads & Execution Profile)"
              options={brokerOptions}
              value={broker}
              onChange={(val) => setBroker(val as BrokerId)}
            />

            {/* Currency Pair & Timeframe (2-Col) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect
                label="2. Currency Pair"
                options={pairOptions}
                value={pair}
                onChange={(val) => handlePairChange(val as CurrencyPair)}
              />
              <CustomSelect
                label="3. Chart Timeframe"
                options={timeframeOptions}
                value={timeframe}
                onChange={(val) => setTimeframe(val as Timeframe)}
              />
            </div>

            {/* Numeric Inputs: Price, EMA 20, EMA 50, RSI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Current Candlestick Price</span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Live: {PAIRS_PRESETS[pair].defaultPrice}
                  </span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={price}
                  onChange={(e) => handlePriceInputChange(e.target.value)}
                  placeholder="Enter live chart candle price"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono text-sm focus:border-[#00C261] focus:ring-1 focus:ring-[#00C261] outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>RSI (14 Period) Value</span>
                  <span className="text-[10px] text-amber-400 font-mono">0 – 100</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={rsi}
                  onChange={(e) => setRsi(e.target.value)}
                  placeholder="e.g. 52.0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono text-sm focus:border-[#00C261] focus:ring-1 focus:ring-[#00C261] outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> EMA 20 (Cyan)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Fast MA</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={ema20}
                  onChange={(e) => setEma20(e.target.value)}
                  placeholder="Enter 20 EMA value"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> EMA 50 (Orange)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Slow MA</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={ema50}
                  onChange={(e) => setEma50(e.target.value)}
                  placeholder="Enter 50 EMA value"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition"
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!!isLocked}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider transition shadow-lg shadow-[#00C261]/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-black" />
                {result ? 'Reanalyse Chart Setup' : 'Analyse Chart Now (Exact S/L & T/P)'}
              </button>

              <button
                onClick={() => onNavigate('brokers')}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Scale className="w-4 h-4 text-[#00C261]" />
                Compare Spreads Live
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Intelligence Output & Score Meter (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result && computedTicket ? (
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 animate-in zoom-in-95 duration-200">
              {/* Header: Score + Verdict */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-black border-2 ${
                      result.score >= 80
                        ? 'bg-[#00C261]/20 border-[#00C261] text-[#00C261] shadow-[0_0_20px_rgba(0,194,97,0.3)]'
                        : result.score >= 50
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-red-500/20 border-red-500 text-red-400'
                    }`}
                  >
                    <span className="text-2xl leading-none">{result.score}</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-80">/ 100</span>
                  </div>

                  <div>
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        computedTicket.direction === 'BUY'
                          ? 'bg-[#00C261]/20 text-[#00C261]'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {computedTicket.orderType} • {pair} ({timeframe})
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">{result.title}</h4>
                  </div>
                </div>
              </div>

              {/* Exact MT4/MT5 S/L & T/P Order Ticket Anchored to Chart Price */}
              <div className="p-4 rounded-2xl bg-[#070B12] border border-[#00C261]/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-[#00C261] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Exact MT4 / MT5 Parameter Ticket ({computedTicket.brokerSymbol})
                  </span>
                  <button
                    onClick={handleCopyTicket}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 transition"
                  >
                    {copiedTicket ? <Check className="w-3 h-3 text-[#00C261]" /> : <Copy className="w-3 h-3" />}
                    {copiedTicket ? 'Copied' : 'Copy Ticket'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Entry Price</span>
                    <strong className="text-sm sm:text-base font-mono text-white font-black">
                      {computedTicket.entryPrice.toFixed(computedTicket.decimals)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30">
                    <span className="text-[10px] text-red-300 block font-mono">Stop Loss ({computedTicket.slPips}p)</span>
                    <strong className="text-sm sm:text-base font-mono text-red-400 font-black">
                      {computedTicket.stopLoss.toFixed(computedTicket.decimals)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-[#00C261]/30">
                    <span className="text-[10px] text-emerald-300 block font-mono">TP1 (50%)</span>
                    <strong className="text-sm sm:text-base font-mono text-[#00C261] font-black">
                      {computedTicket.tp1.toFixed(computedTicket.decimals)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <span className="text-[10px] text-cyan-300 block font-mono">Final Target ({computedTicket.tpPips}p)</span>
                    <strong className="text-sm sm:text-base font-mono text-cyan-300 font-black">
                      {computedTicket.tp2.toFixed(computedTicket.decimals)}
                    </strong>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                  {computedTicket.mt4SafetyProof}
                </div>
              </div>

              {/* 5-Factor Institutional BUY / SELL Judgment Scorecard */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-[#D4AF37]/35 space-y-2.5 text-xs font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>All-Factor AI BUY/SELL Judgment ({computedTicket.orderType})</span>
                  </span>
                  <span className="font-black">
                    <span className="text-[#00C261]">BULL {computedTicket.bullScorePct}%</span>
                    <span className="text-slate-600 mx-1.5">vs</span>
                    <span className="text-red-400">BEAR {computedTicket.bearScorePct}%</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {computedTicket.factorVerdicts.map((fv) => (
                    <div
                      key={fv.name}
                      className={`p-2.5 rounded-xl border space-y-1 ${
                        fv.signal === 'BUY'
                          ? 'bg-emerald-950/25 border-emerald-500/35'
                          : fv.signal === 'SELL'
                          ? 'bg-red-950/25 border-red-500/35'
                          : 'bg-amber-950/25 border-amber-500/35'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-300 truncate">{fv.name}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                            fv.signal === 'BUY'
                              ? 'bg-[#00C261]/25 text-[#00C261]'
                              : fv.signal === 'SELL'
                              ? 'bg-red-500/25 text-red-300'
                              : 'bg-amber-500/25 text-amber-300'
                          }`}
                        >
                          {fv.signal}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug">{fv.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* $2 Rule Money Management Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0e1726] to-[#0a121e] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#00C261] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Gilgil $2 Rule Execution Sizing
                  </span>
                  <span className="text-slate-400">Fixed 0.01 Micro Risk</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Max Monetary Risk</span>
                    <strong className="text-base font-mono text-[#00C261] font-bold">
                      ${computedTicket.actualRiskUsd.toFixed(2)} ({Math.round(computedTicket.actualRiskUsd * 130)} KES)
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Micro Lot Size</span>
                    <strong className="text-base font-mono text-white font-bold">0.01</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Projected Gain</span>
                    <strong className="text-base font-mono text-cyan-400 font-bold">
                      +${computedTicket.potentialGainUsd.toFixed(2)} ({computedTicket.riskReward})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Technical Reasoning Checklist */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Technical Checklist
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00C261] shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Historical Gilgil Lore Reference */}
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  result.historicalReference.caseType === 'validated_win'
                    ? 'bg-emerald-950/30 border-[#00C261]/30 text-emerald-200'
                    : 'bg-red-950/30 border-red-500/30 text-red-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  {result.historicalReference.caseType === 'validated_win' ? (
                    <TrendingUp className="w-4 h-4 text-[#00C261]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span>{result.historicalReference.title}</span>
                </div>
                <p className="leading-relaxed opacity-90">
                  {result.historicalReference.description}
                </p>
              </div>

              {/* Advanced AI Synthesis & Execution Plan */}
              {result.aiSynthesis && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#070b14] border border-cyan-500/30 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
                      <BrainCircuit className="w-3.5 h-3.5" /> Institutional AI Synthesis ({computedTicket.confidence}% Confidence)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[10px]">
                      Spread ~{computedTicket.brokerSpread}p
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <p className="leading-relaxed">
                      <strong className="text-white">Order Side Proof:</strong> {result.aiSynthesis.sentimentSummary}
                    </p>
                    <p className="leading-relaxed text-slate-400">
                      <strong className="text-cyan-300">Trajectory:</strong> {result.aiSynthesis.institutionalFootprint}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      Executable Trade Plan:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
                      {result.aiSynthesis.tradePlanSteps.map((step, i) => (
                        <div key={i} className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Log to Journal & Reanalyse Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleAnalyze}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#00C261]" />
                  Reanalyse
                </button>
                <button
                  onClick={handleLogToJournal}
                  disabled={loggedToJournal}
                  className={`w-full sm:flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                    loggedToJournal
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                      : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  <BookOpenCheck className="w-4 h-4" />
                  {loggedToJournal ? 'Logged in Journal ✓' : 'Log Setup to Journal Automatically'}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
                <SlidersHorizontal className="w-10 h-10" />
              </div>
              <div className="max-w-sm space-y-1.5">
                <h4 className="text-base font-bold text-white">Ready to Analyse Live Chart Data</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verify your current candlestick price ({pair} on {timeframe}) on the left and click "Analyse Chart Now" to get exact MT4-safe Entry, Stop Loss, and Take Profit levels.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00C261]">
                <Clock className="w-3.5 h-3.5" />
                <span>Instant MT4/MT5 S/L & T/P validation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
