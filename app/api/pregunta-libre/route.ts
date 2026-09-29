import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { excedeLimite } from '@/lib/rateLimit';

// ENDPOINT BFF — preguntas libres del día ("me duele X, ¿cómo lo alivio?"). Mismo patrón que
// lectura-diaria/prompt-diario (30-INTEGRACION-IA.md): clave solo en servidor, modelo en env var,
// max_tokens acotado. El límite diario (LIMITE_DIARIO) se cuenta en la base de datos — no en
// memoria — porque debe sobrevivir a que Vercel use varias instancias del servidor.

export const runtime = 'nodejs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LIMITE_DIARIO = 3;

function fechaISOLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Señales de algo potencialmente serio — si aparecen, la respuesta SIEMPRE incluye sugerir ayuda
// profesional real, sin depender solo del criterio del modelo (defensa en profundidad).
const SEÑALES_SERIAS =
  /dolor.*(pecho|fuerte)|no puedo respirar|desmay|sangr|pensamientos? de (morir|suicid)|quiero morir|convulsi|fiebre alta|entumecid|parálisis/i;

const SYSTEM_PROMPT =
  'Eres la voz cálida y contenida de AstroSoma, una app de bienestar somático. La persona te ' +
  'cuenta un malestar puntual de hoy (físico o emocional) y le das una lectura breve + un consejo ' +
  'práctico — nunca un diagnóstico médico, nunca predices el futuro. Tono acompañante, nunca ' +
  'clínico ni alarmista. Español latino neutro, tuteando (tú/tienes/puedes — NUNCA vos/tenés/podés). ' +
  'Si lo que describe suena a algo médicamente serio o urgente (dolor muy fuerte, dificultad para ' +
  'respirar, pensamientos de hacerse daño, etc.), tu consejo debe incluir con calidez que busque ' +
  'ayuda de un profesional de salud real — sin alarmar, pero sin omitirlo. ' +
  'Responde ÚNICAMENTE con un objeto JSON válido (sin texto antes ni después, sin markdown), con ' +
  'exactamente estas 2 claves de texto: "lectura" (1-2 frases conectando lo que cuenta con su ' +
  'cuerpo, tono simbólico) y "consejo" (1-2 frases con algo concreto que pueda hacer ahora).';

type RespuestaJSON = { lectura: string; consejo: string };

export async function GET() {
  const supabaseSesion = await createClient();
  const {
    data: { user },
  } = await supabaseSesion.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Necesitas iniciar sesión.' }, { status: 401 });
  }

  const admin = createAdminClient();
  const fecha = fechaISOLocal();
  const { data: preguntasHoy } = await admin
    .from('preguntas_libres')
    .select('id, pregunta, respuesta, created_at')
    .eq('user_id', user.id)
    .eq('fecha', fecha)
    .order('created_at', { ascending: true });

  const historial = preguntasHoy ?? [];
  return NextResponse.json({
    historial,
    restantesHoy: Math.max(0, LIMITE_DIARIO - historial.length),
    limiteDiario: LIMITE_DIARIO,
  });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Falta configurar la clave de IA en el servidor.' }, { status: 500 });
  }

  const supabaseSesion = await createClient();
  const {
    data: { user },
  } = await supabaseSesion.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Necesitas iniciar sesión.' }, { status: 401 });
  }

  if (excedeLimite(`pregunta-libre:${user.id}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Estás preguntando muy seguido. Espera un momento.' }, { status: 429 });
  }

  let pregunta: string;
  try {
    const body = (await request.json()) as { pregunta?: string };
    pregunta = (body.pregunta ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Pregunta inválida.' }, { status: 400 });
  }

  if (!pregunta || pregunta.length > 400) {
    return NextResponse.json({ error: 'Escribe tu pregunta (máximo 400 caracteres).' }, { status: 400 });
  }

  const admin = createAdminClient();
  const fecha = fechaISOLocal();

  const { count } = await admin
    .from('preguntas_libres')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('fecha', fecha);

  if ((count ?? 0) >= LIMITE_DIARIO) {
    return NextResponse.json(
      { error: `Ya usaste tus ${LIMITE_DIARIO} preguntas de hoy. Vuelve mañana.` },
      { status: 429 },
    );
  }

  try {
    const respuesta = await client.messages.create({
      model: process.env.AI_MODEL || 'claude-sonnet-5',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: pregunta }],
    });

    const bloque = respuesta.content.find((b) => b.type === 'text');
    const textoCrudo = bloque && bloque.type === 'text' ? bloque.text.trim() : '';
    const textoJSON = textoCrudo.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();

    let datos: RespuestaJSON;
    try {
      datos = JSON.parse(textoJSON);
    } catch {
      return NextResponse.json({ error: 'La IA no devolvió un formato válido.' }, { status: 502 });
    }

    if (!datos.lectura || !datos.consejo) {
      return NextResponse.json({ error: 'La IA no devolvió una respuesta completa.' }, { status: 502 });
    }

    let respuestaFinal = `${datos.lectura} ${datos.consejo}`;
    if (SEÑALES_SERIAS.test(pregunta) && !/profesional|doctor|médic/i.test(respuestaFinal)) {
      respuestaFinal += ' Y si esto se siente fuerte o no se pasa, no lo minimices: busca a un profesional de salud real.';
    }

    const { data: fila } = await admin
      .from('preguntas_libres')
      .insert({ user_id: user.id, fecha, pregunta, respuesta: respuestaFinal })
      .select('id, pregunta, respuesta, created_at')
      .single();

    return NextResponse.json({
      item: fila ?? { pregunta, respuesta: respuestaFinal, created_at: new Date().toISOString() },
      restantesHoy: Math.max(0, LIMITE_DIARIO - ((count ?? 0) + 1)),
    });
  } catch {
    return NextResponse.json({ error: 'No se pudo generar tu lectura. Intenta de nuevo.' }, { status: 502 });
  }
}
