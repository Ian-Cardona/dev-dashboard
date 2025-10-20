import { publicClient } from '../../lib/api';
import type { GithubAuthorizeUri } from '@dev-dashboard/shared';

export const fetchGithubOAuthLink = async (
  flow: 'register' | 'login'
): Promise<GithubAuthorizeUri> => {
  const response = await publicClient.get(`github/authorize/link?flow=${flow}`);
  return response.data;
};
