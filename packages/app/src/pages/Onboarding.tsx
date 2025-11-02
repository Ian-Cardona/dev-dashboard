import OnboardingForm from '../features/register/components/onboarding/OnboardingForm';
import useQueryFetchEmailSession from '../features/register/hooks/useQueryFetchEmailSession';
import useQueryFetchOAuthSession from '../features/register/hooks/useQueryFetchOAuthSession';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

type OnboardingFlow = 'oauth' | 'email';

const OnboardingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const flow = searchParams.get('flow') as OnboardingFlow | null;
  const session = searchParams.get('session');

  const {
    data: emailData,
    isLoading: isEmailLoading,
    isError: isEmailError,
  } = useQueryFetchEmailSession(flow === 'email' ? session : null);

  const {
    data: oauthData,
    isLoading: isOAuthLoading,
    isError: isOAuthError,
  } = useQueryFetchOAuthSession(flow === 'oauth' && session ? session : '');

  useEffect(() => {
    if (!flow || !['oauth', 'email'].includes(flow)) {
      navigate('/register/invalid-link');
      return;
    }

    if (!session) {
      navigate('/register/invalid-link');
      return;
    }

    if (flow === 'email' && isEmailError) {
      navigate('/register/invalid-link');
      return;
    }

    if (flow === 'oauth' && isOAuthError) {
      navigate('/register/invalid-link');
      return;
    }
  }, [flow, session, isEmailError, isOAuthError, navigate]);

  const isLoading = flow === 'email' ? isEmailLoading : isOAuthLoading;
  const isError = flow === 'email' ? isEmailError : isOAuthError;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] text-white">
        <p>Loading your details...</p>
      </div>
    );
  }

  if (
    !flow ||
    !session ||
    isError ||
    (flow === 'email' && !emailData) ||
    (flow === 'oauth' && !oauthData)
  ) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] p-12">
      {flow === 'oauth' && oauthData && <OnboardingForm />}
      {flow === 'email' && emailData && (
        <OnboardingForm email={emailData.email} />
      )}
    </div>
  );
};

export default OnboardingPage;
