'use client';

// KIT DE LANDING — §3 AGITACIÓN (blueprint: 55 §3)
// El costo de seguir igual, visible. El tipo de `frases` es string[] a propósito:
// es IMPOSIBLE pasarle un párrafo de 72 palabras — cada frase es corta (máx 2
// líneas; warn a las 18 palabras). El NÚMERO del costo va en [b]/[acento] desde
// el copy marcado (es el dato héroe de la sección). MISMO fondo elevado que §2
// (un solo movimiento visual, sin separador). Cero decoración de miedo.

import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

export interface AgitacionProps {
  /** 2-4 frases MARCADAS y cortas — el array es el contrato: nada de párrafos. */
  frases: string[];
  /** Mini-card opcional "hoy vs en 6 meses" (55 §3). */
  contraste?: {
    labelHoy: string;
    hoy: string;
    labelFuturo: string;
    futuro: string;
    /** Línea corta que cierra la caja empujando hacia el cambio — no es botón, es puente a §4. */
    puente?: string;
    /** Imagen opcional bajo el puente — el momento de "cortar" y decidir soltar. */
    imagenSrc?: string;
  };
  id?: string;
}

export function Agitacion({ frases, contraste, id }: AgitacionProps) {
  warnRango('Agitación → frases', frases.length, 2, 4);
  frases.forEach((f, i) => warnCopy(`Agitación → frase ${i + 1}`, f, 18));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" flush="top" ariaLabel="El costo de seguir igual">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto max-w-[620px]"
      >
        <div className="flex flex-col gap-4">
          {frases.map((f, i) => (
            <motion.p
              key={i}
              variants={item}
              className="text-[17px] leading-[1.6] text-[var(--text-secondary)]"
            >
              <MarkedCopy text={f} />
            </motion.p>
          ))}
        </div>

        {contraste && (
          <motion.div variants={item} className="mt-8 rounded-[var(--radius-card)] bg-[var(--bg)] p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {contraste.labelHoy}
            </p>
            <p className="mt-2 text-[15px] leading-snug text-[var(--text-primary)]">{contraste.hoy}</p>

            <div className="my-4 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)]" />
              <ArrowDown size={16} className="shrink-0 text-[var(--text-tertiary)]" />
              <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)]" />
            </div>

            {/* "si nada cambia": mismo tono apagado — el peso lo pone el copy, no el rojo */}
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {contraste.labelFuturo}
            </p>
            <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">{contraste.futuro}</p>

            {contraste.puente && (
              <p className="mt-5 border-t border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] pt-4 text-[15px] font-semibold text-[var(--accent)]">
                {contraste.puente}
              </p>
            )}

            {contraste.imagenSrc && (
              <div className="respira-marco relative mt-4 overflow-hidden rounded-[var(--radius-card)]">
                <img src={contraste.imagenSrc} alt="" aria-hidden="true" className="aspect-[16/10] w-full object-cover" />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </SectionShell>
  );
}
