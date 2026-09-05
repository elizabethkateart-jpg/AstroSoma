'use client';

// AÑADIDO DEL PROYECTO (no es una de las 10 secciones canónicas — se documenta en ESTADO.md):
// demo concreta de tono, pedida explícitamente por FICHA-AVATAR.md ("demo de un mensaje real"
// como diferenciador ante un mercado saturado de 14 apps). Usa SOLO piezas del kit (SectionShell,
// Kicker, Hairline, useReveal) — ningún hex/fuente propio.

import { motion } from 'motion/react';
import { Hairline, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export function MensajeContraste() {
  const { contenedor, item } = useReveal();
  return (
    <SectionShell elevacion="base" ariaLabel="La diferencia de tono">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-xl text-center">
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
          <Hairline surface="surface" className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              AstroSoma
            </p>
            <p className="mt-2 text-sm leading-snug text-[var(--text-primary)] italic">
              &ldquo;Hoy tu tránsito acumula tensión en el pecho. Aquí tienes 3 minutos para soltarla.&rdquo;
            </p>
          </Hairline>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
