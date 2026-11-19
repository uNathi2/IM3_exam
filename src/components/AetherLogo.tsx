import React from 'react';
import { assetUrl } from '../utils/assetPath';

interface AetherLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'masthead';
  showMag?: boolean;
  inverted?: boolean;
}

export const AetherLogo: React.FC<AetherLogoProps> = ({
  className = '',
  size = 'md',
  showMag = true,
  inverted = false,
}) => {
  const heightClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9.5',
    lg: 'h-10 sm:h-12',
    xl: 'h-12 sm:h-16',
    masthead: 'h-16 sm:h-24 md:h-32 lg:h-36',
  }[size];

  const magTextClasses = {
    sm: 'text-xl tracking-tight -ml-1',
    md: 'text-2xl sm:text-3xl tracking-tight -ml-1.5',
    lg: 'text-3xl sm:text-4xl tracking-tight -ml-2',
    xl: 'text-4xl sm:text-5xl tracking-tight -ml-2.5',
    masthead: 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight -ml-2 sm:-ml-4',
  }[size];

  return (
    <div className={`flex items-baseline gap-0.5 select-none ${className}`}>
      <img
        src={assetUrl('/assets/works/Asset_86_6953afe4.svg')}
        alt="æther."
        className={`${heightClasses} w-auto object-contain brightness-0 ${
          inverted ? 'invert' : ''
        } transition-all duration-200`}
      />
      {showMag && (
        <span
          className={`font-serif-editorial italic font-light transition-colors ${
            inverted
              ? 'text-zinc-300 group-hover:text-purple-200'
              : 'text-zinc-700 group-hover:text-purple-700'
          } ${magTextClasses}`}
        >
          mag
        </span>
      )}
    </div>
  );
};
