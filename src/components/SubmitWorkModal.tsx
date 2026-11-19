import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SubmitWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitWorkModal: React.FC<SubmitWorkModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discipline: 'TouchDesigner & Creative Coding',
    projectTitle: '',
    portfolioUrl: '',
    processStory: '',
    termsAccepted: false,
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isRendered, setIsRendered] = useState<boolean>(isOpen);

  const backdropRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const envelopeShellRef = useRef<HTMLDivElement>(null);
  const envelopePocketRef = useRef<HTMLDivElement>(null);
  const envelopeFlapRef = useRef<HTMLDivElement>(null);
  const sealStampRef = useRef<HTMLDivElement>(null);

  const isClosingRef = useRef<boolean>(false);
  const activeTlRef = useRef<gsap.core.Timeline | null>(null);

  const triggerEnvelopeClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (activeTlRef.current) {
      activeTlRef.current.kill();
      activeTlRef.current = null;
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !paperRef.current || !envelopePocketRef.current || !envelopeFlapRef.current) {
      setIsRendered(false);
      isClosingRef.current = false;
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsRendered(false);
        isClosingRef.current = false;
        activeTlRef.current = null;
        onClose();
      },
    });
    activeTlRef.current = tl;

    // 1. Bring envelope pocket up cleanly to receive the letter sheet
    tl.to(
      envelopeShellRef.current,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.24,
        ease: 'power2.out',
      },
      0
    );

    tl.to(
      envelopePocketRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.22,
        ease: 'power2.out',
      },
      0
    );

    // 2. Slide and tuck the paper sheet smoothly down into the envelope
    tl.to(
      paperRef.current,
      {
        y: 165,
        scale: 0.84,
        rotateX: 10,
        opacity: 0,
        duration: 0.42,
        ease: 'power3.inOut',
      },
      0.06
    );

    // 3. Fold the top envelope flap shut and press the editorial seal
    tl.set(envelopeFlapRef.current, { zIndex: 30 }, 0.36);
    tl.to(
      envelopeFlapRef.current,
      {
        rotateX: 0,
        opacity: 1,
        duration: 0.32,
        ease: 'power2.inOut',
      },
      0.36
    );

    tl.fromTo(
      sealStampRef.current,
      { scale: 1.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(2)' },
      0.56
    );

    // Subtle paper compression beat when sealed
    tl.to(
      stageRef.current,
      {
        scale: 0.985,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
      },
      0.62
    );

    // 4. Glide the sealed envelope & backdrop out
    tl.to(
      stageRef.current,
      {
        y: 28,
        scale: 0.92,
        opacity: 0,
        duration: 0.26,
        ease: 'power2.in',
      },
      0.78
    );

    tl.to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.26,
        ease: 'power2.in',
      },
      0.78
    );
  }, [onClose]);

  // Mount & run GSAP pop-up-from-envelope entrance when opened
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      setIsRendered(true);
    } else if (isRendered && !isClosingRef.current) {
      triggerEnvelopeClose();
    }
  }, [isOpen, isRendered, triggerEnvelopeClose]);

  useEffect(() => {
    if (!isRendered || !isOpen) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    if (activeTlRef.current) {
      activeTlRef.current.kill();
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      activeTlRef.current = tl;

      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(stageRef.current, { opacity: 1, y: 0, scale: 1 });
      gsap.set(envelopeShellRef.current, { opacity: 0, y: 36, scale: 0.94 });
      gsap.set(envelopePocketRef.current, { opacity: 1, y: 0 });
      gsap.set(envelopeFlapRef.current, { rotateX: 0, opacity: 1, zIndex: 30 });
      gsap.set(sealStampRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(paperRef.current, {
        y: 170,
        scale: 0.84,
        rotateX: -8,
        rotateZ: -1.2,
        opacity: 0,
      });

      // 1. Fade in backdrop & lift envelope onto desk
      tl.to(backdropRef.current, { opacity: 1, duration: 0.24, ease: 'power2.out' }, 0);
      tl.to(
        envelopeShellRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'power3.out' },
        0.04
      );

      // 2. Flip envelope top flap open
      tl.to(
        envelopeFlapRef.current,
        {
          rotateX: 165,
          opacity: 0.28,
          duration: 0.34,
          ease: 'power2.out',
        },
        0.16
      );
      tl.set(envelopeFlapRef.current, { zIndex: 0 }, 0.32);

      // 3. Pop the paper letter cleanly out of the envelope
      tl.to(
        paperRef.current,
        {
          y: 0,
          scale: 1,
          rotateX: 0,
          rotateZ: 0,
          opacity: 1,
          duration: 0.56,
          ease: 'back.out(1.22)',
          clearProps: 'transform',
        },
        0.24
      );

      // 4. Move the envelope pocket clear once the sheet has popped out so inputs have 100% clarity
      tl.to(
        envelopePocketRef.current,
        {
          y: 34,
          opacity: 0,
          duration: 0.34,
          ease: 'power2.out',
        },
        0.42
      );
    }, stageRef);

    return () => {
      ctx.revert();
    };
  }, [isRendered, isOpen]);

  // Escape key listener calls envelope close
  useEffect(() => {
    if (!isRendered) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerEnvelopeClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isRendered, triggerEnvelopeClose]);

  if (!isRendered) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please provide your name or studio pseudonym.');
      setStatus('error');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid contact email.');
      setStatus('error');
      return;
    }
    if (!formData.projectTitle.trim()) {
      setErrorMessage('Please give your project or study a working title.');
      setStatus('error');
      return;
    }
    if (!formData.processStory.trim() || formData.processStory.length < 20) {
      setErrorMessage('Please share at least a short paragraph about your process or failures (min 20 characters).');
      setStatus('error');
      return;
    }
    if (!formData.termsAccepted) {
      setErrorMessage('Please accept the editorial submission guidelines.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
    }, 1050);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      discipline: 'TouchDesigner & Creative Coding',
      projectTitle: '',
      portfolioUrl: '',
      processStory: '',
      termsAccepted: false,
    });
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div
      ref={backdropRef}
      onClick={triggerEnvelopeClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45"
    >
      {/* Perspective Stage holding Envelope Pocket + Pop-up Paper Sheet */}
      <div
        ref={stageRef}
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1400px' }}
        className="relative w-full max-w-2xl flex items-center justify-center"
      >
        {/* Envelope Shell anchored behind & beneath the paper sheet */}
        <div
          ref={envelopeShellRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 sm:inset-x-6 bottom-0 top-12 z-0"
        >
          {/* Inner Envelope Back */}
          <div className="absolute inset-0 bg-[#f3f2ee] border border-zinc-300 shadow-lg" />

          {/* Hinged Top Envelope Flap (flips open upward when paper pops out, folds shut on close) */}
          <div
            ref={envelopeFlapRef}
            style={{ transformOrigin: 'top center', backfaceVisibility: 'hidden' }}
            className="absolute inset-x-0 top-0 h-36 sm:h-44 z-30"
          >
            <svg
              viewBox="0 0 600 180"
              preserveAspectRatio="none"
              className="w-full h-full drop-shadow-xs"
            >
              <polygon
                points="0,0 600,0 300,165"
                fill="#eceae4"
                stroke="#d4d4d8"
                strokeWidth="1.5"
              />
            </svg>

            {/* Editorial Seal Stamp revealed when envelope closes */}
            <div
              ref={sealStampRef}
              className="absolute left-1/2 bottom-1 -translate-x-1/2 px-2.5 py-1 bg-black text-white text-[9px] font-mono-custom uppercase tracking-[0.2em] border border-zinc-700 shadow-md"
            >
              ÆTHER.MAG · SEALED
            </div>
          </div>
        </div>

        {/* Interactive Paper Sheet (Pops up above envelope on open; tucks back in on close) */}
        <div
          ref={paperRef}
          className="relative z-10 w-full bg-white border border-zinc-300 shadow-2xl overflow-hidden max-h-[86vh] flex flex-col"
        >
          {/* Paper Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-[#fafafa]">
            <div>
              <div className="text-[10px] font-mono-custom uppercase tracking-widest text-purple-700 font-medium">
                Submission Sheet · Issue 002 Docket
              </div>
              <h2 className="text-base sm:text-lg font-serif-editorial font-medium text-black">
                Let Us See The Other Side
              </h2>
            </div>
            <button
              type="button"
              onClick={triggerEnvelopeClose}
              aria-label="Fold sheet into envelope and close"
              className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Paper Content */}
          <div className="p-6 overflow-y-auto bg-white">
            {status === 'success' ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono-custom uppercase tracking-[0.18em] text-purple-700 font-semibold">
                  Docket Entry Recorded
                </div>
                <h3 className="text-xl font-serif-editorial text-black">
                  Submission Ready for Dispatch
                </h3>
                <p className="text-sm font-serif-editorial text-zinc-700 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-black font-medium">{formData.name}</span>. Your manuscript{' '}
                  <span className="italic text-purple-700">"{formData.projectTitle}"</span> has been logged for Issue 002.
                </p>
                <div className="bg-[#fafafa] border border-zinc-200 p-4 max-w-md mx-auto text-left text-xs font-mono-custom text-zinc-600 space-y-1">
                  <div className="font-semibold text-black">Editorial review steps:</div>
                  <div>1. Curators review process documentation & studio depth.</div>
                  <div>2. Response sent to {formData.email} within 14 days.</div>
                  <div>3. Selected studios receive an interactive feature page.</div>
                </div>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-zinc-300 text-xs font-mono-custom text-zinc-700 hover:border-black hover:text-black cursor-pointer"
                  >
                    Submit Another Project
                  </button>
                  <button
                    type="button"
                    onClick={triggerEnvelopeClose}
                    className="px-5 py-2 bg-black text-white text-xs font-mono-custom font-semibold hover:bg-zinc-800 cursor-pointer"
                  >
                    Seal & Close Envelope
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-custom">
                <p className="text-xs text-zinc-600 leading-relaxed font-sans mb-4">
                  We celebrate the hours around the finished work: the unexpected failures, materials, and questions that refused to settle. Complete this sheet below and seal it into the editorial docket.
                </p>

                {status === 'error' && errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-300 flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-600 uppercase tracking-wider mb-1">
                      Creator / Studio Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maya Lin / Studio Vector"
                      className="w-full bg-white border border-zinc-300 px-3 py-2 text-black placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 uppercase tracking-wider mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="artist@domain.com"
                      className="w-full bg-white border border-zinc-300 px-3 py-2 text-black placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-600 uppercase tracking-wider mb-1">
                      Creative Discipline
                    </label>
                    <select
                      value={formData.discipline}
                      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                      className="w-full bg-white border border-zinc-300 px-3 py-2 text-black focus:outline-hidden focus:border-purple-700"
                    >
                      <option value="TouchDesigner & Creative Coding">TouchDesigner & Creative Coding</option>
                      <option value="Material & Textile Sculpture">Material & Textile Sculpture</option>
                      <option value="Long-Exposure & Experimental Photography">Long-Exposure Photography</option>
                      <option value="Generative Audio & Sound Art">Generative Audio & Sound Art</option>
                      <option value="Computational Architecture">Computational Architecture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-600 uppercase tracking-wider mb-1">
                      Working Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      placeholder="e.g. Resonant Feedback 04"
                      className="w-full bg-white border border-zinc-300 px-3 py-2 text-black placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 uppercase tracking-wider mb-1">
                    Portfolio / GitHub / Video Documentation Link
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://yourportfolio.com or https://vimeo.com/..."
                    className="w-full bg-white border border-zinc-300 px-3 py-2 text-black placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 uppercase tracking-wider mb-1">
                    The Story & Process Behind The Work *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.processStory}
                    onChange={(e) => setFormData({ ...formData, processStory: e.target.value })}
                    placeholder="Tell us about the unglamorous hours: what broken experiments or unexpected material behaviors led to this project?"
                    className="w-full bg-white border border-zinc-300 px-3 py-2 text-black placeholder:text-zinc-400 focus:outline-hidden focus:border-purple-700 leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-0.5 accent-purple-700 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-zinc-600 text-[11px] leading-tight cursor-pointer">
                    I understand that ÆTHER.MAG publishes in-depth editorial features rather than simple social reposts, and I am willing to share process documentation.
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={triggerEnvelopeClose}
                    className="px-4 py-2 border border-zinc-300 text-zinc-600 hover:border-black hover:text-black transition-colors cursor-pointer"
                  >
                    Fold & Close
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Logging Sheet...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Proposal ↗</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Envelope Front Pocket (overlays the lower/front lip cleanly during close slide) */}
        <div
          ref={envelopePocketRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 sm:inset-x-6 bottom-0 h-32 sm:h-40 z-20"
        >
          <svg
            viewBox="0 0 600 160"
            preserveAspectRatio="none"
            className="w-full h-full drop-shadow-md"
          >
            {/* Left & right diagonal pocket wings + bottom V fold */}
            <polygon
              points="0,0 300,98 0,160"
              fill="#f8f7f4"
              stroke="#d4d4d8"
              strokeWidth="1.5"
            />
            <polygon
              points="600,0 300,98 600,160"
              fill="#f4f3ef"
              stroke="#d4d4d8"
              strokeWidth="1.5"
            />
            <polygon
              points="0,160 300,82 600,160"
              fill="#ffffff"
              stroke="#d4d4d8"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
