'use client';

// EJERCICIO DE 3 MINUTOS ("Mecanismo") — el corazón del loop de retención. Paso 5 de la
// Secuencia Maestra. Mismo diseño ya aprobado en el mockup (vista-previa-app.html, Vista 4).
// Al completarse, marca ejercicioHechoHoy en el estado local — es la "acción" del loop
// gatillo(abrir Hoy) → acción(este ejercicio) → recompensa(alivio + % liberado) → inversión
// (racha/Programa de Sanación avanza), definido antes de construir la app interna.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { useEstadoApp, guardarEstado } from '@/lib/appLocal';
import { CajaOrnamentada, GlifosDivisor } from '@/components/landing/Ornamentos';
import { Celebracion } from '@/components/app/Celebracion';

function formatearTiempo(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Mecanismo() {
  const reduce = useReducedMotion();
  const estado = useEstadoApp();
  const duracionTotal = reduce ? 9 : 180;
  const [restante, setRestante] = useState(duracionTotal);
  const terminado = restante <= 0;

  useEffect(() => {
    if (terminado) return;
    const t1 = setTimeout(() => setRestante((r) => r - 1), 1000);
    return () => clearTimeout(t1);
  }, [restante, terminado]);

  useEffect(() => {
    if (terminado) {
      guardarEstado({ ...estado, ejercicioHechoHoy: true, pctLiberadoHoy: 72, minutosRespiracionHoy: 3 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado]);

  if (terminado) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <motion.div
          initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Celebracion size={140} />
        </motion.div>
        <h1 className="mt-6 text-[24px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          Tensión liberada
        </h1>
        <p className="mt-2 max-w-[260px] text-[14px] leading-snug text-[var(--text-secondary)]">
          Hiciste tu ritual de hoy. Tu racha sigue viva.
        </p>
        <Link
          href="/app"
          className="mt-8 flex h-[52px] w-full max-w-[280px] items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
        >
          Volver a Hoy
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center px-5 pt-4 text-center">
      <div className="flex h-16 w-full items-center justify-end">
        <Link
          href="/app"
          aria-label="Salir del ejercicio"
          className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <X size={20} aria-hidden="true" />
        </Link>
      </div>

      <p className="text-[11px] font-semibold text-[var(--text-secondary)]">
        Liberación somática · {estado.zonaHoy}
      </p>
      <h1 className="mt-1 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Respira conmigo
      </h1>
      <div className="mt-2">
        <GlifosDivisor />
      </div>

      <motion.div
        animate={reduce ? {} : { scale: [1, 1.12, 1.12, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mt-10 flex size-36 items-center justify-center rounded-full"
        style={{
          background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)',
          border: '1.5px solid color-mix(in oklab, var(--accent) 45%, transparent)',
        }}
      >
        <span className="text-[15px] font-bold text-[var(--accent)] [font-family:var(--font-display)]">
          Inhala…
        </span>
      </motion.div>

      <p className="mt-6 text-[26px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)] [font-variant-numeric:lining-nums_tabular-nums]">
        {formatearTiempo(restante)}
      </p>

      <div className="mt-5 w-full max-w-[320px]">
        <CajaOrnamentada>
          <p className="text-center text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
            Deja que el aire baje hasta donde sientes la opresión. Suelta despacio, sin forzar.
          </p>
        </CajaOrnamentada>
      </div>
    </div>
  );
}
