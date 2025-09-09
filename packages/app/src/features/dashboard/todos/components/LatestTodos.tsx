import { useQueryLatestTodos } from '../hooks/useQueryLatestTodos';
import { useQueryPendingResolutions } from '../hooks/useQueryPendingResolutions';
import { TodosTable } from './TodosTable';

export const LatestTodos = () => {
  const { data, isLoading, isError } = useQueryLatestTodos();
  const { data: pending, refetch: refetchPending } =
    useQueryPendingResolutions();

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
      <div className="flex justify-between mb-4 mx-4">
        <h2 className="text-lg font-semibold">Latest</h2>
        <button
          className="p-2 rounded-md border hover:bg-gray-100 transition"
          onClick={async () => {
            const { data } = await refetchPending();
            console.log('Pending resolutions:', data);
          }}
        >
          Action
        </button>
      </div>
      <TodosTable batch={data?.todosBatches || []} />
    </section>
  );
};
