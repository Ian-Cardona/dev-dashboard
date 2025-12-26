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
import { setCrossDomainCookie } from 'src/utils/api.utils';
import { redisDel } from 'src/utils/redis';
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

        setCrossDomainCookie(res, 'rt1', result.refreshTokenPlain, {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        setCrossDomainCookie(res, 'rt2', result.refreshTokenId, {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        const response: LoginPublic = {
          accessToken: result.accessToken,
          user: result.user,
        };

        await redisDel(`register-init:${req.registerInit?.jti}`);

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

        setCrossDomainCookie(res, 'rt1', result.refreshTokenPlain, {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        setCrossDomainCookie(res, 'rt2', result.refreshTokenId, {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        const response: LoginPublic = {
          accessToken: result.accessToken,
          user: result.user,
        };

        await redisDel(`register-init:${req.registerInit?.jti}`);

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

        setCrossDomainCookie(res, 'rt1', result.refreshTokenPlain, {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        setCrossDomainCookie(res, 'rt2', result.refreshTokenId, {
          httpOnly: true,
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

        setCrossDomainCookie(res, 'rt1', result.refreshTokenPlain, {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        setCrossDomainCookie(res, 'rt2', result.refreshTokenId, {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY,
        });
        const response: LoginPublic = {
          accessToken: result.accessToken,
          user: result.user,
        };

        console.table(response);

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

        setCrossDomainCookie(res, 'rt1', result.refreshTokenPlain, {
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRY,
        });

        setCrossDomainCookie(res, 'rt2', result.refreshTokenId, {
          httpOnly: true,
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
