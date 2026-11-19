import React, { useEffect, useState } from 'react';
import { TouchDesignerStudy } from '../types';
import { StudyGraphic } from './StudyGraphic';
import { isItemSaved, toggleSaveItem } from '../services/bookmarkService';
import { X, Copy, Check, Sliders, Layers, Bookmark } from 'lucide-react';

interface StudyDetailModalProps {
  study: TouchDesignerStudy | null;
  onClose: () => void;
}

export const StudyDetailModal: React.FC<StudyDetailModalProps> = ({ study, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(study ? isItemSaved(study.id) : false);

  useEffect(() => {
    if (study) {
      setIsSaved(isItemSaved(study.id));
    }
  }, [study]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!study) return null;

  const handleCopyParams = () => {
    navigator.clipboard.writeText(JSON.stringify(study.parameters, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45"
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-zinc-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#fafafa]">
          <div className="flex items-center gap-2.5 text-sm sm:text-base font-mono-custom">
            <span className="text-xs text-purple-700 font-semibold">{study.code}</span>
            <span className="text-zinc-300">·</span>
            <h2 className="font-semibold text-black tracking-wider">
              {study.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close study inspector"
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual Preview */}
          <div className="relative aspect-video w-full border border-zinc-200 overflow-hidden bg-white">
            <StudyGraphic
              type={study.svgVisualType}
              src={study.src}
              videoSrc={study.videoSrc}
              lightGround={study.lightGround}
              alt={study.title}
              className="w-full h-full"
            />
            <div className="absolute bottom-3 left-3 text-[11px] font-mono-custom text-white bg-black/85 px-2.5 py-1 border border-zinc-700">
              {study.parameters.resolution}
            </div>
          </div>

          {/* Description & Curatorial Statement */}
          <div>
            <h3 className="text-xs font-mono-custom uppercase tracking-wider text-zinc-500 mb-1">
              Curatorial Observation
            </h3>
            <p className="text-sm font-serif-editorial text-zinc-800 leading-relaxed">
              {study.description}
            </p>
          </div>

          {/* TouchDesigner Operator Pipeline */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-zinc-500 mb-2">
              <Layers className="w-3.5 h-3.5 text-purple-700" />
              <span>Operator Graph Pipeline</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-mono-custom text-xs">
              {study.operatorChain.map((op, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-2.5 py-1.5 bg-[#fafafa] border border-zinc-300 text-black">
                    {op}
                  </div>
                  {idx < study.operatorChain.length - 1 && (
                    <span className="text-purple-700 font-bold">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Parameters Grid */}
          <div className="bg-[#fafafa] border border-zinc-200 p-4">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono-custom uppercase tracking-wider text-zinc-600">
                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                <span>Active Parameters</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (study) {
                      toggleSaveItem({
                        id: study.id,
                        title: study.title,
                        type: 'study',
                        subtitle: `${study.category} · ${study.parameters.particleCount}`,
                      });
                      setIsSaved(!isSaved);
                    }
                  }}
                  className={`flex items-center gap-1.5 text-[11px] font-mono-custom px-2.5 py-1 border transition-colors cursor-pointer ${
                    isSaved
                      ? 'bg-purple-700 border-purple-700 text-white'
                      : 'border-zinc-300 bg-white text-zinc-700 hover:text-black'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Saved' : 'Save Study'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyParams}
                  className="flex items-center gap-1.5 text-[11px] font-mono-custom text-zinc-600 hover:text-black transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Parameters'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-custom">
              {Object.entries(study.parameters).map(([key, val]) => (
                <div key={key} className="bg-white p-2.5 border border-zinc-200">
                  <div className="text-[10px] uppercase text-zinc-500 mb-0.5">{key}</div>
                  <div className="text-black font-semibold">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#fafafa] border-t border-zinc-200 flex items-center justify-between text-xs font-mono-custom text-zinc-600">
          <div>Category: <span className="text-black font-medium">{study.category}</span></div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
