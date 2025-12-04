import { fetchGithubOAuthLink } from '../api/oauthApi';
import type { AuthFlowQueryParam } from '@dev-dashboard/shared';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchGithubOAuthLink = (flow: AuthFlowQueryParam) => {
  return useQuery({
    queryKey: ['githubOAuthLink', flow],
    queryFn: () => fetchGithubOAuthLink(flow),
    staleTime: Infinity,
    enabled: false,
    retry: false,
  });
};

export default useQueryFetchGithubOAuthLink;
