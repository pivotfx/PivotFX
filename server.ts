import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

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

interface SuperAnalysisRequest {
  pair?: string;
  timeframe?: string;
  broker?: string;
  price?: number;
  ema20?: number;
  ema50?: number;
  rsi?: number;
  direction?: 'BUY' | 'SELL';
  stopLoss?: number;
  tp1?: number;
  tp2?: number;
  tp3?: number;
  riskReward?: string;
  dxyPressurePct?: number;
  riskRegime?: string;
  windowHeadline?: string;
  customPrompt?: string;
}

function buildDeterministicSuperNote(body: SuperAnalysisRequest) {
  const pair = body.pair || 'GBP/USD';
  const tf = body.timeframe || 'M15';
  const dir = body.direction === 'SELL' ? 'SELL' : 'BUY';
  const price = Number(body.price || 1.3514);
  const isJpy = pair.includes('JPY');
  const isGold = pair.includes('XAU');
  const isBtc = pair.includes('BTC');
  const pipSize = isJpy ? 0.01 : isGold ? 0.1 : isBtc ? 1.0 : 0.0001;
  const decimals = isJpy ? 3 : isGold ? 2 : isBtc ? 1 : 5;
  const riskPips = isJpy ? 18 : isGold ? 35 : isBtc ? 120 : 14;
  const sign = dir === 'BUY' ? 1 : -1;

  const ema20 = Number(body.ema20 ?? (price - sign * pipSize * 4).toFixed(decimals));
  const ema50 = Number(body.ema50 ?? (price - sign * pipSize * 9).toFixed(decimals));
  const rsi = Number(body.rsi ?? (dir === 'BUY' ? 56.4 : 43.6));
  const sl = Number(body.stopLoss ?? (price - sign * pipSize * riskPips).toFixed(decimals));
  const tp1 = Number(body.tp1 ?? (price + sign * pipSize * Math.round(riskPips * 1.5)).toFixed(decimals));
  const tp2 = Number(body.tp2 ?? (price + sign * pipSize * Math.round(riskPips * 2.5)).toFixed(decimals));
  const tp3 = Number(body.tp3 ?? (price + sign * pipSize * Math.round(riskPips * 3.8)).toFixed(decimals));
  const dxy = Number(body.dxyPressurePct || 0);
  const regime = body.riskRegime || 'MIXED CONSOLIDATION';

  const emaAligned = dir === 'BUY' ? price >= ema20 && ema20 >= ema50 : price <= ema20 && ema20 <= ema50;
  const rsiHealthy = dir === 'BUY' ? rsi >= 42 && rsi <= 68 : rsi >= 32 && rsi <= 58;

  const headline = `${pair} (${tf}) · ${dir} Setup @ ${price} (R:R ${body.riskReward || '1:2.5'})`;

  const tacticalNote =
    dir === 'BUY'
      ? `${pair} (${tf}) live candle @ ${price} holds ${emaAligned ? 'clean bullish EMA alignment' : 'near 20 EMA value zone'} (EMA20 ${ema20} / EMA50 ${ema50}, RSI ${rsi}). Entry validated with SL ${sl}, scale 50% at TP1 ${tp1}, final TP2 ${tp2}, 48H swing TP3 ${tp3}.`
      : `${pair} (${tf}) live candle @ ${price} shows ${emaAligned ? 'clean bearish EMA distribution' : 'resistance rejection below 20 EMA'} (EMA20 ${ema20} / EMA50 ${ema50}, RSI ${rsi}). Short validated with SL ${sl}, scale 50% at TP1 ${tp1}, final TP2 ${tp2}, 48H swing TP3 ${tp3}.`;

  const riskNote = rsiHealthy
    ? `Close beyond SL ${sl} — Momentum balanced (RSI ${rsi}); keep strictly 0.01 micro lot ($2.00 / 260 KES Gilgil Shield).`
    : `Close beyond SL ${sl} — RSI at ${rsi} signals short-term stretch; wait for pull toward 20 EMA (${ema20}) on 0.01 lot.`;

  const macroNote = `DXY ${dxy >= 0 ? `+${dxy}%` : `${dxy}%`} · Regime: ${regime} · ${body.windowHeadline || 'Nairobi EAT window synchronized'}`;

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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '512kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      aiEnabled: Boolean(aiClient),
      timestamp: new Date().toISOString(),
    });
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
        `Direction: ${body.direction || 'BUY'}, Live Price: ${body.price}, SL: ${body.stopLoss}, TP1: ${body.tp1}, TP2: ${body.tp2}, TP3: ${body.tp3}, R:R: ${body.riskReward || '1:2.5'}`,
        `Indicators: EMA20=${body.ema20}, EMA50=${body.ema50}, RSI=${body.rsi}`,
        `Macro & Kenya Session: DXY=${body.dxyPressurePct ?? 0}%, Regime=${body.riskRegime || 'BALANCED'}, Window=${body.windowHeadline || 'Active'}`,
        body.customPrompt ? `Trader Question: ${body.customPrompt}` : '',
        'Enforce the 0.01 micro lot ($2.00 / 260 KES max risk) discipline.',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an institutional FX quantitative execution desk assistant. Reply with 2 concise, plain-English sentences covering the live entry, SL, TP1/TP2/TP3 levels, and 0.01 micro lot ($2.00 / 260 KES) risk discipline. Do not use markdown headers or bullet points.',
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
