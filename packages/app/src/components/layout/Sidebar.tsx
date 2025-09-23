import { Cog6ToothIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router';

export default function Sidebar() {
  return (
    <aside className="w-64 flex flex-col border-r bg-[var(--color-surface)]">
      <div className="p-8 border-b">
        <div className="text-lg font-normal">Hello, User!</div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/todos"
              className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:border hover:shadow-sm"
            >
              <DocumentTextIcon className="w-5 h-5" />
              Todos
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Link
          to="/settings"
          className="flex items-center gap-2 p-2 border shadow-sm rounded-xl"
        >
          <div className="w-8 h-8 rounded-full"></div>
          <div>
            <div className="text-sm font-normal">
              Angelo Ian Michael Cardona
            </div>
            <div className="text-xs flex items-center">
              <Cog6ToothIcon className="w-4 h-4 mr-1" />
              Settings
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
