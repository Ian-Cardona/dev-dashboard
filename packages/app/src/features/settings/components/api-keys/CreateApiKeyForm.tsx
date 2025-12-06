import { useMutateCreateKey } from '../../hooks/useMutateCreateKey';
import { PlusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface CreateApiKeyFormProps {
  description: string;
  setDescription: (description: string) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  setShowConfirm: (show: boolean) => void;
}

const CreateApiKeyForm = ({
  description,
  setDescription,
  showForm,
  setShowForm,
  setShowConfirm,
}: CreateApiKeyFormProps) => {
  const createKey = useMutateCreateKey();
  const isCreating = createKey.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      setShowConfirm(true);
    }
  };

  if (!showForm) return null;

  return (
    <div className="relative mb-6 rounded-lg border-2 border-[var(--color-primary)]/40 bg-[var(--color-surface)] p-6 shadow-sm">
      {isCreating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--color-surface)]/80 backdrop-blur-sm">
          <div className="animate-pulse rounded-lg bg-[var(--color-primary)]/20 px-6 py-3 font-semibold text-[var(--color-primary)]">
            Creating API Key...
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <PlusIcon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-[var(--color-fg)]">
          Create New API Key
        </h3>
      </div>

      <div className="mb-6 rounded-lg border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" />
          <div>
            <p className="mb-1 text-sm font-semibold text-[var(--color-fg)]">
              Security Notice
            </p>
            <p className="text-sm text-[var(--color-accent)]">
              API keys provide full access to your account. Store them securely
              and never share them publicly.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={isCreating} className="space-y-4">
          <div>
            <label
              htmlFor="api-key-description"
              className="mb-2 block text-sm font-semibold text-[var(--color-fg)]"
            >
              Description <span className="text-[var(--color-primary)]">*</span>
            </label>
            <input
              id="api-key-description"
              type="text"
              placeholder="e.g., 'VSCode Extension - Work Laptop'"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:cursor-not-allowed disabled:opacity-50"
              required
              autoFocus
            />
            <p className="mt-2 text-xs text-[var(--color-accent)]/70">
              Add a descriptive name to help you identify this key later.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setDescription('');
              }}
              className="rounded-lg border border-[var(--color-accent)]/20 px-5 py-2.5 text-base font-semibold text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isCreating}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-5 py-2.5 text-base font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isCreating || !description.trim()}
            >
              <PlusIcon className="h-5 w-5" />
              {isCreating ? 'Creating...' : 'Create Key'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateApiKeyForm;
