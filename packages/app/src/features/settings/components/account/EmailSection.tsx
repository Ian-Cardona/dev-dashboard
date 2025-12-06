interface EmailSectionProps {
  email?: string;
}

export const EmailSection = ({ email }: EmailSectionProps) => {
  return (
    <div className="group rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="mb-3 text-lg font-bold text-[var(--color-fg)]">
            Email Address
          </h3>
          <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base font-medium text-[var(--color-fg)]">
            {email || 'No email set'}
          </div>
          <p className="mt-2 text-xs text-[var(--color-accent)]/70">
            Your email address is used for account recovery and notifications.
          </p>
        </div>
      </div>
    </div>
  );
};
