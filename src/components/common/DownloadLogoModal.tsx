import React, { useState } from 'react';
import { RAW_LOGO_SVG, Logo } from './Logo';
import { Download, Copy, Check, X, Image as ImageIcon } from 'lucide-react';

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
    link.download = 'pivotfx-prop-firm-logo.svg';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0F172A] border border-[#D4AF37]/40 shadow-2xl p-6 sm:p-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">PivotFx Institutional Brand Kit</h3>
            <p className="text-xs text-slate-400">Official Precision Crest — Twin Candlesticks, Fibonacci Reticle &amp; Breakout Vector</p>
          </div>
        </div>

        {/* Logo Preview */}
        <div className="p-6 rounded-2xl bg-[#080C14] border border-slate-800 flex items-center justify-center">
          <Logo size="lg" />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadSvg}
            className="w-full py-3 rounded-xl btn-gold text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Vector SVG</span>
          </button>

          <button
            onClick={handleCopySvg}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            {copiedSvg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
            <span>{copiedSvg ? 'SVG Code Copied!' : 'Copy Raw SVG Code'}</span>
          </button>
        </div>

        {/* Favicon HTML */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Favicon Link Tag:</span>
            <button
              onClick={handleCopyFavicon}
              className="text-[#D4AF37] hover:underline flex items-center gap-1 font-bold"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-[10px] font-mono text-slate-500 truncate overflow-x-auto">
            {faviconSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
