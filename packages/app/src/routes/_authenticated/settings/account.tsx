import ErrorModal from '../../../components/ui/modals/ErrorModal';
import { useMutateLogout } from '../../../features/settings/hooks/useMutateLogout';
import { useQueryFetchUserProfile } from '../../../features/settings/hooks/useQueryFetchUserProfile';
import { useToast } from '../../../hooks/useToast';
import useQueryFetchGithubOAuthLink from '../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { getAndClearCookieValue } from '../../../utils/document/getAndClearCookieValue';
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const SettingsAccount = () => {
  const { data: userProfile } = useQueryFetchUserProfile();
  const githubAuthorizeQuery = useQueryFetchGithubOAuthLink('link');
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();
  const logoutMutation = useMutateLogout();
  const toast = useToast();

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState(userProfile?.firstName ?? '');
  const [lastName, setLastName] = useState(userProfile?.lastName ?? '');
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const oauthError = getAndClearCookieValue('gh_o_e');
    const oauthSuccess = getAndClearCookieValue('gh_o_s');

    if (oauthError) {
      const errorMessages: Record<string, string> = {
        not_found: 'User not found. Please try again.',
        github_already_linked:
          'This GitHub account is already linked to another user.',
        link_failed: 'Failed to link GitHub account. Please try again.',
      };
      setErrorMessage(
        errorMessages[oauthError] ||
          'An error occurred during GitHub connection.'
      );
      setShowErrorModal(true);
    }

    if (oauthSuccess) {
      const successMessages: Record<string, string> = {
        github_connected: 'GitHub account successfully connected!',
      };
      toast.showSuccess(successMessages[oauthSuccess] || 'Success!');
    }
  }, [toast]);

  useEffect(() => {
    if (githubAuthorizeQuery.isError && !isConnecting) {
      setErrorMessage(
        'Could not retrieve GitHub registration link. Please try again later.'
      );
      setShowErrorModal(true);
    }
  }, [githubAuthorizeQuery.isError, isConnecting]);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    setIsPending(true);
    try {
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

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setIsPending(false);
    }
  };

  const hasChanges =
    userProfile &&
    (firstName !== userProfile.firstName || lastName !== userProfile.lastName);

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="flex items-center text-2xl font-bold text-[var(--color-fg)]">
          Account
        </h2>
        <button
          onClick={isEditMode ? handleCancel : handleEditClick}
          className={`flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-5 py-3 text-base font-semibold transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white`}
        >
          {isEditMode ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <PencilSquareIcon className="h-5 w-5" />
          )}
          {isEditMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          <p className="mb-6 text-sm text-[var(--color-accent)]">
            Manage your profile information and account settings.
          </p>

          <div className="grid grid-cols-1 gap-6">
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
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-3 py-2 text-base font-medium text-[var(--color-fg)] focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="First Name"
                    />
                  ) : (
                    <div className="text-base font-medium text-[var(--color-fg)]">
                      {userProfile?.firstName ?? 'N/A'}
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
                      onChange={e => setLastName(e.target.value)}
                      className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-bg)] px-3 py-2 text-base font-medium text-[var(--color-fg)] focus:border-[var(--color-primary)] focus:outline-none"
                      placeholder="Last Name"
                    />
                  ) : (
                    <div className="text-base font-medium text-[var(--color-fg)]">
                      {userProfile?.lastName ?? 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 text-sm font-semibold text-[var(--color-fg)]">
                    Email
                  </div>
                  <div className="text-base font-medium text-[var(--color-fg)]">
                    {userProfile?.email}
                  </div>
                </div>
              </div>
            </div>

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
                    onClick={handleLogout}
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--color-accent)]/20 px-5 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-50"
                  >
                    {isPending ? 'Signing out...' : 'Logout'}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-red-300 bg-red-50 p-6 dark:border-red-700 dark:bg-red-950/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">
                    Delete Account
                  </div>
                  <div className="mb-4 text-sm text-red-600 dark:text-red-400/80">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </div>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-5 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white dark:border-red-700 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-800"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isEditMode && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!hasChanges || isPending}
                className={`flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-5 py-3 text-base font-semibold transition-all duration-200 ${
                  !hasChanges || isPending
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:border-green-600 hover:bg-green-600 hover:text-white'
                }`}
              >
                <CheckIcon className="h-5 w-5" />
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {showErrorModal && (
        <ErrorModal
          onClose={handleCloseErrorModal}
          title="Connection Error"
          message={errorMessage}
          closeText="Close"
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 shadow-md">
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
                className="inline-flex items-center justify-center rounded-lg border border-[var(--color-accent)]/20 px-5 py-2 text-sm font-medium text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-lg border border-red-600 bg-red-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 disabled:opacity-50 dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-800"
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

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
});
