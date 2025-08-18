import { logger } from '../middlewares/logger.middleware';
import { ResponseUser } from '../../../shared/types/user.type';
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.utils';
import { generateJWT, verifyJWT } from '../utils/jwt.utils';
import bcrypt from 'bcryptjs';
import {
  AuthenticationLoginRequest,
  AuthenticationRefreshRequest,
  AuthenticationRefreshResponse,
  AuthenticationRegisterRequest,
  AuthenticationSuccessResponse,
  AuthorizationTokenPayload,
} from '../../../shared/types/auth.type';
import { IUserService } from './user.service';
import { IRefreshTokenService } from './refreshToken.service';

export interface IAuthenticationService {
  register(
    user: AuthenticationRegisterRequest
  ): Promise<AuthenticationSuccessResponse>;
  login(
    validatedData: AuthenticationLoginRequest
  ): Promise<AuthenticationSuccessResponse>;
  refreshAccessToken(
    validatedData: AuthenticationRefreshRequest
  ): Promise<AuthenticationRefreshResponse>;
  logout(validatedData: AuthenticationRefreshRequest): Promise<void>;
  verifyAccessToken(token: string): Promise<ResponseUser>;
}

// TODO: Create test suite for this
export const AuthenticationService = (
  userService: IUserService,
  refreshTokenService: IRefreshTokenService
): IAuthenticationService => {
  return {
    async register(
      user: AuthenticationRegisterRequest
    ): Promise<AuthenticationSuccessResponse> {
      try {
        const emailAlreadyExists = await userService.emailExists(user.email);

        if (emailAlreadyExists) {
          throw new ConflictError('User already exists');
        }

        const newUser: ResponseUser = await userService.create({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
        });

        const accessTokenPayload: AuthorizationTokenPayload = {
          userId: newUser.userId,
          email: newUser.email,
        };
        const newAccessToken = generateJWT(accessTokenPayload);

        const newRefreshToken = await refreshTokenService.create(
          newUser.userId
        );

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken.refreshToken,
          user: newUser,
        };
      } catch (error) {
        const safeError =
          error instanceof ConflictError
            ? error
            : new DatabaseError('Registration failed due to internal error');

        logger.error('User registration error', {
          error: safeError.message,
          stack: safeError.stack,
          email: user.email,
        });

        throw safeError;
      }
    },

    async login(
      validatedData: AuthenticationLoginRequest
    ): Promise<AuthenticationSuccessResponse> {
      try {
        const user = await userService.findByEmailForAuth(validatedData.email);

        if (!user) {
          throw new UnauthorizedError('Invalid email or password');
        }

        console.log('validatedData.password', validatedData.password);
        console.log('user.passwordHash', user.passwordHash);

        const passwordMatches = await bcrypt.compare(
          validatedData.password,
          user.passwordHash
        );

        console.log('passwordMatches', passwordMatches);

        if (!passwordMatches) {
          throw new UnauthorizedError('Invalid email or password');
        }
        if (!user.isActive) {
          throw new UnauthorizedError('User account is inactive');
        }

        const accessTokenPayload: AuthorizationTokenPayload = {
          userId: user.userId,
          email: user.email,
        };
        const newAccessToken = generateJWT(accessTokenPayload);

        const newRefreshToken = await refreshTokenService.create(user.userId);

        const responseUser: ResponseUser = {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
        };

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken.refreshToken,
          user: responseUser,
        };
      } catch (error) {
        const safeError =
          error instanceof UnauthorizedError
            ? error
            : new UnauthorizedError('Invalid email or password');

        logger.warn('User login failed', {
          error: safeError.message,
          email: validatedData.email,
        });

        throw safeError;
      }
    },

    async refreshAccessToken(
      validatedData: AuthenticationRefreshRequest
    ): Promise<AuthenticationRefreshResponse> {
      try {
        const matchedToken = await refreshTokenService.findByUserAndMatch(
          validatedData.userId,
          validatedData.refreshToken
        );

        if (
          !matchedToken ||
          matchedToken.revoked ||
          Date.now() > new Date(matchedToken.expiresAt).getTime()
        ) {
          logger.warn('Potential session hijacking attempt', {
            userId: validatedData.userId,
            refreshToken: validatedData.refreshToken,
          });
          await refreshTokenService.deleteAllUserTokens(validatedData.userId);
          throw new UnauthorizedError('Invalid session. Please login again.');
        }

        await refreshTokenService.deleteToken(
          validatedData.userId,
          matchedToken.refreshTokenId
        );

        const user = await userService.findById(matchedToken.userId);
        if (!user) {
          throw new UnauthorizedError('Invalid user account.');
        }

        const newAccessTokenPayload: AuthorizationTokenPayload = {
          userId: user.userId,
          email: user.email,
        };
        const newAccessToken = generateJWT(newAccessTokenPayload);

        const newRefreshToken = await refreshTokenService.create(user.userId);

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken.refreshToken,
        };
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }
        logger.error('Refresh token processing error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: validatedData.userId,
          refreshToken: validatedData.refreshToken,
        });
        throw new DatabaseError('Failed to process refresh token');
      }
    },

    async logout(validatedData: AuthenticationRefreshRequest): Promise<void> {
      try {
        const matchedToken = await refreshTokenService.findByUserAndMatch(
          validatedData.userId,
          validatedData.refreshToken
        );
        if (!matchedToken) throw new NotFoundError('Refresh token not found');
        await refreshTokenService.deleteToken(
          validatedData.userId,
          matchedToken.refreshTokenId
        );
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        logger.error('Failed to delete refresh token', {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: validatedData.userId,
          refreshToken: validatedData.refreshToken,
        });
        throw new DatabaseError('Failed to delete refresh token');
      }
    },

    async verifyAccessToken(token: string): Promise<ResponseUser> {
      let decodedToken: AuthorizationTokenPayload;

      try {
        decodedToken = verifyJWT(token);
      } catch {
        logger.warn('Invalid or expired JWT');
        throw new UnauthorizedError('Invalid or expired access token');
      }

      if (!decodedToken?.userId) {
        logger.warn('JWT payload missing required userId');
        throw new UnauthorizedError('Invalid token payload');
      }

      const user = await userService.findById(decodedToken.userId);

      if (!user) {
        logger.warn(`User not found for ID ${decodedToken.userId}`);
        throw new UnauthorizedError('User not found');
      }

      return user;
    },
  };
};
