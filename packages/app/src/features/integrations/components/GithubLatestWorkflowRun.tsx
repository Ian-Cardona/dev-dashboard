import { timeSince } from '../../../utils/temporal/timeSince';
import useQueryFetchGithubWorkflow from '../hooks/useQueryFetchGithubWorkflow';
import useQueryFetchUserRepositories from '../hooks/useQueryFetchUserRepositories';
import type {
  GithubRepository,
  GithubWorkflowResponse,
} from '@dev-dashboard/shared';
import { useState, useEffect } from 'react';

const statusColors: Record<string, string> = {
  success: 'bg-green-300/20 text-green-300',
  failure: 'bg-red-300/20 text-red-300',
  cancelled: 'bg-gray-300/20 text-gray-300',
  in_progress: 'bg-yellow-300/20 text-yellow-300',
  queued: 'bg-blue-300/20 text-blue-300',
  neutral: 'bg-gray-300/20 text-gray-300',
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
    <div className="h-full">
      {repositoriesLoading && (
        <div className="flex h-full items-center justify-center">
          <p className="text-[var(--color-accent)]">Loading repositories...</p>
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
          <div className="relative">
            <select
              value={selectedRepo ?? ''}
              onChange={handleRepoChange}
              className="w-full appearance-none rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-4 py-3 pr-10 text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-accent)]/40 focus:border-[var(--color-primary)] focus:outline-none"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--color-fg)]">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
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
            <p className="text-[var(--color-accent)]">No workflow runs found</p>
          </div>
        )}

      {selectedRepo && latestWorkflow && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--color-fg)]">
              {latestWorkflow.name}
            </h3>
            <span
              className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                statusColors[latestWorkflow.status.toLowerCase()] ||
                'bg-gray-300/20 text-gray-300'
              }`}
            >
              {latestWorkflow.status.charAt(0).toUpperCase() +
                latestWorkflow.status.slice(1)}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="text-[var(--color-fg)]">
              <span className="font-medium">Repository:</span> {selectedRepo}
            </div>

            <div className="text-[var(--color-fg)]">
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

            <div className="text-[var(--color-fg)]">
              <span className="font-medium">Branch:</span>{' '}
              {latestWorkflow.head_branch || 'N/A'}
            </div>

            <div className="text-[var(--color-accent)]">
              Last run: {timeSince(latestWorkflow.updated_at)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GithubLatestWorkflowRun;
