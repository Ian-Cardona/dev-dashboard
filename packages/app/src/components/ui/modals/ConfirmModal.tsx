interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'danger' | 'success';
}

const ConfirmModal = ({
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default',
}: ConfirmModalProps) => {
  const getConfirmButtonStyles = () => {
    const baseStyles =
      'rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200';

    switch (confirmVariant) {
      case 'danger':
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700`;
      case 'success':
        return `${baseStyles} bg-green-600 text-white hover:bg-green-700`;
      default:
        return `${baseStyles} bg-[var(--color-primary)] text-white hover:opacity-90`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
        {title && (
          <h3 className="mb-4 text-center text-xl font-bold text-[var(--color-fg)]">
            {title}
          </h3>
        )}
        <p className="mb-6 text-center text-base text-[var(--color-fg)]">
          {message}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-[var(--color-accent)]/20 px-5 py-2 text-sm font-semibold text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            {cancelText}
          </button>
          <button onClick={onConfirm} className={getConfirmButtonStyles()}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
