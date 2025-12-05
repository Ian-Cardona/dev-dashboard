import {
  CodeBracketIcon,
  LinkIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { Link, useMatchRoute } from '@tanstack/react-router';

const TopBar = () => {
  const matchRoute = useMatchRoute();

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
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[var(--color-fg)]">
          DevDashboard
        </h1>
      </div>

      <nav className="flex items-center gap-3">
        <Link to="/todos" className={getLinkClass('/todos')}>
          <div className={getIconClass('/todos')}>
            <CodeBracketIcon className="h-5 w-5" />
          </div>
          <span>Todos</span>
        </Link>

        <Link to="/integrations" className={getLinkClass('/integrations')}>
          <div className={getIconClass('/integrations')}>
            <LinkIcon className="h-5 w-5" />
          </div>
          <span>Integrations</span>
        </Link>
      </nav>

      <div className="flex items-center">
        <Link to="/settings" className={getLinkClass('/settings')}>
          <div className={getIconClass('/settings')}>
            <Cog6ToothIcon className="h-5 w-5" />
          </div>
          <span>Settings</span>
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
