import { Outlet } from 'react-router';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
