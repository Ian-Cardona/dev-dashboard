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
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div className="flex flex-1 items-center justify-center bg-[var(--color-surface)] p-8">
        <div className="relative w-full max-w-md">
          {isLoading && (
            <div className="bg-opacity-80 absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--color-surface)] backdrop-blur-sm">
              <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-accent)]/20 border-t-[var(--color-primary)]"></div>
                <p className="text-[var(--color-accent)]">
                  Completing login...
                </p>
              </div>
            </div>
          )}

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-[var(--color-fg)]">
              Login
            </h1>
            <p className="text-base text-[var(--color-accent)]">
              Welcome to DevDashboard
            </p>
            {displayError && !isLoading && (
              <div className="mt-4 rounded-md border border-red-500 p-3 text-sm">
                <p className="font-medium text-red-500">{displayError}</p>
              </div>
            )}
          </div>

          <LoginForm isLoginPending={isLoading} onError={setDisplayError} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
