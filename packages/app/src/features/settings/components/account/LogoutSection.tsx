import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

interface LogoutSectionProps {
  isPending: boolean;
  onLogout: () => void;
}

export const LogoutSection = ({ isPending, onLogout }: LogoutSectionProps) => {
  return (
    <div className="group rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold text-[var(--color-fg)]">
            Sign Out
          </h3>
          <p className="mb-4 text-sm text-[var(--color-accent)]">
            Sign out from this device and end your current session.
          </p>
          <button
            onClick={onLogout}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
            {isPending ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
};
