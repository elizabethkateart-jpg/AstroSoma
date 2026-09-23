'use client';

// EDITAR PERFIL — nombre + datos de nacimiento. La fecha y ciudad se guardan para cuando se
// conecte el motor de cálculo astrológico real (Paso 6) — no se usan todavía, y se lo decimos
// así de claro en la pantalla en vez de fingir que ya alimentan algo (mismo criterio que se
// aplicó al no pedir estos datos en el onboarding: honestidad sobre qué procesa la app hoy).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { X, Info } from 'lucide-react';
import { useEstadoApp, actualizarPerfil } from '@/lib/appLocal';

function Campo({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <label htmlFor={id} className="text-[13px] font-semibold text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClase =
  'h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]';

export default function EditarPerfil() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const estado = useEstadoApp();
  const [nombre, setNombre] = useState(estado.nombre);
  const [fechaNacimiento, setFechaNacimiento] = useState(estado.fechaNacimiento);
  const [ciudadNacimiento, setCiudadNacimiento] = useState(estado.ciudadNacimiento);

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    actualizarPerfil({ nombre: nombre.trim(), fechaNacimiento, ciudadNacimiento: ciudadNacimiento.trim() });
    router.push('/app/perfil');
  }

  return (
    <form onSubmit={guardar} className="flex flex-col px-5 pb-10 pt-4">
      <div className="flex items-center justify-between">
        <Link
          href="/app/perfil"
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
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mt-4 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          Editar perfil
        </h1>

        <Campo id="nombre" label="Nombre">
          <input
            id="nombre"
            type="text"
            autoComplete="given-name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="¿Cómo te llamas?"
            className={inputClase}
          />
        </Campo>

        <Campo id="fecha-nacimiento" label="Fecha de nacimiento">
          <input
            id="fecha-nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className={inputClase}
          />
        </Campo>

        <Campo id="ciudad-nacimiento" label="Ciudad de nacimiento">
          <input
            id="ciudad-nacimiento"
            type="text"
            autoComplete="address-level2"
            value={ciudadNacimiento}
            onChange={(e) => setCiudadNacimiento(e.target.value)}
            placeholder="Ciudad, país"
            className={inputClase}
          />
        </Campo>

        <div className="mt-6 flex items-start gap-2.5 rounded-[var(--radius-card)] bg-[var(--surface)] p-3.5">
          <Info size={16} color="var(--text-tertiary)" className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-[12.5px] leading-snug text-[var(--text-secondary)]">
            Guardamos tu fecha y ciudad de nacimiento para cuando actives el cálculo de tu carta
            natal real. Por ahora tu Escaneo Somático sigue funcionando igual.
          </p>
        </div>
      </motion.div>
    </form>
  );
}
