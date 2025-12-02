import useQueryFetchEmailSession from './useQueryFetchEmailSession';
import useQueryFetchOAuthSession from './useQueryFetchOAuthSession';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';

type OnboardingFlow = 'oauth' | 'email';

interface UseOnboardingSessionResult {
  isLoading: boolean;
  email?: string;
  flow: OnboardingFlow | null;
}

const useOnboardingSession = (): UseOnboardingSessionResult => {
  const search = useSearch({ from: '/register/onboarding' });
  const navigate = useNavigate();

  const flow = search.flow as OnboardingFlow | null;
  const session = search.session;

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
      navigate({ to: '/register', search: {} });
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
