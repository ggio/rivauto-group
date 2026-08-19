import React from 'react';

interface PartImageProps {
  type?: string;
  imageUrl?: string;
  part?: { type?: string; category?: string; title?: string; imageUrl?: string };
  className?: string;
  alt?: string;
}

export const PartImage: React.FC<PartImageProps> = ({ type, imageUrl, part, className = "w-full h-full object-contain", alt = "Auto Part" }) => {
  const [imgError, setImgError] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const effectiveImageUrl = imageUrl || part?.imageUrl;
  const effectiveType = type || (part ? `${part.category || ''} ${part.type || ''} ${part.title || ''}` : '');

  // Reset error state if imageUrl changes
  React.useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [effectiveImageUrl]);

  if (effectiveImageUrl && !imgError && effectiveImageUrl.trim() !== '') {
    return (
      <img
        src={effectiveImageUrl}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  const normType = (effectiveType || '').toLowerCase();

  // 1. RADIATOR (Радиаторы)
  if (normType.includes('radiator') || normType.includes('радиатор')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="260" height="140" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="3" />
        {/* Side Tanks */}
        <rect x="20" y="25" width="24" height="150" rx="6" fill="#1E293B" />
        <rect x="256" y="25" width="24" height="150" rx="6" fill="#1E293B" />
        {/* Hose Connections */}
        <rect x="5" y="40" width="20" height="20" rx="4" fill="#334155" />
        <rect x="275" y="130" width="20" height="20" rx="4" fill="#334155" />
        {/* Cooling Fins / Grid Lines */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={i} x1="48" y1={40 + i * 7} x2="252" y2={40 + i * 7} stroke="#CBD5E1" strokeWidth="2.5" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1={60 + i * 16} y1="35" x2={60 + i * 16} y2="165" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 2" />
        ))}
        {/* Mounting Tabs */}
        <circle cx="32" cy="15" r="5" fill="#475569" />
        <circle cx="268" cy="15" r="5" fill="#475569" />
        <circle cx="32" cy="185" r="5" fill="#475569" />
        <circle cx="268" cy="185" r="5" fill="#475569" />
      </svg>
    );
  }

  // 2. WATER PUMP (Насосы водяные)
  if (normType.includes('waterpump') || normType.includes('водяны') || normType.includes('помпа')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="100" r="75" fill="#E2E8F0" stroke="#64748B" strokeWidth="4" />
        {/* Flange Base */}
        <path d="M 90 40 L 210 40 L 230 160 L 70 160 Z" fill="#CBD5E1" opacity="0.4" />
        {/* Impeller Wheel */}
        <circle cx="150" cy="100" r="50" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
        {/* Curved Blades */}
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={`M 150 100 Q ${150 + 40 * Math.cos((i * 60 * Math.PI) / 180)} ${100 + 40 * Math.sin((i * 60 * Math.PI) / 180)} ${
              150 + 55 * Math.cos(((i * 60 + 35) * Math.PI) / 180)
            } ${100 + 55 * Math.sin(((i * 60 + 35) * Math.PI) / 180)}`}
            stroke="#1E293B"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ))}
        <circle cx="150" cy="100" r="20" fill="#1E293B" />
        <circle cx="150" cy="100" r="8" fill="#F8FAFC" />
        {/* Bolt Holes */}
        <circle cx="95" cy="50" r="6" fill="#334155" />
        <circle cx="205" cy="50" r="6" fill="#334155" />
        <circle cx="80" cy="145" r="6" fill="#334155" />
        <circle cx="220" cy="145" r="6" fill="#334155" />
      </svg>
    );
  }

  // 3. FAN / SHROUD (Вентиляторы / Кожух)
  if (normType.includes('fan') || normType.includes('вентилятор') || normType.includes('кожух')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Plastic Shroud Box */}
        <rect x="25" y="20" width="250" height="160" rx="10" fill="#1E293B" stroke="#0F172A" strokeWidth="4" />
        {/* Left Circular Vent */}
        <circle cx="100" cy="100" r="62" fill="#0F172A" stroke="#334155" strokeWidth="3" />
        {/* Right Circular Vent */}
        <circle cx="200" cy="100" r="50" fill="#0F172A" stroke="#334155" strokeWidth="3" />

        {/* Left Fan Motor & Blades */}
        <circle cx="100" cy="100" r="18" fill="#334155" />
        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={i}
            d={`M 100 100 Q ${100 + 35 * Math.cos(((i * 51 + 15) * Math.PI) / 180)} ${
              100 + 35 * Math.sin(((i * 51 + 15) * Math.PI) / 180)
            } ${100 + 58 * Math.cos(((i * 51 + 35) * Math.PI) / 180)} ${100 + 58 * Math.sin(((i * 51 + 35) * Math.PI) / 180)}`}
            stroke="#475569"
            strokeWidth="12"
            strokeLinecap="round"
          />
        ))}

        {/* Right Fan Motor & Blades */}
        <circle cx="200" cy="100" r="14" fill="#334155" />
        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={i}
            d={`M 200 100 Q ${200 + 28 * Math.cos(((i * 51 + 10) * Math.PI) / 180)} ${
              100 + 28 * Math.sin(((i * 51 + 10) * Math.PI) / 180)
            } ${200 + 46 * Math.cos(((i * 51 + 30) * Math.PI) / 180)} ${100 + 46 * Math.sin(((i * 51 + 30) * Math.PI) / 180)}`}
            stroke="#475569"
            strokeWidth="10"
            strokeLinecap="round"
          />
        ))}

        {/* Shroud Mount Brackets */}
        <rect x="15" y="15" width="15" height="25" rx="3" fill="#334155" />
        <rect x="270" y="15" width="15" height="25" rx="3" fill="#334155" />
        <rect x="15" y="160" width="15" height="25" rx="3" fill="#334155" />
        <rect x="270" y="160" width="15" height="25" rx="3" fill="#334155" />
      </svg>
    );
  }

  // 4. THERMOSTAT (Термостаты)
  if (normType.includes('thermostat') || normType.includes('термостат')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100 120 L 140 60 L 210 90 L 170 150 Z" fill="#1E293B" stroke="#334155" strokeWidth="4" />
        <path d="M 140 60 Q 160 30 190 40 Q 220 50 210 90" fill="none" stroke="#0F172A" strokeWidth="24" strokeLinecap="round" />
        <path d="M 140 60 Q 160 30 190 40 Q 220 50 210 90" fill="none" stroke="#1E293B" strokeWidth="18" strokeLinecap="round" />
        {/* Brass Valve Coil */}
        <rect x="110" y="125" width="50" height="40" rx="6" fill="#D97706" stroke="#B45309" strokeWidth="2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1="110" y1={130 + i * 7} x2="160" y2={133 + i * 7} stroke="#F59E0B" strokeWidth="3" />
        ))}
        {/* Flange Bolts */}
        <circle cx="105" cy="115" r="5" fill="#94A3B8" />
        <circle cx="175" cy="155" r="5" fill="#94A3B8" />
      </svg>
    );
  }

  // 5. AC COMPRESSOR (Компрессоры)
  if (normType.includes('compressor') || normType.includes('компрессор')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Aluminum Body Cylinder */}
        <rect x="90" y="50" width="160" height="100" rx="20" fill="#CBD5E1" stroke="#64748B" strokeWidth="4" />
        <rect x="110" y="45" width="120" height="110" rx="10" fill="#94A3B8" opacity="0.3" />
        {/* Magnetic Clutch Pulley Wheel */}
        <rect x="35" y="40" width="45" height="120" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
        <rect x="25" y="60" width="15" height="80" rx="4" fill="#334155" />
        {/* Pulley Ribbed Grooves */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1="38" y1={50 + i * 18} x2="75" y2={50 + i * 18} stroke="#475569" strokeWidth="2" />
        ))}
        {/* Center Nut */}
        <circle cx="57" cy="100" r="12" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
        <circle cx="57" cy="100" r="5" fill="#1E293B" />
        {/* Electrical Plug */}
        <rect x="160" y="30" width="25" height="22" rx="4" fill="#D97706" />
        <rect x="165" y="22" width="15" height="10" rx="2" fill="#78350F" />
      </svg>
    );
  }

  // 6. FILTER (Фильтры)
  if (normType.includes('filter') || normType.includes('фильтр')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Filter Paper Cylinder */}
        <rect x="100" y="25" width="100" height="150" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
        {/* Rubber End Caps */}
        <rect x="90" y="20" width="120" height="18" rx="5" fill="#1E293B" />
        <rect x="90" y="162" width="120" height="18" rx="5" fill="#1E293B" />
        {/* Pleated Paper Lines */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={106 + i * 6} y1="38" x2={106 + i * 6} y2="162" stroke="#EAB308" strokeWidth="3" />
        ))}
        {/* Inner Hole */}
        <ellipse cx="150" cy="29" rx="22" ry="6" fill="#0F172A" />
      </svg>
    );
  }

  // 7. TURBO (Турбины / Турбокомпрессоры)
  if (normType.includes('turbo') || normType.includes('турб')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Compressor Snail Shell */}
        <path d="M 120 40 C 180 30 230 70 220 130 C 210 180 140 180 100 150 C 60 120 70 60 120 40 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="4" />
        <circle cx="150" cy="110" r="35" fill="#94A3B8" stroke="#334155" strokeWidth="3" />
        <circle cx="150" cy="110" r="12" fill="#1E293B" />
        {/* Wastegate Actuator Cylinder */}
        <rect x="220" y="100" width="55" height="30" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <line x1="185" y1="115" x2="220" y2="115" stroke="#94A3B8" strokeWidth="4" />
        {/* Intake Pipe Flange */}
        <rect x="50" y="100" width="30" height="40" rx="6" fill="#64748B" />
      </svg>
    );
  }

  // 8. HEADLIGHT / LIGHTING (Фары / Оптика Luxor)
  if (normType.includes('headlight') || normType.includes('фара') || normType.includes('оптика') || normType.includes('свет')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Aerodynamic Casing */}
        <path d="M 30 140 Q 60 40 220 30 C 260 25 285 70 270 120 C 250 160 120 165 30 140 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" />
        {/* Polycarbonate Clear Lens */}
        <path d="M 40 135 Q 70 48 215 38 C 250 35 270 70 258 115 C 240 150 125 155 40 135 Z" fill="#0284C7" opacity="0.15" />
        {/* Dual Projector LED Lenses */}
        <circle cx="110" cy="100" r="28" fill="#0F172A" stroke="#0EA5E9" strokeWidth="3" />
        <circle cx="110" cy="100" r="18" fill="#38BDF8" opacity="0.8" />
        <circle cx="110" cy="100" r="8" fill="#F0F9FF" />

        <circle cx="190" cy="90" r="22" fill="#0F172A" stroke="#0EA5E9" strokeWidth="3" />
        <circle cx="190" cy="90" r="14" fill="#38BDF8" opacity="0.8" />
        <circle cx="190" cy="90" r="6" fill="#F0F9FF" />

        {/* LED DRL Light Strip */}
        <path d="M 50 125 Q 120 145 240 105" fill="none" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  // 9. BRAKE DISC / PADS (Тормоза)
  if (normType.includes('brake') || normType.includes('диск') || normType.includes('колодк')) {
    return (
      <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="100" r="80" fill="#E2E8F0" stroke="#64748B" strokeWidth="4" />
        <circle cx="150" cy="100" r="40" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
        <circle cx="150" cy="100" r="22" fill="#1E293B" />
        {/* Bolt Holes */}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle
            key={i}
            cx={150 + 30 * Math.cos(((i * 72 - 90) * Math.PI) / 180)}
            cy={100 + 30 * Math.sin(((i * 72 - 90) * Math.PI) / 180)}
            r="5"
            fill="#F8FAFC"
          />
        ))}
        {/* Perforations */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx={150 + 62 * Math.cos((i * 30 * Math.PI) / 180)}
            cy={100 + 62 * Math.sin((i * 30 * Math.PI) / 180)}
            r="3"
            fill="#475569"
          />
        ))}
      </svg>
    );
  }

  // Default: Generic Auto Part
  return (
    <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="40" width="200" height="120" rx="16" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="4" />
      <circle cx="150" cy="100" r="35" fill="#1E293B" />
      <path d="M 120 100 L 180 100 M 150 70 L 150 130" stroke="#F8FAFC" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};
