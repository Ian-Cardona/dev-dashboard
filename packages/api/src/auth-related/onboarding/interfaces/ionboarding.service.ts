import { OnboardingEmailRegisterRequestSchema } from '@dev-dashboard/shared';

export interface IOnboardingService {
  initiateEmailOnboarding(
    data: OnboardingEmailRegisterRequestSchema
  ): Promise<{ onboardingToken: string }>;
}
