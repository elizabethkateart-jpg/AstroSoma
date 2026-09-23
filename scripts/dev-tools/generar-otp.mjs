import { createClient } from '@supabase/supabase-js';

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const email = process.argv[2];
const { data, error } = await admin.auth.admin.generateLink({ type: 'magiclink', email });

if (error) {
  console.error('ERROR:', error.message);
  process.exit(1);
}

console.log(data.properties.email_otp);
