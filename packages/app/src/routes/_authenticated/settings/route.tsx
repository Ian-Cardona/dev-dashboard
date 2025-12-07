import { useSidebar } from '../../../components/layout/SidebarProvider';
import { UserCircleIcon, KeyIcon, LinkIcon } from '@heroicons/react/24/outline';
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router';

const SettingsLayout = () => {
  const matchRoute = useMatchRoute();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const getTabClass = (path: string) => {
    const isActive = matchRoute({ to: path, fuzzy: false });
    return `flex items-center gap-3 rounded-lg px-4 py-3 text-base transition-all duration-200 ${
      isActive
        ? 'border-l-4 border-l-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
        : 'border-[var(--color-accent)]/20 text-[var(--color-fg)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]'
    }`;
  };

  return (
    <div className="relative flex h-full">
      {isSidebarOpen && (
        <div
          className="absolute inset-0 z-10 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {isSidebarOpen && (
        <aside className="absolute top-0 left-0 z-20 h-full w-64 flex-shrink-0 border-r border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 lg:static">
          <nav className="space-y-3">
            <Link
              to="/settings/account"
              className={getTabClass('/settings/account')}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  closeSidebar();
                }
              }}
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link
              to="/settings/api-keys"
              className={getTabClass('/settings/api-keys')}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  closeSidebar();
                }
              }}
            >
              <KeyIcon className="h-5 w-5" />
              <span>API Keys</span>
            </Link>
            <Link
              to="/settings/connections"
              className={getTabClass('/settings/connections')}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  closeSidebar();
                }
              }}
            >
              <LinkIcon className="h-5 w-5" />
              <span>Connections</span>
            </Link>
          </nav>
        </aside>
      )}

      <div className="flex-1 overflow-hidden p-6">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsLayout,
});
