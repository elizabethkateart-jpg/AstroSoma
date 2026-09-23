import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { zonaDeHoy } from '@/lib/astro/motor';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { excedeLimite } from '@/lib/rateLimit';

// ENDPOINT BFF — patrón de 09-SEGURIDAD.md / 30-INTEGRACION-IA.md: la ANTHROPIC_API_KEY vive
// solo en el servidor (nunca en el bundle del cliente). El cálculo del signo lunar y la zona es
// determinístico (lib/astro), NO lo decide la IA — la IA solo redacta el mensaje, el porqué y el
// consejo. Con sesión + carta natal guardada: se PERSONALIZA (cruza el tránsito de hoy con el
// Sol/Luna natal de la persona) y se cachea POR USUARIO en `lecturas_diarias` — el costo de IA
// crece con la cantidad de usuarios activos por día (sigue siendo bajo por mensaje, cambio de
// arquitectura ya documentado en ESTADO.md). Sin sesión (onboarding) o sin carta guardada:
// mensaje genérico sin personalizar, sin caché — mismo comportamiento de antes.

export const runtime = 'nodejs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function fechaISOLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const SYSTEM_PROMPT =
  'Eres la voz cálida y contenida de AstroSoma, una app de bienestar somático para personas ' +
  'atravesando una ruptura, un duelo o un malestar físico constante. Tu tono: acompañante, ' +
  'nunca dramático, nunca clínico, nunca fatalista. NUNCA predices el futuro ni das diagnósticos ' +
  'médicos — cuando conectes la carta natal con el tránsito de hoy, hazlo en tono SIMBÓLICO y ' +
  'suave, nunca como una causa médica real ni una certeza. Escribes en español latino neutro, ' +
  'tuteando (tú/tienes/puedes — nunca vos/tenés). ' +
  'Responde ÚNICAMENTE con un objeto JSON válido (sin texto antes ni después, sin markdown), con ' +
  'exactamente estas 3 claves de texto: "mensaje" (2 frases cortas, empezando con algo como "Hoy ' +
  'tu tensión vive en..."), "porque" (1-2 frases que expliquen de forma cálida y simbólica por qué ' +
  'esta zona es su centro de tensión hoy — si hay carta natal, conéctalo con ella; si no, con el ' +
  'tránsito del día), "consejo" (1 frase con un consejo práctico y concreto para esa zona, además ' +
  'del ejercicio de respiración — algo que pueda hacer hoy, sin sonar a receta médica).';

type LecturaJSON = { mensaje: string; porque: string; consejo: string };

export async function GET(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Falta configurar la clave de IA en el servidor.' },
      { status: 500 },
    );
  }

  const { signo, zona } = zonaDeHoy();
  const fecha = fechaISOLocal();
  const admin = createAdminClient();

  const supabaseSesion = await createClient();
  const {
    data: { user },
  } = await supabaseSesion.auth.getUser();

  const claveLimite = user?.id ?? request.headers.get('x-forwarded-for') ?? 'anonimo';
  if (excedeLimite(`lectura-diaria:${claveLimite}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Estás pidiendo tu lectura muy seguido. Espera un momento.' }, { status: 429 });
  }

  let solNatal: string | null = null;
  let lunaNatal: string | null = null;

  if (user) {
    const { data: enCache } = await admin
      .from('lecturas_diarias')
      .select('zona, mensaje, porque, consejo')
      .eq('user_id', user.id)
      .eq('fecha', fecha)
      .maybeSingle();

    // enCache puede existir con solo `prompt_diario` (creada por /api/prompt-diario) sin que
    // esta lectura se haya generado todavía — solo cuenta como caché si ya tiene mensaje real.
    if (enCache?.mensaje) {
      return NextResponse.json({
        signo,
        zona: enCache.zona,
        mensaje: enCache.mensaje,
        porque: enCache.porque,
        consejo: enCache.consejo,
      });
    }

    const { data: perfil } = await admin.from('perfiles').select('sol_natal, luna_natal').eq('id', user.id).single();
    solNatal = perfil?.sol_natal ?? null;
    lunaNatal = perfil?.luna_natal ?? null;
  }

  const contenidoPersonalizado =
    solNatal && lunaNatal
      ? `El tránsito lunar de hoy está en ${signo}, lo que en el Escaneo Somático de la app ` +
        `corresponde a la zona "${zona}". Esta persona nació con el Sol en ${solNatal} y la Luna ` +
        `en ${lunaNatal} — cruza brevemente el tránsito de hoy con su carta natal (por ejemplo, si ` +
        `el tránsito de hoy toca su Luna natal, se siente más intenso).`
      : `El tránsito lunar de hoy está en ${signo}, lo que en el Escaneo Somático de la app ` +
        `corresponde a la zona "${zona}".`;

  try {
    const respuesta = await client.messages.create({
      model: process.env.AI_MODEL || 'claude-sonnet-5',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: contenidoPersonalizado }],
    });

    const bloque = respuesta.content.find((b) => b.type === 'text');
    const textoCrudo = bloque && bloque.type === 'text' ? bloque.text.trim() : '';
    // A veces la IA envuelve el JSON en ```json ... ``` a pesar de la instrucción — se limpia
    // antes de parsear en vez de fallar por un detalle de formato.
    const textoJSON = textoCrudo.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();

    let datos: LecturaJSON;
    try {
      datos = JSON.parse(textoJSON);
    } catch {
      return NextResponse.json({ error: 'La IA no devolvió un formato válido.' }, { status: 502 });
    }

    if (!datos.mensaje || !datos.porque || !datos.consejo) {
      return NextResponse.json({ error: 'La IA no devolvió un mensaje completo.' }, { status: 502 });
    }

    if (user) {
      // Best-effort: si otra petición concurrente ya insertó la misma (user_id, fecha), se
      // ignora el choque — el caché ya quedó igual de bien servido.
      await admin.from('lecturas_diarias').upsert(
        { user_id: user.id, fecha, signo_luna: signo, zona, mensaje: datos.mensaje, porque: datos.porque, consejo: datos.consejo },
        { onConflict: 'user_id,fecha' },
      );
    }

    return NextResponse.json({ signo, zona, mensaje: datos.mensaje, porque: datos.porque, consejo: datos.consejo });
  } catch {
    return NextResponse.json({ error: 'No se pudo generar la lectura de hoy.' }, { status: 502 });
  }
}
