import type { LucideIcon } from 'lucide-react';

export function Proximamente({ icon: Icono, titulo, nota }: { icon: LucideIcon; titulo: string; nota: string }) {
  return (
    <div className="flex flex-col items-center px-5 pb-10 pt-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
        <Icono size={28} color="var(--accent)" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        {titulo}
      </h1>
      <p className="mt-2 max-w-[280px] text-[14px] leading-snug text-[var(--text-secondary)]">{nota}</p>
    </div>
  );
}
