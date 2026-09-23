'use client';

// PANTALLA "HOY" (M0) — la más vista de la app, ritual diario. Paso 5 de la Secuencia Maestra.
// Mismo diseño ya aprobado en el mockup (vista-previa-app.html / docs/revisiones), ahora con
// datos reales del estado local (lib/appLocal.ts) en vez de valores fijos de mockup.

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { useEstadoApp } from '@/lib/appLocal';
import { useLecturaDiaria } from '@/lib/astro/useLecturaDiaria';
import { GlifosDivisor } from '@/components/landing/Ornamentos';

function Tile({ label, valor, sufijo, destacada }: { label: string; valor: string | number; sufijo?: string; destacada?: boolean }) {
  return (
    <div
      className={`rounded-[var(--radius-card)] p-3 shadow-[var(--shadow-1)] ${
        destacada
          ? 'border-[1.5px] border-[color-mix(in_oklab,var(--accent-2)_55%,transparent)] bg-[var(--surface)]'
          : 'border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)]'
      }`}
    >
      <p className="text-[11px] font-semibold text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-[19px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)] [font-variant-numeric:lining-nums_tabular-nums]">
        {valor}
        {sufijo && <span className="text-[12px] font-semibold text-[var(--text-secondary)]"> {sufijo}</span>}
      </p>
    </div>
  );
}

export default function Hoy() {
  const reduce = useReducedMotion();
  const estado = useEstadoApp();
  const { estado: estadoLectura, lectura } = useLecturaDiaria();
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
        className="flex flex-col items-center text-center"
      >
        <p className="text-[11px] font-semibold text-[var(--text-secondary)]">
          {esSomatica ? `Día ${estado.diaPrograma} · Modo Somática Activa` : `Noche ${estado.diaPrograma} · Programa de Sanación`}
        </p>
        <h1 className="mt-1 text-[22px] font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
          {esSomatica ? 'Tu liberación de hoy' : 'Tu ritual de esta noche'}
        </h1>
        <div className="mt-2">
          <GlifosDivisor />
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: reduce ? 0 : 0.1 }}
        className="respira-marco relative mx-auto mt-6 flex size-36 items-center justify-center"
      >
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90" role="img" aria-label={`${estado.pctLiberadoHoy} por ciento de tensión liberada`}>
          <circle cx="72" cy="72" r="62" fill="none" strokeWidth="9" stroke="color-mix(in oklab, var(--accent) 16%, transparent)" />
          <motion.circle
            cx="72"
            cy="72"
            r="62"
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            stroke="var(--accent)"
            strokeDasharray={2 * Math.PI * 62}
            initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 62 * (1 - estado.pctLiberadoHoy / 100) }}
            transition={{ duration: reduce ? 0 : 1, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.2 }}
          />
        </svg>
        <span className="absolute flex flex-col items-center">
          <span className="text-[30px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)] [font-variant-numeric:lining-nums_tabular-nums]">
            {estado.pctLiberadoHoy}%
          </span>
          <span className="max-w-[84px] text-[10px] font-semibold leading-tight text-[var(--text-secondary)]">
            tensión liberada hoy
          </span>
        </span>
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.15 }}
        className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
      >
        {estadoLectura === 'cargando' && (
          <div className="flex flex-col gap-2" aria-live="polite" aria-label="Preparando tu lectura de hoy">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]" />
            <div className="h-4 w-full animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]" />
          </div>
        )}
        {estadoLectura === 'lista' && lectura && (
          <>
            <p className="text-[11px] font-semibold text-[var(--accent-2)]">
              {esSomatica ? `Lectura somática — ${lectura.zona}` : `Tu zona de hoy: ${lectura.zona}`}
            </p>
            <p className="mt-2 text-[15px] leading-snug text-[var(--text-primary)]">{lectura.mensaje}</p>

            <div className="mt-4 border-t border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
                ¿Por qué hoy?
              </p>
              <p className="mt-1 text-[13.5px] leading-snug text-[var(--text-secondary)]">{lectura.porque}</p>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-3">
              <Lightbulb size={16} color="var(--accent)" className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-[13.5px] leading-snug text-[var(--text-primary)]">{lectura.consejo}</p>
            </div>
          </>
        )}
        {estadoLectura === 'error' && (
          <p className="text-[14px] text-[var(--text-secondary)]">
            No pudimos preparar tu lectura de hoy. Tu ritual sigue disponible igual.
          </p>
        )}
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.15 }}
        className="mt-6 grid grid-cols-2 gap-3"
      >
        <Tile
          label={esSomatica ? 'Racha de cuidado' : 'Distancia de lo que duele'}
          valor={esSomatica ? estado.rachaDias : estado.diasSinContacto}
          sufijo="días"
          destacada
        />
        <Tile label="Respiración hoy" valor={estado.minutosRespiracionHoy} sufijo="min" />
        <Tile label={esSomatica ? 'Tu progreso' : 'Fase del duelo'} valor={`${estado.diaPrograma}/${estado.totalPrograma}`} />
        <Tile label={esSomatica ? 'Calma de hoy' : 'Calma esta noche'} valor={estado.calmaEstaNoche} />
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.2 }}
      >
        <Link
          href="/app/mecanismo"
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
        >
          {esSomatica
            ? estado.ejercicioHechoHoy
              ? 'Repetir mi Liberación Somática'
              : 'Iniciar Liberación Somática (3 min)'
            : estado.ejercicioHechoHoy
              ? 'Repetir mi ritual'
              : 'Continuar mi ritual'}
        </Link>
      </motion.div>
    </div>
  );
}
