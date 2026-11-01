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
  }
];

export const PAIRS_PRESETS: Record<CurrencyPair, { defaultPrice: number; pipDecimals: number; pipValueKes: number }> = {
  'EUR/USD': { defaultPrice: 1.0842, pipDecimals: 4, pipValueKes: 130 },
  'GBP/USD': { defaultPrice: 1.2915, pipDecimals: 4, pipValueKes: 130 },
  'USD/JPY': { defaultPrice: 153.40, pipDecimals: 2, pipValueKes: 110 },
  'GBP/JPY': { defaultPrice: 198.20, pipDecimals: 2, pipValueKes: 110 },
  'XAU/USD': { defaultPrice: 2742.50, pipDecimals: 2, pipValueKes: 130 },
  'AUD/USD': { defaultPrice: 0.6580, pipDecimals: 4, pipValueKes: 130 },
  'USD/CAD': { defaultPrice: 1.3890, pipDecimals: 4, pipValueKes: 120 },
};

// Gilgil Historical Case Studies
export const HISTORICAL_GILGIL_CASES = {
  towerLoss: {
    symbol: 'GBP/USD / Gold Equivalent',
    price: 1296.56,
    date: 'Gilgil Live Trading Session — The Turning Point',
    description: 'Entered LONG at 1296.56 after 4 consecutive green candles. Price was 42 pips above the 20 EMA and 68 pips above 50 EMA. RSI was 83.2 (severe overbought divergence). No stop loss was set, and the position was oversized by 5x the normal account risk. A brutal Tower Top reversal wick formed within 15 minutes, cascading down 70+ pips. The entire demo/account was blown in one single revenge session.',
    lesson: 'NEVER chase candles extended far away from the 20 EMA when RSI is > 75. A high candle without dynamic EMA support is a trap waiting for institutional liquidity grab.',
  },
  towerWin: {
    symbol: 'GBP/USD / Gold Equivalent',
    price: 1291.69,
    exitPrice: 1289.38,
    date: 'Gilgil Live Trading Session — The Disciplined Execution',
    description: 'Patiently waited for the Tower Top exhaustion to confirm. Price rejected the 1292.00 resistance with a long upper rejection pinbar, closed below the 20 EMA on M15, with RSI falling from 68 back below 50. Entry executed precisely at 1291.69 with a strict $2 risk stop loss at 1293.20. Target locked at 1289.38 (previous support zone). Order executed cleanly, delivering +23.1 pips profit (+3.5R return).',
    lesson: 'Wait for the Tower to exhaust. Enter on the break back through the 20 EMA with RSI confirmation, risking strictly $2 per micro lot. Patience yields consistency.',
  }
};

export const SAMPLE_INITIAL_JOURNAL: JournalTrade[] = [
  {
    id: 'tr-01',
    timestamp: '2026-10-28 11:22 EAT',
    pair: 'GBP/USD',
    broker: 'fxpesa',
    type: 'SELL',
    entryPrice: 1291.69,
    exitPrice: 1289.38,
    score: 92,
    mode: 'Tower Reversal + EMA Retest',
    riskUsd: 2.00,
    pnlUsd: 7.20,
    status: 'WON',
    notes: 'Classic Gilgil setup. M15 upper wick rejection at 1292.00, crossed below 20 EMA, RSI was 62 turning down. Took profit at 1289.38 support.'
  },
  {
    id: 'tr-02',
    timestamp: '2026-10-25 15:45 EAT',
    pair: 'EUR/USD',
    broker: 'fxpesa',
    type: 'BUY',
    entryPrice: 1.0825,
    exitPrice: 1.0858,
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
    entryPrice: 1296.56,
    exitPrice: 1294.50,
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
    entryPrice: 1.0890,
    exitPrice: 1.0860,
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
    number: '01',
    title: 'What Is Forex & The Kenya Broker Reality',
    duration: '8 mins',
    summary: 'Understanding currency pairs, how exchange rates move, and why CMA regulation matters in Kenya.',
    content: [
      'Forex (Foreign Exchange) is simply exchanging one national currency for another — like exchanging Kenyan Shillings (KES) for US Dollars (USD). In forex trading, currencies are quoted in pairs like EUR/USD.',
      'The first currency is the BASE currency, and the second is the QUOTE currency. When EUR/USD is 1.0850, it means 1 Euro costs 1.0850 US Dollars.',
      'In Kenya, there are TWO distinct broker categories: CMA Regulated (like FXPesa, licensed by the Capital Markets Authority in Nairobi under EGM Securities) and Offshore Brokers (like HFM and FBS, licensed in Seychelles or Belize).',
      'With FXPesa, you deposit directly via Lipa Na M-Pesa with zero delay and local legal protection. With offshore brokers, you get higher leverage (1:1000+) but no Kenyan ombudsman if something goes wrong.'
    ],
    realTimeNote: 'Current Market Status: Major forex pairs trade 24 hours a day, 5 days a week from Monday morning Tokyo open to Friday evening New York close.',
    chartIllustrationType: 'candlestick_anatomy',
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
    number: '02',
    title: 'How to Use MT4, MT5 & Lipa Na M-Pesa',
    duration: '10 mins',
    summary: 'Navigating MetaTrader on phone and laptop, placing your first micro lot, and managing Kenyan mobile money.',
    content: [
      'MetaTrader 4 (MT4) and MetaTrader 5 (MT5) are the global software standards for placing forex orders. Your broker provides the server credentials (account number, trader password, server name).',
      'The three key windows: Market Watch (quotes), Chart Window (candlesticks), and Terminal/Trade Tab (open orders, equity, free margin).',
      'Placing an order requires setting your Volume (Lot Size). 0.01 is a micro lot (1,000 units of currency). On EUR/USD, 0.01 lot means each pip movement is worth approximately $0.10 (around 13 KES).',
      'When depositing with FXPesa in Kenya, use their official Lipa Na M-Pesa Paybill. Enter your MT4/MT5 account number as the account reference. Funds reflect automatically in your MT4 terminal balance within seconds.'
    ],
    realTimeNote: 'Tip from Gilgil: Always verify the server name in MT4 search! For FXPesa demo, search "EGM-Demo" or "FXPesa-Demo".',
    chartIllustrationType: 'candlestick_anatomy',
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
    number: '03',
    title: 'Candlesticks, Rejection Pinbars & The Anatomy of a Reversal',
    duration: '12 mins',
    summary: 'Mastering open, high, low, close (OHLC), long rejection shadows, and what a Pinbar reveals about buyers and sellers.',
    content: [
      'Every candlestick represents price action over a fixed timeframe (e.g., M15 = 15 minutes). A candle has a body (distance between open and close) and wicks/shadows (highest and lowest price touched).',
      'A Pinbar (Pinocchio bar) has a very small body and a long tail/wick protruding out that is at least 2x or 3x the body size.',
      'A long UPPER wick shows that buyers tried pushing price higher, but aggressive institutional sellers stepped in and slammed price back down. This is a bearish rejection.',
      'A long LOWER wick shows sellers tried pushing down, but buyers defended support aggressively. In Gilgil, we look for these pinbars at key EMA inflection points.'
    ],
    realTimeNote: 'Candlestick psychology: Wicks are where transactions were rejected. Bodies are where agreement happened.',
    chartIllustrationType: 'pinbar_tower',
    liveMarketExample: 'The Gilgil 1291.69 win formed right after an M15 candle with a 14-pip upper wick rejecting the 1292.00 round psychological resistance.',
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
    number: '04',
    title: 'The Ironclad $2 Risk Rule for Kenyan Traders',
    duration: '9 mins',
    summary: 'The mathematical secret to surviving the first 6 months. Why sizing your risk to $2 protects your capital from emotional wipeout.',
    content: [
      'Most beginner traders in Kenya start with small accounts ($20 to $50, approx 2,500 to 6,500 KES). If you risk $10 or $20 on one trade, two bad trades blow half your savings.',
      'The PivotFX $2 Rule states: On ANY single trade, your maximum allowed monetary risk is strictly $2.00 USD (approx 260 KES).',
      'With a 0.01 micro lot, $2.00 gives you 20 pips of breathing room on EUR/USD or GBP/USD. This means you can be wrong 25 CONSECUTIVE TIMES on a $50 account before blowing it.',
      'No professional strategy loses 25 times in a row if you follow basic EMA trend alignment. The $2 rule eliminates the fear of losing and stops revenge trading in its tracks.'
    ],
    realTimeNote: 'Emotional truth: You cannot revenge trade when a loss only costs 260 KES (the price of a cup of coffee and mandazi).',
    chartIllustrationType: 'two_dollar_rule',
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
    number: '05',
    title: 'The EMA 20 & 50 Confluence System',
    duration: '14 mins',
    summary: 'Using Exponential Moving Averages as dynamic support and resistance instead of static lines.',
    content: [
      'The 20 Exponential Moving Average (EMA) represents the short-term momentum of the last 20 periods. The 50 EMA represents the intermediate trend.',
      'Rule 1: When EMA 20 is above EMA 50, and both are sloping upward, look ONLY for BUY setups on pullbacks. Never short against the upward EMA slope.',
      'Rule 2: When EMA 20 is below EMA 50, and both are sloping downward, look ONLY for SELL setups on rallies into the 20/50 zone.',
      'The space between the 20 EMA and 50 EMA is called the "Value Zone". That is where institutions re-accumulate positions. When price pulls back into the Value Zone and prints a pinbar, probability jumps above 70%.'
    ],
    realTimeNote: 'Trend Filter: If price is tangled inside the 20 and 50 EMA and they are flat/horizontal, the market is CHOPPING. Close your terminal and walk away.',
    chartIllustrationType: 'ema_crossover',
    liveMarketExample: 'On GBP/USD H1 chart, notice how price bounces off the 20 EMA repeatedly during strong London session runs.',
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
    number: '06',
    title: 'RSI Momentum & The Gilgil 1291.69 Case Study',
    duration: '15 mins',
    summary: 'The authentic story: Deconstructing the 1296.56 loss vs the disciplined 1291.69 to 1289.38 win.',
    content: [
      'The Relative Strength Index (RSI 14) measures the velocity and magnitude of price changes. Conventional textbooks say "buy at 30 and sell at 70". In real markets, strong trends can stay above 70 for hours.',
      'In Gilgil, we learned this the hard way: Buying Gold/GBP at 1296.56 because "the breakout looked massive" caused a devastating loss because price was already overstretched and RSI was at 83 with bearish divergence.',
      'How the 1291.69 win was executed: We waited for price to reject the tower top, saw RSI peak at 72 and drop back through 60, and waited for the M15 candle to close below the 20 EMA.',
      'Entry was struck at 1291.69 with a 15-pip stop loss ($1.95 risk). Price dropped smoothly to the 50 EMA support at 1289.38, banking +23.1 pips. Patience beats FOMO every single day.'
    ],
    realTimeNote: 'Formula: High probability setup = Overextended Tower + RSI exhaustion + Break back through 20 EMA.',
    chartIllustrationType: 'rsi_divergence',
    liveMarketExample: 'Compare 1296.56 (chasing at the top) vs 1291.69 (entering the confirmed reversal). That 5-pip difference in entry timing is the line between blown accounts and consistent profitability.',
    homework: 'Open the Super Analysis Tool on PivotFX Lab. Enter Price: 1291.69, EMA 20: 1292.80, EMA 50: 1294.50, RSI: 46. See the score generated.',
    quiz: {
      question: 'Why did the trade at 1296.56 fail while 1291.69 succeeded?',
      options: [
        '1296.56 was placed on MT5 instead of MT4',
        '1296.56 chased an overextended move far from EMAs with RSI > 80, while 1291.69 waited for exhaustion and EMA retest',
        'The broker manipulated the price',
        'Gold was closed'
      ],
      correctIndex: 1,
      explanation: '1296.56 chased an overbought, overextended market. 1291.69 waited for the confirmed breakdown below EMA 20 with RSI falling from extreme overbought.'
    }
  },
  {
    id: 'b-3',
    belt: 'blue',
    number: '07',
    title: 'Trading Sessions: London Open at 11:00 AM East Africa Time',
    duration: '11 mins',
    summary: 'Aligning your trading day with Kenyan time (EAT UTC+3). Why 11:00 AM and 3:30 PM are the only windows that matter.',
    content: [
      'Kenyan traders have one of the greatest geographical advantages in global finance: East Africa Time (EAT, UTC+3) is perfectly aligned with European market open.',
      'The Asian Session (3:00 AM – 10:00 AM EAT) is usually quiet and range-bound. Spreads on EUR/USD and GBP/USD can be tight, but volume is low.',
      'The London Open at 11:00 AM EAT unleashes massive institutional liquidity. Banks in London, Frankfurt, and Zurich begin executing large orders. This creates the true daily trend or the classic London Judas Swing (fakeout before real direction).',
      'The New York Session opens at 3:30 PM EAT (or 4:30 PM depending on daylight savings). The overlap between 11:00 AM and 6:00 PM EAT produces 70% of the entire day\'s volume. Do NOT trade at 12:00 midnight EAT when spreads widen!'
    ],
    realTimeNote: 'Kenya Schedule: London Open = 11:00 AM EAT. NY Open = 3:30 PM EAT. Rollover Spread Danger = 11:55 PM to 12:30 AM EAT.',
    chartIllustrationType: 'sessions_eat',
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
    number: '08',
    title: 'Multi-Timeframe Confluence (H4 Trend, M15 Entry)',
    duration: '16 mins',
    summary: 'Never trade a timeframe in isolation. Aligning Higher Timeframe direction with Lower Timeframe precision.',
    content: [
      'Top-down analysis is the hallmark of professional trading: Look at H4 to identify the macro trend and major support/resistance barriers.',
      'Drop down to H1 to locate the intermediate EMA 20/50 trajectory.',
      'Drop to M15 to time your sniper entry using candlestick pinbars and RSI inflection.',
      'If H4 is in a strong uptrend (EMA 20 > EMA 50) and M15 pulls back into its own EMA 50 and prints a bullish rejection candle, you have triple-timeframe confluence. Your win rate jumps significantly.'
    ],
    realTimeNote: 'Golden rule: The higher the timeframe, the stronger the support or resistance level.',
    chartIllustrationType: 'ema_crossover',
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
    number: '09',
    title: 'Broker Price Tricks: Spread Widening, Rollover & Slippage',
    duration: '13 mins',
    summary: 'Unmasking the hidden traps: midnight swaps, weekend gaps, liquidity voids, and how to protect yourself.',
    content: [
      'Every night at 00:00 server time (12:00 AM / 1:00 AM EAT), global interbank trading desks close their daily books and settle interest swaps.',
      'During this 15-to-30-minute window, market liquidity drops near zero. Brokers widen spreads from 1.2 pips to 6, 8, or even 15 pips on major pairs.',
      'If your Stop Loss is tight (e.g. 10 pips), the artificially widened spread can trigger your stop loss even if the chart candle never reached your price! In Gilgil, we call this the "Midnight Ghost Stop".',
      'Protection protocol: Never enter new trades between 11:45 PM and 12:30 AM EAT. If holding swing positions overnight, ensure your stop loss is buffered by at least 15 pips above normal spread.'
    ],
    realTimeNote: 'Reality Check: CMA regulation protects FXPesa clients against unauthorized balance deductions, but interbank spread widening is an unavoidable market-wide reality.',
    chartIllustrationType: 'spread_trap',
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
    number: '10',
    title: 'Building Your Mechanical Edge & Backtesting 100 Trades',
    duration: '18 mins',
    summary: 'Transforming intuition into a mathematical system. How to backtest 100 setups without risking a single Kenyan Shilling.',
    content: [
      'A trader without backtesting data is just an unguided gambler hoping for luck. You need a verifiable mathematical expectancy: Expectancy = (Win% x Avg Win) - (Loss% x Avg Loss).',
      'Step 1: Pick ONE pair (e.g. EUR/USD) and ONE strategy (e.g. PivotFX Tower Reversal).',
      'Step 2: Scroll back 6 months on TradingView. Find 100 consecutive instances where all entry rules were met.',
      'Step 3: Record: Entry price, Stop loss (fixed 15 pips), Target (fixed 30 pips for 1:2 R:R), and Outcome (Win or Loss).',
      'If 62 out of 100 trades hit target at 1:2 R:R with the $2 rule, your strategy generates a net profit of +$48 on a $50 account with absolute mathematical certainty.'
    ],
    realTimeNote: 'Professional mantra: If you cannot prove your edge over 100 historical trades, you do not have an edge.',
    chartIllustrationType: 'two_dollar_rule',
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
    number: '11',
    title: 'Forex Ethics, Telegram Scams & Teaching Legally in Kenya',
    duration: '14 mins',
    summary: 'Protecting your community. CMA laws on investment advice, fake Telegram VIP signals, and running educational workshops ethically.',
    content: [
      'In Kenya, hundreds of youth are scammed every month by fake Telegram "forex gurus" promising 100% daily returns or managing "money pools".',
      'Under the Capital Markets Act of Kenya, it is strictly ILLEGAL to collect money from the public to trade on their behalf without a fund manager license from CMA.',
      'You are legally permitted to share EDUCATIONAL research, market analysis, and teach charting tools — exactly what PivotFX Lab does as an unregistered educational project.',
      'Always disclose clearly: Trading forex involves substantial risk, 70-80% of retail traders lose money, past performance is no guarantee of future returns, and recommend CMA-licensed brokers like FXPesa.'
    ],
    realTimeNote: 'Gilgil Code of Honor: We teach how to fish. We never sell fake "guaranteed" signals, and we never touch another person\'s money.',
    chartIllustrationType: 'spread_trap',
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
  }
];

export const MASTER_STRATEGIES: MasterclassStrategy[] = [
  {
    id: 'strat-1',
    name: 'PivotFX Tower Reversal System',
    tagline: 'The battle-tested antidote to the 1296.56 disaster. Catches institutional exhaustion at major highs.',
    winRate: 76,
    timeframe: 'M15 / H1',
    indicators: ['EMA 20 (Cyan)', 'EMA 50 (Orange)', 'RSI 14'],
    rules: {
      entry: [
        'Identify a rapid parabolic run of 3+ consecutive large candles (the Tower).',
        'Price must be extended at least 25+ pips away from the 20 EMA.',
        'RSI must touch 75+ (overbought) with bearish divergence (lower high on RSI while price makes equal/higher high).',
        'Wait for an exhaustion Pinbar or Bearish Engulfing candle that closes BACK BELOW the 20 EMA.',
        'Execute SELL entry immediately on candle close (just like 1291.69).'
      ],
      stopLoss: '5 pips above the Tower High wick (max 15 pips total risk).',
      takeProfit: 'First target at 50 EMA. Second target at previous session low.'
    },
    gilgilLore: 'Born from our hardest lesson in Gilgil when we lost capital on 1296.56. Turning the tower into our personal ATM.'
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
    q: 'What is the famous Gilgil story about 1296.56 and 1291.69?',
    a: 'In Gilgil, Nakuru County, our founders suffered a painful demo and live loss by chasing a parabolic tower top at 1296.56 without respecting the 20 EMA extension or RSI overbought status. We vowed never to let beginner Kenyan traders repeat that mistake. We developed the disciplined 1291.69 reversal system and the ironclad $2 risk rule, turning painful trading lessons into a structured educational curriculum.'
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
