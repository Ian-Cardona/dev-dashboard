import TodosHistoryTableHeader from './TodosHistoryTableHeader';
import TodosHistoryTableRow from './TodosHistoryTableRow';
import type { TodoHistory } from '@dev-dashboard/shared';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

interface TodosHistoryTableProps {
  data: TodoHistory[];
}

const TodosHistoryTable = ({ data }: TodosHistoryTableProps) => {
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState<
    'type' | 'content' | 'resolvedAt' | null
  >(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const uniqueTypes = useMemo(
    () => [...new Set(data.map(todo => todo.type))],
    [data]
  );

  const handleSort = (field: string) => {
    if (field === 'type' || field === 'content' || field === 'resolvedAt') {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field as any);
        setSortDirection('asc');
      }
    }
  };

  const getSortIcon = (key: string): React.ReactNode => {
    if (key !== 'type' && key !== 'content' && key !== 'resolvedAt') {
      return null;
    }
    const field = key as 'type' | 'content' | 'resolvedAt';
    if (sortField !== field) {
      return (
        <ChevronUpDownIcon
          className="inline-block h-4 w-4"
          aria-hidden="true"
        />
      );
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="inline-block h-4 w-4" aria-hidden="true" />
    ) : (
      <ChevronDownIcon className="inline-block h-4 w-4" aria-hidden="true" />
    );
  };

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = data.filter(todo => {
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
          case 'resolvedAt':
            aValue = a.resolvedAt ? new Date(a.resolvedAt).getTime() : 0;
            bValue = b.resolvedAt ? new Date(b.resolvedAt).getTime() : 0;
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
  }, [data, typeFilter, sortField, sortDirection]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full table-auto">
          <TodosHistoryTableHeader
            getSortIcon={getSortIcon}
            handleSort={handleSort}
            setTypeFilter={setTypeFilter}
            typeFilter={typeFilter}
            uniqueTypes={uniqueTypes}
          />
          <tbody>
            {filteredAndSortedTodos.map(todo => (
              <TodosHistoryTableRow key={todo.id} todo={todo} />
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
