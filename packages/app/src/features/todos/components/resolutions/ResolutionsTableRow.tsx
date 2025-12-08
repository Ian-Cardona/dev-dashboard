import IconSelector from '../common/IconSelector';
import type { TodoResolution } from '@dev-dashboard/shared';
import { TodoReasonEnum } from '@dev-dashboard/shared';
import { useState } from 'react';

interface ResolutionsTableRowProps {
  resolution: TodoResolution;
  isEditMode: boolean;
  selectedReason: string;
  onReasonChange: (value: string) => void;
}

const ResolutionsTableRow = ({
  resolution,
  isEditMode,
  selectedReason,
  onReasonChange,
}: ResolutionsTableRowProps) => {
  const [showFilePathTooltip, setShowFilePathTooltip] = useState(false);
  const fileName = resolution.filePath.split('/').pop() || resolution.filePath;

  return (
    <tr className="border-b border-[var(--color-accent)]/20 transition-all duration-200 hover:bg-[var(--color-bg)]">
      <td className="px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        <div className="flex items-center gap-2">
          <IconSelector type={resolution.type} />
          <span>{resolution.type}</span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-4 align-middle text-base font-semibold text-[var(--color-fg)] normal-case">
        {resolution.content}
      </td>
      <td className="px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        <div className="relative">
          <div
            className="cursor-help truncate font-medium"
            onMouseEnter={() => setShowFilePathTooltip(true)}
            onMouseLeave={() => setShowFilePathTooltip(false)}
          >
            {fileName}
          </div>
          <div className="text-sm text-[var(--color-accent)]">
            Line {resolution.lineNumber}
          </div>

          {showFilePathTooltip && (
            <div className="absolute top-full left-0 z-10 mt-1 max-w-md rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-3 shadow-lg">
              <div className="text-sm font-medium text-[var(--color-fg)]">
                {resolution.filePath}
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 align-middle text-base text-[var(--color-fg)] normal-case">
        {resolution.createdAt
          ? new Date(resolution.createdAt).toLocaleString()
          : 'N/A'}
      </td>
      {isEditMode && (
        <td className="w-72 px-6 py-4 text-left align-middle text-base whitespace-nowrap normal-case">
          <select
            value={selectedReason}
            onChange={e => onReasonChange(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)]/40 focus:border-[var(--color-primary)] focus:outline-none"
          >
            <option value="">Select reason</option>
            {TodoReasonEnum.options.map((option: string) => (
              <option key={option} value={option} title={option}>
                {option
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </option>
            ))}
          </select>
        </td>
      )}
    </tr>
  );
};

export default ResolutionsTableRow;
