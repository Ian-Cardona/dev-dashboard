import { IRegisterInitService } from './interfaces/iregister-init.service';
import {
  OAuthRequest,
  RegisterInitEmailRequest,
  RegistrationJti,
  RegistrationSession,
  UserPublic,
} from '@dev-dashboard/shared';
import { RedisClientType } from 'redis';
import { ENV } from 'src/config/env';
import { IUserService } from 'src/user/interfaces/iuser.service';
import { bcryptGen } from 'src/utils/bcrypt.utils';
import { encrypt } from 'src/utils/crypto.utils';
import { ConflictError, NotFoundError } from 'src/utils/errors.utils';
import { generateRegisterInitJWT } from 'src/utils/jwt.utils';
import { redisGetJSON, redisSetJSON } from 'src/utils/redis';
import { generateUUID } from 'src/utils/uuid.utils';

const REGISTER_INIT_TTL = 3600;
const REDIS_AUTH_PREFIX = 'register-init:';
const REDIS_EMAIL_PREFIX = 'onboarding:email:';
const REDIS_OAUTH_PREFIX = 'onboarding:oauth:';

const MODULE_NAME = 'RegisterInitService';

export const RegisterInitService = (
  redisClient: RedisClientType,
  userService: IUserService
): IRegisterInitService => {
  return {
    async getEmailSession(sessionId: string): Promise<string | null> {
      try {
        const key = `${REDIS_EMAIL_PREFIX}${sessionId}`;
        const result = await redisGetJSON<{ email: string; createdAt: number }>(
          key
        );

        if (!result) return null;

        const email = result.email || null;
        console.log('Retrieved email session:', email);
        return email;
      } catch (error) {
        console.log(error);
        throw new Error('Failed to retrieve email session');
      }
    },

    async getOAuthSession(sessionId: string): Promise<number | null> {
      try {
        const key = `${REDIS_OAUTH_PREFIX}${sessionId}`;
        const result = await redisGetJSON<{ createdAt: number }>(key);
        if (!result) return null;

        return result.createdAt ? result.createdAt : null;
      } catch (error) {
        console.log(error);
        throw new Error('Failed to retrieve email session');
      }
    },

    async email(data: RegisterInitEmailRequest): Promise<RegistrationSession> {
      const emailAlreadyExists = await userService.emailExists(data.email);
      if (emailAlreadyExists) {
        throw new ConflictError('User already exists');
      }

      const saltRounds = Number(ENV.BCRYPT_SALT_ROUNDS_PW);
      if (!saltRounds || isNaN(saltRounds)) {
        throw new Error(
          `[${MODULE_NAME}] Invalid bcrypt salt rounds configuration`
        );
      }

      const passwordHash = await bcryptGen(data.password, saltRounds);

      const registrationJti = generateUUID();
      const registrationId = generateUUID();

      const registrationJtiData: RegistrationJti = {
        registrationType: 'email',
        email: data.email,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      await redisSetJSON(
        `${REDIS_AUTH_PREFIX}${registrationJti}`,
        registrationJtiData,
        REGISTER_INIT_TTL
      );

      await redisSetJSON(
        `${REDIS_EMAIL_PREFIX}${registrationId}`,
        { email: data.email, createdAt: Date.now() },
        REGISTER_INIT_TTL
      );

      const registrationToken = generateRegisterInitJWT({
        jti: registrationJti,
        type: 'register-init',
      });

      return {
        registrationToken,
        registrationId,
      } as RegistrationSession;
    },

    async github(data: OAuthRequest): Promise<RegistrationSession> {
      try {
        let userProvider: UserPublic | null = null;

        try {
          userProvider = await userService.findByProvider(
            data.provider,
            data.id.toString()
          );
        } catch (err) {
          if (err instanceof NotFoundError) {
            userProvider = null;
          } else {
            throw err;
          }
        }

        const providerExists = !!userProvider;

        if (providerExists) {
          throw new ConflictError('User with this provider already exists');
        }

        const encryptedAccessToken = encrypt(data.access_token);

        const registrationJti = generateUUID();
        const registrationId = generateUUID();

        const registrationJtiData: RegistrationJti = {
          registrationType: 'oauth',
          provider: data.provider,
          providerUserId: data.id.toString(),
          providerUserLogin: data.login,
          providerAccessTokenEncrypted: encryptedAccessToken,
          createdAt: new Date().toISOString(),
        };

        await redisSetJSON(
          `${REDIS_AUTH_PREFIX}${registrationJti}`,
          registrationJtiData,
          REGISTER_INIT_TTL
        );

        await redisSetJSON(
          `${REDIS_OAUTH_PREFIX}${registrationId}`,
          { createdAt: Date.now() },
          REGISTER_INIT_TTL
        );

        const registrationToken = generateRegisterInitJWT({
          jti: registrationJti,
          type: 'register-init',
        });

        return { registrationToken, registrationId } as RegistrationSession;
      } catch (error) {
        console.log('Error in OAuth registration:', error);
        throw new Error(`[${MODULE_NAME}] Failed to initialize OAuth register`);
      }
    },
  };
};
