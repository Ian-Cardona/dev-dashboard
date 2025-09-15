import type {
  Todo,
  TodoBatch,
  TodoReasonEnumType,
} from '@dev-dashboard/shared';
import { useMemo, useState } from 'react';

interface TodosToResolveProps {
  isOpen: boolean;
  onClose: () => void;
  previous: TodoBatch[];
  latest: TodoBatch;
}

const REASON_OPTIONS: { value: TodoReasonEnumType; label: string }[] = [
  { value: 'done', label: 'Done' },
  { value: 'not_needed', label: 'Not Needed' },
  { value: 'done_by_others', label: 'Done by Others' },
  { value: 'moved', label: 'Moved' },
  { value: 'refactored', label: 'Refactored' },
  { value: 'moved_elsewhere', label: 'Moved Elsewhere' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'obsolete', label: 'Obsolete' },
  { value: 'invalid', label: 'Invalid' },
  { value: 'wont_fix', label: 'Wont Fix' },
  { value: 'out_of_scope', label: 'Out of Scope' },
  { value: 'implemented', label: 'Implemented' },
  { value: 'cannot_reproduce', label: 'Cannot Reproduce' },
  { value: 'blocked', label: 'Blocked' },
];

export const TodosToResolve: React.FC<TodosToResolveProps> = ({
  isOpen,
  onClose,
  previous,
  latest,
}) => {
  const [resolutions, setResolutions] = useState<
    Record<string, TodoReasonEnumType>
  >({});

  const unresolvedTodos = useMemo((): Todo[] => {
    const previousTodos = previous.flatMap(batch => batch.todos);
    const latestTodoIds = new Set(latest.todos.map(todo => todo.id));
    return previousTodos.filter(todo => !latestTodoIds.has(todo.id));
  }, [previous, latest]);

  const handleReasonChange = (todoId: string, reason: TodoReasonEnumType) => {
    setResolutions(prev => ({ ...prev, [todoId]: reason }));
  };

  const handleConfirm = () => {
    const resolvedItems = Object.entries(resolutions).map(
      ([todoId, reason]) => ({
        todoId,
        reason,
      })
    );

    console.log('Confirming resolutions:', resolvedItems);

    // Here you would call your tanstack query mutation
    // mutate(resolvedItems);

    onClose(); // Close the modal after confirmation
  };

  if (!isOpen) {
    return null;
  }

  // Check if there's anything to resolve
  const hasUnresolvedTodos = unresolvedTodos.length > 0;

  return (
    // Modal Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-fg)]/30 backdrop-blur-sm">
      {/* Modal Panel */}
      <div className="w-full max-w-2xl rounded-lg border border-[var(--color-fg)]/10 bg-[var(--color-bg)] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-fg)]">
            Reflection: Resolve Disappeared TODOs
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[var(--color-fg)]/50 hover:bg-[var(--color-fg)]/10"
            title="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {hasUnresolvedTodos ? (
            <p className="mb-4 text-sm text-[var(--color-fg)]/70">
              The following {unresolvedTodos.length} TODOs were removed from
              your code. Please specify why.
            </p>
          ) : (
            <p className="py-8 text-center text-sm text-[var(--color-fg)]/50">
              No disappeared TODOs found to resolve.
            </p>
          )}

          {hasUnresolvedTodos && (
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--color-fg)]/10">
                  <th className="w-24 px-4 py-3 text-left font-semibold uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider">
                    Content
                  </th>
                  <th className="w-48 px-4 py-3 text-left font-semibold uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {unresolvedTodos.map(todo => (
                  <tr
                    key={todo.id}
                    className="border-b border-[var(--color-fg)]/10 last:border-b-0"
                  >
                    <td className="px-4 py-3 align-middle">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          todo.type === 'TODO'
                            ? 'bg-[var(--color-primary)] text-[var(--color-bg)]'
                            : todo.type === 'FIXME'
                              ? 'bg-[var(--color-error)] text-[var(--color-bg)]'
                              : 'bg-[var(--color-fg)]/[0.1] text-[var(--color-fg)]/[0.8]'
                        }`}
                      >
                        {todo.type}
                      </span>
                    </td>
                    <td className="truncate px-4 py-3 align-middle font-mono text-xs">
                      {todo.content}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <select
                        value={resolutions[todo.id] || ''}
                        onChange={e =>
                          handleReasonChange(
                            todo.id,
                            e.target.value as TodoReasonEnumType
                          )
                        }
                        className="w-full rounded-md border border-[var(--color-fg)]/20 bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-fg)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      >
                        <option value="" disabled>
                          Select a reason...
                        </option>
                        {REASON_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-md border border-[var(--color-fg)]/20 px-4 py-2 text-sm font-medium text-[var(--color-fg)] hover:bg-[var(--color-fg)]/5"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!hasUnresolvedTodos}
            className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Resolutions
          </button>
        </div>
      </div>
    </div>
  );
};
