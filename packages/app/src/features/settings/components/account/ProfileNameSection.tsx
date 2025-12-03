interface ProfileNameSectionProps {
  isEditMode: boolean;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export const ProfileNameSection = ({
  isEditMode,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: ProfileNameSectionProps) => {
  return (
    <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 text-sm font-semibold text-[var(--color-fg)]">
            First Name
          </div>
          {isEditMode ? (
            <input
              type="text"
              value={firstName}
              onChange={e => onFirstNameChange(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-3 py-2 text-base font-medium text-[var(--color-fg)] focus:border-[var(--color-primary)] focus:outline-none"
              placeholder="First Name"
            />
          ) : (
            <div className="text-base font-medium text-[var(--color-fg)]">
              {firstName || 'N/A'}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="mb-2 text-sm font-semibold text-[var(--color-fg)]">
            Last Name
          </div>
          {isEditMode ? (
            <input
              type="text"
              value={lastName}
              onChange={e => onLastNameChange(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-3 py-2 text-base font-medium text-[var(--color-fg)] focus:border-[var(--color-primary)] focus:outline-none"
              placeholder="Last Name"
            />
          ) : (
            <div className="text-base font-medium text-[var(--color-fg)]">
              {lastName || 'N/A'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
