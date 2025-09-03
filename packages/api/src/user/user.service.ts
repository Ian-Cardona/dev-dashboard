import { IUserModel } from './user.model';
import { ConflictError, NotFoundError } from '../utils/errors.utils';
import { generateUUID } from '../utils/uuid.utils';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env_variables';
import {
  User,
  UserResponsePublic,
  AuthenticationRegisterRequestPublicSchema,
} from '@dev-dashboard/shared';

export interface IUserService {
  create(
    user: AuthenticationRegisterRequestPublicSchema
  ): Promise<UserResponsePublic>;
  findById(userId: string): Promise<UserResponsePublic>;
  findByEmailPrivate(email: string): Promise<User>;
  findByEmailPublic(email: string): Promise<UserResponsePublic>;
  emailExists(email: string): Promise<boolean>;
  update(
    userId: string,
    updates: Partial<Omit<User, 'userId' | 'email' | 'createdAt'>>
  ): Promise<UserResponsePublic>;
  delete(userId: string): Promise<void>;
  updateLastLogin(
    userId: string,
    timestamp: string
  ): Promise<UserResponsePublic>;
  updatePassword(
    userId: string,
    passwordHash: string
  ): Promise<UserResponsePublic>;
  deactivate(userId: string): Promise<UserResponsePublic>;
}

export const UserService = (userModel: IUserModel): IUserService => {
  return {
    async create(
      user: AuthenticationRegisterRequestPublicSchema
    ): Promise<UserResponsePublic> {
      try {
        const { password, ...userWithoutPassword } = user;

        const salt = await bcrypt.genSalt(Number(ENV.BCRYPT_SALT_ROUNDS_PW));
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await userModel.create({
          id: generateUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          ...userWithoutPassword,
          passwordHash: hashedPassword,
          role: 'user',
        });

        // TODO: Fix the schemas to avoid manual object manipulation like this
        const responseUser: UserResponsePublic = {
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          isActive: result.isActive,
        };

        return responseUser;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('ConditionalCheckFailedException')
        ) {
          throw new ConflictError('User already exists');
        }
        throw new Error('Failed to create user');
      }
    },

    async findById(userId: string): Promise<UserResponsePublic> {
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
        throw new Error('Could not find the user');
      }
    },

    async findByEmailPrivate(email: string): Promise<User> {
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
        throw new Error('Could not find the user');
      }
    },

    async findByEmailPublic(email: string): Promise<UserResponsePublic> {
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
        throw new Error('Could not find the user');
      }
    },

    async emailExists(email: string): Promise<boolean> {
      try {
        console.log('Email exists?', email);
        const user = await userModel.findByEmail(email);
        return user !== null;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Could not check email existence');
      }
    },

    async update(
      userId: string,
      updates: Partial<
        Omit<User, 'userId' | 'email' | 'createdAt' | 'passwordHash'>
      >
    ): Promise<UserResponsePublic> {
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
          throw new NotFoundError(`User not found`);
        }
        throw new Error('Could not update the user');
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
          throw new NotFoundError(`User not found`);
        }
        throw new Error('Could not update the user password');
      }
    },

    async deactivate(userId: string): Promise<UserResponsePublic> {
      try {
        const result = await userModel.deactivate(userId);

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
