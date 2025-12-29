import devDashboardLogo from '../../assets/devdb-logo.png';
import ErrorModal from '../../components/ui/modals/ErrorModal';
import { LoadingLayout } from '../../components/ui/modals/LoadingLayout';
import RegisterForm from '../../features/register/components/register/RegisterForm';
import useQueryFetchOAuthSession from '../../features/register/hooks/useQueryFetchOAuthSession';
import { getRegInitCookieKeys } from '../../lib/configs/getConfig';
import { authQueryKeys, fetchAuth } from '../../lib/tanstack/auth';
import { getAndClearCookieValue } from '../../utils/document/getAndClearCookieValue';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

const OAUTH_ERROR_MESSAGES: { [key: string]: string } = {
  invalid_state:
    'Your session has expired or is invalid. Please try signing up again.',
  oauth_failed: 'Authentication with GitHub failed. Please try again.',
  conflict:
    'This GitHub account is already linked to an existing user. Please log in.',
  user_not_found:
    'This GitHub account is not registered. Please complete the sign-up.',
  default: 'An unknown error occurred during GitHub sign-up. Please try again.',
};

const RegisterPage = () => {
  const { error: errorCode } = Route.useSearch();
  const navigate = useNavigate();
  const oauthRegInitCookieKeys = getRegInitCookieKeys();

  const [displayError, setDisplayError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const hasNavigated = useRef(false);
  const errorShownRef = useRef(false);

  const [sessionId] = useState(() => {
    return getAndClearCookieValue(`${oauthRegInitCookieKeys.registration_id}`);
  });

  const { isLoading: isLoadingSession, isSuccess } =
    useQueryFetchOAuthSession(sessionId);

  useEffect(() => {
    if (errorCode && !errorShownRef.current) {
      const message =
        OAUTH_ERROR_MESSAGES[errorCode] || OAUTH_ERROR_MESSAGES.default;
      setDisplayError(message);
      errorShownRef.current = true;

      sessionStorage.setItem(`error_shown_${errorCode}`, 'true');

      navigate({
        to: '/register',
        replace: true,
      });
    } else if (
      errorCode &&
      sessionStorage.getItem(`error_shown_${errorCode}`)
    ) {
      navigate({
        to: '/register',
        replace: true,
      });
    }
  }, [errorCode, navigate]);

  const handleCloseModal = () => {
    setModalError(null);
  };

  useEffect(() => {
    if (isSuccess && !hasNavigated.current && sessionId) {
      hasNavigated.current = true;

      localStorage.setItem('reginId', sessionId);

      navigate({
        to: '/register/onboarding',
        search: {
          flow: 'oauth',
          session: sessionId,
        },
      });
    }
  }, [isSuccess, navigate, sessionId]);

  return (
    <>
      {modalError && (
        <ErrorModal message={modalError} onClose={handleCloseModal} />
      )}

      {isLoadingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-sm">
          <LoadingLayout />
        </div>
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
              <div className="relative mb-6 rounded-lg border border-red-600/20 bg-red-600/10 p-4">
                <button
                  onClick={() => setDisplayError(null)}
                  className="absolute top-2 right-2 text-red-600 transition-colors hover:text-red-700"
                  aria-label="Close error"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <p className="pr-6 text-sm text-red-600">{displayError}</p>
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
      throw redirect({ to: '/todos/pending' });
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const user = await fetchAuth();
    context.queryClient.setQueryData(authQueryKeys.user(), user);
    throw redirect({ to: '/todos/pending' });
  },
  component: RegisterPage,
});
