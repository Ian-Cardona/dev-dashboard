import { isUnauthorizedError } from '../../../utils/errors/getErrorMessage';
import { timeSince } from '../../../utils/temporal/timeSince';
import type { GithubNotificationResponse } from '@dev-dashboard/shared';
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  InboxIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';

interface GithubNotificationsProps {
  notifications: GithubNotificationResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  errorData: unknown;
  onRetry: () => void;
}

const getSubjectHtmlUrl = (
  notification: GithubNotificationResponse
): string => {
  let url = notification.subject.url.replace(
    'api.github.com/repos',
    'github.com'
  );
  if (notification.subject.type === 'PullRequest') {
    url = url.replace('/issues/', '/pull/');
  }
  return url.replace('/pulls/', '/pull/');
};

const GithubNotifications = ({
  notifications,
  isLoading,
  isError,
  errorMessage,
  errorData,
  onRetry,
}: GithubNotificationsProps) => {
  const navigate = useNavigate();
  const isUnauthorized = isUnauthorizedError(errorData);

  return (
    <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] shadow-lg">
      <div className="max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="p-8">
            <div className="text-center">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-accent)]/20 border-t-[var(--color-primary)]" />
              <div className="text-sm text-[var(--color-accent)]">
                Loading...
              </div>
            </div>
          </div>
        )}

        {isError && (
          <div className="p-8">
            <div className="text-center">
              {isUnauthorized ? (
                <LinkIcon className="mx-auto h-10 w-10 text-[var(--color-primary)]" />
              ) : (
                <ExclamationTriangleIcon className="mx-auto h-10 w-10 text-[var(--color-primary)]" />
              )}
              <div className="mt-3 text-sm font-semibold text-[var(--color-fg)]">
                {isUnauthorized ? 'GitHub not connected' : 'Failed to load'}
              </div>
              <div className="mt-1 text-xs text-[var(--color-accent)]">
                {isUnauthorized
                  ? 'Connect your GitHub account to continue'
                  : errorMessage}
              </div>
              {isUnauthorized ? (
                <button
                  onClick={() => navigate('/settings')}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary)]/90"
                >
                  <LinkIcon className="h-3 w-3" />
                  Connect GitHub
                </button>
              ) : (
                <button
                  onClick={onRetry}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-bg)]"
                >
                  <ArrowPathIcon className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {!isLoading &&
          !isError &&
          (!notifications || notifications.length === 0) && (
            <div className="p-8">
              <div className="text-center">
                <InboxIcon className="mx-auto h-10 w-10 text-[var(--color-accent)]" />
                <div className="mt-3 text-sm font-semibold text-[var(--color-fg)]">
                  No notifications
                </div>
                <div className="mt-1 text-xs text-[var(--color-accent)]">
                  You're all caught up
                </div>
              </div>
            </div>
          )}

        {!isLoading &&
          !isError &&
          notifications &&
          notifications.length > 0 && (
            <>
              {notifications.map(notification => {
                const url = getSubjectHtmlUrl(notification);
                return (
                  <a
                    key={notification.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block border-b border-[var(--color-accent)]/10 p-3 text-sm hover:bg-[var(--color-bg)] ${
                      notification.unread ? 'bg-[var(--color-primary)]/5' : ''
                    }`}
                  >
                    <div className="line-clamp-2">
                      {notification.subject.title}
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-[var(--color-accent)]">
                      <span>{notification.subject.type}</span>
                      <span>{timeSince(notification.updated_at)}</span>
                    </div>
                  </a>
                );
              })}
            </>
          )}
      </div>
    </div>
  );
};

export default GithubNotifications;
