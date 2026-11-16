import React, { useState, useEffect } from 'react';
import { CurrencyPair, PageTab } from '../types';
import { PILLARS_MASTERCLASS_DATA } from '../data/pillarsMasterclassData';
import {
  MarketScanData,
  DailyMacroAiDirective,
  globalLiveStream,
  computeRealChartTradeParams,
  computeCandleSwingLevels,
  getCurrentMacroContext,
  positionRiskStore
} from '../utils/liveMarketEngine';
import { ActiveMarketOrderPanel } from '../components/tools/ActiveMarketOrderPanel';
import heroDeskImg from '../assets/images/hero_desk_telemetry_1793873187661.jpg';
import {
  GraduationCap,
  CandlestickChart,
  Target,
  Scan,
  ShieldCheck,
  Brain,
  Activity,
  Award,
  ArrowRight,
  Globe,
  TrendingUp,
  TrendingDown,
  Copy,
  Check,
  ClipboardList,
  Camera,
  Shield,
  Layers
} from 'lucide-react';

interface LandingPageProps {
  onSelectPillar: (route: PageTab) => void;
  onOpenPairWorkspace?: (pair: CurrencyPair) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPillar,
  onOpenPairWorkspace,
}) => {
  const [allMarkets, setAllMarkets] = useState<MarketScanData[]>(
    () => globalLiveStream.getState().markets
  );
  const [dailyMacroDirective, setDailyMacroDirective] = useState<DailyMacroAiDirective>(
    () => globalLiveStream.getState().dailyMacroDirective
  );
  const [syncedAt, setSyncedAt] = useState<string>(() => globalLiveStream.getState().syncedAt);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {}
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setAllMarkets(streamState.markets);
      setDailyMacroDirective(streamState.dailyMacroDirective);
      setSyncedAt(streamState.syncedAt);
    });
    return () => unsubscribe();
  }, []);

  const macroContext = (() => {
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    allMarkets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    return getCurrentMacroContext(pctMap);
  })();

  // Compute live trade params for the #1 trending mover
  const topMover = allMarkets[0];
  const topMoverTrade = (() => {
    if (!topMover) return null;
    const cardSwings = computeCandleSwingLevels(topMover.candles);
    const computed = computeRealChartTradeParams({
      targetPair: topMover.pair,
      targetTf: topMover.recommendedTf,
      targetBroker: 'fxpesa',
      price: topMover.price,
      keyLevel: topMover.keyLevel,
      ema20: topMover.ema20,
      ema50: topMover.ema50,
      rsi: topMover.rsi,
      atrPips: topMover.atrPips,
      candles: topMover.candles,
      swingLow: cardSwings.swingLow,
      swingHigh: cardSwings.swingHigh,
      change24hPct: topMover.change24hPct,
      macro: macroContext,
      h1TrendDirection: topMover.h1TrendDirection,
      bosAnalysis: topMover.bosAnalysis,
      riskConfig: positionRiskStore.getConfig()
    });
    return {
      topMover,
      computed,
      isBuy: computed.direction === 'BUY',
      pctPos: topMover.change24hPct >= 0,
      ticket: `${topMover.pair} ${computed.direction} | Entry: ${computed.entryPrice} | SL: ${computed.stopLoss} | TP1: ${computed.tp1} | TP2: ${computed.tp2} | Lot: ${computed.lotSize} (Risk: $${computed.actualRiskUsd})`
    };
  })();

  const getPillarIcon = (number: string) => {
    switch (number) {
      case '01':
        return <GraduationCap className="w-6 h-6 text-[#D4AF37]" />;
      case '02':
        return <CandlestickChart className="w-6 h-6 text-[#D4AF37]" />;
      case '03':
        return <Target className="w-6 h-6 text-[#D4AF37]" />;
      case '04':
        return <Scan className="w-6 h-6 text-[#D4AF37]" />;
      case '05':
        return <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />;
      case '06':
        return <Brain className="w-6 h-6 text-[#D4AF37]" />;
      case '07':
        return <Activity className="w-6 h-6 text-[#D4AF37]" />;
      case '08':
        return <Award className="w-6 h-6 text-[#D4AF37]" />;
      default:
        return <Globe className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  const handleOpenMarketRadar = () => {
    onSelectPillar('/ai-scanner');
  };

  const handleOpenCameraScanner = () => {
    globalLiveStream.requestOpenScannerView('camera');
  };

  const handleOpenTradeLog = () => {
    globalLiveStream.requestOpenScannerView('trade_log');
  };

  return (
    <div className="space-y-10 pb-24">
      {/* 1. INSTITUTIONAL HERO SECTION */}
      <section className="rounded-3xl bg-[#0B101E] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Narrative & High-Priority Actions */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] flex-wrap tabular-nums">
                <span className="font-bold">PivotFx Prop Firm &amp; Forex Academy</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">Nairobi EAT Live Sync ({syncedAt})</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.06] text-balance">
                Zero to <span className="text-gold-gradient">Funded Trader</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Transform personal capital into funded institutional accounts. Live multi-market scans, sustainable 10-factor BOS/CHoCH + ADX/MACD confluence projections, dynamic risk-calibrated sizing, and real-time Nairobi session countdowns.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenMarketRadar}
                className="px-6 py-4 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 whitespace-nowrap shrink-0 shadow-[0_0_24px_rgba(212,175,55,0.3)]"
              >
                <span>Launch Super AI Radar (Pillar 04)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOpenCameraScanner}
                className="px-5 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs border border-slate-700 hover:border-[#D4AF37] transition flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Camera className="w-4 h-4 text-[#D4AF37]" />
                <span>Camera Chart Scanner</span>
              </button>
            </div>
          </div>

          {/* Right Visual Panel with Architectural Neon Building Signage */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-[#080C15] border-t lg:border-t-0 lg:border-l border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Glowing Architectural Building Signage inside Prop Floor */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-[#D4AF37]/90 shadow-[0_0_24px_rgba(212,175,55,0.55)]">
              <ShieldCheck className="w-4 h-4 text-[#00C261] shrink-0" />
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-black tracking-widest text-[#D4AF37] uppercase leading-none">
                  PIVOT FX PROP TRADING FLOOR
                </span>
                <span className="font-mono text-[9px] text-slate-400 leading-tight mt-0.5">
                  NAIROBI FINANCIAL DISTRICT · 36.82° E
                </span>
              </div>
            </div>

            {!heroImgFailed ? (
              <img
                src={heroDeskImg}
                alt="Institutional multi-asset quantitative trading floor with illuminated building displays"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full lg:h-full object-cover object-center brightness-110 contrast-105 opacity-95 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 to-slate-950">
                <CandlestickChart className="w-10 h-10 text-[#D4AF37] mb-2" />
                <span className="text-sm font-bold text-white">PivotFx Execution Desk</span>
                <span className="text-xs text-slate-400 font-mono">Multi-Asset Order Flow &amp; Risk Engine</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-2 text-xs font-mono text-slate-200 tabular-nums flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#00C261]" />
                <span>Gilgil Shield · Max $2.80 / 364 KES per 0.01 Lot</span>
              </span>
              <span className="text-[#D4AF37] font-bold">CMA KE Standard</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAY & THIS HOUR — SINGLE STREAMLINED NOTIFICATION CARD */}
      <section className="rounded-2xl bg-gradient-to-r from-[#0B1120] via-[#0E1528] to-[#0B1120] border border-[#D4AF37]/50 shadow-[0_0_25px_rgba(212,175,55,0.12)] p-5 sm:p-6 space-y-4 font-mono tabular-nums">
        {/* Top Notification Status Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Activity className="w-4 h-4 text-[#00C261] shrink-0" />
            <span className="text-xs font-black tracking-wider text-[#D4AF37] uppercase">
              LIVE SESSION DIRECTIVE · {macroContext.sessionWindowName}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-300">
              EAT {macroContext.eatTimeString}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-lg text-[11px] font-black tracking-wide border ${
                macroContext.overallDaySafety === 'FAVOURABLE_BUY'
                  ? 'bg-emerald-950/60 text-[#00C261] border-[#00C261]/60 shadow-[0_0_12px_rgba(0,194,97,0.2)]'
                  : macroContext.overallDaySafety === 'FAVOURABLE_SELL'
                  ? 'bg-red-950/60 text-red-400 border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/60'
              }`}
            >
              {macroContext.overallDaySafety === 'FAVOURABLE_BUY'
                ? 'FAVOURABLE BUY REGIME'
                : macroContext.overallDaySafety === 'FAVOURABLE_SELL'
                ? 'FAVOURABLE SELL REGIME'
                : 'SELECTIVE CAUTION REGIME'}
            </span>

            <span className="text-xs text-slate-400">
              {macroContext.riskRegime}
            </span>
          </div>
        </div>

        {/* Middle Directive Headline & Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-8 space-y-1.5 font-sans">
            <h2 className="text-base sm:text-xl font-black text-white leading-snug">
              {dailyMacroDirective.headline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {dailyMacroDirective.hourlyOutlook}
            </p>
          </div>

          {/* Quick Pillar 04 Navigation & Tools */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 justify-end font-mono">
            <button
              type="button"
              onClick={handleOpenMarketRadar}
              className="flex-1 lg:w-full px-4 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>View All {allMarkets.length || 15} in Pillar 04</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleOpenCameraScanner}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#D4AF37] font-bold text-xs inline-flex items-center justify-center gap-1.5 transition"
              >
                <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Camera Scan</span>
              </button>
              <button
                type="button"
                onClick={handleOpenTradeLog}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Trade Log</span>
              </button>
            </div>
          </div>
        </div>

        {/* High-Confluence #1 Trending Market Directive Strip */}
        {topMoverTrade && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] font-black text-[10px] tracking-wider border border-[#D4AF37]/30">
                #1 TRENDING MOVER
              </span>
              <span
                className={`px-2 py-0.5 rounded font-black text-[10px] tracking-wider ${
                  topMoverTrade.computed.executionReadiness === 'READY_ENTER'
                    ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40'
                    : topMoverTrade.computed.executionReadiness === 'WAIT_PULLBACK'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {topMoverTrade.computed.executionReadiness === 'READY_ENTER'
                  ? 'READY'
                  : topMoverTrade.computed.executionReadiness === 'WAIT_PULLBACK'
                  ? 'WAIT PULLBACK'
                  : 'STAND ASIDE'}
              </span>
              <span className="text-base font-black text-white">
                {topMoverTrade.topMover.pair}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  topMoverTrade.pctPos ? 'text-[#00C261]' : 'text-red-400'
                }`}
              >
                {topMoverTrade.pctPos ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {topMoverTrade.pctPos
                  ? `+${topMoverTrade.topMover.change24hPct.toFixed(2)}%`
                  : `${topMoverTrade.topMover.change24hPct.toFixed(2)}%`}
              </span>
              <span className="text-slate-600">·</span>
              <span
                className={`font-black ${
                  topMoverTrade.isBuy ? 'text-[#00C261]' : 'text-red-400'
                }`}
              >
                {topMoverTrade.computed.direction} @ {topMoverTrade.computed.entryPrice}
              </span>
              <span className="text-slate-400">
                SL: <strong className="text-red-300">{topMoverTrade.computed.stopLoss}</strong> · TP1: <strong className="text-[#00C261]">{topMoverTrade.computed.tp1}</strong> · TP2: <strong className="text-[#00C261]">{topMoverTrade.computed.tp2}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                Lot: {topMoverTrade.computed.lotSize} (Risk: ${topMoverTrade.computed.actualRiskUsd})
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono">
                {topMoverTrade.computed.recommendedStrategy} · {topMoverTrade.computed.tvSymbol}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    topMoverTrade.ticket,
                    `top-mover-ticket-${topMoverTrade.topMover.pair}`
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#D4AF37] text-xs font-bold inline-flex items-center gap-1.5 transition"
                title="Copy complete ticket for MT4/MT5"
              >
                {copiedKey === `top-mover-ticket-${topMoverTrade.topMover.pair}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00C261]" />
                    <span className="text-[#00C261]">Ticket Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Copy MT4/MT5 Ticket</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenPairWorkspace) {
                    onOpenPairWorkspace(topMoverTrade.topMover.pair);
                  } else {
                    handleOpenMarketRadar();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold inline-flex items-center gap-1 transition"
              >
                <span>Inspect in Radar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. ACTIVE BROKER ORDERS SUMMARY BANNER (Live broker order progress monitor) */}
      <ActiveMarketOrderPanel
        mode="summary_banner"
        broker={globalLiveStream.getState().activeBroker}
        onInspectPairCard={(targetPair) =>
          onOpenPairWorkspace ? onOpenPairWorkspace(targetPair) : onSelectPillar('/ai-scanner')
        }
      />

      {/* 3.5 LIVE 15-MARKET PULSE STRIP (Click any asset to inspect chart & AI ticket) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-bold">
            <Activity className="w-3.5 h-3.5 text-[#00C261]" />
            <span>Live Multi-Market Ticker Matrix ({allMarkets.length} Assets · Ranked Top % to Least %)</span>
          </div>
          <button
            type="button"
            onClick={handleOpenMarketRadar}
            className="text-xs font-mono font-bold text-slate-300 hover:text-[#D4AF37] transition inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Open Full Execution Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 font-mono tabular-nums">
          {allMarkets.slice(0, 10).map((mkt, i) => {
            const isBuy = mkt.bias === 'STRONG_BUY';
            const isSell = mkt.bias === 'STRONG_SELL';
            const pctPos = mkt.change24hPct >= 0;
            return (
              <button
                key={mkt.pair}
                type="button"
                onClick={() =>
                  onOpenPairWorkspace ? onOpenPairWorkspace(mkt.pair) : handleOpenMarketRadar()
                }
                className="p-3 rounded-xl bg-[#0B101E] hover:bg-[#11192E] border border-slate-800 hover:border-[#D4AF37]/60 text-left transition space-y-1.5"
              >
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  <span className="text-slate-400">#{i + 1} · {mkt.recommendedTf}</span>
                  <span
                    className={`font-black ${
                      isBuy ? 'text-[#00C261]' : isSell ? 'text-red-400' : 'text-amber-300'
                    }`}
                  >
                    {isBuy ? 'BUY' : isSell ? 'SELL' : 'WAIT'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-1">
                  <strong className="text-xs sm:text-sm text-white font-black">{mkt.pair}</strong>
                  <span className={`text-[11px] font-bold ${pctPos ? 'text-[#00C261]' : 'text-red-400'}`}>
                    {pctPos ? `+${mkt.change24hPct.toFixed(2)}%` : `${mkt.change24hPct.toFixed(2)}%`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-slate-200 font-semibold">@ {mkt.price}</span>
                  <span>{mkt.confidence}% AI</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. NINE INSTITUTIONAL ACADEMY PILLARS (Asymmetric Bento Showcase) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-bold">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Nine Institutional Workstations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight text-balance">
              Pillar Workstations &amp; Prop Curriculum
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-md">
            Select any workstation to launch its live quantitative tools alongside structured institutional lessons.
          </p>
        </div>

        {/* Tier A: Marquee Execution & Risk Workstations (Bento 2+1+1 Hierarchy) */}
        {(() => {
          const pillar04 = PILLARS_MASTERCLASS_DATA.find((p) => p.number === '04');
          const pillar02 = PILLARS_MASTERCLASS_DATA.find((p) => p.number === '02');
          const pillar05 = PILLARS_MASTERCLASS_DATA.find((p) => p.number === '05');
          const coreSet = new Set(['04', '02', '05']);
          const remainingPillars = PILLARS_MASTERCLASS_DATA.filter((p) => !coreSet.has(p.number));

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {pillar04 && (
                  <button
                    type="button"
                    onClick={() => onSelectPillar(pillar04.id)}
                    className="lg:col-span-6 group p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#0B101E] to-[#0A1324] border border-[#D4AF37]/50 hover:border-[#D4AF37] transition flex flex-col justify-between text-left space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37] font-black">Pillar {pillar04.number}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#00C261] font-bold">Core Execution Engine</span>
                          <span aria-hidden="true">·</span>
                          <span>{allMarkets.length || 15} Live Markets</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-[#D4AF37]/50 transition">
                          {getPillarIcon(pillar04.number)}
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#D4AF37] transition-colors">
                        {pillar04.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {pillar04.oneLineHook} Includes Gemini multimodal chart photo OCR, 10-factor BOS/CHoCH matrix, live broker order tracking, and Position Coach.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-black text-[#D4AF37] group-hover:text-white">
                      <span>Launch Radar &amp; Camera OCR</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                )}

                {[pillar02, pillar05].map(
                  (pillar) =>
                    pillar && (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => onSelectPillar(pillar.id)}
                        className="lg:col-span-3 group p-6 rounded-2xl bg-[#0B101E] border border-slate-800 hover:border-[#D4AF37] transition flex flex-col justify-between text-left space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400">
                            <span>Pillar {pillar.number} · {pillar.lessons.length} Lessons</span>
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-[#D4AF37]/40 transition">
                              {getPillarIcon(pillar.number)}
                            </div>
                          </div>
                          <h3 className="text-lg font-black text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                            {pillar.title}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                            {pillar.oneLineHook}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-[#D4AF37] group-hover:text-white">
                          <span>Enter Workstation</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    )
                )}
              </div>

              {/* Tier B: 6 Structured Academy & Risk Chambers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {remainingPillars.map((pillar) => (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => onSelectPillar(pillar.id)}
                    className="group p-6 rounded-2xl bg-[#0B101E] border border-slate-800 hover:border-[#D4AF37] transition flex flex-col justify-between text-left space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[#D4AF37] font-black">{pillar.number}.</span>
                          <span className="truncate">{pillar.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="shrink-0">{pillar.lessons.length} Lessons</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 group-hover:border-[#D4AF37]/40 transition-colors shrink-0">
                          {getPillarIcon(pillar.number)}
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {pillar.oneLineHook}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs font-mono font-bold text-[#D4AF37] group-hover:text-white transition-colors">
                      <span>Enter Workstation</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
};
