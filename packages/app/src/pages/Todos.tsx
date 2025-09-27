import PendingResolutions from '../features/todos/components/PendingResolutions';
import TodosAnalytics from '../features/todos/components/TodosAnalytics';
import TodosHistory from '../features/todos/components/TodosHistory';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const TodosPage = () => {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-background)] p-8">
      <header className="mb-4 flex flex-shrink-0 items-center gap-2">
        <DocumentTextIcon className="h-8 w-8" />
        <h1 className="text-4xl">Todos</h1>
      </header>
      <div className="mb-4 flex">
        <button
          className={`px-4 py-2 text-lg font-medium transition-colors duration-200 ${
            activeTab === 'pending'
              ? 'border-b-2 border-l-4 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-b-2 border-l-4 border-transparent'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Resolutions
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium transition-colors duration-200 ${
            activeTab === 'history'
              ? 'border-b-2 border-l-4 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-b-2 border-l-4 border-transparent'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium transition-colors duration-200 ${
            activeTab === 'analytics'
              ? 'border-b-2 border-l-4 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-b-2 border-l-4 border-transparent'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      {activeTab === 'pending' && (
        <div className="min-h-0 flex-1 overflow-hidden">
          <PendingResolutions />
        </div>
      )}
      {activeTab === 'history' && (
        <div className="min-h-0 flex-1 overflow-hidden">
          <TodosHistory />
        </div>
      )}
      {activeTab === 'analytics' && (
        <div className="min-h-0 flex-1 overflow-hidden">
          <TodosAnalytics />
        </div>
      )}
    </div>
  );
};

export default TodosPage;
