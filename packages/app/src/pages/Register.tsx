import ErrorModal from '../components/ui/ErrorModal.tsx';
import RegisterForm from '../features/register/components/register/RegisterForm';
import RegisterInfoPanel from '../features/register/components/register/RegisterInfoPanel';
import { useMutateRegisterInitGithub } from '../features/register/hooks/useMutateRegisterInitGithub';
import { useOAuthErrorFromCookie } from '../oauth/hooks/useOauthErrorFromCookie.ts';
import { getAndClearCookieValue } from '../utils/document/getAndClearCookieValue.ts';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

const OAUTH_SUCCESS_COOKIE_KEYS = {
  provider: 'gh_o_p',
  id: 'gh_o_i',
  login: 'gh_o_l',
  access_token: 'gh_o_at',
};

const RegisterPage = () => {
  const location = useLocation();
  const modalErrorMessage = location.state?.error;

  const mutation = useMutateRegisterInitGithub();
  const oauthErrorFromCookie = useOAuthErrorFromCookie();

  const [displayError, setDisplayError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const hasInitiated = useRef(false);

  useEffect(() => {
    if (modalErrorMessage) {
      setModalError(modalErrorMessage);
    }
  }, [modalErrorMessage]);

  const handleCloseModal = () => {
    setModalError(null);
    window.history.replaceState({}, document.title);
  };

  useEffect(() => {
    if (oauthErrorFromCookie) {
      setDisplayError(oauthErrorFromCookie);
    }
  }, [oauthErrorFromCookie]);

  useEffect(() => {
    const provider = getAndClearCookieValue(OAUTH_SUCCESS_COOKIE_KEYS.provider);
    const id = getAndClearCookieValue(OAUTH_SUCCESS_COOKIE_KEYS.id);
    const login = getAndClearCookieValue(OAUTH_SUCCESS_COOKIE_KEYS.login);
    const accessToken = getAndClearCookieValue(
      OAUTH_SUCCESS_COOKIE_KEYS.access_token
    );

    if (oauthErrorFromCookie) {
      return;
    }

    if (provider && id && login && accessToken && !hasInitiated.current) {
      mutation.mutate({
        provider: provider as 'github',
        id,
        login,
        access_token: accessToken,
      });
      hasInitiated.current = true;
    }
  }, [mutation, oauthErrorFromCookie]);

  return (
    <>
      {modalError && (
        <ErrorModal message={modalError} onClose={handleCloseModal} />
      )}
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
              {displayError && (
                <div className="mt-4 rounded-md border border-red-500 p-3 text-sm">
                  <p className="font-medium text-red-500">{displayError}</p>
                </div>
              )}
            </div>
            <RegisterForm
              isRegisterPending={mutation.isPending}
              onError={setDisplayError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
