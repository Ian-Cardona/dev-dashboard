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

// import { fetchOAuthSessionById } from '../api/registerApi';
// import { useQuery } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router';

// const useQueryFetchOAuthSession = (sessionId: string | null) => {
//   const navigate = useNavigate();

//   const query = useQuery({
//     queryKey: ['oauthSession', sessionId],
//     queryFn: () => fetchOAuthSessionById(sessionId!),
//     enabled: !!sessionId,
//     staleTime: Infinity,
//   });

//   useEffect(() => {
//     if (query.isSuccess && sessionId) {
//       const targetUrl = `/register/onboarding?flow=oauth&session=${sessionId}`;
//       navigate(targetUrl);
//     }
//   }, [query.isSuccess, sessionId, navigate]);

//   useEffect(() => {
//     if (query.isError) {
//       console.error('OAuth session fetch failed:', query.error);
//     }
//   }, [query.isError, query.error]);

//   return query;
// };

// export default useQueryFetchOAuthSession;
