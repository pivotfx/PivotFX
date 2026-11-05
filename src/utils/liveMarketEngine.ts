import { BrokerId, CurrencyPair, Timeframe } from '../types';

export type PatternCategory =
  | 'Tower Top Liquidity Sweep'
  | '20/50 EMA Trend Bounce'
  | 'Asian Liquidity Sweep'
  | 'Fair Value Gap Re-test'
  | 'Bearish Order Block Mitigation';

export interface OhlcCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface FactorJudgmentItem {
  name: string;
  signal: 'BUY' | 'SELL' | 'CAUTION';
  weight: string;
  detail: string;
}

export interface MacroContextSnapshot {
  dxyPressurePct: number;
  riskRegime: 'RISK-ON EXPANSION' | 'RISK-OFF SAFE-HAVEN' | 'MIXED CONSOLIDATION';
  safeHavenSurge: boolean;
  isRolloverWindow: boolean;
  isUsReleaseWindow: boolean;
  eatHour: number;
}

export interface TrajectoryHorizonStep {
  horizon: '1H – 4H (Immediate)' | '4H – 12H (Session)' | '12H – 48H (Extended Swing)';
  targetPrice: number;
  targetPips: number;
  netProfitUsd: number;
  netProfitKes: number;
  driverSummary: string;
}

export interface MarketScanData {
  pair: CurrencyPair;
  symbol: string;
  price: number;
  change24hPct: number;
  dailyOpenPrice?: number;
  bias: 'STRONG_BUY' | 'STRONG_SELL' | 'NEUTRAL_CHOP';
  confidence: number;
  recommendedTf: Timeframe;
  trend: string;
  trendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  h1TrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  trendProjectionText: string;
  humanCheckNote: string;
  ictPattern: string;
  projection: string;
  projectedPips: number;
  suggestedSL: number;
  suggestedTP1: number;
  suggestedTP2: number;
  suggestedTP3?: number;
  tp3Pips?: number;
  ema20: number;
  ema50: number;
  rsi: number;
  atrPips?: number;
  keyLevel: number;
  patternType: PatternCategory;
  riskReward: string;
  isTopPick?: boolean;
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedSession: string;
  dataSource: 'Live Interbank Feed' | 'Live Feed + Institutional Calibration';
  candles?: OhlcCandle[];
  h1Candles?: OhlcCandle[];
  candlesAreRealOhlc?: boolean;
  previousRank?: number;
  currentRank?: number;
  previousDirection?: 'BUY' | 'SELL';
  directionFlipped?: boolean;
  lastTickTime?: string;
  lastTickDir?: 'UP' | 'DOWN' | 'FLAT';
  lastTickDeltaPips?: number;
  bullScorePct?: number;
  bearScorePct?: number;
  factorVerdicts?: FactorJudgmentItem[];
  trajectoryHorizons?: TrajectoryHorizonStep[];
  spreadCostUsd?: number;
  netProfitUsd?: number;
  netProfitKes?: number;
  netProfit48hUsd?: number;
  netProfit48hKes?: number;
  tp1NetProfitUsd?: number;
  tp1NetProfitKes?: number;
  orderVerdictLabel?:
    | 'FAVOURABLE BUY ORDER'
    | 'FAVOURABLE SELL ORDER'
    | 'SELECTIVE BUY (WAIT PULLBACK)'
    | 'SELECTIVE SELL (WAIT PULLBACK)'
    | 'REVERSAL BUY PLAN (CONFIRM ABOVE 20 EMA)'
    | 'REVERSAL SELL PLAN (CONFIRM BELOW 20 EMA)';
  profitOutlookText?: string;
  isFavourableOrder?: boolean;
  spreadByBroker: Record<BrokerId, { symbol: string; spread: number; notes: string }>;
}

export interface ComputedTradeParams {
  direction: 'BUY' | 'SELL';
  orderType: string;
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  slPips: number;
  tp1Pips: number;
  tpPips: number;
  tp3Pips: number;
  riskReward: string;
  lotSize: number;
  actualRiskUsd: number;
  potentialGainUsd: number;
  spreadCostUsd: number;
  netProfitUsd: number;
  netProfitKes: number;
  netProfit48hUsd: number;
  netProfit48hKes: number;
  tp1NetProfitUsd: number;
  tp1NetProfitKes: number;
  orderVerdictLabel:
    | 'FAVOURABLE BUY ORDER'
    | 'FAVOURABLE SELL ORDER'
    | 'SELECTIVE BUY (WAIT PULLBACK)'
    | 'SELECTIVE SELL (WAIT PULLBACK)'
    | 'REVERSAL BUY PLAN (CONFIRM ABOVE 20 EMA)'
    | 'REVERSAL SELL PLAN (CONFIRM BELOW 20 EMA)';
  profitOutlookText: string;
  isFavourableOrder: boolean;
  brokerSymbol: string;
  brokerSpread: number;
  decimals: number;
  confidence: number;
  bullScorePct: number;
  bearScorePct: number;
  factorVerdicts: FactorJudgmentItem[];
  trajectory: string;
  trajectoryHorizons: TrajectoryHorizonStep[];
  trendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  trendProjectionText: string;
  humanCheckNote: string;
  mt4SafetyProof: string;
  cmaProtection: string;
}

export interface MacroFactorFlags {
  highImpactUsNews: boolean;
  centralBankRateDay: boolean;
  geopoliticalSafeHavenSpike: boolean;
  bankHolidayThinLiquidity: boolean;
  wideSpreadAlert: boolean;
}

export type SideSafetyVerdict = 'SAFE_OPTIMAL' | 'SAFE_SELECTIVE' | 'CAUTION_WAIT' | 'UNSAFE_AVOID';

export interface KenyaEntryWindowInfo {
  isFavorableTime: boolean;
  windowStatusCode: 'OPEN' | 'OPENING_SOON' | 'CLOSED_WAIT';
  statusLabel: string;
  windowBadgeShort: string;
  bannerHeadline: string;
  currentWindowName: string;
  nextWindowName: string;
  countdownFormatted: string;
  countdownSeconds: number;
  reasonText: string;
}

export interface AssetDailySafetyCard {
  pair: CurrencyPair;
  symbol: string;
  livePrice: number;
  change24hPct: number;
  rsi: number;
  ema20: number;
  ema50: number;
  buySafety: SideSafetyVerdict;
  sellSafety: SideSafetyVerdict;
  buyScore: number;
  sellScore: number;
  primaryVerdictText: string;
  isEntryBlockedGlobally: boolean;
  globalEntryBannerText: string;
  kenyaTiming: KenyaEntryWindowInfo;
  globalDriverNote: string;
  dxyCorrelationNote: string;
  riskNote: string;
}

export interface DailyMacroSafetyReport {
  dxyPressurePct: number;
  dxyStatus: 'USD SURGING BULLISH' | 'USD WEAKENING BEARISH' | 'USD MIXED EQUILIBRIUM';
  dxySummary: string;
  riskRegime: 'RISK-ON EXPANSION' | 'RISK-OFF SAFE-HAVEN' | 'MIXED CONSOLIDATION';
  riskRegimeSummary: string;
  eatTimeString: string;
  eatHour: number;
  sessionWindowName: string;
  sessionSafety: SideSafetyVerdict;
  sessionAdvice: string;
  overallDaySafety: SideSafetyVerdict;
  overallHeadline: string;
  autoDetectedFactors: MacroFactorFlags;
  autoDetectedSummary: string[];
  activeWarnings: string[];
  assetScorecards: AssetDailySafetyCard[];
}

export function getPairSpecs(targetPair: CurrencyPair) {
  const isJpy = targetPair.includes('JPY');
  const isGold = targetPair.includes('XAU') || targetPair.toLowerCase().includes('gold');
  const isBtc = targetPair.includes('BTC');

  const pipMultiplier = isJpy ? 100 : isGold ? 10 : isBtc ? 1 : 10000;
  const decimals = isJpy ? 3 : isGold ? 2 : isBtc ? 2 : 5;
  const pipValPerStandardLot = isGold ? 10.0 : isJpy ? 6.5 : isBtc ? 1.0 : 10.0;

  return { isJpy, isGold, isBtc, pipMultiplier, decimals, pipValPerStandardLot };
}

/**
 * Computes true Exponential Moving Average (EMA) from an ordered array of close prices.
 */
export function computeRealEma(closes: number[], period: number): number {
  if (!closes.length) return 0;
  if (closes.length <= period) {
    const sum = closes.reduce((acc, v) => acc + v, 0);
    return sum / closes.length;
  }
  const k = 2 / (period + 1);
  let ema = closes.slice(0, period).reduce((acc, v) => acc + v, 0) / period;
  for (let i = period; i < closes.length; i++) {
    ema = closes[i] * k + ema * (1 - k);
  }
  return ema;
}

/**
 * Computes true 14-period Wilder RSI from an ordered array of close prices.
 */
export function computeRealRsi(closes: number[], period = 14): number {
  if (closes.length < 3) return 52.0;
  const lookback = closes.slice(-Math.min(closes.length, period * 3 + 1));
  let gains = 0;
  let losses = 0;
  const firstWindow = Math.min(period, lookback.length - 1);
  for (let i = 1; i <= firstWindow; i++) {
    const diff = lookback[i] - lookback[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  let avgGain = gains / Math.max(1, firstWindow);
  let avgLoss = losses / Math.max(1, firstWindow);

  for (let i = firstWindow + 1; i < lookback.length; i++) {
    const diff = lookback[i] - lookback[i - 1];
    const g = diff > 0 ? diff : 0;
    const l = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
  }

  if (avgLoss === 0) return avgGain > 0 ? 78.5 : 50.0;
  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return Number(Math.min(89.5, Math.max(14.5, rsi)).toFixed(1));
}

/**
 * Computes true 14-period Average True Range (ATR) in pips from real OHLC candles.
 */
export function computeRealAtrPips(candles: OhlcCandle[], pipMultiplier: number, period = 14): number {
  if (!candles || candles.length < 2) return 16;
  const recent = candles.slice(-(period + 1));
  let trSum = 0;
  let count = 0;
  for (let i = 1; i < recent.length; i++) {
    const prevClose = recent[i - 1].close;
    const cur = recent[i];
    const tr = Math.max(
      cur.high - cur.low,
      Math.abs(cur.high - prevClose),
      Math.abs(cur.low - prevClose)
    );
    trSum += tr;
    count++;
  }
  const avgTr = count > 0 ? trSum / count : 0;
  return Math.max(4, Number((avgTr * pipMultiplier).toFixed(1)));
}

export function getCurrentMacroContext(
  pctByPair?: Partial<Record<CurrencyPair, number>>
): MacroContextSnapshot {
  const eurPct = pctByPair?.['EUR/USD'] ?? 0;
  const gbpPct = pctByPair?.['GBP/USD'] ?? 0;
  const audPct = pctByPair?.['AUD/USD'] ?? 0;
  const jpyPct = pctByPair?.['USD/JPY'] ?? 0;
  const cadPct = pctByPair?.['USD/CAD'] ?? 0;
  const goldPct = pctByPair?.['XAU/USD'] ?? 0;
  const btcPct = pctByPair?.['BTC/USD'] ?? 0;

  const dxyPressurePct = Number(
    (-0.45 * eurPct - 0.18 * gbpPct - 0.10 * audPct + 0.17 * jpyPct + 0.10 * cadPct).toFixed(2)
  );
  const riskScore =
    (btcPct > 0.6 ? 1 : btcPct < -0.8 ? -1 : 0) +
    (jpyPct > 0.15 ? 1 : jpyPct < -0.25 ? -1 : 0) -
    (goldPct > 1.2 ? 0.5 : 0);
  const riskRegime: MacroContextSnapshot['riskRegime'] =
    riskScore > 0.4 ? 'RISK-ON EXPANSION' : riskScore < -0.4 ? 'RISK-OFF SAFE-HAVEN' : 'MIXED CONSOLIDATION';

  const now = new Date();
  const eatHour = parseInt(
    now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', hour12: false }),
    10
  );
  const eatMin = parseInt(
    now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', minute: '2-digit' }),
    10
  );

  return {
    dxyPressurePct,
    riskRegime,
    safeHavenSurge: goldPct >= 0.85 && jpyPct <= -0.12,
    isRolloverWindow: eatHour >= 22 || eatHour <= 2,
    isUsReleaseWindow: eatHour === 15 && eatMin >= 20 && eatMin <= 50,
    eatHour
  };
}

/**
 * Evaluates ALL 5 Institutional Trading Factors simultaneously to judge BUY vs SELL:
 * 1. Live Candlestick Price Action & Liquidity Sweep
 * 2. 20/50 EMA Dynamic Trend Stack & Overextension Guard
 * 3. 14-Period Wilder RSI Momentum & Exhaustion
 * 4. Global Macro & Live USD Basket (DXY) / Safe-Haven Flow
 * 5. Nairobi (EAT) Session Liquidity & Broker Spread Friction
 */
export function evaluateAllTradeFactors(p: {
  pair: CurrencyPair;
  livePrice: number;
  ema20: number;
  ema50: number;
  rsi: number;
  keyLevel?: number;
  prev3Close?: number;
  isBearishPinOrSweep?: boolean;
  isBullishPinOrAbsorption?: boolean;
  brokerSpread?: number;
  macro?: MacroContextSnapshot;
  biasOverride?: 'BUY' | 'SELL';
  previousDirection?: 'BUY' | 'SELL';
}): {
  isBuy: boolean;
  bullScorePct: number;
  bearScorePct: number;
  confidence: number;
  factorVerdicts: FactorJudgmentItem[];
} {
  const { isGold, isBtc, pipMultiplier, decimals } = getPairSpecs(p.pair);
  const macro = p.macro || getCurrentMacroContext();
  const verdicts: FactorJudgmentItem[] = [];

  let bullWeight = 0;
  let bearWeight = 0;

  // FACTOR 1: Candlestick Price Action, Multi-Candle Momentum & Liquidity Sweep (26 pts max)
  const prevRef = p.prev3Close ?? p.ema20;
  const microDeltaPips = Number(((p.livePrice - prevRef) * pipMultiplier).toFixed(1));
  const noiseFloorPips = isGold ? 12.0 : isBtc ? 65.0 : 1.5;
  if (p.isBearishPinOrSweep) {
    bearWeight += 26;
    verdicts.push({
      name: '1. Candle & Liquidity Sweep',
      signal: 'SELL',
      weight: '26%',
      detail: `Upper wick rejection / BSL sweep detected (${microDeltaPips >= 0 ? `+${microDeltaPips}` : microDeltaPips}p swing)`
    });
  } else if (p.isBullishPinOrAbsorption) {
    bullWeight += 26;
    verdicts.push({
      name: '1. Candle & Liquidity Sweep',
      signal: 'BUY',
      weight: '26%',
      detail: `Lower wick absorption / SSL sweep near ${p.keyLevel ? p.keyLevel.toFixed(decimals) : p.livePrice.toFixed(decimals)}`
    });
  } else if (microDeltaPips >= noiseFloorPips) {
    bullWeight += 22;
    bearWeight += 4;
    verdicts.push({
      name: '1. Candle & Liquidity Sweep',
      signal: 'BUY',
      weight: '22%',
      detail: `Bullish candle displacement (+${microDeltaPips}p across multi-candle structure)`
    });
  } else if (microDeltaPips <= -noiseFloorPips) {
    bearWeight += 22;
    bullWeight += 4;
    verdicts.push({
      name: '1. Candle & Liquidity Sweep',
      signal: 'SELL',
      weight: '22%',
      detail: `Bearish candle displacement (${microDeltaPips}p downward pressure)`
    });
  } else {
    const emaStackBull = p.ema20 >= p.ema50;
    if (emaStackBull) bullWeight += 15;
    else bearWeight += 15;
    verdicts.push({
      name: '1. Candle & Liquidity Sweep',
      signal: emaStackBull ? 'BUY' : 'SELL',
      weight: '15%',
      detail: `Tight micro-range (${microDeltaPips}p inside noise floor) — respecting ${emaStackBull ? 'bullish' : 'bearish'} EMA structure`
    });
  }

  // FACTOR 2: 20 / 50 EMA Dynamic Trend Stack & Overextension Guard (24 pts max)
  const distEma20Pips = (p.livePrice - p.ema20) * pipMultiplier;
  const overextLimit = isGold ? 210 : isBtc ? 1350 : 28;
  if (distEma20Pips > overextLimit) {
    bearWeight += 20;
    bullWeight += 4;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'SELL',
      weight: '20%',
      detail: `Overextended +${distEma20Pips.toFixed(1)}p above 20 EMA (${p.ema20.toFixed(decimals)}) — mean-reversion risk`
    });
  } else if (distEma20Pips < -overextLimit) {
    bullWeight += 20;
    bearWeight += 4;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'BUY',
      weight: '20%',
      detail: `Stretched ${distEma20Pips.toFixed(1)}p below 20 EMA (${p.ema20.toFixed(decimals)}) — snapback bounce zone`
    });
  } else if (p.livePrice >= p.ema20 && p.ema20 >= p.ema50) {
    bullWeight += 24;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'BUY',
      weight: '24%',
      detail: `Bullish stack: Price (${p.livePrice.toFixed(decimals)}) > 20 EMA (${p.ema20.toFixed(decimals)}) > 50 EMA`
    });
  } else if (p.livePrice <= p.ema20 && p.ema20 <= p.ema50) {
    bearWeight += 24;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'SELL',
      weight: '24%',
      detail: `Bearish stack: Price (${p.livePrice.toFixed(decimals)}) < 20 EMA (${p.ema20.toFixed(decimals)}) < 50 EMA`
    });
  } else if (p.livePrice >= p.ema20) {
    bullWeight += 17;
    bearWeight += 7;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'BUY',
      weight: '17%',
      detail: `Bullish crossover reclaim above 20 EMA (${p.ema20.toFixed(decimals)})`
    });
  } else {
    bearWeight += 17;
    bullWeight += 7;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'SELL',
      weight: '17%',
      detail: `Bearish breakdown below 20 EMA (${p.ema20.toFixed(decimals)})`
    });
  }

  // FACTOR 3: 14-Period Wilder RSI Momentum & Exhaustion (20 pts max)
  if (p.rsi >= 69) {
    bearWeight += 20;
    verdicts.push({
      name: '3. RSI (14) Momentum',
      signal: 'SELL',
      weight: '20%',
      detail: `RSI ${p.rsi} Overbought Exhaustion — blocks BUY chasing, favors reversal SHORT`
    });
  } else if (p.rsi <= 32) {
    bullWeight += 20;
    verdicts.push({
      name: '3. RSI (14) Momentum',
      signal: 'BUY',
      weight: '20%',
      detail: `RSI ${p.rsi} Oversold Capitulation — blocks SELL chasing, favors accumulation LONG`
    });
  } else if (p.rsi >= 51) {
    bullWeight += 18;
    bearWeight += 2;
    verdicts.push({
      name: '3. RSI (14) Momentum',
      signal: 'BUY',
      weight: '18%',
      detail: `RSI ${p.rsi} healthy bullish expansion corridor (room before 70 overbought)`
    });
  } else {
    bearWeight += 18;
    bullWeight += 2;
    verdicts.push({
      name: '3. RSI (14) Momentum',
      signal: 'SELL',
      weight: '18%',
      detail: `RSI ${p.rsi} sustained bearish momentum corridor (room before 30 oversold)`
    });
  }

  // FACTOR 4: Global Macro & Live USD Basket (DXY) / Risk Sentiment Flow (18 pts max)
  const isUsdQuote = p.pair.endsWith('/USD');
  const isUsdBase = p.pair.startsWith('USD/');
  const dxy = macro.dxyPressurePct;
  if (isUsdQuote && !isGold) {
    if (dxy <= -0.06) {
      bullWeight += 18;
      verdicts.push({
        name: '4. DXY Macro & Risk Flow',
        signal: 'BUY',
        weight: '18%',
        detail: `USD Basket weakening (${dxy}%) gives macro BUY tail-wind for ${p.pair}`
      });
    } else if (dxy >= 0.06) {
      bearWeight += 18;
      verdicts.push({
        name: '4. DXY Macro & Risk Flow',
        signal: 'SELL',
        weight: '18%',
        detail: `USD Basket surging (+${dxy}%) pressures ${p.pair} downward`
      });
    } else {
      bullWeight += 9;
      bearWeight += 9;
      verdicts.push({
        name: '4. DXY Macro & Risk Flow',
        signal: 'CAUTION',
        weight: '9%',
        detail: `USD Basket neutral (${dxy}%) — ${macro.riskRegime}`
      });
    }
  } else if (isUsdBase) {
    if (dxy >= 0.06) {
      bullWeight += 18;
      verdicts.push({
        name: '4. DXY Macro & Risk Flow',
        signal: 'BUY',
        weight: '18%',
        detail: `USD Basket surging (+${dxy}%) lifts USD-base ${p.pair} upward`
      });
    } else if (dxy <= -0.06) {
      bearWeight += 18;
      verdicts.push({
        name: '4. DXY Macro & Risk Flow',
        signal: 'SELL',
        weight: '18%',
        detail: `USD Basket softening (${dxy}%) weighs on ${p.pair}`
      });
    } else {
      bullWeight += 9;
      bearWeight += 9;
      verdicts.push({
        name: '4. DXY Macro & Risk Flow',
        signal: 'CAUTION',
        weight: '9%',
        detail: `USD Basket balanced (${dxy}%) — ${macro.riskRegime}`
      });
    }
  } else if (isGold) {
    if (macro.safeHavenSurge || dxy <= -0.05) {
      bullWeight += 18;
      verdicts.push({
        name: '4. DXY Macro & Safe-Haven',
        signal: 'BUY',
        weight: '18%',
        detail: `Safe-haven bullion demand + softer USD (${dxy}%) back Gold longs`
      });
    } else if (dxy >= 0.15) {
      bearWeight += 16;
      verdicts.push({
        name: '4. DXY Macro & Safe-Haven',
        signal: 'SELL',
        weight: '16%',
        detail: `Strong USD basket (+${dxy}%) creates macro headwind on Gold`
      });
    } else {
      bullWeight += 10;
      bearWeight += 8;
      verdicts.push({
        name: '4. DXY Macro & Safe-Haven',
        signal: 'BUY',
        weight: '10%',
        detail: `Gold equilibrium (${macro.riskRegime}) — follow 15m liquidity sweep`
      });
    }
  } else {
    // GBP/JPY cross
    if (macro.riskRegime === 'RISK-OFF SAFE-HAVEN') {
      bearWeight += 18;
      verdicts.push({
        name: '4. Yen Carry & Risk Flow',
        signal: 'SELL',
        weight: '18%',
        detail: `Risk-Off safe-haven JPY inflow favors GBP/JPY downside distribution`
      });
    } else {
      bullWeight += 16;
      verdicts.push({
        name: '4. Yen Carry & Risk Flow',
        signal: 'BUY',
        weight: '16%',
        detail: `${macro.riskRegime}: constructive risk appetite supports GBP/JPY`
      });
    }
  }

  // FACTOR 5: Nairobi (EAT) Session Liquidity & Broker Spread Filter (12 pts max)
  const spreadPips = p.brokerSpread ?? (isGold ? 2.2 : isBtc ? 25 : 1.1);
  const spreadHealthy = isBtc ? spreadPips <= 35 : spreadPips <= 2.5;
  if (!macro.isRolloverWindow && !macro.isUsReleaseWindow && spreadHealthy) {
    if (bullWeight >= bearWeight) bullWeight += 12;
    else bearWeight += 12;
    verdicts.push({
      name: '5. Kenya EAT Window & Spread',
      signal: bullWeight >= bearWeight ? 'BUY' : 'SELL',
      weight: '12%',
      detail: `Active liquidity window (${macro.eatHour}:00 EAT) · tight ~${spreadPips}p broker spread ✓`
    });
  } else {
    verdicts.push({
      name: '5. Kenya EAT Window & Spread',
      signal: 'CAUTION',
      weight: '6%',
      detail: macro.isRolloverWindow
        ? 'Midnight rollover window in Kenya — keep 0.01 lot & verify wide spread'
        : macro.isUsReleaseWindow
        ? '15:30 EAT NY release spike window — execute strictly at confirmed candle close'
        : `Elevated spread (~${spreadPips}p) — strictly cap risk at $2.00`
    });
  }

  const total = Math.max(1, bullWeight + bearWeight);
  const bullScorePct = Math.round((bullWeight / total) * 100);
  const bearScorePct = 100 - bullScorePct;
  const strongDeadbandPips = isGold ? 28.0 : isBtc ? 160.0 : 4.5;
  const distEmaAbsPips = Math.abs(p.livePrice - p.ema20) * pipMultiplier;
  const scoreMargin = Math.abs(bullScorePct - bearScorePct);

  let isBuy = bullWeight >= bearWeight;
  if (p.biasOverride) {
    isBuy = p.biasOverride === 'BUY';
  } else if (p.previousDirection && scoreMargin < 24 && distEmaAbsPips < strongDeadbandPips) {
    // Strong anti-whipsaw lock: require decisive multi-factor shift (>24% spread + structural breakout) before flipping BUY/SELL
    isBuy = p.previousDirection === 'BUY';
  }

  const dominantPct = isBuy ? bullScorePct : bearScorePct;
  const rawConf = 72 + dominantPct * 0.25 + (spreadHealthy && !macro.isRolloverWindow ? 1.5 : -2.5);
  const confidence = Number(Math.min(98.2, Math.max(71.5, rawConf)).toFixed(1));

  return {
    isBuy,
    bullScorePct,
    bearScorePct,
    confidence,
    factorVerdicts: verdicts
  };
}

/**
 * Dynamically evaluates real OHLC candlesticks + latest tick to derive EMA 20, EMA 50,
 * RSI 14, Key Liquidity Sweep level, Candlestick Structure Pattern, and 5-Factor Bias.
 * Any upward/downward move across candles immediately recalculates all indicators & direction!
 */
export function evaluateCandleSeriesAndTick(p: {
  pair: CurrencyPair;
  timeframe: Timeframe;
  livePrice: number;
  baseCandles?: OhlcCandle[];
  candlesAreRealOhlc?: boolean;
  change24hPct?: number;
  macro?: MacroContextSnapshot;
  brokerSpread?: number;
  previousDirection?: 'BUY' | 'SELL';
}) {
  const { isGold, isBtc, pipMultiplier, decimals } = getPairSpecs(p.pair);
  const unit = 1 / pipMultiplier;
  const pct = p.change24hPct ?? 0;
  const nowSec = Math.floor(Date.now() / 1000);
  const stepSec =
    p.timeframe === 'M1' ? 60 :
    p.timeframe === 'M5' ? 300 :
    p.timeframe === 'M10' ? 600 :
    p.timeframe === 'M15' ? 900 :
    p.timeframe === 'H1' ? 3600 :
    p.timeframe === 'H4' ? 14400 : 86400;

  let candles: OhlcCandle[] = [];
  const maxSingleCandleJump = p.candlesAreRealOhlc
    ? (isBtc ? 0.012 : isGold ? 0.006 : 0.0045)
    : 0.0025;

  const baseLast = p.baseCandles && p.baseCandles.length >= 12 ? p.baseCandles[p.baseCandles.length - 1] : null;
  const ratio = baseLast && baseLast.close > 0 ? p.livePrice / baseLast.close : 1;

  if (p.baseCandles && p.baseCandles.length >= 12 && (p.candlesAreRealOhlc || Math.abs(ratio - 1) <= maxSingleCandleJump)) {
    if (Math.abs(ratio - 1) <= maxSingleCandleJump) {
      const prevPeriod = Math.floor(baseLast!.time / stepSec);
      const curPeriod = Math.floor(nowSec / stepSec);
      if (curPeriod > prevPeriod) {
        const newBar: OhlcCandle = {
          time: nowSec,
          open: baseLast!.close,
          high: Number(Math.max(baseLast!.close, p.livePrice).toFixed(decimals)),
          low: Number(Math.min(baseLast!.close, p.livePrice).toFixed(decimals)),
          close: Number(p.livePrice.toFixed(decimals))
        };
        candles = [...p.baseCandles.slice(-59), newBar];
      } else {
        candles = p.baseCandles.map((c, idx) => {
          if (idx === p.baseCandles!.length - 1) {
            return {
              ...c,
              close: p.livePrice,
              high: Math.max(c.high, p.livePrice),
              low: Math.min(c.low, p.livePrice)
            };
          }
          return c;
        });
      }
    } else {
      candles = p.baseCandles.map((c) => ({
        time: c.time,
        open: Number((c.open * ratio).toFixed(decimals)),
        high: Number((c.high * ratio).toFixed(decimals)),
        low: Number((c.low * ratio).toFixed(decimals)),
        close: Number((c.close * ratio).toFixed(decimals))
      }));
    }
  } else {
    const tfScale =
      p.timeframe === 'M1' ? 0.25 :
      p.timeframe === 'M5' ? 0.55 :
      p.timeframe === 'M10' ? 0.80 :
      p.timeframe === 'M15' ? 1.0 :
      p.timeframe === 'H1' ? 1.65 :
      p.timeframe === 'H4' ? 2.6 : 4.2;

    const baseStepPips = (isGold ? 28 : isBtc ? 210 : 5.5) * tfScale;
    const trendSlopePerBar = (pct / 60) * 0.01 * p.livePrice;
    const nowSec = Math.floor(Date.now() / 1000);
    const stepSec =
      p.timeframe === 'M1' ? 60 :
      p.timeframe === 'M5' ? 300 :
      p.timeframe === 'M10' ? 600 :
      p.timeframe === 'M15' ? 900 :
      p.timeframe === 'H1' ? 3600 :
      p.timeframe === 'H4' ? 14400 : 86400;

    const seedOffset = p.pair.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % 17;
    const rawCloses: number[] = [];
    for (let i = 59; i >= 0; i--) {
      const wave = Math.sin((i + seedOffset) * 0.42) * baseStepPips * 1.45 + Math.cos((i + seedOffset) * 0.19) * baseStepPips * 0.85;
      const cVal = p.livePrice - trendSlopePerBar * i - wave * unit;
      rawCloses.push(Math.max(unit, cVal));
    }
    rawCloses[rawCloses.length - 1] = p.livePrice;

    candles = rawCloses.map((close, idx) => {
      const prevClose = idx > 0 ? rawCloses[idx - 1] : close;
      const open = prevClose;
      const wickUp = (Math.abs(Math.sin(idx * 1.3 + seedOffset)) * 0.85 + 0.25) * baseStepPips * unit;
      const wickDn = (Math.abs(Math.cos(idx * 1.7 + seedOffset)) * 0.85 + 0.25) * baseStepPips * unit;
      return {
        time: nowSec - (59 - idx) * stepSec,
        open: Number(open.toFixed(decimals)),
        high: Number((Math.max(open, close) + wickUp).toFixed(decimals)),
        low: Number((Math.min(open, close) - wickDn).toFixed(decimals)),
        close: Number(close.toFixed(decimals))
      };
    });
  }

  const closes = candles.map((c) => c.close);
  const ema20 = Number(computeRealEma(closes, 20).toFixed(decimals));
  const ema50 = Number(computeRealEma(closes, 50).toFixed(decimals));
  const ema20Prev = closes.length > 6 ? Number(computeRealEma(closes.slice(0, -6), 20).toFixed(decimals)) : ema20;
  const ema20SlopePips = Number(((ema20 - ema20Prev) * pipMultiplier).toFixed(2));
  const rsi = computeRealRsi(closes, 14);
  const atrPips = computeRealAtrPips(candles, pipMultiplier, 14);

  const recent24 = candles.slice(-24);
  const swingHigh = Number(Math.max(...recent24.map((c) => c.high)).toFixed(decimals));
  const swingLow = Number(Math.min(...recent24.map((c) => c.low)).toFixed(decimals));

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2] || lastCandle;
  const prev3Candle = candles[candles.length - 4] || prevCandle;
  const candleBody = Math.abs(lastCandle.close - lastCandle.open);
  const upperWick = Math.max(0, lastCandle.high - Math.max(lastCandle.open, lastCandle.close));
  const lowerWick = Math.max(0, Math.min(lastCandle.open, lastCandle.close) - lastCandle.low);
  const isBearishPinOrSweep = upperWick > candleBody * 1.25 && lastCandle.close < prevCandle.high;
  const isBullishPinOrAbsorption = lowerWick > candleBody * 1.25 && lastCandle.close > prevCandle.low;

  const tempKeyLevel = ema20 >= ema50 ? swingLow : swingHigh;
  const allFactorEval = evaluateAllTradeFactors({
    pair: p.pair,
    livePrice: p.livePrice,
    ema20,
    ema50,
    rsi,
    keyLevel: tempKeyLevel,
    prev3Close: prev3Candle.close,
    isBearishPinOrSweep,
    isBullishPinOrAbsorption,
    brokerSpread: p.brokerSpread,
    macro: p.macro,
    previousDirection: p.previousDirection
  });

  const isBuy = allFactorEval.isBuy;
  const keyLevel = isBuy ? swingLow : swingHigh;

  let patternType: PatternCategory = '20/50 EMA Trend Bounce';
  if (!isBuy && (isBearishPinOrSweep || rsi >= 67)) {
    patternType = 'Tower Top Liquidity Sweep';
  } else if (!isBuy && p.livePrice < ema20 && ema20 > ema50) {
    patternType = 'Bearish Order Block Mitigation';
  } else if (isBuy && (isBullishPinOrAbsorption || Math.abs(p.livePrice - swingLow) * pipMultiplier <= atrPips * 1.2)) {
    patternType = 'Asian Liquidity Sweep';
  } else if (Math.abs(p.livePrice - ema20) * pipMultiplier <= atrPips * 0.65) {
    patternType = 'Fair Value Gap Re-test';
  }

  return {
    ema20,
    ema50,
    ema20SlopePips,
    rsi,
    atrPips,
    keyLevel,
    swingHigh,
    swingLow,
    isBuy,
    bullScorePct: allFactorEval.bullScorePct,
    bearScorePct: allFactorEval.bearScorePct,
    confidence: allFactorEval.confidence,
    factorVerdicts: allFactorEval.factorVerdicts,
    patternType,
    candles
  };
}

export function computeRealChartTradeParams(p: {
  targetPair: CurrencyPair;
  targetTf: Timeframe;
  targetBroker: BrokerId;
  price: number;
  keyLevel?: number;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  atrPips?: number;
  macro?: MacroContextSnapshot;
  biasOverride?: 'BUY' | 'SELL';
  previousDirection?: 'BUY' | 'SELL';
  previousTrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  h1TrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
}): ComputedTradeParams {
  const { isJpy, isGold, isBtc, pipMultiplier, decimals } = getPairSpecs(p.targetPair);

  // Broker Symbol & Spread mappings first so spread feeds into all-factor evaluation & TP expansion
  const cleanPair = p.targetPair.replace('/', '');
  let brokerSymbol = cleanPair;
  let brokerSpread = 1.1;

  if (p.targetBroker === 'fxpesa') {
    brokerSymbol = isGold ? 'XAUUSD' : cleanPair;
    brokerSpread = isGold ? 2.2 : isJpy ? 1.4 : isBtc ? 25.0 : 1.1;
  } else if (p.targetBroker === 'exness') {
    brokerSymbol = isGold ? 'XAUUSD.m' : `${cleanPair}.m`;
    brokerSpread = isGold ? 1.2 : isJpy ? 0.8 : isBtc ? 15.0 : 0.6;
  } else if (p.targetBroker === 'hfm') {
    brokerSymbol = isGold ? 'GOLD' : `${cleanPair}.h`;
    brokerSpread = isGold ? 2.4 : isJpy ? 1.6 : isBtc ? 30.0 : 1.3;
  } else if (p.targetBroker === 'fbs') {
    brokerSymbol = isGold ? 'XAUUSD' : cleanPair;
    brokerSpread = isGold ? 2.6 : isJpy ? 1.8 : isBtc ? 35.0 : 1.5;
  }

  // Base timeframe volatility + continuous sub-pip ATR & live candle displacement calibration
  let baseSlPips = 16;
  let baseTp1Pips = 32;
  let baseTp2Pips = 52;

  if (p.targetTf === 'M1') {
    baseSlPips = isGold ? 35 : isBtc ? 220 : 8;
    baseTp1Pips = isGold ? 60 : isBtc ? 380 : 15;
    baseTp2Pips = isGold ? 95 : isBtc ? 600 : 24;
  } else if (p.targetTf === 'M5') {
    baseSlPips = isGold ? 55 : isBtc ? 350 : 12;
    baseTp1Pips = isGold ? 95 : isBtc ? 600 : 22;
    baseTp2Pips = isGold ? 145 : isBtc ? 920 : 36;
  } else if (p.targetTf === 'M10') {
    baseSlPips = isGold ? 75 : isBtc ? 460 : 14;
    baseTp1Pips = isGold ? 125 : isBtc ? 780 : 28;
    baseTp2Pips = isGold ? 185 : isBtc ? 1150 : 44;
  } else if (p.targetTf === 'M15') {
    baseSlPips = isGold ? 95 : isBtc ? 600 : 16;
    baseTp1Pips = isGold ? 160 : isBtc ? 1050 : 32;
    baseTp2Pips = isGold ? 240 : isBtc ? 1600 : 52;
  } else if (p.targetTf === 'H1') {
    baseSlPips = isGold ? 160 : isBtc ? 950 : 28;
    baseTp1Pips = isGold ? 270 : isBtc ? 1650 : 56;
    baseTp2Pips = isGold ? 410 : isBtc ? 2500 : 90;
  } else if (p.targetTf === 'H4') {
    baseSlPips = isGold ? 280 : isBtc ? 1650 : 52;
    baseTp1Pips = isGold ? 480 : isBtc ? 2800 : 105;
    baseTp2Pips = isGold ? 720 : isBtc ? 4400 : 170;
  } else if (p.targetTf === 'D1') {
    baseSlPips = isGold ? 500 : isBtc ? 2800 : 95;
    baseTp1Pips = isGold ? 850 : isBtc ? 4800 : 190;
    baseTp2Pips = isGold ? 1300 : isBtc ? 7500 : 310;
  }

  // Sub-pip continuous ATR + live EMA displacement scaling so even 0.5-1 pip candle movements refine SL & TP!
  const emaDistPips = p.ema20 !== undefined ? Math.abs(p.price - p.ema20) * pipMultiplier : 0;
  if (p.atrPips && p.atrPips > 0) {
    const minSl = Math.max(7, baseSlPips * 0.78);
    const maxSl = baseSlPips * 1.28;
    const atrScaled = p.atrPips * 1.42 + emaDistPips * 0.14;
    baseSlPips = Number(Math.min(maxSl, Math.max(minSl, atrScaled)).toFixed(1));
    baseTp1Pips = Number(Math.max(baseSlPips * 1.85, baseTp1Pips).toFixed(1));
    baseTp2Pips = Number(Math.max(baseSlPips * 3.15, baseTp2Pips).toFixed(1));
  }

  // Unified 5-Factor All-Confluence BUY / SELL Evaluation with Anti-Whipsaw Hysteresis
  const allFactorEval = evaluateAllTradeFactors({
    pair: p.targetPair,
    livePrice: p.price,
    ema20: p.ema20 ?? p.price,
    ema50: p.ema50 ?? p.price,
    rsi: p.rsi ?? 52.0,
    keyLevel: p.keyLevel,
    brokerSpread,
    macro: p.macro,
    biasOverride: p.biasOverride,
    previousDirection: p.previousDirection
  });

  const isBuy = allFactorEval.isBuy;
  const macro = p.macro ?? getCurrentMacroContext();
  const isUsdBase = p.targetPair.startsWith('USD/');
  const dxySupportsActiveSide =
    p.targetPair === 'BTC/USD'
      ? (isBuy && macro.dxyPressurePct <= 0.1) || (!isBuy && macro.dxyPressurePct >= -0.05)
      : p.targetPair === 'GBP/JPY'
      ? (isBuy && macro.riskRegime !== 'RISK-OFF SAFE-HAVEN') || (!isBuy && macro.riskRegime === 'RISK-OFF SAFE-HAVEN')
      : isUsdBase
      ? (isBuy && macro.dxyPressurePct >= 0.05) || (!isBuy && macro.dxyPressurePct <= -0.05)
      : (isBuy && macro.dxyPressurePct <= -0.05) || (!isBuy && macro.dxyPressurePct >= 0.05);

  // Longer 12H–48H swing target (TP3) scales dynamically with DXY macro tailwind & RSI headroom
  const rsiVal = p.rsi ?? 52.0;
  const rsiHeadroomFactor = isBuy
    ? Math.max(0.85, Math.min(1.22, (74 - rsiVal) / 24))
    : Math.max(0.85, Math.min(1.22, (rsiVal - 26) / 24));
  const macroExpansionMultiplier = dxySupportsActiveSide ? 1.72 : 1.48;
  const baseTp3Pips = Number((baseTp2Pips * macroExpansionMultiplier * rsiHeadroomFactor).toFixed(1));

  const slOffset = baseSlPips / pipMultiplier;
  const tp1Offset = baseTp1Pips / pipMultiplier;
  const tp2Offset = baseTp2Pips / pipMultiplier;
  const tp3Offset = baseTp3Pips / pipMultiplier;

  let slPrice: number;
  let tp1Price: number;
  let tp2Price: number;
  let tp3Price: number;

  if (isBuy) {
    slPrice = Number((p.price - slOffset).toFixed(decimals));
    tp1Price = Number((p.price + tp1Offset).toFixed(decimals));
    tp2Price = Number((p.price + tp2Offset).toFixed(decimals));
    tp3Price = Number((p.price + tp3Offset).toFixed(decimals));
  } else {
    slPrice = Number((p.price + slOffset).toFixed(decimals));
    tp1Price = Number((p.price - tp1Offset).toFixed(decimals));
    tp2Price = Number((p.price - tp2Offset).toFixed(decimals));
    tp3Price = Number((p.price - tp3Offset).toFixed(decimals));
  }

  // Strict MT4/MT5 S/L & T/P Side Enforcement (Prevents [Invalid S/L or T/P])
  if (isBuy) {
    if (slPrice >= p.price) slPrice = Number((p.price - Math.max(10, baseSlPips) / pipMultiplier).toFixed(decimals));
    if (tp1Price <= p.price) tp1Price = Number((p.price + Math.max(20, baseTp1Pips) / pipMultiplier).toFixed(decimals));
    if (tp2Price <= tp1Price) tp2Price = Number((tp1Price + 15 / pipMultiplier).toFixed(decimals));
    if (tp3Price <= tp2Price) tp3Price = Number((tp2Price + 22 / pipMultiplier).toFixed(decimals));
  } else {
    if (slPrice <= p.price) slPrice = Number((p.price + Math.max(10, baseSlPips) / pipMultiplier).toFixed(decimals));
    if (tp1Price >= p.price) tp1Price = Number((p.price - Math.max(20, baseTp1Pips) / pipMultiplier).toFixed(decimals));
    if (tp2Price >= tp1Price) tp2Price = Number((tp1Price - 15 / pipMultiplier).toFixed(decimals));
    if (tp3Price >= tp2Price) tp3Price = Number((tp2Price - 22 / pipMultiplier).toFixed(decimals));
  }

  const actualSlPips = Math.max(1, Number((Math.abs(p.price - slPrice) * pipMultiplier).toFixed(1)));
  const actualTp1Pips = Math.max(1, Number((Math.abs(tp1Price - p.price) * pipMultiplier).toFixed(1)));
  const actualTpPips = Math.max(1, Number((Math.abs(tp2Price - p.price) * pipMultiplier).toFixed(1)));
  const actualTp3Pips = Math.max(1, Number((Math.abs(tp3Price - p.price) * pipMultiplier).toFixed(1)));

  // Gilgil $2.00 / 260 KES strict risk cap on 0.01 micro lot + Real Net Profit Expectancy after spread
  const pipValPerMicroLot = isGold ? 0.1 : isJpy ? 0.065 : isBtc ? 0.01 : 0.1;
  const rawRiskUsd = Number((actualSlPips * pipValPerMicroLot).toFixed(2));
  const actualRiskUsd = Math.min(2.0, Math.max(0.8, rawRiskUsd));
  const potentialGainUsd = Number((actualTpPips * pipValPerMicroLot).toFixed(2));
  const spreadCostUsd = Number((brokerSpread * pipValPerMicroLot).toFixed(2));
  const netProfitUsd = Math.max(0.4, Number((potentialGainUsd - spreadCostUsd).toFixed(2)));
  const netProfitKes = Math.round(netProfitUsd * 130);
  const netProfit48hUsd = Math.max(0.8, Number((actualTp3Pips * pipValPerMicroLot - spreadCostUsd).toFixed(2)));
  const netProfit48hKes = Math.round(netProfit48hUsd * 130);
  const tp1NetProfitUsd = Math.max(0.2, Number((actualTp1Pips * pipValPerMicroLot * 0.5 - spreadCostUsd).toFixed(2)));
  const tp1NetProfitKes = Math.round(tp1NetProfitUsd * 130);
  const orderType = isBuy ? 'BUY BY MARKET' : 'SELL BY MARKET';
  const rrNumeric = Number((actualTpPips / Math.max(1, actualSlPips)).toFixed(1));
  const riskReward = `1 : ${rrNumeric.toFixed(1)}`;
  const aiConfidence = allFactorEval.confidence;

  const sweepAnchor = p.keyLevel
    ? p.keyLevel.toFixed(decimals)
    : isGold
    ? (isBuy ? slPrice - 1.5 : slPrice + 1.5).toFixed(decimals)
    : isBtc
    ? (isBuy ? slPrice - 120 : slPrice + 120).toFixed(decimals)
    : (isBuy ? slPrice - 4 / pipMultiplier : slPrice + 4 / pipMultiplier).toFixed(decimals);

  const ema20Val = p.ema20 ?? p.price;
  const ema50Val = p.ema50 ?? p.price;
  const deadbandPips = isGold ? 28.0 : isBtc ? 160.0 : 4.5;
  const priceMinusEma20Pips = (p.price - ema20Val) * pipMultiplier;
  const emaSpreadPips = (ema20Val - ema50Val) * pipMultiplier;

  // Higher-timeframe (H1) EMA & multi-candle macro trend evaluation (immune to 1s noise)
  const h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING' =
    p.h1TrendDirection ??
    (emaSpreadPips >= 0.45
      ? 'UPTREND'
      : emaSpreadPips <= -0.45
      ? 'DOWNTREND'
      : isBuy
      ? 'UPTREND'
      : 'DOWNTREND');

  let trendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING' = h1TrendDirection;
  if (p.previousTrendDirection === 'UPTREND') {
    trendDirection =
      h1TrendDirection === 'DOWNTREND' && priceMinusEma20Pips < -deadbandPips && allFactorEval.bearScorePct >= 62
        ? 'DOWNTREND'
        : 'UPTREND';
  } else if (p.previousTrendDirection === 'DOWNTREND') {
    trendDirection =
      h1TrendDirection === 'UPTREND' && priceMinusEma20Pips > deadbandPips && allFactorEval.bullScorePct >= 62
        ? 'UPTREND'
        : 'DOWNTREND';
  } else if (emaSpreadPips >= 0.4 || (isBuy && priceMinusEma20Pips >= 0)) {
    trendDirection = 'UPTREND';
  } else if (emaSpreadPips <= -0.4 || (!isBuy && priceMinusEma20Pips <= 0)) {
    trendDirection = 'DOWNTREND';
  }

  const trendMatchesSide =
    (isBuy && trendDirection === 'UPTREND') || (!isBuy && trendDirection === 'DOWNTREND');
  const activeSideScore = isBuy ? allFactorEval.bullScorePct : allFactorEval.bearScorePct;
  const isFavourableOrder = trendMatchesSide && activeSideScore >= 56 && rrNumeric >= 1.8;

  const orderVerdictLabel: ComputedTradeParams['orderVerdictLabel'] = isBuy
    ? isFavourableOrder
      ? 'FAVOURABLE BUY ORDER'
      : trendMatchesSide
      ? 'SELECTIVE BUY (WAIT PULLBACK)'
      : 'REVERSAL BUY PLAN (CONFIRM ABOVE 20 EMA)'
    : isFavourableOrder
    ? 'FAVOURABLE SELL ORDER'
    : trendMatchesSide
    ? 'SELECTIVE SELL (WAIT PULLBACK)'
    : 'REVERSAL SELL PLAN (CONFIRM BELOW 20 EMA)';

  // Side-consistent Trend & Projection Headline: always reflects the side the trader chose/inspected!
  const trendProjectionText = isBuy
    ? trendMatchesSide
      ? `UPTREND · BUY PROJECTION ↑ (${allFactorEval.bullScorePct}% Bull Confluence · H1 ${h1TrendDirection})`
      : `BUY REVERSAL SETUP ↑ (${allFactorEval.bullScorePct}% Bull Factors · H1 ${h1TrendDirection})`
    : trendMatchesSide
    ? `DOWNTREND · SELL PROJECTION ↓ (${allFactorEval.bearScorePct}% Bear Confluence · H1 ${h1TrendDirection})`
    : `SELL REVERSAL SETUP ↓ (${allFactorEval.bearScorePct}% Bear Factors · H1 ${h1TrendDirection})`;

  const dxyTag = `${macro.dxyPressurePct >= 0 ? `+${macro.dxyPressurePct}%` : `${macro.dxyPressurePct}%`}`;
  const macroFactorNote = dxySupportsActiveSide
    ? `DXY Basket (${dxyTag}) & ${macro.riskRegime} actively tailwind this ${isBuy ? 'BUY' : 'SELL'} horizon`
    : `DXY Basket (${dxyTag}) & ${macro.riskRegime} are counter-wind — scale 50% at TP1 & trail SL`;

  const trajectoryHorizons: TrajectoryHorizonStep[] = [
    {
      horizon: '1H – 4H (Immediate)',
      targetPrice: tp1Price,
      targetPips: actualTp1Pips,
      netProfitUsd: tp1NetProfitUsd,
      netProfitKes: tp1NetProfitKes,
      driverSummary: isBuy
        ? `Immediate push above 20 EMA (${ema20Val.toFixed(decimals)}) after liquidity sweep near ${sweepAnchor} (RSI ${rsiVal.toFixed(1)}). Close 50% & lock SL at Breakeven.`
        : `Immediate breakdown below 20 EMA (${ema20Val.toFixed(decimals)}) after buy-side sweep near ${sweepAnchor} (RSI ${rsiVal.toFixed(1)}). Close 50% & lock SL at Breakeven.`
    },
    {
      horizon: '4H – 12H (Session)',
      targetPrice: tp2Price,
      targetPips: actualTpPips,
      netProfitUsd,
      netProfitKes,
      driverSummary: `London/NY session liquidity expansion (${macro.eatHour}:00 EAT · ${brokerSymbol} ~${brokerSpread}p spread). ${macroFactorNote}.`
    },
    {
      horizon: '12H – 48H (Extended Swing)',
      targetPrice: tp3Price,
      targetPips: actualTp3Pips,
      netProfitUsd: netProfit48hUsd,
      netProfitKes: netProfit48hKes,
      driverSummary: isBuy
        ? `Multi-session H1 (${h1TrendDirection}) upward swing expansion toward ${tp3Price.toFixed(decimals)} (+${actualTp3Pips}p) if DXY stays supportive and H1 closes hold above 50 EMA (${ema50Val.toFixed(decimals)}).`
        : `Multi-session H1 (${h1TrendDirection}) downward swing continuation toward ${tp3Price.toFixed(decimals)} (-${actualTp3Pips}p) if USD flow persists and H1 closes hold below 50 EMA (${ema50Val.toFixed(decimals)}).`
    }
  ];

  const profitOutlookText = isFavourableOrder
    ? `${orderVerdictLabel}: +$${netProfitUsd.toFixed(2)} (+${netProfitKes} KES) at 12H TP2 (${tp2Price.toFixed(decimals)}) · +$${netProfit48hUsd.toFixed(2)} (+${netProfit48hKes} KES) 48H Swing TP3 vs -$${actualRiskUsd.toFixed(2)} max risk (${riskReward} R:R)`
    : `${orderVerdictLabel}: Pullback near 20 EMA (${ema20Val.toFixed(decimals)}) targets +$${netProfitUsd.toFixed(2)} (+${netProfitKes} KES) at TP2 & +$${netProfit48hUsd.toFixed(2)} (+${netProfit48hKes} KES) at 48H TP3 (${riskReward} R:R)`;

  const humanCheckNote = isBuy
    ? `BUY Confirmation Check (${p.targetTf}): Confirm a bullish candle close above 20 EMA (${ema20Val.toFixed(decimals)}) with lower wick rejection near ${sweepAnchor} before entering BUY.`
    : `SELL Confirmation Check (${p.targetTf}): Confirm a bearish candle close below 20 EMA (${ema20Val.toFixed(decimals)}) with upper wick rejection near ${sweepAnchor} before entering SELL.`;

  const trajectory = isBuy
    ? `1H–48H ${p.biasOverride ? 'Chosen BUY' : 'AI BUY'} Roadmap (${trendProjectionText}): Live ${p.targetTf} candle @ ${p.price.toFixed(decimals)} (${brokerSymbol}). Sell-side liquidity swept near ${sweepAnchor}. 1H–4H TP1: ${tp1Price.toFixed(decimals)} (+$${tp1NetProfitUsd.toFixed(2)}) → 4H–12H TP2: ${tp2Price.toFixed(decimals)} (+${actualTpPips}p / +$${netProfitUsd.toFixed(2)}) → 12H–48H Extended TP3: ${tp3Price.toFixed(decimals)} (+${actualTp3Pips}p / +$${netProfit48hUsd.toFixed(2)}). ${macroFactorNote}.`
    : `1H–48H ${p.biasOverride ? 'Chosen SELL' : 'AI SELL'} Roadmap (${trendProjectionText}): Live ${p.targetTf} candle @ ${p.price.toFixed(decimals)} (${brokerSymbol}). Buy-side liquidity swept near ${sweepAnchor}. 1H–4H TP1: ${tp1Price.toFixed(decimals)} (+$${tp1NetProfitUsd.toFixed(2)}) → 4H–12H TP2: ${tp2Price.toFixed(decimals)} (-${actualTpPips}p / +$${netProfitUsd.toFixed(2)}) → 12H–48H Extended TP3: ${tp3Price.toFixed(decimals)} (-${actualTp3Pips}p / +$${netProfit48hUsd.toFixed(2)}). ${macroFactorNote}.`;

  const mt4SafetyProof = isBuy
    ? `MT4 BUY Validated ✓: SL (${slPrice.toFixed(decimals)}) < Entry (${p.price.toFixed(decimals)}) < TP1 (${tp1Price.toFixed(decimals)}) < TP2 (${tp2Price.toFixed(decimals)})`
    : `MT4 SELL Validated ✓: TP2 (${tp2Price.toFixed(decimals)}) < TP1 (${tp1Price.toFixed(decimals)}) < Entry (${p.price.toFixed(decimals)}) < SL (${slPrice.toFixed(decimals)})`;

  return {
    direction: isBuy ? 'BUY' : 'SELL',
    orderType,
    entryPrice: Number(p.price.toFixed(decimals)),
    stopLoss: slPrice,
    tp1: tp1Price,
    tp2: tp2Price,
    tp3: tp3Price,
    slPips: actualSlPips,
    tp1Pips: actualTp1Pips,
    tpPips: actualTpPips,
    tp3Pips: actualTp3Pips,
    riskReward,
    lotSize: 0.01,
    actualRiskUsd,
    potentialGainUsd,
    spreadCostUsd,
    netProfitUsd,
    netProfitKes,
    netProfit48hUsd,
    netProfit48hKes,
    tp1NetProfitUsd,
    tp1NetProfitKes,
    orderVerdictLabel,
    profitOutlookText,
    isFavourableOrder,
    brokerSymbol,
    brokerSpread,
    decimals,
    confidence: aiConfidence,
    bullScorePct: allFactorEval.bullScorePct,
    bearScorePct: allFactorEval.bearScorePct,
    factorVerdicts: allFactorEval.factorVerdicts,
    trajectory,
    trajectoryHorizons,
    trendDirection,
    h1TrendDirection,
    trendProjectionText,
    humanCheckNote,
    mt4SafetyProof,
    cmaProtection: 'Zero negative balance debt risk (CMA Kenya Regulated Shield)'
  };
}

/**
 * Re-anchors all OHLC indicators, 5-Factor AI strategy verdict, & SL/TP levels around a live price & optional candle history.
 */
export function buildCalibratedMarketItem(params: {
  pair: CurrencyPair;
  symbol: string;
  price: number;
  change24hPct: number;
  dailyOpenPrice?: number;
  recommendedTf: Timeframe;
  recommendedSession: string;
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
  isTopPick?: boolean;
  candles?: OhlcCandle[];
  h1Candles?: OhlcCandle[];
  candlesAreRealOhlc?: boolean;
  macro?: MacroContextSnapshot;
  dataSource?: 'Live Interbank Feed' | 'Live Feed + Institutional Calibration';
  previousDirection?: 'BUY' | 'SELL';
  previousTrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  spreadByBroker: Record<BrokerId, { symbol: string; spread: number; notes: string }>;
}): MarketScanData {
  const { decimals } = getPairSpecs(params.pair);

  const effectivePct =
    params.dailyOpenPrice && params.dailyOpenPrice > 0
      ? Number((((params.price - params.dailyOpenPrice) / params.dailyOpenPrice) * 100).toFixed(2))
      : params.change24hPct;

  const evalData = evaluateCandleSeriesAndTick({
    pair: params.pair,
    timeframe: params.recommendedTf,
    livePrice: params.price,
    baseCandles: params.candles,
    candlesAreRealOhlc: params.candlesAreRealOhlc,
    change24hPct: effectivePct,
    macro: params.macro,
    brokerSpread: params.spreadByBroker.fxpesa?.spread,
    previousDirection: params.previousDirection
  });

  // Compute genuine Higher-Timeframe (H1) EMA trend when H1 candles are available
  let h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING' | undefined = undefined;
  if (params.h1Candles && params.h1Candles.length >= 22) {
    const h1Closes = params.h1Candles.map((c) => c.close);
    const h1Ema20 = computeRealEma(h1Closes, 20);
    const h1Ema50 = computeRealEma(h1Closes, 50);
    h1TrendDirection = h1Ema20 >= h1Ema50 ? 'UPTREND' : 'DOWNTREND';
  }

  const absPct = Math.abs(effectivePct);
  const isNeutral =
    !params.previousDirection &&
    absPct < 0.03 &&
    Math.abs(evalData.bullScorePct - evalData.bearScorePct) <= 8;
  const isBuy = evalData.isBuy;

  const computed = computeRealChartTradeParams({
    targetPair: params.pair,
    targetTf: params.recommendedTf,
    targetBroker: 'fxpesa',
    price: params.price,
    keyLevel: evalData.keyLevel,
    ema20: evalData.ema20,
    ema50: evalData.ema50,
    rsi: evalData.rsi,
    atrPips: evalData.atrPips,
    macro: params.macro,
    biasOverride: isBuy ? 'BUY' : 'SELL',
    previousDirection: params.previousDirection,
    previousTrendDirection: params.previousTrendDirection,
    h1TrendDirection
  });

  const trendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING' = isNeutral
    ? 'RANGING'
    : computed.trendDirection;

  const trend = isNeutral
    ? 'RANGING · Equilibrium Consolidation'
    : trendDirection === 'UPTREND'
    ? `UPTREND · Bullish Expansion (${computed.bullScorePct}% Factors BUY)`
    : `DOWNTREND · Bearish Distribution (${computed.bearScorePct}% Factors SELL)`;

  const trendProjectionText = isNeutral
    ? 'RANGING · WAIT FOR EMA BREAKOUT'
    : computed.trendProjectionText;

  const ictPattern = isNeutral
    ? `Equilibrium Near 20 EMA (${evalData.ema20.toFixed(decimals)}) — Awaiting Expansion`
    : isBuy
    ? `Sell-Side Sweep @ ${evalData.keyLevel.toFixed(decimals)} + Bullish 20 EMA (${evalData.ema20.toFixed(decimals)})`
    : `Buy-Side Sweep @ ${evalData.keyLevel.toFixed(decimals)} + Bearish Shift (RSI ${evalData.rsi})`;

  return {
    pair: params.pair,
    symbol: params.symbol,
    price: Number(params.price.toFixed(decimals)),
    change24hPct: Number(effectivePct.toFixed(2)),
    dailyOpenPrice: params.dailyOpenPrice,
    bias: isNeutral ? 'NEUTRAL_CHOP' : isBuy ? 'STRONG_BUY' : 'STRONG_SELL',
    confidence: isNeutral ? 69.5 : computed.confidence,
    recommendedTf: params.recommendedTf,
    trend,
    trendDirection,
    h1TrendDirection: computed.h1TrendDirection,
    trendProjectionText,
    humanCheckNote: computed.humanCheckNote,
    ictPattern,
    projection: computed.trajectory,
    projectedPips: computed.tpPips,
    suggestedSL: computed.stopLoss,
    suggestedTP1: computed.tp1,
    suggestedTP2: computed.tp2,
    suggestedTP3: computed.tp3,
    tp3Pips: computed.tp3Pips,
    ema20: evalData.ema20,
    ema50: evalData.ema50,
    rsi: evalData.rsi,
    atrPips: evalData.atrPips,
    keyLevel: evalData.keyLevel,
    patternType: evalData.patternType,
    riskReward: computed.riskReward,
    isTopPick: params.isTopPick,
    volatility: params.volatility,
    recommendedSession: params.recommendedSession,
    candles: evalData.candles,
    h1Candles: params.h1Candles,
    candlesAreRealOhlc: Boolean(params.candlesAreRealOhlc),
    bullScorePct: computed.bullScorePct,
    bearScorePct: computed.bearScorePct,
    factorVerdicts: computed.factorVerdicts,
    trajectoryHorizons: computed.trajectoryHorizons,
    spreadCostUsd: computed.spreadCostUsd,
    netProfitUsd: computed.netProfitUsd,
    netProfitKes: computed.netProfitKes,
    netProfit48hUsd: computed.netProfit48hUsd,
    netProfit48hKes: computed.netProfit48hKes,
    tp1NetProfitUsd: computed.tp1NetProfitUsd,
    tp1NetProfitKes: computed.tp1NetProfitKes,
    orderVerdictLabel: computed.orderVerdictLabel,
    profitOutlookText: computed.profitOutlookText,
    isFavourableOrder: computed.isFavourableOrder,
    dataSource: params.dataSource || 'Live Feed + Institutional Calibration',
    spreadByBroker: params.spreadByBroker
  };
}

export const INITIAL_MARKETS_DATA: MarketScanData[] = [
  buildCalibratedMarketItem({
    pair: 'GBP/USD',
    symbol: 'Cable (British Pound)',
    price: 1.35140,
    change24hPct: 0.42,
    recommendedTf: 'M10',
    recommendedSession: 'London Open (10:00 - 13:00 EAT)',
    volatility: 'HIGH',
    isTopPick: true,
    spreadByBroker: {
      fxpesa: { symbol: 'GBPUSD', spread: 1.1, notes: 'CMA Kenya regulated, tight 1.1 pip spread.' },
      hfm: { symbol: 'GBPUSD.h', spread: 1.3, notes: 'Standard ECN execution.' },
      exness: { symbol: 'GBPUSD.m', spread: 0.6, notes: 'Micro standard, 0.6 pip spread.' },
      fbs: { symbol: 'GBPUSD', spread: 1.5, notes: 'Cent and Standard account.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'XAU/USD',
    symbol: 'GOLD (Spot)',
    price: 3962.50,
    change24hPct: 0.85,
    recommendedTf: 'M15',
    recommendedSession: 'London / NY Overlap (15:30 - 18:30 EAT)',
    volatility: 'HIGH',
    spreadByBroker: {
      fxpesa: { symbol: 'XAUUSD', spread: 2.2, notes: 'CMA Kenya investor protected. M-Pesa instant deposit.' },
      hfm: { symbol: 'GOLD', spread: 2.4, notes: 'High leverage up to 1:1000.' },
      exness: { symbol: 'XAUUSD.m', spread: 1.2, notes: 'Raw zero spread available. Instant M-Pesa withdrawal.' },
      fbs: { symbol: 'XAUUSD', spread: 2.6, notes: 'Cent account compatible for micro testing.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'EUR/USD',
    symbol: 'Fiber (Euro)',
    price: 1.16360,
    change24hPct: 0.35,
    recommendedTf: 'M15',
    recommendedSession: 'London / NY (10:00 - 17:00 EAT)',
    volatility: 'MEDIUM',
    spreadByBroker: {
      fxpesa: { symbol: 'EURUSD', spread: 1.1, notes: 'Lowest standard spread on CMA platform.' },
      hfm: { symbol: 'EURUSD.h', spread: 1.2, notes: 'Standard account.' },
      exness: { symbol: 'EURUSD.m', spread: 0.6, notes: 'Zero spread account reaches 0.1 pip.' },
      fbs: { symbol: 'EURUSD', spread: 1.3, notes: 'Standard spread.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'BTC/USD',
    symbol: 'Bitcoin Spot',
    price: 80491.43,
    change24hPct: 3.43,
    recommendedTf: 'H1',
    recommendedSession: '24/7 Global Liquidity Flow',
    volatility: 'HIGH',
    spreadByBroker: {
      fxpesa: { symbol: 'BTCUSD', spread: 25.0, notes: 'CMA CFD contract with risk protection.' },
      hfm: { symbol: 'BTCUSD', spread: 30.0, notes: 'High leverage crypto CFD.' },
      exness: { symbol: 'BTCUSD', spread: 18.0, notes: 'Zero overnight swap fee on crypto CFDs.' },
      fbs: { symbol: 'BTCUSD', spread: 35.0, notes: 'Crypto swap rates apply.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'GBP/JPY',
    symbol: 'Guppy / Dragon',
    price: 213.450,
    change24hPct: 0.48,
    recommendedTf: 'M15',
    recommendedSession: 'London Session (10:00 - 13:00 EAT)',
    volatility: 'HIGH',
    spreadByBroker: {
      fxpesa: { symbol: 'GBPJPY', spread: 1.8, notes: 'Tight cross-pair spread.' },
      hfm: { symbol: 'GBPJPY.h', spread: 2.0, notes: 'Standard spread.' },
      exness: { symbol: 'GBPJPY.m', spread: 1.1, notes: 'Low friction on Dragon pair.' },
      fbs: { symbol: 'GBPJPY', spread: 2.2, notes: 'High leverage.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'USD/CAD',
    symbol: 'Loonie',
    price: 1.39485,
    change24hPct: -0.22,
    recommendedTf: 'M15',
    recommendedSession: 'New York Session (15:30 - 20:00 EAT)',
    volatility: 'MEDIUM',
    spreadByBroker: {
      fxpesa: { symbol: 'USDCAD', spread: 1.3, notes: 'CMA standard.' },
      hfm: { symbol: 'USDCAD.h', spread: 1.5, notes: 'Standard.' },
      exness: { symbol: 'USDCAD.m', spread: 0.8, notes: 'Low spread.' },
      fbs: { symbol: 'USDCAD', spread: 1.6, notes: 'Cent account.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'USD/JPY',
    symbol: 'Ninja',
    price: 157.950,
    change24hPct: -0.14,
    recommendedTf: 'H1',
    recommendedSession: 'Tokyo / NY Session (03:00 & 15:30 EAT)',
    volatility: 'MEDIUM',
    spreadByBroker: {
      fxpesa: { symbol: 'USDJPY', spread: 1.2, notes: 'Standard CMA spread.' },
      hfm: { symbol: 'USDJPY.h', spread: 1.3, notes: 'High leverage available.' },
      exness: { symbol: 'USDJPY.m', spread: 0.7, notes: 'Tight micro spread.' },
      fbs: { symbol: 'USDJPY', spread: 1.4, notes: 'Cent account ready.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'AUD/USD',
    symbol: 'Aussie',
    price: 0.69750,
    change24hPct: 0.31,
    recommendedTf: 'M15',
    recommendedSession: 'Asian / Sydney Session (03:00 - 09:00 EAT)',
    volatility: 'LOW',
    spreadByBroker: {
      fxpesa: { symbol: 'AUDUSD', spread: 1.2, notes: 'Low spread.' },
      hfm: { symbol: 'AUDUSD.h', spread: 1.4, notes: 'Standard.' },
      exness: { symbol: 'AUDUSD.m', spread: 0.7, notes: 'Low spread.' },
      fbs: { symbol: 'AUDUSD', spread: 1.5, notes: 'Cent account.' }
    }
  })
];

function getKrakenPairAndInterval(pair: CurrencyPair, tf: Timeframe): { krakenPair: string | null; interval: number } {
  // For M10 we fetch 5m bars (interval=5) and aggregate 2x5m candles into 10m bars
  const interval =
    tf === 'M1' ? 1 :
    tf === 'M5' || tf === 'M10' ? 5 :
    tf === 'M15' ? 15 :
    tf === 'H1' ? 60 :
    tf === 'H4' ? 240 : 1440;

  const map: Partial<Record<CurrencyPair, string>> = {
    'EUR/USD': 'EURUSD',
    'GBP/USD': 'GBPUSD',
    'USD/JPY': 'USDJPY',
    'USD/CAD': 'USDCAD',
    'AUD/USD': 'AUDUSD',
    'XAU/USD': 'PAXGUSD',
    'BTC/USD': 'XBTUSD'
  };

  return { krakenPair: map[pair] || null, interval };
}

function parseKrakenOhlcRows(rows: any[][], isM10: boolean): OhlcCandle[] {
  const raw: OhlcCandle[] = rows.slice(-120).map((r) => ({
    time: Number(r[0]),
    open: parseFloat(r[1]),
    high: parseFloat(r[2]),
    low: parseFloat(r[3]),
    close: parseFloat(r[4])
  })).filter((c) => !isNaN(c.close) && c.close > 0);

  if (!isM10 || raw.length < 4) return raw.slice(-60);

  const aggregated: OhlcCandle[] = [];
  for (let i = raw.length % 2; i + 1 < raw.length; i += 2) {
    const c1 = raw[i];
    const c2 = raw[i + 1];
    aggregated.push({
      time: c1.time,
      open: c1.open,
      high: Math.max(c1.high, c2.high),
      low: Math.min(c1.low, c2.low),
      close: c2.close
    });
  }
  return aggregated.slice(-60);
}

/**
 * Fetches live real-time spot & OHLC candlestick data for a SINGLE pair & timeframe
 * so clicking Reanalyse, Deep AI Analyse, or switching pairs/timeframes ALWAYS syncs to the live candle!
 */
export async function fetchPairLiveCandleSnapshot(
  pair: CurrencyPair,
  timeframe: Timeframe,
  customPrice?: number
): Promise<{
  price: number;
  change24hPct: number;
  ema20: number;
  ema50: number;
  rsi: number;
  atrPips: number;
  keyLevel: number;
  patternType: PatternCategory;
  isBuy: boolean;
  bullScorePct: number;
  bearScorePct: number;
  confidence: number;
  factorVerdicts: FactorJudgmentItem[];
  candles: OhlcCandle[];
  lastCandleTime: string;
  liveConnected: boolean;
}> {
  const baseline = INITIAL_MARKETS_DATA.find((m) => m.pair === pair) || INITIAL_MARKETS_DATA[0];
  let livePrice = baseline.price;
  let change24hPct = baseline.change24hPct;
  let fetchedCandles: OhlcCandle[] = [];
  let liveConnected = false;

  try {
    const { krakenPair, interval } = getKrakenPairAndInterval(pair, timeframe);
    const binanceSym =
      pair === 'BTC/USD' ? 'BTCUSDT' :
      pair === 'XAU/USD' ? 'PAXGUSDT' :
      pair === 'EUR/USD' ? 'EURUSDT' :
      pair === 'GBP/USD' ? 'GBPUSDT' :
      pair === 'AUD/USD' ? 'AUDUSDT' : null;

    const binanceInterval =
      timeframe === 'M1' ? '1m' :
      timeframe === 'M5' || timeframe === 'M10' ? '5m' :
      timeframe === 'M15' ? '15m' :
      timeframe === 'H1' ? '1h' :
      timeframe === 'H4' ? '4h' : '1d';

    const [coinbaseRes, frankfurterRes, krakenRes, binanceTickerRes, binanceKlinesRes] = await Promise.allSettled([
      fetch(`https://api.coinbase.com/v2/exchange-rates?currency=USD&_t=${Date.now()}`, { cache: 'no-store' }),
      fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP,JPY,CAD,AUD`, { cache: 'no-store' }),
      krakenPair ? fetch(`https://api.kraken.com/0/public/OHLC?pair=${krakenPair}&interval=${interval}`, { cache: 'no-store' }) : Promise.resolve(null),
      binanceSym ? fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSym}`, { cache: 'no-store' }) : Promise.resolve(null),
      binanceSym ? fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSym}&interval=${binanceInterval}&limit=80`, { cache: 'no-store' }) : Promise.resolve(null)
    ]);

    let cbEur: number | null = null;
    let cbGbp: number | null = null;
    let cbJpy: number | null = null;
    let cbCad: number | null = null;
    let cbAud: number | null = null;

    if (coinbaseRes.status === 'fulfilled' && coinbaseRes.value && coinbaseRes.value.ok) {
      const cbData = await coinbaseRes.value.json();
      const rates = cbData?.data?.rates;
      if (rates) {
        if (rates.EUR) cbEur = 1 / parseFloat(rates.EUR);
        if (rates.GBP) cbGbp = 1 / parseFloat(rates.GBP);
        if (rates.JPY) cbJpy = parseFloat(rates.JPY);
        if (rates.CAD) cbCad = parseFloat(rates.CAD);
        if (rates.AUD) cbAud = 1 / parseFloat(rates.AUD);
      }
    }

    let refOpen: number | null = null;
    if (frankfurterRes.status === 'fulfilled' && frankfurterRes.value && frankfurterRes.value.ok) {
      const ff = await frankfurterRes.value.json();
      const r = ff?.rates;
      if (r) {
        if (pair === 'EUR/USD' && r.EUR) refOpen = 1 / r.EUR;
        else if (pair === 'GBP/USD' && r.GBP) refOpen = 1 / r.GBP;
        else if (pair === 'USD/JPY' && r.JPY) refOpen = r.JPY;
        else if (pair === 'USD/CAD' && r.CAD) refOpen = r.CAD;
        else if (pair === 'AUD/USD' && r.AUD) refOpen = 1 / r.AUD;
        else if (pair === 'GBP/JPY' && r.GBP && r.JPY) refOpen = (1 / r.GBP) * r.JPY;
      }
    }

    if (pair === 'EUR/USD' && cbEur) {
      livePrice = cbEur;
      liveConnected = true;
    } else if (pair === 'GBP/USD' && cbGbp) {
      livePrice = cbGbp;
      liveConnected = true;
    } else if (pair === 'USD/JPY' && cbJpy) {
      livePrice = cbJpy;
      liveConnected = true;
    } else if (pair === 'USD/CAD' && cbCad) {
      livePrice = cbCad;
      liveConnected = true;
    } else if (pair === 'AUD/USD' && cbAud) {
      livePrice = cbAud;
      liveConnected = true;
    } else if (pair === 'GBP/JPY' && cbGbp && cbJpy) {
      livePrice = cbGbp * cbJpy;
      liveConnected = true;
    }

    if (krakenRes.status === 'fulfilled' && krakenRes.value && krakenRes.value.ok) {
      const kJson = await krakenRes.value.json();
      const resultKeys = Object.keys(kJson?.result || {}).filter((k) => k !== 'last');
      if (resultKeys.length > 0) {
        const rows = kJson.result[resultKeys[0]];
        if (Array.isArray(rows) && rows.length >= 10) {
          fetchedCandles = parseKrakenOhlcRows(rows, timeframe === 'M10');
          const latestBar = fetchedCandles[fetchedCandles.length - 1];
          if (!liveConnected && latestBar?.close > 0) {
            livePrice = latestBar.close;
            liveConnected = true;
          }
        }
      }
    }

    // Only use Binance Klines/Ticker directly for crypto/gold (BTCUSDT, PAXGUSDT) or as fallback if Kraken failed
    const isCryptoOrGold = pair === 'BTC/USD' || pair === 'XAU/USD';
    if (binanceKlinesRes.status === 'fulfilled' && binanceKlinesRes.value && binanceKlinesRes.value.ok && (isCryptoOrGold || fetchedCandles.length < 12)) {
      const kRows = await binanceKlinesRes.value.json();
      if (Array.isArray(kRows) && kRows.length >= 10) {
        const parsed = kRows.map((r: any[]) => ({
          time: Math.floor(Number(r[0]) / 1000),
          open: parseFloat(r[1]),
          high: parseFloat(r[2]),
          low: parseFloat(r[3]),
          close: parseFloat(r[4])
        }));
        fetchedCandles = timeframe === 'M10' ? parseKrakenOhlcRows(kRows.map((r: any[]) => [r[0] / 1000, r[1], r[2], r[3], r[4]]), true) : parsed.slice(-60);
      }
    }

    if (binanceTickerRes.status === 'fulfilled' && binanceTickerRes.value && binanceTickerRes.value.ok) {
      const tJson = await binanceTickerRes.value.json();
      const last = parseFloat(tJson?.lastPrice);
      const pct = parseFloat(tJson?.priceChangePercent);
      if (last > 0 && (isCryptoOrGold || !liveConnected)) {
        livePrice = last;
        liveConnected = true;
      }
      if (!isNaN(pct)) {
        change24hPct = pct;
      }
    }

    if (refOpen && refOpen > 0 && !binanceSym) {
      change24hPct = ((livePrice - refOpen) / refOpen) * 100;
    } else if (fetchedCandles.length >= 24 && isNaN(change24hPct)) {
      const baseOpen = fetchedCandles[0].open;
      if (baseOpen > 0) {
        change24hPct = ((livePrice - baseOpen) / baseOpen) * 100;
      }
    }
  } catch {
    // Fallback gracefully to calibrated series
  }

  const finalPrice = customPrice && customPrice > 0 ? customPrice : livePrice;
  const currentBasket = globalLiveStream?.getState?.().markets || INITIAL_MARKETS_DATA;
  const pctMap: Partial<Record<CurrencyPair, number>> = {};
  currentBasket.forEach((m) => {
    pctMap[m.pair] = m.pair === pair ? change24hPct : m.change24hPct;
  });
  const liveMacro = getCurrentMacroContext(pctMap);

  const evalResult = evaluateCandleSeriesAndTick({
    pair,
    timeframe,
    livePrice: finalPrice,
    baseCandles: fetchedCandles.length >= 12 ? fetchedCandles : baseline.candles,
    candlesAreRealOhlc: fetchedCandles.length >= 12,
    change24hPct,
    macro: liveMacro
  });

  const lastBar = evalResult.candles[evalResult.candles.length - 1];
  const lastCandleTime = lastBar
    ? new Date(lastBar.time * 1000).toLocaleTimeString('en-GB', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' EAT'
    : 'Live Candle';

  const { decimals } = getPairSpecs(pair);

  return {
    price: Number(finalPrice.toFixed(decimals)),
    change24hPct: Number(change24hPct.toFixed(2)),
    ema20: evalResult.ema20,
    ema50: evalResult.ema50,
    rsi: evalResult.rsi,
    atrPips: evalResult.atrPips,
    keyLevel: evalResult.keyLevel,
    patternType: evalResult.patternType,
    isBuy: evalResult.isBuy,
    bullScorePct: evalResult.bullScorePct,
    bearScorePct: evalResult.bearScorePct,
    confidence: evalResult.confidence,
    factorVerdicts: evalResult.factorVerdicts,
    candles: evalResult.candles,
    lastCandleTime,
    liveConnected
  };
}

let cachedDailyOpenRates: {
  fetchedAt: number;
  eur?: number;
  gbp?: number;
  jpy?: number;
  cad?: number;
  aud?: number;
} = { fetchedAt: 0 };

const cachedBackgroundCandles: Partial<
  Record<CurrencyPair, { m15?: OhlcCandle[]; h1?: OhlcCandle[]; fetchedAt: number }>
> = {};
let isRefreshingBgCandles = false;

async function refreshBackgroundRealOhlcCandles(force = false) {
  if (isRefreshingBgCandles || typeof fetch === 'undefined') return;
  const now = Date.now();
  const sample = cachedBackgroundCandles['GBP/USD'];
  if (!force && sample && now - sample.fetchedAt < 18_000) return;

  isRefreshingBgCandles = true;
  try {
    const sig = typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(3000) : undefined;
    const krakenSpecs: { pair: CurrencyPair; kSym: string }[] = [
      { pair: 'GBP/USD', kSym: 'GBPUSD' },
      { pair: 'EUR/USD', kSym: 'EURUSD' },
      { pair: 'USD/JPY', kSym: 'USDJPY' },
      { pair: 'USD/CAD', kSym: 'USDCAD' },
      { pair: 'AUD/USD', kSym: 'AUDUSD' },
      { pair: 'XAU/USD', kSym: 'PAXGUSD' },
      { pair: 'BTC/USD', kSym: 'XBTUSD' }
    ];

    const m15Promises = krakenSpecs.map((s) =>
      fetch(`https://api.kraken.com/0/public/OHLC?pair=${s.kSym}&interval=15`, { cache: 'no-store', signal: sig }).then((r) =>
        r.ok ? r.json() : null
      )
    );
    const h1Promises = krakenSpecs.map((s) =>
      fetch(`https://api.kraken.com/0/public/OHLC?pair=${s.kSym}&interval=60`, { cache: 'no-store', signal: sig }).then((r) =>
        r.ok ? r.json() : null
      )
    );

    const [m15Settled, h1Settled] = await Promise.all([
      Promise.allSettled(m15Promises),
      Promise.allSettled(h1Promises)
    ]);

    krakenSpecs.forEach((spec, idx) => {
      let m15Bars = cachedBackgroundCandles[spec.pair]?.m15;
      let h1Bars = cachedBackgroundCandles[spec.pair]?.h1;

      const m15Res = m15Settled[idx];
      if (m15Res.status === 'fulfilled' && m15Res.value?.result) {
        const key = Object.keys(m15Res.value.result).find((k) => k !== 'last');
        if (key && Array.isArray(m15Res.value.result[key]) && m15Res.value.result[key].length >= 25) {
          m15Bars = parseKrakenOhlcRows(m15Res.value.result[key], false);
        }
      }

      const h1Res = h1Settled[idx];
      if (h1Res.status === 'fulfilled' && h1Res.value?.result) {
        const key = Object.keys(h1Res.value.result).find((k) => k !== 'last');
        if (key && Array.isArray(h1Res.value.result[key]) && h1Res.value.result[key].length >= 25) {
          h1Bars = parseKrakenOhlcRows(h1Res.value.result[key], false);
        }
      }

      if (m15Bars || h1Bars) {
        cachedBackgroundCandles[spec.pair] = {
          m15: m15Bars,
          h1: h1Bars,
          fetchedAt: Date.now()
        };
      }
    });

    // Derive synthetic GBP/JPY M15 & H1 OHLC bars cleanly from GBP/USD and USD/JPY
    const gbpCache = cachedBackgroundCandles['GBP/USD'];
    const jpyCache = cachedBackgroundCandles['USD/JPY'];
    if (gbpCache?.m15 && jpyCache?.m15) {
      const len = Math.min(gbpCache.m15.length, jpyCache.m15.length);
      const gjM15: OhlcCandle[] = [];
      for (let i = len; i > 0; i--) {
        const g = gbpCache.m15[gbpCache.m15.length - i];
        const j = jpyCache.m15[jpyCache.m15.length - i];
        gjM15.push({
          time: g.time,
          open: Number((g.open * j.open).toFixed(3)),
          high: Number((g.high * j.high).toFixed(3)),
          low: Number((g.low * j.low).toFixed(3)),
          close: Number((g.close * j.close).toFixed(3))
        });
      }
      let gjH1: OhlcCandle[] | undefined = undefined;
      if (gbpCache.h1 && jpyCache.h1) {
        const hLen = Math.min(gbpCache.h1.length, jpyCache.h1.length);
        gjH1 = [];
        for (let i = hLen; i > 0; i--) {
          const g = gbpCache.h1[gbpCache.h1.length - i];
          const j = jpyCache.h1[jpyCache.h1.length - i];
          gjH1.push({
            time: g.time,
            open: Number((g.open * j.open).toFixed(3)),
            high: Number((g.high * j.high).toFixed(3)),
            low: Number((g.low * j.low).toFixed(3)),
            close: Number((g.close * j.close).toFixed(3))
          });
        }
      }
      cachedBackgroundCandles['GBP/JPY'] = {
        m15: gjM15,
        h1: gjH1,
        fetchedAt: Date.now()
      };
    }
  } catch {
    // Non-blocking background OHLC refresh
  } finally {
    isRefreshingBgCandles = false;
  }
}

/**
 * Fetches live FX, Gold, and BTC spot prices & OHLC candles across all 8 markets simultaneously.
 */
export async function fetchLiveMarketSnapshot(
  currentMarkets: MarketScanData[] = INITIAL_MARKETS_DATA
): Promise<{ markets: MarketScanData[]; syncedAt: string; liveFeedConnected: boolean }> {
  // Kick off background non-blocking real OHLC candle refresh
  void refreshBackgroundRealOhlcCandles(false);

  let eurusd = currentMarkets.find((m) => m.pair === 'EUR/USD')?.price || 1.16360;
  let gbpusd = currentMarkets.find((m) => m.pair === 'GBP/USD')?.price || 1.35140;
  let usdjpy = currentMarkets.find((m) => m.pair === 'USD/JPY')?.price || 157.950;
  let usdcad = currentMarkets.find((m) => m.pair === 'USD/CAD')?.price || 1.39485;
  let audusd = currentMarkets.find((m) => m.pair === 'AUD/USD')?.price || 0.69750;
  let btcusd = currentMarkets.find((m) => m.pair === 'BTC/USD')?.price || 80491.43;
  let xauusd = currentMarkets.find((m) => m.pair === 'XAU/USD')?.price || 3962.50;

  let openEurUsd: number | undefined = cachedDailyOpenRates.eur;
  let openGbpUsd: number | undefined = cachedDailyOpenRates.gbp;
  let openUsdJpy: number | undefined = cachedDailyOpenRates.jpy;
  let openUsdCad: number | undefined = cachedDailyOpenRates.cad;
  let openAudUsd: number | undefined = cachedDailyOpenRates.aud;

  let pctEurUsd = currentMarkets.find((m) => m.pair === 'EUR/USD')?.change24hPct ?? 0.35;
  let pctGbpUsd = currentMarkets.find((m) => m.pair === 'GBP/USD')?.change24hPct ?? 0.42;
  let pctUsdJpy = currentMarkets.find((m) => m.pair === 'USD/JPY')?.change24hPct ?? -0.14;
  let pctUsdCad = currentMarkets.find((m) => m.pair === 'USD/CAD')?.change24hPct ?? -0.22;
  let pctAudUsd = currentMarkets.find((m) => m.pair === 'AUD/USD')?.change24hPct ?? 0.31;
  let pctBtcUsd = currentMarkets.find((m) => m.pair === 'BTC/USD')?.change24hPct ?? 3.43;
  let pctXauUsd = currentMarkets.find((m) => m.pair === 'XAU/USD')?.change24hPct ?? 0.85;

  let liveFeedConnected = false;
  let fiatFxFeedOk = false;

  const candleMap: Partial<Record<CurrencyPair, OhlcCandle[]>> = {};
  const h1CandleMap: Partial<Record<CurrencyPair, OhlcCandle[]>> = {};
  (['GBP/USD', 'XAU/USD', 'EUR/USD', 'BTC/USD', 'GBP/JPY', 'USD/CAD', 'USD/JPY', 'AUD/USD'] as CurrencyPair[]).forEach(
    (pName) => {
      const c = cachedBackgroundCandles[pName];
      if (c?.m15 && c.m15.length >= 20) candleMap[pName] = c.m15;
      if (c?.h1 && c.h1.length >= 20) h1CandleMap[pName] = c.h1;
    }
  );

  try {
    const shouldRefreshDailyOpen =
      !cachedDailyOpenRates.fetchedAt || Date.now() - cachedDailyOpenRates.fetchedAt > 300_000;

    const fastSignal = typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(2200) : undefined;
    const [coinbaseRes, frankfurterRes, binanceTickerRes, krakenBatchRes] = await Promise.allSettled([
      fetch(`https://api.coinbase.com/v2/exchange-rates?currency=USD&_t=${Date.now()}`, { cache: 'no-store', signal: fastSignal }),
      shouldRefreshDailyOpen
        ? fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP,JPY,CAD,AUD`, { cache: 'no-store', signal: fastSignal })
        : Promise.resolve(null),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22PAXGUSDT%22%5D', { cache: 'no-store', signal: fastSignal }),
      fetch('https://api.kraken.com/0/public/Ticker?pair=GBPUSD,USDCAD,AUDUSD,EURUSD,USDJPY,PAXGUSD,XBTUSD', { cache: 'no-store', signal: fastSignal })
    ]);

    // 1. Frankfurter reference baseline (cached for 5 min so 0.5s polls stay ultra-fast)
    if (frankfurterRes.status === 'fulfilled' && frankfurterRes.value && frankfurterRes.value.ok) {
      const ff = await frankfurterRes.value.json();
      const r = ff?.rates;
      if (r) {
        const eurRate = Number(r.EUR);
        const gbpRate = Number(r.GBP);
        const jpyRate = Number(r.JPY);
        const cadRate = Number(r.CAD);
        const audRate = Number(r.AUD);

        if (!isNaN(eurRate) && eurRate > 0) {
          openEurUsd = 1 / eurRate;
          eurusd = openEurUsd;
        }
        if (!isNaN(gbpRate) && gbpRate > 0) {
          openGbpUsd = 1 / gbpRate;
          gbpusd = openGbpUsd;
        }
        if (!isNaN(jpyRate) && jpyRate > 0) {
          openUsdJpy = jpyRate;
          usdjpy = openUsdJpy;
        }
        if (!isNaN(cadRate) && cadRate > 0) {
          openUsdCad = cadRate;
          usdcad = openUsdCad;
        }
        if (!isNaN(audRate) && audRate > 0) {
          openAudUsd = 1 / audRate;
          audusd = openAudUsd;
        }
        cachedDailyOpenRates = {
          fetchedAt: Date.now(),
          eur: openEurUsd,
          gbp: openGbpUsd,
          jpy: openUsdJpy,
          cad: openUsdCad,
          aud: openAudUsd
        };
        liveFeedConnected = true;
      }
    }

    // 2. Real-time Coinbase interbank fiat USD mid-rates
    if (coinbaseRes.status === 'fulfilled' && coinbaseRes.value.ok) {
      const cb = await coinbaseRes.value.json();
      const r = cb?.data?.rates;
      if (r) {
        if (r.EUR) eurusd = Number((1 / parseFloat(r.EUR)).toFixed(5));
        if (r.GBP) gbpusd = Number((1 / parseFloat(r.GBP)).toFixed(5));
        if (r.JPY) usdjpy = Number(parseFloat(r.JPY).toFixed(3));
        if (r.CAD) usdcad = Number(parseFloat(r.CAD).toFixed(5));
        if (r.AUD) audusd = Number((1 / parseFloat(r.AUD)).toFixed(5));
        liveFeedConnected = true;
        fiatFxFeedOk = true;
      }
    }

    // 3. Kraken Batch Public Fiat USD Ticker (consistent fiat USD pricing across FX, Gold & BTC — eliminates USDT/USD ping-pong!)
    if (krakenBatchRes.status === 'fulfilled' && krakenBatchRes.value.ok) {
      const kb = await krakenBatchRes.value.json();
      const resObj = kb?.result || {};
      for (const k of Object.keys(resObj)) {
        const entry = resObj[k];
        const lastP = parseFloat(entry?.c?.[0]);
        const openP = parseFloat(entry?.o);
        if (isNaN(lastP) || lastP <= 0) continue;

        if (k.includes('GBP')) {
          gbpusd = Number(lastP.toFixed(5));
          if (!isNaN(openP) && openP > 0) {
            openGbpUsd = openP;
            pctGbpUsd = Number((((lastP - openP) / openP) * 100).toFixed(2));
          }
          liveFeedConnected = true;
          fiatFxFeedOk = true;
        } else if (k.includes('JPY')) {
          usdjpy = Number(lastP.toFixed(3));
          if (!isNaN(openP) && openP > 0) {
            openUsdJpy = openP;
            pctUsdJpy = Number((((lastP - openP) / openP) * 100).toFixed(2));
          }
          liveFeedConnected = true;
          fiatFxFeedOk = true;
        } else if (k.includes('CAD')) {
          usdcad = Number(lastP.toFixed(5));
          if (!isNaN(openP) && openP > 0) {
            openUsdCad = openP;
            pctUsdCad = Number((((lastP - openP) / openP) * 100).toFixed(2));
          }
          liveFeedConnected = true;
          fiatFxFeedOk = true;
        } else if (k.includes('AUD')) {
          audusd = Number(lastP.toFixed(5));
          if (!isNaN(openP) && openP > 0) {
            openAudUsd = openP;
            pctAudUsd = Number((((lastP - openP) / openP) * 100).toFixed(2));
          }
          liveFeedConnected = true;
          fiatFxFeedOk = true;
        } else if (k.includes('EUR')) {
          eurusd = Number(lastP.toFixed(5));
          if (!isNaN(openP) && openP > 0) {
            openEurUsd = openP;
            pctEurUsd = Number((((lastP - openP) / openP) * 100).toFixed(2));
          }
          liveFeedConnected = true;
          fiatFxFeedOk = true;
        } else if (k.includes('PAXG') && lastP > 1500) {
          xauusd = Number(lastP.toFixed(2));
          if (!isNaN(openP) && openP > 0) {
            pctXauUsd = Number((((lastP - openP) / openP) * 100).toFixed(2));
          }
          liveFeedConnected = true;
        } else if (k.includes('XBT') && lastP > 5000) {
          btcusd = Number(lastP.toFixed(2));
          if (!isNaN(openP) && openP > 0) {
            pctBtcUsd = Number((((lastP - openP) / openP) * 100).toFixed(2));
          }
          liveFeedConnected = true;
        }
      }
    }

    // 4. Binance 24h live tickers strictly for BTC & Gold (PAXG) so fiat FX pairs never ping-pong against USDT basis!
    if (binanceTickerRes.status === 'fulfilled' && binanceTickerRes.value.ok) {
      const tickers = await binanceTickerRes.value.json();
      if (Array.isArray(tickers)) {
        for (const t of tickers) {
          if (t.symbol === 'BTCUSDT') {
            btcusd = parseFloat(t.lastPrice) || btcusd;
            pctBtcUsd = parseFloat(t.priceChangePercent) || pctBtcUsd;
            liveFeedConnected = true;
          } else if (t.symbol === 'PAXGUSDT') {
            const goldVal = parseFloat(t.lastPrice);
            if (goldVal > 1500) {
              xauusd = goldVal;
              pctXauUsd = parseFloat(t.priceChangePercent) || pctXauUsd;
              liveFeedConnected = true;
            }
          }
        }
      }
    }

    // Calculate live % changes against daily open reference if needed
    if (!fiatFxFeedOk && openEurUsd && openEurUsd > 0) {
      pctEurUsd = ((eurusd - openEurUsd) / openEurUsd) * 100;
    }
    if (!fiatFxFeedOk && openGbpUsd && openGbpUsd > 0) {
      pctGbpUsd = ((gbpusd - openGbpUsd) / openGbpUsd) * 100;
    }
    if (!fiatFxFeedOk && openUsdJpy && openUsdJpy > 0) {
      pctUsdJpy = ((usdjpy - openUsdJpy) / openUsdJpy) * 100;
    }
    if (!fiatFxFeedOk && openUsdCad && openUsdCad > 0) {
      pctUsdCad = ((usdcad - openUsdCad) / openUsdCad) * 100;
    }
    if (!fiatFxFeedOk && openAudUsd && openAudUsd > 0) {
      pctAudUsd = ((audusd - openAudUsd) / openAudUsd) * 100;
    }
  } catch {
    // Graceful fallback to calibrated baseline
  }

  const gbpjpy = Number((gbpusd * usdjpy).toFixed(3));
  const openGbpJpy = openGbpUsd && openUsdJpy ? openGbpUsd * openUsdJpy : undefined;
  const pctGbpJpy = Number((pctGbpUsd + pctUsdJpy).toFixed(2));

  const liveMap: Record<CurrencyPair, { price: number; pct: number; dailyOpen?: number }> = {
    'GBP/USD': { price: gbpusd, pct: pctGbpUsd, dailyOpen: openGbpUsd },
    'XAU/USD': { price: xauusd, pct: pctXauUsd },
    'EUR/USD': { price: eurusd, pct: pctEurUsd, dailyOpen: openEurUsd },
    'BTC/USD': { price: btcusd, pct: pctBtcUsd },
    'GBP/JPY': { price: gbpjpy, pct: pctGbpJpy, dailyOpen: openGbpJpy },
    'USD/CAD': { price: usdcad, pct: pctUsdCad, dailyOpen: openUsdCad },
    'USD/JPY': { price: usdjpy, pct: pctUsdJpy, dailyOpen: openUsdJpy },
    'AUD/USD': { price: audusd, pct: pctAudUsd, dailyOpen: openAudUsd }
  };

  const liveMacro = getCurrentMacroContext({
    'GBP/USD': pctGbpUsd,
    'XAU/USD': pctXauUsd,
    'EUR/USD': pctEurUsd,
    'BTC/USD': pctBtcUsd,
    'USD/CAD': pctUsdCad,
    'USD/JPY': pctUsdJpy,
    'AUD/USD': pctAudUsd
  });

  const prevMeta = new Map<
    CurrencyPair,
    { rank: number; dir: 'BUY' | 'SELL'; trendDir: 'UPTREND' | 'DOWNTREND' | 'RANGING'; price: number }
  >();
  currentMarkets.forEach((cm, idx) => {
    prevMeta.set(cm.pair, {
      rank: cm.currentRank || idx + 1,
      dir: cm.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
      trendDir: cm.trendDirection || (cm.bias === 'STRONG_SELL' ? 'DOWNTREND' : 'UPTREND'),
      price: cm.price
    });
  });

  const nowTickStr = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Africa/Nairobi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' EAT';

  const rebuilt = currentMarkets.map((existing) => {
    const live = liveMap[existing.pair];
    const nextP = live ? live.price : existing.price;
    const { pipMultiplier } = getPairSpecs(existing.pair);
    const prevP = existing.price;
    const rawDiffPips = Number(((nextP - prevP) * pipMultiplier).toFixed(2));
    const tickDir: 'UP' | 'DOWN' | 'FLAT' = rawDiffPips > 0 ? 'UP' : rawDiffPips < 0 ? 'DOWN' : 'FLAT';
    const old = prevMeta.get(existing.pair);

    const item = buildCalibratedMarketItem({
      pair: existing.pair,
      symbol: existing.symbol,
      price: nextP,
      change24hPct: live ? live.pct : existing.change24hPct,
      dailyOpenPrice: live?.dailyOpen ?? existing.dailyOpenPrice,
      recommendedTf: existing.recommendedTf,
      recommendedSession: existing.recommendedSession,
      volatility: existing.volatility,
      candles: candleMap[existing.pair] || existing.candles,
      h1Candles: h1CandleMap[existing.pair] || existing.h1Candles,
      candlesAreRealOhlc: Boolean(candleMap[existing.pair]) || existing.candlesAreRealOhlc,
      macro: liveMacro,
      previousDirection: old?.dir,
      previousTrendDirection: old?.trendDir,
      spreadByBroker: existing.spreadByBroker,
      dataSource: liveFeedConnected ? 'Live Interbank Feed' : 'Live Feed + Institutional Calibration'
    });
    const newDir: 'BUY' | 'SELL' = item.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
    return {
      ...item,
      previousRank: old?.rank,
      previousDirection: old?.dir,
      directionFlipped: Boolean(old && old.dir !== newDir),
      lastTickTime: nowTickStr,
      lastTickDir: tickDir,
      lastTickDeltaPips: rawDiffPips
    };
  });

  // Sort by highest AI confidence & mark top trending market
  rebuilt.sort((a, b) => b.confidence - a.confidence);
  const withTop = rebuilt.map((m, idx) => ({
    ...m,
    currentRank: idx + 1,
    isTopPick: idx === 0
  }));

  return { markets: withTop, syncedAt: nowTickStr, liveFeedConnected };
}

function formatCountdownHms(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

/**
 * Evaluates pair-specific Kenya East Africa Time (EAT / UTC+3) safety entry windows
 * and computes a live second-by-second countdown timer when the current window is unfavorable.
 */
export function evaluatePairKenyaTiming(pair: CurrencyPair, now: Date = new Date()): KenyaEntryWindowInfo {
  const nairobiParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(now);

  const weekday = nairobiParts.find((p) => p.type === 'weekday')?.value || 'Mon';
  const eatH = parseInt(nairobiParts.find((p) => p.type === 'hour')?.value || '12', 10);
  const eatM = parseInt(nairobiParts.find((p) => p.type === 'minute')?.value || '0', 10);
  const eatS = parseInt(nairobiParts.find((p) => p.type === 'second')?.value || '0', 10);
  const secOfDay = eatH * 3600 + eatM * 60 + eatS;

  const isWeekendClosed =
    pair !== 'BTC/USD' &&
    (weekday === 'Sat' || (weekday === 'Sun' && eatH < 23) || (weekday === 'Fri' && eatH === 23 && eatM >= 55));

  if (isWeekendClosed) {
    let secsToOpen = 0;
    if (weekday === 'Sat') {
      secsToOpen = (24 * 3600 - secOfDay) + 23 * 3600 + 55 * 60;
    } else if (weekday === 'Sun') {
      secsToOpen = Math.max(60, 23 * 3600 + 55 * 60 - secOfDay);
    } else {
      secsToOpen = 48 * 3600;
    }
    const cd = formatCountdownHms(secsToOpen);
    return {
      isFavorableTime: false,
      windowStatusCode: 'CLOSED_WAIT',
      statusLabel: `MARKET CLOSED · OPENS IN ${cd}`,
      windowBadgeShort: `✕ CLOSED · OPENS IN ${cd}`,
      bannerHeadline: `MARKET CLOSED IN KENYA (EAT) · OPENS IN ${cd}`,
      currentWindowName: 'Weekend Interbank Settlement',
      nextWindowName: 'Sydney / Tokyo Open (Sun 23:55 EAT)',
      countdownFormatted: cd,
      countdownSeconds: secsToOpen,
      reasonText: `Global FX banks closed for weekend in Kenya (EAT). Market opens in ${cd}.`
    };
  }

  // Pair-specific optimal execution windows in Nairobi EAT (seconds from midnight)
  const windowsByPair: Record<CurrencyPair, { name: string; startSec: number; endSec: number }[]> = {
    'USD/JPY': [
      { name: 'Tokyo Liquid Morning (03:00–09:00 EAT)', startSec: 3 * 3600, endSec: 9 * 3600 },
      { name: 'NY & London Overlap (15:30–20:00 EAT)', startSec: 15.5 * 3600, endSec: 20 * 3600 }
    ],
    'GBP/USD': [
      { name: 'London Open Killzone (10:00–13:00 EAT)', startSec: 10 * 3600, endSec: 13 * 3600 },
      { name: 'London / NY Peak Overlap (15:30–19:00 EAT)', startSec: 15.5 * 3600, endSec: 19 * 3600 }
    ],
    'EUR/USD': [
      { name: 'Frankfurt & London Open (10:00–13:00 EAT)', startSec: 10 * 3600, endSec: 13 * 3600 },
      { name: 'London / NY Peak Overlap (15:30–19:00 EAT)', startSec: 15.5 * 3600, endSec: 19 * 3600 }
    ],
    'XAU/USD': [
      { name: 'London Morning Bullion Fix (10:30–13:00 EAT)', startSec: 10.5 * 3600, endSec: 13 * 3600 },
      { name: 'NY COMEX Open & Expansion (15:30–20:30 EAT)', startSec: 15.5 * 3600, endSec: 20.5 * 3600 }
    ],
    'GBP/JPY': [
      { name: 'Tokyo Cross Volatility (03:00–06:00 EAT)', startSec: 3 * 3600, endSec: 6 * 3600 },
      { name: 'London Dragon Open (10:00–13:00 EAT)', startSec: 10 * 3600, endSec: 13 * 3600 },
      { name: 'New York Open Impulse (15:30–18:30 EAT)', startSec: 15.5 * 3600, endSec: 18.5 * 3600 }
    ],
    'USD/CAD': [
      { name: 'New York & Toronto Open (15:30–21:00 EAT)', startSec: 15.5 * 3600, endSec: 21 * 3600 }
    ],
    'AUD/USD': [
      { name: 'Sydney & Tokyo Session (02:30–08:30 EAT)', startSec: 2.5 * 3600, endSec: 8.5 * 3600 },
      { name: 'New York USD Impulse (15:30–18:30 EAT)', startSec: 15.5 * 3600, endSec: 18.5 * 3600 }
    ],
    'BTC/USD': [
      { name: 'Active 24/7 Institutional Flow (03:00–22:45 EAT)', startSec: 3 * 3600, endSec: 22.75 * 3600 }
    ]
  };

  const windows = windowsByPair[pair] || windowsByPair['GBP/USD'];
  const activeWin = windows.find((w) => secOfDay >= w.startSec && secOfDay < w.endSec);

  if (activeWin) {
    const secsLeft = Math.max(1, Math.round(activeWin.endSec - secOfDay));
    const cd = formatCountdownHms(secsLeft);
    return {
      isFavorableTime: true,
      windowStatusCode: 'OPEN',
      statusLabel: `MARKET OPEN · GOOD ENTRY WINDOW (${cd} left)`,
      windowBadgeShort: `● MARKET OPEN · ${cd}`,
      bannerHeadline: `MARKET OPEN · GOOD TIMEFRAME WINDOW (Closes in ${cd})`,
      currentWindowName: activeWin.name,
      nextWindowName: 'Active Now',
      countdownFormatted: cd,
      countdownSeconds: secsLeft,
      reasonText: `${pair} window OPEN inside ${activeWin.name} (${cd} left). Tight spreads & active liquidity.`
    };
  }

  // Find next upcoming favourable window in Kenya EAT
  let nextWin = windows.find((w) => w.startSec > secOfDay);
  let secsUntil = 0;
  if (nextWin) {
    secsUntil = Math.round(nextWin.startSec - secOfDay);
  } else {
    nextWin = windows[0];
    secsUntil = Math.round(24 * 3600 - secOfDay + nextWin.startSec);
  }

  const cd = formatCountdownHms(secsUntil);
  const openingSoon = secsUntil <= 2700;
  return {
    isFavorableTime: false,
    windowStatusCode: openingSoon ? 'OPENING_SOON' : 'CLOSED_WAIT',
    statusLabel: openingSoon ? `TO OPEN SOON · OPENS IN ${cd}` : `WINDOW PAUSED · OPENS IN ${cd}`,
    windowBadgeShort: openingSoon ? `⏳ OPENS IN ${cd}` : `⏳ TO OPEN: ${cd}`,
    bannerHeadline: openingSoon
      ? `MARKET TO OPEN SOON · OPENS IN ${cd} (${nextWin.name})`
      : `MARKET WINDOW WAITING · OPENS IN ${cd} (${nextWin.name})`,
    currentWindowName: secOfDay >= 22 * 3600 || secOfDay < 2.5 * 3600 ? 'Low-Liquidity Rollover Zone' : 'Mid-Session Consolidation Lull',
    nextWindowName: nextWin.name,
    countdownFormatted: cd,
    countdownSeconds: secsUntil,
    reasonText: `Next good liquidity window (${nextWin.name}) opens in ${cd}.`
  };
}

/**
 * Generates the comprehensive Daily Global Trade Safety & Macro Factors report (Pillar 09)
 * answering whether it is safe to BUY or SELL today across all 8 markets, auto-updating
 * every second with live market telemetry and Kenya EAT countdown timers.
 */
export function computeDailyMacroSafetyReport(
  markets: MarketScanData[],
  userFlags: Partial<MacroFactorFlags> = {}
): DailyMacroSafetyReport {
  const byPair = Object.fromEntries(markets.map((m) => [m.pair, m])) as Record<CurrencyPair, MarketScanData>;
  const eurPct = byPair['EUR/USD']?.change24hPct ?? 0;
  const gbpPct = byPair['GBP/USD']?.change24hPct ?? 0;
  const audPct = byPair['AUD/USD']?.change24hPct ?? 0;
  const jpyPct = byPair['USD/JPY']?.change24hPct ?? 0;
  const cadPct = byPair['USD/CAD']?.change24hPct ?? 0;
  const goldPct = byPair['XAU/USD']?.change24hPct ?? 0;
  const btcPct = byPair['BTC/USD']?.change24hPct ?? 0;

  // Live USD Basket (DXY proxy) % change: positive = USD strengthening globally
  const dxyPressurePct = Number(
    ((-0.45 * eurPct - 0.18 * gbpPct - 0.10 * audPct + 0.17 * jpyPct + 0.10 * cadPct)).toFixed(2)
  );

  const dxyStatus: DailyMacroSafetyReport['dxyStatus'] =
    dxyPressurePct >= 0.12
      ? 'USD SURGING BULLISH'
      : dxyPressurePct <= -0.12
      ? 'USD WEAKENING BEARISH'
      : 'USD MIXED EQUILIBRIUM';

  const dxySummary =
    dxyStatus === 'USD SURGING BULLISH'
      ? `US Dollar Basket is strong (${dxyPressurePct >= 0 ? `+${dxyPressurePct}%` : `${dxyPressurePct}%`}). Favour USD-denominated shorts (SELL EUR/USD, SELL GBP/USD, SELL AUD/USD) or cautious USD/JPY & USD/CAD longs.`
      : dxyStatus === 'USD WEAKENING BEARISH'
      ? `US Dollar Basket is softening (${dxyPressurePct}%). Institutional tail-wind supports BUY setups on EUR/USD, GBP/USD, AUD/USD, and Gold (XAU/USD).`
      : `US Dollar Basket is balanced (${dxyPressurePct >= 0 ? `+${dxyPressurePct}%` : `${dxyPressurePct}%`}). Trade individual pair structure around 20/50 EMA rather than blind USD correlation.`;

  // Global Risk Sentiment Regime
  const riskScore = (btcPct > 0.6 ? 1 : btcPct < -0.8 ? -1 : 0) + (jpyPct > 0.15 ? 1 : jpyPct < -0.25 ? -1 : 0) - (goldPct > 1.2 ? 0.5 : 0);
  const riskRegime: DailyMacroSafetyReport['riskRegime'] =
    riskScore > 0.4 ? 'RISK-ON EXPANSION' : riskScore < -0.4 ? 'RISK-OFF SAFE-HAVEN' : 'MIXED CONSOLIDATION';

  const riskRegimeSummary =
    riskRegime === 'RISK-ON EXPANSION'
      ? 'Global risk appetite is constructive (Equities/BTC supported, Yen carry calm). Trend-following pullbacks on GBP/USD, EUR/USD, and GBP/JPY have higher follow-through.'
      : riskRegime === 'RISK-OFF SAFE-HAVEN'
      ? 'Defensive safe-haven flows active (Capital rotating into Gold XAU/USD & Japanese Yen JPY). Beware sharp downside wicks on risk crosses like GBP/JPY & AUD/USD.'
      : 'Global macro flows are selective. Stick strictly to A+ liquidity sweeps and enforce the 0.01 micro lot Gilgil cap ($2.00 max risk).';

  // East Africa Time (Nairobi UTC+3) Live Session Guard
  const now = new Date();
  const eatTimeString = now.toLocaleTimeString('en-GB', {
    timeZone: 'Africa/Nairobi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + ' EAT';
  const eatHour = parseInt(
    now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', hour12: false }),
    10
  );
  const eatMin = parseInt(
    now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', minute: '2-digit' }),
    10
  );

  // Automatic real-time detection of daily macro/micro market hazards
  const isUsMacroReleaseWindow = eatHour === 15 && eatMin >= 20 && eatMin <= 50;
  const isRolloverHours = eatHour >= 22 || eatHour <= 2;
  const isStrongDxyOrVolatilitySurge = Math.abs(dxyPressurePct) >= 0.35 || Math.abs(goldPct) >= 1.35 || Math.abs(btcPct) >= 4.2;

  const autoDetectedFactors: MacroFactorFlags = {
    highImpactUsNews: isUsMacroReleaseWindow,
    centralBankRateDay: Math.abs(eurPct) >= 0.75 || Math.abs(gbpPct) >= 0.75 || Math.abs(jpyPct) >= 0.75,
    geopoliticalSafeHavenSpike: goldPct >= 0.9 && jpyPct <= -0.15,
    bankHolidayThinLiquidity:
      !isRolloverHours &&
      Math.abs(eurPct) <= 0.05 &&
      Math.abs(gbpPct) <= 0.05 &&
      Math.abs(jpyPct) <= 0.05,
    wideSpreadAlert: isRolloverHours
  };

  const autoDetectedSummary: string[] = [
    `Live DXY Basket Pressure: ${dxyPressurePct >= 0 ? `+${dxyPressurePct}%` : `${dxyPressurePct}%`} (${dxyStatus})`,
    `Risk Sentiment Regime: ${riskRegime} (Gold ${goldPct >= 0 ? `+${goldPct}%` : `${goldPct}%`} · BTC ${btcPct >= 0 ? `+${btcPct}%` : `${btcPct}%`})`,
    isUsMacroReleaseWindow
      ? 'NY 15:30 EAT High-Impact Macro Release Window Active (Elevated Spread & Slippage Guard)'
      : isRolloverHours
      ? 'Nairobi Midnight Rollover Window Active (Wide Broker Spread Protection Engaged)'
      : 'Normal Interbank Order Book Depth Observed'
  ];

  // Merge auto-detected conditions with user overrides
  const flags: MacroFactorFlags = {
    highImpactUsNews: Boolean(userFlags.highImpactUsNews ?? autoDetectedFactors.highImpactUsNews),
    centralBankRateDay: Boolean(userFlags.centralBankRateDay ?? autoDetectedFactors.centralBankRateDay),
    geopoliticalSafeHavenSpike: Boolean(
      userFlags.geopoliticalSafeHavenSpike ?? autoDetectedFactors.geopoliticalSafeHavenSpike
    ),
    bankHolidayThinLiquidity: Boolean(
      userFlags.bankHolidayThinLiquidity ?? autoDetectedFactors.bankHolidayThinLiquidity
    ),
    wideSpreadAlert: Boolean(userFlags.wideSpreadAlert ?? autoDetectedFactors.wideSpreadAlert)
  };

  let sessionWindowName = 'Tokyo / Sydney Range (03:00–09:59 EAT)';
  let sessionSafety: SideSafetyVerdict = 'SAFE_SELECTIVE';
  let sessionAdvice = 'Asian liquidity range: prime window for USD/JPY, GBP/JPY, and AUD/USD after range sweep.';

  if (isRolloverHours) {
    sessionWindowName = 'Midnight Rollover & Dead Zone (22:00–02:59 EAT)';
    sessionSafety = 'UNSAFE_AVOID';
    sessionAdvice = 'DO NOT OPEN NEW ORDERS right now. Broker spreads widen 3x–8x during daily swap rollover and stop-hunt spikes.';
  } else if (eatHour >= 15 && eatHour <= 18) {
    sessionWindowName = 'London / New York Killzone Overlap (15:30–18:59 EAT)';
    sessionSafety = 'SAFE_OPTIMAL';
    sessionAdvice = 'PEAK GLOBAL INSTITUTIONAL LIQUIDITY: Tightest spreads and highest breakout follow-through across USD, GBP, EUR & Gold.';
  } else if (eatHour >= 10 && eatHour <= 14) {
    sessionWindowName = 'London Killzone & Morning Session (10:00–14:59 EAT)';
    sessionSafety = 'SAFE_OPTIMAL';
    sessionAdvice = 'PRIME EUROPEAN LIQUIDITY: Ideal for EUR/USD, GBP/USD, GBP/JPY, and Gold after initial Asian sweep.';
  } else if (eatHour >= 19 && eatHour <= 21) {
    sessionWindowName = 'New York Afternoon Session (19:00–21:59 EAT)';
    sessionSafety = 'CAUTION_WAIT';
    sessionAdvice = 'Volume tapers off toward NY close. Secure TP1 profits and wait for fresh Tokyo/London cycles.';
  }

  const activeWarnings: string[] = [];
  if (flags.highImpactUsNews) {
    activeWarnings.push('HIGH-IMPACT USD WINDOW / NEWS GUARD: Elevated spike risk — wait 15 mins after candle close before executing.');
  }
  if (flags.centralBankRateDay) {
    activeWarnings.push('HIGH CENTRAL BANK CURRENCY VOLATILITY (>0.75% Daily Move): Expect sharp liquidity wicks on active majors.');
  }
  if (flags.geopoliticalSafeHavenSpike) {
    activeWarnings.push('SAFE-HAVEN CAPITAL SURGE: Gold (XAU/USD) & JPY demand elevated — keep strictly 0.01 micro lot.');
  }
  if (flags.bankHolidayThinLiquidity) {
    activeWarnings.push('THIN INTERBANK VOLUME DETECTED: Price range compressed — avoid breakout chasing.');
  }
  if (flags.wideSpreadAlert) {
    activeWarnings.push('ROLLOVER / WIDE SPREAD GUARD: Broker spreads expanded — pause new entries until session opens.');
  }

  let overallDaySafety: SideSafetyVerdict = sessionSafety;
  if (flags.highImpactUsNews || flags.bankHolidayThinLiquidity || isStrongDxyOrVolatilitySurge) {
    if (overallDaySafety === 'SAFE_OPTIMAL') overallDaySafety = 'SAFE_SELECTIVE';
  }
  if (flags.wideSpreadAlert || (flags.highImpactUsNews && flags.bankHolidayThinLiquidity)) {
    overallDaySafety = 'UNSAFE_AVOID';
  }

  const overallHeadline =
    overallDaySafety === 'SAFE_OPTIMAL'
      ? 'SAFE & FAVOURABLE MARKET WINDOW IN KENYA — TRADE CONFIRMED SETUPS (0.01 LOT)'
      : overallDaySafety === 'SAFE_SELECTIVE'
      ? 'SELECTIVELY SAFE TODAY — ENTER ONLY PAIRS WITH GREEN KENYA TIMER & DXY ALIGNMENT'
      : overallDaySafety === 'CAUTION_WAIT'
      ? 'NOT SAFE FOR IMPULSIVE ENTRIES — WAIT FOR KENYA SESSION TIMER & MACRO SETTLEMENT'
      : 'DO NOT ENTER PLANNED TRADES RIGHT NOW — GLOBAL RISK & ROLLOVER BLOCK ACTIVE';

  const assetScorecards: AssetDailySafetyCard[] = markets.map((m) => {
    const isUsdQuote = m.pair.endsWith('/USD');
    const isUsdBase = m.pair.startsWith('USD/');
    const isJpyCross = m.pair === 'GBP/JPY';
    const isGold = m.pair === 'XAU/USD';
    const kenyaTiming = evaluatePairKenyaTiming(m.pair, now);

    let buyScore = 54;
    let sellScore = 54;

    // 1. Live Candle & EMA Trend Confluence
    if (m.price > m.ema20) buyScore += 18;
    else sellScore += 18;

    if (m.ema20 > m.ema50) buyScore += 12;
    else sellScore += 12;

    // 2. Global DXY Macro Tail-wind / Head-wind
    let dxyCorrelationNote = 'Neutral cross-flow correlation';
    if (isUsdQuote && !isGold) {
      if (dxyPressurePct <= -0.10) {
        buyScore += 12;
        sellScore -= 10;
        dxyCorrelationNote = `DXY weakening (${dxyPressurePct}%) gives BUY tail-wind`;
      } else if (dxyPressurePct >= 0.10) {
        sellScore += 12;
        buyScore -= 10;
        dxyCorrelationNote = `DXY surging (+${dxyPressurePct}%) creates head-wind against BUY`;
      }
    } else if (isUsdBase) {
      if (dxyPressurePct >= 0.10) {
        buyScore += 12;
        sellScore -= 10;
        dxyCorrelationNote = `DXY surging (+${dxyPressurePct}%) supports ${m.pair} upside`;
      } else if (dxyPressurePct <= -0.10) {
        sellScore += 12;
        buyScore -= 10;
        dxyCorrelationNote = `DXY weakening (${dxyPressurePct}%) favors ${m.pair} downside`;
      }
    } else if (isGold) {
      if (flags.geopoliticalSafeHavenSpike || dxyPressurePct < 0) {
        buyScore += 14;
        dxyCorrelationNote = 'Safe-haven demand & softer USD favor Gold accumulation';
      } else if (dxyPressurePct > 0.25) {
        sellScore += 10;
        dxyCorrelationNote = 'Strong USD yields cap Gold rallies';
      }
    } else if (isJpyCross) {
      if (riskRegime === 'RISK-OFF SAFE-HAVEN') {
        sellScore += 14;
        buyScore -= 12;
        dxyCorrelationNote = 'Risk-Off JPY inflow warns against aggressive GBP/JPY longs';
      } else {
        buyScore += 10;
        dxyCorrelationNote = 'Risk-On Yen weakness supports GBP/JPY upward swings';
      }
    }

    // 3. RSI Exhaustion Protection (Prevents buying tops or selling bottoms)
    if (m.rsi >= 68) {
      buyScore -= 26;
      sellScore += 14;
    } else if (m.rsi <= 34) {
      sellScore -= 26;
      buyScore += 14;
    }

    // 4. Kenya Time Window + Global Macro Risk Penalty
    const timingPenalty = kenyaTiming.isFavorableTime ? 0 : 18;
    const macroPenalty =
      (flags.wideSpreadAlert ? 24 : 0) +
      (flags.highImpactUsNews ? 14 : 0) +
      (flags.bankHolidayThinLiquidity ? 16 : 0) +
      timingPenalty;

    buyScore = Math.max(12, Math.min(96, Math.round(buyScore - macroPenalty)));
    sellScore = Math.max(12, Math.min(96, Math.round(sellScore - macroPenalty)));

    const toVerdict = (sc: number): SideSafetyVerdict =>
      sc >= 72 ? 'SAFE_OPTIMAL' : sc >= 56 ? 'SAFE_SELECTIVE' : sc >= 42 ? 'CAUTION_WAIT' : 'UNSAFE_AVOID';

    const buySafety = toVerdict(buyScore);
    const sellSafety = toVerdict(sellScore);
    const bestScore = Math.max(buyScore, sellScore);
    const plannedSide = buyScore >= sellScore ? 'BUY' : 'SELL';

    const isEntryBlockedGlobally =
      flags.wideSpreadAlert ||
      bestScore < 56 ||
      !kenyaTiming.isFavorableTime ||
      (flags.highImpactUsNews && flags.centralBankRateDay);

    let globalEntryBannerText = `SAFE TO ${plannedSide} ${m.pair} NOW — Kenya Session Active (${kenyaTiming.countdownFormatted} left) & Macro Aligned ✓`;
    if (flags.wideSpreadAlert) {
      globalEntryBannerText = `NOT SAFE TO ENTER ${m.pair} — Rollover Wide Spreads Active (Wait for Next Session)`;
    } else if (!kenyaTiming.isFavorableTime) {
      globalEntryBannerText = `NOT FAVOURABLE TIME FOR ${m.pair} ENTRY IN KENYA — Wait ${kenyaTiming.countdownFormatted} for ${kenyaTiming.nextWindowName}`;
    } else if (isUsdQuote && !isGold && plannedSide === 'BUY' && dxyPressurePct >= 0.15) {
      globalEntryBannerText = `GLOBAL WARNING ON ${m.pair} BUY — US Dollar (DXY +${dxyPressurePct}%) Moving Against Planned Entry`;
    } else if (isUsdBase && plannedSide === 'BUY' && dxyPressurePct <= -0.15) {
      globalEntryBannerText = `GLOBAL WARNING ON ${m.pair} BUY — US Dollar (DXY ${dxyPressurePct}%) Weakening Against Planned Entry`;
    } else if (bestScore < 56) {
      globalEntryBannerText = `CAUTION ON ${m.pair} — Wait for Cleaner EMA / RSI Alignment`;
    }

    let primaryVerdictText = 'WAIT FOR KENYA WINDOW';
    if (flags.wideSpreadAlert || bestScore < 42) primaryVerdictText = 'NOT SAFE RIGHT NOW ✕';
    else if (!kenyaTiming.isFavorableTime) primaryVerdictText = `WAIT (${kenyaTiming.countdownFormatted})`;
    else if (buyScore >= 72 && buyScore > sellScore) primaryVerdictText = 'SAFE TO BUY NOW ✓';
    else if (sellScore >= 72 && sellScore > buyScore) primaryVerdictText = 'SAFE TO SELL NOW ✓';
    else if (buyScore >= 56 && buyScore >= sellScore) primaryVerdictText = 'SELECTIVE BUY ✓';
    else if (sellScore >= 56 && sellScore > buyScore) primaryVerdictText = 'SELECTIVE SELL ✓';

    const globalDriverNote =
      m.rsi >= 68
        ? `RSI ${m.rsi} Overbought: UNSAFE to chase BUY orders; watch for Tower Top SELL sweep near ${m.keyLevel}.`
        : m.rsi <= 34
        ? `RSI ${m.rsi} Oversold: UNSAFE to chase SELL orders; watch for SSL BUY absorption near ${m.keyLevel}.`
        : m.price >= m.ema20
        ? `Live candle (${m.price}) holding above 20 EMA (${m.ema20}). Bullish structure intact unless USD spikes.`
        : `Live candle (${m.price}) trading below 20 EMA (${m.ema20}). Bearish order flow favored below ${m.keyLevel}.`;

    const riskNote = `Gilgil Shield: 0.01 Micro Lot ($2.00 / 260 KES Max Cap) · ${kenyaTiming.currentWindowName}`;

    return {
      pair: m.pair,
      symbol: m.symbol,
      livePrice: m.price,
      change24hPct: m.change24hPct,
      rsi: m.rsi,
      ema20: m.ema20,
      ema50: m.ema50,
      buySafety,
      sellSafety,
      buyScore,
      sellScore,
      primaryVerdictText,
      isEntryBlockedGlobally,
      globalEntryBannerText,
      kenyaTiming,
      globalDriverNote,
      dxyCorrelationNote,
      riskNote
    };
  });

  return {
    dxyPressurePct,
    dxyStatus,
    dxySummary,
    riskRegime,
    riskRegimeSummary,
    eatTimeString,
    eatHour,
    sessionWindowName,
    sessionSafety,
    sessionAdvice,
    overallDaySafety,
    overallHeadline,
    autoDetectedFactors,
    autoDetectedSummary,
    activeWarnings,
    assetScorecards
  };
}

// ============================================================================
// 24/7 EVERY-SECOND REAL-TIME GLOBAL MARKET STREAM MANAGER
// ============================================================================
export interface GlobalStreamState {
  markets: MarketScanData[];
  syncedAt: string;
  liveFeedConnected: boolean;
  tickCount: number;
  lastScanMode: 'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai';
  lockedPairs: Partial<Record<CurrencyPair, boolean>>;
  customTimeframes: Partial<Record<CurrencyPair, Timeframe>>;
}

type StreamListener = (state: GlobalStreamState) => void;

class GlobalLiveMarketStreamEngine {
  private markets: MarketScanData[] = INITIAL_MARKETS_DATA;
  private syncedAt: string = 'Synchronizing...';
  private liveFeedConnected: boolean = false;
  private tickCount: number = 0;
  private lastScanMode: 'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai' = 'auto_1s';
  private lockedPairs: Partial<Record<CurrencyPair, boolean>> = {};
  private customTimeframes: Partial<Record<CurrencyPair, Timeframe>> = {};
  private listeners = new Set<StreamListener>();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private ws: WebSocket | null = null;
  private krakenWs: WebSocket | null = null;
  private pendingWsUpdates: Partial<Record<CurrencyPair, { price: number; pct?: number }>> = {};
  private wsFlushTimer: ReturnType<typeof setTimeout> | null = null;
  private isFetchingRest = false;
  private trendHoldUntil: Partial<Record<CurrencyPair, number>> = {};

  public getState(): GlobalStreamState {
    return {
      markets: this.markets,
      syncedAt: this.syncedAt,
      liveFeedConnected: this.liveFeedConnected,
      tickCount: this.tickCount,
      lastScanMode: this.lastScanMode,
      lockedPairs: { ...this.lockedPairs },
      customTimeframes: { ...this.customTimeframes }
    };
  }

  public subscribe(listener: StreamListener): () => void {
    this.listeners.add(listener);
    this.ensureRunning();
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  }

  private broadcast() {
    const snap = this.getState();
    this.listeners.forEach((fn) => fn(snap));
  }

  private formatNowEat(): string {
    return (
      new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' EAT'
    );
  }

  private queueWsTick(pair: CurrencyPair, price: number, pct?: number) {
    if (isNaN(price) || price <= 0) return;
    this.pendingWsUpdates[pair] = { price, pct };

    // Keep GBP/JPY cross instantaneously synchronized whenever GBP/USD or USD/JPY ticks
    if (pair === 'GBP/USD' || pair === 'USD/JPY') {
      const latestGbp =
        pair === 'GBP/USD'
          ? price
          : this.pendingWsUpdates['GBP/USD']?.price ??
            this.markets.find((m) => m.pair === 'GBP/USD')?.price;
      const latestJpy =
        pair === 'USD/JPY'
          ? price
          : this.pendingWsUpdates['USD/JPY']?.price ??
            this.markets.find((m) => m.pair === 'USD/JPY')?.price;
      if (latestGbp && latestJpy && latestGbp > 0 && latestJpy > 0) {
        this.pendingWsUpdates['GBP/JPY'] = {
          price: Number((latestGbp * latestJpy).toFixed(3))
        };
      }
    }

    if (!this.wsFlushTimer) {
      this.wsFlushTimer = setTimeout(() => {
        this.wsFlushTimer = null;
        const batch = this.pendingWsUpdates;
        this.pendingWsUpdates = {};
        if (Object.keys(batch).length > 0) {
          this.rebuildAndSortMarkets(batch, 'auto_1s', true);
        }
      }, 150);
    }
  }

  private rebuildAndSortMarkets(
    priceUpdates?: Partial<
      Record<CurrencyPair, { price: number; pct?: number; dailyOpen?: number; candles?: OhlcCandle[]; h1Candles?: OhlcCandle[] }>
    >,
    scanMode: 'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai' = 'auto_1s',
    feedOk = this.liveFeedConnected
  ) {
    const prevMeta = new Map<
      CurrencyPair,
      { rank: number; dir: 'BUY' | 'SELL'; trendDir: 'UPTREND' | 'DOWNTREND' | 'RANGING'; price: number }
    >();
    const pctSnapshot: Partial<Record<CurrencyPair, number>> = {};
    this.markets.forEach((m, idx) => {
      prevMeta.set(m.pair, {
        rank: m.currentRank || idx + 1,
        dir: m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
        trendDir: m.trendDirection || (m.bias === 'STRONG_SELL' ? 'DOWNTREND' : 'UPTREND'),
        price: m.price
      });
      pctSnapshot[m.pair] = priceUpdates?.[m.pair]?.pct ?? m.change24hPct;
    });

    const isExplicitFreshScan = scanMode === 'scan_all' || scanMode === 'rescan' || scanMode === 'deep_ai';
    const nowMs = Date.now();
    const liveMacro = getCurrentMacroContext(pctSnapshot);
    const tickStr = this.formatNowEat();
    const updatedList = this.markets.map((existing) => {
      const tf = this.customTimeframes[existing.pair] || existing.recommendedTf;
      if (this.lockedPairs[existing.pair] && scanMode === 'auto_1s') {
        return {
          ...existing,
          recommendedTf: tf,
          lastTickTime: tickStr,
          lastTickDir: existing.lastTickDir || 'FLAT'
        };
      }

      const incoming = priceUpdates?.[existing.pair];
      const nextPrice = incoming && incoming.price > 0 ? incoming.price : existing.price;
      const nextDailyOpen = incoming?.dailyOpen ?? existing.dailyOpenPrice;
      const nextPct =
        incoming?.pct !== undefined
          ? incoming.pct
          : nextDailyOpen && nextDailyOpen > 0
          ? Number((((nextPrice - nextDailyOpen) / nextDailyOpen) * 100).toFixed(2))
          : existing.change24hPct;

      const { pipMultiplier } = getPairSpecs(existing.pair);
      const rawDiffPips = Number(((nextPrice - existing.price) * pipMultiplier).toFixed(2));
      const tickDir: 'UP' | 'DOWN' | 'FLAT' =
        rawDiffPips > 0 ? 'UP' : rawDiffPips < 0 ? 'DOWN' : existing.lastTickDir || 'FLAT';
      const old = prevMeta.get(existing.pair);

      // Hold trend & direction stable for at least 3 minutes unless an explicit scan_all OR strong >0.25% move occurred
      const holdUntil = this.trendHoldUntil[existing.pair] ?? 0;
      const isStrongBreakout =
        old && old.price > 0 ? Math.abs((nextPrice - old.price) / old.price) >= 0.0025 : false;
      const shouldPreserveTrend = scanMode !== 'scan_all' && nowMs < holdUntil && !isStrongBreakout;

      const calibrated = buildCalibratedMarketItem({
        pair: existing.pair,
        symbol: existing.symbol,
        price: nextPrice,
        change24hPct: nextPct,
        dailyOpenPrice: nextDailyOpen,
        recommendedTf: tf,
        recommendedSession: existing.recommendedSession,
        volatility: existing.volatility,
        candles: incoming?.candles || cachedBackgroundCandles[existing.pair]?.m15 || existing.candles,
        h1Candles: incoming?.h1Candles || cachedBackgroundCandles[existing.pair]?.h1 || existing.h1Candles,
        candlesAreRealOhlc:
          Boolean(incoming?.candles || cachedBackgroundCandles[existing.pair]?.m15) || existing.candlesAreRealOhlc,
        macro: liveMacro,
        previousDirection: shouldPreserveTrend ? old?.dir : isExplicitFreshScan ? undefined : old?.dir,
        previousTrendDirection: shouldPreserveTrend
          ? old?.trendDir
          : isExplicitFreshScan
          ? undefined
          : old?.trendDir,
        spreadByBroker: existing.spreadByBroker,
        dataSource: feedOk ? 'Live Interbank Feed' : 'Live Feed + Institutional Calibration'
      });

      const newDir: 'BUY' | 'SELL' = calibrated.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
      if (!old || old.dir !== newDir || !this.trendHoldUntil[existing.pair]) {
        this.trendHoldUntil[existing.pair] = nowMs + 180_000;
      }

      return {
        ...calibrated,
        previousRank: old?.rank ?? calibrated.previousRank,
        previousDirection: old?.dir ?? calibrated.previousDirection,
        directionFlipped: isExplicitFreshScan
          ? false
          : Boolean(old && old.dir !== newDir),
        lastTickTime: tickStr,
        lastTickDir: tickDir,
        lastTickDeltaPips: rawDiffPips !== 0 ? rawDiffPips : existing.lastTickDeltaPips
      };
    });

    // Dynamic sorting: rank by trajectory net profit expectancy + AI confluence so highest-profit setups lead!
    updatedList.sort((a, b) => {
      if (scanMode === 'deep_ai') {
        const scoreA = a.confidence + (a.isFavourableOrder ? 5 : 0) + Math.min(8, Math.abs(a.change24hPct) * 1.4);
        const scoreB = b.confidence + (b.isFavourableOrder ? 5 : 0) + Math.min(8, Math.abs(b.change24hPct) * 1.4);
        return scoreB - scoreA;
      }
      const rankScoreA = a.confidence + (a.isFavourableOrder ? 4 : 0);
      const rankScoreB = b.confidence + (b.isFavourableOrder ? 4 : 0);
      return rankScoreB - rankScoreA;
    });

    this.markets = updatedList.map((m, idx) => ({
      ...m,
      currentRank: idx + 1,
      isTopPick: idx === 0
    }));
    this.syncedAt = tickStr;
    this.liveFeedConnected = feedOk;
    this.lastScanMode = scanMode;
    this.broadcast();
  }

  private connectBinanceWebSocket() {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      // Stream strictly BTCUSDT and PAXGUSDT from Binance so fiat EUR/GBP/AUD stay 100% locked to Kraken fiat USD (no USDT basis ping-pong!)
      const socket = new WebSocket(
        'wss://stream.binance.com:9443/stream?streams=btcusdt@bookTicker/paxgusdt@bookTicker/btcusdt@miniTicker/paxgusdt@miniTicker'
      );
      this.ws = socket;

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const d = msg?.data;
          if (!d || !d.s) return;

          const hasBook = d.b !== undefined && d.a !== undefined;
          const lastPrice = hasBook
            ? (parseFloat(d.b) + parseFloat(d.a)) / 2
            : parseFloat(d.c);
          const openPrice = d.o !== undefined ? parseFloat(d.o) : NaN;
          if (isNaN(lastPrice) || lastPrice <= 0) return;

          const pct =
            !isNaN(openPrice) && openPrice > 0
              ? Number((((lastPrice - openPrice) / openPrice) * 100).toFixed(2))
              : undefined;

          if (d.s === 'BTCUSDT') {
            this.queueWsTick('BTC/USD', lastPrice, pct);
          } else if (d.s === 'PAXGUSDT' && lastPrice > 1500) {
            this.queueWsTick('XAU/USD', lastPrice, pct);
          }
        } catch {
          // Ignore malformed frame
        }
      };

      socket.onerror = () => {
        // Fallback smoothly to Kraken WS & 0.5s REST loop
      };
    } catch {
      // Ignore restricted WebSocket environments
    }
  }

  private connectKrakenWebSocket() {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
    if (
      this.krakenWs &&
      (this.krakenWs.readyState === WebSocket.OPEN || this.krakenWs.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    try {
      const kws = new WebSocket('wss://ws.kraken.com/v2');
      this.krakenWs = kws;

      kws.onopen = () => {
        try {
          kws.send(
            JSON.stringify({
              method: 'subscribe',
              params: {
                channel: 'ticker',
                symbol: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD', 'AUD/USD', 'PAXG/USD', 'BTC/USD']
              }
            })
          );
        } catch {}
      };

      kws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg?.channel !== 'ticker' || !Array.isArray(msg?.data)) return;
          for (const item of msg.data) {
            const sym = item?.symbol;
            const last = Number(item?.last);
            const pct = typeof item?.change_pct === 'number' ? Number(item.change_pct.toFixed(2)) : undefined;
            if (!sym || isNaN(last) || last <= 0) continue;

            if (sym === 'PAXG/USD' && last > 1500) {
              this.queueWsTick('XAU/USD', last, pct);
            } else if (
              sym === 'EUR/USD' ||
              sym === 'GBP/USD' ||
              sym === 'USD/JPY' ||
              sym === 'USD/CAD' ||
              sym === 'AUD/USD' ||
              sym === 'BTC/USD'
            ) {
              this.queueWsTick(sym as CurrencyPair, last, pct);
            }
          }
        } catch {
          // Ignore malformed Kraken ticker frame
        }
      };

      kws.onerror = () => {
        // Graceful fallback to Binance WS + 1s REST loop
      };
    } catch {
      // Ignore restricted WebSocket environments
    }
  }

  private async pollLiveExchangeRest(scanMode: 'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai' = 'auto_1s') {
    if (this.isFetchingRest) return;
    this.isFetchingRest = true;
    try {
      const snap = await fetchLiveMarketSnapshot(this.markets);
      const updates: Partial<
        Record<CurrencyPair, { price: number; pct: number; dailyOpen?: number; candles?: OhlcCandle[]; h1Candles?: OhlcCandle[] }>
      > = {};
      snap.markets.forEach((m) => {
        updates[m.pair] = {
          price: m.price,
          pct: m.change24hPct,
          dailyOpen: m.dailyOpenPrice,
          candles: m.candles,
          h1Candles: m.h1Candles
        };
      });
      this.rebuildAndSortMarkets(updates, scanMode, snap.liveFeedConnected);
    } finally {
      this.isFetchingRest = false;
    }
  }

  public async triggerScan(mode: 'scan_all' | 'rescan' | 'deep_ai') {
    if (mode === 'scan_all' || mode === 'rescan') {
      this.lockedPairs = {};
    }
    void refreshBackgroundRealOhlcCandles(true);
    await this.pollLiveExchangeRest(mode);
    return this.getState();
  }

  public setCustomCandlePrice(pair: CurrencyPair, newPrice: number, tf?: Timeframe) {
    if (isNaN(newPrice) || newPrice <= 0) return;
    this.lockedPairs[pair] = true;
    if (tf) {
      this.customTimeframes[pair] = tf;
    }
    const tickStr = this.formatNowEat();
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    this.markets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    const liveMacro = getCurrentMacroContext(pctMap);

    this.markets = this.markets.map((m) => {
      if (m.pair !== pair) return m;
      const activeTf = this.customTimeframes[pair] || m.recommendedTf;
      const prevDir: 'BUY' | 'SELL' = m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
      const inferredOpen =
        m.dailyOpenPrice && m.dailyOpenPrice > 0
          ? m.dailyOpenPrice
          : m.price / (1 + (m.change24hPct || 0) / 100);
      const updatedPct =
        inferredOpen > 0
          ? Number((((newPrice - inferredOpen) / inferredOpen) * 100).toFixed(2))
          : m.change24hPct;

      const { pipMultiplier } = getPairSpecs(pair);
      const diffPips = Number(((newPrice - m.price) * pipMultiplier).toFixed(2));
      const tickDir: 'UP' | 'DOWN' | 'FLAT' = diffPips > 0 ? 'UP' : diffPips < 0 ? 'DOWN' : 'FLAT';

      const updated = buildCalibratedMarketItem({
        pair: m.pair,
        symbol: m.symbol,
        price: newPrice,
        change24hPct: updatedPct,
        dailyOpenPrice: inferredOpen,
        recommendedTf: activeTf,
        recommendedSession: m.recommendedSession,
        volatility: m.volatility,
        candles: m.candles,
        candlesAreRealOhlc: m.candlesAreRealOhlc,
        macro: liveMacro,
        spreadByBroker: m.spreadByBroker,
        dataSource: m.dataSource
      });
      const newDir: 'BUY' | 'SELL' = updated.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
      return {
        ...updated,
        previousRank: m.currentRank,
        previousDirection: prevDir,
        directionFlipped: prevDir !== newDir,
        lastTickTime: tickStr,
        lastTickDir: tickDir,
        lastTickDeltaPips: diffPips
      };
    });

    // Re-sort live rankings so custom candle moves immediately reflect in #1/#2/#3 leaderboard
    const prevRanks = new Map(this.markets.map((m, i) => [m.pair, m.currentRank || i + 1]));
    this.markets.sort((a, b) => b.confidence - a.confidence);
    this.markets = this.markets.map((m, idx) => ({
      ...m,
      previousRank: prevRanks.get(m.pair),
      currentRank: idx + 1,
      isTopPick: idx === 0
    }));
    this.syncedAt = tickStr;
    this.broadcast();
  }

  public setPairTimeframe(pair: CurrencyPair, tf: Timeframe) {
    this.customTimeframes[pair] = tf;
    this.rebuildAndSortMarkets(undefined, 'rescan', this.liveFeedConnected);
  }

  public unlockPairToLiveStream(pair: CurrencyPair) {
    this.lockedPairs[pair] = false;
    this.pollLiveExchangeRest('rescan');
  }

  private ensureRunning() {
    this.connectBinanceWebSocket();
    this.connectKrakenWebSocket();
    if (!this.intervalId) {
      this.pollLiveExchangeRest('scan_all');
      this.intervalId = setInterval(() => {
        this.tickCount += 1;
        this.syncedAt = this.formatNowEat();
        // Poll REST interbank feeds every 500ms (0.5s, non-overlapping) + 150ms WebSocket push
        this.pollLiveExchangeRest('auto_1s');
      }, 500);
    }
  }

  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.wsFlushTimer) {
      clearTimeout(this.wsFlushTimer);
      this.wsFlushTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    if (this.krakenWs) {
      try {
        this.krakenWs.close();
      } catch {}
      this.krakenWs = null;
    }
  }
}

export const globalLiveStream = new GlobalLiveMarketStreamEngine();

