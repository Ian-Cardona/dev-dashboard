import { NextFunction, Request, Response } from 'express';
import {
  codeTaskCreateSchema,
  updateCodeTaskSchema,
} from '../schema/codetask.schema';
import { ICodeTaskService } from '../services/codetask.service';
import z from 'zod';

export const CodeTaskController = (codeTaskService: ICodeTaskService) => {
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
    async createCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        const validatedData = codeTaskCreateSchema.parse(req.body);
        const result = await codeTaskService.create(validatedData);
        res.status(201).json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid code task data');
      }
    },

    async findCodeTasksInfoByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        const result = await codeTaskService.findByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid user ID format');
      }
    },

    async updateCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        const id = z.uuidv4().parse(req.params.id);

        const updates = updateCodeTaskSchema.parse(req.body);
        await codeTaskService.update(id, userId, updates);
        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid code task data');
      }
    },

    async deleteCodeTask(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = z.uuidv4().parse(req.params.userId);
        const id = z.uuidv4().parse(req.params.id);

        await codeTaskService.delete(id, userId);

        res.status(204).end();
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid code task data');
      }
    },
  };
};
