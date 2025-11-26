import {
  CodeBracketIcon,
  LinkIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router';

const TopBar = () => {
  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[var(--color-fg)]">
          DevDashboard
        </h1>
      </div>

      <nav className="flex items-center gap-3">
        <NavLink
          to="/todos"
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-lg border px-4 py-2 text-base font-semibold transition-all duration-200 ${
              isActive
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                : 'border-[var(--color-accent)]/20 text-[var(--color-fg)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`}
              >
                <CodeBracketIcon className="h-5 w-5" />
              </div>
              <span>Todos</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/integrations"
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-lg border px-4 py-2 text-base font-semibold transition-all duration-200 ${
              isActive
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                : 'border-[var(--color-accent)]/20 text-[var(--color-fg)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`}
              >
                <LinkIcon className="h-5 w-5" />
              </div>
              <span>Integrations</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="flex items-center">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-lg border px-4 py-2 text-base font-semibold transition-all duration-200 ${
              isActive
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                : 'border-[var(--color-accent)]/20 text-[var(--color-fg)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </div>
              <span>Settings</span>
            </>
          )}
        </NavLink>
      </div>
    </header>
  );
};

export default TopBar;
