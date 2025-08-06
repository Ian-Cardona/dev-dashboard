import { logger } from '../middlewares/logger.middleware';
import { IUserModel } from '../models/user.model';
import { User } from '../types/user.type';
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
} from '../utils/errors.utils';
import { generateUUID } from '../utils/uuid.utils';

export interface IUserService {
  create(
    user: Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'isActive'>
  ): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(
    userId: string,
    updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
  ): Promise<User>;
  delete(userId: string): Promise<void>;

  updateLastLogin(userId: string, timestamp: string): Promise<void>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  deactivateUser(userId: string): Promise<void>;
}

export const UserService = (userModel: IUserModel): IUserService => {
  const createUser = (
    user: Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'isActive'>
  ): User => ({
    ...user,
    userId: generateUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  });

  return {
    async create(
      user: Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'isActive'>
    ): Promise<User> {
      try {
        const result = createUser(user);
        return await userModel.create(result);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new ConflictError(`User ${user.email} already exists`);
        }
        logger.error('User creation failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          user,
        });
        throw new DatabaseError('Failed to create user');
      }
    },

    async findById(userId: string): Promise<User | null> {
      try {
        return await userModel.findById(userId);
      } catch (error) {
        logger.error('User lookup failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Could not find the user');
      }
    },

    async findByEmail(email: string): Promise<User | null> {
      try {
        return await userModel.findByEmail(email);
      } catch (error) {
        logger.error('User lookup by email failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          email,
        });
        throw new DatabaseError('Could not find the user');
      }
    },

    async update(
      userId: string,
      updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
    ): Promise<User> {
      try {
        return await userModel.update(userId, updates);
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
          // attribute_exists(userId) failed = user not found
          throw new NotFoundError(`User ${userId} not found`);
        }
        logger.error('User deletion failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Could not delete the user');
      }
    },

    async updateLastLogin(userId: string, timestamp: string): Promise<void> {
      try {
        await userModel.updateLastLogin(userId, timestamp);
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

    async updatePassword(userId: string, passwordHash: string): Promise<void> {
      try {
        await userModel.updatePassword(userId, passwordHash);
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

    async deactivateUser(userId: string): Promise<void> {
      try {
        await userModel.deactivateUser(userId);
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
