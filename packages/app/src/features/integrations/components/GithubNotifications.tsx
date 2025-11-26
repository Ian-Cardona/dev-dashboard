import { timeSince } from '../../../utils/temporal/timeSince';
import type { GithubNotificationResponse } from '@dev-dashboard/shared';

interface GithubNotificationsProps {
  notifications: GithubNotificationResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
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
  onClose,
}: GithubNotificationsProps) => {
  return (
    <div className="absolute top-full right-0 z-50 mt-1 w-80 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-accent)]/20 p-3">
        <div className="flex justify-between">
          <span className="font-semibold">Notifications</span>
          <button onClick={onClose} className="text-sm hover:text-[var(--color-primary)]">
            Close
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading && <div className="p-4 text-center text-sm">Loading...</div>}
        {isError && <div className="p-4 text-center text-sm text-[var(--color-primary)]">Error</div>}
        {!isLoading && !isError && notifications?.length === 0 && (
          <div className="p-4 text-center text-sm">No notifications</div>
        )}

        {notifications?.map(notification => {
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
              <div className="mb-1 flex justify-between">
                <span className="font-medium">{notification.repository.full_name}</span>
                {notification.unread && <span className="text-[var(--color-primary)]">●</span>}
              </div>
              <div className="line-clamp-2">{notification.subject.title}</div>
              <div className="mt-1 flex justify-between text-xs text-[var(--color-accent)]">
                <span>{notification.subject.type}</span>
                <span>{timeSince(notification.updated_at)}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default GithubNotifications;