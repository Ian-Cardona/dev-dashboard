import ApiKeysItem from './SettingsApiKeysItem';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useQueryFetchKeys } from '../../hooks/useQueryFetchKeys';
import { useMutateCreateKey } from '../../hooks/useMutateCreateKey';
import NewApiKeyModal from './NewApiKeyModal';

const SettingsApiKeys = () => {
  const { data: keys, isLoading } = useQueryFetchKeys();
  const createKey = useMutateCreateKey();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateKey = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="p-8 border rounded-2xl border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal">API Keys</h2>
          <button
            type="button"
            className="inline-flex items-center justify-center px-3 py-1 border border-[var(--color-border)] rounded-md text-sm font-normal hover:bg-[var(--color-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Create a new API Key"
            onClick={handleCreateKey}
            disabled={createKey.isPending}
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            {createKey.isPending ? 'Creating...' : 'New Key'}
          </button>
        </div>
        <p className="text-sm mb-4 max-w-2xl">
          These keys allow your VSCode extension to connect securely to your
          account. Treat them like passwords and do not share them.
        </p>
        <div className="border border-[var(--color-border)] rounded-lg py-2 min-h-[160px] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-sm">
              Loading keys...
            </div>
          ) : keys && keys.length > 0 ? (
            <ul className="space-y-3">
              {keys.map((key: any) => (
                <ApiKeysItem
                  key={key.id}
                  description={key.description}
                  createdAt={key.createdAt}
                />
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-sm">
              No API keys have been created yet.
            </div>
          )}
        </div>
      </section>
      <NewApiKeyModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SettingsApiKeys;
