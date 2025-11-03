import { protectedClient } from '../../../lib/api';

export const fetchGithubUserRepositories = async () => {
  const response = await protectedClient.get(
    '/integrations/github/user/repositories'
  );
  return response.data;
};

export const fetchGithubLatestWorkflow = async (
  owner: string,
  repository: string
) => {
  const response = await protectedClient.get(
    `/integrations/github/user/workflow/latest/${owner}/${repository}`
  );
  return response.data;
};
