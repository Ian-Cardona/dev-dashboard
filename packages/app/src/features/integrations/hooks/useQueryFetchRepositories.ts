import { fetchGithubRepositories } from '../api/integrationsApi';
import { useQuery } from '@tanstack/react-query';

export const useQueryFetchRepositories = (enabled = true) =>
  useQuery({
    queryKey: ['github', 'repositories'],
    queryFn: fetchGithubRepositories,
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
