import { ENV } from '../../config/env_variables';
import { IAuthenticationController } from './interfaces/iauthentication.controller';
import { IAuthenticationService } from './interfaces/iauthentication.service';
import {
  AuthenticationLoginRequestPublicSchema,
  AuthenticationRefreshRequestPrivateSchema,
  AuthenticationRegisterIncompleteRequestPublicSchema,
  AuthenticationRegisterRequestPublicSchema,
  AuthenticationResponsePublicSchema,
  AuthorizationJwtSchema,
  authenticationLoginRequestPublicSchema,
  authenticationRefreshRequestPrivateSchema,
  authenticationRegisterIncompleteRequestPublicSchema,
  authenticationRegisterRequestPublicSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { handleValidationError } from 'src/utils/validation-error.utils';

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const AuthenticationController = (
  authService: IAuthenticationService
): IAuthenticationController => {
  return {
    async registerUserByEmailIncomplete(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const validatedData: AuthenticationRegisterIncompleteRequestPublicSchema =
          authenticationRegisterIncompleteRequestPublicSchema.parse(req.body);
        const result =
          await authService.registerByEmailIncomplete(validatedData);

        res.status(201).json(response);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },

    async registerUser(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: AuthenticationRegisterRequestPublicSchema =
          authenticationRegisterRequestPublicSchema.parse(req.body);
        const result = await authService.register(validatedData);

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

        const response: AuthenticationResponsePublicSchema = {
          accessToken: result.accessToken,
          user: result.user,
        };

        res.status(201).json(response);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },

    async loginUser(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const validatedData: AuthenticationLoginRequestPublicSchema =
          authenticationLoginRequestPublicSchema.parse(req.body);
        const result = await authService.login(validatedData);

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

        const response: AuthenticationResponsePublicSchema = {
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
        const refreshTokenIdAndRefreshToken: AuthenticationRefreshRequestPrivateSchema =
          {
            refreshTokenId: req.cookies.rt2,
            refreshTokenPlain: req.cookies.rt1,
          };

        const validatedData: AuthenticationRefreshRequestPrivateSchema =
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

        const response: AuthorizationJwtSchema = {
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
