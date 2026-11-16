/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageTab, PriceAlertRule } from './types';
import { PILLARS_MASTERCLASS_DATA } from './data/pillarsMasterclassData';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { BellRing, ArrowUpRight, X } from 'lucide-react';

const PillarMasterclassPage = lazy(() =>
  import('./pages/PillarMasterclassPage').then((m) => ({ default: m.PillarMasterclassPage }))
);
const DownloadLogoModal = lazy(() =>
  import('./components/common/DownloadLogoModal').then((m) => ({ default: m.DownloadLogoModal }))
);
const CommandPaletteModal = lazy(() =>
  import('./components/common/CommandPaletteModal').then((m) => ({ default: m.CommandPaletteModal }))
);

const DEFAULT_DOCUMENT_TITLE = 'PivotFx — Prop Firm & Forex Academy | Zero to Funded Trader';

export default function App() {
  // Initialize route from URL hash, defaulting to 'landing'
  // FIXED for GitHub Pages /PivotFX/ base path
  const [activeTab, setActiveTab] = useState<PageTab>(() => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').replace(/^\//, '');
      if (hash) {
        const validPillar = PILLARS_MASTERCLASS_DATA.find((p) => p.id === hash || p.route === hash || p.route === `/${hash}`);
        if (validPillar) return validPillar.id;
      }
    } catch {}
    return 'landing';
  });

  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [triggeredAlertToast, setTriggeredAlertToast] = useState<PriceAlertRule | null>(null);
  const [killSwitchUntil, setKillSwitchUntil] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_killswitch_until');
      if (saved) {
        const time = parseInt(saved, 10);
        if (time > Date.now()) return time;
      }
    } catch {}
    return null;
  });

  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch {}
  };

  const handleSelectTab = async (tab: PageTab) => {
    playClickSound();
    if (tab === '/ai-scanner') {
      const pendingPair = window.sessionStorage.getItem('pivotfx_pending_scanner_pair');
      if (!pendingPair) {
        const { globalLiveStream } = await import('./utils/liveMarketEngine');
        globalLiveStream.setSelectedPair(null);
      }
    }
    setActiveTab(tab);
    if (tab === 'landing') {
      window.history.pushState(null, '', '#/');
    } else {
      window.history.pushState(null, '', `#/${tab.replace(/^\//, '')}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPairInScanner = async (pair: any) => {
    playClickSound();
    const { globalLiveStream } = await import('./utils/liveMarketEngine');
    globalLiveStream.setSelectedPair(pair);
    setActiveTab('/ai-scanner');
    window.history.pushState(null, '', '#/ai-scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalShortcut);
    const handleAlertHit = (e: Event) => {
      const rule = (e as CustomEvent<PriceAlertRule>).detail;
      if (rule?.pair) {
        setTriggeredAlertToast(rule);
        setTimeout(() => {
          setTriggeredAlertToast((prev) => (prev?.id === rule.id ? null : prev));
        }, 12000);
      }
    };
    window.addEventListener('pivotfx:price-alert-hit', handleAlertHit);
    return () => {
      window.removeEventListener('keydown', handleGlobalShortcut);
      window.removeEventListener('pivotfx:price-alert-hit', handleAlertHit);
    };
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let active = true;
    import('./utils/liveMarketEngine').then(({ globalLiveStream, computeLiveOrderMetrics }) => {
      if (!active) return;
      const syncTitle = () => {
        const st = globalLiveStream.getState();
        const openOrders = Object.values(st.activeOrders).filter(Boolean);
        if (openOrders.length === 0) {
          document.title = DEFAULT_DOCUMENT_TITLE;
          return;
        }
        let netUsd = 0;
        openOrders.forEach((ord: any) => {
          const mkt = st.markets.find((m) => m.pair === ord.pair);
          const livePrice = mkt ? mkt.price : ord.entryPrice;
          netUsd += computeLiveOrderMetrics(ord, livePrice, mkt?.atrPips).netProfitUsd;
        });
        const sign = netUsd >= 0 ? '+' : '-';
        document.title = `${sign}$${Math.abs(netUsd).toFixed(2)} (${openOrders.length} Active) | PivotFx`;
      };
      syncTitle();
      unsub = globalLiveStream.subscribe(() => syncTitle());
    });
    return () => {
      active = false;
      if (unsub) unsub();
    };
  }, []);

  useEffect(() => {
    const handleOpenScannerView = () => {
      playClickSound();
      setActiveTab('/ai-scanner');
      window.history.pushState(null, '', '#/ai-scanner');
      setTimeout(() => {
        const el = document.getElementById('scanner-tools');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
    };
    window.addEventListener('pivotfx:open-scanner-view', handleOpenScannerView);
    return () => window.removeEventListener('pivotfx:open-scanner-view', handleOpenScannerView);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').replace(/^\//, '');
      if (!hash || hash === '/') {
        setActiveTab('landing');
        return;
      }
      const validPillar = PILLARS_MASTERCLASS_DATA.find((p) => p.id === hash || p.route === hash || p.route === `/${hash}`);
      if (validPillar) {
        setActiveTab(validPillar.id);
      } else {
        setActiveTab('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const activePillar = PILLARS_MASTERCLASS_DATA.find((p) => p.id === activeTab);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        killSwitchUntil={killSwitchUntil}
        onOpenLogoModal={() => setShowLogoModal(true)}
        onOpenQuickJump={() => setShowCommandPalette(true)}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'landing' || !activePillar ? (
          <LandingPage
            onSelectPillar={handleSelectTab}
            onOpenPairWorkspace={handleOpenPairInScanner}
          />
        ) : (
          <Suspense
            fallback={
              <div className="min-h-[55vh] flex items-center justify-center">
                <div className="px-6 py-4 rounded-2xl bg-[#0C1220] border border-[#D4AF37]/40 text-xs font-mono text-[#D4AF37]">
                  Loading Pillar Workstation...
                </div>
              </div>
            }
          >
            <PillarMasterclassPage
              pillar={activePillar}
              onBackToLanding={() => handleSelectTab('landing')}
              onNavigatePillar={handleSelectTab}
            />
          </Suspense>
        )}
      </main>
      <Footer onSelectTab={handleSelectTab} onOpenLogoModal={() => setShowLogoModal(true)} />
      {showLogoModal && (
        <Suspense fallback={null}>
          <DownloadLogoModal isOpen={showLogoModal} onClose={() => setShowLogoModal(false)} />
        </Suspense>
      )}
      {showCommandPalette && (
        <Suspense fallback={null}>
          <CommandPaletteModal
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
            onSelectTab={handleSelectTab}
            onOpenPair={handleOpenPairInScanner}
          />
        </Suspense>
      )}
      {triggeredAlertToast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[110] max-w-sm w-[calc(100%-2.5rem)] rounded-2xl bg-[#0A1322] border-2 border-cyan-400 shadow-2xl p-4 font-mono tabular-nums space-y-2.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-black">
              <BellRing className="w-4 h-4 shrink-0" />
              <span>PRICE ALERT TRIGGERED · {triggeredAlertToast.pair}</span>
            </div>
            <button
              type="button"
              onClick={() => setTriggeredAlertToast(null)}
              className="text-slate-400 hover:text-white transition"
              aria-label="Dismiss price alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-white">{triggeredAlertToast.label}</strong> crossed{' '}
            <strong className="text-[#D4AF37]">
              {triggeredAlertToast.condition === 'ABOVE' ? '≥' : '≤'} {triggeredAlertToast.targetPrice}
            </strong>{' '}
            (Live @ {triggeredAlertToast.triggeredPrice}) at {triggeredAlertToast.triggeredAtEat}.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const pairToOpen = triggeredAlertToast.pair;
                setTriggeredAlertToast(null);
                void handleOpenPairInScanner(pairToOpen);
              }}
              className="flex-1 py-2 px-3 rounded-xl btn-gold text-black font-black text-[11px] inline-flex items-center justify-center gap-1"
            >
              <span>Inspect Chart &amp; Setup</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
