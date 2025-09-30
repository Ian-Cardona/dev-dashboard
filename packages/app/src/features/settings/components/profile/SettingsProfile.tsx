import {
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const mockUser = {
  displayName: 'John Doe',
  email: 'john.doe@example.com',
};

const SettingsProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(mockUser.displayName);
  const [email, setEmail] = useState(mockUser.email);
  const [isPending, setIsPending] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    setIsPending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    mockUser.displayName = displayName;
    mockUser.email = email;
    setIsPending(false);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setDisplayName(mockUser.displayName);
    setEmail(mockUser.email);
    setIsEditMode(false);
  };

  const hasChanges =
    displayName !== mockUser.displayName || email !== mockUser.email;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="flex items-center text-3xl">Profile</h2>
        <button
          onClick={isEditMode ? handleCancel : handleEditClick}
          className="flex items-center gap-2 rounded-4xl border px-6 text-base font-medium shadow-md hover:bg-[var(--color-fg)]/[0.03]"
        >
          {isEditMode ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <PencilSquareIcon className="h-5 w-5" />
          )}
          {isEditMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-b-4xl px-8 pb-8">
        <p className="mb-6 max-w-2xl text-sm text-[var(--color-fg)]">
          Manage your profile information and how you appear on the platform.
        </p>

        <div className="grid max-w-2xl grid-cols-1 gap-6">
          {/* Display Name Field */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 text-sm font-medium text-[var(--color-fg)]">
                  Display Name
                </div>
                {isEditMode ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                    placeholder="Your display name"
                  />
                ) : (
                  <div className="text-base text-[var(--color-fg)]">
                    {displayName}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 text-sm font-medium text-[var(--color-fg)]">
                  Email
                </div>
                {isEditMode ? (
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                    placeholder="your.email@example.com"
                  />
                ) : (
                  <div className="text-base text-[var(--color-fg)]">
                    {email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isPending}
            className={`flex items-center gap-2 rounded-4xl border bg-[var(--color-surface)] px-6 py-2 text-base font-medium shadow-md ${
              !hasChanges || isPending
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
          >
            <CheckIcon className="h-6 w-6" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsProfile;
