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
    <div className="group rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-lg font-bold text-[var(--color-fg)]">
          Profile Name
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-fg)]">
            First Name{' '}
            {isEditMode && (
              <span className="text-[var(--color-primary)]">*</span>
            )}
          </label>
          {isEditMode ? (
            <input
              type="text"
              value={firstName}
              onChange={e => onFirstNameChange(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="Enter first name"
            />
          ) : (
            <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base font-medium text-[var(--color-fg)]">
              {firstName || 'Not set'}
            </div>
          )}
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-fg)]">
            Last Name{' '}
            {isEditMode && (
              <span className="text-[var(--color-primary)]">*</span>
            )}
          </label>
          {isEditMode ? (
            <input
              type="text"
              value={lastName}
              onChange={e => onLastNameChange(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base text-[var(--color-fg)] transition-all duration-200 outline-none placeholder:text-[var(--color-accent)]/70 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="Enter last name"
            />
          ) : (
            <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-4 py-3 text-base font-medium text-[var(--color-fg)]">
              {lastName || 'Not set'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
