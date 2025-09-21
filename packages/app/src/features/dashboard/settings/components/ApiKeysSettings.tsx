import ApiKeysItem from './ApiKeysItem';
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
    <>
      <section className="p-8 border rounded-2xl border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal text-gray-900">API Keys</h2>
          <button
            type="button"
            className="inline-flex items-center justify-center px-3 py-1 border border-[var(--color-border)] rounded-md text-gray-900 text-sm font-normal hover:bg-[var(--color-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Create a new API Key"
            onClick={handleCreateKey}
            disabled={createKey.isPending}
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            {createKey.isPending ? 'Creating...' : 'New Key'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4 max-w-2xl">
          These keys allow your VSCode extension to connect securely to your
          account. Treat them like passwords and do not share them.
        </p>
        <div className="border border-[var(--color-border)] rounded-lg py-2 min-h-[160px] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              Loading keys...
            </div>
          ) : keys && keys.length > 0 ? (
            <ul className="space-y-3">
              {keys.map((key: any) => (
                <ApiKeysItem
                  key={key.id}
                  id={key.id}
                  description={key.description}
                  createdAt={key.createdAt}
                />
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No API keys have been created yet.
            </div>
          )}
        </div>
      </section>
      <section className="p-8 border rounded-2xl border-[var(--color-border)] mt-8">
        <h2 className="text-xl font-normal text-gray-900 mb-4">Account Info</h2>
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Email: user@example.com</div>
          <div className="text-sm text-gray-500">User ID: 12345</div>
        </div>
      </section>
      <section className="p-8 border rounded-2xl border-[var(--color-border)] mt-8">
        <h2 className="text-xl font-normal text-red-600 mb-4">Danger Zone</h2>
        <button
          type="button"
          className="px-3 py-1 border border-red-600 rounded-md text-red-600 text-sm font-normal hover:bg-red-600 hover:text-white transition-colors"
        >
          Delete Account
        </button>
      </section>
    </>
  );
};

export default ApiKeysSettings;
