import OnboardingForm from '../features/register/components/onboarding/OnboardingForm';
import useOnboardingSession from '../features/register/hooks/useOnboardingSession';

const OnboardingPage = () => {
  const { isLoading, email, flow } = useOnboardingSession();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] text-white">
        <p>Loading user details...</p>
      </div>
    );
  }

  if (!flow) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg)] p-12">
      <OnboardingForm email={email} />
    </div>
  );
};

export default OnboardingPage;
