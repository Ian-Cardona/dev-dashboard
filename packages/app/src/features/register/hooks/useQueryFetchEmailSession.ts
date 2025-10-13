import { fetchEmailSessionById } from '../api/registerApi';
import { useQuery } from '@tanstack/react-query';

const useQueryFetchEmailSession = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['emailSession', sessionId],
    queryFn: () => fetchEmailSessionById(sessionId!),
    enabled: !!sessionId,
    staleTime: Infinity,
  });
};

export default useQueryFetchEmailSession;
