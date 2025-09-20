import { PlusIcon } from '@heroicons/react/24/outline';
import { useMutateCreateKey } from '../../api-keys/hooks/useMutateCreateKey';
import { useQueryFetchKeys } from '../../api-keys/hooks/useQueryFetchKeys';

const ApiKeysSettings = () => {
  const { data: keys, isLoading } = useQueryFetchKeys();
  const createKey = useMutateCreateKey();

  const handleCreateKey = () => {
    createKey.mutate();
  };

  return (
    <section className="p-8 border rounded-2xl border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-normal text-[var(--color-fg)]">API Keys</h2>
        <button
          type="button"
          className="inline-flex items-center justify-center px-3 py-1 border border-[var(--color-border)] rounded-md text-[var(--color-fg)] text-sm font-normal hover:bg-[var(--color-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Create a new API Key"
          onClick={handleCreateKey}
          disabled={createKey.isPending}
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          {createKey.isPending ? 'Creating...' : 'New Key'}
        </button>
      </div>
      <p className="text-sm text-[var(--color-fg-muted)] mb-4 max-w-2xl">
        These keys allow your VSCode extension to connect securely to your
        account. Treat them like passwords and do not share them.
      </p>
      <div className="border border-[var(--color-border)] rounded-lg p-4 min-h-[160px] overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-sm text-[var(--color-fg-muted)]">
            Loading keys...
          </div>
        ) : keys && keys.length > 0 ? (
          <ul className="space-y-3">
            {keys.map((key: any) => (
              <li
                key={key.id}
                className="font-mono text-sm text-[var(--color-fg)]"
              >
                <p className="font-sans font-medium">
                  {key.description || 'Untitled Key'}
                </p>
                <p className="text-xs text-[var(--color-fg-muted)]">
                  ID: {key.id}
                </p>
                <p className="text-xs text-[var(--color-fg-muted)]">
                  Created: {new Date(key.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-[var(--color-fg-muted)]">
            No API keys have been created yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default ApiKeysSettings;
