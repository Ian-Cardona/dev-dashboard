import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services/user.service';
import {
  passwordUpdateSchema,
  userIdSchema,
  userUpdateSchema,
} from '../../../shared/schemas/user.schema';
import z from 'zod';

export interface IUserController {
  getUserProfile: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  updateUserAccount: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  updateUserPassword: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  deactivateUserAccount: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}

export const UserController = (userService: IUserService) => {
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
    async getUserProfile(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = userIdSchema.parse(req.user?.userId);
        const result = await userService.findById(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User lookup failed');
      }
    },

    async updateUserAccount(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = userIdSchema.parse(req.user?.userId);
        const updates = userUpdateSchema.parse(req.body);
        const result = await userService.update(userId, updates);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User update failed');
      }
    },

    async updateUserPassword(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = userIdSchema.parse(req.user?.userId);
        const validatedData = passwordUpdateSchema.parse(req.body);

        await userService.updatePassword(userId, validatedData.newPassword);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Password update failed');
      }
    },

    async deactivateUserAccount(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = userIdSchema.parse(req.user?.userId);
        await userService.deactivateUser(userId);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'User deactivation failed');
      }
    },
  };
};
