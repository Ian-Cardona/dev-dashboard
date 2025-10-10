import { NotFoundError } from '../utils/errors.utils';
import { OnboardingSessionData } from '@dev-dashboard/shared';
import type { Request, Response, NextFunction } from 'express';
import { redisClient } from 'src/config/redis';
import { bcryptCompare } from 'src/utils/bcrypt.utils';
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
        throw new NotFoundError('Invalid onboarding request');
      }
      if (onboardingData.email !== req.body.email) {
        throw new NotFoundError('Invalid onboarding request');
      }
      const password = req.body.password;
      if (!password) {
        throw new NotFoundError('Invalid onboarding request');
      }
      const isPasswordValid = await bcryptCompare(
        password,
        onboardingData.passwordHash
      );
      if (!isPasswordValid) {
        throw new NotFoundError('Invalid onboarding request');
      }
      try {
        await redisClient.del(key);
      } catch {
        //
      }
    } else if (onboardingData.registrationType === 'oauth') {
      if (
        !Array.isArray(onboardingData.providers) ||
        onboardingData.providers.length === 0
      ) {
        throw new NotFoundError('Invalid onboarding request');
      }
      const provider = req.body.provider;
      if (!provider) {
        throw new NotFoundError('Invalid onboarding request');
      }
      const providerExists = onboardingData.providers.some(
        p => p.provider === provider
      );
      if (!providerExists) {
        throw new NotFoundError('Invalid onboarding request');
      }
    } else {
      throw new NotFoundError('Unknown registration type in onboarding data');
    }

    next();
  } catch (err) {
    next(err);
  }
};
