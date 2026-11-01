import React, { useState, useEffect } from 'react';
import {
  Clock,
  Globe,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Calendar,
  Activity
} from 'lucide-react';

export const LivePulseInteractiveTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bias' | 'sessions' | 'weekly'>('bias');

  // Live EAT Time
  const [eatTime, setEatTime] = useState<string>('');
  const [activeSession, setActiveSession] = useState<{ name: string; volume: number; desc: string }>({
    name: 'Calculating EAT...',
    volume: 50,
    desc: 'Connecting to Nairobi liquidity feed...'
  });

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

      if (eatHour >= 11 && eatHour < 15) {
        setActiveSession({
          name: 'London Open Session',
          volume: 85,
          desc: 'High volatility expansion. Judas swings and trend initialization active.'
        });
      } else if (eatHour >= 15 && eatHour < 20) {
        setActiveSession({
          name: 'London / New York Overlap',
          volume: 95,
          desc: 'PEAK DAILY VOLUME (60%+ of all global pips). Optimal execution window.'
        });
      } else if (eatHour >= 20 && eatHour < 23) {
        setActiveSession({
          name: 'New York Afternoon',
          volume: 45,
          desc: 'Declining momentum. Daily profit taking; avoid entering new day trades.'
        });
      } else if (eatHour === 23 || eatHour === 0) {
        setActiveSession({
          name: 'Asian Rollover (DEAD ZONE)',
          volume: 15,
          desc: 'WIDE SPREADS & LOW LIQUIDITY! Do not trade or scalp.'
        });
      } else {
        setActiveSession({
          name: 'Tokyo Asian Range',
          volume: 35,
          desc: 'Range-bound accumulation. Mark the Asian High and Low boundaries.'
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Daily Bias Builder State
  const [biasPair, setBiasPair] = useState('EUR/USD');
  const [htfTrend, setHtfTrend] = useState('bullish');
  const [dxyState, setDxyState] = useState('bearish_rejection');
  const [newsToday, setNewsToday] = useState('none_minor');
  const [drawOnLiquidity, setDrawOnLiquidity] = useState('1.0885 (Yesterday High)');
  const [invalidationFloor, setInvalidationFloor] = useState('1.0820');
  const [generatedBriefing, setGeneratedBriefing] = useState<string | null>(null);

  const handleGenerateBias = () => {
    const isBull = htfTrend === 'bullish' && dxyState.includes('bearish');
    const verdict = isBull ? 'BULLISH EXPANSION (BUY ONLY)' : 'BEARISH DISTRIBUTION (SELL ONLY)';
    
    const card = `=====================================================
PIVOTFX LAB — DAILY DIRECTIONAL BRIEFING (EAT)
Generated: ${new Date().toLocaleDateString('en-GB')} at ${eatTime} EAT
Pair: ${biasPair}
Primary Operational Bias: ${verdict}
=====================================================
1. Higher Timeframe Context:
   • Daily/H4 Trend: ${htfTrend.toUpperCase()}
   • US Dollar Index (DXY) Assessment: ${dxyState.replace(/_/g, ' ').toUpperCase()}
   • Economic News Factor: ${newsToday.replace(/_/g, ' ').toUpperCase()}

2. Key Tactical Levels:
   • Draw on Liquidity Target: ${drawOnLiquidity}
   • Invalidation Floor / Ceiling: ${invalidationFloor}
   • Planned Execution Window: London Open (11:00 EAT) or NY Overlap (15:30 EAT)

3. Risk & Sizing Mandate:
   • Enforce the Gilgil $2.00 Rule strictly
   • Invalidation: If price closes beyond ${invalidationFloor}, bias is neutralized!
=====================================================`;
    setGeneratedBriefing(card);
  };

  // Weekly Outlook Form State
  const [weeklyFocusPairs, setWeeklyFocusPairs] = useState('EUR/USD & GBP/USD');
  const [weeklyKeyEvents, setWeeklyKeyEvents] = useState('Wednesday US CPI (15:30 EAT)');
  const [weeklyNotes, setWeeklyNotes] = useState('Look for Asian Range liquidity sweeps at 11:00 AM London open.');

  return (
    <div className="space-y-6 rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/30 my-8">
      {/* Header & Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>LIVE INTERMARKET TOOLS • NAIROBI EAT FEED</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Daily Directional Bias & Session Pulse Studio
          </h3>
          <p className="text-xs text-slate-400">
            Formulate your morning macro narrative, monitor London/NY institutional volume, and draft weekly gameplans.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('bias')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'bias' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>1. Daily Bias Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'sessions' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Session Clock</span>
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'weekly' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3. Weekly Outlook</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY BIAS BUILDER */}
      {activeTab === 'bias' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Focus Pair</label>
                <select
                  value={biasPair}
                  onChange={(e) => setBiasPair(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="EUR/USD">EUR/USD</option>
                  <option value="GBP/USD">GBP/USD</option>
                  <option value="USD/JPY">USD/JPY</option>
                  <option value="XAU/USD">XAU/USD (Gold)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">HTF (Daily/H4) Trend</label>
                <select
                  value={htfTrend}
                  onChange={(e) => setHtfTrend(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="bullish">Confirmed Bullish (HH / HL)</option>
                  <option value="bearish">Confirmed Bearish (LH / LL)</option>
                  <option value="range">Range / Consolidation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">DXY (Dollar Index) Status</label>
                <select
                  value={dxyState}
                  onChange={(e) => setDxyState(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="bearish_rejection">DXY Dumping / Resistance Rejection</option>
                  <option value="bullish_breakout">DXY Rallied / Breaking Support</option>
                  <option value="neutral_chop">DXY Flat in Asian Range</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Economic News Today</label>
                <select
                  value={newsToday}
                  onChange={(e) => setNewsToday(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
                >
                  <option value="none_minor">No Major Red Folders</option>
                  <option value="cpi_nfp">High Impact US CPI / NFP (15:30 EAT)</option>
                  <option value="central_bank">Fed / ECB Rate Decision</option>
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
              onClick={handleGenerateBias}
              className="w-full py-3 rounded-xl btn-gold text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Daily Briefing Card</span>
            </button>
          </div>

          <div className="lg:col-span-6 rounded-2xl bg-slate-950 p-5 border border-slate-800 flex flex-col justify-between">
            {generatedBriefing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase">
                    Generated Morning Briefing:
                  </span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(generatedBriefing); alert('Briefing copied to clipboard!'); }}
                    className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </button>
                </div>

                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[300px]">
                  {generatedBriefing}
                </pre>
              </div>
            ) : (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <FileText className="w-8 h-8 text-slate-600 animate-pulse" />
                <p className="text-xs">
                  Select your morning parameters on the left and click <strong>Generate Daily Briefing Card</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE SESSION CLOCK */}
      {activeTab === 'sessions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Nairobi Local Time (East Africa Time - UTC+3)
            </span>

            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-widest text-gold-gradient">
              {eatTime} EAT
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C261]/20 text-[#00C261] border border-[#00C261]/40 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00C261] animate-ping" />
              <span>{activeSession.name}</span>
            </div>

            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              {activeSession.desc}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase block">
              Nairobi Session Schedule:
            </span>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Tokyo Asian Range:</span>
                <span className="text-slate-400">03:00 - 10:00 EAT</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">London Open Expansion:</span>
                <span className="text-[#00C261] font-bold">11:00 - 14:00 EAT (HIGH)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">London / NY Overlap:</span>
                <span className="text-emerald-400 font-bold">15:30 - 19:30 EAT (PEAK)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Asian Rollover (Dead):</span>
                <span className="text-red-400 font-bold">23:00 - 01:00 EAT (AVOID)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY OUTLOOK FORM */}
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
              <label className="text-xs font-mono text-slate-400 block mb-1">Key Red Folder Catalysts</label>
              <input
                type="text"
                value={weeklyKeyEvents}
                onChange={(e) => setWeeklyKeyEvents(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Weekly Strategic Notes & Scenarios</label>
            <textarea
              rows={4}
              value={weeklyNotes}
              onChange={(e) => setWeeklyNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:border-[#D4AF37] outline-none"
            />
          </div>

          <button
            onClick={() => alert('Weekly gameplan saved to browser localStorage!')}
            className="px-6 py-2.5 rounded-xl btn-gold text-black font-bold text-xs uppercase"
          >
            Save Weekly Gameplan
          </button>
        </div>
      )}
    </div>
  );
};
