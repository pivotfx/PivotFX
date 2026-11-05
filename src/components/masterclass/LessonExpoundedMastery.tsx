import React, { useState, useEffect } from 'react';
import { PillarLesson, PillarData, CurrencyPair, Timeframe } from '../../types';
import { computeRealChartTradeParams, INITIAL_MARKETS_DATA } from '../../utils/liveMarketEngine';
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
  Award,
  RefreshCw,
  SlidersHorizontal
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

  // Derive deep lesson-specific content, contemporary real-world case studies, and execution tickets
  const getExpoundedDetails = () => {
    const num = lesson.number;
    const titleLower = lesson.title.toLowerCase();

    let pair: CurrencyPair = 'EUR/USD';
    let displayPair = lesson.realWorldExample?.pair || 'EUR/USD (Fiber)';
    let timeframe: Timeframe = 'M15';
    let session = 'London Open (10:00 AM EAT)';
    let bias: 'BUY' | 'SELL' = 'BUY';
    let entry = 1.12670;
    let pnlUsd = '+15.60';
    let pnlKes = '+2,028 KES';
    let retailTrap = 'Chasing market green candles after a breakout, entering with 0.10 lot on a $100 account, and placing Stop Loss on the wrong side of the current bid/ask quote.';
    let institutionalEdge = 'Waiting for liquidity sweeps of session extremes, syncing Stop Loss & Take Profit to your live MT4 chart candlestick, and risking strictly $2.00 via 0.01 micro lot.';
    let brokerNote = 'FXPesa (CMA Regulated) · Instant M-Pesa · 1.1 pip spread';

    if (num === '03' || titleLower.includes('structure') || titleLower.includes('trend')) {
      pair = 'GBP/USD';
      displayPair = 'GBP/USD (Cable)';
      timeframe = 'M15';
      session = 'London Open (10:00 - 12:00 EAT)';
      bias = 'BUY';
      entry = 1.34998;
      pnlUsd = '+19.20';
      pnlKes = '+2,496 KES';
      retailTrap = 'Using stale Stop Loss/Take Profit numbers (like 1.2885) when the live GBP/USD chart has moved to 1.34998 — causing MT4 to immediately reject the order with [Invalid S/L or T/P].';
      institutionalEdge = 'Anchoring Entry directly to the live chart quote (1.34998), verifying Break of Structure (BOS) above the 20 EMA, and placing Stop Loss 16 pips below structure with strict $2.00 risk.';
      brokerNote = 'FXPesa / Exness · CMA Zero Negative Balance Guarantee';
    } else if (num === '04' || titleLower.includes('broker') || titleLower.includes('cma') || titleLower.includes('leverage')) {
      pair = 'XAU/USD';
      displayPair = 'XAU/USD (Gold Spot)';
      timeframe = 'M15';
      session = 'New York AM (15:30 - 17:30 EAT)';
      bias = 'BUY';
      entry = 3955.00;
      pnlUsd = '+24.00';
      pnlKes = '+3,120 KES';
      retailTrap = 'Opening an unregulated offshore account with 1:2000 leverage, pasting old 2732/2760 Gold prices when the live Gold chart is trading around 3955.00 (or 4041.495 futures), and getting rejected or stopped out.';
      institutionalEdge = 'Trading via CMA-regulated FXPesa with negative balance protection, calculating SL/TP dynamically from your live Gold candlestick price, and enforcing 0.01 micro lot so max loss stays capped at $2.00 (260 KES).';
      brokerNote = 'FXPesa Kenya (CMA License #107) · 1:400 Cap · Zero Debt Liability';
    } else if (num === '01' || titleLower.includes('forex') || titleLower.includes('what is')) {
      pair = 'EUR/USD';
      displayPair = 'EUR/USD (Fiber)';
      timeframe = 'M15';
      session = 'London Session (10:00 AM EAT)';
      bias = 'BUY';
      entry = 1.12670;
      pnlUsd = '+15.90';
      pnlKes = '+2,067 KES';
      retailTrap = 'Confusing Bid vs Ask prices, placing a BUY order with a Stop Loss above the live chart price (1.12670), and sizing 0.10 lots without knowing each pip costs $1.00 USD.';
      institutionalEdge = 'Mastered the mechanics: 1 pip on 0.01 EUR/USD = $0.10 USD (13 KES). With live chart entry @ 1.12670 and a 16-pip SL at 1.12510, risk is strictly $1.60 (208 KES), leaving 98% of capital untouched.';
      brokerNote = 'FXPesa / Exness · Spread 1.1 pips · Instant M-Pesa Deposit';
    } else if (num === '02' || titleLower.includes('participant') || titleLower.includes('bank') || titleLower.includes('liquidity')) {
      pair = 'USD/JPY';
      displayPair = 'USD/JPY (Ninja)';
      timeframe = 'M15';
      session = 'Asian Session (03:00 - 08:00 EAT)';
      bias = 'SELL';
      entry = 158.250;
      pnlUsd = '+18.20';
      pnlKes = '+2,366 KES';
      retailTrap = 'Trying to pick tops against central bank liquidity injections or copying static signal screenshots from hours earlier without checking the current USD/JPY candlestick (158.250).';
      institutionalEdge = 'Tracking commercial bank order flow and waiting for post-sweep displacement around 158.250 before setting a 16-pip Stop Loss above the sweep high.';
      brokerNote = 'FXPesa · 1.2 pip spread on USDJPY · ECN Order Matching';
    } else if (num === '05' || titleLower.includes('tradingview') || titleLower.includes('setup') || titleLower.includes('chart')) {
      pair = 'GBP/USD';
      displayPair = 'GBP/USD (M10 / M15)';
      timeframe = 'M10';
      session = 'Pre-London Prep (09:30 AM EAT)';
      bias = 'BUY';
      entry = 1.34998;
      pnlUsd = '+18.00';
      pnlKes = '+2,340 KES';
      retailTrap = 'Installing 12 overlapping neon indicators causing cognitive overload and misreading the active candlestick price when switching between TradingView and MT4.';
      institutionalEdge = 'Using a clean TradingView layout (#0F172A) with 20 EMA, 50 EMA, Session Breaks (Alt+S), and Nairobi UTC+3 sync so your chart quote matches MT4.';
      brokerNote = 'TradingView Live Feed Sync · MT4/MT5 Direct Hotkeys';
    } else if (num === '06' || titleLower.includes('mt4') || titleLower.includes('mt5') || titleLower.includes('order')) {
      pair = 'EUR/USD';
      displayPair = 'EUR/USD (Fiber)';
      timeframe = 'M15';
      session = 'London Open (10:00 AM EAT)';
      bias = 'BUY';
      entry = 1.12670;
      pnlUsd = '+16.50';
      pnlKes = '+2,145 KES';
      retailTrap = 'Typing Stop Loss or Take Profit values that violate broker stop-level distances or sit on the wrong side of Bid/Ask during spread expansion — triggering MT4 [Invalid S/L or T/P].';
      institutionalEdge = 'Pressing F9 to check the live Bid/Ask quote, verifying BUY rules (SL < Entry < TP) or SELL rules (TP < Entry < SL) with at least 12–16 pips clearance, and locking Volume at 0.01 micro lot.';
      brokerNote = 'MT4/MT5 Hotkey F9 · Ctrl+T Terminal · Gilgil Preset';
    }

    const computed = computeRealChartTradeParams({
      targetPair: pair,
      targetTf: timeframe,
      targetBroker: 'fxpesa',
      price: entry,
      biasOverride: bias,
    });

    return {
      pair,
      displayPair,
      timeframe,
      session,
      orderType: computed.orderType,
      direction: computed.direction,
      entry: computed.entryPrice,
      sl: computed.stopLoss,
      tp1: computed.tp1,
      tp2: computed.tp2,
      slPips: computed.slPips,
      tpPips: computed.tpPips,
      riskReward: computed.riskReward,
      mt4SafetyProof: computed.mt4SafetyProof,
      pnlUsd,
      pnlKes,
      retailTrap,
      institutionalEdge,
      brokerNote,
    };
  };

  const details = getExpoundedDetails();

  // Interactive Lesson Live Chart & MT4 Order Calculator State
  const [practicePrice, setPracticePrice] = useState<number>(details.entry);
  const [practiceDir, setPracticeDir] = useState<'BUY' | 'SELL'>(details.direction);
  const [practiceTf, setPracticeTf] = useState<Timeframe>(details.timeframe);
  const [recalculatedBanner, setRecalculatedBanner] = useState<string | null>(null);

  useEffect(() => {
    setPracticePrice(details.entry);
    setPracticeDir(details.direction);
    setPracticeTf(details.timeframe);
    setRecalculatedBanner(null);
  }, [lesson.id]);

  const practiceComputed = computeRealChartTradeParams({
    targetPair: details.pair,
    targetTf: practiceTf,
    targetBroker: 'fxpesa',
    price: practicePrice > 0 ? practicePrice : details.entry,
    biasOverride: practiceDir,
  });

  const handleCopyTicket = () => {
    const ticketText = `[PIVOTFX INSTITUTIONAL ORDER TICKET]
Pillar: ${pillar.title} (Lesson ${lesson.number}: ${lesson.title})
Symbol: ${details.pair} (${practiceTf})
Session: ${details.session}
Order Type: ${practiceComputed.orderType}
Entry Price: ${practiceComputed.entryPrice}
Stop Loss: ${practiceComputed.stopLoss} (-${practiceComputed.slPips} pips / $${practiceComputed.actualRiskUsd.toFixed(2)} Max Risk)
Take Profit 1: ${practiceComputed.tp1} (Close 50% & Move to Breakeven)
Take Profit 2: ${practiceComputed.tp2} (+${practiceComputed.tpPips} pips Final Target)
Volume: 0.01 Micro Lot (Strict Gilgil Shield)
Risk:Reward = ${practiceComputed.riskReward}
Validation: ${practiceComputed.mt4SafetyProof}
CMA Protection: Zero Negative Balance Debt Risk`;

    navigator.clipboard.writeText(ticketText);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION 1: DEEP EXPOUNDED TOPIC MASTERCLASS */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-[#D4AF37]/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Lesson {lesson.number} Deep Technical Masterclass & Execution Guide
            </h4>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Live Calibrated Edition
          </span>
        </div>

        {/* In-depth Concept Exploration */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <p className="font-semibold text-white">
            {lesson.concept}
          </p>
          <p className="text-slate-300">
            {lesson.summary} Every institutional setup requires matching your Stop Loss and Take Profit directly to the live candlestick price visible on your chart rather than relying on outdated screenshots.
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
              <p className="text-xs text-slate-300 pl-7 leading-relaxed">
                {bp.includes(':') ? bp.split(':')[1] : bp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: LIVE REAL-WORLD MARKET CASE STUDY & INTERACTIVE MT4 S/L VALIDATOR */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-black px-2.5 py-0.5 rounded-md bg-[#D4AF37]">
                {details.displayPair}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {practiceTf} Chart
              </span>
              <span className="text-xs font-mono text-slate-400">
                · {details.session}
              </span>
            </div>
            <h5 className="text-sm font-bold text-white font-mono">
              Live Real-World Market Case Study & Interactive MT4 Order Calculator
            </h5>
          </div>

          <button
            onClick={handleCopyTicket}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap shrink-0"
          >
            {copiedTicket ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTicket ? 'Copied Order Ticket!' : 'Copy MT4/MT5 Ticket'}</span>
          </button>
        </div>

        {/* Interactive Chart Candlestick Sync Bar inside Lesson */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-[#D4AF37]/35 space-y-3 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Practice With Your Live Chart Quote (Prevents [Invalid S/L or T/P])</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-bold">{practiceComputed.mt4SafetyProof}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Live Candlestick Price ({details.pair})</label>
              <input
                type="number"
                step="any"
                value={practicePrice}
                onChange={(e) => setPracticePrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-[#D4AF37] outline-none tabular-nums"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Order Side</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['BUY', 'SELL'] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setPracticeDir(side)}
                    className={`py-2 rounded-xl font-bold text-xs transition ${
                      practiceDir === side
                        ? side === 'BUY'
                          ? 'bg-[#00C261] text-black'
                          : 'bg-red-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Timeframe</label>
              <select
                value={practiceTf}
                onChange={(e) => setPracticeTf(e.target.value as Timeframe)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-[#D4AF37] outline-none"
              >
                <option value="M5">M5 (5m)</option>
                <option value="M10">M10 (10m)</option>
                <option value="M15">M15 (15m)</option>
                <option value="H1">H1 (1h)</option>
                <option value="H4">H4 (4h)</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  const defaultRate = INITIAL_MARKETS_DATA.find((x) => x.pair === details.pair)?.price || details.entry;
                  const target = practicePrice > 0 ? practicePrice : defaultRate;
                  setPracticePrice(target);
                  setRecalculatedBanner(`Recalculated ${practiceComputed.orderType} ticket anchored to ${target} (${practiceTf})`);
                  setTimeout(() => setRecalculatedBanner(null), 3000);
                }}
                className="w-full py-2 px-3 rounded-xl btn-gold text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition active:scale-95 whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Analyse / Recalculate</span>
              </button>
            </div>
          </div>

          {recalculatedBanner && (
            <div className="text-[11px] text-[#00C261] font-bold pt-1">
              ✓ {recalculatedBanner}
            </div>
          )}
        </div>

        {/* Order Numerical Placement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono tabular-nums">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">1. Order Type</span>
            <span className="text-xs sm:text-sm font-black text-white">{practiceComputed.orderType}</span>
            <span className="text-[10px] text-slate-400 block">Instant Execution</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">2. Entry Price</span>
            <span className="text-xs sm:text-sm font-black text-[#D4AF37]">@{practiceComputed.entryPrice}</span>
            <span className="text-[10px] text-slate-400 block">Live Candle Match</span>
          </div>

          <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40">
            <span className="text-[10px] text-red-400 block uppercase font-bold">
              3. Stop Loss (-{practiceComputed.slPips}p)
            </span>
            <span className="text-xs sm:text-sm font-black text-red-300">{practiceComputed.stopLoss}</span>
            <span className="text-[10px] text-red-400 block">Risk: ${practiceComputed.actualRiskUsd.toFixed(2)} (260 KES)</span>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
            <span className="text-[10px] text-cyan-400 block uppercase font-bold">
              4. TP1 (50% Close & BE)
            </span>
            <span className="text-xs sm:text-sm font-black text-cyan-300">{practiceComputed.tp1}</span>
            <span className="text-[10px] text-cyan-400 block">Scale Out & Breakeven</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
            <span className="text-[10px] text-emerald-400 block uppercase font-bold">
              5. Final TP (+{practiceComputed.tpPips}p)
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-300">{practiceComputed.tp2}</span>
            <span className="text-[10px] text-emerald-400 block">R:R = {practiceComputed.riskReward}</span>
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
