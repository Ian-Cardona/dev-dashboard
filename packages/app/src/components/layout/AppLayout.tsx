import Sidebar from './Sidebar';
import { Outlet } from 'react-router';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--color-bg)]">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
