import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Maximize2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Target
} from 'lucide-react';

export interface CandleData {
  id: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  label?: string;
  annotation?: string;
  annotationType?: 'entry' | 'sl' | 'tp' | 'warning' | 'info' | 'sweep';
}

export interface CandlestickVisualizerProps {
  title?: string;
  subtitle?: string;
  candles: CandleData[];
  trendType?: 'bullish' | 'bearish' | 'reversal' | 'range';
  supportLevel?: number;
  resistanceLevel?: number;
  entryLevel?: number;
  slLevel?: number;
  tpLevel?: number;
  fvgZone?: { top: number; bottom: number; label: string };
  trendline?: { startIndex: number; startPrice: number; endIndex: number; endPrice: number; label?: string };
  fibLevels?: { level: number; price: number; label: string }[];
  showControls?: boolean;
}

export const CandlestickVisualizer: React.FC<CandlestickVisualizerProps> = ({
  title,
  subtitle,
  candles,
  trendType = 'bullish',
  supportLevel,
  resistanceLevel,
  entryLevel,
  slLevel,
  tpLevel,
  fvgZone,
  trendline,
  fibLevels,
  showControls = true,
}) => {
  const [activeCandle, setActiveCandle] = useState<CandleData | null>(null);
  const [showWicks, setShowWicks] = useState(true);
  const [showLevels, setShowLevels] = useState(true);

  if (!candles || candles.length === 0) return null;

  // Calculate coordinate boundaries
  const allPrices: number[] = [];
  candles.forEach((c) => {
    allPrices.push(c.high, c.low, c.open, c.close);
  });
  if (supportLevel !== undefined) allPrices.push(supportLevel);
  if (resistanceLevel !== undefined) allPrices.push(resistanceLevel);
  if (entryLevel !== undefined) allPrices.push(entryLevel);
  if (slLevel !== undefined) allPrices.push(slLevel);
  if (tpLevel !== undefined) allPrices.push(tpLevel);
  if (fvgZone) allPrices.push(fvgZone.top, fvgZone.bottom);
  if (fibLevels) fibLevels.forEach((f) => allPrices.push(f.price));

  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const pricePadding = (maxPrice - minPrice) * 0.12 || 0.0020;
  const chartMin = minPrice - pricePadding;
  const chartMax = maxPrice + pricePadding;
  const priceRange = chartMax - chartMin || 1;

  // SVG dimensions
  const svgWidth = 680;
  const svgHeight = 280;
  const paddingLeft = 40;
  const paddingRight = 75;
  const paddingTop = 25;
  const paddingBottom = 40;

  const drawableWidth = svgWidth - paddingLeft - paddingRight;
  const drawableHeight = svgHeight - paddingTop - paddingBottom;

  const getY = (price: number) => {
    const norm = (price - chartMin) / priceRange;
    return paddingTop + drawableHeight - norm * drawableHeight;
  };

  const candleSpacing = drawableWidth / (candles.length + 1);
  const candleBodyWidth = Math.max(8, Math.min(26, candleSpacing * 0.65));

  return (
    <div className="rounded-2xl bg-[#080D1A] border border-[#D4AF37]/30 overflow-hidden shadow-2xl">
      {/* Visualizer Header */}
      {(title || subtitle) && (
        <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {title || 'Institutional Candlestick Blueprint'}
              </h4>
              {trendType && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    trendType === 'bullish'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : trendType === 'bearish'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : trendType === 'reversal'
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  {trendType.toUpperCase()}
                </span>
              )}
            </div>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLevels(!showLevels)}
                className={`text-[10px] font-mono px-2 py-1 rounded transition border ${
                  showLevels
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Levels {showLevels ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                onClick={() => setShowWicks(!showWicks)}
                className={`text-[10px] font-mono px-2 py-1 rounded transition border ${
                  showWicks
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Wicks {showWicks ? 'ON' : 'OFF'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SVG Candlestick Viewport */}
      <div className="relative w-full overflow-x-auto bg-[#070B14] p-2 select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[540px] h-auto block"
        >
          <defs>
            <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E676" />
              <stop offset="100%" stopColor="#00A854" />
            </linearGradient>
            <linearGradient id="bearGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5252" />
              <stop offset="100%" stopColor="#D50000" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F3E5AB" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="fvgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.10" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={svgWidth - paddingRight}
            y2={paddingTop}
            stroke="#1E293B"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + drawableHeight * 0.25}
            x2={svgWidth - paddingRight}
            y2={paddingTop + drawableHeight * 0.25}
            stroke="#1E293B"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + drawableHeight * 0.5}
            x2={svgWidth - paddingRight}
            y2={paddingTop + drawableHeight * 0.5}
            stroke="#1E293B"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + drawableHeight * 0.75}
            x2={svgWidth - paddingRight}
            y2={paddingTop + drawableHeight * 0.75}
            stroke="#1E293B"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + drawableHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + drawableHeight}
            stroke="#334155"
          />

          {/* Fair Value Gap Zone */}
          {fvgZone && showLevels && (
            <g>
              <rect
                x={paddingLeft + candleSpacing * 1.5}
                y={getY(fvgZone.top)}
                width={drawableWidth - candleSpacing * 1.5}
                height={Math.max(4, Math.abs(getY(fvgZone.bottom) - getY(fvgZone.top)))}
                fill="url(#fvgGrad)"
                stroke="#60A5FA"
                strokeWidth="1"
                strokeDasharray="3 3"
                rx="3"
              />
              <text
                x={svgWidth - paddingRight - 8}
                y={getY((fvgZone.top + fvgZone.bottom) / 2) + 3}
                fill="#93C5FD"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="end"
              >
                {fvgZone.label || 'FVG Imbalance Zone'}
              </text>
            </g>
          )}

          {/* Fibonacci Levels */}
          {fibLevels && showLevels && fibLevels.map((fib, idx) => {
            const y = getY(fib.price);
            return (
              <g key={`fib-${idx}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#D4AF37"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity={fib.level === 0.618 || fib.level === 0.5 ? 0.9 : 0.5}
                />
                <text
                  x={svgWidth - paddingRight + 6}
                  y={y + 3}
                  fill="#F3E5AB"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {fib.label}
                </text>
              </g>
            );
          })}

          {/* Support Level Line */}
          {supportLevel !== undefined && showLevels && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(supportLevel)}
                x2={svgWidth - paddingRight}
                y2={getY(supportLevel)}
                stroke="#00E676"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <rect
                x={svgWidth - paddingRight + 4}
                y={getY(supportLevel) - 8}
                width={65}
                height={16}
                rx="4"
                fill="#052E16"
                stroke="#00E676"
                strokeWidth="1"
              />
              <text
                x={svgWidth - paddingRight + 8}
                y={getY(supportLevel) + 3}
                fill="#86EFAC"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                SUP {supportLevel.toFixed(4)}
              </text>
            </g>
          )}

          {/* Resistance Level Line */}
          {resistanceLevel !== undefined && showLevels && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(resistanceLevel)}
                x2={svgWidth - paddingRight}
                y2={getY(resistanceLevel)}
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              <rect
                x={svgWidth - paddingRight + 4}
                y={getY(resistanceLevel) - 8}
                width={65}
                height={16}
                rx="4"
                fill="#450A0A"
                stroke="#EF4444"
                strokeWidth="1"
              />
              <text
                x={svgWidth - paddingRight + 8}
                y={getY(resistanceLevel) + 3}
                fill="#FCA5A5"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                RES {resistanceLevel.toFixed(4)}
              </text>
            </g>
          )}

          {/* Trendline */}
          {trendline && (
            <g>
              {(() => {
                const x1 = paddingLeft + (trendline.startIndex + 0.5) * candleSpacing;
                const y1 = getY(trendline.startPrice);
                const x2 = paddingLeft + (trendline.endIndex + 0.5) * candleSpacing;
                const y2 = getY(trendline.endPrice);
                return (
                  <>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#FACC15"
                      strokeWidth="2"
                    />
                    <circle cx={x1} cy={y1} r="3.5" fill="#FACC15" />
                    <circle cx={x2} cy={y2} r="3.5" fill="#FACC15" />
                    {trendline.label && (
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 8}
                        fill="#FEF08A"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {trendline.label}
                      </text>
                    )}
                  </>
                );
              })()}
            </g>
          )}

          {/* Entry Level Line */}
          {entryLevel !== undefined && showLevels && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(entryLevel)}
                x2={svgWidth - paddingRight}
                y2={getY(entryLevel)}
                stroke="#D4AF37"
                strokeWidth="1.8"
              />
              <rect
                x={svgWidth - paddingRight + 4}
                y={getY(entryLevel) - 8}
                width={68}
                height={16}
                rx="4"
                fill="#422006"
                stroke="#D4AF37"
                strokeWidth="1"
              />
              <text
                x={svgWidth - paddingRight + 8}
                y={getY(entryLevel) + 3}
                fill="#FEF08A"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                ENTRY {entryLevel.toFixed(4)}
              </text>
            </g>
          )}

          {/* Stop Loss Line */}
          {slLevel !== undefined && showLevels && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(slLevel)}
                x2={svgWidth - paddingRight}
                y2={getY(slLevel)}
                stroke="#DC2626"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <rect
                x={svgWidth - paddingRight + 4}
                y={getY(slLevel) - 8}
                width={65}
                height={16}
                rx="4"
                fill="#991B1B"
                stroke="#EF4444"
                strokeWidth="1"
              />
              <text
                x={svgWidth - paddingRight + 8}
                y={getY(slLevel) + 3}
                fill="#FEE2E2"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                SL {slLevel.toFixed(4)}
              </text>
            </g>
          )}

          {/* Take Profit Line */}
          {tpLevel !== undefined && showLevels && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(tpLevel)}
                x2={svgWidth - paddingRight}
                y2={getY(tpLevel)}
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <rect
                x={svgWidth - paddingRight + 4}
                y={getY(tpLevel) - 8}
                width={65}
                height={16}
                rx="4"
                fill="#065F46"
                stroke="#34D399"
                strokeWidth="1"
              />
              <text
                x={svgWidth - paddingRight + 8}
                y={getY(tpLevel) + 3}
                fill="#D1FAE5"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                TP {tpLevel.toFixed(4)}
              </text>
            </g>
          )}

          {/* Render Candlesticks */}
          {candles.map((candle, idx) => {
            const isBullish = candle.close >= candle.open;
            const xCenter = paddingLeft + (idx + 0.5) * candleSpacing;
            const yHigh = getY(candle.high);
            const yLow = getY(candle.low);
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));
            const isHovered = activeCandle?.id === candle.id;

            return (
              <g
                key={candle.id}
                className="cursor-pointer transition-transform hover:opacity-95"
                onMouseEnter={() => setActiveCandle(candle)}
                onClick={() => setActiveCandle(candle)}
              >
                {/* Wicks */}
                {showWicks && (
                  <line
                    x1={xCenter}
                    y1={yHigh}
                    x2={xCenter}
                    y2={yLow}
                    stroke={isBullish ? '#00E676' : '#FF5252'}
                    strokeWidth={isHovered ? '2' : '1.5'}
                    opacity={isHovered ? 1 : 0.85}
                  />
                )}

                {/* Candle Body */}
                <rect
                  x={xCenter - candleBodyWidth / 2}
                  y={bodyTop}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  fill={isBullish ? 'url(#bullGrad)' : 'url(#bearGrad)'}
                  stroke={isHovered ? '#FFFFFF' : isBullish ? '#00FF88' : '#FF6666'}
                  strokeWidth={isHovered ? 1.5 : 1}
                  rx="1.5"
                  filter={isHovered ? 'drop-shadow(0px 0px 4px rgba(212,175,55,0.8))' : undefined}
                />

                {/* Optional Top Label */}
                {candle.label && (
                  <text
                    x={xCenter}
                    y={Math.min(yHigh, bodyTop) - 8}
                    fill={isBullish ? '#86EFAC' : '#FCA5A5'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {candle.label}
                  </text>
                )}

                {/* Bottom Index Label */}
                <text
                  x={xCenter}
                  y={paddingTop + drawableHeight + 16}
                  fill="#64748B"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  C{idx + 1}
                </text>

                {/* Specific Action Annotations */}
                {candle.annotation && (
                  <g>
                    <circle
                      cx={xCenter}
                      cy={isBullish ? yLow + 8 : yHigh - 8}
                      r="4"
                      fill={
                        candle.annotationType === 'entry'
                          ? '#D4AF37'
                          : candle.annotationType === 'sweep'
                          ? '#EF4444'
                          : candle.annotationType === 'tp'
                          ? '#00E676'
                          : '#38BDF8'
                      }
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Price scale on right edge info pill */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
          <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
            High: {chartMax.toFixed(4)}
          </span>
          <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
            Low: {chartMin.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Active Candle Inspector / Explanation Bar */}
      <div className="px-4 py-3 bg-[#0B101D] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {activeCandle ? (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-sm ${
                  activeCandle.close >= activeCandle.open ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <span className="font-bold text-white font-mono">
                {activeCandle.label || `Candle ${activeCandle.id}`}
              </span>
              <span
                className={`text-[11px] font-mono font-bold ${
                  activeCandle.close >= activeCandle.open ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {activeCandle.close >= activeCandle.open ? 'BULLISH' : 'BEARISH'}
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
              <span>O: <strong className="text-white">{activeCandle.open.toFixed(4)}</strong></span>
              <span>H: <strong className="text-white">{activeCandle.high.toFixed(4)}</strong></span>
              <span>L: <strong className="text-white">{activeCandle.low.toFixed(4)}</strong></span>
              <span>C: <strong className="text-white">{activeCandle.close.toFixed(4)}</strong></span>
              <span>
                Move:{' '}
                <strong
                  className={
                    activeCandle.close >= activeCandle.open ? 'text-emerald-400' : 'text-red-400'
                  }
                >
                  {((activeCandle.close - activeCandle.open) * 10000).toFixed(1)} pips
                </strong>
              </span>
            </div>

            {activeCandle.annotation && (
              <span className="text-[11px] font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                {activeCandle.annotation}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
            <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Hover over or tap any candlestick to inspect OHLC coordinates, pip delta, and institutional context.</span>
          </div>
        )}

        <div className="text-[10px] font-mono text-slate-500">
          Green = Institutional Buying | Red = Institutional Selling
        </div>
      </div>
    </div>
  );
};
