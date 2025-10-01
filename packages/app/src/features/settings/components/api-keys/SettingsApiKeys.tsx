import ConfirmModal from '../../../../components/ui/ConfirmModal';
import { useMutateCreateKey } from '../../hooks/useMutateCreateKey';
import { useQueryFetchKeys } from '../../hooks/useQueryFetchKeys';
import SettingsApiKeysItem from './SettingsApiKeysItem';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const SettingsApiKeys = () => {
  const { data: keys, isLoading } = useQueryFetchKeys();
  const createKey = useMutateCreateKey();
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      setShowConfirm(true);
    }
  };

  const handleConfirmCreate = () => {
    createKey.mutate({ description });
    setDescription('');
    setShowConfirm(false);
    setShowForm(false);
  };

  const handleCancelCreate = () => {
    setShowConfirm(false);
  };

  return (
    <section className="flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="flex h-full flex-col">
        <div className="mb-8 flex items-center justify-between px-8">
          <h2 className="flex items-center text-3xl">API Keys</h2>
          <button
            type="button"
            className="flex items-center gap-2 rounded-4xl border px-6 text-base font-medium shadow-md hover:bg-[var(--color-fg)]/[0.03]"
            aria-label="Create a new API Key"
            onClick={() => setShowForm(!showForm)}
            disabled={createKey.isPending}
          >
            <PlusIcon className="h-5 w-5" />
            {createKey.isPending ? 'Creating...' : 'New Key'}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto rounded-b-4xl px-8 pb-8">
          {showForm && (
            <div className="mb-8 rounded-4xl border border-[var(--color-primary)] bg-[var(--color-surface)] p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Create New API Key</h3>
              <form onSubmit={handleSubmit} className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="flex-1 rounded-4xl border px-4 py-2 text-base shadow-md focus:ring-2 focus:ring-[var(--color-fg)] focus:outline-none"
                  disabled={createKey.isPending}
                  required
                />
                <button
                  type="submit"
                  className="rounded-4xl border px-6 py-2 text-base font-medium shadow-md hover:bg-[var(--color-fg)]/[0.03]"
                  disabled={createKey.isPending}
                >
                  {createKey.isPending ? 'Creating...' : 'Create Key'}
                </button>
              </form>
            </div>
          )}
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
      {showConfirm && (
        <ConfirmModal
          title="Confirm Create API Key"
          message={`Are you sure you want to create a new API key with the description "${description}"?`}
          onConfirm={handleConfirmCreate}
          onCancel={handleCancelCreate}
        />
      )}
    </section>
  );
};

export default SettingsApiKeys;
