import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import {
  AuthenticationLoginRequestPublicSchema,
  AuthenticationRefreshRequestPrivateSchema,
  AuthenticationRegisterRequestPublicSchema,
  AuthenticationResponsePublicSchema,
  AuthorizationJwtSchema,
  authenticationLoginRequestPublicSchema,
  authenticationRefreshRequestPrivateSchema,
  authenticationRegisterRequestPublicSchema,
} from '@dev-dashboard/shared';
import { IAuthenticationService } from './authentication.service';
import { ENV } from '../../config/env_variables';

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export interface IAuthenticationController {
  registerUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  loginUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  refreshAccessToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  logoutUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  verifyAccessToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}

export const AuthenticationController = (
  authService: IAuthenticationService
) => {
  const handleValidationError = (
    error: unknown,
    res: Response,
    next: NextFunction,
    message: string
  ) => {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: message,
      });
    }
    next(error);
  };

  return {
    async registerUser(req: Request, res: Response, next: NextFunction) {
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

    async loginUser(req: Request, res: Response, next: NextFunction) {
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

    async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
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

    async logoutUser(req: Request, res: Response, next: NextFunction) {
      try {
        const refreshTokenId: string = req.cookies.rt2;

        await authService.logout(refreshTokenId);
        res.status(200).json({ message: 'Logout successful' });
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid logout data');
      }
    },

    async verifyAccessToken(req: Request, res: Response, next: NextFunction) {
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
