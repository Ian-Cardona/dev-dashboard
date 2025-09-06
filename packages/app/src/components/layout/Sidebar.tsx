export default function Sidebar() {
  return (
    <aside className="w-64 flex flex-col border-r">
      <div className="p-6 border-b">
        <div className="text-xl font-bold">Hello, User!</div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 border shadow-sm rounded-xl"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 border rounded-xl hover:border hover:shadow-sm"
            >
              Analytics
            </a>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-2 border shadow-sm rounded-xl">
          <div className="w-8 h-8 rounded-full"></div>
          <div>
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs">Settings</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
