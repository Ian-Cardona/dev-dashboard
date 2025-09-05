import { useState } from 'react';
import { useQueryLatestTodos } from './hooks/useQueryLatestTodos.ts';
import { useQueryProjectNames } from './hooks/useQueryProjectNames.ts';
import { useQueryProjectTodos } from './hooks/useQueryProjectTodos.ts';
import { TodosToolbar, TodosByProject } from './components';
import { filterTodosByTime } from './utils/filters.ts';

const Todos = () => {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(-1);
  const [timeFilter, setTimeFilter] = useState<
    'all' | 'today' | 'yesterday' | 'last7'
  >('all');

  const { data: projectNames } = useQueryProjectNames();

  const currentProject =
    selectedProjectIndex === -1
      ? null
      : projectNames?.projects[selectedProjectIndex] || null;

  const latestQuery = useQueryLatestTodos();

  const projectQuery = useQueryProjectTodos(currentProject || '');

  const activeQuery = selectedProjectIndex === -1 ? latestQuery : projectQuery;
  const { data, isLoading, error } = activeQuery;

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  if (error) {
    return <div>Failed to load todos</div>;
  }

  if (!data || data.todos.length === 0) {
    return <div>No todos found</div>;
  }

  const getDisplayTitle = () => {
    if (selectedProjectIndex === -1) return 'Latest';
    return projectNames?.projects[selectedProjectIndex] || 'Project';
  };

  const filteredTodos = filterTodosByTime(timeFilter, data.todos);

  return (
    <div>
      <h2>Your Todos - {getDisplayTitle()}</h2>
      <select
        value={timeFilter}
        onChange={e => setTimeFilter(e.target.value as any)}
        style={{ marginBottom: '1rem' }}
      >
        <option value="all">All</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last7">Last 7 Days</option>
      </select>
      <TodosToolbar
        projects={projectNames?.projects || []}
        selectedProjectIndex={selectedProjectIndex}
        setSelectedProjectIndex={setSelectedProjectIndex}
      />
      <TodosByProject todos={filteredTodos} />
    </div>
  );
};

export default Todos;
