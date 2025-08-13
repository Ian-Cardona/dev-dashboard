import { logger } from '../middlewares/logger.middleware';
import { IUserModel } from '../models/user.model';
import { ResponseUser, User } from '../types/user.type';
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
} from '../utils/errors.utils';
import { generateUUID } from '../utils/uuid.utils';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env_variables';
import { AuthRegisterRequest } from '../types/auth.type';

export interface IUserService {
  create(user: AuthRegisterRequest): Promise<ResponseUser>;
  findById(userId: string): Promise<ResponseUser>;
  findByEmailForAuth(email: string): Promise<User>;
  findByEmailForPublic(email: string): Promise<ResponseUser>;
  update(
    userId: string,
    updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
  ): Promise<ResponseUser>;
  delete(userId: string): Promise<void>;
  updateLastLogin(userId: string, timestamp: string): Promise<ResponseUser>;
  updatePassword(userId: string, passwordHash: string): Promise<ResponseUser>;
  deactivateUser(userId: string): Promise<ResponseUser>;
}

export const UserService = (userModel: IUserModel): IUserService => {
  return {
    async create(user: AuthRegisterRequest): Promise<ResponseUser> {
      try {
        const { password, ...userWithoutPassword } = user;

        const saltPassword = await bcrypt.genSalt(
          Number(ENV.BCRYPT_SALT_ROUNDS_PW)
        );
        const hashedPassword = await bcrypt.hash(password, saltPassword);

        const result = await userModel.create({
          userId: generateUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          ...userWithoutPassword,
          passwordHash: hashedPassword,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;
        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new ConflictError('User already exists');
        }
        logger.error('User creation failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          email: user.email,
        });
        throw new DatabaseError('Failed to create user');
      }
    },

    async findById(userId: string): Promise<ResponseUser> {
      try {
        const user = await userModel.findById(userId);

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
        logger.error('User lookup failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Could not find the user');
      }
    },

    async findByEmailForAuth(email: string): Promise<User> {
      try {
        const user = await userModel.findByEmail(email);

        if (!user) {
          throw new NotFoundError('User not found');
        }

        return user;
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        logger.error('User lookup by email failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          email,
        });
        throw new DatabaseError('Could not find the user');
      }
    },

    async findByEmailForPublic(email: string): Promise<ResponseUser> {
      try {
        const user = await userModel.findByEmail(email);

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
        logger.error('User lookup by email failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          email,
        });
        throw new DatabaseError('Could not find the user');
      }
    },

    async update(
      userId: string,
      updates: Partial<
        Omit<User, 'userId' | 'email' | 'createdAt' | 'passwordHash'>
      >
    ): Promise<ResponseUser> {
      try {
        const result = await userModel.update(userId, updates);

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
          throw new NotFoundError(`User ${userId} not found`);
        }
        logger.error('User update failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Could not update the user');
      }
    },

    async delete(userId: string): Promise<void> {
      try {
        await userModel.delete(userId);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new NotFoundError(`User ${userId} not found`);
        }
        logger.error('User deletion failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Could not delete the user');
      }
    },

    async updateLastLogin(
      userId: string,
      timestamp: string
    ): Promise<ResponseUser> {
      try {
        const result = await userModel.updateLastLogin(userId, timestamp);

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
          throw new NotFoundError(`User ${userId} not found`);
        }
        logger.error('Last login update failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Could not update the user last login');
      }
    },

    async updatePassword(
      userId: string,
      newPasswordHash: string
    ): Promise<ResponseUser> {
      try {
        const result = await userModel.updatePassword(userId, newPasswordHash);

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
          throw new NotFoundError(`User ${userId} not found`);
        }
        logger.error('Password update failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Could not update the user password');
      }
    },

    async deactivateUser(userId: string): Promise<ResponseUser> {
      try {
        const result = await userModel.deactivateUser(userId);

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
          throw new NotFoundError(`User ${userId} not found`);
        }
        logger.error('User deactivation failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Could not deactivate the user');
      }
    },
  };
};
