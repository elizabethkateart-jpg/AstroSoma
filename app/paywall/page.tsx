'use client';

// PAYWALL DE ASTROSOMA — Paso 3 de la Secuencia Maestra (Modelo 2: onboarding-first).
// Llega desde /onboarding (pantalla de resultado → "Ver mi plan de liberación"). Mismos
// tokens/kit que la landing (FICHA-ARTE.md), mismos precios que Oferta.tsx en la landing
// (FICHA-MERCADO.md: Anual $49.99/año, Mensual $8.99/mes, trial 7 días, garantía 15 días).
// El CTA lleva a /entrar (Paso 4, login — aún placeholder): el checkout real de Hotmart se
// conecta en Paso 6 (servicios externos), ver ESTADO.md.

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { X, ShieldCheck, Sparkles, Star, Sunrise, Bell, Lock } from 'lucide-react';
import { CheckCustom, CtaButton, Hairline } from '@/components/landing/ui';
import { GlifosDivisor } from '@/components/landing/Ornamentos';
import { Isotipo } from '@/components/landing/Isotipo';

const FEATURES_ANUAL = [
  'Escaneo somático ilimitado cada día',
  'Programa de Sanación guiado de 30 días',
  'Ejercicios de liberación de 3 minutos',
  'Diario privado, solo tuyo',
];

const FEATURES_MENSUAL = [
  'Escaneo somático ilimitado cada día',
  'Programa de Sanación guiado de 30 días',
  'Ejercicios de liberación de 3 minutos',
  'Cancelas cuando quieras',
];

/* Línea de tiempo de transparencia del trial (patrón "Blinkist"): elimina el miedo a
   cobros sorpresa mostrando exactamente qué pasa y cuándo — Hoy / Día 5 / Día 7. */
function LineaDeTiempo() {
  const pasos = [
    { icon: Sunrise, texto: 'Desbloqueas tu mapa somático y tu plan de liberación.' },
    { icon: Bell, texto: 'Revisa tu prueba gratis antes de que termine.' },
    { icon: Lock, texto: 'Empieza tu suscripción. Cancela antes si no sientes alivio.' },
  ];
  const etiquetas = ['Hoy', 'Día 5', 'Día 7'];
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--surface)] p-4">
      {pasos.map((p, i) => {
        const Icono = p.icon;
        return (
          <div key={etiquetas[i]} className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
              <Icono size={16} color="var(--accent)" aria-hidden="true" />
            </span>
            <p className="pt-1.5 text-[13px] leading-snug text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">{etiquetas[i]}: </span>
              {p.texto}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function Paywall() {
  const reduce = useReducedMotion();
  const d = (n: number) => (reduce ? 0 : n);

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto flex min-h-dvh max-w-[520px] flex-col px-5 pb-8">
        <div className="flex h-16 items-center justify-end">
          <Link
            href="/"
            aria-label="Salir"
            className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <X size={20} aria-hidden="true" />
          </Link>
        </div>

        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <Isotipo size={48} />
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
            Tu resultado está listo
          </p>
          <h1 className="mt-2 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
            Desbloquea tu Programa de Sanación completo
          </h1>
          <div className="mt-3">
            <GlifosDivisor />
          </div>
        </motion.div>

        <motion.ul
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.1) }}
          className="mt-6 flex flex-col gap-3"
        >
          {[
            'Programa guiado de 30 días para tu duelo actual',
            'Ejercicios ilimitados de liberación somática',
            'Diario privado, solo tuyo',
          ].map((f) => (
            <li key={f} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)]">
              <CheckCustom />
              <span>{f}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.15) }}
        >
          <LineaDeTiempo />
        </motion.div>

        {/* ── Anual (recomendado) ── */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.2) }}
          className="relative mt-8"
        >
          <span className="absolute -top-[10px] left-1/2 z-10 -translate-x-1/2 rounded-full border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
            Más popular
          </span>
          <Hairline emphasis surface="surface" className="shadow-[0_12px_36px_color-mix(in_oklab,var(--accent)_16%,transparent)]">
            <div className="rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent)_5%,transparent)] p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">Anual</h2>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
                  <Star size={12} strokeWidth={2.5} aria-hidden="true" />7 días gratis
                </span>
              </div>
              <div className="mt-4">
                <p className="flex items-baseline gap-1">
                  <span className="text-[36px] font-bold leading-none text-[var(--text-primary)] [font-family:var(--font-display)] [font-variant-numeric:lining-nums_tabular-nums]">
                    $4.17
                  </span>
                  <span className="text-[14px] text-[var(--text-secondary)]">/mes</span>
                </p>
                <p className="mt-1 text-[12px] text-[var(--text-secondary)]">Se cobra $49.99/año</p>
                <p className="mt-2 text-[15px] font-semibold text-[var(--accent)]">Ahorra 54%</p>
              </div>
              <ul className="mt-5 flex flex-col gap-3">
                {FEATURES_ANUAL.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)]">
                    <CheckCustom />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CtaButton href="/entrar" fullMobile>
                  Empezar mis 7 días gratis
                </CtaButton>
              </div>
            </div>
          </Hairline>
        </motion.div>

        {/* ── Mensual ── */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.28) }}
          className="mt-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-1)]"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">Mensual</h2>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--bg)]">
              <Star size={12} strokeWidth={2.5} aria-hidden="true" />7 días gratis
            </span>
          </div>
          <p className="mt-4 flex items-baseline gap-1">
            <span className="text-[36px] font-bold leading-none text-[var(--text-primary)] [font-family:var(--font-display)] [font-variant-numeric:lining-nums_tabular-nums]">
              $8.99
            </span>
            <span className="text-[14px] text-[var(--text-secondary)]">/mes</span>
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {FEATURES_MENSUAL.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)]">
                <CheckCustom />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/entrar"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] text-[16px] font-semibold text-[var(--accent)] transition-colors duration-150 [touch-action:manipulation]"
          >
            Empezar con el mensual
          </Link>
        </motion.div>

        {/* ── Garantía + confianza ── */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.34) }}
          className="mt-6 flex flex-col items-center gap-2 text-center"
        >
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <ShieldCheck size={16} color="var(--accent)" aria-hidden="true" />
            15 días de garantía tras tu cobro · sin preguntas
          </span>
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <Sparkles size={16} color="var(--accent)" aria-hidden="true" />
            Sin compromisos · cancela fácilmente cuando quieras, sin cobros ocultos
          </span>
        </motion.div>

        <div className="flex-1" />
      </div>
    </div>
  );
}
