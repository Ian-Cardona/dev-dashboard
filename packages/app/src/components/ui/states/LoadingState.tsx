export const LoadingState = ({
  message = 'Loading...',
}: {
  message?: string;
}) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-accent)]/20 border-t-[var(--color-primary)]" />
        <div className="text-lg font-semibold text-[var(--color-fg)]">
          Loading
        </div>
        <div className="mt-2 text-sm text-[var(--color-accent)]">{message}</div>
      </div>
    </div>
  );
};
