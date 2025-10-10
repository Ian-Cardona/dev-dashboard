import { IOnboardingController } from './interfaces/ionboarding.controller';
import { IOnboardingService } from './interfaces/ionboarding.service';
import {
  onboardingEmailRegisterRequestSchema,
  OnboardingEmailRegisterRequestSchema,
} from '@dev-dashboard/shared';
import { Request, Response, NextFunction } from 'express';
import { handleValidationError } from 'src/utils/validation-error.utils';

const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60;

export const OnboardingController = (
  onboardingService: IOnboardingService
): IOnboardingController => {
  return {
    async initiateEmailOnboarding(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: OnboardingEmailRegisterRequestSchema =
          onboardingEmailRegisterRequestSchema.parse(req.body);
        const result =
          await onboardingService.initiateEmailOnboarding(validatedData);

        res.cookie('obt1', result.onboardingToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.status(201).json();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },
  };
};
