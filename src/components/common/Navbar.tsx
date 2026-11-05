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
  Lock,
  Globe
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
  const [sessionStatus, setSessionStatus] = useState<{ label: string; isOpen: boolean }>({
    label: 'Nairobi EAT',
    isOpen: true,
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

  // ROW 2 - stays on top row
  const row1Items: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    { id: '/fx-academy', label: 'P1 Academy', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: '/chart-mastery', label: 'P2 Charts', icon: <CandlestickChart className="w-3.5 h-3.5" /> },
    { id: '/strategy-vault', label: 'P3 Strategy', icon: <Target className="w-3.5 h-3.5" /> },
    { id: '/ai-scanner', label: 'P4 Scanner', icon: <Scan className="w-3.5 h-3.5" /> },
    { id: '/risk-management', label: 'P5 Risk', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: '/psychology', label: 'P6 Mindset', icon: <Brain className="w-3.5 h-3.5" /> },
  ];

  // ROW 3 - the ones that were invisible, now visible underneath
  const row2Items: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: '/live-pulse', label: 'P7 Pulse', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: '/growth-lab', label: 'P8 Funded', icon: <Award className="w-3.5 h-3.5" /> },
    { id: '/macro-safety', label: 'P9 Safety', icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  const allItems = [...row1Items, ...row2Items];

  const renderPill = (item: { id: PageTab; label: string; icon: React.ReactNode }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onSelectTab(item.id)}
        className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
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
          <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#D4AF37] rounded-full" />
        )}
      </button>
    );
  };

  const isLocked = killSwitchUntil && killSwitchUntil > Date.now();
  const minutesLeft = isLocked ? Math.ceil((killSwitchUntil - Date.now()) / 60000) : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080C14]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ROW 1 - Logo + Clock - ALWAYS VISIBLE */}
        <div className="flex items-center justify-between gap-4 h-16">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center text-left focus:outline-none shrink-0"
          >
            <Logo size="md" showBadge={false} />
          </button>

          <div className="flex items-center gap-2.5 shrink-0">
            {isLocked && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/90 border border-red-500/40 text-red-300 text-xs font-mono whitespace-nowrap">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>LOCK: {minutesLeft}m</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => onSelectTab('/macro-safety')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1120] hover:bg-slate-900 border border-slate-800 hover:border-[#D4AF37]/40 text-xs font-mono transition whitespace-nowrap"
              title="Open Nairobi Session & Macro Safety Guard"
            >
              <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="text-white font-bold tabular-nums">{eatTime} EAT</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={sessionStatus.isOpen ? 'text-[#00C261] font-bold' : 'text-amber-300 font-bold'}>
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
          </div>
        </div>

        {/* ROW 2 - Home + P1 to P6 - ALWAYS VISIBLE, wraps if needed */}
        <div className="flex items-center justify-center gap-1 flex-wrap pb-1.5">
          {row1Items.map(renderPill)}
        </div>

        {/* ROW 3 - ONLY P7, P8, P9 - ALWAYS VISIBLE, centered underneath */}
        <div className="flex items-center justify-center gap-1 flex-wrap pb-2">
          {row2Items.map(renderPill)}
        </div>
      </div>

      {/* Mobile Drawer - kept only for very small phones, order fixed left-to-right */}
      {mobileMenuOpen && (
        <div className="bg-[#0A0E18] border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {allItems.map((item) => {
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
