import { fetchGithubUserRepositories } from '../api/integrationsApi';
import type { GithubRepository } from '@dev-dashboard/shared';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchGithubRepositories = () => {
  return useQuery<GithubRepository[]>({
    queryKey: ['github', 'repositories'],
    queryFn: fetchGithubUserRepositories,
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export default useQueryFetchGithubRepositories;
