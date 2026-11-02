import { PillarData } from '../types';

export const PILLARS_MASTERCLASS_DATA: PillarData[] = [
  // ==========================================
  // PILLAR 1: /fx-academy — FX Academy Masterclass
  // ==========================================
  {
    id: '/fx-academy',
    route: '/fx-academy',
    number: '01',
    title: 'FX Academy Masterclass',
    subtitle: 'Zero to Pro Fundamental & Structural Blueprint',
    oneLineHook: 'Master market structure, participants, brokers, and institutional mechanics from absolute zero.',
    badge: 'Core Academy',
    category: 'Foundation',
    overview: 'The complete foundational academy designed to take a complete beginner to institutional competency. Covers global forex mechanics, currency pair pricing, market participants, order routing, broker architecture, and analytical frameworks.',
    learningOutcomes: [
      'Understand how the $7.5 Trillion/day foreign exchange market operates',
      'Distinguish between A-Book STP/ECN routing and B-Book market makers',
      'Master pip values, standard/mini/micro lots, leverage, and margin',
      'Identify London and New York session liquidity windows in East Africa Time',
      'Establish a professional TradingView and MT4/MT5 workspace'
    ],
    lessons: [
      {
        id: 'fx-01',
        number: '01',
        title: 'What is Forex & The Global FX Market',
        levelTag: 'Beginner',
        duration: '14 mins',
        summary: 'Deconstruct the world’s largest financial market where currencies are traded in simultaneous buy/sell pairs 24 hours a day.',
        concept: 'The Foreign Exchange (Forex or FX) market is a decentralized, over-the-counter (OTC) global marketplace for trading national currencies against one another. With daily turnover exceeding $7.5 Trillion, it dwarfs all equity markets combined. Currencies always trade in pairs (e.g. EUR/USD), where the first currency is the Base and the second is the Quote. Buying EUR/USD means you are buying Euros while simultaneously selling US Dollars.',
        bulletPoints: [
          'Over-the-counter (OTC): No centralized physical exchange like NYSE; trades happen across a global interbank network.',
          'Base vs Quote: Base is the fixed unit (1 EUR), Quote is how much of the second currency is needed to buy 1 Base unit.',
          '24/5 Availability: Operates continuously from Sunday 5:00 PM EST (Sydney open) to Friday 5:00 PM EST (New York close).',
          'Bid / Ask Spread: Bid is the price the broker buys from you; Ask is the price the broker sells to you. The gap is the spread.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Currency Pair Structure & Interbank Quote',
          caption: 'Anatomy of EUR/USD Bid vs Ask Spread',
          content: `   [ EUR ]  /  [ USD ]
    Base         Quote
   Currency     Currency
  
   EUR/USD = 1.08502 (Bid) / 1.08514 (Ask)
   └── Spread = 1.08514 - 1.08502 = 0.00012 = 1.2 Pips
   
   If you BUY:  Order executes at ASK (1.08514)
   If you SELL: Order executes at BID (1.08502)`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'European Central Bank signals hawkish interest rates while the US Federal Reserve hints at pausing rate hikes.',
          setup: 'Trader enters Long 1 Standard Lot at 1.0850 expecting Euro strength against the USD.',
          outcome: 'Price climbs to 1.0920 over the next 48 hours (+70 pips).',
          keyTakeaway: 'Currency value is always relative. A rising EUR/USD can mean Euro strength, US Dollar weakness, or both.'
        },
        actionableChecklist: [
          'Verify your trading platform quotes 5 decimal digits (fractional pips / pipettes).',
          'Check the spread on EUR/USD before entering; during London open it should be under 1.5 pips.',
          'Always identify whether you are entering at the Bid (Sell) or Ask (Buy).'
        ]
      },
      {
        id: 'fx-02',
        number: '02',
        title: 'Market Participants & The Interbank Hierarchy',
        levelTag: 'Beginner',
        duration: '18 mins',
        summary: 'Understand who moves the markets: Tier-1 central banks, commercial liquidity providers, hedge funds, and retail traders.',
        concept: 'Retail traders make up less than 6% of daily forex volume. The market is primarily moved by Tier-1 Investment Banks (JPMorgan, Deutsche Bank, Citibank, UBS) and Central Banks (Federal Reserve, ECB, Bank of England). These institutions transact for sovereign reserves, commercial international trade, and interbank algorithmic speculation.',
        bulletPoints: [
          'Central Banks: Control interest rates, money supply, and currency intervention (e.g. Bank of Japan yen interventions).',
          'Tier-1 Banks: Provide primary liquidity to the market via Electronic Broking Services (EBS) and Reuters matching systems.',
          'Hedge Funds & Institutional Asset Managers: Move billion-dollar order blocks based on macro yield spreads and quantitative models.',
          'Retail Brokers & Retail Traders: Retail traders trade against broker liquidity pools or B-book clearing desks.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The Forex Liquidity Pyramid',
          caption: 'How Orders Flow Down to Retail Accounts',
          content: `[ Tier 1: Central Banks & Sovereign Wealth Funds ]
       │  (Federal Reserve, ECB, BOJ, SNB)
       ▼
[ Tier 2: Mega Liquidity Banks (JPMorgan, Citi, UBS) ]
       │  (Interbank EBS / Reuters Dealing 3000)
       ▼
[ Tier 3: Non-Bank Liquidity Providers (XTX, Citadel) ]
       │  (Aggregated STP / ECN Feeds)
       ▼
[ Tier 4: Retail Forex Brokers (FXPesa, HFM, FBS) ]
       │  (MetaTrader 4 / MetaTrader 5 Bridge)
       ▼
[ Tier 5: Retail Speculators / Individual Traders ]`
        },
        realWorldExample: {
          pair: 'USD/JPY',
          context: 'Bank of Japan (BOJ) stepped in at 160.00 level conducting unannounced yen purchases.',
          setup: 'Retail traders were buying aggressively into parabolic momentum ignoring central bank warnings.',
          outcome: 'USD/JPY dropped 550 pips in under 3 hours, wiping out over-leveraged retail buyers.',
          keyTakeaway: 'Never trade directly against an active central bank intervention. Respect institutional liquidity.'
        },
        actionableChecklist: [
          'Know the central bank interest rates for the currencies you actively trade.',
          'Avoid trading 15 minutes before and after Central Bank Rate decisions (FOMC, ECB Press Conferences).',
          'Treat retail sentiment indicators as contrarian signals when sentiment reaches >85% extreme.'
        ]
      },
      {
        id: 'fx-03',
        number: '03',
        title: 'Market Structure: Trends, Ranges & Breakouts',
        levelTag: 'Intermediate',
        duration: '22 mins',
        summary: 'Read raw price action without indicators by mapping Higher Highs, Higher Lows, Lower Highs, and Lower Lows.',
        concept: 'Market structure is the visual record of auction theory. In an uptrend, demand exceeds supply, producing Higher Highs (HH) and Higher Lows (HL). In a downtrend, supply exceeds demand, producing Lower Highs (LH) and Lower Lows (LL). When supply and demand are in equilibrium, the market consolidates into a range between Support and Resistance.',
        bulletPoints: [
          'Uptrend Sequence: Price pushes to a Higher High (HH), retraces to form a Higher Low (HL) that respects previous swing points.',
          'Downtrend Sequence: Price drops to a Lower Low (LL), rallies into a Lower High (LH) that fails to surpass the previous high.',
          'Break of Structure (BOS): When price closes beyond the most recent swing high/low in the direction of the dominant trend.',
          'Change of Character (CHOCH): The first sign of a potential reversal when an uptrend violates its previous Higher Low.'
        ],
        illustration: {
          type: 'chart',
          title: 'Structural Trend & CHOCH Reversal Anatomy',
          caption: 'Visualizing BOS vs CHOCH in Price Action',
          content: `       (HH)                 (HH)
        /\                   /\
       /  \                 /  \         (LH)
      /    \       (HL)    /    \        /\
     /      \       /\    /      \      /  \
    /        \     /  \  /        \    /    \
   /          \   /    \/          \  /      \
  /            \_/                  \/        \
(Start)        (HL)                (HL)        \
                                     │          \
                   Break of Structure ──┘          ▼ (LL)
                   Failure & CHOCH = Trend Shift to Bearish!`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'GBP/USD rallied from 1.2600 to 1.2850 on the H4 timeframe making clear HHs and HLs.',
          setup: 'At 1.2850, price printed a double top and closed below the last H4 Higher Low at 1.2780 (CHOCH).',
          outcome: 'The trend reversed, plummeting 180 pips into 1.2600 liquidity pools.',
          keyTakeaway: 'Always align lower timeframe entries (M15/M5) with the dominant Higher Timeframe (H4/Daily) market structure.'
        },
        actionableChecklist: [
          'Mark your swing highs and swing lows on the H4 chart every Monday morning.',
          'Label each swing point as HH, HL, LH, or LL.',
          'Never enter a counter-trend trade unless a clear H1 CHOCH candle close has occurred.'
        ]
      },
      {
        id: 'fx-04',
        number: '04',
        title: 'Forex Broker Architecture: CMA Kenya vs Offshore',
        levelTag: 'Intermediate',
        duration: '20 mins',
        summary: 'Deconstruct A-Book STP/ECN vs B-Book Dealing Desks, CMA regulatory licenses in Kenya, and offshore high leverage.',
        concept: 'Brokers fall into two primary operational models: A-Book (Straight Through Processing / Electronic Communication Network) where the broker passes client trades directly to liquidity providers and profits solely on commissions/spread markup; and B-Book (Market Maker / Dealing Desk) where the broker takes the opposite side of client trades. In Kenya, brokers licensed by the Capital Markets Authority (CMA), like FXPesa (EGM Securities), require segregated domestic bank accounts and 1:400 max leverage caps.',
        bulletPoints: [
          'A-Book Execution: Direct liquidity routing, no conflict of interest between broker and trader; profits from trading volume.',
          'B-Book Execution: Broker internalizes orders; when the client loses, the broker profits. Often uses spread widening during news.',
          'CMA Kenya Regulation: Regulated by Capital Markets Authority under the Capital Markets Act; funds held in segregated commercial bank accounts.',
          'Offshore Brokers (HFM, FBS): Regulated in Seychelles, Belize, or Cyprus; offers up to 1:1000+ leverage but carries higher counterparty risk.'
        ],
        illustration: {
          type: 'table',
          title: 'Broker Model Comparison Matrix',
          caption: 'CMA Regulated vs Offshore Comparison',
          content: `Metric          │ FXPesa (CMA Licensed)     │ HFM / FBS (Offshore)
────────────────┼───────────────────────────┼─────────────────────────
Regulation      │ CMA Kenya (EGM Securities)│ CySEC, FSC, Seychelles
Client Funds    │ Segregated Kenyan Banks   │ Offshore Pooled Accounts
Lipa Na M-Pesa  │ Direct Paybill 832900     │ 3rd Party Payment Gateways
Max Leverage    │ 1:400                     │ 1:1000 - 1:3000
Spreads EUR/USD │ 1.2 Pips Raw/Std          │ 1.1 - 1.4 Pips
Dispute Recourse│ Kenyan Judicial System    │ Offshore Ombudsmen`
        },
        realWorldExample: {
          pair: 'USD/KES & EUR/USD',
          context: 'Trader deposits 15,000 KES via Safaricom M-Pesa into FXPesa vs an unregulated offshore Telegram broker.',
          setup: 'Both generate 20% profit. Trader requests a withdrawal on a Friday afternoon.',
          outcome: 'FXPesa funds hit M-Pesa within 12 minutes. The unregulated broker locked account requesting "tax fee".',
          keyTakeaway: 'Regulation protects your principal capital. Never risk funds with brokers lacking legitimate regulatory oversight.'
        },
        actionableChecklist: [
          'Check the broker’s regulatory registration number on the CMA Kenya official portal (cma.or.ke).',
          'Confirm your broker provides negative balance protection so you never owe money past zero.',
          'Test a small deposit and withdrawal via M-Pesa before committing significant capital.'
        ]
      },
      {
        id: 'fx-05',
        number: '05',
        title: 'TradingView Account Setup & Professional Workspace',
        levelTag: 'Beginner',
        duration: '16 mins',
        summary: 'Configure a clean, institutional charting workspace in TradingView with zero visual noise and customized layout templates.',
        concept: 'TradingView is the global benchmark for technical charting. Professional traders do not clutter their workspace with 10 rainbow indicators. An institutional workspace uses dark mode, custom muted candlestick colors (e.g. emerald green and slate grey or muted gold), key session breaks, and shortcuts for rapid tool selection.',
        bulletPoints: [
          'Dark Theme Architecture: Reduces eye strain during multi-hour London and New York session monitoring.',
          'Candlestick Customization: Remove bright neon colors; use solid, clear borders and thin wicks.',
          'Drawing Favorites Bar: Star key tools (Trendline, Horizontal Ray, Rectangle, Fibonacci, Long/Short Position).',
          'Session Breaks (Alt + S): Automatically marks the start of each new trading day for session-range analysis.'
        ],
        illustration: {
          type: 'steplist',
          title: 'TradingView Institutional Setup Steps',
          caption: 'Fast-Track Configuration Guide',
          content: `Step 1: Open TradingView.com -> Create Free or Pro Account
Step 2: Right-click Chart -> Settings -> Appearance -> Background: Solid Dark (#0F172A)
Step 3: Symbol Settings: Bullish Body (#00C261 or #D4AF37), Bearish Body (#EF4444 or #475569)
Step 4: Enable 'Session Breaks' (Settings -> Events -> Session Breaks)
Step 5: Add Indicators: EMA 20 (Length 20, Cyan/Gold), EMA 50 (Length 50, Orange/White), RSI 14
Step 6: Save Layout as 'PivotFx Master Template'`
        },
        realWorldExample: {
          pair: 'EUR/USD M15',
          context: 'Trader with 8 overlapping indicators missed a clean support-and-resistance bounce due to indicator lag.',
          setup: 'Cleaned chart down to price action, 20 EMA, and session breaks.',
          outcome: 'Spotted a clean pinbar rejection at previous day’s high with zero visual confusion.',
          keyTakeaway: 'Simplicity produces execution speed. The clearer the chart, the faster and more decisive your analysis.'
        },
        actionableChecklist: [
          'Save your TradingView favorites toolbar with only 5 essential drawing tools.',
          'Set your chart time zone to UTC+3 (Africa/Nairobi) to synchronize with East Africa Time.',
          'Create a dedicated Watchlist containing EUR/USD, GBP/USD, USD/JPY, and XAU/USD.'
        ]
      },
      {
        id: 'fx-06',
        number: '06',
        title: 'MT4 & MT5 Terminal Installation & Order Mechanics',
        levelTag: 'Beginner',
        duration: '18 mins',
        summary: 'Master the execution terminals used by institutional prop firms: order types, lot entry, trailing stops, and VPS setup.',
        concept: 'While TradingView is optimal for charting, MetaTrader 4 (MT4) and MetaTrader 5 (MT5) remain the global standard for direct market execution, automated Expert Advisors (EAs), and prop firm evaluations. Understanding the difference between Market Execution and Pending Orders (Buy Limit, Sell Limit, Buy Stop, Sell Stop) is essential for precision risk control.',
        bulletPoints: [
          'Market Execution: Enters immediately at the best available current market price (Ask for buy, Bid for sell).',
          'Limit Orders (Buy/Sell Limit): Expects price to retrace to a specific favorable price, bounce, and continue.',
          'Stop Orders (Buy/Sell Stop): Expects price to break out through a specific price level with momentum.',
          'Terminal Navigation: Ctrl + M opens Market Watch, Ctrl + T opens Terminal/Trade tab, F9 opens Order Window.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The 4 Pending Order Types Visualized',
          caption: 'How Limit vs Stop Orders Execute',
          content: `   BUY LIMIT (Below Price)        SELL LIMIT (Above Price)
        Price: 1.0850                   Pending Sell: 1.0900
          │  (Drops down)                  ▲  (Rallies up)
          ▼                                │
   Pending Buy: 1.0820 ──► Bounces UP    Price: 1.0850 ──► Drops DOWN
   ────────────────────────────────────────────────────────────────
   BUY STOP (Above Price)         SELL STOP (Below Price)
   Pending Buy: 1.0900                    Price: 1.0850
          ▲  (Breaks up)                   │  (Breaks down)
          │                                ▼
        Price: 1.0850                  Pending Sell: 1.0800`
        },
        realWorldExample: {
          pair: 'XAU/USD (Gold)',
          context: 'Trader wanted to buy Gold at $2,350 support while away at their day job in Gilgil.',
          setup: 'Placed a Buy Limit order at $2,350.50 with a Stop Loss at $2,345.00 and Take Profit at $2,365.00.',
          outcome: 'During the London open wick, price dipped to $2,350.20, triggered the Buy Limit, and rallied $18/oz.',
          keyTakeaway: 'Limit orders eliminate emotional market chasing and ensure you enter only at planned discount levels.'
        },
        actionableChecklist: [
          'Download MT4/MT5 directly from your verified broker client portal.',
          'Memorize the shortcut F9 to open the instant execution window.',
          'Always input your Stop Loss in the F9 window BEFORE clicking Buy or Sell.'
        ]
      },
      {
        id: 'fx-07',
        number: '07',
        title: 'Currency Pairs Explained: Majors, Minors & Exotics',
        levelTag: 'Beginner',
        duration: '15 mins',
        summary: 'Categorize the forex spectrum: tight-spread Majors, volatile Minors, and high-spread Exotics like USD/KES.',
        concept: 'Currency pairs are categorized into three distinct tiers based on liquidity, market volume, and typical spread. Major pairs always include the US Dollar paired with another top-tier economy (EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD). Minor pairs (Crosses) pair major economies without the USD (EUR/GBP, GBP/JPY). Exotic pairs pair a major currency with an emerging economy (USD/KES, USD/ZAR) and carry wider spreads and lower liquidity.',
        bulletPoints: [
          'Major Pairs: 75% of global volume; tightest spreads (0.0 to 1.5 pips), highest liquidity, lowest slippage risk.',
          'Cross Pairs: Good for trending moves (especially JPY crosses like GBP/JPY), but spreads are slightly wider (1.5 to 3.5 pips).',
          'Exotic Pairs: High spread cost (often 20 to 100+ pips); sensitive to political events and local central bank currency controls.',
          'Prop Firm Rule: 95% of funded prop firm challenges are passed exclusively on Majors and Gold (XAU/USD).'
        ],
        illustration: {
          type: 'table',
          title: 'Pair Categorization & Spread Profile',
          caption: 'Forex Pair Liquidity Spectrum',
          content: `Category   │ Examples                 │ Typical Spread │ Best Trading Strategy
───────────┼──────────────────────────┼────────────────┼───────────────────────
Majors     │ EUR/USD, GBP/USD, USD/JPY│ 0.6 - 1.4 Pips │ Scalping, Day Trading
Crosses    │ GBP/JPY, EUR/JPY, EUR/GBP│ 1.5 - 3.2 Pips │ Session Breakouts, Swing
Exotics    │ USD/KES, USD/ZAR, USD/TRY│ 25 - 150+ Pips │ Macro Trend (Not Scalping)
Metals     │ XAU/USD (Gold)           │ 1.5 - 3.5 Pips │ High Volatility Scalp`
        },
        realWorldExample: {
          pair: 'EUR/USD vs USD/KES',
          context: 'Newbie trader tries to scalp USD/KES on a 1-minute chart with a 50 KES spread.',
          setup: 'Entered trade; account was immediately -$25.00 purely due to spread cost.',
          outcome: 'Trade closed at a loss before price even moved.',
          keyTakeaway: 'Never scalp exotic pairs. Stick to EUR/USD, GBP/USD, or USD/JPY where spreads are negligible.'
        },
        actionableChecklist: [
          'Remove all exotic pairs from your active day trading watchlist.',
          'Focus 80% of your initial 90-day learning on EUR/USD and GBP/USD.',
          'Check the spread column in MT4 Market Watch before taking any trade.'
        ]
      },
      {
        id: 'fx-08',
        number: '08',
        title: 'Pips, Point Values, Lot Sizing & Leverage Math',
        levelTag: 'Intermediate',
        duration: '24 mins',
        summary: 'Master the core mathematics of forex: calculating pip values, Standard vs Mini vs Micro lots, and purchasing power.',
        concept: 'A "Pip" (Percentage in Point) is the standard unit of measurement for price changes in forex, representing 1/100th of 1% (0.0001) for most pairs (or 0.01 for JPY pairs). A Standard Lot is 100,000 units of base currency ($10/pip on EUR/USD), a Mini Lot is 10,000 units ($1/pip), and a Micro Lot is 1,000 units ($0.10/pip). Leverage multiplies your purchasing power by allowing you to control large contract sizes with minimal collateral deposit.',
        bulletPoints: [
          'Pip Calculation (4-digit pairs): 1.0850 to 1.0860 is a 10 pip movement.',
          'JPY Pairs (2-digit pairs): 155.20 to 155.30 is a 10 pip movement.',
          'Standard Lot (1.00): 100,000 units -> ~$10.00 per pip on EUR/USD.',
          'Mini Lot (0.10): 10,000 units -> ~$1.00 per pip on EUR/USD.',
          'Micro Lot (0.01): 1,000 units -> ~$0.10 per pip on EUR/USD.',
          'Leverage Double-Edge: 1:100 leverage requires $1,000 margin for a 1.00 lot instead of $100,000.'
        ],
        illustration: {
          type: 'formula',
          title: 'Lot Sizing & Pip Value Formulas',
          caption: 'The Fundamental Mathematics of Trading',
          content: `1. Pip Value Formula:
   Pip Value = (1 Pip / Exchange Rate) * Lot Size Units
   *For EUR/USD: 1 Standard Lot (1.00) = Exactly $10.00 USD / Pip

2. Required Margin Formula:
   Required Margin = (Units * Current Price) / Leverage Ratio
   Example: 1 Standard Lot EUR/USD at 1.0850 with 1:100 Leverage
   Required Margin = (100,000 * 1.0850) / 100 = $1,085.00 USD

3. Risk-Based Lot Size Formula:
   Lot Size = Amount to Risk ($) / (Stop Loss in Pips * Pip Value per Standard Lot)`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'Trader with a $200 account risks $2.00 (the Gilgil rule) with a 20-pip stop loss.',
          setup: 'Calculate lot size: $2.00 / (20 pips * $10/pip) = 0.01 Micro Lot.',
          outcome: 'Price hit stop loss. Trader lost exactly $2.00 (1% of account). Account was 100% safe.',
          keyTakeaway: 'Always calculate lot size based on fixed dollar risk and stop loss distance, NEVER by guessing.'
        },
        actionableChecklist: [
          'Commit the lot sizes to memory: 1.00 = $10/pip, 0.10 = $1/pip, 0.01 = $0.10/pip.',
          'Never place a trade without calculating the exact dollar risk beforehand.',
          'Use 0.01 micro lots whenever testing a new strategy on live capital.'
        ]
      },
      {
        id: 'fx-09',
        number: '09',
        title: 'Margin Requirements, Free Margin & The Stop-Out',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'Demystify Balance vs Equity, Margin Level Percentage, Margin Calls, and how brokers liquidate over-leveraged accounts.',
        concept: 'Many beginners confuse Account Balance with Equity. Balance is your closed trade cash. Equity is Balance plus/minus floating profits or losses. Used Margin is the capital locked by your broker as collateral to maintain open positions. Free Margin is Equity minus Used Margin. When Margin Level (Equity / Used Margin * 100) drops below broker thresholds (typically 50% or 30%), the broker automatically triggers a Stop-Out, liquidating your trades at the worst possible market price.',
        bulletPoints: [
          'Balance: Cash in your account excluding open floating positions.',
          'Equity: Real-time value of your account (Balance + Floating PnL).',
          'Free Margin: Capital available to open new trades or absorb drawdowns.',
          'Margin Level %: (Equity / Used Margin) * 100. Over 500% is safe; under 100% is dangerous; 30-50% triggers Stop-Out.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Account Liquidation Sequence (The Blowout Flow)',
          caption: 'How Over-leveraging Triggers Broker Stop-Out',
          content: `Account Equity Starts at $1,000
    │
    ▼ Trader opens 2.00 Standard Lots (Requires $900 Margin at 1:200 leverage)
Used Margin: $900  │  Free Margin: $100  │  Margin Level: 111% (DANGER ZONE!)
    │
    ▼ Market moves -10 pips against position (-$200 floating loss)
Equity drops to $800  │  Used Margin: $900  │  Margin Level drops to 88%
    │
    ▼ Margin Call Warning: Broker alerts trader to deposit funds
    │
    ▼ Market moves another -15 pips (-$300 additional loss)
Equity drops to $300  │  Margin Level drops to 33% (Stop-Out Threshold!)
    │
    └──► BROKER SYSTEM AUTOMATICALLY CLOSES TRADES (ACCOUNT BLOWN)`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader with $500 balance opened 0.50 lot during high-impact US CPI news.',
          setup: 'Market spiked 35 pips against them in 4 seconds (-$175 loss).',
          outcome: 'Margin level plummeted to 42%, triggering an automated broker stop-out liquidation.',
          keyTakeaway: 'Maintain a minimum Margin Level of 1,000% at all times by never over-leveraging.'
        },
        actionableChecklist: [
          'Keep your Margin Level above 1,000% on every open position.',
          'Never use more than 10% of your account balance as Used Margin simultaneously.',
          'Understand that Stop-Out is an automated broker algorithm, not a personal conspiracy.'
        ]
      },
      {
        id: 'fx-10',
        number: '10',
        title: 'Global Trading Sessions & Nairobi EAT Confluence',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'Synchronize your clock with the 4 global market sessions: Sydney, Tokyo Asian Range, London Open, and New York Overlap in EAT.',
        concept: 'The forex market is not uniformly volatile throughout the day. Volume follows institutional banking hours. In East Africa Time (EAT / UTC+3), the Asian Session (Tokyo) runs from 3:00 AM to 10:00 AM EAT, typically setting the daily accumulation range. The London Session opens at 11:00 AM EAT, triggering explosive liquidity breakouts. The London / New York Overlap from 3:30 PM to 7:30 PM EAT represents peak daily volume, moving over 60% of all daily pips.',
        bulletPoints: [
          'Asian Session (3:00 AM - 10:00 AM EAT): Tight consolidation; ideal for setting support and resistance boundaries.',
          'London Session Open (11:00 AM EAT): Institutional manipulation sweeps Asian highs/lows before genuine trend expansion.',
          'London / New York Overlap (3:30 PM - 7:30 PM EAT): Peak volume and momentum; optimal for prop firm challenge execution.',
          'Asian Session Rollover (11:00 PM - 1:00 AM EAT): Wide spreads, low liquidity; do NOT enter new trades.'
        ],
        illustration: {
          type: 'table',
          title: 'Global Sessions Timetable in East Africa Time (EAT)',
          caption: 'Nairobi Trading Hours Blueprint',
          content: `Session           │ Nairobi Time (EAT) │ Key Characteristic
──────────────────┼────────────────────┼─────────────────────────────────────
Tokyo (Asian)     │ 03:00 - 10:00 EAT  │ Range-bound, liquidity accumulation
Pre-London        │ 10:00 - 11:00 EAT  │ Fakeouts and spread widening
London Open       │ 11:00 - 14:00 EAT  │ Volatile expansion, Judastwig sweeps
London/NY Overlap │ 15:30 - 19:30 EAT  │ PEAK VOLUME (60%+ of daily moves)
NY Afternoon      │ 20:00 - 23:00 EAT  │ Profit taking, momentum exhaustion
Rollover / Dead   │ 23:00 - 01:00 EAT  │ Wide spreads! AVOID TRADING!`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'Asian session range formed between 1.2720 and 1.2750 from 4:00 AM to 10:30 AM EAT.',
          setup: 'At 11:15 AM EAT (London Open), price spiked to 1.2758 to sweep Asian high liquidity, then reversed sharply.',
          outcome: 'Discipline traders sold the fakeout at 1.2750, catching an 80-pip slide into the New York session.',
          keyTakeaway: 'Trade during the London and New York sessions. Do not waste energy monitoring quiet midnight markets.'
        },
        actionableChecklist: [
          'Set an alarm for 10:45 AM EAT to prepare your charts for the 11:00 AM London Open.',
          'Mark the Asian High and Asian Low before 10:30 AM EAT every day.',
          'Close all day trading positions before 10:30 PM EAT to avoid overnight rollover swap fees and spread widening.'
        ]
      }
    ]
  },

  // ==========================================
  // PILLAR 2: /chart-mastery — Chart Mastery Lab Masterclass
  // ==========================================
  {
    id: '/chart-mastery',
    route: '/chart-mastery',
    number: '02',
    title: 'Chart Mastery Lab Masterclass',
    subtitle: 'Institutional Drawing, Charting & Platform School',
    oneLineHook: 'Master every essential drawing tool in TradingView and MT4/MT5 with step-by-step application guides.',
    badge: 'Lab Workshop',
    category: 'Technical',
    overview: 'A deep-dive technical laboratory divided into two master curriculums: The TradingView School and the MT4/MT5 School. Every drawing tool and interface panel is broken down into its visual icon, operational mechanics, institutional use cases, step-by-step instructions, and real chart illustrations.',
    learningOutcomes: [
      'Master all 10 core TradingView tools: Trendline, Horizontal Ray, Rectangle, Fibonacci, Long/Short tool',
      'Understand the MT4/MT5 interface: Crosshair pips measurement, order windows, and terminal navigator',
      'Construct institutional Order Blocks and Fair Value Gaps using the Rectangle tool',
      'Calculate precise Fibonacci Retracement Golden Pockets (61.8% - 78.6%)',
      'Eliminate visual clutter to identify pristine market structure and clean liquidity pools'
    ],
    lessons: [
      {
        id: 'cm-01',
        number: '01',
        title: 'TradingView: The Trendline Tool & Angle Rules',
        levelTag: 'Beginner',
        duration: '16 mins',
        summary: 'How to properly draw trendlines across valid structural swing wicks without forcing subjective angles.',
        concept: 'A trendline is a dynamic boundary representing the rate of ascent or descent of price auction. Most retail traders draw trendlines incorrectly by cutting through candle bodies or connecting arbitrary minor wicks. An institutional trendline requires a minimum of 2 confirmed swing touches, with the 3rd touch serving as an entry trigger or liquidity sweep candidate.',
        bulletPoints: [
          'The 2-Point Validation: A trendline is merely tentative until a 2nd Higher Low (or Lower High) confirms the slope.',
          'Body vs Wick Rule: Always anchor trendlines to extreme candle wicks or extreme candle closes consistently—never mix both.',
          'Angle of Ascent: Sustainable trends hold a 30° to 45° angle. Angles over 60° represent unsustainable parabolic climaxes.',
          'Trendline Liquidity: Remember that retail stop losses accumulate directly underneath obvious trendlines.'
        ],
        illustration: {
          type: 'chart',
          title: 'Valid 3-Touch Trendline Architecture',
          caption: 'How to Anchor Structural Trendlines',
          content: `                  Touch 3 (Execution Zone)
                         /\
                        /  \
            Touch 2    /    \
               /\     /
              /  \   /
  Touch 1    /    \_/  <─── Third touch validation!
    /\      /
   /  \    /
  /    \__/
 /
/─── Anchor Point (Swing Low)`
        },
        realWorldExample: {
          pair: 'EUR/USD H1',
          context: 'EUR/USD respected an upward trendline anchored at 1.0720 and 1.0780.',
          setup: 'Price approached the trendline for a 3rd touch at 1.0830 while 20 EMA aligned simultaneously.',
          outcome: 'Price rejected the trendline cleanly, producing a +45 pip bullish expansion.',
          keyTakeaway: 'A trendline is strongest on its 3rd touch. By the 4th and 5th touch, liquidity is ripe for an engineered break.'
        },
        actionableChecklist: [
          'Enable "Extend Right" in the Trendline settings to project future confluence levels.',
          'Hold the Shift key while drawing to snap horizontal angles (0°, 45°, 90°).',
          'Delete trendlines that have been cleanly violated by 2 consecutive H1 candle closes.'
        ]
      },
      {
        id: 'cm-02',
        number: '02',
        title: 'TradingView: Horizontal Lines & Break-and-Retest Rays',
        levelTag: 'Beginner',
        duration: '18 mins',
        summary: 'Map institutional support, resistance, and liquidity levels using Horizontal Lines (Alt + H) and Horizontal Rays (Alt + J).',
        concept: 'Unlike diagonal trendlines, horizontal support and resistance lines represent exact historical price levels where major institutional orders were executed. Horizontal Rays extend infinitely to the right from the exact moment of a swing high or low, keeping your historical charts uncluttered.',
        bulletPoints: [
          'Horizontal Line (Alt + H): Spans across the entire chart past and future; best for Daily and Weekly macro key levels.',
          'Horizontal Ray (Alt + J): Starts at a specific candle wick and projects forward; best for session highs and lows.',
          'Role Reversal (S/R Flip): When broken resistance becomes newly defended support (and vice versa).',
          'Liquidity Sweeps: Horizontal levels are where retail traders place breakout orders and stop losses.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Clean Support & Resistance Flip',
          caption: 'Resistance Becomes Support Confirmation',
          content: `Previous High ─────────► [ RESISTANCE LEVEL: 1.2800 ] ────────┐
                                                                      │
     Rally -> Hits 1.2800 -> Rejects -> Consolidates                 │
                                                                      ▼
     Breakout: Strong Bullish Candle Closes ABOVE 1.2800 ─────────────┘
                                                                      │
     Retest: Price Pulls Back into 1.2800 (NOW ACTS AS SUPPORT) ◄─────┘
                                                                      │
     Confirmation: Bullish Pinbar Rejection -> EXPANSION TO 1.2880`
        },
        realWorldExample: {
          pair: 'GBP/USD H4',
          context: 'GBP/USD was capped under 1.2700 resistance for two consecutive weeks.',
          setup: 'A high-volume H4 candle broke out and closed at 1.2735, followed by a slow 3-candle pullback to 1.2702.',
          outcome: 'The previous resistance flipped into rock-solid support, rallying 120 pips.',
          keyTakeaway: 'Wait for the retest and rejection. Never chase the initial breakout candle.'
        },
        actionableChecklist: [
          'Use Alt + J to place Horizontal Rays at yesterday’s high and yesterday’s low.',
          'Color code your levels: Red for Daily/Weekly Resistance, Green for Daily/Weekly Support.',
          'Only mark levels that have caused significant multi-candle market displacement.'
        ]
      },
      {
        id: 'cm-03',
        number: '03',
        title: 'TradingView: The Rectangle Tool & Order Block Zones',
        levelTag: 'Intermediate',
        duration: '22 mins',
        summary: 'Draw institutional supply, demand, Order Blocks, and Fair Value Gaps (FVGs) using the Rectangle Tool.',
        concept: 'Institutional traders do not trade at single pinpoint prices; they accumulate positions across price zones. The TradingView Rectangle tool is the premier instrument for mapping supply/demand zones, consolidation ranges, and imbalance zones (Fair Value Gaps). An Order Block is the last opposite-colored candle before a sharp displacement move that breaks market structure.',
        bulletPoints: [
          'Bullish Order Block: The last down candle (bearish) before an impulsive rally that creates a Break of Structure.',
          'Bearish Order Block: The last up candle (bullish) before an impulsive drop that breaks a structural low.',
          'Fair Value Gap (FVG): A 3-candle pattern where Candle 1’s wick and Candle 3’s wick do not overlap, leaving an imbalance.',
          'Zone Refinement: Draw zones from the candle body to wick, or refine to the 50% midpoint (Mean Threshold).'
        ],
        illustration: {
          type: 'chart',
          title: 'Fair Value Gap (FVG) Anatomy',
          caption: '3-Candle Imbalance Structure',
          content: `   [ Candle 1 ]           [ Candle 2 ]            [ Candle 3 ]
       High                  Large Impulsive         Low
        │                    Bullish Candle           │
       ┌┴┐                        ┌─┐                ┌┴┐
       │ │                        │ │                │ │
       │ │                        │ │                │ │
       └┬┘                        │ │                └┬┘
        │                         │ │                 │
        ▲                         │ │                 ▲
   Candle 1 Wick Top ─────────────┼─┼─────────────────┘
         ▲                        │ │
         │   [ FAIR VALUE GAP ]   │ │  <─── Imbalance area price MUST
         │   [  BUY IMBALANCE ]   │ │       revisit to fill liquidity!
         ▼                        │ │
   Candle 3 Wick Bottom ──────────┴─┴`
        },
        realWorldExample: {
          pair: 'EUR/USD M15',
          context: 'An aggressive 30-pip impulse candle at London Open left an M15 Fair Value Gap between 1.0840 and 1.0852.',
          setup: 'Price retraced slowly over the next 45 minutes into the Rectangle zone, touching 1.0845.',
          outcome: 'Instant algorithmic rejection from the FVG, accelerating +38 pips to the upside.',
          keyTakeaway: 'The Rectangle tool helps you patiently wait for price to return to institutional wholesale pricing.'
        },
        actionableChecklist: [
          'Set your Rectangle opacity to 15-20% so candlesticks remain clearly visible beneath the zone.',
          'Enable "Extend Right" in the Rectangle settings so the zone projects into future price action.',
          'Label your rectangles directly in the tool settings: "H1 Bullish OB" or "M15 Bearish FVG".'
        ]
      },
      {
        id: 'cm-04',
        number: '04',
        title: 'TradingView: Fibonacci Retracement & The Golden Pocket',
        levelTag: 'Intermediate',
        duration: '20 mins',
        summary: 'Configure the Fibonacci tool to isolate the 61.8% - 78.6% Golden Pocket equilibrium discount zone.',
        concept: 'The Fibonacci Retracement tool measures market retracements after an impulsive expansion. Institutional algorithms frequently look to enter trends when price pulls back to the "Golden Pocket" between the 61.8% and 78.6% retracement levels. The 50% level represents Equilibrium (fair value); anything below 50% in an uptrend is considered a Discount, while anything above 50% in a downtrend is Premium.',
        bulletPoints: [
          'Tool Anchor: In an uptrend, drag from the extreme Swing Low to the extreme Swing High.',
          'Tool Anchor: In a downtrend, drag from the extreme Swing High to the extreme Swing Low.',
          'Essential Fib Ratios: 0.50 (Equilibrium), 0.618 (Golden Ratio), 0.786 (Deep Retracement).',
          'Remove Visual Noise: Disable background colors, 0.236, 0.382, and 0.886 levels in the tool settings.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Fibonacci Golden Pocket Architecture',
          caption: 'Discount vs Premium Valuation',
          content: `   1.000 ─────── Swing High Peak (1.0900)
     │
     │   PREMIUM ZONE (Expensive - Look to Sell, NOT Buy)
     │
   0.500 ─────── Equilibrium / Fair Value (1.0850)
     │
     │   DISCOUNT ZONE (Cheap - High Probability Buy Area)
     │
   0.618 ─────── Golden Ratio (1.0838) ──┐
     │                                    ├─► [ GOLDEN POCKET ENTRY ZONE ]
   0.786 ─────── Deep Discount (1.0821) ──┘
     │
   0.000 ─────── Swing Low Origin (1.0800)`
        },
        realWorldExample: {
          pair: 'XAU/USD (Gold) H1',
          context: 'Gold impulsed from $2,320 to $2,360 (+400 pips).',
          setup: 'Retraced into the 61.8% - 78.6% pocket at $2,335 - $2,328, confluencing with an H1 Order Block.',
          outcome: 'Gold bounced aggressively from $2,332, delivering an explosive +$45/oz rally.',
          keyTakeaway: 'Fibonacci is not magic; it marks where algorithms calculate maximum mathematical reward-to-risk.'
        },
        actionableChecklist: [
          'Clean your Fib settings: Keep only 0, 0.5, 0.618, 0.786, and 1.0.',
          'Always look for an Order Block, FVG, or 20/50 EMA that sits directly inside the 61.8% - 78.6% pocket.',
          'Never enter solely because price touched a Fib level; demand candlestick confirmation first.'
        ]
      },
      {
        id: 'cm-05',
        number: '05',
        title: 'TradingView: Long & Short Position Risk/Reward Visualizer',
        levelTag: 'Beginner',
        duration: '15 mins',
        summary: 'Calculate exact reward-to-risk ratios, pip stops, and profit targets before entering any trade.',
        concept: 'The Long Position and Short Position tools are arguably the most important tools on TradingView. They place a dual-colored visual overlay on your chart displaying entry price, stop loss in pips, take profit in pips, and the exact Risk-to-Reward Ratio (RRR). By utilizing this tool, you ensure you never take trades offering less than a 1:2 or 1:3 reward-to-risk ratio.',
        bulletPoints: [
          'Target Level (Green Zone): Drag to your structural Take Profit target (previous swing high or liquidity pool).',
          'Stop Level (Red Zone): Drag behind market invalidation (beyond structural swing point or order block).',
          'Minimum RRR Rule: Never execute a trade with an RRR below 2.0 (1:2).',
          'Account Size Sizing: Double click the tool to input your account size and risk % to automatically view suggested lots.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Long Position Tool Visualizer',
          caption: '1:3 Risk to Reward Ratio Setup',
          content: `   Take Profit Target: 1.0920 (+60 Pips)
   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │  TARGET PROFIT ZONE (GREEN)                      │
   │  Reward: +$6.00 (3R on $2 Risk)                  │
   │                                                  │
   └──────────────────────────────────────────────────┘
   ◄─── ENTRY LEVEL: 1.0860 (Risk/Reward = 3.00)
   ┌──────────────────────────────────────────────────┐
   │  STOP LOSS ZONE (RED)                            │
   │  Risk: -$2.00 (1R)                               │
   └──────────────────────────────────────────────────┘
   Stop Loss Invalidation: 1.0840 (-20 Pips)`
        },
        realWorldExample: {
          pair: 'GBP/JPY M15',
          context: 'Trader identified a potential long with a 35-pip stop loss and a 40-pip target (1:1.14 RRR).',
          setup: 'Applied the Long Position tool and saw the low RRR ratio.',
          outcome: 'Passed on the low-reward trade; 2 hours later, spotted a 1:3.5 RRR setup on GBP/USD instead.',
          keyTakeaway: 'The position tool protects you from taking mediocre trades with skewed, unprofitable risk profiles.'
        },
        actionableChecklist: [
          'Star the Long Position and Short Position tools to your favorites bar.',
          'Always snap your Stop Loss to logical invalidation wicks, never arbitrary round numbers.',
          'Verify the "Risk/Reward Ratio" field displays 2.00 or higher before opening MT4/MT5.'
        ]
      },
      {
        id: 'cm-06',
        number: '06',
        title: 'TradingView: Measure Tool, Price Ranges & Volatility Reading',
        levelTag: 'Beginner',
        duration: '14 mins',
        summary: 'Use the Shift + Click ruler shortcut to calculate pip distance, elapsed candle bars, and percentage volatility instantly.',
        concept: 'Fast execution requires instant measurement. By holding the Shift key and clicking anywhere on a TradingView chart, you summon the Measure Ruler. This tool instantly reports the exact number of pips, points, bars, and time duration covered between two points. This prevents manual subtraction errors when calculating stop loss distances.',
        bulletPoints: [
          'Shift + Click Shortcut: Drag between two points to measure distance in pips and time duration.',
          'Price Range Tool: Creates a permanent box indicating exact pips and percentage change.',
          'Average True Range (ATR): Combine ruler measurements with 14-period ATR to determine if market volatility is normal or extreme.',
          'Bar Count: Understand how many bars a consolidation lasts before a breakout.'
        ],
        illustration: {
          type: 'steplist',
          title: 'Instant Pip Measurement Workflow',
          caption: 'Zero-Math Stop Loss Sizing',
          content: `Step 1: Locate your entry candle and desired Stop Loss swing wick
Step 2: Hold SHIFT and Click your planned entry price
Step 3: Move cursor to the Stop Loss level -> Tool displays: "-24.6 pips (246 points)"
Step 4: Now you know your SL is exactly 25 pips -> Input 25 pips into Lot Size Calculator`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'News announcement approaching; trader needs to know the average 15-minute candle range.',
          setup: 'Shift-dragged across previous 10 candles: average range was 8 pips.',
          outcome: 'News candle expanded to 45 pips (5x normal); trader correctly widened stop or waited for volatility to settle.',
          keyTakeaway: 'Always measure the average pip distance of your timeframe before defining stop loss distances.'
        },
        actionableChecklist: [
          'Practice using Shift + Click to measure 10 swing ranges in under 30 seconds.',
          'Ensure you read the second number in the ruler: pips (e.g., 18.4) not fractional points (184).',
          'Use the Date & Price Range tool when logging trade setups in your screenshot journal.'
        ]
      },
      {
        id: 'cm-07',
        number: '07',
        title: 'TradingView: Magnet Mode & Snapping Precision',
        levelTag: 'Intermediate',
        duration: '12 mins',
        summary: 'Activate Weak Magnet vs Strong Magnet to lock drawing anchors to exact high/low ticks without human estimation.',
        concept: 'Human eyesight is imprecise when zooming across multi-timeframe charts. If your trendline or Fibonacci retracement misses the exact high of a wick by 3 pips, your projected entry or target will be inaccurate. TradingView Magnet Mode automatically pulls your cursor and snaps drawing points directly to the open, high, low, or close of the nearest candlestick.',
        bulletPoints: [
          'Weak Magnet: Snaps to the nearest candle point only when your cursor is within a few pixels (recommended for flexibility).',
          'Strong Magnet: Aggressively snaps to candle points regardless of cursor distance (best for Fibonacci anchors).',
          'Temporary Magnet: Hold the Ctrl key (Windows) or Cmd key (Mac) while drawing to toggle magnet mode temporarily.',
          'Wick Precision: Crucial when marking tower tops, liquidity sweeps, and session highs.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Magnet Mode Precision Anchor',
          caption: 'Manual Estimation vs Magnet Snapping',
          content: `Manual Drawing (No Magnet):
   Cursor placed at: 1.08518  (Actual Wick High was 1.08532)
   Error: 1.4 Pips Discrepancy! Limit order may not trigger!
   
With Magnet Mode Enabled (Ctrl/Cmd Key):
   Cursor automatically SNAPS to exact OHLC tick:
   High: 1.08532  │  Low: 1.08410  │  Close: 1.08490
   Zero Discrepancy! Precision order placement guaranteed!`
        },
        realWorldExample: {
          pair: 'USD/JPY H1',
          context: 'Trader set a Buy Limit based on a manually drawn support line at 155.10.',
          setup: 'Actual structural wick low was 155.14. Price bounced from 155.14 and rallied 90 pips.',
          outcome: 'Trader missed the entire trade by 0.4 pips because they did not use Magnet snapping.',
          keyTakeaway: 'Always use Magnet mode when setting limit orders and Fibonacci retracement anchors.'
        },
        actionableChecklist: [
          'Turn on the Magnet icon on the left toolbar (select Weak Magnet).',
          'Use Ctrl/Cmd key shortcut to snap anchors to exact wick highs/lows.',
          'Verify Fib 0.0 and 1.0 coordinate prices match the candle High/Low in the status bar.'
        ]
      },
      {
        id: 'cm-08',
        number: '08',
        title: 'MT4/MT5: Crosshair Tool & Order Types Terminal School',
        levelTag: 'Beginner',
        duration: '18 mins',
        summary: 'Master the MT4/MT5 execution terminal: Crosshair (Middle Click), terminal tabs, Navigator, and one-click execution.',
        concept: 'MetaTrader remains the primary tool for funded account management. The Crosshair tool (Ctrl + F or Middle Mouse Click) is the engine of MT4/MT5: clicking and dragging between two points displays a 3-part code: [Number of Bars] / [Distance in Points] / [Current Price]. Understanding how to read points (10 points = 1 pip) is essential for entering trades in the F9 order window.',
        bulletPoints: [
          'Crosshair Shortcut (Ctrl + F or Scroll Wheel Click): Displays bar count, point distance, and price level.',
          'Reading Points vs Pips: A distance of "245" in MT4 equals 24.5 pips.',
          'One-Click Trading (Alt + T): Opens the quick buy/sell panel in the top-left chart corner.',
          'Terminal Window (Ctrl + T): Displays Balance, Equity, Margin, Free Margin, and open floating PnL.'
        ],
        illustration: {
          type: 'formula',
          title: 'Reading the MT4 Crosshair Display',
          caption: 'Deconstructing the 3-Number Output',
          content: `When you drag the Crosshair between two points, MT4 displays:
   
           [ 12 / 340 / 1.08840 ]
             │     │       │
             │     │       └── Current price coordinate at crosshair
             │     │
             │     └── Distance in POINTS: 340 points = 34.0 Pips
             │
             └── Number of Candlestick Bars between the two points`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader on MT5 wanted a 20-pip stop loss. Looked at crosshair output "200".',
          setup: 'Understood that 200 points = 20 pips. Entered 200 points into their EA stop loss parameter.',
          outcome: 'Trade protected with exact 20-pip stop loss without miscalculation.',
          keyTakeaway: 'Always remember: In MT4/MT5 5-digit brokers, 10 points = 1 pip.'
        },
        actionableChecklist: [
          'Press Middle Mouse Click to toggle the Crosshair tool instantly.',
          'Double check that you convert points to pips by dropping the last digit (e.g. 150 points = 15 pips).',
          'Press Ctrl + T to inspect your open positions and trailing stops.'
        ]
      },
      {
        id: 'cm-09',
        number: '09',
        title: 'Multi-Timeframe Fractal Alignment: Daily to M5',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'The Top-Down Analysis Protocol: How institutional traders align Daily narrative with H4 direction and M15/M5 execution.',
        concept: 'Financial markets are fractal—the same patterns occur on 1-minute charts as on monthly charts. However, higher timeframes always overpower lower timeframes. Professional trading requires a disciplined 3-tier top-down analysis: 1) Daily/H4 determines Market Narrative and Key Liquidity Pools; 2) H1 determines Structural Direction and Trend Confluence; 3) M15/M5 isolates the Precision Entry Trigger.',
        bulletPoints: [
          'Tier 1 (Daily / H4): Macro Direction & Major S/R. Are we in a Premium or Discount zone?',
          'Tier 2 (H1): Market Structure & Trend Confirmation. Is price making BOS or CHOCH?',
          'Tier 3 (M15 / M5): Execution Trigger. Wait for a pinbar, engulfing candle, or FVG tap.',
          'The Golden Rule: Never buy on M5 if H4 is actively slamming into a major Daily resistance block.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The Top-Down Multi-Timeframe Funnel',
          caption: 'From Macro Narrative to Sniper Execution',
          content: `[ DAILY CHART ] ──► Establishes the Macro Trend & Major Liquidity Target
       │             (e.g., Daily is Bullish; target is 1.0950 High)
       ▼
[ H4 / H1 CHART ] ──► Identifies the Key Pullback Zone & Structure
       │              (e.g., H1 pulled back into a 61.8% Discount FVG at 1.0840)
       ▼
[ M15 / M5 CHART ] ──► Snipers the Entry Candle with Minimal Stop Loss
                      (e.g., M5 Bullish Engulfing Candle confirms entry at 1.0842;
                       Stop Loss is only 12 pips instead of 50 pips on H4!)`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'Trader saw a tempting M5 buy setup. Checked H4 chart first: H4 had just printed a massive Bearish Pinbar at Daily Resistance.',
          setup: 'Trader refrained from buying. 15 minutes later, M5 broke down 60 pips.',
          outcome: 'Saved account from a losing trade by respecting the Higher Timeframe narrative.',
          keyTakeaway: 'The lower timeframe is merely the vehicle; the higher timeframe is the road.'
        },
        actionableChecklist: [
          'Conduct your top-down analysis in strict order: Daily -> H4 -> H1 -> M15.',
          'Never execute a trade on M5 without checking the H4 trend first.',
          'Split your screen on TradingView to show H4 and M15 side by side.'
        ]
      },
      {
        id: 'cm-10',
        number: '10',
        title: 'Indicator Studio: 20/50 EMA Dynamic Support & RSI 14',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'Configure the institutional indicator stack: 20 Exponential Moving Average, 50 EMA, and 14-period RSI divergence.',
        concept: 'Indicators should never be used as standalone buy/sell generators; they must act as dynamic filters that confirm underlying price action. The 20 EMA represents short-term momentum; the 50 EMA represents medium-term trend direction. When the 20 EMA is above the 50 EMA and both slope upward, the market is in a confirmed bullish regime. The Relative Strength Index (RSI 14) measures momentum velocity; divergences between price highs and RSI highs reveal impending exhaustion.',
        bulletPoints: [
          '20 EMA (Exponential): Gives higher weight to recent prices; acts as dynamic support in aggressive trending markets.',
          '50 EMA: Represents the institutional baseline; a pullback into the 50 EMA offers high-probability trend continuation.',
          'EMA Crossover vs Separation: When 20 crosses 50, trend changes; when 20 separates widely from price, market is overextended.',
          'RSI 14 Divergence: When price prints a Higher High but RSI prints a Lower High (Bearish Divergence).'
        ],
        illustration: {
          type: 'chart',
          title: 'EMA Trend Confluence & RSI Divergence',
          caption: 'Spotting Exhaustion at Trend Peaks',
          content: `Price Action:
                   Peak 1            Peak 2 (Higher High)
                     /\                /\
                    /  \              /  \
                   /    \            /    \
   20 EMA ────────/──────\──────────/──────\───────► [ DYNAMIC SUPPORT ]
   50 EMA ────────────────\────────────────\───────► [ BASELINE TREND ]
  ────────────────────────────────────────────────────────────────
  RSI (14) Indicator:
                   Peak 1
                     /\
                    /  \             Peak 2 (LOWER HIGH = DIVERGENCE!)
                   /    \              /\
   70 Overbought ─/──────\────────────/──\─────────
                 /        \__________/    \________► Momentum Exhausted!`
        },
        realWorldExample: {
          pair: 'EUR/USD M15',
          context: 'EUR/USD was climbing steadily above both 20 and 50 EMAs.',
          setup: 'Price made a new high at 1.0890, but RSI printed 58 (down from 72 on previous high).',
          outcome: 'Bearish divergence triggered; price broke below 20 EMA and plummeted 45 pips to 50 EMA baseline.',
          keyTakeaway: 'Divergence warns you when a trend is running out of gas. Never buy into bearish RSI divergence.'
        },
        actionableChecklist: [
          'Add 20 EMA (Cyan) and 50 EMA (Gold/Orange) to your chart template.',
          'Add RSI 14 with 70 overbought and 30 oversold horizontal levels.',
          'Look for trades where price pulls back into the gap between the 20 and 50 EMA.'
        ]
      }
    ]
  },

  // ==========================================
  // PILLAR 3: /strategy-vault — Strategy Vault Masterclass
  // ==========================================
  {
    id: '/strategy-vault',
    route: '/strategy-vault',
    number: '03',
    title: 'Strategy Vault Masterclass',
    subtitle: '15 Core Institutional Setups, ICT Masterclasses & Execution Playbooks',
    oneLineHook: 'Master 15 high-win-rate setups including ICT Order Blocks, FVGs, Liquidity Pools, and OTE Killzones.',
    badge: 'Edge Playbook',
    category: 'Strategy',
    overview: 'The institutional strategy vault contains 15 flagship quantitative, ICT (Inner Circle Trader), and price-action setups tested over thousands of trading hours. Master Order Blocks, Fair Value Gaps, Liquidity Pools (BSL/SSL), Market Structure Shifts, and OTE Fibonacci Killzone execution.',
    learningOutcomes: [
      'Master Flagship 1: Tower Top / Tower Bottom Liquidity Sweep Reversal',
      'Master Flagship 2: 20/50 EMA Confluence Bounce & Trend Continuation',
      'Master Flagship 3: RSI 70/30 Momentum Divergence & Volume Exhaustion',
      'Master Flagship 4: London Open Breakout (11:00 AM EAT Volatility Drive)',
      'Master Flagship 5: Asian Range Liquidity Sweep & New York Reversal',
      'Master ICT Concept 1: Order Blocks & 50% Mean Threshold Mitigation',
      'Master ICT Concept 2: Fair Value Gaps (FVG) & Consequent Encroachment',
      'Master ICT Concept 3: Buy-Side (BSL) & Sell-Side Liquidity (SSL) Pools',
      'Master ICT Concept 4: Market Structure Shift (MSS) with Displacement vs CHoCH',
      'Master ICT Concept 5: Optimal Trade Entry (OTE 62%-79%) & London/NY Killzones',
      'Execute multi-target partial scale-outs with guaranteed risk-free breakeven rules'
    ],
    lessons: [
      {
        id: 'sv-01',
        number: '01',
        title: 'Flagship 1: The Tower Top Liquidity Sweep Reversal',
        levelTag: 'Advanced',
        duration: '24 mins',
        summary: 'The Gilgil founding setup: Identifying exhausted parabolic green candles that sweep liquidity before an aggressive reversal.',
        concept: 'The Tower Top is an institutional distribution pattern. It forms when retail FOMO buyers chase 3 to 5 consecutive large green candles extended far above the 20 EMA, pushing RSI above 75-80. Institutions use this retail buying liquidity to unload long positions and initiate heavy short orders. The pattern is confirmed when an aggressive red candle closes below the open of the second-to-last green candle, creating a "tower" formation.',
        bulletPoints: [
          'Pre-Condition: 3+ strong green candles extended at least 25 pips above the 20 EMA on M15 or H1.',
          'RSI Confirmation: RSI 14 must be above 70 (ideally showing bearish divergence against previous high).',
          'Trigger Candle: A strong bearish engulfing candle closing below the midpoint of the prior green candle.',
          'Stop Loss: Placed 3 to 5 pips above the highest wick of the tower formation.',
          'Take Profit: Target 1 at 20 EMA; Target 2 at 50 EMA or previous swing low (minimum 1:2.5 RRR).'
        ],
        illustration: {
          type: 'chart',
          title: 'Tower Top Reversal Anatomy',
          caption: 'Parabolic Expansion vs Exhaustion Drop',
          content: `                     [ TOWER PEAK: 1.29656 ]
                           ▲   ▲
                      ┌─┐ ┌─┐ ┌─┐ ┌─┐ <─── High Wick Sweeps Liquidity!
                      │ │ │ │ │ │ │█│
                      │ │ │ │ │ │ │█│ <─── Bearish Engulfing Candle
                      │ │ │ │ │ │ │█│      Closes BELOW green body!
                      │ │ │ │ │ │ │█│
                      └─┘ └─┘ └─┘ └█┘ ◄─── SELL ENTRY: 1.29169
                                   │
      Retail FOMO Buyers Chasing   ▼
      Parabolic Candles Extended   │  [ SHARP CASCADE DOWN ]
      Far Above 20 EMA!            │  Price crashes to 20 EMA & 50 EMA!
                                   ▼
                               [ TAKE PROFIT: 1.28500 (+66 Pips) ]`
        },
        realWorldExample: {
          pair: 'GBP/USD M15',
          context: 'Price spiked aggressively to 1.29656 with RSI at 83.2 during pre-London session.',
          setup: 'Tower top formed; giant red candle engulfed previous 2 candles, closing at 1.29169.',
          outcome: 'Sold at 1.29169 with SL at 1.29700. Price collapsed to 1.28500 delivering +66 pips (1:3.2 RRR).',
          keyTakeaway: 'When price looks too good to be true and everyone is shouting "buy", institutions are preparing the tower trap.'
        },
        actionableChecklist: [
          'Check price distance from 20 EMA; if distance is > 20 pips on M15, do NOT buy.',
          'Verify RSI is overbought (>70).',
          'Wait for the bearish candle to completely CLOSE before entering the sell order.'
        ]
      },
      {
        id: 'sv-02',
        number: '02',
        title: 'Flagship 2: The 20/50 EMA Confluence Bounce',
        levelTag: 'Intermediate',
        duration: '20 mins',
        summary: 'The premier trend-continuation setup: entering pullbacks into the dynamic golden zone between the 20 and 50 EMA.',
        concept: 'In a healthy, sustainable trend, price does not move in a straight line; it breathes. As institutional algorithms trend-follow, they wait for shallow pullbacks into dynamic value areas rather than chasing highs. The "Value Zone" is the space between the 20 EMA (momentum) and 50 EMA (baseline). When price pulls back into this zone and prints a rejection wick (pinbar), it offers an exceptional risk-to-reward continuation entry.',
        bulletPoints: [
          'Trend Filter: 20 EMA must be cleanly above 50 EMA (for longs) or below 50 EMA (for shorts) with both lines sloping at 30°+.',
          'The Pullback: Price retraces back into the pocket between 20 and 50 EMA.',
          'Rejection Trigger: A hammer / pinbar candle touches the 50 EMA and closes back above the 20 EMA.',
          'Stop Loss: 3 pips below the 50 EMA or rejection wick low.',
          'Take Profit: Previous swing high (Target 1) and 1.618 Fibonacci extension (Target 2).'
        ],
        illustration: {
          type: 'diagram',
          title: '20/50 EMA Pullback Value Pocket',
          caption: 'High-Probability Trend Continuation',
          content: `                        Swing High
                            /\
                           /  \
     Impulse Wave         /    \   Pullback into Value Pocket
        /\               /      \         ┌──► [ REJECTION PINBAR ]
       /  \             /        \       ┌┴┐
      /    \           /          ▼      │ │  <── Wicks into 50 EMA
     /      \         /            \     └┬┘      Closes above 20 EMA!
    /        \_______/              \_____│
   /                                      ▲
──/───────────────────────────────────────┼────────► 20 EMA (Momentum)
──────────────────────────────────────────┴────────► 50 EMA (Support Floor)
                                          │
                                          └──► BUY ENTRY! Target New High!`
        },
        realWorldExample: {
          pair: 'EUR/USD H1',
          context: 'EUR/USD in confirmed H1 uptrend; 20 EMA at 1.0820, 50 EMA at 1.0795.',
          setup: 'Price pulled back to 1.0805, printed an H1 bullish pinbar rejecting the 50 EMA.',
          outcome: 'Entered at 1.0815, Stop Loss at 1.0790 (25 pips). Price surged to 1.0890 (+75 pips, 1:3 RRR).',
          keyTakeaway: 'Never chase an extended trend. Let the market come back to the 20/50 EMA pocket.'
        },
        actionableChecklist: [
          'Verify that 20 EMA and 50 EMA are NOT tangled or flat; they must be clearly fanned out.',
          'Ensure the pullback happens on lower volume / smaller candle bodies.',
          'Set Stop Loss strictly below the 50 EMA.'
        ]
      },
      {
        id: 'sv-03',
        number: '03',
        title: 'Flagship 3: RSI 70/30 Momentum Divergence & Exhaustion',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'Detect hidden weakness in trends by catching regular and hidden divergences between price swings and RSI 14 velocity.',
        concept: 'Price reflects transaction agreements; momentum indicators reflect the aggressive energy behind those transactions. When price pushes to a Higher High but RSI fails to reach a Higher High, it signals that fewer market participants are willing to buy at higher prices. This structural divergence frequently precedes sudden, high-velocity trend reversals.',
        bulletPoints: [
          'Regular Bearish Divergence: Price Higher High + RSI Lower High -> Impending Bearish Reversal.',
          'Regular Bullish Divergence: Price Lower Low + RSI Higher Low -> Impending Bullish Reversal.',
          'Hidden Divergence: Price Higher Low + RSI Lower Low -> Powerful Trend Continuation.',
          'Entry Filter: Do not enter on divergence alone; wait for price to break the nearest M15 minor swing low (CHOCH).'
        ],
        illustration: {
          type: 'chart',
          title: 'Regular Bearish Divergence Blueprint',
          caption: 'Price Makes Higher High while RSI Exhausts',
          content: `Price Chart:
                   Swing High 1          Swing High 2 (HIGHER HIGH)
                        /\                    /\
                       /  \                  /  \
                      /    \                /    \
                     /      \              /      \
                    /        \____________/        \──────► REVERSAL BREAKDOWN!
  ─────────────────────────────────────────────────────────────────────────
  RSI (14) Oscillator:
                   Peak 1 (Overbought)
                        /\
                       /  \              Peak 2 (LOWER HIGH!)
                      /    \                  /\
        RSI 70 Line ─/──────\────────────────/──\─────────────────────────
                    /        \              /    \
                   /          \____________/      \───────► MOMENTUM EXHAUSTION`
        },
        realWorldExample: {
          pair: 'USD/JPY H1',
          context: 'USD/JPY made a new weekly high at 156.40, but RSI printed 61 (down from 76 on previous high).',
          setup: 'H1 candle closed below the 20 EMA with clear divergence.',
          outcome: 'Short entered at 156.10, SL at 156.55. Price tumbled 110 pips down to 155.00 support.',
          keyTakeaway: 'Divergence gives you the confidence to stand against retail crowds at the top of market cycles.'
        },
        actionableChecklist: [
          'Draw a line connecting the price peaks and a line connecting the RSI peaks to verify divergence.',
          'Check that Peak 1 of the divergence was overbought (>70) or oversold (<30).',
          'Wait for a candle close below the 20 EMA before placing your market order.'
        ]
      },
      {
        id: 'sv-04',
        number: '04',
        title: 'Flagship 4: London Open Breakout (11:00 AM EAT Expansion)',
        levelTag: 'Intermediate',
        duration: '22 mins',
        summary: 'Capture the highest volume hour of the trading day: Exploiting the Asian session range sweep at 11:00 AM Nairobi time.',
        concept: 'Between 3:00 AM and 10:00 AM East Africa Time, the Asian session trades in a relatively tight consolidation. Retail breakout orders accumulate above the Asian High (Buy Stops) and below the Asian Low (Sell Stops). At 11:00 AM EAT, institutional London desks open. They typically engineer a false move (the "Judas Swing") to sweep Asian liquidity before initiating the real trend of the day.',
        bulletPoints: [
          'The Box: Mark the exact Asian session High and Low between 03:00 and 10:30 EAT.',
          'The Sweep (11:00 - 11:30 EAT): Price spikes 5 to 15 pips outside the Asian range to grab liquidity.',
          'The Reversal: Price quickly rejects back INSIDE the Asian range with an engulfing candle.',
          'The Target: The opposite side of the Asian range and the Daily Average True Range projection.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The London Open 11:00 AM EAT Execution Sequence',
          caption: 'Nairobi Time Session Blueprint',
          content: `Phase 1 (03:00 - 10:30 EAT): ASIAN RANGE ACCUMULATION
   Asian High: 1.2840  ──────────┬─────────────────────────────
                                 │  Range: ~25 Pips
   Asian Low:  1.2815  ──────────┴─────────────────────────────

Phase 2 (11:00 - 11:20 EAT): THE JUDAS LIQUIDITY SWEEP
   Price spikes up to 1.2852 (Sweeps Buy Stops above Asian High!)

Phase 3 (11:25 EAT): REJECTION CONFIRMATION
   M15 candle closes back at 1.2835 (INSIDE Asian Range) -> ENTER SHORT!

Phase 4 (12:00 - 15:30 EAT): EXPANSION TO OPPOSITE LIQUIDITY
   Price crashes through Asian Low (1.2815) and hits 1.2750 (+85 Pips!)`
        },
        realWorldExample: {
          pair: 'GBP/USD M15',
          context: 'Asian range was 1.2700 - 1.2725 (25 pips).',
          setup: 'At 11:15 AM EAT, London open spiked to 1.2736, then printed a massive bearish pinbar closing at 1.2718.',
          outcome: 'Entered Short at 1.2718 with SL at 1.2740 (22 pips). Price plummeted to 1.2640 (+78 pips).',
          keyTakeaway: 'The first breakout move at 11:00 AM EAT is frequently a fakeout trap. Wait for the trap to spring.'
        },
        actionableChecklist: [
          'Draw the Asian Range box on M15 chart at 10:30 AM EAT every single day.',
          'Do not place breakout stop orders at 10:59 AM EAT.',
          'Wait for a candle to sweep the high/low and close back inside the box before executing.'
        ]
      },
      {
        id: 'sv-05',
        number: '05',
        title: 'Flagship 5: Asian Range Sweep & New York Session Reversal',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'Trading the second major liquidity window: Catching New York reversal drives when London session trends exhaust.',
        concept: 'At 3:30 PM EAT, New York equity markets open and US institutional banks begin deploying liquidity. If the London session produced an aggressive one-way trend that has completed its Daily Average True Range (ADR), the New York open frequently engineers a profit-taking reversal. When this occurs into an H4 or Daily key level, it provides high-probability reversal setups.',
        bulletPoints: [
          'London Trend Exhaustion: Price has moved 70+ pips during the London session without a meaningful pullback.',
          'HTF Key Level: Price reaches a Daily support or resistance level or major liquidity pool between 3:00 PM and 5:00 PM EAT.',
          'US Economic News: Correlate with 3:30 PM EAT US economic releases (Core Retail Sales, GDP, CPI).',
          'Execution: Look for M15 Change of Character (CHOCH) after 3:30 PM EAT.'
        ],
        illustration: {
          type: 'chart',
          title: 'London Expansion into New York Reversal',
          caption: 'Session Handover Liquidity Architecture',
          content: `Asian Range       London Session Expansion          New York Session Reversal
 (03:00 - 10:00)     (11:00 - 15:00 EAT)              (15:30 - 19:30 EAT)
                    ┌────────────────────────────┐
                    │ Heavy One-Way Trend Drive  │
                    │ Moving 80 Pips Higher      │
                    │ Exhausts Daily ADR         │
                    └────────────────────────────┘
                               ▲
                              / 
                             /                    Hits Daily Major Resistance!
                            /                     ┌──► [ M15 CHOCH REVERSAL ]
                           /                      ▼
    ┌──────────┐          /                        \
    │ Tight    │         /                          \  New York Institutional
    │ Sideways │        /                            \ Reversal Sells Off
    │ Range    │_______/                              ▼ 50-70% of London Move!
    └──────────┘`
        },
        realWorldExample: {
          pair: 'EUR/USD M15',
          context: 'EUR/USD pumped 90 pips in London session, reaching major Daily resistance at 1.0900 at 3:15 PM EAT.',
          setup: 'At 3:30 PM EAT, US Initial Jobless Claims released; M15 printed a bearish engulfing candle breaking structure.',
          outcome: 'Sold at 1.0885 with SL at 1.0910. Price retraced 55 pips into 1.0830.',
          keyTakeaway: 'The New York session often undoes the London move. Recognize when a trend has reached exhaustion.'
        },
        actionableChecklist: [
          'Check the Daily Average True Range (ATR); if market has already moved 100% of ATR, do NOT buy new highs.',
          'Check ForexFactory calendar for 3:30 PM EAT red folder USD news.',
          'Look for M15 structural breakdown between 3:30 PM and 5:00 PM EAT.'
        ]
      },
      {
        id: 'sv-06',
        number: '06',
        title: 'Fair Value Gap (FVG) Mitigation Fill Setup',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'How to enter high-probability trades by identifying unmitigated 3-candle imbalances and waiting for equilibrium fills.',
        concept: 'Institutional algorithmic execution creates imbalances in the order book when large market orders overwhelm opposing limit orders. This leaves a 3-candle price imbalance called a Fair Value Gap (FVG). Algorithms are programmed to return to these imbalances to "rebalance" price before continuing the dominant trend. Trading FVG mitigation provides razor-thin stop losses and exceptional risk-to-reward.',
        bulletPoints: [
          'Identifying the FVG: Candle 1’s high does not touch Candle 3’s low in a bullish move (or vice versa in bearish).',
          'Consequent Encroachment (C.E.): The 50% midpoint of the FVG zone. The highest probability reaction point.',
          'Patience Rule: Never enter while price is impulsing away; wait for the gradual, low-volume retracement into the FVG.',
          'Invalidation: If a candle closes completely through the opposite side of the FVG, the setup is invalidated.'
        ],
        illustration: {
          type: 'diagram',
          title: 'FVG Mitigation & Consequent Encroachment',
          caption: 'Precision Entry at the 50% Midpoint',
          content: `Bullish Trend:
                      Candle 2 (Displacement Candle)
                            ┌───┐
                            │   │
   Candle 3 Low: 1.0860 ────┼───┼──────┐
                            │   │      │
       [ FVG ZONE ]         │   │      ├─► Consequent Encroachment (50%): 1.0850
                            │   │      │   (PRECISE LIMIT ENTRY LEVEL!)
   Candle 1 High: 1.0840 ───┼───┼──────┘
                            │   │
                            └───┘
   Retracement: Price gently taps 1.0850 (C.E.) and rockets upward!`
        },
        realWorldExample: {
          pair: 'GBP/USD M15',
          context: 'H1 trend was bullish; M15 formed an FVG between 1.2640 and 1.2660 after UK GDP data.',
          setup: 'Price drifted down into 1.2650 (50% midpoint). Placed Buy Limit with 12-pip stop loss at 1.2638.',
          outcome: 'Price wicked 1.2649, filled the order, and surged 60 pips (1:5 RRR).',
          keyTakeaway: 'FVGs give you concrete price zones where institutions left unfinished business.'
        },
        actionableChecklist: [
          'Mark only FVGs that resulted in a clear Break of Structure (BOS).',
          'Set your entry at the 50% midpoint (Consequent Encroachment) of the gap.',
          'Place Stop Loss 2 pips beyond the origin candle wick.'
        ]
      },
      {
        id: 'sv-07',
        number: '07',
        title: 'Break of Structure (BOS) vs Change of Character (CHOCH)',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'Differentiate between trend continuation signals (BOS) and early trend reversal signals (CHOCH).',
        concept: 'Market structure clarity prevents you from mistaking a minor counter-trend pullback for a major trend reversal. A Break of Structure (BOS) occurs when price breaks a swing point in the direction of the established trend, confirming continuation. A Change of Character (CHOCH) occurs when price breaks the most recent swing point in the OPPOSITE direction of the established trend, signaling the first warning of a structural shift.',
        bulletPoints: [
          'BOS (Continuation): Uptrend breaks Higher High; Downtrend breaks Lower Low. Confirms ongoing momentum.',
          'CHOCH (Reversal): Uptrend breaks Higher Low; Downtrend breaks Lower High. Confirms trend exhaustion.',
          'Candle Body Rule: A wick break is merely a liquidity sweep; a true BOS/CHOCH requires a solid candle BODY close.',
          'Multi-Timeframe Confluence: An M15 CHOCH is most powerful when it occurs at an H4 Order Block.'
        ],
        illustration: {
          type: 'diagram',
          title: 'BOS vs CHOCH Comparison',
          caption: 'Structural Shift vs Trend Continuation',
          content: `Uptrend:
          (HH1)           (HH2)                 (HH3)
           /\              /\                    /\
          /  \            /  \                  /  \
         /    \   (HL1)  /    \   (HL2)        /    \
        /      \   /\   /      \   /\         /      \
       /        \_/  \_/        \_/  \       /        \
                    │                 │                ▼
                    └── BOS 1         └── BOS 2        Price breaks HL2!
                   (Continuation)    (Continuation)    ═════════════════
                                                       THIS IS A CHOCH!
                                                       (Trend Reversal)`
        },
        realWorldExample: {
          pair: 'AUD/USD H1',
          context: 'AUD/USD was in a steady downtrend making lower highs and lower lows.',
          setup: 'At 0.6520, price rallied aggressively and closed an H1 candle above the previous Lower High at 0.6550 (CHOCH).',
          outcome: 'Trader waited for a pullback to the new Higher Low and entered long, catching a 90-pip rally.',
          keyTakeaway: 'Always wait for the candle body to close beyond structure to confirm a genuine CHOCH.'
        },
        actionableChecklist: [
          'Never trade a CHOCH based on a wick; demand a full candle close on your operational timeframe.',
          'Label your charts explicitly with "BOS" (trend continuation) and "CHOCH" (trend reversal).',
          'Look for trades in the direction of Higher Timeframe BOS.'
        ]
      },
      {
        id: 'sv-08',
        number: '08',
        title: 'Support Turned Resistance (S/R Flip) with Volume Climax',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'How to enter high-confidence breakout retests when broken multi-day floors flip into impenetrable ceilings.',
        concept: 'When a strong support floor is broken by institutional volume, trapped buyers who held positions through the drop look to exit at breakeven when price returns to that level. Simultaneously, breakout sellers look to add to short positions. This creates an imbalance of heavy sell orders at the former support level, causing it to flip into hardened resistance.',
        bulletPoints: [
          'Floor Identification: Support must have been tested and defended at least twice previously.',
          'The Clean Break: Price must penetrate the level with a large displacement candle, not hesitant consolidation.',
          'The Low-Volume Retest: Price slowly crawls back to retest the underbelly of the broken floor.',
          'Rejection Confirmation: Look for a bearish pinbar or engulfing candle at the exact retest level.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Mechanical S/R Flip',
          caption: 'Trapped Longs Exiting at Breakeven',
          content: `Support Floor Tested 3 Times:
     Touch 1          Touch 2          Touch 3
       \/               \/               \/
   ══════════════════════════════════════════════════════ [ SUPPORT: 1.0850 ]
                                          │
                                          ▼ Aggressive Institutional Breakdown!
                                          │ (Longs are now trapped at -$30/pip!)
                                          ▼
                         Retest Rally ───►═══════════════ [ NOW RESISTANCE! ]
                                          ▲ Trapped buyers sell to get out at $0!
                                          │ New breakout sellers add shorts!
                                          ▼
                                      CASCADE DOWN TO 1.0770`
        },
        realWorldExample: {
          pair: 'EUR/USD H4',
          context: 'The 1.0900 level was rock-solid support for 10 trading sessions.',
          setup: 'US Non-Farm Payrolls broke 1.0900 down to 1.0840. Three days later, price pulled back to 1.0898.',
          outcome: 'Printed an H4 shooting star pinbar. Sold at 1.0892, dropped 140 pips over the next week.',
          keyTakeaway: 'The best trades are simple. S/R flips provide crystal clear stop loss parameters.'
        },
        actionableChecklist: [
          'Identify horizontal levels that have been tested at least twice on the H4 chart.',
          'Set alerts 5 pips before the S/R flip level to prepare your entry.',
          'Place Stop Loss 15 pips above the broken support level.'
        ]
      },
      {
        id: 'sv-09',
        number: '09',
        title: 'Precision Invalidation & Stop Loss Placement Logic',
        levelTag: 'Advanced',
        duration: '18 mins',
        summary: 'Stop placing arbitrary 20-pip stops. Place stops where your trade thesis is mathematically and structurally proven wrong.',
        concept: 'Amateur traders place stop losses based on where they feel comfortable losing money (e.g. "I always use a 15-pip stop"). Professional traders place stop losses based on structural market invalidation—the exact price level where, if reached, the trade thesis is 100% invalidated. If your trade thesis is a bounce from an Order Block, your stop loss belongs 3 pips behind that Order Block, not arbitrarily midway through it.',
        bulletPoints: [
          'Structural Invalidation: The point where market structure violates your thesis (e.g., higher low broken).',
          'Liquidity Buffer: Always add 3 to 5 pips of buffer beyond wicks to account for broker spread widening.',
          'Never Move Stop Loss Further Away: Moving a stop loss is the single fastest way to blow a trading account.',
          'Breakeven Rule: Only move your stop loss to entry (Breakeven) after price has cleared 1R and created a new structural swing.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Structural Stop Loss vs Arbitrary Stop Loss',
          caption: 'How to Prevent Getting Wicked Out',
          content: `Amateur Stop Loss (Arbitrary 15 Pips):
   Entry: 1.0850 ──► Stop placed at 1.0835 (Random 15 pips!)
   Market wicks down to 1.0832 (Sweeps liquidity), triggers stop, then rallies!
   Result: TRADER STOPPED OUT AT LOSS, MARKET THEN GOES TO TARGET!
   
Professional Structural Stop Loss:
   Entry: 1.0850
   Structural Swing Low Wick: 1.0830
   Liquidity Buffer (+3 pips): Stop placed at 1.0827!
   Market wicks to 1.0832 -> Misses pro stop by 5 pips -> Rockets to 1.0920!
   Result: TRADE WINS FULL 3R PROFIT!`
        },
        realWorldExample: {
          pair: 'GBP/JPY',
          context: 'Trader buying an M15 EMA bounce placed stop 2 pips below the 50 EMA without checking the recent wick.',
          setup: 'Spread widened by 3 pips during a London session minor spike; stopped out instantly before a 120-pip rally.',
          outcome: 'Learned to always add a 5-pip buffer beyond the extreme wick on high-volatility pairs.',
          keyTakeaway: 'Give your trades breathing room by anchoring stops to structural market invalidation.'
        },
        actionableChecklist: [
          'Always identify the structural invalidation point BEFORE calculating your lot size.',
          'Add 3 pips of buffer on EUR/USD and 5 pips on GBP/JPY and Gold to cover spread spikes.',
          'Never widen a stop loss once an order is live.'
        ]
      },
      {
        id: 'sv-10',
        number: '10',
        title: 'Multi-Target Take Profit & Trailing Stop Management',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'Lock in profits systematically: Scaling out 50% at 1:2 RRR, moving to breakeven, and trailing runners for 1:5+ windfalls.',
        concept: 'Entering a trade is only 20% of the game; trade management determines whether you achieve long-term profitability. Professional prop firm traders rarely hold 100% of their position to an ambitious target. They utilize a multi-target scale-out model: when price reaches 1:2 RRR, they close 50% of the position, bank guaranteed cash, and move the stop loss to Breakeven. The remaining 50% position is a "free trade" that trails behind structural swing points.',
        bulletPoints: [
          'Target 1 (50% Volume): Bank profit at 1:2 RRR or the nearest opposing liquidity pool.',
          'Breakeven Shift: Immediately move stop loss to Entry Price once Target 1 is secured.',
          'Target 2 (25% Volume): Close at major Higher Timeframe key level or 1:4 RRR.',
          'Runner (25% Volume): Trail behind H1 swing lows/highs until market structure formally changes.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The 3-Tier Institutional Scale-Out Model',
          caption: 'Guaranteed Profit & Stress-Free Execution',
          content: `Total Position Size: 1.00 Standard Lot
Risk: $200 (20 Pips Stop Loss)
Target 1 Distance: +40 Pips (1:2 RRR)
Target 2 Distance: +80 Pips (1:4 RRR)

Step 1: Price reaches +40 Pips (+1:2 RRR)
   └── CLOSE 50% OF LOT (0.50 Lot closed = +$200 CASH BANKED!)
   └── MOVE STOP LOSS TO BREAKEVEN (Entry Price: 1.0850)
   └── TRADE IS NOW 100% RISK-FREE! MAXIMUM WORST OUTCOME IS +$200!

Step 2: Price reaches +80 Pips (+1:4 RRR)
   └── CLOSE 25% OF LOT (0.25 Lot closed = +$200 ADDITIONAL CASH!)

Step 3: Trail remaining 0.25 Lot behind H1 Higher Lows for ultimate runner profit!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader took a 1.00 lot long; at +45 pips, closed 0.50 lot (+$225) and moved SL to BE.',
          setup: 'US Federal Reserve speaker caused a sudden flash drop of 50 pips.',
          outcome: 'Stopped out at breakeven on remaining 0.50 lot. Account walked away with +$225 net profit instead of a loss.',
          keyTakeaway: 'Scaling out eliminates emotional anxiety and protects your capital against sudden market reversals.'
        },
        actionableChecklist: [
          'Calculate Target 1 (1:2 RRR) and mark it on your chart before entering.',
          'Practice partial close in MT4/MT5: Modify order -> Volume: 0.05 -> Click Close.',
          'Never move stop loss to breakeven prematurely before price has cleared 1.5R to 2R.'
        ]
      },
      {
        id: 'sv-11',
        number: '11',
        title: 'ICT Masterclass: Order Blocks (OB) & Mean Threshold (50% Mitigation Matrix)',
        levelTag: 'Advanced',
        duration: '24 mins',
        summary: 'Identify the exact last opposite candle before institutional displacement, and use the 50% Mean Threshold for sniper limit entries.',
        concept: 'An ICT Order Block is not just standard support or resistance. It is the footprint of smart money algorithmic accumulation or distribution. A Bullish Order Block is the last down-close (bearish) candle prior to an aggressive upward displacement that breaks market structure (MSS). A Bearish Order Block is the last up-close (bullish) candle before an aggressive drop. The 50% midpoint of the candle body is known as the "Mean Threshold" (M.T.). Algorithms will typically tap the top of the body or retrace to the Mean Threshold; if candle bodies close beyond the Mean Threshold, the Order Block is considered violated.',
        bulletPoints: [
          'High-Probability OB Criteria: Must have caused displacement and created an unmitigated Fair Value Gap.',
          'Mean Threshold (50%): The algorithmic equilibrium of the candle body. Ideal limit order placement zone.',
          'Wick vs Body Rule: Wick penetrations of the Mean Threshold are valid; a full candle body CLOSE beyond it invalidates the block.',
          'Breaker Block Evolution: When an Order Block fails to hold price after liquidity has been swept, it flips into a Breaker Block.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Bearish Order Block & Mean Threshold Anatomy',
          caption: 'Smart Money Distribution & Sniper Limit Fill',
          content: `   [ BEARISH ORDER BLOCK ]
    (Last Up-Close Green Candle)
           High Wick: 1.2965
               ┌┴┐
         ┌─────┤ ├─────┐  ◄── Open: 1.2940
         │     │ │     │
    ─────┼─────┼─┼─────┼─────► MEAN THRESHOLD (50% Midpoint): 1.2925 (LIMIT SELL ENTRY!)
         │     │█│     │
         └─────┤█├─────┘  ◄── Close: 1.2910
               └┬┘
                │
                ▼
         [ AGGRESSIVE RED DISPLACEMENT CANDLE ]
         Drops 45 Pips & Breaks Previous Low!
                │
         Price slowly retraces to 1.2925 (Taps Mean Threshold) -> ACCELERATES DOWN!`
        },
        realWorldExample: {
          pair: 'GBP/USD H1',
          context: 'At London Open, GBP/USD printed an H1 green candle followed by an aggressive 60-pip cascade breaking previous day low.',
          setup: 'Trader marked the H1 green candle body (1.2880 to 1.2920) and calculated Mean Threshold at 1.2900.',
          outcome: 'Price retraced into 1.2902 at 15:30 EAT NY open, triggered sell order, and tumbled 95 pips.',
          keyTakeaway: 'The Mean Threshold gives you the most favorable risk-reward entry with minimal drawdown.'
        },
        actionableChecklist: [
          'Only mark Order Blocks that directly produced a Market Structure Shift (MSS).',
          'Measure the candle body with the 50% Fibonacci or rectangle midpoint to find the Mean Threshold.',
          'Place Stop Loss 3 to 5 pips beyond the Order Block extreme wick.'
        ]
      },
      {
        id: 'sv-12',
        number: '12',
        title: 'ICT Masterclass: Fair Value Gaps (FVG) & Consequent Encroachment (C.E.)',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'Trade 3-candle algorithmic delivery imbalances by targeting Consequent Encroachment (50% midpoint) for precision wholesale entries.',
        concept: 'Institutional market makers operate automated pricing algorithms that must maintain balanced price delivery. When large institutional orders enter the market with extreme force, price skips tick levels, leaving an imbalance where only one side of the market was delivered (buy-side or sell-side only). This creates a 3-candle Fair Value Gap (FVG). In a bullish FVG, Candle 1 high does not overlap Candle 3 low. The 50% midpoint of this empty gap is termed "Consequent Encroachment" (C.E.). Institutional limit orders rest at C.E. waiting for price to rebalance.',
        bulletPoints: [
          '3-Candle Imbalance: Candle 1 (preceding), Candle 2 (large displacement impulse), Candle 3 (following candle).',
          'Consequent Encroachment (C.E.): The 50% midpoint of the imbalance between Candle 1 wick and Candle 3 wick.',
          'Premium vs Discount: Bullish FVGs in Discount (< 50% of the dealing range) have the highest win rate.',
          'Inversion FVG: When price blasts through an FVG without respecting it, that gap flips into an opposite support/resistance zone.'
        ],
        illustration: {
          type: 'chart',
          title: '3-Candle FVG & Consequent Encroachment Matrix',
          caption: 'How Algorithmic Imbalance is Rebalanced',
          content: `   [ Candle 1 ]           [ Candle 2 (Displacement) ]            [ Candle 3 ]
        High                         Large Bullish                       Low
         ┌─┐                              ┌─┐                            ┌─┐
         │ │                              │ │                            │ │
    ─────┴─┴──────────────────────────────┤ │                            │ │  ◄── Candle 3 Low: 1.0870
                                          │ │
         ═════════════════════════════════╪═╪═══════════════════════════════  ◄── CONSEQUENT ENCROACHMENT: 1.0855 (50%)
                 [ FAIR VALUE GAP ]       │ │                                     (OPTIMAL LIMIT BUY ORDER!)
    ──────────────────────────────────────┼─┼────────────────────────────┬─┬  ◄── Candle 1 High: 1.0840
                                          │ │                            └─┘
                                          └─┘
    Price returns calmly to 1.0855 (Taps C.E.) -> Fills institutional orders -> Rallies +50 Pips!`
        },
        realWorldExample: {
          pair: 'EUR/USD M15',
          context: 'At 15:30 EAT US Core Retail Sales, EUR/USD surged 35 pips, leaving an M15 FVG between 1.0840 and 1.0870.',
          setup: 'Trader set a Buy Limit order at the 50% Consequent Encroachment (1.0855) with SL at 1.0835 (20 pips).',
          outcome: 'At 16:45 EAT, price retraced to 1.0856, wicked 1.0852, filled the order, and exploded to 1.0920 (+65 pips).',
          keyTakeaway: 'Never chase the displacement candle. Algorithms almost always return to fill the imbalance.'
        },
        actionableChecklist: [
          'Use the Rectangle tool to highlight the gap between Candle 1 wick and Candle 3 wick.',
          'Set a price alert at the 50% Consequent Encroachment line.',
          'Verify that Higher Timeframe (H1 or H4) directional bias agrees with the FVG trade direction.'
        ]
      },
      {
        id: 'sv-13',
        number: '13',
        title: 'ICT Masterclass: Liquidity Pools (BSL & SSL) & Induced Retail Traps',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'Understand why institutions hunt equal highs (Buy-Side Liquidity) and equal lows (Sell-Side Liquidity) before making true trend runs.',
        concept: 'Institutional market participants cannot buy with $500 Million without someone else selling to them. Liquidity pools are areas where retail traders place resting stop-loss orders. Above equal highs (Double Tops, Previous Day Highs) sit resting Buy Stops (Buy-Side Liquidity / BSL). Below equal lows (Double Bottoms, Previous Day Lows) sit resting Sell Stops (Sell-Side Liquidity / SSL). Smart money algorithms intentionally drive price into these pools to trigger retail stops, absorbing all the liquidity to fuel their true contrary positions.',
        bulletPoints: [
          'Buy-Side Liquidity (BSL): Resting Buy Stops above obvious swing highs, double tops, and daily/weekly highs.',
          'Sell-Side Liquidity (SSL): Resting Sell Stops below obvious swing lows, double bottoms, and daily/weekly lows.',
          'Inducement: A minor swing high or low engineered to tempt impatient retail traders into early positioning.',
          'Turtle Soup Setup: Price purges 5 to 15 pips through an obvious liquidity pool, then immediately rejects with a wick.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Buy-Side Liquidity (BSL) Hunt & Reversal',
          caption: 'Smart Money Sweeps Retail Breakout Traders',
          content: `Retail "Double Top Resistance":
          High 1                    High 2
            /\                        /\
           /  \                      /  \
    ══════/════\════════════════════/════\══════════════════════ [ RETAIL RESISTANCE: 1.2850 ]
                                          \                        ▲
                                           \                       │ Retail Buy Stops (BSL) Accumulating Here!
                                            \                      ▼
                                             \                 [ LIQUIDITY PURGE / SWEEP ]
                                              \                 Spikes to 1.2865! (Grabs BSL)
                                               \                ▲
                                                \              ┌┴┐ Bearish Rejection Wick!
                                                 \             │█│ Closes back BELOW 1.2850!
                                                  \____________│█│ ◄── INSTITUTIONAL SELL ENTRY!
                                                               └┬┘
                                                                ▼
                                                        CRASHES 70 PIPS TO SSL!`
        },
        realWorldExample: {
          pair: 'XAU/USD (Gold) M15',
          context: 'Gold formed equal highs at 2040.00 during Asian session, prompting retail traders to place Sell Limit orders and Buy Stops at 2043.',
          setup: 'At 10:30 AM EAT London open, price spiked to 2043.50, sweeping the BSL, and printed an M15 shooting star pinbar closing at 2038.',
          outcome: 'Entered Short at 2037.50 with SL at 2044.50. Price collapsed to 2020.00 (+175 pips, 1:4.8 RRR).',
          keyTakeaway: 'When retail traders see "strong resistance", institutions see an appetizing pool of stop losses.'
        },
        actionableChecklist: [
          'Mark Previous Day High (PDH) and Previous Day Low (PDL) on every pair at 09:00 AM EAT.',
          'Mark obvious Equal Highs (EQH) and Equal Lows (EQL) with horizontal rays labeled "BSL" and "SSL".',
          'Do NOT trade breakouts of equal highs unless accompanied by confirmed displacement and macro news drivers.'
        ]
      },
      {
        id: 'sv-14',
        number: '14',
        title: 'ICT Masterclass: Market Structure Shift (MSS) vs False CHoCH with Displacement',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'Distinguish between a deceitful wick sweep and a genuine algorithmic displacement that confirms an institutional change in trend.',
        concept: 'Many traders lose money trying to trade every "Change of Character" (CHoCH) they see on 1-minute or 5-minute charts. Most of these are merely liquidity sweeps or internal consolidation wicks. A genuine ICT Market Structure Shift (MSS) requires "Displacement"—an energetic, forceful price move characterized by consecutive large-bodied candles that close with authority past the swing point and leave an unmitigated Fair Value Gap behind. Without displacement and an FVG, a break is presumed to be a trap.',
        bulletPoints: [
          'Wick vs Body Rule: A wick beyond a swing high/low is a LIQUIDITY SWEEP. Only a solid candle BODY close confirms MSS.',
          'Displacement Signature: Wide-range candles with minimal wicks, demonstrating institutional commitment.',
          'FVG Prerequisite: A valid MSS MUST leave an unmitigated Fair Value Gap in the displacement leg.',
          'Higher Timeframe Alignment: An M15 MSS is only tradeable if it occurs at a Higher Timeframe (H1/H4) Key Level or Liquidity Pool.'
        ],
        illustration: {
          type: 'chart',
          title: 'False Wick Sweep vs Genuine MSS with Displacement',
          caption: 'Visual Identification of True Institutional Shifts',
          content: `Scenario A: FALSE BREAKOUT (Liquidity Sweep Trap)
        Swing High: 1.2800 ───┬──────────────────┐
                              │ Wick spikes to   │  Candle closes back at 1.2790!
                              │ 1.2808 then wicks│  NO BODY CLOSE = NO MSS!
                              ▼                  ▼  (Trap for retail breakout buyers)

Scenario B: GENUINE MARKET STRUCTURE SHIFT (MSS)
        Swing High: 1.2800 ───┬──────────────────┐
                              │                  │
                              │ Huge Green Body  │  Closes at 1.2835 with authority!
                              │ Displaces Market │  Leaves Fair Value Gap below!
                              ▼                  ▼  ═══════════════════════════════
                                                    GENUINE MSS CONFIRMED!
                                                    Wait for FVG retest to buy!`
        },
        realWorldExample: {
          pair: 'USD/JPY M15',
          context: 'USD/JPY had been in a downtrend. At 156.00 key level, an M15 candle closed with a large body above 156.40, leaving an FVG.',
          setup: 'Trader waited for price to pull back into the M15 FVG at 156.20 and entered Long with 18-pip stop loss.',
          outcome: 'Price surged 110 pips over the next 4 hours to 157.30.',
          keyTakeaway: 'Displacement is the signature of institutional algorithms. Never trade structure shifts without it.'
        },
        actionableChecklist: [
          'Look for displacement candles that are 2x to 3x larger than the average recent candle size.',
          'Confirm that the displacement leg left behind an open Fair Value Gap.',
          'Wait for price to retrace into the FVG before placing your limit order.'
        ]
      },
      {
        id: 'sv-15',
        number: '15',
        title: 'ICT Masterclass: Optimal Trade Entry (OTE 62%-79%) & London/NY Killzones',
        levelTag: 'Advanced',
        duration: '26 mins',
        summary: 'Combine Fibonacci discount pricing (0.618 - 0.705 - 0.786) with the London (10:00-12:00 EAT) and NY (15:30-17:30 EAT) Killzone clocks.',
        concept: 'Price without Time is meaningless; Time without Price is useless. In ICT methodology, institutional high-frequency algorithms execute during specific time windows called "Killzones". Outside these killzones, algorithms consolidate and engineer liquidity. Inside the London Killzone (10:00 - 12:00 EAT) and New York Killzone (15:30 - 17:30 EAT), algorithms expand price into discount/premium value areas. The Optimal Trade Entry (OTE) is the 0.618 to 0.786 Fibonacci retracement of the displacement impulse, with 0.705 acting as the sweet spot.',
        bulletPoints: [
          'London Killzone (10:00 - 12:00 EAT): Look for the Judas Swing (false move sweeping Asian High/Low) into OTE.',
          'New York Killzone (15:30 - 17:30 EAT): London/NY overlap brings peak interbank liquidity. Perfect for trend continuation or reversal.',
          'OTE Golden Pocket: 0.618 (Deep Discount), 0.705 (ICT Sweet Spot), 0.786 (Extreme Discount).',
          'Equilibrium (0.50): Never buy above 0.50 (Premium); never sell below 0.50 (Discount).'
        ],
        illustration: {
          type: 'steplist',
          title: 'The Time + Price Institutional Execution Blueprint',
          caption: 'Nairobi Time (EAT) Institutional Schedule',
          content: `03:00 - 10:00 EAT: ASIAN ACCUMULATION
   └── Asian High and Low marked as liquidity pools. No trade zone.

10:00 - 12:00 EAT: LONDON KILLZONE (JUDAS SWING & EXPANSION)
   └── 10:15 EAT: Judas Swing spikes through Asian High (Sweeps Buy Stops).
   └── 10:45 EAT: M15 MSS prints downward displacement with an FVG!
   └── 11:15 EAT: Price retraces into the 0.705 OTE Golden Pocket.
   └── EXECUTION: SELL ENTRY! Target Asian Low & Daily ADR.

15:30 - 17:30 EAT: NEW YORK KILLZONE (CONTINUATION / REVERSAL)
   └── US Macro news release at 15:30 EAT.
   └── Retracement into London afternoon FVG -> Second high-probability leg!`
        },
        realWorldExample: {
          pair: 'GBP/USD M15',
          context: 'At 10:30 AM EAT, London open pushed price to 1.29656, sweeping Asian High. M15 candle closed back at 1.29169.',
          setup: 'Fibonacci pulled from 1.2885 (low) to 1.2965 (high). Retracement tapped 0.705 OTE at 1.2908 with 20 EMA confluence.',
          outcome: 'Sold at 1.2915 with SL at 1.2970. Price plummeted to 1.2850 (+65 pips, 1:3.2 RRR).',
          keyTakeaway: 'Trading inside the Killzones guarantees you trade alongside institutional liquidity, never against it.'
        },
        actionableChecklist: [
          'Set a daily alarm on your phone for 09:50 AM EAT to prepare for the London Killzone.',
          'Set an alarm for 15:15 PM EAT to prepare for the New York Killzone.',
          'Apply Fibonacci Retracement only on displacement waves and execute at the 0.62 - 0.79 OTE zone.'
        ]
      }
    ]
  },

  // ==========================================
  // PILLAR 4: /ai-scanner — AI Market Scanner Masterclass
  // ==========================================
  {
    id: '/ai-scanner',
    route: '/ai-scanner',
    number: '04',
    title: 'AI Market Scanner Masterclass',
    subtitle: 'Algorithmic Confluence & Computer Vision Trading Engine',
    oneLineHook: 'Harness quantitative scoring and working AI vision tools to scan charts from your browser or laptop camera.',
    badge: 'AI Vision Lab',
    category: 'Technical',
    overview: 'Learn how institutional algorithmic scanners filter thousands of ticks into high-probability execution setups. Includes two fully functional React tools built directly into the page: 1) The Interactive Manual Broker Scanner (0-100 quantitative scoring), and 2) The Camera AI Vision Scanner (upload or capture MT4/MT5 laptop screens).',
    learningOutcomes: [
      'Understand quantitative confluence scoring vs lagging indicator signals',
      'Calculate mean reversion probability using EMA distance and RSI velocity',
      'Operate the built-in Manual Broker Scanner with live price inputs and instant verdicts',
      'Use the Camera AI Vision scanner to analyze laptop MT4/MT5 candlestick screens',
      'Execute trades only when algorithmic confidence exceeds 75%'
    ],
    lessons: [
      {
        id: 'ai-01',
        number: '01',
        title: 'Algorithmic Confluence vs Random Indicators',
        levelTag: 'Beginner',
        duration: '15 mins',
        summary: 'Why single indicators fail and how mathematical confluence matrices isolate real market edges.',
        concept: 'Most retail traders fail because they treat individual indicators as holy grails. An indicator is simply a mathematical derivative of past price. An algorithmic scanner does not look at indicators in isolation; it computes a weighted multi-factor confluence score combining price location, moving average displacement, momentum exhaustion, and session liquidity.',
        bulletPoints: [
          'The Flaw of Single Indicators: RSI 70 in a strong parabolic trend will stay overbought for 100 pips while short sellers blow up.',
          'Confluence Weighting: Price Action (40%) + Market Structure (30%) + Momentum/EMA (20%) + Session Timing (10%).',
          'Algorithmic Scoring: Evaluating setups on a 0 to 100 scale where only setups scoring >75 are eligible for capital deployment.',
          'Eliminating Emotional Bias: An algorithm does not feel greed, fear, or revenge.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The 0-100 Quantitative Confluence Matrix',
          caption: 'How the PivotFx Scanner Calculates Setup Probability',
          content: `[ Factor 1: Price vs 20/50 EMA Displacement ] ──► Up to 30 Points
[ Factor 2: RSI 14 Momentum & Divergence ]    ──► Up to 25 Points
[ Factor 3: Candlestick Pattern (Pinbar/Tower) ] ──► Up to 25 Points
[ Factor 4: Session Liquidity Timing (London/NY) ] ──► Up to 20 Points
───────────────────────────────────────────────────────────────────────
TOTAL CONFLUENCE SCORE: 0 - 100
   Score 0 - 45   ──► WAIT / NO TRADE (Chop zone)
   Score 46 - 74  ──► RISKY / EXTENDED (Wait for better pullback)
   Score 75 - 100 ──► HIGH PROBABILITY SIGNAL (Deploy capital with $2 rule)`
        },
        realWorldExample: {
          pair: 'EUR/USD M15',
          context: 'RSI was 74, but price was still above both 20 and 50 EMAs with no candlestick reversal.',
          setup: 'Manual scanner calculated score of 52 (RISKY). Trader waited.',
          outcome: 'Price rallied another 20 pips before printing a clean Tower Top. Score jumped to 88. Entered short at peak.',
          keyTakeaway: 'Wait for the full confluence matrix to align. Partial signals lead to partial accounts.'
        },
        actionableChecklist: [
          'Never execute a trade with an AI scanner score below 75.',
          'Always verify that the operational session is active (London or New York).',
          'Use the scanner as a confirmation filter, not a substitute for risk management.'
        ]
      },
      {
        id: 'ai-02',
        number: '02',
        title: 'Price Distance from 20 & 50 EMA: Mean Reversion Math',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'Calculate statistical standard deviations of price away from moving averages to predict mean reversion bounces.',
        concept: 'Price behaves like a rubber band stretched away from its mean. The 20 Exponential Moving Average represents the short-term equilibrium price. When price stretches more than 2.0 to 2.5 standard deviations away from the 20 EMA, the probability of continuing in that direction drops drastically, while the probability of snapping back (mean reversion) increases to over 78%.',
        bulletPoints: [
          'Mean Reversion Concept: Extreme expansions inevitably return to dynamic moving average baselines.',
          'The 20-Pip Rule (M15): On EUR/USD or GBP/USD M15 charts, distance >20 pips from 20 EMA is statistically stretched.',
          'The Rubber Band Snap: Entering in the direction of mean reversion offers tight stops and rapid reward.',
          'Chasing Trap: Buying when price is extended 25 pips above the 20 EMA is the #1 mistake of losing retail traders.'
        ],
        illustration: {
          type: 'chart',
          title: 'Mean Reversion Stretch & Snapback',
          caption: 'Statistical Distance from 20 EMA',
          content: `Price Stretched +25 Pips Above 20 EMA!
                      [ EXTREME OVEREXTENSION ]
                             ▲
                            / \   <─── Statistical snapback probability: >78%!
                           /   \
                          /     \  Mean Reversion Cascade!
                         /       \
                        /         ▼
   20 EMA ─────────────/───────────\───────────────────► [ EQUILIBRIUM LEVEL ]
                      /             \
   Healthy Distance  /               \
   (3 to 8 Pips)    /                 ▼ Pullback completed; trend can resume!`
        },
        realWorldExample: {
          pair: 'GBP/USD M15',
          context: 'GBP/USD spiked during UK news, stretching 32 pips above the 20 EMA.',
          setup: 'Scanner flagged "EXTENDED: 32 pips from 20 EMA; Mean Reversion imminent".',
          outcome: 'Price collapsed back to the 20 EMA within 45 minutes, shedding 28 pips.',
          keyTakeaway: 'When price is far from the 20 EMA, look for exhaustion reversals or wait for the pullback.'
        },
        actionableChecklist: [
          'Measure the distance between current price and the 20 EMA using TradingView ruler.',
          'If distance exceeds 20 pips on M15, do NOT enter in the direction of the expansion.',
          'Input price and EMA values into the built-in manual scanner tool below.'
        ]
      },
      {
        id: 'ai-03',
        number: '03',
        title: 'RSI Velocity & Overextension Thresholds',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Calibrate RSI 14 velocity algorithms to distinguish between healthy strong momentum and terminal exhaustion.',
        concept: 'Traditional textbooks teach that RSI > 70 is always a sell and RSI < 30 is always a buy. This oversimplification blows accounts during strong trends. The AI Scanner evaluates RSI velocity—the rate of change of RSI per candle bar. When RSI enters 75+ with declining bar velocity, it confirms terminal exhaustion, whereas rapid RSI spikes indicate fresh institutional participation.',
        bulletPoints: [
          'RSI 50 Midpoint: Acts as the bull/bear momentum divider.',
          'Exhaustion Zone: RSI > 75 on M15 with decelerating candle ranges.',
          'Capitulation Zone: RSI < 25 on M15 with long lower rejection wicks.',
          'Momentum Divergence: The definitive confirmation of algorithmic exhaustion.'
        ],
        illustration: {
          type: 'table',
          title: 'RSI Algorithmic Signal Matrix',
          caption: 'Interpreting RSI Velocity Accurately',
          content: `RSI Level │ Market Condition │ Scanner Interpretation │ Action Protocol
──────────┼──────────────────┼────────────────────────┼───────────────────────
80 - 100  │ Extreme Parabolic│ Terminal Exhaustion    │ Prepare Tower Top Sell
60 - 75   │ Strong Uptrend   │ Healthy Bullish Trend  │ Look for EMA Pullback
45 - 55   │ Equilibrium      │ No Trend / Consolidation│ Wait for Breakout
25 - 40   │ Strong Downtrend │ Healthy Bearish Trend  │ Look for EMA Pullback
0 - 25    │ Extreme Dump     │ Capitulation Flush     │ Prepare Pinbar Buy`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'EUR/USD dropped to 1.0780 with RSI touching 21.8.',
          setup: 'M15 printed a long lower wick pinbar; RSI ticked up to 28 while price held low.',
          outcome: 'Scanner registered score 84 (BUY). Price recovered 42 pips into the 50 EMA.',
          keyTakeaway: 'RSI below 25 paired with a rejection wick is an institutional liquidity absorption signal.'
        },
        actionableChecklist: [
          'Configure RSI 14 with 70 and 30 horizontal guide levels.',
          'Look for RSI turning points that coincide with price touching the 50 EMA.',
          'Never short purely because RSI is overbought in an unexhausted trend.'
        ]
      },
      {
        id: 'ai-04',
        number: '04',
        title: 'Computer Vision OCR: Reading MT4 Screens via Camera',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'How computer vision AI reads price levels, detects indicator colors, and recognizes chart patterns from laptop photos.',
        concept: 'Many Kenyan and international traders do their charting on laptop MT4 terminals while executing or checking setups on mobile devices. The PivotFx Camera AI Scanner utilizes optical character recognition (OCR) and computer vision heuristics to detect: 1) Active currency pair and timeframe; 2) Current bid/ask quote; 3) 20 and 50 EMA color lines; and 4) Candlestick patterns (Towers, Pinbars, Engulfing).',
        bulletPoints: [
          'OCR Extraction: Converts pixel images of MT4 price axes into exact numerical values.',
          'Line Edge Detection: Traces EMA curve slopes to calculate trend trajectory.',
          'Candlestick Ratios: Analyzes wick-to-body ratios to confirm absorption or breakout.',
          'Mobile Convenience: Snap a photo of your laptop screen and receive an instant institutional verdict.'
        ],
        illustration: {
          type: 'steplist',
          title: 'Camera AI Vision Scanner Workflow',
          caption: 'How the Laptop Screen Scanner Operates',
          content: `Step 1: Point phone camera or upload photo of your laptop MT4/MT5 screen
Step 2: AI Vision isolates chart viewport and aligns vertical price scale
Step 3: OCR extracts Currency Pair (e.g. GBP/USD) and Bid Price (e.g. 1.28540)
Step 4: Pattern detection engine checks for Tower Top or Rejection Pinbars
Step 5: Scanner computes 0-100 Confluence Score and outputs Trade Plan with SL & TP!`
        },
        realWorldExample: {
          pair: 'GBP/USD M15',
          context: 'Trader took a photo of MT4 chart on an HP laptop in Gilgil.',
          setup: 'Uploaded to PivotFx Scanner: detected GBP/USD, price 1.29169, 20 EMA 1.2890, RSI 74, Tower Top pattern.',
          outcome: 'Scanner generated 89/100 score: HIGH PROBABILITY SELL, suggested SL 1.2965, TP 1.2850.',
          keyTakeaway: 'Computer vision bridges the gap between desktop MT4 analysis and mobile decision discipline.'
        },
        actionableChecklist: [
          'Ensure your laptop screen photo is clear, glare-free, and squarely framed.',
          'Include the MT4 price axis on the right side of the screen for accurate OCR extraction.',
          'Test the working camera upload tool located directly inside this pillar below.'
        ]
      },
      {
        id: 'ai-05',
        number: '05',
        title: 'Working Tool 1: The Interactive Manual Broker Scanner',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'Step-by-step operational guide for the built-in manual scanner: inputting prices, EMAs, and generating instant verdicts.',
        concept: 'The Manual Broker Scanner is a live interactive component engineered to compute institutional confluence in under 3 seconds. By selecting your broker (FXPesa, HFM, FBS), currency pair, timeframe, current price, 20 EMA, 50 EMA, and RSI value, the algorithmic engine calculates distance deviations, trend alignment, and risk-reward targets.',
        bulletPoints: [
          'Broker Selection: Incorporates broker-specific live spreads into the calculation.',
          '0-100 Score Output: Generates unambiguous verdicts (WAIT, RISKY, HIGH_PROBABILITY_BUY, HIGH_PROBABILITY_SELL).',
          'Automated Lot Size Sizing: Suggests lot sizes based strictly on the $2.00 survival rule.',
          'Pre-Trade Plan: Outputs exact Stop Loss and Take Profit levels with mathematical rationale.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Manual Scanner Input & Output Architecture',
          caption: 'Interactive Component Workflow',
          content: `[ INPUT FIELDS ] ──────────────────────────────────────────┐
  • Broker: FXPesa (CMA Licensed)                          │
  • Pair: EUR/USD  │  Timeframe: M15                        │
  • Price: 1.0850  │  20 EMA: 1.0832  │  50 EMA: 1.0815      │
  • RSI: 68.4                                               │
                                                            ▼
[ SCORING ENGINE ] ─────────────────────────────────────────┤
  • EMA Trend Alignment: Bullish (20 > 50)  (+25 Pts)       │
  • Price Pullback: Approaching 20 EMA     (+22 Pts)       │
  • RSI Momentum: Healthy Bullish           (+20 Pts)       │
  • Spread Filter: FXPesa 1.2 Pips (TIGHT)  (+15 Pts)       │
                                                            ▼
[ VERDICT: 82 / 100 - HIGH PROBABILITY BUY ] ───────────────┘
  • Action: BUY at 1.0850
  • Stop Loss: 1.0828 (22 Pips)  │  Take Profit: 1.0910 (60 Pips)
  • Suggested Lot ($2 Rule): 0.01 Micro Lot`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader entered values into the manual scanner: Price 1.0850, 20 EMA 1.0832, RSI 68.4.',
          setup: 'Scanner yielded 82/100 score with High Probability Buy verdict.',
          outcome: 'Trader executed the 0.01 lot order with the recommended 22-pip stop; reached 1.0910 target cleanly.',
          keyTakeaway: 'The scanner eliminates subjective guesswork and enforces mathematical discipline.'
        },
        actionableChecklist: [
          'Scroll down to the interactive scanner component below.',
          'Enter current market numbers from your MT4/MT5 terminal.',
          'Click "Run Confluence Analysis" to view your instant quantitative rating.'
        ]
      },
      {
        id: 'ai-06',
        number: '06',
        title: 'Working Tool 2: The Camera AI Vision Scanner UI',
        levelTag: 'Advanced',
        duration: '18 mins',
        summary: 'How to use the built-in camera upload and chart analysis component to evaluate physical screens and screenshots.',
        concept: 'The Camera AI Scanner component embedded in this page allows you to either activate your smartphone camera or drag-and-drop a screenshot from your MT4/MT5 desktop. The neural vision model evaluates candlestick shapes, trend direction, moving average support, and price exhaustion, outputting an algorithmic confidence percentage.',
        bulletPoints: [
          'Drag-and-Drop or Camera Capture: Seamless image ingestion for mobile and desktop users.',
          'Confidence Rating: Quantifies the visual similarity of your setup to verified winning vs losing patterns.',
          'Pattern Recognition: Automatically labels Tower Tops, Pinbars, Engulfing candles, and Consolidation boxes.',
          'One-Click Journaling: Log the scanned setup directly into your Pillar 8 trade journal.'
        ],
        illustration: {
          type: 'steplist',
          title: 'Camera Scanner Operational Protocol',
          caption: 'From Photo to Execution in 4 Clicks',
          content: `Step 1: Click 'Upload Chart Photo' or 'Open Camera Lens' in the scanner below
Step 2: Select a screenshot of your MT4/MT5 chart or take a photo of your screen
Step 3: Watch the AI Vision scanner process candlestick geometry & EMA lines
Step 4: Review the Confidence Percentage and Historical Case Match
Step 5: Click 'Log Scanned Trade' to transfer parameters to your Trade Journal`
        },
        realWorldExample: {
          pair: 'GBP/JPY H1',
          context: 'Trader snapped an iPhone photo of an H1 chart showing a massive shooting star at 198.50.',
          setup: 'Uploaded to Camera Vision tool: recognized shooting star pattern with 88% confidence.',
          outcome: 'Flagged 198.50 rejection. Trade dropped 135 pips.',
          keyTakeaway: 'Camera vision turns any physical screen into an institutional diagnostic terminal.'
        },
        actionableChecklist: [
          'Test the Camera Scanner tool below using any forex chart screenshot on your device.',
          'Verify the detected pattern matches your manual price action assessment.',
          'Never trade solely based on an AI scan without verifying higher timeframe structure.'
        ]
      },
      {
        id: 'ai-07',
        number: '07',
        title: 'Backtesting Scanner Signals: Win Rate vs Risk-Reward',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'How to quantitatively validate scanner signals over a 100-trade backtesting sample size.',
        concept: 'A trading strategy is unproven until you possess statistical evidence across at least 100 consecutive historical trades. When backtesting scanner confluence signals, you record: Date, Pair, Timeframe, Scanner Score, Entry, Stop Loss, Target, and Outcome. You calculate: 1) Win Rate (Wins / Total Trades); 2) Average Win vs Average Loss; and 3) Profit Factor (Gross Profits / Gross Losses).',
        bulletPoints: [
          'The 100-Trade Sample: Statistical validity requires a minimum sample size of 100 documented setups.',
          'Expectancy Formula: (Win Rate * Avg Win) - (Loss Rate * Avg Loss). Must be positive.',
          'Profit Factor: Total Gross Profits divided by Total Gross Losses. Above 1.8 is institutional grade.',
          'Market Regime Testing: Backtest across trending, range-bound, and high-impact news periods.'
        ],
        illustration: {
          type: 'formula',
          title: 'Quantitative Trading Expectancy Formula',
          caption: 'Mathematical Proof of Profitability',
          content: `Expectancy Formula:
   Expectancy = (Win% * Average Win $) - (Loss% * Average Loss $)

Example (PivotFx Scanner Setups with 1:2 RRR):
   • Win Rate: 45% (0.45)   │  Loss Rate: 55% (0.55)
   • Average Win: $6.00      │  Average Loss: $2.00 (The $2 Rule)
   
   Expectancy = (0.45 * $6.00) - (0.55 * $2.00)
   Expectancy = $2.70 - $1.10 = +$1.60 PER TRADE!
   
Even with a LOSING win rate of 45%, YOU MAKE $1.60 NET PROFIT EVERY TRADE!`
        },
        realWorldExample: {
          pair: 'EUR/USD & GBP/USD',
          context: 'Trader backtested 100 scanner signals that scored >80.',
          setup: 'Results: 48 Wins, 52 Losses. Because average win was 2.5R and average loss was 1R, total profit was +68R.',
          outcome: 'Proved mathematically that a 48% win rate generates immense wealth with asymmetric risk-to-reward.',
          keyTakeaway: 'Do not obsess over 90% win rates. Focus on asymmetric reward and positive mathematical expectancy.'
        },
        actionableChecklist: [
          'Create a backtesting spreadsheet or use TradingView Bar Replay feature.',
          'Record 20 historical scanner setups before trading live capital.',
          'Calculate your personal Profit Factor (aim for > 1.75).'
        ]
      },
      {
        id: 'ai-08',
        number: '08',
        title: 'Alert Configuration & Avoiding Chop Zone Traps',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Set automated cloud alerts on TradingView and MT4 so you never sit staring at stagnant, consolidating charts.',
        concept: 'Screen fatigue causes impulsive, boredom-induced trading. Professional traders set price and indicator alerts at key structural boundaries (such as the 20 EMA, FVG boundaries, and Asian range extremes) and step away from the computer. When an alert triggers, they open the chart, run the scanner, and make an objective decision in under 2 minutes.',
        bulletPoints: [
          'TradingView Cloud Alerts (Alt + A): Triggers instant push notifications on your smartphone.',
          'Chop Zone Detection: When 20 EMA and 50 EMA are horizontal and overlapping, the market is in a chop trap. Do NOT trade.',
          'Alert Types: Price Crossing Level, RSI Crossing 70/30, EMA Crossing EMA.',
          'Mental Freedom: Spend 30 minutes charting in the morning, set 4 alerts, and live your life.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Automated Alert Trading Architecture',
          caption: 'Eliminating Screen Addiction & Chop Fatigue',
          content: `07:30 EAT: Mark Asian High (1.2850), Asian Low (1.2815), and 50 EMA
   │
   └──► SET CLOUD ALERT 1: "GBP/USD Crossing 1.2850 (Asian High Sweep)"
   └──► SET CLOUD ALERT 2: "GBP/USD Crossing 1.2815 (Asian Low Sweep)"
   │
   ▼ CLOSE CHART & WALK AWAY! Enjoy coffee in Gilgil or focus on your work.
   │
11:18 EAT: BEEP! Phone Alert Triggers: "GBP/USD Crossing 1.2850"
   │
   ▼ OPEN CHART -> Run AI Scanner -> Score is 86 (Tower Sweep) -> ENTER SHORT!
   │
Execution completed in 90 seconds without staring at screens for 4 hours!`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'Trader sat in front of the screen for 5 hours; took 4 random trades during chop and lost $18.',
          setup: 'Switched to alert-based trading; set alert at 1.2850 key level.',
          outcome: 'Phone chimed at 11:20 AM EAT. Took 1 clean trade and made +$36.',
          keyTakeaway: 'The best traders spend the least time staring at unmoving charts. Let alerts do the waiting.'
        },
        actionableChecklist: [
          'Set at least 2 price alerts on your primary pair every morning.',
          'Enable TradingView smartphone push notifications in profile settings.',
          'If the 20 and 50 EMA are intertwined like spaghetti, close the chart immediately.'
        ]
      },
      {
        id: 'ai-09',
        number: '09',
        title: 'End-to-End Execution: From AI Scan to MT4 Terminal',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'The seamless 4-step execution workflow connecting browser analysis with mobile and desktop MT4/MT5 order execution.',
        concept: 'Having a great scanner analysis is useless if your execution workflow is sluggish or prone to error. An institutional trader follows a checklist-driven protocol: 1) Scanner identifies setup and outputs parameters; 2) Risk calculator confirms exact lot size for the $2 rule; 3) MT4 order window opened; 4) Stop Loss and Take Profit input FIRST; 5) Buy/Sell clicked.',
        bulletPoints: [
          'Step 1 (Scan): Obtain verified 75+ confluence score from the PivotFx Scanner.',
          'Step 2 (Risk Check): Input stop loss pips into lot calculator to determine exact micro/mini lots.',
          'Step 3 (Terminal Order): Open MT4 F9 order window; set lot size and pending or market order.',
          'Step 4 (Log): Transfer setup data to Pillar 8 Trade Logger for weekly performance audit.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The 60-Second Order Execution Checklist',
          caption: 'Flawless Execution Without Hesitation',
          content: `[ ] 1. AI Scanner Confluence Score is 75 or higher
[ ] 2. Market is currently in London (11:00 - 15:30) or NY (15:30 - 19:30) EAT
[ ] 3. Lot size verified using the $2 Risk Rule (e.g. 0.01 lot for 20 pip SL)
[ ] 4. Stop Loss price is entered into MT4 window BEFORE clicking Buy/Sell
[ ] 5. Take Profit price is entered into MT4 window
[ ] 6. Click 'Buy by Market' or 'Sell by Market'
[ ] 7. Close MT4 terminal and allow trade to play out to SL or TP!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader followed the 60-second execution checklist.',
          setup: 'Scanner scored 84; calculated 0.01 lot; typed in SL at 1.0828 and TP at 1.0910.',
          outcome: 'Order executed with zero second-guessing or hesitation. Target hit 3 hours later.',
          keyTakeaway: 'Checklists eliminate adrenaline and panic. Treat trading like piloting an aircraft.'
        },
        actionableChecklist: [
          'Memorize the 7-step pre-trade execution checklist.',
          'Never click Buy or Sell without having your Stop Loss pre-calculated.',
          'Log your execution time in your trading journal.'
        ]
      },
      {
        id: 'ai-10',
        number: '10',
        title: 'Continuous AI Model Improvement & Signal Logging',
        levelTag: 'Advanced',
        duration: '16 mins',
        summary: 'How to archive your scanned setups into templates to train your personal pattern recognition eye.',
        concept: 'The greatest trading algorithm is ultimately the neural network inside the human brain when trained with thousands of high-quality chart repetitions. By archiving successful scanner setups into screenshot templates, you train your visual pattern recognition to spot high-probability confluence in real-time before indicators even complete their calculations.',
        bulletPoints: [
          'Screenshot Archive: Save both the pre-trade setup and post-trade outcome in a dedicated folder.',
          'Template Creation: Categorize templates into: Tower Tops, EMA Bounces, FVG Mitigations, and Asian Sweeps.',
          'Weekend Review: Spend 1 hour every Sunday reviewing your 5 best winning setups and 5 worst mistakes.',
          'Visual Muscle Memory: After reviewing 500 setups, pattern recognition becomes instantaneous and intuitive.'
        ],
        illustration: {
          type: 'steplist',
          title: 'Building Your Personal Visual Trade Playbook',
          caption: 'From Beginner Scans to Intuitive Mastery',
          content: `Step 1: Whenever the scanner hits 85+ score, take a screenshot (Windows: Win+Shift+S)
Step 2: Save to folder: 'PivotFx Playbook / Tower Reversals'
Step 3: Annotate the screenshot with: Entry price, Stop Loss, RSI value, Session time
Step 4: Take a second screenshot when trade hits Target or Stop Loss
Step 5: Review playbook every Sunday evening before Monday market open`
        },
        realWorldExample: {
          pair: 'All Majors',
          context: 'Trader saved 50 Tower Top screenshots over 3 months.',
          setup: 'Recognized an identical Tower formation forming live on USD/JPY without needing to check indicator settings.',
          outcome: 'Entered with complete confidence; banked +45 pips.',
          keyTakeaway: 'Archiving and reviewing your setups builds unshakeable conviction and pattern mastery.'
        },
        actionableChecklist: [
          'Create a folder on your computer named "PivotFx Setup Archive".',
          'Save your first 5 scanned setups using the screenshot button.',
          'Review your setup archive before taking any funded challenge examination.'
        ]
      }
    ]
  },

  // ==========================================
  // PILLAR 5: /risk-management — Risk & Capital Management Masterclass
  // ==========================================
  {
    id: '/risk-management',
    route: '/risk-management',
    number: '05',
    title: 'Risk & Capital Management Masterclass',
    subtitle: 'Mathematical Invariance, Lot Sizing & Survival Blueprints',
    oneLineHook: 'Master the mathematics of risk: the Gilgil $2 rule, lot size formulas, drawdown protection, and working calculators.',
    badge: 'Capital Shield',
    category: 'Risk & Mindset',
    overview: 'Risk management is the only factor in financial trading that you control with 100% certainty. You cannot control where the market moves; you can only control how much you lose when you are wrong. This pillar teaches the mathematical law of ruin, fixed fractional risk, drawdown mechanics, and features three working interactive calculators built directly into the page.',
    learningOutcomes: [
      'Master the mathematical Law of Gambler’s Ruin and how to prevent account blowouts',
      'Implement the Gilgil $2.00 Survival Rule (260 KES cap) for small live and demo accounts',
      'Use the built-in Lot Size Calculator to determine exact lot sizes for any stop loss',
      'Model 12-month compound growth using the interactive Capital Growth Simulator',
      'Navigate prop firm trailing drawdown rules to protect funded challenge accounts'
    ],
    lessons: [
      {
        id: 'rm-01',
        number: '01',
        title: 'The Mathematical Law of Ruin & Account Survival',
        levelTag: 'Beginner',
        duration: '18 mins',
        summary: 'Why losing 50% of your account requires a 100% gain just to break even: Understanding the asymmetric math of losses.',
        concept: 'The mathematics of account drawdown are asymmetrical. If you lose 10% of your account, you need an 11.1% gain to recover. If you lose 20%, you need a 25% gain. But if you lose 50%, you must generate a 100% return just to get back to zero! At 75% drawdown, you need a 300% gain. Retail traders who risk 10% or 20% per trade are mathematically guaranteed to blow their accounts due to inevitable losing streaks.',
        bulletPoints: [
          'Asymmetric Recovery Math: Losses degrade capital exponentially, making recovery mathematically improbable.',
          'Inevitable Losing Streaks: In any series of 100 trades with a 50% win rate, you will face a streak of 6 to 8 consecutive losses.',
          'The 1% - 2% Golden Rule: By risking only 1% to 2% per trade, an 8-trade losing streak only dents your account by 8-15%.',
          'Capital Preservation Priority: Rule #1: Protect your capital. Rule #2: Never forget Rule #1.'
        ],
        illustration: {
          type: 'table',
          title: 'The Drawdown Recovery Reality Matrix',
          caption: 'Why Big Losses Are Mathematical Death',
          content: `Account Drawdown │ Remaining Equity │ Required Gain to Break Even │ Feasibility
─────────────────┼──────────────────┼─────────────────────────────┼──────────────
10% Loss         │ $900 ($1,000)    │ 11.1% Gain                  │ Easy
20% Loss         │ $800             │ 25.0% Gain                  │ Achievable
30% Loss         │ $700             │ 42.8% Gain                  │ Challenging
50% Loss         │ $500             │ 100.0% Gain (DOUBLE!)       │ Rare / Risky
75% Loss         │ $250             │ 300.0% Gain (4X ACCOUNT!)   │ Near Impossible
90% Loss         │ $100             │ 900.0% Gain (10X ACCOUNT!)  │ ACCOUNT RUINED`
        },
        realWorldExample: {
          pair: 'General Account',
          context: 'Trader started with $1,000. Risked $200 (20%) per trade. Suffered 4 consecutive losses during volatile news.',
          setup: 'Account plunged to $200 (-80% drawdown).',
          outcome: 'Felt desperate, tried to double down to recover, and lost the remaining $200 within 24 hours.',
          keyTakeaway: 'Never allow an account to exceed a 10% total drawdown. Small losses are easily recovered; large losses destroy.'
        },
        actionableChecklist: [
          'Cap maximum risk on any single trade to 1.0% to 2.0% of account equity.',
          'Never risk more than 5% total open risk across all simultaneous positions.',
          'If account suffers 6% drawdown in a single week, halt trading until Monday.'
        ]
      },
      {
        id: 'rm-02',
        number: '02',
        title: 'The Gilgil $2.00 Survival Rule (260 KES)',
        levelTag: 'Beginner',
        duration: '16 mins',
        summary: 'The institutional small-capital discipline framework engineered in Gilgil, Kenya: Limiting risk to exactly $2.00 per trade.',
        concept: 'In Kenya and emerging economies, most retail traders start with small accounts ($50 to $200 / 6,500 KES to 26,000 KES). When a beginner risks $20 on a $50 account, they have only 2.5 attempts before liquidation. The Gilgil $2.00 Rule mandates that on any account under $200, the maximum allowable dollar loss on any trade is strictly $2.00 (approx 260 KES). This grants a beginner 25 to 50 consecutive attempts to master execution discipline without financial ruin.',
        bulletPoints: [
          '25+ Bullet Attempts: A $50 account with a $2 risk cap can survive 25 consecutive mistakes before blowing up.',
          'Emotional Detachment: Losing 260 KES does not cause heart palpitations, panic, or revenge trading.',
          'Skill Mastery Over Dollar Greed: Focus on mastering pip execution, not making millions overnight.',
          'Micro Lot Sizing: Requires trading strictly 0.01 micro lots with 20-pip stops.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Gilgil $2 Survival Rule Architecture',
          caption: '25 Consecutive Attempts to Learn Forex',
          content: `Account Equity: $50.00 (approx 6,500 KES)
  │
  ├──► Traditional Gambler Retail Risk: $15.00 / Trade
  │    Number of Mistakes Allowed: 3 Losses -> ACCOUNT BLOWN IN 2 HOURS!
  │
  └──► THE GILGIL $2.00 SURVIVAL RULE: Strictly $2.00 / Trade (260 KES)
       Number of Mistakes Allowed: 25 CONSECUTIVE LOSSES!
       
       Trader 1 (Gambler): Blows up on Monday -> Quits forex forever in debt.
       Trader 2 (Gilgil Rule): Takes 25 trades, learns discipline, masters edge,
                               grows $50 into $150, qualifies for Prop Firm!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader with a 10,000 KES ($77) account adhered strictly to the $2.00 risk cap.',
          setup: 'Experienced 5 consecutive losses while learning trendline breaks (-$10.00 total).',
          outcome: 'Account stood at $67. Trader remained calm, caught two 1:4 winners (+32 pips each), and recovered to $83.',
          keyTakeaway: 'Survival is victory in the early stages of trading. Protect your capital so you can stay in the game.'
        },
        actionableChecklist: [
          'If your account is under $200, enforce a hard $2.00 stop loss cap on every trade.',
          'Calculate lot size: $2.00 / (Stop Loss in Pips * $10) on standard currency pairs.',
          'Never increase your dollar risk until your account balance doubles organically.'
        ]
      },
      {
        id: 'rm-03',
        number: '03',
        title: 'Exact Lot Size Calculation Formula',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'The universal formula every professional trader uses to calculate exact lot sizes based on stop loss distance.',
        concept: 'Never guess your lot size. The lot size is the mathematical output of your Account Equity, your Risk Percentage, and your Stop Loss in pips. If your stop loss is wide (e.g. 40 pips), your lot size must shrink. If your stop loss is tight (e.g. 10 pips), your lot size can increase, while your DOLLAR RISK REMAINS EXACTLY IDENTICAL.',
        bulletPoints: [
          'The Universal Formula: Lot Size = (Account Equity * Risk %) / (Stop Loss in Pips * Pip Value).',
          'Dynamic Sizing: Different stop loss distances yield different lot sizes, but identical dollar risk.',
          'Standardizing Risk: A 15-pip loss on a tight setup and a 30-pip loss on a swing setup cost you the EXACT same dollar amount.',
          'Built-in Calculator: Use the interactive calculator tool below to compute this instantly.'
        ],
        illustration: {
          type: 'formula',
          title: 'The Universal Lot Size Formula',
          caption: 'Mathematical Lot Sizing Engine',
          content: `                       Account Equity ($) * Risk %
   Lot Size (Units) = ──────────────────────────────────
                       Stop Loss (Pips) * Pip Value / Lot

Example 1 (Tight Scalp Setup):
   • Account: $1,000  │  Risk: 1% ($10.00)  │  Stop Loss: 10 Pips
   • Lot Size = $10.00 / (10 * $10) = 0.10 Mini Lot

Example 2 (Wide Swing Setup):
   • Account: $1,000  │  Risk: 1% ($10.00)  │  Stop Loss: 40 Pips
   • Lot Size = $10.00 / (40 * $10) = 0.025 -> 0.02 Micro Lots!
   
BOTH TRADES RISK EXACTLY $10.00! ZERO RISK DISCREPANCY!`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'Trader wanted to trade a wide 35-pip swing stop without risking more than $2.00.',
          setup: 'Applied formula: $2.00 / (35 pips * $10) = 0.0057 -> Rounded down to 0.01 micro lot.',
          outcome: 'When stopped out, total loss was only $3.50 (completely manageable for the account).',
          keyTakeaway: 'Always adjust lot size to your stop loss, never adjust your stop loss to fit a fixed lot size.'
        },
        actionableChecklist: [
          'Memorize the lot size formula or bookmark the interactive calculator below.',
          'Never enter a round lot size (like 0.10 or 0.50) without mathematical verification.',
          'Round down to the nearest safe micro lot if the formula output is fractional.'
        ]
      },
      {
        id: 'rm-04',
        number: '04',
        title: 'Daily Loss Limits & The Hard Stop Discipline',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Set automated daily loss limits (3-5%) to prevent tilt, revenge trading, and emotional blowout days.',
        concept: 'Even the most disciplined traders can experience days where their market read is completely off. The difference between a professional and an amateur is that a professional has a hard Daily Loss Limit. If a professional loses 3% to 4% of their account in a single day, they close their computer and do not place another trade until the following morning. This ensures that a bad day never becomes a fatal day.',
        bulletPoints: [
          'Daily Loss Limit: Typically set at 3% for personal accounts, and 4% for prop firm challenges (max limit is 5%).',
          'The 2-Loss Rule: If you lose 2 consecutive trades in a single session, walk away immediately.',
          'Emotional Reset: It takes the human nervous system at least 2 hours to recover from high-stress financial loss.',
          'Prop Firm Protection: Prop firms automatically terminate accounts that breach daily drawdown.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The Daily Circuit Breaker Protocol',
          caption: 'How to Halt Trading Before Disaster Strikes',
          content: `Daily Account Starting Balance: $10,000 (Prop Firm Challenge)
Daily Maximum Allowed Loss (4%): -$400.00

Trade 1: -$100 Loss (1R) ──► Re-assess market. 1 Trade remaining today.
   │
Trade 2: -$100 Loss (1R) ──► TWO CONSECUTIVE LOSSES!
   │
   └──► [ CIRCUIT BREAKER TRIGGERED! ]
        1. Close MetaTrader terminal completely
        2. Disconnect VPS or log out of mobile MT4 app
        3. Do NOT open TradingView for the rest of the day
        4. Account equity is preserved at $9,800 (-2% total loss)
        5. Come back tomorrow with 100% emotional clarity!`
        },
        realWorldExample: {
          pair: 'General Account',
          context: 'Trader lost 2 trades at 11:30 AM EAT (-$4.00 total on $100 account).',
          setup: 'Followed the Daily Loss Limit rule: closed laptop and went for a run in Gilgil.',
          outcome: 'Market chopped violently all afternoon, wiping out several friends in a local trading group. Trader was safe.',
          keyTakeaway: 'The greatest trade you will ever make is the trade you decide NOT to take when you are frustrated.'
        },
        actionableChecklist: [
          'Define your exact Daily Loss Limit in dollars before Monday morning.',
          'Enforce the 2-Loss Rule: 2 consecutive losses in one day = close charts until tomorrow.',
          'Never attempt to "make back" morning losses in the afternoon session.'
        ]
      },
      {
        id: 'rm-05',
        number: '05',
        title: 'Asymmetric Risk-to-Reward: Winning with a 40% Win Rate',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'The mathematical secret of institutional profitability: How 1:2 and 1:3 reward-to-risk ratios generate massive wealth.',
        concept: 'Amateur traders mistakenly believe that profitable trading requires being right 80% or 90% of the time. The reality of professional trading is that most hedge funds and prop traders operate with win rates between 40% and 55%. By enforcing an Asymmetrical Risk-to-Reward Ratio (where every winning trade makes 2x to 3x what you risk on a loss), you can lose more trades than you win and still generate substantial profits.',
        bulletPoints: [
          '1:1 Risk/Reward: Requires a 50% win rate just to break even (excluding broker spread/commissions).',
          '1:2 Risk/Reward: Requires only a 33.3% win rate to break even. A 45% win rate is highly profitable.',
          '1:3 Risk/Reward: Requires only a 25.0% win rate to break even! You can be WRONG 70% of the time and still make money.',
          'Cut Losses Short, Let Winners Run: The core tenet of every legendary trader in financial history.'
        ],
        illustration: {
          type: 'table',
          title: 'Win Rate vs Risk-Reward Breakeven Matrix',
          caption: 'The Mathematics of Asymmetry',
          content: `Risk-to-Reward Ratio │ Minimum Win Rate Needed to Break Even │ Profit at 50% Win Rate (10 Trades)
─────────────────────┼────────────────────────────────────────┼────────────────────────────────────
1 : 1 (Equal)        │ 50.0% Win Rate                         │ $0.00 (Breakeven)
1 : 1.5              │ 40.0% Win Rate                         │ +$2.50 (Profitable)
1 : 2.0 (Standard)   │ 33.3% Win Rate                         │ +$5.00 (Highly Profitable)
1 : 3.0 (Optimal)    │ 25.0% Win Rate                         │ +$10.00 (Doubles Account Risk!)
1 : 5.0 (Runners)    │ 16.7% Win Rate                         │ +$20.00 (Exceptional Wealth Engine)`
        },
        realWorldExample: {
          pair: 'EUR/USD & GBP/USD',
          context: 'Trader took 10 trades risking $2.00 each with a 1:3 RRR (Wins = +$6.00, Losses = -$2.00).',
          setup: 'Lost 6 trades (-$12.00 total). Won only 4 trades (+$24.00 total).',
          outcome: 'Net Profit: +$12.00 (+24% account growth on a $50 account) DESPITE A 40% WIN RATE!',
          keyTakeaway: 'You do not need to be right all the time. You just need to make significantly more when you are right.'
        },
        actionableChecklist: [
          'Never enter any trade with a projected Risk-to-Reward Ratio below 1:2.0.',
          'Check your average win vs average loss every weekend in your trade journal.',
          'Use the built-in Risk-Reward Calculator below to verify your setup parameters.'
        ]
      },
      {
        id: 'rm-06',
        number: '06',
        title: 'Drawdown Mechanics: Static vs Trailing Prop Firm Drawdown',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'Deconstruct the proprietary firm drawdown trap: Static vs Trailing drawdown and how to navigate prop firm rules.',
        concept: 'Proprietary trading firms (FTMO, FundedNext, MFF) enforce strict drawdown rules: typically a 5% Daily Drawdown and a 10% Overall Drawdown. However, many prop firms use a "Trailing Drawdown" model based on peak unrealized balance or equity. Understanding whether your drawdown trails high-water marks or stays static from starting balance is essential to prevent unexpected challenge disqualifications.',
        bulletPoints: [
          'Static Drawdown: Fixed from your starting account balance (e.g. $10,000 account cannot drop below $9,000).',
          'Trailing Drawdown: Moves upward as your account balance or floating equity increases, locking in your floor.',
          'Peak Equity Trailing Trap: If a trade is floating +$600 profit and reverses to $0, some trailing rules lock the floor higher.',
          'Prop Firm Survival Rule: Reduce your risk to 0.5% per trade during prop firm challenges to give yourself 20 attempts.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Static vs Trailing Drawdown Visualized',
          caption: 'How Trailing Drawdown Traps Unprepared Traders',
          content: `Account Starts at $10,000 (10% Max Drawdown = $9,000 Floor)
   │
   ▼ Trader makes +$1,000 profit (Balance reaches $11,000)
   │
   ├──► STATIC DRAWDOWN:
   │    Floor STAYS at $9,000! You now have $2,000 of drawdown buffer ($11,000 - $9,000)!
   │
   └──► TRAILING DRAWDOWN:
        Floor TRAILS UPWARD to $10,000 ($11,000 - $1,000)!
        If account pulls back from $11,000 to $9,999 -> ACCOUNT TERMINATED!
        (Even though you are still above your starting $10,000 balance!)`
        },
        realWorldExample: {
          pair: 'Prop Firm Challenge',
          context: 'Trader took a $50,000 funded challenge with a trailing drawdown rule.',
          setup: 'Account grew to $52,500. Trader did not realize the drawdown floor had trailed up to $50,000.',
          outcome: 'Suffered a $2,600 pullback; account dropped to $49,900 and failed the challenge.',
          keyTakeaway: 'Always read the exact drawdown fine print of your broker or prop firm before trading.'
        },
        actionableChecklist: [
          'Verify whether your prop firm uses Static Balance or Trailing Equity drawdown.',
          'Cut your risk in half (to 0.5% or 0.25%) whenever you are within 2% of a drawdown floor.',
          'Never leave large floating profits unmanaged in trailing drawdown accounts.'
        ]
      },
      {
        id: 'rm-07',
        number: '07',
        title: 'Currency Correlation Risk: Avoiding Doubled Exposure',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Never open EUR/USD Long and GBP/USD Long simultaneously: Understanding positive and negative currency correlation.',
        concept: 'Currencies do not move in vacuum silos; they are interconnected via global macroeconomic flows. EUR/USD and GBP/USD share a positive correlation of over +85% because both are traded against the US Dollar. If you open a 1% risk Buy on EUR/USD and simultaneously open a 1% risk Buy on GBP/USD, you are not diversifying—you are simply taking a 2% leveraged bet against the US Dollar!',
        bulletPoints: [
          'Positive Correlation (+80% to +100%): Pairs move in the same direction (e.g. EUR/USD and GBP/USD).',
          'Negative Correlation (-80% to -100%): Pairs move in opposite directions (e.g. EUR/USD and USD/CHF).',
          'The Doubled Risk Trap: Opening long positions on correlated pairs doubles your loss when the USD spikes.',
          'The Hedging Illusion: Buying EUR/USD while Selling GBP/USD simply creates a synthetic EUR/GBP trade with double spread cost.'
        ],
        illustration: {
          type: 'table',
          title: 'Major Currency Correlation Matrix',
          caption: 'How Currency Pairs Move Together',
          content: `Pair 1   │ Pair 2   │ Correlation % │ Relationship │ Risk Rule
─────────┼──────────┼───────────────┼──────────────┼─────────────────────────
EUR/USD  │ GBP/USD  │ +88% (High)   │ Move Together│ Never enter both same direction
EUR/USD  │ USD/CHF  │ -92% (High)   │ Move Opposite│ Buying both cancels out (Dead risk)
GBP/USD  │ GBP/JPY  │ +75% (Medium) │ Move Together│ High Sterling volatility exposure
AUD/USD  │ NZD/USD  │ +90% (High)   │ Move Together│ Commodity dollar lock
EUR/USD  │ USD/JPY  │ -65% (Inverse)│ Often Inverse│ Watch DXY dollar dominance`
        },
        realWorldExample: {
          pair: 'EUR/USD & GBP/USD',
          context: 'Trader opened Long on EUR/USD ($2 risk) and Long on GBP/USD ($2 risk).',
          setup: 'US Federal Reserve Chairman gave an unscheduled hawkish comment; USD surged 60 pips.',
          outcome: 'Both trades stopped out simultaneously (-$4.00 loss in 10 seconds). Doubled loss.',
          keyTakeaway: 'Pick the single cleanest setup among correlated pairs. Never trade both at once.'
        },
        actionableChecklist: [
          'Compare EUR/USD and GBP/USD setups; choose only the one with the highest confluence score.',
          'Never hold more than 1 open trade involving the US Dollar simultaneously.',
          'Check correlation tables weekly on Mataf or Myfxbook.'
        ]
      },
      {
        id: 'rm-08',
        number: '08',
        title: 'Scaling In, De-risking & The Free Trade Protocol',
        levelTag: 'Advanced',
        duration: '18 mins',
        summary: 'How institutional traders eliminate trade anxiety by moving to breakeven after 1R and scaling into winners.',
        concept: 'The moment you enter a trade, your risk exposure is at its maximum (100% of planned loss). A professional trader’s primary goal during the first 30 minutes of a trade is to "De-risk" the position as rapidly as structurally sensible. Once price moves 1.5R in your favor and clears a minor market structure, you shift your stop loss to your exact entry price (Breakeven). At that moment, financial risk on the trade drops to exactly $0.00.',
        bulletPoints: [
          'The De-risking Threshold: Never move to Breakeven too early (like at +5 pips) or you will get wicked out.',
          'Structural Breakeven: Wait for a new Higher Low (in an uptrend) to form before tucking your stop behind it at BE.',
          'The Free Trade Mindset: Once at Breakeven, dopamine and anxiety vanish; you can hold for massive multi-day targets.',
          'Pyramiding / Scaling In: Adding to winning trades from a position of house money, not adding to losers.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The De-Risking & Scaling-In Timeline',
          caption: 'From Initial Risk to Completely Free Runner',
          content: `Phase 1 (T = 0 mins): ENTRY AT 1.0850
   Stop Loss: 1.0830 (20 Pips = $2.00 Risk). Risk Exposure = 100%.

Phase 2 (T = 45 mins): PRICE REACHES 1.0880 (+30 Pips = +1.5R)
   Market prints a clean M15 Higher Low at 1.0865.
   ACTION: Move Stop Loss from 1.0830 up to 1.0850 (ENTRY PRICE / BREAKEVEN).
   RISK EXPOSURE = $0.00! TRADE IS NOW 100% RISK-FREE!

Phase 3 (T = 90 mins): PRICE BREAKS OUT TO 1.0920 (+70 Pips = +3.5R)
   Take 50% partial profit (+$3.50 banked).
   Trail remaining stop to 1.0880 (Lock in +$1.50 profit on the runner)!`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'Trader entered long at 1.2720; at 1.2765 (+45 pips), shifted stop to 1.2720 (BE).',
          setup: 'Surprise Bank of England rate rumor caused a sudden 60-pip flash crash.',
          outcome: 'Stopped out at 1.2720 for $0.00 loss. No capital lost. Account was 100% protected.',
          keyTakeaway: 'The Breakeven rule saves your trading career from unforeseen black swan market events.'
        },
        actionableChecklist: [
          'Set a mental rule: Once price reaches +1.5R, look for the nearest swing to move stop to BE.',
          'Never move stop loss to breakeven before price has created a new structural high/low.',
          'Celebrate a breakeven stop-out as a victory of capital protection.'
        ]
      },
      {
        id: 'rm-09',
        number: '09',
        title: 'Interactive Calculators Lab: Lot Sizer, RRR & Compounder',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Master the three interactive calculators built into this pillar: Lot Sizer, Risk-Reward Calculator, and 12-Month Compounder.',
        concept: 'This pillar features three working software calculators engineered in React. 1) The Lot Size Calculator translates your balance, risk %, and stop loss into exact MT4 lot sizes. 2) The Risk-to-Reward Calculator computes required win rates and payout targets. 3) The 12-Month Capital Growth Simulator demonstrates how compounding modest 8% monthly gains scales a $100 account into substantial funding.',
        bulletPoints: [
          'Lot Size Calculator: Inputs Balance, Risk $, and SL Pips -> outputs exact Micro/Mini Lots.',
          'Risk-Reward Calculator: Inputs Entry, SL, and TP -> computes exact RRR and required win rate.',
          'Compound Growth Simulator: Projects account equity over 12 months with disciplined risk management.',
          'Real Mathematics: Zero marketing hype; grounded in pure mathematical probability.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Compounding Power of Modest Returns',
          caption: 'Scaling $100 with Disciplined 8% Monthly Compounding',
          content: `Initial Capital: $100.00  │  Monthly Target: 8.0%  │  Risk / Trade: $2.00
Month 1:  $108.00         Month 7:  $171.38
Month 2:  $116.64         Month 8:  $185.09
Month 3:  $125.97         Month 9:  $199.90 (DOUBLED ACCOUNT!)
Month 4:  $136.05         Month 10: $215.89
Month 5:  $146.93         Month 11: $233.16
Month 6:  $158.69         Month 12: $251.82 (+151% ANNUAL RETURN!)

*Slow, steady compounding beats the boom-and-bust cycle every single time.*`
        },
        realWorldExample: {
          pair: 'Account Simulation',
          context: 'Trader used the Compound Simulator below to plan their 12-month funded trajectory.',
          setup: 'Committed to 8% monthly target instead of trying to make 100% in a week.',
          outcome: 'Avoided over-leveraging; passed an FTMO $50K challenge within 6 months.',
          keyTakeaway: 'Great traders think in years, not in days. Let compounding do the heavy lifting.'
        },
        actionableChecklist: [
          'Scroll down to the interactive calculators embedded below in this page.',
          'Input your real current account balance into the Lot Size Calculator.',
          'Experiment with the 12-Month Compound Growth Simulator to establish realistic monthly goals.'
        ]
      },
      {
        id: 'rm-10',
        number: '10',
        title: 'Capital Preservation Plan for a $100K Prop Firm Account',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'The exact risk management protocol required to manage and scale a six-figure $100,000 funded prop firm account.',
        concept: 'Managing a $100,000 funded prop firm account is completely different from trading a $50 personal account. On a $100K account, your risk per trade is not 2%—it is 0.25% to 0.50% ($250 to $500 per trade). With an overall drawdown limit of $10,000 (10%), risking $500 per trade gives you 20 consecutive losing trades of buffer. A single 1:3 winner delivers $1,500 in profit (approx 195,000 KES), creating life-changing income without endangering the account.',
        bulletPoints: [
          'The 0.5% Maximum Risk Cap: Never risk more than $500 per trade on a $100K account.',
          'The 1.5% Daily Loss Stop: If down -$1,500 in a day, trading is locked until tomorrow.',
          'Target Realism: A modest 4% to 6% monthly gain generates $4,000 to $6,000 in monthly payouts.',
          'Payout Distribution: Withdraw 80% of profits to your local bank or M-Pesa immediately; never leave profit buffer with the prop firm.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The $100K Funded Account Risk Blueprint',
          caption: 'Institutional Execution Parameters',
          content: `Funded Account Size: $100,000.00 USD
Maximum Permitted Overall Drawdown (10%): $10,000.00
Maximum Permitted Daily Drawdown (5%): $5,000.00

Operational Risk Parameters:
   • Risk Per Trade: 0.50% = $500.00 USD
   • Number of Consecutive Losses to Hit Max Drawdown: 20 Trades!
   • Daily Loss Circuit Breaker: 3 Losses = -$1,500.00 (Stop trading for the day!)
   
Monthly Outcome Projection (Conservative 50% Win Rate, 1:2.5 RRR):
   • 12 Trades Taken: 6 Wins (+$1,250 each = +$7,500), 6 Losses (-$500 each = -$3,000)
   • NET MONTHLY PROFIT: +$4,500.00 USD (approx 585,000 KES!)
   • 80% Trader Profit Split: +$3,600.00 USD PAID DIRECTLY TO YOU!`
        },
        realWorldExample: {
          pair: 'Funded Account',
          context: 'Trader passed a $100,000 prop firm challenge. Resisted the urge to use 5.00 standard lots.',
          setup: 'Stuck strictly to 0.5% risk ($500 / trade) using the lot calculator.',
          outcome: 'Maintained account for 14 consecutive months, taking out over $48,000 in verified payouts.',
          keyTakeaway: 'The goal is not to trade big; the goal is to trade consistently and withdraw real profits.'
        },
        actionableChecklist: [
          'If trading a prop account, lock your risk between 0.25% and 0.50% per trade.',
          'Establish your hard daily drawdown circuit breaker at 1.5% to 2.0%.',
          'Request withdrawals immediately on the first eligible payout date every month.'
        ]
      }
    ]
  },

  // ==========================================
  // PILLAR 6: /psychology — Trading Psychology & Discipline Masterclass
  // ==========================================
  {
    id: '/psychology',
    route: '/psychology',
    number: '06',
    title: 'Trading Psychology & Discipline Masterclass',
    subtitle: 'Neuroscience of Risk, Emotional Mastery & The Anti-Tilt Shield',
    oneLineHook: 'Eliminate FOMO, revenge trading, and emotional self-sabotage with working mindset tools and the 1-hour kill switch.',
    badge: 'Mindset Shield',
    category: 'Risk & Mindset',
    overview: 'Trading psychology is not motivational speaking; it is the neurological management of fear, greed, cortisol, and dopamine. This pillar teaches the psychological frameworks of elite institutional traders, breaks down the cognitive traps of revenge trading and FOMO, and includes an interactive Mindset Self-Assessment Quiz and a working 1-Hour Anti-Tilt Kill Switch.',
    learningOutcomes: [
      'Deconstruct the neurochemical loop of FOMO and cortisol-induced revenge trading',
      'Master the "Sniper Mindset": Waiting hours or days for your single verified setup',
      'Implement strict trading hours control to prevent boredom and screen fatigue',
      'Take the interactive Mindset Self-Assessment Quiz to diagnose psychological leaks',
      'Engage the 1-Hour Anti-Tilt Kill Switch to protect your account during emotional distress'
    ],
    lessons: [
      {
        id: 'psy-01',
        number: '01',
        title: 'The Neuroscience of Fear, Greed & Dopamine in Forex',
        levelTag: 'Beginner',
        duration: '18 mins',
        summary: 'How the human amygdala hijacks rational decision-making when money is on the line and how to rewire your brain.',
        concept: 'The human brain evolved to survive physical threats on the savannah, not to manage abstract probabilities in financial markets. When you face a floating loss, your amygdala releases cortisol and adrenaline, triggering a "Fight or Flight" response. In trading, "Fight" manifests as revenge trading and doubling lot sizes; "Flight" manifests as cutting winning trades prematurely out of panic. Professional trading requires engaging the prefrontal cortex to make calm, probabilistic decisions.',
        bulletPoints: [
          'The Amygdala Hijack: Emotional panic overrides rational prefrontal calculation in less than 200 milliseconds.',
          'Dopamine Addiction: The brain treats volatile green candles like a casino slot machine, seeking quick dopamine hits.',
          'Physiological Awareness: Recognize physical symptoms of tilt: shallow breathing, elevated heart rate, tense shoulders.',
          'The Reset Breath: Inhaling deeply for 4 seconds, holding for 4 seconds, and exhaling for 6 seconds instantly reduces cortisol.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Neurological Hijack in Retail Trading',
          caption: 'Amateur Emotional Loop vs Professional Process',
          content: `AMATEUR TRADER LOOP (Dopamine & Cortisol Driven):
   Sees green candle -> Dopamine Spike -> FOMO Buy at Peak!
       │
   Price reverses -> Cortisol Flood -> Panic & Anxiety!
       │
   Takes loss -> Rage / Pride Invalidation -> REVENGE TRADE! (ACCOUNT BLOWN)
   ────────────────────────────────────────────────────────────────────────
PROFESSIONAL TRADER LOOP (Prefrontal Cortex Driven):
   Sees green candle -> Checks Checklist: "Extended from 20 EMA, No Trade."
       │
   Market pulls back into Key Zone -> Executes predetermined $2 risk.
       │
   Outcome: Accepts win or loss with zero emotional shift. Outcome is probabilistic!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader felt a surge of excitement seeing a 30-pip candle breakout during news.',
          setup: 'Noticed elevated heart rate and shallow breathing; recognized the dopamine trap.',
          outcome: 'Took 3 deep reset breaths and waited. The candle instantly reversed 40 pips. Saved from a massive loss.',
          keyTakeaway: 'When your heart starts racing, step away from the computer immediately. Never trade on adrenaline.'
        },
        actionableChecklist: [
          'Notice your physical posture and breathing before clicking Buy or Sell.',
          'If you feel excitement or urgency, you are gambling, not trading.',
          'Use the 4-4-6 breathing exercise whenever an unexpected market move occurs.'
        ]
      },
      {
        id: 'psy-02',
        number: '02',
        title: 'Eliminating FOMO (Fear Of Missing Out)',
        levelTag: 'Beginner',
        duration: '16 mins',
        summary: 'Why chasing candles is financial suicide and how to develop the patience of an institutional market sniper.',
        concept: 'FOMO (Fear Of Missing Out) is the psychological delusion that an unexpected market move is the "last opportunity" you will ever have to make money. Retail traders see a fast green candle, panic that they are being left behind, and buy at the exact peak—directly into institutional sell orders. The reality of the $7.5 Trillion forex market is that high-probability setups occur every single day.',
        bulletPoints: [
          'The Endless Stream: The forex market produces clean trading setups every London and New York session.',
          'Chasing Equals Donating: Buying a market that has already moved 40 pips is donating capital to the traders who bought at the bottom.',
          'The Missing is Free: Missing a move costs you exactly $0.00. Chasing a move costs you your account.',
          'Celebration of Discipline: Celebrate missed moves that did not fit your plan as personal psychological triumphs.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Anatomy of a FOMO Buy Trap',
          caption: 'Where Retail Chasers Provide Institutional Liquidity',
          content: `                         [ PEAK: RETAIL FOMO TRAP ]
                                      ▲
                                     / \  <─── RETAIL BUYS HERE ("It's going to the moon!")
                                    /   \      INSTITUTIONS SELL TO THEM!
                                   /     \
                                  /       \
   Smart Money Entry             /         \
        ┌─┐                     /           \
        │ │                    /             \
        └─┘                   /               \
         ▲                   /                 ▼
   Institutional Buy ───────/                   SHARP CASCADE DOWN (-50 Pips!)
   at Key Support Level!                        Retail chasers stopped out!`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'GBP/USD surged 60 pips in 10 minutes on an unexpected news leak.',
          setup: 'Amateur jumped in at 1.2890; Professional let it go, noting no pullback occurred.',
          outcome: 'Market formed a Tower Top at 1.2895 and plummeted back to 1.2820. Amateur lost $14; Pro stayed safe.',
          keyTakeaway: 'Never chase a moving train. If you missed the station, wait for the next train.'
        },
        actionableChecklist: [
          'Repeat the mantra: "Missing a move costs me zero dollars; chasing costs me my capital."',
          'If price is more than 15 pips away from your planned entry, cancel the order.',
          'Take pride in watching a massive move happen without you if it did not meet your strict checklist.'
        ]
      },
      {
        id: 'psy-03',
        number: '03',
        title: 'Revenge Trading: Why Losses Turn Into Account Blowouts',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'How ego and the refusal to accept a loss triggers account-destroying revenge spirals, and how to stop them.',
        concept: 'Revenge trading occurs when a trader views a normal, probabilistic loss as a personal insult or failure of intelligence. Desperate to "get their money back" and prove the market wrong, the trader immediately opens another position with doubled lot size, completely abandoning their rules. Within 2 hours, a minor, manageable $2 loss spirals into a catastrophic 100% account blowout.',
        bulletPoints: [
          'Ego vs Probability: The market does not know who you are and has no personal vendetta against you.',
          'The Compounding Mistake: The only thing worse than a losing trade is making an undisciplined trade to fix it.',
          'The 15-Minute Rule: Never place a trade within 15 minutes of being stopped out on a loss.',
          'The Kill Switch Solution: If you feel angry after a loss, activate the 1-Hour Anti-Tilt Kill Switch below.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The Revenge Trading Death Spiral',
          caption: 'How a $2 Loss Turns into a $100 Blowout',
          content: `10:00 EAT: Trade 1 stopped out cleanly for -$2.00 (Normal 1R loss).
   │
   ▼ TRADER EGO INJURED: "The market cheated me! It wicked my stop!"
   │
10:04 EAT: Trade 2 opened immediately with 2x lot size (0.02 lot) -> -$4.00 Loss!
   │
   ▼ RAGE INTENSIFIES: Heart racing, face flushed, desperate to get back to zero!
   │
10:12 EAT: Trade 3 opened with 5x lot size (0.05 lot) without checking any rules!
   │
10:25 EAT: Spread widens during minor pullback -> -$25.00 Loss!
   │
10:30 EAT: All-in trade placed (0.20 lot) -> MARGIN CALL! ACCOUNT BLOWN!`
        },
        realWorldExample: {
          pair: 'USD/JPY',
          context: 'Trader took a legitimate -$2 loss on an invalid setup. Felt embarrassed in front of their trading peer.',
          setup: 'Immediately placed an oversized revenge short.',
          outcome: 'USD/JPY trended 80 pips higher. Blew 60% of account balance in 45 minutes.',
          keyTakeaway: 'Accept the loss immediately. A loss is simply the cost of doing business, like paying rent for a shop.'
        },
        actionableChecklist: [
          'Close your trading software for a minimum of 15 minutes after any stopped-out trade.',
          'Remind yourself that losses are statistically mandatory in any profitable trading system.',
          'Engage the 1-Hour Kill Switch button below whenever you feel the urge to revenge trade.'
        ]
      },
      {
        id: 'psy-04',
        number: '04',
        title: 'The "One Setup" Discipline: Waiting Like a Sniper',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'Why master traders master only ONE setup and ignore 95% of market noise to achieve extraordinary returns.',
        concept: 'Amateur traders suffer from "Strategy Hopping"—trying to trade scalps, breakouts, swings, harmonics, and news spikes all at once. Elite traders operate like military snipers. A sniper does not shoot at every bird that flies past; they lie in wait for hours for their single, high-value target. By mastering only ONE setup (such as the 20/50 EMA bounce or Tower Top reversal), your pattern recognition becomes flawless.',
        bulletPoints: [
          'Bruce Lee Principle: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times."',
          'Specialization Advantage: Knowing every nuance, failure mode, and fakeout of a single strategy.',
          'Filtering Noise: If your chosen setup is not present on the chart, THERE IS NO REASON TO TRADE.',
          'High Win-Rate Simplicity: Doing one simple thing repeatedly generates institutional wealth.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Machine Gunner vs The Sniper',
          caption: 'Overtrading vs Extreme Execution Discipline',
          content: `THE MACHINE GUNNER (Amateur Trader):
   • Trades 15 different pairs on 1-minute, 5-minute, and 15-minute charts.
   • Takes 25 trades a day. Pays massive broker spread fees.
   • Stressed, exhausted, confused. Account steadily declines.
   ────────────────────────────────────────────────────────────────────────
THE SNIPER (Professional Trader):
   • Trades only GBP/USD and EUR/USD on the M15 timeframe.
   • Trades only ONE setup: The 11:00 AM London Open Range Sweep.
   • Takes 1 to 2 trades per week. Zero emotional stress.
   • Banks 1:3 winners consistently. Passes funded challenges with ease!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader decided to stop trading breakouts, news, and indicators; committed solely to 20/50 EMA bounces.',
          setup: 'Took only 4 trades all week; 3 were clean 1:2.5 winners, 1 was a loss.',
          outcome: 'Finished the week +6.5R profit with only 45 minutes of total screen time.',
          keyTakeaway: 'Ruthlessly eliminate every setup that is not your core flagship edge. Quality over quantity.'
        },
        actionableChecklist: [
          'Choose ONE flagship setup from Pillar 3 (e.g. Tower Reversal or 20/50 EMA Bounce).',
          'Commit to trading ONLY that setup for the next 30 days.',
          'If your chosen setup does not appear today, shut down your computer with pride.'
        ]
      },
      {
        id: 'psy-05',
        number: '05',
        title: 'Trading Hours Control & Screen Addiction Defense',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Why sitting in front of charts for 8 hours destroys trading performance and how to restrict execution to peak hours.',
        concept: 'Financial trading is an intellectual and psychological performance discipline, similar to playing grandmaster chess. Cognitive decision-making power deteriorates rapidly after 90 to 120 minutes of continuous chart monitoring. When you sit in front of charts all day, your brain becomes bored and begins "hallucinating" setups that do not exist, leading to overtrading and catastrophic losses.',
        bulletPoints: [
          'Decision Fatigue: The quality of your trading decisions degrades with every hour spent staring at charts.',
          'The 2-Hour Window: Institutional traders execute primarily during the first 2 hours of London and New York opens.',
          'Strict Trading Schedule: 10:45 AM - 13:00 PM EAT (London), and 15:15 PM - 18:00 PM EAT (New York).',
          'Life Beyond Charts: Spend your remaining time studying, exercising, working, and living.'
        ],
        illustration: {
          type: 'table',
          title: 'The High-Performance Trader Daily Schedule',
          caption: 'Optimizing Cognitive Bandwidth in Nairobi Time (EAT)',
          content: `Time (EAT)       │ Activity                       │ Status
─────────────────┼────────────────────────────────┼─────────────────────────
08:00 - 09:00    │ Exercise, breakfast, mental prep│ Screen OFF
10:30 - 10:50    │ Daily Bias check & Asian Range │ Prep mode
11:00 - 13:00    │ LONDON OPEN EXECUTION WINDOW   │ HIGH FOCUS TRADING
13:00 - 15:15    │ Lunch, errands, day job, walk  │ SCREEN OFF (No trading!)
15:30 - 17:30    │ NY OVERLAP EXECUTION WINDOW    │ HIGH FOCUS TRADING
18:00 onwards    │ Journal trades, close terminal │ 100% OFF (Rest & Family)`
        },
        realWorldExample: {
          pair: 'All Pairs',
          context: 'Trader used to trade from 8:00 AM to 11:00 PM on their phone while working.',
          setup: 'Restricted trading strictly to 11:00 AM - 1:00 PM EAT.',
          outcome: 'Win rate jumped from 38% to 62% in 3 weeks. Anxiety evaporated.',
          keyTakeaway: 'The market is not paying you for overtime. Trade peak hours and step away.'
        },
        actionableChecklist: [
          'Set a strict calendar alarm: Trading allowed ONLY from 11:00 AM to 1:00 PM and 3:30 PM to 5:30 PM EAT.',
          'Delete trading apps from your phone if you cannot stop checking them during family dinners.',
          'Measure your performance based on adherence to your schedule.'
        ]
      },
      {
        id: 'psy-06',
        number: '06',
        title: 'Cognitive Biases: Anchoring, Recency & Sunk Cost Fallacy',
        levelTag: 'Advanced',
        duration: '18 mins',
        summary: 'Deconstruct the 3 primary mental blind spots that prevent retail traders from cutting losses and flipping bias.',
        concept: 'Cognitive biases are systematic errors in human thinking that distort objective reality. In forex, three biases are particularly lethal: 1) Anchoring Bias (fixating on an outdated price or opinion and refusing to acknowledge new market facts); 2) Recency Bias (believing that because your last 3 trades were winners or losers, the next trade will be the same); and 3) Sunk Cost Fallacy (holding a losing trade because you have already lost so much capital in it).',
        bulletPoints: [
          'Anchoring Bias: "EUR/USD was at 1.1000 yesterday, so 1.0850 is cheap!" (Price can easily drop to 1.0600).',
          'Recency Bias: Feeling invincible after 3 consecutive wins and increasing lot size right before a loss.',
          'Sunk Cost Fallacy: Refusing to close a -$40 loss because "it might come back," turning it into a -$100 blowout.',
          'Neutral Mindset: Every new trade has zero connection to the trade that preceded it.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Sunk Cost Fallacy Trap',
          caption: 'Why Retail Traders Refuse to Cut Losses',
          content: `Trade Enters: Long at 1.0850 (Planned Stop Loss was 1.0830)
   │
   ▼ Price drops to 1.0830 (-20 Pips = -$2.00 planned loss)
   │
   ├──► PROFESSIONAL ACTION: Cut trade immediately at 1.0830. Loss is -$2.00. Done!
   │
   └──► SUNK COST TRAP: "I'm already down -$2.00, if I close now it's real! Let me hold!"
        │
        ▼ Price drops to 1.0790 (-60 Pips = -$6.00 loss)
        "I can't close now, I've lost too much! I will wait for breakeven!"
        │
        ▼ Price collapses to 1.0720 (-130 Pips) -> ACCOUNT LIQUIDATED!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader held a short position through 3 bullish market structure breaks because they were "anchored" to a bearish bias.',
          setup: 'Ignored the clear H4 CHOCH reversal.',
          outcome: 'Suffered a 90-pip loss instead of cutting at the original 20-pip invalidation.',
          keyTakeaway: 'When the facts change, change your mind. Never marry a directional bias.'
        },
        actionableChecklist: [
          'Ask yourself: "If I had no open position right now, would I buy or sell at this current price?"',
          'If the answer contradicts your open trade, close the trade immediately.',
          'Treat each trade as an independent event with zero memory of past outcomes.'
        ]
      },
      {
        id: 'psy-07',
        number: '07',
        title: 'Probabilistic Thinking: Mark Douglas’s 5 Fundamental Truths',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'Internalize the core principles of "Trading in the Zone": Trading as an exercise in probability, not prediction.',
        concept: 'In his landmark work "Trading in the Zone", Mark Douglas demonstrated that consistency in trading is not achieved by analyzing the market better, but by thinking in probabilities. You do not need to know what is going to happen next in order to make money. Anything can happen. Every moment in the market is unique. Once you accept this completely, fear disappears.',
        bulletPoints: [
          'Truth 1: Anything can happen at any moment.',
          'Truth 2: You do not need to know what is going to happen next in order to make money.',
          'Truth 3: There is a random distribution between wins and losses for any given set of variables that define an edge.',
          'Truth 4: An edge is nothing more than an indication of a higher probability of one thing happening over another.',
          'Truth 5: Every moment in the market is unique.'
        ],
        illustration: {
          type: 'steplist',
          title: 'Mark Douglas’s 5 Fundamental Truths',
          caption: 'The Cornerstone of Institutional Mindset',
          content: `1. ANYTHING CAN HAPPEN: A rogue headline or institutional block order can hit at any microsecond.
2. YOU DON'T NEED TO KNOW THE FUTURE: A casino owner doesn't know who will win next; they know over 10,000 spins, the house edge wins.
3. RANDOM DISTRIBUTION: You can have a 60% edge, but your next 4 trades might all be losses.
4. AN EDGE IS ONLY HIGHER PROBABILITY: It is not a certainty or guarantee.
5. EVERY MOMENT IS UNIQUE: No two market situations have the exact same participants.`
        },
        realWorldExample: {
          pair: 'All Markets',
          context: 'Trader executed 20 trades with a 50% edge. First 4 trades were consecutive losses.',
          setup: 'Because they understood probabilistic distribution, they did not alter their strategy or lot size.',
          outcome: 'The next 6 trades yielded 5 wins (+$15.00 net gain). Concluded the 20 trades in solid profit.',
          keyTakeaway: 'Think in batches of 20 to 50 trades, never judge your edge by the outcome of a single trade.'
        },
        actionableChecklist: [
          'Print Mark Douglas’s 5 Fundamental Truths and tape them beside your computer monitor.',
          'Commit to evaluating your trading system only in batches of 25 trades.',
          'Never change your trading rules in the middle of a sample series.'
        ]
      },
      {
        id: 'psy-08',
        number: '08',
        title: 'Navigating Inevitable Losing Streaks Without Panic',
        levelTag: 'Advanced',
        duration: '18 mins',
        summary: 'How to survive the psychological test of 5 to 7 consecutive losses without self-doubt or strategy switching.',
        concept: 'Even with a pristine 60% win-rate strategy, probability math dictates that you have a 99% chance of experiencing a 5-trade losing streak and a 60% chance of experiencing a 7-trade losing streak over any 200-trade period. When amateurs hit a losing streak, they abandon their strategy and search for a new indicator. Professionals recognize losing streaks as standard statistical variance and continue executing flawlessly.',
        bulletPoints: [
          'Statistical Clustering: Wins and losses do not alternate evenly (Win, Loss, Win, Loss); they cluster in streaks.',
          'The Strategy-Hopping Trap: Abandoning a verified edge during a temporary variance drawdown resets your learning curve to zero.',
          'Halving Risk: During an active 3-trade losing streak, cut your lot size in half (0.5% risk) until you score a winner.',
          'Review Execution Quality: Did you lose because the market was random, or because you broke your checklist?'
        ],
        illustration: {
          type: 'diagram',
          title: 'Statistical Variance & Winning/Losing Clusters',
          caption: '20 Trades with a 60% Win Rate',
          content: `Actual Real-World Sequence of 20 Trades (12 Wins, 8 Losses = 60% Win Rate):
   
   [ L ] [ L ] [ L ] [ L ] [ L ] ──► 5 CONSECUTIVE LOSSES!
   Amateurs panic, change indicators, switch strategies, and blow accounts!
   
   [ W ] [ W ] [ W ] ─────────────► 3 Consecutive Wins!
   [ L ] [ W ] [ L ] [ W ] [ W ] ──► Normal variance
   [ W ] [ W ] [ W ] [ W ] ───────► 4 Consecutive Wins!
   [ L ]
   
   TOTAL OUTCOME: 12 Wins, 8 Losses. Account grew +16R!
   The amateur quit during the 5-loss cluster and missed the 16R profit!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader suffered 4 consecutive losses on Tuesday and Wednesday.',
          setup: 'Maintained $2 risk rule, audited checklist, found execution was 100% compliant with rules.',
          outcome: 'On Thursday and Friday, caught three 1:3 winners, ending the week +$10.00 in net profit.',
          keyTakeaway: 'Do not fear losing streaks. Manage risk so losing streaks cannot harm you.'
        },
        actionableChecklist: [
          'If you lose 3 trades in a row, reduce your risk to 0.5% for the next 2 trades.',
          'Audit your journal to confirm whether the losses were market variance or rule violations.',
          'Never alter your strategy parameters during an active drawdown.'
        ]
      },
      {
        id: 'psy-09',
        number: '09',
        title: 'Emotional Journaling & Pre-Trade State Scoring',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Log your emotional state (1-10 Calmness Scale) before every trade to discover your personal psychological patterns.',
        concept: 'Most traders only journal price numbers: Entry, Stop Loss, and Exit. But trading performance is primarily governed by emotional state. By logging your "Pre-Trade Mental State" on a scale from 1 (Distracted/Agitated) to 10 (Completely Calm/Focused), you will discover an undeniable pattern: 90% of your losing trades occur when your emotional score is below 6.',
        bulletPoints: [
          'Pre-Trade Mental State Rating: Rate your calmness and focus from 1 to 10 before clicking Buy or Sell.',
          'The Emotional Threshold Rule: If your mental state is below 7, YOU ARE PROHIBITED FROM TRADING.',
          'Logging External Triggers: Record arguments, poor sleep, hunger, financial stress, or social media distractions.',
          'Self-Awareness Calibration: The master trader knows their psychological blind spots as well as their charts.'
        ],
        illustration: {
          type: 'table',
          title: 'The Emotional Pre-Trade Diagnostic Scale',
          caption: 'Log This in Your Trade Journal Before Entry',
          content: `Score │ Emotional Description            │ Operational Permission
──────┼──────────────────────────────────┼────────────────────────────────────
1 - 4 │ Angry, Tired, Rushing, Distracted│ PROHIBITED! Close terminal immediately!
5 - 6 │ Anxious, Hesitant, Needing Money │ PROHIBITED! Go for a walk outside.
7 - 8 │ Calm, Patient, Neutral           │ PERMITTED to trade standard $2 risk.
9 - 10│ Completely Focused, Detached     │ OPTIMAL EXECUTION STATE!`
        },
        realWorldExample: {
          pair: 'Personal Journal',
          context: 'Trader analyzed 50 historical trades logged with emotional state ratings.',
          setup: 'Trades taken at score 8-10 had a 68% win rate. Trades taken at score 4-6 had an 18% win rate.',
          outcome: 'Instituted a rule: Never trade with emotional score below 7. Profitability surged immediately.',
          keyTakeaway: 'You cannot trade well if you are not feeling well. Manage your state before your capital.'
        },
        actionableChecklist: [
          'Rate your calmness and focus from 1 to 10 before every trade.',
          'If your rating is 6 or below, do not open MetaTrader.',
          'Log your emotional state in the Pillar 8 Trade Logger component below.'
        ]
      },
      {
        id: 'psy-10',
        number: '10',
        title: 'Working Tool: Interactive Mindset Quiz & 1-Hour Kill Switch',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Diagnose your psychological leaks with the built-in Mindset Quiz and test the 1-Hour Anti-Tilt Kill Switch.',
        concept: 'This pillar concludes with two working software tools built into the page: 1) The Interactive Mindset Self-Assessment Quiz, which scores your vulnerability to FOMO, revenge trading, and risk discipline; and 2) The 1-Hour Anti-Tilt Kill Switch. Engaging the Kill Switch locks your platform state for 60 minutes, displaying a countdown timer and enforcing a mandatory cool-off period.',
        bulletPoints: [
          'Mindset Assessment Quiz: 10 diagnostic questions with instant scoring and tailored corrective advice.',
          '1-Hour Kill Switch: Engages an active browser lockout timer to prevent revenge trading.',
          'Cool-Down Protocol: Step away from the screen, drink water, take a walk in Gilgil, and breathe.',
          'Psychological Shield: The ultimate line of defense between an emotional impulse and your capital.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The Anti-Tilt Kill Switch Protocol',
          caption: 'Enforcing Mandatory Cool-Downs',
          content: `Step 1: You experience an emotional trigger (bad loss, platform slip, anger)
Step 2: Click the red 'Engage 1-Hour Kill Switch' button below
Step 3: Platform activates a 60-minute countdown timer locked in localStorage
Step 4: High-risk trading actions are locked until the timer expires
Step 5: Return after 60 minutes with a restored, calm prefrontal cortex!`
        },
        realWorldExample: {
          pair: 'Live Trading',
          context: 'Trader lost $4 on a frustrating news slippage. Felt intense urge to double lot size.',
          setup: 'Hit the 1-Hour Kill Switch button below.',
          outcome: 'Timer locked them out. By the time 60 minutes elapsed, emotional anger had faded. Account was saved.',
          keyTakeaway: 'Technology can protect you from yourself when discipline temporarily wavers.'
        },
        actionableChecklist: [
          'Take the 10-question Mindset Quiz below to identify your primary emotional leaks.',
          'Test the 1-Hour Kill Switch button to understand how the lockout timer works.',
          'Use the Kill Switch whenever you experience 2 consecutive losing trades.'
        ]
      }
    ]
  },

  // ==========================================
  // PILLAR 7: /live-pulse — Live Market Pulse Masterclass
  // ==========================================
  {
    id: '/live-pulse',
    route: '/live-pulse',
    number: '07',
    title: 'Live Market Pulse Masterclass',
    subtitle: 'Intermarket Macro Flows, DXY Correlation & Daily Bias Architecture',
    oneLineHook: 'Construct institutional daily directional bias, decode US Dollar Index flows, and prepare for high-impact news.',
    badge: 'Macro Pulse',
    category: 'Institutional',
    overview: 'Trading without a macro daily directional bias is like sailing without a compass. This masterclass teaches you how institutional desks build their daily bias every morning using the US Dollar Index (DXY), 10-Year US Treasury Yields, and economic calendars. Includes interactive working tools: The Daily Bias Builder Generator and the Weekly Outlook Planner.',
    learningOutcomes: [
      'Build a rock-solid Daily Directional Bias before the London open every morning',
      'Analyze the US Dollar Index (DXY) as the primary macro compass for all currency pairs',
      'Correlate US 10-Year Treasury Yields with USD/JPY and Gold (XAU/USD)',
      'Navigate high-impact economic news (NFP, CPI, FOMC) without gambling',
      'Generate professional daily bias reports using the built-in generator tool'
    ],
    lessons: [
      {
        id: 'lp-01',
        number: '01',
        title: 'Developing a Daily Directional Bias',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'How to determine whether today is a Buy Day, a Sell Day, or a Sit-on-Hands Day before 10:00 AM EAT.',
        concept: 'Daily Directional Bias is your overarching hypothesis regarding which side of the market holds the highest probability of institutional expansion today. You do not wake up and decide whether to buy or sell on the 5-minute chart. You determine your bias on the Daily and H4 charts by asking three core questions: 1) What is the Daily market structure? 2) Where is the nearest uncollected liquidity pool? 3) Is price currently in a Premium or Discount zone?',
        bulletPoints: [
          'The Daily Candle Narrative: Where is the Daily candle’s wick likely to form, and where will its body expand?',
          'The Draw on Liquidity (DOL): Every market is constantly reaching for the next resting liquidity pool (previous highs/lows).',
          'Single-Direction Discipline: If your Daily Bias is Bullish, YOU ONLY TAKE BUY TRADES. Completely ignore sell signals.',
          'Invalidation Check: If the market breaks the previous day’s low, your bullish bias is canceled for the day.'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Daily Candle Formation Lifecycle',
          caption: 'How a Daily Bullish Candle Expands',
          content: `A Typical Bullish Daily Candle Forms in 3 Stages:
   
   1. The Open (Asian Session / 00:00 - 08:00 EAT):
      Opens at 1.0850.
      
   2. The Manipulation Wick Low (London Open / 11:00 EAT):
      Price dips DOWN to 1.0830 to sweep sell liquidity and create the daily LOW wick!
      *THIS IS WHERE WE BUY AT WHOLESALE DISCOUNT!*
      
   3. The Real Expansion (London / NY Overlap / 15:30 EAT):
      Price expands aggressively higher to 1.0920!
      
   4. The Close (NY Close / 23:00 EAT):
      Slight pullback to close at 1.0905, leaving a solid green daily body!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Daily chart was trending up; previous day high was 1.0880 (the Draw on Liquidity).',
          setup: 'Established Bullish Daily Bias at 08:00 EAT. Refused to take any short scalps.',
          outcome: 'Bought the London open dip at 1.0835; price expanded 65 pips to target the 1.0880 daily high.',
          keyTakeaway: 'When your daily bias is correct, lower timeframe execution becomes effortless.'
        },
        actionableChecklist: [
          'Answer: "Where is the Draw on Liquidity on the Daily chart today?"',
          'Commit to only ONE trading direction (Long OR Short) for the entire day.',
          'Use the Daily Bias Builder tool below to generate your morning briefing.'
        ]
      },
      {
        id: 'lp-02',
        number: '02',
        title: 'The US Dollar Index (DXY): The Anchor of All FX',
        levelTag: 'Intermediate',
        duration: '20 mins',
        summary: 'Why tracking DXY on TradingView is mandatory: The inverse mirror of EUR/USD, GBP/USD, and Gold.',
        concept: 'The US Dollar Index (DXY) measures the value of the USD against a basket of 6 major global currencies, with the Euro carrying a dominant 57.6% weighting. Because the USD is on the quote side of EUR/USD and GBP/USD, the relationship is inversely correlated. If DXY is breaking down below a key support level, EUR/USD and GBP/USD are mathematically primed for bullish expansion.',
        bulletPoints: [
          'DXY Basket Weightings: Euro (57.6%), Japanese Yen (13.6%), British Pound (11.9%), Canadian Dollar (9.1%).',
          'Inverse Mirror: DXY rallying = EUR/USD falling; DXY falling = EUR/USD rallying.',
          'DXY Divergence (SMT): When DXY makes a new High but EUR/USD fails to make a new Low, an institutional reversal is imminent.',
          'TradingView Ticker: Keep "DXY" pinned at the very top of your watchlist.'
        ],
        illustration: {
          type: 'chart',
          title: 'DXY vs EUR/USD Inverse Mirror Architecture',
          caption: 'How the US Dollar Index Guides Forex Trades',
          content: `US DOLLAR INDEX (DXY):
   105.50 ──► Reaches Major Resistance -> Rejects and Crashes Down!
              \
               \  DXY DUMPING AGGRESSIVELY!
                \
   104.80 ───────▼
  ═══════════════════════════════════════════════════════════════════
EUR/USD CURRENCY PAIR (INVERSE REACTION):
   1.0920 ───────▲
                /  EUR/USD ROCKETS HIGHER! (+70 Pips)
               /
   1.0850 ──► Reaches Major Support -> Bounces and Expands Upward!`
        },
        realWorldExample: {
          pair: 'EUR/USD & DXY',
          context: 'EUR/USD was hovering near 1.0840 support. Trader checked DXY chart.',
          setup: 'DXY was testing 105.80 major H4 resistance with bearish RSI divergence.',
          outcome: 'DXY dumped 40 points; EUR/USD simultaneously exploded +55 pips higher.',
          keyTakeaway: 'Always consult DXY before entering any USD-paired currency trade.'
        },
        actionableChecklist: [
          'Add "DXY" to your TradingView favorites watchlist.',
          'Check DXY market structure before finalizing your EUR/USD or GBP/USD daily bias.',
          'If DXY is consolidating in a tight chop range, expect major currency pairs to chop similarly.'
        ]
      },
      {
        id: 'lp-03',
        number: '03',
        title: 'US 10-Year Treasury Yields (US10Y) & USD/JPY & Gold',
        levelTag: 'Advanced',
        duration: '18 mins',
        summary: 'How bond market yields drive interest rate differentials, powering moves in USD/JPY and Gold (XAU/USD).',
        concept: 'Government bond yields represent the return investors demand to lend money to the US government. When US 10-Year Treasury Yields (ticker: US10Y) rise, institutional capital flows aggressively into the US Dollar to capture higher yield returns. This causes USD/JPY to rally strongly (due to Japan’s low interest rates) and causes Gold (XAU/USD) to drop (because Gold yields zero interest).',
        bulletPoints: [
          'US10Y and USD/JPY: Positive correlation (+80%). Rising yields = Rising USD/JPY.',
          'US10Y and Gold (XAU/USD): Strong negative correlation (-75%). Rising yields = Falling Gold.',
          'Yield Spreads: The difference in yield between US Treasuries and foreign bonds drives macro currency flows.',
          'TradingView Ticker: Watch "US10Y" on the H4 chart to anticipate multi-day Gold swings.'
        ],
        illustration: {
          type: 'table',
          title: 'US 10-Year Treasury Yield Intermarket Matrix',
          caption: 'Predicting USD/JPY & Gold Direction via Yields',
          content: `Yield Movement │ USD/JPY Reaction │ Gold (XAU/USD) Reaction │ Institutional Driver
───────────────┼──────────────────┼────────────────────────┼───────────────────────────
US10Y Surging  │ Aggressive RALLY │ Aggressive DROP        │ Capital seeks high USD yield
US10Y Dumping  │ Aggressive DROP  │ Aggressive RALLY       │ Capital flees USD into Gold
US10Y Flat     │ Range / Chop     │ Range / Chop           │ Market waiting for Fed policy`
        },
        realWorldExample: {
          pair: 'USD/JPY & US10Y',
          context: 'US 10-Year Yield broke above 4.50% resistance on strong US labor data.',
          setup: 'Trader bought USD/JPY at 155.20 with SL at 154.80.',
          outcome: 'Yields climbed to 4.58%; USD/JPY surged to 156.80 (+160 pips).',
          keyTakeaway: 'Bond yields are the smart money compass of global currency markets.'
        },
        actionableChecklist: [
          'Add "US10Y" to your TradingView chart layout when trading USD/JPY or Gold.',
          'Check if 10-Year yields are breaking key technical levels before shorting USD/JPY.',
          'Never buy Gold when US10Y is in an aggressive vertical breakout.'
        ]
      },
      {
        id: 'lp-04',
        number: '04',
        title: 'High-Impact Economic News: CPI, NFP & Interest Rates',
        levelTag: 'Intermediate',
        duration: '20 mins',
        summary: 'Deconstruct the ForexFactory economic calendar: Trading the aftermath of Red Folder news events without gambling.',
        concept: 'High-impact economic reports (labeled Red Folders on ForexFactory) inject massive volatility into the market. The big three releases are: 1) Consumer Price Index (CPI / Inflation); 2) Non-Farm Payrolls (NFP / US Employment); and 3) FOMC Federal Reserve Interest Rate Decisions. Amateur traders gamble on the release number; professional traders wait 10 to 15 minutes for the initial volatility spike to sweep liquidity, and then trade the confirmed technical aftermath.',
        bulletPoints: [
          'The 3 Red Folder Kings: US CPI (Inflation), NFP (1st Friday of month), FOMC (Fed rates).',
          'The Slippage Hazard: During the exact second of a news release, broker spreads widen from 1 pip to 25+ pips.',
          'The Aftermath Protocol: Do NOT trade at 15:30:00 EAT. Wait until 15:45 EAT for liquidity to stabilize.',
          'Deviation Rule: If actual data deviates significantly from consensus forecast, a sustained trend ensues.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The News Aftermath Trading Protocol',
          caption: 'How Professionals Trade High-Impact News Safely',
          content: `15:25 EAT: Check ForexFactory.com -> US CPI releasing at 15:30 EAT (Red Folder)
15:28 EAT: CANCEL ALL PENDING ORDERS! Do not gamble on the release!
15:30 EAT: CPI RELEASED!
   └── Giant 60-pip spike in both directions. Spreads widen to 18 pips.
   └── Amateurs who guessed get stopped out or slippage-liquidated!
15:42 EAT (12 Mins Later): Spreads return to normal 1.2 pips.
   └── Price has swept the Daily High and closed with a massive H1 Bearish Pinbar.
   └── ENTER SHORT WITH MINIMAL SPREAD & CONFIRMED DIRECTION!
   └── Ride the post-news trend for +70 pips with ZERO GAMBLING RISK!`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'US CPI released higher than expected (4.1% vs 3.8% forecast).',
          setup: 'Initial spike wicked up 20 pips, then collapsed 110 pips over the next 3 hours.',
          outcome: 'Trader who waited 15 minutes caught 65 pips on the clean downward continuation.',
          keyTakeaway: 'Let the gamblers provide the initial liquidity spike. Trade the institutional trend that follows.'
        },
        actionableChecklist: [
          'Visit ForexFactory.com every Monday morning and record all Red Folder news events.',
          'Never open a new position within 10 minutes before a high-impact US release.',
          'Wait for the M15 candle following the news to close before executing.'
        ]
      },
      {
        id: 'lp-05',
        number: '05',
        title: 'Building a Professional Weekly Market Preparation Routine',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'The Sunday evening blueprint: Mapping macro key levels, news catalysts, and watchlist pairs for the week ahead.',
        concept: 'The week is won or lost before Monday morning. Professional traders dedicate 60 to 90 minutes every Sunday evening to conduct a thorough Weekly Market Preparation. They review the economic calendar, mark weekly and daily key levels on their core 3 pairs, identify where liquidity pools are resting, and write out their "If/Then" execution scenarios.',
        bulletPoints: [
          'The Sunday Ritual: 60 minutes of uninterrupted analysis before markets open in Sydney.',
          'Weekly Highs & Lows: Mark last week’s high and low on EUR/USD, GBP/USD, and Gold.',
          'Economic Catalyst Mapping: Note which days hold Red Folder news events to plan your high-risk days.',
          'If/Then Scenarios: "IF price sweeps 1.2850 and rejects, THEN I look for shorts. IF price closes above, I wait."'
        ],
        illustration: {
          type: 'steplist',
          title: 'The 5-Step Sunday Preparation Workflow',
          caption: 'Institutional Weekly Setup Checklist',
          content: `Step 1 (ForexFactory): Identify all Red Folder events for the upcoming week.
Step 2 (DXY Weekly Chart): Determine whether the US Dollar Index is bullish or bearish.
Step 3 (Mark Key Levels): Draw Horizontal Rays on Last Week's High and Last Week's Low.
Step 4 (Pair Selection): Choose the 2 cleanest pairs to focus on (e.g. EUR/USD and GBP/USD).
Step 5 (Write Scenarios): Draft written If/Then trade plans in your Weekly Outlook template.`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'Sunday prep identified Last Week High at 1.2820 as key liquidity target, with UK CPI on Wednesday.',
          setup: 'Planned: Wait for Wednesday CPI to sweep 1.2820, then look for London reversal.',
          outcome: 'Plan played out to the pip on Wednesday. Trader made +85 pips with zero stress or guesswork.',
          keyTakeaway: 'Failing to prepare is preparing to fail. A written weekly plan eliminates emotional improvisation.'
        },
        actionableChecklist: [
          'Set a calendar recurring event every Sunday at 18:00 EAT for Weekly Prep.',
          'Mark Last Week High (LWH) and Last Week Low (LWL) on your charts.',
          'Use the Weekly Outlook Planner component embedded below to log your plans.'
        ]
      },
      {
        id: 'lp-06',
        number: '06',
        title: 'Daily Bias Builder Generator & Template',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Operational guide for the built-in Daily Bias Builder tool: synthesizing HTF structure and generating actionable trade cards.',
        concept: 'To ensure you never trade without a written plan, this pillar features a built-in Daily Bias Builder Generator. By selecting your primary pair, HTF trend direction, DXY status, news folder presence, and target liquidity pool, the component automatically generates a structured, printable Daily Briefing Card with invalidation levels.',
        bulletPoints: [
          'Interactive Input Fields: Select Pair, Timeframe, Trend, DXY State, and Key News.',
          'Automated Bias Verdict: Outputs BULLISH EXPANSION, BEARISH RETRACEMENT, or RANGE WAIT.',
          'Invalidation Parameters: Automatically highlights where your bias is proven wrong.',
          'Export & Save: Copy or download the generated briefing directly into your morning notes.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Daily Bias Builder Output Card',
          caption: 'Generated Morning Briefing Component',
          content: `=====================================================
PIVOTFX LAB — DAILY DIRECTIONAL BRIEFING
Date: Monday Session  │  Time: 08:30 EAT
Pair: EUR/USD         │  Operational Bias: BULLISH EXPANSION
=====================================================
• DXY Alignment: Bearish (Testing 105.80 H4 Resistance)
• Macro Target (DOL): Yesterday's High at 1.0885
• Planned Execution: Wait for London Open (11:00 EAT) dip into 20 EMA
• Invalidation Floor: 1.0820 (If broken, bias turns neutral)
• Maximum Risk: $2.00 (The Gilgil Survival Rule)
=====================================================`
        },
        realWorldExample: {
          pair: 'EUR/USD',
          context: 'Trader generated the daily briefing card above at 08:30 EAT.',
          setup: 'Kept the card open beside TradingView throughout the morning.',
          outcome: 'Followed the exact plan; bought the London dip at 1.0838 and exited at the 1.0885 target.',
          keyTakeaway: 'A written pre-trade briefing acts as an institutional contract between you and your discipline.'
        },
        actionableChecklist: [
          'Scroll down to the Daily Bias Builder tool below.',
          'Generate your daily briefing card before 10:00 AM EAT every morning.',
          'Review your invalidation level before placing any orders.'
        ]
      },
      {
        id: 'lp-07',
        number: '07',
        title: 'Session Characteristics: Asian Range vs London Open vs NY Overlap',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'Deep-dive behavioral anatomy of each 4-hour trading session and how volatility shifts throughout the day.',
        concept: 'Each trading session has its own unique institutional personality. The Asian Session (Tokyo) is characterized by mean-reverting algorithms and low volatility, creating liquidity boundaries. The London Session is aggressive, manipulative, and explosive, accounting for the highest frequency of trend reversals. The New York Overlap provides the heavy volume continuation that carries prices to their daily targets.',
        bulletPoints: [
          'Asian Session (03:00 - 10:00 EAT): Range accumulation; average range only 20-30 pips.',
          'London Open (11:00 - 14:00 EAT): Aggressive expansion; sweeps Asian highs/lows; sets daily high or low in 70% of days.',
          'New York Overlap (15:30 - 19:30 EAT): Massive interbank volume; ideal for taking quick profits on London continuation.',
          'New York Close (21:00 - 23:00 EAT): Momentum dies; profit-taking causes minor retracements.'
        ],
        illustration: {
          type: 'table',
          title: 'Trading Session Playbook Matrix',
          caption: 'Strategy Selection by Operational Session',
          content: `Session       │ Nairobi Time (EAT)│ Best Strategy Model      │ Pairs to Trade
──────────────┼───────────────────┼──────────────────────────┼─────────────────────
Asian         │ 03:00 - 10:00 EAT │ Range Boundary Mapping   │ USD/JPY, AUD/USD
London Open   │ 11:00 - 14:00 EAT │ Judas Sweeps, EMA Bounce │ GBP/USD, EUR/USD
London/NY     │ 15:30 - 19:30 EAT │ Trend Continuation, News │ All Majors + Gold
Asian Rollover│ 23:00 - 01:00 EAT │ DO NOT TRADE (Spread tax)│ None`
        },
        realWorldExample: {
          pair: 'GBP/USD',
          context: 'Trader wanted to trade a breakout at 22:00 EAT (New York late afternoon).',
          setup: 'Entered trade; volume evaporated, spread widened by 2 pips, price remained frozen.',
          outcome: 'Paid overnight swap fee and took a frustrating scratch loss. Learned to trade only peak hours.',
          keyTakeaway: 'Trade when the big money is at their desks. Rest when the market goes to sleep.'
        },
        actionableChecklist: [
          'Align your trading execution strictly with the London (11:00) and NY (15:30) openings.',
          'Never execute new day trades after 19:30 EAT.',
          'Observe how the 11:00 AM London open creates the high or low of the day.'
        ]
      },
      {
        id: 'lp-08',
        number: '08',
        title: 'Intermarket Confluence: S&P 500, Crude Oil & Sentiment',
        levelTag: 'Advanced',
        duration: '18 mins',
        summary: 'Risk-On vs Risk-Off market regimes: How equity markets (S&P 500) and commodities drive foreign exchange flows.',
        concept: 'Currencies are deeply influenced by broader global risk sentiment. In a "Risk-On" environment (equities and commodities rallying), investors sell safe-haven currencies (USD, JPY, CHF) and buy higher-yielding growth currencies (AUD, NZD, GBP). In a "Risk-Off" environment (equities plunging or geopolitical conflict), capital rushes into the safe-haven US Dollar and Swiss Franc.',
        bulletPoints: [
          'Risk-On Currencies: Australian Dollar (AUD), New Zealand Dollar (NZD), British Pound (GBP).',
          'Safe-Haven Currencies: US Dollar (USD), Swiss Franc (CHF), Japanese Yen (JPY).',
          'S&P 500 (US500) Barometer: S&P rallying = Risk-On (Bullish for EUR, GBP, AUD against USD).',
          'Crude Oil & Canadian Dollar: Strong positive correlation (+80%) between WTI Crude Oil and CAD.'
        ],
        illustration: {
          type: 'table',
          title: 'Risk-On vs Risk-Off Market Regimes',
          caption: 'Global Sentiment Directional Blueprint',
          content: `Market Regime │ S&P 500 (Equities) │ Safe-Havens (USD/CHF) │ High-Beta FX (AUD/GBP)
──────────────┼────────────────────┼───────────────────────┼────────────────────────
RISK-ON       │ Surging Higher     │ Dumping / Weak        │ Surging Higher
RISK-OFF      │ Plunging Lower     │ RUSH TO SAFETY (BUY)  │ Dumping / Weak
NEUTRAL       │ Sideways / Choppy  │ Mixed                 │ Mixed`
        },
        realWorldExample: {
          pair: 'AUD/USD & S&P 500',
          context: 'S&P 500 futures opened +1.5% higher on strong tech earnings during pre-market.',
          setup: 'Trader bought AUD/USD at 0.6550 anticipating strong Risk-On sentiment.',
          outcome: 'AUD/USD rallied 55 pips in tandem with global equities.',
          keyTakeaway: 'Understanding global sentiment confirms whether your currency pair has macro wind at its back.'
        },
        actionableChecklist: [
          'Check S&P 500 futures (ES1!) every morning before London open.',
          'Identify whether the day is starting in a Risk-On or Risk-Off environment.',
          'Never buy commodity currencies (AUD, NZD, CAD) during an aggressive global stock market crash.'
        ]
      },
      {
        id: 'lp-09',
        number: '09',
        title: 'The End-of-Day Market Debrief Protocol',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'How professional traders conduct a 15-minute daily debrief to grade execution and extract market lessons.',
        concept: 'Your trading day does not end when your last position closes. Elite performance in any domain requires deliberate reflection. An End-of-Day Market Debrief takes only 15 minutes: 1) Did the market expand toward my predicted Draw on Liquidity? 2) Did I follow my risk management rules? 3) What could I have done better? 4) Grade your execution discipline from A to F.',
        bulletPoints: [
          'Execution Grade vs PnL: Grade yourself on RULE ADHERENCE, never on whether you won or lost money.',
          'An "A" Loss: You followed every rule, took your $2 stop loss calmly. An "A" execution grade!',
          'An "F" Win: You gambled 5x lot size, broke your rules, and got lucky. An "F" execution grade!',
          'Continuous Calibration: Small daily improvements compound into world-class trading competence.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The 15-Minute Daily Debrief Checklist',
          caption: 'End-of-Day Review Protocol',
          content: `18:30 EAT: Open your Trade Journal
[ ] 1. Screenshot the final Daily candle of your primary pair
[ ] 2. Compare the real market outcome with your morning Daily Bias card
[ ] 3. Log your trades in the Pillar 8 Trade Logger with final PnL and notes
[ ] 4. Assign your daily Execution Grade:
       • Grade A: 100% rule compliance (Took verified setups, respected $2 rule)
       • Grade B: Minor hesitation or late entry, but risk was respected
       • Grade C: Broke a minor rule (overtraded or traded during chop)
       • Grade F: Revenge traded, moved stop loss, or over-leveraged!
[ ] 5. Close all charts and disengage from markets for the evening.`
        },
        realWorldExample: {
          pair: 'Journal Review',
          context: 'Trader took 1 trade, lost $2.00, but followed every single rule flawlessly.',
          setup: 'Assigned himself an "A" Grade for the day.',
          outcome: 'Felt proud and confident instead of depressed. Maintained positive psychological momentum.',
          keyTakeaway: 'Focus on the quality of your process, and the profits will inevitably take care of themselves.'
        },
        actionableChecklist: [
          'Perform your 15-minute debrief before 19:00 EAT every trading day.',
          'Record an Execution Grade (A, B, C, F) for every single trading session.',
          'Aim for 20 consecutive "Grade A" trading days.'
        ]
      },
      {
        id: 'lp-10',
        number: '10',
        title: 'Working Tool: Weekly Outlook Planner & Session Clock',
        levelTag: 'Intermediate',
        duration: '16 mins',
        summary: 'Explore the live session clock, London/NY volume indicators, and interactive weekly market outlook planner below.',
        concept: 'This pillar concludes with an interactive suite of real-time market pulse tools: 1) The Real-Time Nairobi Session Clock (EAT) displaying live volume indicators; 2) The High-Impact News Calendar integration; and 3) The Weekly Outlook Planner form, allowing you to document your macro thesis, target pairs, and invalidation boundaries directly in the app.',
        bulletPoints: [
          'Live EAT Clock: Automatically highlights peak London and NY liquidity windows.',
          'Session Volume Status: Real-time badges indicating High Volume, Asian Range, or Rollover warnings.',
          'Weekly Planner Form: Interactive template for mapping weekly key levels and targets.',
          'Persistent Notes: Saves your weekly outlook to your browser’s localStorage.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Live Market Pulse Tool Suite',
          caption: 'Components Embedded Directly in this Page',
          content: `[ LIVE EAT MARKET CLOCK ]
Current Time: 12:45:10 EAT  │  Session: LONDON PEAK (HIGH VOLUME)
Volume Indicator: [ ████████████████████ ] 88% Institutional Activity
───────────────────────────────────────────────────────────────────────
[ DAILY BIAS GENERATOR ]
Pair: GBP/USD  │  Bias: BULLISH  │  Target: 1.2850  │  Invalidation: 1.2780
───────────────────────────────────────────────────────────────────────
[ WEEKLY OUTLOOK FORM ]
Save your weekly notes directly into the application below!`
        },
        realWorldExample: {
          pair: 'Live Tool Usage',
          context: 'Trader utilized the Live Session Clock below before entering an afternoon position.',
          setup: 'Saw that session had shifted to "Rollover Warning" at 23:15 EAT with low liquidity.',
          outcome: 'Aborted the trade; avoided a 7-pip spread spike. Preserved capital.',
          keyTakeaway: 'Use live market timing tools to trade only when institutional liquidity is actively supporting your edge.'
        },
        actionableChecklist: [
          'Check the Live Session Clock below before opening any trade.',
          'Fill out your Weekly Outlook notes using the interactive planner form.',
          'Ensure you never open trades when the session indicator reads "Rollover Warning".'
        ]
      }
    ]
  },

  // ==========================================
  // PILLAR 8: /growth-lab — Growth Lab & Funded Path Masterclass
  // ==========================================
  {
    id: '/growth-lab',
    route: '/growth-lab',
    number: '08',
    title: 'Growth Lab & Funded Path Masterclass',
    subtitle: 'Auditing, Mistake Banks, Prop Firm Scaling & Working Trade Logger',
    oneLineHook: 'Log trades in real-time, conduct weekly performance audits, and scale from a $50 account to $200K prop funding.',
    badge: 'Funded Path',
    category: 'Institutional',
    overview: 'The final masterclass where theory transforms into professional career scaling. Learn how institutional prop firms audit performance, build a structured Mistake Bank to eliminate recurring errors, and follow the exact 90-day roadmap from small capital to six-figure funding. Includes a fully functional React Trade Logger table with localStorage persistence.',
    learningOutcomes: [
      'Maintain an institutional trade ledger with win rates, RRR, and error tags',
      'Conduct weekly statistical performance audits (Profit Factor, Expectancy, Sharpe)',
      'Construct a "Mistake Bank" to categorize and eliminate repetitive behavioral leaks',
      'Navigate the 2-phase evaluation process for FTMO, FundedNext, and top prop firms',
      'Use the built-in Trade Logger table to add, filter, and review live trades'
    ],
    lessons: [
      {
        id: 'gl-01',
        number: '01',
        title: 'The Professional Trader’s Ledger: Logging Every Metric',
        levelTag: 'Beginner',
        duration: '18 mins',
        summary: 'Why an unjournaled trading career is an unexamined failure: The mandatory metrics of professional trade tracking.',
        concept: 'If you do not track your trading data, you are not running a business—you are merely gambling. Every professional trading desk maintains an exhaustive ledger. For every single trade, you must record: Date & Time (EAT), Currency Pair, Direction (Buy/Sell), Lot Size, Entry Price, Stop Loss, Exit Price, Net PnL ($), Setup Strategy Name, and Mistake Tags. Over 100 trades, this data reveals your exact strengths and eliminates unprofitable habits.',
        bulletPoints: [
          'Data Over Emotion: Your trade ledger reveals the cold, unvarnished mathematical truth of your trading edge.',
          'Core Metrics: Win Rate %, Average Win ($), Average Loss ($), Profit Factor, Max Drawdown.',
          'Strategy Tagging: Compare which of your setups (e.g. Tower Reversal vs EMA Bounce) is actually generating profit.',
          'Built-in Trade Logger: Use the working trade logging tool embedded directly at the bottom of this page.'
        ],
        illustration: {
          type: 'table',
          title: 'The Professional Trade Ledger Structure',
          caption: 'Essential Data Points Tracked by Institutional Traders',
          content: `ID   │ Timestamp │ Pair    │ Type │ Lots │ Entry   │ SL      │ PnL ($) │ Setup Strategy │ Mistake Tag
─────┼───────────┼─────────┼──────┼──────┼─────────┼─────────┼─────────┼────────────────┼────────────
#101 │ Oct 12 11h│ EUR/USD │ BUY  │ 0.01 │ 1.08502 │ 1.08300 │ +$5.20  │ 20/50 EMA Bounc│ Clean Exec
#102 │ Oct 13 15h│ GBP/USD │ SELL │ 0.01 │ 1.29169 │ 1.29700 │ +$6.60  │ Tower Top Rev  │ Clean Exec
#103 │ Oct 14 12h│ USD/JPY │ BUY  │ 0.02 │ 155.200 │ 155.000 │ -$4.00  │ News Chase     │ FOMO Trap!
#104 │ Oct 15 16h│ EUR/USD │ BUY  │ 0.01 │ 1.08200 │ 1.08000 │ +$6.00  │ FVG Mitigation │ Clean Exec`
        },
        realWorldExample: {
          pair: 'Ledger Audit',
          context: 'Trader reviewed 40 logged trades in their journal.',
          setup: 'Discovered that 20/50 EMA bounce trades had a 72% win rate, while breakout trades had a 25% win rate.',
          outcome: 'Immediately stopped trading breakouts; focused 100% on EMA bounces. Profitability soared.',
          keyTakeaway: 'Your journal is your personal trading coach. It tells you exactly what to stop doing.'
        },
        actionableChecklist: [
          'Log every single trade you take within 10 minutes of closing it.',
          'Never delete a losing trade from your journal; losing trades contain the most valuable lessons.',
          'Use the interactive Trade Logger component at the bottom of this page.'
        ]
      },
      {
        id: 'gl-02',
        number: '02',
        title: 'The Weekly Performance Audit: Calculating Profit Factor',
        levelTag: 'Intermediate',
        duration: '20 mins',
        summary: 'How to conduct a statistical Sunday audit: Computing Profit Factor, Sharpe Ratio, and Expectancy.',
        concept: 'At the end of every trading week, professional traders calculate their core statistical ratios. The most critical metric is Profit Factor: Gross Profits divided by Gross Losses. A Profit Factor of 1.0 means you broke even. Between 1.2 and 1.5 is decent. Between 1.75 and 2.5 is exceptional institutional performance. If your Profit Factor is below 1.2, you must reduce risk and refine your entries before adding more capital.',
        bulletPoints: [
          'Profit Factor Formula: Total Gross Winning Dollars divided by Total Gross Losing Dollars.',
          'Win Rate vs Profit Factor: A 40% win rate with a 2.5 Profit Factor beats an 80% win rate with a 1.1 Profit Factor.',
          'Average Risk-to-Reward: Total Profits / Total Losses across all closed trades.',
          'Weekly Summary Report: Document total pips, net dollar return, and rule compliance score.'
        ],
        illustration: {
          type: 'formula',
          title: 'Profit Factor & Mathematical Edge Formulas',
          caption: 'How to Grade Your Weekly Performance',
          content: `1. Profit Factor Formula:
   Profit Factor = Total Gross Profits ($) / Total Gross Losses ($)
   Example: 
   • Gross Winning Trades: +$24.50
   • Gross Losing Trades: -$10.00
   • PROFIT FACTOR = $24.50 / $10.00 = 2.45 (INSTITUTIONAL GRADE!)

2. Win/Loss Ratio:
   Win Rate % = (Winning Trades / Total Trades) * 100
   
3. Net Edge Expectancy:
   Expectancy = (Win% * Average Win) - (Loss% * Average Loss)`
        },
        realWorldExample: {
          pair: 'Weekly Audit',
          context: 'Trader had 4 wins (+$24 total) and 5 losses (-$10 total).',
          setup: 'Calculated Profit Factor: $24 / $10 = 2.40.',
          outcome: 'Understood that despite having more losses than wins, their mathematical edge generated strong net profit.',
          keyTakeaway: 'Profit Factor is the definitive proof of trading edge. Master the math of asymmetry.'
        },
        actionableChecklist: [
          'Calculate your Profit Factor every Sunday evening.',
          'Aim for a consistent Profit Factor above 1.75 over any 20-trade sample.',
          'If Profit Factor drops below 1.2, switch back to demo or 0.01 micro lots immediately.'
        ]
      },
      {
        id: 'gl-03',
        number: '03',
        title: 'The "Mistake Bank": Categorizing & Eliminating Leaks',
        levelTag: 'Advanced',
        duration: '18 mins',
        summary: 'Build an archive of your trading errors: Execution mistakes, sizing mistakes, and impatience leaks.',
        concept: 'In aviation and surgery, disasters are studied obsessively so they are never repeated. Trading requires the same rigor. The "Mistake Bank" is a dedicated section of your trading journal where every loss is categorized into: 1) System Loss (You followed all rules; market was simply random—acceptable loss); 2) Execution Mistake (Late entry, incorrect lot size); or 3) Psychological Mistake (FOMO, revenge, moving stop loss).',
        bulletPoints: [
          'The 3 Loss Categories: Good Losses (rule-compliant), Execution Slips, and Psychological Violations.',
          'Cost of Mistakes: Calculate the exact dollar amount lost purely to emotional mistakes each month.',
          'The Recurring Culprit: Most traders discover that 80% of their total losses stem from just ONE recurring mistake.',
          'Elimination Focus: Pick your #1 worst mistake and commit 100% of your energy to eliminating it this week.'
        ],
        illustration: {
          type: 'table',
          title: 'The Mistake Bank Taxonomy',
          caption: 'Categorizing Errors to Eliminate Account Drain',
          content: `Error Code │ Error Name              │ Description                          │ Financial Cost
───────────┼─────────────────────────┼──────────────────────────────────────┼───────────────
ERR-01     │ FOMO Chase              │ Entering after a 30-pip candle moved │ -$14.00
ERR-02     │ Oversized Lot           │ Using 0.05 instead of 0.01 lot       │ -$25.00
ERR-03     │ Moving Stop Loss        │ Dragging SL further away during loss │ -$35.00 (FATAL)
ERR-04     │ Revenge Re-entry        │ Entering within 5 mins of a loss     │ -$18.00
ERR-05     │ Chop Zone Trading       │ Trading during overlapping EMAs      │ -$12.00
───────────┴─────────────────────────┴──────────────────────────────────────┴───────────────
TOTAL MONTHLY COST OF PSYCHOLOGICAL MISTAKES: -$104.00 (MORE THAN 1 ACCOUNT BLOWN!)`
        },
        realWorldExample: {
          pair: 'Mistake Bank Review',
          context: 'Trader realized that over 3 months, "Moving Stop Loss" cost them $120.00 in unnecessary losses.',
          setup: 'Set an ironclad rule: "I will never touch a stop loss once entered."',
          outcome: 'Over the next 3 months, account went from breakeven to consistently profitable.',
          keyTakeaway: 'You do not need a better strategy to make money. You just need to stop making your #1 mistake.'
        },
        actionableChecklist: [
          'Assign an Error Code to every losing trade in your journal.',
          'Calculate how much money your emotional mistakes cost you at the end of each month.',
          'Focus exclusively on eliminating your single most expensive recurring mistake.'
        ]
      },
      {
        id: 'gl-04',
        number: '04',
        title: 'The Prop Firm Landscape: FTMO, FundedNext & Evaluation Models',
        levelTag: 'Intermediate',
        duration: '22 mins',
        summary: 'How proprietary trading firms work: Profit splits, evaluation rules, simulated accounts, and real payout mechanics.',
        concept: 'Proprietary trading firms (prop firms) provide talented traders with substantial capital ($10,000 to $200,000+) in exchange for an 80% to 90% profit split. Instead of risking your own life savings, you pay a small evaluation fee ($100 to $500). If you demonstrate risk discipline and pass their 2-phase evaluation, you receive a funded trading account and receive monthly payouts.',
        bulletPoints: [
          'The Economic Model: Prop firms look for consistent, disciplined risk managers, not high-leverage gamblers.',
          'Profit Splits: You keep 80% to 90% of all generated trading profits; the firm keeps 10% to 20%.',
          'Refundable Evaluation Fee: Top prop firms refund your initial evaluation fee with your first profit payout.',
          'Reputable Firms: Focus on established firms with multi-year payout track records (FTMO, FundedNext).'
        ],
        illustration: {
          type: 'diagram',
          title: 'The Prop Firm Funding Model',
          caption: 'How Retail Traders Access Six-Figure Capital',
          content: `Trader Pays Evaluation Fee ($155 for $25,000 Account)
    │
    ▼ Phase 1 Evaluation: 8% Profit Target ($2,000) with 5% Max Daily Loss
    │ (Passes with disciplined 0.5% risk over 18 trading days)
    │
    ▼ Phase 2 Verification: 5% Profit Target ($1,250) with 5% Max Daily Loss
    │ (Passes with disciplined 0.5% risk over 12 trading days)
    │
    ▼ [ FUNDED TRADER STATUS GRANTED! ]
    Trader receives $25,000 Simulated Master Account + Fee Refund!
    │
    ▼ Trader generates modest 4% profit in Month 1 (+$1,000 USD)
    └── 80% PROFIT SPLIT = $800.00 USD (approx 104,000 KES) PAID TO M-PESA/BANK!`
        },
        realWorldExample: {
          pair: 'Prop Funding',
          context: 'Trader in Gilgil, Kenya had only $150 in personal savings. Bought an FTMO $10,000 challenge.',
          setup: 'Traded strictly 0.05 lots with $25 risk per trade over 2 months.',
          outcome: 'Passed Phase 1 and Phase 2. First monthly payout was $640 USD (approx 83,000 KES).',
          keyTakeaway: 'Prop firms are the greatest meritocracy in modern finance. Your skill dictates your income.'
        },
        actionableChecklist: [
          'Never buy a prop firm challenge until you have proven 60 days of profitable demo/live journaling.',
          'Read the exact rules regarding news trading, weekend holding, and maximum daily drawdown.',
          'Treat the evaluation account with the same respect as a live $100,000 account.'
        ]
      },
      {
        id: 'gl-05',
        number: '05',
        title: 'Prop Firm Challenge Phase 1: 8% Target & 5% Daily Loss Rule',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'The exact mathematical playbook to pass Phase 1 without breaching the 5% daily drawdown limit.',
        concept: 'Phase 1 of most prop firm challenges requires an 8% to 10% profit target while respecting a hard 5% maximum daily loss and a 10% maximum total loss. Most traders fail Phase 1 because they feel rushed and risk 2% per trade, blowing out after 2 or 3 bad trades. With no time limits on modern prop firms, the winning formula is to risk only 0.5% per trade, requiring 16 net R units to pass.',
        bulletPoints: [
          'No Time Limit Advantage: Modern challenges do not expire in 30 days. Take 60 or 90 days if necessary.',
          'The 0.5% Risk Formula: By risking 0.5% ($50 on a $10K account), you have 10 consecutive losses before hitting daily limit.',
          'The 16-R Target: Reaching an 8% profit target with 0.5% risk requires exactly 16 units of R profit.',
          'Asymmetric Pacing: With 1:2.5 RRR setups, you only need 6 to 7 clean winning trades to pass Phase 1!'
        ],
        illustration: {
          type: 'steplist',
          title: 'The 16-R Phase 1 Passing Roadmap',
          caption: 'Mathematics of Passing an 8% Target with 0.5% Risk',
          content: `Account: $10,000 USD  │  Risk Per Trade: 0.50% ($50.00)  │  Target: 8.0% ($800.00)
Every 1:2.5 RRR Winner = +$125.00 (+1.25% Account Gain)

Trade Series Simulation:
   • 4 Losses: -$50 x 4 = -$200.00 (-2.0%)
   • 8 Wins (1:2.5): +$125 x 8 = +$1,000.00 (+10.0%)
   
   NET PROFIT: +$800.00 USD (+8.0% TARGET ACHIEVED!)
   TOTAL TRADES TAKEN: 12 Trades across 20 trading days!
   
*You only needed an 8-win, 4-loss record (66% win rate) to pass cleanly!*`
        },
        realWorldExample: {
          pair: '$10K Challenge',
          context: 'Trader took 25 days to complete Phase 1, never taking more than 1 trade per day.',
          setup: 'Max drawdown experienced during the entire month was only 1.5% ($150).',
          outcome: 'Passed Phase 1 with zero stress or near-miss drawdown warnings.',
          keyTakeaway: 'Patience is your greatest trading weapon. Slow and steady wins the funded challenge.'
        },
        actionableChecklist: [
          'Set your risk to exactly 0.5% of account balance per trade during Phase 1.',
          'Calculate your target in R-units (8% target at 0.5% risk = 16 R units).',
          'If you hit 4% profit, never allow your account to retrace back into negative equity.'
        ]
      },
      {
        id: 'gl-06',
        number: '06',
        title: 'Prop Firm Challenge Phase 2: 5% Target & Verification Consistency',
        levelTag: 'Advanced',
        duration: '20 mins',
        summary: 'How to lock in your funded account: Navigating the 5% verification target with reduced risk.',
        concept: 'Phase 2 (Verification) is mathematically easier than Phase 1: the target drops from 8% down to 5%, while the drawdown buffer remains identical (5% daily, 10% overall). However, many traders fail Phase 2 because of psychological euphoria—they feel confident after passing Phase 1, become sloppy, increase their risk, and blow out. Phase 2 requires reducing your risk to 0.35% - 0.5% and executing with surgical precision.',
        bulletPoints: [
          'Reduced Profit Target: Only 5% ($500 on $10K account, $5,000 on $100K account).',
          'Consistency Rules: Some firms require a minimum of 4 or 5 active trading days.',
          'Beware Euphoria: The psychological danger in Phase 2 is overconfidence and taking subpar setups.',
          'The Final Gate: Once Phase 2 is passed, your funded master account is issued with real profit sharing.'
        ],
        illustration: {
          type: 'steplist',
          title: 'Phase 2 Verification Pacing Protocol',
          caption: 'Securing the Final Funded Contract',
          content: `Account: $10,000 USD  │  Risk Per Trade: 0.35% ($35.00)  │  Target: 5.0% ($500.00)
Target in R Units: Exactly 14 R Units (or just 5 clean 1:2.8 RRR trades!)

Execution Protocol:
   • Trade only high-confluence scanner setups (Score 80+)
   • Minimum trading days: 5 Days (Take 0.01 lot micro trades if target reached early)
   • Do NOT trade high-impact news events (CPI / NFP) during Phase 2
   • Cross the 5% finish line calmly and wait for your KYC contract verification!`
        },
        realWorldExample: {
          pair: '$50K Phase 2',
          context: 'Trader needed $2,500 (5%) to pass Phase 2.',
          setup: 'Took 8 trades over 14 days, risking $200 per trade (0.4%). Won 5, lost 3.',
          outcome: 'Reached +$2,580 profit cleanly. Received funded credentials within 24 hours.',
          keyTakeaway: 'Phase 2 is about consistency and defense. Protect the lead and cross the finish line.'
        },
        actionableChecklist: [
          'Reduce your risk per trade by 20% compared to Phase 1.',
          'Check the prop firm dashboard daily to ensure minimum trading day requirements are met.',
          'Submit your government KYC documents promptly upon passing.'
        ]
      },
      {
        id: 'gl-07',
        number: '07',
        title: 'The Funded Trader Phase: Managing Risk When Payouts Are Live',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'The psychological shift from challenge mode to live payouts: Capital preservation and monthly income harvesting.',
        concept: 'Congratulations—you are now a funded prop trader. But the psychological battlefield changes completely on a funded account. During challenges, you were pushing for targets (8% and 5%). On a funded account, THERE IS NO PROFIT TARGET. You do not need to make 10% a month. If you make a modest 3% to 4%, you receive a massive monthly paycheck. Your sole operational directive is to STAY FUNDED.',
        bulletPoints: [
          'No Targets, Only Limits: The only rule that matters is avoiding the 5% daily and 10% overall drawdown limits.',
          'Payout Sizing: A 3% gain on a $100K account = $3,000 USD (approx 390,000 KES) monthly income.',
          'Withdraw Immediately: Request your profit payout the very minute you are eligible; never leave profits in the account.',
          'Account Longevity: The most successful funded traders have kept their accounts active for 2+ years by risking only 0.25%.'
        ],
        illustration: {
          type: 'table',
          title: 'Funded Trader Monthly Payout Reality',
          caption: 'Real Income Projections on Modest 3-5% Monthly Returns',
          content: `Funded Account Size │ Monthly Return │ Gross Profit │ 80% Trader Payout (USD) │ Kenyan Shillings (KES)
───────────────────┼────────────────┼──────────────┼────────────────────────┼───────────────────────
$10,000 Account    │ 4.0%           │ $400.00      │ $320.00 USD            │ ~ 41,600 KES
$25,000 Account    │ 4.0%           │ $1,000.00    │ $800.00 USD            │ ~ 104,000 KES
$50,000 Account    │ 3.5%           │ $1,750.00    │ $1,400.00 USD          │ ~ 182,000 KES
$100,000 Account   │ 3.0%           │ $3,000.00    │ $2,400.00 USD          │ ~ 312,000 KES
$200,000 Account   │ 3.0%           │ $6,000.00    │ $4,800.00 USD          │ ~ 624,000 KES!`
        },
        realWorldExample: {
          pair: 'Live Funded Account',
          context: 'Trader with $50K funded account targeted only 3.5% per month instead of trying to double it.',
          setup: 'Took 10 trades all month risking $150 (0.3%). Made +$1,850 profit.',
          outcome: 'Received $1,480 payout directly to bank account. Transformed family financial stability in Gilgil.',
          keyTakeaway: 'Small percentage returns on large capital generate life-changing income.'
        },
        actionableChecklist: [
          'Drop your risk to 0.25% - 0.40% on your live funded account.',
          'Set a target of just 2% to 4% per month.',
          'Transfer all profit payouts out of trading immediately into tangible real-world assets.'
        ]
      },
      {
        id: 'gl-08',
        number: '08',
        title: 'Scaling Plan: From $10,000 to $200,000 Capital Architecture',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'The strategic scaling roadmap: Utilizing prop firm scaling plans and compounding payout allocations.',
        concept: 'Most top-tier prop firms feature an automatic Scaling Plan. If a trader generates a cumulative 10% profit over a 4-month period and remains profitable in at least 2 of those months, the firm automatically increases their account balance by 25%, up to a maximum cap of $1 Million to $2 Million. Additionally, by allocating 20% of your payouts toward buying additional challenge accounts across different firms, you build a diversified $200K+ capital empire.',
        bulletPoints: [
          'Automatic Scaling Rules: Generating 10% over 4 months scales a $100K account to $125K, then $150K, then $200K.',
          'Multi-Firm Diversification: Hold accounts across 2 or 3 distinct prop firms (e.g. FTMO + FundedNext) to eliminate counterparty risk.',
          'Trade Copying: Use low-latency Trade Copiers to duplicate your master trades across all your funded accounts simultaneously.',
          'Capital Fortress: Managing $200,000 across multiple firms while risking only 0.25% per trade.'
        ],
        illustration: {
          type: 'steplist',
          title: 'The Multi-Account Scaling Matrix',
          caption: 'Building a $200,000 Capital Portfolio',
          content: `Phase 1: Pass first $25,000 Account (FTMO)
   └── Receive first payout of $1,000 USD
   
Phase 2: Reinvest $300 of payout into a second $50,000 Challenge (FundedNext)
   └── Pass challenge -> Total Capital: $75,000 USD!
   
Phase 3: Connect MT4 Trade Copier (Master trade on $25K executes automatically on $50K)
   └── Receive combined monthly payouts of $2,500+ USD!
   
Phase 4: Qualify for automatic scaling on both accounts
   └── Total Capital grows to $200,000+ USD!
   └── Monthly earnings exceed $6,000 USD (approx 780,000 KES)!`
        },
        realWorldExample: {
          pair: 'Scaling Portfolio',
          context: 'Trader started with a single $10K account; used payouts to purchase $50K and $100K accounts.',
          setup: 'Deployed identical 20/50 EMA bounce strategy via trade copier across all 3 accounts.',
          outcome: 'Managed $160,000 total capital. Monthly payouts consistently exceeded $4,500.',
          keyTakeaway: 'Scale capital, not risk. A 2% gain on $200K is vastly more profitable and safer than a 50% gain on $500.'
        },
        actionableChecklist: [
          'Review the scaling plan criteria in your prop firm client portal.',
          'Save 25% of every funded payout into a dedicated "Challenge Reserve Fund".',
          'Never manage more than $300,000 with a single prop firm—always diversify across firms.'
        ]
      },
      {
        id: 'gl-09',
        number: '09',
        title: 'The 90-Day Funded Trader Roadmap: From Student to Payout',
        levelTag: 'Advanced',
        duration: '22 mins',
        summary: 'The exact calendar blueprint: Month 1 Foundation, Month 2 Backtesting & Demo Discipline, Month 3 Funded Challenge.',
        concept: 'Becoming a consistently profitable, funded forex trader is not a multi-year mystery; it is a structured 90-day engineering curriculum. Month 1 is dedicated to mastering the 8 Pillars of PivotFx and internalizing the $2 survival rule. Month 2 is dedicated to 100 documented demo trades to prove positive expectancy. Month 3 is dedicated to taking your first $10K or $25K prop firm challenge and securing your first payout.',
        bulletPoints: [
          'Month 1 (Days 1 - 30): Complete all 8 Pillars, configure TradingView and MT4, master the $2 rule.',
          'Month 2 (Days 31 - 60): Execute 50 documented trades on demo; achieve a Profit Factor > 1.75.',
          'Month 3 (Days 61 - 90): Purchase and execute Phase 1 and Phase 2 of a $10K/25K challenge risking 0.5%.',
          'Month 4 (Day 90+): Receive your first verified profit payout into your Kenyan bank account or M-Pesa!'
        ],
        illustration: {
          type: 'steplist',
          title: 'The 90-Day Funded Trader Calendar',
          caption: 'Your Step-by-Step Path from Zero to Funded',
          content: `DAYS 1 - 30: THE ACADEMY & FOUNDATION PHASE
   • Complete all 80 lessons across the 8 PivotFx Pillars
   • Set up TradingView workspace & MT4/MT5 terminal with FXPesa demo
   • Pass all lesson quizzes with 100% score

DAYS 31 - 60: THE STATISTICAL PROOF PHASE
   • Take 50 trades on demo executing ONLY Flagship 1 or Flagship 2
   • Log every single trade in the Trade Logger below
   • Achieve a verified Profit Factor > 1.75 across the 50 trades

DAYS 61 - 90: THE FUNDED CHALLENGE EXECUTION PHASE
   • Purchase a $10,000 or $25,000 Prop Firm Challenge
   • Execute Phase 1 risking strictly 0.5% ($50 on $10K)
   • Execute Phase 2 with 0.35% risk -> PASS VERIFICATION!

DAY 90+: FUNDED TRADER PAYOUT MILESTONE!
   • Request first profit withdrawal -> Banked in your hands!`
        },
        realWorldExample: {
          pair: 'Student Roadmap',
          context: 'Kenyan student followed the exact 90-day roadmap without skipping a single phase.',
          setup: 'Did not spend money on prop challenges until Month 2 demo profit factor reached 1.92.',
          outcome: 'Passed the $10,000 challenge on Day 84 on their very first attempt.',
          keyTakeaway: 'Discipline in preparation creates inevitability in execution.'
        },
        actionableChecklist: [
          'Print out the 90-day roadmap and mark off each week as you complete it.',
          'Do not purchase a prop firm challenge until Month 2 demo targets are met.',
          'Start Day 1 today by mastering your trade logging tools below.'
        ]
      },
      {
        id: 'gl-10',
        number: '10',
        title: 'Working Tool: The Live Trade Logger & Performance Engine',
        levelTag: 'Intermediate',
        duration: '18 mins',
        summary: 'Explore the built-in Trade Logger table below: log trades, track win rates, calculate PnL, and persist to localStorage.',
        concept: 'This masterclass concludes with the most critical tool in the entire PivotFx ecosystem: The Interactive Trade Logger. Built directly into the page with persistent browser storage (localStorage), this component allows you to log new trades in real-time, record your setup strategy, track win/loss outcomes, calculate your win rate percentage, compute net dollar profit, and filter trades by setup.',
        bulletPoints: [
          'Full CRUD Logging: Add trades, input entry/SL/TP, set outcome (WON, LOST, OPEN), and delete logs.',
          'Automated Win-Rate Calculation: Automatically calculates your win rate % and total net PnL in real time.',
          'Persistent LocalStorage: Your trade data is permanently saved in your browser and survives page reloads.',
          'Strategy Analytics: View which setups are generating the highest profit for your account.'
        ],
        illustration: {
          type: 'diagram',
          title: 'Interactive Trade Logger Component Architecture',
          caption: 'Built-in Tool Embedded Directly Below',
          content: `[ ADD NEW TRADE FORM ]
  • Pair: EUR/USD  │  Type: BUY  │  Lots: 0.01  │  Entry: 1.0850
  • Stop Loss: 1.0830  │  Take Profit: 1.0910  │  PnL ($): +$6.00
  • Setup: Tower Top Reversal  │  Mistake: None (Clean Exec)
  └── [ + Add Trade to Ledger ] Button
────────────────────────────────────────────────────────────────────────
[ REAL-TIME METRICS BAR ]
  • Total Trades: 12  │  Win Rate: 58.3%  │  Net PnL: +$28.40 USD
────────────────────────────────────────────────────────────────────────
[ INTERACTIVE DATA TABLE ]
  • Displays all logged trades with status badges, timestamps, and delete buttons!`
        },
        realWorldExample: {
          pair: 'Logger Usage',
          context: 'Trader logged 15 trades over 2 weeks using the component below.',
          setup: 'Saw real-time metrics showing 60% win rate and +$18.50 profit.',
          outcome: 'Presented the exported log as proof of discipline to qualify for funded challenge sponsorship.',
          keyTakeaway: 'What gets measured gets improved. Make logging second nature.'
        },
        actionableChecklist: [
          'Scroll down to the Trade Logger component below.',
          'Log your last 3 live or demo trades to familiarize yourself with the interface.',
          'Commit to logging every single trade you execute throughout your trading career.'
        ]
      }
    ]
  }
];

export const PILLARS_LIST_META = PILLARS_MASTERCLASS_DATA.map((p) => ({
  id: p.id,
  route: p.route,
  number: p.number,
  title: p.title,
  subtitle: p.subtitle,
  oneLineHook: p.oneLineHook,
  badge: p.badge,
  category: p.category,
  lessonCount: p.lessons.length,
}));
