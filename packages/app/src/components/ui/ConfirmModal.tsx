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
    switch (confirmVariant) {
      case 'danger':
        return 'hover:bg-red-600 hover:text-white';
      case 'success':
        return 'hover:bg-green-600 hover:text-[var(--color-surface)]';
      default:
        return 'hover:bg-[var(--color-fg)] hover:text-[var(--color-surface)]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-md rounded-4xl border border-[var(--color-fg)] bg-[var(--color-surface)] p-8 shadow-md">
        {title && (
          <h3 className="mb-4 text-center text-xl font-medium">{title}</h3>
        )}
        <p className="mb-6 text-center text-lg font-normal">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="rounded-4xl border border-[var(--color-fg)] px-6 py-2 transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-surface)]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-4xl border border-[var(--color-fg)] px-6 py-2 transition-colors ${getConfirmButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
