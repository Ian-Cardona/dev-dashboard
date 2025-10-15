import { ENV } from '../../config/env_variables';
import { IAuthenticationController } from './interfaces/iauthentication.controller';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import {
  AuthenticationEmailRegisterRequest,
  AuthenticationLoginRequestPublic,
  AuthenticationOAuthRegisterRequest,
  AuthenticationRefreshRequestPrivate,
  AuthenticationResponsePublic,
  AuthorizationJwt,
  RegisterInitOAuthRegisterRequest,
  authenticationEmailRegisterRequestSchema,
  authenticationLoginRequestPublicSchema,
  authenticationOAuthRegisterRequestSchema,
  authenticationRefreshRequestPrivateSchema,
  registerInitOAuthRegisterRequestSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { redisClient } from 'src/config/redis';
import { handleValidationError } from 'src/utils/validation-error.utils';

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const AuthenticationController = (
  authService: IAuthenticationService
): IAuthenticationController => {
  return {
    async registerUserByEmail(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: AuthenticationEmailRegisterRequest =
          authenticationEmailRegisterRequestSchema.parse(req.onboardingData);
        const result = await authService.registerByEmail(validatedData);

        res.cookie('rt1', result.refreshTokenPlain, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: ENV.NODE_ENV === 'development' ? '/' : '/api/auth/refresh',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.cookie('rt2', result.refreshTokenId, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        const response: AuthenticationResponsePublic = {
          accessToken: result.accessToken,
          user: result.user,
        };

        await redisClient.del(`register-init:${req.registerInit?.jti}`);

        res.status(201).json(response);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },

    async registerUserByOAuth(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: AuthenticationOAuthRegisterRequest =
          authenticationOAuthRegisterRequestSchema.parse(req.body);
        const result = await authService.registerByOAuth(validatedData);

        res.cookie('rt1', result.refreshTokenPlain, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: ENV.NODE_ENV === 'development' ? '/' : '/api/auth/refresh',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.cookie('rt2', result.refreshTokenId, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        const response: AuthenticationResponsePublic = {
          accessToken: result.accessToken,
          user: result.user,
        };

        await redisClient.del(`register-init:${req.registerInit?.jti}`);

        res.status(201).json(response);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },

    async loginUserByEmail(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: AuthenticationLoginRequestPublic =
          authenticationLoginRequestPublicSchema.parse(req.body);
        const result = await authService.loginByEmail(validatedData);

        res.cookie('rt1', result.refreshTokenPlain, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: ENV.NODE_ENV === 'development' ? '/' : '/api/auth/refresh',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.cookie('rt2', result.refreshTokenId, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        const response: AuthenticationResponsePublic = {
          accessToken: result.accessToken,
          user: result.user,
        };

        res.status(200).json(response);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid login data');
      }
    },

    async loginUserByOAuth(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: RegisterInitOAuthRegisterRequest =
          registerInitOAuthRegisterRequestSchema.parse(req.body);
        const result = await authService.loginByOAuth(validatedData);

        res.cookie('rt1', result.refreshTokenPlain, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: ENV.NODE_ENV === 'development' ? '/' : '/api/auth/refresh',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.cookie('rt2', result.refreshTokenId, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        const response: AuthenticationResponsePublic = {
          accessToken: result.accessToken,
          user: result.user,
        };

        res.status(200).json(response);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid login data');
      }
    },

    async refreshAccessToken(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const refreshTokenIdAndRefreshToken: AuthenticationRefreshRequestPrivate =
          {
            refreshTokenId: req.cookies.rt2,
            refreshTokenPlain: req.cookies.rt1,
          };

        const validatedData: AuthenticationRefreshRequestPrivate =
          authenticationRefreshRequestPrivateSchema.parse(
            refreshTokenIdAndRefreshToken
          );

        const result = await authService.refreshAccessToken(validatedData);

        res.cookie('rt1', result.refreshTokenPlain, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: ENV.NODE_ENV === 'development' ? '/' : '/api/auth/refresh',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        res.cookie('rt2', result.refreshTokenId, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        const response: AuthorizationJwt = {
          accessToken: result.accessToken,
        };

        res.status(200).json(response);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid refresh token data');
      }
    },

    async logoutUser(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const refreshTokenId: string = req.cookies.rt2;

        await authService.logout(refreshTokenId);
        res.status(200).json({ message: 'Logout successful' });
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid logout data');
      }
    },

    async verifyAccessToken(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const accessToken: string =
          req.headers.authorization?.split(' ')[1] || '';

        await authService.verifyAccessToken(accessToken);
        res.status(200).json({ message: 'Token is valid' });
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid token');
      }
    },
  };
};
