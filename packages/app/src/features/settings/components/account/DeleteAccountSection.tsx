interface DeleteAccountSectionProps {
  onDeleteClick: () => void;
}

export const DeleteAccountSection = ({
  onDeleteClick,
}: DeleteAccountSectionProps) => {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-6 dark:border-red-700 dark:bg-red-950/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
            Delete Account
          </div>
          <div className="mb-4 text-sm text-red-600 dark:text-red-400/80">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </div>
          <button
            onClick={onDeleteClick}
            className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-5 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white dark:border-red-700 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-800"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
