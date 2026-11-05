import React, { useState, useEffect } from 'react';
import { CurrencyPair, Timeframe, PageTab } from '../types';
import { PAIRS_PRESETS } from '../data/forexData';
import { CustomSelect, SelectOption } from '../components/common/CustomSelect';
import {
  CandlestickChart,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Scan,
  TrendingDown,
  TrendingUp,
  Bookmark,
  Trash2,
  Plus,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PillarHeaderBar } from '../components/common/PillarHeaderBar';

interface TradingViewPageProps {
  onNavigate: (tab: PageTab) => void;
  onSendToScanner: (pair: CurrencyPair, timeframe: Timeframe, price: number, rsi: number) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

interface DrawnLevel {
  id: string;
  price: number;
  label: string;
  type: 'support' | 'resistance';
}

export const TradingViewPage: React.FC<TradingViewPageProps> = ({
  onNavigate,
  onSendToScanner,
  onAwardXp,
}) => {
  const [pair, setPair] = useState<CurrencyPair>('EUR/USD');
  const [timeframe, setTimeframe] = useState<Timeframe>('M15');
  const [showEma20, setShowEma20] = useState(true);
  const [showEma50, setShowEma50] = useState(true);
  const [showRsi, setShowRsi] = useState(true);
  const [showPivotOverlay, setShowPivotOverlay] = useState(true);

  // Tower formation animated player state
  const [isPlayingTowerAnimation, setIsPlayingTowerAnimation] = useState(false);
  const [towerStep, setTowerStep] = useState(0); // 0 to 4 steps

  // Saved Support & Resistance lines (persisted in localStorage)
  const [drawnLevels, setDrawnLevels] = useState<DrawnLevel[]>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_drawn_levels');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: '1', price: 1.12920, label: 'Session Resistance', type: 'resistance' },
      { id: '2', price: 1.12450, label: 'Key Dynamic Support (50 EMA)', type: 'support' },
    ];
  });

  const [newLevelPrice, setNewLevelPrice] = useState('');
  const [newLevelLabel, setNewLevelLabel] = useState('');
  const [newLevelType, setNewLevelType] = useState<'support' | 'resistance'>('support');

  // Pair options
  const pairOptions: SelectOption[] = Object.keys(PAIRS_PRESETS).map((p) => ({
    value: p,
    label: p,
    sublabel: `Symbol: FX:${p.replace('/', '')} • ~${PAIRS_PRESETS[p as CurrencyPair].defaultPrice}`,
  }));

  const timeframeOptions: SelectOption[] = [
    { value: 'M1', label: '1 Minute (M1)' },
    { value: 'M5', label: '5 Minutes (M5)' },
    { value: 'M10', label: '10 Minutes (M10)' },
    { value: 'M15', label: '15 Minutes (M15)', badge: 'Core' },
    { value: 'H1', label: '1 Hour (H1)' },
    { value: 'H4', label: '4 Hours (H4)' },
    { value: 'D1', label: 'Daily (D1)' },
  ];

  // Dynamic score based on timeframe & pair
  const calculateDynamicScore = () => {
    if (timeframe === 'M15') return 88;
    if (timeframe === 'M10') return 86;
    if (timeframe === 'H1') return 82;
    if (timeframe === 'H4') return 91;
    if (timeframe === 'M5') return 74;
    return 65;
  };

  // Persist drawn levels
  useEffect(() => {
    localStorage.setItem('pivotfx_drawn_levels', JSON.stringify(drawnLevels));
  }, [drawnLevels]);

  // Tower animation playback loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingTowerAnimation) {
      timer = setInterval(() => {
        setTowerStep((prev) => {
          if (prev >= 4) {
            setIsPlayingTowerAnimation(false);
            return 4;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlayingTowerAnimation]);

  const handleAddLevel = () => {
    const p = parseFloat(newLevelPrice);
    if (isNaN(p)) return;
    const newL: DrawnLevel = {
      id: Date.now().toString(),
      price: p,
      label: newLevelLabel || `${newLevelType.toUpperCase()} Level`,
      type: newLevelType,
    };
    setDrawnLevels([...drawnLevels, newL]);
    setNewLevelPrice('');
    setNewLevelLabel('');
    onAwardXp(15, 'Mapped Key Price Level');
  };

  const handleDeleteLevel = (id: string) => {
    setDrawnLevels(drawnLevels.filter((l) => l.id !== id));
  };

  const handleScanDirectly = () => {
    const currentPrice = PAIRS_PRESETS[pair]?.defaultPrice || 1.12670;
    onSendToScanner(pair, timeframe, currentPrice, 46.5);
    onNavigate('ai-scanner');
    onAwardXp(25, 'Transferred Chart to AI Scanner');
  };

  // Convert pair to TradingView embed symbol
  const tvSymbol = pair === 'XAU/USD' ? 'OANDA:XAUUSD' : pair === 'BTC/USD' ? 'BITSTAMP:BTCUSD' : `FX:${pair.replace('/', '')}`;
  const tvTimeframeCode =
    timeframe === 'M1'
      ? '1'
      : timeframe === 'M5'
      ? '5'
      : timeframe === 'M10'
      ? '10'
      : timeframe === 'M15'
      ? '15'
      : timeframe === 'H1'
      ? '60'
      : timeframe === 'H4'
      ? '240'
      : 'D';

  const towerStepsExplain = [
    { title: 'Phase 1: Parabolic Rush (Tower Ascent)', desc: '3 consecutive green candles sprint higher. Retail traders feel intense FOMO and buy at the peak.' },
    { title: 'Phase 2: The Red Tower Top Trap (GBP/USD 1.35450)', desc: 'Price pushes 40+ pips away from EMA 20. Upper wick sweeps buy-side liquidity. Institutional sell orders initiate.' },
    { title: 'Phase 3: The Bearish Exhaustion Pinbar', desc: 'Buyers fail to print new highs. RSI forms steep bearish divergence. Wick rejects resistance.' },
    { title: 'Phase 4: The 1.35100 Entry Breakdown', desc: 'Candle closes cleanly BELOW the 20 EMA. Short entry triggered at 1.35100 with SL at 1.35260 (SL > Entry) and $2 max risk.' },
    { title: 'Phase 5: Target Realized (1.34780)', desc: 'Price cascades directly into the 50 EMA Value Zone. +32.0 pips booked cleanly.' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Pillar Navigation Header Bar */}
      <PillarHeaderBar currentTab="tradingview" onNavigate={onNavigate} />

      {/* Top Header & Strategy Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
            <CandlestickChart className="w-4 h-4" />
            <span>Pillar 3 • Professional Charting</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Built-in TradingView Studio & Custom PivotFX Strategy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live institutional charts equipped with our custom Tower Reversal detection overlay, EMA indicators, and saved levels.
          </p>
        </div>

        {/* Dynamic Analysis Score Pill */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#00C261]/20 border border-[#00C261]/40 text-[#00C261] font-mono font-black text-xl flex items-center justify-center">
              {calculateDynamicScore()}
            </div>
            <div className="text-xs">
              <span className="text-slate-400 block font-mono">Timeframe Setup Score</span>
              <span className="text-white font-bold">{timeframe} Confluence: High</span>
            </div>
          </div>

          <button
            onClick={handleScanDirectly}
            className="px-5 py-3.5 rounded-2xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-[#00C261]/25 flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Scan className="w-4 h-4" />
            <span>Scan This Chart Directly</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Pair, Timeframe, Indicator Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#111827] border border-slate-800 text-xs">
        <CustomSelect
          options={pairOptions}
          value={pair}
          onChange={(val) => setPair(val as CurrencyPair)}
        />
        <CustomSelect
          options={timeframeOptions}
          value={timeframe}
          onChange={(val) => setTimeframe(val as Timeframe)}
        />

        {/* Indicator Toggles */}
        <div className="md:col-span-2 flex flex-wrap items-center gap-2 justify-end">
          <button
            onClick={() => setShowEma20(!showEma20)}
            className={`px-3 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition border ${
              showEma20
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            EMA 20 {showEma20 ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowEma50(!showEma50)}
            className={`px-3 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition border ${
              showEma50
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            EMA 50 {showEma50 ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowRsi(!showRsi)}
            className={`px-3 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition border ${
              showRsi
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            RSI (14) {showRsi ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowPivotOverlay(!showPivotOverlay)}
            className={`px-3 py-2 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition border ${
              showPivotOverlay
                ? 'bg-[#00C261]/20 text-[#00C261] border-[#00C261]/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            PivotFX Strategy Overlay
          </button>
        </div>
      </div>

      {/* Main Chart Canvas & Overlay Container */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-[#0B0F17] shadow-2xl">
        {/* Custom Strategy Alert Banner overlaid on top of chart */}
        {showPivotOverlay && (
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#111827]/90 backdrop-blur-md border border-slate-700/80 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-red-400">
                RED: Tower Top Loss Traps (Avoid Buying Extended)
              </span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="font-bold text-[#00C261]">
                GREEN: Disciplined 20 EMA Breakdown Entries (e.g. 1.35100)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">Timeframe: {timeframe}</span>
            </div>
          </div>
        )}

        {/* Live TradingView Widget Embed */}
        <div className="w-full h-[520px]">
          <iframe
            title={`TradingView Chart ${pair}`}
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${encodeURIComponent(
              tvSymbol
            )}&interval=${tvTimeframeCode}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Africa%2FNairobi&studies_overrides=%7B%7D&overrides=%7B%22mainSeriesProperties.candleStyle.upColor%22%3A%22%2300C261%22%2C%22mainSeriesProperties.candleStyle.downColor%22%3A%22%23ef4444%22%2C%22mainSeriesProperties.candleStyle.drawWick%22%3Atrue%2C%22mainSeriesProperties.candleStyle.drawBorder%22%3Atrue%2C%22mainSeriesProperties.candleStyle.borderColor%22%3A%22%2337a6ef%22%2C%22mainSeriesProperties.candleStyle.borderUpColor%22%3A%22%2300C261%22%2C%22mainSeriesProperties.candleStyle.borderDownColor%22%3A%22%23ef4444%22%2C%22mainSeriesProperties.candleStyle.wickUpColor%22%3A%22%2300C261%22%2C%22mainSeriesProperties.candleStyle.wickDownColor%22%3A%22%23ef4444%22%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=pivotfxlab`}
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      </div>

      {/* Two Secondary Interactive Modules:
          1. Animated Tower Formation Step-by-Step Replay
          2. Persistent Support & Resistance Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Animated Tower Formation Replay */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-500/15 text-red-400">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">The Gilgil Tower Formation Simulator</h3>
                <p className="text-xs text-slate-400">Step-by-step breakdown of how a trap forms and exhausts</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (towerStep >= 4) setTowerStep(0);
                setIsPlayingTowerAnimation(!isPlayingTowerAnimation);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#00C261] text-black font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#00dc6e] transition"
            >
              {isPlayingTowerAnimation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlayingTowerAnimation ? 'Pause' : 'Play Replay'}
            </button>
          </div>

          {/* Stepper Visualizer */}
          <div className="p-5 rounded-2xl bg-[#0B0F17] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#00C261] font-bold">Step {towerStep + 1} of 5</span>
              <span className="text-slate-400">
                {towerStep === 1 ? '⚠️ The 1.35450 Trap' : towerStep === 3 ? '✅ The 1.35100 Entry' : 'Market Cycle'}
              </span>
            </div>

            {/* Step Progress Dots */}
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setIsPlayingTowerAnimation(false);
                    setTowerStep(s);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    s === towerStep
                      ? s === 1
                        ? 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                        : 'bg-[#00C261] shadow-[0_0_10px_#00C261]'
                      : s < towerStep
                      ? 'bg-slate-700'
                      : 'bg-slate-900'
                  }`}
                />
              ))}
            </div>

            {/* Explanation box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {towerStep === 1 && <span className="w-2 h-2 rounded-full bg-red-400" />}
                {towerStep === 3 && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                {towerStepsExplain[towerStep].title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {towerStepsExplain[towerStep].desc}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Support & Resistance Drawing Book */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Save Support & Resistance Levels</h3>
                <p className="text-xs text-slate-400">Saved directly to your browser localStorage</p>
              </div>
            </div>
          </div>

          {/* Add Level Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="number"
              step="any"
              placeholder="Price (e.g. 1.12670)"
              value={newLevelPrice}
              onChange={(e) => setNewLevelPrice(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white font-mono outline-none focus:border-[#00C261]"
            />
            <input
              type="text"
              placeholder="Label (e.g. H4 Resistance)"
              value={newLevelLabel}
              onChange={(e) => setNewLevelLabel(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white outline-none focus:border-[#00C261]"
            />
            <div className="flex items-center gap-2">
              <select
                value={newLevelType}
                onChange={(e) => setNewLevelType(e.target.value as 'support' | 'resistance')}
                aria-label="Level Type"
                className="px-2 py-2 rounded-xl bg-[#0B0F17] border border-slate-700 text-white text-xs outline-none flex-1"
              >
                <option value="support">Support</option>
                <option value="resistance">Resistance</option>
              </select>
              <button
                onClick={handleAddLevel}
                className="p-2 rounded-xl bg-[#00C261] text-black hover:bg-[#00dc6e] transition font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Saved Levels List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {drawnLevels.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No saved levels yet.</p>
            ) : (
              drawnLevels.map((lvl) => (
                <div
                  key={lvl.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0B0F17] border border-slate-800 text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        lvl.type === 'support' ? 'bg-[#00C261]' : 'bg-red-400'
                      }`}
                    />
                    <strong className="text-white">{lvl.price}</strong>
                    <span className="text-slate-400 font-sans text-[11px]">({lvl.label})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteLevel(lvl.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
