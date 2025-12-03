import ConfirmModal from '../../../components/ui/modals/ConfirmModal';
import ErrorModal from '../../../components/ui/modals/ErrorModal';
import { AccountHeader } from '../../../features/settings/components/account/AccountHeader';
import { DeleteAccountSection } from '../../../features/settings/components/account/DeleteAccountSection';
import { EmailSection } from '../../../features/settings/components/account/EmailSection';
import { LogoutSection } from '../../../features/settings/components/account/LogoutSection';
import { ProfileNameSection } from '../../../features/settings/components/account/ProfileNameSection';
import { SaveChangesButton } from '../../../features/settings/components/account/SaveChangesButton';
import { useMutateLogout } from '../../../features/settings/hooks/useMutateLogout';
import { useQueryFetchUserProfile } from '../../../features/settings/hooks/useQueryFetchUserProfile';
import { useToast } from '../../../hooks/useToast';
import useQueryFetchGithubOAuthLink from '../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { useQueryFetchGithubIntegration } from '../../../oauth/hooks/useQueryFetchGithubIntegration';
import { getAndClearCookieValue } from '../../../utils/document/getAndClearCookieValue';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const SettingsAccount = () => {
  const { data: userProfile } = useQueryFetchUserProfile();
  const githubAuthorizeQuery = useQueryFetchGithubOAuthLink('link');
  const { data: githubIntegration } = useQueryFetchGithubIntegration();

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
      queryClient.invalidateQueries({ queryKey: ['githubIntegration'] });
    }
  }, [toast, queryClient]);

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

  const handleGithubConnect = () => {
    if (githubAuthorizeQuery.data) {
      setIsConnecting(true);
      window.location.href = githubAuthorizeQuery.data;
    }
  };

  const hasChanges =
    userProfile &&
    (firstName !== userProfile.firstName || lastName !== userProfile.lastName);

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <AccountHeader
        isEditMode={isEditMode}
        onEditClick={handleEditClick}
        onCancel={handleCancel}
      />

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          <p className="mb-6 text-sm text-[var(--color-accent)]">
            Manage your profile information and account settings.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <ProfileNameSection
              isEditMode={isEditMode}
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
            />

            <EmailSection email={userProfile?.email} />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                GitHub Integration
              </label>
              <div className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {githubIntegration?.isConnected
                      ? 'GitHub account connected'
                      : 'No GitHub account connected'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGithubConnect}
                  disabled={
                    githubIntegration?.isConnected ||
                    isConnecting ||
                    !githubAuthorizeQuery.data
                  }
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    githubIntegration?.isConnected
                      ? 'cursor-default bg-green-500/10 text-green-500'
                      : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 disabled:opacity-50'
                  }`}
                >
                  {githubIntegration?.isConnected
                    ? 'Connected'
                    : isConnecting
                      ? 'Connecting...'
                      : 'Connect GitHub'}
                </button>
              </div>
            </div>

            <LogoutSection isPending={isPending} onLogout={handleLogout} />

            <DeleteAccountSection onDeleteClick={() => setShowConfirm(true)} />
          </div>

          {isEditMode && (
            <SaveChangesButton
              hasChanges={!!hasChanges}
              isPending={isPending}
              onSave={handleSave}
            />
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
        <ConfirmModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowConfirm(false)}
          title="Delete Account"
          message="Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone."
          confirmText={isDeleting ? 'Deleting...' : 'Delete Account'}
          cancelText="Cancel"
          confirmVariant="danger"
        />
      )}
    </section>
  );
};

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
});
