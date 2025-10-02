import IconSelector from '../common/IconSelector';
import type { FlattenedTodo } from '@dev-dashboard/shared';

interface TodosHistoryTableRowProps {
  todo: FlattenedTodo;
  showDateFilter: boolean;
}

const TodosHistoryTableRow = ({
  todo,
  showDateFilter,
}: TodosHistoryTableRowProps) => {
  return (
    <tr className="border-b border-[var(--color-border)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5">
      <td className="px-6 py-3 align-middle text-base normal-case">
        <div className="flex items-center gap-2">
          <IconSelector type={todo.type} />
          <span>{todo.type}</span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-2 align-middle text-base font-bold normal-case">
        {todo.content}
      </td>
      {showDateFilter && (
        <td className="px-6 py-2 align-middle text-base normal-case">
          {new Date(todo.syncedAt).toLocaleString()}
        </td>
      )}
    </tr>
  );
};

export default TodosHistoryTableRow;
