import IconSelector from '../common/IconSelector';
import type { TodoHistory } from '@dev-dashboard/shared';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface TodosHistoryTableRowProps {
  todo: TodoHistory;
}

const TodosHistoryTableRow = ({ todo }: TodosHistoryTableRowProps) => {
  const isResolved = todo.resolved === true;
  const [showFilePathTooltip, setShowFilePathTooltip] = useState(false);

  const formatReason = (reason?: string) => {
    if (!reason) return '';
    return reason
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const latestOccurrence = todo.occurrences[todo.occurrences.length - 1];
  const fileName = todo.filePath.split('/').pop() || todo.filePath;

  return (
    <tr
      className={`border-b border-[var(--color-accent)]/20 transition-all duration-200 ${
        isResolved ? 'bg-green-600/5' : 'hover:bg-[var(--color-bg)]'
      }`}
    >
      <td className="w-40 px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
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
      <td className="min-w-64 px-6 py-4 align-middle text-base font-semibold text-[var(--color-fg)] normal-case">
        <span className={isResolved ? 'text-[var(--color-accent)]' : ''}>
          {todo.content}
        </span>
      </td>
      <td className="w-64 px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        <div className="relative">
          <div
            className="cursor-help truncate font-medium"
            onMouseEnter={() => setShowFilePathTooltip(true)}
            onMouseLeave={() => setShowFilePathTooltip(false)}
          >
            {fileName}
          </div>
          <div className="text-sm text-[var(--color-accent)]">
            Line {todo.lineNumber}
          </div>

          {showFilePathTooltip && (
            <div className="absolute top-full left-0 z-10 mt-1 max-w-md rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-3 shadow-lg">
              <div className="text-sm font-medium text-[var(--color-fg)]">
                {todo.filePath}
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="w-56 px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        <span className={isResolved ? 'text-[var(--color-accent)]' : ''}>
          {latestOccurrence
            ? new Date(latestOccurrence.syncedAt).toLocaleString()
            : '-'}
        </span>
      </td>
      <td className="w-56 px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        {isResolved && todo.resolvedAt ? (
          <div className="flex flex-col">
            <span className="font-semibold text-green-700">
              {new Date(todo.resolvedAt).toLocaleString()}
            </span>
            {todo.reason && (
              <span className="text-sm text-green-700">
                {formatReason(todo.reason)}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[var(--color-accent)]">-</span>
        )}
      </td>
    </tr>
  );
};

export default TodosHistoryTableRow;
