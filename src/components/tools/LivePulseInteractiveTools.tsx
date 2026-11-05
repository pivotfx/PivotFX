import React, { useState, useEffect } from 'react';
import { CurrencyPair } from '../../types';
import {
  MarketScanData,
  globalLiveStream,
  evaluatePairKenyaTiming,
  getCurrentMacroContext
} from '../../utils/liveMarketEngine';
import {
  Clock,
  Sparkles,
  Copy,
  Activity,
  Bell,
  Timer,
  Zap,
  Check
} from 'lucide-react';

export const LivePulseInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bias' | 'sessions' | 'weekly'>('sessions');
  const [liveMarkets, setLiveMarkets] = useState<MarketScanData[]>(
    () => globalLiveStream.getState().markets
  );
  const [superAiNotes, setSuperAiNotes] = useState(
    () => globalLiveStream.getState().superAiNotes
  );
  const [eatTime, setEatTime] = useState<string>('');
  const [countdownStr, setCountdownStr] = useState<string>('');
  const [nextEventName, setNextEventName] = useState<string>('London Open (10:00 EAT)');
  const [activeSession, setActiveSession] = useState<{ name: string; status: 'OPEN' | 'PREP' | 'CLOSED'; desc: string }>({
    name: 'Syncing Nairobi Desk...',
    status: 'OPEN',
    desc: 'Connecting to real-time liquidity schedule.'
  });

  // Live synced Daily Bias Generator inputs
  const [biasPair, setBiasPair] = useState<CurrencyPair>('EUR/USD');
  const [htfTrend, setHtfTrend] = useState<'bullish' | 'bearish' | 'range'>('bullish');
  const [dxyState, setDxyState] = useState<'bearish_rejection' | 'bullish_breakout' | 'neutral_chop'>('bearish_rejection');
  const [newsToday, setNewsToday] = useState<'none_minor' | 'cpi_nfp' | 'central_bank'>('none_minor');
  const [drawOnLiquidity, setDrawOnLiquidity] = useState<string>('1.12920 (Liquidity Target)');
  const [invalidationFloor, setInvalidationFloor] = useState<string>('1.12450');
  const [generatedBriefing, setGeneratedBriefing] = useState<string | null>(null);
  const [copiedBriefing, setCopiedBriefing] = useState<boolean>(false);

  // Weekly Outlook Persistent State
  const [weeklyFocusPairs, setWeeklyFocusPairs] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_weekly_gameplan');
      if (saved) return JSON.parse(saved).weeklyFocusPairs || 'EUR/USD & GBP/USD';
    } catch {}
    return 'EUR/USD & GBP/USD';
  });
  const [weeklyKeyEvents, setWeeklyKeyEvents] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_weekly_gameplan');
      if (saved) return JSON.parse(saved).weeklyKeyEvents || 'Wednesday US CPI (15:30 EAT)';
    } catch {}
    return 'Wednesday US CPI (15:30 EAT)';
  });
  const [weeklyNotes, setWeeklyNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_weekly_gameplan');
      if (saved) return JSON.parse(saved).weeklyNotes || 'Track Asian Range boundaries (03:00–10:00 EAT) for London Open Judas Swing confirmation.';
    } catch {}
    return 'Track Asian Range boundaries (03:00–10:00 EAT) for London Open Judas Swing confirmation.';
  });
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((state) => {
      setLiveMarkets(state.markets);
      setSuperAiNotes(state.superAiNotes);
    });
    return () => unsubscribe();
  }, []);

  // Auto-sync bias fields whenever selected focus pair or live stream updates
  useEffect(() => {
    const match = liveMarkets.find((m) => m.pair === biasPair);
    if (!match) return;
    const isBull = match.h1TrendDirection === 'UPTREND';
    setHtfTrend(isBull ? 'bullish' : 'bearish');
    const dec = biasPair.includes('JPY') ? 3 : biasPair.includes('XAU') || biasPair.includes('BTC') ? 2 : 5;
    const targetDelta = biasPair.includes('JPY') ? 0.45 : biasPair.includes('XAU') ? 22 : biasPair.includes('BTC') ? 950 : 0.0042;
    const stopDelta = targetDelta * 0.4;
    setDrawOnLiquidity((isBull ? match.price + targetDelta : match.price - targetDelta).toFixed(dec));
    setInvalidationFloor((isBull ? match.price - stopDelta : match.price + stopDelta).toFixed(dec));

    const pctMap: Partial<Record<CurrencyPair, number>> = {};
    liveMarkets.forEach((m) => {
      pctMap[m.pair] = m.change24hPct;
    });
    const macro = getCurrentMacroContext(pctMap);
    if (macro.dxyPressurePct > 0.15) setDxyState('bullish_breakout');
    else if (macro.dxyPressurePct < -0.15) setDxyState('bearish_rejection');
    else setDxyState('neutral_chop');
  }, [biasPair, liveMarkets]);

  const playSessionChime = (tone: number = 659) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(tone, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {}
  };

  // Unified Nairobi EAT Clock matching global session engine
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setEatTime(timeStr);

      const eatHour = parseInt(
        now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', hour12: false }),
        10
      );
      const eatMins = parseInt(
        now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', minute: '2-digit', hour12: false }),
        10
      );
      const totalMins = eatHour * 60 + eatMins;

      if (totalMins >= 600 && totalMins < 780) {
        setActiveSession({
          name: 'London Open Session (10:00–13:00 EAT)',
          status: 'OPEN',
          desc: 'Primary institutional expansion window. High volume for EUR/USD, GBP/USD, and Gold.'
        });
      } else if (totalMins >= 930 && totalMins < 1170) {
        setActiveSession({
          name: 'London / New York Peak Overlap (15:30–19:30 EAT)',
          status: 'OPEN',
          desc: 'Highest daily institutional volume. Optimal execution window across all major pairs.'
        });
      } else if (totalMins >= 780 && totalMins < 930) {
        setActiveSession({
          name: 'London Midday Lull (13:00–15:30 EAT)',
          status: 'PREP',
          desc: 'Pre-New York consolidation. Prepare levels ahead of the 15:30 EAT overlap open.'
        });
      } else if (totalMins >= 180 && totalMins < 600) {
        setActiveSession({
          name: 'Tokyo Asian Range (03:00–10:00 EAT)',
          status: 'OPEN',
          desc: 'Structured accumulation range. Clean setups on JPY and AUD pairs.'
        });
      } else if (totalMins >= 1170 && totalMins < 1320) {
        setActiveSession({
          name: 'New York Afternoon Session (19:30–22:00 EAT)',
          status: 'PREP',
          desc: 'Selective post-overlap execution. Avoid overextending near close.'
        });
      } else {
        setActiveSession({
          name: 'Global Rollover Dead Zone (22:00–03:00 EAT)',
          status: 'CLOSED',
          desc: 'Low liquidity & elevated spreads. Stand aside until Tokyo opens at 03:00 EAT.'
        });
      }

      const targets = [
        { name: 'Tokyo Session Open (03:00 EAT)', minuteMark: 3 * 60 },
        { name: 'London Session Open (10:00 EAT)', minuteMark: 10 * 60 },
        { name: 'NY Overlap Open (15:30 EAT)', minuteMark: 15 * 60 + 30 },
        { name: 'Rollover Pause (22:00 EAT)', minuteMark: 22 * 60 }
      ];

      let nextTarget = targets.find((t) => t.minuteMark > totalMins);
      if (!nextTarget) {
        nextTarget = { name: 'Tokyo Session Open (03:00 EAT)', minuteMark: 24 * 60 + 3 * 60 };
      }

      const diffTotalSecs = (nextTarget.minuteMark - totalMins) * 60 - now.getSeconds();
      const safeSecs = Math.max(0, diffTotalSecs);
      const hours = Math.floor(safeSecs / 3600);
      const mins = Math.floor((safeSecs % 3600) / 60);
      const secs = safeSecs % 60;
      setNextEventName(nextTarget.name);
      setCountdownStr(
        `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateBias = () => {
    const match = liveMarkets.find((m) => m.pair === biasPair);
    const timing = evaluatePairKenyaTiming(biasPair);
    const liveNote = superAiNotes[biasPair]?.note || match?.projection || 'Synced with live session flow.';
    const isBull = htfTrend === 'bullish' && dxyState !== 'bullish_breakout';
    const verdict = isBull ? 'BULLISH EXPANSION (BUY PLAN)' : 'BEARISH DISTRIBUTION (SELL PLAN)';

    const card = `PIVOTFX LIVE BRIEFING · ${biasPair} (${eatTime} EAT)
-----------------------------------------------------
Operational Bias: ${verdict}
Live Spot Quote:  ${match ? match.price : 'Live'} (${timing.windowBadgeShort})
H1/H4 Structure:  ${htfTrend.toUpperCase()} · DXY: ${dxyState.replace(/_/g, ' ').toUpperCase()}
News Filter:      ${newsToday.replace(/_/g, ' ').toUpperCase()}

Tactical Target:  ${drawOnLiquidity}
Invalidation SL:  ${invalidationFloor}
Risk Rule:        0.01 Micro Lot ($2.00 / 260 KES Hard Cap)

Real-Time AI Note:
${liveNote}
-----------------------------------------------------`;
    setGeneratedBriefing(card);
    void globalLiveStream.fetchSuperAiNoteForPair(biasPair, undefined, true);
  };

  const sessionPairs = liveMarkets.slice(0, 4);

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-slate-800 my-6 tabular-nums">
      {/* Header & Single-Line Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>Nairobi EAT Session Clock · Live Intermarket Planning</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Session Timing &amp; Daily Trade Plan Studio
          </h3>
          <p className="text-xs text-slate-400">
            Track exact Nairobi (UTC+3) market open/close countdowns, live pair liquidity levels, and real-time trade plans.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold font-mono shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sessions' ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Session Clock</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bias')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bias' ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Daily Bias Plan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'weekly' ? 'bg-[#D4AF37] text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Weekly Notebook</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE NAIROBI SESSION CLOCK & COUNTDOWNS */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 text-center">
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Nairobi Local Time (EAT · UTC+3)
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-wider">
                  {eatTime} EAT
                </div>
                <div
                  className={`text-xs font-mono font-bold ${
                    activeSession.status === 'OPEN'
                      ? 'text-[#00C261]'
                      : activeSession.status === 'PREP'
                      ? 'text-amber-300'
                      : 'text-red-400'
                  }`}
                >
                  {activeSession.status === 'OPEN'
                    ? 'MARKET OPEN'
                    : activeSession.status === 'PREP'
                    ? 'SESSION PREP'
                    : 'ROLLOVER PAUSE'}{' '}
                  · {activeSession.name}
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {activeSession.desc}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-slate-400">{nextEventName}:</span>
                  <strong className="text-white">{countdownStr}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => playSessionChime(880)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[#D4AF37] font-mono text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Test Alert Chime</span>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                <span className="text-[#D4AF37] font-bold">Unified Nairobi Session Schedule</span>
                <span className="text-slate-400">UTC+3 East Africa Time</span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-200 font-semibold">Tokyo Asian Range</span>
                  <span className="text-cyan-300 font-bold">03:00 – 10:00 EAT</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-emerald-500/35">
                  <span className="text-white font-bold">London Open Killzone</span>
                  <span className="text-[#00C261] font-bold">10:00 – 13:00 EAT</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <span className="text-slate-200 font-semibold">London Midday Consolidation</span>
                  <span className="text-amber-300 font-bold">13:00 – 15:30 EAT</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-emerald-500/45">
                  <span className="text-white font-bold">London / NY Peak Overlap</span>
                  <span className="text-[#00C261] font-bold">15:30 – 19:30 EAT (Peak)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-red-500/35">
                  <span className="text-slate-300">Daily Rollover Dead Zone</span>
                  <span className="text-red-400 font-bold">22:00 – 03:00 EAT (Closed)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Synced Session Liquidity Levels */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Session Reference Levels (Auto-Synced)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Updates live every 0.5s with open/close status per market
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sessionPairs.map((m) => {
                const timing = evaluatePairKenyaTiming(m.pair);
                const dec = m.pair.includes('JPY') ? 3 : m.pair.includes('XAU') || m.pair.includes('BTC') ? 2 : 5;
                return (
                  <div key={m.pair} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{m.pair}</strong>
                      <span className="text-[11px] text-[#D4AF37] font-bold">@ {m.price.toFixed(dec)}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Key Reference: <span className="text-white font-bold">{m.keyLevel.toFixed(dec)}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      20 EMA / RSI:{' '}
                      <span className="text-cyan-300 font-bold">
                        {m.ema20.toFixed(dec)} · {m.rsi}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] block font-bold pt-1 ${
                        timing.windowStatusCode === 'OPEN'
                          ? 'text-[#00C261]'
                          : timing.windowStatusCode === 'OPENING_SOON'
                          ? 'text-amber-300'
                          : 'text-red-400'
                      }`}
                    >
                      {timing.windowBadgeShort}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTO-SYNCED DAILY BIAS & PLAN BUILDER */}
      {activeTab === 'bias' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Focus Pair (Live Sync)</label>
                <select
                  value={biasPair}
                  onChange={(e) => setBiasPair(e.target.value as CurrencyPair)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  {liveMarkets.map((m) => (
                    <option key={m.pair} value={m.pair}>
                      {m.pair} (@ {m.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">H1 / H4 Structure</label>
                <select
                  value={htfTrend}
                  onChange={(e) => setHtfTrend(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="bullish">Confirmed Bullish (HH / HL)</option>
                  <option value="bearish">Confirmed Bearish (LH / LL)</option>
                  <option value="range">Range / Consolidation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">USD Basket (DXY) Pressure</label>
                <select
                  value={dxyState}
                  onChange={(e) => setDxyState(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="bearish_rejection">DXY Soft / Resistance Rejection</option>
                  <option value="bullish_breakout">DXY Firm / Breaking Resistance</option>
                  <option value="neutral_chop">DXY Neutral / Range Bound</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">High-Impact Catalyst Filter</label>
                <select
                  value={newsToday}
                  onChange={(e) => setNewsToday(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="none_minor">Normal Technical Session</option>
                  <option value="cpi_nfp">US CPI / NFP Release (15:30 EAT)</option>
                  <option value="central_bank">Central Bank Rate Decision</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Draw on Liquidity Target</label>
                <input
                  type="text"
                  value={drawOnLiquidity}
                  onChange={(e) => setDrawOnLiquidity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Invalidation Level</label>
                <input
                  type="text"
                  value={invalidationFloor}
                  onChange={(e) => setInvalidationFloor(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateBias}
              className="w-full py-3 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Live Trade Plan &amp; AI Note</span>
            </button>
          </div>

          <div className="lg:col-span-6 rounded-2xl bg-slate-950 p-5 border border-slate-800 flex flex-col justify-between space-y-3">
            {generatedBriefing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                  <span className="text-[#D4AF37] font-bold">Live Briefing Card · {biasPair}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedBriefing);
                      setCopiedBriefing(true);
                      setTimeout(() => setCopiedBriefing(false), 1800);
                    }}
                    className="flex items-center gap-1 text-slate-300 hover:text-white font-bold"
                  >
                    {copiedBriefing ? <Check className="w-3.5 h-3.5 text-[#00C261]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBriefing ? 'Copied' : 'Copy Plan'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[290px]">
                  {generatedBriefing}
                </pre>
              </div>
            ) : (
              <div className="h-full min-h-[220px] flex flex-col justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs font-mono">
                <div className="text-[#D4AF37] font-bold">
                  Auto-Synced Live Projection · {biasPair}
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {superAiNotes[biasPair]?.note ||
                    liveMarkets.find((m) => m.pair === biasPair)?.projection ||
                    'Select a focus pair to inspect live targets and generate a full execution briefing.'}
                </p>
                <div className="text-[11px] text-slate-400">
                  Target: <strong className="text-white">{drawOnLiquidity}</strong> · Invalidation:{' '}
                  <strong className="text-red-300">{invalidationFloor}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PERSISTENT WEEKLY NOTEBOOK */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Weekly Primary Pairs</label>
              <input
                type="text"
                value={weeklyFocusPairs}
                onChange={(e) => setWeeklyFocusPairs(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Key Red-Folder Catalysts</label>
              <input
                type="text"
                value={weeklyKeyEvents}
                onChange={(e) => setWeeklyKeyEvents(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Persistent Trading Plan &amp; Notes</label>
            <textarea
              rows={4}
              value={weeklyNotes}
              onChange={(e) => setWeeklyNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem(
                    'pivotfx_weekly_gameplan',
                    JSON.stringify({ weeklyFocusPairs, weeklyKeyEvents, weeklyNotes, savedAt: new Date().toISOString() })
                  );
                } catch {}
                setSavedNotice(true);
                setTimeout(() => setSavedNotice(false), 1800);
              }}
              className="px-5 py-2.5 rounded-xl btn-gold text-black font-black text-xs uppercase tracking-wider whitespace-nowrap"
            >
              Save Weekly Plan
            </button>
            {savedNotice && (
              <span className="text-xs font-mono text-[#00C261] font-bold">Saved locally</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
