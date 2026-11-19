import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WeatherAtmosphere, TouchDesignerStudy } from '../types';
import { ThreePointCloud } from './ThreePointCloud';
import { StudyGraphic } from './StudyGraphic';
import { TOUCHDESIGNER_STUDIES, ISSUE_STORIES } from '../data/studies';
import { ThreeBookshelf } from './ThreeBookshelf';
import { AetherLogo } from './AetherLogo';
import TypographicTides from './originkit/ui/typographic-tides';
import { isItemSaved, toggleSaveItem } from '../services/bookmarkService';
import { ArrowUpRight, Check, Bookmark } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const COVER_TIDES_TEXT = ['ISSUE 001', 'SIGNAL · TEXTILE · LIGHT'];
const COVER_TIDES_FONT: React.CSSProperties = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 800,
  fontSize: '52px',
  lineHeight: '1.1em',
  letterSpacing: '-0.02em',
};

interface CoverViewProps {
  atmosphere: WeatherAtmosphere;
  onEnterFeature: () => void;
  onOpenStudy: (study: TouchDesignerStudy) => void;
  onOpenSubmit: () => void;
  onOpenIssues: () => void;
  onOpenCreators: () => void;
  onOpenAbout: () => void;
  onOpenResearch?: () => void;
}

export const CoverView: React.FC<CoverViewProps> = ({
  atmosphere,
  onEnterFeature,
  onOpenStudy,
  onOpenSubmit,
  onOpenIssues,
  onOpenCreators,
  onOpenAbout,
  onOpenResearch,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [, setSavedTick] = useState(0);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        delay: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.from('.teaser-card', {
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.teaser-section',
          start: 'top 84%',
          once: true,
        },
      });

      gsap.fromTo(
        '.teaser-media',
        { yPercent: -4, scale: 1.04 },
        {
          yPercent: 4,
          scale: 1.04,
          ease: 'none',
          scrollTrigger: {
            trigger: '.teaser-frame',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>('.gsap-reveal-group').forEach((group) => {
        const items = group.querySelectorAll('.gsap-reveal-item');
        if (!items.length) return;

        gsap.from(items, {
          y: 28,
          opacity: 0,
          duration: 0.78,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: group,
            start: 'top 84%',
            once: true,
          },
        });
      });
    }, containerRef);

    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    let alive = true;
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(
        () => {
          if (alive) ScrollTrigger.refresh();
        },
        () => {}
      );
    }

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-white text-[#09090b]">
      {/* ─────────────────────────────────────────────────────────────
          OPENING FULL-VIEWPORT HERO — PW-Magazine Centered White Ground
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100svh-69px)] sm:min-h-[calc(100svh-97px)] md:min-h-[calc(100svh-109px)] lg:min-h-[calc(100svh-129px)] overflow-hidden bg-white flex flex-col border-b border-zinc-200">
        <div className="absolute inset-0 z-0 opacity-90">
          <ThreePointCloud
            atmosphere={atmosphere}
            height="100%"
            colorScheme="reactive"
            density="balanced"
            showControls={false}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/15 to-white/95 pointer-events-none z-1" />

        <div className="pwm-grid px-grid relative z-10 w-full flex-1 flex flex-col justify-between py-8 lg:py-12">
          {/* Top Archival Coordinate Strip */}
          <div className="col-span-12 lg:col-start-2 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono-custom uppercase tracking-[0.16em] text-zinc-600">
            <span className="hero-stagger">001 · TOUCHDESIGNER STUDIES</span>
            <span className="hero-stagger text-purple-700 font-medium tabular-nums">
              JHB TELEMETRY · {atmosphere.temperature}°C · {atmosphere.windSpeed} KM/H
            </span>
          </div>

          {/* Bottom-Centered Editorial Lockup */}
          <div className="col-span-12 lg:col-start-2 flex flex-col items-center text-center mt-auto pt-20 pb-2 lg:pb-4">
            <div className="hero-stagger text-[11px] font-mono-custom uppercase tracking-[0.18em] text-purple-700 font-medium mb-5">
              ISSUE 001 — OPENING MONOGRAPH
            </div>

            <h1 className="hero-stagger font-display font-extrabold uppercase tracking-[-0.02em] text-black text-3xl sm:text-5xl lg:text-[66px] leading-[1.02] max-w-4xl text-balance">
              <span className="block">Another Side</span>
              <span className="block">Of The Signal</span>
            </h1>

            <p className="hero-stagger mt-br text-sm sm:text-base font-serif-editorial font-light text-zinc-700 max-w-xl leading-relaxed">
              Inside the studios, recursive signals, and unhurried material studies shaping work beyond the feed.
            </p>

            <div className="hero-stagger mt-br flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono-custom uppercase tracking-[0.16em]">
              <button
                type="button"
                onClick={onEnterFeature}
                className="inline-flex items-center gap-1.5 text-black font-semibold border-b border-black hover:border-purple-700 hover:text-purple-700 pb-0.5 transition-colors cursor-pointer"
              >
                <span>Enter Feature 01</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <span className="text-zinc-300" aria-hidden="true">/</span>

              <button
                type="button"
                onClick={() =>
                  document.getElementById('issues-section')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-zinc-600 hover:text-black transition-colors cursor-pointer"
              >
                Explore 3D Shelf ↓
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          01 / INSIDE THIS ISSUE — PW-Magazine 3-Column Centered Index
      ───────────────────────────────────────────────────────────── */}
      <section className="gsap-reveal-group pwm-grid px-grid py-16 lg:py-24 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="gsap-reveal-item flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-12 border-b border-zinc-200">
            <h2 className="text-xs font-mono-custom uppercase tracking-[0.16em] text-black font-semibold">
              01 / Inside This Issue
            </h2>
            <span className="text-[11px] font-mono-custom uppercase tracking-[0.14em] text-zinc-500">
              Three Perspectives · October 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-14">
            {ISSUE_STORIES.map((story) => (
              <article
                key={story.id}
                onClick={() => {
                  if (story.id === 'signal_noise') {
                    onEnterFeature();
                  } else {
                    onOpenCreators();
                  }
                }}
                className="gsap-reveal-item group cursor-pointer flex flex-col"
              >
                {/* Unboxed Square Gallery Plate + Bottom-Right Mono Stamp */}
                <div className="aspect-square w-full bg-zinc-950 border border-zinc-200 relative overflow-hidden">
                  <StudyGraphic
                    type={
                      story.previewType === 'touchdesigner'
                        ? 'monochrome_signal'
                        : story.previewType === 'textile'
                        ? 'textile_folds'
                        : 'where_light_stays'
                    }
                    src={
                      story.id === 'signal_noise'
                        ? '/assets/works/FlowerMainnull2_8d6f1c70.jpg'
                        : undefined
                    }
                    alt={story.title}
                    className="w-full h-full group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 right-0 bg-black text-white px-2 py-0.5 text-[10px] font-mono-custom uppercase tracking-wider">
                    {story.discipline}
                  </div>
                </div>

                {/* PW-Magazine Centered Typography Stack */}
                <div className="mt-5 text-center px-2 group-hover:opacity-50 transition-opacity duration-300">
                  <h3 className="font-display font-bold uppercase text-base sm:text-lg leading-[1.15] tracking-[-0.01em] text-black">
                    <span className="block text-[11px] font-mono-custom font-normal tracking-[0.14em] text-purple-700 mb-1.5">
                      {story.creator}
                    </span>
                    <span className="block">{story.title}</span>
                  </h3>

                  <div className="mt-br text-[11px] font-mono-custom uppercase tracking-[0.12em] text-zinc-500">
                    {story.issue} · {story.readTime}
                  </div>

                  <p className="mt-3 text-xs font-sans text-zinc-600 leading-relaxed font-normal max-w-xs mx-auto line-clamp-3">
                    {story.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="gsap-reveal-item mt-14 pt-6 border-t border-zinc-200 text-center">
            <button
              type="button"
              onClick={onOpenIssues}
              className="text-[11px] font-mono-custom uppercase tracking-[0.16em] text-zinc-600 hover:text-black inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Explore Full Issue Index</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FEATURE PLATE & CENTERED PULL-QUOTE MONOGRAPH PAUSE
      ───────────────────────────────────────────────────────────── */}
      <section className="teaser-section pwm-grid px-grid py-16 lg:py-24 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="teaser-card">
            <div
              onClick={onEnterFeature}
              className="teaser-frame relative aspect-21/9 w-full bg-zinc-950 border border-zinc-200 cursor-pointer group overflow-hidden"
            >
              <div className="teaser-media w-full h-full">
                <StudyGraphic
                  type="monochrome_signal"
                  src="/assets/works/FlowerMainnull2_8d6f1c70.jpg"
                  videoSrc="/assets/works/Flowers_7a8347c1.mp4"
                  alt="Signal and Noise — Motion Study"
                  className="w-full h-full group-hover:scale-102 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-10">
                <div className="text-[10px] sm:text-[11px] font-mono-custom text-purple-300 tracking-[0.16em] uppercase mb-1">
                  PROJECT 01 · TOUCHDESIGNER STUDIES
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold uppercase text-white tracking-tight">
                  Signal and Noise
                </h2>
              </div>

              <div className="absolute bottom-0 right-0 bg-white text-black border-t border-l border-zinc-200 px-3 py-1.5 text-[10px] sm:text-[11px] font-mono-custom uppercase tracking-[0.14em] group-hover:bg-black group-hover:text-white transition-colors">
                Enter Feature 01 ↗
              </div>
            </div>
          </div>

          {/* Centered Large Serif Pull-Quote Pause */}
          <div className="max-w-4xl mx-auto text-center pt-16 lg:pt-20 pb-2">
            <blockquote className="font-serif-editorial font-light text-2xl sm:text-3xl lg:text-[40px] leading-[1.2] tracking-[-0.01em] text-black">
              “A feed only shows the finished frame. We are interested in the hours around it—the discarded seeds, the materials, and the questions that refuse to settle.”
            </blockquote>
            <div className="mt-br text-[11px] font-mono-custom uppercase tracking-[0.16em] text-zinc-500">
              Nkosinathi Titus · Studio Note 14 · Johannesburg
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02 / KINETIC TYPOLOGY & 3D VOLUME ARCHIVE
      ───────────────────────────────────────────────────────────── */}
      <section id="issues-section" className="gsap-reveal-group scroll-mt-32 pwm-grid px-grid py-16 lg:py-24 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="gsap-reveal-item flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-10 border-b border-zinc-200">
            <h2 className="text-xs font-mono-custom uppercase tracking-[0.16em] text-black font-semibold">
              02 / Volume Archive & Kinetic Index
            </h2>
            <span className="text-[11px] font-mono-custom uppercase tracking-[0.14em] text-zinc-500">
              Interactive 3D Print Editions · Issue 001–003
            </span>
          </div>

          <div className="gsap-reveal-item w-full h-36 sm:h-44 md:h-48 mb-10 border border-zinc-200 bg-white relative overflow-hidden">
            <TypographicTides
              text={COVER_TIDES_TEXT}
              subtext="Three perspectives on creative process and computational form"
              background="#ffffff"
              textColor="#09090b"
              accent="#7c3aed"
              secondaryColor="#0284c7"
              amplitude={24}
              frequency={0.016}
              speed={1.4}
              layers={4}
              showContourLines={true}
              font={COVER_TIDES_FONT}
            />
          </div>

          <div className="gsap-reveal-item">
            <ThreeBookshelf
              onEnterFeature={onEnterFeature}
              onOpenSubmit={onOpenSubmit}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03 / PROJECT 01 ARCHIVAL STUDIES — 4-Up Borderless Plates
      ───────────────────────────────────────────────────────────── */}
      <section className="gsap-reveal-group pwm-grid px-grid py-16 lg:py-24 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2">
          <div className="gsap-reveal-item flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 mb-12 border-b border-zinc-200">
            <div>
              <h2 className="text-xs font-mono-custom uppercase tracking-[0.16em] text-black font-semibold">
                03 / Project 01 Documentation
              </h2>
              <p className="text-[11px] font-mono-custom text-zinc-500 mt-1 uppercase tracking-wider">
                Eight Archival Plates & Loops in TouchDesigner
              </p>
            </div>

            <button
              type="button"
              onClick={onEnterFeature}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono-custom uppercase tracking-[0.14em] text-zinc-600 hover:text-black transition-colors cursor-pointer"
            >
              <span>Open Full Documentation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {TOUCHDESIGNER_STUDIES.map((study) => (
              <div
                key={study.id}
                onClick={() => onOpenStudy(study)}
                className="gsap-reveal-item cursor-pointer group flex flex-col"
              >
                <div className="aspect-[4/5] w-full bg-white border border-zinc-200 relative overflow-hidden">
                  <StudyGraphic
                    type={study.svgVisualType}
                    src={study.src}
                    videoSrc={study.videoSrc}
                    lightGround={study.lightGround}
                    alt={study.title}
                    className="w-full h-full group-hover:scale-[1.04] transition-transform duration-700"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem({
                        id: study.id,
                        title: study.title,
                        type: 'study',
                        subtitle: `${study.category} · ${study.parameters.particleCount}`,
                      });
                      setSavedTick((t) => t + 1);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/95 border border-zinc-300 text-zinc-700 hover:text-purple-700 transition-colors cursor-pointer z-10"
                    aria-label={isItemSaved(study.id) ? `Remove ${study.title} from saved` : `Save ${study.title}`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        isItemSaved(study.id) ? 'fill-purple-700 text-purple-700' : ''
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-0 right-0 bg-black text-white px-2 py-0.5 text-[10px] font-mono-custom uppercase tracking-wider">
                    {study.code}
                  </div>
                </div>

                <div className="mt-4 text-center px-1 group-hover:opacity-55 transition-opacity duration-300">
                  <div className="text-[10px] font-mono-custom uppercase tracking-[0.14em] text-purple-700 mb-1">
                    {study.category}
                  </div>
                  <div className="text-xs font-display font-bold uppercase tracking-wide text-black leading-snug">
                    {study.title}
                  </div>
                  <div className="mt-2 text-[11px] font-mono-custom uppercase tracking-wider text-zinc-500">
                    {study.parameters.particleCount} · Inspect ↗
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          04 / EDITORS NOTE, MONTHLY DISPATCH & SUBMISSION CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="gsap-reveal-group pwm-grid px-grid py-16 lg:py-24 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="gsap-reveal-item flex flex-col justify-between lg:pr-8 lg:border-r lg:border-zinc-200">
            <div>
              <div className="text-[11px] font-mono-custom tracking-[0.16em] text-zinc-500 uppercase mb-4">
                04 / Note from the Editors
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif-editorial font-light text-black tracking-tight mb-5 leading-tight text-balance">
                The work is only half the story.
              </h2>
              <p className="text-sm font-sans text-zinc-600 leading-relaxed mb-8 max-w-lg">
                A feed shows the finished thing. We are interested in the hours around it: the failures, the materials, and the questions that refuse to settle. This issue makes space for all of them.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={onOpenAbout}
                className="text-[11px] font-mono-custom uppercase tracking-[0.14em] text-purple-700 hover:text-black inline-flex items-center gap-1.5 cursor-pointer border-b border-purple-700/40 hover:border-black pb-0.5 transition-colors"
              >
                <span>Read Our Mission</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          <div className="gsap-reveal-item flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono-custom tracking-[0.16em] text-zinc-500 uppercase mb-4">
                Monthly Dispatch
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif-editorial font-light text-black tracking-tight mb-5 leading-tight text-balance">
                One issue. Once a month.
              </h2>
              <p className="text-sm font-sans text-zinc-600 leading-relaxed mb-8 max-w-lg">
                New stories and studio notes. No daily noise. Unsubscribe whenever you like.
              </p>
            </div>

            <div>
              {newsletterSubmitted ? (
                <div className="p-3.5 border border-purple-400 bg-purple-50 flex items-center gap-2 text-xs font-mono-custom text-purple-900">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You're subscribed. Issue 002 will arrive directly in your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3 font-mono-custom">
                  <label htmlFor="newsletter-email" className="block text-[10px] text-zinc-500 uppercase tracking-[0.16em]">
                    Email Address
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="you@yourstudio.com"
                      className="flex-1 bg-transparent border-b border-zinc-300 focus:border-black px-1 py-2.5 text-xs text-black placeholder:text-zinc-400 focus:outline-hidden transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-black text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>Get Next Issue</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Submission CTA */}
      <section className="gsap-reveal-group pwm-grid px-grid py-16 lg:py-20 border-b border-zinc-200">
        <div className="col-span-12 lg:col-start-2 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="gsap-reveal-item">
            <div className="text-[11px] font-mono-custom tracking-[0.16em] text-zinc-500 uppercase mb-3">
              Your work has a story, too.
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-black tracking-tight leading-[1.04]">
              Let us see the other side.
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenSubmit}
            className="gsap-reveal-item inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-mono-custom text-xs font-semibold uppercase tracking-[0.14em] hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 self-start md:self-auto"
          >
            <span>Submit Your Work</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      {/* Footer aligned to 13-col editorial grid */}
      <footer className="gsap-reveal-group pwm-grid px-grid py-14 text-xs font-mono-custom text-zinc-600 bg-white">
        <div className="col-span-12 lg:col-start-2">
          <div className="gsap-reveal-item flex flex-col md:flex-row items-baseline justify-between gap-8 pb-10 border-b border-zinc-200">
            <div>
              <AetherLogo size="md" className="mb-3" />
              <p className="text-zinc-600 font-sans max-w-md font-light">
                An independent digital magazine for work, story, and the practice in between.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-3 text-[11px] uppercase tracking-wider">
              <button
                type="button"
                onClick={onOpenIssues}
                className="text-left text-zinc-600 hover:text-black transition-colors cursor-pointer"
              >
                Issue Archive ↗
              </button>
              <button
                type="button"
                onClick={onOpenCreators}
                className="text-left text-zinc-600 hover:text-black transition-colors cursor-pointer"
              >
                Creator Directory ↗
              </button>
              <button
                type="button"
                onClick={onOpenSubmit}
                className="text-left text-zinc-600 hover:text-black transition-colors cursor-pointer"
              >
                Submit Work ↗
              </button>
              {onOpenResearch && (
                <button
                  type="button"
                  onClick={onOpenResearch}
                  className="text-left text-zinc-600 hover:text-black transition-colors cursor-pointer"
                >
                  Research Dossier ↗
                </button>
              )}
              <a
                href="mailto:hello@aetherside.mag"
                className="text-zinc-600 hover:text-black transition-colors"
              >
                Editorial Contact ↗
              </a>
            </div>
          </div>

          <div className="gsap-reveal-item pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            <div>Johannesburg · Issue 001 · Atmospheric Edition</div>
            <div>© 2026 ÆTHER.MAG</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
