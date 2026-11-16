import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CurrencyPair, PageTab } from '../../types';
import { PILLARS_MASTERCLASS_DATA } from '../../data/pillarsMasterclassData';
import { MarketScanData, globalLiveStream } from '../../utils/liveMarketEngine';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Camera,
  ClipboardList,
  Compass,
  Home,
  Search,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageTab) => void;
  onOpenPair: (pair: CurrencyPair) => void;
}

interface PaletteEntry {
  id: string;
  group: 'Live Markets' | 'Execution Tools' | 'Academy Pillars';
  title: string;
  subtitle: string;
  searchKeywords: string;
  rightMetric?: string;
  rightMetricTone?: 'BUY' | 'SELL' | 'NEUTRAL';
  badgeText?: string;
  icon: React.ReactNode;
  onExecute: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenPair
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [markets, setMarkets] = useState<MarketScanData[]>(() => globalLiveStream.getState().markets);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(0);
    setMarkets(globalLiveStream.getState().markets);
    const unsub = globalLiveStream.subscribe((state) => {
      setMarkets(state.markets);
    });
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [isOpen]);

  const entries = useMemo<PaletteEntry[]>(() => {
    const q = query.trim().toLowerCase();

    const marketItems: PaletteEntry[] = markets.map((m) => {
      const isBuy = m.bias === 'STRONG_BUY';
      const isSell = m.bias === 'STRONG_SELL';
      const pctSign = m.change24hPct >= 0 ? '+' : '';
      return {
        id: `mkt-${m.pair}`,
        group: 'Live Markets',
        title: m.pair,
        subtitle: `${m.recommendedStrategy || m.patternType} · ${m.recommendedTf} · ADX ${(m.adxStrength ?? 21).toFixed(0)}`,
        searchKeywords: `${m.pair} ${m.symbol} ${m.tvSymbol || ''} ${m.trendDirection} ${isBuy ? 'buy long' : isSell ? 'sell short' : 'chop'} ${m.recommendedStrategy || ''}`.toLowerCase(),
        rightMetric: `${m.price} (${pctSign}${m.change24hPct.toFixed(2)}%)`,
        rightMetricTone: isBuy ? 'BUY' : isSell ? 'SELL' : 'NEUTRAL',
        badgeText: isBuy ? 'BUY' : isSell ? 'SELL' : 'RANGE',
        icon: isBuy ? (
          <TrendingUp className="w-4 h-4 text-[#00C261]" />
        ) : isSell ? (
          <TrendingDown className="w-4 h-4 text-red-400" />
        ) : (
          <BarChart3 className="w-4 h-4 text-amber-300" />
        ),
        onExecute: () => {
          onOpenPair(m.pair);
          onClose();
        }
      };
    });

    const toolItems: PaletteEntry[] = [
      {
        id: 'tool-camera',
        group: 'Execution Tools',
        title: 'Camera & Screenshot Chart OCR Scanner',
        subtitle: 'Snap MT4/TradingView photo or paste screenshot for Gemini AI setup extraction',
        searchKeywords: 'camera screenshot ocr upload paste photo gemini vision scan chart',
        icon: <Camera className="w-4 h-4 text-[#D4AF37]" />,
        onExecute: () => {
          onClose();
          globalLiveStream.requestOpenScannerView('camera');
        }
      },
      {
        id: 'tool-tradelog',
        group: 'Execution Tools',
        title: 'Active Broker Orders & Real Suggested Trade Log',
        subtitle: 'Monitor floating P&L, trail SL to Breakeven/+55%, and consult Position Coach',
        searchKeywords: 'trade log active orders position coach breakeven pnl history broker',
        icon: <ClipboardList className="w-4 h-4 text-[#00C261]" />,
        onExecute: () => {
          onClose();
          globalLiveStream.requestOpenScannerView('trade_log');
        }
      },
      {
        id: 'tool-ticket',
        group: 'Execution Tools',
        title: 'Live Execution Ticket & Dynamic Risk Calculator',
        subtitle: 'Calibrate lots, SL, TP1-TP3 & check portfolio USD correlation risk',
        searchKeywords: 'order ticket risk calculator lots sl tp dynamic size correlation',
        icon: <BarChart3 className="w-4 h-4 text-cyan-300" />,
        onExecute: () => {
          onClose();
          globalLiveStream.requestOpenScannerView('favorable_chart');
        }
      },
      {
        id: 'tool-advisor',
        group: 'Execution Tools',
        title: 'Institutional AI Market Advisor Chat',
        subtitle: 'Ask about live pair setups, Gilgil $2 shield, session timing, or NFP protocol',
        searchKeywords: 'advisor ai chat assistant question confluence setups',
        icon: <Bot className="w-4 h-4 text-[#D4AF37]" />,
        onExecute: () => {
          onClose();
          globalLiveStream.requestOpenScannerView('advisor');
        }
      }
    ];

    const pillarItems: PaletteEntry[] = [
      {
        id: 'nav-landing',
        group: 'Academy Pillars',
        title: 'Home — Institutional Prop Desk Hub',
        subtitle: 'Session macro directive, top trending mover, and 9 academy pillars',
        searchKeywords: 'home landing dashboard main desk',
        icon: <Home className="w-4 h-4 text-[#D4AF37]" />,
        onExecute: () => {
          onSelectTab('landing');
          onClose();
        }
      },
      ...PILLARS_MASTERCLASS_DATA.map((p) => ({
        id: `pillar-${p.id}`,
        group: 'Academy Pillars' as const,
        title: `Pillar ${p.number}: ${p.title}`,
        subtitle: `${p.category} · ${p.lessons.length} Lessons`,
        searchKeywords: `pillar ${p.number} ${p.title} ${p.category} ${p.badge} ${p.oneLineHook}`.toLowerCase(),
        icon: <Compass className="w-4 h-4 text-[#D4AF37]" />,
        onExecute: () => {
          onSelectTab(p.id);
          onClose();
        }
      }))
    ];

    const all = [...marketItems, ...toolItems, ...pillarItems];
    if (!q) {
      // Show top 6 markets + tools + pillars cleanly when query is empty
      return [...marketItems.slice(0, 6), ...toolItems, ...pillarItems];
    }
    return all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.searchKeywords.includes(q)
    );
  }, [markets, query, onClose, onOpenPair, onSelectTab]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (entries.length ? (prev + 1) % entries.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (entries.length ? (prev - 1 + entries.length) % entries.length : 0));
      } else if (e.key === 'Enter' && entries[activeIndex]) {
        e.preventDefault();
        entries[activeIndex].onExecute();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, entries, activeIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Quick Market and Pillar Command Palette"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#0A101D] border border-[#D4AF37]/55 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any market (EUR/USD, XAU/USD, BTC), Pillar 01–09, Camera OCR, or Trade Log..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-mono"
            aria-label="Close quick jump"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {entries.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 font-mono">
              No markets, tools, or pillars matched &ldquo;{query}&rdquo;.
            </div>
          ) : (
            entries.map((item, idx) => {
              const isSelected = idx === activeIndex;
              const prevGroup = idx > 0 ? entries[idx - 1].group : null;
              return (
                <React.Fragment key={item.id}>
                  {item.group !== prevGroup && (
                    <div className="px-3 pt-2.5 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      {item.group}
                    </div>
                  )}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={item.onExecute}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition ${
                      isSelected
                        ? 'bg-[#131D33] border border-[#D4AF37]/50 text-white'
                        : 'border border-transparent text-slate-300 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{item.title}</span>
                          {item.badgeText && (
                            <span
                              className={`text-[10px] font-mono font-black ${
                                item.rightMetricTone === 'BUY'
                                  ? 'text-[#00C261]'
                                  : item.rightMetricTone === 'SELL'
                                  ? 'text-red-400'
                                  : 'text-amber-300'
                              }`}
                            >
                              {item.badgeText}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums">
                      {item.rightMetric && (
                        <span
                          className={`text-xs font-bold ${
                            item.rightMetricTone === 'BUY'
                              ? 'text-[#00C261]'
                              : item.rightMetricTone === 'SELL'
                              ? 'text-red-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {item.rightMetric}
                        </span>
                      )}
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'text-[#D4AF37] translate-x-0.5' : 'text-slate-600'
                        }`}
                      />
                    </div>
                  </button>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-[#070B14] border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Use ↑ ↓ arrows to navigate · Enter to launch · Esc to close</span>
          <span className="text-[#D4AF37]">Live 1s Interbank Sync</span>
        </div>
      </div>
    </div>
  );
};
