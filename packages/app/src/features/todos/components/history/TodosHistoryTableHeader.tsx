import { type ReactNode, useState } from 'react';
import IconSelector from '../common/IconSelector';

interface TodosHistoryTableHeaderProps {
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  uniqueTypes: string[];
  showDateFilter: boolean;
  handleSort: (key: string) => void;
  getSortIcon: (key: string) => ReactNode;
}

const TodosHistoryTableHeader = ({
  typeFilter,
  setTypeFilter,
  uniqueTypes,
  showDateFilter,
  handleSort,
  getSortIcon,
}: TodosHistoryTableHeaderProps) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  return (
    <thead className="sticky top-0 bg-[var(--color-surface)] z-2">
      <tr className="border-b">
        <th className="w-36 whitespace-nowrap px-6 py-2 text-left text-base">
          <div className="relative">
            <button
              onClick={() => handleSort('type')}
              className="flex cursor-pointer select-none items-center gap-2"
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
              <div className="absolute z-10 mt-2 w-40 rounded-lg border bg-[var(--color-surface)] shadow-md">
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
        <th className="whitespace-nowrap px-6 py-3 text-left text-base">
          <button
            onClick={() => handleSort('content')}
            className="flex cursor-pointer select-none items-center gap-2"
            title="Sort by Content"
            type="button"
          >
            Content
            {getSortIcon('content')}
          </button>
        </th>
        {showDateFilter && (
          <th className="w-56 whitespace-nowrap px-6 py-3 text-left text-base">
            <button
              onClick={() => handleSort('date')}
              className="flex cursor-pointer select-none items-center gap-2"
              title="Sort by Date"
              type="button"
            >
              Created at
              {getSortIcon('date')}
            </button>
          </th>
        )}
      </tr>
    </thead>
  );
};

export default TodosHistoryTableHeader;
