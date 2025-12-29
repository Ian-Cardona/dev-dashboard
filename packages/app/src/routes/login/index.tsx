import devDashboardLogo from '../../assets/devdb-logo.png';
import LoginForm from '../../features/login/components/LoginForm.tsx';
import { useMutateLoginOAuth } from '../../features/login/hooks/useMutateLoginOAuth.ts';
import { getOAuthSuccessCookieKeys } from '../../lib/configs/getConfig.ts';
import { authQueryKeys, fetchAuth } from '../../lib/tanstack/auth.ts';
import { getAndClearCookieValue } from '../../utils/document/getAndClearCookieValue.ts';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const OAUTH_ERROR_MESSAGES: { [key: string]: string } = {
  invalid_state:
    'Your session has expired or is invalid. Please try signing in again.',
  oauth_failed: 'Authentication with GitHub failed. Please try again.',
  user_not_found:
    'This GitHub account is not registered. Please sign up first.',
  default: 'An unknown error occurred during sign in. Please try again.',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { redirect: redirectUrl, error: errorCode } = Route.useSearch();

  const handleLoginSuccess = () => {
    navigate({ to: redirectUrl || '/todos/pending' });
  };

  const mutation = useMutateLoginOAuth();

  const oauthSuccessCookieKeys = getOAuthSuccessCookieKeys();

  const [displayError, setDisplayError] = useState<string | null>(null);
  const hasInitiated = useRef(false);
  const errorShownRef = useRef(false);

  useEffect(() => {
    if (errorCode && !errorShownRef.current) {
      const message =
        OAUTH_ERROR_MESSAGES[errorCode] || OAUTH_ERROR_MESSAGES.default;
      setDisplayError(message);
      errorShownRef.current = true;

      sessionStorage.setItem(`error_shown_${errorCode}`, 'true');

      navigate({
        to: '/login',
        search: redirectUrl ? { redirect: redirectUrl } : undefined,
        replace: true,
      });
    } else if (
      errorCode &&
      sessionStorage.getItem(`error_shown_${errorCode}`)
    ) {
      navigate({
        to: '/login',
        search: redirectUrl ? { redirect: redirectUrl } : undefined,
        replace: true,
      });
    }
  }, [errorCode, navigate, redirectUrl]);

  useEffect(() => {
    const provider = getAndClearCookieValue(oauthSuccessCookieKeys.provider);
    const id = getAndClearCookieValue(oauthSuccessCookieKeys.id);
    const login = getAndClearCookieValue(oauthSuccessCookieKeys.login);
    const enc = getAndClearCookieValue(oauthSuccessCookieKeys.enc);

    if (provider && id && login && !hasInitiated.current && enc) {
      mutation.mutate(
        {
          provider: provider as 'github',
          id,
          login,
          access_token: enc,
        },
        {
          onSuccess: () => {
            handleLoginSuccess();
          },
        }
      );
      hasInitiated.current = true;
    }
  }, [mutation, handleLoginSuccess]);

  const isLoading = mutation.isPending && hasInitiated.current;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        {isLoading ? (
          <>
            <Skeleton circle width={24} height={24} />
            <Skeleton width={120} height={20} />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            {isLoading ? (
              <Skeleton width={250} height={32} className="mx-auto mb-2" />
            ) : (
              <h1 className="mb-2 text-2xl text-[var(--color-fg)]">
                Sign in to DevDashboard
              </h1>
            )}
          </div>

          {displayError && !isLoading && (
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

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={48} />
              <Skeleton height={40} />
            </div>
          ) : (
            <LoginForm
              isLoginPending={isLoading}
              onError={setDisplayError}
              onSuccess={handleLoginSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

type LoginSearch = {
  redirect?: string;
  error?: string;
};

export const Route = createFileRoute('/login/')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
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
  component: LoginPage,
});
