import { NextFunction, Request, Response } from 'express';
import { IUserService } from './user.service';
import {
  passwordUpdateSchema,
  uuidSchema,
  userUpdateSchema,
} from '@dev-dashboard/shared';
import { handleValidationError } from 'src/utils/validation-error.utils';

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
  return {
    async getUserProfile(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await userService.findById(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User lookup failed');
      }
    },

    async updateUserAccount(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const updates = userUpdateSchema.parse(req.body);
        const result = await userService.update(userId, updates);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User update failed');
      }
    },

    async updateUserPassword(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
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
        const userId = uuidSchema.parse(req.user?.userId);
        await userService.deactivate(userId);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'User deactivation failed');
      }
    },
  };
};
