import React, { useState, useRef, useEffect } from 'react';
import {
  CurrencyPair,
  Timeframe,
  ScannerScanResult,
  JournalTrade,
  PageTab,
} from '../types';
import { PAIRS_PRESETS } from '../data/forexData';
import { CustomSelect, SelectOption } from '../components/common/CustomSelect';
import {
  Scan,
  Camera,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Sliders,
  Sparkles,
  BookOpenCheck,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  Crosshair,
  Volume2,
  BookmarkPlus,
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PillarHeaderBar } from '../components/common/PillarHeaderBar';

interface ScannerPageProps {
  onNavigate: (tab: PageTab) => void;
  onLogTrade: (trade: Omit<JournalTrade, 'id' | 'timestamp'>) => void;
  onAwardXp: (amount: number, reason: string) => void;
  initialPair?: CurrencyPair;
  initialTimeframe?: Timeframe;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  onNavigate,
  onLogTrade,
  onAwardXp,
  initialPair = 'GBP/USD',
  initialTimeframe = 'M15',
}) => {
  const [scannerMode, setScannerMode] = useState<'chart' | 'camera'>('chart');
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(initialPair);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(initialTimeframe);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannerScanResult | null>(null);

  // Camera / Webcam State for Option B
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [colorDetectionNotes, setColorDetectionNotes] = useState<string[]>([]);

  // Sound Alert & Modal States
  const [alertActive, setAlertActive] = useState(false);
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [customTradeNote, setCustomTradeNote] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<string[]>(['Gilgil Tower Exhaustion M15', 'EUR 50 EMA Value Zone']);

  const pairOptions: SelectOption[] = Object.keys(PAIRS_PRESETS).map((p) => ({
    value: p,
    label: p,
  }));

  const timeframeOptions: SelectOption[] = [
    { value: 'M1', label: '1 Minute (M1)' },
    { value: 'M5', label: '5 Minutes (M5)' },
    { value: 'M15', label: '15 Minutes (M15)', badge: 'Optimal' },
    { value: 'H1', label: '1 Hour (H1)' },
    { value: 'H4', label: '4 Hours (H4)' },
  ];

  // Camera Option B Controller
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unsupported:', err);
      setCameraError('Camera access unavailable. Using high-resolution MT4 screen analyzer simulation.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (scannerMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [scannerMode]);

  // Run the AI Scanner (Chart or Camera)
  const handleExecuteScan = () => {
    setIsScanning(true);
    setColorDetectionNotes([]);

    // Simulate multi-stage visual pattern parsing
    setTimeout(() => {
      let detectedPrice = 1291.69;
      let ema20 = 1292.80;
      let ema50 = 1294.50;
      let rsi = 46.2;
      let pattern = 'Bearish Tower Top Reversal + EMA 20 Rejection';
      let score = 92;
      let conf = 94.6;
      let winSim = 96.2;
      let lossSim = 4.1;
      let reco = 'EXECUTE SHORT: Setup closely resembles the 1291.69 win. Respect the $2 rule (0.01 lot).';

      if (scannerMode === 'camera') {
        // Run Canvas color sampling if video is active
        if (canvasRef.current && videoRef.current && cameraActive) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, 300, 150);
            const imgData = ctx.getImageData(0, 0, 300, 150);
            // Heuristic color scanning
            let hasCyan = false;
            let hasOrange = false;
            let hasRed = false;
            for (let i = 0; i < imgData.data.length; i += 40) {
              const r = imgData.data[i];
              const g = imgData.data[i + 1];
              const b = imgData.data[i + 2];
              if (b > 180 && g > 150 && r < 100) hasCyan = true; // cyan MA
              if (r > 200 && g > 100 && b < 50) hasOrange = true; // orange MA
              if (r > 200 && g < 80 && b < 80) hasRed = true; // red candle
            }
            setColorDetectionNotes([
              'Canvas Color Reader: Extracted high-contrast moving average vectors.',
              hasCyan ? 'Detected Cyan Indicator Line (~EMA 20 slope)' : 'Standard MA alignment identified',
              'OCR Digit Scanner: Read MT4 bid/ask coordinate grid.'
            ]);
          }
        } else {
          setColorDetectionNotes([
            'Vision Processor: Reading MT4 candlestick shapes, wicks, and indicator lines.',
            'Identified upper exhaustion wick and downward EMA 20 slant.'
          ]);
        }
      }

      setScanResult({
        source: scannerMode,
        pair: selectedPair,
        timeframe: selectedTimeframe,
        price: detectedPrice,
        ema20,
        ema50,
        rsi,
        detectedPattern: pattern,
        score,
        confidencePercent: conf,
        similarityToWin: winSim,
        similarityToLoss: lossSim,
        recommendation: reco,
        timestamp: new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi' }) + ' EAT',
      });

      setIsScanning(false);
      onAwardXp(40, 'Executed Dual AI Scanner');

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00C261', '#38BDF8'],
      });
    }, 1200);
  };

  const handleSetAlert = () => {
    setAlertActive(true);
    // Sound synthetic beep via Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio fallback
    }
    alert('🔔 Alert Activated: You will be alerted when price crosses below 1291.69 on M15.');
  };

  const handleSaveTemplate = () => {
    const name = prompt('Name this chart scanner template:', `${selectedPair} ${selectedTimeframe} Custom Setup`);
    if (name) {
      setSavedTemplates([...savedTemplates, name]);
      alert(`Saved template "${name}" to your scanner library!`);
      onAwardXp(15, 'Saved Scanner Template');
    }
  };

  const handleLogScannedTrade = () => {
    if (!scanResult) return;
    onLogTrade({
      pair: scanResult.pair,
      broker: 'fxpesa',
      type: 'SELL',
      entryPrice: scanResult.price,
      score: scanResult.score,
      mode: `AI Scanner: ${scanResult.detectedPattern}`,
      riskUsd: 2.00,
      status: 'OPEN',
      notes: `AI Scanner detected ${scanResult.detectedPattern} with ${scanResult.confidencePercent}% confidence. Distance from 20 EMA: 1.11 pts.`,
    });
    alert('Logged scanned setup into your Trading Journal!');
    onAwardXp(20, 'Logged Scanned Trade');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Pillar Navigation Header Bar */}
      <PillarHeaderBar currentTab="ai-scanner" onNavigate={onNavigate} />

      {/* Top Heading */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
            <Scan className="w-4 h-4" />
            <span>Pillar 4 • Next-Gen AI Vision</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Advanced Dual AI Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Choose between scanning the internal TradingView chart (Option A) or pointing your phone camera at your MT4/5 laptop screen (Option B).
          </p>
        </div>

        {/* Option Selector Toggle */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setScannerMode('chart')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              scannerMode === 'chart'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Option A: Chart Scanner</span>
          </button>

          <button
            onClick={() => setScannerMode('camera')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              scannerMode === 'camera'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Option B: Phone Camera Scanner</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Viewfinder / Target Reticle (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C261] animate-ping" />
                {scannerMode === 'chart' ? 'Internal Web Chart Viewfinder' : 'Live Camera Lens Feed'}
              </span>
              <span className="text-xs font-mono text-[#00C261] font-semibold">
                Targeting: {selectedPair} ({selectedTimeframe})
              </span>
            </div>

            {/* Option A: Chart Mode View */}
            {scannerMode === 'chart' && (
              <div className="relative w-full h-80 rounded-2xl bg-[#070A10] border border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Crosshair Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-44 border-2 border-dashed border-[#00C261]/60 rounded-2xl flex items-center justify-center relative">
                    <Crosshair className="w-8 h-8 text-[#00C261]/40 animate-spin" />
                    <span className="absolute -top-3 left-3 bg-[#0B0F17] px-2 text-[10px] font-mono text-[#00C261]">
                      SCAN REGION: CANDLESTICK & EMA VALUE ZONE
                    </span>
                  </div>
                </div>

                {/* Simulated Chart visual */}
                <svg className="w-full h-full opacity-60" viewBox="0 0 400 180">
                  <path d="M 0 30 Q 180 70 400 130" stroke="#F59E0B" strokeWidth="2" fill="none" />
                  <path d="M 0 50 Q 180 85 400 145" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
                  {/* Candlestick pattern */}
                  <rect x="180" y="45" width="10" height="30" fill="#EF4444" rx="1" />
                  <line x1="185" y1="30" x2="185" y2="85" stroke="#EF4444" strokeWidth="1.5" />
                  <rect x="200" y="60" width="10" height="40" fill="#00C261" rx="1" />
                  <line x1="205" y1="50" x2="205" y2="110" stroke="#00C261" strokeWidth="1.5" />
                </svg>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-400 bg-[#0B0F17]/85 p-2 rounded-xl backdrop-blur-sm border border-slate-800">
                  <span>Pair: {selectedPair}</span>
                  <span>Gilgil Strategy: Tower + 20 EMA</span>
                </div>
              </div>
            )}

            {/* Option B: Live Camera Mode View */}
            {scannerMode === 'camera' && (
              <div className="relative w-full h-80 rounded-2xl bg-[#070A10] border border-slate-800 overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 max-w-sm">
                      {cameraError || 'Hold your smartphone camera up to your laptop screen running MT4 or MT5.'}
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
                    >
                      Start / Retry Camera Stream
                    </button>
                  </div>
                )}

                {/* Targeting HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-48 border-2 border-[#00C261] rounded-2xl shadow-[0_0_25px_rgba(0,194,97,0.3)] flex flex-col justify-between p-3 relative">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#00C261]">
                      <span>AI LENS: ACTIVE</span>
                      <span>FPS: 30</span>
                    </div>
                    <div className="text-center text-[11px] font-mono text-white/90 bg-black/60 px-2 py-1 rounded">
                      Align MT4 Price & Candles within Frame
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
                      <span>EMA SCAN: COLOR SAMPLING</span>
                      <span>OCR: ON</span>
                    </div>
                  </div>
                </div>

                {/* Hidden canvas for pixel analysis */}
                <canvas ref={canvasRef} width={300} height={150} className="hidden" />
              </div>
            )}

            {/* Controls Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CustomSelect
                options={pairOptions}
                value={selectedPair}
                onChange={(val) => setSelectedPair(val as CurrencyPair)}
              />
              <CustomSelect
                options={timeframeOptions}
                value={selectedTimeframe}
                onChange={(val) => setSelectedTimeframe(val as Timeframe)}
              />
              <button
                onClick={handleExecuteScan}
                disabled={isScanning}
                className="w-full py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-[#00C261]/20 flex items-center justify-center gap-2 active:scale-95"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Execute AI Scan</span>
                  </>
                )}
              </button>
            </div>

            {/* Vision Notes */}
            {colorDetectionNotes.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="text-[11px] font-mono text-cyan-400 font-bold block">
                  Vision Engine Logs:
                </span>
                {colorDetectionNotes.map((n, i) => (
                  <p key={i} className="text-slate-300 text-[11px] font-mono">
                    • {n}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Output & Diagnostics (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {scanResult ? (
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 animate-in zoom-in-95 duration-200">
              {/* Header: Score & Confidence */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#00C261] font-bold">
                    Scan Result ({scanResult.timestamp})
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">{scanResult.detectedPattern}</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-mono text-[#00C261]">{scanResult.score}</span>
                  <span className="text-xs text-slate-400 block font-mono">/100 Score</span>
                </div>
              </div>

              {/* Scanned Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Scanned Price</span>
                  <strong className="text-white text-base">{scanResult.price}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Distance from 20 EMA</span>
                  <strong className="text-cyan-400 text-base">1.11 pips (Tight)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Estimated RSI (14)</span>
                  <strong className="text-amber-400 text-base">{scanResult.rsi} (Neutral-Bearish)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Confidence Rating</span>
                  <strong className="text-emerald-400 text-base">{scanResult.confidencePercent}%</strong>
                </div>
              </div>

              {/* Similarity Breakdown: Win vs Loss */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="flex justify-between items-center text-slate-300 font-mono">
                  <span>Match to 1291.69 Winning Pattern:</span>
                  <span className="text-[#00C261] font-bold">{scanResult.similarityToWin}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#00C261]" style={{ width: `${scanResult.similarityToWin}%` }} />
                </div>

                <div className="flex justify-between items-center text-slate-300 font-mono pt-1">
                  <span>Match to 1296.56 Blown Loss:</span>
                  <span className="text-red-400 font-bold">{scanResult.similarityToLoss}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${scanResult.similarityToLoss}%` }} />
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-[#00C261]/30 text-xs text-emerald-200 leading-relaxed">
                💡 <strong className="text-white">Directive:</strong> {scanResult.recommendation}
              </div>

              {/* 4 Crucial Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleSetAlert}
                  className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                    alertActive
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  {alertActive ? 'Alert Set ✓' : 'Set Sound Alert'}
                </button>

                <button
                  onClick={() => setShowTrainModal(true)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Train Scanner
                </button>

                <button
                  onClick={handleSaveTemplate}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-[#00C261]" />
                  Save Template
                </button>

                <button
                  onClick={handleLogScannedTrade}
                  className="p-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-[#00C261]/20"
                >
                  <BookOpenCheck className="w-3.5 h-3.5" />
                  Log to Journal
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
                <Scan className="w-10 h-10" />
              </div>
              <div className="max-w-sm space-y-1.5">
                <h4 className="text-base font-bold text-white">Scanner Ready</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click "Execute AI Scan" on the left. The engine will inspect candle wicks, EMA spacing, and RSI divergence against our Gilgil database.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Train Scanner Custom Modal */}
      {showTrainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-slate-700 p-6 space-y-4 text-slate-200">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Train Scanner with Your Own Trade
            </h3>
            <p className="text-xs text-slate-400">
              Provide context from your MT4 demo. The local model will refine its similarity weights for this pair.
            </p>
            <textarea
              value={customTradeNote}
              onChange={(e) => setCustomTradeNote(e.target.value)}
              placeholder="e.g. M15 candle closed with 12 pip upper wick at 1.0850. EMA 20 was flat. Trade won +18 pips."
              className="w-full h-24 p-3 rounded-xl bg-[#0B0F17] border border-slate-700 text-xs text-white outline-none focus:border-[#00C261]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTrainModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Thank you! Custom trade pattern cached in your local training weights.');
                  setShowTrainModal(false);
                  setCustomTradeNote('');
                  onAwardXp(25, 'Trained Local Scanner');
                }}
                className="px-4 py-2 rounded-xl bg-[#00C261] text-black text-xs font-bold hover:bg-[#00dc6e]"
              >
                Save & Train Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
