export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="text-xl font-bold text-gray-900">LeanBoard</div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-gray-900 bg-gray-50 border border-gray-200 shadow-sm"
            >
              Placeholder
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-gray-700 border border-transparent rounded-md hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm"
            >
              Placeholder
            </a>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-2 rounded-md border border-gray-200 shadow-sm">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <div className="text-sm font-medium text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">Settings</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
