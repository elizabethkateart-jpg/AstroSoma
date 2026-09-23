// TABLA DE CORRESPONDENCIA SIGNO → ZONA DEL CUERPO — determinística, NO la decide la IA.
// Fuente: la correspondencia zodiaco-anatomía tradicional de la astrología médica occidental
// (el "Zodiac Man" / medicina astrológica, sistematizada desde el Tetrabiblos de Ptolomeo y
// estandarizada en almanaques desde el s. XV — cada signo rige una zona del cuerpo, en orden
// de Aries=cabeza a Piscis=pies). Aquí se usa solo como marco simbólico para el Escaneo
// Somático (bienestar, no medicina real — ver /aviso-ia).
export const ZONA_POR_SIGNO: Record<string, string> = {
  Aries: 'Cabeza y sienes',
  Tauro: 'Garganta y cuello',
  Géminis: 'Hombros y brazos',
  Cáncer: 'Pecho',
  Leo: 'Espalda alta y corazón',
  Virgo: 'Abdomen',
  Libra: 'Zona lumbar',
  Escorpio: 'Vientre bajo',
  Sagitario: 'Caderas y muslos',
  Capricornio: 'Rodillas',
  Acuario: 'Tobillos',
  Piscis: 'Pies',
};

const SIGNOS_EN_ORDEN = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
];

/** Convierte la longitud eclíptica de la Luna (0-360°, zodiaco trópico) en su signo. */
export function signoDeLongitud(longitudGrados: number): string {
  const normalizada = ((longitudGrados % 360) + 360) % 360;
  const indice = Math.floor(normalizada / 30);
  return SIGNOS_EN_ORDEN[indice];
}

export function zonaDelSigno(signo: string): string {
  return ZONA_POR_SIGNO[signo] ?? 'Pecho';
}
