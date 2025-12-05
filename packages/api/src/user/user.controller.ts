import { IUserController } from './interfaces/iuser.controller';
import { IUserService } from './interfaces/iuser.service';
import {
  updateUserSchema,
  userPasswordUpdateSchema,
  uuidSchema,
} from '@dev-dashboard/shared';
import { NextFunction, Request, Response } from 'express';
import { ConflictError } from 'src/utils/errors.utils';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const UserController = (userService: IUserService): IUserController => {
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
        const updates = updateUserSchema.parse(req.body);
        const result = await userService.update(userId, updates);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User update failed');
      }
    },

    async updateUserPassword(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const validatedData = userPasswordUpdateSchema.parse(req.body);

        if (typeof validatedData.newPassword !== 'string') {
          throw new ConflictError('Invalid Password');
        }

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

    async findProvidersByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await userService.findProvidersByUserId(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User lookup failed');
      }
    },
  };
};
