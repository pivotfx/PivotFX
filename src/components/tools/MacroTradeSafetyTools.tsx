import React, { useState, useEffect } from 'react';
import { PageTab, CurrencyPair, BrokerId } from '../../types';
import {
  MarketScanData,
  INITIAL_MARKETS_DATA,
  globalLiveStream,
  computeRealChartTradeParams,
  computeDailyMacroSafetyReport,
  MacroFactorFlags,
  SideSafetyVerdict
} from '../../utils/liveMarketEngine';
import { LiveInteractiveCandleChart } from './LiveInteractiveCandleChart';
import sessionWorldMapImg from '../../assets/images/session_world_map_1793873187765.jpg';
import {
  Globe,
  ShieldCheck,
  ShieldAlert,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Compass,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MacroTradeSafetyToolsProps {
  onNavigatePillar?: (route: PageTab) => void;
}

export const MacroTradeSafetyTools: React.FC<MacroTradeSafetyToolsProps> = ({
  onNavigatePillar,
}) => {
  const [markets, setMarkets] = useState<MarketScanData[]>(() => globalLiveStream.getState().markets);
  const [syncedAt, setSyncedAt] = useState<string>(() => globalLiveStream.getState().syncedAt);
  const [liveConnected, setLiveConnected] = useState<boolean>(() => globalLiveStream.getState().liveFeedConnected);
  const [lockedPairs, setLockedPairs] = useState<Partial<Record<CurrencyPair, boolean>>>(
    () => globalLiveStream.getState().lockedPairs
  );
  const [superAiNotes, setSuperAiNotes] = useState(
    () => globalLiveStream.getState().superAiNotes
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedBroker, setSelectedBroker] = useState<BrokerId>('fxpesa');
  const [selectedPairFilter, setSelectedPairFilter] = useState<CurrencyPair | 'ALL'>('ALL');
  const [focusedPair, setFocusedPair] = useState<CurrencyPair | null>(null);
  const [inspectedSide, setInspectedSide] = useState<'AUTO' | 'BUY' | 'SELL'>('AUTO');
  const [showManualOverrides, setShowManualOverrides] = useState<boolean>(false);
  const [manualFlags, setManualFlags] = useState<Partial<MacroFactorFlags>>({});
  const [mapImgFailed, setMapImgFailed] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setMarkets(streamState.markets);
      setSyncedAt(streamState.syncedAt);
      setLiveConnected(streamState.liveFeedConnected);
      setLockedPairs(streamState.lockedPairs);
      setSuperAiNotes(streamState.superAiNotes);
    });
    return () => unsubscribe();
  }, []);

  const refreshLiveMacroFeed = async () => {
    setIsRefreshing(true);
    await globalLiveStream.triggerScan('rescan');
    setIsRefreshing(false);
  };

  // Base report computes auto-detected daily micro/macro factors from live interbank flows
  const autoBaseReport = computeDailyMacroSafetyReport(markets);
  const effectiveFlags: MacroFactorFlags = {
    highImpactUsNews: manualFlags.highImpactUsNews ?? autoBaseReport.autoDetectedFactors.highImpactUsNews,
    centralBankRateDay: manualFlags.centralBankRateDay ?? autoBaseReport.autoDetectedFactors.centralBankRateDay,
    geopoliticalSafeHavenSpike:
      manualFlags.geopoliticalSafeHavenSpike ?? autoBaseReport.autoDetectedFactors.geopoliticalSafeHavenSpike,
    bankHolidayThinLiquidity:
      manualFlags.bankHolidayThinLiquidity ?? autoBaseReport.autoDetectedFactors.bankHolidayThinLiquidity,
    wideSpreadAlert: manualFlags.wideSpreadAlert ?? autoBaseReport.autoDetectedFactors.wideSpreadAlert
  };

  const report = computeDailyMacroSafetyReport(markets, effectiveFlags);

  const toggleFlag = (key: keyof MacroFactorFlags) => {
    setManualFlags((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? autoBaseReport.autoDetectedFactors[key])
    }));
  };

  const renderVerdictBadge = (verdict: SideSafetyVerdict, sideLabel: 'BUY' | 'SELL', score: number) => {
    if (verdict === 'SAFE_OPTIMAL') {
      return (
        <div className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-[#00C261]/50 text-[#00C261] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-black">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>SAFE TO {sideLabel} ✓</span>
          </div>
          <span className="font-black text-xs">{score}/100</span>
        </div>
      );
    }
    if (verdict === 'SAFE_SELECTIVE') {
      return (
        <div className="px-3 py-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>SELECTIVE {sideLabel}</span>
          </div>
          <span className="font-bold text-xs">{score}/100</span>
        </div>
      );
    }
    if (verdict === 'CAUTION_WAIT') {
      return (
        <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>WAIT / CAUTION {sideLabel}</span>
          </div>
          <span className="font-bold text-xs">{score}/100</span>
        </div>
      );
    }
    return (
      <div className="px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>NOT SAFE TO {sideLabel}</span>
        </div>
        <span className="font-bold text-xs">{score}/100</span>
      </div>
    );
  };

  const visibleScorecards =
    selectedPairFilter === 'ALL'
      ? report.assetScorecards
      : report.assetScorecards.filter((c) => c.pair === selectedPairFilter);

  const focusedCard = focusedPair
    ? report.assetScorecards.find((c) => c.pair === focusedPair) || null
    : null;
  const focusedMarket = focusedPair
    ? markets.find((m) => m.pair === focusedPair) || INITIAL_MARKETS_DATA[0]
    : null;

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/35 my-6">
      {/* 1. TOP DAILY GLOBAL SAFETY HEADER & EVERY-SECOND KENYA EAT CLOCK */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#090F1D] border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap tabular-nums">
            <span className="text-[#D4AF37] font-bold">Global &amp; Kenya EAT Safety Shield</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#00C261] font-semibold">
              {liveConnected ? 'Live 0.5s Interbank Sync' : 'Live 0.5s Clock Sync'} ({syncedAt})
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Is It Safe to Buy or Sell Today? Kenya Time Sync &amp; Entry Guard
          </h3>
          <p className="text-xs text-slate-300 font-mono max-w-3xl">
            Detects daily USD basket shifts, safe-haven flows, and Nairobi (UTC+3) liquidity windows. Shows exact countdown timers when an entry window is unfavorable.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <select
            value={selectedBroker}
            onChange={(e) => setSelectedBroker(e.target.value as BrokerId)}
            aria-label="Select Broker"
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-xs focus:border-[#D4AF37] outline-none"
          >
            <option value="fxpesa">Broker: FXPesa (CMA)</option>
            <option value="exness">Broker: Exness Micro</option>
            <option value="hfm">Broker: HFM Standard</option>
            <option value="fbs">Broker: FBS Standard</option>
          </select>

          <button
            type="button"
            onClick={refreshLiveMacroFeed}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Rescan Macro Factors'}</span>
          </button>
        </div>
      </div>

      {/* 2. GLOBAL SESSION MAP & PROMINENT PLANNED-ENTRY SAFETY VERDICT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div
          className={`lg:col-span-8 p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
            report.overallDaySafety === 'SAFE_OPTIMAL'
              ? 'bg-emerald-950/35 border-[#00C261]/70 text-emerald-100'
              : report.overallDaySafety === 'SAFE_SELECTIVE'
              ? 'bg-cyan-950/35 border-cyan-400/60 text-cyan-100'
              : report.overallDaySafety === 'CAUTION_WAIT'
              ? 'bg-amber-950/40 border-amber-400/75 text-amber-100'
              : 'bg-red-950/55 border-red-500 text-red-100'
          }`}
        >
          <div className="space-y-1.5 font-mono">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider flex-wrap">
              {report.overallDaySafety === 'SAFE_OPTIMAL' || report.overallDaySafety === 'SAFE_SELECTIVE' ? (
                <ShieldCheck className="w-5 h-5 text-[#00C261] shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>
                {report.overallDaySafety === 'UNSAFE_AVOID'
                  ? 'GLOBAL ENTRY ALERT: AVOID BLIND ENTRIES RIGHT NOW'
                  : report.overallDaySafety === 'CAUTION_WAIT'
                  ? 'GLOBAL SESSION GUARD: OFF-PEAK OR VOLATILITY CAUTION'
                  : 'TODAY’S GLOBAL ENVIRONMENT VERDICT: CLEAR'}
              </span>
            </div>
            <p className="text-sm sm:text-base font-black text-white">
              {report.overallHeadline}
            </p>
            <p className="text-xs opacity-90 leading-relaxed">{report.sessionAdvice}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap font-mono tabular-nums pt-2 border-t border-white/10">
            <div className="text-xs">
              <span className="text-slate-400">Nairobi EAT: </span>
              <strong className="text-cyan-300">{report.eatTimeString}</strong>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="text-xs">
              <span className="text-slate-400">Gilgil Cap: </span>
              <strong className="text-[#D4AF37]">0.01 Lot · Max $2.00 / 260 KES</strong>
            </div>
          </div>
        </div>

        {/* 4:3 Cartographic Session Corridors Card */}
        <div className="lg:col-span-4 relative min-h-[170px] lg:min-h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          {!mapImgFailed ? (
            <img
              src={sessionWorldMapImg}
              alt="Global London, New York, Tokyo, and Nairobi foreign exchange liquidity corridors"
              referrerPolicy="no-referrer"
              onError={() => setMapImgFailed(true)}
              className="w-full h-full lg:h-full object-cover object-center opacity-85"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
              <Globe className="w-8 h-8 text-[#D4AF37] mb-1" />
              <span className="text-xs font-bold text-white">Global FX Session Corridors</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200 tabular-nums">
            <span>Tokyo · London · Nairobi · NY</span>
            <span className="text-[#D4AF37] font-bold">24/5 Flow</span>
          </div>
        </div>
      </div>

      {/* 3. AUTO-DETECTED DAILY MICRO & MACRO FACTORS (LIVE SUMMARY BAR) */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#D4AF37] font-bold">
            <Compass className="w-4 h-4 shrink-0" />
            <span>AUTO-DETECTED DAILY MICRO & MACRO DRIVERS (UPDATES LIVE EVERY SECOND):</span>
          </div>

          <button
            type="button"
            onClick={() => setShowManualOverrides(!showManualOverrides)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{showManualOverrides ? 'Hide Manual News Overrides' : 'Manual News Overrides'}</span>
            {showManualOverrides ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {report.autoDetectedSummary.map((line, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 leading-relaxed">
              {line}
            </div>
          ))}
        </div>

        {/* Optional Collapsible Manual Overrides (Keeps default view uncongested) */}
        {showManualOverrides && (
          <div className="pt-3 border-t border-slate-800 space-y-2.5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {([
                { key: 'highImpactUsNews', label: 'US NFP / CPI / FOMC Today', desc: 'Red-folder USD volatility' },
                { key: 'centralBankRateDay', label: 'BoE / ECB / BoJ Rate Day', desc: 'Central bank policy speech' },
                { key: 'geopoliticalSafeHavenSpike', label: 'Geopolitical Risk Spike', desc: 'Safe-haven Gold/JPY bid' },
                { key: 'bankHolidayThinLiquidity', label: 'London/NY Bank Holiday', desc: 'Thin false-breakout range' },
                { key: 'wideSpreadAlert', label: 'MT4 Spreads > 2.5 Pips', desc: 'High broker execution cost' }
              ] as { key: keyof MacroFactorFlags; label: string; desc: string }[]).map((item) => {
                const active = effectiveFlags[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleFlag(item.key)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1 ${
                      active
                        ? 'bg-red-950/60 border-red-500 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[11px]">{item.label}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          active ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {active ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {report.activeWarnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 space-y-1.5 text-red-200">
            {report.activeWarnings.map((w, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================================
          4. ISOLATED SINGLE-MARKET CARD INSPECTION VIEW vs 8-CARD SUMMARY GRID
          ===================================================================== */}
      {focusedCard && focusedMarket ? (
        (() => {
          const aiBestSide: 'BUY' | 'SELL' = focusedCard.buyScore >= focusedCard.sellScore ? 'BUY' : 'SELL';
          const effectiveSide: 'BUY' | 'SELL' = inspectedSide === 'AUTO' ? aiBestSide : inspectedSide;
          const computed = computeRealChartTradeParams({
            targetPair: focusedCard.pair,
            targetTf: focusedMarket.recommendedTf || 'M15',
            targetBroker: selectedBroker,
            price: focusedCard.livePrice,
            keyLevel: focusedMarket.keyLevel,
            ema20: focusedCard.ema20,
            ema50: focusedCard.ema50,
            rsi: focusedCard.rsi,
            atrPips: focusedMarket.atrPips,
            biasOverride: effectiveSide,
            previousDirection: aiBestSide,
            previousTrendDirection: focusedMarket.trendDirection,
            h1TrendDirection: focusedMarket.h1TrendDirection
          });

          return (
            <div className="space-y-5 animate-in fade-in duration-300 font-mono tabular-nums">
              {/* Top Return Bar + Check Other Side (BUY vs SELL) */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-[#D4AF37]/50 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setFocusedPair(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] hover:text-white border border-[#D4AF37]/40 text-xs font-bold transition group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>← Return to All 8 Markets Safety Cards</span>
                </button>

                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {(['AUTO', 'BUY', 'SELL'] as const).map((sOpt) => (
                    <button
                      key={sOpt}
                      type="button"
                      onClick={() => setInspectedSide(sOpt)}
                      className={`px-3 py-1.5 rounded-lg font-black transition ${
                        inspectedSide === sOpt
                          ? sOpt === 'BUY'
                            ? 'bg-[#00C261] text-black'
                            : sOpt === 'SELL'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#D4AF37] text-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sOpt === 'AUTO' ? `AI Primary (${aiBestSide})` : `Inspect ${sOpt} Side`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focused Market Master Card */}
              <div className="p-6 rounded-3xl bg-slate-950 border-2 border-[#D4AF37] shadow-2xl space-y-5">
                {/* Global Planned Entry Safety Banner + Trend Projection */}
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    focusedCard.isEntryBlockedGlobally
                      ? 'bg-red-950/65 border-red-500 text-red-100'
                      : 'bg-emerald-950/40 border-[#00C261]/60 text-emerald-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5 text-xs">
                    {focusedCard.isEntryBlockedGlobally ? (
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-[#00C261] shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <span className="font-black block text-white">
                        {focusedCard.pair} @ {focusedCard.livePrice} · {computed.trendProjectionText}
                      </span>
                      <p>{focusedCard.globalEntryBannerText}</p>
                      <p className="text-[11px] text-[#00C261] font-bold">{computed.profitOutlookText}</p>
                      <p className="text-[11px] text-amber-200">{computed.humanCheckNote}</p>
                    </div>
                  </div>
                </div>

                {/* Color-Coded Kenya EAT Entry Window & Live Countdown Timer Box */}
                <div
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    focusedCard.kenyaTiming.windowStatusCode === 'OPEN'
                      ? 'bg-emerald-950/35 border-[#00C261]/70'
                      : focusedCard.kenyaTiming.windowStatusCode === 'OPENING_SOON'
                      ? 'bg-amber-950/35 border-amber-400/70'
                      : 'bg-red-950/45 border-red-500/80'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-black">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span
                        className={
                          focusedCard.kenyaTiming.windowStatusCode === 'OPEN'
                            ? 'text-[#00C261]'
                            : focusedCard.kenyaTiming.windowStatusCode === 'OPENING_SOON'
                            ? 'text-amber-300'
                            : 'text-red-300'
                        }
                      >
                        {focusedCard.kenyaTiming.bannerHeadline}
                      </span>
                    </div>
                    <div className="text-sm font-black text-white">
                      Kenya Window: {focusedCard.kenyaTiming.currentWindowName} → Next: {focusedCard.kenyaTiming.nextWindowName}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {focusedCard.kenyaTiming.reasonText}
                    </p>
                  </div>

                  <div className="px-4 py-3 rounded-xl bg-black/75 border border-white/15 text-right shrink-0">
                    <span
                      className={`text-[10px] uppercase block font-black ${
                        focusedCard.kenyaTiming.windowStatusCode === 'OPEN'
                          ? 'text-[#00C261]'
                          : focusedCard.kenyaTiming.windowStatusCode === 'OPENING_SOON'
                          ? 'text-amber-300'
                          : 'text-red-300'
                      }`}
                    >
                      {focusedCard.kenyaTiming.windowStatusCode === 'OPEN'
                        ? 'MARKET OPEN · CLOSES IN'
                        : focusedCard.kenyaTiming.windowStatusCode === 'OPENING_SOON'
                        ? 'OPENS IN'
                        : 'MARKET CLOSED · OPENS IN'}
                    </span>
                    <strong className="text-lg sm:text-xl font-black text-white tracking-wider">
                      {focusedCard.kenyaTiming.countdownFormatted}
                    </strong>
                  </div>
                </div>

                {/* Real-Time Synced Tactical Note */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {superAiNotes[focusedCard.pair]?.headline || `Live Session Note · ${focusedCard.pair}`}
                      </span>
                    </span>
                    <p className="text-slate-200 leading-snug">
                      {superAiNotes[focusedCard.pair]?.note || focusedMarket.projection}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      void globalLiveStream.fetchSuperAiNoteForPair(focusedCard.pair, focusedMarket.recommendedTf, true)
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#D4AF37] border border-slate-700 text-[11px] font-bold shrink-0 whitespace-nowrap"
                  >
                    Sync AI Note
                  </button>
                </div>

                {/* Dual Safe to BUY vs Safe to SELL Today Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {renderVerdictBadge(focusedCard.buySafety, 'BUY', focusedCard.buyScore)}
                  {renderVerdictBadge(focusedCard.sellSafety, 'SELL', focusedCard.sellScore)}
                </div>

                {/* Live Interactive Candlestick Chart (Synced 24/7 + Interactive Tick Controls) */}
                <LiveInteractiveCandleChart
                  pair={focusedMarket.pair}
                  timeframe={focusedMarket.recommendedTf || 'M15'}
                  candles={focusedMarket.candles || []}
                  livePrice={focusedMarket.price}
                  ema20={focusedMarket.ema20}
                  ema50={focusedMarket.ema50}
                  entryPrice={computed.entryPrice}
                  stopLoss={computed.stopLoss}
                  tp1={computed.tp1}
                  tp2={computed.tp2}
                  direction={computed.direction}
                  change24hPct={focusedMarket.change24hPct}
                  isLockedToCustom={Boolean(lockedPairs[focusedMarket.pair])}
                  onCandlePriceChange={(newP) => globalLiveStream.setCustomCandlePrice(focusedMarket.pair, newP)}
                  onResetToLiveStream={() => globalLiveStream.unlockPairToLiveStream(focusedMarket.pair)}
                />

                {/* Protected MT4 Order Parameters & Longer 1H–48H Multi-Horizon Projection */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[#D4AF37] font-bold">
                      {inspectedSide === 'AUTO'
                        ? `Auto-Synced MT4 Execution Levels (${computed.orderType} · ${computed.brokerSymbol})`
                        : `Chosen ${inspectedSide} Side Plan (${computed.orderType} · ${computed.brokerSymbol})`}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      0.01 Micro Lot (${computed.actualRiskUsd.toFixed(2)} / 260 KES Cap · H1 {computed.h1TrendDirection})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Live Entry</span>
                      <strong className="text-sm text-white">{computed.entryPrice}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30">
                      <span className="text-[10px] text-red-400 block">Stop Loss (-{computed.slPips}p)</span>
                      <strong className="text-sm text-red-300">{computed.stopLoss}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                      <span className="text-[10px] text-cyan-400 block">1H–4H TP1 (50% BE)</span>
                      <strong className="text-sm text-cyan-300">{computed.tp1}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 block">4H–12H TP2 (+{computed.tpPips}p)</span>
                      <strong className="text-sm text-emerald-300">{computed.tp2}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-950/25 border border-[#D4AF37]/40 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-[#D4AF37] block">12H–48H TP3 (+${computed.netProfit48hUsd.toFixed(2)})</span>
                      <strong className="text-sm text-[#D4AF37]">{computed.tp3}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    {computed.trajectoryHorizons.map((step) => (
                      <div
                        key={step.horizon}
                        className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 text-left"
                      >
                        <span className="text-[10px] text-[#D4AF37] font-black block">{step.horizon}</span>
                        <div className="text-xs font-black text-white">
                          @ {step.targetPrice}{' '}
                          <span className="text-[#00C261]">(+${step.netProfitUsd.toFixed(2)} / +{step.netProfitKes} KES)</span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug">{step.driverSummary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFocusedPair(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>← Back to All 8 Markets</span>
                  </button>

                  {onNavigatePillar && (
                    <button
                      type="button"
                      onClick={() => onNavigatePillar('/ai-scanner')}
                      className="px-4 py-2 rounded-xl btn-gold text-black text-xs font-black flex items-center gap-1.5 transition"
                    >
                      <span>Open Full AI Market Scanner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        /* =====================================================================
           UNCONGESTED 8 INDEPENDENT CLICKABLE SAFETY CARDS GRID
           Top summary: Pair, Live Candle Price, %, Kenya Time Countdown, Global Safety Badge, SL/TP
           ===================================================================== */
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#D4AF37]" />
                <span>Independent Market Safety & Kenya Entry Window Cards (Click Any Card)</span>
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Shows live %, candle price, Kenya EAT entry countdown timer, global entry verdict, and SL/TP. Click any card to open its full chart & countdown view.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap font-mono">
              {(['ALL', 'GBP/USD', 'XAU/USD', 'EUR/USD', 'USD/CAD', 'USD/JPY', 'GBP/JPY', 'AUD/USD', 'BTC/USD'] as const).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPairFilter(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      selectedPairFilter === p
                        ? 'bg-[#D4AF37] text-black font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleScorecards.map((card) => {
              const rawMkt = markets.find((x) => x.pair === card.pair);
              const preferredSide: 'BUY' | 'SELL' = card.buyScore >= card.sellScore ? 'BUY' : 'SELL';
              const computed = computeRealChartTradeParams({
                targetPair: card.pair,
                targetTf: rawMkt?.recommendedTf || 'M15',
                targetBroker: selectedBroker,
                price: card.livePrice,
                ema20: card.ema20,
                ema50: card.ema50,
                rsi: card.rsi,
                atrPips: rawMkt?.atrPips,
                biasOverride: preferredSide,
                previousDirection: preferredSide,
                previousTrendDirection: rawMkt?.trendDirection,
                h1TrendDirection: rawMkt?.h1TrendDirection
              });
              const pctPos = card.change24hPct >= 0;

              return (
                <div
                  key={card.pair}
                  onClick={() => setFocusedPair(card.pair)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFocusedPair(card.pair);
                    }
                  }}
                  className={`p-4 rounded-2xl bg-slate-950 border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 font-mono tabular-nums hover:-translate-y-0.5 ${
                    card.isEntryBlockedGlobally
                      ? 'border-red-500/40 hover:border-red-400'
                      : 'border-slate-800 hover:border-[#D4AF37]'
                  }`}
                >
                  {/* Top Header: Pair, Live Candle Price & % */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-white">{card.pair}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="text-white font-bold">@ {card.livePrice}</span>
                        <span
                          className={`inline-flex items-center gap-0.5 font-bold ${
                            pctPos ? 'text-[#00C261]' : 'text-red-400'
                          }`}
                        >
                          {pctPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {pctPos ? `+${card.change24hPct.toFixed(2)}%` : `${card.change24hPct.toFixed(2)}%`}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-black text-right ${
                        card.isEntryBlockedGlobally
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-emerald-500/20 text-[#00C261] border border-emerald-500/40'
                      }`}
                    >
                      {card.isEntryBlockedGlobally ? 'WAIT / NOT SAFE' : card.primaryVerdictText}
                    </span>
                  </div>

                  {/* Color-Coded Kenya EAT Entry Window Status + Live Countdown */}
                  <div
                    className={`p-2.5 rounded-xl border space-y-1 text-[11px] ${
                      card.kenyaTiming.windowStatusCode === 'OPEN'
                        ? 'bg-emerald-950/30 border-[#00C261]/45'
                        : card.kenyaTiming.windowStatusCode === 'OPENING_SOON'
                        ? 'bg-amber-950/30 border-amber-400/45'
                        : 'bg-red-950/35 border-red-500/45'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`font-black flex items-center gap-1 ${
                          card.kenyaTiming.windowStatusCode === 'OPEN'
                            ? 'text-[#00C261]'
                            : card.kenyaTiming.windowStatusCode === 'OPENING_SOON'
                            ? 'text-amber-300'
                            : 'text-red-300'
                        }`}
                      >
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>
                          {card.kenyaTiming.windowStatusCode === 'OPEN'
                            ? 'MARKET OPEN'
                            : card.kenyaTiming.windowStatusCode === 'OPENING_SOON'
                            ? 'OPENS IN'
                            : 'CLOSED · OPENS IN'}
                        </span>
                      </span>
                      <strong className="text-white font-black">{card.kenyaTiming.countdownFormatted}</strong>
                    </div>
                    <div className="text-[10px] text-slate-300 truncate">
                      {computed.trendDirection} → {computed.direction} · {card.kenyaTiming.currentWindowName}
                    </div>
                  </div>

                  {/* Compact Protected SL / TP Preview + Net Profit Expectancy */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800/80 space-y-1.5 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-red-400 block">SL ({computed.orderType})</span>
                        <strong className="text-red-300">{computed.stopLoss}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 block">TP Target</span>
                        <strong className="text-emerald-300">{computed.tp2}</strong>
                      </div>
                    </div>
                    <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Risk -${computed.actualRiskUsd.toFixed(2)}</span>
                      <span className="text-[#00C261] font-black">
                        Profit +${computed.netProfitUsd.toFixed(2)} ({computed.riskReward})
                      </span>
                    </div>
                  </div>

                  {/* Click Footer */}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#D4AF37] font-bold">
                    <span>Open Countdown & Chart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
