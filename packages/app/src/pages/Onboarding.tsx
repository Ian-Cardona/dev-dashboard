import OnboardingForm from '../features/register/components/onboarding/OnboardingForm';
import useQueryFetchEmailSession from '../features/register/hooks/useQueryFetchEmailSession';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

const OnboardingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session');

  const { data, isLoading, isError } = useQueryFetchEmailSession(sessionId);

  useEffect(() => {
    if (isError || !sessionId) {
      navigate('/register/invalid-link');
    }
  }, [isError, sessionId, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] text-white">
        <p>Loading your details...</p>
      </div>
    );
  }

  if (isError || !sessionId) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] p-12">
      {data && <OnboardingForm email={data.email} />}
    </div>
  );
};

export default OnboardingPage;
