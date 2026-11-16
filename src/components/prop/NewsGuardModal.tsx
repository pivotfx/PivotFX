import React, { useEffect, useState } from 'react';
import { CurrencyPair } from '../../types';
import {
  getUpcomingEconomicEvents,
  evaluatePairKenyaTiming,
  getCurrentMacroContext,
} from '../../utils/liveMarketEngine';
import { X, AlertCircle, Clock, ShieldAlert, Radio, Calendar } from 'lucide-react';

interface NewsGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPair: string;
}

function doesEventAffectPair(eventCurrency: string, pair: string): boolean {
  if (eventCurrency === 'XAU/USD') return pair === 'XAU/USD';
  if (eventCurrency === 'USD') {
    return (
      pair.includes('USD') ||
      pair === 'US30' ||
      pair === 'NAS100' ||
      pair === 'USOIL'
    );
  }
  return pair.includes(eventCurrency);
}

export const NewsGuardModal: React.FC<NewsGuardModalProps> = ({
  isOpen,
  onClose,
  selectedPair,
}) => {
  const [, setNowTick] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const events = getUpcomingEconomicEvents();
  const timing = evaluatePairKenyaTiming(selectedPair as CurrencyPair);
  const macro = getCurrentMacroContext();
  const isWeekendClosed = Boolean(timing.isWeekendClosed);
  const isOffSession = !isWeekendClosed && timing.windowStatusCode === 'CLOSED_WAIT';

  const activeRelevantLockout =
    !isWeekendClosed &&
    events.some(
      (ev) =>
        doesEventAffectPair(ev.currency, selectedPair) &&
        (ev.status === 'ACTIVE_NOW' || (ev.status === 'IMMINENT' && ev.minutesUntil <= 15))
    );

  const spreadStatusLabel = isWeekendClosed
    ? 'WEEKEND CLOSED — WAIT OPEN'
    : activeRelevantLockout
    ? 'HIGH-IMPACT NEWS LOCKOUT'
    : isOffSession
    ? `OFF-SESSION · OPENS IN ${timing.countdownFormatted}`
    : 'CURRENT SPREAD NORMAL';

  const spreadStatusClass = isWeekendClosed
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : activeRelevantLockout
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    : isOffSession
    ? 'bg-slate-800 text-amber-300 border-amber-500/30'
    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

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
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Red-Folder News Pre-Trade Lockout Guard
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-flex items-center">
                  <Radio className="w-2.5 h-2.5 text-rose-400 mr-1" /> LIVE EAT MONITOR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Synced to Nairobi EAT ({macro.eatTimeString}) · Protects active entries against macro slippage and spread spikes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Close News Guard Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Pair Quick Status */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-2 tabular-nums">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-mono text-slate-400">Target Instrument: </span>
              <span className="text-sm font-bold text-white font-mono">{selectedPair}</span>
              <span className="text-[11px] font-mono text-slate-400 ml-2">
                · {macro.sessionWindowName}
              </span>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border whitespace-nowrap ${spreadStatusClass}`}
          >
            {spreadStatusLabel}
          </span>
        </div>

        {/* Weekend / Market Closed Notice */}
        {isWeekendClosed && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-3 tabular-nums">
            <span>
              <strong>Weekend Interbank Closure:</strong> {selectedPair} spreads are paused until market open. 24/7 Crypto (BTC/USD, ETH/USD) remains active.
            </span>
            <span className="font-mono font-bold text-amber-300 whitespace-nowrap">
              Opens in {timing.countdownFormatted}
            </span>
          </div>
        )}

        {/* Live Events Schedule List */}
        <div className="space-y-3 my-4 max-h-[50vh] overflow-y-auto pr-1 tabular-nums">
          {events.map((event) => {
            const isRelevant = doesEventAffectPair(event.currency, selectedPair);
            const isActiveNow = !isWeekendClosed && event.status === 'ACTIVE_NOW';
            const isImminent = !isWeekendClosed && event.status === 'IMMINENT';
            const isPassed = !isWeekendClosed && event.status === 'PASSED';

            let timeText = `${event.timeEAT}`;
            let badgeText = 'CLEAR TO TRADE';
            let badgeClass = 'bg-slate-800 text-slate-300';

            if (isWeekendClosed) {
              timeText = `Resumes Mon · ${event.timeEAT}`;
              badgeText = 'WEEKEND PAUSED';
              badgeClass = 'bg-slate-800 text-amber-300 border border-amber-500/30';
            } else if (isActiveNow) {
              timeText =
                event.minutesUntil <= 0
                  ? `Active now (${event.timeEAT})`
                  : `in ${event.minutesUntil} min (${event.timeEAT})`;
              badgeText = 'LOCKOUT ENGAGED';
              badgeClass = 'bg-rose-500/30 text-rose-300 border border-rose-500/40';
            } else if (isImminent) {
              timeText = `in ${event.minutesUntil} min (${event.timeEAT})`;
              badgeText = 'APPROACHING WINDOW';
              badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
            } else if (isPassed) {
              timeText = `Released ${Math.abs(event.minutesUntil)}m ago (${event.timeEAT})`;
              badgeText = 'PASSED';
              badgeClass = 'bg-slate-800/80 text-slate-400';
            } else {
              timeText = `in ${event.minutesUntil} min (${event.timeEAT})`;
            }

            return (
              <div
                key={event.id}
                className={`p-4 rounded-xl border transition ${
                  isActiveNow
                    ? 'bg-rose-950/30 border-rose-500/50'
                    : isRelevant
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-900/50 border-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          event.impact === 'EXTREME'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {event.currency} · {event.impact}
                      </span>
                      {isRelevant && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Impacts {selectedPair}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white">{event.name}</h4>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      {event.tradingDirective}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end space-x-1.5 text-xs font-mono font-bold">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span className={isActiveNow ? 'text-rose-400 font-extrabold' : 'text-slate-300'}>
                        {timeText}
                      </span>
                    </div>
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold ${badgeClass}`}
                    >
                      {badgeText}
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
            <strong>Institutional Mandate:</strong> Orders placed within 15 minutes of red-folder events risk sharp spread expansion on retail brokers. The Entry Confirmation button warns before high-volatility windows.
          </p>
        </div>
      </div>
    </div>
  );
};
