import { protectedClient } from '../../../lib/api/protectedClient';
import type {
  GithubRepository,
  GithubWorkflowResponse,
  GithubNotificationResponse,
} from '@dev-dashboard/shared';

export const fetchGithubUserRepositories = async (): Promise<
  GithubRepository[]
> => {
  const response = await protectedClient.get(
    '/integrations/github/user/repositories'
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch GitHub repositories: ${response.status}`);
  }

  return response.data;
};

export const fetchGithubWorkflow = async (
  owner: string,
  repository: string
): Promise<GithubWorkflowResponse> => {
  console.log('Fetching GitHub workflow for', owner, repository);
  if (!owner || owner.trim() === '') {
    throw new Error('Valid owner is required');
  }

  if (!repository || repository.trim() === '') {
    throw new Error('Valid repository is required');
  }

  const response = await protectedClient.get(
    `/integrations/github/user/workflow/latest/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch GitHub workflow: ${response.status}`);
  }

  return response.data;
};

export const fetchGithubNotifications = async (): Promise<
  GithubNotificationResponse[]
> => {
  const response = await protectedClient.get(
    '/integrations/github/user/notifications'
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch GitHub notifications: ${response.status}`);
  }

  return response.data;
};
