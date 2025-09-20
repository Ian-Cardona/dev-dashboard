import { useEffect, useState } from 'react';
import {
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useQueryPendingResolutions } from '../hooks/useQueryPendingResolutions';
import { TodoReasonEnum, type TodoReasonEnumType } from '@dev-dashboard/shared';
import { useMutateResolveTodos } from '../hooks/useMutateResolveTodos';
import IconSelector from './table/IconSelector';

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
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-bg)] rounded-4xl border border-[var(--color-border)] max-w-3xl w-full mx-4 p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8 text-[var(--color-fg)]">
          <h2 className="flex items-center gap-2 text-2xl">
            <ClockIcon className="w-6 h-6" aria-hidden="true" />
            Pending Resolutions
          </h2>
          <button
            className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-8 py-2 text-sm hover:bg-[var(--color-fg)]/5"
            onClick={() => refetch()}
          >
            <ArrowPathIcon className="w-5 h-5" aria-hidden="true" />
            Refresh
          </button>
        </div>

        {isLoading && (
          <p className="text-[var(--color-fg-muted)]">Loading...</p>
        )}
        {error && <p className="text-red-500">Failed to load resolutions.</p>}

        <div className="max-h-96 overflow-y-auto text-[var(--color-fg)]">
          {data && data.length > 0 ? (
            <ul className="space-y-2">
              {data.map(item => (
                <li
                  key={item.id}
                  className="flex items-center px-4 py-2 rounded-md hover:bg-[var(--color-fg)]/5 text-sm"
                >
                  <div className="flex flex-col items-center gap-2 w-16 flex-shrink-0">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-border)]">
                      <IconSelector type={item.type} />
                    </span>
                    <span className="text-sm">{item.type}</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 ml-4">
                    <span className="text-lg break-words">{item.content}</span>
                    <div className="text-sm mt-2">
                      <span>{item.filePath}</span>
                      <span className="ml-4">{item.lineNumber}</span>
                    </div>
                  </div>
                  <select
                    className="ml-auto border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 rounded-md text-sm"
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
          ) : (
            !isLoading &&
            !error && (
              <p className="text-[var(--color-fg-muted)]">
                No resolutions to display.
              </p>
            )
          )}
        </div>

        {data && data.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-green-600 text-white px-8 py-2 text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <CheckCircleIcon className="w-5 h-5" aria-hidden="true" />
              {isPending ? 'Resolving...' : 'Resolve Selected'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
