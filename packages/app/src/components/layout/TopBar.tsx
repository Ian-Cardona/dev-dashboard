import devDashboardLogo from '../../assets/devdb-logo.png';
import { useSidebar } from './SidebarProvider';
import {
  CodeBracketIcon,
  LinkIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { Link, useMatchRoute } from '@tanstack/react-router';

const TopBar = () => {
  const matchRoute = useMatchRoute();
  const { toggleSidebar } = useSidebar();

  const isInTodosRoute = matchRoute({ to: '/todos', fuzzy: true });
  const isInIntegrationsRoute = matchRoute({
    to: '/integrations',
    fuzzy: true,
  });
  const isInSettingsRoute = matchRoute({ to: '/settings', fuzzy: true });

  const showMenuButton =
    isInTodosRoute || isInIntegrationsRoute || isInSettingsRoute;

  const getLinkClass = (path: string) => {
    const isActive = matchRoute({ to: path, fuzzy: true });
    return `group relative flex items-center gap-3 rounded-lg border px-4 py-2 text-base font-semibold transition-all duration-200 ${
      isActive
        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
        : 'border-[var(--color-accent)]/20 text-[var(--color-fg)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]'
    }`;
  };

  const getIconClass = (path: string) => {
    const isActive = matchRoute({ to: path, fuzzy: true });
    return `flex-shrink-0 transition-all duration-200 ${
      isActive ? '' : 'group-hover:scale-110'
    }`;
  };

  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-6">
      <div className="flex items-center gap-2">
        {showMenuButton && (
          <button
            onClick={toggleSidebar}
            className="mr-2 rounded-lg p-2 text-[var(--color-fg)] transition-all duration-200 hover:bg-[var(--color-bg)]"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}
        <img
          src={devDashboardLogo}
          alt="DevDB Logo"
          className="h-6 w-6 object-contain"
        />
        <h1
          className="hidden text-lg font-bold text-[var(--color-fg)] lg:block"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          DevDashboard
        </h1>
      </div>

      <nav className="flex items-center gap-3">
        <Link to="/todos" className={getLinkClass('/todos')}>
          <div className={getIconClass('/todos')}>
            <CodeBracketIcon className="h-5 w-5" />
          </div>
          <span className="hidden lg:inline">Todos</span>
        </Link>

        <Link to="/integrations" className={getLinkClass('/integrations')}>
          <div className={getIconClass('/integrations')}>
            <LinkIcon className="h-5 w-5" />
          </div>
          <span className="hidden lg:inline">Integrations</span>
        </Link>
      </nav>

      <div className="flex items-center">
        <Link to="/settings" className={getLinkClass('/settings')}>
          <div className={getIconClass('/settings')}>
            <Cog6ToothIcon className="h-5 w-5" />
          </div>
          <span className="hidden lg:inline">Settings</span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
