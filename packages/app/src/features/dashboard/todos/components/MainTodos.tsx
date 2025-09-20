import { useState, useEffect } from 'react';
import { useQueryProjectNames } from '../hooks/useQueryProjectNames.ts';
import { useQueryProjectTodos } from '../hooks/useQueryProjectTodos.ts';
import { TodosToolbar } from './table/TodosToolbar.tsx';
import { TodosTable } from './table/TodosTable.tsx';
import { Cog6ToothIcon, TableCellsIcon } from '@heroicons/react/24/outline';

export const MainTodos = () => {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);

  const { data: projectNamesData } = useQueryProjectNames();
  const projects = projectNamesData?.projects || [];

  const currentProjectName = projects[selectedProjectIndex] || null;

  const { data, isLoading, error } = useQueryProjectTodos(
    currentProjectName || ''
  );

  useEffect(() => {
    if (projects.length && selectedProjectIndex >= projects.length) {
      setSelectedProjectIndex(projects.length - 1);
    }
  }, [projects, selectedProjectIndex]);

  const canGoLeft = selectedProjectIndex > 0;
  const canGoRight = selectedProjectIndex < projects.length - 1;

  const goLeft = () =>
    canGoLeft && setSelectedProjectIndex(selectedProjectIndex - 1);
  const goRight = () =>
    canGoRight && setSelectedProjectIndex(selectedProjectIndex + 1);

  const displayTitle = projects[selectedProjectIndex] || '...';

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-8 text-center text-sm text-[var(--color-fg)]/60">
          Loading todos...
        </div>
      );
    }
    if (error) {
      return (
        <div className="py-8 text-center text-sm text-[var(--color-error)]">
          Failed to load todos
        </div>
      );
    }
    if (!data?.todosBatches || data.todosBatches.length === 0) {
      return (
        <div className="py-8 text-center text-sm text-[var(--color-fg)]/60">
          No todos found
        </div>
      );
    }
    return <TodosTable batch={data.todosBatches.flatMap(batch => batch)} />;
  };

  return (
    <div className="rounded-4xl border pt-8 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-8 px-8 flex-shrink-0">
        <h2 className="flex items-center text-3xl">
          <TableCellsIcon className="w-7 h-7 mr-2" />
          History
        </h2>
        <div className="flex gap-2">
          <button
            aria-label="Open API Keys"
            className="px-8 py-2 border rounded-md font-medium text-sm hover:bg-[var(--color-fg)]/5 flex items-center justify-center"
            // onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-shrink-0">
        <TodosToolbar
          title={displayTitle}
          onGoLeft={goLeft}
          onGoRight={goRight}
          canGoLeft={canGoLeft}
          canGoRight={canGoRight}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{renderContent()}</div>
    </div>
  );
};
