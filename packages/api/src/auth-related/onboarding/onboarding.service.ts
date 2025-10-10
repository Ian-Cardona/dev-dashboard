import {
  OnboardingEmailRegisterRequestSchema,
  OnboardingSessionData,
} from '@dev-dashboard/shared';
import bcrypt from 'bcryptjs';
import { RedisClientType } from 'redis';
import { ENV } from 'src/config/env_variables';
import { IUserService } from 'src/user/interfaces/iuser.service';
import { ConflictError } from 'src/utils/errors.utils';
import { generateOnboardingJWT } from 'src/utils/jwt.utils';

const ONBOARDING_TTL = 3600;
const REDIS_PREFIX = 'onboarding:';

export const OnboardingService = (
  redisClient: RedisClientType,
  userService: IUserService
) => {
  return {
    async initiateEmailOnboarding(
      data: OnboardingEmailRegisterRequestSchema
    ): Promise<{ onboardingToken: string }> {
      const emailAlreadyExists = await userService.emailExists(data.email);
      if (emailAlreadyExists) {
        throw new ConflictError('User already exists');
      }

      const salt = await bcrypt.genSalt(Number(ENV.BCRYPT_SALT_ROUNDS_PW));
      const passwordHash = await bcrypt.hash(data.password, salt);

      const jti = crypto.randomUUID();

      const sessionData: OnboardingSessionData = {
        registrationType: 'email',
        email: data.email,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      await redisClient.set(
        `${REDIS_PREFIX}${jti}`,
        JSON.stringify(sessionData),
        { EX: ONBOARDING_TTL }
      );

      const onboardingToken = generateOnboardingJWT({
        jti,
        type: 'onboarding',
      });

      return { onboardingToken };
    },

    // async initiateOAuthOnboarding(
    //   data: OnboardingOAuthRegisterRequestSchema
    // ): Promise<{ onboardingToken: string }> {
    //   const providerAlreadyExists = await userService.providerExists(
    //     data.providers[0].provider,
    //     data.providers[0].providerUserId
    //   );
    //   if (providerAlreadyExists) {
    //     throw new ConflictError('User with this provider already exists');
    //   }

    //   const jti = crypto.randomUUID();

    //   const sessionData: OnboardingSessionData = {
    //     registrationType: 'oauth',
    //     providers: data.providers,
    //     createdAt: new Date().toISOString(),
    //   };

    //   await redisClient.set(
    //     `${REDIS_PREFIX}${jti}`,
    //     JSON.stringify(sessionData),
    //     { EX: ONBOARDING_TTL }
    //   );

    //   const onboardingToken = generateOnboardingJWT({
    //     jti,
    //     type: 'onboarding',
    //   });

    //   return { onboardingToken };
    // },
  };
};
