import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showBadge = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 30, text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 40, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 54, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Institutional Precision Crest: Obsidian Shield, Fibonacci Reticle, Twin Candles & Breakout Vector */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-[#162033] via-[#0B1120] to-[#05080F] p-1.5 border border-[#D4AF37]/50 shadow-[0_6px_24px_rgba(212,175,55,0.22)] hover:border-[#F5E6AD] transition-all duration-200 group"
        style={{ width: currentSize.icon + 10, height: currentSize.icon + 10 }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform group-hover:scale-105 transition-transform duration-200"
        >
          <defs>
            <linearGradient id="pivotBgShield" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#162238" />
              <stop offset="0.55" stopColor="#0B1120" />
              <stop offset="1" stopColor="#05080E" />
            </linearGradient>
            <linearGradient id="pivotChampagneGold" x1="14" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFF3C4" />
              <stop offset="0.45" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#9A740D" />
            </linearGradient>
            <linearGradient id="pivotEmeraldBull" x1="16" y1="26" x2="22" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#34D399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Inner Precision Frame */}
          <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#pivotBgShield)" stroke="url(#pivotChampagneGold)" strokeOpacity="0.42" strokeWidth="1.2" />

          {/* Institutional Fibonacci Crosshair Ring & Compass Ticks */}
          <circle cx="32" cy="32" r="22" stroke="#D4AF37" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="32" y1="7" x2="32" y2="11" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="53" x2="32" y2="57" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7" y1="32" x2="11" y2="32" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="53" y1="32" x2="57" y2="32" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />

          {/* Secondary Bullish Institutional Candle (Order-Block Confirmation) */}
          <line x1="16" y1="22" x2="16" y2="49" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="13" y="28" width="6" height="14" rx="2" fill="url(#pivotEmeraldBull)" />

          {/* Primary Gold Candlestick Pillar forming Structural 'P' Stem */}
          <line x1="27" y1="11" x2="27" y2="53" stroke="url(#pivotChampagneGold)" strokeWidth="3.2" strokeLinecap="round" />
          <rect x="22.5" y="17" width="9" height="27" rx="2.5" fill="url(#pivotChampagneGold)" />

          {/* Architectural Upper Pivot Loop of 'P' */}
          <path
            d="M27 17.5 H41 C47.8 17.5 52.5 21.8 52.5 28 C52.5 34.2 47.8 38.5 41 38.5 H27"
            fill="none"
            stroke="url(#pivotChampagneGold)"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Parabolic Liquidity Sweep + Precision Breakout Vector */}
          <path
            d="M15 44 Q28 41 37 27 L50 14"
            fill="none"
            stroke="#FFF7D6"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M42.5 14 H50 V21.5"
            fill="none"
            stroke="#FFF7D6"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Calibrated Pivot Fulcrum Node */}
          <circle cx="37" cy="27" r="3" fill="#00C261" stroke="#FFF7D6" strokeWidth="1.3" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight text-white leading-none ${currentSize.text}`}>
              Pivot<span className="text-gold-gradient">Fx</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-[#D4AF37] tracking-wider whitespace-nowrap">
              INSTITUTIONAL QUANT
            </span>
          </div>

          {showBadge && (
            <div className="text-slate-400 font-medium mt-0.5 leading-tight">
              <span className={`${currentSize.sub} font-mono text-slate-300 whitespace-nowrap`}>
                Live Telemetry · Human Co-Pilot · Funded Execution
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RAW_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256">
  <defs>
    <linearGradient id="pivotBgShield" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#162238"/>
      <stop offset="0.55" stop-color="#0B1120"/>
      <stop offset="1" stop-color="#05080E"/>
    </linearGradient>
    <linearGradient id="pivotChampagneGold" x1="14" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFF3C4"/>
      <stop offset="0.45" stop-color="#D4AF37"/>
      <stop offset="1" stop-color="#9A740D"/>
    </linearGradient>
    <linearGradient id="pivotEmeraldBull" x1="16" y1="26" x2="22" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#34D399"/>
      <stop offset="1" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#060911"/>
  <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#pivotBgShield)" stroke="url(#pivotChampagneGold)" stroke-opacity="0.5" stroke-width="1.4"/>
  <circle cx="32" cy="32" r="22" stroke="#D4AF37" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="3 3" fill="none"/>
  <line x1="16" y1="22" x2="16" y2="49" stroke="#10B981" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="13" y="28" width="6" height="14" rx="2" fill="url(#pivotEmeraldBull)"/>
  <line x1="27" y1="11" x2="27" y2="53" stroke="url(#pivotChampagneGold)" stroke-width="3.2" stroke-linecap="round"/>
  <rect x="22.5" y="17" width="9" height="27" rx="2.5" fill="url(#pivotChampagneGold)"/>
  <path d="M27 17.5 H41 C47.8 17.5 52.5 21.8 52.5 28 C52.5 34.2 47.8 38.5 41 38.5 H27" fill="none" stroke="url(#pivotChampagneGold)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15 44 Q28 41 37 27 L50 14" fill="none" stroke="#FFF7D6" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M42.5 14 H50 V21.5" fill="none" stroke="#FFF7D6" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="37" cy="27" r="3" fill="#00C261" stroke="#FFF7D6" stroke-width="1.3"/>
</svg>`;
