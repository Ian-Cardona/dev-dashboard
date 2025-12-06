import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AccountHeaderProps {
  isEditMode: boolean;
  onEditClick: () => void;
  onCancel: () => void;
}
export const AccountHeader = ({
  isEditMode,
  onEditClick,
  onCancel,
}: AccountHeaderProps) => {
  return (
    <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
      <h2 className="flex items-center gap-3 text-2xl font-bold text-[var(--color-fg)]">
        Account
      </h2>
      <button
        onClick={isEditMode ? onCancel : onEditClick}
        className="flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-5 py-3 text-base font-semibold transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
      >
        {isEditMode ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <PencilSquareIcon className="h-5 w-5" />
        )}
        {isEditMode ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
};
