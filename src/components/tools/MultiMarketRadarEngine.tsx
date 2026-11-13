import React, { useState, useEffect } from 'react';
import { CurrencyPair, Timeframe, BrokerId } from '../../types';
import {
  MarketScanData,
  DailyMacroAiDirective,
  ActiveMarketOrder,
  INITIAL_MARKETS_DATA,
  globalLiveStream,
  sortMarketsByTopPercent,
  computeRealChartTradeParams,
  computeLiveOrderMetrics,
  computeCandleSwingLevels,
  evaluatePairKenyaTiming,
  getCurrentMacroContext,
  getUpcomingEconomicEvents,
  evaluateOrderEntryMoment,
  evaluateOrderTrendSustainability,
  EntryMomentVerdict,
  TrendSustainabilityVerdict,
  RiskManagementConfig,
  positionRiskStore
} from '../../utils/liveMarketEngine';
import { EntryConfirmationController } from './EntryConfirmationController';
import { LiveInteractiveCandleChart } from './LiveInteractiveCandleChart';
import { ActiveMarketOrderPanel } from './ActiveMarketOrderPanel';
import { DynamicPositionSizeCalculator } from './DynamicPositionSizeCalculator';
import { ConfluenceMatrixModal } from '../prop/ConfluenceMatrixModal';
import { PropDrawdownGuardModal } from '../prop/PropDrawdownGuardModal';
import { NewsGuardModal } from '../prop/NewsGuardModal';
import { PropTradingJournalModal } from '../prop/PropTradingJournalModal';
import { audioAlertEngine } from '../../utils/audioAlerts';
import {
  getStoredJournalTrades,
  getStoredPropAccount,
  computeConfluenceMatrix
} from '../../utils/propDeskStorage';
import { JournalTrade, PropAccountConfig } from '../../types/propDesk';
import {
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ShieldCheck,
  Shield,
  Award,
  Zap,
  Bot,
  Copy,
  Check,
  BarChart3,
  Target,
  ArrowLeft,
  ArrowRight,
  Activity,
  Radar,
  Clock,
  ClipboardList,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lock,
  Info,
  BookOpen,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';

export type { MarketScanData };
export { INITIAL_MARKETS_DATA };

interface MultiMarketRadarEngineProps {
  selectedBroker: BrokerId;
  onSelectMarketForAnalysis: (market: MarketScanData, mode?: 'standard' | 'deep_ai') => void;
  onOpenTradingViewForPair: (pair: CurrencyPair, tf?: Timeframe, price?: number) => void;
}

export const MultiMarketRadarEngine: React.FC<MultiMarketRadarEngineProps> = ({
  selectedBroker,
  onSelectMarketForAnalysis,
  onOpenTradingViewForPair,
}) => {
  const [markets, setMarkets] = useState<MarketScanData[]>(() => globalLiveStream.getState().markets);
  const [lastScannedTime, setLastScannedTime] = useState<string>(() => globalLiveStream.getState().syncedAt);
  const [feedConnected, setFeedConnected] = useState<boolean>(() => globalLiveStream.getState().liveFeedConnected);
  const [lockedPairs, setLockedPairs] = useState<Partial<Record<CurrencyPair, boolean>>>(
    () => globalLiveStream.getState().lockedPairs
  );
  const [customTfs, setCustomTfs] = useState<Partial<Record<CurrencyPair, Timeframe>>>(
    () => globalLiveStream.getState().customTimeframes
  );
  const [activeScanMode, setActiveScanMode] = useState<
    'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai' | 'h1_trend_lock'
  >(() => globalLiveStream.getState().lastScanMode);
  const [superAiAuto, setSuperAiAuto] = useState<boolean>(
    () => globalLiveStream.getState().superAiAutoEnabled
  );
  const [superAiNotes, setSuperAiNotes] = useState(
    () => globalLiveStream.getState().superAiNotes
  );
  const [dailyMacroDirective, setDailyMacroDirective] = useState<DailyMacroAiDirective>(
    () => globalLiveStream.getState().dailyMacroDirective
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isRescanningCard, setIsRescanningCard] = useState(false);
  const [isReanalysingCardAi, setIsReanalysingCardAi] = useState(false);
  const [filterBias, setFilterBias] = useState<
    'ALL' | 'GRADE_A' | 'PCT_MOVERS' | 'BUY' | 'SELL' | 'FLIPPED'
  >('ALL');
  const [assetCategory, setAssetCategory] = useState<
    'ALL' | 'CRYPTO' | 'FOREX' | 'INDICES' | 'COMMODITIES'
  >('ALL');
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(
    () => globalLiveStream.getState().selectedPair
  );
  const [activeOrders, setActiveOrders] = useState<Partial<Record<CurrencyPair, ActiveMarketOrder>>>(
    () => globalLiveStream.getState().activeOrders
  );
  const [inspectedSideByPair, setInspectedSideByPair] = useState<Partial<Record<CurrencyPair, 'AUTO' | 'BUY' | 'SELL'>>>({});
  const [viewSavedOrderByPair, setViewSavedOrderByPair] = useState<Partial<Record<CurrencyPair, boolean>>>({});
  const [riskConfig, setRiskConfig] = useState<RiskManagementConfig>(() => positionRiskStore.getConfig());
  const [scanBanner, setScanBanner] = useState<string | null>(null);
  const [copiedCardPair, setCopiedCardPair] = useState<string | null>(null);
  const [copiedEa, setCopiedEa] = useState(false);

  // Institutional Prop Desk Modules
  const [showConfluenceModal, setShowConfluenceModal] = useState(false);
  const [showDrawdownModal, setShowDrawdownModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [propAccount, setPropAccount] = useState<PropAccountConfig>(() => getStoredPropAccount());
  const [journalTrades, setJournalTrades] = useState<JournalTrade[]>(() => getStoredJournalTrades());
  const [isAudioActive, setIsAudioActive] = useState<boolean>(() => audioAlertEngine.isEnabled());

  const handleToggleSound = () => {
    const nextState = audioAlertEngine.toggle();
    setIsAudioActive(nextState);
  };

  const handleQuickCopyValue = (val: string | number, key: string) => {
    try {
      navigator.clipboard.writeText(String(val));
    } catch {}
    setCopiedCardPair(key);
    setTimeout(() => {
      setCopiedCardPair((prev) => (prev === key ? null : prev));
    }, 1500);
  };

  // Subscribe to global real-time stream & Super AI Auto notes + Position Risk store
  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setMarkets(streamState.markets);
      setLastScannedTime(streamState.syncedAt);
      setFeedConnected(streamState.liveFeedConnected);
      setLockedPairs(streamState.lockedPairs);
      setCustomTfs(streamState.customTimeframes);
      setSuperAiAuto(streamState.superAiAutoEnabled);
      setSuperAiNotes(streamState.superAiNotes);
      setDailyMacroDirective(streamState.dailyMacroDirective);
      setSelectedPair(streamState.selectedPair);
      setActiveOrders(streamState.activeOrders);
    });
    const unsubRisk = positionRiskStore.subscribe((nextCfg) => setRiskConfig(nextCfg));
    return () => {
      unsubscribe();
      unsubRisk();
    };
  }, []);

  const handleOpenPairCard = (pairToOpen: CurrencyPair) => {
    setSelectedPair(pairToOpen);
    globalLiveStream.setSelectedPair(pairToOpen);
    if (superAiAuto || !superAiNotes[pairToOpen]) {
      void globalLiveStream.fetchSuperAiNoteForPair(pairToOpen, customTfs[pairToOpen], true);
    }
  };

  const handleClosePairCard = () => {
    setSelectedPair(null);
    globalLiveStream.setSelectedPair(null);
  };

  const playRadarBeep = (freq = 1050) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch {
      // Audio fallback
    }
  };

  // Global Scan All Markets / Rescan / Deep AI / 1H Trend-Lock Scan
  const handleRunScan = async (mode: 'scan_all' | 'rescan' | 'deep_ai' | 'h1_trend_lock') => {
    setIsScanning(true);
    setActiveScanMode(mode);
    setFilterBias(mode === 'h1_trend_lock' ? 'GRADE_A' : 'ALL');
    setSelectedPair(null);
    globalLiveStream.setSelectedPair(null);

    if (mode === 'h1_trend_lock') {
      // Anchor all 10 markets to H1 institutional structure
      markets.forEach((m) => {
        globalLiveStream.setPairTimeframe(m.pair, 'H1');
      });
    }

    const updatedState = await globalLiveStream.triggerScan(
      mode === 'h1_trend_lock' ? 'deep_ai' : mode
    );
    setIsScanning(false);

    const leader = updatedState.markets[0];
    const modeLabel =
      mode === 'h1_trend_lock'
        ? '1H INSTITUTIONAL TREND-LOCK SCAN'
        : mode === 'deep_ai'
        ? `DEEP AI SCAN (ALL ${updatedState.markets.length} MARKETS)`
        : mode === 'rescan'
        ? 'LIVE RESCAN (TOP % → LEAST)'
        : 'SCAN ALL MARKETS';

    if (leader) {
      const dirWord = leader.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
      const pctStr = leader.change24hPct >= 0 ? `+${leader.change24hPct}%` : `${leader.change24hPct}%`;
      const netUsd = leader.netProfitUsd ?? Number((leader.projectedPips * 0.1).toFixed(2));
      const netKes = leader.netProfitKes ?? Math.round(netUsd * 130);
      setScanBanner(
        mode === 'h1_trend_lock'
          ? `1H TREND-LOCK ACTIVE ✓ · All ${updatedState.markets.length} pairs anchored to 1H 20/50 EMA structure · Pullback candles classified as Retracements (Sell Rally in Downtrend / Buy Dip in Uptrend) · Top Setup: ${leader.pair} ${dirWord} @ ${leader.price}`
          : `${modeLabel} (${updatedState.syncedAt}) · #1 Top % Leader: ${leader.pair} (${pctStr}) · ${leader.trendDirection} · ORDER ${dirWord} @ ${leader.price} · Est. Net +$${netUsd.toFixed(2)} (+${netKes} KES) · SL ${leader.suggestedSL} · TP ${leader.suggestedTP2}`
      );
      setTimeout(() => setScanBanner(null), 6500);
    }

    playRadarBeep(
      mode === 'h1_trend_lock' ? 1320 : mode === 'deep_ai' ? 1220 : mode === 'rescan' ? 1120 : 1020
    );
  };

  const handleQuickLoadCardOrder = (
    targetPair: CurrencyPair,
    dir: 'BUY' | 'SELL',
    tf: Timeframe
  ) => {
    const loaded = globalLiveStream.loadMarketOrder({
      pair: targetPair,
      direction: dir,
      timeframe: tf,
      broker: selectedBroker,
      autoTrailEnabled: true
    });
    if (loaded) {
      setScanBanner(
        `BROKER ORDER NOTIFIED & TRACKED · ${loaded.pair} ${loaded.direction} @ ${loaded.entryPrice} | SL ${loaded.stopLoss} | TP ${loaded.tp2} (Logged in Trade Log ✓)`
      );
      setTimeout(() => setScanBanner(null), 5000);
      playRadarBeep(1180);
    }
  };

  // Independent Single-Card Rescan
  const handleRescanFocusedCard = async (pairToScan: CurrencyPair, tf: Timeframe) => {
    setIsRescanningCard(true);
    try {
      const stateAfter = await globalLiveStream.rescanSinglePair(pairToScan, tf);
      const updatedCard = stateAfter.markets.find((m) => m.pair === pairToScan);
      if (updatedCard) {
        const pctStr = updatedCard.change24hPct >= 0 ? `+${updatedCard.change24hPct}%` : `${updatedCard.change24hPct}%`;
        setScanBanner(
          `RESCANNED ${pairToScan} [${tf}] (${stateAfter.syncedAt}) · Price @ ${updatedCard.price} (${pctStr}) · ${updatedCard.trendDirection} · SL ${updatedCard.suggestedSL} · TP ${updatedCard.suggestedTP2}`
        );
        setTimeout(() => setScanBanner(null), 5000);
      }
      playRadarBeep(1120);
    } finally {
      setIsRescanningCard(false);
    }
  };

  // Independent Single-Card Super AI Reanalysis
  const handleReanalyseFocusedCardAi = async (pairToAnalyse: CurrencyPair, tf: Timeframe) => {
    setIsReanalysingCardAi(true);
    try {
      const note = await globalLiveStream.fetchSuperAiNoteForPair(pairToAnalyse, tf, true);
      if (note) {
        setScanBanner(`SUPER AI REANALYSED ${pairToAnalyse} [${tf}] · ${note.headline}`);
        setTimeout(() => setScanBanner(null), 5000);
      }
      playRadarBeep(1240);
    } finally {
      setIsReanalysingCardAi(false);
    }
  };

  // Filtered & Sorted Markets: always Top % to Least % unless user picks |%| or BUY/SELL filter
  const filteredMarkets = (() => {
    const base = markets.filter((m) => {
      // 1. Asset class category filter
      if (assetCategory === 'CRYPTO' && m.pair !== 'BTC/USD' && m.pair !== 'ETH/USD') return false;
      if (
        assetCategory === 'FOREX' &&
        !['EUR/USD', 'GBP/USD', 'USD/JPY', 'GBP/JPY', 'USD/CHF', 'EUR/JPY', 'AUD/USD', 'USD/CAD'].includes(m.pair)
      ) return false;
      if (assetCategory === 'INDICES' && !['US30', 'NAS100', 'GER40'].includes(m.pair)) return false;
      if (assetCategory === 'COMMODITIES' && !['XAU/USD', 'USOIL'].includes(m.pair)) return false;

      // 2. Bias / Signal filter
      if (filterBias === 'BUY') return m.bias === 'STRONG_BUY';
      if (filterBias === 'SELL') return m.bias === 'STRONG_SELL';
      if (filterBias === 'FLIPPED') return Boolean(m.directionFlipped);
      if (filterBias === 'GRADE_A') {
        const isBull = m.bias === 'STRONG_BUY';
        return m.h1TrendDirection === (isBull ? 'UPTREND' : 'DOWNTREND');
      }
      return true;
    });
    if (filterBias === 'PCT_MOVERS') {
      return sortMarketsByTopPercent(base, 'PCT_ABS');
    }
    return sortMarketsByTopPercent(base, 'PCT_DESC');
  })();

  const macroContext = (() => {
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    markets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    return getCurrentMacroContext(pctMap);
  })();

  const confluenceItems = (() => {
    const trends: Record<string, 'BUY' | 'SELL' | 'NEUTRAL'> = {};
    markets.forEach((m) => {
      trends[m.pair] = m.h1TrendDirection === 'UPTREND' || m.change24hPct >= 0 ? 'BUY' : 'SELL';
    });
    return computeConfluenceMatrix(trends);
  })();

  const topLeader = filteredMarkets[0] || markets[0];
  const focusedMarket = selectedPair ? markets.find((m) => m.pair === selectedPair) || null : null;
  const TIMEFRAME_CHOICES: Timeframe[] = ['M1', 'M5', 'M10', 'M15', 'H1', 'H4', 'D1'];

  return (
    <div className="space-y-6">
      {/* INSTITUTIONAL PROP DESK TOOLBAR */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#090e1a] to-[#0d1424] border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold font-mono uppercase tracking-wider flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Dennis.K.M Prop Desk Suite</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
            Risk Engine: ${(riskConfig.accountBalanceUsd * (riskConfig.riskPct / 100)).toFixed(2)} ({riskConfig.riskPct}% of ${riskConfig.accountBalanceUsd.toLocaleString()})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Confluence Matrix Button */}
          <button
            type="button"
            onClick={() => setShowConfluenceModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition active:scale-95"
            title="Open Multi-Timeframe M5/M15/H1/H4 Confluence Grid"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>4-TF Confluence</span>
          </button>

          {/* Drawdown Guard Button */}
          <button
            type="button"
            onClick={() => setShowDrawdownModal(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1.5 transition active:scale-95 ${
              propAccount.isCircuitBreakerTripped
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            }`}
            title="Open Prop Firm Drawdown Meter & Circuit Breaker"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drawdown Guard (${(propAccount.accountSize / 1000).toFixed(0)}K)</span>
          </button>

          {/* News Guard Button */}
          <button
            type="button"
            onClick={() => setShowNewsModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition active:scale-95"
            title="High-Impact Red Folder Economic Calendar"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>News Guard</span>
          </button>

          {/* Prop Journal Button */}
          <button
            type="button"
            onClick={() => setShowJournalModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition active:scale-95"
            title="Open Prop Trade Journal & Win Rate Analytics"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prop Journal ({journalTrades.length})</span>
          </button>

          {/* Audio Chime Master Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-1.5 rounded-xl border transition ${
              isAudioActive
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            title={isAudioActive ? 'Web Audio Chimes Active (Click to Mute)' : 'Web Audio Chimes Muted (Click to Unmute)'}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 1. TOP SPEED SCANNER HEADER: LIVE SYNC + ALL-MARKET, 1H TREND-LOCK & DEEP AI SCAN BUTTONS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap tabular-nums">
            <span className="text-[#00C261] font-bold">24/7 Real-Time Sync</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#D4AF37]">
              {feedConnected ? 'Interbank & Crypto Stream Active' : 'Calibrated Real-Time Feed'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-white font-bold">{lastScannedTime}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            AI Market Radar · Sorted Top % to Least %
          </h3>
          <p className="text-xs text-slate-300 font-mono max-w-3xl">
            Ranked from Top % gainer to Least % with 1H Institutional Trend Anchor. 2–3 counter candles are classified as 20/50 EMA value retracements (Sell the Rally in downtrends / Buy the Dip in uptrends).
          </p>
        </div>

        {/* SCAN CONTROLS: Super AI Auto | Scan All | Rescan | 1H Trend-Lock | Deep AI */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 w-full xl:w-auto">
          <button
            type="button"
            onClick={() => globalLiveStream.setSuperAiAuto(!superAiAuto)}
            className={`px-3.5 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap shrink-0 border ${
              superAiAuto
                ? 'bg-emerald-950/70 text-[#00C261] border-[#00C261]/60'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Super AI Auto: {superAiAuto ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('scan_all')}
            disabled={isScanning}
            className={`px-3.5 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
              activeScanMode === 'scan_all' && !focusedMarket
                ? 'bg-cyan-400 text-black'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700'
            }`}
          >
            <Radar className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'scan_all' ? 'animate-spin' : ''}`} />
            <span>Scan All</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('rescan')}
            disabled={isScanning}
            className={`px-3.5 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
              activeScanMode === 'rescan' && !focusedMarket
                ? 'bg-[#00C261] text-black'
                : 'bg-slate-900 hover:bg-slate-800 text-[#00C261] border border-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'rescan' ? 'animate-spin' : ''}`} />
            <span>Rescan</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('h1_trend_lock')}
            disabled={isScanning}
            title="Lock all 15 pairs to 1H timeframe, eliminate counter-candle noise, and enforce 20/50 EMA trend fidelity"
            className={`px-4 py-2.5 rounded-xl font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap shrink-0 border ${
              activeScanMode === 'h1_trend_lock'
                ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                : 'bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border-[#D4AF37]/50'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'h1_trend_lock' ? 'animate-spin' : ''}`} />
            <span>1H Trend-Lock Scan</span>
          </button>

          <button
            type="button"
            onClick={() => handleRunScan('deep_ai')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'deep_ai' ? 'animate-spin' : ''}`} />
            <span>Deep AI Scan</span>
          </button>
        </div>
      </div>

      {/* 2. TODAY & THIS HOUR GLOBAL MACRO + NAIROBI COUNTDOWN BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1222] border border-[#D4AF37]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs font-mono tabular-nums">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#D4AF37] text-black font-black">
              {dailyMacroDirective.source === 'gemini-4-hydrogen' || dailyMacroDirective.source === 'gemini-3.8-flash'
                ? 'SUPER AI MACRO DIRECTIVE'
                : 'AI SESSION DIRECTIVE'}
            </span>
            <strong className="text-white text-sm">{dailyMacroDirective.headline}</strong>
          </div>
          <p className="text-slate-300 leading-relaxed">{dailyMacroDirective.hourlyOutlook}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0 bg-slate-950/90 px-4 py-2.5 rounded-xl border border-slate-800">
          <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Nairobi Time · Active Window</span>
            <strong className="text-white">
              {macroContext.eatTimeString} ·{' '}
              <span className="text-[#00C261]">{macroContext.sessionWindowName}</span>
            </strong>
          </div>
        </div>
      </div>

      {/* 2B. HIGH-IMPACT ECONOMIC NEWS & SPREAD VOLATILITY SHIELD */}
      {(() => {
        const events = getUpcomingEconomicEvents();
        const activeOrImminent = events.find((e) => e.status === 'ACTIVE_NOW' || e.status === 'IMMINENT');
        const nextEvent = events.find((e) => e.status !== 'PASSED') || events[0];

        return (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-lg font-black text-[10px] flex items-center gap-1.5 ${
                  activeOrImminent
                    ? 'bg-amber-400 text-black animate-pulse'
                    : 'bg-emerald-950/80 text-[#00C261] border border-[#00C261]/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{activeOrImminent ? '⚠️ HIGH-IMPACT NEWS RADAR ACTIVE' : '🟢 SPREAD CLEAR SKY'}</span>
              </span>
              <span className="text-white font-bold">{nextEvent.name} ({nextEvent.currency})</span>
              <span className="text-slate-400">· Release: {nextEvent.timeEAT}</span>
            </div>
            <div className="text-slate-300 text-[11px] font-sans">
              {nextEvent.tradingDirective}
            </div>
          </div>
        );
      })()}

      {/* Live Scan Status Flash Banner */}
      {scanBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-[#00C261]/50 text-emerald-200 text-xs font-mono flex items-center justify-between gap-2 tabular-nums">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0" />
            <span>{scanBanner}</span>
          </div>
          <span className="text-[11px] text-[#00C261] font-bold shrink-0">Synced ✓</span>
        </div>
      )}

      {/* =========================================================================
          VIEW A: SINGLE SELECTED MARKET CHART & DEEP AI WORKSPACE
          Opens ONLY when user clicks a specific card! Includes independent card
          Rescan, Reanalyse with Super AI, and Back to All 10 Cards buttons.
          ========================================================================= */}
      {focusedMarket ? (
        (() => {
          const activeTf = customTfs[focusedMarket.pair] || focusedMarket.recommendedTf;
          const aiRecommendedSide: 'BUY' | 'SELL' = focusedMarket.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
          const selectedSideMode = inspectedSideByPair[focusedMarket.pair] || 'AUTO';
          const focusedSwings = computeCandleSwingLevels(focusedMarket.candles);

          const computed = computeRealChartTradeParams({
            targetPair: focusedMarket.pair,
            targetTf: activeTf,
            targetBroker: selectedBroker,
            price: focusedMarket.price,
            keyLevel: focusedMarket.keyLevel,
            ema20: focusedMarket.ema20,
            ema50: focusedMarket.ema50,
            rsi: focusedMarket.rsi,
            atrPips: focusedMarket.atrPips,
            swingLow: focusedSwings.swingLow,
            swingHigh: focusedSwings.swingHigh,
            macro: macroContext,
            biasOverride: selectedSideMode === 'AUTO' ? undefined : selectedSideMode,
            h1TrendDirection: focusedMarket.h1TrendDirection,
            riskConfig
          });
          const oppositeSide: 'BUY' | 'SELL' = computed.direction === 'BUY' ? 'SELL' : 'BUY';
          const oppositeComputed = computeRealChartTradeParams({
            targetPair: focusedMarket.pair,
            targetTf: activeTf,
            targetBroker: selectedBroker,
            price: focusedMarket.price,
            keyLevel: focusedMarket.keyLevel,
            ema20: focusedMarket.ema20,
            ema50: focusedMarket.ema50,
            rsi: focusedMarket.rsi,
            atrPips: focusedMarket.atrPips,
            swingLow: focusedSwings.swingLow,
            swingHigh: focusedSwings.swingHigh,
            macro: macroContext,
            biasOverride: oppositeSide,
            h1TrendDirection: focusedMarket.h1TrendDirection,
            riskConfig
          });
          const kenyaTiming = evaluatePairKenyaTiming(focusedMarket.pair);
          const isBuy = computed.direction === 'BUY';
          const pctPositive = focusedMarket.change24hPct >= 0;
          const rankNum = markets.findIndex((x) => x.pair === focusedMarket.pair) + 1;

          const loadedOrder = activeOrders[focusedMarket.pair] || null;
          const loadedOrderMetrics = loadedOrder
            ? computeLiveOrderMetrics(loadedOrder, focusedMarket.price, focusedMarket.atrPips)
            : null;
          const isOrderCompletedOrStale = Boolean(
            loadedOrder &&
              focusedMarket.price > 0 &&
              (loadedOrderMetrics?.hitTp2 ||
                loadedOrderMetrics?.hitSl ||
                Math.abs(loadedOrder.entryPrice - focusedMarket.price) / focusedMarket.price > 0.015 ||
                loadedOrder.direction !== computed.direction)
          );
          const showSavedOrder = Boolean(
            loadedOrder && (!isOrderCompletedOrStale || viewSavedOrderByPair[focusedMarket.pair])
          );
          const displayOrder = showSavedOrder ? loadedOrder : null;

          const eaMqlCode = `// --- PIVOTFX LIVE AUTO-SYNC EA CONFIG ---
// Broker: ${selectedBroker.toUpperCase()} | Synced: ${lastScannedTime} | Rank #${rankNum}
// Symbol: ${computed.brokerSymbol} (${focusedMarket.pair} · ${activeTf})
// Direction: ${computed.orderType} | Trend: ${computed.trendProjectionText} | 24h Move: ${pctPositive ? '+' : ''}${focusedMarket.change24hPct}%
// Live Indicators: 20 EMA = ${focusedMarket.ema20} | 50 EMA = ${focusedMarket.ema50} | RSI = ${focusedMarket.rsi}
// Risk Management: ${computed.lotSize.toFixed(2)} Lots ($${computed.actualRiskUsd.toFixed(2)} / ${Math.round(computed.actualRiskUsd * 130)} KES Max Risk · ${riskConfig.riskPct}% of $${riskConfig.accountBalanceUsd})

input double   LotSize             = ${computed.lotSize.toFixed(2)};
input double   EntryPrice          = ${computed.entryPrice};
input double   StopLoss            = ${computed.stopLoss}; // -${computed.slPips} pips ($${computed.actualRiskUsd.toFixed(2)} max risk)
input double   TakeProfit_1        = ${computed.tp1}; // 1H-4H: Close 50% & Move SL to BE
input double   TakeProfit_2        = ${computed.tp2}; // 4H-12H Session Target (+${computed.tpPips} pips)
input double   TakeProfit_3_48H    = ${computed.tp3}; // 12H-48H Extended Swing (+${computed.tp3Pips} pips / +$${computed.netProfit48hUsd.toFixed(2)})
input double   MaxRiskUsdPerTrade  = ${computed.actualRiskUsd.toFixed(2)};`;

          return (
            <div className="space-y-5 font-mono tabular-nums">
              {/* Top Independent Card Action Toolbar + Back to All Cards */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleClosePairCard}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-slate-700 text-xs font-bold transition whitespace-nowrap"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All {markets.length} Cards (Top % → Least)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRescanFocusedCard(focusedMarket.pair, activeTf)}
                    disabled={isRescanningCard}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#00C261]/20 hover:bg-[#00C261] text-[#00C261] hover:text-black border border-[#00C261]/50 text-xs font-black transition whitespace-nowrap"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRescanningCard ? 'animate-spin' : ''}`} />
                    <span>Rescan {focusedMarket.pair}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReanalyseFocusedCardAi(focusedMarket.pair, activeTf)}
                    disabled={isReanalysingCardAi}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl btn-gold text-black text-xs font-black transition whitespace-nowrap"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isReanalysingCardAi ? 'animate-spin' : ''}`} />
                    <span>Reanalyse {focusedMarket.pair} with Super AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => globalLiveStream.requestOpenScannerView('trade_log', focusedMarket.pair)}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition whitespace-nowrap"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Trade Log</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 mr-1">Top % Jump:</span>
                  {markets.slice(0, 4).map((mItem, idx) => (
                    <button
                      key={mItem.pair}
                      type="button"
                      onClick={() => handleOpenPairCard(mItem.pair)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                        mItem.pair === focusedMarket.pair
                          ? 'bg-[#D4AF37] text-black font-black'
                          : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                    >
                      #{idx + 1} {mItem.pair} ({mItem.change24hPct >= 0 ? `+${mItem.change24hPct}%` : `${mItem.change24hPct}%`})
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Single-Market Live Chart & Execution Card */}
              <div className="rounded-3xl p-5 sm:p-6 bg-slate-950 border-2 border-[#D4AF37] shadow-2xl space-y-5">
                {/* Market Title, Rank, Direction, % Move & Timeframe Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black font-black">
                        RANK #{rankNum} BY %
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg font-black ${
                          isBuy
                            ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/50'
                            : 'bg-red-500/20 text-red-300 border border-red-500/50'
                        }`}
                      >
                        {computed.orderType}
                      </span>
                      <span className="text-[#00C261] font-black">{computed.confidence}% AI Confidence</span>
                    </div>

                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        {focusedMarket.pair} ({computed.brokerSymbol})
                      </h2>
                      <span className="text-xl font-black text-[#D4AF37]">@ {focusedMarket.price}</span>
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-black ${
                          pctPositive ? 'text-[#00C261]' : 'text-red-400'
                        }`}
                      >
                        {pctPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {pctPositive ? `+${focusedMarket.change24hPct.toFixed(2)}%` : `${focusedMarket.change24hPct.toFixed(2)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Timeframe Selector Bar + Inspect Other Side (BUY vs SELL) */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      {(['AUTO', 'BUY', 'SELL'] as const).map((sideOpt) => (
                        <button
                          key={sideOpt}
                          type="button"
                          onClick={() =>
                            setInspectedSideByPair((prev) => ({
                              ...prev,
                              [focusedMarket.pair]: sideOpt
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition whitespace-nowrap ${
                            selectedSideMode === sideOpt
                              ? sideOpt === 'BUY'
                                ? 'bg-[#00C261] text-black'
                                : sideOpt === 'SELL'
                                ? 'bg-red-500 text-white'
                                : 'bg-[#D4AF37] text-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {sideOpt === 'AUTO' ? `AI (${aiRecommendedSide})` : `Inspect ${sideOpt}`}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {TIMEFRAME_CHOICES.map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => globalLiveStream.setPairTimeframe(focusedMarket.pair, tf)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            activeTf === tf
                              ? 'bg-[#D4AF37] text-black font-black'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {tf === 'H1' ? '1H ★' : tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* GO-AHEAD ASSURANCE, INSTANT SL/TP COPY & LIVE LOADED ORDER TRACKER */}
                <ActiveMarketOrderPanel
                  mode="full"
                  pair={focusedMarket.pair}
                  direction={computed.direction}
                  timeframe={activeTf}
                  broker={selectedBroker}
                />

                {/* COLOR-CODED MARKET OPEN / COUNTDOWN & LOCKED TREND PROJECTION BANNER */}
                <div
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
                    kenyaTiming.windowStatusCode === 'OPEN'
                      ? 'bg-emerald-950/45 border-[#00C261]/70 text-emerald-100'
                      : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                      ? 'bg-amber-950/45 border-amber-400/70 text-amber-100'
                      : 'bg-red-950/55 border-red-500/80 text-red-100'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Clock className="w-4 h-4 shrink-0" />
                    <strong className="text-white">{kenyaTiming.bannerHeadline}</strong>
                    <span className="text-slate-300">· Timeframe: {activeTf}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap font-black">
                    <span
                      className={
                        computed.trendDirection === 'UPTREND'
                          ? 'text-[#00C261]'
                          : computed.trendDirection === 'DOWNTREND'
                          ? 'text-red-300'
                          : 'text-amber-300'
                      }
                    >
                      {computed.trendProjectionText}
                    </span>
                  </div>
                </div>

                {/* WHAT TO ORDER & NET TRAJECTORY PROFIT EXPECTANCY CARD */}
                <div
                  className={`p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs ${
                    computed.direction === 'BUY'
                      ? 'bg-emerald-950/25 border-[#00C261]/50'
                      : 'bg-red-950/25 border-red-500/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg font-black text-[11px] ${
                          computed.direction === 'BUY'
                            ? 'bg-[#00C261] text-black'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {selectedSideMode === 'AUTO'
                          ? `AI PRIMARY ORDER: PLACE ${computed.direction} (${computed.orderType})`
                          : `CHOSEN SIDE ANALYSIS (${selectedSideMode}): ${computed.orderType}`}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[#D4AF37] font-bold text-[10px]">
                        H1 MACRO LOCK: {computed.h1TrendDirection} · Anti-Whipsaw Active
                      </span>
                    </div>
                    <p className="text-slate-200 font-bold leading-snug">
                      {computed.profitOutlookText}
                    </p>
                    {computed.isExtendedZone && computed.entryTimingWarning && (
                      <p className="text-amber-300 font-bold text-[11px] bg-amber-950/50 border border-amber-500/40 px-2.5 py-1.5 rounded-lg">
                        {computed.entryTimingWarning}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 shrink-0 text-center">
                    <div className="px-3 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/35">
                      <span className="text-[10px] text-emerald-300 block">12H TP2 Net Profit</span>
                      <strong className="text-sm text-[#00C261]">
                        +${computed.netProfitUsd.toFixed(2)} (+{computed.netProfitKes} KES)
                      </strong>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/35">
                      <span className="text-[10px] text-cyan-300 block">48H Extended TP3</span>
                      <strong className="text-sm text-cyan-300">
                        +${computed.netProfit48hUsd.toFixed(2)} (+{computed.netProfit48hKes} KES)
                      </strong>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-slate-950/90 border border-[#D4AF37]/35">
                      <span className="text-[10px] text-[#D4AF37] block">
                        {computed.lotSize.toFixed(2)} Lot Risk ({riskConfig.riskPct}%)
                      </span>
                      <strong className="text-sm text-[#D4AF37]">
                        ${computed.actualRiskUsd.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE LIVE CANDLESTICK CHART */}
                <LiveInteractiveCandleChart
                  pair={focusedMarket.pair}
                  timeframe={activeTf}
                  candles={focusedMarket.candles || []}
                  livePrice={focusedMarket.price}
                  ema20={focusedMarket.ema20}
                  ema50={focusedMarket.ema50}
                  entryPrice={displayOrder ? displayOrder.entryPrice : computed.entryPrice}
                  stopLoss={displayOrder ? displayOrder.stopLoss : computed.stopLoss}
                  tp1={displayOrder ? displayOrder.tp1 : computed.tp1}
                  tp2={displayOrder ? displayOrder.tp2 : computed.tp2}
                  advisoryEntryPrice={computed.advisoryEntryPrice}
                  direction={displayOrder ? displayOrder.direction : computed.direction}
                  change24hPct={focusedMarket.change24hPct}
                  lotSize={displayOrder ? displayOrder.lotSize : computed.lotSize}
                  riskUsd={computed.actualRiskUsd}
                  isLockedToCustom={Boolean(lockedPairs[focusedMarket.pair])}
                  onCandlePriceChange={(newPrice) =>
                    globalLiveStream.setCustomCandlePrice(focusedMarket.pair, newPrice, activeTf)
                  }
                  onResetToLiveStream={() => globalLiveStream.unlockPairToLiveStream(focusedMarket.pair)}
                />

                {/* DYNAMIC POSITION SIZE & SL/TP RISK CALCULATOR */}
                <DynamicPositionSizeCalculator
                  pair={focusedMarket.pair}
                  computed={computed}
                  lockedOrder={displayOrder}
                />

                {/* 5-CARD AUTO-SYNCED EXECUTION NUMBERS ROW WITH DIRECT 1-CLICK SL / TP COPY */}
                {(() => {
                  const lockedOrder = displayOrder;
                  const shownEntry = lockedOrder ? lockedOrder.entryPrice : computed.entryPrice;
                  const shownSl = lockedOrder ? lockedOrder.stopLoss : computed.stopLoss;
                  const shownTp1 = lockedOrder ? lockedOrder.tp1 : computed.tp1;
                  const shownTp2 = lockedOrder ? lockedOrder.tp2 : computed.tp2;
                  const isHighWinRateSetup = computed.alignedFactorsCount >= 6 && !computed.isExtendedZone;

                  return (
                    <div className="space-y-3">
                      {/* Institutional Win-Rate Gate & Quick Full Ticket Copy Bar */}
                      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-3 py-1 rounded-lg font-black text-xs flex items-center gap-1.5 ${
                              isHighWinRateSetup
                                ? 'bg-[#00C261] text-black'
                                : 'bg-[#D4AF37] text-black'
                            }`}
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>
                              {isHighWinRateSetup
                                ? `ALIGNED 1H+M15 SETUP (${computed.alignedFactorsCount}/${computed.totalFactorsCount} FACTORS)`
                                : 'SELECTIVE SETUP (WAIT CONFIRMATION)'}
                            </span>
                          </span>
                          <span className="text-cyan-300 font-bold">
                            {computed.alignedFactorsCount}/8 Factors Aligned
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span>Sub-Second MT4/MT5 Tick Sync</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const fullTicket = `${computed.brokerSymbol} ${computed.orderType} | Price: ${shownEntry} | SL: ${shownSl} | TP1: ${shownTp1} | TP2: ${shownTp2} | Vol: ${computed.lotSize.toFixed(2)} Lots ($${computed.actualRiskUsd.toFixed(2)} Risk) | Broker: ${selectedBroker.toUpperCase()}`;
                            handleQuickCopyValue(fullTicket, `full-ticket-${focusedMarket.pair}`);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 transition whitespace-nowrap shadow-md self-start md:self-auto"
                        >
                          {copiedCardPair === `full-ticket-${focusedMarket.pair}` ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {copiedCardPair === `full-ticket-${focusedMarket.pair}`
                              ? 'Copied Full Ticket ✓'
                              : 'Copy Complete MT4/MT5 Order'}
                          </span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-1.5">
                        <div>
                          <span className="text-[10px] text-slate-400 block">
                            {lockedOrder ? 'Order Entry' : 'Live Entry'}
                          </span>
                          <strong className="text-base text-white">{shownEntry}</strong>
                          <span className="text-[10px] text-[#00C261] block">
                            {lockedOrder ? `Locked (${lockedOrder.direction})` : `${computed.lotSize.toFixed(2)} Lots Auto-Synced`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCopyValue(shownEntry, `focus-entry-${focusedMarket.pair}`)}
                          className="w-full py-1 px-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition"
                        >
                          {copiedCardPair === `focus-entry-${focusedMarket.pair}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3 text-[#D4AF37]" />
                          )}
                          <span>
                            {copiedCardPair === `focus-entry-${focusedMarket.pair}` ? 'Entry Copied ✓' : 'Copy Entry'}
                          </span>
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-red-950/35 border border-red-500/40 flex flex-col justify-between gap-1.5">
                        <div>
                          <span className="text-[10px] text-red-300 block">
                            {lockedOrder ? 'Protected SL' : `Stop Loss (-${computed.slPips}p)`}
                          </span>
                          <strong className="text-base text-red-400">{shownSl}</strong>
                          <span className="text-[10px] text-red-300 block">
                            {lockedOrder
                              ? `SL Updates: ${lockedOrder.slUpdatesCount}`
                              : `$${computed.actualRiskUsd.toFixed(2)} Max Risk (${computed.lotSize.toFixed(2)} Lot)`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCopyValue(shownSl, `focus-sl-${focusedMarket.pair}`)}
                          className="w-full py-1 px-2 rounded-lg bg-slate-950 hover:bg-red-900/60 text-red-200 border border-red-500/40 text-[10px] font-black flex items-center justify-center gap-1 transition"
                        >
                          {copiedCardPair === `focus-sl-${focusedMarket.pair}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>
                            {copiedCardPair === `focus-sl-${focusedMarket.pair}` ? 'SL Copied ✓' : 'Copy SL'}
                          </span>
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-cyan-950/35 border border-cyan-500/40 flex flex-col justify-between gap-1.5">
                        <div>
                          <span className="text-[10px] text-cyan-300 block">TP1 (50% Scale-Out)</span>
                          <strong className="text-base text-cyan-300">{shownTp1}</strong>
                          <span className="text-[10px] text-slate-400 block">Move SL to Breakeven</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCopyValue(shownTp1, `focus-tp1-${focusedMarket.pair}`)}
                          className="w-full py-1 px-2 rounded-lg bg-slate-950 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/40 text-[10px] font-bold flex items-center justify-center gap-1 transition"
                        >
                          {copiedCardPair === `focus-tp1-${focusedMarket.pair}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>
                            {copiedCardPair === `focus-tp1-${focusedMarket.pair}` ? 'TP1 Copied ✓' : 'Copy TP1'}
                          </span>
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-950/35 border border-emerald-500/40 flex flex-col justify-between gap-1.5">
                        <div>
                          <span className="text-[10px] text-emerald-300 block">
                            {lockedOrder ? 'Active TP2 Target' : `Final TP2 (+${computed.tpPips}p)`}
                          </span>
                          <strong className="text-base text-[#00C261]">{shownTp2}</strong>
                          <span className="text-[10px] text-emerald-300 block">R:R {computed.riskReward}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCopyValue(shownTp2, `focus-tp2-${focusedMarket.pair}`)}
                          className="w-full py-1 px-2 rounded-lg bg-slate-950 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 text-[10px] font-black flex items-center justify-center gap-1 transition"
                        >
                          {copiedCardPair === `focus-tp2-${focusedMarket.pair}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>
                            {copiedCardPair === `focus-tp2-${focusedMarket.pair}` ? 'TP2 Copied ✓' : 'Copy TP2'}
                          </span>
                        </button>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                          kenyaTiming.windowStatusCode === 'OPEN'
                            ? 'bg-emerald-950/30 border-[#00C261]/50'
                            : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                            ? 'bg-amber-950/30 border-amber-400/50'
                            : 'bg-red-950/30 border-red-500/50'
                        }`}
                      >
                        <span
                          className={`text-[10px] block font-bold ${
                            kenyaTiming.windowStatusCode === 'OPEN'
                              ? 'text-[#00C261]'
                              : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                              ? 'text-amber-300'
                              : 'text-red-300'
                          }`}
                        >
                          {kenyaTiming.windowStatusCode === 'OPEN'
                            ? 'MARKET OPEN · CLOSES IN'
                            : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                            ? 'TO OPEN · OPENS IN'
                            : 'CLOSED · OPENS IN'}
                        </span>
                        <strong className="text-sm text-white block">{kenyaTiming.countdownFormatted}</strong>
                        <span className="text-[10px] text-slate-300 block truncate">{kenyaTiming.currentWindowName}</span>
                      </div>
                    </div>

                    {/* ADVANCED ENTRY CONFIRMATION & TRAJECTORY SUSTAINABILITY STATE CONTROLLER */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <EntryConfirmationController
                        pair={focusedMarket.pair}
                        computed={computed}
                        kenyaTiming={kenyaTiming}
                        livePrice={focusedMarket.price}
                        timeframe={activeTf}
                        lockedOrder={loadedOrder}
                        showSavedOrder={showSavedOrder}
                        onToggleSavedOrder={() =>
                          setViewSavedOrderByPair((prev) => ({
                            ...prev,
                            [focusedMarket.pair]: !showSavedOrder
                          }))
                        }
                        ema20={focusedMarket.ema20}
                        ema50={focusedMarket.ema50}
                        rsi={focusedMarket.rsi}
                        variant="focused"
                      />
                    </div>
                    </div>
                  );
                })()}

                {/* REAL-TIME SUPER AI LIVE TACTICAL NOTES PANEL */}
                {(() => {
                  const aiNote = superAiNotes[focusedMarket.pair];
                  return (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-[#D4AF37]/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                          <Sparkles className="w-4 h-4 shrink-0" />
                          <span>
                            {aiNote?.headline || `Super AI Live Note · ${focusedMarket.pair} (${activeTf})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>
                            {aiNote
                              ? `${aiNote.source === 'gemini-4-hydrogen' || aiNote.source === 'gemini-3.8-flash' ? 'Super AI Live' : 'Quant Stream'} · ${aiNote.syncedAt}`
                              : `Synced · ${lastScannedTime}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleReanalyseFocusedCardAi(focusedMarket.pair, activeTf)}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 font-bold transition whitespace-nowrap"
                          >
                            Refresh AI Note
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {aiNote?.note || focusedMarket.projection}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 pt-1">
                        <span>
                          Invalidation:{' '}
                          <strong className="text-red-300">
                            {aiNote?.invalidationNote || `Close beyond SL ${computed.stopLoss}`}
                          </strong>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Catalyst Watch:{' '}
                          <strong className="text-cyan-300">
                            {aiNote?.catalystWatch || `${kenyaTiming.currentWindowName} · DXY ${macroContext.dxyPressurePct >= 0 ? `+${macroContext.dxyPressurePct}%` : `${macroContext.dxyPressurePct}%`}`}
                          </strong>
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Opposite Side Quick Comparison + Human Co-Pilot Verification */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Opposite Side Reference ({oppositeSide} BY MARKET):
                      </span>
                      <span className="text-slate-200 font-bold">
                        Entry {oppositeComputed.entryPrice} · SL{' '}
                        <strong className="text-red-400">{oppositeComputed.stopLoss}</strong> · TP2{' '}
                        <strong className="text-[#00C261]">{oppositeComputed.tp2}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setInspectedSideByPair((prev) => ({
                          ...prev,
                          [focusedMarket.pair]: oppositeSide
                        }))
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 text-[11px] font-black shrink-0 transition whitespace-nowrap"
                    >
                      Switch to {oppositeSide}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0 mt-0.5" />
                    <span className="text-slate-200 leading-snug">{computed.humanCheckNote}</span>
                  </div>
                </div>

                {/* Multi-Horizon Longer Institutional Trajectory + Technical Indicators */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                  <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-900/75 border border-[#D4AF37]/40 space-y-3">
                    <div className="flex items-center justify-between text-[#D4AF37] font-bold flex-wrap gap-1">
                      <span className="flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        <span>Longer 1H–48H {computed.direction} Trajectory &amp; Factor Projection</span>
                      </span>
                      <span className="text-emerald-400">Spread ~{computed.brokerSpread}p · 48H TP3: {computed.tp3}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{computed.trajectory}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                      {computed.trajectoryHorizons.map((step) => (
                        <div
                          key={step.horizon}
                          className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1"
                        >
                          <span className="text-[10px] text-[#D4AF37] font-black block">{step.horizon}</span>
                          <div className="text-sm font-black text-white">
                            @ {step.targetPrice}{' '}
                            <span className="text-[#00C261] text-xs">
                              ({isBuy ? `+${step.targetPips}p` : `-${step.targetPips}p`})
                            </span>
                          </div>
                          <div className="text-[10px] text-cyan-300 font-bold">
                            Est. Net: +${step.netProfitUsd.toFixed(2)} (+{step.netProfitKes} KES)
                          </div>
                          <p className="text-[10px] text-slate-300 leading-snug">{step.driverSummary}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-cyan-300">
                      {kenyaTiming.statusLabel}: {kenyaTiming.reasonText}
                    </p>
                  </div>

                  <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 grid grid-cols-2 gap-2.5 content-start">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">20 EMA (Cyan)</span>
                      <strong className="text-cyan-300">{focusedMarket.ema20}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">50 EMA (Amber)</span>
                      <strong className="text-amber-300">{focusedMarket.ema50}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">RSI (14) Momentum</span>
                      <strong className="text-white">{focusedMarket.rsi}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">H1 Macro Structure</span>
                      <strong className="text-[#D4AF37]">{computed.h1TrendDirection}</strong>
                    </div>
                  </div>
                </div>

                {/* ALL-FACTOR INSTITUTIONAL BUY / SELL JUDGMENT MATRIX (6 Factors) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-[#D4AF37]/40 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] font-black uppercase tracking-wider">
                        All-Factor AI Judgment Scorecard ({computed.alignedFactorsCount}/{computed.totalFactorsCount} Confirmed · {computed.orderType})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-black">
                      <span className="text-[#00C261]">BULL: {computed.bullScorePct}%</span>
                      <span className="text-slate-600">vs</span>
                      <span className="text-red-400">BEAR: {computed.bearScorePct}%</span>
                      <span className="text-slate-400">· DXY {macroContext.dxyPressurePct >= 0 ? `+${macroContext.dxyPressurePct}%` : `${macroContext.dxyPressurePct}%`}</span>
                    </div>
                  </div>

                  {/* Visual Bull vs Bear Weight Bar */}
                  <div className="w-full h-2.5 rounded-full bg-red-950/70 overflow-hidden flex border border-slate-800">
                    <div
                      className="h-full bg-[#00C261] transition-all duration-300"
                      style={{ width: `${computed.bullScorePct}%` }}
                    />
                    <div
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${computed.bearScorePct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
                    {computed.factorVerdicts.map((fv) => (
                      <div
                        key={fv.name}
                        className={`p-3 rounded-xl border space-y-1 ${
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

                {/* Auto-Synced EA Script */}
                <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                      <Bot className="w-4 h-4" />
                      <span>Live Auto-Synced EA Parameters ({focusedMarket.pair} [{activeTf}])</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(eaMqlCode);
                        setCopiedEa(true);
                        setTimeout(() => setCopiedEa(false), 2000);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      {copiedEa ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEa ? 'EA Copied!' : 'Copy EA Config'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/70 border border-slate-800/80 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                    {eaMqlCode}
                  </pre>
                </div>

                {/* Bottom Independent Card Controls + Return to All 8 Cards */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleRescanFocusedCard(focusedMarket.pair, activeTf)}
                      disabled={isRescanningCard}
                      className="px-4 py-2.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRescanningCard ? 'animate-spin' : ''}`} />
                      <span>Rescan {focusedMarket.pair}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReanalyseFocusedCardAi(focusedMarket.pair, activeTf)}
                      disabled={isReanalysingCardAi}
                      className="px-4 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isReanalysingCardAi ? 'animate-spin' : ''}`} />
                      <span>Reanalyse with Super AI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectMarketForAnalysis({ ...focusedMarket, recommendedTf: activeTf }, 'deep_ai')
                      }
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Open Full Order Ticket</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenTradingViewForPair(focusedMarket.pair, activeTf, focusedMarket.price)
                      }
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>External TradingView</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleClosePairCard}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 font-black text-xs flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All {markets.length} Cards (Top % → Least)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        /* =========================================================================
           VIEW B: UNCONGESTED 10 INDEPENDENT CLICKABLE RESULT CARDS
           Sorted strictly from Top % (#1) down to Least % (#10)!
           Clicking any card opens that card's dedicated interactive chart & AI view.
           ========================================================================= */
        <div className="space-y-5">
          {/* LIVE LOADED ORDERS STRIP (SYNCS 1-FOR-1 WITH BROKERS PAGE) */}
          <ActiveMarketOrderPanel
            mode="summary_banner"
            broker={selectedBroker}
            onInspectPairCard={(targetPair) => handleOpenPairCard(targetPair)}
          />

          {/* #1 Live Top % Leader Quick Strip */}
          {topLeader && (() => {
            const topSwings = computeCandleSwingLevels(topLeader.candles);
            const topComputed = computeRealChartTradeParams({
              targetPair: topLeader.pair,
              targetTf: customTfs[topLeader.pair] || topLeader.recommendedTf,
              targetBroker: selectedBroker,
              price: topLeader.price,
              keyLevel: topLeader.keyLevel,
              ema20: topLeader.ema20,
              ema50: topLeader.ema50,
              rsi: topLeader.rsi,
              atrPips: topLeader.atrPips,
              swingLow: topSwings.swingLow,
              swingHigh: topSwings.swingHigh,
              macro: macroContext,
              h1TrendDirection: topLeader.h1TrendDirection,
              riskConfig
            });
            const topPctPos = topLeader.change24hPct >= 0;
            const rawTopLoadedOrder = activeOrders[topLeader.pair];
            const topOrderMetrics = rawTopLoadedOrder
              ? computeLiveOrderMetrics(rawTopLoadedOrder, topLeader.price, topLeader.atrPips)
              : null;
            const topLoadedOrder =
              rawTopLoadedOrder &&
              !topOrderMetrics?.hitTp2 &&
              !topOrderMetrics?.hitSl &&
              Math.abs(rawTopLoadedOrder.entryPrice - topLeader.price) / Math.max(0.0001, topLeader.price) <= 0.015 &&
              rawTopLoadedOrder.direction === topComputed.direction
                ? rawTopLoadedOrder
                : null;

            return (
              <div
                onClick={() => handleOpenPairCard(topLeader.pair)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenPairCard(topLeader.pair);
                  }
                }}
                className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0E1629] to-slate-900 border border-[#D4AF37] cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono tabular-nums transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black font-black flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>#1 TOP % MOVER · {topComputed.orderVerdictLabel}</span>
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-black ${
                        topComputed.executionReadiness === 'READY_ENTER'
                          ? 'bg-[#00C261] text-black'
                          : topComputed.executionReadiness === 'WAIT_PULLBACK'
                          ? 'bg-amber-400 text-black'
                          : 'bg-red-500/80 text-white'
                      }`}
                    >
                      {topComputed.executionReadiness === 'READY_ENTER'
                        ? `READY: ${topComputed.direction}`
                        : topComputed.executionReadiness === 'WAIT_PULLBACK'
                        ? `WAIT PULLBACK (${topComputed.direction})`
                        : topComputed.executionReadiness === 'NO_TRADE_CLOSED'
                        ? 'CLOSED'
                        : 'CHOP · STAND ASIDE'}
                    </span>
                    <span className="text-cyan-300 font-bold">
                      TF: {customTfs[topLeader.pair] || topLeader.recommendedTf} · {topComputed.trendDirection}
                    </span>
                    <span className="text-[#00C261] font-black">{topComputed.confidence}% AI</span>
                  </div>

                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-white">{topLeader.pair}</span>
                    <span className="text-lg font-black text-[#D4AF37]">@ {topLeader.price}</span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-sm font-black ${
                        topPctPos ? 'text-[#00C261]' : 'text-red-400'
                      }`}
                    >
                      {topPctPos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {topPctPos ? `+${topLeader.change24hPct.toFixed(2)}%` : `${topLeader.change24hPct.toFixed(2)}%`}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        topComputed.direction === 'BUY'
                          ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {topComputed.orderType}
                    </span>
                    <span className="text-xs font-black text-emerald-300">
                      Est. Net: +${topComputed.netProfitUsd.toFixed(2)} (+{topComputed.netProfitKes} KES) · {topComputed.riskReward}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
                  <div className="grid grid-cols-3 gap-2.5 text-xs bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Entry</span>
                      <strong className="text-white">{topComputed.entryPrice}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-400 block">SL (-${topComputed.actualRiskUsd.toFixed(2)})</span>
                      <strong className="text-red-300">{topLoadedOrder ? topLoadedOrder.stopLoss : topComputed.stopLoss}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">TP2 (+${topComputed.netProfitUsd.toFixed(2)})</span>
                      <strong className="text-[#00C261]">{topLoadedOrder ? topLoadedOrder.tp2 : topComputed.tp2}</strong>
                    </div>
                  </div>

                  <span className="px-4 py-3 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                    <span>Open Chart &amp; AI Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Asset Class Category Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-bold mr-1">Asset Class:</span>
              {[
                { id: 'ALL', label: `All Markets (${markets.length})` },
                { id: 'CRYPTO', label: '🟢 24/7 Crypto (BTC & ETH - Open Now!)' },
                { id: 'FOREX', label: 'Forex Majors & Crosses' },
                { id: 'INDICES', label: 'Indices (US30 / NAS100 / GER40)' },
                { id: 'COMMODITIES', label: 'Commodities (Gold & Oil)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setAssetCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap shrink-0 ${
                    assetCategory === cat.id
                      ? 'bg-cyan-400 text-black shadow-md font-black'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Showing {filteredMarkets.length} of {markets.length} pairs
            </span>
          </div>

          {/* WEEKEND / MARKET CLOSED STRATEGIC ADVISORY SHIELD */}
          <div className="p-4 rounded-2xl bg-[#120D0A] border border-amber-500/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-black font-black text-[10px]">
                    MARKET CLOSED ADVISORY
                  </span>
                  <strong className="text-white text-sm">
                    Is it advisable to trade when the market is closed? ABSOLUTELY NOT.
                  </strong>
                </div>
                <p className="text-amber-200/90 text-xs leading-relaxed">
                  Forex, Metals (Gold), and Indices close every Friday night and do not reopen until Sunday 23:55 EAT. Placing market orders during closed hours is dangerous: spreads widen 10x–50x, orders will be rejected by MT4/MT5 brokers, and you incur catastrophic Sunday night gap risk.
                </p>
                <div className="flex items-center gap-2 flex-wrap text-[11px] pt-0.5">
                  <span className="text-[#00C261] font-bold">
                    ✓ ACTIVE 24/7 ALTERNATIVE: Trade <strong>BTC/USD</strong> or <strong>ETH/USD</strong>!
                  </span>
                  <span className="text-slate-400">Crypto never closes and retains normal tight spreads right now.</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAssetCategory('CRYPTO')}
              className="px-4 py-2.5 rounded-xl bg-[#00C261] hover:bg-emerald-400 text-black font-black text-xs shrink-0 whitespace-nowrap transition shadow-lg shadow-[#00C261]/20"
            >
              Trade 24/7 Crypto Now 🟢
            </button>
          </div>

          {/* Filter & Ranking Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono text-slate-400 font-bold mr-1">Order / Filter:</span>
              {([
                { id: 'ALL', label: `Top % → Least (#1–#${filteredMarkets.length})` },
                { id: 'GRADE_A', label: 'Grade A+ Edge Only' },
                { id: 'PCT_MOVERS', label: 'Largest |%| Swing' },
                { id: 'BUY', label: 'Bullish (BUY)' },
                { id: 'SELL', label: 'Bearish (SELL)' },
                { id: 'FLIPPED', label: 'Direction Shifts' }
              ] as const).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setFilterBias(mode.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap shrink-0 ${
                    filterBias === mode.id
                      ? 'bg-[#D4AF37] text-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => globalLiveStream.requestOpenScannerView('trade_log')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Trade Log &amp; Broker Orders</span>
            </button>
          </div>

          {/* 10 INDEPENDENT CLICKABLE SUMMARY CARDS (Sorted Top % to Least %) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMarkets.map((m, idx) => {
              const activeTf = customTfs[m.pair] || m.recommendedTf;
              const cardSwings = computeCandleSwingLevels(m.candles);
              const computed = computeRealChartTradeParams({
                targetPair: m.pair,
                targetTf: activeTf,
                targetBroker: selectedBroker,
                price: m.price,
                keyLevel: m.keyLevel,
                ema20: m.ema20,
                ema50: m.ema50,
                rsi: m.rsi,
                atrPips: m.atrPips,
                swingLow: cardSwings.swingLow,
                swingHigh: cardSwings.swingHigh,
                macro: macroContext,
                h1TrendDirection: m.h1TrendDirection,
                riskConfig
              });
              const isBuy = computed.direction === 'BUY';
              const pctPositive = m.change24hPct >= 0;
              const rank = idx + 1;
              const kenyaTiming = evaluatePairKenyaTiming(m.pair);
              const tickUp = m.lastTickDir === 'UP';
              const tickDown = m.lastTickDir === 'DOWN';
              const cardAiNote = superAiNotes[m.pair]?.note;
              const loadedOrder = activeOrders[m.pair];
              const orderMetrics = loadedOrder ? computeLiveOrderMetrics(loadedOrder, m.price, m.atrPips) : null;
              const useOrderLevelsOnCard = Boolean(
                loadedOrder &&
                  !orderMetrics?.hitTp2 &&
                  !orderMetrics?.hitSl &&
                  Math.abs(loadedOrder.entryPrice - m.price) / Math.max(0.0001, m.price) <= 0.015 &&
                  loadedOrder.direction === computed.direction
              );
              const cardSl = useOrderLevelsOnCard ? loadedOrder!.stopLoss : computed.stopLoss;
              const cardTp = useOrderLevelsOnCard ? loadedOrder!.tp2 : computed.tp2;

              return (
                <div
                  key={m.pair}
                  onClick={() => handleOpenPairCard(m.pair)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenPairCard(m.pair);
                    }
                  }}
                  className={`rounded-2xl p-4 sm:p-5 bg-slate-950 border transition-all cursor-pointer flex flex-col justify-between space-y-3 font-mono tabular-nums hover:-translate-y-0.5 ${
                    loadedOrder
                      ? 'border-[#00C261] shadow-[0_0_20px_rgba(0,194,97,0.16)]'
                      : rank === 1
                      ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.12)]'
                      : 'border-slate-800 hover:border-[#D4AF37]/70'
                  }`}
                >
                  {/* Top Row: Rank + Trend & BUY/SELL + Go-Ahead Badge */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className="text-[#D4AF37] font-black">
                        #{rank} · {activeTf} · {computed.confidence}% AI
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-black ${
                          computed.executionReadiness === 'READY_ENTER'
                            ? isBuy
                              ? 'bg-[#00C261]/20 text-[#00C261]'
                              : 'bg-red-500/20 text-red-300'
                            : computed.executionReadiness === 'WAIT_PULLBACK'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {computed.executionReadiness === 'READY_ENTER'
                          ? `READY: ${computed.direction}`
                          : computed.executionReadiness === 'WAIT_PULLBACK'
                          ? 'WAIT PULLBACK'
                          : computed.executionReadiness === 'NO_TRADE_CLOSED'
                          ? 'CLOSED'
                          : 'STAND ASIDE'}
                      </span>
                    </div>

                    {/* Market Open vs. Weekend Closed Status Badge */}
                    {kenyaTiming.windowStatusCode === 'CLOSED_WAIT' ? (
                      <div className="flex items-center justify-between gap-1 text-[10px] bg-red-950/70 border border-red-500/60 px-2.5 py-1 rounded-xl text-red-200">
                        <span className="font-bold flex items-center gap-1.5 text-red-400">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          <span>MARKET CLOSED</span>
                        </span>
                        <span className="text-amber-300 font-mono font-bold">Opens in {kenyaTiming.countdownFormatted}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1 text-[10px] bg-emerald-950/60 border border-[#00C261]/50 px-2.5 py-1 rounded-xl text-emerald-200">
                        <span className="font-bold flex items-center gap-1.5 text-[#00C261]">
                          <span className="w-2 h-2 rounded-full bg-[#00C261] animate-pulse" />
                          <span>{m.pair.includes('BTC') || m.pair.includes('ETH') ? '24/7 CRYPTO LIVE' : 'SESSION BELL OPEN'}</span>
                        </span>
                        <span className="text-[#00C261] font-mono font-bold">Normal Spread ✓</span>
                      </div>
                    )}

                    {/* Pair Name & Promoted Live % */}
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-lg font-black text-white">{m.pair}</span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-sm font-black ${
                          pctPositive ? 'text-[#00C261]' : 'text-red-400'
                        }`}
                      >
                        {pctPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{pctPositive ? `+${m.change24hPct.toFixed(2)}%` : `${m.change24hPct.toFixed(2)}%`}</span>
                      </span>
                    </div>

                    <div className="text-sm font-black text-white flex items-center justify-between gap-1">
                      <span>
                        Candle:{' '}
                        <span
                          className={
                            tickUp
                              ? 'text-[#00C261]'
                              : tickDown
                              ? 'text-red-400'
                              : 'text-[#D4AF37]'
                          }
                        >
                          {tickUp ? '▲ ' : tickDown ? '▼ ' : ''}@ {m.price}
                        </span>
                      </span>
                      {lockedPairs[m.pair] && (
                        <span className="text-[10px] text-amber-300 font-bold">Custom</span>
                      )}
                    </div>

                    {/* 4-Timeframe Alignment Matrix & Institutional Tier */}
                    {computed.mtfAlignment && (
                      <div className="flex items-center justify-between gap-1 text-[10px] bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-slate-800">
                        <span
                          className="font-black text-[10px] truncate"
                          style={{ color: computed.mtfAlignment.tierColor }}
                        >
                          {computed.mtfAlignment.tierGrade}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-[9px] shrink-0">
                          <span className={`px-1 rounded ${computed.mtfAlignment.m5 === 'BULLISH' ? 'text-[#00C261] bg-emerald-950/60' : 'text-red-400 bg-red-950/60'}`}>M5</span>
                          <span className={`px-1 rounded ${computed.mtfAlignment.m15 === 'BULLISH' ? 'text-[#00C261] bg-emerald-950/60' : 'text-red-400 bg-red-950/60'}`}>M15</span>
                          <span className={`px-1 rounded font-bold border border-[#D4AF37]/50 ${computed.mtfAlignment.h1 === 'BULLISH' ? 'text-[#00C261] bg-emerald-950/80' : 'text-red-400 bg-red-950/80'}`}>1H★</span>
                          <span className={`px-1 rounded ${computed.mtfAlignment.h4 === 'BULLISH' ? 'text-[#00C261] bg-emerald-950/60' : 'text-red-400 bg-red-950/60'}`}>H4</span>
                        </div>
                      </div>
                    )}

                    {/* 1H Advisory Pullback Entry vs Market Execution */}
                    {computed.advisoryDiscountPips && computed.advisoryDiscountPips > 0 ? (
                      <div className="px-2.5 py-1.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-[10px] space-y-0.5">
                        <div className="flex items-center justify-between text-amber-300 font-bold">
                          <span>1H Advisory Entry:</span>
                          <strong className="text-white">@ {computed.advisoryEntryPrice}</strong>
                        </div>
                        <span className="text-slate-400 block text-[9px]">
                          Wait pullback to 20 EMA (saves {computed.advisoryDiscountPips}p drawdown)
                        </span>
                      </div>
                    ) : (
                      <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] flex items-center justify-between text-slate-300">
                        <span>1H Entry:</span>
                        <strong className="text-[#00C261]">@ {m.price} (Pullback Confirmed)</strong>
                      </div>
                    )}
                  </div>

                  {/* Active Loaded Market Order Progress Strip (When Ticked / Loaded on This Card) */}
                  {loadedOrder && orderMetrics && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-xl bg-emerald-950/45 border border-[#00C261]/60 space-y-1.5 text-[10px]"
                    >
                      <div className="flex items-center justify-between gap-1 font-black">
                        <span className="text-[#00C261] flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 shrink-0" />
                          <span>{loadedOrder.direction} LOADED @ {loadedOrder.entryPrice}</span>
                        </span>
                        <span className={orderMetrics.netProfitUsd >= 0 ? 'text-[#00C261]' : 'text-red-300'}>
                          {orderMetrics.floatingPips >= 0 ? `+${orderMetrics.floatingPips}p` : `${orderMetrics.floatingPips}p`} ·{' '}
                          {orderMetrics.netProfitUsd >= 0
                            ? `+$${orderMetrics.netProfitUsd.toFixed(2)}`
                            : `-$${Math.abs(orderMetrics.netProfitUsd).toFixed(2)}`}
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-[#00C261] transition-all duration-300"
                          style={{ width: `${orderMetrics.slToTpProgressPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <span className="text-slate-300">Progress: {orderMetrics.slToTpProgressPct}%</span>
                        <button
                          type="button"
                          onClick={() => globalLiveStream.applySmartSlTpAction(m.pair, 'LOCK_PROFIT_55')}
                          className="px-2 py-0.5 rounded bg-[#00C261] text-black font-black text-[9px] hover:bg-[#00dc6e] transition"
                        >
                          +Lock Profit SL ({orderMetrics.suggestedLockProfitSl})
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clean SL & TP Summary Box with Direct 1-Click Copy SL & Copy TP Buttons */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between gap-1 bg-slate-950/70 px-2 py-1.5 rounded-lg border border-red-500/25">
                        <div className="min-w-0">
                          <span className="text-[9px] text-red-400 block">
                            {loadedOrder ? 'Active SL' : `SL (-${computed.slPips}p)`}
                          </span>
                          <strong className="text-red-300 text-xs truncate block">{cardSl}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCopyValue(cardSl, `card-sl-${m.pair}`)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-red-950 text-red-300 border border-slate-700 shrink-0"
                          title={`Copy Stop Loss ${cardSl}`}
                        >
                          {copiedCardPair === `card-sl-${m.pair}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-1 bg-slate-950/70 px-2 py-1.5 rounded-lg border border-emerald-500/25">
                        <div className="min-w-0">
                          <span className="text-[9px] text-emerald-400 block">
                            {loadedOrder ? 'Active TP' : `TP (+${computed.tpPips}p)`}
                          </span>
                          <strong className="text-[#00C261] text-xs truncate block">{cardTp}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCopyValue(cardTp, `card-tp-${m.pair}`)}
                          className="p-1.5 rounded bg-slate-900 hover:bg-emerald-950 text-[#00C261] border border-slate-700 shrink-0"
                          title={`Copy Take Profit ${cardTp}`}
                        >
                          {copiedCardPair === `card-tp-${m.pair}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* ADVANCED ENTRY CONFIRMATION CONTROLLER (Compact Mode) */}
                    <EntryConfirmationController
                      pair={m.pair}
                      computed={computed}
                      kenyaTiming={kenyaTiming}
                      livePrice={m.price}
                      timeframe={m.recommendedTf}
                      lockedOrder={loadedOrder}
                      variant="compact"
                      onInspectDetails={() => {
                        setSelectedPair(m.pair);
                      }}
                    />

                    <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">
                        {computed.alignedFactorsCount}/{computed.totalFactorsCount} Factors ✓
                      </span>
                      <span className="text-[#00C261] font-black">
                        +${computed.netProfitUsd.toFixed(2)} ({computed.riskReward})
                      </span>
                    </div>
                  </div>

                  {/* Real-Time AI Verdict Snippet */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {cardAiNote || computed.humanCheckNote}
                  </p>

                  {/* Card Footer: Load Market Order Quick Action OR Inspect Card */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800/80 text-[10px]">
                    <span
                      className={`inline-flex items-center gap-1 font-bold truncate ${
                        kenyaTiming.windowStatusCode === 'OPEN'
                          ? 'text-[#00C261]'
                          : kenyaTiming.windowStatusCode === 'OPENING_SOON'
                          ? 'text-amber-300'
                          : 'text-red-300'
                      }`}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="truncate">{kenyaTiming.windowBadgeShort}</span>
                    </span>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {!loadedOrder && (
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickLoadCardOrder(m.pair, computed.direction, activeTf)
                          }
                          className={`px-2 py-1.5 rounded-lg font-black text-[10px] transition whitespace-nowrap ${
                            isBuy
                              ? 'bg-[#00C261] hover:bg-[#00dc6e] text-black'
                              : 'bg-red-600 hover:bg-red-500 text-white'
                          }`}
                          title={`Notify PivotFx: Placed ${computed.direction} Order With My Broker`}
                        >
                          Placed {computed.direction}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenPairCard(m.pair)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-black text-[10px] flex items-center gap-1 transition whitespace-nowrap"
                      >
                        <span>{loadedOrder ? 'Manage Order' : 'Inspect'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INSTITUTIONAL PROP DESK MODALS */}
      <ConfluenceMatrixModal
        isOpen={showConfluenceModal}
        onClose={() => setShowConfluenceModal(false)}
        items={confluenceItems}
        selectedPair={selectedPair || 'GBP/USD'}
        onSelectPair={(p) => {
          setSelectedPair(p as CurrencyPair);
          handleOpenPairCard(p as CurrencyPair);
        }}
      />

      <PropDrawdownGuardModal
        isOpen={showDrawdownModal}
        onClose={() => setShowDrawdownModal(false)}
        config={propAccount}
        onUpdateConfig={(newCfg) => setPropAccount(newCfg)}
      />

      <NewsGuardModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        selectedPair={selectedPair || 'GBP/USD'}
      />

      <PropTradingJournalModal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
        trades={journalTrades}
        onRefreshTrades={(updated) => setJournalTrades(updated)}
      />
    </div>
  );
};
