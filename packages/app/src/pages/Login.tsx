import LoginForm from '../features/login/components/LoginForm';
import { useMutateLoginOAuth } from '../features/login/hooks/useMutateLoginOAuth';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

const LoginPage = () => {
  const [params] = useSearchParams();
  const provider = params.get('provider');
  const id = params.get('id');
  const login = params.get('login');

  const mutation = useMutateLoginOAuth();
  const hasTriggered = useRef(false);

  const isOAuthCallback = !!(provider && id && login);

  useEffect(() => {
    if (!isOAuthCallback) return;

    if (!hasTriggered.current) {
      mutation.mutate({
        provider: provider as 'github',
        id,
        login,
      });
      hasTriggered.current = true;
    }
  }, []);

  if (isOAuthCallback || mutation.isPending) {
    return (
      <div className="flex min-h-screen bg-[var(--color-bg)]">
        <div className="flex flex-1 items-center justify-center bg-[var(--color-surface)] p-8">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="pointer-events-none opacity-50">
                <LoginForm isLoginPending={true} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-accent)]/20 border-t-[var(--color-primary)]"></div>
                  <p className="text-[var(--color-accent)]">
                    Completing login...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div className="flex flex-1 items-center justify-center bg-[var(--color-surface)] p-8">
        <div className="w-full max-w-md">
          <LoginForm isLoginPending={mutation.isPending} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
