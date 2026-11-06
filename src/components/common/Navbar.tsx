import React, { useState, useEffect, useRef } from 'react';
import { CurrencyPair, PageTab, TradeNotification } from '../../types';
import { Logo } from './Logo';
import {
  ActiveMarketOrder,
  MarketScanData,
  globalLiveStream,
  computeLiveOrderMetrics
} from '../../utils/liveMarketEngine';
import {
  GraduationCap,
  CandlestickChart,
  Target,
  Scan,
  ShieldCheck,
  Brain,
  Activity,
  Award,
  Clock,
  Menu,
  X,
  Home,
  Sparkles,
  Lock,
  Globe,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  killSwitchUntil: number | null;
  onOpenLogoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  killSwitchUntil,
  onOpenLogoModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(true);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const [eatTime, setEatTime] = useState<string>('');
  const [sessionStatus, setSessionStatus] = useState<{ label: string; isOpen: boolean }>({
    label: 'Nairobi EAT',
    isOpen: true,
  });
  const [activeOrders, setActiveOrders] = useState<Partial<Record<CurrencyPair, ActiveMarketOrder>>>(
    () => globalLiveStream.getState().activeOrders
  );
  const [notifications, setNotifications] = useState<TradeNotification[]>(
    () => globalLiveStream.getState().notifications
  );
  const [markets, setMarkets] = useState<MarketScanData[]>(() => globalLiveStream.getState().markets);

  useEffect(() => {
    const unsubscribe = globalLiveStream.subscribe((streamState) => {
      setActiveOrders(streamState.activeOrders);
      setNotifications(streamState.notifications);
      setMarkets(streamState.markets);
    });

    const handleNewNotif = (e: any) => {
      if (!soundEnabledRef.current) return;
      try {
        const notifType = e?.detail?.type;
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (notifType === 'SL_WARNING') {
          // Urgent two-tone warning alarm for structural reversal & invalidation risk
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1040, audioCtx.currentTime);
          osc.frequency.setValueAtTime(780, audioCtx.currentTime + 0.13);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.28);
        } else if (notifType === 'TP_HIT' || notifType === 'PROFIT_MILESTONE') {
          // Harmonious celebratory ascending chime for profit milestone
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.18);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.22);
        } else {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(980, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.14);
        }
      } catch {}
    };

    window.addEventListener('pivotfx:new-notification', handleNewNotif);
    return () => {
      unsubscribe();
      window.removeEventListener('pivotfx:new-notification', handleNewNotif);
    };
  }, []);

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
      const eatMin = parseInt(
        now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', minute: '2-digit', hour12: false }),
        10
      );
      const totalMin = eatHour * 60 + eatMin;

      if (totalMin >= 600 && totalMin < 780) {
        setSessionStatus({ label: 'London Open · Open', isOpen: true });
      } else if (totalMin >= 930 && totalMin < 1170) {
        setSessionStatus({ label: 'London/NY · Open', isOpen: true });
      } else if (totalMin >= 780 && totalMin < 930) {
        setSessionStatus({ label: 'Midday Lull · Opens 15:30', isOpen: false });
      } else if (totalMin >= 1170 && totalMin < 1320) {
        setSessionStatus({ label: 'NY Late · Caution', isOpen: false });
      } else if (totalMin >= 1320 || totalMin < 180) {
        setSessionStatus({ label: 'Rollover · Opens 03:00', isOpen: false });
      } else {
        setSessionStatus({ label: 'Tokyo Range · Open', isOpen: true });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    { id: '/fx-academy', label: 'P1 Academy', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: '/chart-mastery', label: 'P2 Charts', icon: <CandlestickChart className="w-3.5 h-3.5" /> },
    { id: '/strategy-vault', label: 'P3 Strategy', icon: <Target className="w-3.5 h-3.5" /> },
    { id: '/ai-scanner', label: 'P4 Radar', icon: <Scan className="w-3.5 h-3.5" /> },
    { id: '/risk-management', label: 'P5 Risk', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: '/psychology', label: 'P6 Mindset', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: '/live-pulse', label: 'P7 Pulse', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: '/growth-lab', label: 'P8 Funded', icon: <Award className="w-3.5 h-3.5" /> },
    { id: '/macro-safety', label: 'P9 Safety', icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  const isLocked = killSwitchUntil && killSwitchUntil > Date.now();
  const minutesLeft = isLocked ? Math.ceil((killSwitchUntil - Date.now()) / 60000) : 0;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080C14]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Left Zone: Brand Wordmark */}
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center text-left focus:outline-none shrink-0"
          >
            <Logo size="md" showBadge={false} />
          </button>

          {/* Center Zone: Single-Line Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 min-w-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-1 px-2 2xl:px-2.5 py-2 rounded-xl text-[11px] 2xl:text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-white bg-[#111A2E] border border-[#D4AF37]/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-[#D4AF37]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#D4AF37]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Zone: Live Orders / Trade Log + Notifications Bell + EAT Clock + Brand Kit */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 relative">
            {isLocked && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/90 border border-red-500/40 text-red-300 text-xs font-mono whitespace-nowrap">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>LOCK: {minutesLeft}m</span>
              </div>
            )}

            {(() => {
              const openEntries = Object.values(activeOrders).filter((o): o is ActiveMarketOrder => Boolean(o));
              let netUsdSum = 0;
              openEntries.forEach((ord) => {
                const mkt = markets.find((m) => m.pair === ord.pair);
                const livePrice = mkt ? mkt.price : ord.entryPrice;
                netUsdSum += computeLiveOrderMetrics(ord, livePrice, mkt?.atrPips).netProfitUsd;
              });
              const isPos = netUsdSum >= 0;
              return (
                <button
                  type="button"
                  onClick={() => globalLiveStream.requestOpenScannerView('trade_log')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-black tabular-nums transition whitespace-nowrap shrink-0 ${
                    openEntries.length > 0
                      ? isPos
                        ? 'bg-emerald-950/80 border-[#00C261]/60 text-[#00C261]'
                        : 'bg-red-950/80 border-red-500/50 text-red-300'
                      : 'bg-[#0B1120] hover:bg-slate-900 border-slate-800 hover:border-[#D4AF37]/40 text-slate-200'
                  }`}
                  title="Open Real Suggested Markets Trade Log & Placed Broker Orders"
                >
                  <span>
                    {openEntries.length > 0
                      ? `Orders (${openEntries.length}) · ${
                          isPos ? `+$${netUsdSum.toFixed(2)}` : `-$${Math.abs(netUsdSum).toFixed(2)}`
                        }`
                      : 'Trade Log'}
                  </span>
                </button>
              );
            })()}

            {/* Notifications Bell Button */}
            <button
              type="button"
              onClick={() => setNotifOpen((prev) => !prev)}
              aria-label="Trade Alerts and Broker Order Notifications"
              className="relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0B1120] hover:bg-slate-900 border border-slate-800 hover:border-[#D4AF37]/40 text-xs font-mono text-slate-200 transition whitespace-nowrap shrink-0 tabular-nums"
              title="Notifications & Broker Order Alerts"
            >
              <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
              {unreadCount > 0 && (
                <span className="text-[11px] font-black text-[#00C261]">{unreadCount}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('/macro-safety')}
              className="flex items-center gap-1.5 px-2.5 2xl:px-3 py-1.5 rounded-xl bg-[#0B1120] hover:bg-slate-900 border border-slate-800 hover:border-[#D4AF37]/40 text-[11px] 2xl:text-xs font-mono transition whitespace-nowrap shrink-0"
              title="Open Nairobi Session & Macro Safety Guard"
            >
              <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="text-white font-bold tabular-nums">{eatTime} EAT</span>
              <span aria-hidden="true" className="hidden 2xl:inline text-slate-600">·</span>
              <span
                className={`hidden 2xl:inline font-bold ${
                  sessionStatus.isOpen ? 'text-[#00C261]' : 'text-amber-300'
                }`}
              >
                {sessionStatus.label}
              </span>
            </button>

            <button
              onClick={onOpenLogoModal}
              title="PivotFx Brand Kit"
              className="p-2 rounded-xl bg-[#0B1120] hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-[#D4AF37]/50 transition shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </button>

            {/* Notifications Slide-Down Popover */}
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-[#0B101E] border border-[#D4AF37]/50 shadow-2xl p-4 space-y-3 font-mono tabular-nums z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-black text-[#D4AF37]">
                    LIVE ORDER &amp; AI ALERTS ({notifications.length})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSoundEnabled((prev) => !prev)}
                      className="p-1 rounded bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                      title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
                    >
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00C261]" /> : <VolumeX className="w-3.5 h-3.5" />}
                    </button>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => globalLiveStream.markAllNotificationsRead()}
                        className="text-[10px] text-[#00C261] hover:underline font-bold"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {notifications.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.slice(0, 12).map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          globalLiveStream.markNotificationRead(n.id);
                          setNotifOpen(false);
                          globalLiveStream.requestOpenScannerView('trade_log', n.pair);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition space-y-1 ${
                          !n.read
                            ? 'bg-slate-900 border-[#D4AF37]/45'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <strong
                            className={
                              n.type === 'ORDER_PLACED' || n.type === 'TP_HIT'
                                ? 'text-[#00C261]'
                                : n.type === 'SL_WARNING'
                                ? 'text-amber-300'
                                : 'text-[#D4AF37]'
                            }
                          >
                            {n.title}
                          </strong>
                          <span className="text-[9px] text-slate-500 shrink-0">
                            {n.eatTimestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans leading-snug">
                          {n.message}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-sans py-3">
                    No alerts yet. When you notify PivotFx that you placed a broker order, hit TP1/TP2, or trigger a Deep AI Scan, live alerts appear here.
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      globalLiveStream.requestOpenScannerView('trade_log');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl btn-gold text-black font-black text-[11px] uppercase tracking-wider"
                  >
                    Open Trade Log &amp; Broker Orders
                  </button>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => globalLiveStream.clearNotifications()}
                      className="px-2.5 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-[10px] font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A0E18] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-white font-bold">{eatTime} EAT</span>
            </div>
            <span className={sessionStatus.isOpen ? 'text-[#00C261] font-semibold' : 'text-amber-300 font-semibold'}>
              {sessionStatus.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                    isActive
                      ? 'btn-gold text-black'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-black' : 'text-[#D4AF37]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
