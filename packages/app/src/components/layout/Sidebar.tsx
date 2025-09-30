import { Cog6ToothIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router';

const Sidebar = () => {
  return (
    <aside className="flex w-64 flex-col border-r bg-[var(--color-surface)]">
      <div className="border-b bg-[var(--color-surface-variant)] p-8">
        <div className="text-lg font-normal text-[var(--color-fg)]">
          Hello, User!
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/todos"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl border px-4 py-2 ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'hover:border hover:shadow-sm'
                }`
              }
            >
              <DocumentTextIcon className="h-5 w-5" />
              Todos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl border px-4 py-2 ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'hover:border hover:shadow-sm'
                }`
              }
            >
              <DocumentTextIcon className="h-5 w-5" />
              Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="border-t p-4">
        <Link
          to="/settings"
          className="flex items-center gap-2 rounded-xl border p-2 shadow-sm"
        >
          <div className="h-8 w-8 rounded-full"></div>
          <div>
            <div className="text-sm font-normal">
              Angelo Ian Michael Cardona
            </div>
            <div className="flex items-center text-xs">
              <Cog6ToothIcon className="mr-1 h-4 w-4" />
              Settings
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
