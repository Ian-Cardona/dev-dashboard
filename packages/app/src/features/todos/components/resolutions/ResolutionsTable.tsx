import { useMemo, useState } from 'react';
import useQueryPendingResolutions from '../../hooks/useQueryPendingResolutions';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import ResolutionsTableRow from './ResolutionsTableRow';
import ResolutionsTableHeader from './ResolutionsTableHeader';

interface ResolutionsTableProps {
  isEditMode?: boolean;
}

const ResolutionsTable = ({ isEditMode = false }: ResolutionsTableProps) => {
  const {
    data: resolutions,
    isLoading,
    isError,
  } = useQueryPendingResolutions();
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState<
    'type' | 'content' | 'createdAt' | null
  >(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [selectedReasons, setSelectedReasons] = useState<
    Record<string, string>
  >({});

  const handleReasonChange = (id: string, value: string) => {
    setSelectedReasons(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const uniqueTypes = useMemo(
    () => [...new Set(resolutions?.map(resolution => resolution.type) || [])],
    [resolutions]
  );

  const handleSort = (field: string) => {
    if (field === 'type' || field === 'content' || field === 'createdAt') {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    }
  };

  const getSortIcon = (key: string): React.ReactNode => {
    if (key !== 'type' && key !== 'content' && key !== 'createdAt') {
      return null;
    }
    const field = key as 'type' | 'content' | 'createdAt';
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

  const filteredAndSortedResolutions = useMemo(() => {
    if (!resolutions) return [];

    let filtered = resolutions.filter(resolution => {
      const matchesType = !typeFilter || resolution.type === typeFilter;
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
          case 'createdAt':
            aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
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
  }, [resolutions, typeFilter, sortField, sortDirection]);

  if (isLoading) {
    return <div className="px-8">Loading pending resolutions...</div>;
  }

  if (isError) {
    return (
      <div className="px-8 text-[var(--color-primary)]">
        Error loading pending resolutions.
      </div>
    );
  }

  if (!resolutions || resolutions.length === 0) {
    return <div className="px-8">No pending resolutions found.</div>;
  }

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full table-fixed border-collapse">
          <ResolutionsTableHeader
            getSortIcon={getSortIcon}
            handleSort={handleSort}
            setTypeFilter={setTypeFilter}
            typeFilter={typeFilter}
            uniqueTypes={uniqueTypes}
            isEditMode={isEditMode}
          />
          <tbody>
            {filteredAndSortedResolutions.map((resolution, index) => (
              <ResolutionsTableRow
                key={
                  resolution.id ||
                  `${resolution.type}-${resolution.createdAt}-${index}`
                }
                resolution={resolution}
                isEditMode={isEditMode}
                selectedReason={selectedReasons[resolution.id] || ''}
                onReasonChange={value =>
                  handleReasonChange(resolution.id, value)
                }
              />
            ))}
          </tbody>
        </table>

        {filteredAndSortedResolutions.length === 0 && (
          <div className="py-8 text-center text-sm text-[var(--color-fg)]/50">
            No resolutions match the current filters
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolutionsTable;
