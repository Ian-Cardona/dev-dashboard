import { logger } from '../middlewares/logger.middleware';
import { IRefreshTokenModel } from '../models/refreshToken.model';
import { IUserModel } from '../models/user.model';
import { ResponseUser } from '../types/user.type';
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.utils';
import { generateJWT, verifyJWT } from '../utils/jwt.utils';
import bcrypt from 'bcryptjs';
import { generateSecureRefreshToken, generateUUID } from '../utils/uuid.utils';
import { ENV } from '../config/env_variables';
import { AuthRefreshResponse, AuthSuccessResponse } from '../types/auth.type';

export interface IAuthService {
  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthSuccessResponse>;
  login(email: string, password: string): Promise<AuthSuccessResponse>;
  refreshAccessToken(
    userId: string,
    refreshTokenId: string
  ): Promise<AuthRefreshResponse>;
  logout(userId: string, refreshToken: string): Promise<void>;
  verifyAccessToken(token: string): Promise<ResponseUser>;
}

export const AuthService = (
  userModel: IUserModel,
  refreshTokenModel: IRefreshTokenModel
): IAuthService => {
  return {
    async register(
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ): Promise<AuthSuccessResponse> {
      try {
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
          throw new ConflictError('User already exists');
        }

        const saltPassword = await bcrypt.genSalt(
          Number(ENV.BCRYPT_SALT_ROUNDS_PW)
        );
        const hashedPassword = await bcrypt.hash(password, saltPassword);

        const newUser = await userModel.create({
          userId: generateUUID(),
          email,
          passwordHash: hashedPassword,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          emailVerified: false,
          firstName,
          lastName,
        });

        const accessTokenPayload = {
          userId: newUser.userId,
          email: newUser.email,
        };
        const accessToken = generateJWT(accessTokenPayload);

        const refreshTokenId = generateUUID();

        const saltRefreshToken = await bcrypt.genSalt(
          Number(ENV.BCRYPT_SALT_ROUNDS_RT)
        );
        const refreshToken = generateSecureRefreshToken();
        const refreshTokenHash = await bcrypt.hash(
          refreshToken,
          saltRefreshToken
        );

        const refreshTokenExpiry = new Date();

        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

        await refreshTokenModel.create({
          userId: newUser.userId,
          refreshTokenId,
          refreshTokenHash,
          expiresAt: refreshTokenExpiry.toISOString(),
          createdAt: new Date().toISOString(),
          revoked: false,
        });

        const responseUser: ResponseUser = {
          userId: newUser.userId,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isActive: newUser.isActive,
          emailVerified: newUser.emailVerified,
        };

        return {
          accessToken,
          refreshToken,
          user: responseUser,
        };
      } catch (error) {
        const safeError =
          error instanceof ConflictError
            ? error
            : new DatabaseError('Registration failed due to internal error');

        logger.error('User registration error', {
          error: safeError.message,
          stack: safeError.stack,
          email,
          firstName,
          lastName,
        });

        throw safeError;
      }
    },

    async login(email: string, password: string): Promise<AuthSuccessResponse> {
      try {
        const user = await userModel.findByEmail(email);

        if (!user) {
          throw new UnauthorizedError('Invalid email or password');
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatches) {
          throw new UnauthorizedError('Invalid email or password');
        }

        if (!user.isActive) {
          throw new UnauthorizedError('User account is inactive');
        }

        const accessTokenPayload = {
          userId: user.userId,
          email: user.email,
        };
        const accessToken = generateJWT(accessTokenPayload);

        const refreshTokenId = generateUUID();

        const refreshToken = generateSecureRefreshToken();
        const saltRefreshToken = await bcrypt.genSalt(
          Number(ENV.BCRYPT_SALT_ROUNDS_RT)
        );
        const refreshTokenHash = await bcrypt.hash(
          refreshToken,
          saltRefreshToken
        );

        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

        await refreshTokenModel.create({
          userId: user.userId,
          refreshTokenId,
          refreshTokenHash,
          expiresAt: refreshTokenExpiry.toISOString(),
          createdAt: new Date().toISOString(),
          revoked: false,
        });

        const responseUser: ResponseUser = {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
        };

        return {
          accessToken,
          refreshToken,
          user: responseUser,
        };
      } catch (error) {
        const safeError =
          error instanceof UnauthorizedError
            ? error
            : new UnauthorizedError('Invalid email or password');

        logger.warn('User login failed', {
          error: safeError.message,
          email,
        });

        throw safeError;
      }
    },

    async refreshAccessToken(
      userId: string,
      providedRefreshToken: string
    ): Promise<AuthRefreshResponse> {
      try {
        const storedToken = await refreshTokenModel.findByUserAndToken(
          userId,
          providedRefreshToken
        );
        if (!storedToken) {
          throw new UnauthorizedError('Invalid session. Please login again.');
        }

        let matchedTokenRecord = null;
        for (const record of storedToken.refreshTokenHash) {
          const isMatch = await bcrypt.compare(providedRefreshToken, record);
          if (isMatch) {
            matchedTokenRecord = record;
            break;
          }
        }

        if (
          !matchedTokenRecord ||
          storedToken.revoked ||
          new Date() > new Date(storedToken.expiresAt)
        ) {
          logger.warn('Potential session hijacking attempt', {
            error: 'Invalid session. Please login again.',
            userId,
          });
          await refreshTokenModel.deleteAllUserTokens(userId);
          throw new UnauthorizedError('Invalid session. Please login again.');
        }

        await refreshTokenModel.deleteToken(userId, storedToken.refreshTokenId);

        const user = await userModel.findById(storedToken.userId);
        if (!user) {
          throw new UnauthorizedError('Invalid user account.');
        }

        const accessToken = generateJWT({
          userId: user.userId,
          email: user.email,
        });
        const newRefreshToken = generateSecureRefreshToken();
        const saltRefreshToken = await bcrypt.genSalt(
          Number(ENV.BCRYPT_SALT_ROUNDS_RT)
        );
        const newRefreshTokenHash = await bcrypt.hash(
          newRefreshToken,
          saltRefreshToken
        );

        const newRefreshTokenExpiry = new Date();

        newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7);

        await refreshTokenModel.create({
          userId: user.userId,
          refreshTokenId: generateUUID(),
          refreshTokenHash: newRefreshTokenHash,
          expiresAt: newRefreshTokenExpiry.toISOString(),
          createdAt: new Date().toISOString(),
          revoked: false,
        });

        return { accessToken, refreshToken: newRefreshToken };
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }
        logger.error('Refresh token processing error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Failed to process refresh token');
      }
    },

    async logout(userId: string, refreshToken: string): Promise<void> {
      try {
        await refreshTokenModel.deleteToken(userId, refreshToken);
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        logger.error('Failed to delete refresh token', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId,
        });
        throw new DatabaseError('Failed to delete refresh token');
      }
    },

    async verifyAccessToken(token: string): Promise<ResponseUser> {
      try {
        const decodedToken = verifyJWT(token);
        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
          throw new UnauthorizedError('User not found');
        }
        return user;
      } catch (error) {
        logger.warn('Access token verification failure', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw new UnauthorizedError('Invalid or expired access token');
      }
    },
  };
};
