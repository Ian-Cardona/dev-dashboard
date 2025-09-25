type SettingsApiKeysItemProps = {
  description?: string;
  createdAt: string;
};

const SettingsApiKeysItem = ({
  description,
  createdAt,
}: SettingsApiKeysItemProps) => {
  return (
    <li className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
      <div className="flex flex-col">
        <span className="font-sans text-base text-[var(--color-fg)]">
          {description || 'Untitled Key'}
        </span>
        <span className="text-xs text-[var(--color-fg-muted)]">
          Created {new Date(createdAt).toLocaleString()}
        </span>
      </div>
      <button
        type="button"
        className="ml-4 rounded border border-[var(--color-border)] px-2 py-1 text-sm font-normal text-[var(--color-fg)]"
      >
        Edit
      </button>
    </li>
  );
};

export default SettingsApiKeysItem;
