import { protectedClient } from '../../../lib/api';

export const fetchGithubRepositories = async () => {
  const response = await protectedClient.get(
    '/integrations/github/user/repositories'
  );
  return response.data;
};
