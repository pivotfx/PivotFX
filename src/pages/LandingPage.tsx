import React from 'react';
import { PageTab } from '../types';
import { PILLARS_MASTERCLASS_DATA } from '../data/pillarsMasterclassData';
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
  Sparkles,
  ShieldAlert,
  Zap,
  Lock,
  ChevronRight,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onSelectPillar: (route: PageTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPillar }) => {
  // Map icons for the 8 Pillars
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
      case '09':
        return <Globe className="w-6 h-6 text-[#D4AF37]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* 1. Hero Section - Extremely Neat, Premium Glassmorphism & Gold Accents */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#0B101E] to-[#080C14] border border-[#D4AF37]/25 p-8 sm:p-14 lg:p-20 text-center">
        {/* Subtle radial gold glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PIVOTFX • PROP FIRM & FOREX ACADEMY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          </div>

          {/* Headline: Exactly "Zero to Funded Trader" */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
            Zero to <span className="text-gold-gradient">Funded Trader</span>
          </h1>

          {/* Subheadline: Small capital to prop firm */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            From small capital to verified prop firm funding. Master institutional order flow, risk discipline, and global daily trade safety across 9 independent academies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 flex-wrap">
            <button
              onClick={() => onSelectPillar('/fx-academy')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl btn-gold text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 group active:scale-95 shadow-xl"
            >
              <span>Explore 9 Masterclasses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => onSelectPillar('/macro-safety')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/90 text-[#00C261] hover:text-white font-bold text-sm border border-[#00C261]/50 hover:border-[#00C261] transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Globe className="w-4 h-4 text-[#00C261]" />
              <span>Is It Safe to Buy/Sell Today? (P9)</span>
            </button>

            <button
              onClick={() => onSelectPillar('/growth-lab')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 hover:border-[#D4AF37] transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Start Funded Path</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Nine Clickable Pillar Cards in Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>The 9 Independent Execution Masterclasses</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Select an Academy to Enter
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Each card opens an isolated curriculum inside
          </span>
        </div>

        {/* The 8 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS_MASTERCLASS_DATA.map((pillar) => {
            return (
              <button
                key={pillar.id}
                onClick={() => onSelectPillar(pillar.id)}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#0F172A]/70 border border-slate-800 hover:border-[#D4AF37] hover:bg-[#141F38] hover:shadow-[0_0_30px_rgba(212,175,55,0.18)] transition-all duration-300 text-left outline-none space-y-6"
              >
                {/* Top Row: Number & Icon */}
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-slate-800/90 text-[#D4AF37] border border-slate-700 group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                    PILLAR {pillar.number}
                  </span>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 group-hover:border-[#D4AF37]/50 transition-all">
                    {getPillarIcon(pillar.number)}
                  </div>
                </div>

                {/* Center Content: Title & One Line Hook */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-gradient transition-colors leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {pillar.oneLineHook}
                  </p>
                </div>

                {/* Bottom Row: Enter Masterclass Link */}
                <div className="pt-4 border-t border-slate-800/80 w-full flex items-center justify-between text-xs font-extrabold text-[#D4AF37] group-hover:text-white transition-colors">
                  <span>Enter Masterclass</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#D4AF37]" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
