import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';
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
        const result = await userService.create({
          ...validatedData,
          userId: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        });
        res.status(201).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user data');
      }
    },

    async findUserById(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        const result = await userService.findById(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async findUserByEmail(req: Request, res: Response, next: NextFunction) {
      try {
        const email = z.email().parse(req.params.email);
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
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async updateLastLogin(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        const timestamp = z.string().parse(req.body.timestamp);
        await userService.updateLastLogin(userId, timestamp);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async updatePassword(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = validateId(req.params.userId);
        const passwordHash = z.string().parse(req.body.passwordHash);
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
