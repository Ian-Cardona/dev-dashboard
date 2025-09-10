import { useEffect, useState } from 'react';
import { useQueryPendingResolutions } from '../hooks/useQueryPendingResolutions';
import { TodoReasonEnum, type TodoReasonEnumType } from '@dev-dashboard/shared';
import { useMutateResolveTodos } from '../hooks/useMutateResolveTodos';

interface ResolutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const toCapitalCase = (str: string) =>
  str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const ResolutionsModal = ({
  isOpen,
  onClose,
}: ResolutionsModalProps) => {
  const { data, isLoading, error, refetch } = useQueryPendingResolutions();
  const [selectedReasons, setSelectedReasons] = useState<{
    [id: string]: string;
  }>({});
  const { mutate, isPending } = useMutateResolveTodos();

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[var(--color-bg)] rounded-md border border-[var(--color-border)] max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[var(--color-fg)]">
            Pending Resolutions
          </h2>
          <button
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] px-4 py-2 hover:bg-[var(--color-fg)]/5"
            onClick={() => refetch()}
          >
            Refresh
          </button>
        </div>

        {isLoading && (
          <p className="text-[var(--color-fg-muted)]">Loading...</p>
        )}
        {error && <p className="text-red-500">Failed to load resolutions.</p>}

        {data && (
          <ul className="list-disc pl-5 space-y-1">
            {data.map((item: any) => (
              <li
                key={item.id}
                className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-[var(--color-fg)]/5 text-[var(--color-fg)]"
              >
                <span>
                  {item.type} — {item.filePath}:{item.lineNumber}{' '}
                  {item.reason ? `(reason: ${item.reason})` : ''}
                </span>
                <select
                  className="ml-auto border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] px-2 py-1 rounded-md"
                  value={selectedReasons[item.id] || ''}
                  onChange={e =>
                    setSelectedReasons(prev => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select reason</option>
                  {TodoReasonEnum.options.map(reason => (
                    <option key={reason} value={reason}>
                      {toCapitalCase(reason)}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        )}

        {/* Resolve Selected Button */}
        {data && (
          <div className="mt-4 flex justify-end">
            <button
              className="rounded-md border border-[var(--color-border)] bg-green-600 text-white px-4 py-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                isPending ||
                Object.values(selectedReasons).filter(Boolean).length === 0
              }
              onClick={() => {
                const resolutions = data
                  .filter((item: any) => selectedReasons[item.id])
                  .map((item: any) => ({
                    id: item.id,
                    syncId: item.syncId,
                    reason: selectedReasons[item.id] as TodoReasonEnumType,
                  }));
                mutate(resolutions);
              }}
            >
              {isPending ? 'Resolving...' : 'Resolve Selected'}
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] px-4 py-2 hover:bg-[var(--color-fg)]/5"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
