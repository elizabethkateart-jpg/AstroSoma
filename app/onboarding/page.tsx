'use client';

// ONBOARDING DE ASTROSOMA — Paso 2 de la Secuencia Maestra.
// Deriva de FICHA-AVATAR.md (57): cada pregunta ecoa un dolor/deseo real, nunca decorativa.
// Estructura (ampliada 2026-09-08 a pedido del usuario, comparando contra el patrón de
// Nebula/The Pattern/Noom): 6 preguntas (02B regla 1: una decisión por pantalla) + 2
// reconocimientos (A5, el 2º ahora dinámico — sirve de diferenciador si el usuario ya usó
// otra app) + loading "armando tu plan" (B) + resultado personalizado = 10 pantallas.
// Categoría bienestar/hábito → 4-8 pasos de alto rendimiento (02B); 10 se justifica por el
// patrón de diferenciación (pregunta 5) sin inventar datos ni pedir fecha/hora/ciudad de
// nacimiento real — eso requiere el motor de cálculo astrológico real, que es Paso 6
// (servicios externos) y todavía no existe. Pedir esos datos ahora sin usarlos rompería la
// promesa de privacidad de la propia app.

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, X, HeartCrack, Waves, HelpCircle, Sunrise, Sun, MoonStar, Moon, MessageCircleHeart, BedDouble, Sparkles, Briefcase, Brain, Weight, Zap, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CajaOrnamentada, GlifosDivisor, EstrellasFondo } from '@/components/landing/Ornamentos';
import { useLecturaDiaria } from '@/lib/astro/useLecturaDiaria';
import { guardarCategoriaDuelo, guardarCategoriaSomatica } from '@/lib/appLocal';

type Intent = 'duelo' | 'somatica';

type Respuestas = {
  frecuencia?: string;
  situacion?: string;
  zona?: string;
  momento?: string;
  experiencia?: string;
  meta?: string;
};

const TOTAL_PREGUNTAS = 6;

/* Dispositivo ownable de FICHA-ARTE.md: fase lunar como indicador de progreso —
   mismo disco-sombra-sobre-disco-iluminado de la landing (MensajeContraste.tsx),
   aplicado aquí como avance del onboarding en vez de decoración aislada. */
function LunaProgreso({ frac }: { frac: number }) {
  // Piso de 12%: incluso en 0 preguntas respondidas se ve una fracción iluminada,
  // para que el indicador se lea como "progreso en 0%" y no como un ícono roto.
  const fracVisible = Math.max(0.12, frac);
  const desplazamiento = Math.round(fracVisible * 28);
  return (
    <span className="relative block size-7 shrink-0 overflow-hidden rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--accent)]">
      <motion.span
        className="absolute top-0 size-7 rounded-full bg-[var(--bg)]"
        animate={{ left: desplazamiento }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}

function BarraProgreso({ paso, total = TOTAL_PREGUNTAS }: { paso: number; total?: number }) {
  const frac = Math.min(1, paso / total);
  const pct = Math.max(8, Math.round(frac * 100));
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="h-[3px] flex-1 rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)]">
        <motion.div
          className="h-full rounded-full bg-[var(--accent)]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <LunaProgreso frac={frac} />
    </div>
  );
}

function ModalSalir({ onCancelar, onSalir }: { onCancelar: () => void; onSalir: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] px-5 pb-8 backdrop-blur-sm sm:items-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] p-5 text-center"
      >
        <h2 className="text-[19px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          ¿Salir ahora?
        </h2>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Tus respuestas no se guardan.</p>
        <button
          type="button"
          onClick={onCancelar}
          className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
        >
          Seguir aquí
        </button>
        <button
          type="button"
          onClick={onSalir}
          className="mt-3 flex h-11 w-full items-center justify-center text-[14px] text-[var(--text-tertiary)] underline [touch-action:manipulation]"
        >
          Salir sin guardar
        </button>
      </motion.div>
    </motion.div>
  );
}

function Header({ paso, total, onAtras }: { paso: number; total?: number; onAtras?: () => void }) {
  const router = useRouter();
  const [modalAbierto, setModalAbierto] = useState(false);
  return (
    <div className="flex items-center gap-3 pt-4">
      <button
        type="button"
        onClick={onAtras}
        aria-label="Atrás"
        className={`flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation] ${onAtras ? '' : 'invisible'}`}
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
      <BarraProgreso paso={paso} total={total} />
      <button
        type="button"
        aria-label="Salir del escaneo"
        onClick={() => setModalAbierto(true)}
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        <X size={20} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {modalAbierto && (
          <ModalSalir onCancelar={() => setModalAbierto(false)} onSalir={() => router.push('/')} />
        )}
      </AnimatePresence>
    </div>
  );
}

interface Opcion {
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>;
  label: string;
}

function PantallaPregunta({
  paso,
  total,
  pregunta,
  subcopy,
  opciones,
  otraCosa,
  onElegir,
  onAtras,
}: {
  paso: number;
  total?: number;
  pregunta: string;
  subcopy?: string;
  opciones: Opcion[];
  otraCosa?: boolean;
  onElegir: (valor: string) => void;
  onAtras?: () => void;
}) {
  const reduce = useReducedMotion();
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [otraAbierta, setOtraAbierta] = useState(false);
  const [textoOtra, setTextoOtra] = useState('');
  const [hintOtra, setHintOtra] = useState(false);
  const inputOtraRef = useRef<HTMLInputElement>(null);

  function elegir(valor: string) {
    setSeleccion(valor);
    setTimeout(() => onElegir(valor), 300);
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden px-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(680px 680px at 50% 82%, color-mix(in oklab, var(--accent-2) 20%, transparent) 0%, transparent 65%)',
        }}
      />
      <EstrellasFondo cantidad={22} opacidad={0.3} />
      <Header paso={paso} total={total} onAtras={onAtras} />
      <motion.div
        initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: reduce ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 flex flex-1 flex-col"
      >
        <h1 className="text-balance text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {pregunta}
        </h1>
        {subcopy && <p className="mt-2 text-[14px] text-[var(--text-secondary)]">{subcopy}</p>}

        {!otraAbierta ? (
          <div className="mt-8 flex flex-col gap-3">
            {opciones.map((op, i) => {
              const Icono = op.icon;
              const activo = seleccion === op.label;
              return (
                <motion.button
                  key={op.label}
                  type="button"
                  initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : i * 0.06 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => elegir(op.label)}
                  className={`flex h-14 w-full items-center gap-3 rounded-[var(--radius-card)] border px-4 text-left text-[16px] font-medium transition-colors [touch-action:manipulation] ${
                    activo
                      ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)]'
                      : 'border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] text-[var(--text-primary)]'
                  }`}
                >
                  {Icono && <Icono size={20} strokeWidth={2} aria-hidden={true} />}
                  <span className="flex-1">{op.label}</span>
                  {activo && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="size-5 rounded-full bg-[var(--accent)]"
                    />
                  )}
                </motion.button>
              );
            })}
            {otraCosa && (
              <button
                type="button"
                onClick={() => setOtraAbierta(true)}
                className="mt-1 text-left text-[14px] text-[var(--text-tertiary)] underline"
              >
                Otra cosa (escríbela tú)
              </button>
            )}
          </div>
        ) : (
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (textoOtra.trim()) {
                onElegir(textoOtra.trim());
              } else {
                setHintOtra(true);
                inputOtraRef.current?.focus();
              }
            }}
          >
            <input
              ref={inputOtraRef}
              autoFocus
              value={textoOtra}
              onChange={(e) => {
                setTextoOtra(e.target.value);
                if (hintOtra) setHintOtra(false);
              }}
              placeholder="Escribe con tus palabras..."
              aria-describedby={hintOtra ? 'hint-otra-cosa' : undefined}
              aria-invalid={hintOtra}
              className="h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
            />
            {hintOtra && (
              <p id="hint-otra-cosa" role="alert" className="mt-2 text-[13px] text-[var(--accent)]">
                Escribe algo para continuar
              </p>
            )}
            <button
              type="submit"
              className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
            >
              Continuar
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function PantallaReconocimiento({
  paso,
  total,
  titulo,
  cuerpo,
  notaCaja,
  onContinuar,
  onAtras,
}: {
  paso: number;
  total?: number;
  titulo: string;
  cuerpo: string;
  notaCaja?: string;
  onContinuar: () => void;
  onAtras?: () => void;
}) {
  const reduce = useReducedMotion();
  const d = (n: number) => (reduce ? 0 : n);
  return (
    <div className="flex min-h-dvh flex-col px-5">
      <Header paso={paso} total={total} onAtras={onAtras} />
      <div className="flex flex-1 flex-col justify-center">
      <motion.div
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center text-center"
      >
        <motion.span
          initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: d(0.1) }}
          className="respira-marco flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]"
        >
          <MoonStar size={30} color="var(--accent)" aria-hidden={true} />
        </motion.span>
        <motion.h1
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.2) }}
          className="mt-6 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]"
        >
          {titulo}
        </motion.h1>
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.25) }}
          className="mt-3"
        >
          <GlifosDivisor />
        </motion.div>
        <motion.p
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.3) }}
          className="mt-4 max-w-[335px] text-[16px] leading-snug text-[var(--text-secondary)]"
        >
          {cuerpo}
        </motion.p>
        {notaCaja && (
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(0.35) }}
            className="mt-5 w-full max-w-[335px]"
          >
            <CajaOrnamentada>
              <p className="text-[14px] font-semibold text-[var(--accent)]">{notaCaja}</p>
            </CajaOrnamentada>
          </motion.div>
        )}
      </motion.div>
      <motion.button
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: d(0.4) }}
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onContinuar}
        className="mt-10 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
      >
        Continuar
      </motion.button>
      </div>
    </div>
  );
}

function PantallaLoading({ onListo }: { onListo: () => void }) {
  const reduce = useReducedMotion();
  const pasos = ['Leyendo tu carta natal...', 'Ubicando tu zona de tensión...', 'Armando tu ejercicio de 3 minutos...'];
  const [activo, setActivo] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) return;
    // TODO(Paso 6 — servicios externos): reemplazar por la llamada real que arma
    // el escaneo; el catch de esa llamada es quien debe llamar a setError(true).
    // El flag ?simular_error=1 deja probar la pantalla de error mientras tanto.
    const falla = new URLSearchParams(window.location.search).get('simular_error') === '1';
    const t1 = setTimeout(() => setActivo(1), reduce ? 200 : 900);
    const t2 = setTimeout(() => setActivo(2), reduce ? 400 : 1800);
    const t3 = setTimeout(() => (falla ? setError(true) : onListo()), reduce ? 600 : 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <h1 className="text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          No pudimos armar tu escaneo
        </h1>
        <p className="mt-2 max-w-[280px] text-[14px] text-[var(--text-secondary)]">
          Revisa tu conexión e intenta de nuevo. Tus respuestas siguen guardadas.
        </p>
        <button
          type="button"
          onClick={() => {
            setActivo(0);
            setError(false);
          }}
          className="mt-6 flex h-[52px] items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-8 text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <span className="respira-marco flex size-20 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
        <Sun size={34} color="var(--accent)" aria-hidden={true} />
      </span>
      <h1 className="mt-8 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Armando tu Escaneo Somático
      </h1>
      <div className="mt-3">
        <GlifosDivisor />
      </div>
      <div className="mt-8 flex flex-col gap-3">
        {pasos.map((p, i) => (
          <p
            key={p}
            className={`text-[15px] transition-opacity duration-300 ${i <= activo ? 'opacity-100 text-[var(--text-primary)]' : 'opacity-30 text-[var(--text-secondary)]'}`}
          >
            {i < activo ? '✓ ' : ''}
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

/* Conteo del número héroe sincronizado con el trazo del anillo (baseline de
   movimiento del proyecto: los datos clave cuentan hacia arriba, nunca aparecen
   estáticos). Respeta reduced-motion mostrando el valor final de inmediato. */
function ConteoNumero({ hasta, reduce }: { hasta: number; reduce: boolean | null }) {
  const [valor, setValor] = useState(reduce ? hasta : 0);
  useEffect(() => {
    if (reduce) return;
    const duracionMs = 1100;
    const inicio = performance.now();
    let frame: number;
    const tick = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracionMs);
      setValor(Math.round(t * hasta));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasta, reduce]);
  return <>{valor}</>;
}

function PantallaResultado({
  respuestas,
  intent,
  onEditar,
}: {
  respuestas: Respuestas;
  intent: Intent;
  onEditar: () => void;
}) {
  const reduce = useReducedMotion();
  const { estado: estadoLectura, lectura } = useLecturaDiaria();
  // El título muestra la zona que el usuario sintió al responder; en cuanto el tránsito real
  // (IA) resuelve, se actualiza a la zona astrológica — es el "revelado" que prometió la
  // pantalla de carga ("Leyendo tu carta natal...").
  const zona = (lectura?.zona ?? respuestas.zona ?? 'tu cuerpo').toLowerCase();

  // Persistimos la categoría una sola vez — el Programa de Sanación (pantalla Duelo) la usa
  // para no asumir que todos vienen de una ruptura de pareja, ni que todos vienen de un duelo.
  useEffect(() => {
    if (intent === 'somatica') {
      guardarCategoriaSomatica();
    } else {
      guardarCategoriaDuelo(respuestas.situacion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-10">
      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center"
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
          Tu escaneo de hoy
        </p>
        <h1 className="mt-3 text-balance text-[30px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Hoy tu tensión vive en {zona}
        </h1>
        <div className="mt-3">
          <GlifosDivisor />
        </div>
        <div className="respira-marco relative mt-8 flex size-40 items-center justify-center">
          <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90" role="img" aria-label="72 por ciento de tensión detectada">
            <circle cx="80" cy="80" r="70" fill="none" strokeWidth="10" stroke="color-mix(in oklab, var(--accent) 16%, transparent)" />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="var(--accent)"
              strokeDasharray={2 * Math.PI * 70}
              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - 0.72) }}
              transition={{ duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.2 }}
            />
          </svg>
          <span className="absolute text-[40px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)] [font-variant-numeric:lining-nums_tabular-nums]">
            <ConteoNumero hasta={72} reduce={reduce} />%
          </span>
        </div>
        <p className="mt-3 text-[13px] text-[var(--text-secondary)]">tensión detectada — lista para liberar</p>

        <div className="mt-8 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] p-4 text-left">
          {estadoLectura === 'cargando' && (
            <div className="flex flex-col gap-2" aria-live="polite" aria-label="Preparando tu lectura de hoy">
              <div className="h-3 w-24 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]" />
              <div className="h-4 w-full animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)]" />
            </div>
          )}
          {estadoLectura === 'lista' && lectura && (
            <>
              <p className="text-[11px] font-semibold text-[var(--accent-2)]">Tu tránsito de hoy</p>
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
            <p className="text-[13px] text-[var(--text-secondary)]" role="alert">
              No pudimos preparar tu lectura de hoy. Tu escaneo sigue disponible igual.
            </p>
          )}
        </div>

        <div className="mt-4 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] p-4 text-left">
          <p className="text-[13px] text-[var(--text-secondary)]">
            {respuestas.meta
              ? `Tu meta de los próximos 30 días: `
              : 'Tu primer paso:'}
            <span className="font-semibold text-[var(--text-primary)]"> {respuestas.meta ?? 'sentir alivio real hoy'}</span>
          </p>
        </div>
      </motion.div>

      <motion.a
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.2 }}
        whileTap={{ scale: 0.97 }}
        href="/paywall"
        className="mt-10 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
      >
        Ver mi plan de liberación
      </motion.a>
      <motion.button
        type="button"
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.25 }}
        onClick={onEditar}
        className="mt-3 flex h-11 w-full items-center justify-center text-[13px] text-[var(--text-tertiary)] underline [touch-action:manipulation]"
      >
¿Algo no encajó? Vuelve a empezar el escaneo
      </motion.button>
      <div className="flex-1" />
    </div>
  );
}

// Ruta "Duelo" (rupturas/pérdidas/cambios/ansiedad) — la ruta original, sin tocar. Ver ESTADO.md
// 2026-09-14: es adicional, no reemplazo — el duelo se queda, solo se amplía con una segunda ruta.
const PASOS_DUELO = [
  'pregunta-frecuencia',
  'pregunta-situacion',
  'pregunta-zona',
  'pregunta-momento',
  'pregunta-experiencia',
  'reconocimiento-1',
  'pregunta-meta',
  'reconocimiento-2',
  'loading',
  'resultado',
] as const;

// Ruta "Salud Somática" (malestar físico constante, sin duelo de por medio) — más corta:
// zona corporal + frecuencia, directo al reconocimiento/revelación con el mismo motor de IA.
const PASOS_SOMATICA = [
  'pregunta-zona-somatica',
  'pregunta-frecuencia-somatica',
  'reconocimiento-1',
  'loading',
  'resultado',
] as const;

type PasoId = 'pregunta-intent' | (typeof PASOS_DUELO)[number] | (typeof PASOS_SOMATICA)[number];

function pasosPara(intent: Intent | null): PasoId[] {
  if (intent === 'somatica') return ['pregunta-intent', ...PASOS_SOMATICA];
  if (intent === 'duelo') return ['pregunta-intent', ...PASOS_DUELO];
  return ['pregunta-intent'];
}

export default function Onboarding() {
  const [indice, setIndice] = useState(0);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const pasos = useMemo(() => pasosPara(intent), [intent]);
  const paso = pasos[indice];

  function avanzar() {
    setIndice((i) => Math.min(i + 1, pasos.length - 1));
  }
  function retroceder() {
    setIndice((i) => Math.max(i - 1, 0));
  }
  function reiniciar() {
    setIntent(null);
    setRespuestas({});
    setIndice(0);
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <AnimatePresence mode="wait">
        {paso === 'pregunta-intent' && (
          <PantallaPregunta
            key="intent"
            paso={0}
            total={intent === 'somatica' ? 3 : 7}
            pregunta="¿Qué te trae por acá hoy?"
            opciones={[
              { icon: HeartCrack, label: 'Estoy procesando una pérdida o un cambio' },
              { icon: Sparkles, label: 'Tengo un malestar físico constante' },
            ]}
            onElegir={(v) => {
              setIntent(v.startsWith('Tengo un malestar') ? 'somatica' : 'duelo');
              setIndice(1);
            }}
          />
        )}
        {paso === 'pregunta-zona-somatica' && (
          <PantallaPregunta
            key="zona-somatica"
            paso={1}
            total={3}
            pregunta="¿En qué zona de tu cuerpo sientes mayor tensión o malestar recurrente?"
            opciones={[
              { icon: Brain, label: 'Cabeza / Rostro' },
              { icon: MessageCircleHeart, label: 'Cuello / Garganta' },
              { icon: HeartCrack, label: 'Pecho / Corazón' },
              { icon: Waves, label: 'Estómago / Intestinos' },
              { icon: Weight, label: 'Hombros / Espalda' },
            ]}
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, zona: v }));
              avanzar();
            }}
            onAtras={retroceder}
          />
        )}
        {paso === 'pregunta-frecuencia-somatica' && (
          <PantallaPregunta
            key="frecuencia-somatica"
            paso={2}
            total={3}
            pregunta="¿Con qué frecuencia experimentas esta molestia?"
            opciones={[
              { icon: Sunrise, label: 'Casi todos los días al despertar o antes de dormir' },
              { icon: Zap, label: 'Aparece de golpe cuando me estreso o me abrumo' },
              { icon: MoonStar, label: 'Es un malestar silencioso que no me deja estar en paz' },
            ]}
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, frecuencia: v }));
              avanzar();
            }}
            onAtras={retroceder}
          />
        )}
        {paso === 'pregunta-frecuencia' && (
          <PantallaPregunta
            key="frecuencia"
            paso={1}
            total={7}
            pregunta="¿Sientes una opresión en el pecho o un nudo en la garganta?"
            opciones={[
              { icon: HeartCrack, label: 'Sí, a diario' },
              { icon: Waves, label: 'A veces' },
              { icon: Moon, label: 'Solo por las noches' },
            ]}
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, frecuencia: v }));
              avanzar();
            }}
            onAtras={retroceder}
          />
        )}
        {paso === 'pregunta-situacion' && (
          <PantallaPregunta
            key="situacion"
            paso={2}
            total={7}
            pregunta="¿Qué está pasando en tu vida ahora mismo?"
            opciones={[
              { icon: HeartCrack, label: 'Rompí con mi pareja' },
              { icon: MoonStar, label: 'Perdí a alguien que quería' },
              { icon: Briefcase, label: 'Viví un cambio fuerte (trabajo, mudanza...)' },
              { icon: Waves, label: 'Siento estrés o ansiedad sostenida' },
            ]}
            otraCosa
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, situacion: v }));
              avanzar();
            }}
            onAtras={retroceder}
          />
        )}
        {paso === 'pregunta-zona' && (
          <PantallaPregunta
            key="zona"
            paso={3}
            total={7}
            pregunta="¿Dónde sientes la tensión ahora mismo?"
            subcopy="Esto define tu primer ejercicio de hoy"
            opciones={[
              { icon: HeartCrack, label: 'Pecho' },
              { icon: MessageCircleHeart, label: 'Garganta' },
              { icon: Waves, label: 'Estómago' },
              { icon: HelpCircle, label: 'No lo tengo claro' },
            ]}
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, zona: v }));
              avanzar();
            }}
            onAtras={retroceder}
          />
        )}
        {paso === 'pregunta-momento' && (
          <PantallaPregunta
            key="momento"
            paso={4}
            total={7}
            pregunta="¿Cuándo te pega más fuerte?"
            opciones={[
              { icon: Sunrise, label: 'Al despertar' },
              { icon: Sun, label: 'Durante el día' },
              { icon: BedDouble, label: 'Antes de dormir' },
              { icon: Moon, label: 'De madrugada (3 AM)' },
            ]}
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, momento: v }));
              avanzar();
            }}
            onAtras={retroceder}
          />
        )}
        {paso === 'pregunta-experiencia' && (
          <PantallaPregunta
            key="experiencia"
            paso={5}
            total={7}
            pregunta="¿Ya usaste otras apps de astrología antes?"
            opciones={[
              { icon: Sparkles, label: 'Sí, ya probé otras' },
              { icon: HelpCircle, label: 'No, esta es la primera' },
            ]}
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, experiencia: v }));
              avanzar();
            }}
            onAtras={retroceder}
          />
        )}
        {paso === 'reconocimiento-1' && (
          <PantallaReconocimiento
            key="reco1"
            paso={intent === 'somatica' ? 3 : 6}
            total={intent === 'somatica' ? 3 : 7}
            titulo={
              intent === 'somatica'
                ? 'Tu cuerpo está procesando algo que tu mente aún no ha integrado'
                : respuestas.experiencia?.includes('Sí')
                  ? 'AstroSoma es distinto'
                  : 'Ese nudo no es casualidad'
            }
            cuerpo={
              intent === 'somatica'
                ? 'Ese malestar no es al azar. Vamos a mostrarte de dónde viene y cómo aliviarlo hoy.'
                : respuestas.experiencia?.includes('Sí')
                  ? 'Entendemos. Aquí no hay promesas vacías — solo tu tránsito de hoy y un ejercicio real de 3 minutos.'
                  : respuestas.situacion === 'Rompí con mi pareja' || respuestas.situacion === 'Perdí a alguien que quería'
                    ? 'Tu cuerpo guarda lo que tu cabeza no suelta. Aquí vas a soltarlo.'
                    : 'Esa tensión tiene un patrón. Hoy vas a soltarla.'
            }
            notaCaja={
              intent !== 'somatica' && respuestas.experiencia?.includes('Sí')
                ? 'Un espacio privado y seguro para sanar.'
                : undefined
            }
            onContinuar={avanzar}
            onAtras={retroceder}
          />
        )}
        {paso === 'pregunta-meta' && (
          <PantallaPregunta
            key="meta"
            paso={6}
            total={7}
            pregunta="¿Qué te gustaría lograr en 30 días?"
            opciones={[
              { icon: HeartCrack, label: 'Dejar de contactar a quien me duele' },
              { icon: BedDouble, label: 'Dormir sin darle vueltas' },
              { icon: Waves, label: 'Sentir calma todos los días' },
              { icon: Sparkles, label: 'Entender mi carta natal' },
            ]}
            otraCosa
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, meta: v }));
              avanzar();
            }}
            onAtras={retroceder}
          />
        )}
        {paso === 'reconocimiento-2' && (
          <PantallaReconocimiento
            key="reco2"
            paso={7}
            total={7}
            titulo="Ya diste el paso que la mayoría evita"
            cuerpo="Nombrar tu dolor y tu meta es lo que otras apps nunca preguntan."
            onContinuar={avanzar}
            onAtras={retroceder}
          />
        )}
        {paso === 'loading' && <PantallaLoading key="loading" onListo={avanzar} />}
        {paso === 'resultado' && (
          <PantallaResultado key="resultado" respuestas={respuestas} intent={intent ?? 'duelo'} onEditar={reiniciar} />
        )}
      </AnimatePresence>
    </div>
  );
}
