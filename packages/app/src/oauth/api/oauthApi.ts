import { publicClient } from '../../lib/api/publicClient';
import { getConfig } from '../../lib/configs/getConfig';
import type {
  AuthFlowQueryParam,
  GithubAuthorizeUri,
} from '@dev-dashboard/shared';

const getGithubEndpoints = () => getConfig().API_GITHUB_ENDPOINTS;

export const fetchGithubOAuthLink = async (
  flow: AuthFlowQueryParam
): Promise<GithubAuthorizeUri> => {
  const response = await publicClient.get(
    `${getGithubEndpoints().authorize_link}?flow=${flow}`
  );
  return response.data;
};
