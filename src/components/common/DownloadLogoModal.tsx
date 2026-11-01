import React, { useState } from 'react';
import { RAW_LOGO_SVG, Logo } from './Logo';
import { Download, Copy, Check, X, Code, Image as ImageIcon } from 'lucide-react';

interface DownloadLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadLogoModal: React.FC<DownloadLogoModalProps> = ({ isOpen, onClose }) => {
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  if (!isOpen) return null;

  const handleDownloadSvg = () => {
    const blob = new Blob([RAW_LOGO_SVG], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pivotfx-lab-logo.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(RAW_LOGO_SVG);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const faviconSnippet = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(RAW_LOGO_SVG)}" />`;

  const handleCopyFavicon = () => {
    navigator.clipboard.writeText(faviconSnippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#111827] border border-slate-700/80 shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#00C261]/15 text-[#00C261] border border-[#00C261]/30">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">PivotFX Lab Brand Assets</h3>
            <p className="text-xs text-slate-400">Official Candlestick P + Momentum Arrow (M-Pesa Green #00C261)</p>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex flex-col items-center justify-center p-8 my-4 rounded-xl bg-[#0B0F17] border border-slate-800 text-center">
          <Logo size="xl" showText={true} showBadge={true} />
          <p className="text-xs text-slate-500 mt-4">
            Vector SVG ready for GitHub repo, Favicon, MT4 templates, or Telegram community.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleDownloadSvg}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#00C261] text-black font-bold hover:bg-[#00dc6e] transition shadow-lg shadow-[#00C261]/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download SVG
          </button>
          <button
            onClick={handleCopySvg}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 border border-slate-700 transition active:scale-95"
          >
            {copiedSvg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedSvg ? 'Copied SVG!' : 'Copy SVG Raw'}
          </button>
        </div>

        {/* HTML Favicon snippet */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" /> Favicon HTML Link
            </span>
            <button
              onClick={handleCopyFavicon}
              className="text-[#00C261] hover:underline flex items-center gap-1"
            >
              {copiedHtml ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className="text-[11px] font-mono text-slate-300 truncate">
            {faviconSnippet}
          </p>
        </div>
      </div>
    </div>
  );
};
