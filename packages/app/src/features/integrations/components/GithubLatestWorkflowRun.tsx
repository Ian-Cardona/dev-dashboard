import { timeSince } from '../../../utils/temporal/timeSince';
import useQueryFetchGithubWorkflow from '../hooks/useQueryFetchGithubWorkflow';
import useQueryFetchUserRepositories from '../hooks/useQueryFetchUserRepositories';
import { ErrorState } from './ErrorState';
import type {
  GithubRepository,
  GithubWorkflowResponse,
} from '@dev-dashboard/shared';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const GithubLatestWorkflowRun = () => {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>(null);

  const {
    data: repositories,
    isLoading: repositoriesLoading,
    isError: repositoriesError,
    error: repositoriesErrorData,
    refetch: refetchRepositories,
  } = useQueryFetchUserRepositories();

  const {
    data: workflows,
    isLoading: workflowsLoading,
    isError: workflowsError,
    error: workflowsErrorData,
    refetch: refetchWorkflows,
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

  const getStatusDisplay = (workflow: GithubWorkflowResponse | null) => {
    if (!workflow) return null;

    if (workflow.status === 'completed') {
      switch (workflow.conclusion) {
        case 'success':
          return {
            text: 'Success',
            icon: <CheckCircleIcon className="h-3.5 w-3.5" />,
            className: 'bg-green-500/10 text-green-500',
          };
        case 'failure':
          return {
            text: 'Failed',
            icon: <XCircleIcon className="h-3.5 w-3.5" />,
            className: 'bg-red-500/10 text-red-500',
          };
        case 'cancelled':
          return {
            text: 'Cancelled',
            icon: <XCircleIcon className="h-3.5 w-3.5" />,
            className: 'bg-gray-500/10 text-gray-500',
          };
        case 'timed_out':
          return {
            text: 'Timed Out',
            icon: <ClockIcon className="h-3.5 w-3.5" />,
            className: 'bg-orange-500/10 text-orange-500',
          };
        case 'action_required':
          return {
            text: 'Action Required',
            icon: <ClockIcon className="h-3.5 w-3.5" />,
            className: 'bg-purple-500/10 text-purple-500',
          };
        case 'neutral':
          return {
            text: 'Neutral',
            icon: <CheckCircleIcon className="h-3.5 w-3.5" />,
            className: 'bg-blue-500/10 text-blue-500',
          };
        default:
          return {
            text: 'Completed',
            icon: <CheckCircleIcon className="h-3.5 w-3.5" />,
            className: 'bg-blue-500/10 text-blue-500',
          };
      }
    }

    switch (workflow.status) {
      case 'in_progress':
        return {
          text: 'Running',
          icon: <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />,
          className: 'bg-yellow-500/10 text-yellow-500',
        };
      case 'queued':
        return {
          text: 'Queued',
          icon: <ClockIcon className="h-3.5 w-3.5" />,
          className: 'bg-blue-500/10 text-blue-500',
        };
      default:
        return {
          text: 'Unknown',
          icon: <ClockIcon className="h-3.5 w-3.5" />,
          className: 'bg-gray-500/10 text-gray-500',
        };
    }
  };

  const statusInfo = getStatusDisplay(latestWorkflow);

  if (repositoriesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="mx-auto h-12 w-12 animate-spin text-[var(--color-primary)]" />
          <div className="mt-4 text-lg font-semibold text-[var(--color-fg)]">
            Loading repositories
          </div>
          <div className="mt-2 text-sm text-[var(--color-accent)]">
            Please wait...
          </div>
        </div>
      </div>
    );
  }

  if (repositoriesError) {
    const isUnauthorized =
      repositoriesErrorData?.message?.includes('401') ||
      repositoriesErrorData?.message?.includes('unauthorized');

    return (
      <ErrorState
        message={
          repositoriesErrorData?.message ?? 'Failed to load repositories'
        }
        onRetry={refetchRepositories}
        isUnauthorized={isUnauthorized}
      />
    );
  }

  return (
    <div className="h-full">
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-[var(--color-fg)]">
          Latest Workflow Run
        </h3>
        <div className="relative">
          <select
            value={selectedRepo ?? ''}
            onChange={handleRepoChange}
            className="w-full cursor-pointer rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] px-4 py-3 text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-primary)]/40 focus:border-[var(--color-primary)] focus:outline-none"
          >
            {repositories?.map(repo => (
              <option key={repo.id} value={repo.name}>
                {repo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {workflowsLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <ArrowPathIcon className="mx-auto h-8 w-8 animate-spin text-[var(--color-primary)]" />
            <div className="mt-3 text-sm text-[var(--color-accent)]">
              Loading workflow data...
            </div>
          </div>
        </div>
      )}

      {workflowsError && (
        <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6">
          <ErrorState
            message={
              workflowsErrorData?.message ?? 'Failed to load workflow data'
            }
            onRetry={refetchWorkflows}
          />
        </div>
      )}

      {!workflowsLoading && !workflowsError && !latestWorkflow && (
        <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-8">
          <div className="text-center">
            <ClockIcon className="mx-auto h-12 w-12 text-[var(--color-accent)]" />
            <div className="mt-4 text-lg font-semibold text-[var(--color-fg)]">
              No workflows found
            </div>
            <div className="mt-2 text-sm text-[var(--color-accent)]">
              This repository doesn't have any workflow runs yet
            </div>
          </div>
        </div>
      )}

      {latestWorkflow && statusInfo && !workflowsLoading && (
        <div className="group rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:shadow-md">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-[var(--color-fg)]">
                {latestWorkflow.name}
              </h4>
              <p className="text-sm text-[var(--color-accent)]">
                #{latestWorkflow.id}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}
            >
              {statusInfo.icon}
              {statusInfo.text}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[var(--color-accent)]">Branch</p>
              <p className="text-sm font-medium text-[var(--color-fg)]">
                {latestWorkflow.head_branch}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-accent)]">Commit</p>
              <a
                href={latestWorkflow.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                {latestWorkflow.head_sha.slice(0, 7)}
              </a>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 border-t border-[var(--color-accent)]/10 pt-4 text-xs text-[var(--color-accent)]">
            <ClockIcon className="h-3.5 w-3.5" />
            <span className="font-medium">Last run:</span>
            <span>{timeSince(latestWorkflow.updated_at)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GithubLatestWorkflowRun;
