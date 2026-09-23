'use client';

// PANTALLA "DUELO" — Programa de Sanación, progreso día a día. Paso 5 de la Secuencia Maestra.
// Mismo diseño ya aprobado en el mockup (vista-previa-app.html, Vista 5), con datos reales del
// estado local (lib/appLocal.ts).

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import { useEstadoApp, type CategoriaDuelo } from '@/lib/appLocal';
import { GlifosDivisor } from '@/components/landing/Ornamentos';

// Semana 2 y el texto de "distancia" varían según de qué está sanando la persona (no todos
// vienen de una ruptura de pareja) — ver categoriaDuelo en lib/appLocal.ts.
const SEMANA_2_POR_CATEGORIA: Record<CategoriaDuelo, string> = {
  ruptura: 'Soltar el impulso de contacto',
  perdida: 'Hacerle espacio al recuerdo, sin culpa',
  cambio: 'Soltar la necesidad de tener todo bajo control',
  ansiedad: 'Soltar el pensamiento que no para',
  otro: 'Soltar lo que ya no te sirve cargar',
  somatica: 'Bajar el tono de alerta de tu cuerpo',
};

const DISTANCIA_POR_CATEGORIA: Record<CategoriaDuelo, string> = {
  ruptura: 'días sin contacto',
  perdida: 'días honrando su recuerdo',
  cambio: 'días adaptándote a lo nuevo',
  ansiedad: 'días con más calma',
  otro: 'días en tu proceso',
  somatica: 'días cuidando tu cuerpo',
};

function semanasDe(categoria: CategoriaDuelo) {
  return [
    { n: 1, texto: 'Reconocer dónde vive el dolor' },
    { n: 2, texto: SEMANA_2_POR_CATEGORIA[categoria] },
    { n: 3, texto: 'Reconstruir tu rutina' },
    { n: 4, texto: 'Volver a ti' },
  ];
}

export default function Duelo() {
  const reduce = useReducedMotion();
  const estado = useEstadoApp();
  const semanaActual = Math.ceil(estado.diaPrograma / 7);
  const pct = Math.round((estado.diaPrograma / estado.totalPrograma) * 100);
  const semanas = semanasDe(estado.categoriaDuelo);
  const esSomatica = estado.categoriaDuelo === 'somatica';

  return (
    <div className="relative overflow-hidden px-5 pb-10 pt-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(600px 360px at 50% -8%, color-mix(in oklab, var(--accent) 7%, transparent) 0%, transparent 60%)',
        }}
      />

      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
          {esSomatica ? 'Tu Ritual Diario' : 'Programa de Sanación'}
        </p>
        <h1 className="mt-1 text-[24px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)] [font-variant-numeric:lining-nums_tabular-nums]">
          Día {estado.diaPrograma} de {estado.totalPrograma}
        </h1>
        <div className="mt-2">
          <GlifosDivisor />
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.1 }}
        className="mt-6"
      >
        <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent-2)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
          {estado.diasSinContacto} {DISTANCIA_POR_CATEGORIA[estado.categoriaDuelo]} · vas bien
        </p>
      </motion.div>

      <motion.ul
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.15 }}
        className="mt-6 flex flex-col gap-3"
      >
        {semanas.map((s) => {
          const hecha = s.n < semanaActual;
          const actual = s.n === semanaActual;
          return (
            <li
              key={s.n}
              className={`flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-3 shadow-[var(--shadow-1)] ${
                actual ? 'border border-[color-mix(in_oklab,var(--accent-2)_50%,transparent)]' : ''
              }`}
            >
              <span
                className="flex size-[22px] shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold"
                style={{
                  background: 'color-mix(in oklab, var(--accent-2) 25%, transparent)',
                  color: 'var(--accent-2)',
                }}
              >
                {hecha ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : s.n}
              </span>
              <p className="text-[13.5px] leading-snug text-[var(--text-primary)]">
                <span className="font-semibold">Semana {s.n}</span> · {s.texto}
              </p>
            </li>
          );
        })}
      </motion.ul>

      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.2 }}
      >
        <Link
          href="/app/mecanismo"
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
        >
          Ir a mi ejercicio de hoy
        </Link>
      </motion.div>
    </div>
  );
}
