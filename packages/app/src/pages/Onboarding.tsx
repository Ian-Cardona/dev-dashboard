import OnboardingForm from '../features/register/components/onboarding/OnboardingForm';
import useQueryFetchEmailSession from '../features/register/hooks/useQueryFetchEmailSession';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

type OnboardingFlow = 'oauth' | 'email';

const OnboardingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const flow = searchParams.get('flow') as OnboardingFlow | null;
  const session = searchParams.get('session');

  const { data, isLoading, isError } = useQueryFetchEmailSession(
    flow === 'email' ? session : null
  );

  useEffect(() => {
    if (!flow || !['oauth', 'email'].includes(flow)) {
      navigate('/register/invalid-link');
      return;
    }

    if (flow === 'email' && (!session || isError)) {
      navigate('/register/invalid-link');
    }
  }, [flow, session, isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] text-white">
        <p>Loading your details...</p>
      </div>
    );
  }

  if (!flow || (flow === 'email' && (isError || !data))) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] p-12">
      {flow === 'oauth' && <OnboardingForm />}
      {flow === 'email' && data && <OnboardingForm email={data.email} />}
    </div>
  );
};

export default OnboardingPage;
