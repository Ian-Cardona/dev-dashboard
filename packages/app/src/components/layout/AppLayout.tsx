import { Outlet } from 'react-router';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
