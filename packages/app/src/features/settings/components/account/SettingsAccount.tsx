import { useState } from 'react';

const SettingsAccount = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    console.log('Account deletion initiated');
    setTimeout(() => {
      setIsDeleting(false);
      setShowConfirm(false);
    }, 2000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="flex items-center text-3xl">Account</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-b-4xl px-8 pb-8">
        <p className="mb-6 max-w-2xl text-sm text-[var(--color-fg)]">
          Manage your account settings and access dangerous operations.
        </p>

        <div className="grid max-w-2xl grid-cols-1 gap-6">
          {/* Danger Zone Card */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 text-lg font-medium text-red-800">
                  Delete Account
                </div>
                <div className="mb-4 text-sm text-red-600">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </div>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-3 py-1 text-sm font-normal text-red-700 transition-colors hover:bg-red-50"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-w-md rounded-2xl border bg-[var(--color-surface)] p-6">
            <h3 className="mb-2 text-lg font-medium text-[var(--color-fg)]">
              Delete Account
            </h3>
            <p className="mb-6 text-sm text-[var(--color-fg)]">
              Are you sure you want to delete your account? This will
              permanently remove all your data and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] px-3 py-1 text-sm font-normal transition-colors hover:bg-[var(--color-border)]"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-md border border-red-600 bg-red-600 px-3 py-1 text-sm font-normal text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsAccount;
