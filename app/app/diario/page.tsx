'use client';

// PANTALLA "DIARIO" — notas privadas del usuario. Paso 5 de la Secuencia Maestra.
// El botón de crear vive junto a la lista (principio de proximidad, regla UX 12). Estado vacío
// real con mensaje + CTA (regla UX 7) para cuando alguien borre todas sus entradas.

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Lock, NotebookPen, Plus } from 'lucide-react';
import { useEstadoApp } from '@/lib/appLocal';

function formatearFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export default function Diario() {
  const reduce = useReducedMotion();
  const estado = useEstadoApp();
  const entradas = [...estado.diario].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));

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
        className="flex items-start justify-between gap-3"
      >
        <div>
          <h1 className="text-[24px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            Tu diario privado
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-[var(--text-secondary)]">
            <Lock size={13} aria-hidden="true" />
            Privado, protegido con tu cuenta — solo tú lo lees
          </p>
        </div>
        <Link
          href="/app/diario/nueva"
          aria-label="Escribir nueva entrada"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] shadow-[var(--shadow-1)] [touch-action:manipulation]"
        >
          <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      </motion.div>

      {entradas.length === 0 ? (
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.1 }}
          className="mt-16 flex flex-col items-center text-center"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
            <NotebookPen size={26} color="var(--accent)" aria-hidden="true" />
          </span>
          <p className="mt-4 max-w-[260px] text-[14px] leading-snug text-[var(--text-secondary)]">
            Todavía no escribiste nada. Cada noche, después de tu ritual, puedes dejar unas líneas.
          </p>
          <Link
            href="/app/diario/nueva"
            className="mt-6 flex h-[52px] items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
          >
            Escribir mi primera entrada
          </Link>
        </motion.div>
      ) : (
        <motion.ul
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.1 }}
          className="mt-6 flex flex-col gap-3"
        >
          {entradas.map((e) => (
            <li
              key={e.id}
              className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
                {formatearFecha(e.fechaISO)}
              </p>
              <p className="mt-1.5 text-[14px] leading-snug text-[var(--text-primary)]">{e.texto}</p>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
