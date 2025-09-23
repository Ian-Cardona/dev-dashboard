import type { TodoResolution } from '@dev-dashboard/shared';
import { TodoReasonEnum } from '@dev-dashboard/shared';
import IconSelector from '../common/IconSelector';

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
  return (
    <tr className="border-b border-[var(--color-fg)]/10 hover:bg-[var(--color-fg)]/[0.03]">
      <td className="px-6 py-2 align-middle text-base normal-case">
        <div className="flex items-center gap-2">
          <IconSelector type={resolution.type} />
          <span>{resolution.type}</span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-2 align-middle text-base normal-case">
        {resolution.content}
      </td>
      {!isEditMode && (
        <td className="px-6 py-2 align-middle text-base normal-case">
          {resolution.createdAt
            ? new Date(resolution.createdAt).toLocaleString()
            : 'N/A'}
        </td>
      )}
      {isEditMode && (
        <td className="px-6 py-2 align-middle text-base normal-case">
          <select
            value={selectedReason}
            onChange={e => onReasonChange(e.target.value)}
            className="w-full border border-[var(--color-fg)] rounded px-4 py-1 text-base truncate"
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
