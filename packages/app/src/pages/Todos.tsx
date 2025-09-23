import { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import PendingResolutions from '../features/todos/components/PendingResolutions';
import TodosHistory from '../features/todos/components/TodosHistory';

const TodosPage = () => {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div
      className="h-screen flex flex-col p-8 overflow-hidden bg-[var(--color-background)] 
                 bg-[radial-gradient(hsl(0_0%_0%_/_0.1)_1px,transparent_0)] 
                 [background-size:32px_32px]"
    >
      <header className="flex flex-shrink-0 items-center gap-2 mb-4">
        <DocumentTextIcon className="h-8 w-8" />
        <h1 className="text-4xl">Todos</h1>
      </header>
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 text-lg font-medium transition-colors duration-200 ${
            activeTab === 'pending'
              ? 'border-l-4 border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-l-4 border-b-2 border-transparent'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Resolutions
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium transition-colors duration-200 ${
            activeTab === 'history'
              ? 'border-l-4 border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-l-4 border-b-2 border-transparent'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>
      {activeTab === 'pending' && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <PendingResolutions />
        </div>
      )}
      {activeTab === 'history' && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <TodosHistory />
        </div>
      )}
    </div>
  );
};

export default TodosPage;
