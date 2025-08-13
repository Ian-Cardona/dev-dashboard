import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services/user.service';
import {
  emailValidation,
  isoDateTimeValidation,
  passwordUpdateValidation,
  userCreateValidation,
  userIdValidation,
  userUpdateValidation,
} from '../validations/user.validation';
import z from 'zod';

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
    async createUser(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = userCreateValidation.parse(req.body);
        const result = await userService.create(validatedData);
        res.status(201).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User creation failed');
      }
    },

    async getUserById(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = userIdValidation.parse(req.params.userId);
        const result = await userService.findById(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User lookup failed');
      }
    },

    async getUserByEmail(req: Request, res: Response, next: NextFunction) {
      try {
        const email = emailValidation.parse(req.query.email);
        const result = await userService.findByEmailForPublic(email);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User lookup by email failed');
      }
    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = userIdValidation.parse(req.params.userId);
        const updates = userUpdateValidation.parse(req.body);
        const result = await userService.update(userId, updates);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'User update failed');
      }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = userIdValidation.parse(req.params.userId);
        await userService.delete(userId);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'User deletion failed');
      }
    },

    async updateLastLogin(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = userIdValidation.parse(req.params.userId);
        const lastLogin = isoDateTimeValidation.parse(req.body.lastLogin);

        const result = await userService.updateLastLogin(userId, lastLogin);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Last login update failed');
      }
    },

    // TODO: Either add the auth checking here or connect this to the auth controller
    async updatePassword(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = userIdValidation.parse(req.params.userId);
        const validatedData = passwordUpdateValidation.parse(req.body);

        await userService.updatePassword(userId, validatedData.newPassword);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Password update failed');
      }
    },

    // TODO: Either add the auth checking here or connect this to the auth controller
    async deactivateUser(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        await userService.deactivateUser(userId);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'User deactivation failed');
      }
    },
  };
};
