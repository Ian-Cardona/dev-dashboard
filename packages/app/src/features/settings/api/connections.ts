import { protectedClient } from '../../../lib/api/protectedClient';
import type { GithubProvider } from '@dev-dashboard/shared';

export const fetchProviders = async (): Promise<GithubProvider[]> => {
  const response = await protectedClient.get<GithubProvider[]>(
    '/user/profile/providers'
  );
  return response.data as GithubProvider[];
};
