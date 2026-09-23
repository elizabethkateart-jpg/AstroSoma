import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Rutas públicas del funnel (modelo onboarding-first anónimo, ver ESTADO.md "Monetización"):
// el usuario recorre landing → onboarding → paywall → login SIN sesión. Solo /app exige sesión.
const PUBLIC_PATHS = [
  '/',
  '/onboarding',
  '/paywall',
  '/entrar',
  '/auth',
  '/privacidad',
  '/terminos',
  '/reembolsos',
  '/aviso-ia',
  '/api/lectura-diaria', // se usa durante el onboarding, antes de crear cuenta
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  // IMPORTANTE: no poner lógica entre createServerClient y getUser() — getUser() valida el JWT
  // contra Supabase y dispara el refresh si el token expiró (getSession() NO revalida).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const esPublica = PUBLIC_PATHS.some(
    (p) => path === p || (p !== '/' && path.startsWith(p + '/')),
  );

  if (!user && !esPublica) {
    const url = request.nextUrl.clone();
    url.pathname = '/entrar';
    return NextResponse.redirect(url);
  }

  // IMPORTANTE: devolver supabaseResponse tal cual — contiene las cookies de sesión refrescadas.
  return supabaseResponse;
}
