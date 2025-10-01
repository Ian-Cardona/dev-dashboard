import { useState } from 'react';

type NewApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (description: string) => void;
};

const CreateApiKeyModal = ({
  isOpen,
  onClose,
  onConfirm,
}: NewApiKeyModalProps) => {
  const [description, setDescription] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="mx-4 flex w-full max-w-md flex-col items-center rounded-4xl border border-[var(--color-fg)] bg-[var(--color-surface)] p-8 shadow-md"
        role="dialog"
        aria-modal="true"
      >
        <h3 className="mb-6 text-xl font-bold text-[var(--color-fg)]">
          New API Key
        </h3>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            if (!confirmStep) {
              setConfirmStep(true);
            } else {
              onConfirm(description);
            }
          }}
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="api-key-description"
              className="font-medium text-[var(--color-fg)]"
            >
              Description
            </label>
            <input
              id="api-key-description"
              type="text"
              className="rounded border border-[var(--color-fg-muted)] bg-transparent px-3 py-2 text-[var(--color-fg)] focus:border-[var(--color-fg)] focus:outline-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          {confirmStep && (
            <p className="text-center text-sm text-[var(--color-fg-muted)]">
              Are you sure you want to create a new API key?
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-[var(--color-fg)] px-4 py-2 text-[var(--color-fg)] transition hover:bg-[var(--color-fg)] hover:text-[var(--color-surface)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded border border-[var(--color-fg)] bg-[var(--color-fg)] px-4 py-2 text-[var(--color-surface)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]"
            >
              {confirmStep ? 'Confirm' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApiKeyModal;
