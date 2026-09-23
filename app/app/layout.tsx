import type { ReactNode } from 'react';
import { TabBar } from '@/components/app/TabBar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="flex-1">{children}</div>
      <TabBar />
    </div>
  );
}
