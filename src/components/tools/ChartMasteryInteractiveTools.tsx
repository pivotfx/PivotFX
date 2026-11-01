import React, { useState } from 'react';
import {
  CandlestickChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Scan,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  ExternalLink,
  Magnet,
  Clock,
  Square,
  Crosshair,
  Compass,
  FileSpreadsheet,
  Zap,
  HelpCircle
} from 'lucide-react';
import { CandlestickVisualizer, CandleData } from '../common/CandlestickVisualizer';

interface ChartToolElement {
  id: string;
  name: string;
  shortcut: string;
  iconName: string;
  category: 'drawing' | 'measurement' | 'execution' | 'analysis';
  whatItDoes: string;
  whenToUse: string[];
  howToUseSteps: string[];
  newbieSample: {
    pair: string;
    scenario: string;
    exactAction: string;
    commonMistake: string;
  };
  visualCandles: CandleData[];
  trendType?: 'bullish' | 'bearish' | 'reversal' | 'range';
  supportLevel?: number;
  resistanceLevel?: number;
  entryLevel?: number;
  slLevel?: number;
  tpLevel?: number;
  fvgZone?: { top: number; bottom: number; label: string };
  trendline?: { startIndex: number; startPrice: number; endIndex: number; endPrice: number; label?: string };
  fibLevels?: { level: number; price: number; label: string }[];
}

export const ChartMasteryInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live-chart' | 'tv-school' | 'mt4-school'>('live-chart');
  const [selectedPair, setSelectedPair] = useState<string>('EURUSD');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('15');
  const [activeToolId, setActiveToolId] = useState<string>('trendline');
  const [mt4ActiveId, setMt4ActiveId] = useState<string>('crosshair');

  const pairsList = [
    { code: 'EURUSD', label: 'EUR/USD', type: 'Major Forex' },
    { code: 'GBPUSD', label: 'GBP/USD', type: 'High Volatility' },
    { code: 'USDJPY', label: 'USD/JPY', type: 'Asian Session' },
    { code: 'OANDA:XAUUSD', label: 'XAU/USD (Gold)', type: 'Commodity' },
    { code: 'US30', label: 'US30 (Dow Jones)', type: 'Index' },
    { code: 'BINANCE:BTCUSDT', label: 'BTC/USDT', type: 'Crypto' },
  ];

  const timeframesList = [
    { code: '1', label: '1m', desc: 'Scalping' },
    { code: '5', label: '5m', desc: 'Execution' },
    { code: '15', label: '15m', desc: 'Core Setup' },
    { code: '60', label: '1h', desc: 'Intraday Bias' },
    { code: '240', label: '4h', desc: 'Institutional Structure' },
    { code: 'D', label: 'Daily', desc: 'Major Trend' },
  ];

  // 10 Comprehensive TradingView Elements
  const tvElements: ChartToolElement[] = [
    {
      id: 'trendline',
      name: 'Trendline Tool',
      shortcut: 'Alt + T',
      iconName: 'TrendingUp',
      category: 'drawing',
      whatItDoes: 'Connects consecutive swing points (higher lows in an uptrend, or lower highs in a downtrend) to visually track market momentum and detect dynamic breakout points.',
      whenToUse: [
        'Use when the market is printing clear directional swing structure (at least 2 verified swing lows or highs).',
        'Use to identify when momentum is accelerating or when a dynamic trend support is about to break.',
        'Never force a trendline on choppy, sideways consolidations.'
      ],
      howToUseSteps: [
        '1. Press Alt + T on your keyboard or select the Trendline icon from the left drawing toolbar.',
        '2. Turn ON Magnet Mode (horseshoe icon on the left bar) so your line snaps precisely to the exact candle wick low.',
        '3. Click the first major swing low (Point A).',
        '4. Drag and click on the second higher swing low (Point B). The line will now project forward into future candles.',
        '5. Wait for price to touch the line for an entry bounce, or wait for a full body candle close through it for a breakout signal.'
      ],
      newbieSample: {
        pair: 'EUR/USD (M15)',
        scenario: 'Uptrend from London session open into New York morning.',
        exactAction: 'Connect Swing Low 1 at 1.0820 with Swing Low 2 at 1.0845. When Candle 5 tests the projected trendline at 1.0862 and prints a bullish rejection wick, enter Long with Stop Loss below the wick.',
        commonMistake: 'Drawing the line cutting through the middle of candle bodies. Professional trendlines touch the wicks without slicing real bodies!'
      },
      trendType: 'bullish',
      trendline: { startIndex: 0, startPrice: 1.0820, endIndex: 4, endPrice: 1.0865, label: 'Dynamic Support Trendline' },
      visualCandles: [
        { id: 1, open: 1.0825, high: 1.0838, low: 1.0820, close: 1.0835, label: 'Low 1 (Anchor)' },
        { id: 2, open: 1.0835, high: 1.0855, low: 1.0832, close: 1.0850 },
        { id: 3, open: 1.0850, high: 1.0868, low: 1.0845, close: 1.0865, label: 'Higher High' },
        { id: 4, open: 1.0865, high: 1.0870, low: 1.0852, close: 1.0854, label: 'Pullback' },
        { id: 5, open: 1.0854, high: 1.0875, low: 1.0852, close: 1.0872, label: 'Bounce (Entry)' },
        { id: 6, open: 1.0872, high: 1.0890, low: 1.0870, close: 1.0888, label: 'Impulse Target' },
      ],
      entryLevel: 1.0855,
      slLevel: 1.0840,
      tpLevel: 1.0890,
    },
    {
      id: 'horizontal',
      name: 'Horizontal Line / Ray',
      shortcut: 'Alt + H / Alt + J',
      iconName: 'Minus',
      category: 'drawing',
      whatItDoes: 'Draws a perfectly flat horizontal price level spanning across your entire chart. Crucial for mapping institutional supply, demand, session highs/lows, and previous daily levels.',
      whenToUse: [
        'Mark previous day high (PDH) and previous day low (PDL) at 00:00 UTC.',
        'Mark clean support floors where price bounced 2 or more times.',
        'Mark institutional round psychological numbers (e.g. 1.0800, 1.0900, 2050.00).'
      ],
      howToUseSteps: [
        '1. Press Alt + H while hovering over your target price peak or trough.',
        '2. Use the color picker to color code: Blue for 4H Levels, Green for Support, Red for Resistance.',
        '3. Double-click the line to set an exact price coordinate down to the 5th decimal (e.g. 1.08500).',
        '4. Right click -> Add Alert on Horizontal Line so your phone rings when price arrives.'
      ],
      newbieSample: {
        pair: 'GBP/USD (H1)',
        scenario: 'Double top rejection at Asian session high.',
        exactAction: 'Place Alt+H at 1.2720. When New York open pushes upward but wicks off 1.2720 leaving a red pinbar, execute Sell order.',
        commonMistake: 'Treating a horizontal line as an invisible brick wall. Price will often pierce it by 3 to 7 pips to sweep retail stop losses before turning around!'
      },
      trendType: 'reversal',
      resistanceLevel: 1.2720,
      supportLevel: 1.2660,
      visualCandles: [
        { id: 1, open: 1.2680, high: 1.2718, low: 1.2675, close: 1.2712 },
        { id: 2, open: 1.2712, high: 1.2720, low: 1.2700, close: 1.2705, label: 'Touch 1' },
        { id: 3, open: 1.2705, high: 1.2710, low: 1.2680, close: 1.2685 },
        { id: 4, open: 1.2685, high: 1.2722, low: 1.2682, close: 1.2715, label: 'Fakeout Sweep' },
        { id: 5, open: 1.2715, high: 1.2718, low: 1.2670, close: 1.2672, label: 'Rejection Close' },
        { id: 6, open: 1.2672, high: 1.2675, low: 1.2645, close: 1.2650, label: 'Cascade' },
      ],
      slLevel: 1.2730,
      entryLevel: 1.2700,
      tpLevel: 1.2650,
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci Retracement',
      shortcut: 'Alt + F',
      iconName: 'Sliders',
      category: 'drawing',
      whatItDoes: 'Calculates mathematical discount ratios (38.2%, 50%, 61.8% Golden Pocket, and 78.6%) of an impulse wave to reveal the exact zone where institutions look to enter at wholesale prices.',
      whenToUse: [
        'Only draw after a clean, impulsive trend leg has finished and is starting to pull back.',
        'Focus on the 0.50 (Equilibrium) and 0.618 (Golden Pocket) levels for the highest win rate.',
        'Never draw Fibonacci in the middle of an incomplete expansion candle.'
      ],
      howToUseSteps: [
        '1. Press Alt + F or select Fibonacci Retracement from the 3rd left menu.',
        '2. For a Bullish trend: Click the absolute lowest wick of the impulse move, drag upward, and release on the highest wick peak.',
        '3. For a Bearish trend: Click the highest swing high and drag downward to the lowest swing low.',
        '4. Watch the 0.50 and 0.618 gold zone. When price dips into this box and stalls, that is your high-probability entry trigger.'
      ],
      newbieSample: {
        pair: 'XAU/USD Gold (M15)',
        scenario: 'Gold rallied from $2020.00 to $2040.00 during London open.',
        exactAction: 'Anchor Fib at 2020.00 and top at 2040.00. The 50% retracement sits at 2030.00, and 61.8% is 2027.60. Set Buy Limit orders inside the 2028-2030 zone with Stop Loss at 2023.00.',
        commonMistake: 'Leaving all default 15 fib levels enabled. Clean your TradingView settings to keep only 0, 0.5, 0.618, 0.786, and 1.0 to avoid chart clutter!'
      },
      trendType: 'bullish',
      fibLevels: [
        { level: 1.0, price: 2040.0, label: '100% Swing High' },
        { level: 0.618, price: 2027.6, label: '61.8% Golden Pocket' },
        { level: 0.5, price: 2030.0, label: '50.0% Equilibrium' },
        { level: 0.0, price: 2020.0, label: '0.0% Swing Low' },
      ],
      visualCandles: [
        { id: 1, open: 2021.0, high: 2028.0, low: 2020.0, close: 2027.5, label: 'Impulse Start' },
        { id: 2, open: 2027.5, high: 2036.0, low: 2027.0, close: 2035.0 },
        { id: 3, open: 2035.0, high: 2040.0, low: 2034.0, close: 2039.5, label: 'Peak (100%)' },
        { id: 4, open: 2039.5, high: 2039.5, low: 2033.0, close: 2033.5, label: 'Pullback' },
        { id: 5, open: 2033.5, high: 2034.0, low: 2028.5, close: 2029.0, label: 'Hits 61.8%' },
        { id: 6, open: 2029.0, high: 2037.0, low: 2028.0, close: 2036.5, label: 'Explosion Up' },
      ],
      entryLevel: 2029.0,
      slLevel: 2023.0,
      tpLevel: 2045.0,
    },
    {
      id: 'long-position',
      name: 'Long Position Tool (Risk-Reward)',
      shortcut: 'Toolbar -> Prediction Tools',
      iconName: 'Target',
      category: 'execution',
      whatItDoes: 'Calculates your exact Risk-Reward Ratio (RRR), monetary loss at Stop Loss, and profit at Take Profit before you enter a Buy trade. Replaces guessing with mathematical precision.',
      whenToUse: [
        'Before every single trade you click buy on your broker.',
        'Ensures your trade offers at least 1:2 or 1:3 Risk to Reward.',
        'Shows you the exact pip distance to set in MT4/MT5.'
      ],
      howToUseSteps: [
        '1. Select the "Long Position" tool from the 7th left toolbar item.',
        '2. Click on the planned entry candle close price.',
        '3. Drag the red bottom handle to just beneath the recent invalidation swing low (Stop Loss).',
        '4. Drag the green top handle to your target resistance or liquidity pool (Take Profit).',
        '5. Read the center number: if "Risk/Reward Ratio: 2.50", this means risking $2 gives $5 profit!'
      ],
      newbieSample: {
        pair: 'USD/JPY (M15)',
        scenario: 'Buying a pullback at 154.200.',
        exactAction: 'Entry: 154.200. SL: 154.050 (15 pips risk). TP: 154.650 (45 pips reward). Tool calculates RRR = 3.00. High quality setup!',
        commonMistake: 'Entering a trade where the green profit zone is smaller than the red risk zone (e.g. risking 30 pips to make 10 pips = guaranteed account blow up).'
      },
      trendType: 'bullish',
      entryLevel: 154.20,
      slLevel: 154.05,
      tpLevel: 154.65,
      visualCandles: [
        { id: 1, open: 154.00, high: 154.15, low: 153.98, close: 154.10 },
        { id: 2, open: 154.10, high: 154.30, low: 154.08, close: 154.25 },
        { id: 3, open: 154.25, high: 154.28, low: 154.18, close: 154.20, label: 'Entry Candle' },
        { id: 4, open: 154.20, high: 154.45, low: 154.18, close: 154.42 },
        { id: 5, open: 154.42, high: 154.65, low: 154.38, close: 154.62, label: '1:3 TP Reached' },
      ],
    },
    {
      id: 'short-position',
      name: 'Short Position Tool (Sell RRR)',
      shortcut: 'Toolbar -> Prediction Tools',
      iconName: 'TrendingDown',
      category: 'execution',
      whatItDoes: 'Calculates risk-to-reward for Sell orders. Red zone sits above entry (Stop Loss) and green zone projects downward into target support (Take Profit).',
      whenToUse: [
        'Whenever executing a bearish breakdown, Tower Top reversal, or resistance rejection.',
        'Verifies that your take profit is realistic before the next major support zone.'
      ],
      howToUseSteps: [
        '1. Click Short Position tool.',
        '2. Click on the sell trigger candle close.',
        '3. Position the red stop loss 3-5 pips above the tower top high.',
        '4. Extend the green profit target to the 50 EMA or previous session low.',
        '5. Ensure RRR is at least 2.0.'
      ],
      newbieSample: {
        pair: 'EUR/USD (M15)',
        scenario: 'Gilgil Tower Top Reversal at 1.0890.',
        exactAction: 'Sell at 1.0875. SL at 1.0895 (20 pips risk). TP at 1.0815 (60 pips reward). RRR = 3.00.',
        commonMistake: 'Moving the Stop Loss further away while the trade is active because you are scared of losing. Never widen a stop loss!'
      },
      trendType: 'bearish',
      entryLevel: 1.0875,
      slLevel: 1.0895,
      tpLevel: 1.0815,
      visualCandles: [
        { id: 1, open: 1.0850, high: 1.0890, low: 1.0848, close: 1.0885, label: 'Tower High' },
        { id: 2, open: 1.0885, high: 1.0892, low: 1.0870, close: 1.0872, label: 'Breakdown' },
        { id: 3, open: 1.0872, high: 1.0876, low: 1.0850, close: 1.0852 },
        { id: 4, open: 1.0852, high: 1.0855, low: 1.0830, close: 1.0832 },
        { id: 5, open: 1.0832, high: 1.0835, low: 1.0815, close: 1.0818, label: 'Target Hit' },
      ],
    },
    {
      id: 'rectangle-fvg',
      name: 'Rectangle (Order Block & FVG Zone)',
      shortcut: 'Alt + R',
      iconName: 'Square',
      category: 'drawing',
      whatItDoes: 'Creates shaded rectangular boxes to outline Fair Value Gaps (FVG), institutional Order Blocks, and consolidation ranges that price will revisit.',
      whenToUse: [
        'Highlight the 3-candle imbalance gap (FVG) where institutions injected aggressive volume.',
        'Box the Asian session consolidation (22:00 to 07:00 GMT) to prepare for the London sweep.',
        'Highlight breaker blocks and supply/demand zones.'
      ],
      howToUseSteps: [
        '1. Press Alt + R or select Rectangle from the Shapes menu.',
        '2. Click at the top-left coordinate of the imbalance zone.',
        '3. Drag to the right across into future empty space and click to set the bottom right coordinate.',
        '4. Set opacity to 25% with blue or gold outline for high readability.'
      ],
      newbieSample: {
        pair: 'GBP/USD (M15)',
        scenario: 'Fair Value Gap created by London open expansion.',
        exactAction: 'Candle 1 high is 1.2640. Candle 3 low is 1.2670. Draw rectangle between 1.2640 and 1.2670. When Candle 5 re-tests 1.2655, buy the mitigation!',
        commonMistake: 'Drawing 20 overlapping boxes until the chart looks like a coloring book. Only keep the 2 most recent active unmitigated zones!'
      },
      trendType: 'bullish',
      fvgZone: { top: 1.2670, bottom: 1.2640, label: 'Bullish FVG Value Zone' },
      visualCandles: [
        { id: 1, open: 1.2620, high: 1.2640, low: 1.2615, close: 1.2635, label: 'Candle 1' },
        { id: 2, open: 1.2635, high: 1.2690, low: 1.2630, close: 1.2685, label: 'Expansion' },
        { id: 3, open: 1.2685, high: 1.2710, low: 1.2670, close: 1.2705, label: 'Candle 3' },
        { id: 4, open: 1.2705, high: 1.2708, low: 1.2655, close: 1.2660, label: 'Retest Gap' },
        { id: 5, open: 1.2660, high: 1.2725, low: 1.2655, close: 1.2720, label: 'Continuation' },
      ],
      entryLevel: 1.2655,
      slLevel: 1.2630,
      tpLevel: 1.2720,
    },
    {
      id: 'measure-tool',
      name: 'Date & Price Range Measure Tool',
      shortcut: 'Shift + Click',
      iconName: 'Maximize2',
      category: 'measurement',
      whatItDoes: 'Measures exact pip distance, percentage change, and candle count between any two points on your chart in one instant gesture.',
      whenToUse: [
        'Calculate stop loss pips before typing lot size into your broker.',
        'Measure average daily range (ADR) to know if a pair has already moved its typical daily capacity.',
        'Check how many candles it took for a consolidation to break out.'
      ],
      howToUseSteps: [
        '1. Hold down the SHIFT key on your keyboard.',
        '2. Click on the start candle (e.g. your entry price).',
        '3. Move your mouse to the invalidation point (Stop Loss).',
        '4. Read the tooltip box: e.g. "-24.5 pips, 6 bars (1h 30m)". Release shift.'
      ],
      newbieSample: {
        pair: 'USD/CAD (H1)',
        scenario: 'Sizing a trade with the Gilgil $2 rule.',
        exactAction: 'Shift-click measures 20.0 pips to Stop Loss. Using the formula (Risk $2 / 20 pips = $0.10/pip), you know to open exactly 0.01 micro lot!',
        commonMistake: 'Guessing pip distance with the naked eye. An optical illusion can make a 40-pip candle look like 10 pips if zoomed in!'
      },
      trendType: 'bearish',
      visualCandles: [
        { id: 1, open: 1.3500, high: 1.3525, low: 1.3495, close: 1.3520, label: 'High' },
        { id: 2, open: 1.3520, high: 1.3522, low: 1.3490, close: 1.3495 },
        { id: 3, open: 1.3495, high: 1.3500, low: 1.3470, close: 1.3475, label: '-45.0 Pips' },
        { id: 4, open: 1.3475, high: 1.3480, low: 1.3450, close: 1.3455 },
      ],
    },
    {
      id: 'magnet-mode',
      name: 'Magnet Mode (Weak vs Strong)',
      shortcut: 'Horseshoe Icon on Left Bar',
      iconName: 'Magnet',
      category: 'drawing',
      whatItDoes: 'Forces your cursor to automatically snap onto the nearest Open, High, Low, or Close of a candlestick. Eliminates human drawing error.',
      whenToUse: [
        'Always keep Magnet ON when drawing trendlines, Fibonacci anchors, or horizontal levels.',
        'Weak Magnet snaps only when your cursor is close (recommended). Strong Magnet snaps aggressively from anywhere.'
      ],
      howToUseSteps: [
        '1. Look at the vertical toolbar on the far left edge of TradingView.',
        '2. Click the Magnet icon (horseshoe shape). It turns blue.',
        '3. When you draw a line near a wick tip, watch the cursor magnetically lock to the exact micro-pip value.'
      ],
      newbieSample: {
        pair: 'EUR/USD',
        scenario: 'Snapping to the exact London low.',
        exactAction: 'With Magnet enabled, hovering near the wick tip snaps your Fibonacci anchor perfectly to 1.08234 rather than an inaccurate 1.08241.',
        commonMistake: 'Leaving Magnet off and missing a limit order fill by 0.3 pips because your line was drawn slightly off the true wick!'
      },
      trendType: 'bullish',
      visualCandles: [
        { id: 1, open: 1.0810, high: 1.0825, low: 1.0805, close: 1.0820, label: 'Magnet Snap Low' },
        { id: 2, open: 1.0820, high: 1.0845, low: 1.0818, close: 1.0840 },
        { id: 3, open: 1.0840, high: 1.0870, low: 1.0838, close: 1.0868, label: 'Magnet Snap High' },
      ],
      trendline: { startIndex: 0, startPrice: 1.0805, endIndex: 2, endPrice: 1.0868, label: 'Snapped to Exact Wicks' },
    },
    {
      id: 'timeframe-selector',
      name: 'Timeframe Selector (Top-Down Logic)',
      shortcut: 'Type 15, 60, D directly on chart',
      iconName: 'Clock',
      category: 'analysis',
      whatItDoes: 'Switches the aggregate duration of each candlestick. Pro traders never trade a single timeframe; they use a 3-tier top-down methodology.',
      whenToUse: [
        'Tier 1 (Daily / H4): Find the Macro Direction and key institutional supply/demand zones.',
        'Tier 2 (H1 / M15): Identify intermediate market structure (Tower Top, FVG, Trendline).',
        'Tier 3 (M5 / M1): Sniper entry timing with tightest stop loss.'
      ],
      howToUseSteps: [
        '1. Top-left corner of TradingView has the timeframe pill bar (1m, 5m, 15m, 1h, 4h, D).',
        '2. Or simply type the number "15" on your keyboard and hit Enter to jump instantly to M15.',
        '3. Click the star icon next to 5m, 15m, 1h, and 4h to favorite them to your permanent top bar.'
      ],
      newbieSample: {
        pair: 'GBP/USD',
        scenario: 'Avoiding the fakeout trap.',
        exactAction: 'H4 shows strong downtrend. M5 shows a quick green rally. The newbie buys M5 and loses. The pro waits for the M5 rally to hit H4 resistance, then sells for a 1:4 win!',
        commonMistake: 'Scalping on the 1-minute chart without knowing what the 4-hour chart is doing.'
      },
      trendType: 'range',
      visualCandles: [
        { id: 1, open: 1.2500, high: 1.2550, low: 1.2480, close: 1.2540, label: 'Daily Candle' },
        { id: 2, open: 1.2540, high: 1.2580, low: 1.2530, close: 1.2570, label: 'Contains 96 M15 Candles' },
      ],
    },
    {
      id: 'indicators-panel',
      name: 'Indicators Panel (EMA 20/50 + RSI)',
      shortcut: 'Slash Key ( / )',
      iconName: 'Sliders',
      category: 'analysis',
      whatItDoes: 'Adds technical mathematical overlays to your chart. For PivotFx, we run a minimalist two-indicator system: EMA 20/50 for dynamic trend filter and RSI (14) for momentum divergence.',
      whenToUse: [
        'EMA 20 > EMA 50: Bullish trend environment. Look only for Long pullbacks.',
        'EMA 20 < EMA 50: Bearish trend environment. Look only for Short rejections.',
        'RSI > 70 with higher price high: Bearish Divergence warning (Tower Top imminent!).'
      ],
      howToUseSteps: [
        '1. Press "/" or click "Indicators" at the top center.',
        '2. Type "Moving Average Exponential" and click it twice.',
        '3. Click gear settings icon on indicator 1 -> set Length to 20, Color to Cyan.',
        '4. Click gear on indicator 2 -> set Length to 50, Color to Gold / Amber.',
        '5. Search "Relative Strength Index" -> set Length to 14.'
      ],
      newbieSample: {
        pair: 'EUR/USD (M15)',
        scenario: 'Value Zone entry filter.',
        exactAction: 'Price is above 20 & 50 EMA. Price pulls back into the gap between 20 and 50 EMA (the "Value Zone") while RSI cools off to 48. Buy with tight stop beneath 50 EMA.',
        commonMistake: 'Adding 10 different indicators (MACD, Bollinger Bands, Stochastics, Ichimoku) that contradict each other and paralyze your decisions.'
      },
      trendType: 'bullish',
      visualCandles: [
        { id: 1, open: 1.0800, high: 1.0830, low: 1.0795, close: 1.0825, label: '20 EMA Cross' },
        { id: 2, open: 1.0825, high: 1.0850, low: 1.0820, close: 1.0845 },
        { id: 3, open: 1.0845, high: 1.0848, low: 1.0832, close: 1.0835, label: 'Value Zone Test' },
        { id: 4, open: 1.0835, high: 1.0865, low: 1.0832, close: 1.0860, label: '50 EMA Bounce' },
      ],
      entryLevel: 1.0835,
      slLevel: 1.0815,
      tpLevel: 1.0880,
    },
  ];

  // MT4 / MT5 Platform Core Sub-Cards
  const mt4Elements = [
    {
      id: 'crosshair',
      title: 'Crosshair Tool (Ctrl + F)',
      icon: 'Crosshair',
      what: 'Displays precise coordinate cross lines with exact price on Y axis and date/time on X axis. Clicking and dragging measures: [Bars Count / Pip Distance / Current Price].',
      how: 'Press Ctrl+F or click middle mouse wheel. Click on Candle A wick, drag to Candle B wick. The middle number in the bracket (e.g. 154) is pips in pipette format (15.4 standard pips).',
      sample: 'Measuring stop loss on EUR/USD: drag reads [5 / 182 / 1.08420] = 5 candles, 18.2 pips distance.'
    },
    {
      id: 'order-types',
      title: 'Order Types (Instant vs Limits vs Stops)',
      icon: 'Zap',
      what: 'Understanding the 4 pending order mechanics: Buy Limit (buy below market on a dip), Sell Limit (sell above market on a pump), Buy Stop (buy after breakout above high), Sell Stop (sell after breakdown below low).',
      how: 'Press F9 to open New Order window. Switch "Type" dropdown from Market Execution to Pending Order. Select Buy Limit, enter target wholesale price, SL, and TP, then click Place.',
      sample: 'Gilgil Tower Top short: Place a Sell Limit at 1.2965 with SL at 1.2985. You do not need to sit watching screen all day; MT5 fills you automatically!'
    },
    {
      id: 'market-watch',
      title: 'Market Watch & Live Spread Check',
      icon: 'Compass',
      what: 'The left sidebar showing all tradable symbols with Bid and Ask prices. Right click -> Spread to display the live broker fee in real time.',
      how: 'Press Ctrl+M. Right click inside -> Columns -> Tick "Spread". If spread is 8 on EUR/USD, that is 0.8 pips. If spread suddenly widens to 45 at 23:59 GMT (rollover), do NOT trade!',
      sample: 'Checking FXPesa CMA spread: EUR/USD typically 0.6 to 1.1 pips during London/NY. Offshore FBS around 0.9 pips.'
    },
    {
      id: 'one-click',
      title: 'One-Click Trading & Rapid Execution',
      icon: 'Sliders',
      what: 'Overlay on top-left of the chart displaying instant Buy/Sell buttons and lot size input box for zero-delay order submission.',
      how: 'Press Alt+T in MT4/MT5 to toggle One-Click box. Type your pre-calculated lot size (e.g. 0.02) into the center box. Click SELL or BUY with a single mouse click.',
      sample: 'Always calculate lot size BEFORE opening the one-click tool so you never accidentally execute default 1.00 standard lot on a $50 account.'
    },
    {
      id: 'terminal',
      title: 'Terminal / Trade Tab & Trailing Stop',
      icon: 'FileSpreadsheet',
      what: 'Bottom workstation window (Ctrl+T) tracking your Balance, Equity, Free Margin, and open floating PnL.',
      how: 'Press Ctrl+T. View open orders. Right click an open winning position -> Trailing Stop -> set 15 points (1.5 pips). MT5 will automatically drag your SL behind price as it rallies.',
      sample: 'When a trade hits 1:1 profit, right click order -> Modify -> move Stop Loss to your Entry Price to make the trade 100% Risk-Free.'
    }
  ];

  const currentTool = tvElements.find((t) => t.id === activeToolId) || tvElements[0];

  return (
    <div className="space-y-6">
      {/* Top Workstation Switcher Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-[#D4AF37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
            <CandlestickChart className="w-4 h-4" />
            <span>Chart Mastery Workstation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Real Working TradingView Studio & Platform Tools Academy
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Interact with live market charts, master every TradingView drawing tool with real candlestick samples, and learn MT4/MT5 platform execution.
          </p>
        </div>

        {/* 3 Main Modes */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab('live-chart')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === 'live-chart'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CandlestickChart className="w-3.5 h-3.5" />
            <span>Live TradingView</span>
          </button>

          <button
            onClick={() => setActiveTab('tv-school')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === 'tv-school'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>TradingView School (10 Tools)</span>
          </button>

          <button
            onClick={() => setActiveTab('mt4-school')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === 'mt4-school'
                ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>MT4 / MT5 School</span>
          </button>
        </div>
      </div>

      {/* TAB 1: REAL WORKING TRADINGVIEW LIVE CHART */}
      {activeTab === 'live-chart' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Pair & Timeframe Selector Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Pairs presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold mr-1">
                Asset:
              </span>
              {pairsList.map((p) => (
                <button
                  key={p.code}
                  onClick={() => setSelectedPair(p.code)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition border ${
                    selectedPair === p.code
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Timeframe presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold mr-1">
                TF:
              </span>
              {timeframesList.map((tf) => (
                <button
                  key={tf.code}
                  onClick={() => setSelectedTimeframe(tf.code)}
                  className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition border ${
                    selectedTimeframe === tf.code
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title={tf.desc}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Real Embedded TradingView Widget */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#060910] shadow-2xl">
            {/* Live Chart Header Status */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono font-bold text-white">Live Institutional Feed</span>
                <span className="text-slate-500">|</span>
                <span className="text-[#D4AF37] font-mono font-semibold">
                  {selectedPair.replace('OANDA:', '').replace('BINANCE:', '')} • {selectedTimeframe}m Timeframe
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>Timezone: Africa/Nairobi (EAT)</span>
              </div>
            </div>

            {/* Live TradingView Widget Iframe */}
            <div className="w-full h-[560px]">
              <iframe
                title="TradingView Real-Time Chart"
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${encodeURIComponent(
                  selectedPair
                )}&interval=${selectedTimeframe}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Africa%2FNairobi&studies_overrides=%7B%7D&overrides=%7B%22mainSeriesProperties.candleStyle.upColor%22%3A%22%2300C261%22%2C%22mainSeriesProperties.candleStyle.downColor%22%3A%22%23ef4444%22%2C%22mainSeriesProperties.candleStyle.drawWick%22%3Atrue%2C%22mainSeriesProperties.candleStyle.drawBorder%22%3Atrue%2C%22mainSeriesProperties.candleStyle.borderColor%22%3A%22%2337a6ef%22%2C%22mainSeriesProperties.candleStyle.borderUpColor%22%3A%22%2300C261%22%2C%22mainSeriesProperties.candleStyle.borderDownColor%22%3A%22%23ef4444%22%2C%22mainSeriesProperties.candleStyle.wickUpColor%22%3A%22%2300C261%22%2C%22mainSeriesProperties.candleStyle.wickDownColor%22%3A%22%23ef4444%22%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=pivotfxlab`}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRADINGVIEW SCHOOL — COMPLETE SUB-CARDS */}
      {activeTab === 'tv-school' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Quick Sub-Cards Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {tvElements.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className={`p-3 rounded-2xl text-left transition border flex flex-col justify-between ${
                  activeToolId === tool.id
                    ? 'bg-[#152038] border-[#D4AF37] text-white shadow-[0_0_16px_rgba(212,175,55,0.2)]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold block">
                    {tool.shortcut}
                  </span>
                  <span className="text-xs font-bold block mt-1 line-clamp-1">{tool.name}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase mt-2">
                  {tool.category}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Tool In-Depth Sub-Card */}
          <div className="rounded-3xl bg-slate-900/90 border border-[#D4AF37]/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#D4AF37] text-black font-mono font-bold text-xs">
                    {currentTool.shortcut}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                    TradingView Core Element
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {currentTool.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {currentTool.whatItDoes}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 block text-[10px]">Element Category</span>
                <span className="text-[#D4AF37] font-bold uppercase">{currentTool.category} Tool</span>
              </div>
            </div>

            {/* REAL INTERACTIVE CANDLESTICK ILLUSTRATION OF THIS TOOL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase flex items-center gap-1.5">
                  <CandlestickChart className="w-4 h-4" />
                  <span>Interactive Real Candlestick Illustration: How {currentTool.name} Works</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Click or hover any candlestick for OHLC & pip details
                </span>
              </div>

              <CandlestickVisualizer
                title={`${currentTool.name} Illustrated on Live Candlesticks`}
                subtitle={`Notice how professional traders snap tools precisely to candlestick wicks and bodies`}
                candles={currentTool.visualCandles}
                trendType={currentTool.trendType}
                supportLevel={currentTool.supportLevel}
                resistanceLevel={currentTool.resistanceLevel}
                entryLevel={currentTool.entryLevel}
                slLevel={currentTool.slLevel}
                tpLevel={currentTool.tpLevel}
                fvgZone={currentTool.fvgZone}
                trendline={currentTool.trendline}
                fibLevels={currentTool.fibLevels}
              />
            </div>

            {/* 2-Column Instructions: When to Use & Step-by-Step Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* When to Use */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>When to Use (Institutional Criteria)</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentTool.whenToUse.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step How to Use (For Newbies) */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>Step-by-Step How to Use (For Total Beginners)</span>
                </h4>
                <ol className="space-y-2 text-xs text-slate-300">
                  {currentTool.howToUseSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Newbie Real-World Market Sample Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-[#0F172A] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono font-bold text-xs">
                    {currentTool.newbieSample.pair}
                  </span>
                  <span className="text-xs font-bold text-white">
                    Real Beginner Execution Case
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {currentTool.newbieSample.scenario}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <div>
                  <strong className="text-white">Exact Action to Take: </strong>
                  <span>{currentTool.newbieSample.exactAction}</span>
                </div>
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200">
                  <strong className="text-red-300 flex items-center gap-1 mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Beginner Trap to Avoid:
                  </strong>
                  <span>{currentTool.newbieSample.commonMistake}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MT4 / MT5 SCHOOL — PLATFORM ESSENTIALS */}
      {activeTab === 'mt4-school' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mt4Elements.map((el) => (
              <div
                key={el.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-[#D4AF37]/50 transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase">
                      Platform Control
                    </span>
                    <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                      <Compass className="w-4 h-4" />
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{el.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{el.what}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400">
                    <strong className="text-emerald-400 block font-mono">How to Execute:</strong>
                    <span>{el.how}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] text-slate-300 font-mono border border-slate-800">
                    <strong className="text-[#D4AF37] block">Real Sample:</strong>
                    <span>{el.sample}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
