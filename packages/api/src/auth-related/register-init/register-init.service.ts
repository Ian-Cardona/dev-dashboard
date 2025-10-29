import { IRegisterInitService } from './interfaces/iregister-init.service';
import {
  RegisterInitEmailRequest,
  OAuthRequest,
  RegistrationInitToken,
  RegistrationJti,
  RegistrationSession,
  UserPublic,
} from '@dev-dashboard/shared';
import bcrypt from 'bcryptjs';
import { RedisClientType } from 'redis';
import { ENV } from 'src/config/env';
import { IUserService } from 'src/user/interfaces/iuser.service';
import { encrypt } from 'src/utils/crypto.utils';
import { ConflictError, NotFoundError } from 'src/utils/errors.utils';
import { generateRegisterInitJWT } from 'src/utils/jwt.utils';
import { generateUUID } from 'src/utils/uuid.utils';

const REGISTER_INIT_TTL = 3600;
const REDIS_AUTH_PREFIX = 'register-init:';
const REDIS_EMAIL_PREFIX = 'onboarding:email:';

const MODULE_NAME = 'RegisterInitService';

export const RegisterInitService = (
  redisClient: RedisClientType,
  userService: IUserService
): IRegisterInitService => {
  return {
    async getEmailSession(sessionId: string): Promise<string | null> {
      try {
        const key = `${REDIS_EMAIL_PREFIX}${sessionId}`;
        const result = await redisClient.get(key);
        if (!result) return null;

        const data = JSON.parse(result);
        return data.email || null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
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

      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(data.password, salt);

      const registrationJti = generateUUID();
      const registrationId = generateUUID();

      const registrationJtiData: RegistrationJti = {
        registrationType: 'email',
        email: data.email,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      await redisClient.set(
        `${REDIS_AUTH_PREFIX}${registrationJti}`,
        JSON.stringify(registrationJtiData),
        { EX: REGISTER_INIT_TTL }
      );

      await redisClient.set(
        `${REDIS_EMAIL_PREFIX}${registrationId}`,
        JSON.stringify({ email: data.email, createdAt: Date.now() }),
        { EX: REGISTER_INIT_TTL }
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

    async github(data: OAuthRequest): Promise<RegistrationInitToken> {
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

        const registrationJtiData: RegistrationJti = {
          registrationType: 'oauth',
          provider: data.provider,
          providerUserId: data.id.toString(),
          providerUserLogin: data.login,
          providerAccessTokenEncrypted: encryptedAccessToken,
          createdAt: new Date().toISOString(),
        };

        await redisClient.set(
          `${REDIS_AUTH_PREFIX}${registrationJti}`,
          JSON.stringify(registrationJtiData),
          {
            EX: REGISTER_INIT_TTL,
          }
        );

        const registrationToken = generateRegisterInitJWT({
          jti: registrationJti,
          type: 'register-init',
        });

        return { registrationToken } as RegistrationInitToken;
      } catch (error) {
        console.log('Error in OAuth registration:', error);
        throw new Error(`[${MODULE_NAME}] Failed to initialize OAuth register`);
      }
    },
  };
};
