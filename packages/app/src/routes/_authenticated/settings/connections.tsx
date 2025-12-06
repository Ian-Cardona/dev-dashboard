import GithubSvg from '../../../components/ui/svg/GithubSvg';
import { useQueryFetchProviders } from '../../../features/settings/hooks/useQueryFetchProviders';
import {
  LinkIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { createFileRoute } from '@tanstack/react-router';

const SettingsConnections = () => {
  const { data: providers, isLoading } = useQueryFetchProviders();

  const getProviderDisplay = (providerName: string) => {
    const lowerProvider = providerName.toLowerCase();

    switch (lowerProvider) {
      case 'github':
        return {
          name: 'GitHub',
          icon: <GithubSvg className="h-6 w-6" />,
          color: 'text-[#333]',
          bgColor: 'bg-[#333]/10',
        };
      default:
        return {
          name: providerName.charAt(0).toUpperCase() + providerName.slice(1),
          icon: <LinkIcon className="h-6 w-6" />,
          color: 'text-[var(--color-primary)]',
          bgColor: 'bg-[var(--color-primary)]/10',
        };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
        }
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-24 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-[var(--color-fg)]">
          Connections
        </h2>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          <p className="mb-6 text-sm text-[var(--color-accent)]">
            Connect your external services and integrations to enhance your
            workflow.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm">
              <div className="animate-pulse rounded-lg bg-[var(--color-primary)]/20 px-6 py-3 font-semibold text-[var(--color-primary)]">
                Loading connections...
              </div>
            </div>
          ) : providers && providers.length > 0 ? (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[var(--color-fg)]">
                Active Connections ({providers.length})
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {providers.map(provider => {
                  const displayInfo = getProviderDisplay(provider.provider);

                  return (
                    <div
                      key={provider.provider}
                      className="group rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex flex-1 items-start gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-lg ${displayInfo.bgColor} ${displayInfo.color}`}
                          >
                            {displayInfo.icon}
                          </div>

                          <div className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                              <h4 className="text-lg font-bold text-[var(--color-fg)]">
                                {displayInfo.name}
                              </h4>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                Connected
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-[var(--color-accent)]">
                              <ClockIcon className="h-4 w-4" />
                              <span className="font-medium">Last Updated:</span>
                              <span>{formatDate(provider.updatedAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* <button
                          type="button"
                          className="rounded-lg border border-[var(--color-accent)]/20 px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                          aria-label={`Manage ${displayInfo.name} connection`}
                        >
                          Manage
                        </button> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <LinkIcon className="mb-4 h-16 w-16 text-[var(--color-accent)]/40" />
              <p className="text-sm text-[var(--color-accent)]">
                No connections have been established yet.
              </p>
              <p className="mt-2 text-xs text-[var(--color-accent)]/70">
                Connect external services to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute('/_authenticated/settings/connections')({
  component: SettingsConnections,
});
