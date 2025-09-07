import { useQueryLatestTodos } from '../hooks/useQueryLatestTodos';
import { TodosTable } from './TodosTable';

export const LatestTodos = () => {
  const { data, isLoading, isError } = useQueryLatestTodos();

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
      <h2 className="text-lg font-semibold mb-4 mx-4">Latest</h2>
      <TodosTable batch={data?.todosBatches || []} />
    </section>
  );
};
