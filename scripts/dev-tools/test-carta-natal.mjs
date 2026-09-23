import { createClient as createAdmin } from '@supabase/supabase-js';
import { createClient as createAnon } from '@supabase/supabase-js';

const admin = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const anon = createAnon(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = `prueba-carta-${Date.now()}@astrosoma-test-real.com`;
const { data: linkData } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
const { data: verifyData, error: verifyError } = await anon.auth.verifyOtp({
  email,
  token: linkData.properties.email_otp,
  type: 'email',
});
if (verifyError) {
  console.error('ERROR login:', verifyError.message);
  process.exit(1);
}
console.log('✓ Usuario de prueba creado:', verifyData.user.id);

// Simular actualizarPerfil() guardando una fecha de nacimiento real
await admin
  .from('perfiles')
  .update({ nombre: 'Prueba Carta', fecha_nacimiento: '1998-03-14', ciudad_nacimiento: 'Bogotá', sol_natal: 'Piscis', luna_natal: 'Libra' })
  .eq('id', verifyData.user.id);
console.log('✓ Fecha de nacimiento + carta natal guardadas (Sol: Piscis, Luna: Libra)');

// Llamar al endpoint /api/lectura-diaria CON la sesión real (cookie de Supabase) usando fetch directo
const cookieValue = JSON.stringify([
  verifyData.session.access_token,
  verifyData.session.refresh_token,
  null,
  null,
  null,
]);
const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)[1];
const cookieName = `sb-${projectRef}-auth-token`;

const res = await fetch('http://localhost:3000/api/lectura-diaria', {
  headers: { Cookie: `${cookieName}=base64-${Buffer.from(cookieValue).toString('base64')}` },
});
const body = await res.json();
console.log('--- RESPUESTA DEL ENDPOINT (con sesión real) ---');
console.log(JSON.stringify(body, null, 1));

// Verificar que quedó cacheada por usuario
const { data: cacheRow } = await admin.from('lecturas_diarias').select('*').eq('user_id', verifyData.user.id).single();
console.log('--- FILA EN lecturas_diarias ---');
console.log(cacheRow ? JSON.stringify(cacheRow, null, 1) : 'NO SE GUARDÓ EN CACHÉ');

// limpieza
await admin.auth.admin.deleteUser(verifyData.user.id);
console.log('✓ Usuario de prueba eliminado');
