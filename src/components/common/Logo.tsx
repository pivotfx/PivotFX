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
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Candlestick P + Upward Arrow Mark in M-Pesa Green (#00C261) */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-[#0e1626] to-[#080d14] p-1.5 border border-emerald-500/30 shadow-[0_0_15px_rgba(0,194,97,0.2)] hover:border-[#00C261] transition-all duration-300 group"
        style={{ width: currentSize.icon + 10, height: currentSize.icon + 10 }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform group-hover:scale-105 transition-transform"
        >
          {/* Background subtle glow */}
          <circle cx="32" cy="32" r="28" fill="#00C261" fillOpacity="0.06" />

          {/* Candlestick Stem / Wick of the 'P' */}
          <line
            x1="22"
            y1="8"
            x2="22"
            y2="56"
            stroke="#00C261"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Candlestick Real Body forming the spine of 'P' */}
          <rect
            x="17"
            y="18"
            width="10"
            height="26"
            rx="3"
            fill="#00C261"
            className="filter drop-shadow-[0_0_6px_rgba(0,194,97,0.8)]"
          />

          {/* Curving Loop of the 'P' */}
          <path
            d="M22 18 H38 C46.5 18 52 23.5 52 31 C52 38.5 46.5 44 38 44 H22"
            fill="none"
            stroke="#00C261"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Upward Growth Arrow bursting from the core */}
          <path
            d="M36 28 L48 14 M48 14 L39 14 M48 14 L48 23"
            stroke="#38BDF8"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic Pivot Point Dot */}
          <circle cx="22" cy="31" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-white ${currentSize.text}`}>
              Pivot<span className="text-[#00C261]">FX</span>
            </span>
            <span className="bg-[#00C261]/15 text-[#00C261] border border-[#00C261]/30 font-semibold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
              Lab
            </span>
          </div>

          {showBadge && (
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C261] animate-ping" />
              <span className={`${currentSize.sub} tracking-wide uppercase text-slate-400`}>
                Gilgil, Kenya • Forex Tech
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RAW_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256">
  <rect width="64" height="64" rx="16" fill="#0B0F17"/>
  <circle cx="32" cy="32" r="28" fill="#00C261" fill-opacity="0.08"/>
  <line x1="22" y1="8" x2="22" y2="56" stroke="#00C261" stroke-width="4" stroke-linecap="round"/>
  <rect x="17" y="18" width="10" height="26" rx="3" fill="#00C261"/>
  <path d="M22 18 H38 C46.5 18 52 23.5 52 31 C52 38.5 46.5 44 38 44 H22" fill="none" stroke="#00C261" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M36 28 L48 14 M48 14 L39 14 M48 14 L48 23" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="22" cy="31" r="2.5" fill="#FFFFFF"/>
</svg>`;
