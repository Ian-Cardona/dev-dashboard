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
    return `flex items-center gap-2 text-base font-medium transition-colors duration-200 ${
      isActive
        ? 'text-[var(--color-primary)]'
        : 'text-[var(--color-fg)] hover:text-[var(--color-primary)]'
    }`;
  };

  return (
    <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-6">
      <div className="flex items-center gap-6">
        {showMenuButton && (
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-[var(--color-fg)] transition-all duration-200 hover:bg-[var(--color-bg)]"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}
        <div className="flex items-center gap-2">
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

        <nav className="flex items-center gap-6">
          <Link to="/todos" className={getLinkClass('/todos')}>
            <CodeBracketIcon className="h-5 w-5" />
            <span>Todos</span>
          </Link>

          <Link to="/integrations" className={getLinkClass('/integrations')}>
            <LinkIcon className="h-5 w-5" />
            <span>Integrations</span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center">
        <Link to="/settings" className={getLinkClass('/settings')}>
          <Cog6ToothIcon className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
