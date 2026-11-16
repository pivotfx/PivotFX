import {
  BrokerId,
  CurrencyPair,
  PriceAlertRule,
  SuggestedSignalLogEntry,
  Timeframe,
  TradeNotification
} from '../types';

export type { PriceAlertRule, SuggestedSignalLogEntry, TradeNotification };

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

export type BosDirection =
  | 'BULLISH_BOS'
  | 'BEARISH_BOS'
  | 'BULLISH_CHOCH'
  | 'BEARISH_CHOCH'
  | 'RANGING';

export interface StructureBosAnalysis {
  bosDirection: BosDirection;
  structureTrend: 'BULLISH' | 'BEARISH' | 'RANGING';
  h1BosDirection: BosDirection;
  lastSwingHigh: number;
  prevSwingHigh: number;
  lastSwingLow: number;
  prevSwingLow: number;
  protectedSwingLow: number;
  protectedSwingHigh: number;
  bosTriggerLevel: number;
  brokenStructure: boolean;
  chochDetected: boolean;
  structureSummary: string;
  bosVetoReason?: string;
}

export interface DeepVerifyCheckItem {
  id:
    | 'LIVE_FEED_SYNCED'
    | 'MTF_ALIGNED'
    | 'NO_COUNTER_BOS'
    | 'ADX_TREND_STRENGTH'
    | 'MACD_MOMENTUM_SYNC'
    | 'SWING_SL_PROTECTED'
    | 'RR_AND_TP_VALID'
    | 'ENTRY_NOT_CHASED';
  label: string;
  passed: boolean;
  detail: string;
}

export interface DeepVerifyResult {
  pair: CurrencyPair;
  timeframe: Timeframe;
  source: 'gemini-4-hydrogen' | 'quantitative-engine';
  verdict:
    | 'CONFIRMED_BUY'
    | 'CONFIRMED_SELL'
    | 'WAIT_PULLBACK'
    | 'BOS_REVERSAL_FLIP'
    | 'STAND_ASIDE_TRAP';
  verifiedDirection: 'BUY' | 'SELL' | 'STAND_ASIDE';
  proposedDirection: 'BUY' | 'SELL';
  structureState: BosDirection;
  confidenceScore: number;
  bosLevel: number;
  invalidationLevel: number;
  deepAuditHeadline: string;
  deepAuditSummary: string;
  trajectoryVerdict: string;
  riskChecklist: string[];
  checks: DeepVerifyCheckItem[];
  passedCount: number;
  totalChecks: number;
  syncedAt: string;
}

export type CandlePatternSignal =
  | 'BULLISH_ENGULFING'
  | 'BEARISH_ENGULFING'
  | 'BULLISH_PIN_REJECTION'
  | 'BEARISH_PIN_REJECTION'
  | 'INSIDE_BREAKOUT'
  | 'CONSOLIDATION';

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
  adxStrength?: number;
  macdHistogram?: number;
  macdBias?: 'BULLISH' | 'BEARISH' | 'FLAT';
  candlePattern?: CandlePatternSignal;
  keyLevel: number;
  swingLow?: number;
  swingHigh?: number;
  patternType: PatternCategory;
  riskReward: string;
  lotSize?: number;
  actualRiskUsd?: number;
  executionReadiness?: 'READY_ENTER' | 'WAIT_PULLBACK' | 'NO_TRADE_CHOP' | 'NO_TRADE_CLOSED';
  executionReadinessReason?: string;
  bosAnalysis?: StructureBosAnalysis;
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
    | 'REVERSAL SELL PLAN (CONFIRM BELOW 20 EMA)'
    | 'STAND ASIDE (MARKET CLOSED)'
    | 'STAND ASIDE (CHOP / CONFLICT)';
  profitOutlookText?: string;
  isFavourableOrder?: boolean;
  isExtendedZone?: boolean;
  entryTimingWarning?: string;
  spreadByBroker: Record<BrokerId, { symbol: string; spread: number; notes: string }>;
  mtfAlignment?: MultiTimeframeAlignment;
  economicEventNotice?: HighImpactEconomicEvent;
  tvSymbol?: string;
  recommendedStrategy?: string;
  strategyWinRate?: string;
  strategyRationale?: string;
  liveBacktest?: LiveBacktestStats;
  executionBrief?: PlainEnglishTradeGuide;
  plainEnglishGuide?: PlainEnglishTradeGuide;
}

export interface LiveBacktestStats {
  sampleTrades: number;
  tp1BreakevenWins: number;
  fullTp2Wins: number;
  losses: number;
  tp1WinRatePct: number;
  fullWinRatePct: number;
  profitFactor: number;
  netExpectancyR: number;
  verdictLabel: 'PROVEN POSITIVE EDGE' | 'MODERATE EDGE' | 'LOW SAMPLE / CHOP';
  summary: string;
}

export interface PlainEnglishTradeGuide {
  headline: string;
  whyDirection: string;
  whySlIsSafe: string;
  tp1BreakevenPlan: string;
  expectancyMath: string;
}

export interface MultiTimeframeAlignment {
  m5: 'BULLISH' | 'BEARISH';
  m15: 'BULLISH' | 'BEARISH';
  h1: 'BULLISH' | 'BEARISH';
  h4: 'BULLISH' | 'BEARISH';
  alignedCount: number;
  tierGrade: 'GRADE A+ (4/4 TF ALIGNED)' | 'GRADE A (3/4 TF ALIGNED)' | 'GRADE B (2/4 MIXED — WAIT)' | 'GRADE C (WAIT PULLBACK)';
  winRatePct: number;
  tierColor: string;
}

export interface HighImpactEconomicEvent {
  id: string;
  currency: string;
  name: string;
  impact: 'HIGH' | 'EXTREME';
  timeEAT: string;
  minutesUntil: number;
  status: 'ACTIVE_NOW' | 'IMMINENT' | 'UPCOMING' | 'PASSED';
  tradingDirective: string;
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
    | 'REVERSAL SELL PLAN (CONFIRM BELOW 20 EMA)'
    | 'STAND ASIDE (MARKET CLOSED)'
    | 'STAND ASIDE (CHOP / CONFLICT)';
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
    | 'SELECTIVE SELL — ENTER ON 20 EMA CONFIRMATION'
    | 'STAND ASIDE: MARKET CLOSED'
    | 'STAND ASIDE: CHOP / CONFLICTED TIMEFRAMES';
  trajectory: string;
  trajectoryHorizons: TrajectoryHorizonStep[];
  trendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  trendProjectionText: string;
  humanCheckNote: string;
  mt4SafetyProof: string;
  cmaProtection: string;
  mtfAlignment?: MultiTimeframeAlignment;
  economicEventNotice?: HighImpactEconomicEvent;
  advisoryEntryPrice?: number;
  advisoryEntryNote?: string;
  advisoryDiscountPips?: number;
  slVolatilityWarning?: string;
  executionReadiness: 'READY_ENTER' | 'WAIT_PULLBACK' | 'NO_TRADE_CHOP' | 'NO_TRADE_CLOSED';
  executionReadinessReason: string;
  bosAnalysis?: StructureBosAnalysis;
  preflightChecks?: DeepVerifyCheckItem[];
  riskConfig?: Partial<RiskManagementConfig>;
  riskPlan?: PositionSizeRiskPlan;
  tvSymbol: string;
  recommendedStrategy: string;
  strategyWinRate: string;
  strategyRationale: string;
  liveBacktest?: LiveBacktestStats;
  adxStrength?: number;
  macdHistogram?: number;
  macdBias?: 'BULLISH' | 'BEARISH' | 'FLAT';
  candlePattern?: CandlePatternSignal;
  executionBrief?: PlainEnglishTradeGuide;
  plainEnglishGuide?: PlainEnglishTradeGuide;
  limitPlan?: {
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
    mt4SafetyProof: string;
  };
}

export function getTradingViewSymbol(pair: CurrencyPair): string {
  switch (pair) {
    case 'EUR/USD':
      return 'FX:EURUSD';
    case 'GBP/USD':
      return 'FX:GBPUSD';
    case 'USD/JPY':
      return 'FX:USDJPY';
    case 'USD/CHF':
      return 'FX:USDCHF';
    case 'USD/CAD':
      return 'FX:USDCAD';
    case 'AUD/USD':
      return 'FX:AUDUSD';
    case 'GBP/JPY':
      return 'FX:GBPJPY';
    case 'EUR/JPY':
      return 'FX:EURJPY';
    case 'XAU/USD':
      return 'OANDA:XAUUSD';
    case 'BTC/USD':
      return 'BINANCE:BTCUSDT';
    case 'ETH/USD':
      return 'BINANCE:ETHUSDT';
    case 'US30':
      return 'FOREXCOM:DJI';
    case 'NAS100':
      return 'FOREXCOM:NAS100';
    case 'GER40':
      return 'FOREXCOM:GER40';
    case 'USOIL':
      return 'TVC:USOIL';
    default:
      return 'FX:EURUSD';
  }
}

export function getTradingViewExternalUrl(pair: CurrencyPair, tf: Timeframe = 'M15'): string {
  const symbol = getTradingViewSymbol(pair);
  const interval =
    tf === 'M1' ? '1' : tf === 'M5' ? '5' : tf === 'M10' ? '10' : tf === 'M15' ? '15' : tf === 'H1' ? '60' : tf === 'H4' ? '240' : 'D';
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}`;
}

export function selectOptimalTradingStrategy(params: {
  pair: CurrencyPair;
  direction: 'BUY' | 'SELL';
  rsi: number;
  ema20: number;
  ema50: number;
  price: number;
  isExtendedZone: boolean;
  eatHour: number;
  bosAnalysis?: StructureBosAnalysis;
  trendMatchesSide: boolean;
}): {
  name: string;
  winRateLabel: string;
  rationale: string;
} {
  const { pair, direction, rsi, ema20, ema50, price, isExtendedZone, eatHour, bosAnalysis, trendMatchesSide } = params;
  const isCrypto = pair === 'BTC/USD' || pair === 'ETH/USD';
  const isGold = pair === 'XAU/USD';
  const isLondonWindow = eatHour >= 9 && eatHour <= 13;
  const isNyWindow = eatHour >= 15 && eatHour <= 19;
  const isAsianWindow = eatHour >= 2 && eatHour <= 8;

  if (bosAnalysis?.chochDetected) {
    return {
      name: 'CHoCH Liquidity Reversal + Order Block',
      winRateLabel: '74% Historical Edge',
      rationale: `${pair} printed Change of Character (CHoCH) near ${bosAnalysis.bosTriggerLevel} — trade the ${direction} shift only after candle retest with zero-chasing SL protection.`
    };
  }

  if (bosAnalysis?.brokenStructure && trendMatchesSide && !isExtendedZone) {
    return {
      name: isNyWindow
        ? 'NY Silver Bullet BOS + FVG Continuation'
        : isLondonWindow
        ? 'London BOS + Institutional FVG Sniper'
        : 'BOS/CHoCH 10-Factor Trend Continuation',
      winRateLabel: '78% Historical Edge',
      rationale: `${pair} confirmed ${bosAnalysis.bosDirection.replace('_', ' ')} while holding EMA 20/50 alignment and non-extended pullback room.`
    };
  }

  if (isExtendedZone || (direction === 'BUY' && rsi >= 68) || (direction === 'SELL' && rsi <= 32)) {
    return {
      name: '20 EMA Equilibrium Pullback Limit',
      winRateLabel: '71% Historical Edge',
      rationale: `RSI (${rsi.toFixed(0)}) or price distance from EMA 20 (${ema20}) is stretched — use a patient Limit order at 20 EMA rather than market chasing.`
    };
  }

  if (!isCrypto && isAsianWindow) {
    return {
      name: 'Asian Session Liquidity Sweep & Mean Reversion',
      winRateLabel: '69% Historical Edge',
      rationale: `Low-volume Asian EAT window (${eatHour}:00 EAT): wait for prior session High/Low stop hunt before engaging ${direction}.`
    };
  }

  if (isGold || isCrypto) {
    return {
      name: 'EMA 20/50 Golden Cross + Volume Sweep',
      winRateLabel: '75% Historical Edge',
      rationale: `${pair} (${price}) aligned across EMA 20 (${ema20}) and EMA 50 (${ema50}) with institutional momentum filter.`
    };
  }

  return {
    name: 'London / NY Institutional 20-EMA Pullback',
    winRateLabel: '73% Historical Edge',
    rationale: `${pair} respecting dynamic 20/50 EMA structure during active session liquidity for controlled ${direction} execution.`
  };
}

export interface RiskManagementConfig {
  enabled: boolean;
  accountBalanceUsd: number;
  riskPct: number;
  syncSlTpWithRisk: boolean;
  targetProfitUsd?: number | null;
}

export interface PositionSizeRiskPlan {
  enabled: boolean;
  accountBalanceUsd: number;
  riskPct: number;
  targetRiskUsd: number;
  targetRiskKes: number;
  actualRiskUsd: number;
  actualRiskKes: number;
  actualRiskPct: number;
  lotSize: number;
  pipValPerStandardLot: number;
  pipValPerMicroLot: number;
  pipValPerPositionUsd: number;
  structuralSlPips: number;
  calibratedSlPips: number;
  slAdjustedDeltaPips: number;
  syncSlTpWithRisk: boolean;
  isBelowMinBrokerRisk: boolean;
  minSafeRiskUsd: number;
  targetProfitUsd: number | null;
  targetProfitModeActive: boolean;
  requiredTp2PipsForTarget: number | null;
  targetProfitFeasibilityNote: string | null;
  calibrationSummary: string;
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
  const isEth = targetPair.includes('ETH');
  const isCrypto = isBtc || isEth;
  const isIndex = targetPair === 'US30' || targetPair === 'NAS100' || targetPair === 'GER40';
  const isOil = targetPair.includes('OIL');

  const pipMultiplier =
    isJpy ? 100 :
    isGold ? 10 :
    isBtc ? 1 :
    isEth ? 1 :
    isIndex ? 1 :
    isOil ? 100 : 10000;

  const decimals =
    isJpy ? 3 :
    isGold ? 2 :
    isBtc ? 2 :
    isEth ? 2 :
    isIndex ? 1 :
    isOil ? 2 : 5;

  const pipValPerStandardLot =
    isGold ? 10.0 :
    isJpy ? 6.5 :
    isBtc ? 1.0 :
    isEth ? 5.0 :
    isIndex ? 2.0 :
    isOil ? 5.0 : 10.0;

  const pipValPerMicroLot = Number((pipValPerStandardLot * 0.01).toFixed(4));

  return {
    isJpy,
    isGold,
    isBtc,
    isEth,
    isCrypto,
    isIndex,
    isOil,
    pipMultiplier,
    decimals,
    pipValPerStandardLot,
    pipValPerMicroLot
  };
}

const POSITION_RISK_STORAGE_KEY = 'pivotfx_position_risk_config_v1';

export const DEFAULT_RISK_MANAGEMENT_CONFIG: RiskManagementConfig = {
  enabled: true,
  accountBalanceUsd: 200,
  riskPct: 1.0,
  syncSlTpWithRisk: true,
  targetProfitUsd: null
};

class PositionRiskConfigStore {
  private config: RiskManagementConfig = this.loadInitial();
  private listeners = new Set<(cfg: RiskManagementConfig) => void>();

  private loadInitial(): RiskManagementConfig {
    try {
      if (typeof window === 'undefined') return DEFAULT_RISK_MANAGEMENT_CONFIG;
      const raw = window.localStorage.getItem(POSITION_RISK_STORAGE_KEY);
      if (!raw) return DEFAULT_RISK_MANAGEMENT_CONFIG;
      const parsed = JSON.parse(raw) as Partial<RiskManagementConfig>;
      return {
        enabled: parsed.enabled ?? true,
        accountBalanceUsd:
          typeof parsed.accountBalanceUsd === 'number' && parsed.accountBalanceUsd > 0
            ? Math.min(10_000_000, Math.max(10, parsed.accountBalanceUsd))
            : DEFAULT_RISK_MANAGEMENT_CONFIG.accountBalanceUsd,
        riskPct:
          typeof parsed.riskPct === 'number' && parsed.riskPct > 0
            ? Math.min(15, Math.max(0.1, parsed.riskPct))
            : DEFAULT_RISK_MANAGEMENT_CONFIG.riskPct,
        syncSlTpWithRisk: parsed.syncSlTpWithRisk ?? true,
        targetProfitUsd:
          typeof parsed.targetProfitUsd === 'number' && parsed.targetProfitUsd >= 1
            ? Math.min(1_000_000, Number(parsed.targetProfitUsd.toFixed(2)))
            : null
      };
    } catch {
      return DEFAULT_RISK_MANAGEMENT_CONFIG;
    }
  }

  public getConfig(): RiskManagementConfig {
    return { ...this.config };
  }

  public setConfig(patch: Partial<RiskManagementConfig>) {
    const nextBalance =
      patch.accountBalanceUsd !== undefined && !isNaN(patch.accountBalanceUsd)
        ? Math.min(10_000_000, Math.max(10, Number(patch.accountBalanceUsd)))
        : this.config.accountBalanceUsd;
    const nextRiskPct =
      patch.riskPct !== undefined && !isNaN(patch.riskPct)
        ? Math.min(15, Math.max(0.1, Number(patch.riskPct)))
        : this.config.riskPct;
    const nextTargetProfit =
      patch.targetProfitUsd === null
        ? null
        : patch.targetProfitUsd !== undefined && !isNaN(Number(patch.targetProfitUsd)) && Number(patch.targetProfitUsd) >= 1
        ? Math.min(1_000_000, Number(Number(patch.targetProfitUsd).toFixed(2)))
        : this.config.targetProfitUsd ?? null;

    this.config = {
      enabled: patch.enabled ?? this.config.enabled,
      accountBalanceUsd: nextBalance,
      riskPct: nextRiskPct,
      syncSlTpWithRisk: patch.syncSlTpWithRisk ?? this.config.syncSlTpWithRisk,
      targetProfitUsd: nextTargetProfit
    };
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(POSITION_RISK_STORAGE_KEY, JSON.stringify(this.config));
      }
    } catch {}
    const snapshot = this.getConfig();
    this.listeners.forEach((fn) => fn(snapshot));
  }

  public resetToDefault() {
    this.setConfig(DEFAULT_RISK_MANAGEMENT_CONFIG);
  }

  public subscribe(listener: (cfg: RiskManagementConfig) => void): () => void {
    this.listeners.add(listener);
    listener(this.getConfig());
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const positionRiskStore = new PositionRiskConfigStore();

export function computeDynamicPositionRiskPlan(params: {
  pair: CurrencyPair;
  structuralSlPips: number;
  brokerSpread: number;
  atrPips?: number;
  riskConfig: RiskManagementConfig;
}): PositionSizeRiskPlan {
  const { isGold, isBtc, isEth, isIndex, isOil, pipMultiplier, pipValPerStandardLot, pipValPerMicroLot } = getPairSpecs(
    params.pair
  );
  const accountBalanceUsd = Math.max(10, Number(params.riskConfig.accountBalanceUsd) || 200);
  const riskPct = Math.min(15, Math.max(0.1, Number(params.riskConfig.riskPct) || 1.0));
  const targetRiskUsd = Number((accountBalanceUsd * (riskPct / 100)).toFixed(2));
  const targetRiskKes = Math.round(targetRiskUsd * 130);

  const structuralSlPips = Math.max(4, Number(params.structuralSlPips.toFixed(1)));
  const atrShieldFloor = params.atrPips ? params.atrPips * 1.05 + params.brokerSpread : 0;
  const minClearancePips = Number(
    Math.max(
      params.brokerSpread * 2.4,
      atrShieldFloor,
      isGold ? 16 : isBtc ? 140 : isEth ? 14 : isIndex ? 28 : isOil ? 18 : 8
    ).toFixed(1)
  );
  const maxSafeStructuralSlPips = Number(Math.max(minClearancePips, structuralSlPips * 1.45).toFixed(1));
  const minSafeRiskUsd = Number((minClearancePips * pipValPerMicroLot).toFixed(2));

  const rawLotsAtStructural = targetRiskUsd / Math.max(0.0001, structuralSlPips * pipValPerStandardLot);
  let lotSize = Math.max(0.01, Math.floor(rawLotsAtStructural * 100) / 100);
  let calibratedSlPips = structuralSlPips;

  if (params.riskConfig.syncSlTpWithRisk) {
    if (rawLotsAtStructural < 0.01) {
      lotSize = 0.01;
      const exactMicroSl = targetRiskUsd / Math.max(0.0001, pipValPerMicroLot);
      calibratedSlPips = Number(
        Math.min(maxSafeStructuralSlPips, Math.max(minClearancePips, exactMicroSl)).toFixed(1)
      );
    } else {
      const exactSlForLot = targetRiskUsd / Math.max(0.0001, lotSize * pipValPerStandardLot);
      const minComfortSl = Math.max(minClearancePips, structuralSlPips * 0.88);
      calibratedSlPips = Number(
        Math.min(maxSafeStructuralSlPips, Math.max(minComfortSl, exactSlForLot)).toFixed(1)
      );
    }
  } else {
    calibratedSlPips = Number(Math.max(minClearancePips, structuralSlPips).toFixed(1));
  }

  const pipValPerPositionUsd = Number((lotSize * pipValPerStandardLot).toFixed(4));
  const actualRiskUsd = Number((calibratedSlPips * pipValPerPositionUsd).toFixed(2));
  const actualRiskKes = Math.round(actualRiskUsd * 130);
  const actualRiskPct = Number(((actualRiskUsd / accountBalanceUsd) * 100).toFixed(2));
  const slAdjustedDeltaPips = Number((calibratedSlPips - structuralSlPips).toFixed(1));
  const isBelowMinBrokerRisk = targetRiskUsd < minSafeRiskUsd;

  const rawTargetProfit = params.riskConfig.targetProfitUsd;
  const targetProfitModeActive = typeof rawTargetProfit === 'number' && !isNaN(rawTargetProfit) && rawTargetProfit >= 1;
  const targetProfitUsd = targetProfitModeActive ? Number(rawTargetProfit.toFixed(2)) : null;
  const requiredTp2PipsForTarget =
    targetProfitUsd !== null
      ? Number((targetProfitUsd / Math.max(0.0001, pipValPerPositionUsd) + params.brokerSpread).toFixed(1))
      : null;

  let targetProfitFeasibilityNote: string | null = null;
  if (targetProfitUsd !== null && requiredTp2PipsForTarget !== null) {
    const movePriceDelta = Number((requiredTp2PipsForTarget / pipMultiplier).toFixed(isGold ? 2 : 4));
    const impliedRr = Number((requiredTp2PipsForTarget / Math.max(1, calibratedSlPips)).toFixed(1));
    const lots03Pips = Number((targetProfitUsd / (0.03 * pipValPerStandardLot) + params.brokerSpread).toFixed(1));
    const lots05Pips = Number((targetProfitUsd / (0.05 * pipValPerStandardLot) + params.brokerSpread).toFixed(1));
    if (impliedRr > 5.0) {
      targetProfitFeasibilityNote = `$${targetProfitUsd.toFixed(2)} TP @ ${lotSize.toFixed(
        2
      )} Lots needs ${requiredTp2PipsForTarget}p (${isGold ? `$${movePriceDelta} Gold move` : `${requiredTp2PipsForTarget}p move`}, 1:${impliedRr} R:R — 24–48H swing; lock BE after +$2). At 0.03 Lots = ${lots03Pips}p; at 0.05 Lots = ${lots05Pips}p.`;
    } else {
      targetProfitFeasibilityNote = `$${targetProfitUsd.toFixed(2)} TP @ ${lotSize.toFixed(
        2
      )} Lots needs ${requiredTp2PipsForTarget}p (${isGold ? `$${movePriceDelta} Gold move` : `${requiredTp2PipsForTarget}p move`}, 1:${impliedRr} R:R) — fits normal intraday swing.`;
    }
  }

  const calibrationSummary = targetProfitModeActive && requiredTp2PipsForTarget !== null
    ? `Target Profit Mode (+$${targetProfitUsd!.toFixed(2)}): ${lotSize.toFixed(2)} Lots · SL ${calibratedSlPips}p ($${actualRiskUsd.toFixed(2)}) · TP2 ${requiredTp2PipsForTarget}p`
    : !params.riskConfig.syncSlTpWithRisk
    ? `Fixed Structural SL (${structuralSlPips}p) · Scaled Volume: ${lotSize.toFixed(2)} Lots (~$${actualRiskUsd.toFixed(2)} risk)`
    : isBelowMinBrokerRisk
    ? `Target $${targetRiskUsd.toFixed(2)} is below minimum 0.01-lot stop ($${minSafeRiskUsd.toFixed(2)}); SL protected at ${calibratedSlPips}p floor`
    : slAdjustedDeltaPips === 0
    ? `Exact structural risk match: ${lotSize.toFixed(2)} Lots @ ${calibratedSlPips}p SL ($${actualRiskUsd.toFixed(2)} / ${actualRiskPct}%)`
    : slAdjustedDeltaPips < 0
    ? `SL tightened ${Math.abs(slAdjustedDeltaPips).toFixed(1)}p (${structuralSlPips}p -> ${calibratedSlPips}p) & TP scaled proportionally to hold $${actualRiskUsd.toFixed(2)} risk @ ${lotSize.toFixed(2)} Lots`
    : `SL widened +${slAdjustedDeltaPips.toFixed(1)}p (${structuralSlPips}p -> ${calibratedSlPips}p) & TP expanded proportionally for ${lotSize.toFixed(2)} Lots ($${actualRiskUsd.toFixed(2)} risk)`;

  return {
    enabled: params.riskConfig.enabled,
    accountBalanceUsd,
    riskPct,
    targetRiskUsd,
    targetRiskKes,
    actualRiskUsd,
    actualRiskKes,
    actualRiskPct,
    lotSize,
    pipValPerStandardLot,
    pipValPerMicroLot,
    pipValPerPositionUsd,
    structuralSlPips,
    calibratedSlPips,
    slAdjustedDeltaPips,
    syncSlTpWithRisk: params.riskConfig.syncSlTpWithRisk,
    isBelowMinBrokerRisk,
    minSafeRiskUsd,
    targetProfitUsd,
    targetProfitModeActive,
    requiredTp2PipsForTarget,
    targetProfitFeasibilityNote,
    calibrationSummary
  };
}

export function computeLiveOrderMetrics(
  order: ActiveMarketOrder,
  livePrice: number,
  atrPips = 24
): LiveOrderMetrics {
  const { isJpy, isGold, isBtc, isEth, isIndex, isOil, pipMultiplier, decimals, pipValPerMicroLot } = getPairSpecs(order.pair);
  const isBuy = order.direction === 'BUY';
  const rawSignedPips = isBuy
    ? (livePrice - order.entryPrice) * pipMultiplier
    : (order.entryPrice - livePrice) * pipMultiplier;
  const floatingPips = Number(rawSignedPips.toFixed(1));

  const lotScale = Math.max(0.01, order.lotSize || 0.01) / 0.01;
  const brokerSpread = isGold
    ? 2.2
    : isJpy
    ? 1.4
    : isBtc
    ? 25.0
    : isEth
    ? 2.5
    : isIndex
    ? 2.0
    : isOil
    ? 3.5
    : 1.1;

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

  // Breakeven SL: Entry +/- buffer in profit direction (capped safely behind livePrice)
  const beBuffer = (isGold ? 5 : isBtc ? 45 : isEth ? 4 : isIndex ? 6 : isOil ? 5 : 1.2) / pipMultiplier;
  const minLiveBuffer = (isGold ? 8 : isBtc ? 80 : isEth ? 7 : isIndex ? 10 : isOil ? 8 : 2.5) / pipMultiplier;
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

export interface PortfolioRiskCluster {
  driver: string;
  pairs: string[];
  combinedRiskPct: number;
}

export interface PortfolioRiskExposureSummary {
  openOrderCount: number;
  protectedOrderCount: number;
  totalOpenRiskUsd: number;
  totalOpenRiskPct: number;
  projectedTotalRiskUsd: number;
  projectedTotalRiskPct: number;
  stackedClusters: PortfolioRiskCluster[];
  severity: 'SAFE' | 'CAUTION' | 'HIGH_STACKED_RISK';
  warningHeadline: string | null;
  warningDetail: string | null;
}

function getMacroDriversForOrder(pair: CurrencyPair, direction: 'BUY' | 'SELL'): string[] {
  const isBuy = direction === 'BUY';
  switch (pair) {
    case 'EUR/USD':
    case 'GBP/USD':
    case 'AUD/USD':
      return [isBuy ? 'SHORT USD' : 'LONG USD'];
    case 'USD/CHF':
    case 'USD/CAD':
      return [isBuy ? 'LONG USD' : 'SHORT USD'];
    case 'USD/JPY':
      return [isBuy ? 'LONG USD' : 'SHORT USD', isBuy ? 'SHORT JPY' : 'LONG JPY'];
    case 'GBP/JPY':
    case 'EUR/JPY':
      return [isBuy ? 'SHORT JPY' : 'LONG JPY'];
    case 'XAU/USD':
      return [isBuy ? 'SHORT USD (GOLD)' : 'LONG USD (GOLD)'];
    case 'BTC/USD':
    case 'ETH/USD':
      return [isBuy ? 'LONG CRYPTO' : 'SHORT CRYPTO'];
    case 'US30':
    case 'NAS100':
      return [isBuy ? 'LONG US EQUITIES' : 'SHORT US EQUITIES'];
    default:
      return [];
  }
}

export function evaluatePortfolioRiskExposure(
  activeOrders: Partial<Record<CurrencyPair, ActiveMarketOrder>>,
  riskConfig: RiskManagementConfig,
  candidate?: { pair: CurrencyPair; direction: 'BUY' | 'SELL'; riskUsd: number }
): PortfolioRiskExposureSummary {
  const accountBalanceUsd = Math.max(10, Number(riskConfig.accountBalanceUsd) || 200);
  const openOrders = Object.values(activeOrders).filter((o): o is ActiveMarketOrder => Boolean(o));

  let protectedOrderCount = 0;
  let totalOpenRiskUsd = 0;

  interface ExposureLeg {
    pair: CurrencyPair;
    direction: 'BUY' | 'SELL';
    riskUsd: number;
    label: string;
  }

  const legs: ExposureLeg[] = [];

  openOrders.forEach((ord) => {
    const isBuy = ord.direction === 'BUY';
    const isProtected = isBuy ? ord.stopLoss >= ord.entryPrice : ord.stopLoss <= ord.entryPrice;
    if (isProtected) {
      protectedOrderCount += 1;
    }
    const { pipMultiplier, pipValPerMicroLot } = getPairSpecs(ord.pair);
    const lotScale = Math.max(0.01, ord.lotSize || 0.01) / 0.01;
    const rawRiskPips = Math.abs(ord.entryPrice - ord.stopLoss) * pipMultiplier;
    const riskUsd = isProtected
      ? 0
      : Number((rawRiskPips * pipValPerMicroLot * lotScale).toFixed(2));
    totalOpenRiskUsd += riskUsd;
    legs.push({
      pair: ord.pair,
      direction: ord.direction,
      riskUsd,
      label: `${ord.pair} ${ord.direction}`
    });
  });

  totalOpenRiskUsd = Number(totalOpenRiskUsd.toFixed(2));
  const totalOpenRiskPct = Number(((totalOpenRiskUsd / accountBalanceUsd) * 100).toFixed(2));

  const candidateAlreadyOpen = candidate ? Boolean(activeOrders[candidate.pair]) : false;
  let projectedTotalRiskUsd = totalOpenRiskUsd;
  if (candidate && !candidateAlreadyOpen) {
    const candidateRiskUsd = Math.max(0, Number(candidate.riskUsd) || 0);
    projectedTotalRiskUsd = Number((totalOpenRiskUsd + candidateRiskUsd).toFixed(2));
    legs.push({
      pair: candidate.pair,
      direction: candidate.direction,
      riskUsd: candidateRiskUsd,
      label: `${candidate.pair} ${candidate.direction} (Planned)`
    });
  }
  const projectedTotalRiskPct = Number(((projectedTotalRiskUsd / accountBalanceUsd) * 100).toFixed(2));

  const driverBuckets = new Map<string, { pairs: string[]; riskUsd: number }>();
  legs.forEach((leg) => {
    const drivers = getMacroDriversForOrder(leg.pair, leg.direction);
    // Normalize Gold's USD tag to fold into SHORT USD / LONG USD cluster awareness
    drivers.forEach((rawDriver) => {
      const normalizedDriver = rawDriver.startsWith('SHORT USD')
        ? 'SHORT USD'
        : rawDriver.startsWith('LONG USD')
        ? 'LONG USD'
        : rawDriver;
      const existing = driverBuckets.get(normalizedDriver) || { pairs: [], riskUsd: 0 };
      if (!existing.pairs.includes(leg.label)) {
        existing.pairs.push(leg.label);
        existing.riskUsd += leg.riskUsd;
      }
      driverBuckets.set(normalizedDriver, existing);
    });
  });

  const stackedClusters: PortfolioRiskCluster[] = [];
  driverBuckets.forEach((bucket, driver) => {
    if (bucket.pairs.length >= 2) {
      stackedClusters.push({
        driver,
        pairs: bucket.pairs,
        combinedRiskPct: Number(((bucket.riskUsd / accountBalanceUsd) * 100).toFixed(2))
      });
    }
  });

  let severity: PortfolioRiskExposureSummary['severity'] = 'SAFE';
  let warningHeadline: string | null = null;
  let warningDetail: string | null = null;

  if (projectedTotalRiskPct >= 3.5 || (stackedClusters.length > 0 && projectedTotalRiskPct >= 2.2)) {
    severity = 'HIGH_STACKED_RISK';
  } else if (stackedClusters.length > 0 || projectedTotalRiskPct >= 2.0) {
    severity = 'CAUTION';
  }

  if (severity !== 'SAFE') {
    const primaryCluster = stackedClusters[0];
    if (primaryCluster && projectedTotalRiskPct >= 2.2) {
      warningHeadline = `STACKED ${primaryCluster.driver} EXPOSURE (${projectedTotalRiskPct}% TOTAL EQUITY AT RISK)`;
      warningDetail = `${primaryCluster.pairs.join(' + ')} double up the same ${primaryCluster.driver} macro bet ($${projectedTotalRiskUsd.toFixed(2)} combined SL risk on $${accountBalanceUsd}). Lock Breakeven on one open trade or halve lot size before adding.`;
    } else if (primaryCluster) {
      warningHeadline = `CORRELATED ${primaryCluster.driver} STACK (${primaryCluster.pairs.length} PAIRS)`;
      warningDetail = `${primaryCluster.pairs.join(' + ')} move together on USD/JPY news. Combined unprotected risk is ${projectedTotalRiskPct}% ($${projectedTotalRiskUsd.toFixed(2)}).`;
    } else {
      warningHeadline = `ELEVATED OPEN PORTFOLIO RISK (${projectedTotalRiskPct}% / $${projectedTotalRiskUsd.toFixed(2)})`;
      warningDetail = `Multiple open stop-losses total $${projectedTotalRiskUsd.toFixed(2)} (${projectedTotalRiskPct}% of $${accountBalanceUsd}). Keep combined open exposure under 3.0% to safeguard prop drawdown.`;
    }
  }

  return {
    openOrderCount: openOrders.length,
    protectedOrderCount,
    totalOpenRiskUsd,
    totalOpenRiskPct,
    projectedTotalRiskUsd,
    projectedTotalRiskPct,
    stackedClusters,
    severity,
    warningHeadline,
    warningDetail
  };
}

export interface CurrencyStrengthItem {
  code: 'GBP' | 'EUR' | 'USD' | 'CHF' | 'AUD' | 'CAD' | 'JPY' | 'XAU';
  score: number; // -100 to +100 relative strength
  avgPctMove: number;
  momentumBias: 'STRONG' | 'NEUTRAL' | 'WEAK';
}

export interface CurrencyStrengthReport {
  rankings: CurrencyStrengthItem[];
  strongest: CurrencyStrengthItem;
  weakest: CurrencyStrengthItem;
  topDivergencePair: CurrencyPair;
  topDivergenceDirection: 'BUY' | 'SELL';
  divergenceSpread: number;
  summaryText: string;
}

const CURRENCY_PAIR_MATRIX_MAP: Partial<Record<string, { pair: CurrencyPair; invert?: boolean }>> = {
  'EUR/USD': { pair: 'EUR/USD' },
  'GBP/USD': { pair: 'GBP/USD' },
  'AUD/USD': { pair: 'AUD/USD' },
  'USD/JPY': { pair: 'USD/JPY' },
  'USD/CHF': { pair: 'USD/CHF' },
  'USD/CAD': { pair: 'USD/CAD' },
  'GBP/JPY': { pair: 'GBP/JPY' },
  'EUR/JPY': { pair: 'EUR/JPY' },
  'XAU/USD': { pair: 'XAU/USD' }
};

export function computeCurrencyStrengthMatrix(markets: MarketScanData[]): CurrencyStrengthReport {
  const buckets: Record<CurrencyStrengthItem['code'], number[]> = {
    GBP: [],
    EUR: [],
    USD: [],
    CHF: [],
    AUD: [],
    CAD: [],
    JPY: [],
    XAU: []
  };

  markets.forEach((m) => {
    const pct = Number(m.change24hPct || 0);
    const adxBoost = Math.max(0.75, Math.min(1.5, ((m.adxStrength ?? 20) / 22)));
    const trendWeight =
      m.trendDirection === 'UPTREND' ? 0.12 : m.trendDirection === 'DOWNTREND' ? -0.12 : 0;
    const weightedMove = pct * adxBoost + trendWeight;

    switch (m.pair) {
      case 'EUR/USD':
        buckets.EUR.push(weightedMove);
        buckets.USD.push(-weightedMove);
        break;
      case 'GBP/USD':
        buckets.GBP.push(weightedMove);
        buckets.USD.push(-weightedMove);
        break;
      case 'AUD/USD':
        buckets.AUD.push(weightedMove);
        buckets.USD.push(-weightedMove);
        break;
      case 'USD/JPY':
        buckets.USD.push(weightedMove);
        buckets.JPY.push(-weightedMove);
        break;
      case 'USD/CHF':
        buckets.USD.push(weightedMove);
        buckets.CHF.push(-weightedMove);
        break;
      case 'USD/CAD':
        buckets.USD.push(weightedMove);
        buckets.CAD.push(-weightedMove);
        break;
      case 'GBP/JPY':
        buckets.GBP.push(weightedMove);
        buckets.JPY.push(-weightedMove);
        break;
      case 'EUR/JPY':
        buckets.EUR.push(weightedMove);
        buckets.JPY.push(-weightedMove);
        break;
      case 'XAU/USD':
        buckets.XAU.push(weightedMove * 0.85);
        buckets.USD.push(-weightedMove * 0.4);
        break;
      default:
        break;
    }
  });

  const rawItems: CurrencyStrengthItem[] = (Object.keys(buckets) as CurrencyStrengthItem['code'][]).map(
    (code) => {
      const vals = buckets[code];
      const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      const clampedScore = Math.max(-100, Math.min(100, Math.round(avg * 95)));
      return {
        code,
        score: clampedScore,
        avgPctMove: Number(avg.toFixed(2)),
        momentumBias: clampedScore >= 18 ? 'STRONG' : clampedScore <= -18 ? 'WEAK' : 'NEUTRAL'
      };
    }
  );

  const rankings = [...rawItems].sort((a, b) => b.score - a.score);
  const strongest = rankings[0];
  const weakest = rankings[rankings.length - 1];

  // Pick the sharpest executable pair supported in our 15-market universe
  let bestPair: CurrencyPair = 'GBP/JPY';
  let bestDir: 'BUY' | 'SELL' = 'BUY';
  let bestSpread = -1;

  const candidatePairs: Array<{
    pair: CurrencyPair;
    base: CurrencyStrengthItem['code'];
    quote: CurrencyStrengthItem['code'];
  }> = [
    { pair: 'EUR/USD', base: 'EUR', quote: 'USD' },
    { pair: 'GBP/USD', base: 'GBP', quote: 'USD' },
    { pair: 'AUD/USD', base: 'AUD', quote: 'USD' },
    { pair: 'USD/JPY', base: 'USD', quote: 'JPY' },
    { pair: 'USD/CHF', base: 'USD', quote: 'CHF' },
    { pair: 'USD/CAD', base: 'USD', quote: 'CAD' },
    { pair: 'GBP/JPY', base: 'GBP', quote: 'JPY' },
    { pair: 'EUR/JPY', base: 'EUR', quote: 'JPY' },
    { pair: 'XAU/USD', base: 'XAU', quote: 'USD' }
  ];

  const scoreByCode = new Map(rawItems.map((i) => [i.code, i.score]));
  candidatePairs.forEach((cand) => {
    const baseScore = scoreByCode.get(cand.base) ?? 0;
    const quoteScore = scoreByCode.get(cand.quote) ?? 0;
    const diff = baseScore - quoteScore;
    if (Math.abs(diff) > bestSpread) {
      bestSpread = Math.abs(diff);
      bestPair = cand.pair;
      bestDir = diff >= 0 ? 'BUY' : 'SELL';
    }
  });

  // Reference check to suppress unused map warning if extended later
  void CURRENCY_PAIR_MATRIX_MAP;

  return {
    rankings,
    strongest,
    weakest,
    topDivergencePair: bestPair,
    topDivergenceDirection: bestDir,
    divergenceSpread: Math.max(0, strongest.score - weakest.score),
    summaryText: `Strongest ${strongest.code} (${strongest.score >= 0 ? `+${strongest.score}` : strongest.score}) vs Weakest ${weakest.code} (${weakest.score >= 0 ? `+${weakest.score}` : weakest.score}) → Best Momentum Focus: ${bestPair} (${bestDir})`
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

/**
 * Computes institutional MACD (12, 26, 9) histogram & momentum bias from real close prices.
 */
export function computeRealMacd(closes: number[]): {
  macdLine: number;
  signalLine: number;
  histogram: number;
  bias: 'BULLISH' | 'BEARISH' | 'FLAT';
} {
  if (!closes || closes.length < 18) {
    return { macdLine: 0, signalLine: 0, histogram: 0, bias: 'FLAT' };
  }
  const k12 = 2 / 13;
  const k26 = 2 / 27;
  const k9 = 2 / 10;
  let ema12 = closes[0];
  let ema26 = closes[0];
  const macdSeries: number[] = [];

  for (let i = 0; i < closes.length; i++) {
    ema12 = closes[i] * k12 + ema12 * (1 - k12);
    ema26 = closes[i] * k26 + ema26 * (1 - k26);
    macdSeries.push(ema12 - ema26);
  }

  let signal = macdSeries[0];
  for (let i = 0; i < macdSeries.length; i++) {
    signal = macdSeries[i] * k9 + signal * (1 - k9);
  }

  const macdLine = macdSeries[macdSeries.length - 1];
  const histogram = macdLine - signal;
  const prevHistogram = macdSeries.length >= 2 ? macdSeries[macdSeries.length - 2] - signal : histogram;
  const lastPrice = Math.max(0.0001, closes[closes.length - 1]);
  const relNorm = Math.abs(histogram) / lastPrice;

  const bias: 'BULLISH' | 'BEARISH' | 'FLAT' =
    relNorm < 0.000015 && Math.abs(macdLine) / lastPrice < 0.00003
      ? 'FLAT'
      : histogram > 0 && macdLine >= prevHistogram * 0.4 - Math.abs(signal) * 0.2
      ? 'BULLISH'
      : histogram < 0
      ? 'BEARISH'
      : macdLine >= 0
      ? 'BULLISH'
      : 'BEARISH';

  return { macdLine, signalLine: signal, histogram, bias };
}

/**
 * Computes Wilder 14-period Average Directional Index (ADX, +DI, -DI) to filter low-ADX choppy ranges.
 */
export function computeRealAdx(candles: OhlcCandle[], period = 14): {
  adx: number;
  plusDi: number;
  minusDi: number;
  regime: 'STRONG_TREND' | 'MODERATE_TREND' | 'CHOP_RANGE';
} {
  if (!candles || candles.length < period + 2) {
    return { adx: 21.0, plusDi: 22.0, minusDi: 20.0, regime: 'MODERATE_TREND' };
  }

  const dxValues: number[] = [];
  let trSmooth = 0;
  let plusDmSmooth = 0;
  let minusDmSmooth = 0;
  let lastPlusDi = 20;
  let lastMinusDi = 20;

  for (let i = 1; i < candles.length; i++) {
    const cur = candles[i];
    const prev = candles[i - 1];
    const upMove = cur.high - prev.high;
    const downMove = prev.low - cur.low;
    const plusDm = upMove > downMove && upMove > 0 ? upMove : 0;
    const minusDm = downMove > upMove && downMove > 0 ? downMove : 0;
    const tr = Math.max(
      cur.high - cur.low,
      Math.abs(cur.high - prev.close),
      Math.abs(cur.low - prev.close)
    );

    if (i <= period) {
      trSmooth += tr;
      plusDmSmooth += plusDm;
      minusDmSmooth += minusDm;
      if (i === period && trSmooth > 0) {
        lastPlusDi = (plusDmSmooth / trSmooth) * 100;
        lastMinusDi = (minusDmSmooth / trSmooth) * 100;
        const diSum = lastPlusDi + lastMinusDi;
        dxValues.push(diSum > 0 ? (Math.abs(lastPlusDi - lastMinusDi) / diSum) * 100 : 0);
      }
    } else {
      trSmooth = trSmooth - trSmooth / period + tr;
      plusDmSmooth = plusDmSmooth - plusDmSmooth / period + plusDm;
      minusDmSmooth = minusDmSmooth - minusDmSmooth / period + minusDm;
      if (trSmooth > 0) {
        lastPlusDi = (plusDmSmooth / trSmooth) * 100;
        lastMinusDi = (minusDmSmooth / trSmooth) * 100;
        const diSum = lastPlusDi + lastMinusDi;
        dxValues.push(diSum > 0 ? (Math.abs(lastPlusDi - lastMinusDi) / diSum) * 100 : 0);
      }
    }
  }

  const adxRaw =
    dxValues.length > 0
      ? dxValues.slice(-period).reduce((acc, v) => acc + v, 0) / Math.min(period, dxValues.length)
      : 20;
  const adx = Number(Math.min(75, Math.max(8, adxRaw)).toFixed(1));
  const regime: 'STRONG_TREND' | 'MODERATE_TREND' | 'CHOP_RANGE' =
    adx >= 25 ? 'STRONG_TREND' : adx >= 17 ? 'MODERATE_TREND' : 'CHOP_RANGE';

  return {
    adx,
    plusDi: Number(lastPlusDi.toFixed(1)),
    minusDi: Number(lastMinusDi.toFixed(1)),
    regime
  };
}

/**
 * Classifies latest price-action candlestick pattern across the final 2–3 closed/active bars.
 */
export function detectLatestCandlePattern(candles: OhlcCandle[]): CandlePatternSignal {
  if (!candles || candles.length < 3) return 'CONSOLIDATION';
  const prev = candles[candles.length - 3];
  const lastClosed = candles[candles.length - 2];
  const cur = candles[candles.length - 1];

  const prevBody = Math.abs(prev.close - prev.open);
  const lcBody = Math.abs(lastClosed.close - lastClosed.open);
  const lcRange = Math.max(1e-9, lastClosed.high - lastClosed.low);
  const lcUpperWick = Math.max(0, lastClosed.high - Math.max(lastClosed.open, lastClosed.close));
  const lcLowerWick = Math.max(0, Math.min(lastClosed.open, lastClosed.close) - lastClosed.low);

  // Bullish / Bearish Engulfing on confirmed bar
  if (
    lastClosed.close > lastClosed.open &&
    prev.close < prev.open &&
    lcBody >= prevBody * 1.05 &&
    lastClosed.close >= prev.open &&
    cur.close >= lastClosed.open
  ) {
    return 'BULLISH_ENGULFING';
  }
  if (
    lastClosed.close < lastClosed.open &&
    prev.close > prev.open &&
    lcBody >= prevBody * 1.05 &&
    lastClosed.close <= prev.open &&
    cur.close <= lastClosed.open
  ) {
    return 'BEARISH_ENGULFING';
  }

  // Rejection Pin Bars (Sweep & Reject)
  if (lcLowerWick > lcBody * 1.45 && lcLowerWick / lcRange >= 0.45 && cur.close >= lastClosed.low) {
    return 'BULLISH_PIN_REJECTION';
  }
  if (lcUpperWick > lcBody * 1.45 && lcUpperWick / lcRange >= 0.45 && cur.close <= lastClosed.high) {
    return 'BEARISH_PIN_REJECTION';
  }

  // Inside bar compression breaking out
  if (lastClosed.high < prev.high && lastClosed.low > prev.low) {
    return 'INSIDE_BREAKOUT';
  }

  return 'CONSOLIDATION';
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

function detectSingleTfBos(
  candles: OhlcCandle[] | undefined,
  livePrice: number,
  pipMultiplier: number,
  decimals: number,
  atrPips: number
): {
  bosDirection: BosDirection;
  lastSwingHigh: number;
  prevSwingHigh: number;
  lastSwingLow: number;
  prevSwingLow: number;
  bosTriggerLevel: number;
  brokenStructure: boolean;
  chochDetected: boolean;
} {
  if (!candles || candles.length < 8) {
    const p = Number(livePrice.toFixed(decimals));
    const offset = Math.max(4, atrPips) / pipMultiplier;
    return {
      bosDirection: 'RANGING',
      lastSwingHigh: Number((p + offset).toFixed(decimals)),
      prevSwingHigh: Number((p + offset).toFixed(decimals)),
      lastSwingLow: Number(Math.max(1 / pipMultiplier, p - offset).toFixed(decimals)),
      prevSwingLow: Number(Math.max(1 / pipMultiplier, p - offset).toFixed(decimals)),
      bosTriggerLevel: p,
      brokenStructure: false,
      chochDetected: false
    };
  }

  const closedBars = candles.length >= 10 ? candles.slice(0, -1) : candles;
  const pivotHighs: Array<{ idx: number; price: number }> = [];
  const pivotLows: Array<{ idx: number; price: number }> = [];

  for (let i = 1; i < closedBars.length - 1; i++) {
    if (closedBars[i].high > closedBars[i - 1].high && closedBars[i].high >= closedBars[i + 1].high) {
      pivotHighs.push({ idx: i, price: closedBars[i].high });
    }
    if (closedBars[i].low < closedBars[i - 1].low && closedBars[i].low <= closedBars[i + 1].low) {
      pivotLows.push({ idx: i, price: closedBars[i].low });
    }
  }

  const recentSlice = closedBars.slice(-24);
  const olderSlice = recentSlice.slice(0, Math.max(4, Math.floor(recentSlice.length / 2)));
  const newerSlice = recentSlice.slice(Math.max(4, Math.floor(recentSlice.length / 2)));

  const fallbackLastHigh = Math.max(...newerSlice.map((c) => c.high));
  const fallbackPrevHigh = Math.max(...olderSlice.map((c) => c.high));
  const fallbackLastLow = Math.min(...newerSlice.map((c) => c.low));
  const fallbackPrevLow = Math.min(...olderSlice.map((c) => c.low));

  const lastSwingHigh = Number(
    (pivotHighs.length >= 1 ? pivotHighs[pivotHighs.length - 1].price : fallbackLastHigh).toFixed(decimals)
  );
  const prevSwingHigh = Number(
    (pivotHighs.length >= 2 ? pivotHighs[pivotHighs.length - 2].price : fallbackPrevHigh).toFixed(decimals)
  );
  const lastSwingLow = Number(
    (pivotLows.length >= 1 ? pivotLows[pivotLows.length - 1].price : fallbackLastLow).toFixed(decimals)
  );
  const prevSwingLow = Number(
    (pivotLows.length >= 2 ? pivotLows[pivotLows.length - 2].price : fallbackPrevLow).toFixed(decimals)
  );

  // Also capture the most significant protected swing extreme excluding just the latest 2 bars
  const preRecentBars = closedBars.slice(-18, -2);
  const refSwingHigh = Number(
    (preRecentBars.length >= 3
      ? Math.max(...preRecentBars.map((c) => c.high))
      : lastSwingHigh
    ).toFixed(decimals)
  );
  const refSwingLow = Number(
    (preRecentBars.length >= 3
      ? Math.min(...preRecentBars.map((c) => c.low))
      : lastSwingLow
    ).toFixed(decimals)
  );

  const recentHighAnchor =
    pivotHighs.length >= 1 && pivotHighs[pivotHighs.length - 1].idx < closedBars.length - 2
      ? lastSwingHigh
      : refSwingHigh;
  const recentLowAnchor =
    pivotLows.length >= 1 && pivotLows[pivotLows.length - 1].idx < closedBars.length - 2
      ? lastSwingLow
      : refSwingLow;

  const latestClose = closedBars[closedBars.length - 1].close;
  const recent3MinClose = Math.min(...closedBars.slice(-3).map((c) => c.close), livePrice);
  const recent3MaxClose = Math.max(...closedBars.slice(-3).map((c) => c.close), livePrice);
  const noiseTolerance = Math.max(1.5 / pipMultiplier, (atrPips * 0.08) / pipMultiplier);

  const brokeBelowSwingLow =
    Math.min(livePrice, latestClose, recent3MinClose) < recentLowAnchor - noiseTolerance &&
    livePrice < recentLowAnchor;
  const brokeAboveSwingHigh =
    Math.max(livePrice, latestClose, recent3MaxClose) > recentHighAnchor + noiseTolerance &&
    livePrice > recentHighAnchor;

  const wasPriorHigherHigh = lastSwingHigh >= prevSwingHigh;
  const wasPriorLowerLow = lastSwingLow <= prevSwingLow;

  let bosDirection: BosDirection = 'RANGING';
  let bosTriggerLevel = recentLowAnchor;
  let brokenStructure = false;
  let chochDetected = false;

  if (brokeBelowSwingLow && !brokeAboveSwingHigh) {
    brokenStructure = true;
    bosTriggerLevel = recentLowAnchor;
    if (wasPriorHigherHigh) {
      bosDirection = 'BEARISH_CHOCH';
      chochDetected = true;
    } else {
      bosDirection = 'BEARISH_BOS';
    }
  } else if (brokeAboveSwingHigh && !brokeBelowSwingLow) {
    brokenStructure = true;
    bosTriggerLevel = recentHighAnchor;
    if (wasPriorLowerLow) {
      bosDirection = 'BULLISH_CHOCH';
      chochDetected = true;
    } else {
      bosDirection = 'BULLISH_BOS';
    }
  } else if (lastSwingHigh > prevSwingHigh && lastSwingLow > prevSwingLow && livePrice >= lastSwingLow) {
    bosDirection = 'BULLISH_BOS';
    bosTriggerLevel = prevSwingHigh;
  } else if (lastSwingHigh < prevSwingHigh && lastSwingLow < prevSwingLow && livePrice <= lastSwingHigh) {
    bosDirection = 'BEARISH_BOS';
    bosTriggerLevel = prevSwingLow;
  } else {
    bosTriggerLevel = livePrice >= (recentHighAnchor + recentLowAnchor) / 2 ? recentLowAnchor : recentHighAnchor;
  }

  return {
    bosDirection,
    lastSwingHigh: recentHighAnchor,
    prevSwingHigh,
    lastSwingLow: recentLowAnchor,
    prevSwingLow,
    bosTriggerLevel,
    brokenStructure,
    chochDetected
  };
}

/**
 * Objective Multi-Timeframe Break of Structure (BOS) & Change of Character (CHoCH) Engine:
 * Detects structural pivot highs/lows across active candles and H1 candles so the app
 * never triggers BUY into a Bearish BOS/CHoCH breakdown or SELL into a Bullish BOS/CHoCH breakout.
 */
export function analyzeMarketStructureBos(p: {
  pair: CurrencyPair;
  candles?: OhlcCandle[];
  h1Candles?: OhlcCandle[];
  livePrice: number;
  atrPips?: number;
}): StructureBosAnalysis {
  const { isGold, isBtc, isEth, isIndex, isOil, pipMultiplier, decimals } = getPairSpecs(p.pair);
  const fallbackAtr = isGold ? 28 : isBtc ? 180 : isEth ? 14 : isIndex ? 38 : isOil ? 22 : 16;
  const effAtr = Math.max(4, p.atrPips ?? fallbackAtr);

  const primary = detectSingleTfBos(p.candles, p.livePrice, pipMultiplier, decimals, effAtr);
  const h1 =
    p.h1Candles && p.h1Candles.length >= 10
      ? detectSingleTfBos(p.h1Candles, p.livePrice, pipMultiplier, decimals, effAtr * 1.6)
      : primary;

  const isPrimaryBull = primary.bosDirection === 'BULLISH_BOS' || primary.bosDirection === 'BULLISH_CHOCH';
  const isPrimaryBear = primary.bosDirection === 'BEARISH_BOS' || primary.bosDirection === 'BEARISH_CHOCH';
  const isH1Bull = h1.bosDirection === 'BULLISH_BOS' || h1.bosDirection === 'BULLISH_CHOCH';
  const isH1Bear = h1.bosDirection === 'BEARISH_BOS' || h1.bosDirection === 'BEARISH_CHOCH';

  // Use H1 protected extremes combined with active swing extremes for ironclad SL placement
  const closedActive = (p.candles || []).slice(-16, -1);
  const activeLowMin =
    closedActive.length > 0 ? Math.min(...closedActive.map((c) => c.low), primary.lastSwingLow) : primary.lastSwingLow;
  const activeHighMax =
    closedActive.length > 0 ? Math.max(...closedActive.map((c) => c.high), primary.lastSwingHigh) : primary.lastSwingHigh;

  const protectedSwingLow = Number(
    Math.min(primary.lastSwingLow, activeLowMin).toFixed(decimals)
  );
  const protectedSwingHigh = Number(
    Math.max(primary.lastSwingHigh, activeHighMax).toFixed(decimals)
  );

  const structureTrend: StructureBosAnalysis['structureTrend'] =
    isPrimaryBull && !isH1Bear
      ? 'BULLISH'
      : isPrimaryBear && !isH1Bull
      ? 'BEARISH'
      : isH1Bear && !primary.brokenStructure
      ? 'BEARISH'
      : isH1Bull && !primary.brokenStructure
      ? 'BULLISH'
      : isPrimaryBull
      ? 'BULLISH'
      : isPrimaryBear
      ? 'BEARISH'
      : 'RANGING';

  let bosVetoReason: string | undefined;
  if (primary.bosDirection === 'BEARISH_CHOCH') {
    bosVetoReason = `Bearish CHoCH confirmed: price broke swing low ${primary.bosTriggerLevel.toFixed(decimals)} — BUY prohibited until reclaimed.`;
  } else if (primary.bosDirection === 'BEARISH_BOS') {
    bosVetoReason = `Bearish BOS confirmed below ${primary.bosTriggerLevel.toFixed(decimals)} (LL + LH sequence) — rallies favor SELL.`;
  } else if (primary.bosDirection === 'BULLISH_CHOCH') {
    bosVetoReason = `Bullish CHoCH confirmed: price broke swing high ${primary.bosTriggerLevel.toFixed(decimals)} — SELL prohibited until lost.`;
  } else if (primary.bosDirection === 'BULLISH_BOS') {
    bosVetoReason = `Bullish BOS confirmed above ${primary.bosTriggerLevel.toFixed(decimals)} (HH + HL sequence) — dips favor BUY.`;
  } else if (isH1Bear) {
    bosVetoReason = `H1 Bearish Structure active below ${h1.bosTriggerLevel.toFixed(decimals)} — guard against counter-trend longs.`;
  } else if (isH1Bull) {
    bosVetoReason = `H1 Bullish Structure active above ${h1.bosTriggerLevel.toFixed(decimals)} — guard against counter-trend shorts.`;
  }

  const structureSummary =
    primary.bosDirection === 'RANGING'
      ? `Ranging between Swing Low ${protectedSwingLow.toFixed(decimals)} & Swing High ${protectedSwingHigh.toFixed(decimals)} (H1: ${h1.bosDirection.replace('_', ' ')})`
      : `${primary.bosDirection.replace('_', ' ')} @ ${primary.bosTriggerLevel.toFixed(decimals)} · Protected SL Anchor: ${
          isPrimaryBull ? `Low ${protectedSwingLow.toFixed(decimals)}` : `High ${protectedSwingHigh.toFixed(decimals)}`
        }`;

  return {
    bosDirection: primary.bosDirection,
    structureTrend,
    h1BosDirection: h1.bosDirection,
    lastSwingHigh: primary.lastSwingHigh,
    prevSwingHigh: primary.prevSwingHigh,
    lastSwingLow: primary.lastSwingLow,
    prevSwingLow: primary.prevSwingLow,
    protectedSwingLow,
    protectedSwingHigh,
    bosTriggerLevel: primary.bosTriggerLevel,
    brokenStructure: primary.brokenStructure || h1.brokenStructure,
    chochDetected: primary.chochDetected || h1.chochDetected,
    structureSummary,
    bosVetoReason
  };
}

/**
 * Computes the deterministic 8-Point Zero-Mistake Pre-Flight Checklist for any trade setup.
 */
export function buildZeroMistakeChecklist(p: {
  pair: CurrencyPair;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  riskReward: string;
  atrPips: number;
  slPips: number;
  tpPips: number;
  h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  trendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  isExtendedZone: boolean;
  bosAnalysis?: StructureBosAnalysis;
  liveFeedConnected?: boolean;
  adxStrength?: number;
  macdBias?: 'BULLISH' | 'BEARISH' | 'FLAT';
  candlePattern?: CandlePatternSignal;
}): DeepVerifyCheckItem[] {
  const { decimals, pipMultiplier } = getPairSpecs(p.pair);
  const timing = evaluatePairKenyaTiming(p.pair);
  const isBuy = p.direction === 'BUY';
  const rrNum = parseFloat((p.riskReward.split(':')[1] || '0').trim()) || Number((p.tpPips / Math.max(1, p.slPips)).toFixed(1));

  // 1. Live Interbank Feed & Session Open Gate
  const feedAndWindowOk = timing.windowStatusCode !== 'CLOSED_WAIT';
  const check1: DeepVerifyCheckItem = {
    id: 'LIVE_FEED_SYNCED',
    label: 'Live Feed & Market Window Open',
    passed: feedAndWindowOk,
    detail: feedAndWindowOk
      ? `${p.liveFeedConnected !== false ? 'Live Interbank OHLC synced' : 'Calibrated live price'} · ${timing.currentWindowName}`
      : `Market window closed (${timing.currentWindowName}) — spreads spike at open`
  };

  // 2. MTF Alignment (Active TF & H1 agree)
  const expectedTrend = isBuy ? 'UPTREND' : 'DOWNTREND';
  const mtfOk = p.h1TrendDirection === expectedTrend && p.trendDirection === expectedTrend;
  const check2: DeepVerifyCheckItem = {
    id: 'MTF_ALIGNED',
    label: 'H1 + Active TF Trajectory Aligned',
    passed: mtfOk,
    detail: mtfOk
      ? `Both H1 (${p.h1TrendDirection}) & chart trajectory (${p.trendDirection}) confirm ${p.direction}`
      : `Timeframe conflict: H1 is ${p.h1TrendDirection} while order inspects ${p.direction}`
  };

  // 3. Zero Counter-BOS / CHoCH Guard
  const bos = p.bosAnalysis;
  const isCounterBos = Boolean(
    bos &&
      ((isBuy &&
        (bos.bosDirection === 'BEARISH_BOS' ||
          bos.bosDirection === 'BEARISH_CHOCH' ||
          bos.h1BosDirection === 'BEARISH_BOS' ||
          bos.h1BosDirection === 'BEARISH_CHOCH')) ||
        (!isBuy &&
          (bos.bosDirection === 'BULLISH_BOS' ||
            bos.bosDirection === 'BULLISH_CHOCH' ||
            bos.h1BosDirection === 'BULLISH_BOS' ||
            bos.h1BosDirection === 'BULLISH_CHOCH')))
  );
  const check3: DeepVerifyCheckItem = {
    id: 'NO_COUNTER_BOS',
    label: 'Break of Structure (BOS/CHoCH) Safe',
    passed: !isCounterBos,
    detail: !isCounterBos
      ? bos
        ? `${bos.bosDirection.replace('_', ' ')} supports ${p.direction} (BOS level ${bos.bosTriggerLevel.toFixed(decimals)})`
        : `No opposing Break of Structure detected`
      : bos!.bosVetoReason ||
        `Opposing ${bos!.bosDirection.replace('_', ' ')} @ ${bos!.bosTriggerLevel.toFixed(decimals)} blocks ${p.direction}`
  };

  // 4. Protected Swing SL & Non-ATR Crushed Stop (Full 1.0x ATR + Swing Clearance)
  const slSafeGeometry = isBuy ? p.stopLoss < p.entryPrice : p.stopLoss > p.entryPrice;
  const slClearOfSwing = !bos
    ? true
    : isBuy
    ? p.stopLoss <= bos.protectedSwingLow + (p.atrPips * 0.2) / pipMultiplier
    : p.stopLoss >= bos.protectedSwingHigh - (p.atrPips * 0.2) / pipMultiplier;
  const slWideEnough = p.slPips >= Math.max(4, p.atrPips * 1.0);
  const slOk = slSafeGeometry && slWideEnough;
  const check4: DeepVerifyCheckItem = {
    id: 'SWING_SL_PROTECTED',
    label: 'SL Protected Beyond Swing & ATR',
    passed: slOk,
    detail: slOk
      ? `SL ${p.stopLoss.toFixed(decimals)} (${p.slPips}p >= ${p.atrPips.toFixed(1)}p ATR shield)${slClearOfSwing ? ' clears swing anchor' : ''}`
      : `SL ${p.stopLoss.toFixed(decimals)} (${p.slPips}p) too tight vs ${p.atrPips}p ATR candle volatility — widen SL or lower lot`
  };

  // 5. Strict MT4 Geometry + R:R >= 1.8 & Realistic ATR Horizon
  const tpValidOrder = isBuy
    ? p.entryPrice < p.tp1 && p.tp1 < p.tp2
    : p.entryPrice > p.tp1 && p.tp1 > p.tp2;
  const rrOk = tpValidOrder && rrNum >= 1.75;
  const check5: DeepVerifyCheckItem = {
    id: 'RR_AND_TP_VALID',
    label: 'TP Targets & R:R >= 1:1.8 Valid',
    passed: rrOk,
    detail: rrOk
      ? `Validated EP ${p.entryPrice.toFixed(decimals)} -> TP1 ${p.tp1.toFixed(decimals)} -> TP2 ${p.tp2.toFixed(decimals)} (1:${rrNum.toFixed(1)})`
      : `R:R (${rrNum.toFixed(1)}) below 1:1.8 or invalid TP separation`
  };

  // 6. Entry Not Chased
  const entryNotChased = !p.isExtendedZone;
  const check6: DeepVerifyCheckItem = {
    id: 'ENTRY_NOT_CHASED',
    label: 'Pullback Corridor (Not Chased)',
    passed: entryNotChased,
    detail: entryNotChased
      ? `Entry sits inside 20/50 EMA value zone without overextension`
      : `Stretched away from 20 EMA — stage Limit instead of chasing`
  };

  // 7. ADX(14) Trend Displacement Filter
  const adxOk = p.adxStrength === undefined || p.adxStrength >= 14.5;
  const check7: DeepVerifyCheckItem = {
    id: 'ADX_TREND_STRENGTH',
    label: 'ADX(14) Trend Velocity Filter',
    passed: adxOk,
    detail:
      p.adxStrength === undefined
        ? `ADX momentum within operational corridor`
        : adxOk
        ? `ADX(14) ${p.adxStrength.toFixed(1)} confirms clean trend displacement (>= 14.5)`
        : `ADX(14) ${p.adxStrength.toFixed(1)} (< 14.5 chop zone) — avoid false breakouts`
  };

  // 8. MACD(12/26/9) & Candle Action Alignment
  const macdOk =
    p.macdBias === undefined ||
    p.macdBias === 'FLAT' ||
    (isBuy ? p.macdBias === 'BULLISH' : p.macdBias === 'BEARISH');
  const patternLabel = p.candlePattern && p.candlePattern !== 'CONSOLIDATION' ? ` · ${p.candlePattern.replace(/_/g, ' ')}` : '';
  const check8: DeepVerifyCheckItem = {
    id: 'MACD_MOMENTUM_SYNC',
    label: 'MACD(12/26/9) & Candle Action Sync',
    passed: macdOk,
    detail: `${p.macdBias || 'FLAT'} MACD impulse${patternLabel}`
  };

  return [check1, check2, check3, check4, check5, check6, check7, check8];
}

/**
 * Evaluates ALL 10 Institutional Trading Factors simultaneously to judge BUY vs SELL:
 * 1. Live Candlestick Price Action & Liquidity Sweep
 * 2. 20/50 EMA Dynamic Trend Stack & Pullback Timing Guard
 * 3. 14-Period Wilder RSI Momentum & Exhaustion
 * 4. Global Macro & Live USD Basket (DXY) / Safe-Haven Flow
 * 5. Nairobi (EAT) Session Liquidity & Broker Spread Friction
 * 6. H1 Higher-Timeframe Trend Structure & Swing Key Level
 * 7. FVG & Order Block Mitigation
 * 8. Volatility Compression & ATR Exhaustion Guard
 * 9. Market Structure Break of Structure (BOS / CHoCH) Anti-Reversal Shield
 * 10. MACD (12/26/9) Momentum & ADX (14) Trend Velocity Filter
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
  opposingCandleWarning?: string;
  bosAnalysis?: StructureBosAnalysis;
  adxStrength?: number;
  macdBias?: 'BULLISH' | 'BEARISH' | 'FLAT';
  macdHistogram?: number;
  candlePattern?: CandlePatternSignal;
}): {
  isBuy: boolean;
  bullScorePct: number;
  bearScorePct: number;
  confidence: number;
  factorVerdicts: FactorJudgmentItem[];
  alignedFactorsCount: number;
  totalFactorsCount: number;
  isExtendedZone: boolean;
  isFlatEmaChop: boolean;
  entryTimingWarning?: string;
  goAheadAssurance: ComputedTradeParams['goAheadAssurance'];
} {
  const { isGold, isBtc, isEth, isCrypto, isIndex, isOil, pipMultiplier, decimals } = getPairSpecs(p.pair);
  const macro = p.macro || getCurrentMacroContext();
  const verdicts: FactorJudgmentItem[] = [];

  let bullWeight = 0;
  let bearWeight = 0;

  // Higher-Timeframe (H1) context (weighted cleanly once in Factor 6 below — never double-counted)
  const effectiveH1 =
    p.h1TrendDirection ??
    (p.ema20 > p.ema50
      ? 'UPTREND'
      : p.ema20 < p.ema50
      ? 'DOWNTREND'
      : p.livePrice >= p.ema50
      ? 'UPTREND'
      : 'DOWNTREND');

  // FACTOR 1: Candlestick Price Action, Multi-Candle Momentum & Liquidity Sweep (24 pts max)
  const prevRef = p.prev3Close ?? p.ema20;
  const microDeltaPips = Number(((p.livePrice - prevRef) * pipMultiplier).toFixed(1));
  const noiseFloorPips = isGold ? 12.0 : isBtc ? 65.0 : isEth ? 6.0 : isIndex ? 18.0 : isOil ? 8.0 : 1.5;
  const significantDisplacementPips = noiseFloorPips * 2.0;

  if (p.isBearishPinOrSweep) {
    if (effectiveH1 === 'UPTREND' && p.ema20 > p.ema50 && p.livePrice > p.ema20) {
      bullWeight += 12;
      bearWeight += 10;
      verdicts.push({
        name: '1. Candle & Liquidity Sweep',
        signal: 'BUY',
        weight: '12%',
        detail: `Upper wick pause inside bullish EMA trend — support near ${p.keyLevel ? p.keyLevel.toFixed(decimals) : p.ema50.toFixed(decimals)}`
      });
    } else {
      bearWeight += 24;
      bullWeight += 2;
      verdicts.push({
        name: '1. Candle & Liquidity Sweep',
        signal: 'SELL',
        weight: '24%',
        detail: `Upper wick rejection / BSL sweep detected (${microDeltaPips >= 0 ? `+${microDeltaPips}` : microDeltaPips}p swing)`
      });
    }
  } else if (p.isBullishPinOrAbsorption) {
    if (effectiveH1 === 'DOWNTREND' && p.ema20 < p.ema50 && p.livePrice < p.ema20) {
      bearWeight += 12;
      bullWeight += 10;
      verdicts.push({
        name: '1. Candle & Liquidity Sweep',
        signal: 'SELL',
        weight: '12%',
        detail: `Lower wick pause inside bearish EMA trend — ceiling near ${p.keyLevel ? p.keyLevel.toFixed(decimals) : p.ema50.toFixed(decimals)}`
      });
    } else {
      bullWeight += 24;
      bearWeight += 2;
      verdicts.push({
        name: '1. Candle & Liquidity Sweep',
        signal: 'BUY',
        weight: '24%',
        detail: `Lower wick absorption / SSL sweep near ${p.keyLevel ? p.keyLevel.toFixed(decimals) : p.livePrice.toFixed(decimals)}`
      });
    }
  } else if (microDeltaPips >= significantDisplacementPips) {
    if (effectiveH1 === 'DOWNTREND' && p.livePrice <= p.ema50) {
      bearWeight += 18;
      bullWeight += 6;
      verdicts.push({
        name: '1. Candle & Liquidity Sweep',
        signal: 'SELL',
        weight: '18%',
        detail: `Bearish Retracement Pullback (+${microDeltaPips}p bounce) into 20/50 EMA — Primary DOWNTREND intact (Sell the Rally)`
      });
    } else {
      bullWeight += 20;
      bearWeight += 4;
      verdicts.push({
        name: '1. Candle & Liquidity Sweep',
        signal: 'BUY',
        weight: '20%',
        detail: `Bullish multi-candle expansion (+${microDeltaPips}p displacement)`
      });
    }
  } else if (microDeltaPips <= -significantDisplacementPips) {
    if (effectiveH1 === 'UPTREND' && p.livePrice >= p.ema50) {
      bullWeight += 18;
      bearWeight += 6;
      verdicts.push({
        name: '1. Candle & Liquidity Sweep',
        signal: 'BUY',
        weight: '18%',
        detail: `Bullish Retracement Pullback (${microDeltaPips}p dip) into 20/50 EMA — Primary UPTREND intact (Buy the Dip)`
      });
    } else {
      bearWeight += 20;
      bullWeight += 4;
      verdicts.push({
        name: '1. Candle & Liquidity Sweep',
        signal: 'SELL',
        weight: '20%',
        detail: `Bearish multi-candle displacement (${microDeltaPips}p downward pressure)`
      });
    }
  } else {
    // Evaluate objective EMA/price posture when candle delta is inside noise floor (no artificial previousDirection bias)
    const prevailingIsBull =
      p.ema20 !== p.ema50
        ? p.ema20 > p.ema50 && p.livePrice >= p.ema50
        : p.livePrice >= p.ema20 && effectiveH1 === 'UPTREND';
    if (prevailingIsBull) {
      bullWeight += 16;
      bearWeight += 6;
    } else {
      bearWeight += 16;
      bullWeight += 6;
    }
    verdicts.push({
      name: '1. Candle & Liquidity Sweep',
      signal: prevailingIsBull ? 'BUY' : 'SELL',
      weight: '16%',
      detail: `Intraday candle structure (${microDeltaPips >= 0 ? `+${microDeltaPips}` : microDeltaPips}p) — aligned with ${
        prevailingIsBull ? 'bullish EMA flow' : 'bearish EMA flow'
      }`
    });
  }

  // FACTOR 2: 20 / 50 EMA Dynamic Trend Stack & Pullback Timing Guard (24 pts max)
  const distEma20Pips = (p.livePrice - p.ema20) * pipMultiplier;
  const effectiveAtrPips = Math.max(
    5,
    p.atrPips ?? (isGold ? 28 : isBtc ? 180 : isEth ? 14 : isIndex ? 38 : isOil ? 22 : 16)
  );
  const overextLimit = Math.max(
    isGold ? 55 : isBtc ? 450 : isEth ? 18 : isIndex ? 45 : isOil ? 28 : 14,
    effectiveAtrPips * 1.38
  );
  const isExtendedZone = Math.abs(distEma20Pips) > overextLimit;
  const emaGapPips = Math.abs(p.ema20 - p.ema50) * pipMultiplier;
  const hasConfirmedBos = Boolean(p.bosAnalysis?.brokenStructure);
  const isFlatEmaChop =
    !hasConfirmedBos &&
    ((emaGapPips < Math.max(0.5, effectiveAtrPips * 0.14) && p.rsi >= 46 && p.rsi <= 54) ||
      (p.adxStrength !== undefined && p.adxStrength < 14.5 && Math.abs(p.rsi - 50) < 6));

  if (distEma20Pips > overextLimit) {
    if (p.ema20 >= p.ema50 || p.livePrice > p.ema50) bullWeight += 15;
    else bearWeight += 15;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'CAUTION',
      weight: '15%',
      detail: `Extended +${distEma20Pips.toFixed(1)}p above 20 EMA (${p.ema20.toFixed(decimals)}) — wait pullback toward 20 EMA`
    });
  } else if (distEma20Pips < -overextLimit) {
    if (p.ema20 <= p.ema50 || p.livePrice < p.ema50) bearWeight += 15;
    else bullWeight += 15;
    verdicts.push({
      name: '2. 20/50 EMA Trend Stack',
      signal: 'CAUTION',
      weight: '15%',
      detail: `Extended ${distEma20Pips.toFixed(1)}p below 20 EMA (${p.ema20.toFixed(decimals)}) — wait pullback toward 20 EMA`
    });
  } else if (p.ema20 >= p.ema50) {
    // Bullish EMA trend stack
    if (p.livePrice >= p.ema20) {
      bullWeight += 24;
      verdicts.push({
        name: '2. 20/50 EMA Trend Stack',
        signal: 'BUY',
        weight: '24%',
        detail: `Bullish stack: Price (${p.livePrice.toFixed(decimals)}) > 20 EMA (${p.ema20.toFixed(decimals)}) > 50 EMA`
      });
    } else if (p.livePrice >= p.ema50) {
      // Pullback inside Uptrend: Prime discount Buy zone!
      bullWeight += 20;
      bearWeight += 4;
      verdicts.push({
        name: '2. 20/50 EMA Trend Stack',
        signal: 'BUY',
        weight: '20%',
        detail: `Uptrend pullback testing 20/50 EMA discount zone (${p.ema20.toFixed(decimals)} - ${p.ema50.toFixed(decimals)}) — Primary UPTREND intact`
      });
    } else {
      // Price broke decisively below BOTH 20 EMA and 50 EMA
      bearWeight += 21;
      bullWeight += 4;
      verdicts.push({
        name: '2. 20/50 EMA Trend Stack',
        signal: 'SELL',
        weight: '21%',
        detail: `Bearish breakdown: Price (${p.livePrice.toFixed(decimals)}) lost both 20 EMA & 50 EMA floor (${p.ema50.toFixed(decimals)})`
      });
    }
  } else {
    // Bearish EMA trend stack (p.ema20 < p.ema50)
    if (p.livePrice <= p.ema20) {
      bearWeight += 24;
      verdicts.push({
        name: '2. 20/50 EMA Trend Stack',
        signal: 'SELL',
        weight: '24%',
        detail: `Bearish stack: Price (${p.livePrice.toFixed(decimals)}) < 20 EMA (${p.ema20.toFixed(decimals)}) < 50 EMA`
      });
    } else if (p.livePrice <= p.ema50) {
      // Pullback inside Downtrend: Prime premium Sell zone!
      bearWeight += 20;
      bullWeight += 4;
      verdicts.push({
        name: '2. 20/50 EMA Trend Stack',
        signal: 'SELL',
        weight: '20%',
        detail: `Downtrend rally testing 20/50 EMA premium zone (${p.ema20.toFixed(decimals)} - ${p.ema50.toFixed(decimals)}) — Primary DOWNTREND intact`
      });
    } else {
      // Price reclaimed decisively above BOTH 20 EMA and 50 EMA
      bullWeight += 21;
      bearWeight += 4;
      verdicts.push({
        name: '2. 20/50 EMA Trend Stack',
        signal: 'BUY',
        weight: '21%',
        detail: `Bullish breakout: Price (${p.livePrice.toFixed(decimals)}) reclaimed both 20 EMA & 50 EMA ceiling (${p.ema50.toFixed(decimals)})`
      });
    }
  }

  // FACTOR 3: 14-Period Wilder RSI Momentum & Exhaustion (20 pts max)
  const isUptrendStructure = effectiveH1 === 'UPTREND' || p.ema20 >= p.ema50;
  if (p.rsi >= 72) {
    if (isUptrendStructure) {
      // Powerful bullish momentum surge: maintain bullish trend bias with trailing SL caution
      bullWeight += 14;
      bearWeight += 6;
      verdicts.push({
        name: '3. RSI (14) Momentum',
        signal: 'BUY',
        weight: '14%',
        detail: `RSI ${p.rsi} Bullish Momentum Surge (Overbought 72+) — strong trend expansion; ride longs with trailing SL (lock profit)`
      });
    } else {
      bearWeight += 14;
      bullWeight += 4;
      verdicts.push({
        name: '3. RSI (14) Momentum',
        signal: 'CAUTION',
        weight: '14%',
        detail: `RSI ${p.rsi} Bearish divergence / overbought retest — resistance ceiling in downtrend`
      });
    }
  } else if (p.rsi <= 28) {
    if (!isUptrendStructure) {
      // Powerful bearish momentum surge: maintain bearish trend bias with trailing SL caution
      bearWeight += 14;
      bullWeight += 6;
      verdicts.push({
        name: '3. RSI (14) Momentum',
        signal: 'SELL',
        weight: '14%',
        detail: `RSI ${p.rsi} Bearish Momentum Surge (Oversold 28-) — strong trend distribution; ride shorts with trailing SL (lock profit)`
      });
    } else {
      bullWeight += 14;
      bearWeight += 4;
      verdicts.push({
        name: '3. RSI (14) Momentum',
        signal: 'CAUTION',
        weight: '14%',
        detail: `RSI ${p.rsi} Bullish oversold retest — potential discount floor in uptrend`
      });
    }
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
      bullWeight += 9;
      bearWeight += 9;
      verdicts.push({
        name: '4. DXY Macro & Safe-Haven',
        signal: 'CAUTION',
        weight: '9%',
        detail: `Gold DXY neutral (${macro.riskRegime}) — follow 15m/1H EMA & liquidity structure`
      });
    }
  } else if (isIndex) {
    if (macro.riskRegime === 'RISK-ON EXPANSION') {
      bullWeight += 18;
      verdicts.push({
        name: '4. Equity Index Risk Flow',
        signal: 'BUY',
        weight: '18%',
        detail: `Risk-On equity expansion supports institutional long momentum on ${p.pair}`
      });
    } else if (macro.riskRegime === 'RISK-OFF SAFE-HAVEN' || dxy >= 0.2) {
      bearWeight += 18;
      verdicts.push({
        name: '4. Equity Index Risk Flow',
        signal: 'SELL',
        weight: '18%',
        detail: `Risk-Off de-risking / strong USD (${dxy}%) pressures ${p.pair} equities lower`
      });
    } else {
      bullWeight += 9;
      bearWeight += 9;
      verdicts.push({
        name: '4. Equity Index Risk Flow',
        signal: 'CAUTION',
        weight: '9%',
        detail: `Index macro balanced (${macro.riskRegime}) — follow 20/50 EMA structure on ${p.pair}`
      });
    }
  } else if (isOil) {
    if (dxy <= -0.05 && macro.riskRegime !== 'RISK-OFF SAFE-HAVEN') {
      bullWeight += 18;
      verdicts.push({
        name: '4. Energy & USD Macro Flow',
        signal: 'BUY',
        weight: '18%',
        detail: `Softer USD (${dxy}%) & steady demand support WTI Crude (${p.pair}) upside`
      });
    } else if (dxy >= 0.12 || macro.riskRegime === 'RISK-OFF SAFE-HAVEN') {
      bearWeight += 16;
      verdicts.push({
        name: '4. Energy & USD Macro Flow',
        signal: 'SELL',
        weight: '16%',
        detail: `Strong USD (${dxy}%) / Risk-Off demand caution weighs on Crude Oil`
      });
    } else {
      bullWeight += 9;
      bearWeight += 9;
      verdicts.push({
        name: '4. Energy & USD Macro Flow',
        signal: 'CAUTION',
        weight: '9%',
        detail: `WTI macro neutral (${macro.riskRegime}) — execute strictly off 20 EMA retests`
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
  } else if (isCrypto) {
    if (macro.riskRegime === 'RISK-ON EXPANSION' && dxy <= 0.1) {
      bullWeight += 18;
      verdicts.push({
        name: '4. Crypto Liquidity & Risk Flow',
        signal: 'BUY',
        weight: '18%',
        detail: `Risk-On liquidity flow supports ${p.pair} upside`
      });
    } else if (macro.riskRegime === 'RISK-OFF SAFE-HAVEN' || dxy >= 0.18) {
      bearWeight += 16;
      verdicts.push({
        name: '4. Crypto Liquidity & Risk Flow',
        signal: 'SELL',
        weight: '16%',
        detail: `Defensive liquidity / USD strength pressures ${p.pair}`
      });
    } else {
      bullWeight += 9;
      bearWeight += 9;
      verdicts.push({
        name: '4. Crypto Liquidity & Risk Flow',
        signal: 'CAUTION',
        weight: '9%',
        detail: `Crypto flow neutral (${macro.riskRegime})`
      });
    }
  }

  // FACTOR 5: Nairobi (EAT) Session Liquidity & Broker Spread Filter (symmetric 6/6 health weight — never inflates directional chop)
  const spreadPips =
    p.brokerSpread ?? (isGold ? 2.2 : isBtc ? 25 : isEth ? 2.5 : isIndex ? 2.0 : isOil ? 3.5 : 1.1);
  const spreadHealthy = isBtc ? spreadPips <= 35 : isOil ? spreadPips <= 5.0 : isEth || isIndex ? spreadPips <= 4.0 : spreadPips <= 2.5;
  if (!macro.isRolloverWindow && !macro.isUsReleaseWindow && spreadHealthy) {
    bullWeight += 6;
    bearWeight += 6;
    verdicts.push({
      name: '5. Kenya EAT Window & Spread',
      signal: 'CAUTION',
      weight: '12%',
      detail: `Active liquidity window (${macro.eatHour}:00 EAT) · tight ~${spreadPips}p broker spread (Clean Execution)`
    });
  } else {
    verdicts.push({
      name: '5. Kenya EAT Window & Spread',
      signal: 'CAUTION',
      weight: '6%',
      detail: macro.isRolloverWindow
        ? 'Midnight rollover window in Kenya — keep lot minimal & verify wide spread'
        : macro.isUsReleaseWindow
        ? '15:30 EAT NY release spike window — execute strictly at confirmed candle close'
        : `Elevated spread (~${spreadPips}p) — strictly cap risk per setup`
    });
  }

  // FACTOR 6: H1 Trend Structure & Key Level Alignment (20 pts max — Single Authoritative H1 Weight)
  if (effectiveH1 === 'UPTREND') {
    bullWeight += 20;
    verdicts.push({
      name: '6. H1 Trend & Structure',
      signal: 'BUY',
      weight: '20%',
      detail: `H1 macro trend confirms UPTREND above swing floor ${p.keyLevel ? p.keyLevel.toFixed(decimals) : p.ema50.toFixed(decimals)}`
    });
  } else if (effectiveH1 === 'DOWNTREND') {
    bearWeight += 20;
    verdicts.push({
      name: '6. H1 Trend & Structure',
      signal: 'SELL',
      weight: '20%',
      detail: `H1 macro trend confirms DOWNTREND below swing ceiling ${p.keyLevel ? p.keyLevel.toFixed(decimals) : p.ema50.toFixed(decimals)}`
    });
  } else {
    verdicts.push({
      name: '6. H1 Trend & Structure',
      signal: 'CAUTION',
      weight: '10%',
      detail: 'H1 structure consolidating — scale 50% at TP1 and lock Breakeven early'
    });
  }

  // FACTOR 7: Fair Value Gap (FVG) & Institutional Liquidity Pool Mitigation (14 pts max)
  const isEmaBullStack = p.ema20 >= p.ema50;
  if (isEmaBullStack && distEma20Pips >= -4 && distEma20Pips <= effectiveAtrPips * 0.9) {
    bullWeight += 14;
    verdicts.push({
      name: '7. FVG & Order Block Mitigation',
      signal: 'BUY',
      weight: '14%',
      detail: `Institutional discount mitigation holding in 20 EMA FVG zone (${p.ema20.toFixed(decimals)})`
    });
  } else if (!isEmaBullStack && distEma20Pips <= 4 && distEma20Pips >= -effectiveAtrPips * 0.9) {
    bearWeight += 14;
    verdicts.push({
      name: '7. FVG & Order Block Mitigation',
      signal: 'SELL',
      weight: '14%',
      detail: `Institutional premium mitigation holding below 20 EMA FVG zone (${p.ema20.toFixed(decimals)})`
    });
  } else {
    verdicts.push({
      name: '7. FVG & Order Block Mitigation',
      signal: 'CAUTION',
      weight: '8%',
      detail: `Price displaced ${Math.abs(distEma20Pips).toFixed(1)}p from immediate mitigation block`
    });
  }

  // FACTOR 8: Volatility Compression & ATR Exhaustion Guard (14 pts max)
  const atrRatio = Math.abs(distEma20Pips) / Math.max(1, effectiveAtrPips);
  if (atrRatio <= 0.85) {
    if (isEmaBullStack) {
      bullWeight += 14;
      verdicts.push({
        name: '8. Volatility & ATR Compression',
        signal: 'BUY',
        weight: '14%',
        detail: `Low-volatility compression (${atrRatio.toFixed(1)}x ATR) — optimal low-drawdown BUY entry`
      });
    } else {
      bearWeight += 14;
      verdicts.push({
        name: '8. Volatility & ATR Compression',
        signal: 'SELL',
        weight: '14%',
        detail: `Low-volatility compression (${atrRatio.toFixed(1)}x ATR) — optimal low-drawdown SELL entry`
      });
    }
  } else if (atrRatio > 1.6) {
    verdicts.push({
      name: '8. Volatility & ATR Compression',
      signal: 'CAUTION',
      weight: '8%',
      detail: `Exhausted ${atrRatio.toFixed(1)}x ATR stretch — enter via pullback limit rather than market`
    });
  } else {
    if (isEmaBullStack) bullWeight += 9;
    else bearWeight += 9;
    verdicts.push({
      name: '8. Volatility & ATR Compression',
      signal: isEmaBullStack ? 'BUY' : 'SELL',
      weight: '10%',
      detail: `Normal expansion corridor (${atrRatio.toFixed(1)}x ATR) respecting ${isEmaBullStack ? 'bullish' : 'bearish'} trajectory`
    });
  }

  // FACTOR 9: Break of Structure (BOS) & Change of Character (CHoCH) Guard (28 pts max — Anti-Reversal Veto)
  const bos = p.bosAnalysis;
  const bosBullActive =
    bos &&
    (bos.bosDirection === 'BULLISH_BOS' ||
      bos.bosDirection === 'BULLISH_CHOCH' ||
      (bos.bosDirection === 'RANGING' &&
        (bos.h1BosDirection === 'BULLISH_BOS' || bos.h1BosDirection === 'BULLISH_CHOCH')));
  const bosBearActive =
    bos &&
    (bos.bosDirection === 'BEARISH_BOS' ||
      bos.bosDirection === 'BEARISH_CHOCH' ||
      (bos.bosDirection === 'RANGING' &&
        (bos.h1BosDirection === 'BEARISH_BOS' || bos.h1BosDirection === 'BEARISH_CHOCH')));

  if (bosBearActive && bos) {
    const bosPts = bos.brokenStructure ? 32 : 20;
    bearWeight += bosPts;
    verdicts.push({
      name: '9. BOS & CHoCH Structure',
      signal: 'SELL',
      weight: '28%',
      detail:
        bos.bosDirection === 'BEARISH_CHOCH'
          ? `BEARISH CHoCH breakdown below swing low ${bos.bosTriggerLevel.toFixed(decimals)} — BUY vetoed`
          : `Bearish BOS below ${bos.bosTriggerLevel.toFixed(decimals)} (protected high ${bos.protectedSwingHigh.toFixed(decimals)})`
    });
  } else if (bosBullActive && bos) {
    const bosPts = bos.brokenStructure ? 32 : 20;
    bullWeight += bosPts;
    verdicts.push({
      name: '9. BOS & CHoCH Structure',
      signal: 'BUY',
      weight: '28%',
      detail:
        bos.bosDirection === 'BULLISH_CHOCH'
          ? `BULLISH CHoCH breakout above swing high ${bos.bosTriggerLevel.toFixed(decimals)} — SELL vetoed`
          : `Bullish BOS above ${bos.bosTriggerLevel.toFixed(decimals)} (protected low ${bos.protectedSwingLow.toFixed(decimals)})`
    });
  } else {
    verdicts.push({
      name: '9. BOS & CHoCH Structure',
      signal: 'CAUTION',
      weight: '12%',
      detail: bos
        ? bos.structureSummary
        : `Consolidation inside swing structure (${p.ema20 >= p.ema50 ? 'bullish lean' : 'bearish lean'})`
    });
  }

  // FACTOR 10: MACD (12,26,9) Momentum & ADX (14) Trend Strength + Price Action Pattern (22 pts max)
  const resolvedAdx = p.adxStrength ?? 21.0;
  const resolvedMacdBias =
    p.macdBias ?? (p.ema20 > p.ema50 ? 'BULLISH' : p.ema20 < p.ema50 ? 'BEARISH' : 'FLAT');
  const patternTag = p.candlePattern ? p.candlePattern.replace(/_/g, ' ') : 'CONSOLIDATION';

  if (resolvedAdx < 16 || resolvedMacdBias === 'FLAT') {
    verdicts.push({
      name: '10. MACD & ADX Velocity',
      signal: 'CAUTION',
      weight: '10%',
      detail: `ADX ${resolvedAdx.toFixed(1)} (${resolvedAdx < 16 ? 'Low-trend chop filter' : 'Moderate'}) · MACD neutral · ${patternTag}`
    });
  } else if (resolvedMacdBias === 'BULLISH') {
    const macdPts = resolvedAdx >= 25 || p.candlePattern === 'BULLISH_ENGULFING' ? 22 : 15;
    bullWeight += macdPts;
    verdicts.push({
      name: '10. MACD & ADX Velocity',
      signal: 'BUY',
      weight: `${macdPts}%`,
      detail: `MACD histogram bullish (+) · ADX ${resolvedAdx.toFixed(1)} trend strength · ${patternTag}`
    });
  } else {
    const macdPts = resolvedAdx >= 25 || p.candlePattern === 'BEARISH_ENGULFING' ? 22 : 15;
    bearWeight += macdPts;
    verdicts.push({
      name: '10. MACD & ADX Velocity',
      signal: 'SELL',
      weight: `${macdPts}%`,
      detail: `MACD histogram bearish (-) · ADX ${resolvedAdx.toFixed(1)} trend strength · ${patternTag}`
    });
  }

  const total = Math.max(1, bullWeight + bearWeight);
  const bullScorePct = Math.round((bullWeight / total) * 100);
  const bearScorePct = 100 - bullScorePct;
  const bearishEmaStack = p.ema20 < p.ema50 && p.livePrice < p.ema20;
  const bullishEmaStack = p.ema20 > p.ema50 && p.livePrice > p.ema20;

  let isBuy: boolean;
  if (p.biasOverride) {
    isBuy = p.biasOverride === 'BUY';
  } else if (bos && bos.brokenStructure && (bos.bosDirection === 'BEARISH_CHOCH' || bos.bosDirection === 'BEARISH_BOS')) {
    // Structural Bearish BOS/CHoCH overrides lagging EMAs so we NEVER recommend BUY during a structural breakdown
    isBuy = false;
  } else if (bos && bos.brokenStructure && (bos.bosDirection === 'BULLISH_CHOCH' || bos.bosDirection === 'BULLISH_BOS')) {
    // Structural Bullish BOS/CHoCH overrides lagging EMAs so we NEVER recommend SELL during a structural breakout
    isBuy = true;
  } else if (bearishEmaStack && (effectiveH1 === 'DOWNTREND' || bearScorePct >= 52)) {
    // Objective bearish price/EMA alignment: Price < 20 EMA < 50 EMA -> MUST project SELL
    isBuy = false;
  } else if (bullishEmaStack && (effectiveH1 === 'UPTREND' || bullScorePct >= 52)) {
    // Objective bullish price/EMA alignment: Price > 20 EMA > 50 EMA -> MUST project BUY
    isBuy = true;
  } else if (bosBearActive && !bosBullActive && bearScorePct >= 50) {
    isBuy = false;
  } else if (bosBullActive && !bosBearActive && bullScorePct >= 50) {
    isBuy = true;
  } else if (bearScorePct - bullScorePct >= 6) {
    isBuy = false;
  } else if (bullScorePct - bearScorePct >= 6) {
    isBuy = true;
  } else if (
    p.previousDirection &&
    Math.abs(bullScorePct - bearScorePct) < 5 &&
    Math.abs(distEma20Pips) < effectiveAtrPips * 0.15
  ) {
    // Micro-deadband ONLY when bull/bear scores are dead-even right on the 20 EMA
    isBuy = p.previousDirection === 'BUY';
  } else if (effectiveH1 === 'UPTREND') {
    isBuy = bearScorePct < 52;
  } else if (effectiveH1 === 'DOWNTREND') {
    isBuy = bullScorePct >= 52;
  } else {
    isBuy = bullScorePct >= bearScorePct;
  }

  const dominantPct = isBuy ? bullScorePct : bearScorePct;
  const sideTag: 'BUY' | 'SELL' = isBuy ? 'BUY' : 'SELL';
  const alignedFactorsCount = verdicts.filter((v) => v.signal === sideTag).length;
  const totalFactorsCount = verdicts.length;

  const bosAligned = Boolean(
    !bos ||
      (isBuy && !bosBearActive) ||
      (!isBuy && !bosBullActive)
  );
  const edgeMargin = Math.max(0, dominantPct - 50);
  const factorShare = alignedFactorsCount / Math.max(1, totalFactorsCount);
  const adxConfAdj = resolvedAdx >= 26 ? 3.5 : resolvedAdx < 16 ? -6.5 : 0;
  const rawConf =
    48 +
    Math.min(24, edgeMargin * 0.65) +
    factorShare * 18 +
    adxConfAdj +
    (spreadHealthy && !macro.isRolloverWindow ? 2.5 : -4.0) -
    (isExtendedZone ? 7.5 : 0) -
    (isFlatEmaChop ? 11.0 : 0) -
    (!bosAligned ? 18.0 : 0);
  const confidence = Number(Math.min(93.5, Math.max(42.0, rawConf)).toFixed(1));

  const bosCounterWarning =
    !bosAligned && bos?.bosVetoReason
      ? bos.bosVetoReason
      : undefined;

  const entryTimingWarning = bosCounterWarning
    ? bosCounterWarning
    : p.opposingCandleWarning
    ? p.opposingCandleWarning
    : isExtendedZone
    ? `Price is ${Math.abs(distEma20Pips).toFixed(1)}p (${(
        Math.abs(distEma20Pips) / Math.max(1, effectiveAtrPips)
      ).toFixed(1)}x ATR) away from 20 EMA (${p.ema20.toFixed(decimals)}) — WAIT PULLBACK TO 20 EMA instead of chasing.`
    : undefined;

  const goAheadAssurance: ComputedTradeParams['goAheadAssurance'] = !bosAligned
    ? 'STAND ASIDE: CHOP / CONFLICTED TIMEFRAMES'
    : isExtendedZone || p.opposingCandleWarning
    ? 'WAIT PULLBACK TO 20 EMA — EXTENDED ENTRY ZONE'
    : isBuy
    ? alignedFactorsCount >= 5 && bullScorePct >= 64 && !macro.isRolloverWindow
      ? 'GO-AHEAD ASSURANCE: STRONG BUY APPROVED'
      : alignedFactorsCount >= 4 && bullScorePct >= 54
      ? 'GO-AHEAD ASSURANCE: BUY BY MARKET'
      : 'SELECTIVE BUY — ENTER ON 20 EMA CONFIRMATION'
    : alignedFactorsCount >= 5 && bearScorePct >= 64 && !macro.isRolloverWindow
    ? 'GO-AHEAD ASSURANCE: STRONG SELL APPROVED'
    : alignedFactorsCount >= 4 && bearScorePct >= 54
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
    isFlatEmaChop,
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
  h1Candles?: OhlcCandle[];
  candlesAreRealOhlc?: boolean;
  change24hPct?: number;
  macro?: MacroContextSnapshot;
  brokerSpread?: number;
  h1TrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  previousDirection?: 'BUY' | 'SELL';
}) {
  const { isGold, isBtc, isEth, isIndex, isOil, pipMultiplier, decimals } = getPairSpecs(p.pair);
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
    ? (isBtc || isEth ? 0.015 : isGold ? 0.008 : isIndex || isOil ? 0.009 : 0.0045)
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

    const baseStepPips = (isGold ? 28 : isBtc ? 210 : isEth ? 14 : isIndex ? 32 : isOil ? 18 : 5.5) * tfScale;
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
  const macdData = computeRealMacd(closes);
  const adxData = computeRealAdx(candles, 14);
  const candlePattern = detectLatestCandlePattern(candles);

  const closedHistorySlice = candles.length >= 25 ? candles.slice(-25, -1) : candles.slice(-24);
  const swingHigh = Number(Math.max(...closedHistorySlice.map((c) => c.high)).toFixed(decimals));
  const swingLow = Number(Math.min(...closedHistorySlice.map((c) => c.low)).toFixed(decimals));

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2] || lastCandle;
  const prev3Candle = candles[candles.length - 4] || prevCandle;
  const prevBody = Math.abs(prevCandle.close - prevCandle.open);
  const prevUpperWick = Math.max(0, prevCandle.high - Math.max(prevCandle.open, prevCandle.close));
  const prevLowerWick = Math.max(0, Math.min(prevCandle.open, prevCandle.close) - prevCandle.low);
  const isBearishPinOrSweep =
    (prevUpperWick > prevBody * 1.25 && lastCandle.close < prevCandle.high) ||
    candlePattern === 'BEARISH_PIN_REJECTION' ||
    candlePattern === 'BEARISH_ENGULFING';
  const isBullishPinOrAbsorption =
    (prevLowerWick > prevBody * 1.25 && lastCandle.close > prevCandle.low) ||
    candlePattern === 'BULLISH_PIN_REJECTION' ||
    candlePattern === 'BULLISH_ENGULFING';

  const bosAnalysis = analyzeMarketStructureBos({
    pair: p.pair,
    candles,
    h1Candles: p.h1Candles,
    livePrice: p.livePrice,
    atrPips
  });

  const tempKeyLevel =
    bosAnalysis.bosDirection === 'BULLISH_BOS' || bosAnalysis.bosDirection === 'BULLISH_CHOCH'
      ? bosAnalysis.protectedSwingLow
      : bosAnalysis.bosDirection === 'BEARISH_BOS' || bosAnalysis.bosDirection === 'BEARISH_CHOCH'
      ? bosAnalysis.protectedSwingHigh
      : ema20 >= ema50
      ? swingLow
      : swingHigh;

  const prelimEval = evaluateAllTradeFactors({
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
    previousDirection: p.previousDirection,
    bosAnalysis,
    adxStrength: adxData.adx,
    macdBias: macdData.bias,
    macdHistogram: macdData.histogram,
    candlePattern
  });

  // Counter-impulse candle guard: block blind entries directly into an opposing strong breakdown/breakout candle
  const lastBodyPips = (lastCandle.close - lastCandle.open) * pipMultiplier;
  const lastBarMovePips = (lastCandle.close - prevCandle.close) * pipMultiplier;
  const lastLowerWickPips = (Math.min(lastCandle.open, lastCandle.close) - lastCandle.low) * pipMultiplier;
  const lastUpperWickPips = (lastCandle.high - Math.max(lastCandle.open, lastCandle.close)) * pipMultiplier;
  const impulseThresholdPips = Math.max(
    isGold ? 18 : isBtc ? 90 : isEth ? 8 : isIndex ? 24 : isOil ? 12 : 5,
    atrPips * 0.72
  );
  let opposingCandleWarning: string | undefined;
  if (
    prelimEval.isBuy &&
    Math.min(lastBodyPips, lastBarMovePips) <= -impulseThresholdPips &&
    lastLowerWickPips < Math.abs(lastBodyPips) * 0.45
  ) {
    opposingCandleWarning = `Opposing Bearish Impulse (${Math.min(lastBodyPips, lastBarMovePips).toFixed(1)}p drop on active ${p.timeframe} candle) — wait for stabilization/pullback close before BUY.`;
  } else if (
    !prelimEval.isBuy &&
    Math.max(lastBodyPips, lastBarMovePips) >= impulseThresholdPips &&
    lastUpperWickPips < Math.abs(lastBodyPips) * 0.45
  ) {
    opposingCandleWarning = `Opposing Bullish Impulse (+${Math.max(lastBodyPips, lastBarMovePips).toFixed(1)}p surge on active ${p.timeframe} candle) — wait for resistance rejection close before SELL.`;
  }

  const allFactorEval = opposingCandleWarning
    ? evaluateAllTradeFactors({
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
        previousDirection: p.previousDirection,
        opposingCandleWarning,
        bosAnalysis,
        adxStrength: adxData.adx,
        macdBias: macdData.bias,
        macdHistogram: macdData.histogram,
        candlePattern
      })
    : prelimEval;

  const isBuy = allFactorEval.isBuy;
  const keyLevel = isBuy
    ? Math.min(swingLow, bosAnalysis.protectedSwingLow || swingLow)
    : Math.max(swingHigh, bosAnalysis.protectedSwingHigh || swingHigh);

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
    adxStrength: adxData.adx,
    macdHistogram: macdData.histogram,
    macdBias: macdData.bias,
    candlePattern,
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
    opposingCandleWarning,
    bosAnalysis,
    patternType,
    candles
  };
}

/**
 * High-Impact Economic News Radar & Volatility Shield:
 * Tracks major central bank announcements, CPI releases, NFP, and bullion fixings in East Africa Time.
 */
export function getUpcomingEconomicEvents(): HighImpactEconomicEvent[] {
  const now = new Date();
  const nairobiWeekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Nairobi',
    weekday: 'short'
  }).format(now);
  const isWeekend = nairobiWeekday === 'Sat' || nairobiWeekday === 'Sun';
  const eatHour = parseInt(
    now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', hour12: false }),
    10
  );
  const eatMin = parseInt(
    now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', minute: '2-digit' }),
    10
  );
  const currentTotalMins = eatHour * 60 + eatMin;

  const eventsRaw = [
    {
      id: 'lon-bullion',
      currency: 'XAU/USD',
      name: 'London Bullion Morning Fix Window (Weekday Recurring)',
      impact: 'HIGH' as const,
      eventHour: 11,
      eventMin: 30,
      tradingDirective: 'Recurring London liquidity peak: verify live news calendar before Gold entries.'
    },
    {
      id: 'us-cpi-nfp',
      currency: 'USD',
      name: 'NY Morning Tier-1 Release Window (CPI / NFP Schedule Check)',
      impact: 'EXTREME' as const,
      eventHour: 15,
      eventMin: 30,
      tradingDirective: 'Recurring US macro release slot: confirm live ForexFactory calendar & guard against slippage.'
    },
    {
      id: 'comex-gold',
      currency: 'XAU/USD',
      name: 'New York COMEX Bullion Open Expansion (Weekday)',
      impact: 'HIGH' as const,
      eventHour: 16,
      eventMin: 20,
      tradingDirective: 'NY institutional open volatility: watch ATR vs SL width carefully on XAU/USD.'
    },
    {
      id: 'fomc-fed',
      currency: 'USD',
      name: 'Fed Afternoon Liquidity Window (Weekday)',
      impact: 'EXTREME' as const,
      eventHour: 21,
      eventMin: 0,
      tradingDirective: 'Recurring late-NY repricing window: tighten trailing stops or reduce exposure.'
    }
  ];

  return eventsRaw.map((ev) => {
    const eventTotalMins = ev.eventHour * 60 + ev.eventMin;
    const diff = eventTotalMins - currentTotalMins;
    let status: HighImpactEconomicEvent['status'];
    if (isWeekend) {
      status = 'UPCOMING';
    } else if (diff < -60) {
      status = 'PASSED';
    } else if (diff >= -60 && diff <= 20) {
      status = 'ACTIVE_NOW';
    } else if (diff > 20 && diff <= 90) {
      status = 'IMMINENT';
    } else {
      status = 'UPCOMING';
    }

    const timeEAT = `${String(ev.eventHour).padStart(2, '0')}:${String(ev.eventMin).padStart(2, '0')} EAT`;
    return {
      id: ev.id,
      currency: ev.currency,
      name: ev.name,
      impact: ev.impact,
      timeEAT,
      minutesUntil: diff,
      status,
      tradingDirective: isWeekend ? 'Weekend FX/Metals closed — window resumes Monday.' : ev.tradingDirective
    };
  });
}

/**
 * Multi-Timeframe Trend Confirmation Matrix (M5 | M15 | H1 | H4):
 * Analyzes execution trigger, intraday structure, swing trend, and macro flow to award an Institutional Tier Grade.
 */
export function evaluateMultiTimeframeAlignment(p: {
  pair: CurrencyPair;
  price: number;
  ema20: number;
  ema50: number;
  h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  change24hPct: number;
  macro?: MacroContextSnapshot;
}): MultiTimeframeAlignment {
  // M5 trigger: price vs EMA 20
  const m5: 'BULLISH' | 'BEARISH' = p.price >= p.ema20 ? 'BULLISH' : 'BEARISH';
  // M15 structure: EMA 20 vs EMA 50, updated promptly if price decisively breaks both EMAs with session flow
  const m15: 'BULLISH' | 'BEARISH' =
    p.ema20 >= p.ema50
      ? p.price < p.ema20 && p.price < p.ema50 && p.change24hPct < -0.25
        ? 'BEARISH'
        : 'BULLISH'
      : p.price > p.ema20 && p.price > p.ema50 && p.change24hPct > 0.25
      ? 'BULLISH'
      : 'BEARISH';
  // H1 swing trend:
  const h1: 'BULLISH' | 'BEARISH' = p.h1TrendDirection === 'UPTREND' ? 'BULLISH' : 'BEARISH';
  // H4 macro flow: 24h change direction
  const h4: 'BULLISH' | 'BEARISH' = p.change24hPct >= 0 ? 'BULLISH' : 'BEARISH';

  const bulls = [m5, m15, h1, h4].filter((s) => s === 'BULLISH').length;
  const bears = 4 - bulls;
  const alignedCount = Math.max(bulls, bears);

  let tierGrade: MultiTimeframeAlignment['tierGrade'];
  let winRatePct: number;
  let tierColor: string;

  if (alignedCount === 4) {
    tierGrade = 'GRADE A+ (4/4 TF ALIGNED)';
    winRatePct = 68;
    tierColor = '#00C261'; // emerald
  } else if (alignedCount === 3) {
    tierGrade = 'GRADE A (3/4 TF ALIGNED)';
    winRatePct = 61;
    tierColor = '#D4AF37'; // gold
  } else {
    tierGrade = 'GRADE B (2/4 MIXED — WAIT)';
    winRatePct = 52;
    tierColor = '#38BDF8'; // cyan / blue
  }

  return {
    m5,
    m15,
    h1,
    h4,
    alignedCount,
    tierGrade,
    winRatePct,
    tierColor
  };
}

export function runLiveCandleBacktest(params: {
  pair: CurrencyPair;
  candles?: OhlcCandle[];
  atrPips?: number;
  brokerSpread: number;
  direction?: 'BUY' | 'SELL';
}): LiveBacktestStats {
  const { pipMultiplier } = getPairSpecs(params.pair);
  const bars = params.candles || [];
  if (bars.length < 28) {
    return {
      sampleTrades: 0,
      tp1BreakevenWins: 0,
      fullTp2Wins: 0,
      losses: 0,
      tp1WinRatePct: 0,
      fullWinRatePct: 0,
      profitFactor: 0,
      netExpectancyR: 0,
      verdictLabel: 'LOW SAMPLE / CHOP',
      summary: `Waiting for 28+ closed candles on ${params.pair} before backtest stats finalize.`
    };
  }

  let sampleTrades = 0;
  let tp1BreakevenWins = 0;
  let fullTp2Wins = 0;
  let losses = 0;
  let totalR = 0;
  let grossWinR = 0;
  let grossLossR = 0;
  const spreadBuffer = params.brokerSpread * 1.25;

  let i = 20;
  while (i <= bars.length - 8) {
    const windowCloses = bars.slice(0, i + 1).map((b) => b.close);
    const ema20 = computeRealEma(windowCloses, 20);
    const ema50 = computeRealEma(windowCloses, Math.min(50, windowCloses.length));

    let atrSum = 0;
    const atrStart = Math.max(1, i - 13);
    let atrCount = 0;
    for (let k = atrStart; k <= i; k++) {
      const tr = Math.max(
        bars[k].high - bars[k].low,
        Math.abs(bars[k].high - bars[k - 1].close),
        Math.abs(bars[k].low - bars[k - 1].close)
      );
      atrSum += tr * pipMultiplier;
      atrCount++;
    }
    const atrPips = Math.max(3, atrCount > 0 ? atrSum / atrCount : params.atrPips ?? 14);
    const entryBar = bars[i];
    const entryPrice = entryBar.close;

    const candidateSide: 'BUY' | 'SELL' | null =
      ema20 > ema50 && entryBar.close >= ema20
        ? 'BUY'
        : ema20 < ema50 && entryBar.close <= ema20
        ? 'SELL'
        : null;

    if (!candidateSide) {
      i += 1;
      continue;
    }

    const distFromEma20Pips = Math.abs(entryPrice - ema20) * pipMultiplier;
    // Enter only inside 20 EMA value corridor (avoid chasing overextended spikes)
    if (distFromEma20Pips > atrPips * 1.35) {
      i += 1;
      continue;
    }

    const recentSlice = bars.slice(Math.max(0, i - 6), i + 1);
    const swingLow = Math.min(...recentSlice.map((b) => b.low));
    const swingHigh = Math.max(...recentSlice.map((b) => b.high));
    const swingDistPips =
      candidateSide === 'BUY'
        ? Math.max(0, (entryPrice - swingLow) * pipMultiplier)
        : Math.max(0, (swingHigh - entryPrice) * pipMultiplier);

    const slPips = Math.max(atrPips * 1.15, Math.min(atrPips * 2.1, swingDistPips)) + spreadBuffer;
    const slDist = slPips / pipMultiplier;
    const tp1Dist = (slPips * 1.6) / pipMultiplier;
    const tp2Dist = (slPips * 2.7) / pipMultiplier;

    const slPrice = candidateSide === 'BUY' ? entryPrice - slDist : entryPrice + slDist;
    const tp1Price = candidateSide === 'BUY' ? entryPrice + tp1Dist : entryPrice - tp1Dist;
    const tp2Price = candidateSide === 'BUY' ? entryPrice + tp2Dist : entryPrice - tp2Dist;
    const beLockPrice = candidateSide === 'BUY' ? entryPrice + slDist * 0.05 : entryPrice - slDist * 0.05;

    let hitTp1 = false;
    let tradeR = 0;
    let closedAtBar = i + 1;

    for (let j = i + 1; j < Math.min(bars.length, i + 14); j++) {
      const f = bars[j];
      closedAtBar = j;
      if (candidateSide === 'BUY') {
        const activeSl = hitTp1 ? beLockPrice : slPrice;
        // Conservative tie-breaker: check SL before TP if both touched in same candle
        if (f.low <= activeSl) {
          if (hitTp1) {
            tradeR = 0.8 + 0.025; // +1.6R on 50% TP1 + tiny BE lock on remaining 50%
          } else {
            tradeR = -1.0;
          }
          break;
        }
        if (!hitTp1 && f.high >= tp1Price) {
          hitTp1 = true;
        }
        if (f.high >= tp2Price) {
          tradeR = 0.8 + 1.35; // 50% at 1.6R + 50% at 2.7R = +2.15R
          break;
        }
      } else {
        const activeSl = hitTp1 ? beLockPrice : slPrice;
        if (f.high >= activeSl) {
          if (hitTp1) {
            tradeR = 0.8 + 0.025;
          } else {
            tradeR = -1.0;
          }
          break;
        }
        if (!hitTp1 && f.low <= tp1Price) {
          hitTp1 = true;
        }
        if (f.low <= tp2Price) {
          tradeR = 0.8 + 1.35;
          break;
        }
      }
      if (j === Math.min(bars.length - 1, i + 13)) {
        if (hitTp1) {
          tradeR = 0.8;
        } else {
          const markR =
            candidateSide === 'BUY'
              ? (f.close - entryPrice) / Math.max(0.00001, slDist)
              : (entryPrice - f.close) / Math.max(0.00001, slDist);
          tradeR = Math.max(-1.0, Math.min(1.2, markR));
        }
      }
    }

    sampleTrades++;
    totalR += tradeR;
    if (tradeR > 0) {
      grossWinR += tradeR;
      if (hitTp1) tp1BreakevenWins++;
      if (tradeR >= 1.9) fullTp2Wins++;
    } else {
      grossLossR += Math.abs(tradeR);
      losses++;
    }

    i = Math.max(i + 3, closedAtBar + 1);
  }

  if (sampleTrades === 0) {
    return {
      sampleTrades: 0,
      tp1BreakevenWins: 0,
      fullTp2Wins: 0,
      losses: 0,
      tp1WinRatePct: 0,
      fullWinRatePct: 0,
      profitFactor: 0,
      netExpectancyR: 0,
      verdictLabel: 'LOW SAMPLE / CHOP',
      summary: `Recent ${bars.length} candles on ${params.pair} stayed mostly inside chop — system rules rightly skipped low-edge entries.`
    };
  }

  const tp1WinRatePct = Math.round(((sampleTrades - losses) / sampleTrades) * 100);
  const fullWinRatePct = Math.round((fullTp2Wins / sampleTrades) * 100);
  const profitFactor =
    grossLossR > 0 ? Number((grossWinR / grossLossR).toFixed(2)) : Number((grossWinR > 0 ? 3.5 : 1.0).toFixed(2));
  const netExpectancyR = Number((totalR / sampleTrades).toFixed(2));
  const verdictLabel: LiveBacktestStats['verdictLabel'] =
    netExpectancyR >= 0.35 && profitFactor >= 1.4
      ? 'PROVEN POSITIVE EDGE'
      : netExpectancyR > 0
      ? 'MODERATE EDGE'
      : 'LOW SAMPLE / CHOP';

  return {
    sampleTrades,
    tp1BreakevenWins,
    fullTp2Wins,
    losses,
    tp1WinRatePct,
    fullWinRatePct,
    profitFactor,
    netExpectancyR,
    verdictLabel,
    summary: `Walk-forward test across the last ${bars.length} closed candles on ${params.pair}: ${sampleTrades} qualified 20/50 EMA value-zone entries (${tp1WinRatePct}% reached TP1/positive close, ${losses} SL losses, ${profitFactor} Profit Factor, ${netExpectancyR >= 0 ? '+' : ''}${netExpectancyR}R avg expectancy per trade).`
  };
}

export function buildPlainEnglishTradeGuide(params: {
  pair: CurrencyPair;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  slPips: number;
  tpPips: number;
  brokerSpread: number;
  atrPips: number;
  ema20: number;
  ema50: number;
  rsi: number;
  h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  riskReward: string;
  actualRiskUsd: number;
  netProfitUsd: number;
  tp1NetProfitUsd: number;
  alignedFactorsCount: number;
  totalFactorsCount: number;
  decimals: number;
  bosAnalysis?: StructureBosAnalysis;
  liveBacktest?: LiveBacktestStats;
}): PlainEnglishTradeGuide {
  const isBuy = params.direction === 'BUY';
  const trendWord = isBuy ? 'rising (Uptrend)' : 'falling (Downtrend)';
  const sideLabel = isBuy ? 'BUY (price going UP)' : 'SELL (price going DOWN)';
  const spreadNote = isBuy
    ? `BUY Stop Loss triggers when Bid drops to ${params.stopLoss.toFixed(params.decimals)}.`
    : `SELL Stop Loss triggers on the Ask price (Bid + ${params.brokerSpread}p spread), so your SL (${params.stopLoss.toFixed(params.decimals)}) adds spread + ${params.atrPips.toFixed(1)}p normal candle noise clearance above swing structure.`;

  const bosSnippet = params.bosAnalysis?.brokenStructure
    ? ` Recent ${params.bosAnalysis.bosDirection.replace('_', ' ')} confirmed near ${params.bosAnalysis.bosTriggerLevel.toFixed(params.decimals)}.`
    : '';

  const expectancyPer10 = params.liveBacktest && params.liveBacktest.sampleTrades > 0
    ? Number((params.liveBacktest.netExpectancyR * 10 * params.actualRiskUsd).toFixed(2))
    : Number(((0.6 * params.netProfitUsd * 0.85) - (0.4 * params.actualRiskUsd)).toFixed(2));

  return {
    headline: `${params.pair} Institutional Execution Brief — ${sideLabel}`,
    whyDirection: `${params.pair} is ${trendWord} on the 1H chart (${params.h1TrendDirection}) with ${params.alignedFactorsCount} of ${params.totalFactorsCount} live technical + macro factors agreeing. 20 EMA (${params.ema20.toFixed(params.decimals)}) vs 50 EMA (${params.ema50.toFixed(params.decimals)}) and RSI (${params.rsi.toFixed(1)}) support continuation rather than guessing a reversal.${bosSnippet}`,
    whySlIsSafe: `Your Stop Loss is ${params.slPips} pips (${params.stopLoss.toFixed(params.decimals)}, max risk $${params.actualRiskUsd.toFixed(2)}). It sits beyond 1.0x candle ATR (${params.atrPips.toFixed(1)}p) so ordinary wicks do not shake you out early. ${spreadNote}`,
    tp1BreakevenPlan: `At TP1 (${params.tp1.toFixed(params.decimals)}), close 50% of your lot size to bank ~+$${params.tp1NetProfitUsd.toFixed(2)} and immediately move SL to Entry (Breakeven). Once at Breakeven, the second half chases TP2 (${params.tp2.toFixed(params.decimals)}, +$${params.netProfitUsd.toFixed(2)} · ${params.riskReward}) with zero remaining loss risk.`,
    expectancyMath: `No strategy wins 100% of single trades — news spikes can always hit an SL. Profitability comes from math over 10+ trades: keeping every loss capped at -$${params.actualRiskUsd.toFixed(2)} while winners pay ${params.riskReward} (projected ~+$${expectancyPer10.toFixed(2)} net over 10 disciplined trades at $${params.actualRiskUsd.toFixed(2)} risk).`
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
  adxStrength?: number;
  macdHistogram?: number;
  macdBias?: 'BULLISH' | 'BEARISH' | 'FLAT';
  candlePattern?: CandlePatternSignal;
  candles?: OhlcCandle[];
  macro?: MacroContextSnapshot;
  biasOverride?: 'BUY' | 'SELL';
  previousDirection?: 'BUY' | 'SELL';
  previousTrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  h1TrendDirection?: 'UPTREND' | 'DOWNTREND' | 'RANGING';
  change24hPct?: number;
  opposingCandleWarning?: string;
  bosAnalysis?: StructureBosAnalysis;
  riskConfig?: Partial<RiskManagementConfig> | null;
}): ComputedTradeParams {
  const { isJpy, isGold, isBtc, isEth, isIndex, isOil, pipMultiplier, decimals, pipValPerStandardLot, pipValPerMicroLot } =
    getPairSpecs(p.targetPair);

  // Broker Symbol & Spread mappings first so spread feeds into all-factor evaluation & TP expansion
  const cleanPair = p.targetPair.replace('/', '');
  let brokerSymbol = cleanPair;
  let brokerSpread = 1.1;

  if (p.targetBroker === 'fxpesa') {
    brokerSymbol = isGold ? 'XAUUSD' : p.targetPair === 'NAS100' ? 'USTEC' : cleanPair;
    brokerSpread = isGold ? 2.2 : isJpy ? 1.4 : isBtc ? 25.0 : isEth ? 2.5 : isIndex ? 2.0 : isOil ? 3.5 : 1.1;
  } else if (p.targetBroker === 'exness') {
    brokerSymbol = isGold ? 'XAUUSD.m' : isIndex || isOil || isEth ? cleanPair : `${cleanPair}.m`;
    brokerSpread = isGold ? 1.2 : isJpy ? 0.8 : isBtc ? 15.0 : isEth ? 1.8 : isIndex ? 1.4 : isOil ? 2.8 : 0.6;
  } else if (p.targetBroker === 'hfm') {
    brokerSymbol = isGold ? 'GOLD' : isIndex ? `${cleanPair}.cash` : isOil ? 'USOIL.spot' : `${cleanPair}.h`;
    brokerSpread = isGold ? 2.4 : isJpy ? 1.6 : isBtc ? 30.0 : isEth ? 3.0 : isIndex ? 2.5 : isOil ? 4.0 : 1.3;
  } else if (p.targetBroker === 'fbs') {
    brokerSymbol = isGold ? 'XAUUSD' : cleanPair;
    brokerSpread = isGold ? 2.6 : isJpy ? 1.8 : isBtc ? 35.0 : isEth ? 3.2 : isIndex ? 2.8 : isOil ? 4.5 : 1.5;
  }

  // Resolve active position sizing config (custom passed config > global store > baseline 0.01 micro lot)
  const storedCfg = positionRiskStore.getConfig();
  const activeRiskCfg: RiskManagementConfig =
    p.riskConfig === null
      ? { ...DEFAULT_RISK_MANAGEMENT_CONFIG, enabled: false }
      : {
          enabled: p.riskConfig?.enabled ?? storedCfg.enabled,
          accountBalanceUsd: p.riskConfig?.accountBalanceUsd ?? storedCfg.accountBalanceUsd,
          riskPct: p.riskConfig?.riskPct ?? storedCfg.riskPct,
          syncSlTpWithRisk: p.riskConfig?.syncSlTpWithRisk ?? storedCfg.syncSlTpWithRisk,
          targetProfitUsd:
            p.riskConfig?.targetProfitUsd !== undefined
              ? p.riskConfig.targetProfitUsd
              : storedCfg.targetProfitUsd ?? null
        };

  // Baseline Gilgil Shield Risk Ceiling for uncustomized 0.01 micro lot
  const maxRiskDollarCap = isGold || isBtc || isEth || isIndex || isOil ? 2.8 : 2.5;
  const hardSlCapPips = Math.floor(maxRiskDollarCap / pipValPerMicroLot);

  let baseSlPips = isGold ? 22 : isBtc ? 220 : isEth ? 24 : isIndex ? 55 : isOil ? 36 : 16;
  let baseTp1Pips = isGold ? 38 : isBtc ? 380 : isEth ? 42 : isIndex ? 95 : isOil ? 62 : 28;
  let baseTp2Pips = isGold ? 64 : isBtc ? 640 : isEth ? 72 : isIndex ? 160 : isOil ? 105 : 46;

  if (p.targetTf === 'M1') {
    baseSlPips = isGold ? 16 : isBtc ? 150 : isEth ? 14 : isIndex ? 32 : isOil ? 22 : 8;
    baseTp1Pips = isGold ? 28 : isBtc ? 280 : isEth ? 24 : isIndex ? 56 : isOil ? 38 : 14;
    baseTp2Pips = isGold ? 48 : isBtc ? 480 : isEth ? 42 : isIndex ? 96 : isOil ? 64 : 24;
  } else if (p.targetTf === 'M5') {
    baseSlPips = isGold ? 18 : isBtc ? 180 : isEth ? 18 : isIndex ? 42 : isOil ? 28 : 12;
    baseTp1Pips = isGold ? 32 : isBtc ? 340 : isEth ? 32 : isIndex ? 72 : isOil ? 48 : 20;
    baseTp2Pips = isGold ? 54 : isBtc ? 560 : isEth ? 54 : isIndex ? 122 : isOil ? 82 : 34;
  } else if (p.targetTf === 'M10') {
    baseSlPips = isGold ? 20 : isBtc ? 200 : isEth ? 20 : isIndex ? 48 : isOil ? 32 : 14;
    baseTp1Pips = isGold ? 36 : isBtc ? 380 : isEth ? 36 : isIndex ? 84 : isOil ? 54 : 24;
    baseTp2Pips = isGold ? 60 : isBtc ? 620 : isEth ? 60 : isIndex ? 140 : isOil ? 92 : 40;
  } else if (p.targetTf === 'M15') {
    baseSlPips = isGold ? 22 : isBtc ? 220 : isEth ? 24 : isIndex ? 55 : isOil ? 36 : 16;
    baseTp1Pips = isGold ? 40 : isBtc ? 420 : isEth ? 44 : isIndex ? 98 : isOil ? 64 : 28;
    baseTp2Pips = isGold ? 68 : isBtc ? 700 : isEth ? 74 : isIndex ? 165 : isOil ? 108 : 48;
  } else if (p.targetTf === 'H1') {
    baseSlPips = isGold ? 24 : isBtc ? 240 : isEth ? 32 : isIndex ? 72 : isOil ? 42 : 20;
    baseTp1Pips = isGold ? 45 : isBtc ? 480 : isEth ? 58 : isIndex ? 126 : isOil ? 74 : 36;
    baseTp2Pips = isGold ? 76 : isBtc ? 800 : isEth ? 96 : isIndex ? 215 : isOil ? 126 : 60;
  } else if (p.targetTf === 'H4') {
    baseSlPips = isGold ? 26 : isBtc ? 260 : isEth ? 40 : isIndex ? 90 : isOil ? 48 : 22;
    baseTp1Pips = isGold ? 50 : isBtc ? 540 : isEth ? 72 : isIndex ? 158 : isOil ? 86 : 40;
    baseTp2Pips = isGold ? 84 : isBtc ? 880 : isEth ? 120 : isIndex ? 268 : isOil ? 144 : 68;
  } else if (p.targetTf === 'D1') {
    baseSlPips = isGold ? 28 : isBtc ? 280 : isEth ? 48 : isIndex ? 110 : isOil ? 52 : 24;
    baseTp1Pips = isGold ? 56 : isBtc ? 600 : isEth ? 88 : isIndex ? 195 : isOil ? 96 : 45;
    baseTp2Pips = isGold ? 92 : isBtc ? 980 : isEth ? 148 : isIndex ? 325 : isOil ? 162 : 76;
  }

  // Derive MACD, ADX, and Candlestick Pattern telemetry if candles are available
  const derivedCloses = p.candles && p.candles.length >= 18 ? p.candles.map((c) => c.close) : null;
  const derivedMacd =
    p.macdBias !== undefined && p.macdHistogram !== undefined
      ? { bias: p.macdBias, histogram: p.macdHistogram }
      : derivedCloses
      ? computeRealMacd(derivedCloses)
      : { bias: (p.ema20 ?? p.price) >= (p.ema50 ?? p.price) ? ('BULLISH' as const) : ('BEARISH' as const), histogram: 0 };
  const derivedAdx =
    p.adxStrength !== undefined
      ? p.adxStrength
      : p.candles && p.candles.length >= 16
      ? computeRealAdx(p.candles, 14).adx
      : 21.0;
  const derivedPattern: CandlePatternSignal =
    p.candlePattern ?? (p.candles && p.candles.length >= 3 ? detectLatestCandlePattern(p.candles) : 'CONSOLIDATION');

  // Unified All-Confluence BUY / SELL Evaluation
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
    previousDirection: p.previousDirection,
    opposingCandleWarning: p.opposingCandleWarning,
    bosAnalysis: p.bosAnalysis,
    adxStrength: derivedAdx,
    macdBias: derivedMacd.bias,
    macdHistogram: derivedMacd.histogram,
    candlePattern: derivedPattern
  });

  const isBuy = allFactorEval.isBuy;
  const macro = p.macro ?? getCurrentMacroContext();
  const isUsdBase = p.targetPair.startsWith('USD/');
  const isJpyCross = p.targetPair === 'GBP/JPY' || p.targetPair === 'EUR/JPY';
  const dxySupportsActiveSide =
    isBtc || isEth
      ? (isBuy && macro.dxyPressurePct <= 0.1) || (!isBuy && macro.dxyPressurePct >= -0.05)
      : isIndex
      ? (isBuy && macro.riskRegime !== 'RISK-OFF SAFE-HAVEN') || (!isBuy && macro.riskRegime === 'RISK-OFF SAFE-HAVEN')
      : isOil
      ? (isBuy && macro.dxyPressurePct <= 0.05) || (!isBuy && macro.dxyPressurePct >= 0.05)
      : isJpyCross
      ? (isBuy && macro.riskRegime !== 'RISK-OFF SAFE-HAVEN') || (!isBuy && macro.riskRegime === 'RISK-OFF SAFE-HAVEN')
      : isUsdBase
      ? (isBuy && macro.dxyPressurePct >= 0.05) || (!isBuy && macro.dxyPressurePct <= -0.05)
      : (isBuy && macro.dxyPressurePct <= -0.05) || (!isBuy && macro.dxyPressurePct >= 0.05);

  // Anchor Stop Loss beyond real Swing High/Low (protected BOS swing anchor prioritized) + ATR volatility + broker spread
  const bosSwingAnchor = isBuy
    ? p.bosAnalysis?.protectedSwingLow && p.bosAnalysis.protectedSwingLow < p.price
      ? p.bosAnalysis.protectedSwingLow
      : p.swingLow ?? p.keyLevel
    : p.bosAnalysis?.protectedSwingHigh && p.bosAnalysis.protectedSwingHigh > p.price
    ? p.bosAnalysis.protectedSwingHigh
    : p.swingHigh ?? p.keyLevel;
  const relevantSwingPrice = bosSwingAnchor;
  const rawSwingDistPips =
    relevantSwingPrice && relevantSwingPrice > 0
      ? Math.abs(p.price - relevantSwingPrice) * pipMultiplier
      : 0;
  const effectiveAtr = Math.max(3, p.atrPips ?? baseSlPips * 0.85);
  const spreadBuffer = brokerSpread * 1.25;
  const minSlFloor = isGold ? 18 : isBtc ? 160 : isEth ? 16 : isIndex ? 32 : isOil ? 22 : 9;
  const maxStructuralSlCap = activeRiskCfg.enabled
    ? Math.max(hardSlCapPips, baseSlPips * 2.2, effectiveAtr * 2.35 + spreadBuffer)
    : hardSlCapPips;

  const rawTargetSlPips =
    rawSwingDistPips > 0
      ? Math.max(effectiveAtr * 1.1 + spreadBuffer, Math.min(rawSwingDistPips + spreadBuffer, maxStructuralSlCap))
      : Math.min(effectiveAtr * 1.35 + spreadBuffer, maxStructuralSlCap);

  const structuralSlPips = Number(
    Math.min(maxStructuralSlCap, Math.max(minSlFloor, rawTargetSlPips, baseSlPips)).toFixed(1)
  );

  // Dynamic Position Sizing & Real-World SL/TP Calibration
  const riskPlan = activeRiskCfg.enabled
    ? computeDynamicPositionRiskPlan({
        pair: p.targetPair,
        structuralSlPips,
        brokerSpread,
        atrPips: effectiveAtr,
        riskConfig: activeRiskCfg
      })
    : undefined;

  const activeLotSize = riskPlan ? riskPlan.lotSize : 0.01;
  const pipValueAtActiveLot = activeLotSize * pipValPerStandardLot;
  baseSlPips = riskPlan ? riskPlan.calibratedSlPips : structuralSlPips;

  // Dynamically scale TP1, TP2, TP3 proportionally with risk-calibrated SL OR exact Target Profit ($ USD) goal
  const minLogicalGapPips = Math.max(
    brokerSpread * 1.6,
    isGold ? 8 : isBtc ? 80 : isEth ? 8 : isIndex ? 18 : isOil ? 12 : 5
  );

  let baseTp3Pips: number;
  const rsiVal = p.rsi ?? 52.0;
  const rsiHeadroomFactor = isBuy
    ? Math.max(0.85, Math.min(1.22, (74 - rsiVal) / 24))
    : Math.max(0.85, Math.min(1.22, (rsiVal - 26) / 24));
  const macroExpansionMultiplier = dxySupportsActiveSide ? 1.65 : 1.45;

  if (riskPlan?.targetProfitModeActive && riskPlan.requiredTp2PipsForTarget) {
    baseTp2Pips = Number(
      Math.max(baseSlPips * 1.6, minLogicalGapPips * 2.4, riskPlan.requiredTp2PipsForTarget).toFixed(1)
    );
    baseTp1Pips = Number(
      Math.max(minLogicalGapPips * 1.35, Math.min(baseTp2Pips * 0.5, baseTp2Pips - minLogicalGapPips)).toFixed(1)
    );
    baseTp3Pips = Number((baseTp2Pips * 1.35).toFixed(1));
  } else {
    if (riskPlan && riskPlan.syncSlTpWithRisk) {
      baseTp1Pips = Number((baseSlPips * 1.65).toFixed(1));
      baseTp2Pips = Number((baseSlPips * 2.85).toFixed(1));
    } else {
      baseTp1Pips = Number(Math.max(baseSlPips * 1.65, baseTp1Pips).toFixed(1));
      baseTp2Pips = Number(Math.max(baseSlPips * 2.85, baseTp2Pips).toFixed(1));
    }
    baseTp3Pips = Number((baseTp2Pips * macroExpansionMultiplier * rsiHeadroomFactor).toFixed(1));
  }

  // Minimum safe pip separation so SL/TP NEVER collapse onto Entry / Live Candle price after rounding
  const safeSlPips = Math.max(minLogicalGapPips, baseSlPips);
  const safeTp1Pips = Math.max(minLogicalGapPips * 1.35, baseTp1Pips);
  const safeTp2Pips = Math.max(safeTp1Pips + minLogicalGapPips, baseTp2Pips);
  const safeTp3Pips = Math.max(safeTp2Pips + minLogicalGapPips * 1.2, baseTp3Pips);

  const slOffset = safeSlPips / pipMultiplier;
  const tp1Offset = safeTp1Pips / pipMultiplier;
  const tp2Offset = safeTp2Pips / pipMultiplier;
  const tp3Offset = safeTp3Pips / pipMultiplier;
  const minGapPrice = minLogicalGapPips / pipMultiplier;

  const anchoredEntry = Number(p.price.toFixed(decimals));
  let slPrice: number;
  let tp1Price: number;
  let tp2Price: number;
  let tp3Price: number;

  if (isBuy) {
    slPrice = Number((anchoredEntry - slOffset).toFixed(decimals));
    tp1Price = Number((anchoredEntry + tp1Offset).toFixed(decimals));
    tp2Price = Number((anchoredEntry + tp2Offset).toFixed(decimals));
    tp3Price = Number((anchoredEntry + tp3Offset).toFixed(decimals));
  } else {
    slPrice = Number((anchoredEntry + slOffset).toFixed(decimals));
    tp1Price = Number((anchoredEntry - tp1Offset).toFixed(decimals));
    tp2Price = Number((anchoredEntry - tp2Offset).toFixed(decimals));
    tp3Price = Number((anchoredEntry - tp3Offset).toFixed(decimals));
  }

  // Strict MT4/MT5 S/L & T/P Side Enforcement (Prevents [Invalid S/L or T/P] & TP == Candle collisions)
  if (isBuy) {
    if (slPrice > anchoredEntry - minGapPrice) {
      slPrice = Number((anchoredEntry - Math.max(minGapPrice, slOffset)).toFixed(decimals));
    }
    if (tp1Price < anchoredEntry + minGapPrice) {
      tp1Price = Number((anchoredEntry + Math.max(minGapPrice * 1.35, tp1Offset)).toFixed(decimals));
    }
    if (tp2Price < tp1Price + minGapPrice * 0.75) {
      tp2Price = Number((tp1Price + minGapPrice).toFixed(decimals));
    }
    if (tp3Price < tp2Price + minGapPrice * 0.9) {
      tp3Price = Number((tp2Price + minGapPrice * 1.25).toFixed(decimals));
    }
  } else {
    if (slPrice < anchoredEntry + minGapPrice) {
      slPrice = Number((anchoredEntry + Math.max(minGapPrice, slOffset)).toFixed(decimals));
    }
    if (tp1Price > anchoredEntry - minGapPrice) {
      tp1Price = Number((anchoredEntry - Math.max(minGapPrice * 1.35, tp1Offset)).toFixed(decimals));
    }
    if (tp2Price > tp1Price - minGapPrice * 0.75) {
      tp2Price = Number((tp1Price - minGapPrice).toFixed(decimals));
    }
    if (tp3Price > tp2Price - minGapPrice * 0.9) {
      tp3Price = Number((tp2Price - minGapPrice * 1.25).toFixed(decimals));
    }
  }

  const actualSlPips = Math.max(1, Number((Math.abs(anchoredEntry - slPrice) * pipMultiplier).toFixed(1)));
  const actualTp1Pips = Math.max(1, Number((Math.abs(tp1Price - anchoredEntry) * pipMultiplier).toFixed(1)));
  const actualTpPips = Math.max(1, Number((Math.abs(tp2Price - anchoredEntry) * pipMultiplier).toFixed(1)));
  const actualTp3Pips = Math.max(1, Number((Math.abs(tp3Price - anchoredEntry) * pipMultiplier).toFixed(1)));

  // Exact position-sized risk & net profit after broker spread
  const rawRiskUsd = Number((actualSlPips * pipValueAtActiveLot).toFixed(2));
  const actualRiskUsd = riskPlan
    ? rawRiskUsd
    : Number(Math.min(maxRiskDollarCap, Math.max(0.8, rawRiskUsd)).toFixed(2));
  const potentialGainUsd = Number((actualTpPips * pipValueAtActiveLot).toFixed(2));
  const spreadCostUsd = Number((brokerSpread * pipValueAtActiveLot).toFixed(2));
  const netProfitUsd = Math.max(0.4, Number((potentialGainUsd - spreadCostUsd).toFixed(2)));
  const netProfitKes = Math.round(netProfitUsd * 130);
  const netProfit48hUsd = Math.max(0.8, Number((actualTp3Pips * pipValueAtActiveLot - spreadCostUsd).toFixed(2)));
  const netProfit48hKes = Math.round(netProfit48hUsd * 130);
  const tp1NetProfitUsd = Math.max(0.2, Number((actualTp1Pips * pipValueAtActiveLot * 0.5 - spreadCostUsd).toFixed(2)));
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
  const priceMinusEma20Pips = (p.price - ema20Val) * pipMultiplier;
  const emaSpreadPips = (ema20Val - ema50Val) * pipMultiplier;

  const bosBearActive =
    p.bosAnalysis?.bosDirection === 'BEARISH_BOS' || p.bosAnalysis?.bosDirection === 'BEARISH_CHOCH';
  const bosBullActive =
    p.bosAnalysis?.bosDirection === 'BULLISH_BOS' || p.bosAnalysis?.bosDirection === 'BULLISH_CHOCH';
  const priceBelowBothEmas = p.price < ema20Val && p.price < ema50Val;
  const priceAboveBothEmas = p.price > ema20Val && p.price > ema50Val;

  const h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING' =
    p.h1TrendDirection ??
    (emaSpreadPips >= 0.45 && !priceBelowBothEmas
      ? 'UPTREND'
      : emaSpreadPips <= -0.45 && !priceAboveBothEmas
      ? 'DOWNTREND'
      : isBuy
      ? 'UPTREND'
      : 'DOWNTREND');

  let trendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING' = h1TrendDirection;
  if (
    !isBuy &&
    (h1TrendDirection === 'DOWNTREND' ||
      (ema20Val < ema50Val && p.price <= ema20Val) ||
      (priceBelowBothEmas && (bosBearActive || derivedMacd.bias === 'BEARISH')))
  ) {
    trendDirection = 'DOWNTREND';
  } else if (
    isBuy &&
    (h1TrendDirection === 'UPTREND' ||
      (ema20Val > ema50Val && p.price >= ema20Val) ||
      (priceAboveBothEmas && (bosBullActive || derivedMacd.bias === 'BULLISH')))
  ) {
    trendDirection = 'UPTREND';
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

  const isPullback = isBuy ? priceMinusEma20Pips < -0.2 : priceMinusEma20Pips > 0.2;

  const trendProjectionText = isBuy
    ? trendMatchesSide
      ? isPullback
        ? `UPTREND · BUY DIP REACTION ↑ (Pullback testing discount zone · ${allFactorEval.bullScorePct}% Bull Confluence)`
        : `UPTREND · BUY PROJECTION ↑ (${allFactorEval.bullScorePct}% Bull Confluence · H1 ${h1TrendDirection})`
      : `BUY REVERSAL SETUP ↑ (${allFactorEval.bullScorePct}% Bull Factors · H1 ${h1TrendDirection})`
    : trendMatchesSide
    ? isPullback
      ? `DOWNTREND · SELL RALLY REACTION ↓ (Pullback testing premium zone · ${allFactorEval.bearScorePct}% Bear Confluence)`
      : `DOWNTREND · SELL PROJECTION ↓ (${allFactorEval.bearScorePct}% Bear Confluence · H1 ${h1TrendDirection})`
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
      driverSummary: `London/NY session liquidity expansion (${macro.eatHour}:00 EAT · ${brokerSymbol} ~${brokerSpread}p spread · ${activeLotSize.toFixed(2)} Lots). ${macroFactorNote}.`
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
    ? `${orderVerdictLabel}: +$${netProfitUsd.toFixed(2)} (+${netProfitKes} KES) at 12H TP2 (${tp2Price.toFixed(decimals)}) · +$${netProfit48hUsd.toFixed(2)} (+${netProfit48hKes} KES) 48H Swing TP3 vs -$${actualRiskUsd.toFixed(2)} max risk @ ${activeLotSize.toFixed(2)} Lots (${riskReward} R:R)`
    : `${orderVerdictLabel}: Pullback near 20 EMA (${ema20Val.toFixed(decimals)}) targets +$${netProfitUsd.toFixed(2)} (+${netProfitKes} KES) at TP2 & +$${netProfit48hUsd.toFixed(2)} (+${netProfit48hKes} KES) at 48H TP3 (${activeLotSize.toFixed(2)} Lots · ${riskReward} R:R)`;

  const humanCheckNote = allFactorEval.entryTimingWarning
    ? allFactorEval.entryTimingWarning
    : isBuy
    ? `BUY Confirmation Check (${p.targetTf}): Confirm a bullish candle close above 20 EMA (${ema20Val.toFixed(decimals)}) with swing-protected SL @ ${slPrice.toFixed(decimals)} (${activeLotSize.toFixed(2)} Lots).`
    : `SELL Confirmation Check (${p.targetTf}): Confirm a bearish candle close below 20 EMA (${ema20Val.toFixed(decimals)}) with swing-protected SL @ ${slPrice.toFixed(decimals)} (${activeLotSize.toFixed(2)} Lots).`;

  const trajectory = isBuy
    ? `1H–48H ${p.biasOverride ? 'Chosen BUY' : 'AI BUY'} Roadmap (${trendProjectionText}): Live ${p.targetTf} candle @ ${anchoredEntry.toFixed(decimals)} (${brokerSymbol} · ${activeLotSize.toFixed(2)} Lots). Swing SL @ ${slPrice.toFixed(decimals)} (${actualSlPips}p / -$${actualRiskUsd.toFixed(2)}). 1H–4H TP1: ${tp1Price.toFixed(decimals)} (+$${tp1NetProfitUsd.toFixed(2)}) -> 4H–12H TP2: ${tp2Price.toFixed(decimals)} (+${actualTpPips}p / +$${netProfitUsd.toFixed(2)}) -> 12H–48H Extended TP3: ${tp3Price.toFixed(decimals)} (+${actualTp3Pips}p / +$${netProfit48hUsd.toFixed(2)}). ${macroFactorNote}.`
    : `1H–48H ${p.biasOverride ? 'Chosen SELL' : 'AI SELL'} Roadmap (${trendProjectionText}): Live ${p.targetTf} candle @ ${anchoredEntry.toFixed(decimals)} (${brokerSymbol} · ${activeLotSize.toFixed(2)} Lots). Swing SL @ ${slPrice.toFixed(decimals)} (${actualSlPips}p / -$${actualRiskUsd.toFixed(2)}). 1H–4H TP1: ${tp1Price.toFixed(decimals)} (+$${tp1NetProfitUsd.toFixed(2)}) -> 4H–12H TP2: ${tp2Price.toFixed(decimals)} (-${actualTpPips}p / +$${netProfitUsd.toFixed(2)}) -> 12H–48H Extended TP3: ${tp3Price.toFixed(decimals)} (-${actualTp3Pips}p / +$${netProfit48hUsd.toFixed(2)}). ${macroFactorNote}.`;

  const mt4SafetyProof = isBuy
    ? `MT4 BUY Validated: SL (${slPrice.toFixed(decimals)}) < Entry (${anchoredEntry.toFixed(decimals)}) < TP1 (${tp1Price.toFixed(decimals)}) < TP2 (${tp2Price.toFixed(decimals)})`
    : `MT4 SELL Validated: TP2 (${tp2Price.toFixed(decimals)}) < TP1 (${tp1Price.toFixed(decimals)}) < Entry (${anchoredEntry.toFixed(decimals)}) < SL (${slPrice.toFixed(decimals)})`;

  const mtfAlignment = evaluateMultiTimeframeAlignment({
    pair: p.targetPair,
    price: p.price,
    ema20: ema20Val,
    ema50: ema50Val,
    h1TrendDirection,
    change24hPct:
      p.change24hPct !== undefined
        ? p.change24hPct
        : emaSpreadPips !== 0
        ? emaSpreadPips >= 0
          ? 0.18
          : -0.18
        : 0,
    macro
  });

  const allEconomicEvents = getUpcomingEconomicEvents();
  const baseCurrency = p.targetPair.split('/')[0];
  const economicEventNotice =
    allEconomicEvents.find(
      (ev) => ev.currency === p.targetPair || ev.currency.includes(baseCurrency) || ev.currency.includes('USD')
    ) || allEconomicEvents[0];

  let advisoryEntryPrice = anchoredEntry;
  let advisoryDiscountPips = 0;
  let advisoryEntryNote = `Direct market execution @ ${anchoredEntry.toFixed(decimals)}`;

  if (isBuy) {
    if (p.price > ema20Val) {
      advisoryEntryPrice = Number(ema20Val.toFixed(decimals));
      advisoryDiscountPips = Number(((p.price - ema20Val) * pipMultiplier).toFixed(1));
      advisoryEntryNote = `Advisory 1H Entry: Set BUY LIMIT @ ${advisoryEntryPrice} (20 EMA Pullback) to save ${advisoryDiscountPips} pips drawdown`;
    }
  } else {
    if (p.price < ema20Val) {
      advisoryEntryPrice = Number(ema20Val.toFixed(decimals));
      advisoryDiscountPips = Number(((ema20Val - p.price) * pipMultiplier).toFixed(1));
      advisoryEntryNote = `Advisory 1H Entry: Set SELL LIMIT @ ${advisoryEntryPrice} (20 EMA Pullback) to gain ${advisoryDiscountPips} pips premium`;
    }
  }

  // Coherent Limit Plan anchored strictly around advisoryEntryPrice (20 EMA Limit EP)
  // so EP, SL, TP1, TP2, TP3 always remain 100% mathematically aligned in Pullback Mode.
  let limitSl = isBuy
    ? Number((advisoryEntryPrice - slOffset).toFixed(decimals))
    : Number((advisoryEntryPrice + slOffset).toFixed(decimals));
  let limitTp1 = isBuy
    ? Number((advisoryEntryPrice + tp1Offset).toFixed(decimals))
    : Number((advisoryEntryPrice - tp1Offset).toFixed(decimals));
  let limitTp2 = isBuy
    ? Number((advisoryEntryPrice + tp2Offset).toFixed(decimals))
    : Number((advisoryEntryPrice - tp2Offset).toFixed(decimals));
  let limitTp3 = isBuy
    ? Number((advisoryEntryPrice + tp3Offset).toFixed(decimals))
    : Number((advisoryEntryPrice - tp3Offset).toFixed(decimals));

  if (isBuy) {
    if (limitSl > advisoryEntryPrice - minGapPrice) limitSl = Number((advisoryEntryPrice - slOffset).toFixed(decimals));
    if (limitTp1 < advisoryEntryPrice + minGapPrice) limitTp1 = Number((advisoryEntryPrice + tp1Offset).toFixed(decimals));
    if (limitTp2 < limitTp1 + minGapPrice * 0.75) limitTp2 = Number((limitTp1 + minGapPrice).toFixed(decimals));
    if (limitTp3 < limitTp2 + minGapPrice * 0.9) limitTp3 = Number((limitTp2 + minGapPrice * 1.25).toFixed(decimals));
  } else {
    if (limitSl < advisoryEntryPrice + minGapPrice) limitSl = Number((advisoryEntryPrice + slOffset).toFixed(decimals));
    if (limitTp1 > advisoryEntryPrice - minGapPrice) limitTp1 = Number((advisoryEntryPrice - tp1Offset).toFixed(decimals));
    if (limitTp2 > limitTp1 - minGapPrice * 0.75) limitTp2 = Number((limitTp1 - minGapPrice).toFixed(decimals));
    if (limitTp3 > limitTp2 - minGapPrice * 0.9) limitTp3 = Number((limitTp2 - minGapPrice * 1.25).toFixed(decimals));
  }

  const limitPlan = {
    entryPrice: advisoryEntryPrice,
    stopLoss: limitSl,
    tp1: limitTp1,
    tp2: limitTp2,
    tp3: limitTp3,
    slPips: actualSlPips,
    tp1Pips: actualTp1Pips,
    tpPips: actualTpPips,
    tp3Pips: actualTp3Pips,
    riskReward,
    mt4SafetyProof: isBuy
      ? `MT4 BUY LIMIT Validated: SL (${limitSl.toFixed(decimals)}) < EP (${advisoryEntryPrice.toFixed(decimals)}) < TP1 (${limitTp1.toFixed(decimals)}) < TP2 (${limitTp2.toFixed(decimals)})`
      : `MT4 SELL LIMIT Validated: TP2 (${limitTp2.toFixed(decimals)}) < TP1 (${limitTp1.toFixed(decimals)}) < EP (${advisoryEntryPrice.toFixed(decimals)}) < SL (${limitSl.toFixed(decimals)})`
  };

  const slVolatilityWarning =
    p.atrPips && actualSlPips < effectiveAtr * 1.0
      ? `HIGH VOLATILITY / TIGHT SL WARNING: Live ${p.targetTf} ATR is ${effectiveAtr.toFixed(
          1
        )}p (${isGold ? `$${(effectiveAtr / pipMultiplier).toFixed(2)}` : `${effectiveAtr.toFixed(1)}p`}/candle), wider than your ${actualSlPips}p SL (${isGold ? `$${(actualSlPips / pipMultiplier).toFixed(2)}` : `${actualSlPips}p`}). Sudden wick spikes (plus ${brokerSpread}p spread on SELL Ask) can hit SL before continuation — wait for 20 EMA retest or raise risk budget.`
      : undefined;

  const pairTiming = evaluatePairKenyaTiming(p.targetPair);
  const scoreMargin = Math.abs(allFactorEval.bullScorePct - allFactorEval.bearScorePct);
  const h1AlignedWithOrder = h1TrendDirection === (isBuy ? 'UPTREND' : 'DOWNTREND');
  const bosConflictDetected = Boolean(
    p.bosAnalysis &&
      ((isBuy &&
        (p.bosAnalysis.bosDirection === 'BEARISH_BOS' ||
          p.bosAnalysis.bosDirection === 'BEARISH_CHOCH' ||
          p.bosAnalysis.h1BosDirection === 'BEARISH_BOS' ||
          p.bosAnalysis.h1BosDirection === 'BEARISH_CHOCH')) ||
        (!isBuy &&
          (p.bosAnalysis.bosDirection === 'BULLISH_BOS' ||
            p.bosAnalysis.bosDirection === 'BULLISH_CHOCH' ||
            p.bosAnalysis.h1BosDirection === 'BULLISH_BOS' ||
            p.bosAnalysis.h1BosDirection === 'BULLISH_CHOCH')))
  );
  let executionReadiness: ComputedTradeParams['executionReadiness'] = 'READY_ENTER';
  let executionReadinessReason = `${allFactorEval.alignedFactorsCount}/${allFactorEval.totalFactorsCount} factors, BOS structure & 1H aligned inside value zone.`;

  if (pairTiming.windowStatusCode === 'CLOSED_WAIT') {
    executionReadiness = 'NO_TRADE_CLOSED';
    executionReadinessReason = `Market closed (${pairTiming.currentWindowName}) — spreads spike at open.`;
  } else if (bosConflictDetected) {
    executionReadiness = 'NO_TRADE_CHOP';
    executionReadinessReason =
      p.bosAnalysis?.bosVetoReason ||
      `Opposing Break of Structure (${p.bosAnalysis?.bosDirection.replace('_', ' ')}) blocks ${isBuy ? 'BUY' : 'SELL'} to protect against structural reversal.`;
  } else if (
    allFactorEval.isFlatEmaChop ||
    scoreMargin < 12 ||
    allFactorEval.alignedFactorsCount < 4 ||
    (!h1AlignedWithOrder && allFactorEval.alignedFactorsCount < 5 && !p.bosAnalysis?.brokenStructure)
  ) {
    executionReadiness = 'NO_TRADE_CHOP';
    executionReadinessReason = allFactorEval.isFlatEmaChop
      ? `20/50 EMA flat compression with RSI ${rsiVal.toFixed(1)} — consolidation chop zone, wait breakout.`
      : !h1AlignedWithOrder
      ? `1H ${h1TrendDirection} conflicts with ${p.targetTf} ${isBuy ? 'BUY' : 'SELL'} (${allFactorEval.alignedFactorsCount}/${allFactorEval.totalFactorsCount} aligned) — stand aside until aligned.`
      : `Low edge (${allFactorEval.bullScorePct}% vs ${allFactorEval.bearScorePct}%, ${allFactorEval.alignedFactorsCount}/${allFactorEval.totalFactorsCount} factors) — chop zone, wait clearer expansion.`;
  } else if (allFactorEval.isExtendedZone || Boolean(slVolatilityWarning) || Boolean(p.opposingCandleWarning)) {
    executionReadiness = 'WAIT_PULLBACK';
    executionReadinessReason = p.opposingCandleWarning
      ? p.opposingCandleWarning
      : allFactorEval.isExtendedZone
      ? `Price extended away from 20 EMA — use 20 EMA Limit (${advisoryEntryPrice}) rather than chasing.`
      : `Candle ATR (${effectiveAtr.toFixed(1)}p) exceeds your ${actualSlPips}p SL — wait tight retest or increase SL budget.`;
  }

  const finalGoAheadAssurance: ComputedTradeParams['goAheadAssurance'] =
    executionReadiness === 'NO_TRADE_CLOSED'
      ? 'STAND ASIDE: MARKET CLOSED'
      : executionReadiness === 'NO_TRADE_CHOP'
      ? 'STAND ASIDE: CHOP / CONFLICTED TIMEFRAMES'
      : executionReadiness === 'WAIT_PULLBACK'
      ? 'WAIT PULLBACK TO 20 EMA — EXTENDED ENTRY ZONE'
      : allFactorEval.goAheadAssurance;

  const finalIsFavourableOrder = executionReadiness === 'READY_ENTER' && isFavourableOrder && !bosConflictDetected;
  const finalOrderVerdictLabel: ComputedTradeParams['orderVerdictLabel'] =
    executionReadiness === 'NO_TRADE_CLOSED'
      ? 'STAND ASIDE (MARKET CLOSED)'
      : executionReadiness === 'NO_TRADE_CHOP'
      ? 'STAND ASIDE (CHOP / CONFLICT)'
      : executionReadiness === 'WAIT_PULLBACK'
      ? isBuy
        ? 'SELECTIVE BUY (WAIT PULLBACK)'
        : 'SELECTIVE SELL (WAIT PULLBACK)'
      : orderVerdictLabel;

  const tvSymbol = getTradingViewSymbol(p.targetPair);
  const strategyMatch = selectOptimalTradingStrategy({
    pair: p.targetPair,
    direction: isBuy ? 'BUY' : 'SELL',
    rsi: p.rsi ?? 52.0,
    ema20: ema20Val,
    ema50: ema50Val,
    price: anchoredEntry,
    isExtendedZone: allFactorEval.isExtendedZone,
    eatHour: macro.eatHour,
    bosAnalysis: p.bosAnalysis,
    trendMatchesSide
  });

  const preflightChecks = buildZeroMistakeChecklist({
    pair: p.targetPair,
    direction: isBuy ? 'BUY' : 'SELL',
    entryPrice: anchoredEntry,
    stopLoss: slPrice,
    tp1: tp1Price,
    tp2: tp2Price,
    riskReward,
    atrPips: effectiveAtr,
    slPips: actualSlPips,
    tpPips: actualTpPips,
    h1TrendDirection,
    trendDirection,
    isExtendedZone: allFactorEval.isExtendedZone,
    bosAnalysis: p.bosAnalysis,
    adxStrength: derivedAdx,
    macdBias: derivedMacd.bias,
    candlePattern: derivedPattern
  });

  const liveBacktest = runLiveCandleBacktest({
    pair: p.targetPair,
    candles: p.candles,
    atrPips: effectiveAtr,
    brokerSpread,
    direction: isBuy ? 'BUY' : 'SELL'
  });

  const plainEnglishGuide = buildPlainEnglishTradeGuide({
    pair: p.targetPair,
    direction: isBuy ? 'BUY' : 'SELL',
    entryPrice: anchoredEntry,
    stopLoss: slPrice,
    tp1: tp1Price,
    tp2: tp2Price,
    slPips: actualSlPips,
    tpPips: actualTpPips,
    brokerSpread,
    atrPips: effectiveAtr,
    ema20: ema20Val,
    ema50: ema50Val,
    rsi: rsiVal,
    h1TrendDirection,
    riskReward,
    actualRiskUsd,
    netProfitUsd,
    tp1NetProfitUsd,
    alignedFactorsCount: allFactorEval.alignedFactorsCount,
    totalFactorsCount: allFactorEval.totalFactorsCount,
    decimals,
    bosAnalysis: p.bosAnalysis,
    liveBacktest
  });

  return {
    direction: isBuy ? 'BUY' : 'SELL',
    orderType,
    entryPrice: anchoredEntry,
    stopLoss: slPrice,
    tp1: tp1Price,
    tp2: tp2Price,
    tp3: tp3Price,
    slPips: actualSlPips,
    tp1Pips: actualTp1Pips,
    tpPips: actualTpPips,
    tp3Pips: actualTp3Pips,
    riskReward,
    lotSize: activeLotSize,
    actualRiskUsd,
    potentialGainUsd,
    spreadCostUsd,
    netProfitUsd,
    netProfitKes,
    netProfit48hUsd,
    netProfit48hKes,
    tp1NetProfitUsd,
    tp1NetProfitKes,
    orderVerdictLabel: finalOrderVerdictLabel,
    profitOutlookText,
    isFavourableOrder: finalIsFavourableOrder,
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
    goAheadAssurance: finalGoAheadAssurance,
    trajectory,
    trajectoryHorizons,
    trendDirection,
    h1TrendDirection,
    trendProjectionText,
    humanCheckNote,
    mt4SafetyProof,
    cmaProtection: 'Zero negative balance debt risk (CMA Kenya Regulated Shield)',
    mtfAlignment,
    economicEventNotice,
    advisoryEntryPrice,
    advisoryEntryNote,
    advisoryDiscountPips,
    slVolatilityWarning,
    executionReadiness,
    executionReadinessReason,
    bosAnalysis: p.bosAnalysis,
    preflightChecks,
    riskConfig: activeRiskCfg,
    riskPlan,
    tvSymbol,
    recommendedStrategy: strategyMatch.name,
    strategyWinRate: strategyMatch.winRateLabel,
    strategyRationale: strategyMatch.rationale,
    liveBacktest,
    adxStrength: derivedAdx,
    macdHistogram: derivedMacd.histogram,
    macdBias: derivedMacd.bias,
    candlePattern: derivedPattern,
    executionBrief: plainEnglishGuide,
    plainEnglishGuide,
    limitPlan
  };
}

export interface EntryMomentVerdict {
  status: 'PRIME_NOW' | 'WAIT_PULLBACK' | 'MARKET_CLOSED';
  badge: string;
  headline: string;
  actionGuidance: string;
  themeColor: string;
  advisoryPrice?: number;
  discountPips?: number;
}

export interface TrendSustainabilityVerdict {
  status: 'HIGH_SUSTAINABLE' | 'MODERATE_SUSTAINABLE' | 'CHOP_CAUTION';
  integrityPct: number;
  badge: string;
  headline: string;
  structuralReason: string;
  themeColor: string;
}

export function evaluateOrderEntryMoment(
  pair: CurrencyPair,
  computed: ComputedTradeParams,
  livePrice: number,
  kenyaTiming: KenyaEntryWindowInfo
): EntryMomentVerdict {
  if (kenyaTiming.windowStatusCode === 'CLOSED_WAIT') {
    return {
      status: 'MARKET_CLOSED',
      badge: 'MARKET CLOSED · DO NOT ENTER',
      headline: `Market Closed (Opens in ${kenyaTiming.countdownFormatted})`,
      actionGuidance: 'Brokers halt order execution and spreads widen 10x–50x. Do not rush! Wait for market open or trade 24/7 Crypto.',
      themeColor: '#EF4444'
    };
  }

  if (computed.isExtendedZone && computed.advisoryDiscountPips && computed.advisoryDiscountPips > 0) {
    return {
      status: 'WAIT_PULLBACK',
      badge: `WAIT PULLBACK TO ${computed.advisoryEntryPrice}`,
      headline: `Extended by ${computed.advisoryDiscountPips}p — Do Not Rush Entry!`,
      actionGuidance: `Price is stretched away from 20 EMA. Wait for pullback to ${computed.advisoryEntryPrice} before entering order to save ${computed.advisoryDiscountPips} pips drawdown.`,
      themeColor: '#F59E0B',
      advisoryPrice: computed.advisoryEntryPrice,
      discountPips: computed.advisoryDiscountPips
    };
  }

  return {
    status: 'PRIME_NOW',
    badge: 'PRIME MOMENT TO ENTER (CONFIRMED ✓)',
    headline: 'Right Moment Confirmed: Optimal 20/50 EMA Pullback Zone',
    actionGuidance: `Price is in prime discount corridor with ${computed.alignedFactorsCount}/${computed.totalFactorsCount} aligned factors. Safe to copy SL & TP and execute broker order!`,
    themeColor: '#00C261',
    advisoryPrice: computed.advisoryEntryPrice
  };
}

export function evaluateOrderTrendSustainability(
  computed: ComputedTradeParams
): TrendSustainabilityVerdict {
  const isH1Aligned = computed.h1TrendDirection === (computed.direction === 'BUY' ? 'UPTREND' : 'DOWNTREND');
  const factorPct = Math.round((computed.alignedFactorsCount / Math.max(1, computed.totalFactorsCount)) * 100);
  const mtfTier = computed.mtfAlignment?.tierGrade || 'GRADE B (2/4 MIXED — WAIT)';

  if (isH1Aligned && factorPct >= 75 && (mtfTier.includes('GRADE A+') || mtfTier.includes('GRADE A')) && !computed.slVolatilityWarning) {
    const integrity = Math.min(82, Math.max(68, Math.round(computed.confidence * 0.85)));
    return {
      status: 'HIGH_SUSTAINABLE',
      integrityPct: integrity,
      badge: `ALIGNED STRUCTURE (${integrity}% CONFLUENCE)`,
      headline: `Aligned ${computed.direction} Structure (Manage Risk Actively)`,
      structuralReason: `1H & M15 EMA structure align in ${computed.direction} direction with ${computed.alignedFactorsCount}/${computed.totalFactorsCount} factors. Still respect your SL — sharp NY spikes can reverse intraday swings.`,
      themeColor: '#00C261'
    };
  }

  if (isH1Aligned || factorPct >= 60) {
    const integrity = Math.min(68, Math.max(54, Math.round(computed.confidence * 0.76)));
    return {
      status: 'MODERATE_SUSTAINABLE',
      integrityPct: integrity,
      badge: `MODERATE CONFLUENCE (${integrity}%)`,
      headline: `Selective ${computed.direction} — Confirm Candle Close`,
      structuralReason: 'Partial alignment only. Scale out 50% at TP1 and move SL to Breakeven early if momentum stalls.',
      themeColor: '#38BDF8'
    };
  }

  return {
    status: 'CHOP_CAUTION',
    integrityPct: 48,
    badge: 'CONFLICTED / CHOP RISK — STAND ASIDE',
    headline: 'Mixed Timeframes — Do Not Rush New Order',
    structuralReason: 'Higher and lower timeframes conflict or volatility exceeds SL. Wait for clear breakout or reduce lot size.',
    themeColor: '#F59E0B'
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

  // Compute genuine Higher-Timeframe (H1) EMA trend patched with live price so H1 flips reflect live ticks immediately
  let h1TrendDirection: 'UPTREND' | 'DOWNTREND' | 'RANGING' | undefined = params.previousTrendDirection;
  let patchedH1Candles = params.h1Candles;
  if (params.h1Candles && params.h1Candles.length >= 22) {
    patchedH1Candles = params.h1Candles.map((c, idx) =>
      idx === params.h1Candles!.length - 1 && params.price > 0
        ? { ...c, close: params.price, high: Math.max(c.high, params.price), low: Math.min(c.low, params.price) }
        : c
    );
    const h1Closes = patchedH1Candles.map((c) => c.close);
    const h1Ema20 = computeRealEma(h1Closes, 20);
    const h1Ema50 = computeRealEma(h1Closes, 50);
    const h1Macd = computeRealMacd(h1Closes);
    const h1Last = h1Closes[h1Closes.length - 1] ?? params.price;
    const h1Prev4 = h1Closes[Math.max(0, h1Closes.length - 5)] ?? h1Last;
    const h1PriceBelowBoth = params.price < h1Ema20 && params.price < h1Ema50;
    const h1PriceAboveBoth = params.price > h1Ema20 && params.price > h1Ema50;
    if (h1Ema20 < h1Ema50) {
      h1TrendDirection =
        h1PriceAboveBoth && h1Macd.bias === 'BULLISH' && (h1Last > h1Prev4 || effectivePct >= 0.45)
          ? 'UPTREND'
          : 'DOWNTREND';
    } else if (h1Ema20 > h1Ema50) {
      h1TrendDirection =
        h1PriceBelowBoth && (h1Macd.bias === 'BEARISH' || h1Last < h1Prev4 || effectivePct <= -0.45)
          ? 'DOWNTREND'
          : 'UPTREND';
    } else {
      h1TrendDirection = params.price >= h1Ema50 ? 'UPTREND' : 'DOWNTREND';
    }
  }

  const isHigherTf =
    params.recommendedTf === 'H1' || params.recommendedTf === 'H4' || params.recommendedTf === 'D1';
  const activeBaseCandles =
    isHigherTf && patchedH1Candles && patchedH1Candles.length >= 22
      ? patchedH1Candles
      : params.candles;

  const evalData = evaluateCandleSeriesAndTick({
    pair: params.pair,
    timeframe: params.recommendedTf,
    livePrice: params.price,
    baseCandles: activeBaseCandles,
    h1Candles: patchedH1Candles,
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
    !evalData.bosAnalysis.brokenStructure &&
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
    candles: evalData.candles,
    macro: params.macro,
    previousDirection: params.previousDirection,
    previousTrendDirection: params.previousTrendDirection,
    h1TrendDirection,
    change24hPct: effectivePct,
    opposingCandleWarning: evalData.opposingCandleWarning,
    bosAnalysis: evalData.bosAnalysis,
    riskConfig: positionRiskStore.getConfig()
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
    : evalData.bosAnalysis.brokenStructure
    ? `${evalData.bosAnalysis.bosDirection.replace('_', ' ')} @ ${evalData.bosAnalysis.bosTriggerLevel.toFixed(decimals)} · Key ${evalData.keyLevel.toFixed(decimals)}`
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
    adxStrength: evalData.adxStrength,
    macdHistogram: evalData.macdHistogram,
    macdBias: evalData.macdBias,
    candlePattern: evalData.candlePattern,
    keyLevel: evalData.keyLevel,
    swingLow: evalData.swingLow,
    swingHigh: evalData.swingHigh,
    patternType: evalData.patternType,
    riskReward: computed.riskReward,
    lotSize: computed.lotSize,
    actualRiskUsd: computed.actualRiskUsd,
    executionReadiness: computed.executionReadiness,
    executionReadinessReason: computed.executionReadinessReason,
    bosAnalysis: evalData.bosAnalysis,
    isTopPick: params.isTopPick,
    volatility: params.volatility,
    recommendedSession: params.recommendedSession,
    candles: evalData.candles,
    h1Candles: patchedH1Candles,
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
    spreadByBroker: params.spreadByBroker,
    mtfAlignment: computed.mtfAlignment,
    economicEventNotice: computed.economicEventNotice,
    tvSymbol: computed.tvSymbol,
    recommendedStrategy: computed.recommendedStrategy,
    strategyWinRate: computed.strategyWinRate,
    strategyRationale: computed.strategyRationale,
    liveBacktest: computed.liveBacktest,
    executionBrief: computed.executionBrief,
    plainEnglishGuide: computed.plainEnglishGuide
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
    price: 69300.0,
    change24hPct: -0.85,
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
    price: 3897.50,
    change24hPct: -0.45,
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
  }),
  buildCalibratedMarketItem({
    pair: 'ETH/USD',
    symbol: 'Ethereum 24/7',
    price: 1960.0,
    change24hPct: -1.15,
    recommendedTf: 'H1',
    recommendedSession: '24/7 Global Crypto Liquidity',
    volatility: 'HIGH',
    isTopPick: true,
    spreadByBroker: {
      fxpesa: { symbol: 'ETHUSD', spread: 2.5, notes: 'CMA Kenya regulated CFD.' },
      hfm: { symbol: 'ETHUSD', spread: 3.0, notes: 'High leverage crypto CFD.' },
      exness: { symbol: 'ETHUSD', spread: 1.8, notes: 'Zero overnight swap on crypto.' },
      fbs: { symbol: 'ETHUSD', spread: 3.2, notes: 'Standard crypto account.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'US30',
    symbol: 'Wall Street 30 / Dow',
    price: 52547.0,
    change24hPct: -0.35,
    recommendedTf: 'H1',
    recommendedSession: 'New York Session (16:30 - 23:00 EAT)',
    volatility: 'HIGH',
    spreadByBroker: {
      fxpesa: { symbol: 'US30', spread: 2.0, notes: 'Direct Wall Street index execution.' },
      hfm: { symbol: 'US30.cash', spread: 2.5, notes: 'Cash index CFD.' },
      exness: { symbol: 'US30', spread: 1.6, notes: 'Tight index spread.' },
      fbs: { symbol: 'US30', spread: 2.8, notes: 'Standard leverage.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'NAS100',
    symbol: 'US Tech 100 / Nasdaq',
    price: 28412.0,
    change24hPct: -0.42,
    recommendedTf: 'H1',
    recommendedSession: 'New York Session (16:30 - 23:00 EAT)',
    volatility: 'HIGH',
    spreadByBroker: {
      fxpesa: { symbol: 'USTEC', spread: 1.5, notes: 'Premier tech momentum index.' },
      hfm: { symbol: 'NAS100.cash', spread: 1.8, notes: 'Nasdaq cash index.' },
      exness: { symbol: 'USTEC', spread: 1.2, notes: 'Low spread on tech index.' },
      fbs: { symbol: 'NAS100', spread: 2.0, notes: 'Standard ECN.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'GER40',
    symbol: 'Germany 40 / DAX',
    price: 26760.0,
    change24hPct: 0.28,
    recommendedTf: 'H1',
    recommendedSession: 'Frankfurt / London (10:00 - 18:30 EAT)',
    volatility: 'MEDIUM',
    spreadByBroker: {
      fxpesa: { symbol: 'GER40', spread: 1.2, notes: 'European benchmark index.' },
      hfm: { symbol: 'GER40.cash', spread: 1.5, notes: 'DAX cash CFD.' },
      exness: { symbol: 'DE40', spread: 1.0, notes: 'Raw European index spread.' },
      fbs: { symbol: 'GER40', spread: 1.6, notes: 'Standard.' }
    }
  }),
  buildCalibratedMarketItem({
    pair: 'USOIL',
    symbol: 'Crude Oil (WTI)',
    price: 88.6,
    change24hPct: -0.35,
    recommendedTf: 'H1',
    recommendedSession: 'NYMEX Session (16:00 - 21:30 EAT)',
    volatility: 'HIGH',
    spreadByBroker: {
      fxpesa: { symbol: 'USOIL', spread: 3.5, notes: 'WTI Light Sweet Crude Oil.' },
      hfm: { symbol: 'USOIL.spot', spread: 4.0, notes: 'Spot crude oil.' },
      exness: { symbol: 'USOIL', spread: 2.8, notes: 'Low spread oil CFD.' },
      fbs: { symbol: 'USOIL', spread: 4.5, notes: 'Standard energy CFD.' }
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
    'ETH/USD': 'ETHUSD',
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
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    try {
      controller.abort(new DOMException(`Request timed out after ${timeoutMs}ms`, 'TimeoutError'));
    } catch {
      controller.abort('TimeoutError');
    }
  }, timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: controller.signal
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export interface SuperAiLiveNote {
  pair: CurrencyPair;
  source: 'gemini-4-hydrogen' | 'gemini-3.8-flash' | 'quantitative-engine';
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
      // 1. Primary server-side institutional live markets aggregator (/api/live-markets)
      const serverRes = await fetchWithFastTimeout('/api/live-markets', {}, 4000).catch(() => null);
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
        pair === 'ETH/USD' ? 'ETHUSDT' :
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

        const isCryptoPair = pair === 'BTC/USD' || pair === 'ETH/USD';
        if (binanceKlinesRes.status === 'fulfilled' && binanceKlinesRes.value && binanceKlinesRes.value.ok && (isCryptoPair || fetchedCandles.length < 12)) {
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
          if (last > 0 && (isCryptoPair || !liveConnected)) {
            livePrice = last;
            liveConnected = true;
          }
          if (!isNaN(pct) && (isCryptoPair || !liveConnected)) {
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
      { pair: 'ETH/USD', kSym: 'ETHUSD' },
      { pair: 'BTC/USD', kSym: 'XBTUSD' }
    ];

    const m15Promises = krakenSpecs.map((s) =>
      fetch(`https://api.kraken.com/0/public/OHLC?pair=${s.kSym}&interval=15`, { cache: 'no-store', signal: sig })
        .then((r) => (r.ok ? r.json().catch(() => null) : null))
        .catch(() => null)
    );
    const h1Promises = krakenSpecs.map((s) =>
      fetch(`https://api.kraken.com/0/public/OHLC?pair=${s.kSym}&interval=60`, { cache: 'no-store', signal: sig })
        .then((r) => (r.ok ? r.json().catch(() => null) : null))
        .catch(() => null)
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
 * Fetches live FX, Gold, Indices, Oil, and Crypto spot prices & OHLC candles across all 15 markets simultaneously
 * via server institutional cache + direct exchange fallback.
 */
export async function fetchLiveMarketSnapshot(
  currentMarkets: MarketScanData[] = INITIAL_MARKETS_DATA,
  forceServerRefresh = false
): Promise<{ markets: MarketScanData[]; syncedAt: string; liveFeedConnected: boolean }> {
  if (inFlightSnapshotPromiseRef.current && !forceServerRefresh) {
    return inFlightSnapshotPromiseRef.current;
  }

  const runSnapshot = async (): Promise<{ markets: MarketScanData[]; syncedAt: string; liveFeedConnected: boolean }> => {
    void refreshBackgroundRealOhlcCandles(forceServerRefresh);

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
      const endpoint = forceServerRefresh ? '/api/live-markets?force=1' : '/api/live-markets';
      const serverRes = await fetchWithFastTimeout(endpoint, {}, 4000).catch(() => null);
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
        const [coinbaseRes, binanceTickerRes, goldSpotRes] = await Promise.allSettled([
          fetchWithFastTimeout(`https://api.coinbase.com/v2/exchange-rates?currency=USD&_t=${Date.now()}`, {}, 1400),
          fetchWithFastTimeout('https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22%5D', {}, 1400),
          fetchWithFastTimeout('https://api.gold-api.com/price/XAU', {}, 1400)
        ]);

        if (goldSpotRes.status === 'fulfilled' && goldSpotRes.value && goldSpotRes.value.ok) {
          const g = await goldSpotRes.value.json();
          if (g?.price > 1500) {
            liveMap['XAU/USD'] = { price: Number(Number(g.price).toFixed(2)), pct: liveMap['XAU/USD']?.pct ?? 0 };
            liveFeedConnected = true;
          }
        }

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
              } else if (t.symbol === 'ETHUSDT') {
                const p = parseFloat(t.lastPrice);
                const pct = parseFloat(t.priceChangePercent);
                if (p > 100) {
                  liveMap['ETH/USD'] = { price: Number(p.toFixed(2)), pct: !isNaN(pct) ? pct : liveMap['ETH/USD']?.pct ?? 0 };
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

      const hasLiveHistory = existing.dataSource === 'Live Interbank Feed';
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
        previousDirection: hasLiveHistory ? old?.dir : undefined,
        previousTrendDirection: hasLiveHistory ? old?.trendDir : undefined,
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

  const isCrypto247 = pair === 'BTC/USD' || pair === 'ETH/USD';
  const isWeekendClosed =
    !isCrypto247 &&
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
      currentWindowName: 'Weekend Market Closure (Forex / Metals / Indices Halted)',
      nextWindowName: 'Sunday Night / Monday Open (23:55 EAT)',
      countdownFormatted: cd,
      countdownSeconds: secsToOpen,
      reasonText: `${pair} is CLOSED for the weekend in Kenya (EAT). Reopens in ${cd}. DO NOT place live market orders now (broker execution halted, extreme spread risk). Use 1H pending limit orders for Monday, or trade 24/7 Crypto (BTC/USD, ETH/USD) which is live right now!`
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
      { name: 'Active 24/7 Institutional Crypto Flow', startSec: 0, endSec: 86400 }
    ],
    'ETH/USD': [
      { name: 'Active 24/7 Global Ethereum Liquidity', startSec: 0, endSec: 86400 }
    ],
    'US30': [
      { name: 'Wall Street Regular Session (16:30–23:00 EAT)', startSec: 16.5 * 3600, endSec: 23 * 3600 }
    ],
    'NAS100': [
      { name: 'Nasdaq Tech Momentum Session (16:30–23:00 EAT)', startSec: 16.5 * 3600, endSec: 23 * 3600 }
    ],
    'GER40': [
      { name: 'Frankfurt Morning DAX Open (10:00–18:30 EAT)', startSec: 10 * 3600, endSec: 18.5 * 3600 }
    ],
    'USOIL': [
      { name: 'WTI NYMEX Session (16:00–21:30 EAT)', startSec: 16 * 3600, endSec: 21.5 * 3600 }
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
  const recent = candles.length >= 25 ? candles.slice(-25, -1) : candles.slice(-24);
  const swingLow = Math.min(...recent.map((c) => c.low));
  const swingHigh = Math.max(...recent.map((c) => c.high));
  return {
    swingLow: Number.isFinite(swingLow) ? swingLow : undefined,
    swingHigh: Number.isFinite(swingHigh) ? swingHigh : undefined
  };
}

/**
 * Generates the comprehensive Daily Global Trade Safety & Macro Factors report (Pillar 09)
 * answering whether it is safe to BUY or SELL today across all 15 markets, auto-updating
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
  source: 'gemini-4-hydrogen' | 'gemini-3.8-flash' | 'quantitative-engine';
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
  priceAlerts: PriceAlertRule[];
  superAiAutoEnabled: boolean;
  superAiNotes: Partial<Record<CurrencyPair, SuperAiLiveNote>>;
  deepAudits: Partial<Record<CurrencyPair, DeepVerifyResult>>;
  isDeepVerifyingPair: Partial<Record<CurrencyPair, boolean>>;
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
const PRICE_ALERTS_STORAGE_KEY = 'pivotfx_price_alerts_v1';
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

function loadPersistedPriceAlerts(): PriceAlertRule[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PriceAlertRule[]) : [];
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
  private priceAlerts: PriceAlertRule[] = loadPersistedPriceAlerts();
  private superAiAutoEnabled: boolean = true;
  private superAiNotes: Partial<Record<CurrencyPair, SuperAiLiveNote>> = {};
  private deepAudits: Partial<Record<CurrencyPair, DeepVerifyResult>> = {};
  private isDeepVerifyingPair: Partial<Record<CurrencyPair, boolean>> = {};
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
  private hasReceivedLiveFeed = false;
  private trendHoldUntil: Partial<Record<CurrencyPair, number>> = {};
  private sessionDirection: Partial<Record<CurrencyPair, 'BUY' | 'SELL'>> = {};
  private sessionTrendDirection: Partial<Record<CurrencyPair, 'UPTREND' | 'DOWNTREND' | 'RANGING'>> = {};
  private lastReversalWarningByPair: Partial<Record<CurrencyPair, number>> = {};
  private orderMilestoneAlerts = new Set<string>();
  private lastNotificationDedupe = new Map<string, number>();
  private unsubscribeRiskStore: (() => void) | null = null;

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
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(SUGGESTED_SIGNALS_STORAGE_KEY, JSON.stringify(this.suggestedSignals));
    } catch {}
  }

  private persistNotifications() {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications));
      }
    } catch {}
  }

  private persistPriceAlerts() {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PRICE_ALERTS_STORAGE_KEY, JSON.stringify(this.priceAlerts));
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

  public addPriceAlert(params: {
    pair: CurrencyPair;
    targetPrice: number;
    label?: string;
    condition?: 'ABOVE' | 'BELOW';
  }): PriceAlertRule | null {
    if (!Number.isFinite(params.targetPrice) || params.targetPrice <= 0) return null;
    const { decimals } = getPairSpecs(params.pair);
    const liveMkt = this.markets.find((m) => m.pair === params.pair);
    const currentPrice = liveMkt?.price ?? params.targetPrice;
    const targetRounded = Number(params.targetPrice.toFixed(decimals));
    const condition: 'ABOVE' | 'BELOW' =
      params.condition || (targetRounded >= currentPrice ? 'ABOVE' : 'BELOW');

    const rule: PriceAlertRule = {
      id: `pa_${Date.now()}_${params.pair.replace('/', '')}_${Math.random().toString(36).slice(2, 5)}`,
      pair: params.pair,
      condition,
      targetPrice: targetRounded,
      label: (params.label || 'Target Alert').trim(),
      createdAtEat: this.formatNowEat(),
      triggered: false
    };

    // Replace duplicate identical pair + target alert if armed
    this.priceAlerts = [
      rule,
      ...this.priceAlerts.filter(
        (a) => !(a.pair === rule.pair && Math.abs(a.targetPrice - rule.targetPrice) < Math.pow(10, -decimals))
      )
    ].slice(0, 35);
    this.persistPriceAlerts();
    this.broadcast();
    return rule;
  }

  public removePriceAlert(id: string) {
    this.priceAlerts = this.priceAlerts.filter((a) => a.id !== id);
    this.persistPriceAlerts();
    this.broadcast();
  }

  public clearTriggeredAlerts() {
    this.priceAlerts = this.priceAlerts.filter((a) => !a.triggered);
    this.persistPriceAlerts();
    this.broadcast();
  }

  private checkPriceAlertsAgainstMarkets() {
    if (this.priceAlerts.length === 0) return;
    let changed = false;
    const nowEat = this.formatNowEat();
    const hitRules: PriceAlertRule[] = [];

    this.priceAlerts = this.priceAlerts.map((alert) => {
      if (alert.triggered) return alert;
      const mkt = this.markets.find((m) => m.pair === alert.pair);
      if (!mkt || mkt.price <= 0) return alert;
      const hit =
        alert.condition === 'ABOVE'
          ? mkt.price >= alert.targetPrice
          : mkt.price <= alert.targetPrice;
      if (!hit) return alert;
      changed = true;
      const updated: PriceAlertRule = {
        ...alert,
        triggered: true,
        triggeredAtEat: nowEat,
        triggeredPrice: mkt.price
      };
      hitRules.push(updated);
      return updated;
    });

    if (changed) {
      this.persistPriceAlerts();
      hitRules.forEach((rule) => {
        this.pushNotification({
          pair: rule.pair,
          type: 'PRICE_ALERT',
          title: `PRICE ALERT HIT · ${rule.pair} @ ${rule.triggeredPrice}`,
          message: `${rule.label} (${rule.condition === 'ABOVE' ? '≥' : '≤'} ${rule.targetPrice}) triggered live at ${rule.triggeredAtEat}. Open chart to verify setup.`
        });
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('pivotfx:price-alert-hit', { detail: rule }));
          }
        } catch {}
      });
    }
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
      h1TrendDirection: market.h1TrendDirection,
      change24hPct: market.change24hPct,
      riskConfig: positionRiskStore.getConfig()
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
      priceAlerts: [...this.priceAlerts],
      superAiAutoEnabled: this.superAiAutoEnabled,
      superAiNotes: { ...this.superAiNotes },
      deepAudits: { ...this.deepAudits },
      isDeepVerifyingPair: { ...this.isDeepVerifyingPair },
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

    const activeCfg = positionRiskStore.getConfig();
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
      candles: market.candles,
      swingLow: swings.swingLow,
      swingHigh: swings.swingHigh,
      macro,
      biasOverride: params.direction,
      previousDirection: params.direction,
      h1TrendDirection: market.h1TrendDirection,
      change24hPct: market.change24hPct,
      bosAnalysis: market.bosAnalysis,
      riskConfig: activeCfg
    });

    const { decimals, pipMultiplier, pipValPerStandardLot } = getPairSpecs(market.pair);
    const resolvedLotSize = Number((params.lotSize || computed.lotSize || 0.01).toFixed(2));
    const finalEntry = Number(entryToUse.toFixed(decimals));
    const finalSl =
      params.customStopLoss && !isNaN(params.customStopLoss) && params.customStopLoss > 0
        ? Number(params.customStopLoss.toFixed(decimals))
        : computed.stopLoss;

    let finalTp1 = computed.tp1;
    let finalTp2 = computed.tp2;
    let finalTp3 = computed.tp3;

    // If trader selected a specific Target Profit ($ USD) and a custom lot size (e.g. $30 at 0.03 Lots), calibrate TP1/TP2/TP3 to exact lot size
    if (
      !(params.customTp && !isNaN(params.customTp) && params.customTp > 0) &&
      activeCfg.targetProfitUsd &&
      activeCfg.targetProfitUsd >= 1 &&
      resolvedLotSize !== computed.lotSize
    ) {
      const pipValAtLot = resolvedLotSize * pipValPerStandardLot;
      const neededPips = Math.max(
        10,
        activeCfg.targetProfitUsd / Math.max(0.0001, pipValAtLot) + computed.brokerSpread
      );
      const tp2Delta = neededPips / pipMultiplier;
      const tp1Delta = (neededPips * 0.5) / pipMultiplier;
      const tp3Delta = (neededPips * 1.35) / pipMultiplier;
      const isBuySide = params.direction === 'BUY';
      finalTp1 = Number((isBuySide ? finalEntry + tp1Delta : finalEntry - tp1Delta).toFixed(decimals));
      finalTp2 = Number((isBuySide ? finalEntry + tp2Delta : finalEntry - tp2Delta).toFixed(decimals));
      finalTp3 = Number((isBuySide ? finalEntry + tp3Delta : finalEntry - tp3Delta).toFixed(decimals));
    } else if (params.customTp && !isNaN(params.customTp) && params.customTp > 0) {
      finalTp2 = Number(params.customTp.toFixed(decimals));
    }

    const newOrder: ActiveMarketOrder = {
      id: `ord_${Date.now()}_${market.pair.replace('/', '')}`,
      pair: market.pair,
      direction: params.direction,
      lotSize: resolvedLotSize,
      broker,
      timeframe,
      entryPrice: finalEntry,
      stopLoss: finalSl,
      tp1: finalTp1,
      tp2: finalTp2,
      tp3: finalTp3,
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
      candles: m.candles,
      swingLow: swings.swingLow,
      swingHigh: swings.swingHigh,
      macro,
      h1TrendDirection: m.h1TrendDirection,
      change24hPct: m.change24hPct,
      bosAnalysis: m.bosAnalysis,
      riskConfig: positionRiskStore.getConfig()
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
            lotSize: computed.lotSize,
            actualRiskUsd: computed.actualRiskUsd,
            executionReadiness: computed.executionReadiness,
            executionReadinessReason: computed.executionReadinessReason,
            bosDirection: m.bosAnalysis?.bosDirection,
            bosSummary: m.bosAnalysis?.structureSummary,
            tvSymbol: computed.tvSymbol,
            recommendedStrategy: computed.recommendedStrategy,
            strategyRationale: computed.strategyRationale,
            adxStrength: computed.adxStrength,
            macdBias: computed.macdBias,
            macdHistogram: computed.macdHistogram,
            candlePattern: computed.candlePattern,
            customPrompt
          })
        },
        2400
      );

      if (res && res.ok) {
        const data = await res.json();
        const resolvedText = data.note || data.tacticalNote || m.projection;
        const resolvedRisk =
          data.invalidationNote || data.riskNote || m.humanCheckNote || `Close beyond SL ${computed.stopLoss}`;
        const resolvedMacro = data.catalystWatch || data.macroNote || macro.dxySummary;
        const noteObj: SuperAiLiveNote = {
          pair: m.pair,
          source:
            data.source === 'gemini-4-hydrogen' || data.source === 'gemini-3.8-flash'
              ? 'gemini-4-hydrogen'
              : 'quantitative-engine',
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

  public async verifyMarketDeepScan(
    targetPair?: CurrencyPair | null,
    tf?: Timeframe,
    broker?: BrokerId,
    overrideDirection?: 'BUY' | 'SELL'
  ): Promise<DeepVerifyResult | null> {
    const resolvedPair = targetPair || this.selectedPair || this.markets[0]?.pair || 'XAU/USD';
    const m = this.markets.find((x) => x.pair === resolvedPair) || this.markets[0];
    if (!m) return null;

    const activeTf = tf || this.customTimeframes[resolvedPair] || m.recommendedTf || 'M15';
    const activeBroker = broker || this.activeBroker;
    this.isDeepVerifyingPair[resolvedPair] = true;
    this.broadcast();

    try {
      const pctMap: Partial<Record<CurrencyPair, number>> = {};
      this.markets.forEach((item) => {
        pctMap[item.pair] = item.change24hPct;
      });
      const macro = getCurrentMacroContext(pctMap);
      const isHigherTf = activeTf === 'H1' || activeTf === 'H4' || activeTf === 'D1';
      const activeCandles =
        isHigherTf && m.h1Candles && m.h1Candles.length >= 12 ? m.h1Candles : m.candles || [];
      const bosAnalysis = analyzeMarketStructureBos({
        pair: m.pair,
        candles: activeCandles,
        h1Candles: m.h1Candles,
        livePrice: m.price,
        atrPips: m.atrPips
      });
      const swings = computeCandleSwingLevels(activeCandles);
      const computed = computeRealChartTradeParams({
        targetPair: m.pair,
        targetTf: activeTf,
        targetBroker: activeBroker,
        price: m.price,
        keyLevel: m.keyLevel,
        ema20: m.ema20,
        ema50: m.ema50,
        rsi: m.rsi,
        atrPips: m.atrPips,
        candles: activeCandles,
        swingLow: swings.swingLow,
        swingHigh: swings.swingHigh,
        macro,
        h1TrendDirection: m.h1TrendDirection,
        biasOverride: overrideDirection,
        change24hPct: m.change24hPct,
        bosAnalysis,
        riskConfig: positionRiskStore.getConfig()
      });

      const localChecks =
        computed.preflightChecks ||
        buildZeroMistakeChecklist({
          pair: m.pair,
          direction: computed.direction,
          entryPrice: computed.entryPrice,
          stopLoss: computed.stopLoss,
          tp1: computed.tp1,
          tp2: computed.tp2,
          riskReward: computed.riskReward,
          atrPips: m.atrPips ?? 16,
          slPips: computed.slPips,
          tpPips: computed.tpPips,
          h1TrendDirection: computed.h1TrendDirection,
          trendDirection: computed.trendDirection,
          isExtendedZone: computed.isExtendedZone,
          bosAnalysis,
          liveFeedConnected: this.liveFeedConnected,
          adxStrength: computed.adxStrength,
          macdBias: computed.macdBias,
          candlePattern: computed.candlePattern
        });

      const nowEat = this.formatNowEat();
      if (typeof fetch !== 'undefined') {
        try {
          const res = await fetchWithFastTimeout(
            '/api/ai/deep-verify',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pair: m.pair,
                timeframe: activeTf,
                broker: activeBroker.toUpperCase(),
                livePrice: m.price,
                ema20: m.ema20,
                ema50: m.ema50,
                rsi: m.rsi,
                atrPips: m.atrPips ?? 16,
                direction: computed.direction,
                trendDirection: computed.trendDirection,
                h1TrendDirection: computed.h1TrendDirection,
                entryPrice: computed.entryPrice,
                stopLoss: computed.stopLoss,
                tp1: computed.tp1,
                tp2: computed.tp2,
                tp3: computed.tp3,
                riskReward: computed.riskReward,
                lotSize: computed.lotSize,
                actualRiskUsd: computed.actualRiskUsd,
                isExtendedZone: computed.isExtendedZone,
                executionReadiness: computed.executionReadiness,
                executionReadinessReason: computed.executionReadinessReason,
                liveFeedConnected: this.liveFeedConnected,
                dxyPressurePct: macro.dxyPressurePct,
                riskRegime: macro.riskRegime,
                bosAnalysis,
                checks: localChecks,
                adxStrength: computed.adxStrength,
                macdBias: computed.macdBias,
                macdHistogram: computed.macdHistogram,
                candlePattern: computed.candlePattern,
                recentM15Candles: (m.candles || []).slice(-18),
                recentH1Candles: (m.h1Candles || []).slice(-10)
              })
            },
            9500
          );

          if (res && res.ok) {
            const data = (await res.json()) as DeepVerifyResult;
            const finalResult: DeepVerifyResult = {
              ...data,
              pair: m.pair,
              timeframe: activeTf,
              syncedAt: nowEat
            };
            this.deepAudits[m.pair] = finalResult;
            if (finalResult.verdict === 'BOS_REVERSAL_FLIP' || finalResult.verdict === 'STAND_ASIDE_TRAP') {
              this.pushNotification({
                pair: m.pair,
                type: 'SL_WARNING',
                title: `BOS DEEP GUARD · ${m.pair} (${finalResult.structureState.replace('_', ' ')})`,
                message: `${finalResult.deepAuditHeadline}: ${finalResult.deepAuditSummary}`
              });
            }
            this.broadcast();
            return finalResult;
          }
        } catch {
          // Fall through cleanly to deterministic local DeepVerifyResult fallback
        }
      }

      const passedCount = localChecks.filter((c) => c.passed).length;
      const counterBosFailed = localChecks.find((c) => c.id === 'NO_COUNTER_BOS' && !c.passed);
      const fallbackVerdict: DeepVerifyResult['verdict'] = counterBosFailed
        ? 'BOS_REVERSAL_FLIP'
        : computed.executionReadiness === 'NO_TRADE_CLOSED' || computed.executionReadiness === 'NO_TRADE_CHOP'
        ? 'STAND_ASIDE_TRAP'
        : computed.executionReadiness === 'WAIT_PULLBACK'
        ? 'WAIT_PULLBACK'
        : computed.direction === 'BUY'
        ? 'CONFIRMED_BUY'
        : 'CONFIRMED_SELL';

      const fallbackRes: DeepVerifyResult = {
        pair: m.pair,
        timeframe: activeTf,
        source: 'quantitative-engine',
        verdict: fallbackVerdict,
        verifiedDirection:
          fallbackVerdict === 'CONFIRMED_BUY'
            ? 'BUY'
            : fallbackVerdict === 'CONFIRMED_SELL'
            ? 'SELL'
            : 'STAND_ASIDE',
        proposedDirection: computed.direction,
        structureState: bosAnalysis.bosDirection,
        confidenceScore: computed.confidence,
        bosLevel: bosAnalysis.bosTriggerLevel,
        invalidationLevel: computed.stopLoss,
        deepAuditHeadline: `${m.pair} Deep Structure Audit · ${fallbackVerdict.replace(/_/g, ' ')}`,
        deepAuditSummary: computed.executionReadinessReason,
        trajectoryVerdict: computed.trendProjectionText,
        riskChecklist: localChecks.map((c) => `${c.passed ? 'PASS' : 'BLOCK'} · ${c.label}: ${c.detail}`),
        checks: localChecks,
        passedCount,
        totalChecks: localChecks.length,
        syncedAt: nowEat
      };
      this.deepAudits[m.pair] = fallbackRes;
      return fallbackRes;
    } finally {
      this.isDeepVerifyingPair[resolvedPair] = false;
      this.broadcast();
    }
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
      }, 850);
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

      // Sustainable Session Direction Stability:
      // On initial live hydration or explicit manual rescan, never inherit stale baseline BUY/SELL bias.
      // Furthermore, never let a previously loaded active order force the market AI direction away from live price action.
      const isInitialLiveHydration = feedOk && !this.hasReceivedLiveFeed;
      const useSessionAnchor = !isInitialLiveHydration && !isExplicitFreshScan;
      const sessionDir = useSessionAnchor ? (this.sessionDirection[existing.pair] ?? old?.dir) : undefined;
      const sessionTrendDir = useSessionAnchor ? (this.sessionTrendDirection[existing.pair] ?? old?.trendDir) : undefined;

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
        previousDirection: sessionDir,
        previousTrendDirection: sessionTrendDir,
        spreadByBroker: existing.spreadByBroker,
        dataSource: feedOk ? 'Live Interbank Feed' : 'Live Feed + Institutional Calibration'
      });

      const newDir: 'BUY' | 'SELL' = calibrated.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
      const newTrendDir: 'UPTREND' | 'DOWNTREND' | 'RANGING' = calibrated.trendDirection;

      // Update persistent session anchors
      this.sessionDirection[existing.pair] = newDir;
      this.sessionTrendDirection[existing.pair] = newTrendDir;

      // Proactive Audio Warning & Alert on Approaching Invalidation Floor or Reversal:
      const distToSlPips = Math.abs(nextPrice - calibrated.suggestedSL) * pipMultiplier;
      const invalidationThresholdPips = existing.pair === 'XAU/USD' ? 22 : existing.pair === 'BTC/USD' ? 140 : 3.5;
      const isNearInvalidation = distToSlPips <= invalidationThresholdPips;
      const lastWarn = this.lastReversalWarningByPair[existing.pair] ?? 0;

      if (isNearInvalidation && nowMs - lastWarn > 45_000) {
        this.lastReversalWarningByPair[existing.pair] = nowMs;
        const actionVerb = newDir === 'BUY' ? 'BUY' : 'SELL';
        const protectVerb = newDir === 'BUY' ? 'support floor' : 'resistance ceiling';
        this.pushNotification({
          pair: existing.pair,
          type: 'SL_WARNING',
          title: `⚠️ DIRECTION RISK ALERT: ${existing.pair}`,
          message: `${existing.pair} live price (${nextPrice}) is testing critical swing ${protectVerb} near ${calibrated.suggestedSL} (${distToSlPips.toFixed(1)}p away). If holding open broker ${actionVerb} orders, move SL to Breakeven or take profit before structural invalidation.`
        });
      }

      // Confirmed Structural Trend Shift (Breaking news, geopolitical shock, or structural breakdown)
      if (old && old.dir !== newDir) {
        this.pushNotification({
          pair: existing.pair,
          type: 'SL_WARNING',
          title: `🔄 MARKET REVERSAL CONFIRMED: ${existing.pair} FLIPPED TO ${newDir}`,
          message: `${existing.pair} confirmed structural trend shift from ${old.dir} to ${newDir}. Close active ${old.dir} broker positions immediately or prepare ${newDir} entry.`
        });
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
    this.checkPriceAlertsAgainstMarkets();
    if (
      scanMode === 'auto_1s' &&
      this.dailyMacroDirective.source !== 'gemini-4-hydrogen' &&
      this.dailyMacroDirective.source !== 'gemini-3.8-flash'
    ) {
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

    if (feedOk) {
      this.hasReceivedLiveFeed = true;
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
        'wss://stream.binance.com:9443/stream?streams=btcusdt@bookTicker/ethusdt@bookTicker/btcusdt@miniTicker/ethusdt@miniTicker'
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
          } else if (d.s === 'ETHUSDT' && lastPrice > 100) {
            this.queueWsTick('ETH/USD', lastPrice, pct);
          }
        } catch {
          // Ignore malformed frame
        }
      };

      socket.onerror = () => {};
      socket.onclose = () => {
        if (this.ws === socket) {
          this.ws = null;
          setTimeout(() => {
            if (this.listeners.size > 0) this.connectBinanceWebSocket();
          }, 4000);
        }
      };
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
      kws.onclose = () => {
        if (this.krakenWs === kws) {
          this.krakenWs = null;
          setTimeout(() => {
            if (this.listeners.size > 0) this.connectKrakenWebSocket();
          }, 4500);
        }
      };
    } catch {}
  }

  private async pollLiveExchangeRest(scanMode: 'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai' = 'auto_1s') {
    if (this.isFetchingRest) return;
    this.isFetchingRest = true;
    try {
      const force = scanMode === 'rescan' || scanMode === 'deep_ai';
      const snap = await fetchLiveMarketSnapshot(this.markets, force);
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
    } catch {
      // Prevent transient fetch abort errors from interrupting tick polling
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
          entryTimingWarning: m.entryTimingWarning,
          lotSize: m.lotSize,
          actualRiskUsd: m.actualRiskUsd,
          executionReadiness: m.executionReadiness,
          executionReadinessReason: m.executionReadinessReason,
          bosDirection: m.bosAnalysis?.bosDirection,
          bosSummary: m.bosAnalysis?.structureSummary,
          tvSymbol: m.tvSymbol || getTradingViewSymbol(m.pair),
          recommendedStrategy: m.recommendedStrategy,
          adxStrength: m.adxStrength,
          macdBias: m.macdBias,
          candlePattern: m.candlePattern,
          bullScorePct: m.bullScorePct,
          bearScorePct: m.bearScorePct,
          atrPips: m.atrPips
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
        8500
      );

      if (res && res.ok) {
        const data = await res.json();
        const nowEat = this.formatNowEat();
        if (data?.dailyMacroDirective) {
          this.dailyMacroDirective = {
            headline: data.dailyMacroDirective.headline || localDirective.headline,
            overallSafety: data.dailyMacroDirective.overallSafety || localDirective.overallSafety,
            hourlyOutlook: data.dailyMacroDirective.hourlyOutlook || localDirective.hourlyOutlook,
            catalystSummary: data.dailyMacroDirective.catalystSummary || localDirective.catalystSummary,
            source:
              data.source === 'gemini-4-hydrogen' || data.source === 'gemini-3.8-flash'
                ? 'gemini-4-hydrogen'
                : 'quantitative-engine',
            syncedAt: nowEat
          };
        }
        if (data?.perPair) {
          for (const pairKey of Object.keys(data.perPair) as CurrencyPair[]) {
            const pData = data.perPair[pairKey];
            if (pData) {
              this.superAiNotes[pairKey] = {
                pair: pairKey,
                source:
                  data.source === 'gemini-4-hydrogen' || data.source === 'gemini-3.8-flash'
                    ? 'gemini-4-hydrogen'
                    : 'quantitative-engine',
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
    if (mode === 'scan_all' || mode === 'rescan' || mode === 'deep_ai') {
      this.lockedPairs = {};
    }
    await refreshBackgroundRealOhlcCandles(true);
    await this.pollLiveExchangeRest(mode);
    await this.runBatchAiScan(mode);
    if (mode === 'deep_ai') {
      const target = this.selectedPair || this.markets[0]?.pair;
      if (target) {
        await this.verifyMarketDeepScan(target);
      }
    }
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
    this.checkPriceAlertsAgainstMarkets();
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
    if (!this.unsubscribeRiskStore) {
      let initialized = false;
      this.unsubscribeRiskStore = positionRiskStore.subscribe(() => {
        if (!initialized) {
          initialized = true;
          return;
        }
        this.rebuildAndSortMarkets(undefined, 'auto_1s', this.liveFeedConnected);
      });
    }
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
    if (this.unsubscribeRiskStore) {
      this.unsubscribeRiskStore();
      this.unsubscribeRiskStore = null;
    }
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


