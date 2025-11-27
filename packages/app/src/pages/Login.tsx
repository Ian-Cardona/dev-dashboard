import LoginForm from '../features/login/components/LoginForm';
import { useMutateLoginOAuth } from '../features/login/hooks/useMutateLoginOAuth';
import { useOAuthErrorFromCookie } from '../oauth/hooks/useOauthErrorFromCookie.ts';
import { getOAuthSuccessCookieKeys } from '../utils/configs/getConfig.ts';
import { getAndClearCookieValue } from '../utils/document/getAndClearCookieValue';
import { useEffect, useRef, useState } from 'react';

const LoginPage = () => {
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
      mutation.mutate({
        provider: provider as 'github',
        id,
        login,
        access_token: enc,
      });
      hasInitiated.current = true;
    }
  }, [mutation, oauthErrorFromCookie]);

  const isLoading = mutation.isPending;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-lg font-bold text-white">
          DD
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-fg)]">
            DevDashboard
          </h1>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl text-[var(--color-fg)]">
              Sign in to DevDashboard
            </h1>
          </div>

          <div className="relative rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-6 sm:p-8 w-full min-w-80">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--color-surface)]/80">
                <div className="text-center">
                  <div className="mb-3 inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-accent)]/20 border-t-[var(--color-primary)]"></div>
                  <p className="text-sm text-[var(--color-accent)]">
                    Signing in...
                  </p>
                </div>
              </div>
            )}

            {displayError && !isLoading && (
              <div className="mb-4 rounded-lg border border-red-600/20 bg-red-600/10 p-3">
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <LoginForm isLoginPending={isLoading} onError={setDisplayError} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;