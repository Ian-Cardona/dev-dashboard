import { useQueryFetchProviders } from '../../../features/settings/hooks/useQueryFetchProviders';
import { createFileRoute } from '@tanstack/react-router';

const SettingsConnections = () => {
  const { data: providers } = useQueryFetchProviders();

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-accent)]/20 p-6">
        <h1 className="text-xl font-semibold text-[var(--color-fg)]">
          Connections
        </h1>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full overflow-y-auto">
          <p className="mb-6 text-sm text-[var(--color-accent)]">
            Connect your external services and integrations.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {providers?.map(provider => (
              <div
                key={provider.provider}
                className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6"
              >
                <div className="mb-2 text-sm font-semibold text-[var(--color-fg)]">
                  {provider.provider}
                </div>
                <div className="text-sm text-[var(--color-accent)]">
                  Last Updated {provider.providerUpdatedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Route = createFileRoute('/_authenticated/settings/connections')({
  component: SettingsConnections,
});
