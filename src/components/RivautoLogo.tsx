import React from 'react';

interface RivautoLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'badge';
  darkTheme?: boolean;
}

export const RivautoLogo: React.FC<RivautoLogoProps> = ({
  className = 'h-10 w-auto',
  variant = 'full',
  darkTheme = false,
}) => {
  const textColor = darkTheme ? '#FFFFFF' : '#000000';
  const greenColor = '#10B981'; // Vibrant emerald green checkmark

  if (variant === 'badge' || variant === 'icon') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Dark Background Card */}
        <rect width="100" height="100" rx="18" fill="#18181B" />

        {/* Thick White Outer Frame Box */}
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="12"
          fill="#222021"
          stroke="#FFFFFF"
          strokeWidth="7"
        />

        {/* Letter "R" (Top Left) */}
        <g fill="#FFFFFF">
          <path d="M 18,20 L 46,20 C 53,20 53,33 46,35 L 50,51 L 38,51 L 35,36 L 29,36 L 29,51 L 18,51 Z M 29,27 L 41,27 C 43,27 44,29 44,30.5 C 44,32 43,33 41,33 L 29,33 Z" />
        </g>

        {/* Letter "A" (Bottom Right) */}
        <g fill="#FFFFFF">
          <path d="M 68,48 L 50,82 L 62,82 L 65,74 L 76,74 L 79,82 L 90,82 Z M 70,59 L 74,68 L 67,68 Z" />
        </g>

        {/* Green Dynamic Checkmark swooping across middle and breaking top-right frame */}
        <path
          d="M 23,56 C 18,58 24,66 28,64 C 33,61 36,66 40,82 C 43,87 47,82 50,75 C 65,50 82,28 96,14 C 99,11 101,8 96,12 C 80,28 62,50 49,69 C 45,75 42,75 39,68 C 34,58 28,54 23,56 Z"
          fill="#22C55E"
        />
      </svg>
    );
  }

  // Full Wordmark Logo matching the provided reference image
  return (
    <svg
      viewBox="0 0 1100 380"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={textColor}>
        {/* R */}
        <path d="M 0,132 L 0,252 L 30,252 L 30,204 L 60,204 L 98,252 L 140,252 L 95,198 C 118,190 128,172 128,150 C 128,132 110,132 80,132 Z M 30,156 L 78,156 C 92,156 98,162 98,171 C 98,180 92,184 78,184 L 30,184 Z" />

        {/* I */}
        <path d="M 185,132 L 215,132 L 215,252 L 185,252 Z" />

        {/* Green Checkmark V */}
        <path
          d="M 225,155 C 240,165 255,195 290,265 C 300,285 308,285 318,260 C 350,180 420,70 488,22 C 496,17 500,10 485,20 C 400,80 325,180 300,225 C 285,190 268,160 248,148 C 238,142 220,148 225,155 Z"
          fill={greenColor}
        />

        {/* A */}
        <path d="M 420,132 L 345,252 L 378,252 L 398,220 L 460,220 L 480,252 L 512,252 L 448,132 Z M 410,200 L 429,165 L 448,200 Z" />

        {/* U */}
        <path d="M 520,132 L 520,220 C 520,242 538,254 565,254 C 592,254 610,242 610,220 L 610,132 L 580,132 L 580,215 C 580,226 575,230 565,230 C 555,230 550,226 550,215 L 550,132 Z" />

        {/* T */}
        <path d="M 622,132 L 730,132 L 730,158 L 691,158 L 691,252 L 661,252 L 661,158 L 622,158 Z" />

        {/* O */}
        <path d="M 760,132 C 730,132 720,150 720,192 C 720,234 730,252 760,252 L 830,252 C 860,252 870,234 870,192 C 870,150 860,132 830,132 Z M 760,158 L 830,158 C 840,158 842,168 842,192 C 842,216 840,226 830,226 L 760,226 C 750,226 748,216 748,192 C 748,168 750,158 760,158 Z" />
      </g>

      {/* G R O U P */}
      <g fill={textColor}>
        {/* G */}
        <path d="M 2,320 C 2,305 10,298 30,298 L 58,298 L 58,312 L 28,312 C 18,312 16,316 16,325 C 16,334 18,338 28,338 L 46,338 L 46,328 L 32,328 L 32,316 L 58,316 L 58,352 L 30,352 C 10,352 2,345 2,330 Z" />

        {/* R */}
        <path d="M 234,298 L 260,298 C 280,298 288,304 288,315 C 288,322 282,326 272,328 L 290,352 L 272,352 L 256,330 L 248,330 L 248,352 L 234,352 Z M 248,310 L 258,310 C 268,310 272,312 272,316 C 272,320 268,322 258,322 L 248,322 Z" />

        {/* O */}
        <path d="M 460,298 C 480,298 488,305 488,325 C 488,345 480,352 460,352 C 440,352 432,345 432,325 C 432,305 440,298 460,298 Z M 460,312 C 450,312 446,316 446,325 C 446,334 450,338 460,338 C 470,338 474,334 474,325 C 474,316 470,312 460,312 Z" />

        {/* U */}
        <path d="M 636,298 L 650,298 L 650,336 C 650,340 654,342 662,342 C 670,342 674,340 674,336 L 674,298 L 688,298 L 688,336 C 688,348 678,352 662,352 C 646,352 636,348 636,336 Z" />

        {/* P */}
        <path d="M 838,298 L 866,298 C 884,298 890,304 890,318 C 890,332 884,336 866,336 L 852,336 L 852,352 L 838,352 Z M 852,310 L 864,310 C 872,310 876,312 876,318 C 876,324 872,326 864,326 L 852,326 Z" />
      </g>
    </svg>
  );
};
