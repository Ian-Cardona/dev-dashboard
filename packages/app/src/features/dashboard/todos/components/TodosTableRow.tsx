import type { FlattenedTodo } from '@dev-dashboard/shared';

interface TodosTableRowProps {
  todo: FlattenedTodo;
  showDateFilter: boolean;
}

export const TodosTableRow = ({ todo, showDateFilter }: TodosTableRowProps) => {
  return (
    <tr
      key={todo.id}
      className="border-b border-[var(--color-fg)]/10 hover:bg-[var(--color-fg)]/[0.03]"
    >
      <td className="px-4 py-4 align-middle">
        <span
          className={`rounded-full px-2 py-1  font-medium ${
            todo.type === 'TODO'
              ? 'bg-[var(--color-primary)] text-[var(--color-bg)]'
              : todo.type === 'FIXME'
                ? 'bg-[var(--color-error)] text-[var(--color-bg)]'
                : todo.type === 'HACK'
                  ? 'bg-[var(--color-fg)]/[0.1] text-[var(--color-fg)]/[0.8]'
                  : 'bg-[var(--color-fg)]/[0.1] text-[var(--color-fg)]/[0.8]'
          }`}
        >
          {todo.type}
        </span>
      </td>
      <td className="max-w-xs px-4 py-4 align-middle">{todo.content}</td>
      <td className="px-4 py-4 align-middle">
        <span
          className={`rounded-full px-2 py-1  font-medium ${
            todo.resolved
              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
              : 'bg-[var(--color-fg)]/[0.1] text-[var(--color-fg)]/[0.8]'
          }`}
        >
          {todo.resolved ? 'Yes' : 'No'}
        </span>
      </td>
      {showDateFilter && (
        <td className="px-4 py-4 align-middle">{todo.syncedAt}</td>
      )}
    </tr>
  );
};
