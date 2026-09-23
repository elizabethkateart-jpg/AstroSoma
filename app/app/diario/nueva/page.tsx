'use client';

// NUEVA ENTRADA DE DIARIO — pantalla dedicada de escritura, sin distracciones.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { agregarEntradaDiario } from '@/lib/appLocal';

const PREGUNTA_POR_DEFECTO = '¿Qué sentiste hoy?';

export default function NuevaEntrada() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [hint, setHint] = useState(false);
  const [pregunta, setPregunta] = useState(PREGUNTA_POR_DEFECTO);

  useEffect(() => {
    let cancelado = false;
    fetch('/api/prompt-diario')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((datos: { pregunta: string }) => {
        if (!cancelado && datos.pregunta) setPregunta(datos.pregunta);
      })
      .catch(() => {
        // se queda con la pregunta por defecto — nunca bloquea la escritura
      });
    return () => {
      cancelado = true;
    };
  }, []);

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) {
      setHint(true);
      return;
    }
    agregarEntradaDiario(texto.trim());
    router.push('/app/diario');
  }

  return (
    <form onSubmit={guardar} className="flex h-full flex-col px-5 pb-6 pt-4">
      <div className="flex items-center justify-between">
        <Link
          href="/app/diario"
          aria-label="Cancelar"
          className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <X size={20} aria-hidden="true" />
        </Link>
        <button
          type="submit"
          className="flex h-11 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-[15px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
        >
          Guardar
        </button>
      </div>

      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 flex flex-1 flex-col"
      >
        <h1 className="text-balance text-[20px] font-bold leading-snug text-[var(--text-primary)] [font-family:var(--font-display)]">
          {pregunta}
        </h1>
        <textarea
          autoFocus
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            if (hint) setHint(false);
          }}
          placeholder="Escribe con tus palabras, nadie más lo lee..."
          aria-describedby={hint ? 'hint-diario' : undefined}
          aria-invalid={hint}
          className="mt-4 flex-1 resize-none rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] p-4 text-[16px] leading-relaxed text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
        />
        {hint && (
          <p id="hint-diario" role="alert" className="mt-2 text-[13px] text-[var(--accent)]">
            Escribe algo antes de guardar
          </p>
        )}
      </motion.div>
    </form>
  );
}
