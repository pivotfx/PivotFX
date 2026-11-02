# PivotFX Lab — Prop Firm & Forex Academy

> **Zero to Funded Trader** • Modern dark fintech workstation built with gold (`#D4AF37`) accents, glassmorphism, institutional order flow, and real-time AI scanning.

An unregistered educational initiative from **Gilgil, Kenya**, engineered to equip beginners with institutional trading competence, strictly enforcing the **Gilgil $2 Capital Shield** on micro accounts (FXPesa, HFM, FBS).

---

## 🌟 Key Features

### 1. Neat & Clean Independent Landing Page
- Minimalist hero section: *"Zero to Funded Trader"*
- 8 Independent masterclass cards in grid layout
- Isolated masterclass chambers: **No teaching content displayed on the landing page**
- Strictly independent navigation: enter an academy, complete lessons, and return to the Home Portal to enter other pillars.

### 2. Dual AI Market Scanner & Vision OCR Workstation (Pillar 4)
- **Live Camera WebRTC Stream**: Prompts your webcam or phone camera (`navigator.mediaDevices.getUserMedia`) to scan candlestick patterns, 20 EMA, and wick spikes directly off your laptop MT4/MT5 screen with HUD alignment reticles.
- **Required Data Ingestion**: Requires Pair, Timeframe, Broker (FXPesa CMA Kenya, HFM, FBS), EAT Session (London Open 10:00 EAT, NY AM 15:30 EAT), and Current Price before calculating the institutional rating.
- **Institutional AI Market Advisor**: 1-click strategic audits including Gilgil $2 Risk Audit, Session Trap Detector, Revenge Tilt Lockout, and News Spike Protocol, plus custom AI consultation.
- **Direct Trade Logging**: 1-click transfer of scanned setups into Pillar 8 Trade Logger.

### 3. Complete 8 Masterclasses (Zero to Pro)
- **Pillar 1 (`/fx-academy`)**: Global FX mechanics, A-Book STP vs B-Book, currency pairs, pips, lots, spread, leverage, and Interactive Candlestick Lab.
- **Pillar 2 (`/chart-mastery`)**: Live TradingView Studio + step-by-step TradingView & MT4/MT5 sub-card visual tools.
- **Pillar 3 (`/strategy-vault`)**: 5 Institutional setups (Tower Top, 20/50 EMA Trend Bounce, Judas Swing, Fair Value Gap Re-test, Order Block Mitigation) with step-by-step candle playback.
- **Pillar 4 (`/ai-scanner`)**: Live Camera OCR, Quantitative Confluence Scanner, and Institutional AI Advisor.
- **Pillar 5 (`/risk-management`)**: Dynamic lot size calculator enforcing the Gilgil $2 rule, Risk:Reward model, and drawdown compounding simulator.
- **Pillar 6 (`/psychology`)**: 60-Minute Kill Switch lockout against tilt and revenge trading, interactive mindset audit, and trader checklist.
- **Pillar 7 (`/live-pulse`)**: Live EAT session clock, daily institutional bias worksheet, and DXY macro correlation matrix.
- **Pillar 8 (`/growth-lab`)**: Complete trade journal with PnL tracker, weekly performance auditor, mistake bank, and prop firm roadmap ($5k to $100k).

---

## 🚀 Pushing to GitHub & Deploying Live to GitHub Pages

This app is configured to deploy to GitHub Pages with the included GitHub Actions workflow (`.github/workflows/deploy.yml`).

### Step 1: Initialize Git and Commit
```bash
git init
git add .
git commit -m "feat: complete PivotFX Prop Firm & Forex Academy workstation"
```

### Step 2: Push to GitHub Repository
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### Step 3: Enable GitHub Pages in Repo Settings
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
4. Choose the `gh-pages` branch and `/ (root)` folder, then click **Save**.
5. Within 1-2 minutes, your website will be live at:
   `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>/`

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Check TypeScript types
npm run lint

# Build for production
npm run build
```

---

## ⚖️ Disclaimer

*PivotFX Lab is an unregistered educational project from Gilgil, Kenya, created strictly for learning and research purposes. Foreign exchange and CFD trading carries substantial risk of capital loss. Most retail investor accounts lose money. Past performance does not guarantee future results.*
