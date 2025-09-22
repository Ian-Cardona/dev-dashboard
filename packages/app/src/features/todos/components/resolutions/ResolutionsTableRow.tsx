import type { TodoResolution } from '@dev-dashboard/shared';
import IconSelector from '../common/IconSelector';

interface ResolutionsTableRowProps {
  resolution: TodoResolution;
}

const ResolutionsTableRow = ({ resolution }: ResolutionsTableRowProps) => {
  return (
    <tr className="border-b border-[var(--color-fg)]/10 hover:bg-[var(--color-fg)]/[0.03]">
      <td className="px-6 py-2 align-middle text-sm normal-case">
        <div className="flex items-center gap-2">
          <IconSelector type={resolution.type} />
          <span>{resolution.type}</span>
        </div>
      </td>
      <td className="max-w-xs px-6 py-2 align-middle text-base normal-case">
        {resolution.content}
      </td>
      <td className="px-6 py-2 align-middle text-sm normal-case">
        {resolution.createdAt
          ? new Date(resolution.createdAt).toLocaleString()
          : 'N/A'}
      </td>
    </tr>
  );
};

export default ResolutionsTableRow;
