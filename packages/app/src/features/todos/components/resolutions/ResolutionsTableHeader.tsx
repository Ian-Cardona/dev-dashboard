import IconSelector from '../common/IconSelector';
import { useState } from 'react';

interface ResolutionsTableHeaderProps {
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  uniqueTypes: string[];
  handleSort: (key: string) => void;
  getSortIcon: (key: string) => React.ReactNode;
  isEditMode: boolean;
}

const ResolutionsTableHeader = ({
  typeFilter,
  setTypeFilter,
  uniqueTypes,
  handleSort,
  getSortIcon,
  isEditMode,
}: ResolutionsTableHeaderProps) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  return (
    <thead className="sticky top-0 z-2 border-b border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <tr className="border-b border-[var(--color-accent)]/20">
        <th
          className="w-36 px-6 py-3 text-left text-base font-semibold whitespace-nowrap text-[var(--color-fg)]"
          onMouseEnter={() => setShowTypeDropdown(true)}
          onMouseLeave={() => setShowTypeDropdown(false)}
        >
          <div className="relative">
            <button
              onClick={() => handleSort('type')}
              className="flex cursor-pointer items-center gap-2 text-[var(--color-fg)] transition-colors duration-200 select-none hover:text-[var(--color-primary)]"
              title="Sort by Type"
              type="button"
            >
              <span title="Filter by Type">
                {typeFilter === '' ? 'Type' : typeFilter}
              </span>
              {getSortIcon('type')}
            </button>

            {showTypeDropdown && (
              <div className="absolute z-10 mt-1 w-40 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] shadow-lg">
                <div
                  className="cursor-pointer rounded-lg px-4 py-3 text-base transition-all duration-200 hover:bg-[var(--color-bg)]"
                  onClick={() => {
                    setTypeFilter('');
                    setShowTypeDropdown(false);
                  }}
                >
                  <div className="flex items-center gap-2 text-[var(--color-fg)]">
                    <IconSelector type="OTHER" />
                    All
                  </div>
                </div>
                {uniqueTypes.map(type => {
                  return (
                    <div
                      key={type}
                      className="cursor-pointer rounded-lg px-4 py-3 text-base transition-all duration-200 hover:bg-[var(--color-bg)]"
                      onClick={() => {
                        setTypeFilter(type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-2 text-[var(--color-fg)]">
                        <IconSelector type={type} />
                        {type}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </th>
        <th className="px-6 py-3 text-left text-base font-semibold whitespace-nowrap text-[var(--color-fg)]">
          <button
            onClick={() => handleSort('content')}
            className="flex cursor-pointer items-center gap-2 text-[var(--color-fg)] transition-colors duration-200 select-none hover:text-[var(--color-primary)]"
            title="Sort by Content"
            type="button"
          >
            Content
            {getSortIcon('content')}
          </button>
        </th>

        <th className="w-64 px-6 py-3 text-left text-base font-semibold whitespace-nowrap text-[var(--color-fg)]">
          <button
            onClick={() => handleSort('filePath')}
            className="flex cursor-pointer items-center gap-2 text-[var(--color-fg)] transition-colors duration-200 select-none hover:text-[var(--color-primary)]"
            title="Sort by File Path"
            type="button"
          >
            File
            {getSortIcon('filePath')}
          </button>
        </th>

        <th className="w-56 px-6 py-3 text-left text-base font-semibold whitespace-nowrap text-[var(--color-fg)]">
          <button
            onClick={() => handleSort('createdAt')}
            className="flex cursor-pointer items-center gap-2 text-[var(--color-fg)] transition-colors duration-200 select-none hover:text-[var(--color-primary)]"
            title="Sort by Created At"
            type="button"
          >
            Created At
            {getSortIcon('createdAt')}
          </button>
        </th>
        {isEditMode && (
          <th className="w-72 px-6 py-3 text-left text-base font-semibold whitespace-nowrap text-[var(--color-fg)]">
            Reason
          </th>
        )}
      </tr>
    </thead>
  );
};

export default ResolutionsTableHeader;
