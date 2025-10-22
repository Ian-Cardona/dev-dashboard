import { fetchGithubOAuthLink } from '../api/oauthApi';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchGithubOAuthLink = (flow: 'register' | 'login') => {
  return useQuery({
    queryKey: ['githubOAuthLink', flow],
    queryFn: () => fetchGithubOAuthLink(flow),
    staleTime: Infinity,
    enabled: false,
    retry: false,
  });
};

export default useQueryFetchGithubOAuthLink;
