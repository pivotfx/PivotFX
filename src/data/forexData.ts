import { BrokerInfo, CurrencyPair, MasterclassLesson, MasterclassStrategy, JournalTrade } from '../types';

export const BROKERS: BrokerInfo[] = [
  {
    id: 'fxpesa',
    name: 'FXPesa',
    badge: 'CMA Licensed (Kenya)',
    cmaLicensed: true,
    regulation: 'CMA Kenya (Regulated Non-Dealing Online Forex Broker, EGM Securities Ltd)',
    mpesaSupport: 'Instant Lipa Na M-Pesa (Direct Paybill, 0% Fee, withdrawals within 15 mins)',
    minDeposit: '$5 (Approx 650 KES)',
    baseSpread: 1.2,
    currentSpread: 1.2,
    leverage: 'Up to 1:400 (CMA Consumer Capped)',
    maxLeverageRatio: 400,
    platforms: ['MT4', 'MT5', 'FXPesa Trader Web'],
    trustScore: 9.8,
    pros: [
      'Locally CMA regulated in Nairobi, Kenya — investor protection',
      'Direct Lipa Na M-Pesa automatic deposit & withdrawal (no P2P, no bank hold)',
      'Local physical office in Westlands, Nairobi with Swahili & English phone support',
      'No overseas tax / wire conversion penalties'
    ],
    cons: [
      'Leverage capped at 1:400 by CMA (which actually saves beginners from blowing accounts)',
      'Standard account spreads slightly wider during midnight rollover'
    ],
    bestFor: 'All Kenyan traders wanting peace of mind, fast M-Pesa payouts, and legal regulatory safety.',
    demoUrl: 'https://www.fxpesa.com/ke-en/',
    realUrl: 'https://www.fxpesa.com/ke-en/'
  },
  {
    id: 'hfm',
    name: 'HFM (HF Markets)',
    badge: 'Offshore / Multi-Regulated',
    cmaLicensed: false,
    regulation: 'Seychelles (FSA), St. Vincent (SVG), Cyprus (CySEC)',
    mpesaSupport: 'M-Pesa supported via third-party payment gateway (DusuPay / Paystack)',
    minDeposit: '$5 (Approx 650 KES)',
    baseSpread: 1.1,
    currentSpread: 1.1,
    leverage: 'Up to 1:1000 (Very High)',
    maxLeverageRatio: 1000,
    platforms: ['MT4', 'MT5', 'HFM App'],
    trustScore: 8.7,
    pros: [
      'Very high leverage up to 1:1000 for experienced micro-lot scalpers',
      'Wide asset variety including international indices & commodities',
      'Low minimum deposit and copy trading features'
    ],
    cons: [
      'Offshore entity — NOT regulated by Capital Markets Authority (CMA) Kenya',
      'M-Pesa deposits go through payment aggregators which can sometimes experience network delays'
    ],
    bestFor: 'Experienced traders seeking high 1:1000 leverage who understand offshore counterparty risk.',
    demoUrl: 'https://www.hfm.com/',
    realUrl: 'https://www.hfm.com/'
  },
  {
    id: 'fbs',
    name: 'FBS',
    badge: 'Offshore (Belize/Vanuatu)',
    cmaLicensed: false,
    regulation: 'FSC Belize, CySEC Europe (for EU clients)',
    mpesaSupport: 'M-Pesa via third party payment gateway / Crypto',
    minDeposit: '$5 (Approx 650 KES)',
    baseSpread: 1.3,
    currentSpread: 1.3,
    leverage: 'Up to 1:3000 (Extremely High - High Risk)',
    maxLeverageRatio: 3000,
    platforms: ['MT4', 'MT5', 'FBS Trader'],
    trustScore: 8.2,
    pros: [
      'Ultra high leverage available up to 1:3000',
      'Regular demo contests and bonus promotions',
      'Cent accounts available for micro balance testing'
    ],
    cons: [
      'Offshore entity without local Kenyan CMA supervision',
      'Extreme 1:3000 leverage will wipe a beginner in seconds if not using the $2 rule',
      'Withdrawal processing requires strict tiered KYC verification'
    ],
    bestFor: 'Cent-account traders testing automated EA bots on ultra-high offshore leverage.',
    demoUrl: 'https://fbs.com/',
    realUrl: 'https://fbs.com/'
  },
  {
    id: 'exness',
    name: 'Exness',
    badge: 'Global Tier-1 / Raw Spread',
    cmaLicensed: false,
    regulation: 'FSA Seychelles, CBCS Curaçao, FSC BVI, FSCA South Africa, CySEC Europe',
    mpesaSupport: 'Instant M-Pesa automated gateway (Instant 24/7 deposits & withdrawals, 0% fee)',
    minDeposit: '$10 (Approx 1,300 KES)',
    baseSpread: 0.6,
    currentSpread: 0.6,
    leverage: 'Up to 1:2000 / Unlimited (Dynamic Margin)',
    maxLeverageRatio: 2000,
    platforms: ['MT4', 'MT5', 'Exness Terminal', 'Exness Trade App'],
    trustScore: 9.4,
    pros: [
      'Raw Spread & Pro accounts with near-zero 0.0 - 0.6 pip spreads on EUR/USD',
      'Instant automated M-Pesa withdrawals processed by computer algorithm in under 3 minutes',
      'Negative balance protection and stop-out protection algorithm for volatile sessions',
      'Unlimited dynamic leverage for low-capital micro lot precision trading'
    ],
    cons: [
      'Not CMA licensed in Kenya (regulated by FSCA South Africa and CySEC Europe)',
      'Unlimited leverage requires discipline: strictly obey the Gilgil $2 capital shield rule'
    ],
    bestFor: 'High-speed algorithmic EA execution, scalpers needing ultra-raw spreads and instant M-Pesa.',
    demoUrl: 'https://www.exness.com/',
    realUrl: 'https://www.exness.com/'
  }
];

export const PAIRS_PRESETS: Record<CurrencyPair, { defaultPrice: number; pipDecimals: number; pipValueKes: number }> = {
  'EUR/USD': { defaultPrice: 1.12670, pipDecimals: 5, pipValueKes: 130 },
  'GBP/USD': { defaultPrice: 1.34998, pipDecimals: 5, pipValueKes: 130 },
  'USD/JPY': { defaultPrice: 158.250, pipDecimals: 3, pipValueKes: 110 },
  'GBP/JPY': { defaultPrice: 213.635, pipDecimals: 3, pipValueKes: 110 },
  'USD/CHF': { defaultPrice: 0.87850, pipDecimals: 5, pipValueKes: 130 },
  'EUR/JPY': { defaultPrice: 172.850, pipDecimals: 3, pipValueKes: 110 },
  'XAU/USD': { defaultPrice: 3955.00, pipDecimals: 2, pipValueKes: 130 },
  'AUD/USD': { defaultPrice: 0.70151, pipDecimals: 5, pipValueKes: 130 },
  'USD/CAD': { defaultPrice: 1.39350, pipDecimals: 5, pipValueKes: 120 },
  'BTC/USD': { defaultPrice: 80491.43, pipDecimals: 2, pipValueKes: 130 },
  'ETH/USD': { defaultPrice: 2845.50, pipDecimals: 2, pipValueKes: 130 },
  'US30': { defaultPrice: 43850.0, pipDecimals: 1, pipValueKes: 130 },
  'NAS100': { defaultPrice: 20950.0, pipDecimals: 1, pipValueKes: 130 },
  'GER40': { defaultPrice: 19420.0, pipDecimals: 1, pipValueKes: 130 },
  'USOIL': { defaultPrice: 71.45, pipDecimals: 2, pipValueKes: 130 },
};

// Gilgil Historical Case Studies (Calibrated to Contemporary Market Benchmarks)
export const HISTORICAL_GILGIL_CASES = {
  towerLoss: {
    symbol: 'GBP/USD (1.35450 Trap) / XAU/USD Parabolic Spike',
    price: 1.35450,
    date: 'Gilgil Live Trading Session — The Turning Point',
    description: 'Entered LONG at 1.35450 after 4 consecutive green M15 candles. Price was 42 pips above the 20 EMA (1.35030) and 68 pips above 50 EMA (1.34770). RSI was 83.2 (severe overbought divergence). No stop loss was set, and the position was oversized above 0.01 micro lot. A brutal Tower Top reversal wick formed within 15 minutes, cascading down 70+ pips toward 1.34720.',
    lesson: 'NEVER chase candles extended far away from the 20 EMA when RSI is > 75. Always verify live chart price and place Stop Loss on the valid MT4 side.',
  },
  towerWin: {
    symbol: 'GBP/USD (1.35100 Short) / XAU/USD Pullback',
    price: 1.35100,
    exitPrice: 1.34780,
    date: 'Gilgil Live Trading Session — The Disciplined Execution',
    description: 'Patiently waited for the Tower Top exhaustion to confirm at 1.35450. Price printed a long upper rejection pinbar, closed below the 20 EMA (1.35180) on M15, with RSI resetting below 50. Executed SELL at 1.35100 with a strict $2 risk stop loss above structure at 1.35260 (SL > Entry for Sell) and Take Profit at 1.34780 (TP < Entry). Clean +32.0 pips (+2.0R return).',
    lesson: 'Wait for the Tower to exhaust and confirm the 20 EMA break. Keep SL > Entry on Sells and SL < Entry on Buys so MT4 executes cleanly with $2.00 max risk.',
  }
};

export const SAMPLE_INITIAL_JOURNAL: JournalTrade[] = [
  {
    id: 'tr-01',
    timestamp: '2026-10-28 11:22 EAT',
    pair: 'GBP/USD',
    broker: 'fxpesa',
    type: 'SELL',
    entryPrice: 1.35100,
    exitPrice: 1.34780,
    score: 92,
    mode: 'Tower Reversal + EMA Retest',
    riskUsd: 2.00,
    pnlUsd: 7.20,
    status: 'WON',
    notes: 'Classic Gilgil setup on GBP/USD. M15 upper wick rejection at 1.35450, crossed below 20 EMA, RSI was 62 turning down. Took profit at 1.34780 support.'
  },
  {
    id: 'tr-02',
    timestamp: '2026-10-25 15:45 EAT',
    pair: 'EUR/USD',
    broker: 'fxpesa',
    type: 'BUY',
    entryPrice: 1.12520,
    exitPrice: 1.12850,
    score: 86,
    mode: 'EMA 20/50 Dynamic Bounce',
    riskUsd: 2.00,
    pnlUsd: 6.60,
    status: 'WON',
    notes: 'London/NY session confluence. Clean pullback to 50 EMA, bullish engulfing candle with RSI at 48.'
  },
  {
    id: 'tr-03',
    timestamp: '2026-10-22 09:10 EAT',
    pair: 'GBP/JPY',
    broker: 'hfm',
    type: 'BUY',
    entryPrice: 214.200,
    exitPrice: 213.920,
    score: 34,
    mode: 'FOMO Chase (Historical Mistake Sample)',
    riskUsd: 2.00,
    pnlUsd: -2.00,
    status: 'LOST',
    notes: 'Bought at the top of an extended move far from EMA 20 with RSI 82. Strict $2 stop loss saved the account from total destruction.'
  },
  {
    id: 'tr-04',
    timestamp: '2026-10-18 11:05 EAT',
    pair: 'EUR/USD',
    broker: 'fxpesa',
    type: 'SELL',
    entryPrice: 1.12900,
    exitPrice: 1.12600,
    score: 89,
    mode: 'London Open 11:00 AM EAT Breakout',
    riskUsd: 2.00,
    pnlUsd: 6.00,
    status: 'WON',
    notes: 'London session volume burst broke Asian session low. Retested 20 EMA on M5 and dumped.'
  }
];

export const MASTERCLASS_LESSONS: MasterclassLesson[] = [
  // White Belt
  {
    id: 'w-1',
    belt: 'white',
    levelTag: 'Beginner',
    number: '01',
    title: 'What Is Forex & The Kenya Broker Reality',
    duration: '8 mins',
    summary: 'Understanding currency pairs, how exchange rates move, and why CMA regulation matters in Kenya.',
    learningObjectives: [
      'Master the Base vs Quote currency quoting mechanism on MT4/MT5.',
      'Differentiate between CMA-licensed Kenya brokers (FXPesa) and offshore entities (HFM, FBS).',
      'Understand how interbank spreads are paid in Kenyan Shillings.'
    ],
    content: [
      'Forex (Foreign Exchange) is simply exchanging one national currency for another — like exchanging Kenyan Shillings (KES) for US Dollars (USD). In forex trading, currencies are quoted in pairs like EUR/USD.',
      'The first currency is the BASE currency, and the second is the QUOTE currency. When EUR/USD is 1.1267, it means 1 Euro costs 1.1267 US Dollars.',
      'In Kenya, there are TWO distinct broker categories: CMA Regulated (like FXPesa, licensed by the Capital Markets Authority in Nairobi under EGM Securities) and Offshore Brokers (like HFM and FBS, licensed in Seychelles or Belize).',
      'With FXPesa, you deposit directly via Lipa Na M-Pesa with zero delay and local legal protection. With offshore brokers, you get higher leverage (1:1000+) but no Kenyan ombudsman if something goes wrong.'
    ],
    realTimeNote: 'Current Market Status: Major forex pairs trade 24 hours a day, 5 days a week from Monday morning Tokyo open to Friday evening New York close.',
    chartIllustrationType: 'candlestick_anatomy',
    samplesAndCases: [
      {
        title: 'Sample Case: EUR/USD Price Quote Breakdown',
        type: 'broker_sample',
        description: 'EUR/USD quoted at Bid: 1.1267 / Ask: 1.1269 on FXPesa MT4.',
        mathSnippet: 'Spread = Ask (1.1269) - Bid (1.1267) = 0.0002 = 2.0 Pips. On a 0.01 micro lot, 2.0 pips cost approx $0.20 (26 KES).',
        takeaway: 'Always check the spread before placing an order. Wide spreads increase your hurdle to breakeven.'
      },
      {
        title: 'Kenyan Reality: FXPesa vs Offshore Dispute Resolution',
        type: 'broker_sample',
        description: 'A trader has an unresolved withdrawal issue. FXPesa is supervised by CMA Kenya (Westlands office). Offshore brokers have desks in Seychelles or Vanuatu with no local recourse.',
        takeaway: 'Beginners should always protect their principal by starting with CMA-regulated accounts.'
      }
    ],
    practiceExercise: {
      prompt: 'Open the Broker Hub in Pillar 06 and compare the live floating spread of FXPesa against HFM.',
      actionHint: 'Notice how FXPesa spread fluctuates around 1.2 pips while offshore leverage is higher.',
      toolTarget: 'brokers'
    },
    liveMarketExample: 'Check EUR/USD right now on your screen. You will see two prices: Bid (what you sell for) and Ask (what you buy for). The gap between them is the broker spread.',
    homework: 'Open your FXPesa demo account and locate EUR/USD and GBP/USD in the Market Watch window.',
    quiz: {
      question: 'Which broker in Kenya is officially licensed by the Capital Markets Authority (CMA)?',
      options: ['FBS', 'FXPesa (EGM Securities)', 'HFM', 'TickWealth (Deriv)'],
      correctIndex: 1,
      explanation: 'FXPesa is CMA-licensed in Kenya under EGM Securities Ltd. HFM and FBS are offshore, and Deriv/TickWealth is for synthetic indices.'
    }
  },
  {
    id: 'w-2',
    belt: 'white',
    levelTag: 'Beginner',
    number: '02',
    title: 'How to Use MT4, MT5 & Lipa Na M-Pesa',
    duration: '10 mins',
    summary: 'Navigating MetaTrader on phone and laptop, placing your first micro lot, and managing Kenyan mobile money.',
    learningObjectives: [
      'Navigate MT4/MT5 Quotes, Charts, Trade, and History tabs.',
      'Calculate micro lot (0.01) pip risk on EUR/USD in KES.',
      'Deposit securely into FXPesa via official Paybill 832900.'
    ],
    content: [
      'MetaTrader 4 (MT4) and MetaTrader 5 (MT5) are the global software standards for placing forex orders. Your broker provides the server credentials (account number, trader password, server name).',
      'The three key windows: Market Watch (quotes), Chart Window (candlesticks), and Terminal/Trade Tab (open orders, equity, free margin).',
      'Placing an order requires setting your Volume (Lot Size). 0.01 is a micro lot (1,000 units of currency). On EUR/USD, 0.01 lot means each pip movement is worth approximately $0.10 (around 13 KES).',
      'When depositing with FXPesa in Kenya, use their official Lipa Na M-Pesa Paybill. Enter your MT4/MT5 account number as the account reference. Funds reflect automatically in your MT4 terminal balance within seconds.'
    ],
    realTimeNote: 'Tip from Gilgil: Always verify the server name in MT4 search! For FXPesa demo, search "EGM-Demo" or "FXPesa-Demo".',
    chartIllustrationType: 'candlestick_anatomy',
    samplesAndCases: [
      {
        title: 'Trade Sample: 0.01 Micro Lot EUR/USD Execution',
        type: 'math_sample',
        description: 'Balance: 4,000 KES ($30 USD). Entry: 1.1267 Buy. Stop Loss: 1.1247 (20 pips). Target: 1.1307 (40 pips).',
        mathSnippet: 'Risk = 20 pips x $0.10/pip = $2.00 (260 KES). Reward = 40 pips x $0.10/pip = $4.00 (520 KES). Risk:Reward = 1:2.',
        takeaway: 'Even on a small 4,000 KES deposit, you only risk 6.5% of your account with a clean 1:2 payout potential.'
      }
    ],
    practiceExercise: {
      prompt: 'Use the Pip Calculator in Pillar 07 to calculate how much 35 pips is worth with a 0.01 micro lot on GBP/USD.',
      actionHint: 'Expected result: approx $3.50 USD (around 455 KES).',
      toolTarget: 'journal'
    },
    liveMarketExample: 'A lot size of 0.01 on a $50 account means a 20-pip stop loss only risks $2.00 (approx 260 KES). This keeps you alive.',
    homework: 'Log into MT4 on your mobile device, add EUR/USD to favorites, and place a 0.01 buy demo trade with a 20 pip Stop Loss.',
    quiz: {
      question: 'What is the value of 1 pip on EUR/USD when trading the smallest micro lot size of 0.01?',
      options: ['$10.00', '$1.00', '$0.10 (approx 13 KES)', '$0.01'],
      correctIndex: 2,
      explanation: 'On a 0.01 micro lot of EUR/USD, 1 pip equals approximately $0.10 USD (about 13 Kenyan Shillings).'
    }
  },
  {
    id: 'w-3',
    belt: 'white',
    levelTag: 'Beginner',
    number: '03',
    title: 'Candlesticks, Rejection Pinbars & The Anatomy of a Reversal',
    duration: '12 mins',
    summary: 'Mastering open, high, low, close (OHLC), long rejection shadows, and what a Pinbar reveals about buyers and sellers.',
    learningObjectives: [
      'Identify the 4 components of every candle: Open, High, Low, Close.',
      'Spot bearish rejection pinbars with 2x wick-to-body ratios at key levels.',
      'Recognize institutional absorption where retail traders get trapped.'
    ],
    content: [
      'Every candlestick represents price action over a fixed timeframe (e.g., M15 = 15 minutes). A candle has a body (distance between open and close) and wicks/shadows (highest and lowest price touched).',
      'A Pinbar (Pinocchio bar) has a very small body and a long tail/wick protruding out that is at least 2x or 3x the body size.',
      'A long UPPER wick shows that buyers tried pushing price higher, but aggressive institutional sellers stepped in and slammed price back down. This is a bearish rejection.',
      'A long LOWER wick shows sellers tried pushing down, but buyers defended support aggressively. In Gilgil, we look for these pinbars at key EMA inflection points.'
    ],
    realTimeNote: 'Candlestick psychology: Wicks are where transactions were rejected. Bodies are where agreement happened.',
    chartIllustrationType: 'pinbar_tower',
    samplesAndCases: [
      {
        title: 'Live Pattern Sample: The M15 Rejection Wick at 1.35450',
        type: 'win_case',
        description: 'GBP/USD surged to 1.35465, printed a 14-pip upper shadow, and closed at 1.35410 with a tiny 2-pip body.',
        takeaway: 'The long upper tail signaled sellers absorbing all breakout liquidity. Triggered our short reversal entry at 1.35100.'
      }
    ],
    practiceExercise: {
      prompt: 'Open TradingView in Pillar 03 and locate the Tower Reversal animation step 3 to observe the pinbar formation.',
      actionHint: 'Step through the animation to watch the long upper tail reject resistance.',
      toolTarget: 'tradingview'
    },
    liveMarketExample: 'The GBP/USD 1.35100 short win formed right after an M15 candle with a 14-pip upper wick rejecting the 1.35450 resistance zone.',
    homework: 'Find 3 pinbar rejection candles on the M15 timeframe of EUR/USD and note whether price reversed after.',
    quiz: {
      question: 'What does a long upper wick on a candlestick indicate?',
      options: [
        'Buyers are in total control',
        'Sellers aggressively rejected higher prices and pushed price back down',
        'Market is closed',
        'Spread is zero'
      ],
      correctIndex: 1,
      explanation: 'A long upper wick indicates rejection: buyers attempted a rally, but sellers overwhelmed them and pushed price back down.'
    }
  },
  {
    id: 'w-4',
    belt: 'white',
    levelTag: 'Beginner',
    number: '04',
    title: 'The Ironclad $2 Risk Rule for Kenyan Traders',
    duration: '9 mins',
    summary: 'The mathematical secret to surviving the first 6 months. Why sizing your risk to $2 protects your capital from emotional wipeout.',
    learningObjectives: [
      'Calculate max risk per trade as strictly $2.00 USD (260 KES).',
      'Compute account survival bounds: $50 account = 25 lives buffer.',
      'Completely eliminate the psychological urge to revenge trade.'
    ],
    content: [
      'Most beginner traders in Kenya start with small accounts ($20 to $50, approx 2,500 to 6,500 KES). If you risk $10 or $20 on one trade, two bad trades blow half your savings.',
      'The PivotFX $2 Rule states: On ANY single trade, your maximum allowed monetary risk is strictly $2.00 USD (approx 260 KES).',
      'With a 0.01 micro lot, $2.00 gives you 20 pips of breathing room on EUR/USD or GBP/USD. This means you can be wrong 25 CONSECUTIVE TIMES on a $50 account before blowing it.',
      'No professional strategy loses 25 times in a row if you follow basic EMA trend alignment. The $2 rule eliminates the fear of losing and stops revenge trading in its tracks.'
    ],
    realTimeNote: 'Emotional truth: You cannot revenge trade when a loss only costs 260 KES (the price of a cup of coffee and mandazi).',
    chartIllustrationType: 'two_dollar_rule',
    samplesAndCases: [
      {
        title: 'Math Proof: Trader A ($15 Risk) vs Trader B ($2 Risk)',
        type: 'math_sample',
        description: 'Both start with 6,500 KES ($50). Both face an unpredictable 3-trade losing streak.',
        mathSnippet: 'Trader A (-$45): Balance = $5. Account destroyed. Panic. Trader B (-$6): Balance = $44. Calmer than ever. Followed system to +$14 on next 3 trades.',
        takeaway: 'Risk sizing, not prediction, is what separates blown accounts from professional traders.'
      }
    ],
    practiceExercise: {
      prompt: 'Open the $2 Survival Rule Calculator in Pillar 07 and enter your intended M-Pesa deposit in KES.',
      actionHint: 'See how many consecutive losses you can survive before running into trouble.',
      toolTarget: 'journal'
    },
    liveMarketExample: 'Compare Trader A (risking $15 on a $30 account, blown in 2 trades) vs Trader B (risking $2 per trade, took 20 trades, learned the edge, and grew the account to $65).',
    homework: 'Use the PivotFX $2 Rule Calculator on the Journal page to calculate your exact lot size and stop loss pips for EUR/USD.',
    quiz: {
      question: 'Under the PivotFX $2 Rule on a $50 account, how many consecutive losses can you survive before wiping out?',
      options: ['2 losses', '5 losses', '10 losses', '25 losses'],
      correctIndex: 3,
      explanation: '$50 divided by $2 max risk per trade equals 25 full consecutive losses, giving beginners an impenetrable safety buffer.'
    }
  },

  // Blue Belt
  {
    id: 'b-1',
    belt: 'blue',
    levelTag: 'Intermediate',
    number: '05',
    title: 'The EMA 20 & 50 Confluence System',
    duration: '14 mins',
    summary: 'Using Exponential Moving Averages as dynamic support and resistance instead of static lines.',
    learningObjectives: [
      'Distinguish between Fast 20 EMA (momentum) and Slow 50 EMA (trend baseline).',
      'Identify the institutional "Value Zone" between the two EMAs.',
      'Filter out choppy consolidation ranges where EMAs are tangled.'
    ],
    content: [
      'The 20 Exponential Moving Average (EMA) represents the short-term momentum of the last 20 periods. The 50 EMA represents the intermediate trend.',
      'Rule 1: When EMA 20 is above EMA 50, and both are sloping upward, look ONLY for BUY setups on pullbacks. Never short against the upward EMA slope.',
      'Rule 2: When EMA 20 is below EMA 50, and both are sloping downward, look ONLY for SELL setups on rallies into the 20/50 zone.',
      'The space between the 20 EMA and 50 EMA is called the "Value Zone". That is where institutions re-accumulate positions. When price pulls back into the Value Zone and prints a pinbar, probability jumps above 70%.'
    ],
    realTimeNote: 'Trend Filter: If price is tangled inside the 20 and 50 EMA and they are flat/horizontal, the market is CHOPPING. Close your terminal and walk away.',
    chartIllustrationType: 'ema_crossover',
    samplesAndCases: [
      {
        title: 'Winning Case: EUR/USD Dynamic Pullback Bounce',
        type: 'win_case',
        description: 'H1 trend strongly bullish (EMA 20 > EMA 50). Price pulled back to 1.1255 directly into the 50 EMA, formed a bullish hammer, and rallied 33 pips to 1.1288.',
        takeaway: 'Entering in the Value Zone gives tight stop losses directly beneath the 50 EMA.'
      }
    ],
    practiceExercise: {
      prompt: 'Toggle EMA 20 and EMA 50 in Pillar 03 TradingView to see the cyan and orange dynamic lines.',
      actionHint: 'Notice how price respects the dynamic slope during London session runs.',
      toolTarget: 'tradingview'
    },
    liveMarketExample: 'On GBP/USD (1.34998) H1 chart, notice how price bounces off the 20 EMA repeatedly during strong London session runs.',
    homework: 'Add EMA 20 (Cyan) and EMA 50 (Orange) to your MT4 chart. Highlight three instances where price bounced off the 20 EMA.',
    quiz: {
      question: 'What is the "Value Zone" in the PivotFX 20/50 system?',
      options: [
        'The spread charged by FXPesa',
        'The space between the 20 EMA and 50 EMA during a healthy trend',
        'The weekend when the market is closed',
        'The highest price of the year'
      ],
      correctIndex: 1,
      explanation: 'The Value Zone is the dynamic pocket between the 20 EMA and 50 EMA where trending pullbacks find institutional support/resistance.'
    }
  },
  {
    id: 'b-2',
    belt: 'blue',
    levelTag: 'Intermediate',
    number: '06',
    title: 'RSI Momentum & The Gilgil GBP/USD 1.35100 Case Study',
    duration: '15 mins',
    summary: 'Deconstructing the 1.35450 FOMO breakout trap vs the disciplined 1.35100 to 1.34780 short reversal win.',
    learningObjectives: [
      'Deconstruct why buying at 1.35450 (or chasing XAU/USD at highs without SL) blew accounts in Gilgil.',
      'Master the 3-step breakdown formula of the 1.35100 winning reversal.',
      'Detect RSI divergence when price makes equal highs but RSI forms lower highs.'
    ],
    content: [
      'The Relative Strength Index (RSI 14) measures the velocity and magnitude of price changes. Conventional textbooks say "buy at 30 and sell at 70". In real markets, strong trends can stay above 70 for hours.',
      'In Gilgil, traders learned this the hard way: Buying GBP/USD at 1.35450 because "the breakout looked massive" caused a painful loss because price was already overstretched 35 pips above the 20 EMA and RSI was at 83 with bearish divergence.',
      'How the 1.35100 win was executed: We waited for price to reject the tower top, saw RSI peak at 75.8 and drop back through 60, and waited for the M15 candle to close below the 20 EMA.',
      'Entry was struck at 1.35100 with a 15-pip stop loss at 1.35250 ($1.50 risk). Price dropped smoothly to the 50 EMA support at 1.34780, banking +32.0 pips. Patience beats FOMO every single day.'
    ],
    realTimeNote: 'Formula: High probability setup = Overextended Tower + RSI exhaustion + Break back through 20 EMA.',
    chartIllustrationType: 'rsi_divergence',
    samplesAndCases: [
      {
        title: 'FOMO Mistake: The 1.35450 Parabolic Chaser',
        type: 'loss_case',
        description: 'Entered LONG after 4 giant green candles. Price was 42 pips above 20 EMA, RSI was 83.2. Stopped out when a 70-pip reversal wick formed.',
        takeaway: 'Never chase candles overextended from the 20 EMA when RSI is > 75.'
      },
      {
        title: 'Disciplined Win: The 1.35100 Short Reversal',
        type: 'win_case',
        description: 'Waited for upper wick rejection, RSI drop below 60, and close below 20 EMA. Shorted at 1.35100 with 15 pip stop (1.35250). Hit target at 1.34780 for +32.0 pips.',
        takeaway: 'Let the trap form first. Enter with the institutional sellers on confirmed EMA crossover.'
      }
    ],
    practiceExercise: {
      prompt: 'Load the GBP/USD 1.3545 preset in Pillar 02 (Super Analysis Tool) to inspect the 92/100 confluence score.',
      actionHint: 'Observe how the tool anchors SL above your live chart price and confirms the entry.',
      toolTarget: 'super-analysis'
    },
    liveMarketExample: 'Compare 1.35450 (chasing at the top) vs 1.35100 (entering the confirmed reversal) — and on Gold XAU/USD, compare chasing Spot 3968 / Futures 4050 vs entering on pullback.',
    homework: 'Open the Super Analysis Tool on PivotFX Lab. Enter GBP/USD Price: 1.35450, EMA 20: 1.35100, EMA 50: 1.34820, RSI: 75.8. See the score and MT4 SL/TP generated.',
    quiz: {
      question: 'Why did buying at the extended top (1.35450) fail while waiting for the breakdown (1.35100) succeeded?',
      options: [
        'It was placed on MT5 instead of MT4',
        'Buying chased an overextended move far from EMAs with RSI > 80, while waiting waited for exhaustion and EMA breakdown',
        'The broker manipulated the price',
        'Gold was closed'
      ],
      correctIndex: 1,
      explanation: 'Chasing an overbought market traps buyers; waiting for the confirmed breakdown below EMA 20 with RSI falling gives clean institutional confirmation.'
    }
  },
  {
    id: 'b-3',
    belt: 'blue',
    levelTag: 'Intermediate',
    number: '07',
    title: 'Trading Sessions: London Open at 11:00 AM East Africa Time',
    duration: '11 mins',
    summary: 'Aligning your trading day with Kenyan time (EAT UTC+3). Why 11:00 AM and 3:30 PM are the only windows that matter.',
    learningObjectives: [
      'Master the 3 global forex sessions in Kenyan time: Asian (3 AM), London (11 AM), New York (3:30 PM).',
      'Trade the London 11:00 AM EAT liquidity surge with tight spreads.',
      'Avoid trading during the midnight bank rollover (11:55 PM to 12:30 AM EAT).'
    ],
    content: [
      'Kenyan traders have one of the greatest geographical advantages in global finance: East Africa Time (EAT, UTC+3) is perfectly aligned with European market open.',
      'The Asian Session (3:00 AM – 10:00 AM EAT) is usually quiet and range-bound. Spreads on EUR/USD and GBP/USD can be tight, but volume is low.',
      'The London Open at 11:00 AM EAT unleashes massive institutional liquidity. Banks in London, Frankfurt, and Zurich begin executing large orders. This creates the true daily trend or the classic London Judas Swing (fakeout before real direction).',
      'The New York Session opens at 3:30 PM EAT (or 4:30 PM depending on daylight savings). The overlap between 11:00 AM and 6:00 PM EAT produces 70% of the entire day\'s volume. Do NOT trade at 12:00 midnight EAT when spreads widen!'
    ],
    realTimeNote: 'Kenya Schedule: London Open = 11:00 AM EAT. NY Open = 3:30 PM EAT. Rollover Spread Danger = 11:55 PM to 12:30 AM EAT.',
    chartIllustrationType: 'sessions_eat',
    samplesAndCases: [
      {
        title: 'Session Sample: London Judas Swing Breakdown',
        type: 'win_case',
        description: 'At 11:05 AM EAT, GBP/USD pushed 8 pips above the Asian high to fake out retail breakout buyers, then printed an M5 pinbar and dumped 45 pips.',
        takeaway: 'Wait 15 minutes after 11:00 AM EAT to confirm whether the breakout is real or an institutional liquidity hunt.'
      }
    ],
    practiceExercise: {
      prompt: 'Check the real-time Nairobi EAT Clock in the top navbar to see the active trading session.',
      actionHint: 'Notice whether the clock displays "High Volume London/NY" or "Pre-London Setup".',
      toolTarget: 'start-here'
    },
    liveMarketExample: 'Notice how spreads on FXPesa are 1.2 pips at 11:30 AM EAT, but widen to 4-7 pips at midnight during broker bank roll.',
    homework: 'Set an alarm on your phone for 10:55 AM EAT. Observe GBP/USD on MT4 at 11:00 AM and watch the 5-minute candle surge.',
    quiz: {
      question: 'What time does the London Forex market session open in Kenyan East Africa Time (EAT)?',
      options: ['6:00 AM EAT', '11:00 AM EAT', '4:00 PM EAT', '9:00 PM EAT'],
      correctIndex: 1,
      explanation: 'London Open occurs at 11:00 AM East Africa Time (EAT), which is 8:00 AM London time (UTC+0/1).'
    }
  },

  // Purple Belt
  {
    id: 'p-1',
    belt: 'purple',
    levelTag: 'Advanced',
    number: '08',
    title: 'Multi-Timeframe Confluence (H4 Trend, M15 Entry)',
    duration: '16 mins',
    summary: 'Never trade a timeframe in isolation. Aligning Higher Timeframe direction with Lower Timeframe precision.',
    learningObjectives: [
      'Execute top-down analysis: H4 (macro trend) -> H1 (momentum) -> M15 (sniper entry).',
      'Filter out counter-trend lower timeframe fakeouts.',
      'Achieve minimum 1:2.5 Risk-to-Reward on every entry.'
    ],
    content: [
      'Top-down analysis is the hallmark of professional trading: Look at H4 to identify the macro trend and major support/resistance barriers.',
      'Drop down to H1 to locate the intermediate EMA 20/50 trajectory.',
      'Drop to M15 to time your sniper entry using candlestick pinbars and RSI inflection.',
      'If H4 is in a strong uptrend (EMA 20 > EMA 50) and M15 pulls back into its own EMA 50 and prints a bullish rejection candle, you have triple-timeframe confluence. Your win rate jumps significantly.'
    ],
    realTimeNote: 'Golden rule: The higher the timeframe, the stronger the support or resistance level.',
    chartIllustrationType: 'ema_crossover',
    samplesAndCases: [
      {
        title: 'Triple Confluence Execution Example',
        type: 'win_case',
        description: 'H4 in clean uptrend (sloping 20 EMA). H1 retested 50 EMA support. M15 printed a bullish engulfing candle with RSI at 48. Won +28 pips.',
        takeaway: 'Trading with H4 trend protection allows you to hold positions with confidence.'
      }
    ],
    practiceExercise: {
      prompt: 'Open Pillar 03 TradingView and switch between H4, H1, and M15 timeframes to see the setup score adapt.',
      actionHint: 'Notice how the setup score calculates dynamic confluence based on selected timeframe.',
      toolTarget: 'tradingview'
    },
    liveMarketExample: 'When H4 shows a clean bounce off 50 EMA, an M15 breakout trade rarely fails.',
    homework: 'Chart EUR/USD on H4, mark the trend, then find an M15 pullback entry in the same direction.',
    quiz: {
      question: 'If H4 is in a strong downtrend, what should you look for on the M15 timeframe?',
      options: [
        'Aggressive Buy orders',
        'Sell setups on pullbacks to resistance or 20 EMA',
        'Turn off your computer',
        'Deposit more money'
      ],
      correctIndex: 1,
      explanation: 'Always align lower timeframe execution (M15) with the dominant higher timeframe direction (H4).'
    }
  },
  {
    id: 'p-2',
    belt: 'purple',
    levelTag: 'Advanced',
    number: '09',
    title: 'Broker Price Tricks: Spread Widening, Rollover & Slippage',
    duration: '13 mins',
    summary: 'Unmasking the hidden traps: midnight swaps, weekend gaps, liquidity voids, and how to protect yourself.',
    learningObjectives: [
      'Understand the mechanics of bank rollover at 00:00 server time.',
      'Prevent the "Midnight Ghost Stop" where spreads spike to 12+ pips.',
      'Buffer swing trades with appropriate spread padding.'
    ],
    content: [
      'Every night at 00:00 server time (12:00 AM / 1:00 AM EAT), global interbank trading desks close their daily books and settle interest swaps.',
      'During this 15-to-30-minute window, market liquidity drops near zero. Brokers widen spreads from 1.2 pips to 6, 8, or even 15 pips on major pairs.',
      'If your Stop Loss is tight (e.g. 10 pips), the artificially widened spread can trigger your stop loss even if the chart candle never reached your price! In Gilgil, we call this the "Midnight Ghost Stop".',
      'Protection protocol: Never enter new trades between 11:45 PM and 12:30 AM EAT. If holding swing positions overnight, ensure your stop loss is buffered by at least 15 pips above normal spread.'
    ],
    realTimeNote: 'Reality Check: CMA regulation protects FXPesa clients against unauthorized balance deductions, but interbank spread widening is an unavoidable market-wide reality.',
    chartIllustrationType: 'spread_trap',
    samplesAndCases: [
      {
        title: 'Trap Case: The Midnight Ghost Stop Loss',
        type: 'loss_case',
        description: 'Trader entered EUR/USD buy with an 8-pip stop loss. At 12:03 AM EAT, spread widened from 1.2 to 9.5 pips. Stop triggered even though chart low was 4 pips away!',
        takeaway: 'Never leave tight stops open through midnight rollover without at least a 15-pip spread buffer.'
      }
    ],
    practiceExercise: {
      prompt: 'Check the Live Spread Comparison table in Pillar 06 to see how floating spreads tick in real-time.',
      actionHint: 'Observe the difference in spread variance between FXPesa, HFM, and FBS.',
      toolTarget: 'brokers'
    },
    liveMarketExample: 'Check FXPesa or HFM spread display at 11:59 PM vs 11:30 AM. You will visually see the spread bar expand.',
    homework: 'Note down the spread on EUR/USD at 2:00 PM EAT, then check it again at 12:05 AM EAT. Compare the two numbers.',
    quiz: {
      question: 'Why do broker spreads widen drastically around 12:00 AM East Africa Time?',
      options: [
        'The broker wants to steal your account',
        'Global banks close daily books for rollover settlement, creating a temporary drop in market liquidity',
        'M-Pesa servers are upgrading',
        'Internet cables under the Indian Ocean are turned off'
      ],
      correctIndex: 1,
      explanation: 'At 00:00 bank rollover, global bank liquidity drops while contracts are rolled to the next day, widening interbank spreads temporarily.'
    }
  },

  // Black Belt
  {
    id: 'k-1',
    belt: 'black',
    levelTag: 'Pro / Institutional',
    number: '10',
    title: 'Building Your Mechanical Edge & Backtesting 100 Trades',
    duration: '18 mins',
    summary: 'Transforming intuition into a mathematical system. How to backtest 100 setups without risking a single Kenyan Shilling.',
    learningObjectives: [
      'Calculate mathematical expectancy: E = (Win% x Avg Win) - (Loss% x Avg Loss).',
      'Execute a 100-trade backtest protocol without hindsight bias.',
      'Verify drawdown limits before funding an account.'
    ],
    content: [
      'A trader without backtesting data is just an unguided gambler hoping for luck. You need a verifiable mathematical expectancy: Expectancy = (Win% x Avg Win) - (Loss% x Avg Loss).',
      'Step 1: Pick ONE pair (e.g. EUR/USD) and ONE strategy (e.g. PivotFX Tower Reversal).',
      'Step 2: Scroll back 6 months on TradingView. Find 100 consecutive instances where all entry rules were met.',
      'Step 3: Record: Entry price, Stop loss (fixed 15 pips), Target (fixed 30 pips for 1:2 R:R), and Outcome (Win or Loss).',
      'If 62 out of 100 trades hit target at 1:2 R:R with the $2 rule, your strategy generates a net profit of +$48 on a $50 account with absolute mathematical certainty.'
    ],
    realTimeNote: 'Professional mantra: If you cannot prove your edge over 100 historical trades, you do not have an edge.',
    chartIllustrationType: 'two_dollar_rule',
    samplesAndCases: [
      {
        title: '100-Trade Backtest Statistical Sample',
        type: 'math_sample',
        description: '100 trades on GBP/USD M15 Tower Reversal with 1:2 R:R ($2 risk / $4 reward).',
        mathSnippet: 'Wins: 64 trades (+$256). Losses: 36 trades (-$72). Net Profit: +$184 (+368% on a $50 account). Expectancy: +$1.84 per trade.',
        takeaway: 'A mechanical edge gives you peace of mind because individual losses are merely business expenses.'
      }
    ],
    practiceExercise: {
      prompt: 'Open the Trade Journal in Pillar 07 and export your current trade dataset to CSV to practice audit analysis.',
      actionHint: 'Check your overall win rate and net realized PnL curve.',
      toolTarget: 'journal'
    },
    liveMarketExample: 'Our 100-trade backtest on the PivotFX Tower Reversal showed a 76% win rate on M15 when combined with EMA 20 slope confirmation.',
    homework: 'Backtest 10 trades on EUR/USD using the TradingView Bar Replay feature and record each trade in the PivotFX Journal.',
    quiz: {
      question: 'What is the purpose of backtesting 100 trades before trading with real money?',
      options: [
        'To impress friends on social media',
        'To mathematically verify win rate, drawdown, and expectancy before risking capital',
        'To get free demo credits from brokers',
        'To avoid paying taxes in Kenya'
      ],
      correctIndex: 1,
      explanation: 'Backtesting proves whether your trading system has a genuine positive statistical expectancy over a significant sample size.'
    }
  },
  {
    id: 'k-2',
    belt: 'black',
    levelTag: 'Pro / Institutional',
    number: '11',
    title: 'Forex Ethics, Telegram Scams & Teaching Legally in Kenya',
    duration: '14 mins',
    summary: 'Protecting your community. CMA laws on investment advice, fake Telegram VIP signals, and running educational workshops ethically.',
    learningObjectives: [
      'Understand CMA Kenya regulations regarding fund management and PAMMs.',
      'Identify fake Telegram forex scams, rented car videos, and fake M-Pesa screenshots.',
      'Teach technical charting and risk management legally as free education.'
    ],
    content: [
      'In Kenya, hundreds of youth are scammed every month by fake Telegram "forex gurus" promising 100% daily returns or managing "money pools".',
      'Under the Capital Markets Act of Kenya, it is strictly ILLEGAL to collect money from the public to trade on their behalf without a fund manager license from CMA.',
      'You are legally permitted to share EDUCATIONAL research, market analysis, and teach charting tools — exactly what PivotFX Lab does as an unregistered educational project.',
      'Always disclose clearly: Trading forex involves substantial risk, 70-80% of retail traders lose money, past performance is no guarantee of future returns, and recommend CMA-licensed brokers like FXPesa.'
    ],
    realTimeNote: 'Gilgil Code of Honor: We teach how to fish. We never sell fake "guaranteed" signals, and we never touch another person\'s money.',
    chartIllustrationType: 'spread_trap',
    samplesAndCases: [
      {
        title: 'Community Ethics Case: The Pool Trading Trap',
        type: 'loss_case',
        description: 'An unregistered trader collected 50,000 KES from 10 friends promising 30% weekly profit. Blown within 3 days. Led to police arrest and criminal charges under the CMA Act.',
        takeaway: 'Never accept client money to trade. Teach them how to trade their own accounts via the $2 rule.'
      }
    ],
    practiceExercise: {
      prompt: 'Read the Transparency Statement in Pillar 08 (Trust & Legal) to understand compliance rules in Kenya.',
      actionHint: 'See how PivotFX Lab structures its legal disclaimer for community protection.',
      toolTarget: 'trust-legal'
    },
    liveMarketExample: 'Real traders show verified Myfxbook or MT4 demo audit statements, not rented cars and fake M-Pesa screenshots.',
    homework: 'Read the Legal Disclaimer page of PivotFX Lab and understand the difference between licensed brokerage (CMA) and free community education.',
    quiz: {
      question: 'Is it legal in Kenya to collect money from friends to trade on their behalf without a CMA fund manager license?',
      options: [
        'Yes, as long as you give them 50% profit',
        'No, taking public funds to manage without a CMA license is illegal in Kenya',
        'Yes, if you use M-Pesa',
        'Only on weekends'
      ],
      correctIndex: 1,
      explanation: 'Under Kenyan law and CMA regulations, pooling or managing third-party investment capital without a formal license is prohibited.'
    }
  },

  // ==========================================
  // ICT INSTITUTIONAL MASTERCLASS FULL COURSE
  // ==========================================
  {
    id: 'ict-1',
    belt: 'ict',
    levelTag: 'ICT Institutional Master',
    number: '12',
    title: 'ICT Liquidity Pools: BSL & SSL Engineering (Sweeps vs Breakouts)',
    duration: '22 mins',
    summary: 'Master how smart money algorithms intentionally sweep resting Buy-Side Liquidity (BSL) and Sell-Side Liquidity (SSL) to engineer counter-trend fuel.',
    learningObjectives: [
      'Identify Buy-Side Liquidity (BSL) above double tops and previous day highs.',
      'Identify Sell-Side Liquidity (SSL) below double bottoms and previous day lows.',
      'Differentiate between an institutional liquidity sweep (wick) and a real structural breakout (body close).',
      'Execute the Turtle Soup reversal entry immediately following a liquidity purge.'
    ],
    content: [
      'In traditional retail textbooks, double tops are considered "strong resistance" and double bottoms "strong support". To institutional algorithms, however, these areas represent dense clusters of resting stop-loss orders known as Liquidity Pools.',
      'Above every double top or Previous Day High (PDH) sit thousands of retail Buy Stop orders. This is Buy-Side Liquidity (BSL). When large banks need to fill a $500M short position, they cannot buy at the top—they need sellers. By driving price up through the double top, they trigger the retail Buy Stops, instantly acquiring the counterpart liquidity needed to dump the market.',
      'Below double bottoms or Previous Day Lows (PDL) sit resting Sell Stops (Sell-Side Liquidity / SSL). Smart money sweeps SSL to accumulate long positions at wholesale discount pricing.',
      'The GBP/USD 1.35450 BSL sweep loss vs 1.35100 win is the quintessential liquidity lesson: 1.35450 bought directly into the BSL purge. 1.35100 entered with smart money AFTER the BSL was absorbed and price closed back under resistance.'
    ],
    realTimeNote: 'Institutional Law: Price moves from one liquidity pool (BSL) directly to the opposing liquidity pool (SSL). Never buy at BSL or sell at SSL.',
    chartIllustrationType: 'liquidity_pool',
    tvSymbol: 'GBPUSD',
    tvTimeframe: '15',
    tvNavButtonLesson: {
      buttonName: 'Horizontal Ray (Alt + J)',
      shortcut: 'Alt + J',
      action: 'Click exactly on the swing high wick to project Buy-Side Liquidity (BSL) ray forward into future candles.',
      howToSample: 'Press Alt + J at yesterday high (1.35450). Label the ray "BSL Pool". Wait for a 5-to-10 pip sweep with an upper wick rejection.'
    },
    samplesAndCases: [
      {
        title: 'The GBP/USD 1.35450 BSL Purge Trap',
        type: 'loss_case',
        description: 'Retail traders bought the breakout at 1.35450 as price pierced the Asian high. Banks swept 8 pips of BSL and dumped 65 pips straight down.',
        mathSnippet: 'Retail Loss: Bought 1.35450 -> Stopped out at 1.35250 (-20.0 pips). With the Gilgil $2 rule on 0.01 lot, loss is capped at $2.00 instead of -$306.',
        takeaway: 'Never buy breakouts of clean double tops. Assume the first breakout is a liquidity sweep until proven by a displacement retest.'
      },
      {
        title: 'The 1.35100 Institutional Short Reversal',
        type: 'win_case',
        description: 'Waited for the BSL sweep to complete at 1.35450, watched M15 candle body slam back below 1.35250, and shorted at 1.35100 targeting SSL at 1.34780.',
        mathSnippet: 'Win Result: Entry: 1.35100, SL: 1.35250 (15 pips / $1.50 risk), Exit: 1.34780 (+32.0 pips). Reward:Risk = 1:2.1 (+$3.20 on 0.01 micro lot).',
        takeaway: 'Enter on the second mouse principle: The first mouse (breakout chaser) gets caught in the trap; the second mouse gets the cheese.'
      }
    ],
    practiceExercise: {
      prompt: 'Open TradingView in Pillar 03 and draw a Horizontal Ray (Alt + J) at the highest high of yesterday on GBP/USD.',
      actionHint: 'Look at how price reacts when testing that level: Does it cleanly break with displacement or poke a wick and reverse?',
      toolTarget: '/chart-mastery'
    },
    liveMarketExample: 'Check GBP/USD (1.34998) or XAU/USD (3955.00 Spot / 4041.495 Futures) right now. Locate the previous day high. You will see resting buy stops pooled right above it waiting for London open.',
    homework: 'Mark the Previous Day High (PDH) and Previous Day Low (PDL) on EUR/USD (1.12670) and note whether London open swept one of them.',
    quiz: {
      question: 'What orders are resting above an obvious double top resistance level in the market?',
      options: [
        'Institutional Take Profit orders',
        'Retail Buy Stop orders (Buy-Side Liquidity / BSL)',
        'Central bank intervention orders',
        'Broker spread fees'
      ],
      correctIndex: 1,
      explanation: 'Retail traders who shorted double tops place their protective stop losses (which are Buy Stops) right above the highs, creating Buy-Side Liquidity (BSL) for institutions.'
    }
  },
  {
    id: 'ict-2',
    belt: 'ict',
    levelTag: 'ICT Institutional Master',
    number: '13',
    title: 'ICT Fair Value Gaps (FVG) & Consequent Encroachment (C.E. 50%)',
    duration: '24 mins',
    summary: 'Deconstruct 3-candle algorithmic delivery imbalances and enter sniper wholesale limit orders at the 50% Consequent Encroachment midpoint.',
    learningObjectives: [
      'Identify the 3-candle Fair Value Gap (Candle 1 wick does not touch Candle 3 wick).',
      'Calculate the exact 50% Consequent Encroachment (C.E.) midpoint price.',
      'Differentiate between Premium FVGs (for selling) and Discount FVGs (for buying).',
      'Understand Inversion FVGs when an imbalance fails and flips polarity.'
    ],
    content: [
      'The interbank pricing algorithm is programmed to offer balanced two-sided auction pricing. When aggressive institutional volume enters the market, price displaces rapidly across several tick increments, leaving a one-sided imbalance where only buyers or only sellers participated.',
      'This creates a 3-Candle Fair Value Gap (FVG): Candle 1 (preceding baseline), Candle 2 (large displacement candle), and Candle 3 (following candle). In a Bullish FVG, the low of Candle 3 does NOT overlap the high of Candle 1. The empty price void between them is the FVG.',
      'Consequent Encroachment (C.E.) is the exact 50% mathematical midpoint of the FVG. Algorithms will systematically reprice back to the C.E. level to rebalance liquidity. When price taps C.E., institutional limit orders are filled and price expands violently toward the next liquidity draw.',
      'In Gilgil, we NEVER chase the giant green candle 2! We patiently drop a Buy Limit order at the 50% Consequent Encroachment with our stop loss comfortably sheltered behind Candle 1.'
    ],
    realTimeNote: 'Golden ICT Rule: Never chase the impulse candle. The Fair Value Gap is the magnet that pulls price back for your entry.',
    chartIllustrationType: 'fvg_imbalance',
    tvSymbol: 'EURUSD',
    tvTimeframe: '15',
    tvNavButtonLesson: {
      buttonName: 'Rectangle Tool (Left Toolbar)',
      shortcut: 'Alt + R / 4th Tool Menu',
      action: 'Click the Rectangle tool on the left toolbar to shade the imbalance area from Candle 1 High to Candle 3 Low.',
      howToSample: 'Select Rectangle, click Candle 1 high wick at 1.1252, drag across to Candle 3 low wick at 1.1282. The 50% line inside is Consequent Encroachment (1.1267).'
    },
    samplesAndCases: [
      {
        title: 'EUR/USD M15 Consequent Encroachment (C.E.) Execution',
        type: 'win_case',
        description: 'Displacement surge created an M15 FVG between 1.1252 (Candle 1 High) and 1.1282 (Candle 3 Low). C.E. calculated at 1.1267.',
        mathSnippet: 'C.E. = 1.1252 + ((1.1282 - 1.1252) / 2) = 1.1267. Buy Limit placed at 1.1267. Tapped at 16:45 EAT, rallied to 1.1325 (+58 pips).',
        takeaway: 'Entering at 50% C.E. cut the required stop loss in half and doubled the reward-to-risk ratio from 1:1.5 to 1:3.2.'
      }
    ],
    practiceExercise: {
      prompt: 'Open TradingView in Pillar 03 and find the most recent 3-candle displacement on EUR/USD M15.',
      actionHint: 'Measure the distance between Candle 1 and Candle 3 with the Rectangle tool and locate the 50% midline.',
      toolTarget: '/chart-mastery'
    },
    liveMarketExample: 'On EUR/USD M15 during the New York session, watch how price retraces into the 50% level (around 1.1267) of the 15:30 EAT displacement candle.',
    homework: 'Identify 3 unmitigated Fair Value Gaps on your MT4/MT5 demo chart and set an alert at their Consequent Encroachment.',
    quiz: {
      question: 'What is Consequent Encroachment (C.E.) in ICT methodology?',
      options: [
        'The highest price of the year',
        'The 50% mathematical midpoint of a Fair Value Gap imbalance',
        'The broker commission fee on MT5',
        'The moment trading closes on Friday'
      ],
      correctIndex: 1,
      explanation: 'Consequent Encroachment (C.E.) is the 50% equilibrium level of a Fair Value Gap where institutional limit orders typically fill.'
    }
  },
  {
    id: 'ict-3',
    belt: 'ict',
    levelTag: 'ICT Institutional Master',
    number: '14',
    title: 'ICT Order Blocks (OB) & Mean Threshold: 50% Mitigation Matrix',
    duration: '26 mins',
    summary: 'Identify the exact last opposite candle before institutional displacement, and use the 50% Mean Threshold for sniper limit entries.',
    learningObjectives: [
      'Validate institutional Order Blocks: Must create displacement and an unmitigated FVG.',
      'Calculate the Mean Threshold (50% midpoint of the Order Block candle body).',
      'Distinguish between Order Blocks, Mitigation Blocks, and Breaker Blocks.',
      'Place structural stop losses behind the Order Block wick with a 3-pip buffer.'
    ],
    content: [
      'An Order Block (OB) is not arbitrary retail support or resistance. It is the footprint of algorithmic accumulation or distribution by Tier-1 institutions.',
      'A Bearish Order Block is the LAST up-close (green/bullish) candle before an aggressive downward displacement that breaks market structure. A Bullish Order Block is the LAST down-close (red/bearish) candle before an energetic upward displacement.',
      'The candle body is where real volume was accumulated. The 50% midpoint of the Order Block body is termed the "Mean Threshold" (M.T.). When price returns to mitigate the Order Block, smart money defends the Mean Threshold.',
      'If candle bodies close beyond the Mean Threshold, the Order Block is considered violated and often flips into a Breaker Block. As long as only wicks pierce M.T. while bodies respect it, the setup remains 100% valid.'
    ],
    realTimeNote: 'Order Block Law: High-probability Order Blocks MUST produce a Market Structure Shift (MSS) and leave an open Fair Value Gap. Without displacement, it is just a normal candle.',
    chartIllustrationType: 'order_block',
    tvSymbol: 'GBPUSD',
    tvTimeframe: '60',
    tvNavButtonLesson: {
      buttonName: 'Fibonacci Retracement (Alt + F)',
      shortcut: 'Alt + F',
      action: 'Pull Fibonacci from the Order Block body open to close, configuring only 0, 0.5 (Mean Threshold), and 1.0.',
      howToSample: 'On GBP/USD H1, anchor 0 at body open 1.3535 and 1 at body close 1.3505. The 0.5 level at 1.3520 is your sniper Sell Limit entry.'
    },
    samplesAndCases: [
      {
        title: 'GBP/USD H1 Bearish Order Block Mean Threshold Fill',
        type: 'win_case',
        description: 'At London open, GBP/USD printed an H1 green candle followed by an aggressive 60-pip drop breaking previous day low.',
        mathSnippet: 'OB Body: 1.3535 to 1.3505. Mean Threshold (50%): 1.3520. Sell Limit filled at 1.3520, SL: 1.3555 (35 pips), Target: 1.3420 (+100 pips).',
        takeaway: 'Entering at the Mean Threshold rather than the front edge gives 15 extra pips of profit and lower drawdown.'
      }
    ],
    practiceExercise: {
      prompt: 'Load the Super Analysis Tool in Pillar 02 and test an entry at the Mean Threshold of a recent H1 Order Block.',
      actionHint: 'Notice how the confluence score checks whether price is within 5 pips of the 20/50 EMA dynamic line.',
      toolTarget: '/strategy-vault'
    },
    liveMarketExample: 'Examine the H1 chart on GBP/USD (~1.34998). Find the last green candle before the London morning sell-off. Price tapped its 50% Mean Threshold before collapsing.',
    homework: 'Identify one Bullish Order Block on M15 EUR/USD that resulted in a break of structure. Mark its 50% Mean Threshold.',
    quiz: {
      question: 'What is the "Mean Threshold" of an ICT Order Block?',
      options: [
        'The highest wick of the day',
        'The 50% midpoint of the Order Block candle body',
        'The 200 Simple Moving Average',
        'The spread charged by FXPesa'
      ],
      correctIndex: 1,
      explanation: 'The Mean Threshold is the 50% mathematical midpoint of the Order Block body, serving as the primary algorithmic defense level.'
    }
  },
  {
    id: 'ict-4',
    belt: 'ict',
    levelTag: 'ICT Institutional Master',
    number: '15',
    title: 'ICT Market Structure Shift (MSS) with Displacement vs Retail Fakeouts',
    duration: '22 mins',
    summary: 'Distinguish between a deceitful wick sweep and a genuine algorithmic displacement that confirms an institutional change in trend.',
    learningObjectives: [
      'Differentiate between a liquidity sweep (wick only) and a Market Structure Shift (candle body close).',
      'Recognize displacement candles: Long bodies, tiny wicks, expanding volume.',
      'Verify the presence of an unmitigated FVG before taking a continuation trade.',
      'Avoid entering early before structure confirms.'
    ],
    content: [
      'Many retail traders lose money trying to trade every "Change of Character" (CHoCH) they see on 1-minute or 5-minute charts. Most of these are merely liquidity sweeps or internal consolidation wicks.',
      'A genuine ICT Market Structure Shift (MSS) requires "Displacement"—an energetic, forceful price move characterized by consecutive large-bodied candles that close with authority past the swing point and leave an unmitigated Fair Value Gap behind.',
      'Candle Body vs Wick Rule: A wick beyond a swing high/low is a LIQUIDITY SWEEP. Only a solid candle BODY close confirms an MSS.',
      'Once an MSS is verified, do NOT chase the market. Wait for the retracement into the newly created Fair Value Gap or Order Block for your sniper entry.'
    ],
    realTimeNote: 'Displacement is the signature of institutional algorithms. Without large bodies and an FVG, a break is presumed to be a retail trap.',
    chartIllustrationType: 'pinbar_tower',
    tvSymbol: 'USDJPY',
    tvTimeframe: '15',
    tvNavButtonLesson: {
      buttonName: 'Crosshair Tool (Ctrl + Click / Mousewheel)',
      shortcut: 'Alt + C',
      action: 'Use the Crosshair tool to precisely measure candle body close prices relative to the previous swing high/low line.',
      howToSample: 'Hover Crosshair over swing high at 158.10. Check the displacement candle close: 158.45. A 35-pip body close confirms MSS.'
    },
    samplesAndCases: [
      {
        title: 'USD/JPY M15 Genuine MSS with Displacement',
        type: 'win_case',
        description: 'Pullback in USD/JPY shifted bullish when a massive 30-pip green candle closed above 158.45 with an open FVG below.',
        mathSnippet: 'Entry on FVG retest: 158.250, SL: 158.000 (25 pips), TP: 159.350 (+110 pips). R:R = 1:4.4.',
        takeaway: 'Displacement provides institutional validation that smart money has flipped net positioning from short to long.'
      }
    ],
    practiceExercise: {
      prompt: 'Check the AI Scanner in Pillar 04 and select USD/JPY M15 to run a structural displacement check.',
      actionHint: 'See if the scanner scores the setup as HIGH PROBABILITY (>75%) based on EMA and momentum alignment.',
      toolTarget: '/ai-scanner'
    },
    liveMarketExample: 'Compare a wick poke that instantly reverses (Sweep) vs two large candles closing 20 pips past the level (Displacement). That is the difference between getting trapped and winning.',
    homework: 'Find 2 examples of false wick breakouts on M15 EUR/USD and 2 examples of true displacement MSS.',
    quiz: {
      question: 'What confirms a genuine ICT Market Structure Shift (MSS) as opposed to a false liquidity sweep?',
      options: [
        'A single pip wick poke beyond the level',
        'A solid candle BODY close beyond the swing point accompanied by displacement and an FVG',
        'The MACD crossing the zero line',
        'A news headline on Twitter'
      ],
      correctIndex: 1,
      explanation: 'A genuine MSS requires a solid candle body close past structure with displacement (large bodies) and an unmitigated FVG.'
    }
  },
  {
    id: 'ict-5',
    belt: 'ict',
    levelTag: 'ICT Institutional Master',
    number: '16',
    title: 'ICT London Judas Swing & NY AM Silver Bullet (EAT Nairobi Clocks)',
    duration: '28 mins',
    summary: 'Master the high-probability institutional execution clocks in East Africa Time (EAT UTC+3): London Open 10:00 AM Judas Swing & NY AM 15:30 Silver Bullet.',
    learningObjectives: [
      'Map the Asian Range (03:00 - 10:00 EAT) and identify its high and low as liquidity targets.',
      'Trade the London Judas Swing (10:00 - 11:30 AM EAT) false move.',
      'Execute the New York AM Silver Bullet (15:30 - 16:30 EAT) 60-minute window.',
      'Target a minimum of 15 pips draw on liquidity with strict 1:2 R:R.'
    ],
    content: [
      'Price without Time is meaningless; Time without Price is useless. In ICT methodology, high-frequency algorithms do not trade randomly all day. They operate inside strict institutional time windows called Killzones.',
      'Kenyan traders enjoy the supreme geographical privilege of East Africa Time (EAT, UTC+3), perfectly synced with European and American banking desks.',
      'Window 1: The London Judas Swing (10:00 - 11:30 AM EAT). London opens and intentionally pushes price in the OPPOSITE direction of the true daily trend to sweep the Asian Session High or Low. Between 10:15 and 10:45 AM EAT, price purges liquidity, prints an MSS, and reverses into the true daily expansion.',
      'Window 2: The New York AM Silver Bullet (15:30 - 16:30 EAT). This 60-minute window occurs during peak US economic releases and London/NY overlap. An algorithmic draw on liquidity creates an M5 or M15 Fair Value Gap that delivers a crisp 15 to 35 pips move.'
    ],
    realTimeNote: 'Kenya Schedule: London Judas = 10:00 - 11:30 AM EAT. NY AM Silver Bullet = 15:30 - 16:30 EAT. Never enter new market orders during midnight rollover (11:55 PM - 12:30 AM EAT)!',
    chartIllustrationType: 'judas_swing',
    tvSymbol: 'GBPUSD',
    tvTimeframe: '15',
    tvNavButtonLesson: {
      buttonName: 'Timezone Clock (Bottom Right of TradingView)',
      shortcut: 'Click "UTC" at bottom right',
      action: 'Click the UTC timezone at the bottom right corner of TradingView and set to "UTC+3 Nairobi".',
      howToSample: 'Click UTC -> Select "(UTC+3) Nairobi". All candle timestamps on your screen will now match your phone clock and Kenyan bank hours perfectly!'
    },
    samplesAndCases: [
      {
        title: 'The London Judas Swing Execution on GBP/USD',
        type: 'win_case',
        description: 'Asian range was 1.3485 to 1.3522. At 10:15 AM EAT, London open spiked to 1.35450 (+23 pips above Asian high). At 10:45 AM EAT, M15 candle closed back at 1.35100.',
        mathSnippet: 'Short at 1.35100, SL: 1.35320 (22 pips), TP: Asian Low 1.34850 (+25.0 pips). Won cleanly in 45 minutes.',
        takeaway: 'Wait 30 minutes after London open (10:30 AM EAT) before pulling the trigger. The first move is almost always the Judas fakeout.'
      },
      {
        title: 'The NY AM Silver Bullet M5 FVG on EUR/USD',
        type: 'win_case',
        description: 'At 15:30 EAT US Core CPI release, price displaced down 40 pips. At 15:45 EAT, price retraced into M5 FVG at 1.1267 and delivered 25 pips straight to previous day low.',
        mathSnippet: 'Risk: 12 pips ($1.20 on 0.01 lot). Reward: 25 pips ($2.50). Clean 1:2.08 payout.',
        takeaway: 'Silver Bullet setups are mechanical: Identify the liquidity draw, wait for the FVG, set limit order, take profit at pool.'
      }
    ],
    practiceExercise: {
      prompt: 'Check the real-time Nairobi EAT Clock in the navbar and determine which session is currently active.',
      actionHint: 'If London or NY is active, switch to M15 to look for Killzone Fair Value Gaps.',
      toolTarget: '/live-pulse'
    },
    liveMarketExample: 'Set an alarm on your phone for 10:15 AM EAT. Observe how GBP/USD moves during London open. You will witness the Judas Swing firsthand.',
    homework: 'Record 5 consecutive London Opens (10:00 - 11:00 AM EAT) and note whether the initial move swept Asian high or Asian low.',
    quiz: {
      question: 'What is the "Judas Swing" during the London Open session in East Africa Time (EAT)?',
      options: [
        'A religious ceremony in London',
        'A deceptive false move that sweeps Asian range liquidity before reversing into the true daily trend',
        'The closing bell of the London Stock Exchange',
        'A spread widening by CMA Kenya'
      ],
      correctIndex: 1,
      explanation: 'The Judas Swing is the institutional deception move that drives price into Asian high/low liquidity before reversing in the true direction.'
    }
  },
  {
    id: 'ict-6',
    belt: 'ict',
    levelTag: 'ICT Institutional Master',
    number: '17',
    title: 'ICT Power of 3 (AMD) & Institutional Order Flow Mastery',
    duration: '25 mins',
    summary: 'The ultimate institutional blueprint: Accumulation (Asian), Manipulation (London), Distribution (New York). Predicting daily candlestick anatomy.',
    learningObjectives: [
      'Master the Power of 3 (AMD): Accumulation, Manipulation, Distribution.',
      'Predict whether the Daily candle will be a Bullish Expansion or Bearish Expansion.',
      'Use the Long/Short Position Tool on TradingView to calculate precise 1:3 R:R setups.',
      'Synthesize ICT with the Gilgil $2 rule to build a scalable prop firm strategy.'
    ],
    content: [
      'Every candlestick has 4 values: Open, High, Low, and Close (OHLC). The ICT Power of 3 (AMD) explains how smart money creates the daily bar:',
      '1. Accumulation (Asian Session 03:00 - 10:00 EAT): Smart money establishes initial positions quietly within a narrow consolidation range.',
      '2. Manipulation (London Open 10:00 - 12:00 EAT): The algorithm intentionally moves price BELOW the daily open (for a bullish day) or ABOVE the daily open (for a bearish day). This creates the high or low of the day (the Judas Swing wick).',
      '3. Distribution (NY Session 15:30 - 20:00 EAT): The market expands powerfully in the true institutional direction toward opposing liquidity, distributing positions into the hands of breakout chasers.',
      'If your daily bias is Bullish, you look to BUY BELOW THE DAILY OPEN during the London manipulation wick. If your bias is Bearish, you look to SELL ABOVE THE DAILY OPEN. This is the holy grail of institutional timing.'
    ],
    realTimeNote: 'AMD Law: In a bullish day, Open is near the bottom, Manipulation creates the Low of the day, Distribution creates the High, and price Closes near the top.',
    chartIllustrationType: 'sessions_eat',
    tvSymbol: 'EURUSD',
    tvTimeframe: 'D',
    tvNavButtonLesson: {
      buttonName: 'Long / Short Position Tool (Left Toolbar)',
      shortcut: 'Alt + P / 7th Tool Menu',
      action: 'Click Long Position or Short Position to visually place your Entry, Stop Loss, and Take Profit targets.',
      howToSample: 'Select Short Position tool, click entry at 1.35100, drag red SL zone to 1.35300 (20 pips), drag green TP zone to 1.34500 (60 pips). Tool displays exact 1:3 Risk-to-Reward ratio!'
    },
    samplesAndCases: [
      {
        title: 'Full Daily AMD Cycle on EUR/USD',
        type: 'win_case',
        description: 'Daily open at 1.1255. Asian consolidation 1.1248 to 1.1265. London manipulated down to 1.1225 (creating Low of the Day). Retested M15 FVG. NY expanded to 1.1310.',
        mathSnippet: 'Bought London Low at 1.1240, SL: 1.1220 (20 pips), TP: 1.1310 (+70 pips). R:R = 1:3.5. Account gained +$7.00 on 260 KES risk.',
        takeaway: 'Buying below the daily open during London manipulation guarantees entry at the absolute low of the day.'
      }
    ],
    practiceExercise: {
      prompt: 'Open TradingView in Pillar 03 and plot the Long/Short Position tool on EUR/USD with a 1:3 Risk-to-Reward ratio.',
      actionHint: 'Notice how the green profit box and red risk box clearly display your target pips and percentage.',
      toolTarget: '/chart-mastery'
    },
    liveMarketExample: 'Look at yesterday daily candle on EUR/USD (1.12670) or GBP/USD (1.34998). Observe how the lower wick was formed between 10:00 AM and 11:30 AM EAT before expanding all afternoon.',
    homework: 'Chart 3 previous daily candles. Mark the Asian Accumulation box, London Manipulation wick, and NY Distribution body.',
    quiz: {
      question: 'In the ICT Power of 3 (AMD) framework for a bullish day, where should you look to buy?',
      options: [
        'At the daily high after New York close',
        'Below the Daily Open during the London session manipulation wick',
        'During the weekend',
        'Only on M-Pesa paybill confirmation'
      ],
      correctIndex: 1,
      explanation: 'In a bullish AMD cycle, institutions create the low of the day by manipulating price below the daily open during London open before expanding upward.'
    }
  }
];

export const MASTER_STRATEGIES: MasterclassStrategy[] = [
  {
    id: 'strat-1',
    name: 'PivotFX Tower Reversal System',
    tagline: 'The battle-tested antidote to FOMO breakout chasing. Catches institutional exhaustion at major highs.',
    winRate: 76,
    timeframe: 'M15 / H1',
    indicators: ['EMA 20 (Cyan)', 'EMA 50 (Orange)', 'RSI 14'],
    rules: {
      entry: [
        'Identify a rapid parabolic run of 3+ consecutive large candles (the Tower).',
        'Price must be extended at least 25+ pips away from the 20 EMA.',
        'RSI must touch 75+ (overbought) with bearish divergence (lower high on RSI while price makes equal/higher high).',
        'Wait for an exhaustion Pinbar or Bearish Engulfing candle that closes BACK BELOW the 20 EMA.',
        'Execute SELL entry immediately on candle close (e.g. GBP/USD at 1.35100 after rejecting 1.35450).'
      ],
      stopLoss: '5 pips above the Tower High wick (max 15-20 pips total risk).',
      takeProfit: 'First target at 50 EMA. Second target at previous session low.'
    },
    gilgilLore: 'Born from our hardest lesson in Gilgil when traders chased extended green candles without respecting the 20 EMA extension or RSI overbought status. Turning the tower into our personal edge.'
  },
  {
    id: 'strat-2',
    name: 'EMA 20/50 Dynamic Pullback Bounce',
    tagline: 'Trend-following bread and butter. Ride the institutional wave with minimal drawdown.',
    winRate: 72,
    timeframe: 'M15 / H1',
    indicators: ['EMA 20', 'EMA 50', 'Volume / Session Time'],
    rules: {
      entry: [
        'EMA 20 must be clearly separated and sloping in the same direction as EMA 50.',
        'Wait for price to retrace back into the "Value Zone" between the 20 and 50 EMA.',
        'Wait for a rejection pinbar or inside-bar breakout in the direction of the trend.',
        'Enter with market order on the close of the rejection candle.'
      ],
      stopLoss: '3 pips below the 50 EMA (for buys) or 3 pips above 50 EMA (for sells).',
      takeProfit: 'Previous swing high / 1:2.5 Risk-to-Reward ratio.'
    },
    gilgilLore: 'The workhorse strategy used during the London session to capture smooth 30-pip runs.'
  },
  {
    id: 'strat-3',
    name: 'RSI 70/30 Snapback Divergence',
    tagline: 'Counter-trend scalping for disciplined traders who wait for extreme market exhaustion.',
    winRate: 68,
    timeframe: 'M5 / M15',
    indicators: ['RSI 14 with 70/30 levels', 'Support/Resistance levels'],
    rules: {
      entry: [
        'Price forms a new higher high, but RSI forms a noticeably LOWER high (Bearish Divergence).',
        'Or price forms a new lower low, but RSI forms a HIGHER low (Bullish Divergence).',
        'Wait for RSI to cross back through the 70 or 30 baseline.',
        'Enter in the direction of the divergence.'
      ],
      stopLoss: 'Beyond the extreme swing wick (strictly sized to $2 max loss).',
      takeProfit: 'Opposite EMA 20 dynamic mean line.'
    },
    gilgilLore: 'Catches the turning points when retail breakout traders are caught in false breakouts.'
  },
  {
    id: 'strat-4',
    name: 'London Open 11:00 AM EAT Breakout',
    tagline: 'Captures the explosive European bank liquidity surge at 11 AM Kenyan time.',
    winRate: 74,
    timeframe: 'M5 / M15',
    indicators: ['Asian Session Range Box (3 AM - 10:45 AM EAT)', 'EMA 20'],
    rules: {
      entry: [
        'Mark the Asian High and Asian Low between 3:00 AM and 10:45 AM EAT on EUR/USD or GBP/USD.',
        'At 11:00 AM EAT, watch for the London session breakout candle.',
        'Beware of the 15-minute fakeout (Judas Swing). If price sweeps the Asian High and quickly rejects back below, short the fakeout.',
        'If price closes strong outside the box with volume, enter the continuation.'
      ],
      stopLoss: 'Midpoint of the Asian session range box.',
      takeProfit: '1.5x the height of the Asian range projected outward.'
    },
    gilgilLore: 'The preferred strategy for Kenyan traders working day jobs who can trade during lunch break.'
  },
  {
    id: 'strat-5',
    name: 'The $2 Small Account Survival Protocol',
    tagline: 'Mathematical capital preservation for $20 to $50 Kenyan M-Pesa accounts.',
    winRate: 88,
    timeframe: 'Any',
    indicators: ['Position Size Calculator', 'Equity Guard'],
    rules: {
      entry: [
        'Maximum lot size fixed strictly at 0.01 micro lot.',
        'Calculate stop loss in pips: On EUR/USD, 20 pips stop = exactly $2.00 risk.',
        'Never open more than ONE position at a time.',
        'If you lose 2 trades in a day (-$4.00), activate the 1-Hour Kill Switch and stop trading.'
      ],
      stopLoss: 'Rigid $2.00 stop loss hardcoded into MT4/MT5 order.',
      takeProfit: 'Target $4.00 to $6.00 profit (1:2 to 1:3 R:R).'
    },
    gilgilLore: 'The foundation of everything in PivotFX Lab. This protocol is why our community never blows accounts.'
  }
];

export const FAQS = [
  {
    q: 'Why is PivotFX Lab specifically for FXPesa, HFM, and FBS instead of Deriv?',
    a: 'Deriv specializes in synthetic volatility indices (which is covered by our sister project TickWealth). PivotFX Lab is dedicated purely to the global foreign exchange currency market (EUR/USD, GBP/USD, Gold) traded through reputable forex brokers. FXPesa is the premier choice in Kenya because it holds an official non-dealing online forex broker license from the Capital Markets Authority (CMA) with direct Lipa Na M-Pesa deposits.'
  },
  {
    q: 'Why do brokers sometimes reject Stop Loss or Take Profit with [Invalid S/L or T/P]?',
    a: 'MT4/MT5 brokers (like FXPesa) strictly enforce minimum stop-level distances relative to the live Bid/Ask quote: for a BUY trade, Stop Loss must be strictly BELOW current Bid and Take Profit strictly ABOVE current Ask; for a SELL trade, Stop Loss must be strictly ABOVE current Ask and Take Profit strictly BELOW current Bid (and further away than the broker freeze level, e.g. ~5–15 pips). Never type numbers from an old screenshot or spot price if you are trading Futures (e.g. XAU/USD Spot ~3955 vs Gold Futures ~4041).'
  },
  {
    q: 'How does the $2 Rule work with Lipa Na M-Pesa?',
    a: 'If you deposit 3,000 KES (approx $23 USD) via M-Pesa into FXPesa, you must never risk $5 or $10 on a single trade. By trading 0.01 micro lots with a 20-pip stop loss, your risk is capped at $2.00 (approx 260 KES). This gives you at least 11 consecutive attempts to find your groove, completely neutralizing emotional panic and revenge trading.'
  },
  {
    q: 'Is PivotFX Lab licensed by the CMA?',
    a: 'No. PivotFX Lab is an UNREGISTERED, free educational and research project created for learning and self-study. We do not provide financial advice, we do not manage client funds, and we do not sell VIP signals. FXPesa (EGM Securities) is the broker that is CMA licensed. Forex trading carries high risk, and 70-80% of retail traders lose capital.'
  },
  {
    q: 'Can I really scan my MT4 laptop screen using my phone camera on this website?',
    a: 'Yes! PivotFX Lab includes a real browser-based Camera Scanner (Option B). When you click "Open Camera Scanner" and grant camera permissions, the app uses your camera and HTML5 Canvas image analysis to inspect the price, detect colored EMA lines, and calculate distance from key moving averages on your screen.'
  },
  {
    q: 'Can I host this on GitHub Pages for free?',
    a: 'Yes! PivotFX Lab is built as a pure, responsive client-side Single Page Application. It uses browser localStorage for saving your journal trades, masterclass progress, and kill-switch timers. You can build and drag the `dist` folder files straight to your GitHub Pages repository or any static host.'
  }
];
