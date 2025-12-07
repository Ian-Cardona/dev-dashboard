import ConfirmModal from '../../../components/ui/modals/ConfirmModal';
import ErrorModal from '../../../components/ui/modals/ErrorModal';
import {
  AccountHeader,
  EmailSection,
  LogoutSection,
  ProfileNameSection,
  SaveChangesButton,
} from '../../../features/settings/components/account';
import {
  useMutateLogout,
  useQueryFetchUserProfile,
} from '../../../features/settings/hooks';
import { useToast } from '../../../hooks/useToast';
import { queryClient } from '../../../lib/tanstack/queryClient';
import useQueryFetchGithubOAuthLink from '../../../oauth/hooks/useQueryFetchGithubAuthLink';
import { getAndClearCookieValue } from '../../../utils/document/getAndClearCookieValue';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const SettingsAccount = () => {
  const { data: userProfile } = useQueryFetchUserProfile();
  const githubAuthorizeQuery = useQueryFetchGithubOAuthLink('link');

  const [isConnecting, setIsConnecting] = useState(false);
  const logoutMutation = useMutateLogout();
  const toast = useToast();

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName ?? '');
      setLastName(userProfile.lastName ?? '');
    }
  }, [userProfile]);

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

            <LogoutSection isPending={isPending} onLogout={handleLogout} />
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
