import React, { useState, useEffect } from 'react';
import { CurrencyPair, PageTab } from '../types';
import { PILLARS_MASTERCLASS_DATA } from '../data/pillarsMasterclassData';
import {
  MarketScanData,
  globalLiveStream,
  computeRealChartTradeParams,
  evaluatePairKenyaTiming,
  getCurrentMacroContext
} from '../utils/liveMarketEngine';
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
  TrendingDown
} from 'lucide-react';

interface LandingPageProps {
  onSelectPillar: (route: PageTab) => void;
  onOpenPairWorkspace?: (pair: CurrencyPair) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPillar,
  onOpenPairWorkspace,
}) => {
  const [topMarkets, setTopMarkets] = useState<MarketScanData[]>(() =>
    globalLiveStream.getState().markets.slice(0, 4)
  );
  const [syncedAt, setSyncedAt] = useState<string>(() => globalLiveStream.getState().syncedAt);
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setTopMarkets(streamState.markets.slice(0, 4));
      setSyncedAt(streamState.syncedAt);
    });
    return () => unsubscribe();
  }, []);

  const macroContext = (() => {
    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    topMarkets.forEach((m) => {
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
                Grow small capital into verified prop firm funding. Master institutional order flow, real-time candlestick execution, Kenya session timing, and global trade safety across 9 independent academies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onSelectPillar('/fx-academy')}
                className="px-6 py-3.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Explore 9 Masterclasses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectPillar('/macro-safety')}
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-xs border border-slate-700 hover:border-[#D4AF37] transition flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                <span>Check Today&apos;s Market Safety</span>
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
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-200 tabular-nums">
              <span>0.01 Micro Lot Shield · Max $2.00 / 260 KES</span>
              <span className="text-[#D4AF37] font-bold">CMA KE Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE TOP 4 MARKET OPPORTUNITIES STRIP (1-Click Jump to Live Chart & AI Scanner) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap tabular-nums">
            <span className="text-[#D4AF37] font-bold">Live Top Setups</span>
            <span aria-hidden="true">·</span>
            <span>Auto-Synced Every 0.5s ({syncedAt})</span>
            <span aria-hidden="true">·</span>
            <span>Click any pair to open chart &amp; SL/TP levels</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectPillar('/ai-scanner')}
            className="text-xs font-mono font-bold text-[#D4AF37] hover:text-white transition inline-flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>Open All 8 Pairs in Scanner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
          {topMarkets.map((m, idx) => {
            const sideBias: 'BUY' | 'SELL' = m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
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
              macro: macroContext,
              biasOverride: sideBias,
              previousDirection: sideBias,
              previousTrendDirection: m.trendDirection,
              h1TrendDirection: m.h1TrendDirection
            });
            const timing = evaluatePairKenyaTiming(m.pair);
            const isBuy = computed.direction === 'BUY';
            const pctPos = m.change24hPct >= 0;

            return (
              <button
                key={m.pair}
                type="button"
                onClick={() =>
                  onOpenPairWorkspace ? onOpenPairWorkspace(m.pair) : onSelectPillar('/ai-scanner')
                }
                className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 hover:border-[#D4AF37] transition-colors text-left flex flex-col justify-between space-y-3 font-mono"
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

                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-slate-800/80 w-full">
                  <span>SL {computed.stopLoss}</span>
                  <span className="text-[#00C261]">TP {computed.tp2}</span>
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
                  <span className="text-[#D4AF37] font-bold shrink-0">Inspect →</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. NINE INDEPENDENT ACADEMY PILLAR CARDS */}
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
