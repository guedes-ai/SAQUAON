import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'symbol';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const SaquaOnLogo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  inverted = false,
  className = '',
  showTagline = true,
}) => {
  const textColor = inverted ? '#FFFFFF' : '#004F8A';
  const waveTopColor = inverted ? '#70C5F5' : '#4FA8D8';
  const waveBottomColor = inverted ? '#FFFFFF' : '#004F8A';
  const tagColor = inverted ? '#CBD5E1' : '#0F172A';

  const scaleMap = {
    sm: { height: 32, imgHeight: 'h-8 sm:h-9', textClass: 'text-xl' },
    md: { height: 44, imgHeight: 'h-10 sm:h-11 md:h-12', textClass: 'text-2xl sm:text-3xl' },
    lg: { height: 56, imgHeight: 'h-14 sm:h-16', textClass: 'text-3xl sm:text-4xl' },
    xl: { height: 76, imgHeight: 'h-20 sm:h-24', textClass: 'text-5xl' },
  };

  const currentScale = scaleMap[size];

  // If inverted is true, render the high-contrast inverted SVG vector
  if (inverted) {
    return (
      <div className={`inline-flex flex-col items-start ${className}`} id="brand-logo-inverted">
        <div className="flex items-center tracking-tight font-black leading-none" style={{ color: textColor }}>
          <span
            className={`${currentScale.textClass} font-black tracking-[-0.025em] font-display flex items-center select-none`}
            style={{ fontFamily: "'Montserrat', 'Arial Black', sans-serif" }}
          >
            <span>SAQUA</span>
            <span className="inline-block relative">
              <svg
                viewBox="0 0 78 86"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block"
                style={{
                  height: '0.82em',
                  width: '0.98em',
                  verticalAlign: '-0.07em',
                  margin: '0 0.04em',
                }}
              >
                {/* Upper Sky Blue Barrel Wave */}
                <path
                  d="M 0 46 C 18 48, 32 34, 46 22 C 55 14, 66 15, 73 24 C 77 30, 75 40, 66 45 C 55 50, 39 46, 22 48 C 11 49, 4 48, 0 46 Z"
                  fill={waveTopColor}
                />
                {/* Lower swell bowl */}
                <path
                  d="M 1 55 C 16 63, 32 59, 50 54 C 65 50, 75 54, 78 53 C 75 76, 59 87, 39 87 C 18 87, 5 74, 1 55 Z"
                  fill={waveBottomColor}
                />
              </svg>
            </span>
            <span>N</span>
          </span>
        </div>

        {showTagline && variant === 'full' && (
          <span
            className="text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase mt-1 select-none"
            style={{ color: tagColor, fontFamily: "'Montserrat', sans-serif" }}
          >
            Uma nova forma de viver as praias de Saquarema.
          </span>
        )}
      </div>
    );
  }

  // Symbol variant (Wave O mark alone)
  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`} id="brand-symbol">
        <svg
          viewBox="0 0 78 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: currentScale.height, width: 'auto' }}
        >
          <path
            d="M 0 46 C 18 48, 32 34, 46 22 C 55 14, 66 15, 73 24 C 77 30, 75 40, 66 45 C 55 50, 39 46, 22 48 C 11 49, 4 48, 0 46 Z"
            fill={waveTopColor}
          />
          <path
            d="M 1 55 C 16 63, 32 59, 50 54 C 65 50, 75 54, 78 53 C 75 76, 59 87, 39 87 C 18 87, 5 74, 1 55 Z"
            fill={waveBottomColor}
          />
        </svg>
      </div>
    );
  }

  // Primary variant using the exact official logo
  return (
    <div className={`inline-flex items-center select-none ${className}`} id="brand-logo">
      <img
        src="/logo-saquaon-horizontal.svg"
        alt="SAQUA ON - Uma nova forma de viver as praias de Saquarema"
        className={`${currentScale.imgHeight} w-auto object-contain drop-shadow-xs`}
        loading="eager"
      />
    </div>
  );
};
