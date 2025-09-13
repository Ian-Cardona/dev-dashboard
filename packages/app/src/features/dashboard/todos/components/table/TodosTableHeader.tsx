import { useState, type ReactNode } from 'react';

interface TodosTableHeaderProps {
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  uniqueTypes: string[];
  showDateFilter: boolean;
  handleSort: (key: string) => void;
  getSortIcon: (key: string) => ReactNode;
}

export const TodosTableHeader = ({
  typeFilter,
  setTypeFilter,
  uniqueTypes,
  showDateFilter,
  handleSort,
  getSortIcon,
}: TodosTableHeaderProps) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  return (
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
  );
};
