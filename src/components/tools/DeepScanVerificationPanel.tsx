import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  GitBranch,
  Cpu,
  Globe,
  ExternalLink,
  Target
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
  const tel = computed.institutionalTelemetry;
  const liveBlocked =
    computed.executionReadiness === 'NO_TRADE_CHOP' ||
    computed.executionReadiness === 'NO_TRADE_CLOSED';
  const staleConfirmedOverride =
    liveBlocked &&
    deepAudit &&
    (deepAudit.verdict === 'CONFIRMED_BUY' ||
      deepAudit.verdict === 'CONFIRMED_SELL' ||
      deepAudit.verdict === 'WAIT_PULLBACK');
  const matchedAudit =
    deepAudit &&
    deepAudit.timeframe === timeframe &&
    deepAudit.proposedDirection === computed.direction &&
    !staleConfirmedOverride
      ? deepAudit
      : null;

  const activeChecks = matchedAudit ? matchedAudit.checks : computed.preflightChecks || [];
  const passedCount = activeChecks.filter((c) => c.passed).length;
  const totalChecks = activeChecks.length || 10;

  const activeVerdict = matchedAudit
    ? matchedAudit.verdict
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

  const roboticVerdictLabel = tel
    ? tel.roboticVerdict === 'PRIME_BUY'
      ? 'PRIME BUY'
      : tel.roboticVerdict === 'PRIME_SELL'
      ? 'PRIME SELL'
      : tel.roboticVerdict === 'SNIPER_LIMIT_BUY'
      ? 'SNIPER LIMIT BUY'
      : tel.roboticVerdict === 'SNIPER_LIMIT_SELL'
      ? 'SNIPER LIMIT SELL'
      : 'STAND ASIDE'
    : null;

  const headline = matchedAudit
    ? matchedAudit.deepAuditHeadline
    : isConfirmed
    ? `ZERO-DOUBT AUDIT PASSED (${passedCount}/${totalChecks}) · VERIFIED ${computed.direction}`
    : isWait
    ? `SNIPER LIMIT MODE (${passedCount}/${totalChecks}) · STAGE @ ${(computed.advisoryEntryPrice ?? computed.entryPrice).toFixed(decimals)}`
    : `SAFETY SHIELD ACTIVE (${passedCount}/${totalChecks}) · ${computed.executionReadinessReason}`;

  const summaryText = matchedAudit
    ? matchedAudit.deepAuditSummary
    : tel?.roboticSummary || bos?.structureSummary || computed.executionReadinessReason;

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
                ? `PRIME BUY (${passedCount}/${totalChecks})`
                : activeVerdict === 'CONFIRMED_SELL'
                ? `PRIME SELL (${passedCount}/${totalChecks})`
                : activeVerdict === 'WAIT_PULLBACK'
                ? `SNIPER LIMIT (${passedCount}/${totalChecks})`
                : activeVerdict === 'BOS_REVERSAL_FLIP'
                ? 'BOS REVERSAL VETO'
                : 'STAND ASIDE / CHOP'}
            </span>
          </span>

          {tel && roboticVerdictLabel && (
            <span
              className={`px-2 py-0.5 rounded-lg border text-[10px] font-black inline-flex items-center gap-1 ${
                tel.roboticVerdict.startsWith('PRIME')
                  ? 'bg-emerald-950/80 border-[#00C261]/50 text-[#00C261]'
                  : tel.roboticVerdict.startsWith('SNIPER')
                  ? 'bg-amber-950/80 border-amber-400/50 text-amber-300'
                  : 'bg-red-950/70 border-red-500/40 text-red-300'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>
                {roboticVerdictLabel} · {tel.roboticScore}/100 ({tel.estimatedWinProbPct}% Prob · +{tel.expectedRMultiple}R)
              </span>
            </span>
          )}

          {bos && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold inline-flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              <span>
                {bos.bosDirection.replace(/_/g, ' ')} @ {bos.bosTriggerLevel.toFixed(decimals)}
              </span>
            </span>
          )}

          {matchedAudit && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold">
              {matchedAudit.source === 'gemini-4-hydrogen' ? 'Gemini Deep Audit' : 'Quant Deep Guard'} ·{' '}
              {matchedAudit.roboticGrade || matchedAudit.syncedAt}
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
          <span>{isVerifying ? 'Auditing Candles & News...' : 'Deep AI + Macro Audit'}</span>
        </button>
      </div>

      {/* Audit Headline & Summary */}
      <div className="space-y-1 text-xs">
        <div className="font-black text-white">{headline}</div>
        <p className="text-[11px] text-slate-200 leading-relaxed font-sans">{summaryText}</p>
        {matchedAudit?.trajectoryVerdict && (
          <p className="text-[11px] text-cyan-300 font-bold">
            Trajectory Verdict: {matchedAudit.trajectoryVerdict}
          </p>
        )}
      </div>

      {/* Institutional Quant Telemetry Strip (Pivots, Z-Score, Stoch/CCI, Squeeze, OTE/FVG) */}
      {tel && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-slate-400 block">Floor Pivots (S1 · P · R1)</span>
            <strong className="text-cyan-300">
              {tel.pivotLevels.s1.toFixed(decimals)} · {tel.pivotLevels.pivot.toFixed(decimals)} · {tel.pivotLevels.r1.toFixed(decimals)}
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-slate-400 block">Z-Score &amp; Volatility</span>
            <strong className={Math.abs(tel.zScore) > 1.85 ? 'text-amber-300' : 'text-[#00C261]'}>
              Z={tel.zScore}σ · BB {tel.bbWidthPct}%{tel.squeezeActive ? ' · SQUEEZE' : ''}
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-slate-400 block">Stoch(14,3,3) · CCI(20)</span>
            <strong className="text-white">
              {tel.stochK}/{tel.stochD} · CCI {tel.cci20}
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-slate-400 block">
              {tel.fvgZone ? `FVG (${tel.fvgZone.bias}) & 0.65 OTE` : '0.65 OTE Liquidity'}
            </span>
            <strong className="text-[#D4AF37]">
              {tel.fvgZone ? `${tel.fvgZone.mid.toFixed(decimals)} · ` : ''}OTE {tel.oteZoneMid.toFixed(decimals)}
            </strong>
          </div>
        </div>
      )}

      {/* Conditional Projected CHoCH Reversal Scenario (If/Then Structural Flip E.P./SL/TP) */}
      {tel?.projectedChochReversal && (
        <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/35 space-y-1.5 text-[11px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-cyan-300 font-black inline-flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              <span>
                Projected Structural CHoCH Flip (If Close{' '}
                {tel.projectedChochReversal.conditionalDirection === 'BUY' ? '>' : '<'}{' '}
                {tel.projectedChochReversal.triggerLevel.toFixed(decimals)} →{' '}
                {tel.projectedChochReversal.conditionalDirection})
              </span>
            </span>
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-black">
              <span className="text-white">
                Retest EP {tel.projectedChochReversal.retestEntryPrice.toFixed(decimals)}
              </span>
              <span className="text-red-400">
                SL {tel.projectedChochReversal.stopLoss.toFixed(decimals)}
              </span>
              <span className="text-cyan-300">
                TP1 {tel.projectedChochReversal.tp1.toFixed(decimals)}
              </span>
              <span className="text-[#00C261]">
                TP2 {tel.projectedChochReversal.tp2.toFixed(decimals)}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-300 font-sans leading-snug">
            {tel.projectedChochReversal.ruleSummary}
          </p>
        </div>
      )}

      {/* AI-Calibrated Sniper EP / SL / TP Levels (When Issued & Geometry-Validated) */}
      {matchedAudit?.refinedLevels && !isDanger && (
        <div className="p-3 rounded-xl bg-slate-950/90 border border-[#D4AF37]/45 space-y-1.5 text-[11px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[#D4AF37] font-black inline-flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>
                {isWait
                  ? `AI-Calibrated Sniper Limit Levels (STAGE LIMIT ${matchedAudit.verifiedDirection})`
                  : `AI-Calibrated Precision Order Levels (${matchedAudit.verifiedDirection})`}
              </span>
            </span>
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-black">
              <span className="text-white">EP {matchedAudit.refinedLevels.entryPrice.toFixed(decimals)}</span>
              <span className="text-red-400">SL {matchedAudit.refinedLevels.stopLoss.toFixed(decimals)}</span>
              <span className="text-cyan-300">TP1 {matchedAudit.refinedLevels.tp1.toFixed(decimals)}</span>
              <span className="text-[#00C261]">TP2 {matchedAudit.refinedLevels.tp2.toFixed(decimals)}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-300 font-sans leading-snug">{matchedAudit.refinedLevels.rationale}</p>
        </div>
      )}

      {/* Live Macro News Grounding Summary + Source Links */}
      {matchedAudit?.macroNewsSummary && (
        <div className="p-3 rounded-xl bg-slate-950/85 border border-cyan-500/35 space-y-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-300 font-black">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>Live Grounded Macro &amp; News Catalyst</span>
          </div>
          <p className="text-[11px] text-slate-200 font-sans leading-relaxed">{matchedAudit.macroNewsSummary}</p>
          {matchedAudit.groundingSources && matchedAudit.groundingSources.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {matchedAudit.groundingSources.map((src) => (
                <a
                  key={src.uri}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-cyan-300 hover:text-white transition"
                >
                  <span className="truncate max-w-[180px]">{src.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 10-Point Zero-Mistake Pre-Flight Checklist */}
      {activeChecks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-0.5">
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

