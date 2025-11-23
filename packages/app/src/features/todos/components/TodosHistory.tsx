import useQueryProjectNames from '../hooks/useQueryProjectNames.ts';
import useQueryProjectTodos from '../hooks/useQueryProjectTodos.ts';
import TodosHistoryProjectMenu from './history/TodosHistoryProjectMenu.tsx';
import TodosHistoryTable from './history/TodosHistoryTable.tsx';
import {
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { type ReactNode, useMemo, useState } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

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

  const emptyState: EmptyStateProps | null = useMemo(() => {
    if (error) {
      return {
        icon: (
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-[var(--color-danger)]" />
        ),
        title: 'Failed to load todos',
        description:
          'There was an error loading the todo history. Please try again later.',
      };
    }
    if (isLoading) {
      return {
        icon: null,
        title: 'Loading todos...',
        description: 'Please wait while we fetch your todo history.',
      };
    }
    if (!data?.todosBatches || data.todosBatches.length === 0) {
      return {
        icon: (
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-[var(--color-accent)]" />
        ),
        title: 'No todos found',
        description: currentProjectName
          ? `No todo history available for ${currentProjectName}.`
          : 'Select a project to view todo history.',
      };
    }
    return null;
  }, [error, isLoading, data, currentProjectName]);

  return (
    <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="flex items-center text-3xl">History</h2>
        <TodosHistoryProjectMenu
          title={displayTitle}
          onGoLeft={goLeft}
          onGoRight={goRight}
          canGoLeft={selectedProjectIndex > 0}
          canGoRight={selectedProjectIndex < projects.length - 1}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-b-4xl">
        {emptyState ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-[var(--color-accent)]">
              {emptyState.icon}
              <div className="mt-4 text-lg font-medium">{emptyState.title}</div>
              <div className="mt-2 text-sm">{emptyState.description}</div>
            </div>
          </div>
        ) : (
          data &&
          data.todosBatches && (
            <TodosHistoryTable
              batch={data.todosBatches.flatMap(batch => batch)}
            />
          )
        )}
      </div>
    </section>
  );
};

export default TodosHistory;
