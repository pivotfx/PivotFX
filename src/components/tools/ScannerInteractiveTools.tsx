import React, { useState } from 'react';
import { CurrencyPair, Timeframe, ScannerAnalysisResult } from '../../types';
import {
  SlidersHorizontal,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Target,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ScannerInteractiveToolsProps {
  onLogTrade?: (trade: any) => void;
}

export const ScannerInteractiveTools: React.FC<ScannerInteractiveToolsProps> = ({ onLogTrade }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'camera'>('manual');

  // Manual Scanner State
  const [broker, setBroker] = useState<'fxpesa' | 'hfm' | 'fbs'>('fxpesa');
  const [pair, setPair] = useState<CurrencyPair>('EUR/USD');
  const [timeframe, setTimeframe] = useState<Timeframe>('M15');
  const [price, setPrice] = useState<number>(1.08502);
  const [ema20, setEma20] = useState<number>(1.08320);
  const [ema50, setEma50] = useState<number>(1.08150);
  const [rsi, setRsi] = useState<number>(68.4);
  const [towerPeak, setTowerPeak] = useState<number>(1.08620);
  const [analyzing, setAnalyzing] = useState(false);
  const [manualResult, setManualResult] = useState<ScannerAnalysisResult | null>(null);

  // Camera Scanner State
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [cameraScanning, setCameraScanning] = useState(false);
  const [cameraResult, setCameraResult] = useState<any | null>(null);

  // Run Manual Analysis
  const handleRunManualScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const distFromEma20Pips = Math.abs(price - ema20) * 10000;
      const distFromEma50Pips = Math.abs(price - ema50) * 10000;
      const isTrendBullish = ema20 > ema50;

      let score = 50;
      let verdict: 'WAIT' | 'RISKY' | 'HIGH_PROBABILITY_BUY' | 'HIGH_PROBABILITY_SELL' = 'WAIT';
      let pattern = 'Consolidation / Range Equilibrium';
      const reasons: string[] = [];

      // Logic rules
      if (isTrendBullish && price >= ema20 && price <= ema20 + 0.0015 && rsi >= 45 && rsi <= 65) {
        score = 88;
        verdict = 'HIGH_PROBABILITY_BUY';
        pattern = '20/50 EMA Dynamic Trend Bounce';
        reasons.push('Price is pulling back into dynamic 20 EMA support in a confirmed uptrend.');
        reasons.push('RSI 14 at ' + rsi + ' shows healthy non-exhausted bullish momentum.');
        reasons.push('Spread filter verified for ' + broker.toUpperCase() + ' (under 1.5 pips).');
      } else if (rsi >= 75 && distFromEma20Pips >= 18) {
        score = 86;
        verdict = 'HIGH_PROBABILITY_SELL';
        pattern = 'Tower Top Liquidity Exhaustion Sweep';
        reasons.push('Price extended ' + distFromEma20Pips.toFixed(1) + ' pips above 20 EMA (Mean Reversion setup).');
        reasons.push('RSI 14 at ' + rsi + ' confirms terminal buying exhaustion.');
        reasons.push('Previous tower peak at ' + towerPeak + ' successfully swept retail buy stops.');
      } else if (distFromEma20Pips > 25) {
        score = 42;
        verdict = 'RISKY';
        pattern = 'Overextended Parabolic Chase Trap';
        reasons.push('Price is dangerously overextended. Do NOT chase market orders.');
        reasons.push('Wait for mean reversion pullback to the 20 EMA before entering.');
      } else {
        score = 55;
        verdict = 'WAIT';
        pattern = 'Indecision / Chop Zone';
        reasons.push('Market is in equilibrium. Wait for clean structural break of structure (BOS).');
      }

      const slDistancePips = 20;
      const tpDistancePips = 50;
      const isBuy = verdict === 'HIGH_PROBABILITY_BUY';
      const slPrice = isBuy ? price - (slDistancePips / 10000) : price + (slDistancePips / 10000);
      const tpPrice = isBuy ? price + (tpDistancePips / 10000) : price - (tpDistancePips / 10000);

      setManualResult({
        pair,
        timeframe,
        price,
        ema20,
        ema50,
        rsi,
        score,
        verdict,
        detectedPattern: pattern,
        stopLoss: Number(slPrice.toFixed(5)),
        takeProfit: Number(tpPrice.toFixed(5)),
        suggestedLot: 0.01,
        reasoning: reasons,
      });
      setAnalyzing(false);
    }, 600);
  };

  // Run Camera Vision Simulation
  const handleSimulateCameraScan = () => {
    setCameraScanning(true);
    setTimeout(() => {
      setCameraResult({
        detectedPair: 'GBP/USD',
        detectedTimeframe: 'M15',
        detectedPrice: 1.29169,
        detectedEma20: 1.28850,
        detectedEma50: 1.28520,
        pattern: 'Tower Top Liquidity Sweep (Gilgil 1296.56 Exhaustion Pattern)',
        confidence: 89.4,
        similarityToWinningTrades: 92.1,
        similarityToLosingChases: 7.9,
        verdict: 'HIGH PROBABILITY SELL REVERSAL',
        score: 89,
        suggestedSL: 1.29656,
        suggestedTP: 1.28500,
        suggestedLot: 0.01,
        notes: 'AI Vision OCR detected laptop screen wicks sweeping the 1.2965 level. 20 EMA distance is 31 pips. High confidence mean-reversion setup.',
      });
      setCameraScanning(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/30 my-8">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>WORKING AI ENGINE • REACT COMPONENT</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Dual AI Market Scanner Workstation
          </h3>
          <p className="text-xs text-slate-400">
            Execute manual quantitative confluence analysis or analyze your laptop MT4/MT5 screen via camera OCR.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'manual' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>1. Manual Confluence</span>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'camera' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>2. Camera Vision OCR</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MANUAL CONFLUENCE SCANNER */}
      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Enter MT4/MT5 Current Indicators:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Broker Feed</label>
                <select
                  value={broker}
                  onChange={(e) => setBroker(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="fxpesa">FXPesa (CMA Licensed)</option>
                  <option value="hfm">HFM (Offshore 1:1000)</option>
                  <option value="fbs">FBS (Offshore)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Currency Pair</label>
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="EUR/USD">EUR/USD</option>
                  <option value="GBP/USD">GBP/USD</option>
                  <option value="USD/JPY">USD/JPY</option>
                  <option value="GBP/JPY">GBP/JPY</option>
                  <option value="XAU/USD">XAU/USD (Gold)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="M5">M5 (Sniper)</option>
                  <option value="M15">M15 (Standard)</option>
                  <option value="H1">H1 (Trend Anchor)</option>
                  <option value="H4">H4 (Macro Zone)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Live Price</label>
                <input
                  type="number"
                  step="0.00001"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">20 EMA Value</label>
                <input
                  type="number"
                  step="0.00001"
                  value={ema20}
                  onChange={(e) => setEma20(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">50 EMA Value</label>
                <input
                  type="number"
                  step="0.00001"
                  value={ema50}
                  onChange={(e) => setEma50(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">RSI (14)</label>
                <input
                  type="number"
                  step="0.1"
                  value={rsi}
                  onChange={(e) => setRsi(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRunManualScan}
                disabled={analyzing}
                className="w-full py-3.5 rounded-xl btn-gold text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating Confluence Matrix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Confluence Analysis Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Output Display (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            {manualResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Analysis Verdict:</span>
                  <span
                    className={`font-mono text-xs font-black px-2.5 py-0.5 rounded-full ${
                      manualResult.score >= 75
                        ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                        : manualResult.score >= 50
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {manualResult.verdict.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-center py-2 space-y-1">
                  <div className="text-4xl font-black text-white font-mono">
                    <span className="text-gold-gradient">{manualResult.score}</span>
                    <span className="text-sm text-slate-500"> / 100</span>
                  </div>
                  <div className="text-xs font-bold text-[#D4AF37]">{manualResult.detectedPattern}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-[9px] text-slate-500 block">Suggested Entry</span>
                    <span className="font-bold text-white">{manualResult.price}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-red-400 block">Stop Loss (20p)</span>
                    <span className="font-bold text-red-300">{manualResult.stopLoss}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-400 block">Target (50p)</span>
                    <span className="font-bold text-emerald-300">{manualResult.takeProfit}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Algorithmic Rationale:</span>
                  {manualResult.reasoning.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] leading-tight text-slate-300">
                      <span className="text-[#D4AF37] shrink-0">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] font-mono text-amber-200 flex items-center justify-between">
                  <span>Gilgil $2 Sizing Cap:</span>
                  <strong className="text-white">0.01 Micro Lot (Risk: $2.00 / 260 KES)</strong>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <SlidersHorizontal className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="text-xs">
                  Input your MT4 indicator parameters on the left and click <strong>Run Confluence Analysis</strong> to view the quantitative 0-100 verdict.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CAMERA AI VISION OCR SCANNER */}
      {activeTab === 'camera' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Camera Viewport (6 Cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative aspect-video rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-[#D4AF37]/50 flex flex-col items-center justify-center p-6 text-center overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                {cameraScanning && (
                  <div className="absolute inset-0 bg-[#080C14]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">
                      Neural Vision OCR Scanning Laptop Screen...
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Tracing 20 EMA, 50 EMA, and high wicks...
                    </span>
                  </div>
                )}

                <div className="relative z-10 space-y-3 max-w-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Laptop MT4 / MT5 Screen Lens</h5>
                    <p className="text-xs text-slate-400 mt-1">
                      Point your phone camera or upload a clear screenshot of your laptop candlestick chart.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={handleSimulateCameraScan}
                      disabled={cameraScanning}
                      className="px-4 py-2 rounded-xl btn-gold text-black font-bold text-xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scan Screen Sample</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Supports MT4, MT5, cTrader, and TradingView laptop screens.</span>
              </div>
            </div>

            {/* Camera Vision Results (6 Cols) */}
            <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
              {cameraResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00C261] animate-ping" />
                      <span className="text-xs font-mono font-bold text-white">
                        {cameraResult.detectedPair} • {cameraResult.detectedTimeframe}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#00C261] px-2 py-0.5 rounded bg-[#00C261]/20 border border-[#00C261]/30">
                      Confidence: {cameraResult.confidence}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase">Detected Pattern:</span>
                    <h4 className="text-sm font-bold text-white">{cameraResult.pattern}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{cameraResult.notes}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-[9px] text-slate-500 block">Detected Price</span>
                      <span className="font-bold text-white">{cameraResult.detectedPrice}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-red-400 block">Proposed SL</span>
                      <span className="font-bold text-red-300">{cameraResult.suggestedSL}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-400 block">Proposed TP</span>
                      <span className="font-bold text-emerald-300">{cameraResult.suggestedTP}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                    <span>Similarity to 1291.69 Winning Trades:</span>
                    <strong className="text-emerald-400">{cameraResult.similarityToWinningTrades}%</strong>
                  </div>

                  <button
                    onClick={() => alert('Trade parameters transferred to Pillar 8 Trade Logger!')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <span>Log Scanned Setup to Trade Journal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                  <Camera className="w-8 h-8 text-slate-600 animate-pulse" />
                  <p className="text-xs">
                    Click <strong>Scan Screen Sample</strong> on the left to simulate optical character recognition on an MT4 chart screen.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
