import type { Todo } from '@dev-dashboard/shared';

export const filterTodosByTime = (timeFilter: string, todos: Todo[]) => {
  if (timeFilter === 'all') return todos;

  const now = new Date();
  return todos.filter(todo => {
    const todoDate = new Date(todo.syncedAt);
    switch (timeFilter) {
      case 'today': {
        return (
          todoDate.getDate() === now.getDate() &&
          todoDate.getMonth() === now.getMonth() &&
          todoDate.getFullYear() === now.getFullYear()
        );
      }
      case 'yesterday': {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return (
          todoDate.getDate() === yesterday.getDate() &&
          todoDate.getMonth() === yesterday.getMonth() &&
          todoDate.getFullYear() === yesterday.getFullYear()
        );
      }
      case 'last7': {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return todoDate >= sevenDaysAgo && todoDate <= now;
      }
      default:
        return true;
    }
  });
};
