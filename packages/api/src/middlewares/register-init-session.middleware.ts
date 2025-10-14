import { NotFoundError } from '../utils/errors.utils';
import { RegisterInitSessionData } from '@dev-dashboard/shared';
import type { NextFunction, Request, Response } from 'express';
import { redisGetJSON } from 'src/utils/redis';

export const registerInitSessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jti = req.registerInit?.jti;
    if (!jti) throw new NotFoundError('Missing validation reference');

    const key = `register-init:${jti}`;

    const registerInitData = await redisGetJSON<RegisterInitSessionData>(key);
    if (!registerInitData) {
      throw new NotFoundError('Data not found or expired');
    }

    if (registerInitData.registrationType === 'email') {
      if (
        typeof registerInitData.email !== 'string' ||
        registerInitData.email.trim() === ''
      ) {
        throw new NotFoundError('Invalid registerInit request');
      }

      if (req.body.email !== registerInitData.email) {
        throw new NotFoundError('Email does not match registerInit data');
      }

      req.onboardingData = {
        email: registerInitData.email,
        passwordHash: registerInitData.passwordHash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };
    } else if (registerInitData.registrationType === 'oauth') {
      if (
        typeof registerInitData.providerUserId !== 'string' ||
        registerInitData.providerUserId.trim() === '' ||
        typeof registerInitData.providerUserLogin !== 'string' ||
        registerInitData.providerUserLogin.trim() === ''
      ) {
        throw new NotFoundError('Invalid registerInit request');
      } else if (req.body.providerUserId !== registerInitData.providerUserId) {
        throw new NotFoundError(
          'Provider user ID does not match registerInit data'
        );
      }
      // req.onboardingData = {
      //   providerUserId: registerInitData.providerUserId,
      //   providerUserLogin: registerInitData.providerUserLogin,
      //   firstName: req.body.firstName,
      //   lastName: req.body.lastName,
      // };
    } else {
      throw new NotFoundError('Unknown registration type in registerInit data');
    }

    next();
  } catch (err) {
    next(err);
  }
};
