import { useQueryFetchUserProfile } from '../../features/settings/hooks/useQueryFetchUserProfile';
import {
  Cog6ToothIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Link, NavLink } from 'react-router';

const Sidebar = () => {
  const { data: userProfile, isLoading } = useQueryFetchUserProfile();

  const displayName = isLoading
    ? 'Loading...'
    : userProfile
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : 'Guest';

  const greeting = isLoading
    ? 'Loading...'
    : userProfile
      ? `Hello, ${userProfile.firstName}!`
      : 'Hello, Guest!';

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-[var(--color-surface)]">
      <div className="border-b bg-gradient-to-br from-[var(--color-surface-variant)] to-[var(--color-surface-variant-hover)] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--color-primary)] p-2">
            {/* TODO: Change this to the app icon */}
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-fg)]">
              {greeting}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-fg-subtle)]">
              Welcome back to your workspace
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/todos"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-4xl border px-4 py-3 transition-all duration-150 ${
                  isActive
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                    : 'border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-surface-variant)] hover:shadow-sm'
                }`
              }
            >
              <DocumentTextIcon className="h-5 w-5 transition-transform duration-150 group-hover:scale-105" />
              <span className="font-medium">Todos</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/integrations"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-4xl border px-4 py-3 transition-all duration-150 ${
                  isActive
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                    : 'border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-surface-variant)] hover:shadow-sm'
                }`
              }
            >
              <DocumentTextIcon className="h-5 w-5 transition-transform duration-150 group-hover:scale-105" />
              <span className="font-medium">Integrations</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="border-t px-6 py-4">
        <Link
          to="/settings"
          className="group flex items-center gap-3 rounded-4xl border border-[var(--color-border)] p-4 transition-all duration-150 hover:bg-[var(--color-surface-variant)] hover:shadow-sm focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none"
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-fg)] transition-colors duration-150 group-hover:text-[var(--color-primary)]">
              <Cog6ToothIcon className="h-4 w-4 transition-transform duration-150 group-hover:rotate-45" />
              <span className="truncate">{displayName}</span>
            </div>
            {userProfile?.email && (
              <div className="mt-1 text-xs text-[var(--color-fg-subtle)] transition-colors duration-150 group-hover:text-[var(--color-fg)]">
                <span className="truncate">{userProfile.email}</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
