import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router';

export default function Sidebar() {
  return (
    <aside className="w-64 flex flex-col border-r">
      <div className="p-8 border-b">
        <div className="text-lg font-normal">Hello, User!</div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:border hover:shadow-sm"
            >
              <HomeIcon className="w-5 h-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/todos"
              className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:border hover:shadow-sm"
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Todos
            </Link>
          </li>
          {/* <li>
            <a
              href="#"
              className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:border hover:shadow-sm"
            >
              <ChartBarIcon className="w-5 h-5" />
              Analytics
            </a>
          </li> */}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Link
          to="/settings"
          className="flex items-center gap-2 p-2 border shadow-sm rounded-xl"
        >
          <div className="w-8 h-8 rounded-full"></div>
          <div>
            <div className="text-sm font-normal">John Doe</div>
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
