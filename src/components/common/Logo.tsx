import React, { useId } from 'react';

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
  const uid = useId().replace(/:/g, '');
  const sizeMap = {
    sm: { box: 40, coin: 30, text: 'text-base', sub: 'text-[10px]' },
    md: { box: 52, coin: 38, text: 'text-xl', sub: 'text-[11px]' },
    lg: { box: 72, coin: 52, text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 96, coin: 68, text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const depthHalf = size === 'xl' ? 4.5 : size === 'lg' ? 3.5 : 2.5;

  const frontObsidianId = `pfxObsidian-${uid}`;
  const frontGoldId = `pfxGold-${uid}`;
  const reverseGoldId = `pfxRevGold-${uid}`;
  const quantumCyanId = `pfxCyan-${uid}`;

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* 3D 360° Volumetric Sovereign Gyroscope Medallion */}
      <div
        className="relative flex items-center justify-center shrink-0 pivot-3d-stage"
        style={{ width: currentSize.box, height: currentSize.box }}
      >
        {/* Ambient Vault Glow Behind 3D Sphere */}
        <div
          className="absolute inset-1 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.28)_0%,rgba(56,189,248,0.12)_50%,transparent_75%)] blur-[3px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Outer 3D Tilted Gold Gimbal Ring */}
        <div
          className="absolute inset-0 rounded-full border-[1.5px] border-[#D4AF37]/70 shadow-[0_0_12px_rgba(212,175,55,0.28)] pivot-gimbal-outer pointer-events-none"
          aria-hidden="true"
        >
          <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#FFF7D6] shadow-[0_0_8px_#FFF7D6]" />
          <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-[#D4AF37]" />
        </div>

        {/* Inner Counter-Rotating 3D Quantum Liquidity Ring */}
        <div
          className="absolute inset-[3px] rounded-full border-[1.5px] border-dashed border-cyan-400/75 pivot-gimbal-inner pointer-events-none"
          aria-hidden="true"
        >
          <span className="absolute top-1/2 -right-[3px] -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#00C261] shadow-[0_0_8px_#00C261]" />
          <span className="absolute top-1/2 -left-[2.5px] -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-cyan-300" />
        </div>

        {/* Volumetric Solid 3D Medallion Core (Front + 3 Milled Gold Rim Layers + Engraved Reverse) */}
        <div
          className="relative pivot-coin-3d"
          style={{ width: currentSize.coin, height: currentSize.coin }}
        >
          {/* Metallic Rim Depth Slices (preventing edge-on 2D collapse at 90°/270°) */}
          <div
            className="absolute inset-0 rounded-full border border-[#8C6709] bg-gradient-to-br from-[#6B4F06] via-[#D4AF37] to-[#594104]"
            style={{ transform: `translateZ(${depthHalf * 0.5}px)` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-full border border-[#D4AF37]/80 bg-gradient-to-tr from-[#5C4405] via-[#B89224] to-[#F3E5AB]"
            style={{ transform: 'translateZ(0px)' }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-full border border-[#8C6709] bg-gradient-to-bl from-[#6B4F06] via-[#D4AF37] to-[#594104]"
            style={{ transform: `translateZ(-${depthHalf * 0.5}px)` }}
            aria-hidden="true"
          />

          {/* OBVERSE (FRONT) MEDALLION FACE: Sovereign Pivot Fulcrum & Breakout Vector */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden shadow-[inset_0_1px_4px_rgba(255,247,214,0.45)]"
            style={{
              transform: `translateZ(${depthHalf}px)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <radialGradient id={frontObsidianId} cx="42%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#1B2B4B" />
                  <stop offset="65%" stopColor="#0A101E" />
                  <stop offset="100%" stopColor="#04070D" />
                </radialGradient>
                <linearGradient id={frontGoldId} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF7D6" />
                  <stop offset="45%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8C6709" />
                </linearGradient>
                <linearGradient id={quantumCyanId} x1="12" y1="52" x2="52" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00C261" />
                  <stop offset="55%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#F3E5AB" />
                </linearGradient>
              </defs>

              <circle cx="32" cy="32" r="30.5" fill={`url(#${frontObsidianId})`} stroke={`url(#${frontGoldId})`} strokeWidth="2.4" />
              <circle cx="32" cy="32" r="25" stroke={`url(#${quantumCyanId})`} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />

              {/* Precision Bullish Candle Fulcrum & Geometric P */}
              <line x1="23.5" y1="14" x2="23.5" y2="50" stroke={`url(#${frontGoldId})`} strokeWidth="2.8" strokeLinecap="round" />
              <rect x="19.5" y="19" width="8" height="23.5" rx="2" fill={`url(#${frontGoldId})`} />
              <path
                d="M24 19 H37.5 C43.5 19 47.2 22.8 47.2 28 C47.2 33.2 43.5 37 37.5 37 H24"
                fill="none"
                stroke={`url(#${frontGoldId})`}
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Ascending Institutional Trajectory Vector */}
              <path d="M15 44.5 Q26.5 40.5 34.5 29 L46.5 17" fill="none" stroke="#FFF7D6" strokeWidth="2.3" strokeLinecap="round" />
              <path d="M40 17 H46.5 V23.5" fill="none" stroke="#FFF7D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="34.5" cy="29" r="2.8" fill="#00C261" stroke="#FFF7D6" strokeWidth="1.2" />
            </svg>
          </div>

          {/* REVERSE (BACK) MEDALLION FACE: Minted FX Algorithmic Seal */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden shadow-[inset_0_1px_4px_rgba(56,189,248,0.35)]"
            style={{
              transform: `rotateY(180deg) translateZ(${depthHalf}px)`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id={reverseGoldId} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF7D6" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#7C5A08" />
                </linearGradient>
              </defs>

              <circle cx="32" cy="32" r="30.5" fill="#070C17" stroke={`url(#${reverseGoldId})`} strokeWidth="2.6" />
              <circle cx="32" cy="32" r="24.5" stroke="#38BDF8" strokeWidth="1.1" strokeDasharray="4 2.5" strokeOpacity="0.7" />
              <polygon points="32,12 49,32 32,52 15,32" fill="#0F172A" stroke={`url(#${reverseGoldId})`} strokeWidth="1.6" />
              <text
                x="32"
                y="37.5"
                textAnchor="middle"
                fill="#FFF7D6"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="900"
                fontSize="16"
                letterSpacing="1"
              >
                FX
              </text>
              <circle cx="32" cy="12" r="2" fill="#00C261" />
              <circle cx="32" cy="52" r="2" fill="#38BDF8" />
            </svg>
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight text-white leading-none ${currentSize.text}`}>
              Pivot<span className="text-gold-gradient">Fx</span>
            </span>
          </div>

          {showBadge && (
            <div className="text-slate-400 font-medium mt-0.5 leading-tight">
              <span className={`${currentSize.sub} font-mono text-slate-300 whitespace-nowrap`}>
                Quantitative AI Desk · Real-Time Institutional Precision
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
    <radialGradient id="pfxObsidianCore" cx="42%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#1B2B4B"/>
      <stop offset="65%" stop-color="#0A101E"/>
      <stop offset="100%" stop-color="#04070D"/>
    </radialGradient>
    <linearGradient id="pfxSovereignGold" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF7D6"/>
      <stop offset="45%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#8C6709"/>
    </linearGradient>
    <linearGradient id="pfxQuantumCyan" x1="12" y1="52" x2="52" y2="12" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00C261"/>
      <stop offset="55%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#F3E5AB"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="32" fill="#04070D"/>
  <circle cx="32" cy="32" r="29" fill="url(#pfxObsidianCore)" stroke="url(#pfxSovereignGold)" stroke-width="2.2"/>
  <ellipse cx="32" cy="32" rx="28" ry="12" transform="rotate(-24 32 32)" fill="none" stroke="url(#pfxSovereignGold)" stroke-width="1.2" stroke-opacity="0.8"/>
  <ellipse cx="32" cy="32" rx="28" ry="12" transform="rotate(32 32 32)" fill="none" stroke="url(#pfxQuantumCyan)" stroke-width="1.2" stroke-dasharray="4 3" stroke-opacity="0.8"/>
  <line x1="23.5" y1="14" x2="23.5" y2="50" stroke="url(#pfxSovereignGold)" stroke-width="2.8" stroke-linecap="round"/>
  <rect x="19.5" y="19" width="8" height="23.5" rx="2" fill="url(#pfxSovereignGold)"/>
  <path d="M24 19 H37.5 C43.5 19 47.2 22.8 47.2 28 C47.2 33.2 43.5 37 37.5 37 H24" fill="none" stroke="url(#pfxSovereignGold)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15 44.5 Q26.5 40.5 34.5 29 L46.5 17" fill="none" stroke="#FFF7D6" stroke-width="2.3" stroke-linecap="round"/>
  <path d="M40 17 H46.5 V23.5" fill="none" stroke="#FFF7D6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="34.5" cy="29" r="2.8" fill="#00C261" stroke="#FFF7D6" stroke-width="1.2"/>
</svg>`;
