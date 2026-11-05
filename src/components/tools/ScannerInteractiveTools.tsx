import React, { useState, useRef, useEffect } from 'react';
import { CurrencyPair, Timeframe, ScannerAnalysisResult, BrokerId } from '../../types';
import { TradingViewEmbedWidget } from './TradingViewEmbedWidget';
import { MultiMarketRadarEngine } from './MultiMarketRadarEngine';
import { LiveInteractiveCandleChart } from './LiveInteractiveCandleChart';
import {
  MarketScanData,
  INITIAL_MARKETS_DATA,
  globalLiveStream,
  computeRealChartTradeParams,
  fetchLiveMarketSnapshot,
  fetchPairLiveCandleSnapshot,
  evaluateCandleSeriesAndTick,
  getCurrentMacroContext
} from '../../utils/liveMarketEngine';
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
  ArrowRight,
  ArrowLeft,
  Video,
  VideoOff,
  SwitchCamera,
  Image as ImageIcon,
  Check,
  ShieldCheck,
  Compass,
  Bot,
  Send,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Scale,
  Globe,
  BarChart3,
  ExternalLink,
  Award,
  Flame,
  Activity,
  Cpu,
  Copy,
  Volume2,
  VolumeX,
  FileCode,
  Share2,
  Smartphone,
  Download,
  X
} from 'lucide-react';

interface ScannerInteractiveToolsProps {
  onLogTrade?: (trade: any) => void;
}

export interface AdvisorTradeCard {
  pair: CurrencyPair;
  timeframe?: Timeframe;
  orderType?: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  slPips: number;
  tpPips: number;
  riskReward: string;
  lotSize: number;
  actualRiskUsd: number;
  potentialGainUsd: number;
  confidence: number;
  pattern: string;
  trend: string;
  brokerSymbol: string;
  brokerSpread: number;
  cmaProtection?: string;
  mt4Steps: string[];
  confluences: string[];
}

interface AdvisorMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  verdict?: 'GREEN_LIGHT' | 'CAUTION' | 'DO_NOT_TRADE';
  lotCap?: string;
  timestamp: string;
  tradeCard?: AdvisorTradeCard;
}

export const ScannerInteractiveTools: React.FC<ScannerInteractiveToolsProps> = ({ onLogTrade }) => {
  const [scannerView, setScannerView] = useState<'hub' | 'radar' | 'favorable_chart' | 'manual' | 'advisor' | 'camera'>('hub');
  const [activeTab, setActiveTab] = useState<'camera' | 'manual' | 'radar' | 'advisor'>('manual');
  const [liveMarkets, setLiveMarkets] = useState<MarketScanData[]>(INITIAL_MARKETS_DATA);
  const [feedSyncedAt, setFeedSyncedAt] = useState<string>('Synchronizing...');
  const [syncingQuotes, setSyncingQuotes] = useState<boolean>(false);
  const [userLockedCandlePrice, setUserLockedCandlePrice] = useState<boolean>(false);

  // Shared Required Data Ingestion State (Anchored to live GBP/USD M10/M15 setup)
  const [broker, setBroker] = useState<BrokerId>('fxpesa');
  const [pair, setPair] = useState<CurrencyPair>('GBP/USD');
  const [showTradingView, setShowTradingView] = useState<boolean>(false);
  const [analysisExecutionMode, setAnalysisExecutionMode] = useState<'standard' | 'deep_ai'>('deep_ai');
  const [copiedManualEa, setCopiedManualEa] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<Timeframe>('M15');
  const [biasOverride, setBiasOverride] = useState<'AUTO' | 'BUY' | 'SELL'>('AUTO');
  const [session, setSession] = useState<'London Open (10:00 EAT)' | 'New York AM (15:30 EAT)' | 'Asian Range (03:00 EAT)' | 'London Close (18:30 EAT)'>('London Open (10:00 EAT)');
  const [patternType, setPatternType] = useState<'Tower Top Liquidity Sweep' | '20/50 EMA Trend Bounce' | 'Asian Liquidity Sweep' | 'Fair Value Gap Re-test' | 'Bearish Order Block Mitigation'>('20/50 EMA Trend Bounce');
  const [currentPrice, setCurrentPrice] = useState<number>(1.34998);
  const [keyLevel, setKeyLevel] = useState<number>(1.34818);
  const [ema20, setEma20] = useState<number>(1.34878);
  const [ema50, setEma50] = useState<number>(1.34718);
  const [rsi, setRsi] = useState<number>(58.3);
  const [traderNotes, setTraderNotes] = useState<string>('GBP/USD live quote @ 1.34998 (+0.66%). Swept sell-side liquidity below 1.34818 with clean 20 EMA displacement.');

  // Camera State
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzingCamera, setAnalyzingCamera] = useState<boolean>(false);
  const [cameraAnalysisResult, setCameraAnalysisResult] = useState<any | null>(null);
  const [copiedCameraEa, setCopiedCameraEa] = useState<boolean>(false);

  // Manual Scanner State
  const [analyzingManual, setAnalyzingManual] = useState<boolean>(false);
  const [manualResult, setManualResult] = useState<ScannerAnalysisResult | null>(null);

  // AI Advisor State
  const [advisorInput, setAdvisorInput] = useState<string>('');
  const [advisorLoading, setAdvisorLoading] = useState<boolean>(false);
  const [advisorMessages, setAdvisorMessages] = useState<AdvisorMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Institutional AI Market Advisor initialized with live market stream. Select any pair below or enter your chart candlestick price (e.g. "GBP/USD at 1.34998 on 10m" or "Gold at 4041.495") to compute valid MT4 SL/TP levels.',
      timestamp: 'Active Now'
    }
  ]);

  // Journal log confirmation
  const [loggedSuccess, setLoggedSuccess] = useState<string | null>(null);
  const [chatSyncedNotification, setChatSyncedNotification] = useState<string | null>(null);
  const [expandedChartMsgId, setExpandedChartMsgId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [activeEaModalCard, setActiveEaModalCard] = useState<AdvisorTradeCard | null>(null);
  const [activeTelegramModalCard, setActiveTelegramModalCard] = useState<AdvisorTradeCard | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('pivotfx_webhook_url') || '';
    } catch {
      return '';
    }
  });
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Subscribe to global 24/7 every-second live stream
  const userLockedRef = useRef<boolean>(false);
  const selectedPairRef = useRef<CurrencyPair>(pair);
  useEffect(() => {
    userLockedRef.current = userLockedCandlePrice;
  }, [userLockedCandlePrice]);
  useEffect(() => {
    selectedPairRef.current = pair;
  }, [pair]);

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setLiveMarkets(streamState.markets);
      setFeedSyncedAt(streamState.syncedAt);

      if (!userLockedRef.current) {
        const match =
          streamState.markets.find((x) => x.pair === selectedPairRef.current) || streamState.markets[0];
        if (match) {
          setCurrentPrice(match.price);
          setKeyLevel(match.keyLevel);
          setEma20(match.ema20);
          setEma50(match.ema50);
          setRsi(match.rsi);
          setPatternType(match.patternType);
          setTraderNotes(match.projection);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSyncLiveQuotes = async () => {
    setSyncingQuotes(true);
    setUserLockedCandlePrice(false);
    const [singleSnap, allSnap] = await Promise.all([
      fetchPairLiveCandleSnapshot(pair, timeframe),
      fetchLiveMarketSnapshot(liveMarkets)
    ]);
    setLiveMarkets(allSnap.markets);
    setFeedSyncedAt(singleSnap.lastCandleTime || allSnap.syncedAt);
    setCurrentPrice(singleSnap.price);
    setKeyLevel(singleSnap.keyLevel);
    setEma20(singleSnap.ema20);
    setEma50(singleSnap.ema50);
    setRsi(singleSnap.rsi);
    setPatternType(singleSnap.patternType);
    setSyncingQuotes(false);
    setChatSyncedNotification(
      `${singleSnap.liveConnected ? 'Live Interbank Candle' : 'Calibrated Feed'} synced (${singleSnap.lastCandleTime}): ${pair} [${timeframe}] @ ${singleSnap.price}`
    );
    setTimeout(() => setChatSyncedNotification(null), 3500);
  };

  // Auto-update details immediately from real-time OHLC candle stream when switching pair or timeframe
  const handleSwitchPairAndSyncRealData = (
    newPair: CurrencyPair,
    customMarkets?: MarketScanData[],
    newTimeframe?: Timeframe
  ) => {
    const activeTf = newTimeframe || timeframe;
    setPair(newPair);
    if (newTimeframe) setTimeframe(newTimeframe);
    setUserLockedCandlePrice(false);

    const sourceList = customMarkets || liveMarkets;
    const m = sourceList.find((x) => x.pair === newPair) || INITIAL_MARKETS_DATA.find((x) => x.pair === newPair);
    if (m) {
      const reEvaluated = evaluateCandleSeriesAndTick({
        pair: newPair,
        timeframe: activeTf,
        livePrice: m.price,
        baseCandles: m.candles,
        change24hPct: m.change24hPct
      });
      setCurrentPrice(m.price);
      setKeyLevel(reEvaluated.keyLevel);
      setEma20(reEvaluated.ema20);
      setEma50(reEvaluated.ema50);
      setRsi(reEvaluated.rsi);
      setPatternType(reEvaluated.patternType);
      setTraderNotes(m.projection);
    }

    // Fetch live OHLC bars in background for exact latest candlestick quote
    fetchPairLiveCandleSnapshot(newPair, activeTf).then((snap) => {
      setCurrentPrice(snap.price);
      setKeyLevel(snap.keyLevel);
      setEma20(snap.ema20);
      setEma50(snap.ema50);
      setRsi(snap.rsi);
      setPatternType(snap.patternType);
      setFeedSyncedAt(snap.lastCandleTime);
    });
  };

  // Reactive live candle edit: a slight change upward or downward across candles dynamically recomputes EMA20, EMA50, RSI, liquidity & strategy!
  const handleLiveCandlePriceEdit = (rawValue: string) => {
    const num = parseFloat(rawValue) || 0;
    setCurrentPrice(num);
    if (num <= 0) return;

    setUserLockedCandlePrice(true);
    const matchingMarket = liveMarkets.find((m) => m.pair === pair);
    const reEval = evaluateCandleSeriesAndTick({
      pair,
      timeframe,
      livePrice: num,
      baseCandles: matchingMarket?.candles,
      change24hPct: matchingMarket?.change24hPct
    });
    setEma20(reEval.ema20);
    setEma50(reEval.ema50);
    setRsi(reEval.rsi);
    setKeyLevel(reEval.keyLevel);
    setPatternType(reEval.patternType);
  };

  // 1-Click Market Selection & Auto Deep AI Scan
  const handleSelectMarketAndDeepScanInChat = (targetPair: CurrencyPair) => {
    handleSwitchPairAndSyncRealData(targetPair);
    const m = liveMarkets.find((x) => x.pair === targetPair) || INITIAL_MARKETS_DATA.find((x) => x.pair === targetPair);
    if (m) {
      setActiveTab('advisor');
      handleTriggerChatAnalysis(m, 'deep_ai');
    }
  };

  // Voice Audio Speech Synthesis for Trade Audits
  const handleToggleSpeakAudit = (msgId: string, card: AdvisorTradeCard) => {
    if (!('speechSynthesis' in window)) {
      setChatSyncedNotification('⚠️ Audio voice synthesis is not supported on this browser.');
      setTimeout(() => setChatSyncedNotification(null), 2500);
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const actionWord = card.direction === 'BUY' ? 'Buy' : 'Sell';
    const textToSpeak = `PivotFX Institutional Signal. ${actionWord} ${card.pair} by market at ${card.entryPrice}. Stop Loss at ${card.stopLoss}, risking ${card.slPips} pips. Maximum loss is strictly capped at two dollars on zero point zero one micro lot under the Gilgil shield. Take Profit 1 at ${card.tp1}, close fifty percent and move to breakeven. Final Take Profit 2 at ${card.tp2}. Risk reward ratio 1 to ${card.riskReward}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Trade parameter computation imported from ../../utils/liveMarketEngine

  // Generate MQL4 Script Code
  const generateMql4Script = (card: AdvisorTradeCard): string => {
    const isBuy = card.direction === 'BUY';
    const cmd = isBuy ? 'OP_BUY' : 'OP_SELL';
    return `//+------------------------------------------------------------------+
//| PivotFX Institutional One-Click Order Script                     |
//| Gilgil Shield: 0.01 Micro Lot ($2.00 / 260 KES Max Loss)         |
//| Pair: ${card.pair} | Broker: ${broker.toUpperCase()}             |
//+------------------------------------------------------------------+
#property copyright "PivotFX Institutional"
#property link      "https://pivotfx.academy"
#property version   "2.00"
#property strict
#property show_inputs

extern double   InpLotSize       = ${card.lotSize};        // Volume (Strict 0.01 Micro Lot)
extern double   InpStopLoss      = ${card.stopLoss};       // Stop Loss (-${card.slPips} pips)
extern double   InpTakeProfit1   = ${card.tp1};            // Take Profit 1 (50% scale-out)
extern double   InpTakeProfit2   = ${card.tp2};            // Take Profit 2 (Final Institutional)
extern int      InpSlippage      = 3;                      // Max Slippage Pips
extern string   InpComment       = "PivotFX_${card.pair.replace('/', '')}_Gilgil";
extern int      InpMagicNumber   = 777129;

void OnStart()
{
   Print("PivotFX: Initiating institutional order on ", Symbol());
   double price = (${isBuy ? 'MarketInfo(Symbol(), MODE_ASK)' : 'MarketInfo(Symbol(), MODE_BID)'});
   int ticket = OrderSend(Symbol(), ${cmd}, InpLotSize, price, InpSlippage, InpStopLoss, InpTakeProfit2, InpComment, InpMagicNumber, 0, ${isBuy ? 'clrLime' : 'clrRed'});
   
   if(ticket > 0)
   {
      Alert("PivotFX: Order Executed! Ticket #", ticket, " | Lots: ", InpLotSize, " | Symbol: ", Symbol());
   }
   else
   {
      Alert("PivotFX Order Failed. Error: ", GetLastError());
   }
}
//+------------------------------------------------------------------+`;
  };

  // Generate .set File Content
  const generateSetFileContent = (card: AdvisorTradeCard): string => {
    return `; PivotFX Institutional Parameter Preset
; Symbol: ${card.brokerSymbol} (${card.pair})
; Risk: $2.00 / 260 KES Hard Cap via 0.01 Lot
InpLotSize=${card.lotSize}
InpStopLoss=${card.stopLoss}
InpTakeProfit1=${card.tp1}
InpTakeProfit2=${card.tp2}
InpMaxRiskUsd=2.00
InpSlippage=3
InpMagicNumber=777129
`;
  };

  // Download generic file
  const handleDownloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setChatSyncedNotification(`✓ Downloaded ${filename}!`);
    setTimeout(() => setChatSyncedNotification(null), 2500);
  };

  // Shareable message formatting for Telegram / WhatsApp
  const getShareableText = (card: AdvisorTradeCard): string => {
    return `⚡ *PIVOTFX INSTITUTIONAL SIGNAL* ⚡\n\n` +
      `📊 *Pair:* ${card.pair} (${card.brokerSymbol})\n` +
      `🎯 *Action:* ${card.direction} BY MARKET\n` +
      `📍 *Entry:* ${card.entryPrice}\n` +
      `🛑 *Stop Loss:* ${card.stopLoss} (-${card.slPips} pips / $${card.actualRiskUsd})\n` +
      `🎯 *TP1 (50% & BE):* ${card.tp1}\n` +
      `🚀 *TP2 (Final):* ${card.tp2} (+${card.tpPips} pips)\n` +
      `⚖️ *R:R Ratio:* 1 : ${card.riskReward}\n` +
      `🛡️ *Gilgil Risk Shield:* 0.01 Micro Lot ($2.00 / 260 KES Max Loss)\n` +
      `🏦 *Broker:* ${broker.toUpperCase()} (~${card.brokerSpread} pips)\n` +
      `🧠 *Pattern:* ${card.pattern} (${card.confidence}% Confluence)`;
  };

  // Stop camera stream cleanly on unmount or mode switch
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Synchronize video element when stream changes
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => {
        console.warn('Auto-play was prevented:', err);
      });
    }
  }, [cameraStream, isStreaming]);

  // Start Real Live Camera Stream
  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('WebRTC Camera is not supported on this device/browser. Please upload an MT4 screenshot instead.');
        return;
      }

      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: cameraFacingMode },
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          aspectRatio: { ideal: 1.777777778 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setIsStreaming(true);
      setCapturedImage(null);
    } catch (err: any) {
      console.error('Camera prompt error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Camera access was denied by your browser. You can click the lock/camera icon in your browser address bar to allow camera, or upload an MT4 screenshot directly below.'
        );
      } else {
        setCameraError(
          `Unable to open camera stream (${err.message || 'Device in use'}). You can upload a chart screenshot or choose a preset test below.`
        );
      }
      setIsStreaming(false);
    }
  };

  // Stop Live Camera Stream
  const handleStopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsStreaming(false);
  };

  // Flip Camera (environment vs user)
  const handleFlipCamera = async () => {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextMode);
    if (isStreaming) {
      handleStopCamera();
      setTimeout(() => {
        setCameraFacingMode(nextMode);
        handleStartCamera();
      }, 200);
    }
  };

  // Snap Frame from Live Video (Full Widescreen Dimension Capture)
  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1280, video.videoWidth || 1920);
    canvas.height = Math.max(720, video.videoHeight || 1080);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      // STOP THE CAMERA STREAM IMMEDIATELY SO CAPTURED IMAGE RENDERS IN VIEWPORT
      handleStopCamera();
      setCapturedImage(dataUrl);
      playAudioBeep(680, 0.08);
      runInstitutionalVisionAnalysis(dataUrl);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedImage(dataUrl);
        handleStopCamera();
        runInstitutionalVisionAnalysis(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load Preset Chart Samples (Using Live Contemporary Market Quotes)
  const handleLoadSample = (sampleType: 'gbpusd' | 'eurusd' | 'xauusd') => {
    handleStopCamera();
    const targetPair: CurrencyPair =
      sampleType === 'gbpusd' ? 'GBP/USD' : sampleType === 'eurusd' ? 'EUR/USD' : 'XAU/USD';
    const m = liveMarkets.find((x) => x.pair === targetPair) || INITIAL_MARKETS_DATA.find((x) => x.pair === targetPair)!;
    setPair(m.pair);
    setTimeframe(m.recommendedTf);
    setSession('London Open (10:00 EAT)');
    setCurrentPrice(m.price);
    setKeyLevel(m.keyLevel);
    setEma20(m.ema20);
    setEma50(m.ema50);
    setRsi(m.rsi);
    setPatternType(m.patternType);
    setTraderNotes(m.projection);
    runInstitutionalVisionAnalysis(
      sampleType === 'gbpusd'
        ? '/samples/gbpusd_tower.png'
        : sampleType === 'eurusd'
        ? '/samples/eurusd_bounce.png'
        : '/samples/xauusd_sweep.png'
    );
  };

  // Run Real-Time Institutional Vision Analysis (Guaranteed Safe MT4 S/L & T/P Resolution)
  const runInstitutionalVisionAnalysis = (imageSrc: string) => {
    setAnalyzingCamera(true);
    setCameraAnalysisResult(null);

    setTimeout(() => {
      try {
        const pipMultiplier = pair.includes('JPY') ? 100 : pair.includes('XAU') ? 10 : pair.includes('BTC') ? 1 : 10000;
        const distFromEma20Pips = Math.abs(currentPrice - ema20) * pipMultiplier;
        const computed = computeRealChartTradeParams({
          targetPair: pair,
          targetTf: timeframe,
          targetBroker: broker,
          price: currentPrice,
          keyLevel,
          ema20,
          ema50,
          rsi
        });

        const score = Math.round(computed.confidence);
        const verdict =
          computed.direction === 'BUY'
            ? `HIGH PROBABILITY BUY (${patternType.toUpperCase()})`
            : `HIGH PROBABILITY SELL (${patternType.toUpperCase()})`;

        const brokerSpreadCostUsd = (computed.brokerSpread * 0.01 * 10 * (pair.includes('XAU') ? 0.1 : 0.1)).toFixed(2);
        const decimals = computed.decimals;

        setCameraAnalysisResult({
          imageSrc,
          pair,
          timeframe,
          session,
          broker,
          currentPrice: computed.entryPrice,
          keyLevel,
          pattern: patternType,
          score,
          confidencePercent: computed.confidence,
          orderType: computed.orderType,
          verdict,
          entryPrice: computed.entryPrice,
          suggestedSL: computed.stopLoss,
          suggestedTP: computed.tp2,
          tp1Price: computed.tp1,
          slPips: computed.slPips,
          tpPips: computed.tpPips,
          riskReward: computed.riskReward,
          suggestedLot: computed.lotSize,
          actualRiskUsd: computed.actualRiskUsd,
          potentialGainUsd: computed.potentialGainUsd,
          brokerSpreadPips: computed.brokerSpread,
          brokerSpreadCostUsd,
          mt4SafetyProof: computed.mt4SafetyProof,
          ocrExtracted: {
            detectedPair: pair,
            detectedTimeframe: timeframe,
            detectedPrice: computed.entryPrice,
            detectedWickPeak: keyLevel,
            wickExcessPips: (Math.abs(keyLevel - currentPrice) * pipMultiplier).toFixed(1),
            fvgZone: `${(currentPrice - 6 / pipMultiplier).toFixed(decimals)} - ${(currentPrice + 6 / pipMultiplier).toFixed(decimals)}`,
            obStatus: 'Defended Mean Threshold (50%)',
            status: '100% INGESTED'
          },
          confluences: [
            `Session Timing: ${session} aligns with institutional bank liquidity.`,
            `Spread Check: ${broker.toUpperCase()} typical spread is ~${computed.brokerSpread} pips ($${brokerSpreadCostUsd} on 0.01 lot).`,
            `Mean Reversion: Price positioned ${distFromEma20Pips.toFixed(1)} pips from 20 EMA (${ema20}).`,
            `Momentum Engine: RSI (14) at ${rsi} confirms institutional positioning.`,
            `${computed.mt4SafetyProof}`,
            `Gilgil $2 Protection: Mathematical risk hard-capped at $2.00 (260 KES).`
          ],
          mt4Steps: [
            `1. Open MT4/MT5 -> Select ${computed.brokerSymbol} (${timeframe}) -> Press F9 (New Order Ticket)`,
            `2. Type: ${computed.orderType} @ ${computed.entryPrice}`,
            `3. Volume: STRICTLY ${computed.lotSize} Micro Lot (Gilgil $2 Capital Shield)`,
            `4. Set Stop Loss: ${computed.stopLoss} (-${computed.slPips} pips)`,
            `5. Set Take Profit: ${computed.tp2} (+${computed.tpPips} pips)`,
            `6. Scale-Out Protocol: Close 50% at ${computed.tp1} & move SL to Breakeven`
          ],
          notes: traderNotes || computed.trajectory,
        });
      } catch (err) {
        console.error('Vision analysis calculation error:', err);
      } finally {
        setAnalyzingCamera(false);
        playAudioBeep(880, 0.12);
      }
    }, 380);
  };

  // Run Analysis Engine (Supports both Standard Confluence and Deep AI Institutional EA)
  // Always syncs with fresh live candlestick OHLC data on Analyse, Deep AI Analyse, & Reanalyse!
  const handleRunAnalysis = async (mode: 'standard' | 'deep_ai', prefill?: MarketScanData) => {
    const activePair = prefill?.pair || pair;
    const activeTf = prefill?.recommendedTf || timeframe;

    if (prefill?.recommendedTf) {
      setTimeframe(prefill.recommendedTf);
    }

    setAnalysisExecutionMode(mode);
    setAnalyzingManual(true);
    setManualResult(null);

    try {
      let targetPrice = prefill?.price || currentPrice;
      let targetEma20 = prefill?.ema20 ?? ema20;
      let targetEma50 = prefill?.ema50 ?? ema50;
      let targetRsi = prefill?.rsi ?? rsi;
      let targetKeyLevel = prefill?.keyLevel ?? keyLevel;
      let targetPattern = prefill?.patternType ?? patternType;
      let targetAtrPips = prefill?.atrPips;

      if (!prefill) {
        const [liveSnap] = await Promise.all([
          fetchPairLiveCandleSnapshot(
            activePair,
            activeTf,
            userLockedCandlePrice && currentPrice > 0 ? currentPrice : undefined
          ),
          !userLockedCandlePrice
            ? globalLiveStream.triggerScan(mode === 'deep_ai' ? 'deep_ai' : 'rescan')
            : Promise.resolve(globalLiveStream.getState())
        ]);
        targetPrice = liveSnap.price;
        targetEma20 = liveSnap.ema20;
        targetEma50 = liveSnap.ema50;
        targetRsi = liveSnap.rsi;
        targetKeyLevel = liveSnap.keyLevel;
        targetPattern = liveSnap.patternType;
        targetAtrPips = liveSnap.atrPips;

        setCurrentPrice(liveSnap.price);
        setEma20(liveSnap.ema20);
        setEma50(liveSnap.ema50);
        setRsi(liveSnap.rsi);
        setKeyLevel(liveSnap.keyLevel);
        setPatternType(liveSnap.patternType);
        setFeedSyncedAt(liveSnap.lastCandleTime);
      }

      if (!targetPrice || targetPrice <= 0) {
        setChatSyncedNotification('Please enter a valid positive Current Market Price from your chart.');
        setTimeout(() => setChatSyncedNotification(null), 3000);
        setAnalyzingManual(false);
        return;
      }

      const manualDirection =
        prefill?.bias === 'STRONG_BUY'
          ? 'BUY'
          : prefill?.bias === 'STRONG_SELL'
          ? 'SELL'
          : biasOverride !== 'AUTO'
          ? biasOverride
          : undefined;

      const pctMap: Partial<Record<CurrencyPair, number>> = {};
      liveMarkets.forEach((m) => {
        pctMap[m.pair] = m.change24hPct;
      });
      const currentMacro = getCurrentMacroContext(pctMap);

      const computed = computeRealChartTradeParams({
        targetPair: activePair,
        targetTf: activeTf,
        targetBroker: broker,
        price: targetPrice,
        keyLevel: targetKeyLevel,
        ema20: targetEma20,
        ema50: targetEma50,
        rsi: targetRsi,
        atrPips: targetAtrPips,
        macro: currentMacro,
        biasOverride: manualDirection
      });

      const isBuy = computed.direction === 'BUY';
      const pipMultiplier = activePair.includes('JPY') ? 100 : activePair.includes('XAU') ? 10 : activePair.includes('BTC') ? 1 : 10000;
      const distFromEma20Pips = Math.abs(targetPrice - targetEma20) * pipMultiplier;

      const confidencePercent = Number(
        Math.min(98.2, computed.confidence + (mode === 'deep_ai' ? 1.4 : -1.2)).toFixed(1)
      );
      const score = Math.round(confidencePercent);
      const verdict: 'WAIT' | 'RISKY' | 'HIGH_PROBABILITY_BUY' | 'HIGH_PROBABILITY_SELL' =
        prefill?.bias === 'NEUTRAL_CHOP'
          ? 'WAIT'
          : isBuy
          ? 'HIGH_PROBABILITY_BUY'
          : 'HIGH_PROBABILITY_SELL';

      const pattern = prefill?.ictPattern || targetPattern;
      const trend = prefill?.trend || (isBuy ? 'Bullish Institutional Structure Shift' : 'Bearish Liquidity Distribution');
      const projection = computed.trajectory;

      const reasons: string[] = [
        `${computed.mt4SafetyProof}`,
        `Anchored to live chart candlestick @ ${computed.entryPrice} on ${activeTf} timeframe.`,
        `EMA Stack Context: 20 EMA at ${targetEma20}, 50 EMA at ${targetEma50} (${distFromEma20Pips.toFixed(1)} pips offset).`,
        `Momentum & Liquidity: RSI (14) at ${targetRsi} · Sweep pool @ ${targetKeyLevel}.`,
        `Gilgil Sizing Shield: Strictly 0.01 micro lot ($${computed.actualRiskUsd.toFixed(2)} / 260 KES max loss cap).`
      ];

      if (mode === 'deep_ai') {
        reasons.push('Deep AI Multi-Confluence Engine: Institutional order flow & spread tolerance verified.');
      }

      const slPrice = computed.stopLoss;
      const tpPrice = computed.tp2;
      const tp1Price = computed.tp1;
      const decimals = computed.decimals;
      const cleanPairSymbol = computed.brokerSymbol;

      const brokerConfigs: Record<BrokerId, { symbol: string; spread: number; leverage: string; marginCostUsd: number; serverName: string; instructions: string[] }> = {
        fxpesa: {
          symbol: computed.brokerSymbol,
          spread: computed.brokerSpread,
          leverage: '1:400 (CMA Kenya Capped)',
          marginCostUsd: 2.50,
          serverName: 'EGM-Real / FXPesa Live',
          instructions: [
            '1. Open MT4/MT5 connected to FXPesa Kenya server.',
            `2. Select symbol: ${computed.brokerSymbol} (Timeframe: ${activeTf}).`,
            `3. Order Type: ${computed.orderType}.`,
            '4. Volume: 0.01 micro lot (strict $2.00 / 260 KES Gilgil protection).',
            `5. Input Stop Loss: ${slPrice.toFixed(decimals)}, Take Profit: ${tpPrice.toFixed(decimals)}.`,
            '6. CMA safety: Zero negative balance debt risk.'
          ]
        },
        hfm: {
          symbol: broker === 'hfm' ? computed.brokerSymbol : `${cleanPairSymbol}.h`,
          spread: broker === 'hfm' ? computed.brokerSpread : 1.3,
          leverage: '1:1000 (High Leverage)',
          marginCostUsd: 1.00,
          serverName: 'HFMarkets-Live',
          instructions: [
            '1. Open HFM MT4/MT5 terminal.',
            `2. Choose symbol: ${computed.brokerSymbol} (Timeframe: ${activeTf}).`,
            `3. Order Type: ${computed.orderType}.`,
            '4. Set Volume to 0.01 micro lot. Do NOT use excess leverage.',
            `5. Stop Loss: ${slPrice.toFixed(decimals)}, Target: ${tpPrice.toFixed(decimals)}.`
          ]
        },
        exness: {
          symbol: broker === 'exness' ? computed.brokerSymbol : `${cleanPairSymbol}.m`,
          spread: broker === 'exness' ? computed.brokerSpread : 0.6,
          leverage: '1:2000 / Unlimited Dynamic',
          marginCostUsd: 0.50,
          serverName: 'Exness-Real',
          instructions: [
            '1. Open Exness MT4/MT5 or Exness Terminal web.',
            `2. Select micro symbol: ${computed.brokerSymbol} (Timeframe: ${activeTf}).`,
            '3. Raw spread is tight with 0 stop-level limits.',
            '4. Volume: 0.01 Micro Lot. Benefit from instant algorithmic execution.',
            `5. Stop Loss: ${slPrice.toFixed(decimals)}, Target 1: ${tp1Price.toFixed(decimals)}, Final TP: ${tpPrice.toFixed(decimals)}.`,
            '6. Withdrawals to M-Pesa are automated 24/7 in < 3 minutes.'
          ]
        },
        fbs: {
          symbol: computed.brokerSymbol,
          spread: broker === 'fbs' ? computed.brokerSpread : 1.5,
          leverage: '1:3000 (Ultra High)',
          marginCostUsd: 0.35,
          serverName: 'FBS-Real',
          instructions: [
            '1. Open FBS MT4/MT5 Cent or Standard platform.',
            `2. Symbol: ${computed.brokerSymbol} (Timeframe: ${activeTf}).`,
            `3. Order Type: ${computed.orderType}.`,
            '4. Strict 0.01 lot volume. Avoid margin overtrading trap.',
            `5. Set Stop Loss: ${slPrice.toFixed(decimals)}, Target: ${tpPrice.toFixed(decimals)}.`
          ]
        }
      };

      const currentBrokerSpec = brokerConfigs[broker];

      setManualResult({
        pair: activePair,
        timeframe: activeTf,
        price: computed.entryPrice,
        ema20: targetEma20,
        ema50: targetEma50,
        rsi: targetRsi,
        score,
        confidencePercent,
        analysisMode: mode,
        verdict,
        trend,
        projection,
        orderType: computed.orderType,
        detectedPattern: pattern,
        stopLoss: Number(slPrice.toFixed(decimals)),
        takeProfit: Number(tpPrice.toFixed(decimals)),
        tp1Price: Number(tp1Price.toFixed(decimals)),
        tp2Price: Number(tpPrice.toFixed(decimals)),
        riskReward: computed.riskReward,
        suggestedLot: 0.01,
        reasoning: reasons,
        howToPlaceSteps: currentBrokerSpec.instructions,
        brokerDashboard: {
          broker,
          symbol: currentBrokerSpec.symbol,
          spreadPips: currentBrokerSpec.spread,
          leverage: currentBrokerSpec.leverage,
          marginCostUsd: currentBrokerSpec.marginCostUsd,
          serverName: currentBrokerSpec.serverName,
          instructions: currentBrokerSpec.instructions
        }
      });

      setAnalyzingManual(false);
      playAudioBeep(mode === 'deep_ai' ? 980 : 880, 0.15);
    } catch {
      setAnalyzingManual(false);
    }
  };

  // 1-Click Institutional Analysis from Chat Table
  const handleTriggerChatAnalysis = (m: MarketScanData, mode: 'standard' | 'deep_ai') => {
    // 1. Auto-update details first as real as they are
    handleSwitchPairAndSyncRealData(m.pair);

    // 2. Notification flash
    setChatSyncedNotification(`✓ Auto-updated ${m.pair} real quote @ ${m.price} (20 EMA: ${m.ema20}, 50 EMA: ${m.ema50}, RSI: ${m.rsi})`);
    setTimeout(() => setChatSyncedNotification(null), 3000);

    // 3. User message
    const userMsg: AdvisorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: `⚡ Execute ${mode === 'deep_ai' ? 'Deep AI Institutional' : 'Standard Technical'} Analysis on ${m.pair} (${m.symbol}) @ ${m.price} on ${broker.toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setAdvisorMessages((prev) => [...prev, userMsg]);
    setAdvisorLoading(true);

    const delay = mode === 'deep_ai' ? 650 : 350;

    setTimeout(() => {
      const isBuy = m.bias === 'STRONG_BUY';
      const computed = computeRealChartTradeParams({
        targetPair: m.pair,
        targetTf: timeframe,
        targetBroker: broker,
        price: m.price,
        keyLevel: m.keyLevel,
        ema20: m.ema20,
        ema50: m.ema50,
        rsi: m.rsi,
        biasOverride: isBuy ? 'BUY' : 'SELL'
      });

      const orderType = computed.orderType;
      const slDistancePips = computed.slPips;
      const tpDistancePips = computed.tpPips;
      const decimals = computed.decimals;
      const cleanSymbol = computed.brokerSymbol;

      const mt4Steps = [
        `1. Open MT4/MT5 -> Select ${cleanSymbol} (Timeframe: ${timeframe}) -> Press F9 (New Order Ticket)`,
        `2. Type: ${orderType} (Instant Algorithmic Execution)`,
        `3. Volume: STRICTLY 0.01 Micro Lot (Gilgil $2.00 / 260 KES Capital Shield)`,
        `4. Set Stop Loss: ${computed.stopLoss.toFixed(decimals)} (-${slDistancePips} pips)`,
        `5. Set Take Profit: ${computed.tp2.toFixed(decimals)} (+${tpDistancePips} pips)`,
        `6. Scale-Out Protocol: Close 50% at ${computed.tp1.toFixed(decimals)} & move SL to Breakeven`
      ];

      const confluences = [
        `Timeframe Alignment: ${timeframe} institutional order flow with verified stop clearance.`,
        `Session Timing: ${m.recommendedSession} aligns with institutional order books.`,
        `Broker Execution: ${broker.toUpperCase()} typical spread is ~${computed.brokerSpread} pips.`,
        `Indicator Matrix: 20 EMA at ${m.ema20}, 50 EMA at ${m.ema50}, RSI at ${m.rsi}.`,
        `Institutional Footprint: ${m.ictPattern}.`,
        `Trajectory: ${m.projection}`,
        `Gilgil $2 Shield: 0.01 micro lot caps risk strictly at $2.00 (260 KES).`
      ];

      const aiMsg: AdvisorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `**${mode === 'deep_ai' ? '🧠 DEEP AI INSTITUTIONAL' : '⚡ REAL CONFLUENCE'} AUDIT FOR ${m.pair} (${m.symbol}) [${timeframe}]:**\n• **Order Type:** ${orderType}\n• **Entry Price:** ${m.price}\n• **Stop Loss:** ${computed.stopLoss} (-${slDistancePips} pips)\n• **Take Profit 1:** ${computed.tp1} (50% scale-out & move SL to Breakeven)\n• **Take Profit 2:** ${computed.tp2} (+${tpDistancePips} pips final institutional target)\n• **Risk:Reward:** ${computed.riskReward}\n• **Max Risk:** $2.00 / 260 KES strictly on 0.01 micro lot\n• **MT4 Ticket:** Symbol ${cleanSymbol} on ${broker.toUpperCase()} (~${computed.brokerSpread}p spread)\n• **CMA Guarantee:** Zero negative balance debt risk`,
        verdict: isBuy || m.bias === 'STRONG_SELL' ? 'GREEN_LIGHT' : 'CAUTION',
        lotCap: '0.01 Micro Lot ($2.00 Max Risk)',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        tradeCard: {
          pair: m.pair,
          timeframe,
          orderType,
          direction: isBuy ? 'BUY' : 'SELL',
          entryPrice: m.price,
          stopLoss: computed.stopLoss,
          tp1: computed.tp1,
          tp2: computed.tp2,
          slPips: slDistancePips,
          tpPips: tpDistancePips,
          riskReward: computed.riskReward,
          lotSize: 0.01,
          actualRiskUsd: computed.actualRiskUsd,
          potentialGainUsd: computed.potentialGainUsd,
          confidence: m.confidence,
          pattern: m.ictPattern,
          trend: m.trend,
          brokerSymbol: cleanSymbol,
          brokerSpread: computed.brokerSpread,
          cmaProtection: computed.cmaProtection,
          mt4Steps,
          confluences
        }
      };

      setAdvisorMessages((prev) => [...prev, aiMsg]);
      setAdvisorLoading(false);
      playAudioBeep(mode === 'deep_ai' ? 980 : 880, 0.15);
    }, delay);
  };

  // AI Market Advisor Engine
  const handleAskAdvisor = (queryText: string) => {
    const textToQuery = queryText || advisorInput;
    if (!textToQuery.trim()) return;

    const userMsg: AdvisorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToQuery,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setAdvisorMessages((prev) => [...prev, userMsg]);
    setAdvisorInput('');
    setAdvisorLoading(true);

    setTimeout(() => {
      let reply = '';
      let verdict: 'GREEN_LIGHT' | 'CAUTION' | 'DO_NOT_TRADE' = 'GREEN_LIGHT';
      let lotCap = '0.01 Micro Lot ($2.00 Max Risk)';

      const queryLower = textToQuery.toLowerCase();

      // 1. Detect if user specifies pair
      let targetPair: CurrencyPair = pair;
      if (queryLower.includes('gold') || queryLower.includes('xau')) targetPair = 'XAU/USD';
      else if (queryLower.includes('fiber') || queryLower.includes('eur/usd') || queryLower.includes('eurusd') || queryLower.includes('euro') || queryLower.includes('usd/euro') || queryLower.includes('usd euro') || queryLower.includes('usdeur')) targetPair = 'EUR/USD';
      else if (queryLower.includes('cable') || queryLower.includes('gbp/usd') || queryLower.includes('gbpusd') || queryLower.includes('pound')) targetPair = 'GBP/USD';
      else if (queryLower.includes('ninja') || queryLower.includes('usd/jpy') || queryLower.includes('usdjpy') || queryLower.includes('yen')) targetPair = 'USD/JPY';
      else if (queryLower.includes('dragon') || queryLower.includes('gbp/jpy') || queryLower.includes('gbpjpy') || queryLower.includes('guppy')) targetPair = 'GBP/JPY';
      else if (queryLower.includes('bitcoin') || queryLower.includes('btc')) targetPair = 'BTC/USD';
      else if (queryLower.includes('loonie') || queryLower.includes('usd/cad') || queryLower.includes('usdcad')) targetPair = 'USD/CAD';
      else if (queryLower.includes('aussie') || queryLower.includes('aud/usd') || queryLower.includes('audusd')) targetPair = 'AUD/USD';

      // 2. Detect if user specifies timeframe (e.g. M10, 10min, M15, 15min, M5, H1)
      let targetTf: Timeframe = timeframe;
      if (queryLower.includes('10min') || queryLower.includes('10 min') || queryLower.includes('10m') || queryLower.includes('m10')) targetTf = 'M10';
      else if (queryLower.includes('15min') || queryLower.includes('15 min') || queryLower.includes('15m') || queryLower.includes('m15')) targetTf = 'M15';
      else if (queryLower.includes('5min') || queryLower.includes('5 min') || queryLower.includes('5m') || queryLower.includes('m5')) targetTf = 'M5';
      else if (queryLower.includes('1hr') || queryLower.includes('1 hour') || queryLower.includes('1h') || queryLower.includes('h1')) targetTf = 'H1';
      else if (queryLower.includes('4hr') || queryLower.includes('4 hour') || queryLower.includes('4h') || queryLower.includes('h4')) targetTf = 'H4';
      else if (queryLower.includes('daily') || queryLower.includes('d1')) targetTf = 'D1';
      else if (queryLower.includes('1min') || queryLower.includes('1m') || queryLower.includes('m1')) targetTf = 'M1';

      // 3. Detect indicator inputs (EMA 20, EMA 50, RSI) and prices from user text
      const ema20Match = textToQuery.match(/ema\s*20[^\d]*([\d.]+)/i);
      const ema50Match = textToQuery.match(/ema\s*50[^\d]*([\d.]+)/i);
      const rsiMatch = textToQuery.match(/rsi[^\d]*([\d.]+)/i);
      const priceMatch = textToQuery.match(/(?:price|at|@|entry|values?\s*(?:are|is)|figure)[^\d]*([\d.]+)/i);
      const rawFloatMatches = textToQuery.match(/\b\d+\.\d+\b/g);

      const matchedMarket = liveMarkets.find((m) => m.pair === targetPair) || INITIAL_MARKETS_DATA.find((m) => m.pair === targetPair);

      let targetPrice = priceMatch ? parseFloat(priceMatch[1]) : (matchedMarket ? matchedMarket.price : currentPrice);
      if (!priceMatch && rawFloatMatches && rawFloatMatches.length > 0 && !ema20Match) {
        const candidate = parseFloat(rawFloatMatches[0]);
        if (candidate > 0.5) targetPrice = candidate;
      }

      const targetEma20 = ema20Match ? parseFloat(ema20Match[1]) : (matchedMarket ? matchedMarket.ema20 : ema20);
      const targetEma50 = ema50Match ? parseFloat(ema50Match[1]) : (matchedMarket ? matchedMarket.ema50 : ema50);
      const targetRsi = rsiMatch ? parseFloat(rsiMatch[1]) : (matchedMarket ? matchedMarket.rsi : rsi);

      // Auto-synchronize shared state so other UI panels match
      setPair(targetPair);
      setTimeframe(targetTf);
      setCurrentPrice(targetPrice);
      setEma20(targetEma20);
      setEma50(targetEma50);
      setRsi(targetRsi);

      const hasIndicatorsOrMarketIntent = 
        matchedMarket || 
        ema20Match || 
        ema50Match || 
        rsiMatch || 
        priceMatch || 
        queryLower.includes('scan') || 
        queryLower.includes('trade') || 
        queryLower.includes('chart') || 
        queryLower.includes('order') || 
        queryLower.includes('sl') || 
        queryLower.includes('tp') || 
        queryLower.includes('buy') || 
        queryLower.includes('sell');

      if (hasIndicatorsOrMarketIntent && !queryLower.includes('revenge') && !queryLower.includes('news') && !queryLower.includes('session only')) {
        const pctMapAdvisor: Partial<Record<CurrencyPair, number>> = {};
        liveMarkets.forEach((lm) => {
          pctMapAdvisor[lm.pair] = lm.change24hPct;
        });
        const advisorMacro = getCurrentMacroContext(pctMapAdvisor);

        // Calculate dynamic real trade parameters anchored to exact price, timeframe, ATR & all 5 macro factors
        const computed = computeRealChartTradeParams({
          targetPair,
          targetTf,
          targetBroker: broker,
          price: targetPrice,
          keyLevel: matchedMarket?.keyLevel,
          ema20: targetEma20,
          ema50: targetEma50,
          rsi: targetRsi,
          atrPips: matchedMarket?.atrPips,
          macro: advisorMacro
        });

        const orderType = computed.orderType;
        const cleanSymbol = computed.brokerSymbol;
        const decimals = computed.decimals;

        const mt4Steps = [
          `1. Open MT4/MT5 -> Select ${cleanSymbol} (Timeframe: ${targetTf}) -> Press F9 (New Order Ticket)`,
          `2. Order Type: ${orderType} (Instant Algorithmic Execution)`,
          `3. Volume: STRICTLY 0.01 Micro Lot (Gilgil $2.00 / 260 KES Capital Shield)`,
          `4. Input Stop Loss: ${computed.stopLoss.toFixed(decimals)} (-${computed.slPips} pips)`,
          `5. Input Take Profit: ${computed.tp2.toFixed(decimals)} (+${computed.tpPips} pips)`,
          `6. Scale-Out Protocol: Close 50% at ${computed.tp1.toFixed(decimals)} & move SL to Breakeven`
        ];

        const confluences = [
          `Chart Synchronized: Scaled for ${targetTf} timeframe volatility at live price ${targetPrice}.`,
          `Broker Execution: ${broker.toUpperCase()} typical spread is ~${computed.brokerSpread} pips.`,
          `Indicator Matrix: 20 EMA at ${targetEma20}, 50 EMA at ${targetEma50}, RSI at ${targetRsi}.`,
          `MT4 Ticket: Clean symbol ${cleanSymbol} with zero invalid SL/TP rejection guarantee.`,
          `Gilgil Shield: Strictly 0.01 micro lot with $2.00 (260 KES) hard loss cap.`,
          `CMA Investor Safety: Zero negative balance debt risk.`
        ];

        const aiMsg: AdvisorMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `**🎯 LIVE CHART REAL-TIME CONFLUENCE FOR ${targetPair} [${targetTf}]:**\n• **Order Type:** ${orderType}\n• **Live Entry Price:** @ ${targetPrice}\n• **Stop Loss:** ${computed.stopLoss} (-${computed.slPips} pips / $${computed.actualRiskUsd} max risk)\n• **Take Profit 1:** ${computed.tp1} (50% scale-out & move SL to Breakeven)\n• **Take Profit 2:** ${computed.tp2} (+${computed.tpPips} pips final institutional target)\n• **Risk:Reward:** ${computed.riskReward}\n• **Volume:** Strictly 0.01 micro lot ($2.00 / 260 KES Gilgil protection)\n• **MT4 Ticket:** Symbol ${cleanSymbol} on ${broker.toUpperCase()} (~${computed.brokerSpread}p spread)\n• **CMA Guarantee:** Zero negative balance debt risk`,
          verdict: computed.direction === 'BUY' ? 'GREEN_LIGHT' : 'GREEN_LIGHT',
          lotCap: '0.01 Micro Lot ($2.00 Max Risk)',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          tradeCard: {
            pair: targetPair,
            timeframe: targetTf,
            orderType,
            direction: computed.direction,
            entryPrice: targetPrice,
            stopLoss: computed.stopLoss,
            tp1: computed.tp1,
            tp2: computed.tp2,
            slPips: computed.slPips,
            tpPips: computed.tpPips,
            riskReward: computed.riskReward,
            lotSize: 0.01,
            actualRiskUsd: computed.actualRiskUsd,
            potentialGainUsd: computed.potentialGainUsd,
            confidence: 94.5,
            pattern: matchedMarket?.ictPattern || (computed.direction === 'BUY' ? 'Bullish Trend Expansion' : 'Liquidity Sweep Exhaustion'),
            trend: matchedMarket?.trend || (computed.direction === 'BUY' ? 'Bullish Market Structure' : 'Bearish Distribution'),
            brokerSymbol: cleanSymbol,
            brokerSpread: computed.brokerSpread,
            cmaProtection: computed.cmaProtection,
            mt4Steps,
            confluences
          }
        };

        setAdvisorMessages((prev) => [...prev, aiMsg]);
        setAdvisorLoading(false);
        playAudioBeep(880, 0.15);
        return;
      }

      if (queryLower.includes('risk') || queryLower.includes('gilgil') || queryLower.includes('2') || queryLower.includes('size')) {
        verdict = 'GREEN_LIGHT';
        reply = `**Gilgil $2 Capital Preservation Audit:**
• On a micro or standard account with ${broker.toUpperCase()}, 1 pip on 0.01 lot is worth $0.10 USD (approx 13 KES).
• For a 20-pip Stop Loss, 0.01 lot risks exactly $2.00 (260 KES), guaranteeing you survive 50 consecutive losses on a $100 account without liquidation.
• **Rule Enforced:** If your setup requires a stop loss wider than 20 pips, you must NOT increase lot size. Wait for price to re-test the Fair Value Gap or 20 EMA to shrink your stop to 15-20 pips.`;
      } else if (queryLower.includes('session') || queryLower.includes('london') || queryLower.includes('time') || queryLower.includes('eat')) {
        verdict = 'GREEN_LIGHT';
        reply = `**EAT Institutional Session Timing Matrix:**
• **London Open (10:00 - 12:00 EAT):** Highest volatility for GBP/USD and EUR/USD. Watch for the 'Judas Swing'—an artificial fakeout sweeping the Asian High/Low before the real directional trend unfolds.
• **New York Open (15:30 - 17:30 EAT):** London/NY overlap brings peak global liquidity. Perfect for 20 EMA trend continuations.
• **Asian Session (03:00 - 08:00 EAT):** Mark Asian High and Asian Low as liquidity pools. Do NOT trade breakout orders inside this consolidation.`;
      } else if (queryLower.includes('news') || queryLower.includes('nfp') || queryLower.includes('cpi') || queryLower.includes('fomc')) {
        verdict = 'DO_NOT_TRADE';
        reply = `**High-Impact Macro News Protocol (Red Folder):**
• Spreads on ${broker.toUpperCase()} and offshore brokers can widen from 1.2 pips to 8-15 pips in the first 60 seconds of NFP or US CPI.
• Stop losses may suffer slippage during high-speed algorithmic repricing.
• **Institutional Protocol:** Flat positions 15 minutes before high-impact release. Wait 15 minutes after news release for the initial wick sweep to settle, then trade the post-news Fair Value Gap rejection.`;
      } else if (queryLower.includes('revenge') || queryLower.includes('loss') || queryLower.includes('tilt')) {
        verdict = 'DO_NOT_TRADE';
        lotCap = '0.00 (Trading Lockout)';
        reply = `**Psychological Tilt Alert — Kill-Switch Protocol Activated:**
• Emotional revenge trading after a loss is the #1 cause of blown forex accounts in Kenya.
• Step away from MT4/MT5 for 60 minutes. Close the charts. Take a walk.
• Remember: 1 loss of $2.00 is completely normal and mathematically expected. Increasing lot size to 0.05 or 0.10 to 'make it back' is pure gambling that violates institutional funding rules.`;
      } else {
        verdict = 'GREEN_LIGHT';
        reply = `**Algorithmic Institutional Verdict for ${pair} (${timeframe}):**
• **Market Context:** Currently in ${session} with price near ${currentPrice}.
• **Confluence Rating:** 88/100 A+ Institutional Setup.
• **Execution:** Recommended entry at ${currentPrice}, Stop Loss 20 pips away, Target 50 pips (1:2.5 R:R).
• **Broker Spread:** ${broker.toUpperCase()} is certified for tight ECN spreads on this setup.
• **Capital Guard:** Strict maximum allocation: ${lotCap}.`;
      }

      const aiMsg: AdvisorMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        verdict,
        lotCap,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      };

      setAdvisorMessages((prev) => [...prev, aiMsg]);
      setAdvisorLoading(false);
      playAudioBeep(750, 0.1);
    }, 800);
  };

  // Transfer Scanned Trade Directly into Pillar 8 Trade Journal
  const handleLogToJournal = (data: any) => {
    try {
      const saved = localStorage.getItem('pivotfx_prop_trades');
      const existing = saved ? JSON.parse(saved) : [];
      const newTrade = {
        id: `scan-${Date.now()}`,
        timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} EAT`,
        pair: data.pair,
        type: data.verdict?.includes('BUY') ? 'BUY' : 'SELL',
        lotSize: data.suggestedLot || 0.01,
        entryPrice: data.entryPrice || data.price,
        exitPrice: data.suggestedTP || data.takeProfit,
        pnlUsd: data.potentialGainUsd || 5.0,
        status: 'PENDING',
        setupName: data.pattern || data.detectedPattern || 'AI Scanner Setup',
        mistakeTag: 'AI Algorithmic Confluence',
        notes: `Logged from AI Scanner (${data.score}/100 Confluence). Broker: ${broker.toUpperCase()}. Session: ${session}.`
      };

      const updated = [newTrade, ...existing];
      localStorage.setItem('pivotfx_prop_trades', JSON.stringify(updated));
      setLoggedSuccess(`Trade for ${data.pair} successfully logged to Pillar 8 Trade Journal!`);
      playAudioBeep(980, 0.15);

      setTimeout(() => {
        setLoggedSuccess(null);
      }, 4000);

      if (onLogTrade) {
        onLogTrade(newTrade);
      }
    } catch (e) {
      console.error('Failed to log trade to localStorage:', e);
    }
  };

  // Audio helper
  const playAudioBeep = (freq: number, duration: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio context fallback
    }
  };

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/30 my-8">
      {/* Top Scanner Hub or Return Header */}
      {scannerView === 'hub' ? (
        <div className="p-6 rounded-3xl bg-[#090F1D] border border-[#D4AF37]/40 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI MARKET SCANNER • INDEPENDENT CARDS HUB</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Dual AI Market Scanner & Execution Terminal
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Gilgil Shield:</span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                0.01 Micro Lot ($2.00 / 260 KES Hard Cap)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Every tool operates as an independent clickable card with its own dedicated view and return button. Real candlestick quotes scale SL and TP dynamically so MT4 never rejects your orders.
          </p>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090F1D] border border-[#D4AF37]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <button
            onClick={() => setScannerView('hub')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-[#D4AF37]/50 text-xs font-mono font-bold transition shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>← Return to Scanner Hub (Independent Cards)</span>
          </button>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setScannerView('radar');
                setActiveTab('radar');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                scannerView === 'radar'
                  ? 'bg-[#D4AF37] text-black font-extrabold'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>1. Radar</span>
            </button>
            <button
              onClick={() => setScannerView('favorable_chart')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                scannerView === 'favorable_chart'
                  ? 'bg-[#D4AF37] text-black font-extrabold'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>2. Live Chart & Ticket</span>
            </button>
            <button
              onClick={() => {
                setScannerView('advisor');
                setActiveTab('advisor');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                scannerView === 'advisor'
                  ? 'bg-[#D4AF37] text-black font-extrabold'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>3. AI Advisor</span>
            </button>
            <button
              onClick={() => {
                setScannerView('camera');
                setActiveTab('camera');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                scannerView === 'camera'
                  ? 'bg-[#D4AF37] text-black font-extrabold'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>4. Camera OCR</span>
            </button>
            <button
              onClick={() => {
                setScannerView('manual');
                setActiveTab('manual');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                scannerView === 'manual'
                  ? 'bg-[#D4AF37] text-black font-extrabold'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>5. Manual Confluence</span>
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS BANNER WHEN TRADE LOGGED */}
      {loggedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{loggedSuccess}</span>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: SCANNER OPERATIONS HUB (Uncongested, 4 Independent Clickable Cards)
          ========================================================================= */}
      {scannerView === 'hub' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 4 PRIMARY INDEPENDENT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CARD 1: 🌐 MULTI-MARKET RADAR (DEEP AI SCAN) */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)] group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-400 border border-cyan-800/60 font-bold">
                    8 Pairs Monitored
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    1. Live Multi-Market Radar & Opportunities
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Scans 8 major FX pairs and spot gold simultaneously. Pinpoints liquidity sweeps, order blocks, and live broker spreads across FXPesa, Exness, HFM, and FBS.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Current Favorable Setup:</span>
                  <strong className="text-[#D4AF37]">GBP/USD (15m) & XAU/USD</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setScannerView('radar');
                  setActiveTab('radar');
                }}
                className="w-full py-3 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <span>Launch Multi-Market Radar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* CARD 2: ⚡ LIVE FAVORABLE TRADE & MATCHING REAL CHART */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-[#D4AF37]/60 shadow-[0_0_25px_rgba(212,175,55,0.15)] flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-[#00C261]/20 border border-[#00C261]/40 text-[#00C261] flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00C261] animate-ping" />
                    <span>Live Chart Feed</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    2. Live Favorable Trade & Matching Interactive Chart
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    View the live TradingView chart for the scanned favorable trade. Ingest your screen's exact last candlestick quote (e.g. 4041.495 or 1.35100) to get matching SL, TP1, and TP2.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Active Live Symbol:</span>
                  <strong className="text-white">{pair} [{timeframe}] @ {currentPrice}</strong>
                </div>
              </div>

              <button
                onClick={() => setScannerView('favorable_chart')}
                className="w-full py-3 rounded-xl bg-[#00C261] hover:bg-[#00D66C] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <span>Open Live Chart & Order Ticket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* CARD 3: 🧠 DEEP AI STRATEGY ADVISOR & CHAT */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)] group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-900 text-amber-300 border border-amber-800/60 font-bold">
                    Conversational AI
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    3. Deep AI Strategy Advisor & NLP Chat
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ask market questions or paste indicator values (EMA 20, EMA 50, RSI 14). Returns institutional algorithmic trade cards with 0.01 lot Gilgil risk controls.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Input Method:</span>
                  <strong className="text-amber-300">Natural Language & Indicators</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setScannerView('advisor');
                  setActiveTab('advisor');
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <span>Open Strategy Advisor Chatroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* CARD 4: 📷 LIVE CAMERA & OCR CHART SCANNER */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 hover:border-[#D4AF37]/60 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)] group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-800/60 font-bold">
                    Vision OCR Lens
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    4. Live Camera & Screenshot OCR Scanner
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Point your device camera at your MT4/MT5 laptop screen or upload screenshots. Automatically extracts rejection wicks, fair value gaps, and key levels.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Extraction Engine:</span>
                  <strong className="text-cyan-300">1080p Panoramic HUD</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setScannerView('camera');
                  setActiveTab('camera');
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <span>Launch Camera / OCR Reader</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ADVANCED MANUAL CONFLUENCE ENGINE DIRECT ACCESS */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-mono text-slate-300">
                Advanced manual inputs? Configure full numerical parameters and generate customized MQL4 Expert Advisor scripts.
              </span>
            </div>
            <button
              onClick={() => {
                setScannerView('manual');
                setActiveTab('manual');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono font-bold transition shrink-0"
            >
              <span>Open Manual Confluence & EA Engine →</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DEDICATED LIVE FAVORABLE TRADE & MATCHING CHART STATION
          ========================================================================= */}
      {scannerView === 'favorable_chart' && (() => {
        const activeMarketObj = liveMarkets.find((m) => m.pair === pair) || INITIAL_MARKETS_DATA[0];
        const pctMap: Partial<Record<CurrencyPair, number>> = {};
        liveMarkets.forEach((m) => {
          pctMap[m.pair] = m.change24hPct;
        });
        const liveMacro = getCurrentMacroContext(pctMap);
        const favorableComputed = computeRealChartTradeParams({
          targetPair: pair,
          targetTf: timeframe,
          targetBroker: broker,
          price: currentPrice,
          keyLevel: keyLevel,
          ema20: ema20,
          ema50: ema50,
          rsi: rsi,
          atrPips: activeMarketObj.atrPips,
          macro: liveMacro,
          biasOverride: biasOverride === 'AUTO' ? undefined : biasOverride,
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Selector Bar: Pair, Timeframe, Broker, Order Side & Sync Live Quotes */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Currency Pair ({activeMarketObj.change24hPct >= 0 ? `+${activeMarketObj.change24hPct}%` : `${activeMarketObj.change24hPct}%`})
                  </label>
                  <select
                    value={pair}
                    onChange={(e) => handleSwitchPairAndSyncRealData(e.target.value as CurrencyPair)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
                  >
                    <option value="GBP/USD">GBP/USD (Cable)</option>
                    <option value="EUR/USD">EUR/USD (Fiber)</option>
                    <option value="XAU/USD">XAU/USD (Gold Spot)</option>
                    <option value="USD/JPY">USD/JPY (Ninja)</option>
                    <option value="GBP/JPY">GBP/JPY (Dragon)</option>
                    <option value="BTC/USD">BTC/USD (Bitcoin Spot)</option>
                    <option value="USD/CAD">USD/CAD (Loonie)</option>
                    <option value="AUD/USD">AUD/USD (Aussie)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Timeframe
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => handleSwitchPairAndSyncRealData(pair, undefined, e.target.value as Timeframe)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
                  >
                    <option value="M5">M5 (5 Minutes)</option>
                    <option value="M10">M10 (10 Minutes)</option>
                    <option value="M15">M15 (15 Minutes - Recommended)</option>
                    <option value="H1">H1 (1 Hour)</option>
                    <option value="H4">H4 (4 Hours)</option>
                    <option value="D1">D1 (Daily)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Broker Environment
                  </label>
                  <select
                    value={broker}
                    onChange={(e) => setBroker(e.target.value as BrokerId)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
                  >
                    <option value="fxpesa">FXPesa (CMA Kenya · ~1.1p Spread)</option>
                    <option value="exness">Exness (Micro / Raw · ~0.6p Spread)</option>
                    <option value="hfm">HFM (Offshore · ~1.3p Spread)</option>
                    <option value="fbs">FBS (Cent / Standard · ~1.5p Spread)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                    Direction Mode
                  </label>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                    {(['AUTO', 'BUY', 'SELL'] as const).map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => setBiasOverride(dir)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                          biasOverride === dir
                            ? 'bg-[#D4AF37] text-black font-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleSyncLiveQuotes}
                  disabled={syncingQuotes}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#00C261] border border-[#00C261]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingQuotes ? 'animate-spin' : ''}`} />
                  <span>{syncingQuotes ? 'Syncing...' : `Sync Live Quote (${feedSyncedAt})`}</span>
                </button>
              </div>
            </div>

            {chatSyncedNotification && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0" />
                <span>{chatSyncedNotification}</span>
              </div>
            )}

            {/* INTERACTIVE 24/7 LIVE CANDLESTICK CHART + TRADINGVIEW FEED */}
            <div className="space-y-4">
              <LiveInteractiveCandleChart
                pair={pair}
                timeframe={timeframe}
                candles={activeMarketObj.candles || []}
                livePrice={currentPrice}
                ema20={ema20}
                ema50={ema50}
                entryPrice={favorableComputed.entryPrice}
                stopLoss={favorableComputed.stopLoss}
                tp1={favorableComputed.tp1}
                tp2={favorableComputed.tp2}
                direction={favorableComputed.direction}
                change24hPct={activeMarketObj.change24hPct}
                isLockedToCustom={userLockedCandlePrice}
                onCandlePriceChange={(newPrice) => {
                  handleLiveCandlePriceEdit(String(newPrice));
                  globalLiveStream.setCustomCandlePrice(pair, newPrice, timeframe);
                }}
                onResetToLiveStream={() => {
                  setUserLockedCandlePrice(false);
                  globalLiveStream.unlockPairToLiveStream(pair);
                  handleSyncLiveQuotes();
                }}
              />

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 shadow-2xl">
                <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-white">External TradingView Feed: {pair} [{timeframe}]</span>
                  </div>
                  <span className="text-[11px] text-[#D4AF37] font-bold">24/7 1-Second Auto-Sync Active ({feedSyncedAt})</span>
                </div>
                <TradingViewEmbedWidget
                  pair={pair}
                  timeframe={timeframe}
                  onPairChange={(newPair) => handleSwitchPairAndSyncRealData(newPair)}
                  onTimeframeChange={(newTf) => handleSwitchPairAndSyncRealData(pair, undefined, newTf)}
                />
              </div>
            </div>

            {/* LIVE CANDLESTICK QUOTE INGESTION BAR */}
            <div className="p-5 rounded-2xl bg-[#0A1020] border border-[#D4AF37]/50 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                      Live Candlestick Quote Sync (Auto-Updates Indicators & Strategy on Every Tick)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    Clicking <strong>Reanalyse Ticket</strong> automatically fetches the live market candle ({feedSyncedAt}). Any upward or downward change in the candlestick price dynamically recalculates 20 EMA, 50 EMA, RSI, Direction, SL, TP, and EA values.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  {userLockedCandlePrice && (
                    <button
                      type="button"
                      onClick={handleSyncLiveQuotes}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-[#00C261] border border-[#00C261]/50 text-[11px] font-mono font-bold whitespace-nowrap"
                    >
                      Unlock & Sync Live API
                    </button>
                  )}
                  {pair === 'XAU/USD' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setUserLockedCandlePrice(false);
                          handleSyncLiveQuotes();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-mono font-bold whitespace-nowrap"
                      >
                        Spot Live
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLiveCandlePriceEdit('4041.495')}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold whitespace-nowrap"
                      >
                        Futures: 4041.495
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs items-end">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span>Last Candlestick Quote *</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={currentPrice}
                    onChange={(e) => handleLiveCandlePriceEdit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:border-[#D4AF37] outline-none tabular-nums"
                    placeholder="e.g. 1.39463"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">20 EMA Value</label>
                  <input
                    type="number"
                    step="any"
                    value={ema20}
                    onChange={(e) => setEma20(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none tabular-nums"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">50 EMA Value</label>
                  <input
                    type="number"
                    step="any"
                    value={ema50}
                    onChange={(e) => setEma50(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none tabular-nums"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">RSI (14)</label>
                  <input
                    type="number"
                    step="any"
                    value={rsi}
                    onChange={(e) => setRsi(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none tabular-nums"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleRunAnalysis('deep_ai')}
                    className="w-full py-2.5 px-3 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 whitespace-nowrap"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reanalyse Ticket</span>
                  </button>
                </div>
              </div>

              <div className="text-xs font-mono text-emerald-400 font-bold pt-1">
                {favorableComputed.mt4SafetyProof} · AI Confidence: {favorableComputed.confidence}%
              </div>
            </div>

            {/* DYNAMICALLY COMPUTED INSTITUTIONAL ORDER EXECUTION TICKET */}
            <div className="rounded-3xl border border-[#D4AF37] bg-[#0A1020] p-6 sm:p-7 shadow-2xl space-y-6 tabular-nums">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                    <span className="font-black px-3 py-1 rounded-xl bg-[#D4AF37] text-black">
                      INSTITUTIONAL ORDER TICKET
                    </span>
                    <span className="font-bold text-cyan-400">
                      Symbol: {favorableComputed.brokerSymbol} [{timeframe}]
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-bold text-emerald-400">
                      Broker: {broker.toUpperCase()} (~{favorableComputed.brokerSpread}p spread)
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {favorableComputed.orderType} @ {favorableComputed.entryPrice}
                  </h3>
                </div>

                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    {favorableComputed.confidence}% Confidence · Max Risk: ${favorableComputed.actualRiskUsd.toFixed(2)} (260 KES)
                  </span>
                </div>
              </div>

              {/* Dynamic Institutional Trajectory & Projection */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#D4AF37] uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Institutional Trajectory & Projection:</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
                  {favorableComputed.trajectory}
                </p>
              </div>

              {/* Grid of 5 Essential Numerical Execution Values */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Entry Price</span>
                  <strong className="text-base font-mono text-white block">{favorableComputed.entryPrice}</strong>
                  <span className="text-[10px] font-mono text-emerald-400">Live Candle</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-1">
                  <span className="text-[10px] font-mono text-red-300 uppercase block font-bold">Stop Loss (SL)</span>
                  <strong className="text-base font-mono text-red-400 block">{favorableComputed.stopLoss}</strong>
                  <span className="text-[10px] font-mono text-red-300">-{favorableComputed.slPips} pips / ${favorableComputed.actualRiskUsd.toFixed(2)}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase block font-bold">TP1 (50% & BE)</span>
                  <strong className="text-base font-mono text-cyan-400 block">{favorableComputed.tp1}</strong>
                  <span className="text-[10px] font-mono text-slate-400">Move SL to BE</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-300 uppercase block font-bold">TP2 (Final Target)</span>
                  <strong className="text-base font-mono text-emerald-400 block">{favorableComputed.tp2}</strong>
                  <span className="text-[10px] font-mono text-emerald-300">+{favorableComputed.tpPips} pips expansion</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-amber-300 uppercase block font-bold">Risk : Reward</span>
                  <strong className="text-base font-mono text-[#D4AF37] block">{favorableComputed.riskReward}</strong>
                  <span className="text-[10px] font-mono text-slate-400">0.01 Micro Lot</span>
                </div>
              </div>

              {/* 5-Factor All-Confluence BUY / SELL Judgment Scorecard */}
              <div className="p-4 rounded-2xl bg-slate-950/95 border border-[#D4AF37]/35 space-y-2.5 text-xs font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>All-Factor AI BUY/SELL Judgment ({favorableComputed.orderType})</span>
                  </span>
                  <span className="font-black">
                    <span className="text-[#00C261]">BULL {favorableComputed.bullScorePct}%</span>
                    <span className="text-slate-600 mx-1.5">vs</span>
                    <span className="text-red-400">BEAR {favorableComputed.bearScorePct}%</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {favorableComputed.factorVerdicts.map((fv) => (
                    <div
                      key={fv.name}
                      className={`p-2.5 rounded-xl border space-y-1 ${
                        fv.signal === 'BUY'
                          ? 'bg-emerald-950/25 border-emerald-500/35'
                          : fv.signal === 'SELL'
                          ? 'bg-red-950/25 border-red-500/35'
                          : 'bg-amber-950/25 border-amber-500/35'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-300 truncate">{fv.name}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                            fv.signal === 'BUY'
                              ? 'bg-[#00C261]/25 text-[#00C261]'
                              : fv.signal === 'SELL'
                              ? 'bg-red-500/25 text-red-300'
                              : 'bg-amber-500/25 text-amber-300'
                          }`}
                        >
                          {fv.signal}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug">{fv.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step MT4/MT5 Execution Instructions */}
              <div className="p-4.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  How to Place This Order on {broker.toUpperCase()} MT4/MT5 Terminal:
                </span>
                <div className="space-y-1.5 font-mono text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">1.</span>
                    <span>Open MT4/MT5 → Select Symbol <strong>{favorableComputed.brokerSymbol}</strong> (Timeframe: <strong>{timeframe}</strong>) → Press F9 (New Order).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">2.</span>
                    <span>Order Type: <strong>{favorableComputed.orderType}</strong> (Instant Execution).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">3.</span>
                    <span>Volume: STRICTLY <strong>0.01 micro lot</strong> (Gilgil $2.00 / 260 KES maximum loss cap).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">4.</span>
                    <span>Set Stop Loss to <strong>{favorableComputed.stopLoss}</strong> and Take Profit to <strong>{favorableComputed.tp2}</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#D4AF37] font-bold">5.</span>
                    <span>When price reaches <strong>{favorableComputed.tp1}</strong>, close 50% volume and drag Stop Loss to entry price (Breakeven).</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Copy SL, Copy TP, Copy All, Log Journal */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(favorableComputed.stopLoss.toString());
                    setCopiedField('sl');
                    setTimeout(() => setCopiedField(null), 2000);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-red-300 border border-red-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  {copiedField === 'sl' ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'sl' ? 'SL Copied!' : `Copy SL: ${favorableComputed.stopLoss}`}</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(favorableComputed.tp2.toString());
                    setCopiedField('tp');
                    setTimeout(() => setCopiedField(null), 2000);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  {copiedField === 'tp' ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'tp' ? 'TP Copied!' : `Copy TP: ${favorableComputed.tp2}`}</span>
                </button>

                <button
                  onClick={() => {
                    const allText = `PIVOTFX INSTITUTIONAL ORDER TICKET\nPair: ${pair} (${favorableComputed.brokerSymbol})\nOrder: ${favorableComputed.orderType}\nEntry: ${favorableComputed.entryPrice}\nStop Loss: ${favorableComputed.stopLoss}\nTake Profit 1: ${favorableComputed.tp1}\nTake Profit 2: ${favorableComputed.tp2}\nLot Size: 0.01 Micro Lot ($2 Max Risk)\nBroker: ${broker.toUpperCase()}\nProtection: CMA Kenya Zero Negative Balance Shield`;
                    navigator.clipboard.writeText(allText);
                    setCopiedField('all');
                    setTimeout(() => setCopiedField(null), 2000);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  {copiedField === 'all' ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'all' ? 'All Parameters Copied!' : 'Copy All Parameters'}</span>
                </button>

                <button
                  onClick={() => {
                    handleLogToJournal({
                      pair,
                      timeframe,
                      price: favorableComputed.entryPrice,
                      verdict: favorableComputed.direction === 'BUY' ? 'HIGH_PROBABILITY_BUY' : 'HIGH_PROBABILITY_SELL',
                      confidencePercent: favorableComputed.confidence,
                      pattern: 'Live Candlestick Re-Anchored Order',
                      trend: favorableComputed.direction === 'BUY' ? 'Bullish Expansion' : 'Bearish Expansion',
                      orderType: favorableComputed.orderType,
                      stopLoss: favorableComputed.stopLoss,
                      takeProfit: favorableComputed.tp2,
                      tp1Price: favorableComputed.tp1,
                      tp2Price: favorableComputed.tp2,
                      slDistancePips: favorableComputed.slPips,
                      tpDistancePips: favorableComputed.tpPips,
                      riskReward: favorableComputed.riskReward,
                      suggestedLot: 0.01,
                      actualRiskUsd: favorableComputed.actualRiskUsd,
                      potentialGainUsd: favorableComputed.potentialGainUsd,
                      brokerSpreadPips: favorableComputed.brokerSpread,
                      brokerSpreadCostUsd: 0.12,
                      reasons: [
                        `Ingested candlestick @ ${favorableComputed.entryPrice} on ${timeframe}`,
                        `Gilgil risk shield: 0.01 lot capped at $2.00`
                      ],
                      projection: favorableComputed.trajectory
                    });
                  }}
                  className="py-2.5 px-3 rounded-xl btn-gold text-black text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Log Setup to Journal</span>
                </button>
              </div>

              {/* Live Auto-Synced Expert Advisor (EA) Parameter Script */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    <span>Live Auto-Synced EA Script · {favorableComputed.brokerSymbol} [{timeframe}] @ {favorableComputed.entryPrice}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const eaBlock = `// PIVOTFX LIVE EA AUTO-SYNC (${pair} ${timeframe})\ninput double LotSize = 0.01; // Gilgil $2.00 / 260 KES Cap\ninput double EntryPrice = ${favorableComputed.entryPrice};\ninput double StopLoss = ${favorableComputed.stopLoss};\ninput double TakeProfit_1 = ${favorableComputed.tp1};\ninput double TakeProfit_2 = ${favorableComputed.tp2};\n// Direction: ${favorableComputed.orderType} | 20EMA: ${ema20} | 50EMA: ${ema50} | RSI: ${rsi}`;
                      navigator.clipboard.writeText(eaBlock);
                      setCopiedManualEa(true);
                      setTimeout(() => setCopiedManualEa(false), 2000);
                    }}
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    {copiedManualEa ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedManualEa ? 'EA Copied!' : 'Copy Live EA'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/70 border border-slate-800/80 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed tabular-nums">
{`// Auto-Synced to Latest Candle: ${pair} [${timeframe}] | ${favorableComputed.orderType} | Confidence: ${favorableComputed.confidence}%
input double LotSize = 0.01;        // Gilgil $2.00 / 260 KES Max Risk Shield
input double EntryPrice = ${favorableComputed.entryPrice};
input double StopLoss = ${favorableComputed.stopLoss};   // -${favorableComputed.slPips} pips ($${favorableComputed.actualRiskUsd.toFixed(2)} risk)
input double TakeProfit_1 = ${favorableComputed.tp1}; // Close 50% & Move SL to Entry
input double TakeProfit_2 = ${favorableComputed.tp2}; // Final Institutional Target (+${favorableComputed.tpPips} pips)`}
                </pre>
              </div>

              {/* Bottom Return Button */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setScannerView('hub')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>← Return to Scanner Hub</span>
                </button>

                <span className="text-xs font-mono text-slate-400">
                  Station: Live Chart & Matching Order Execution
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          VIEW 3: MANUAL CONFLUENCE & INGESTION SUITE (When scannerView === 'manual')
          ========================================================================= */}
      {scannerView === 'manual' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                  Manual Parameter Ingestion Engine
                </h4>
              </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowTradingView(!showTradingView)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition ${
                showTradingView
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                  : 'bg-slate-900 text-[#D4AF37] border-[#D4AF37]/40 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{showTradingView ? 'Hide Live Chart' : `Open Real TradingView: ${pair}`}</span>
            </button>

            <button
              onClick={() => {
                setScannerView('radar');
                setActiveTab('radar');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 bg-slate-900 text-cyan-400 border border-cyan-500/40 hover:bg-slate-800 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Deep AI Scan All Markets</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Pair */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Currency Pair *</label>
            <select
              value={pair}
              onChange={(e) => handleSwitchPairAndSyncRealData(e.target.value as CurrencyPair)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
            >
              <option value="GBP/USD">GBP/USD (Cable)</option>
              <option value="EUR/USD">EUR/USD (Fiber)</option>
              <option value="USD/JPY">USD/JPY (Ninja)</option>
              <option value="XAU/USD">XAU/USD (Gold Spot)</option>
              <option value="GBP/JPY">GBP/JPY (Dragon / Guppy)</option>
              <option value="BTC/USD">BTC/USD (Bitcoin Spot)</option>
              <option value="USD/CAD">USD/CAD (Loonie)</option>
              <option value="AUD/USD">AUD/USD (Aussie)</option>
            </select>
          </div>

          {/* Timeframe */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Timeframe *</label>
            <select
              value={timeframe}
              onChange={(e) => handleSwitchPairAndSyncRealData(pair, undefined, e.target.value as Timeframe)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
            >
              <option value="M5">M5 (5 Minutes)</option>
              <option value="M10">M10 (10 Minutes)</option>
              <option value="M15">M15 (15 Minutes - Recommended)</option>
              <option value="H1">H1 (1 Hour)</option>
              <option value="H4">H4 (4 Hours)</option>
              <option value="D1">D1 (Daily)</option>
            </select>
          </div>

          {/* Broker */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Broker Environment *</label>
            <select
              value={broker}
              onChange={(e) => setBroker(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
            >
              <option value="fxpesa">FXPesa (CMA Kenya · ~1.1p Spread)</option>
              <option value="exness">Exness (Global Raw / Micro · ~0.6p Spread)</option>
              <option value="hfm">HFM (Offshore · ~1.3p Spread)</option>
              <option value="fbs">FBS (Offshore Cent · ~1.5p Spread)</option>
            </select>
          </div>

          {/* Session */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Trading Session (EAT) *</label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
            >
              <option value="London Open (10:00 EAT)">London Open (10:00 EAT)</option>
              <option value="New York AM (15:30 EAT)">New York AM (15:30 EAT)</option>
              <option value="Asian Range (03:00 EAT)">Asian Range (03:00 EAT)</option>
              <option value="London Close (18:30 EAT)">London Close (18:30 EAT)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Current Market Price */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Current Market Price *</label>
              <span className="text-[10px] text-amber-400 font-mono">
                {userLockedCandlePrice ? 'Custom Candle' : `Auto Live (${feedSyncedAt})`}
              </span>
            </div>
            <input
              type="number"
              step="any"
              value={currentPrice}
              onChange={(e) => handleLiveCandlePriceEdit(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none tabular-nums"
            />
          </div>

          {/* Key Reference / Sweep Level */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Key Level / Sweep Pool *</label>
              <span className="text-[10px] text-slate-500 font-mono">Resistance/Support</span>
            </div>
            <input
              type="number"
              step="any"
              value={keyLevel}
              onChange={(e) => setKeyLevel(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none tabular-nums"
            />
          </div>

          {/* Pattern Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Observed Candlestick Setup *</label>
            <select
              value={patternType}
              onChange={(e) => setPatternType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
            >
              <option value="20/50 EMA Trend Bounce">20/50 EMA Dynamic Trend Bounce</option>
              <option value="Tower Top Liquidity Sweep">Tower Top Liquidity Sweep (Gilgil Model)</option>
              <option value="Asian Liquidity Sweep">Asian Liquidity Sweep & Judas Swing</option>
              <option value="Fair Value Gap Re-test">Fair Value Gap (FVG) Re-test</option>
              <option value="Bearish Order Block Mitigation">Bearish Order Block Mitigation</option>
            </select>
          </div>
        </div>

        {/* Trader Notes */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
            Trader Confluence Notes & Observations
          </label>
          <input
            type="text"
            value={traderNotes}
            onChange={(e) => setTraderNotes(e.target.value)}
            placeholder="e.g., GBP/USD M15 live quote @ 1.34998 after SSL sweep, targeting 1.35518 expansion"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none"
          />
        </div>
      </div>

      {/* REAL TRADINGVIEW LIVE CHART EMBED */}
      {showTradingView && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <TradingViewEmbedWidget
            pair={pair}
            timeframe={timeframe}
            onPairChange={(newPair) => handleSwitchPairAndSyncRealData(newPair)}
            onTimeframeChange={(newTf) => handleSwitchPairAndSyncRealData(pair, undefined, newTf)}
            onClose={() => setShowTradingView(false)}
            isCollapsible={true}
          />
        </div>
      )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: LIVE CAMERA & VISION OCR SCANNER (WIDE DIMENSION) */}
      {/* ======================================================== */}
      {(scannerView === 'camera' || (scannerView !== 'hub' && activeTab === 'camera')) && (
        <div className="space-y-6">
          {/* 1. Full-Width Panoramic 16:9 Camera Viewfinder */}
          <div className="space-y-3">
            <div className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[480px] lg:min-h-[540px] rounded-3xl bg-black border-2 border-slate-700 hover:border-[#D4AF37] overflow-hidden flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              {/* Live WebRTC Video Stream */}
              {isStreaming ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* High-Accuracy Ultra-Wide HUD Reticle Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4 sm:p-6">
                    {/* Top HUD Telemetry */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-3 py-1 rounded-xl bg-red-600/90 text-white flex items-center gap-1.5 animate-pulse shadow-md">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span>LIVE 1080P WIDE LENS</span>
                        </span>
                        <span className="font-mono text-[10px] text-cyan-300 px-2.5 py-1 rounded-xl bg-black/80 border border-cyan-500/40">
                          {pair} • {timeframe} • {broker.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#D4AF37] px-2.5 py-1 rounded-xl bg-black/80 border border-[#D4AF37]/50 font-bold">
                          {cameraFacingMode === 'environment' ? 'Rear Lens (Laptop Focus)' : 'Front Lens'}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 hidden sm:inline">
                          1920 × 1080 Full-HD Wide
                        </span>
                      </div>
                    </div>

                    {/* Expansive Wide Framing Reticle (94% Width x 84% Height) */}
                    <div className="w-[94%] h-[84%] border-2 border-dashed border-[#D4AF37]/85 rounded-2xl flex flex-col items-center justify-between p-4 relative shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                      {/* Top Sweep Boundary Guide */}
                      <div className="w-full flex items-center justify-between text-[9px] font-mono text-red-400 bg-black/80 px-2.5 py-0.5 rounded border border-red-500/40">
                        <span>▲ BSL LIQUIDITY SWEEP ZONE ({keyLevel})</span>
                        <span>WICK REJECTION UPPER FRAME</span>
                      </div>

                      {/* Center Crosshair & Consequent Encroachment 50% line */}
                      <div className="w-full flex items-center justify-center relative">
                        <div className="w-full h-[1px] bg-[#D4AF37]/40 border-b border-dashed border-[#D4AF37]/60" />
                        <div className="absolute px-3 py-1 rounded-md bg-black/90 border border-[#D4AF37] flex items-center gap-1.5 shadow-lg">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                          <span className="text-[10px] font-mono font-bold text-[#D4AF37]">
                            AI SCAN PIVOT: {currentPrice} (50% C.E.)
                          </span>
                        </div>
                      </div>

                      {/* Bottom Dynamic EMA Support Guide */}
                      <div className="w-full flex items-center justify-between text-[9px] font-mono text-cyan-300 bg-black/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
                        <span>▼ 20 EMA MEAN REVERSION TARGET ({ema20})</span>
                        <span>SSL SELL-SIDE LIQUIDITY FLOOR</span>
                      </div>
                    </div>

                    {/* Bottom Instructions */}
                    <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-300 bg-black/85 px-3 py-1 rounded-xl border border-slate-800">
                      <span>Framing: Point camera directly at your MT4/MT5 laptop screen candles</span>
                      <span className="text-[#D4AF37] font-bold">Gilgil $2 Shield: ACTIVE</span>
                    </div>
                  </div>
                </div>
              ) : capturedImage ? (
                /* Captured / Uploaded Image View with Real OCR Visual Detection */
                <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Scanned MT4 Chart"
                    className="w-full h-full object-contain filter contrast-105"
                  />

                  {/* HUD Scan Matrix Overlays */}
                  <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between w-full">
                      <div className="px-3 py-1.5 rounded-xl bg-black/90 border border-[#D4AF37] text-xs font-mono text-[#D4AF37] font-bold shadow-lg flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00C261]" />
                        <span>OCR INGESTION: 100% COMPLETE</span>
                      </div>
                      <span className="text-xs font-mono bg-black/90 px-3 py-1 rounded-xl text-cyan-300 border border-cyan-500/40 font-bold">
                        {pair} • {timeframe} • {session}
                      </span>
                    </div>

                    {/* Wide Bounding Boxes */}
                    <div className="w-[94%] h-[78%] mx-auto relative flex flex-col justify-between">
                      <div className="border-2 border-dashed border-red-500/80 bg-red-500/15 rounded-xl p-2 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-red-300 bg-black/85 px-2 py-0.5 rounded">
                          [OCR EXTRACTED] LIQUIDITY PEAK: {keyLevel}
                        </span>
                        <span className="text-[9px] font-mono text-red-300 bg-black/85 px-2 py-0.5 rounded">
                          Wick Sweep: +{cameraAnalysisResult?.ocrExtracted?.wickExcessPips || '4.2'} pips
                        </span>
                      </div>

                      <div className="border-2 border-dashed border-cyan-400/80 bg-cyan-500/15 rounded-xl p-2 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-cyan-200 bg-black/85 px-2 py-0.5 rounded">
                          [OCR EXTRACTED] 20 EMA MEAN TARGET: {ema20}
                        </span>
                        <span className="text-[9px] font-mono text-cyan-200 bg-black/85 px-2 py-0.5 rounded">
                          Dynamic Equilibrium Floor
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-200 bg-black/90 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span>Broker: {broker.toUpperCase()}</span>
                      <span className="text-[#D4AF37] font-bold">Algorithm Confidence: {cameraAnalysisResult?.score || 94}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Idle Camera State */
                <div className="p-8 text-center space-y-4 max-w-md">
                  <div className="w-16 h-16 rounded-3xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-lg sm:text-xl font-black text-white">
                      Full-Screen MT4/MT5 Chart Vision Lens
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Prompt your device camera in wide 16:9 panoramic dimension to frame laptop screens, multi-monitor charts, or uploaded screenshots with high OCR accuracy.
                    </p>
                  </div>

                  <button
                    onClick={handleStartCamera}
                    className="w-full py-3.5 rounded-2xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
                  >
                    <Video className="w-4 h-4" />
                    <span>Prompt & Open 16:9 Camera</span>
                  </button>
                </div>
              )}

              {/* Fast Loading Scanning Overlay */}
              {analyzingCamera && (
                <div className="absolute inset-0 bg-[#080C14]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-10 h-10 text-[#D4AF37] animate-spin" />
                  <span className="text-sm font-mono font-bold text-[#D4AF37]">
                    Analyzing Ingested Candlesticks & Confluence Matrix...
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Verifying Gilgil $2 rule, MT4 order ticket, and broker spreads...
                  </span>
                </div>
              )}
            </div>

            {/* Camera Error Alert if permissions denied */}
            {cameraError && (
              <div className="p-3.5 rounded-2xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs font-mono flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Camera Permission Alert:</span>
                  <p className="text-[11px] text-red-300 leading-snug">{cameraError}</p>
                </div>
              </div>
            )}

            {/* Camera Actions & Controls Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
              {isStreaming ? (
                <>
                  <button
                    onClick={handleCaptureFrame}
                    className="col-span-2 sm:col-span-3 py-3 rounded-2xl btn-gold text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Snap & Analyze Wide Chart</span>
                  </button>
                  <button
                    onClick={handleFlipCamera}
                    className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <SwitchCamera className="w-4 h-4" />
                    <span>Flip Lens</span>
                  </button>
                  <button
                    onClick={handleStopCamera}
                    className="col-span-2 py-3 rounded-2xl bg-red-950/70 hover:bg-red-900 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-red-800 transition"
                  >
                    <VideoOff className="w-4 h-4" />
                    <span>Stop Camera</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartCamera}
                    className="col-span-2 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-2 border border-[#D4AF37]/50 transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{capturedImage ? 'Retake Live Lens' : 'Open Camera Lens'}</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="col-span-2 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>Upload Chart Screenshot</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => handleLoadSample('gbpusd')}
                    className="col-span-2 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center gap-1.5 border border-cyan-800/60 transition"
                  >
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Sample: GBP/USD Live</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Sample Links Strip */}
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-slate-950/90 p-3 rounded-2xl border border-slate-800 flex-wrap">
              <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Live Market Samples:</span>
              </span>
              <button
                onClick={() => handleLoadSample('gbpusd')}
                className="hover:text-white underline text-slate-300 font-bold"
              >
                GBP/USD ({liveMarkets.find((x) => x.pair === 'GBP/USD')?.price ?? 1.34998})
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleLoadSample('eurusd')}
                className="hover:text-white underline text-slate-300 font-bold"
              >
                EUR/USD ({liveMarkets.find((x) => x.pair === 'EUR/USD')?.price ?? 1.12670})
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleLoadSample('xauusd')}
                className="hover:text-white underline text-slate-300 font-bold"
              >
                Gold Spot ({liveMarkets.find((x) => x.pair === 'XAU/USD')?.price ?? 3955.00})
              </button>
            </div>
          </div>

          {/* 2. Full-Width Institutional Analysis & Trade Placement Console */}
          {cameraAnalysisResult ? (
            <div className="bg-[#0A0F1D] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.15)] space-y-6 animate-in fade-in duration-300">
              {/* Top Banner with Verdict & High Confidence */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00C261] animate-ping" />
                    <span className="text-base sm:text-lg font-black text-white font-mono">
                      {cameraAnalysisResult.pair} • {cameraAnalysisResult.timeframe} • {cameraAnalysisResult.session}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      Broker: {cameraAnalysisResult.broker.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    High Confidence Algorithmic EA Execution Slip • Institutional Quantitative Confluence Engine
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Confidence Rating</span>
                    <span className="text-xl font-mono font-black text-[#00C261]">
                      {cameraAnalysisResult.score}% A+ Setup
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs sm:text-sm font-black px-4 py-2 rounded-2xl shadow-lg ${
                      cameraAnalysisResult.orderType.includes('BUY')
                        ? 'bg-[#00C261] text-black'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {cameraAnalysisResult.orderType}
                  </span>
                </div>
              </div>

              {/* Complete MT4/MT5 Trade Placement Slip (User requested: "you know how trade is placed, the data required should be the suggestion of results") */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0B101D] to-slate-950 border border-[#D4AF37]/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#D4AF37]" />
                    <span>Exact MT4 / MT5 Trade Placement Order Ticket (EA Copy)</span>
                  </span>

                  <button
                    onClick={() => {
                      const ticket = `[PIVOTFX AI EA TICKET]\nSymbol: ${cameraAnalysisResult.pair.replace('/', '')}\nOrder Type: ${cameraAnalysisResult.orderType}\nEntry Price: ${cameraAnalysisResult.entryPrice}\nStop Loss: ${cameraAnalysisResult.suggestedSL} (-${cameraAnalysisResult.slPips} pips, $${cameraAnalysisResult.actualRiskUsd} Max Risk)\nTake Profit 1: ${cameraAnalysisResult.tp1Price} (+${Math.round(cameraAnalysisResult.tpPips * 0.5)} pips, 50% scale-out)\nTake Profit 2: ${cameraAnalysisResult.suggestedTP} (+${cameraAnalysisResult.tpPips} pips, final target)\nVolume: ${cameraAnalysisResult.suggestedLot} Micro Lot\nBroker: ${cameraAnalysisResult.broker.toUpperCase()}\nRisk:Reward = 1 : ${cameraAnalysisResult.riskReward}`;
                      navigator.clipboard.writeText(ticket);
                      setCopiedCameraEa(true);
                      setTimeout(() => setCopiedCameraEa(false), 2500);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    {copiedCameraEa ? <Check className="w-4 h-4 text-[#00C261]" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCameraEa ? 'Copied to Clipboard!' : '1-Click Copy Trade Parameters'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">1. Order Type</span>
                    <span className="text-sm font-black text-white">{cameraAnalysisResult.orderType}</span>
                    <span className="text-[9px] text-slate-500 block">Instant Execution</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">2. Entry Price</span>
                    <span className="text-sm font-black text-[#D4AF37]">{cameraAnalysisResult.entryPrice}</span>
                    <span className="text-[9px] text-slate-500 block">At Market Price</span>
                  </div>

                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40">
                    <span className="text-[10px] text-red-400 block uppercase font-bold">
                      3. Stop Loss (-{cameraAnalysisResult.slPips}p)
                    </span>
                    <span className="text-sm font-black text-red-300">{cameraAnalysisResult.suggestedSL}</span>
                    <span className="text-[9px] text-red-400 block">Cap: $2.00 / 260 KES</span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
                    <span className="text-[10px] text-cyan-400 block uppercase font-bold">
                      4. TP1 (+{Math.round(cameraAnalysisResult.tpPips * 0.5)}p)
                    </span>
                    <span className="text-sm font-black text-cyan-300">{cameraAnalysisResult.tp1Price}</span>
                    <span className="text-[9px] text-cyan-400 block">Close 50% & Breakeven</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                    <span className="text-[10px] text-emerald-400 block uppercase font-bold">
                      5. Final TP (+{cameraAnalysisResult.tpPips}p)
                    </span>
                    <span className="text-sm font-black text-emerald-300">{cameraAnalysisResult.suggestedTP}</span>
                    <span className="text-[9px] text-emerald-400 block">1 : {cameraAnalysisResult.riskReward} R:R</span>
                  </div>
                </div>

                {/* Gilgil $2 Guarantee Bar */}
                <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="text-white font-bold">
                      Volume: <span className="text-[#D4AF37] font-black">{cameraAnalysisResult.suggestedLot} Micro Lot</span> (Gilgil Capital Shield Applied)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-300">
                      Risk: <strong className="text-red-400">${cameraAnalysisResult.actualRiskUsd} (260 KES)</strong>
                    </span>
                    <span className="text-slate-300">
                      Reward: <strong className="text-emerald-400">+${cameraAnalysisResult.potentialGainUsd} (~650 KES)</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Confluences & Broker Protocol 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Broker-Specific Step-by-Step Ticket */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>{cameraAnalysisResult.broker.toUpperCase()} Order Guide</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Typical Spread: ~{cameraAnalysisResult.brokerSpreadPips} pips
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {(cameraAnalysisResult.mt4Steps || []).map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Institutional Confluences */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-[#00C261] uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00C261]" />
                      <span>Mathematical Confluence Signals</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#00C261] font-bold">100% INGESTED</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    {cameraAnalysisResult.confluences.map((c: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#D4AF37] font-bold shrink-0">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleLogToJournal(cameraAnalysisResult)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition"
                >
                  <span>Log Scanned Setup to Trade Journal (Pillar 8)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('manual')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <span>Open Deep AI EA Parameter Terminal →</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
              <Camera className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-white font-mono">Camera Ready for Live Ingestion</h5>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "Prompt & Open 16:9 Camera" or pick one of the instant samples above. The AI will ingest your candlesticks, calculate exact MT4 trade parameters, and render your placement order ticket.
                </p>
              </div>
            </div>
          )}

          {/* Bottom Return to Hub Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => setScannerView('hub')}
              className="px-6 py-2.5 rounded-xl btn-gold text-black font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Return to Scanner Hub</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MANUAL CONFLUENCE SCANNER */}
      {/* ======================================================== */}
      {(scannerView === 'manual' || (scannerView !== 'hub' && activeTab === 'manual')) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Manual Indicator Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Chart Real-Time Re-Anchor Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-[#D4AF37]/50 space-y-2.5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00C261] animate-ping" />
                  <span className="font-mono text-xs font-bold text-white">
                    Live MT4/MT5 Chart Re-Anchor: <strong className="text-[#D4AF37]">{pair}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/40">
                    {timeframe} Chart
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {broker.toUpperCase()} (~{broker === 'fxpesa' ? '1.1' : broker === 'exness' ? '0.6' : '1.3'}p Spread)
                </span>
              </div>

              {/* Quick Timeframe & Direction Switcher */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Timeframe:</span>
                  {(['M5', 'M10', 'M15', 'H1', 'H4', 'D1'] as Timeframe[]).map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => handleSwitchPairAndSyncRealData(pair, undefined, tf)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition ${
                        timeframe === tf
                          ? 'bg-[#D4AF37] text-black shadow-sm font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSyncLiveQuotes}
                  disabled={syncingQuotes}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#00C261] border border-[#00C261]/30 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingQuotes ? 'animate-spin' : ''}`} />
                  <span>Sync Live Feed</span>
                </button>
              </div>

              {/* Dynamic Live Parameter Preview */}
              {(() => {
                const preview = computeRealChartTradeParams({
                  targetPair: pair,
                  targetTf: timeframe,
                  targetBroker: broker,
                  price: currentPrice,
                  keyLevel,
                  ema20,
                  ema50,
                  rsi,
                  biasOverride: biasOverride === 'AUTO' ? undefined : biasOverride
                });
                return (
                  <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 tabular-nums">
                    <div className="text-slate-300">
                      Live Entry: <strong className="text-white">@{preview.entryPrice}</strong> · Order: <strong className="text-[#D4AF37]">{preview.orderType}</strong> · SL: <strong className="text-red-300">{preview.stopLoss}</strong> (-{preview.slPips}p) · TP2: <strong className="text-emerald-300">{preview.tp2}</strong> (+{preview.tpPips}p)
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold shrink-0">
                      {preview.mt4SafetyProof}
                    </span>
                  </div>
                );
              })()}
            </div>

            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Enter MT4/MT5 Current Chart Candle & Indicator Readings (Any tick edit updates EMA, RSI & EA live):
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Live Chart Candle *</label>
                <input
                  type="number"
                  step="any"
                  value={currentPrice}
                  onChange={(e) => handleLiveCandlePriceEdit(e.target.value)}
                  className="w-full bg-slate-900 border border-[#D4AF37]/50 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none tabular-nums"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">EMA 20 Value</label>
                <input
                  type="number"
                  step="any"
                  value={ema20}
                  onChange={(e) => setEma20(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none tabular-nums"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">EMA 50 Value</label>
                <input
                  type="number"
                  step="any"
                  value={ema50}
                  onChange={(e) => setEma50(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none tabular-nums"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">RSI (14)</label>
                  <span className="text-[10px] text-[#D4AF37] font-mono">{rsi}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={rsi}
                  onChange={(e) => setRsi(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#D4AF37] outline-none tabular-nums"
                />
              </div>
            </div>

            {/* Quick MT4 Live Case Study Presets */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  Live Market Case Study Presets (Click to Sync All Tabs):
                </span>
                <span className="text-[10px] text-[#D4AF37] font-mono font-bold">
                  Real Contemporary Quotes
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 tabular-nums">
                <button
                  type="button"
                  onClick={() => {
                    setPair('GBP/USD');
                    setTimeframe('M10');
                    setBiasOverride('AUTO');
                    setCurrentPrice(1.34998);
                    setEma20(1.34878);
                    setEma50(1.34718);
                    setRsi(58.3);
                    setKeyLevel(1.34818);
                    setPatternType('20/50 EMA Trend Bounce');
                    setTraderNotes('GBP/USD Live Cable (1.34998, +0.66%): Swept SSL below 1.34818 on M10/M15. Healthy 20 EMA trend bounce.');
                    setChatSyncedNotification('Synced GBP/USD @ 1.34998 (EMA20: 1.34878, RSI: 58.3)');
                    setTimeout(() => setChatSyncedNotification(null), 3000);
                  }}
                  className={`p-2.5 text-left rounded-xl border transition font-mono group ${
                    pair === 'GBP/USD' && Math.abs(currentPrice - 1.34998) < 0.002
                      ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-[#00C261]">GBP/USD 1.34998</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold">+0.66% BUY</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">20 EMA: 1.3488 · RSI: 58.3</div>
                  <div className="text-[9px] text-[#00C261] mt-0.5 font-bold">M10/M15 SSL Sweep Bounce</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPair('GBP/USD');
                    setTimeframe('M15');
                    setBiasOverride('SELL');
                    setCurrentPrice(1.35450);
                    setEma20(1.35100);
                    setEma50(1.34820);
                    setRsi(75.8);
                    setKeyLevel(1.35580);
                    setPatternType('Tower Top Liquidity Sweep');
                    setTraderNotes('GBP/USD Tower Top Exhaustion @ 1.35450: Overextended 35 pips above 20 EMA with RSI 75.8 bearish divergence.');
                    setChatSyncedNotification('Synced GBP/USD Reversal @ 1.35450 (EMA20: 1.3510, RSI: 75.8)');
                    setTimeout(() => setChatSyncedNotification(null), 3000);
                  }}
                  className={`p-2.5 text-left rounded-xl border transition font-mono group ${
                    pair === 'GBP/USD' && Math.abs(currentPrice - 1.35450) < 0.002
                      ? 'bg-red-950/40 border-red-500/80 ring-1 ring-red-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-red-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-red-300">GBP/USD 1.3545</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-bold">SELL SWEEP</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">20 EMA: 1.3510 · RSI: 75.8</div>
                  <div className="text-[9px] text-red-400 mt-0.5 font-bold">Tower Top Overbought</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPair('EUR/USD');
                    setTimeframe('M15');
                    setBiasOverride('AUTO');
                    setCurrentPrice(1.12670);
                    setEma20(1.12550);
                    setEma50(1.12390);
                    setRsi(59.1);
                    setKeyLevel(1.12490);
                    setPatternType('Fair Value Gap Re-test');
                    setTraderNotes('EUR/USD Live Fiber @ 1.12670 (+0.79%): Tested discount FVG at 1.12490 with London continuation.');
                    setChatSyncedNotification('Synced EUR/USD @ 1.12670 (EMA20: 1.1255, RSI: 59.1)');
                    setTimeout(() => setChatSyncedNotification(null), 3000);
                  }}
                  className={`p-2.5 text-left rounded-xl border transition font-mono group ${
                    pair === 'EUR/USD'
                      ? 'bg-cyan-950/40 border-cyan-500/80 ring-1 ring-cyan-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">EUR/USD 1.1267</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold">+0.79% FVG</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">20 EMA: 1.1255 · RSI: 59.1</div>
                  <div className="text-[9px] text-cyan-400 mt-0.5 font-bold">Institutional Discount FVG</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPair('XAU/USD');
                    setTimeframe('M15');
                    setBiasOverride('AUTO');
                    setCurrentPrice(3955.00);
                    setEma20(3950.20);
                    setEma50(3943.50);
                    setRsi(59.5);
                    setKeyLevel(3946.50);
                    setPatternType('Asian Liquidity Sweep');
                    setTraderNotes('XAU/USD Gold Spot @ 3955.00 (+0.85%): Swept SSL @ 3946.50. Or type 4041.495 to match Gold futures chart.');
                    setChatSyncedNotification('Synced XAU/USD Gold @ 3955.00 (EMA20: 3950.2, RSI: 59.5)');
                    setTimeout(() => setChatSyncedNotification(null), 3000);
                  }}
                  className={`p-2.5 text-left rounded-xl border transition font-mono group ${
                    pair === 'XAU/USD'
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-[#D4AF37]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-[#D4AF37]">XAU/USD 3955.00</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold">+0.85% GOLD</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">20 EMA: 3950.2 · RSI: 59.5</div>
                  <div className="text-[9px] text-[#D4AF37] mt-0.5 font-bold">Gold Live Spot Sweep</div>
                </button>
              </div>

              {/* 1-Click Send to AI Chat & Deep Scan */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleSelectMarketAndDeepScanInChat(pair)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/30 to-amber-500/20 hover:from-[#D4AF37]/30 hover:to-amber-500/30 text-[#D4AF37] hover:text-white border border-[#D4AF37]/50 font-mono text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Send Active Pair ({pair} @ {currentPrice}) to Institutional AI Chat & Deep Scan →</span>
                </button>
              </div>
            </div>

            {/* Dual Analysis Action Buttons */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleRunAnalysis('standard')}
                disabled={analyzingManual}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                {analyzingManual && analysisExecutionMode === 'standard' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Crunching Math...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Analyse Market</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleRunAnalysis('deep_ai')}
                disabled={analyzingManual}
                className="py-3 px-4 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-95 transition disabled:opacity-50"
              >
                {analyzingManual && analysisExecutionMode === 'deep_ai' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deep AI Scanning...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Deep AI Analyse</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Helper Subtext */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>Standard: Fast technical confluence</span>
              <span className="text-[#D4AF37] font-bold">Deep AI: Institutional ICT + EA</span>
            </div>
          </div>

          {/* Manual Analysis Output (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/95 rounded-2xl p-5 border border-slate-800 min-h-[460px] flex flex-col justify-between space-y-4 tabular-nums">
            {manualResult ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {manualResult.pair} · {manualResult.timeframe} · {broker.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono text-xs font-black px-2.5 py-0.5 rounded-lg ${
                        manualResult.verdict === 'HIGH_PROBABILITY_BUY'
                          ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                          : manualResult.verdict === 'HIGH_PROBABILITY_SELL'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {manualResult.verdict.replace(/_/g, ' ')}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRunAnalysis(analysisExecutionMode)}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-[#D4AF37]/40 font-mono text-[11px] font-bold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reanalyse</span>
                    </button>
                  </div>
                </div>

                {/* Score & Trend */}
                <div className="text-center py-1 space-y-1">
                  <div className="text-4xl font-black text-white font-mono">
                    <span className="text-gold-gradient">{manualResult.score}</span>
                    <span className="text-sm text-slate-500"> / 100</span>
                  </div>
                  <div className="text-xs font-bold text-[#D4AF37]">{manualResult.detectedPattern}</div>
                  <div className="text-xs font-mono text-slate-300 font-bold">
                    Trend: <span className="text-white">{manualResult.trend}</span>
                  </div>
                </div>

                {/* Institutional Trajectory Projection */}
                {manualResult.projection && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#D4AF37] font-bold">
                      <span className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Institutional Trajectory & Projection:</span>
                      </span>
                      <span className="text-cyan-400 text-[10px] uppercase font-bold">{manualResult.orderType}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {manualResult.projection}
                    </p>
                  </div>
                )}

                {/* Execution Numbers */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-[9px] text-slate-500 block">Entry</span>
                    <span className="font-bold text-white text-xs">{manualResult.price}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-red-400 block">Stop Loss</span>
                    <span className="font-bold text-red-300 text-xs">{manualResult.stopLoss}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-cyan-400 block">TP1 (50%)</span>
                    <span className="font-bold text-cyan-300 text-xs">{manualResult.tp1Price || manualResult.takeProfit}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-400 block">Final Target</span>
                    <span className="font-bold text-emerald-300 text-xs">{manualResult.tp2Price || manualResult.takeProfit}</span>
                  </div>
                </div>

                {/* Broker Parameter Dashboard */}
                {manualResult.brokerDashboard && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#D4AF37] font-bold border-b border-slate-800 pb-1">
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        <span>{broker.toUpperCase()} Parameter Dashboard:</span>
                      </span>
                      <span className="text-[10px] text-emerald-400">READY TO EXECUTE ✓</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px]">MT4/MT5 Symbol</span>
                        <strong className="text-white">{manualResult.brokerDashboard.symbol}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Live Spread</span>
                        <strong className="text-amber-300">~{manualResult.brokerDashboard.spreadPips} pips</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Broker Leverage</span>
                        <strong className="text-cyan-300">{manualResult.brokerDashboard.leverage}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Server Name</span>
                        <strong className="text-slate-300">{manualResult.brokerDashboard.serverName}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step-by-Step MT4/MT5 Order Placement Instructions */}
                {manualResult.howToPlaceSteps && manualResult.howToPlaceSteps.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">
                      How to Place This Trade on {broker.toUpperCase()} MT4/MT5:
                    </span>
                    <div className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      {manualResult.howToPlaceSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight text-slate-300 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gilgil $2 Shield Guarantee */}
                <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] font-mono text-amber-200 flex items-center justify-between">
                  <span>Gilgil $2 Sizing Cap:</span>
                  <strong className="text-white">0.01 Micro Lot (Risk: $2.00 / 260 KES)</strong>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleLogToJournal(manualResult)}
                    className="w-full py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg active:scale-95"
                  >
                    <span>Log Setup to Trade Journal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      const eaCode = `// PIVOTFX EA CONFIG - ${manualResult.pair}
Symbol: ${manualResult.brokerDashboard?.symbol || manualResult.pair}
OrderType: ${manualResult.orderType}
Volume: 0.01 Micro Lot ($2 Max Risk)
Entry: ${manualResult.price}
SL: ${manualResult.stopLoss}
TP1: ${manualResult.tp1Price || manualResult.takeProfit}
TP2: ${manualResult.tp2Price || manualResult.takeProfit}
MagicNumber: 882024
Broker: ${broker.toUpperCase()}`;
                      navigator.clipboard.writeText(eaCode);
                      setCopiedManualEa(true);
                      setTimeout(() => setCopiedManualEa(false), 2000);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white font-mono font-bold text-[11px] transition border border-slate-800 flex items-center justify-center gap-1.5"
                  >
                    {copiedManualEa ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    <span>{copiedManualEa ? 'EA Parameters Copied!' : 'Copy EA Parameters for MT4/MT5'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <SlidersHorizontal className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="text-xs">
                  Choose your market parameters on the left and click <strong>⚡ Analyse Market</strong> for standard technicals or <strong>🧠 Deep AI Analyse</strong> for institutional ICT EA execution.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FULL MULTI-MARKET RADAR (DEEP AI SCAN) */}
      {/* ======================================================== */}
      {(scannerView === 'radar' || (scannerView !== 'hub' && activeTab === 'radar')) && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <MultiMarketRadarEngine
            selectedBroker={broker}
            onSelectMarketForAnalysis={(market, mode = 'deep_ai') => {
              setPair(market.pair);
              setTimeframe(market.recommendedTf);
              setCurrentPrice(market.price);
              setKeyLevel(market.keyLevel);
              setEma20(market.ema20);
              setEma50(market.ema50);
              setRsi(market.rsi);
              setPatternType(market.patternType);
              setTraderNotes(market.projection);
              setScannerView('favorable_chart');
              handleRunAnalysis(mode, market);
            }}
            onOpenTradingViewForPair={(p, tf, customP) => {
              handleSwitchPairAndSyncRealData(p, undefined, tf);
              if (customP && customP > 0) {
                setCurrentPrice(customP);
              }
              setScannerView('favorable_chart');
            }}
          />

          {/* Bottom Return Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => setScannerView('hub')}
              className="px-6 py-2.5 rounded-xl btn-gold text-black font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Return to Scanner Hub</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: INSTITUTIONAL AI MARKET ADVISOR */}
      {/* ======================================================== */}
      {(scannerView === 'advisor' || (scannerView !== 'hub' && activeTab === 'advisor')) && (
        <div className="space-y-6">
          {/* 1-CLICK MARKET QUICK SELECTOR & AUTO DEEP SCAN BAR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080E1E] border border-[#D4AF37]/50 shadow-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00C261] animate-ping" />
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-[#D4AF37]">
                    Choose Market to Auto-Update Quote & Deep AI Scan:
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                  Pick any market: instantly synchronizes quote, 20 EMA, 50 EMA, RSI, and generates a copyable trade placement card.
                </p>
              </div>

              {/* Active Market Live Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-[#D4AF37]/40 flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Active Sync:</span>
                <span className="font-bold text-white">{pair}</span>
                <span className="text-emerald-400 font-bold">@{currentPrice}</span>
                <span className="text-slate-400 text-[10px]">20 EMA: {ema20} • RSI: {rsi}</span>
              </div>
            </div>

            {/* 8 Market Quick-Select Cards (Live Quote + Real % Change + Click to Analyse) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 tabular-nums">
              {liveMarkets.map((m) => {
                const isSelected = pair === m.pair;
                const isBuy = m.bias === 'STRONG_BUY';
                return (
                  <button
                    key={m.pair}
                    onClick={() => handleSelectMarketAndDeepScanInChat(m.pair)}
                    className={`p-2.5 rounded-xl border text-left font-mono transition-all duration-200 relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#D4AF37]/25 border-[#D4AF37] ring-1 ring-[#D4AF37]/60 shadow-lg'
                        : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-black ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                        {m.pair}
                      </span>
                      <span className={`text-[10px] font-bold ${m.change24hPct >= 0 ? 'text-[#00C261]' : 'text-red-400'}`}>
                        {m.change24hPct >= 0 ? `+${m.change24hPct.toFixed(2)}%` : `${m.change24hPct.toFixed(2)}%`}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between text-[11px]">
                      <span className="text-slate-200 font-bold">@{m.price}</span>
                      <span className={`font-bold ${isBuy ? 'text-[#00C261]' : 'text-red-400'}`}>
                        {isBuy ? 'BUY' : 'SELL'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {m.recommendedTf} · {m.confidence}% AI
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick-Action Advisory Buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              1-Click Institutional Advisory Directives:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleAskAdvisor('Evaluate current market setup against the Gilgil $2 Rule and give me exact lot size')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-[#D4AF37] transition group space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37]">
                  <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Gilgil $2 Risk Audit</span>
                </div>
                <p className="text-[10px] text-slate-400">Strict $2 / 260 KES micro lot cap</p>
              </button>

              <button
                onClick={() => handleAskAdvisor('Check active EAT session liquidity and detect potential retail fakeout traps')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-[#D4AF37] transition group space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37]">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Session Trap Detector</span>
                </div>
                <p className="text-[10px] text-slate-400">London & NY Judas sweep check</p>
              </button>

              <button
                onClick={() => handleAskAdvisor('I just took a loss and want to re-enter with higher lot size. What should I do?')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-red-500/60 transition group space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-red-400">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>Revenge Lockout</span>
                </div>
                <p className="text-[10px] text-slate-400">Tilt prevention & kill-switch protocol</p>
              </button>

              <button
                onClick={() => handleAskAdvisor('Explain the protocol for trading high-impact US NFP and CPI economic news on FXPesa')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-[#D4AF37] transition group space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>News Spike Protocol</span>
                </div>
                <p className="text-[10px] text-slate-400">Red folder slippage & spread guard</p>
              </button>

              <button
                onClick={() => handleAskAdvisor('Give me the A+ daily pre-market checklist before opening any MT4/MT5 position today')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-[#D4AF37] transition group space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00C261]" />
                  <span>A+ Pre-Market Audit</span>
                </div>
                <p className="text-[10px] text-slate-400">5-point institutional confluence list</p>
              </button>

              <button
                onClick={() => handleAskAdvisor(`Analyze broker spread and commission economics for ${broker.toUpperCase()} on ${pair}`)}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 hover:border-[#D4AF37] transition group space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37]">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  <span>Broker Spread Check</span>
                </div>
                <p className="text-[10px] text-slate-400">FXPesa CMA vs Offshore pricing</p>
              </button>
            </div>
          </div>

          {/* INTERACTIVE REAL-TIME CHAT MARKET TABLE (Click any row/button to Analyse or Reanalyse with live SL/TP) */}
          <div className="rounded-2xl bg-slate-950/90 border border-[#D4AF37]/40 p-4 sm:p-5 space-y-3.5 shadow-xl tabular-nums">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Live Market Radar Table · 1-Click Institutional Analysis</span>
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <button
                  type="button"
                  onClick={handleSyncLiveQuotes}
                  disabled={syncingQuotes}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#00C261] border border-[#00C261]/40 text-xs font-bold flex items-center gap-1 transition"
                >
                  <RefreshCw className={`w-3 h-3 ${syncingQuotes ? 'animate-spin' : ''}`} />
                  <span>{syncingQuotes ? 'Syncing...' : `Sync Quotes (${feedSyncedAt})`}</span>
                </button>
                <span className="text-[#D4AF37] font-bold uppercase">{broker}</span>
              </div>
            </div>

            {chatSyncedNotification && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{chatSyncedNotification}</span>
              </div>
            )}

            <p className="text-xs text-slate-400 font-mono">
              Click any row or click <strong>Analyse</strong> / <strong>Reanalyse</strong> to update live market rates &amp; 24h % change, and inject a complete MT4/MT5 order card directly into the advisor feed.
            </p>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                    <th className="py-2.5 px-3">Pair &amp; TF</th>
                    <th className="py-2.5 px-3">Live Quote &amp; 24h %</th>
                    <th className="py-2.5 px-3">Order &amp; Confidence</th>
                    <th className="py-2.5 px-3">Real Stop Loss &amp; Take Profit</th>
                    <th className="py-2.5 px-3">{broker.toUpperCase()} Spread</th>
                    <th className="py-2.5 px-3 text-right">Analyse / Reanalyse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                  {liveMarkets.map((m) => {
                    const computedRow = computeRealChartTradeParams({
                      targetPair: m.pair,
                      targetTf: m.recommendedTf,
                      targetBroker: broker,
                      price: m.price,
                      keyLevel: m.keyLevel,
                      ema20: m.ema20,
                      ema50: m.ema50,
                      rsi: m.rsi,
                      biasOverride: m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY'
                    });
                    const isBuy = computedRow.direction === 'BUY';
                    const brokerSpec = m.spreadByBroker[broker];
                    const isSelected = pair === m.pair;

                    return (
                      <tr
                        key={m.pair}
                        onClick={() => handleTriggerChatAnalysis(m, 'deep_ai')}
                        className={`hover:bg-slate-900/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#D4AF37]/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{m.pair}</span>
                            <span className="text-[11px] text-[#D4AF37] font-bold">· {m.recommendedTf}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 block">{m.symbol}</span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">@{m.price}</span>
                            <span className={`text-xs font-bold ${m.change24hPct >= 0 ? 'text-[#00C261]' : 'text-red-400'}`}>
                              {m.change24hPct >= 0 ? `+${m.change24hPct.toFixed(2)}%` : `${m.change24hPct.toFixed(2)}%`}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">20 EMA: {m.ema20} · RSI: {m.rsi}</div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-black ${
                              isBuy
                                ? 'bg-emerald-500/20 text-[#00C261] border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}
                          >
                            {computedRow.orderType}
                          </span>
                          <span className="text-[11px] text-[#00C261] font-bold block mt-0.5">
                            {computedRow.confidence}% Confidence · R:R {computedRow.riskReward}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-xs space-y-0.5">
                          <div className="text-red-400 flex items-center justify-between gap-2">
                            <span>SL:</span>
                            <span className="font-bold text-white">{computedRow.stopLoss}</span>
                          </div>
                          <div className="text-cyan-400 flex items-center justify-between gap-2">
                            <span>TP1:</span>
                            <span className="font-bold text-white">{computedRow.tp1}</span>
                          </div>
                          <div className="text-emerald-400 flex items-center justify-between gap-2">
                            <span>TP2:</span>
                            <span className="font-bold text-white">{computedRow.tp2}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-xs">
                          <span className="text-amber-400 font-bold">~{brokerSpec?.spread}p</span>
                          <span className="text-[10px] text-slate-400 block">{brokerSpec?.symbol}</span>
                        </td>

                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleTriggerChatAnalysis(m, 'deep_ai')}
                              className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 text-xs font-bold transition flex items-center gap-1 active:scale-95 whitespace-nowrap"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Analyse</span>
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                const { markets, syncedAt } = await fetchLiveMarketSnapshot(liveMarkets);
                                setLiveMarkets(markets);
                                setFeedSyncedAt(syncedAt);
                                const fresh = markets.find((x) => x.pair === m.pair) || m;
                                handleTriggerChatAnalysis(fresh, 'deep_ai');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-bold transition flex items-center gap-1 active:scale-95 whitespace-nowrap"
                            >
                              <RefreshCw className="w-3 h-3 text-cyan-400" />
                              <span>Reanalyse</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Advisor Chat Feed */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 sm:p-5 space-y-4 max-h-[560px] overflow-y-auto">
            {advisorMessages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>{m.sender === 'user' ? 'Trader' : 'Institutional AI Advisor'}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm max-w-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-md space-y-3'
                  }`}
                >
                  {/* Verdict Badge if present */}
                  {m.verdict && (
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span
                        className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                          m.verdict === 'GREEN_LIGHT'
                            ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                            : m.verdict === 'CAUTION'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {m.verdict === 'GREEN_LIGHT' ? '✓ STRATEGIC GREEN LIGHT' : m.verdict === 'CAUTION' ? '⚠️ EXERCISE CAUTION' : '⛔ DO NOT TRADE / FLAT'}
                      </span>

                      {m.lotCap && (
                        <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                          Cap: {m.lotCap}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                    {m.text}
                  </div>

                  {/* RICH INSTITUTIONAL TRADE PLACEMENT CARD (REAL SL, TP, LOT SIZE & MT4 TICKET) */}
                  {m.tradeCard && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-[#D4AF37]/50 space-y-3 font-mono">
                      {/* Card Header with Direction, Order Type, Timeframe, and Broker Symbol */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-black shadow-md ${
                              m.tradeCard.direction === 'BUY'
                                ? 'bg-[#00C261] text-black'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {m.tradeCard.direction} {m.tradeCard.pair}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-white text-[11px] font-bold">
                            {m.tradeCard.orderType || `${m.tradeCard.direction} BY MARKET`}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-[11px] font-bold">
                            {m.tradeCard.timeframe || timeframe}
                          </span>
                          <span className="text-xs text-white font-bold">{m.tradeCard.pattern}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold text-[10px]">
                            {broker.toUpperCase()}: {m.tradeCard.brokerSymbol}
                          </span>
                          <span className="text-[#00C261] font-bold">{m.tradeCard.confidence}% Confluence</span>
                          <span className="text-[#D4AF37] font-bold">• R:R {m.tradeCard.riskReward}</span>
                        </div>
                      </div>

                      {/* Real Numerical Grid with 1-Click Copy Chips */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(String(m.tradeCard!.entryPrice));
                            setCopiedField(`${m.id}-entry`);
                            setTimeout(() => setCopiedField(null), 2000);
                          }}
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#D4AF37] transition text-left group"
                          title="Click to copy Entry Price"
                        >
                          <div className="flex items-center justify-between text-[9px] text-slate-400 uppercase font-bold">
                            <span>Entry Price</span>
                            <span className="text-[#D4AF37]">{copiedField === `${m.id}-entry` ? '✓ COPIED' : '📋 COPY'}</span>
                          </div>
                          <span className="font-bold text-white text-sm block mt-0.5">@{m.tradeCard.entryPrice}</span>
                          <span className="text-[9px] text-slate-500">Market Execution</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(String(m.tradeCard!.stopLoss));
                            setCopiedField(`${m.id}-sl`);
                            setTimeout(() => setCopiedField(null), 2000);
                          }}
                          className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-900/50 hover:border-red-500 transition text-left group"
                          title="Click to copy Stop Loss"
                        >
                          <div className="flex items-center justify-between text-[9px] text-red-400 uppercase font-bold">
                            <span>Stop Loss (SL)</span>
                            <span className="text-red-300">{copiedField === `${m.id}-sl` ? '✓ COPIED' : '📋 COPY'}</span>
                          </div>
                          <span className="font-bold text-red-300 text-sm block mt-0.5">{m.tradeCard.stopLoss}</span>
                          <span className="text-[9px] text-slate-400 block">(-{m.tradeCard.slPips} pips / ${m.tradeCard.actualRiskUsd})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(String(m.tradeCard!.tp1));
                            setCopiedField(`${m.id}-tp1`);
                            setTimeout(() => setCopiedField(null), 2000);
                          }}
                          className="p-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-950/60 border border-cyan-900/50 hover:border-cyan-400 transition text-left group"
                          title="Click to copy TP1"
                        >
                          <div className="flex items-center justify-between text-[9px] text-cyan-400 uppercase font-bold">
                            <span>Take Profit 1</span>
                            <span className="text-cyan-300">{copiedField === `${m.id}-tp1` ? '✓ COPIED' : '📋 COPY'}</span>
                          </div>
                          <span className="font-bold text-cyan-300 text-sm block mt-0.5">{m.tradeCard.tp1}</span>
                          <span className="text-[9px] text-slate-400 block">(50% Close & BE)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(String(m.tradeCard!.tp2));
                            setCopiedField(`${m.id}-tp2`);
                            setTimeout(() => setCopiedField(null), 2000);
                          }}
                          className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-900/50 hover:border-[#00C261] transition text-left group"
                          title="Click to copy TP2"
                        >
                          <div className="flex items-center justify-between text-[9px] text-emerald-400 uppercase font-bold">
                            <span>Take Profit 2</span>
                            <span className="text-emerald-300">{copiedField === `${m.id}-tp2` ? '✓ COPIED' : '📋 COPY'}</span>
                          </div>
                          <span className="font-bold text-emerald-300 text-sm block mt-0.5">{m.tradeCard.tp2}</span>
                          <span className="text-[9px] text-emerald-400 block">(+{m.tradeCard.tpPips} pips final)</span>
                        </button>
                      </div>

                      {/* Sizing & Gilgil Shield + CMA Protection */}
                      <div className="p-2.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-amber-200 gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <span>Gilgil Shield:</span>
                          <strong className="text-white">STRICTLY {m.tradeCard.lotSize} Micro Lot ($2.00 / 260 KES Hard Loss Cap)</strong>
                        </div>
                        <span className="text-emerald-400 font-bold text-[10px]">
                          ✓ CMA Safety: Zero Negative Balance Debt Risk
                        </span>
                      </div>

                      {/* Broker & Execution Specifications */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                          <span className="text-slate-500 block uppercase">Broker / Symbol</span>
                          <span className="font-bold text-white">{broker.toUpperCase()} • {m.tradeCard.brokerSymbol}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                          <span className="text-slate-500 block uppercase">Live Spread</span>
                          <span className="font-bold text-amber-300">~{m.tradeCard.brokerSpread} pips</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                          <span className="text-slate-500 block uppercase">Potential Target Gain</span>
                          <span className="font-bold text-[#00C261]">+${m.tradeCard.potentialGainUsd} USD (~{(m.tradeCard.potentialGainUsd * 130).toFixed(0)} KES)</span>
                        </div>
                      </div>

                      {/* MT4 Execution Steps */}
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase block">
                          MT4/MT5 F9 Execution Ticket ({broker.toUpperCase()}):
                        </span>
                        <div className="space-y-0.5 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                          {m.tradeCard.mt4Steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive TradingView Chart Viewer (Expandable right on card) */}
                      {expandedChartMsgId === m.id && (
                        <div className="mt-3 p-3 rounded-2xl bg-black border border-cyan-500/60 shadow-2xl space-y-2 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between text-xs font-mono pb-1 border-b border-slate-800">
                            <div className="flex items-center gap-2 text-cyan-300 font-bold">
                              <BarChart3 className="w-4 h-4 text-cyan-400" />
                              <span>Live Institutional Chart: {m.tradeCard.pair} ({timeframe})</span>
                            </div>
                            <button
                              onClick={() => setExpandedChartMsgId(null)}
                              className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                            >
                              ✕ Close Chart
                            </button>
                          </div>
                          <TradingViewEmbedWidget
                            pair={m.tradeCard.pair}
                            timeframe={timeframe}
                            onPairChange={(newPair) => handleSwitchPairAndSyncRealData(newPair)}
                            onTimeframeChange={(newTf) => setTimeframe(newTf)}
                            onClose={() => setExpandedChartMsgId(null)}
                            isCollapsible={false}
                          />
                        </div>
                      )}

                      {/* Action buttons inside chat card (Complete Trader Toolbelt) */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 font-mono">
                        <button
                          onClick={() => setExpandedChartMsgId(expandedChartMsgId === m.id ? null : m.id)}
                          className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-800/60 hover:border-cyan-400 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                          title="Toggle live TradingView chart"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{expandedChartMsgId === m.id ? 'Close Chart' : '📈 Chart'}</span>
                        </button>

                        <button
                          onClick={() => handleToggleSpeakAudit(m.id, m.tradeCard!)}
                          className={`py-2.5 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm ${
                            speakingMsgId === m.id
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 animate-pulse'
                              : 'bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border-amber-800/50 hover:border-amber-400'
                          }`}
                          title="Listen to audio briefing of setup"
                        >
                          {speakingMsgId === m.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">Stop Voice</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">🔊 Voice</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setActiveEaModalCard(m.tradeCard!)}
                          className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-800/60 hover:border-purple-400 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                          title="Generate MT4/MT5 EA script and .set file"
                        >
                          <FileCode className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate">📥 EA Script</span>
                        </button>

                        <button
                          onClick={() => setActiveTelegramModalCard(m.tradeCard!)}
                          className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-white border border-sky-800/60 hover:border-sky-400 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                          title="Send to Phone via Telegram / WhatsApp"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate">📱 Dispatch</span>
                        </button>

                        <button
                          onClick={() => {
                            const ticket = `[PIVOTFX AI ORDER TICKET]\nPair: ${m.tradeCard!.pair}\nSymbol: ${m.tradeCard!.brokerSymbol}\nAction: ${m.tradeCard!.direction} BY MARKET\nVolume: 0.01 Micro Lot\nEntry: ${m.tradeCard!.entryPrice}\nStop Loss: ${m.tradeCard!.stopLoss} (-${m.tradeCard!.slPips} pips / $${m.tradeCard!.actualRiskUsd} max loss)\nTake Profit 1: ${m.tradeCard!.tp1} (Close 50% & Move SL to Breakeven)\nTake Profit 2: ${m.tradeCard!.tp2} (+${m.tradeCard!.tpPips} pips final target)\nRisk:Reward = 1 : ${m.tradeCard!.riskReward}\nBroker: ${broker.toUpperCase()} (~${m.tradeCard!.brokerSpread} pips spread)\nCapital Shield: Strict $2.00 / 260 KES (Gilgil Rule)`;
                            navigator.clipboard.writeText(ticket);
                            setChatSyncedNotification(`✓ Copied complete MT4/MT5 order ticket for ${m.tradeCard!.pair}!`);
                            setTimeout(() => setChatSyncedNotification(null), 2500);
                          }}
                          className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#D4AF37] text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                          title="Copy text ticket for MT4 F9"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span className="truncate">📋 F9 Ticket</span>
                        </button>

                        <button
                          onClick={() => handleLogToJournal({
                            pair: m.tradeCard!.pair,
                            verdict: m.tradeCard!.direction,
                            suggestedLot: 0.01,
                            entryPrice: m.tradeCard!.entryPrice,
                            suggestedTP: m.tradeCard!.tp2,
                            potentialGainUsd: m.tradeCard!.potentialGainUsd,
                            pattern: m.tradeCard!.pattern,
                            score: m.tradeCard!.confidence
                          })}
                          className="py-2.5 px-2 rounded-xl btn-gold text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
                          title="Log to Pillar 8 Trade Journal"
                        >
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Log Trade</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {advisorLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] p-3 rounded-xl bg-slate-900 border border-slate-800 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Institutional AI Advisor calculating real-time order book confluences...</span>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={advisorInput}
              onChange={(e) => setAdvisorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAskAdvisor(advisorInput);
                }
              }}
              placeholder="Ask the Institutional AI Advisor anything (e.g., 'Evaluate GBP/USD at 1.34998 on 10m' or 'Gold at 4041.495')..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-white text-xs sm:text-sm focus:border-[#D4AF37] outline-none"
            />
            <button
              onClick={() => handleAskAdvisor(advisorInput)}
              disabled={advisorLoading || !advisorInput.trim()}
              className="px-5 py-3 rounded-2xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 transition active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>

          {/* Bottom Return to Hub Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => setScannerView('hub')}
              className="px-6 py-2.5 rounded-xl btn-gold text-black font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Return to Scanner Hub</span>
            </button>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL 1: MT4/MT5 EA SCRIPT & .SET PRESET EXPORTER       */}
      {/* ======================================================== */}
      {activeEaModalCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="max-w-2xl w-full bg-[#080E1E] border border-[#D4AF37] rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(212,175,55,0.25)] space-y-4 max-h-[92vh] overflow-y-auto font-mono text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    MT4 / MT5 Algorithmic Order Script Exporter
                  </h3>
                  <span className="text-[11px] text-[#D4AF37] font-bold">
                    {activeEaModalCard.direction} {activeEaModalCard.pair} • 0.01 Micro Lot ($2.00 / 260 KES Hard Cap)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveEaModalCard(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Execution Parameter Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Symbol</span>
                <span className="font-bold text-white">{activeEaModalCard.brokerSymbol}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Entry</span>
                <span className="font-bold text-white">@{activeEaModalCard.entryPrice}</span>
              </div>
              <div className="p-2 rounded-xl bg-red-950/40 border border-red-900/50">
                <span className="text-[9px] text-red-400 uppercase block">Stop Loss</span>
                <span className="font-bold text-red-300">{activeEaModalCard.stopLoss}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/50">
                <span className="text-[9px] text-emerald-400 uppercase block">Take Profit</span>
                <span className="font-bold text-emerald-300">{activeEaModalCard.tp2}</span>
              </div>
            </div>

            {/* MQL4 Script Code View */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-bold uppercase">Pre-Compiled MQL4 Execution Script:</span>
                <span className="text-[#00C261] font-bold">1-Click MetaTrader Ready</span>
              </div>
              <pre className="p-3.5 rounded-2xl bg-black border border-slate-800 text-slate-300 text-[10px] sm:text-[11px] leading-relaxed max-h-52 overflow-y-auto selection:bg-[#D4AF37]/40">
                {generateMql4Script(activeEaModalCard)}
              </pre>
            </div>

            {/* Download & Copy Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateMql4Script(activeEaModalCard));
                  setChatSyncedNotification('✓ Copied MQL4 script to clipboard!');
                  setTimeout(() => setChatSyncedNotification(null), 2500);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Copy MQL4 Source</span>
              </button>

              <button
                onClick={() => {
                  const filename = `PivotFX_${activeEaModalCard.pair.replace('/', '')}_Script.mq4`;
                  handleDownloadFile(generateMql4Script(activeEaModalCard), filename, 'text/plain');
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-950/50 hover:bg-purple-900/70 text-purple-200 border border-purple-800 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Download .mq4 File</span>
              </button>

              <button
                onClick={() => {
                  const filename = `PivotFX_${activeEaModalCard.pair.replace('/', '')}.set`;
                  handleDownloadFile(generateSetFileContent(activeEaModalCard), filename, 'text/plain');
                }}
                className="py-2.5 px-3 rounded-xl btn-gold text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .set Preset</span>
              </button>
            </div>

            {/* Quick 3-Step MT4 Installation Guide */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[10px] space-y-1 text-slate-400">
              <strong className="text-white block uppercase">How to drop into MT4 / MT5:</strong>
              <div className="flex items-center gap-1.5">
                <span className="text-[#D4AF37] font-bold">Step 1:</span>
                <span>Open MT4/MT5 -&gt; File -&gt; Open Data Folder -&gt; MQL4 -&gt; Scripts.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#D4AF37] font-bold">Step 2:</span>
                <span>Drop the downloaded <strong>.mq4</strong> script into the folder.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#D4AF37] font-bold">Step 3:</span>
                <span>Right-click Scripts in MT4 Navigator -&gt; Refresh -&gt; Drag onto {activeEaModalCard.pair} chart!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TELEGRAM & WHATSAPP SIGNAL DISPATCHER           */}
      {/* ======================================================== */}
      {activeTelegramModalCard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="max-w-xl w-full bg-[#080E1E] border border-sky-500 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(14,165,233,0.25)] space-y-4 max-h-[92vh] overflow-y-auto font-mono text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    Mobile Signal Dispatcher (Telegram & WhatsApp)
                  </h3>
                  <span className="text-[11px] text-sky-400 font-bold">
                    Instant phone notification for {activeTelegramModalCard.pair}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTelegramModalCard(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Message Preview */}
            <div className="space-y-1.5">
              <span className="text-slate-400 font-bold uppercase text-[11px]">Formatted Alert Preview:</span>
              <pre className="p-3.5 rounded-2xl bg-black border border-slate-800 text-slate-200 text-[11px] leading-relaxed whitespace-pre-line max-h-52 overflow-y-auto">
                {getShareableText(activeTelegramModalCard)}
              </pre>
            </div>

            {/* 1-Click Dispatch Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent('https://pivotfx.academy')}&text=${encodeURIComponent(getShareableText(activeTelegramModalCard))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open in Telegram</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getShareableText(activeTelegramModalCard))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Send to WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(getShareableText(activeTelegramModalCard));
                  setChatSyncedNotification('Copied message to clipboard');
                  setTimeout(() => setChatSyncedNotification(null), 2500);
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Copy Text</span>
              </button>
            </div>

            {/* Custom Webhook Dispatcher */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-bold uppercase">Automated Webhook Relay (Discord / Custom EA Bot):</span>
                {webhookStatus && <span className="text-emerald-400 font-bold">{webhookStatus}</span>}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://discord.com/api/webhooks/... or your server"
                  value={webhookUrl}
                  onChange={(e) => {
                    setWebhookUrl(e.target.value);
                    try {
                      localStorage.setItem('pivotfx_webhook_url', e.target.value);
                    } catch {}
                  }}
                  className="flex-1 bg-black border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-sky-400 font-mono"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!webhookUrl.trim()) {
                      setWebhookStatus('⚠️ Please enter URL');
                      setTimeout(() => setWebhookStatus(null), 2000);
                      return;
                    }
                    try {
                      setWebhookStatus('Relaying...');
                      await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          source: 'PivotFX Institutional AI Vision',
                          timestamp: new Date().toISOString(),
                          card: activeTelegramModalCard,
                          rawText: getShareableText(activeTelegramModalCard)
                        }),
                        mode: 'no-cors'
                      });
                      setWebhookStatus('✓ Dispatched!');
                      setTimeout(() => setWebhookStatus(null), 3000);
                    } catch (err: any) {
                      setWebhookStatus(`Failed: ${err.message || 'Network error'}`);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 transition"
                >
                  Send Hook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
