import { UserCircleIcon, KeyIcon } from '@heroicons/react/24/outline';
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router';

const SettingsLayout = () => {
  const matchRoute = useMatchRoute();

  const getTabClass = (path: string) => {
    const isActive = matchRoute({ to: path, fuzzy: false });
    return `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200 ${
      isActive
        ? 'border-l-4 border-l-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
        : 'border-[var(--color-accent)]/20 text-[var(--color-fg)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]'
    }`;
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 flex-shrink-0 border-r border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
        <nav className="space-y-3">
          <Link
            to="/settings/account"
            className={getTabClass('/settings/account')}
          >
            <UserCircleIcon className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <Link
            to="/settings/api-keys"
            className={getTabClass('/settings/api-keys')}
          >
            <KeyIcon className="h-5 w-5" />
            <span>API Keys</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 overflow-hidden p-6">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsLayout,
});
