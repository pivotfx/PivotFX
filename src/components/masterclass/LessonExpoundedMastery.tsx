import React, { useState, useEffect } from 'react';
import { PillarLesson, PillarData } from '../../types';
import {
  CheckCircle2,
  ShieldCheck,
  Target,
  AlertTriangle,
  Compass,
  Zap,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  BookOpen,
  Cpu,
  Copy,
  Check,
  HelpCircle,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface LessonExpoundedMasteryProps {
  lesson: PillarLesson;
  pillar: PillarData;
}

export const LessonExpoundedMastery: React.FC<LessonExpoundedMasteryProps> = ({
  lesson,
  pillar,
}) => {
  const [copiedTicket, setCopiedTicket] = useState<boolean>(false);

  // Store student checklist status in localStorage
  const storageKey = `pivotfx_checklist_${pillar.id}_${lesson.id}`;
  const [checkedItems, setCheckedItems] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedItems));
    } catch (e) {
      console.error(e);
    }
  }, [checkedItems, storageKey]);

  const toggleCheck = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter((i) => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  // Derive deep lesson-specific content, real-world case studies, and execution tickets
  const getExpoundedDetails = () => {
    const num = lesson.number;
    const titleLower = lesson.title.toLowerCase();
    const pillarId = pillar.id;

    // Default structure that can be customized based on lesson number and topic
    let pair = lesson.realWorldExample?.pair || 'EUR/USD';
    let timeframe = 'M15 (15-Min Execution Chart)';
    let session = 'London Open (10:00 AM EAT)';
    let orderType = 'BUY BY MARKET';
    let entry = 1.08450;
    let sl = 1.08290;
    let tp1 = 1.08750;
    let tp2 = 1.08950;
    let slPips = 16;
    let tpPips = 50;
    let riskReward = '1 : 3.1';
    let pnlUsd = '+15.50';
    let pnlKes = '+2,015 KES';
    let retailTrap = 'Chasing market green candles after a breakout, entering with 0.10 lot on a $100 account, and moving Stop Loss into wider drawdown.';
    let institutionalEdge = 'Waiting for liquidity sweeps of session extremes, entering on 20 EMA / FVG retests, with strictly 0.01 micro lot ($2.00 max risk).';
    let brokerNote = 'FXPesa (CMA Regulated) • Instant M-Pesa • 1.1 pip spread';

    // Tailor specifically for Lesson 3, Lesson 4, and other key lessons
    if (num === '03' || titleLower.includes('structure') || titleLower.includes('trend')) {
      pair = 'GBP/USD';
      timeframe = 'M15 (Synchronized with H4 Bias)';
      session = 'London Open (10:00 - 12:00 EAT)';
      orderType = 'SELL BY MARKET';
      entry = 1.29169;
      sl = 1.29680;
      tp1 = 1.28850;
      tp2 = 1.28520;
      slPips = 20;
      tpPips = 64;
      riskReward = '1 : 3.2';
      pnlUsd = '+19.20';
      pnlKes = '+2,496 KES';
      retailTrap = 'Buying at the peak of the rally (1.29656) because social media said "GBP is pumping", ignoring that H4 printed a Change of Character (CHOCH) below previous swing low.';
      institutionalEdge = 'Identified the Tower Top liquidity grab at 1.29656, waited for M15 candle close below the 20 EMA, and entered short targeting the 50 EMA imbalance at 1.28520 with strict $2.00 risk.';
      brokerNote = 'FXPesa / Exness • CMA Zero Negative Balance Guarantee';
    } else if (num === '04' || titleLower.includes('broker') || titleLower.includes('cma') || titleLower.includes('leverage')) {
      pair = 'XAU/USD (Gold Spot)';
      timeframe = 'M15 Execution (H1 Range View)';
      session = 'New York AM (15:30 - 17:30 EAT)';
      orderType = 'BUY LIMIT / MARKET BUY';
      entry = 2742.50;
      sl = 2732.00;
      tp1 = 2752.00;
      tp2 = 2760.00;
      slPips = 105;
      tpPips = 175;
      riskReward = '1 : 2.6';
      pnlUsd = '+17.50';
      pnlKes = '+2,275 KES';
      retailTrap = 'Opening an unregulated offshore account with 1:2000 leverage, using 0.10 standard lots on Gold, and losing the entire balance within 5 minutes of US CPI news spike due to negative balance debt.';
      institutionalEdge = 'Trading via CMA-regulated FXPesa with negative balance protection. Enforcing strict 0.01 micro lot volume so an adverse 100-pip Gold stop loss is capped at $2.00 (260 KES).';
      brokerNote = 'FXPesa Kenya (CMA License #107) • 1:400 Cap • Zero Debt Liability';
    } else if (num === '01' || titleLower.includes('forex') || titleLower.includes('what is')) {
      pair = 'EUR/USD (Fiber)';
      timeframe = 'M15 (Day Trading)';
      session = 'London Session (10:00 AM EAT)';
      orderType = 'BUY BY MARKET';
      entry = 1.08420;
      sl = 1.08200;
      tp1 = 1.08700;
      tp2 = 1.08950;
      slPips = 18;
      tpPips = 53;
      riskReward = '1 : 2.9';
      pnlUsd = '+15.90';
      pnlKes = '+2,067 KES';
      retailTrap = 'Failing to understand Base vs Quote currency, confusing Bid vs Ask prices, and opening random trades without knowing how much $1 pip is worth on 0.01 lot.';
      institutionalEdge = 'Mastered the mechanics: 1 pip on 0.01 EUR/USD = $0.10 USD (13 KES). On an 18-pip SL, risk is strictly $1.80 (234 KES), leaving 98% of capital untouched.';
      brokerNote = 'FXPesa / Exness • Spread 1.1 pips • Instant M-Pesa Deposit';
    } else if (num === '02' || titleLower.includes('participant') || titleLower.includes('bank') || titleLower.includes('liquidity')) {
      pair = 'USD/JPY (Ninja)';
      timeframe = 'M15 (Tokyo / London Transition)';
      session = 'Asian Session (03:00 - 08:00 EAT)';
      orderType = 'SELL BY MARKET';
      entry = 154.500;
      sl = 154.850;
      tp1 = 153.950;
      tp2 = 153.500;
      slPips = 35;
      tpPips = 100;
      riskReward = '1 : 2.8';
      pnlUsd = '+18.20';
      pnlKes = '+2,366 KES';
      retailTrap = 'Trying to pick tops against Bank of Japan (BOJ) interventions or buying aggressively into central bank liquidity injections.';
      institutionalEdge = 'Tracking the commercial banks\' order flow and central bank interest rate differentials; waiting for post-sweep distribution before entering.';
      brokerNote = 'FXPesa • 1.5 pip spread on USDJPY • ECN Order Matching';
    } else if (num === '05' || titleLower.includes('tradingview') || titleLower.includes('setup') || titleLower.includes('chart')) {
      pair = 'GBP/USD';
      timeframe = 'M15 Institutional Template';
      session = 'Pre-London Prep (09:30 AM EAT)';
      orderType = 'BUY BY MARKET';
      entry = 1.28850;
      sl = 1.28650;
      tp1 = 1.29150;
      tp2 = 1.29450;
      slPips = 18;
      tpPips = 60;
      riskReward = '1 : 3.3';
      pnlUsd = '+18.00';
      pnlKes = '+2,340 KES';
      retailTrap = 'Installing 12 overlapping neon indicators (Bollinger Bands, MACD, Stochastics, Ichimoku) causing cognitive overload and missing clean price action.';
      institutionalEdge = 'Using a clean TradingView layout with solid dark background (#0F172A), 20 EMA, 50 EMA, Session Breaks (Alt+S), and Nairobi UTC+3 time synchronization.';
      brokerNote = 'TradingView Webhook Sync • MT4/MT5 Direct Hotkeys';
    } else if (num === '06' || titleLower.includes('mt4') || titleLower.includes('mt5') || titleLower.includes('order')) {
      pair = 'EUR/USD';
      timeframe = 'M15 Direct Execution';
      session = 'London Open (10:00 AM EAT)';
      orderType = 'BUY LIMIT';
      entry = 1.08350;
      sl = 1.08180;
      tp1 = 1.08650;
      tp2 = 1.08900;
      slPips = 17;
      tpPips = 55;
      riskReward = '1 : 3.2';
      pnlUsd = '+16.50';
      pnlKes = '+2,145 KES';
      retailTrap = 'Clicking Buy or Sell via Market Execution during high-spread news spikes without pre-setting Stop Loss, resulting in immediate 15-pip slippage.';
      institutionalEdge = 'Pressing F9 to open Order Ticket, setting Volume to 0.01 micro lot, typing exact Stop Loss and Take Profit, and using Buy Limit at dynamic support.';
      brokerNote = 'MT4/MT5 Hotkey F9 • Ctrl+T Terminal • Gilgil Preset';
    }

    return {
      pair,
      timeframe,
      session,
      orderType,
      entry,
      sl,
      tp1,
      tp2,
      slPips,
      tpPips,
      riskReward,
      pnlUsd,
      pnlKes,
      retailTrap,
      institutionalEdge,
      brokerNote,
    };
  };

  const details = getExpoundedDetails();

  const handleCopyTicket = () => {
    const ticketText = `[PIVOTFX INSTITUTIONAL ORDER TICKET]
Pillar: ${pillar.title} (Lesson ${lesson.number}: ${lesson.title})
Symbol: ${details.pair}
Timeframe: ${details.timeframe}
Session: ${details.session}
Order Type: ${details.orderType}
Entry Price: ${details.entry}
Stop Loss: ${details.sl} (-${details.slPips} pips / Max $2.00 Risk)
Take Profit 1: ${details.tp1} (Close 50% & Move to Breakeven)
Take Profit 2: ${details.tp2} (+${details.tpPips} pips Final Target)
Volume: 0.01 Micro Lot (Strict Gilgil Shield)
Risk:Reward = ${details.riskReward}
CMA Protection: Zero Negative Balance Debt Risk`;

    navigator.clipboard.writeText(ticketText);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION 1: DEEP EXPOUNDED TOPIC MASTERCLASS */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0B1120] to-[#0F172A] border border-[#D4AF37]/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <h4 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Lesson {lesson.number} Deep Technical Masterclass & Execution Guide</span>
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
            2026 Fully Expounded Edition
          </span>
        </div>

        {/* In-depth Concept Exploration */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <p className="font-semibold text-white">
            {lesson.concept}
          </p>
          <p className="text-slate-300">
            {lesson.summary} This foundational mastery ensures you do not guess or gamble. Every institutional bank, hedge fund, and proprietary firm operates on mathematical predictability, liquidity clearance, and asymmetric risk-to-reward ratios.
          </p>
        </div>

        {/* Structural Mechanics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {lesson.bulletPoints.map((bp, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#D4AF37]/50 transition-colors space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  {bp.split(':')[0] || `Structural Rule ${idx + 1}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 pl-7 leading-relaxed">
                {bp.includes(':') ? bp.split(':')[1] : bp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: EXPOUNDED REAL-WORLD MARKET CASE STUDY & MT4 ORDER TICKET */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-black px-2.5 py-0.5 rounded-md bg-[#D4AF37]">
                {details.pair}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {details.timeframe}
              </span>
              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {details.session}
              </span>
            </div>
            <h5 className="text-sm font-bold text-white font-mono">
              Live Real-World Market Case Study: {lesson.title}
            </h5>
          </div>

          <button
            onClick={handleCopyTicket}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            {copiedTicket ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTicket ? 'Copied Order Ticket!' : 'Copy MT4/MT5 Ticket'}</span>
          </button>
        </div>

        {/* Order Numerical Placement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">1. Order Type</span>
            <span className="text-xs sm:text-sm font-black text-white">{details.orderType}</span>
            <span className="text-[9px] text-slate-500 block">Instant Execution</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">2. Entry Price</span>
            <span className="text-xs sm:text-sm font-black text-[#D4AF37]">@{details.entry}</span>
            <span className="text-[9px] text-slate-500 block">Market Execution</span>
          </div>

          <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40">
            <span className="text-[10px] text-red-400 block uppercase font-bold">
              3. Stop Loss (-{details.slPips}p)
            </span>
            <span className="text-xs sm:text-sm font-black text-red-300">{details.sl}</span>
            <span className="text-[9px] text-red-400 block">Max Risk: $2.00 / 260 KES</span>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
            <span className="text-[10px] text-cyan-400 block uppercase font-bold">
              4. TP1 (50% Close & BE)
            </span>
            <span className="text-xs sm:text-sm font-black text-cyan-300">{details.tp1}</span>
            <span className="text-[9px] text-cyan-400 block">Scale Out & Breakeven</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
            <span className="text-[10px] text-emerald-400 block uppercase font-bold">
              5. Final TP (+{details.tpPips}p)
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-300">{details.tp2}</span>
            <span className="text-[9px] text-emerald-400 block">R:R = {details.riskReward}</span>
          </div>
        </div>

        {/* Step-by-Step Execution Journey Narrative */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
          <div className="text-[#D4AF37] font-bold text-xs uppercase flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Target className="w-3.5 h-3.5" />
            <span>Practical Trade Execution Walkthrough:</span>
          </div>
          <div>
            <strong className="text-white">Step 1 — Market Context: </strong>
            <span>{lesson.realWorldExample.context}</span>
          </div>
          <div>
            <strong className="text-white">Step 2 — Trigger & Placement: </strong>
            <span>{lesson.realWorldExample.setup}</span>
          </div>
          <div>
            <strong className="text-white">Step 3 — Trade Outcome & Profit Realized: </strong>
            <span className="text-emerald-300 font-bold">{lesson.realWorldExample.outcome}</span>
            <span className="text-emerald-400 font-bold ml-2">({details.pnlUsd} USD / {details.pnlKes})</span>
          </div>
          <div className="pt-2 text-amber-200">
            <strong className="text-[#D4AF37]">Institutional Takeaway: </strong>
            <span>{lesson.realWorldExample.keyTakeaway}</span>
          </div>
        </div>

        {/* Gilgil $2 Guarantee Bar & CMA Protection */}
        <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-white font-bold">
              Position Sizing: <span className="text-[#D4AF37]">0.01 Micro Lot</span> (Gilgil $2 / 260 KES Hard Loss Cap)
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-emerald-400 font-bold">CMA Safety:</span>
            <span>Zero Negative Balance Debt Risk</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE ACTIONABLE CHECKLIST FOR THIS LESSON */}
      {lesson.actionableChecklist && lesson.actionableChecklist.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C261]" />
              <h5 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                Step-by-Step Actionable Execution Checklist
              </h5>
            </div>
            <span className="text-[10px] font-mono text-[#D4AF37]">
              {checkedItems.length} / {lesson.actionableChecklist.length} Checked
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Check off each step below as you practice on your TradingView or MT4/MT5 demo workspace:
          </p>

          <div className="space-y-2.5">
            {lesson.actionableChecklist.map((item, idx) => {
              const isChecked = checkedItems.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 group font-mono text-xs ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-slate-600 group-hover:border-[#D4AF37]'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: RETAIL TRAP VS INSTITUTIONAL PRO EDGE COMPARISON MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Retail Pitfall Trap */}
        <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/40 space-y-2.5">
          <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs uppercase border-b border-red-500/20 pb-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Retail Amateur Trap (Why 90% Lose on This Topic):</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {details.retailTrap}
          </p>
          <div className="text-[10px] font-mono text-red-400 pt-1 font-bold">
            Result: Blown accounts, margin calls, emotional revenge trading.
          </div>
        </div>

        {/* Institutional Edge Protocol */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase border-b border-emerald-500/20 pb-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>PivotFX Institutional Protocol (Funded Prop Edge):</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {details.institutionalEdge}
          </p>
          <div className="text-[10px] font-mono text-emerald-400 pt-1 font-bold">
            Result: Complete capital preservation, psychological peace, consistent compounding.
          </div>
        </div>
      </div>

      {/* SECTION 5: PRO MT4/TRADINGVIEW TOOLBELT SHORTCUTS */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-slate-300">
            Pro Hotkeys: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">F9</kbd> for Order Ticket, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">Ctrl + T</kbd> for Terminal, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">Alt + S</kbd> for Session Breaks.
          </span>
        </div>
        <span className="text-[10px] text-slate-500 shrink-0">
          Broker: {details.brokerNote}
        </span>
      </div>
    </div>
  );
};
