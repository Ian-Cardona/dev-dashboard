interface ErrorModalProps {
  onClose: () => void;
  title?: string;
  message: string;
  closeText?: string;
}

const ErrorModal = ({
  onClose,
  title = 'Error',
  message,
  closeText = 'OK',
}: ErrorModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
        {title && (
          <h3 className="mb-4 text-center text-xl font-bold text-red-600">
            {title}
          </h3>
        )}
        <p className="mb-6 text-center text-base text-[var(--color-fg)]">
          {message}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700"
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
