import { useState } from 'react';
import { useQueryLatestTodos } from './hooks/useQueryLatestTodos.ts';

const Todos = () => {
  const { data, isLoading, error } = useQueryLatestTodos();
  const [view, setView] = useState<'project' | 'time'>('project');

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  if (error) {
    return <div>Failed to load todos</div>;
  }

  if (!data || data.todos.length === 0) {
    return <div>No todos found</div>;
  }

  // Group by project
  const groupedByProject = data.todos.reduce<Record<string, typeof data.todos>>(
    (acc, todo) => {
      const key = todo.projectName ?? 'Unknown Project';
      if (!acc[key]) acc[key] = [];
      acc[key].push(todo);
      return acc;
    },
    {}
  );

  // Group by time
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groupedByTime: Record<string, typeof data.todos> = {
    Today: [],
    Yesterday: [],
    Older: [],
  };

  data.todos.forEach(todo => {
    const dateStr = new Date(todo.syncedAt).toDateString();
    if (dateStr === today) {
      groupedByTime.Today.push(todo);
    } else if (dateStr === yesterday) {
      groupedByTime.Yesterday.push(todo);
    } else {
      groupedByTime.Older.push(todo);
    }
  });

  return (
    <div>
      <h2>Your Todos</h2>
      <div>
        <button onClick={() => setView('project')}>Project View</button>
        <button onClick={() => setView('time')}>Time View</button>
      </div>

      {view === 'project' ? (
        <div>
          {Object.entries(groupedByProject).map(([project, todos]) => (
            <div key={project}>
              <h3>{project}</h3>
              <ul>
                {todos.map(todo => (
                  <li key={todo.id}>
                    <strong>{todo.type}</strong>: {todo.content}{' '}
                    <em>
                      ({todo.filePath}:{todo.lineNumber})
                    </em>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {Object.entries(groupedByTime).map(([period, todos]) => (
            <div key={period}>
              <h3>{period}</h3>
              <ul>
                {todos.map(todo => (
                  <li key={todo.id}>
                    <strong>{todo.type}</strong>: {todo.content}{' '}
                    <em>
                      ({todo.filePath}:{todo.lineNumber})
                    </em>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Todos;
