import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Destino del enlace del magic link (la otra mitad del "combo" enlace+código) y del regreso de
// Google OAuth — intercambia el código temporal por la sesión real y manda a la app.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/app`);
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=enlace_invalido`);
}
