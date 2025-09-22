import type { FlattenedTodo, TodoBatch } from '@dev-dashboard/shared';
import { useMemo, useState } from 'react';
import {
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import TodosHistoryTableHeader from './TodosHistoryTableHeader';
import TodosHistoryTableRow from './TodosHistoryTableRow';

interface TodosHistoryTableProps {
  batch: TodoBatch[];
}

const TodosHistoryTable = ({ batch }: TodosHistoryTableProps) => {
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState<
    'type' | 'content' | 'date' | null
  >(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const flattenedTodos = useMemo((): (FlattenedTodo & {
    _uniqueId: string;
  })[] => {
    return batch.flatMap(batchItem =>
      batchItem.todos.map((todo, todoIndex) => ({
        ...todo,
        syncedAt: batchItem.syncedAt,
        projectName: batchItem.projectName,
        userId: batchItem.userId,
        syncId: batchItem.syncId,
        _uniqueId: `${batchItem.syncId}-${todoIndex}`,
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

  const handleSort = (field: string) => {
    if (field === 'type' || field === 'content' || field === 'date') {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    }
  };

  const getSortIcon = (key: string): React.ReactNode => {
    if (key !== 'type' && key !== 'content' && key !== 'date') {
      return null;
    }
    const field = key as 'type' | 'content' | 'date';
    if (sortField !== field) {
      return (
        <ChevronUpDownIcon
          className="inline-block w-4 h-4"
          aria-hidden="true"
        />
      );
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="inline-block w-4 h-4" aria-hidden="true" />
    ) : (
      <ChevronDownIcon className="inline-block w-4 h-4" aria-hidden="true" />
    );
  };

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = flattenedTodos.filter(todo => {
      const matchesType = !typeFilter || todo.type === typeFilter;
      return matchesType;
    });

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
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
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full table-fixed border-collapse text-sm">
          <TodosHistoryTableHeader
            getSortIcon={getSortIcon}
            handleSort={handleSort}
            setTypeFilter={setTypeFilter}
            showDateFilter={showDateFilter}
            typeFilter={typeFilter}
            uniqueTypes={uniqueTypes}
          />
          <tbody>
            {filteredAndSortedTodos.map((todo, index) => (
              <TodosHistoryTableRow
                key={todo._uniqueId || `${todo.syncId}-${index}`}
                todo={todo}
                showDateFilter={showDateFilter}
              />
            ))}
          </tbody>
        </table>

        {filteredAndSortedTodos.length === 0 && (
          <div className="py-8 text-center text-sm text-[var(--color-fg)]/50">
            No todos match the current filters
          </div>
        )}
      </div>
    </div>
  );
};

export default TodosHistoryTable;
