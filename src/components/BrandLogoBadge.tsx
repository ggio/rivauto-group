import React from 'react';

interface BrandLogoBadgeProps {
  brandId: 'dextra' | 'kaido' | 'katsumoto' | 'luxor' | string;
  customLogoUrl?: string;
  className?: string;
  showCardBackground?: boolean;
  forceCustom?: boolean;
}

export const BrandLogoBadge: React.FC<BrandLogoBadgeProps> = ({
  brandId,
  customLogoUrl,
  className = 'h-9 w-auto',
  forceCustom = false,
}) => {
  const normalizedId = brandId.toLowerCase();

  // If forceCustom or customLogoUrl is present and there's a custom uploaded logo image URL
  if ((forceCustom || customLogoUrl) && customLogoUrl) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black px-2 py-1 ${className}`}>
        <img
          src={customLogoUrl}
          alt={brandId}
          className="h-full w-auto max-w-full object-contain filter brightness-110"
        />
      </div>
    );
  }

  // Vector Logo 1: KATSUMOTO (Japanese Tech & Victory)
  if (normalizedId === 'katsumoto') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black px-1.5 py-0.5 text-white select-none ${className}`}>
        <svg viewBox="0 0 320 130" className="h-full w-auto object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="130" rx="18" fill="#000000" />
          
          {/* KATSUMOTO Main White Samurai Typography */}
          <text
            x="135"
            y="90"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="41"
            fontWeight="900"
            fontFamily="'Impact', 'Arial Black', sans-serif"
            letterSpacing="-1"
          >
            KATSUMOTO
          </text>

          {/* Red Japanese Sun */}
          <circle cx="248" cy="40" r="17" fill="#FF0000" />
          
          {/* Gold Japanese Kanji "勝利" (Victory) */}
          <text x="274" y="36" fill="#D4AF37" fontSize="21" fontWeight="bold" fontFamily="sans-serif">勝</text>
          <text x="274" y="60" fill="#D4AF37" fontSize="21" fontWeight="bold" fontFamily="sans-serif">利</text>
        </svg>
      </div>
    );
  }

  // Vector Logo 2: DEXTRA (choice of mechanics)
  if (normalizedId === 'dextra') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black px-1.5 py-0.5 text-white select-none ${className}`}>
        <svg viewBox="0 0 320 130" className="h-full w-auto object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="130" rx="18" fill="#000000" />
          
          {/* Left Yellow Hazard Diagonal Stripes */}
          <g fill="#FFE600">
            <polygon points="12,56 24,56 12,92 0,92" />
            <polygon points="28,56 40,56 28,92 16,92" />
            <polygon points="44,56 56,56 44,92 32,92" />
            <polygon points="60,56 72,56 60,92 48,92" />
            <polygon points="76,56 88,56 76,92 64,92" />
            <polygon points="92,56 104,56 92,92 80,92" />
            <polygon points="108,56 120,56 108,92 96,92" />
            <polygon points="124,56 136,56 124,92 112,92" />
          </g>

          {/* DEXTRA Bold White Typography */}
          <text x="46" y="66" fill="#FFFFFF" fontSize="42" fontWeight="900" fontFamily="'Arial Black', sans-serif" letterSpacing="-2">
            DEX
          </text>

          {/* Subtitle: choice of mechanics */}
          <text x="144" y="38" fill="#FFFFFF" fontSize="16" fontWeight="300" fontFamily="sans-serif">
            choice
          </text>
          <text x="144" y="52" fill="#FFFFFF" fontSize="16" fontWeight="300" fontFamily="sans-serif">
            of mechanics
          </text>

          <text x="150" y="93" fill="#FFFFFF" fontSize="42" fontWeight="900" fontFamily="'Arial Black', sans-serif" letterSpacing="-2">
            TRA
          </text>

          {/* Right Yellow Chevron Arrows >>> */}
          <g fill="#FFE600">
            <polygon points="236,30 258,61 236,92 254,92 276,61 254,30" />
            <polygon points="258,30 280,61 258,92 276,92 298,61 276,30" />
            <polygon points="280,30 302,61 280,92 298,92 320,61 298,30" />
          </g>
        </svg>
      </div>
    );
  }

  // Vector Logo 3: KAIDO (Japanese & European Suspension)
  if (normalizedId === 'kaido') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black px-1.5 py-0.5 text-white select-none ${className}`}>
        <svg viewBox="0 0 320 130" className="h-full w-auto object-contain" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="130" rx="18" fill="#000000" />
          
          {/* Aggressive Racing KAIDO Text */}
          <g>
            <text
              x="160"
              y="76"
              textAnchor="middle"
              fill="#E61A1A"
              stroke="#E2E8F0"
              strokeWidth="2.5"
              fontSize="52"
              fontWeight="900"
              fontStyle="italic"
              fontFamily="'Impact', 'Trebuchet MS', sans-serif"
              letterSpacing="1"
            >
              KAIDO
            </text>
            
            {/* Speed underline streak tapering to the right */}
            <polygon points="60,88 296,82 82,97" fill="#E61A1A" stroke="#CBD5E1" strokeWidth="1" />
          </g>
        </svg>
      </div>
    );
  }

  // Vector Logo 4: LUXOR (Power Systems & Electronics)
  if (normalizedId === 'luxor') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black px-1.5 py-0.5 text-white select-none ${className}`}>
        <svg viewBox="0 0 320 130" className="h-full w-auto object-contain" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="electricGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="320" height="130" rx="18" fill="#000000" />

          {/* Electric Blue Glow behind LUXOR */}
          <path d="M 130,20 L 180,65 L 140,70 L 185,115 L 145,60 L 175,55 Z" fill="#00BFFF" filter="url(#electricGlow)" opacity="0.8" />

          {/* LUXOR White Text */}
          <text
            x="160"
            y="82"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="52"
            fontWeight="900"
            fontFamily="'Arial Black', 'Montserrat', sans-serif"
            letterSpacing="2"
          >
            LUXOR
          </text>

          {/* Cyan Lightning Bolt cutting through the X */}
          <path
            d="M 152,22 L 182,58 L 158,62 L 190,112 L 160,68 L 182,64 Z"
            fill="#00E5FF"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            filter="url(#electricGlow)"
          />
        </svg>
      </div>
    );
  }

  // Fallback for default brand name
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-black px-3 py-1 text-white font-mono text-xs font-bold uppercase tracking-wider ${className}`}>
      {brandId}
    </div>
  );
};

