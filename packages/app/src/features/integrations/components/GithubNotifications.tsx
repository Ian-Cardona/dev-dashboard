import { timeSince } from '../../../utils/temporal/timeSince';
import useQueryFetchGithubNotifications from '../hooks/useQueryFetchGithubNotifications';
import type { GithubNotificationResponse } from '@dev-dashboard/shared';

const GithubNotifications = () => {
  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQueryFetchGithubNotifications();

  return (
    <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="mb-6 flex items-center justify-between px-6">
        <h2 className="text-2xl font-semibold text-[var(--color-fg)]">
          Notifications
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto rounded-b-4xl px-6 pb-6">
        <div className="flex flex-col items-center justify-center">
          {notificationsLoading && (
            <p className="text-[var(--color-muted)]">
              Loading notifications...
            </p>
          )}
          {notificationsError && (
            <p className="text-[var(--color-muted)]">
              Error loading notifications
            </p>
          )}
          {!notificationsLoading &&
            !notificationsError &&
            notifications &&
            notifications.length === 0 && (
              <p className="text-[var(--color-muted)]">
                No notifications found
              </p>
            )}
          {!notificationsLoading &&
            !notificationsError &&
            notifications &&
            notifications.length > 0 && (
              <div className="w-full space-y-3 rounded-2xl border border-[var(--color-muted)] bg-[var(--color-surface)] p-4">
                {notifications.map(
                  (notification: GithubNotificationResponse) => (
                    <div
                      key={notification.id}
                      className="cursor-pointer rounded-lg border border-transparent p-4 hover:border-[var(--color-muted)]"
                    >
                      <p className="mb-1 text-sm text-[var(--color-muted)]">
                        Repository:{' '}
                        <span className="font-medium text-[var(--color-fg)]">
                          {notification.repository.full_name}
                        </span>
                      </p>
                      <h3 className="mb-1 text-lg font-semibold text-[var(--color-fg)]">
                        {notification.subject.title}
                      </h3>
                      <div className="mb-2">
                        <span className="bg-opacity-10 inline-block rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-xs font-semibold text-[var(--color-muted)]">
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
                        Updated: {timeSince(notification.updatedAt)}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default GithubNotifications;
