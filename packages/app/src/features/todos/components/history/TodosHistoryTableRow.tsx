import IconSelector from '../common/IconSelector';
import type { TodoHistory } from '@dev-dashboard/shared';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface TodosHistoryTableRowProps {
  todo: TodoHistory;
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

  const latestOccurrence = todo.occurrences[todo.occurrences.length - 1];

  return (
    <tr
      className={`border-b border-[var(--color-accent)]/20 transition-all duration-200 ${
        isResolved ? 'bg-green-600/5' : 'hover:bg-[var(--color-bg)]'
      }`}
    >
      <td className="px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        <div className="flex items-center gap-2">
          {isResolved ? (
            <CheckCircleIcon className="h-5 w-5 text-green-700" />
          ) : (
            <IconSelector type={todo.type} />
          )}
          <span className={isResolved ? 'text-[var(--color-accent)]' : ''}>
            {todo.type}
          </span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-4 align-middle text-base font-semibold text-[var(--color-fg)] normal-case">
        <div className="flex items-center gap-2">
          <span className={isResolved ? 'text-[var(--color-accent)]' : ''}>
            {todo.content}
          </span>
          {isResolved && todo.reason && (
            <span className="text-sm font-normal text-green-700">
              ({formatReason(todo.reason)})
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        <span className={isResolved ? 'text-[var(--color-accent)]' : ''}>
          {latestOccurrence
            ? new Date(latestOccurrence.syncedAt).toLocaleString()
            : '-'}
        </span>
      </td>
      <td className="px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        {isResolved && todo.resolvedAt ? (
          <span className="font-semibold text-green-700">
            {new Date(todo.resolvedAt).toLocaleString()}
          </span>
        ) : (
          <span className="text-[var(--color-accent)]">-</span>
        )}
      </td>
    </tr>
  );
};

export default TodosHistoryTableRow;
