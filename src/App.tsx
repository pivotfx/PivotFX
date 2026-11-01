/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageTab, CurrencyPair, Timeframe, JournalTrade } from './types';
import { SAMPLE_INITIAL_JOURNAL } from './data/forexData';
import { Navbar } from './components/common/Navbar';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Footer } from './components/common/Footer';
import { DownloadLogoModal } from './components/common/DownloadLogoModal';
import { RiskDisclaimerModal } from './components/common/RiskDisclaimerModal';

// Pages
import { StartHerePage } from './pages/StartHerePage';
import { SuperAnalysisPage } from './pages/SuperAnalysisPage';
import { TradingViewPage } from './pages/TradingViewPage';
import { ScannerPage } from './pages/ScannerPage';
import { MasterclassPage } from './pages/MasterclassPage';
import { BrokerHubPage } from './pages/BrokerHubPage';
import { JournalPage } from './pages/JournalPage';
import { TrustLegalPage } from './pages/TrustLegalPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('start-here');

  // Risk Disclaimer Modal State (First visit check)
  const [showRiskModal, setShowRiskModal] = useState<boolean>(() => {
    return localStorage.getItem('pivotfx_risk_accepted') !== 'true';
  });

  // Logo & Favicon Download Modal State
  const [showLogoModal, setShowLogoModal] = useState(false);

  // Kill Switch State (locked until unix ms timestamp)
  const [killSwitchUntil, setKillSwitchUntil] = useState<number | null>(() => {
    const saved = localStorage.getItem('pivotfx_killswitch_until');
    if (saved) {
      const time = parseInt(saved, 10);
      if (time > Date.now()) return time;
    }
    return null;
  });

  // Trade Journal state
  const [trades, setTrades] = useState<JournalTrade[]>(() => {
    try {
      const saved = localStorage.getItem('pivotfx_journal_trades');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return SAMPLE_INITIAL_JOURNAL;
  });

  // XP Points Gamification State
  const [xpPoints, setXpPoints] = useState<number>(() => {
    const saved = localStorage.getItem('pivotfx_user_xp');
    return saved ? parseInt(saved, 10) : 150;
  });

  // Cross-page Scanner state transfer
  const [scannerInitialPair, setScannerInitialPair] = useState<CurrencyPair>('GBP/USD');
  const [scannerInitialTimeframe, setScannerInitialTimeframe] = useState<Timeframe>('M15');

  // Persist trades
  useEffect(() => {
    localStorage.setItem('pivotfx_journal_trades', JSON.stringify(trades));
  }, [trades]);

  // Persist XP
  useEffect(() => {
    localStorage.setItem('pivotfx_user_xp', xpPoints.toString());
  }, [xpPoints]);

  // Persist Kill Switch
  useEffect(() => {
    if (killSwitchUntil) {
      localStorage.setItem('pivotfx_killswitch_until', killSwitchUntil.toString());
    } else {
      localStorage.removeItem('pivotfx_killswitch_until');
    }
  }, [killSwitchUntil]);

  const handleAcceptRisk = () => {
    localStorage.setItem('pivotfx_risk_accepted', 'true');
    setShowRiskModal(false);
  };

  const handleAwardXp = (amount: number, reason: string) => {
    setXpPoints((prev) => prev + amount);
  };

  const handleSetKillSwitch = (hours: number = 1) => {
    const unlockTime = Date.now() + hours * 3600 * 1000;
    setKillSwitchUntil(unlockTime);
    alert(`🛑 1-Hour Anti-Revenge Kill Switch Activated! You are locked out of high-risk actions until ${new Date(unlockTime).toLocaleTimeString('en-GB')}. Take a break, walk outside in Gilgil, and breathe.`);
  };

  const handleClearKillSwitch = () => {
    setKillSwitchUntil(null);
    alert('Kill switch disengaged. Remember the $2 rule before executing any order.');
  };

  const handleAddTrade = (newTradeData: Omit<JournalTrade, 'id' | 'timestamp'>) => {
    const newTrade: JournalTrade = {
      ...newTradeData,
      id: `tr-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('en-GB', {
        timeZone: 'Africa/Nairobi',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' EAT',
    };
    setTrades([newTrade, ...trades]);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
  };

  const handleSendToScanner = (pair: CurrencyPair, timeframe: Timeframe) => {
    setScannerInitialPair(pair);
    setScannerInitialTimeframe(timeframe);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-[#00C261]/25 selection:text-[#00C261]">
      {/* 1. Mandatory Top Educational & Risk Disclaimer Banner */}
      <DisclaimerBanner onLearnMore={() => setShowRiskModal(true)} />

      {/* 2. Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        killSwitchUntil={killSwitchUntil}
        xpPoints={xpPoints}
        onOpenLogoModal={() => setShowLogoModal(true)}
      />

      {/* 3. Main Body Container with the 8 Crucial Pages */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'start-here' && (
          <StartHerePage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'super-analysis' && (
          <SuperAnalysisPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogTrade={handleAddTrade}
            killSwitchUntil={killSwitchUntil}
            onSetKillSwitch={handleSetKillSwitch}
            onClearKillSwitch={handleClearKillSwitch}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'tradingview' && (
          <TradingViewPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSendToScanner={handleSendToScanner}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'ai-scanner' && (
          <ScannerPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogTrade={handleAddTrade}
            onAwardXp={handleAwardXp}
            initialPair={scannerInitialPair}
            initialTimeframe={scannerInitialTimeframe}
          />
        )}

        {activeTab === 'masterclass' && (
          <MasterclassPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'brokers' && (
          <BrokerHubPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'journal' && (
          <JournalPage
            trades={trades}
            onAddTrade={handleAddTrade}
            onDeleteTrade={handleDeleteTrade}
            xpPoints={xpPoints}
            onAwardXp={handleAwardXp}
          />
        )}

        {activeTab === 'trust-legal' && (
          <TrustLegalPage
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRiskModal={() => setShowRiskModal(true)}
          />
        )}
      </main>

      {/* 4. Footer with Deriv separator banner, legal links, and GitHub Pages ready guidance */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogoModal={() => setShowLogoModal(true)}
        onOpenRiskModal={() => setShowRiskModal(true)}
      />

      {/* 5. Modals */}
      <RiskDisclaimerModal isOpen={showRiskModal} onAccept={handleAcceptRisk} />
      <DownloadLogoModal isOpen={showLogoModal} onClose={() => setShowLogoModal(false)} />
    </div>
  );
}
