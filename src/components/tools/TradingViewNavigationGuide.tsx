import React, { useState } from 'react';
import {
  Compass,
  Search,
  Clock,
  CandlestickChart,
  Sliders,
  Bell,
  Play,
  RotateCcw,
  Maximize2,
  Camera,
  Layers,
  TrendingUp,
  Square,
  Crosshair,
  Percent,
  CheckCircle2,
  HelpCircle,
  Eye,
  Lock,
  Trash2,
  Magnet,
  Calendar,
  Code2,
  Laptop,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';

interface TVButtonGuide {
  id: string;
  name: string;
  location: 'top-bar' | 'left-bar' | 'right-bar' | 'bottom-bar';
  shortcut?: string;
  iconName: string;
  whatItDoes: string;
  whyNewbiesNeedIt: string;
  stepByStepHowToUse: string[];
  ictProTip: string;
  mt4Equivalent: string;
  previewGraphic: {
    title: string;
    description: string;
    asciiDiagram: string;
  };
}

export const TradingViewNavigationGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'top-bar' | 'left-bar' | 'right-bar' | 'bottom-bar'>('all');
  const [activeButtonId, setActiveButtonId] = useState<string>('symbol-search');
  const [activeTab, setActiveTab] = useState<'visual-tour' | 'cheat-sheet' | 'mt4-translation'>('visual-tour');

  const tvButtons: TVButtonGuide[] = [
    // --- TOP BAR ---
    {
      id: 'symbol-search',
      name: 'Symbol Search / Asset Ticker',
      location: 'top-bar',
      shortcut: 'Simply start typing any letter',
      iconName: 'Search',
      whatItDoes: 'Lets you search and open any financial instrument across Forex (EUR/USD, GBP/USD), Commodities (XAU/USD Gold), Indices (US30, NAS100), or Crypto.',
      whyNewbiesNeedIt: 'Newbies often get lost searching for the wrong ticker or broker feed. Choosing the right data provider (e.g. OANDA, FXCM, or ICE) ensures accurate candlestick prices without weird weekend spikes.',
      stepByStepHowToUse: [
        '1. Click on the symbol box in the top-left corner (or press any letter on your keyboard).',
        '2. Type your desired currency pair, e.g. "GBPUSD" or "XAUUSD".',
        '3. Filter by category: Click the "Forex" tab to only see currency pairs.',
        '4. Select reputable liquidity providers like OANDA or FXCM for cleanest institutional wicks.'
      ],
      ictProTip: 'Always compare your broker MT4 chart against the FXCM/OANDA TradingView feed to verify if an extreme wick was genuine bank liquidity or broker spread manipulation.',
      mt4Equivalent: 'MT4 Market Watch window (Ctrl + M) -> Right Click -> "Show All" -> Double Click Symbol.',
      previewGraphic: {
        title: 'Top Left Symbol Box',
        description: 'Instant ticker search & provider selection',
        asciiDiagram: `┌──────────────────────────────────────────────┐
│ [ GBPUSD ]  OANDA  ●  D  ●  Candles  ●  fx   │ ◄── Top Toolbar
└──────────────────────────────────────────────┘
  ▲
  Click here to change symbol or press any letter!`
      }
    },
    {
      id: 'timeframe-selector',
      name: 'Timeframe Selector (1m, 5m, 15m, 1h, 4h, D)',
      location: 'top-bar',
      shortcut: 'Type 15 for M15, 60 for H1, D for Daily',
      iconName: 'Clock',
      whatItDoes: 'Switches the duration of each individual candlestick. On M15, each candle represents 15 minutes of price auction; on D1, each candle represents one full 24-hour day.',
      whyNewbiesNeedIt: 'Beginners make the fatal mistake of staring only at 1-minute charts, getting chopped up by noise. TradingView lets you favorite (star) your core timeframes for 1-click access.',
      stepByStepHowToUse: [
        '1. Click the timeframe dropdown next to the symbol in the top bar.',
        '2. Hover over your primary timeframes (15m, 1h, 4h, Daily) and click the star icon.',
        '3. Your starred timeframes will now permanently sit on the top bar for instant switching.',
        '4. Pro shortcut: Simply type the number (e.g. "15" then Enter) to change timeframe instantly!'
      ],
      ictProTip: 'Follow the Top-Down Multi-Timeframe Matrix: Daily for Institutional Bias -> H1 for Market Structure Shift -> M15 for FVG & Order Block Execution.',
      mt4Equivalent: 'MT4 Periodicity Toolbar (M1, M5, M15, M30, H1, H4, D1, W1, MN).',
      previewGraphic: {
        title: 'Timeframe Bar with Star Favorites',
        description: 'Instant multi-timeframe synchronization',
        asciiDiagram: `┌────────────────────────────────────────────────────────┐
│ GBPUSD  ● [ 1m ] [ 5m ] ★[ 15m ] ★[ 1h ] ★[ 4h ] ★[ D ] │
└────────────────────────────────────────────────────────┘
                    ▲       ▲       ▲
     Starred timeframes pinned for 1-click switching!`
      }
    },
    {
      id: 'candle-types',
      name: 'Candlestick Style (Candles, Hollow, Heikin Ashi)',
      location: 'top-bar',
      shortcut: 'Alt + 1 (Bars), Alt + 2 (Candles), Alt + 8 (Heikin Ashi)',
      iconName: 'CandlestickChart',
      whatItDoes: 'Changes the visual representation of price data from traditional Japanese Candlesticks to Hollow Candles, Line Charts, or Heikin Ashi smoothed candles.',
      whyNewbiesNeedIt: 'Japanese Candlesticks display Open, High, Low, and Close (OHLC). The Line chart is crucial for beginners who struggle to see support and resistance levels through noisy wicks.',
      stepByStepHowToUse: [
        '1. Click the Candle icon on the top toolbar.',
        '2. Default: Select "Candles" for standard institutional price action.',
        '3. Pro Trick: Switch to "Line" chart temporarily to see pure structural swing highs and lows without wick confusion.',
        '4. Return to "Candles" before planning your stop loss and limit orders.'
      ],
      ictProTip: 'Use Candlesticks for wick liquidity sweeps and Fair Value Gaps; switch to Line chart to verify if candle bodies genuinely closed above structural swing points (BOS vs fakeout).',
      mt4Equivalent: 'MT4 View Mode: Bar Chart (Alt+1), Candlesticks (Alt+2), Line Chart (Alt+3).',
      previewGraphic: {
        title: 'Candle Style Menu',
        description: 'Switch between raw OHLC candles and line charts',
        asciiDiagram: `┌───────── Candle Menu ─────────┐
│ ● Japanese Candles (Standard) │
│ ○ Hollow Candles              │
│ ○ Heikin Ashi (Smoothed)      │
│ ○ Line Chart (Structural S/R) │ ◄── Great for finding true swings!
└───────────────────────────────┘`
      }
    },
    {
      id: 'indicators-fx',
      name: 'Indicators & Strategies Button (fx)',
      location: 'top-bar',
      shortcut: 'Forward Slash ( / )',
      iconName: 'Sliders',
      whatItDoes: 'Opens the vast TradingView indicator library containing built-in quantitative indicators (Moving Averages, RSI, ATR) and community Pine Script algorithms.',
      whyNewbiesNeedIt: 'Newbies often clutter charts with 10 conflicting indicators. The fx button lets you add just the institutional essentials: 20 EMA, 50 EMA, and RSI 14.',
      stepByStepHowToUse: [
        '1. Click the "fx" (Indicators & Metrics) icon or press "/" on your keyboard.',
        '2. Type "Moving Average Exponential" and click it twice to add two lines.',
        '3. Hover over the indicator on your chart, click the Settings Gear icon.',
        '4. Set Length to 20 (Color Gold/Yellow) and the second to 50 (Color Cyan/Blue).',
        '5. Search "Relative Strength Index" and add RSI (14) to monitor overbought exhaustion.'
      ],
      ictProTip: 'Keep your chart minimalist. Institutional smart money does not look at MACD or Bollinger Bands; they look at Time, Price, 20 EMA trend support, and Liquidity Pools.',
      mt4Equivalent: 'MT4 Insert -> Indicators -> Trend -> Moving Average (Method: Exponential).',
      previewGraphic: {
        title: 'Indicators (fx) Dialog',
        description: 'Add 20 EMA, 50 EMA, and RSI 14',
        asciiDiagram: `┌─────────── Indicators (fx) ───────────┐
│ Search: [ Exponential Moving Average ]│
│                                       │
│ ★ Moving Average Exponential (EMA)    │ ◄── Click to add 20 EMA
│ ★ Relative Strength Index (RSI)       │ ◄── Click to add RSI
└───────────────────────────────────────┘`
      }
    },
    {
      id: 'alerts-alarm',
      name: 'Create Price Alert (⏰ Alarm Clock)',
      location: 'top-bar',
      shortcut: 'Alt + A',
      iconName: 'Bell',
      whatItDoes: 'Sets an automated sound, pop-up, SMS, or webhook notification when price touches or crosses a specific support level, Fair Value Gap, or Order Block.',
      whyNewbiesNeedIt: 'Saves you from sitting in front of screens for 8 exhausting hours. You set an alert 3 pips before your entry zone and walk away until your phone beeps!',
      stepByStepHowToUse: [
        '1. Hover your cursor over the exact price level on the chart.',
        '2. Click the small (+) plus icon that appears on the right price scale, or press Alt + A.',
        '3. Select "Add Alert for GBPUSD at 1.29150".',
        '4. Set Condition: "Crossing" or "Entering Channel".',
        '5. Action: Play sound + Send push notification to mobile phone.'
      ],
      ictProTip: 'Set alerts at the Consequent Encroachment (50% midpoint) of M15 Fair Value Gaps. This ensures you only log onto MT4 when institutional wholesale orders are filling.',
      mt4Equivalent: 'MT4 Alerts Tab inside Terminal (Ctrl + T) -> Right Click -> Create Alert.',
      previewGraphic: {
        title: 'Price Scale Quick Alert (+)',
        description: 'Set alerts directly by clicking the price axis',
        asciiDiagram: `Price Scale:
 1.29650 ──
 1.29200 ── [ + ] ◄── Click (+) icon on price scale to set instant alert!
 1.28850 ──`
      }
    },
    {
      id: 'bar-replay',
      name: 'Bar Replay Mode (Rewind Market Time)',
      location: 'top-bar',
      shortcut: 'Shift + R',
      iconName: 'Play',
      whatItDoes: 'Cuts off future candlesticks and replays market history bar-by-bar at your chosen speed. Allows you to test your strategy as if the market were live.',
      whyNewbiesNeedIt: 'The #1 fastest way to get 3 years of trading experience in 3 weeks. You can practice recognizing Tower Tops, FVG retests, and EMA bounces without risking a single dollar.',
      stepByStepHowToUse: [
        '1. Click the "Replay" icon (rewind button) on the top bar or press Shift + R.',
        '2. A vertical blue cut line appears. Move your mouse to where you want the simulation to start.',
        '3. Click once on that candle. All candlesticks to the right will vanish!',
        '4. Click the "Play" button to let candles print automatically, or click "Forward Step" to reveal one candle at a time.'
      ],
      ictProTip: 'Rewind to 10:00 AM EAT (London Open) and practice identifying the Asian Range sweep and Judas Swing before looking at what happened in the afternoon.',
      mt4Equivalent: 'MT4 Strategy Tester (Ctrl + R) in Visual Mode.',
      previewGraphic: {
        title: 'Bar Replay HUD Controller',
        description: 'Step-by-step market simulator',
        asciiDiagram: `┌────── Bar Replay Controller ──────┐
│ [ |◄ Jump ] [ ► Play ] [ ►| Step ] │ Speed: 1x [====| ]
└───────────────────────────────────┘
   ▲
   Reveals 1 candlestick per click for real-time practice!`
      }
    },

    // --- LEFT DRAWING BAR ---
    {
      id: 'trendline-tool',
      name: 'Trendline & Horizontal Ray Tools',
      location: 'left-bar',
      shortcut: 'Alt + T (Trendline) | Alt + J (Horizontal Ray)',
      iconName: 'TrendingUp',
      whatItDoes: 'Enables you to draw angled trendlines or horizontal levels that project infinitely to the right from specific swing points.',
      whyNewbiesNeedIt: 'Beginners clutter their screens with full-width horizontal lines that stretch all the way back into 2021. The Horizontal Ray (Alt+J) keeps historical data pristine and only tracks current market levels.',
      stepByStepHowToUse: [
        '1. Click the small arrow next to the 2nd icon on the left drawing toolbar.',
        '2. Select "Horizontal Ray" (or press Alt + J).',
        '3. Click precisely on yesterday’s high wick and yesterday’s low wick.',
        '4. The ray will extend to the right forever, marking your institutional liquidity targets.'
      ],
      ictProTip: 'Use Horizontal Rays to mark Buy-Side Liquidity (BSL) above double tops and Sell-Side Liquidity (SSL) below double bottoms.',
      mt4Equivalent: 'MT4 Insert -> Lines -> Horizontal Line / Trendline.',
      previewGraphic: {
        title: 'Left Toolbar Line Group',
        description: 'Access Ray, Horizontal Line, and Trendline',
        asciiDiagram: `Left Bar:
 ┌───┐
 │ / │ ◄── 2nd Icon: Line Tools (Trendline, Ray, Horizontal Line)
 └───┘
 Click small arrow to open sub-menu of all line types!`
      }
    },
    {
      id: 'fibo-tool',
      name: 'Fibonacci Retracement (OTE Golden Pocket)',
      location: 'left-bar',
      shortcut: 'Alt + F',
      iconName: 'Percent',
      whatItDoes: 'Measures the percentage pullback of an impulse price wave from Swing Low to Swing High, identifying the optimal mathematical discount/premium zones.',
      whyNewbiesNeedIt: 'Newbies buy at the top of green candles. The Fib tool forces you to wait until price pulls back into the discounted 0.618 - 0.786 Golden Pocket before buying.',
      stepByStepHowToUse: [
        '1. Select the Fibonacci Retracement icon (3rd icon on left) or press Alt + F.',
        '2. For an UPTREND: Click the Swing Low wick (0.0%), drag up to the Swing High wick (100.0%).',
        '3. In settings, uncheck useless levels and keep only: 0.0, 0.50 (Equilibrium), 0.618, 0.705 (ICT OTE), 0.786, and 1.0.',
        '4. Wait for price to pull back into the 0.62 - 0.79 zone before looking for entry triggers.'
      ],
      ictProTip: 'The 0.705 level is the institutional "Optimal Trade Entry" (OTE). When 0.705 aligns with an M15 Fair Value Gap, it provides over 80% statistical win rate.',
      mt4Equivalent: 'MT4 Insert -> Fibonacci -> Retracement.',
      previewGraphic: {
        title: 'Fibonacci OTE Levels',
        description: 'Discount wholesale buying zone',
        asciiDiagram: ` 1.000 (Swing High) ───────────────────────────
 0.786 (Deep Discount) ────────────────────────
 0.705 (ICT OTE LEVEL) ◄══ GOLDEN EXECUTION ZONE
 0.618 (Golden Pocket) ────────────────────────
 0.500 (Equilibrium) ──────────────────────────
 0.000 (Swing Low)  ───────────────────────────`
      }
    },
    {
      id: 'rectangle-tool',
      name: 'Rectangle Tool (Order Blocks & Fair Value Gaps)',
      location: 'left-bar',
      shortcut: 'Alt + Shift + R',
      iconName: 'Square',
      whatItDoes: 'Draws shaded colored geometric boxes to highlight supply/demand zones, consolidation ranges, Fair Value Gaps, and institutional Order Blocks.',
      whyNewbiesNeedIt: 'Forex does not bounce off a razor-thin single pixel line. Institutions accumulate orders across price ranges. The Rectangle tool lets you visualize wholesale price areas.',
      stepByStepHowToUse: [
        '1. Click the Geometric Shapes icon (paintbrush/shapes on left toolbar).',
        '2. Select "Rectangle".',
        '3. For a Fair Value Gap: Click Candle 1 wick top, drag across to Candle 3 wick bottom.',
        '4. Open Settings: Check "Extend Right" so the box projects forward automatically.',
        '5. Color code: Gold/Cyan for Bullish FVG, Red/Magenta for Bearish Order Blocks.'
      ],
      ictProTip: 'Draw a horizontal midline through the 50% midpoint of your rectangle. This represents "Consequent Encroachment" or "Mean Threshold"—the exact bank algorithmic fill point.',
      mt4Equivalent: 'MT4 Insert -> Shapes -> Rectangle.',
      previewGraphic: {
        title: 'Shaded Institutional Rectangle',
        description: 'Map Order Blocks and Fair Value Gaps',
        asciiDiagram: `┌──────────────────────────────────────────────┐
│   H1 BULLISH ORDER BLOCK (DEMAND ZONE)       │
│ ──────────────────────────────────────────── │ ◄── 50% Mean Threshold
│                                              │
└──────────────────────────────────────────────┘`
      }
    },
    {
      id: 'long-short-tool',
      name: 'Long & Short Position Tool (Risk:Reward Calculator)',
      location: 'left-bar',
      shortcut: 'Click Prediction Tool (7th icon down)',
      iconName: 'Sparkles',
      whatItDoes: 'Places an interactive visual calculator showing exact Entry, Stop Loss (red box), Take Profit (green box), risk in pips, and real-time Risk-to-Reward ratio (e.g. 1:3.2).',
      whyNewbiesNeedIt: 'Prevents you from taking bad trades! If the tool shows your Risk:Reward is less than 1:2.0, you immediately know NOT to take the trade before risking real capital.',
      stepByStepHowToUse: [
        '1. Click the Prediction & Measurement icon on the left bar.',
        '2. Click "Long Position" (if buying) or "Short Position" (if selling).',
        '3. Click on your entry price on the chart.',
        '4. Drag the red handle to your invalidation wick (Stop Loss).',
        '5. Drag the green handle to your target liquidity level (Take Profit).',
        '6. Look at the number in the center: Ensure "Risk/Reward Ratio" is at least 2.0 or higher.'
      ],
      ictProTip: 'Double click the tool and enter your actual Account Size (e.g. $100 or $1,000) and Risk % (2%). The tool will calculate your exact lot size automatically!',
      mt4Equivalent: 'No direct MT4 native tool (MT4 requires manual mental math or 3rd party risk calculators).',
      previewGraphic: {
        title: 'Long Position Visual Risk Box',
        description: 'Green profit zone vs red stop loss risk',
        asciiDiagram: `┌─────────────────────────────────────┐
│ TARGET PROFIT (+60 Pips)   [ GREEN ]│
│                                     │
├─────────────────────────────────────┤ ◄── ENTRY PRICE (1.29150)
│ STOP LOSS (-20 Pips)       [  RED  ]│ Risk/Reward: 1 : 3.00
└─────────────────────────────────────┘`
      }
    },
    {
      id: 'pip-ruler',
      name: 'Measure Tool / Pip Ruler (Count Pips Instantly)',
      location: 'left-bar',
      shortcut: 'Hold Shift + Click anywhere on chart',
      iconName: 'Maximize2',
      whatItDoes: 'Measures the exact distance in pips, percentage change, and number of bars/hours between any two points on your chart.',
      whyNewbiesNeedIt: 'Newbies often struggle calculating pips manually (e.g. subtracting 1.28520 from 1.29169). The Pip Ruler shows exact pips (e.g. "64.9 pips") in half a second!',
      stepByStepHowToUse: [
        '1. Super shortcut: Simply hold down the SHIFT key on your keyboard.',
        '2. Click on the swing low.',
        '3. Move your mouse up to the swing high.',
        '4. A blue box appears showing: Distance in Pips, Time elapsed, and Percentage move.',
        '5. Click once to release or press Escape to dismiss.'
      ],
      ictProTip: 'Use the ruler to measure the Asian session range between 03:00 and 10:00 EAT. If the Asian range is smaller than 25-30 pips, expect an explosive London session expansion.',
      mt4Equivalent: 'MT4 Crosshair Tool (Middle Mouse Button click -> click and drag to view bars/pips).',
      previewGraphic: {
        title: 'Shift + Click Quick Measurement',
        description: 'Instant pip counter and bar counter',
        asciiDiagram: `┌───────── Measurement HUD ─────────┐
│ +64.9 Pips  (+0.52%)              │
│ 16 Bars (4 Hours)  Volume: 12.4K  │
└───────────────────────────────────┘`
      }
    },
    {
      id: 'magnet-mode',
      name: 'Magnet Mode (Snaps to Exact Candle Wicks)',
      location: 'left-bar',
      shortcut: 'Hold Ctrl while drawing',
      iconName: 'Magnet',
      whatItDoes: 'Automatically snaps your drawing anchor points to the exact High, Low, Open, or Close price of the nearest candlestick wick.',
      whyNewbiesNeedIt: 'Without Magnet Mode, human hands are imprecise, missing the true high wick by 2 to 5 pips. Magnet Mode guarantees mathematical precision on every level.',
      stepByStepHowToUse: [
        '1. Look at the lower half of the left drawing toolbar.',
        '2. Click the Horseshoe Magnet icon to toggle Magnet Mode ON.',
        '3. Long-press the magnet icon to choose: "Weak Magnet" (snaps when close) or "Strong Magnet" (snaps aggressively).',
        '4. Now when you draw a horizontal ray or Fibonacci, your mouse automatically locks to the extreme tip of the wick!'
      ],
      ictProTip: 'Always turn on Magnet Mode when anchoring Fibonacci Retracements to ensure your 0.618 and 0.705 OTE levels are 100% mathematically synchronized with bank algorithms.',
      mt4Equivalent: 'MT4 Chart Settings (F8) -> Magnet Sensitivity (default 10 pixels).',
      previewGraphic: {
        title: 'Horseshoe Magnet Icon',
        description: 'Snap lines directly to wick extremes',
        asciiDiagram: `Left Bar:
 ┌───┐
 │ U │ ◄── Horseshoe Magnet Icon (Click to turn blue / ON)
 └───┘
 Snaps cursor to exact wick high: 1.29656!`
      }
    },

    // --- RIGHT TOOLBAR ---
    {
      id: 'watchlist-panel',
      name: 'Watchlist & Quotes Panel (Right Sidebar Top)',
      location: 'right-bar',
      shortcut: 'Alt + W',
      iconName: 'Layers',
      whatItDoes: 'Organizes your tradable currency pairs, monitors real-time bid/ask prices, percentage gains for the day, and lets you group assets into customized sections.',
      whyNewbiesNeedIt: 'Prevents analysis paralysis. Instead of randomly browsing 50 pairs, newbies can maintain a curated watchlist of the top 4 institutional pairs (GBP/USD, EUR/USD, USD/JPY, Gold).',
      stepByStepHowToUse: [
        '1. Click the top-most icon on the right vertical sidebar (List icon) or press Alt + W.',
        '2. Click the (+) button to add instruments.',
        '3. Right-click and choose "Add Section" to create categories like "Forex Majors" and "Prop Firm Challenge Pairs".',
        '4. Click the Flag icon next to any symbol to color code pairs currently setting up a trade.'
      ],
      ictProTip: 'Keep DXY (US Dollar Index) at the very top of your watchlist. 80% of institutional forex moves in EUR/USD and GBP/USD are an inverse mirror of DXY strength or weakness.',
      mt4Equivalent: 'MT4 Market Watch Window (Ctrl + M).',
      previewGraphic: {
        title: 'Right Watchlist Panel',
        description: 'Curated asset list with live prices',
        asciiDiagram: `Right Sidebar:
┌──────── Watchlist ────────┐
│ [★] DXY      104.25  +0.2%│
│ [★] GBPUSD   1.2916  -0.4%│ ◄── Cable
│ [★] EURUSD   1.0850  -0.3%│ ◄── Fiber
│ [★] XAUUSD   2035.5  +0.6%│ ◄── Gold
└───────────────────────────┘`
      }
    },
    {
      id: 'economic-calendar',
      name: 'Economic Calendar (Red Folder News Tracker)',
      location: 'right-bar',
      shortcut: 'Click Calendar icon on right toolbar',
      iconName: 'Calendar',
      whatItDoes: 'Embeds global macroeconomic event dates, consensus forecasts, and actual data releases (US CPI, Non-Farm Payrolls, Central Bank interest rates) right inside your chart.',
      whyNewbiesNeedIt: 'The #1 reason beginners blow accounts is getting blindsided by a high-impact news announcement that widens spreads and causes 80-pip slippage in 30 seconds.',
      stepByStepHowToUse: [
        '1. Click the small Calendar icon on the right vertical toolbar.',
        '2. Filter by currency: Select USD, EUR, and GBP.',
        '3. Look for High Impact releases (marked with 3 red stars or red color).',
        '4. Note the exact release time in Nairobi time (EAT).',
        '5. Rule: Be completely flat (no live open trades) 15 minutes before high-impact news.'
      ],
      ictProTip: 'Mark the high and low of the initial news release candle. The secondary retracement into the Fair Value Gap created by the news is often the cleanest institutional trade of the week.',
      mt4Equivalent: 'MT4 Terminal (Ctrl + T) -> "Calendar" tab at bottom.',
      previewGraphic: {
        title: 'Right Calendar Icon',
        description: 'Track CPI, NFP, and FOMC releases',
        asciiDiagram: `Right Bar:
 ┌─────┐
 │ 📅  │ ◄── Calendar Icon
 └─────┘
 Events:
  15:30 EAT: US Core CPI (High Impact!)
  17:00 EAT: Fed Chair Powell Speaks`
      }
    },

    // --- BOTTOM BAR ---
    {
      id: 'timezone-setting',
      name: 'Chart Timezone Selector (Setting Nairobi UTC+3 / EAT)',
      location: 'bottom-bar',
      shortcut: 'Click the clock at bottom-right corner',
      iconName: 'Clock',
      whatItDoes: 'Calibrates the bottom time scale to your exact local geographical timezone, ensuring your session open/close hours synchronize with London and New York banking desks.',
      whyNewbiesNeedIt: 'Most new traders in Kenya leave TradingView set to UTC or New York time, causing them to completely misjudge the 10:00 AM London open and 15:30 PM New York open!',
      stepByStepHowToUse: [
        '1. Look at the very bottom-right corner of the TradingView window.',
        '2. Click on the current timezone display (e.g. "UTC" or "14:32:05").',
        '3. Scroll down the list and select: "(UTC+3) Nairobi".',
        '4. Your chart candles and time grid are now 100% matched to East Africa Time (EAT)!'
      ],
      ictProTip: 'With Nairobi (UTC+3) selected, the institutional London Killzone is exactly 10:00 AM to 12:00 PM EAT, and the New York Killzone is exactly 15:30 PM to 17:30 PM EAT.',
      mt4Equivalent: 'MT4 uses broker server time (e.g. GMT+2 / GMT+3) which cannot be easily changed without custom indicators.',
      previewGraphic: {
        title: 'Bottom Right Timezone Selector',
        description: 'Set chart clock to Nairobi UTC+3',
        asciiDiagram: `Bottom Right Corner:
 ┌──────────────────────────────────────────────┐
 │ %  log  auto  |  14:35:12  (UTC+3) Nairobi  │ ◄── Click here!
 └──────────────────────────────────────────────┘`
      }
    },
    {
      id: 'paper-trading',
      name: 'Paper Trading Panel (Practice Broker Simulator)',
      location: 'bottom-bar',
      shortcut: 'Click "Trading Panel" at bottom',
      iconName: 'Laptop',
      whatItDoes: 'A built-in simulated execution broker that gives you a $100,000 virtual balance to buy, sell, set take profits, and trail stop losses on live tick data without risking real money.',
      whyNewbiesNeedIt: 'Allows beginners to practice executing orders, testing the Gilgil $2 rule, and calculating position sizing directly on TradingView charts before depositing money with FXPesa or HFM.',
      stepByStepHowToUse: [
        '1. Click the "Trading Panel" tab at the very bottom of the screen.',
        '2. Click "Paper Trading by TradingView" -> Connect.',
        '3. Click the Gear icon to reset the account balance to a realistic amount ($100, $500, or $1,000 instead of $100,000).',
        '4. Right-click on the chart -> Trade -> Create New Order.',
        '5. Enter your Stop Loss and Take Profit and click Buy/Sell to practice execution.'
      ],
      ictProTip: 'Reset your paper trading account to $100. Trade with 0.01 micro lots risking maximum $2.00 per trade. If you can grow $100 to $120 over 30 days, you are ready for a funded prop firm challenge.',
      mt4Equivalent: 'MT4 Demo Account (File -> Open an Account -> Demo Server).',
      previewGraphic: {
        title: 'Bottom Trading Panel',
        description: 'Connect simulated paper trading broker',
        asciiDiagram: `┌───────── Bottom Bar Tabs ─────────┐
│ Pine Editor | Strategy Tester | [ Trading Panel ] ◄── Connect Paper Trading!
└───────────────────────────────────┘`
      }
    }
  ];

  const filteredButtons = selectedCategory === 'all'
    ? tvButtons
    : tvButtons.filter((b) => b.location === selectedCategory);

  const activeBtnData = tvButtons.find((b) => b.id === activeButtonId) || tvButtons[0];

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/35 my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>SUB-PILLAR: TRADINGVIEW NAVIGATION LAB</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            TradingView Basics & Button-by-Button Navigation Guide
          </h3>
          <p className="text-xs text-slate-400">
            Never get lost again. Click any button or toolbar element below to see what it does, how to use it step-by-step, and its MT4/MT5 equivalent.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('visual-tour')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'visual-tour' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual Guide
          </button>
          <button
            onClick={() => setActiveTab('cheat-sheet')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'cheat-sheet' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shortcuts Cheat Sheet
          </button>
          <button
            onClick={() => setActiveTab('mt4-translation')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'mt4-translation' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            TV vs MT4/MT5 Matrix
          </button>
        </div>
      </div>

      {activeTab === 'visual-tour' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            <span className="text-slate-400 shrink-0">Filter Location:</span>
            {[
              { id: 'all', label: 'All Buttons (12)' },
              { id: 'top-bar', label: 'Top Toolbar (6)' },
              { id: 'left-bar', label: 'Left Drawing Bar (6)' },
              { id: 'right-bar', label: 'Right Sidebar (2)' },
              { id: 'bottom-bar', label: 'Bottom Bar (2)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1 rounded-xl transition shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Interactive Layout: Left list of buttons + Right Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Button Selector (5 cols) */}
            <div className="lg:col-span-5 space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredButtons.map((btn) => {
                const isSelected = btn.id === activeButtonId;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setActiveButtonId(btn.id)}
                    className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between gap-3 border ${
                      isSelected
                        ? 'bg-[#152038] border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {btn.location === 'top-bar' ? 'TOP' : btn.location === 'left-bar' ? 'LEFT' : btn.location === 'right-bar' ? 'RGHT' : 'BOT'}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold truncate text-white">{btn.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">
                          {btn.shortcut || 'Mouse Click'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Element Guide Card (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase font-bold">
                      {activeBtnData.location.replace('-', ' ').toUpperCase()}
                    </span>
                    {activeBtnData.shortcut && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {activeBtnData.shortcut}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    {activeBtnData.name}
                  </h4>
                </div>
              </div>

              {/* Visual ASCII / Graphic Preview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#D4AF37] font-bold">{activeBtnData.previewGraphic.title}</span>
                  <span className="text-slate-400">{activeBtnData.previewGraphic.description}</span>
                </div>
                <pre className="font-mono text-xs text-amber-200/90 bg-black/60 p-3 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/80">
                  {activeBtnData.previewGraphic.asciiDiagram}
                </pre>
              </div>

              {/* What It Does */}
              <div className="space-y-1 text-xs">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block">
                  What This Button Does:
                </span>
                <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {activeBtnData.whatItDoes}
                </p>
              </div>

              {/* Why Newbies Need It */}
              <div className="space-y-1 text-xs">
                <span className="font-mono text-[10px] text-amber-400 uppercase font-bold block">
                  Why A Beginner Needs To Know This:
                </span>
                <p className="text-slate-300 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                  {activeBtnData.whyNewbiesNeedIt}
                </p>
              </div>

              {/* Step By Step Instructions */}
              <div className="space-y-2 text-xs">
                <span className="font-mono text-[10px] text-[#00C261] uppercase font-bold block">
                  Step-by-Step Practical Application:
                </span>
                <div className="space-y-1.5">
                  {activeBtnData.stepByStepHowToUse.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-200 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00C261] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ICT Pro Secret & MT4 Equivalent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>ICT Institutional Pro Tip:</span>
                  </span>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {activeBtnData.ictProTip}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1">
                    <Laptop className="w-3 h-3 text-cyan-400" />
                    <span>MetaTrader 4/5 Equivalent:</span>
                  </span>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    {activeBtnData.mt4Equivalent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHORTCUTS CHEAT SHEET */}
      {activeTab === 'cheat-sheet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Essential TradingView Keyboard Shortcuts for Speed & Precision
            </h4>
            <span className="text-xs font-mono text-[#D4AF37]">Mac users replace Alt with Option, Ctrl with Cmd</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
            {[
              { key: 'Alt + T', action: 'Draw Trendline', tip: 'Fastest way to connect swing lows/highs' },
              { key: 'Alt + J', action: 'Horizontal Ray', tip: 'Project key levels to the right only' },
              { key: 'Alt + H', action: 'Horizontal Line', tip: 'Draws full-width support & resistance' },
              { key: 'Alt + F', action: 'Fibonacci Retracement', tip: 'Measure discount/premium OTE levels' },
              { key: 'Alt + Shift + R', action: 'Rectangle Tool', tip: 'Draw Order Blocks & Fair Value Gaps' },
              { key: 'Shift + Click', action: 'Pip Ruler / Measure', tip: 'Count exact pips & bars instantly' },
              { key: 'Alt + A', action: 'Create Price Alert', tip: 'Set alarm at key levels' },
              { key: 'Shift + R', action: 'Bar Replay Mode', tip: 'Rewind time for realistic backtesting' },
              { key: 'Alt + C', action: 'Crosshair Toggle', tip: 'Show exact price & time coordinates' },
              { key: 'Ctrl + Z', action: 'Undo Drawing', tip: 'Revert accidental mistakes' },
              { key: 'Ctrl + Y', action: 'Redo Action', tip: 'Restore deleted drawing' },
              { key: 'Spacebar', action: 'Next Symbol in Watchlist', tip: 'Cycle through pairs with 1 button' },
              { key: 'Shift + Spacebar', action: 'Previous Symbol', tip: 'Cycle backwards in watchlist' },
              { key: 'Number + Enter', action: 'Change Timeframe', tip: 'Type "15" for M15, "60" for H1, "D" for Daily' },
              { key: 'Alt + S', action: 'Take Chart Screenshot', tip: 'Save clean chart picture for journal' }
            ].map((sc, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-black border border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs">
                    {sc.key}
                  </span>
                  <span className="text-white font-bold text-xs">{sc.action}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{sc.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MT4 / MT5 TRANSLATION MATRIX */}
      {activeTab === 'mt4-translation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Cross-Platform Translation: TradingView vs MetaTrader 4 / MetaTrader 5
            </h4>
            <span className="text-xs font-mono text-cyan-400">Institutional Multi-Platform Workflow</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="p-3">Function / Goal</th>
                  <th className="p-3 text-[#D4AF37]">TradingView Command</th>
                  <th className="p-3 text-cyan-400">MT4 / MT5 Equivalent</th>
                  <th className="p-3">Best Practice Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                <tr>
                  <td className="p-3 font-bold text-white">Count Pips Distance</td>
                  <td className="p-3 text-[#D4AF37]">Hold Shift + Click & Drag</td>
                  <td className="p-3 text-cyan-400">Middle Click Crosshair + Drag</td>
                  <td className="p-3 text-slate-300">Always check pips before placing stop loss</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Draw Order Block / FVG</td>
                  <td className="p-3 text-[#D4AF37]">Rectangle Tool (Alt+Shift+R)</td>
                  <td className="p-3 text-cyan-400">Insert → Shapes → Rectangle</td>
                  <td className="p-3 text-slate-300">Draw from candle body to wick; extend right</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Golden Pocket Fib</td>
                  <td className="p-3 text-[#D4AF37]">Fib Retracement (Alt+F)</td>
                  <td className="p-3 text-cyan-400">Insert → Fibonacci → Retracement</td>
                  <td className="p-3 text-slate-300">Customize levels to 0.618, 0.705 (OTE), 0.786</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Execute Orders</td>
                  <td className="p-3 text-[#D4AF37]">Paper Trading or Broker Integration</td>
                  <td className="p-3 text-cyan-400">Press F9 → New Order Window</td>
                  <td className="p-3 text-slate-300">Analyze on TradingView, Execute on MT4/MT5</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Rewind Time / Backtesting</td>
                  <td className="p-3 text-[#D4AF37]">Bar Replay (Shift+R)</td>
                  <td className="p-3 text-cyan-400">Ctrl + R (Strategy Tester)</td>
                  <td className="p-3 text-slate-300">TradingView replay is 10x smoother for manual practice</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Set Price Alarm</td>
                  <td className="p-3 text-[#D4AF37]">Alt + A or click (+) on price scale</td>
                  <td className="p-3 text-cyan-400">Terminal (Ctrl+T) → Alerts tab</td>
                  <td className="p-3 text-slate-300">TradingView mobile alerts work even when MT4 is closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
