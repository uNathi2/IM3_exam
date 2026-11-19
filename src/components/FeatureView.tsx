import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WeatherAtmosphere, TouchDesignerStudy } from '../types';
import { ThreePointCloud } from './ThreePointCloud';
import { StudyGraphic } from './StudyGraphic';
import { TOUCHDESIGNER_STUDIES } from '../data/studies';
import { ReadingProgress } from './ReadingProgress';
import { isItemSaved, toggleSaveItem } from '../services/bookmarkService';
import {
  ArrowLeft,
  Wind,
  ArrowRight,
  Bookmark,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FeatureViewProps {
  atmosphere: WeatherAtmosphere;
  onBackToCover: () => void;
  onOpenStudy: (study: TouchDesignerStudy) => void;
  onOpenSubmit: () => void;
  onOpenSimulator: () => void;
  onOpenResearch?: () => void;
}

export const FeatureView: React.FC<FeatureViewProps> = ({
  atmosphere,
  onBackToCover,
  onOpenStudy,
  onOpenSubmit,
  onOpenSimulator,
  onOpenResearch,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStudyPreset, setActiveStudyPreset] = useState<string>('null2');
  const [activePalette, setActivePalette] = useState<'monochrome' | 'amber' | 'thermal' | 'reactive'>('reactive');
  const [isArticleSaved, setIsArticleSaved] = useState<boolean>(() => isItemSaved('feature_01'));

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.feature-hero-stagger', {
        y: 22,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.utils.toArray<HTMLElement>('.gsap-feature-section').forEach((section) => {
        const items = section.querySelectorAll('.gsap-feature-item');
        if (!items.length) return;

        gsap.from(items, {
          y: 26,
          opacity: 0,
          duration: 0.78,
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

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-white text-[#09090b]">
      {/* Feature Navigation Sub-Bar aligned to 13-col grid */}
      <div className="w-full bg-white border-b border-zinc-200 py-3 pwm-grid px-grid">
        <div className="col-span-12 lg:col-start-2 flex items-center justify-between gap-4 text-[11px] font-mono-custom uppercase tracking-[0.12em]">
          <button
            type="button"
            onClick={onBackToCover}
            className="flex items-center gap-2 text-zinc-600 hover:text-black transition-colors cursor-pointer group whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Cover</span>
          </button>

          <div className="hidden sm:flex items-center gap-2.5 text-zinc-500">
            <span>Project 01</span>
            <span aria-hidden="true">/</span>
            <span className="text-zinc-800">TouchDesigner Studies</span>
            <span aria-hidden="true">/</span>
            <span className="text-purple-700 font-medium">Signal and Noise</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                toggleSaveItem({
                  id: 'feature_01',
                  title: 'Signal and Noise (TouchDesigner Studies)',
                  type: 'article',
                  subtitle: 'By Nkosinathi Titus · Issue 001 Inaugural',
                });
                setIsArticleSaved(!isArticleSaved);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono-custom uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap ${
                isArticleSaved
                  ? 'bg-purple-700 border-purple-700 text-white'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:border-black hover:text-black'
              }`}
            >
              <Bookmark className={`w-3 h-3 ${isArticleSaved ? 'fill-white' : ''}`} />
              <span>{isArticleSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-2.5 py-1 border border-zinc-300 text-zinc-700 hover:border-black hover:text-black text-[10px] cursor-pointer whitespace-nowrap tabular-nums"
            >
              <Wind className="w-3 h-3 text-purple-700" />
              <span>Drift {atmosphere.windSpeed} km/h</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FEATURE HERO & INTERACTIVE 3D LAB
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full border-b border-zinc-200 bg-white">
        <div className="pwm-grid px-grid pt-12 pb-10">
          <div className="col-span-12 lg:col-start-2 text-center flex flex-col items-center">
            <div className="feature-hero-stagger flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono-custom uppercase tracking-[0.16em] text-zinc-500 mb-4">
              <span className="text-purple-700 font-medium">Feature 01</span>
              <span aria-hidden="true">·</span>
              <span>Issue 001</span>
              <span aria-hidden="true">·</span>
              <span className="text-black">Nkosinathi Titus</span>
              <span aria-hidden="true">·</span>
              <span>8 min read</span>
            </div>

            <h1 className="feature-hero-stagger font-display font-extrabold uppercase text-4xl sm:text-6xl lg:text-7xl text-black tracking-[-0.02em] leading-[1.02]">
              Signal and Noise
            </h1>

            <p className="feature-hero-stagger mt-br text-base sm:text-lg font-serif-editorial italic text-zinc-600 max-w-2xl font-light leading-relaxed">
              Generative imagery exploring recursive feedback loops, stipple dithering, and the permeable threshold between procedural noise and organic growth.
            </p>
          </div>
        </div>

        {/* Full 3D Interactive Point Cloud Laboratory */}
        <div className="feature-hero-stagger pwm-grid px-grid">
          <div className="col-span-12 lg:col-start-2 relative border border-zinc-200 bg-white h-[480px] lg:h-[620px]">
            <ThreePointCloud
              atmosphere={atmosphere}
              height="100%"
              colorScheme={activePalette}
              density="high"
              showControls={true}
              modelUrls={[
                `/assets/Models/study-${activeStudyPreset}.ply`,
                `/assets/models/study-${activeStudyPreset}.ply`,
                `/models/study-${activeStudyPreset}.ply`,
                '/assets/Models/Mike.ply',
                '/assets/models/Mike.ply',
                '/models/Mike.ply',
                '/assets/Models/mike.ply',
                '/models/mike.ply',
                '/assets/Models/hero-pointcloud.ply',
                '/assets/models/hero-pointcloud.ply',
                '/models/hero-pointcloud.ply',
              ]}
            />
          </div>
        </div>

        {/* 3D Lab Spec Ribbon */}
        <div className="pwm-grid px-grid py-4">
          <div className="col-span-12 lg:col-start-2 flex flex-wrap items-center justify-between text-[11px] font-mono-custom uppercase tracking-wider text-zinc-600 gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-black font-semibold">Interactive Laboratory</span>
              <span className="text-zinc-300" aria-hidden="true">/</span>
              <span>Drag to Rotate 360°</span>
              <span className="text-zinc-300" aria-hidden="true">/</span>
              <span className="text-purple-700">24,000 Live Telemetry Points</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-zinc-500 text-[10px]">Study Preset:</span>
              {TOUCHDESIGNER_STUDIES.map((study) => (
                <button
                  type="button"
                  key={study.id}
                  onClick={() => {
                    setActiveStudyPreset(study.id);
                    if (study.id === 'level1') setActivePalette('amber');
                    else if (study.id === 'layermix1') setActivePalette('thermal');
                    else if (study.id === 'null2') setActivePalette('monochrome');
                    else setActivePalette('reactive');
                  }}
                  className={`px-2 py-0.5 text-[10px] uppercase font-mono-custom border transition-colors cursor-pointer ${
                    activeStudyPreset === study.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-zinc-300 text-zinc-600 hover:border-black hover:text-black'
                  }`}
                >
                  {study.title.split('/')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reading Progress Indicator */}
      <ReadingProgress />

      {/* ─────────────────────────────────────────────────────────────
          CURATORIAL ESSAY & PROCESS ARCHAEOLOGY
      ───────────────────────────────────────────────────────────── */}
      <article className="pwm-grid px-grid py-16 lg:py-24 bg-white">
        <div className="col-span-12 lg:col-start-2">
          <div className="max-w-3xl mx-auto space-y-20">
            {/* Section 01: The Space Between Noise and Form */}
            <section className="gsap-feature-section space-y-6">
              <div className="gsap-feature-item text-[11px] font-mono-custom text-purple-700 font-medium uppercase tracking-[0.16em]">
                01 / Essay & Intent
              </div>
              <h2 className="gsap-feature-item text-3xl sm:text-4xl font-display font-bold uppercase text-black tracking-tight leading-[1.08]">
                The Space Between Noise and Form
              </h2>

              <div className="gsap-feature-item space-y-5 text-base sm:text-lg font-serif-editorial text-zinc-700 leading-relaxed font-light">
                <p className="first-letter:text-5xl first-letter:font-gothic first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-black">
                  Social platforms demand resolution. They ask you to crop, export at 1080p, compress the dynamic range, and attach three lines of hashtags to feed an engagement algorithm. But generative art does not begin with an export. It begins with the unstable, chaotic space inside the TouchDesigner network—where a feedback gain slider shifted by 0.002 can turn a delicate botanical bloom into an obliterating wall of high-frequency white noise.
                </p>
                <p>
                  In this first body of studies, the objective was not to synthesize a figurative landscape or render an ornamental graphic. The goal was to build a system of recursive operators whose visual behavior resembles natural biological growth: lichen spreading over granite, frost creeping across a pane of glass, or radio telemetry fracturing into stipple particles under ionospheric interference.
                </p>
              </div>

              {/* Centered Monograph Pull-Quote */}
              <div className="gsap-feature-item my-12 py-10 border-y border-zinc-200 text-center">
                <blockquote className="text-xl sm:text-3xl font-serif-editorial font-light text-black leading-[1.28]">
                  “A feed only shows the finished frame. We are interested in the infinite cascade of discarded seeds, runaway feedback loops, and broken renders that made it possible.”
                </blockquote>
                <div className="mt-br text-[11px] font-mono-custom text-zinc-500 uppercase tracking-[0.16em]">
                  Nkosinathi Titus · Studio Note 14
                </div>
              </div>

              {/* 16:9 Live Motion Study Plate */}
              <figure className="gsap-feature-item space-y-2.5">
                <div className="aspect-video w-full border border-zinc-200 bg-black overflow-hidden relative">
                  <StudyGraphic
                    type="monochrome_signal"
                    src="/assets/works/FlowerMainnull2_8d6f1c70.jpg"
                    videoSrc="/assets/works/Flowers_7a8347c1.mp4"
                    alt="TouchDesigner real-time botanical signal loop"
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-0 right-0 bg-black text-white px-2.5 py-0.5 text-[10px] font-mono-custom uppercase tracking-wider">
                    1280 × 720 · 15S LOOP
                  </div>
                </div>
                <figcaption className="text-xs font-serif-editorial italic text-zinc-500">
                  Fig. 01 — Real-time displacement and monochrome stipple study recorded live from TouchDesigner 099.
                </figcaption>
              </figure>
            </section>

            {/* Section 02: Operator Pipeline Breakdown */}
            <section className="gsap-feature-section space-y-6 border-t border-zinc-200 pt-14">
              <div className="gsap-feature-item text-[11px] font-mono-custom text-purple-700 font-medium uppercase tracking-[0.16em]">
                02 / Technical Architecture
              </div>
              <h2 className="gsap-feature-item text-3xl sm:text-4xl font-display font-bold uppercase text-black tracking-tight leading-[1.08]">
                The Operator Network Graph
              </h2>

              <p className="gsap-feature-item text-sm font-sans text-zinc-600 leading-relaxed">
                The generative architecture relies on a closed-loop TouchDesigner pipeline. By circulating pixel buffers through a recursive Feedback TOP and offsetting spatial coordinates with Simplex Noise displacement, forms continuously devour and regenerate themselves.
              </p>

              {/* Hairline Editorial Flowchart Table */}
              <div className="border-y border-zinc-200 py-6 space-y-5 font-mono-custom text-xs">
                <div className="gsap-feature-item text-zinc-600 uppercase tracking-[0.14em] flex items-center justify-between text-[11px]">
                  <span>TouchDesigner 099 · Node Network Flow</span>
                  <span className="text-zinc-500 tabular-nums">60.0 FPS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 border border-zinc-200 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200">
                  <div className="gsap-feature-item p-3.5 text-center">
                    <div className="text-purple-700 text-[10px] uppercase tracking-wider">Input</div>
                    <div className="text-black font-semibold mt-1">Noise TOP</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Simplex 3D · 2.40</div>
                  </div>

                  <div className="gsap-feature-item p-3.5 text-center">
                    <div className="text-purple-700 text-[10px] uppercase tracking-wider">Recursion</div>
                    <div className="text-black font-semibold mt-1">Feedback TOP</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Gain 0.982</div>
                  </div>

                  <div className="gsap-feature-item p-3.5 text-center">
                    <div className="text-purple-700 text-[10px] uppercase tracking-wider">Deform</div>
                    <div className="text-black font-semibold mt-1">Displace TOP</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Slope XY · 0.045</div>
                  </div>

                  <div className="gsap-feature-item p-3.5 text-center">
                    <div className="text-purple-700 text-[10px] uppercase tracking-wider">Geometry</div>
                    <div className="text-black font-semibold mt-1">SOP to Point</div>
                    <div className="text-[10px] text-zinc-500 mt-1">24.5k Cloud</div>
                  </div>

                  <div className="gsap-feature-item p-3.5 text-center">
                    <div className="text-purple-700 text-[10px] uppercase tracking-wider">Output</div>
                    <div className="text-black font-semibold mt-1">Render TOP</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Dither Pass</div>
                  </div>
                </div>
              </div>

              {/* TDMovieOut.0 & TDMovieOut.1 Widescreen Feedback Sequence */}
              <div className="gsap-feature-item grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <figure className="space-y-2">
                  <div className="aspect-video w-full border border-zinc-200 bg-zinc-900 overflow-hidden relative">
                    <StudyGraphic
                      type="monochrome_signal"
                      src="/assets/works/TDMovieOut.0_753ffbc7.png"
                      alt="TDMovieOut.0 optical trail feedback render"
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-0 right-0 bg-black text-white px-2 py-0.5 text-[10px] font-mono-custom uppercase tracking-wider">
                      TDMOVIEOUT.0
                    </div>
                  </div>
                  <figcaption className="text-[11px] font-serif-editorial italic text-zinc-500">
                    Fig. 02A — Recursive optical luminance trail from <code className="font-mono-custom not-italic text-zinc-700">MovieFileOut TOP</code> (Take 0).
                  </figcaption>
                </figure>

                <figure className="space-y-2">
                  <div className="aspect-video w-full border border-zinc-200 bg-zinc-900 overflow-hidden relative">
                    <StudyGraphic
                      type="monochrome_signal"
                      src="/assets/works/TDMovieOut.1_99187838.png"
                      alt="TDMovieOut.1 optical trail feedback render"
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-0 right-0 bg-black text-white px-2 py-0.5 text-[10px] font-mono-custom uppercase tracking-wider">
                      TDMOVIEOUT.1
                    </div>
                  </div>
                  <figcaption className="text-[11px] font-serif-editorial italic text-zinc-500">
                    Fig. 02B — Secondary phase decay capture from <code className="font-mono-custom not-italic text-zinc-700">MovieFileOut TOP</code> (Take 1).
                  </figcaption>
                </figure>
              </div>
            </section>

            {/* Section 03: Archival Studies & Loops */}
            <section className="gsap-feature-section space-y-8 border-t border-zinc-200 pt-14">
              <div className="gsap-feature-item flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono-custom text-purple-700 font-medium uppercase tracking-[0.16em]">
                    03 / Documented Studies
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold uppercase text-black tracking-tight mt-2">
                    Archival Plates &amp; Loops
                  </h2>
                </div>
                <span className="text-[11px] font-mono-custom uppercase tracking-wider text-zinc-500">
                  Select any plate to inspect
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
                {TOUCHDESIGNER_STUDIES.map((study) => (
                  <div
                    key={study.id}
                    onClick={() => onOpenStudy(study)}
                    className="gsap-feature-item cursor-pointer group flex flex-col"
                  >
                    <div className="aspect-16/10 w-full bg-white border border-zinc-200 overflow-hidden relative">
                      <StudyGraphic
                        type={study.svgVisualType}
                        src={study.src}
                        videoSrc={study.videoSrc}
                        lightGround={study.lightGround}
                        alt={study.title}
                        className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 right-0 bg-black text-white px-2 py-0.5 text-[10px] font-mono-custom uppercase tracking-wider">
                        {study.code}
                      </div>
                    </div>

                    <div className="mt-4 text-center px-2 group-hover:opacity-55 transition-opacity duration-300">
                      <div className="text-xs font-display font-bold uppercase tracking-wide text-black">
                        {study.title}
                      </div>
                      <p className="mt-2 text-xs font-sans text-zinc-600 leading-relaxed">
                        {study.description}
                      </p>
                      <div className="mt-3 text-[11px] font-mono-custom uppercase tracking-wider text-purple-700">
                        {study.parameters.particleCount} · Open Spec Sheet ↗
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 04: The Weather Transduction Layer */}
            <section className="gsap-feature-section space-y-6 border-t border-zinc-200 pt-14">
              <div className="gsap-feature-item text-[11px] font-mono-custom text-purple-700 font-medium uppercase tracking-[0.16em]">
                04 / Atmospheric Transduction
              </div>
              <h2 className="gsap-feature-item text-3xl sm:text-4xl font-display font-bold uppercase text-black tracking-tight leading-[1.08]">
                Grounded in the Johannesburg Sky
              </h2>

                <div className="gsap-feature-item space-y-4 text-base font-serif-editorial text-zinc-700 leading-relaxed font-light">
                <p>
                  Digital artwork often exists in an artificial void—completely untethered from physical geography or atmospheric change. For this feature, the TouchDesigner particle simulation is directly bound to live weather data from Open-Meteo, polled from the coordinates of central Johannesburg (-26.2041, 28.0473).
                </p>
                <p>
                  When highveld gale winds sweep across the ridge, the point cloud shears along its Y-axis at up to 3.5× baseline velocity. During summer afternoon thunderstorms (WMO code 95), vertical precipitation noise perturbs the particles with staccato downward impulses. At midnight, when temperatures plummet to winter minimums, the color spectrum shifts into crystalline indigo.
                </p>
              </div>

              {/* Fig. 02 — Mike & Nion Contour Point Cloud Plate */}
              <figure className="gsap-feature-item space-y-2.5 pt-2">
                <div className="aspect-square max-w-xl mx-auto w-full border border-zinc-200 bg-white overflow-hidden relative">
                  <StudyGraphic
                    type="monochrome_signal"
                    src="/assets/works/MikeandNion_6ec355a8.png"
                    alt="Mike and Nion spatial point-cloud contour scan"
                    lightGround={true}
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-0 right-0 bg-black text-white px-2.5 py-0.5 text-[10px] font-mono-custom uppercase tracking-wider">
                    SCAN PLATE · MIKE.PLY CONTOUR
                  </div>
                </div>
                <figcaption className="text-xs font-serif-editorial italic text-zinc-500 text-center">
                  Fig. 03 — Point-cloud contour extract corresponding to the interactive <code className="font-mono-custom text-[11px] not-italic text-zinc-700">Mike.ply</code> scan.
                </figcaption>
              </figure>

              <div className="gsap-feature-item py-6 border-y border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono-custom text-xs">
                <div className="space-y-1">
                  <div className="text-zinc-500 text-[10px] uppercase tracking-[0.16em]">
                    Current Transduction Status
                  </div>
                  <div className="text-black text-sm font-semibold tabular-nums">
                    {atmosphere.temperature}°C · {atmosphere.conditionLabel} · {atmosphere.windSpeed} km/h Wind
                  </div>
                  <div className="text-zinc-600 text-[11px] tabular-nums">
                    Particle Drift Factor: {atmosphere.particleDriftSpeed.toFixed(2)}x · Precipitation Noise: {Math.round(atmosphere.rainIntensity * 100)}%
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenSimulator}
                  className="px-4 py-2 bg-black text-white hover:bg-zinc-800 text-[11px] font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                >
                  Open Atmosphere Simulator ↗
                </button>
              </div>
            </section>

            {/* Section 05: The Hours Around It (Failure Log) */}
            <section className="gsap-feature-section space-y-6 border-t border-zinc-200 pt-14">
              <div className="gsap-feature-item text-[11px] font-mono-custom text-purple-700 font-medium uppercase tracking-[0.16em]">
                05 / Studio Failure Log
              </div>
              <h2 className="gsap-feature-item text-3xl sm:text-4xl font-display font-bold uppercase text-black tracking-tight leading-[1.08]">
                The Hours Around It
              </h2>

              <p className="gsap-feature-item text-sm font-sans text-zinc-600 leading-relaxed">
                In keeping with ÆTHER.MAG’s commitment that “the work is only half the story,” here is the unfiltered studio record of iterations that failed during the development of Project 01:
              </p>

              <div className="divide-y divide-zinc-200 border-y border-zinc-200 font-mono-custom text-xs">
                <div className="gsap-feature-item py-5">
                  <div className="flex justify-between text-zinc-500 text-[10px] uppercase tracking-wider mb-1.5">
                    <span className="text-red-600 font-semibold">Critical Failure 01</span>
                    <span>October 4, 2026</span>
                  </div>
                  <div className="text-black font-semibold mb-1.5">Feedback Gain Thermal Runaway</div>
                  <p className="text-zinc-600 font-sans text-xs leading-relaxed">
                    Set feedback gain to 0.998 without clamping output levels in Level TOP. Over 400 frames, luminance values saturated to pure 1.0 white across 100% of the canvas, causing GPU driver hang and requiring hard reboot.
                  </p>
                </div>

                <div className="gsap-feature-item py-5">
                  <div className="flex justify-between text-zinc-500 text-[10px] uppercase tracking-wider mb-1.5">
                    <span className="text-amber-700 font-semibold">Discarded Direction 02</span>
                    <span>October 8, 2026</span>
                  </div>
                  <div className="text-black font-semibold mb-1.5">Volumetric Smoke Simulation</div>
                  <p className="text-zinc-600 font-sans text-xs leading-relaxed">
                    Attempted 3D fluid grid simulation with Raymarch COMP. While visually compelling in isolation, it lacked the stark stipple precision of 2D stipple feedback, appearing muddy on small screens. Scrapped in favor of discrete point clouds.
                  </p>
                </div>

                <div className="gsap-feature-item py-5">
                  <div className="flex justify-between text-zinc-500 text-[10px] uppercase tracking-wider mb-1.5">
                    <span className="text-emerald-700 font-semibold">Accidental Discovery 03</span>
                    <span>October 11, 2026</span>
                  </div>
                  <div className="text-black font-semibold mb-1.5">Negative Slope TOP Displace</div>
                  <p className="text-zinc-600 font-sans text-xs leading-relaxed">
                    Inverting the Red channel displacement matrix resulted in the lichen-like dendritic branching visible in Null2. What was initially considered a coordinate error became the core aesthetic foundation of the series.
                  </p>
                </div>
              </div>
            </section>

            {/* Next Story Navigation & Submission CTA */}
            <div className="gsap-feature-section border-t border-zinc-200 pt-14 space-y-10">
              <div className="gsap-feature-item py-8 border-b border-zinc-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="text-[10px] font-mono-custom text-zinc-500 uppercase tracking-[0.16em] mb-1.5">
                    Continue Reading Issue 001
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-black">
                    Next: A Language Made of Folds
                  </h3>
                  <p className="text-xs font-sans text-zinc-600 mt-1">
                    By Noa Vale (Berlin) · Material Research & Heavy Textile Sculptures · 6 min read
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onBackToCover}
                  className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-[11px] font-mono-custom font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                >
                  <span>Explore Story in Issue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-custom uppercase tracking-wider text-zinc-600">
                <button
                  type="button"
                  onClick={onBackToCover}
                  className="hover:text-black flex items-center gap-1.5 cursor-pointer"
                >
                  <span>← Return to Magazine Cover</span>
                </button>

                <div className="flex items-center gap-6">
                  {onOpenResearch && (
                    <button
                      type="button"
                      onClick={onOpenResearch}
                      className="text-zinc-600 hover:text-black cursor-pointer"
                    >
                      Research Dossier ↗
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenSubmit}
                    className="text-purple-700 hover:text-black underline underline-offset-4 cursor-pointer"
                  >
                    Submit your work ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
