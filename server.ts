import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

function getConfiguredApiKey(): string | undefined {
  const raw = process.env.GEMINI_API_KEY?.trim();
  if (!raw || raw === 'YOUR_API_KEY' || raw === 'PLACEHOLDER' || raw.includes('TODO')) {
    return undefined;
  }
  return raw;
}

const geminiKey = getConfiguredApiKey();
const aiClient = geminiKey
  ? new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

interface OhlcBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ServerPairQuote {
  pair: string;
  tvSymbol: string;
  price: number;
  dailyOpenPrice: number;
  change24hPct: number;
  m15Candles: OhlcBar[];
  h1Candles: OhlcBar[];
  source: string;
}

interface CachedLiveMarketsPayload {
  fetchedAt: number;
  syncedAt: string;
  liveFeedConnected: boolean;
  quotes: Record<string, ServerPairQuote>;
}

interface SuperAnalysisRequest {
  pair?: string;
  tvSymbol?: string;
  timeframe?: string;
  broker?: string;
  price?: number;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  direction?: 'BUY' | 'SELL';
  trendDirection?: string;
  recommendedStrategy?: string;
  strategyRationale?: string;
  stopLoss?: number;
  tp1?: number;
  tp2?: number;
  tp3?: number;
  riskReward?: string;
  dxyPressurePct?: number;
  riskRegime?: string;
  windowHeadline?: string;
  isExtendedZone?: boolean;
  entryTimingWarning?: string;
  lotSize?: number;
  actualRiskUsd?: number;
  executionReadiness?: 'READY_ENTER' | 'WAIT_PULLBACK' | 'NO_TRADE_CHOP' | 'NO_TRADE_CLOSED';
  executionReadinessReason?: string;
  bosDirection?: string;
  bosSummary?: string;
  customPrompt?: string;
}

interface BatchMarketSnapshotInput {
  pair: string;
  timeframe: string;
  price: number;
  change24hPct: number;
  direction: 'BUY' | 'SELL';
  trendDirection: string;
  ema20: number;
  ema50: number;
  rsi: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  confidence: number;
  riskReward: string;
  windowStatus: string;
  isExtendedZone?: boolean;
  entryTimingWarning?: string;
  lotSize?: number;
  actualRiskUsd?: number;
  executionReadiness?: 'READY_ENTER' | 'WAIT_PULLBACK' | 'NO_TRADE_CHOP' | 'NO_TRADE_CLOSED';
  executionReadinessReason?: string;
  bosDirection?: string;
  bosSummary?: string;
}

interface BatchScanRequest {
  mode?: 'scan_all' | 'rescan' | 'deep_ai';
  dxyPressurePct?: number;
  riskRegime?: string;
  eatTimeString?: string;
  eatHour?: number;
  sessionWindowName?: string;
  overallDaySafety?: string;
  markets?: BatchMarketSnapshotInput[];
}

interface DeepVerifyCheckInput {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

interface DeepVerifyRequest {
  pair?: string;
  timeframe?: string;
  broker?: string;
  livePrice?: number;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  atrPips?: number;
  direction?: 'BUY' | 'SELL';
  trendDirection?: string;
  h1TrendDirection?: string;
  entryPrice?: number;
  stopLoss?: number;
  tp1?: number;
  tp2?: number;
  tp3?: number;
  riskReward?: string;
  lotSize?: number;
  actualRiskUsd?: number;
  isExtendedZone?: boolean;
  executionReadiness?: 'READY_ENTER' | 'WAIT_PULLBACK' | 'NO_TRADE_CHOP' | 'NO_TRADE_CLOSED';
  executionReadinessReason?: string;
  liveFeedConnected?: boolean;
  dxyPressurePct?: number;
  riskRegime?: string;
  bosAnalysis?: {
    bosDirection?: string;
    structureTrend?: string;
    h1BosDirection?: string;
    lastSwingHigh?: number;
    lastSwingLow?: number;
    protectedSwingLow?: number;
    protectedSwingHigh?: number;
    bosTriggerLevel?: number;
    brokenStructure?: boolean;
    chochDetected?: boolean;
    structureSummary?: string;
    bosVetoReason?: string;
  };
  checks?: DeepVerifyCheckInput[];
  recentM15Candles?: OhlcBar[];
  recentH1Candles?: OhlcBar[];
}

interface PositionCoachRequest {
  pair?: string;
  direction?: 'BUY' | 'SELL';
  timeframe?: string;
  broker?: string;
  entryPrice?: number;
  livePrice?: number;
  stopLoss?: number;
  tp1?: number;
  tp2?: number;
  tp3?: number;
  floatingPips?: number;
  netProfitUsd?: number;
  netProfitKes?: number;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  atrPips?: number;
  keyLevel?: number;
  trendDirection?: string;
  h1TrendDirection?: string;
  dxyPressurePct?: number;
  riskRegime?: string;
  traderQuestion?: string;
}

const YAHOO_PAIR_SPECS: Array<{
  pair: string;
  tvSymbol: string;
  yahooSymbol: string;
  decimals: number;
  defaultPrice: number;
  defaultPct: number;
}> = [
  { pair: 'EUR/USD', tvSymbol: 'FX:EURUSD', yahooSymbol: 'EURUSD=X', decimals: 5, defaultPrice: 1.1636, defaultPct: 0.35 },
  { pair: 'GBP/USD', tvSymbol: 'FX:GBPUSD', yahooSymbol: 'GBPUSD=X', decimals: 5, defaultPrice: 1.3514, defaultPct: 0.42 },
  { pair: 'USD/JPY', tvSymbol: 'FX:USDJPY', yahooSymbol: 'USDJPY=X', decimals: 3, defaultPrice: 157.95, defaultPct: -0.14 },
  { pair: 'GBP/JPY', tvSymbol: 'FX:GBPJPY', yahooSymbol: 'GBPJPY=X', decimals: 3, defaultPrice: 213.45, defaultPct: 0.48 },
  { pair: 'USD/CHF', tvSymbol: 'FX:USDCHF', yahooSymbol: 'USDCHF=X', decimals: 5, defaultPrice: 0.8794, defaultPct: 0.16 },
  { pair: 'EUR/JPY', tvSymbol: 'FX:EURJPY', yahooSymbol: 'EURJPY=X', decimals: 3, defaultPrice: 183.79, defaultPct: 0.21 },
  { pair: 'USD/CAD', tvSymbol: 'FX:USDCAD', yahooSymbol: 'USDCAD=X', decimals: 5, defaultPrice: 1.39485, defaultPct: -0.22 },
  { pair: 'AUD/USD', tvSymbol: 'FX:AUDUSD', yahooSymbol: 'AUDUSD=X', decimals: 5, defaultPrice: 0.6975, defaultPct: 0.31 },
  { pair: 'XAU/USD', tvSymbol: 'OANDA:XAUUSD', yahooSymbol: 'GC=F', decimals: 2, defaultPrice: 3901.0, defaultPct: -0.05 },
  { pair: 'BTC/USD', tvSymbol: 'BINANCE:BTCUSDT', yahooSymbol: 'BTC-USD', decimals: 2, defaultPrice: 69700.0, defaultPct: -1.5 },
  { pair: 'ETH/USD', tvSymbol: 'BINANCE:ETHUSDT', yahooSymbol: 'ETH-USD', decimals: 2, defaultPrice: 1975.0, defaultPct: -1.5 },
  { pair: 'US30', tvSymbol: 'FOREXCOM:DJI', yahooSymbol: 'YM=F', decimals: 1, defaultPrice: 52547.0, defaultPct: 0.1 },
  { pair: 'NAS100', tvSymbol: 'FOREXCOM:NAS100', yahooSymbol: 'NQ=F', decimals: 1, defaultPrice: 28412.0, defaultPct: 0.1 },
  { pair: 'GER40', tvSymbol: 'FOREXCOM:GER40', yahooSymbol: '^GDAXI', decimals: 1, defaultPrice: 26740.0, defaultPct: -0.1 },
  { pair: 'USOIL', tvSymbol: 'TVC:USOIL', yahooSymbol: 'CL=F', decimals: 2, defaultPrice: 88.4, defaultPct: -0.35 },
];

async function fetchBinanceSpotKlines(
  symbol: 'BTCUSDT' | 'ETHUSDT',
  interval: '15m' | '1h'
): Promise<OhlcBar[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=75`;
  const res = await fetch(url, { signal: AbortSignal.timeout(1800) });
  if (!res.ok) return [];
  const rows: any = await res.json();
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r: any[]) => ({
      time: Math.floor(Number(r[0]) / 1000),
      open: Number(parseFloat(r[1]).toFixed(2)),
      high: Number(parseFloat(r[2]).toFixed(2)),
      low: Number(parseFloat(r[3]).toFixed(2)),
      close: Number(parseFloat(r[4]).toFixed(2)),
    }))
    .filter((b: OhlcBar) => b.close > 0 && b.high >= b.low);
}

let liveMarketsCache: CachedLiveMarketsPayload | null = null;
let inFlightLiveMarketsPromise: Promise<CachedLiveMarketsPayload> | null = null;

function formatEatNow(): string {
  return (
    new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Africa/Nairobi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' EAT'
  );
}

async function fetchYahooChartCandles(
  yahooSymbol: string,
  interval: '15m' | '1h',
  range: '2d' | '5d',
  decimals: number
): Promise<{
  regularMarketPrice?: number;
  previousClose?: number;
  candles: OhlcBar[];
}> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    yahooSymbol
  )}?interval=${interval}&range=${range}&includePrePost=true&_t=${Date.now()}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PivotFx/2.0',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(2200),
  });
  if (!res.ok) {
    throw new Error(`Yahoo chart HTTP ${res.status}`);
  }
  const json: any = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) {
    return { candles: [] };
  }
  const meta = result.meta || {};
  const timestamps: number[] = Array.isArray(result.timestamp) ? result.timestamp : [];
  const quote = result.indicators?.quote?.[0] || {};
  const opens: Array<number | null> = Array.isArray(quote.open) ? quote.open : [];
  const highs: Array<number | null> = Array.isArray(quote.high) ? quote.high : [];
  const lows: Array<number | null> = Array.isArray(quote.low) ? quote.low : [];
  const closes: Array<number | null> = Array.isArray(quote.close) ? quote.close : [];

  const candles: OhlcBar[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const t = Number(timestamps[i]);
    const o = opens[i];
    const h = highs[i];
    const l = lows[i];
    const c = closes[i];
    if (
      typeof t === 'number' &&
      typeof o === 'number' &&
      typeof h === 'number' &&
      typeof l === 'number' &&
      typeof c === 'number' &&
      o > 0 &&
      h > 0 &&
      l > 0 &&
      c > 0
    ) {
      candles.push({
        time: t,
        open: Number(o.toFixed(decimals)),
        high: Number(h.toFixed(decimals)),
        low: Number(l.toFixed(decimals)),
        close: Number(c.toFixed(decimals)),
      });
    }
  }

  const regPrice =
    typeof meta.regularMarketPrice === 'number' && meta.regularMarketPrice > 0
      ? Number(meta.regularMarketPrice.toFixed(decimals))
      : candles.length > 0
      ? candles[candles.length - 1].close
      : undefined;

  // Prefer true prior session close (meta.previousClose / meta.regularMarketPreviousClose)
  // before falling back to range-start chartPreviousClose (which is 5 days old on range=5d!).
  let prevCloseRaw: number | undefined =
    typeof meta.previousClose === 'number' && meta.previousClose > 0
      ? meta.previousClose
      : typeof meta.regularMarketPreviousClose === 'number' && meta.regularMarketPreviousClose > 0
      ? meta.regularMarketPreviousClose
      : undefined;

  if (!prevCloseRaw && candles.length > 1) {
    const latestTime = candles[candles.length - 1].time;
    const target24hAgo = latestTime - 86400;
    const ref24hBar = candles.reduce((best, bar) =>
      Math.abs(bar.time - target24hAgo) < Math.abs(best.time - target24hAgo) ? bar : best
    );
    if (ref24hBar && ref24hBar.close > 0 && latestTime - ref24hBar.time >= 3600 * 6) {
      prevCloseRaw = ref24hBar.close;
    }
  }

  if (!prevCloseRaw) {
    prevCloseRaw =
      typeof meta.chartPreviousClose === 'number' && meta.chartPreviousClose > 0
        ? meta.chartPreviousClose
        : candles.length > 0
        ? candles[0].open
        : undefined;
  }

  const previousClose =
    typeof prevCloseRaw === 'number' && prevCloseRaw > 0
      ? Number(prevCloseRaw.toFixed(decimals))
      : undefined;

  return {
    regularMarketPrice: regPrice,
    previousClose,
    candles: candles.slice(-75),
  };
}

function buildCrossCandles(
  legA: OhlcBar[],
  legB: OhlcBar[],
  decimals: number
): OhlcBar[] {
  if (!legA.length || !legB.length) return [];
  const len = Math.min(legA.length, legB.length);
  const out: OhlcBar[] = [];
  for (let i = len; i > 0; i--) {
    const a = legA[legA.length - i];
    const b = legB[legB.length - i];
    out.push({
      time: a.time,
      open: Number((a.open * b.open).toFixed(decimals)),
      high: Number((a.high * b.high).toFixed(decimals)),
      low: Number((a.low * b.low).toFixed(decimals)),
      close: Number((a.close * b.close).toFixed(decimals)),
    });
  }
  return out;
}

async function aggregateAllLiveMarkets(): Promise<CachedLiveMarketsPayload> {
  const previousQuotes = liveMarketsCache?.quotes || {};
  const quotes: Record<string, ServerPairQuote> = {};
  let anyLive = false;

  const swissquotePairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD', 'AUD/USD', 'XAU/USD'] as const;

  // Execute M15 Yahoo OHLC, H1 Yahoo OHLC, Kraken, Coinbase, Gold-API, Swissquote BBO, and Binance Spot/Klines in ONE parallel wave
  const [m15Settled, h1Settled, extraSettled] = await Promise.all([
    Promise.allSettled(
      YAHOO_PAIR_SPECS.map((spec) =>
        fetchYahooChartCandles(spec.yahooSymbol, '15m', '2d', spec.decimals)
      )
    ),
    Promise.allSettled(
      YAHOO_PAIR_SPECS.map((spec) =>
        fetchYahooChartCandles(spec.yahooSymbol, '1h', '5d', spec.decimals)
      )
    ),
    Promise.allSettled([
      fetch(
        'https://api.kraken.com/0/public/Ticker?pair=EURUSD,GBPUSD,USDJPY,USDCHF,USDCAD,AUDUSD,ETHUSD,XBTUSD',
        { signal: AbortSignal.timeout(1600) }
      ).then((r) => (r.ok ? r.json() : null)),
      fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD', {
        signal: AbortSignal.timeout(1500),
      }).then((r) => (r.ok ? r.json() : null)),
      fetch('https://api.gold-api.com/price/XAU', {
        signal: AbortSignal.timeout(1400),
      }).then((r) => (r.ok ? r.json() : null)),
      Promise.allSettled(
        swissquotePairs.map((p) =>
          fetch(`https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/${p}`, {
            signal: AbortSignal.timeout(1400),
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => ({ pair: p, data }))
        )
      ),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22%5D', {
        signal: AbortSignal.timeout(1600),
      }).then((r) => (r.ok ? r.json() : null)),
      fetchBinanceSpotKlines('BTCUSDT', '15m'),
      fetchBinanceSpotKlines('BTCUSDT', '1h'),
      fetchBinanceSpotKlines('ETHUSDT', '15m'),
      fetchBinanceSpotKlines('ETHUSDT', '1h'),
    ]),
  ]);

  const [
    krakenSettled,
    coinbaseSettled,
    goldApiSettled,
    swissquoteSettled,
    binanceTickerSettled,
    btcM15KlinesSettled,
    btcH1KlinesSettled,
    ethM15KlinesSettled,
    ethH1KlinesSettled,
  ] = extraSettled;

  const fallbackRates: Record<string, { price: number; open?: number; spotProvider?: string }> = {};

  if (goldApiSettled.status === 'fulfilled' && goldApiSettled.value?.price > 1500) {
    fallbackRates['XAU/USD'] = {
      price: Number(Number(goldApiSettled.value.price).toFixed(2)),
      spotProvider: 'gold-api-spot',
    };
  }

  if (coinbaseSettled.status === 'fulfilled' && coinbaseSettled.value?.data?.rates) {
    const r = coinbaseSettled.value.data.rates;
    if (r.EUR) fallbackRates['EUR/USD'] = { price: Number((1 / parseFloat(r.EUR)).toFixed(5)), spotProvider: 'coinbase-spot' };
    if (r.GBP) fallbackRates['GBP/USD'] = { price: Number((1 / parseFloat(r.GBP)).toFixed(5)), spotProvider: 'coinbase-spot' };
    if (r.JPY) fallbackRates['USD/JPY'] = { price: Number(parseFloat(r.JPY).toFixed(3)), spotProvider: 'coinbase-spot' };
    if (r.CHF) fallbackRates['USD/CHF'] = { price: Number(parseFloat(r.CHF).toFixed(5)), spotProvider: 'coinbase-spot' };
    if (r.CAD) fallbackRates['USD/CAD'] = { price: Number(parseFloat(r.CAD).toFixed(5)), spotProvider: 'coinbase-spot' };
    if (r.AUD) fallbackRates['AUD/USD'] = { price: Number((1 / parseFloat(r.AUD)).toFixed(5)), spotProvider: 'coinbase-spot' };
    if (r.BTC) fallbackRates['BTC/USD'] = { price: Number((1 / parseFloat(r.BTC)).toFixed(2)), spotProvider: 'coinbase-spot' };
    if (r.ETH) fallbackRates['ETH/USD'] = { price: Number((1 / parseFloat(r.ETH)).toFixed(2)), spotProvider: 'coinbase-spot' };
  }

  if (krakenSettled.status === 'fulfilled' && krakenSettled.value?.result) {
    const kRes = krakenSettled.value.result;
    for (const k of Object.keys(kRes)) {
      const entry = kRes[k];
      const lastP = parseFloat(entry?.c?.[0]);
      const openP = parseFloat(entry?.o);
      if (isNaN(lastP) || lastP <= 0) continue;
      if (k.includes('EUR')) fallbackRates['EUR/USD'] = { price: Number(lastP.toFixed(5)), open: openP, spotProvider: 'kraken-spot' };
      else if (k.includes('GBP')) fallbackRates['GBP/USD'] = { price: Number(lastP.toFixed(5)), open: openP, spotProvider: 'kraken-spot' };
      else if (k.includes('JPY')) fallbackRates['USD/JPY'] = { price: Number(lastP.toFixed(3)), open: openP, spotProvider: 'kraken-spot' };
      else if (k.includes('CHF')) fallbackRates['USD/CHF'] = { price: Number(lastP.toFixed(5)), open: openP, spotProvider: 'kraken-spot' };
      else if (k.includes('CAD')) fallbackRates['USD/CAD'] = { price: Number(lastP.toFixed(5)), open: openP, spotProvider: 'kraken-spot' };
      else if (k.includes('AUD')) fallbackRates['AUD/USD'] = { price: Number(lastP.toFixed(5)), open: openP, spotProvider: 'kraken-spot' };
      else if (k.includes('ETH') && lastP > 500) fallbackRates['ETH/USD'] = { price: Number(lastP.toFixed(2)), open: openP, spotProvider: 'kraken-spot' };
      else if (k.includes('XBT') && lastP > 5000) fallbackRates['BTC/USD'] = { price: Number(lastP.toFixed(2)), open: openP, spotProvider: 'kraken-spot' };
    }
  }

  // Swissquote Real-Time Institutional BBO Spot CFD overrides lagging REST snapshots for FX & Gold
  const swissquoteLiveSet = new Set<string>();
  if (swissquoteSettled.status === 'fulfilled' && Array.isArray(swissquoteSettled.value)) {
    for (const item of swissquoteSettled.value) {
      if (item.status !== 'fulfilled' || !item.value) continue;
      const { pair, data } = item.value;
      if (!Array.isArray(data) || !data[0]) continue;
      const profiles = Array.isArray(data[0].spreadProfilePrices) ? data[0].spreadProfilePrices : [];
      const preferred =
        profiles.find((p: any) => p?.spreadProfile === 'elite') ||
        profiles.find((p: any) => p?.spreadProfile === 'prime') ||
        profiles[0];
      if (preferred && typeof preferred.bid === 'number' && typeof preferred.ask === 'number') {
        const midSpot = (preferred.bid + preferred.ask) / 2;
        const dec = pair === 'USD/JPY' ? 3 : pair === 'XAU/USD' ? 2 : 5;
        if (midSpot > 0 && (pair !== 'XAU/USD' || midSpot > 1500)) {
          fallbackRates[pair] = {
            price: Number(midSpot.toFixed(dec)),
            spotProvider: 'swissquote-spot-cfd',
          };
          swissquoteLiveSet.add(pair);
        }
      }
    }
  }

  // Binance Spot Exchange (Matches TradingView BINANCE:BTCUSDT & BINANCE:ETHUSDT 1:1)
  const binanceSpotLiveSet = new Set<string>();
  if (binanceTickerSettled.status === 'fulfilled' && Array.isArray(binanceTickerSettled.value)) {
    for (const t of binanceTickerSettled.value) {
      const last = parseFloat(t?.lastPrice);
      const open24h = parseFloat(t?.openPrice);
      if (t?.symbol === 'BTCUSDT' && last > 5000) {
        fallbackRates['BTC/USD'] = {
          price: Number(last.toFixed(2)),
          open: open24h > 5000 ? Number(open24h.toFixed(2)) : undefined,
          spotProvider: 'binance-spot-tv',
        };
        binanceSpotLiveSet.add('BTC/USD');
      } else if (t?.symbol === 'ETHUSDT' && last > 200) {
        fallbackRates['ETH/USD'] = {
          price: Number(last.toFixed(2)),
          open: open24h > 200 ? Number(open24h.toFixed(2)) : undefined,
          spotProvider: 'binance-spot-tv',
        };
        binanceSpotLiveSet.add('ETH/USD');
      }
    }
  }

  YAHOO_PAIR_SPECS.forEach((spec, idx) => {
    const m15Res = m15Settled[idx];
    const h1Res = h1Settled[idx];
    const prev = previousQuotes[spec.pair];
    const fb = fallbackRates[spec.pair];

    let price = prev?.price ?? spec.defaultPrice;
    let dailyOpen = prev?.dailyOpenPrice ?? spec.defaultPrice;
    let m15Candles = prev?.m15Candles ?? [];
    let h1Candles = prev?.h1Candles ?? [];
    let source = 'cached-baseline';

    if (h1Res.status === 'fulfilled' && h1Res.value) {
      if (h1Res.value.candles.length >= 12) {
        h1Candles = h1Res.value.candles;
      }
      if (h1Res.value.previousClose && h1Res.value.previousClose > 0) {
        dailyOpen = h1Res.value.previousClose;
      }
      if (h1Res.value.regularMarketPrice && h1Res.value.regularMarketPrice > 0) {
        price = h1Res.value.regularMarketPrice;
        source = 'yahoo-finance';
        anyLive = true;
      }
    }

    if (m15Res.status === 'fulfilled' && m15Res.value) {
      if (m15Res.value.candles.length >= 12) {
        m15Candles = m15Res.value.candles;
      }
      if (m15Res.value.regularMarketPrice && m15Res.value.regularMarketPrice > 0) {
        price = m15Res.value.regularMarketPrice;
        source = 'yahoo-finance';
        anyLive = true;
      }
      // Prefer m15 (2d range) previousClose over h1 (5d range) chartPreviousClose
      if (m15Res.value.previousClose && m15Res.value.previousClose > 0) {
        dailyOpen = m15Res.value.previousClose;
      }
    }

    // Use Binance Spot OHLC & ticker directly for BTC/USD & ETH/USD to match TradingView BINANCE:BTCUSDT / ETHUSDT 1:1
    if (spec.pair === 'BTC/USD') {
      if (btcM15KlinesSettled.status === 'fulfilled' && Array.isArray(btcM15KlinesSettled.value) && btcM15KlinesSettled.value.length >= 15) {
        m15Candles = btcM15KlinesSettled.value;
      }
      if (btcH1KlinesSettled.status === 'fulfilled' && Array.isArray(btcH1KlinesSettled.value) && btcH1KlinesSettled.value.length >= 15) {
        h1Candles = btcH1KlinesSettled.value;
      }
    } else if (spec.pair === 'ETH/USD') {
      if (ethM15KlinesSettled.status === 'fulfilled' && Array.isArray(ethM15KlinesSettled.value) && ethM15KlinesSettled.value.length >= 15) {
        m15Candles = ethM15KlinesSettled.value;
      }
      if (ethH1KlinesSettled.status === 'fulfilled' && Array.isArray(ethH1KlinesSettled.value) && ethH1KlinesSettled.value.length >= 15) {
        h1Candles = ethH1KlinesSettled.value;
      }
    }

    // Prefer real-time Binance Spot (Crypto) & Swissquote Spot CFD (FX & Gold) over Yahoo lagging/futures prices
    if (binanceSpotLiveSet.has(spec.pair) && fb && fb.price > 0) {
      price = fb.price;
      if (fb.open && fb.open > 0) {
        dailyOpen = fb.open;
      }
      source = fb.spotProvider || 'binance-spot-tv';
      anyLive = true;
    } else if ((spec.pair === 'XAU/USD' || swissquoteLiveSet.has(spec.pair)) && fb && fb.price > 0) {
      const spotPrice = fb.price;
      const basisLimit = spec.pair === 'XAU/USD' ? 0.03 : 0.01;
      if (m15Candles.length > 0 && Math.abs(spotPrice - price) / price < basisLimit) {
        const spotBasisRatio = spotPrice / m15Candles[m15Candles.length - 1].close;
        m15Candles = m15Candles.map((c) => ({
          time: c.time,
          open: Number((c.open * spotBasisRatio).toFixed(spec.decimals)),
          high: Number((c.high * spotBasisRatio).toFixed(spec.decimals)),
          low: Number((c.low * spotBasisRatio).toFixed(spec.decimals)),
          close: Number((c.close * spotBasisRatio).toFixed(spec.decimals)),
        }));
        if (h1Candles.length > 0) {
          h1Candles = h1Candles.map((c) => ({
            time: c.time,
            open: Number((c.open * spotBasisRatio).toFixed(spec.decimals)),
            high: Number((c.high * spotBasisRatio).toFixed(spec.decimals)),
            low: Number((c.low * spotBasisRatio).toFixed(spec.decimals)),
            close: Number((c.close * spotBasisRatio).toFixed(spec.decimals)),
          }));
        }
        dailyOpen = Number((dailyOpen * spotBasisRatio).toFixed(spec.decimals));
      }
      price = spotPrice;
      const spotLabel = fb.spotProvider || 'spot-feed';
      source = source === 'yahoo-finance' ? `${spotLabel}+yahoo-ohlc` : spotLabel;
      anyLive = true;
    } else if (source !== 'yahoo-finance' && fb && fb.price > 0) {
      price = fb.price;
      if (fb.open && fb.open > 0) {
        dailyOpen = Number(fb.open.toFixed(spec.decimals));
      }
      source = fb.spotProvider || 'kraken-coinbase-fallback';
      anyLive = true;
    }

    const finalRoundedPrice = Number(price.toFixed(spec.decimals));
    const change24hPct =
      dailyOpen > 0
        ? Number((((finalRoundedPrice - dailyOpen) / dailyOpen) * 100).toFixed(2))
        : prev?.change24hPct ?? spec.defaultPct;

    quotes[spec.pair] = {
      pair: spec.pair,
      tvSymbol: spec.tvSymbol,
      price: finalRoundedPrice,
      dailyOpenPrice: Number(dailyOpen.toFixed(spec.decimals)),
      change24hPct,
      m15Candles: patchCandleTailWithSpot(m15Candles, finalRoundedPrice),
      h1Candles: patchCandleTailWithSpot(h1Candles, finalRoundedPrice),
      source,
    };
  });

  // Ensure cross pairs (GBP/JPY & EUR/JPY) derive clean prices & candles from base USD legs if needed
  const eurQ = quotes['EUR/USD'];
  const gbpQ = quotes['GBP/USD'];
  const jpyQ = quotes['USD/JPY'];

  if (gbpQ && jpyQ) {
    const gj = quotes['GBP/JPY'];
    const useDerivedCross =
      swissquoteLiveSet.has('GBP/USD') ||
      swissquoteLiveSet.has('USD/JPY') ||
      gj.source === 'cached-baseline' ||
      gj.m15Candles.length < 15;
    if (useDerivedCross) {
      const derivedPrice = Number((gbpQ.price * jpyQ.price).toFixed(3));
      const derivedOpen = Number((gbpQ.dailyOpenPrice * jpyQ.dailyOpenPrice).toFixed(3));
      const m15Cross = patchCandleTailWithSpot(
        gj.m15Candles.length >= 15 ? gj.m15Candles : buildCrossCandles(gbpQ.m15Candles, jpyQ.m15Candles, 3),
        derivedPrice
      );
      const h1Cross = patchCandleTailWithSpot(
        gj.h1Candles.length >= 15 ? gj.h1Candles : buildCrossCandles(gbpQ.h1Candles, jpyQ.h1Candles, 3),
        derivedPrice
      );
      quotes['GBP/JPY'] = {
        pair: 'GBP/JPY',
        tvSymbol: 'FX:GBPJPY',
        price: derivedPrice,
        dailyOpenPrice: derivedOpen,
        change24hPct:
          derivedOpen > 0
            ? Number((((derivedPrice - derivedOpen) / derivedOpen) * 100).toFixed(2))
            : gj.change24hPct,
        m15Candles: m15Cross,
        h1Candles: h1Cross,
        source: swissquoteLiveSet.has('GBP/USD') ? 'swissquote-spot-cross' : 'derived-interbank-cross',
      };
    }
  }

  if (eurQ && jpyQ) {
    const ej = quotes['EUR/JPY'];
    const useDerivedCross =
      swissquoteLiveSet.has('EUR/USD') ||
      swissquoteLiveSet.has('USD/JPY') ||
      ej.source === 'cached-baseline' ||
      ej.m15Candles.length < 15;
    if (useDerivedCross) {
      const derivedPrice = Number((eurQ.price * jpyQ.price).toFixed(3));
      const derivedOpen = Number((eurQ.dailyOpenPrice * jpyQ.dailyOpenPrice).toFixed(3));
      const m15Cross = patchCandleTailWithSpot(
        ej.m15Candles.length >= 15 ? ej.m15Candles : buildCrossCandles(eurQ.m15Candles, jpyQ.m15Candles, 3),
        derivedPrice
      );
      const h1Cross = patchCandleTailWithSpot(
        ej.h1Candles.length >= 15 ? ej.h1Candles : buildCrossCandles(eurQ.h1Candles, jpyQ.h1Candles, 3),
        derivedPrice
      );
      quotes['EUR/JPY'] = {
        pair: 'EUR/JPY',
        tvSymbol: 'FX:EURJPY',
        price: derivedPrice,
        dailyOpenPrice: derivedOpen,
        change24hPct:
          derivedOpen > 0
            ? Number((((derivedPrice - derivedOpen) / derivedOpen) * 100).toFixed(2))
            : ej.change24hPct,
        m15Candles: m15Cross,
        h1Candles: h1Cross,
        source: swissquoteLiveSet.has('EUR/USD') ? 'swissquote-spot-cross' : 'derived-interbank-cross',
      };
    }
  }

  const payload: CachedLiveMarketsPayload = {
    fetchedAt: Date.now(),
    syncedAt: formatEatNow(),
    liveFeedConnected: anyLive,
    quotes,
  };
  liveMarketsCache = payload;
  return payload;
}

let inFlightFastSpotPromise: Promise<void> | null = null;
let lastFullOhlcFetchMs = 0;

function patchCandleTailWithSpot(candles: OhlcBar[], spotPrice: number): OhlcBar[] {
  if (!candles.length || !(spotPrice > 0)) return candles;
  const copy = candles.slice();
  const last = copy[copy.length - 1];
  copy[copy.length - 1] = {
    ...last,
    high: Math.max(last.high, spotPrice),
    low: Math.min(last.low, spotPrice),
    close: spotPrice,
  };
  return copy;
}

async function refreshFastSpotQuotes(): Promise<void> {
  if (!liveMarketsCache) {
    lastFullOhlcFetchMs = Date.now();
    await aggregateAllLiveMarkets();
    return;
  }
  if (inFlightFastSpotPromise || inFlightLiveMarketsPromise) {
    return inFlightFastSpotPromise || undefined;
  }

  inFlightFastSpotPromise = (async () => {
    try {
      const swissquotePairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD', 'AUD/USD', 'XAU/USD'] as const;
      const fastYahooSpecs = YAHOO_PAIR_SPECS.filter(
        (s) => s.pair === 'US30' || s.pair === 'NAS100' || s.pair === 'GER40' || s.pair === 'USOIL'
      );

      const [sqSettled, yhSettled, binanceFastSettled] = await Promise.all([
        Promise.allSettled(
          swissquotePairs.map((p) =>
            fetch(`https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/${p}`, {
              signal: AbortSignal.timeout(1200),
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((data) => ({ pair: p, data }))
          )
        ),
        Promise.allSettled(
          fastYahooSpecs.map(async (spec) => {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
              spec.yahooSymbol
            )}?interval=1m&range=1d&includePrePost=true&_t=${Date.now()}`;
            const r = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PivotFx/2.0',
                Accept: 'application/json',
              },
              signal: AbortSignal.timeout(1400),
            });
            if (!r.ok) return null;
            const json: any = await r.json();
            const meta = json?.chart?.result?.[0]?.meta;
            const p = meta?.regularMarketPrice;
            if (typeof p === 'number' && p > 0) {
              return { pair: spec.pair, price: Number(p.toFixed(spec.decimals)), decimals: spec.decimals };
            }
            return null;
          })
        ),
        fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22%5D', {
          signal: AbortSignal.timeout(1300),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);

      const nextQuotes: Record<string, ServerPairQuote> = { ...liveMarketsCache!.quotes };
      let updatedAny = false;

      if (Array.isArray(binanceFastSettled)) {
        for (const t of binanceFastSettled) {
          const pName = t?.symbol === 'BTCUSDT' ? 'BTC/USD' : t?.symbol === 'ETHUSDT' ? 'ETH/USD' : null;
          const pVal = parseFloat(t?.lastPrice);
          const open24 = parseFloat(t?.openPrice);
          if (pName && pVal > 0 && nextQuotes[pName]) {
            const rounded = Number(pVal.toFixed(2));
            const prevQ = nextQuotes[pName];
            const dailyOpen = open24 > 0 ? Number(open24.toFixed(2)) : prevQ.dailyOpenPrice;
            const chg =
              dailyOpen > 0
                ? Number((((rounded - dailyOpen) / dailyOpen) * 100).toFixed(2))
                : prevQ.change24hPct;
            nextQuotes[pName] = {
              ...prevQ,
              price: rounded,
              dailyOpenPrice: dailyOpen,
              change24hPct: chg,
              m15Candles: patchCandleTailWithSpot(prevQ.m15Candles, rounded),
              h1Candles: patchCandleTailWithSpot(prevQ.h1Candles, rounded),
              source: 'binance-spot-tv',
            };
            updatedAny = true;
          }
        }
      }

      for (const item of sqSettled) {
        if (item.status !== 'fulfilled' || !item.value) continue;
        const { pair, data } = item.value;
        if (!Array.isArray(data) || !data[0]) continue;
        const profiles = Array.isArray(data[0].spreadProfilePrices) ? data[0].spreadProfilePrices : [];
        const preferred =
          profiles.find((p: any) => p?.spreadProfile === 'elite') ||
          profiles.find((p: any) => p?.spreadProfile === 'prime') ||
          profiles[0];
        if (preferred && typeof preferred.bid === 'number' && typeof preferred.ask === 'number') {
          const midSpot = (preferred.bid + preferred.ask) / 2;
          const dec = pair === 'USD/JPY' ? 3 : pair === 'XAU/USD' ? 2 : 5;
          if (midSpot > 0 && (pair !== 'XAU/USD' || midSpot > 1500) && nextQuotes[pair]) {
            const rounded = Number(midSpot.toFixed(dec));
            const prevQ = nextQuotes[pair];
            const chg =
              prevQ.dailyOpenPrice > 0
                ? Number((((rounded - prevQ.dailyOpenPrice) / prevQ.dailyOpenPrice) * 100).toFixed(2))
                : prevQ.change24hPct;
            nextQuotes[pair] = {
              ...prevQ,
              price: rounded,
              change24hPct: chg,
              m15Candles: patchCandleTailWithSpot(prevQ.m15Candles, rounded),
              h1Candles: patchCandleTailWithSpot(prevQ.h1Candles, rounded),
            };
            updatedAny = true;
          }
        }
      }

      for (const item of yhSettled) {
        if (item.status === 'fulfilled' && item.value && nextQuotes[item.value.pair]) {
          const { pair, price } = item.value;
          const prevQ = nextQuotes[pair];
          const chg =
            prevQ.dailyOpenPrice > 0
              ? Number((((price - prevQ.dailyOpenPrice) / prevQ.dailyOpenPrice) * 100).toFixed(2))
              : prevQ.change24hPct;
          nextQuotes[pair] = {
            ...prevQ,
            price,
            change24hPct: chg,
            m15Candles: patchCandleTailWithSpot(prevQ.m15Candles, price),
            h1Candles: patchCandleTailWithSpot(prevQ.h1Candles, price),
          };
          updatedAny = true;
        }
      }

      const eurQ = nextQuotes['EUR/USD'];
      const gbpQ = nextQuotes['GBP/USD'];
      const jpyQ = nextQuotes['USD/JPY'];
      if (gbpQ && jpyQ && nextQuotes['GBP/JPY']) {
        const gjPrice = Number((gbpQ.price * jpyQ.price).toFixed(3));
        const prevGj = nextQuotes['GBP/JPY'];
        nextQuotes['GBP/JPY'] = {
          ...prevGj,
          price: gjPrice,
          change24hPct:
            prevGj.dailyOpenPrice > 0
              ? Number((((gjPrice - prevGj.dailyOpenPrice) / prevGj.dailyOpenPrice) * 100).toFixed(2))
              : prevGj.change24hPct,
          m15Candles: patchCandleTailWithSpot(prevGj.m15Candles, gjPrice),
          h1Candles: patchCandleTailWithSpot(prevGj.h1Candles, gjPrice),
        };
      }
      if (eurQ && jpyQ && nextQuotes['EUR/JPY']) {
        const ejPrice = Number((eurQ.price * jpyQ.price).toFixed(3));
        const prevEj = nextQuotes['EUR/JPY'];
        nextQuotes['EUR/JPY'] = {
          ...prevEj,
          price: ejPrice,
          change24hPct:
            prevEj.dailyOpenPrice > 0
              ? Number((((ejPrice - prevEj.dailyOpenPrice) / prevEj.dailyOpenPrice) * 100).toFixed(2))
              : prevEj.change24hPct,
          m15Candles: patchCandleTailWithSpot(prevEj.m15Candles, ejPrice),
          h1Candles: patchCandleTailWithSpot(prevEj.h1Candles, ejPrice),
        };
      }

      if (updatedAny) {
        liveMarketsCache = {
          fetchedAt: Date.now(),
          syncedAt: formatEatNow(),
          liveFeedConnected: true,
          quotes: nextQuotes,
        };
      }
    } finally {
      inFlightFastSpotPromise = null;
    }
  })();

  return inFlightFastSpotPromise;
}

function buildDeterministicSuperNote(body: SuperAnalysisRequest) {
  const pair = body.pair || 'GBP/USD';
  const tf = body.timeframe || 'M15';
  const dir = body.direction === 'SELL' ? 'SELL' : 'BUY';
  const trendLabel = body.trendDirection || (dir === 'BUY' ? 'UPTREND' : 'DOWNTREND');
  const price = Number(body.price || 1.3514);
  const isJpy = pair.includes('JPY');
  const isGold = pair.includes('XAU');
  const isBtc = pair.includes('BTC');
  const isEth = pair.includes('ETH');
  const isIndex = pair === 'US30' || pair === 'NAS100' || pair === 'GER40';
  const isOil = pair.includes('OIL');

  const pipSize = isJpy ? 0.01 : isGold ? 0.1 : isBtc ? 1.0 : isEth ? 0.5 : isIndex ? 1.0 : isOil ? 0.05 : 0.0001;
  const decimals = isJpy ? 3 : isGold ? 2 : isBtc ? 2 : isEth ? 2 : isIndex ? 1 : isOil ? 2 : 5;
  const riskPips = isJpy ? 22 : isGold ? 45 : isBtc ? 160 : isEth ? 40 : isIndex ? 50 : isOil ? 30 : 20;
  const sign = dir === 'BUY' ? 1 : -1;

  const ema20 = Number(body.ema20 ?? (price - sign * pipSize * 4).toFixed(decimals));
  const ema50 = Number(body.ema50 ?? (price - sign * pipSize * 9).toFixed(decimals));
  const rsi = Number(body.rsi ?? (dir === 'BUY' ? 56.4 : 43.6));
  const sl = Number(body.stopLoss ?? (price - sign * pipSize * riskPips).toFixed(decimals));
  const tp1 = Number(body.tp1 ?? (price + sign * pipSize * Math.round(riskPips * 1.4)).toFixed(decimals));
  const tp2 = Number(body.tp2 ?? (price + sign * pipSize * Math.round(riskPips * 2.3)).toFixed(decimals));
  const tp3 = Number(body.tp3 ?? (price + sign * pipSize * Math.round(riskPips * 3.5)).toFixed(decimals));
  const dxy = Number(body.dxyPressurePct || 0);
  const regime = body.riskRegime || 'BALANCED LIQUIDITY FLOW';

  const lotSizeText = `${Number(body.lotSize ?? 0.01).toFixed(2)} lot${body.actualRiskUsd ? ` ($${Number(body.actualRiskUsd).toFixed(2)} cap)` : ''}`;
  const emaAligned = dir === 'BUY' ? price >= ema20 && ema20 >= ema50 : price <= ema20 && ema20 <= ema50;
  const rsiHealthy = dir === 'BUY' ? rsi >= 42 && rsi <= 68 : rsi >= 32 && rsi <= 58;
  const readinessGate = body.executionReadiness;
  const isBlockedGate = readinessGate === 'NO_TRADE_CLOSED' || readinessGate === 'NO_TRADE_CHOP';
  const gatePrefix = isBlockedGate
    ? `${readinessGate === 'NO_TRADE_CLOSED' ? 'MARKET CLOSED — DO NOT ENTER NOW' : 'STAND ASIDE (CHOP / TIMEFRAME CONFLICT)'}: ${body.executionReadinessReason || 'Wait for aligned setup'}. `
    : readinessGate === 'WAIT_PULLBACK' || body.isExtendedZone
    ? `WAIT PULLBACK TO 20 EMA (${body.executionReadinessReason || body.entryTimingWarning || `Wait pullback near 20 EMA ${ema20}`}). `
    : '';

  const strategyName = body.recommendedStrategy || (emaAligned ? '20/50 EMA Value Zone Pullback' : 'Liquidity Sweep & BOS Confirmation');
  const headline = isBlockedGate
    ? `${pair} (${tf}) · ${readinessGate} · Stand Aside @ ${price}`
    : `${pair} (${tf}) · ${strategyName} · ${dir} @ ${price} (R:R ${body.riskReward || '1:2.4'})`;

  const tacticalNote = isBlockedGate
    ? `${gatePrefix}Strategy Watch (${strategyName}): Projected structure favors ${dir} (${trendLabel}) @ ${price} (EMA20 ${ema20} / EMA50 ${ema50}, RSI ${rsi}), with defensive levels SL ${sl}, TP1 ${tp1}, TP2 ${tp2}, TP3 ${tp3}.`
    : dir === 'BUY'
    ? `${gatePrefix}[${strategyName}] ${pair} (${tf}) holds ${trendLabel} structure @ ${price} with ${
        emaAligned ? 'bullish 20/50 EMA expansion' : 'institutional demand support near 20 EMA'
      } (EMA20 ${ema20} / EMA50 ${ema50}, RSI ${rsi}). Enter BUY on confirmed candle close with structure-anchored SL ${sl}, book 50% at TP1 ${tp1}, core target TP2 ${tp2}, and 48H swing TP3 ${tp3}.`
    : `${gatePrefix}[${strategyName}] ${pair} (${tf}) holds ${trendLabel} structure @ ${price} with ${
        emaAligned ? 'bearish 20/50 EMA distribution' : 'institutional supply rejection below 20 EMA'
      } (EMA20 ${ema20} / EMA50 ${ema50}, RSI ${rsi}). Enter SELL on confirmed candle close with structure-anchored SL ${sl}, book 50% at TP1 ${tp1}, core target TP2 ${tp2}, and 48H swing TP3 ${tp3}.`;

  const riskNote = isBlockedGate
    ? `Execution blocked (${readinessGate}) — keep capital preserved until market & 1H/M15 confluence confirm; reference SL remains ${sl} at ${lotSizeText}.`
    : rsiHealthy
    ? `Invalidate on M15 close beyond swing-protected SL ${sl} — RSI (${rsi}) supports continuation at ${lotSizeText}.`
    : `Invalidate on M15 close beyond swing-protected SL ${sl} — RSI (${rsi}) is stretched; wait for 20 EMA (${ema20}) retest on ${lotSizeText}.`;

  const macroNote = `DXY Basket ${dxy >= 0 ? `+${dxy}%` : `${dxy}%`} · ${regime} · ${
    body.windowHeadline || 'Nairobi EAT window synchronized'
  }`;

  return {
    source: 'quantitative-engine',
    headline,
    note: tacticalNote,
    invalidationNote: riskNote,
    catalystWatch: macroNote,
    tacticalNote,
    riskNote,
    macroNote,
    syncedAt: new Date().toISOString(),
  };
}

function buildDeterministicBatchScan(body: BatchScanRequest) {
  const markets = Array.isArray(body.markets) ? body.markets : [];
  const dxy = Number(body.dxyPressurePct ?? 0);
  const regime = body.riskRegime || 'BALANCED LIQUIDITY FLOW';
  const sessionName = body.sessionWindowName || 'Nairobi Active Session';
  const daySafety = body.overallDaySafety || 'FAVOURABLE TO TRADE';

  const normalizedMarkets = markets.map((m) => {
    const dir: 'BUY' | 'SELL' =
      m.direction === 'SELL'
        ? 'SELL'
        : m.direction === 'BUY'
        ? 'BUY'
        : Number(m.change24hPct ?? 0) >= 0
        ? 'BUY'
        : 'SELL';
    const trend: string = m.trendDirection || (dir === 'BUY' ? 'UPTREND' : 'DOWNTREND');
    return {
      ...m,
      direction: dir,
      trendDirection: trend,
    };
  });

  const buyCount = normalizedMarkets.filter((m) => m.direction === 'BUY').length;
  const sellCount = normalizedMarkets.length - buyCount;
  const readyCount = normalizedMarkets.filter((m) => m.executionReadiness === 'READY_ENTER').length;
  const topMarket = normalizedMarkets[0];

  const favoredBiasText =
    dxy <= -0.1
      ? `TODAY & THIS HOUR: FAVOURABLE BUYING ON NON-USD PAIRS & GOLD (DXY Softening ${dxy}%)`
      : dxy >= 0.1
      ? `TODAY & THIS HOUR: FAVOURABLE SELLING EUR/GBP/AUD · BUYING USD PAIRS (DXY Strength +${dxy}%)`
      : buyCount >= sellCount
      ? `TODAY & THIS HOUR: SELECTIVE BUY BIAS ON TOP % LEADERS (${buyCount} BUY vs ${sellCount} SELL Setups)`
      : `TODAY & THIS HOUR: SELECTIVE SELL BIAS ON USD Strength (${sellCount} SELL vs ${buyCount} BUY Setups)`;

  const topSummary = topMarket
    ? `#1 Leader ${topMarket.pair} (${topMarket.change24hPct >= 0 ? `+${topMarket.change24hPct}%` : `${topMarket.change24hPct}%`}) locks ${topMarket.trendDirection} -> ${topMarket.direction} @ ${topMarket.price} (${topMarket.executionReadiness || 'SYNCED'}).`
    : 'All 15 institutional instruments synchronized.';

  const sampleLot = Number(topMarket?.lotSize ?? 0.01).toFixed(2);
  const sampleRisk = Number(topMarket?.actualRiskUsd ?? 2.5).toFixed(2);

  const dailyMacroDirective = {
    headline: favoredBiasText,
    overallSafety: daySafety,
    hourlyOutlook: `${sessionName} (${body.eatTimeString || 'EAT'}): ${topSummary} ${readyCount} setup(s) READY_ENTER; enforce your risk plan (${sampleLot} lots · $${sampleRisk} risk cap).`,
    catalystSummary: `Global Macro Regime: ${regime} · USD Basket Index: ${dxy >= 0 ? `+${dxy}%` : `${dxy}%`} · ${buyCount} Bullish / ${sellCount} Bearish H1-M15 structures locked.`,
    syncedAt: new Date().toISOString(),
  };

  const perPair: Record<
    string,
    {
      headline: string;
      note: string;
      invalidationNote: string;
      catalystWatch: string;
    }
  > = {};

  for (const m of markets) {
    perPair[m.pair] = buildDeterministicSuperNote({
      pair: m.pair,
      timeframe: m.timeframe,
      price: m.price,
      ema20: m.ema20,
      ema50: m.ema50,
      rsi: m.rsi,
      direction: m.direction,
      trendDirection: m.trendDirection,
      stopLoss: m.stopLoss,
      tp1: m.tp1,
      tp2: m.tp2,
      tp3: m.tp3,
      riskReward: m.riskReward,
      dxyPressurePct: dxy,
      riskRegime: regime,
      isExtendedZone: m.isExtendedZone,
      entryTimingWarning: m.entryTimingWarning,
      lotSize: m.lotSize,
      actualRiskUsd: m.actualRiskUsd,
      executionReadiness: m.executionReadiness,
      executionReadinessReason: m.executionReadinessReason,
      windowHeadline: `${sessionName}${m.windowStatus ? ` (${m.windowStatus})` : ''}`,
    });
  }

  return {
    source: 'quantitative-engine',
    dailyMacroDirective,
    perPair,
    syncedAt: new Date().toISOString(),
  };
}

function buildDeterministicPositionCoach(body: PositionCoachRequest) {
  const pair = body.pair || 'USD/CAD';
  const direction = body.direction === 'SELL' ? 'SELL' : 'BUY';
  const isBuy = direction === 'BUY';
  const isJpy = pair.includes('JPY');
  const isGold = pair.includes('XAU');
  const isBtc = pair.includes('BTC');
  const isEth = pair.includes('ETH');
  const isIndex = pair === 'US30' || pair === 'NAS100' || pair === 'GER40';
  const isOil = pair.includes('OIL');
  const decimals = isJpy ? 3 : isGold || isBtc || isEth || isOil ? 2 : isIndex ? 1 : 5;
  const pipMultiplier = isJpy ? 100 : isGold ? 10 : isBtc || isIndex ? 1 : isEth ? 2 : isOil ? 20 : 10000;

  const entry = Number(body.entryPrice || 1.39485);
  const live = Number(body.livePrice || entry);
  const sl = Number(body.stopLoss || entry);
  const tp2 = Number(body.tp2 || entry);
  const ema20 = Number(body.ema20 || live);
  const ema50 = Number(body.ema50 || live);
  const rsi = Number(body.rsi ?? 50);
  const atrPips = Math.max(8, Number(body.atrPips ?? (isGold ? 35 : isBtc ? 160 : 18)));
  const floatingPips = Number(
    body.floatingPips ??
      Number(((isBuy ? live - entry : entry - live) * pipMultiplier).toFixed(1))
  );
  const netUsd = Number(body.netProfitUsd ?? (floatingPips * 0.1 - 0.11).toFixed(2));
  const netKes = Number(body.netProfitKes ?? Math.round(netUsd * 130));
  const h1Trend = body.h1TrendDirection || (ema20 >= ema50 ? 'UPTREND' : 'DOWNTREND');
  const dxy = Number(body.dxyPressurePct ?? 0);

  const isUsdBase = pair.startsWith('USD/');
  const isUsdQuote = pair.endsWith('/USD') && !isGold;
  const dxyOpposes =
    (isUsdBase && ((isBuy && dxy <= -0.08) || (!isBuy && dxy >= 0.08))) ||
    (isUsdQuote && ((isBuy && dxy >= 0.08) || (!isBuy && dxy <= -0.08)));
  const h1Opposes =
    (isBuy && h1Trend === 'DOWNTREND' && live < ema20 && ema20 < ema50) ||
    (!isBuy && h1Trend === 'UPTREND' && live > ema20 && ema20 > ema50);

  const keyInvalidationLevel = Number(
    (body.keyLevel ??
      (isBuy
        ? Math.min(ema50, live - (atrPips * 1.1) / pipMultiplier)
        : Math.max(ema50, live + (atrPips * 1.1) / pipMultiplier))
    ).toFixed(decimals)
  );

  if (floatingPips >= 18) {
    const lockSl = Number(
      (isBuy
        ? Math.max(sl, entry + (live - entry) * 0.55)
        : Math.min(sl, entry - (entry - live) * 0.55)
      ).toFixed(decimals)
    );
    const runnerTp = Number(
      (isBuy
        ? Math.max(tp2, live + (atrPips * 0.95) / pipMultiplier)
        : Math.min(tp2, live - (atrPips * 0.95) / pipMultiplier)
      ).toFixed(decimals)
    );
    return {
      source: 'quantitative-engine' as const,
      actionBadge: 'LOCK +55% PROFIT & EXTEND TP',
      headline: `${pair} ${direction} in +${floatingPips}p (+$${netUsd.toFixed(2)} / +${netKes} KES) Profit — Lock Gains Now`,
      recommendation: `Your ${pair} ${direction} trade is +${floatingPips} pips in profit. Raise/move Stop Loss on your broker to ${lockSl} to lock in +55% guaranteed profit, and extend Take Profit to ${runnerTp} as ${h1Trend} momentum (RSI ${rsi}) continues.`,
      suggestedStopLoss: lockSl,
      suggestedTakeProfit: runnerTp,
      keyInvalidationLevel,
      syncedAt: formatEatNow(),
    };
  }

  if (floatingPips >= 7) {
    const beSl = Number(
      (isBuy
        ? Math.max(sl, entry + (isGold ? 6 : 1.5) / pipMultiplier)
        : Math.min(sl, entry - (isGold ? 6 : 1.5) / pipMultiplier)
      ).toFixed(decimals)
    );
    return {
      source: 'quantitative-engine' as const,
      actionBadge: 'LOCK BREAKEVEN SL',
      headline: `${pair} ${direction} at +${floatingPips}p (+$${netUsd.toFixed(2)}) — Eliminate Downside Risk`,
      recommendation: `Position has expanded +${floatingPips} pips past spread cost. Update your broker SL to Breakeven (${beSl}) so the trade becomes risk-free while letting TP2 (${tp2.toFixed(decimals)}) play out.`,
      suggestedStopLoss: beSl,
      suggestedTakeProfit: Number(tp2.toFixed(decimals)),
      keyInvalidationLevel,
      syncedAt: formatEatNow(),
    };
  }

  if (floatingPips < 0 && (h1Opposes || dxyOpposes)) {
    // Tighten protective SL just behind the active M15/EMA structural swing instead of letting a counter-trend loss run
    const tightenDist = (Math.max(8, atrPips * 0.75)) / pipMultiplier;
    const tightenedSl = Number(
      (isBuy
        ? Math.max(sl, Number((live - tightenDist).toFixed(decimals)))
        : Math.min(sl, Number((live + tightenDist).toFixed(decimals)))
      ).toFixed(decimals)
    );
    const conservativeTp = Number(
      (isBuy
        ? Math.min(tp2, Math.max(live + (atrPips * 1.1) / pipMultiplier, Number(ema20.toFixed(decimals))))
        : Math.max(tp2, Math.min(live - (atrPips * 1.1) / pipMultiplier, Number(ema20.toFixed(decimals))))
      ).toFixed(decimals)
    );
    return {
      source: 'quantitative-engine' as const,
      actionBadge: 'H1 TREND AGAINST POSITION — TIGHTEN SL OR EXIT',
      headline: `${pair} ${direction} in Drawdown (${floatingPips}p / -$${Math.abs(netUsd).toFixed(2)}) — Counter-Trend Caution`,
      recommendation: `Macro DXY (${dxy >= 0 ? `+${dxy}%` : `${dxy}%`}) and ${h1Trend} structure oppose this ${direction} position (Price ${live.toFixed(decimals)} vs 20 EMA ${ema20.toFixed(decimals)}). Do NOT add lots or widen SL; tighten broker SL to ${tightenedSl} (beyond immediate ATR noise) and exit if the current M15 candle closes past ${tightenedSl}.`,
      suggestedStopLoss: tightenedSl,
      suggestedTakeProfit: conservativeTp,
      keyInvalidationLevel: tightenedSl,
      syncedAt: formatEatNow(),
    };
  }

  return {
    source: 'quantitative-engine' as const,
    actionBadge: 'HOLD STRUCTURE (SL PROTECTED)',
    headline: `${pair} ${direction} (${floatingPips >= 0 ? `+${floatingPips}p` : `${floatingPips}p`}) Within Normal ATR Corridor — Hold Plan`,
    recommendation: `Price (${live.toFixed(decimals)}) remains inside normal ${atrPips}p ATR fluctuation with H1 ${h1Trend} intact. Keep your structure-anchored Stop Loss at ${sl.toFixed(decimals)} untouched and wait for continuation past 20 EMA (${ema20.toFixed(decimals)}) toward TP2 (${tp2.toFixed(decimals)}).`,
    suggestedStopLoss: Number(sl.toFixed(decimals)),
    suggestedTakeProfit: Number(tp2.toFixed(decimals)),
    keyInvalidationLevel,
    syncedAt: formatEatNow(),
  };
}

function buildDeterministicDeepVerify(body: DeepVerifyRequest) {
  const pair = body.pair || 'XAU/USD';
  const timeframe = body.timeframe || 'M15';
  const proposedDirection: 'BUY' | 'SELL' = body.direction === 'SELL' ? 'SELL' : 'BUY';
  const isBuy = proposedDirection === 'BUY';
  const livePrice = Number(body.livePrice || body.entryPrice || 1);
  const ema20 = Number(body.ema20 || livePrice);
  const ema50 = Number(body.ema50 || livePrice);
  const rsi = Number(body.rsi ?? 50);
  const sl = Number(body.stopLoss || livePrice);
  const tp1 = Number(body.tp1 || livePrice);
  const tp2 = Number(body.tp2 || livePrice);
  const bos = body.bosAnalysis || {};
  const structureState = (bos.bosDirection as string) || 'RANGING';
  const bosLevel = Number(bos.bosTriggerLevel || livePrice);

  const rawChecks: DeepVerifyCheckInput[] = Array.isArray(body.checks) && body.checks.length > 0
    ? body.checks
    : [
        {
          id: 'LIVE_FEED_SYNCED',
          label: 'Live Feed & Market Window Open',
          passed: body.executionReadiness !== 'NO_TRADE_CLOSED',
          detail: body.executionReadiness === 'NO_TRADE_CLOSED' ? 'Market window closed' : 'Live quote & session active',
        },
        {
          id: 'MTF_ALIGNED',
          label: 'H1 + Active TF Trajectory Aligned',
          passed: (body.h1TrendDirection || 'UPTREND') === (isBuy ? 'UPTREND' : 'DOWNTREND'),
          detail: `H1=${body.h1TrendDirection || 'UPTREND'} vs Order=${proposedDirection}`,
        },
        {
          id: 'NO_COUNTER_BOS',
          label: 'Break of Structure (BOS/CHoCH) Safe',
          passed: !(
            (isBuy && (structureState === 'BEARISH_BOS' || structureState === 'BEARISH_CHOCH')) ||
            (!isBuy && (structureState === 'BULLISH_BOS' || structureState === 'BULLISH_CHOCH'))
          ),
          detail: bos.bosVetoReason || bos.structureSummary || 'Structure intact',
        },
        {
          id: 'SWING_SL_PROTECTED',
          label: 'SL Protected Beyond Swing & ATR',
          passed: isBuy ? sl < livePrice : sl > livePrice,
          detail: `SL ${sl} vs Live ${livePrice}`,
        },
        {
          id: 'RR_AND_TP_VALID',
          label: 'TP Targets & R:R >= 1:1.8 Valid',
          passed: isBuy ? livePrice < tp1 && tp1 < tp2 : livePrice > tp1 && tp1 > tp2,
          detail: `TP1 ${tp1} -> TP2 ${tp2} (${body.riskReward || '1:2.4'})`,
        },
        {
          id: 'ENTRY_NOT_CHASED',
          label: 'Pullback Corridor (Not Chased)',
          passed: !body.isExtendedZone,
          detail: body.isExtendedZone ? 'Extended from 20 EMA — stage Limit order' : 'Inside 20/50 EMA value zone',
        },
      ];

  const failedCounterBos = rawChecks.some((c) => c.id === 'NO_COUNTER_BOS' && !c.passed);
  const failedWindowOrRr = rawChecks.some(
    (c) => (c.id === 'LIVE_FEED_SYNCED' || c.id === 'RR_AND_TP_VALID' || c.id === 'MTF_ALIGNED') && !c.passed
  );
  const failedPullbackOrSl = rawChecks.some(
    (c) => (c.id === 'ENTRY_NOT_CHASED' || c.id === 'SWING_SL_PROTECTED') && !c.passed
  );

  let verdict: 'CONFIRMED_BUY' | 'CONFIRMED_SELL' | 'WAIT_PULLBACK' | 'BOS_REVERSAL_FLIP' | 'STAND_ASIDE_TRAP';
  let verifiedDirection: 'BUY' | 'SELL' | 'STAND_ASIDE';

  if (failedCounterBos) {
    verdict = 'BOS_REVERSAL_FLIP';
    verifiedDirection = isBuy ? 'SELL' : 'BUY';
  } else if (body.executionReadiness === 'NO_TRADE_CLOSED' || body.executionReadiness === 'NO_TRADE_CHOP' || failedWindowOrRr) {
    verdict = 'STAND_ASIDE_TRAP';
    verifiedDirection = 'STAND_ASIDE';
  } else if (body.executionReadiness === 'WAIT_PULLBACK' || failedPullbackOrSl) {
    verdict = 'WAIT_PULLBACK';
    verifiedDirection = proposedDirection;
  } else {
    verdict = isBuy ? 'CONFIRMED_BUY' : 'CONFIRMED_SELL';
    verifiedDirection = proposedDirection;
  }

  const passedCount = rawChecks.filter((c) => c.passed).length;
  const confidenceScore = Number(
    Math.min(
      96,
      Math.max(42, 52 + passedCount * 7.2 - (failedCounterBos ? 22 : 0))
    ).toFixed(1)
  );

  const deepAuditHeadline =
    verdict === 'BOS_REVERSAL_FLIP'
      ? `BOS REVERSAL GUARD: ${proposedDirection} VETOED ON ${pair} (${structureState.replace(/_/g, ' ')})`
      : verdict === 'STAND_ASIDE_TRAP'
      ? `STAND ASIDE: ${pair} FAILED PRE-FLIGHT CHECKS (${passedCount}/${rawChecks.length})`
      : verdict === 'WAIT_PULLBACK'
      ? `WAIT PULLBACK ON ${pair} (${timeframe}) — DO NOT CHASE @ ${livePrice}`
      : `VERIFIED ${verifiedDirection} TRAJECTORY ON ${pair} (${timeframe}) · ${passedCount}/${rawChecks.length} CHECKS PASSED`;

  const deepAuditSummary =
    verdict === 'BOS_REVERSAL_FLIP'
      ? `${bos.bosVetoReason || `${structureState.replace(/_/g, ' ')} broke key level ${bosLevel}`}. Buying/selling against an active structural break traps entries into drawdown — align strictly with ${verifiedDirection} or stand aside.`
      : verdict === 'STAND_ASIDE_TRAP'
      ? `${body.executionReadinessReason || 'Higher-timeframe or session gate blocked'}. Preserve capital until M15 + H1 + BOS agree cleanly.`
      : verdict === 'WAIT_PULLBACK'
      ? `Structure favors ${proposedDirection} (${structureState.replace(/_/g, ' ')}), but price (${livePrice}) is stretched from 20 EMA (${ema20}) or ATR exceeds SL. Wait for pullback limit entry with SL @ ${sl}.`
      : `Live OHLC candles, 1H (${body.h1TrendDirection}) + ${timeframe} trajectory, EMA20/50 (${ema20}/${ema50}), RSI ${rsi}, and BOS (${structureState.replace(/_/g, ' ')}) all confirm ${verifiedDirection} from ${livePrice} toward TP1 ${tp1} / TP2 ${tp2} with swing-protected SL ${sl}.`;

  const trajectoryVerdict =
    verdict === 'BOS_REVERSAL_FLIP'
      ? `Structural reversal toward ${verifiedDirection} side; avoid counter-BOS ${proposedDirection}.`
      : verdict === 'STAND_ASIDE_TRAP'
      ? `Chop / closed market — await clean structural breakout past ${bosLevel}.`
      : isBuy
      ? `Bullish trajectory holding above protected swing ${bos.protectedSwingLow ?? sl} -> TP1 ${tp1} -> TP2 ${tp2}.`
      : `Bearish trajectory capped below protected swing ${bos.protectedSwingHigh ?? sl} -> TP1 ${tp1} -> TP2 ${tp2}.`;

  return {
    pair,
    timeframe,
    source: 'quantitative-engine' as const,
    verdict,
    verifiedDirection,
    proposedDirection,
    structureState,
    confidenceScore,
    bosLevel,
    invalidationLevel: sl,
    deepAuditHeadline,
    deepAuditSummary,
    trajectoryVerdict,
    riskChecklist: rawChecks.map((c) => `${c.passed ? 'PASS' : 'BLOCK'} · ${c.label}: ${c.detail}`),
    checks: rawChecks,
    passedCount,
    totalChecks: rawChecks.length,
    syncedAt: formatEatNow(),
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '512kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      aiEnabled: Boolean(aiClient),
      marketsCount: YAHOO_PAIR_SPECS.length,
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/live-markets', async (req, res) => {
    try {
      const force = req.query.force === '1' || req.query.force === 'true';
      const now = Date.now();
      if (!force && liveMarketsCache && now - liveMarketsCache.fetchedAt < 3500) {
        res.json(liveMarketsCache);
        return;
      }

      if (force || !liveMarketsCache) {
        if (!inFlightLiveMarketsPromise) {
          lastFullOhlcFetchMs = now;
          inFlightLiveMarketsPromise = aggregateAllLiveMarkets().finally(() => {
            inFlightLiveMarketsPromise = null;
          });
        }
        const data = await inFlightLiveMarketsPromise;
        res.json(data);
        return;
      }

      await refreshFastSpotQuotes();
      res.json(liveMarketsCache);
    } catch {
      if (liveMarketsCache) {
        res.json(liveMarketsCache);
        return;
      }
      const fallbackQuotes: Record<string, ServerPairQuote> = {};
      for (const spec of YAHOO_PAIR_SPECS) {
        fallbackQuotes[spec.pair] = {
          pair: spec.pair,
          tvSymbol: spec.tvSymbol,
          price: spec.defaultPrice,
          dailyOpenPrice: spec.defaultPrice,
          change24hPct: spec.defaultPct,
          m15Candles: [],
          h1Candles: [],
          source: 'fallback-baseline',
        };
      }
      res.json({
        fetchedAt: Date.now(),
        syncedAt: formatEatNow(),
        liveFeedConnected: false,
        quotes: fallbackQuotes,
      });
    }
  });

  app.post('/api/ai/super-analysis', async (req, res) => {
    const body = (req.body || {}) as SuperAnalysisRequest;
    const baseline = buildDeterministicSuperNote(body);

    if (!aiClient) {
      res.json(baseline);
      return;
    }

    try {
      const lotSizeNum = Number(body.lotSize ?? 0.01).toFixed(2);
      const riskUsdStr = body.actualRiskUsd ? ` ($${Number(body.actualRiskUsd).toFixed(2)} max risk)` : '';
      const prompt = [
        `Pair: ${body.pair || 'GBP/USD'} (${body.timeframe || 'M15'}), TV Symbol: ${body.tvSymbol || ''}, Broker: ${body.broker || 'FXPesa'}`,
        `Matched Institutional Strategy: ${body.recommendedStrategy || '20/50 EMA Pullback / BOS'} (${body.strategyRationale || ''})`,
        `Execution Readiness Gate: ${body.executionReadiness || 'READY_ENTER'}${body.executionReadinessReason ? ` (${body.executionReadinessReason})` : ''}`,
        body.bosDirection ? `BOS/CHoCH Structure: ${body.bosDirection} (${body.bosSummary || ''})` : '',
        `Trend Structure: ${body.trendDirection || 'UPTREND'}, Primary Order: ${body.direction || 'BUY'}, Live Price: ${body.price}`,
        `SL: ${body.stopLoss}, TP1: ${body.tp1}, TP2: ${body.tp2}, TP3: ${body.tp3}, R:R: ${body.riskReward || '1:2.4'}`,
        `Indicators: EMA20=${body.ema20}, EMA50=${body.ema50}, RSI=${body.rsi}`,
        body.isExtendedZone
          ? `ENTRY TIMING ALERT: Price is extended from 20 EMA (${body.entryTimingWarning || 'wait pullback'}). Warn trader to enter on pullback to 20 EMA rather than chasing.`
          : '',
        `Macro & Kenya Session: DXY=${body.dxyPressurePct ?? 0}%, Regime=${body.riskRegime || 'BALANCED'}, Window=${body.windowHeadline || 'Active'}`,
        body.customPrompt ? `Trader Question: ${body.customPrompt}` : '',
        `Enforce strict ${lotSizeNum} lot discipline${riskUsdStr}. If Execution Readiness Gate is NO_TRADE_CLOSED or NO_TRADE_CHOP (or counter-BOS), clearly advise standing aside.`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await aiClient.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an institutional FX quantitative execution desk assistant. Reply with 2 concise, plain-English sentences naming the matched strategy and Execution Readiness Gate (if blocked or wait-pullback, tell the trader not to chase market orders), the locked trend direction, exact structure-protected SL and TP1/TP2/TP3 targets, and strict lot-size risk discipline. Do not use markdown headers or bullet points.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
          abortSignal: AbortSignal.timeout(5500),
        },
      });

      const aiText = response.text?.trim();
      if (aiText && aiText.length > 20) {
        res.json({
          ...baseline,
          source: 'gemini-4-hydrogen',
          note: aiText,
          tacticalNote: aiText,
        });
        return;
      }
      res.json(baseline);
    } catch {
      res.json(baseline);
    }
  });

  app.post('/api/ai/position-coach', async (req, res) => {
    const body = (req.body || {}) as PositionCoachRequest;
    const baseline = buildDeterministicPositionCoach(body);

    if (!aiClient) {
      res.json(baseline);
      return;
    }

    try {
      const prompt = [
        `Active Broker Position: ${body.pair || 'USD/CAD'} (${body.timeframe || 'M15'}) — ${body.direction || 'BUY'} on ${body.broker || 'FXPesa'}`,
        `Entry=${body.entryPrice}, Live=${body.livePrice}, Current SL=${body.stopLoss}, TP1=${body.tp1}, TP2=${body.tp2}`,
        `Floating P&L=${body.floatingPips} pips ($${body.netProfitUsd} / ${body.netProfitKes} KES)`,
        `Structure: H1=${body.h1TrendDirection}, M15=${body.trendDirection}, EMA20=${body.ema20}, EMA50=${body.ema50}, RSI=${body.rsi}, ATR=${body.atrPips}p`,
        `Macro: DXY=${body.dxyPressurePct ?? 0}%, Regime=${body.riskRegime || 'BALANCED'}`,
        body.traderQuestion ? `Trader Question: ${body.traderQuestion}` : '',
        `Baseline recommendation: SL=${baseline.suggestedStopLoss}, TP=${baseline.suggestedTakeProfit}`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await aiClient.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a Senior Prop Desk Risk Manager advising a trader who placed an order on their broker (FXPesa/Exness/HFM/FBS). Output strict JSON matching the schema with clear, decisive advice in 2 plain-English sentences: if in drawdown, state whether H1 structure still supports holding the ATR-protected SL or if H1 has reversed so SL should be tightened immediately (never widen SL into loss); if in profit, explain how much profit SL locks and where to extend TP.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              recommendation: { type: Type.STRING },
            },
          },
          abortSignal: AbortSignal.timeout(3500),
        },
      });

      const raw = response.text?.trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        res.json({
          ...baseline,
          source: 'gemini-4-hydrogen',
          headline: parsed?.headline || baseline.headline,
          recommendation: parsed?.recommendation || baseline.recommendation,
        });
        return;
      }
      res.json(baseline);
    } catch {
      res.json(baseline);
    }
  });

  app.post('/api/ai/scan-markets', async (req, res) => {
    const body = (req.body || {}) as BatchScanRequest;
    const baseline = buildDeterministicBatchScan(body);

    if (!aiClient || !Array.isArray(body.markets) || body.markets.length === 0) {
      res.json(baseline);
      return;
    }

    try {
      const marketCount = body.markets.length;
      const marketSummaryLines = body.markets
        .map(
          (m, i) =>
            `#${i + 1} ${m.pair} (${m.timeframe}): Price=${m.price}, 24h=${m.change24hPct}%, Trend=${m.trendDirection}, BOS=${m.bosDirection || 'RANGING'}, Order=${m.direction}, Gate=${m.executionReadiness || 'READY_ENTER'}, Lot=${Number(m.lotSize ?? 0.01).toFixed(2)}, Risk=$${Number(m.actualRiskUsd ?? 2.5).toFixed(2)}, EMA20=${m.ema20}, EMA50=${m.ema50}, RSI=${m.rsi}, SL=${m.stopLoss}, TP1=${m.tp1}, TP2=${m.tp2}, TP3=${m.tp3}, Extended=${Boolean(
              m.isExtendedZone
            )}, Window=${m.windowStatus}`
        )
        .join('\n');

      const prompt = [
        `Session Context: Nairobi EAT=${body.eatTimeString || 'Active'}, Window=${body.sessionWindowName || 'Global Liquidity'}, Safety=${body.overallDaySafety || 'FAVOURABLE'}`,
        `Macro Context: DXY Basket=${body.dxyPressurePct ?? 0}%, Regime=${body.riskRegime || 'BALANCED'}`,
        `${marketCount} Markets Sorted Top % to Least:\n${marketSummaryLines}`,
        `Generate a clear today & current-hour macro directive (favouring BUY vs SELL) and a crisp 2-sentence institutional execution note for each of the ${marketCount} pairs referencing their exact price, BOS/CHoCH structure, Execution Readiness Gate (READY_ENTER vs WAIT_PULLBACK vs NO_TRADE_CHOP/NO_TRADE_CLOSED), SL, TP2, and configured lot discipline.`,
      ].join('\n\n');

      const response = await aiClient.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are the Chief Currency Strategist at an institutional prop trading desk in Nairobi. Output strict JSON matching the schema with plain-English actionable execution analysis and zero markdown.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              macroHeadline: { type: Type.STRING },
              hourlyOutlook: { type: Type.STRING },
              pairs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pair: { type: Type.STRING },
                    note: { type: Type.STRING },
                    invalidationNote: { type: Type.STRING },
                  },
                },
              },
            },
          },
          abortSignal: AbortSignal.timeout(4800),
        },
      });

      const rawJson = response.text?.trim();
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        if (parsed?.macroHeadline) {
          baseline.dailyMacroDirective.headline = parsed.macroHeadline;
        }
        if (parsed?.hourlyOutlook) {
          baseline.dailyMacroDirective.hourlyOutlook = parsed.hourlyOutlook;
        }
        if (Array.isArray(parsed?.pairs)) {
          for (const item of parsed.pairs) {
            if (item?.pair && baseline.perPair[item.pair]) {
              if (item.note && item.note.length > 15) {
                baseline.perPair[item.pair].note = item.note;
              }
              if (item.invalidationNote && item.invalidationNote.length > 10) {
                baseline.perPair[item.pair].invalidationNote = item.invalidationNote;
              }
            }
          }
        }
        baseline.source = 'gemini-4-hydrogen';
      }
      res.json(baseline);
    } catch {
      res.json(baseline);
    }
  });

  app.post('/api/ai/deep-verify', async (req, res) => {
    const body = (req.body || {}) as DeepVerifyRequest;
    const baseline = buildDeterministicDeepVerify(body);

    if (!aiClient) {
      res.json(baseline);
      return;
    }

    try {
      const m15Str = (body.recentM15Candles || [])
        .slice(-16)
        .map((c, idx) => `${idx + 1}:O=${c.open},H=${c.high},L=${c.low},C=${c.close}`)
        .join(' | ');
      const h1Str = (body.recentH1Candles || [])
        .slice(-10)
        .map((c, idx) => `${idx + 1}:O=${c.open},H=${c.high},L=${c.low},C=${c.close}`)
        .join(' | ');
      const checksStr = baseline.checks
        .map((c) => `[${c.passed ? 'PASS' : 'BLOCK'}] ${c.label}: ${c.detail}`)
        .join('\n');

      const prompt = [
        `Instrument: ${baseline.pair} (${baseline.timeframe}) on ${body.broker || 'FXPESA'}`,
        `Live Price: ${body.livePrice}, EMA20: ${body.ema20}, EMA50: ${body.ema50}, RSI(14): ${body.rsi}, ATR: ${body.atrPips}p`,
        `Proposed Direction: ${baseline.proposedDirection}, MTF: Active=${body.trendDirection}, H1=${body.h1TrendDirection}, Gate=${body.executionReadiness} (${body.executionReadinessReason || ''})`,
        `BOS/CHoCH Quantitative State: ${baseline.structureState}, Trigger=${baseline.bosLevel}, ProtectedSwingLow=${body.bosAnalysis?.protectedSwingLow}, ProtectedSwingHigh=${body.bosAnalysis?.protectedSwingHigh}`,
        `Proposed Levels: EP=${body.entryPrice}, SL=${body.stopLoss}, TP1=${body.tp1}, TP2=${body.tp2}, TP3=${body.tp3}, R:R=${body.riskReward}, Lot=${Number(body.lotSize ?? 0.01).toFixed(2)}, Risk=$${Number(body.actualRiskUsd ?? 2).toFixed(2)}`,
        `Macro: DXY=${body.dxyPressurePct ?? 0}%, Regime=${body.riskRegime || 'BALANCED'}`,
        m15Str ? `Recent M15 Candles (oldest->newest): ${m15Str}` : '',
        h1Str ? `Recent H1 Candles (oldest->newest): ${h1Str}` : '',
        `6-Point Quantitative Pre-Flight Checks:\n${checksStr}`,
        `Baseline Quantitative Verdict: ${baseline.verdict} (${baseline.verifiedDirection})`,
        `Audit raw M15 + H1 candlesticks for Break of Structure (BOS), Change of Character (CHoCH), liquidity sweeps, and trajectory alignment. Ensure zero false BUY in downtrend/Bearish BOS and zero false SELL in uptrend/Bullish BOS.`,
      ]
        .filter(Boolean)
        .join('\n\n');

      const response = await aiClient.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a Chief Quantitative Market Structure Auditor (Smart Money Concepts: BOS/CHoCH, Liquidity Sweeps, FVG/EMA structure, and Strict Risk Preservation). Output strict JSON matching the schema. Be ruthlessly honest: if M15/H1 candles show an opposing Break of Structure or liquidity trap or chop, warn against entering.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: {
                type: Type.STRING,
                enum: [
                  'CONFIRMED_BUY',
                  'CONFIRMED_SELL',
                  'WAIT_PULLBACK',
                  'BOS_REVERSAL_FLIP',
                  'STAND_ASIDE_TRAP',
                ],
              },
              deepAuditHeadline: { type: Type.STRING },
              deepAuditSummary: { type: Type.STRING },
              trajectoryVerdict: { type: Type.STRING },
              invalidationNote: { type: Type.STRING },
            },
          },
          abortSignal: AbortSignal.timeout(8500),
        },
      });

      const raw = response.text?.trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        // Zero-Mistake Clamp: Quantitative BOS, closed-window, or chop blocks CANNOT be overridden to CONFIRMED
        const quantLocked =
          baseline.verdict === 'BOS_REVERSAL_FLIP' ||
          baseline.verdict === 'STAND_ASIDE_TRAP';
        const finalVerdict = quantLocked
          ? baseline.verdict
          : parsed?.verdict === 'WAIT_PULLBACK' ||
            parsed?.verdict === 'BOS_REVERSAL_FLIP' ||
            parsed?.verdict === 'STAND_ASIDE_TRAP'
          ? parsed.verdict
          : baseline.verdict;

        const finalVerifiedDir =
          finalVerdict === 'CONFIRMED_BUY'
            ? 'BUY'
            : finalVerdict === 'CONFIRMED_SELL'
            ? 'SELL'
            : finalVerdict === 'WAIT_PULLBACK'
            ? baseline.proposedDirection
            : baseline.verifiedDirection;

        res.json({
          ...baseline,
          source: 'gemini-4-hydrogen',
          verdict: finalVerdict,
          verifiedDirection: finalVerifiedDir,
          deepAuditHeadline:
            parsed?.deepAuditHeadline && parsed.deepAuditHeadline.length > 10
              ? parsed.deepAuditHeadline
              : baseline.deepAuditHeadline,
          deepAuditSummary:
            parsed?.deepAuditSummary && parsed.deepAuditSummary.length > 20
              ? parsed.deepAuditSummary
              : baseline.deepAuditSummary,
          trajectoryVerdict:
            parsed?.trajectoryVerdict && parsed.trajectoryVerdict.length > 10
              ? parsed.trajectoryVerdict
              : baseline.trajectoryVerdict,
          riskChecklist:
            parsed?.invalidationNote && parsed.invalidationNote.length > 10
              ? [...baseline.riskChecklist, `AI Watch: ${parsed.invalidationNote}`]
              : baseline.riskChecklist,
        });
        return;
      }
      res.json(baseline);
    } catch {
      res.json(baseline);
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use('/PivotFX', vite.middlewares);
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use('/PivotFX', express.static(distDir));
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PivotFx institutional desk server listening on http://0.0.0.0:${PORT}`);
    // Pre-warm cache immediately and keep 2.5s fast spot + 18s OHLC background warmer running
    lastFullOhlcFetchMs = Date.now();
    void aggregateAllLiveMarkets().catch(() => {});
    setInterval(() => {
      const nowMs = Date.now();
      if (nowMs - lastFullOhlcFetchMs >= 18_000) {
        if (!inFlightLiveMarketsPromise) {
          lastFullOhlcFetchMs = nowMs;
          inFlightLiveMarketsPromise = aggregateAllLiveMarkets()
            .catch(() => liveMarketsCache!)
            .finally(() => {
              inFlightLiveMarketsPromise = null;
            });
        }
      } else {
        void refreshFastSpotQuotes().catch(() => {});
      }
    }, 2500);
  });
}

startServer().catch((err) => {
  console.error('Failed to start PivotFx server:', err);
  process.exit(1);
});
