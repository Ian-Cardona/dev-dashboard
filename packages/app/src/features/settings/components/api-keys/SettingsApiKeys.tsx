import { useMutateCreateKey } from '../../hooks/useMutateCreateKey';
import { useQueryFetchKeys } from '../../hooks/useQueryFetchKeys';
import NewApiKeyModal from './NewApiKeyModal';
import SettingsApiKeysItem from './SettingsApiKeysItem';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

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
      <div className="flex h-full flex-col">
        <div className="mb-8 flex items-center justify-between px-8">
          <h2 className="flex items-center text-3xl">API Keys</h2>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] px-3 py-1 text-sm font-normal transition-colors hover:bg-[var(--color-border)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Create a new API Key"
            onClick={handleCreateKey}
            disabled={createKey.isPending}
          >
            <PlusIcon className="mr-1 h-5 w-5" />
            {createKey.isPending ? 'Creating...' : 'New Key'}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto rounded-b-4xl px-8 pb-8">
          <p className="mb-6 max-w-2xl text-sm">
            These keys allow your VSCode extension to connect securely to your
            account. Treat them like passwords and do not share them.
          </p>
          <div className="min-h-[160px] overflow-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm">
                Loading keys...
              </div>
            ) : keys && keys.length > 0 ? (
              <ul className="space-y-3">
                {keys.map((key: any) => (
                  <SettingsApiKeysItem
                    key={key.id}
                    description={key.description}
                    createdAt={key.createdAt}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center text-sm">
                No API keys have been created yet.
              </div>
            )}
          </div>
        </div>
      </div>
      <NewApiKeyModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SettingsApiKeys;
