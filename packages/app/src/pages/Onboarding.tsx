import OnboardingExtension from '../features/register/components/onboarding/OnboardingExtension';
import OnboardingForm from '../features/register/components/onboarding/OnboardingForm';
import useOnboardingSession from '../features/register/hooks/useOnboardingSession';
import { CodeBracketIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type OnboardingStep = 'vscode' | 'profile';

const OnboardingPage = () => {
  const { isLoading, email, flow } = useOnboardingSession();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('vscode');

  const steps = [
    { id: 'vscode', icon: CodeBracketIcon },
    { id: 'profile', icon: UserCircleIcon },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center">
          <div className="mb-4 inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-accent)]/20 border-t-[var(--color-primary)]"></div>
          <p className="text-sm text-[var(--color-accent)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!flow) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      index <= currentStepIndex
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                        : 'border-[var(--color-accent)]/20 bg-[var(--color-surface)] text-[var(--color-accent)]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 w-24 transition-all ${
                        index < currentStepIndex
                          ? 'bg-[var(--color-primary)]'
                          : 'bg-[var(--color-accent)]/20'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {currentStep === 'vscode' ? (
          <OnboardingExtension onNext={() => setCurrentStep('profile')} />
        ) : (
          <OnboardingForm email={email} />
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
