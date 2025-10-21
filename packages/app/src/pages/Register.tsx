import RegisterForm from '../features/register/components/register/RegisterForm';
import RegisterInfoPanel from '../features/register/components/register/RegisterInfoPanel';
import { useMutateRegisterInitGithub } from '../features/register/hooks/useMutateRegisterInitGithub';
import { getAndClearCookieValue } from '../utils/document/getAndClearCookieValue.ts';
import { useEffect, useRef, useState } from 'react';

const COOKIE_KEY_ERROR = 'gh_o_e';
const COOKIE_KEY_PROVIDER = 'gh_o_p';
const COOKIE_KEY_ID = 'gh_o_i';
const COOKIE_KEY_LOGIN = 'gh_o_l';
const COOKIE_KEY_TOKEN = 'gh_o_t';

const RegisterPage = () => {
  const [cookieError, setCookieError] = useState<string | null>(null);

  const mutation = useMutateRegisterInitGithub();
  const hasTriggered = useRef(false);

  useEffect(() => {
    const error = getAndClearCookieValue(COOKIE_KEY_ERROR);
    const provider = getAndClearCookieValue(COOKIE_KEY_PROVIDER);
    const id = getAndClearCookieValue(COOKIE_KEY_ID);
    const login = getAndClearCookieValue(COOKIE_KEY_LOGIN);
    const token = getAndClearCookieValue(COOKIE_KEY_TOKEN);

    if (error) {
      setCookieError(error);
    }

    if (provider && id && login && token && !hasTriggered.current) {
      mutation.mutate({
        provider: provider as 'github',
        id,
        login,
      });
      hasTriggered.current = true;
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div className="hidden flex-1 p-8 lg:flex">
        <RegisterInfoPanel />
      </div>

      <div className="flex flex-1 items-center justify-center bg-[var(--color-surface)] p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-[var(--color-fg)]">
              Sign up
            </h1>
            <p className="text-base text-[var(--color-accent)]">
              Create your account to get started
            </p>
            {cookieError && (
              <div className="mt-4 rounded-md border border-red-500 p-3 text-sm">
                <p className="font-medium text-red-500">
                  {cookieError === 'oauth_failed'
                    ? 'GitHub registration failed — please try again or use another method.'
                    : 'Something went wrong. Please try again later.'}
                </p>
              </div>
            )}
          </div>
          <RegisterForm isRegisterPending={mutation.isPending} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
