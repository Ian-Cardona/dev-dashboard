import { useMutateUpdateUserProfile } from '../../hooks/useMutateUpdateUserProfile';
import { useQueryFetchUserProfile } from '../../hooks/useQueryFetchUserProfile';
import {
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const SettingsAccount = () => {
  const { data: userProfile } = useQueryFetchUserProfile();
  const updateProfile = useMutateUpdateUserProfile();
  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState(userProfile?.firstName ?? '');
  const [lastName, setLastName] = useState(userProfile?.lastName ?? '');
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    setIsPending(true);
    try {
      await updateProfile.mutateAsync({ firstName, lastName });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      setIsEditMode(false);
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    setFirstName(userProfile?.firstName ?? '');
    setLastName(userProfile?.lastName ?? '');
    setIsEditMode(false);
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    console.log('Account deletion initiated');
    setTimeout(() => {
      setIsDeleting(false);
      setShowConfirm(false);
    }, 2000);
  };

  const hasChanges =
    userProfile &&
    (firstName !== userProfile.firstName || lastName !== userProfile.lastName);

  return (
    <section className="flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="flex items-center text-3xl">Account</h2>
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

      <div className="flex-1 overflow-hidden rounded-b-2xl">
        <div className="h-full overflow-y-auto px-8 pb-8">
          <p className="mb-6 text-sm text-[var(--color-accent)]">
            Manage your profile information and account settings.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl border bg-[var(--color-surface)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 text-sm font-medium text-[var(--color-fg)]">
                    First Name
                  </div>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-[var(--color-fg)]/10 bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="First Name"
                    />
                  ) : (
                    <div className="text-base text-[var(--color-fg)]">
                      {userProfile?.firstName ?? 'N/A'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-2 text-sm font-medium text-[var(--color-fg)]">
                    Last Name
                  </div>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full rounded-lg border border-[var(--color-fg)]/10 bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="Last Name"
                    />
                  ) : (
                    <div className="text-base text-[var(--color-fg)]">
                      {userProfile?.lastName ?? 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-[var(--color-surface)] p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 text-sm font-medium text-[var(--color-fg)]">
                    Email
                  </div>
                  <div className="text-base text-[var(--color-fg)]">
                    {userProfile?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 text-base font-semibold text-red-700 dark:text-red-400">
                    Delete Account
                  </div>
                  <div className="mb-4 text-sm text-red-600 dark:text-red-400/80">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </div>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    Delete Account
                  </button>
                </div>
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
            className="'cursor-pointer' flex items-center gap-2 rounded-4xl border bg-[var(--color-surface)] px-6 py-2 text-base font-medium shadow-md"
          >
            <CheckIcon className="h-5 w-5" />
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-2xl border border-[var(--color-fg)]/10 bg-[var(--color-surface)] p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-[var(--color-fg)]">
              Delete Account
            </h3>
            <p className="mb-6 text-sm text-[var(--color-accent)]">
              Are you sure you want to delete your account? This will
              permanently remove all your data and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--color-fg)]/10 bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-fg)]/5"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SettingsAccount;
