'use client';

// NAV INFERIOR de la app interna — 4 secciones (Hoy/Duelo/Diario/Perfil). Pill flotante ancha con
// sombra + etiquetas de texto (a pedido del usuario, 2026-09-09): el ícono activo se resalta en
// un círculo dorado sólido.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, BookOpen, User } from 'lucide-react';
import { useEstadoApp } from '@/lib/appLocal';

export function TabBar() {
  const pathname = usePathname();
  const estado = useEstadoApp();
  // La pestaña "Duelo" no le habla a quien entró por malestar físico sin duelo de por medio.
  const TABS = [
    { href: '/app', label: 'Hoy', icon: Home },
    { href: '/app/duelo', label: estado.categoriaDuelo === 'somatica' ? 'Ritual' : 'Duelo', icon: Heart },
    { href: '/app/diario', label: 'Diario', icon: BookOpen },
    { href: '/app/perfil', label: 'Perfil', icon: User },
  ];
  return (
    <div className="sticky bottom-0 z-10 flex justify-center px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
      <nav
        aria-label="Navegación principal"
        className="flex w-full max-w-[420px] items-stretch justify-between gap-1 rounded-full border border-[color-mix(in_oklab,var(--accent)_16%,transparent)] bg-[color-mix(in_oklab,var(--surface)_96%,transparent)] px-2 py-2 shadow-[var(--shadow-2)] backdrop-blur-sm"
      >
        {TABS.map((tab) => {
          const activo = tab.href === '/app' ? pathname === '/app' : pathname.startsWith(tab.href);
          const Icono = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={activo ? 'page' : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-1 [touch-action:manipulation]"
            >
              <span
                className="flex size-9 items-center justify-center rounded-full"
                style={activo ? { background: 'var(--accent)' } : undefined}
              >
                <Icono
                  size={18}
                  strokeWidth={2.25}
                  color={activo ? 'var(--bg)' : 'var(--text-secondary)'}
                  aria-hidden="true"
                />
              </span>
              <span
                className={`text-[10px] font-semibold ${
                  activo ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
