import GithubLatestWorkflowRun from '../../../features/integrations/components/GithubLatestWorkflowRun';
import GithubNotifications from '../../../features/integrations/components/GithubNotifications';
import useQueryFetchGithubNotifications from '../../../features/integrations/hooks/useQueryFetchGithubNotifications';
import { getErrorMessage } from '../../../utils/errors/getErrorMessage';
import { BellIcon } from '@heroicons/react/24/outline';
import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';

const GithubIntegrations = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
    error: notificationsErrorData,
    refetch: refetchNotifications,
  } = useQueryFetchGithubNotifications();

  const unreadCount = notifications?.filter(n => n.unread)?.length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="text-2xl text-[var(--color-fg)]">GitHub</h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 px-4 py-2 text-sm transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            <BellIcon className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 z-10 mt-2 w-96 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] shadow-lg">
              <div className="border-b border-[var(--color-accent)]/20 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--color-fg)]">
                    GitHub Notifications
                  </h3>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-sm text-[var(--color-accent)] hover:text-[var(--color-primary)]"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="max-h-[32rem] overflow-y-auto">
                <GithubNotifications
                  notifications={notifications}
                  isLoading={notificationsLoading}
                  isError={notificationsError}
                  errorMessage={getErrorMessage(notificationsErrorData)}
                  errorData={notificationsErrorData}
                  onRetry={refetchNotifications}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          <GithubLatestWorkflowRun />
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute('/_authenticated/integrations/github')({
  component: GithubIntegrations,
});
