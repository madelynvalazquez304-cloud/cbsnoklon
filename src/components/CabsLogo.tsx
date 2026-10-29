import React from 'react';

export const CABS_LOGO_URL = '/assets/aistudio/d15b33ebf2643f03c732ae0338fa2daa69cb7330__1__4b0aba02.png';

interface CabsLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  variant?: 'loan' | 'bank' | 'image-only' | string;
}

export const CabsLogo: React.FC<CabsLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const imgHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-14',
    xl: 'h-16',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={CABS_LOGO_URL}
        alt="CABS Logo"
        className={`${imgHeights[size]} w-auto object-contain shrink-0`}
      />
      {showTagline && (
        <div className="hidden sm:block border-l-2 border-[#008670]/30 pl-3">
          <div
            className="text-[11px] font-semibold uppercase tracking-wider text-[#008670]"
            style={{ fontFamily: "'Urbanist', sans-serif" }}
          >
            We&apos;ll Help You Get There
          </div>
        </div>
      )}
    </div>
  );
};
