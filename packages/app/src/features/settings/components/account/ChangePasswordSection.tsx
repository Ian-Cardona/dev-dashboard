import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ChangePasswordSectionProps {
  isPending: boolean;
  onChangePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

export const ChangePasswordSection = ({
  isPending,
  onChangePassword,
}: ChangePasswordSectionProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validatePassword()) {
      onChangePassword({ currentPassword, newPassword, confirmPassword });
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setShowPasswordFields(false);
  };

  return (
    <div className="group rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md">
      <div className="flex items-start gap-4">
        <LockClosedIcon className="h-6 w-6 text-[var(--color-accent)]" />
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold text-[var(--color-fg)]">
            Change Password
          </h3>
          <p className="mb-4 text-sm text-[var(--color-accent)]">
            Update your password to keep your account secure.
          </p>

          {!showPasswordFields ? (
            <button
              onClick={() => setShowPasswordFields(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-fg)]">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] transition-colors duration-200 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-fg)]">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => {
                    setNewPassword(e.target.value);
                    if (error) validatePassword();
                  }}
                  className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] transition-colors duration-200 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-fg)]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    if (error) validatePassword();
                  }}
                  className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-fg)] transition-colors duration-200 focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Confirm new password"
                />
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={
                    isPending ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="rounded-lg border border-[var(--color-accent)]/20 px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
