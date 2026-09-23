import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cliente con la service_role key — SOLO se importa desde código de servidor (Route Handlers,
// Server Actions). Ignora RLS por completo: úsalo solo para lo que el cliente normal NO puede
// hacer (ej. escribir en `lecturas_diarias`, el caché global). Nunca lo importes desde 'use client'.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
