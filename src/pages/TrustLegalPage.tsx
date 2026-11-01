import React, { useState } from 'react';
import { PageTab } from '../types';
import { FAQS, HISTORICAL_GILGIL_CASES } from '../data/forexData';
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  HelpCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface TrustLegalPageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenRiskModal: () => void;
}

export const TrustLegalPage: React.FC<TrustLegalPageProps> = ({ onNavigate, onOpenRiskModal }) => {
  const [activeSubTab, setActiveSubTab] = useState<'story' | 'legal' | 'faqs' | 'contact'>('story');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 4000);
    setFeedbackName('');
    setFeedbackMsg('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Pillar 8 • Radical Transparency</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Trust, Gilgil Roots, Legal & Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            The authentic story behind PivotFX Lab, our strict compliance disclosures, and answers to common Kenyan trader questions.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveSubTab('story')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'story'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            The Gilgil Story
          </button>
          <button
            onClick={() => setActiveSubTab('legal')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'legal'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Legal & CMA Notice
          </button>
          <button
            onClick={() => setActiveSubTab('faqs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'faqs'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveSubTab('contact')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'contact'
                ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Contact & Support
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: THE AUTHENTIC GILGIL STORY */}
      {activeSubTab === 'story' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00C261] font-bold uppercase">
              <MapPin className="w-4 h-4" />
              <span>Gilgil, Nakuru County, Great Rift Valley, Kenya</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Why We Built PivotFX Lab in Gilgil
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              <p>
                In 2024, in the quiet town of Gilgil, Kenya, our small group of traders fell into the same brutal trap that consumes thousands of young Kenyans every day: chasing massive green candlestick "towers".
              </p>
              <p>
                We bought heavily at <strong className="text-red-400 font-mono">1296.56</strong> on MT4. We didn't know about moving average extensions or RSI divergence. We had no stop loss, risking far more than we could afford. In 15 minutes, the market formed an institutional rejection wick, crashing down 70+ pips. That single day wiped out our balance and taught us a permanent lesson in humility.
              </p>
              <p>
                Instead of quitting or buying fake VIP signals from Telegram scammers, we sat down in Gilgil and spent months backtesting. We codified the <strong className="text-[#00C261]">1291.69 Reversal System</strong> and the immutable <strong className="text-white">$2 Survival Rule</strong>.
              </p>
              <p>
                PivotFX Lab is our free gift to the Kenyan trading community. We don't take your money. We don't sell bot subscriptions. We give you the compass (education), the net (AI scanner), and the math (risk management).
              </p>
            </div>

            {/* Screen Mockup & Verified Proof Showcase */}
            <div className="p-6 rounded-2xl bg-[#070A10] border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <span className="font-mono text-slate-400">
                  Documented Proof • The Turning Point Trades
                </span>
                <span className="text-[#00C261] font-mono font-bold">
                  Verified MT4 Execution Logs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1296.56 Loss Case */}
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-red-400">
                    <span className="flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4" /> The 1296.56 Mistake
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20">BLOWN</span>
                  </div>
                  <p className="text-xs text-red-200/90 leading-relaxed">
                    {HISTORICAL_GILGIL_CASES.towerLoss.description}
                  </p>
                  <span className="text-[10px] text-red-300 font-mono block">
                    Lesson: Never chase candles 40+ pips from 20 EMA with RSI &gt; 80.
                  </span>
                </div>

                {/* 1291.69 Win Case */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-[#00C261]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#00C261]">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" /> The 1291.69 Execution
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#00C261]/20">+23.1 PIPS WIN</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {HISTORICAL_GILGIL_CASES.towerWin.description}
                  </p>
                  <span className="text-[10px] text-emerald-300 font-mono block">
                    Result: Reversal short with $2 stop hit target at 1289.38.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LEGAL & CMA NOTICE */}
      {activeSubTab === 'legal' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-panel-warning rounded-3xl p-6 sm:p-10 border border-amber-500/30 space-y-6 text-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Statutory Regulatory Disclosure
                </span>
                <h2 className="text-2xl font-black text-white mt-0.5">
                  Legal Status & Risk Disclaimers
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-b border-slate-800 py-5">
              <div>
                <strong className="text-white text-base block mb-1">1. Unregistered Educational Entity</strong>
                <p>
                  PivotFX Lab is an UNREGISTERED, non-commercial educational project based in Gilgil, Kenya. It is NOT a registered financial advisory firm, fund manager, dealer, or deposit-taking institution under the Capital Markets Authority (CMA) of Kenya.
                </p>
              </div>

              <div>
                <strong className="text-white text-base block mb-1">2. Broker Distinction in Kenya</strong>
                <p>
                  We explicitly distinguish between local and foreign brokers:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400 pt-1">
                  <li>
                    <strong className="text-white">FXPesa (EGM Securities Ltd):</strong> Licensed and regulated by the CMA Kenya under license number 107. Operates locally in Nairobi with direct Lipa Na M-Pesa.
                  </li>
                  <li>
                    <strong className="text-white">HFM and FBS:</strong> Registered in offshore jurisdictions (Seychelles, Belize, SVG). They provide higher leverage (1:1000+) but are NOT regulated by the Kenyan CMA.
                  </li>
                </ul>
              </div>

              <div>
                <strong className="text-white text-base block mb-1">3. Retail Investor Loss Rate</strong>
                <p>
                  Between <strong>70% and 80% of retail investor accounts lose money</strong> when trading forex and CFDs. Past performance of any historical setup (including the 1291.69 case study) is never a guarantee of future returns.
                </p>
              </div>

              <div>
                <strong className="text-white text-base block mb-1">4. Not Deriv Synthetics</strong>
                <p>
                  PivotFX Lab does not cover synthetic crash/boom/volatility indices. Those are covered under our independent project TickWealth.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenRiskModal}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition"
            >
              Re-open Mandatory Risk Modal
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FAQS ACCORDION */}
      {activeSubTab === 'faqs' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00C261] font-bold uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-2xl font-black text-white">
            Everything You Need to Know About PivotFX Lab
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-[#0B0F17] border border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded bg-slate-800 text-slate-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CONTACT & SUPPORT */}
      {activeSubTab === 'contact' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00C261] font-bold uppercase">
            <Mail className="w-4 h-4" />
            <span>Gilgil Community Support</span>
          </div>

          <h2 className="text-2xl font-black text-white">Get in Touch with the Founders</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Have a question about setting up your FXPesa demo, MT4 indicators, or the $2 rule? Write directly to our Gilgil team.
          </p>

          <form onSubmit={handleSendFeedback} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Your Name / Trader Tag</label>
              <input
                type="text"
                required
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                placeholder="e.g. John from Nakuru"
                className="w-full p-3 rounded-xl bg-[#0B0F17] border border-slate-700 text-white outline-none focus:border-[#00C261]"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Message / Feedback / Bug Report</label>
              <textarea
                required
                rows={4}
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
                placeholder="Ask us anything about forex in Kenya..."
                className="w-full p-3 rounded-xl bg-[#0B0F17] border border-slate-700 text-white outline-none focus:border-[#00C261]"
              />
            </div>

            {feedbackSent && (
              <div className="p-3 rounded-xl bg-[#00C261]/20 border border-[#00C261] text-[#00C261] font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Message received! We will reply via email shortly.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-extrabold uppercase tracking-wider text-xs transition"
            >
              Submit Message
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Email: <a href="mailto:pivotfx638@gmail.com" className="text-cyan-400 underline">pivotfx638@gmail.com</a>
          </div>
        </div>
      )}
    </div>
  );
};
