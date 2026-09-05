'use client';

// ONBOARDING DE ASTROSOMA — Paso 2 de la Secuencia Maestra.
// Deriva de FICHA-AVATAR.md (57): cada pregunta ecoa un dolor/deseo real, nunca decorativa.
// Estructura: 4 preguntas (02B regla 1: una decisión por pantalla) + 2 reconocimientos (A5) +
// loading "armando tu plan" (B) + resultado personalizado. Categoría bienestar/hábito → 4-8
// pasos de alto rendimiento (02B).

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, X, HeartCrack, Waves, HelpCircle, Sunrise, Sun, MoonStar, Moon, MessageCircleHeart, BedDouble, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Respuestas = {
  situacion?: string;
  zona?: string;
  momento?: string;
  meta?: string;
};

const TOTAL_PREGUNTAS = 4;

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

function BarraProgreso({ paso }: { paso: number }) {
  const frac = Math.min(1, paso / TOTAL_PREGUNTAS);
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

function Header({ paso, onAtras }: { paso: number; onAtras?: () => void }) {
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
      <BarraProgreso paso={paso} />
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
  pregunta,
  subcopy,
  opciones,
  otraCosa,
  onElegir,
  onAtras,
}: {
  paso: number;
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

  function elegir(valor: string) {
    setSeleccion(valor);
    setTimeout(() => onElegir(valor), 300);
  }

  return (
    <div className="flex min-h-dvh flex-col px-5">
      <Header paso={paso} onAtras={onAtras} />
      <motion.div
        initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: reduce ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 flex-col justify-start pt-[15vh]"
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
          <div className="mt-8">
            <input
              autoFocus
              value={textoOtra}
              onChange={(e) => setTextoOtra(e.target.value)}
              placeholder="Escribe con tus palabras..."
              className="h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
            />
            <button
              type="button"
              disabled={!textoOtra.trim()}
              onClick={() => onElegir(textoOtra.trim())}
              className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] disabled:opacity-50 [touch-action:manipulation]"
            >
              Continuar
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function PantallaReconocimiento({
  paso,
  titulo,
  cuerpo,
  onContinuar,
  onAtras,
}: {
  paso: number;
  titulo: string;
  cuerpo: string;
  onContinuar: () => void;
  onAtras?: () => void;
}) {
  const reduce = useReducedMotion();
  const d = (n: number) => (reduce ? 0 : n);
  return (
    <div className="flex min-h-dvh flex-col px-5">
      <Header paso={paso} onAtras={onAtras} />
      <motion.div
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 flex-col items-center justify-start pt-[12vh] text-center"
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
        <motion.p
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(0.3) }}
          className="mt-4 max-w-[320px] text-[16px] leading-relaxed text-[var(--text-secondary)]"
        >
          {cuerpo}
        </motion.p>
      </motion.div>
      <motion.button
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: d(0.4) }}
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onContinuar}
        className="mb-[max(24px,env(safe-area-inset-bottom))] flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
      >
        Continuar
      </motion.button>
    </div>
  );
}

function PantallaLoading({ onListo }: { onListo: () => void }) {
  const reduce = useReducedMotion();
  const pasos = ['Leyendo tu carta natal...', 'Ubicando tu zona de tensión...', 'Armando tu ejercicio de 3 minutos...'];
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setActivo(1), reduce ? 200 : 900);
    const t2 = setTimeout(() => setActivo(2), reduce ? 400 : 1800);
    const t3 = setTimeout(onListo, reduce ? 600 : 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <span className="respira-marco flex size-20 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
        <Sun size={34} color="var(--accent)" aria-hidden={true} />
      </span>
      <h1 className="mt-8 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Armando tu Escaneo Somático
      </h1>
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

function PantallaResultado({ respuestas }: { respuestas: Respuestas }) {
  const reduce = useReducedMotion();
  const zona = respuestas.zona ?? 'tu cuerpo';
  return (
    <div className="flex min-h-dvh flex-col px-5 pt-10">
      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col items-center text-center"
      >
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
          Tu escaneo de hoy
        </p>
        <h1 className="mt-3 text-balance text-[30px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Hoy tu tensión vive en {zona.toLowerCase()}
        </h1>
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
          <span className="absolute text-[40px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
            <ConteoNumero hasta={72} reduce={reduce} />%
          </span>
        </div>
        <p className="mt-3 text-[13px] text-[var(--text-secondary)]">tensión detectada — lista para liberar</p>

        <div className="mt-8 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)] bg-[var(--surface)] p-4 text-left">
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
        className="mb-[max(24px,env(safe-area-inset-bottom))] flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
      >
        Ver mi plan de liberación
      </motion.a>
    </div>
  );
}

const PASOS = [
  'pregunta-situacion',
  'pregunta-zona',
  'pregunta-momento',
  'reconocimiento-1',
  'pregunta-meta',
  'reconocimiento-2',
  'loading',
  'resultado',
] as const;

export default function Onboarding() {
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const paso = PASOS[indice];

  function avanzar() {
    setIndice((i) => Math.min(i + 1, PASOS.length - 1));
  }
  function retroceder() {
    setIndice((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <AnimatePresence mode="wait">
        {paso === 'pregunta-situacion' && (
          <PantallaPregunta
            key="situacion"
            paso={0}
            pregunta="¿Qué está pasando en tu vida ahora mismo?"
            opciones={[
              { icon: HeartCrack, label: 'Estoy pasando una ruptura o pérdida' },
              { icon: Moon, label: 'Siento estrés o ansiedad sostenida' },
              { icon: Sunrise, label: 'Quiero conocerme mejor a través de mi carta' },
            ]}
            otraCosa
            onElegir={(v) => {
              setRespuestas((r) => ({ ...r, situacion: v }));
              avanzar();
            }}
          />
        )}
        {paso === 'pregunta-zona' && (
          <PantallaPregunta
            key="zona"
            paso={1}
            pregunta="¿Dónde sientes la tensión ahora mismo?"
            subcopy="Esto define tu primer ejercicio de hoy"
            opciones={[
              { icon: HeartCrack, label: 'Pecho' },
              { icon: MessageCircleHeart, label: 'Garganta' },
              { icon: Waves, label: 'Estómago' },
              { icon: HelpCircle, label: 'No estoy segura' },
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
            paso={2}
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
        {paso === 'reconocimiento-1' && (
          <PantallaReconocimiento
            key="reco1"
            paso={3}
            titulo="Ese nudo no es casualidad"
            cuerpo={`No es falta de voluntad: es tu cuerpo acumulando lo que tu cabeza no suelta. ${
              respuestas.situacion?.includes('ruptura')
                ? 'Cada vez que revisas su perfil, tu sistema nervioso solo busca alivio de esa tensión.'
                : 'Esa tensión tiene un patrón, y hoy vamos a mostrarte dónde vive exactamente.'
            } El Escaneo Somático te muestra ese punto exacto y te da el ejercicio para soltarlo.`}
            onContinuar={avanzar}
            onAtras={retroceder}
          />
        )}
        {paso === 'pregunta-meta' && (
          <PantallaPregunta
            key="meta"
            paso={3}
            pregunta="¿Qué te gustaría lograr en 30 días?"
            opciones={[
              { icon: HeartCrack, label: 'Dejar de contactar a mi ex' },
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
            paso={4}
            titulo="Ya diste el paso que la mayoría evita"
            cuerpo="Nombrar dónde te duele y qué quieres lograr es exactamente lo que la mayoría de las apps de astrología nunca te preguntan. Tu Escaneo Somático se construye ahora mismo con eso."
            onContinuar={avanzar}
            onAtras={retroceder}
          />
        )}
        {paso === 'loading' && <PantallaLoading key="loading" onListo={avanzar} />}
        {paso === 'resultado' && <PantallaResultado key="resultado" respuestas={respuestas} />}
      </AnimatePresence>
    </div>
  );
}
