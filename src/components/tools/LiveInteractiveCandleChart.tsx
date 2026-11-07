import React, { useState } from 'react';
import { CurrencyPair, Timeframe } from '../../types';
import { OhlcCandle, getPairSpecs } from '../../utils/liveMarketEngine';
import {
  CandlestickChart,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Minus,
  Activity
} from 'lucide-react';

interface LiveInteractiveCandleChartProps {
  pair: CurrencyPair;
  timeframe: Timeframe;
  candles: OhlcCandle[];
  livePrice: number;
  ema20: number;
  ema50: number;
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  advisoryEntryPrice?: number;
  direction: 'BUY' | 'SELL';
  change24hPct: number;
  isLockedToCustom?: boolean;
  onCandlePriceChange: (newPrice: number) => void;
  onResetToLiveStream: () => void;
}

export const LiveInteractiveCandleChart: React.FC<LiveInteractiveCandleChartProps> = ({
  pair,
  timeframe,
  candles,
  livePrice,
  ema20,
  ema50,
  entryPrice,
  stopLoss,
  tp1,
  tp2,
  advisoryEntryPrice,
  direction,
  change24hPct,
  isLockedToCustom = false,
  onCandlePriceChange,
  onResetToLiveStream,
}) => {
  const { decimals, pipMultiplier } = getPairSpecs(pair);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showEma20, setShowEma20] = useState<boolean>(true);
  const [showEma50, setShowEma50] = useState<boolean>(true);
  const [showValueZone, setShowValueZone] = useState<boolean>(true);
  const [showAdvisoryLine, setShowAdvisoryLine] = useState<boolean>(true);

  const visibleCandles = candles.slice(-44);
  const closes = candles.map((c) => c.close);

  // Compute EMA series for smooth curve rendering
  const computeEmaArray = (vals: number[], period: number): number[] => {
    if (!vals.length) return [];
    const k = 2 / (period + 1);
    const out: number[] = [];
    let prev = vals[0];
    for (let i = 0; i < vals.length; i++) {
      prev = i === 0 ? vals[0] : vals[i] * k + prev * (1 - k);
      out.push(prev);
    }
    return out;
  };

  const fullEma20 = computeEmaArray(closes, 20);
  const fullEma50 = computeEmaArray(closes, 50);
  const visEma20 = fullEma20.slice(-visibleCandles.length);
  const visEma50 = fullEma50.slice(-visibleCandles.length);

  // Determine vertical price bounds including candles, EMAs, SL, and TP2
  const allPrices: number[] = [
    ...visibleCandles.flatMap((c) => [c.high, c.low]),
    ...visEma20,
    ...visEma50,
    livePrice,
    entryPrice,
    stopLoss,
    tp1,
    tp2,
    ...(advisoryEntryPrice && advisoryEntryPrice > 0 ? [advisoryEntryPrice] : [])
  ].filter((v) => !isNaN(v) && v > 0);

  const rawMin = allPrices.length ? Math.min(...allPrices) : livePrice * 0.995;
  const rawMax = allPrices.length ? Math.max(...allPrices) : livePrice * 1.005;
  const span = Math.max(rawMax - rawMin, 10 / pipMultiplier);
  const minP = rawMin - span * 0.08;
  const maxP = rawMax + span * 0.08;
  const totalRange = maxP - minP || 1;

  const svgWidth = 760;
  const svgHeight = 310;
  const padLeft = 14;
  const padRight = 92;
  const padTop = 18;
  const padBottom = 26;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const priceToY = (p: number) => {
    const ratio = (maxP - p) / totalRange;
    return Math.max(padTop, Math.min(svgHeight - padBottom, padTop + ratio * plotH));
  };

  const indexToX = (idx: number) => {
    if (visibleCandles.length <= 1) return padLeft + plotW / 2;
    const step = plotW / visibleCandles.length;
    return padLeft + idx * step + step * 0.5;
  };

  const buildPolyline = (series: number[]) =>
    series
      .map((val, idx) => `${indexToX(idx).toFixed(1)},${priceToY(val).toFixed(1)}`)
      .join(' ');

  const ema20Points = buildPolyline(visEma20);
  const ema50Points = buildPolyline(visEma50);

  // Dynamic 20/50 EMA Value Retracement Zone Cloud
  const valueZonePolygon =
    visEma20.length && visEma50.length
      ? [
          ...visEma20.map((v, i) => `${indexToX(i).toFixed(1)},${priceToY(v).toFixed(1)}`),
          ...visEma50
            .slice()
            .reverse()
            .map((v, i) => {
              const origIdx = visEma50.length - 1 - i;
              return `${indexToX(origIdx).toFixed(1)},${priceToY(v).toFixed(1)}`;
            })
        ].join(' ')
      : '';

  const inspectedCandle =
    hoveredIdx !== null && visibleCandles[hoveredIdx]
      ? visibleCandles[hoveredIdx]
      : visibleCandles[visibleCandles.length - 1];

  const microStep = pair.includes('BTC') ? 25 : pair.includes('XAU') ? 0.5 : 0.2 / pipMultiplier;
  const pipStep1 = pair.includes('BTC') ? 100 : pair.includes('XAU') ? 1.5 : 1 / pipMultiplier;
  const pipStep10 = pair.includes('BTC') ? 500 : pair.includes('XAU') ? 10.0 : 10 / pipMultiplier;

  const handleNudge = (delta: number) => {
    const next = Math.max(1 / pipMultiplier, Number((livePrice + delta).toFixed(decimals)));
    onCandlePriceChange(next);
  };

  const isBuy = direction === 'BUY';
  const lastCandleBull = inspectedCandle ? inspectedCandle.close >= inspectedCandle.open : isBuy;

  return (
    <div className="rounded-2xl bg-[#060B16] border border-[#D4AF37]/40 p-4 space-y-3.5 font-mono tabular-nums shadow-inner">
      {/* Top Chart Telemetry Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <CandlestickChart className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-black text-white text-sm">
            {pair} [{timeframe}] Live Candles
          </span>
          <span
            className={`px-2.5 py-0.5 rounded bg-slate-900 border font-black inline-flex items-center gap-1 ${
              lastCandleBull
                ? 'border-emerald-500/50 text-[#00C261]'
                : 'border-red-500/50 text-red-400'
            }`}
          >
            <span>{lastCandleBull ? '▲' : '▼'}</span>
            <span className="text-white">@ {livePrice.toFixed(decimals)}</span>
          </span>
          <span
            className={`inline-flex items-center gap-0.5 font-bold ${
              change24hPct >= 0 ? 'text-[#00C261]' : 'text-red-400'
            }`}
          >
            {change24hPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change24hPct >= 0 ? `+${change24hPct.toFixed(2)}%` : `${change24hPct.toFixed(2)}%`}
          </span>
        </div>

        {/* Interactive Indicator Toggles & Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-300 flex-wrap">
          {inspectedCandle && (
            <div className="flex items-center gap-2 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[10px]">
              <span>O:{inspectedCandle.open.toFixed(decimals)}</span>
              <span className="text-emerald-400">H:{inspectedCandle.high.toFixed(decimals)}</span>
              <span className="text-red-400">L:{inspectedCandle.low.toFixed(decimals)}</span>
              <span className="text-white font-bold">C:{inspectedCandle.close.toFixed(decimals)}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowEma20(!showEma20)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
              showEma20
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            20 EMA ({ema20.toFixed(decimals)})
          </button>
          <button
            type="button"
            onClick={() => setShowEma50(!showEma50)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
              showEma50
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            50 EMA ({ema50.toFixed(decimals)})
          </button>
          <button
            type="button"
            onClick={() => setShowValueZone(!showValueZone)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
              showValueZone
                ? 'bg-emerald-950/80 text-[#00C261] border-[#00C261]/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="20/50 EMA Dynamic Retracement Cloud"
          >
            Value Cloud
          </button>
          {advisoryEntryPrice && advisoryEntryPrice > 0 && (
            <button
              type="button"
              onClick={() => setShowAdvisoryLine(!showAdvisoryLine)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                showAdvisoryLine
                  ? 'bg-yellow-950/80 text-[#D4AF37] border-[#D4AF37]/60'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              1H Adv @ {advisoryEntryPrice.toFixed(decimals)}
            </button>
          )}
        </div>
      </div>

      {/* SVG Interactive Candlestick Chart Canvas */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#040811] border border-slate-800/90">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-[240px] sm:h-[290px] select-none block"
        >
          {/* Horizontal Grid Lines */}
          {[0.15, 0.38, 0.62, 0.85].map((frac, idx) => {
            const y = padTop + frac * plotH;
            const pVal = maxP - frac * totalRange;
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke="rgba(148,163,184,0.10)"
                  strokeDasharray="3 3"
                />
                <text
                  x={svgWidth - padRight + 6}
                  y={y + 3}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {pVal.toFixed(decimals)}
                </text>
              </g>
            );
          })}

          {/* 20/50 EMA Dynamic Value Zone Cloud (Pullback Retracement Zone) */}
          {showValueZone && valueZonePolygon && (
            <polygon
              points={valueZonePolygon}
              fill="rgba(212,175,55,0.08)"
              stroke="none"
            />
          )}

          {/* 50 EMA Baseline Curve */}
          {showEma50 && ema50Points && (
            <polyline
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.6"
              strokeOpacity="0.85"
              points={ema50Points}
            />
          )}

          {/* 20 EMA Dynamic Curve */}
          {showEma20 && ema20Points && (
            <polyline
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2"
              points={ema20Points}
            />
          )}

          {/* 1H Advisory Pullback Limit Entry Ray */}
          {showAdvisoryLine && advisoryEntryPrice && advisoryEntryPrice > 0 && (
            <g key="advisory-entry-line">
              <line
                x1={padLeft}
                y1={priceToY(advisoryEntryPrice)}
                x2={svgWidth - padRight}
                y2={priceToY(advisoryEntryPrice)}
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <rect
                x={svgWidth - padRight + 3}
                y={priceToY(advisoryEntryPrice) - 8}
                width={padRight - 6}
                height={16}
                rx={4}
                fill="#271E05"
                stroke="#D4AF37"
                strokeWidth="0.8"
              />
              <text
                x={svgWidth - padRight + 7}
                y={priceToY(advisoryEntryPrice) + 3}
                fill="#D4AF37"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                ADV {advisoryEntryPrice.toFixed(decimals)}
              </text>
            </g>
          )}

          {/* Target & Stop Loss Horizontal Price Lines */}
          {[
            { label: 'TP2', val: tp2, color: '#00C261', bg: '#052E16' },
            { label: 'TP1', val: tp1, color: '#22D3EE', bg: '#083344' },
            { label: 'SL', val: stopLoss, color: '#EF4444', bg: '#450A0A' },
          ].map((lvl) => {
            const y = priceToY(lvl.val);
            return (
              <g key={lvl.label}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={svgWidth - padRight}
                  y2={y}
                  stroke={lvl.color}
                  strokeWidth="1.2"
                  strokeDasharray="5 4"
                  strokeOpacity="0.85"
                />
                <rect
                  x={svgWidth - padRight + 3}
                  y={y - 8}
                  width={padRight - 6}
                  height={16}
                  rx={4}
                  fill={lvl.bg}
                  stroke={lvl.color}
                  strokeWidth="0.8"
                />
                <text
                  x={svgWidth - padRight + 7}
                  y={y + 3}
                  fill={lvl.color}
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {lvl.label} {lvl.val.toFixed(decimals)}
                </text>
              </g>
            );
          })}

          {/* Candlesticks */}
          {visibleCandles.map((c, idx) => {
            const x = indexToX(idx);
            const barW = Math.max(3, Math.min(11, (plotW / visibleCandles.length) * 0.62));
            const bull = c.close >= c.open;
            const color = bull ? '#00C261' : '#EF4444';
            const yHigh = priceToY(c.high);
            const yLow = priceToY(c.low);
            const yOpen = priceToY(c.open);
            const yClose = priceToY(c.close);
            const bodyTop = Math.min(yOpen, yClose);
            const bodyH = Math.max(2, Math.abs(yClose - yOpen));
            const isLast = idx === visibleCandles.length - 1;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-crosshair"
              >
                {/* Wick */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={color}
                  strokeWidth={isLast ? '2' : '1.4'}
                />
                {/* Body */}
                <rect
                  x={x - barW / 2}
                  y={bodyTop}
                  width={barW}
                  height={bodyH}
                  rx={1.2}
                  fill={color}
                  stroke={isLast ? '#FACC15' : 'none'}
                  strokeWidth={isLast ? '1' : '0'}
                />
              </g>
            );
          })}

          {/* Live Current Price Line & Highlighted Axis Tag */}
          {(() => {
            const yLive = priceToY(livePrice);
            return (
              <g>
                <line
                  x1={padLeft}
                  y1={yLive}
                  x2={svgWidth - padRight}
                  y2={yLive}
                  stroke="#D4AF37"
                  strokeWidth="1.6"
                />
                <rect
                  x={svgWidth - padRight + 2}
                  y={yLive - 9}
                  width={padRight - 4}
                  height={18}
                  rx={4}
                  fill="#D4AF37"
                />
                <text
                  x={svgWidth - padRight + 6}
                  y={yLive + 3.5}
                  fill="#000000"
                  fontSize="10"
                  fontWeight="900"
                  fontFamily="monospace"
                >
                  {livePrice.toFixed(decimals)}
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Floating Top-Left Live Signal Stamp */}
        <div className="absolute top-2.5 left-3 flex items-center gap-2 pointer-events-none">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black shadow ${
              isBuy ? 'bg-[#00C261] text-black' : 'bg-red-600 text-white'
            }`}
          >
            {isBuy ? 'BUY STRUCTURE ▲' : 'SELL STRUCTURE ▼'}
          </span>
          <span className="px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] text-slate-300 flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#00C261]" />
            <span>{isLockedToCustom ? 'Custom Candle Simulation' : '24/7 Live Feed Active'}</span>
          </span>
        </div>
      </div>

      {/* Interactive Candle Price Controls (Ultra-Fine Sub-Pip & Pip Ticks Update SL, TP, BUY/SELL & Cards Live) */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-bold mr-1">Move Candle Tick:</span>
          <button
            type="button"
            onClick={() => handleNudge(-pipStep10)}
            className="px-2 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 font-bold flex items-center gap-0.5 transition active:scale-95"
          >
            <Minus className="w-3 h-3" />
            <span>-10p</span>
          </button>
          <button
            type="button"
            onClick={() => handleNudge(-pipStep1)}
            className="px-2 py-1.5 rounded-lg bg-red-950/45 hover:bg-red-900 text-red-300 border border-red-500/35 font-bold transition active:scale-95"
          >
            -1p
          </button>
          <button
            type="button"
            onClick={() => handleNudge(-microStep)}
            className="px-2 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900 text-red-200 border border-red-500/25 font-bold transition active:scale-95"
          >
            -0.2p
          </button>

          <input
            type="number"
            step="any"
            value={livePrice}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v) && v > 0) onCandlePriceChange(v);
            }}
            aria-label={`Live candle price for ${pair}`}
            className="w-28 bg-slate-950 border border-[#D4AF37]/60 rounded-lg px-2.5 py-1.5 text-white font-black text-center text-xs focus:border-[#D4AF37] outline-none"
          />

          <button
            type="button"
            onClick={() => handleNudge(microStep)}
            className="px-2 py-1.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/25 font-bold transition active:scale-95"
          >
            +0.2p
          </button>
          <button
            type="button"
            onClick={() => handleNudge(pipStep1)}
            className="px-2 py-1.5 rounded-lg bg-emerald-950/45 hover:bg-emerald-900 text-[#00C261] border border-emerald-500/35 font-bold transition active:scale-95"
          >
            +1p
          </button>
          <button
            type="button"
            onClick={() => handleNudge(pipStep10)}
            className="px-2 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-[#00C261] border border-emerald-500/40 font-bold flex items-center gap-0.5 transition active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>+10p</span>
          </button>
        </div>

        <div className="flex items-center justify-between xl:justify-end gap-2">
          <span className="text-[11px] text-slate-400">
            Instantaneous sync across SL, TP, BUY/SELL & all cards
          </span>
          {isLockedToCustom && (
            <button
              type="button"
              onClick={onResetToLiveStream}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-[#00C261] border border-[#00C261]/50 font-bold flex items-center gap-1 transition shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resume 24/7 Live Feed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
