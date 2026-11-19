import React, { useEffect, useState } from 'react';
import { CurrencyPair } from '../../types';
import {
  MarketScanData,
  globalLiveStream,
  evaluatePairKenyaTiming,
  getUpcomingEconomicEvents,
  getCurrentMacroContext,
} from '../../utils/liveMarketEngine';
import { Clock, CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

interface SessionCardMeta {
  id: 'asian' | 'london' | 'lull' | 'ny_overlap' | 'rollover' | 'crypto_247';
  title: string;
  eatSpanLabel: string;
  exchangeSchedule: string;
  accentHex: string;
  openSurfaceClass: string;
  openTitleClass: string;
  closedTitleClass: string;
  openBadgeClass: string;
  closedAccentBarClass: string;
  startSec: number;
  endSec: number;
  pairKeys: CurrencyPair[];
  bestCombos: string;
  bestEntryWindow: string;
  earlyWaitRule: string;
  doNotTradeRule: string;
}

const SESSION_CARDS: SessionCardMeta[] = [
  {
    id: 'asian',
    title: 'Asian · Sydney & Tokyo',
    eatSpanLabel: '02:30 – 09:00 EAT',
    exchangeSchedule: 'Sydney Open 00:00 EAT · Tokyo TSE Opens 03:00 EAT',
    accentHex: '#38BDF8',
    openSurfaceClass: 'bg-gradient-to-br from-sky-950/55 via-[#091526] to-[#08101C] border-sky-400/75',
    openTitleClass: 'text-sky-300',
    closedTitleClass: 'text-sky-300/70',
    openBadgeClass: 'text-sky-300',
    closedAccentBarClass: 'bg-sky-500/45',
    startSec: 2.5 * 3600,
    endSec: 9 * 3600,
    pairKeys: ['USD/JPY', 'GBP/JPY', 'EUR/JPY', 'AUD/USD'],
    bestCombos: 'USD/JPY · GBP/JPY · EUR/JPY · AUD/USD',
    bestEntryWindow: '03:15 – 08:30 EAT (Tokyo liquidity active)',
    earlyWaitRule: '02:30 – 03:15 EAT: Too early — study Asian High/Low & wait for 03:00 TSE open to settle.',
    doNotTradeRule: 'Not for GBP/USD, EUR/USD, US30, NAS100, GER40 or USOIL — wait for 10:00 EAT London Open.',
  },
  {
    id: 'london',
    title: 'London & Frankfurt Open',
    eatSpanLabel: '10:00 – 13:00 EAT',
    exchangeSchedule: 'Frankfurt & London LSE Open 10:00 EAT · Bullion Fix 10:30 EAT',
    accentHex: '#00C261',
    openSurfaceClass: 'bg-gradient-to-br from-emerald-950/55 via-[#071A15] to-[#071015] border-[#00C261]/75',
    openTitleClass: 'text-[#00C261]',
    closedTitleClass: 'text-emerald-400/65',
    openBadgeClass: 'text-[#00C261]',
    closedAccentBarClass: 'bg-[#00C261]/45',
    startSec: 10 * 3600,
    endSec: 13 * 3600,
    pairKeys: ['GBP/USD', 'EUR/USD', 'XAU/USD', 'GER40'],
    bestCombos: 'GBP/USD · EUR/USD · XAU/USD (Gold) · GBP/JPY · EUR/JPY · USD/CHF · GER40',
    bestEntryWindow: '10:15 – 12:45 EAT (Asian sweep + 20 EMA retest)',
    earlyWaitRule: '10:00 – 10:15 EAT: Too early — let opening bell liquidity spike settle first.',
    doNotTradeRule: 'Please avoid USD/CAD, US30, NAS100 & USOIL until afternoon New York open.',
  },
  {
    id: 'lull',
    title: 'Mid-Day Consolidation Lull',
    eatSpanLabel: '13:00 – 15:30 EAT',
    exchangeSchedule: 'London Lunch Drift · Pre-US Macro Prep',
    accentHex: '#F59E0B',
    openSurfaceClass: 'bg-gradient-to-br from-amber-950/45 via-[#171207] to-[#0B101E] border-amber-400/75',
    openTitleClass: 'text-amber-300',
    closedTitleClass: 'text-amber-300/65',
    openBadgeClass: 'text-amber-300',
    closedAccentBarClass: 'bg-amber-400/45',
    startSec: 13 * 3600,
    endSec: 15.5 * 3600,
    pairKeys: ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/CHF'],
    bestCombos: 'Study Mode: Mark Key S/R & 20/50 EMA on XAU/USD, EUR/USD & GBP/USD',
    bestEntryWindow: 'Please wait — prepare 20 EMA limit orders for 15:30 EAT New York Open',
    earlyWaitRule: '13:00 – 15:30 EAT: Institutional volume pauses; tighten trailing stops on morning wins.',
    doNotTradeRule: 'Do NOT chase breakouts on GBP/USD, EUR/USD or Gold between 13:15 – 15:25 EAT.',
  },
  {
    id: 'ny_overlap',
    title: 'New York, COMEX Gold & Wall St',
    eatSpanLabel: '15:30 – 20:30 EAT',
    exchangeSchedule: 'US Data 15:30 · WTI Oil 16:00 · NYSE/COMEX/Nasdaq Open 16:30 EAT',
    accentHex: '#D4AF37',
    openSurfaceClass: 'bg-gradient-to-br from-yellow-950/50 via-[#191407] to-[#0B101E] border-[#D4AF37]/85',
    openTitleClass: 'text-[#F3D36B]',
    closedTitleClass: 'text-[#D4AF37]/65',
    openBadgeClass: 'text-[#F3D36B]',
    closedAccentBarClass: 'bg-[#D4AF37]/45',
    startSec: 15.5 * 3600,
    endSec: 20.5 * 3600,
    pairKeys: ['XAU/USD', 'US30', 'NAS100', 'USOIL'],
    bestCombos: 'XAU/USD (Gold) · EUR/USD · GBP/USD · USD/JPY · USD/CAD · US30 · NAS100 · USOIL',
    bestEntryWindow: '15:45 – 19:30 EAT (Indices & Oil peak 16:30 – 20:00 EAT)',
    earlyWaitRule: '15:30 – 15:45 EAT: Too early — let Tier-1 US CPI/NFP/open spread volatility settle.',
    doNotTradeRule: 'Please pause market orders 15:20 – 15:40 EAT during Red-Folder US news spikes.',
  },
  {
    id: 'rollover',
    title: 'NY Late & Bank Rollover Zone',
    eatSpanLabel: '20:30 – 02:30 EAT',
    exchangeSchedule: 'NYSE Close 23:00 EAT · Broker Midnight Spread Spike 23:55 – 01:15 EAT',
    accentHex: '#EF4444',
    openSurfaceClass: 'bg-gradient-to-br from-rose-950/50 via-[#1A090E] to-[#0B101E] border-rose-500/75',
    openTitleClass: 'text-rose-300',
    closedTitleClass: 'text-rose-400/65',
    openBadgeClass: 'text-rose-300',
    closedAccentBarClass: 'bg-rose-500/45',
    startSec: 20.5 * 3600,
    endSec: 2.5 * 3600,
    pairKeys: ['EUR/USD', 'GBP/USD', 'XAU/USD', 'USD/JPY'],
    bestCombos: 'FX, Metals, Oil & Indices Paused — Only 24/7 Crypto keeps normal spreads',
    bestEntryWindow: 'Please stand aside on FX/Gold — wait for 02:30 / 03:00 EAT Tokyo Open',
    earlyWaitRule: '20:30 – 22:00 EAT: Close intraday partials; momentum fades into settlement.',
    doNotTradeRule: 'Please do NOT trade FX, Gold, Indices or Oil 22:00 – 02:30 EAT (rollover spread trap).',
  },
  {
    id: 'crypto_247',
    title: '24/7 Crypto & Weekend Desk',
    eatSpanLabel: '00:00 – 24:00 EAT (24/7)',
    exchangeSchedule: 'BTC/USD & ETH/USD Live All Week · FX Closed Fri 23:55 – Sun 23:55 EAT',
    accentHex: '#A78BFA',
    openSurfaceClass: 'bg-gradient-to-br from-violet-950/50 via-[#120D24] to-[#090D1B] border-violet-400/75',
    openTitleClass: 'text-violet-300',
    closedTitleClass: 'text-violet-300/70',
    openBadgeClass: 'text-violet-300',
    closedAccentBarClass: 'bg-violet-400/45',
    startSec: 0,
    endSec: 86400,
    pairKeys: ['BTC/USD', 'ETH/USD'],
    bestCombos: 'BTC/USD · ETH/USD (24/7, including Saturday & Sunday when FX is closed)',
    bestEntryWindow: 'Best impulses align with 10:00 EAT London & 16:30 EAT US Equity Open',
    earlyWaitRule: 'Sun 02:00 – 06:00 EAT: Thin early-Sunday volume — confirm 1H 20/50 EMA alignment.',
    doNotTradeRule: 'Weekend Notice: FX, XAU/USD, US30, NAS100 & USOIL are CLOSED until Sun 23:55 EAT.',
  },
];

function formatHms(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function secondsUntilNextWeekdayTime(weekdayIdx: number, secOfDay: number, targetSec: number): number {
  for (let offset = 0; offset <= 4; offset++) {
    const dayIdx = (weekdayIdx + offset) % 7;
    if (dayIdx === 0 || dayIdx === 6) continue;
    if (offset === 0) {
      if (secOfDay < targetSec) return targetSec - secOfDay;
    } else {
      return 86400 - secOfDay + (offset - 1) * 86400 + targetSec;
    }
  }
  return 0;
}

function secondsUntilNextWeekendOpen(weekdayIdx: number, secOfDay: number): number {
  const sunOpenSec = 23 * 3600 + 55 * 60;
  if (weekdayIdx === 6) return 86400 - secOfDay + sunOpenSec;
  if (weekdayIdx === 0 && secOfDay < sunOpenSec) return sunOpenSec - secOfDay;
  if (weekdayIdx === 5 && secOfDay >= sunOpenSec) return 2 * 86400 + (86400 - secOfDay) + sunOpenSec;
  return 0;
}

interface SessionLiveEvaluation {
  isOpenNow: boolean;
  timerText: string;
  readinessCode: 'SAFE_TO_ENTER' | 'TOO_EARLY_WAIT' | 'DO_NOT_TRADE';
  readinessLabel: string;
  readinessReason: string;
}

function evaluateSessionLiveState(
  card: SessionCardMeta,
  weekdayIdx: number,
  secOfDay: number,
  isWeekendClosed: boolean,
  activeNewsAlertText: string | null
): SessionLiveEvaluation {
  if (card.id === 'crypto_247') {
    const isSundayQuiet = weekdayIdx === 0 && secOfDay >= 2 * 3600 && secOfDay < 6 * 3600;
    const fxTimer = isWeekendClosed
      ? `FX Reopens in ${formatHms(secondsUntilNextWeekendOpen(weekdayIdx, secOfDay))}`
      : '24/7 Active · Always Open';
    if (isSundayQuiet) {
      return {
        isOpenNow: true,
        timerText: fxTimer,
        readinessCode: 'TOO_EARLY_WAIT',
        readinessLabel: 'STUDY MARKET · LOW VOLUME',
        readinessReason:
          'Crypto runs 24/7, but early Sunday volume is light — please study 1H structure before entering.',
      };
    }
    return {
      isOpenNow: true,
      timerText: fxTimer,
      readinessCode: 'SAFE_TO_ENTER',
      readinessLabel: isWeekendClosed ? 'OPEN NOW · WEEKEND ACTIVE' : 'OPEN 24/7 · SAFE TO TRADE',
      readinessReason: isWeekendClosed
        ? 'FX & Metals are closed for the weekend; BTC/USD & ETH/USD are live for weekend execution.'
        : 'Continuous global crypto order flow active alongside weekday sessions.',
    };
  }

  if (isWeekendClosed) {
    const secsToOpen = secondsUntilNextWeekdayTime(weekdayIdx, secOfDay, card.startSec);
    return {
      isOpenNow: false,
      timerText: `CLOSED · OPENS IN ${formatHms(secsToOpen)}`,
      readinessCode: 'DO_NOT_TRADE',
      readinessLabel: 'WEEKEND CLOSED · STUDY CHARTS',
      readinessReason:
        'Market closed for the weekend. Please wait for open or inspect 24/7 Crypto inside Pillar 04.',
    };
  }

  if (card.id === 'rollover') {
    const isInRollover = secOfDay >= card.startSec || secOfDay < card.endSec;
    if (isInRollover) {
      const secsToEnd =
        secOfDay >= card.startSec ? 86400 - secOfDay + card.endSec : card.endSec - secOfDay;
      return {
        isOpenNow: false,
        timerText: `ROLLOVER · TOKYO OPENS IN ${formatHms(secsToEnd)}`,
        readinessCode: 'DO_NOT_TRADE',
        readinessLabel: 'DO NOT TRADE · SPREAD TRAP',
        readinessReason:
          'Please do NOT enter FX or Gold now — bank rollover liquidity drain widens spreads. Wait for Asian open.',
      };
    }
    return {
      isOpenNow: false,
      timerText: `ROLLOVER BEGINS IN ${formatHms(card.startSec - secOfDay)}`,
      readinessCode: 'DO_NOT_TRADE',
      readinessLabel: 'INACTIVE · NORMAL HOURS NOW',
      readinessReason:
        'Rollover trap is currently inactive — see highlighted active session card for open setups.',
    };
  }

  const isWithin = secOfDay >= card.startSec && secOfDay < card.endSec;
  if (isWithin) {
    const secsToClose = card.endSec - secOfDay;
    const secsSinceOpen = secOfDay - card.startSec;

    if (card.id === 'lull') {
      return {
        isOpenNow: true,
        timerText: `MIDDAY PAUSE · NY OPENS IN ${formatHms(secsToClose)}`,
        readinessCode: 'TOO_EARLY_WAIT',
        readinessLabel: 'PLEASE WAIT · STUDY MARKET',
        readinessReason:
          'Lunch-hour drift before 15:30 EAT NY release. Please wait for NY open and study 1H 20/50 EMA zones instead of forcing trades.',
      };
    }

    if (activeNewsAlertText && (card.id === 'london' || card.id === 'ny_overlap')) {
      return {
        isOpenNow: true,
        timerText: `OPEN · CLOSES IN ${formatHms(secsToClose)}`,
        readinessCode: 'TOO_EARLY_WAIT',
        readinessLabel: 'NEWS CAUTION · PLEASE WAIT 15m',
        readinessReason: `${activeNewsAlertText}. Please pause fresh market orders until spike volatility settles.`,
      };
    }

    const settleBufferSecs = card.id === 'asian' ? 45 * 60 : 15 * 60;
    if (secsSinceOpen < settleBufferSecs) {
      const settleLeftCd = formatHms(settleBufferSecs - secsSinceOpen);
      return {
        isOpenNow: true,
        timerText: `OPEN NOW · CLOSES IN ${formatHms(secsToClose)}`,
        readinessCode: 'TOO_EARLY_WAIT',
        readinessLabel: `TOO EARLY · WAIT ${settleLeftCd} TO STUDY`,
        readinessReason: `${card.title} just opened — please wait ${Math.ceil(
          (settleBufferSecs - secsSinceOpen) / 60
        )} min while opening spreads settle and study initial direction.`,
      };
    }

    if (secsToClose <= 20 * 60) {
      return {
        isOpenNow: true,
        timerText: `CLOSING SOON · IN ${formatHms(secsToClose)}`,
        readinessCode: 'TOO_EARLY_WAIT',
        readinessLabel: 'CLOSING · PLEASE AVOID NEW RISK',
        readinessReason:
          'Less than 20 minutes remaining in this session. Please manage open positions instead of opening new trades.',
      };
    }

    return {
      isOpenNow: true,
      timerText: `OPEN NOW · CLOSES IN ${formatHms(secsToClose)}`,
      readinessCode: 'SAFE_TO_ENTER',
      readinessLabel: 'SAFE TO ENTER · PRIME WINDOW',
      readinessReason: `Active institutional flow for ${card.bestCombos}. Verify 1H + 15m alignment inside Pillar 04.`,
    };
  }

  const secsToOpen = secondsUntilNextWeekdayTime(weekdayIdx, secOfDay, card.startSec);
  const openingSoon = secsToOpen <= 45 * 60;
  return {
    isOpenNow: false,
    timerText: `CLOSED · OPENS IN ${formatHms(secsToOpen)}`,
    readinessCode: openingSoon ? 'TOO_EARLY_WAIT' : 'DO_NOT_TRADE',
    readinessLabel: openingSoon ? 'TOO EARLY · OPENS SOON (STUDY)' : 'CLOSED · PLEASE WAIT',
    readinessReason: openingSoon
      ? `Oops — ${card.title} opens soon (${formatHms(secsToOpen)} left). Please study 1H levels and prepare limit alerts.`
      : `Oops — not the right time for ${card.bestCombos.split('·')[0].trim()} yet (${formatHms(
          secsToOpen
        )} until open). Please wait or trade the open session.`,
  };
}

export const EatSessionPlaybookMatrix: React.FC = () => {
  const [now, setNow] = useState<Date>(() => new Date());
  const [liveMarkets, setLiveMarkets] = useState<MarketScanData[]>(
    () => globalLiveStream.getState().markets
  );
  const [syncedAt, setSyncedAt] = useState<string>(
    () => globalLiveStream.getState().syncedAt
  );
  const [liveFeedConnected, setLiveFeedConnected] = useState<boolean>(
    () => globalLiveStream.getState().liveFeedConnected
  );

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    const unsub = globalLiveStream.subscribe((streamState) => {
      setLiveMarkets(streamState.markets);
      setSyncedAt(streamState.syncedAt);
      setLiveFeedConnected(streamState.liveFeedConnected);
    });
    return () => {
      window.clearInterval(id);
      unsub();
    };
  }, []);

  const nairobiFullDay = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(now);
  const nairobiTime = now.toLocaleTimeString('en-GB', {
    timeZone: 'Africa/Nairobi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const nairobiWeekdayShort = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Nairobi',
    weekday: 'short',
  }).format(now);
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const weekdayIdx = weekdayMap[nairobiWeekdayShort] ?? 1;

  const eatH =
    (parseInt(
      now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', hour12: false }),
      10
    ) || 0) % 24;
  const eatM = parseInt(
    now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', minute: '2-digit', hour12: false }),
    10
  );
  const eatS = parseInt(
    now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', second: '2-digit', hour12: false }),
    10
  );
  const secOfDay = eatH * 3600 + eatM * 60 + eatS;

  const isWeekendClosed =
    weekdayIdx === 6 ||
    (weekdayIdx === 0 && secOfDay < 23 * 3600 + 55 * 60) ||
    (weekdayIdx === 5 && secOfDay >= 23 * 3600 + 55 * 60);

  const londonTime = now.toLocaleTimeString('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const nyTime = now.toLocaleTimeString('en-GB', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const tokyoTime = now.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Live news & macro context synced directly to real-time liveMarkets percentages
  const pctMap: Partial<Record<CurrencyPair, number>> = {};
  liveMarkets.forEach((m) => {
    pctMap[m.pair] = m.change24hPct;
  });
  const macro = getCurrentMacroContext(pctMap);
  const upcomingEvents = getUpcomingEconomicEvents();
  const urgentNews = !isWeekendClosed
    ? upcomingEvents.find(
        (ev) => ev.status === 'ACTIVE_NOW' || (ev.status === 'IMMINENT' && ev.minutesUntil <= 45)
      )
    : undefined;
  const activeNewsAlertText = urgentNews
    ? `Please caution: ${urgentNews.name} (${urgentNews.currency}) at ${urgentNews.timeEAT}`
    : null;

  const gbpTiming = evaluatePairKenyaTiming('GBP/USD', now);
  const jpyTiming = evaluatePairKenyaTiming('USD/JPY', now);
  const goldTiming = evaluatePairKenyaTiming('XAU/USD', now);
  const us30Timing = evaluatePairKenyaTiming('US30', now);

  const marketByPair = new Map<CurrencyPair, MarketScanData>();
  liveMarkets.forEach((m) => marketByPair.set(m.pair, m));

  const liveCautionHeadline = isWeekendClosed
    ? `Weekend Interbank Closure — FX, Gold & Indices are CLOSED. Please wait until Sunday 23:55 EAT (or inspect 24/7 Crypto inside Pillar 04).`
    : urgentNews
    ? `News Caution Alert: ${urgentNews.name} (${urgentNews.currency}) ${
        urgentNews.minutesUntil <= 0 ? 'is active now' : `releases in ${urgentNews.minutesUntil} min`
      } (${urgentNews.timeEAT}) — please avoid hasty market orders until volatility settles.`
    : gbpTiming.windowStatusCode === 'OPEN' && !gbpTiming.isEarlySettlePhase && !gbpTiming.isClosingPhase
    ? `GBP/USD & Gold Window LIVE (Closes in ${gbpTiming.countdownFormatted}) — London/NY institutional liquidity active (${macro.riskRegime}, DXY ${
        macro.dxyPressurePct >= 0 ? `+${macro.dxyPressurePct}%` : `${macro.dxyPressurePct}%`
      }). Verify 4% risk cap before entering.`
    : jpyTiming.windowStatusCode === 'OPEN'
    ? jpyTiming.isEarlySettlePhase
      ? `Asian Session Just Opened — Please wait ${Math.ceil(
          (jpyTiming.earlySettleSecondsLeft || 60) / 60
        )}m for Tokyo spreads to settle. Oops: GBP/USD & EUR/USD are closed (London opens in ${gbpTiming.countdownFormatted}).`
      : `Asian Session Active (USD/JPY & Yen crosses open · Closes in ${jpyTiming.countdownFormatted}) — Note: NOT the right time to enter GBP/USD yet (London opens in ${gbpTiming.countdownFormatted}; please wait & study Asian levels).`
    : `Off-Session Caution — ${gbpTiming.reasonText} Please study higher-timeframe key levels instead of forcing low-liquidity trades.`;

  const keyTimingSnapshots = [
    { label: 'USD/JPY · JPY Crosses', pair: 'USD/JPY' as CurrencyPair, info: jpyTiming },
    { label: 'GBP/USD · EUR/USD', pair: 'GBP/USD' as CurrencyPair, info: gbpTiming },
    { label: 'XAU/USD · Gold', pair: 'XAU/USD' as CurrencyPair, info: goldTiming },
    { label: 'US30 · NAS100', pair: 'US30' as CurrencyPair, info: us30Timing },
  ];

  return (
    <section className="space-y-6 tabular-nums">
      {/* Header Banner: Nairobi Day + EAT Live Clock + Global Desk Clocks + Market Color Legend */}
      <div className="rounded-2xl bg-[#0B101E] border border-slate-800 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-[#D4AF37] font-bold">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Real-Time Session Timing &amp; Entry Caution Guide · East Africa Time (EAT / UTC+3)</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={liveFeedConnected ? 'text-[#00C261]' : 'text-amber-300'}>
                {liveFeedConnected ? `Live Data Synced (${syncedAt})` : `Calibrated (${nairobiTime} EAT)`}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {nairobiFullDay} · <span className="text-[#D4AF37] font-mono">{nairobiTime} EAT</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Every card below auto-updates with live exchange data and is distinctly color-coded by session (Asian = Cyan, London = Emerald, Lull = Amber, New York = Gold, Rollover = Crimson, Crypto = Violet) plus bright vs. dimmed surfaces so Open and Closed markets stand apart immediately.
            </p>
          </div>

          {/* Non-clickable World Desk Clock Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono shrink-0 border border-slate-800 rounded-xl bg-slate-950/80 p-3.5">
            <div className="px-2">
              <span className="text-[11px] text-slate-400 block">Nairobi (EAT)</span>
              <strong className="text-sm text-[#D4AF37]">{nairobiTime}</strong>
            </div>
            <div className="px-2">
              <span className="text-[11px] text-slate-400 block">Tokyo (JST)</span>
              <strong className="text-sm text-sky-300">{tokyoTime}</strong>
            </div>
            <div className="px-2">
              <span className="text-[11px] text-slate-400 block">London (GMT)</span>
              <strong className="text-sm text-[#00C261]">{londonTime}</strong>
            </div>
            <div className="px-2">
              <span className="text-[11px] text-slate-400 block">New York (ET)</span>
              <strong className="text-sm text-[#F3D36B]">{nyTime}</strong>
            </div>
          </div>
        </div>

        {/* Distinct Color Key Legend: Market Identity vs Open/Closed State */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/70 text-[11px] font-mono">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" />
              <span>Asian (Cyan)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#00C261] inline-block" />
              <span>London (Emerald)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
              <span>Mid-Day Lull (Amber)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D4AF37] inline-block" />
              <span>New York (Gold)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
              <span>Rollover (Crimson)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-violet-400 inline-block" />
              <span>Crypto 24/7 (Violet)</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span>Bright Tinted Card = <strong className="text-white">Active / Open</strong></span>
            <span aria-hidden="true">·</span>
            <span>Dimmed Dark Card = <strong className="text-slate-300">Closed / Wait</strong></span>
          </div>
        </div>

        {/* Real-Time Auto-Synced Pair Caution & News Alert Advisory Strip */}
        <div
          className={`p-4 rounded-xl border space-y-3 ${
            urgentNews || isWeekendClosed
              ? 'bg-amber-950/25 border-amber-500/45'
              : 'bg-slate-950/75 border-slate-800'
          }`}
        >
          <div className="flex items-start gap-2.5 text-xs sm:text-sm">
            <ShieldAlert
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                urgentNews || isWeekendClosed ? 'text-amber-300' : 'text-[#D4AF37]'
              }`}
            />
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-black text-[#D4AF37] block">
                LIVE RIGHT NOW ({nairobiTime} EAT) · {macro.sessionWindowName} · DXY{' '}
                {macro.dxyPressurePct >= 0 ? `+${macro.dxyPressurePct}%` : `${macro.dxyPressurePct}%`} ({macro.riskRegime})
              </span>
              <p className="text-slate-100 leading-relaxed font-medium">{liveCautionHeadline}</p>
            </div>
          </div>

          {/* Non-clickable Read-Only Quick Check by Instrument Family with Auto-Updating Spot Quote */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/70 text-xs font-mono">
            {keyTimingSnapshots.map(({ label, pair, info }) => {
              const quote = marketByPair.get(pair);
              const pctText = quote
                ? `${quote.change24hPct >= 0 ? '+' : ''}${quote.change24hPct.toFixed(2)}%`
                : '';
              return (
                <div key={label} className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-400">{label}</span>
                    {quote && (
                      <span className={quote.change24hPct >= 0 ? 'text-[#00C261]' : 'text-red-400'}>
                        {quote.price} ({pctText})
                      </span>
                    )}
                  </div>
                  <strong
                    className={`block text-[11px] ${
                      info.isFavorableTime
                        ? 'text-[#00C261]'
                        : info.windowStatusCode === 'OPENING_SOON' ||
                          info.isEarlySettlePhase ||
                          info.isClosingPhase
                        ? 'text-amber-300'
                        : 'text-red-400'
                    }`}
                  >
                    {info.statusLabel}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6 Pure Informational Color-Coded Timeframe Cards (Non-Clickable, Auto-Updating Live Telemetry) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 select-text">
        {SESSION_CARDS.map((card) => {
          const evalState = evaluateSessionLiveState(
            card,
            weekdayIdx,
            secOfDay,
            isWeekendClosed,
            activeNewsAlertText
          );
          const isPrimeActive = evalState.isOpenNow && evalState.readinessCode === 'SAFE_TO_ENTER';
          const isWaitOrStudy = evalState.readinessCode === 'TOO_EARLY_WAIT';
          const isClosedDimmed = !isPrimeActive && !isWaitOrStudy;

          // Distinct visual styling per state + unique session identity:
          // - Open & Safe: Full distinct session color gradient surface & matching 1px border (Cyan Asian, Emerald London, Gold NY, Violet Crypto)
          // - Wait / Study / Early / Lull: Distinct Amber caution tint + amber border
          // - Closed / Rollover Inactive: Dimmed dark surface so open sessions visually pop off the page
          const cardSurfaceClass = isPrimeActive
            ? card.openSurfaceClass
            : isWaitOrStudy
            ? card.id === 'lull'
              ? card.openSurfaceClass
              : 'bg-gradient-to-br from-amber-950/35 via-[#131008] to-[#080B14] border-amber-400/65'
            : card.id === 'rollover' && evalState.readinessLabel.includes('SPREAD TRAP')
            ? card.openSurfaceClass
            : 'bg-[#060912] border-slate-800/80 opacity-80';

          const statusWord =
            card.id === 'lull' && evalState.isOpenNow
              ? 'LULL · STUDY'
              : card.id === 'rollover' && evalState.readinessLabel.includes('INACTIVE')
              ? 'INACTIVE'
              : card.id === 'rollover' && evalState.readinessLabel.includes('SPREAD TRAP')
              ? 'TRAP · AVOID'
              : evalState.isOpenNow
              ? isWaitOrStudy
                ? 'OPEN · WAIT'
                : 'OPEN NOW'
              : 'CLOSED';

          return (
            <article
              key={card.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-colors ${cardSurfaceClass}`}
            >
              {/* Top 3px full-width signature color bar so Asian/London/NY/Crypto are always distinct even when Closed */}
              <div
                className={`h-1 w-full ${
                  isClosedDimmed && card.id !== 'rollover' ? card.closedAccentBarClass : ''
                }`}
                style={
                  !isClosedDimmed || card.id === 'rollover'
                    ? { backgroundColor: card.accentHex }
                    : undefined
                }
              />

              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Card Top Header */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800/75">
                    <div>
                      <h3
                        className={`text-base font-black ${
                          isClosedDimmed ? card.closedTitleClass : card.openTitleClass
                        }`}
                      >
                        {card.title}
                      </h3>
                      <p className="text-xs font-mono text-white font-bold mt-1">
                        {card.eatSpanLabel}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-mono font-black whitespace-nowrap ${
                        evalState.readinessCode === 'SAFE_TO_ENTER'
                          ? card.openBadgeClass
                          : evalState.readinessCode === 'TOO_EARLY_WAIT'
                          ? 'text-amber-300'
                          : card.id === 'rollover' && evalState.readinessLabel.includes('INACTIVE')
                          ? 'text-slate-400'
                          : 'text-red-400'
                      }`}
                    >
                      {statusWord}
                    </span>
                  </div>

                  {/* Live Countdown & Entry Verdict */}
                  <div className="space-y-1.5 pb-3 border-b border-slate-800/60">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-slate-400">Timer:</span>
                      <strong className={isClosedDimmed ? 'text-slate-300' : 'text-white'}>
                        {evalState.timerText}
                      </strong>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 text-xs font-mono font-bold ${
                        evalState.readinessCode === 'SAFE_TO_ENTER'
                          ? card.openBadgeClass
                          : isWaitOrStudy
                          ? 'text-amber-300'
                          : card.id === 'rollover' && evalState.readinessLabel.includes('INACTIVE')
                          ? 'text-slate-400'
                          : 'text-red-400'
                      }`}
                    >
                      {evalState.readinessCode === 'SAFE_TO_ENTER' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : isWaitOrStudy ? (
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{evalState.readinessLabel}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {evalState.readinessReason}
                    </p>
                  </div>

                  {/* Auto-Updating Live Market Snapshot for This Session's Instruments */}
                  <div className="pb-3 border-b border-slate-800/60 space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Live Session Feed</span>
                      <span>{syncedAt}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      {card.pairKeys.map((pk) => {
                        const m = marketByPair.get(pk);
                        if (!m) return null;
                        const isPos = m.change24hPct >= 0;
                        const isChop = m.bias === 'NEUTRAL_CHOP';
                        const dirLabel = isChop ? 'CHOP' : m.bias === 'STRONG_SELL' ? 'SELL' : 'BUY';
                        const dirClass = isChop
                          ? 'text-amber-300'
                          : dirLabel === 'BUY'
                          ? 'text-[#00C261]'
                          : 'text-red-400';
                        return (
                          <div key={pk} className="flex items-center justify-between gap-1 truncate">
                            <span className="text-slate-300 font-bold truncate">{pk}</span>
                            <span className="text-right shrink-0">
                              <span className="text-white">{m.price}</span>{' '}
                              <span className={isClosedDimmed ? (isPos ? 'text-[#00C261]' : 'text-red-400') : dirClass}>
                                {isClosedDimmed ? `${isPos ? '+' : ''}${m.change24hPct.toFixed(1)}%` : dirLabel}
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Session Reference Guide */}
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block">
                        Exchange Openings
                      </span>
                      <span className="text-slate-200 font-medium">{card.exchangeSchedule}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block">
                        Best Currency, Metal &amp; Index Combos
                      </span>
                      <strong className="font-mono text-white block mt-0.5 leading-snug">
                        {card.bestCombos}
                      </strong>
                    </div>

                    <div>
                      <span className={`text-[11px] font-mono block ${card.openTitleClass}`}>
                        Best Window to Enter
                      </span>
                      <span className="text-slate-200 leading-snug block">{card.bestEntryWindow}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-amber-300 block">
                        Too Early / Study Market Rule
                      </span>
                      <span className="text-slate-300 leading-snug block">{card.earlyWaitRule}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-red-400 block">
                        Do Not Trade / Avoid
                      </span>
                      <span className="text-red-200/90 leading-snug block">{card.doNotTradeRule}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
