import { createBrowserClient } from '@supabase/ssr';

// Cliente de Supabase para el navegador (componentes 'use client'). La anon key es pública por
// diseño — la protección real la hace RLS en cada tabla (ver ESTADO.md "Modelo de datos").
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
