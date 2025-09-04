import React from 'react';
import type { Todo } from '@dev-dashboard/shared';
import { TodoItem } from './TodoItem';

type TodosByTimeProps = {
  todos: Todo[];
};

const groupTodosByTime = (todos: Todo[]) => {
  const today: Todo[] = [];
  const yesterday: Todo[] = [];
  const older: Todo[] = [];

  const now = new Date();
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);

  todos.forEach(todo => {
    const d = new Date(todo.syncedAt);
    const todoDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (todoDate.getTime() === todayDate.getTime()) {
      today.push(todo);
    } else if (todoDate.getTime() === yesterdayDate.getTime()) {
      yesterday.push(todo);
    } else {
      older.push(todo);
    }
  });

  return { today, yesterday, older };
};

export const TodosByTime: React.FC<TodosByTimeProps> = ({ todos }) => {
  const { today, yesterday, older } = groupTodosByTime(todos);

  return (
    <div>
      {today.length > 0 && (
        <section>
          <h2>Today</h2>
          <ul>
            {today.map(todo => (
              <li key={todo.id}>
                <TodoItem todo={todo} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {yesterday.length > 0 && (
        <section>
          <h2>Yesterday</h2>
          <ul>
            {yesterday.map(todo => (
              <li key={todo.id}>
                <TodoItem todo={todo} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {older.length > 0 && (
        <section>
          <h2>Older</h2>
          <ul>
            {older.map(todo => (
              <li key={todo.id}>
                <TodoItem todo={todo} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
