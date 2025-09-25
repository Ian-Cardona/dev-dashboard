import IconSelector from '../common/IconSelector';
import type { TodoResolution } from '@dev-dashboard/shared';
import { TodoReasonEnum } from '@dev-dashboard/shared';

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
    <tr className="border-b border-[var(--color-fg)]/10 hover:border-b-2 hover:border-[var(--color-primary)] hover:bg-[var(--color-fg)]/[0.03]">
      <td className="px-6 py-3 align-middle text-base normal-case">
        <div className="flex items-center gap-2">
          <IconSelector type={resolution.type} />
          <span>{resolution.type}</span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-3 align-middle text-base font-bold normal-case">
        {resolution.content}
      </td>
      <td className="px-6 py-3 align-middle text-base normal-case">
        {resolution.createdAt
          ? new Date(resolution.createdAt).toLocaleString()
          : 'N/A'}
      </td>
      {isEditMode && (
        <td className="w-72 px-6 py-3 text-left align-middle text-base whitespace-nowrap normal-case">
          <select
            value={selectedReason}
            onChange={e => onReasonChange(e.target.value)}
            className="w-full truncate rounded border border-[var(--color-fg)] px-4 text-base"
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
