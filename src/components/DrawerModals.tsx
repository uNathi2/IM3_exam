import React, { useEffect } from 'react';
import { CREATOR_DIRECTORY } from '../data/studies';
import { X, ArrowRight, ExternalLink, BookOpen, Users, Compass } from 'lucide-react';
import TypographicTides from './originkit/ui/typographic-tides';

const ARCHIVE_TIDES_TEXT = ['ISSUES ARCHIVE', 'VOLUMES 001 — 003'];
const ARCHIVE_TIDES_FONT: React.CSSProperties = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 800,
  fontSize: '30px',
  lineHeight: '1.05em',
  letterSpacing: '-0.01em',
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFeature?: () => void;
  onOpenSubmit?: () => void;
  onOpen3DBookshelf?: () => void;
}

export const IssuesArchiveModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSelectFeature,
  onOpenSubmit,
  onOpen3DBookshelf,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45"
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-zinc-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#fafafa]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm sm:text-base font-mono-custom font-semibold text-black tracking-wider uppercase">
              Issue Archive
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close issue archive"
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Typographic Tides Modal Hero */}
        <div className="w-full h-24 border-b border-zinc-200 bg-white relative overflow-hidden shrink-0">
          <TypographicTides
            text={ARCHIVE_TIDES_TEXT}
            subtext="AETHERSIDE.MAG · VOLUMES 001 TO 003"
            background="#ffffff"
            textColor="#09090b"
            accent="#7c3aed"
            secondaryColor="#0284c7"
            amplitude={16}
            frequency={0.02}
            speed={1.5}
            layers={3}
            showContourLines={true}
            font={ARCHIVE_TIDES_FONT}
          />
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono-custom">
          {/* Issue 001 */}
          <div className="p-5 bg-[#fafafa] border border-purple-700 relative">
            <div className="flex items-center justify-between text-zinc-500 mb-2 text-[11px]">
              <span className="text-purple-700 font-semibold uppercase tracking-wider">
                Current Issue · October 2026
              </span>
              <span className="text-zinc-500">Issue 001</span>
            </div>
            <h3 className="text-lg font-serif-editorial text-black font-semibold mb-1">
              Another Side of the Signal
            </h3>
            <p className="text-zinc-600 text-xs font-sans leading-relaxed mb-4">
              Exploring recursive video processing, tactile drape memory, and nocturnal long exposures. Featuring Nkosinathi Titus, Noa Vale, and Eli Kade.
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
              <span className="text-zinc-500 text-[11px]">3 Features · 14 Studies</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectFeature?.();
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-black text-white font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>Read Feature 01</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Issue 002 */}
          <div className="p-5 bg-white border border-zinc-200">
            <div className="flex items-center justify-between text-zinc-500 mb-2 text-[11px]">
              <span className="text-zinc-700 uppercase tracking-wider">
                Curatorial Docket · November 2026
              </span>
              <span className="text-zinc-500">Issue 002</span>
            </div>
            <h3 className="text-lg font-serif-editorial text-black mb-1">
              Residual Matter & Tactile Echoes
            </h3>
            <p className="text-zinc-600 text-xs font-sans leading-relaxed mb-3">
              Investigating the physical residue of digital simulation, generative ceramics, and physical computing artifacts.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <span className="text-amber-700 font-medium text-[11px]">Submissions Open</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSubmit?.();
                }}
                className="text-purple-700 hover:text-black flex items-center gap-1 underline text-[11px] cursor-pointer"
              >
                <span>Submit your work for Issue 002</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Issue 003 */}
          <div className="p-5 bg-[#fafafa] border border-zinc-200 opacity-80">
            <div className="flex items-center justify-between text-zinc-500 mb-1 text-[11px]">
              <span className="uppercase tracking-wider">Upcoming · December 2026</span>
              <span>Issue 003</span>
            </div>
            <h3 className="text-base font-serif-editorial text-zinc-800">
              Tactile Latency
            </h3>
            <p className="text-zinc-600 text-xs font-sans mt-1">
              Incurred delay between physical gesture and synthesized image.
            </p>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#fafafa] border-t border-zinc-200 flex items-center justify-between">
          {onOpen3DBookshelf && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpen3DBookshelf();
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-purple-700 text-white hover:bg-purple-800 text-xs font-mono-custom transition-colors cursor-pointer"
            >
              <span>Launch 3D Bookshelf View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-zinc-300 text-zinc-700 hover:border-black hover:text-black text-xs font-mono-custom cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreatorsDirectoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45"
    >
      <div
        className="relative w-full max-w-3xl bg-white border border-zinc-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#fafafa]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm sm:text-base font-mono-custom font-semibold text-black tracking-wider uppercase">
              Featured Creators
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close creator directory"
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-zinc-600 font-sans leading-relaxed">
            Every featured creator receives an editorial page tailored to their practice. Below are the creators featured across current and upcoming issues.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-custom">
            {CREATOR_DIRECTORY.map((creator) => (
              <div
                key={creator.id}
                className="p-4 bg-white border border-zinc-200 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] text-purple-700 font-medium uppercase tracking-widest mb-1">
                    {creator.issue}
                  </div>
                  <h3 className="text-base font-serif-editorial text-black font-semibold mb-0.5">
                    {creator.name}
                  </h3>
                  <div className="text-xs text-zinc-500 mb-2">{creator.location}</div>
                  <div className="text-xs text-amber-700 font-medium mb-3">
                    {creator.discipline}
                  </div>
                  <p className="text-xs font-sans text-zinc-600 leading-relaxed mb-4">
                    {creator.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-200">
                  <div className="text-[10px] text-zinc-500 uppercase mb-1">Tools</div>
                  <div className="text-[11px] text-zinc-700 leading-relaxed">
                    {creator.tools.join(' · ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-3 bg-[#fafafa] border-t border-zinc-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-black text-white hover:bg-zinc-800 text-xs font-mono-custom cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose, onOpenSubmit }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45"
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-zinc-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#fafafa]">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-700" />
            <h2 className="text-sm sm:text-base font-mono-custom font-semibold text-black tracking-wider uppercase">
              Curatorial Mission
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close about modal"
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="text-xl sm:text-2xl font-serif-editorial text-black leading-snug">
            "A feed shows the finished thing. We're interested in the hours around it."
          </div>

          <div className="space-y-3 text-sm font-serif-editorial text-zinc-700 leading-relaxed">
            <p>
              Independent creatives who rely on social platforms struggle to present their work with the depth and atmosphere it was made with. Feed-based formats impose a homogenous layout, cropped aspect ratios, short attention windows, and algorithm-driven volatility.
            </p>
            <p>
              <strong className="text-black font-medium">aetherside.mag</strong> offers a curated alternative where depth, atmosphere, and craft come first. Each featured creator receives an editorial page that presents their work alongside its story and process.
            </p>
          </div>

          <div className="p-4 bg-[#fafafa] border border-zinc-200 text-xs font-mono-custom text-zinc-600 space-y-2">
            <div className="text-purple-700 uppercase tracking-widest font-semibold">
              Commitments
            </div>
            <div>· Real-time Open-Meteo atmospheric integration (Johannesburg origin)</div>
            <div>· Interactive WebGL point cloud & procedural stipple noise</div>
            <div>· Zero algorithm, zero ads, zero compressed carousels</div>
            <div>· WCAG AA contrast, visible focus states & reduced-motion support</div>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#fafafa] border-t border-zinc-200 flex items-center justify-between text-xs font-mono-custom">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSubmit?.();
            }}
            className="text-purple-700 hover:text-black underline cursor-pointer"
          >
            Submit your work for consideration ↗
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-black text-white hover:bg-zinc-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
