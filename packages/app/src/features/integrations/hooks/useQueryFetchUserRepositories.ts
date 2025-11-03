import { fetchGithubUserRepositories } from '../api/integrationsApi';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchUserRepositories = () => {
  return useQuery({
    queryKey: ['github', 'repositories'],
    queryFn: fetchGithubUserRepositories,
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export default useQueryFetchUserRepositories;
