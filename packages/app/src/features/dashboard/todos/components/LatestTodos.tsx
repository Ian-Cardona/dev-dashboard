import { useState } from 'react';
import {
  Cog6ToothIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useQueryLatestTodos } from '../hooks/useQueryLatestTodos';
import { TodosTable } from './table/TodosTable';
import { ResolutionsModal } from './ResolutionModal';
import { TodosSettings } from './TodosSettings';

export const LatestTodos = () => {
  const { data, isLoading, isError } = useQueryLatestTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isLoading) {
    return (
      <section className="rounded-4xl border p-8">
        Loading latest todos...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-4xl border p-8">
        Error loading latest todos.
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-4xl border p-8">
        No latest todos found.
      </section>
    );
  }

  return (
    <section className="rounded-4xl border py-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 px-8">
        <h2 className="flex items-center text-3xl">
          <ClockIcon className="w-7 h-7 mr-2" />
          Latest
        </h2>
        <div className="flex gap-2">
          <button
            className="flex items-center px-8 py-2 border rounded-md font-medium text-sm hover:bg-[var(--color-fg)]/5"
            onClick={() => setIsModalOpen(true)}
          >
            <CheckCircleIcon className="w-5 h-5 mr-1" />
            Resolve
          </button>
          <button
            aria-label="Open API Keys"
            className="px-8 py-2 border rounded-md font-medium text-sm hover:bg-[var(--color-fg)]/5 flex items-center justify-center"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <TodosTable batch={data?.todosBatches || []} />
      <ResolutionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <TodosSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </section>
  );
};
