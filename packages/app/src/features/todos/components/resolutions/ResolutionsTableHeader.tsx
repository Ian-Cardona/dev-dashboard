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
    <thead className="sticky top-0 z-2 border-b bg-[var(--color-surface)]">
      <tr className="border-b">
        <th
          className="w-36 px-6 py-2 text-left text-base whitespace-nowrap"
          onMouseEnter={() => setShowTypeDropdown(true)}
          onMouseLeave={() => setShowTypeDropdown(false)}
        >
          <div className="relative">
            <button
              onClick={() => handleSort('type')}
              className="flex cursor-pointer items-center gap-2 select-none"
              title="Sort by Type"
              type="button"
            >
              <span title="Filter by Type">
                {typeFilter === '' ? 'Type' : typeFilter}
              </span>
              {getSortIcon('type')}
            </button>

            {showTypeDropdown && (
              <div className="absolute z-10 mt-1 w-40 rounded-2xl border bg-[var(--color-surface)] shadow-md">
                <div
                  className="cursor-pointer rounded-md px-6 py-2 text-base uppercase hover:bg-[var(--color-fg)]/5"
                  onClick={() => {
                    setTypeFilter('');
                    setShowTypeDropdown(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <IconSelector type="OTHER" />
                    All
                  </div>
                </div>
                {uniqueTypes.map(type => {
                  return (
                    <div
                      key={type}
                      className="cursor-pointer rounded-md px-6 py-2 text-base uppercase hover:bg-[var(--color-fg)]/5"
                      onClick={() => {
                        setTypeFilter(type);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
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
        <th className="px-6 py-3 text-left text-base whitespace-nowrap">
          <button
            onClick={() => handleSort('content')}
            className="flex cursor-pointer items-center gap-2 select-none"
            title="Sort by Content"
            type="button"
          >
            Content
            {getSortIcon('content')}
          </button>
        </th>

        <th className="w-56 px-6 py-3 text-left text-base whitespace-nowrap">
          <button
            onClick={() => handleSort('createdAt')}
            className="flex cursor-pointer items-center gap-2 select-none"
            title="Sort by Created At"
            type="button"
          >
            Created At
            {getSortIcon('createdAt')}
          </button>
        </th>
        {isEditMode && (
          <th className="w-72 px-6 py-3 text-left text-base whitespace-nowrap">
            Reason
          </th>
        )}
      </tr>
    </thead>
  );
};

export default ResolutionsTableHeader;
