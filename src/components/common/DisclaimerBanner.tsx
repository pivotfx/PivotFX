import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, ExternalLink } from 'lucide-react';

interface DisclaimerBannerProps {
  onLearnMore?: () => void;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ onLearnMore }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950/70 via-red-950/60 to-slate-950 border-b border-amber-500/25 px-4 py-2 text-xs text-amber-200/90 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 shrink-0">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <p className="truncate">
            <strong className="text-amber-300 font-semibold">Educational Project from Gilgil, Kenya:</strong>{' '}
            Unregistered & not licensed by CMA. Forex carries high risk; 70–80% of retail accounts lose capital. FXPesa is CMA-licensed; HFM & FBS are offshore.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="text-amber-300 underline font-semibold hover:text-white transition flex items-center gap-1"
            >
              Risk Details <ExternalLink className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded text-amber-400/80 hover:text-white hover:bg-amber-900/40 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
