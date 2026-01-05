import ConfirmModal from '../../../components/ui/modals/ConfirmModal';
import ErrorModal from '../../../components/ui/modals/ErrorModal';
import {
  AccountHeader,
  ChangePasswordSection,
  EmailSection,
  LogoutSection,
  ProfileNameSection,
  SaveChangesButton,
} from '../../../features/settings/components/account';
import {
  useMutateLogout,
  useMutateUpdateUserPassword,
  useQueryFetchUserProfile,
} from '../../../features/settings/hooks';
import { useMutateUpdateUserProfile } from '../../../features/settings/hooks/useMutateUpdateUserProfile';
import { useToast } from '../../../hooks/useToast';
import { queryClient } from '../../../lib/tanstack/queryClient';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const SettingsAccount = () => {
  const { data: userProfile } = useQueryFetchUserProfile();

  const logoutMutation = useMutateLogout();
  const updateProfileMutation = useMutateUpdateUserProfile();
  const updatePasswordMutation = useMutateUpdateUserPassword();
  const toast = useToast();

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordFormKey, setPasswordFormKey] = useState(0);

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName ?? '');
      setLastName(userProfile.lastName ?? '');
    }
  }, [userProfile]);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    updateProfileMutation.mutate(
      { firstName, lastName },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
          toast.showSuccess('Profile updated successfully!');
          setIsEditMode(false);
        },
        onError: error => {
          console.error('Failed to update profile:', error);
          toast.showError('Failed to update profile. Please try again.');
        },
      }
    );
  };

  const handleCancel = () => {
    setFirstName(userProfile?.firstName ?? '');
    setLastName(userProfile?.lastName ?? '');
    setIsEditMode(false);
  };

  const handleChangePassword = (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    updatePasswordMutation.mutate(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      },
      {
        onSuccess: () => {
          toast.showSuccess('Password updated successfully!');
          queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });

          setPasswordFormKey(prev => prev + 1);
        },
        onError: (error: unknown) => {
          let errorMessage = 'Failed to update password. Please try again.';

          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as {
              response?: { data?: { message?: string } };
            };
            if (axiosError.response?.data?.message) {
              errorMessage = axiosError.response.data.message;
            }
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          toast.showError(errorMessage);
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setShowConfirm(false);
    }, 2000);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.error('Logout failed', err);
      toast.showError('Logout failed. Please try again.');
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

            <ChangePasswordSection
              key={passwordFormKey}
              isPending={updatePasswordMutation.isPending}
              onChangePassword={handleChangePassword}
            />

            <LogoutSection
              isPending={logoutMutation.isPending}
              onLogout={handleLogout}
            />
          </div>

          {isEditMode && (
            <SaveChangesButton
              hasChanges={!!hasChanges}
              isPending={updateProfileMutation.isPending}
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
