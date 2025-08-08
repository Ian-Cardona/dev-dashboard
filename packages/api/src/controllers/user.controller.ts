import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services/user.service';
import {
  userCreateValidation,
  userUpdateValidation,
} from '../validations/user.validation';
import z from 'zod';

export const UserController = (userService: IUserService) => {
  const validateId = (id: string) => z.uuidv4().parse(id);

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
        handleValidationError(error, res, next, 'Invalid user data');
      }
    },

    async getUserById(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        const result = await userService.findById(userId);
        res.json(result); // Service already handles NotFoundError
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID');
      }
    },

    async getUserByEmail(req: Request, res: Response, next: NextFunction) {
      try {
        const email = z.email().parse(req.query.email);
        const result = await userService.findByEmail(email);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid email format');
      }
    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        const updates = userUpdateValidation.parse(req.body);
        const result = await userService.update(userId, updates);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user data');
      }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        await userService.delete(userId);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID');
      }
    },

    async updateLastLogin(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        const { lastLogin } = z
          .object({
            lastLogin: z.iso.datetime(),
          })
          .parse(req.body);

        const result = await userService.updateLastLogin(userId, lastLogin);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid date format');
      }
    },

    async updatePassword(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        const updates = userUpdateValidation
          .pick({ passwordHash: true })
          .parse(req.body);

        if (!updates.passwordHash) {
          throw new Error('Missing passwordHash');
        }

        const passwordHash = updates.passwordHash;

        await userService.updatePassword(userId, passwordHash);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async deactivateUser(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        await userService.deactivateUser(userId);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },
  };
};
