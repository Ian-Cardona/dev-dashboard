import ConfirmModal from '../../../../components/ui/ConfirmModal';
import { useMutateCreateKey } from '../../hooks/useMutateCreateKey';
import { useQueryFetchKeys } from '../../hooks/useQueryFetchKeys';
import SettingsApiKeysItem from './SettingsApiKeysItem';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const SettingsApiKeys = () => {
  const { data: keys, isLoading } = useQueryFetchKeys();
  const createKey = useMutateCreateKey();
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  const isCreating = createKey.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      setShowConfirm(true);
    }
  };

  const handleConfirmCreate = () => {
    setShowConfirm(false);

    setTimeout(() => {
      createKey.mutate(
        { description: description.trim() },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['api-keys', 'list'] });
            setDescription('');
            setShowForm(false);
          },
          onError: error => {
            console.error('Failed to create API key:', error);
          },
        }
      );
    }, 2000);
  };

  const handleCancelCreate = () => {
    setShowConfirm(false);
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-4xl border bg-[var(--color-surface)]">
      <div className="flex h-full flex-col overflow-auto px-8 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center text-3xl">API Keys</h2>
          <button
            type="button"
            className="flex items-center gap-2 rounded-4xl border px-6 py-1 text-base font-medium shadow-md transition-all group-hover:opacity-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Create a new API Key"
            onClick={() => setShowForm(!showForm)}
            disabled={isCreating}
          >
            <PlusIcon className="h-5 w-5" />
            {isCreating ? 'Creating...' : 'New Key'}
          </button>
        </div>
        <p className="mb-4 max-w-2xl text-sm text-[var(--color-accent)]">
          These keys allow your VSCode extension to connect securely to your
          account. Treat them like passwords and do not share them.
        </p>
        {showForm && (
          <div className="relative mb-4 rounded-4xl border border-[var(--color-primary)] bg-[var(--color-surface)] p-6 shadow-md">
            {isCreating && (
              <div className="bg-opacity-80 absolute inset-0 z-10 flex items-center justify-center rounded-4xl bg-[var(--color-surface)]">
                <div className="bg-opacity-20 animate-pulse rounded-md bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-primary)]">
                  Creating API Key...
                </div>
              </div>
            )}
            <h3 className="mb-4 text-xl font-semibold">Create New API Key</h3>
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <fieldset
                disabled={isCreating}
                className="flex w-full items-center gap-4"
              >
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="flex-1 rounded-4xl px-4 py-2 text-base outline hover:shadow-md focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-4xl border px-6 py-2 text-base font-medium shadow-md transition-all group-hover:opacity-100 hover:border-green-600 hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Key'}
                </button>
              </fieldset>
            </form>
          </div>
        )}
        <div className="relative flex-1 rounded-4xl pb-8">
          {isCreating && (
            <div className="bg-opacity-60 absolute inset-0 z-10 flex items-center justify-center rounded-4xl bg-[var(--color-surface)]">
              <div className="bg-opacity-20 animate-pulse rounded-md bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-primary)]">
                Updating list...
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm">
              <div className="bg-opacity-20 animate-pulse rounded-md bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-primary)]">
                Loading keys...
              </div>
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
            <div className="flex h-full items-center justify-center text-sm text-[var(--color-accent)]">
              No API keys have been created yet.
            </div>
          )}
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
