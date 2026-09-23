// Límite simple por usuario/IP para endpoints de IA (09-SEGURIDAD.md). En memoria del proceso:
// suficiente para cortar un abuso obvio (loop, doble-tap agresivo) antes del cacheo diario; no
// sobrevive a un redeploy ni se comparte entre instancias — si la app escala a multi-instancia,
// migrar a un store compartido (ver 13-INFRA-ESCALABILIDAD.md).

const intentos = new Map<string, number[]>();

export function excedeLimite(clave: string, maxIntentos: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  const previos = (intentos.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
  if (previos.length >= maxIntentos) {
    intentos.set(clave, previos);
    return true;
  }
  previos.push(ahora);
  intentos.set(clave, previos);
  return false;
}
