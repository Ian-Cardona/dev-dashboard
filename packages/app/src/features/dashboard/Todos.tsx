import { useQueryLatestTodos } from './hooks/useQueryLatestTodos.ts';

const Todos = () => {
  const { data, isLoading, error } = useQueryLatestTodos();

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  if (error) {
    return <div>Failed to load todos</div>;
  }

  if (!data || data.data.length === 0) {
    return <div>No todos found</div>;
  }

  return (
    <div>
      <h2>Your Todos</h2>
      <ul>
        {data.data.map(todo => (
          <li key={todo.id}>
            <strong>{todo.type}</strong>: {todo.content}{' '}
            <em>
              ({todo.filePath}:{todo.lineNumber})
            </em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
