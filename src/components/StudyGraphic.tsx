import React, { useMemo, useId, useState, useEffect } from 'react';
import { assetUrl } from '../utils/assetPath';

interface StudyGraphicProps {
  type: 'monochrome_signal' | 'composite_quad' | 'amber_field' | 'thermal_mask' | 'textile_folds' | 'where_light_stays';
  className?: string;
  seed?: number;
  src?: string;
  videoSrc?: string;
  alt?: string;
  lightGround?: boolean;
}

const DEFAULT_STUDY_IMAGES: Partial<Record<StudyGraphicProps['type'], string>> = {
  monochrome_signal: '/assets/works/Flower_null2_1abbc4c7.png',
  composite_quad: '/assets/works/Flowerout1_c62f2090.png',
  amber_field: '/assets/works/MikeandNion2_561526a1.png',
  thermal_mask: '/assets/works/MikeandNion3_89012bc3.png',
};

export const StudyGraphic: React.FC<StudyGraphicProps> = ({
  type,
  className = 'w-full h-full',
  seed = 42,
  src,
  videoSrc,
  alt,
  lightGround,
}) => {
  const uid = useId().replace(/:/g, '');
  const rawSrc = src || DEFAULT_STUDY_IMAGES[type];
  const resolvedSrc = rawSrc ? assetUrl(rawSrc) : undefined;
  const resolvedVideoSrc = videoSrc ? assetUrl(videoSrc) : undefined;
  const isLight =
    lightGround ?? (type === 'amber_field' && (!src || src === DEFAULT_STUDY_IMAGES.amber_field));
  const [imgFailed, setImgFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
    setVideoFailed(false);
  }, [resolvedSrc, resolvedVideoSrc]);

  const elements = useMemo(() => {
    const pseudoRandom = (n: number) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };

    return { pseudoRandom };
  }, [seed]);

  if (resolvedVideoSrc && !videoFailed) {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return (
      <div className={`relative bg-black overflow-hidden transform-gpu ${className}`}>
        <video
          src={resolvedVideoSrc}
          poster={resolvedSrc}
          autoPlay={!prefersReducedMotion}
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={alt || type.replace(/_/g, ' ')}
          onError={() => setVideoFailed(true)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (resolvedSrc && !imgFailed) {
    return (
      <div className={`relative ${isLight ? 'bg-white' : 'bg-black'} overflow-hidden transform-gpu ${className}`}>
        <img
          src={resolvedSrc}
          alt={alt || type.replace(/_/g, ' ')}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
        {!isLight && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
        )}
      </div>
    );
  }

  if (type === 'monochrome_signal') {
    const gradId = `monoGlow-${uid}`;
    const hazeId = `monoHaze-${uid}`;
    return (
      <div className={`relative bg-black overflow-hidden transform-gpu ${className}`}>
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
              <stop offset="42%" stopColor="#c4b5fd" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={hazeId} cx="35%" cy="38%" r="48%">
              <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.48" />
              <stop offset="60%" stopColor="#52525b" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="#050507" />
          <ellipse cx="200" cy="150" rx="165" ry="118" fill={`url(#${gradId})`} />
          <circle cx="145" cy="112" r="95" fill={`url(#${hazeId})`} />
          <circle cx="275" cy="182" r="80" fill={`url(#${hazeId})`} />

          {/* Procedural signal stipple cluster */}
          {Array.from({ length: 120 }).map((_, i) => {
            const rx = elements.pseudoRandom(i * 2 + 1);
            const ry = elements.pseudoRandom(i * 2 + 2);
            const cx = 60 + rx * 280;
            const cy = 35 + ry * 230;
            const dist = Math.hypot((cx - 200) / 150, (cy - 150) / 105);
            if (dist > 1.15) return null;
            return (
              <circle
                key={`dot-${i}`}
                cx={cx}
                cy={cy}
                r={0.6 + rx * 1.4}
                fill="#ffffff"
                opacity={Math.max(0.15, (1.1 - dist) * 0.72)}
              />
            );
          })}

          {/* Organic noise branches */}
          {Array.from({ length: 42 }).map((_, i) => {
            const r = elements.pseudoRandom(i);
            const x1 = 115 + r * 170;
            const y1 = 42 + i * 5;
            const x2 = x1 + Math.sin(i * 0.7) * 42;
            const y2 = y1 + 30;
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} Q ${x1 + 15} ${y1 + 15} ${x2} ${y2}`}
                stroke="#ffffff"
                strokeWidth={r > 0.5 ? '1.35' : '0.75'}
                strokeOpacity={0.35 + r * 0.5}
                strokeDasharray={r > 0.7 ? '2 3' : 'none'}
                fill="none"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 dither-pattern pointer-events-none opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (type === 'composite_quad') {
    const gridId = `quadGrid-${uid}`;
    return (
      <div className={`relative bg-[#070709] overflow-hidden transform-gpu ${className}`}>
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="none" stroke="#27272a" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="#09090b" />
          <rect width="400" height="300" fill={`url(#${gridId})`} />

          <rect x="30" y="30" width="160" height="240" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <rect x="210" y="30" width="160" height="110" fill="#121215" stroke="#3f3f46" strokeWidth="1" />
          <rect x="210" y="160" width="160" height="110" fill="#0c0c0f" stroke="#3f3f46" strokeWidth="1" />

          <rect x="150" y="120" width="100" height="150" fill="#000000" stroke="#52525b" strokeWidth="1" />

          {Array.from({ length: 30 }).map((_, i) => {
            const r = elements.pseudoRandom(i + 100);
            return (
              <circle
                key={i}
                cx={50 + r * 120}
                cy={50 + i * 6.5}
                r={1 + r * 2}
                fill="#ffffff"
                opacity={0.3 + r * 0.6}
              />
            );
          })}

          <line x1="200" y1="0" x2="200" y2="300" stroke="#52525b" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="0" y1="150" x2="400" y2="150" stroke="#52525b" strokeWidth="0.5" strokeDasharray="3 3" />
          <text x="40" y="50" fill="#71717a" fontSize="8" fontFamily="monospace">OUT 1.2 · TOP</text>
          <text x="220" y="50" fill="#71717a" fontSize="8" fontFamily="monospace">DISPLACE · A</text>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (type === 'amber_field') {
    const amberId = `amberGlow-${uid}`;
    const coreId = `amberCore-${uid}`;
    return (
      <div className={`relative bg-[#080302] overflow-hidden transform-gpu ${className}`}>
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id={amberId} cx="42%" cy="45%" r="58%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.92" />
              <stop offset="38%" stopColor="#d97706" stopOpacity="0.65" />
              <stop offset="72%" stopColor="#92400e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={coreId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.8" />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="#0a0502" />

          <ellipse cx="180" cy="145" rx="170" ry="100" fill={`url(#${amberId})`} />
          <circle cx="280" cy="112" r="92" fill={`url(#${coreId})`} opacity="0.75" />
          <path
            d="M 55 225 Q 140 85 260 158 T 365 118"
            stroke="#fbbf24"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
            opacity="0.38"
          />
          <path
            d="M 65 220 Q 145 92 260 158 T 360 120"
            stroke="#fde68a"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
          />

          {Array.from({ length: 55 }).map((_, i) => {
            const r = elements.pseudoRandom(i + 200);
            return (
              <circle
                key={i}
                cx={60 + r * 280}
                cy={50 + ((i * 7) % 195)}
                r={0.8 + r * 2.1}
                fill={r > 0.5 ? '#fde68a' : '#f59e0b'}
                opacity={0.35 + r * 0.6}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (type === 'thermal_mask') {
    const thermalId = `thermalHead-${uid}`;
    return (
      <div className={`relative bg-[#090703] overflow-hidden transform-gpu ${className}`}>
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id={thermalId} cx="50%" cy="45%" r="45%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#ca8a04" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#713f12" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="#0c0a05" />

          <ellipse cx="200" cy="145" rx="75" ry="95" fill={`url(#${thermalId})`} opacity="0.9" />

          {Array.from({ length: 60 }).map((_, i) => {
            const r = elements.pseudoRandom(i + 300);
            const cx = 130 + r * 140;
            const cy = 60 + ((i * 5) % 170);
            return (
              <rect
                key={i}
                x={cx}
                y={cy}
                width={1.2 + r * 2}
                height={1.2 + r * 2}
                fill={r > 0.6 ? '#fef08a' : '#ca8a04'}
                opacity={0.3 + r * 0.7}
              />
            );
          })}

          <ellipse cx="180" cy="130" rx="15" ry="12" fill="#422006" opacity="0.5" />
          <ellipse cx="220" cy="130" rx="15" ry="12" fill="#422006" opacity="0.5" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (type === 'textile_folds') {
    const fabricId = `fabricShade-${uid}`;
    return (
      <div className={`relative bg-[#141416] overflow-hidden transform-gpu ${className}`}>
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id={fabricId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#a1a1aa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#27272a" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="#09090b" />

          <g transform="translate(40, 20)">
            <line x1="80" y1="0" x2="100" y2="60" stroke="#71717a" strokeWidth="1" />
            <line x1="240" y1="0" x2="220" y2="60" stroke="#71717a" strokeWidth="1" />

            <path
              d="M 90 60 C 130 90, 150 160, 110 240 C 130 220, 160 210, 170 240 C 190 200, 210 180, 230 240 C 230 180, 240 100, 220 60 Z"
              fill={`url(#${fabricId})`}
            />
            <path d="M 120 70 Q 145 130 135 230" stroke="#18181b" strokeWidth="4" opacity="0.6" fill="none" />
            <path d="M 160 65 Q 180 140 175 235" stroke="#18181b" strokeWidth="5" opacity="0.7" fill="none" />
            <path d="M 200 70 Q 215 150 210 230" stroke="#18181b" strokeWidth="4" opacity="0.6" fill="none" />
          </g>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // where_light_stays
  return (
    <div className={`relative bg-[#07050d] overflow-hidden transform-gpu ${className}`}>
      <svg viewBox="0 0 400 300" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#06030b" />

        <polygon points="0,150 90,142 160,147 240,140 320,145 400,150 400,300 0,300" fill="#040207" />

        <circle cx="200" cy="100" r="45" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.95" />
        <circle cx="200" cy="100" r="48" fill="none" stroke="#c084fc" strokeWidth="1.5" opacity="0.6" />

        <ellipse cx="200" cy="200" rx="45" ry="32" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 4" opacity="0.75" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="#2e1065" strokeWidth="0.8" opacity="0.6" />

        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={elements.pseudoRandom(i) * 400}
            cy={elements.pseudoRandom(i + 50) * 140}
            r={elements.pseudoRandom(i + 80) > 0.8 ? 1.2 : 0.6}
            fill="#ffffff"
            opacity={0.3 + elements.pseudoRandom(i + 90) * 0.7}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
