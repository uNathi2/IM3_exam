import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MagazinePage, WeatherAtmosphere } from '../types';
import {
  Cloud,
  Sun,
  CloudRain,
  Zap,
  Bookmark,
  Menu,
} from 'lucide-react';
import VectorWordmark from './originkit/ui/vector-wordmark';

interface HeaderProps {
  currentView: MagazinePage;
  onNavigate: (view: MagazinePage) => void;
  onOpenIssues: () => void;
  onOpenCreators: () => void;
  onOpenAbout: () => void;
  onOpenSubmit: () => void;
  onOpenSimulator: () => void;
  onOpenSaved: () => void;
  onOpenResearch: () => void;
  onOpenMobileMenu: () => void;
  savedCount: number;
  atmosphere: WeatherAtmosphere;
}

const WORDMARK_HANDLES = {
  size: 28,
  spread: 20,
  labels: false,
};

const WORDMARK_FONT: React.CSSProperties = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 800,
  fontSize: '122px',
  lineHeight: '1em',
  letterSpacing: '-0.025em',
};

const WORDMARK_STYLE: React.CSSProperties = {
  minWidth: 0,
  minHeight: 0,
  width: '100%',
  height: '100%',
  background: '#ffffff',
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenIssues,
  onOpenCreators,
  onOpenAbout,
  onOpenSubmit,
  onOpenSimulator,
  onOpenSaved,
  onOpenMobileMenu,
  savedCount,
  atmosphere,
}) => {
  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(false);
  const anchorYRef = useRef<number>(0);
  const compactRef = useRef<boolean>(false);

  // Scroll-direction dynamic masthead sizing with fixed overlay + hysteresis
  useEffect(() => {
    let ticking = false;
    anchorYRef.current = window.scrollY;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - anchorYRef.current;

        if (y <= 40) {
          if (compactRef.current) {
            compactRef.current = false;
            setIsScrolledDown(false);
          }
          anchorYRef.current = y;
        } else if (!compactRef.current && y > 100 && delta > 16) {
          compactRef.current = true;
          setIsScrolledDown(true);
          anchorYRef.current = y;
        } else if (compactRef.current && delta < -18) {
          compactRef.current = false;
          setIsScrolledDown(false);
          anchorYRef.current = y;
        } else if (
          (compactRef.current && delta > 0) ||
          (!compactRef.current && delta < 0)
        ) {
          anchorYRef.current = y;
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Deeper editorial accents so VectorWordmark remains crisp on pure white
  const wordmarkAccent = useMemo(() => {
    const temp = atmosphere.temperature;
    if (temp < 14) return '#0284c7';
    if (temp < 24) return '#7c3aed';
    if (temp < 29) return '#d97706';
    return '#ea580c';
  }, [atmosphere.temperature]);

  const getWeatherIcon = () => {
    switch (atmosphere.condition) {
      case 'clear':
        return <Sun className="w-3 h-3 text-amber-600 shrink-0" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-3 h-3 text-blue-600 shrink-0" />;
      case 'thunderstorm':
        return <Zap className="w-3 h-3 text-purple-700 shrink-0" />;
      default:
        return <Cloud className="w-3 h-3 text-zinc-600 shrink-0" />;
    }
  };

  return (
    <>
      {/* Static spacer preserves layout & ScrollTrigger coordinates while fixed masthead resizes */}
      <div className="relative z-40 bg-white h-[69px] sm:h-[97px] md:h-[109px] lg:h-[129px]">
        <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white text-black border-b border-zinc-200">
          <div
            className={`w-full px-grid bg-white transition-[padding] duration-300 ease-out ${
              isScrolledDown ? 'py-2' : 'py-2.5 sm:py-3 md:py-3.5 lg:py-4'
            }`}
          >
            <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
              {/* Left Masthead Slot */}
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="hidden lg:inline-block text-[10px] font-mono-custom uppercase tracking-[0.16em] text-zinc-500 whitespace-nowrap">
                  Issue 001 · Johannesburg
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const order: MagazinePage[] = ['cover', 'feature', 'issues', 'creators'];
                    const next = order[(order.indexOf(currentView) + 1) % order.length];
                    onNavigate(next);
                  }}
                  className="lg:hidden text-[10px] font-mono-custom uppercase tracking-[0.14em] text-zinc-600 hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                >
                  {currentView === 'cover'
                    ? '01 · Cover'
                    : currentView === 'feature'
                    ? '02 · Feature'
                    : currentView === 'issues'
                    ? '03 · Issues'
                    : '04 · Creators'}
                </button>
              </div>

              {/* Center Masthead Slot: Centered Originkit VectorWordmark */}
              <div className="shrink-0 flex justify-center">
                <button
                  type="button"
                  onClick={() => onNavigate('cover')}
                  className="cursor-pointer group bg-white focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-purple-600 flex items-center justify-center"
                  aria-label="ÆTHER.MAG — Return to Cover"
                >
                  <div
                    className={`relative overflow-hidden bg-white flex items-center justify-center transition-[height] duration-300 ease-out ${
                      isScrolledDown
                        ? 'h-9 sm:h-10'
                        : 'h-12 sm:h-18 md:h-20 lg:h-24'
                    }`}
                  >
                    <div
                      className={`shrink-0 origin-center bg-white transition-transform duration-300 ease-out will-change-transform w-[clamp(148px,45vw,210px)] sm:w-[320px] md:w-[440px] lg:w-[560px] h-12 sm:h-18 md:h-20 lg:h-24 ${
                        isScrolledDown
                          ? 'scale-[0.75] sm:scale-[0.58] md:scale-[0.52] lg:scale-[0.44]'
                          : 'scale-100'
                      }`}
                    >
                      <VectorWordmark
                        text="ÆTHER.MAG"
                        background="#ffffff"
                        textColor="#09090b"
                        accent={wordmarkAccent}
                        shade="#09090b"
                        reach={240}
                        speed={45}
                        damping={60}
                        handles={WORDMARK_HANDLES}
                        font={WORDMARK_FONT}
                        style={WORDMARK_STYLE}
                      />
                    </div>
                  </div>
                </button>
              </div>

              {/* Right Masthead Slot */}
              <div className="flex-1 min-w-0 flex items-center justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onOpenSimulator}
                  title="Johannesburg weather atmosphere controls"
                  className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono-custom uppercase tracking-[0.12em] text-zinc-700 hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                >
                  {getWeatherIcon()}
                  <span className="tabular-nums">{atmosphere.temperature}°C</span>
                  <span className="hidden xl:inline text-zinc-300" aria-hidden="true">/</span>
                  <span className="hidden xl:inline text-zinc-500">{atmosphere.conditionLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenSaved}
                  title="Open saved reading list"
                  className="inline-flex items-center gap-1 text-[10px] font-mono-custom uppercase tracking-wider text-zinc-700 hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Bookmark className="w-3 h-3 text-purple-700 shrink-0" />
                  <span className="hidden md:inline">Saved</span>
                  <span className="tabular-nums text-zinc-500">({savedCount})</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenSubmit}
                  className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white hover:bg-zinc-800 text-[10px] font-mono-custom font-medium uppercase tracking-[0.12em] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Submit</span>
                  <span aria-hidden="true">↗</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="lg:hidden p-1.5 text-zinc-700 hover:text-black border border-zinc-300 hover:border-black transition-colors cursor-pointer shrink-0"
                  aria-label="Open menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Desktop Fixed Left Vertical Navigation Rail — PW-Magazine Column 1 Gutter */}
      <nav
        aria-label="Primary vertical navigation"
        className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col w-[88px] xl:w-[96px] text-[11px] font-mono-custom uppercase tracking-[0.1em] leading-[1.55] text-left select-none"
      >
        <button
          type="button"
          onClick={() => onNavigate('cover')}
          className={`text-left transition-opacity cursor-pointer whitespace-nowrap ${
            currentView === 'cover'
              ? 'text-black font-semibold underline underline-offset-4 decoration-purple-700'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          Cover
        </button>

        <button
          type="button"
          onClick={() => onNavigate('feature')}
          className={`text-left transition-opacity cursor-pointer whitespace-nowrap ${
            currentView === 'feature'
              ? 'text-black font-semibold underline underline-offset-4 decoration-purple-700'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          Feature 01
        </button>

        <button
          type="button"
          onClick={onOpenIssues}
          className={`text-left transition-opacity cursor-pointer whitespace-nowrap ${
            currentView === 'issues'
              ? 'text-black font-semibold underline underline-offset-4 decoration-purple-700'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          Issues
        </button>

        <button
          type="button"
          onClick={onOpenCreators}
          className={`text-left transition-opacity cursor-pointer whitespace-nowrap ${
            currentView === 'creators'
              ? 'text-black font-semibold underline underline-offset-4 decoration-purple-700'
              : 'text-zinc-500 hover:text-black'
          }`}
        >
          Creators
        </button>

        <button
          type="button"
          onClick={onOpenAbout}
          className="text-left text-zinc-500 hover:text-black transition-colors cursor-pointer whitespace-nowrap"
        >
          About
        </button>

        <div className="mt-[1.4em] pt-[1.4em] border-t border-zinc-200 flex flex-col">
          <button
            type="button"
            onClick={onOpenSaved}
            className="text-left text-zinc-600 hover:text-black transition-colors cursor-pointer whitespace-nowrap tabular-nums"
          >
            Saved ({savedCount})
          </button>

          <button
            type="button"
            onClick={onOpenSimulator}
            className="text-left text-purple-700 hover:text-black transition-colors cursor-pointer whitespace-nowrap tabular-nums"
          >
            {atmosphere.temperature}°C JHB
          </button>

          <button
            type="button"
            onClick={onOpenSubmit}
            className="text-left text-zinc-800 hover:text-purple-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Submit ↗
          </button>
        </div>
      </nav>
    </>
  );
};
