import ResolutionsTableHeader from './ResolutionsTableHeader';
import ResolutionsTableRow from './ResolutionsTableRow';
import type { TodoResolution } from '@dev-dashboard/shared';
import { useEffect } from 'react';

interface ResolutionsTableProps {
  isEditMode?: boolean;
  resolutions: TodoResolution[];
  getSortIcon: (key: string) => React.ReactNode;
  handleSort: (field: string) => void;
  setTypeFilter: (filter: string) => void;
  typeFilter: string;
  uniqueTypes: string[];
  selectedReasons: Record<string, string>;
  onReasonChange: (id: string, value: string) => void;
}

const ResolutionsTable = ({
  isEditMode = false,
  resolutions,
  getSortIcon,
  handleSort,
  setTypeFilter,
  typeFilter,
  uniqueTypes,
  selectedReasons,
  onReasonChange,
}: ResolutionsTableProps) => {
  useEffect(() => {
    if (typeFilter && resolutions.length === 0) {
      setTypeFilter('');
    }
  }, [resolutions, typeFilter, setTypeFilter]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="relative min-h-0 flex-1 overflow-auto">
        <table className="w-full table-fixed border-collapse">
          <ResolutionsTableHeader
            getSortIcon={getSortIcon}
            handleSort={handleSort}
            setTypeFilter={setTypeFilter}
            typeFilter={typeFilter}
            uniqueTypes={uniqueTypes}
            isEditMode={isEditMode}
          />
          <tbody className="relative">
            {resolutions.map((resolution, index) => (
              <ResolutionsTableRow
                key={
                  resolution.id ||
                  `${resolution.type}-${resolution.createdAt}-${index}`
                }
                resolution={resolution}
                isEditMode={isEditMode}
                selectedReason={selectedReasons[resolution.id] || ''}
                onReasonChange={value => onReasonChange(resolution.id, value)}
              />
            ))}
          </tbody>
        </table>

        {resolutions.length === 0 && (
          <div className="py-8 text-center text-sm text-[var(--color-accent)]">
            No resolutions match the current filters
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolutionsTable;
