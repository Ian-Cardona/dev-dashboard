import { NotFoundError } from '../utils/errors.utils';
import { RegisterInitSessionData } from '@dev-dashboard/shared';
import type { Request, Response, NextFunction } from 'express';
import { redisClient } from 'src/config/redis';
import { bcryptCompare } from 'src/utils/bcrypt.utils';
import { redisGetJSON } from 'src/utils/redis';

export const registerInitSessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jti = req.registerInit?.jti;
    if (!jti) throw new NotFoundError('Missing validation reference');

    const key = `registerInit:${jti}`;

    const registerInitData = await redisGetJSON<RegisterInitSessionData>(key);
    console.log(registerInitData);
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
      if (registerInitData.email !== req.body.email) {
        throw new NotFoundError('Invalid registerInit request');
      }
      const password = req.body.password;
      if (!password) {
        throw new NotFoundError('Invalid registerInit request');
      }
      const isPasswordValid = await bcryptCompare(
        password,
        registerInitData.passwordHash
      );
      if (!isPasswordValid) {
        throw new NotFoundError('Invalid registerInit request');
      }
      try {
        await redisClient.del(key);
      } catch {
        //
      }
    } else if (registerInitData.registrationType === 'oauth') {
      if (
        !Array.isArray(registerInitData.providers) ||
        registerInitData.providers.length === 0
      ) {
        throw new NotFoundError('Invalid registerInit request');
      }
      const provider = req.body.provider;
      if (!provider) {
        throw new NotFoundError('Invalid registerInit request');
      }
      const providerExists = registerInitData.providers.some(
        p => p.provider === provider
      );
      if (!providerExists) {
        throw new NotFoundError('Invalid registerInit request');
      }
    } else {
      throw new NotFoundError('Unknown registration type in registerInit data');
    }

    next();
  } catch (err) {
    next(err);
  }
};
