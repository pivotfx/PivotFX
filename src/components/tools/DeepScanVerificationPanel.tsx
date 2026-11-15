import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  GitBranch
} from 'lucide-react';
import {
  ComputedTradeParams,
  DeepVerifyResult,
  getPairSpecs
} from '../../utils/liveMarketEngine';
import { CurrencyPair, Timeframe } from '../../types';

interface DeepScanVerificationPanelProps {
  pair: CurrencyPair;
  timeframe: Timeframe;
  computed: ComputedTradeParams;
  deepAudit?: DeepVerifyResult | null;
  isVerifying?: boolean;
  onRunDeepVerify: () => void;
}

export const DeepScanVerificationPanel: React.FC<DeepScanVerificationPanelProps> = ({
  pair,
  timeframe,
  computed,
  deepAudit,
  isVerifying = false,
  onRunDeepVerify
}) => {
  const { decimals } = getPairSpecs(pair);
  const bos = computed.bosAnalysis;
  const activeChecks =
    deepAudit && deepAudit.timeframe === timeframe && deepAudit.proposedDirection === computed.direction
      ? deepAudit.checks
      : computed.preflightChecks || [];

  const passedCount = activeChecks.filter((c) => c.passed).length;
  const totalChecks = activeChecks.length || 6;

  const activeVerdict =
    deepAudit && deepAudit.timeframe === timeframe && deepAudit.proposedDirection === computed.direction
      ? deepAudit.verdict
      : passedCount === totalChecks && computed.executionReadiness === 'READY_ENTER'
      ? computed.direction === 'BUY'
        ? 'CONFIRMED_BUY'
        : 'CONFIRMED_SELL'
      : computed.executionReadiness === 'NO_TRADE_CHOP' && bos?.bosVetoReason
      ? 'BOS_REVERSAL_FLIP'
      : computed.executionReadiness === 'WAIT_PULLBACK'
      ? 'WAIT_PULLBACK'
      : 'STAND_ASIDE_TRAP';

  const isConfirmed = activeVerdict === 'CONFIRMED_BUY' || activeVerdict === 'CONFIRMED_SELL';
  const isWait = activeVerdict === 'WAIT_PULLBACK';
  const isDanger = activeVerdict === 'BOS_REVERSAL_FLIP' || activeVerdict === 'STAND_ASIDE_TRAP';

  const containerBorder = isConfirmed
    ? 'border-[#00C261]/55 bg-emerald-950/20'
    : isWait
    ? 'border-amber-500/55 bg-amber-950/20'
    : 'border-red-500/60 bg-red-950/25';

  const badgeClass = isConfirmed
    ? 'bg-[#00C261] text-black'
    : isWait
    ? 'bg-amber-400 text-black'
    : 'bg-red-500 text-white';

  const headline =
    deepAudit && deepAudit.timeframe === timeframe && deepAudit.proposedDirection === computed.direction
      ? deepAudit.deepAuditHeadline
      : isConfirmed
      ? `ZERO-MISTAKE AUDIT PASSED (${passedCount}/${totalChecks}) · VERIFIED ${computed.direction}`
      : isWait
      ? `WAIT PULLBACK (${passedCount}/${totalChecks}) · DO NOT CHASE @ ${computed.entryPrice.toFixed(decimals)}`
      : `SAFETY SHIELD ACTIVE (${passedCount}/${totalChecks}) · ${computed.executionReadinessReason}`;

  const summaryText =
    deepAudit && deepAudit.timeframe === timeframe && deepAudit.proposedDirection === computed.direction
      ? deepAudit.deepAuditSummary
      : bos?.structureSummary || computed.executionReadinessReason;

  return (
    <div className={`rounded-2xl border p-4 space-y-3 font-mono tabular-nums ${containerBorder}`}>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black inline-flex items-center gap-1.5 ${badgeClass}`}>
            {isConfirmed ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : isWait ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5" />
            )}
            <span>
              {activeVerdict === 'CONFIRMED_BUY'
                ? `VERIFIED BUY (${passedCount}/${totalChecks})`
                : activeVerdict === 'CONFIRMED_SELL'
                ? `VERIFIED SELL (${passedCount}/${totalChecks})`
                : activeVerdict === 'WAIT_PULLBACK'
                ? `WAIT PULLBACK (${passedCount}/${totalChecks})`
                : activeVerdict === 'BOS_REVERSAL_FLIP'
                ? 'BOS REVERSAL VETO'
                : 'STAND ASIDE / CHOP'}
            </span>
          </span>

          {bos && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold inline-flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              <span>
                {bos.bosDirection.replace(/_/g, ' ')} @ {bos.bosTriggerLevel.toFixed(decimals)}
              </span>
            </span>
          )}

          {deepAudit && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold">
              {deepAudit.source === 'gemini-4-hydrogen' ? 'Gemini Deep Audit' : 'Quant Deep Guard'} · {deepAudit.syncedAt}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onRunDeepVerify}
          disabled={isVerifying}
          className="px-3.5 py-2 rounded-xl btn-gold text-black font-black text-[11px] uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow transition active:scale-95 whitespace-nowrap shrink-0 disabled:opacity-70"
        >
          {isVerifying ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isVerifying ? 'Auditing Candles...' : 'Deep AI Verify (No Mistakes)'}</span>
        </button>
      </div>

      {/* Audit Headline & Summary */}
      <div className="space-y-1 text-xs">
        <div className="font-black text-white">{headline}</div>
        <p className="text-[11px] text-slate-200 leading-relaxed">{summaryText}</p>
        {deepAudit?.trajectoryVerdict && (
          <p className="text-[11px] text-cyan-300 font-bold">
            Trajectory Verdict: {deepAudit.trajectoryVerdict}
          </p>
        )}
      </div>

      {/* 6-Point Zero-Mistake Pre-Flight Checklist */}
      {activeChecks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-0.5">
          {activeChecks.map((chk) => (
            <div
              key={chk.id}
              className={`p-2.5 rounded-xl border text-[11px] space-y-1 ${
                chk.passed
                  ? 'bg-slate-950/80 border-emerald-500/35 text-emerald-100'
                  : 'bg-red-950/45 border-red-500/50 text-red-100'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-bold truncate">{chk.label}</span>
                {chk.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00C261] shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-slate-300 leading-snug">{chk.detail}</p>
            </div>
          ))}
        </div>
      )}

      {isDanger && bos && (
        <div className="p-2.5 rounded-xl bg-black/50 border border-red-500/40 text-[11px] text-red-200 flex flex-wrap items-center justify-between gap-2">
          <span>
            Protected Swing High: <strong>{bos.protectedSwingHigh.toFixed(decimals)}</strong> · Protected Swing Low:{' '}
            <strong>{bos.protectedSwingLow.toFixed(decimals)}</strong>
          </span>
          <span className="text-[#D4AF37] font-bold">H1 BOS: {bos.h1BosDirection.replace(/_/g, ' ')}</span>
        </div>
      )}
    </div>
  );
};
