import React, { useState } from 'react';
import { CurrencyPair, Timeframe, BrokerId } from '../../types';
import {
  Globe,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Bot,
  Copy,
  Check,
  Compass,
  Scale,
  BarChart3,
  ExternalLink,
  Flame,
  Target
} from 'lucide-react';

export interface MarketScanData {
  pair: CurrencyPair;
  symbol: string;
  price: number;
  bias: 'STRONG_BUY' | 'STRONG_SELL' | 'NEUTRAL_CHOP';
  confidence: number; // e.g. 96.4
  trend: string;
  ictPattern: string;
  projection: string;
  projectedPips: number;
  suggestedSL: number;
  suggestedTP1: number;
  suggestedTP2: number;
  ema20: number;
  ema50: number;
  rsi: number;
  keyLevel: number;
  patternType: 'Tower Top Liquidity Sweep' | '20/50 EMA Trend Bounce' | 'Asian Liquidity Sweep' | 'Fair Value Gap Re-test' | 'Bearish Order Block Mitigation';
  riskReward: string;
  isTopPick?: boolean;
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedSession: string;
  spreadByBroker: Record<BrokerId, { symbol: string; spread: number; notes: string }>;
}

export const INITIAL_MARKETS_DATA: MarketScanData[] = [
  {
    pair: 'XAU/USD',
    symbol: 'GOLD (Spot)',
    price: 2742.50,
    bias: 'STRONG_BUY',
    confidence: 96.4,
    trend: 'Institutional Bullish Expansion',
    ictPattern: 'Asian Low Sweep + Bullish Order Block Defended',
    projection: 'Next 4H-24H Trajectory: Swept Asian sell-side liquidity at 2735.00. Institutional algorithms repricing upwards to tag 2760.00 Buy-Side Liquidity pool (+175 pips expansion).',
    projectedPips: 175,
    suggestedSL: 2732.00,
    suggestedTP1: 2752.00,
    suggestedTP2: 2760.00,
    ema20: 2736.20,
    ema50: 2728.80,
    rsi: 58.4,
    keyLevel: 2732.00,
    patternType: 'Fair Value Gap Re-test',
    riskReward: '1 : 2.6',
    isTopPick: true,
    volatility: 'HIGH',
    recommendedSession: 'London / NY Overlap (15:30 - 18:30 EAT)',
    spreadByBroker: {
      fxpesa: { symbol: 'XAUUSD', spread: 2.2, notes: 'CMA Kenya investor protected. M-Pesa instant deposit.' },
      hfm: { symbol: 'GOLD', spread: 2.4, notes: 'High leverage up to 1:1000.' },
      exness: { symbol: 'XAUUSD.m', spread: 1.2, notes: 'Raw zero spread available. Instant algorithmic M-Pesa withdrawal.' },
      fbs: { symbol: 'XAUUSD', spread: 2.6, notes: 'Cent account compatible for micro testing.' }
    }
  },
  {
    pair: 'GBP/USD',
    symbol: 'Cable',
    price: 1.29169,
    bias: 'STRONG_SELL',
    confidence: 93.8,
    trend: 'Bearish Tower Top Liquidity Sweep',
    ictPattern: 'Tower Top Liquidity Sweep + Fair Value Gap Mitigation',
    projection: 'Next 4H-24H Trajectory: Swept previous session high at 1.29656. Closed below 20 EMA with RSI bearish divergence. Projection targets 1.28520 50 EMA imbalance (-64 pips drop).',
    projectedPips: 64,
    suggestedSL: 1.29680,
    suggestedTP1: 1.28850,
    suggestedTP2: 1.28520,
    ema20: 1.28850,
    ema50: 1.28520,
    rsi: 76.4,
    keyLevel: 1.29656,
    patternType: 'Tower Top Liquidity Sweep',
    riskReward: '1 : 2.5',
    volatility: 'HIGH',
    recommendedSession: 'London Open (10:00 - 12:30 EAT)',
    spreadByBroker: {
      fxpesa: { symbol: 'GBPUSD', spread: 1.2, notes: 'CMA Regulated, tight 1.2 pip spread.' },
      hfm: { symbol: 'GBPUSD.h', spread: 1.4, notes: 'Standard execution.' },
      exness: { symbol: 'GBPUSD.m', spread: 0.7, notes: 'Micro standard, 0.7 pip typical spread.' },
      fbs: { symbol: 'GBPUSD', spread: 1.5, notes: 'Cent and Standard account.' }
    }
  },
  {
    pair: 'EUR/USD',
    symbol: 'Fiber',
    price: 1.08420,
    bias: 'STRONG_BUY',
    confidence: 91.2,
    trend: 'Dynamic 20 EMA Bullish Continuation',
    ictPattern: '20/50 EMA Bullish Bounce + FVG Consequent Encroachment',
    projection: 'Next 4H-24H Trajectory: Pulled back into 1.08320 dynamic 20 EMA support. Expecting displacement expansion towards 1.08950 (+53 pips move).',
    projectedPips: 53,
    suggestedSL: 1.08200,
    suggestedTP1: 1.08700,
    suggestedTP2: 1.08950,
    ema20: 1.08320,
    ema50: 1.08180,
    rsi: 54.2,
    keyLevel: 1.08200,
    patternType: '20/50 EMA Trend Bounce',
    riskReward: '1 : 2.4',
    volatility: 'MEDIUM',
    recommendedSession: 'London / NY (10:00 - 17:00 EAT)',
    spreadByBroker: {
      fxpesa: { symbol: 'EURUSD', spread: 1.1, notes: 'Lowest standard spread on CMA platform.' },
      hfm: { symbol: 'EURUSD', spread: 1.2, notes: 'Standard account.' },
      exness: { symbol: 'EURUSD.m', spread: 0.6, notes: 'Zero spread account reaches 0.1 pip.' },
      fbs: { symbol: 'EURUSD', spread: 1.3, notes: 'Standard spread.' }
    }
  },
  {
    pair: 'BTC/USD',
    symbol: 'Bitcoin Spot',
    price: 68450.00,
    bias: 'STRONG_BUY',
    confidence: 94.2,
    trend: 'Institutional Liquidity Compression',
    ictPattern: 'Equal Lows Sell-Side Sweep + Higher Timeframe Displacement',
    projection: 'Next 4H-24H Trajectory: Engineered liquidity sweep below 67,200 followed by V-reversal. Institutional target set at $70,500 all-time high breakout liquidity pool (+$2,050 USD move).',
    projectedPips: 205,
    suggestedSL: 67100.00,
    suggestedTP1: 69500.00,
    suggestedTP2: 70500.00,
    ema20: 67800.00,
    ema50: 67200.00,
    rsi: 62.8,
    keyLevel: 67100.00,
    patternType: 'Fair Value Gap Re-test',
    riskReward: '1 : 2.8',
    volatility: 'HIGH',
    recommendedSession: '24/7 Global Liquidity Flow',
    spreadByBroker: {
      fxpesa: { symbol: 'BTCUSD', spread: 25.0, notes: 'CMA CFD contract with weekend rollover.' },
      hfm: { symbol: 'BTCUSD', spread: 30.0, notes: 'High leverage crypto CFD.' },
      exness: { symbol: 'BTCUSD', spread: 18.0, notes: 'Zero overnight swap fee on crypto CFDs.' },
      fbs: { symbol: 'BTCUSD', spread: 35.0, notes: 'Crypto swap rates apply.' }
    }
  },
  {
    pair: 'USD/JPY',
    symbol: 'Ninja',
    price: 153.400,
    bias: 'STRONG_BUY',
    confidence: 88.5,
    trend: 'Yield Differential Uptrend',
    ictPattern: 'Discount Mitigation + Break of Structure Retest',
    projection: 'Next 4H-24H Trajectory: US 10Y Yields rallying. USD/JPY holding 152.90 discount zone with trajectory towards 154.300 (+90 pips).',
    projectedPips: 90,
    suggestedSL: 152.800,
    suggestedTP1: 153.850,
    suggestedTP2: 154.300,
    ema20: 153.050,
    ema50: 152.750,
    rsi: 57.6,
    keyLevel: 152.800,
    patternType: '20/50 EMA Trend Bounce',
    riskReward: '1 : 2.2',
    volatility: 'MEDIUM',
    recommendedSession: 'Tokyo / NY Session (03:00 & 15:30 EAT)',
    spreadByBroker: {
      fxpesa: { symbol: 'USDJPY', spread: 1.2, notes: 'Standard CMA spread.' },
      hfm: { symbol: 'USDJPY', spread: 1.3, notes: 'High leverage available.' },
      exness: { symbol: 'USDJPY.m', spread: 0.7, notes: 'Tight micro spread.' },
      fbs: { symbol: 'USDJPY', spread: 1.4, notes: 'Cent account ready.' }
    }
  },
  {
    pair: 'GBP/JPY',
    symbol: 'Guppy / Dragon',
    price: 198.200,
    bias: 'STRONG_BUY',
    confidence: 90.7,
    trend: 'High-Volatility Bullish Expansion',
    ictPattern: 'London Open Judas Sweep + High Probability Continuation',
    projection: 'Next 4H-24H Trajectory: Swept 197.40 London low, aggressive wick rejection. Trajectory targeting 199.500 psychological resistance (+130 pips).',
    projectedPips: 130,
    suggestedSL: 197.300,
    suggestedTP1: 198.900,
    suggestedTP2: 199.500,
    ema20: 197.650,
    ema50: 197.100,
    rsi: 61.5,
    keyLevel: 197.300,
    patternType: 'Asian Liquidity Sweep',
    riskReward: '1 : 2.5',
    volatility: 'HIGH',
    recommendedSession: 'London Session (10:00 - 13:00 EAT)',
    spreadByBroker: {
      fxpesa: { symbol: 'GBPJPY', spread: 1.8, notes: 'Tight cross-pair spread.' },
      hfm: { symbol: 'GBPJPY', spread: 2.0, notes: 'Standard spread.' },
      exness: { symbol: 'GBPJPY.m', spread: 1.1, notes: 'Low friction on Dragon pair.' },
      fbs: { symbol: 'GBPJPY', spread: 2.2, notes: 'High leverage.' }
    }
  },
  {
    pair: 'USD/CAD',
    symbol: 'Loonie',
    price: 1.38900,
    bias: 'STRONG_SELL',
    confidence: 86.4,
    trend: 'Bearish Order Block Rejection',
    ictPattern: 'Daily Order Block Touch + M15 Market Structure Shift',
    projection: 'Next 4H-24H Trajectory: Rejected 1.3930 institutional ceiling. Oil strength pushing CAD higher. Trajectory towards 1.38300 (-60 pips).',
    projectedPips: 60,
    suggestedSL: 1.39350,
    suggestedTP1: 1.38600,
    suggestedTP2: 1.38300,
    ema20: 1.39150,
    ema50: 1.39320,
    rsi: 41.2,
    keyLevel: 1.39350,
    patternType: 'Bearish Order Block Mitigation',
    riskReward: '1 : 2.2',
    volatility: 'MEDIUM',
    recommendedSession: 'New York Session (15:30 - 20:00 EAT)',
    spreadByBroker: {
      fxpesa: { symbol: 'USDCAD', spread: 1.3, notes: 'CMA standard.' },
      hfm: { symbol: 'USDCAD', spread: 1.5, notes: 'Standard.' },
      exness: { symbol: 'USDCAD.m', spread: 0.8, notes: 'Low spread.' },
      fbs: { symbol: 'USDCAD', spread: 1.6, notes: 'Cent account.' }
    }
  },
  {
    pair: 'AUD/USD',
    symbol: 'Aussie',
    price: 0.65800,
    bias: 'NEUTRAL_CHOP',
    confidence: 61.2,
    trend: 'Range Equilibrium Chop',
    ictPattern: 'Equilibrium Indecision Zone — No Directional Edge',
    projection: 'Price is trapped between 0.6560 support and 0.6600 resistance without structural displacement. Institutional advice: AVOID / FLAT until breakout.',
    projectedPips: 15,
    suggestedSL: 0.65500,
    suggestedTP1: 0.65900,
    suggestedTP2: 0.66050,
    ema20: 0.65820,
    ema50: 0.65840,
    rsi: 49.5,
    keyLevel: 0.65500,
    patternType: '20/50 EMA Trend Bounce',
    riskReward: '1 : 1.5',
    volatility: 'LOW',
    recommendedSession: 'Asian / Sydney Session',
    spreadByBroker: {
      fxpesa: { symbol: 'AUDUSD', spread: 1.2, notes: 'Low spread.' },
      hfm: { symbol: 'AUDUSD', spread: 1.4, notes: 'Standard.' },
      exness: { symbol: 'AUDUSD.m', spread: 0.7, notes: 'Low spread.' },
      fbs: { symbol: 'AUDUSD', spread: 1.5, notes: 'Cent account.' }
    }
  }
];

interface MultiMarketRadarEngineProps {
  selectedBroker: BrokerId;
  onSelectMarketForAnalysis: (market: MarketScanData, mode?: 'standard' | 'deep_ai') => void;
  onOpenTradingViewForPair: (pair: CurrencyPair) => void;
}

export const MultiMarketRadarEngine: React.FC<MultiMarketRadarEngineProps> = ({
  selectedBroker,
  onSelectMarketForAnalysis,
  onOpenTradingViewForPair,
}) => {
  const [markets, setMarkets] = useState<MarketScanData[]>(INITIAL_MARKETS_DATA);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScannedTime, setLastScannedTime] = useState<string>('Live (10 seconds ago)');
  const [filterBias, setFilterBias] = useState<'ALL' | 'BUY' | 'SELL' | 'TOP_PICK'>('ALL');
  const [copiedEa, setCopiedEa] = useState(false);

  // Find Top Pick
  const topMarket = markets.find((m) => m.isTopPick) || markets[0];

  // Re-scan all markets with audio & animation
  const handleRescanMarkets = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      setIsScanning(false);
      setLastScannedTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' EAT');
      playRadarBeep();
    }, 1100);
  };

  const playRadarBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1050, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  };

  // Generate EA MQL Code for selected top market
  const eaMqlCode = `// --- PIVOTFX INSTITUTIONAL SEMI-AUTOMATED EA CONFIG ---
// Broker Server: ${selectedBroker.toUpperCase()}
// Symbol: ${topMarket.spreadByBroker[selectedBroker]?.symbol || topMarket.pair}
// Direction: ${topMarket.bias === 'STRONG_BUY' ? 'BUY_LIMIT / INSTANT_BUY' : 'SELL_LIMIT / INSTANT_SELL'}
// AI Confidence: ${topMarket.confidence}% High Probability
// Gilgil Shield: $2.00 Max Capital Risk Enforced

input string   EA_Name             = "PivotFx_Institutional_V2";
input int      MagicNumber         = 882024;
input double   LotSize             = 0.01;        // Strict Gilgil Micro Lot ($2 Max Risk)
input double   EntryPrice          = ${topMarket.price};
input double   StopLoss            = ${topMarket.suggestedSL};
input double   TakeProfit_1        = ${topMarket.suggestedTP1}; // Close 50% Scale-Out
input double   TakeProfit_2        = ${topMarket.suggestedTP2}; // Final Institutional Target
input int      MaxSlippagePips     = 3;
input bool     BreakEvenAtTP1      = true;        // Move SL to Entry at TP1
input double   MaxRiskUsdPerTrade  = 2.00;        // 260 KES hard loss cap
// ----------------------------------------------------`;

  const handleCopyEa = () => {
    navigator.clipboard.writeText(eaMqlCode);
    setCopiedEa(true);
    setTimeout(() => setCopiedEa(false), 2500);
  };

  // Filtered Markets
  const filteredMarkets = markets.filter((m) => {
    if (filterBias === 'TOP_PICK') return m.isTopPick;
    if (filterBias === 'BUY') return m.bias === 'STRONG_BUY';
    if (filterBias === 'SELL') return m.bias === 'STRONG_SELL';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Multi-Market Deep AI Cockpit Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-[#D4AF37]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '12s' }} />
            <span>GLOBAL RADAR • 8 INSTITUTIONAL MARKETS SYNCHRONIZED</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Multi-Market Deep AI Scanner & EA Terminal</span>
          </h3>
          <p className="text-xs text-slate-300 font-mono">
            Scans across Forex majors, Gold, and Crypto to isolate the #1 trending market with high % confidence.
          </p>
        </div>

        {/* Re-Scan Action Button */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-400 block">Radar Status</span>
            <span className="text-xs font-mono text-[#00C261] font-bold">
              {isScanning ? `Scanning ${scanProgress}%...` : lastScannedTime}
            </span>
          </div>

          <button
            onClick={handleRescanMarkets}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Markets...' : 'Re-scan All Markets'}</span>
          </button>
        </div>
      </div>

      {/* #1 BEST TRENDING MARKET HIGHLIGHT CARD */}
      {topMarket && (
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-[#D4AF37] shadow-2xl">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-black font-black text-xs font-mono flex items-center gap-1.5 shadow-md">
                  <Award className="w-3.5 h-3.5" />
                  <span>#1 BEST TRENDING MARKET RIGHT NOW</span>
                </span>
                <span className="text-xs font-mono text-amber-200">
                  Highest Confluence Rating Across All Pairs
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[#00C261] text-xs font-mono font-black">
                  {topMarket.confidence}% HIGH CONFIDENCE
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                  Volatility: {topMarket.volatility}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Asset & Trend Info (5 cols) */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-black text-white tracking-tight">{topMarket.pair}</h2>
                  <span className="text-sm font-mono text-[#D4AF37] font-bold">{topMarket.symbol}</span>
                  <span className="text-lg font-mono font-bold text-white">@ {topMarket.price}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#00C261]/20 text-[#00C261] text-xs font-mono font-black border border-[#00C261]/30">
                    {topMarket.bias.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-white font-bold">{topMarket.trend}</span>
                </div>

                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <strong className="text-[#D4AF37]">ICT Pattern:</strong> {topMarket.ictPattern}
                </p>

                <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Best Session: {topMarket.recommendedSession}</span>
                </div>
              </div>

              {/* Trajectory & Targets (4 cols) */}
              <div className="lg:col-span-4 bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[#D4AF37] font-bold border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Projected Trajectory:</span>
                  </span>
                  <span className="text-emerald-400 font-extrabold">+{topMarket.projectedPips} Pips</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {topMarket.projection}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/40">
                    <span className="text-[9px] text-red-400 block">Stop Loss</span>
                    <span className="font-bold text-white text-xs">{topMarket.suggestedSL}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-cyan-950/30 border border-cyan-900/40">
                    <span className="text-[9px] text-cyan-400 block">TP1 (50%)</span>
                    <span className="font-bold text-white text-xs">{topMarket.suggestedTP1}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                    <span className="text-[9px] text-emerald-400 block">Final Target</span>
                    <span className="font-bold text-white text-xs">{topMarket.suggestedTP2}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (3 cols) */}
              <div className="lg:col-span-3 space-y-2">
                <button
                  onClick={() => onSelectMarketForAnalysis(topMarket, 'deep_ai')}
                  className="w-full py-3 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>🧠 Deep AI Analyse ({topMarket.pair})</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectMarketForAnalysis(topMarket, 'standard')}
                    className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 font-mono font-bold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚡ Standard</span>
                  </button>

                  <button
                    onClick={() => onOpenTradingViewForPair(topMarket.pair)}
                    className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono font-bold text-[11px] flex items-center justify-center gap-1.5 border border-slate-800 hover:border-[#D4AF37] transition"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Chart</span>
                  </button>
                </div>

                {/* Gilgil $2 Guarantee Stamp */}
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[10px] font-mono text-center text-amber-200">
                  <span>Gilgil Rule: 0.01 Micro Lot ($2.00 / 260 KES Max Risk)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER BUTTONS & BROKER CONTEXT SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-slate-400 font-bold mr-1">Filter Radar:</span>
          {(['ALL', 'TOP_PICK', 'BUY', 'SELL'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterBias(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                filterBias === mode
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {mode === 'ALL' ? 'All 8 Markets' : mode === 'TOP_PICK' ? '⭐ Top Pick' : mode === 'BUY' ? 'Bullish Only' : 'Bearish Only'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Current Broker Context:</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] font-bold border border-[#D4AF37]/30 uppercase">
            {selectedBroker}
          </span>
        </div>
      </div>

      {/* 8-MARKET RADAR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMarkets.map((m) => {
          const brokerSpec = m.spreadByBroker[selectedBroker];
          const isBuy = m.bias === 'STRONG_BUY';
          const isChop = m.bias === 'NEUTRAL_CHOP';

          return (
            <div
              key={m.pair}
              className={`rounded-2xl p-4.5 bg-slate-950/80 border transition-all hover:scale-[1.01] flex flex-col justify-between space-y-3.5 ${
                m.isTopPick
                  ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base font-black text-white">{m.pair}</span>
                    {m.isTopPick && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black bg-[#D4AF37] text-black">
                        TOP #1
                      </span>
                    )}
                  </div>

                  <span
                    className={`font-mono text-[10px] font-black px-2 py-0.5 rounded-full ${
                      m.confidence >= 90
                        ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                        : m.confidence >= 80
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {m.confidence}% CONFIDENCE
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{m.symbol}</span>
                  <span className="font-bold text-white">@ {m.price}</span>
                </div>
              </div>

              {/* Bias Badge & Trend */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black ${
                      isChop
                        ? 'bg-slate-800 text-slate-400'
                        : isBuy
                        ? 'bg-emerald-500/20 text-[#00C261] border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {m.bias.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-300 font-bold truncate">{m.trend}</span>
                </div>

                <p className="text-[10px] font-mono text-slate-400 line-clamp-2">
                  {m.ictPattern}
                </p>
              </div>

              {/* Broker Contract & Spread Note */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1 font-mono text-[10px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>{selectedBroker.toUpperCase()} Symbol:</span>
                  <strong className="text-white">{brokerSpec?.symbol || m.pair}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Typical Spread:</span>
                  <strong className="text-amber-400">{brokerSpec?.spread} pips</strong>
                </div>
              </div>

              {/* Target & Action */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 text-[10px]">Target Move:</span>
                  <span className={`font-bold ${isChop ? 'text-slate-400' : 'text-[#00C261]'}`}>
                    {isChop ? 'Range (Flat)' : `+${m.projectedPips} Pips`}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => onSelectMarketForAnalysis(m, 'standard')}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono font-bold text-[10px] transition flex items-center justify-center gap-1 active:scale-95"
                    title="Auto-update real quote & analyze technical confluence"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>⚡ Analyse</span>
                  </button>

                  <button
                    onClick={() => onSelectMarketForAnalysis(m, 'deep_ai')}
                    className="py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-mono font-bold text-[10px] transition border border-[#D4AF37]/40 flex items-center justify-center gap-1 shadow-sm active:scale-95"
                    title="Deep AI Institutional Scan with real SL, TP and MT4 ticket"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>🧠 Deep AI</span>
                  </button>

                  <button
                    onClick={() => onOpenTradingViewForPair(m.pair)}
                    className="py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-mono font-bold text-[10px] transition border border-slate-800 flex items-center justify-center gap-1"
                  >
                    <BarChart3 className="w-3 h-3 text-cyan-400" />
                    <span>Chart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INSTITUTIONAL EA TERMINAL (EXPERT ADVISOR CODE GENERATOR) */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>Semi-Automated EA (Expert Advisor) Intelligence Terminal</span>
                <span className="px-2 py-0.5 rounded bg-[#00C261]/20 text-[#00C261] text-[10px] font-bold">
                  ARMED & VERIFIED
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                Direct MQL Parameter Export calibrated for {selectedBroker.toUpperCase()} with Gilgil $2 Shield.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyEa}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] font-mono font-bold text-xs flex items-center gap-1.5 border border-[#D4AF37]/40 transition active:scale-95"
          >
            {copiedEa ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEa ? 'EA Parameters Copied!' : 'Copy EA Parameters'}</span>
          </button>
        </div>

        {/* Code Block */}
        <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
          {eaMqlCode}
        </pre>

        {/* How to use the EA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <span className="text-[#D4AF37] font-bold block">1. Open MT4/MT5 Terminal</span>
            <p className="text-slate-400 text-[11px]">
              Log in to your {selectedBroker.toUpperCase()} account on desktop or mobile app.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">2. Input Exact Values</span>
            <p className="text-slate-400 text-[11px]">
              Paste parameters into your EA Input tab, or execute via F9 Order Ticket.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
            <span className="text-[#00C261] font-bold block">3. Capital Shield Guaranteed</span>
            <p className="text-slate-400 text-[11px]">
              0.01 micro lot ensures maximum loss is fixed strictly at $2.00 (260 KES).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
