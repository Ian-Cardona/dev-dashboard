import IconSelector from '../common/IconSelector';
import { type ReactNode, useState } from 'react';

interface TodosHistoryTableHeaderProps {
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  uniqueTypes: string[];
  handleSort: (key: string) => void;
  getSortIcon: (key: string) => ReactNode;
}

const TodosHistoryTableHeader = ({
  typeFilter,
  setTypeFilter,
  uniqueTypes,
  handleSort,
  getSortIcon,
}: TodosHistoryTableHeaderProps) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  return (
    <thead className="sticky top-0 z-2 bg-[var(--color-surface)]">
      <tr className="border-b">
        <th
          className="w-36 px-6 py-3 text-left text-base whitespace-nowrap"
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
              <span
                onClick={e => {
                  e.stopPropagation();
                  setShowTypeDropdown(!showTypeDropdown);
                }}
                title="Filter by Type"
              >
                {typeFilter === '' ? 'Type' : typeFilter}
              </span>
              {getSortIcon('type')}
            </button>
            {showTypeDropdown && (
              <div className="absolute z-10 mt-2 w-40 rounded-2xl border bg-[var(--color-surface)] shadow-md">
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
        <th className="w-48 px-6 py-3 text-left text-base whitespace-nowrap">
          <button
            onClick={() => handleSort('syncedAt')}
            className="flex cursor-pointer items-center gap-2 select-none"
            title="Sort by Synced At"
            type="button"
          >
            Synced At
            {getSortIcon('syncedAt')}
          </button>
        </th>
        <th className="w-48 px-6 py-3 text-left text-base whitespace-nowrap">
          <button
            onClick={() => handleSort('resolvedAt')}
            className="flex cursor-pointer items-center gap-2 select-none"
            title="Sort by Resolved At"
            type="button"
          >
            Resolved At
            {getSortIcon('resolvedAt')}
          </button>
        </th>
      </tr>
    </thead>
  );
};

export default TodosHistoryTableHeader;
