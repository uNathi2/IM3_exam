import React, { useEffect, useState } from 'react';
import { X, FileText } from 'lucide-react';

interface ResearchDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchDossierModal: React.FC<ResearchDossierModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'competitor' | 'personas' | 'affinity' | 'usability' | 'openmeteo'
  >('competitor');

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45"
    >
      <div
        className="relative w-full max-w-5xl bg-white border border-zinc-300 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-[#fafafa] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-purple-700" />
            <div>
              <div className="text-[10px] font-mono-custom uppercase tracking-widest text-purple-700 font-medium">
                Research & Technical Specification
              </div>
              <h2 className="text-sm sm:text-base font-serif-editorial font-bold text-black tracking-wide">
                Design Research, Personas & Atmospheric Data Dossier
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close research dossier"
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-1 px-6 border-b border-zinc-200 bg-white overflow-x-auto text-xs font-mono-custom">
          <button
            type="button"
            onClick={() => setActiveTab('competitor')}
            className={`py-3 px-3.5 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'competitor'
                ? 'border-purple-700 text-black bg-purple-50/70'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            01. Competitor Analysis (Corrected)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personas')}
            className={`py-3 px-3.5 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'personas'
                ? 'border-purple-700 text-black bg-purple-50/70'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            02. Personas (Apayin, Bahle & Kwezi)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('usability')}
            className={`py-3 px-3.5 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'usability'
                ? 'border-purple-700 text-black bg-purple-50/70'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            03. Usability Test Logs & Hesitations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('affinity')}
            className={`py-3 px-3.5 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'affinity'
                ? 'border-purple-700 text-black bg-purple-50/70'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            04. Affinity Diagram & HMWs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('openmeteo')}
            className={`py-3 px-3.5 border-b-2 font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'openmeteo'
                ? 'border-purple-700 text-black bg-purple-50/70'
                : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            05. Open-Meteo Mapping Matrix
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono-custom text-zinc-700">
          {activeTab === 'competitor' && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-50 border border-purple-200 text-purple-900">
                <span className="font-semibold uppercase tracking-wider block mb-1">
                  Reconciled Competitor Landscape (Correcting Indigo Laboratory Duplication)
                </span>
                The competitive analysis reveals a fundamental gap in contemporary digital design: immersive WebGL sites prioritize interaction over editorial context, while traditional editorial sites prioritize text over sensory immersion. aetherside.mag unites both.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#fafafa] border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black text-sm">Gobold</span>
                    <span className="text-[10px] text-zinc-500">gobold.live</span>
                  </div>
                  <div className="text-[11px] text-purple-700">Technology: WebGL, Three.js, Canvas</div>
                  <div className="space-y-1.5 text-zinc-600 text-xs font-sans">
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Strengths:</strong> Highly atmospheric mood, 3D interactive hero, cohesive particle palette, branded progress loader.
                    </div>
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Weaknesses:</strong> Muted contrast violates WCAG AA (text color too close to background); agency-focused self-promotion with little editorial depth or artist process.
                    </div>
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Takeaway:</strong> Borrow the hero 3D object and branded loader; reject low-contrast text and unanchored gimmickry.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#fafafa] border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black text-sm">Warhol</span>
                    <span className="text-[10px] text-zinc-500">warhol-arts.webflow.io</span>
                  </div>
                  <div className="text-[11px] text-amber-700">Technology: Webflow, Three.js, GSAP</div>
                  <div className="space-y-1.5 text-zinc-600 text-xs font-sans">
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Strengths:</strong> Interactive artworks tied to the artist's medium (Elvis splatter, Coke bottle scroll progress), fluid typography.
                    </div>
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Weaknesses:</strong> Extremely sluggish on mobile devices; single-page layout limits long-form reading depth; heavy interactions occasionally compete with the art.
                    </div>
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Takeaway:</strong> Borrow medium-specific interactions; optimize performance strictly for mobile and preserve reading tranquility.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#fafafa] border border-purple-400 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black text-sm">Indigo Laboratory</span>
                    <span className="text-[10px] text-purple-700 uppercase tracking-wider font-medium">
                      Corrected Reference
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-700">Technology: Semantic HTML, Custom CSS</div>
                  <div className="space-y-1.5 text-zinc-600 text-xs font-sans">
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Strengths:</strong> Exemplary curatorial seriousness, comfortable editorial reading cadence, thoughtful cataloguing of contemporary Italian digital culture.
                    </div>
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Weaknesses:</strong> Completely static 2D page structure; zero tactile or generative immersion; digital art is treated like flat print catalog plates rather than active computational media.
                    </div>
                    <div>
                      <strong className="text-black font-mono-custom text-[11px]">Takeaway:</strong> Borrow the dignified editorial type hierarchy and long-form essay layout; bridge it with live interactive 3D WebGL point clouds.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#fafafa] border border-zinc-200 text-zinc-700 leading-relaxed font-sans text-xs">
                <strong className="text-black font-mono-custom uppercase block mb-1">
                  Survey Tension Resolution:
                </strong>
                Participants did not assert that "all art looks identical on social media." Rather, their grievance is structural: social platforms force extreme image compression (destroying high-frequency procedural stipples), restrict video aspect ratios, prioritize algorithmic sensationalism over context, and offer zero architectural space for the hours of discarded experiments, parameters, and failure states that define generative craft.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-zinc-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-black font-bold text-sm">Apayin</span>
                    <span className="text-purple-700 text-[10px] font-medium">Primary Persona</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">Age: 18–24 · Digital Arts Student</div>
                  <div className="space-y-1.5 font-sans text-xs text-zinc-700">
                    <p>
                      <strong>Behaviors:</strong> Shares generative work on Instagram; spends 5+ minutes exploring creative studio portfolios on desktop/laptop.
                    </p>
                    <p>
                      <strong>Core Pain Point:</strong> Platform JPEG compression crushes delicate 1px point-cloud stipple textures; algorithms demand frequent posting over finished depth.
                    </p>
                    <p>
                      <strong>How aetherside helps:</strong> Lossless procedural WebGL canvas rendering at native display resolution; high-credibility editorial feature page.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-zinc-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-black font-bold text-sm">Bahle</span>
                    <span className="text-amber-700 text-[10px] font-medium">Cross-Disciplinary</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">Age: 25–34 · Digital Arts & Writing</div>
                  <div className="space-y-1.5 font-sans text-xs text-zinc-700">
                    <p>
                      <strong>Behaviors:</strong> Publishes essays on Substack; combines sculpture, large-format photography, and critical texts; browses across mobile and laptop.
                    </p>
                    <p>
                      <strong>Core Pain Point:</strong> Social media isolates images from their conceptual narratives; no room to present acoustic research alongside physical drape photos.
                    </p>
                    <p>
                      <strong>How aetherside helps:</strong> Dedicated artist profiles, asymmetric reading canvas with margin notes, and unified multi-disciplinary curation.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-emerald-400 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-black font-bold text-sm">Kwezi</span>
                    <span className="text-emerald-700 text-[10px] uppercase tracking-wider font-medium">
                      Confirmed Profile
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">Age: 18–24 · Computer Science & Creative Tech</div>
                  <div className="space-y-1.5 font-sans text-xs text-zinc-700">
                    <p>
                      <strong>Behaviors:</strong> Explores open-source shaders on Shadertoy and GitHub; inspects browser DevTools to understand WebGL pipelines; browses on desktop.
                    </p>
                    <p>
                      <strong>Core Pain Point:</strong> Creative coding posts show flashy video loops without sharing parameters, node architectures, or API integration details.
                    </p>
                    <p>
                      <strong>How aetherside helps:</strong> Interactive study parameter inspector, reproducible operator graph diagrams, and live Open-Meteo API code transparency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usability' && (
            <div className="space-y-4">
              <div className="text-zinc-600 font-sans text-xs">
                Detailed behavioral record of participant interactions during usability testing across Gobold and Warhol, detailing exact hesitation triggers, misunderstandings, and recovery mechanisms:
              </div>

              <div className="overflow-x-auto border border-zinc-200">
                <table className="w-full text-left border-collapse font-mono-custom text-xs">
                  <thead>
                    <tr className="bg-[#fafafa] text-zinc-600 border-b border-zinc-200">
                      <th className="p-3">User & Site</th>
                      <th className="p-3">Task Assigned</th>
                      <th className="p-3">Observed Behavior & Hesitations</th>
                      <th className="p-3">Misunderstandings & Recovery</th>
                      <th className="p-3">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    <tr className="bg-white">
                      <td className="p-3 font-semibold text-black">P1 · Gobold</td>
                      <td className="p-3 text-zinc-700">Find creative process notes</td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Hesitated for 18 seconds on the 3D rotating snake. Attempted to click the body thinking it was a navigation menu. Missed the scroll cue due to poor low-contrast gray text.
                      </td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Misunderstood the 3D canvas as the entire site. Recovered only after accidentally dragging the mouse wheel downward.
                      </td>
                      <td className="p-3 text-amber-700 font-medium">Partial (50s)</td>
                    </tr>
                    <tr className="bg-[#fafafa]">
                      <td className="p-3 font-semibold text-black">P1 · Warhol</td>
                      <td className="p-3 text-zinc-700">Find artwork details</td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Quickly identified the Coke bottle scroll progress indicator. Hesitated briefly when tickets fell into the screen, pausing reading cadence.
                      </td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Splatter interaction on Elvis portrait was immediately understood because the cursor changed to a paint jar icon.
                      </td>
                      <td className="p-3 text-emerald-700 font-medium">Completed (25s)</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-semibold text-black">P2 · Gobold</td>
                      <td className="p-3 text-zinc-700">Navigate to project study</td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Encountered frame stuttering on mid-tier laptop. Failed to realize the stadium jumbotron was a clickable project carousel.
                      </td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Assumed jumbotron was background decoration. No visible hover cursor state was provided on the 3D mesh.
                      </td>
                      <td className="p-3 text-red-700 font-medium">Failed (75s)</td>
                    </tr>
                    <tr className="bg-[#fafafa]">
                      <td className="p-3 font-semibold text-black">P3 · Warhol</td>
                      <td className="p-3 text-zinc-700">Locate exhibition specs</td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Scrolled smoothly through typography. Praised the bold display letters but complained that mobile navigation collapsed into a blank white screen.
                      </td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Recovered by resizing desktop browser back to full width.
                      </td>
                      <td className="p-3 text-emerald-700 font-medium">Completed (30s)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'affinity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#fafafa] border border-zinc-200 space-y-2">
                  <div className="text-purple-700 font-bold uppercase tracking-wider text-xs">
                    CLUSTER A: Visual Fidelity & Anti-Compression
                  </div>
                  <p className="text-zinc-600 font-sans text-xs leading-relaxed">
                    Participants prioritize clean, crisp rendering of generative artifacts without platform compression artifacts or forced 1080p square cropping.
                  </p>
                  <div className="p-3 bg-white border border-zinc-200 text-zinc-800 font-sans text-xs">
                    <strong>HMW:</strong> How might we present delicate computational stipples and volumetric point clouds at native resolution without sacrificing mobile performance?
                  </div>
                </div>

                <div className="p-4 bg-[#fafafa] border border-zinc-200 space-y-2">
                  <div className="text-amber-700 font-bold uppercase tracking-wider text-xs">
                    CLUSTER B: Process & The Unglamorous Hours
                  </div>
                  <p className="text-zinc-600 font-sans text-xs leading-relaxed">
                    Creatives feel alienated by "finished-only" platforms. There is deep appetite for operator pipelines, node graphs, parameter logs, and documented failure states.
                  </p>
                  <div className="p-3 bg-white border border-zinc-200 text-zinc-800 font-sans text-xs">
                    <strong>HMW:</strong> How might we turn technical parameter inspection and failure logs into an engaging, integral part of the reading experience?
                  </div>
                </div>

                <div className="p-4 bg-[#fafafa] border border-zinc-200 space-y-2">
                  <div className="text-blue-700 font-bold uppercase tracking-wider text-xs">
                    CLUSTER C: Interaction Pacing vs. Reading Tranquility
                  </div>
                  <p className="text-zinc-600 font-sans text-xs leading-relaxed">
                    Heavy WebGL interactions can distract from essay comprehension if they continuously animate or block content readability.
                  </p>
                  <div className="p-3 bg-white border border-zinc-200 text-zinc-800 font-sans text-xs">
                    <strong>HMW:</strong> How might we isolate 3D generative laboratories into dedicated inspection viewports with collapsible docks so they never occlude curatorial text?
                  </div>
                </div>

                <div className="p-4 bg-[#fafafa] border border-zinc-200 space-y-2">
                  <div className="text-emerald-700 font-bold uppercase tracking-wider text-xs">
                    CLUSTER D: Tangible Metaphors (The Digital Library)
                  </div>
                  <p className="text-zinc-600 font-sans text-xs leading-relaxed">
                    Readers appreciate physical book spatial continuity (spines, page numbers, flippable spreads) as an antidote to infinite scrolling feeds.
                  </p>
                  <div className="p-3 bg-white border border-zinc-200 text-zinc-800 font-sans text-xs">
                    <strong>HMW:</strong> How might we represent an issue archive as physical 3D volumes that slide off a shelf and unfold into readable two-page spreads?
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'openmeteo' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#fafafa] border border-zinc-200 text-zinc-700 font-sans text-xs leading-relaxed">
                <span className="font-mono-custom font-semibold text-purple-700 block uppercase mb-1">
                  Verified Open-Meteo Weather Transduction Specification:
                </span>
                Endpoint: <code className="bg-zinc-200/70 px-1.5 py-0.5 text-black">https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current=temperature_2m,weather_code,wind_speed_10m,is_day</code>
                <br />
                The table below defines the exact mathematical thresholds converting raw Johannesburg meteorological variables into tangible visual changes in the Three.js point-cloud engine:
              </div>

              <div className="overflow-x-auto border border-zinc-200">
                <table className="w-full text-left border-collapse font-mono-custom text-xs">
                  <thead>
                    <tr className="bg-[#fafafa] text-zinc-600 border-b border-zinc-200">
                      <th className="p-3">API Field</th>
                      <th className="p-3">Input Value Range</th>
                      <th className="p-3">Normalized Variable</th>
                      <th className="p-3">Rendered Visual Transduction</th>
                      <th className="p-3">Interface Display Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    <tr className="bg-white">
                      <td className="p-3 font-semibold text-black">wind_speed_10m</td>
                      <td className="p-3 text-zinc-700">0.0 – 50.0 km/h</td>
                      <td className="p-3 text-purple-700">driftSpeed = clamp(wind/10, 0.4, 3.5)</td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Modulates angular rotational velocity of the 3D point cloud along Y/Z axes; high wind produces horizontal shear across particles.
                      </td>
                      <td className="p-3 text-zinc-600">Header ribbon & 3D Lab HUD</td>
                    </tr>
                    <tr className="bg-[#fafafa]">
                      <td className="p-3 font-semibold text-black">temperature_2m</td>
                      <td className="p-3 text-zinc-700">-5.0°C – 40.0°C</td>
                      <td className="p-3 text-purple-700">accentColor tint mapping</td>
                      <td className="p-3 text-zinc-600 font-sans">
                        &lt;14°C: Crystalline Cyan (#38bdf8)<br />
                        14–24°C: Signature Mauve/Violet (#c084fc)<br />
                        24–29°C: Incandescent Amber (#fbbf24)<br />
                        &gt;29°C: Solar Terracotta (#f97316)
                      </td>
                      <td className="p-3 text-zinc-600">Particle vertex color & badge swatch</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 font-semibold text-black">weather_code</td>
                      <td className="p-3 text-zinc-700">WMO codes 0 – 99</td>
                      <td className="p-3 text-purple-700">rainIntensity = 0.0 – 1.0</td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Codes 51–67 (drizzle/rain) and 80–82 add vertical staccato noise displacement. Code 95+ (thunderstorm) increases turbulence by 2.5×.
                      </td>
                      <td className="p-3 text-zinc-600">Condition label & particle wave speed</td>
                    </tr>
                    <tr className="bg-[#fafafa]">
                      <td className="p-3 font-semibold text-black">is_day</td>
                      <td className="p-3 text-zinc-700">0 or 1</td>
                      <td className="p-3 text-purple-700">scene.fog density & ambient scale</td>
                      <td className="p-3 text-zinc-600 font-sans">
                        Modulates atmospheric fog depth and chromatic ink contrast against the white exhibition canvas.
                      </td>
                      <td className="p-3 text-zinc-600">Canvas lighting & sun/moon icon</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#fafafa] border-t border-zinc-200 flex items-center justify-between text-xs font-mono-custom text-zinc-600">
          <div>Document: Technical Specification & Curatorial Research</div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
