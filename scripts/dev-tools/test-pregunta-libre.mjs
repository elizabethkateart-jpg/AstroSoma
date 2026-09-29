import { createClient as createAdmin } from '@supabase/supabase-js';
import { createClient as createAnon } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const admin = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const anon = createAnon(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = `prueba-preguntas-${Date.now()}@astrosoma-test-real.com`;
const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
if (linkError) { console.error('ERROR generando OTP:', linkError.message); process.exit(1); }
const { data: verifyData, error: verifyError } = await anon.auth.verifyOtp({
  email, token: linkData.properties.email_otp, type: 'email',
});
if (verifyError) { console.error('ERROR en login:', verifyError.message); process.exit(1); }
console.log('✓ Sesión real creada para', verifyData.user.id);

const usuario = createAnon(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
await usuario.auth.setSession({ access_token: verifyData.session.access_token, refresh_token: verifyData.session.refresh_token });

// Replica exacta de la lógica del endpoint /api/pregunta-libre (POST)
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SYSTEM_PROMPT =
  'Eres la voz cálida y contenida de AstroSoma, una app de bienestar somático. La persona te ' +
  'cuenta un malestar puntual de hoy (físico o emocional) y le das una lectura breve + un consejo ' +
  'práctico — nunca un diagnóstico médico, nunca predices el futuro. Tono acompañante, nunca ' +
  'clínico ni alarmista. Español latino neutro, tuteando. ' +
  'Si lo que describe suena a algo médicamente serio o urgente (dolor muy fuerte, dificultad para ' +
  'respirar, pensamientos de hacerse daño, etc.), tu consejo debe incluir con calidez que busque ' +
  'ayuda de un profesional de salud real — sin alarmar, pero sin omitirlo. ' +
  'Responde ÚNICAMENTE con un objeto JSON válido (sin texto antes ni después, sin markdown), con ' +
  'exactamente estas 2 claves de texto: "lectura" (1-2 frases conectando lo que cuenta con su ' +
  'cuerpo, tono simbólico) y "consejo" (1-2 frases con algo concreto que pueda hacer ahora).';

const pregunta = 'Tengo dolor de cabeza, creo que no dormí bien';
const respuesta = await client.messages.create({
  model: process.env.AI_MODEL || 'claude-sonnet-5',
  max_tokens: 300,
  system: SYSTEM_PROMPT,
  messages: [{ role: 'user', content: pregunta }],
});
const bloque = respuesta.content.find((b) => b.type === 'text');
const textoCrudo = bloque?.type === 'text' ? bloque.text.trim() : '';
const textoJSON = textoCrudo.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
let datos;
try {
  datos = JSON.parse(textoJSON);
  console.log('✓ IA respondió JSON válido:', datos);
} catch {
  console.error('✗ FALLA parseo JSON. Texto crudo:', textoCrudo);
  process.exit(1);
}

const fecha = new Date().toISOString().slice(0, 10);
const respuestaFinal = `${datos.lectura} ${datos.consejo}`;
const { data: fila, error: eInsert } = await usuario
  .from('preguntas_libres')
  .insert({ user_id: verifyData.user.id, fecha, pregunta, respuesta: respuestaFinal })
  .select('id, pregunta, respuesta, created_at')
  .single();
console.log(eInsert ? '✗ FALLA insertar (RLS): ' + eInsert.message : '✓ Inserta su propia pregunta (RLS ok): ' + fila.id);

// Probar el conteo del límite diario
const { count } = await usuario
  .from('preguntas_libres')
  .select('id', { count: 'exact', head: true })
  .eq('user_id', verifyData.user.id)
  .eq('fecha', fecha);
console.log(count === 1 ? '✓ Conteo diario correcto (1)' : '✗ Conteo diario incorrecto: ' + count);

// Probar que otro usuario NO puede leer esta pregunta (RLS aislamiento)
const email2 = `prueba-preguntas-b-${Date.now()}@astrosoma-test-real.com`;
const { data: linkData2 } = await admin.auth.admin.generateLink({ type: 'magiclink', email: email2 });
const anon2 = createAnon(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data: verify2 } = await anon2.auth.verifyOtp({ email: email2, token: linkData2.properties.email_otp, type: 'email' });
const usuario2 = createAnon(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
await usuario2.auth.setSession({ access_token: verify2.session.access_token, refresh_token: verify2.session.refresh_token });
const { data: fugaDatos } = await usuario2.from('preguntas_libres').select('*').eq('user_id', verifyData.user.id);
console.log((fugaDatos?.length ?? 0) === 0 ? '✓ Otro usuario NO puede ver esta pregunta (RLS aísla)' : '✗ FUGA: otro usuario ve preguntas ajenas');

// Limpieza
await admin.auth.admin.deleteUser(verifyData.user.id);
await admin.auth.admin.deleteUser(verify2.user.id);
console.log('✓ Cuentas de prueba eliminadas');
