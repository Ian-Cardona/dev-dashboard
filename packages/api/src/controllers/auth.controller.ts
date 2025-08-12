import { NextFunction, Request, Response } from 'express';
import { IAuthService } from '../services/auth.service';
import z from 'zod';
import {
  authLoginRequestValidation,
  authRefreshRequestValidation,
  authRegisterRequestValidation,
} from '../validations/auth.validation';

export const AuthController = (authService: IAuthService) => {
  const handleValidationError = (
    error: unknown,
    res: Response,
    next: NextFunction,
    message: string
  ) => {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: message,
        details: error.issues,
      });
    }
    next(error);
  };

  return {
    async registerUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = authRegisterRequestValidation.parse(req.body);
        const result = await authService.register(
          validatedData.email,
          validatedData.password,
          validatedData.firstName || '',
          validatedData.lastName || ''
        );
        res.status(201).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },

    async loginUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = authLoginRequestValidation.parse(req.body);
        const result = await authService.login(
          validatedData.email,
          validatedData.password
        );
        res.status(200).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid login data');
      }
    },

    async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = authRefreshRequestValidation.parse(req.body);
        const result = await authService.refreshAccessToken(
          validatedData.userId,
          validatedData.refreshToken
        );
        res.status(200).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid refresh token data');
      }
    },

    async logoutUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = authRefreshRequestValidation.parse(req.body);
        await authService.logout(
          validatedData.userId,
          validatedData.refreshToken
        );
        res.status(200).json({ message: 'Logout successful' });
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid logout data');
      }
    },
  };
};
