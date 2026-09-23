'use client';

// RUTA DE RESCATE "compré y no me llega" — regla dura de docs/sistema/26-AUTH-MODERNO.md
// (checklist de cierre: "visible en /login, con respuestas uniformes"). Contenido 100% real
// (no depende de Supabase/Hotmart): pasos que la persona puede seguir ya mismo + contacto.

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Clock, Mail, SearchX } from 'lucide-react';

const PASOS = [
  { icon: Clock, texto: 'Espera 2-3 minutos: el correo a veces tarda un poco en llegar.' },
  { icon: SearchX, texto: 'Revisa spam o promociones — a veces el primer correo cae ahí.' },
  { icon: Mail, texto: 'Escríbenos a soporte@astrosoma.app con el correo de tu compra y te damos acceso manual.' },
];

export default function AyudaEntrar() {
  const reduce = useReducedMotion();
  const d = (n: number) => (reduce ? 0 : n);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(700px 420px at 50% -8%, color-mix(in oklab, var(--accent) 8%, transparent) 0%, transparent 60%), ' +
            'radial-gradient(520px 380px at 100% 100%, color-mix(in oklab, var(--accent-2) 6%, transparent) 0%, transparent 55%)',
        }}
      />
      <div className="mx-auto flex min-h-dvh max-w-[440px] flex-col px-5 pb-8">
        <div className="flex h-16 items-center">
          <Link
            href="/entrar"
            aria-label="Atrás"
            className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </Link>
        </div>

        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <h1 className="text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            ¿No te llegó el correo?
          </h1>
          <p className="mt-3 text-[15px] leading-snug text-[var(--text-secondary)]">
            Tranquila, tu compra está segura. Sigue estos pasos en orden:
          </p>
        </motion.div>

        <motion.ul
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.1) }}
          className="mt-6 flex flex-col gap-3"
        >
          {PASOS.map((p, i) => {
            const Icono = p.icon;
            return (
              <li
                key={i}
                className="flex items-start gap-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-[13px] font-bold text-[var(--accent)]">
                  <Icono size={18} aria-hidden="true" />
                </span>
                <p className="pt-2 text-[15px] leading-snug text-[var(--text-primary)]">{p.texto}</p>
              </li>
            );
          })}
        </motion.ul>

        <motion.a
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.2) }}
          href="mailto:soporte@astrosoma.app"
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
        >
          Escribir a soporte
        </motion.a>

        <Link
          href="/entrar"
          className="mt-4 flex h-11 w-full items-center justify-center text-[14px] text-[var(--text-tertiary)] underline [touch-action:manipulation]"
        >
          Volver a intentar
        </Link>

        <div className="flex-1" />
      </div>
    </div>
  );
}
