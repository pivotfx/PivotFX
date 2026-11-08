import React from 'react';
import { SCHEDULED_RED_FOLDER_EVENTS } from '../../utils/propDeskStorage';
import { X, AlertCircle, Clock, ShieldAlert, Radio, Calendar } from 'lucide-react';

interface NewsGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPair: string;
}

export const NewsGuardModal: React.FC<NewsGuardModalProps> = ({
  isOpen,
  onClose,
  selectedPair,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0a0d17] border border-rose-500/30 rounded-2xl p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Red-Folder News Pre-Trade Lockout Guard
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                  <Radio className="w-2.5 h-2.5 text-rose-400 animate-pulse mr-1" /> ACTIVE MONITOR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated 15-minute pre-release lockout protects your trades against slippage and spread spikes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Pair Quick Status */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-mono text-slate-400">Target Instrument: </span>
              <span className="text-sm font-bold text-white font-mono">{selectedPair}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            CURRENT SPREAD NORMAL
          </span>
        </div>

        {/* Events Schedule List */}
        <div className="space-y-3 my-4 max-h-[50vh] overflow-y-auto pr-1">
          {SCHEDULED_RED_FOLDER_EVENTS.map((event) => {
            const isRelevant = event.pairsAffected.includes(selectedPair);
            const isLockoutTime = event.minutesUntilRelease <= 15;

            return (
              <div
                key={event.id}
                className={`p-4 rounded-xl border transition ${
                  isLockoutTime
                    ? 'bg-rose-950/30 border-rose-500/50'
                    : isRelevant
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-900/50 border-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white">
                        {event.currency} · {event.impact}
                      </span>
                      {isRelevant && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Directly Impacts {selectedPair}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white">{event.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-xs font-mono text-slate-400">
                      {event.forecast && <span>Forecast: <strong className="text-slate-200">{event.forecast}</strong></span>}
                      {event.previous && <span>Previous: <strong className="text-slate-200">{event.previous}</strong></span>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end space-x-1.5 text-xs font-mono font-bold">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span className={isLockoutTime ? 'text-rose-400 font-extrabold animate-pulse' : 'text-slate-300'}>
                        in {event.minutesUntilRelease} min
                      </span>
                    </div>
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        isLockoutTime
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isLockoutTime ? 'LOCKOUT ENGAGED' : 'CLEAR TO TRADE'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Warning */}
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p>
            <strong>Institutional Mandate:</strong> Orders placed within 15 minutes of red-folder events risk up to 12 pips of slippage on retail brokers. The Entry Confirmation button automatically cautions or disables during active lockouts.
          </p>
        </div>
      </div>
    </div>
  );
};
