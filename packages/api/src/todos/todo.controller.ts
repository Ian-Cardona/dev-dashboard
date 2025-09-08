import z from 'zod';
import { NextFunction, Request, Response } from 'express';
import { ITodoService } from './todo.service';
import {
  createResolutionRequestSchema,
  rawTodoBatchSchema,
  uuidSchema,
  VALIDATION_CONSTANTS,
} from '@dev-dashboard/shared';
import { handleValidationError } from 'src/utils/validation-error.utils';

export const TodoController = (todoService: ITodoService) => {
  return {
    async createBatch(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const rawBatch = rawTodoBatchSchema.parse(req.body);

        const result = await todoService.create(userId, rawBatch);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid input format');
      }
    },

    async findByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async findByUserIdAndSyncId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const syncId = uuidSchema.parse(req.params.syncId);

        const result = await todoService.findByUserIdAndSyncId(userId, syncId);

        res.json(result);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid User ID or Sync ID format'
        );
      }
    },

    async findLatestByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findLatestByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async findRecentByUserId(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findRecentByUserId(userId);

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async findProjectsByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findProjectsByUserId(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async findByUserIdAndProjectName(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const projectName = z
          .string()
          .min(1)
          .max(VALIDATION_CONSTANTS.TODO.PROJECT_NAME.MAX_LENGTH)
          .parse(req.params.projectName);

        const result = await todoService.findByUserIdAndProject(
          userId,
          projectName
        );

        res.json(result);
      } catch (error) {
        handleValidationError(
          error,
          res,
          next,
          'Invalid User ID format or project name format'
        );
      }
    },

    async compareLatestBatches(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const projectName = z
          .string()
          .min(1)
          .max(VALIDATION_CONSTANTS.TODO.PROJECT_NAME.MAX_LENGTH)
          .parse(req.params.projectName);

        const result = await todoService.compareLatestBatches(
          userId,
          projectName
        );

        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async findPendingResolutionsByUserId(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const result = await todoService.findPendingResolutionsByUserId(userId);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid User ID format');
      }
    },

    async createResolution(req: Request, res: Response, next: NextFunction) {
      try {
        const userId = uuidSchema.parse(req.user?.userId);
        const resolution = createResolutionRequestSchema.parse(req.body);

        const result = await todoService.createResolution(userId, resolution);
        res.json(result);
      } catch (error) {
        handleValidationError(error, res, next, 'Invalid resolution format');
      }
    },
  };
};
