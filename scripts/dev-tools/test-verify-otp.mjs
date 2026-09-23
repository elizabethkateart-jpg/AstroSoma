import { createClient as createAdmin } from '@supabase/supabase-js';
import { createClient as createAnon } from '@supabase/supabase-js';

const admin = createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const anon = createAnon(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = 'astrosoma.prueba.real@gmail.com';

// 1) generar el código real (no envía correo, no consume el límite de envío)
const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
if (linkError) {
  console.error('ERROR generando OTP:', linkError.message);
  process.exit(1);
}
const otp = linkData.properties.email_otp;
console.log('OTP generado, longitud:', otp.length);

// 2) verificar el código EXACTAMENTE como lo hace confirmarCodigo() en app/entrar/page.tsx
const { data: verifyData, error: verifyError } = await anon.auth.verifyOtp({ email, token: otp, type: 'email' });
if (verifyError) {
  console.error('ERROR verificando OTP:', verifyError.message);
  process.exit(1);
}
console.log('LOGIN OK — usuario:', verifyData.user.id);
console.log('Sesión creada:', !!verifyData.session);

// 3) confirmar que el trigger de Supabase creó la fila de perfiles automáticamente
const { data: perfil, error: perfilError } = await admin.from('perfiles').select('*').eq('id', verifyData.user.id).single();
if (perfilError) {
  console.error('ERROR leyendo perfil:', perfilError.message);
  process.exit(1);
}
console.log('PERFIL CREADO POR EL TRIGGER:', JSON.stringify(perfil, null, 1));
