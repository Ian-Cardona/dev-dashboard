type SettingsApiKeysItemProps = {
  description?: string;
  createdAt: string;
};

const SettingsApiKeysItem = ({
  description,
  createdAt,
}: SettingsApiKeysItemProps) => {
  return (
    <li className="group flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5">
      <div className="flex flex-1 flex-col">
        <span className="font-sans text-base font-medium text-[var(--color-fg)]">
          {description || 'Untitled Key'}
        </span>
        <span className="mt-1 text-sm text-[var(--color-fg-muted)]">
          Created{' '}
          {new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
      <button
        type="button"
        className="ml-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-fg)] transition-all group-hover:opacity-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
      >
        Edit
      </button>
    </li>
  );
};

export default SettingsApiKeysItem;
