import { JournalTrade, PropAccountConfig, RedFolderNewsEvent, ConfluenceMatrixItem } from '../types/propDesk';

const JOURNAL_KEY = 'pivotfx_prop_journal_v1';
const PROP_ACCOUNT_KEY = 'pivotfx_prop_account_v1';

// Initial sample trades showcasing 0.01 micro lot discipline & high R:R
const INITIAL_JOURNAL_TRADES: JournalTrade[] = [
  {
    id: 'tr-001',
    pair: 'GBP/USD',
    direction: 'BUY',
    entryPrice: 1.3490,
    stopLoss: 1.3470,
    tp1: 1.3540,
    tp2: 1.3590,
    lotSize: 0.01,
    riskUsd: 2.00,
    status: 'WON',
    pnlUsd: 5.00,
    pnlPips: 50,
    executedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Clean 15M 20 EMA pullback bounce during London-Nairobi overlap.',
    confluenceStars: 4,
    brokerTarget: 'FXPesa',
  },
  {
    id: 'tr-002',
    pair: 'EUR/USD',
    direction: 'BUY',
    entryPrice: 1.1610,
    stopLoss: 1.1590,
    tp1: 1.1660,
    tp2: 1.1710,
    lotSize: 0.01,
    riskUsd: 2.00,
    status: 'WON',
    pnlUsd: 5.00,
    pnlPips: 50,
    executedAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'DXY rejection at daily resistance anchored with 4-star confluence.',
    confluenceStars: 4,
    brokerTarget: 'Exness',
  },
  {
    id: 'tr-003',
    pair: 'USD/JPY',
    direction: 'SELL',
    entryPrice: 158.40,
    stopLoss: 158.60,
    tp1: 157.90,
    tp2: 157.40,
    lotSize: 0.01,
    riskUsd: 1.80,
    status: 'WON',
    pnlUsd: 4.50,
    pnlPips: 50,
    executedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    notes: 'BoJ intervention defense level retested.',
    confluenceStars: 3,
    brokerTarget: 'FXPesa',
  },
  {
    id: 'tr-004',
    pair: 'XAU/USD',
    direction: 'BUY',
    entryPrice: 3945.0,
    stopLoss: 3935.0,
    tp1: 3970.0,
    tp2: 3995.0,
    lotSize: 0.01,
    riskUsd: 1.95,
    status: 'WON',
    pnlUsd: 7.50,
    pnlPips: 250,
    executedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: 'Gold breakout from 4H ascending triangle on safe-haven flow.',
    confluenceStars: 4,
    brokerTarget: 'MetaTrader 5',
  },
];

export const DEFAULT_PROP_ACCOUNT: PropAccountConfig = {
  accountSize: 50000,
  accountName: 'Dennis.K.M Prop Desk $50K Evaluation',
  maxDailyLossPct: 4, // 4% = $2,000
  maxTotalDrawdownPct: 8, // 8% = $4,000
  currentBalance: 51280,
  currentEquity: 51280,
  todayLossUsd: 18.5,
  totalDrawdownUsd: 240,
  isCircuitBreakerTripped: false,
};

// Scheduled High-Impact Institutional Economic Releases
export const SCHEDULED_RED_FOLDER_EVENTS: RedFolderNewsEvent[] = [
  {
    id: 'ev-cpi-us',
    currency: 'USD',
    pairsAffected: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD', 'USD/CHF', 'AUD/USD', 'XAU/USD', 'BTC/USD', 'US30', 'NAS100'],
    title: 'US Core CPI m/m & Headline Inflation',
    impact: 'HIGH',
    minutesUntilRelease: 38,
    forecast: '0.3%',
    previous: '0.2%',
    lockoutActive: false,
  },
  {
    id: 'ev-fomc',
    currency: 'USD',
    pairsAffected: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD', 'US30', 'NAS100'],
    title: 'FOMC Federal Funds Rate Decision & Press Conference',
    impact: 'HIGH',
    minutesUntilRelease: 185,
    forecast: '4.50%',
    previous: '4.75%',
    lockoutActive: false,
  },
  {
    id: 'ev-boe',
    currency: 'GBP',
    pairsAffected: ['GBP/USD', 'GBP/JPY'],
    title: 'Bank of England Monetary Policy Committee Official Bank Rate',
    impact: 'HIGH',
    minutesUntilRelease: 84,
    forecast: '4.25%',
    previous: '4.50%',
    lockoutActive: false,
  },
  {
    id: 'ev-ecb',
    currency: 'EUR',
    pairsAffected: ['EUR/USD', 'EUR/JPY', 'GER40'],
    title: 'ECB Main Refinancing Rate & Lagarde Presser',
    impact: 'HIGH',
    minutesUntilRelease: 260,
    forecast: '3.00%',
    previous: '3.25%',
    lockoutActive: false,
  },
  {
    id: 'ev-crude',
    currency: 'OIL',
    pairsAffected: ['USOIL', 'USD/CAD'],
    title: 'EIA Weekly Crude Oil Stockpiles Change',
    impact: 'HIGH',
    minutesUntilRelease: 52,
    forecast: '-1.4M',
    previous: '+2.1M',
    lockoutActive: false,
  },
];

// Helper: Check if a pair is currently under red-folder lockout (<= 15m away)
export function checkPairNewsLockout(pair: string): RedFolderNewsEvent | null {
  for (const ev of SCHEDULED_RED_FOLDER_EVENTS) {
    if (ev.pairsAffected.includes(pair) && ev.minutesUntilRelease <= 15) {
      return ev;
    }
  }
  return null;
}

// Storage managers
export function getStoredJournalTrades(): JournalTrade[] {
  if (typeof window === 'undefined') return INITIAL_JOURNAL_TRADES;
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(INITIAL_JOURNAL_TRADES));
      return INITIAL_JOURNAL_TRADES;
    }
    return JSON.parse(raw) as JournalTrade[];
  } catch {
    return INITIAL_JOURNAL_TRADES;
  }
}

export function saveJournalTrade(trade: Omit<JournalTrade, 'id' | 'executedAt'>): JournalTrade {
  const current = getStoredJournalTrades();
  const newTrade: JournalTrade = {
    ...trade,
    id: `tr-${Date.now().toString().slice(-6)}`,
    executedAt: new Date().toISOString(),
  };
  const updated = [newTrade, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
  }
  return newTrade;
}

export function updateJournalTradeStatus(
  id: string,
  status: 'WON' | 'LOST' | 'CLOSED',
  pnlUsd: number,
  pnlPips: number
): JournalTrade[] {
  const current = getStoredJournalTrades();
  const updated = current.map((t) => (t.id === id ? { ...t, status, pnlUsd, pnlPips } : t));
  if (typeof window !== 'undefined') {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteJournalTrade(id: string): JournalTrade[] {
  const current = getStoredJournalTrades();
  const updated = current.filter((t) => t.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getStoredPropAccount(): PropAccountConfig {
  if (typeof window === 'undefined') return DEFAULT_PROP_ACCOUNT;
  try {
    const raw = localStorage.getItem(PROP_ACCOUNT_KEY);
    if (!raw) {
      localStorage.setItem(PROP_ACCOUNT_KEY, JSON.stringify(DEFAULT_PROP_ACCOUNT));
      return DEFAULT_PROP_ACCOUNT;
    }
    return JSON.parse(raw) as PropAccountConfig;
  } catch {
    return DEFAULT_PROP_ACCOUNT;
  }
}

export function savePropAccount(config: PropAccountConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROP_ACCOUNT_KEY, JSON.stringify(config));
  }
}

export function exportJournalToCsv(trades: JournalTrade[]): void {
  if (typeof window === 'undefined' || trades.length === 0) return;
  const headers = ['ID', 'Pair', 'Direction', 'Entry Price', 'Stop Loss', 'TP1', 'Lot Size', 'Risk $', 'Status', 'P&L $', 'Pips', 'Stars', 'Date', 'Notes'];
  const rows = trades.map((t) => [
    t.id,
    t.pair,
    t.direction,
    t.entryPrice,
    t.stopLoss,
    t.tp1,
    t.lotSize,
    t.riskUsd,
    t.status,
    t.pnlUsd ?? 0,
    t.pnlPips ?? 0,
    t.confluenceStars ?? 4,
    t.executedAt,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `PivotFx_Prop_Journal_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 4-Timeframe Confluence Generator across all 15 instruments
export function computeConfluenceMatrix(
  pairTrends: Record<string, 'BUY' | 'SELL' | 'NEUTRAL'>
): ConfluenceMatrixItem[] {
  const PAIRS_15 = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'GBP/JPY', 'USD/CHF',
    'EUR/JPY', 'USD/CAD', 'AUD/USD', 'XAU/USD', 'BTC/USD',
    'ETH/USD', 'US30', 'NAS100', 'GER40', 'USOIL',
  ];

  return PAIRS_15.map((pair) => {
    const primary = pairTrends[pair] || 'BUY';
    const isPrimaryBuy = primary === 'BUY';

    // Model realistic multi-timeframe alignment
    // Pairs aligned with the primary trend yield higher confluence
    let m5: 'BUY' | 'SELL' | 'NEUTRAL' = isPrimaryBuy ? 'BUY' : 'SELL';
    let m15: 'BUY' | 'SELL' | 'NEUTRAL' = isPrimaryBuy ? 'BUY' : 'SELL';
    let h1: 'BUY' | 'SELL' | 'NEUTRAL' = isPrimaryBuy ? 'BUY' : 'SELL';
    let h4: 'BUY' | 'SELL' | 'NEUTRAL' = isPrimaryBuy ? 'BUY' : 'SELL';

    // Give high institutional confluence to trend leaders
    const isGoldOrBtc = pair === 'XAU/USD' || pair === 'BTC/USD' || pair === 'GBP/USD';
    if (!isGoldOrBtc && pair === 'USD/CAD') {
      m5 = 'NEUTRAL';
    } else if (pair === 'GER40') {
      m5 = isPrimaryBuy ? 'BUY' : 'SELL';
      h4 = isPrimaryBuy ? 'BUY' : 'SELL';
    }

    const buyCount = [m5, m15, h1, h4].filter((x) => x === 'BUY').length;
    const sellCount = [m5, m15, h1, h4].filter((x) => x === 'SELL').length;

    let stars = 3;
    let bias: 'STRONG BUY' | 'BUY' | 'STRONG SELL' | 'SELL' | 'MIXED' = 'BUY';
    let isInstitutionalLock = false;

    if (buyCount === 4) {
      stars = 4;
      bias = 'STRONG BUY';
      isInstitutionalLock = true;
    } else if (sellCount === 4) {
      stars = 4;
      bias = 'STRONG SELL';
      isInstitutionalLock = true;
    } else if (buyCount === 3) {
      stars = 3;
      bias = 'BUY';
    } else if (sellCount === 3) {
      stars = 3;
      bias = 'SELL';
    } else {
      stars = 2;
      bias = 'MIXED';
    }

    return {
      pair,
      m5,
      m15,
      h1,
      h4,
      stars,
      bias,
      isInstitutionalLock,
    };
  });
}
