import { timeSince } from '../../../utils/temporal/timeSince';
import useQueryFetchGithubWorkflow from '../hooks/useQueryFetchGithubWorkflow';
import useQueryFetchUserRepositories from '../hooks/useQueryFetchUserRepositories';
import type {
  GithubRepository,
  GithubWorkflowResponse,
} from '@dev-dashboard/shared';
import { useState, useEffect } from 'react';

const statusColors: Record<string, string> = {
  success: 'bg-green-100 text-green-800',
  failure: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  queued: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
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
    <div className="flex min-w-full flex-col rounded-2xl border bg-[var(--color-surface)] lg:flex-1">
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-semibold">Latest Workflow Run</h2>
      </div>
      <div className="px-6 pb-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {repositoriesLoading && <p>Loading repositories...</p>}
        {repositoriesError && (
          <p className="text-red-600">Error loading repositories</p>
        )}
        {repositories && repositories.length > 0 && (
          <select
            value={selectedRepo ?? ''}
            onChange={handleRepoChange}
            className="mb-4 rounded-md border p-2"
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
        )}
        {repositories && repositories.length === 0 && (
          <p>No repositories found</p>
        )}

        {!selectedRepo && !repositoriesLoading && (
          <p>Please select a repository to see the latest workflow run.</p>
        )}
        {selectedRepo && workflowsLoading && (
          <p>Loading latest workflow run...</p>
        )}
        {selectedRepo && workflowsError && (
          <p className="text-red-600">Error loading workflow run</p>
        )}
        {selectedRepo &&
          !workflowsLoading &&
          !workflowsError &&
          !latestWorkflow && <p>No workflow runs found</p>}
        {selectedRepo && latestWorkflow && (
          <div className="mb-4 overflow-auto rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5">
            <p className="mb-1 text-sm text-[var(--color-muted)]">
              <span className="font-medium">{selectedRepo}</span>
            </p>
            <h3 className="mb-2 text-lg font-semibold">
              {latestWorkflow.name}
            </h3>
            <div className="mb-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                  statusColors[latestWorkflow.status.toLowerCase()] ||
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {latestWorkflow.status.charAt(0).toUpperCase() +
                  latestWorkflow.status.slice(1)}
              </span>
            </div>
            <p className="mb-1 text-sm text-[var(--color-muted)]">
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
            </p>
            <p className="mb-1 text-sm text-[var(--color-muted)]">
              <span className="font-medium">Branch:</span>{' '}
              {latestWorkflow.head_branch || 'N/A'}
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Last run: {timeSince(latestWorkflow.updated_at)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubLatestWorkflowRun;
