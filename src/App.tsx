/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageTab } from './types';
import { PILLARS_MASTERCLASS_DATA } from './data/pillarsMasterclassData';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DownloadLogoModal } from './components/common/DownloadLogoModal';
import { LandingPage } from './pages/LandingPage';
import { PillarMasterclassPage } from './pages/PillarMasterclassPage';

export default function App() {
  // Initialize route from URL hash or path, defaulting to 'landing'
  const [activeTab, setActiveTab] = useState<PageTab>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname;
      const target = hash || path;
      const validPillar = PILLARS_MASTERCLASS_DATA.find((p) => p.id === target || p.route === target);
      if (validPillar) return validPillar.id;
    } catch {
      // fallback
    }
    return 'landing';
  });

  const [showLogoModal, setShowLogoModal] = useState(false);

  // Kill Switch state (locked until unix timestamp)
  const [killSwitchUntil, setKillSwitchUntil] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_killswitch_until');
      if (saved) {
        const time = parseInt(saved, 10);
        if (time > Date.now()) return time;
      }
    } catch {
      // fallback
    }
    return null;
  });

  // Audio click sound
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
    } catch {
      // fallback
    }
  };

  // Synchronize route changes
  const handleSelectTab = (tab: PageTab) => {
    playClickSound();
    setActiveTab(tab);
    if (tab === 'landing') {
      window.history.pushState(null, '', '#/');
    } else {
      window.history.pushState(null, '', `#${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to popstate (browser back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      const validPillar = PILLARS_MASTERCLASS_DATA.find((p) => p.id === hash || p.route === hash);
      if (validPillar) {
        setActiveTab(validPillar.id);
      } else {
        setActiveTab('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Find active pillar if not on landing
  const activePillar = PILLARS_MASTERCLASS_DATA.find((p) => p.id === activeTab);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      {/* 1. Top Navbar with Logo, Navigation Links, and EAT Session Clock */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        killSwitchUntil={killSwitchUntil}
        onOpenLogoModal={() => setShowLogoModal(true)}
      />

      {/* 2. Main Workstation Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'landing' || !activePillar ? (
          <LandingPage onSelectPillar={handleSelectTab} />
        ) : (
          <PillarMasterclassPage
            pillar={activePillar}
            onBackToLanding={() => handleSelectTab('landing')}
            onNavigatePillar={handleSelectTab}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenLogoModal={() => setShowLogoModal(true)}
      />

      {/* 4. Logo Modal */}
      <DownloadLogoModal isOpen={showLogoModal} onClose={() => setShowLogoModal(false)} />
    </div>
  );
}
