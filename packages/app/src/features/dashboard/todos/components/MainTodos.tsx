import { useState, useEffect } from 'react';
import { useQueryProjectNames } from '../hooks/useQueryProjectNames.ts';
import { useQueryProjectTodos } from '../hooks/useQueryProjectTodos.ts';
import { TodosToolbar } from './TodosToolbar.tsx';
import { TodosTable } from './table/TodosTable.tsx';

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
    <section className="rounded-4xl border py-4 h-full flex flex-col">
      <TodosToolbar
        title={displayTitle}
        onGoLeft={goLeft}
        onGoRight={goRight}
        canGoLeft={canGoLeft}
        canGoRight={canGoRight}
      />
      {renderContent()}
    </section>
  );
};
