import useQueryFetchLatestWorkflow from '../hooks/useQueryFetchLatestWorkflow';
import useQueryFetchUserRepositories from '../hooks/useQueryFetchUserRepositories';
import type { GithubRepository, GithubWorkflow } from '@dev-dashboard/shared';
import React, { useState, useEffect } from 'react';

const timeSince = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label} ago`;
    }
  }
  return 'just now';
};

const statusColors: Record<string, string> = {
  success: 'bg-green-100 text-green-800',
  failure: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  queued: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
};

const LatestWorkflowRun = () => {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);

  const {
    data: repos,
    isLoading: reposLoading,
    isError: reposError,
  } = useQueryFetchUserRepositories();

  const {
    data: workflows,
    isLoading: workflowsLoading,
    isError: workflowsError,
  } = useQueryFetchLatestWorkflow(owner ?? '', selectedRepo ?? '');

  useEffect(() => {
    if (repos && repos.length > 0 && !selectedRepo) {
      setSelectedRepo(repos[0].name);
      setOwner(repos[0].owner.login);
    }
  }, [repos, selectedRepo]);

  const handleRepoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const repoName = event.target.value;
    const repo = repos?.find((r: GithubRepository) => r.name === repoName);
    if (repo) {
      setSelectedRepo(repo.name);
      setOwner(repo.owner.login);
    }
  };

  const latestWorkflow: GithubWorkflow | null =
    workflows && workflows.length > 0 ? workflows[0] : null;

  return (
    <section className="relative flex h-full flex-col rounded-4xl border bg-[var(--color-surface)] pt-8">
      <div className="mb-8 flex items-center justify-between px-8">
        <h2 className="text-3xl font-semibold">Latest Workflow Run</h2>
      </div>
      <div className="mb-6 px-8">
        {reposLoading && <p>Loading repositories...</p>}
        {reposError && (
          <p className="text-red-600">Error loading repositories</p>
        )}
        {repos && repos.length > 0 && (
          <select
            value={selectedRepo ?? ''}
            onChange={handleRepoChange}
            className="rounded-md border p-2"
          >
            <option value="" disabled>
              Select a repository
            </option>
            {repos.map((repo: GithubRepository) => (
              <option key={repo.id} value={repo.name}>
                {repo.name}
              </option>
            ))}
          </select>
        )}
        {repos && repos.length === 0 && <p>No repositories found</p>}
      </div>
      <div className="flex-1 overflow-hidden rounded-b-4xl px-8">
        <div className="flex h-full flex-col items-start justify-center overflow-y-auto">
          {!selectedRepo && !reposLoading && (
            <p>Please select a repository to see the latest workflow run.</p>
          )}
          {selectedRepo && workflowsLoading && (
            <div className="flex h-full w-full items-center justify-center">
              <p>Loading latest workflow run...</p>
            </div>
          )}
          {selectedRepo && workflowsError && (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-red-600">Error loading workflow run</p>
            </div>
          )}
          {selectedRepo &&
            !workflowsLoading &&
            !workflowsError &&
            !latestWorkflow && (
              <div className="flex h-full w-full items-center justify-center">
                <p>No workflow runs found</p>
              </div>
            )}
          {selectedRepo && latestWorkflow && (
            <div className="w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
              <p className="mb-2 text-sm text-gray-500">
                Repository: <span className="font-medium">{selectedRepo}</span>
              </p>
              <h3 className="mb-2 text-2xl font-semibold">
                {latestWorkflow.name}
              </h3>
              <div className="mb-4">
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
              <p className="mb-1 text-gray-700">
                <span className="font-medium">Commit:</span>{' '}
                {latestWorkflow.htmlUrl ? (
                  <a
                    href={latestWorkflow.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {latestWorkflow.headSha.slice(0, 7)}
                  </a>
                ) : (
                  latestWorkflow.headSha.slice(0, 7)
                )}
              </p>
              <p className="mb-4 text-gray-700">
                <span className="font-medium">Branch:</span>{' '}
                {latestWorkflow.headBranch || 'N/A'}
              </p>
              <p className="mb-6 text-sm text-gray-500">
                Last run: {timeSince(latestWorkflow.updatedAt)}
              </p>
              <button
                type="button"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                View Logs
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestWorkflowRun;
