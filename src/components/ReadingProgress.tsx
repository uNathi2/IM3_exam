import React, { useEffect, useState } from 'react';

interface ReadingProgressProps {
  progressOverride?: number;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({ progressOverride }) => {
  const [scrollPercent, setScrollPercent] = useState<number>(progressOverride ?? 0);

  useEffect(() => {
    if (progressOverride !== undefined) {
      setScrollPercent(progressOverride);
      return;
    }

    let rafId = 0;

    const updateScroll = () => {
      rafId = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) {
        setScrollPercent(0);
        return;
      }
      const scrolled = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
      setScrollPercent(scrolled);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [progressOverride]);

  return (
    <div className="w-full bg-white border-b border-zinc-200 py-3 pwm-grid px-grid">
      <div className="col-span-12 lg:col-start-2">
        <div className="flex items-center justify-between text-xs font-mono-custom text-zinc-600 mb-2">
          <span className="uppercase tracking-[0.16em] text-[10px] font-medium text-zinc-600">
            Reading Progress
          </span>
          <span className="tabular-nums text-[11px] text-purple-700 font-semibold">{scrollPercent}%</span>
        </div>
        <div className="w-full h-px bg-zinc-200 overflow-hidden">
          <div
            className="h-full w-full origin-left bg-gradient-to-r from-purple-700 via-purple-500 to-black transition-transform duration-150 ease-out will-change-transform"
            style={{ transform: `scaleX(${scrollPercent / 100})` }}
          />
        </div>
      </div>
    </div>
  );
};
