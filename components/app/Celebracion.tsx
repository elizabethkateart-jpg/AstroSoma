'use client';

// CELEBRACIÓN DE LOGRO — Lottie provisto por el usuario (2026-09-10), recoloreado al verde
// salvia `--success` ya documentado en FICHA-ARTE.md (nunca cableado a tokens.css hasta ahora —
// se agregó junto con `--error`/`--warning`). Se reproduce UNA sola vez (sin loop) cada vez que
// la persona completa algo real (su ejercicio del día, etc.) — nivel N1: sutil, sin confetti.

import { Lottie } from 'lottie-react';
import { useReducedMotion } from 'motion/react';
import animacionLogro from './celebracion-logro.json';

export function Celebracion({ size = 140 }: { size?: number }) {
  const reduce = useReducedMotion();
  return (
    <Lottie
      src={animacionLogro}
      loop={false}
      autoplay={!reduce}
      role="img"
      aria-label="Logro celebrado"
      style={{ width: size, height: size }}
    />
  );
}
