import React, { useState, useEffect } from 'react';
import { PageTab } from '../../types';
import { Logo } from './Logo';
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
  Lock
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
  const [eatTime, setEatTime] = useState<string>('');
  const [sessionLabel, setSessionLabel] = useState<string>('Nairobi EAT');

  // Clock in East Africa Time (UTC+3)
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
        setSessionLabel('London Open (High Vol)');
      } else if (eatHour >= 15 && eatHour < 20) {
        setSessionLabel('London/NY Overlap (Peak)');
      } else if (eatHour >= 20 && eatHour < 23) {
        setSessionLabel('NY Afternoon');
      } else if (eatHour === 23 || eatHour === 0) {
        setSessionLabel('Rollover (Caution)');
      } else {
        setSessionLabel('Tokyo Asian Range');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: PageTab; label: string; icon: React.ReactNode; shortLabel: string }[] = [
    { id: 'landing', label: 'Home', shortLabel: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    { id: '/fx-academy', label: 'P1: FX Academy', shortLabel: 'P1 Academy', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: '/chart-mastery', label: 'P2: Chart Mastery', shortLabel: 'P2 Charts', icon: <CandlestickChart className="w-3.5 h-3.5" /> },
    { id: '/strategy-vault', label: 'P3: Strategy Vault', shortLabel: 'P3 Strategy', icon: <Target className="w-3.5 h-3.5" /> },
    { id: '/ai-scanner', label: 'P4: AI Scanner', shortLabel: 'P4 AI Vision', icon: <Scan className="w-3.5 h-3.5" /> },
    { id: '/risk-management', label: 'P5: Risk & Capital', shortLabel: 'P5 Risk', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: '/psychology', label: 'P6: Psychology', shortLabel: 'P6 Mindset', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: '/live-pulse', label: 'P7: Live Pulse', shortLabel: 'P7 Pulse', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: '/growth-lab', label: 'P8: Growth Lab', shortLabel: 'P8 Funded', icon: <Award className="w-3.5 h-3.5" /> },
  ];

  const isLocked = killSwitchUntil && killSwitchUntil > Date.now();
  const minutesLeft = isLocked ? Math.ceil((killSwitchUntil - Date.now()) / 60000) : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080C14]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center text-left focus:outline-none"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-[#0F172A] border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <span className={isActive ? 'text-[#D4AF37]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Items */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Kill Switch Active Warning */}
            {isLocked && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono animate-pulse">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>KILL SWITCH: {minutesLeft}m</span>
              </div>
            )}

            {/* Nairobi EAT Clock & Session */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <div className="flex flex-col text-[11px] leading-tight text-left">
                <span className="text-white font-bold">{eatTime} EAT</span>
                <span className="text-slate-400 text-[10px] truncate max-w-[120px]">
                  {sessionLabel}
                </span>
              </div>
            </div>

            {/* Logo Assets Trigger */}
            <button
              onClick={onOpenLogoModal}
              title="Download PivotFx Logo"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-[#D4AF37]/50 transition"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A0E18] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-white font-bold">{eatTime} EAT</span>
            </div>
            <span className="text-[#D4AF37] font-semibold">{sessionLabel}</span>
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
                      ? 'btn-gold text-black shadow-lg'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
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
