import React, { useState, useEffect } from 'react';
import { CurrencyPair, PageTab } from '../types';
import { PILLARS_MASTERCLASS_DATA } from '../data/pillarsMasterclassData';
import {
  MarketScanData,
  DailyMacroAiDirective,
  ActiveMarketOrder,
  globalLiveStream,
  computeRealChartTradeParams,
  computeLiveOrderMetrics,
  computeCandleSwingLevels,
  evaluatePairKenyaTiming,
  getCurrentMacroContext
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
  Clock,
  Globe,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Copy,
  Check,
  ClipboardList
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
  const [activeOrders, setActiveOrders] = useState<Partial<Record<CurrencyPair, ActiveMarketOrder>>>(
    () => globalLiveStream.getState().activeOrders
  );
  const [syncedAt, setSyncedAt] = useState<string>(() => globalLiveStream.getState().syncedAt);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);
  const [copiedLandingKey, setCopiedLandingKey] = useState<string | null>(null);

  const copyLandingLevel = (val: string | number, key: string) => {
    try {
      navigator.clipboard.writeText(String(val));
    } catch {}
    setCopiedLandingKey(key);
    setTimeout(() => {
      setCopiedLandingKey((prev) => (prev === key ? null : prev));
    }, 1500);
  };

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setAllMarkets(streamState.markets);
      setDailyMacroDirective(streamState.dailyMacroDirective);
      setActiveOrders(streamState.activeOrders);
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

  const getPillarIcon = (number: string) => {
    switch (number) {
      case '01':
        return <GraduationCap className="w-5 h-5 text-[#D4AF37]" />;
      case '02':
        return <CandlestickChart className="w-5 h-5 text-[#D4AF37]" />;
      case '03':
        return <Target className="w-5 h-5 text-[#D4AF37]" />;
      case '04':
        return <Scan className="w-5 h-5 text-[#D4AF37]" />;
      case '05':
        return <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />;
      case '06':
        return <Brain className="w-5 h-5 text-[#D4AF37]" />;
      case '07':
        return <Activity className="w-5 h-5 text-[#D4AF37]" />;
      case '08':
        return <Award className="w-5 h-5 text-[#D4AF37]" />;
      default:
        return <Globe className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. 2-COLUMN STRETCHED INSTITUTIONAL HERO */}
      <section className="rounded-3xl bg-[#0B101E] border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Narrative & 2 Focused Actions */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] flex-wrap tabular-nums">
                <span>PivotFx Prop Firm &amp; Forex Academy</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">Nairobi EAT Live Sync ({syncedAt})</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.06] text-balance">
                Zero to <span className="text-gold-gradient">Funded Trader</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Grow small capital into funded prop firm accounts. Instant AI multi-market scans ranked from Top % to Least %, locked multi-factor BUY/SELL projections, and live Nairobi session countdowns.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onSelectPillar('/ai-scanner')}
                className="px-6 py-3.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Open AI Market Radar (Top % → Least)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectPillar('/macro-safety')}
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs border border-slate-700 hover:border-[#D4AF37] transition flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Today &amp; Hourly Safety Timer</span>
              </button>
            </div>
          </div>

          {/* Right 16:9 Desk Visual Panel with Measured Contrast Scrim */}
          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-[#080C15] border-t lg:border-t-0 lg:border-l border-slate-800 overflow-hidden">
            {!heroImgFailed ? (
              <img
                src={heroDeskImg}
                alt="Institutional multi-asset quantitative execution terminal with brass desk instruments"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full lg:h-full object-cover object-center opacity-90"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 to-slate-950">
                <CandlestickChart className="w-10 h-10 text-[#D4AF37] mb-2" />
                <span className="text-sm font-bold text-white">PivotFx Execution Desk</span>
                <span className="text-xs text-slate-400 font-mono">Multi-Asset Order Flow &amp; Risk Engine</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 text-xs font-mono text-slate-200 tabular-nums flex-wrap">
              <span>0.01 Micro Lot Shield · Max $2.00 / 260 KES</span>
              <span className="text-[#D4AF37] font-bold">CMA KE Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAY & THIS HOUR GLOBAL MACRO FAVORABILITY + NAIROBI COUNTDOWN */}
      <section className="rounded-2xl p-5 sm:p-6 bg-[#0B1120] border border-[#D4AF37]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono tabular-nums">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold flex-wrap">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Today &amp; Current Hour Global AI Projection · {macroContext.sessionWindowName}</span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-white">
            {dailyMacroDirective.headline}
          </h2>
          <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-3xl">
            {dailyMacroDirective.hourlyOutlook}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <div className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 block">Nairobi Time (EAT)</span>
            <strong className="text-sm text-white block">{macroContext.eatTimeString}</strong>
            <span
              className={`text-[11px] font-bold ${
                macroContext.overallDaySafety === 'FAVOURABLE_BUY'
                  ? 'text-[#00C261]'
                  : macroContext.overallDaySafety === 'FAVOURABLE_SELL'
                  ? 'text-red-400'
                  : 'text-amber-300'
              }`}
            >
              {macroContext.overallDaySafety === 'FAVOURABLE_BUY'
                ? 'FAVOURABLE BUY WINDOW'
                : macroContext.overallDaySafety === 'FAVOURABLE_SELL'
                ? 'FAVOURABLE SELL WINDOW'
                : 'SELECTIVE CAUTION WINDOW'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => globalLiveStream.requestOpenScannerView('trade_log')}
            className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Trade Log &amp; Orders</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPillar('/ai-scanner')}
            className="px-4 py-3 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider whitespace-nowrap shrink-0"
          >
            Deep AI Scan All 10
          </button>
        </div>
      </section>

      {/* LIVE LOADED MARKET ORDERS MONITOR (SYNCS ACROSS CARDS & BROKERS PAGE) */}
      <ActiveMarketOrderPanel
        mode="summary_banner"
        broker={globalLiveStream.getState().activeBroker}
        onInspectPairCard={(targetPair) =>
          onOpenPairWorkspace ? onOpenPairWorkspace(targetPair) : onSelectPillar('/ai-scanner')
        }
      />

      {/* 3. ALL 10 LIVE MARKETS SORTED TOP % TO LEAST % (Click Any Card for Independent Chart & AI Rescan) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap tabular-nums">
            <span className="text-[#D4AF37] font-bold">All 10 Live Markets (Top % → Least %)</span>
            <span aria-hidden="true">·</span>
            <span>H1/M15 Trend Lock Active ({syncedAt})</span>
            <span aria-hidden="true">·</span>
            <span>Click any card to open independent chart, Rescan &amp; Super AI</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectPillar('/ai-scanner')}
            className="text-xs font-mono font-bold text-[#D4AF37] hover:text-white transition inline-flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>Open Full Multi-Market Scanner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
          {allMarkets.map((m, idx) => {
            const sideBias: 'BUY' | 'SELL' = m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
            const cardSwings = computeCandleSwingLevels(m.candles);
            const computed = computeRealChartTradeParams({
              targetPair: m.pair,
              targetTf: m.recommendedTf,
              targetBroker: 'fxpesa',
              price: m.price,
              keyLevel: m.keyLevel,
              ema20: m.ema20,
              ema50: m.ema50,
              rsi: m.rsi,
              atrPips: m.atrPips,
              swingLow: cardSwings.swingLow,
              swingHigh: cardSwings.swingHigh,
              macro: macroContext,
              biasOverride: sideBias,
              previousDirection: sideBias,
              previousTrendDirection: m.trendDirection,
              h1TrendDirection: m.h1TrendDirection
            });
            const timing = evaluatePairKenyaTiming(m.pair);
            const isBuy = computed.direction === 'BUY';
            const pctPos = m.change24hPct >= 0;
            const loadedOrder = activeOrders[m.pair];
            const orderMetrics = loadedOrder ? computeLiveOrderMetrics(loadedOrder, m.price, m.atrPips) : null;
            const cardSl = loadedOrder ? loadedOrder.stopLoss : computed.stopLoss;
            const cardTp = loadedOrder ? loadedOrder.tp2 : computed.tp2;

            return (
              <div
                key={m.pair}
                role="button"
                tabIndex={0}
                onClick={() =>
                  onOpenPairWorkspace ? onOpenPairWorkspace(m.pair) : onSelectPillar('/ai-scanner')
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onOpenPairWorkspace) {
                      onOpenPairWorkspace(m.pair);
                    } else {
                      onSelectPillar('/ai-scanner');
                    }
                  }
                }}
                className={`p-4 rounded-2xl bg-[#0B101E] border transition-colors text-left flex flex-col justify-between space-y-3 font-mono cursor-pointer ${
                  loadedOrder
                    ? 'border-[#00C261] shadow-[0_0_16px_rgba(0,194,97,0.14)]'
                    : 'border-slate-800 hover:border-[#D4AF37]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 w-full">
                  <span>
                    #{idx + 1} · {m.recommendedTf} · {computed.confidence}% AI
                  </span>
                  <span className={isBuy ? 'text-[#00C261] font-bold' : 'text-red-400 font-bold'}>
                    {computed.trendDirection} · {computed.direction}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2 w-full">
                  <span className="text-lg font-black text-white">{m.pair}</span>
                  <span className="text-sm font-black text-[#D4AF37]">@ {m.price}</span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                      pctPos ? 'text-[#00C261]' : 'text-red-400'
                    }`}
                  >
                    {pctPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {pctPos ? `+${m.change24hPct.toFixed(2)}%` : `${m.change24hPct.toFixed(2)}%`}
                  </span>
                </div>

                {loadedOrder && orderMetrics && (
                  <div className="px-2.5 py-1.5 rounded-lg bg-emerald-950/50 border border-[#00C261]/50 flex items-center justify-between text-[10px] font-black text-[#00C261]">
                    <span>{loadedOrder.direction} PLACED ON BROKER</span>
                    <span>
                      {orderMetrics.floatingPips >= 0 ? `+${orderMetrics.floatingPips}p` : `${orderMetrics.floatingPips}p`} ·{' '}
                      {orderMetrics.netProfitUsd >= 0
                        ? `+$${orderMetrics.netProfitUsd.toFixed(2)}`
                        : `-$${Math.abs(orderMetrics.netProfitUsd).toFixed(2)}`}
                    </span>
                  </div>
                )}

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800/80 w-full"
                >
                  <div className="flex items-center justify-between gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800/80">
                    <span className="truncate">SL {cardSl}</span>
                    <button
                      type="button"
                      onClick={() => copyLandingLevel(cardSl, `land-sl-${m.pair}`)}
                      className="p-1 rounded bg-slate-900 hover:bg-red-950 text-red-300 shrink-0"
                      title="Copy Stop Loss"
                    >
                      {copiedLandingKey === `land-sl-${m.pair}` ? (
                        <Check className="w-3 h-3 text-[#00C261]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800/80">
                    <span className="text-[#00C261] truncate">TP {cardTp}</span>
                    <button
                      type="button"
                      onClick={() => copyLandingLevel(cardTp, `land-tp-${m.pair}`)}
                      className="p-1 rounded bg-slate-900 hover:bg-emerald-950 text-[#00C261] shrink-0"
                      title="Copy Take Profit"
                    >
                      {copiedLandingKey === `land-tp-${m.pair}` ? (
                        <Check className="w-3 h-3 text-[#00C261]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] w-full pt-1">
                  <span
                    className={`inline-flex items-center gap-1 font-bold truncate ${
                      timing.windowStatusCode === 'OPEN'
                        ? 'text-[#00C261]'
                        : timing.windowStatusCode === 'OPENING_SOON'
                        ? 'text-amber-300'
                        : 'text-red-300'
                    }`}
                  >
                    <Clock className="w-3 h-3 shrink-0" />
                    <span className="truncate">{timing.windowBadgeShort}</span>
                  </span>
                  <span className="text-[#D4AF37] font-bold shrink-0">
                    {loadedOrder ? 'Manage →' : 'Inspect →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. NINE INDEPENDENT ACADEMY PILLAR CARDS */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#D4AF37] font-bold block">
              9 Independent Execution Masterclasses
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Select an Academy to Enter
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Each card opens an uncongested workstation &amp; curriculum chamber
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS_MASTERCLASS_DATA.map((pillar) => (
            <button
              key={pillar.id}
              type="button"
              onClick={() => onSelectPillar(pillar.id)}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-[#0B101E] border border-slate-800 hover:border-[#D4AF37] transition-colors text-left space-y-5"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-mono text-[#D4AF37] font-bold">
                  Pillar {pillar.number} · {pillar.lessons.length} Lessons
                </span>
                {getPillarIcon(pillar.number)}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {pillar.oneLineHook}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 w-full flex items-center justify-between text-xs font-mono font-bold text-[#D4AF37] group-hover:text-white transition-colors">
                <span>Enter Academy</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
