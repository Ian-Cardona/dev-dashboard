import React from 'react';
import type { Todo } from '@dev-dashboard/shared';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const tag = todo.type;
  return (
    <li>
      {tag}: {todo.content}
    </li>
  );
};
