import { timeSince } from '../../../utils/temporal/timeSince';
import type { GithubNotificationResponse } from '@dev-dashboard/shared';

interface GithubNotificationsProps {
  notifications: GithubNotificationResponse[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
}

/**
 * Converts a GitHub API URL (from a notification) into a clickable HTML URL.
 * It correctly handles the difference between Issues and Pull Requests.
 */
const getSubjectHtmlUrl = (
  notification: GithubNotificationResponse
): string => {
  let url = notification.subject.url.replace(
    'api.github.com/repos',
    'github.com'
  );

  // API URL for PRs is often .../issues/123, so we need to
  // use the subject.type to convert it to .../pull/123
  if (notification.subject.type === 'PullRequest') {
    url = url.replace('/issues/', '/pull/');
  }

  // Also handle the format from your example (e.g., .../pulls/123)
  url = url.replace('/pulls/', '/pull/');

  return url;
};

const GithubNotifications = ({
  notifications,
  isLoading,
  isError,
  onClose,
}: GithubNotificationsProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-md rounded-4xl border border-[var(--color-fg)] bg-[var(--color-surface)] p-8 shadow-md">
        <h2 className="mb-4 text-center text-xl font-medium text-[var(--color-fg)]">
          Notifications
        </h2>

        <div className="mb-6 max-h-[60vh] space-y-3 overflow-y-auto">
          {isLoading && (
            <p className="text-center text-[var(--color-muted)]">
              Loading notifications...
            </p>
          )}

          {isError && (
            <p className="text-center text-[var(--color-muted)]">
              Error loading notifications
            </p>
          )}

          {!isLoading &&
            !isError &&
            notifications &&
            notifications.length === 0 && (
              <p className="text-center text-[var(--color-muted)]">
                No notifications found
              </p>
            )}

          {!isLoading &&
            !isError &&
            notifications &&
            notifications.length > 0 &&
            notifications.map((notification: GithubNotificationResponse) => {
              // --- 1. Get the correct web URL ---
              const subjectHtmlUrl = getSubjectHtmlUrl(notification);

              return (
                <div
                  key={notification.id}
                  className="rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                >
                  <p className="mb-1 truncate text-sm text-[var(--color-muted)]">
                    {/* --- "Repository:" label removed --- */}
                    <a
                      href={notification.repository.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-fg)] hover:underline"
                    >
                      {notification.repository.full_name}
                    </a>
                  </p>

                  <a
                    href={subjectHtmlUrl} // <-- 1. Fixed URL applied here
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="mb-1 text-lg font-semibold text-[var(--color-fg)] hover:underline">
                      {notification.subject.title}
                    </h3>
                  </a>

                  {/* --- 2. Chip restyled but kept in original position --- */}
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-[var(--color-primary)]/20 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
                      {notification.subject.type}
                    </span>
                  </div>

                  <p className="mb-2 text-sm text-[var(--color-muted)]">
                    <span className="font-medium text-[var(--color-fg)]">
                      Reason:
                    </span>{' '}
                    {notification.reason}
                  </p>

                  <p className="text-xs text-[var(--color-muted)]">
                    Updated: {timeSince(notification.updated_at)}
                  </p>
                </div>
              );
            })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="rounded-4xl border border-[var(--color-fg)] px-6 py-2 transition-colors hover:bg-[var(--color-fg)] hover:text-[var(--color-surface)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GithubNotifications;
