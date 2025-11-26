import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface TodosAnalyticsCardHeader {
  title: string;
  tooltip?: string;
}

const TodosAnalyticsCardHeader = ({
  title,
  tooltip,
}: TodosAnalyticsCardHeader) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-semibold text-[var(--color-fg)]">{title}</h3>
      {tooltip && (
        <div className="relative flex items-center">
          <InformationCircleIcon
            className="h-4 w-4 cursor-pointer text-[var(--color-accent)] transition-colors duration-200 hover:text-[var(--color-primary)]"
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
          />
          {isTooltipVisible && (
            <div className="absolute top-full left-1/2 z-10 mt-2 w-72 -translate-x-1/2 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-4">
              <p className="text-left text-sm font-normal text-[var(--color-fg)]">
                {tooltip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodosAnalyticsCardHeader;
