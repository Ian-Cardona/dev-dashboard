import { NextFunction, Request, Response } from 'express';
import { IAuthenticationService } from '../services/authentication.service';
import z from 'zod';
import {
  authenticationLoginRequestSchema,
  authenticationRefreshRequestSchema,
  authenticationRegisterRequestSchema,
} from '../schema/auth.schema';
import {
  AuthenticationLoginRequest,
  AuthenticationRefreshRequest,
  AuthenticationRegisterRequest,
} from '../types/auth.type';

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
        details: error.issues,
      });
    }
    next(error);
  };

  return {
    async registerUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData: AuthenticationRegisterRequest =
          authenticationRegisterRequestSchema.parse(req.body);
        const result = await authService.register(validatedData);
        res.status(201).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid registration data');
      }
    },

    async loginUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData: AuthenticationLoginRequest =
          authenticationLoginRequestSchema.parse(req.body);
        const result = await authService.login(validatedData);
        res.status(200).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid login data');
      }
    },

    async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData: AuthenticationRefreshRequest =
          authenticationRefreshRequestSchema.parse(req.body);
        const result = await authService.refreshAccessToken(validatedData);
        res.status(200).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid refresh token data');
      }
    },

    async logoutUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData: AuthenticationRefreshRequest =
          authenticationRefreshRequestSchema.parse(req.body);
        await authService.logout(validatedData);
        res.status(200).json({ message: 'Logout successful' });
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid logout data');
      }
    },
  };
};
