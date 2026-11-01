import React, { useState, useEffect } from 'react';
import { PageTab } from '../../types';
import { Logo } from './Logo';
import {
  Compass,
  SlidersHorizontal,
  CandlestickChart,
  Scan,
  GraduationCap,
  Scale,
  BookOpenCheck,
  ShieldCheck,
  Clock,
  Flame,
  Lock,
  Menu,
  X,
  Download,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  killSwitchUntil: number | null;
  xpPoints: number;
  onOpenLogoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  killSwitchUntil,
  xpPoints,
  onOpenLogoModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eatTime, setEatTime] = useState<string>('');
  const [sessionInfo, setSessionInfo] = useState<{ name: string; isHighVolume: boolean }>({
    name: 'Calculating EAT...',
    isHighVolume: false,
  });

  // Clock in East Africa Time (UTC+3)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Nairobi EAT
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setEatTime(timeStr);

      // Determine session based on Nairobi hour
      const eatHour = parseInt(
        now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Nairobi', hour: '2-digit', hour12: false }),
        10
      );

      if (eatHour >= 11 && eatHour < 19) {
        setSessionInfo({ name: 'London / NY Peak (High Vol)', isHighVolume: true });
      } else if (eatHour >= 19 && eatHour < 23) {
        setSessionInfo({ name: 'New York Session', isHighVolume: false });
      } else if (eatHour === 23 || eatHour === 0) {
        setSessionInfo({ name: 'Rollover Spread Warning', isHighVolume: false });
      } else if (eatHour >= 3 && eatHour < 10) {
        setSessionInfo({ name: 'Asian Range Session', isHighVolume: false });
      } else {
        setSessionInfo({ name: 'Pre-London Setup', isHighVolume: false });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: PageTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'start-here', label: 'Start Here', icon: <Compass className="w-4 h-4" /> },
    { id: 'super-analysis', label: 'Super Analysis', icon: <SlidersHorizontal className="w-4 h-4" />, badge: 'MT4/5' },
    { id: 'tradingview', label: 'TradingView', icon: <CandlestickChart className="w-4 h-4" /> },
    { id: 'ai-scanner', label: 'AI Scanner', icon: <Scan className="w-4 h-4" />, badge: 'Dual' },
    { id: 'masterclass', label: 'Masterclass', icon: <GraduationCap className="w-4 h-4" />, badge: '5 Belts' },
    { id: 'brokers', label: 'Broker Hub', icon: <Scale className="w-4 h-4" />, badge: 'Live' },
    { id: 'journal', label: 'Journal & Calc', icon: <BookOpenCheck className="w-4 h-4" /> },
    { id: 'trust-legal', label: 'Trust & Legal', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const isLocked = killSwitchUntil && killSwitchUntil > Date.now();
  const minutesLeft = isLocked ? Math.ceil((killSwitchUntil - Date.now()) / 60000) : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F17]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => onSelectTab('start-here')}
            className="flex items-center text-left focus:outline-none"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-[#111827] border border-[#00C261]/40 shadow-[0_0_15px_rgba(0,194,97,0.15)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <span className={isActive ? 'text-[#00C261]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-mono font-semibold ${
                        isActive
                          ? 'bg-[#00C261]/25 text-[#00C261]'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#00C261] rounded-full shadow-[0_0_8px_#00C261]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Items */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Kill Switch Active Warning */}
            {isLocked && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono animate-pulse">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>KILL SWITCH: {minutesLeft}m left</span>
              </div>
            )}

            {/* Nairobi EAT Clock & Session */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-[#00C261]" />
              <div className="flex flex-col text-[11px] leading-tight">
                <span className="text-white font-bold">{eatTime} EAT</span>
                <span className={sessionInfo.isHighVolume ? 'text-[#00C261] font-semibold' : 'text-slate-400'}>
                  {sessionInfo.name}
                </span>
              </div>
            </div>

            {/* XP Points Counter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{xpPoints} XP</span>
            </div>

            {/* Logo Assets Trigger */}
            <button
              onClick={onOpenLogoModal}
              title="Download Logo & Favicon"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition active:scale-95"
            >
              <Download className="w-4 h-4 text-[#00C261]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenLogoModal}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <Download className="w-4 h-4 text-[#00C261]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#111827] border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1422] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00C261]" />
              <span className="text-white font-bold">{eatTime} EAT</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{xpPoints} XP</span>
            </div>
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
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-bold text-left transition ${
                    isActive
                      ? 'bg-[#00C261] text-black shadow-lg shadow-[#00C261]/25'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span className={isActive ? 'text-black' : 'text-[#00C261]'}>
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
