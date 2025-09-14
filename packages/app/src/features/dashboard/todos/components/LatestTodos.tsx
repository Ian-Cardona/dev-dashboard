import { useState } from 'react';
import { useQueryLatestTodos } from '../hooks/useQueryLatestTodos';
import { TodosTable } from './table/TodosTable';
import { ResolutionsModal } from './ResolutionModal';

export const LatestTodos = () => {
  const { data, isLoading, isError } = useQueryLatestTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <section className="rounded-4xl border p-4">
        Loading latest todos...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-4xl border p-4">
        Error loading latest todos.
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-4xl border p-4">
        No latest todos found.
      </section>
    );
  }

  return (
    <section className="rounded-4xl border py-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-bold">Latest</h2>
        <button
          className="px-4 py-2 border rounded-md font-medium text-sm ml-2"
          onClick={() => setIsModalOpen(true)}
        >
          Open Resolutions
        </button>
      </div>
      <TodosTable batch={data?.todosBatches || []} />
      <ResolutionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
