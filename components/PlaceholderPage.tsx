export function PlaceholderPage({ titulo, nota }: { titulo: string; nota: string }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 bg-[var(--bg)] text-[var(--text-primary)] min-h-dvh [font-family:var(--font-body)]">
      <h1 className="text-3xl font-bold [font-family:var(--font-display)]">{titulo}</h1>
      <p className="mt-4 text-[var(--text-secondary)]">{nota}</p>
      <a href="/" className="mt-8 inline-block text-[var(--accent)] underline">Volver al inicio</a>
    </main>
  );
}
