import React from 'react';

type ApiKeysItemProps = {
  id: string;
  description?: string;
  createdAt: string;
};

const ApiKeysItem: React.FC<ApiKeysItemProps> = ({
  id,
  description,
  createdAt,
}) => {
  return (
    <li className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
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
        className="ml-4 text-sm border border-[var(--color-border)] px-2 py-1 rounded font-normal text-[var(--color-fg)]"
      >
        Edit
      </button>
    </li>
  );
};

export default ApiKeysItem;
