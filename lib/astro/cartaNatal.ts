import * as Astronomy from 'astronomy-engine';
import { signoDeLongitud } from './zonas';

// CARTA NATAL SIMPLIFICADA — Sol y Luna natales, sin hora de nacimiento (decisión ya tomada:
// pedir hora exacta pierde gente que no la sabe). Sin hora, no se puede calcular ascendente ni
// casas con precisión, pero Sol y Luna dependen sobre todo de la FECHA — con mediodía como hora
// de referencia el margen de error de signo es mínimo (el Sol cambia de signo una vez cada ~30
// días; la Luna una vez cada ~2.5 días, así que hay un pequeño riesgo de error solo si la persona
// nació el mismo día de un cambio de signo lunar — aceptable para este uso no clínico).

export type CartaNatal = {
  solNatal: string;
  lunaNatal: string;
};

export function calcularCartaNatal(fechaNacimientoISO: string): CartaNatal {
  // Mediodía UTC del día de nacimiento — referencia estándar cuando no hay hora exacta.
  const fecha = new Date(`${fechaNacimientoISO}T12:00:00Z`);
  const solLon = Astronomy.SunPosition(fecha).elon;
  const lunaLon = Astronomy.EclipticGeoMoon(fecha).lon;
  return {
    solNatal: signoDeLongitud(solLon),
    lunaNatal: signoDeLongitud(lunaLon),
  };
}
