import type { FlattenedTodo, TodoBatch } from '@dev-dashboard/shared';
import { useMemo, useState } from 'react';
import { TodosTableRow } from './TodosTableRow';

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
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
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

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="sticky">
          <tr className="border-b">
            <th className="w-36 whitespace-nowrap px-4 py-4 text-left font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="cursor-pointer select-none"
                    title="Filter by Type"
                    type="button"
                  >
                    {typeFilter === '' ? 'Type' : typeFilter}
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute z-10 mt-2 w-32 rounded-lg border bg-[var(--color-bg)] shadow-md">
                      <div
                        className={`cursor-pointer rounded-md px-4 py-2 hover:bg-[var(--color-fg)]/5 ${
                          typeFilter === '' ? 'font-semibold' : ''
                        }`}
                        onClick={() => {
                          setTypeFilter('');
                          setShowTypeDropdown(false);
                        }}
                      >
                        All
                      </div>
                      {uniqueTypes.map(type => (
                        <div
                          key={type}
                          className={`cursor-pointer rounded-md p-4 hover:bg-[var(--color-fg)]/5 ${
                            typeFilter === type ? 'font-semibold' : ''
                          }`}
                          onClick={() => {
                            setTypeFilter(type);
                            setShowTypeDropdown(false);
                          }}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSort('type')}
                  className="cursor-pointer select-none"
                  title="Sort by Type"
                >
                  {getSortIcon('type')}
                </button>
              </div>
            </th>
            <th className="whitespace-nowrap px-4 py-4 text-left font-semibold uppercase tracking-wider">
              <button
                onClick={() => handleSort('content')}
                className="flex cursor-pointer select-none items-center gap-2"
                title="Sort by Content"
                type="button"
              >
                Content {getSortIcon('content')}
              </button>
            </th>

            {showDateFilter && (
              <th className="w-48 whitespace-nowrap px-4 py-4 text-left font-semibold uppercase tracking-wider">
                <button
                  onClick={() => handleSort('date')}
                  className="flex cursor-pointer select-none items-center gap-2"
                  title="Sort by Date"
                >
                  Date {getSortIcon('date')}
                </button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedTodos.map(todo => (
            <TodosTableRow todo={todo} showDateFilter={showDateFilter} />
          ))}
        </tbody>
      </table>

      {filteredAndSortedTodos.length === 0 && (
        <div className="py-8 text-center text-sm text-[var(--color-fg)]/50">
          No todos match the current filters
        </div>
      )}
    </div>
  );
};
