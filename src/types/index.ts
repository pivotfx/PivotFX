export type PageTab = 
  | 'start-here'
  | 'super-analysis'
  | 'tradingview'
  | 'ai-scanner'
  | 'masterclass'
  | 'brokers'
  | 'journal'
  | 'trust-legal';

export type UserPersona = 'newbie' | 'demo_losing' | 'scanner_only';

export type BrokerId = 'fxpesa' | 'hfm' | 'fbs';

export interface BrokerInfo {
  id: BrokerId;
  name: string;
  badge: string;
  cmaLicensed: boolean;
  regulation: string;
  mpesaSupport: string;
  minDeposit: string;
  baseSpread: number; // EURUSD pips
  currentSpread: number;
  leverage: string;
  maxLeverageRatio: number;
  platforms: string[];
  trustScore: number; // out of 10
  pros: string[];
  cons: string[];
  bestFor: string;
  demoUrl: string;
  realUrl: string;
}

export type CurrencyPair = 'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'GBP/JPY' | 'XAU/USD' | 'AUD/USD' | 'USD/CAD';

export type Timeframe = 'M1' | 'M5' | 'M15' | 'H1' | 'H4' | 'D1';

export interface AnalysisInput {
  broker: BrokerId;
  pair: CurrencyPair;
  timeframe: Timeframe;
  price: number;
  ema20: number;
  ema50: number;
  rsi: number;
}

export interface AnalysisResult {
  score: number; // 0 to 100
  verdict: 'WAIT_CHOP' | 'RISKY_EXTENDED' | 'HIGH_PROBABILITY_BUY' | 'HIGH_PROBABILITY_SELL';
  title: string;
  recommendation: string;
  suggestedStake: number; // $2 rule or lot size
  suggestedLotSize: number;
  stopLossPips: number;
  takeProfitPips: number;
  riskReward: string;
  reasons: string[];
  historicalReference: {
    title: string;
    description: string;
    caseType: 'warning_loss' | 'validated_win';
  };
}

export interface JournalTrade {
  id: string;
  timestamp: string;
  pair: CurrencyPair;
  broker: BrokerId;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  score: number;
  mode: string;
  riskUsd: number;
  pnlUsd?: number;
  status: 'OPEN' | 'WON' | 'LOST' | 'BREAKEVEN';
  notes: string;
}

export interface MasterclassLesson {
  id: string;
  belt: 'white' | 'blue' | 'purple' | 'black' | 'master';
  number: string;
  title: string;
  duration: string;
  summary: string;
  content: string[];
  realTimeNote: string;
  chartIllustrationType: 'candlestick_anatomy' | 'pinbar_tower' | 'ema_crossover' | 'rsi_divergence' | 'sessions_eat' | 'spread_trap' | 'two_dollar_rule';
  liveMarketExample: string;
  homework: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface MasterclassStrategy {
  id: string;
  name: string;
  tagline: string;
  winRate: number;
  timeframe: string;
  indicators: string[];
  rules: {
    entry: string[];
    stopLoss: string;
    takeProfit: string;
  };
  gilgilLore: string;
}

export interface ScannerScanResult {
  source: 'chart' | 'camera';
  pair: CurrencyPair;
  timeframe: Timeframe;
  price: number;
  ema20: number;
  ema50: number;
  rsi: number;
  detectedPattern: string;
  score: number;
  confidencePercent: number;
  similarityToWin: number;
  similarityToLoss: number;
  recommendation: string;
  timestamp: string;
}
