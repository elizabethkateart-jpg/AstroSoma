'use client';

// PANTALLA "PERFIL" — plan y ajustes básicos. Paso 5 de la Secuencia Maestra.
// Pantalla secundaria (no es una de las 4 que deciden el dinero) — checklist + medición, sin
// ronda de revisor-visual (regla 7 del SO).

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Bell, ChevronRight, FileText, LogOut, MoonStar, Pencil, ShieldCheck, Sun, User } from 'lucide-react';
import { useEstadoApp } from '@/lib/appLocal';

function Fila({ icon: Icono, label, href }: { icon: typeof Bell; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex h-14 items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] px-4 shadow-[var(--shadow-1)] [touch-action:manipulation]"
    >
      <Icono size={18} color="var(--text-secondary)" aria-hidden="true" />
      <span className="flex-1 text-[15px] text-[var(--text-primary)]">{label}</span>
      <ChevronRight size={16} color="var(--text-tertiary)" aria-hidden="true" />
    </Link>
  );
}

function FilaEstado({ icon: Icono, label, estado }: { icon: typeof Bell; label: string; estado: string }) {
  return (
    <div className="flex h-14 items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] px-4 shadow-[var(--shadow-1)]">
      <Icono size={18} color="var(--text-secondary)" aria-hidden="true" />
      <span className="flex-1 text-[15px] text-[var(--text-primary)]">{label}</span>
      <span className="text-[13px] text-[var(--text-tertiary)]">{estado}</span>
    </div>
  );
}

export default function Perfil() {
  const reduce = useReducedMotion();
  const estado = useEstadoApp();

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
        className="flex items-center gap-3"
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
          <User size={24} color="var(--accent)" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-semibold text-[var(--text-primary)]">
            {estado.nombre || estado.emailCuenta}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)]">{estado.rachaDias} días de racha</p>
        </div>
        <Link
          href="/app/perfil/editar"
          aria-label="Editar perfil"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] shadow-[var(--shadow-1)] [touch-action:manipulation]"
        >
          <Pencil size={15} color="var(--text-secondary)" aria-hidden="true" />
        </Link>
      </motion.div>

      {(estado.fechaNacimiento || estado.ciudadNacimiento) && (
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.05 }}
          className="mt-2 text-[13px] text-[var(--text-tertiary)]"
        >
          {[estado.fechaNacimiento, estado.ciudadNacimiento].filter(Boolean).join(' · ')}
        </motion.p>
      )}

      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.1 }}
        className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] p-4"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
          Tu plan
        </p>
        <p className="mt-1 text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          {estado.plan}
        </p>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          Escaneo somático ilimitado + Programa de Sanación completo
        </p>
      </motion.div>

      {estado.solNatal && estado.lunaNatal && (
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.12 }}
          className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
            Tu carta natal
          </p>
          <div className="mt-2 flex gap-4">
            <div className="flex items-center gap-2">
              <Sun size={16} color="var(--accent)" aria-hidden="true" />
              <span className="text-[14px] text-[var(--text-primary)]">Sol en {estado.solNatal}</span>
            </div>
            <div className="flex items-center gap-2">
              <MoonStar size={16} color="var(--accent)" aria-hidden="true" />
              <span className="text-[14px] text-[var(--text-primary)]">Luna en {estado.lunaNatal}</span>
            </div>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-[var(--text-tertiary)]">
            Con esto se personaliza tu lectura diaria — cruzamos el tránsito de hoy con tu carta real.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.15 }}
        className="mt-6 flex flex-col gap-2"
      >
        <FilaEstado icon={Bell} label="Notificaciones" estado="Activadas" />
        <Fila icon={ShieldCheck} label="Privacidad" href="/privacidad" />
        <Fila icon={FileText} label="Términos y condiciones" href="/terminos" />
      </motion.div>

      <motion.a
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.2 }}
        href="/"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] text-[15px] font-semibold text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        <LogOut size={16} aria-hidden="true" />
        Cerrar sesión
      </motion.a>
    </div>
  );
}
