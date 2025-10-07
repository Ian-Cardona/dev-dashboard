import { ENV } from '../config/env_variables';
import { ConflictError, NotFoundError } from '../utils/errors.utils';
import { generateUUID } from '../utils/uuid.utils';
import { IUserModel } from './interfaces/iuser.model';
import { IUserService } from './interfaces/iuser.service';
import {
  User,
  UserResponsePublic,
  AuthenticationRegisterRequestPublicSchema,
  UserUpdate,
} from '@dev-dashboard/shared';
import bcrypt from 'bcryptjs';

export const UserService = (userModel: IUserModel): IUserService => {
  return {
    async create(
      user: AuthenticationRegisterRequestPublicSchema
    ): Promise<UserResponsePublic> {
      try {
        if (
          !user.email ||
          !user.firstName ||
          !user.lastName ||
          !user.password
        ) {
          throw new Error('Incomplete user data provided for creation');
        }

        const salt = await bcrypt.genSalt(Number(ENV.BCRYPT_SALT_ROUNDS_PW));
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const now = new Date().toISOString();

        const result = await userModel.create({
          id: generateUUID(),
          createdAt: now,
          updatedAt: now,
          isActive: true,
          onboardingComplete: true,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          passwordHash: hashedPassword,
          role: 'user',
          providers: [],
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...responseUser } = result;

        const newUser: UserResponsePublic = responseUser;

        return newUser;
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
      updates: UserUpdate
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
