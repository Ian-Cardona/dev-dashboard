import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.utils';
import { generateJWT, verifyJWT } from '../utils/jwt.utils';
import bcrypt from 'bcryptjs';
import {
  AuthenticationLoginRequestPublicSchema,
  AuthenticationRefreshRequestPrivateSchema,
  AuthenticationRefreshResponsePrivateSchema,
  AuthenticationRegisterRequestPublicSchema,
  AuthenticationSuccessResponsePrivateSchema,
  AuthorizationTokenPayload,
} from '../../../shared/types/auth.type';
import { IUserService } from './user.service';
import { IRefreshTokenService } from './refreshToken.service';
import {
  RefreshToken,
  RefreshTokenRecordAndPlain,
} from '../../../shared/types/refreshToken.type';
import { UserResponsePublic } from '../../../shared/types/user.type';

export interface IAuthenticationService {
  register(
    user: AuthenticationRegisterRequestPublicSchema
  ): Promise<AuthenticationSuccessResponsePrivateSchema>;
  login(
    validatedData: AuthenticationLoginRequestPublicSchema
  ): Promise<AuthenticationSuccessResponsePrivateSchema>;
  refreshAccessToken(
    validatedData: AuthenticationRefreshRequestPrivateSchema
  ): Promise<AuthenticationRefreshResponsePrivateSchema>;
  logout(refreshTokenId: string): Promise<void>;
  verifyAccessToken(token: string): Promise<UserResponsePublic>;
}

// TODO: Create test suite
export const AuthenticationService = (
  userService: IUserService,
  refreshTokenService: IRefreshTokenService
): IAuthenticationService => {
  const _safelyTombstoneToken = async (token: RefreshToken): Promise<void> => {
    try {
      await refreshTokenService.tombstoneToken(token);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (tombstoneError) {
      const currentToken = await refreshTokenService.findById(
        token.refreshTokenId
      );

      if (currentToken && currentToken.revoked) {
        throw new UnauthorizedError(
          'Refresh token already used. Please login again.'
        );
      }

      throw new Error('Failed to process refresh token');
    }
  };
  return {
    async register(
      user: AuthenticationRegisterRequestPublicSchema
    ): Promise<AuthenticationSuccessResponsePrivateSchema> {
      try {
        const emailAlreadyExists = await userService.emailExists(user.email);

        if (emailAlreadyExists) {
          throw new ConflictError('User already exists');
        }

        const newUser: UserResponsePublic = await userService.create({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
        });

        const accessTokenPayload: AuthorizationTokenPayload = {
          userId: newUser.userId,
          email: newUser.email,
          isActive: newUser.isActive,
        };
        const newAccessToken = generateJWT(accessTokenPayload);

        const newRefreshToken: RefreshTokenRecordAndPlain =
          await refreshTokenService.create(newUser.userId);

        return {
          accessToken: newAccessToken,
          refreshTokenId: newRefreshToken.refreshToken.refreshTokenId,
          refreshTokenPlain: newRefreshToken.refreshTokenPlain,
          user: newUser,
        };
      } catch (error) {
        if (error instanceof ConflictError) {
          throw error;
        }

        throw new Error('Registration failed due to internal error');
      }
    },

    async login(
      validatedData: AuthenticationLoginRequestPublicSchema
    ): Promise<AuthenticationSuccessResponsePrivateSchema> {
      try {
        const user = await userService.findByEmailForAuth(validatedData.email);

        if (!user) {
          throw new UnauthorizedError('Invalid email or password');
        }

        const passwordMatches = await bcrypt.compare(
          validatedData.password,
          user.passwordHash
        );

        if (!passwordMatches) {
          throw new UnauthorizedError('Invalid email or password');
        }
        if (!user.isActive) {
          throw new UnauthorizedError('User account is inactive');
        }

        const accessTokenPayload: AuthorizationTokenPayload = {
          userId: user.userId,
          email: user.email,
          isActive: user.isActive,
        };
        const newAccessToken = generateJWT(accessTokenPayload);

        const newRefreshToken = await refreshTokenService.create(user.userId);

        const responseUser: UserResponsePublic = {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
        };

        return {
          accessToken: newAccessToken,
          refreshTokenId: newRefreshToken.refreshToken.refreshTokenId,
          refreshTokenPlain: newRefreshToken.refreshTokenPlain,
          user: responseUser,
        };
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }

        throw new Error('Login failed due to internal error');
      }
    },

    async refreshAccessToken(
      validatedData: AuthenticationRefreshRequestPrivateSchema
    ): Promise<AuthenticationRefreshResponsePrivateSchema> {
      try {
        const matchedToken = await refreshTokenService.findByIdAndMatch(
          validatedData.refreshTokenId,
          validatedData.refreshTokenPlain
        );
        if (!matchedToken) {
          throw new UnauthorizedError('Invalid session. Please login again.');
        }
        if (
          matchedToken.revoked ||
          Date.now() > new Date(matchedToken.expiresAt).getTime()
        ) {
          await refreshTokenService.deleteAllUserTokens(matchedToken.userId);
          throw new UnauthorizedError('Invalid session. Please login again.');
        }
        await _safelyTombstoneToken(matchedToken);
        const user = await userService.findById(matchedToken.userId);
        if (!user) {
          await refreshTokenService.deleteAllUserTokens(matchedToken.userId);
          throw new UnauthorizedError('Invalid user account.');
        }
        const newAccessTokenPayload: AuthorizationTokenPayload = {
          userId: user.userId,
          email: user.email,
          isActive: user.isActive,
        };
        const newAccessToken = generateJWT(newAccessTokenPayload);
        const newRefreshToken = await refreshTokenService.create(user.userId);

        return {
          accessToken: newAccessToken,
          refreshTokenId: newRefreshToken.refreshToken.refreshTokenId,
          refreshTokenPlain: newRefreshToken.refreshTokenPlain,
        };
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }

        throw new Error('Failed to process refresh token.');
      }
    },

    // async refreshAccessToken(
    //   validatedData: AuthenticationRefreshRequestPrivateSchema
    // ): Promise<AuthenticationRefreshResponsePrivateSchema> {
    //   try {
    //     const matchedToken = await refreshTokenService.findByIdAndMatch(
    //       validatedData.refreshTokenId,
    //       validatedData.refreshTokenPlain
    //     );

    //     if (!matchedToken) {
    //       logger.warn(
    //         'Potential session hijacking attempt - no matching token',
    //         {
    //           refreshTokenId: validatedData.refreshTokenId,
    //         }
    //       );
    //       throw new UnauthorizedError('Invalid session. Please login again.');
    //     }

    //     if (
    //       matchedToken.revoked ||
    //       Date.now() > new Date(matchedToken.expiresAt).getTime()
    //     ) {
    //       logger.warn(
    //         'Potential session hijacking attempt - token invalid state',
    //         {
    //           refreshTokenId: validatedData.refreshTokenId,
    //         }
    //       );
    //       await refreshTokenService.deleteAllUserTokens(matchedToken.userId);
    //       throw new UnauthorizedError('Invalid session. Please login again.');
    //     }

    //     try {
    //       await refreshTokenService.tombstoneToken(matchedToken);
    //     } catch (tombstoneErr) {
    //       const currentToken = await refreshTokenService.findById(
    //         matchedToken.refreshTokenId
    //       );

    //       if (currentToken && currentToken.revoked) {
    //         logger.warn('Duplicate refresh detected — token already revoked', {
    //           userId: matchedToken.userId,
    //           refreshTokenId: matchedToken.refreshTokenId,
    //         });

    //         // await refreshTokenService.deleteAllUserTokens(matchedToken.userId);
    //         throw new UnauthorizedError(
    //           'Refresh token already used. Please login again.'
    //         );
    //       }

    //       logger.error('Failed to tombstone refresh token.', {
    //         error:
    //           tombstoneErr instanceof Error
    //             ? tombstoneErr.message
    //             : tombstoneErr,
    //         userId: matchedToken.userId,
    //         refreshTokenId: matchedToken.refreshTokenId,
    //       });

    //       throw new DatabaseError('Failed to process refresh token');
    //     }

    //     const user = await userService.findById(matchedToken.userId);

    //     if (!user) {
    //       await refreshTokenService.deleteAllUserTokens(matchedToken.userId);
    //       throw new UnauthorizedError('Invalid user account.');
    //     }

    //     const newAccessTokenPayload: AuthorizationTokenPayload = {
    //       userId: user.userId,
    //       email: user.email,
    //       isActive: user.isActive,
    //     };
    //     const newAccessToken = generateJWT(newAccessTokenPayload);

    //     const newRefreshToken = await refreshTokenService.create(user.userId);

    //     return {
    //       accessToken: newAccessToken,
    //       refreshTokenId: newRefreshToken.refreshToken.refreshTokenId,
    //       refreshTokenPlain: newRefreshToken.refreshTokenPlain,
    //     };
    //   } catch (error) {
    //     if (error instanceof UnauthorizedError) {
    //       throw new UnauthorizedError('Invalid session. Please login again.');
    //     }
    //     logger.error('Refresh token processing error', {
    //       error: error instanceof Error ? error.message : 'Unknown error',
    //       refreshTokenId: validatedData.refreshTokenId,
    //     });
    //     throw new DatabaseError('Failed to process refresh token');
    //   }
    // },

    async logout(refreshTokenId: string): Promise<void> {
      try {
        const token = await refreshTokenService.findById(refreshTokenId);
        if (token) {
          await refreshTokenService.tombstoneToken(token);
        }
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new Error('Failed to logout');
      }
    },

    async verifyAccessToken(token: string): Promise<UserResponsePublic> {
      let decodedToken: AuthorizationTokenPayload;

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
