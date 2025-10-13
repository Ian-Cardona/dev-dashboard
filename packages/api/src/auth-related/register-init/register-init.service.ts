import { IRegisterInitService } from './interfaces/iregister-init.service';
import {
  RegisterInitEmailRegisterRequest,
  RegisterInitSessionData,
} from '@dev-dashboard/shared';
import bcrypt from 'bcryptjs';
import { RedisClientType } from 'redis';
import { ENV } from 'src/config/env_variables';
import { IUserService } from 'src/user/interfaces/iuser.service';
import { ConflictError } from 'src/utils/errors.utils';
import { generateRegisterInitJWT } from 'src/utils/jwt.utils';
import { generateUUID } from 'src/utils/uuid.utils';

const REGISTER_INIT_TTL = 3600;
const REDIS_AUTH_PREFIX = 'register-init:';
const REDIS_EMAIL_PREFIX = 'onboarding:email:';

export const RegisterInitService = (
  redisClient: RedisClientType,
  userService: IUserService
): IRegisterInitService => {
  return {
    async getEmailSession(emailSessionId: string): Promise<string | null> {
      try {
        const key = `${REDIS_EMAIL_PREFIX}${emailSessionId}`;
        const result = await redisClient.get(key);
        if (!result) return null;

        const data = JSON.parse(result);
        return data.email || null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        throw new Error('Failed to retrieve email session');
      }
    },
    async email(
      data: RegisterInitEmailRegisterRequest
    ): Promise<{ registerInitToken: string; emailSessionId: string }> {
      const emailAlreadyExists = await userService.emailExists(data.email);
      if (emailAlreadyExists) {
        throw new ConflictError('User already exists');
      }

      const salt = await bcrypt.genSalt(Number(ENV.BCRYPT_SALT_ROUNDS_PW));
      const passwordHash = await bcrypt.hash(data.password, salt);

      const registerInitJti = generateUUID();
      const emailSessionId = generateUUID();

      const sessionData: RegisterInitSessionData = {
        registrationType: 'email',
        email: data.email,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      await redisClient.set(
        `${REDIS_AUTH_PREFIX}${registerInitJti}`,
        JSON.stringify(sessionData),
        { EX: REGISTER_INIT_TTL }
      );

      await redisClient.set(
        `${REDIS_EMAIL_PREFIX}${emailSessionId}`,
        JSON.stringify({ email: data.email, createdAt: Date.now() }),
        { EX: REGISTER_INIT_TTL }
      );

      const registerInitToken = generateRegisterInitJWT({
        jti: registerInitJti,
        type: 'register-init',
      });

      return { registerInitToken, emailSessionId: emailSessionId };
    },

    // async initiateOAuthRegisterInit(
    //   data: RegisterInitOAuthRegisterRequestSchema
    // ): Promise<{ registerInitToken: string }> {
    //   const providerAlreadyExists = await userService.providerExists(
    //     data.providers[0].provider,
    //     data.providers[0].providerUserId
    //   );
    //   if (providerAlreadyExists) {
    //     throw new ConflictError('User with this provider already exists');
    //   }

    //   const jti = crypto.randomUUID();

    //   const sessionData: RegisterInitSessionData = {
    //     registrationType: 'oauth',
    //     providers: data.providers,
    //     createdAt: new Date().toISOString(),
    //   };

    //   await redisClient.set(
    //     `${REDIS_AUTH_PREFIX}${jti}`,
    //     JSON.stringify(sessionData),
    //     { EX: ONBOARDING_TTL }
    //   );

    //   const registerInitToken = generateRegisterInitJWT({
    //     jti,
    //     type: 'registerInit',
    //   });

    //   return { registerInitToken };
    // },
  };
};
