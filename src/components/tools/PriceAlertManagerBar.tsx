import React, { useState, useEffect } from 'react';
import { CurrencyPair, PriceAlertRule } from '../../types';
import { getPairSpecs, globalLiveStream } from '../../utils/liveMarketEngine';
import { Bell, BellRing, CheckCircle2, Plus, Trash2, X } from 'lucide-react';

interface PriceAlertManagerBarProps {
  mode: 'pair' | 'global';
  pair?: CurrencyPair;
  livePrice?: number;
  ema20?: number;
  bosLevel?: number;
  tp1?: number;
  onInspectPair?: (pair: CurrencyPair) => void;
}

export const PriceAlertManagerBar: React.FC<PriceAlertManagerBarProps> = ({
  mode,
  pair = 'EUR/USD',
  livePrice = 0,
  ema20 = 0,
  bosLevel = 0,
  tp1 = 0,
  onInspectPair
}) => {
  const [alerts, setAlerts] = useState<PriceAlertRule[]>(() => globalLiveStream.getState().priceAlerts);
  const [customTarget, setCustomTarget] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = globalLiveStream.subscribe((st) => {
      setAlerts(st.priceAlerts);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setCustomTarget('');
  }, [pair]);

  const flash = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleAddQuickAlert = (targetPair: CurrencyPair, price: number, label: string) => {
    if (!Number.isFinite(price) || price <= 0) return;
    const rule = globalLiveStream.addPriceAlert({
      pair: targetPair,
      targetPrice: price,
      label
    });
    if (rule) {
      flash(`Armed ${rule.pair} ${rule.condition === 'ABOVE' ? '≥' : '≤'} ${rule.targetPrice} (${label})`);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customTarget);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    handleAddQuickAlert(pair, parsed, 'Custom Price Level');
    setCustomTarget('');
  };

  if (mode === 'global') {
    if (alerts.length === 0) return null;
    const armedCount = alerts.filter((a) => !a.triggered).length;
    const hitCount = alerts.filter((a) => a.triggered).length;

    return (
      <div className="p-3.5 rounded-2xl bg-[#09101D] border border-cyan-500/40 space-y-2.5 font-mono tabular-nums text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <BellRing className={`w-4 h-4 ${hitCount > 0 ? 'text-[#00C261]' : 'text-cyan-300'}`} />
            <strong className="text-white uppercase tracking-wider text-[11px]">
              Live Price Alert Watchlist
            </strong>
            <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
              {armedCount} Armed
            </span>
            {hitCount > 0 && (
              <span className="px-2 py-0.5 rounded bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40 text-[10px] font-black">
                {hitCount} Triggered
              </span>
            )}
          </div>

          {hitCount > 0 && (
            <button
              type="button"
              onClick={() => globalLiveStream.clearTriggeredAlerts()}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Hit</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {alerts.slice(0, 10).map((alert) => (
            <div
              key={alert.id}
              className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[11px] ${
                alert.triggered
                  ? 'bg-emerald-950/60 border-[#00C261]/60 text-emerald-100'
                  : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => onInspectPair?.(alert.pair)}
                className="flex items-center gap-1.5 text-left hover:text-[#D4AF37] transition"
              >
                {alert.triggered ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00C261] shrink-0" />
                ) : (
                  <Bell className="w-3 h-3 text-cyan-300 shrink-0" />
                )}
                <strong className="text-white">{alert.pair}</strong>
                <span className="text-[#D4AF37]">
                  {alert.condition === 'ABOVE' ? '≥' : '≤'} {alert.targetPrice}
                </span>
                <span className="text-slate-400 text-[10px]">· {alert.label}</span>
                {alert.triggered && alert.triggeredAtEat && (
                  <span className="text-[#00C261] font-bold text-[10px]">
                    (Hit {alert.triggeredAtEat})
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => globalLiveStream.removePriceAlert(alert.id)}
                className="text-slate-500 hover:text-red-400 transition"
                aria-label={`Remove alert for ${alert.pair}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pair Mode (inside Focused Pair Card)
  const { decimals } = getPairSpecs(pair);
  const pairAlerts = alerts.filter((a) => a.pair === pair);
  const emaRounded = ema20 > 0 ? Number(ema20.toFixed(decimals)) : 0;
  const bosRounded = bosLevel > 0 ? Number(bosLevel.toFixed(decimals)) : 0;
  const tp1Rounded = tp1 > 0 ? Number(tp1.toFixed(decimals)) : 0;

  return (
    <div className="p-3.5 rounded-2xl bg-[#09101D] border border-cyan-500/35 space-y-2.5 font-mono tabular-nums text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Bell className="w-4 h-4 text-cyan-300 shrink-0" />
          <strong className="text-white text-[11px] uppercase tracking-wider">
            Price Alert Trigger ({pair})
          </strong>
          <span className="text-[10px] text-slate-400">
            Audio chime + Trade Log alert on every live tick
          </span>
        </div>

        {feedback && (
          <span className="text-[10px] font-bold text-[#00C261]">{feedback}</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {emaRounded > 0 && (
          <button
            type="button"
            onClick={() => handleAddQuickAlert(pair, emaRounded, '20 EMA Pullback')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition whitespace-nowrap"
          >
            + Alert @ EMA20 ({emaRounded})
          </button>
        )}

        {bosRounded > 0 && (
          <button
            type="button"
            onClick={() => handleAddQuickAlert(pair, bosRounded, 'BOS Level Break')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[11px] font-bold transition whitespace-nowrap"
          >
            + Alert @ BOS ({bosRounded})
          </button>
        )}

        {tp1Rounded > 0 && (
          <button
            type="button"
            onClick={() => handleAddQuickAlert(pair, tp1Rounded, 'TP1 Scale-Out')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40 text-[11px] font-bold transition whitespace-nowrap"
          >
            + Alert @ TP1 ({tp1Rounded})
          </button>
        )}

        <form onSubmit={handleCustomSubmit} className="inline-flex items-center gap-1.5">
          <input
            type="number"
            step="any"
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
            placeholder={livePrice > 0 ? String(livePrice) : 'Target price'}
            aria-label={`Custom alert price for ${pair}`}
            className="w-28 sm:w-32 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs text-white outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-[11px] inline-flex items-center gap-1 transition whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Arm Alert</span>
          </button>
        </form>
      </div>

      {pairAlerts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/80">
          {pairAlerts.map((a) => (
            <span
              key={a.id}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                a.triggered
                  ? 'bg-emerald-950/60 border-[#00C261]/60 text-[#00C261]'
                  : 'bg-slate-950 border-slate-700 text-slate-200'
              }`}
            >
              <span>
                {a.triggered ? 'HIT ✓' : 'ARMED'} {a.condition === 'ABOVE' ? '≥' : '≤'} {a.targetPrice} ({a.label})
              </span>
              <button
                type="button"
                onClick={() => globalLiveStream.removePriceAlert(a.id)}
                className="text-slate-400 hover:text-red-400 transition"
                aria-label="Delete alert"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
