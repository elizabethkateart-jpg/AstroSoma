import { createClient as createAdmin } from '@supabase/supabase-js';
import { createClient as createAnon } from '@supabase/supabase-js';

const admin = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const anon = createAnon(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = `prueba-datos-${Date.now()}@astrosoma-test-real.com`;
// usamos un dominio que sí valida (evitando el TLD de prueba que Supabase rechazó antes)

const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
if (linkError) {
  console.error('ERROR generando OTP:', linkError.message);
  process.exit(1);
}
const { data: verifyData, error: verifyError } = await anon.auth.verifyOtp({
  email,
  token: linkData.properties.email_otp,
  type: 'email',
});
if (verifyError) {
  console.error('ERROR en login:', verifyError.message);
  process.exit(1);
}
console.log('✓ Sesión real creada para', verifyData.user.id);

// Cliente autenticado como el usuario real (sujeto a RLS, igual que el navegador)
const usuario = createAnon(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
await usuario.auth.setSession({ access_token: verifyData.session.access_token, refresh_token: verifyData.session.refresh_token });

// 1) Perfil: el trigger ya lo creó — probar lectura + actualización (como actualizarPerfil())
const { data: perfilLeido, error: e1 } = await usuario.from('perfiles').select('*').eq('id', verifyData.user.id).single();
console.log(e1 ? '✗ FALLA leer perfil: ' + e1.message : '✓ Lee su propio perfil (RLS ok)');

const { error: e2 } = await usuario
  .from('perfiles')
  .update({ nombre: 'Prueba Real', fecha_nacimiento: '1998-03-14', ciudad_nacimiento: 'Bogotá' })
  .eq('id', verifyData.user.id);
console.log(e2 ? '✗ FALLA actualizar perfil: ' + e2.message : '✓ Actualiza su propio perfil (RLS ok)');

// 2) Escaneos: sembrar el día de hoy (como asegurarFilaDeHoy())
const hoy = new Date().toISOString().slice(0, 10);
const { data: filaHoy, error: e3 } = await usuario
  .from('escaneos')
  .insert({ user_id: verifyData.user.id, fecha: hoy, zona: 'Pecho', pct_liberado: 0, minutos_respiracion: 0, dias_sin_contacto: 1, ejercicio_hecho: false })
  .select()
  .single();
console.log(e3 ? '✗ FALLA crear escaneo de hoy: ' + e3.message : '✓ Crea su fila de hoy en escaneos (RLS ok)');

// 3) Completar el ejercicio (como guardarEstado())
const { error: e4 } = await usuario
  .from('escaneos')
  .update({ ejercicio_hecho: true, pct_liberado: 72, minutos_respiracion: 3 })
  .eq('user_id', verifyData.user.id)
  .eq('fecha', hoy);
console.log(e4 ? '✗ FALLA marcar ejercicio hecho: ' + e4.message : '✓ Marca el ejercicio de hoy como hecho (RLS ok)');

// 4) Diario: agregar entrada (como agregarEntradaDiario())
const { data: entrada, error: e5 } = await usuario
  .from('diario_entradas')
  .insert({ user_id: verifyData.user.id, texto: 'Hoy respiré 3 minutos y bajó la tensión.' })
  .select()
  .single();
console.log(e5 ? '✗ FALLA crear entrada de diario: ' + e5.message : '✓ Crea entrada de diario (RLS ok)');

// 5) Intentar leer datos de OTRO usuario (debe fallar / devolver vacío por RLS)
const otroId = '00000000-0000-0000-0000-000000000000';
const { data: fugaDatos } = await usuario.from('perfiles').select('*').eq('id', otroId);
console.log(fugaDatos && fugaDatos.length === 0 ? '✓ RLS bloquea ver perfiles ajenos' : '✗ POSIBLE FUGA: ' + JSON.stringify(fugaDatos));

// 6) Verificar el estado final tal como lo leería useEstadoApp()
const { data: filaFinal } = await usuario.from('escaneos').select('*').eq('user_id', verifyData.user.id).eq('fecha', hoy).single();
console.log('Estado final del día de hoy:', JSON.stringify(filaFinal, null, 1));

// limpieza: borrar el usuario de prueba
await admin.auth.admin.deleteUser(verifyData.user.id);
console.log('✓ Usuario de prueba eliminado (limpieza)');
