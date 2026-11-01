import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface TickerItem {
  pair: string;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  direction: 'up' | 'down';
}

export const MarketTicker: React.FC = () => {
  const [rates, setRates] = useState<TickerItem[]>([
    { pair: 'EUR/USD', bid: 1.0842, ask: 1.0843, spread: 1.2, change: 0.18, direction: 'up' },
    { pair: 'GBP/USD', bid: 1.2915, ask: 1.2917, spread: 1.4, change: -0.12, direction: 'down' },
    { pair: 'USD/JPY', bid: 153.40, ask: 153.41, spread: 1.3, change: 0.35, direction: 'up' },
    { pair: 'XAU/USD (Gold)', bid: 2742.50, ask: 2742.75, spread: 2.5, change: 0.84, direction: 'up' },
    { pair: 'GBP/JPY', bid: 198.20, ask: 198.23, spread: 2.1, change: -0.22, direction: 'down' },
    { pair: 'AUD/USD', bid: 0.6582, ask: 0.6583, spread: 1.3, change: 0.05, direction: 'up' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRates((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.49) * 0.0004;
          const newBid = Number((item.bid + delta).toFixed(item.pair.includes('JPY') || item.pair.includes('Gold') ? 2 : 4));
          const newAsk = Number((newBid + (item.spread * 0.0001)).toFixed(item.pair.includes('JPY') || item.pair.includes('Gold') ? 2 : 4));
          const newDirection = delta >= 0 ? 'up' : 'down';
          return {
            ...item,
            bid: newBid,
            ask: newAsk,
            direction: newDirection,
          };
        })
      );
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#080C14] border-b border-slate-800/80 py-1.5 px-4 overflow-hidden text-xs font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Ticker Tag */}
        <div className="flex items-center gap-2 shrink-0 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-[#00C261] animate-pulse" />
          <span className="hidden sm:inline uppercase text-[10px] tracking-wider text-slate-400 font-bold">
            Live Interbank Feed:
          </span>
        </div>

        {/* Scrolling / Flex Ticker */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          {rates.map((item) => (
            <div key={item.pair} className="flex items-center gap-2 shrink-0">
              <span className="text-white font-bold">{item.pair}</span>
              <span
                className={`font-mono transition-colors duration-300 ${
                  item.direction === 'up' ? 'text-[#00C261]' : 'text-red-400'
                }`}
              >
                {item.bid.toFixed(item.pair.includes('JPY') || item.pair.includes('Gold') ? 2 : 4)}
              </span>
              <span className="text-[10px] text-slate-400 font-sans">
                ({item.spread}p)
              </span>
              <span
                className={`flex items-center text-[10px] ${
                  item.change >= 0 ? 'text-[#00C261]' : 'text-red-400'
                }`}
              >
                {item.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
              </span>
            </div>
          ))}
        </div>

        {/* EAT Session Tag */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-[11px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00C261] animate-ping" />
          <span className="text-white font-semibold">East Africa Time (EAT)</span>
        </div>
      </div>
    </div>
  );
};
