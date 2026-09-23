import * as Astronomy from 'astronomy-engine';
import { signoDeLongitud, zonaDelSigno } from './zonas';

/** Signo lunar de hoy (geocéntrico, zodiaco trópico) — cálculo determinístico, sin IA. */
export function signoLunarDeHoy(fecha: Date = new Date()): string {
  const eclip = Astronomy.EclipticGeoMoon(fecha);
  return signoDeLongitud(eclip.lon);
}

export function zonaDeHoy(fecha: Date = new Date()): { signo: string; zona: string } {
  const signo = signoLunarDeHoy(fecha);
  return { signo, zona: zonaDelSigno(signo) };
}
