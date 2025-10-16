import { fetchRegisterInitGithub } from '../api/registerApi';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchRegisterInitGithub = () => {
  return useQuery({
    queryKey: ['githubAuthLink'],
    queryFn: () => fetchRegisterInitGithub(),
    staleTime: Infinity,
  });
};

export default useQueryFetchRegisterInitGithub;
