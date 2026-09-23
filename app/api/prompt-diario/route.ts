import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { excedeLimite } from '@/lib/rateLimit';

// ENDPOINT BFF — pregunta de diario personalizada, reusa el mismo motor de IA que la lectura
// diaria (30-INTEGRACION-IA.md). Requiere sesión (el diario es una función de la app interna, no
// del onboarding). Se cachea en la MISMA fila de `lecturas_diarias` del día (columna
// `prompt_diario`) — mismo alcance por usuario/día que la lectura de Hoy, sin tabla nueva.

export const runtime = 'nodejs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function fechaISOLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const TEMA_SEMANA = [
  'reconocer dónde vive el dolor',
  'soltar lo que ya no le sirve cargar',
  'reconstruir su rutina',
  'volver a sí misma',
];

const SYSTEM_PROMPT =
  'Eres la voz cálida y contenida de AstroSoma, una app de bienestar somático para personas ' +
  'atravesando una ruptura, un duelo o un malestar físico constante. Escribes UNA sola pregunta ' +
  'de diario, corta (máximo 16 palabras), específica y concreta — nunca genérica como "¿cómo te ' +
  'sientes?". Tono acompañante, nunca clínico ni dramático. Español latino neutro, tuteando. ' +
  'Responde ÚNICAMENTE con la pregunta, sin comillas, sin explicación adicional.';

export async function GET() {
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

  if (excedeLimite(`prompt-diario:${user.id}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Estás pidiendo tu pregunta muy seguido. Espera un momento.' }, { status: 429 });
  }

  const fecha = fechaISOLocal();
  const admin = createAdminClient();

  const { data: enCache } = await admin
    .from('lecturas_diarias')
    .select('prompt_diario')
    .eq('user_id', user.id)
    .eq('fecha', fecha)
    .maybeSingle();

  if (enCache?.prompt_diario) {
    return NextResponse.json({ pregunta: enCache.prompt_diario });
  }

  const [{ data: perfil }, { count: diasEnPrograma }] = await Promise.all([
    admin.from('perfiles').select('categoria_duelo').eq('id', user.id).single(),
    admin.from('escaneos').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  const semanaActual = Math.min(Math.ceil((diasEnPrograma ?? 1) / 7), 4);
  const tema = TEMA_SEMANA[semanaActual - 1];
  const categoria = perfil?.categoria_duelo ?? 'ruptura';

  try {
    const respuesta = await client.messages.create({
      model: process.env.AI_MODEL || 'claude-sonnet-5',
      max_tokens: 100,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content:
            `Esta persona está en la semana ${semanaActual} de su programa de 30 días, cuyo tema ` +
            `es "${tema}". Su situación es de tipo "${categoria}" (ruptura de pareja, pérdida de ` +
            `alguien, un cambio de vida fuerte, ansiedad/estrés, o malestar físico sin duelo, según ` +
            `corresponda). Escribe la pregunta de diario de hoy para ella.`,
        },
      ],
    });

    const bloque = respuesta.content.find((b) => b.type === 'text');
    const pregunta = bloque && bloque.type === 'text' ? bloque.text.trim().replace(/^["']|["']$/g, '') : '';

    if (!pregunta) {
      return NextResponse.json({ error: 'La IA no devolvió una pregunta.' }, { status: 502 });
    }

    await admin.from('lecturas_diarias').upsert(
      { user_id: user.id, fecha, prompt_diario: pregunta },
      { onConflict: 'user_id,fecha', ignoreDuplicates: false },
    );

    return NextResponse.json({ pregunta });
  } catch {
    return NextResponse.json({ error: 'No se pudo generar la pregunta de hoy.' }, { status: 502 });
  }
}
