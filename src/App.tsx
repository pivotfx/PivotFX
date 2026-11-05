/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageTab } from './types';
import { PILLARS_MASTERCLASS_DATA } from './data/pillarsMasterclassData';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';

const PillarMasterclassPage = lazy(() =>
  import('./pages/PillarMasterclassPage').then((m) => ({ default: m.PillarMasterclassPage }))
);
const DownloadLogoModal = lazy(() =>
  import('./components/common/DownloadLogoModal').then((m) => ({ default: m.DownloadLogoModal }))
);

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

  const handleSelectTab = (tab: PageTab) => {
    playClickSound();
    setActiveTab(tab);
    if (tab === 'landing') {
      window.history.pushState(null, '', '#/');
    } else {
      window.history.pushState(null, '', `#/${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPairInScanner = async (pair: any) => {
    const { globalLiveStream } = await import('./utils/liveMarketEngine');
    globalLiveStream.setSelectedPair(pair);
    handleSelectTab('/ai-scanner');
  };

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
    </div>
  );
}
