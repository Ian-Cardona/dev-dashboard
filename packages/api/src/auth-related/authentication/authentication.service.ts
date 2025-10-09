import { generateAccessJWT, verifyJWT } from '../../utils/jwt.utils';
import { IRefreshTokenService } from '../refresh-token/refresh-token.service';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import {
  AuthenticationLoginRequestPublicSchema,
  AuthenticationRefreshRequestPrivateSchema,
  AuthenticationRefreshResponsePrivateSchema,
  AuthenticationSuccessResponsePrivateSchema,
  UserResponsePublic,
  RefreshTokenRecordAndPlain,
  RefreshToken,
  AuthenticationEmailRegisterRequestSchema,
  AccessTokenPayload,
  AuthenticationOAuthRegisterRequestSchema,
} from '@dev-dashboard/shared';
import { IUserService } from 'src/user/interfaces/iuser.service';
import { bcryptCompare } from 'src/utils/bcrypt.utils';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from 'src/utils/errors.utils';

export const AuthenticationService = (
  userService: IUserService,
  refreshTokenService: IRefreshTokenService
): IAuthenticationService => {
  const _tombstoneToken = async (token: RefreshToken): Promise<void> => {
    try {
      await refreshTokenService.tombstone(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (tombstoneError) {
      const currentToken = await refreshTokenService.findById(token.id);

      if (currentToken && currentToken.revoked) {
        throw new UnauthorizedError(
          'Refresh token already used. Please login again.'
        );
      }

      throw new Error('Failed to process refresh token');
    }
  };

  return {
    async registerByEmail(
      data: AuthenticationEmailRegisterRequestSchema
    ): Promise<AuthenticationSuccessResponsePrivateSchema> {
      try {
        const emailAlreadyExists = await userService.emailExists(data.email);
        if (emailAlreadyExists) {
          throw new ConflictError('User already exists');
        }

        const user: UserResponsePublic = await userService.createByEmail(data);

        const accessTokenPayload: AccessTokenPayload = {
          userId: user.id,
          email: user.email!,
          isActive: user.isActive,
          type: 'access',
        };
        const accessToken = generateAccessJWT(accessTokenPayload);

        const refreshToken: RefreshTokenRecordAndPlain =
          await refreshTokenService.create(user.id);

        return {
          accessToken,
          refreshTokenId: refreshToken.record.id,
          refreshTokenPlain: refreshToken.plain,
          user: user,
        };
      } catch (error) {
        if (error instanceof ConflictError) {
          throw error;
        }
        throw new Error('Registration failed due to internal error');
      }
    },

    async registerByOAuth(
      data: AuthenticationOAuthRegisterRequestSchema
    ): Promise<AuthenticationSuccessResponsePrivateSchema> {
      try {
        const emailAlreadyExists = await userService.emailExists(data.email);
        if (emailAlreadyExists) {
          throw new ConflictError('User already exists');
        }

        const user: UserResponsePublic = await userService.createByOAuth(data);

        const accessTokenPayload: AccessTokenPayload = {
          userId: user.id,
          email: user.email!,
          isActive: user.isActive,
          type: 'access',
        };
        const accessToken = generateAccessJWT(accessTokenPayload);

        const refreshToken: RefreshTokenRecordAndPlain =
          await refreshTokenService.create(user.id);

        return {
          accessToken,
          refreshTokenId: refreshToken.record.id,
          refreshTokenPlain: refreshToken.plain,
          user: user,
        };
      } catch (error) {
        if (error instanceof ConflictError) {
          throw error;
        }
        throw new Error('Registration failed due to internal error');
      }
    },

    async login(
      data: AuthenticationLoginRequestPublicSchema
    ): Promise<AuthenticationSuccessResponsePrivateSchema> {
      try {
        const user = await userService.findByEmailPrivate(data.email);

        if (!user) {
          throw new UnauthorizedError('Invalid email or password');
        }

        const passwordMatches = await bcryptCompare(
          data.password,
          user.passwordHash!
        );

        if (!passwordMatches) {
          throw new UnauthorizedError('Invalid email or password');
        }
        if (!user.isActive) {
          throw new UnauthorizedError('User account is inactive');
        }

        const accessTokenPayload: AccessTokenPayload = {
          userId: user.id,
          email: user.email!,
          isActive: user.isActive,
          type: 'access',
        };
        const newAccessToken = generateAccessJWT(accessTokenPayload);

        const newRefreshToken = await refreshTokenService.create(user.id);

        const responseUser: UserResponsePublic = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
          onboardingComplete: user.onboardingComplete,
        };

        return {
          accessToken: newAccessToken,
          refreshTokenId: newRefreshToken.record.id,
          refreshTokenPlain: newRefreshToken.plain,
          user: responseUser,
        };
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }

        throw new Error('Login failed due to internal error');
      }
    },

    async logout(refreshTokenId: string): Promise<void> {
      try {
        const token = await refreshTokenService.findById(refreshTokenId);
        if (token) {
          await refreshTokenService.tombstone(token);
        }
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new Error('Failed to logout');
      }
    },

    async refreshAccessToken(
      data: AuthenticationRefreshRequestPrivateSchema
    ): Promise<AuthenticationRefreshResponsePrivateSchema> {
      try {
        const matchedToken = await refreshTokenService.findByIdAndMatch(
          data.refreshTokenId,
          data.refreshTokenPlain
        );

        if (!matchedToken) {
          throw new UnauthorizedError('Invalid session. Please login again.');
        }
        if (
          matchedToken.revoked ||
          Date.now() > new Date(matchedToken.expiresAt).getTime()
        ) {
          await refreshTokenService.deleteAllByUserId(matchedToken.userId);
          throw new UnauthorizedError('Invalid session. Please login again.');
        }

        await _tombstoneToken(matchedToken);

        const user = await userService.findById(matchedToken.userId);
        if (!user) {
          await refreshTokenService.deleteAllByUserId(matchedToken.userId);
          throw new UnauthorizedError('Invalid user account.');
        }
        const newAccessTokenPayload: AccessTokenPayload = {
          userId: user.id,
          email: user.email!,
          isActive: user.isActive,
          type: 'access',
        };
        const newAccessToken = generateAccessJWT(newAccessTokenPayload);
        const newRefreshToken = await refreshTokenService.create(user.id);

        return {
          accessToken: newAccessToken,
          refreshTokenId: newRefreshToken.record.id,
          refreshTokenPlain: newRefreshToken.plain,
        };
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }

        throw new Error('Failed to process refresh token.');
      }
    },

    async verifyAccessToken(token: string): Promise<UserResponsePublic> {
      let decodedToken: AccessTokenPayload;

      try {
        decodedToken = verifyJWT(token);
      } catch {
        throw new UnauthorizedError('Invalid or expired access token');
      }

      if (!decodedToken?.userId) {
        throw new UnauthorizedError('Invalid token payload');
      }

      const user = await userService.findById(decodedToken.userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return user;
    },
  };
};
