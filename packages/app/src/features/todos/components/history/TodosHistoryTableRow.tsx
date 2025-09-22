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
    <tr className="border-b border-[var(--color-fg)]/10 hover:bg-[var(--color-fg)]/[0.03]">
      <td className="px-6 py-2 align-middle text-sm normal-case">
        <IconSelector type={todo.type} />
        <span>{todo.type}</span>
      </td>
      <td className="max-w-xs px-6 py-2 align-middle text-base normal-case">
        {todo.content}
      </td>
      {showDateFilter && (
        <td className="px-6 py-2 align-middle text-sm normal-case">
          {new Date(todo.syncedAt).toLocaleString()}
        </td>
      )}
    </tr>
  );
};

export default TodosHistoryTableRow;
