import { IAuthenticationController } from './interfaces/iauthentication.controller';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import {
  AuthorizationJwt,
  CompleteRegisterByEmailRequest,
  completeRegisterByEmailRequestSchema,
  CompleteRegisterByOAuthRequest,
  completeRegisterByOAuthRequestSchema,
  LoginPublic,
  LoginRequestPublic,
  loginRequestPublicSchema,
  OAuthRequest,
  oauthRequestSchema,
  RefreshRequestPrivate,
  refreshRequestPrivateSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { ENV } from 'src/config/env';
import { redisClient } from 'src/config/redis';
import { handleValidationError } from 'src/utils/validation-error.utils';

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const AuthenticationController = (
  authService: IAuthenticationService
): IAuthenticationController => {
  return {
    async completeRegisterUserByEmail(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: CompleteRegisterByEmailRequest =
          completeRegisterByEmailRequestSchema.parse(req.onboardingData);
        const result = await authService.completeRegisterByEmail(validatedData);

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

        const response: LoginPublic = {
          accessToken: result.accessToken,
          user: result.user,
        };

        await redisClient.del(`register-init:${req.registerInit?.jti}`);

        res.status(201).json(response);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },

    async completeRegisterUserByOAuth(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: CompleteRegisterByOAuthRequest =
          completeRegisterByOAuthRequestSchema.parse(req.onboardingData);
        const result = await authService.completeRegisterByOAuth(validatedData);

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

        const response: LoginPublic = {
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
        const validatedData: LoginRequestPublic =
          loginRequestPublicSchema.parse(req.body);
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

        const response: LoginPublic = {
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
        const validatedData: OAuthRequest = oauthRequestSchema.parse(req.body);
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

        const response: LoginPublic = {
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
        const refreshTokenIdAndRefreshToken: RefreshRequestPrivate = {
          refreshTokenId: req.cookies.rt2,
          refreshTokenPlain: req.cookies.rt1,
        };

        const validatedData: RefreshRequestPrivate =
          refreshRequestPrivateSchema.parse(refreshTokenIdAndRefreshToken);

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
