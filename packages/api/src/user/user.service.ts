// import { ENV } from '../config/env_variables';
import { ConflictError, NotFoundError } from '../utils/errors.utils';
import { generateUUID } from '../utils/uuid.utils';
import { IUserRepository } from './interfaces/iuser.repository';
import { IUserService } from './interfaces/iuser.service';
import {
  AuthenticationEmailRegisterRequest,
  AuthenticationOAuthRegisterRequest,
  User,
  UserResponsePublic,
  UserUpdate,
} from '@dev-dashboard/shared';
import { isBcryptHash } from 'src/utils/bcrypt.utils';

// import bcrypt from 'bcryptjs';

const MODULE_NAME = 'UserService';

export const UserService = (userRepository: IUserRepository): IUserService => {
  return {
    async createByEmail(
      user: AuthenticationEmailRegisterRequest
    ): Promise<UserResponsePublic> {
      try {
        // const saltRounds = Number(ENV.BCRYPT_SALT_ROUNDS_PW);
        // if (!saltRounds || isNaN(saltRounds)) {
        //   throw new Error(
        //     `[${MODULE_NAME}] Invalid bcrypt salt rounds configuration`
        //   );
        // }
        // const salt = await bcrypt.genSalt(saltRounds);
        // const hashedPassword = await bcrypt.hash(user.passwordHash, salt);

        if (!isBcryptHash(user.passwordHash)) {
          throw new Error(`[${MODULE_NAME}] Invalid bcrypt hash provided`);
        }

        const now = new Date().toISOString();

        const result = await userRepository.createByEmail({
          id: generateUUID(),
          createdAt: now,
          updatedAt: now,
          isActive: true,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          passwordHash: user.passwordHash,
          role: 'user',
          providers: [],
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;

        return responseUser as UserResponsePublic;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new ConflictError(
            `[${MODULE_NAME}] User with this email may already exist or creation failed`
          );
        }
        throw new Error(`[${MODULE_NAME}] Failed to create user`);
      }
    },

    async createByOAuth(
      user: AuthenticationOAuthRegisterRequest
    ): Promise<UserResponsePublic> {
      try {
        const now = new Date().toISOString();

        const result = await userRepository.createByOAuth({
          id: generateUUID(),
          createdAt: now,
          updatedAt: now,
          isActive: true,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: 'user',
          providers: user.providers,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser as UserResponsePublic;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new ConflictError(
            `[${MODULE_NAME}] User with this provider may already exist or creation failed`
          );
        }
        throw new Error(`[${MODULE_NAME}] Failed to create OAuth user`);
      }
    },

    async findById(userId: string): Promise<UserResponsePublic> {
      try {
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new NotFoundError('User not found');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = user;
        return responseUser;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new Error('Could not find the user');
      }
    },

    async findByEmailPrivate(email: string): Promise<User> {
      try {
        const user = await userRepository.findByEmail(email);

        if (!user) {
          throw new NotFoundError('User not found');
        }

        return user;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new Error('Could not find the user');
      }
    },

    async findByEmailPublic(email: string): Promise<UserResponsePublic> {
      try {
        const user = await userRepository.findByEmail(email);

        if (!user) {
          throw new NotFoundError('User not found');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = user;
        return responseUser;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new Error('Could not find the user');
      }
    },

    async emailExists(email: string): Promise<boolean> {
      try {
        const user = await userRepository.findByEmail(email);
        return !!user;
      } catch {
        throw new Error(`[${MODULE_NAME}] Failed to check email existence`);
      }
    },

    async findByProvider(
      provider: string,
      providerUserId: string
    ): Promise<UserResponsePublic> {
      try {
        const user = await userRepository.findByProvider(
          provider,
          providerUserId
        );
        if (!user) {
          throw new NotFoundError('User not found');
        }

        return user;
      } catch {
        throw new Error(`[${MODULE_NAME}] Failed to check provider existence`);
      }
    },

    async update(
      userId: string,
      updates: UserUpdate
    ): Promise<UserResponsePublic> {
      try {
        const result = await userRepository.update(userId, updates);

        if (!result) {
          throw new NotFoundError('User not found');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`User not found`);
        }
        throw new Error('Could not update the user');
      }
    },

    async delete(userId: string): Promise<void> {
      try {
        await userRepository.delete(userId);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`User not found`);
        }
        throw new Error('Could not delete the user');
      }
    },

    async updateLastLogin(
      userId: string,
      timestamp: string
    ): Promise<UserResponsePublic> {
      try {
        const result = await userRepository.updateLastLogin(userId, timestamp);

        if (!result) {
          throw new NotFoundError('User not found');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`User not found`);
        }
        throw new Error('Could not update the user last login');
      }
    },

    async updatePassword(
      userId: string,
      newPasswordHash: string
    ): Promise<UserResponsePublic> {
      try {
        const result = await userRepository.updatePassword(
          userId,
          newPasswordHash
        );

        if (!result) {
          throw new NotFoundError('User not found');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`User not found`);
        }
        throw new Error('Could not update the user password');
      }
    },

    async deactivate(userId: string): Promise<UserResponsePublic> {
      try {
        const result = await userRepository.deactivate(userId);

        if (!result) {
          throw new NotFoundError('User not found');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`User not found`);
        }
        throw new Error('Could not deactivate the user');
      }
    },
  };
};
