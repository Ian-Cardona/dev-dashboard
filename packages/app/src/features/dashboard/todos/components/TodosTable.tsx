import type { FlattenedTodo, TodoBatch } from '@dev-dashboard/shared';
import { useMemo, useState } from 'react';
import { TodosTableRow } from './TodosTableRow';
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FunnelIcon, // New icon for filtering
  CheckIcon, // New icon for selected items
  InboxIcon, // New icon for the empty state
} from '@heroicons/react/24/outline';

interface TodosTableProps {
  batch: TodoBatch[];
}

export const TodosTable = ({ batch }: TodosTableProps) => {
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState<
    'type' | 'content' | 'date' | null
  >(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const flattenedTodos = useMemo((): FlattenedTodo[] => {
    return batch.flatMap(batchItem =>
      batchItem.todos.map(todo => ({
        ...todo,
        syncedAt: batchItem.syncedAt,
        projectName: batchItem.projectName,
        userId: batchItem.userId,
        syncId: batchItem.syncId,
      }))
    );
  }, [batch]);

  const uniqueTypes = useMemo(
    () => [...new Set(flattenedTodos.map(todo => todo.type))],
    [flattenedTodos]
  );

  const uniqueDates = useMemo(
    () =>
      [...new Set(flattenedTodos.map(todo => todo.syncedAt))].sort().reverse(),
    [flattenedTodos]
  );

  const showDateFilter = uniqueDates.length > 1;

  const handleSort = (field: 'type' | 'content' | 'date') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: 'type' | 'content' | 'date') => {
    if (sortField !== field) {
      return <ChevronUpDownIcon className="h-4 w-4" aria-hidden="true" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
    ) : (
      <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
    );
  };

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = flattenedTodos.filter(todo => {
      const matchesType = !typeFilter || todo.type === typeFilter;
      return matchesType;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case 'type':
            aValue = a.type;
            bValue = b.type;
            break;
          case 'content':
            aValue = a.content.toLowerCase();
            bValue = b.content.toLowerCase();
            break;
          case 'date':
            aValue = new Date(a.syncedAt).getTime();
            bValue = new Date(b.syncedAt).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [flattenedTodos, typeFilter, sortField, sortDirection]);

  // A helper component for dropdown items to keep the main return clean
  const DropdownItem = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => {
    const isActive = typeFilter === value;
    return (
      <div
        className={`flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 text-sm transition-colors hover:bg-[var(--color-fg)]/5 ${
          isActive
            ? 'font-medium text-[var(--color-primary)]'
            : 'text-[var(--color-fg)]/90'
        }`}
        onClick={() => {
          setTypeFilter(value);
          setShowTypeDropdown(false);
        }}
      >
        <span>{label}</span>
        {isActive && <CheckIcon className="h-4 w-4" />}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full min-w-[600px] table-fixed border-collapse">
        <thead className="sticky top-0 z-10 bg-[var(--color-bg)] text-xs text-[var(--color-fg)]/60">
          <tr className="border-b">
            <th className="w-48 px-6 py-4 text-left font-medium">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {/* Filter button now includes an icon and better styling */}
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-[var(--color-fg)]/5"
                    title="Filter by Type"
                    type="button"
                  >
                    <FunnelIcon className="h-4 w-4" />
                    <span>{typeFilter === '' ? 'Type' : typeFilter}</span>
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute z-10 mt-2 w-48 origin-top-left rounded-md border bg-[var(--color-bg)] p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <DropdownItem label="All Types" value="" />
                      {uniqueTypes.map(type => (
                        <DropdownItem key={type} label={type} value={type} />
                      ))}
                    </div>
                  )}
                </div>
                {/* Sort button now has a more subtle, modern feel */}
                <button
                  onClick={() => handleSort('type')}
                  className="rounded-md p-2 transition-colors hover:bg-[var(--color-fg)]/5"
                  title="Sort by Type"
                >
                  {getSortIcon('type')}
                </button>
              </div>
            </th>
            <th className="px-6 py-4 text-left font-medium">
              <button
                onClick={() => handleSort('content')}
                className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-[var(--color-fg)]/5"
                title="Sort by Content"
                type="button"
              >
                <span>Content</span>
                {getSortIcon('content')}
              </button>
            </th>
            {showDateFilter && (
              <th className="w-48 px-6 py-4 text-left font-medium">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-[var(--color-fg)]/5"
                  title="Sort by Date"
                >
                  <span>Date</span>
                  {getSortIcon('date')}
                </button>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-sm">
          {filteredAndSortedTodos.map(todo => (
            <TodosTableRow
              key={todo.id}
              todo={todo}
              showDateFilter={showDateFilter}
            />
          ))}
        </tbody>
      </table>

      {filteredAndSortedTodos.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-sm text-[var(--color-fg)]/50">
          <InboxIcon className="h-12 w-12" />
          <span>No todos match the current filters</span>
        </div>
      )}
    </div>
  );
};