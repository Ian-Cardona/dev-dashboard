import ErrorModal from '../components/ui/modals/ErrorModal.tsx';
import RegisterForm from '../features/register/components/register/RegisterForm';
import useQueryFetchOAuthSession from '../features/register/hooks/useQueryFetchOAuthSession';
import { useOAuthErrorFromCookie } from '../oauth/hooks/useOauthErrorFromCookie.ts';
import { getRegInitCookieKeys } from '../utils/configs/getConfig.ts';
import { getAndClearCookieValue } from '../utils/document/getAndClearCookieValue.ts';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const RegisterPage = () => {
  const location = useLocation();

  const modalErrorMessage = location.state?.error;

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
    window.history.replaceState({}, document.title);
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

export default RegisterPage;
