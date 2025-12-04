import TopBar from './TopBar';
import type { ReactNode } from 'react';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg)]">
      <TopBar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AppLayout;
