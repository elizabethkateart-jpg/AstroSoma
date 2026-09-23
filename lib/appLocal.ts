import { useSyncExternalStore } from 'react';
import { createClient } from './supabase/client';
import { calcularCartaNatal } from './astro/cartaNatal';

// ESTADO DE LA APP INTERNA — Paso 6 de la Secuencia Maestra (conectado a Supabase real).
// Antes vivía en localStorage (Paso 5); ahora lee/escribe las tablas aprobadas en ESTADO.md
// ("Modelo de datos") — mismo shape de EstadoApp que antes, así que ninguna pantalla cambió su
// forma de leer el estado (useEstadoApp sigue igual), solo cambió de dónde viene el dato.
// diaPrograma/totalPrograma/rachaDias se DERIVAN por consulta (no se duplican en la tabla), tal
// como quedó documentado — ver calcularRacha() y calcularDiaPrograma() abajo.

export type EntradaDiario = {
  id: string;
  fechaISO: string;
  texto: string;
};

export type CategoriaDuelo = 'ruptura' | 'perdida' | 'cambio' | 'ansiedad' | 'otro' | 'somatica';

export function categoriaDesdeSituacion(situacion?: string): CategoriaDuelo {
  switch (situacion) {
    case 'Rompí con mi pareja':
      return 'ruptura';
    case 'Perdí a alguien que quería':
      return 'perdida';
    case 'Viví un cambio fuerte (trabajo, mudanza...)':
      return 'cambio';
    case 'Siento estrés o ansiedad sostenida':
      return 'ansiedad';
    default:
      return situacion ? 'otro' : 'ruptura';
  }
}

export type EstadoApp = {
  diaPrograma: number;
  totalPrograma: number;
  zonaHoy: string;
  pctLiberadoHoy: number;
  diasSinContacto: number;
  minutosRespiracionHoy: number;
  calmaEstaNoche: string;
  rachaDias: number;
  ejercicioHechoHoy: boolean;
  categoriaDuelo: CategoriaDuelo;
  diario: EntradaDiario[];
  plan: 'Anual' | 'Mensual';
  emailCuenta: string;
  nombre: string;
  fechaNacimiento: string;
  ciudadNacimiento: string;
  solNatal: string | null;
  lunaNatal: string | null;
};

const TOTAL_PROGRAMA = 30;

// Estado inicial mientras carga o si aún no hay sesión — la app nunca se enseña vacía (regla 32).
const ESTADO_VACIO: EstadoApp = {
  diaPrograma: 1,
  totalPrograma: TOTAL_PROGRAMA,
  zonaHoy: 'Pecho',
  pctLiberadoHoy: 0,
  diasSinContacto: 0,
  minutosRespiracionHoy: 0,
  calmaEstaNoche: 'Media',
  rachaDias: 0,
  ejercicioHechoHoy: false,
  categoriaDuelo: 'ruptura',
  diario: [],
  plan: 'Mensual',
  emailCuenta: '',
  nombre: '',
  fechaNacimiento: '',
  ciudadNacimiento: '',
  solNatal: null,
  lunaNatal: null,
};

type FilaEscaneo = {
  fecha: string;
  zona: string;
  pct_liberado: number;
  minutos_respiracion: number;
  dias_sin_contacto: number;
  ejercicio_hecho: boolean;
};

function fechaISOLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

function calmaDesdePct(pct: number): string {
  if (pct >= 60) return 'Alta';
  if (pct >= 30) return 'Media';
  return 'Baja';
}

/** Racha de días consecutivos con ejercicio hecho, terminando hoy o ayer (no se rompe solo por no haber abierto la app hoy todavía). */
function calcularRacha(filas: FilaEscaneo[]): number {
  const porFecha = new Map(filas.map((f) => [f.fecha, f.ejercicio_hecho]));
  const cursor = new Date();
  if (!porFecha.get(fechaISOLocal(cursor))) cursor.setDate(cursor.getDate() - 1);
  let racha = 0;
  while (porFecha.get(fechaISOLocal(cursor))) {
    racha++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return racha;
}

// Snapshot cacheado: useSyncExternalStore exige la MISMA referencia mientras el dato no cambió.
let cache: EstadoApp = ESTADO_VACIO;
let cargaIniciada = false;
const listeners = new Set<() => void>();

function emitir() {
  listeners.forEach((l) => l());
}

function actualizarCache(parcial: Partial<EstadoApp>) {
  cache = { ...cache, ...parcial };
  emitir();
}

/** Trae/crea la fila de hoy en `escaneos`, sembrándola desde la de ayer si es la primera vez que se abre la app hoy. */
async function asegurarFilaDeHoy(userId: string, filas: FilaEscaneo[]): Promise<FilaEscaneo> {
  const hoy = fechaISOLocal(new Date());
  const filaHoy = filas.find((f) => f.fecha === hoy);
  if (filaHoy) return filaHoy;

  const anterior = filas[0]; // ya vienen ordenadas desc por fecha
  const supabase = createClient();
  const { data: nueva } = await supabase
    .from('escaneos')
    .insert({
      user_id: userId,
      fecha: hoy,
      zona: anterior?.zona ?? 'Pecho',
      pct_liberado: 0,
      minutos_respiracion: 0,
      dias_sin_contacto: (anterior?.dias_sin_contacto ?? 0) + 1,
      ejercicio_hecho: false,
    })
    .select()
    .single();

  return (nueva as FilaEscaneo | null) ?? {
    fecha: hoy,
    zona: anterior?.zona ?? 'Pecho',
    pct_liberado: 0,
    minutos_respiracion: 0,
    dias_sin_contacto: (anterior?.dias_sin_contacto ?? 0) + 1,
    ejercicio_hecho: false,
  };
}

async function cargarEstado() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    actualizarCache(ESTADO_VACIO);
    return;
  }

  const [{ data: perfil }, { data: escaneos }, { data: diarioRows }] = await Promise.all([
    supabase.from('perfiles').select('*').eq('id', user.id).single(),
    supabase
      .from('escaneos')
      .select('fecha, zona, pct_liberado, minutos_respiracion, dias_sin_contacto, ejercicio_hecho')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false })
      .limit(60),
    supabase.from('diario_entradas').select('id, texto, created_at').eq('user_id', user.id).order('created_at', { ascending: true }),
  ]);

  const filas = (escaneos ?? []) as FilaEscaneo[];
  const filaHoy = await asegurarFilaDeHoy(user.id, filas);
  const filasConHoy = filas.some((f) => f.fecha === filaHoy.fecha) ? filas : [filaHoy, ...filas];

  actualizarCache({
    diaPrograma: Math.min(filasConHoy.length, TOTAL_PROGRAMA),
    totalPrograma: TOTAL_PROGRAMA,
    zonaHoy: filaHoy.zona,
    pctLiberadoHoy: filaHoy.pct_liberado,
    diasSinContacto: filaHoy.dias_sin_contacto,
    minutosRespiracionHoy: filaHoy.minutos_respiracion,
    calmaEstaNoche: calmaDesdePct(filaHoy.pct_liberado),
    rachaDias: calcularRacha(filasConHoy),
    ejercicioHechoHoy: filaHoy.ejercicio_hecho,
    categoriaDuelo: (perfil?.categoria_duelo as CategoriaDuelo) ?? 'ruptura',
    diario: (diarioRows ?? []).map((r) => ({ id: r.id, fechaISO: r.created_at, texto: r.texto })),
    plan: perfil?.plan === 'anual' ? 'Anual' : 'Mensual',
    emailCuenta: user.email ?? '',
    nombre: perfil?.nombre ?? '',
    fechaNacimiento: perfil?.fecha_nacimiento ?? '',
    ciudadNacimiento: perfil?.ciudad_nacimiento ?? '',
    solNatal: perfil?.sol_natal ?? null,
    lunaNatal: perfil?.luna_natal ?? null,
  });
}

function obtenerSnapshot(): EstadoApp {
  return cache;
}

function obtenerSnapshotServidor(): EstadoApp {
  return ESTADO_VACIO;
}

function suscribirse(listener: () => void): () => void {
  listeners.add(listener);
  if (!cargaIniciada) {
    cargaIniciada = true;
    void cargarEstado();
  }
  return () => listeners.delete(listener);
}

/** Hook: lee el estado y se re-renderiza cuando cambia (carga inicial o cualquier escritura). */
export function useEstadoApp(): EstadoApp {
  return useSyncExternalStore(suscribirse, obtenerSnapshot, obtenerSnapshotServidor);
}

/** Guarda un snapshot del día de hoy (zona/%/minutos/ejercicio) — llamado al completar el ejercicio. */
export function guardarEstado(estado: EstadoApp): void {
  actualizarCache(estado); // optimista: la UI se siente instantánea
  void (async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('escaneos')
      .update({
        zona: estado.zonaHoy,
        pct_liberado: estado.pctLiberadoHoy,
        minutos_respiracion: estado.minutosRespiracionHoy,
        dias_sin_contacto: estado.diasSinContacto,
        ejercicio_hecho: estado.ejercicioHechoHoy,
      })
      .eq('user_id', user.id)
      .eq('fecha', fechaISOLocal(new Date()));
  })();
}

export function agregarEntradaDiario(texto: string): void {
  const entradaOptimista: EntradaDiario = { id: `temp-${Date.now()}`, fechaISO: new Date().toISOString(), texto };
  actualizarCache({ diario: [...cache.diario, entradaOptimista] });
  void (async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('diario_entradas').insert({ user_id: user.id, texto }).select().single();
    if (data) {
      actualizarCache({
        diario: cache.diario.map((e) => (e.id === entradaOptimista.id ? { id: data.id, fechaISO: data.created_at, texto: data.texto } : e)),
      });
    }
  })();
}

export function actualizarPerfil(datos: { nombre: string; fechaNacimiento: string; ciudadNacimiento: string }): void {
  // Se recalcula la carta natal (Sol/Luna) cada vez que cambia la fecha de nacimiento — así el
  // motor astrológico puede cruzar el tránsito de hoy con la carta real de la persona.
  const carta = datos.fechaNacimiento ? calcularCartaNatal(datos.fechaNacimiento) : null;
  actualizarCache({ ...datos, solNatal: carta?.solNatal ?? null, lunaNatal: carta?.lunaNatal ?? null });
  void (async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('perfiles')
      .update({
        nombre: datos.nombre,
        fecha_nacimiento: datos.fechaNacimiento || null,
        ciudad_nacimiento: datos.ciudadNacimiento,
        sol_natal: carta?.solNatal ?? null,
        luna_natal: carta?.lunaNatal ?? null,
      })
      .eq('id', user.id);
  })();
}

async function guardarCategoria(categoria: CategoriaDuelo): Promise<void> {
  actualizarCache({ categoriaDuelo: categoria });
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('perfiles').update({ categoria_duelo: categoria }).eq('id', user.id);
}

/** Se llama una vez al terminar el onboarding (ruta duelo), con la situación que el usuario eligió. */
export function guardarCategoriaDuelo(situacion?: string): void {
  void guardarCategoria(categoriaDesdeSituacion(situacion));
}

/** Se llama una vez al terminar la ruta de onboarding "malestar físico constante". */
export function guardarCategoriaSomatica(): void {
  void guardarCategoria('somatica');
}
