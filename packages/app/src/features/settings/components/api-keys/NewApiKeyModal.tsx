type NewApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const NewApiKeyModal = ({ isOpen, onClose }: NewApiKeyModalProps) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      style={{}}
    >
      <div
        className="bg-[var(--color-bg)] text-[var(--color-fg)] p-8 rounded-lg border border-[var(--color-border)] min-w-[300px] relative shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] p-2 rounded transition"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">New API Key</h2>
        <div>Form goes here</div>
      </div>
    </div>
  );
};

export default NewApiKeyModal;
