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
  AuthenticationRefreshService,
  AuthenticationRegisterRequest,
  AuthenticationSuccessService,
  AuthorizationTokenPayload,
} from '../../../shared/types/auth.type';
import { IUserService } from './user.service';
import { IRefreshTokenService } from './refreshToken.service';
import { RefreshTokenRecordAndPlain } from '../../../shared/types/refreshToken.type';

// TODO: Refactor user flow to return refresh details instead of just the token
export interface IAuthenticationService {
  register(
    user: AuthenticationRegisterRequest
  ): Promise<AuthenticationSuccessService>;
  login(
    validatedData: AuthenticationLoginRequest
  ): Promise<AuthenticationSuccessService>;
  refreshAccessToken(
    validatedData: AuthenticationRefreshRequest
  ): Promise<AuthenticationRefreshService>;
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
    ): Promise<AuthenticationSuccessService> {
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
    ): Promise<AuthenticationSuccessService> {
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

        const responseUser: ResponseUser = {
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
    ): Promise<AuthenticationRefreshService> {
      try {
        const matchedToken = await refreshTokenService.findByIdAndMatch(
          validatedData.refreshTokenId,
          validatedData.refreshTokenPlain
        );

        if (!matchedToken) {
          logger.warn(
            'Potential session hijacking attempt - no matching token',
            {
              refreshTokenId: validatedData.refreshTokenId,
            }
          );
          throw new UnauthorizedError('Invalid session. Please login again.');
        }

        if (
          matchedToken.revoked ||
          Date.now() > new Date(matchedToken.expiresAt).getTime()
        ) {
          logger.warn(
            'Potential session hijacking attempt - token invalid state',
            {
              refreshTokenId: validatedData.refreshTokenId,
            }
          );
          await refreshTokenService.deleteAllUserTokens(matchedToken.userId);
          throw new UnauthorizedError('Invalid session. Please login again.');
        }

        try {
          await refreshTokenService.tombstoneToken(matchedToken);
        } catch (tombstoneErr) {
          try {
            const currentToken = await refreshTokenService.findById(
              matchedToken.refreshTokenId
            );
            if (currentToken && currentToken.revoked) {
              logger.warn(
                'Duplicate refresh detected — token already tombstoned',
                {
                  userId: matchedToken.userId,
                  refreshTokenId: matchedToken.refreshTokenId,
                }
              );

              await refreshTokenService.deleteAllUserTokens(
                matchedToken.userId
              );
              throw new UnauthorizedError(
                'Refresh token already used. Please login again.'
              );
            }

            logger.error('Failed to tombstone refresh token.', {
              error:
                tombstoneErr instanceof Error
                  ? tombstoneErr.message
                  : tombstoneErr,
              userId: matchedToken.userId,
              refreshTokenId: matchedToken.refreshTokenId,
            });
            throw new DatabaseError('Failed to process refresh token');
          } catch (verifyErr) {
            logger.error(
              'Error verifying token status after tombstone failure',
              {
                error:
                  verifyErr instanceof Error ? verifyErr.message : verifyErr,
                userId: matchedToken.userId,
                refreshTokenId: matchedToken.refreshTokenId,
              }
            );
            throw new DatabaseError('Failed to process refresh token');
          }
        }

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
        logger.error('Refresh token processing error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          refreshTokenId: validatedData.refreshTokenId,
        });
        throw new DatabaseError('Failed to process refresh token');
      }
    },

    // async refreshAccessToken(
    //   validatedData: AuthenticationRefreshRequest
    // ): Promise<AuthenticationRefreshService> {
    //   try {
    //     const matchedToken = await refreshTokenService.findByUserAndMatch(
    //       validatedData.userId,
    //       validatedData.refreshToken
    //     );

    //     if (
    //       !matchedToken ||
    //       matchedToken.revoked ||
    //       Date.now() > new Date(matchedToken.expiresAt).getTime()
    //     ) {
    //       logger.warn('Potential session hijacking attempt', {
    //         userId: validatedData.userId,
    //         refreshToken: validatedData.refreshToken,
    //       });
    //       await refreshTokenService.deleteAllUserTokens(validatedData.userId);
    //       throw new UnauthorizedError('Invalid session. Please login again.');
    //     }

    //     await refreshTokenService.tombstoneToken(matchedToken);

    //     const user = await userService.findById(matchedToken.userId);
    //     if (!user) {
    //       throw new UnauthorizedError('Invalid user account.');
    //     }

    //     const newAccessTokenPayload: AuthorizationTokenPayload = {
    //       userId: user.userId,
    //       email: user.email,
    //     };
    //     const newAccessToken = generateJWT(newAccessTokenPayload);

    //     const newRefreshToken = await refreshTokenService.create(user.userId);

    //     return {
    //       accessToken: newAccessToken,
    //       refreshToken: newRefreshToken.refreshToken,
    //     };
    //   } catch (error) {
    //     if (error instanceof UnauthorizedError) {
    //       throw error;
    //     }
    //     logger.error('Refresh token processing error', {
    //       error: error instanceof Error ? error.message : 'Unknown error',
    //       userId: validatedData.userId,
    //       refreshToken: validatedData.refreshToken,
    //     });
    //     throw new DatabaseError('Failed to process refresh token');
    //   }
    // },

    async logout(validatedData: AuthenticationRefreshRequest): Promise<void> {
      try {
        const matchedToken = await refreshTokenService.findByIdAndMatch(
          validatedData.refreshTokenId,
          validatedData.refreshTokenPlain
        );
        if (!matchedToken) throw new NotFoundError('Refresh token not found');

        await refreshTokenService.tombstoneToken(matchedToken);
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        logger.error('Failed to tombstone refresh token', {
          error: error instanceof Error ? error.message : 'Unknown error',
          refreshTokenId: validatedData.refreshTokenId,
          refreshTokenPlain: validatedData.refreshTokenPlain,
        });
        throw new DatabaseError('Failed to tombstone refresh token');
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
