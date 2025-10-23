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
  const buttonStyles = 'hover:bg-red-600 hover:text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-md rounded-4xl border border-[var(--color-fg)] bg-[var(--color-surface)] p-8 shadow-md">
        {title && (
          <h3 className="mb-4 text-center text-xl font-medium">{title}</h3>
        )}
        <p className="mb-6 text-center text-lg font-normal">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`rounded-4xl border border-[var(--color-fg)] px-6 py-2 transition-colors ${buttonStyles}`}
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
