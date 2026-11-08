export interface JournalTrade {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2?: number;
  lotSize: number; // 0.01 micro lot
  riskUsd: number; // Max $2.00 cap
  status: 'OPEN' | 'WON' | 'LOST' | 'CLOSED';
  pnlUsd?: number;
  pnlPips?: number;
  executedAt: string; // ISO string
  notes?: string;
  confluenceStars?: number;
  brokerTarget?: string; // 'FXPesa' | 'Exness' | 'MetaTrader'
}

export interface PropAccountConfig {
  accountSize: number; // 10000, 25000, 50000, 100000, 200000
  accountName: string;
  maxDailyLossPct: number; // Default 4% ($2,000 on $50k)
  maxTotalDrawdownPct: number; // Default 8% ($4,000 on $50k)
  currentBalance: number;
  currentEquity: number;
  todayLossUsd: number;
  totalDrawdownUsd: number;
  isCircuitBreakerTripped: boolean;
  lockoutReason?: string;
}

export interface RedFolderNewsEvent {
  id: string;
  currency: string; // 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'OIL' | 'BTC'
  pairsAffected: string[];
  title: string;
  impact: 'HIGH' | 'MEDIUM';
  minutesUntilRelease: number; // Dynamic relative minutes
  forecast?: string;
  previous?: string;
  lockoutActive: boolean; // True if within 15 min
}

export interface ConfluenceMatrixItem {
  pair: string;
  m5: 'BUY' | 'SELL' | 'NEUTRAL';
  m15: 'BUY' | 'SELL' | 'NEUTRAL';
  h1: 'BUY' | 'SELL' | 'NEUTRAL';
  h4: 'BUY' | 'SELL' | 'NEUTRAL';
  stars: number; // 1 to 4
  bias: 'STRONG BUY' | 'BUY' | 'STRONG SELL' | 'SELL' | 'MIXED';
  isInstitutionalLock: boolean;
}
