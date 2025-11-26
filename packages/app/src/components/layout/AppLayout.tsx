import TopBar from './TopBar';
import { Outlet } from 'react-router';

const AppLayout = () => {
  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg)]">
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
