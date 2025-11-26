import { timeSince } from '../../../utils/temporal/timeSince';
import useQueryFetchGithubWorkflow from '../hooks/useQueryFetchGithubWorkflow';
import useQueryFetchUserRepositories from '../hooks/useQueryFetchUserRepositories';
import type {
  GithubRepository,
  GithubWorkflowResponse,
} from '@dev-dashboard/shared';
import { useState, useEffect } from 'react';

const statusColors: Record<string, string> = {
  success: 'bg-green-300/20 text-green-300 border-green-300/30',
  failure: 'bg-red-300/20 text-red-300 border-red-300/30',
  cancelled: 'bg-gray-300/20 text-gray-300 border-gray-300/30',
  in_progress: 'bg-yellow-300/20 text-yellow-300 border-yellow-300/30',
  queued: 'bg-blue-300/20 text-blue-300 border-blue-300/30',
  neutral: 'bg-gray-300/20 text-gray-300 border-gray-300/30',
};

const GithubLatestWorkflowRun = () => {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);

  const {
    data: repositories,
    isLoading: repositoriesLoading,
    isError: repositoriesError,
  } = useQueryFetchUserRepositories();

  const {
    data: workflows,
    isLoading: workflowsLoading,
    isError: workflowsError,
  } = useQueryFetchGithubWorkflow(owner ?? '', selectedRepo ?? '');

  useEffect(() => {
    if (repositories && repositories.length > 0 && !selectedRepo) {
      setSelectedRepo(repositories[0].name);
      setOwner(repositories[0].owner.login);
    }
  }, [repositories, selectedRepo]);

  const handleRepoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const repoName = event.target.value;
    const repo = repositories?.find(
      (r: GithubRepository) => r.name === repoName
    );
    if (repo) {
      setSelectedRepo(repo.name);
      setOwner(repo.owner.login);
    }
  };

  const latestWorkflow: GithubWorkflowResponse | null = workflows ?? null;

  return (
    <section className="relative flex h-full flex-col rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <div className="flex h-16 items-center justify-between border-b border-[var(--color-accent)]/20 px-6">
        <h2 className="flex items-center text-xl font-bold text-[var(--color-fg)]">
          Latest Workflow Run
        </h2>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        {repositoriesLoading && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[var(--color-accent)]">
              Loading repositories...
            </p>
          </div>
        )}

        {repositoriesError && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[var(--color-primary)]">
              Error loading repositories
            </p>
          </div>
        )}

        {repositories && repositories.length > 0 && (
          <div className="mb-6">
            <select
              value={selectedRepo ?? ''}
              onChange={handleRepoChange}
              className="w-full rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-4 py-3 text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-accent)]/40 focus:border-[var(--color-primary)] focus:outline-none"
            >
              <option value="" disabled>
                Select a repository
              </option>
              {repositories.map((repo: GithubRepository) => (
                <option key={repo.id} value={repo.name}>
                  {repo.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {repositories && repositories.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[var(--color-accent)]">No repositories found</p>
          </div>
        )}

        {!selectedRepo && !repositoriesLoading && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[var(--color-accent)]">
              Please select a repository to see the latest workflow run.
            </p>
          </div>
        )}

        {selectedRepo && workflowsLoading && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[var(--color-accent)]">
              Loading latest workflow run...
            </p>
          </div>
        )}

        {selectedRepo && workflowsError && (
          <div className="flex h-full items-center justify-center">
            <p className="text-[var(--color-primary)]">
              Error loading workflow run
            </p>
          </div>
        )}

        {selectedRepo &&
          !workflowsLoading &&
          !workflowsError &&
          !latestWorkflow && (
            <div className="flex h-full items-center justify-center">
              <p className="text-[var(--color-accent)]">
                No workflow runs found
              </p>
            </div>
          )}

        {selectedRepo && latestWorkflow && (
          <div className="rounded-lg border border-[var(--color-accent)]/20 p-6 transition-all duration-200 hover:bg-[var(--color-bg)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--color-fg)]">
                {latestWorkflow.name}
              </h3>
              <span
                className={`rounded-lg border px-3 py-1 text-sm font-semibold ${
                  statusColors[latestWorkflow.status.toLowerCase()] ||
                  'border-gray-300/30 bg-gray-300/20 text-gray-300'
                }`}
              >
                {latestWorkflow.status.charAt(0).toUpperCase() +
                  latestWorkflow.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-[var(--color-fg)]">
                <span className="font-medium">Repository:</span> {selectedRepo}
              </div>

              <div className="text-sm text-[var(--color-fg)]">
                <span className="font-medium">Commit:</span>{' '}
                {latestWorkflow.html_url ? (
                  <a
                    href={latestWorkflow.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {latestWorkflow.head_sha.slice(0, 7)}
                  </a>
                ) : (
                  latestWorkflow.head_sha.slice(0, 7)
                )}
              </div>

              <div className="text-sm text-[var(--color-fg)]">
                <span className="font-medium">Branch:</span>{' '}
                {latestWorkflow.head_branch || 'N/A'}
              </div>

              <div className="text-sm text-[var(--color-accent)]">
                Last run: {timeSince(latestWorkflow.updated_at)}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GithubLatestWorkflowRun;
