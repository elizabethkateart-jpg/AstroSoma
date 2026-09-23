import { createClient } from '@supabase/supabase-js';

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = `prueba-${Date.now()}@astrosoma-test.com`;

const { data, error } = await admin.auth.admin.generateLink({
  type: 'magiclink',
  email,
  options: { redirectTo: 'http://localhost:3000/auth/callback' },
});

if (error) {
  console.error('ERROR generando link:', error.message);
  process.exit(1);
}

console.log('EMAIL_PRUEBA=' + email);
console.log('ACTION_LINK=' + data.properties.action_link);
