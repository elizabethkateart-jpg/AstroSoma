import { useEffect, useState } from 'react';

// Hook compartido — consume el BFF de app/api/lectura-diaria (IA real, ver 30-INTEGRACION-IA.md).
// Usado en la pantalla "Hoy" (app/app/page.tsx) y en el resultado del onboarding.

export type LecturaDiaria = { zona: string; mensaje: string; porque: string; consejo: string };
export type EstadoLectura = 'cargando' | 'lista' | 'error';

export function useLecturaDiaria() {
  const [estado, setEstado] = useState<EstadoLectura>('cargando');
  const [lectura, setLectura] = useState<LecturaDiaria | null>(null);

  useEffect(() => {
    let cancelado = false;
    fetch('/api/lectura-diaria')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((datos: LecturaDiaria) => {
        if (!cancelado) {
          setLectura(datos);
          setEstado('lista');
        }
      })
      .catch(() => {
        if (!cancelado) setEstado('error');
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return { estado, lectura };
}
