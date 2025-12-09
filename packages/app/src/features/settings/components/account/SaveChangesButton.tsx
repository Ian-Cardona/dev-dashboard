import { CheckIcon } from '@heroicons/react/24/outline';

interface SaveChangesButtonProps {
  hasChanges: boolean;
  isPending: boolean;
  onSave: () => void;
}

export const SaveChangesButton = ({
  hasChanges,
  isPending,
  onSave,
}: SaveChangesButtonProps) => {
  return (
    <div className="mt-6 flex justify-end">
      <button
        onClick={onSave}
        disabled={!hasChanges || isPending}
        className={`relative flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-4 py-2 text-sm transition-all duration-200 ${
          !hasChanges || isPending
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'
        }`}
      >
        <CheckIcon className="h-5 w-5" />
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};
