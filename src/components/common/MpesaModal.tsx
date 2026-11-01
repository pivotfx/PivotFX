import React, { useState } from 'react';
import { Smartphone, CheckCircle2, Copy, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({ isOpen, onClose }) => {
  const [copiedPaybill, setCopiedPaybill] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal'>('deposit');

  if (!isOpen) return null;

  const handleCopyPaybill = () => {
    navigator.clipboard.writeText('832900');
    setCopiedPaybill(true);
    setTimeout(() => setCopiedPaybill(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111827] border border-slate-700 p-6 sm:p-8 space-y-5 text-slate-200 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/30">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#00C261] bg-[#00C261]/10 px-2 py-0.5 rounded uppercase">
                Official Kenya Integration
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              FXPesa Lipa Na M-Pesa Guide
            </h3>
          </div>
        </div>

        {/* Tab switch: Deposit vs Withdrawal */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'deposit' ? 'bg-[#00C261] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Deposit via M-Pesa
          </button>
          <button
            onClick={() => setActiveTab('withdrawal')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'withdrawal' ? 'bg-[#00C261] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Withdraw to M-Pesa
          </button>
        </div>

        {activeTab === 'deposit' ? (
          <div className="space-y-4 text-xs">
            {/* Paybill Quick Box */}
            <div className="p-4 rounded-2xl bg-[#0B0F17] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Official CMA Paybill (EGM Securities)</span>
                <div className="text-2xl font-black font-mono text-[#00C261] tracking-widest">
                  832900
                </div>
              </div>
              <button
                onClick={handleCopyPaybill}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedPaybill ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPaybill ? 'Copied!' : 'Copy Paybill'}
              </button>
            </div>

            {/* Step-by-Step Dialing list */}
            <ol className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-[#00C261]/20 text-[#00C261] flex items-center justify-center font-mono font-bold shrink-0">1</span>
                <span>Open Safaricom SIM ToolKit or M-Pesa App and select <strong>Lipa Na M-Pesa</strong> ➔ <strong>Paybill</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-[#00C261]/20 text-[#00C261] flex items-center justify-center font-mono font-bold shrink-0">2</span>
                <span>Enter Business No: <strong className="text-white font-mono">832900</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-[#00C261]/20 text-[#00C261] flex items-center justify-center font-mono font-bold shrink-0">3</span>
                <span>Account Number: Enter your <strong>FXPesa MT4 or MT5 Trading Account Number</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-[#00C261]/20 text-[#00C261] flex items-center justify-center font-mono font-bold shrink-0">4</span>
                <span>Enter amount in KES (Min: 650 KES / $5) and your M-Pesa PIN. Funds credit instantly within 60 seconds.</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <strong className="text-white block font-mono">Instant Payout Timeline:</strong>
              <p className="text-slate-400 leading-relaxed">
                Log into your FXPesa Client Portal, navigate to <strong>Withdrawals</strong>, select <strong>M-Pesa</strong>, enter your Safaricom phone number, and confirm. Withdrawals are processed directly to your phone within <strong>15 to 30 minutes</strong> during Kenyan banking hours.
              </p>
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-emerald-950/20 border border-[#00C261]/30 text-[11px] text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00C261] shrink-0" />
          <span>Zero deposit transaction fees. Regulated locally by CMA Kenya.</span>
        </div>
      </div>
    </div>
  );
};
