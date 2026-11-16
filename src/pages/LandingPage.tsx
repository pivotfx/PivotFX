import React, { useState, useEffect } from 'react';
import { CurrencyPair, PageTab } from '../types';
import { PILLARS_MASTERCLASS_DATA } from '../data/pillarsMasterclassData';
import {
  globalLiveStream,
  getCurrentMacroContext,
} from '../utils/liveMarketEngine';
import { EatSessionPlaybookMatrix } from '../components/common/EatSessionPlaybookMatrix';
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
}) => {
  const [macroTick, setMacroTick] = useState<number>(() => Date.now());
  const [heroImgFailed, setHeroImgFailed] = useState<boolean>(false);

  useEffect(() => {
    const id = window.setInterval(() => setMacroTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Recompute live Nairobi EAT Day & Time every second alongside live macro pctMap
  void macroTick;
  const pctMap: Partial<Record<CurrencyPair, number>> = {};
  globalLiveStream.getState().markets.forEach((m) => {
    pctMap[m.pair] = m.change24hPct;
  });
  const macroContext = getCurrentMacroContext(pctMap);

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

  const pillar04 = PILLARS_MASTERCLASS_DATA.find((p) => p.number === '04');
  const pillar02 = PILLARS_MASTERCLASS_DATA.find((p) => p.number === '02');
  const pillar05 = PILLARS_MASTERCLASS_DATA.find((p) => p.number === '05');
  const coreSet = new Set(['04', '02', '05']);
  const remainingPillars = PILLARS_MASTERCLASS_DATA.filter((p) => !coreSet.has(p.number));

  return (
    <div className="space-y-12 pb-24">
      {/* 1. ARCHITECTURAL HERO SECTION */}
      <section className="rounded-3xl bg-[#0B101E] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Narrative & Primary Workstation Entry */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] flex-wrap tabular-nums">
                <span className="font-bold">PivotFx Prop Firm &amp; Forex Academy</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">
                  {macroContext.eatDayString} · {macroContext.eatTimeString}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-[#00C261] font-semibold">{macroContext.sessionWindowName}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.06] text-balance">
                Zero to <span className="text-gold-gradient">Funded Trader</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Nine independent institutional workstations engineered for disciplined funded-account execution. Know exact Nairobi EAT market openings and session quality before scanning live setups inside Pillar 04.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenMarketRadar}
                  className="px-6 py-4 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 whitespace-nowrap shrink-0 shadow-[0_0_24px_rgba(212,175,55,0.28)]"
                >
                  <span>Open Pillar 04: AI Market Radar</span>
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

              {/* Clean Architectural Metrics Row */}
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-800/80 text-xs font-mono tabular-nums">
                <div>
                  <span className="text-slate-400 block">Architecture</span>
                  <strong className="text-sm sm:text-base text-white font-black">9 Workstations</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Market Scope</span>
                  <strong className="text-sm sm:text-base text-[#D4AF37] font-black">15 Assets in P4</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Risk Standard</span>
                  <strong className="text-sm sm:text-base text-[#00C261] font-black">4% Daily Guard</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Panel */}
          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-[#080C15] border-t lg:border-t-0 lg:border-l border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-[#D4AF37]/80">
              <ShieldCheck className="w-4 h-4 text-[#00C261] shrink-0" />
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-black tracking-widest text-[#D4AF37] uppercase leading-none">
                  PIVOT FX PROP TRADING FLOOR
                </span>
                <span className="font-mono text-[9px] text-slate-400 leading-tight mt-0.5">
                  NAIROBI FINANCIAL DISTRICT · UTC+3 (EAT)
                </span>
              </div>
            </div>

            {!heroImgFailed ? (
              <img
                src={heroDeskImg}
                alt="Institutional multi-asset quantitative trading floor"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full lg:h-full object-cover object-center brightness-110 contrast-105 opacity-95 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 to-slate-950">
                <CandlestickChart className="w-10 h-10 text-[#D4AF37] mb-2" />
                <span className="text-sm font-bold text-white">PivotFx Execution Desk</span>
                <span className="text-xs text-slate-400 font-mono">Institutional Prop Curriculum &amp; Tools</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-2 text-xs font-mono text-slate-200 tabular-nums flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#00C261]" />
                <span>Gilgil Shield · Strict Micro-Lot Risk Discipline</span>
              </span>
              <span className="text-[#D4AF37] font-bold">CMA KE Standard</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NINE INDEPENDENT INSTITUTIONAL PILLAR CARDS (CLICK TO ENTER WORKSTATION) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-bold">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Nine Independent Institutional Workstations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight text-balance">
              Select a Pillar Workstation
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400 max-w-md">
            Click any workstation card to inspect live multi-market setups, charts, risk sizing, and trade logs. Live Nairobi EAT session cards follow below.
          </p>
        </div>

        {/* Tier A: Marquee Execution, Charting & Risk Workstations */}
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
                      <span className="text-[#00C261] font-bold">15-Market Execution Radar</span>
                      <span aria-hidden="true">·</span>
                      <span>{pillar04.lessons.length} Lessons</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-[#D4AF37]/50 transition">
                      {getPillarIcon(pillar04.number)}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#D4AF37] transition-colors">
                    {pillar04.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar04.oneLineHook} Inspect live 15-market rankings, 8-currency strength divergence, BOS/CHoCH audits, camera chart OCR, price alerts, and active broker orders inside.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-black text-[#D4AF37] group-hover:text-white">
                  <span>Open Live Market Radar &amp; Tools</span>
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

          {/* Tier B: 6 Structured Academy & Analytics Pillars */}
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
      </section>

      {/* 3. PURE INFORMATIONAL COLOR-CODED EAT SESSION TIMEFRAME CARDS (FOLLOW PILLARS BELOW) */}
      <EatSessionPlaybookMatrix />
    </div>
  );
};
