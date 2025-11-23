import useQueryFetchEmailSession from './useQueryFetchEmailSession';
import useQueryFetchOAuthSession from './useQueryFetchOAuthSession';
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

type OnboardingFlow = 'oauth' | 'email';

interface UseOnboardingSessionResult {
  isLoading: boolean;
  email?: string;
  flow: OnboardingFlow | null;
}

const useOnboardingSession = (): UseOnboardingSessionResult => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const flow = searchParams.get('flow') as OnboardingFlow | null;
  const session = searchParams.get('session');

  const isValidFlow = flow === 'email' || flow === 'oauth';
  const hasSession = !!session;

  const emailQuery = useQueryFetchEmailSession(
    isValidFlow && flow === 'email' && hasSession ? session : null
  );
  const oauthQuery = useQueryFetchOAuthSession(
    isValidFlow && flow === 'oauth' && hasSession ? session : null
  );

  const activeQuery = flow === 'email' ? emailQuery : oauthQuery;

  useEffect(() => {
    if (!isValidFlow || !hasSession || activeQuery.isError) {
      navigate('/register/invalid-link', { replace: true });
    }
  }, [isValidFlow, hasSession, activeQuery.isError, navigate]);

  return useMemo(
    () => ({
      isLoading: activeQuery.isLoading,
      email:
        flow === 'email' && activeQuery.data && 'email' in activeQuery.data
          ? activeQuery.data.email
          : undefined,
      flow,
    }),
    [activeQuery.isLoading, activeQuery.data, flow]
  );
};

export default useOnboardingSession;
