import {
  ClockIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router';

const TodosLayout = () => {
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
          <Link to="/todos/pending" className={getTabClass('/todos/pending')}>
            <ClockIcon className="h-5 w-5" />
            <span>Pending</span>
          </Link>
          <Link to="/todos/history" className={getTabClass('/todos/history')}>
            <ArchiveBoxIcon className="h-5 w-5" />
            <span>History</span>
          </Link>
          <Link
            to="/todos/analytics"
            className={getTabClass('/todos/analytics')}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 overflow-hidden p-6">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/todos')({
  component: TodosLayout,
});
