import { fetchOAuthSessionById } from '../api/registerApi';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchOAuthSession = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['oauthSession', sessionId],
    queryFn: () => fetchOAuthSessionById(sessionId!),
    enabled: !!sessionId,
    staleTime: Infinity,
    retry: false,
  });
};

export default useQueryFetchOAuthSession;
