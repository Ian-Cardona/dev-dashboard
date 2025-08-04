import {
  ConditionalCheckFailedException,
  DynamoDBServiceException,
} from '@aws-sdk/client-dynamodb';
import { logger } from '../middlewares/logger.middleware';
import { IUserModel } from '../models/user.model';
import { User } from '../types/user.type';
import { DatabaseError } from '../utils/errors.utils';

export interface IUserService {
  create(user: User): Promise<User>;
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
  async function handleServiceCall<T>(
    fn: () => Promise<T>,
    context: object,
    errorMessage: string,
    errorClass = DatabaseError
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(errorMessage, {
          error: error.message,
          stack: error.stack,
          ...context,
        });
      }

      throw new errorClass(errorMessage);
    }
  }

  return {
    async create(user: User): Promise<User> {
      try {
        const result = await userModel.create(user);
        return result;
      } catch (error) {
        if (error instanceof ConditionalCheckFailedException) {
          throw new DatabaseError(`User ${user.userId} already exists`);
        }
        if (error instanceof DynamoDBServiceException) {
          logger.error('Database create failed', {
            error: error.message,
            userId: user.userId,
          });
          throw new DatabaseError('Failed to create user');
        }

        throw new DatabaseError('Unexpected creation error');
      }
    },

    async findById(userId: string): Promise<User | null> {
      return handleServiceCall(
        async () => await userModel.findById(userId),
        { userId },
        'Could not find the user.',
        DatabaseError
      );
    },

    async findByEmail(email: string): Promise<User | null> {
      return handleServiceCall(
        async () => await userModel.findByEmail(email),
        { email },
        'Could not find the user.',
        DatabaseError
      );
    },

    async update(
      userId: string,
      updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
    ): Promise<User> {
      return handleServiceCall(
        async () => await userModel.update(userId, updates),
        { userId, updates },
        'Could not update the user.',
        DatabaseError
      );
    },

    async delete(userId: string): Promise<void> {
      return handleServiceCall(
        async () => await userModel.delete(userId),
        { userId },
        'Could not delete the user.',
        DatabaseError
      );
    },

    async updateLastLogin(userId: string, timestamp: string): Promise<void> {
      return handleServiceCall(
        async () => await userModel.updateLastLogin(userId, timestamp),
        { userId, timestamp },
        'Could not update the user last login.',
        DatabaseError
      );
    },

    async updatePassword(userId: string, passwordHash: string): Promise<void> {
      return handleServiceCall(
        async () => await userModel.updatePassword(userId, passwordHash),
        { userId },
        'Could not update the user password.',
        DatabaseError
      );
    },

    async deactivateUser(userId: string): Promise<void> {
      return handleServiceCall(
        async () => await userModel.deactivateUser(userId),
        { userId },
        'Could not deactivate the user.',
        DatabaseError
      );
    },
  };
};
