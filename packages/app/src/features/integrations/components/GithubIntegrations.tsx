import useQueryFetchGithubNotifications from '../hooks/useQueryFetchGithubNotifications';
import GithubLatestWorkflowRun from './GithubLatestWorkflowRun';
import GithubNotifications from './GithubNotifications';
import { useState } from 'react';

const GithubIntegrations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQueryFetchGithubNotifications();

  const unreadCount = notifications?.filter(n => n.unread)?.length || 0;

  return (
    <>
      <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
        <div className="mb-8 flex items-center justify-between px-8">
          <h2 className="flex items-center text-3xl">Github</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative flex items-center gap-2 rounded-4xl border px-6 py-1 text-base font-medium shadow-md transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-8 overflow-auto rounded-b-4xl px-8 pb-8">
          <GithubLatestWorkflowRun />
        </div>
      </section>

      {isModalOpen && (
        <GithubNotifications
          notifications={notifications}
          isLoading={notificationsLoading}
          isError={notificationsError}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default GithubIntegrations;
