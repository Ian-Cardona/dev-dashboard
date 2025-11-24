import IconSelector from '../common/IconSelector';
import type { FlattenedTodo } from '@dev-dashboard/shared';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface TodosHistoryTableRowProps {
  todo: FlattenedTodo & {
    resolved?: boolean;
    resolvedAt?: string;
    reason?: string;
  };
}

const TodosHistoryTableRow = ({ todo }: TodosHistoryTableRowProps) => {
  const isResolved = todo.resolved === true;

  const formatReason = (reason?: string) => {
    if (!reason) return '';
    return reason
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <tr
      className={`border-b border-[var(--color-border)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 ${
        isResolved ? 'opacity-50' : ''
      }`}
    >
      <td className="px-6 py-3 align-middle text-base normal-case">
        <div className="flex items-center gap-2">
          {isResolved ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <IconSelector type={todo.type} />
          )}
          <span>{todo.type}</span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-2 align-middle text-base font-bold normal-case">
        <div className="flex items-center gap-2">
          <span>{todo.content}</span>
          {isResolved && todo.reason && (
            <span className="text-xs font-normal text-[var(--color-fg)]/70">
              ({formatReason(todo.reason)})
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-2 align-middle text-base normal-case">
        <span>{new Date(todo.syncedAt).toLocaleString()}</span>
      </td>
      <td className="px-6 py-2 align-middle text-base normal-case">
        {isResolved && todo.resolvedAt ? (
          <span>{new Date(todo.resolvedAt).toLocaleString()}</span>
        ) : (
          <span className="text-[var(--color-fg)]/30">-</span>
        )}
      </td>
    </tr>
  );
};

export default TodosHistoryTableRow;
