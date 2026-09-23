// LOCKUP COMPLETO DE BEYOND: ASTROSOMA — provisto por el usuario (2026-09-10). Se usa SOLO en
// el pie de página (decisión del usuario): en el resto del sitio el nombre visible sigue siendo
// "AstroSoma" y la marca se representa con el isotipo aislado (Isotipo.tsx).

export function LogoCompleto({ width = 220 }: { width?: number }) {
  const height = (width / 1000) * 250;
  return (
    <svg width={width} height={height} viewBox="0 0 1000 250" fill="none" role="img" aria-label="Beyond: AstroSoma">
      <defs>
        <linearGradient id="logo-oro" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F4E0C8" />
          <stop offset="50%" stopColor="#D29E68" />
          <stop offset="100%" stopColor="#B37D46" />
        </linearGradient>
        <linearGradient id="logo-estrella" x1="100" y1="50" x2="200" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8C296" />
        </linearGradient>
      </defs>

      <g transform="translate(20, 15) scale(0.45)">
        <circle cx="250" cy="250" r="210" stroke="#D29E68" strokeWidth="3" strokeOpacity="0.3" strokeDasharray="8 8" />
        <path
          d="M250 80 C150 80 80 155 80 250 C80 345 150 420 250 420 C180 370 135 315 135 250 C135 185 180 130 250 80 Z"
          fill="url(#logo-oro)"
        />
        <path
          d="M300 250 C300 210 330 180 370 180 C330 180 300 150 300 110 C300 150 270 180 230 180 C270 180 300 210 300 250 Z"
          fill="url(#logo-estrella)"
        />
        <circle cx="300" cy="70" r="6" fill="#E8C296" />
        <path d="M300 50 V90 M280 70 H320" stroke="#E8C296" strokeWidth="2" strokeOpacity="0.6" />
      </g>

      <text x="270" y="100" fill="#A0B2C6" fontFamily="Georgia, 'Times New Roman', serif" fontSize="32" fontWeight="400" letterSpacing="14">
        BEYOND
      </text>
      <text x="270" y="170" fill="#D29E68" fontFamily="Georgia, 'Times New Roman', serif" fontSize="58" fontWeight="600" letterSpacing="10">
        ASTROSOMA
      </text>
    </svg>
  );
}
