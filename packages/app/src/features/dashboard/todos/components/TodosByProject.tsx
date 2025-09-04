import React from 'react';
import type { Todo } from '@dev-dashboard/shared';

type TodosByProjectProps = {
  todos: Todo[];
};

const groupTodosByProject = (todos: Todo[]): Record<string, Todo[]> => {
  return todos.reduce(
    (acc, todo) => {
      if (!acc[todo.projectName]) {
        acc[todo.projectName] = [];
      }
      acc[todo.projectName].push(todo);
      return acc;
    },
    {} as Record<string, Todo[]>
  );
};

export const TodosByProject: React.FC<TodosByProjectProps> = ({ todos }) => {
  const grouped = groupTodosByProject(todos);
  return (
    <div>
      {Object.entries(grouped).map(([projectName, projectTodos]) => (
        <div key={projectName}>
          <h3>{projectName}</h3>
          <ul>
            {projectTodos.map(todo => (
              <li key={todo.id}>
                {todo.type}: {todo.content}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TodosByProject;
