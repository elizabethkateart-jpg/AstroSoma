'use client';

// PANTALLA "PREGUNTAS" — consultas puntuales del día ("me duele la cabeza, no dormí bien...")
// con límite diario de 3 (contado en el servidor). Mismo lenguaje visual que Diario/Hoy.

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MessageCircleHeart, Send, Sparkles } from 'lucide-react';

type Item = { id?: string; pregunta: string; respuesta: string; created_at: string };

const LIMITE_DIARIO = 3;

function formatearHora(iso: string) {
  return new Date(iso).toLocaleTimeString('es', { hour: 'numeric', minute: '2-digit' });
}

export default function Preguntas() {
  const reduce = useReducedMotion();
  const [historial, setHistorial] = useState<Item[]>([]);
  const [restantesHoy, setRestantesHoy] = useState(LIMITE_DIARIO);
  const [cargando, setCargando] = useState(true);
  const [pregunta, setPregunta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelado = false;
    fetch('/api/pregunta-libre')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((datos: { historial: Item[]; restantesHoy: number }) => {
        if (cancelado) return;
        setHistorial(datos.historial);
        setRestantesHoy(datos.restantesHoy);
      })
      .catch(() => setError('No pudimos cargar tus preguntas de hoy.'))
      .finally(() => !cancelado && setCargando(false));
    return () => {
      cancelado = true;
    };
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!pregunta.trim() || enviando || restantesHoy <= 0) return;
    setEnviando(true);
    setError('');
    try {
      const r = await fetch('/api/pregunta-libre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta: pregunta.trim() }),
      });
      const datos = await r.json();
      if (!r.ok) {
        setError(datos.error ?? 'No se pudo enviar tu pregunta.');
        return;
      }
      setHistorial((h) => [...h, datos.item]);
      setRestantesHoy(datos.restantesHoy);
      setPregunta('');
    } catch {
      setError('No se pudo enviar tu pregunta. Revisa tu conexión.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="relative overflow-hidden px-5 pb-32 pt-6">
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
        <h1 className="text-[24px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¿Qué te pasa hoy?
        </h1>
        <p className="mt-1 text-[12.5px] text-[var(--text-secondary)]">
          {cargando ? 'Cargando...' : `Te quedan ${restantesHoy} de ${LIMITE_DIARIO} preguntas hoy`}
        </p>
      </motion.div>

      {!cargando && historial.length === 0 && (
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.1 }}
          className="mt-16 flex flex-col items-center text-center"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
            <MessageCircleHeart size={26} color="var(--accent)" aria-hidden="true" />
          </span>
          <p className="mt-4 max-w-[280px] text-[14px] leading-snug text-[var(--text-secondary)]">
            Cuéntame qué te duele o qué sientes hoy — como "tengo dolor de cabeza, no dormí bien" — y
            te doy una lectura y un consejo.
          </p>
        </motion.div>
      )}

      <motion.ul
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.1 }}
        className="mt-6 flex flex-col gap-3"
      >
        {historial.map((item, i) => (
          <li
            key={item.id ?? i}
            className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
              {formatearHora(item.created_at)}
            </p>
            <p className="mt-1.5 text-[14px] leading-snug text-[var(--text-primary)]">{item.pregunta}</p>
            <div className="mt-3 flex items-start gap-2 border-t border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] pt-3">
              <Sparkles size={15} className="mt-0.5 shrink-0" color="var(--accent)" aria-hidden="true" />
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">{item.respuesta}</p>
            </div>
          </li>
        ))}
      </motion.ul>

      {error && (
        <p role="alert" className="mt-4 text-[13px] text-[var(--accent)]">
          {error}
        </p>
      )}

      {!cargando && (
        <form
          onSubmit={enviar}
          className="fixed inset-x-0 bottom-[88px] z-10 flex justify-center px-5"
        >
          <div className="flex w-full max-w-[420px] items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent)_18%,transparent)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-2)] backdrop-blur-sm">
            <input
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              placeholder={restantesHoy > 0 ? 'Escribe qué te pasa hoy...' : 'Ya usaste tus preguntas de hoy'}
              disabled={restantesHoy <= 0 || enviando}
              maxLength={400}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!pregunta.trim() || enviando || restantesHoy <= 0}
              aria-label="Enviar pregunta"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] [touch-action:manipulation] disabled:opacity-40"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
