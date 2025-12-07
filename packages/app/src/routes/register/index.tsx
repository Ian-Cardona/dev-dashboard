import ErrorModal from '../../components/ui/modals/ErrorModal';
import RegisterForm from '../../features/register/components/register/RegisterForm';
import useQueryFetchOAuthSession from '../../features/register/hooks/useQueryFetchOAuthSession';
import { getRegInitCookieKeys } from '../../lib/configs/getConfig';
import { authQueryKeys, fetchAuth } from '../../lib/tanstack/auth';
import { useOAuthErrorFromCookie } from '../../oauth/hooks/useOauthErrorFromCookie';
import { getAndClearCookieValue } from '../../utils/document/getAndClearCookieValue';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import devDashboardLogo from '../../assets/devdb-logo.png';

const RegisterPage = () => {
  const { error: modalErrorMessage } = Route.useSearch();

  const oauthRegInitCookieKeys = getRegInitCookieKeys();
  const oauthErrorFromCookie = useOAuthErrorFromCookie();

  const [displayError, setDisplayError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>();

  const [sessionId] = useState(() =>
    getAndClearCookieValue(`${oauthRegInitCookieKeys.registration_id}`)
  );

  useQueryFetchOAuthSession(sessionId);

  useEffect(() => {
    if (modalErrorMessage) {
      setModalError(modalErrorMessage);
    }
  }, [modalErrorMessage]);

  const handleCloseModal = () => {
    setModalError(null);
    // Clear the search params instead of replaceState
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  useEffect(() => {
    if (oauthErrorFromCookie) {
      setDisplayError(oauthErrorFromCookie);
    }
  }, [oauthErrorFromCookie]);

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
            <h1 className="text-lg font-bold text-[var(--color-fg)]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              DevDashboard
            </h1>
          </div>
        </div>

        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-8">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl text-[var(--color-fg)]">
                Create your account
              </h1>
              <p className="text-base text-[var(--color-accent)]">
                Join DevDashboard to get started
              </p>
            </div>

            <div className="relative w-full min-w-80 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 sm:p-8">
              {displayError && (
                <div className="mb-4 rounded-lg border border-red-600/20 bg-red-600/10 p-3">
                  <p className="text-sm text-red-600">{displayError}</p>
                </div>
              )}

              <RegisterForm onError={setDisplayError} />
            </div>
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