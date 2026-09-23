'use client';

// LOGIN DE ASTROSOMA — Paso 4 de la Secuencia Maestra.
// Método según la jerarquía de docs/sistema/26-AUTH-MODERNO.md: magic link/OTP por email como
// método PRIMARIO (combo enlace+código en el mismo correo) + Google OAuth secundario. Passkeys
// NO se ofrecen aquí — se proponen recién tras la primera victoria dentro de la app.
// Sin Hotmart conectado todavía (el webhook creará la cuenta al comprar): mientras tanto,
// signInWithOtp con shouldCreateUser:true deja que cualquier correo cree su cuenta al entrar por
// primera vez — se endurece a false en cuanto el webhook de Hotmart sea la única puerta de alta.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Mail } from 'lucide-react';
import { GlifosDivisor } from '@/components/landing/Ornamentos';
import { Isotipo } from '@/components/landing/Isotipo';
import { createClient } from '@/lib/supabase/client';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.85.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z" />
    <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.95a9 9 0 0 0 0 8.06l3-2.33Z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
  </svg>
);

export default function Entrar() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const d = (n: number) => (reduce ? 0 : n);
  const [paso, setPaso] = useState<'email' | 'codigo'>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [hint, setHint] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);
  const [conGoogle, setConGoogle] = useState(false);

  async function enviarAcceso(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setHint(true);
      return;
    }
    setHint(false);
    setErrorEnvio(null);
    setEnviando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setEnviando(false);
    if (error) {
      setErrorEnvio('No pudimos enviarte el acceso. Revisa el correo e intenta de nuevo.');
      return;
    }
    setPaso('codigo');
  }

  async function confirmarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (codigo.trim().length < 8) {
      setHint(true);
      return;
    }
    setHint(false);
    setErrorCodigo(null);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: codigo.trim(), type: 'email' });
    if (error) {
      setErrorCodigo('Ese código no es válido o ya venció. Revisa el correo o pide uno nuevo.');
      return;
    }
    router.push('/app');
  }

  async function entrarConGoogle() {
    setConGoogle(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setConGoogle(false);
      setErrorEnvio('No pudimos conectar con Google. Intenta de nuevo o usa tu correo.');
    }
    // si no hay error, el navegador ya está siendo redirigido a Google
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(700px 420px at 50% -8%, color-mix(in oklab, var(--accent) 8%, transparent) 0%, transparent 60%), ' +
            'radial-gradient(520px 380px at 100% 100%, color-mix(in oklab, var(--accent-2) 6%, transparent) 0%, transparent 55%)',
        }}
      />
      <div className="mx-auto flex min-h-dvh max-w-[440px] flex-col px-5 pb-8">
        <div className="flex h-16 items-center">
          <Link
            href="/paywall"
            aria-label="Atrás"
            className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </Link>
        </div>

        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-center text-center"
        >
          <Isotipo size={44} />
          <h1 className="mt-4 text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
            {paso === 'email' ? 'Entra a tu cuenta' : 'Revisa tu correo'}
          </h1>
          <div className="mt-3">
            <GlifosDivisor />
          </div>
          <p className="mt-4 max-w-[320px] text-[15px] leading-snug text-[var(--text-secondary)]">
            {paso === 'email'
              ? 'Usa el mismo correo con el que compraste tu plan.'
              : `Te enviamos un enlace y un código de 8 dígitos a ${email}. Puedes usar cualquiera de los dos.`}
          </p>
        </motion.div>

        {paso === 'email' ? (
          <motion.form
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(0.1) }}
            onSubmit={enviarAcceso}
            className="mt-8"
          >
            <label htmlFor="email-entrar" className="sr-only">
              Correo electrónico
            </label>
            <div className="flex h-14 items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 shadow-[var(--shadow-1)]">
              <Mail size={18} color="var(--text-tertiary)" aria-hidden="true" />
              <input
                id="email-entrar"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (hint) setHint(false);
                }}
                placeholder="tu@correo.com"
                aria-describedby={hint ? 'hint-email' : undefined}
                aria-invalid={hint}
                className="h-full flex-1 bg-transparent text-[16px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
              />
            </div>
            {hint && (
              <p id="hint-email" role="alert" className="mt-2 text-[13px] text-[var(--accent)]">
                Escribe un correo válido para continuar
              </p>
            )}
            {errorEnvio && (
              <p role="alert" className="mt-2 text-[13px] text-[var(--accent)]">
                {errorEnvio}
              </p>
            )}
            <button
              type="submit"
              disabled={enviando}
              className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] disabled:opacity-70 [touch-action:manipulation]"
            >
              {enviando ? 'Enviando…' : 'Enviarme el acceso'}
            </button>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)]" />
              <span className="text-[12px] text-[var(--text-tertiary)]">o</span>
              <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--text-tertiary)_25%,transparent)]" />
            </div>
            <button
              type="button"
              onClick={entrarConGoogle}
              disabled={conGoogle}
              className="mt-4 flex h-[52px] w-full items-center justify-center gap-3 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-1)] text-[15px] font-semibold text-[var(--text-primary)] disabled:opacity-70 [touch-action:manipulation]"
            >
              <GoogleIcon />
              {conGoogle ? 'Conectando…' : 'Continuar con Google'}
            </button>
          </motion.form>
        ) : (
          <motion.form
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={confirmarCodigo}
            className="mt-8"
          >
            <label htmlFor="codigo-entrar" className="sr-only">
              Código de 8 dígitos
            </label>
            <input
              id="codigo-entrar"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.replace(/\D/g, ''));
                if (hint) setHint(false);
              }}
              placeholder="4817 3920"
              aria-describedby={hint ? 'hint-codigo' : undefined}
              aria-invalid={hint}
              className="h-14 w-full rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] px-4 text-center shadow-[var(--shadow-1)] text-[20px] tracking-[0.3em] text-[var(--text-primary)] outline-none focus-visible:border-[var(--accent)]"
            />
            {hint && (
              <p id="hint-codigo" role="alert" className="mt-2 text-[13px] text-[var(--accent)]">
                Escribe el código de 8 dígitos que te enviamos
              </p>
            )}
            {errorCodigo && (
              <p role="alert" className="mt-2 text-[13px] text-[var(--accent)]">
                {errorCodigo}
              </p>
            )}
            <button
              type="submit"
              className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] [touch-action:manipulation]"
            >
              Confirmar y entrar
            </button>
            <button
              type="button"
              onClick={() => setPaso('email')}
              className="mt-3 flex h-11 w-full items-center justify-center text-[14px] text-[var(--text-tertiary)] underline [touch-action:manipulation]"
            >
              Usar otro correo
            </button>
          </motion.form>
        )}

        <div className="flex-1" />

        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.2) }}
          className="mt-8 text-center text-[13px] text-[var(--text-secondary)]"
        >
          ¿Compraste y no te llegó el correo?{' '}
          <Link href="/entrar/ayuda" className="font-semibold text-[var(--accent)] underline">
            Te ayudamos
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
