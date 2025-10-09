import { NotFoundError } from '../utils/errors.utils';
import { OnboardingSessionData } from '@dev-dashboard/shared';
import type { Request, Response, NextFunction } from 'express';
import { redisGetJSON } from 'src/utils/redis';

export const onboardingSessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jti = req.onboarding?.jti;
    if (!jti) throw new NotFoundError('Missing onboarding reference');

    const key = `onboarding:${jti}`;

    const onboardingData = await redisGetJSON<OnboardingSessionData>(key);
    if (!onboardingData) {
      throw new NotFoundError('Onboarding data not found or expired');
    }

    if (onboardingData.registrationType === 'email') {
      if (
        typeof onboardingData.email !== 'string' ||
        onboardingData.email.trim() === ''
      ) {
        throw new NotFoundError(
          'Incomplete onboarding data: missing or invalid email'
        );
      }
      if (onboardingData.email !== req.body.email) {
        throw new NotFoundError('Email does not match onboarding data');
      }
    } else if (onboardingData.registrationType === 'oauth') {
      if (
        !Array.isArray(onboardingData.providers) ||
        onboardingData.providers.length === 0
      ) {
        throw new NotFoundError(
          'Incomplete onboarding data: missing or empty providers'
        );
      }
      const provider = req.body.provider;
      if (!provider) {
        throw new NotFoundError('Missing provider in request body');
      }
      if (!onboardingData.providers.includes(provider)) {
        throw new NotFoundError('Provider does not match onboarding data');
      }
    } else {
      throw new NotFoundError('Unknown registration type in onboarding data');
    }

    next();
  } catch (err) {
    next(err);
  }
};
