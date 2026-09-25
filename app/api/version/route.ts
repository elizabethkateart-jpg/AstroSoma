import { NextResponse } from 'next/server';

// Endpoint de verificación de publicación (62-PUBLICACION-SEGURA-Y-CONTINUA.md, P5/P7): confirma
// qué commit exacto quedó construido en cada entorno, sin exponer nada sensible.

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    env: process.env.VERCEL_ENV ?? 'development',
  });
}
