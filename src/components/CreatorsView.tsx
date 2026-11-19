import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagazinePage, TouchDesignerStudy } from '../types';
import { CREATOR_DIRECTORY, TOUCHDESIGNER_STUDIES } from '../data/studies';
import { StudyGraphic } from './StudyGraphic';
import { AetherLogo } from './AetherLogo';
import { ArrowLeft, ArrowRight, ArrowUpRight, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type DisciplineFilter = 'all' | 'touchdesigner' | 'textile' | 'photography';

interface CreatorsViewProps {
  onNavigate: (page: MagazinePage) => void;
  onOpenStudy: (study: TouchDesignerStudy) => void;
  onOpenSubmit: () => void;
  onOpenResearch?: () => void;
}

export const CreatorsView: React.FC<CreatorsViewProps> = ({
  onNavigate,
  onOpenStudy,
  onOpenSubmit,
  onOpenResearch,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [disciplineFilter, setDisciplineFilter] = useState<DisciplineFilter>('all');

  const creatorVisualMap: Record<
    string,
    {
      visual: 'monochrome_signal' | 'textile_folds' | 'where_light_stays';
      category: DisciplineFilter;
      note: string;
    }
  > = {
    nkosinathi: {
      visual: 'monochrome_signal',
      category: 'touchdesigner',
      note: 'Studio Note: Recursive luminance thresholds tuned to Johannesburg wind velocity and barometer pressure.',
    },
    noa_vale: {
      visual: 'textile_folds',
      category: 'textile',
      note: 'Studio Note: Unbleached Baltic linen suspended under raw counterweight tension over 72-hour acoustic tests.',
    },
    eli_kade: {
      visual: 'where_light_stays',
      category: 'photography',
      note: 'Studio Note: 18-minute bulb exposures over still volcanic reservoirs in Nagano during astronomical twilight.',
    },
  };

  const filteredCreators =
    disciplineFilter === 'all'
      ? CREATOR_DIRECTORY
      : CREATOR_DIRECTORY.filter((c) => creatorVisualMap[c.id]?.category === disciplineFilter);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.creators-hero-stagger', {
        y: 22,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.utils.toArray<HTMLElement>('.gsap-creators-section').forEach((section) => {
        const items = section.querySelectorAll('.gsap-creators-item');
        if (!items.length) return;

        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true,
          },
        });
      });
    }, containerRef);

    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-white text-[#09090b]">
      {/* Top Sub-Navigation Breadcrumb */}
      <div className="w-full bg-white border-b border-zinc-200 py-3 pwm-grid px-grid">
        <div className="col-span-12 lg:col-start-2 flex items-center justify-between gap-4 text-[11px] font-mono-custom uppercase tracking-[0.12em]">
          <button
            type="button"
            onClick={() => onNavigate('cover')}
            className="flex items-center gap-2 text-zinc-600 hover:text-black transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cover</span>
          </button>

          <div className="flex items-center gap-3 text-zinc-500">
            <Users className="w-3.5 h-3.5 text-purple-700 shrink-0" />
            <span className="whitespace-nowrap">Page 04 · Creators & Curatorial Mission</span>
          </div>
        </div>
      </div>

      {/* Editorial Hero & Curatorial Statement */}
      <section className="pwm-grid px-grid pt-14 pb-16 lg:pt-20 lg:pb-24 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="creators-hero-stagger text-[11px] font-mono-custom uppercase tracking-[0.18em] text-purple-700 font-medium mb-4">
            Featured Practices · Issue 001 Directory
          </div>

          <h1 className="creators-hero-stagger font-display font-extrabold uppercase tracking-[-0.02em] text-black text-3xl sm:text-5xl lg:text-[62px] leading-[1.03] max-w-4xl text-balance">
            Studios Working Beyond The Feed
          </h1>

          <p className="creators-hero-stagger mt-6 text-xl sm:text-2xl font-serif-editorial italic font-light text-zinc-800 max-w-3xl leading-snug">
            “A feed shows the finished thing. We are interested in the hours around it—the failed parameters, heavy materials, and quiet studio atmospheres.”
          </p>
        </div>
      </section>

      {/* Filterable Creator Profiles */}
      <section className="gsap-creators-section pwm-grid px-grid py-16 lg:py-24 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="gsap-creators-item flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-12 border-b border-zinc-200">
            <div>
              <h2 className="text-xs font-mono-custom uppercase tracking-[0.16em] text-black font-semibold">
                01. Creator Monographs
              </h2>
              <p className="text-[11px] font-mono-custom text-zinc-500 mt-1 uppercase tracking-wider">
                Showing {filteredCreators.length} of {CREATOR_DIRECTORY.length} practices
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-100 border border-zinc-200 font-mono-custom text-[11px]">
              {(
                [
                  { key: 'all', label: 'All Practices' },
                  { key: 'touchdesigner', label: 'TouchDesigner' },
                  { key: 'textile', label: 'Textile' },
                  { key: 'photography', label: 'Photography' },
                ] as { key: DisciplineFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setDisciplineFilter(tab.key)}
                  className={`px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    disciplineFilter === tab.key
                      ? 'bg-white text-black font-semibold shadow-xs border border-zinc-200'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {filteredCreators.map((creator, idx) => {
              const meta = creatorVisualMap[creator.id] ?? {
                visual: 'monochrome_signal' as const,
                category: 'touchdesigner' as const,
                note: '',
              };

              return (
                <article
                  key={creator.id}
                  className="gsap-creators-item grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-zinc-200 last:border-b-0 last:pb-0 items-stretch"
                >
                  {/* Study Artwork Plate */}
                  <div className="lg:col-span-5 aspect-square lg:aspect-auto min-h-[280px] bg-zinc-950 border border-zinc-200 relative overflow-hidden">
                    <StudyGraphic
                      type={meta.visual}
                      src={creator.id === 'nkosinathi' ? '/assets/works/FlowerMainnull2_8d6f1c70.jpg' : undefined}
                      alt={creator.featuredProject}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-0 right-0 bg-black text-white px-2.5 py-1 text-[10px] font-mono-custom uppercase tracking-wider">
                      0{idx + 1} · {creator.location}
                    </div>
                  </div>

                  {/* Narrative Dossier */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-custom uppercase tracking-[0.14em] text-purple-700 font-medium mb-3">
                        <span>{creator.issue}</span>
                        <span aria-hidden="true" className="text-zinc-300">·</span>
                        <span className="text-zinc-600">{creator.discipline}</span>
                      </div>

                      <h3 className="text-3xl sm:text-4xl font-serif-editorial font-light text-black tracking-tight mb-4">
                        {creator.name}
                      </h3>

                      <p className="text-sm sm:text-base font-sans text-zinc-700 leading-relaxed mb-5 max-w-2xl">
                        {creator.bio}
                      </p>

                      {meta.note && (
                        <p className="text-xs font-serif-editorial italic text-zinc-600 mb-6 max-w-xl">
                          {meta.note}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-zinc-200 text-xs font-mono-custom mb-6">
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                            Featured Work
                          </div>
                          <div className="text-black font-medium">{creator.featuredProject}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                            Primary Tools & Mediums
                          </div>
                          <div className="text-zinc-700">{creator.tools.join(' · ')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {creator.id === 'nkosinathi' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onNavigate('feature')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-zinc-800 text-[11px] font-mono-custom font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <span>Read Signal & Noise Feature</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenStudy(TOUCHDESIGNER_STUDIES[0])}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-zinc-300 text-black hover:border-black text-[11px] font-mono-custom uppercase tracking-[0.12em] transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <span>Open TD Parameters</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate('issues')}
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-300 text-black hover:border-black text-[11px] font-mono-custom font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <span>View in Issue 001 Archive</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curatorial Mission & Open Submission Call */}
      <section className="gsap-creators-section pwm-grid px-grid py-16 lg:py-24 border-b border-zinc-200 bg-[#fafafa]">
        <div className="col-span-12 lg:col-start-2 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="gsap-creators-item">
            <div className="text-[11px] font-mono-custom tracking-[0.16em] text-zinc-500 uppercase mb-4">
              02. Editorial Standard
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif-editorial font-light text-black tracking-tight mb-5 leading-tight text-balance">
              Depth, atmosphere, and unhurried craft.
            </h2>
            <p className="text-sm sm:text-base font-sans text-zinc-700 leading-relaxed mb-4 max-w-lg">
              Feed platforms compress visual work into identical cropped squares and rapid scroll windows. ÆTHER.MAG builds bespoke digital reading rooms paired with real-time meteorological telemetry from Johannesburg.
            </p>
            <div className="space-y-2 pt-4 border-t border-zinc-200 text-xs font-mono-custom text-zinc-600">
              <div>· Live Open-Meteo atmospheric reactivity</div>
              <div>· Uncompressed plates and inspectable parameter logs</div>
              <div>· Zero algorithmic sorting, zero third-party ad networks</div>
            </div>
          </div>

          <div className="gsap-creators-item flex flex-col justify-between bg-white border border-zinc-200 p-8">
            <div>
              <div className="text-[11px] font-mono-custom tracking-[0.16em] text-purple-700 uppercase mb-3">
                Open Curatorial Call · Issue 002
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-editorial text-black font-light mb-4">
                Share your studio process for our November edition.
              </h3>
              <p className="text-sm font-sans text-zinc-600 leading-relaxed mb-8">
                We welcome TouchDesigner experiments, textile architecture, physical computing documentation, and slow darkroom monographs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenSubmit}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-zinc-800 text-xs font-mono-custom font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Submit Work Proposal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {onOpenResearch && (
                <button
                  type="button"
                  onClick={onOpenResearch}
                  className="text-[11px] font-mono-custom uppercase tracking-[0.14em] text-zinc-600 hover:text-black underline cursor-pointer"
                >
                  Read Research Dossier
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Page Footer */}
      <footer className="pwm-grid px-grid py-12 text-xs font-mono-custom text-zinc-600 bg-white">
        <div className="col-span-12 lg:col-start-2 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AetherLogo size="sm" />
            <span className="text-zinc-400">·</span>
            <span>Creators & Mission</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-wider">
            <button
              type="button"
              onClick={() => onNavigate('cover')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Cover
            </button>
            <button
              type="button"
              onClick={() => onNavigate('feature')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Feature 01
            </button>
            <button
              type="button"
              onClick={() => onNavigate('issues')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Issues
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
