interface EmailSectionProps {
  email?: string;
}

export const EmailSection = ({ email }: EmailSectionProps) => {
  return (
    <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 text-sm font-semibold text-[var(--color-fg)]">
            Email
          </div>
          <div className="text-base font-medium text-[var(--color-fg)]">
            {email}
          </div>
        </div>
      </div>
    </div>
  );
};
