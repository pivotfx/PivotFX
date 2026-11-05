import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { fetchLiveMarketSnapshot, INITIAL_MARKETS_DATA } from '../../utils/liveMarketEngine';

interface TickerItem {
  pair: string;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  direction: 'up' | 'down';
  decimals: number;
}

const toTickerItems = (markets: typeof INITIAL_MARKETS_DATA): TickerItem[] => {
  const priorityPairs = ['GBP/USD', 'EUR/USD', 'XAU/USD', 'USD/JPY', 'GBP/JPY', 'AUD/USD'];
  return priorityPairs.map((pairName) => {
    const m = markets.find((x) => x.pair === pairName) || markets[0];
    const isJpy = m.pair.includes('JPY');
    const isGold = m.pair.includes('XAU');
    const decimals = isJpy ? 3 : isGold ? 2 : 5;
    const pipUnit = isJpy ? 0.01 : isGold ? 0.1 : 0.0001;
    const spread = m.spreadByBroker.fxpesa?.spread || 1.1;
    const ask = Number((m.price + spread * pipUnit).toFixed(decimals));
    return {
      pair: m.pair === 'XAU/USD' ? 'XAU/USD (Gold)' : m.pair,
      bid: m.price,
      ask,
      spread,
      change: m.change24hPct,
      direction: m.change24hPct >= 0 ? 'up' : 'down',
      decimals,
    };
  });
};

export const MarketTicker: React.FC = () => {
  const [rates, setRates] = useState<TickerItem[]>(() => toTickerItems(INITIAL_MARKETS_DATA));
  const [liveConnected, setLiveConnected] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const syncTicker = async () => {
      const { markets, liveFeedConnected } = await fetchLiveMarketSnapshot(INITIAL_MARKETS_DATA);
      if (!mounted) return;
      setRates(toTickerItems(markets));
      setLiveConnected(liveFeedConnected);
    };

    syncTicker();
    const interval = setInterval(syncTicker, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full bg-[#080C14] border-b border-slate-800/80 py-2 px-4 overflow-hidden text-xs font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-[#00C261]" />
          <span className="hidden sm:inline uppercase text-[11px] tracking-wider text-slate-400 font-bold">
            {liveConnected ? 'Live Interbank Feed:' : 'Institutional Market Feed:'}
          </span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth tabular-nums">
          {rates.map((item) => (
            <div key={item.pair} className="flex items-center gap-2 shrink-0">
              <span className="text-white font-bold">{item.pair}</span>
              <span
                className={`font-mono font-bold ${
                  item.direction === 'up' ? 'text-[#00C261]' : 'text-red-400'
                }`}
              >
                {item.bid.toFixed(item.decimals)}
              </span>
              <span className="text-[11px] text-slate-400 font-sans">
                ({item.spread}p)
              </span>
              <span
                className={`flex items-center text-[11px] font-bold ${
                  item.change >= 0 ? 'text-[#00C261]' : 'text-red-400'
                }`}
              >
                {item.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {item.change >= 0 ? `+${item.change.toFixed(2)}%` : `${item.change.toFixed(2)}%`}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-[11px] text-slate-400 font-mono">
          <span className="text-[#00C261] font-bold">EAT (UTC+3)</span>
        </div>
      </div>
    </div>
  );
};
