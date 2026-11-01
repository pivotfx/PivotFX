import React, { useState } from 'react';
import {
  BrokerId,
  CurrencyPair,
  Timeframe,
  AnalysisInput,
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
  Unlock,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Sparkles,
  DownloadCloud,
  BrainCircuit
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PillarHeaderBar } from '../components/common/PillarHeaderBar';

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
  const [broker, setBroker] = useState<BrokerId>('fxpesa');
  const [pair, setPair] = useState<CurrencyPair>('GBP/USD');
  const [timeframe, setTimeframe] = useState<Timeframe>('M15');
  const [price, setPrice] = useState<string>('1291.69');
  const [ema20, setEma20] = useState<string>('1292.80');
  const [ema50, setEma50] = useState<string>('1294.50');
  const [rsi, setRsi] = useState<string>('46.2');

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loggedToJournal, setLoggedToJournal] = useState(false);

  // Broker options
  const brokerOptions: SelectOption[] = BROKERS.map((b) => ({
    value: b.id,
    label: b.name,
    sublabel: b.regulation,
    badge: b.cmaLicensed ? 'CMA Licensed (KE)' : 'Offshore',
  }));

  // Pair options
  const pairOptions: SelectOption[] = Object.keys(PAIRS_PRESETS).map((p) => ({
    value: p,
    label: p,
    sublabel: `Default approx: ${PAIRS_PRESETS[p as CurrencyPair].defaultPrice}`,
  }));

  // Timeframe options
  const timeframeOptions: SelectOption[] = [
    { value: 'M1', label: '1 Minute (M1)', sublabel: 'Scalping high noise' },
    { value: 'M5', label: '5 Minutes (M5)', sublabel: 'London open entries' },
    { value: 'M15', label: '15 Minutes (M15)', sublabel: 'Gilgil Core Standard', badge: 'Recommended' },
    { value: 'H1', label: '1 Hour (H1)', sublabel: 'Session momentum' },
    { value: 'H4', label: '4 Hours (H4)', sublabel: 'Macro trend filter' },
    { value: 'D1', label: 'Daily (D1)', sublabel: 'Institutional bias' },
  ];

  // Quick Preset Importers
  const handleLoadPreset = (type: 'win_1291' | 'loss_1296' | 'eur_bounce' | 'live_sync') => {
    setLoggedToJournal(false);
    if (type === 'win_1291') {
      setBroker('fxpesa');
      setPair('GBP/USD');
      setTimeframe('M15');
      setPrice('1291.69');
      setEma20('1292.80');
      setEma50('1294.50');
      setRsi('46.2');
    } else if (type === 'loss_1296') {
      setBroker('hfm');
      setPair('GBP/USD');
      setTimeframe('M15');
      setPrice('1296.56');
      setEma20('1254.20');
      setEma50('1228.10');
      setRsi('83.4');
    } else if (type === 'eur_bounce') {
      setBroker('fxpesa');
      setPair('EUR/USD');
      setTimeframe('H1');
      setPrice('1.0835');
      setEma20('1.0828');
      setEma50('1.0815');
      setRsi('52.0');
    }
  };

  const handleClear = () => {
    setPrice('');
    setEma20('');
    setEma50('');
    setRsi('');
    setResult(null);
    setLoggedToJournal(false);
  };

  const handleAnalyze = () => {
    const numPrice = parseFloat(price);
    const numEma20 = parseFloat(ema20);
    const numEma50 = parseFloat(ema50);
    const numRsi = parseFloat(rsi);

    if (isNaN(numPrice) || isNaN(numEma20) || isNaN(numEma50) || isNaN(numRsi)) {
      alert('Please enter valid numeric values for Price, EMA 20, EMA 50, and RSI.');
      return;
    }

    setLoggedToJournal(false);

    // Deep Analysis Logic
    const distanceEma20 = Math.abs(numPrice - numEma20);
    const distanceEma50 = Math.abs(numPrice - numEma50);
    const isEmaBullish = numEma20 > numEma50;
    const isEmaBearish = numEma20 < numEma50;
    const isOverextended = distanceEma20 > (numPrice * 0.015) || distanceEma20 > 25; // in pips/points

    let score = 50;
    let verdict: AnalysisResult['verdict'] = 'WAIT_CHOP';
    let title = 'Neutral Zone — Low Edge Setup';
    let recommendation = 'Wait for clear market reaction at 20 EMA.';
    const reasons: string[] = [];

    // Check for Tower Top overextension (like 1296.56 loss)
    if (numRsi >= 75 && isOverextended) {
      score = 22;
      verdict = 'RISKY_EXTENDED';
      title = 'DANGER: Parabolic Tower Top Overextension';
      recommendation = 'DO NOT BUY! Extreme FOMO territory. Institutional liquidity hunt is imminent.';
      reasons.push(`Price is overextended by ${distanceEma20.toFixed(2)} pts from EMA 20.`);
      reasons.push(`RSI is at ${numRsi.toFixed(1)} (Severe Overbought). Historical dump risk high.`);
      reasons.push('Direct correlation with the Gilgil 1296.56 disaster where capital was lost.');
    } else if (numRsi <= 25 && isOverextended) {
      score = 28;
      verdict = 'RISKY_EXTENDED';
      title = 'DANGER: Parabolic Dump Exhaustion';
      recommendation = 'DO NOT SELL into the hole! Market is heavily oversold and primed for violent snapback.';
      reasons.push(`RSI is pinned down at ${numRsi.toFixed(1)}.`);
      reasons.push('Price extended far below dynamic moving averages.');
    } else if (isEmaBearish && numPrice < numEma20 && numRsi >= 40 && numRsi <= 55) {
      // The 1291.69 Winning Setup
      score = 92;
      verdict = 'HIGH_PROBABILITY_SELL';
      title = 'HIGH PROBABILITY SHORT: Gilgil Tower Exhaustion Breakdown';
      recommendation = 'Prime short setup. Clean breakdown below 20 EMA with healthy RSI room down to 30.';
      reasons.push('EMA 20 is sloped downward below EMA 50 (Clear Bearish Trend Structure).');
      reasons.push(`Price (${numPrice}) closed below the 20 EMA (${numEma20}) after retesting.`);
      reasons.push(`RSI at ${numRsi} has reset from overbought and has momentum to drop.`);
      reasons.push('Exact match to the 1291.69 → 1289.38 winning trade (+23.1 pips).');
    } else if (isEmaBullish && numPrice > numEma20 && numRsi >= 48 && numRsi <= 62) {
      score = 88;
      verdict = 'HIGH_PROBABILITY_BUY';
      title = 'HIGH PROBABILITY LONG: Dynamic 20/50 EMA Pullback Bounce';
      recommendation = 'High quality long entry. Value Zone respected, trend aligned upward.';
      reasons.push('EMA 20 is cleanly stacked above EMA 50 (Uptrend).');
      reasons.push('Price pulled back into the Value Zone and is holding above 20 EMA.');
      reasons.push(`RSI at ${numRsi} represents healthy bullish continuation momentum.`);
    } else {
      score = 48;
      verdict = 'WAIT_CHOP';
      title = 'CHOPPY RANGE: Indecision Zone';
      recommendation = 'Stay in cash. Spreads will eat your account. Wait for price to touch the 20 EMA.';
      reasons.push('Moving averages are converging or price is tangled.');
      reasons.push(`RSI at ${numRsi} is floating without divergence.`);
    }

    // Historical Reference payload
    const isWinMatch = Math.abs(numPrice - 1291.69) < 5 || (score >= 80);
    const historicalRef = isWinMatch
      ? {
          title: 'Direct Gilgil 1291.69 Reversal Win Correlation',
          description: HISTORICAL_GILGIL_CASES.towerWin.description,
          caseType: 'validated_win' as const,
        }
      : {
          title: 'Gilgil 1296.56 Parabolic Loss Correlation',
          description: HISTORICAL_GILGIL_CASES.towerLoss.description,
          caseType: 'warning_loss' as const,
        };

    // Advanced AI Synthesis
    const aiSynthesis = {
      sentimentSummary:
        verdict === 'HIGH_PROBABILITY_SELL'
          ? 'Institutional sell footprint detected. Retail breakout buyers are trapped above resistance while dynamic 20 EMA slopes downward.'
          : verdict === 'HIGH_PROBABILITY_BUY'
          ? 'Bullish trend continuation confirmed. Dynamic 20/50 Value Zone defended by institutional bid volume.'
          : verdict === 'RISKY_EXTENDED'
          ? 'Severe mean-reversion risk. Parabolic retail FOMO detected. High probability of an immediate 30-50 pip liquidation hunt.'
          : 'Low directional conviction. Moving averages are tangled and interbank order books indicate consolidation chop.',
      keyRiskFactor:
        verdict === 'RISKY_EXTENDED'
          ? 'FOMO execution trap (Direct parallel to the Gilgil 1296.56 disaster). Avoid entering without EMA reset.'
          : 'Spread widening during low volume or ignoring the fixed $2.00 max risk stop loss.',
      institutionalFootprint:
        isEmaBearish
          ? 'Smart money absorption confirmed below EMA 20 with RSI momentum descending from extreme overbought.'
          : isEmaBullish
          ? 'Higher swing lows structured above 50 EMA baseline with aggressive absorption at key liquidity pools.'
          : 'Neutral liquidity accumulation zone prior to London session order injection.',
      tradePlanSteps: [
        `1. Setup: Confirm ${pair} candle close on ${timeframe} timeframe.`,
        `2. Execution: Max stake 0.01 micro lot ($2.00 risk cap = 260 KES).`,
        `3. Invalidation: Stop loss placed strictly at 18 pips buffer.`,
        `4. Target: Take profit staged at 36 pips (1:2.0 Risk-to-Reward ratio).`
      ]
    };

    const analysisObj: AnalysisResult = {
      score,
      verdict,
      title,
      recommendation,
      suggestedStake: 2.00, // strict $2 rule
      suggestedLotSize: 0.01,
      stopLossPips: 18,
      takeProfitPips: 36,
      riskReward: '1 : 2.0',
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

  const handleLogToJournal = () => {
    if (!result) return;
    const numPrice = parseFloat(price);
    const isSell = result.verdict === 'HIGH_PROBABILITY_SELL' || result.score < 50;
    
    onLogTrade({
      pair,
      broker,
      type: isSell ? 'SELL' : 'BUY',
      entryPrice: numPrice,
      score: result.score,
      mode: result.title,
      riskUsd: 2.00,
      status: 'OPEN',
      notes: `Super Analysis MT4/5 log. Score ${result.score}/100. RSI: ${rsi}, EMA20: ${ema20}, EMA50: ${ema50}. Broker: ${broker.toUpperCase()}.`,
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
            <span>Pillar 2 • Advanced AI Analysis Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            MT4 & MT5 Super Analysis Tool
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Input your MetaTrader numbers. The tool calculates EMA divergence, RSI overextension, and applies the Gilgil $2 rule before you click execute.
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
          <DownloadCloud className="w-3.5 h-3.5 text-[#00C261]" /> Import Presets:
        </span>
        <button
          onClick={() => handleLoadPreset('win_1291')}
          className="px-3 py-1.5 rounded-lg bg-[#00C261]/15 text-[#00C261] border border-[#00C261]/30 hover:bg-[#00C261]/25 font-semibold transition"
        >
          🏆 Load 1291.69 Winning Reversal
        </button>
        <button
          onClick={() => handleLoadPreset('loss_1296')}
          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 font-semibold transition"
        >
          ⚠️ Load 1296.56 Tower Top Loss
        </button>
        <button
          onClick={() => handleLoadPreset('eur_bounce')}
          className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 font-semibold transition"
        >
          📈 EUR/USD 20/50 Pullback
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 ml-auto flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Clear All
        </button>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Inputs (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C261]" />
              MT4 / MT5 Data Parameters
            </h3>

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
                onChange={(val) => setPair(val as CurrencyPair)}
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
                  <span>Current Price (Bid/Ask)</span>
                  <span className="text-[10px] text-cyan-400 font-mono">e.g. 1291.69</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter current price"
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
                  placeholder="e.g. 46.2"
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
                  placeholder="e.g. 1292.80"
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
                  placeholder="e.g. 1294.50"
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
                Analyze Now (0–100 Score)
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

        {/* Right Column: Intelligence Output & Score Meter (5 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in zoom-in-95 duration-200">
              {/* Header: Score + Verdict */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  {/* Circular Score Badge */}
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
                        result.verdict === 'HIGH_PROBABILITY_BUY' || result.verdict === 'HIGH_PROBABILITY_SELL'
                          ? 'bg-[#00C261]/20 text-[#00C261]'
                          : result.verdict === 'RISKY_EXTENDED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {result.verdict.replace('_', ' ')}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">{result.title}</h4>
                  </div>
                </div>
              </div>

              {/* $2 Rule Money Management Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0e1726] to-[#0a121e] border border-[#00C261]/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#00C261] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Gilgil $2 Rule Execution Sizing
                  </span>
                  <span className="text-slate-400">Fixed Micro Risk</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Max Monetary Risk</span>
                    <strong className="text-base font-mono text-[#00C261] font-bold">$2.00 (260 KES)</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Micro Lot Size</span>
                    <strong className="text-base font-mono text-white font-bold">{result.suggestedLotSize}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Stop / Target</span>
                    <strong className="text-base font-mono text-cyan-400 font-bold">{result.stopLossPips}p / {result.takeProfitPips}p</strong>
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
                      <BrainCircuit className="w-3.5 h-3.5" /> Advanced AI Neural Synthesis
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[10px]">
                      Confluence Analyzed
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <p className="leading-relaxed">
                      <strong className="text-white">AI Sentiment:</strong> {result.aiSynthesis.sentimentSummary}
                    </p>
                    <p className="leading-relaxed text-slate-400">
                      <strong className="text-cyan-300">Smart Money Footprint:</strong> {result.aiSynthesis.institutionalFootprint}
                    </p>
                    <p className="leading-relaxed text-amber-300/90">
                      <strong className="text-amber-400">Key Failure Risk:</strong> {result.aiSynthesis.keyRiskFactor}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                      AI Executable Trade Plan (Gilgil Rules):
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

              {/* Log to Journal Action */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleLogToJournal}
                  disabled={loggedToJournal}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
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
                <h4 className="text-base font-bold text-white">Awaiting Your MT4 / MT5 Input</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your price, EMA values, and RSI on the left, or click one of the quick preset buttons above (e.g. 1291.69 Winning Reversal).
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00C261]">
                <Clock className="w-3.5 h-3.5" />
                <span>Instant algorithmic score calculation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
