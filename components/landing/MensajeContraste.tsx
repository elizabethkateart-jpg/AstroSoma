'use client';

// AÑADIDO DEL PROYECTO (no es una de las 10 secciones canónicas — se documenta en ESTADO.md):
// demo concreta de tono, pedida explícitamente por FICHA-AVATAR.md ("demo de un mensaje real"
// como diferenciador ante un mercado saturado de 14 apps). Usa SOLO piezas del kit (SectionShell,
// Kicker, useReveal) — ningún hex/fuente propio. Borde superior propio (no Hairline: el kit ya
// usa 3 hairlines en Solución/Oferta/Garantía, el máximo recomendado por vista).

import { motion } from 'motion/react';
import { Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

/* Dispositivo ownable de FICHA-ARTE.md: fase lunar como firma visual de marca —
   8 fases, de creciente a llena y de vuelta. Motivo decorativo propio de AstroSoma
   (astrología + ciclos), independiente del indicador lineal que usa la pantalla
   de Duelo dentro de la app. */
/* Fase lunar en CSS puro con dos círculos superpuestos (técnica de eclipse):
   un disco "sombra" (--surface-2) se desliza sobre el disco iluminado (--accent),
   igual que el terminador real de la luna — no un gráfico de pastel. */
function FaseLunar() {
  const fases = [0.06, 0.25, 0.45, 0.7, 0.9, 1, 0.75, 0.35];
  const llena = 5;
  const diametro = 20;
  return (
    <div className="mb-5 flex items-center justify-center gap-3" aria-hidden="true">
      {fases.map((f, i) => {
        const desplazamiento = Math.round(f * diametro);
        return (
          <span
            key={i}
            className={`relative block size-5 overflow-hidden rounded-full bg-[var(--accent)] ${i === llena ? 'respira-marco' : ''}`}
            style={{ boxShadow: i === llena ? '0 0 10px color-mix(in oklab, var(--accent) 60%, transparent)' : undefined }}
          >
            <span
              className="absolute top-0 size-5 rounded-full bg-[var(--surface-2)]"
              style={{ left: `${desplazamiento}px` }}
            />
          </span>
        );
      })}
    </div>
  );
}

export function MensajeContraste() {
  const { contenedor, item } = useReveal();
  return (
    <SectionShell
      elevacion="base"
      ariaLabel="La diferencia de tono"
      className="border-t border-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]"
    >
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-xl text-center">
          <FaseLunar />
          <Kicker>LA DIFERENCIA</Kicker>
          <h2 className="text-balance text-3xl font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)] md:text-4xl">
            Mismo tránsito, otro tono
          </h2>
        </motion.div>

        <motion.div variants={item} className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface-2)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
              Otra app de astrología
            </p>
            <p className="mt-2 text-sm leading-snug text-[var(--text-secondary)] italic">
              &ldquo;Mercurio retrógrado en tu casa 7 anuncia conflictos y traiciones. Cuidado hoy.&rdquo;
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              AstroSoma
            </p>
            <p className="mt-2 text-sm leading-snug text-[var(--text-primary)] italic">
              &ldquo;Hoy tu tránsito acumula tensión en el pecho. Aquí tienes 3 minutos para soltarla.&rdquo;
            </p>
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
