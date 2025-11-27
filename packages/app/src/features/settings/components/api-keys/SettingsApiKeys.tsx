import ConfirmModal from '../../../../components/ui/ConfirmModal';
import { useMutateCreateKey } from '../../hooks/useMutateCreateKey';
import { useQueryFetchKeys } from '../../hooks/useQueryFetchKeys';
import CreateApiKeyForm from './CreateApiKeyForm';
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

  useEffect(() => {
    if (newKeyValue) {
      const element = document.getElementById('new-api-key-display');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [newKeyValue]);

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
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="flex items-center text-2xl font-bold text-[var(--color-fg)]">
          API Keys
        </h2>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-5 py-3 text-base font-semibold transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Create a new API Key"
          onClick={() => {
            setShowForm(!showForm);
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

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          <p className="mb-6 text-sm text-[var(--color-accent)]">
            These keys allow your VSCode extension to connect securely to your
            account. Treat them like passwords and do not share them.
          </p>

          {newKeyValue && (
            <div
              id="new-api-key-display"
              className="mb-6 rounded-lg border-2 border-[var(--color-primary)] bg-[var(--color-surface)] p-6"
            >
              <div className="mb-4 flex items-start justify-between">
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

              <div className="mb-4 rounded-lg border-2 border-[var(--color-primary)] bg-[var(--color-bg)] p-4">
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
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
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

              <div className="rounded-lg border border-[var(--color-primary)]/20 bg-[var(--color-bg)] p-3">
                <p className="text-xs font-medium text-[var(--color-accent)]">
                  Store this key in your IDE. Once you dismiss this message, the
                  key cannot be retrieved again.
                </p>
              </div>
            </div>
          )}

          <CreateApiKeyForm
            description={description}
            setDescription={setDescription}
            showForm={showForm}
            setShowForm={setShowForm}
            setShowConfirm={setShowConfirm}
          />

          <div className="relative">
            {isCreating && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--color-surface)]/60">
                <div className="animate-pulse rounded-lg bg-[var(--color-primary)]/20 px-6 py-3 font-semibold text-[var(--color-primary)]">
                  Updating list...
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-sm">
                <div className="animate-pulse rounded-lg bg-[var(--color-primary)]/20 px-6 py-3 font-semibold text-[var(--color-primary)]">
                  Loading keys...
                </div>
              </div>
            ) : keys && keys.length > 0 ? (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-fg)]">
                  Existing API Keys ({keys.length})
                </h3>
                <ul className="space-y-4">
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
              <div className="flex items-center justify-center py-8 text-sm text-[var(--color-accent)]">
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
