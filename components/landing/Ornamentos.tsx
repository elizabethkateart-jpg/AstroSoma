'use client';

// ORNAMENTOS ASTROLÓGICOS — capa visual agregada tras referencia del usuario (2026-09-06):
// wheel de zodiaco sol/luna sobre fondo negro con estrellas y cajas de borde fino dorado.
// Se integra AL kit café-oscuro + beige-dorado ya aprobado (FICHA-ARTE.md) — no lo reemplaza:
// mismos tokens (--accent, --bg, --surface), solo agrega textura/iconografía propia del nicho.

/* Fondo de estrellas: puntos de 4 picos dispersos, tamaño y opacidad variables.
   Absoluto, no interactivo, pensado para secciones oscuras (Hero, CTA final invertido NO). */
export function EstrellasFondo({ cantidad = 28, opacidad = 0.35 }: { cantidad?: number; opacidad?: number }) {
  // Distribución pseudo-aleatoria pero determinística (mismo render en server/cliente).
  const estrellas = Array.from({ length: cantidad }, (_, i) => {
    const seed = (i * 47) % 100;
    const seed2 = (i * 91 + 13) % 100;
    const size = 2 + (i % 4);
    return { left: seed, top: seed2, size, delay: (i % 5) * 0.6 };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {estrellas.map((e, i) => (
        <span
          key={i}
          className="respira-marco absolute block"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            width: e.size,
            height: e.size,
            background: 'var(--accent)',
            clipPath:
              'polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%)',
            opacity: opacidad,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* Glifos de zodiaco (subset — los del dominio somático: Cáncer/Escorpio/Piscis = agua,
   signos emocionales; se usan como viñeta decorativa, nunca como dato astrológico real). */
// ︎ fuerza presentación de texto (línea monocromática), no emoji a color —
// sin esto varios navegadores pintan estos glifos como cuadros de emoji morados.
const GLIFOS_ZODIACO = ['♋︎', '♏︎', '♓︎', '☽︎', '☉︎', '♈︎'];

export function GlifosDivisor() {
  return (
    <div
      className="flex items-center justify-center gap-3 text-[15px] tracking-[0.3em]"
      style={{ color: 'var(--accent)' }}
      aria-hidden="true"
    >
      <span className="h-px w-8" style={{ background: 'color-mix(in oklab, var(--accent) 45%, transparent)' }} />
      {GLIFOS_ZODIACO.slice(0, 3).map((g, i) => (
        <span key={i} className="opacity-80">
          {g}
        </span>
      ))}
      <span className="h-px w-8" style={{ background: 'color-mix(in oklab, var(--accent) 45%, transparent)' }} />
    </div>
  );
}

/* Caja ornamentada: borde fino dorado + florituras (rombos) centradas arriba/abajo,
   como la pill "Offen vergleichen" y las cajas de datos de la referencia. */
export function CajaOrnamentada({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-[var(--radius-card)] border px-5 py-6 ${className}`}
      style={{
        borderColor: 'color-mix(in oklab, var(--accent) 45%, transparent)',
        background: 'color-mix(in oklab, var(--surface) 92%, transparent)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-[5px] left-1/2 size-[9px] -translate-x-1/2 rotate-45"
        style={{ background: 'var(--bg)', borderTop: '1px solid color-mix(in oklab, var(--accent) 60%, transparent)', borderLeft: '1px solid color-mix(in oklab, var(--accent) 60%, transparent)' }}
      />
      {children}
    </div>
  );
}

/* Barra de estadística estilo "compatibilidad" de la referencia (ícono + label + barra + %). */
export function BarraEstadistica({
  icon: Icono,
  label,
  valor,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>;
  label: string;
  valor: number;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Icono size={16} strokeWidth={1.8} aria-hidden={true} />
      <span className="w-[104px] shrink-0 text-[13px] text-[var(--text-secondary)]">{label}</span>
      <span className="h-[6px] flex-1 overflow-hidden rounded-full" style={{ background: 'color-mix(in oklab, var(--text-tertiary) 25%, transparent)' }}>
        <span
          className="block h-full rounded-full"
          style={{ width: `${valor}%`, background: 'var(--accent)' }}
        />
      </span>
      <span className="w-9 shrink-0 text-right text-[13px] font-semibold tabular-nums text-[var(--text-primary)]">
        {valor}%
      </span>
    </div>
  );
}
