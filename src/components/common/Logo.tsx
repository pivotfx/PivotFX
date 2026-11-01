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
    lg: { icon: 50, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 68, text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Modern Gold Candlestick 'P' + Breakout Arrow Mark */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#080C14] p-1.5 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.22)] hover:border-[#D4AF37] transition-all duration-300 group"
        style={{ width: currentSize.icon + 10, height: currentSize.icon + 10 }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform group-hover:scale-105 transition-transform"
        >
          {/* Subtle radial gold glow */}
          <circle cx="32" cy="32" r="28" fill="#D4AF37" fillOpacity="0.08" />

          {/* Candlestick Spine / Wick of the 'P' */}
          <line
            x1="22"
            y1="8"
            x2="22"
            y2="56"
            stroke="#D4AF37"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Candlestick Real Body forming the solid pillar */}
          <rect
            x="17"
            y="18"
            width="10"
            height="26"
            rx="3"
            fill="url(#goldGradientBody)"
            className="filter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
          />

          {/* Curved Loop of the 'P' in Precision Gold */}
          <path
            d="M22 18 H38 C46.5 18 52 23.5 52 31 C52 38.5 46.5 44 38 44 H22"
            fill="none"
            stroke="url(#goldGradientLoop)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Upward Breakout Arrow bursting through the Pivot Point */}
          <path
            d="M36 28 L50 14 M50 14 L41 14 M50 14 L50 23"
            stroke="#F3E5AB"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Institutional Pivot Node */}
          <circle cx="22" cy="31" r="2.8" fill="#FFF7D6" />

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGradientBody" x1="17" y1="18" x2="27" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F3E5AB" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#AA820A" />
            </linearGradient>
            <linearGradient id="goldGradientLoop" x1="22" y1="18" x2="52" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF2B2" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#8C6B08" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-white ${currentSize.text}`}>
              Pivot<span className="text-gold-gradient">Fx</span>
            </span>
            <span className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-bold px-1.5 py-0.5 rounded text-[9px] tracking-wider uppercase">
              PROP FIRM
            </span>
          </div>

          {showBadge && (
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className={`${currentSize.sub} tracking-wider uppercase font-mono text-[#D4AF37]/90 font-semibold`}>
                Forex Academy • Zero to Funded
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RAW_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256">
  <rect width="64" height="64" rx="16" fill="#080C14"/>
  <circle cx="32" cy="32" r="28" fill="#D4AF37" fill-opacity="0.08"/>
  <line x1="22" y1="8" x2="22" y2="56" stroke="#D4AF37" stroke-width="4" stroke-linecap="round"/>
  <rect x="17" y="18" width="10" height="26" rx="3" fill="#D4AF37"/>
  <path d="M22 18 H38 C46.5 18 52 23.5 52 31 C52 38.5 46.5 44 38 44 H22" fill="none" stroke="#D4AF37" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M36 28 L50 14 M50 14 L41 14 M50 14 L50 23" stroke="#F3E5AB" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="22" cy="31" r="2.8" fill="#FFF7D6"/>
</svg>`;
