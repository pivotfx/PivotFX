import {
  BrokerId,
  CurrencyPair,
  SuggestedSignalLogEntry,
  Timeframe,
  TradeNotification
} from '../types';

export type { SuggestedSignalLogEntry, TradeNotification };

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
  dxySummary: string;
  riskRegime: 'RISK-ON EXPANSION' | 'RISK-OFF SAFE-HAVEN' | 'MIXED CONSOLIDATION';
  safeHavenSurge: boolean;
  isRolloverWindow: boolean;
  isUsReleaseWindow: boolean;
  eatHour: number;
  eatTimeString: string;
  sessionWindowName: string;
  overallDaySafety: 'FAVOURABLE_BUY' | 'FAVOURABLE_SELL' | 'SELECTIVE_CAUTION';
  overallHeadline: string;
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
  isExtendedZone?: boolean;
  entryTimingWarning?: string;
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
  isExtendedZone: boolean;
  entryTimingWarning?: string;
  brokerSymbol: string;
  brokerSpread: number;
  decimals: number;
  confidence: number;
  bullScorePct: number;
  bearScorePct: number;
  factorVerdicts: FactorJudgmentItem[];
  alignedFactorsCount: number;
  totalFactorsCount: number;
  goAheadAssurance:
    | 'GO-AHEAD ASSURANCE: STRONG BUY APPROVED'
    | 'GO-AHEAD ASSURANCE: STRONG SELL APPROVED'
    | 'GO-AHEAD ASSURANCE: BUY BY MARKET'
    | 'GO-AHEAD ASSURANCE: SELL BY MARKET'
    | 'WAIT PULLBACK TO 20 EMA — EXTENDED ENTRY ZONE'
    | 'SELECTIVE BUY — ENTER ON 20 EMA CONFIRMATION'
    | 'SELECTIVE SELL — ENTER ON 20 EMA CONFIRMATION';
  trajectory: string;
  trajectoryHorizons: TrajectoryHorizonStep[];
  trendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  trendProjectionText: string;
  humanCheckNote: string;
  mt4SafetyProof: string;
  cmaProtection: string;
}

export interface ActiveMarketOrder {
  id: string;
  pair: CurrencyPair;
  direction: 'BUY' | 'SELL';
  lotSize: number;
  broker: BrokerId;
  timeframe: Timeframe;
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  initialStopLoss: number;
  initialTp2: number;
  loadedAtEat: string;
  loadedTimestamp: number;
  autoTrailEnabled: boolean;
  slUpdatesCount: number;
  peakProfitUsd: number;
}

export interface ClosedOrderHistoryEntry {
  id: string;
  pair: CurrencyPair;
  direction: 'BUY' | 'SELL';
  lotSize: number;
  broker: BrokerId;
  timeframe: Timeframe;
  entryPrice: number;
  closePrice: number;
  finalStopLoss: number;
  finalTp: number;
  realizedPips: number;
  realizedUsd: number;
  realizedKes: number;
  slUpdatesCount: number;
  loadedAtEat: string;
  closedAtEat: string;
  outcome: 'PROFIT' | 'BREAKEVEN' | 'STOP_LOSS' | 'MANUAL_CLOSE';
}

export interface LiveOrderMetrics {
  floatingPips: number;
  grossUsd: number;
  spreadCostUsd: number;
  netProfitUsd: number;
  netProfitKes: number;
  isInProfit: boolean;
  isBreakevenLocked: boolean;
  hitTp1: boolean;
  hitTp2: boolean;
  hitTp3: boolean;
  hitSl: boolean;
  slToTpProgressPct: number;
  pipsRemainingToTp1: number;
  pipsRemainingToTp2: number;
  pipsDistanceAboveSl: number;
  suggestedBreakevenSl: number;
  suggestedLockProfitSl: number;
  suggestedExpandedTp1: number;
  suggestedExpandedTp2: number;
  suggestedExpandedTp3: number;
  projectedProfitAtUpdatedTpUsd: number;
  projectedProfitAtUpdatedTpKes: number;
  decimals: number;
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

export function computeLiveOrderMetrics(
  order: ActiveMarketOrder,
  livePrice: number,
  atrPips = 24
): LiveOrderMetrics {
  const { isJpy, isGold, isBtc, pipMultiplier, decimals } = getPairSpecs(order.pair);
  const isBuy = order.direction === 'BUY';
  const rawSignedPips = isBuy
    ? (livePrice - order.entryPrice) * pipMultiplier
    : (order.entryPrice - livePrice) * pipMultiplier;
  const floatingPips = Number(rawSignedPips.toFixed(1));

  const lotScale = Math.max(0.01, order.lotSize || 0.01) / 0.01;
  const pipValPerMicroLot = isGold ? 0.1 : isJpy ? 0.065 : isBtc ? 0.01 : 0.1;
  const brokerSpread = isGold ? 2.2 : isJpy ? 1.4 : isBtc ? 25.0 : 1.1;

  const grossUsd = Number((floatingPips * pipValPerMicroLot * lotScale).toFixed(2));
  const spreadCostUsd = Number((brokerSpread * pipValPerMicroLot * lotScale).toFixed(2));
  const netProfitUsd = Number((grossUsd - spreadCostUsd).toFixed(2));
  const netProfitKes = Math.round(netProfitUsd * 130);

  const isInProfit = floatingPips > 0.5;
  const isBreakevenLocked = isBuy
    ? order.stopLoss >= order.entryPrice
    : order.stopLoss <= order.entryPrice;

  const hitTp1 = isBuy ? livePrice >= order.tp1 : livePrice <= order.tp1;
  const hitTp2 = isBuy ? livePrice >= order.tp2 : livePrice <= order.tp2;
  const hitTp3 = isBuy ? livePrice >= order.tp3 : livePrice <= order.tp3;
  const hitSl = isBuy ? livePrice <= order.stopLoss : livePrice >= order.stopLoss;

  const totalRange = Math.max(1 / pipMultiplier, Math.abs(order.tp2 - order.stopLoss));
  const rawProgress = isBuy
    ? ((livePrice - order.stopLoss) / totalRange) * 100
    : ((order.stopLoss - livePrice) / totalRange) * 100;
  const slToTpProgressPct = Number(Math.max(0, Math.min(100, rawProgress)).toFixed(1));

  const pipsRemainingToTp1 = Number(
    (isBuy ? (order.tp1 - livePrice) * pipMultiplier : (livePrice - order.tp1) * pipMultiplier).toFixed(1)
  );
  const pipsRemainingToTp2 = Number(
    (isBuy ? (order.tp2 - livePrice) * pipMultiplier : (livePrice - order.tp2) * pipMultiplier).toFixed(1)
  );
  const pipsDistanceAboveSl = Number(
    (isBuy ? (livePrice - order.stopLoss) * pipMultiplier : (order.stopLoss - livePrice) * pipMultiplier).toFixed(1)
  );

  // Breakeven SL: Entry +/- 1 pip in profit direction (capped safely behind livePrice by at least 2 pips)
  const beBuffer = (isGold ? 5 : isBtc ? 45 : 1.2) / pipMultiplier;
  const minLiveBuffer = (isGold ? 8 : isBtc ? 80 : 2.5) / pipMultiplier;
  const suggestedBreakevenSl = isBuy
    ? Number(Math.min(livePrice - minLiveBuffer, Math.max(order.stopLoss, order.entryPrice + beBuffer)).toFixed(decimals))
    : Number(Math.max(livePrice + minLiveBuffer, Math.min(order.stopLoss, order.entryPrice - beBuffer)).toFixed(decimals));

  // Lock ~55% of current unrealized move when in profit, or tighten SL 35% closer to entry if flat/early
  const suggestedLockProfitSl = isBuy
    ? Number(
        (floatingPips > 5
          ? Math.max(
              order.stopLoss,
              Math.min(livePrice - minLiveBuffer, order.entryPrice + (livePrice - order.entryPrice) * 0.55)
            )
          : Math.max(order.stopLoss, order.entryPrice - (order.entryPrice - order.stopLoss) * 0.65)
        ).toFixed(decimals)
      )
    : Number(
        (floatingPips > 5
          ? Math.min(
              order.stopLoss,
              Math.max(livePrice + minLiveBuffer, order.entryPrice - (order.entryPrice - livePrice) * 0.55)
            )
          : Math.min(order.stopLoss, order.entryPrice + (order.stopLoss - order.entryPrice) * 0.65)
        ).toFixed(decimals)
      );

  // Expanded TP targets based on live price + ATR momentum
  const expandBoostOffset = (Math.max(12, atrPips * 0.85)) / pipMultiplier;
  const suggestedExpandedTp2 = isBuy
    ? Number((Math.max(order.tp2, livePrice + expandBoostOffset * 1.45) + expandBoostOffset * 0.65).toFixed(decimals))
    : Number((Math.min(order.tp2, livePrice - expandBoostOffset * 1.45) - expandBoostOffset * 0.65).toFixed(decimals));
  const suggestedExpandedTp1 = isBuy
    ? Number((order.entryPrice + (suggestedExpandedTp2 - order.entryPrice) * 0.55).toFixed(decimals))
    : Number((order.entryPrice - (order.entryPrice - suggestedExpandedTp2) * 0.55).toFixed(decimals));
  const suggestedExpandedTp3 = isBuy
    ? Number((order.entryPrice + (suggestedExpandedTp2 - order.entryPrice) * 1.65).toFixed(decimals))
    : Number((order.entryPrice - (order.entryPrice - suggestedExpandedTp2) * 1.65).toFixed(decimals));

  const expandedTpPips = Math.abs(suggestedExpandedTp2 - order.entryPrice) * pipMultiplier;
  const projectedProfitAtUpdatedTpUsd = Math.max(
    0.5,
    Number((expandedTpPips * pipValPerMicroLot * lotScale - spreadCostUsd).toFixed(2))
  );
  const projectedProfitAtUpdatedTpKes = Math.round(projectedProfitAtUpdatedTpUsd * 130);

  return {
    floatingPips,
    grossUsd,
    spreadCostUsd,
    netProfitUsd,
    netProfitKes,
    isInProfit,
    isBreakevenLocked,
    hitTp1,
    hitTp2,
    hitTp3,
    hitSl,
    slToTpProgressPct,
    pipsRemainingToTp1,
    pipsRemainingToTp2,
    pipsDistanceAboveSl,
    suggestedBreakevenSl,
    suggestedLockProfitSl,
    suggestedExpandedTp1,
    suggestedExpandedTp2,
    suggestedExpandedTp3,
    projectedProfitAtUpdatedTpUsd,
    projectedProfitAtUpdatedTpKes,
    decimals
  };
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
  const chfPct = pctByPair?.['USD/CHF'] ?? 0;
  const cadPct = pctByPair?.['USD/CAD'] ?? 0;
  const goldPct = pctByPair?.['XAU/USD'] ?? 0;
  const btcPct = pctByPair?.['BTC/USD'] ?? 0;

  const dxyPressurePct = Number(
    (
      -0.42 * eurPct -
      0.16 * gbpPct -
      0.08 * audPct +
      0.16 * jpyPct +
      0.09 * chfPct +
      0.09 * cadPct
    ).toFixed(2)
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

  const dxySummary =
    dxyPressurePct >= 0.12
      ? `USD Basket strong (+${dxyPressurePct}%)`
      : dxyPressurePct <= -0.12
      ? `USD Basket softening (${dxyPressurePct}%)`
      : `USD Basket balanced (${dxyPressurePct >= 0 ? `+${dxyPressurePct}%` : `${dxyPressurePct}%`})`;

  const isRolloverWindow = eatHour >= 22 || eatHour <= 2;
  const isUsReleaseWindow = eatHour === 15 && eatMin >= 20 && eatMin <= 50;
  const eatTimeString = `${now.toLocaleTimeString('en-GB', {
    timeZone: 'Africa/Nairobi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })} EAT`;

  const sessionWindowName = isRolloverWindow
    ? 'Rollover Spread-Widening Window'
    : eatHour >= 3 && eatHour < 10
    ? 'Tokyo / Asian Range Window'
    : eatHour >= 10 && eatHour < 15
    ? 'London Open (Prime Liquidity)'
    : eatHour >= 15 && eatHour < 19
    ? 'London–NY Overlap (Peak Window)'
    : 'New York PM Continuation Window';

  const overallDaySafety: MacroContextSnapshot['overallDaySafety'] =
    isRolloverWindow || isUsReleaseWindow
      ? 'SELECTIVE_CAUTION'
      : dxyPressurePct <= -0.05 || (eurPct >= 0 && gbpPct >= 0)
      ? 'FAVOURABLE_BUY'
      : dxyPressurePct >= 0.05
      ? 'FAVOURABLE_SELL'
      : 'SELECTIVE_CAUTION';

  const overallHeadline =
    overallDaySafety === 'FAVOURABLE_BUY'
      ? `TODAY & THIS HOUR: FAVOURABLE BUYING ON NON-USD PAIRS & GOLD (${dxySummary})`
      : overallDaySafety === 'FAVOURABLE_SELL'
      ? `TODAY & THIS HOUR: FAVOURABLE SELLING EUR/GBP/AUD · LONG USD (${dxySummary})`
      : `TODAY & THIS HOUR: SELECTIVE DISCIPLINED ENTRIES — ${sessionWindowName.toUpperCase()}`;

  return {
    dxyPressurePct,
    dxySummary,
    riskRegime,
    safeHavenSurge: goldPct >= 0.85 && jpyPct <= -0.12,
    isRolloverWindow,
    isUsReleaseWindow,
    eatHour,
    eatTimeString,
    sessionWindowName,
    overallDaySafety,
    overallHeadline
  };
}

/**
 * Evaluates ALL 6 Institutional Trading Factors simultaneously to judge BUY vs SELL:
 * 1. Live Candlestick Price Action & Liquidity Sweep
 * 2. 20/50 EMA Dynamic Trend Stack & Pullback Timing Guard
 * 3. 14-Period Wilder RSI Momentum & Exhaustion
 * 4. Global Macro & Live USD Basket (DXY) / Safe-Haven Flow
 * 5. Nairobi (EAT) Session Liquidity & Broker Spread Friction
 * 6. H1 Higher-Timeframe Trend Structure & Swing Key Level
 */
export function evaluateAllTradeFactors(p: {
  pair: CurrencyPair;
  livePrice: number;
  ema20: number;
  ema50: number;
  rsi: number;
  atrPips?: number;
  keyLevel?: number;
  prev3Close?: number;
  isBearishPinOrSweep?: boolean;
  isBullishPinOrAbsorption?: boolean;
  brokerSpread?: number;
  macro?: MacroContextSnapshot;
  h1TrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  biasOverride?: 'BUY' | 'SELL';
  previousDirection?: 'BUY' | 'SELL';
}): {
  isBuy: boolean;
  bullScorePct: number;
  bearScorePct: number;
  confidence: number;
  factorVerdicts: FactorJudgmentItem[];
  alignedFactorsCount: number;
  totalFactorsCount: number;
  isExtendedZone: boolean;
  entryTimingWarning?: string;
  goAheadAssurance: ComputedTradeParams['goAheadAssurance'];
} {
  const { isGold, isBtc, pipMultiplier, decimals } = getPairSpecs(p.pair);
  const macro = p.macro || getCurrentMacroContext();
  const verdicts: FactorJudgmentItem[] = [];

  let bullWeight = 0;
  let bearWeight = 0;

  // Higher-Timeframe (H1) Structural Anchor (prevents short-term tick flipping)
  const effectiveH1 =
    p.h1TrendDirection ??
    (p.ema20 >= p.ema50 ? 'UPTREND' : 'DOWNTREND');
  if (effectiveH1 === 'UPTREND') {
    bullWeight += 24;
  } else if (effectiveH1 === 'DOWNTREND') {
    bearWeight += 24;
  }

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

  // FACTOR 2: 20 / 50 EMA Dynamic Trend Stack & Pullback Timing Guard (24 pts max)
  const distEma20Pips = (p.livePrice - p.ema20) * pipMultiplier;
  const effectiveAtrPips = Math.max(5, p.atrPips ?? (isGold ? 28 : isBtc ? 180 : 16));
  const overextLimit = Math.max(isGold ? 160 : isBtc ? 1100 : 24, effectiveAtrPips * 1.45);
  const isExtendedZone = Math.abs(distEma20Pips) > overextLimit;

  if (distEma20Pips > overextLimit) {
    if (p.ema20 >= p.ema50) bullWeight += 13;
    else bearWeight += 17;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'CAUTION',
      weight: '14%',
      detail: `Extended +${distEma20Pips.toFixed(1)}p above 20 EMA (${p.ema20.toFixed(decimals)}) — wait pullback toward 20 EMA`
    });
  } else if (distEma20Pips < -overextLimit) {
    if (p.ema20 <= p.ema50) bearWeight += 13;
    else bullWeight += 17;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'CAUTION',
      weight: '14%',
      detail: `Extended ${distEma20Pips.toFixed(1)}p below 20 EMA (${p.ema20.toFixed(decimals)}) — wait pullback toward 20 EMA`
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
  if (p.rsi >= 72) {
    bearWeight += 14;
    bullWeight += 4;
    verdicts.push({
      name: '3. RSI (14) Momentum',
      signal: 'CAUTION',
      weight: '14%',
      detail: `RSI ${p.rsi} Overbought zone — avoid chasing high; wait 20 EMA retest`
    });
  } else if (p.rsi <= 28) {
    bullWeight += 14;
    bearWeight += 4;
    verdicts.push({
      name: '3. RSI (14) Momentum',
      signal: 'CAUTION',
      weight: '14%',
      detail: `RSI ${p.rsi} Oversold zone — avoid chasing lows; wait 20 EMA retest`
    });
  } else if (p.rsi >= 51) {
    bullWeight += 18;
    bearWeight += 2;
    verdicts.push({
      name: '3. RSI (14) Momentum',
      signal: 'BUY',
      weight: '18%',
      detail: `RSI ${p.rsi} healthy bullish expansion corridor (room before 72 overbought)`
    });
  } else {
    bearWeight += 18;
    bullWeight += 2;
    verdicts.push({
      name: '3. RSI (14) Momentum',
      signal: 'SELL',
      weight: '18%',
      detail: `RSI ${p.rsi} sustained bearish momentum corridor (room before 28 oversold)`
    });
  }

  // FACTOR 4: Global Macro & Live USD Basket (DXY) / Risk Sentiment Flow (18 pts max)
  const isUsdQuote = p.pair.endsWith('/USD');
  const isUsdBase = p.pair.startsWith('USD/');
  const isJpyCross = p.pair === 'GBP/JPY' || p.pair === 'EUR/JPY';
  const dxy = macro.dxyPressurePct;
  if (isUsdQuote && !isGold) {
    if (dxy <= -0.05) {
      bullWeight += 18;
      verdicts.push({
        name: '4. DXY Macro & Risk Flow',
        signal: 'BUY',
        weight: '18%',
        detail: `USD Basket weakening (${dxy}%) gives macro BUY tail-wind for ${p.pair}`
      });
    } else if (dxy >= 0.05) {
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
    if (dxy >= 0.05) {
      bullWeight += 18;
      verdicts.push({
        name: '4. DXY Macro & Risk Flow',
        signal: 'BUY',
        weight: '18%',
        detail: `USD Basket surging (+${dxy}%) lifts USD-base ${p.pair} upward`
      });
    } else if (dxy <= -0.05) {
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
  } else if (isJpyCross) {
    if (macro.riskRegime === 'RISK-OFF SAFE-HAVEN') {
      bearWeight += 18;
      verdicts.push({
        name: '4. Yen Carry & Risk Flow',
        signal: 'SELL',
        weight: '18%',
        detail: `Risk-Off safe-haven JPY inflow favors ${p.pair} downside distribution`
      });
    } else {
      bullWeight += 16;
      verdicts.push({
        name: '4. Yen Carry & Risk Flow',
        signal: 'BUY',
        weight: '16%',
        detail: `${macro.riskRegime}: constructive risk appetite supports ${p.pair}`
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
      detail: `Active liquidity window (${macro.eatHour}:00 EAT) · tight ~${spreadPips}p broker spread`
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
        : `Elevated spread (~${spreadPips}p) — strictly cap risk at 0.01 micro lot`
    });
  }

  // FACTOR 6: H1 Trend Structure & Key Level Alignment (16 pts max)
  if (effectiveH1 === 'UPTREND') {
    bullWeight += 16;
    verdicts.push({
      name: '6. H1 Trend & Structure',
      signal: 'BUY',
      weight: '16%',
      detail: `H1 macro trend confirms UPTREND above swing floor ${p.keyLevel ? p.keyLevel.toFixed(decimals) : p.ema50.toFixed(decimals)}`
    });
  } else if (effectiveH1 === 'DOWNTREND') {
    bearWeight += 16;
    verdicts.push({
      name: '6. H1 Trend & Structure',
      signal: 'SELL',
      weight: '16%',
      detail: `H1 macro trend confirms DOWNTREND below swing ceiling ${p.keyLevel ? p.keyLevel.toFixed(decimals) : p.ema50.toFixed(decimals)}`
    });
  } else {
    verdicts.push({
      name: '6. H1 Trend & Structure',
      signal: 'CAUTION',
      weight: '8%',
      detail: 'H1 structure consolidating — scale 50% at TP1 and lock Breakeven early'
    });
  }

  const total = Math.max(1, bullWeight + bearWeight);
  const bullScorePct = Math.round((bullWeight / total) * 100);
  const bearScorePct = 100 - bullScorePct;
  const strongDeadbandPips = isGold ? 28.0 : isBtc ? 160.0 : 4.5;
  const distEmaAbsPips = Math.abs(distEma20Pips);
  const scoreMargin = Math.abs(bullScorePct - bearScorePct);

  let isBuy = bullWeight >= bearWeight;
  if (p.biasOverride) {
    isBuy = p.biasOverride === 'BUY';
  } else if (
    p.previousDirection &&
    (scoreMargin < 22 || distEmaAbsPips < strongDeadbandPips)
  ) {
    isBuy = p.previousDirection === 'BUY';
  }

  const dominantPct = isBuy ? bullScorePct : bearScorePct;
  const sideTag: 'BUY' | 'SELL' = isBuy ? 'BUY' : 'SELL';
  const alignedFactorsCount = verdicts.filter((v) => v.signal === sideTag).length;
  const totalFactorsCount = verdicts.length;

  const rawConf =
    72 +
    dominantPct * 0.25 +
    (alignedFactorsCount >= 5 ? 2.0 : alignedFactorsCount >= 4 ? 1.0 : -1.0) +
    (spreadHealthy && !macro.isRolloverWindow ? 1.5 : -2.5) -
    (isExtendedZone ? 4.5 : 0);
  const confidence = Number(Math.min(98.5, Math.max(68.0, rawConf)).toFixed(1));

  const entryTimingWarning = isExtendedZone
    ? `Price is ${Math.abs(distEma20Pips).toFixed(1)}p (${(
        Math.abs(distEma20Pips) / Math.max(1, effectiveAtrPips)
      ).toFixed(1)}x ATR) away from 20 EMA (${p.ema20.toFixed(decimals)}) — WAIT PULLBACK TO 20 EMA instead of chasing.`
    : undefined;

  const goAheadAssurance: ComputedTradeParams['goAheadAssurance'] = isExtendedZone
    ? 'WAIT PULLBACK TO 20 EMA — EXTENDED ENTRY ZONE'
    : isBuy
    ? alignedFactorsCount >= 5 && bullScorePct >= 70 && !macro.isRolloverWindow
      ? 'GO-AHEAD ASSURANCE: STRONG BUY APPROVED'
      : alignedFactorsCount >= 4 && bullScorePct >= 56
      ? 'GO-AHEAD ASSURANCE: BUY BY MARKET'
      : 'SELECTIVE BUY — ENTER ON 20 EMA CONFIRMATION'
    : alignedFactorsCount >= 5 && bearScorePct >= 70 && !macro.isRolloverWindow
    ? 'GO-AHEAD ASSURANCE: STRONG SELL APPROVED'
    : alignedFactorsCount >= 4 && bearScorePct >= 56
    ? 'GO-AHEAD ASSURANCE: SELL BY MARKET'
    : 'SELECTIVE SELL — ENTER ON 20 EMA CONFIRMATION';

  return {
    isBuy,
    bullScorePct,
    bearScorePct,
    confidence,
    factorVerdicts: verdicts,
    alignedFactorsCount,
    totalFactorsCount,
    isExtendedZone,
    entryTimingWarning,
    goAheadAssurance
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
  h1TrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
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

  const closedHistorySlice = candles.length >= 25 ? candles.slice(-25, -1) : candles.slice(-24);
  const swingHigh = Number(Math.max(...closedHistorySlice.map((c) => c.high)).toFixed(decimals));
  const swingLow = Number(Math.min(...closedHistorySlice.map((c) => c.low)).toFixed(decimals));

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2] || lastCandle;
  const prev3Candle = candles[candles.length - 4] || prevCandle;
  const prevBody = Math.abs(prevCandle.close - prevCandle.open);
  const prevUpperWick = Math.max(0, prevCandle.high - Math.max(prevCandle.open, prevCandle.close));
  const prevLowerWick = Math.max(0, Math.min(prevCandle.open, prevCandle.close) - prevCandle.low);
  const isBearishPinOrSweep = prevUpperWick > prevBody * 1.25 && lastCandle.close < prevCandle.high;
  const isBullishPinOrAbsorption = prevLowerWick > prevBody * 1.25 && lastCandle.close > prevCandle.low;

  const tempKeyLevel = ema20 >= ema50 ? swingLow : swingHigh;
  const allFactorEval = evaluateAllTradeFactors({
    pair: p.pair,
    livePrice: p.livePrice,
    ema20,
    ema50,
    rsi,
    atrPips,
    keyLevel: tempKeyLevel,
    prev3Close: prev3Candle.close,
    isBearishPinOrSweep,
    isBullishPinOrAbsorption,
    brokerSpread: p.brokerSpread,
    macro: p.macro,
    h1TrendDirection: p.h1TrendDirection,
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
    isExtendedZone: allFactorEval.isExtendedZone,
    entryTimingWarning: allFactorEval.entryTimingWarning,
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
  swingLow?: number;
  swingHigh?: number;
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

  // Base timeframe volatility + continuous Swing Structure, ATR & spread SL protection
  let baseSlPips = 16;
  let baseTp1Pips = 28;
  let baseTp2Pips = 46;

  if (p.targetTf === 'M1') {
    baseSlPips = isGold ? 35 : isBtc ? 220 : 8;
    baseTp1Pips = isGold ? 55 : isBtc ? 350 : 14;
    baseTp2Pips = isGold ? 90 : isBtc ? 580 : 22;
  } else if (p.targetTf === 'M5') {
    baseSlPips = isGold ? 55 : isBtc ? 350 : 12;
    baseTp1Pips = isGold ? 88 : isBtc ? 550 : 20;
    baseTp2Pips = isGold ? 140 : isBtc ? 900 : 34;
  } else if (p.targetTf === 'M10') {
    baseSlPips = isGold ? 75 : isBtc ? 460 : 14;
    baseTp1Pips = isGold ? 115 : isBtc ? 720 : 24;
    baseTp2Pips = isGold ? 180 : isBtc ? 1120 : 40;
  } else if (p.targetTf === 'M15') {
    baseSlPips = isGold ? 95 : isBtc ? 600 : 16;
    baseTp1Pips = isGold ? 150 : isBtc ? 980 : 28;
    baseTp2Pips = isGold ? 235 : isBtc ? 1550 : 48;
  } else if (p.targetTf === 'H1') {
    baseSlPips = isGold ? 160 : isBtc ? 950 : 26;
    baseTp1Pips = isGold ? 250 : isBtc ? 1500 : 48;
    baseTp2Pips = isGold ? 400 : isBtc ? 2450 : 82;
  } else if (p.targetTf === 'H4') {
    baseSlPips = isGold ? 280 : isBtc ? 1650 : 48;
    baseTp1Pips = isGold ? 440 : isBtc ? 2600 : 92;
    baseTp2Pips = isGold ? 700 : isBtc ? 4300 : 155;
  } else if (p.targetTf === 'D1') {
    baseSlPips = isGold ? 500 : isBtc ? 2800 : 85;
    baseTp1Pips = isGold ? 800 : isBtc ? 4500 : 170;
    baseTp2Pips = isGold ? 1280 : isBtc ? 7400 : 285;
  }

  // Unified 6-Factor All-Confluence BUY / SELL Evaluation
  const allFactorEval = evaluateAllTradeFactors({
    pair: p.targetPair,
    livePrice: p.price,
    ema20: p.ema20 ?? p.price,
    ema50: p.ema50 ?? p.price,
    rsi: p.rsi ?? 52.0,
    atrPips: p.atrPips,
    keyLevel: p.keyLevel,
    brokerSpread,
    macro: p.macro,
    h1TrendDirection: p.h1TrendDirection,
    biasOverride: p.biasOverride,
    previousDirection: p.previousDirection
  });

  const isBuy = allFactorEval.isBuy;
  const macro = p.macro ?? getCurrentMacroContext();
  const isUsdBase = p.targetPair.startsWith('USD/');
  const isJpyCross = p.targetPair === 'GBP/JPY' || p.targetPair === 'EUR/JPY';
  const dxySupportsActiveSide =
    p.targetPair === 'BTC/USD'
      ? (isBuy && macro.dxyPressurePct <= 0.1) || (!isBuy && macro.dxyPressurePct >= -0.05)
      : isJpyCross
      ? (isBuy && macro.riskRegime !== 'RISK-OFF SAFE-HAVEN') || (!isBuy && macro.riskRegime === 'RISK-OFF SAFE-HAVEN')
      : isUsdBase
      ? (isBuy && macro.dxyPressurePct >= 0.05) || (!isBuy && macro.dxyPressurePct <= -0.05)
      : (isBuy && macro.dxyPressurePct <= -0.05) || (!isBuy && macro.dxyPressurePct >= 0.05);

  // Anchor Stop Loss strictly beyond real Swing High/Low + ATR volatility + broker spread
  const relevantSwingPrice = isBuy
    ? p.swingLow ?? p.keyLevel
    : p.swingHigh ?? p.keyLevel;
  const rawSwingDistPips =
    relevantSwingPrice && relevantSwingPrice > 0
      ? Math.abs(p.price - relevantSwingPrice) * pipMultiplier
      : 0;
  const effectiveAtr = Math.max(5, p.atrPips ?? baseSlPips * 0.9);
  const swingProtectedPips =
    rawSwingDistPips > 0
      ? rawSwingDistPips + brokerSpread + effectiveAtr * 0.45
      : effectiveAtr * 1.68 + brokerSpread;
  const atrFloorPips = effectiveAtr * 1.55 + brokerSpread;
  const minSlFloor = baseSlPips * 0.95;
  const maxSlCeiling = baseSlPips * 2.15;
  baseSlPips = Number(
    Math.min(maxSlCeiling, Math.max(minSlFloor, atrFloorPips, swingProtectedPips)).toFixed(1)
  );
  baseTp1Pips = Number(Math.max(baseSlPips * 1.28, baseTp1Pips).toFixed(1));
  baseTp2Pips = Number(Math.max(baseSlPips * 2.18, baseTp2Pips).toFixed(1));

  // Longer 12H–48H swing target (TP3) scales dynamically with DXY macro tailwind & RSI headroom
  const rsiVal = p.rsi ?? 52.0;
  const rsiHeadroomFactor = isBuy
    ? Math.max(0.85, Math.min(1.22, (74 - rsiVal) / 24))
    : Math.max(0.85, Math.min(1.22, (rsiVal - 26) / 24));
  const macroExpansionMultiplier = dxySupportsActiveSide ? 1.65 : 1.45;
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
    if (slPrice >= p.price) slPrice = Number((p.price - Math.max(12, baseSlPips) / pipMultiplier).toFixed(decimals));
    if (tp1Price <= p.price) tp1Price = Number((p.price + Math.max(20, baseTp1Pips) / pipMultiplier).toFixed(decimals));
    if (tp2Price <= tp1Price) tp2Price = Number((tp1Price + 15 / pipMultiplier).toFixed(decimals));
    if (tp3Price <= tp2Price) tp3Price = Number((tp2Price + 22 / pipMultiplier).toFixed(decimals));
  } else {
    if (slPrice <= p.price) slPrice = Number((p.price + Math.max(12, baseSlPips) / pipMultiplier).toFixed(decimals));
    if (tp1Price >= p.price) tp1Price = Number((p.price - Math.max(20, baseTp1Pips) / pipMultiplier).toFixed(decimals));
    if (tp2Price >= tp1Price) tp2Price = Number((tp1Price - 15 / pipMultiplier).toFixed(decimals));
    if (tp3Price >= tp2Price) tp3Price = Number((tp2Price - 22 / pipMultiplier).toFixed(decimals));
  }

  const actualSlPips = Math.max(1, Number((Math.abs(p.price - slPrice) * pipMultiplier).toFixed(1)));
  const actualTp1Pips = Math.max(1, Number((Math.abs(tp1Price - p.price) * pipMultiplier).toFixed(1)));
  const actualTpPips = Math.max(1, Number((Math.abs(tp2Price - p.price) * pipMultiplier).toFixed(1)));
  const actualTp3Pips = Math.max(1, Number((Math.abs(tp3Price - p.price) * pipMultiplier).toFixed(1)));

  // Exact 0.01 micro lot risk & net profit after spread
  const pipValPerMicroLot = isGold ? 0.1 : isJpy ? 0.065 : isBtc ? 0.01 : 0.1;
  const rawRiskUsd = Number((actualSlPips * pipValPerMicroLot).toFixed(2));
  const actualRiskUsd = Number(Math.max(0.8, rawRiskUsd).toFixed(2));
  const potentialGainUsd = Number((actualTpPips * pipValPerMicroLot).toFixed(2));
  const spreadCostUsd = Number((brokerSpread * pipValPerMicroLot).toFixed(2));
  const netProfitUsd = Math.max(0.4, Number((potentialGainUsd - spreadCostUsd).toFixed(2)));
  const netProfitKes = Math.round(netProfitUsd * 130);
  const netProfit48hUsd = Math.max(0.8, Number((actualTp3Pips * pipValPerMicroLot - spreadCostUsd).toFixed(2)));
  const netProfit48hKes = Math.round(netProfit48hUsd * 130);
  const tp1NetProfitUsd = Math.max(0.2, Number((actualTp1Pips * pipValPerMicroLot * 0.5 - spreadCostUsd).toFixed(2)));
  const tp1NetProfitKes = Math.round(tp1NetProfitUsd * 130);
  const orderType = allFactorEval.isExtendedZone
    ? isBuy
      ? 'BUY LIMIT (PULLBACK TO 20 EMA)'
      : 'SELL LIMIT (PULLBACK TO 20 EMA)'
    : isBuy
    ? 'BUY BY MARKET'
    : 'SELL BY MARKET';
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
  const isFavourableOrder =
    trendMatchesSide && activeSideScore >= 56 && rrNumeric >= 1.8 && !allFactorEval.isExtendedZone;

  const orderVerdictLabel: ComputedTradeParams['orderVerdictLabel'] = allFactorEval.isExtendedZone
    ? isBuy
      ? 'SELECTIVE BUY (WAIT PULLBACK)'
      : 'SELECTIVE SELL (WAIT PULLBACK)'
    : isBuy
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

  const humanCheckNote = allFactorEval.entryTimingWarning
    ? allFactorEval.entryTimingWarning
    : isBuy
    ? `BUY Confirmation Check (${p.targetTf}): Confirm a bullish candle close above 20 EMA (${ema20Val.toFixed(decimals)}) with swing-protected SL @ ${slPrice.toFixed(decimals)}.`
    : `SELL Confirmation Check (${p.targetTf}): Confirm a bearish candle close below 20 EMA (${ema20Val.toFixed(decimals)}) with swing-protected SL @ ${slPrice.toFixed(decimals)}.`;

  const trajectory = isBuy
    ? `1H–48H ${p.biasOverride ? 'Chosen BUY' : 'AI BUY'} Roadmap (${trendProjectionText}): Live ${p.targetTf} candle @ ${p.price.toFixed(decimals)} (${brokerSymbol}). Swing SL @ ${slPrice.toFixed(decimals)} (${actualSlPips}p). 1H–4H TP1: ${tp1Price.toFixed(decimals)} (+$${tp1NetProfitUsd.toFixed(2)}) -> 4H–12H TP2: ${tp2Price.toFixed(decimals)} (+${actualTpPips}p / +$${netProfitUsd.toFixed(2)}) -> 12H–48H Extended TP3: ${tp3Price.toFixed(decimals)} (+${actualTp3Pips}p / +$${netProfit48hUsd.toFixed(2)}). ${macroFactorNote}.`
    : `1H–48H ${p.biasOverride ? 'Chosen SELL' : 'AI SELL'} Roadmap (${trendProjectionText}): Live ${p.targetTf} candle @ ${p.price.toFixed(decimals)} (${brokerSymbol}). Swing SL @ ${slPrice.toFixed(decimals)} (${actualSlPips}p). 1H–4H TP1: ${tp1Price.toFixed(decimals)} (+$${tp1NetProfitUsd.toFixed(2)}) -> 4H–12H TP2: ${tp2Price.toFixed(decimals)} (-${actualTpPips}p / +$${netProfitUsd.toFixed(2)}) -> 12H–48H Extended TP3: ${tp3Price.toFixed(decimals)} (-${actualTp3Pips}p / +$${netProfit48hUsd.toFixed(2)}). ${macroFactorNote}.`;

  const mt4SafetyProof = isBuy
    ? `MT4 BUY Validated: SL (${slPrice.toFixed(decimals)}) < Entry (${p.price.toFixed(decimals)}) < TP1 (${tp1Price.toFixed(decimals)}) < TP2 (${tp2Price.toFixed(decimals)})`
    : `MT4 SELL Validated: TP2 (${tp2Price.toFixed(decimals)}) < TP1 (${tp1Price.toFixed(decimals)}) < Entry (${p.price.toFixed(decimals)}) < SL (${slPrice.toFixed(decimals)})`;

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
    isExtendedZone: allFactorEval.isExtendedZone,
    entryTimingWarning: allFactorEval.entryTimingWarning,
    brokerSymbol,
    brokerSpread,
    decimals,
    confidence: aiConfidence,
    bullScorePct: allFactorEval.bullScorePct,
    bearScorePct: allFactorEval.bearScorePct,
    factorVerdicts: allFactorEval.factorVerdicts,
    alignedFactorsCount: allFactorEval.alignedFactorsCount,
    totalFactorsCount: allFactorEval.totalFactorsCount,
    goAheadAssurance: allFactorEval.goAheadAssurance,
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
 * Re-anchors all OHLC indicators, 6-Factor AI strategy verdict, & swing-protected SL/TP levels around a live price & optional candle history.
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

  // Compute genuine Higher-Timeframe (H1) EMA trend when H1 candles are available
  let h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING' | undefined = params.previousTrendDirection;
  if (params.h1Candles && params.h1Candles.length >= 22) {
    const h1Closes = params.h1Candles.map((c) => c.close);
    const h1Ema20 = computeRealEma(h1Closes, 20);
    const h1Ema50 = computeRealEma(h1Closes, 50);
    h1TrendDirection = h1Ema20 >= h1Ema50 ? 'UPTREND' : 'DOWNTREND';
  }

  const evalData = evaluateCandleSeriesAndTick({
    pair: params.pair,
    timeframe: params.recommendedTf,
    livePrice: params.price,
    baseCandles: params.candles,
    candlesAreRealOhlc: params.candlesAreRealOhlc,
    change24hPct: effectivePct,
    macro: params.macro,
    brokerSpread: params.spreadByBroker.fxpesa?.spread,
    h1TrendDirection,
    previousDirection: params.previousDirection
  });

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
    swingLow: evalData.swingLow,
    swingHigh: evalData.swingHigh,
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
    isExtendedZone: computed.isExtendedZone,
    entryTimingWarning: computed.entryTimingWarning,
    dataSource: params.dataSource || 'Live Feed + Institutional Calibration',
    spreadByBroker: params.spreadByBroker
  };
}

export function sortMarketsByTopPercent(
  list: MarketScanData[],
  mode: 'PCT_DESC' | 'PCT_ABS' | 'CONFIDENCE' = 'PCT_DESC'
): MarketScanData[] {
  const sorted = [...list].sort((a, b) => {
    if (mode === 'PCT_ABS') {
      const diffAbs = Math.abs(b.change24hPct) - Math.abs(a.change24hPct);
      return diffAbs !== 0 ? diffAbs : b.change24hPct - a.change24hPct;
    }
    if (mode === 'CONFIDENCE') {
      const diffConf = b.confidence - a.confidence;
      return diffConf !== 0 ? diffConf : b.change24hPct - a.change24hPct;
    }
    // Primary ranking: Top % down to Least %
    const diffPct = b.change24hPct - a.change24hPct;
    return diffPct !== 0 ? diffPct : b.confidence - a.confidence;
  });
  return sorted.map((m, idx) => ({
    ...m,
    currentRank: idx + 1,
    isTopPick: idx === 0
  }));
}

export const INITIAL_MARKETS_DATA: MarketScanData[] = sortMarketsByTopPercent([
  buildCalibratedMarketItem({
    pair: 'BTC/USD',
    symbol: 'Bitcoin Spot',
    price: 80491.43,
    change24hPct: 3.43,
    recommendedTf: 'H1',
    recommendedSession: '24/7 Global Liquidity Flow',
    volatility: 'HIGH',
    isTopPick: true,
    spreadByBroker: {
      fxpesa: { symbol: 'BTCUSD', spread: 25.0, notes: 'CMA CFD contract with risk protection.' },
      hfm: { symbol: 'BTCUSD', spread: 30.0, notes: 'High leverage crypto CFD.' },
      exness: { symbol: 'BTCUSD', spread: 18.0, notes: 'Zero overnight swap fee on crypto CFDs.' },
      fbs: { symbol: 'BTCUSD', spread: 35.0, notes: 'Crypto swap rates apply.' }
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
    pair: 'GBP/USD',
    symbol: 'Cable (British Pound)',
    price: 1.35140,
    change24hPct: 0.42,
    recommendedTf: 'M10',
    recommendedSession: 'London Open (10:00 - 13:00 EAT)',
    volatility: 'HIGH',
    spreadByBroker: {
      fxpesa: { symbol: 'GBPUSD', spread: 1.1, notes: 'CMA Kenya regulated, tight 1.1 pip spread.' },
      hfm: { symbol: 'GBPUSD.h', spread: 1.3, notes: 'Standard ECN execution.' },
      exness: { symbol: 'GBPUSD.m', spread: 0.6, notes: 'Micro standard, 0.6 pip spread.' },
      fbs: { symbol: 'GBPUSD', spread: 1.5, notes: 'Cent and Standard account.' }
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
    pair: 'USD/CHF',
    symbol: 'Swissy',
    price: 0.87940,
    change24hPct: 0.16,
    recommendedTf: 'M15',
    recommendedSession: 'Zurich / London Session (10:00 - 17:00 EAT)',
    volatility: 'MEDIUM',
    spreadByBroker: {
      fxpesa: { symbol: 'USDCHF', spread: 1.2, notes: 'CMA standard.' },
      hfm: { symbol: 'USDCHF.h', spread: 1.4, notes: 'Standard.' },
      exness: { symbol: 'USDCHF.m', spread: 0.7, notes: 'Low spread.' },
      fbs: { symbol: 'USDCHF', spread: 1.5, notes: 'Cent account.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'EUR/JPY',
    symbol: 'Euppy Cross',
    price: 183.790,
    change24hPct: 0.21,
    recommendedTf: 'M15',
    recommendedSession: 'London / Tokyo Cross (10:00 - 16:30 EAT)',
    volatility: 'HIGH',
    spreadByBroker: {
      fxpesa: { symbol: 'EURJPY', spread: 1.5, notes: 'CMA cross pair.' },
      hfm: { symbol: 'EURJPY.h', spread: 1.7, notes: 'Standard.' },
      exness: { symbol: 'EURJPY.m', spread: 0.9, notes: 'Low friction cross.' },
      fbs: { symbol: 'EURJPY', spread: 1.9, notes: 'Cent account.' }
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
  })
]);

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
    'USD/CHF': 'USDCHF',
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
async function fetchWithFastTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 1600
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

export interface SuperAiLiveNote {
  pair: CurrencyPair;
  source: 'gemini-3.8-flash' | 'quantitative-engine';
  headline: string;
  note: string;
  invalidationNote: string;
  catalystWatch: string;
  tacticalNote: string;
  riskNote: string;
  macroNote: string;
  syncedAt: string;
}

const inFlightPairCandleMap = new Map<string, Promise<any>>();

/**
 * Fetches live FX/Crypto/Gold spot rate AND recent OHLC candlesticks from server aggregator + interbank APIs
 * with fast timeout protection and in-flight deduplication.
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
  const cacheKey = `${pair}_${timeframe}`;
  if (!customPrice) {
    const existingPromise = inFlightPairCandleMap.get(cacheKey);
    if (existingPromise) {
      return existingPromise;
    }
  }

  const runFetch = async () => {
    const baseline = INITIAL_MARKETS_DATA.find((m) => m.pair === pair) || INITIAL_MARKETS_DATA[0];
    let livePrice = baseline.price;
    let change24hPct = baseline.change24hPct;
    let fetchedCandles: OhlcCandle[] = [];
    let liveConnected = false;

    try {
      // 1. Primary server-side institutional Yahoo/Interbank aggregator (/api/live-markets)
      const serverRes = await fetchWithFastTimeout('/api/live-markets', {}, 2100).catch(() => null);
      if (serverRes && serverRes.ok) {
        const srvJson = await serverRes.json();
        const q = srvJson?.quotes?.[pair];
        if (q && typeof q.price === 'number' && q.price > 0) {
          livePrice = q.price;
          if (typeof q.change24hPct === 'number') {
            change24hPct = q.change24hPct;
          }
          const wantsH1 = timeframe === 'H1' || timeframe === 'H4' || timeframe === 'D1';
          const preferredBars = wantsH1
            ? (Array.isArray(q.h1Candles) && q.h1Candles.length >= 12 ? q.h1Candles : q.m15Candles)
            : (Array.isArray(q.m15Candles) && q.m15Candles.length >= 12 ? q.m15Candles : q.h1Candles);
          if (Array.isArray(preferredBars) && preferredBars.length >= 12) {
            fetchedCandles = preferredBars.slice(-60);
          }
          if (srvJson.liveFeedConnected) {
            liveConnected = true;
          }
        }
      }

      // 2. Supplement/override with direct exchange OHLC & WS-matched spot if lower timeframe or fallback needed
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

      if (fetchedCandles.length < 15 || !liveConnected || timeframe === 'M1' || timeframe === 'M5' || timeframe === 'M10') {
        const [coinbaseRes, krakenRes, binanceTickerRes, binanceKlinesRes] = await Promise.allSettled([
          fetchWithFastTimeout(`https://api.coinbase.com/v2/exchange-rates?currency=USD&_t=${Date.now()}`, {}, 1400),
          krakenPair ? fetchWithFastTimeout(`https://api.kraken.com/0/public/OHLC?pair=${krakenPair}&interval=${interval}`, {}, 1600) : Promise.resolve(null),
          binanceSym ? fetchWithFastTimeout(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSym}`, {}, 1400) : Promise.resolve(null),
          binanceSym ? fetchWithFastTimeout(`https://api.binance.com/api/v3/klines?symbol=${binanceSym}&interval=${binanceInterval}&limit=80`, {}, 1500) : Promise.resolve(null)
        ]);

        if (!liveConnected && coinbaseRes.status === 'fulfilled' && coinbaseRes.value && coinbaseRes.value.ok) {
          const cbData = await coinbaseRes.value.json();
          const r = cbData?.data?.rates;
          if (r) {
            if (pair === 'EUR/USD' && r.EUR) { livePrice = 1 / parseFloat(r.EUR); liveConnected = true; }
            else if (pair === 'GBP/USD' && r.GBP) { livePrice = 1 / parseFloat(r.GBP); liveConnected = true; }
            else if (pair === 'USD/JPY' && r.JPY) { livePrice = parseFloat(r.JPY); liveConnected = true; }
            else if (pair === 'USD/CHF' && r.CHF) { livePrice = parseFloat(r.CHF); liveConnected = true; }
            else if (pair === 'USD/CAD' && r.CAD) { livePrice = parseFloat(r.CAD); liveConnected = true; }
            else if (pair === 'AUD/USD' && r.AUD) { livePrice = 1 / parseFloat(r.AUD); liveConnected = true; }
            else if (pair === 'GBP/JPY' && r.GBP && r.JPY) { livePrice = (1 / parseFloat(r.GBP)) * parseFloat(r.JPY); liveConnected = true; }
            else if (pair === 'EUR/JPY' && r.EUR && r.JPY) { livePrice = (1 / parseFloat(r.EUR)) * parseFloat(r.JPY); liveConnected = true; }
          }
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

        const isCryptoOrGold = pair === 'BTC/USD' || pair === 'XAU/USD';
        if (binanceKlinesRes.status === 'fulfilled' && binanceKlinesRes.value && binanceKlinesRes.value.ok && (pair === 'BTC/USD' || fetchedCandles.length < 12)) {
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
          if (last > 0 && (pair === 'BTC/USD' || (isCryptoOrGold && !liveConnected) || !liveConnected)) {
            livePrice = last;
            liveConnected = true;
          }
          if (!isNaN(pct) && (pair === 'BTC/USD' || !liveConnected)) {
            change24hPct = pct;
          }
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
  };

  if (customPrice) {
    return runFetch();
  }

  const p = runFetch().finally(() => {
    inFlightPairCandleMap.delete(cacheKey);
  });
  inFlightPairCandleMap.set(cacheKey, p);
  return p;
}

const cachedBackgroundCandles: Partial<
  Record<CurrencyPair, { m15?: OhlcCandle[]; h1?: OhlcCandle[]; fetchedAt: number }>
> = {};
let isRefreshingBgCandles = false;

async function refreshBackgroundRealOhlcCandles(force = false) {
  if (isRefreshingBgCandles || typeof fetch === 'undefined') return;
  const now = Date.now();
  const sample = cachedBackgroundCandles['GBP/USD'];
  if (!force && sample && now - sample.fetchedAt < 14_000) return;

  isRefreshingBgCandles = true;
  try {
    const serverRes = await fetchWithFastTimeout('/api/live-markets', {}, 2200).catch(() => null);
    if (serverRes && serverRes.ok) {
      const srvJson = await serverRes.json();
      const quotes = srvJson?.quotes || {};
      (Object.keys(quotes) as CurrencyPair[]).forEach((pName) => {
        const q = quotes[pName];
        if (q) {
          const m15 = Array.isArray(q.m15Candles) && q.m15Candles.length >= 15 ? q.m15Candles.slice(-60) : cachedBackgroundCandles[pName]?.m15;
          const h1 = Array.isArray(q.h1Candles) && q.h1Candles.length >= 15 ? q.h1Candles.slice(-60) : cachedBackgroundCandles[pName]?.h1;
          if (m15 || h1) {
            cachedBackgroundCandles[pName] = { m15, h1, fetchedAt: Date.now() };
          }
        }
      });
      if (cachedBackgroundCandles['GBP/USD']?.m15) {
        return;
      }
    }

    const sig = typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(2600) : undefined;
    const krakenSpecs: { pair: CurrencyPair; kSym: string }[] = [
      { pair: 'GBP/USD', kSym: 'GBPUSD' },
      { pair: 'EUR/USD', kSym: 'EURUSD' },
      { pair: 'USD/JPY', kSym: 'USDJPY' },
      { pair: 'USD/CHF', kSym: 'USDCHF' },
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
  } catch {
    // Non-blocking background OHLC refresh
  } finally {
    isRefreshingBgCandles = false;
  }
}

const inFlightSnapshotPromiseRef: { current: Promise<{ markets: MarketScanData[]; syncedAt: string; liveFeedConnected: boolean }> | null } = {
  current: null
};

/**
 * Fetches live FX, Gold, and BTC spot prices & OHLC candles across all 10 markets simultaneously
 * via server institutional cache + direct exchange fallback.
 */
export async function fetchLiveMarketSnapshot(
  currentMarkets: MarketScanData[] = INITIAL_MARKETS_DATA
): Promise<{ markets: MarketScanData[]; syncedAt: string; liveFeedConnected: boolean }> {
  if (inFlightSnapshotPromiseRef.current) {
    return inFlightSnapshotPromiseRef.current;
  }

  const runSnapshot = async (): Promise<{ markets: MarketScanData[]; syncedAt: string; liveFeedConnected: boolean }> => {
    void refreshBackgroundRealOhlcCandles(false);

    const liveMap: Partial<Record<CurrencyPair, { price: number; pct: number; dailyOpen?: number }>> = {};
    const candleMap: Partial<Record<CurrencyPair, OhlcCandle[]>> = {};
    const h1CandleMap: Partial<Record<CurrencyPair, OhlcCandle[]>> = {};
    let liveFeedConnected = false;

    currentMarkets.forEach((cm) => {
      liveMap[cm.pair] = {
        price: cm.price,
        pct: cm.change24hPct,
        dailyOpen: cm.dailyOpenPrice
      };
      const c = cachedBackgroundCandles[cm.pair];
      if (c?.m15 && c.m15.length >= 15) candleMap[cm.pair] = c.m15;
      if (c?.h1 && c.h1.length >= 15) h1CandleMap[cm.pair] = c.h1;
    });

    try {
      // 1. Primary server-side institutional live markets aggregator (/api/live-markets)
      const serverRes = await fetchWithFastTimeout('/api/live-markets', {}, 2100).catch(() => null);
      if (serverRes && serverRes.ok) {
        const srvJson = await serverRes.json();
        const quotes = srvJson?.quotes || {};
        (Object.keys(quotes) as CurrencyPair[]).forEach((pName) => {
          const q = quotes[pName];
          if (q && typeof q.price === 'number' && q.price > 0) {
            liveMap[pName] = {
              price: q.price,
              pct: typeof q.change24hPct === 'number' ? q.change24hPct : liveMap[pName]?.pct ?? 0,
              dailyOpen: q.dailyOpenPrice ?? liveMap[pName]?.dailyOpen
            };
            if (Array.isArray(q.m15Candles) && q.m15Candles.length >= 15) {
              candleMap[pName] = q.m15Candles.slice(-60);
            }
            if (Array.isArray(q.h1Candles) && q.h1Candles.length >= 15) {
              h1CandleMap[pName] = q.h1Candles.slice(-60);
            }
          }
        });
        if (srvJson.liveFeedConnected) {
          liveFeedConnected = true;
        }
      }

      // 2. Fallback direct exchange tickers if /api/live-markets did not report a live upstream feed
      if (!liveFeedConnected) {
        const [coinbaseRes, binanceTickerRes] = await Promise.allSettled([
          fetchWithFastTimeout(`https://api.coinbase.com/v2/exchange-rates?currency=USD&_t=${Date.now()}`, {}, 1400),
          fetchWithFastTimeout('https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22PAXGUSDT%22%5D', {}, 1400)
        ]);

        if (coinbaseRes.status === 'fulfilled' && coinbaseRes.value && coinbaseRes.value.ok) {
          const cb = await coinbaseRes.value.json();
          const r = cb?.data?.rates;
          if (r) {
            const eur = r.EUR ? 1 / parseFloat(r.EUR) : undefined;
            const gbp = r.GBP ? 1 / parseFloat(r.GBP) : undefined;
            const jpy = r.JPY ? parseFloat(r.JPY) : undefined;
            const chf = r.CHF ? parseFloat(r.CHF) : undefined;
            const cad = r.CAD ? parseFloat(r.CAD) : undefined;
            const aud = r.AUD ? 1 / parseFloat(r.AUD) : undefined;
            if (eur) liveMap['EUR/USD'] = { price: Number(eur.toFixed(5)), pct: liveMap['EUR/USD']?.pct ?? 0 };
            if (gbp) liveMap['GBP/USD'] = { price: Number(gbp.toFixed(5)), pct: liveMap['GBP/USD']?.pct ?? 0 };
            if (jpy) liveMap['USD/JPY'] = { price: Number(jpy.toFixed(3)), pct: liveMap['USD/JPY']?.pct ?? 0 };
            if (chf) liveMap['USD/CHF'] = { price: Number(chf.toFixed(5)), pct: liveMap['USD/CHF']?.pct ?? 0 };
            if (cad) liveMap['USD/CAD'] = { price: Number(cad.toFixed(5)), pct: liveMap['USD/CAD']?.pct ?? 0 };
            if (aud) liveMap['AUD/USD'] = { price: Number(aud.toFixed(5)), pct: liveMap['AUD/USD']?.pct ?? 0 };
            if (gbp && jpy) liveMap['GBP/JPY'] = { price: Number((gbp * jpy).toFixed(3)), pct: liveMap['GBP/JPY']?.pct ?? 0 };
            if (eur && jpy) liveMap['EUR/JPY'] = { price: Number((eur * jpy).toFixed(3)), pct: liveMap['EUR/JPY']?.pct ?? 0 };
            liveFeedConnected = true;
          }
        }

        if (binanceTickerRes.status === 'fulfilled' && binanceTickerRes.value && binanceTickerRes.value.ok) {
          const tickers = await binanceTickerRes.value.json();
          if (Array.isArray(tickers)) {
            for (const t of tickers) {
              if (t.symbol === 'BTCUSDT') {
                const p = parseFloat(t.lastPrice);
                const pct = parseFloat(t.priceChangePercent);
                if (p > 0) {
                  liveMap['BTC/USD'] = { price: Number(p.toFixed(2)), pct: !isNaN(pct) ? pct : liveMap['BTC/USD']?.pct ?? 0 };
                  liveFeedConnected = true;
                }
              } else if (t.symbol === 'PAXGUSDT') {
                const p = parseFloat(t.lastPrice);
                const pct = parseFloat(t.priceChangePercent);
                if (p > 1500) {
                  liveMap['XAU/USD'] = { price: Number(p.toFixed(2)), pct: !isNaN(pct) ? pct : liveMap['XAU/USD']?.pct ?? 0 };
                  liveFeedConnected = true;
                }
              }
            }
          }
        }
      }
    } catch {
      // Graceful fallback
    }

    const pctSnapshot: Partial<Record<CurrencyPair, number>> = {};
    (Object.keys(liveMap) as CurrencyPair[]).forEach((k) => {
      pctSnapshot[k] = liveMap[k]?.pct;
    });
    const liveMacro = getCurrentMacroContext(pctSnapshot);

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

    const nowTickStr =
      new Date().toLocaleTimeString('en-GB', {
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

    const withTop = sortMarketsByTopPercent(rebuilt, 'PCT_DESC');
    return { markets: withTop, syncedAt: nowTickStr, liveFeedConnected };
  };

  const p = runSnapshot().finally(() => {
    inFlightSnapshotPromiseRef.current = null;
  });
  inFlightSnapshotPromiseRef.current = p;
  return p;
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
      windowBadgeShort: `CLOSED · OPENS IN ${cd}`,
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
    'USD/CHF': [
      { name: 'Zurich & London Open (10:00–13:30 EAT)', startSec: 10 * 3600, endSec: 13.5 * 3600 },
      { name: 'London / NY Overlap (15:30–19:30 EAT)', startSec: 15.5 * 3600, endSec: 19.5 * 3600 }
    ],
    'EUR/JPY': [
      { name: 'Tokyo Morning Cross (03:00–06:30 EAT)', startSec: 3 * 3600, endSec: 6.5 * 3600 },
      { name: 'Frankfurt & London Cross (10:00–13:00 EAT)', startSec: 10 * 3600, endSec: 13 * 3600 },
      { name: 'New York Overlap Impulse (15:30–19:00 EAT)', startSec: 15.5 * 3600, endSec: 19 * 3600 }
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
      statusLabel: `MARKET OPEN · CLOSES IN ${cd}`,
      windowBadgeShort: `OPEN · ${cd}`,
      bannerHeadline: `MARKET OPEN · GOOD ENTRY WINDOW (Closes in ${cd})`,
      currentWindowName: activeWin.name,
      nextWindowName: 'Active Session Open',
      countdownFormatted: cd,
      countdownSeconds: secsLeft,
      reasonText: `${pair} window OPEN inside ${activeWin.name} (${cd} remaining). Tight institutional spreads & active liquidity.`
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
    statusLabel: openingSoon ? `OPENS SOON · IN ${cd}` : `WINDOW PAUSED · OPENS IN ${cd}`,
    windowBadgeShort: openingSoon ? `OPENS IN ${cd}` : `WAIT · ${cd}`,
    bannerHeadline: openingSoon
      ? `MARKET TO OPEN SOON · OPENS IN ${cd} (${nextWin.name})`
      : `MARKET WINDOW WAITING · OPENS IN ${cd} (${nextWin.name})`,
    currentWindowName: secOfDay >= 22 * 3600 || secOfDay < 2.5 * 3600 ? 'Low-Liquidity Rollover Zone' : 'Mid-Session Consolidation Lull',
    nextWindowName: nextWin.name,
    countdownFormatted: cd,
    countdownSeconds: secsUntil,
    reasonText: `Next favourable liquidity window (${nextWin.name}) opens in ${cd}.`
  };
}

export function computeCandleSwingLevels(candles?: OhlcCandle[]): {
  swingLow?: number;
  swingHigh?: number;
} {
  if (!candles || candles.length === 0) return {};
  const recent = candles.slice(-16);
  const swingLow = Math.min(...recent.map((c) => c.low));
  const swingHigh = Math.max(...recent.map((c) => c.high));
  return {
    swingLow: Number.isFinite(swingLow) ? swingLow : undefined,
    swingHigh: Number.isFinite(swingHigh) ? swingHigh : undefined
  };
}

/**
 * Generates the comprehensive Daily Global Trade Safety & Macro Factors report (Pillar 09)
 * answering whether it is safe to BUY or SELL today across all 10 markets, auto-updating
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
  const chfPct = byPair['USD/CHF']?.change24hPct ?? 0;
  const cadPct = byPair['USD/CAD']?.change24hPct ?? 0;
  const goldPct = byPair['XAU/USD']?.change24hPct ?? 0;
  const btcPct = byPair['BTC/USD']?.change24hPct ?? 0;

  // Live USD Basket (DXY proxy) % change across EUR, GBP, AUD, JPY, CHF, CAD
  const dxyPressurePct = Number(
    (-0.42 * eurPct - 0.16 * gbpPct - 0.08 * audPct + 0.15 * jpyPct + 0.11 * chfPct + 0.08 * cadPct).toFixed(2)
  );

  const dxyStatus: DailyMacroSafetyReport['dxyStatus'] =
    dxyPressurePct >= 0.12
      ? 'USD SURGING BULLISH'
      : dxyPressurePct <= -0.12
      ? 'USD WEAKENING BEARISH'
      : 'USD MIXED EQUILIBRIUM';

  const dxySummary =
    dxyStatus === 'USD SURGING BULLISH'
      ? `US Dollar Basket is strong (${dxyPressurePct >= 0 ? `+${dxyPressurePct}%` : `${dxyPressurePct}%`}). Favour USD-denominated shorts (SELL EUR/USD, SELL GBP/USD, SELL AUD/USD) or cautious USD/JPY, USD/CHF & USD/CAD longs.`
      : dxyStatus === 'USD WEAKENING BEARISH'
      ? `US Dollar Basket is softening (${dxyPressurePct}%). Institutional tail-wind supports BUY setups on EUR/USD, GBP/USD, AUD/USD, and Gold (XAU/USD).`
      : `US Dollar Basket is balanced (${dxyPressurePct >= 0 ? `+${dxyPressurePct}%` : `${dxyPressurePct}%`}). Trade individual pair structure around 20/50 EMA rather than blind USD correlation.`;

  // Global Risk Sentiment Regime
  const riskScore =
    (btcPct > 0.6 ? 1 : btcPct < -0.8 ? -1 : 0) +
    (jpyPct > 0.15 ? 1 : jpyPct < -0.25 ? -1 : 0) -
    (goldPct > 1.2 ? 0.5 : 0);
  const riskRegime: DailyMacroSafetyReport['riskRegime'] =
    riskScore > 0.4 ? 'RISK-ON EXPANSION' : riskScore < -0.4 ? 'RISK-OFF SAFE-HAVEN' : 'MIXED CONSOLIDATION';

  const riskRegimeSummary =
    riskRegime === 'RISK-ON EXPANSION'
      ? 'Global risk appetite is constructive (Equities/BTC supported, Yen carry calm). Trend-following pullbacks on GBP/USD, EUR/USD, EUR/JPY, and GBP/JPY have higher follow-through.'
      : riskRegime === 'RISK-OFF SAFE-HAVEN'
      ? 'Defensive safe-haven flows active (Capital rotating into Gold XAU/USD, Swiss Franc CHF & Japanese Yen JPY). Beware sharp downside wicks on risk crosses like GBP/JPY, EUR/JPY & AUD/USD.'
      : 'Global macro flows are selective. Stick strictly to A+ liquidity sweeps and enforce the 0.01 micro lot Gilgil cap ($2.00 max risk).';

  // East Africa Time (Nairobi UTC+3) Live Session Guard
  const now = new Date();
  const eatTimeString =
    now.toLocaleTimeString('en-GB', {
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
  const isStrongDxyOrVolatilitySurge =
    Math.abs(dxyPressurePct) >= 0.35 || Math.abs(goldPct) >= 1.35 || Math.abs(btcPct) >= 4.2;

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
  let sessionAdvice =
    'Asian liquidity range: prime window for USD/JPY, GBP/JPY, EUR/JPY, and AUD/USD after range sweep.';

  if (isRolloverHours) {
    sessionWindowName = 'Midnight Rollover & Dead Zone (22:00–02:59 EAT)';
    sessionSafety = 'UNSAFE_AVOID';
    sessionAdvice =
      'DO NOT OPEN NEW ORDERS right now. Broker spreads widen 3x–8x during daily swap rollover and stop-hunt spikes.';
  } else if (eatHour >= 15 && eatHour <= 18) {
    sessionWindowName = 'London / New York Killzone Overlap (15:30–18:59 EAT)';
    sessionSafety = 'SAFE_OPTIMAL';
    sessionAdvice =
      'PEAK GLOBAL INSTITUTIONAL LIQUIDITY: Tightest spreads and highest breakout follow-through across USD, GBP, EUR, CHF & Gold.';
  } else if (eatHour >= 10 && eatHour <= 14) {
    sessionWindowName = 'London Killzone & Morning Session (10:00–14:59 EAT)';
    sessionSafety = 'SAFE_OPTIMAL';
    sessionAdvice =
      'PRIME EUROPEAN LIQUIDITY: Ideal for EUR/USD, GBP/USD, EUR/JPY, GBP/JPY, USD/CHF, and Gold after initial Asian sweep.';
  } else if (eatHour >= 19 && eatHour <= 21) {
    sessionWindowName = 'New York Afternoon Session (19:00–21:59 EAT)';
    sessionSafety = 'CAUTION_WAIT';
    sessionAdvice = 'Volume tapers off toward NY close. Secure TP1 profits and wait for fresh Tokyo/London cycles.';
  }

  const activeWarnings: string[] = [];
  if (flags.highImpactUsNews) {
    activeWarnings.push(
      'HIGH-IMPACT USD WINDOW / NEWS GUARD: Elevated spike risk — wait 15 mins after candle close before executing.'
    );
  }
  if (flags.centralBankRateDay) {
    activeWarnings.push(
      'HIGH CENTRAL BANK CURRENCY VOLATILITY (>0.75% Daily Move): Expect sharp liquidity wicks on active majors.'
    );
  }
  if (flags.geopoliticalSafeHavenSpike) {
    activeWarnings.push(
      'SAFE-HAVEN CAPITAL SURGE: Gold (XAU/USD) & JPY demand elevated — keep strictly 0.01 micro lot.'
    );
  }
  if (flags.bankHolidayThinLiquidity) {
    activeWarnings.push('THIN INTERBANK VOLUME DETECTED: Price range compressed — avoid breakout chasing.');
  }
  if (flags.wideSpreadAlert) {
    activeWarnings.push(
      'ROLLOVER / WIDE SPREAD GUARD: Broker spreads expanded — pause new entries until session opens.'
    );
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

  const liveMacro = getCurrentMacroContext({
    'EUR/USD': eurPct,
    'GBP/USD': gbpPct,
    'AUD/USD': audPct,
    'USD/JPY': jpyPct,
    'USD/CHF': chfPct,
    'USD/CAD': cadPct,
    'XAU/USD': goldPct,
    'BTC/USD': btcPct
  });

  const assetScorecards: AssetDailySafetyCard[] = markets.map((m) => {
    const isUsdQuote = m.pair.endsWith('/USD');
    const isUsdBase = m.pair.startsWith('USD/');
    const isJpyCross = m.pair === 'GBP/JPY' || m.pair === 'EUR/JPY';
    const isGold = m.pair === 'XAU/USD';
    const kenyaTiming = evaluatePairKenyaTiming(m.pair, now);

    // Unified institutional scoring aligned with MultiMarketRadarEngine & ActiveMarketOrderPanel
    const factorJudgment = evaluateAllTradeFactors({
      pair: m.pair,
      livePrice: m.price,
      ema20: m.ema20,
      ema50: m.ema50,
      rsi: m.rsi,
      atrPips: m.atrPips,
      keyLevel: m.keyLevel,
      h1TrendDirection: m.h1TrendDirection,
      macro: liveMacro
    });

    const timingPenalty = kenyaTiming.isFavorableTime ? 0 : 14;
    const macroPenalty =
      (flags.wideSpreadAlert ? 22 : 0) +
      (flags.highImpactUsNews ? 12 : 0) +
      (flags.bankHolidayThinLiquidity ? 14 : 0) +
      timingPenalty;

    const buyScore = Math.max(
      14,
      Math.min(96, Math.round(factorJudgment.bullScorePct - macroPenalty))
    );
    const sellScore = Math.max(
      14,
      Math.min(96, Math.round(factorJudgment.bearScorePct - macroPenalty))
    );

    let dxyCorrelationNote = 'Neutral cross-flow correlation';
    if (isUsdQuote && !isGold) {
      dxyCorrelationNote =
        dxyPressurePct <= -0.1
          ? `DXY weakening (${dxyPressurePct}%) gives BUY tail-wind`
          : dxyPressurePct >= 0.1
          ? `DXY surging (+${dxyPressurePct}%) creates head-wind against BUY`
          : `DXY balanced (${dxyPressurePct >= 0 ? `+${dxyPressurePct}%` : `${dxyPressurePct}%`}) — rely on ${m.pair} EMA structure`;
    } else if (isUsdBase) {
      dxyCorrelationNote =
        dxyPressurePct >= 0.1
          ? `DXY surging (+${dxyPressurePct}%) supports ${m.pair} upside`
          : dxyPressurePct <= -0.1
          ? `DXY weakening (${dxyPressurePct}%) favors ${m.pair} downside`
          : `DXY balanced (${dxyPressurePct >= 0 ? `+${dxyPressurePct}%` : `${dxyPressurePct}%`}) — follow H1/M15 swing structure`;
    } else if (isGold) {
      dxyCorrelationNote =
        flags.geopoliticalSafeHavenSpike || dxyPressurePct < 0
          ? 'Safe-haven demand & softer USD favor Gold accumulation'
          : dxyPressurePct > 0.25
          ? 'Strong USD yields cap Gold rallies'
          : 'Balanced bullion flow around structural key levels';
    } else if (isJpyCross) {
      dxyCorrelationNote =
        riskRegime === 'RISK-OFF SAFE-HAVEN'
          ? `Risk-Off JPY inflow warns against aggressive ${m.pair} longs`
          : `Risk-On Yen weakness supports ${m.pair} upward swings`;
    }

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

    let globalEntryBannerText = `SAFE TO ${plannedSide} ${m.pair} NOW — Kenya Session Active (${kenyaTiming.countdownFormatted} left) & Macro Aligned`;
    if (flags.wideSpreadAlert) {
      globalEntryBannerText = `NOT SAFE TO ENTER ${m.pair} — Rollover Wide Spreads Active (Wait for Next Session)`;
    } else if (!kenyaTiming.isFavorableTime) {
      globalEntryBannerText = `NOT FAVOURABLE TIME FOR ${m.pair} ENTRY IN KENYA — Wait ${kenyaTiming.countdownFormatted} for ${kenyaTiming.nextWindowName}`;
    } else if (factorJudgment.isExtendedZone && factorJudgment.entryTimingWarning) {
      globalEntryBannerText = `WAIT PULLBACK ON ${m.pair} — ${factorJudgment.entryTimingWarning}`;
    } else if (isUsdQuote && !isGold && plannedSide === 'BUY' && dxyPressurePct >= 0.15) {
      globalEntryBannerText = `GLOBAL WARNING ON ${m.pair} BUY — US Dollar (DXY +${dxyPressurePct}%) Moving Against Planned Entry`;
    } else if (isUsdBase && plannedSide === 'BUY' && dxyPressurePct <= -0.15) {
      globalEntryBannerText = `GLOBAL WARNING ON ${m.pair} BUY — US Dollar (DXY ${dxyPressurePct}%) Weakening Against Planned Entry`;
    } else if (bestScore < 56) {
      globalEntryBannerText = `CAUTION ON ${m.pair} — Wait for Cleaner EMA / RSI Alignment`;
    }

    let primaryVerdictText = 'WAIT FOR KENYA WINDOW';
    if (flags.wideSpreadAlert || bestScore < 42) primaryVerdictText = 'NOT SAFE RIGHT NOW';
    else if (!kenyaTiming.isFavorableTime) primaryVerdictText = `WAIT (${kenyaTiming.countdownFormatted})`;
    else if (factorJudgment.isExtendedZone) primaryVerdictText = 'WAIT PULLBACK (20 EMA)';
    else if (buyScore >= 72 && buyScore > sellScore) primaryVerdictText = 'SAFE TO BUY NOW';
    else if (sellScore >= 72 && sellScore > buyScore) primaryVerdictText = 'SAFE TO SELL NOW';
    else if (buyScore >= 56 && buyScore >= sellScore) primaryVerdictText = 'SELECTIVE BUY';
    else if (sellScore >= 56 && sellScore > buyScore) primaryVerdictText = 'SELECTIVE SELL';

    const globalDriverNote =
      m.rsi >= 68
        ? `RSI ${m.rsi} Overbought: UNSAFE to chase BUY orders; watch for Tower Top SELL sweep near ${m.keyLevel}.`
        : m.rsi <= 32
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
export interface DailyMacroAiDirective {
  headline: string;
  overallSafety: string;
  hourlyOutlook: string;
  catalystSummary: string;
  source: 'gemini-3.8-flash' | 'quantitative-engine';
  syncedAt: string;
}

export type ScannerWorkspaceTab =
  | 'hub'
  | 'radar'
  | 'favorable_chart'
  | 'manual'
  | 'advisor'
  | 'camera'
  | 'trade_log';

export interface GlobalStreamState {
  markets: MarketScanData[];
  selectedPair: CurrencyPair | null;
  activeBroker: BrokerId;
  activeOrders: Partial<Record<CurrencyPair, ActiveMarketOrder>>;
  orderHistory: ClosedOrderHistoryEntry[];
  suggestedSignals: SuggestedSignalLogEntry[];
  notifications: TradeNotification[];
  superAiAutoEnabled: boolean;
  superAiNotes: Partial<Record<CurrencyPair, SuperAiLiveNote>>;
  dailyMacroDirective: DailyMacroAiDirective;
  syncedAt: string;
  liveFeedConnected: boolean;
  tickCount: number;
  lastScanMode: 'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai';
  lockedPairs: Partial<Record<CurrencyPair, boolean>>;
  customTimeframes: Partial<Record<CurrencyPair, Timeframe>>;
}

type StreamListener = (state: GlobalStreamState) => void;

const ACTIVE_ORDERS_STORAGE_KEY = 'pivotfx_active_market_orders_v1';
const CLOSED_ORDERS_STORAGE_KEY = 'pivotfx_closed_orders_history_v1';
const SUGGESTED_SIGNALS_STORAGE_KEY = 'pivotfx_suggested_signals_v1';
const NOTIFICATIONS_STORAGE_KEY = 'pivotfx_trade_notifications_v1';
const BROKER_STORAGE_KEY = 'pivotfx_selected_broker_v1';
const PROP_TRADES_STORAGE_KEY = 'pivotfx_prop_trades';

function loadPersistedActiveOrders(): Partial<Record<CurrencyPair, ActiveMarketOrder>> {
  try {
    if (typeof window === 'undefined') return {};
    const raw = window.localStorage.getItem(ACTIVE_ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Record<CurrencyPair, ActiveMarketOrder>>) : {};
  } catch {
    return {};
  }
}

function loadPersistedOrderHistory(): ClosedOrderHistoryEntry[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(CLOSED_ORDERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ClosedOrderHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function loadPersistedSuggestedSignals(): SuggestedSignalLogEntry[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(SUGGESTED_SIGNALS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SuggestedSignalLogEntry[]) : [];
  } catch {
    return [];
  }
}

function loadPersistedNotifications(): TradeNotification[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TradeNotification[]) : [];
  } catch {
    return [];
  }
}

function loadPersistedBroker(): BrokerId {
  try {
    if (typeof window === 'undefined') return 'fxpesa';
    const raw = window.localStorage.getItem(BROKER_STORAGE_KEY);
    if (raw === 'fxpesa' || raw === 'exness' || raw === 'hfm' || raw === 'fbs') return raw;
    return 'fxpesa';
  } catch {
    return 'fxpesa';
  }
}

function buildInitialMacroDirective(markets: MarketScanData[]): DailyMacroAiDirective {
  const pctMap: Partial<Record<CurrencyPair, number>> = {};
  markets.forEach((m) => {
    pctMap[m.pair] = m.change24hPct;
  });
  const macro = getCurrentMacroContext(pctMap);
  const top = markets[0];
  const buyCount = markets.filter((m) => m.bias !== 'STRONG_SELL').length;
  const sellCount = markets.length - buyCount;

  const headline =
    macro.dxyPressurePct <= -0.08
      ? `TODAY & THIS HOUR: FAVOURABLE BUYING ON NON-USD PAIRS & GOLD (DXY ${macro.dxyPressurePct}%)`
      : macro.dxyPressurePct >= 0.08
      ? `TODAY & THIS HOUR: FAVOURABLE SELLING EUR/GBP/AUD · LONG USD PAIRS (DXY +${macro.dxyPressurePct}%)`
      : buyCount >= sellCount
      ? `TODAY & THIS HOUR: SELECTIVE BUY BIAS (${buyCount} BUY vs ${sellCount} SELL Setups)`
      : `TODAY & THIS HOUR: SELECTIVE SELL BIAS (${sellCount} SELL vs ${buyCount} BUY Setups)`;

  return {
    headline,
    overallSafety: macro.overallDaySafety,
    hourlyOutlook: top
      ? `${macro.sessionWindowName} (${macro.eatTimeString}): #1 Leader ${top.pair} (${
          top.change24hPct >= 0 ? `+${top.change24hPct}%` : `${top.change24hPct}%`
        }) holds ${top.trendDirection} → ${top.bias === 'STRONG_SELL' ? 'SELL' : 'BUY'} @ ${top.price}.`
      : macro.overallHeadline,
    catalystSummary: `Macro Regime: ${macro.riskRegime} · ${macro.dxySummary} · 0.01 Micro Lot ($2.00 / 260 KES Cap)`,
    source: 'quantitative-engine',
    syncedAt: macro.eatTimeString
  };
}

class GlobalLiveMarketStreamEngine {
  private markets: MarketScanData[] = INITIAL_MARKETS_DATA;
  private selectedPair: CurrencyPair | null = null;
  private activeBroker: BrokerId = loadPersistedBroker();
  private activeOrders: Partial<Record<CurrencyPair, ActiveMarketOrder>> = loadPersistedActiveOrders();
  private orderHistory: ClosedOrderHistoryEntry[] = loadPersistedOrderHistory();
  private suggestedSignals: SuggestedSignalLogEntry[] = loadPersistedSuggestedSignals();
  private notifications: TradeNotification[] = loadPersistedNotifications();
  private superAiAutoEnabled: boolean = true;
  private superAiNotes: Partial<Record<CurrencyPair, SuperAiLiveNote>> = {};
  private dailyMacroDirective: DailyMacroAiDirective = buildInitialMacroDirective(INITIAL_MARKETS_DATA);
  private lastAiFetchByPair: Partial<Record<CurrencyPair, number>> = {};
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
  private orderMilestoneAlerts = new Set<string>();
  private lastNotificationDedupe = new Map<string, number>();

  private persistOrders() {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ACTIVE_ORDERS_STORAGE_KEY, JSON.stringify(this.activeOrders));
        window.localStorage.setItem(CLOSED_ORDERS_STORAGE_KEY, JSON.stringify(this.orderHistory));
      }
    } catch {}
  }

  private persistSuggestedSignals() {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SUGGESTED_SIGNALS_STORAGE_KEY, JSON.stringify(this.suggestedSignals));
      }
    } catch {}
  }

  private persistNotifications() {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications));
      }
    } catch {}
  }

  private appendPropJournalRecord(entry: {
    pair: CurrencyPair;
    direction: 'BUY' | 'SELL';
    entryPrice: number;
    exitPrice: number;
    pips: number;
    usdPnL: number;
    kesPnL: number;
    outcome: 'WIN' | 'LOSS' | 'PENDING';
    reason: string;
  }) {
    try {
      if (typeof window === 'undefined') return;
      const raw = window.localStorage.getItem(PROP_TRADES_STORAGE_KEY);
      const existing = raw && Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const mappedStatus =
        entry.outcome === 'WIN'
          ? 'WON'
          : entry.outcome === 'LOSS'
          ? 'LOST'
          : 'OPEN';
      const row = {
        id: `trd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: this.formatNowEat(),
        pair: entry.pair,
        type: entry.direction,
        lotSize: 0.01,
        entryPrice: entry.entryPrice,
        exitPrice: entry.exitPrice,
        pnlUsd: entry.usdPnL,
        status: mappedStatus,
        setupName: `Broker Order (${entry.pips >= 0 ? `+${entry.pips}p` : `${entry.pips}p`})`,
        mistakeTag:
          entry.outcome === 'WIN'
            ? 'Clean Execution'
            : entry.outcome === 'PENDING'
            ? 'Active Broker Order'
            : 'SL Protected Cap',
        notes: entry.reason
      };
      const updated = [row, ...existing].slice(0, 60);
      window.localStorage.setItem(PROP_TRADES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('pivotfx:prop-trades-updated', { detail: row }));
    } catch {}
  }

  public pushNotification(n: {
    pair?: CurrencyPair;
    type: TradeNotification['type'];
    title: string;
    message: string;
  }) {
    const now = Date.now();
    const dedupeKey = `${n.type}:${n.pair || ''}:${n.title}`;
    const lastFired = this.lastNotificationDedupe.get(dedupeKey) ?? 0;
    if (now - lastFired < 15_000) return;
    this.lastNotificationDedupe.set(dedupeKey, now);

    const item: TradeNotification = {
      id: `notif_${now}_${Math.random().toString(36).slice(2, 6)}`,
      pair: n.pair,
      type: n.type,
      title: n.title,
      message: n.message,
      eatTimestamp: this.formatNowEat(),
      timestampMs: now,
      read: false
    };

    this.notifications = [item, ...this.notifications].slice(0, 50);
    this.persistNotifications();
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('pivotfx:new-notification', { detail: item }));
      }
    } catch {}
    this.broadcast();
  }

  public markNotificationRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.persistNotifications();
    this.broadcast();
  }

  public markAllNotificationsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.persistNotifications();
    this.broadcast();
  }

  public clearNotifications() {
    this.notifications = [];
    this.persistNotifications();
    this.broadcast();
  }

  public logSuggestedSetup(params: {
    pair: CurrencyPair;
    timeframe?: Timeframe;
    broker?: BrokerId;
    direction?: 'BUY' | 'SELL';
    customEntryPrice?: number;
    customStopLoss?: number;
    customTp?: number;
    reasonSummary?: string;
    status?: 'SUGGESTED' | 'PLACED_WITH_BROKER';
    linkedOrderId?: string;
  }): SuggestedSignalLogEntry | null {
    const market = this.markets.find((m) => m.pair === params.pair) || this.markets[0];
    if (!market) return null;

    const broker = params.broker || this.activeBroker;
    const timeframe = params.timeframe || this.customTimeframes[market.pair] || market.recommendedTf || 'M15';
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    this.markets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    const macro = getCurrentMacroContext(pctMap);
    const swings = computeCandleSwingLevels(market.candles);
    const dir = params.direction || (market.bias === 'STRONG_SELL' ? 'SELL' : 'BUY');

    const computed = computeRealChartTradeParams({
      targetPair: market.pair,
      targetTf: timeframe,
      targetBroker: broker,
      price: params.customEntryPrice && params.customEntryPrice > 0 ? params.customEntryPrice : market.price,
      keyLevel: market.keyLevel,
      ema20: market.ema20,
      ema50: market.ema50,
      rsi: market.rsi,
      atrPips: market.atrPips,
      swingLow: swings.swingLow,
      swingHigh: swings.swingHigh,
      macro,
      biasOverride: dir,
      previousDirection: dir,
      h1TrendDirection: market.h1TrendDirection
    });

    const { decimals } = getPairSpecs(market.pair);
    const finalEntry =
      params.customEntryPrice && !isNaN(params.customEntryPrice) && params.customEntryPrice > 0
        ? Number(params.customEntryPrice.toFixed(decimals))
        : computed.entryPrice;
    const finalSl =
      params.customStopLoss && !isNaN(params.customStopLoss) && params.customStopLoss > 0
        ? Number(params.customStopLoss.toFixed(decimals))
        : computed.stopLoss;
    const finalTp2 =
      params.customTp && !isNaN(params.customTp) && params.customTp > 0
        ? Number(params.customTp.toFixed(decimals))
        : computed.tp2;

    const entry: SuggestedSignalLogEntry = {
      id: `sig_${Date.now()}_${market.pair.replace('/', '')}_${Math.random().toString(36).slice(2, 5)}`,
      pair: market.pair,
      direction: dir,
      timeframe,
      broker,
      entryPrice: finalEntry,
      stopLoss: finalSl,
      tp1: computed.tp1,
      tp2: finalTp2,
      tp3: computed.tp3,
      slPips: computed.slPips,
      tpPips: computed.tpPips,
      riskReward: computed.riskReward,
      confidence: computed.confidence,
      netProfitUsd: computed.netProfitUsd,
      netProfitKes: computed.netProfitKes,
      orderVerdict: computed.orderType,
      goAheadAssurance: computed.goAheadAssurance,
      reasonSummary:
        params.reasonSummary ||
        computed.entryTimingWarning ||
        `${computed.trendProjectionText} · ${computed.alignedFactorsCount}/${computed.totalFactorsCount} Factors Aligned`,
      loggedAtEat: this.formatNowEat(),
      suggestedTimestamp: Date.now(),
      status: params.status || 'SUGGESTED',
      linkedOrderId: params.linkedOrderId
    };

    this.suggestedSignals = [entry, ...this.suggestedSignals].slice(0, 60);
    this.persistSuggestedSignals();

    if (entry.status !== 'PLACED_WITH_BROKER') {
      this.pushNotification({
        pair: entry.pair,
        type: 'AI_SIGNAL',
        title: `${entry.pair} ${entry.direction} Setup Logged`,
        message: `Entry ${entry.entryPrice} · SL ${entry.stopLoss} · TP2 ${entry.tp2} (${entry.orderVerdict})`
      });
    } else {
      this.broadcast();
    }

    return entry;
  }

  public removeSuggestedSignal(id: string) {
    this.suggestedSignals = this.suggestedSignals.filter((s) => s.id !== id);
    this.persistSuggestedSignals();
    this.broadcast();
  }

  public clearSuggestedSignals() {
    this.suggestedSignals = [];
    this.persistSuggestedSignals();
    this.broadcast();
  }

  private syncActiveOrdersWithMarkets() {
    const orderKeys = Object.keys(this.activeOrders) as CurrencyPair[];
    if (orderKeys.length === 0) return;

    let anyChanged = false;
    for (const pairKey of orderKeys) {
      const order = this.activeOrders[pairKey];
      const market = this.markets.find((m) => m.pair === pairKey);
      if (!order || !market) continue;

      const metrics = computeLiveOrderMetrics(order, market.price, market.atrPips);
      let nextPeak = order.peakProfitUsd;
      if (metrics.netProfitUsd > nextPeak) {
        nextPeak = metrics.netProfitUsd;
        anyChanged = true;
      }

      // Check real-time TP milestones & drawdown cushion notifications (1 alert per milestone per order)
      if (metrics.hitTp1 && !this.orderMilestoneAlerts.has(`${order.id}:TP1`)) {
        this.orderMilestoneAlerts.add(`${order.id}:TP1`);
        this.pushNotification({
          pair: order.pair,
          type: 'TP_HIT',
          title: `${order.pair} ${order.direction} Reached TP1 (+${metrics.floatingPips}p)`,
          message: `Live candle @ ${market.price} crossed TP1 (${order.tp1}). Lock Breakeven SL (${metrics.suggestedBreakevenSl}) on your broker!`
        });
      }
      if (metrics.hitTp2 && !this.orderMilestoneAlerts.has(`${order.id}:TP2`)) {
        this.orderMilestoneAlerts.add(`${order.id}:TP2`);
        this.pushNotification({
          pair: order.pair,
          type: 'TP_HIT',
          title: `${order.pair} ${order.direction} Reached TP2 (+${metrics.floatingPips}p)`,
          message: `Target TP2 (${order.tp2}) reached (+$${metrics.netProfitUsd.toFixed(2)}). Trail SL or extend to TP3 (${order.tp3}).`
        });
      }
      if (
        !metrics.isInProfit &&
        metrics.pipsDistanceAboveSl > 0 &&
        metrics.pipsDistanceAboveSl <= 5.0 &&
        !this.orderMilestoneAlerts.has(`${order.id}:SL_PROXIMITY`)
      ) {
        this.orderMilestoneAlerts.add(`${order.id}:SL_PROXIMITY`);
        this.pushNotification({
          pair: order.pair,
          type: 'SL_WARNING',
          title: `${order.pair} ${order.direction} Drawdown Guard Alert`,
          message: `Price (${market.price}) is within ${metrics.pipsDistanceAboveSl}p of your SL (${order.stopLoss}). Check Super AI Position Coach in Trade Log.`
        });
      }

      let nextSl = order.stopLoss;
      let nextSlCount = order.slUpdatesCount;
      let nextTp2 = order.tp2;
      let nextTp3 = order.tp3;

      // When Auto-Trail Profit Lock is ON and trade has gained >= 8 pips in profit, lock SL forward!
      if (order.autoTrailEnabled && metrics.floatingPips >= 8) {
        const isBuy = order.direction === 'BUY';
        const improvedSl =
          metrics.floatingPips >= 18 ? metrics.suggestedLockProfitSl : metrics.suggestedBreakevenSl;
        if ((isBuy && improvedSl > nextSl) || (!isBuy && improvedSl < nextSl)) {
          nextSl = improvedSl;
          nextSlCount += 1;
          anyChanged = true;
        }
        if (metrics.pipsRemainingToTp2 <= 6 && metrics.floatingPips >= 16) {
          if (
            (isBuy && metrics.suggestedExpandedTp2 > nextTp2) ||
            (!isBuy && metrics.suggestedExpandedTp2 < nextTp2)
          ) {
            nextTp2 = metrics.suggestedExpandedTp2;
            nextTp3 = metrics.suggestedExpandedTp3;
            anyChanged = true;
          }
        }
      }

      this.activeOrders[pairKey] = {
        ...order,
        stopLoss: nextSl,
        tp2: nextTp2,
        tp3: nextTp3,
        slUpdatesCount: nextSlCount,
        peakProfitUsd: nextPeak
      };
    }

    if (anyChanged) {
      this.persistOrders();
    }
  }

  public getState(): GlobalStreamState {
    return {
      markets: this.markets,
      selectedPair: this.selectedPair,
      activeBroker: this.activeBroker,
      activeOrders: { ...this.activeOrders },
      orderHistory: [...this.orderHistory],
      suggestedSignals: [...this.suggestedSignals],
      notifications: [...this.notifications],
      superAiAutoEnabled: this.superAiAutoEnabled,
      superAiNotes: { ...this.superAiNotes },
      dailyMacroDirective: this.dailyMacroDirective,
      syncedAt: this.syncedAt,
      liveFeedConnected: this.liveFeedConnected,
      tickCount: this.tickCount,
      lastScanMode: this.lastScanMode,
      lockedPairs: { ...this.lockedPairs },
      customTimeframes: { ...this.customTimeframes }
    };
  }

  public setActiveBroker(broker: BrokerId) {
    this.activeBroker = broker;
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(BROKER_STORAGE_KEY, broker);
      }
    } catch {}
    this.broadcast();
  }

  public loadMarketOrder(params: {
    pair: CurrencyPair;
    direction: 'BUY' | 'SELL';
    lotSize?: number;
    timeframe?: Timeframe;
    broker?: BrokerId;
    autoTrailEnabled?: boolean;
    customEntryPrice?: number;
    customStopLoss?: number;
    customTp?: number;
    suggestedSignalId?: string;
    note?: string;
  }): ActiveMarketOrder | null {
    const market = this.markets.find((m) => m.pair === params.pair) || this.markets[0];
    if (!market) return null;

    const broker = params.broker || this.activeBroker;
    const timeframe = params.timeframe || this.customTimeframes[market.pair] || market.recommendedTf || 'M15';
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    this.markets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    const macro = getCurrentMacroContext(pctMap);
    const swings = computeCandleSwingLevels(market.candles);

    const entryToUse =
      params.customEntryPrice && !isNaN(params.customEntryPrice) && params.customEntryPrice > 0
        ? params.customEntryPrice
        : market.price;

    const computed = computeRealChartTradeParams({
      targetPair: market.pair,
      targetTf: timeframe,
      targetBroker: broker,
      price: entryToUse,
      keyLevel: market.keyLevel,
      ema20: market.ema20,
      ema50: market.ema50,
      rsi: market.rsi,
      atrPips: market.atrPips,
      swingLow: swings.swingLow,
      swingHigh: swings.swingHigh,
      macro,
      biasOverride: params.direction,
      previousDirection: params.direction,
      h1TrendDirection: market.h1TrendDirection
    });

    const { decimals } = getPairSpecs(market.pair);
    const finalEntry = Number(entryToUse.toFixed(decimals));
    const finalSl =
      params.customStopLoss && !isNaN(params.customStopLoss) && params.customStopLoss > 0
        ? Number(params.customStopLoss.toFixed(decimals))
        : computed.stopLoss;
    const finalTp2 =
      params.customTp && !isNaN(params.customTp) && params.customTp > 0
        ? Number(params.customTp.toFixed(decimals))
        : computed.tp2;

    const newOrder: ActiveMarketOrder = {
      id: `ord_${Date.now()}_${market.pair.replace('/', '')}`,
      pair: market.pair,
      direction: params.direction,
      lotSize: Number((params.lotSize || 0.01).toFixed(2)),
      broker,
      timeframe,
      entryPrice: finalEntry,
      stopLoss: finalSl,
      tp1: computed.tp1,
      tp2: finalTp2,
      tp3: computed.tp3,
      initialStopLoss: finalSl,
      initialTp2: finalTp2,
      loadedAtEat: this.formatNowEat(),
      loadedTimestamp: Date.now(),
      autoTrailEnabled: params.autoTrailEnabled ?? true,
      slUpdatesCount: 0,
      peakProfitUsd: 0
    };

    this.activeOrders[market.pair] = newOrder;
    this.persistOrders();

    // Update linked suggested signal or automatically record in Real Suggested Markets Trade Log as PLACED_WITH_BROKER
    if (params.suggestedSignalId) {
      let matched = false;
      this.suggestedSignals = this.suggestedSignals.map((sig) => {
        if (sig.id === params.suggestedSignalId) {
          matched = true;
          return {
            ...sig,
            status: 'PLACED_WITH_BROKER',
            linkedOrderId: newOrder.id,
            entryPrice: newOrder.entryPrice,
            stopLoss: newOrder.stopLoss,
            tp2: newOrder.tp2
          };
        }
        return sig;
      });
      this.persistSuggestedSignals();
      if (!matched) {
        this.logSuggestedSetup({
          pair: market.pair,
          timeframe,
          broker,
          direction: params.direction,
          customEntryPrice: newOrder.entryPrice,
          customStopLoss: newOrder.stopLoss,
          customTp: newOrder.tp2,
          reasonSummary: params.note,
          status: 'PLACED_WITH_BROKER',
          linkedOrderId: newOrder.id
        });
      }
    } else {
      this.logSuggestedSetup({
        pair: market.pair,
        timeframe,
        broker,
        direction: params.direction,
        customEntryPrice: newOrder.entryPrice,
        customStopLoss: newOrder.stopLoss,
        customTp: newOrder.tp2,
        reasonSummary: params.note,
        status: 'PLACED_WITH_BROKER',
        linkedOrderId: newOrder.id
      });
    }

    this.appendPropJournalRecord({
      pair: market.pair,
      direction: params.direction,
      entryPrice: newOrder.entryPrice,
      exitPrice: newOrder.tp2,
      pips: computed.tpPips,
      usdPnL: computed.netProfitUsd,
      kesPnL: computed.netProfitKes,
      outcome: 'PENDING',
      reason:
        params.note ||
        `Broker Order Placed (${broker.toUpperCase()} ${timeframe}) · SL ${newOrder.stopLoss} · TP2 ${newOrder.tp2}`
    });

    this.pushNotification({
      pair: market.pair,
      type: 'ORDER_PLACED',
      title: `${market.pair} ${params.direction} Placed With Broker`,
      message: `${broker.toUpperCase()} @ ${newOrder.entryPrice} · SL ${newOrder.stopLoss} · TP ${newOrder.tp2}. Live progress & drawdown guard active.`
    });

    return newOrder;
  }

  public updateOrderSlTp(
    pair: CurrencyPair,
    updates: {
      stopLoss?: number;
      tp1?: number;
      tp2?: number;
      tp3?: number;
      autoTrailEnabled?: boolean;
    }
  ): ActiveMarketOrder | null {
    const existing = this.activeOrders[pair];
    if (!existing) return null;
    const { decimals } = getPairSpecs(pair);
    const nextSl =
      updates.stopLoss !== undefined && !isNaN(updates.stopLoss) && updates.stopLoss > 0
        ? Number(updates.stopLoss.toFixed(decimals))
        : existing.stopLoss;
    const nextTp2 =
      updates.tp2 !== undefined && !isNaN(updates.tp2) && updates.tp2 > 0
        ? Number(updates.tp2.toFixed(decimals))
        : existing.tp2;
    const nextTp1 =
      updates.tp1 !== undefined && !isNaN(updates.tp1) && updates.tp1 > 0
        ? Number(updates.tp1.toFixed(decimals))
        : existing.tp1;
    const nextTp3 =
      updates.tp3 !== undefined && !isNaN(updates.tp3) && updates.tp3 > 0
        ? Number(updates.tp3.toFixed(decimals))
        : existing.tp3;

    const slChanged = nextSl !== existing.stopLoss;
    const tpChanged = nextTp2 !== existing.tp2;
    const updated: ActiveMarketOrder = {
      ...existing,
      stopLoss: nextSl,
      tp1: nextTp1,
      tp2: nextTp2,
      tp3: nextTp3,
      autoTrailEnabled:
        updates.autoTrailEnabled !== undefined ? updates.autoTrailEnabled : existing.autoTrailEnabled,
      slUpdatesCount: slChanged ? existing.slUpdatesCount + 1 : existing.slUpdatesCount
    };

    this.activeOrders[pair] = updated;
    this.persistOrders();

    if (slChanged || tpChanged) {
      this.pushNotification({
        pair,
        type: 'SL_UPDATED',
        title: `${pair} (${existing.direction}) SL/TP Synced`,
        message: `Updated SL ${updated.stopLoss} · TP ${updated.tp2} across broker order card.`
      });
    } else {
      this.broadcast();
    }
    return updated;
  }

  public applySmartSlTpAction(
    pair: CurrencyPair,
    action: 'LOCK_BREAKEVEN' | 'LOCK_PROFIT_55' | 'EXPAND_TP' | 'LOCK_AND_EXPAND'
  ): ActiveMarketOrder | null {
    const existing = this.activeOrders[pair];
    const market = this.markets.find((m) => m.pair === pair);
    if (!existing || !market) return null;

    const metrics = computeLiveOrderMetrics(existing, market.price, market.atrPips);
    if (action === 'LOCK_BREAKEVEN') {
      return this.updateOrderSlTp(pair, { stopLoss: metrics.suggestedBreakevenSl });
    }
    if (action === 'LOCK_PROFIT_55') {
      return this.updateOrderSlTp(pair, { stopLoss: metrics.suggestedLockProfitSl });
    }
    if (action === 'EXPAND_TP') {
      return this.updateOrderSlTp(pair, {
        tp1: metrics.suggestedExpandedTp1,
        tp2: metrics.suggestedExpandedTp2,
        tp3: metrics.suggestedExpandedTp3
      });
    }
    return this.updateOrderSlTp(pair, {
      stopLoss: metrics.suggestedLockProfitSl,
      tp1: metrics.suggestedExpandedTp1,
      tp2: metrics.suggestedExpandedTp2,
      tp3: metrics.suggestedExpandedTp3
    });
  }

  public closeMarketOrder(pair: CurrencyPair): ClosedOrderHistoryEntry | null {
    const existing = this.activeOrders[pair];
    if (!existing) return null;
    const market = this.markets.find((m) => m.pair === pair);
    const closePrice = market ? market.price : existing.entryPrice;
    const metrics = computeLiveOrderMetrics(existing, closePrice, market?.atrPips);

    const outcome: ClosedOrderHistoryEntry['outcome'] = metrics.hitSl
      ? 'STOP_LOSS'
      : metrics.isBreakevenLocked && Math.abs(metrics.floatingPips) <= 2.5
      ? 'BREAKEVEN'
      : metrics.netProfitUsd > 0
      ? 'PROFIT'
      : 'MANUAL_CLOSE';

    const entry: ClosedOrderHistoryEntry = {
      id: existing.id,
      pair: existing.pair,
      direction: existing.direction,
      lotSize: existing.lotSize,
      broker: existing.broker,
      timeframe: existing.timeframe,
      entryPrice: existing.entryPrice,
      closePrice,
      finalStopLoss: existing.stopLoss,
      finalTp: existing.tp2,
      realizedPips: metrics.floatingPips,
      realizedUsd: metrics.netProfitUsd,
      realizedKes: metrics.netProfitKes,
      slUpdatesCount: existing.slUpdatesCount,
      loadedAtEat: existing.loadedAtEat,
      closedAtEat: this.formatNowEat(),
      outcome
    };

    delete this.activeOrders[pair];
    this.orderHistory = [entry, ...this.orderHistory].slice(0, 40);
    this.persistOrders();

    // Mark matching suggested signal CLOSED
    let sigUpdated = false;
    this.suggestedSignals = this.suggestedSignals.map((sig) => {
      if (sig.linkedOrderId === existing.id) {
        sigUpdated = true;
        return { ...sig, status: 'CLOSED' };
      }
      return sig;
    });
    if (sigUpdated) {
      this.persistSuggestedSignals();
    }

    this.appendPropJournalRecord({
      pair: entry.pair,
      direction: entry.direction,
      entryPrice: entry.entryPrice,
      exitPrice: entry.closePrice,
      pips: entry.realizedPips,
      usdPnL: entry.realizedUsd,
      kesPnL: entry.realizedKes,
      outcome: entry.realizedUsd >= 0 ? 'WIN' : 'LOSS',
      reason: `Closed (${entry.outcome}) · Final SL ${entry.finalStopLoss} · ${entry.slUpdatesCount} SL adjustments`
    });

    const sign = entry.realizedUsd >= 0 ? '+' : '';
    this.pushNotification({
      pair: entry.pair,
      type: entry.realizedUsd >= 0 ? 'TP_HIT' : 'SL_WARNING',
      title: `${entry.pair} ${entry.direction} Closed (${sign}$${entry.realizedUsd.toFixed(2)})`,
      message: `${entry.entryPrice} → ${entry.closePrice} (${sign}${entry.realizedPips}p · ${sign}${entry.realizedKes} KES) saved to Trade Log.`
    });

    return entry;
  }

  public clearOrderHistory() {
    this.orderHistory = [];
    this.persistOrders();
    this.broadcast();
  }

  public setSelectedPair(pair: CurrencyPair | null, tf?: Timeframe) {
    this.selectedPair = pair;
    if (pair && tf) {
      this.customTimeframes[pair] = tf;
    }
    this.broadcast();
    if (pair && this.superAiAutoEnabled) {
      void this.fetchSuperAiNoteForPair(pair, tf, false);
    }
  }

  public requestOpenScannerView(view: ScannerWorkspaceTab, targetPair?: CurrencyPair) {
    if (targetPair) {
      this.selectedPair = targetPair;
    }
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('pivotfx_pending_scanner_view', view);
        if (targetPair) {
          window.sessionStorage.setItem('pivotfx_pending_scanner_pair', targetPair);
        }
        window.dispatchEvent(
          new CustomEvent('pivotfx:open-scanner-view', { detail: { view, pair: targetPair } })
        );
        const el = document.getElementById('scanner-tools');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch {}
    this.broadcast();
  }

  public setSuperAiAuto(enabled: boolean) {
    this.superAiAutoEnabled = enabled;
    if (enabled) {
      if (this.selectedPair) {
        void this.fetchSuperAiNoteForPair(this.selectedPair, undefined, true);
      } else {
        void this.runBatchAiScan('deep_ai');
      }
    }
    this.broadcast();
  }

  public async fetchSuperAiNoteForPair(
    targetPair?: CurrencyPair | null,
    tfOrForce?: Timeframe | boolean,
    forceOrPrompt?: boolean | string,
    customPromptArg?: string
  ): Promise<SuperAiLiveNote | null> {
    if (typeof fetch === 'undefined') return null;
    const resolvedPair = targetPair || this.selectedPair || this.markets[0]?.pair || 'GBP/USD';
    const overrideTf = typeof tfOrForce === 'string' ? tfOrForce : undefined;
    const force =
      typeof tfOrForce === 'boolean'
        ? tfOrForce
        : typeof forceOrPrompt === 'boolean'
        ? forceOrPrompt
        : false;
    const customPrompt =
      typeof forceOrPrompt === 'string' ? forceOrPrompt : customPromptArg;

    const now = Date.now();
    const lastFetched = this.lastAiFetchByPair[resolvedPair] || 0;
    if (!force && !customPrompt && now - lastFetched < 14_000 && this.superAiNotes[resolvedPair]) {
      return this.superAiNotes[resolvedPair] || null;
    }

    const m = this.markets.find((x) => x.pair === resolvedPair) || this.markets[0];
    if (!m) return null;

    this.lastAiFetchByPair[resolvedPair] = now;
    const activeTf = overrideTf || this.customTimeframes[resolvedPair] || m.recommendedTf;
    if (overrideTf) {
      this.customTimeframes[resolvedPair] = overrideTf;
    }
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    this.markets.forEach((item) => {
      pctMap[item.pair] = item.change24hPct;
    });
    const macro = getCurrentMacroContext(pctMap);
    const swings = computeCandleSwingLevels(m.candles);
    const computed = computeRealChartTradeParams({
      targetPair: m.pair,
      targetTf: activeTf,
      targetBroker: this.activeBroker,
      price: m.price,
      keyLevel: m.keyLevel,
      ema20: m.ema20,
      ema50: m.ema50,
      rsi: m.rsi,
      atrPips: m.atrPips,
      swingLow: swings.swingLow,
      swingHigh: swings.swingHigh,
      macro,
      h1TrendDirection: m.h1TrendDirection
    });
    const timing = evaluatePairKenyaTiming(m.pair);

    try {
      const res = await fetchWithFastTimeout(
        '/api/ai/super-analysis',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pair: m.pair,
            timeframe: activeTf,
            broker: this.activeBroker.toUpperCase(),
            price: computed.entryPrice,
            ema20: m.ema20,
            ema50: m.ema50,
            rsi: m.rsi,
            direction: computed.direction,
            stopLoss: computed.stopLoss,
            tp1: computed.tp1,
            tp2: computed.tp2,
            tp3: computed.tp3,
            riskReward: computed.riskReward,
            dxyPressurePct: macro.dxyPressurePct,
            riskRegime: macro.riskRegime,
            windowHeadline: timing.bannerHeadline,
            isExtendedZone: computed.isExtendedZone,
            entryTimingWarning: computed.entryTimingWarning,
            customPrompt
          })
        },
        2400
      );

      if (res.ok) {
        const data = await res.json();
        const resolvedText = data.note || data.tacticalNote || m.projection;
        const resolvedRisk =
          data.invalidationNote || data.riskNote || m.humanCheckNote || `Close beyond SL ${computed.stopLoss}`;
        const resolvedMacro = data.catalystWatch || data.macroNote || macro.dxySummary;
        const noteObj: SuperAiLiveNote = {
          pair: m.pair,
          source: data.source === 'gemini-3.8-flash' ? 'gemini-3.8-flash' : 'quantitative-engine',
          headline:
            data.headline ||
            `${m.pair} (${activeTf}) · ${computed.direction} @ ${computed.entryPrice} (R:R ${computed.riskReward})`,
          note: resolvedText,
          invalidationNote: resolvedRisk,
          catalystWatch: resolvedMacro,
          tacticalNote: resolvedText,
          riskNote: resolvedRisk,
          macroNote: resolvedMacro,
          syncedAt: this.formatNowEat()
        };
        this.superAiNotes[m.pair] = noteObj;
        this.broadcast();
        return noteObj;
      }
    } catch {
      // Non-blocking fallback
    }
    return this.superAiNotes[m.pair] || null;
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

    // Keep GBP/JPY & EUR/JPY crosses instantaneously synchronized whenever major USD legs tick
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

    if (pair === 'EUR/USD' || pair === 'USD/JPY') {
      const latestEur =
        pair === 'EUR/USD'
          ? price
          : this.pendingWsUpdates['EUR/USD']?.price ??
            this.markets.find((m) => m.pair === 'EUR/USD')?.price;
      const latestJpy =
        pair === 'USD/JPY'
          ? price
          : this.pendingWsUpdates['USD/JPY']?.price ??
            this.markets.find((m) => m.pair === 'USD/JPY')?.price;
      if (latestEur && latestJpy && latestEur > 0 && latestJpy > 0) {
        this.pendingWsUpdates['EUR/JPY'] = {
          price: Number((latestEur * latestJpy).toFixed(3))
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
      }, 250);
    }
  }

  private rebuildAndSortMarkets(
    priceUpdates?: Partial<
      Record<
        CurrencyPair,
        { price: number; pct?: number; dailyOpen?: number; candles?: OhlcCandle[]; h1Candles?: OhlcCandle[] }
      >
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

      if (isExplicitFreshScan) {
        this.trendHoldUntil[existing.pair] = 0;
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

      // Hold trend stable for 25 seconds during tick noise unless explicit scan or structural breakout occurs
      const holdUntil = this.trendHoldUntil[existing.pair] ?? 0;
      const isStrongBreakout =
        old && old.price > 0 ? Math.abs((nextPrice - old.price) / old.price) >= 0.0018 : false;
      const shouldPreserveTrend = Boolean(old) && !isExplicitFreshScan && nowMs < holdUntil && !isStrongBreakout;

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
        previousDirection: shouldPreserveTrend ? old?.dir : undefined,
        previousTrendDirection: shouldPreserveTrend ? old?.trendDir : undefined,
        spreadByBroker: existing.spreadByBroker,
        dataSource: feedOk ? 'Live Interbank Feed' : 'Live Feed + Institutional Calibration'
      });

      const newDir: 'BUY' | 'SELL' = calibrated.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
      if (!old || old.dir !== newDir || !this.trendHoldUntil[existing.pair] || isExplicitFreshScan) {
        this.trendHoldUntil[existing.pair] = nowMs + 25_000;
      }

      return {
        ...calibrated,
        previousRank: old?.rank ?? calibrated.previousRank,
        previousDirection: old?.dir ?? calibrated.previousDirection,
        directionFlipped: Boolean(old && old.dir !== newDir),
        lastTickTime: tickStr,
        lastTickDir: tickDir,
        lastTickDeltaPips: rawDiffPips !== 0 ? rawDiffPips : existing.lastTickDeltaPips
      };
    });

    // Dynamic sorting strictly from Top % down to Least % across all markets!
    this.markets = sortMarketsByTopPercent(updatedList, 'PCT_DESC');
    this.syncActiveOrdersWithMarkets();
    if (scanMode === 'auto_1s' && this.dailyMacroDirective.source !== 'gemini-3.8-flash') {
      this.dailyMacroDirective = buildInitialMacroDirective(this.markets);
    }

    if (isExplicitFreshScan && this.markets[0]) {
      const top = this.markets[0];
      const dir = top.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
      if (top.confidence >= 76) {
        this.pushNotification({
          pair: top.pair,
          type: 'AI_SIGNAL',
          title: `#1 Ranked Setup: ${top.pair} ${dir} (${top.confidence}% AI)`,
          message: `Entry @ ${top.price} · SL ${top.suggestedSL} · TP2 ${top.suggestedTP2} · ${
            top.entryTimingWarning || 'Prime Entry Zone'
          }`
        });
      }
    }

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
          const lastPrice = hasBook ? (parseFloat(d.b) + parseFloat(d.a)) / 2 : parseFloat(d.c);
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

      socket.onerror = () => {};
    } catch {}
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
                symbol: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD', 'AUD/USD']
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

            if (
              sym === 'EUR/USD' ||
              sym === 'GBP/USD' ||
              sym === 'USD/JPY' ||
              sym === 'USD/CHF' ||
              sym === 'USD/CAD' ||
              sym === 'AUD/USD'
            ) {
              this.queueWsTick(sym as CurrencyPair, last, pct);
            }
          }
        } catch {
          // Ignore malformed Kraken ticker frame
        }
      };

      kws.onerror = () => {};
    } catch {}
  }

  private async pollLiveExchangeRest(scanMode: 'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai' = 'auto_1s') {
    if (this.isFetchingRest) return;
    this.isFetchingRest = true;
    try {
      const snap = await fetchLiveMarketSnapshot(this.markets);
      const updates: Partial<
        Record<
          CurrencyPair,
          { price: number; pct: number; dailyOpen?: number; candles?: OhlcCandle[]; h1Candles?: OhlcCandle[] }
        >
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

  public async runBatchAiScan(mode: 'scan_all' | 'rescan' | 'deep_ai' = 'deep_ai') {
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    this.markets.forEach((item) => {
      pctMap[item.pair] = item.change24hPct;
    });
    const macro = getCurrentMacroContext(pctMap);
    const localDirective = buildInitialMacroDirective(this.markets);
    this.dailyMacroDirective = localDirective;

    if (typeof fetch === 'undefined') return;
    try {
      const payloadMarkets = this.markets.map((m) => {
        const timing = evaluatePairKenyaTiming(m.pair);
        return {
          pair: m.pair,
          timeframe: this.customTimeframes[m.pair] || m.recommendedTf,
          price: m.price,
          change24hPct: m.change24hPct,
          direction: m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY',
          trendDirection: m.trendDirection,
          ema20: m.ema20,
          ema50: m.ema50,
          rsi: m.rsi,
          stopLoss: m.suggestedSL,
          tp1: m.suggestedTP1,
          tp2: m.suggestedTP2,
          tp3: m.suggestedTP3,
          confidence: m.confidence,
          riskReward: m.riskReward,
          windowStatus: timing.windowBadgeShort,
          isExtendedZone: m.isExtendedZone,
          entryTimingWarning: m.entryTimingWarning
        };
      });

      const res = await fetchWithFastTimeout(
        '/api/ai/scan-markets',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode,
            dxyPressurePct: macro.dxyPressurePct,
            riskRegime: macro.riskRegime,
            eatTimeString: macro.eatTimeString,
            eatHour: macro.eatHour,
            sessionWindowName: macro.sessionWindowName,
            overallDaySafety: macro.overallDaySafety,
            markets: payloadMarkets
          })
        },
        2800
      );

      if (res.ok) {
        const data = await res.json();
        const nowEat = this.formatNowEat();
        if (data?.dailyMacroDirective) {
          this.dailyMacroDirective = {
            headline: data.dailyMacroDirective.headline || localDirective.headline,
            overallSafety: data.dailyMacroDirective.overallSafety || localDirective.overallSafety,
            hourlyOutlook: data.dailyMacroDirective.hourlyOutlook || localDirective.hourlyOutlook,
            catalystSummary: data.dailyMacroDirective.catalystSummary || localDirective.catalystSummary,
            source: data.source === 'gemini-3.8-flash' ? 'gemini-3.8-flash' : 'quantitative-engine',
            syncedAt: nowEat
          };
        }
        if (data?.perPair) {
          for (const pairKey of Object.keys(data.perPair) as CurrencyPair[]) {
            const pData = data.perPair[pairKey];
            if (pData) {
              this.superAiNotes[pairKey] = {
                pair: pairKey,
                source: data.source === 'gemini-3.8-flash' ? 'gemini-3.8-flash' : 'quantitative-engine',
                headline: pData.headline || `${pairKey} Super AI Verdict`,
                note: pData.note || '',
                invalidationNote: pData.invalidationNote || '',
                catalystWatch: pData.catalystWatch || '',
                tacticalNote: pData.note || '',
                riskNote: pData.invalidationNote || '',
                macroNote: pData.catalystWatch || '',
                syncedAt: nowEat
              };
              this.lastAiFetchByPair[pairKey] = Date.now();
            }
          }
        }
        this.broadcast();
      }
    } catch {
      // Fallback already set
    }
  }

  public async rescanSinglePair(targetPair: CurrencyPair, tf?: Timeframe) {
    const activeTf =
      tf ||
      this.customTimeframes[targetPair] ||
      this.markets.find((m) => m.pair === targetPair)?.recommendedTf ||
      'M15';
    this.customTimeframes[targetPair] = activeTf;
    this.lockedPairs[targetPair] = false;

    const snap = await fetchPairLiveCandleSnapshot(targetPair, activeTf);
    const updates: Partial<
      Record<CurrencyPair, { price: number; candles?: OhlcCandle[]; h1Candles?: OhlcCandle[] }>
    > = {
      [targetPair]: {
        price: snap.price,
        candles: snap.candles
      }
    };
    this.rebuildAndSortMarkets(updates, 'rescan', true);
    if (this.superAiAutoEnabled) {
      await this.fetchSuperAiNoteForPair(targetPair, activeTf, true);
    }
    return this.getState();
  }

  public async triggerScan(mode: 'scan_all' | 'rescan' | 'deep_ai') {
    if (mode === 'scan_all' || mode === 'rescan') {
      this.lockedPairs = {};
    }
    await refreshBackgroundRealOhlcCandles(true);
    await this.pollLiveExchangeRest(mode);
    await this.runBatchAiScan(mode);
    if (this.selectedPair && this.superAiAutoEnabled) {
      void this.fetchSuperAiNoteForPair(this.selectedPair, true);
    }
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
        h1Candles: m.h1Candles,
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

    const prevRanks = new Map(this.markets.map((m, i) => [m.pair, m.currentRank || i + 1]));
    this.markets = sortMarketsByTopPercent(this.markets, 'PCT_DESC').map((m) => ({
      ...m,
      previousRank: prevRanks.get(m.pair)
    }));
    this.syncActiveOrdersWithMarkets();
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
      void refreshBackgroundRealOhlcCandles(true);
      void this.pollLiveExchangeRest('scan_all').then(() => this.runBatchAiScan('deep_ai'));
      this.intervalId = setInterval(() => {
        this.tickCount += 1;
        this.syncedAt = this.formatNowEat();
        this.pollLiveExchangeRest('auto_1s');
      }, 2000);
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


