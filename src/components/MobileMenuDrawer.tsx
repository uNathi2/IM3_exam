import React, { useEffect } from 'react';
import { MagazinePage, WeatherAtmosphere } from '../types';
import { X, ArrowRight, Bookmark, Sliders, Send, FileText } from 'lucide-react';
import { AetherLogo } from './AetherLogo';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: MagazinePage;
  onNavigate: (view: MagazinePage) => void;
  onOpenIssues: () => void;
  onOpenCreators: () => void;
  onOpenAbout: () => void;
  onOpenSubmit: () => void;
  onOpenSimulator: () => void;
  onOpenSaved: () => void;
  onOpenResearch: () => void;
  savedCount: number;
  atmosphere: WeatherAtmosphere;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenIssues,
  onOpenCreators,
  onOpenAbout,
  onOpenSubmit,
  onOpenSimulator,
  onOpenSaved,
  onOpenResearch,
  savedCount,
  atmosphere,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/45"
    >
      <div
        className="relative w-full max-w-sm h-full bg-white border-l border-zinc-200 shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top brand & close */}
        <div>
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-[#fafafa]">
            <AetherLogo size="sm" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-6 space-y-3 text-sm font-mono-custom">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('cover');
              }}
              className={`w-full text-left py-2.5 px-3 flex items-center justify-between border transition-colors cursor-pointer ${
                currentView === 'cover'
                  ? 'bg-purple-50 border-purple-700 text-black font-semibold'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black hover:border-black'
              }`}
            >
              <span>01. Magazine Cover</span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('feature');
              }}
              className={`w-full text-left py-2.5 px-3 flex items-center justify-between border transition-colors cursor-pointer ${
                currentView === 'feature'
                  ? 'bg-purple-50 border-purple-700 text-black font-semibold'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black hover:border-black'
              }`}
            >
              <span>02. Feature: Signal & Noise</span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenIssues();
              }}
              className={`w-full text-left py-2.5 px-3 flex items-center justify-between border transition-colors cursor-pointer ${
                currentView === 'issues'
                  ? 'bg-purple-50 border-purple-700 text-black font-semibold'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black hover:border-black'
              }`}
            >
              <span>03. Issues Archive</span>
              <ArrowRight className={`w-4 h-4 ${currentView === 'issues' ? 'text-purple-700' : 'text-zinc-500'}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCreators();
              }}
              className={`w-full text-left py-2.5 px-3 flex items-center justify-between border transition-colors cursor-pointer ${
                currentView === 'creators'
                  ? 'bg-purple-50 border-purple-700 text-black font-semibold'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black hover:border-black'
              }`}
            >
              <span>04. Creators & Mission</span>
              <ArrowRight className={`w-4 h-4 ${currentView === 'creators' ? 'text-purple-700' : 'text-zinc-500'}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAbout();
              }}
              className="w-full text-left py-2.5 px-3 bg-white border border-zinc-200 text-zinc-700 hover:text-black hover:border-black flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>05. Editorial Mission</span>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenResearch();
              }}
              className="w-full text-left py-2.5 px-3 bg-purple-50/60 border border-purple-300 text-purple-900 hover:border-purple-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-purple-700" />
                <span>Research Dossier</span>
              </span>
              <ArrowRight className="w-4 h-4 text-purple-700" />
            </button>
          </nav>
        </div>

        {/* Bottom Utility & Actions */}
        <div className="p-6 border-t border-zinc-200 bg-[#fafafa] space-y-3 font-mono-custom text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSaved();
            }}
            className="w-full py-2 px-3 bg-white border border-zinc-300 text-zinc-800 hover:border-black flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-purple-700" />
              <span>Saved Collection</span>
            </span>
            <span className="tabular-nums text-purple-700 font-semibold text-xs">{savedCount}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSimulator();
            }}
            className="w-full py-2 px-3 bg-white border border-zinc-300 text-zinc-800 hover:border-black flex items-center justify-between cursor-pointer"
          >
            <span>JHB Sky: {atmosphere.temperature}°C · {atmosphere.conditionLabel}</span>
            <Sliders className="w-3.5 h-3.5 text-amber-700" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSubmit();
            }}
            className="w-full py-2.5 bg-black text-white font-semibold hover:bg-zinc-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Work ↗</span>
          </button>

          <div className="text-[10px] text-zinc-500 text-center pt-1">
            aetherside.mag · Issue 001 · 2026
          </div>
        </div>
      </div>
    </div>
  );
};
