import type { FlattenedTodo } from '@dev-dashboard/shared';
import IconSelector from '../common/IconSelector';

interface TodosHistoryTableRowProps {
  todo: FlattenedTodo;
  showDateFilter: boolean;
}

const TodosHistoryTableRow = ({
  todo,
  showDateFilter,
}: TodosHistoryTableRowProps) => {
  return (
    <tr className="border-b border-[var(--color-fg)]/10 hover:bg-[var(--color-fg)]/[0.03] hover:border-b-2 hover:border-[var(--color-primary)]">
      <td className="px-6 py-3 align-middle text-base normal-case">
        <div className="flex items-center gap-2">
          <IconSelector type={todo.type} />
          <span>{todo.type}</span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-2 align-middle font-bold text-base normal-case">
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
