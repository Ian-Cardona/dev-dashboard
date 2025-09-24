import { useState } from 'react';
import { TableCellsIcon } from '@heroicons/react/24/outline';
import TodosHistoryTable from './history/TodosHistoryTable.tsx';
import TodosHistoryProjectMenu from './history/TodosHistoryProjectMenu.tsx';
import useQueryProjectNames from '../hooks/useQueryProjectNames.ts';
import useQueryProjectTodos from '../hooks/useQueryProjectTodos.ts';

const TodosHistory = () => {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);

  const { data: projectNamesData } = useQueryProjectNames();
  const projects = projectNamesData?.projects || [];

  const currentProjectName = projects[selectedProjectIndex] ?? null;

  const { data, isLoading, error } = useQueryProjectTodos(
    currentProjectName || ''
  );

  const goLeft = () => {
    if (selectedProjectIndex > 0) {
      setSelectedProjectIndex(selectedProjectIndex - 1);
    }
  };
  const goRight = () => {
    if (selectedProjectIndex < projects.length - 1) {
      setSelectedProjectIndex(selectedProjectIndex + 1);
    }
  };

  const displayTitle = currentProjectName ?? '...';

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-8 text-center text-sm text-[var(--color-accent)]">
          Loading todos...
        </div>
      );
    }
    if (error) {
      return (
        <div className="py-8 text-center text-sm text-[var(--color-primary)]">
          Failed to load todos
        </div>
      );
    }
    if (!data?.todosBatches || data.todosBatches.length === 0) {
      return (
        <div className="py-8 text-center text-sm text-[var(--color-accent)]">
          No todos found
        </div>
      );
    }
    return (
      <TodosHistoryTable batch={data.todosBatches.flatMap(batch => batch)} />
    );
  };

  return (
    <div className="rounded-4xl border pt-8 flex flex-col bg-[var(--color-surface)] h-full">
      <div className="flex items-center justify-between mb-8 px-8">
        <h2 className="flex items-center text-3xl">History</h2>
        <TodosHistoryProjectMenu
          title={displayTitle}
          onGoLeft={goLeft}
          onGoRight={goRight}
          canGoLeft={selectedProjectIndex > 0}
          canGoRight={selectedProjectIndex < projects.length - 1}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-auto rounded-b-4xl">
        {renderContent()}
      </div>
    </div>
  );
};

export default TodosHistory;
