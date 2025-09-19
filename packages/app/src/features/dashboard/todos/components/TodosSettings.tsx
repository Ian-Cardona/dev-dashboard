import { PlusIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useMutateCreateKey } from '../../api-keys/hooks/useMutateCreateKey';
import { useQueryFetchKeys } from '../../api-keys/hooks/useQueryFetchKeys';

export interface TodosSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TodosSettings: React.FC<TodosSettingsProps> = ({
  isOpen,
  onClose,
}) => {
  const createKey = useMutateCreateKey();
  const { data } = useQueryFetchKeys();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="max-w-3xl w-full mx-4 p-8 bg-[var(--color-bg)] rounded-4xl border border-[var(--color-border)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-6">
          <Cog6ToothIcon className="h-7 w-7 text-[var(--color-fg)]" />
          <h2 className="text-2xl font-normal text-[var(--color-fg)]">
            Todos Settings
          </h2>
        </div>
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-normal text-[var(--color-fg)]">
              API Keys
            </h3>
            <button
              type="button"
              className="inline-flex items-center justify-center px-3 py-1 border border-[var(--color-border)] rounded-md text-[var(--color-fg)] text-sm font-normal hover:bg-[var(--color-border)] hover:text-[var(--color-fg)] transition"
              aria-label="Add API Key"
              onClick={() => createKey.mutate()}
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              New Key
            </button>
          </div>
          <p className="text-sm text-[var(--color-fg-muted)] mb-4">
            These keys allow your VSCode extension to connect securely to your
            account.
          </p>
          <div className="border border-[var(--color-border)] rounded-lg p-4 h-[160px] overflow-auto">
            {data ? (
              data.length > 0 ? (
                <div>
                  {data.map((key: any) => (
                    <div
                      key={key.id}
                      className="mb-2 text-sm text-[var(--color-fg)]"
                    >
                      <div>
                        {key.description ? key.description : 'No description'}
                      </div>
                      <div className="text-xs">{key.id}</div>
                      <div className="text-xs">{key.createdAt}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-[var(--color-fg)]">
                  No API keys available.
                </div>
              )
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};
