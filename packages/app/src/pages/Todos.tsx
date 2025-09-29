import PendingResolutions from '../features/todos/components/PendingResolutions';
import TodosAnalytics from '../features/todos/components/TodosAnalytics';
import TodosHistory from '../features/todos/components/TodosHistory';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router';

const TodosPage = () => {
  const location = useLocation();

  const currentTab = location.pathname.split('/').pop() || 'pending';

  const getTabClass = (tabName: string) => {
    return `px-4 py-2 text-lg font-medium transition-colors duration-200 ${
      currentTab === tabName
        ? 'border-b-2 border-l-4 border-[var(--color-primary)] text-[var(--color-primary)]'
        : 'border-b-2 border-l-4 border-transparent'
    }`;
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'pending':
        return <PendingResolutions />;
      case 'history':
        return <TodosHistory />;
      case 'analytics':
        return <TodosAnalytics />;
      default:
        return <PendingResolutions />;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-background)] p-8">
      <header className="mb-4 flex flex-shrink-0 items-center gap-2">
        <DocumentTextIcon className="h-8 w-8" />
        <h1 className="text-4xl">Todos</h1>
      </header>
      <div className="mb-4 flex">
        <Link to="/todos/pending" className={getTabClass('pending')}>
          Pending Resolutions
        </Link>
        <Link to="/todos/history" className={getTabClass('history')}>
          History
        </Link>
        <Link to="/todos/analytics" className={getTabClass('analytics')}>
          Analytics
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default TodosPage;
