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
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="text-3xl font-semibold">GitHub Notifications</h2>
      </div>
      <div className="flex-1 overflow-hidden rounded-b-4xl px-8">
        <div className="flex h-full flex-col items-start justify-center overflow-y-auto">
          {notificationsLoading && (
            <div className="flex h-full w-full items-center justify-center">
              <p>Loading notifications...</p>
            </div>
          )}
          {notificationsError && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-red-600">Error loading notifications</p>
            </div>
          )}
          {!notificationsLoading &&
            !notificationsError &&
            notifications &&
            notifications.length === 0 && (
              <div className="flex h-full w-full items-center justify-center">
                <p>No notifications found</p>
              </div>
            )}
          {!notificationsLoading &&
            !notificationsError &&
            notifications &&
            notifications.length > 0 && (
              <div className="w-full space-y-4">
                {notifications.map(
                  (notification: GithubNotificationResponse) => (
                    <div
                      key={notification.id}
                      className="w-full rounded-2xl border bg-white p-6 shadow-sm"
                    >
                      <p className="mb-2 text-sm text-gray-500">
                        Repository:{' '}
                        <span className="font-medium">
                          {notification.repository.fullName}
                        </span>
                      </p>
                      <h3 className="mb-2 text-2xl font-semibold">
                        {notification.subject.title}
                      </h3>
                      <div className="mb-4">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                          {notification.subject.type}
                        </span>
                      </div>
                      <p className="mb-4 text-gray-700">
                        <span className="font-medium">Reason:</span>{' '}
                        {notification.reason}
                      </p>
                      <p className="mb-6 text-sm text-gray-500">
                        Updated: {timeSince(notification.updatedAt)}
                      </p>
                      {notification.subject.url && (
                        <button
                          type="button"
                          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                          View Details
                        </button>
                      )}
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
