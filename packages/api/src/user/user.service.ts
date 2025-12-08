import {
  CompleteRegisterByEmailRequest,
  CompleteRegisterByOAuthRequest,
  User,
  UserPublic,
  UpdateUser,
  GithubProvider,
  UserPasswordUpdate,
} from '@dev-dashboard/shared';
import { ENV } from 'src/config/env';
import { IUserRepository } from 'src/user/interfaces/iuser.repository';
import { IUserService } from 'src/user/interfaces/iuser.service';
import { bcryptCompare, bcryptGen, isBcryptHash } from 'src/utils/bcrypt.utils';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from 'src/utils/errors.utils';
import { generateUUID } from 'src/utils/uuid.utils';

const MODULE_NAME = 'UserService';

export const UserService = (userRepository: IUserRepository): IUserService => {
  return {
    async createByEmail(
      user: CompleteRegisterByEmailRequest
    ): Promise<UserPublic> {
      try {
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

        return responseUser as UserPublic;
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
      user: CompleteRegisterByOAuthRequest
    ): Promise<UserPublic> {
      try {
        const now = new Date().toISOString();

        const result = await userRepository.createByOAuth(
          {
            id: generateUUID(),
            createdAt: now,
            updatedAt: now,
            isActive: true,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: 'user',
            providers: user.providers,
          },
          user.accessTokenEncrypted
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser as UserPublic;
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

    async findById(userId: string): Promise<UserPublic> {
      try {
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = user;
        return responseUser;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new Error(`[${MODULE_NAME}] Could not find the user`);
      }
    },

    async findByEmailPrivate(email: string): Promise<User> {
      try {
        const user = await userRepository.findByEmail(email);

        if (!user) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        return user;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new Error(`[${MODULE_NAME}] Could not find the user`);
      }
    },

    async findByEmailPublic(email: string): Promise<UserPublic> {
      try {
        const user = await userRepository.findByEmail(email);

        if (!user) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = user;
        return responseUser;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new Error(`[${MODULE_NAME}] Could not find the user`);
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
    ): Promise<UserPublic> {
      try {
        const user = await userRepository.findByProvider(
          provider,
          providerUserId
        );
        if (!user) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        return user;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new Error(`[${MODULE_NAME}] Failed to check provider existence`);
      }
    },

    async findProviderByUserId(
      userId: string,
      provider: string
    ): Promise<GithubProvider> {
      try {
        const providerData = await userRepository.findProviderByUserId(
          userId,
          provider
        );
        if (!providerData) {
          throw new NotFoundError(`[${MODULE_NAME}] Provider not found`);
        }
        return providerData;
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new Error(`[${MODULE_NAME}] Failed to find provider by user ID`);
      }
    },

    async findProvidersByUserId(userId: string): Promise<GithubProvider[]> {
      try {
        const providers = await userRepository.findProvidersByUserId(userId);
        return providers;
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new Error(`[${MODULE_NAME}] Failed to find providers by user ID`);
      }
    },

    async linkProvider(user: User, providerAccessToken: string): Promise<User> {
      try {
        const updatedUser = await userRepository.linkProvider(
          user,
          providerAccessToken
        );
        return updatedUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'TransactionCanceledException'
        ) {
          throw new ConflictError(`[${MODULE_NAME}] Failed to link provider`);
        }
        throw new Error(`[${MODULE_NAME}] Failed to link provider`);
      }
    },

    async unlinkProvider(userId: string, provider: string): Promise<void> {
      try {
        await userRepository.unlinkProvider(userId, provider);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'TransactionCanceledException'
        ) {
          throw new ConflictError(`[${MODULE_NAME}] Failed to unlink provider`);
        }
        throw new Error(`[${MODULE_NAME}] Failed to unlink provider`);
      }
    },

    async updateProvider(updates: GithubProvider): Promise<void> {
      try {
        await userRepository.updateProvider(updates);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`[${MODULE_NAME}] Provider not found`);
        }
        throw new Error(`[${MODULE_NAME}] Failed to update provider`);
      }
    },

    async update(userId: string, updates: UpdateUser): Promise<UserPublic> {
      try {
        const result = await userRepository.update(userId, updates);

        if (!result) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }
        throw new Error(`[${MODULE_NAME}] Could not update the user`);
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
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }
        throw new Error(`[${MODULE_NAME}] Could not delete the user`);
      }
    },

    async updateLastLogin(
      userId: string,
      timestamp: string
    ): Promise<UserPublic> {
      try {
        const result = await userRepository.updateLastLogin(userId, timestamp);

        if (!result) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }
        throw new Error(
          `[${MODULE_NAME}] Could not update the user last login`
        );
      }
    },

    async updatePassword(
      userId: string,
      data: UserPasswordUpdate
    ): Promise<UserPublic> {
      try {
        const user = await userRepository.findById(userId);

        if (!user) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        if (!user.passwordHash) {
          throw new ConflictError(
            `[${MODULE_NAME}] User does not have a current password to update`
          );
        }

        const passwordMatches = await bcryptCompare(
          data.currentPassword,
          user.passwordHash
        );

        if (!passwordMatches) {
          throw new UnauthorizedError(
            `[${MODULE_NAME}] Invalid email or password`
          );
        }

        if (!user.isActive) {
          throw new UnauthorizedError(
            `[${MODULE_NAME}] User account is inactive`
          );
        }

        const saltRounds = Number(ENV.BCRYPT_SALT_ROUNDS_PW);
        if (!saltRounds || isNaN(saltRounds)) {
          throw new Error(
            `[${MODULE_NAME}] Invalid bcrypt salt rounds configuration`
          );
        }

        const newPasswordHash = await bcryptGen(data.newPassword, saltRounds);

        const result = await userRepository.updatePassword(
          userId,
          newPasswordHash
        );

        if (!result) {
          throw new NotFoundError(
            `[${MODULE_NAME}] User not found during update`
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof ConflictError ||
          error instanceof UnauthorizedError
        ) {
          throw error;
        }

        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        throw new Error(`[${MODULE_NAME}] Could not update the user password`);
      }
    },

    async deactivate(userId: string): Promise<UserPublic> {
      try {
        const result = await userRepository.deactivate(userId);

        if (!result) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`[${MODULE_NAME}] User not found`);
        }
        throw new Error(`[${MODULE_NAME}] Could not deactivate the user`);
      }
    },
  };
};
