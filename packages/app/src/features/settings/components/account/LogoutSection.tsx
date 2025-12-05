interface LogoutSectionProps {
  isPending: boolean;
  onLogout: () => void;
}

export const LogoutSection = ({ isPending, onLogout }: LogoutSectionProps) => {
  return (
    <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 text-sm font-semibold text-[var(--color-fg)]">
            Logout
          </div>
          <div className="mb-4 text-sm text-[var(--color-accent)]">
            Sign out from this device.
          </div>
          <button
            onClick={onLogout}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-accent)]/20 px-5 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-50"
          >
            {isPending ? 'Signing out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};
