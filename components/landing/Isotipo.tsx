// ISOTIPO OFICIAL DE BEYOND: ASTROSOMA — provisto por el usuario (2026-09-10), reemplaza el
// sello sol/luna provisional (`SelloSolLuna` en Ornamentos.tsx, ahora retirado) en todos los
// lugares donde ese sello servía como marca de identidad: Hero de la landing, Oferta, login y
// paywall. Luna protectora + estrella de luz somática, degradé dorado — mismos tonos de
// --accent/--accent-2 ya aprobados, sin inventar color nuevo.

export function Isotipo({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" role="img" aria-label="Beyond: AstroSoma">
      <defs>
        <linearGradient id="isotipo-oro" x1="80" y1="80" x2="250" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F4E0C8" />
          <stop offset="50%" stopColor="#D29E68" />
          <stop offset="100%" stopColor="#B37D46" />
        </linearGradient>
        <linearGradient id="isotipo-estrella" x1="230" y1="110" x2="370" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#E8C296" />
          <stop offset="100%" stopColor="#D29E68" />
        </linearGradient>
      </defs>

      <circle cx="250" cy="250" r="210" stroke="#D29E68" strokeWidth="3" strokeOpacity="0.3" strokeDasharray="8 8" />
      <circle cx="250" cy="250" r="228" stroke="#E8C296" strokeWidth="1" strokeOpacity="0.15" />

      <path
        d="M250 80 C150 80 80 155 80 250 C80 345 150 420 250 420 C180 370 135 315 135 250 C135 185 180 130 250 80 Z"
        fill="url(#isotipo-oro)"
      />
      <path
        d="M300 250 C300 210 330 180 370 180 C330 180 300 150 300 110 C300 150 270 180 230 180 C270 180 300 210 300 250 Z"
        fill="url(#isotipo-estrella)"
      />

      <circle cx="300" cy="70" r="6" fill="#E8C296" />
      <path d="M300 50 V90 M280 70 H320" stroke="#E8C296" strokeWidth="2" strokeOpacity="0.6" />
      <circle cx="410" cy="180" r="5" fill="#E8C296" />
      <path d="M410 165 V195 M395 180 H425" stroke="#E8C296" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="360" cy="330" r="4" fill="#D29E68" />
    </svg>
  );
}
