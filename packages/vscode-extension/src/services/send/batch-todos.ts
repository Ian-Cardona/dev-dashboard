import { ProcessedTodo, RawTodoBatch } from '@dev-dashboard/shared';

export const batchTodos = (
  todos: ProcessedTodo[],
  projectName: string
): RawTodoBatch => {
  const batch = {
    projectName: projectName,
    todos: todos.map(todo => ({ ...todo })),
  };

  return batch;
};
