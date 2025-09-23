import { Outlet } from 'react-router';
import Sidebar from './Sidebar';

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
