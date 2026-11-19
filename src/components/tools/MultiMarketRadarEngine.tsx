import React, { useState, useEffect } from 'react';
import {
  CurrencyPair,
  Timeframe,
  BrokerId,
  EaSignalLedgerEntry,
  EaLedgerStats,
  PendingLimitOrder,
  EaCircuitBreakerState
} from '../../types';
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
  evaluateMultiTimeframeAlignment,
  evaluatePortfolioRiskExposure,
  evaluateOrderEntryMoment,
  evaluateOrderTrendSustainability,
  EntryMomentVerdict,
  TrendSustainabilityVerdict,
  RiskManagementConfig,
  DeepVerifyResult,
  positionRiskStore,
  getTradingViewSymbol,
  getTradingViewExternalUrl,
  resolveMarketDirection
} from '../../utils/liveMarketEngine';
import { EntryConfirmationController } from './EntryConfirmationController';
import { LiveInteractiveCandleChart } from './LiveInteractiveCandleChart';
import { ActiveMarketOrderPanel } from './ActiveMarketOrderPanel';
import { DynamicPositionSizeCalculator } from './DynamicPositionSizeCalculator';
import { DeepScanVerificationPanel } from './DeepScanVerificationPanel';
import { CurrencyStrengthMatrixStrip } from './CurrencyStrengthMatrixStrip';
import { PriceAlertManagerBar } from './PriceAlertManagerBar';
import { ConfluenceMatrixModal } from '../prop/ConfluenceMatrixModal';
import { PropDrawdownGuardModal } from '../prop/PropDrawdownGuardModal';
import { NewsGuardModal } from '../prop/NewsGuardModal';
import { PropTradingJournalModal } from '../prop/PropTradingJournalModal';
import { audioAlertEngine } from '../../utils/audioAlerts';
import {
  getStoredJournalTrades,
  getStoredPropAccount,
} from '../../utils/propDeskStorage';
import { JournalTrade, PropAccountConfig, ConfluenceMatrixItem } from '../../types/propDesk';
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
  Radio,
  ExternalLink,
  Search,
  LayoutGrid,
  Table2,
  Bell
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
    'auto_1s' | 'scan_all' | 'rescan' | 'deep_ai' | 'h1_trend_lock' | 'precision_ai'
  >(() => globalLiveStream.getState().lastScanMode);
  const [superAiAuto, setSuperAiAuto] = useState<boolean>(
    () => globalLiveStream.getState().superAiAutoEnabled
  );
  const [superAiNotes, setSuperAiNotes] = useState(
    () => globalLiveStream.getState().superAiNotes
  );
  const [deepAudits, setDeepAudits] = useState<Partial<Record<CurrencyPair, DeepVerifyResult>>>(
    () => globalLiveStream.getState().deepAudits
  );
  const [isDeepVerifyingPair, setIsDeepVerifyingPair] = useState<Partial<Record<CurrencyPair, boolean>>>(
    () => globalLiveStream.getState().isDeepVerifyingPair
  );
  const [dailyMacroDirective, setDailyMacroDirective] = useState<DailyMacroAiDirective>(
    () => globalLiveStream.getState().dailyMacroDirective
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isRescanningCard, setIsRescanningCard] = useState(false);
  const [isReanalysingCardAi, setIsReanalysingCardAi] = useState(false);
  const [filterBias, setFilterBias] = useState<
    'ALL' | 'PRECISION' | 'READY' | 'GRADE_A' | 'PCT_MOVERS' | 'BUY' | 'SELL' | 'FLIPPED'
  >('ALL');
  const [assetCategory, setAssetCategory] = useState<
    'ALL' | 'CRYPTO' | 'FOREX' | 'INDICES' | 'COMMODITIES'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [radarViewMode, setRadarViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedPair, setSelectedPair] = useState<CurrencyPair | null>(
    () => globalLiveStream.getState().selectedPair
  );
  const [activeOrders, setActiveOrders] = useState<Partial<Record<CurrencyPair, ActiveMarketOrder>>>(
    () => globalLiveStream.getState().activeOrders
  );
  const [inspectedSideByPair, setInspectedSideByPair] = useState<Partial<Record<CurrencyPair, 'AUTO' | 'BUY' | 'SELL'>>>({});
  const [focusedSubTabByPair, setFocusedSubTabByPair] = useState<
    Partial<Record<CurrencyPair, 'ORDER' | 'DEEP_AI' | 'THESIS' | 'FACTORS' | 'TV_EA'>>
  >({});
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
  const [eaAutoPilot, setEaAutoPilot] = useState<boolean>(() => globalLiveStream.getState().eaAutoPilot);
  const [eaLedger, setEaLedger] = useState<EaSignalLedgerEntry[]>(() => globalLiveStream.getState().eaLedger);
  const [eaLedgerStats, setEaLedgerStats] = useState<EaLedgerStats>(() => globalLiveStream.getState().eaLedgerStats);
  const [pendingLimits, setPendingLimits] = useState<PendingLimitOrder[]>(
    () => globalLiveStream.getState().pendingLimits
  );
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(
    () => globalLiveStream.getState().soundAlertsEnabled
  );
  const [eaCircuitBreaker, setEaCircuitBreaker] = useState<EaCircuitBreakerState>(
    () => globalLiveStream.getState().eaCircuitBreaker
  );
  const [showLedgerDrawer, setShowLedgerDrawer] = useState<boolean>(false);
  const [showChopTier, setShowChopTier] = useState<boolean>(false);
  const [, setEatClockTick] = useState<number>(0);

  useEffect(() => {
    const id = window.setInterval(() => setEatClockTick((t) => (t + 1) % 86400), 1000);
    return () => window.clearInterval(id);
  }, []);

  const handleToggleSound = () => {
    const nextState = audioAlertEngine.toggle();
    globalLiveStream.toggleSoundAlerts(nextState);
    setIsAudioActive(nextState);
    setSoundAlertsEnabled(nextState);
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
      setDeepAudits(streamState.deepAudits);
      setIsDeepVerifyingPair(streamState.isDeepVerifyingPair);
      setDailyMacroDirective(streamState.dailyMacroDirective);
      setSelectedPair(streamState.selectedPair);
      setActiveOrders(streamState.activeOrders);
      setEaAutoPilot(streamState.eaAutoPilot);
      setEaLedger(streamState.eaLedger);
      setEaLedgerStats(streamState.eaLedgerStats);
      setPendingLimits(streamState.pendingLimits);
      setSoundAlertsEnabled(streamState.soundAlertsEnabled);
      setEaCircuitBreaker(streamState.eaCircuitBreaker);
    });
    const unsubRisk = positionRiskStore.subscribe((nextCfg) => setRiskConfig(nextCfg));
    const handlePropTradesUpdated = () => {
      setJournalTrades(getStoredJournalTrades());
    };
    window.addEventListener('pivotfx:prop-trades-updated', handlePropTradesUpdated);
    return () => {
      unsubscribe();
      unsubRisk();
      window.removeEventListener('pivotfx:prop-trades-updated', handlePropTradesUpdated);
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

  // Global Scan All Markets / Rescan / Deep AI / 1H Trend-Lock / Super Precision AI Scan
  const handleRunScan = async (
    mode: 'scan_all' | 'rescan' | 'deep_ai' | 'h1_trend_lock' | 'precision_ai'
  ) => {
    setIsScanning(true);
    setActiveScanMode(mode);
    setFilterBias(mode === 'precision_ai' ? 'PRECISION' : mode === 'h1_trend_lock' ? 'GRADE_A' : 'ALL');
    setSelectedPair(null);
    globalLiveStream.setSelectedPair(null);

    if (mode === 'h1_trend_lock') {
      // Anchor all 15 markets to H1 institutional structure
      markets.forEach((m) => {
        globalLiveStream.setPairTimeframe(m.pair, 'H1');
      });
    }

    const updatedState = await globalLiveStream.triggerScan(
      mode === 'h1_trend_lock' ? 'deep_ai' : mode
    );
    setIsScanning(false);

    const precisionSorted = sortMarketsByTopPercent(updatedState.markets, 'PRECISION');
    const actionablePrecisionLeader = precisionSorted.find(
      (m) => m.executionReadiness === 'READY_ENTER' || m.executionReadiness === 'WAIT_PULLBACK'
    );
    const actionableTopLeader = updatedState.markets.find(
      (m) => m.executionReadiness === 'READY_ENTER' || m.executionReadiness === 'WAIT_PULLBACK'
    );
    const leader =
      mode === 'precision_ai'
        ? actionablePrecisionLeader || precisionSorted[0]
        : actionableTopLeader || updatedState.markets[0];
    const modeLabel =
      mode === 'precision_ai'
        ? 'SUPER PRECISION AI SCAN (LOWEST-DRAWDOWN RANK)'
        : mode === 'h1_trend_lock'
        ? '1H INSTITUTIONAL TREND-LOCK SCAN'
        : mode === 'deep_ai'
        ? `DEEP AI SCAN (ALL ${updatedState.markets.length} MARKETS)`
        : mode === 'rescan'
        ? 'LIVE RESCAN (TOP % → LEAST)'
        : 'SCAN ALL MARKETS';

    if (leader) {
      const dirWord = resolveMarketDirection(leader);
      const isLeaderBlocked =
        leader.executionReadiness === 'NO_TRADE_CHOP' ||
        leader.executionReadiness === 'NO_TRADE_CLOSED';
      const pctStr = leader.change24hPct >= 0 ? `+${leader.change24hPct}%` : `${leader.change24hPct}%`;
      const netUsd = leader.netProfitUsd ?? Number((leader.projectedPips * 0.1).toFixed(2));
      const netKes = leader.netProfitKes ?? Math.round(netUsd * 130);
      const tel = leader.institutionalTelemetry;
      const epInfo =
        leader.advisoryEntryPrice && (leader.advisoryDiscountPips ?? 0) > 0
          ? `Wait Bounce @ ${leader.advisoryEntryPrice} (trims ${leader.advisoryDiscountPips}p DD)`
          : `@ ${leader.price}`;
      setScanBanner(
        isLeaderBlocked
          ? `${modeLabel} (${updatedState.syncedAt}) · STAND ASIDE — All pairs currently ${leader.executionReadiness === 'NO_TRADE_CLOSED' ? 'CLOSED' : 'IN CHOP / COUNTER-TREND NOISE'} · Top mover: ${leader.pair} (${pctStr})`
          : mode === 'precision_ai'
          ? `${modeLabel} (${updatedState.syncedAt}) · #1 Highest Edge: ${leader.pair} ${dirWord} (${tel?.roboticVerdict || leader.executionReadiness} · ${tel?.roboticScore ?? leader.confidence}/100 · ${tel?.estimatedWinProbPct ?? leader.confidence}% WinP · ${tel?.expectedRMultiple ?? '+0.8'}R) · ${epInfo} · SL ${leader.suggestedSL} · TP2 ${leader.suggestedTP2}`
          : mode === 'h1_trend_lock'
          ? `1H TREND-LOCK ACTIVE ✓ · All ${updatedState.markets.length} pairs anchored to 1H 20/50 EMA structure · Top Setup: ${leader.pair} ${dirWord} @ ${leader.price}`
          : `${modeLabel} (${updatedState.syncedAt}) · #1 Top Edge: ${leader.pair} (${pctStr}) · ${leader.trendDirection} · ${dirWord} @ ${leader.price} · Est. Net +$${netUsd.toFixed(2)} (+${netKes} KES) · SL ${leader.suggestedSL} · TP ${leader.suggestedTP2}`
      );
      setTimeout(() => setScanBanner(null), 7000);
    }

    playRadarBeep(
      mode === 'precision_ai'
        ? 1380
        : mode === 'h1_trend_lock'
        ? 1320
        : mode === 'deep_ai'
        ? 1220
        : mode === 'rescan'
        ? 1120
        : 1020
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

  // Independent Single-Card Super AI + Zero-Mistake Deep Structure Reanalysis
  const handleReanalyseFocusedCardAi = async (pairToAnalyse: CurrencyPair, tf: Timeframe) => {
    setIsReanalysingCardAi(true);
    try {
      const sideMode = inspectedSideByPair[pairToAnalyse] || 'AUTO';
      const [note, deepAudit] = await Promise.all([
        globalLiveStream.fetchSuperAiNoteForPair(pairToAnalyse, tf, true),
        globalLiveStream.verifyMarketDeepScan(
          pairToAnalyse,
          tf,
          selectedBroker,
          sideMode === 'AUTO' ? undefined : sideMode
        )
      ]);
      if (deepAudit) {
        setScanBanner(
          `DEEP AUDIT ${pairToAnalyse} [${tf}] · ${deepAudit.deepAuditHeadline} (${deepAudit.passedCount}/${deepAudit.totalChecks} Checks)`
        );
        setTimeout(() => setScanBanner(null), 5500);
      } else if (note) {
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
    const q = searchQuery.trim().toLowerCase();
    const base = markets.filter((m) => {
      // 0. Search query filter
      if (
        q &&
        !m.pair.toLowerCase().includes(q) &&
        !m.symbol.toLowerCase().includes(q) &&
        !(m.recommendedStrategy || '').toLowerCase().includes(q)
      ) {
        return false;
      }

      // 1. Asset class category filter
      if (assetCategory === 'CRYPTO' && m.pair !== 'BTC/USD' && m.pair !== 'ETH/USD') return false;
      if (
        assetCategory === 'FOREX' &&
        !['EUR/USD', 'GBP/USD', 'USD/JPY', 'GBP/JPY', 'USD/CHF', 'EUR/JPY', 'AUD/USD', 'USD/CAD'].includes(m.pair)
      ) return false;
      if (assetCategory === 'INDICES' && !['US30', 'NAS100', 'GER40'].includes(m.pair)) return false;
      if (assetCategory === 'COMMODITIES' && !['XAU/USD', 'USOIL'].includes(m.pair)) return false;

      // 2. Bias / Signal filter
      if (filterBias === 'READY') return m.executionReadiness === 'READY_ENTER';
      if (filterBias === 'BUY') return m.bias === 'STRONG_BUY';
      if (filterBias === 'SELL') return m.bias === 'STRONG_SELL';
      if (filterBias === 'FLIPPED') return Boolean(m.directionFlipped);
      if (filterBias === 'GRADE_A') {
        if (m.bias === 'NEUTRAL_CHOP') return false;
        const resolved = resolveMarketDirection(m);
        return m.h1TrendDirection === (resolved === 'BUY' ? 'UPTREND' : 'DOWNTREND');
      }
      return true;
    });
    if (filterBias === 'PRECISION') {
      return sortMarketsByTopPercent(base, 'PRECISION');
    }
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

  const confluenceItems: ConfluenceMatrixItem[] = markets
    .map((m) => {
      const align =
        m.mtfAlignment ||
        evaluateMultiTimeframeAlignment({
          pair: m.pair,
          price: m.price,
          ema20: m.ema20,
          ema50: m.ema50,
          h1TrendDirection:
            m.h1TrendDirection || (resolveMarketDirection(m) === 'SELL' ? 'DOWNTREND' : 'UPTREND'),
          change24hPct: m.change24hPct,
          macro: macroContext
        });
      const toSignal = (dir: 'BULLISH' | 'BEARISH'): 'BUY' | 'SELL' =>
        dir === 'BULLISH' ? 'BUY' : 'SELL';
      const m5 = toSignal(align.m5);
      const m15 = toSignal(align.m15);
      const h1 = toSignal(align.h1);
      const h4 = toSignal(align.h4);
      const buys = [m5, m15, h1, h4].filter((s) => s === 'BUY').length;
      const sells = 4 - buys;
      const stars = Math.max(buys, sells);
      let bias: ConfluenceMatrixItem['bias'] = 'MIXED';
      if (buys === 4) bias = 'STRONG BUY';
      else if (sells === 4) bias = 'STRONG SELL';
      else if (buys === 3) bias = 'BUY';
      else if (sells === 3) bias = 'SELL';

      return {
        pair: m.pair,
        m5,
        m15,
        h1,
        h4,
        stars,
        bias,
        isInstitutionalLock: stars === 4
      };
    })
    .sort((a, b) => b.stars - a.stars);

  const liveExposureSummary = evaluatePortfolioRiskExposure(activeOrders, riskConfig);
  const openOrdersList = Object.values(activeOrders).filter(
    (o): o is ActiveMarketOrder => Boolean(o)
  );
  const liveFloatingUsd = Number(
    openOrdersList
      .reduce((sum, ord) => {
        const mkt = markets.find((m) => m.pair === ord.pair);
        if (!mkt) return sum;
        return sum + computeLiveOrderMetrics(ord, mkt.price, mkt.atrPips).netProfitUsd;
      }, 0)
      .toFixed(2)
  );

  const topLeader =
    filteredMarkets.find((m) => m.executionReadiness === 'READY_ENTER') ||
    filteredMarkets.find((m) => m.executionReadiness === 'WAIT_PULLBACK') ||
    filteredMarkets[0] ||
    markets[0];
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
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
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
            <Radio className="w-3.5 h-3.5 text-rose-400" />
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

        {/* SCAN CONTROLS: MT5 EA Auto | Super AI Auto | Scan All | Rescan | 1H Trend-Lock | Deep AI */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 w-full xl:w-auto">
          <button
            type="button"
            onClick={() => {
              const nextState = globalLiveStream.toggleEaAutoPilot();
              setScanBanner(
                nextState
                  ? 'MT5 EA AUTO-PILOT ACTIVATED · Qualified READY_ENTER setups auto-stage, SL trails (0.55x ATR / +55% lock), 50% banks at TP1, and TP2/SL hits auto-settle.'
                  : 'MT5 EA AUTO-PILOT PAUSED · Manual confirmation & existing active SL/TP tracking remain active.'
              );
              setTimeout(() => setScanBanner(null), 5500);
            }}
            className={`px-3.5 py-2.5 rounded-xl font-mono font-black text-xs flex items-center gap-1.5 transition whitespace-nowrap shrink-0 border ${
              eaAutoPilot
                ? 'bg-[#00C261] text-black border-[#00C261] shadow-lg shadow-[#00C261]/25'
                : 'bg-slate-900 text-amber-300 hover:text-white border-amber-500/50'
            }`}
            title="Toggle MT5-style autonomous EA Auto-Pilot (auto-stages READY setups, trails SL, 50% TP1 partial bank, closes TP2/SL hits)"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>MT5 EA Auto: {eaAutoPilot ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextSound = globalLiveStream.toggleSoundAlerts();
              if (audioAlertEngine.isEnabled() !== nextSound) {
                audioAlertEngine.toggle();
              }
              setIsAudioActive(nextSound);
              setSoundAlertsEnabled(nextSound);
            }}
            className={`px-3 py-2.5 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap shrink-0 border ${
              soundAlertsEnabled
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
            title="Toggle crisp Web Audio chimes on Limit fills, TP1 partial bank, and price alerts"
          >
            {soundAlertsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Sound: {soundAlertsEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {(() => {
            const armedCount = pendingLimits.filter((l) => l.status === 'PENDING').length;
            return (
              <div className="flex items-center gap-1.5 shrink-0">
                {armedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => globalLiveStream.requestOpenScannerView('trade_log')}
                    className="px-3 py-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/45 font-mono font-black text-xs whitespace-nowrap"
                    title="View armed Sniper BUY/SELL LIMIT orders in Trade Log"
                  >
                    Limits Armed: {armedCount}
                  </button>
                )}
                {eaCircuitBreaker.tripped && (
                  <button
                    type="button"
                    onClick={() => {
                      globalLiveStream.resetEaCircuitBreaker();
                      setScanBanner('EA Circuit Breaker Reset · Protection counter cleared.');
                      setTimeout(() => setScanBanner(null), 4000);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/60 font-mono font-black text-xs whitespace-nowrap"
                    title={eaCircuitBreaker.reason || 'Daily drawdown or loss-streak circuit breaker tripped'}
                  >
                    CB Tripped · Reset
                  </button>
                )}
              </div>
            );
          })()}

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
            onClick={() => handleRunScan('precision_ai')}
            disabled={isScanning}
            title="High-speed Precision AI Scan: filters Pivot walls, climax wicks & toxic spreads, ranks highest win-probability & Sniper Limit setups, and auto-audits Top-2 edges"
            className={`px-4 py-2.5 rounded-xl font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition whitespace-nowrap shrink-0 border ${
              activeScanMode === 'precision_ai'
                ? 'bg-[#00C261] text-black border-[#00C261] shadow-lg shadow-[#00C261]/25'
                : 'bg-emerald-950/70 hover:bg-emerald-900/70 text-[#00C261] border-[#00C261]/60'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isScanning && activeScanMode === 'precision_ai' ? 'animate-spin' : ''}`} />
            <span>Precision AI Scan</span>
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

      {/* 2B. HIGH-IMPACT ECONOMIC NEWS & SPREAD VOLATILITY SHIELD + LIVE PROOF LEDGER STRIP */}
      {(() => {
        const events = getUpcomingEconomicEvents();
        const activeOrImminent = events.find((e) => e.status === 'ACTIVE_NOW' || e.status === 'IMMINENT');
        const nextEvent = events.find((e) => e.status !== 'PASSED') || events[0];

        return (
          <div className="space-y-2.5">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`px-2.5 py-1 rounded-lg font-black text-[10px] flex items-center gap-1.5 ${
                    activeOrImminent
                      ? 'bg-amber-400 text-black'
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

            {/* Verified Live EA Signal Proof Scoreboard */}
            <div className="p-3 rounded-2xl bg-[#090F1E] border border-slate-800 space-y-2.5 text-xs font-mono tabular-nums">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[10px] font-black">
                    AUTO-SCORED SIGNAL PROOF
                  </span>
                  <span className="text-slate-200 font-bold">
                    {eaLedgerStats.total === 0
                      ? 'Waiting for first qualified READY_ENTER bar signal...'
                      : `${eaLedgerStats.wins}W / ${eaLedgerStats.losses}L · ${eaLedgerStats.winRatePct}% Win Rate · Net ${
                          eaLedgerStats.netR >= 0 ? `+${eaLedgerStats.netR}` : eaLedgerStats.netR
                        }R · PF ${eaLedgerStats.profitFactor} · ${eaLedgerStats.open} Open`}
                  </span>
                  {eaAutoPilot && (
                    <span className="px-2 py-0.5 rounded bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40 text-[10px] font-black">
                      EA AUTO-PILOT EXECUTING
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowLedgerDrawer((prev) => !prev)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    <span>{showLedgerDrawer ? 'Hide Proof Ledger' : `Proof Ledger (${eaLedger.length})`}</span>
                    {showLedgerDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {eaLedger.length > 0 && showLedgerDrawer && (
                    <button
                      type="button"
                      onClick={() => globalLiveStream.clearEaLedger()}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {showLedgerDrawer && (
                <div className="pt-2 border-t border-slate-800/80 overflow-x-auto">
                  {eaLedger.length === 0 ? (
                    <p className="text-[11px] text-slate-400 font-sans">
                      No READY_ENTER signals fired in this browser session yet. When all gates align (20/50 EMA trend + H1 anchor + active session + clean Value Zone), signals automatically enter here and score live ticks to TP1/TP2/SL.
                    </p>
                  ) : (
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                          <th className="py-1.5 px-2">Opened (EAT)</th>
                          <th className="py-1.5 px-2">Pair · TF</th>
                          <th className="py-1.5 px-2">Side</th>
                          <th className="py-1.5 px-2 text-right">Entry</th>
                          <th className="py-1.5 px-2 text-right">SL</th>
                          <th className="py-1.5 px-2 text-right">TP2</th>
                          <th className="py-1.5 px-2 text-right">Live/Peak Pips</th>
                          <th className="py-1.5 px-2 text-right">Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {eaLedger.slice(0, 12).map((row) => (
                          <tr
                            key={row.id}
                            onClick={() => handleOpenPairCard(row.pair)}
                            className="hover:bg-slate-900/70 cursor-pointer"
                          >
                            <td className="py-1.5 px-2 text-slate-300">{row.openedAtEat}</td>
                            <td className="py-1.5 px-2 font-black text-white">
                              {row.pair} <span className="text-slate-400 font-normal">{row.timeframe}</span>
                            </td>
                            <td className="py-1.5 px-2">
                              <span
                                className={`px-1.5 py-0.5 rounded font-black text-[10px] ${
                                  row.direction === 'BUY'
                                    ? 'bg-[#00C261]/20 text-[#00C261]'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {row.direction}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 text-right text-slate-200">{row.entryPrice}</td>
                            <td className="py-1.5 px-2 text-right text-red-300">{row.stopLoss}</td>
                            <td className="py-1.5 px-2 text-right text-[#00C261]">{row.tp2}</td>
                            <td className={`py-1.5 px-2 text-right font-bold ${row.currentPips >= 0 ? 'text-[#00C261]' : 'text-red-400'}`}>
                              {row.currentPips >= 0 ? `+${row.currentPips}p` : `${row.currentPips}p`}
                              <span className="text-slate-500 font-normal"> (pk +{row.peakPips}p)</span>
                            </td>
                            <td className="py-1.5 px-2 text-right">
                              <span
                                className={`px-1.5 py-0.5 rounded font-black text-[10px] ${
                                  row.status === 'TP2_WIN'
                                    ? 'bg-[#00C261] text-black'
                                    : row.status === 'TP1_BE_SAVE'
                                    ? 'bg-cyan-500/25 text-cyan-300'
                                    : row.status === 'SL_LOSS'
                                    ? 'bg-red-500/25 text-red-300'
                                    : row.tp1Reached
                                    ? 'bg-amber-400 text-black'
                                    : 'bg-slate-800 text-slate-200'
                                }`}
                              >
                                {row.status === 'OPEN'
                                  ? row.tp1Reached
                                    ? 'OPEN (TP1 BE✓)'
                                    : 'OPEN LIVE'
                                  : `${row.status.replace(/_/g, ' ')} (${row.realizedR >= 0 ? `+${row.realizedR}R` : `${row.realizedR}R`})`}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
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
          Rescan, Reanalyse with Super AI, and Back to All 15 Cards buttons.
          ========================================================================= */}
      {focusedMarket ? (
        (() => {
          const activeTf = customTfs[focusedMarket.pair] || focusedMarket.recommendedTf;
          const aiRecommendedSide: 'BUY' | 'SELL' = resolveMarketDirection(focusedMarket);
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
            candles: focusedMarket.candles,
            swingLow: focusedSwings.swingLow,
            swingHigh: focusedSwings.swingHigh,
            change24hPct: focusedMarket.change24hPct,
            macro: macroContext,
            biasOverride: selectedSideMode === 'AUTO' ? undefined : selectedSideMode,
            h1TrendDirection: focusedMarket.h1TrendDirection,
            bosAnalysis: focusedMarket.bosAnalysis,
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
            candles: focusedMarket.candles,
            swingLow: focusedSwings.swingLow,
            swingHigh: focusedSwings.swingHigh,
            change24hPct: focusedMarket.change24hPct,
            macro: macroContext,
            biasOverride: oppositeSide,
            h1TrendDirection: focusedMarket.h1TrendDirection,
            bosAnalysis: focusedMarket.bosAnalysis,
            riskConfig
          });
          const kenyaTiming = evaluatePairKenyaTiming(focusedMarket.pair);
          const isBuy = computed.direction === 'BUY';
          const pctPositive = focusedMarket.change24hPct >= 0;
          const focusedIdx = Math.max(0, markets.findIndex((x) => x.pair === focusedMarket.pair));
          const rankNum = focusedIdx + 1;
          const prevCardMarket = markets[(focusedIdx - 1 + markets.length) % Math.max(1, markets.length)];
          const nextCardMarket = markets[(focusedIdx + 1) % Math.max(1, markets.length)];
          const activeSubTab = focusedSubTabByPair[focusedMarket.pair] || 'ORDER';
          const execBrief = computed.executionBrief || computed.plainEnglishGuide;

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
          const shownEntry = displayOrder ? displayOrder.entryPrice : computed.entryPrice;
          const shownSl = displayOrder ? displayOrder.stopLoss : computed.stopLoss;
          const shownTp1 = displayOrder ? displayOrder.tp1 : computed.tp1;
          const shownTp2 = displayOrder ? displayOrder.tp2 : computed.tp2;
          const isFocusedNoTrade =
            !displayOrder &&
            (computed.executionReadiness === 'NO_TRADE_CHOP' ||
              computed.executionReadiness === 'NO_TRADE_CLOSED');
          const isHighWinRateSetup = computed.alignedFactorsCount >= 7 && !computed.isExtendedZone && !isFocusedNoTrade;

          const eaMqlCode = `// --- PIVOTFX LIVE AUTO-SYNC EA CONFIG ---
// Broker: ${selectedBroker.toUpperCase()} | Synced: ${lastScannedTime} | Rank #${rankNum}
// Symbol: ${computed.brokerSymbol} (${focusedMarket.pair} · ${activeTf})
// Direction: ${computed.orderType} | Trend: ${computed.trendProjectionText} | 24h Move: ${pctPositive ? '+' : ''}${focusedMarket.change24hPct}%
// Live Indicators: 20 EMA = ${focusedMarket.ema20} | 50 EMA = ${focusedMarket.ema50} | RSI = ${focusedMarket.rsi} | ADX = ${computed.adxStrength ?? 21} | MACD = ${computed.macdBias ?? 'FLAT'}
// Risk Management: ${computed.lotSize.toFixed(2)} Lots ($${computed.actualRiskUsd.toFixed(2)} / ${Math.round(computed.actualRiskUsd * 130)} KES Max Risk · ${riskConfig.riskPct}% of $${riskConfig.accountBalanceUsd})

input double   LotSize             = ${computed.lotSize.toFixed(2)};
input double   EntryPrice          = ${computed.entryPrice};
input double   StopLoss            = ${computed.stopLoss}; // -${computed.slPips} pips ($${computed.actualRiskUsd.toFixed(2)} max risk)
input double   TakeProfit_1        = ${computed.tp1}; // 1H-4H: Close 50% & Move SL to BE
input double   TakeProfit_2        = ${computed.tp2}; // 4H-12H Session Target (+${computed.tpPips} pips)
input double   TakeProfit_3_48H    = ${computed.tp3}; // 12H-48H Extended Swing (+${computed.tp3Pips} pips / +$${computed.netProfit48hUsd.toFixed(2)})
input double   MaxRiskUsdPerTrade  = ${computed.actualRiskUsd.toFixed(2)};`;

          const subTabItems: Array<{
            id: 'ORDER' | 'DEEP_AI' | 'THESIS' | 'FACTORS' | 'TV_EA';
            label: string;
          }> = [
            { id: 'ORDER', label: 'Position Sizing & Alt Side' },
            { id: 'DEEP_AI', label: 'Deep AI & BOS' },
            { id: 'THESIS', label: 'Backtest & Brief' },
            { id: 'FACTORS', label: `Quant Matrix (${computed.totalFactorsCount})` },
            { id: 'TV_EA', label: 'TradingView & EA' }
          ];

          return (
            <div className="space-y-4 font-mono tabular-nums">
              {/* Top Independent Card Action Toolbar + Return / Prev / Next Card */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleClosePairCard}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-slate-700 text-xs font-bold transition whitespace-nowrap shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All {markets.length} Cards</span>
                  </button>

                  {markets.length > 1 && (
                    <div className="inline-flex items-center rounded-xl bg-slate-950 border border-slate-800 p-0.5">
                      <button
                        type="button"
                        onClick={() => handleOpenPairCard(prevCardMarket.pair)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap shrink-0"
                        title={`Previous card: ${prevCardMarket.pair}`}
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>{prevCardMarket.pair}</span>
                      </button>
                      <span className="px-2 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        {rankNum}/{markets.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenPairCard(nextCardMarket.pair)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap shrink-0"
                        title={`Next card: ${nextCardMarket.pair}`}
                      >
                        <span>{nextCardMarket.pair}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRescanFocusedCard(focusedMarket.pair, activeTf)}
                    disabled={isRescanningCard}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00C261]/20 hover:bg-[#00C261] text-[#00C261] hover:text-black border border-[#00C261]/50 text-xs font-black transition whitespace-nowrap shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRescanningCard ? 'animate-spin' : ''}`} />
                    <span>Rescan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReanalyseFocusedCardAi(focusedMarket.pair, activeTf)}
                    disabled={isReanalysingCardAi}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl btn-gold text-black text-xs font-black transition whitespace-nowrap shrink-0"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isReanalysingCardAi ? 'animate-spin' : ''}`} />
                    <span>Deep AI Audit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => globalLiveStream.requestOpenScannerView('trade_log', focusedMarket.pair)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition whitespace-nowrap shrink-0"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Trade Log</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenTradingViewForPair(focusedMarket.pair, activeTf, focusedMarket.price)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-950/70 hover:bg-sky-500 text-sky-300 hover:text-black border border-sky-400/50 text-xs font-black transition whitespace-nowrap shrink-0"
                    title={`Open live TradingView & synchronized Order Ticket (${computed.tvSymbol})`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>TradingView ({computed.tvSymbol})</span>
                  </button>

                  <a
                    href={getTradingViewExternalUrl(focusedMarket.pair, activeTf)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 text-xs font-black transition whitespace-nowrap shrink-0"
                    title={`Launch ${computed.tvSymbol} directly on TradingView.com`}
                  >
                    <span>TV.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onSelectMarketForAnalysis({ ...focusedMarket, recommendedTf: activeTf }, 'deep_ai')
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold transition whitespace-nowrap shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Order Ticket</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 mr-0.5">Top Movers:</span>
                  {markets.slice(0, 4).map((mItem, idx) => (
                    <button
                      key={mItem.pair}
                      type="button"
                      onClick={() => handleOpenPairCard(mItem.pair)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap shrink-0 ${
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

              {/* Main Independent Market Card */}
              <div className="rounded-3xl p-4 sm:p-6 bg-slate-950 border-2 border-[#D4AF37]/80 shadow-2xl space-y-4">
                {/* Compact Header: Identity, Live Quote, Verdict & Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#D4AF37] text-black font-black">
                        RANK #{rankNum}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg font-black ${
                          isFocusedNoTrade
                            ? 'bg-slate-800 text-amber-300 border border-slate-700'
                            : isBuy
                            ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/50'
                            : 'bg-red-500/20 text-red-300 border border-red-500/50'
                        }`}
                      >
                        {isFocusedNoTrade
                          ? computed.executionReadiness === 'NO_TRADE_CLOSED'
                            ? 'CLOSED · STAND ASIDE'
                            : 'STAND ASIDE (CHOP)'
                          : computed.orderType}
                      </span>
                      {computed.institutionalTelemetry && (
                        <span
                          className={`px-2.5 py-0.5 rounded-lg font-black text-[11px] border ${
                            computed.institutionalTelemetry.roboticVerdict.startsWith('PRIME')
                              ? 'bg-[#00C261] text-black border-[#00C261]'
                              : computed.institutionalTelemetry.roboticVerdict.startsWith('SNIPER')
                              ? 'bg-amber-400 text-black border-amber-400'
                              : 'bg-red-500/25 text-red-200 border-red-500/50'
                          }`}
                        >
                          {computed.institutionalTelemetry.roboticVerdict.replace(/_/g, ' ')} · {computed.institutionalTelemetry.estimatedWinProbPct}% Prob (+{computed.institutionalTelemetry.expectedRMultiple}R)
                        </span>
                      )}
                      <span className="text-[#00C261] font-black">{computed.confidence}% AI Confidence</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-cyan-300 font-bold">{computed.recommendedStrategy}</span>
                    </div>

                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        {focusedMarket.pair}{' '}
                        <span className="text-base text-slate-400 font-bold">({computed.brokerSymbol})</span>
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

                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-300 font-sans">
                      <span
                        className={`font-bold ${
                          kenyaTiming.windowStatusCode === 'OPEN' && kenyaTiming.isFavorableTime
                            ? 'text-[#00C261]'
                            : kenyaTiming.windowStatusCode === 'OPEN' || kenyaTiming.windowStatusCode === 'OPENING_SOON'
                            ? 'text-amber-300'
                            : 'text-red-400'
                        }`}
                      >
                        {kenyaTiming.currentWindowName} ({kenyaTiming.countdownFormatted})
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>H1 {computed.h1TrendDirection}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>ADX {computed.adxStrength ?? 21}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>MACD {computed.macdBias ?? 'FLAT'}</span>
                      {kenyaTiming.windowStatusCode === 'CLOSED_WAIT' && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <button
                            type="button"
                            onClick={() => handleOpenPairCard('BTC/USD')}
                            className="text-[#00C261] hover:underline font-bold"
                          >
                            Switch 24/7 BTC/USD
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Timeframe Selector & Inspect Side Toggle */}
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
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition whitespace-nowrap shrink-0 ${
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
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
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

                {/* DUAL-PANE EXECUTION DESK: LEFT = CHART & PROOF | RIGHT = MT5 ORDER TICKET & CONFIRMATION */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                  <div className="xl:col-span-7 space-y-3 min-w-0">
                    {/* INTERACTIVE LIVE CANDLESTICK CHART */}
                    {(() => {
                      const focusedPendingLimit =
                        pendingLimits.find(
                          (l) => l.pair === focusedMarket.pair && l.status === 'PENDING'
                        ) || null;
                      return (
                        <LiveInteractiveCandleChart
                          pair={focusedMarket.pair}
                          timeframe={activeTf}
                          candles={focusedMarket.candles || []}
                          livePrice={focusedMarket.price}
                          ema20={focusedMarket.ema20}
                          ema50={focusedMarket.ema50}
                          entryPrice={shownEntry}
                          stopLoss={shownSl}
                          tp1={shownTp1}
                          tp2={shownTp2}
                          advisoryEntryPrice={computed.advisoryEntryPrice}
                          invalidationLevel={computed.invalidationLevel}
                          pendingLimitPrice={focusedPendingLimit?.limitEntryPrice ?? null}
                          replaySignals={computed.liveBacktest?.recentSignals}
                          direction={displayOrder ? displayOrder.direction : computed.direction}
                          manualPreviewDirection={selectedSideMode !== 'AUTO' ? selectedSideMode : null}
                          activeOrderDirection={displayOrder ? displayOrder.direction : null}
                          selectedSideMode={selectedSideMode}
                          onSelectSideSync={(sideBtn) =>
                            setInspectedSideByPair((prev) => ({
                              ...prev,
                              [focusedMarket.pair]: sideBtn
                            }))
                          }
                          change24hPct={focusedMarket.change24hPct}
                          lotSize={displayOrder ? displayOrder.lotSize : computed.lotSize}
                          riskUsd={computed.actualRiskUsd}
                          executionReadiness={computed.executionReadiness}
                          executionReadinessReason={computed.executionReadinessReason}
                          bosAnalysis={computed.bosAnalysis}
                          isLockedToCustom={Boolean(lockedPairs[focusedMarket.pair])}
                          onCandlePriceChange={(newPrice) =>
                            globalLiveStream.setCustomCandlePrice(focusedMarket.pair, newPrice, activeTf)
                          }
                          onResetToLiveStream={() => globalLiveStream.unlockPairToLiveStream(focusedMarket.pair)}
                        />
                      );
                    })()}

                    {/* CLEAN 1-ROW KEY EXECUTION LEVELS STRIP */}
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg font-black text-[11px] flex items-center gap-1.5 ${
                              isHighWinRateSetup ? 'bg-[#00C261] text-black' : 'bg-[#D4AF37] text-black'
                            }`}
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>
                              {computed.alignedFactorsCount}/{computed.totalFactorsCount} Factors · R:R {computed.riskReward}
                            </span>
                          </span>
                          <span className="text-slate-300 font-sans text-xs">
                            12H Est:{' '}
                            <strong className={isFocusedNoTrade && selectedSideMode === 'AUTO' ? 'text-slate-400' : 'text-[#00C261]'}>
                              {isFocusedNoTrade && selectedSideMode === 'AUTO'
                                ? 'Stand Aside'
                                : `+$${computed.netProfitUsd.toFixed(2)}`}
                            </strong>{' '}
                            ({computed.lotSize.toFixed(2)} Lots · ${computed.actualRiskUsd.toFixed(2)} risk)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const modeStr =
                              isFocusedNoTrade && selectedSideMode === 'AUTO'
                                ? `REF (${computed.executionReadiness})`
                                : computed.orderType;
                            const fullTicket = `${computed.brokerSymbol} ${modeStr} | Price: ${shownEntry} | SL: ${shownSl} | TP1: ${shownTp1} | TP2: ${shownTp2} | Vol: ${computed.lotSize.toFixed(2)} Lots ($${computed.actualRiskUsd.toFixed(2)} Risk) | Broker: ${selectedBroker.toUpperCase()}`;
                            handleQuickCopyValue(fullTicket, `full-ticket-${focusedMarket.pair}`);
                          }}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                            isFocusedNoTrade && selectedSideMode === 'AUTO'
                              ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
                              : 'bg-[#D4AF37] hover:bg-amber-400 text-black'
                          }`}
                        >
                          {copiedCardPair === `full-ticket-${focusedMarket.pair}` ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {copiedCardPair === `full-ticket-${focusedMarket.pair}`
                              ? 'Levels Copied ✓'
                              : isFocusedNoTrade && selectedSideMode === 'AUTO'
                              ? 'Copy Ref Levels'
                              : 'Copy MT5 Ticket'}
                          </span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-1">
                          <div>
                            <span className="text-[10px] text-slate-400 block">
                              {displayOrder ? 'Order Entry' : 'Entry Price'}
                            </span>
                            <strong className="text-sm text-white">{shownEntry}</strong>
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
                            <span>{copiedCardPair === `focus-entry-${focusedMarket.pair}` ? 'Copied' : 'Copy EP'}</span>
                          </button>
                        </div>

                        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/40 flex flex-col justify-between gap-1">
                          <div>
                            <span className="text-[10px] text-red-300 block">Stop Loss (-{computed.slPips}p)</span>
                            <strong className="text-sm text-red-400">{shownSl}</strong>
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
                            <span>{copiedCardPair === `focus-sl-${focusedMarket.pair}` ? 'Copied' : 'Copy SL'}</span>
                          </button>
                        </div>

                        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col justify-between gap-1">
                          <div>
                            <span className="text-[10px] text-cyan-300 block">TP1 (50% BE Lock)</span>
                            <strong className="text-sm text-cyan-300">{shownTp1}</strong>
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
                            <span>{copiedCardPair === `focus-tp1-${focusedMarket.pair}` ? 'Copied' : 'Copy TP1'}</span>
                          </button>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col justify-between gap-1">
                          <div>
                            <span className="text-[10px] text-emerald-300 block">TP2 Target (+{computed.tpPips}p)</span>
                            <strong className="text-sm text-[#00C261]">{shownTp2}</strong>
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
                            <span>{copiedCardPair === `focus-tp2-${focusedMarket.pair}` ? 'Copied' : 'Copy TP2'}</span>
                          </button>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                          <span className="text-[10px] text-slate-400 block">48H Extended TP3</span>
                          <strong className="text-sm text-[#D4AF37]">{computed.tp3}</strong>
                          <span className="text-[10px] text-cyan-300">+${computed.netProfit48hUsd.toFixed(2)} est.</span>
                        </div>
                      </div>

                      {computed.trajectoryHorizons && computed.trajectoryHorizons.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                          {computed.trajectoryHorizons.map((step) => (
                            <div
                              key={step.horizon}
                              className="p-2 rounded-xl bg-slate-900/75 border border-slate-800 space-y-0.5 text-xs"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] text-[#D4AF37] font-black">{step.horizon}</span>
                                <span className="text-[10px] text-[#00C261] font-bold">
                                  +{step.targetPips}p · +${step.netProfitUsd.toFixed(2)}
                                </span>
                              </div>
                              <strong className="text-xs text-white block">
                                Target @ {step.targetPrice}
                              </strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <PriceAlertManagerBar
                      mode="pair"
                      pair={focusedMarket.pair}
                      livePrice={focusedMarket.price}
                      ema20={focusedMarket.ema20}
                      bosLevel={computed.bosAnalysis?.bosTriggerLevel || 0}
                      tp1={shownTp1}
                    />
                  </div>

                  {/* RIGHT EXECUTION PANE: LIVE MT5 ORDER TICKET & ENTRY CONFIRMATION */}
                  <div className="xl:col-span-5 space-y-3 min-w-0">
                    <ActiveMarketOrderPanel
                      mode="full"
                      pair={focusedMarket.pair}
                      direction={selectedSideMode !== 'AUTO' ? selectedSideMode : computed.direction}
                      timeframe={activeTf}
                      broker={selectedBroker}
                      onSideSyncRequest={(syncSide) =>
                        setInspectedSideByPair((prev) => ({
                          ...prev,
                          [focusedMarket.pair]: syncSide
                        }))
                      }
                    />

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

                {/* 5 CLICKABLE INDEPENDENT SUB-CARD TABS */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                    {subTabItems.map((tab) => {
                      const active = activeSubTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() =>
                            setFocusedSubTabByPair((prev) => ({
                              ...prev,
                              [focusedMarket.pair]: tab.id
                            }))
                          }
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 border ${
                            active
                              ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-black'
                              : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 space-y-4">
                    {/* SUB-CARD 1: POSITION SIZING & ALTERNATIVE SIDE COMPARISON */}
                    {activeSubTab === 'ORDER' && (
                      <div className="space-y-4">
                        <DynamicPositionSizeCalculator
                          pair={focusedMarket.pair}
                          computed={computed}
                          lockedOrder={displayOrder}
                        />

                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              Alternative Side Reference ({oppositeSide} BY MARKET)
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
                            Switch Chart &amp; Order to {oppositeSide}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SUB-CARD 2: DEEP AI & BOS/CHOCH STRUCTURE AUDIT */}
                    {activeSubTab === 'DEEP_AI' && (
                      <div className="space-y-4">
                        <DeepScanVerificationPanel
                          pair={focusedMarket.pair}
                          timeframe={activeTf}
                          computed={computed}
                          deepAudit={deepAudits[focusedMarket.pair]}
                          isVerifying={Boolean(isDeepVerifyingPair[focusedMarket.pair])}
                          onRunDeepVerify={() =>
                            void globalLiveStream.verifyMarketDeepScan(
                              focusedMarket.pair,
                              activeTf,
                              selectedBroker,
                              selectedSideMode === 'AUTO' ? undefined : selectedSideMode
                            )
                          }
                        />

                        {(() => {
                          const aiNote = superAiNotes[focusedMarket.pair];
                          return (
                            <div className="p-4 rounded-2xl bg-slate-900 border border-[#D4AF37]/40 space-y-2 text-xs">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
                                  <Sparkles className="w-4 h-4 shrink-0" />
                                  <span>
                                    {aiNote?.headline || `Quantitative Desk Note · ${focusedMarket.pair} (${activeTf})`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                  <span>
                                    {aiNote
                                      ? `${aiNote.source === 'gemini-4-hydrogen' || aiNote.source === 'gemini-3.8-flash' ? 'Gemini AI Live' : 'Quant Stream'} · ${aiNote.syncedAt}`
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
                              <p className="text-slate-200 leading-relaxed font-sans">
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
                                  Catalyst:{' '}
                                  <strong className="text-cyan-300">
                                    {aiNote?.catalystWatch || `${kenyaTiming.currentWindowName} · DXY ${macroContext.dxyPressurePct >= 0 ? `+${macroContext.dxyPressurePct}%` : `${macroContext.dxyPressurePct}%`}`}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-[#00C261] shrink-0 mt-0.5" />
                          <span className="text-slate-200 leading-snug font-sans">{computed.humanCheckNote}</span>
                        </div>
                      </div>
                    )}

                    {/* SUB-CARD 3: WALK-FORWARD BACKTEST, EXECUTION BRIEF & MULTI-HORIZON TRAJECTORY */}
                    {activeSubTab === 'THESIS' && (
                      <div className="space-y-4">
                        {(execBrief || computed.liveBacktest) && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/35 space-y-4 text-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div>
                                <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">
                                  Institutional Execution Brief &amp; Live Walk-Forward Proof
                                </span>
                                <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                                  {execBrief?.headline || `${focusedMarket.pair} (${activeTf}) Execution Clarity`}
                                </h3>
                              </div>
                              {computed.liveBacktest && (
                                <span
                                  className={`px-3 py-1 rounded-lg text-[10px] font-black shrink-0 ${
                                    computed.liveBacktest.verdictLabel === 'PROVEN POSITIVE EDGE'
                                      ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/50'
                                      : computed.liveBacktest.verdictLabel === 'MODERATE EDGE'
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                  }`}
                                >
                                  {computed.liveBacktest.verdictLabel}
                                </span>
                              )}
                            </div>

                            {computed.liveBacktest && (
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">TP1 / Positive Rate</span>
                                    <strong className="text-sm sm:text-base text-[#00C261]">
                                      {computed.liveBacktest.sampleTrades > 0 ? `${computed.liveBacktest.tp1WinRatePct}%` : '—'}
                                    </strong>
                                    <span className="text-[10px] text-slate-500 block">
                                      {computed.liveBacktest.sampleTrades} qualified trades
                                    </span>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Full TP2 Hit Rate</span>
                                    <strong className="text-sm sm:text-base text-cyan-300">
                                      {computed.liveBacktest.sampleTrades > 0 ? `${computed.liveBacktest.fullWinRatePct}%` : '—'}
                                    </strong>
                                    <span className="text-[10px] text-slate-500 block">
                                      {computed.liveBacktest.fullTp2Wins} full wins · {computed.liveBacktest.losses} SL
                                    </span>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Profit Factor</span>
                                    <strong className="text-sm sm:text-base text-[#D4AF37]">
                                      {computed.liveBacktest.sampleTrades > 0 ? computed.liveBacktest.profitFactor.toFixed(2) : '—'}
                                    </strong>
                                    <span className="text-[10px] text-slate-500 block">&gt; 1.40 = healthy</span>
                                  </div>
                                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Avg Expectancy / Trade</span>
                                    <strong
                                      className={`text-sm sm:text-base ${
                                        computed.liveBacktest.netExpectancyR >= 0 ? 'text-[#00C261]' : 'text-red-400'
                                      }`}
                                    >
                                      {computed.liveBacktest.sampleTrades > 0
                                        ? `${computed.liveBacktest.netExpectancyR >= 0 ? '+' : ''}${computed.liveBacktest.netExpectancyR.toFixed(2)}R`
                                        : '0.00R'}
                                    </strong>
                                    <span className="text-[10px] text-slate-500 block">TP1 BE + TP2 scale</span>
                                  </div>
                                </div>
                                <p className="text-[11px] text-slate-300 font-sans leading-relaxed bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2">
                                  {computed.liveBacktest.summary}
                                </p>
                              </div>
                            )}

                            {execBrief && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                  <span className="text-[10px] font-mono font-bold text-[#00C261] uppercase">
                                    1. Directional Structure ({computed.direction})
                                  </span>
                                  <p className="text-xs text-slate-200 leading-relaxed">{execBrief.whyDirection}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                  <span className="text-[10px] font-mono font-bold text-red-300 uppercase">
                                    2. Stop Loss Spread &amp; ATR Buffer
                                  </span>
                                  <p className="text-xs text-slate-200 leading-relaxed">{execBrief.whySlIsSafe}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                  <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase">
                                    3. TP1 50% Lock &amp; Breakeven Protocol
                                  </span>
                                  <p className="text-xs text-slate-200 leading-relaxed">{execBrief.tp1BreakevenPlan}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                  <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                                    4. 10-Trade Statistical Expectancy
                                  </span>
                                  <p className="text-xs text-slate-200 leading-relaxed">{execBrief.expectancyMath}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-4 rounded-2xl bg-slate-900/75 border border-[#D4AF37]/40 space-y-3 text-xs">
                          <div className="flex items-center justify-between text-[#D4AF37] font-bold flex-wrap gap-1">
                            <span className="flex items-center gap-1.5">
                              <Target className="w-4 h-4" />
                              <span>1H–48H {computed.direction} Trajectory Projection</span>
                            </span>
                            <span className="text-emerald-400">Spread ~{computed.brokerSpread}p · 48H TP3: {computed.tp3}</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed font-sans">{computed.trajectory}</p>
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
                                <p className="text-[10px] text-slate-300 leading-snug font-sans">{step.driverSummary}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-CARD 4: 10-FACTOR INSTITUTIONAL MATRIX + ADX/MACD/PATTERN TELEMETRY */}
                    {activeSubTab === 'FACTORS' && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-[#D4AF37]/40 space-y-4 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-[#D4AF37] font-black uppercase tracking-wider">
                              {computed.totalFactorsCount}-Factor Quantitative Matrix ({computed.alignedFactorsCount}/{computed.totalFactorsCount} Confirmed · {computed.orderType})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-black">
                            <span className="text-[#00C261]">BULL: {computed.bullScorePct}%</span>
                            <span className="text-slate-600">vs</span>
                            <span className="text-red-400">BEAR: {computed.bearScorePct}%</span>
                            <span className="text-slate-400">· DXY {macroContext.dxyPressurePct >= 0 ? `+${macroContext.dxyPressurePct}%` : `${macroContext.dxyPressurePct}%`}</span>
                          </div>
                        </div>

                        {/* Quantitative Technical Telemetry Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">20 / 50 EMA</span>
                            <strong className="text-cyan-300 text-xs">{focusedMarket.ema20} / {focusedMarket.ema50}</strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">RSI (14)</span>
                            <strong className="text-white text-xs">{focusedMarket.rsi}</strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">ADX (14) Strength</span>
                            <strong className={`text-xs ${(computed.adxStrength ?? 21) >= 25 ? 'text-[#00C261]' : (computed.adxStrength ?? 21) < 16 ? 'text-red-400' : 'text-[#D4AF37]'}`}>
                              {(computed.adxStrength ?? 21).toFixed(1)}
                            </strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">MACD (12/26/9)</span>
                            <strong className={`text-xs ${computed.macdBias === 'BULLISH' ? 'text-[#00C261]' : computed.macdBias === 'BEARISH' ? 'text-red-400' : 'text-amber-300'}`}>
                              {computed.macdBias ?? 'FLAT'}
                            </strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Candle Pattern</span>
                            <strong className="text-cyan-300 text-xs truncate block">
                              {(computed.candlePattern || 'CONSOLIDATION').replace(/_/g, ' ')}
                            </strong>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">H1 Structure</span>
                            <strong className="text-[#D4AF37] text-xs">{computed.h1TrendDirection}</strong>
                          </div>
                        </div>

                        {computed.institutionalTelemetry && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Floor Pivots (S1 / P / R1)</span>
                              <strong className="text-cyan-300 text-xs">
                                {computed.institutionalTelemetry.pivotLevels.s1} / {computed.institutionalTelemetry.pivotLevels.pivot} / {computed.institutionalTelemetry.pivotLevels.r1}
                              </strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Z-Score &amp; BB Squeeze</span>
                              <strong className={`text-xs ${Math.abs(computed.institutionalTelemetry.zScore) > 1.85 ? 'text-amber-300' : 'text-[#00C261]'}`}>
                                Z={computed.institutionalTelemetry.zScore}σ{computed.institutionalTelemetry.squeezeActive ? ' · SQUEEZE' : ` · BB ${computed.institutionalTelemetry.bbWidthPct}%`}
                              </strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Stoch(14,3,3) · CCI(20)</span>
                              <strong className="text-white text-xs">
                                {computed.institutionalTelemetry.stochK}/{computed.institutionalTelemetry.stochD} · CCI {computed.institutionalTelemetry.cci20}
                              </strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Robotic Gate &amp; Expectancy</span>
                              <strong className={`text-xs ${computed.institutionalTelemetry.roboticVerdict.startsWith('PRIME') ? 'text-[#00C261]' : computed.institutionalTelemetry.roboticVerdict.startsWith('SNIPER') ? 'text-amber-300' : 'text-red-400'}`}>
                                {computed.institutionalTelemetry.roboticVerdict.replace(/_/g, ' ')} ({computed.institutionalTelemetry.estimatedWinProbPct}% · +{computed.institutionalTelemetry.expectedRMultiple}R)
                              </strong>
                            </div>
                          </div>
                        )}

                        <div className="w-full h-2.5 rounded-full bg-red-950/70 overflow-hidden flex border border-slate-800">
                          <div className="h-full bg-[#00C261] transition-all duration-300" style={{ width: `${computed.bullScorePct}%` }} />
                          <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${computed.bearScorePct}%` }} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
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
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 ${
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
                              <p className="text-[10px] text-slate-300 leading-snug font-sans">{fv.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SUB-CARD 5: TRADINGVIEW SYNC & MQL4/MQL5 EA PARAMETERS */}
                    {activeSubTab === 'TV_EA' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
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
                              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-bold flex items-center gap-1 transition whitespace-nowrap"
                            >
                              {copiedEa ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedEa ? 'EA Copied!' : 'Copy EA Config'}</span>
                            </button>
                          </div>
                          <pre className="p-3 rounded-xl bg-black/70 border border-slate-800/80 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
                            {eaMqlCode}
                          </pre>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              onSelectMarketForAnalysis({ ...focusedMarket, recommendedTf: activeTf }, 'deep_ai')
                            }
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                          >
                            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Open Full Order Ticket</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onOpenTradingViewForPair(focusedMarket.pair, activeTf, focusedMarket.price)
                            }
                            className="px-4 py-2.5 rounded-xl bg-sky-950/70 hover:bg-sky-500 text-sky-300 hover:text-black border border-sky-400/50 font-black text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>Synced TradingView ({computed.tvSymbol})</span>
                          </button>

                          <a
                            href={getTradingViewExternalUrl(focusedMarket.pair, activeTf)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 font-black text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                          >
                            <span>Open TradingView.com ({computed.tvSymbol})</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Card Return / Prev / Next Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleClosePairCard}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 font-black text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to All {markets.length} Cards</span>
                  </button>

                  {markets.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPairCard(prevCardMarket.pair)}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Prev: {prevCardMarket.pair}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenPairCard(nextCardMarket.pair)}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
                      >
                        <span>Next: {nextCardMarket.pair}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Slim Mobile Sticky Quick-Action Bar (<= 56px, md:hidden) */}
              <div className="md:hidden sticky bottom-2 z-30 h-14 px-3 rounded-2xl bg-[#070B14]/95 border border-[#D4AF37]/50 flex items-center justify-between gap-2 shadow-2xl">
                <div className="min-w-0 text-[11px]">
                  <strong className="text-white block truncate">{focusedMarket.pair}</strong>
                  <span className="text-[#D4AF37] font-bold">@ {focusedMarket.price}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuickLoadCardOrder(focusedMarket.pair, 'BUY', activeTf)}
                    className="px-3 py-1.5 rounded-xl bg-[#00C261] text-black font-black text-xs whitespace-nowrap"
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLoadCardOrder(focusedMarket.pair, 'SELL', activeTf)}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs whitespace-nowrap"
                  >
                    SELL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const fullTicket = `${computed.brokerSymbol} ${computed.direction} | EP ${shownEntry} | SL ${shownSl} | TP1 ${shownTp1} | TP2 ${shownTp2}`;
                      handleQuickCopyValue(fullTicket, `mob-ticket-${focusedMarket.pair}`);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-[#D4AF37] border border-[#D4AF37]/40 font-black text-xs whitespace-nowrap"
                  >
                    {copiedCardPair === `mob-ticket-${focusedMarket.pair}` ? 'Copied ✓' : 'Copy MT5'}
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

          {/* LIVE 8-CURRENCY STRENGTH METER & TOP DIVERGENCE ENGINE */}
          <CurrencyStrengthMatrixStrip
            markets={markets}
            onSelectPair={(targetPair) => handleOpenPairCard(targetPair)}
          />

          {/* ACTIVE LIVE PRICE ALERT WATCHLIST STRIP */}
          <PriceAlertManagerBar
            mode="global"
            onInspectPair={(targetPair) => handleOpenPairCard(targetPair)}
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
              candles: topLeader.candles,
              swingLow: topSwings.swingLow,
              swingHigh: topSwings.swingHigh,
              change24hPct: topLeader.change24hPct,
              macro: macroContext,
              h1TrendDirection: topLeader.h1TrendDirection,
              bosAnalysis: topLeader.bosAnalysis,
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

            const isTopBlocked =
              !topLoadedOrder &&
              (topComputed.executionReadiness === 'NO_TRADE_CHOP' ||
                topComputed.executionReadiness === 'NO_TRADE_CLOSED');

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
                className={`p-5 rounded-2xl border cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono tabular-nums transition ${
                  isTopBlocked
                    ? 'bg-gradient-to-r from-slate-950 via-[#0E131F] to-slate-950 border-slate-700'
                    : 'bg-gradient-to-r from-slate-900 via-[#0E1629] to-slate-900 border-[#D4AF37]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-3 py-1 rounded-lg bg-[#D4AF37] text-black font-black flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>
                        #1 TOP ACTIONABLE ·{' '}
                        {isTopBlocked
                          ? topComputed.executionReadiness === 'NO_TRADE_CLOSED'
                            ? 'SESSION CLOSED'
                            : 'STAND ASIDE'
                          : topComputed.orderVerdictLabel}
                      </span>
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
                      TF: {customTfs[topLeader.pair] || topLeader.recommendedTf} · {topComputed.recommendedStrategy}
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
                        isTopBlocked
                          ? 'bg-slate-800 text-amber-300 border border-slate-700'
                          : topComputed.direction === 'BUY'
                          ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {isTopBlocked
                        ? topComputed.executionReadiness === 'NO_TRADE_CLOSED'
                          ? 'WAIT FOR SESSION OPEN'
                          : 'STAND ASIDE — WAIT CLEAN BOS'
                        : topComputed.executionReadiness === 'WAIT_PULLBACK'
                        ? `${topComputed.direction} WATCHLIST @ ${topComputed.advisoryEntryPrice}`
                        : topComputed.orderType}
                    </span>
                    {!isTopBlocked ? (
                      <span className="text-xs font-black text-emerald-300">
                        Est. Net: +${topComputed.netProfitUsd.toFixed(2)} (+{topComputed.netProfitKes} KES) · {topComputed.riskReward}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        Reference Levels Only (No Active Trade)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
                  <div className="grid grid-cols-3 gap-2.5 text-xs bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {isTopBlocked ? 'Ref Entry' : topComputed.executionReadiness === 'WAIT_PULLBACK' ? 'Limit EP' : 'Entry'}
                      </span>
                      <strong className={isTopBlocked ? 'text-slate-400' : 'text-white'}>
                        {topComputed.executionReadiness === 'WAIT_PULLBACK'
                          ? topComputed.advisoryEntryPrice
                          : topComputed.entryPrice}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-red-400 block">
                        {isTopBlocked ? 'Ref SL' : `SL (-$${topComputed.actualRiskUsd.toFixed(2)})`}
                      </span>
                      <strong className={isTopBlocked ? 'text-slate-400' : 'text-red-300'}>
                        {topLoadedOrder ? topLoadedOrder.stopLoss : topComputed.stopLoss}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">
                        {isTopBlocked ? 'Ref TP2' : `TP2 (+$${topComputed.netProfitUsd.toFixed(2)})`}
                      </span>
                      <strong className={isTopBlocked ? 'text-slate-400' : 'text-[#00C261]'}>
                        {topLoadedOrder ? topLoadedOrder.tp2 : topComputed.tp2}
                      </strong>
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

          {/* Asset Class Category Selector + Live Search + View Mode Switch */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-bold mr-1">Asset Class:</span>
              {[
                { id: 'ALL', label: `All Markets (${markets.length})` },
                { id: 'CRYPTO', label: '24/7 Crypto (BTC & ETH)' },
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

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter pair..."
                  aria-label="Filter markets by pair or strategy"
                  className="w-36 sm:w-44 pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-[#D4AF37] text-xs text-white placeholder:text-slate-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRadarViewMode('cards')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition whitespace-nowrap ${
                    radarViewMode === 'cards'
                      ? 'bg-[#D4AF37] text-black font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRadarViewMode('table')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition whitespace-nowrap ${
                    radarViewMode === 'table'
                      ? 'bg-[#D4AF37] text-black font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>Pro Matrix</span>
                </button>
              </div>
            </div>
          </div>

          {/* CONTEXT-AWARE SESSION LIQUIDITY & WEEKEND SAFETY STRIP */}
          {(() => {
            const fxTiming = evaluatePairKenyaTiming('EUR/USD');
            const fxClosed = fxTiming.windowStatusCode === 'CLOSED_WAIT';
            if (fxClosed) {
              return (
                <div className="p-4 rounded-2xl bg-[#120D0A] border border-amber-500/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-amber-300 font-black text-[10px]">
                          {fxTiming.isWeekendClosed ? 'WEEKEND MARKET CLOSED' : 'OFF-SESSION FX/METALS PAUSE'}
                        </span>
                        <span className="text-slate-600">·</span>
                        <strong className="text-white text-sm">
                          {fxTiming.isWeekendClosed
                            ? `Forex & Metals Closed — Opens in ${fxTiming.countdownFormatted}`
                            : `${fxTiming.nextWindowName} Opens in ${fxTiming.countdownFormatted}`}
                        </strong>
                      </div>
                      <p className="text-amber-200/90 text-xs font-sans leading-relaxed">
                        {fxTiming.isWeekendClosed
                          ? 'Spreads widen 10x–50x during weekend closures. Please wait until Monday opening or trade 24/7 BTC/USD & ETH/USD.'
                          : 'Oops — EUR/USD & GBP/USD are currently outside prime London/NY liquidity (study levels & wait for opening bell). USD/JPY & Crypto may still offer selective moves.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAssetCategory('CRYPTO')}
                    className="px-4 py-2.5 rounded-xl bg-[#00C261] hover:bg-emerald-400 text-black font-black text-xs shrink-0 whitespace-nowrap transition"
                  >
                    Filter 24/7 Crypto
                  </button>
                </div>
              );
            }
            const sessionAccent =
              macroContext.sessionWindowName.includes('Tokyo') || macroContext.sessionWindowName.includes('Asian')
                ? { text: 'text-sky-300', border: 'border-sky-500/45', bg: 'bg-sky-950/25', label: 'ASIAN SESSION LIVE' }
                : macroContext.sessionWindowName.includes('London Open')
                ? { text: 'text-[#00C261]', border: 'border-[#00C261]/45', bg: 'bg-emerald-950/25', label: 'LONDON SESSION LIVE' }
                : macroContext.sessionWindowName.includes('New York')
                ? { text: 'text-[#F3D36B]', border: 'border-[#D4AF37]/55', bg: 'bg-yellow-950/25', label: 'NEW YORK SESSION LIVE' }
                : { text: 'text-amber-300', border: 'border-amber-500/45', bg: 'bg-amber-950/25', label: 'LULL / STUDY WINDOW' };

            return (
              <div className={`px-4 py-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs font-mono ${sessionAccent.bg} ${sessionAccent.border}`}>
                <div className="flex items-center gap-2 text-slate-300">
                  <Radio className={`w-3.5 h-3.5 shrink-0 ${sessionAccent.text}`} />
                  <strong className={sessionAccent.text}>{sessionAccent.label}</strong>
                  <span className="text-slate-600">·</span>
                  <span>{fxTiming.windowBadgeShort}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Normal Interbank Spreads Active Across {markets.length} Pairs</span>
                </div>
                <span className="text-[11px] text-[#D4AF37] font-bold">
                  Showing {filteredMarkets.length} of {markets.length} pairs
                </span>
              </div>
            );
          })()}

          {/* Filter & Ranking Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono text-slate-400 font-bold mr-1">Order / Filter:</span>
              {([
                { id: 'ALL', label: `Top % → Least (#1–#${filteredMarkets.length})` },
                { id: 'PRECISION', label: 'Precision Rank (Lowest DD)' },
                { id: 'READY', label: 'Ready Now' },
                { id: 'GRADE_A', label: 'Grade A+ Edge' },
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

          {filteredMarkets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 font-mono">
              <p className="text-sm font-bold text-white">No markets match the current filter</p>
              <p className="text-xs text-slate-400">Clear your search filter or switch back to All Markets to inspect live setups.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterBias('ALL');
                  setAssetCategory('ALL');
                }}
                className="mt-2 px-4 py-2 rounded-xl btn-gold text-black font-black text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : radarViewMode === 'table' ? (
            /* PRO EXECUTION MATRIX TABLE */
            <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono tabular-nums text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#070B14] text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Market</th>
                      <th className="py-3 px-3 text-right">Live Price</th>
                      <th className="py-3 px-3 text-right">24h %</th>
                      <th className="py-3 px-3">Signal &amp; Verdict</th>
                      <th className="py-3 px-3 text-right">Entry</th>
                      <th className="py-3 px-3 text-right">Stop Loss</th>
                      <th className="py-3 px-3 text-right">TP2 Target</th>
                      <th className="py-3 px-3 text-right">Est. Net / R:R</th>
                      <th className="py-3 px-3 text-right">ADX / MACD</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
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
                        candles: m.candles,
                        swingLow: cardSwings.swingLow,
                        swingHigh: cardSwings.swingHigh,
                        change24hPct: m.change24hPct,
                        macro: macroContext,
                        h1TrendDirection: m.h1TrendDirection,
                        bosAnalysis: m.bosAnalysis,
                        riskConfig
                      });
                      const isBuy = computed.direction === 'BUY';
                      const pctPos = m.change24hPct >= 0;
                      const loadedOrder = activeOrders[m.pair];
                      const isRowNoTrade =
                        !loadedOrder &&
                        (computed.executionReadiness === 'NO_TRADE_CHOP' ||
                          computed.executionReadiness === 'NO_TRADE_CLOSED');
                      return (
                        <tr
                          key={m.pair}
                          onClick={() => handleOpenPairCard(m.pair)}
                          className="hover:bg-slate-900/80 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-3 text-[#D4AF37] font-black">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <div className="font-black text-white">{m.pair}</div>
                            <div className="text-[10px] text-slate-400">
                              {activeTf} · {computed.confidence}% AI
                              {loadedOrder ? ' · ACTIVE' : ''}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-[#D4AF37]">{m.price}</td>
                          <td className={`py-3 px-3 text-right font-bold ${pctPos ? 'text-[#00C261]' : 'text-red-400'}`}>
                            {pctPos ? `+${m.change24hPct.toFixed(2)}%` : `${m.change24hPct.toFixed(2)}%`}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                  isRowNoTrade
                                    ? 'bg-slate-800 text-amber-300 border border-slate-700'
                                    : isBuy
                                    ? 'bg-[#00C261]/20 text-[#00C261]'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {isRowNoTrade
                                  ? computed.executionReadiness === 'NO_TRADE_CLOSED'
                                    ? 'CLOSED'
                                    : 'STAND ASIDE'
                                  : computed.direction}
                              </span>
                              <span className="text-[10px] text-slate-300 truncate max-w-[140px]">
                                {computed.executionReadiness === 'READY_ENTER'
                                  ? 'READY NOW'
                                  : computed.executionReadiness === 'WAIT_PULLBACK'
                                  ? 'WAIT PULLBACK'
                                  : computed.executionReadiness === 'NO_TRADE_CLOSED'
                                  ? 'MARKET CLOSED'
                                  : 'CHOP · NO TRADE'}
                              </span>
                            </div>
                          </td>
                          <td className={`py-3 px-3 text-right ${isRowNoTrade ? 'text-slate-500' : 'text-slate-200'}`}>
                            {computed.entryPrice}
                          </td>
                          <td className={`py-3 px-3 text-right font-bold ${isRowNoTrade ? 'text-slate-500' : 'text-red-300'}`}>
                            {computed.stopLoss}
                          </td>
                          <td className={`py-3 px-3 text-right font-bold ${isRowNoTrade ? 'text-slate-500' : 'text-[#00C261]'}`}>
                            {computed.tp2}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {isRowNoTrade ? (
                              <>
                                <span className="text-slate-500 font-bold">Ref Only</span>
                                <span className="text-slate-600 block text-[10px]">{computed.riskReward}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-[#00C261] font-black">+${computed.netProfitUsd.toFixed(2)}</span>
                                <span className="text-slate-500 block text-[10px]">{computed.riskReward}</span>
                              </>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="text-cyan-300 font-bold">{(computed.adxStrength ?? 21).toFixed(0)}</span>
                            <span className="text-slate-400 block text-[10px]">{computed.macdBias || 'FLAT'}</span>
                          </td>
                          <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const rule = globalLiveStream.addPriceAlert({
                                    pair: m.pair,
                                    targetPrice: m.ema20,
                                    label: '20 EMA Pullback'
                                  });
                                  if (rule) {
                                    handleQuickCopyValue(rule.targetPrice, `tbl-al-${m.pair}`);
                                  }
                                }}
                                className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] inline-flex items-center gap-1"
                                title={`Arm live pullback alert at EMA20 (${m.ema20})`}
                              >
                                <Bell className="w-3 h-3" />
                                <span>{copiedCardPair === `tbl-al-${m.pair}` ? 'Armed' : 'Alert'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickCopyValue(computed.stopLoss, `tbl-sl-${m.pair}`)}
                                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[10px]"
                                title="Copy SL"
                              >
                                {copiedCardPair === `tbl-sl-${m.pair}` ? 'SL ✓' : 'SL'}
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenTradingViewForPair(m.pair, activeTf, m.price)}
                                className="px-2 py-1 rounded bg-sky-950/70 hover:bg-sky-500 text-sky-300 hover:text-black border border-sky-500/40 text-[10px] font-bold"
                              >
                                TV
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenPairCard(m.pair)}
                                className="px-2.5 py-1 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black text-[10px] font-black"
                              >
                                Inspect
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
          ) : (
          /* 3-TIER ACTIONABLE SUMMARY CARDS: READY NOW | PULLBACK WATCHLIST | STAND ASIDE (COLLAPSIBLE) */
          (() => {
            const rankByPair = new Map<CurrencyPair, number>();
            filteredMarkets.forEach((m, i) => rankByPair.set(m.pair, i + 1));

            const readyCards = filteredMarkets.filter(
              (m) => Boolean(activeOrders[m.pair]) || m.executionReadiness === 'READY_ENTER'
            );
            const pullbackCards = filteredMarkets.filter(
              (m) => !activeOrders[m.pair] && m.executionReadiness === 'WAIT_PULLBACK'
            );
            const blockedCards = filteredMarkets.filter(
              (m) =>
                !activeOrders[m.pair] &&
                (m.executionReadiness === 'NO_TRADE_CHOP' ||
                  m.executionReadiness === 'NO_TRADE_CLOSED')
            );

            const renderSummaryCard = (m: MarketScanData) => {
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
                candles: m.candles,
                swingLow: cardSwings.swingLow,
                swingHigh: cardSwings.swingHigh,
                change24hPct: m.change24hPct,
                macro: macroContext,
                h1TrendDirection: m.h1TrendDirection,
                bosAnalysis: m.bosAnalysis,
                riskConfig
              });
              const isBuy = computed.direction === 'BUY';
              const pctPositive = m.change24hPct >= 0;
              const rank = rankByPair.get(m.pair) || 1;
              const kenyaTiming = evaluatePairKenyaTiming(m.pair);
              const tickUp = m.lastTickDir === 'UP';
              const tickDown = m.lastTickDir === 'DOWN';
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
              const isCardNoTrade =
                !loadedOrder &&
                (computed.executionReadiness === 'NO_TRADE_CHOP' ||
                  computed.executionReadiness === 'NO_TRADE_CLOSED');

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
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 font-mono tabular-nums hover:-translate-y-0.5 ${
                    kenyaTiming.windowStatusCode === 'CLOSED_WAIT'
                      ? 'bg-[#060912] opacity-85 border-slate-800/80 hover:border-slate-600'
                      : loadedOrder
                      ? 'bg-[#081713] border-[#00C261] shadow-[0_0_20px_rgba(0,194,97,0.16)]'
                      : computed.executionReadiness === 'READY_ENTER'
                      ? 'bg-[#0A141A] border-[#00C261]/70 shadow-[0_0_16px_rgba(0,194,97,0.12)]'
                      : computed.executionReadiness === 'WAIT_PULLBACK'
                      ? 'bg-[#0D111C] border-amber-500/45 hover:border-[#D4AF37]'
                      : 'bg-[#080C16] border-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Rank + Readiness Verdict */}
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className="text-[#D4AF37] font-black">
                        #{rank} · {activeTf} · {computed.institutionalTelemetry ? `${computed.institutionalTelemetry.estimatedWinProbPct}% WinP` : `${computed.confidence}% AI`}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-black ${
                          computed.executionReadiness === 'READY_ENTER'
                            ? isBuy
                              ? 'bg-[#00C261] text-black'
                              : 'bg-red-600 text-white'
                            : computed.executionReadiness === 'WAIT_PULLBACK'
                            ? 'bg-amber-400 text-black'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {computed.executionReadiness === 'NO_TRADE_CLOSED'
                          ? 'CLOSED'
                          : computed.executionReadiness === 'READY_ENTER'
                          ? `READY ${computed.direction}`
                          : computed.executionReadiness === 'WAIT_PULLBACK'
                          ? `WATCH ${computed.direction}`
                          : 'STAND ASIDE'}
                      </span>
                    </div>

                    {/* Pair + Live Price + 24h % */}
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-lg font-black text-white">{m.pair}</span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-black ${
                          pctPositive ? 'text-[#00C261]' : 'text-red-400'
                        }`}
                      >
                        {pctPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{pctPositive ? `+${m.change24hPct.toFixed(2)}%` : `${m.change24hPct.toFixed(2)}%`}</span>
                      </span>
                    </div>

                    <div className="text-xs font-black text-white flex items-center justify-between gap-1">
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
                      <span className="text-[10px] text-slate-400 truncate">
                        {kenyaTiming.windowStatusCode === 'CLOSED_WAIT'
                          ? `Opens ${kenyaTiming.countdownFormatted}`
                          : computed.recommendedStrategy}
                      </span>
                    </div>

                    {/* 4-Timeframe Alignment Strip */}
                    {computed.mtfAlignment && (
                      <div className="flex items-center justify-between gap-1 text-[10px] bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800">
                        <span className="font-black truncate" style={{ color: computed.mtfAlignment.tierColor }}>
                          {computed.mtfAlignment.tierGrade}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-[9px] shrink-0">
                          <span className={`px-1 rounded ${computed.mtfAlignment.m5 === 'BULLISH' ? 'text-[#00C261] bg-emerald-950/60' : 'text-red-400 bg-red-950/60'}`}>M5</span>
                          <span className={`px-1 rounded ${computed.mtfAlignment.m15 === 'BULLISH' ? 'text-[#00C261] bg-emerald-950/60' : 'text-red-400 bg-red-950/60'}`}>M15</span>
                          <span className={`px-1 rounded font-bold border border-[#D4AF37]/50 ${computed.mtfAlignment.h1 === 'BULLISH' ? 'text-[#00C261] bg-emerald-950/80' : 'text-red-400 bg-red-950/80'}`}>1H</span>
                          <span className={`px-1 rounded ${computed.mtfAlignment.h4 === 'BULLISH' ? 'text-[#00C261] bg-emerald-950/60' : 'text-red-400 bg-red-950/60'}`}>H4</span>
                        </div>
                      </div>
                    )}

                    {/* Trigger Corridor / Pullback Distance */}
                    {!isCardNoTrade && computed.advisoryDiscountPips && computed.advisoryDiscountPips > 0 ? (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-950/35 border border-amber-500/40 text-[10px] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="text-amber-300 font-bold block truncate">
                            20 EMA Limit @ {computed.advisoryEntryPrice}
                          </span>
                          <span className="text-slate-400 text-[9px] block">
                            {computed.advisoryDiscountPips}p away
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const armed = globalLiveStream.armPendingLimitOrder({
                                pair: m.pair,
                                direction: computed.direction,
                                limitEntryPrice: computed.advisoryEntryPrice ?? m.ema20,
                                timeframe: activeTf,
                                broker: selectedBroker
                              });
                              if (armed) handleQuickCopyValue(armed.limitEntryPrice, `card-lim-${m.pair}`);
                            }}
                            className="px-2 py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/45 font-black text-[9px] whitespace-nowrap transition"
                            title={`Arm ${computed.direction} LIMIT @ ${computed.advisoryEntryPrice ?? m.ema20}`}
                          >
                            {copiedCardPair === `card-lim-${m.pair}` ? 'Limit ✓' : 'Arm Limit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const rule = globalLiveStream.addPriceAlert({
                                pair: m.pair,
                                targetPrice: computed.advisoryEntryPrice ?? m.ema20,
                                label: '20 EMA Trigger Alert'
                              });
                              if (rule) handleQuickCopyValue(rule.targetPrice, `card-al-${m.pair}`);
                            }}
                            className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 font-black text-[9px] inline-flex items-center gap-1 shrink-0 transition"
                          >
                            <Bell className="w-3 h-3" />
                            <span>{copiedCardPair === `card-al-${m.pair}` ? 'Armed' : 'Alert'}</span>
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Active Loaded Market Order Progress Strip */}
                  {loadedOrder && orderMetrics && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-emerald-950/45 border border-[#00C261]/60 space-y-1 text-[10px]"
                    >
                      <div className="flex items-center justify-between gap-1 font-black">
                        <span className="text-[#00C261]">
                          {loadedOrder.direction} @ {loadedOrder.entryPrice}
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
                    </div>
                  )}

                  {/* Concise SL & TP Summary Box */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs space-y-2 ${
                      isCardNoTrade ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center justify-between gap-1 bg-slate-950/70 px-2 py-1 rounded-lg border border-red-500/25">
                        <div className="min-w-0">
                          <span className="text-[9px] text-red-400 block">
                            {isCardNoTrade ? 'Ref SL' : `SL (-${computed.slPips}p)`}
                          </span>
                          <strong className="text-red-300 text-[11px] truncate block">{cardSl}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCopyValue(cardSl, `card-sl-${m.pair}`)}
                          className="p-1 rounded bg-slate-900 hover:bg-red-950 text-red-300 border border-slate-700 shrink-0"
                          title={`Copy Stop Loss ${cardSl}`}
                        >
                          {copiedCardPair === `card-sl-${m.pair}` ? (
                            <Check className="w-3 h-3 text-[#00C261]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-1 bg-slate-950/70 px-2 py-1 rounded-lg border border-emerald-500/25">
                        <div className="min-w-0">
                          <span className="text-[9px] text-emerald-400 block">
                            {isCardNoTrade ? 'Ref TP' : `TP (+${computed.tpPips}p)`}
                          </span>
                          <strong className="text-[#00C261] text-[11px] truncate block">{cardTp}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickCopyValue(cardTp, `card-tp-${m.pair}`)}
                          className="p-1 rounded bg-slate-900 hover:bg-emerald-950 text-[#00C261] border border-slate-700 shrink-0"
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

                    <EntryConfirmationController
                      pair={m.pair}
                      computed={computed}
                      kenyaTiming={kenyaTiming}
                      livePrice={m.price}
                      timeframe={activeTf}
                      lockedOrder={loadedOrder}
                      variant="compact"
                      onInspectDetails={() => handleOpenPairCard(m.pair)}
                    />
                  </div>

                  {/* Single Primary Footer Action Row */}
                  <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80 text-[10px]">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onOpenTradingViewForPair(m.pair, activeTf, m.price)}
                        className="px-2 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-500 text-sky-300 hover:text-black border border-sky-500/40 font-black text-[10px] inline-flex items-center gap-1 transition"
                      >
                        <BarChart3 className="w-3 h-3" />
                        <span>TV</span>
                      </button>
                      {!loadedOrder && computed.executionReadiness === 'READY_ENTER' && (
                        <button
                          type="button"
                          onClick={() => handleQuickLoadCardOrder(m.pair, computed.direction, activeTf)}
                          className={`px-2 py-1 rounded-lg font-black text-[10px] transition ${
                            isBuy
                              ? 'bg-[#00C261] hover:bg-[#00dc6e] text-black'
                              : 'bg-red-600 hover:bg-red-500 text-white'
                          }`}
                        >
                          Exec {computed.direction}
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPairCard(m.pair);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-black text-[10px] flex items-center gap-1 transition whitespace-nowrap"
                    >
                      <span>{loadedOrder ? 'Manage' : 'Chart & EA'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-5 font-mono">
                {/* TIER 1: READY TO EXECUTE NOW OR ACTIVE OPEN POSITIONS */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-2 text-xs font-black text-[#00C261]">
                      <Zap className="w-4 h-4 shrink-0" />
                      <span>TIER 1 · READY TO EXECUTE NOW ({readyCards.length})</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Highest probability 20/50 EMA value entries
                    </span>
                  </div>
                  {readyCards.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
                      <span>
                        No pair currently meets every READY_ENTER entry rule at this minute — inspect Tier 2 Pullback Watchlist below or open any chart to stage BUY/SELL manually.
                      </span>
                      <span className="text-amber-300 font-bold">0 Chasing Allowed</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {readyCards.map((m) => renderSummaryCard(m))}
                    </div>
                  )}
                </div>

                {/* TIER 2: PULLBACK WATCHLIST */}
                {pullbackCards.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 px-1">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>TIER 2 · PULLBACK WATCHLIST — WAIT 20 EMA RETEST ({pullbackCards.length})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Trend clear — arm Alert Bell at Sniper Limit price
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {pullbackCards.map((m) => renderSummaryCard(m))}
                    </div>
                  </div>
                )}

                {/* TIER 3: STAND ASIDE / CHOP / CLOSED (COLLAPSIBLE TO PREVENT VISUAL CLUTTER) */}
                {blockedCards.length > 0 && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setShowChopTier((prev) => !prev)}
                      className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs transition"
                    >
                      <div className="flex items-center gap-2 text-slate-300 font-bold">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          TIER 3 · STAND ASIDE / CHOP / CLOSED ({blockedCards.length} Markets Filtered Out)
                        </span>
                      </div>
                      <span className="text-[#D4AF37] font-black inline-flex items-center gap-1">
                        <span>{showChopTier ? 'Collapse Blocked Markets' : 'Inspect Blocked Markets'}</span>
                        {showChopTier ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    {showChopTier && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {blockedCards.map((m) => renderSummaryCard(m))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()
          )}
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
        liveFloatingUsd={liveFloatingUsd}
        liveOpenRiskUsd={liveExposureSummary.totalOpenRiskUsd}
        openOrdersCount={openOrdersList.length}
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
