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
  timeframe?: string;
  broker?: string;
  price?: number;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  direction?: 'BUY' | 'SELL';
  trendDirection?: string;
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
  yahooSymbol: string;
  decimals: number;
  defaultPrice: number;
  defaultPct: number;
}> = [
  { pair: 'EUR/USD', yahooSymbol: 'EURUSD=X', decimals: 5, defaultPrice: 1.1636, defaultPct: 0.35 },
  { pair: 'GBP/USD', yahooSymbol: 'GBPUSD=X', decimals: 5, defaultPrice: 1.3514, defaultPct: 0.42 },
  { pair: 'USD/JPY', yahooSymbol: 'USDJPY=X', decimals: 3, defaultPrice: 157.95, defaultPct: -0.14 },
  { pair: 'GBP/JPY', yahooSymbol: 'GBPJPY=X', decimals: 3, defaultPrice: 213.45, defaultPct: 0.48 },
  { pair: 'USD/CHF', yahooSymbol: 'USDCHF=X', decimals: 5, defaultPrice: 0.8794, defaultPct: 0.16 },
  { pair: 'EUR/JPY', yahooSymbol: 'EURJPY=X', decimals: 3, defaultPrice: 183.79, defaultPct: 0.21 },
  { pair: 'USD/CAD', yahooSymbol: 'USDCAD=X', decimals: 5, defaultPrice: 1.39485, defaultPct: -0.22 },
  { pair: 'AUD/USD', yahooSymbol: 'AUDUSD=X', decimals: 5, defaultPrice: 0.6975, defaultPct: 0.31 },
  { pair: 'XAU/USD', yahooSymbol: 'GC=F', decimals: 2, defaultPrice: 3962.5, defaultPct: 0.85 },
  { pair: 'BTC/USD', yahooSymbol: 'BTC-USD', decimals: 2, defaultPrice: 80491.43, defaultPct: 3.43 },
];

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

  const prevCloseRaw =
    typeof meta.chartPreviousClose === 'number' && meta.chartPreviousClose > 0
      ? meta.chartPreviousClose
      : typeof meta.previousClose === 'number' && meta.previousClose > 0
      ? meta.previousClose
      : candles.length > 0
      ? candles[0].open
      : undefined;

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

  // Fetch M15 charts for all 10 symbols + H1 charts in parallel with fast timeout
  const m15Settled = await Promise.allSettled(
    YAHOO_PAIR_SPECS.map((spec) =>
      fetchYahooChartCandles(spec.yahooSymbol, '15m', '2d', spec.decimals)
    )
  );
  const h1Settled = await Promise.allSettled(
    YAHOO_PAIR_SPECS.map((spec) =>
      fetchYahooChartCandles(spec.yahooSymbol, '1h', '5d', spec.decimals)
    )
  );

  // Also query Kraken & Coinbase as parallel redundancy if any Yahoo symbol is throttled
  const [krakenSettled, coinbaseSettled] = await Promise.allSettled([
    fetch(
      'https://api.kraken.com/0/public/Ticker?pair=EURUSD,GBPUSD,USDJPY,USDCHF,USDCAD,AUDUSD,PAXGUSD,XBTUSD',
      { signal: AbortSignal.timeout(1800) }
    ).then((r) => (r.ok ? r.json() : null)),
    fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD', {
      signal: AbortSignal.timeout(1600),
    }).then((r) => (r.ok ? r.json() : null)),
  ]);

  const fallbackRates: Record<string, { price: number; open?: number }> = {};

  if (coinbaseSettled.status === 'fulfilled' && coinbaseSettled.value?.data?.rates) {
    const r = coinbaseSettled.value.data.rates;
    if (r.EUR) fallbackRates['EUR/USD'] = { price: Number((1 / parseFloat(r.EUR)).toFixed(5)) };
    if (r.GBP) fallbackRates['GBP/USD'] = { price: Number((1 / parseFloat(r.GBP)).toFixed(5)) };
    if (r.JPY) fallbackRates['USD/JPY'] = { price: Number(parseFloat(r.JPY).toFixed(3)) };
    if (r.CHF) fallbackRates['USD/CHF'] = { price: Number(parseFloat(r.CHF).toFixed(5)) };
    if (r.CAD) fallbackRates['USD/CAD'] = { price: Number(parseFloat(r.CAD).toFixed(5)) };
    if (r.AUD) fallbackRates['AUD/USD'] = { price: Number((1 / parseFloat(r.AUD)).toFixed(5)) };
    if (r.BTC) fallbackRates['BTC/USD'] = { price: Number((1 / parseFloat(r.BTC)).toFixed(2)) };
  }

  if (krakenSettled.status === 'fulfilled' && krakenSettled.value?.result) {
    const kRes = krakenSettled.value.result;
    for (const k of Object.keys(kRes)) {
      const entry = kRes[k];
      const lastP = parseFloat(entry?.c?.[0]);
      const openP = parseFloat(entry?.o);
      if (isNaN(lastP) || lastP <= 0) continue;
      if (k.includes('EUR')) fallbackRates['EUR/USD'] = { price: Number(lastP.toFixed(5)), open: openP };
      else if (k.includes('GBP')) fallbackRates['GBP/USD'] = { price: Number(lastP.toFixed(5)), open: openP };
      else if (k.includes('JPY')) fallbackRates['USD/JPY'] = { price: Number(lastP.toFixed(3)), open: openP };
      else if (k.includes('CHF')) fallbackRates['USD/CHF'] = { price: Number(lastP.toFixed(5)), open: openP };
      else if (k.includes('CAD')) fallbackRates['USD/CAD'] = { price: Number(lastP.toFixed(5)), open: openP };
      else if (k.includes('AUD')) fallbackRates['AUD/USD'] = { price: Number(lastP.toFixed(5)), open: openP };
      else if (k.includes('PAXG') && lastP > 1500) fallbackRates['XAU/USD'] = { price: Number(lastP.toFixed(2)), open: openP };
      else if (k.includes('XBT') && lastP > 5000) fallbackRates['BTC/USD'] = { price: Number(lastP.toFixed(2)), open: openP };
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
      if ((!dailyOpen || dailyOpen === spec.defaultPrice) && m15Res.value.previousClose) {
        dailyOpen = m15Res.value.previousClose;
      }
    }

    if (source !== 'yahoo-finance' && fb && fb.price > 0) {
      price = fb.price;
      if (fb.open && fb.open > 0) {
        dailyOpen = Number(fb.open.toFixed(spec.decimals));
      }
      source = 'kraken-coinbase-fallback';
      anyLive = true;
    }

    const change24hPct =
      dailyOpen > 0
        ? Number((((price - dailyOpen) / dailyOpen) * 100).toFixed(2))
        : prev?.change24hPct ?? spec.defaultPct;

    quotes[spec.pair] = {
      pair: spec.pair,
      price: Number(price.toFixed(spec.decimals)),
      dailyOpenPrice: Number(dailyOpen.toFixed(spec.decimals)),
      change24hPct,
      m15Candles,
      h1Candles,
      source,
    };
  });

  // Ensure cross pairs (GBP/JPY & EUR/JPY) derive clean prices & candles from base USD legs if needed
  const eurQ = quotes['EUR/USD'];
  const gbpQ = quotes['GBP/USD'];
  const jpyQ = quotes['USD/JPY'];

  if (gbpQ && jpyQ) {
    const gj = quotes['GBP/JPY'];
    if (gj.source === 'cached-baseline' || gj.m15Candles.length < 15) {
      const derivedPrice = Number((gbpQ.price * jpyQ.price).toFixed(3));
      const derivedOpen = Number((gbpQ.dailyOpenPrice * jpyQ.dailyOpenPrice).toFixed(3));
      const m15Cross = gj.m15Candles.length >= 15 ? gj.m15Candles : buildCrossCandles(gbpQ.m15Candles, jpyQ.m15Candles, 3);
      const h1Cross = gj.h1Candles.length >= 15 ? gj.h1Candles : buildCrossCandles(gbpQ.h1Candles, jpyQ.h1Candles, 3);
      quotes['GBP/JPY'] = {
        pair: 'GBP/JPY',
        price: gj.source === 'yahoo-finance' ? gj.price : derivedPrice,
        dailyOpenPrice: gj.source === 'yahoo-finance' ? gj.dailyOpenPrice : derivedOpen,
        change24hPct:
          gj.source === 'yahoo-finance'
            ? gj.change24hPct
            : derivedOpen > 0
            ? Number((((derivedPrice - derivedOpen) / derivedOpen) * 100).toFixed(2))
            : gj.change24hPct,
        m15Candles: m15Cross,
        h1Candles: h1Cross,
        source: gj.source === 'yahoo-finance' ? gj.source : 'derived-interbank-cross',
      };
    }
  }

  if (eurQ && jpyQ) {
    const ej = quotes['EUR/JPY'];
    if (ej.source === 'cached-baseline' || ej.m15Candles.length < 15) {
      const derivedPrice = Number((eurQ.price * jpyQ.price).toFixed(3));
      const derivedOpen = Number((eurQ.dailyOpenPrice * jpyQ.dailyOpenPrice).toFixed(3));
      const m15Cross = ej.m15Candles.length >= 15 ? ej.m15Candles : buildCrossCandles(eurQ.m15Candles, jpyQ.m15Candles, 3);
      const h1Cross = ej.h1Candles.length >= 15 ? ej.h1Candles : buildCrossCandles(eurQ.h1Candles, jpyQ.h1Candles, 3);
      quotes['EUR/JPY'] = {
        pair: 'EUR/JPY',
        price: ej.source === 'yahoo-finance' ? ej.price : derivedPrice,
        dailyOpenPrice: ej.source === 'yahoo-finance' ? ej.dailyOpenPrice : derivedOpen,
        change24hPct:
          ej.source === 'yahoo-finance'
            ? ej.change24hPct
            : derivedOpen > 0
            ? Number((((derivedPrice - derivedOpen) / derivedOpen) * 100).toFixed(2))
            : ej.change24hPct,
        m15Candles: m15Cross,
        h1Candles: h1Cross,
        source: ej.source === 'yahoo-finance' ? ej.source : 'derived-interbank-cross',
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

function buildDeterministicSuperNote(body: SuperAnalysisRequest) {
  const pair = body.pair || 'GBP/USD';
  const tf = body.timeframe || 'M15';
  const dir = body.direction === 'SELL' ? 'SELL' : 'BUY';
  const trendLabel = body.trendDirection || (dir === 'BUY' ? 'UPTREND' : 'DOWNTREND');
  const price = Number(body.price || 1.3514);
  const isJpy = pair.includes('JPY');
  const isGold = pair.includes('XAU');
  const isBtc = pair.includes('BTC');
  const pipSize = isJpy ? 0.01 : isGold ? 0.1 : isBtc ? 1.0 : 0.0001;
  const decimals = isJpy ? 3 : isGold ? 2 : isBtc ? 2 : 5;
  const riskPips = isJpy ? 22 : isGold ? 45 : isBtc ? 160 : 20;
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

  const emaAligned = dir === 'BUY' ? price >= ema20 && ema20 >= ema50 : price <= ema20 && ema20 <= ema50;
  const rsiHealthy = dir === 'BUY' ? rsi >= 42 && rsi <= 68 : rsi >= 32 && rsi <= 58;
  const extendedPrefix = body.isExtendedZone
    ? `EXTENDED ENTRY WARNING (${body.entryTimingWarning || `Wait pullback near 20 EMA ${ema20}`}). `
    : '';

  const headline = `${pair} (${tf}) · ${trendLabel} · ${dir} @ ${price} (R:R ${body.riskReward || '1:2.4'})`;

  const tacticalNote =
    dir === 'BUY'
      ? `${extendedPrefix}${pair} (${tf}) holds ${trendLabel} structure @ ${price} with ${
          emaAligned ? 'bullish 20/50 EMA expansion' : 'institutional demand support near 20 EMA'
        } (EMA20 ${ema20} / EMA50 ${ema50}, RSI ${rsi}). Enter BUY on confirmed candle close with structure-anchored SL ${sl}, book 50% at TP1 ${tp1}, core target TP2 ${tp2}, and 48H swing TP3 ${tp3}.`
      : `${extendedPrefix}${pair} (${tf}) holds ${trendLabel} structure @ ${price} with ${
          emaAligned ? 'bearish 20/50 EMA distribution' : 'institutional supply rejection below 20 EMA'
        } (EMA20 ${ema20} / EMA50 ${ema50}, RSI ${rsi}). Enter SELL on confirmed candle close with structure-anchored SL ${sl}, book 50% at TP1 ${tp1}, core target TP2 ${tp2}, and 48H swing TP3 ${tp3}.`;

  const riskNote = rsiHealthy
    ? `Invalidate on M15 close beyond swing-protected SL ${sl} — RSI (${rsi}) supports continuation at 0.01 micro lot.`
    : `Invalidate on M15 close beyond swing-protected SL ${sl} — RSI (${rsi}) is stretched; wait for 20 EMA (${ema20}) retest on 0.01 lot.`;

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
    ? `#1 Leader ${topMarket.pair} (${topMarket.change24hPct >= 0 ? `+${topMarket.change24hPct}%` : `${topMarket.change24hPct}%`}) locks ${topMarket.trendDirection} -> ${topMarket.direction} @ ${topMarket.price}.`
    : 'All 10 institutional instruments synchronized.';

  const dailyMacroDirective = {
    headline: favoredBiasText,
    overallSafety: daySafety,
    hourlyOutlook: `${sessionName} (${body.eatTimeString || 'EAT'}): ${topSummary} Keep strictly 0.01 micro lot ($2.00 - $3.50 structure-protected risk per setup).`,
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
      windowHeadline: `${sessionName} (${m.windowStatus})`,
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
  const decimals = isJpy ? 3 : isGold ? 2 : isBtc ? 2 : 5;
  const pipMultiplier = isJpy ? 100 : isGold ? 10 : isBtc ? 1 : 10000;

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
      if (!force && liveMarketsCache && now - liveMarketsCache.fetchedAt < 1500) {
        res.json(liveMarketsCache);
        return;
      }

      if (!inFlightLiveMarketsPromise) {
        inFlightLiveMarketsPromise = aggregateAllLiveMarkets().finally(() => {
          inFlightLiveMarketsPromise = null;
        });
      }
      const data = await inFlightLiveMarketsPromise;
      res.json(data);
    } catch {
      if (liveMarketsCache) {
        res.json(liveMarketsCache);
        return;
      }
      const fallbackQuotes: Record<string, ServerPairQuote> = {};
      for (const spec of YAHOO_PAIR_SPECS) {
        fallbackQuotes[spec.pair] = {
          pair: spec.pair,
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
      const prompt = [
        `Pair: ${body.pair || 'GBP/USD'} (${body.timeframe || 'M15'}), Broker: ${body.broker || 'FXPesa'}`,
        `Trend Structure: ${body.trendDirection || 'UPTREND'}, Primary Order: ${body.direction || 'BUY'}, Live Price: ${body.price}`,
        `SL: ${body.stopLoss}, TP1: ${body.tp1}, TP2: ${body.tp2}, TP3: ${body.tp3}, R:R: ${body.riskReward || '1:2.4'}`,
        `Indicators: EMA20=${body.ema20}, EMA50=${body.ema50}, RSI=${body.rsi}`,
        body.isExtendedZone
          ? `ENTRY TIMING ALERT: Price is extended from 20 EMA (${body.entryTimingWarning || 'wait pullback'}). Warn trader to enter on pullback to 20 EMA rather than chasing.`
          : '',
        `Macro & Kenya Session: DXY=${body.dxyPressurePct ?? 0}%, Regime=${body.riskRegime || 'BALANCED'}, Window=${body.windowHeadline || 'Active'}`,
        body.customPrompt ? `Trader Question: ${body.customPrompt}` : '',
        'Enforce the 0.01 micro lot discipline.',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an institutional FX quantitative execution desk assistant. Reply with 2 concise, plain-English sentences covering the locked trend direction, whether to enter now or wait for a 20 EMA pullback, exact structure-protected SL and TP1/TP2/TP3 targets, and 0.01 micro lot risk discipline. Do not use markdown headers or bullet points.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          abortSignal: AbortSignal.timeout(4500),
        },
      });

      const aiText = response.text?.trim();
      if (aiText && aiText.length > 20) {
        res.json({
          ...baseline,
          source: 'gemini-3.8-flash',
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
        model: 'gemini-3.8-flash',
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
          source: 'gemini-3.8-flash',
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
            `#${i + 1} ${m.pair} (${m.timeframe}): Price=${m.price}, 24h=${m.change24hPct}%, Trend=${m.trendDirection}, Order=${m.direction}, EMA20=${m.ema20}, EMA50=${m.ema50}, RSI=${m.rsi}, SL=${m.stopLoss}, TP1=${m.tp1}, TP2=${m.tp2}, TP3=${m.tp3}, Extended=${Boolean(
              m.isExtendedZone
            )}, Window=${m.windowStatus}`
        )
        .join('\n');

      const prompt = [
        `Session Context: Nairobi EAT=${body.eatTimeString || 'Active'}, Window=${body.sessionWindowName || 'Global Liquidity'}, Safety=${body.overallDaySafety || 'FAVOURABLE'}`,
        `Macro Context: DXY Basket=${body.dxyPressurePct ?? 0}%, Regime=${body.riskRegime || 'BALANCED'}`,
        `${marketCount} Markets Sorted Top % to Least:\n${marketSummaryLines}`,
        `Generate a clear today & current-hour macro directive (favouring BUY vs SELL) and a crisp 2-sentence institutional execution note for each of the ${marketCount} pairs referencing their exact price, trend, SL, TP2, whether to enter now or wait for a 20 EMA pullback, and 0.01 lot discipline.`,
      ].join('\n\n');

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
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
        baseline.source = 'gemini-3.8-flash';
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
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PivotFx institutional desk server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start PivotFx server:', err);
  process.exit(1);
});
