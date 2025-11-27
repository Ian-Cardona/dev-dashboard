type SettingsApiKeysItemProps = {
  description?: string;
  createdAt: string;
};

const SettingsApiKeysItem = ({
  description,
  createdAt,
}: SettingsApiKeysItemProps) => {
  return (
    <li className="group flex items-center justify-between rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5">
      <div className="flex flex-1 flex-col">
        <span className="font-sans text-base font-medium text-[var(--color-fg)]">
          {description || 'Untitled Key'}
        </span>
        <span className="mt-1 text-sm text-[var(--color-accent)]">
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
        className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-5 py-2 text-sm font-medium text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
      >
        Edit
      </button>
    </li>
  );
};

export default SettingsApiKeysItem;
