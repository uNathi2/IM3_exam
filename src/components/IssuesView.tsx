import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagazinePage, TouchDesignerStudy } from '../types';
import { TOUCHDESIGNER_STUDIES, ISSUE_STORIES } from '../data/studies';
import { ThreeBookshelf } from './ThreeBookshelf';
import { StudyGraphic } from './StudyGraphic';
import TypographicTides from './originkit/ui/typographic-tides';
import { AetherLogo } from './AetherLogo';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ARCHIVE_TIDES_TEXT = ['ISSUES ARCHIVE', 'VOLUMES 001 — 003'];
const ARCHIVE_TIDES_FONT: React.CSSProperties = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 800,
  fontSize: '42px',
  lineHeight: '1.08em',
  letterSpacing: '-0.02em',
};

type IssueStatusFilter = 'all' | 'published' | 'open' | 'upcoming';

interface ArchiveVolume {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  status: 'published' | 'open' | 'upcoming';
  statusLabel: string;
  date: string;
  editionSpec: string;
  description: string;
  contributors: string[];
  visual: 'monochrome_signal' | 'textile_folds' | 'where_light_stays';
}

const ARCHIVE_VOLUMES: ArchiveVolume[] = [
  {
    id: 'vol-001',
    number: 'Volume 001',
    title: 'Another Side of the Signal',
    subtitle: 'Inaugural Atmospheric Monograph',
    status: 'published',
    statusLabel: 'Current Edition · October 2026',
    date: 'October 2026',
    editionSpec: '3 Essays · 4 TouchDesigner Plates · Johannesburg Sky Data',
    description:
      'Exploring recursive video processing, heavy natural linen suspensions, and nocturnal long-exposure light vectors.',
    contributors: ['Nkosinathi Titus', 'Noa Vale', 'Eli Kade'],
    visual: 'monochrome_signal',
  },
  {
    id: 'vol-002',
    number: 'Volume 002',
    title: 'Residual Matter & Tactile Echoes',
    subtitle: 'Curatorial Docket & Open Call',
    status: 'open',
    statusLabel: 'Submissions Open · November 2026',
    date: 'November 2026',
    editionSpec: 'Physical Computing · Generative Ceramics · Drape Studies',
    description:
      'Investigating the physical residue left behind by digital simulation, plotter drawings, kiln chemistry, and structural textile memory.',
    contributors: ['Open Curatorial Call', 'Berlin & Johannesburg Desks'],
    visual: 'textile_folds',
  },
  {
    id: 'vol-003',
    number: 'Volume 003',
    title: 'Tactile Latency',
    subtitle: 'Winter Solstice Monograph',
    status: 'upcoming',
    statusLabel: 'In Preparation · December 2026',
    date: 'December 2026',
    editionSpec: 'Scheduled Print + WebGL Field Archive',
    description:
      'Examining the perceptual delay between physical gesture and synthesized spatial sound or luminous projection.',
    contributors: ['Invited Studio Fellows · Announced Nov 2026'],
    visual: 'where_light_stays',
  },
];

interface IssuesViewProps {
  onNavigate: (page: MagazinePage) => void;
  onOpenStudy: (study: TouchDesignerStudy) => void;
  onOpenSubmit: () => void;
  onOpenResearch?: () => void;
}

export const IssuesView: React.FC<IssuesViewProps> = ({
  onNavigate,
  onOpenStudy,
  onOpenSubmit,
  onOpenResearch,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<IssueStatusFilter>('all');

  const visibleVolumes =
    filter === 'all'
      ? ARCHIVE_VOLUMES
      : ARCHIVE_VOLUMES.filter((v) => v.status === filter);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.issues-hero-stagger', {
        y: 22,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.utils.toArray<HTMLElement>('.gsap-issues-section').forEach((section) => {
        const items = section.querySelectorAll('.gsap-issues-item');
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
            <BookOpen className="w-3.5 h-3.5 text-purple-700 shrink-0" />
            <span className="whitespace-nowrap">Page 03 · Issues & Volume Archive</span>
          </div>
        </div>
      </div>

      {/* Hero Header & Kinetic Banner */}
      <section className="pwm-grid px-grid pt-14 pb-16 lg:pt-20 lg:pb-20 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="issues-hero-stagger text-[11px] font-mono-custom uppercase tracking-[0.18em] text-purple-700 font-medium mb-4">
            Catalog & Print Archive · Volumes 001–003
          </div>

          <h1 className="issues-hero-stagger font-display font-extrabold uppercase tracking-[-0.02em] text-black text-3xl sm:text-5xl lg:text-[62px] leading-[1.03] max-w-4xl text-balance">
            Monthly Monographs & Spatial Editions
          </h1>

          <p className="issues-hero-stagger mt-6 text-base sm:text-lg font-serif-editorial font-light text-zinc-700 max-w-2xl leading-relaxed">
            Each issue binds three independent studio practices alongside interactive software plates and seasonal field notes. Browse published volumes, inspect archived studies, or submit work for upcoming editions.
          </p>

          <div className="issues-hero-stagger mt-10 w-full h-36 sm:h-44 border border-zinc-200 bg-white relative overflow-hidden">
            <TypographicTides
              text={ARCHIVE_TIDES_TEXT}
              subtext="ÆTHER.MAG · CURATORIAL ARCHIVE · JOHANNESBURG"
              background="#ffffff"
              textColor="#09090b"
              accent="#7c3aed"
              secondaryColor="#0284c7"
              amplitude={20}
              frequency={0.018}
              speed={1.4}
              layers={4}
              showContourLines={true}
              font={ARCHIVE_TIDES_FONT}
            />
          </div>
        </div>
      </section>

      {/* Interactive 3D Issue Bookshelf Sculpture */}
      <section className="gsap-issues-section pwm-grid px-grid py-14 lg:py-20 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="gsap-issues-item flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-8 border-b border-zinc-200">
            <h2 className="text-xs font-mono-custom uppercase tracking-[0.16em] text-black font-semibold">
              01. Interactive 3D Edition Bookshelf
            </h2>
            <span className="text-[11px] font-mono-custom uppercase tracking-[0.14em] text-zinc-500">
              Drag or click spines to inspect Issue 001–003
            </span>
          </div>

          <div className="gsap-issues-item">
            <ThreeBookshelf
              onEnterFeature={() => onNavigate('feature')}
              onOpenSubmit={onOpenSubmit}
            />
          </div>
        </div>
      </section>

      {/* Filterable Volume Index */}
      <section className="gsap-issues-section pwm-grid px-grid py-16 lg:py-24 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="gsap-issues-item flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-12 border-b border-zinc-200">
            <div>
              <h2 className="text-xs font-mono-custom uppercase tracking-[0.16em] text-black font-semibold">
                02. Volume Catalogue
              </h2>
              <p className="text-[11px] font-mono-custom text-zinc-500 mt-1 uppercase tracking-wider">
                Showing {visibleVolumes.length} of {ARCHIVE_VOLUMES.length} curatorial volumes
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-100 border border-zinc-200 font-mono-custom text-[11px]">
              {(
                [
                  { key: 'all', label: 'All Volumes' },
                  { key: 'published', label: 'Published' },
                  { key: 'open', label: 'Open Docket' },
                  { key: 'upcoming', label: 'Upcoming' },
                ] as { key: IssueStatusFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1.5 uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    filter === tab.key
                      ? 'bg-white text-black font-semibold shadow-xs border border-zinc-200'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            {visibleVolumes.map((vol) => (
              <article
                key={vol.id}
                className="gsap-issues-item grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-zinc-200 last:border-b-0 last:pb-0 items-stretch"
              >
                {/* Plate Visual */}
                <div className="lg:col-span-4 aspect-[4/3] lg:aspect-auto min-h-[240px] bg-white border border-zinc-200 relative overflow-hidden">
                  <StudyGraphic
                    type={vol.visual}
                    src={
                      vol.id === 'vol-001'
                        ? '/assets/works/FlowerMainnull2_8d6f1c70.jpg'
                        : vol.id === 'vol-002'
                        ? '/assets/works/MikeandNion_6ec355a8.png'
                        : '/assets/works/TDMovieOut.0_753ffbc7.png'
                    }
                    lightGround={vol.id === 'vol-002'}
                    alt={vol.title}
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-0 right-0 bg-black text-white px-2.5 py-1 text-[10px] font-mono-custom uppercase tracking-wider">
                    {vol.number}
                  </div>
                </div>

                {/* Editorial Catalogue Record */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-custom uppercase tracking-[0.14em] text-purple-700 font-medium mb-3">
                      <span>{vol.statusLabel}</span>
                      <span aria-hidden="true" className="text-zinc-300">·</span>
                      <span className="text-zinc-500">{vol.editionSpec}</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-serif-editorial font-light text-black tracking-tight mb-2">
                      {vol.title}
                    </h3>

                    <div className="text-xs font-mono-custom uppercase tracking-[0.14em] text-zinc-500 mb-4">
                      {vol.subtitle}
                    </div>

                    <p className="text-sm sm:text-base font-sans text-zinc-700 leading-relaxed max-w-2xl mb-6">
                      {vol.description}
                    </p>

                    <div className="text-xs font-mono-custom text-zinc-600 mb-6">
                      <span className="text-zinc-400 uppercase tracking-wider mr-2">Contributors:</span>
                      <span>{vol.contributors.join(' · ')}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-100">
                    {vol.status === 'published' && (
                      <>
                        <button
                          type="button"
                          onClick={() => onNavigate('feature')}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-zinc-800 text-[11px] font-mono-custom font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <span>Read Feature 01</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenStudy(TOUCHDESIGNER_STUDIES[0])}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-zinc-300 text-black hover:border-black text-[11px] font-mono-custom uppercase tracking-[0.12em] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <span>Inspect Issue Plates</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {vol.status === 'open' && (
                      <button
                        type="button"
                        onClick={onOpenSubmit}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 text-white hover:bg-purple-800 text-[11px] font-mono-custom font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Submit Work for Issue 002</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {vol.status === 'upcoming' && (
                      <button
                        type="button"
                        onClick={() => onNavigate('creators')}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono-custom uppercase tracking-[0.14em] text-zinc-700 hover:text-black border-b border-zinc-300 hover:border-black pb-0.5 transition-colors cursor-pointer"
                      >
                        <span>View Resident Creators</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Issue 001 Contents Table */}
      <section className="gsap-issues-section pwm-grid px-grid py-16 border-b border-zinc-200 bg-[#fafafa]">
        <div className="col-span-12 lg:col-start-2">
          <div className="gsap-issues-item flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-8 border-b border-zinc-200">
            <h2 className="text-xs font-mono-custom uppercase tracking-[0.16em] text-black font-semibold">
              03. Issue 001 Table of Contents
            </h2>
            <span className="text-[11px] font-mono-custom uppercase tracking-[0.14em] text-zinc-500">
              Inaugural Edition Index
            </span>
          </div>

          <div className="divide-y divide-zinc-200 bg-white border border-zinc-200">
            {ISSUE_STORIES.map((story, idx) => (
              <div
                key={story.id}
                className="gsap-issues-item p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-mono-custom uppercase tracking-[0.16em] text-zinc-500">
                    0{idx + 1} · {story.discipline} · {story.readTime}
                  </div>
                  <div className="text-lg sm:text-xl font-serif-editorial text-black font-medium">
                    {story.title}
                  </div>
                  <div className="text-xs font-sans text-zinc-600">
                    By {story.creator} — {story.summary}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    story.id === 'signal_noise'
                      ? onNavigate('feature')
                      : onNavigate('creators')
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono-custom uppercase tracking-[0.14em] text-black hover:text-purple-700 shrink-0 cursor-pointer whitespace-nowrap"
                >
                  <span>{story.id === 'signal_noise' ? 'Read Feature' : 'Creator Dossier'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Page Footer */}
      <footer className="pwm-grid px-grid py-12 text-xs font-mono-custom text-zinc-600 bg-white">
        <div className="col-span-12 lg:col-start-2 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AetherLogo size="sm" />
            <span className="text-zinc-400">·</span>
            <span>Volumes 001–003</span>
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
              onClick={() => onNavigate('creators')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Creators
            </button>
            {onOpenResearch && (
              <button
                type="button"
                onClick={onOpenResearch}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Research Dossier
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
