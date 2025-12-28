import devDashboardLogo from '../../assets/devdb-logo.png';
import ErrorModal from '../../components/ui/modals/ErrorModal';
import RegisterForm from '../../features/register/components/register/RegisterForm';
import useQueryFetchOAuthSession from '../../features/register/hooks/useQueryFetchOAuthSession';
import { getRegInitCookieKeys } from '../../lib/configs/getConfig';
import { authQueryKeys, fetchAuth } from '../../lib/tanstack/auth';
import { useOAuthErrorFromCookie } from '../../oauth/hooks/useOauthErrorFromCookie';
import { getAndClearCookieValue } from '../../utils/document/getAndClearCookieValue';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

const RegisterPage = () => {
  const { error: modalErrorMessage } = Route.useSearch();
  const navigate = useNavigate();
  const oauthRegInitCookieKeys = getRegInitCookieKeys();
  const oauthErrorFromCookie = useOAuthErrorFromCookie();

  const [displayError, setDisplayError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const hasNavigated = useRef(false);

  const [sessionId] = useState(() => {
    return getAndClearCookieValue(`${oauthRegInitCookieKeys.registration_id}`);
  });

  const {
    data: oauthSession,
    isLoading: isLoadingSession,
    isSuccess,
  } = useQueryFetchOAuthSession(sessionId);

  useEffect(() => {
    if (modalErrorMessage) {
      setModalError(modalErrorMessage);
    }
  }, [modalErrorMessage]);

  const handleCloseModal = () => {
    setModalError(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  useEffect(() => {
    if (oauthErrorFromCookie) {
      setDisplayError(oauthErrorFromCookie);
    }
  }, [oauthErrorFromCookie]);

  useEffect(() => {
    console.log('DEBUG:', {
      oauthSession,
      isSuccess,
      isLoadingSession,
      oauthErrorFromCookie,
      sessionId,
    });

    if (
      isSuccess &&
      oauthSession &&
      !hasNavigated.current &&
      !oauthErrorFromCookie
    ) {
      console.log('Navigating to onboarding...');
      hasNavigated.current = true;

      if (sessionId) {
        localStorage.setItem('registration_session', sessionId);
      }

      navigate({
        to: '/register/onboarding',
        search: {
          flow: 'oauth',
          session: sessionId,
        },
      });
    }
  }, [oauthSession, isSuccess, oauthErrorFromCookie, navigate, sessionId]);
  if (isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--color-primary)]"></div>
          <p className="mt-4 text-[var(--color-fg)]">
            Loading registration session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {modalError && (
        <ErrorModal message={modalError} onClose={handleCloseModal} />
      )}
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <img
            src={devDashboardLogo}
            alt="DevDB Logo"
            className="h-6 w-6 object-contain"
          />
          <div>
            <h1
              className="text-lg font-semibold text-[var(--color-fg)]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              DevDashboard
            </h1>
          </div>
        </div>

        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl text-[var(--color-fg)]">
                Create your account
              </h1>
              <p className="text-base text-[var(--color-accent)]">
                Join DevDashboard to get started
              </p>
            </div>

            {displayError && (
              <div className="mb-6 rounded-lg border border-red-600/20 bg-red-600/10 p-4">
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <RegisterForm onError={setDisplayError} />
          </div>
        </div>
      </div>
    </>
  );
};

type RegisterSearch = {
  error?: string;
};

export const Route = createFileRoute('/register/')({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => {
    return {
      error: (search.error as string) || undefined,
    };
  },
  beforeLoad: async ({ context }) => {
    const cachedUser = context.queryClient.getQueryData(authQueryKeys.user());
    if (cachedUser) {
      console.log('User already cached, redirecting');
      throw redirect({ to: '/todos/pending' });
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No token found, showing login page');
      return;
    }

    const user = await fetchAuth();
    context.queryClient.setQueryData(authQueryKeys.user(), user);
    throw redirect({ to: '/todos/pending' });
  },
  component: RegisterPage,
});
