export type PageTab = 
  | 'landing'
  | '/fx-academy'
  | '/chart-mastery'
  | '/strategy-vault'
  | '/ai-scanner'
  | '/risk-management'
  | '/psychology'
  | '/live-pulse'
  | '/growth-lab'
  | '/macro-safety'
  | 'start-here'
  | 'super-analysis'
  | 'tradingview'
  | 'ai-scanner'
  | 'masterclass'
  | 'brokers'
  | 'journal'
  | 'trust-legal';

export type UserPersona = 'newbie' | 'demo_losing' | 'scanner_only';

export type BrokerId = 'fxpesa' | 'hfm' | 'exness' | 'fbs';

export interface BrokerInfo {
  id: BrokerId;
  name: string;
  badge: string;
  cmaLicensed: boolean;
  regulation: string;
  mpesaSupport: string;
  minDeposit: string;
  baseSpread: number;
  currentSpread: number;
  leverage: string;
  maxLeverageRatio: number;
  platforms: string[];
  trustScore: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  demoUrl: string;
  realUrl: string;
}

export type CurrencyPair = 'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'GBP/JPY' | 'XAU/USD' | 'AUD/USD' | 'USD/CAD' | 'BTC/USD';

export type Timeframe = 'M1' | 'M5' | 'M10' | 'M15' | 'H1' | 'H4' | 'D1';

export interface PillarLesson {
  id: string;
  number: string;
  title: string;
  levelTag: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro / Institutional' | 'Advanced ICT' | 'Beginner & Intermediate' | 'Core Execution';
  duration: string;
  summary: string;
  concept: string;
  bulletPoints: string[];
  illustration: {
    type: 'chart' | 'diagram' | 'table' | 'formula' | 'steplist';
    title: string;
    caption: string;
    content: string;
  };
  realWorldExample: {
    pair: string;
    context: string;
    setup: string;
    outcome: string;
    keyTakeaway: string;
  };
  actionableChecklist: string[];
}

export interface PillarData {
  id: PageTab;
  route: string;
  number: string;
  title: string;
  subtitle: string;
  oneLineHook: string;
  badge: string;
  category: 'Foundation' | 'Technical' | 'Strategy' | 'Execution' | 'Risk & Mindset' | 'Institutional';
  overview: string;
  learningOutcomes: string[];
  lessons: PillarLesson[];
}

export interface JournalTrade {
  id: string;
  timestamp: string;
  pair: CurrencyPair;
  type: 'BUY' | 'SELL';
  lotSize?: number;
  entryPrice: number;
  exitPrice?: number;
  pnlUsd?: number;
  status: 'WON' | 'LOST' | 'OPEN' | 'BREAKEVEN';
  setupName?: string;
  mistakeTag?: string;
  notes: string;
  broker?: BrokerId;
  score?: number;
  mode?: string;
  riskUsd?: number;
}

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
  score: number;
  verdict: 'WAIT_CHOP' | 'RISKY_EXTENDED' | 'HIGH_PROBABILITY_BUY' | 'HIGH_PROBABILITY_SELL';
  title: string;
  recommendation: string;
  suggestedStake: number;
  suggestedLotSize: number;
  stopLossPips: number;
  takeProfitPips: number;
  riskReward: string;
  reasons: string[];
  aiSynthesis?: {
    sentimentSummary: string;
    keyRiskFactor: string;
    institutionalFootprint: string;
    tradePlanSteps: string[];
  };
  historicalReference: {
    title: string;
    description: string;
    caseType: 'warning_loss' | 'validated_win';
  };
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

export interface ScannerAnalysisResult {
  pair: CurrencyPair;
  timeframe: Timeframe;
  price: number;
  ema20: number;
  ema50: number;
  rsi: number;
  score: number;
  confidencePercent?: number;
  verdict: 'WAIT' | 'RISKY' | 'HIGH_PROBABILITY_BUY' | 'HIGH_PROBABILITY_SELL';
  analysisMode?: 'standard' | 'deep_ai';
  trend?: string;
  projection?: string;
  orderType?: string;
  detectedPattern: string;
  stopLoss: number;
  takeProfit: number;
  tp1Price?: number;
  tp2Price?: number;
  riskReward?: string;
  suggestedLot: number;
  reasoning: string[];
  howToPlaceSteps?: string[];
  brokerDashboard?: {
    broker: BrokerId;
    symbol: string;
    spreadPips: number;
    leverage: string;
    marginCostUsd: number;
    serverName: string;
    instructions: string[];
  };
}

export interface LessonSample {
  title: string;
  type: 'win_case' | 'loss_case' | 'broker_sample' | 'math_sample' | 'chart_sample';
  description: string;
  mathSnippet?: string;
  chartDataHint?: string;
  takeaway: string;
}

export interface SubTopic {
  id: string;
  title: string;
  bulletPoints: string[];
  practicalSample?: LessonSample;
}

export interface MasterclassLesson {
  id: string;
  belt: 'white' | 'blue' | 'purple' | 'black' | 'master' | 'ict';
  levelTag: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro / Institutional' | 'ICT Institutional Master';
  number: string;
  title: string;
  duration: string;
  summary: string;
  learningObjectives?: string[];
  content: string[];
  subTopics?: SubTopic[];
  realTimeNote: string;
  chartIllustrationType: 'candlestick_anatomy' | 'pinbar_tower' | 'ema_crossover' | 'rsi_divergence' | 'sessions_eat' | 'spread_trap' | 'two_dollar_rule' | 'fvg_imbalance' | 'order_block' | 'liquidity_pool' | 'judas_swing';
  samplesAndCases?: LessonSample[];
  liveMarketExample?: string;
  tvSymbol?: string;
  tvTimeframe?: string;
  tvNavButtonLesson?: {
    buttonName: string;
    shortcut?: string;
    action: string;
    howToSample: string;
  };
  practiceExercise?: {
    prompt: string;
    actionHint: string;
    toolTarget?: PageTab;
  };
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
