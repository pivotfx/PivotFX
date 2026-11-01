import React, { useState, useEffect } from 'react';
import { BrokerInfo, PageTab } from '../types';
import { BROKERS } from '../data/forexData';
import { CustomSelect, SelectOption } from '../components/common/CustomSelect';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Smartphone,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  XCircle,
  X,
  Info,
  DollarSign,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BrokerHubPageProps {
  onNavigate: (tab: PageTab) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

export const BrokerHubPage: React.FC<BrokerHubPageProps> = ({ onNavigate, onAwardXp }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedBrokerReview, setSelectedBrokerReview] = useState<BrokerInfo | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Live ticking spread simulation
  const [spreadVariance, setSpreadVariance] = useState<Record<string, number>>({
    fxpesa: 1.2,
    hfm: 1.1,
    fbs: 1.3,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Add realistic microscopic float
      setSpreadVariance({
        fxpesa: Number((1.2 + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        hfm: Number((1.1 + (Math.random() * 0.3 - 0.1)).toFixed(1)),
        fbs: Number((1.3 + (Math.random() * 0.4 - 0.1)).toFixed(1)),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter options
  const filterOptions: SelectOption[] = [
    { value: 'all', label: 'All Compared Brokers' },
    { value: 'cma', label: 'CMA Kenya Licensed Only (Protected)' },
    { value: 'offshore', label: 'Offshore High Leverage (1:1000+)' },
    { value: 'mpesa', label: 'Direct Lipa Na M-Pesa Native' },
  ];

  const filteredBrokers = BROKERS.filter((b) => {
    if (filterType === 'cma') return b.cmaLicensed;
    if (filterType === 'offshore') return !b.cmaLicensed;
    if (filterType === 'mpesa') return b.id === 'fxpesa';
    return true;
  });

  // Broker Quiz State
  const [quizAnswers, setQuizAnswers] = useState({
    experience: '',
    payment: '',
    leverage: '',
  });
  const [quizRecommendation, setQuizRecommendation] = useState<string | null>(null);

  const handleRunQuiz = () => {
    if (!quizAnswers.experience || !quizAnswers.payment) {
      alert('Please answer the questions.');
      return;
    }
    if (quizAnswers.payment === 'mpesa' || quizAnswers.experience === 'beginner') {
      setQuizRecommendation('FXPesa');
    } else if (quizAnswers.leverage === 'high') {
      setQuizRecommendation('HFM (HF Markets)');
    } else {
      setQuizRecommendation('FXPesa');
    }
    onAwardXp(30, 'Completed Kenya Broker Selection Quiz');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00C261', '#38BDF8'],
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00C261] uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Pillar 6 • Unbiased Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Forex Broker Hub (Kenya & Offshore)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live side-by-side comparison between <strong>FXPesa (CMA Licensed in Nairobi)</strong> and offshore alternatives <strong>HFM</strong> & <strong>FBS</strong>.
          </p>
        </div>

        <button
          onClick={() => {
            setShowQuizModal(true);
            setQuizRecommendation(null);
          }}
          className="px-5 py-3 rounded-2xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-[#00C261]/20 flex items-center gap-2 active:scale-95"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Which Broker is Best for Kenya? (30s Quiz)</span>
        </button>
      </div>

      {/* Filter and Live Refresh Ribbon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#111827] border border-slate-800">
        <div className="w-full sm:w-80">
          <CustomSelect
            options={filterOptions}
            value={filterType}
            onChange={(val) => setFilterType(val)}
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <RefreshCw className="w-3.5 h-3.5 text-[#00C261] animate-spin" />
          <span>Live EUR/USD Spread: Dynamic Interbank Tick</span>
        </div>
      </div>

      {/* Main Comparison Table Card */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1524] text-slate-300 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 sm:p-5">Broker</th>
                <th className="p-4 sm:p-5">Regulation (Legal Safety)</th>
                <th className="p-4 sm:p-5">M-Pesa Integration</th>
                <th className="p-4 sm:p-5">Live EUR/USD Spread</th>
                <th className="p-4 sm:p-5">Leverage</th>
                <th className="p-4 sm:p-5">Trust Score</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBrokers.map((broker) => {
                const currentSpread = spreadVariance[broker.id] || broker.baseSpread;
                return (
                  <tr
                    key={broker.id}
                    className="hover:bg-slate-800/40 transition group"
                  >
                    {/* Broker Name & Badge */}
                    <td className="p-4 sm:p-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-white group-hover:text-[#00C261] transition">
                            {broker.name}
                          </span>
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            broker.cmaLicensed
                              ? 'bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {broker.badge}
                        </span>
                      </div>
                    </td>

                    {/* Regulation */}
                    <td className="p-4 sm:p-5 max-w-xs">
                      <div className="flex items-start gap-1.5">
                        {broker.cmaLicensed ? (
                          <ShieldCheck className="w-4 h-4 text-[#00C261] shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <span className="text-slate-300 leading-relaxed">{broker.regulation}</span>
                      </div>
                    </td>

                    {/* M-Pesa Support */}
                    <td className="p-4 sm:p-5">
                      <div className="flex items-start gap-1.5">
                        <Smartphone className="w-4 h-4 text-[#00C261] shrink-0 mt-0.5" />
                        <span className="text-slate-300">{broker.mpesaSupport}</span>
                      </div>
                    </td>

                    {/* Live Spread */}
                    <td className="p-4 sm:p-5 font-mono">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#00C261] animate-ping" />
                        <strong className="text-white text-sm">{currentSpread}</strong>
                        <span className="text-[10px] text-slate-400">pips</span>
                      </div>
                    </td>

                    {/* Leverage */}
                    <td className="p-4 sm:p-5 font-mono">
                      <span className="text-slate-200 font-bold block">{broker.leverage}</span>
                      <span className="text-[10px] text-slate-500">
                        {broker.cmaLicensed ? 'CMA Safety Cap' : 'High Liquidation Risk'}
                      </span>
                    </td>

                    {/* Trust Score */}
                    <td className="p-4 sm:p-5 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-[#00C261]">{broker.trustScore}</span>
                        <span className="text-slate-500 text-xs">/ 10</span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBrokerReview(broker)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                        >
                          Review
                        </button>
                        <a
                          href={broker.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#00C261]/20 hover:bg-[#00C261]/30 text-[#00C261] border border-[#00C261]/30 font-bold text-xs transition flex items-center gap-1"
                        >
                          Free Demo <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CMA Safety & Affiliate Disclosure Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <strong className="text-white flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#00C261]" /> Why CMA Licensing Matters in Kenya:
          </strong>
          <p className="text-slate-400 leading-relaxed">
            Brokers regulated by the Capital Markets Authority (CMA) like FXPesa are required to segregate client funds in top-tier Kenyan commercial banks. In the event of a dispute, traders have legal recourse through the Kenyan judicial system and the CMA Ombudsman.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <strong className="text-amber-400 flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Educational & Affiliate Transparency:
          </strong>
          <p className="text-slate-400 leading-relaxed">
            PivotFX Lab is completely free for all Kenyan users. Some outbound links may contain referral parameters that help fund our Gilgil community server hosting and free educational materials, at zero cost to you.
          </p>
        </div>
      </div>

      {/* In-depth Review Modal */}
      {selectedBrokerReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#111827] border border-slate-700 p-6 sm:p-8 space-y-6 text-slate-200">
            <button
              onClick={() => setSelectedBrokerReview(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00C261]/15 text-[#00C261] border border-[#00C261]/30 flex items-center justify-center font-black font-mono text-xl">
                {selectedBrokerReview.name[0]}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">{selectedBrokerReview.name} In-Depth Audit</h3>
                <span className="text-xs text-[#00C261] font-mono">{selectedBrokerReview.badge}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white block mb-1">Best Suited For:</strong>
                <p>{selectedBrokerReview.bestFor}</p>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="font-bold text-[#00C261] font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Advantages:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {selectedBrokerReview.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#00C261]">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-red-950/20 border border-red-500/20">
                  <span className="font-bold text-red-400 font-mono flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Drawbacks:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {selectedBrokerReview.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400">•</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={selectedBrokerReview.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#00C261] text-black font-extrabold text-xs uppercase hover:bg-[#00dc6e] transition"
              >
                Open Demo Account
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Kenya Broker Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#111827] border border-slate-700 p-6 sm:p-8 space-y-6 text-slate-200">
            <button
              onClick={() => setShowQuizModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#00C261] text-xs font-mono font-bold uppercase">
                <Sparkles className="w-4 h-4" /> 30-Second Selector
              </div>
              <h3 className="text-xl font-black text-white">Which Broker is Best for Me in Kenya?</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  1. What is your forex trading experience?
                </label>
                <select
                  value={quizAnswers.experience}
                  onChange={(e) => setQuizAnswers({ ...quizAnswers, experience: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white outline-none"
                >
                  <option value="">Select experience level...</option>
                  <option value="beginner">Total Beginner / Still Learning</option>
                  <option value="intermediate">Demo Trader / Micro Lot Sizing</option>
                  <option value="advanced">Experienced Scalper</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  2. What is your primary deposit/withdrawal method?
                </label>
                <select
                  value={quizAnswers.payment}
                  onChange={(e) => setQuizAnswers({ ...quizAnswers, payment: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white outline-none"
                >
                  <option value="">Select payment method...</option>
                  <option value="mpesa">Direct Lipa Na M-Pesa (Kenya Shillings)</option>
                  <option value="cards">Visa / Mastercard / Wire</option>
                  <option value="crypto">Cryptocurrency (USDT)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  3. What is your preference for leverage?
                </label>
                <select
                  value={quizAnswers.leverage}
                  onChange={(e) => setQuizAnswers({ ...quizAnswers, leverage: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0B0F17] border border-slate-700 text-white outline-none"
                >
                  <option value="">Select leverage tolerance...</option>
                  <option value="safe">Safe 1:400 (CMA Consumer Capped)</option>
                  <option value="high">High 1:1000+ (Aggressive Scalping)</option>
                </select>
              </div>

              {quizRecommendation ? (
                <div className="p-4 rounded-xl bg-[#00C261]/15 border border-[#00C261]/40 text-center space-y-2 animate-in zoom-in-95">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Recommended Broker</span>
                  <div className="text-xl font-black text-[#00C261]">{quizRecommendation}</div>
                  <p className="text-slate-300 text-xs">
                    {quizRecommendation === 'FXPesa'
                      ? 'Because you prioritize M-Pesa convenience and capital protection, FXPesa (CMA Licensed in Nairobi) is your safest choice.'
                      : 'Because you requested high offshore leverage, HFM is suited for your advanced strategy.'}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRunQuiz}
                  className="w-full py-3 rounded-xl bg-[#00C261] hover:bg-[#00dc6e] text-black font-extrabold uppercase tracking-wider text-xs transition"
                >
                  Calculate Best Match
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
