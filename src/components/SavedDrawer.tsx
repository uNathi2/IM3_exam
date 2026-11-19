import React, { useEffect, useState } from 'react';
import { SavedItem, getSavedItems, toggleSaveItem, clearSavedItems } from '../services/bookmarkService';
import { Bookmark, X, Trash2, ArrowUpRight, Clock, Info } from 'lucide-react';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudyById?: (id: string) => void;
  onEnterFeature?: () => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  onOpenStudyById,
  onEnterFeature,
}) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const refreshItems = () => {
    setSavedItems(getSavedItems());
  };

  useEffect(() => {
    refreshItems();
    const handleUpdate = () => refreshItems();
    window.addEventListener('aetherside_saved_updated', handleUpdate);
    return () => window.removeEventListener('aetherside_saved_updated', handleUpdate);
  }, []);

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
        className="relative w-full max-w-md h-full bg-white border-l border-zinc-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-[#fafafa]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm font-mono-custom font-semibold text-black tracking-wider uppercase">
              Saved Studies ({savedItems.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved drawer"
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Guidance Banner */}
        <div className="p-4 bg-[#fafafa] border-b border-zinc-200 text-[11px] font-mono-custom text-zinc-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Saved studies and articles remain in local browser storage across sessions for cross-referencing parameters and notes.
          </p>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-zinc-400 mx-auto stroke-[1.5]" />
              <div className="text-sm font-serif-editorial text-zinc-800">
                Your Studio Collection is empty.
              </div>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed font-sans">
                Click "Save study" on any TouchDesigner experiment or editorial article to pin it here for deep examination.
              </p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white border border-zinc-200 hover:border-black transition-colors group flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono-custom text-zinc-500 uppercase tracking-widest mb-1">
                    <span className="text-purple-700 font-medium">{item.type}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-mono-custom font-semibold text-black group-hover:text-purple-700 transition-colors">
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="text-xs text-zinc-600 font-sans mt-1 line-clamp-2">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs font-mono-custom">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (item.type === 'study') {
                        onOpenStudyById?.(item.id);
                      } else {
                        onEnterFeature?.();
                      }
                    }}
                    className="text-purple-700 hover:text-black flex items-center gap-1 underline cursor-pointer"
                  >
                    <span>Inspect item</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSaveItem(item)}
                    className="text-zinc-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    title="Remove from saved list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedItems.length > 0 && (
          <div className="p-4 border-t border-zinc-200 bg-[#fafafa] flex items-center justify-between text-xs font-mono-custom">
            <button
              type="button"
              onClick={clearSavedItems}
              className="text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Clear all saved items
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
