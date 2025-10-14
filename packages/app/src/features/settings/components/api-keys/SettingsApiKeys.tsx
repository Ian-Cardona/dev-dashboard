import ConfirmModal from '../../../../components/ui/ConfirmModal';
import { useMutateCreateKey } from '../../hooks/useMutateCreateKey';
import { useQueryFetchKeys } from '../../hooks/useQueryFetchKeys';
import SettingsApiKeysItem from './SettingsApiKeysItem';
import {
  CheckIcon,
  ClipboardDocumentIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const SettingsApiKeys = () => {
  const { data: keys, isLoading } = useQueryFetchKeys();
  const createKey = useMutateCreateKey();
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState('');
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  const isCreating = createKey.isPending;

  // Auto-scroll to new key when it appears
  useEffect(() => {
    if (newKeyValue) {
      const element = document.getElementById('new-api-key-display');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [newKeyValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      setShowConfirm(true);
    }
  };

  const handleConfirmCreate = () => {
    setShowConfirm(false);

    createKey.mutate(
      { description: description.trim() },
      {
        onSuccess: data => {
          setNewKeyValue('');
          setCopied(false);
          queryClient.invalidateQueries({ queryKey: ['api-keys', 'list'] });
          setDescription('');
          setShowForm(false);
          setTimeout(() => {
            setNewKeyValue(data.pkey);
          }, 100);
        },
        onError: error => {
          console.error('Failed to create API key:', error);
        },
      }
    );
  };

  const handleCancelCreate = () => {
    setShowConfirm(false);
  };

  const handleCopy = async () => {
    if (newKeyValue) {
      try {
        await navigator.clipboard.writeText(newKeyValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleDismissNewKey = () => {
    if (
      confirm(
        "Are you sure you want to dismiss this key? You won't be able to see it again."
      )
    ) {
      setNewKeyValue('');
      setCopied(false);
    }
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
            onClick={() => {
              setShowForm(!showForm);
              // Clear any existing new key when opening form
              if (!showForm) {
                setNewKeyValue('');
                setCopied(false);
              }
            }}
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

        {newKeyValue && (
          <div
            id="new-api-key-display"
            className="mb-6 rounded-4xl border-2 border-[var(--color-primary)] bg-[var(--color-surface)] p-6 shadow-lg"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h4 className="text-lg font-bold text-[var(--color-primary)]">
                  New API Key Successfully Created!
                </h4>
                <p className="mt-1 text-sm font-medium text-[var(--color-accent)]">
                  Copy this key now - it won't be shown again for security
                  reasons.
                </p>
              </div>
              <button
                onClick={handleDismissNewKey}
                className="text-[var(--color-accent)] transition-colors hover:text-[var(--color-primary)]"
                aria-label="Dismiss new key"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="border-opacity-30 mb-3 rounded-lg border-2 border-[var(--color-primary)] bg-[var(--color-bg)] p-4">
              <div className="mb-2 text-xs font-semibold tracking-wider text-[var(--color-accent)] uppercase">
                Your API Key:
              </div>
              <div className="flex items-center justify-between gap-4">
                <code className="flex-1 font-mono text-sm break-all text-[var(--color-fg)] select-all">
                  {newKeyValue}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                    copied
                      ? 'bg-[var(--color-primary)] text-white opacity-80'
                      : 'bg-[var(--color-primary)] text-white hover:opacity-90'
                  }`}
                  aria-label="Copy API Key"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      Copy Key
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="border-opacity-20 rounded-md border border-[var(--color-primary)] bg-[var(--color-bg)] p-3">
              <p className="text-xs font-medium text-[var(--color-accent)]">
                Store this key in your IDE. Once you dismiss this message, the
                key cannot be retrieved again.
              </p>
            </div>
          </div>
        )}

        {showForm && (
          <div className="relative mb-4 rounded-4xl border border-[var(--color-primary)] bg-[var(--color-surface)] p-6 shadow-md">
            {isCreating && (
              <div className="bg-opacity-80 absolute inset-0 z-10 flex items-center justify-center rounded-4xl bg-[var(--color-surface)]">
                <div className="bg-opacity-20 animate-pulse rounded-md bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-primary)]">
                  Creating API Key...
                </div>
              </div>
            )}
            <h3 className="mb-4 text-xl font-semibold text-[var(--color-fg)]">
              Create New API Key
            </h3>
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <fieldset
                disabled={isCreating}
                className="flex w-full items-center gap-4"
              >
                <input
                  type="text"
                  placeholder="Enter a description (e.g., 'VSCode Extension - Work Laptop')"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="border-opacity-20 flex-1 rounded-4xl border border-[var(--color-accent)] bg-[var(--color-bg)] px-4 py-2 text-base text-[var(--color-fg)] outline-none placeholder:text-[var(--color-accent)] hover:shadow-md focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-4xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-2 text-base font-medium text-white shadow-md transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isCreating || !description.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create Key'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setDescription('');
                  }}
                  className="rounded-4xl border border-[var(--color-accent)] px-6 py-2 text-base font-medium text-[var(--color-fg)] shadow-md transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isCreating}
                >
                  Cancel
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
            <div>
              <h3 className="mb-3 text-lg font-semibold text-[var(--color-accent)]">
                Existing API Keys ({keys.length})
              </h3>
              <ul className="space-y-3">
                {keys.map((key: any) => (
                  <SettingsApiKeysItem
                    key={key.id}
                    description={key.description}
                    createdAt={key.createdAt}
                  />
                ))}
              </ul>
            </div>
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
