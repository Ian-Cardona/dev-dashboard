import LoginForm from '../../features/login/components/LoginForm.tsx';
import { useMutateLoginOAuth } from '../../features/login/hooks/useMutateLoginOAuth.ts';
import { getOAuthSuccessCookieKeys } from '../../lib/configs/getConfig.ts';
import { authQueryKeys, fetchAuth } from '../../lib/tanstack/auth.ts';
import { useOAuthErrorFromCookie } from '../../oauth/hooks/useOauthErrorFromCookie.ts';
import { getAndClearCookieValue } from '../../utils/document/getAndClearCookieValue.ts';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import devDashboardLogo from '../../assets/devdb-logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { redirect: redirectUrl } = Route.useSearch();

  const handleLoginSuccess = () => {
    navigate({ to: redirectUrl || '/todos/pending' });
  };

  const mutation = useMutateLoginOAuth();

  const oauthSuccessCookieKeys = getOAuthSuccessCookieKeys();
  const oauthErrorFromCookie = useOAuthErrorFromCookie();

  const [displayError, setDisplayError] = useState<string | null>(null);

  const hasInitiated = useRef(false);

  useEffect(() => {
    if (oauthErrorFromCookie) {
      setDisplayError(oauthErrorFromCookie);
    }
  }, [oauthErrorFromCookie]);

  useEffect(() => {
    const provider = getAndClearCookieValue(oauthSuccessCookieKeys.provider);
    const id = getAndClearCookieValue(oauthSuccessCookieKeys.id);
    const login = getAndClearCookieValue(oauthSuccessCookieKeys.login);
    const enc = getAndClearCookieValue(oauthSuccessCookieKeys.enc);

    if (oauthErrorFromCookie) {
      return;
    }

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
  }, [mutation, oauthErrorFromCookie, handleLoginSuccess]);

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
              <h1 className="text-lg font-bold text-[var(--color-fg)]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                DevDashboard
              </h1>
            </div>
          </>
        )}
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 text-center">
            {isLoading ? (
              <Skeleton width={250} height={32} className="mx-auto mb-2" />
            ) : (
              <h1 className="mb-2 text-2xl text-[var(--color-fg)]">
                Sign in to DevDashboard
              </h1>
            )}
          </div>

          <div className="relative w-full min-w-80 rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 sm:p-8">
            {displayError && !isLoading && (
              <div className="mb-4 rounded-lg border border-red-600/20 bg-red-600/10 p-3">
                <p className="text-sm text-red-600">{displayError}</p>
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
    </div>
  );
};

type LoginSearch = {
  redirect?: string;
};
export const Route = createFileRoute('/login/')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
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