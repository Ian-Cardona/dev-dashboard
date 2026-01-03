import devDashboardLogo from '../../assets/devdb-logo.png';
import OnboardingExtension from '../../features/register/components/onboarding/OnboardingExtension';
import OnboardingForm from '../../features/register/components/onboarding/OnboardingForm';
import useOnboardingSession from '../../features/register/hooks/useOnboardingSession';
import { authQueryKeys, fetchAuth } from '../../lib/tanstack/auth';
import { CodeBracketIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { createFileRoute, redirect } from '@tanstack/react-router';
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
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <img
          src={devDashboardLogo}
          alt="DevDB Logo"
          className="h-6 w-6 object-contain"
        />
        <div>
          <h1
            className="text-lg font-semibold text-[var(--color-fg)]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            DevDashboard
          </h1>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4 sm:p-8">
        <div className="mx-auto w-full max-w-3xl">
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
                          : 'border-[var(--color-accent)]/20 text-[var(--color-accent)]'
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

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl text-[var(--color-fg)]">
              Complete your setup
            </h1>
            <p className="text-base text-[var(--color-accent)]">
              {currentStep === 'vscode'
                ? 'Install the VS Code extension to get started'
                : 'Complete your profile to finish setup'}
            </p>
          </div>

          {currentStep === 'vscode' ? (
            <OnboardingExtension onNext={() => setCurrentStep('profile')} />
          ) : (
            <OnboardingForm email={email} />
          )}
        </div>
      </div>
    </div>
  );
};

type OnboardingSearch = {
  flow?: 'oauth' | 'email';
  session?: string;
};

export const Route = createFileRoute('/register/onboarding')({
  validateSearch: (search: Record<string, unknown>): OnboardingSearch => {
    return {
      flow: (search.flow as 'oauth' | 'email') || undefined,
      session: (search.session as string) || undefined,
    };
  },
  beforeLoad: async ({ context }) => {
    const cachedUser = context.queryClient.getQueryData(authQueryKeys.user());
    if (cachedUser) {
      throw redirect({ to: '/todos/pending' });
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const user = await fetchAuth();
        context.queryClient.setQueryData(authQueryKeys.user(), user);
        throw redirect({ to: '/todos/pending' });
      } catch {
        localStorage.removeItem('accessToken');
        context.queryClient.setQueryData(authQueryKeys.user(), null);
      }
    }
  },
  component: OnboardingPage,
});
